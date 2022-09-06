//导入数据库
const db = require("../db/db")
//导入生成token模块
const token = require("jsonwebtoken")
//导入配置模块
const config = require("../config")
//导入密码模块
const bcrypt = require("bcryptjs")


//路由处理
//用户登录处理
module.exports.login_handler = (req, res) => {
    const sql = "select * from moblie_users where username=?"
    db.query(sql, req.body.username, (err, results) => {
        //用户名验证
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc("用户名不存在")
        //密码验证
        if (!bcrypt.compareSync(req.body.password, results[0].password)) return res.cc("密码错误")
        const user = { ...results[0], password: '', nickanme: '', email: '' }
        const tokenStr = token.sign(user, config.tokenKey, { expiresIn: config.tokenKeyTime })
        res.send({
            status: 0,
            message: "Bearer " + tokenStr,
        })
    })
}

//用户注册
module.exports.regist_handler = (req, res) => {
    //判断用户名是否存在
    const sql = "select username from moblie_users where username=?"
    db.query(sql, req.body.username, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 0) return res.cc("用户已存在")
        //密码加密
        req.body.password = bcrypt.hashSync(req.body.password, 10)
        const sql = "insert into moblie_users set ?"
        db.query(sql, { username: req.body.username, password: req.body.password, nickname: req.body.nickname, email: req.body.email }, (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc("注册失败")
            res.cc("注册成功", 0)
        })
    })
}

