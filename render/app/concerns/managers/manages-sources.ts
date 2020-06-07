/*
BridgeCmdr - A/V switch and monitor controller
Copyright (C) 2019-2020 Matthew Holder

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import SourceModal from "../../components/modals/SourceModal";
import sources from "../../store/modules/sources";
import managerData from "../manager-data";

const ManagesSources = managerData({
    namespace: "sources",
    module:    sources,
    modal:     SourceModal,
    term:      "source",
});

type ManagesSources = InstanceType<typeof ManagesSources>;
export default ManagesSources;
