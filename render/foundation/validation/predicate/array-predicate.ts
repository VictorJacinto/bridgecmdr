import { every, isArray, some, toString } from "lodash";
import type { BaseType } from "../core/core";
import { toReadableString } from "../core/core";
import type { BasePredicate } from "../core/predicate";
import type { MessageGenerator, Validator } from "../core/validator";
import { makeInnerValidator } from "../core/validator";
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
            value => `Expected to include all of ${toReadableString(items)}, but received ${toString(value)}`,
            value => `Expected to not include all of ${toReadableString(items)}, but received ${toString(value)}`);
    }

    includesAny(...items: BaseType<A>): this {
        if (items.length === 0) {
            throw new Error("No values specified for array.includesAny validation");
        }

        return this.wrapValidator(value => some(items, item => value.includes(item)),
            value => `Expected to include some of ${toReadableString(items)}, but received ${toString(value)}`,
            value => `Expected to not include some of ${toReadableString(items)}, but received ${toString(value)}`);
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
