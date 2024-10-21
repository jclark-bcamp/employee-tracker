-- View departments
SELECT * FROM department;

-- View roles
SELECT 
    role.id AS "Role ID", 
    role.title AS "Title", 
    role.salary AS "Salary", 
    department.name AS "Department"
FROM 
    role
JOIN 
    department ON role.department_id = department.id;


-- View employees
SELECT 
    employee.id AS "Employee ID",
    employee.first_name AS "First Name",
    employee.last_name AS "Last Name",
    role.title AS "Title",
    role.salary AS "Salary",
    department.name AS "Department",
    CONCAT(manager.first_name, ' ', manager.last_name) AS "Manager"
FROM
    employee
JOIN 
    role ON employee.role_id = role.id
JOIN
    department ON role.department_id = department.id
LEFT JOIN
    employee manager ON employee.manager_id = manager.id;


-- Add a department
INSERT INTO department (name)
VALUES ($1)
RETURNING *;

-- Add a role
INSERT INTO role (title, salary, department_id)
VALUES ($1, $2, $3)
RETURNING *;

-- Add an employee
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- Update an employee role
UPDATE employee
SET role_id = $1
WHERE id = $2;

-- Update employee managers
UPDATE employee
SET manager_id = $1
WHERE id = $2;

-- View employees by manager
SELECT employee.id, employee.first_name, employee.last_name
FROM employee
WHERE employee.manager_id = $1;

-- View employees by department
SELECT 
    employee.id AS "Employee ID",
    employee.first_name AS "First Name",
    employee.last_name AS "Last Name",
    role.title AS "Title",
    role.salary AS "Salary",
    department.name AS "Department",
    CONCAT(manager.first_name, ' ', manager.last_name) AS "Manager"
FROM
    employee
JOIN 
    role ON employee.role_id = role.id
JOIN
    department ON role.department_id = department.id
LEFT JOIN
    employee manager ON employee.manager_id = manager.id
WHERE
    department.name = $1;

-- Delete department
DELETE FROM department
WHERE id = $1;

-- Delete role
DELETE FROM role
WHERE id = $1;

-- Delete employee
DELETE FROM employee
WHERE id = $1;

-- View combined salaries of all employees
SELECT SUM(role.salary) AS "Total Combined Salaries" 
FROM employee
JOIN role ON employee.role_id = role.id; 