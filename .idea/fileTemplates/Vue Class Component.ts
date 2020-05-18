#set(${COMPONENT_NAME}=${FILE_NAME})
import Vue from "vue";
import Component from "vue-class-component";

@Component({
template: `
#[[$END$]]#
`,
})
export default class ${COMPONENT_NAME} extends Vue {
}
