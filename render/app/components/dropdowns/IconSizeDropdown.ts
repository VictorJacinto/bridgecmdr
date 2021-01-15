import v from "vahvista";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { IconSize } from "../../store/modules/settings";
import SimpleDropdown from "../base/SimpleDropdown";

const iconSizes: Record<IconSize, string> = {
    "is-128x128": "128×128",
    "is-96x96":   "96×96",
    "is-64x64":   "64×64",
    "is-48x48":   "48×48",
};

@Component<IconSizeDropdown>({ name: "IconSizeDropdown" })
export default class IconSizeDropdown extends SimpleDropdown<IconSize, IconSize> {
    @Prop({ type: Array, default: () => [...IconSize], validator: v.shape([v.enum(IconSize)]) })
    readonly options!: IconSize[];

    predicate = (size: IconSize): [ string, IconSize ] => [ iconSizes[size], size ];
}
