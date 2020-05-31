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

import { size } from "lodash";
import { Constructor } from "../core/core";
import CollectionPredicate from "./collection-predicate";

export default abstract class ArrayLikePredicate<T extends ArrayLike<unknown>|undefined, R> extends CollectionPredicate<T, R> {
    protected constructor(singular: string, plural: string, type: Constructor, required: R) {
        super(singular, plural, type, required);
    }

    length(count: number): this {
        return this.wrapValidator(value => size(value) === count,
            (value: any) => `Expected to be ${count} ${this.term(count)}, but is ${size(value)}`,
            _value => `Expected to not be ${count} ${this.term(count)}`);
    }

    maxLength(max: number): this {
        return this.wrapValidator(value => value.length <= max,
            (value: any) => `Expected to be ${max} ${this.term(max)} or less, but is ${size(value)}`,
            (value: any) => `Expected to be more than ${max} ${this.term(max)}, but is ${size(value)}`);
    }

    minLength(min: number): this {
        return this.wrapValidator(value => value.length >= min,
            (value: any) => `Expected to be ${min} ${this.term(min)} or more, but is ${size(value)}`,
            (value: any) => `Expected to be less than ${min} ${this.term(min)}, but is ${size(value)}`);
    }
}
