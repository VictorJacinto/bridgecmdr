import { isNil } from "lodash";
import type { CreateElement, VNode } from "vue";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import type { Location } from "vue-router";
import { normalizeSlot } from "../../../foundation/helpers/vue";
import { is, maybe, prop } from "../../../foundation/validation/valid";

@Component<CardListEntry>({ name: "CardListEntry" })
export default class CardListEntry extends Vue {
    @Prop(prop(maybe.string.notEmpty))
    readonly href!: undefined|string;

    @Prop(prop(maybe(is.string.notEmpty, is.object<Location>())))
    readonly to!: undefined|string|Location;

    get tag(): "a"|"router-link"|"div" {
        if (this.href) {
            return "a";
        }

        if (this.to) {
            return "router-link";
        }

        return "div";
    }

    get classes(): string[] {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        return this.$listeners.click ? [ "card", "has-cursor-pointer" ] : ["card"];
    }

    get click(): ($event: MouseEvent) => void {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        return this.$listeners.click ? ($event: MouseEvent) => { this.$emit("click", $event) } : () => undefined;
    }

    get hasImageSlot(): boolean {
        return !isNil(normalizeSlot(this, "image"));
    }

    get hasActionsSlot(): boolean {
        return !isNil(normalizeSlot(this, "actions"));
    }

    render(h: CreateElement): VNode {
        const href = this.to ? undefined : this.href;
        const content = normalizeSlot(this, "content",
            h("div", { class: "card-content" }, [
                h("article", { class: "media" }, [
                    this.hasImageSlot ? h("figure", { class: "media-left" }, normalizeSlot(this, "image")) : h(),
                    h("div", { class: "media-content" }, normalizeSlot(this, "default")),
                    this.hasActionsSlot ? h("div", { class: "media-right" }, normalizeSlot(this, "actions")) : h(),
                ]),
            ]),
        );

        return h(this.tag, { on: { click: this.click }, class: this.classes, props: { to: this.to, href } }, content);
    }
}
