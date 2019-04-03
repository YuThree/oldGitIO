getParamter(); //加载登陆页面时加载配置参数            调用master.js
ReLoadFunEnable(); //加载登陆页面时加载自定义功能参数  调用master.js
var thisC = getConfig("For6C");
var pra_new = "1";// 1表示DPC主菜单为新页面（index.html）,否则为旧页面（index.htm）
var C3_WJ = GetQueryString('C3_WJ');


$(function () {

    //logOut();


    var _h = $(window).height();
    var _pagebody_h = $('.pageBody').height();
    var _top = (_h - _pagebody_h) / 2;


    $('.pageBody').css('padding-top', _top);

    var checkbox = document.getElementById("rem_Password");


    //判断是否已经登录


    var LogoJson = getCurUser();

    if (LogoJson.loginId != "" && LogoJson.loginId != "undefined") {
        //window.location.href = "/C3/index.htm?userName=" + escape(LogoJson.loginId) + '&v=' + version;
        switch (thisC) {
            case "1C":
                window.location.href = "/C1/index.htm?userName=" + escape(LogoJson.loginId) + '&v=' + version;
                break;
            case "2C":
                if (window.screen.width == "1600") {
                    window.location.href = "/C2/PC/C2index.htm?userName=" + escape(LogoJson.loginId) + '&v=' + version;
                } else {
                    window.location.href = "/C2/index.htm?userName=" + escape(LogoJson.loginId) + '&v=' + version;
                }
                break;
            case "3C":
                WJSystem_inner = getConfig('WJSystem_inner');
                if (WJSystem_inner == "0") {
                    //window.location.href = "/C3/index.htm?userName=" + escape(LogoJson.loginId) + '&v=' + version;
                    window.location.href = "/C3/index_3C_new.html?userName=" + escape(LogoJson.loginId) + '&v=' + version;
                } else if (WJSystem_inner == "1") {
                    if (C3_WJ == '' || C3_WJ == undefined) {
                        C3_WJ = getCookie('C3_WJ');
                        if (C3_WJ == '' || C3_WJ == undefined) {
                            window.location.href = "/Common/DPCExcelAlarm/Problem.html?userName=" + escape(LogoJson.loginId) + '&isSubsystem_WJ=true&v=' + version;
                        } else {
                            C3_WJ = C3_WJ.split(";")[0];
                            if ('YuanDong' === C3_WJ) {
                                window.location.href = "/Common/YuanDong/YuanDong.htm?userName=" + escape(LogoJson.loginId) + '&isSubsystem_WJ=true&v=' + version;
                            } else if ('Problem' === C3_WJ) {
                                window.location.href = "/Common/DPCExcelAlarm/Problem.html?userName=" + escape(LogoJson.loginId) + '&isSubsystem_WJ=true&v=' + version;
                            } else {
                                window.location.href = "/Common/DPCExcelAlarm/Problem.html?userName=" + escape(LogoJson.loginId) + '&isSubsystem_WJ=true&v=' + version;
                            };
                        };
                    } else if ('YuanDong' === C3_WJ) {
                        window.location.href = "/Common/YuanDong/YuanDong.htm?userName=" + escape(LogoJson.loginId) + '&isSubsystem_WJ=true&v=' + version;
                    } else if ('Problem' === C3_WJ) {
                        window.location.href = "/Common/DPCExcelAlarm/Problem.html?userName=" + escape(LogoJson.loginId) + '&isSubsystem_WJ=true&v=' + version;
                    }
                } else {
                    //window.location.href = "/C3/index.htm?userName=" + escape(LogoJson.loginId) + '&v=' + version;
                    window.location.href = "/C3/index_3C_new.html?userName=" + escape(LogoJson.loginId) + '&v=' + version;
                }
                break;

            case "4C":
                if (window.screen.width == "1600") {
                    window.location.href = "/C4/PC/C4index.htm?userName=" + escape(LogoJson.loginId) + '&v=' + version;
                } else {
                    window.location.href = "/C4/index.htm?userName=" + escape(LogoJson.loginId) + '&v=' + version;
                }
                break;
            case "5C":
                if (window.screen.width == "1600") {
                    window.location.href = "";
                } else {
                    window.location.href = "";
                }
                break;
            case "6C":
                window.location.href = "/C6/index.htm?userName=" + escape(LogoJson.loginId) + '&v=' + version;
                break;
            case "DPC":
                if (pra_new == "1") {
                    if (window.screen.width == "1600") {
                        window.location.href = "/Common/Index/index.html?userName=" + escape(LogoJson.loginId) + "&teype=DP" + '&v=' + version;
                    } else {
                        window.location.href = "/Common/Index/index.html?userName=" + escape(LogoJson.loginId) + "&teype=PC" + '&v=' + version;
                    }
                } else {
                    if (window.screen.width == "1600") {
                        window.location.href = "/Common/Index/index.htm?userName=" + escape(LogoJson.loginId) + "&teype=DP" + '&v=' + version;
                    } else {
                        window.location.href = "/Common/Index/index.htm?userName=" + escape(LogoJson.loginId) + "&teype=PC" + '&v=' + version;
                    }
                };

                break;
        };
    }

    var userName = getConfig("userName");
    var userPwd = getConfig("userPwd");

    $('#username').val(userName);
    $('#password').val(userPwd);

    //读入数据
    var storage = window.localStorage;
    var getUser = storage["username"];
    var getPwd = storage["password"];

    $("#username").val(getUser);
    $("#password").val(getPwd);
    if (storage["verification"]) {
        $("#VerificationCode").val("******").attr("code", storage["verification"]);
    }
    if ($("#username").val() != null) {
        checkbox.checked = true;
    }
    if ($("#username").val() == "") {
        checkbox.checked = false;
    }


    //将cookie数据读入
    var username = getCookieValue('username');
    var password = getCookieValue('password');
    var rem_Password = getCookieValue('rem_Password');
    if ('true' === rem_Password) {
        $("#username").val(username);
        $("#password").val(password);
        $("#rem_Password").attr('checked', 'checked');
    } else {
        $("#rem_Password").removeAttr('checked');
    }

    switch (thisC) {
        case "1C":
            $('title,#title2').html("弓网综合检测数据终端");
            break;
        case "2C":
            $('title,#title2').html("车载接触网运行状态检测装置数据终端");
            break;
        case "3C":
            WJSystem_inner = getConfig('WJSystem_inner');
            if (WJSystem_inner == "0") {
                $('title,#title2').html("3C数据接收与分析终端");
            } else if (WJSystem_inner == "1") {
                if (C3_WJ == '' || C3_WJ == undefined) {
                    C3_WJ = getCookie('C3_WJ');
                    if (C3_WJ == '' || C3_WJ == undefined) {
                        $('title,#title2').html("6C问题库管理系统");
                    } else {
                        C3_WJ = C3_WJ.split(";")[0];
                        if ('YuanDong' === C3_WJ) {
                            $('title,#title2').html("远动问题库系统");
                        } else if ('Problem' === C3_WJ) {
                            $('title,#title2').html("6C问题库管理系统");
                        } else {
                            $('title,#title2').html("6C问题库管理系统");
                        };
                    }
                } else if ('YuanDong' === C3_WJ) {
                    $('title,#title2').html("远动问题库系统");
                } else if ('Problem' === C3_WJ) {
                    $('title,#title2').html("6C问题库管理系统");
                }
            } else {
                $('title,#title2').html("3C数据接收与分析终端");
            }
            break;
        case "4C":
            $('title,#title2').html("车载接触网运行状态检测装置数据终端");
            break;
        case "5C":
            $('title,#title2').html("接触网受电弓滑板检测监测数据终端");
            break;
        case "6C":
            $('title,#title2').html("变电设备运行状态智能监测数据终端");
            break;
        case "DPC":
            $('title,#title2').html("铁路供电安全检测监测数据处理中心");
            break;
    };
    $('#btn_close').click(function () {
        if (GetQueryString("btnClose") != null) {
            window.close();
        } else {
            //window.location = "/Common/login.htm";
            window.location = "/Common/login_new.htm";
        }

    });
    document.onkeydown = function (event) {
        var e = event ? event : (window.event ? window.event : null);
        if (e.keyCode == 13) {
            loginBtn();
        }
    };
    if (FunEnable('Fun_VerificationCode') == "True") {
        $(".IphoneCode").show();
        $(".loginBox>ul>li").eq(0).css("margin-top", "-20px");
    };
    $(".IphoneCode-btn").click(function () {  //获取验证码
        GetIphoneCode(this);
    });
    //下载谷歌浏览器
    $('#DownLoadBrowser').click(function () {
        url_Browser = "/Help/ChromeStandalone_57.0.2987.98_Setup.exe";
        Downer(url_Browser);
    })
});


