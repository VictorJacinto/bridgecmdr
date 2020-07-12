import ties from "../../../store/modules/ties";
import dataItem from "../DataItem";

const CurrentTie = dataItem("ties", ties);

type CurrentTie = InstanceType<typeof CurrentTie>;
export default CurrentTie;
