import { castArray } from "lodash";
import Vue, { VNode } from "vue";

export type ScopedSlots<C extends Vue> = Required<C["$scopedSlots"]>;
export type SlotNames<C extends Vue> = keyof ScopedSlots<C>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SlotProps<C extends Vue, S extends SlotNames<C>> = ScopedSlots<C>[S] extends (props: infer P) => any ? P : {};

export function normalizeScopedSlot<C extends Vue, S extends SlotNames<C>>(component: C, slot: S, props: SlotProps<C, S>): VNode[]|null;
export function normalizeScopedSlot<C extends Vue, S extends SlotNames<C>>(component: C, slot: S, props: SlotProps<C, S>, def: VNode|VNode[]): VNode[];
export function normalizeScopedSlot<C extends Vue, S extends SlotNames<C>>(component: C, slot: S, props: SlotProps<C, S>, def: VNode|VNode[]|null = null): VNode[]|null {
    const scopedSlot = component.$scopedSlots[slot as string];
    if (scopedSlot) {
        return scopedSlot(props) || [];
    }

    return component.$slots[slot as string] || (def !== null ? castArray(def) : def);
}

export function normalizeSlot(component: Vue, slot: string): VNode[]|null;
export function normalizeSlot(component: Vue, slot: string, def: VNode|VNode[]): VNode[];
export function normalizeSlot(component: Vue, slot: string, def: VNode|VNode[]|null = null): VNode[]|null {
    return component.$slots[slot] || (def !== null ? castArray(def) : def);
}
