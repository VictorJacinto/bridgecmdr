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

import { identity } from "lodash";
import { ReadonlyDeep } from "type-fest";
import { VNode } from "vue";
import * as tsx from "vue-tsx-support";
import { BButton, BField, BIcon } from "../../../foundation/components/buefy-tsx";
import { normalizeChildren } from "../../../foundation/helpers/vue";
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
                slim:     Boolean,
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
                    const children = normalizeChildren(this, "loading", { loading: true });

                    return this.slim && children.length <= 1 ? children[0] : (<RootTag>{children}</RootTag>);
                }

                if (this.error) {
                    const children = normalizeChildren(this, "error", {
                        error:   this.error,
                        refresh: () => this.refresh(),
                    });
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

                const children = normalizeChildren(this, "default", {
                    items:   this.items,
                    refresh: () => this.refresh(),
                });

                return this.slim && children.length <= 1 ? children[0] : (<RootTag>{children}</RootTag>);
            },
        }),
);

export default dataSource;
