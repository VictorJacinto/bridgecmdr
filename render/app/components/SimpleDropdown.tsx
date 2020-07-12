import { identity } from "lodash";
import { PropOptions, VNode } from "vue";
import * as tsx from "vue-tsx-support";
import {
    BAnyValue, BButton, BDropdown, BDropdownItem, BInput,
    KnownColorModifiers, PopupPositionModifiers, SizeModifiers,
} from "../../foundation/components/buefy-tsx";
import { normalizeScopedSlot } from "../../foundation/helpers/vue";
import { be, is, maybe, must, prop } from "../../foundation/validation/valid";

type SimpleDropdownEvents<T> = { onInput: (value: T) => void };

type SimpleDropdownSlots = { default: { label: string } };

export const DropdownArialRoles = [ "menu", "list", "dialog" ] as const;
export type DropdownArialRoles = typeof DropdownArialRoles[number];

const simpleDropdown = identity(
    <T, V extends BAnyValue>(predicate: (option: T) => [ string, V ]) =>
        // @vue/component
        tsx.componentFactoryOf<SimpleDropdownEvents<V>, SimpleDropdownSlots>().create({
            name:  "SimpleDropdown",
            props: {
                value:       prop(is.any) as PropOptions<BAnyValue>, // prop(is.any) as PropOptions<V>,
                options:     prop(is.array), // prop(is.array.ofType<T>()),
                placeholder: prop(is.string.notEmpty, "Select an item"),
                trigger:     prop(is.enum([ "button", "input" ]), "input"),
                // Dropdown
                position:    prop(is.enum(PopupPositionModifiers), "is-bottom-right"),
                animation:   prop(is.string.notEmpty, "fade"),
                mobileModal: prop(is.boolean, true),
                ariaRole:    prop(maybe.enum(DropdownArialRoles)),
                scrollable:  prop(is.boolean, true),
                maxHeight:   prop(must(be.number.integer.positive, be.string.notEmpty), "260px"),
                // Button/Input
                type:        prop(maybe.enum(KnownColorModifiers)),
                size:        prop(maybe.enum(SizeModifiers)),
                loading:     prop(maybe.boolean),
                inverted:    prop(maybe.boolean),
                rounded:     prop(maybe.boolean),
                outlined:    prop(maybe.boolean),
                // Both
                disabled:    prop(maybe.boolean),
                expanded:    prop(maybe.boolean),
            },
            data: function () {
                return {
                    innerValue: this.value,
                };
            },
            computed: {
                label(): string|undefined {
                    const result = this.options.find(option => predicate(option as T)[1] === this.innerValue) as
                        T|undefined;

                    return result ? predicate(result)[0] : undefined;
                },
            },
            watch: {
                value(value) {
                    this.innerValue = value;
                },
            },
            methods: {
                updateValue(value: V) {
                    this.innerValue = value;
                    this.$emit("input", value);
                },
            },
            render(): VNode {
                const makeOption = (option: T): VNode => {
                    const entry = predicate(option);

                    return (<BDropdownItem value={entry[1]}>{ entry[0] }</BDropdownItem>);
                };

                const trigger = normalizeScopedSlot(this, "default", { label: this.label || this.placeholder },
                    this.trigger === "button" ? (
                        <BButton
                            label={this.label || this.placeholder}
                            type={this.type}
                            size={this.size}
                            loading={this.loading}
                            inverted={this.inverted}
                            rounded={this.rounded}
                            outlined={this.outlined}
                            disabled={this.disabled}
                            expanded={this.expanded}
                        />
                    ) : (
                        <BInput
                            customClass="has-cursor-pointer"
                            iconRight="chevron-down"
                            value={this.label}
                            size={this.size}
                            loading={this.loading}
                            disabled={this.disabled}
                            expanded={this.expanded}
                            placeholder={this.placeholder}
                            readonly
                        />
                    ),
                );

                return (
                    <BDropdown
                        onChange={(value: V) => this.updateValue(value)}
                        value={this.innerValue}
                        position={this.position}
                        animation={this.animation}
                        mobileModal={this.mobileModal}
                        ariaRole={this.ariaRole}
                        scrollable={this.scrollable}
                        maxHeight={this.maxHeight}
                        disabled={this.disabled}
                        expanded={this.expanded}>
                        <template slot="trigger">{trigger}</template>
                        { this.options.map(option => makeOption(option as T)) }
                    </BDropdown>
                );
            },
        }),
);

export default simpleDropdown;
