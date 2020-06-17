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

const capabilities = DriverCapabilities.Experimental;
const about: DriverDescriptor = Object.freeze({
    guid:  "91D5BC95-A8E2-4F58-BCAC-A77BA1054D61",
    title: "TeslaSmart-compatible matrix switch",
    type:  DeviceType.Switch,
    capabilities,
});

export default class TeslaSmartMatrixSwitch extends Driver {
    private readonly path: string;

    static about(): DriverDescriptor {
        return about;
    }

    static load(path: string): Promise<Driver> {
        return Promise.resolve(new TeslaSmartMatrixSwitch(path));
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

    async setTie(inputChannel: number): Promise<void> {
        console.log(`Tesla: ${inputChannel}`);

        const command = Buffer.from(Uint8Array.from([ 0xAA, 0xBB, 0x03, 0x01, inputChannel, 0xEE ]));

        const connection = await openStream(this.path, {
            baudReat: 9600,
            bits:     SerialBits.EIGHT,
            parity:   SerialParity.NONE,
            stopBits: SerialStopBits.ONE,
        });

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
