const mysql = require("mysql");
const inquirer = require("inquirer");

const ctable = require('console.table');

const querryAll1 = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary
FROM ((employee
INNER JOIN role ON employee.role_id = role.id)
INNER JOIN department ON role.department_id = department.id);`

const querryAll2 = `SELECT
e.id,
CONCAT (m.first_name, ' ', m.last_name) manager
FROM
employee e
INNER JOIN employee m ON m.id = e.manager_id;`

const queryRoles = `SELECT role.title, department.department, role.salary
FROM (role
INNER JOIN department ON role.department_id = department.id);`

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
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        //   console.log(res);
        console.table(res);
        //   connection.end();
    });
}

function viewAllEmployees() {
    const employeeList = [];
    connection.query(querryAll1, function (err, res) {
        if (err) throw err;
        //   console.log(res);
        console.table(res);
        for (let i = 0; i < res.length; i++) {
            employeeList.push(res[i])
        }



    });
    connection.query(querryAll2, function (err, res) {
        if (err) throw err;
        //   console.log(res);
        for (let j = 0; j < res.length; j++) {
            console.log(res[j]);
        }
    })

    console.log(employeeList)
    connection.end();
}

function viewRoles() {
    connection.query(queryRoles, function (err, res) {
        if (err) throw err;
        //   console.log(res);
        console.log('\n');
        console.table(res);
        //   connection.end();
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


function run(){
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
    })
}

run();
