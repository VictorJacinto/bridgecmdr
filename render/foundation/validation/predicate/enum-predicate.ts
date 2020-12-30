import { isNumber, isString, toString } from "lodash";
import type { BaseType } from "../core/core";
import { toReadableString } from "../core/core";
import Predicate from "../core/predicate";
import type { Validator } from "../core/validator";

export default class EnumPredicate<E extends string|number|undefined, R> extends Predicate<E, R> {
    private readonly baseValidator: Validator<BaseType<E>>;

    constructor(values: readonly (number|string)[], required: R) {
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
                return `Expected to be one of ${toReadableString(values)}, but received ${toString(value)}`;
            },
        };

        this.wrapValidator(value => values.includes(value),
            value => `Expected to be one of ${toReadableString(values)}, but received ${toString(value)}`,
            value => `Expected to not be one of ${toReadableString(values)}, but received ${toString(value)}`);
    }

    protected validator(): Validator<BaseType<E>> {
        return this.baseValidator;
    }
}
