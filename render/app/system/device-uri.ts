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

export enum DeviceLocation {
    PATH = 0,
    PORT = 1,
    IP   = 2,
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
