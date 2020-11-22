function getRem(design_w, unit) {
  var html = document.getElementsByTagName("html")[0];
  var real_w = document.documentElement.clientWidth;
  (real_w > design_w) && (real_w = design_w);
  html.style.fontSize = real_w / design_w * unit + "px";
}
window.onload = function () {
  getRem(750, 100);
}
window.onresize = function () {
  getRem(750, 100)
};

$.ajax({
  type: "get",
  dataType: "json",
  // url: `http://fhcp.9161252.com:801/json/UserIndex.json?t=${Date.now()}`,
  url: `/json/UserIndex.json?t=${Date.now()}`,
  success: function (result) {
    var serviceList = JSON.parse(result.config.siteConfig).service
    for (let i = 0; i < serviceList.length; i++) {
      if(serviceList[i].status === 'on') {
        $('.kefu_a').show()
        $('.kefu_a').attr('href',serviceList[i].url)
        return false
      }
    }
  },
  error: function (result) {
    layer.msg("请求超时");
  }
})

function checkUserForRegister(userName) {
  if (!userName) {
    layer.msg('帐号不能为空')
    return false
  } else if (!/^[A-z0-9]{6,10}$/.test(userName || '')) {
    layer.msg('帐号6-10位字母或数字')
    return false
  } else {
    return true
  }
}

function checkPassword(password) {
  if (!password) {
    layer.msg('密码不能为空')
    return false
  } else if (!/^[A-z0-9]{6,20}$/.test(password || '')) {
    layer.msg('密码6-20位字母或数字')
    return false
  } else {
    return true
  }
}

function checkPhone(phone) {
  if (!phone || !/^1[\d]{10}$/.test(phone)) {
    layer.msg("请输入正确的手机号");
    return false;
  }else {
    return true
  }
}

$(function () {
  $('.login-btn').click(function () {
    if (checkUserForRegister($('#username').val()) && checkPassword($('#password').val()) && checkPhone($('#phone').val())) {
      layer.load(1);
      $.ajax({
        type: "get",
        dataType: "json",
        // url: "http://fhcp.9161252.com:801/frontend/v1/getTCode",
        url: "/frontend/v1/getTCode",
        data: {
          userName: $('#username').val()
        },
        success: function (result) {
          if(result.code === 200) {
            layer.closeAll('loading');
            $('.verify_all').show()
            $('.slide-verify-img').attr("src",`${result.data.img1}`)
            $('.slide-verify-block').attr("src",`${result.data.img2}`)
          }
        },
        error: function (result) {
          layer.closeAll('loading');
          layer.msg("请求超时");
        }
      })
    }
  })
})