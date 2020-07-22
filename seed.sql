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

