import { ModuleState } from "../../../foundation/helpers/vuex";
import Model from "../../support/data/model";
import Store  from "../../support/data/store";
import { RootState } from "../root-state";

export interface TieOutput {
    video: number;
    audio: number;
}

export interface Tie extends Model {
    _id: string;
    sourceId: string;
    switchId: string;
    inputChannel: number;
    outputChannels: TieOutput;
}

const ties = Store.of<Tie, RootState>({
    name:    "ties",
    indices: [
        { sourceId: ["sourceId"] },
        { switchId: ["switchId"] },
    ],
    empty: () => ({
        _id:            null,
        sourceId:       null,
        switchId:       null,
        inputChannel:   0,
        outputChannels: {
            audio: 0,
            video: 0,
        },
    }),
});

export type TiesState = ModuleState<typeof ties>;

export default ties;
