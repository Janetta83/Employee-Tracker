//Dependencies
const inquirer = require('inquirer');
const db = require('./db/connection.js');
const consoleTable = require('console.table');
const confirm = require('inquirer-confirm');
const { endianness } = require('os');

//MySQL Connection
db.connect(function (error) {
    if (error) throw error;
    console.log("Welcome to Employee Manager");

    //db query for roles
    db.query("SELECT * from role", function (error, res) {
        roles = res.map(role => ({
            name: role.title,
            value: role.id 
        }))
    })

    //db query for departments
    db.query("SELECT * from department", function (error, res) {
        departments = res.map(dep => ({
            name: dep.name,
            value: dep.id 
        }))
    })

    //db query for employees
    db.query("SELECT * from employee", function (error, res) {
        employees = res.map(emp => ({
            name: '${emp.first_name} ${emp.last_name}',
            value: emp.id 
        }))
    })
    initialPrompt();
});

//Initial Prompt function
function initialPrompt() {
    inquirer.prompt({
        type: "list",
        message: "What would you like to do?",
        name: "choices",
        choices: [{
            name: "View All Departments",
            value: "viewAllDepartments"
        },
        {
            name: "View All Roles",
            value: "viewAllRoles",
        },
        {
            name: "View All Employees",
            value: "viewAllEmployees"
        },
        {
           name: "Add A Department",
           value: "addADepartment" 
        },
        {
            name: "Add A Role",
            value: "addARole"
        },
        {
            name: "Add An Employee",
            value: "addAnEmployee"
        },
        {
            name: "Update An Employee Role",
            value: "updateEmployeeRole"
        },
        {
            name: "End",
            value: "end"
        }
    ]
    }).then(function (res) {
        mainMenu(res.choices)
    });
};

//Main Menu Function
function mainMenu(options) {
    switch (options) {
        case "viewAllDepartments":
            viewAllDepartments();
            break;
        case "viewAllRoles":
            viewAllRoles();
            break;
        case "viewAllEmployees":
            viewAllEmployees();
            break;
        case "addADepartment":
            addADepartment();
            break;
        case "addARole":
            addARole();
            break;
        case "addAnEmployee":
            addAnEmployee();
            break;
        case "updateEmployeeRole":
            updateEmployeeRole();
            break;
        case "end":
            end();    
    };
};

//Function for View All Departments
function viewAllDepartments() {
    db.query("SELECT * FROM department", function (error, res) {
        console.table(res);
        endOrMain();
    });
};

//View All Roles Function
function viewAllRoles() {
    db.query("SELECT * FROM role", function (error, res) {
        console.table(res);
        endOrMain();
    });
};

//View All Employees Function
function viewAllEmployees() {
    db.query("SELECT * FROM employee", function (error, res) {
        console.table(res);
        endOrMain();
    });
};

//Add A Department Function
function addADepartment() {
    inquirer.prompt([{
        type: "input",
        message: "What is the new department name?",
        name: "name"
    }])
    .then(function (response) {
        newDepartment(response);
    });
};

function newDepartment(data) {
    db.query("INSERT INTO department SET ?", {
        name: data.name
    },
    function (error, res) {
        if (error) throw error;
    
    });
    endOrMain();
};

//Add A Role Function
function addARole() {
    inquirer.prompt([{
        type: "input",
        message: "What is the title of the new role?",
        name: "title"
    },
    {
        type: "input",
        message: "What is the salary for the new role?",
        name: "salary"
    },
    {
        type: "list",
        message: "What department is the new role in?",
        name: "id",
        choices: departments
    }
    ])
    .then(function (response) {
        addNewRole(response);
    });
};

function addNewRole(data) {
    db.query("INSERT INTO role set ?", {
        title: data.title,
        salary: data.salary,
        department_id: data.id
    }, function (error, res) {
        if (error) throw error;
    });
    endOrMain();
};

//Add An Employee Function
function addAnEmployee() {
    inquirer.prompt([{
        type: "input",
        message: "What is the employee's first name?",
        name: "firstName",
    },
    {
        type: "input",
        message: "What is the employee's last name?",
        name: "lastName",
    },
    {
        type: "list",
        message: "What is the employee's title?",
        name: "title",
        choices: roles
    },
    {
        type: "list",
        message: "Who is the employee's manager?",
        name: "manager",
        choices: employees
    }
    ])
    .then(function (response) {
        newEmployee(response);
    });
};

function newEmployee(data) {
    db.query("INSERT INTO employee SET ?", {
        first_name: data.firstName,
        last_name: data.lastName,
        role_id: data.manager 
    }, function (error, res) {
        if (error) throw error;
    });
    endOrMain();
};

//Update Employee Role Function
function updateEmployeeRole() {
    inquirer.prompt([{
        type: "list",
        message: "Which employee is updating their role?",
        name: "employeeID",
        choices: employees
    },
    {
        type: "list",
        message: "What is the employee's new role?",
        name: "titleID",
        choices: roles
    }
  ])
  .then(function (response) {
      updateEmployeeRole(response);
  });
};

function updateEmployeeRole(data) {
    db.query("UPDATE employee SET role_id = ${data.titleID} WHERE id =${data.employeeID}",
    function (error, res) {
        if (error) throw error;
    });
    endOrMain();
};

//End/Back to Main Function
function endOrMain() {
    confirm("Do you wish to continue?")
         .then(function confirm() {
             initialPrompt();
         }, function cancelled() {
             end();
         });
};

function end() {
    console.log("Exiting Employee Manager");
    db.end();
    process.exit();
};

