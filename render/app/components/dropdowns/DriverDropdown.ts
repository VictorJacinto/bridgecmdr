import Component from "vue-class-component";
import type { DriverDescriptor } from "../../system/driver";
import SimpleDropdown from "../base/SimpleDropdown";

@Component<DriverDropdown>({ name: "DriverDropdown" })
export default class DriverDropdown extends SimpleDropdown<DriverDescriptor, string> {
    predicate = (about: DriverDescriptor): [ string, string ]  => [ about.title, about.guid ];
}
