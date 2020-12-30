import type { BaseType, Constructor } from "../core/core";
import Predicate from "../core/predicate";
import type { Validator, ValidatorFunction } from "../core/validator";

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
