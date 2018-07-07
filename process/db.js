var mysql = require('mysql');
const con = mysql.createConnection({
    host: "localhost",
    user: "salesflow-admin",
    password: "LSFAdmin-101",
    database: "salesflow",
    multipleStatements: true
  });
  module.exports = con;