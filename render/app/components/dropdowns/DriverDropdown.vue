<template>
    <b-dropdown v-bind="proxiedProperties" @change="updateValue">
        <template #trigger>
            <slot name="default" v-bind="{ label, isExperimental }">
                <b-button v-if="trigger === 'button'" v-bind="buttonProperties"/>
                <b-input v-else v-bind="inputProperties"/>
            </slot>
        </template>
        <template #default>
            <b-dropdown-item v-for="option of options" :key="option.guid" :value="option.guid">
                {{ option.title }}
                <span v-if="driverIsExperimental(option)" class="has-text-warning">
                    <b-icon icon="alert" size="is-small" type="is-warning"/>
                    Experimental
                </span>
            </b-dropdown-item>
        </template>
    </b-dropdown>
</template>

<script lang="ts">
    import v from "vahvista";
    import Vue from "vue";
    import Component from "vue-class-component";
    import { Prop, Watch } from "vue-property-decorator";
    import { KnownColorModifiers, PopupPositionModifiers, SizeModifiers } from "../../../foundation/helpers/buefy";
    import type { DriverDescriptor } from "../../system/driver";
    import { DriverCapabilities } from "../../system/driver";
    import { DropdownArialRoles, DropdownTrigger } from "../base/SimpleDropdown";

@Component<DriverDropdown>({ name: "DriverDropdown" })
    export default class DriverDropdown extends Vue {
        @Prop({ type: String, default: undefined, validator: v.id })
        readonly value!: string;

        @Prop({ type: Array, required: true })
        readonly options!: DriverDescriptor[];

        @Prop({ type: String, default: "Select an item", validator: v.notEmpty })
        readonly placeholder!: string;

        @Prop({ type: String, default: "input", validator: v.enum(DropdownTrigger) })
        readonly trigger!: DropdownTrigger;

        // === Dropdown == ==

        @Prop({ type: String, default: "is-bottom-right", validator: v.enum(PopupPositionModifiers) })
        readonly position!: PopupPositionModifiers;

        @Prop({ type: String, default: "fade", validator: v.notEmpty })
        readonly animation!: string;

        @Prop({ type: Boolean, default: true })
        readonly mobileModal!: boolean;

        @Prop({ type: String, default: undefined, validator: v.enum(DropdownArialRoles) })
        readonly ariaRole!: DropdownArialRoles;

        @Prop({ type: Boolean, default: true })
        readonly scrollable!: boolean;

        @Prop({ type: [ String, Number ], default: "260px", validator: v.or(v.integer.positive, v.notEmpty) })
        readonly maxHeight!: number|string;

        // === Button/Input == ==

        @Prop({ type: String, default: undefined, validator: v.enum(KnownColorModifiers) })
        readonly type!: undefined|KnownColorModifiers;

        @Prop({ type: String, default: undefined, validator: v.enum(SizeModifiers) })
        readonly size!: undefined|SizeModifiers;

        @Prop(Boolean)
        readonly loading!: undefined|boolean;

        @Prop(Boolean)
        readonly inverted!: undefined|boolean;

        @Prop(Boolean)
        readonly rounded!: undefined|boolean;

        @Prop(Boolean)
        readonly outlined!: undefined|boolean;

        // === Both == ==

        @Prop(Boolean)
        readonly disabled!: undefined|boolean;

        @Prop(Boolean)
        readonly expanded!: undefined|boolean;

        innerValue = this.value || null;

        driver = this.innerValue ? this.options.find(option => option.guid === this.innerValue) || null : null;

        get label(): undefined|string {
            return this.driver ? this.driver.title : "";
        }

        get isExperimental(): boolean {
            return this.driver ? this.driverIsExperimental(this.driver) : false;
        }

        get proxiedProperties(): Record<string, unknown> {
            return {
                value:       this.innerValue,
                position:    this.position,
                animation:   this.animation,
                mobileModal: this.mobileModal,
                ariaRole:    this.ariaRole,
                scrollable:  this.scrollable,
                maxHeight:   this.maxHeight,
                disabled:    this.disabled,
                expanded:    this.expanded,
            };
        }

        get commonTriggerProperties(): Record<string, unknown> {
            return {
                iconRight: "chevron-down",
                size:      this.size,
                loading:   this.loading,
                disabled:  this.disabled,
                expanded:  this.expanded,
            };
        }

        get buttonProperties(): Record<string, unknown> {
            return {
                ...this.commonTriggerProperties,
                iconLeft: this.isExperimental ? "alert" : undefined,
                label:    this.label || this.placeholder,
                type:     this.type,
                inverted: this.inverted,
                rounded:  this.rounded,
                outlined: this.outlined,
            };
        }

        get inputProperties(): Record<string, unknown> {
            return {
                ...this.commonTriggerProperties,
                icon:        this.isExperimental ? "alert" : undefined,
                customClass: "has-cursor-pointer",
                type:        this.type,
                value:       this.label,
                placeholder: this.placeholder,
                readonly:    true,
            };
        }

        @Watch("value")
        onValueChanged(value: string): void {
            this.innerValue = value;
            this.driver = this.options.find(option => option.guid === this.value) || null;
        }

        updateValue(value: string): void {
            this.onValueChanged(value);
            this.$emit("input", value);
        }

        driverIsExperimental(driver: DriverDescriptor): boolean {
            return driver.capabilities === DriverCapabilities.experimental;
        }
    }
</script>
