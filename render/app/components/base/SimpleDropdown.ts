import v from "vahvista";
import type { VNode, CreateElement } from "vue";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import type { BAnyValue } from "../../../foundation/helpers/buefy";
import { KnownColorModifiers, PopupPositionModifiers, SizeModifiers } from "../../../foundation/helpers/buefy";
import { normalizeScopedSlot } from "../../../foundation/helpers/vue";

export const DropdownArialRoles = [ "menu", "list", "dialog" ] as const;
export type DropdownArialRoles = typeof DropdownArialRoles[number];

export const DropdownTrigger = [ "button", "input" ] as const;
export type DropdownTrigger = typeof DropdownTrigger[number];

const BButton = Vue.component("BButton");
const BDropdown = Vue.component("BDropdown");
const BDropdownItem = Vue.component("BDropdownItem");
const BInput = Vue.component("BInput");

@Component({ name: "SimpleDropdown" })
export default class SimpleDropdown<T, V extends BAnyValue> extends Vue {
    @Prop({ required: true })
    readonly value!: V;

    @Prop({ type: Array, required: true })
    readonly options!: T[];

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

    @Prop({ type: [ Number, String ], default: "260px", validator: v.or(v.integer.positive, v.notEmpty) })
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

    // === Overrides == ==

    readonly predicate!: (option: T) => [ string, V ];

    // === Data == ==

    innerValue = this.value || null;

    get label(): undefined|string {
        const result = this.options.find(option => this.predicate(option)[1] === this.innerValue);

        return result ? this.predicate(result)[0] : undefined;
    }

    @Watch("value")
    onValueChanged(value: V): void {
        this.innerValue = value;
    }

    updateValue(value: V): void {
        this.innerValue = value;
        this.$emit("input", value);
    }

    render(h: CreateElement): VNode {
        const makeOption = (option: T): VNode => {
            const entry = this.predicate(option);

            return h(BDropdownItem, { props: { value: entry[1] } }, entry[0]);
        };

        const trigger = normalizeScopedSlot(this, "default", { label: this.label || this.placeholder },
            this.trigger === "button" ?
                h(BButton, {
                    props: {
                        label:     this.label || this.placeholder,
                        iconRight: "chevron-down",
                        type:      this.type,
                        size:      this.size,
                        loading:   this.loading,
                        inverted:  this.inverted,
                        rounded:   this.rounded,
                        outlined:  this.outlined,
                        disabled:  this.disabled,
                        expanded:  this.expanded,
                    },
                }) :
                h(BInput, {
                    props: {
                        customClass: "has-cursor-pointer",
                        iconRight:   "chevron-down",
                        value:       this.label,
                        size:        this.size,
                        loading:     this.loading,
                        disabled:    this.disabled,
                        expanded:    this.expanded,
                        placeholder: this.placeholder,
                        readonly:    true,
                    },
                }));

        return h(
            BDropdown, {
                props: {
                    value:       this.innerValue,
                    position:    this.position,
                    animation:   this.animation,
                    mobileModal: this.mobileModal,
                    ariaRole:    this.ariaRole,
                    scrollable:  this.scrollable,
                    maxHeight:   this.maxHeight,
                    disabled:    this.disabled,
                    expanded:    this.expanded,
                },
                on: {
                    change: (value: V) => this.updateValue(value),
                },
                scopedSlots: {
                    trigger: () => trigger,
                },
            },
            this.options.map(makeOption),
        );
    }
}
