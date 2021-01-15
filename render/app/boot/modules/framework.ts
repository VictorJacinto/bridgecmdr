import Buefy from "buefy";
import { toString } from "lodash";
import type { Predicate } from "vahvista";
import vahvista from "vahvista";
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

Vue.component("ValidationObserver", ValidationObserver);
Vue.component("validation-observer", ValidationObserver);
Vue.component("ValidationProvider", ValidationProvider);
Vue.component("validation-provider", ValidationProvider);

for (const [ rule, validators ] of Object.entries(rules)) {
    extend(rule, { ...validators });
}

localize({ en });

configure({ mode: "passive" });

// Custom VeeValidate rules.
extend("location", (value: unknown) => {
    const result = toString(value);
    if (result.startsWith("port:")) {
        if (result.length > 5) {
            // We can't check for the port's existence since this must be synchronous.
            return true;
        }

        return "The {_field_} port is required";
    } else if (result.startsWith("ip:")) {
        if (result.length > 3) {
            // TODO: This should be a little more through.
            return true;
        }

        return "The {_field_} IP or hostname is required";
    } else if (result.length > 0) {
        // We can't check for the port's existence since this must be synchronous.
        return true;
    }

    return "The {_field_} path is required";
});

export default Promise.resolve();

/*
 | ---------------------------------------------------------------------------------------------------------------------
 | vahvista, composable validation framework
 | ---------------------------------------------------------------------------------------------------------------------
*/

vahvista.register<string>("id", value =>
    (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/u).test(value));

declare module "vahvista" {
    interface Rules {
        id: Predicate<string>;
    }
}
