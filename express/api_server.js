//导入exprexx模块
const express = require("express")
//创建服务器实例
const app = express()
//解析token模块
const expressJWT = require("express-jwt")
//导入配置模块
const config = require("./config")
//导入路由
const userRouter = require("./router/user")
//商品信息路由
const shoppingRouter = require("./router/shoppinginfo")

//配置跨域
//导入跨域模块
const cors = require("cors")
//将跨域模块在注册去全局中间件
app.use(cors())
//解析post请求数据
app.use(express.urlencoded({ extended: "false" }))
//定义一个发送错误信息的中间件
app.use((req, res, next) => {
    res.cc = function (err, status = 1) {
        res.send({
            status,
            message: err instanceof Error ? err.message : err,
        })
    }
    next()
})
//托管静态资源
app.use(express.static("../moblie_app_project"))
//注册全局解析token中间件
app.use(expressJWT({ secret: config.tokenKey }).unless({ path: [/^\/user\//] }))





//注册全局路由
app.use("/user", userRouter)
app.use("/user/shopping", shoppingRouter)
//注册用户获取信息全局中间件
const userinfoRouter = require("./router/userinfo")
app.use(userinfoRouter)
//注册全局错误中间件
//导入验证模块
const joi = require("joi")

app.use((err, req, res, next) => {
    //验证错误
    if (err instanceof joi.ValidationError) return res.cc(err)
    //token解析错误
    if (err.name == "UnauthorizedError") return res.cc("身份验证失败")
    //未知错诶
    return res.cc(err)
})


//启动服务器
app.listen(3000, "192.168.111.6", () => {
    console.log("moblie_app server running");
})