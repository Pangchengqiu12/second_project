//定义验证规则
//导入验证规则
const joi = require("joi")
const username = joi.string().pattern(/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/).required()
const password = joi.string().pattern(/^[\S]{6,12}$/).required()
const nickname = joi.string().required()
const email = joi.string().email()


module.exports.login_schema = {
    body: {
        username,
        password,
    }
}

module.exports.regist_schema = {
    body: {
        username,
        password,
        nickname,
        email,
        repassword: joi.ref("password")
    }
}