import Model from "../../../foundation/data/model";
import Store, { ModuleState } from "../../../foundation/data/store";
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
});

export type TiesState = ModuleState<typeof ties>;

export default ties;
