import Component from "vue-class-component";
import ties from "../../../store/modules/ties";
import DataSource from "../../base/DataSource";

@Component({ name: "Ties" })
export default class Ties extends DataSource<typeof ties> {
    module = (): typeof ties => ties;
}
