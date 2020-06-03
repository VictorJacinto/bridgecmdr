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
import { RawLocation } from "vue-router";
import * as tsx from "vue-tsx-support";
import { EventHandler } from "vue-tsx-support/lib/modifiers";
import { InputHTMLAttributes } from "vue-tsx-support/types/dom";
import { CombinedVueInstance } from "vue/types/vue";
import { tuple, TupleToUnion } from "../helpers/typing";

export const KnownColorModifiers = tuple("is-white", "is-black", "is-light", "is-dark", "is-primary", "is-link", "is-info", "is-success", "is-warning", "is-danger");
export type KnownColorModifiers = TupleToUnion<typeof KnownColorModifiers>;

export const SizeModifiers = tuple("is-small", "is-medium", "is-large");
export type SizeModifiers = TupleToUnion<typeof SizeModifiers>;

export const VerticalPositionModifiers = tuple("is-bottom", "is-top");
export type VerticalPositionModifiers = TupleToUnion<typeof VerticalPositionModifiers>;

export const HorizontalPositionModifiers = tuple("is-left", "is-right");
export type HorizontalPositionModifiers = TupleToUnion<typeof HorizontalPositionModifiers>;

export const PopupPositionModifiers = tuple("is-top-right", "is-top-left", "is-bottom-left", "is-bottom-right");
export type PopupPositionModifiers = TupleToUnion<typeof PopupPositionModifiers>;

export const GlobalPositions = tuple(...PopupPositionModifiers, ...VerticalPositionModifiers);
export type GlobalPositions = TupleToUnion<typeof GlobalPositions>;

export const AllPositions = tuple(...GlobalPositions, ...HorizontalPositionModifiers);
export type AllPositions = TupleToUnion<typeof AllPositions>;

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
    onBlur: EventHandler<Event>;
    onFocus: EventHandler<Event>;
};

type BFormElementMethods = {
    checkHtml5Validity(): boolean;
    focus(): void;
};

type BActionElementProps<E extends string> = {
    tag?: E|"a"|"router-link";
    // <a href>
    href?: string;
    // <router-link to>
    to?: RawLocation;
};

type BActionElementEvents = {
    onClick: EventHandler<Event>;
};

export type BAnyValue = string|number|boolean|Function|object|unknown[];

type BCheckRadioProps =  {
    value?: BAnyValue;
    nativeValue?: BAnyValue;
    type?: ColorModifiers;
    required?: boolean;
    name?: string;
    size?: SizeModifiers;
};

type BCheckRadioEvents = {
    onInput: (value: BAnyValue) => void;
};

type BAutocompleteProps = BFormElementProps & {
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
    placeholder?: string;
};

