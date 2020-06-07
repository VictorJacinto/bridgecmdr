import { route } from "../foundation/helpers/routing";
import DashboardPage from "./pages/DashboardPage";
import SettingsFramePage from "./pages/settings/SettingsFramePage";
import SettingsPage from "./pages/settings/sub-pages/SettingsPage";
import SourceList from "./pages/settings/sub-pages/SourceList";
import SwitchList from "./pages/settings/sub-pages/SwitchList";
import SourcePage from "./pages/settings/sub-pages/source/SourcePage";

const routes = [
    // Home
    route("home", "/", DashboardPage),

    // Settings
    route(undefined, "/settings", SettingsFramePage, [
        route("settings", "", SettingsPage),
        route("switches", "switches", SwitchList),
        route("sources", "sources", SourceList),
        route("source", "source/:id", SourcePage),
    ]),
];

export default routes;
