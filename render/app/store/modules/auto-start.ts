import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { isNil } from "lodash";
import { Action, Module, Mutation, StoreModule } from "../../../foundation/system/vuex";
import store from "../store";

// We don't use XDG due to Snap overriding this value.
const homeDir = os.homedir();
const homeConfigDir = path.join(homeDir, ".config");

@Module
class AutoStart extends StoreModule {
    active = false;
    loading = false;

    @Mutation
    setActive(value: boolean): void {
        this.active = value;
    }

    @Mutation
    setLoading(value: boolean): void {
        this.loading = value;
    }

    @Action
    async checkAutoStartState(): Promise<boolean> {
        try {
            this.setLoading(true);

            let active = false;
            if (homeConfigDir) {
                const autoStartDir = path.resolve(homeConfigDir, "autostart");
                const autoStartFile = "org.sleepingcats.BridgeCmdr.desktop";
                const autoStartPath = path.resolve(autoStartDir, autoStartFile);

                active = await fs.stat(autoStartPath).
                    then(stat => stat.isFile()).
                    catch(() => false);
            }

            this.setActive(active);

            return active;
        } finally {
            this.setLoading(false);
        }
    }

    @Action
    setAutoStart(active: boolean): Promise<void> {
        return active ? this.enableAutoStart() : this.disableAutoStart();
    }

    @Action
    async enableAutoStart(): Promise<void> {
        try {
            this.setLoading(true);

            if (isNil(homeConfigDir)) {
                throw new ReferenceError("The auto-start folder location is unknown");
            }

            const autoStartDir = path.resolve(homeConfigDir, "autostart");
            await fs.mkdir(autoStartDir, { recursive: true });

            const autoStartFile = "org.sleepingcats.BridgeCmdr.desktop";
            const autoStartPath = path.resolve(autoStartDir, autoStartFile);

            const autoStartExists = await fs.stat(autoStartPath).
                then(stat => stat.isFile()).
                catch(() => false);

            if (!autoStartExists) {
                const needsExecProxy = process.execPath.endsWith("electron");
                const exec = needsExecProxy ?
                    path.resolve(window.__dirname, "../../bridgecmdr") :
                    "bridgecmdr";

                const entry = await fs.open(autoStartPath, "w", 0o644);
                await entry.write("[Desktop Entry]\n");
                await entry.write("Name=BridgeCmdr\n");
                await entry.write(`Exec=${exec}\n`);
                await entry.write("NoDisplay=true\n");
                await entry.write("Terminal=false\n");
            }

            this.setActive(true);
        } finally {
            this.setLoading(false);
        }
    }

    @Action
    async disableAutoStart(): Promise<void> {
        try {
            this.setLoading(true);

            if (isNil(homeConfigDir)) {
                throw new ReferenceError("The auto-start folder location is unknown");
            }

            const autoStartDir = path.resolve(homeConfigDir, "autostart");
            const autoStartFile = "org.sleepingcats.BridgeCmdr.desktop";
            const autoStartPath = path.resolve(autoStartDir, autoStartFile);

            const autoStartExists = await fs.stat(autoStartPath).
                then(stat => stat.isFile()).
                catch(() => false);

            if (autoStartExists) {
                await fs.unlink(autoStartPath);
            }

            this.setActive(false);
        } finally {
            this.setLoading(false);
        }
    }
}

const autoStart = new AutoStart({ store });

export default autoStart;
