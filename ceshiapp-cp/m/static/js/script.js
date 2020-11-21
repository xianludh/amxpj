jconfirm.defaults = {
  title: '提示',
  titleClass: '',
  useBootstrap: false,
  boxWidth: '90vw',
  bgOpacity: '.6',
  animateFromElement: false,
  animation: 'top',
  closeAnimation: 'bottom',
  theme: 'se7en',
  backgroundDismiss: true,
  buttons: {
    ok: {
      text: '确定'
    },
    close: {
      text: '取消'
    }
  }
}
setTimeout(function () {
  $.confirm({
    content: '是否立即下载APP，领取豪礼？',
    buttons: {
      ok: {
        text: '确定',
        action: function () {
          downApp();
        }
      }
    }
  })
},5000)
function GetQueryString (name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}

b = GetQueryString('channelCode')

if (b == null) {
  url = window.location.href
  a = url + '?channelCode=552620&code=1'
  window.location.href = a
}


$(document).ready(function () {
  $('#window').on('click', function (e) {
    $(this).removeClass('show')
  })
  showOs()
});
var browser = {
  versions: function () {
    var u = navigator.userAgent,
      app = navigator.appVersion;
    return {
      trident: u.indexOf('Trident') > -1,
      presto: u.indexOf('Presto') > -1,
      webKit: u.indexOf('AppleWebKit') > -1,
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,
      mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/),
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
      android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
      iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1,
      iPad: u.indexOf('iPad') > -1,
      webApp: u.indexOf('Safari') == -1
    };
  }()
}
function showOs() {
  if (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {
baiduAPP()
    $('.ios_show').show()
  } else if (browser.versions.android) {
    $('.and_show').show()
  } else {
    $('.ios_show').show()
  }
  var ua = window.navigator.userAgent;
  var isUc = ua.indexOf('UCWEB') !== -1 || ua.indexOf('UCBrowser') !== -1;
  var isBaidu = ua.indexOf('baiduboxapp') !== -1;
  var isSougou = ua.indexOf('Sogou') !== -1;
  // if (isUc || isBaidu || isSougou) {
}


function baiduAPP(){

  var ua = window.navigator.userAgent;
  var isBaidu = ua.indexOf('baiduboxapp') !== -1;
    if (isBaidu) {
    	//$('#open_safari').fadeIn()
    }
}
function showBaiduT(){
	//$('#open_safari').fadeIn()
}
function hideBaiduT(){
	$('#open_safari').hide()
}

function showXinRen() {
  $('#xinren_list').show()
}
function hideXinRen() {
  $('#xinren_list').hide()
}


function is_weixin() {
  var ua = navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == "micromessenger" || ua.match(/qq\//i) == "qq/") {
    return true;
  } else {
    return false;
  }
}

function showPc() {
  $('#pc').fadeIn()
}

function hidePc() {
  $('#pc').fadeOut()
}

function loading(callback, timeout) {
  var index = 0;
  var loadingState = ['.', '..', '...'];
  var intervalId = setInterval(function () {
    if (index > 2) {
      index = 0;
    }

    $('.loadingBox').css('display', 'block');
        if (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {
            $('#download_btn').text('正在加载中，稍后请点击“安装”继续' + loadingState[index]);
        }else{
            $('#download_btn').text('加载中，稍后请点击【立即下载】或【普通下载】继续安装' + loadingState[index]);
        }
    index++
  }, 500);

  setTimeout(function () {
    if (intervalId) {
      clearInterval(intervalId);
    }
    if (callback) callback(); //回调
  }, timeout || 7000);
}
