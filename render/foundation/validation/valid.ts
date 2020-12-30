/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/ban-types */
import { isDate, isFunction, isNaN, isNil, isNull, isRegExp, isSymbol, isUndefined } from "lodash";
import type { PropOptions } from "vue";
import type { Constructor, ConstructorFor, DefaultOf, KnownPropOptions } from "./core/core";
import type { BasePredicate } from "./core/predicate";
import AnyPredicate from "./predicate/any-predicate";
import AnyTypeOfPredicate from "./predicate/any-type-of-predicate";
import ArrayPredicate from "./predicate/array-predicate";
import BooleanPredicate from "./predicate/boolean-predicate";
import EnumPredicate from "./predicate/enum-predicate";
import ErrorPredicate from "./predicate/error-predicate";
import NumberPredicate from "./predicate/number-predicate";
import ObjectPredicate from "./predicate/object-predicate";
import type SimplePredicate from "./predicate/simple-predicate";
import { makeBasicPredicate, makeBasicTypePredicate } from "./predicate/simple-predicate";
import StringPredicate from "./predicate/string-predicate";

export function prop<T, R>(predicate: BasePredicate<T, R>): KnownPropOptions<T, R>;
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

    constructor(required: R) {
        this.required = required;
    }

    // TODO: iterable, iterator, DataView, regular and clamped TypedArrays, promise.

    // eslint-disable-next-line class-methods-use-this
    get any(): AnyPredicate {
        return new AnyPredicate();
    }

    get array(): ArrayPredicate<readonly unknown[]|U, R> {
        return new ArrayPredicate<readonly unknown[]|U, R>(this.required);
    }

    get boolean(): BooleanPredicate<boolean|U, R> {
        return new BooleanPredicate<boolean|U, R>(this.required);
    }

    get date(): SimplePredicate<Date|U, R> {
        return makeBasicTypePredicate(Date, this.required, isDate, "Expected a Date");
    }

    get nan(): SimplePredicate<number|U, R> {
        return makeBasicPredicate<number|U, R>(this.required, isNaN, "Expected NaN");
    }

    get null(): SimplePredicate<null|U, R> {
        return makeBasicPredicate<null|U, R>(this.required, isNull, "Expected null");
    }

    get nullOrUndefined(): SimplePredicate<null|undefined, R> {
        return makeBasicPredicate<null|undefined, R>(this.required, isNil, "Expected null or undefined");
    }

    get number(): NumberPredicate<number|U, R> {
        return new NumberPredicate<number|U, R>(this.required);
    }

    get regExp(): SimplePredicate<RegExp|U, R> {
        return makeBasicTypePredicate<RegExp|U, R>(RegExp, this.required, isRegExp, "Expected a regular expression");
    }

    get string(): StringPredicate<string|U, R> {
        return new StringPredicate<string|U, R>(this.required);
    }

    get symbol(): SimplePredicate<symbol|U, R> {
        return makeBasicTypePredicate<symbol|U, R>(Symbol as unknown as Constructor, this.required, isSymbol, "Expected a symbol");
    }

    get undefined(): SimplePredicate<undefined, R> {
        return makeBasicPredicate<undefined, R>(this.required, isUndefined, "Expected undefined");
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
    <T0, T1, T2, T3, T4, T5>(p0: BasePredicate<T0, true>, p1: BasePredicate<T1, true>, p2: BasePredicate<T2, true>, p3: BasePredicate<T3, true>, p4: BasePredicate<T4, true>, p5: BasePredicate<T5, true>): AnyTypeOfPredicate<U|T0|T1|T2|T3|T4|T5, R>;
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

export const is = Object.freeze(new PredicateSet(true as const));

export const must = mustPredicateSetInvoke as PredicateInvoke;
export const be = is;

export const maybe = Object.assign(maybePredicateSetInvoke, new PredicateSet<undefined, false>(false)) as
    PredicateSet<undefined, false> & PredicateInvoke<undefined, false>;
Object.setPrototypeOf(maybePredicateSetInvoke, PredicateSet.prototype);

Object.freeze(maybe);
