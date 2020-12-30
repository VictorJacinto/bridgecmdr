import type { StoreModuleClass } from "./details";
import { MUTATIONS } from "./details";
import type { StoreModule } from "./store-modules";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Descriptor = TypedPropertyDescriptor<(...args: any[]) => void>;

export function Mutation<T extends StoreModule>(target: T, key: string, descriptor: Descriptor): Descriptor {
    const module = target.constructor as StoreModuleClass;
    const methods = module[MUTATIONS] || (module[MUTATIONS] = {});
    if (typeof descriptor.value === "function") {
        methods[key] = descriptor.value;
    }

    return descriptor;
}
