import { route } from "../foundation/vue/routing";
import DashboardPage from "./pages/DashboardPage";
import SettingsPage from "./pages/settings/SettingsPage";
import SwitchList from "./pages/settings/SwitchList";

const routes = [
    // Home
    route("home", "/", DashboardPage),

    // Settings
    route("settings", "/settings", SettingsPage),

    // Switches
    route("switches", "/settings/switches", SwitchList),
];

export default routes;
