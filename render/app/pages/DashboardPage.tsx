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
import { mapModuleActions, mapModuleState } from "../../foundation/helpers/vuex";
import HasIcons from "../concerns/has-icons";
import sources from "../store/modules/sources";
import switches from "../store/modules/switches";
import ties from "../store/modules/ties";

// @vue/component
const DashboardPage = tsx.componentFactory.mixin(HasIcons).create({
    name:     "DashboardPage",
    computed: {
        ...mapModuleState(switches, "switches", {
            switches: "items",
        }),
        ...mapModuleState(sources, "sources", {
            sources: "items",
        }),
        ...mapModuleState(ties, "ties", {
            ties: "items",
        }),
    },
    mounted() {
        this.$nextTick(() => this.$loading.while(this.refresh()));
    },
    methods: {
        ...mapModuleActions(switches, "switches", {
            refreshSwitches: "all",
        }),
        ...mapModuleActions(sources, "sources", {
            refreshSources: "all",
        }),
        ...mapModuleActions(ties, "ties", {
            refreshTies: "all",
        }),
        async refresh() {
            await this.refreshTies();
            await this.refreshSwitches();
            await this.refreshSources();
        },
    },
    render() {
        return (
            <div id="dashboard-page">
                <div class="dashboard">{
                    this.sources.map(source => (
                        <button class="button is-light">
                            <figure class="image icon is-128x128">
                                <img src={this.icons.get(source)}/>
                            </figure>
                        </button>
                    ))
                }</div>
                Dashboard
                <div id="dashboard-action-buttons" class="fab-container is-right">
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
