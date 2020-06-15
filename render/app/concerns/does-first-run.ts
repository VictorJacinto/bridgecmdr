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
import { mapModuleActions, mapModuleMutations, mapModuleState } from "../../foundation/helpers/vuex";
import autoStart from "../store/modules/auto-start";
import session from "../store/modules/session";
import settings from "../store/modules/settings";

const DoesFirstRun = Vue.extend({
    name:     "DoesFirstRun",
    computed: {
        attemptedFirstRun: {
            ...mapModuleState(session, "session", {
                get: state => state.attemptedFirstRun || false,
            }),
            ...mapModuleMutations(session, "session", {
                set: (commit, value: boolean) => commit("set", [ "attemptedFirstRun", value ]),
            }),
        },
        doneFirstRun: {
            ...mapModuleState(settings, "settings", {
                get: state => state.doneFirstRun || 0,
            }),
            ...mapModuleMutations(settings, "settings", {
                set: (commit, value: number) => commit("set", [ "doneFirstRun", value ]),
            }),
        },
        ...mapModuleState(autoStart, "autoStart", {
            autoStart: "active",
        }),
    },
    methods: {
        ...mapModuleActions(autoStart, "autoStart", [ "checkAutoStartState", "enableAutoStart" ]),
        async doFirstRun() {
            if (!this.attemptedFirstRun) {
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

                this.attemptedFirstRun = true;
            }
        },
    },
});

type DoesFirstRun = InstanceType<typeof DoesFirstRun>;
export default DoesFirstRun;
