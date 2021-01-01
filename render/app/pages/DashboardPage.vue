<template>
    <div id="dashboard-page">
        <div class="dashboard">
            <button v-for="device of devices" :key="device.source._id" class="button is-light"
                    :title="device.source.title" @click="select(device)">
                <figure :class="imageClasses">
                    <img :src="images.get(device.source)" :alt="device.source.title">
                </figure>
            </button>
        </div>
        <div id="dashboard-action-buttons" class="fab-container is-right">
            <span class="is-inline-block pt-4">{{ packageInfo.productName }} {{ packageInfo.version }}</span>
            <b-button class="fab-item" icon-left="power" size="is-medium" type="is-danger"
                      @click="onPowerOffClicked"/>
            <b-button class="fab-item" icon-left="wrench" size="is-medium" type="is-link"
                      @click="onSettingsClicked"/>
        </div>
    </div>
</template>

<script lang="ts">
    import { cloneDeep } from "lodash";
    import Component, { mixins } from "vue-class-component";
    import packageInfo from "../../../package.json";
    import DoesFirstRun from "../concerns/does-first-run";
    import DoesStartup from "../concerns/does-startup";
    import HasImages from "../concerns/has-images";
    import type { Device } from "../store/modules/devices";
    import devices from "../store/modules/devices";
    import type { IconSize, PowerOffTaps } from "../store/modules/settings";
    import settings from "../store/modules/settings";
    import { signalShutdown } from "../support/dbus";

    const powerOffDoubleTapTimeout = 2000;

    @Component<DashboardPage>({ name: "DashboardPage" })
    export default class DashboardPage extends mixins(DoesStartup, DoesFirstRun, HasImages) {
        lastPowerOffTapTime = 0;

        packageInfo = cloneDeep(packageInfo);

        get devices(): Device[] {
            return devices.devices;
        }

        get iconSize(): IconSize {
            return settings.iconSize;
        }

        get powerOffWhen(): PowerOffTaps {
            return settings.powerOffWhen;
        }

        get powerOnSwitchesAtStart(): boolean {
            return settings.powerOnSwitchesAtStart;
        }

        get imageClasses(): string[] {
            return [ "image", "icon", this.iconSize ];
        }

        mounted(): void {
            this.$nextTick(async () => {
                await this.onStart(() => this.doFirstRun());

                try {
                    await this.$loading.while(this.refresh());
                } catch (error: unknown) {
                    await this.$dialogs.error(error);
                }

                await this.onStart(async () => {
                    if (this.powerOnSwitchesAtStart) {
                        await this.powerOn();
                    }
                });
            });
        }

        refresh(): Promise<void> {
            return devices.refresh();
        }

        select(device: Device): Promise<void> {
            return devices.select(device);
        }

        powerOn(): Promise<void> {
            return devices.powerOn();
        }

        powerOff(): Promise<void> {
            return devices.powerOff();
        }

        async onPowerOffClicked(): Promise<void> {
            if (this.powerOffWhen === "single") {
                await this.doPowerOff();
            } else if (Date.now() - this.lastPowerOffTapTime <= powerOffDoubleTapTimeout) {
                await this.doPowerOff();
            } else {
                this.lastPowerOffTapTime = Date.now();
                this.$buefy.notification.open({
                    message:  "Tap the power button again to power off",
                    duration: powerOffDoubleTapTimeout,
                    position: "is-bottom-left",
                    type:     "is-danger",
                });
            }
        }

        async onSettingsClicked(): Promise<void> {
            await this.$router.push({ name: "settings" });
        }

        async doPowerOff(): Promise<void> {
            try {
                await this.powerOff();

                if (process.env.NODE_ENV === "production") {
                    try {
                        await signalShutdown();
                    } catch (error: unknown) {
                        await this.$dialogs.error(error);
                    }
                }
            } finally {
                window.close();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .dashboard {
        .button {
            margin-top: 0.25rem;
            margin-left: 0.25rem;
            height: auto;
        }
    }
</style>
