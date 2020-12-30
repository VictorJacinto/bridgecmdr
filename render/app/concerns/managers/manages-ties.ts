import Component from "vue-class-component";
import type { VueConstructor } from "vue/types/umd";
import TieModal from "../../components/modals/TieModal.vue";
import ties from "../../store/modules/ties";
import ManagesData from "../base/manages-data";

@Component({ name: "ManagesTies" })
export default class ManagesTies extends ManagesData<typeof ties> {
    module = (): typeof ties => ties;

    modal = (): VueConstructor => TieModal;
}
