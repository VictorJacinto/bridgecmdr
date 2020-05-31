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

import { PropOptions } from "vue";
import { DefaultOf } from "../core/core";
import { BasePredicate, IsPredicate } from "../core/predicate";
import { Validator } from "../core/validator";

export default class AnyPredicate implements BasePredicate<any, false> {
    readonly "[unknown]": true;

    // eslint-disable-next-line class-methods-use-this
    get [IsPredicate](): true {
        return true;
    }

    // eslint-disable-next-line class-methods-use-this
    get type(): undefined {
        return undefined;
    }

    // eslint-disable-next-line class-methods-use-this
    get required(): false {
        return false;
    }

    // eslint-disable-next-line class-methods-use-this
    options($default?: DefaultOf<any>): PropOptions<any> {
        return { default: $default };
    }

    // eslint-disable-next-line class-methods-use-this
    validators(_nested: boolean): Validator<any>[] {
        return [];
    }
}
