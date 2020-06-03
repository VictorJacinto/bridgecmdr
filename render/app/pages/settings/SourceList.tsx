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

import { times } from "lodash";
import { VNode } from "vue";
import * as tsx from "vue-tsx-support";
import { BButton, BIcon, BNavbar, BNavbarItem, BSkeleton } from "../../../foundation/components/buefy-tsx";
import CardList from "../../components/card-list/CardList";
import CardListEntry from "../../components/card-list/CardListEntry";
import dataSource from "../../components/data/DataSource";
import ManagesSources from "../../concerns/manages-sources";
import { Source } from "../../store/modules/sources";

const DataSource = dataSource<Source>("sources");

const SourceList = tsx.componentFactory.mixin(ManagesSources).create({
    name: "SourceList",
    data: function () {
        return {
            icons: {} as Record<string, string>,
        };
    },
    methods: {
        onItemsChange(items: Source[]) {
            this.revokeUrls();
            for (const item of items) {
                this.$set(this.icons, item._id, URL.createObjectURL(item.image));
            }
        },
        revokeUrls() {
            for (const url of Object.values(this.icons)) {
                URL.revokeObjectURL(url);
            }

            this.icons = {};
        },
    },
    beforeDestroy() {
        this.revokeUrls();
    },
    render(): VNode {
        return (
            <div id="source-list">
                <BNavbar fixedTop type="is-primary" mobileBurger={false}>
                    <template slot="brand">
                        <BNavbarItem tag="router-link" to={{ name: "settings" }}>
                            <BIcon icon="arrow-left"/>
                        </BNavbarItem>
                        <BNavbarItem tag="div">Sources</BNavbarItem>
                    </template>
                </BNavbar>
                <DataSource onChange={items => this.onItemsChange(items)} scopedSlots={{
                    default: ({ items, loading }) => (loading ? (
                        <CardList>{
                            times(3, () => (
                                <CardListEntry>
                                    <template slot="image">
                                        <figure class="image is-48x48">
                                            <BSkeleton circle width="48px" height="48px"/>
                                        </figure>
                                    </template>
                                    <template slot="default">
                                        <BSkeleton height="1em" count={2}/>
                                    </template>
                                    <template slot="actions">
                                        <BButton disabled={true} loading={true}/>
                                    </template>
                                </CardListEntry>
                            ))
                        }</CardList>
                    ) : (
                        <CardList>{
                            items.map(item => (
                                <CardListEntry>
                                    <template slot="image">
                                        <figure class="image is-48x48">
                                            <img src={this.icons[item._id]} class="is-rounded" alt="icon"/>
                                        </figure>
                                    </template>
                                    <template slot="default">
                                        <p class="has-text-weight-semibold">{item.title}</p>
                                        { /* TODO: Tie count? */ }
                                    </template>
                                </CardListEntry>
                            ))
                        }</CardList>
                    )),
                }}/>
            </div>
        );
    },
});

export type SourceListConstructor = typeof SourceList;
type SourceList = InstanceType<SourceListConstructor>;
export default SourceList;
