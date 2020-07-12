import axios from "axios";

// eslint-disable-next-line dot-notation
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
// eslint-disable-next-line dot-notation
axios.defaults.headers.common["Accept"] = "application/json";

// This module is resolved once it executes.
export default Promise.resolve();
