; (function (doc, w, uiW, prem) {
  // 获得html元素
  let html = doc.documentElement
  // 获得缩放事件名称
  let resizeEvent = 'orientationchange' in w ? 'orientationchange' : 'resize'
  // 动态设置html的font-size值
  let reCalculate = function () {
    let clw = html.clientWidth
    if (!clw) {
      return
    }
    html.style.fontSize = (clw / uiW) * prem + 'px'
  }
  // 给窗口绑定缩放事件
  w.addEventListener(resizeEvent, reCalculate, false)
  // 给document绑定文档树加载结束事件，只是元素加载结束，资源可能还没有加载
  doc.addEventListener('DOMContentLoaded', reCalculate, false)
})(document, window, 750, 200)
