import { once } from "lodash";
import { defaultOf } from "../../foundation/helpers/module";

const isBooted = once(async () => {
    await Promise.all([
        defaultOf(await import(/* webpackMode: "eager" */ "./modules/drivers")),
        defaultOf(await import(/* webpackMode: "eager" */ "./modules/axios")),
        defaultOf(await import(/* webpackMode: "eager" */ "./modules/framework")),
    ]);
});

export default isBooted;
