import SwitchModal from "../../components/modals/SwitchModal";
import switches from "../../store/modules/switches";
import managerData from "../manager-data";

const ManagesSwitches = managerData(switches, SwitchModal);

type ManagesSwitches = InstanceType<typeof ManagesSwitches>;
export default ManagesSwitches;
