import Vue from "vue";
import ImageCache from "../support/image-cache";

const HasImages = Vue.extend({
    name: "HasImages",
    data: function () {
        return {
            images: new ImageCache(),
        };
    },
    beforeDestroy() {
        this.images.revoke();
    },
});

type HasImages = InstanceType<typeof HasImages>;
export default HasImages;
