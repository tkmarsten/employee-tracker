const inquirer = require('inquirer')

function userPrompt() {
  inquirer.prompt([
    {
      type: 'list',
      message: 'Select an option',
      choices: ['View all departments', 'View all roles', 'View all employees', 'Add department', 'Add role', 'Add employee', 'Update employee role'],
      name: 'options'
    }
  ])
    .then(answers => {
      return
    })
}

userPrompt()