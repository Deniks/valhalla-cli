#!/user/bin/env node

const program = require('commander');
const { prompt } = require('inquirer'); 
const { addUser, getUser, loginUser } = require('./logic');

program
  .version('0.0.1')
  .description('Contact managment system');

program
  .command('addUser <username> <password>')
  .alias('a')
  .description('Add a user')
  .action((username, password) => {
    addUser({username, password});
  });

program
  .command('loginUser <username> <password>')
  .alias('-l')
  .description('Login user')
  .action((username, password) => {
      loginUser({username, password});
  })
program
  .command('getUser <username>')
  .alias('r')
  .description('Get user')
  .action(username => getUser(username));

program.parse(process.argv);