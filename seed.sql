DROP DATABASE IF EXISTS employees_db;

CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE department (
    id INT (11) NOT NULL AUTO_INCREMENT,
    department VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id INT (11) NOT NULL AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL (10, 2),
    department_id INT (11),
    PRIMARY KEY (id)
);

CREATE TABLE employee (
    id INT (11) NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    PRIMARY KEY (id)
);

-- FOREIGN KEY (PersonID) REFERENCES Persons(PersonID)

INSERT INTO department (department)
VALUES ("Marketing");

INSERT INTO department (department)
VALUES ("Finance");

INSERT INTO department (department)
VALUES ("QA");

INSERT INTO role (title, salary, department_id)
VALUES ("Manager", 50000.00, 1), ("CFO", 1000000.00, 2), ("Intern", 10000.00, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Smith", 1, 2), ("Buster", "Posey", 2, 0), ("Pablo", "Sandoval", 3, 1);

SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department, role.salary
FROM ((employee
INNER JOIN role ON employee.role_id = role.id)
INNER JOIN department ON role.department_id = department.id);

SELECT
    e.id,
    CONCAT (m.first_name, ' ', m.last_name) manager
FROM
    employee e
LEFT JOIN employee m ON m.id = e.manager_id;
-- ORDER BY
    -- manager;

-- roles
SELECT role.title, department.department, role.salary
FROM (role
INNER JOIN department ON role.department_id = department.id);

SELECT id
FROM department
WHERE department = 'Marketing';