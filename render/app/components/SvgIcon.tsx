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

import * as mdiPaths from "@mdi/js";
import * as tsx from "vue-tsx-support";

const icons = mdiPaths as Record<string, string>;

const SvgIcon = tsx.component({
    name:  "SvgIcon",
    props: {
        path:     { type: String, default: undefined },
        name:     { type: String, default: undefined },
        size:     { type: String, default: "is-48x48" },
        type:     { type: String, default: undefined },
        rounded:  Boolean,
        inverted: Boolean,
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
    render() {
        return (
            <div class={this.imageClasses}>
                <svg class="svg-icon-image" viewBox="0 0 24 24">
                    <path class={this.pathClasses} d={this.pathData}/>
                </svg>
            </div>
        );
    },
});

export type SvgIconConstructor = typeof SvgIcon;
type SvgIcon = InstanceType<SvgIconConstructor>;
export default SvgIcon;