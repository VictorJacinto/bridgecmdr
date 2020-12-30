import type { CreateElement, VNode } from "vue";
import Vue from "vue";
import Component from "vue-class-component";
import { normalizeSlot } from "../../../foundation/helpers/vue";

@Component<CardList>({ name: "CardList" })
export default class CardList extends Vue {
    render(h: CreateElement): VNode {
        return h("div", { class: "card-list" }, normalizeSlot(this, "default"));
    }
}
