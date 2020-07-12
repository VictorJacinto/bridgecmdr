// app scaffolding
import Vue from "vue";
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
    const Application = defaultOf(await import(/* webpackMode: "eager" */ "./app/Application"));

    window.theApp = new Application({ el: "#root" });
});
