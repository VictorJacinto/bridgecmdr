/* eslint-disable class-methods-use-this */
import { toString } from "lodash";
import { openStream, SerialBits, SerialParity, SerialStopBits } from "../../support/streams/command";
import type { DriverDescriptor } from "../driver";
import Driver, { DeviceType, DriverCapabilities } from "../driver";
import { Address, AddressKind, Command, CommandBlock }          from "./support/sony-bvm-support";

const capabilities = DriverCapabilities.none;
const about: DriverDescriptor = Object.freeze({
    guid:  "8626D6D3-C211-4D21-B5CC-F5E3B50D9FF0",
    title: "Sony RS-485 controllable monitor",
    type:  DeviceType.monitor,
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

        return this.sendCommand(Command.setChannel, 1, inputChannel);
    }

    powerOn(): Promise<void> {
        console.log("Sony BVM: Power On");

        return this.sendCommand(Command.powerOn);
    }

    powerOff(): Promise<void> {
        console.log("Sony BVM: Power Off");

        return this.sendCommand(Command.powerOff);
    }

    unload(): Promise<void> {
        return Promise.resolve();
    }

    private async sendCommand(command: Command, arg0 = -1, arg1 = -1): Promise<void> {
        const source = new Address(AddressKind.all, 0);
        const destination = new Address(AddressKind.all, 0);

        const block = new CommandBlock(destination, source, command, arg0, arg1);
        const packet = block.package();

        const connection = await openStream(this.path, {
            baudRate: 38400,
            bits:     SerialBits.eight,
            parity:   SerialParity.odd,
            stopBits: SerialStopBits.one,
        });

        // TODO: Other situation handlers...
        connection.on("data", data => console.debug(`DEBUG: ${about.title}: return: ${toString(data)}`));
        connection.on("error", error => console.error(`ERROR: ${about.title}: ${error.message}`));

        await connection.write(packet.package());
        await connection.close();
    }
}
