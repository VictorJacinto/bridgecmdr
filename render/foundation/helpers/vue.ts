import { castArray } from "lodash";
import type Vue from "vue";
import type { VNode } from "vue";

export function normalizeScopedSlot(component: Vue, slot: string, props: Record<string, unknown>): VNode[]|null;
export function normalizeScopedSlot(component: Vue, slot: string, props: Record<string, unknown>, def: VNode|VNode[]): VNode[];
export function normalizeScopedSlot(component: Vue, slot: string, props: Record<string, unknown>, def: VNode|VNode[]|null = null): VNode[]|null {
    const scopedSlot = component.$scopedSlots[slot];
    if (scopedSlot) {
        return scopedSlot(props) || [];
    }

    return component.$slots[slot] || (def !== null ? castArray(def) : def);
}

export function normalizeSlot(component: Vue, slot: string): VNode[]|null;
export function normalizeSlot(component: Vue, slot: string, def: VNode|VNode[]): VNode[];
export function normalizeSlot(component: Vue, slot: string, def: VNode|VNode[]|null = null): VNode[]|null {
    return normalizeScopedSlot(component, slot, {}, def as VNode);
}
