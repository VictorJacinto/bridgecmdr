import { once } from "lodash";

/**
 * Indicates a device's capabilities.
 */
export enum DriverCapabilities {
    /** The device has no extended capabilities. */
    None = 0,
    /** The device has multiple output channels. */
    HasMultipleOutputs = 1 << 0,
    /** The device support sending the audio output to a different channel. */
    CanDecoupleAudioOutput = 1 << 1,
    /** Indicates the driver is experimental. */
    Experimental = 1 << 2,
}

export enum DeviceType {
    /** Indicates that the device is a switch. */
    Switch,
    /** Indicates that the device is a monitor. */
    Monitor,
}

export type DriverDescriptor = {
    readonly guid: string;
    readonly title: string;
    readonly type: DeviceType;
    readonly capabilities: DriverCapabilities;
};

export interface DriverConstructor {
    about(): DriverDescriptor;
    load(path: string): Promise<Driver>;
}

const driverRegistry = new Map<string, DriverConstructor>();
const descriptors = once(() => Array.from(driverRegistry.values()).map(entry => entry.about()));

/**
 * Provides information about and means for operating a switchable device.
 */
export default abstract class Driver {
    /**
     * Gets basic data about all the drivers in the registry.
     */
    static all(): DriverDescriptor[] {
        return descriptors();
    }

    /**
     * Registers a new driver.
     *
     * @param driver The driver construct or class
     */
    static register(driver: DriverConstructor): void {
        // TODO: ow validation

        const guid = String(driver.about().guid).toUpperCase();
        if (driverRegistry.has(guid)) {
            throw new ReferenceError(`Driver already to ${guid}`);
        }

        driverRegistry.set(guid, driver);
    }

    /**
     * Loads a driver.
     *
     * @param guid The GUID that identifies the driver to be loaded
     * @param path The path to the device
     */
    static load(guid: string, path: string): Promise<Driver> {
        // TODO: ow validation

        guid = String(guid).toUpperCase();
        const driver = driverRegistry.get(guid);
        if (driver === undefined) {
            throw new Error(`No such driver with GUID "${guid}"`);
        }

        // eslint-disable-next-line new-cap
        return driver.load(path);
    }

    readonly capabilities: DriverCapabilities;

    /**
     * Initializes a new instance of the Driver class
     *
     * @param capabilities The capabilities of the driver
     */
    protected constructor(capabilities: DriverCapabilities) {
        this.capabilities  = capabilities;

        // Ensure all current properties are read-only.
        // Object.freeze(this);
    }

    /**
     * Gets the GUID for the driver.
     */
    abstract get guid(): string;

    /**
     * Gets the title of the driver.
     */
    abstract get title(): string;

    /**
     * Gets the type of the device operated by the driver.
     */
    abstract get type(): DeviceType;

    /**
     * Sets input and output ties.
     *
     * @param inputChannel       The input channel to tie.
     * @param videoOutputChannel The output video channel to tie.
     * @param audioOutputChannel The output audio channel to tie.
     */
    abstract setTie(inputChannel: number, videoOutputChannel: number, audioOutputChannel: number): Promise<void>;

    /**
     * Powers on the switch or monitor.
     */
    abstract powerOn(): Promise<void>;

    /**
     * Powers off the switch or monitor.
     */
    abstract powerOff(): Promise<void>;

    /**
     * Closes the device to which the driver is attached.
     */
    abstract unload(): Promise<void>;
}
