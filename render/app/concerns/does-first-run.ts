import Vue from "vue";
import { mapModuleActions, mapModuleState } from "../../foundation/helpers/vuex";
import autoStart from "../store/modules/auto-start";
import { mapSetting } from "../store/modules/settings";

const DoesFirstRun = Vue.extend({
    name:     "DoesFirstRun",
    computed: {
        doneFirstRun: mapSetting<number>("doneFirstRun"),
        ...mapModuleState(autoStart, "autoStart", {
            autoStart: "active",
        }),
    },
    methods: {
        ...mapModuleActions(autoStart, "autoStart", [ "checkAutoStartState", "enableAutoStart" ]),
        async doFirstRun() {
            if (this.doneFirstRun < 1) {
                // 1. Auto-start file creation.
                const willAutoStart = await this.checkAutoStartState();
                if (!willAutoStart) {
                    const createAutoStart = await this.$dialogs.confirm({
                        message: "Do you want BridgeCmdr to start on boot?",
                    });

                    if (createAutoStart) {
                        try {
                            await this.enableAutoStart();
                        } catch (error) {
                            await this.$dialogs.error(error);
                        }
                    }
                }

                this.doneFirstRun = 1;
            }
        },
    },
});

type DoesFirstRun = InstanceType<typeof DoesFirstRun>;
export default DoesFirstRun;
