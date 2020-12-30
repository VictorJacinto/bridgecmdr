<template>
    <div id="switch-list">
        <switches slim>
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
            <template #default="{ items: switches }">
                <div v-if="switches.length === 0" class="section content has-text-centered">
                    <b-field><b-icon icon="set-none" size="is-large"/></b-field>
                    <b-field>There are no switches</b-field>
                </div>
                <card-list v-else>
                    <card-list-entry v-for="switch_ of switches" :key="switch_._id" @click="updateItem(switch_)">
                        <template #image>
                            <svg-icon :name="getIconForSwitch(switch_)" type="is-primary" size="is-48x48" inverted
                                      rounded/>
                        </template>
                        <template #default>
                            <p class="has-text-weight-semibold">{{ switch_.title }}</p>
                            <p class="has-text-light">{{ getDriverTitleForSwitch(switch_) }}</p>
                        </template>
                        <template #actions>
                            <b-button class="card-action-item" icon-left="delete" type="is-danger"
                                      @click.stop="removeItem(switch_)"/>
                        </template>
                    </card-list-entry>
                </card-list>
            </template>
            <template #error="{ error, refresh }">
                <div class="section content has-text-danger has-text-centered">
                    <b-field><b-icon icon="emoticon-sad" size="is-large" type="is-danger"/></b-field>
                    <b-field>There was an error loading the switches.</b-field>
                    <b-field><b-button label="Try again" type="is-warning" @click="refresh"/></b-field>
                    <b-field>{{ error }}</b-field>
                </div>
            </template>
        </switches>
        <div class="fab-container is-right">
            <b-button class="fab-item" icon-left="plus" size="is-medium" type="is-primary" @click="createItem"/>
        </div>
    </div>
</template>

<script lang="ts">
    import Component, { mixins } from "vue-class-component";
    import SvgIcon from "../../../components/SvgIcon.vue";
    import CardList from "../../../components/card-list/CardList";
    import CardListEntry from "../../../components/card-list/CardListEntry";
    import Switches from "../../../components/data/sources/Switches";
    import ManagesSwitches from "../../../concerns/managers/manages-switches";
    import UsesSettingsTitle from "../../../concerns/uses-settings-title";
    import type { Switch } from "../../../store/modules/switches";
    import Driver, { DeviceType } from "../../../system/driver";

    const drivers = Driver.all();
    const iconMap = {
        [DeviceType.switch]:  "mdiVideoSwitch",
        [DeviceType.monitor]: "mdiMonitor",
    };

    @Component<SwitchList>({
        name:       "SwitchList",
        components: {
            "card-list-entry": CardListEntry,
            "card-list":       CardList,
            "switches":        Switches,
            "svg-icon":        SvgIcon,
        },
    })
    export default class SwitchList extends mixins(UsesSettingsTitle, ManagesSwitches) {
        mounted(): void {
            this.title = "Switches & monitors";
        }

        getIconForSwitch(item: Switch): string {
            const info = drivers.find(driver => driver.guid === item.driverId);
            const icon = info && iconMap[info.type];
            if (icon) {
                return icon;
            }

            return "mdiHelp";
        }

        getDriverTitleForSwitch(item: Switch): string {
            const info = drivers.find(driver => driver.guid === item.driverId);
            if (info) {
                return info.title;
            }

            return "Unknown...";
        }
    }
</script>
