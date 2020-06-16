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

import { every,isArray,some } from "lodash";
import { BaseType } from "../core/core";
import { BasePredicate } from "../core/predicate";
import { makeInnerValidator, MessageGenerator, Validator } from "../core/validator";
import AnyPredicate from "./any-predicate";
import ArrayLikePredicate from "./array-like-predicate";

type TypedArrayPredicate<A extends readonly unknown[]|undefined, E, R> =
    Omit<ArrayPredicate<Exclude<A, readonly unknown[]>|readonly E[], R>, "ofType">;

export default class ArrayPredicate<A extends readonly unknown[]|undefined, R> extends ArrayLikePredicate<A, R> {
    constructor(required: R) {
        super("element", "elements", Array, required);
    }

    includes(...items: BaseType<A>): this {
        if (items.length === 0) {
            throw new Error("No values specified for array.includes validation");
        }

        return this.wrapValidator(value => every(items, item => value.includes(item)),
            value => `Expected to include all of ${items}, but received ${value}`,
            value => `Expected to not include all of ${items}, but received ${value}`);
    }

    includesAny(...items: BaseType<A>): this {
        if (items.length === 0) {
            throw new Error("No values specified for array.includesAny validation");
        }

        return this.wrapValidator(value => some(items, item => value.includes(item)),
            value => `Expected to include some of ${items}, but received ${value}`,
            value => `Expected to not include some of ${items}, but received ${value}`);
    }

    ofType<E>(): TypedArrayPredicate<A, E, R>;
    ofType<E, ER>(predicate: BasePredicate<E, ER>): TypedArrayPredicate<A, E, R>;
    ofType(predicate: BasePredicate = new AnyPredicate()): TypedArrayPredicate<A, unknown, R> {
        this.dontNegate("ofType");

        const nested = predicate.validators(true);
        let message = null as null|MessageGenerator;

        this.addValidator({
            message(value) {
                if (message === null) {
                    throw new ReferenceError("Attempting to generate a message for a successful validator");
                }

                return message(value);
            },
            validate(value: BaseType<A>): boolean {
                const inner = makeInnerValidator(nested);
                for (const [ index, element ] of value.entries()) {
                    const result = inner(element, !predicate.required);
                    if (result !== null) {
                        message = () => `Element ${index} failed validation: ${result.message(element)}`;

                        return false;
                    }
                }

                return true;
            },
        });

        return this as TypedArrayPredicate<A, unknown, R>;
    }

    // eslint-disable-next-line class-methods-use-this
    protected validator(): Validator<BaseType<A>> {
        return {
            validate(value: unknown): boolean {
                return isArray(value);
            },
            message(value: unknown): string {
                return `Expected an array, but received ${typeof value}`;
            },
        };
    }

}
