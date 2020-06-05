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

// TODO: Replace Application.vue.

import VueRouter from "vue-router";
import * as tsx from "vue-tsx-support";
import routes from "./routes";
import store from "./store/store";

const Application = tsx.component({
    name: "Application",
    render() {
        return (<transition mode="out-in"><router-view/></transition>);
    },
    router: new VueRouter({
        linkExactActiveClass: "is-active",
        linkActiveClass:      "",
        routes,
    }),
    store,
});

type Application = InstanceType<typeof Application>;
export default Application;
