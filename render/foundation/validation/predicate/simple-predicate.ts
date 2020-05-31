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

import { BaseType, Constructor } from "../core/core";
import Predicate from "../core/predicate";
import { Validator, ValidatorFunction } from "../core/validator";

export default class SimplePredicate<T, R> extends Predicate<T, R> {
    private readonly myValidator: Validator<BaseType<T>>;

    constructor(required: R, validator: Validator<BaseType<T>>, type?: Constructor) {
        super(type, required);
        this.myValidator = validator;
    }

    protected validator(): Validator<BaseType<T>> {
        return this.myValidator;
    }
}

export function makeSimpleTypePredicate<T, R>(type: Constructor, required: R, validator: Validator<BaseType<T>>): SimplePredicate<T, R> {
    return new SimplePredicate<T, R>(required, validator, type);
}

export function makeSimplePredicate<T, R>(required: R, validator: Validator<BaseType<T>>): SimplePredicate<T, R> {
    return new SimplePredicate<T, R>(required, validator);
}

export function makeBasicTypePredicate<T, R>(type: Constructor, required: R, validator: ValidatorFunction<unknown>, message: string): SimplePredicate<T, R> {
    return makeSimpleTypePredicate<T, R>(type, required, {
        validate: (value: unknown) => validator(value),
        message:  value => `${message}, but received ${typeof value}`,
    });
}

export function makeBasicPredicate<T, R>(required: R, validator: ValidatorFunction<unknown>, message: string): SimplePredicate<T, R> {
    return makeSimplePredicate<T, R>(required, {
        validate: (value: unknown) => validator(value),
        message:  value => `${message}, but received ${typeof value}`,
    });
}
