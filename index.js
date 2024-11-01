const inquirer = require('inquirer');
const db = require('./db/connection.js');

// Connect to the database
db.connect();

var employee_tracker = function () {
    inquirer.prompt([{
        // Begin Command Line
        type: 'list',
        name: 'prompt',
        message: 'Select an option.',
        choices: [
            'View All Department', 
            'View All Roles', 
            'View All Employees', 
            'Add A Department', 
            'Add A Role', 'Add An Employee', 
            'Update An Employee Role', 
            'Log Out']

    }]).then((answers) => {
       // View department, roles, employees
        if (answers.prompt === 'View All Department') {
            db.query(`SELECT * FROM department`, (err, result) => {
                if (err) throw err;
                console.log("Viewing All Departments: ");
                console.table(result.rows);
                employee_tracker();
            });
        } else if (answers.prompt === 'View All Roles') {
            db.query(`SELECT * FROM role`, (err, result) => {
                if (err) throw err;
                console.log("Viewing All Roles: ");
                console.table(result.rows);
                employee_tracker();
            });
        } else if (answers.prompt === 'View All Employees') {
            db.query(`SELECT * FROM employee`, (err, result) => {
                if (err) throw err;
                console.log("Viewing All Employees: ");
                console.table(result.rows);
                employee_tracker();
            });
        } else if (answers.prompt === 'Add A Department') {
            inquirer.prompt([{
               // Add a department
                type: 'input',
                name: 'department',
                message: 'What is the Department name?',
                validate: departmentInput => {
                    if (departmentInput) {
                        return true;
                    } else {
                        console.log('Please enter a department.');
                        return false;
                    }
                }
            }]).then((answers) => {
                db.query(`INSERT INTO department (name) VALUES ($1)`, [answers.department], (err, result) => {
                    if (err) throw err;
                    console.log(`Added ${answers.department} to the database.`)
                    employee_tracker();
                });
            })
        } else if (answers.prompt === 'Add A Role') {
            // Calling the database to acquire the roles and managers
            db.query(`SELECT * FROM department`, (err, result) => {
                if (err) throw err;

                inquirer.prompt([
                    {
                        // Add a role
                        type: 'input',
                        name: 'role',
                        message: 'What is the name of the role?',
                        validate: roleInput => {
                            if (roleInput) {
                                return true;
                            } else {
                                console.log('Please add a role.');
                                return false;
                            }
                        }
                    },
                    {
                        // Add salary
                        type: 'input',
                        name: 'salary',
                        message: 'What is the salary for this role?',
                        validate: salaryInput => {
                            if (salaryInput) {
                                return true;
                            } else {
                                console.log('Please enter a salary.');
                                return false;
                            }
                        }
                    },
                    {
                        // Department the role belongs to
                        type: 'list',
                        name: 'department',
                        message: 'Which department does the role belong to?',
                        choices: () => {
                            var array = [];
                            for (var i = 0; i < result.rows.length; i++) {
                                array.push({
                                    name: result.rows[i].name,
                                    value: result.rows[i].id
                                });
                            }
                            return array;
                        }
                    }
                ]).then((answers) => {
                    // Comparing the result and storing it into the variable
                    // for (var i = 0; i < result.length; i++) {
                    //     if (result[i].name === answers.department) {
                    //         var department = result[i];
                    //     }
                    // }

                    db.query(`INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)`, [answers.role, answers.salary, answers.department], (err, result) => {
                        if (err) throw err;
                        console.log(`Added ${answers.role} to the database.`)
                        employee_tracker();
                    });
                })
            });
        } else if (answers.prompt === 'Add An Employee') {
            // Calling the database to acquire the roles and managers
            db.query(`SELECT * FROM role`, async (err, result) => {
                const allEmployees = await db.query(`SELECT * FROM employee`);
                let employeeChoices = allEmployees.rows.map(({ id, first_name, last_name }) => ({
                    name: `${first_name} ${last_name}`,
                    value: id
                }));
                    let roleChoices = result.rows.map(({ id, title }) => ({
                        name: title,
                        value: id
                    }));
                if (err) throw err;

                inquirer.prompt([
                    {
                        // Add employees first and last name
                        type: 'input',
                        name: 'firstName',
                        message: 'What is the employees first name?',
                        validate: firstNameInput => {
                            if (firstNameInput) {
                                return true;
                            } else {
                                console.log('Please enter the employees first name.');
                                return false;
                            }
                        }
                    },
                    {
                        type: 'input',
                        name: 'lastName',
                        message: 'What is the employees last name?',
                        validate: lastNameInput => {
                            if (lastNameInput) {
                                return true;
                            } else {
                                console.log('Please enter the employees last name.');
                                return false;
                            }
                        }
                    },
                    {
                        // Add the employees role
                        type: 'list',
                        name: 'role',
                        message: 'What is this employees role?',
                        choices: roleChoices,
              
                    },

                    {
                        // Add the employees manager
                        type: 'list',
                        name: 'manager',
                        message: 'Who is this employees manager?',
                        choices: employeeChoices,
                        }
                ]).then((answers) => {
                    // Comparing the result and storing it into the variable
                    // for (var i = 0; i < result.length; i++) {
                    //     if (result[i].title === answers.role) {
                    //         var role = result[i];
                    //     }
                    // }

                    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`, [answers.firstName, answers.lastName, answers.role, answers.manager.id], (err, result) => {
                        if (err) throw err;
                        console.log(`Added ${answers.firstName} ${answers.lastName} to the database.`)
                        employee_tracker();
                    });
                })
            });
        } else if (answers.prompt === 'Update An Employee Role') {
            // Calling the database to acquire the roles and managers
            db.query(`SELECT * FROM employee, role`, (err, result) => {
                if (err) throw err;

                inquirer.prompt([
                    {
                        // Make updates to employee roles
                        type: 'list',
                        name: 'employee',
                        message: 'Which employees role would you like to change?',
                        choices: () => {
                            var array = [];
                            for (var i = 0; i < result.length; i++) {
                                array.push(result[i].last_name);
                            }
                            var employeeArray = [...new Set(array)];
                            return employeeArray;
                        }
                    },
                    {
                        // Update the employees role
                        type: 'list',
                        name: 'role',
                        message: 'What is their new role?',
                        choices: () => {
                            var array = [];
                            for (var i = 0; i < result.length; i++) {
                                array.push(result[i].title);
                            }
                            var newArray = [...new Set(array)];
                            return newArray;
                        }
                    }
                ]).then((answers) => {
                    // Comparing the result and storing it into the variable
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].last_name === answers.employee) {
                            var name = result[i];
                        }
                    }

                    for (var i = 0; i < result.length; i++) {
                        if (result[i].title === answers.role) {
                            var role = result[i];
                        }
                    }

                    db.query(`UPDATE employee SET $1 WHERE $2`, [{role_id: role}, {last_name: name}], (err, result) => {
                        if (err) throw err;
                        console.log(`Updated ${answers.employee} role to the database.`)
                        employee_tracker();
                    });
                })
            });
        } else if (answers.prompt === 'Log Out') {
            db.end();
            console.log("Thanks!");
        }
    })
};

employee_tracker();