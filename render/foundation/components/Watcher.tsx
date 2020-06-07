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
/* eslint-disable @typescript-eslint/no-explicit-any */

import { PropOptions } from "vue";
import * as tsx from "vue-tsx-support";
import { is, prop } from "../validation/valid";

type WatcherEvents = {
    onChange(newValue: any, oldValue: any): void;
};

// @vue/component
const Watcher = tsx.componentFactoryOf<WatcherEvents>().create({
    name:  "Watcher",
    props: {
        // eslint-disable-next-line vue/require-default-prop,vue/require-prop-types
        watching: { /* any */ } as PropOptions,
        tag:      prop(is.string.notEmpty, "tag"),
    },
    watch: {
        watching: {
            deep: true,
            handler(newValue: any, oldValue: any): void {
                this.onChange(newValue, oldValue);
            },
        },
    },
    mounted() {
        this.$nextTick(() => this.onChange(this.watching));
    },
    methods: {
        onChange(newValue: any, oldValue?: any) {
            this.$emit("change", newValue, oldValue);
        },
    },
    render() {
        // Renderless...
        return undefined as any;
    },
});

type Watcher = InstanceType<typeof Watcher>;
export default Watcher;
