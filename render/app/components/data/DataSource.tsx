import { identity } from "lodash";
import { ReadonlyDeep } from "type-fest";
import { VNode } from "vue";
import * as tsx from "vue-tsx-support";
import { BButton, BField, BIcon } from "../../../foundation/components/buefy-tsx";
import { normalizeScopedSlot } from "../../../foundation/helpers/vue";
import { mapModuleActions, mapModuleState } from "../../../foundation/helpers/vuex";
import { is, maybe, prop } from "../../../foundation/validation/valid";
import IndicatesLoading from "../../concerns/indicates-loading";
import Model from "../../support/data/model";
import { BaseDataModule } from "../../support/data/module";

type DataSourceEvents<M extends Model> = {
    onChange(items: ReadonlyDeep<M>[]): void;
};

type DataSourceSlots<M extends Model> = {
    loading?: { loading: true };
    default: { items: ReadonlyDeep<M>[]; refresh: () => Promise<void> };
    error?: { error: Error; refresh: () => Promise<void> };
};

const dataSource = identity(
    <M extends Model>(namespace: string, module: BaseDataModule<M>) =>
        // @vue/component
        tsx.componentFactoryOf<DataSourceEvents<M>, DataSourceSlots<M>>().mixin(IndicatesLoading).create({
            name:  "DataSource",
            props: {
                selector: prop(maybe.object<PouchDB.Find.Selector>()),
                tag:      prop(is.string.notEmpty, "div"),
                slim:     prop(maybe.boolean),
            },
            data: function () {
                return {
                    error: null as Error|null,
                };
            },
            computed: {
                ...mapModuleState(module, namespace, ["items"]),
            },
            watch: {
                selector: {
                    deep: true,
                    handler() {
                        this.refresh();
                    },
                },
            },
            mounted() {
                this.refresh();
            },
            methods: {
                ...mapModuleActions(module, namespace, {
                    getAll:   "all",
                    findSome: "find",
                }),
                async refresh() {
                    try {
                        if (this.selector) {
                            await this.loadingWhile(this.findSome(this.selector));
                        } else {
                            await this.loadingWhile(this.getAll());
                        }

                        this.error = null;
                    } catch (error) {
                        console.error(error);
                        this.error = error;
                    }

                    this.$emit("change", this.items);
                },
            },
            render(): VNode {
                const RootTag = this.tag;

                if (this.loading) {
                    // Short-circuit as loading, since is has priority.
                    const children = normalizeScopedSlot(this, "loading", { loading: true }, []);

                    return this.slim && children.length <= 1 ? children[0] : (<RootTag>{children}</RootTag>);
                }

                if (this.error) {
                    const children = normalizeScopedSlot(this, "error", {
                        error:   this.error,
                        refresh: () => this.refresh(),
                    }, []);
                    if (children.length === 0) {
                        return (
                            <RootTag class="section content has-text-danger has-text-centered">
                                <BField><BIcon icon="emoticon-sad" size="is-large" type="is-danger"/></BField>
                                <BField>There was an error loading.</BField>
                                <BField><BButton label="Try again" type="is-warning" onClick={() => this.refresh()}/></BField>
                                <BField>{this.error.message}</BField>
                            </RootTag>
                        );
                    }

                    return this.slim && children.length <= 1 ? children[0] : (<RootTag>{children}</RootTag>);
                }

                const children = normalizeScopedSlot(this, "default", {
                    items:   this.items,
                    refresh: () => this.refresh(),
                }, []);

                return this.slim && children.length <= 1 ? children[0] : (<RootTag>{children}</RootTag>);
            },
        }),
);

export default dataSource;
