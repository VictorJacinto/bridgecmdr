import type { WatchOptions } from "vue";
import type { RegisterOptions } from "./options";

export const INSTANCE = Symbol("Instance");
export const ACCESSORS = Symbol("Accessors");
export const MUTATIONS = Symbol("Mutations");
export const ACTIONS = Symbol("Actions");
export const WATCHERS = Symbol("Watchers");
export const IS_PROXY = Symbol("Proxy");

export type ProxyKind = "public"|"getter"|"mutation"|"action";

export interface StoreModuleInterface extends Record<string|symbol, unknown> {
    constructor: new (options: RegisterOptions) => StoreModuleInterface;
}

export type LocalGetter = (this: StoreModuleInterface) => unknown;
export type LocalSetter = (this: StoreModuleInterface, value: unknown) => void;
export type LocalAccessor = (this: StoreModuleInterface, payload?: unknown) => unknown;
export type LocalMutation = (this: StoreModuleInterface, ...args: unknown[]) => void;
export type LocalAction = (this: StoreModuleInterface, payload?: unknown) => Promise<unknown>;
export type LocalWatcher = (this: StoreModuleInterface, newValue: unknown, oldValue: unknown) => void;
export type LocalFunction = (this: StoreModuleInterface, ...args: unknown[]) => unknown;

export type ProxyAccess = (args: unknown[]) => unknown;

export type WatchDescriptor = { callback: LocalWatcher; path: string; options?: WatchOptions };

export interface StoreModuleClass {
    new (options: RegisterOptions): StoreModuleInterface;
    [ACCESSORS]?: Record<string, LocalAccessor>;
    [MUTATIONS]?: Record<string, LocalMutation>;
    [ACTIONS]?: Record<string, LocalAction>;
    [WATCHERS]?: Record<string, WatchDescriptor>;
    [IS_PROXY]?: boolean;

    prototype: StoreModuleInterface;
}
