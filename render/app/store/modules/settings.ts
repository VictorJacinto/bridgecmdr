import { get, set } from "lodash";
import type { RegisterOptions } from "../../../foundation/support/vuex";
import { Getter, Module, Mutation, StoreModule } from "../../../foundation/support/vuex";
import store from "../store";

export const IconSize = [ "is-128x128", "is-96x96", "is-64x64", "is-48x48" ] as const;
export type IconSize = typeof IconSize[number];

export const PowerOffTaps = [ "single", "double" ] as const;
export type PowerOffTaps = typeof PowerOffTaps[number];

const ignore: Record<string, boolean> = {
    "debug": true,
};

@Module
class Settings extends StoreModule {
    powerOnSwitchesAtStart = false;
    doneFirstRun = 0;
    powerOffWhen = PowerOffTaps[0] as PowerOffTaps;
    iconSize = IconSize[0] as IconSize;

    constructor(options: RegisterOptions) {
        super(options);

        for (const [ path, setting ] of Object.entries(window.localStorage)) {
            if (!path.startsWith("_") && !ignore[path]) {
                try {
                    set(this, path, JSON.parse(setting));
                } catch (error: unknown) {
                    console.warn(error);
                }
            }
        }
    }

    @Getter
    get(path: string): unknown {
        return get(this, path);
    }

    @Mutation
    set(path: string, value: unknown): void {
        set(this, path, value);

        window.localStorage.setItem(path, JSON.stringify(value));
    }
}

const settings = new Settings({ store });

export function mapSetting<T>(path: string): { get(): T; set(value: T): void } {
    return {
        get: () => settings.get(path) as T,
        set: (value: T) => { settings.set(path, value) },
    };
}

export default settings;
