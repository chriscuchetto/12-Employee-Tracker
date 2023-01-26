const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");
require("dotenv").config();

const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // MySQL password
    password: process.env.PW,
    database: "employee_db",
  },
  console.log(`Connected to the employee_db database.`)
);


function viewDepartments() {
    db.query("SELECT * FROM department", function (err, results) {
        console.table(results);
    });
}

function viewRoles() {
    db.query("SELECT * FROM role", function (err, results) {
    console.table(results);
  });
}

function viewEmployees() {
    db.query("SELECT * FROM employee", function (err, results) {
      console.table(results);
    });
  }

  function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of department?",
            name: "name",
        },
    ])
    .then((answer) => {

        db.query("INSERT INTO department SET ?", answer, function (err, results) {
            console.table(results);
            console.log("New Department has been added!");
        });
    });
  }
  function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of department?",
            name: "name",
        },
    ])
    .then((answer) => {

        db.query("INSERT INTO department SET ?", answer, function (err, results) {
            console.table(results);
            console.log("New Department has been added!");
        });
    });
  }

  function makeAnother() {
inquirer.prompt([
    {
      type: "list",
      message: "What would you like to do?",
      name: "choice",
      choices: [
        { name: "View all departments", value: "VIEW DEPARTMENTS" },
        { name: "View all roles", value: "VIEW ROLES" },
        { name: "View all employees", value: "VIEW EMPLOYEES" },
        { name: "Add a department", value: "ADD DEPARTMENT" },
        { name: "EXIT?", value: "EXIT" },

      ],
    },
  ])
  .then((response) => {
    if (response.choice === "VIEW DEPARTMENTS") {
        viewDepartments();
    }
    if (response.choice === "VIEW ROLES") {
        viewRoles();
      }
    if (response.choice === "VIEW EMPLOYEES") {
        viewEmployees();
      }
    if (response.choice === "ADD DEPARTMENT") {
        addDepartment();
      }
    if (response.choice === "ADD ROLE") {
        addRole();
      }
    if (response.choice === "EXIT") {
        process.exit();
      }  
  });
}
makeAnother();