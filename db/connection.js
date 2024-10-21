const mysql = require('postgres');
//require('dotenv').config();

const db = mysql.createConnection({
    host: 'localhost',
    // Your postgres username,
    user: 'root',
    // Your postgres password
    password: '',
    database: 'employee_tracker_db'
});

module.exports = db;