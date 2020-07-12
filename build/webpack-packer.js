
/*
 * =====================================================================================================================
 * Common modules.
 */
const _             = require("lodash");
const path          = require("path");
const readJson      = require("read-package-json");
const nodeExternals = require("webpack-node-externals");

/*
 * =====================================================================================================================
 * Plug-ins
 */
const CopyPlugin                  = require("copy-webpack-plugin");
const MiniCssExtractPlugin        = require("mini-css-extract-plugin");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const HtmlWebpackPlugin           = require("html-webpack-plugin");
const VueLoaderPlugin             = require("vue-loader/lib/plugin");

/*
 * =====================================================================================================================
 * Specials
 */

const isProd = process.env.NODE_ENV === "production";
const isDev  = process.env.NODE_ENV === "development";
if (!isProd && !isDev) {
    throw new Error('NODE_ENV must be set to "production" or "development"');
}

/*
 * =====================================================================================================================
 * Utilities
 */

// TODO: Resolve the packer configuration rather than hard-code it.
const packerConfigPath = "..";

/** @type {string} */
let productName;

/** @type {Promise<Array>} */
const allReady = Promise.all([
    new Promise((resolve, reject) =>
        readJson(path.resolve(__dirname, packerConfigPath, "package.json"), console.error, true,
            function cb_(error, data) {
                if (error) {
                    reject(error);

                    return;
                }

                productName = data["productName"];
                resolve(productName);
            })),
]);

/*
 * =====================================================================================================================
 * Packer private field symbols
 */
const myRules   = Symbol("[[Rules]]");
const myLoaders = Symbol("[[Loaders]]");
const myOutdir  = Symbol("[[Output Directory]]");
const myHtml    = Symbol("[[HTML Template]]");
const myEntry   = Symbol("[[Entry Point]]");
const myAssets  = Symbol("[[Raw Assets]]");
const myStyles  = Symbol("[[Main Style Sheet]]");
const mySass    = Symbol("[[Main SCSS Style Sheet]]");
const myPlugins = Symbol("[[Extra Plugins]]");
const myExtras  = Symbol("[[Extra configuration]]");
const myAliases = Symbol("[[Aliases]]");

/*
 * =====================================================================================================================
 * Packer private method symbols
 */
const GenerateEntry   = Symbol("Generate Entry-Point");
const GeneratePlugins = Symbol("Generate Plug-in List");

