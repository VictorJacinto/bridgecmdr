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
import Vue, { VueConstructor } from "vue";
import { mapModuleActions, mapModuleGetters } from "../../foundation/helpers/vuex";
import Model from "../support/data/model";
import { BaseDataModule } from "../support/data/module";

type ModelType<D extends BaseDataModule<Model>> =
    D extends BaseDataModule<infer M> ? M : never;

const managerData = identity(<D extends BaseDataModule<M>, M extends Model = ModelType<D>>(
    module: D, modal: VueConstructor) =>
    Vue.extend({
        name:     "ManagesData",
        computed: {
            ...mapModuleGetters(module, module.namespace, {
                modelTerm: "term",
            }),
        },
        methods: {
            ...mapModuleGetters(module, module.namespace, {
                getEmpty: "empty",
            }),
            ...mapModuleActions(module, module.namespace, {
                doAdd:    "add",
                doUpdate: "update",
                doRemove: "remove",
            }),
            async showModal(item: Partial<M>) {
                return this.$modals.open<M>(modal, {
                    props:       { item },
                    canCancel:   false,
                    fullScreen:  true,
                    customClass: "dialog-like",
                });
            },
            showEditModal(item: M) {
                return this.showModal(item);
            },
            showAddModal(defaults: Partial<M> = {}) {
                return this.showModal({ ...this.getEmpty(), ...defaults });
            },
            async removeItem(item: M) {
                const remove = await this.$dialogs.confirm({
                    message:     `Do you to remove this ${this.modelTerm}?`,
                    type:        "is-danger",
                    confirmText: "Remove",
                    focusOn:     "cancel",
                });

                if (remove) {
                    try {
                        await this.doRemove(item._id);

                        return true;
                    } catch (error) {
                        await this.$dialogs.error(error);
                    }
                }

                return false;
            },
            async updateItem(source: M) {
                const item = await this.showEditModal(source);
                if (item) {
                    try {
                        return await this.doUpdate(item);
                    } catch (error) {
                        await this.$dialogs.error(error);
                    }
                }

                return null;
            },
            async createItem(defaults: Partial<M> = {}) {
                const item = await this.showAddModal(defaults);
                if (item) {
                    try {
                        return await this.doAdd(item);
                    } catch (error) {
                        await this.$dialogs.error(error);
                    }
                }

                return null;
            },
        },
    }));

export default managerData;
