import Vue from "vue";
import { mapModuleMutations, mapModuleState } from "../../foundation/helpers/vuex";
import { rootModule } from "../store/store";

const UsesSettingsTitle = Vue.extend({
    name:     "UsesSettingsTitle",
    computed: {
        ...mapModuleState(rootModule, { title: "settingsTitle" }),
    },
    methods: {
        ...mapModuleMutations(rootModule, ["setSettingsTitle"]),
    },
});

type UsesSettingsTitle = InstanceType<typeof UsesSettingsTitle>;
export default UsesSettingsTitle;
