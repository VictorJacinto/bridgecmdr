import sources from "../../../store/modules/sources";
import dataSource from "../DataSource";

const Sources = dataSource("sources", sources);

type Sources = InstanceType<typeof Sources>;
export default Sources;
