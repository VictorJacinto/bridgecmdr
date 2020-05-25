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

import { once } from "lodash";
import { defaultOf } from "../../foundation/helpers/module";

const isBooted = once(async () => {
    await Promise.all([
        defaultOf(await import(/* webpackMode: "eager" */ "./modules/database")),
        defaultOf(await import(/* webpackMode: "eager" */ "./modules/drivers")),
        defaultOf(await import(/* webpackMode: "eager" */ "./modules/axios")),
        defaultOf(await import(/* webpackMode: "eager" */ "./modules/framework")),
        defaultOf(await import(/* webpackMode: "eager" */ "./modules/components")),
    ]);
});

export default isBooted;
