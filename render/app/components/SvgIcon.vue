<template>
    <figure :class="imageClasses">
        <svg class="svg-icon-image" viewBox="0 0 24 24">
            <path :class="pathClasses" :d="pathData"/>
        </svg>
    </figure>
</template>

<script lang="ts">
    import * as mdiPaths from "@mdi/js";
    import Vue from "vue";
    import Component from "vue-class-component";
    import { Prop } from "vue-property-decorator";
    import { KnownColorModifiers } from "../../foundation/helpers/buefy";
    import { KnownIconsSizes } from "../../foundation/helpers/bulma";
    import { is, maybe, prop } from "../../foundation/validation/valid";

    const icons = mdiPaths as Record<string, string>;

    @Component<SvgIcon>({ name: "SvgIcon" })
    export default class SvgIcon extends Vue {
        @Prop(prop(maybe.string.notEmpty))
        readonly path!: undefined|string;

        @Prop(prop(maybe.string.notEmpty))
        readonly name!: undefined|string;

        @Prop(prop(is.enum(KnownIconsSizes), "is-48x48"))
        readonly size!: KnownIconsSizes;

        @Prop(prop(maybe.enum(KnownColorModifiers)))
        readonly type!: undefined|KnownColorModifiers;

        @Prop(prop(maybe.boolean))
        readonly rounded!: undefined|boolean;

        @Prop(prop(maybe.boolean))
        readonly inverted!: undefined|boolean;

        get pathData(): string {
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
        }

        get imageClasses(): (string|undefined)[] {
            return [
                "image",
                "svg-icon",
                this.size,
                this.backgroundColor,
                this.rounded ? "is-rounded" : undefined,
                this.inverted ? "is-inverted" : undefined,
            ];
        }

        get pathClasses(): string[] {
            return [ "svg-icon-path", this.iconColor ];
        }

        get backgroundColor(): string {
            if (this.type && this.type.startsWith("is-")) {
                return `svg-background-${this.type.slice(3)}`;
            }

            return "svg-background-text";
        }

        get iconColor(): string {
            if (this.type && this.type.startsWith("is-")) {
                return `svg-fill-${this.type.slice(3)}`;
            }

            return "svg-fill-text";
        }
    }
</script>
