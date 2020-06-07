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
import { BButton, BField, BIcon, BSkeleton } from "../../../../foundation/components/buefy-tsx";
import SvgIcon from "../../../components/SvgIcon";
import CardList from "../../../components/card-list/CardList";
import CardListEntry from "../../../components/card-list/CardListEntry";
import Switches from "../../../components/data/sources/Switches";
import ManagesSwitches from "../../../concerns/managers/manages-switches";
import UsesSettingsTitle from "../../../concerns/uses-settings-title";
import { Switch } from "../../../store/modules/switches";
import Driver, { DeviceType } from "../../../system/driver";

const drivers = Driver.all();
const iconMap = {
    [DeviceType.Switch]:  "mdiVideoSwitch",
    [DeviceType.Monitor]: "mdiMonitor",
};

// @vue/component
const SwitchList = tsx.componentFactory.mixin(UsesSettingsTitle).mixin(ManagesSwitches).create({
    name: "SwitchList",
    mounted() {
        this.$nextTick(() => {
            this.setSettingsTitle("Switches");
        });
    },
    methods: {
        getIconForSwitch(item: Switch): string {
            const info = drivers.find(driver => driver.guid === item.driverId);
            const icon = info && iconMap[info.type];
            if (icon) {
                return icon;
            }

            return "mdiHelp";
        },
        getDriverTitleForSwitch(item: Switch): string {
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
                <Switches slim scopedSlots={{
                    loading: () => (
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
                    ),
                    default: ({ items: switches }) => (switches.length === 0 ? (
                        <div class="section content has-text-centered">
                            <BField><BIcon icon="set-none" size="is-large"/></BField>
                            <BField>There are no switches</BField>
                        </div>
                    ) : (
                        <CardList>{
                            switches.map(item => (
                                <CardListEntry onClick={() => this.updateItem(item)}>
                                    <template slot="image">
                                        <SvgIcon name={this.getIconForSwitch(item)} type="is-primary" size="is-48x48"
                                            inverted rounded/>
                                    </template>
                                    <template slot="default">
                                        <p class="has-text-weight-semibold">{ item.title }</p>
                                        <p class="has-text-light">{ this.getDriverTitleForSwitch(item) }</p>
                                    </template>
                                    <template slot="actions">
                                        <BButton class="card-action-item" iconLeft="delete" type="is-danger"
                                            onClick={m.stop(() => this.removeItem(item))}/>
                                    </template>
                                </CardListEntry>
                            ))
                        }</CardList>
                    )),
                    error: ({ error, refresh }) => (
                        <div class="section content has-text-danger has-text-centered">
                            <BField><BIcon icon="emoticon-sad" size="is-large" type="is-danger"/></BField>
                            <BField>There was an error loading the switches.</BField>
                            <BField><BButton label="Try again" type="is-warning" onClick={refresh}/></BField>
                            <BField>{error.message}</BField>
                        </div>
                    ),
                }}/>
                <div class="fab-container is-right">
                    <BButton class="fab-item" iconLeft="plus" type="is-primary" onClick={() => this.createItem()}/>
                </div>
            </div>
        );
    },
});

type SwitchList = InstanceType<typeof SwitchList>;
export default SwitchList;
