const path   = require("path");
const packer = require("./webpack-packer");

// TODO: Resolve the packer configuration rather than hard-code it.
const packerConfigPath = "..";

// Require the simplified configuration for it's side-effects on the packer.
require(path.join(packerConfigPath, "webpack.packer"));

// Now export our functions.
module.exports = () => Promise.all([
    packer.main.generate("electron-main"),
    packer.render.generate("electron-renderer"),
]);
