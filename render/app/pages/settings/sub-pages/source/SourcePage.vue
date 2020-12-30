<template>
    <div id="source-page">
        <current-source :id="id" slim>
            <template #loading="{ loading }">
                <watcher :watching="loading" @change="onLoading"/>
                <card-list>
                    <card-list-entry>
                        <template #image>
                            <figure class="image is-48x48">
                                <b-skeleton circle width="48px" height="48px"/>
                            </figure>
                        </template>
                        <template #default>
                            <b-skeleton height="1.25rem" :count="2"/>
                        </template>
                        <template #actions>
                            <b-button class="card-action-item" size="is-medium" disabled loading/>
                        </template>
                    </card-list-entry>
                </card-list>
            </template>
            <template #default="{ current: source }">
                <watcher :watching="source" @change="onSourceChange(source)"/>
                <card-list>
                    <card-list-entry>
                        <template #image>
                            <figure class="image icon is-48x48">
                                <img :src="images.get(source)" class="is-rounded has-background-grey-light" alt="">
                            </figure>
                        </template>
                        <template #default>
                            <p class="has-text-weight-semibold is-size-5">{{ source.title }}</p>
                            <p class="has-text-light">Source</p>
                        </template>
                        <template #actions>
                            <b-button class="card-action-item" icon-left="pencil" type="is-primary" size="is-medium"
                                      @click="updateItem(source)"/>
                        </template>
                    </card-list-entry>
                    <tie-list :source-id="source._id"/>
                </card-list>
            </template>
            <template #error="{ error }">
                <watcher :watching="error" @change="onError"/>
                <div class="section content has-text-centered">
                    <b-field><b-icon icon="emoticon-sad" size="is-large" type="is-danger"/></b-field>
                    <b-field>There was an error loading this item...</b-field>
                    <b-field>{{ error }}</b-field>
                </div>
            </template>
        </current-source>
    </div>
</template>

<script lang="ts">
    import Component, { mixins } from "vue-class-component";
    import { Prop } from "vue-property-decorator";
    import Watcher from "../../../../../foundation/components/Watcher";
    import { is, prop } from "../../../../../foundation/validation/valid";
    import CardList from "../../../../components/card-list/CardList";
    import CardListEntry from "../../../../components/card-list/CardListEntry";
    import CurrentSource from "../../../../components/data/items/CurrentSource";
    import DoesValidation from "../../../../concerns/does-validation";
    import HasImages from "../../../../concerns/has-images";
    import ManagesSources from "../../../../concerns/managers/manages-sources";
    import UsesSettingsTitle from "../../../../concerns/uses-settings-title";
    import type { Source } from "../../../../store/modules/sources";
    import { idPattern } from "../../../../support/validation";
    import TieList from "./parts/TieList.vue";

    @Component<SourcePage>({
        name:       "SourcePage",
        components: {
            "card-list-entry": CardListEntry,
            "card-list":       CardList,
            "current-source":  CurrentSource,
            "watcher":         Watcher,
            "tie-list":        TieList,
        },
    })
    export default class SourcePage extends mixins(HasImages, UsesSettingsTitle, ManagesSources, DoesValidation) {
        @Prop(prop(is.string.matches(idPattern)))
        readonly id!: string;

        onLoading(): void {
            this.title = "Loading...";
        }

        onSourceChange(source: Source): void {
            this.title = source.title;
        }

        onError(): void {
            this.title = "Failed to find source";
        }
    }
</script>
