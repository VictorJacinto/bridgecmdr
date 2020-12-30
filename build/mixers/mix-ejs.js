const path = require("path");
const mix = require("laravel-mix");
const File = require("laravel-mix/src/File");

class Ejs {
    constructor() {
        this.toCompile = [];
    }

    // eslint-disable-next-line class-methods-use-this
    name() {
        return ["ejs"];
    }

    // eslint-disable-next-line class-methods-use-this
    dependencies() {
        return ["html-webpack-plugin"];
    }

    register(entry, output, options = {}) {
        entry = new File(entry);

        output = this.normalizeOutput(new File(output), `${entry.nameWithoutExtension()}.html`);

        this.toCompile.push({ entry, output, options });
    }

    webpackPlugins() {
        const HtmlWebpackPlugin = require("html-webpack-plugin");

        return this.toCompile.map(({ entry, output, options }) => new HtmlWebpackPlugin({
            filename: output.path(),
            template: entry.path(),
            minify:   global.Config.production,
            ...options,
        }));
    }

    // eslint-disable-next-line class-methods-use-this
    normalizeOutput(output, fallbackName) {
        if (output.isDirectory()) {
            output = new File(path.join(output.filePath, fallbackName));
        }

        return output;
    }
}

mix.extend("ejs", new Ejs());
