import { isError, toString } from "lodash";
import v from "vahvista";
import type { CreateElement, VNode } from "vue";
import Vue from "vue";
import Component, { mixins } from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import { normalizeScopedSlot } from "../../../foundation/helpers/vue";
import IndicatesLoading from "../../concerns/indicates-loading";
import type DataModule from "../../store/base/data-module";
import type { ModelType } from "../../store/base/data-module";
import type Model from "../../support/data/model";

const BButton = Vue.component("BButton");
const BField = Vue.component("BField");
const BIcon = Vue.component("BIcon");

@Component({ name: "DataSource" })
export default class DataSource<D extends DataModule<M, Model>, M extends Model = ModelType<D>> extends mixins(IndicatesLoading) {
    @Prop({ type: Object, default: undefined })
    readonly selector!: undefined|PouchDB.Find.Selector;

    @Prop({ type: String, default: "div", validator: v.notEmpty })
    readonly tag!: string;

    @Prop(Boolean)
    readonly slim!: undefined|boolean;

    readonly module!: () => D;

    error = null as null|string;

    get items(): M[] {
        return this.module().items;
    }

    @Watch("selector", { deep: true })
    onSelectorChanged(): void {
        this.$nextTick(() => this.refresh());
    }

    mounted(): void {
        this.$nextTick(() => this.refresh());
    }

    getAll(): Promise<void> {
        return this.module().all();
    }

    findSome(selector: PouchDB.Find.Selector): Promise<void> {
        return this.module().find(selector);
    }

    async refresh(): Promise<void> {
        try {
            if (this.selector) {
                await this.loadingWhile(this.findSome(this.selector));
            } else {
                await this.loadingWhile(this.getAll());
            }

            this.error = null;
        } catch (error: unknown) {
            this.error = isError(error) ? error.message : toString(error);
            console.error(error);
        }

        this.$emit("change", this.items);
    }

    render(h: CreateElement): VNode {
        const refresh = (): Promise<void> => this.refresh();

        if (this.loading) {
            // Short-circuit as loading, since is has priority.
            const children = normalizeScopedSlot(this, "loading", { loading: true }, []);

            return this.slim && children.length <= 1 ? children[0] : h(this.tag, children);
        }

        if (this.error) {
            const children = normalizeScopedSlot(this, "error", { error: this.error, refresh }, [
                h(this.tag, { class: "section content has-text-danger has-text-centered" }, [
                    h(BField, [h(BIcon, { props: { icon: "emoticon-sad", size: "is-large", type: "is-danger" } })]),
                    h(BField, "There was an error loading."),
                    h(BField, [h(BButton, { props: { label: "Try again", type: "is-warning" }, on: { click: refresh } })]),
                    h(BField, [this.error]),
                ]),
            ]);

            return this.slim && children.length <= 1 ? children[0] : h(this.tag, children);
        }

        const children = normalizeScopedSlot(this, "default", { items: this.items, refresh }, []);

        return this.slim && children.length <= 1 ? children[0] : h(this.tag, children);
    }
}
