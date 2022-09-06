//导入数据库模块
const db = require("../db/db")
module.exports.shoppinginfo_handler = (req, res) => {
    const sql = "select * from shopping_table"
    db.query(sql, (err, results) => {
        if (err) return res.cc(err)
        if (results.length == 0) return res.cc("未找到商品")
        res.send({
            status: 0,
            message: results
        })
    })
}
module.exports.shoppinginfos_handler = (req, res) => {
    const sql = "select * from shopping_table where id=?"
    db.query(sql, req.query.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length == 0) return res.cc("未找到商品")
        res.send({
            status: 0,
            message: results[0]
        })
    })
}
// 获取店铺信息
module.exports.storeinfo_handler = (req, res) => {
    const sql = "select storename from store where storeid=?"
    db.query(sql, req.query.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length == 0) return res.cc("没有店铺信息")
        res.send({
            status: 0,
            message: results[0]
        })
    })
}

module.exports.store_shoppingid_handler = (req, res) => {
    const sql = "select shoppingid from store"
    db.query(sql, (err, results) => {
        if (err) return res.cc(err)
        if (results.length == 0) return res.cc("没有店铺信息")
        res.send({
            status: 0,
            message: results
        })
    })
}