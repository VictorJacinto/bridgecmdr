/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/ban-types */
import { toString } from "lodash";
import type { PropOptions } from "vue";

export type Constructor = { new (...args: any[]): any };
export type ConstructorFor<T> = { new (...args: any[]): T };
export type BaseType<T> = T extends undefined ? never : T;

export type DefaultOf<T> = T|(() => T);
export type KnownRequirement<R> = R extends true ? { required: true } : { };
export type KnownPropOptions<T, R> = Omit<PropOptions<T>, "required"> & KnownRequirement<R>;

export function toReadableString(values: readonly unknown[], finalConjunction = "or"): string {
    if (values.length === 0) {
        return "nothing";
    }

    if (values.length === 1) {
        return toString(values[0]);
    }

    if (values.length === 2) {
        return `${toString(values[0])} ${finalConjunction} ${toString(values[1])}`;
    }

    return `${values.slice(0, -1).join(", ")}, ${finalConjunction} ${toString(values.slice(-1)[0])}`;
}
