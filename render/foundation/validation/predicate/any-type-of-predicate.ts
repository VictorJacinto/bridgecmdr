import { isNil } from "lodash";
import { PropOptions } from "vue";
import { BaseType, Constructor, DefaultOf, KnownPropOptions } from "../core/core";
import { BasePredicate, IsPredicate } from "../core/predicate";
import { makeInnerValidator, Validator } from "../core/validator";

export default class AnyTypeOfPredicate<T, R> implements BasePredicate<T, R> {
    private readonly isRequired: R;
    private readonly myPredicates: BasePredicate<unknown, true>[];

    constructor(predicates: BasePredicate<unknown, true>[], required: R) {
        if (predicates.length === 0) {
            throw new Error("No predicates provided for Any validation");
        }

        this.isRequired = required;
        this.myPredicates = predicates;
    }

    // eslint-disable-next-line class-methods-use-this
    get [IsPredicate](): true {
        return true;
    }

    // eslint-disable-next-line class-methods-use-this
    get type(): undefined|Constructor {
        return undefined;
    }

    get required(): R {
        return this.isRequired;
    }

    options<D extends T>($default?: DefaultOf<D>): KnownPropOptions<T, R> {
        this.myPredicates.forEach(predicate => {
            if (!predicate.required) {
                console.warn("Nested predicates of Any should not be optional, " +
                             "consider making the Any optional");
            }
        });

        const types: Constructor[] = [];
        for (const predicate of this.myPredicates) {
            const type = predicate.type;
            if (isNil(type)) {
                console.warn("In Vue; Null, Undefined, Any, NaN, Iterable, Iterator, and Promise predicates should " +
                    "not be nested in Any, consider combining nested Any predicates, do not use Null, and use " +
                    "optional rather than Undefined; for other types, avoid using them as Component properties.");
            } else {
                types.push(type);
            }
        }

        const options: PropOptions<T> = types.length > 0 ? { type: types } : {};
        if (this.isRequired && isNil($default)) {
            options.required = true;
        } else {
            options.default = $default;
        }

        const validator = makeInnerValidator(this.validators(false));
        options.validator = (value: T): boolean => {
            const failed = validator(value, false);
            if (failed !== null) {
                console.error(failed.message(value));

                return false;
            }

            return true;
        };

        return options as KnownPropOptions<T, R>;
    }

    validators(nested: boolean): Validator<BaseType<T>>[] {
        let failed: Validator<unknown>[] = [];

        return [
            {
                message: (value: unknown): string => {
                    if (failed.length === 0) {
                        throw new ReferenceError("Attempting to get message from successful Any validator");
                    }

                    if (failed.length === 1) {
                        return failed[0].message(value);
                    }

                    return `No expected value provided:\r\n\t${
                        failed.map(validator => validator.message(value)).join("\r\n\t")
                    }`;
                },
                validate: (value: BaseType<T>): boolean => {
                    for (const predicate of this.myPredicates) {
                        if (nested || !isNil(predicate.type)) {
                            const [ first, ...validators ] = predicate.validators(true);
                            if (first) {
                                if (first.validate(value)) {
                                    // This validator set should be used.

                                    const inner = makeInnerValidator(validators);
                                    const result = inner(value, false);
                                    if (result !== null) {
                                        failed = [result];

                                        return false;
                                    }

                                    // Reset failed and return true.
                                    failed = [];

                                    return true;
                                }

                                failed.push(first);
                            }
                        }
                    }

                    return false;
                },
            },
        ];
    }
}
