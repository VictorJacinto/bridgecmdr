<!--
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
-->

<template>
    <div class="media">
        <div v-if="hasIcons" class="media-left">
            <slot name="icon"/>
        </div>
        <div class="media-content">
            <slot/>
        </div>
        <div v-if="hasActions" class="media-right">
            <slot name="actions"/>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import Component from "vue-class-component";
    import CardList from "./CardList.vue";

    @Component
    export default class CardListEntry extends Vue {
        public get cardList(): CardList {
            if (this.$parent instanceof CardList) {
                return this.$parent;
            }

            throw new TypeError("A CardListEntry may only be the child of a CardList");
        }

        public get hasIcons(): boolean {
            return this.cardList.hasIcons;
        }

        public get hasActions(): boolean {
            return this.cardList.hasActions;
        }
    }
</script>
