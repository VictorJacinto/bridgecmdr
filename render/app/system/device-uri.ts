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

import { last, tail } from "lodash";
import SerialPort from "serialport";

export enum DeviceLocation {
    PATH = 0,
    PORT = 1,
    IP   = 2,
}

export type SerialPortEntry = {
    label: string;
    path:  string;
};

export function generateLabel(port: SerialPort.PortInfo): string {
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

export async function makeSerialPortList(): Promise<SerialPortEntry[]> {
    const ports = await SerialPort.list();
    const list = [] as SerialPortEntry[];
    for (const port of ports) {
        if (port.pnpId && port.pnpId.length) {
            // Use the `by-id` path from the PNP-ID.
            list.push({
                label: generateLabel(port),
                path:  `/dev/serial/by-id/${port.pnpId}`,
            });
        } else {
            // Just use the port path for the label and path.
            list.push({
                label: port.path,
                path:  port.path,
            });
        }
    }

    return list;
}

export function rebuildUri(location: DeviceLocation, path: string): string {
    if (location === DeviceLocation.IP) {
        return `ip:${path}`;
    }

    if (location === DeviceLocation.PORT) {
        return `port:${path}`;
    }

    return path;
}

export function getLocationFromUri(path: string): DeviceLocation {
    if (path.startsWith("ip:")) {
        return DeviceLocation.IP;
    }

    if (path.startsWith("port:")) {
        return DeviceLocation.PORT;
    }

    return DeviceLocation.PATH;
}

export function getPathFromUri(path: string): string {
    if (path.startsWith("ip:")) {
        return path.substr(3);
    }

    if (path.startsWith("port:")) {
        return path.substr(5);
    }

    return path;
}
