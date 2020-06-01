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

import Vue, { VNode } from "vue";

type SlotOn<C extends Vue> = keyof C["$scopedSlots"];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SlotProps<C extends Vue, S extends SlotOn<C>> = C["$scopedSlots"][S] extends (props: infer P) => any ? P : {};

export function normalizeChildren<C extends Vue, S extends SlotOn<C>>(component: C, slot: S, props: SlotProps<C, S>): VNode[] {
    const scopedSlot = component.$scopedSlots[slot as string];
    if (scopedSlot) {
        return scopedSlot(props) || [];
    }

    return component.$slots[slot as string] || [];
}
