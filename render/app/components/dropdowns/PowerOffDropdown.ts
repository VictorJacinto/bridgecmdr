import v from "vahvista";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { PowerOffTaps } from "../../store/modules/settings";
import SimpleDropdown from "../base/SimpleDropdown";

const powerOffTaps: Record<PowerOffTaps, string> = {
    "single": "When tapped once",
    "double": "When tapped twice",
};

@Component<PowerOffDropdown>({ name: "PowerOffDropdown" })
export default class PowerOffDropdown extends SimpleDropdown<PowerOffTaps, PowerOffTaps> {
    @Prop({ type: Array, default: () => [...PowerOffTaps], validator: v.shape([v.enum(PowerOffTaps)]) })
    readonly options!: PowerOffTaps[];

    predicate = (taps: PowerOffTaps): [ string, PowerOffTaps ] => [ powerOffTaps[taps], taps ];
}
