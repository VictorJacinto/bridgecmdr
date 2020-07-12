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
