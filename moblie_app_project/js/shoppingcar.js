window.onload = function () {
    // 获取用户商品信息
    usershoppingAjax()
    //事件绑定
    eBind()
}
function usershoppingAjax() {
    const req = new XMLHttpRequest()
    req.open("post", "/usershopping")
    req.responseType = 'json'
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status >= 200 && this.status < 300) {
            let results = JSON.parse(this.response.message)
            if (this.response.status == 0) {
                shoppingRender(results)
            }
        }
    }
    req.setRequestHeader("Authorization", JSON.parse(localStorage.getItem("token")))
    req.send()
}
// 事件绑定
function eBind() {
    //返回按钮
    document.querySelector(".back").addEventListener("tap", goBack)
    //全选
    document.querySelector(".check").addEventListener("tap", checkALL)
}
function goBack() {
    location.href = "shop.html"
}


//渲染购物车数据
function shoppingRender(data) {
    if (!data) return
    for (let i = 0; i < data.length; i++) {
        let ul = document.createElement("ul")
        //获取店铺
        const req = new XMLHttpRequest()
        req.open("get", `/user/shopping/storeinfo?id=${data[i].storeid}`)
        req.responseType = "json"
        req.onreadystatechange = function () {
            if (this.readyState == 4 && this.status >= 200 && this.status < 300) {
                if (this.response.status == 0) {
                    ul.innerHTML = `<li>
                    <div class="checked1"></div>
                    <div>${this.response.message.storename}</div>
                </li>`
                    ul.id = data[i].storeid
                    ul.querySelector("div:nth-child(1)").addEventListener("tap", check1)
                    document.querySelector(".wait_box").style.display = "none"
                }
            }
        }
        req.send()
        for (let j = 0; j < data[i].data.length; j++) {
            //发送ajax请求获取商品信息
            let li = document.createElement("li")
            li.id = data[i].data[j].shoppingid
            //获取商品信息
            const req = new XMLHttpRequest()
            req.open("get", `/user/shopping/shoppinginfos?id=${data[i].data[j].shoppingid}`)
            req.responseType = "json"
            req.onreadystatechange = function () {
                if (this.readyState == 4 && this.status >= 200 && this.status < 300) {
                    li.innerHTML = ` <div class="checked2"></div>
                    <div><img src="${JSON.parse(this.response.message.shoppingpic)[0].pic}" alt=""></div>
                    <div>
                        <div>${this.response.message.shoppingname}</div>
                        <div>
                            <div>￥${this.response.message.shoppingprice}</div>
                            <div>
                                <div class="sub">-</div><input type="text" readonly="readonly" value="${data[i].data[j].shoppingnum}">
                                <div class="add">+</div>
                            </div>
                        </div>
                    </div>
                    <div class="del">删除</div>
                    `
                    li.addEventListener("swipeleft", del)
                    li.addEventListener("swiperight", delH)
                    li.querySelector("div:nth-child(1)").addEventListener("tap", check2)
                    li.querySelector(".del").addEventListener("tap", delS)
                    li.querySelector(".sub").addEventListener("tap", subNum)
                    li.querySelector(".add").addEventListener("tap", addNum)
                    ul.appendChild(li)
                }
            }
            req.send()
        }
        document.querySelector(".bodyPart").appendChild(ul)
    }
}
//商店复选框
function check1() {
    this.classList.toggle("checked_active1")
    let checks = this.parentNode.parentNode.children
    if (this.className.indexOf("checked_active1") >= 0) {
        for (let i = 1; i < checks.length; i++) {
            checks[i].children[0].classList.add("checked_active2")
        }
    } else {
        for (let i = 1; i < checks.length; i++) {
            checks[i].children[0].classList.remove("checked_active2")
        }
    }
    shoppingCheckAll()
}
// 商品复选框
function check2() {
    this.classList.toggle("checked_active2")
    let checks = this.parentNode.parentNode.children
    for (let i = 1; i < checks.length; i++) {
        if (checks[i].children[0].className.indexOf("checked_active2") < 0) {
            checks[0].children[0].classList.remove("checked_active1")
            shoppingCheckAll()
            return
        }
    }
    checks[0].children[0].classList.add("checked_active1")
    shoppingCheckAll()
}
// 全选
function checkALL() {
    this.classList.toggle("checked_active")
    let checks1 = document.querySelectorAll(".checked1")
    let checks2 = document.querySelectorAll(".checked2")
    if (this.className.indexOf("checked_active") >= 0) {
        for (let i = 0; i < checks1.length; i++) {
            checks1[i].classList.add("checked_active1")
        }
        for (let i = 0; i < checks2.length; i++) {
            checks2[i].classList.add("checked_active2")
        }
    } else {
        for (let i = 0; i < checks1.length; i++) {
            checks1[i].classList.remove("checked_active1")
        }
        for (let i = 0; i < checks2.length; i++) {
            checks2[i].classList.remove("checked_active2")
        }
    }
    totalPrice()
}
//判断商品是否全选
function shoppingCheckAll() {
    if (document.querySelectorAll(".checked2").length == document.querySelectorAll(".checked_active2").length) {
        document.querySelector(".check").classList.add("checked_active")
    } else {
        document.querySelector(".check").classList.remove("checked_active")
    }
    totalPrice()
}

