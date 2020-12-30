import Vue from "vue";
import Component from "vue-class-component";
import userInterface from "../store/modules/user-interface";

@Component<UsesSettingsTitle>({ name: "UsesSettingsTitle" })
export default class UsesSettingsTitle extends Vue {
    // eslint-disable-next-line class-methods-use-this
    get title(): string {
        return userInterface.settingsTitle;
    }

    // eslint-disable-next-line class-methods-use-this
    set title(value: string) {
        userInterface.settingsTitle = value;
    }
}
