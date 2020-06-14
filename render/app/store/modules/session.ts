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

import { get, set } from "lodash";
import { storeModule } from "../../../foundation/helpers/vuex";
import { RootState } from "../root-state";

type SessionState = {
    attemptedFirstRun: boolean;
};

const session = storeModule<SessionState, RootState>().make({
    state: () => {
        // Default session state.
        const state = {
            attemptedFirstRun: false,
        };

        for (const [ path, setting ] of Object.entries(window.sessionStorage)) {
            if (!path.startsWith("_")) {
                set(state, path, JSON.parse(setting));
            }
        }

        return state;
    },
    getters: {
        get: (state, path: string) => get(state, path),
    },
    mutations: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        set: (state, [ path , value ]: [ string, any ]) => {
            set(state, path, value);

            window.sessionStorage.setItem(path, JSON.stringify(value));
        },
    },
    namespaced: true,
});

export default session;
