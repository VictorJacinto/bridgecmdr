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

import { isNumber, isString } from "lodash";
import { BaseType } from "../core/core";
import Predicate from "../core/predicate";
import { Validator } from "../core/validator";

export default class EnumPredicate<E extends string|number|undefined, R> extends Predicate<E, R> {
    private readonly baseValidator: Validator<BaseType<E>>;

    constructor(values: (number|string)[], required: R) {
        if (values.length === 0) {
            throw new Error("No values specified for Enum validation");
        }

        super(typeof values[0] === "string" ? String : Number, required);
        const check = typeof values[0] === "string" ? isString : isNumber;
        this.baseValidator = {
            validate(value: unknown): boolean {
                return check(value);
            },
            message(value: unknown): string {
                return `Expected to be one of ${values}, but received ${value}`;
            },
        };

        this.wrapValidator(value => values.includes(value),
            value => `Expected to be one of ${values}, but received ${value}`,
            value => `Expected to not be one of ${values}, but received ${value}`);
    }

    protected validator(): Validator<BaseType<E>> {
        return this.baseValidator;
    }
}
