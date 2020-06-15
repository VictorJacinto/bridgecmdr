/*
BridgeCmdr - A/V switch and monitor controller
Copyright (C) 2019-2020 Matthew Holder

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

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
