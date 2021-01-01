import type { LocalAccessor, StoreModuleClass } from "./details";
import { ACCESSORS } from "./details";
import type { StoreModule } from "./store-modules";

type Descriptor = TypedPropertyDescriptor<LocalAccessor>;

export function Getter<T extends StoreModule>(target: T, key: string, descriptor: Descriptor): Descriptor {
    const module = target.constructor as StoreModuleClass;
    const methods = module[ACCESSORS] || (module[ACCESSORS] = {});
    if (typeof descriptor.value === "function") {
        methods[key] = descriptor.value;

        descriptor.value[ACCESSORS] = true;
    }

    return descriptor;
}
