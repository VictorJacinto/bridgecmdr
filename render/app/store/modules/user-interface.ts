import { Module, StoreModule } from "decoration-vuex";
import store from "../store";

@Module({ openState: true })
class UserInterface extends StoreModule {
    settingsTitle = "";
}

const userInterface = new UserInterface({ store });

export default userInterface;
