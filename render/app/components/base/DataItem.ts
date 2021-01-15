import { isError, toString } from "lodash";
import v from "vahvista";
import type { CreateElement, VNode } from "vue";
import Component, { mixins } from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import { normalizeScopedSlot } from "../../../foundation/helpers/vue";
import IndicatesLoading from "../../concerns/indicates-loading";
import type DataModule from "../../store/base/data-module";
import type { ModelType } from "../../store/base/data-module";
import type Model from "../../support/data/model";

@Component({ name: "DataItem" })
export default class DataItem<D extends DataModule<M, Model>, M extends Model = ModelType<D>> extends mixins(IndicatesLoading) {
    @Prop({ type: String, required: true, validator: v.id })
    readonly id!: string;

    @Prop({ type: String, default: "div", validator: v.notEmpty })
    readonly tag!: string;

    @Prop(Boolean)
    readonly slim!: undefined|boolean;

    readonly module!: () => D;

    error = null as null|string;

    get current(): null|M {
        return this.module().current;
    }

    @Watch("id")
    onIdChanged(): void {
        this.$nextTick(() => this.refresh());
    }

    mounted(): void {
        this.$nextTick(() => this.refresh());
    }

    getItem(id: string): Promise<void> {
        return this.module().get(id);
    }

    async refresh(): Promise<void> {
        try {
            await this.loadingWhile(this.getItem(this.id));
            this.$emit("input", this.current);
            this.error = null;
        } catch (error: unknown) {
            this.error = isError(error) ? error.message : toString(error);
            console.error(error);
        }
    }

    render(h: CreateElement): VNode {
        const loading = (): VNode => {
            const children = normalizeScopedSlot(this, "loading", { loading: true }, []);

            return this.slim && children.length <= 1 ? children[0] : h(this.tag, children);
        };

        if (this.loading) {
            // Short-circuit as loading, since is has priority.
            return loading();
        }

        if (this.error) {
            const children = normalizeScopedSlot(this, "error", {
                error:   this.error,
                refresh: () => this.refresh(),
            }, []);

            return this.slim && children.length <= 1 ? children[0] : h(this.tag, children);
        }

        if (this.current) {
            const children = normalizeScopedSlot(this, "default", {
                current: this.current,
                refresh: () => this.refresh(),
            }, []);

            return this.slim && children.length <= 1 ? children[0] : h(this.tag, children);
        }

        // Initial state, is loading.
        return loading();
    }
}
