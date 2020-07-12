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
