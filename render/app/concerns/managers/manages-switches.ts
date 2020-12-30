import type { VueConstructor } from "vue";
import Component from "vue-class-component";
import SwitchModal from "../../components/modals/SwitchModal.vue";
import switches from "../../store/modules/switches";
import ManagesData from "../base/manages-data";

@Component({ name: "ManagesSwitches" })
export default class ManagesSwitches extends ManagesData<typeof switches> {
    module = (): typeof switches => switches;

    modal = (): VueConstructor => SwitchModal;
}