class Packer {
    constructor() {
        /** @type {{[string]: RuleSetUseItem}} Common configuration */
        const loaders = {
            esLint: {
                loader:  "eslint-loader",
                options: {
                    formatter: "unix",
                },
            },
            ts: {
                loader:  "ts-loader",
                options: {
                    appendTsSuffixTo: [(/\.vue$/u)],
                    errorFormatter:   (error, colors) => {
                        const isVue = error.file.endsWith(".vue.ts");
                        const color = error.severity === "warning" ? colors.bold.yellow : colors.bold.red;
                        const file = isVue ? error.file.slice(0, -3) : error.file;
                        const character = isVue ? error.character + 4 : error.character;

                        return color(`${file}:${error.line}:${character}: ${error.content} [TS${error.code}]`);
                    },

                },
            },
            babel: {
                loader:  "babel-loader",
                options: {
                    presets: ["@vue/babel-preset-jsx"]
                },
            },
            vue: {
                loader:  "vue-loader",
                options: {
                    optimizeSSR: false,
                },
            },
            style: {
                loader:  MiniCssExtractPlugin.loader,
                options: {
                    // None specified...
                },
            },
            css: {
                loader:  "css-loader",
                options: {
                    // None specified...
                },
            },
            resolveUrl: {
                loader:  "resolve-url-loader",
                options: {
                    keepQuery: true,
                },
            },
            sass: {
                loader:  "sass-loader",
                options: {
                    sourceMap:      true,
                    implementation: require("sass"),
                    sassOptions:    {
                        fiber: require("fibers"),
                    },
                },
            },
            scss: {
                loader:  "sass-loader",
                options: {
                    sourceMap:      true,
                    implementation: require("sass"),
                    sassOptions:    {
                        fiber: require("fibers"),
                    },
                },
            },
            file: {
                loader:  "file-loader",
                options: {
                    name: "assets/[contenthash].[ext]",
                },
            },
        };

        /** @type {{[string]: RuleSetRule}} Common rules */
        const rules = {
            lint: {
                enforce: "pre",
                test:    (/\.(js|jsx|ts|tsx|vue)$/u),
                exclude: (/node_modules/u),
                use:     [loaders.esLint],
            },
            ts: {
                test:    (/\.ts$/u),
                exclude: (/node_modules/u),
                use:     [loaders.ts],
            },
            tsx: {
                test:    (/\.tsx$/u),
                exclude: (/node_modules/u),
                use:     [loaders.babel, loaders.ts],
            },
            css: {
                test: (/\.css$/u),
                use:  [
                    loaders.style,
                    loaders.css,
                ],
            },
            sass: {
                test: (/\.sass$/u),
                use:  [
                    loaders.style,
                    loaders.css,
                    loaders.resolveUrl,
                    loaders.sass,
                ],
            },
            scss: {
                test: (/\.scss$/u),
                use:  [
                    loaders.style,
                    loaders.css,
                    loaders.resolveUrl,
                    loaders.scss,
                ],
            },
            vue: {
                test: (/\.vue$/u),
                use:  [loaders.vue],
            },
            images: {
                test: (/\.(png|svg|jpg|gif)$/u),
                use:  [loaders.file],
            },
            fonts: {
                test: (/\.(woff|woff2|eot|ttf|otf)$/u),
                use:  [loaders.file],
            },
        };

        /** @type {{[string]: RuleSetUse}} */
        this[myLoaders] = loaders;
        /** @type {{[string]: RuleSetRule}} */
        this[myRules] = rules;
        /** @type {string} */
        this[myOutdir] = "";
        /** @type {string} */
        this[myHtml] = "";
        /** @type {string} */
        this[myEntry] = "";
        /** @type {string} */
        this[myStyles] = "";
        /** @type {string} */
        this[mySass] = "";
        /** @type {string} */
        this[myAssets] = {};
        /** @type {(WebpackPluginInstance | WebpackPluginFunction)[]} */
        this[myPlugins] = [];
        /** @type {Partial<WebpackOptions>} */
        this[myExtras] = {};
        /** @type {Record<string, string>} */
        this[myAliases] = {"vue$": "vue/dist/vue.esm.js"};
    }

