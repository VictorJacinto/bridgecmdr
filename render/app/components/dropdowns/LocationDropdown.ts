import { cloneDeep } from "lodash";
import v from "vahvista";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import type { ElementType } from "../../../foundation/helpers/typing";
import { DeviceLocation } from "../../system/device-uri";
import SimpleDropdown from "../base/SimpleDropdown";

const locations = [
    { location: DeviceLocation.path, label: "Path" },
    { location: DeviceLocation.port, label: "Port" },
    { location: DeviceLocation.ip, label: "IP/Host" },
];

type Location = ElementType<typeof locations>;

@Component<LocationDropdown>({ name: "LocationDropdown" })
export default class LocationDropdown extends SimpleDropdown<Location, DeviceLocation> {
    @Prop({ type: Array, default: () => cloneDeep(locations), validator: v.shape(v.object) })
    readonly options!: Location[];

    predicate = (location: Location): [ string, DeviceLocation ] => [ location.label, location.location ];
}
