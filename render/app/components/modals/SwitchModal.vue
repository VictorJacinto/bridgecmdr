<template>
    <validation-observer id="switch-editor" #default="{ handleSubmit }" tag="div" class="modal-card">
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
            <validation-provider #default="{ errors }" name="title" rules="required" slim>
                <b-field label="Title" expanded v-bind="{ ...validationStatus(errors) }">
                    <b-input v-model="source.title" placeholder="Required"/>
                </b-field>
            </validation-provider>
            <validation-provider #default="{ errors }" name="driver" rules="required" slim>
                <b-field label="Driver" expanded v-bind="{ ...driverStatus(errors) }">
                    <driver-dropdown v-model="source.driverId" :options="drivers"
                                     placeholder="Required" expanded/>
                </b-field>
            </validation-provider>
            <validation-provider #default="{ errors }" name="device" rules="required|location" slim>
                <b-field label="Device" expanded v-bind="{ ...validationStatus(errors) }">
                    <device-location-input v-model="source.path" :ports="ports" :loading="loading"
                                           :type="errors.length > 0 ? 'is-danger' : undefined"/>
                </b-field>
            </validation-provider>
        </main>
    </validation-observer>
</template>

<script lang="ts">
    import { cloneDeep } from "lodash";
    import Component, { mixins } from "vue-class-component";
    import { Prop } from "vue-property-decorator";
    import DoesValidation from "../../concerns/does-validation";
    import IndicatesLoading from "../../concerns/indicates-loading";
    import type { SerialPortEntry } from "../../store/modules/devices";
    import devices from "../../store/modules/devices";
    import type { Switch } from "../../store/modules/switches";
    import type { BFieldMessageProps } from "../../support/validation";
    import Driver, { DriverCapabilities } from "../../system/driver";
    import DeviceLocationInput from "../DeviceLocationInput.vue";
    import DriverDropdown from "../dropdowns/DriverDropdown.vue";

    @Component<SwitchModal>({
        name:       "SwitchModal",
        components: {
            "driver-dropdown":       DriverDropdown,
            "device-location-input": DeviceLocationInput,
        },
    })
    export default class SwitchModal extends mixins(DoesValidation, IndicatesLoading) {
        @Prop({ type: Object, required: true })
        readonly item!: Partial<Switch>;

        get ports(): SerialPortEntry[] {
            return devices.ports;
        }

        source = cloneDeep(this.item);
        drivers = Driver.all();

        get title(): string {
            return this.source._id ? "Edit switch or monitor" : "Add switch or monitor";
        }

        get confirmText(): string {
            return this.source._id ? "Save" : "Create";
        }

        mounted(): void {
            this.$nextTick(() => this.loadingWhile(this.getPorts()));
        }

        getPorts(): Promise<void> {
            return devices.getPorts();
        }

        onSaveClicked(): void {
            this.$modals.confirm(this.source);
        }

        driverStatus(errors: string[]): BFieldMessageProps {
            const driver = this.source.driverId ?
                this.drivers.find(driver_ => driver_.guid === this.source.driverId) || null :
                null;

            return driver && driver.capabilities & DriverCapabilities.experimental ?
                { message: "This driver is experimental", type: "is-warning" } :
                this.validationStatus(errors);
        }
    }
</script>
