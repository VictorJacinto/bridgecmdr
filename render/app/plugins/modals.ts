import { defaults } from "lodash";
import type { VueConstructor } from "vue";
import type Vue from "vue";

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
            const confirm = (value: never): void => { resolve(value) };
            const cancel = (): void => { resolve(null) };
            const events = { confirm, cancel };
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
