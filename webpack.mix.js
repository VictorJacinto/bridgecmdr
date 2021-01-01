const mix = require("laravel-mix");
const { errorFormatter } = require("./build/helpers/typescript");

// Plug-ins
require("./build/mixers/mix-alias");
require("./build/mixers/mix-ejs");
require("./build/mixers/mix-eslint");

const mixOptions = {
    globalVueStyles:  "render/sass/settings.scss",
    extractVueStyles: "dist/render/scoped.css",
};

const tsOptions = {
    onlyCompileBundledFiles: true,
    errorFormatter,
};

const htmlOptions = {
    inject: false,
};

const webpackOptions = {
    target:    "electron-renderer",
    externals: [{ "serialport": "commonjs serialport" }],
};

const lintOptions = {
    extensions: [ "js", "ts", "vue" ],
    formatter:  "unix",
};

mix.setPublicPath("dist").
    // Since the rendering output is `dist/render`, all assets are one directory back.
    setResourceRoot("../").
    // Front-end process
    ejs("render/index.ejs", "dist/render", htmlOptions).
    ts("render/index.ts", "dist/render", tsOptions).
    sass("render/sass/index.scss", "dist/render").
    // Main process
    ts("main/index.ts", "dist/main", tsOptions).
    // Options
    webpackConfig(webpackOptions).
    options(mixOptions).
    sourceMaps(true, "inline-source-map").
    eslint(lintOptions);
