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
import { modifiers as m } from "vue-tsx-support/lib/modifiers";
import { BButton, BField, BIcon, BSkeleton } from "../../../../../../foundation/components/buefy-tsx";
import { mapModuleActions, mapModuleState } from "../../../../../../foundation/helpers/vuex";
import { is, prop } from "../../../../../../foundation/validation/valid";
import CardList from "../../../../../components/card-list/CardList";
import CardListEntry from "../../../../../components/card-list/CardListEntry";
import Ties from "../../../../../components/data/sources/Ties";
import ManagesTies from "../../../../../concerns/managers/manages-ties";
import switches, { Switch } from "../../../../../store/modules/switches";
import { Tie } from "../../../../../store/modules/ties";
import { IDPattern } from "../../../../../support/validation";
import Driver from "../../../../../system/driver";

const drivers = Driver.all();

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
        getSwitch(tie: Tie): Switch|null {
            return this.switches.find(switch_ => switch_._id === tie.switchId) || null;
        },
        getSwitchName(tie: Tie): string|null {
            const switch_ = this.getSwitch(tie);

            return switch_ ? switch_.title : null;
        },
        getDriver(tie: Tie): string|null {
            const switch_ = this.getSwitch(tie);
            if (switch_) {
                const driver = drivers.find(driver_ => driver_.guid === switch_.driverId);

                return driver ? driver.title : null;
            }

            return null;
        },
    },
    render(): VNode {
        return (
            <div>
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
                                <CardListEntry onClick={() => this.updateItem(tie)}>
                                    <template slot="default">
                                        <p class="has-text-weight-semibold">{this.getSwitchName(tie)}</p>
                                        <p class="has-text-light">{[
                                            (<BIcon icon="import" size="is-small"/>),
                                            ` ${tie.inputChannel} `,
                                            tie.outputChannels.video > 0 ? [
                                                (<BIcon icon="export" size="is-small"/>),
                                                ` ${tie.outputChannels.video} `,
                                            ] : undefined,
                                            tie.outputChannels.audio > 0 ? [
                                                (<BIcon icon="volume-medium" size="is-small"/>),
                                                ` ${tie.outputChannels.audio} `,
                                            ] : undefined,
                                            (<BIcon icon="cog" size="is-small"/>),
                                            ` ${this.getDriver(tie)}`,
                                        ]}</p>
                                    </template>
                                    <template slot="actions">
                                        <BButton class="card-action-item" iconLeft="delete" type="is-danger"
                                            onClick={m.stop(() => this.removeItem(tie))}/>
                                    </template>
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
                <div class="fab-container is-right">
                    <BButton class="fab-item" iconLeft="plus" type="is-primary"
                        onClick={() => this.createItem({ sourceId: this.sourceId })}/>
                </div>
            </div>
        );
    },
});

type TieList = InstanceType<typeof TieList>;
export default TieList;
