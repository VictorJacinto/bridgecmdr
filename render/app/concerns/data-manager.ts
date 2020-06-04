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

import { clone, identity, isNil } from "lodash";
import Vue, { VueConstructor } from "vue";
import { mapActions, mapGetters } from "../../foundation/helpers/vuex";
import Model from "../support/data/model";
import { BaseModuleEx } from "../support/data/store";

type DataManagerOptions = {
    namespace: string;
    term: string;
    modal?: VueConstructor;
    modalFactory?: () => Promise<VueConstructor>;
};

const dataManager = identity(<M extends Model>(options: DataManagerOptions) => {
    if (isNil(options.modal) && isNil(options.modalFactory)) {
        throw new ReferenceError("No modal or modal factory specified");
    }

    return Vue.extend({
        name:    "DataManager",
        methods: {
            ...mapGetters<BaseModuleEx<M>>()(options.namespace, {
                getEmpty: "empty",
            }),
            ...mapActions<BaseModuleEx<M>>()(options.namespace, {
                doAdd:    "add",
                doUpdate: "update",
                doRemove: "remove",
            }),
            async showModal(item: Partial<M>) {
                const modal = options.modal || await (options.modalFactory as () => Promise<VueConstructor>)();

                return this.$modals.open<M>(modal, {
                    props:       { item: clone(item) },
                    canCancel:   false,
                    fullScreen:  true,
                    customClass: "dialog-like",
                });
            },
            showEditModal(item: M) {
                return this.showModal(item);
            },
            showAddModal() {
                return this.showModal(this.getEmpty());
            },
            async removeItem(item: M) {
                const remove = await this.$dialogs.confirm({
                    message:     `Do you to remove this ${options.term}?`,
                    type:        "is-danger",
                    confirmText: "Remove",
                    focusOn:     "cancel",
                });

                if (remove) {
                    try {
                        await this.doRemove(item._id);
                    } catch (error) {
                        await this.$dialogs.error(error);
                    }
                }
            },
            async updateItem(source: M) {
                const item = await this.showEditModal(source);
                if (item) {
                    try {
                        await this.doUpdate(item);
                    } catch (error) {
                        await this.$dialogs.error(error);
                    }
                }
            },
            async createItem() {
                const item = await this.showAddModal();
                if (item) {
                    try {
                        await this.doAdd(item);
                    } catch (error) {
                        await this.$dialogs.error(error);
                    }
                }
            },
        },
    });
});

export default dataManager;
