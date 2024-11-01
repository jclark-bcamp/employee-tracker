const {Pool} = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'janessaclark',
    password: '',
    database: 'employee_tracker_db',
    port: 5432,
});

module.exports = pool;