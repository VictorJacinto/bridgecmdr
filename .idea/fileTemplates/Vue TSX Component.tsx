#set($COMPONENT_NAME=${NAME})
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

import * as tsx from "vue-tsx-support";

const ${COMPONENT_NAME} = tsx.component({
name: "${COMPONENT_NAME}",
render() {
return (<div>#[[$END$]]#</div>);
},
});

export type ${COMPONENT_NAME}Constructor = typeof ${COMPONENT_NAME};
type ${COMPONENT_NAME} = InstanceType<${COMPONENT_NAME}Constructor>;
export default ${COMPONENT_NAME};
