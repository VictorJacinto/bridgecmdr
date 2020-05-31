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

import { isObject, isPlainObject } from "lodash";
import { BaseType, Constructor } from "../core/core";
import { Validator } from "../core/validator";
import CollectionPredicate from "./collection-predicate";

export default class ObjectPredicate<T extends object|undefined, R> extends CollectionPredicate<T, R> {
    constructor(type: Constructor, required: R) {
        super("property", "properties", type, required);
    }

    // recordOf, shape

    get plain(): Omit<this, "plain"> {
        return this.wrapValidator(isPlainObject,
            value => `Expected a plain object, but received ${(value as Record<string, any>).constructor.name}`,
            () => "Expected prototypical object, but received a plain one");
    }

    // eslint-disable-next-line class-methods-use-this
    protected validator(): Validator<BaseType<T>> {
        return {
            validate: (value: unknown) => value instanceof (this.type as Constructor),
            message:  (value: unknown) => (isObject(value) ?
                `Expected ${(this.type as Constructor).name}, but received ${value.constructor.name}` :
                `Expected ${(this.type as Constructor).name}, but received ${typeof value}`),
        };
    }
}
