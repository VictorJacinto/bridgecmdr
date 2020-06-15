import { route } from "../foundation/helpers/routing";
import DashboardPage from "./pages/DashboardPage";
import SettingsFramePage from "./pages/settings/SettingsFramePage";
import GeneralPage from "./pages/settings/sub-pages/GeneralPage";
import SettingsPage from "./pages/settings/sub-pages/SettingsPage";
import SwitchList from "./pages/settings/sub-pages/SwitchList";
import SourceList from "./pages/settings/sub-pages/source/SourceList";
import SourcePage from "./pages/settings/sub-pages/source/SourcePage";

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
