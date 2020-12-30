/* eslint-disable @typescript-eslint/no-explicit-any */
import net from "net";
import type stream from "stream";
import _ from "lodash";
import SerialPort from "serialport";

export interface CommandStream {
    setEncoding(encoding: BufferEncoding): this;
    write(data: Buffer|string): Promise<void>;
    close(): Promise<void>;
    on(event: "data", listener: (chunk: any) => void): this;
    on(event: "error", listener: (error: Error) => void): this;
    on(event: string|symbol, listener: (...args: any[]) => void): this;
}

abstract class AbstractStream<Stream extends stream.Duplex> implements CommandStream {
    protected connection: Stream;

    protected constructor(connection: Stream) {
        this.connection = connection;
    }

    setEncoding(encoding: BufferEncoding): this {
        this.connection.setEncoding(encoding);

        return this;
    }

    on(event: string | symbol, listener: (...args: any[]) => void): this {
        this.connection.on(event, listener);

        return this;
    }

    write(data: string|Buffer): Promise<void> {
        return new Promise((resolve, reject) => {
            const ctx = {
                then:  () => { resolve(); ctx.done() },
                error: (error: Error) => { reject(error); ctx.done() },
                done:  () => { this.connection.off("error", ctx.error) },
            };

            this.connection.once("error", ctx.error);
            typeof data === "string" ?
                this.connection.write(data, "ascii", ctx.then) :
                this.connection.write(data, ctx.then);
        });
    }

    public abstract close(): Promise<void>;
}

class SerialStream extends AbstractStream<SerialPort> {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(connection: SerialPort) {
        super(connection);
    }

    async close(): Promise<void> {
        await new Promise((resolve, reject) => {
            this.connection.close(error => { error ? reject(error) : resolve(undefined) });
        });

        this.connection.destroy();
    }
}

class NetStream extends AbstractStream<net.Socket> {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(connection: net.Socket) {
        super(connection);
    }

    async close(): Promise<void> {
        await new Promise((resolve, reject) => {
            this.connection.once("error", error => reject(error));
            this.connection.end(() => resolve(undefined));
        });

        this.connection.destroy();
    }
}

export enum SerialBits {
    five  = 5,
    six   = 6,
    seven = 7,
    eight = 8,
}

export enum SerialStopBits {
    one = 1,
    two = 2,
}

export enum SerialParity {
    none  = "none",
    even  = "even",
    mark  = "mark",
    odd   = "odd",
    space = "space",
}

export interface CombinedStreamOptions {
    baudRate?: number;
    bits?:     SerialBits;
    stopBits?: SerialStopBits;
    parity?:   SerialParity;
    port?:     number;
}

const defaultOptions: CombinedStreamOptions = Object.freeze({
    baudRate: 9600,
    bits:     SerialBits.eight,
    stopBits: SerialStopBits.one,
    parity:   SerialParity.none,
    port:     23,
});

export function openStream(path: string, options = defaultOptions): Promise<CommandStream> {
    options = _.defaults(options, defaultOptions);

    if (path.startsWith("port:")) {
        const serialOptions: SerialPort.OpenOptions = {
            baudRate: options.baudRate,
            dataBits: options.bits,
            stopBits: options.stopBits,
            parity:   options.parity,
            lock:     false,
        };

        path = path.substr(5);

        return new Promise((resolve, reject) => {
            const port = new SerialPort(path, serialOptions, error => {
                error ? reject(error) : resolve(new SerialStream(port));
            });
        });
    }

    if (path.startsWith("ip:")) {
        path = path.substr(3);

        return new Promise((resolve, reject) => {
            const socket = new net.Socket();
            const ctx    = {
                connect: () => { resolve(new NetStream(socket)); ctx.done() },
                error:   (error: Error) => { reject(error); ctx.done() },
                done:    () => {
                    socket.removeListener("connect", ctx.connect);
                    socket.removeListener("error", ctx.error);
                },
            };

            socket.once("connect", ctx.connect);
            socket.once("error", ctx.error);

            socket.connect(options.port || 23, path);
        });
    }

    throw new Error("Not yet supported");
}
