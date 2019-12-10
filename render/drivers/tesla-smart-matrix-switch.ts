/*
BridgeCmdr - A/V switch and monitor controller
Copyright (C) 2019 Matthew Holder

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

import Driver, { DriverCapabilities, DriverDescriptor } from "../support/system/driver";

const capabilities = DriverCapabilities.NONE;

export default class TeslaSmartMatrixSwitch extends Driver {
    static about(): DriverDescriptor {
        return {
            guid:  "91D5BC95-A8E2-4F58-BCAC-A77BA1054D61",
            title: "TeslaSmart-compatible matrix switch",
            capabilities,
        };
    }

    get guid(): string {
        return TeslaSmartMatrixSwitch.about().guid;
    }

    get title(): string {
        return TeslaSmartMatrixSwitch.about().title;
    }

    constructor(path: string) {
        super(path, capabilities);
    }

    setTie(inputChannel: number, videoOutputChannel: number, audioOutputChannel: number): Promise<void> {
        console.log(inputChannel);
        console.log(videoOutputChannel);
        console.log(audioOutputChannel);

        return Promise.resolve();
    }

    powerOn(): Promise<void> {
        return Promise.resolve();
    }

    powerOff(): Promise<void> {
        return Promise.resolve();
    }
}
