import Component from "vue-class-component";
import sources from "../../../store/modules/sources";
import DataItem from "../../base/DataItem";

@Component({ name: "CurrentSource" })
export default class CurrentSource extends DataItem<typeof sources> {
    module = (): typeof sources => sources;
}
