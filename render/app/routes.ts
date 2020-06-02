import { route } from "../foundation/helpers/routing";
import DashboardPage from "./pages/DashboardPage";
import SettingsPage from "./pages/settings/SettingsPage";
import SourceList from "./pages/settings/SourceList";
import SwitchList from "./pages/settings/SwitchList";

const routes = [
    // Home
    route("home", "/", DashboardPage),

    // Settings
    route("settings", "/settings", SettingsPage),
    route("switches", "/settings/switches", SwitchList),
    route("sources", "/settings/sources", SourceList),
];

export default routes;
