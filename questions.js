const options = [
    {
      name: 'launcher',
      type: 'list',
      message: 'What do you want? ',
      choices: ["Create a cloud", "Connect to a cloud"],
    }
  ]
  
  const file_list = [
    {
      name: 'files',
      type: 'checkbox',
      choices: (choices) => {
        return choices;
      }
    }
  ]
  
  const cloud_questions = [
      {
          name: 'cloudIp',
          type: 'input',
          message: 'CloudIp: ',
          validate: (value) => {
            if (value.length) {
              return true;
            } else {
              return 'Please enter your CloudIp.';
            }
          }
      },
      {
          name: 'password',
          type: 'password',
          message: 'Password: ',
          validate: (value) => {
            if (value.length) {
              return true;
            } else {
              return 'Please enter your password.';
            }
          }
      }
  ];

module.exports = { options, file_list, cloud_questions };