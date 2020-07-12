import { isUndefined } from "lodash";

export type ValidatorFunction<T> = (value: T) => boolean;

export type MessageGenerator = (value: unknown) => string;

export interface Validator<T> {
    validate(value: T): boolean;

    message: MessageGenerator;
}

export type InnerValidator<T> = (value: unknown, optional: boolean) => null|Validator<T>;

export function makeInnerValidator<T>(set: Validator<T>[]): InnerValidator<T> {
    return (value: unknown, optional: boolean): null|Validator<T> => {
        if (optional && isUndefined(value)) {
            return null;
        }

        for (const validator of set) {
            if (!validator.validate(value as T)) {
                return validator;
            }
        }

        return null;
    };
}

export type SimpleValidator<T> = (value: T) => boolean|string;
