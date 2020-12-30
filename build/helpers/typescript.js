module.exports = {
    errorFormatter: (error, colors) => {
        const isVue = error.file.endsWith(".vue.ts");
        const color = error.severity === "warning" ? colors.bold.yellow : colors.bold.red;
        const file = isVue ? error.file.slice(0, -3) : error.file;
        const character = isVue ? error.character + 4 : error.character;

        return color(`${file}:${error.line}:${character}: ${error.content} [TS${error.code}]`);
    },
};
