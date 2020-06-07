import Vuex  from "vuex";
import { ModuleState } from "../../foundation/helpers/vuex";
import sources from "./modules/sources";
import switches from "./modules/switches";
import ties from "./modules/ties";
import { RootState } from "./root-state";

const isProduction = process.env.NODE_ENV === "production";

export const rootModule = {
    strict:  isProduction,
    modules: {
        sources,
        switches,
        ties,
    },
    state: () => ({
        settingsTitle: "Settings",
    } as RootState),
    mutations: {
        setSettingsTitle: (state: RootState, value: string) => {
            state.settingsTitle = value;
        },
    },
};

const store = new Vuex.Store(rootModule);

export default store;

declare module "./root-state" {
    interface RootState {
        readonly sources: ModuleState<typeof sources>;
        readonly switches: ModuleState<typeof switches>;
        readonly ties: ModuleState<typeof ties>;
    }
}

export { RootState } from "./root-state";
