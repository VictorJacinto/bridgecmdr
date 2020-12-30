<template>
    <validation-observer id="tie-editor" #default="{ handleSubmit }" tag="div" class="modal-card">
        <div class="navbar is-primary">
            <div class="navbar-brand">
                <a class="navbar-item" @click="$modals.cancel()"><b-icon icon="arrow-left"/></a>
                <div class="navbar-item">{{ title }}</div>
            </div>
            <div class="navbar-menu">
                <div class="navbar-end">
                    <a class="navbar-item" @click="handleSubmit(onSaveClicked)">{{ confirmText }}</a>
                </div>
            </div>
        </div>
        <main class="modal-card-body">
            <validation-provider #default="{ errors }" name="switch" rules="required" slim>
                <b-field label="Switch or monitor" expanded v-bind="{ ...validationStatus(errors) }">
                    <switch-dropdown v-model="source.switchId" :options="switches" :loading="loading" expanded/>
                </b-field>
            </validation-provider>
            <validation-provider #default="{ errors }" name="input channel" rules="required|min_value:1" slim>
                <b-field label="Input" v-bind="{ ...validationStatus(errors) }">
                    <b-numberinput v-model="source.inputChannel" :min="1" :use-html5-validation="false"
                                   controls-position="compact"/>
                </b-field>
            </validation-provider>
            <validation-provider #default="{ errors }" :name="videoOutputName" :rules="videoOutputRules" slim>
                <b-field v-show="showVideoOutput" :label="videoOutputLabel" v-bind="{ ...validationStatus(errors) }">
                    <b-numberinput v-model="source.outputChannels.video" :use-html5-validation="false"
                                   :min="videoOutputMinimal" controls-position="compact"/>
                </b-field>
            </validation-provider>
            <validation-provider #default="{ errors }" name="audio output channel" :rules="audioOutputRules" slim>
                <b-field v-show="showAudioOutput" label="Audio output" v-bind="{ ...validationStatus(errors) }">
                    <b-numberinput v-model="source.outputChannels.audio" :use-html5-validation="false"
                                   :min="audioOutputMinimal" controls-position="compact"/>
                </b-field>
            </validation-provider>
        </main>
    </validation-observer>
</template>

<script lang="ts">
    import { cloneDeep } from "lodash";
    import Component, { mixins } from "vue-class-component";
    import { Prop } from "vue-property-decorator";
    import { is, prop } from "../../../foundation/validation/valid";
    import DoesValidation from "../../concerns/does-validation";
    import IndicatesLoading from "../../concerns/indicates-loading";
    import type { Switch } from "../../store/modules/switches";
    import switches from "../../store/modules/switches";
    import type { EmptyTie } from "../../store/modules/ties";
    import type { DriverDescriptor } from "../../system/driver";
    import Driver, { DriverCapabilities } from "../../system/driver";
    import SwitchDropdown from "../dropdowns/SwitchDropdown";

    const drivers = Driver.all();

    @Component<TieModal>({
        name:       "TieModal",
        components: {
            "switch-dropdown": SwitchDropdown,
        },
    })
    export default class TieModal extends mixins(DoesValidation, IndicatesLoading) {
        @Prop(prop(is.object<EmptyTie>()))
        readonly item!: EmptyTie;

        source = cloneDeep(this.item);

        get switches(): Switch[] {
            return switches.items;
        }

        get title(): string {
            return this.source._id ? "Edit tie" : "New tie";
        }

        get confirmText(): string {
            return this.source._id ? "Save" : "Create";
        }

        get switcher(): Switch|undefined {
            return this.switches.find(row => row._id === this.source.switchId);
        }

        get driver(): DriverDescriptor|undefined {
            return drivers.find(row => row.guid === this.switcher?.driverId);
        }

        get showVideoOutput(): boolean {
            return this.driver ?
                Boolean(this.driver.capabilities & DriverCapabilities.hasMultipleOutputs) :
                false;
        }

        get showAudioOutput(): boolean {
            return (this.showVideoOutput && this.driver) ?
                Boolean(this.driver.capabilities & DriverCapabilities.canDecoupleAudioOutput) :
                false;
        }

        get videoOutputName(): string {
            return this.showAudioOutput ? "video output channel" : "output channel";
        }

        get videoOutputLabel(): string {
            return this.showAudioOutput ? "Video output" : "Output";
        }

        get videoOutputRules(): Record<string, unknown> {
            return this.showVideoOutput ? { required: true, min_value: 1 } : {};
        }

        get audioOutputRules(): Record<string, unknown> {
            return this.showAudioOutput ? { required: true, min_value: 1 } : {};
        }

        get videoOutputMinimal(): number {
            return this.showVideoOutput ? 1 : 0;
        }

        get audioOutputMinimal(): number {
            return this.showAudioOutput ? 1 : 0;
        }

        mounted(): void {
            this.$nextTick(() => this.loadingWhile(this.getSwitches()));
        }

        getSwitches(): Promise<void> {
            return switches.all();
        }

        onSaveClicked(): void {
            this.$modals.confirm(this.source);
        }
    }
</script>
