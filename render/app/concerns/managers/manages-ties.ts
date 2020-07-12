import TieModal from "../../components/modals/TieModal";
import ties from "../../store/modules/ties";
import managerData from "../manager-data";

const ManagesTies = managerData(ties, TieModal);

type ManagesTies = InstanceType<typeof ManagesTies>;
export default ManagesTies;
