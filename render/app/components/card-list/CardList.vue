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

import { uniqueId } from "lodash";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component({
    template: `
        <div class="card-list">
            <div v-for="(entry, index) of entries" :key="getEntryKey(index)" class="card"
                 @click="() => $emit('click', entry)">
                <div class="card-content">
                    <slot :entry="entry"/>
                </div>
            </div>
        </div>
    `,
})
export default class CardList extends Vue {
    @Prop({ type: Array, required: true }) entries!: unknown[];
    @Prop(Boolean) hasActions!: boolean;
    @Prop(Boolean) hasIcons!: boolean;
    readonly uid = uniqueId("card-list-");

    getEntryKey(index: number): string {
        return `${this.uid}-${index}`;
    }
}
