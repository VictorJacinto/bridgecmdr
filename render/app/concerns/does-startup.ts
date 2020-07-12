import Vue from "vue";
import { mapSession } from "../store/modules/session";

const DoesStartup = Vue.extend({
    name:     "DoesStartup",
    computed: {
        hasDoneStartup: mapSession<boolean>("hasDoneStartup"),
    },
    beforeDestroy() {
        this.hasDoneStartup = true;
    },
    methods: {
        onStart(handle: () => Promise<void>): Promise<void> {
            if (!this.hasDoneStartup) {
                return handle();
            }

            return Promise.resolve();
        },
    },
});

type DoesStartup = InstanceType<typeof DoesStartup>;
export default DoesStartup;
