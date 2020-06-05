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

import { defaults } from "lodash";
import Vue, { VueConstructor } from "vue";

export const CanCancelActions = [ "escape", "outside", "x" ] as const;
export type CanCancelActions = typeof CanCancelActions[number];
export type CanCancel = boolean | CanCancelActions[];

export type ResolvedModalConfig = {
    hasModalCard: boolean;
    canCancel: CanCancel;
    props?: Record<string, unknown>;
    width?: number|string;
    animation?: string;
    fullScreen?: boolean;
    trapFocus?: boolean;
    customClass?: string;
};

export type ModalConfig = Partial<ResolvedModalConfig>;

const defaultConfig: ResolvedModalConfig = {
    hasModalCard: true,
    canCancel:    [ "escape", "x" ],
};

interface Modals {
    open<T = never>(component: VueConstructor, config?: ModalConfig): Promise<T|null>;
    confirm(value?: unknown): void;
    cancel(): void;
}

function $modals(this: Vue): Modals {
    return {
        open: (component, config = {}) => new Promise(resolve => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const confirm = (value: any): void => { resolve(value) };
            const cancel = (): void => { resolve(null) };
            const events = { confirm, cancel };

            // TODO: Resolve the component if a function...

            const resolved = defaults({ parent: this, onCancel: cancel, component, events, ...config },
                defaultConfig);

            this.$buefy.modal.open(resolved);
        }),
        confirm: (value: unknown = null) => {
            this.$parent.close();
            this.$emit("confirm", value);
        },
        cancel: () => {
            this.$parent.close();
            this.$emit("cancel");
        },
    };
}

const Modals = {
    install(vue: VueConstructor) {
        Object.defineProperties(vue.prototype, {
            $modals: { configurable: false, enumerable: false, get: $modals },
        });
    },
};

export default Modals;

declare module "vue/types/vue" {
    interface Vue {
        $modals: Modals;

        close(): void;
    }
}
