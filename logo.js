const chalk = require('chalk');
const figlet = require('figlet')
const clear = require('clear');

const scriptLogo = () => {
    clear();
    console.log(
      chalk.blue.bold(figlet.textSync('Heaven', { horizontalLayout: 'universal smushing', verticalLayout: 'default', }))
       + 
      chalk.red(figlet.textSync('Notes', { horizontalLayout: 'universal smushing' }))
    );
};

module.exports = scriptLogo;