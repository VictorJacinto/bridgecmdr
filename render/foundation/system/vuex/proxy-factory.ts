import { camelCase, get, isNil } from "lodash";
import type { SetRequired } from "type-fest";
import type { ActionContext, Commit, Dispatch, GetterTree, Module } from "vuex";
import type {
    LocalAccessor,
    LocalAction,
    LocalFunction,
    LocalGetter,
    LocalMutation,
    LocalSetter,
    ProxyAccess,
    StoreModuleClass,
    StoreModuleInterface,
    WatchDescriptor,
    ProxyKind,
} from "./details";
import { ACCESSORS, ACTIONS, IS_PROXY, MUTATIONS, WATCHERS } from "./details";
import type { ModuleOptions, RegisterOptions } from "./options";
import { StoreModule } from "./store-modules";

type ResolvedRegisterOptions = Required<RegisterOptions>;

type CompleteModule<S, R> = SetRequired<Module<S, R>, "namespaced"|"state"|"getters"|"mutations"|"actions">;

class ModuleDefinition {
    // HACK: TypeScript doesn't allow symbols as arbitrary indexers.
    fields = {} as Record<string|symbol, unknown>;
    state = {} as Record<string, unknown>;
    getters = {} as Record<string, LocalGetter>;
    setters = {} as Record<string, LocalSetter>;
    accessors = {} as Record<string, LocalAccessor>;
    mutations = {} as Record<string, LocalMutation>;
    actions = {} as Record<string, LocalAction>;
    watchers = {} as Record<string, WatchDescriptor>;
    locals = {} as Record<string, LocalFunction>;
}

type Setter = (key: string, value: unknown) => void;

interface ProxyContext {
    state: Record<string, unknown>;
    getters?: Record<string, unknown>;
    commit?: Commit;
    dispatch?: Dispatch;
}

function getModuleChain(bottom: StoreModuleClass): StoreModuleClass[] {
    type MaybeModuleClass = StoreModuleClass|undefined|null;

    const modules = [] as StoreModuleClass[];

    let module = bottom as MaybeModuleClass;
    while (module) {
        if (!module[IS_PROXY]) {
            modules.push(module);
        }

        if (module.prototype === StoreModule.prototype) {
            return modules.reverse();
        }

        module = Object.getPrototypeOf(module) as MaybeModuleClass;
    }

    throw new Error("Module class must be derived from StoreModule");
}

export class StoreProxyFactory {
    readonly moduleDefinition = new ModuleDefinition();
    readonly moduleOptions: ModuleOptions;
    readonly registerOptions: ResolvedRegisterOptions;
    readonly instance: StoreModuleInterface;
    readonly cache = new Map<ProxyKind, StoreModuleInterface>();

    constructor(
        module: StoreModuleClass,
        instance: StoreModuleInterface,
        moduleOptions: ModuleOptions,
        registerOptions: RegisterOptions,
    ) {
        this.moduleOptions = moduleOptions;

        const name = registerOptions.name || camelCase(module.name);
        this.registerOptions = { ...registerOptions, name };

        this.instance = instance;

        // Register state.
        for (const [ key, value ] of Object.entries(instance)) {
            if (value instanceof StoreModule) {
                // TODO: Sub-module referencing.
            } else {
                this.moduleDefinition.state[key] = value;
            }
        }

        // Symbol accessed fields
        for (const symbol of Object.getOwnPropertySymbols(instance)) {
            // HACK: TypeScript doesn't allow symbols as arbitrary indexers.
            const value = instance[symbol as unknown as string];
            if (value instanceof StoreModule) {
                // TODO: Sub-module referencing.
            } else {
                // HACK: TypeScript doesn't allow symbols as arbitrary indexers.
                this.moduleDefinition.fields[symbol as unknown as string] = value;
            }
        }

        // Register getters, accessors, mutations, and actions
        const bases = getModuleChain(module);
        for (const base of bases) {
            const accessors = base[ACCESSORS];
            const mutations = base[MUTATIONS];
            const actions = base[ACTIONS];
            const watchers = base[WATCHERS];
            const isAccessor = (key: string): boolean => !isNil(accessors) && key in accessors;
            const isMutation = (key: string): boolean => !isNil(mutations) && key in mutations;
            const isAction = (key: string): boolean => !isNil(actions) && key in actions;
            const isWatcher = (key: string): boolean => !isNil(watchers) && key in watchers;
            const isLocal = (key: string): boolean => key in base.prototype &&
                typeof base.prototype[key] === "function";

            for (const key of Object.getOwnPropertyNames(base.prototype)) {
                if (key !== "constructor") {
                    const descriptor = Object.getOwnPropertyDescriptor(base.prototype, key);
                    if (descriptor && typeof descriptor.get === "function") {
                        // eslint-disable-next-line @typescript-eslint/unbound-method
                        this.moduleDefinition.getters[key] = descriptor.get;
                        if (typeof descriptor.set === "function") {
                            // eslint-disable-next-line @typescript-eslint/unbound-method
                            this.moduleDefinition.setters[key] = descriptor.set;
                        }
                    } else if (isAccessor(key)) {
                        this.moduleDefinition.accessors[key] = base.prototype[key] as LocalAccessor;
                    } else if (isMutation(key)) {
                        this.moduleDefinition.mutations[key] = base.prototype[key] as LocalMutation;
                    } else if (isAction(key)) {
                        this.moduleDefinition.actions[key] = base.prototype[key] as LocalAction;
                    } else if (isWatcher(key)) {
                        this.moduleDefinition.watchers[key] = base.prototype[key] as WatchDescriptor;
                    } else if (isLocal(key)) {
                        this.moduleDefinition.locals[key] = base.prototype[key] as LocalFunction;
                    }
                }
            }
        }

        this.registerModule();
    }

