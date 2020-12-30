import Component from "vue-class-component";
import type { Switch } from "../../store/modules/switches";
import SimpleDropdown from "../base/SimpleDropdown";

@Component<SwitchDropdown>({ name: "SwitchDropdown" })
export default class SwitchDropdown extends SimpleDropdown<Switch, string> {
    predicate = (option: Switch): [ string, string ] => [ option.title, option._id ];
}
