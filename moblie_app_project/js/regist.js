window.onload = function () {
    document.querySelector("input[type=button]").addEventListener("click", ajax)
    //返回登陆页面
    document.querySelector(".back").addEventListener("click", goLogin)
    //输入框获取焦点  边框变色
    document.querySelector("input[name=username]").addEventListener("focus", borderC)
    document.querySelector("input[name=nickname]").addEventListener("focus", borderC)
    document.querySelector("input[name=password]").addEventListener("focus", borderC)
    document.querySelector("input[name=repassword]").addEventListener("focus", borderC)
    document.querySelector("input[name=email]").addEventListener("focus", borderC)
    //失去焦点
    document.querySelector("input[name=username]").addEventListener("blur", borderC1)
    document.querySelector("input[name=nickname]").addEventListener("blur", borderC1)
    document.querySelector("input[name=password]").addEventListener("blur", borderC1)
    document.querySelector("input[name=repassword]").addEventListener("blur", borderC1)
    document.querySelector("input[name=email]").addEventListener("blur", borderC1)

}
function ajax(e) {
    e.preventDefault()
    //注册校验
    if (isRegist()) return
    //创建ajax对象
    const req = new XMLHttpRequest()
    //封装数据
    req.open("post", "/user/regist")
    req.onreadystatechange = regist
    //设置请求头
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    req.send(`username=${document.querySelector("input[name=username]").value}&password=${document.querySelector("input[name=password]").value}&nickname=${document.querySelector("input[name=nickname]").value}&email=${document.querySelector("input[name=email]").value}`)
}
function regist() {
    if (this.readyState == 4 && this.status >= 200 && this.status < 300) {
        console.log(JSON.parse(this.responseText));
        if (JSON.parse(this.responseText).status == 0) {
            location.href = "login.html"
        } else if (JSON.parse(this.responseText).message = "用户名已存在") {
            document.querySelector("input[name=username]").value = ""
            document.querySelector("input[name=username]").placeholder = "用户已存在"
            document.querySelector("input[name=username]").classList.add("change")
            document.querySelector("input[name=username]").parentNode.style.borderColor = "red"
        }

    }

}
//返回登陆页面
function goLogin() {
    location.href = "login.html"
}
//注册验证
function isRegist() {
    let ct = count()
    let nn = nickname()
    let pwd = password()
    let repwd = repassword()
    let em = email()
    if (ct && nn && pwd && repwd && em) return false
    return true
}


//判断账号
function count() {
    //定义账号验证规则
    const reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
    if (reg.test(document.querySelector("input[name=username]").value.trim())) return true
    document.querySelector("input[name=username]").value = ""
    document.querySelector("input[name=username]").placeholder = "请输入11位的手机号"
    document.querySelector("input[name=username]").classList.add("change")
    document.querySelector("input[name=username]").parentNode.style.borderColor = "red"
    return false
}

//判断昵称
function nickname() {
    if (document.querySelector("input[name=nickname]").value.trim()) return true
    document.querySelector("input[name=nickname]").value = ""
    document.querySelector("input[name=nickname]").placeholder = "昵称不能为空"
    document.querySelector("input[name=nickname]").classList.add("change")
    document.querySelector("input[name=nickname]").parentNode.style.borderColor = "red"
    return false
}

//判断密码
function password() {
    const reg = /^[\w][\w.]{5,11}$/
    if (reg.test(document.querySelector("input[name=password]").value.trim())) return true
    document.querySelector("input[name=password]").value = ""
    document.querySelector("input[name=password]").placeholder = "请输入6~12位的密码"
    document.querySelector("input[name=password]").classList.add("change")
    document.querySelector("input[name=password]").parentNode.style.borderColor = "red"
    return false
}


//确认密码
function repassword() {
    if (document.querySelector("input[name=password]").value.trim() == document.querySelector("input[name=repassword]").value.trim()) return true
    document.querySelector("input[name=repassword]").value = ""
    document.querySelector("input[name=repassword]").placeholder = "两次密码不一致"
    document.querySelector("input[name=repassword]").classList.add("change")
    document.querySelector("input[name=repassword]").parentNode.style.borderColor = "red"
    return false
}

//邮箱验证
function email() {
    const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
    if (reg.test(document.querySelector("input[name=email]").value.trim())) return true
    document.querySelector("input[name=email]").value = ""
    document.querySelector("input[name=email]").placeholder = "邮箱格式不正确"
    document.querySelector("input[name=email]").classList.add("change")
    document.querySelector("input[name=email]").parentNode.style.borderColor = "red"
    return false
}
//边框变色
function borderC() {
    this.placeholder = ""
    this.parentNode.style.borderColor = "rgb(62, 181, 117)"
}
function borderC1() {
    this.parentNode.style.borderColor = "#ddd"
}