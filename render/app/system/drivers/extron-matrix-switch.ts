/* eslint-disable class-methods-use-this */
import { toString } from "lodash";
import { openStream, SerialBits, SerialParity, SerialStopBits } from "../../support/streams/command";
import type { DriverDescriptor } from "../driver";
import Driver, { DeviceType, DriverCapabilities } from "../driver";

const capabilities =
    DriverCapabilities.hasMultipleOutputs |
    DriverCapabilities.canDecoupleAudioOutput;
const about: DriverDescriptor = Object.freeze({
    guid:  "4C8F2838-C91D-431E-84DD-3666D14A6E2C",
    title: "Extron SIS-compatible matrix switch",
    type:  DeviceType.switch,
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
            baudRate: 9600,
            bits:     SerialBits.eight,
            parity:   SerialParity.none,
            stopBits: SerialStopBits.one,
            port:     23,
        });

        connection.setEncoding("ascii");

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
