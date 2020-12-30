import Component from "vue-class-component";
import type { SerialPortEntry } from "../../store/modules/devices";
import SimpleDropdown from "../base/SimpleDropdown";

@Component<DeviceDropdown>({ name: "DeviceDropdown" })
export default class DeviceDropdown extends SimpleDropdown<SerialPortEntry, string> {
    predicate = (port: SerialPortEntry): [ string, string ] => [ port.title, port.path ];
}
