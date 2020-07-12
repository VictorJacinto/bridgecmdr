import VueRouter from "vue-router";
import * as tsx from "vue-tsx-support";
import routes from "./routes";
import store from "./store/store";

// @vue/component
const Application = tsx.component({
    name: "Application",
    render() {
        return (<router-view/>);
    },
    router: new VueRouter({
        linkExactActiveClass: "is-active",
        linkActiveClass:      "",
        routes,
    }),
    store,
});

type Application = InstanceType<typeof Application>;
export default Application;
