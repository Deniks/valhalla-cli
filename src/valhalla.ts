#!/user/bin/env node
"use strict";

require("dotenv").config();

const mongoose = require("mongoose");
const program = require("commander");
const { prompt } = require("inquirer");
const inquirer = require("inquirer"); 
const clear = require("clear");
const winston = require("winston");

import { scriptLogo } from "./logo";
import { uri } from "./config";
import { createCloud, connectToCloud } from "./controllers/cloudController";
const { File } = require("./controllers/fileController");
const { getUser } = require("./controllers/userController");

const { options, file_list, cloud_questions } = require("./questions");


mongoose.Promise = global.Promise;


mongoose.connect(uri, {
  useNewUrlParser: true
  }
);
const db = mongoose.connection;

db.once("opne", () => console.info("Connected to mongodb"))

db.on("error", (err : any) => {
  console.log(`An error occured ==> ${err}`);
})

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

console.log(process.argv.length)
if (process.argv.length < 3) {
  scriptLogo();
  program.help();
}
program
  .command("--wizard")
  .alias("w")
  .description("Interactive wizard")
  .action(() => {
    console.log("wizard");
    scriptLogo();
    prompt(options).then((answers) => {
      const { launcher } = answers
      if (launcher == "Create a cloud") {
        prompt(cloud_questions).then(answers => {
          createCloud(answers)
          console.log(createCloud(answers));
          scriptLogo();
        })

      } else if (launcher== "Connect to a cloud") {
        prompt(cloud_questions).then(answers => {
          connectToCloud(answers);
        })
      }
    });
  });




  
program
  .command("create")
  .alias("c")
  .description("Create your own cloud")
  .action(() => {
    scriptLogo();
    prompt(cloud_questions).then(answers =>
      createCloud(answers))
  });

program
  .command("connectToCloud")
  .alias("con")
  .description("Connect to a friends cloud")
  .action(() => {
    scriptLogo();
    prompt(cloud_questions)
      .then(answers => connectToCloud(answers))
      .then((res) => {
        console.log(res.files); 
        let fq =  file_list(res.files);
        console.log(fq)
        prompt(file_list(["5cae3c12eb10f310e4a25b44","5cae3c73f1b8e812142aa8e5","5cae3c8ec12a5a12226f22d9","5cae3c952273b9122d24debf"]))
      })
      .then(answers => console.info(answers))
  });

program
  .command("stream <filepath>")
  .alias("s")
  .description("Interact with the cloud by uploading or downloading file")
  .action((filePath: string) => {
    scriptLogo();
    prompt(cloud_questions)
      .then(answers => connectToCloud(answers))
      .then((cloud: object) => {
        const { upload, pull } = program;
        return upload ? 
          new File(cloud._id, filePath).upload(pull ? true : false)
          : new File(cloud._id, filePath).download(pull ? true : false)
      })
      .catch((err: string) => console.log("caught", err));
});

program
  .command("getUser <username>")
  .alias("r")
  .description("Get user")
  .action((username: string) => getUser(username));

program.parse(process.argv);
