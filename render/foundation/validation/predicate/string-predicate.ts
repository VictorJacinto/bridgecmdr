import { isString, toString } from "lodash";
import type { BaseType } from "../core/core";
import { toReadableString } from "../core/core";
import type { Validator } from "../core/validator";
import ArrayLikePredicate from "./array-like-predicate";

export default class StringPredicate<T extends string|undefined, R> extends ArrayLikePredicate<T, R> {
    constructor(required: R) {
        super("character", "characters", String, required);
    }

    get alphabetic(): this {
        return this.wrapValidator((value: string) => (/^[A-Za-z]+$/ug).test(value),
            value => `Expected to be alphabetic, but received "${toString(value)}"`,
            value => `Expected to not be alphabetic, but received "${toString(value)}"`);
    }

    get alphanumeric(): this {
        return this.wrapValidator((value: string) => (/^[A-Za-z\d]+$/u).test(value),
            value => `Expected to be alphanumeric, but received "${toString(value)}"`,
            value => `Expected to not be alphanumeric, but received "${toString(value)}"`);
    }

    get numeric(): this {
        return this.wrapValidator((value: string) => (/^(?:[+-])?\d+$/u).test(value),
            value => `Expected to be numeric, but received "${toString(value)}"`,
            value => `Expected to not be numeric, but received "${toString(value)}"`);
    }

    equals(expected: string): this {
        return this.wrapValidator(value => expected === value,
            value => `Expected to be "${expected}", but received "${toString(value)}"`,
            value => `Expected to not be "${expected}", but received "${toString(value)}"`);
    }

    startsWith(start: string): this {
        return this.wrapValidator(value => value.startsWith(start),
            value => `Expected to start with "${start}", but received "${toString(value)}"`,
            value => `Expected to not start with "${start}", but received "${toString(value)}"`);
    }

    endsWith(end: string): this {
        return this.wrapValidator(value => value.endsWith(end),
            value => `Expected to end with "${end}", but received "${toString(value)}"`,
            value => `Expected to not end with "${end}", but received "${toString(value)}"`);
    }

    includes(subString: string): this  {
        return this.wrapValidator(value => value.includes(subString),
            value => `Expected to contain "${subString}", but received "${toString(value)}"`,
            value => `Expected to not contain "${subString}", but received "${toString(value)}"`);
    }

    matches(regex: RegExp): this {
        return this.wrapValidator(value => regex.test(value),
            value => `Expected to match the pattern ${toString(regex)}, but received "${toString(value)}"`,
            value => `Expected to not match the pattern ${toString(regex)}, but received "${toString(value)}"`);
    }

    oneOf(strings: string[]): this {
        if (strings.length === 0) {
            throw new Error("No values specified for string.oneOf");
        }

        return this.wrapValidator(value => strings.includes(value),
            value => `Expected to be one of ${toReadableString(strings)}, but received "${toString(value)}"`,
            value => `Expected to not be one of ${toReadableString(strings)}, but received "${toString(value)}"`);
    }

    // eslint-disable-next-line class-methods-use-this
    protected validator(): Validator<BaseType<T>> {
        return {
            validate(value: unknown): boolean {
                return isString(value);
            },
            message(value: unknown): string {
                return `Expected string, but received ${typeof value}`;
            },
        };
    }
}
