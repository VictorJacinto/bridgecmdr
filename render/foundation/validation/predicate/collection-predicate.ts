/* eslint-disable @typescript-eslint/no-explicit-any */
import { size, isEmpty, negate } from "lodash";
import type { Constructor } from "../core/core";
import Predicate from "../core/predicate";

export default abstract class CollectionPredicate<T, R> extends Predicate<T, R> {
    protected readonly singular: string;
    protected readonly plural: string;

    protected constructor(singular: string, plural: string, type: Constructor, required: R) {
        super(type, required);
        this.singular = singular;
        this.plural = plural;
    }

    get empty(): this {
        return this.wrapValidator(isEmpty,
            (value: any) => `Expected to be empty, but ${size(value)} ${this.term(size(value))} provided`,
            _value => "Expected to not be empty");
    }

    get notEmpty(): this {
        return this.wrapValidator(negate(isEmpty),
            _value => "Expected to not be empty",
            (value: any) => `Expected to be empty, but ${size(value)} ${this.term(size(value))} provided`);
    }

    protected term(length: number): string {
        return length === 1 ? this.singular : this.plural;
    }
}
