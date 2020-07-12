#set($MIXIN_NAME=${StringUtils.removeAndHump(${NAME}, "-")})

import Vue from "vue";

const ${MIXIN_NAME} = Vue.extend({
    name: "${MIXIN_NAME}",
});

type ${MIXIN_NAME} = InstanceType<typeof ${MIXIN_NAME}>;
export default ${MIXIN_NAME};
