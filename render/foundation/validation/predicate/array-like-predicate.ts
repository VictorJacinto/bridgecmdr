/* eslint-disable @typescript-eslint/no-explicit-any */
import { size } from "lodash";
import type { Constructor } from "../core/core";
import CollectionPredicate from "./collection-predicate";

export default abstract class ArrayLikePredicate<T extends ArrayLike<unknown>|undefined, R> extends CollectionPredicate<T, R> {
    protected constructor(singular: string, plural: string, type: Constructor, required: R) {
        super(singular, plural, type, required);
    }

    length(count: number): this {
        return this.wrapValidator(value => size(value) === count,
            (value: any) => `Expected to be ${count} ${this.term(count)}, but is ${size(value)}`,
            _value => `Expected to not be ${count} ${this.term(count)}`);
    }

    maxLength(max: number): this {
        return this.wrapValidator(value => value.length <= max,
            (value: any) => `Expected to be ${max} ${this.term(max)} or less, but is ${size(value)}`,
            (value: any) => `Expected to be more than ${max} ${this.term(max)}, but is ${size(value)}`);
    }

    minLength(min: number): this {
        return this.wrapValidator(value => value.length >= min,
            (value: any) => `Expected to be ${min} ${this.term(min)} or more, but is ${size(value)}`,
            (value: any) => `Expected to be less than ${min} ${this.term(min)}, but is ${size(value)}`);
    }
}
