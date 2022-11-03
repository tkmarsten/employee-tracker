const mysql = require('mysql2/promise')
const cTable = require('console.table')
const inquirer = require('inquirer')
require('dotenv').config()


async function queryDB() {
  const db = await mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  })

  switch (arguments.length) {
    case 1:
      var [rows] = await db.query(arguments[0])
      return rows
    case 2:
      var [rows] = await db.query(arguments[0], arguments[1])
      return rows
  }
}

async function userPrompt() {
  const answer = await inquirer.prompt(
    {
      type: 'list',
      message: 'Select an option',
      choices: ['View all departments', 'View all roles', 'View all employees', new inquirer.Separator(), 'Add department', 'Add role', 'Add employee',
        new inquirer.Separator(), 'Update employee role', new inquirer.Separator()],
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
      await addDepartment()
      break
    case 'Add role':
      await addRole()
      break
    case 'Add employee':
      await addEmployee()
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

async function addDepartment() {
  const answer = await inquirer.prompt([
    {
      type: 'input',
      message: 'Name of department:',
      name: 'name'
    }
  ])

  await queryDB(`INSERT INTO department (name) VALUES (?)`, [answer.name])
  console.log('Department added')
}

/* ---------- Roles table functions ---------- */
async function displayRoles() {
  const res = await queryDB(`SELECT r.id, r.title, d.name as department, r.salary
                            FROM roles r
                            LEFT JOIN department d ON r.department_id = d.id`)
  console.log(cTable.getTable(res))
}

async function getRoles() {
  let temp = []

  const res = await queryDB(`SELECT title FROM roles`)

  res.forEach(item => {
    temp.push(item.title)
  })

  return temp
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

  const [row] = await queryDB(`SELECT id FROM department WHERE name = ?`, [answers.department])
  await queryDB(`INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`, [answers.name, answers.salary, row.id])

  console.log('Added role')
}

/* ---------- Employee table functions ---------- */
async function displayEmployees() {
  const res = await queryDB(`SELECT e.id, e.first_name, e.last_name, r.title, d.name as department, r.salary, concat(m.first_name, ' ', m.last_name) as manager
                            FROM employee e
                            LEFT JOIN roles r ON e.role_id = r.id
                            LEFT JOIN department d ON r.department_id = d.id
                            LEFT JOIN employee m ON e.manager_id = e.id`)
  console.log(cTable.getTable(res))
}

async function getManagers() {
  const [row] = await queryDB(`SELECT id FROM employee WHERE manager_id IS NOT NULL`)
  const res = await queryDB(`SELECT first_name, last_name FROM employee WHERE id = ?`, [row.id])

  let temp = []

  res.forEach(item => {
    temp.push(item.first_name + ' ' + item.last_name)
  })

  return temp
}

async function addEmployee() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      message: 'First name of employee:',
      name: 'firstName'
    },
    {
      type: 'input',
      message: 'Last name of employee:',
      name: 'lastName'
    },
    {
      type: 'list',
      message: 'Select role of new employee',
      choices: await getRoles(),
      name: 'role'
    },
    {
      type: 'list',
      message: 'Select manager of employee if applicable',
      choices: await getManagers(),
      name: 'manager'
    }
  ])

  const [roleID] = await queryDB(`SELECT id FROM roles WHERE title = ?`, [answers.role])
  const [managerID] = await queryDB(`SELECT id FROM employee WHERE first_name = ?`, [answers.manager.split(' ')[0]])
  await queryDB(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [answers.firstName, answers.lastName, roleID.id, managerID.id])
}