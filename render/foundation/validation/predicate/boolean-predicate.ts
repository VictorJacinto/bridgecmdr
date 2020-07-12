import { isBoolean } from "lodash";
import { BaseType } from "../core/core";
import Predicate from "../core/predicate";
import { Validator } from "../core/validator";

type ForcedBooleanPredicate<B extends false|true|boolean|undefined, V extends false|true, R> =
    Omit<BooleanPredicate<Exclude<B, boolean>|V, R>, "true" | "false">;

export default class BooleanPredicate<B extends false|true|boolean|undefined, R> extends Predicate<B, R> {
    constructor(required: R) {
        super(Boolean, required);
    }

    get true(): ForcedBooleanPredicate<B, true, R> {
        return this.wrapValidator(value => value === true,
            value => `Expected to be true, but received ${value}`,
            value => `Expected to be false, but received ${value}`) as
            ForcedBooleanPredicate<B, true, R>;
    }

    get false(): ForcedBooleanPredicate<B, false, R> {
        return this.wrapValidator(value => value === false,
            value => `Expected to be false, but received ${value}`,
            value => `Expected to be true, but received ${value}`) as
            ForcedBooleanPredicate<B, false, R>;
    }

    // eslint-disable-next-line class-methods-use-this
    protected validator(): Validator<BaseType<B>> {
        return {
            validate(value: unknown): boolean {
                return isBoolean(value);
            },
            message(value: unknown): string {
                return `Expected boolean, but received ${typeof value}`;
            },
        };
    }
}
