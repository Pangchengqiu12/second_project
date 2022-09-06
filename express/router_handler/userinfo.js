const db = require("../db/db")
//用户获取信息api
module.exports.get_userinfo = (req, res) => {
    const sql = "select username,nickname,email from moblie_users where id=?"
    db.query(sql, req.user.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc("用户不存在")
        res.send({
            status: 0,
            message: results[0]
        })
    })
}

// 获取用户账单
module.exports.get_userBill = (req, res) => {
    const sql = "select bill from moblie_users where id=?"
    db.query(sql, req.user.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc("用户不存在")
        res.send({
            status: 0,
            message: results[0].bill
        })
    })
}

//获取用户商品
module.exports.get_userShopping = (req, res) => {
    const sql = "select shopping from moblie_users where id=?"
    db.query(sql, req.user.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc("用户不存在")
        res.send({
            status: 0,
            message: results[0].shopping
        })
    })
}

// 更新用户购物车信息
module.exports.update_shoppingcar = (req, res) => {
    const sql = "update moblie_users set shopping=? where id=?"
    db.query(sql, [req.body.shopping, req.user.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows != 1) return res.cc("商品更新失败")
        res.cc("更新成功", 0)
    })
}

//更新用户账单
module.exports.update_bill = (req, res) => {
    const sql = "update moblie_users set bill=? where id=?"
    db.query(sql, [req.body.bill, req.user.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows != 1) return res.cc("用户账单更新失败")
        res.cc("更新成功", 0)
    })
}