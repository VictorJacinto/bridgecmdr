import ties from "../../../store/modules/ties";
import dataSource from "../DataSource";

const Ties = dataSource("ties", ties);

type Ties = InstanceType<typeof Ties>;
export default Ties;
