//导入express模块
const express = require("express")
//导入路由处理模块
const user_handler = require("../router_handler/user")
//导入规则验证模块
const expressjoi = require("@escook/express-joi")
//导入规则模块
const { login_schema, regist_schema } = require("../schema/user")
const router = express.Router()
//用户登录路由
router.post("/login", user_handler.login_handler)
router.post("/regist", expressjoi(regist_schema), user_handler.regist_handler)

//将路由暴露出去
module.exports = router