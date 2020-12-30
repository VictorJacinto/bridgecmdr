import { route } from "../foundation/helpers/routing";
import DashboardPage from "./pages/DashboardPage.vue";
import SettingsFramePage from "./pages/settings/SettingsFramePage.vue";
import GeneralPage from "./pages/settings/sub-pages/GeneralPage.vue";
import SettingsPage from "./pages/settings/sub-pages/SettingsPage.vue";
import SwitchList from "./pages/settings/sub-pages/SwitchList.vue";
import SourceList from "./pages/settings/sub-pages/source/SourceList.vue";
import SourcePage from "./pages/settings/sub-pages/source/SourcePage.vue";

const routes = [
    // Home
    route("home", "/", DashboardPage),

    // Settings
    route(undefined, "/settings", SettingsFramePage, [
        route("settings", "", SettingsPage),
        route("settings/general", "general", GeneralPage),
        route("switches", "switches", SwitchList),
        route("sources", "sources", SourceList),
        route("source", "source/:id", SourcePage),
    ]),
];

export default routes;
