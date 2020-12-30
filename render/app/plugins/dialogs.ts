import type { BDialogConfig } from "buefy/types/components";
import { assign, defaults, isError, isString, toString } from "lodash";
import type { VueConstructor } from "vue";
import type Vue from "vue";

type ForcedDialogOptions =
    "title" | "container" | "ariaModal" | "ariaRole" | "onConfirm" |
    "onCancel" | "canCancel" | "icon" | "iconPack" | "size" |
    "animation" | "trapFocus" | "scroll";

type DialogConfig = Omit<BDialogConfig, ForcedDialogOptions>;
type BasicDialogConfig = Omit<DialogConfig, "cancelText" | "inputAttrs">;

export type AlertDialogConfig = Omit<DialogConfig, "cancelText" | "inputAttrs">;
export type ConfirmDialogConfig = Omit<DialogConfig, "inputAttrs">;
export type PromptDialogConfig = DialogConfig & { inputAttrs?: Record<string, unknown> };

interface Dialogs {
    alert(options: string|AlertDialogConfig): Promise<void>;
    confirm(options: string|ConfirmDialogConfig): Promise<boolean>;
    prompt(options: string|PromptDialogConfig): Promise<string|undefined>;
    error(error: unknown): Promise<void>;
}

function resolveConfig<C extends BasicDialogConfig>(
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

            config.message = config.message.replace(/(?:\r?\n|\r\n?)/gu, "<br/>");

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
        error: error => {
            let message;
            if (isError(error)) {
                message = error.message;
            } else if (isString(error)) {
                message = error;
            } else {
                message = toString(error);
            }

            return dialogs.alert({
                message:     message,
                confirmText: "Dismiss",
                hasIcon:     true,
                type:        "is-danger",
            });
        },
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
