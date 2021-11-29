const mysql = require("mysql2/promise");
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "wechat",
    multipleStatements: true,
});
module.exports = pool