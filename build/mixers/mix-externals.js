const mix = require("laravel-mix");

function defaultOptions() {
    return {
        // By default, anything in development dependencies are expected to be packed or used for packing.
        exclude: ["devDependencies"],
        // By default, anything in standard dependencies are expected not be packed for any number of reasons.
        include: ["dependencies"],
    };
}

class Externals {
    constructor() {
        this.options = {
            // By default, anything in development dependencies are expected to be packed or used for packing.
            exclude: ["devDependencies"],
            // By default, anything in standard dependencies are expected not be packed for any number of reasons.
            include: ["dependencies"],
        };
    }

    // eslint-disable-next-line class-methods-use-this
    name() {
        return ["externals"];
    }

    // eslint-disable-next-line class-methods-use-this
    dependencies() {
        return ["webpack-node-externals"];
    }

    register(options = defaultOptions()) {
        this.options = options;
    }

    webpackConfig(config) {
        const nodeExternals = require("webpack-node-externals");
        const externals = config.externals || (config.externals = []);
        externals.push(nodeExternals({ modulesFromFile: this.options }));
    }
}

mix.extend("externals", new Externals());
