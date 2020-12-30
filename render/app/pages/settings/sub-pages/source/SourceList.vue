<template>
    <div id="source-list">
        <sources slim>
            <template #loading>
                <card-list>
                    <card-list-entry v-for="n of 3" :key="n">
                        <template #image>
                            <figure class="image is-48x48">
                                <b-skeleton circle width="48px" height="48px"/>
                            </figure>
                        </template>
                        <template #default>
                            <b-skeleton height="1em" :count="2"/>
                        </template>
                        <template #actions>
                            <b-button class="card-action-item" disabled loading/>
                        </template>
                    </card-list-entry>
                </card-list>
            </template>
            <template #default="{ items: sources }">
                <div v-if="sources.length === 0" class="section content has-text-centered">
                    <b-field><b-icon icon="set-none" size="is-large"/></b-field>
                    <b-field>There are no sources</b-field>
                </div>
                <card-list v-else>
                    <card-list-entry v-for="source of sources" :key="source._id"
                                     :to="{ name: 'source', params: { id: source._id } }">
                        <template #image>
                            <figure class="image icon is-48x48">
                                <img :src="images.get(source)" class="is-rounded has-background-grey-light" alt="">
                            </figure>
                        </template>
                        <template #default>
                            <p class="has-text-weight-semibold">{{ source.title }}</p>
                            <p class="has-text-light">{{ getSwitchCount(source) }}</p>
                        </template>
                        <template #actions>
                            <b-button class="card-action-item" icon-left="delete" type="is-danger"
                                      @click.prevent="removeItem(source)"/>
                        </template>
                    </card-list-entry>
                </card-list>
            </template>
            <template #error="{ error, refresh }">
                <div class="section content has-text-danger has-text-centered">
                    <b-field><b-icon icon="emoticon-sad" size="is-large" type="is-danger"/></b-field>
                    <b-field>There was an error loading the sources.</b-field>
                    <b-field><b-button label="Try again" type="is-warning" @click="refresh"/></b-field>
                    <b-field>{{ error }}</b-field>
                </div>
            </template>
        </sources>
        <div class="fab-container is-right">
            <b-button class="fab-item" icon-left="plus" size="is-medium" type="is-primary" @click="onAddClicked"/>
        </div>
    </div>
</template>

<script lang="ts">
    import Component, { mixins } from "vue-class-component";
    import CardList from "../../../../components/card-list/CardList";
    import CardListEntry from "../../../../components/card-list/CardListEntry";
    import Sources from "../../../../components/data/sources/Sources";
    import HasImages from "../../../../concerns/has-images";
    import ManagesSources from "../../../../concerns/managers/manages-sources";
    import UsesSettingsTitle from "../../../../concerns/uses-settings-title";
    import type { Source } from "../../../../store/modules/sources";
    import type { Tie } from "../../../../store/modules/ties";
    import ties from "../../../../store/modules/ties";

    @Component<SourceList>({
        name:       "SourceList",
        components: {
            "card-list-entry": CardListEntry,
            "card-list":       CardList,
            "sources":         Sources,
        },
    })
    export default class SourceList extends mixins(HasImages, UsesSettingsTitle, ManagesSources) {
        get ties(): Tie[] {
            return ties.items;
        }

        mounted(): void {
            this.$nextTick(() => this.refreshTies());
            this.title = "Sources";
        }

        refreshTies(): Promise<void> {
            return ties.all();
        }

        getSwitchCount(source: Source): string {
            const result = this.ties.reduce((count, tie) => (tie.sourceId === source._id ? count + 1 : count), 0);

            return result !== 1 ? `Uses ${result} switches or monitors` : "Uses one switch or monitor";
        }

        async onAddClicked(): Promise<void> {
            const source = await this.createItem();
            if (source) {
                await this.$router.push({ name: "source", params: { id: source._id } });
            }
        }
    }
</script>
