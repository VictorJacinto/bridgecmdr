import { isObject } from "lodash";
import type { BaseType, Constructor } from "../core/core";
import Predicate from "../core/predicate";
import type { Validator } from "../core/validator";

export default class ErrorPredicate<E extends Error|undefined, R> extends Predicate<E, R> {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(type: Constructor, required: R) {
        super(type, required);
    }

    name(name: string): this {
        return this.wrapValidator(value => value.name === name,
            value => `Expected an error named ${name}, but received ${(value as Error).name}`,
            value => `Not expected an error named ${name}, but received ${(value as Error).name}`);
    }

    protected validator(): Validator<BaseType<E>> {
        return {
            validate: (value: unknown) => value instanceof (this.type as Constructor),
            message:  (value: unknown) => (isObject(value) ?
                `Expected ${(this.type as Constructor).name}, but received ${value.constructor.name}` :
                `Expected ${(this.type as Constructor).name}, but received ${typeof value}`),
        };
    }
}
