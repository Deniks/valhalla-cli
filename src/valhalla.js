#!/user/bin/env node
'use strict';

require('dotenv').config();

const mongoose = require('mongoose');
const program = require('commander');
const { prompt } = require('inquirer'); 
const inquirer = require('inquirer'); 
const clear = require('clear');
const scriptLogo = require('./logo');

const { createCloud, connectToCloud } = require('./controllers/cloudController');
const { File } = require('./controllers/fileController');
const { getUser } = require('./controllers/userController');

const { options, file_list, cloud_questions } = require('./questions');


mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI,  { 
  useNewUrlParser: true 
  }
);
let db = mongoose.connection;

db.once('opne', () => console.info('Connected to mongodb'))

db.on('error', (err) => {
  console.log(`An error occured ==> ${err}`);
})



program
  .version('0.0.1')
  .description('Contact managment system')
  .option('-u, .--upload', 'Upload file')
  .option('-d, --download', 'Download file')
  .option('-p, --pull', 'Pull the file from directory or cloud')
  .option('--wizard', 'To activate interactive cli')
  .parse(process.argv);

console.log(process.argv.length)
if (process.argv.length < 3) {
  scriptLogo();
  program.help();
}
program
  .command('--wizard')
  .description('Interactive wizard')
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
      .then((res) => {
        console.log(res.files); 
        let fq =  file_list(res.files);
        console.log(fq)
        prompt(file_list(["5cae3c12eb10f310e4a25b44","5cae3c73f1b8e812142aa8e5","5cae3c8ec12a5a12226f22d9","5cae3c952273b9122d24debf"]))
      })
      .then(answers => console.info(answers))
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
