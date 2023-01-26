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
    db.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;", 
    function (err, results) {
      console.table(results);
    });
  }

  function addDepartment() {
    inquirer.prompt([
        {
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
  function addRole() {
    
    db.query("SELECT * FROM department", function (err, results) 
    { const departments = results.map(department => ({name: department.name, value: department.id}));
    
    inquirer.prompt([
        {
            message: "What is the name?",
            name: "title",
        },
        {
            message: "What is the salary?",
            name: "salary",
        },
        {
            type: "list",
            message: "What department does the role belong to?",
            name: "department_id",
            choices: departments,
        },
    ])
    .then((answer) => {

        db.query("INSERT INTO role SET ?", answer, function (err, results) {
            console.table(results);
            console.log("New Role has been added!");
        });
    });
});
  }
  function addEmployee() {
    db.query("SELECT * FROM role", function (err, results) {
      const roles = results.map((role) => ({ name: role.title, value: role.id }));
      db.query("SELECT * FROM employee", function (err, results) {
        const managers = results.map((manager) => ({ name: manager.last_name, value: manager.id }));
        inquirer
          .prompt([
            {
              message: "What is the employee's first name?",
              name: "first_name",
            },
            {
              message: "What is the employee's last name?",
              name: "last_name",
            },
            {
              type: "list",
              message: "What is the employees role?",
              name: "role_id",
              choices: roles,
            },
            {
              type: "list",
              message: "Who is their manager?",
              name: "manager_id",
              choices: managers,
            },
          ])
          .then((answer) => {
            db.query("INSERT INTO employee SET ?", answer, function (err, results) {
              console.table(results);
              console.log("Employee successfully added");
            });
          });
      });
    });
  }
  function updateEmployee() {
    db.query("SELECT * FROM employee", function (err, results) {
        const employees = results.map((employee) => ({ name: employee.first_name + " " + employee.last_name}));
    })
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
        { name: "Add a role", value: "ADD ROLE" },
        { name: "Add a employee", value: "ADD EMPLOYEE" },
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
    if (response.choice === "ADD EMPLOYEE") {
        addEmployee();
      }
    if (response.choice === "EXIT") {
        process.exit();
      }  
  });
}
makeAnother();