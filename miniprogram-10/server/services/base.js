const mysql = require("mysql2/promise");
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "xqqswjd98.",
    database: "blog",
    multipleStatements: true,
});
module.exports = pool