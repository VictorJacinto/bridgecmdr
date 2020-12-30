/* eslint-disable @typescript-eslint/no-explicit-any, class-methods-use-this */
import type { PropOptions } from "vue";
import type { DefaultOf } from "../core/core";
import type { BasePredicate } from "../core/predicate";
import { _isPredicate } from "../core/predicate";
import type { Validator } from "../core/validator";

export default class AnyPredicate implements BasePredicate<any> {
    readonly [_isPredicate] = true;
    readonly type = undefined;
    readonly required = false;

    options($default?: DefaultOf<any>): PropOptions {
        return { default: $default as unknown };
    }

    validators(_nested: boolean): Validator<any>[] {
        return [];
    }
}