// 改变商品数量
function subNum() {
    if (this.nextElementSibling.value == 1) return
    document.querySelector(".wait_box").style.display = "block"
    let storeid = this.parentNode.parentNode.parentNode.parentNode.parentNode.id
    let shoppingid = this.parentNode.parentNode.parentNode.parentNode.id
    this.nextElementSibling.value--
    delNum(storeid, shoppingid, this.nextElementSibling.value)
    totalPrice()
}
function addNum() {
    document.querySelector(".wait_box").style.display = "block"
    this.previousElementSibling.value++
    let storeid = this.parentNode.parentNode.parentNode.parentNode.parentNode.id
    let shoppingid = this.parentNode.parentNode.parentNode.parentNode.id
    delNum(storeid, shoppingid, this.previousElementSibling.value)
    totalPrice()
}
//  处理数量数据
function delNum(storeid, shoppingid, num) {
    const req = new XMLHttpRequest()
    req.open("post", "/usershopping")
    req.responseType = 'json'
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status >= 200 && this.status < 300) {
            let results = JSON.parse(this.response.message)
            if (this.response.status == 0) {
                for (let i = 0; i < results.length; i++) {
                    if (results[i].storeid == storeid) {
                        for (let j = 0; j < results[i].data.length; j++) {
                            if (results[i].data[j].shoppingid == shoppingid) {
                                results[i].data[j].shoppingnum = num
                                updataNumAjax(results)
                                return
                            }
                        }
                    }
                }
            }
        }
    }
    req.setRequestHeader("Authorization", JSON.parse(localStorage.getItem("token")))
    req.send()
}


function updataNumAjax(data) {
    const req = new XMLHttpRequest()
    req.open("post", "/update_shoppingcar")
    req.responseType = "json"
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status >= 200 && this.status < 300) {
            if (this.response.status == 0) {
                document.querySelector(".wait_box").style.display = "none"
            }
        }
    }
    req.setRequestHeader("Authorization", JSON.parse(localStorage.getItem("token")))
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    req.send(`shopping=${JSON.stringify(data)}`)
}







//计算总价
function totalPrice() {
    let totalPrice = 0
    let totalNum = 0
    let ck = document.querySelectorAll(".checked_active2")
    for (let i = 0; i < ck.length; i++) {
        let price = ck[i].nextElementSibling.nextElementSibling.children[1].children[0].innerHTML.substring(1)
        let num = ck[i].nextElementSibling.nextElementSibling.children[1].children[0].nextElementSibling.children[1].value
        totalPrice += +price * num
        totalNum += +num
    }
    document.querySelector(".totalPrice>span:nth-child(2)").innerHTML = "￥" + totalPrice.toFixed(2)
    document.querySelector(".num").innerHTML = `已选${totalNum}件`
}

function del() {
    setTimeout(function () {
        this.style.transform = "translateX(-2.5rem)"
    }.bind(this), 1)
}

function delH() {
    setTimeout(function () {
        this.style.transform = "translateX(0)"
    }.bind(this), 1)
}

//删除
function delS() {
    delData(this.parentNode.parentNode.id, this.parentNode.id)
    this.parentNode.remove()
    document.querySelector(".wait_box").style.display = "none"
}
function delData(storeid, shoppingid) {
    document.querySelector(".wait_box").style.display = "block"
    const req = new XMLHttpRequest()
    req.open("post", "/usershopping")
    req.responseType = 'json'
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status >= 200 && this.status < 300) {
            let results = JSON.parse(this.response.message)
            if (this.response.status == 0) {
                for (let i = 0; i < results.length; i++) {
                    if (results[i].storeid == storeid) {
                        for (let j = 0; j < results[i].data.length; j++) {
                            if (results[i].data[j].shoppingid == shoppingid) {
                                results[i].data.splice(j, 1)
                                if (results[i].data.length == 0) {
                                    results.splice(i, 1)
                                    delAjax(results)
                                    return
                                }
                                delAjax(results)
                                return
                            }
                        }
                    }
                }
            }
        }
    }
    req.setRequestHeader("Authorization", JSON.parse(localStorage.getItem("token")))
    req.send()
}



//隐藏删除
function delHidden() {
    let del = document.querySelectorAll(".del")
    for (let i = 0; i < del.length; i++) {
        del[i].parentNode.style.transform = "translateX(0   )"
    }
}

//判断购物车商铺导商品是否删完
function delStore() {
    let store = document.querySelectorAll(".bodyPart>ul")
    for (let i = 0; i < store.length; i++) {
        if (store[i].children.length == 1) {
            store[i].remove()
        }
    }
}

// 删除商品
function delAjax(data) {
    const req = new XMLHttpRequest()
    req.open("post", "/update_shoppingcar")
    req.responseType = "json"
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status >= 200 && this.status < 300) {
            if (this.response.status == 0) {
                delStore()
            }
        }
    }
    req.setRequestHeader("Authorization", JSON.parse(localStorage.getItem("token")))
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    req.send(`shopping=${JSON.stringify(data)}`)
}