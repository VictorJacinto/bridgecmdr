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
import { BField, BIcon, BNavbar, BNavbarItem } from "../../../foundation/components/buefy-tsx";
import { is, prop } from "../../../foundation/validation/valid";
import dataItem from "../../components/data/DataItem";
import { Source } from "../../store/modules/sources";
import IconCache from "../../support/icon-cache";
import { IDPattern } from "../../support/validation";

const DataItem = dataItem<Source>("sources");

const SourcePage = tsx.component({
    name:  "SourcePage",
    props: {
        id: prop(is.string.matches(IDPattern)),
    },
    data: function () {
        return {
            cache: new IconCache(),
        };
    },
    render(): VNode {
        return (
            <div id="source-page">
                <DataItem id={this.id} scopedSlots={{
                    default: ({ current, error, loading }) => [
                        <BNavbar fixedTop type="is-primary" mobileBurger={false}>
                            <template slot="brand">
                                <BNavbarItem tag="router-link" to={{ name: "sources" }}>
                                    <BIcon icon="arrow-left"/>
                                </BNavbarItem>
                                { error && (<BNavbarItem tag="div">Source load failed</BNavbarItem>) }
                                { current && (<BNavbarItem tag="div">{current.title}</BNavbarItem>) }
                                { loading && (<BNavbarItem tag="div">Loading...</BNavbarItem>) }
                            </template>
                        </BNavbar>,
                        error && (
                            <div class="section content has-text-centered">
                                <BField><BIcon icon="emoticon-sad" size="is-large" type="is-danger"/></BField>
                                <BField>There was an error loading this item...</BField>
                                <BField>{error.message}</BField>
                            </div>
                        ),
                        current && (
                            <div>{current.title}</div>
                        ),
                    ],
                }}/>
            </div>
        );
    },
});

type SourcePage = InstanceType<typeof SourcePage>;
export default SourcePage;
