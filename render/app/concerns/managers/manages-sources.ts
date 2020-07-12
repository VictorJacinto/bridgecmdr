import SourceModal from "../../components/modals/SourceModal";
import sources from "../../store/modules/sources";
import managerData from "../manager-data";

const ManagesSources = managerData(sources, SourceModal);

type ManagesSources = InstanceType<typeof ManagesSources>;
export default ManagesSources;
