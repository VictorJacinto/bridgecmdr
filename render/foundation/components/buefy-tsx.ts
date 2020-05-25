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

import { ColorModifiers } from "buefy/types/helpers";
import Vue from "vue";
import * as tsx from "vue-tsx-support";
import { CombinedVueInstance } from "vue/types/vue";

export type SizeModifiers = "is-small" | "is-medium" | "is-large";
export type VerticalPositionModifiers = "is-bottom" | "is-top";
export type HorizontalPositionModifiers = "is-left" | "is-right";

type Model<T> = {
    vModel?: T;
};

type BFormElementProps = {
    disabled?: boolean;
    size?: SizeModifiers;
    expanded?: boolean;
    loading?: boolean;
    rounded?: boolean;
    icon?: string;
    iconPack?: string;
    autocomplete?: string;
    maxlength?: number|string;
    useHtml5Validation?: boolean;
    validationMessage?: string;
};

type BFormElementEvents = {
    onBlur: () => void;
    onFocus: () => void;
};

type BFormElementMethods = {
    checkHtml5Validity(): boolean;
    focus(): void;
};

type BCheckRadioSelectValue = string|number|boolean|Function|object|unknown[];

type BCheckRadioProps =  Model<BCheckRadioSelectValue> & {
    value?: BCheckRadioSelectValue;
    nativeValue?: BCheckRadioSelectValue;
    type?: ColorModifiers;
    required?: boolean;
    name?: string;
    size?: SizeModifiers;
};

type BCheckRadioEvents = {
    onInput: (value: BCheckRadioSelectValue) => void;
};

type BAutocompleteProps = BFormElementProps & Model<number|string> & {
    value?: number|string;
    data?: unknown[];
    field?: string;
    keepFirst?: boolean;
    clearOnSelect?: boolean;
    openOnFocus?: boolean;
    customFormatter?: (data: unknown) => string;
    checkInfiniteScroll?: boolean;
    keepOpen?: boolean;
    clearable?: boolean;
    maxHeight?: number|string;
    dropdownPosition?: "top" | "bottom" | "auto";
    iconRight?: string;
    iconRightClickable?: boolean;
    appendToBody?: boolean;
};

type BAutocompleteEvents = BFormElementEvents & {
    onInput: (value: string|number) => void;
    onSelect: (options: string|number|object) => void;
    onFocus: () => void;
    onBlur: () => void;
    onTyping: (value: string) => void;
    onInfiniteScroll: () => void;
};

type BAutocompleteSlots = {
    default: { option: string|number; index: number };
};

type BBAutocompleteMethods = BFormElementMethods & {
    setSelected(selected: unknown): void;
};

export type BAutocomplete =
    CombinedVueInstance<Vue, {}, BBAutocompleteMethods, {}, BAutocompleteProps>;
export const BAutocomplete =
    tsx.ofType<BAutocompleteProps, BAutocompleteEvents, BAutocompleteSlots>().convert(Vue.component("BAutocomplete"));

type BButtonProps = {
    type?: ColorModifiers|object;
    size?: SizeModifiers;
    label?: string;
    iconPack?: string;
    iconLeft?: string;
    iconRight?: string;
    rounded?: boolean;
    loading?: boolean;
    outlined?: boolean;
    expanded?: boolean;
    inverted?: boolean;
    focused?: boolean;
    active?: boolean;
    hovered?: boolean;
    selected?: boolean;
    nativeType?: "buttons"|"submit"|"reset";
    tag?: "button"|"a"|"input"|"router-link"|"nuxt-link";
};

type BButtonEvents = {
    onClick: () => void;
};

export type BButton =
    CombinedVueInstance<Vue, {}, {}, {}, BButtonProps>;
export const BButton =
    tsx.ofType<BButtonProps, BButtonEvents>().convert(Vue.component("BButton"));

type BCarouselProps = Model<number> & {
    value?: number;
    animated?: "fade" | "slide";
    interval?: number;
    hasDrag?: boolean;
    autoplay?: boolean;
    pauseHover?: boolean;
    pauseInfo?: boolean;
    pauseInfoType?: ColorModifiers;
    pauseText?: string;
    arrow?: boolean;
    arrowBoth?: boolean;
    arrowHover?: boolean;
    repeat?: boolean;
    iconPack?: string;
    iconSize?: SizeModifiers;
    iconPrev?: string;
    iconNext?: string;
    indicator?: boolean;
    indicatorBackground?: boolean;
    indicatorCustom?: boolean;
    indicatorCustomSize?: SizeModifiers;
    indicatorInside?: boolean;
    indicatorMode?: "click" | "hover";
    indicatorPosition?: VerticalPositionModifiers;
    indicatorStyle?: "is-boxes" | "is-dots" | "is-lines";
    overlay?: boolean;
    progress?: boolean;
    progressType?: ColorModifiers;
    withCarouselList?: boolean;
};

