<template>
#[[$END$]]#
</template>

<script lang="ts">
import Vue from "vue";

const ${COMPONENT_NAME} = Vue.extend({
name: "${COMPONENT_NAME}",
});

export type ${COMPONENT_NAME}Constructor = typeof ${COMPONENT_NAME};
export type ${COMPONENT_NAME} = InstanceType<${COMPONENT_NAME}Constructor>;
export default ${COMPONENT_NAME};
</script>

<style lang="scss" scoped>

</style>
