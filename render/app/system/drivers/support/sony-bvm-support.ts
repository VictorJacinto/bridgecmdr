/*
 * Sony BVM D-series RS-485 Serial Protocol (Current Understanding)
 *
 * This driver is based on the current understanding of the protocol from observation of the remote output.  This may
 * not be entirely correct and will be missing other information.  Since the packet format vaguely mimics the 9-pin
 * protocol, the packet @types use those names.
 *
 * Packet Format
 * - Byte 1:        Packet type
 * - Byte 2:        Packet size (N)
 * - Byte 3 to N-1: Packet data (D)
 * - Byte 3+N:      Packet checksum; ~(sum(D)) - (N - 1)
 *
 * Command-block Format
 * - Byte 1:    Destination address
 * - Byte 2:    Source address
 * - Byte 3..4: Command
 * - Byte 5:    Arg zero
 * - Byte 6:    Arg one
 *
 * Address Format
 * - Bits 7..5: Address kind
 *   - C - All connected monitors, the address number should be zero.
 *   - 8 - A monitor group, the address number should be the group number.
 *   - 0 - A single monitor, the address number should be the monitor number.
 * - Bits 4..0: Address number
 */

export class SonyDriverError extends Error {
    constructor(message?: string) {
        super(message || "Sony Driver Error");
    }
}

export class PacketError extends SonyDriverError {
    constructor(message?: string) {
        super(message || "Packet Error");
    }
}

export class ChecksumError extends PacketError {
    constructor(message?: string) {
        super(message || "Checksum Error");
    }
}

export class CommandBlockError extends SonyDriverError {
    constructor(message?: string) {
        super(message || "Command Block Error");
    }
}

/** Calculates the checksum for a packet */
function calculateChecksum(data: Buffer): number {
    let x = 0;
    for (const byte of data) {
        x = x + byte;
    }

    x = ~x & 0xFF;
    x = x - (data.byteLength - 1);

    return x;
}

/** Identifies the type of a packet. */
export enum PacketType {
    /** A simple data packet */
    transportControl = 2,
}

/** Represents a data packet that encapsulates the command blocks. */
export class Packet {
    type: PacketType;
    data: Buffer;

    /**
     * Initializes a new instance of the Packet class.
     *
     * @param type     The type of the packet
     * @param data     The data of the packet
     * @param size     If being parsed, the size of the packet to be confirmed
     * @param checksum If being parsed, the checksum of the packet to be confirmed
     */
    constructor(type: PacketType, data: Buffer, size = -1, checksum = -1) {
        // If parsing a packet, ensure the size matches.
        if (size >= 0 && size !== data.length) {
            throw new PacketError("Package and data length mismatched");
        }

        if (checksum > 0) {
            const expected = calculateChecksum(data);
            if (expected !== checksum) {
                throw new ChecksumError("Checksum mismatch");
            }
        }

        this.type = type;
        this.data = data;
    }

    // TODO: Node method for parsing this...

    package(): Buffer {
        const checksum = calculateChecksum(this.data);
        const size     = this.data.byteLength & 0xFF;

        const buffer = Buffer.alloc(3 + size);
        let   pos    = 0;

        buffer.writeUInt8(this.type, pos); pos += 1;
        buffer.writeUInt8(size, pos); pos += 1;
        this.data.copy(buffer, pos); pos += size;
        buffer.writeUInt8(checksum, pos); pos += 1;

        return buffer;
    }
}

/** Identifies the kind of address being used. */
export enum AddressKind {
    /** All monitors are being addressed */
    all = 0xC0,
    /** A group of monitors is addressed */
    group = 0x80,
    /** Only a single monitor is addressed */
    monitor = 0x00,
}

/** Identifies the source or destination of a command block. */
export class Address {
    kind:    AddressKind;
    address: number;

    /**
     * Creates a new instance of the Address class.
     *
     * @param kind    The kind of address being specified
     * @param address The address value
     */
    constructor(kind: AddressKind, address: number) {
        this.kind    = kind;
        this.address = address;
    }

    // TODO: Node method for parsing this...

    /** Creates the raw address value. */
    package(): number {
        return this.kind | this.address;
    }
}

/** Identifies the command being send or received. */
export enum Command {
    /** Sets the channel */
    setChannel = 0x2100,
    /** Powers on the monitor */
    powerOn = 0x293E,
    /** Powers off the monitor */
    powerOff = 0x2A3E,
    /** Emits a control module button */
    button = 0x3F44,
}

export class CommandBlock {
    destination: Address;
    source:      Address;
    command:     Command;
    arg0:        number;
    arg1:        number;

    /**
     * Initializes a new instance of the CommandBlock class.
     *
     * @param destination The destination address
     * @param source      The source address
     * @param command     The command
     * @param arg0        The first argument of the command, if applicable
     * @param arg1        The second argument of the command, if applicable
     */
    constructor(destination: Address, source: Address, command: Command, arg0 = -1, arg1 = -1) {
        this.destination = destination;
        this.source      = source;
        this.command     = command;
        this.arg0        = arg0;
        this.arg1        = arg1;
    }

    // TODO: Node method for parsing this...

    package(): Packet {
        const buffer = Buffer.alloc(6);
        let pos = 0;

        buffer.writeUInt8(this.destination.package(), pos); pos += 1;
        buffer.writeUInt8(this.source.package(), pos); pos += 1;
        buffer.writeUInt16BE(this.command, pos); pos += 2;
        if (this.arg0 >= 0) {
            buffer.writeUInt8(this.arg0, pos); pos += 1;
            if (this.arg1 >= 0) {
                buffer.writeUInt8(this.arg1, pos); pos += 1;
            }
        }

        return new Packet(PacketType.transportControl, buffer.slice(0, pos));
    }
}
