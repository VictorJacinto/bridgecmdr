import type { RegisterOptions } from "../../../foundation/system/vuex";
import { Action, Module } from "../../../foundation/system/vuex";
import type Model from "../../support/data/model";
import DataModule, { DATABASE } from "../base/data-module";
import store from "../store";
import ties from "./ties";

export interface Switch extends Model {
    driverId: string;
    title: string;
    path: string;
}

@Module
class Switches extends DataModule<Switch> {
    constructor(register: RegisterOptions) {
        super(register, {
            name:  "switches",
            term:  () => "switch",
            empty: () => ({
                _id:      undefined,
                driverId: undefined,
                path:     "port:",
                title:    "",
            }),
        });
    }

    @Action
    async remove(id: string): Promise<string> {
        const connection = await this[DATABASE];
        await connection.remove(id);

        await ties.find({ switchId: id });

        await Promise.all(ties.items.map(item => ties.remove(item._id)));

        return id;
    }
}

const switches = new Switches({ store });

export default switches;
