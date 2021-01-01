import type { LocalMutation, StoreModuleClass } from "./details";
import { MUTATIONS } from "./details";
import type { StoreModule } from "./store-modules";

type Descriptor = TypedPropertyDescriptor<LocalMutation>;

export function Mutation<T extends StoreModule>(target: T, key: string, descriptor: Descriptor): Descriptor {
    const module = target.constructor as StoreModuleClass;
    const methods = module[MUTATIONS] || (module[MUTATIONS] = {});
    if (typeof descriptor.value === "function") {
        methods[key] = descriptor.value;

        descriptor.value[MUTATIONS] = true;
    }

    return descriptor;
}
