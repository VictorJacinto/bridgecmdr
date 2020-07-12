import sources from "../../../store/modules/sources";
import dataItem from "../DataItem";

const CurrentSource = dataItem("sources", sources);

type CurrentSource = InstanceType<typeof CurrentSource>;
export default CurrentSource;
