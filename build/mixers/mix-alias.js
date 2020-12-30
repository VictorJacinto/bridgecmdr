const mix = require("laravel-mix");

class Alias {
    constructor() {
        this.aliases = {};
    }

    // eslint-disable-next-line class-methods-use-this
    name() {
        return ["alias"];
    }

    register(alias, path = null) {
        if (path !== null) {
            alias = { [alias]: path };
        }

        this.aliases = Object.assign(this.aliases, alias);
    }

    webpackConfig(config) {
        config.resolve.alias = Object.assign(config.resolve.alias || {}, this.aliases);
    }
}

mix.extend("alias", new Alias());
