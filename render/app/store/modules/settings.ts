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
                try {
                    set(state, path, JSON.parse(setting));
                } catch (error) {
                    console.warn(error);
                }
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
