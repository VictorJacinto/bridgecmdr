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
import { modifiers as m } from "vue-tsx-support/lib/modifiers";
import Watcher from "../../../../../foundation/components/Watcher";
import { BButton, BField, BIcon, BSkeleton } from "../../../../../foundation/components/buefy-tsx";
import { is, prop } from "../../../../../foundation/validation/valid";
import CardList from "../../../../components/card-list/CardList";
import CardListEntry from "../../../../components/card-list/CardListEntry";
import CurrentSource from "../../../../components/data/items/CurrentSource";
import ManagesSources from "../../../../concerns/managers/manages-sources";
import UsesSettingsTitle from "../../../../concerns/uses-settings-title";
import { Source } from "../../../../store/modules/sources";
import IconCache from "../../../../support/icon-cache";
import { IDPattern } from "../../../../support/validation";
import TieList from "./parts/TieList";

// @vue/component
const SourcePage = tsx.componentFactory.mixin(UsesSettingsTitle).mixin(ManagesSources).create({
    name:  "SourcePage",
    props: {
        id: prop(is.string.matches(IDPattern)),
    },
    data: function () {
        return {
            icons: new IconCache(),
        };
    },
    methods: {
        onLoading() {
            this.setSettingsTitle("Loading...");
        },
        onSourceChange(source: Source) {
            this.setSettingsTitle(source.title);
        },
        onError() {
            this.setSettingsTitle("Failed to source");
        },
    },
    render(): VNode {
        return (
            <div id="source-page">
                <CurrentSource id={this.id} slim scopedSlots={{
                    loading: ({ loading }) => [
                        <Watcher watching={loading} onChange={() => this.onLoading()}/>,
                        <CardList>{
                            <CardListEntry>
                                <template slot="image">
                                    <figure class="image is-48x48">
                                        <BSkeleton circle width="48px" height="48px"/>
                                    </figure>
                                </template>
                                <template slot="default">
                                    <BSkeleton height="1.25rem" count={1}/>
                                    <BSkeleton height="1.25rem" count={1}/>
                                </template>
                                <template slot="actions">
                                    <BButton class="card-action-item" size="is-medium" disabled loading/>
                                </template>
                            </CardListEntry>
                        }</CardList>,
                    ],
                    default: ({ current: source }) => [
                        <Watcher watching={source} onChange={() => this.onSourceChange(source)}/>,
                        <CardList>
                            <CardListEntry>
                                <template slot="image">
                                    <figure class="image icon is-48x48">
                                        <img src={this.icons.get(source)} class="is-rounded has-background-grey-light"
                                            alt="icon"/>
                                    </figure>
                                </template>
                                <template slot="default">
                                    <p class="has-text-weight-semibold is-size-5">{source.title}</p>
                                    <p class="has-text-light">Source</p>
                                </template>
                                <template slot="actions">
                                    <BButton class="card-action-item" iconLeft="pencil" type="is-primary"
                                        size="is-medium" onClick={m.prevent(() => this.updateItem(source))}/>
                                </template>
                            </CardListEntry>
                            <TieList sourceId={source._id}/>
                        </CardList>,
                    ],
                    error: ({ error }) => [
                        <Watcher watching={error} onChange={() => this.onError()}/>,
                        <div class="section content has-text-centered">
                            <BField><BIcon icon="emoticon-sad" size="is-large" type="is-danger"/></BField>
                            <BField>There was an error loading this item...</BField>
                            <BField>{error.message}</BField>
                        </div>,
                    ],
                }}/>
            </div>
        );
    },
});

type SourcePage = InstanceType<typeof SourcePage>;
export default SourcePage;
