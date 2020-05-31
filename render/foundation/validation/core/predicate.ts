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

import { isNil, isObject, isString } from "lodash";
import { PropOptions } from "vue";
import { BaseType, Constructor, DefaultOf, KnownPropOptions } from "./core";
import { makeInnerValidator, MessageGenerator, SimpleValidator, Validator, ValidatorFunction } from "./validator";

export const IsPredicate = Symbol.for("@@Predicate");

// TODO: O optional rather than R required?
export interface BasePredicate<T = unknown, R = false> {
    readonly [IsPredicate]: true;

    type: undefined|Constructor;

    required: R;

    options<D extends T>($default?: DefaultOf<D>): KnownPropOptions<T, R>;

    validators(nested: boolean): Validator<BaseType<T>>[];
}

export function isPredicate(value: unknown): value is BasePredicate {
    return isObject(value) && Boolean((value as BasePredicate)[IsPredicate]);
}

export default abstract class Predicate<T = unknown, R = false> implements BasePredicate<T, R> {
    private readonly isRequired: R;
    private readonly myValidators: Validator<BaseType<T>>[];
    private myType: undefined|Constructor;
    private isNegated = false;

    protected constructor(type: undefined|Constructor, required: R) {
        this.isRequired = required;
        this.myValidators = [];
        this.myType = type;
    }

    // eslint-disable-next-line class-methods-use-this
    get [IsPredicate](): true {
        return true;
    }

    get type(): undefined|Constructor {
        return this.myType;
    }

    get required(): R {
        return this.isRequired;
    }

    get not(): this {
        this.isNegated = true;

        return this;
    }

    options<D extends T>($default?: DefaultOf<D>): KnownPropOptions<T, R> {
        const options: PropOptions<T> = this.myType ? { type: this.myType } : {};
        if (this.isRequired && isNil($default)) {
            options.required = true;
        } else {
            options.default = $default;
        }

        if (this.myValidators.length > 0) {
            const validator = makeInnerValidator(this.myValidators);
            options.validator = (value: BaseType<T>): boolean => {
                const failed = validator(value, false);
                if (failed !== null) {
                    console.error(failed.message(value));

                    return false;
                }

                return true;
            };
        }

        return options as KnownPropOptions<T, R>;
    }

    /*
     The idea is we use nested validators for AnyTypeOfPredicate, of on ArrayPredicate, and shape on ObjectPredicate.
     When doing this, we check the required() property and test against undefined before using the validators.

     For the AnyTypeOfPredicate, we will use the first validator to determine whether to use the others.
     AnyTypeOfPredicate should also warn when optional differs from it an the nested predicate.
     This is due to AnyPredicates using the type: [x, y, z...] of Vue and just the silliness of random optional
     nested predicates.
     */

    validators(nested: boolean): Validator<BaseType<T>>[] {
        // Clone the array.
        return nested ? [ this.validator(), ...this.myValidators ] : [...this.myValidators];
    }

    is(validator: SimpleValidator<T>): this {
        let error = null as null|string;

        return this.addValidator({
            message(_value: unknown): string { return error ? error : "Failed validation" },
            validate(value: T): boolean {
                const result = validator(value);
                if (isString(result)) {
                    error = result;

                    return false;
                }

                return result;
            },
        });
    }

    addValidator(validator: Validator<BaseType<T>>): this {
        this.myValidators.push(validator);

        return this;
    }

    protected abstract validator(): Validator<unknown>;

    protected dontNegate(adjective: string): void {
        if (this.isNegated) {
            throw new Error(`${adjective} can't be negated!`);
        }
    }

    protected wrapValidator(validator: ValidatorFunction<BaseType<T>>, message: MessageGenerator, negated: MessageGenerator): this {
        this.addValidator({ validate: validator, message: this.isNegated ? negated : message });
        this.isNegated = false;

        return this;
    }

    protected setType(value: Constructor): void {
        this.myType = value;
    }
}
