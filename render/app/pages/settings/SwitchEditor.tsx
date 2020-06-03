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

import { identity } from "lodash";
import * as tsx from "vue-tsx-support";
import { BButton, BField, BInput } from "../../../foundation/components/buefy-tsx";
import { ValidationObserver, ValidationProvider } from "../../../foundation/components/vee-validate-tsx";
import { is, prop } from "../../../foundation/validation/valid";
import DeviceLocationInput from "../../components/DeviceLocationInput";
import simpleDropdown from "../../components/SimpleDropdown";
import { Switch } from "../../store/modules/switches";
import { validationStatus } from "../../support/validation";
import { makeSerialDeviceList } from "../../system/device";
import Driver from "../../system/driver";

const drivers = Driver.all();
const DriverDropdown = simpleDropdown(drivers, "guid", "title");

const switchEditor = identity(async () => {
    const ports = await makeSerialDeviceList();

    return tsx.component({
        name:  "SwitchEditor",
        props: {
            item: prop(is.object<Partial<Switch>>()),
        },
        data: function () {
            return {
                source: this.item,
            };
        },
        computed: {
            title(): string {
                return this.item._id === null ? "Add switch" : "Edit switch";
            },
        },
        methods: {
            onSaveClicked() {
                this.$modals.confirm(this.source);
            },
        },
        render() {
            return (
                <ValidationObserver tag="div" id="switch-editor" class="modal-card" scopedSlots={{
                    default: ({ handleSubmit }) => [
                        <header class="modal-card-head">
                            <h1 class="modal-card-title">{this.title}</h1>
                        </header>,
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
                                        <DriverDropdown v-model={this.source.driverId} tag="input" placeholder="Required" expanded/>
                                    </BField>
                                ),
                            }}/>
                            <ValidationProvider name="device" rules="required|location" slim scopedSlots={{
                                default: ({ errors }) => /* TODO: The validator needs to better handle this */ (
                                    <BField label="Device" expanded {...validationStatus(errors)}>
                                        <DeviceLocationInput v-model={this.source.path} devices={ports}
                                            type={errors.length > 0 ? "is-danger" : undefined}/>
                                    </BField>
                                ),
                            }}/>
                        </main>,
                        <footer class="modal-card-foot">
                            <BButton label="Cancel" type="is-dark" onClick={() => this.$modals.cancel() }/>
                            { /* TODO Save or Create  */ }
                            <BButton label="Save" type="is-primary" onClick={() => handleSubmit(() => this.onSaveClicked()) }/>
                        </footer>,
                    ],
                }}/>
            );
        },
    });
});

type PromiseResult<P> = P extends Promise<infer T> ? T : never;

export type SwitchEditorConstructor = PromiseResult<ReturnType<typeof switchEditor>>;
// noinspection JSUnusedGlobalSymbols
export type SwitchEditor = InstanceType<SwitchEditorConstructor>;
export default switchEditor;
