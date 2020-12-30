import axios from "axios";
import { merge } from "lodash";

merge(axios.defaults.headers, {
    common: Object.fromEntries([
        [ "X-Requested-With", "XMLHttpRequest" ],
        [ "Accept", "application/json" ],
    ]),
});

// This module is resolved once it executes.
export default Promise.resolve();
