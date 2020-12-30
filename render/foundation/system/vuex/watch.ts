import type { WatchOptions } from "vue";
import type { StoreModuleClass } from "./details";
import { WATCHERS } from "./details";
import type { StoreModule } from "./store-modules";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Descriptor = TypedPropertyDescriptor<(newValue: any, oldValue: any) => void>;

export function Watch(path: string, options?: WatchOptions): MethodDecorator {
    return (<T extends StoreModule>(target: T, key: string, descriptor: Descriptor): Descriptor => {
        const module = target.constructor as StoreModuleClass;
        const methods = module[WATCHERS] || (module[WATCHERS] = {});
        if (typeof descriptor.value === "function") {
            methods[key] = {
                callback: descriptor.value,
                path,
                options,
            };
        }

        return descriptor;
    }) as MethodDecorator;
}
