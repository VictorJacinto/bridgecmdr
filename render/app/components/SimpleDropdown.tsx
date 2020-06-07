/*
BridgeCmdr - A/V switch and monitor controller
Copyright (C) 2019-2020 Matthew Holder

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { identity } from "lodash";
import { PropOptions, VNode } from "vue";
import * as tsx from "vue-tsx-support";
import {
    BAnyValue, BButton, BDropdown, BDropdownItem, BInput,
    KnownColorModifiers, PopupPositionModifiers, SizeModifiers,
} from "../../foundation/components/buefy-tsx";
import { be, is, maybe, must, prop } from "../../foundation/validation/valid";

type SimpleDropdownEvents<T> = { onInput: (value: T) => void };

export const DropdownArialRoles = [ "menu", "list", "dialog" ] as const;
export type DropdownArialRoles = typeof DropdownArialRoles[number];

const simpleDropdown = identity(
    <T, V extends BAnyValue>(predicate: (option: T) => [ string, V ]) =>
        // @vue/component
        tsx.componentFactoryOf<SimpleDropdownEvents<V>>().create({
            name:  "SimpleDropdown",
            props: {
                value:       prop(is.any) as PropOptions<BAnyValue>, // prop(is.any) as PropOptions<V>,
                options:     prop(is.array.notEmpty), // prop(is.array.notEmpty.ofType<T>()),
                placeholder: prop(is.string.notEmpty, "Select an item"),
                tag:         prop(is.enum([ "button", "input" ]), "button"),
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
                        <template slot="trigger">{
                            this.tag === "button" ? (
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
                            )
                        }</template>
                        { this.options.map(option => makeOption(option as T)) }
                    </BDropdown>
                );
            },
        }),
);

export default simpleDropdown;
