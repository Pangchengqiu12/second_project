const express = require("express")
const routerinfo = express.Router()
//路由处理函数
const userinfo_handler = require("../router_handler/userinfo")
//获取用户信息接口
routerinfo.post("/userinfo", userinfo_handler.get_userinfo)
// 获取用户账单
routerinfo.post("/userbill", userinfo_handler.get_userBill)
routerinfo.post("/usershopping", userinfo_handler.get_userShopping)

// 更新用户购物车信息
routerinfo.post("/update_shoppingcar", userinfo_handler.update_shoppingcar)
module.exports = routerinfo
//更新用户账单
routerinfo.post("/update_bill", userinfo_handler.update_bill)