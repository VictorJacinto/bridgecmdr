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

import { isString } from "lodash";
import { BaseType } from "../core/core";
import { Validator } from "../core/validator";
import ArrayLikePredicate from "./array-like-predicate";

export default class StringPredicate<T extends string|undefined, R> extends ArrayLikePredicate<T, R> {
    constructor(required: R) {
        super("character", "characters", String, required);
    }

    get alphabetic(): this {
        return this.wrapValidator((value: string) => (/^[A-Za-z]+$/ug).test(value),
            value => `Expected to be alphabetic, but received "${value}"`,
            value => `Expected to not be alphabetic, but received "${value}"`);
    }

    get alphanumeric(): this {
        return this.wrapValidator((value: string) => (/^[A-Za-z\d]+$/u).test(value),
            value => `Expected to be alphanumeric, but received "${value}"`,
            value => `Expected to not be alphanumeric, but received "${value}"`);
    }

    get numeric(): this {
        return this.wrapValidator((value: string) => (/^(?:[+-])?\d+$/u).test(value),
            value => `Expected to be numeric, but received "${value}"`,
            value => `Expected to not be numeric, but received "${value}"`);
    }

    equals(expected: string): this {
        return this.wrapValidator(value => expected === value,
            value => `Expected to be "${expected}", but received "${value}"`,
            value => `Expected to not be "${expected}", but received "${value}"`);
    }

    startsWith(start: string): this {
        return this.wrapValidator(value => value.startsWith(start),
            value => `Expected to start with "${start}", but received "${value}"`,
            value => `Expected to not start with "${start}", but received "${value}"`);
    }

    endsWith(end: string): this {
        return this.wrapValidator(value => value.endsWith(end),
            value => `Expected to end with "${end}", but received "${value}"`,
            value => `Expected to not end with "${end}", but received "${value}"`);
    }

    includes(subString: string): this  {
        return this.wrapValidator(value => value.includes(subString),
            value => `Expected to contain "${subString}", but received "${value}"`,
            value => `Expected to not contain "${subString}", but received "${value}"`);
    }

    matches(regex: RegExp): this {
        return this.wrapValidator(value => regex.test(value),
            value => `Expected to match the pattern ${regex}, but received "${value}"`,
            value => `Expected to not match the pattern ${regex}, but received "${value}"`);
    }

    oneOf(strings: string[]): this {
        if (strings.length === 0) {
            throw new Error("No values specified for string.oneOf");
        }

        return this.wrapValidator(value => strings.includes(value),
            value => `Expected to be one of ${strings}, but received "${value}"`,
            value => `Expected to not be one of ${strings}, but received "${value}"`);
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
