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

export type Constructor = { new (...args: any[]): any };
export type ConstructorFor<T> = { new (...args: any[]): T };
export type BaseType<T> = T extends undefined ? never : T;

export type DefaultOf<T> = T|(() => T);
export type KnownRequirement<R> = R extends true ? { required: true } : { };
export type KnownPropOptions<T, R> = Omit<PropOptions<T>, "required"> & KnownRequirement<R>;
