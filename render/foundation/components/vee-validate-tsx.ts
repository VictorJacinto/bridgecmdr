/**
 VeeValidate TSX definitions - Matthew Holder
 @license MIT
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
