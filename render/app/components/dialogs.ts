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

import { BDialogConfig } from "buefy/types/components";
import { assign, defaults, isString } from "lodash";
import Vue, { VueConstructor } from "vue";

type ForcedDialogOptions =
    "title" | "container" | "ariaModal" | "ariaRole" | "onConfirm" |
    "onCancel" | "canCancel" | "icon" | "iconPack" | "size" |
    "animation" | "trapFocus" | "scroll";

type DialogConfig = Omit<BDialogConfig, ForcedDialogOptions>;

export type AlertDialogConfig = Omit<DialogConfig, "cancelText" | "inputAttrs">;
export type ConfirmDialogConfig = Omit<DialogConfig, "inputAttrs">;
export type PromptDialogConfig = DialogConfig & { inputAttrs?: Record<string, unknown>  };

interface Dialogs {
    alert(options: string|AlertDialogConfig): Promise<void>;
    confirm(options: string|ConfirmDialogConfig): Promise<boolean>;
    prompt(options: string|PromptDialogConfig): Promise<string|undefined>;
    error(error: Error): Promise<void>;
}

function resolveConfig<C extends object>(
    options: string|C,
    key: keyof C,
    _required?: Partial<BDialogConfig>,
    _defaults?: Partial<BDialogConfig>,
): BDialogConfig {
    return assign(defaults(isString(options) ? { [key]: options } : options, _defaults), _required) as BDialogConfig;
}

function $dialogs(this: Vue): Dialogs {
    const dialogs: Dialogs = {
        alert: options => new Promise<void>(resolve => {
            const config = resolveConfig(options, "message", {
                // Required
                onConfirm: () => { resolve() },
                onCancel:  () => { resolve() },
            });

            this.$buefy.dialog.alert(config);
        }),
        confirm: options => new Promise<boolean>(resolve => {
            const config = resolveConfig(options, "message", {
                // Required
                onConfirm: () => { resolve(true) },
                onCancel:  () => { resolve(false) },
                canCancel: [ "button", "escape" ],
            }, {
                // Defaults
                confirmText: "Yes",
                cancelText:  "No",
            });

            this.$buefy.dialog.confirm(config);
        }),
        prompt: options => new Promise<string|undefined>(resolve => {
            const config = resolveConfig(options, "message", {
                onConfirm: value => { resolve(value) },
                onCancel:  () => { resolve(undefined) },
            });

            this.$buefy.dialog.prompt(config);
        }),
        error: error => dialogs.alert({
            message:     error.message,
            confirmText: "Dismiss",
            hasIcon:     true,
            type:        "is-danger",
        }),
    };

    return dialogs;
}

const Dialogs = {
    install(vue: VueConstructor) {
        Object.defineProperties(vue.prototype, {
            $dialogs: { configurable: false, enumerable: false, get: $dialogs },
        });
    },
};

export default Dialogs;

declare module "vue/types/vue" {
    interface Vue {
        $dialogs: Dialogs;
    }
}
