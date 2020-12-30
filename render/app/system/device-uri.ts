export enum DeviceLocation {
    path = 0,
    port = 1,
    ip   = 2,
}

export function rebuildUri(location: DeviceLocation|undefined, path: string|undefined): string {
    if (location === DeviceLocation.ip) {
        return `ip:${path}`;
    }

    if (location === DeviceLocation.port) {
        return `port:${path}`;
    }

    return path || "";
}

export function getLocationFromUri(path: string): DeviceLocation {
    if (path.startsWith("ip:")) {
        return DeviceLocation.ip;
    }

    if (path.startsWith("port:")) {
        return DeviceLocation.port;
    }

    return DeviceLocation.path;
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
