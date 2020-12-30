import { Module, StoreModule } from "../../../foundation/system/vuex";
import store from "../store";

@Module({ openState: true })
class UserInterface extends StoreModule {
    settingsTitle = "";
}

const userInterface = new UserInterface({ store });

export default userInterface;
