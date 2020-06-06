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
import { normalizeChildren } from "../../../foundation/helpers/vue";
import { mapActions, mapState } from "../../../foundation/helpers/vuex";
import { is, prop } from "../../../foundation/validation/valid";
import Model from "../../support/data/model";
import { BaseDataModule, DataState } from "../../support/data/module";
import { IDPattern } from "../../support/validation";

type DataItemEvents<M extends Model> = {
    onInput(value: ReadonlyDeep<M>|null): void;
};

type DataItemSlots<M extends Model> = {
    default: { current: ReadonlyDeep<M>|null; error: Error|null; loading: boolean };
};

const dataItem = identity(
    <M extends Model>(namespace: string) =>
        tsx.componentFactoryOf<DataItemEvents<M>, DataItemSlots<M>>().create({
            name:  "DataItem",
            props: {
                id:  prop(is.string.matches(IDPattern)),
                tag: prop(is.string.notEmpty, "div"),
            },
            data: function () {
                return {
                    error: null as Error|null,
                };
            },
            computed: {
                ...mapState<DataState<M>>()(namespace, ["current"]),
                loading(): boolean {
                    return this.$data.$loadingWeight > 0;
                },
            },
            watch: {
                id() {
                    this.refresh();
                },
            },
            methods: {
                ...mapActions<BaseDataModule<M>>()(namespace, { getItem: "get" }),
                async refresh() {
                    try {
                        await this.getItem(this.id);
                        this.$emit("input", this.current);
                        this.error = null;
                    } catch (error) {
                        console.error(error);
                        this.error = error;
                    }
                },
            },
            mounted() {
                this.refresh();
            },
            render(): VNode {
                const RootTag = this.tag;

                return (<RootTag>{
                    normalizeChildren(this, "default", {
                        current: this.current,
                        error:   this.error,
                        loading: this.loading,
                    })
                }</RootTag>);
            },
        }),
);

export default dataItem;
