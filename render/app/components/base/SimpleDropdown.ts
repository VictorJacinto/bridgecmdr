import type { VNode, CreateElement } from "vue";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import type { BAnyValue } from "../../../foundation/helpers/buefy";
import { KnownColorModifiers, PopupPositionModifiers, SizeModifiers } from "../../../foundation/helpers/buefy";
import { normalizeScopedSlot } from "../../../foundation/helpers/vue";
import { be, is, maybe, must, prop } from "../../../foundation/validation/valid";

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
    @Prop(prop(is.any))
    readonly value!: V;

    @Prop(prop(is.array))
    readonly options!: T[];

    @Prop(prop(is.string.notEmpty, "Select an item"))
    readonly placeholder!: string;

    @Prop(prop(is.enum(DropdownTrigger), "input"))
    readonly trigger!: DropdownTrigger;

    // === Dropdown == ==

    @Prop(prop(is.enum(PopupPositionModifiers), "is-bottom-right"))
    readonly position!: PopupPositionModifiers;

    @Prop(prop(is.string.notEmpty, "fade"))
    readonly animation!: string;

    @Prop(prop(is.boolean, true))
    readonly mobileModal!: boolean;

    @Prop(prop(maybe.enum(DropdownArialRoles)))
    readonly ariaRole!: DropdownArialRoles;

    @Prop(prop(is.boolean, true))
    readonly scrollable!: boolean;

    @Prop(prop(must(be.number.integer.positive, be.string.notEmpty), "260px"))
    readonly maxHeight!: number|string;

    // === Button/Input == ==

    @Prop(prop(maybe.enum(KnownColorModifiers)))
    readonly type!: undefined|KnownColorModifiers;

    @Prop(prop(maybe.enum(SizeModifiers)))
    readonly size!: undefined|SizeModifiers;

    @Prop(prop(maybe.boolean))
    readonly loading!: undefined|boolean;

    @Prop(prop(maybe.boolean))
    readonly inverted!: undefined|boolean;

    @Prop(prop(maybe.boolean))
    readonly rounded!: undefined|boolean;

    @Prop(prop(maybe.boolean))
    readonly outlined!: undefined|boolean;

    // === Both == ==

    @Prop(prop(maybe.boolean))
    readonly disabled!: undefined|boolean;

    @Prop(prop(maybe.boolean))
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
