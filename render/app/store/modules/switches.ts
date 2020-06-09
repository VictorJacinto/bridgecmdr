import { ModuleState } from "../../../foundation/helpers/vuex";
import Model from "../../support/data/model";
import Module from "../../support/data/module";
import { RootState } from "../root-state";

export interface Switch extends Model {
    driverId: string;
    title: string;
    path: string;
}

const switches = Module.of<Switch, RootState>({
    name:  "switches",
    empty: () => ({
        _id:      undefined,
        driverId: undefined,
        path:     "port:",
        title:    "",
    }),
    actions: {
        remove: async ({ commit, dispatch, rootState, database }, id: string) => {
            await database.remove(id);
            commit("delete", id);

            await dispatch("ties/find", { sourceId: id }, { root: true });

            await Promise.all(rootState.ties.items.map(item => dispatch("ties/remove", item._id, { root: true })));

            return id;
        },
    },
});

export type SwitchesState = ModuleState<typeof switches>;

export default switches;
