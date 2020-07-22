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