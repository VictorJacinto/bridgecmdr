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
