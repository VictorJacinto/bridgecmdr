/*
BridgeCmdr - A/V switch and monitor controller
Copyright (C) 2019-2020 Matthew Holder

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
/* eslint-disable @typescript-eslint/no-explicit-any */

import { isDate, isFunction, isNaN, isNil, isNull, isRegExp, isSymbol, isUndefined } from "lodash";
import { PropOptions } from "vue";
import { Constructor, ConstructorFor, DefaultOf, KnownPropOptions } from "./core/core";
import { BasePredicate } from "./core/predicate";
import AnyPredicate from "./predicate/any-predicate";
import AnyTypeOfPredicate from "./predicate/any-type-of-predicate";
import ArrayPredicate from "./predicate/array-predicate";
import BooleanPredicate from "./predicate/boolean-predicate";
import EnumPredicate from "./predicate/enum-predicate";
import ErrorPredicate from "./predicate/error-predicate";
import NumberPredicate from "./predicate/number-predicate";
import ObjectPredicate from "./predicate/object-predicate";
import SimplePredicate, { makeBasicPredicate, makeBasicTypePredicate } from "./predicate/simple-predicate";
import StringPredicate from "./predicate/string-predicate";

export function prop<T, R, D extends T>(predicate: BasePredicate<T, R>): KnownPropOptions<T, R>;
export function prop<T, D extends T>(predicate: BasePredicate<T, true>, $default: DefaultOf<D>): PropOptions<T>;
export function prop<T, R, D extends T>(predicate: BasePredicate<T, R>, $default?: DefaultOf<D>): PropOptions<T> {
    if (!isNil($default) && !predicate.required) {
        console.warn("Validator given default non-nil values but is typed as optional, " +
                     "consider removing optional from the predicate chain.");
    }

    return predicate.options($default);
}

export class PredicateSet<U extends undefined = never, R = true> {
    private readonly required: R;

    // TODO: iterable, iterator, DataView, regular and clamped TypedArrays, promise.

    readonly any: AnyPredicate;
    readonly array: ArrayPredicate<unknown[]|U, R>;
    readonly boolean: BooleanPredicate<boolean|U, R>;
    readonly date: SimplePredicate<Date|U, R>;
    readonly nan: SimplePredicate<number|U, R>;
    readonly null: SimplePredicate<null|U, R>;
    readonly nullOrUndefined: SimplePredicate<null|undefined, R>;
    readonly number: NumberPredicate<number|U, R>;
    readonly regExp: SimplePredicate<RegExp|U, R>;
    readonly string: StringPredicate<string|U, R>;
    readonly symbol: SimplePredicate<symbol|U, R>;
    readonly undefined: SimplePredicate<undefined, R>;

    constructor(required: R) {
        this.required = required;
        this.any = new AnyPredicate();
        this.array = new ArrayPredicate<unknown[]|U, R>(required);
        this.boolean = new BooleanPredicate<boolean|U, R>(required);
        this.date = makeBasicTypePredicate(Date, required, isDate, "Expected a Date");
        this.nan = makeBasicPredicate<number|U, R>(required, isNaN, "Expected NaN");
        this.null = makeBasicPredicate<null|U, R>(required, isNull, "Expected null");
        this.nullOrUndefined = makeBasicPredicate<null|undefined, R>(required, isNil, "Expected null or undefined");
        this.number = new NumberPredicate<number|U, R>(required);
        this.regExp = makeBasicTypePredicate<RegExp|U, R>(RegExp, required, isRegExp, "Expected a regular expression");
        this.string = new StringPredicate<string|U, R>(required);
        this.symbol = makeBasicTypePredicate<symbol|U, R>(Symbol as unknown as Constructor, required, isSymbol, "Expected a symbol");
        this.undefined = makeBasicPredicate<undefined, R>(required, isUndefined, "Expected undefined");
    }

    error(): ErrorPredicate<Error|U, R>;
    error<E extends Error>(type: ConstructorFor<E>): ErrorPredicate<E|U, R>;
    error(type: Constructor = Error): ErrorPredicate<Error|undefined, R> {
        return new ErrorPredicate(type, this.required);
    }

    enum<E extends number|string>(values: readonly E[]): EnumPredicate<E|U, R> {
        return new EnumPredicate<E|U, R>(values, this.required);
    }

    function<F extends Function = Function>(): SimplePredicate<F|U, R> {
        return makeBasicTypePredicate<F|U, R>(Function, this.required, isFunction, "Expected a function");
    }

    object<T extends object>(): ObjectPredicate<T|U, R>;
    object<T extends object>(type: ConstructorFor<T>): ObjectPredicate<T|U, R>;
    object<T extends object>(type: Constructor = Object): ObjectPredicate<T|undefined, R> {
        return new ObjectPredicate(type, this.required);
    }
}

