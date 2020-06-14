import Vuex  from "vuex";
import { ModuleState, storeModule } from "../../foundation/helpers/vuex";
import devices from "./modules/devices";
import session from "./modules/session";
import settings from "./modules/settings";
import sources from "./modules/sources";
import switches from "./modules/switches";
import ties from "./modules/ties";
import { RootState } from "./root-state";

const isProduction = process.env.NODE_ENV === "production";

export const rootModule = storeModule<RootState>().make({
    modules: {
        devices,
        session,
        settings,
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
});

const store = new Vuex.Store({ strict: isProduction, ...rootModule });

export default store;

declare module "./root-state" {
    interface RootState {
        readonly devices: ModuleState<typeof devices>;
        readonly settings: ModuleState<typeof settings>;
        readonly sources: ModuleState<typeof sources>;
        readonly switches: ModuleState<typeof switches>;
        readonly ties: ModuleState<typeof ties>;
    }
}

export { RootState } from "./root-state";
