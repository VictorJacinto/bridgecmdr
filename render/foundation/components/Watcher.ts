import { omit } from "lodash";
import type { CreateElement, VNode } from "vue";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import { normalizeScopedSlot } from "../helpers/vue";
import { is, prop } from "../validation/valid";

@Component<Watcher>({ name: "Watcher" })
export default class Watcher extends Vue {
    @Prop(prop(is.any))
    readonly watching!: unknown;

    @Prop(prop(is.string.notEmpty, "div"))
    readonly tag!: string;

    @Watch("watching", { deep: true })
    onChange(newValue: unknown, oldValue: unknown): void {
        this.$emit("change", newValue, oldValue);
    }

    mounted(): void {
        this.$nextTick(() => { this.onChange(this.watching, undefined) });
    }

    render(h: CreateElement): null|VNode {
        const children = normalizeScopedSlot(this, "default", {});

        return children && children.length <= 1 ? (children[0] || null) :
            h(this.tag, { on: omit(this.$listeners, "change") }, children);
    }
}
