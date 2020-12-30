import Component from "vue-class-component";
import switches from "../../../store/modules/switches";
import DataItem from "../../base/DataItem";

@Component({ name: "CurrentSwitch" })
export default class CurrentSwitch extends DataItem<typeof switches> {
    module = (): typeof switches => switches;
}
