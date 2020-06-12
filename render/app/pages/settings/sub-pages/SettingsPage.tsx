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

import { VNode } from "vue";
import * as tsx from "vue-tsx-support";
import SvgIcon from "../../../components/SvgIcon";
import CardList from "../../../components/card-list/CardList";
import CardListEntry from "../../../components/card-list/CardListEntry";
import UsesSettingsTitle from "../../../concerns/uses-settings-title";

// @vue/component
const SettingsPage = tsx.componentFactory.mixin(UsesSettingsTitle).create({
    name: "SettingsPage",
    mounted() {
        this.setSettingsTitle("Settings");
    },
    methods: {
        log(target: unknown): void {
            console.log(target);
        },
    },
    render(): VNode {
        return (
            <div id="settings-page">
                <CardList>
                    <CardListEntry onClick={ () => this.log("general") }>
                        <template slot="image">
                            <SvgIcon name="mdiCogs" type="is-link" size="is-48x48" inverted rounded/>
                        </template>
                        <template slot="default">
                            <p class="has-text-weight-semibold">General</p>
                            <p class="has-text-light">Change other miscellaneous settings.</p>
                        </template>
                    </CardListEntry>
                    <CardListEntry to={{ name: "sources" }}>
                        <template slot="image">
                            <SvgIcon name="mdiGamepadVariant" type="is-link" size="is-48x48" inverted rounded/>
                        </template>
                        <template slot="default">
                            <p class="has-text-weight-semibold">Sources</p>
                            <p class="has-text-light">Add, edit, or remove sources.</p>
                        </template>
                    </CardListEntry>
                    <CardListEntry to={{ name: "switches" }}>
                        <template slot="image">
                            <SvgIcon name="mdiVideoSwitch" type="is-link" size="is-48x48" inverted rounded/>
                        </template>
                        <template slot="default">
                            <p class="has-text-weight-semibold">Switches & monitors</p>
                            <p class="has-text-light">Add, edit, or remove switches and monitors.</p>
                        </template>
                    </CardListEntry>
                </CardList>
            </div>
        );
    },
});

type SettingsPage = InstanceType<typeof SettingsPage>;
export default SettingsPage;
