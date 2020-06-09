import { route } from "../foundation/helpers/routing";
import DashboardPage from "./pages/DashboardPage";
import SettingsFramePage from "./pages/settings/SettingsFramePage";
import SettingsPage from "./pages/settings/sub-pages/SettingsPage";
import SwitchList from "./pages/settings/sub-pages/SwitchList";
import SourceList from "./pages/settings/sub-pages/source/show/SourceList";
import SourcePage from "./pages/settings/sub-pages/source/show/SourcePage";

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
