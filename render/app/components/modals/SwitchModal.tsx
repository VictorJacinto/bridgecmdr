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
import * as tsx from "vue-tsx-support";
import { BButton, BField, BIcon, BInput } from "../../../foundation/components/buefy-tsx";
import { ValidationObserver, ValidationProvider } from "../../../foundation/components/vee-validate-tsx";
import { mapModuleActions, mapModuleState } from "../../../foundation/helpers/vuex";
import { is, prop } from "../../../foundation/validation/valid";
import IndicatesLoading from "../../concerns/indicates-loading";
import devices from "../../store/modules/devices";
import { Switch } from "../../store/modules/switches";
import { validationStatus } from "../../support/validation";
import Driver, { DriverDescriptor } from "../../system/driver";
import DeviceLocationInput from "../DeviceLocationInput";
import simpleDropdown from "../SimpleDropdown";

const DriverDropdown = simpleDropdown((about: DriverDescriptor) => [ about.title, about.guid ]);

const SwitchModal = tsx.componentFactory.mixin(IndicatesLoading).create({
    name:  "SwitchModal",
    props: {
        item: prop(is.object<Partial<Switch>>()),
    },
    data: function () {
        return {
            source: cloneDeep(this.item),
        };
    },
    computed: {
        ...mapModuleState(devices, "devices", ["ports"]),
        title(): string {
            return this.source._id ? "Edit switch" : "Add switch";
        },
        confirmText(): string {
            return this.source._id ? "Save" : "Create";
        },
    },
    mounted() {
        this.$nextTick(() => this.loadingWhile(this.getPorts()));
    },
    methods: {
        ...mapModuleActions(devices, "devices", ["getPorts"]),
        onSaveClicked() {
            this.$modals.confirm(this.source);
        },
    },
    render() {
        return (
            <ValidationObserver tag="div" id="switch-editor" class="modal-card" scopedSlots={{
                default: ({ handleSubmit }) => [
                    <div class="navbar is-primary">
                        <div class="navbar-brand">
                            <a class="navbar-item" onClick={() => this.$modals.cancel()}>
                                <BIcon icon="arrow-left"/>
                            </a>
                            <div class="navbar-item">{this.title}</div>
                        </div>
                    </div>,
                    <main class="modal-card-body">
                        <ValidationProvider name="title" rules="required" slim scopedSlots={{
                            default: ({ errors }) => (
                                <BField label="Title" expanded {...validationStatus(errors)}>
                                    <BInput v-model={this.source.title} placeholder="Required"/>
                                </BField>
                            ),
                        }}/>
                        <ValidationProvider name="driver" rules="required" slim scopedSlots={{
                            default: ({ errors }) => (
                                <BField label="Driver" expanded {...validationStatus(errors)}>
                                    <DriverDropdown v-model={this.source.driverId} options={Driver.all()}
                                        placeholder="Required" expanded/>
                                </BField>
                            ),
                        }}/>
                        <ValidationProvider name="device" rules="required|location" slim scopedSlots={{
                            default: ({ errors }) => /* TODO: The validator needs to better handle this */ (
                                <BField label="Device" expanded {...validationStatus(errors)}>
                                    <DeviceLocationInput v-model={this.source.path} ports={this.ports}
                                        loading={this.loading} type={errors.length > 0 ? "is-danger" : undefined}/>
                                </BField>
                            ),
                        }}/>
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

export default SwitchModal;
