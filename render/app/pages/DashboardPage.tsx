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

import * as tsx from "vue-tsx-support";
import packageInfo from "../../../package.json";
import { BButton } from "../../foundation/components/buefy-tsx";
import CallsDevices from "../concerns/calls-devices";
import HasIcons from "../concerns/has-icons";

// @vue/component
const DashboardPage = tsx.componentFactory.mixin(CallsDevices).mixin(HasIcons).create({
    name: "DashboardPage",
    render() {
        return (
            <div id="dashboard-page">
                <div class="dashboard">{
                    this.devices.map(device => (
                        <button class="button is-light" title={device.source.title} onClick={() => this.select(device)}>
                            <figure class="image icon is-128x128">
                                <img src={this.icons.get(device.source)} alt=""/>
                            </figure>
                        </button>
                    ))
                }</div>
                <div id="dashboard-action-buttons" class="fab-container is-right">
                    <span class="is-inline-block pt-4">{packageInfo.productName} {packageInfo.version}</span>
                    <BButton class="fab-item" iconLeft="power" size="is-medium" type="is-danger"/>
                    <BButton class="fab-item" iconLeft="wrench" size="is-medium" type="is-link"
                        onClick={() => this.$router.push({ name: "settings" })}/>
                </div>
            </div>
        );
    },
});

type DashboardPage = InstanceType<typeof DashboardPage>;
export default DashboardPage;
