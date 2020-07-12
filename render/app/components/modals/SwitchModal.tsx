import { cloneDeep } from "lodash";
import * as tsx from "vue-tsx-support";
import { BField, BIcon, BInput } from "../../../foundation/components/buefy-tsx";
import { ValidationObserver, ValidationProvider } from "../../../foundation/components/vee-validate-tsx";
import { mapModuleActions, mapModuleState } from "../../../foundation/helpers/vuex";
import { is, prop } from "../../../foundation/validation/valid";
import IndicatesLoading from "../../concerns/indicates-loading";
import devices from "../../store/modules/devices";
import { Switch } from "../../store/modules/switches";
import { BFieldMessageProps, validationStatus } from "../../support/validation";
import Driver, { DriverCapabilities, DriverDescriptor } from "../../system/driver";
import DeviceLocationInput from "../DeviceLocationInput";
import simpleDropdown from "../SimpleDropdown";

const drivers = Driver.all();

const DriverDropdown = simpleDropdown((about: DriverDescriptor) => [ about.title, about.guid ]);

const SwitchModal = tsx.componentFactory.mixin(IndicatesLoading).create({
    name:  "SwitchModal",
    props: {
        item: prop(is.object<Partial<Switch>>()),
    },
    data: function () {
        return {
            source: cloneDeep(this.item),
        };
    },
    computed: {
        ...mapModuleState(devices, "devices", ["ports"]),
        title(): string {
            return this.source._id ? "Edit switch or monitor" : "Add switch or monitor";
        },
        confirmText(): string {
            return this.source._id ? "Save" : "Create";
        },
    },
    mounted() {
        this.$nextTick(() => this.loadingWhile(this.getPorts()));
    },
    methods: {
        ...mapModuleActions(devices, "devices", ["getPorts"]),
        onSaveClicked() {
            this.$modals.confirm(this.source);
        },
        driverStatus(errors: string[]): BFieldMessageProps {
            const driver = this.source.driverId ?
                drivers.find(driver_ => driver_.guid === this.source.driverId) || null :
                null;

            return driver && driver.capabilities & DriverCapabilities.Experimental ?
                { props: { message: "This driver is experimental", type: "is-warning" } } :
                validationStatus(errors);
        },
    },
    render() {
        return (
            <ValidationObserver tag="div" id="switch-editor" class="modal-card" scopedSlots={{
                default: ({ handleSubmit }) => [
                    <div class="navbar is-primary">
                        <div class="navbar-brand">
                            <a class="navbar-item" onClick={() => this.$modals.cancel()}>
                                <BIcon icon="arrow-left"/>
                            </a>
                            <div class="navbar-item">{this.title}</div>
                        </div>
                        <div class="navbar-menu">
                            <div class="navbar-end">
                                <a class="navbar-item" onClick={() => handleSubmit(() => this.onSaveClicked())}>Save</a>
                            </div>
                        </div>
                    </div>,
                    <main class="modal-card-body">
                        <ValidationProvider name="title" rules="required" slim scopedSlots={{
                            default: ({ errors }) => (
                                <BField label="Title" expanded {...validationStatus(errors)}>
                                    <BInput v-model={this.source.title} placeholder="Required"/>
                                </BField>
                            ),
                        }}/>
                        <ValidationProvider name="driver" rules="required" slim scopedSlots={{
                            default: ({ errors }) => (
                                <BField label="Driver" expanded {...this.driverStatus(errors)}>
                                    <DriverDropdown v-model={this.source.driverId} options={drivers}
                                        placeholder="Required" expanded/>
                                </BField>
                            ),
                        }}/>
                        <ValidationProvider name="device" rules="required|location" slim scopedSlots={{
                            default: ({ errors }) => /* TODO: The validator needs to better handle this */ (
                                <BField label="Device" expanded {...validationStatus(errors)}>
                                    <DeviceLocationInput v-model={this.source.path} ports={this.ports}
                                        loading={this.loading} type={errors.length > 0 ? "is-danger" : undefined}/>
                                </BField>
                            ),
                        }}/>
                    </main>,
                ],
            }}/>
        );
    },
});

export default SwitchModal;
