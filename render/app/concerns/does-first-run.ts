import Vue from "vue";
import Component from "vue-class-component";
import autoStart from "../store/modules/auto-start";
import settings from "../store/modules/settings";

@Component({ name: "DoesFirstRun" })
export default class DoesFirstRun extends Vue {
    // eslint-disable-next-line class-methods-use-this
    get doneFirstRun(): number {
        return settings.doneFirstRun;
    }

    // eslint-disable-next-line class-methods-use-this
    set doneFirstRun(value: number) {
        settings.set("doneFirstRun", value);
    }

    // eslint-disable-next-line class-methods-use-this
    get autoStart(): boolean {
        return autoStart.active;
    }

    // eslint-disable-next-line class-methods-use-this
    checkAutoStartState(): Promise<boolean> {
        return autoStart.checkAutoStartState();
    }

    // eslint-disable-next-line class-methods-use-this
    enableAutoStart(): Promise<void> {
        return autoStart.enableAutoStart();
    }

    async doFirstRun(): Promise<void> {
        if (this.doneFirstRun < 1) {
            // v1 - Auto-start file creation.
            const willAutoStart = await this.checkAutoStartState();
            if (!willAutoStart) {
                const createAutoStart = await this.$dialogs.confirm({
                    message: "Do you want BridgeCmdr to start on boot?",
                });

                if (createAutoStart) {
                    try {
                        await this.enableAutoStart();
                    } catch (error: unknown) {
                        await this.$dialogs.error(error);
                    }
                }
            }

            this.doneFirstRun = 1;
        }
    }
}
