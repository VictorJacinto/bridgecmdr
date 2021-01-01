import type { LocalAction, StoreModuleClass } from "./details";
import { ACTIONS } from "./details";
import type { StoreModule } from "./store-modules";

type Descriptor = TypedPropertyDescriptor<LocalAction>;

export function Action<T extends StoreModule>(target: T, key: string, descriptor: Descriptor): Descriptor {
    const module = target.constructor as StoreModuleClass;
    const methods = module[ACTIONS] || (module[ACTIONS] = {});
    if (typeof descriptor.value === "function") {
        methods[key] = descriptor.value;

        descriptor.value[ACTIONS] = true;
    }

    return descriptor;
}
