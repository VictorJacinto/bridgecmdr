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

import Vue from "vue";

const IndicatesLoading = Vue.extend({
    name: "IndicatesLoading",
    data: function () {
        return {
            loadingWeight: 0,
        };
    },
    computed: {
        loading(): boolean {
            return this.loadingWeight > 0;
        },
    },
    methods: {
        async loadingWhile<R>(operation: PromiseLike<R>) {
            ++this.loadingWeight;
            try {
                return await operation;
            } finally {
                --this.loadingWeight;
            }
        },
    },
});

type IndicatesLoading = InstanceType<typeof IndicatesLoading>;
export default IndicatesLoading;
