import Component from "vue-class-component";
import switches from "../../../store/modules/switches";
import DataSource from "../../base/DataSource";

@Component({ name: "Switches" })
export default class Switches extends DataSource<typeof switches> {
    module = (): typeof switches => switches;
}
