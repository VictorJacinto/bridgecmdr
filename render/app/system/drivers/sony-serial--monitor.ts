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
import { Address, AddressKind, Command, CommandBlock }          from "./support/sony-bvm-support";

const capabilities = DriverCapabilities.None;
const about: DriverDescriptor = Object.freeze({
    guid:  "8626D6D3-C211-4D21-B5CC-F5E3B50D9FF0",
    title: "Sony RS-485 controllable monitor",
    type:  DeviceType.Monitor,
    capabilities,
});

export default class SonySerialMonitor extends Driver {
    private readonly path: string;

    static about(): DriverDescriptor {
        return about;
    }

    static load(path: string): Promise<Driver> {
        return Promise.resolve(new SonySerialMonitor(path));
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

    setTie(inputChannel: number): Promise<void> {
        console.log(`Sony BVM: ${inputChannel}`);

        return this.sendCommand(Command.SET_CHANNEL, 1, inputChannel);
    }

    powerOn(): Promise<void> {
        console.log("Sony BVM: Power On");

        return this.sendCommand(Command.POWER_ON);
    }

    powerOff(): Promise<void> {
        console.log("Sony BVM: Power Off");

        return this.sendCommand(Command.POWER_OFF);
    }

    unload(): Promise<void> {
        return Promise.resolve();
    }

    private async sendCommand(command: Command, arg0 = -1, arg1 = -1): Promise<void> {
        const source = new Address(AddressKind.ALL, 0);
        const destination = new Address(AddressKind.ALL, 0);

        const block = new CommandBlock(destination, source, command, arg0, arg1);
        const packet = block.package();

        const connection = await openStream(this.path, {
            baudReat: 38400,
            bits:     SerialBits.EIGHT,
            parity:   SerialParity.ODD,
            stopBits: SerialStopBits.ONE,
        });

        // TODO: Other situation handlers...
        connection.on("data", data => console.debug(`DEBUG: ${about.title}: return: ${data}`));
        connection.on("error", error => console.error(`ERROR: ${about.title}: ${error}`));

        await connection.write(packet.package());
        await connection.close();
    }
}
