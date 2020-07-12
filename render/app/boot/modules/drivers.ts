// The main driver module.
import Driver from "../../system/driver";

// The available drivers.
import ExtronMatrixSwitch         from "../../system/drivers/extron-matrix-switch";
import SonySerialMonitor          from "../../system/drivers/sony-serial--monitor";
import TeslaSmartMatrixSwitch     from "../../system/drivers/tesla-smart-matrix-switch";

// Now we register our known drivers.
Driver.register(ExtronMatrixSwitch);
Driver.register(SonySerialMonitor);
Driver.register(TeslaSmartMatrixSwitch);

// This module is resolved once it executes.
export default Promise.resolve();
