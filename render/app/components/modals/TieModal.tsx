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

import { cloneDeep } from "lodash";
import { VNode } from "vue";
import * as tsx from "vue-tsx-support";
import { BField, BIcon, BNumberinput } from "../../../foundation/components/buefy-tsx";
import { ValidationObserver, ValidationProvider } from "../../../foundation/components/vee-validate-tsx";
import { mapModuleActions, mapModuleState } from "../../../foundation/helpers/vuex";
import { is, prop } from "../../../foundation/validation/valid";
import IndicatesLoading from "../../concerns/indicates-loading";
import switches, { Switch } from "../../store/modules/switches";
import { EmptyTie } from "../../store/modules/ties";
import { validationStatus } from "../../support/validation";
import Driver, { DriverCapabilities, DriverDescriptor } from "../../system/driver";
import simpleDropdown from "../SimpleDropdown";

const drivers = Driver.all();

const SwitchDropdown = simpleDropdown((option: Switch) => [ option.title, option._id ]);

// @vue/component
const TieModal = tsx.componentFactory.mixin(IndicatesLoading).create({
    name:  "TieModal",
    props: {
        item: prop(is.object<EmptyTie>()),
    },
    data: function () {
        return {
            source: cloneDeep(this.item),
        };
    },
    computed: {
        ...mapModuleState(switches, "switches", {
            switches: "items",
        }),
        title(): string {
            return this.source._id ? "Edit tie" : "New tie";
        },
        confirmText(): string {
            return this.source._id ? "Save" : "Create";
        },
        switcher(): Switch|undefined {
            return this.switches.find(row => row._id === this.source.switchId);
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
        videoOutputMinimal(): number {
            return this.showVideoOutput ? 1 : 0;
        },
        audioOutputMinimal(): number {
            return this.showAudioOutput ? 1 : 0;
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
            this.$modals.confirm(this.source);
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
                        <div class="navbar-menu">
                            <div class="navbar-end">
                                <a class="navbar-item" onClick={() => handleSubmit(() => this.onSaveClicked())}>Save</a>
                            </div>
                        </div>
                    </div>,
                    <main class="modal-card-body">
                        <ValidationProvider name="switch" rules="required" slim scopedSlots={{
                            default: ({ errors }) => (
                                <BField label="Switch or monitor" expanded {...validationStatus(errors)}>
                                    <SwitchDropdown v-model={this.source.switchId} options={this.switches}
                                        loading={this.loading} expanded/>
                                </BField>
                            ),
                        }}/>
                        <ValidationProvider name="input channel" rules="required|min_value:1" slim scopedSlots={{
                            default: ({ errors }) => (
                                <BField label="Input" {...validationStatus(errors)}>
                                    <BNumberinput v-model={this.source.inputChannel} min={1} useHtml5Validation={false}
                                        controlsPosition="compact"/>
                                </BField>
                            ),
                        }}/>
                        <ValidationProvider name={this.videoOutputName} rules={this.videoOutputRules} slim
                            scopedSlots={{
                                default: ({ errors }) => (
                                    <BField v-show={this.showVideoOutput} label={this.videoOutputLabel}
                                        {...validationStatus(errors)}>
                                        <BNumberinput v-model={this.source.outputChannels.video}
                                            useHtml5Validation={false} min={this.videoOutputMinimal}
                                            controlsPosition="compact"/>
                                    </BField>
                                ),
                            }}/>
                        <ValidationProvider name="audio output channel" rules={this.audioOutputRules} slim
                            scopedSlots={{
                                default: ({ errors }) => (
                                    <BField v-show={this.showAudioOutput} label="Audio output"
                                        {...validationStatus(errors)}>
                                        <BNumberinput v-model={this.source.outputChannels.audio}
                                            useHtml5Validation={false} min={this.audioOutputMinimal}
                                            controlsPosition="compact"/>
                                    </BField>
                                ),
                            }}/>
                    </main>,
                ],
            }}/>
        );
    },
});

type TieModal = InstanceType<typeof TieModal>;
export default TieModal;
