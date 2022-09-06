window.onload = function () {
    jwtAjax()
    document.querySelector("input[type=button]").addEventListener("tap", ajax)
    //todo当输入框获取焦点的时候边框颜色变回去
    document.querySelector("input[name=username]").addEventListener("tap", borderC)
    document.querySelector("input[name=password]").addEventListener("tap", borderC)
    //失去焦点
    // document.querySelector("input[name=username]").addEventListener("tap", borderC1)
    // document.querySelector("input[name=password]").addEventListener("tap", borderC1)
}
// 身份认证
function jwtAjax() {
    const req = new XMLHttpRequest()
    req.open("post", "/userinfo")
    req.responseType = "json"
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status >= 200 && this.status < 300) {
            if (this.response.status == 0) {
                location.href = "/index.html"
            }
        }
    }
    req.setRequestHeader("Authorization", JSON.parse(localStorage.getItem("token")))
    req.send()
}
function ajax(e) {
    e.preventDefault()
    //判断用户名和密码是否为空
    if (isEmpty()) return
    //创建ajax对象
    const req = new XMLHttpRequest()
    //封装数据
    req.open("post", "/user/login")
    req.onreadystatechange = login
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    req.send(`username=${document.querySelector("input[name=username]").value}&password=${document.querySelector("input[name=password]").value}`)
}
function login() {
    if (this.readyState == 4 && this.status >= 200 && this.status < 300) {
        const results = JSON.parse(this.responseText)
        //判断用户名是否存在
        if (results.status == 1 && results.message == "用户名不存在") {
            document.querySelector("input[name=username]").classList.add("change")
            document.querySelector("input[name=username]").value = ""
            document.querySelector("input[name=username]").placeholder = "用户名不存在"
            document.querySelector("input[name=username]").parentNode.style.borderColor = "red"
            return
        }
        //判断用户密码是否正确
        if (results.status == 1 && results.message == "密码错误") {
            document.querySelector("input[name=password]").classList.add("change")
            document.querySelector("input[name=password]").value = ""
            document.querySelector("input[name=password]").placeholder = "密码错误"
            document.querySelector("input[name=password]").parentNode.style.borderColor = "red"
            return
        }
        if (results.status == 0) {
            localStorage.setItem("token", JSON.stringify(results.message))
            return location.href = "index.html"
        }
    }
}
function isEmpty() {
    if (username() && password()) return false
    password()
    return true
}
//边框变色
function borderC() {
    this.placeholder = ""
    this.parentNode.style.borderColor = "rgb(62, 181, 117)"
}
function borderC1() {
    this.parentNode.style.borderColor = "#ddd"
}
//判断用户名是否为空
function username() {
    if (document.querySelector("input[name=username]").value.trim()) return true
    document.querySelector("input[name=username]").classList.add("change")
    document.querySelector("input[name=username]").placeholder = "用户名不能为空"
    document.querySelector("input[name=username]").parentNode.style.borderColor = "red"
    return false
}
//判断密码是否为空
function password() {
    if (document.querySelector("input[name=password]").value.trim()) return true
    document.querySelector("input[name=password]").classList.add("change")
    document.querySelector("input[name=password]").placeholder = "密码不能为空"
    document.querySelector("input[name=password]").parentNode.style.borderColor = "red"
    return false
}