type BAutocompleteEvents = BFormElementEvents & {
    onInput: (value: string|number) => void;
    onSelect: (options: string|number|object) => void;
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
    CombinedVueInstance<Vue, unknown, BBAutocompleteMethods, unknown, BAutocompleteProps>;
export const BAutocomplete =
    tsx.ofType<BAutocompleteProps, BAutocompleteEvents, BAutocompleteSlots>().convert(Vue.component("BAutocomplete"));

type BButtonProps = BActionElementProps<"button"|"input"|"nuxt-link"> & {
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
    disabled?: boolean;
    nativeType?: "buttons"|"submit"|"reset";
};

type BButtonEvents = BActionElementEvents;

export type BButton =
    CombinedVueInstance<Vue, unknown, unknown, unknown, BButtonProps>;
export const BButton =
    tsx.ofType<BButtonProps, BButtonEvents>().convert(Vue.component("BButton"));

type BCarouselProps = {
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
    CombinedVueInstance<Vue, unknown, unknown, unknown, BCarouselProps>;
export const BCarousel =
    tsx.ofType<BCarouselProps, BCarouselEvents, BCarouselSlots>().convert(Vue.component("BCarousel"));

export type BCarouselItem = Vue;
export const BCarouselItem = tsx.ofType().convert(Vue.component("BCarouselItem"));

export type BCarouselListItem = {
    title: string;
    image: string;
};

type BCarouselListProps = {
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
    CombinedVueInstance<Vue, unknown, unknown, unknown, BCarouselListProps>;
export const BCarouselList =
    tsx.ofType<BCarouselListProps, BCarouselListEvents, BCarouselListSlots>().convert(Vue.component("BCarouselList"));

type BCheckboxProps = BCheckRadioProps & {
    indeterminate?: boolean;
    trueValue?: BAnyValue;
    falseValue?: BAnyValue;
};

type BCheckboxEvents = BCheckRadioEvents;

export type BCheckbox =
    CombinedVueInstance<Vue, unknown, unknown, unknown, BCheckboxProps>;
export const BCheckbox =
    tsx.ofType<BCheckboxProps, BCheckboxEvents>().convert(Vue.component("BCheckbox"));

type BCheckboxButtonProps = BCheckRadioProps & {
    type?: ColorModifiers;
    expanded?: boolean;
};

type BCheckboxButtonEvents = BCheckRadioEvents;

export type BCheckboxButton =
    CombinedVueInstance<Vue, unknown, unknown, unknown, BCheckboxButtonProps>;
export const BCheckboxButton =
    tsx.ofType<BCheckboxButtonProps, BCheckboxButtonEvents>().convert(Vue.component("BCheckboxButton"));

type BDropdownProps = {
    value?: BAnyValue;
    disabled?: boolean;
    hoverable?: boolean;
    inline?: boolean;
    scrollable?: boolean;
    maxHeight?: number|string;
    position?: PopupPositionModifiers;
    mobileModal?: boolean;
    ariaRole?: "menu"|"list"|"dialog";
    animation?: string;
    multiple?: boolean;
    trapFocus?: boolean;
    closeOnClick?: boolean;
    canClose?: boolean|("escape"|"outside")[];
    expanded?: boolean;
    appendToBody?: boolean;
    appendToBodyCopyParent?: boolean;
};

type BDropdownEvents = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (value: any) => void;
    onActiveChange: (active: boolean) => void;
};

type BDropdownSlots = {
    trigger: { active: boolean };
};

type BDropdownMethods = {
    toggle(): void;
};

export type BDropdown =
    CombinedVueInstance<Vue, unknown, BDropdownMethods, unknown, BDropdownProps>;
export const BDropdown =
    tsx.ofType<BDropdownProps, BDropdownEvents, BDropdownSlots>().convert(Vue.component("BDropdown"));

type BDropdownItemProps = {
    value?: BAnyValue;
    separator?: boolean;
    disabled?: boolean;
    custom?: boolean;
    focusable?: boolean;
    paddingless?: boolean;
    hasLink?: boolean;
    ariaRole?: string;
};

type BDropdownItemEvents = {
    onClick: EventHandler<Event>;
};

export type BDropdownItem =
    CombinedVueInstance<Vue, unknown, unknown, unknown, BDropdownItemProps>;
export const BDropdownItem =
    tsx.ofType<BDropdownItemProps, BDropdownItemEvents, unknown>().convert(Vue.component("BDropdownItem"));

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
    CombinedVueInstance<Vue, unknown, unknown, unknown, BFieldProps>;
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
    CombinedVueInstance<Vue, unknown, unknown, unknown, BIconProps>;
export const BIcon =
    tsx.ofType<BIconProps>().convert(Vue.component("BIcon"));

type BInputType = "button"|"checkbox"|"color"|"date"|"datetime-local"|"email"|"file"|"hidden"|"image"|
"month"|"number"|"password"|"radio"|"range"|"reset"|"search"|"submit"|"tel"|"text"|"url"|"week"|
"datetime";

type BInputProps = BFormElementProps & {
    value?: number|string;
    type?: BInputType;
    passwordReveal?: boolean;
    iconClickable?: boolean;
    hasCounter?: boolean;
    customClass?: string;
    iconRight?: string;
    iconRightClickable?: boolean;
} & Omit<InputHTMLAttributes, "size"|"type">;

type BInputEvents = BFormElementEvents & {
    onInput: (value: string|number) => void;
    onIconClick: EventHandler<Event>;
    onIconRightClick: EventHandler<Event>;
};

type BInputMethods = BFormElementMethods;

export type BInput =
    CombinedVueInstance<Vue, unknown, BInputMethods, unknown, BInputProps>;
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
    CombinedVueInstance<Vue, unknown, unknown, unknown, BNavnarProps>;
export const BNavbar =
    tsx.ofType<BNavnarProps, unknown, BNavbarSlots>().convert(Vue.component("BNavbar"));

type BNavbarItemProps = BActionElementProps<"div"> & {
    activate?: boolean;
};

type BNavbarItemEvents = BActionElementEvents;

export type BNavbarItem =
    CombinedVueInstance<Vue, unknown, unknown, unknown, BNavbarItemProps>;
export const BNavbarItem =
    tsx.ofType<BNavbarItemProps, BNavbarItemEvents>().convert(Vue.component("BNavbarItem"));

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
    CombinedVueInstance<Vue, unknown, unknown, unknown, BNavbarDropdownProps>;
export const BNavbarDropdown =
    tsx.ofType<BNavbarDropdownProps>().convert(Vue.component("BNavbarDropdown"));

type BNumberinputProps = BFormElementProps & {
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
    CombinedVueInstance<Vue, unknown, BNumberinputMethods, unknown, BNumberinputProps>;
export const BNumberinput =
    tsx.ofType<BNumberinputProps, BNumberinputEvents>().convert(Vue.component("BNumberinput"));

type BRadioProps = BCheckRadioProps;

type BRadioEvents = BCheckRadioEvents;

export type BRadio =
    CombinedVueInstance<Vue, unknown, unknown, unknown, BRadioProps>;
export const BRadio =
    tsx.ofType<BRadioProps, BRadioEvents>().convert(Vue.component("BRadio"));

type BRadioButtonProps = BCheckRadioProps & {
    type?: ColorModifiers;
    expanded?: boolean;
};

type BRadioButtonEvents = BCheckRadioEvents;

export type BRadioButton =
    CombinedVueInstance<Vue, unknown, unknown, unknown, BRadioButtonProps>;
export const BRadioButton =
    tsx.ofType<BRadioButtonProps, BRadioButtonEvents>().convert(Vue.component("BRadioButton"));

type BSelectProps = BFormElementProps & {
    value?: BAnyValue;
    placeholder?: string;
    multiple?: boolean;
    nativeSize?: number|string;
};

type BSelectEvents = BFormElementEvents & {
    onInput: (value: BAnyValue) => void;
};

type BSelectMethods = BFormElementMethods;

export type BSelect =
    CombinedVueInstance<Vue, unknown, BSelectMethods, unknown, BSelectProps>;
export const BSelect =
    tsx.ofType<BSelectProps, BSelectEvents>().convert(Vue.component("BSelect"));

type BSkeletonProps = {
    active?: boolean;
    animated?: boolean;
    width?: number|string;
    height?: number|string;
    circle?: boolean;
    rounded?: boolean;
    count?: number;
    size?: string;
};

export type BSkeleton =
    CombinedVueInstance<Vue, unknown, unknown, unknown, BSkeletonProps>;
export const BSkeleton =
    tsx.ofType<BSkeletonProps>().convert(Vue.component("BSkeleton"));

type BSwitchProps = {
    value?: BAnyValue|Date;
    nativeValue?: BAnyValue|Date;
    disabled?: boolean;
    type?: string;
    passiveType?: string;
    name?: string;
    required?: boolean;
    size?: string;
    trueValue?: BAnyValue|Date;
    falseValue?: BAnyValue|Date;
    rounded?: boolean;
    outlined?: boolean;
};

type BSwitchEvents = BCheckRadioEvents;

export type BSwitch =
    CombinedVueInstance<Vue, unknown, unknown, unknown, BSwitchProps>;
export const BSwitch =
    tsx.ofType<BSwitchProps, BSwitchEvents>().convert(Vue.component("BSwitch"));

type BUploadProps = BFormElementProps & {
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
    CombinedVueInstance<Vue, unknown, BUploadMethods, unknown, BUploadProps>;
export const BUpload =
    tsx.ofType<BUploadProps, BUploadEvents>().convert(Vue.component("BUpload"));
