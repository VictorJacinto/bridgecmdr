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

import { isNil } from "lodash";
import { Source } from "../store/modules/sources";

type IconData = {
    file: File;
    url: string;
};

export default class ImageCache {
    readonly cache = new Map<string, IconData>();

    constructor() {
        Object.freeze(this);
    }

    get(source: Source): string {
        let data = this.cache.get(source._id);
        if (!isNil(data)) {
            if (data.file === source.image) {
                return data.url;
            }

            URL.revokeObjectURL(data.url);
        }

        data = {
            file: source.image,
            url:  URL.createObjectURL(source.image),
        };

        this.cache.set(source._id, data);

        return data.url;
    }

    revoke(): void {
        for (const data of this.cache.values()) {
            URL.revokeObjectURL(data.url);
        }

        this.cache.clear();
    }
}
