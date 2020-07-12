import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { isNil } from "lodash";
import { storeModule } from "../../../foundation/helpers/vuex";
import { RootState } from "../root-state";

type AutoStartState = {
    active:  boolean;
    loading: boolean;
};

// We don't use XDG due to Snap overriding this value.
const homeDir = os.homedir();
const homeConfigDir = path.join(homeDir, ".config");

const autoStart = storeModule<AutoStartState, RootState>().make({
    state: {
        active:  false,
        loading: false,
    },
    mutations: {
        setActive:  (state, value: boolean) => { state.active = value },
        setLoading: (state, value: boolean) => { state.loading = value },
    },
    actions: {
        checkAutoStartState: async ({ commit }) => {
            try {
                commit("setLoading", true);

                let active = false;
                if (homeConfigDir) {
                    const autoStartDir = path.resolve(homeConfigDir, "autostart");
                    const autoStartFile = "org.sleepingcats.BridgeCmdr.desktop";
                    const autoStartPath = path.resolve(autoStartDir, autoStartFile);

                    active = await fs.stat(autoStartPath).
                        then(stat => stat.isFile()).catch(() => false);
                }

                commit("setActive", active);

                return active;
            } finally {
                commit("setLoading", false);
            }
        },
        setAutoStart: async ({ dispatch }, value: boolean) => {
            await (value ? dispatch("enableAutoStart") : dispatch("disableAutoStart"));
        },
        enableAutoStart: async ({ commit }) => {
            try {
                commit("setLoading", true);

                if (isNil(homeConfigDir)) {
                    throw new ReferenceError("The auto-start folder location is unknown");
                }

                const autoStartDir = path.resolve(homeConfigDir, "autostart");
                await fs.mkdir(autoStartDir, { recursive: true });

                const autoStartFile = "org.sleepingcats.BridgeCmdr.desktop";
                const autoStartPath = path.resolve(autoStartDir, autoStartFile);

                const autoStartExists = await fs.stat(autoStartPath).
                    then(stat => stat.isFile()).catch(() => false);
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

                commit("setActive", true);
            } finally {
                commit("setLoading", false);
            }
        },
        disableAutoStart: async ({ commit }) => {
            try {
                commit("setLoading", true);

                if (isNil(homeConfigDir)) {
                    throw new ReferenceError("The auto-start folder location is unknown");
                }

                const autoStartDir = path.resolve(homeConfigDir, "autostart");
                const autoStartFile = "org.sleepingcats.BridgeCmdr.desktop";
                const autoStartPath = path.resolve(autoStartDir, autoStartFile);

                const autoStartExists = await fs.stat(autoStartPath).
                    then(stat => stat.isFile()).catch(() => false);
                if (autoStartExists) {
                    await fs.unlink(autoStartPath);
                }

                commit("setActive", false);
            } finally {
                commit("setLoading", false);
            }
        },
    },
    namespaced: true,
});

export default autoStart;
