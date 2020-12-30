<template>
    <router-view/>
</template>

<script lang="ts">
    import Vue from "vue";
    import Component from "vue-class-component";
    import VueRouter from "vue-router";
    import routes from "./routes";
    import store from "./store/store";

    const router = new VueRouter({
        linkExactActiveClass: "is-active",
        linkActiveClass:      "",
        routes,
    });

    @Component<Application>({ name: "Application", router, store })
    export default class Application extends Vue {
        // Not much happens here.
    }
</script>
