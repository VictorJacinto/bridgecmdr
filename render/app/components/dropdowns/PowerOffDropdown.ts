import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { is, prop } from "../../../foundation/validation/valid";
import { PowerOffTaps } from "../../store/modules/settings";
import SimpleDropdown from "../base/SimpleDropdown";

const powerOffTaps: Record<PowerOffTaps, string> = {
    "single": "When tapped once",
    "double": "When tapped twice",
};

@Component<PowerOffDropdown>({ name: "PowerOffDropdown" })
export default class PowerOffDropdown extends SimpleDropdown<PowerOffTaps, PowerOffTaps> {
    @Prop(prop(is.array, () => [...PowerOffTaps]))
    readonly options!: PowerOffTaps[];

    predicate = (taps: PowerOffTaps): [ string, PowerOffTaps ] => [ powerOffTaps[taps], taps ];
}
