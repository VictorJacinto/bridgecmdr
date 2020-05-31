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

import { map, times } from "lodash";
import * as tsx from "vue-tsx-support";
import { BButton, BIcon, BNavbar, BNavbarItem, BSkeleton } from "../../../foundation/components/buefy-tsx";
import CardList from "../../components/card-list/CardList";
import CardListEntry from "../../components/card-list/CardListEntry";
import { dataSource } from "../../components/data/DataSource";
import ManagesSwitches from "../../concerns/manages-switches";
import { Switch } from "../../store/modules/switches";

const DataSource = dataSource<Switch>("switches");

const SwitchList = tsx.componentFactory.mixin(ManagesSwitches).create({
    name: "SwitchList",
    render() {
        return (
            <div id="switch-list">
                <BNavbar fixedTop type="is-primary" mobileBurger={false}>
                    <template slot="brand">
                        <BNavbarItem tag="router-link" to={{ name: "settings" }}>
                            <BIcon icon="arrow-left"/>
                        </BNavbarItem>
                        <BNavbarItem tag="div">Switches</BNavbarItem>
                    </template>
                </BNavbar>
                <DataSource scopedSlots={{
                    default: ({ items, loading }) => (loading ? (
                        <CardList>{
                            times(3, () => (
                                <CardListEntry><BSkeleton/></CardListEntry>
                            ))
                        }</CardList>
                    ) : (
                        <CardList>{
                            map(items, item => (
                                <CardListEntry>{ item.title }</CardListEntry>
                            ))
                        }</CardList>
                    )),
                }}>
                </DataSource>
                <div class="fab-container is-right">
                    <BButton class="fab-item" iconLeft="plus" type="is-primary" onClick={() => this.createSwitch()}/>
                </div>
            </div>
        );
    },
});

export type SwitchListConstructor = typeof SwitchList;
type SwitchList = InstanceType<SwitchListConstructor>;
export default SwitchList;
