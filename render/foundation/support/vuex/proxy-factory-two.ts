import { isSymbol } from "lodash";
import type {
    // LocalGetter,
    // LocalSetter,
    LocalAccessor,
    LocalMutation,
    LocalAction,
    LocalWatcher,
    // LocalFunction,
    LocalMember,
    // WatchDescriptor,
    StoreModuleClass, ProxyKind,
} from "./details";
import { IS_PROXY, ACCESSORS, ACTIONS, MUTATIONS, OPTIONS, WATCHERS, ModuleDefinition, DEFINITION } from "./details";
import type { ModuleOptions, RegisterOptions } from "./options";
import { StoreModule } from "./store-modules";

// TODO: All instances will have their own proxy.  Definition construction in the static handler.
//  Each kind in single handler class (still per instance per kind).  Caching where?

type ResolvedRegisterOptions = Required<RegisterOptions>;

type ProxyMethod<M extends StoreModule> = (this: StoreModuleHandler<M>, target: M, ...args: unknown[]) => unknown;

class BaseHandler<M extends StoreModule> implements ProxyHandler<M> {
    static getModuleChain<C>(bottom: StoreModuleClass<C>): StoreModuleClass<C>[] {
        type MaybeModuleClass = StoreModuleClass<C>|undefined|null;

        const modules = [] as StoreModuleClass<C>[];

        let module = bottom as MaybeModuleClass;
        while (module) {
            if (!module[IS_PROXY]) {
                modules.push(module);
            }

            if ((module.prototype as unknown) === StoreModule.prototype) {
                return modules.reverse();
            }

            module = Object.getPrototypeOf(module) as MaybeModuleClass;
        }

        throw new Error("Module class must be derived from StoreModule");
    }

    // eslint-disable-next-line class-methods-use-this
    isExtensible(): boolean {
        return false;
    }

    // eslint-disable-next-line class-methods-use-this
    defineProperty(): boolean {
        console.warn("defineProperty may not be used to modify or add new properties to modules");

        return false;
    }

    // eslint-disable-next-line class-methods-use-this
    deleteProperty(): boolean {
        console.warn("Properties may not be deleted from modules");

        return false;
    }

    // eslint-disable-next-line class-methods-use-this
    setPrototypeOf(): boolean {
        console.warn("The prototype of a module cannot be changed");

        return false;
    }
}

// class StoreModuleInnerHandler<M extends StoreModule> extends  BaseHandler<M> implements ProxyHandler<M> {
//
// }

class StoreModuleHandler<M extends StoreModule> extends BaseHandler<M> implements ProxyHandler<M> {
    definition: ModuleDefinition<M>;
    options: RegisterOptions;
    module: StoreModuleClass<M>;
    proxies = new Map<string|keyof M, ProxyMethod<M>>();

    static isAccessor<T extends StoreModule>(member: LocalMember<T>): member is LocalAccessor<T> {
        return (member as LocalAccessor<T>)[ACCESSORS] || false;
    }

    static isMutation<T extends StoreModule>(member: LocalMember<T>): member is LocalMutation<T> {
        return (member as LocalMutation<T>)[MUTATIONS] || false;
    }

    static isAction<T extends StoreModule>(member: LocalMember<T>): member is LocalAction<T> {
        return (member as LocalAction<T>)[ACTIONS] || false;
    }

    static isWatcher<T extends StoreModule>(member: LocalMember<T>): member is LocalWatcher<T> {
        return Boolean((member as LocalWatcher<T>)[WATCHERS]);
    }

