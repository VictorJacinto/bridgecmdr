import type { ModuleOptions, RegisterOptions } from "./options";
import { OPTIONS } from "./options";

export class StoreModule {
    static [OPTIONS]?: ModuleOptions;

    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(_options: RegisterOptions) {
        // Simply provides the common constructor signature.
    }
}
