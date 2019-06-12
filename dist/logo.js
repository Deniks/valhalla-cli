"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const figlet = require("figlet");
const clear = require("clear");
exports.scriptLogo = () => {
    clear();
    console.log(chalk.blue.bold(figlet.textSync("valhalla", { horizontalLayout: "default", verticalLayout: "center", font: "Stick Letters" })));
};
//# sourceMappingURL=logo.js.map