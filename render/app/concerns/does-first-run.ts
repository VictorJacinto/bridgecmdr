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

import Vue from "vue";
import { mapModuleActions, mapModuleState } from "../../foundation/helpers/vuex";
import autoStart from "../store/modules/auto-start";
import { mapSetting } from "../store/modules/settings";

const DoesFirstRun = Vue.extend({
    name:     "DoesFirstRun",
    computed: {
        doneFirstRun: mapSetting<number>("doneFirstRun"),
        ...mapModuleState(autoStart, "autoStart", {
            autoStart: "active",
        }),
    },
    methods: {
        ...mapModuleActions(autoStart, "autoStart", [ "checkAutoStartState", "enableAutoStart" ]),
        async doFirstRun() {
            if (this.doneFirstRun < 1) {
                // 1. Auto-start file creation.
                const willAutoStart = await this.checkAutoStartState();
                if (!willAutoStart) {
                    const createAutoStart = await this.$dialogs.confirm({
                        message: "Do you want BridgeCmdr to start on boot?",
                    });

                    if (createAutoStart) {
                        try {
                            await this.enableAutoStart();
                        } catch (error) {
                            await this.$dialogs.error(error);
                        }
                    }
                }

                this.doneFirstRun = 1;
            }
        },
    },
});

type DoesFirstRun = InstanceType<typeof DoesFirstRun>;
export default DoesFirstRun;
