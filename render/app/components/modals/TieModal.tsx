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

import { VNode } from "vue";
import * as tsx from "vue-tsx-support";
import { mapModuleActions, mapModuleState } from "../../../foundation/helpers/vuex";
import { is, prop } from "../../../foundation/validation/valid";
import IndicatesLoading from "../../concerns/indicates-loading";
import switches from "../../store/modules/switches";
import { Tie } from "../../store/modules/ties";

// @vue/component
const TieModal = tsx.componentFactory.mixin(IndicatesLoading).create({
    name:  "TieModal",
    props: {
        item: prop(is.object<Partial<Tie>>()),
    },
    computed: {
        ...mapModuleState(switches, "switches", {
            switches: "items",
        }),
    },
    mounted() {
        this.$nextTick(() => this.loadingWhile(this.getSwitches()));
    },
    methods: {
        ...mapModuleActions(switches, "switches", {
            getSwitches: "all",
        }),
    },
    render(): VNode {
        return (<div></div>);
    },
});

type TieModal = InstanceType<typeof TieModal>;
export default TieModal;
