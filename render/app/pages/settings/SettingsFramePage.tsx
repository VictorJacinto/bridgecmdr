import { VNode } from "vue";
import * as tsx from "vue-tsx-support";
import { BIcon, BNavbar, BNavbarItem } from "../../../foundation/components/buefy-tsx";
import SetsSettingsTitle from "../../concerns/uses-settings-title";

// @vue/component
const SettingsFramePage = tsx.componentFactory.mixin(SetsSettingsTitle).create({
    name: "SettingsFramePage",
    render(): VNode {
        return (
            <div id="settings-frame-page">
                <BNavbar fixedTop type="is-primary" mobileBurger={false}>
                    <template slot="brand">
                        <BNavbarItem tag="a" onClick={() => this.$router.back()}>
                            <BIcon icon="arrow-left"/>
                        </BNavbarItem>
                        <BNavbarItem tag="div">{this.title}</BNavbarItem>
                    </template>
                </BNavbar>
                <router-view/>
            </div>
        );
    },
});

type SettingsFramePage = InstanceType<typeof SettingsFramePage>;
export default SettingsFramePage;
