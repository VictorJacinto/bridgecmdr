import * as mdiPaths from "@mdi/js";
import { VNode } from "vue";
import * as tsx from "vue-tsx-support";
import { KnownColorModifiers } from "../../foundation/components/buefy-tsx";
import { KnownIconsSizes } from "../../foundation/components/bulma-typing";
import { is, maybe, prop } from "../../foundation/validation/valid";

const icons = mdiPaths as Record<string, string>;

// @vue/component
const SvgIcon = tsx.component({
    name:  "SvgIcon",
    props: {
        path:     prop(maybe.string.notEmpty),
        name:     prop(maybe.string.notEmpty),
        size:     prop(is.enum(KnownIconsSizes), "is-48x48"),
        type:     prop(maybe.enum(KnownColorModifiers)),
        rounded:  prop(maybe.boolean),
        inverted: prop(maybe.boolean),
    },
    computed: {
        pathData(): string {
            if (this.path) {
                return this.path;
            }

            if (this.name) {
                if (!(this.name in icons)) {
                    throw new ReferenceError("Specified name not found");
                }

                return icons[this.name];
            }

            throw new ReferenceError("No name or path specified");
        },
        imageClasses(): (string|undefined)[] {
            return [
                "image",
                "svg-icon",
                this.size,
                this.backgroundColor,
                this.rounded ? "is-rounded" : undefined,
                this.inverted ? "is-inverted" : undefined,
            ];
        },
        pathClasses(): string[] {
            return [ "svg-icon-path", this.iconColor ];
        },
        backgroundColor(): string {
            if (this.type && this.type.startsWith("is-")) {
                return `svg-background-${this.type.slice(3)}`;
            }

            return "svg-background-text";
        },
        iconColor(): string {
            if (this.type && this.type.startsWith("is-")) {
                return `svg-fill-${this.type.slice(3)}`;
            }

            return "svg-fill-text";
        },
    },
    render(): VNode {
        return (
            <figure class={this.imageClasses}>
                <svg class="svg-icon-image" viewBox="0 0 24 24">
                    <path class={this.pathClasses} d={this.pathData}/>
                </svg>
            </figure>
        );
    },
});

type SvgIcon = InstanceType<typeof SvgIcon>;
export default SvgIcon;
