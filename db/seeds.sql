SOURCE db/schema.sql;

INSERT INTO department (dept_name)
VALUES
('HR'),
('Customer Service'),
('Sales'),
('IT');


INSERT INTO employee_role (title, salary, dept_id)
VALUES
('HR Manager', 65000, 1),
('Customer Service Rep', 42000, 2),
('Sales Rep', 80000, 3),
('Software Engineer', 115000, 4);

INSERT INTO employee (first_name, last_name, role_id)
VALUES
('John', 'Smith', 1),
('Jane', 'Smith', 2),
('Austin', 'Powers', 3),
('James', 'Bond', 4);