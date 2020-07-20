DROP DATABASE IF EXISTS employees_db;

CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE department (
    id INT (11) NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
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

INSERT INTO department (name)
VALUES ("Marketing");

INSERT INTO department (name)
VALUES ("Finance");

INSERT INTO department (name)
VALUES ("QA");

INSERT INTO role (title, salary)
VALUES ("Manager", 50000.00), ("CFO", 1000000.00), ("Intern", 10000.00);

INSERT INTO employee (first_name, last_name, manager_id)
VALUES ("John", "Smith"), ("Buster", "Posey"), ("Pablo", "Sandoval", 1);

UPDATE employee
SET role_id = 1
WHERE id = 1;

UPDATE employee
SET role_id = 2
WHERE id = 2;

UPDATE employee
SET role_id = 3
WHERE id = 3;
