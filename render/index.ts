// app scaffolding
import type Vue from "vue";
import isBooted from "./app/boot/bootstrap";
import { defaultOf } from "./foundation/helpers/module";

// We need to declare the new property for window.
declare global {
    interface Window {
        theApp: Vue;
    }
}

// The main application instance.
window.addEventListener("DOMContentLoaded", async () => {
    await isBooted();

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const Application = defaultOf(await import(/* webpackMode: "eager" */ "./app/Application.vue"));
    window.theApp = new Application({ el: "#root" });
});
