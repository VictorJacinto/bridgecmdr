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
import { BButton, BField, BIcon, BSkeleton } from "../../../../../foundation/components/buefy-tsx";
import { mapModuleActions, mapModuleState } from "../../../../../foundation/helpers/vuex";
import CardList from "../../../../components/card-list/CardList";
import CardListEntry from "../../../../components/card-list/CardListEntry";
import Sources from "../../../../components/data/sources/Sources";
import HasIcons from "../../../../concerns/has-icons";
import ManagesSources from "../../../../concerns/managers/manages-sources";
import UsesSettingsTitle from "../../../../concerns/uses-settings-title";
import { Source } from "../../../../store/modules/sources";
import ties from "../../../../store/modules/ties";

// @vue/component
const SourceList = tsx.componentFactory.mixin(HasIcons).mixin(UsesSettingsTitle).mixin(ManagesSources).create({
    name:     "SourceList",
    computed: {
        ...mapModuleState(ties, "ties", {
            ties: "items",
        }),
    },
    mounted() {
        this.refreshTies();
        this.setSettingsTitle("Sources");
    },
    methods: {
        ...mapModuleActions(ties, "ties", {
            refreshTies: "all",
        }),
        getSwitchCount(source: Source) {
            const result = this.ties.reduce((count, tie) => (tie.sourceId === source._id ? count + 1 : count), 0);

            return result !== 1 ? `Uses ${result} switches or monitors` : "Uses one switch or monitor";
        },
        async onAddClicked() {
            const source = await this.createItem();
            if (source) {
                await this.$router.push({ name: "source", params: { id: source._id } });
            }
        },
    },
    render(): VNode {
        return (
            <div id="source-list">
                <Sources slim scopedSlots={{
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
                    default: ({ items: sources }) => (sources.length === 0 ? (
                        <div class="section content has-text-centered">
                            <BField><BIcon icon="set-none" size="is-large"/></BField>
                            <BField>There are no sources</BField>
                        </div>
                    ) : (
                        <CardList>{
                            sources.map(source => (
                                <CardListEntry to={{ name: "source", params: { id: source._id } }}>
                                    <template slot="image">
                                        <figure class="image icon is-48x48">
                                            <img src={this.icons.get(source)}
                                                class="is-rounded has-background-grey-light"
                                                alt="icon"/>
                                        </figure>
                                    </template>
                                    <template slot="default">
                                        <p class="has-text-weight-semibold">{source.title}</p>
                                        <p class="has-text-light">{this.getSwitchCount(source)}</p>
                                    </template>
                                    <template slot="actions">
                                        <BButton class="card-action-item" iconLeft="delete" type="is-danger"
                                            onClick={m.prevent(() => this.removeItem(source))}/>
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
                    <BButton class="fab-item" iconLeft="plus" size="is-medium" type="is-primary"
                        onClick={() => this.onAddClicked()}/>
                </div>
            </div>
        );
    },
});

type SourceList = InstanceType<typeof SourceList>;
export default SourceList;
