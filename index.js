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

// const addDepartment = `INSERT INTO department (department)
// VALUES ("${department}");`


// var sql = "SELECT * FROM ?? WHERE ?? = ?";
// var inserts = ['users', 'id', userId];
// sql = mysql.format(sql, inserts);

const connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "employees_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    // afterConnection();
    // afterConnection2();
});

function afterConnection() {
    // connection.query("SELECT * FROM employee", function (err, res) {
    //     if (err) throw err;
    //       console.log(res);
    //       console.log("Test: "+res[0].id)
    //     // console.table(res);
    //     //   connection.end();
    // });

    let choices = [];
    connection.query(queryDepartments, function (err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {

            choices.push(res[i].department)
        }
        console.log("choices: " + choices)
    });

}

function departmentChoices() {

}

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

        for (let k = 0; k<employeeList.length; k++){
            for (let l = 0; l<employeeManager.length; l++){
                if(employeeList[k].id===employeeManager[l].id){
                    employeeList[k].manager=employeeManager[l].manager
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
        //   console.log(res);
        console.log('\n');
        console.table(res);
        //   connection.end();
        run();
        ;
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
        // console.log('\n');
        // console.table(res);
        run();
    });
}

function newRole(title, salary, department_id) {
    connection.query(`INSERT INTO role (title, salary, department_id)
    VALUES ("${title}", ${salary}, ${department_id});`, function (err, res) {
        if (err) throw err;
        // console.log('\n');
        // console.table(res);
    });
}

// console.table([
//     {
//       name: 'foo',
//       age: 10
//     }, {
//       name: 'bar',
//       age: 20
//     }
//   ]);


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
                    console.log(res);
                    console.log(parseInt(newRoleDepartment));
                    newRole(data.newRoleName, data.newRoleSalary, newRoleDepartment);
                })



                // newRole(data.newRoleName, data.newRoleSalary)
            })
        }
    })
}

run();
