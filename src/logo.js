const chalk = require('chalk');
const figlet = require('figlet')
const clear = require('clear');

const scriptLogo = () => {
    clear();
    console.log(
      chalk.blue.bold(figlet.textSync('valhalla', { horizontalLayout: 'default', verticalLayout: 'center', font: 'Stick Letters' })) 
    );
};

module.exports = scriptLogo;