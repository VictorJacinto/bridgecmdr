import { isNil } from "lodash";
import { VNode } from "vue";
import * as tsx from "vue-tsx-support";
import { BField, BInput, KnownColorModifiers } from "../../foundation/components/buefy-tsx";
import { ElementType } from "../../foundation/helpers/typing";
import { is, maybe, prop } from "../../foundation/validation/valid";
import { SerialPortEntry } from "../store/modules/devices";
import { DeviceLocation, getLocationFromUri, getPathFromUri, rebuildUri } from "../system/device-uri";
import simpleDropdown from "./SimpleDropdown";

const locations = [
    { location: DeviceLocation.PATH, label: "Path" },
    { location: DeviceLocation.PORT, label: "Port" },
    { location: DeviceLocation.IP, label: "IP/Host" },
];

type Location = ElementType<typeof locations>;

const LocationDropdown = simpleDropdown((location: Location) => [ location.label, location.location ]);
const DeviceDropdown = simpleDropdown((port: SerialPortEntry) => [ port.title, port.path ]);

// @vue/component
const DeviceLocationInput = tsx.component({
    name:  "DeviceLocationInput",
    props: {
        value:   prop(maybe.string),
        ports:   prop(is.array.ofType(is.object<SerialPortEntry>())),
        type:    prop(is.enum(KnownColorModifiers), "is-primary"),
        loading: prop(maybe.boolean),
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
                return !isNil(this.innerValue) ? getLocationFromUri(this.innerValue) : undefined;
            },
            set(value: DeviceLocation) {
                this.updateValue(rebuildUri(value, this.path || ""));
            },
        },
        path: {
            get(): string|undefined {
                return !isNil(this.innerValue) ? getPathFromUri(this.innerValue) : undefined;
            },
            set(value: string) {
                this.updateValue(rebuildUri(this.location || DeviceLocation.PATH, value));
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
    render(): VNode {
        return (
            <BField type={this.type !== "is-primary" ? this.type : undefined}>
                <LocationDropdown v-model={this.location} options={locations} type={this.type} trigger="button"
                    class="control" placeholder="Required"/>
                { this.location === DeviceLocation.PORT ? (
                    <DeviceDropdown v-model={this.path} options={this.ports} class="control"
                        placeholder={this.placeholder} loading={this.loading} expanded/>
                ) : (
                    <BInput v-model={this.path} placeholder={this.placeholder} expanded/>
                )}
            </BField>
        );
    },
});

type DeviceLocationInput = InstanceType<typeof DeviceLocationInput>;
export default DeviceLocationInput;
