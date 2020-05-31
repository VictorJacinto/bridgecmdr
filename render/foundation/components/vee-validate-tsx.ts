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

import { ValidationObserver as ValidationObserverConstructor, ValidationProvider as ValidationProviderConstructor } from "vee-validate";
import * as tsx from "vue-tsx-support";

type ValidationObserverSlots = {
    default: {
        dirt: boolean;
        pristine: boolean;
        valid: boolean;
        invalid: boolean;
        pending: boolean;
        touched: boolean;
        untouched: boolean;
        passed: boolean;
        failed: boolean;
        errors: Record<string, string[]>;
        validate: () => Promise<boolean>;
        handleSubmit: (callback: Function) => Promise<void>;
        reset: () => void;
    };
};

type ValidationObserverProps = {
    tag?: string;
    vid?: string;
    slim?: boolean;
    disabled?: boolean;
};

// noinspection JSUnusedGlobalSymbols
export type ValidationObserver = InstanceType<typeof ValidationObserverConstructor>;
export const ValidationObserver = tsx.
    ofType<ValidationObserverProps, unknown, ValidationObserverSlots>().
    convert(ValidationObserverConstructor);

type ValidationProviderSlots = {
    default: {
        errors: string[];
        failedRules: Record<string, string>;
        aria: Record<string, string>;
        classes: Record<string, boolean>;
        validate: (value: unknown) => Promise<unknown>;
        reset: () => void;
        dirt: boolean;
        pristine: boolean;
        valid: boolean;
        invalid: boolean;
        pending: boolean;
        touched: boolean;
        untouched: boolean;
        passed: boolean;
        failed: boolean;
        changed: boolean;
        required: boolean;
        validated: boolean;
    };
};

type ValidationProviderProps = {
    vid?: string;
    name?: string;
    mode?: TimerHandler;
    rules?: string|Record<string, unknown>;
    immediate?: boolean;
    bails?: boolean;
    skipIfEmpty?: boolean;
    debounce?: number;
    tag?: string;
    slim?: boolean;
    disabled?: boolean;
    customMessages?: Record<string, string>;
};

// noinspection JSUnusedGlobalSymbols
export type ValidationProvider = InstanceType<typeof ValidationProviderConstructor>;
export const ValidationProvider = tsx.
    ofType<ValidationProviderProps, unknown, ValidationProviderSlots>().
    convert(ValidationProviderConstructor);
