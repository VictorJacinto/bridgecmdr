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

import { get, set } from "lodash";
import { mapModuleMutations, mapModuleState, storeModule } from "../../../foundation/helpers/vuex";
import { RootState } from "../root-state";

export const IconSize = [ "is-128x128", "is-96x96", "is-64x64", "is-48x48" ] as const;
export type IconSize = typeof IconSize[number];

export const PowerOffTaps = [ "single", "double" ] as const;
export type PowerOffTaps = typeof PowerOffTaps[number];

type SettingsState = {
    powerOnSwitchesAtStart: boolean;
    doneFirstRun: number;
    powerOffWhen: PowerOffTaps;
    iconSize: IconSize;
};

const settings = storeModule<SettingsState, RootState>().make({
    state: () => {
        // Default settings state.
        const state = {
            powerOnSwitchesAtStart: false,
            doneFirstRun:           0,
            powerOffWhen:           PowerOffTaps[0],
            iconSize:               IconSize[0],
        };

        for (const [ path, setting ] of Object.entries(window.localStorage)) {
            if (!path.startsWith("_")) {
                set(state, path, JSON.parse(setting));
            }
        }

        return state;
    },
    getters: {
        get: (state, path: string) => get(state, path),
    },
    mutations: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        set: (state, [ path , value ]: [ string, any ]) => {
            set(state, path, value);

            window.localStorage.setItem(path, JSON.stringify(value));
        },
    },
    namespaced: true,
});

export function mapSetting<T>(path: string): { get(): T; set(value: T): void } {
    return {
        ...mapModuleState(settings, "settings", {
            get: state => get(state, path) as T,
        }),
        ...mapModuleMutations(settings, "settings", {
            set: (commit, value: T) => commit("set", [ path, value ]),
        }),
    };
}

export default settings;
