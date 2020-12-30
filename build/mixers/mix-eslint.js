const mix = require("laravel-mix");

class ESLint {
    constructor() {
        this.options = {};
    }

    // eslint-disable-next-line class-methods-use-this
    name() {
        return ["eslint"];
    }

    // eslint-disable-next-line class-methods-use-this
    dependencies() {
        return ["eslint"];
    }

    register(options = {}) {
        this.options = { ...this.options, ...options };
    }

    webpackPlugins() {
        const ESLintPlugin = require("eslint-webpack-plugin");

        return [new ESLintPlugin(this.options)];
    }
}

mix.extend("eslint", new ESLint());
