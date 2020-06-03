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
import switchEditor from "../pages/settings/SwitchEditor";
import switches, { Switch } from "../store/modules/switches";

const ManagesSwitches = Vue.extend({
    name:    "ManagesSwitches",
    methods: {
        ...mapGetters<typeof switches>()("switches", {
            getEmpty: "empty",
        }),
        ...mapActions<typeof switches>()("switches", {
            doAddSwitch:    "add",
            doUpdateSwitch: "update",
            doRemoveSwitch: "remove",
        }),
        async showEditSwitchModal(item: Partial<Switch>): Promise<Switch|null> {
            // Serial device list required asynchronous loading, so a factory function is used.
            const editor = await switchEditor();

            return this.$modals.open<Switch>(editor, {
                props:       { item: clone(item) },
                canCancel:   false,
                fullScreen:  true,
                customClass: "dialog-like",
            });
        },
        showAddSwitchModal(): Promise<Switch|null> {
            return this.showEditSwitchModal(this.getEmpty());
        },
        async removeSwitch(item: Switch) {
            const remove = await this.$dialogs.confirm({
                message:     "Do you to remove this switch?",
                type:        "is-danger",
                hasIcon:     true,
                confirmText: "Remove",
                focusOn:     "cancel",
            });

            if (remove) {
                try {
                    await this.doRemoveSwitch(item._id);
                } catch (error) {
                    await this.$dialogs.error(error);
                }
            }
        },
        async updateSwitch(item: Switch) {
            const $witch = await this.showEditSwitchModal(item);
            if ($witch) {
                try {
                    await this.doUpdateSwitch($witch);
                } catch (error) {
                    await this.$dialogs.error(error);
                }
            }
        },
        async createSwitch() {
            const $witch = await this.showAddSwitchModal();
            if ($witch) {
                try {
                    await this.doAddSwitch($witch);
                } catch (error) {
                    await this.$dialogs.error(error);
                }
            }
        },
    },
});

export default ManagesSwitches;
