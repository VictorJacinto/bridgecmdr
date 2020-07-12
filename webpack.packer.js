const packer = require("./build/webpack-packer");

packer.main.
    js("./main/index.ts").
    output("./dist/main");

packer.render.
    html("./render/index.ejs").
    js("./render/index.ts").
    sass("./render/sass/index.scss").
    output("./dist/render").
    alias("buefy$", "buefy/dist/buefy.esm.js").
    loader("sass", {
        options: {
            prependData: `@import "${__dirname}/render/sass/settings.scss"`,
        },
    }).
    loader("scss", {
        options: {
            prependData: `@import "${__dirname}/render/sass/settings.scss";`,
        },
    });
