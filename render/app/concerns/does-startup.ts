import Vue from "vue";
import Component from "vue-class-component";
import session from "../store/modules/session";

@Component({ name: "DoesStartup" })
export default class DoesStartup extends Vue {
    // eslint-disable-next-line class-methods-use-this
    get hasDoneStartup(): boolean {
        return session.hasDoneStartup;
    }

    // eslint-disable-next-line class-methods-use-this
    set hasDoneStartup(value: boolean) {
        session.set("hasDoneStartup", value);
    }

    beforeDestroy(): void {
        this.hasDoneStartup = true;
    }

    onStart(handle: () => Promise<void>): Promise<void> {
        if (!this.hasDoneStartup) {
            return handle();
        }

        return Promise.resolve();
    }
}