    makePublicProxy(): StoreModuleInterface {
        const { store, name } = this.registerOptions;

        const proxy = this.getProxy({ ...store, state: store.state[name] as Record<string, unknown> }, "public");

        Object.setPrototypeOf(proxy, Object.getPrototypeOf(this.instance));
        Object.freeze(proxy);

        return proxy;
    }

    private getStateSetter(context: ProxyContext, kind: ProxyKind): null|Setter {
        const { store, name } = this.registerOptions;

        switch (kind) {
        case "public":
            return (field: string, value: unknown): void => { store.commit(`${name}/set__${field}`, value) };
        case "mutation":
            return (field: string, value: unknown): void => { context.state[field] = value };
        case "action":
            return (field: string, value: unknown): void => { context.commit?.(`set__${field}`, value) };
        default:
            return null;
        }
    }

    private registerModule(): void {
        const { store, name } = this.registerOptions;
        const module: CompleteModule<Record<string, unknown>, unknown> = {
            namespaced: true,
            state:      () => this.moduleDefinition.state,
            getters:    {},
            mutations:  {},
            actions:    {},
            modules:    {},
        };

        // State mutations
        if (this.moduleOptions.openState) {
            for (const [key] of Object.entries(this.moduleDefinition.state)) {
                module.mutations[`set__${key}`] = (state: Record<string, unknown>, payload: unknown) => { state[key] = payload };
            }
        }

        // Getters and setters
        for (const [ key, getter ] of Object.entries(this.moduleDefinition.getters)) {
            module.getters[`get__${key}`] = (state: Record<string, unknown>, getters: GetterTree<Record<string, unknown>, unknown>) => {
                const getterProxy = this.getProxy({ state, getters }, "getter");

                return getter.call(getterProxy);
            };

            const setter = key in this.moduleDefinition.setters && this.moduleDefinition.setters[key];
            if (setter) {
                module.mutations[`set__${key}`] = (state: Record<string, unknown>, payload: unknown) => {
                    const mutationProxy = this.getProxy({ state }, "mutation");

                    setter.call(mutationProxy, payload);
                };
            }
        }

        // Accessors
        for (const [ key, accessor ] of Object.entries(this.moduleDefinition.accessors)) {
            module.getters[key] = (state: Record<string, unknown>, getters: GetterTree<Record<string, unknown>, unknown>) => {
                const getterProxy = this.getProxy({ state, getters }, "getter");

                return (args: unknown[]) => accessor.call(getterProxy, ...args);
            };
        }

        // Mutations
        for (const [ key, mutation ] of Object.entries(this.moduleDefinition.mutations)) {
            module.mutations[key] = (state: Record<string, unknown>, payload: unknown[]) => {
                const mutationProxy = this.getProxy({ state }, "mutation");

                mutation.call(mutationProxy, ...payload);
            };
        }

        // Actions
        for (const [ key, action ] of Object.entries(this.moduleDefinition.actions)) {
            module.actions[key] = (context: ActionContext<Record<string, unknown>, unknown>, payload: unknown[]) => {
                const actionProxy = this.getProxy({ ...context }, "action");

                return action.call(actionProxy, ...payload);
            };
        }

        // Watchers
        for (const [ , descriptor ] of Object.entries(this.moduleDefinition.watchers)) {
            const getter = (state: Record<string, unknown>): unknown =>
                get(state, `${this.registerOptions.name}.${descriptor.path}`);
            const watcher = (newValue: unknown, oldValue: unknown): void => {
                const proxy = this.makePublicProxy();

                descriptor.callback.call(proxy, newValue, oldValue);
            };

            store.watch(getter, watcher, descriptor.options);
        }

        if (store.state[name]) {
            throw Error(`[system/vuex]: Module "${name}" is already registered.`);
        } else {
            store.registerModule(name, module);
        }
    }

    private getProxy(context: ProxyContext, kind: ProxyKind): StoreModuleInterface {
        const proxy = this.cache.get(kind);

        return proxy || this.makeProxy(context, kind);
    }

