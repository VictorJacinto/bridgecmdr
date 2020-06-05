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
import { mapActions, mapState } from "../../../foundation/helpers/vuex";
import { is, maybe, prop } from "../../../foundation/validation/valid";
import Model from "../../support/data/model";
import { BaseDataModule, DataState } from "../../support/data/module";

type DataSourceEvents<M extends Model> = {
    onChange(items: ReadonlyDeep<M>[]): void;
};

type DataSourceSlots<M extends Model> = {
    default: { items: ReadonlyDeep<M>[]; loading: boolean };
};

const dataSource = identity(
    <M extends Model>(namespace: string) =>
        tsx.componentFactoryOf<DataSourceEvents<M>, DataSourceSlots<M>>().create({
            name:  "DataSource",
            props: {
                selector: prop(maybe.object<PouchDB.Find.FindRequest<M>>()),
                tag:      prop(is.string.notEmpty, "div"),
            },
            data: function () {
                return {
                    error: null as Error|null,
                };
            },
            computed: {
                ...mapState<DataState<M>>()(namespace, ["items"]),
                loading(): boolean {
                    return this.$data.$loadingWeight > 0;
                },
            },
            watch: {
                selector: {
                    deep: true,
                    handler() {
                        this.refresh();
                    },
                },
            },
            methods: {
                ...mapActions<BaseDataModule<M>>()(namespace, {
                    getAll:   "all",
                    findSome: "find",
                }),
                async refresh() {
                    try {
                        if (this.selector) {
                            await this.$loading.while(this.findSome(this.selector));
                        } else {
                            await this.$loading.while(this.getAll());
                        }

                        this.error = null;
                    } catch (error) {
                        this.error = error;
                    }

                    this.$emit("change", this.items);
                },
            },
            mounted() {
                this.refresh();
            },
            render(): VNode {
                const RootTag = this.tag;

                if (this.error) {
                    return (
                        <RootTag class="section">
                            <div class="content has-text-danger has-text-centered">
                                <BField><BIcon icon="emoticon-sad" size="is-large" type="is-danger"/></BField>
                                <BField>There was an error loading.</BField>
                                <BField><BButton label="Try again" type="is-warning" onClick={() => this.refresh()}/></BField>
                                <BField>{this.error.message}</BField>
                            </div>
                        </RootTag>
                    );
                }

                if (this.loading || this.items.length > 0) {
                    return (<RootTag>{
                        normalizeChildren(this, "default", { items: this.items, loading: this.loading })
                    }</RootTag>);
                }

                return (
                    <RootTag class="section">
                        <div class="content has-text-centered">
                            <BField><BIcon icon="set-none" size="is-large" type="is-danger"/></BField>
                            <BField>There are no items.</BField>
                            <BField><BButton label="Refresh" type="is-primary" onClick={() => this.refresh()}/></BField>
                        </div>
                        {
                            /* Still need to render the slot in case there is an add button to start things along */
                            normalizeChildren(this, "default", { items: this.items, loading: this.loading })
                        }
                    </RootTag>
                );
            },
        }),
);

export default dataSource;
