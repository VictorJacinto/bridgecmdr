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
import Vue, { PropType } from "vue";
import * as tsx from "vue-tsx-support";
import { CombinedVueInstance } from "vue/types/vue";
import { mapActions, mapState } from "../../../foundation/helpers/vuex";
import { RootState } from "../../store/root-state";
import Model from "../../support/data/model";
import { ModuleEx, StateEx } from "../../support/data/store";

type DataSourceEvents = {
};

type DataSourceSlots<M extends Model> = {
    default: { items: ReadonlyDeep<M>[] };
};

type BaseModuleEx<M extends Model> = ModuleEx<M, RootState>;

export const dataSource = identity(
    <M extends Model>(namespace: string) =>
        tsx.componentFactoryOf<DataSourceEvents, DataSourceSlots<M>>().create({
            name:  "DataSource",
            props: {
                selector: { type: Object as PropType<PouchDB.Find.FindRequest<M>>, default: undefined },
            },
            data: function () {
                return {
                    loading: true,
                };
            },
            computed: {
                ...mapState<StateEx<M>>()(namespace, ["items"]),
            },
            methods: {
                ...mapActions<BaseModuleEx<M>>()(namespace, {
                    getAll:   "all",
                    findSome: "find",
                }),
                async refresh() {
                    if (this.selector) {
                        await this.findSome(this.selector);
                    } else {
                        await this.getAll();
                    }
                },
            },
            mounted() {
                this.refresh();
            },
            render() {
                return (<div>{
                    this.$scopedSlots.default && this.$scopedSlots.default({ items: this.items })
                }</div>);
            },
        }),
);

type DataSourceProps<M extends Model> = {
    selector?: PouchDB.Find.FindRequest<M>|undefined;
};

type DataSourceData = {
    loading: boolean;
};

type DataSourceComputed<M extends Model> = {
    items: ReadonlyDeep<M>[];
};

type DataSourceMethods = {
    refresh(): Promise<void>;
};

type DataSourceBase<M extends Model> = CombinedVueInstance<Vue, DataSourceData, DataSourceMethods, DataSourceComputed<M>, DataSourceProps<M>>;

export type DataSourceConstructor<M extends Model> = tsx.TsxComponent<DataSourceBase<M>, DataSourceProps<M>, DataSourceEvents, DataSourceSlots<M>>;

type DataSource<M extends Model> = InstanceType<DataSourceConstructor<M>>;
export default DataSource;
