/*
BridgeCmdr - A/V switch and monitor controller
Copyright (C) 2019-2020 Matthew Holder

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import * as tsx from "vue-tsx-support";
import packageInfo from "../../../package.json";
import { BButton } from "../../foundation/components/buefy-tsx";
import { mapModuleActions, mapModuleState } from "../../foundation/helpers/vuex";
import DoesFirstRun from "../concerns/does-first-run";
import DoesStartup from "../concerns/does-startup";
import HasImages from "../concerns/has-images";
import devices from "../store/modules/devices";
import settings from "../store/modules/settings";
import { signalShutdown } from "../support/dbus";

const powerOffDoubleTapTimeout = 2000;

// @vue/component
const DashboardPage = tsx.componentFactory.mixin(DoesStartup).mixin(DoesFirstRun).mixin(HasImages).create({
    name: "DashboardPage",
    data: function () {
        return {
            lastPowerOffTapTime: 0,
        };
    },
    computed: {
        ...mapModuleState(devices, "devices", ["devices"]),
        ...mapModuleState(settings, "settings", [ "iconSize", "powerOffWhen", "powerOnSwitchesAtStart" ]),
        imageClasses(): string[] {
            return [ "image", "icon", this.iconSize ];
        },
    },
    mounted() {
        this.$nextTick(async () => {
            await this.onStart(() => this.doFirstRun());

            try {
                await this.$loading.while(this.refresh());
            } catch (error) {
                await this.$dialogs.error(error);
            }

            await this.onStart(async () => {
                if (this.powerOnSwitchesAtStart) {
                    await this.powerOn();
                }
            });
        });
    },
    methods: {
        ...mapModuleActions(devices, "devices", [ "refresh", "select", "powerOn", "powerOff" ]),
        async onPowerOffClicked() {
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
        },
        async doPowerOff() {
            try {
                await this.powerOff();

                if (process.env.NODE_ENV === "production") {
                    try {
                        await signalShutdown();
                    } catch (error) {
                        await this.$dialogs.error(error);
                    }
                }
            } finally {
                window.close();
            }
        },
    },
    render() {
        return (
            <div id="dashboard-page">
                <div class="dashboard">{
                    this.devices.map(device => (
                        <button class="button is-light" title={device.source.title} onClick={() => this.select(device)}>
                            <figure class={this.imageClasses}>
                                <img src={this.images.get(device.source)} alt=""/>
                            </figure>
                        </button>
                    ))
                }</div>
                <div id="dashboard-action-buttons" class="fab-container is-right">
                    <span class="is-inline-block pt-4">{packageInfo.productName} {packageInfo.version}</span>
                    <BButton class="fab-item" iconLeft="power" size="is-medium" type="is-danger"
                        onClick={() => this.onPowerOffClicked()}/>
                    <BButton class="fab-item" iconLeft="wrench" size="is-medium" type="is-link"
                        onClick={() => this.$router.push({ name: "settings" })}/>
                </div>
            </div>
        );
    },
});

type DashboardPage = InstanceType<typeof DashboardPage>;
export default DashboardPage;
