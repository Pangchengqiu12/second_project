
window.onload = function () {
    //发送ajax请求获取商品信息
    shoppingAjax()
    //获取用户商品数量
    shoppingNumAjax()
    //绑定事件
    eBind()
}
function shoppingAjax() {
    const req = new XMLHttpRequest()
    req.open("get", "/user/shopping/shoppinginfo")
    req.onreadystatechange = shoppinginfo
    req.send()
}
function shoppinginfo() {
    if (this.readyState == 4 && this.status >= 200 && this.status < 300) {
        let results = JSON.parse(this.responseText).message
        shoppingRender(results)
    }

}
function shoppingNumAjax() {
    const req = new XMLHttpRequest()
    req.open("post", "/usershopping")
    req.responseType = "json"
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status >= 200 && this.status < 300) {
            if (this.response.status == 0) {
                let results = JSON.parse(this.response.message)
                if (!results) return
                if (results.length == 0) {
                    document.querySelector(".shoppingnum").style.display = "none"
                    return
                }
                let num = 0
                for (let i = 0; i < results.length; i++) {
                    num += results[i].data.length
                }
                document.querySelector(".shoppingnum").innerHTML = num
                document.querySelector(".shoppingnum").style.display = "block"
            } else {
                document.querySelector(".shoppingnum").style.display = "none"
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
    //向上滑动事件
    document.querySelector(".body_box").addEventListener("swipeup", scrollBottom)
    document.querySelector(".body_box").addEventListener("swipedown", scrollTop)
    // 购物车点击事件
    document.querySelector(".shopcar").addEventListener("tap", shopcar)
    document.querySelector("body").addEventListener("swipeup", backTop)
    document.querySelector(".backtop").addEventListener("tap", goTop)

}
function navEve() {
    let navTitle = this.children[2]
    if (navTitle.innerHTML == "明细") {
        location.href = "index.html"
    }
    else if (navTitle.innerHTML == "统计") {
        location.href = "total.html"
    }
    else if (navTitle.innerHTML == "我的") {
        location.href = "personalCenter.html"
    }
}

// 主体
let num = 0
function shoppingRender(data) {
    let dataNum = 4
    if (window.screen.height > 667) dataNum = 6
    if (data.length == num) {
        document.querySelector(".nomore").style.height = "1rem"
    }
    data = data.splice(num, dataNum)
    num += dataNum
    for (let i = 0; i < data.length; i++) {
        let li = document.createElement("li")
        li.id = data[i].id
        let divPic = document.createElement("div")
        let divTile = document.createElement("div")
        divPic.style.background = `url(${JSON.parse(data[i].shoppingpic)[0].pic}) no-repeat center/100% auto`
        divTile.innerHTML = ` <div>${data[i].shoppingname}</div>
                        <div><span>￥${data[i].shoppingprice}</span><span class="buy"></span></div>`
        divTile.querySelector(".buy").addEventListener("tap", buyShopping)
        li.appendChild(divPic)
        li.appendChild(divTile)
        // li.style.width = "4.7rem"
        // li.style.height = "6rem"
        document.querySelector(".body>ul").appendChild(li)
        document.querySelector(".body>ul").appendChild(li)
    }
    for (let i = 0; i < document.querySelectorAll(".body>ul>li").length; i++) {
        setTimeout(function () {
            document.querySelectorAll(".body>ul>li")[i].style.opacity = "1"
            document.querySelectorAll(".body>ul>li")[i].style.height = "6rem"
        }, 500)
    }
}
// 主体

// 判断滚动条是否到底

function scrollBottom() {
    shoppingAjax()
}
function scrollTop() {
    this.children[0].style.height = '1rem'
    setTimeout(function () {
        this.children[0].style.height = '0'
    }.bind(this), 1000)
}
// 判断滚动条是否到底
function shopcar() {
    location.href = "shoppingcar.html"
}

function backTop() {
    if (document.documentElement.scrollTop > 600) {
        setTimeout(function () {
            document.querySelector(".backtop").style.display = "block"
        }, 10)
    } else {
        document.querySelector(".backtop").style.display = "none"
    }
}


function goTop() {
    let num = 0
    let timer = setInterval(function () {
        if (document.documentElement.scrollTop <= 0) {
            clearInterval(timer)
            setTimeout(function () {
                document.querySelector(".backtop").style.display = "none"
            }, 10)

        }
        num++
        document.documentElement.scrollTop -= 10 * num

    }, 10)
}

// 购买商品
function buyShopping() {
    document.querySelector(".wait_box").style.display = "block"
    getStore(this.parentNode.parentNode.parentNode.id)
}
//获取购买商品的店铺id
function getStore(shoppingid) {
    const req = new XMLHttpRequest()
    req.open("get", "/user/shopping/store_shoppingid")
    req.responseType = "json"
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status >= 200 && this.status < 300) {
            let results = this.response.message
            for (let i = 0; i < results.length; i++) {
                let data = JSON.parse(results[i].shoppingid)
                for (let j = 0; j < data.length; j++) {
                    if (data[j].shopping == shoppingid) return updateData(i + 1, shoppingid);
                }
            }
        }
    }
    req.send()
}


function updateData(storeid, shoppingid) {
    console.log(storeid, shoppingid);
    const req = new XMLHttpRequest()
    req.open("post", "/usershopping")
    req.responseType = "json"
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status >= 200 && this.status < 300) {
            let results = JSON.parse(this.response.message)
            if (!results) results = []
            for (let i = 0; i < results.length; i++) {
                if (results[i].storeid == storeid) {
                    for (let j = 0; j < results[i].data.length; j++) {
                        if (results[i].data[j].shoppingid == shoppingid) {
                            results[i].data[j].shoppingnum = +results[i].data[j].shoppingnum + 1
                            updateAjax(results)
                            return
                        }
                    }
                    // todo如果这个商品是这个商店但是这个商品没有购买
                    let newObj = {}
                    newObj.shoppingid = shoppingid
                    newObj.shoppingnum = 1
                    results[i].data.push(newObj)
                    updateAjax(results)
                    return
                }
            }
            let newStore = {}
            newStore.storeid = storeid
            newStore.data = [{
                shoppingid: shoppingid,
                shoppingnum: 1
            }]
            results.push(newStore)
            updateAjax(results)
        }
    }
    req.setRequestHeader("Authorization", JSON.parse(localStorage.getItem("token")))
    req.send()
}

//更新数据
function updateAjax(data) {
    const req = new XMLHttpRequest()
    req.open("post", "/update_shoppingcar")
    req.responseType = "json"
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status >= 200 && this.status < 300) {
            if (this.response.status == 0) {
                document.querySelector(".wait_box").style.display = "none"
                shoppingNumAjax()
            } else {
                document.querySelector(".wait").innerHTML = '请求失败'
                setTimeout(function () {
                    document.querySelector(".wait").innerHTML = ''
                    document.querySelector(".wait_box").style.display = "none"
                }, 1000)
            }
        }
    }
    req.setRequestHeader("Authorization", JSON.parse(localStorage.getItem("token")))
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    req.send(`shopping=${JSON.stringify(data)}`)
}