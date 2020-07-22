const mysql = require("mysql");
const inquirer = require("inquirer");

const ctable = require('console.table');

const queryAll1 = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department, role.salary
FROM ((employee
INNER JOIN role ON employee.role_id = role.id)
INNER JOIN department ON role.department_id = department.id);`

const queryAll2 = `SELECT
e.id,
CONCAT (m.first_name, ' ', m.last_name) manager
FROM
employee e
LEFT JOIN employee m ON m.id = e.manager_id;`

const queryRoles = `SELECT role.title, department.department, role.salary
FROM (role
INNER JOIN department ON role.department_id = department.id);`

const queryDepartments = `SELECT department FROM department;`

const connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "password",
    database: "employees_db"
});

connection.connect(function (err) {
    if (err) throw err;
});


function viewAllEmployees() {
    const employeeList = [];
    const employeeManager = [];
    connection.query(queryAll1, function (err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            employeeList.push(res[i])
        }
    });
    connection.query(queryAll2, function (err, res) {
        if (err) throw err;
        for (let j = 0; j < res.length; j++) {
            employeeManager.push(res[j])
        }

        for (let k = 0; k < employeeList.length; k++) {
            for (let l = 0; l < employeeManager.length; l++) {
                if (employeeList[k].id === employeeManager[l].id) {
                    employeeList[k].manager = employeeManager[l].manager
                }
            }
        }
        console.log('\n')
        console.table(employeeList)
        run();
    })
}

function viewRoles() {
    connection.query(queryRoles, function (err, res) {
        if (err) throw err;
        console.log('\n');
        console.table(res);
        run();

    });
}

function viewDeparment() {
    connection.query(queryDepartments, function (err, res) {
        if (err) throw err;
        console.log('\n');
        console.table(res);
        run();

    });

}

function newDepartment(department) {
    connection.query(`INSERT INTO department (department)
    VALUES ("${department}");`, function (err, res) {
        if (err) throw err;    
    });
    console.log("\nNew department added!\n");
    run();
}

function newRole(title, salary, department_id) {
    connection.query(`INSERT INTO role (title, salary, department_id)
    VALUES ("${title}", ${salary}, ${department_id});`, function (err, res) {
        if (err) throw err;
    });
    console.log("\nNew role added!\n");
    run();
}

function newEmployee(first_name, last_name, role_id, manager_id) {
    connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES ("${first_name}", "${last_name}", ${role_id}, ${manager_id});`, function (err, res) {
        if (err) throw err;
    });
    console.log("\nNew employee added!\n");
    run();
}


function run() {
    inquirer.prompt([
        {
            type: "list",
            name: "startPoint",
            message: "What would you like to do?",
            choices: [
                "View employees",
                "View roles",
                "View departments",
                "Add employees",
                "Add roles",
                "Add departments",
                "Update employee roles"
            ]
        }

    ]).then(data => {
        if (data.startPoint === "View employees") {
            viewAllEmployees()
        }
        else if (data.startPoint === "View roles") {
            viewRoles()
        }
        else if (data.startPoint === "View departments") {
            viewDeparment()
        }
        else if (data.startPoint === "Add departments") {
            inquirer.prompt([
                {
                    type: "input",
                    name: "newDepartment",
                    message: "What is the name of the new department?"
                }

            ]).then(data => {
                newDepartment(data.newDepartment);
                viewDeparment();
            })
        }
        else if (data.startPoint === "Add roles") {
            let choices = [];
            connection.query(queryDepartments, function (err, res) {
                if (err) throw err;
                for (let i = 0; i < res.length; i++) {
                    choices.push(res[i].department)
                }
            });

            inquirer.prompt([
                {
                    type: "input",
                    name: "newRoleName",
                    message: "What is the name of the new role?"
                },
                {
                    type: "input",
                    name: "newRoleSalary",
                    message: "What is the salary of the new role?"
                },
                {
                    type: "list",
                    name: "newRoleDepartment",
                    message: "Which department does the new role belong to?",
                    choices: choices

                }
            ]).then(data => {
                let newRoleDepartment = "";
                connection.query(`SELECT id FROM department WHERE department='${data.newRoleDepartment}';`, function (err, res) {
                    if (err) throw err;
                    newRoleDepartment = res[0].id;
                    newRole(data.newRoleName, data.newRoleSalary, newRoleDepartment);
                })
            })
        }
        else if (data.startPoint === "Add employees") {
            let choicesRole = [];
            connection.query(queryRoles, function (err, res) {
                if (err) throw err;
                for (let i = 0; i < res.length; i++) {
                    choicesRole.push(res[i].title)
                }
            });
            let choicesManager = [];
            connection.query("SELECT CONCAT (first_name, ' ', last_name) FROM employee", function (err, res) {
                if (err) throw err;
                for (let i = 0; i < res.length; i++) {
                    choicesManager.push(res[i]["CONCAT (first_name, ' ', last_name)"]);
                }
                choicesManager.push("None")
            });

            inquirer.prompt([
                {
                    type: "input",
                    name: "newEmployeeFirstName",
                    message: "What is the first name of the new employee?"
                },
                {
                    type: "input",
                    name: "newEmployeeLastName",
                    message: "What is the last name of the new employee?"
                },
                {
                    type: "list",
                    name: "newEmployeeRole",
                    message: "What is the role of the new employee?",
                    choices: choicesRole

                },
                {
                    type: "list",
                    name: "newEmployeeManager",
                    message: "Who is the manager of the new employee?",
                    choices: choicesManager

                }
            ]).then(data => {
                if (data.newEmployeeManager === "None") {
                    let newEmployeeRole = "";
                    connection.query(`SELECT id FROM role WHERE title='${data.newEmployeeRole}';`, function (err, res) {
                        if (err) throw err;
                        newEmployeeRole = res[0].id;
                        newEmployee(data.newEmployeeFirstName, data.newEmployeeLastName, newEmployeeRole, 0);
                    })
  
                }
                else {
                    let newEmployeeRole = "";
                    connection.query(`SELECT id FROM role WHERE title='${data.newEmployeeRole}';`, function (err, res) {
                        if (err) throw err;
                        newEmployeeRole = res[0].id;
                    })

                    let newEmployeeManager = "";

                    connection.query(`SELECT id FROM employee WHERE CONCAT (first_name, ' ', last_name)='${data.newEmployeeManager}';`, function (err, res) {
                        if (err) throw err;
                        newEmployeeManager = res[0].id;
                        newEmployee(data.newEmployeeFirstName, data.newEmployeeLastName, newEmployeeRole, newEmployeeManager);
                    })
                }
            })
        }
        // end of.then
    })
    // end of run
}
run();
