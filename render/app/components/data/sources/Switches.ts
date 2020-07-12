import switches from "../../../store/modules/switches";
import dataSource from "../DataSource";

const Switches = dataSource("switches", switches);

type Switches = InstanceType<typeof Switches>;
export default Switches;
