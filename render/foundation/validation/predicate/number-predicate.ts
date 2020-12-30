import { isFinite, isInteger, isNumber, negate, toString } from "lodash";
import type { BaseType } from "../core/core";
import { toReadableString } from "../core/core";
import Predicate from "../core/predicate";
import type { Validator } from "../core/validator";

function inRange(value: number, min: number, max: number): boolean { return min <= value && value <= max }
function isInt8(value: number): boolean { return inRange(value, -128, 127) }
function isInt16(value: number): boolean { return inRange(value, -32768, 32767) }
function isInt32(value: number): boolean { return inRange(value, -2147483648, 2147483647) }
function isUint8(value: number): boolean { return inRange(value, 0, 255) }
function isUint16(value: number): boolean { return inRange(value, 0, 65535) }
function isUint32(value: number): boolean { return inRange(value, 0, 4294967295) }

export default class NumberPredicate<T extends undefined|number, R> extends Predicate<T, R> {
    constructor(required: R) {
        super(Number, required);
    }

    get finite(): this {
        return this.wrapValidator(isFinite,
            value => `Expected number to be finite, but received ${toString(value)}`,
            value => `Expected number to not be finite, but received ${toString(value)}`);
    }

    get infinite(): this {
        return this.wrapValidator(negate(isFinite),
            value => `Expected number to be infinite, but received ${toString(value)}`,
            value => `Expected number to not be infinite, but received ${toString(value)}`);
    }

    get integer(): this {
        return this.wrapValidator(isInteger,
            value => `Expected number to be an integer, but received ${toString(value)}`,
            value => `Expected number to not be an integer, but received ${toString(value)}`);
    }

    get integerOrInfinite(): this {
        return this.wrapValidator(value => isInteger(value) || !isFinite(value),
            value => `Expected number to be an integer or infinite, but received ${toString(value)}`,
            value => `Expected number to not be an integer or infinite, but received ${toString(value)}`);
    }

    get negative(): this {
        return this.wrapValidator(value => value < 0,
            value => `Expected number to be negative, but received ${toString(value)}`,
            value => `Expected number to not be negative, but received ${toString(value)}`);
    }

    get positive(): this {
        return this.wrapValidator(value => value > 0,
            value => `Expected number to be positive, but received ${toString(value)}`,
            value => `Expected number to not be positive, but received ${toString(value)}`);
    }

    get int8(): this {
        return this.wrapValidator(isInt8,
            value => `Expected number to be positive, but received ${toString(value)}`,
            value => `Expected number to not be positive, but received ${toString(value)}`);

    }

    get int16(): this {
        return this.wrapValidator(isInt16,
            value => `Expected number to be positive, but received ${toString(value)}`,
            value => `Expected number to not be positive, but received ${toString(value)}`);

    }

    get int32(): this {
        return this.wrapValidator(isInt32,
            value => `Expected number to be positive, but received ${toString(value)}`,
            value => `Expected number to not be positive, but received ${toString(value)}`);

    }

    get uint8(): this {
        return this.wrapValidator(isUint8,
            value => `Expected number to be positive, but received ${toString(value)}`,
            value => `Expected number to not be positive, but received ${toString(value)}`);

    }

    get uint16(): this {
        return this.wrapValidator(isUint16,
            value => `Expected number to be positive, but received ${toString(value)}`,
            value => `Expected number to not be positive, but received ${toString(value)}`);

    }

    get uint32(): this {
        return this.wrapValidator(isUint32,
            value => `Expected number to be positive, but received ${toString(value)}`,
            value => `Expected number to not be positive, but received ${toString(value)}`);
    }

    equal(expected: number): this {
        return this.wrapValidator(value => value === expected,
            value => `Expected number to be ${expected}, but received ${toString(value)}`,
            () => `Expected number to not be ${expected}, but received that value`);
    }

    greaterThan(other: number): this {
        return this.wrapValidator(value => value > other,
            value => `Expected number to be greater than ${other}, but received ${toString(value)}`,
            value => `Expected number to not be greater than ${other}, but received ${toString(value)}`);
    }

    greaterThanOrEqual(other: number): this {
        return this.wrapValidator(value => value >= other,
            value => `Expected number to be greater than or equal ${other}, but received ${toString(value)}`,
            value => `Expected number to not be greater than or equal ${other}, but received ${toString(value)}`);
    }

    inRange(x: number, y: number): this {
        const min = Math.min(x, y);
        const max = Math.max(x, y);

        return this.wrapValidator(value => inRange(value, min, max),
            value => `Expected number to be within ${min} and ${max}, but received ${toString(value)}`,
            value => `Expected number to not be within ${min} and ${max}, but received ${toString(value)}`);
    }

    lessThan(other: number): this {
        return this.wrapValidator(value => value < other,
            value => `Expected number to be less than ${other}, but received ${toString(value)}`,
            value => `Expected number to not be less than ${other}, but received ${toString(value)}`);
    }

    lessThanOrEqual(other: number): this {
        return this.wrapValidator(value => value <= other,
            value => `Expected number to be less than or equal ${other}, but received ${toString(value)}`,
            value => `Expected number to not be less than or equal ${other}, but received ${toString(value)}`);
    }

    oneOf(these: number[]): this {
        return this.wrapValidator(value => these.includes(value),
            value => `Expected number to be one of ${toReadableString(these)}, but received ${toString(value)}`,
            value => `Expected number to not be one of ${toReadableString(these)}, but received ${toString(value)}`);
    }

    // eslint-disable-next-line class-methods-use-this
    protected validator(): Validator<BaseType<T>> {
        return {
            validate(value: unknown): boolean {
                return isNumber(value);
            },
            message(value: unknown): string {
                return `Expected number, but received ${typeof value}`;
            },
        };
    }
}
