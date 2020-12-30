import type { VueConstructor } from "vue";
import Component from "vue-class-component";
import SourceModal from "../../components/modals/SourceModal.vue";
import sources from "../../store/modules/sources";
import ManagesData from "../base/manages-data";

@Component({ name: "ManagesSources" })
export default class ManagesSources extends ManagesData<typeof sources> {
    module = (): typeof sources => sources;

    modal = (): VueConstructor => SourceModal;
}
