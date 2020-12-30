import unhandled from "electron-unhandled";

// Install the unhandled exception catch.
unhandled();

// Load the application module now that the unhandled exception catch is installed.
import(/* webpackMode: "eager" */ "./app").catch(error => unhandled.logError(error));
