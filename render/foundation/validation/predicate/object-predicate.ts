import { isObject, isPlainObject } from "lodash";
import type { BaseType, Constructor } from "../core/core";
import type { Validator } from "../core/validator";
import CollectionPredicate from "./collection-predicate";

// eslint-disable-next-line @typescript-eslint/ban-types
export default class ObjectPredicate<T extends object|undefined, R> extends CollectionPredicate<T, R> {
    constructor(type: Constructor, required: R) {
        super("property", "properties", type, required);
    }

    // recordOf, shape

    get plain(): Omit<this, "plain"> {
        return this.wrapValidator(isPlainObject,
            value => `Expected a plain object, but received ${(value as Record<string, unknown>).constructor.name}`,
            () => "Expected prototypical object, but received a plain one");
    }

    protected validator(): Validator<BaseType<T>> {
        return {
            validate: (value: unknown) => value instanceof (this.type as Constructor),
            message:  (value: unknown) => (isObject(value) ?
                `Expected ${this.type?.name}, but received ${value.constructor.name}` :
                `Expected ${this.type?.name}, but received ${typeof value}`),
        };
    }
}
