import type { RegisterOptions } from "../../../foundation/support/vuex";
import { Module } from "../../../foundation/support/vuex";
import type Model from "../../support/data/model";
import DataModule from "../base/data-module";
import store from "../store";

export interface TieOutput {
    video: number;
    audio: number;
}

export interface EmptyTie extends Partial<Model> {
    _id?: string;
    sourceId?: string;
    switchId?: string;
    inputChannel: number;
    outputChannels: TieOutput;
}

export interface Tie extends EmptyTie {
    _id: string;
    sourceId: string;
    switchId: string;
    inputChannel: number;
    outputChannels: TieOutput;
}

@Module
class Ties extends DataModule<Tie, Tie, EmptyTie> {
    constructor(register: RegisterOptions) {
        super(register, {
            name:    "ties",
            indices: [
                { sourceId: ["sourceId"] },
                { switchId: ["switchId"] },
            ],
            term:  () => "tie",
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
    }
}

const ties = new Ties({ store });

export default ties;