type BCarouselEvents = {
    onChange: (index: number) => void;
    onInput: (index: number) => void;
};

type BCarouselSlots = {
    indicators: { i: number };
    list: { active: number; switch: (index: number) => void };
};

export type BCarousel =
    CombinedVueInstance<Vue, {}, {}, {}, BCarouselProps>;
export const BCarousel =
    tsx.ofType<BCarouselProps, BCarouselEvents, BCarouselSlots>().convert(Vue.component("BCarousel"));

export type BCarouselItem = Vue;
export const BCarouselItem = tsx.ofType().convert(Vue.component("BCarouselItem"));

export type BCarouselListItem = {
    title: string;
    image: string;
};

type BCarouselListProps = Model<number> & {
    config?: object;
    data?: BCarouselListItem[];
    value?: number;
    hasDrag?: boolean;
    hasGrayscale?: boolean;
    hasOpacity?: boolean;
    repeat?: boolean;
    itemsToShow?: number;
    itemsToList?: number;
    asIndicator?: boolean;
    arrow?: boolean;
    arrowHover?: boolean;
    iconPack?: string;
    iconSize?: string;
    iconPrev?: string;
    iconNext?: string;
    refresh?: boolean;
};

type BCarouselListEvents = {
    onSwitch: (index: number) => void;
};

type BCarouselListSlots = {
    item: { list: BCarouselListItem; index: number; active: number };
};

export type BCarouselList =
    CombinedVueInstance<Vue, {}, {}, {}, BCarouselListProps>;
export const BCarouselList =
    tsx.ofType<BCarouselListProps, BCarouselListEvents, BCarouselListSlots>().convert(Vue.component("BCarouselList"));

type BCheckboxProps = BCheckRadioProps & {
    indeterminate?: boolean;
    trueValue?: BCheckRadioSelectValue;
    falseValue?: BCheckRadioSelectValue;
};

type BCheckboxEvents = BCheckRadioEvents;

export type BCheckbox =
    CombinedVueInstance<Vue, {}, {}, {}, BCheckboxProps>;
export const BCheckbox =
    tsx.ofType<BCheckboxProps, BCheckboxEvents>().convert(Vue.component("BCheckbox"));

type BCheckboxButtonProps = BCheckRadioProps & {
    type?: ColorModifiers;
    expanded?: boolean;
};

type BCheckboxButtonEvents = BCheckRadioEvents;

export type BCheckboxButton =
    CombinedVueInstance<Vue, {}, {}, {}, BCheckboxButtonProps>;
export const BCheckboxButton =
    tsx.ofType<BCheckboxButtonProps, BCheckboxButtonEvents>().convert(Vue.component("BCheckboxButton"));

type BFieldProps = {
    type?: ColorModifiers|object;
    label?: string;
    labelFor?: string;
    message?: string|object|string[];
    grouped?: boolean;
    groupMultiline?: boolean;
    position?: "is-centered" | "is-right";
    expanded?: boolean;
    horizontal?: boolean;
    addons?: boolean;
    customClass?: string;
    labelPosition?: "inside" | "on-border";
};

export type BField =
    CombinedVueInstance<Vue, {}, {}, {}, BFieldProps>;
export const BField =
    tsx.ofType<BFieldProps>().convert(Vue.component("BField"));

type BIconProps = {
    type?: ColorModifiers|object;
    pack?: string;
    icon: string;
    size?: SizeModifiers;
    customSize?: string;
    customClass?: string;
};

export type BIcon =
    CombinedVueInstance<Vue, {}, {}, {}, BIconProps>;
export const BIcon =
    tsx.ofType<BIconProps>().convert(Vue.component("BIcon"));

type BInputType = "button"|"checkbox"|"color"|"date"|"datetime-local"|"email"|"file"|"hidden"|"image"|
"month"|"number"|"password"|"radio"|"range"|"reset"|"search"|"submit"|"tel"|"text"|"url"|"week"|
"datetime";

type BInputProps = BFormElementProps & Model<number|string> & {
    value: number|string;
    type: BInputType;
    passwordReveal?: boolean;
    iconClickable?: boolean;
    hasCounter?: boolean;
    customClass?: string;
    iconRight?: string;
    iconRightClickable?: boolean;
};

type BInputEvents = BFormElementEvents & {
    onInput: (value: string|number) => void;
    onIconClick: () => void;
    onIconRightClick: () => void;
};

type BInputMethods = BFormElementMethods;

export type BInput =
    CombinedVueInstance<Vue, {}, BInputMethods, {}, BInputProps>;
export const BInput =
    tsx.ofType<BInputProps, BInputEvents>().convert(Vue.component("BInput"));

type BNavnarProps = {
    type?: ColorModifiers|object;
    transparent?: boolean;
    fixedTop?: boolean;
    fixedBottom?: boolean;
    isActive?: boolean;
    wrapperClass?: string;
    closeOnClick?: boolean;
    mobileBurger?: boolean;
    spaced?: boolean;
    shadow?: boolean;
};

