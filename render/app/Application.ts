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

// TODO: Replace Application.vue, by converting this to SFC (.vue).

import Vue from "vue";
import Component from "vue-class-component";
import VueRouter from "vue-router";
import routes from "./routes";

@Component({
    template: `
        <router-view/>
    `,
    router: new VueRouter({
        routes,
        linkExactActiveClass: "is-active",
        linkActiveClass:      "",
    }),
})
export default class Application extends Vue {
    // TODO: Implement the application.
}
