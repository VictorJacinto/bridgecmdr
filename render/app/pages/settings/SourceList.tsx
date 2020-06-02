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
import * as tsx from "vue-tsx-support";
import { BIcon, BNavbar, BNavbarItem, BSkeleton } from "../../../foundation/components/buefy-tsx";
import CardList from "../../components/card-list/CardList";
import CardListEntry from "../../components/card-list/CardListEntry";
import { dataSource } from "../../components/data/DataSource";
import { Source } from "../../store/modules/sources";

const DataSource = dataSource<Source>("sources");

const SourceList = tsx.component({
    name: "SourceList",
    render() {
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
                <DataSource scopedSlots={{
                    default: ({ items, loading }) => (loading ? (
                        <CardList>{
                            times(3, () => (
                                <CardListEntry>
                                    <template slot="image">
                                        <BSkeleton/>
                                    </template>
                                    <template slot="default">
                                        <BSkeleton count={2}/>
                                    </template>
                                    <template slot="actions">
                                        <BSkeleton/>
                                    </template>
                                </CardListEntry>
                            ))
                        }</CardList>
                    ) : (
                        <CardList>{
                            items.map(item => (
                                <CardListEntry>
                                    <template slot="default">
                                        <p class="has-text-weight-semibold">{item.title}</p>
                                        <p>Stuff and things</p>
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
