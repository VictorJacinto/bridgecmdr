import { get, set } from "lodash";
import { mapModuleMutations, mapModuleState, storeModule } from "../../../foundation/helpers/vuex";
import { RootState } from "../root-state";

type SessionState = {
    hasDoneStartup: boolean;
};

const session = storeModule<SessionState, RootState>().make({
    state: () => {
        // Default session state.
        const state = {
            hasDoneStartup: false,
        };

        for (const [ path, setting ] of Object.entries(window.sessionStorage)) {
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

            window.sessionStorage.setItem(path, JSON.stringify(value));
        },
    },
    namespaced: true,
});

export function mapSession<T>(path: string): { get(): T; set(value: T): void } {
    return {
        ...mapModuleState(session, "session", {
            get: state => get(state, path) as T,
        }),
        ...mapModuleMutations(session, "session", {
            set: (commit, value: T) => commit("set", [ path, value ]),
        }),
    };
}

export default session;
