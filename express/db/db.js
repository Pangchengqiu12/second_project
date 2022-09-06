//导入数据库模块
const mysql = require("mysql")
//链接数据库
const db = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "liwei.04",
    database: "my_db_01",
})
module.exports = db