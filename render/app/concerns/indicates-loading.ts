import Vue from "vue";
import Component from "vue-class-component";

@Component({ name: "IndicatesLoading" })
export default class IndicatesLoading extends Vue {
    loadingWeight = 0;

    get loading(): boolean {
        return this.loadingWeight > 0;
    }

    async loadingWhile<R>(operation: PromiseLike<R>): Promise<R> {
        ++this.loadingWeight;
        try {
            return await operation;
        } finally {
            --this.loadingWeight;
        }
    }
}
