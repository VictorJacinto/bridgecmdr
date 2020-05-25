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

import { identity, isNil } from "lodash";
import * as tsx from "vue-tsx-support";
import { CombinedVueInstance } from "vue/types/vue";
import { SetNullable } from "../../../foundation/helpers/type";
import { mapActions, mapGetters, mapState } from "../../../foundation/helpers/vuex";
import { RootState } from "../../store/root-state";
import Model from "../../support/data/model";
import { ModuleEx, StateEx } from "../../support/data/store";

type DataItemEvents = {
};

type DataItemSlots<M extends Model> = {
    default: { current: SetNullable<M> };
};

type BaseModuleEx<M extends Model> = ModuleEx<M, RootState>;

export const dataItem = identity(
    <M extends Model>(namespace: string) =>
        tsx.componentFactoryOf<DataItemEvents, DataItemSlots<M>>().create({
            name:  "DataItem",
            props: {
                id: { type: String, default: undefined },
            },
            data: function () {
                const getters = mapGetters<BaseModuleEx<M>>()(namespace, { getEmpty: "empty" });

                return {
                    loading: true,
                    item:    getters.getEmpty.call(this),
                };
            },
            methods: {
                ...mapState<StateEx<M>>()(namespace, { getCurrent: "current" }),
                ...mapGetters<BaseModuleEx<M>>()(namespace, { getEmpty: "empty" }),
                ...mapActions<BaseModuleEx<M>>()(namespace, { getItem: "get" }),
                async refresh() {
                    this.loading = true;
                    this.item = this.getEmpty();
                    if (!isNil(this.id)) {
                        try {
                            await this.getItem(this.id);

                            this.item = this.getCurrent() as SetNullable<M>;
                        } catch (error) {
                            console.error(error);
                        }
                    }

                    this.loading = false;
                },
            },
            mounted() {
                this.refresh();
            },
            render() {
                return (<div>{
                    this.$scopedSlots.default && this.$scopedSlots.default({ current: this.item })
                }</div>);
            },
        }),
);

type DataItemProps = {
    id?: string|undefined;
};

type DataItemData<M extends Model> = {
    loading: boolean;
    item: SetNullable<M>;
};

type DataItemComputed = {
};

type DataItemMethods = {
    refresh(): Promise<void>;
};

type DataItemBase<M extends Model> = CombinedVueInstance<Vue, DataItemData<M>, DataItemComputed, DataItemMethods, DataItemProps>;

export type DataItemConstructor<M extends Model> = tsx.TsxComponent<DataItemBase<M>, DataItemProps, DataItemEvents, DataItemSlots<M>>;

type DataItem<M extends Model> = InstanceType<DataItemConstructor<M>>;
export default DataItem;
