import { ModuleState } from "../../../foundation/helpers/vuex";
import Model from "../../support/data/model";
import Store from "../../support/data/store";
import { RootState } from "../root-state";

export interface Switch extends Model {
    driverId: string;
    title: string;
    path: string;
}

const switches = Store.of<Switch, RootState>({
    name:  "switches",
    empty: () => ({
        _id:      null,
        driverId: "",
        path:     "",
        title:    "",
    }),
    actions: {
        remove: async ({ commit, dispatch, rootState, database }, id: string) => {
            await database.remove(id);
            commit("delete", id);

            await dispatch("ties/find", { sourceId: id }, { root: true });

            await Promise.all(rootState.ties.items.map(item => dispatch("ties/remove", item._id, { root: true })));
        },
    },
});

export type SwitchesState = ModuleState<typeof switches>;

export default switches;
