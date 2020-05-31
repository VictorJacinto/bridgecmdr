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

import { isNil } from "lodash";
import * as tsx from "vue-tsx-support";
import { BField, BInput, KnownColorModifiers } from "../../foundation/components/buefy-tsx";
import { is, maybe, prop } from "../../foundation/validation/valid";
import { DeviceLocation, getLocationFromPath, getSubPathFromPath, rebuildPath, SerialDevice } from "../system/device";
import simpleDropdown from "./SimpleDropdown";

const locations = [
    { location: DeviceLocation.PATH, label: "Path" },
    { location: DeviceLocation.PORT, label: "Port" },
    { location: DeviceLocation.IP, label: "IP/Host" },
];

const LocationDropdown = simpleDropdown(locations, "location", "label");

const DeviceLocationInput = tsx.component({
    name:  "DeviceLocationInput",
    props: {
        value:   prop(maybe.string),
        devices: prop(is.array.ofType(is.object<SerialDevice>())),
        type:    prop(is.enum(KnownColorModifiers), "is-primary"),
    },
    data: function () {
        return {
            innerValue: this.value,
        };
    },
    computed: {
        placeholder(): string {
            switch (this.location) {
            case DeviceLocation.IP:
                return "IP or hostname";
            case DeviceLocation.PORT:
                return "Port or device";
            case DeviceLocation.PATH:
                return "Path";
            default:
                return "Required";
            }
        },
        location: {
            get(): DeviceLocation|undefined {
                return !isNil(this.innerValue) ? getLocationFromPath(this.innerValue) : undefined;
            },
            set(value: DeviceLocation) {
                this.updateValue(rebuildPath(value, this.path || ""));
            },
        },
        path: {
            get(): string|undefined {
                return !isNil(this.innerValue) ? getSubPathFromPath(this.innerValue) : undefined;
            },
            set(value: string) {
                this.updateValue(rebuildPath(this.location || DeviceLocation.PATH, value));
            },
        },

    },
    watch: {
        value(value: string|undefined) {
            this.innerValue = value;
        },
    },
    methods: {
        updateValue(value: string) {
            this.innerValue = value;
            this.$emit("input", value);
        },
    },
    render() {
        const DeviceDropdown = simpleDropdown(this.devices, "path", "label");

        return (
            <BField type={this.type !== "is-primary" ? this.type : undefined}>
                <LocationDropdown v-model={this.location} type={this.type} class="control" placeholder="Required"/>
                { this.location === DeviceLocation.PORT ? (
                    <DeviceDropdown v-model={this.path} tag="input" class="control"
                        placeholder={this.placeholder} expanded/>
                ) : (
                    <BInput v-model={this.path} placeholder={this.placeholder} expanded/>
                )}
            </BField>
        );
    },
});

export type DeviceLocationInputConstructor = typeof DeviceLocationInput;
type DeviceLocationInput = InstanceType<DeviceLocationInputConstructor>;
export default DeviceLocationInput;
