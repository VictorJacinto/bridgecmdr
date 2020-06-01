/*
BridgeCmdr - A/V switch and monitor controller
Copyright (C) 2019-2020 Matthew Holder

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
/* eslint-disable class-methods-use-this */

import { openStream, SerialBits, SerialParity, SerialStopBits } from "../../support/streams/command";
import Driver, { DeviceType, DriverCapabilities, DriverDescriptor } from "../driver";

const capabilities =
    DriverCapabilities.HasMultipleOutputs |
    DriverCapabilities.CanDecoupleAudioOutput;
const about: DriverDescriptor = Object.freeze({
    guid:  "4C8F2838-C91D-431E-84DD-3666D14A6E2C",
    title: "Extron SIS-compatible matrix switch",
    type:  DeviceType.Switch,
    capabilities,
});

export default class ExtronMatrixSwitch extends Driver {
    private readonly path: string;

    static about(): DriverDescriptor {
        return about;
    }

    static load(path: string): Promise<Driver> {
        return Promise.resolve(new ExtronMatrixSwitch(path));
    }

    get guid(): string {
        return about.guid;
    }

    get title(): string {
        return about.title;
    }

    get type(): DeviceType {
        return about.type;
    }

    private constructor(path: string) {
        super(capabilities);
        this.path = path;
    }

    async setTie(inputChannel: number, videoOutputChannel: number, audioOutputChannel: number): Promise<void> {
        console.log(`Extron SIS: ${inputChannel}, ${videoOutputChannel}, ${audioOutputChannel}`);

        const videoCommand = `${inputChannel}*${videoOutputChannel}%`;
        const audioCommand = `${inputChannel}*${audioOutputChannel}$`;
        const command      = `${videoCommand}\r\n${audioCommand}\r\n`;

        const connection = await openStream(this.path, {
            baudReat: 9600,
            bits:     SerialBits.EIGHT,
            parity:   SerialParity.NONE,
            stopBits: SerialStopBits.ONE,
            port:     23,
        });

        connection.setEncoding("ascii");

        // TODO: Other situation handlers...
        connection.on("data", data => console.debug(`DEBUG: ${about.title}: return: ${data}`));
        connection.on("error", error => console.error(`ERROR: ${about.title}: ${error}`));

        await connection.write(command);
        await connection.close();
    }

    powerOn(): Promise<void> {
        return Promise.resolve();
    }

    powerOff(): Promise<void> {
        return Promise.resolve();
    }

    unload(): Promise<void> {
        return Promise.resolve();
    }
}
