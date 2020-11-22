var containerActive = false; // container active class
var containerSuccess = false; // container success class
var containerFail = false; // container fail class
var canvasCtx = null;
var blockCtx = null;
var block = null;
var block_x = undefined; // container random position
var block_y = undefined;
var L = 42 + 10 * 2 + 3; // block real lenght
var img = undefined;
var originX = undefined;
var originY = undefined;
var isMouseDown = false;
var trail = [];
var sliderLeft = 0; // block right offset
var sliderMaskWidth = 0; // mask width
var imgPath = "";
var blockW = 110;
var blockH = 110;
var w = 620;
var h = 310;
var imgStatus = true;
function closes(){
    close1();
}
function close1(){
    safeStatus = false;
    $('.newBox3').css('display','none');
    safeCheck = 0;
    $('.checkBox').css('display','none');
    $('.checkBox1').css('display','none');
}
function getImg(){
    // let res = await getS(`getTCode`,{userName:this.$store.state.home.safeName});
    $.ajax({
        url: url+'getTCode?userName='+ $('.username').val(),
        type: 'get',
        success: function (res) {
            if(res.code==200){
                $('.default').css('display','none');
                imgPath = res.data
                draw_Img()
            }
        }
    })
 }
function draw_Img(){
    initImg("bg")
    initImg("block")
}
function init() {
  initDom();
  bindEvents();
}
function initDom() {
    block = $('.block')[0];
    $('.canvas')[0].width = w;
    $('.canvas')[0].height = h;
    block.width = 110;
    block.height = h;
    canvasCtx = $('.canvas')[0].getContext('2d');
    blockCtx = block.getContext('2d');
}
function initImg(type) {
    const img_ = createImg(() => {
        if(type=='bg') canvasCtx.drawImage(img_, 0, 0, w, h, 0, 0, w, h)
        else blockCtx.drawImage(img_,0,0,blockW, h,0,0,blockW, h)
    },type);
    img = img_;
}
function createImg(onload,type) {
    const img_d = document.createElement('img');
    img_d.crossOrigin = "Anonymous";
    img_d.onload = onload;
    img_d.onerror = () => {
         getImg()
    }
    if(type=='bg')  img_d.src =  imgPath.img1
    else img_d.src =  imgPath.img2
    return img_d;
}
function refresh() {
    reset()
}
function sliderDown() {
    originX = event.clientX;
    originY = event.clientY;
    isMouseDown = true;
}
function touchStartEvent(e) {
    originX = e.changedTouches[0].pageX;
    originY = e.changedTouches[0].pageY;
    isMouseDown = true;
}
function bindEvents() {
    document.addEventListener('mousemove', (e) => {
        if (!isMouseDown) return false;
        const moveX = e.clientX - originX;
        const moveY = e.clientY - originY;
        if (moveX < 0 || moveX + 125 >= w) return false;
        sliderLeft = moveX + 'px';
        $('.slide-verify-slider-mask-item').css('left',sliderLeft)
        let blockLeft = (w - 143) / (w - 164) * moveX;
        block.style.left = blockLeft + 'px';
        // containerActive = true; // add active
        $('.slide-verify-slider').addClass('container-active')
        sliderMaskWidth = moveX+20 + 'px';
        $('.slide-verify-slider-mask').css('width',sliderMaskWidth)
        trail.push(moveY);
    });
    document.addEventListener('mouseup', (e) => {
        if (!isMouseDown) return false
        isMouseDown = false
        if (e.clientX === originX) return false;
        // containerActive = false; // remove active
        $('.slide-verify-slider').removeClass('container-active')
         let spliced = verify();
            if(spliced){
                let data={
                    tnCode: spliced,
                    userName: $('.username').val()
                }
                $.ajax({
                    url: url+'checkTCode',
                    type: 'post',
		            data : data,
                    success: function (res) {
                        if (res.code === 200) {
                            // containerSuccess = true;
                            $('.slide-verify-slider').addClass('container-success');
                            window.location.href = 'http://fhcp.9161252.com:801/';
                            $('.newBox3').css('display','none');
                        } else {
                            // containerFail = true;
                            $('.slide-verify-slider').addClass('container-fail');
                            setTimeout(() => {
                                reset();
                            }, 1000);
                        }
                    }
                })
            }
    })
}

function touchMoveEvent(e) {
    if (!isMouseDown) return false;
    const moveX = e.changedTouches[0].pageX - originX;
    const moveY = e.changedTouches[0].pageY - originY;
    if (moveX < 0 || moveX + 164 >= w) return false;
    sliderLeft = moveX + 'px';
    $('.slide-verify-slider-mask-item').css('left',sliderLeft)
    let blockLeft = (w - 164 - 24) / (w - 164) * moveX;
    block.style.left = blockLeft + 'px';

    // containerActive = true;
    $('.slide-verify-slider').addClass('container-active')
    sliderMaskWidth = moveX+20 + 'px';
    trail.push(moveY);
}
function touchEndEvent(e) {
    if (!isMouseDown) return false
    isMouseDown = false
    if (e.changedTouches[0].pageX === originX) return false;
    // containerActive = false;
    $('.slide-verify-slider').removeClass('container-active')
    let spliced = verify();
    if(spliced){
        let data={
            tnCode: spliced,
            userName: this.$store.state.home.safeName
        }
        $.ajax({
            url: url+'checkTCode',
            type: 'post',
            data:$('.username').val(),
            success: function (res) {
                if(res.code==200){
                    $('.slide-verify-slider').addClass('container-success');
                    window.location.href = 'http://fhcp.9161252.com:801/';
                    $('.newBox3').css('display','none');
                    safeStatus=false;
                    return;
                }else{
                    // containerFail = true;
                    $('.slide-verify-slider').addClass('container-fail')
                    setTimeout(() => {
                        reset();
                    }, 1000);
                }
            }
        })
    }
}
function sum(x, y) {
    return x + y
}
function square(x) {
    return x * x
}
function verify() {
    const arr = trail; // drag y move distance
    const average = arr.reduce(sum) / arr.length; // average
    const deviations = arr.map(x => x - average); // deviation array
    const stddev = Math.sqrt(deviations.map(square).reduce(sum) / arr.length); // standard deviation
    const left = parseInt(block.style.left);
    return left;
}
function reset() {
    // containerActive = false;
    $('.slide-verify-slider').removeClass('container-active');
    $('.slide-verify-slider').removeClass('container-success');
    // containerSuccess = false;
    // containerFail = false;
    $('.slide-verify-slider').removeClass('container-fail');
    $('.slide-verify-slider-mask-item').css('left','0');
    $('.slide-verify-slider-mask').css('width','164px');
    sliderLeft = 0;
    block.style.left = 0;
    sliderMaskWidth = 0;
    let {
        w,
        h
    } = this;
    canvasCtx.clearRect(0, 0, w, h)
    blockCtx.clearRect(0, 0, 110, h)
    // this.block.width = w
    imgPath={}
    imgStatus=true
    getImg()
    // $emit('fulfilled')
}
