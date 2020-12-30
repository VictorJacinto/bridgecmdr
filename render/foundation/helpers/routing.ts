import { isEmpty } from "lodash";
import type { VueConstructor } from "vue";
import type { RouteConfig } from "vue-router";

export function route<D extends VueConstructor>(name: string|undefined, path: string, component: D, children?: RouteConfig[]): RouteConfig {
    const props = path.includes(":");

    return { name: isEmpty(name) ? undefined : name, path, component, props, children, caseSensitive: true };
}
