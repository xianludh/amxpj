var url = 'http://fhcp.9161252.com:801/frontend/v1/';
var msgConfirm = false; // 短信验证
var imgConfirm = false; // 图片验证码
var codeIn = false; // 邀请码
var captcha_key = "";
var agent = null;
var incodeReadonly = false;
var params = {};
var register = [];
var hasSendMsg = false; 
var countDownTime = 60; // 倒计时时间
var codeImg = "./img/re.png"; // 验证码图片
var msgCode = ''; // 短信验证码
var code_imgcode = ''; // 图片验证码
var code_invitecode = ''; // 邀请码
var safeCheck = 0;
var safeStatus = false;
var Verify = 'slideVerify';
function isMobile() {
    return !!(navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    ))
}
    

function showTips(text){
    $('.tipsLog').show();
    $('.tips').text(text);
    setInterval(() => {
        $('.tipsLog').hide();
    }, 2500);
}
function GetQueryString(name) {
    return localStorage[name]
}
function testPhone(text) {
  return /^(0|86|17951)?(13[0-9]|14[56789]|15[012356789]|16[67]|17[01235678]|18[0-9]|19[1389])[0-9]{8}$/.test(text)
}
 // 短信验证码
function getMsgCode(){
    var phone = userInfo;
    if (!phone) {
        $('.tipsLog').show();
        $('.tips').text('请输入手机号');
    } else if (!testPhone(phone)) {
        showTips('请输入正确的手机号')
    } else {
        $.ajax({
            url: url+'getSmsCode?phone='+phone+"&device=pc",
            type: 'get',
            success: function (data) {
                if (data && data.code == 200) {
                    //2.获取验证码按钮变为无效,
                    hasSendMsg = true;
                    //3.出现倒计时 59S
                    $('#info').html(countDownTime);
                    $('#code').css('display','none');
                    $('#timeBox').css('display','block');
                    let countTimer = setInterval(() => {
                        countDownTime--;
                        if (countDownTime <= 0) {
                            hasSendMsg = false;
                            clearInterval(countTimer);
                            countDownTime = 60;
                            $('#code').css('display','block');
                            $('#timeBox').css('display','none');
                        }
                    }, 1000);
                    //4.表单提示: '验证码已发送,2分钟内输入有效'
                    //5.倒计时结束并消失 获取验证码按钮变为有效, 表单提示消失
                } else {
                    showTips(res.message)
                    return false
                }
            }
        })
    }
}

function getRandom (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// 获取图片验证码
function getCode() {
    if (!$('.username').val()) {
        return false
    }
    if ($('.username').val().length < 5) {
        showTips('请输入6位帐号');
        return false
    }
    $.ajax({
        url: url+'captcha?userName='+$('.username').val(),
        type: 'get',
        success: function (data) {
            captcha_key = data.data.captcha_key;
            $('.checkLoginCodeImage').attr('src',data.data.captcha_image_text)
        }
    })
}

// 预注册
function registerTest() {
        // 确认年龄框
    // if (!this.isCheckbox) {
    //     this.errorAlert("请确认您是否年满18周岁")
    //     return false
    // }
    if (!/^[0-9A-z]{6,10}$/i.test($('.username').val())) {
        showTips('请输入6位帐号');
        return false
    }
    console.log();
    let pwd = $('.userpwd').val().length >= 8 && $('.userpwd').val().length <= 20;
    if (!pwd) {
        showTips('密码8-20位数字或字母');
        return false
    }

    if ($('.userpwd').val() == $('.username').val()) {
        showTips('登录密码不能与帐号相同')
        return false
    }
    // if ($('.userpwd').val() !== $('.userpwdcon').val()) {
    //     alert('两次密码不一致')
    //     return false
    // }

    //当有短信验证码时需判断
    if (msgConfirm) {
        let reg = /^\d{6}$/;
        if ($('#msgCode').val() == 0) {
            showTips('请输入短信验证码')
            return false
        } else if ($('#msgCode').val().length !== 6) {
            showTips('请输入6位验证码')
            return false
        } else if (!reg.test($('#msgCode').val())) {
            showTips('短信验证码只能是数字!');
            return false
        }
    }
    //当短信验证码显示的时候不显示验证码
    if (imgConfirm && msgConfirm) {
        if ($('.imgCode').val().length == 0) {
            showTips('请输入验证码')
            return false
        } else if ($('.imgCode').val().length < 4 || $('.imgCode').val().length > 4) {
            showTips('请输入4位验证码')
            return false
        }
    }


    //如果还没获取验证码,需先获取
    if (msgConfirm) {
        if (!hasSendMsg) {
            showTips('请先发送正确的验证码')
            return false
        }
    }

    if (codeIn == true) {
        if (!$('.codeIn').val()) {
            showTips('请输入6位邀请码')
            return false
        }
        if ($('.codeIn').val().length < 6 || $('.codeIn').val().length > 6) {
            showTips('请输入6位邀请码')
            return false
        }
    }
    // if (!this.agree) {
    //     this.errorAlert('请确认同意各项开户条约,', 'warn')
    //     return false
    // }
    params.userName = $('.username').val();
    params.password = $('.userpwd').val();
    if (!msgConfirm) {
        if(imgConfirm){
            params.code = '6569'
        }else{
            params.code = $('.imgCode').val();
        }
    }

    params.sms = $('#msgCode').val();
    params.device = 'pc';
    params.captcha_key = captcha_key;

    let flag = true

    // 邀请码
    if ($('.codeIn').val()) {
        params.invite_code = $('.codeIn').val()
    }

    for (let i = 0; i < register.length; i++) {
        let ss = "."+register[i].className
        if (JSON.stringify(register[i]) !== '{}' && !$(ss).val() ) {
            showTips(register[i].placeholder)
            flag = false
            break
        }
        params[register[i].key] = $(ss).val()
    }
    console.log(params);
    if (!flag) {
        return false
    }
    // 邀请码
    if (agent) {
        params.agent = agent
        params.invite_code = agent
    }
    // http://localhost:4200/frontend/v1/checkUsername/aoger456
    $.ajax({
        url: url+'checkUsername/'+$('.username').val(),
        type: 'post',
        success: function (res) {
            if (res && res.code == 200) {} else {
                showTips('帐号已存在')
                return false
            }
        }
    })
    
    if(imgConfirm) {
        getImg();
        safeStatus = true;
        safeCheck = 1;
        if (safeStatus == true) {
            $('.newBox3').css('display','block');
        } else {
            $('.newBox3').css('display','none');
        }
        if (safeCheck == 1) {
            $('.checkBox').css('display','block');
        } else {
            $('.checkBox').css('display','none');
            $('.checkBox1').css('display','none');
        }
        setTimeout(()=>{
            safeCheck = 2;
            $('.checkBox').css('display','none');
            $('.checkBox1').css('display','block');
        },getRandom(1600,3200))
    }else{
        registerSubmit()
    }
}

// 注册提交
function registerSubmit() {
    // let vType = vType;
    for (let key in params) {
        if (!params[key]) delete params[key];
    }
    // let res = await postS(`userRegister`, params, vType)
    $.ajax({
        url: url+'userRegister',
        type: 'post',
        data:params,
        success: function (res) {
            if (res.code == 200) {
                showTips(res.message);
                window.location.href = 'http://fhcp.9161252.com:801/';
            } else {
                showTips(res.message);
                getCode();
            }
        }
    })
    
}