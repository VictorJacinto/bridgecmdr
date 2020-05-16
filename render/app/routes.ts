import { route } from "../foundation/vue/routing";
import DashboardPage from "./pages/DashboardPage.vue";
import SettingsPage from "./pages/SettingsPage.vue";

const routes = [
    // Home
    route("home", "/", DashboardPage),

    // Settings
    route("settings", "/settings", SettingsPage),
];

export default routes;
