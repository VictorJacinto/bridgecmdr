#set($MIXIN_NAME=${StringUtils.removeAndHump(${NAME}, "-")})
import Vue from "vue";
import Component from "vue-class-component";

@Component<${MIXIN_NAME}>({ name: "${MIXIN_NAME}" })
export default class ${MIXIN_NAME} extends Vue {

}