type BNavbarSlots = {
    burger: { isOpened: boolean; toggleActive: () => void };
};

export type BNavbar =
    CombinedVueInstance<Vue, {}, {}, {}, BNavnarProps>;
export const BNavbar =
    tsx.ofType<BNavnarProps, {}, BNavbarSlots>().convert(Vue.component("BNavbar"));

type BNavbarItemProps = {
    tag?: "a"|"router-link"|"div";
    activate?: boolean;
    [key: string]: unknown;
};

export type BNavbarItem =
    CombinedVueInstance<Vue, {}, {}, {}, BNavbarItemProps>;
export const BNavbarItem =
    tsx.ofType<BNavbarItemProps>().convert(Vue.component("BNavbarItem"));

type BNavbarDropdownProps = {
    label?: string;
    hoverable?: boolean;
    active?: boolean;
    right?: boolean;
    arrowless?: boolean;
    boxed?: boolean;
    closeOnClick?: boolean;
    collapsible?: boolean;
};

export type BNavbarDropdown =
    CombinedVueInstance<Vue, {}, {}, {}, BNavbarDropdownProps>;
export const BNavbarDropdown =
    tsx.ofType<BNavbarDropdownProps>().convert(Vue.component("BNavbarDropdown"));

type BNumberinputProps = BFormElementProps & Model<number|string> & {
    value?: number;
    min?: number|string;
    max?: number|string;
    step?: number|string;
    type?: ColorModifiers;
    editable?: boolean;
    controls?: boolean;
    controlsRounded?: boolean;
    controlsPosition?: string;
};

type BNumberinputEvents = BFormElementEvents & {
    onInput: (value: number|string) => void;
};

type BNumberinputMethods = BFormElementMethods;

export type BNumberinput =
    CombinedVueInstance<Vue, {}, BNumberinputMethods, {}, BNumberinputProps>;
export const BNumberinput =
    tsx.ofType<BNumberinputProps, BNumberinputEvents>().convert(Vue.component("BNumberinput"));

type BRadioProps = BCheckRadioProps;

type BRadioEvents = BCheckRadioEvents;

export type BRadio =
    CombinedVueInstance<Vue, {}, {}, {}, BRadioProps>;
export const BRadio =
    tsx.ofType<BRadioProps, BRadioEvents>().convert(Vue.component("BRadio"));

type BRadioButtonProps = BCheckRadioProps & {
    type?: ColorModifiers;
    expanded?: boolean;
};

type BRadioButtonEvents = BCheckRadioEvents;

export type BRadioButton =
    CombinedVueInstance<Vue, {}, {}, {}, BRadioButtonProps>;
export const BRadioButton =
    tsx.ofType<BRadioButtonProps, BRadioButtonEvents>().convert(Vue.component("BRadioButton"));

type BSelectProps = BFormElementProps & Model<BCheckRadioSelectValue> & {
    value?: BCheckRadioSelectValue;
    placeholder?: string;
    multiple?: boolean;
    nativeSize?: number|string;
};

type BSelectEvents = BFormElementEvents & {
    onInput: (value: BCheckRadioSelectValue) => void;
};

type BSelectMethods = BFormElementMethods;

export type BSelect =
    CombinedVueInstance<Vue, {}, BSelectMethods, {}, BSelectProps>;
export const BSelect =
    tsx.ofType<BSelectProps, BSelectEvents>().convert(Vue.component("BSelect"));

type BSwitchProps = Model<BCheckRadioSelectValue|Date> & {
    value?: BCheckRadioSelectValue|Date;
    nativeValue?: BCheckRadioSelectValue|Date;
    disabled?: boolean;
    type?: string;
    passiveType?: string;
    name?: string;
    required?: boolean;
    size?: string;
    trueValue?: BCheckRadioSelectValue|Date;
    falseValue?: BCheckRadioSelectValue|Date;
    rounded?: boolean;
    outlined?: boolean;
};

type BSwitchEvents = BCheckRadioEvents;

export type BSwitch =
    CombinedVueInstance<Vue, {}, {}, {}, BSwitchProps>;
export const BSwitch =
    tsx.ofType<BSwitchProps, BSwitchEvents>().convert(Vue.component("BSwitch"));

type BUploadProps = BFormElementProps & Model<File|File[]> & {
    value?: File|File[];
    multiple?: boolean;
    accept?: string;
    dragDrop?: boolean;
    type?: ColorModifiers;
    native?: boolean;
};

type BUploadEvents = BFormElementEvents & {
    onInput: (value: File|File[]) => void;
};

type BUploadMethods = BFormElementMethods;

export type BUpload =
    CombinedVueInstance<Vue, {}, BUploadMethods, {}, BUploadProps>;
export const BUpload =
    tsx.ofType<BUploadProps, BUploadEvents>().convert(Vue.component("BUpload"));