    private makeProxy(context: ProxyContext, kind: ProxyKind): StoreModuleInterface {
        const proxy = {} as StoreModuleInterface;

        const isPublicProxy = kind === "public";
        const namespace = isPublicProxy ? `${this.registerOptions.name}/` : "";
        const stateSetter = this.moduleOptions.openState || kind === "mutation" ?
            this.getStateSetter(context, kind) :
            null;

        // State
        for (const [key] of Object.entries(this.moduleDefinition.state)) {
            Object.defineProperty(proxy, key, {
                configurable: false,
                enumerable:   true,

                get: () => context.state[key],
                set: stateSetter ?
                    (value: unknown) => stateSetter(key, value) :
                    () => { throw new Error("[system/vuex]: Cannot modify the state outside mutations.") },
            });
        }

        // Symbol accessed fields
        for (const symbol of Object.getOwnPropertySymbols(this.moduleDefinition.fields)) {
            Object.defineProperty(proxy, symbol, {
                configurable: false,
                enumerable:   true,

                get: !isPublicProxy ?
                    // HACK: TypeScript doesn't allow symbols as arbitrary indexers.
                    () => this.moduleDefinition.fields[symbol as unknown as string] :
                    () => { throw new Error("[system/vuex]: Cannot access symbol fields outside store.") },
                set: !isPublicProxy ?
                    // HACK: TypeScript doesn't allow symbols as arbitrary indexers.
                    (value: unknown) => { this.moduleDefinition.fields[symbol as unknown as string] = value } :
                    () => { throw new Error("[system/vuex]: Cannot alter symbol fields outside store.") },
            });
        }

        // Getters and setters
        for (const [key] of Object.entries(this.moduleDefinition.getters)) {
            const setter = key in this.moduleDefinition.setters ? this.moduleDefinition.setters[key] : null;
            Object.defineProperty(proxy, key, {
                configurable: false,
                enumerable:   false,

                get: context.getters ?
                    () => context.getters?.[`${namespace}get__${key}`] :
                    () => { throw new Error(`[system/vuex]: Calling getter for "${key}" at inappropriate time.`) },
                set: setter && context.getters && context.commit ?
                    (payload?: unknown) => { context.commit?.(`${namespace}set__${key}`, payload) } :
                    () => { throw new Error(`[system/vuex]: Calling setter for "${key}" at inappropriate time.`) },
            });
        }

        // Accessors
        for (const [key] of Object.entries(this.moduleDefinition.accessors)) {
            Object.defineProperty(proxy, key, {
                configurable: false,
                enumerable:   false,
                writable:     false,
                value:        context.getters ?
                    (...payload: unknown[]) => (context.getters?.[`${namespace}${key}`] as ProxyAccess)(payload) :
                    () => { throw new Error(`[system/vuex]: Calling getter "${key}" at inappropriate time.`) },
            });
        }

        // Mutations
        for (const [key] of Object.entries(this.moduleDefinition.mutations)) {
            Object.defineProperty(proxy, key, {
                configurable: false,
                enumerable:   false,
                writable:     false,
                value:        context.commit ?
                    (...payload: unknown[]) => { context.commit?.(`${namespace}${key}`, payload) } :
                    () => { throw new Error(`[system/vuex]: Calling mutation "${key}" at inappropriate time.`) },
            });
        }

        // Actions
        for (const [key] of Object.entries(this.moduleDefinition.actions)) {
            Object.defineProperty(proxy, key, {
                configurable: false,
                enumerable:   false,
                writable:     false,
                value:        context.dispatch ?
                    (...payload: unknown[]) => context.dispatch?.(`${namespace}${key}`, payload) :
                    () => { throw new Error(`[system/vuex]: Calling action "${key}" at inappropriate time.`) },
            });
        }

        // Watchers
        for (const [key] of Object.entries(this.moduleDefinition.watchers)) {
            Object.defineProperty(proxy, key, {
                configurable: false,
                enumerable:   false,
                writable:     false,
                value:        () => { throw new Error(`[system/vuex]: Watcher "${key}" may not be called directly.`) },
            });
        }

        // Local functions
        for (const [ key, value ] of Object.entries(this.moduleDefinition.locals)) {
            Object.defineProperty(proxy, key, {
                configurable: false,
                enumerable:   false,
                writable:     false,
                value:        !isPublicProxy ?
                    (...args: unknown[]) => value.call(proxy, ...args) :
                    () => { throw new Error(`[system/vuex]: Calling local function "${key}" at inappropriate time.`) },
            });
        }

        return proxy;
    }
}

// Proxies
// - Using the store instance
//   - PublicProxy, mimics the class interface without local functions and with read/write state.
//   - GetterProxy, mimics the class interface without actions, mutations, or setters and with readonly state.
//   - MutationProxy, mimics the class interface without getters, accessors, actions, mutations, or setters and with read/write state.
//   - ActionProxy, mimics the class interface with read/write state.
// - Using provided context
//   - VuexProxy, wraps the module to be part of a Vuex.Store.
