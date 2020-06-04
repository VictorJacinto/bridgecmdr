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

import { clone } from "lodash";
import Vue from "vue";
import { mapActions, mapGetters } from "../../foundation/helpers/vuex";
import SourceModal from "../components/modals/SourceModal";
import sources, { Source } from "../store/modules/sources";

const ManagesSources = Vue.extend({
    name:    "ManagesSources",
    methods: {
        ...mapGetters<typeof sources>()("sources", {
            getEmpty: "empty",
        }),
        ...mapActions<typeof sources>()("sources", {
            doAddSource:    "add",
            doUpdateSource: "update",
            doRemoveSource: "remove",
        }),
        showSourceModal(item: Partial<Source>) {
            return this.$modals.open<Source>(SourceModal, {
                props:       { item: clone(item) },
                canCancel:   false,
                fullScreen:  true,
                customClass: "dialog-like",
            });
        },
        showEditSourceModal(item: Source) {
            return this.showSourceModal(item);
        },
        showAddSourceModal() {
            return this.showSourceModal(this.getEmpty());
        },
        async removeSource(item: Source) {
            const remove = await this.$dialogs.confirm({
                message:     "Do you to remove this source?",
                type:        "is-danger",
                confirmText: "Remove",
                focusOn:     "cancel",
            });

            if (remove) {
                try {
                    await this.doRemoveSource(item._id);
                } catch (error) {
                    await this.$dialogs.error(error);
                }
            }
        },
        async updateSource(item: Source) {
            const source = await this.showEditSourceModal(item);
            if (source) {
                try {
                    await this.doUpdateSource(source);
                } catch (error) {
                    await this.$dialogs.error(error);
                }
            }
        },
        async createSource() {
            const source = await this.showAddSourceModal();
            if (source) {
                try {
                    await this.doAddSource(source);
                } catch (error) {
                    await this.$dialogs.error(error);
                }
            }
        },
    },
});

type ManagesSources = InstanceType<typeof ManagesSources>;
export default ManagesSources;
