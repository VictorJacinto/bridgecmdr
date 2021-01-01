import { isNil, last, tail } from "lodash";
import SerialPort from "serialport";
import { Action, Module, Mutation, StoreModule } from "../../../foundation/support/vuex";
import Driver from "../../system/driver";
import store from "../store";
import type { Source } from "./sources";
import sources from "./sources";
import type { Switch } from "./switches";
import switches from "./switches";
import type { Tie } from "./ties";
import ties from "./ties";

export type SerialPortEntry = {
    title: string;
    path: string;
};

export type Device = {
    source: Source;
    ties: Tie[];
    drivers: Driver[];
    selected: boolean;
};

type DriveResult = [ Switch, Driver|Error ];

@Module
class Devices extends StoreModule {
    devices = [] as Device[];
    drivers = [] as Driver[];
    ports = [] as SerialPortEntry[];

    @Mutation
    update(devices: Device[], drivers: Driver[]): void {
        this.devices.splice(0);
        this.devices.push(...devices);
        this.drivers.splice(0);
        this.drivers.push(...drivers);
    }

    @Mutation
    // eslint-disable-next-line class-methods-use-this
    mark(device: Device): void {
        device.selected = true;
    }

    @Mutation
    updatePorts(ports: SerialPortEntry[]): void {
        this.ports.splice(0);
        this.ports.push(...ports);
    }

    @Action
    async refresh(): Promise<void> {
        await ties.all();
        await switches.all();
        await sources.all();

        const load = await Promise.all(switches.items.map(async (switch_): Promise<DriveResult> => {
            try {
                return [ switch_, await Driver.load(switch_.driverId, switch_.path) ];
            } catch (error: unknown) {
                return [ switch_, error as Error ];
            }
        }));

        const drivers = new Map<string, Driver>();
        const errors = new Map<Switch, Error>();
        for (const [ switch_, result ] of load) {
            if (result instanceof Error) {
                errors.set(switch_, result);
            } else {
                drivers.set(switch_._id, result);
            }
        }

        const devices_ = [] as Device[];
        for (const source of sources.items) {
            const device: Device = {
                source,
                ties:     ties.items.filter(tie => tie.sourceId === source._id),
                drivers:  [],
                selected: false,
            };

            for (const tie of device.ties) {
                const driver = drivers.get(tie.switchId);
                if (!isNil(driver)) {
                    device.drivers.push(driver);
                }
            }

            if (device.ties.length > 0 && device.ties.length === device.drivers.length) {
                devices_.push(device);
            }
        }

        this.update(devices_, Array.from(drivers.values()));

        if (errors.size > 0) {
            throw new Error(`Unable to connect to some switches or monitors\n\n${
                Array.from(errors.entries()).map(([ switch_, error ]) =>
                    `${switch_.title}: ${error.message}`).join("\n")
            }`);
        }
    }

    @Action
    async select(device: Device): Promise<void> {
        await Promise.all(device.ties.map((tie, index) =>
            device.drivers[index].setTie(tie.inputChannel, tie.outputChannels.video, tie.outputChannels.audio),
        ));

        this.mark(device);
    }

    @Action
    async powerOff(): Promise<void> {
        await Promise.all(this.drivers.map(driver => driver.powerOff()));
    }

    @Action
    async powerOn(): Promise<void> {
        await Promise.all(this.drivers.map(driver => driver.powerOn()));
    }

    @Action
    async getPorts(): Promise<void> {
        const ports = await SerialPort.list();
        const list = [] as SerialPortEntry[];
        for (const port of ports) {
            if (port.pnpId && port.pnpId.length) {
            // Use the `by-id` path from the PNP-ID.
                list.push({
                    title: Devices.generateLabel(port),
                    path:  `/dev/serial/by-id/${port.pnpId}`,
                });
            } else {
            // Just use the port path for the label and path.
                list.push({
                    title: port.path,
                    path:  port.path,
                });
            }
        }

        this.updatePorts(list);
    }

    private static generateLabel(port: SerialPort.PortInfo): string {
        if (!port.pnpId) {
            return port.path;
        }

        let labelParts = port.pnpId.split("-");
        if (labelParts.length < 3) {
            return port.path;
        }

        for (;;) {
            const part = last(labelParts) as string;
            if ((/^port\d+$/u).test(part)) {
                labelParts.pop();
            } else if ((/^if\d+$/u).test(part)) {
                labelParts.pop();
            } else {
                break;
            }
        }

        labelParts = tail(labelParts);
        if (labelParts.length === 0) {
            return port.path;
        }

        return labelParts.join("-").replace(/_/gu, " ");
    }
}

// noinspection JSUnusedGlobalSymbols
const devices = new Devices({ store });

export default devices;
