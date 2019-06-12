const chalk = require("chalk");
const figlet = require("figlet")
const clear = require("clear");

import chalk from "chalk";
import figlet from "figlet";
import clear from "clear";

export const scriptLogo = () => {
    clear();
    console.log(
      chalk.blue.bold(figlet.textSync("valhalla", { horizontalLayout: "default", verticalLayout: "center", font: "Stick Letters" })) 
    );
};

