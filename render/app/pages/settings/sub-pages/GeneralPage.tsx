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

import { VNode } from "vue";
import * as tsx from "vue-tsx-support";
import packageInfo from "../../../../../package.json";
import { BSwitch } from "../../../../foundation/components/buefy-tsx";
import { mapModuleActions, mapModuleState } from "../../../../foundation/helpers/vuex";
import simpleDropdown from "../../../components/SimpleDropdown";
import CardList from "../../../components/card-list/CardList";
import CardListEntry from "../../../components/card-list/CardListEntry";
import UsesSettingsTitle from "../../../concerns/uses-settings-title";
import autoStart from "../../../store/modules/auto-start";
import { IconSize, PowerOffTaps } from "../../../store/modules/settings";

const iconSizes: Record<IconSize, string> = {
    "is-128x128": "128×128",
    "is-96x96":   "96×96",
    "is-64x64":   "64×64",
    "is-48x48":   "48×48",
};

const powerOffTaps: Record<PowerOffTaps, string> = {
    "single": "When tapped once",
    "double": "When tapped twiced",
};

const IconSizeSelect = simpleDropdown((size: IconSize) => [ iconSizes[size], size ]);
const PowerOffSelect = simpleDropdown((taps: PowerOffTaps) => [ powerOffTaps[taps], taps ]);

// @vue/component
const GeneralPage = tsx.componentFactory.mixin(UsesSettingsTitle).create({
    name:     "GeneralPage",
    computed: {
        ...mapModuleState(autoStart, "autoStart", {
            autoStartDisabled: "loading",
        }),
        autoStart: {
            ...mapModuleState(autoStart, "autoStart", {
                get: "active",
            }),
            ...mapModuleActions(autoStart, "autoStart", {
                set: (dispatch, value: boolean) => dispatch("setAutoStart", value),
            }),
        },
    },
    mounted() {
        this.setSettingsTitle("General");
        this.checkAutoStartState();
    },
    methods: {
        ...mapModuleActions(autoStart, "autoStart", ["checkAutoStartState"]),
    },
    render(): VNode {
        return (
            <div id="options-page">
                <CardList>
                    <CardListEntry class="has-cursor-pointer">
                        <template slot="content">
                            <IconSizeSelect options={IconSize} expanded scopedSlots={{
                                default: ({ label }) => (
                                    <div class="card-content">
                                        <p class="has-text-weight-semibold">Icon size</p>
                                        <p class="has-text-light">{label}</p>
                                    </div>
                                ),
                            }}/>
                        </template>
                    </CardListEntry>
                    <CardListEntry>
                        <template slot="content">
                            <PowerOffSelect options={PowerOffTaps} expanded scopedSlots={{
                                default: ({ label }) => (
                                    <div class="card-content">
                                        <p class="has-text-weight-semibold">Power button will power off</p>
                                        <p class="has-text-light">{label}</p>
                                    </div>
                                ),
                            }}/>
                        </template>
                    </CardListEntry>
                    <CardListEntry>
                        <template slot="default">
                            <p class="has-text-weight-semibold">
                                Power on switches & monitors when {packageInfo.productName} starts
                            </p>
                        </template>
                        <template slot="actions">
                            <BSwitch passiveType="is-light" type="is-white"/>
                        </template>
                    </CardListEntry>
                    <CardListEntry>
                        <template slot="default">
                            <p class="has-text-weight-semibold">Start {packageInfo.productName} when the system boots</p>
                        </template>
                        <template slot="actions">
                            <BSwitch v-model={this.autoStart} passiveType="is-light" type="is-white"
                                disabled={this.autoStartDisabled}/>
                        </template>
                    </CardListEntry>
                </CardList>
            </div>
        );
    },
});

type GeneralPage = InstanceType<typeof GeneralPage>;
export default GeneralPage;
