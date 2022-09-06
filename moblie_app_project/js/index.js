window.onload = function () {
    //绑定点击事件
    eBind()
    //发送ajax请求用户信息
    // ajaxUserinfo()
    // 请求用户账单信息
    ajaxUserBill()
}
// function ajaxUserinfo() {
//     const req = new XMLHttpRequest()
//     //封装数据
//     req.open("post", "http://192.168.137.1:3000/userinfo")
//     req.onreadystatechange = function () {
//         if (this.readyState == 4 && this.status >= 200 && this.status < 300) {
//         }
//     }
//     req.setRequestHeader("Authorization", JSON.parse(localStorage.getItem("token")))
//     req.send()
// }
//获取账单信息
function ajaxUserBill() {
    const req = new XMLHttpRequest()
    //封装数据
    req.open("post", "/userbill")
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status >= 200 && this.status < 300) {
            let results = JSON.parse(this.responseText)
            if (results.status == 0) {
                let bill = JSON.parse(results.message)
                renderBill(bill)
            }
        }
    }
    req.setRequestHeader("Authorization", JSON.parse(localStorage.getItem("token")))
    req.send()
}


// 事件绑定函数
function eBind() {

    // 添加一笔订单
    document.querySelector(".add_bill").addEventListener("tap", addContent)
    // 添加一笔订单中的收入
    document.querySelector(".billType>div:nth-child(1)").addEventListener("tap", typeChange)
    document.querySelector(".billType>div:nth-child(2)").addEventListener("tap", typeChange)
    // 关闭按钮
    document.querySelector(".close").addEventListener("tap", closeBill)
    let divs = document.querySelectorAll(".TypeContent>div")
    for (let i = 0; i < divs.length; i++) {
        divs[i].addEventListener("tap", optChange)
    }
    document.querySelector(".close").addEventListener("tap", closeBill)
    let div1s = document.querySelectorAll(".TypeContent1>div")
    for (let i = 0; i < div1s.length; i++) {
        div1s[i].addEventListener("tap", optChange)
    }
    //导航栏点击事件
    let nav = document.querySelectorAll(".nav>div")
    for (let i = 0; i < nav.length; i++) {
        nav[i].addEventListener("tap", navEve)
    }
}

// 渲染账单数据
function renderBill(bill) {
    console.log(bill);
    // if (bill.lenth == 0) return //todo 当用户没有账单信息的时候提示用户
    if (!bill) return
    for (let i = 0; i < bill.length; i++) {
        let totalSub = 0
        let totalAdd = 0
        for (let k = 0; k < bill[i].data.length; k++) {
            if (parseInt(bill[i].data[k].type) == 1) {
                totalSub += +bill[i].data[k].money.substring(1)
            } else if (parseInt(bill[i].data[k].type) == 0) {
                totalAdd += +bill[i].data[k].money.substring(1)
            }

        }
        let ul = document.createElement("ul")
        ul.innerHTML = `<li>
                <div>${bill[i].date}</div>
                <div>
                    <span>-${totalSub}</span>
                    <span>+${totalAdd}</span>
                </div>
            </li>`
        for (let j = 0; j < bill[i].data.length; j++) {
            let li = document.createElement("li")
            li.innerHTML = `<div></div>
                <div>
                    <span>${bill[i].data[j].title}</span>
                    <span>${bill[i].data[j].time}</span>
                </div>
                <div>${bill[i].data[j].money}</div>
                <div class="del">删除</div>`
            li.addEventListener("swipeleft", spLeft)
            li.addEventListener("swiperight", spright)
            li.querySelector(".del").addEventListener("tap", del)
            li.querySelector("div:nth-child(1)").style.background = `url(../images/type${bill[i].data[j].type}.png) no-repeat .5rem center/60% auto`
            ul.appendChild(li)
            if (j % 2 == 0) {
                let span = document.createElement("span")
                ul.appendChild(span)
            }
            document.querySelector(".bodyPart").appendChild(ul)
        }
    }
    totalT()
}


// 导航栏点击事件
function navEve() {
    let navTitle = this.children[2]
    if (navTitle.innerHTML == "我的") {
        location.href = "personalCenter.html"
    }
    else if (navTitle.innerHTML == "统计") {
        location.href = "total.html"
    }
    else if (navTitle.innerHTML == "商城") {
        location.href = "shop.html"
    }
}

// 计算总支出和总收入
function totalT() {
    let totalAdd = 0
    let totalSub = 0
    let sub = document.querySelectorAll(".bodyPart>ul>li:nth-child(1)>div:nth-child(2)>span:nth-child(1)")
    let add = document.querySelectorAll(".bodyPart>ul>li:nth-child(1)>div:nth-child(2)>span:nth-child(2)")
    for (let i = 0; i < sub.length; i++) {
        totalSub += +sub[i].innerHTML.substring(1)
    }
    document.querySelector(".time>div:nth-child(2)").innerHTML = `总是支出￥${totalSub.toFixed(2)}`
    for (let i = 0; i < add.length; i++) {
        totalAdd += +add[i].innerHTML.substring(1)
    }
    document.querySelector(".time>div:nth-child(3)").innerHTML = `总是收入￥${totalAdd.toFixed(2)}`


}
// 计算总支出和总收入


function spLeft() {
    setTimeout(function () {
        this.style.transform = "translateX(-1.5rem)"
    }.bind(this), 1)
}
function spright() {
    setTimeout(function () {
        this.style.transform = "translateX(0rem)"
    }.bind(this), 1)
}
// 删除
function del() {
    this.parentNode.remove()
    delAll()
}


function addContent() {
    setTimeout(function () {
        document.querySelector(".add_content").style.transform = "translateY(-8rem)"
    }, 1)
}

function closeBill() {
    setTimeout(function () {
        this.parentNode.style.transform = "translateY(0)"
    }.bind(this), 1)
}


// 判断是否删完
function delAll() {
    let uls = document.querySelectorAll(".bodyPart>ul")
    for (let i = 0; i < uls.length; i++) {
        if (uls[i].children.length == 2) {
            uls[i].remove()
        }
    }
}


function typeChange() {
    if (this.innerHTML == "收入") {
        document.querySelector(".TypeContent").style.display = "none"
        document.querySelector(".TypeContent1").style.display = "block"
    } else {
        document.querySelector(".TypeContent1").style.display = "none"
        document.querySelector(".TypeContent").style.display = "block"
    }
    document.querySelector(".bgcolor_active").classList.remove("bgcolor_active")
    this.classList.add("bgcolor_active")
}

function optChange() {
    if (document.querySelector(".opt_active")) {
        document.querySelector(".opt_active").classList.remove("opt_active")
    }
    this.classList.add("opt_active")

}