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
import { BButton, BIcon } from "../../../foundation/components/buefy-tsx";
import { ValidationObserver } from "../../../foundation/components/vee-validate-tsx";
import { mapModuleActions, mapModuleState } from "../../../foundation/helpers/vuex";
import { is, prop } from "../../../foundation/validation/valid";
import IndicatesLoading from "../../concerns/indicates-loading";
import switches, { Switch } from "../../store/modules/switches";
import { Tie } from "../../store/modules/ties";
import Driver, { DriverCapabilities, DriverDescriptor } from "../../system/driver";

const drivers = Driver.all();

// @vue/component
const TieModal = tsx.componentFactory.mixin(IndicatesLoading).create({
    name:  "TieModal",
    props: {
        item: prop(is.object<Partial<Tie>>()),
    },
    computed: {
        ...mapModuleState(switches, "switches", {
            switches: "items",
        }),
        title(): string {
            return this.item._id ? "Edit tie" : "New tie";
        },
        confirmText(): string {
            return this.item._id ? "Create" : "Save";
        },
        switcher(): Switch|undefined {
            return this.switches.find(row => row._id === this.item.switchId);
        },
        driver(): DriverDescriptor|undefined {
            return drivers.find(row => row.guid === this.switcher?.driverId);
        },
        showVideoOutput(): boolean {
            return this.driver ?
                Boolean(this.driver.capabilities & DriverCapabilities.HasMultipleOutputs) :
                false;
        },
        showAudioOutput(): boolean {
            return (this.showVideoOutput && this.driver) ?
                Boolean(this.driver.capabilities & DriverCapabilities.CanDecoupleAudioOutput) :
                false;
        },
        videoOutputName(): string {
            return this.showAudioOutput ? "video output channel" : "output channel";
        },
        videoOutputLabel(): string {
            return this.showAudioOutput ? "Video output" : "Output";
        },
        videoOutputRules(): Record<string, unknown> {
            // eslint-disable-next-line @typescript-eslint/camelcase
            return this.showVideoOutput ? { required: true, min_value: 1 } : {};
        },
        audioOutputRules(): Record<string, unknown> {
            // eslint-disable-next-line @typescript-eslint/camelcase
            return this.showAudioOutput ? { required: true, min_value: 1 } : {};
        },
    },
    mounted() {
        this.$nextTick(() => this.loadingWhile(this.getSwitches()));
    },
    methods: {
        ...mapModuleActions(switches, "switches", {
            getSwitches: "all",
        }),
        onSaveClicked() {
            this.$modals.confirm(this.item);
        },
    },
    render(): VNode {
        return (
            <ValidationObserver tag="div" id="tie-editor" class="modal-card" scopedSlots={{
                default: ({ handleSubmit }) => [
                    <div class="navbar is-primary">
                        <div class="navbar-brand">
                            <a class="navbar-item" onClick={() => this.$modals.cancel()}>
                                <BIcon icon="arrow-left"/>
                            </a>
                            <div class="navbar-item">{this.title}</div>
                        </div>
                    </div>,
                    <main class="modal-card-body content">
                        <ul>{
                            this.switches.map($witch => (
                                <li>{$witch.title}</li>
                            ))
                        }</ul>
                    </main>,
                    <footer class="modal-card-foot">
                        <BButton label={this.confirmText} type="is-primary"
                            onClick={() => handleSubmit(() => this.onSaveClicked()) }/>
                    </footer>,
                ],
            }}/>
        );
    },
});

type TieModal = InstanceType<typeof TieModal>;
export default TieModal;
