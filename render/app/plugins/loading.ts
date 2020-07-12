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
