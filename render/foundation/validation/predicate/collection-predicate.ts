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

import { size, isEmpty, negate } from "lodash";
import { Constructor } from "../core/core";
import Predicate from "../core/predicate";

export default abstract class CollectionPredicate<T, R> extends Predicate<T, R> {
    protected readonly singular: string;
    protected readonly plural: string;

    protected constructor(singular: string, plural: string, type: Constructor, required: R) {
        super(type, required);
        this.singular = singular;
        this.plural = plural;
    }

    get empty(): this {
        return this.wrapValidator(isEmpty,
            (value: any) => `Expected to be empty, but ${size(value)} ${this.term(size(value))} provided`,
            _value => "Expected to not be empty");
    }

    get notEmpty(): this {
        return this.wrapValidator(negate(isEmpty),
            _value => "Expected to not be empty",
            (value: any) => `Expected to be empty, but ${size(value)} ${this.term(size(value))} provided`);
    }

    protected term(length: number): string {
        return length === 1 ? this.singular : this.plural;
    }
}
