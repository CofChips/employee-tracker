const mysql = require("mysql");
const inquirer = require("inquirer");

const ctable = require('console.table');

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

// const for queries
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

const queryAllRole = `SELECT * FROM role;`

const queryDepartments = `SELECT * FROM department;`

// functions 
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
    VALUES (?);`, [department], function (err, res) {
        if (err) throw err;
    });
    console.log("\nNew department added!\n");
    run();
}

function newRole(title, salary, department_id) {
    connection.query(`INSERT INTO role (title, salary, department_id)
    VALUES (?, ?, ?);`, [title, salary, department_id],function (err, res) {
        if (err) throw err;
    });
    console.log("\nNew role added!\n");
    run();
}

function newEmployee(first_name, last_name, role_id, manager_id) {
    connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES (?, ?, ?, ?);`, [first_name, last_name, role_id, manager_id], function (err, res) {
        if (err) throw err;
    });
    console.log("\nNew employee added!\n");
    run();
}

// runs app
function run() {

    let choicesEmployee = [];
    connection.query("SELECT id, CONCAT (first_name, ' ', last_name) FROM employee", function (err, res) {
        if (err) throw err;
        for (let j = 0; j < res.length; j++) {
            choicesEmployee.push({ name: res[j]["CONCAT (first_name, ' ', last_name)"], value: res[j].id });
        }
    });

    let choicesRole = [];
    let choicesAllRole = [];
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            choicesRole.push({ name: res[i].title, value: res[i].id })
            choicesAllRole.push(res[i])
        }
    });

    let choicesDepartment = [];
    connection.query(queryDepartments, function (err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            choicesDepartment.push({ name: res[i].department, value: res[i].id })
        }
    });

    let choicesManager = [];
    connection.query("SELECT id, CONCAT (first_name, ' ', last_name) FROM employee", function (err, res) {
        if (err) throw err;
        for (let j = 0; j < res.length; j++) {
            choicesManager.push({ name: res[j]["CONCAT (first_name, ' ', last_name)"], value: res[j].id });
        }
        choicesManager.push({name: "None", value: null})
    });

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
                "Update employee roles",
                "Update employee manager"
            ]
        }

    ]).then(data => {
        switch (data.startPoint) {
            case "View employees":
                return viewAllEmployees();

            case "View roles":
                return viewRoles();

            case "View departments":
                return viewDeparment();

            case "Add departments":
                inquirer.prompt([
                    {
                        type: "input",
                        name: "newDepartment",
                        message: "What is the name of the new department?",
                        validate: function (value) {
                            if (value) {
                                return true
                            }
                            else {
                                return "Please enter a department name"
                            }
                        }
                    }

                ]).then(data => {
                    newDepartment(data.newDepartment);
                })
                break;

            case "Add roles":
                inquirer.prompt([
                    {
                        type: "input",
                        name: "newRoleName",
                        message: "What is the name of the new role?",
                        validate: function (value) {
                            if (value) {
                                return true
                            }
                            else {
                                return "Please enter a role name"
                            }
                        }
                    },
                    {
                        type: "input",
                        name: "newRoleSalary",
                        message: "What is the salary of the new role?",
                        validate: function (value) {
                            var valid = !isNaN(parseFloat(value));
                            return valid || 'Please enter a number';
                        },
                        filter: Number,
                    },
                    {
                        type: "list",
                        name: "newRoleDepartment",
                        message: "Which department does the new role belong to?",
                        choices: choicesDepartment

                    }
                ]).then(data => {
                    newRole(data.newRoleName, data.newRoleSalary, data.newRoleDepartment);
                })
                break;

            case "Add employees":
                inquirer.prompt([
                    {
                        type: "input",
                        name: "newEmployeeFirstName",
                        message: "What is the first name of the new employee?",
                        validate: function (value) {
                            if (value) {
                                return true
                            }
                            else {
                                return "Please enter a first name"
                            }
                        }
                    },
                    {
                        type: "input",
                        name: "newEmployeeLastName",
                        message: "What is the last name of the new employee?",
                        validate: function (value) {
                            if (value) {
                                return true
                            }
                            else {
                                return "Please enter a last name"
                            }
                        }
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
                    newEmployee(data.newEmployeeFirstName, data.newEmployeeLastName, data.newEmployeeRole, data.newEmployeeManager);
                })
                break;

            case "Update employee roles":
                inquirer.prompt([
                    {
                        type: "list",
                        name: "employeeUpdate",
                        message: "Select the employee to update",
                        choices: choicesEmployee
                    },
                    {
                        type: "list",
                        name: "newEmployeeRole",
                        message: "Select the new role",
                        choices: choicesRole
                    }
                ]).then(data => {
                    connection.query(`UPDATE employee SET role_id = ? WHERE id = ?;`, [data.newEmployeeRole, data.employeeUpdate],function (err, res) {
                        if (err) throw err;
                        console.log("Role has been updated!")
                        run();
                    })

                })
                break;

                case "Update employee manager":
                    inquirer.prompt([
                        {
                            type: "list",
                            name: "employeeUpdate",
                            message: "Select the employee to update",
                            choices: choicesEmployee
                        },
                        {
                            type: "list",
                            name: "newEmployeeManager",
                            message: "Select the new manager",
                            choices: choicesManager
                        }
                    ]).then(data => {
                        connection.query(`UPDATE employee SET manager_id = ? WHERE id = ?;`, [data.newEmployeeManager, data.employeeUpdate],function (err, res) {
                            if (err) throw err;
                            console.log("Manager has been updated!")
                            run();
                        })

                    })
                break;
        }
    })
}

run();
