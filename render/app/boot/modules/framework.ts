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

import "vue-tsx-support/enable-check";
import Buefy from "buefy";
import { configure, localize, extend, ValidationObserver, ValidationProvider } from "vee-validate";
import en from "vee-validate/dist/locale/en.json";
import * as rules from "vee-validate/dist/rules";
import Vue  from "vue";
import VueRouter from "vue-router";
import Vuex from "vuex";
import Dialogs from "../../plugins/dialogs";
import Loading from "../../plugins/loading";
import Modals from "../../plugins/modals";

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(Buefy);
Vue.use(Dialogs);
Vue.use(Modals);
Vue.use(Loading);

/*
 | ---------------------------------------------------------------------------------------------------------------------
 | VeeValidate, the UI validation framework.
 | ---------------------------------------------------------------------------------------------------------------------
*/


Vue.component("ValidationProvider", ValidationProvider);
Vue.component("ValidationObserver", ValidationObserver);
for (const [ rule, validators ] of Object.entries(rules)) {
    // if (rule in messages) {
    //     const message = messages[rule];
    //     extend(rule, { ...validators });
    // } else {
    extend(rule, { ...validators });
    // }
}

localize({ en });

configure({ mode: "passive" });

export default Promise.resolve();
