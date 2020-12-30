<template>
    <div id="settings-page">
        <card-list>
            <card-list-entry :to="{ name: 'settings/general' }">
                <template #image>
                    <svg-icon name="mdiCogs" type="is-link" size="is-48x48" inverted rounded/>
                </template>
                <template #default>
                    <p class="has-text-weight-semibold">General</p>
                    <p class="has-text-light">Change other miscellaneous settings.</p>
                </template>
            </card-list-entry>
            <card-list-entry :to="{ name: 'sources' }">
                <template #image>
                    <svg-icon name="mdiGamepadVariant" type="is-link" size="is-48x48" inverted rounded/>
                </template>
                <template #default>
                    <p class="has-text-weight-semibold">Sources</p>
                    <p class="has-text-light">Add, edit, or remove sources.</p>
                </template>
            </card-list-entry>
            <card-list-entry :to="{ name: 'switches' }">
                <template #image>
                    <svg-icon name="mdiVideoSwitch" type="is-link" size="is-48x48" inverted rounded/>
                </template>
                <template #default>
                    <p class="has-text-weight-semibold">Switches & monitors</p>
                    <p class="has-text-light">Add, edit, or remove switches and monitors.</p>
                </template>
            </card-list-entry>
        </card-list>
    </div>
</template>

<script lang="ts">
    import Component, { mixins } from "vue-class-component";
    import SvgIcon from "../../../components/SvgIcon.vue";
    import CardList from "../../../components/card-list/CardList";
    import CardListEntry from "../../../components/card-list/CardListEntry";
    import UsesSettingsTitle from "../../../concerns/uses-settings-title";

    @Component<SettingsPage>({
        name:       "SettingsPage",
        components: {
            "svg-icon":        SvgIcon,
            "card-list-entry": CardListEntry,
            "card-list":       CardList,
        },
    })
    export default class SettingsPage extends mixins(UsesSettingsTitle) {
        mounted(): void {
            this.title = "Settings";
        }
    }
</script>
