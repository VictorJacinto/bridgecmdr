import type { LocalMutation } from "./details";
import { MUTATIONS } from "./details";
import type { StoreModule } from "./store-modules";

type Descriptor<M extends StoreModule> = TypedPropertyDescriptor<LocalMutation<M>>;

export function Mutation<M extends StoreModule>(_target: M, _key: string, descriptor: Descriptor<M>): Descriptor<M> {
    if (typeof descriptor.value === "function") {
        descriptor.value[MUTATIONS] = true;
    }

    return descriptor;
}
