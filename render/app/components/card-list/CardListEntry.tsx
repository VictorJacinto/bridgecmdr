import { isNil } from "lodash";
import { VNode } from "vue";
import { Location } from "vue-router";
import * as tsx from "vue-tsx-support";
import { EventHandler } from "vue-tsx-support/lib/modifiers";
import { normalizeSlot } from "../../../foundation/helpers/vue";
import { is, maybe, prop } from "../../../foundation/validation/valid";

interface Events {
    onClick: () => void;
}

// @vue/component
const CardListEntry = tsx.componentFactoryOf<Events>().create({
    name:  "CardListEntry",
    props: {
        href: prop(maybe.string.notEmpty),
        to:   prop(maybe(is.string.notEmpty, is.object<Location>())),
    },
    computed: {
        tag(): "a"|"router-link"|"div" {
            if (this.href) {
                return "a";
            }

            if (this.to) {
                return "router-link";
            }

            return "div";
        },
        classes(): string[] {
            return this.$listeners.click ? [ "card" , "has-cursor-pointer" ] : ["card"];
        },
        click(): EventHandler<MouseEvent> {
            return this.$listeners.click ? $event => this.$emit("click", $event) : () => undefined;
        },
        hasImageSlot(): boolean {
            return !isNil(this.$slots.image);
        },
        hasActionsSlot(): boolean {
            return !isNil(this.$slots.actions);
        },
    },
    render(): VNode {
        const RootTag = this.tag;
        const href = this.to ? undefined : this.href;
        const content = normalizeSlot(this, "content", (
            <div class="card-content">
                <article class="media">
                    <figure v-show={this.hasImageSlot} class="media-left">
                        { this.$slots.image }
                    </figure>
                    <div class="media-content">
                        { this.$slots.default }
                    </div>
                    <div v-show={this.hasActionsSlot} class="media-right">
                        { this.$slots.actions }
                    </div>
                </article>
            </div>
        ));

        return (<RootTag onClick={this.click} class={this.classes} to={this.to} href={href}>{content}</RootTag>);
    },
});

type CardListEntry = InstanceType<typeof CardListEntry>;
export default CardListEntry;
