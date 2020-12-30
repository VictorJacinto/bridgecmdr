import Component from "vue-class-component";
import sources from "../../../store/modules/sources";
import DataSource from "../../base/DataSource";

@Component({ name: "Sources" })
export default class Sources extends DataSource<typeof sources> {
    module = (): typeof sources => sources;
}
