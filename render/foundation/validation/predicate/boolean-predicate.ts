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

import { isBoolean } from "lodash";
import { BaseType } from "../core/core";
import Predicate from "../core/predicate";
import { Validator } from "../core/validator";

type ForcedBooleanPredicate<B extends false|true|boolean|undefined, V extends false|true, R> =
    Omit<BooleanPredicate<Exclude<B, boolean>|V, R>, "true" | "false">;

export default class BooleanPredicate<B extends false|true|boolean|undefined, R> extends Predicate<B, R> {
    constructor(required: R) {
        super(Boolean, required);
    }

    get true(): ForcedBooleanPredicate<B, true, R> {
        return this.wrapValidator(value => value === true,
            value => `Expected to be true, but received ${value}`,
            value => `Expected to be false, but received ${value}`) as
            ForcedBooleanPredicate<B, true, R>;
    }

    get false(): ForcedBooleanPredicate<B, false, R> {
        return this.wrapValidator(value => value === false,
            value => `Expected to be false, but received ${value}`,
            value => `Expected to be true, but received ${value}`) as
            ForcedBooleanPredicate<B, false, R>;
    }

    // eslint-disable-next-line class-methods-use-this
    protected validator(): Validator<BaseType<B>> {
        return {
            validate(value: unknown): boolean {
                return isBoolean(value);
            },
            message(value: unknown): string {
                return `Expected boolean, but received ${typeof value}`;
            },
        };
    }
}
