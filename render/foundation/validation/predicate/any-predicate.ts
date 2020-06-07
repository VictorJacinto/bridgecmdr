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
/* eslint-disable @typescript-eslint/no-explicit-any, class-methods-use-this */

import { PropOptions } from "vue";
import { DefaultOf } from "../core/core";
import { BasePredicate, IsPredicate } from "../core/predicate";
import { Validator } from "../core/validator";

export default class AnyPredicate implements BasePredicate<any> {
    get [IsPredicate](): true {
        return true;
    }

    get type(): undefined {
        return undefined;
    }

    get required(): false {
        return false;
    }

    options($default?: DefaultOf<any>): PropOptions<any> {
        return { default: $default };
    }

    validators(_nested: boolean): Validator<any>[] {
        return [];
    }
}
