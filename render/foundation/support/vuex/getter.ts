import type { LocalAccessor } from "./details";
import { ACCESSORS } from "./details";
import type { StoreModule } from "./store-modules";

type Descriptor<M extends StoreModule> = TypedPropertyDescriptor<LocalAccessor<M>>;

export function Getter<M extends StoreModule>(_target: M, _key: string, descriptor: Descriptor<M>): Descriptor<M> {
    if (typeof descriptor.value === "function") {
        descriptor.value[ACCESSORS] = true;
    }

    return descriptor;
}
