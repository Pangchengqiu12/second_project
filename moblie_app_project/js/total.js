window.onload = function () {
    //绑定事件
    eBind()
    // 获取账单
    ajaxUserBill()

}
//获取账单信息
function ajaxUserBill() {
    const req = new XMLHttpRequest()
    //封装数据
    req.open("post", "/userbill")
    req.responseType = "json"
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status >= 200 && this.status < 300) {
            let results = this.response
            if (results.status == 0) {
                let bill = JSON.parse(results.message)
                disBill(bill)
            }
        }
    }
    req.setRequestHeader("Authorization", JSON.parse(localStorage.getItem("token")))
    req.send()
}

function disBill(data) {
    if (!data) return
    let arr = []
    let totalPrice = 0
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].data.length; j++) {
            arr.push(data[i].data[j].type)
        }
    }
    arr = Array.from(new Set(arr))
    renderBill(arr, data)
}
function renderBill(data1, data2) {
    totalT(data2)
    for (let i = 0; i < data1.length; i++) {
        let totalPrice = typePrice(data1[i], data2)
        let div = document.createElement("div")
        div.classList.add("total")
        if (data1[i] == "1-1") {
            div.innerHTML = `<div class="title">餐饮</div>
                <div class="line">
                    <div>
                        <div></div>
                    </div>
                </div>
                <div class="price">${totalPrice}</div>`
            let total = document.querySelector(".subtotal").innerHTML.substring(5)
            let width = (totalPrice / total) * 4
            setTimeout(function () {
                div.querySelector(".line>div>div").style.transform = `translateX(${width}rem)`
            }, 100)
            document.querySelector(".bodyPart").appendChild(div)


        }
        else if (data1[i] == "0-1") {
            div.innerHTML = `<div class="title">转账</div>
                <div class="line">
                    <div>
                        <div></div>
                    </div>
                </div>
                <div class="price">${totalPrice}</div>`
            div.querySelector(".line>div>div").style.backgroundColor = "rgb(255, 132, 24)"
            let total = document.querySelector(".addtotal").innerHTML.substring(5)
            let width = (totalPrice / total) * 4

            setTimeout(function () {
                div.querySelector(".line>div>div").style.transform = `translateX(${width}rem)`
            }, 100)
            document.querySelector(".bodyPart").appendChild(div)
        }
    }

}

// 计算不同类型的消费总价
function typePrice(data1, data2) {
    let totalPrice = 0
    console.log(data1, data2);
    for (let i = 0; i < data2.length; i++) {
        for (let j = 0; j < data2[i].data.length; j++) {
            if (data2[i].data[j].type == data1) {
                totalPrice += +data2[i].data[j].money.substring(1)
            }
        }
    }
    totalPrice = totalPrice.toFixed(2)
    return totalPrice
}

// 计算总支出和总收入
function totalT(data2) {
    let totalAdd = 0
    let totalSub = 0
    for (let i = 0; i < data2.length; i++) {
        for (let j = 0; j < data2[i].data.length; j++) {
            if (data2[i].data[j].type[0] == 1) {
                totalSub += +data2[i].data[j].money.substring(1)
            }
        }
    }
    document.querySelector(".subtotal").innerHTML = `总是支出￥${totalSub.toFixed(2)}`
    for (let i = 0; i < data2.length; i++) {
        for (let j = 0; j < data2[i].data.length; j++) {
            if (data2[i].data[j].type[0] == 0) {
                totalAdd += +data2[i].data[j].money.substring(1)
            }
        }
    }
    document.querySelector(".addtotal").innerHTML = `总是收入￥${totalAdd.toFixed(2)}`

}
//事件绑定
function eBind() {
    //导航栏点击事件
    let nav = document.querySelectorAll(".nav>div")
    for (let i = 0; i < nav.length; i++) {
        nav[i].addEventListener("tap", navEve)
    }
}
function navEve() {
    let navTitle = this.children[2]
    if (navTitle.innerHTML == "明细") {
        location.href = "index.html"
    }
    else if (navTitle.innerHTML == "我的") {
        location.href = "personalCenter.html"
    }
    else if (navTitle.innerHTML == "商城") {
        location.href = "shop.html"
    }
}

