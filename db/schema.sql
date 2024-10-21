-- Drop the database if it already exists
DROP DATABASE IF EXISTS employee_tracker_db;

-- Create a new database
CREATE DATABASE employee_tracker_db;

-- Switch to the newly created database
\c employee_tracker_db

-- Drop existing tables if they exist to avoid conflicts
DROP TABLE IF EXISTS department;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS employee;

-- Create the department table
CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL
);

-- Create the role table
CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER NOT NULL,
    FOREIGN KEY (department_id) 
    REFERENCES department(id)
    ON DELETE CASCADE -- If department is deleted, role will be deleted
);

-- Create the employee table
CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    FOREIGN KEY (role_id) 
    REFERENCES role(id)
    ON DELETE CASCADE,
    manager_id INTEGER REFERENCES employee(id)
    ON DELETE SET NULL -- If employee is deleted, manager_id will be set to null
);