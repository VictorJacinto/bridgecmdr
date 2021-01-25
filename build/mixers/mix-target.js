const mix = require("laravel-mix");

class Target {
    constructor() {
        this.target = undefined;
    }

    // eslint-disable-next-line class-methods-use-this
    name() {
        return ["target"];
    }

    register(target = undefined) {
        this.target = target;
    }

    webpackConfig(config) {
        if (this.target) {
            config.target = this.target;
        }
    }
}

mix.extend("target", new Target());
