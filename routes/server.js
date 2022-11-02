const express = require('express')
const mysql = require('mysql2')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const db = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
},
  console.log('Connected to database')
)

app.get('/api/employees', (req, res) => {
  db.query(`SELECT * FROM employee`, function (err, results) {
    res.json(results)
  })
})

app.listen(PORT, () => console.log(`Now listening on ${PORT}`))