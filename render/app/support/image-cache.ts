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
