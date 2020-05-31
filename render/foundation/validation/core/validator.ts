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
