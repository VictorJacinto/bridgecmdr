<template>
    <div id="general-page">
        <card-list>
            <card-list-entry class="has-cursor-pointer">
                <template #content>
                    <icon-size-dropdown #default="{ label }" v-model="iconSize" expanded>
                        <div class="card-content">
                            <p class="has-text-weight-semibold">Icon size</p>
                            <p class="has-text-light">{{ label }}</p>
                        </div>
                    </icon-size-dropdown>
                </template>
            </card-list-entry>
            <card-list-entry class="has-cursor-pointer">
                <template #content>
                    <power-off-dropdown #default="{ label }" v-model="powerOffWhen" expanded>
                        <div class="card-content">
                            <p class="has-text-weight-semibold">Power button will power off</p>
                            <p class="has-text-light">{{ label }}</p>
                        </div>
                    </power-off-dropdown>
                </template>
            </card-list-entry>
            <card-list-entry>
                <template #default>
                    <p class="has-text-weight-semibold">
                        Power on switches & monitors when {{ packageInfo.productName }} starts
                    </p>
                </template>
                <template #actions>
                    <b-switch v-model="powerOnSwitchesAtStart" passive-type="is-light" type="is-white"/>
                </template>
            </card-list-entry>
            <card-list-entry>
                <template #default>
                    <p class="has-text-weight-semibold">Start {{ packageInfo.productName }} when the system boots</p>
                </template>
                <template #actions>
                    <b-switch v-model="autoStart" passive-type="is-light" type="is-white"
                              :disabled="autoStartDisabled"/>
                </template>
            </card-list-entry>
        </card-list>
    </div>
</template>

<script lang="ts">
    import { cloneDeep } from "lodash";
    import Component, { mixins } from "vue-class-component";
    import packageInfo from "../../../../../package.json";
    import CardList from "../../../components/card-list/CardList";
    import CardListEntry from "../../../components/card-list/CardListEntry";
    import IconSizeDropdown from "../../../components/dropdowns/IconSizeDropdown";
    import PowerOffDropdown from "../../../components/dropdowns/PowerOffDropdown";
    import UsesSettingsTitle from "../../../concerns/uses-settings-title";
    import autoStart from "../../../store/modules/auto-start";
    import type { IconSize, PowerOffTaps } from "../../../store/modules/settings";
    import settings from "../../../store/modules/settings";

    @Component<GeneralPage>({
        name:       "GeneralPage",
        components: {
            "card-list-entry":    CardListEntry,
            "card-list":          CardList,
            "power-off-dropdown": PowerOffDropdown,
            "icon-size-dropdown": IconSizeDropdown,
        },
    })
    export default class GeneralPage extends mixins(UsesSettingsTitle) {
        packageInfo = cloneDeep(packageInfo);

        get powerOnSwitchesAtStart(): boolean {
            return settings.powerOnSwitchesAtStart;
        }

        set powerOnSwitchesAtStart(value: boolean) {
            settings.set("powerOnSwitchesAtStart", value);
        }

        get iconSize(): IconSize {
            return settings.iconSize;
        }

        set iconSize(value: IconSize) {
            settings.set("iconSize", value);
        }

        get powerOffWhen(): PowerOffTaps {
            return settings.powerOffWhen;
        }

        set powerOffWhen(value: PowerOffTaps) {
            settings.set("powerOffWhen", value);
        }

        get autoStart(): boolean {
            return autoStart.active;
        }

        set autoStart(value: boolean) {
            autoStart.setAutoStart(value).catch(error => console.error(error));
        }

        get autoStartDisabled(): boolean {
            return autoStart.loading;
        }

        mounted(): void {
            this.$nextTick(() => this.checkAutoStartState());
            this.title = "General";
        }

        checkAutoStartState(): Promise<boolean> {
            return autoStart.checkAutoStartState();
        }
    }
</script>
