$(function () {
    $('#user').focus();
    $('#user,#password').on('input propertychange', addError).blur(addError)//input 输入 失去焦点时触发

    $('#log').click(loginTest)
    $("body").keydown(function(event) {
        if (event.keyCode == "13") { //keyCode=13是回车键
            loginTest()
        }
    });

})
//登录判断
function loginTest() {
    if ($('#user').attr('loading') == 'true' && $('#password').attr('loading') == 'true') {
        console.log('登录')//登录方法   
    } else {
        loginAddError()
        console.log('验证不通过')
    }
}
//输入框判断  空与16长度
function addError() {
    if ($(this).val() == '') {
        $(this).attr('loading', 'false').addClass('error').siblings('.errorS').html('* 用户名不能为空')
        if( $(this).prop('id')=='password'){
            $(this).siblings('.errorS').html('* 密码不能为空')
        }
    } else if($(this).val().length>=16){
        $(this).attr('loading', 'false').addClass('error')
       $(this).val($(this).val().substring(0,16)).siblings('.errorS').html('* 用户名长度不能超过16')
       if( $(this).prop('id')=='password'){
        $(this).siblings('.errorS').html('* 密码长度不能超过16')
    }
    }else{
        $(this).attr('loading', 'true').removeClass('error')
    }
}
//默认不输入  直接登录判断
function loginAddError(){
    if ($('#user').val() == '') {
        $('#user').attr('loading', 'false').addClass('error').focus().siblings('.errorS').html('* 用户名不能为空')
    } else if($('#password').val() == ''){
        $('#password').attr('loading', 'false').addClass('error').focus().siblings('.errorS').html('* 密码不能为空')
    }
}
//登录后台返回错误信息 展示     eg.  showErrorMsg('密码错误')
function showErrorMsg(str){
    $('.errorL').html('*'+str).show()
}

