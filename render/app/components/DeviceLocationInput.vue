<template>
    <b-field :type="type !== 'is-primary' ? type : undefined">
        <location-dropdown v-model="location" :type="type" trigger="button" class="control" placeholder="Required"/>
        <device-dropdown v-if="location === locationKinds.port" v-model="path" :options="ports" class="control"
                         :placeholder="placeholder" :loading="loading" expanded/>
        <b-input v-else v-model="path" :placeholder="placeholder" expanded/>
    </b-field>
</template>

<script lang="ts">
    import { clone, isNil } from "lodash";
    import v from "vahvista";
    import Vue from "vue";
    import Component from "vue-class-component";
    import { Prop, Watch } from "vue-property-decorator";
    import { KnownColorModifiers } from "../../foundation/helpers/buefy";
    // import { is, maybe, prop } from "../../foundation/validation/valid";
    import type { SerialPortEntry } from "../store/modules/devices";
    import { DeviceLocation, getLocationFromUri, getPathFromUri, rebuildUri } from "../system/device-uri";
    import DeviceDropdown from "./dropdowns/DeviceDropdown";
    import LocationDropdown from "./dropdowns/LocationDropdown";

    @Component<DeviceLocationInput>({
        name:       "DeviceLocationInput",
        components: {
            "location-dropdown": LocationDropdown,
            "device-dropdown":   DeviceDropdown,
        },
    })
    export default class DeviceLocationInput extends Vue {
        @Prop({ type: String, default: undefined })
        readonly value!: undefined|string;

        @Prop({ type: Array, required: true, validator: v.shape([v.object]) })
        readonly ports!: SerialPortEntry[];

        @Prop({ type: String, default: "is-primary", validator: v.enum(KnownColorModifiers) })
        readonly type!: KnownColorModifiers;

        @Prop(Boolean)
        readonly loading!: undefined|boolean;

        innerValue = this.value;
        locationKinds = clone(DeviceLocation);

        get placeholder(): string {
            switch (this.location) {
                case DeviceLocation.ip:
                    return "IP or hostname";
                case DeviceLocation.port:
                    return "Port or device";
                case DeviceLocation.path:
                    return "Path";
                default:
                    return "Required";
            }
        }

        get location(): DeviceLocation|undefined {
            return !isNil(this.innerValue) ? getLocationFromUri(this.innerValue) : undefined;
        }

        set location(value: DeviceLocation|undefined) {
            this.updateValue(rebuildUri(value, this.path || ""));
        }

        get path(): string|undefined {
            return !isNil(this.innerValue) ? getPathFromUri(this.innerValue) : undefined;
        }

        set path(value: string|undefined) {
            this.updateValue(rebuildUri(this.location || DeviceLocation.path, value));
        }

        @Watch("value")
        onValueChanged(value: string|undefined): void {
            this.innerValue = value;
        }

        updateValue(value: string): void {
            this.innerValue = value;
            this.$emit("input", value);
        }
    }
</script>
