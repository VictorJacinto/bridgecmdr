import switches from "../../../store/modules/switches";
import dataItem from "../DataItem";

const CurrentSwitch = dataItem("switches", switches);

type CurrentSwitch = InstanceType<typeof CurrentSwitch>;
export default CurrentSwitch;
