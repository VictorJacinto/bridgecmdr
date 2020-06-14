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

import { promises as fs } from "fs";
import path from "path";
import Vue from "vue";
import xdgBasedir from "xdg-basedir";
import { mapModuleMutations, mapModuleState } from "../../foundation/helpers/vuex";
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
    },
    methods: {
        async doFirstRun() {
            const configDir = xdgBasedir.config;
            if (!this.attemptedFirstRun) {
                if (this.doneFirstRun < 1) {
                    // 1. Auto-start file creation.
                    if (configDir) {
                        const autoStartDir = path.resolve(configDir, "autostart");
                        await fs.mkdir(autoStartDir, { recursive: true });

                        const autoStartFile = "org.sleepingcats.BridgeCmdr.desktop";
                        const autoStartPath = path.resolve(autoStartDir, autoStartFile);

                        const autoStartExists = await fs.stat(autoStartPath).
                            then(stat => stat.isFile()).catch(() => false);
                        if (!autoStartExists) {
                            const createAutoStart = await this.$dialogs.confirm({
                                message: "Do you want BridgeCmdr to start on boot?",
                            });

                            if (createAutoStart) {
                                const needsExecProxy = process.execPath.endsWith("electron");
                                const exec = needsExecProxy ?
                                    path.resolve(window.__dirname, "../../bridgecmdr") :
                                    "bridgecmdr";
                                try {
                                    const entry = await fs.open(autoStartPath, "w", 0o644);
                                    await entry.write("[Desktop Entry]\n");
                                    await entry.write("Name=BridgeCmdr\n");
                                    await entry.write(`Exec=${exec}\n`);
                                    await entry.write("NoDisplay=true\n");
                                    await entry.write("Terminal=false\n");
                                } catch (error) {
                                    await this.$dialogs.error(error);
                                }
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