    constructor(kind: ProxyKind, constructor: StoreModuleClass<M>, options: RegisterOptions, definition: ModuleDefinition<M>) {
        super();

        this.definition = definition;
        this.options = options;
        this.module = constructor;

        const bases = BaseHandler.getModuleChain(constructor);
        for (const base of bases) {
            for (const key of Object.getOwnPropertyNames(base.prototype)) {
                if (key === "constructor") {
                    // eslint-disable-next-line no-continue
                    continue;
                }

                const descriptor = Object.getOwnPropertyDescriptor(base.prototype, key);
                if  (descriptor && typeof descriptor.get === "function") {
                    // eslint-disable-next-line @typescript-eslint/unbound-method
                    this.definition.getters.set(key, descriptor.get);
                    if (typeof descriptor.set === "function") {
                        // eslint-disable-next-line @typescript-eslint/unbound-method
                        this.definition.setters.set(key, descriptor.set);
                    }

                    // eslint-disable-next-line no-continue
                    continue;
                }

                const value = base.prototype[key];
                if (typeof value !== "function") {
                    console.warn("[system/vuex]: Module prototype has property that is neither get/set or a function");

                    // eslint-disable-next-line no-continue
                    continue;
                }

                if (StoreModuleHandler.isAccessor(value)) {
                    this.proxies.set(key, (target: M, ...args: unknown[]) =>
                        (target[OPTIONS].store.getters as Record<string, LocalAccessor<M>>)[
                            `${target[OPTIONS].name}/${key}`].call(target, args) as unknown);
                } else if (StoreModuleHandler.isMutation(value)) {
                    this.proxies.set(key, (target: M, ...args: unknown[]) => {
                        target[OPTIONS].store.commit(`${target[OPTIONS].name}/${key}`, args);
                    });
                } else if (StoreModuleHandler.isAction(value)) {
                    this.proxies.set(key, (target: M, ...args: unknown[]) =>
                        target[OPTIONS].store.dispatch(`${target[OPTIONS].name}/${key}`, args));
                } else if (StoreModuleHandler.isWatcher(value)) {
                    this.proxies.set(key, () => {
                        throw new Error(`[system/vuex]: Watcher ${key} called outside its module`);
                    });
                } else {
                    this.proxies.set(key, () => {
                        throw new Error(`[system/vuex]: A local function ${key} called outside its module`);
                    });
                }
            }
        }
    }

    get(target: M, p: keyof M): unknown {
        // Short-circuit; state, or local and prototype inherited symbol accessed fields.
        if (isSymbol(p) || Object.prototype.hasOwnProperty.call(target, p)) {
            return target[p];
        }

        // Getters
        if (this.module[DEFINITION].getters.has(p)) {
            return (target[OPTIONS].store.getters as Record<string, unknown>)[
                `${target[OPTIONS].name}/get__${p as number|string}`];
        }

        // Callables
        const proxy = this.proxies.get(p);
        if (proxy) {
            return (...args: unknown[]) => proxy.call(this, target, ...args);
        }

        // Any other prototype inherited field.
        return target[p];
    }

    set(target: M, p: keyof M, value: unknown): boolean {
        // Short-circuit; state, or local and prototype inherited symbol accessed fields.
        if (Object.prototype.hasOwnProperty.call(target, p)) {
            if (isSymbol(p)) {
                console.warn("[system/vuex]: Cannot alter symbol fields outside store.");

                return false;
            }

            if (this.module[DEFINITION].options.openState) {
                target[OPTIONS].store.commit(`${target[OPTIONS].name}/set__${p as number|string}`, value);

                return true;
            }

            console.warn("[system/vuex]: Cannot modify the state outside mutations.");

            return false;
        }

        if (this.module[DEFINITION].setters.has(p)) {
            target[OPTIONS].store.commit(`${target[OPTIONS].name}/set__${p as number|string}`, value);

            return false;
        }

        return false;
    }
}

class StoreModuleStaticHandler<M extends typeof StoreModule> implements ProxyHandler<M> {
    cache = new Map<ProxyKind, InstanceType<M>>();
    target: StoreModuleClass<InstanceType<M>>;
    definition: ModuleDefinition<InstanceType<M>>;

    constructor(constructor: M, options: null|ModuleOptions) {
        this.target = constructor as unknown as StoreModuleClass<InstanceType<M>>;
        this.definition = new ModuleDefinition<InstanceType<M>>(options || {});
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    construct(Target: M, args: [RegisterOptions]): StoreModule {
        const instance = new Target(...args) as InstanceType<M>;
        const handler = new StoreModuleHandler<InstanceType<M>>(this.target, args[0], this.definition);
        const proxy = new Proxy(instance, handler);

        this.cache.set("public", proxy);

        return proxy;
    }
}

export default function proxyFactory<M extends typeof StoreModule>(module: M, options = null as null|ModuleOptions): M {
    return new Proxy(module, new StoreModuleStaticHandler<M>(module, options));
}
