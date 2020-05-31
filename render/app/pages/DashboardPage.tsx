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
import { BButton } from "../../foundation/components/buefy-tsx";

const DashboardPage = tsx.component({
    name: "DashboardPage",
    render() {
        return (
            <div id="dashboard-page">
                Dashboard
                <div id="dashboard-action-buttons" class="fab-container is-right">
                    <BButton class="fab-item" iconLeft="power" type="is-danger"/>
                    <BButton class="fab-item" iconLeft="wrench" type="is-link"
                        onClick={() => this.$router.push({ name: "settings" })}/>
                </div>
            </div>
        );
    },
});

export type DashboardPageConstructor = typeof DashboardPage;
type DashboardPage = InstanceType<DashboardPageConstructor>;
export default DashboardPage;