window.onload = function () {
    ajax()
    //绑定事件
    eBind()
}
function ajax() {
    const req = new XMLHttpRequest()
    req.open("post", "/userinfo")
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200 && this.status < 300) {
            let results = JSON.parse(this.responseText)
            if (results.status == 0) {
                document.querySelector(".nickname").innerHTML = "用户名：" + results.message.nickname
                document.querySelector(".exit").innerHTML = "退出登录"
            } else {
                document.querySelector(".nickname").innerHTML = "未登录"
                document.querySelector(".exit").innerHTML = "立即登录"
            }
        }
    }
    req.setRequestHeader("Authorization", JSON.parse(localStorage.getItem("token")))
    req.send()
}


//事件绑定
function eBind() {
    //导航栏点击事件
    let nav = document.querySelectorAll(".nav>div")
    for (let i = 0; i < nav.length; i++) {
        nav[i].addEventListener("tap", navEve)
    }
    //退出登录按钮点击事件
    document.querySelector(".exit").addEventListener("tap", exit)
}


function exit() {
    if (this.innerHTML == "立即登录") {
        location.href = "login.html"
    } else {
        let tokenKey
        localStorage.removeItem("token")
        location.href = "login.html"
    }
    return
}


function navEve() {
    let navTitle = this.children[2]
    if (navTitle.innerHTML == "明细") {
        location.href = "index.html"
    }
    else if (navTitle.innerHTML == "统计") {
        location.href = "total.html"
    }
    else if (navTitle.innerHTML == "商城") {
        location.href = "shop.html"
    }
}