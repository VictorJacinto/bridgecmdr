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

import { isNil } from "lodash";
import Vue from "vue";
import { mapModuleActions, mapModuleState } from "../../foundation/helpers/vuex";
import sources, { Source } from "../store/modules/sources";
import switches, { Switch } from "../store/modules/switches";
import ties, { Tie } from "../store/modules/ties";
import Driver from "../system/driver";

export type Device = {
    source: Source;
    ties: Tie[];
    drivers: Driver[];
};

const CallsDevices = Vue.extend({
    name: "CallsSwitches",
    data: function () {
        return {
            devices: [] as Device[],
        };
    },
    computed: {
        ...mapModuleState(switches, "switches", {
            switches: "items",
        }),
        ...mapModuleState(sources, "sources", {
            sources: "items",
        }),
        ...mapModuleState(ties, "ties", {
            ties: "items",
        }),
    },
    mounted() {
        this.$nextTick(() => this.$loading.while(this.refresh()));
    },
    methods: {
        ...mapModuleActions(switches, "switches", {
            refreshSwitches: "all",
        }),
        ...mapModuleActions(sources, "sources", {
            refreshSources: "all",
        }),
        ...mapModuleActions(ties, "ties", {
            refreshTies: "all",
        }),
        async refresh() {
            await this.refreshTies();
            await this.refreshSwitches();
            await this.refreshSources();

            this.devices.splice(0);

            const load = await Promise.all(this.switches.map(async (switch_): Promise<[ Switch, Driver|Error ]> => {
                try {
                    return [ switch_, await Driver.load(switch_.driverId, switch_.path) ];
                } catch (error) {
                    return [ switch_, error as Error ];
                }
            }));

            const drivers = new Map<string, Driver>();
            const errors = new Map<Switch, Error>();
            for (const [ switch_, result ] of load) {
                if (result instanceof Error) {
                    errors.set(switch_, result);
                } else {
                    drivers.set(switch_._id, result);
                }
            }

            if (errors.size > 0) {
                this.$dialogs.alert({
                    message: `Unable to connect to some switches or monitors\n\n${
                        Array.from(errors.entries()).map(([ switch_, error ]) =>
                            `${switch_.title}: ${error.message}`).join("\n")
                    }`,
                });
            }

            for (const source of this.sources) {
                const device: Device = {
                    source,
                    ties:    this.ties.filter(tie => tie.sourceId === source._id),
                    drivers: [],
                };

                for (const tie of device.ties) {
                    const driver = drivers.get(tie.switchId);
                    if (!isNil(driver)) {
                        device.drivers.push(driver);
                    }
                }

                if (device.ties.length === device.drivers.length) {
                    this.devices.push(device);
                }
            }
        },
        async select(device: Device) {
            await Promise.all(device.ties.map((tie, index) =>
                device.drivers[index].setTie(tie.inputChannel, tie.outputChannels.video, tie.outputChannels.audio),
            ));
        },
        async powerOn(device: Device) {
            await Promise.all(device.ties.map((_tie, index) => device.drivers[index].powerOn()));
        },
        async powerOff(device: Device) {
            await Promise.all(device.ties.map((_tie, index) => device.drivers[index].powerOff()));
        },
    },
});

type CallsDevices = InstanceType<typeof CallsDevices>;
export default CallsDevices;
