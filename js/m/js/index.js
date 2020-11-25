window.addEventListener('load', function() {
    var items = document.getElementsByClassName('item')
    var list = document.getElementsByClassName('list')[0]
    var carousel = document.getElementsByClassName('carousel')[0]

    var pointWrap = document.getElementsByClassName('point')[0]
    var point = []
    // 创建点
    var _creatPoint = function (i) {

        // 创建方法
        var pointDom = document.createElement('li');
        // 类名
        pointDom.classList.add('point-item');
        // 给创建的第一项active
        if (i === 0) {
            pointDom.classList.add('active')
        }
        // 放进数组里面以后用
        point.push(pointDom)
        // 添加到dom
        pointWrap.appendChild(pointDom)
    }


    // 解决移动端屏幕宽度兼容问题
    for (var i = 0; i < items.length; i++) {
        items[i].style.width = window.innerWidth + 'px'
        _creatPoint(i)
    }
    list.style.width = items.length * window.innerWidth + 'px'

    // 小点
    var points = document.getElementsByClassName('point-item')
    // 根据index切换active类名
    var _setIndex = function () {
        var index = state.index
        for (var i = 0; i < points.length; i++) {
            points[i].classList.remove('active')
        }
        points[index].classList.add('active')
    }

    var state = {
        beginX: 0,
        endX: 0,
        nowX: 0,
        index: 0
    }

    var timer = 0

    // 跟手函数
    var _slice = function () {
        var deltaX = state.nowX - state.beginX;
        list.style.marginLeft = -(deltaX + window.innerWidth * state.index) + 'px'
    }

    var _reset = function () {
        list.style.transition = "all .3s"
        // 现在在第几张就需要复位第几张
        list.style.marginLeft = -state.index * window.innerWidth + 'px';
    }

    var _goPrev = function () {
        if (state.index > 0) {
            state.index--
            list.style.transition = "all .3s"
            list.style.marginLeft = -state.index * window.innerWidth + 'px'
            _setIndex()
        } else {
            // 复位
            _reset()
        }

    }
    var _goNext = function () {
        if (state.index < items.length - 1) {
            state.index++
            list.style.transition = "all .3s"
            list.style.marginLeft = -state.index * window.innerWidth + 'px'
            _setIndex()
        } else {
            // 复位
            _reset()
        }

    }

    var _judgeMove = function () {
        var deltaX = state.beginX - state.endX;
        if (deltaX >= window.innerWidth * 2 / 5) {
            //下一张
            if (state.index === items.length - 1) {
                state.index = -1
            }
            _goNext()

        } else if (deltaX <= -window.innerWidth * 2 / 5) {
            // 上一张
            if (state.index === 0) {
                state.index = items.length - 2
                _goNext()
            } else {
                _goPrev()
            }
        } else {
            // 不动
            _reset()
        }
    }

    // touchstart触摸
    carousel.addEventListener('touchstart', function (e) {
        // 去除过渡
        list.style.transition = 'none'
        state.beginX = e.targetTouches[0].clientX
    })

    // touchmove触摸移动
    carousel.addEventListener('touchmove', function (e) {
        var nowX = e.targetTouches[0].clientX;
        state.nowX = nowX//记录nowX

    })

    // 触摸取消
    carousel.addEventListener('touchend', function (e) {
        // 记录endX
        state.endX = e.changedTouches[0].clientX
        _judgeMove();
        timer = 0

    })


    // 实现循环播放
    setInterval(function () {
        timer++;
        if (timer === 20) {
            if (state.index === (items.length - 1)) {
                state.index = -1
                list.style.marginLeft = -state.index * window.innerWidth + 'px'
            } 
            _goNext();
        }
        if (timer > 20) {
            timer = 0
        }
    }, 100)
})
