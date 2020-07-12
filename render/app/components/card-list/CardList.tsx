import * as tsx from "vue-tsx-support";

// @vue/component
const CardList = tsx.component({
    name: "CardList",
    render() {
        return (<div class="card-list">{ this.$slots.default }</div>);
    },
});

type CardList = InstanceType<typeof CardList>;
export default CardList;
