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
import { BIcon, BNavbar, BNavbarItem } from "../../../foundation/components/buefy-tsx";
import SetsSettingsTitle from "../../concerns/uses-settings-title";

// @vue/component
const SettingsFramePage = tsx.componentFactory.mixin(SetsSettingsTitle).create({
    name: "SettingsFramePage",
    render(): VNode {
        return (
            <div id="settings-frame-page">
                <BNavbar fixedTop type="is-primary" mobileBurger={false}>
                    <template slot="brand">
                        <BNavbarItem tag="a" onClick={() => this.$router.back()}>
                            <BIcon icon="arrow-left"/>
                        </BNavbarItem>
                        <BNavbarItem tag="div">{this.title}</BNavbarItem>
                    </template>
                </BNavbar>
                <router-view/>
            </div>
        );
    },
});

type SettingsFramePage = InstanceType<typeof SettingsFramePage>;
export default SettingsFramePage;
