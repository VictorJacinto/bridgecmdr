import Vue from "vue";
import Component from "vue-class-component";
import ImageCache from "../support/image-cache";

@Component({ name: "HasImages" })
export default class HasImages extends Vue {
    images = new ImageCache();

    beforeDestroy(): void {
        this.images.revoke();
    }
}
