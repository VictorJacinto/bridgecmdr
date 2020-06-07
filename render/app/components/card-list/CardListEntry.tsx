/*
BridgeCmdr - A/V switch and monitor controller
Copyright (C) 2019-2020 Matthew Holder

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { isNil } from "lodash";
import { VNode } from "vue";
import { Location } from "vue-router";
import * as tsx from "vue-tsx-support";
import { EventHandler } from "vue-tsx-support/lib/modifiers";
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

        return (
            <RootTag onClick={this.click} class={this.classes} to={this.to} href={href}>
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
            </RootTag>
        );
    },
});

type CardListEntry = InstanceType<typeof CardListEntry>;
export default CardListEntry;
