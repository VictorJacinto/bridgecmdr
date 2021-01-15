<template>
    <figure :class="imageClasses">
        <svg class="svg-icon-image" viewBox="0 0 24 24">
            <path :class="pathClasses" :d="pathData"/>
        </svg>
    </figure>
</template>

<script lang="ts">
    import * as mdiPaths from "@mdi/js";
    import v from "vahvista";
    import Vue from "vue";
    import Component from "vue-class-component";
    import { Prop } from "vue-property-decorator";
    import { KnownColorModifiers } from "../../foundation/helpers/buefy";
    import { KnownIconsSizes } from "../../foundation/helpers/bulma";

    const icons = mdiPaths as Record<string, string>;

    @Component<SvgIcon>({ name: "SvgIcon" })
    export default class SvgIcon extends Vue {
        @Prop({ type: String, default: undefined, validator: v.notEmpty })
        readonly path!: undefined|string;

        @Prop({ type: String, default: undefined, validator: v.notEmpty })
        readonly name!: undefined|string;

        @Prop({ type: String, default: "is-48x48", validator: v.enum(KnownIconsSizes) })
        readonly size!: KnownIconsSizes;

        @Prop({ type: String, default: undefined, validator: v.enum(KnownColorModifiers) })
        readonly type!: undefined|KnownColorModifiers;

        @Prop(Boolean)
        readonly rounded!: undefined|boolean;

        @Prop(Boolean)
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

<style lang="scss" scoped>
    .image.svg-icon {
        padding: 10%;
        svg.svg-icon-image {
            width: 100%;
            height: 100%;
            path.svg-icon-path {
                fill: $text;
                @each $name, $pair in $colors {
                    $color: nth($pair, 1);
                    &.svg-fill-#{$name} {
                        fill: $color;
                    }
                }
            }
        }

        &.is-inverted {
            &.is-rounded {
                border-radius: 290486px;
                padding: 15%;
            }
            @each $name, $pair in $colors {
                $color: nth($pair, 1);
                $invert: nth($pair, 2);
                &.svg-background-#{$name} {
                    background: $color;
                }
            }
            svg.svg-icon-image {
                path.svg-icon-path {
                    fill: $text-invert;
                    @each $name, $pair in $colors {
                        $color: nth($pair, 2);
                        &.svg-fill-#{$name} {
                            fill: $color;
                        }
                    }
                }
            }
        }
    }
</style>
