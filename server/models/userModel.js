const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'gavilanezjhostyn_laboratorio2'
});

connection.connect();

module.exports = connection;
