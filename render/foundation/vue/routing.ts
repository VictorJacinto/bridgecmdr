import { isEmpty } from "lodash";
import { VueConstructor } from "vue";
import { RouteConfig } from "vue-router";

export function route<D extends VueConstructor>(name: string, path: string, component: D, ...children: RouteConfig[]): RouteConfig {
    return { name: isEmpty(name) ? undefined : name, path, component, children, caseSensitive: true };
}
