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
import { VNode } from "vue";
import * as tsx from "vue-tsx-support";
import { BButton, BField, BIcon, BSkeleton } from "../../../../../foundation/components/buefy-tsx";
import { mapModuleActions, mapModuleState } from "../../../../../foundation/helpers/vuex";
import { is, prop } from "../../../../../foundation/validation/valid";
import CardList from "../../../../components/card-list/CardList";
import CardListEntry from "../../../../components/card-list/CardListEntry";
import Ties from "../../../../components/data/sources/Ties";
import ManagesTies from "../../../../concerns/managers/manages-ties";
import switches from "../../../../store/modules/switches";
import { IDPattern } from "../../../../support/validation";

// @vue/component
const TieList = tsx.componentFactory.mixin(ManagesTies).create({
    name:  "TieList",
    props: {
        sourceId: prop(is.string.matches(IDPattern)),
    },
    computed: {
        ...mapModuleState(switches, "switches", { switches: "items" }),
    },
    mounted() {
        this.refreshSwitches();
    },
    methods: {
        ...mapModuleActions(switches, "switches", { refreshSwitches: "all" }),
    },
    render(): VNode {
        return (
            <Ties selector={{ sourceId: this.sourceId }} slim scopedSlots={{
                loading: () => (
                    <CardList>{
                        times(3, () => (
                            <CardListEntry>
                                <template slot="default">
                                    <BSkeleton height="1em" count={2}/>
                                </template>
                                <template slot="actions">
                                    <BButton class="card-action-item" disabled loading/>
                                    <BButton class="card-action-item" disabled loading/>
                                </template>
                            </CardListEntry>
                        ))
                    }</CardList>
                ),
                default: ({ items: ties }) => (ties.length === 0 ? (
                    <div class="section content has-text-centered">
                        <BField><BIcon icon="set-none" size="is-large"/></BField>
                        <BField>There are no ties for this source</BField>
                    </div>
                ) : (
                    <CardList>{
                        ties.map(tie => (
                            <CardListEntry>
                                <p>{tie.inputChannel}</p>
                            </CardListEntry>
                        ))
                    }</CardList>
                )),
                error: ({ error, refresh }) => (
                    <div class="section content has-text-danger has-text-centered">
                        <BField><BIcon icon="emoticon-sad" size="is-large" type="is-danger"/></BField>
                        <BField>There was an error loading the sources.</BField>
                        <BField><BButton label="Try again" type="is-warning" onClick={refresh}/></BField>
                        <BField>{error.message}</BField>
                    </div>
                ),
            }}/>
        );
    },
});

type TieList = InstanceType<typeof TieList>;
export default TieList;
