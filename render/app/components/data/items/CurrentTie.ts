import Component from "vue-class-component";
import ties from "../../../store/modules/ties";
import DataItem from "../../base/DataItem";

@Component({ name: "CurrentTie" })
export default class CurrentTie extends DataItem<typeof ties> {
    module = (): typeof ties => ties;
}
