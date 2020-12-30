<template>
    <div id="tie-list">
        <ties :selector="{ sourceId }" slim>
            <template #loading>
                <card-list>
                    <card-list-entry v-for="n in 3" :key="n">
                        <template #default>
                            <b-skeleton height="1em" :count="2"/>
                        </template>
                        <template #actions>
                            <b-button class="card-action-item" disabled loading/>
                        </template>
                    </card-list-entry>
                </card-list>
            </template>
            <template #default="{ items: ties }">
                <div v-if="ties.length === 0" class="section content has-text-centered">
                    <b-field><b-icon icon="set-none" size="is-large"/></b-field>
                    <b-field>There are no ties for this source</b-field>
                </div>
                <card-list v-else>
                    <card-list-entry v-for="tie of ties" :key="tie._id" @click="updateItem(tie)">
                        <template #default>
                            <p class="has-text-weight-semibold">{{ getSwitchName(tie) }}</p>
                            <p class="has-text-light">
                                <b-icon icon="import" size="is-small"/>&nbsp;{{ tie.inputChannel }}
                                <template v-if="tie.outputChannels.video > 0">
                                    <b-icon icon="export" size="is-small"/>&nbsp;{{ tie.outputChannels.video }}
                                </template>
                                <template v-if="tie.outputChannels.audio > 0">
                                    <b-icon icon="volume-medium" size="is-small"/>&nbsp;{{ tie.outputChannels.audio }}
                                </template>
                                <b-icon :icon="getDeviceIconForTie(tie)" size="is-small"/>&nbsp;{{ getDriver(tie) }}
                            </p>
                        </template>
                        <template #actions>
                            <b-button class="card-action-item" icon-left="delete" type="is-danger"
                                      @click.stop="removeItem(tie)"/>
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
        </ties>
        <div class="fab-container is-right">
            <b-button class="fab-item" icon-left="plus" size="is-medium" type="is-primary"
                      @click="createItem({ sourceId })"/>
        </div>
    </div>
</template>

<script lang="ts">
    import Component, { mixins } from "vue-class-component";
    import { Prop } from "vue-property-decorator";
    import { is, prop } from "../../../../../../foundation/validation/valid";
    import CardList from "../../../../../components/card-list/CardList";
    import CardListEntry from "../../../../../components/card-list/CardListEntry";
    import Ties from "../../../../../components/data/sources/Ties";
    import ManagesTies from "../../../../../concerns/managers/manages-ties";
    import type { Switch } from "../../../../../store/modules/switches";
    import switches from "../../../../../store/modules/switches";
    import type { Tie } from "../../../../../store/modules/ties";
    import { idPattern } from "../../../../../support/validation";
    import Driver, { DeviceType } from "../../../../../system/driver";

    const drivers = Driver.all();
    const iconMap = {
        [DeviceType.switch]:  "video-switch",
        [DeviceType.monitor]: "monitor",
    };

    @Component<TieList>({
        name:       "TieList",
        components: {
            "card-list-entry": CardListEntry,
            "card-list":       CardList,
            "ties":            Ties,
        },
    })
    export default class TieList extends mixins(ManagesTies) {
        @Prop(prop(is.string.matches(idPattern)))
        readonly sourceId!: string;

        get switches(): Switch[] {
            return switches.items;
        }

        mounted(): void {
            this.$nextTick(() => this.refreshSwitches());
        }

        refreshSwitches(): Promise<void> {
            return switches.all();
        }

        getSwitch(tie: Tie): Switch|null {
            return this.switches.find(switch_ => switch_._id === tie.switchId) || null;
        }

        getSwitchName(tie: Tie): string|null {
            const switch_ = this.getSwitch(tie);

            return switch_ ? switch_.title : null;
        }

        getDeviceIconForTie(tie: Tie): string {
            const switch_ = this.getSwitch(tie);
            const info = (switch_ && drivers.find(driver => driver.guid === switch_.driverId)) || null;
            const icon = (info && iconMap[info.type]) || null;
            if (icon) {
                return icon;
            }

            return "cog";
        }

        getDriver(tie: Tie): string|null {
            const switch_ = this.getSwitch(tie);
            if (switch_) {
                const driver = drivers.find(driver_ => driver_.guid === switch_.driverId);

                return driver ? driver.title : null;
            }

            return null;
        }
    }
</script>
