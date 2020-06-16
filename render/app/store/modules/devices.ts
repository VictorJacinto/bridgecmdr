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

import { isNil, last, tail } from "lodash";
import SerialPort from "serialport";
import { storeModule } from "../../../foundation/helpers/vuex";
import Driver from "../../system/driver";
import { RootState } from "../root-state";
import { Source } from "./sources";
import { Switch } from "./switches";
import { Tie } from "./ties";

export type SerialPortEntry = {
    title: string;
    path: string;
};

export function generateLabel(port: SerialPort.PortInfo): string {
    if (!port.pnpId) {
        return port.path;
    }

    let labelParts = port.pnpId.split("-");
    if (labelParts.length < 3) {
        return port.path;
    }

    for (;;) {
        const part = last(labelParts) as string;
        if ((/^port\d+$/u).test(part)) {
            labelParts.pop();
        } else if ((/^if\d+$/u).test(part)) {
            labelParts.pop();
        } else {
            break;
        }
    }

    labelParts = tail(labelParts);
    if (labelParts.length === 0) {
        return port.path;
    }

    return labelParts.join("-").replace(/_/gu, " ");
}

export type Device = {
    source: Source;
    ties: Tie[];
    drivers: Driver[];
    selected: boolean;
};

type DevicesState = {
    devices: Device[];
    drivers: Driver[];
    ports: SerialPortEntry[];
};

type DriveResult = [ Switch, Driver|Error ];

// noinspection JSUnusedGlobalSymbols
const devices = storeModule<DevicesState, RootState>().make({
    state: {
        devices: [] as Device[],
        drivers: [] as Driver[],
        ports:   [] as SerialPortEntry[],
    },
    mutations: {
        update: (state, params: [ Device[], Driver[] ]) => {
            state.devices.splice(0);
            state.devices.push(...params[0]);
            state.drivers.splice(0);
            state.drivers.push(...params[1]);
        },
        mark: (_, device: Device) => {
            device.selected = true;
        },
        updatePorts: (state, ports: SerialPortEntry[]) => {
            state.ports.splice(0);
            state.ports.push(...ports);
        },
    },
    actions: {
        refresh: async ({ commit, dispatch, rootState }) => {
            await dispatch("ties/all", undefined, { root: true });
            await dispatch("switches/all", undefined, { root: true });
            await dispatch("sources/all", undefined, { root: true });

            const load = await Promise.all(rootState.switches.items.map(async (switch_): Promise<DriveResult> => {
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

            const devices_ = [] as Device[];
            for (const source of rootState.sources.items) {
                const device: Device = {
                    source,
                    ties:     rootState.ties.items.filter(tie => tie.sourceId === source._id),
                    drivers:  [],
                    selected: false,
                };

                for (const tie of device.ties) {
                    const driver = drivers.get(tie.switchId);
                    if (!isNil(driver)) {
                        device.drivers.push(driver);
                    }
                }

                if (device.ties.length > 0 && device.ties.length === device.drivers.length) {
                    devices_.push(device);
                }
            }

            commit("update", [ devices_, Array.from(drivers.values()) ]);

            if (errors.size > 0) {
                throw new Error(`Unable to connect to some switches or monitors\n\n${
                    Array.from(errors.entries()).map(([ switch_, error ]) =>
                        `${switch_.title}: ${error.message}`).join("\n")
                }`);
            }
        },
        select: async ({ commit }, device: Device) => {
            await Promise.all(device.ties.map((tie, index) =>
                device.drivers[index].setTie(tie.inputChannel, tie.outputChannels.video, tie.outputChannels.audio),
            ));

            commit("mark", device);
        },
        powerOff: async ({ state }) => {
            await Promise.all(state.drivers.map(driver => driver.powerOff()));
        },
        powerOn: async ({ state }) => {
            await Promise.all(state.drivers.map(driver => driver.powerOn()));
        },
        getPorts: async ({ commit }) => {
            const ports = await SerialPort.list();
            const list = [] as SerialPortEntry[];
            for (const port of ports) {
                if (port.pnpId && port.pnpId.length) {
                    // Use the `by-id` path from the PNP-ID.
                    list.push({
                        title: generateLabel(port),
                        path:  `/dev/serial/by-id/${port.pnpId}`,
                    });
                } else {
                    // Just use the port path for the label and path.
                    list.push({
                        title: port.path,
                        path:  port.path,
                    });
                }
            }

            commit("updatePorts", list);
        },
    },
    namespaced: true,
});

export default devices;