    /**
     * @param {string} out
     * @returns {Packer}
     */
    output(out) {
        this[myOutdir] = path.resolve(__dirname, packerConfigPath, out);

        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {string} main
     * @returns {Packer}
     */
    html(main) {
        this[myHtml] = path.resolve(__dirname, packerConfigPath, main);

        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {string} main
     * @returns {Packer}
     */
    js(main) {
        this[myEntry]  = path.resolve(__dirname, packerConfigPath, main);

        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {string} main
     * @returns {Packer}
     */
    css(main) {
        this[myStyles] = path.resolve(__dirname, packerConfigPath, main);

        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {string} main
     * @returns {Packer}
     */
    sass(main) {
        this[mySass] = path.resolve(__dirname, packerConfigPath, main);

        return this;
    }

    /**
     * @param {string} pattern
     * @param {string} path
     * @returns {Packer}
     */
    alias(pattern, path) {
        this[myAliases][pattern] = path;

        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {string} source
     * @param {string} dest
     * @returns {Packer}
     */
    assets(source, dest) {
        this[myAssets] = {
            [dest]: path.resolve(__dirname, packerConfigPath, source),
        };

        return this;
    }

    /**
     * @param {WebpackPluginInstance | WebpackPluginFunction} plugin
     * @returns {Packer}
     */
    plugin(plugin) {
        this[myPlugins].push(plugin);

        return this;
    }

    /**
     * @param {Partial<WebpackOptions>} more
     * @returns {Packer}
     */
    merge(more) {
        this[myExtras] = more;

        return this;
    }

    /**
     * @param {string}                          name
     * @param {Extract<RuleSetUseItem, Object>} changes
     * @returns {Packer}
     */
    loader(name, changes) {
        if (_.isObject(changes)) {
            const loader = this[myLoaders][name];
            if (loader) {
                this[myLoaders][name] = _.merge(loader, changes);
            } else {
                throw new ReferenceError("`name` does references a known built-in loader");
            }
        } else {
            throw new TypeError("`changes` must be a single `RuleSetUseItem` object");
        }

        return this;
    }

    /**
     * @param {string}      name
     * @param {RuleSetRule} changes
     * @returns {Packer}
     */
    rule(name, changes) {
        if (_.isObject(changes)) {
            const rule = this[myRules][name];
            if (rule) {
                this[myRules][name] = _.merge(rule, changes);
            } else {
                this[myRules][name] = rule;
            }
        } else {
            throw new TypeError("`changes` must be a single `RuleSetRule` object");
        }

        return this;
    }

    /**
     * @returns {EntryStatic}
     */
    [GenerateEntry]() {
        const entries = [String(this[myEntry])];

        const styles = String(this[myStyles]);
        if (styles.length > 0) {
            entries.push(styles);
        }

        const sass = String(this[mySass]);
        if (sass.length > 0) {
            entries.push(sass);
        }

        return { "index": entries };
    }

    /**
     * @returns {(WebpackPluginInstance|WebpackPluginFunction)[]}
     */
    [GeneratePlugins]() {
        const plugins = this[myPlugins].concat([
            new FriendlyErrorsWebpackPlugin(),
            new MiniCssExtractPlugin({
                filename:      "[name].css",
                chunkFilename: "[id].css",
            }),
            new VueLoaderPlugin({
                productionMode: process.env.NODE_ENV === "production",
            }),
        ]);

        const outdir = String(this[myOutdir]);

        const html = String(this[myHtml]);
        if (html.length > 0) {
            plugins.push(new HtmlWebpackPlugin({
                filename: path.resolve(packerConfigPath, outdir, "index.html"),
                template: path.resolve(packerConfigPath, html),
                minify:   isProd,
            }));
        }

        const assets = this[myAssets];
        if (!_.isEmpty(assets)) {
            plugins.push(new CopyPlugin(
                _.map(assets, (src, dest) => ({ from: src, to: path.resolve(packerConfigPath, outdir, dest) })),
            ));
        }

        return plugins;
    }

    // TODO: Set `.context` and `.stats.context` options.

    /**
     * @param {Object.<string, string>} env
     * @param {string}                  target
     * @return {Promise<WebpackOptions>}
     */
    generate(target) {
        return allReady.then(() => _.merge({
            mode:   process.env.NODE_ENV,
            target: target,
            stats:  {
                builtAt:      false,  // Don't need to show when it was built.
                children:     false,  // Don't need to see all the children.
                chunks:       false,  // Don't really need to show the chunks.
                entrypoints:  false,  // Don't really need to show the entry-points.
                errors:       false,  // Don't display error details, there is a plug-in for that.
                errorDetails: false,  // Don't display error details, there is a plug-in for that.
                hash:         false,  // Don't really need to show the hash.
                modules:      false,  // Don't need to show the modules.
                performance:  isProd, // Base performance reporting on target environment.
                publicPath:   false,  // Don't really need to show the public path.
                reasons:      false,  // Don't need to know why modules are included.
                source:       false,  // Don't really need to show the source code.
                timings:      false,  // Don't really need to show the timing information.
                version:      false,  // Don't really need to show the version information.
            },
            performance: {
                hints: false,
            },
            externals: [
                nodeExternals({
                    modulesFromFile: {
                    // Anything in development dependencies are expected to be packed or used for packing.
                        exclude: ["devDependencies"],
                        // Anything in standard dependencies are expected not be packed for any number of reasons.
                        include: ["dependencies"],
                    },
                }),
            ],
            entry:  this[GenerateEntry](),
            output: {
                path:     String(this[myOutdir]),
                filename: "index.js",
            },
            devtool: isDev ? "source-map" : undefined,
            module:  {
                rules: [
                    this[myRules].lint,
                    this[myRules].tsx,
                    this[myRules].ts,
                    this[myRules].css,
                    this[myRules].sass,
                    this[myRules].scss,
                    this[myRules].vue,
                    this[myRules].images,
                    this[myRules].fonts,
                ],
            },
            plugins: this[GeneratePlugins](),
            resolve: {
                extensions: [ ".wasm", ".mjs", ".js", ".jsx", ".ts", ".tsx", ".json", ".vue" ],
                alias:      this[myAliases],
            },
        }, this[myExtras]));
    }
}

Packer.main   = new Packer();
Packer.render = new Packer();

module.exports = Packer;
