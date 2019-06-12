#!/user/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const mongoose = require("mongoose");
const program = require("commander");
const { prompt } = require("inquirer");
const inquirer = require("inquirer");
const clear = require("clear");
const winston = require("winston");
const logo_1 = require("./logo");
const config_1 = require("./config");
const cloudController_1 = require("./controllers/cloudController");
const { File } = require("./controllers/fileController");
const { getUser } = require("./controllers/userController");
const { options, file_list, cloud_questions } = require("./questions");
mongoose.Promise = global.Promise;
mongoose.connect(config_1.uri, {
    useNewUrlParser: true
});
const db = mongoose.connection;
db.once("opne", () => console.info("Connected to mongodb"));
db.on("error", (err) => {
    console.log(`An error occured ==> ${err}`);
});
const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    defaultMeta: { service: "user-service" },
    transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log` 
        // - Write all logs error (and below) to `error.log`.
        //
        new winston.transports.File({ filename: "error.log", level: "error" }),
        new winston.transports.File({ filename: "combined.log" })
    ]
});
if (process.env.NODE_ENV !== "production") {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}
program
    .version("0.0.1")
    .description("Contact managment system")
    .option("-u, .--upload", "Upload file")
    .option("-d, --download", "Download file")
    .option("-p, --pull", "Pull the file from directory or cloud")
    .option("-w, --wizard", "To activate interactive cli")
    .parse(process.argv);
console.log(process.argv.length);
if (process.argv.length < 3) {
    logo_1.scriptLogo();
    program.help();
}
program
    .command("--wizard")
    .alias("w")
    .description("Interactive wizard")
    .action(() => {
    console.log("wizard");
    logo_1.scriptLogo();
    prompt(options).then((answers) => {
        const { launcher } = answers;
        if (launcher == "Create a cloud") {
            prompt(cloud_questions).then(answers => {
                cloudController_1.createCloud(answers);
                console.log(cloudController_1.createCloud(answers));
                logo_1.scriptLogo();
            });
        }
        else if (launcher == "Connect to a cloud") {
            prompt(cloud_questions).then(answers => {
                cloudController_1.connectToCloud(answers);
            });
        }
    });
});
program
    .command("create")
    .alias("c")
    .description("Create your own cloud")
    .action(() => {
    logo_1.scriptLogo();
    prompt(cloud_questions).then(answers => cloudController_1.createCloud(answers));
});
program
    .command("connectToCloud")
    .alias("con")
    .description("Connect to a friends cloud")
    .action(() => {
    logo_1.scriptLogo();
    prompt(cloud_questions)
        .then(answers => cloudController_1.connectToCloud(answers))
        .then((res) => {
        console.log(res.files);
        let fq = file_list(res.files);
        console.log(fq);
        prompt(file_list(["5cae3c12eb10f310e4a25b44", "5cae3c73f1b8e812142aa8e5", "5cae3c8ec12a5a12226f22d9", "5cae3c952273b9122d24debf"]));
    })
        .then(answers => console.info(answers));
});
program
    .command("stream <filepath>")
    .alias("s")
    .description("Interact with the cloud by uploading or downloading file")
    .action((filePath) => {
    logo_1.scriptLogo();
    prompt(cloud_questions)
        .then(answers => cloudController_1.connectToCloud(answers))
        .then((cloud) => {
        const { upload, pull } = program;
        return upload ?
            new File(cloud._id, filePath).upload(pull ? true : false)
            : new File(cloud._id, filePath).download(pull ? true : false);
    })
        .catch((err) => console.log("caught", err));
});
program
    .command("getUser <username>")
    .alias("r")
    .description("Get user")
    .action((username) => getUser(username));
program.parse(process.argv);
//# sourceMappingURL=valhalla.js.map