/* eslint-disable class-methods-use-this */
import { toString } from "lodash";
import { openStream, SerialBits, SerialParity, SerialStopBits } from "../../support/streams/command";
import type { DriverDescriptor } from "../driver";
import Driver, { DeviceType, DriverCapabilities } from "../driver";

const capabilities = DriverCapabilities.experimental;
const about: DriverDescriptor = Object.freeze({
    guid:  "91D5BC95-A8E2-4F58-BCAC-A77BA1054D61",
    title: "TeslaSmart-compatible matrix switch",
    type:  DeviceType.switch,
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
            baudRate: 9600,
            bits:     SerialBits.eight,
            parity:   SerialParity.none,
            stopBits: SerialStopBits.one,
        });

        // TODO: Other situation handlers...
        connection.on("data", data => console.debug(`DEBUG: ${about.title}: return: ${toString(data)}`));
        connection.on("error", error => console.error(`ERROR: ${about.title}: ${error.message}`));

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
