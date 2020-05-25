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
import { PropType, VNode } from "vue";
import { RawLocation } from "vue-router";
import * as tsx from "vue-tsx-support";

interface Events {
    onClick: () => void;
}

const CardListEntry = tsx.componentFactoryOf<Events>().create({
    name:  "CardListEntry",
    props: {
        to: { type: Object as PropType<RawLocation>, default: undefined },
    },
    computed: {
        hasImageSlot(): boolean {
            return !isNil(this.$slots.image) || !isNil(this.$scopedSlots.image);
        },
        hasActionsSlot(): boolean {
            return !isNil(this.$slots.actions) || !isNil(this.$scopedSlots.actions);
        },
    },
    methods: {
        onClicked(): void {
            this.to ? this.$router.push(this.to) : this.$emit("click");
        },
    },
    render() {
        const renderAsLink = (inner: VNode): VNode =>
            (<router-link class="card" to={this.to}>{inner}</router-link>);
        const renderAsBlock = (inner: VNode): VNode =>
            (<div class="card has-cursor-pointer" onClick={() => this.onClicked()}>{inner}</div>);
        const renderAs = this.to ? renderAsLink : renderAsBlock;

        return renderAs(
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
            </div>,
        );
    },
});

export type CardListEntryConstructor = typeof CardListEntry;
type CardListEntry = InstanceType<CardListEntryConstructor>;
export default CardListEntry;
