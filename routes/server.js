const mysql = require('mysql2/promise')
const cTable = require('console.table')
const inquirer = require('inquirer')
require('dotenv').config()


async function queryDB(query) {
  const db = await mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  })

  const [rows] = await db.query(query)
  return rows
}

async function userPrompt() {
  const answer = await inquirer.prompt(
    {
      type: 'list',
      message: 'Select an option',
      choices: ['View all departments', 'View all roles', 'View all employees', new inquirer.Separator(), 'Add department', 'Add role', 'Add employee', new inquirer.Separator(), 'Update employee role', new inquirer.Separator()],
      name: 'options'
    })

  switch (answer.options) {
    case 'View all departments':
      await displayDepartments()
      break
    case 'View all roles':
      await displayRoles()
      break
    case 'View all employees':
      await displayEmployees()
      break
    case 'Add department':
      addDepartment()
      break
    case 'Add role':
      await addRole()
      break
    case 'Add employee':
      addEmployee()
      break
    default:
      break
  }

  userPrompt()
}

userPrompt()


/* ---------- Department table functions ---------- */
async function displayDepartments() {
  const res = await queryDB(`SELECT * FROM department`)
  console.log(cTable.getTable(res))
}

async function getDepartments() {
  let temp = []

  const res = await queryDB(`SELECT name FROM department`)

  res.forEach(item => {
    temp.push(item.name)
  })

  return temp
}

/* ---------- Roles table functions ---------- */
async function displayRoles() {
  const res = await queryDB(`SELECT r.id, r.title, d.name as department, r.salary
                            FROM roles r
                            LEFT JOIN department d ON r.department_id = d.id`)
  console.log(cTable.getTable(res))
}

async function addRole() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      message: 'Name of role:',
      name: 'name'
    },
    {
      type: 'input',
      message: 'Salary of role:',
      name: 'salary'
    },
    {
      type: 'list',
      message: 'Select department of new role',
      choices: await getDepartments(),
      name: 'department'
    }
  ])


  // .then(answers => {
  //   db.query(`INSERT INTO department (name) VALUES (?)`, answers.name,
  //     function (err, results) {
  //       console.log('Department added')
  //     })
  // })
}

/* ---------- Employee table functions ---------- */
async function displayEmployees() {
  const res = await queryDB(`SELECT e.id, e.first_name, e.last_name, r.title, d.name as department, r.salary, e.manager_id as manager
                            FROM employee e
                            LEFT JOIN roles r ON e.role_id = r.id
                            LEFT JOIN department d ON r.department_id = d.id`)
  console.log(cTable.getTable(res))
}

// const addDepartment = () => {
//   inquirer.prompt([
//     {
//       type: 'input',
//       message: 'Name of department:',
//       name: 'name'
//     }
//   ])
//     .then(answers => {
//       db.query(`INSERT INTO department (name) VALUES (?)`, answers.name,
//         function (err, results) {
//           console.log('Department added')
//         })
//     })
// }