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

import { isObject } from "lodash";
import { BaseType, Constructor } from "../core/core";
import Predicate from "../core/predicate";
import { Validator } from "../core/validator";

export default class ErrorPredicate<E extends Error|undefined, R> extends Predicate<E, R> {
    public constructor(type: Constructor, required: R) {
        super(type, required);
    }

    name(name: string): this {
        return this.wrapValidator(value => value.name === name,
            value => `Expected an error named ${name}, but received ${(value as Error).name}`,
            value => `Not expected an error named ${name}, but received ${(value as Error).name}`);
    }

    // eslint-disable-next-line class-methods-use-this
    protected validator(): Validator<BaseType<E>> {
        return {
            validate: (value: unknown) => value instanceof (this.type as Constructor),
            message:  (value: unknown) => (isObject(value) ?
                `Expected ${(this.type as Constructor).name}, but received ${value.constructor.name}` :
                `Expected ${(this.type as Constructor).name}, but received ${typeof value}`),
        };
    }
}
