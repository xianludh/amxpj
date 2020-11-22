function getWyCode(){
    $.ajax({
        url: url+'getWYCode',
        type: 'get',
        success: function (res) {
            if(res.code==200){
                initCheck(res.data.CAPTCHA_ID)
            }
        }
    })
    
 }
function initCheck(id){
     let captchaIns;
     let that = this;
     initNECaptcha({
        element: '#captcha',
        captchaId: id,
        mode: 'embed',
        width: '320px',
        protocol:"https",
        enableClose:true,
        feedbackEnable:false,
         
         // 二次校验
         onVerify: function (err, data){
             let checkApi = {
                 userName:$('.username').val(),
                 NECaptchaValidate:data.validate
             }
             if (err) return
             if(data){
                 // 验证通过
                 $.ajax({
                    url: url+'checkWYCode',
                    type: 'post',
                    data:checkApi,
                    success: function (res) {
                        if(res.code==200){
                            console.log(res);
                            setTimeout(()=>{
                                safeStatus = false;
                                window.location.href = 'http://6669789.com';
                                $('.newBox3').css('display','none');
                                captchaIns.refresh();
                            },1000)
                        }else{
                            captchaIns.refresh();
                        }
                    }
                })
                 
             }
         }
         
     }, function (instance) {
         // 初始化成功后得到验证实例instance，可以调用实例的方法
        //  that.loadEnd = false;
         captchaIns = instance
     }, function (err) {
         // 初始化失败后触发该函数，err对象描述当前错误信息
     })
 }