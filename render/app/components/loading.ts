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

import { BLoadingComponent } from "buefy/types/components";
import Vue, { VueConstructor } from "vue";

interface Loading {
    while<R>(operation: PromiseLike<R>): Promise<R>;
}

const LoadingMixinConfig = {
    data: function () {
        return {
            $loadingWeight:    0,
            $loadingComponent: null as BLoadingComponent|null,
        };
    },
};

const LoadingMixin = Vue.extend(LoadingMixinConfig);
type LoadingMixin = InstanceType<typeof LoadingMixin> & {
    $data: {
        $loadingWeight: number;
        $loadingComponent: BLoadingComponent|null;
    };
};

function $loading(this: LoadingMixin): Loading {
    const loading = {
        start: () => {
            if (++this.$data.$loadingWeight === 1) {
                // First time called.
                this.$data.$loadingComponent = this.$buefy.loading.open({
                    canCancel: false, container: this.$el,
                });
            }
        },
        end: () => {
            if (--this.$data.$loadingWeight === 0) {
                // Last time called.
                if (this.$data.$loadingComponent) {
                    this.$data.$loadingComponent.close();
                    this.$data.$loadingComponent = null;
                }
            }
        },
        while: async <R>(operation: PromiseLike<R>) => {
            loading.start();
            try {
                return await operation;
            } finally {
                loading.end();
            }
        },
    };

    return loading;
}

const Loading = {
    install(vue: VueConstructor) {
        Vue.mixin(LoadingMixinConfig);
        Object.defineProperties(vue.prototype, {
            $loading: { configurable: false, enumerable: false, get: $loading },
        });
    },
};

export default Loading;

declare module "vue/types/vue" {
    interface Vue {
        $loading: Loading;
    }
}