export interface PredicateInvoke<U extends undefined = never, R = true> {
    <T0>(p0: BasePredicate<T0, true>): AnyTypeOfPredicate<U|T0, R>;
    <T0, T1>(p0: BasePredicate<T0, true>, p1: BasePredicate<T1, true>): AnyTypeOfPredicate<U|T0|T1, R>;
    <T0, T1, T2>(p0: BasePredicate<T0, true>, p1: BasePredicate<T1, true>, p2: BasePredicate<T2, true>): AnyTypeOfPredicate<U|T0|T1|T2, R>;
    <T0, T1, T2, T3>(p0: BasePredicate<T0, true>, p1: BasePredicate<T1, true>, p2: BasePredicate<T2, true>, p3: BasePredicate<T3, true>): AnyTypeOfPredicate<U|T0|T1|T2|T3, R>;
    <T0, T1, T2, T3, T4>(p0: BasePredicate<T0, true>, p1: BasePredicate<T1, true>, p2: BasePredicate<T2, true>, p3: BasePredicate<T3, true>, p4: BasePredicate<T4, true>): AnyTypeOfPredicate<U|T0|T1|T2|T3|T4, R>;
    <T0, T1, T2, T3, T4, T5>(p0: BasePredicate<T0, true>, p1: BasePredicate<T1, true>,p2: BasePredicate<T2, true>, p3: BasePredicate<T3, true>, p4: BasePredicate<T4, true>,p5: BasePredicate<T5, true>): AnyTypeOfPredicate<U|T0|T1|T2|T3|T4|T5, R>;
    <T0, T1, T2, T3, T4, T5, T6>(p0: BasePredicate<T0, true>, p1: BasePredicate<T1, true>, p2: BasePredicate<T2, true>, p3: BasePredicate<T3, true>, p4: BasePredicate<T4, true>, p5: BasePredicate<T5, true>, p6: BasePredicate<T6, true>): AnyTypeOfPredicate<U|T0|T1|T2|T3|T4|T5|T6, R>;
    <T0, T1, T2, T3, T4, T5, T6, T7>(p0: BasePredicate<T0, true>, p1: BasePredicate<T1, true>, p2: BasePredicate<T2, true>, p3: BasePredicate<T3, true>, p4: BasePredicate<T4, true>, p5: BasePredicate<T5, true>, p6: BasePredicate<T6, true>, p7: BasePredicate<T7, true>): AnyTypeOfPredicate<U|T0|T1|T2|T3|T4|T5|T6|T7, R>;
    <T0, T1, T2, T3, T4, T5, T6, T7, T8>(p0: BasePredicate<T0, true>, p1: BasePredicate<T1, true>, p2: BasePredicate<T2, true>, p3: BasePredicate<T3, true>, p4: BasePredicate<T4, true>, p5: BasePredicate<T5, true>, p6: BasePredicate<T6, true>, p7: BasePredicate<T7, true>, p8: BasePredicate<T8, true>): AnyTypeOfPredicate<U|T0|T1|T2|T3|T4|T5|T6|T7|T8, R>;
    <T0, T1, T2, T3, T4, T5, T6, T7, T8, T9>(p0: BasePredicate<T0, true>, p1: BasePredicate<T1, true>, p2: BasePredicate<T2, true>, p3: BasePredicate<T3, true>, p4: BasePredicate<T4, true>, p5: BasePredicate<T5, true>, p6: BasePredicate<T6, true>, p7: BasePredicate<T7, true>, p8: BasePredicate<T8, true>, p9: BasePredicate<T9, true>): AnyTypeOfPredicate<U|T0|T1|T2|T3|T4|T5|T6|T7|T8|T9, R>;
    (...predicates: BasePredicate<unknown, true>[]): AnyTypeOfPredicate<unknown, R>;
}

function mustPredicateSetInvoke(...predicates: BasePredicate<unknown, true>[]): AnyTypeOfPredicate<unknown, true> {
    return new AnyTypeOfPredicate<unknown, true>(predicates, true);
}

function maybePredicateSetInvoke(...predicates: BasePredicate<unknown, true>[]): AnyTypeOfPredicate<unknown, false> {
    return new AnyTypeOfPredicate<unknown, false>(predicates, false);
}

export const is = Object.freeze(new PredicateSet(true as true));

export const must = mustPredicateSetInvoke as PredicateInvoke;
export const be = is;

export const maybe = Object.assign(maybePredicateSetInvoke, new PredicateSet<undefined, false>(false)) as
    PredicateSet<undefined, false> & PredicateInvoke<undefined, false>;
Object.setPrototypeOf(maybePredicateSetInvoke, PredicateSet.prototype);

Object.freeze(maybe);
