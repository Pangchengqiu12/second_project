const express = require("express")
const shoppinginfo_handler = require("../router_handler/shoppinginfo")


const router = express.Router()
router.get('/shoppinginfo', shoppinginfo_handler.shoppinginfo_handler)
router.get('/shoppinginfos', shoppinginfo_handler.shoppinginfos_handler)
router.get('/storeinfo', shoppinginfo_handler.storeinfo_handler)
router.get('/store_shoppingid', shoppinginfo_handler.store_shoppingid_handler)
module.exports = router