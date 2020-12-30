import { get, set } from "lodash";
import type { RegisterOptions } from "../../../foundation/system/vuex";
import { Getter, Module, Mutation, StoreModule } from "../../../foundation/system/vuex";
import store from "../store";

@Module
class Session extends StoreModule {
    hasDoneStartup = false;

    constructor(options: RegisterOptions) {
        super(options);

        for (const [ path, setting ] of Object.entries(window.sessionStorage)) {
            if (!path.startsWith("_")) {
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

        window.sessionStorage.setItem(path, JSON.stringify(value));
    }
}

const session = new Session({ store });

export function mapSession<T>(path: string): { get(): T; set(value: T): void } {
    return {
        get: () => session.get(path) as T,
        set: (value: T) => { session.set(path, value) },
    };
}

export default session;
