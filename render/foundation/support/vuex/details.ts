import type { WatchOptions } from "vue";
import type {ModuleOptions, RegisterOptions} from "./options";
import {StoreModule} from "./store-modules";

export const DEFINITION = Symbol("ModuleDefinition");
export const OPTIONS = Symbol("Options");

export const INSTANCE = Symbol("Instance");
export const ACCESSORS = Symbol("Accessors");
export const MUTATIONS = Symbol("Mutations");
export const ACTIONS = Symbol("Actions");
export const WATCHERS = Symbol("Watchers");
export const IS_PROXY = Symbol("Proxy");

export type ProxyKind = "public"|"getter"|"mutation"|"action";

export interface StoreModuleInterface extends Record<string|symbol, unknown> {
    // constructor: new (options: RegisterOptions) => StoreModuleInterface;
}

export type LocalGetter<M = StoreModuleInterface> = (this: M) => unknown;
export type LocalSetter<M = StoreModuleInterface> = (this: M, value: unknown) => void;

// export type LocalAccessor = (this: StoreModuleInterface, ...args: unknown[]) => unknown;
export interface LocalAccessor<M = StoreModuleInterface> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this: M, ...args: any[]): any;
    [ACCESSORS]?: undefined|boolean;
}

// export type LocalMutation = (this: StoreModuleInterface, ...args: unknown[]) => void;
export interface LocalMutation<M = StoreModuleInterface> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this: M, ...args: any[]): void;
    [MUTATIONS]?: undefined|boolean;
}

// export type LocalAction = (this: StoreModuleInterface, ...args: unknown[]) => Promise<unknown>;
export interface LocalAction<M = StoreModuleInterface> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this: M, ...args: any[]): Promise<any>;
    [ACTIONS]?: undefined|boolean;
}

// export type LocalWatcher = (this: StoreModuleInterface, newValue: unknown, oldValue: unknown) => void;
export interface LocalWatcher<M = StoreModuleInterface> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this: M, newValue: any, oldValue: any): void;
    [WATCHERS]?: undefined|WatchDescriptor<M>;
}

export type WatchDescriptor<M = StoreModuleInterface> = {
    callback: LocalWatcher<M>;
    path: string;
    options?: WatchOptions;
};

export type LocalFunction<M = StoreModuleInterface> = (this: M, ...args: unknown[]) => unknown;

export type LocalMember<M = StoreModuleInterface> =
    LocalAccessor<M>|LocalMutation<M>|LocalAction<M>|LocalWatcher<M>|LocalFunction<M>;

export type ProxyAccess = (args: unknown[]) => unknown;

export class ModuleDefinition<M> {
    options: ModuleOptions;
    // // HACK: TypeScript doesn't allow symbols as arbitrary indexers.
    // fields = {} as Record<string|symbol, unknown>;
    // state = {} as Record<string, unknown>;
    getters = new Map<string|keyof M, LocalGetter<M>>();
    setters = new Map<string|keyof M, LocalSetter<M>>();
    accessors = new Map<string|keyof M, LocalAccessor<M>>();
    mutations = new Map<string|keyof M, LocalMutation<M>>();
    actions = new Map<string|keyof M, LocalAction<M>>();
    watchers = new Map<string|keyof M, WatchDescriptor<M>>();
    locals = new Map<string|keyof M, LocalFunction<M>>();

    constructor(options: ModuleOptions) {
        this.options = options;
    }
}

export interface StoreModuleClass<M = StoreModuleInterface> {
    new (options: RegisterOptions): M;
    [ACCESSORS]?: Record<string, LocalAccessor<M>>;
    [MUTATIONS]?: Record<string, LocalMutation<M>>;
    [ACTIONS]?: Record<string, LocalAction<M>>;
    [WATCHERS]?: Record<string, WatchDescriptor<M>>;
    [IS_PROXY]?: boolean;

    prototype: Record<string, LocalMember<M>>;
}
