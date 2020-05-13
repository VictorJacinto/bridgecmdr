import Vuex, { StoreOptions } from "vuex";
import { RootState } from "./root-state";

const isProduction = process.env.NODE_ENV === "production";

const options: StoreOptions<RootState> = {
    strict:  isProduction,
    modules: {},
};

const store = new Vuex.Store(options);

export default store;

declare module "./root-state" {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface RootState {
        // TODO: Other modules
    }
}

export { RootState } from "./root-state";
