import Vuex  from "vuex";

const isProduction = process.env.NODE_ENV === "production";

const store = new Vuex.Store<Record<string, unknown>>({ strict: isProduction });

export default store;
