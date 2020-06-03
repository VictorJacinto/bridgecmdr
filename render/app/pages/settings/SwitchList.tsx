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
import { modifiers as m } from "vue-tsx-support";
import { BButton, BIcon, BNavbar, BNavbarItem, BSkeleton } from "../../../foundation/components/buefy-tsx";
import SvgIcon from "../../components/SvgIcon";
import CardList from "../../components/card-list/CardList";
import CardListEntry from "../../components/card-list/CardListEntry";
import dataSource from "../../components/data/DataSource";
import ManagesSwitches from "../../concerns/manages-switches";
import { Switch } from "../../store/modules/switches";
import Driver, { DeviceType } from "../../system/driver";

const drivers = Driver.all();
const DataSource = dataSource<Switch>("switches");
const iconMap = {
    [DeviceType.Switch]:  "mdiVideoSwitch",
    [DeviceType.Monitor]: "mdiMonitor",
};

const SwitchList = tsx.componentFactory.mixin(ManagesSwitches).create({
    name:    "SwitchList",
    methods: {
        getIconForSwitch(item: Switch): string {
            const info = drivers.find(driver => driver.guid === item.driverId);
            const icon = info && iconMap[info.type];
            if (icon) {
                return icon;
            }

            return "mdiHelp";
        },
        getDriverForSwitch(item: Switch): string {
            const info = drivers.find(driver => driver.guid === item.driverId);
            if (info) {
                return info.title;
            }

            return "Unknown...";
        },
    },
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
                                        <BButton class="card-action-item" disabled loading/>
                                    </template>
                                </CardListEntry>
                            ))
                        }</CardList>
                    ) : (
                        <CardList>{
                            items.map(item => (
                                <CardListEntry onClick={() => this.updateSwitch(item)}>
                                    <template slot="image">
                                        <SvgIcon name={this.getIconForSwitch(item)} type="is-primary" size="is-48x48" inverted rounded/>
                                    </template>
                                    <template slot="default">
                                        <p class="has-text-weight-semibold">{ item.title }</p>
                                        <p class="has-text-light">{ this.getDriverForSwitch(item) }</p>
                                    </template>
                                    <template slot="actions">
                                        <BButton class="card-action-item" iconLeft="delete" type="is-danger" onClick={m.stop(() => this.removeSwitch(item))}/>
                                    </template>
                                </CardListEntry>
                            ))
                        }</CardList>
                    )),
                }}/>
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