//点击label实现功能
function Save() {
    var checkbox = document.getElementById("rem_Password");
    if ($("#rem_Password").attr("checked") != "checked") {
        checkbox.checked = true;
    } else {
        checkbox.checked = false; loginBox
        var username = "";
        var password = "";
        localStorage.setItem("username", username);
        localStorage.setItem("password", password);
    }
};
//点击checkbox实现功能
function checkSave() {
    if ($("#rem_Password").attr("checked") != "checked") {
        //勾选记住密码
        var username = "";
        var password = "";
        localStorage.setItem("username", username);
        localStorage.setItem("password", password);
    }
}


//用于判断新上报缺陷时间
function loginTime() {
    document.cookie = "AlarmListTime=" + datehhssNowStr();
};


function logOut() {
    var url = "/Common/MSystem/RemoteHandlers/LoginForm.ashx?type=logout";
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        cache: false,
        success: function (result) { }
    });
};

function loginBtn() {
    var loginName = $("#username").val();
    if (loginName == "") {
        setTimeout(function () {
            layer.alert('请输入用户名', { icon: 0 });
        }, 200);
        return false;
    }
    var password = $("#password").val();
    if (password == "") {
        setTimeout(function () {
            layer.alert('请输入密码', { icon: 0 });
        }, 200);

        return false;
    };
    if (FunEnable('Fun_VerificationCode') == "True") {
        var identify = $("#VerificationCode").val();
        if (identify == "******") {
            identify = $("#VerificationCode").attr("code");
        }
        if (identify == "") {
            setTimeout(function () {
                layer.alert('请输入六位验证码', { icon: 0 });
            }, 200);
            return false;
        }
    };

   


    window.location.href = "/C3/index_3C_new.html?userName=" + escape(loginName) + '&v=' + version;
    return true;
};
//获取验证码
function GetIphoneCode(obj) {
    var loginName = $("#username").val();
    if (loginName == "") {
        setTimeout(function () {
            layer.alert('请输入用户名', { icon: 0 });
        }, 200);
        return false;
    }
    $("#VerificationCode").val("");
    var _url = "/Common/MSystem/RemoteHandlers/LoginForm.ashx?type=identify&login_name=" + escape(loginName);
    $.ajax({
        type: "POST",
        url: _url,
        async: true,
        cache: false,
        success: function (data) {
            setTimeout(function () {
                layer.alert(data, { icon: 0 });
            }, 200);
            if (data == "生成并发送成功") {
                time(obj);
            }
        }
    });
};
var wait = 60;
function time(o) {
    if (wait == 0) {
        o.removeAttribute("disabled");
        o.style.cursor = "pointer";
        o.innerHTML = "获取验证码";
        wait = 60;
    } else {
        o.setAttribute("disabled", true);
        o.style.cursor = "default";
        o.innerHTML = "(" + wait + ")秒后重新获取";
        wait--;
        setTimeout(function () {
            time(o);
        },
        1000)
    }
};
