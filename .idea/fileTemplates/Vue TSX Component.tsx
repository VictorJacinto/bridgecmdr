#set($COMPONENT_NAME=${NAME})

import { VNode } from "vue";
import * as tsx from "vue-tsx-support";

// @vue/component
const ${COMPONENT_NAME} = tsx.component({
name: "${COMPONENT_NAME}",
render(): VNode {
return (<div>#[[$END$]]#</div>);
},
});

type ${COMPONENT_NAME} = InstanceType<typeof ${COMPONENT_NAME}>;
export default ${COMPONENT_NAME};
