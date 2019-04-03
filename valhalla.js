#!/user/bin/env node
'use strict';

require('dotenv').config();


const program = require('commander');
const { prompt } = require('inquirer'); 
const inquirer = require('inquirer'); 
const clear = require('clear');
const scriptLogo = require('./logo');

const { createCloud, connectToCloud, File, getUser } = require('./logic');
const { options, file_list, cloud_questions } = require('./questions');



program
  .version('0.0.1')
  .description('Contact managment system')
  .option('-u, --upload', 'Upload file')
  .option('-d, --download', 'Download file')
  .option('-p, --pull', 'Pull the file from directory or cloud')
  .parse(process.argv);

program
  .command('launch')
  .alias('l')
  .description('Launch the script')
  .action(() => {
    scriptLogo();
    prompt(options).then(answers => {
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
  })




  
program
  .command('create')
  .alias('c')
  .description('Create your own cloud')
  .action(() => {
    scriptLogo();
    prompt(cloud_questions).then(answers =>
      createCloud(answers))
  });

program
  .command('connectToCloud')
  .alias('con')
  .description('Connect to a friends cloud')
  .action(() => {
    scriptLogo();
    prompt(cloud_questions)
      .then(answers => connectToCloud(answers))
      .then(() => prompt(file_list)
      .then(answers => console.info(answers)))
  });

program
  .command('stream <filepath>')
  .alias('s')
  .description('Interact with the cloud by uploading or downloading file')
  .action((filePath) => {
    scriptLogo();
    prompt(cloud_questions)
      .then(answers => connectToCloud(answers))
      .then(cloud => {
        const { upload, pull } = program;
        return upload ? 
          new File(cloud._id, filePath).upload(pull ? true : false)
          : new File(cloud._id, filePath).download(pull ? true : false)
      })
      .catch(err => console.log('caught', err))
});

program
  .command('getUser <username>')
  .alias('r')
  .description('Get user')
  .action(username => getUser(username));

program.parse(process.argv);