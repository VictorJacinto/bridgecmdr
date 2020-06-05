import { ModuleState } from "../../../foundation/helpers/vuex";
import Model from "../../support/data/model";
import Module  from "../../support/data/module";
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

const ties = Module.of<Tie, RootState>({
    name:    "ties",
    indices: [
        { sourceId: ["sourceId"] },
        { switchId: ["switchId"] },
    ],
    empty: () => ({
        _id:            undefined,
        sourceId:       undefined,
        switchId:       undefined,
        inputChannel:   0,
        outputChannels: {
            audio: 0,
            video: 0,
        },
    }),
});

export type TiesState = ModuleState<typeof ties>;

export default ties;
