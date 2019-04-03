var att_v = 'v=' + version;

var _Width = $(window).width();
var _Height = $(window).height();

var att = "lightbox[iframe]=true&lightbox[width]=95p&lightbox[height]=90p&" + att_v;
var changePW = "lightbox[iframe]=true&lightbox[width]=386&lightbox[height]=255&" + att_v;

var debug = getConfig("debug");
var flag = false;
if ('0' === debug) {
    flag = false; //外部版本
} else {
    flag = true; //内部版本
}
var currentCategory = "";
//页面加载时的ajax
var starttime = '';//查询时间
var OldTime = ""; //开始时间
var NewTime = ""; //结束时间
var newurl = "/C3/PC/MRTA/Abnormal.html?starttime=&endtime=";
var Timer = 60000;  //刷新时间
var json = getCurUser();
localStorage['S_Cache_control_data'] = 'True';  //缓存控件数据，'True'表示第一次请求后台获取数据，重复请求时访问缓存数据；'False'表示每次请求后台获取数据，不访问缓存数据
$(function () {
    if (CurrentCateGory !== '5C') {
        $('.lightbox').lightbox();
    }
    document.getElementById("Iname").innerHTML = json.loginId + '(' + json.PersonName + ')';
    if (FunEnable('Fun_TaskManage') == "False") {
        $('.task').parent('a').attr('href', 'javascript:void(0)')
        $('.task').click(function () {
            layer.msg('该功能未开放！');
        })
    };
    if (FunEnable('Fun_GetData') == "False") {
        $('#_get_Data').parent('a').removeAttr('href').removeClass('lightbox')
        $('#_get_Data').click(function () {
            layer.msg('该功能未开放！', { icon: 2 })
        });
    };
   
    //退出系统
    $('#btn_close').click(function () {
        if (GetQueryString("btnClose") != null) {
            window.close();
        } else {
            logOut();
            window.location = "/Common/login_new.htm?v=" + version;
        }
    });
    $('#btn_help').attr('href', '/Help/Help.htm?CateGroy=3C' + '&' + att_v + '&lightbox[iframe]=true&lightbox[width]=90p&lightbox[height]=20p');

    //计算屏幕大小
    CountSize();

    //监听F11
    $(document).keyup(function (event) {
        if (event.keyCode == '122') {
            CountSize();
        }
    });

    //监听浏览器
    $(window).resize(function () {
        CountSize();
    });

    //判断内部版本
    if (FunEnable('Fun_duble') == "True") {
        $("#Abnormal").show();
        Creat_Abnormal();//生成双端降弓dom元素
        Abnormalinfo("");//第一次请求后台，时间为空
        AbnormalClick();//点击事件
    };

    $('.jquery-lightbox-button-close').click(function () {  //点击lightbox关闭按钮关闭双端降弓警告框
        $('#AbnormalAlert').animate({ "top": "-300px" });
        $("#Abnormal-font").text("0");
        $(".AbnormalAlert_font").text("0");
    });
});

$(document).ready(function () {
    $(".iframevideo").click(function () {
        var _w = $(window).width() / 4;
        var _h = $(window).height() / 4;
        $(".closeX").css({ position: "absolute", top: 0, left: _w * 3, zIndex: 9999, width: 29, height: 29, background: "url(/Lib/lightbox/images/jquery-lightbox-theme.png) no-repeat -190px -115px", cursor: "pointer" });
        $(".closeX").animate({ top: _h - 68 }, 500)
        $("#allp").show().css({ top: 0, left: 0, width: _w * 4, height: _h * 4, position: "fixed", zIndex: 9999, background: "rgba(0, 0, 0, 0.7)" });
        $('#play1').css({ top: 0, left: _w, width: _w * 2, height: 0, opacity: 0, position: "absolute", zIndex: 10500 });
        $('#play1').show();
        $('#play1').animate({ top: _h - 68, left: _w, opacity: 1, width: _w * 2, height: _h * 2 + 68 }, 500);
        $('#Iframe_bigPlay1,#Iframe_bigPlay2').css({ width: _w * 2, height: _h * 2 + 68 });
        document.getElementById('Iframe_bigPlay1').src = "/C3/PC/MLiveStreaming/MonitorLocoPlayNew.htm";
        $('#play3,#play4,#play4').css({ width: _w * 2, height: _h * 2 });
        $('#Iframe_bigPlay3,#Iframe_bigPlay4,#Iframe_bigPlay5').css({ width: _w * 2, height: _h * 2 });
        $(".closeX").show();
        AutoSize();
    });
    $(".button-back,.closeX").click(function () {
        $(this).hide();
        $("#allp").hide();
        $("#play3,#play4,#play5").hide();
        closeplay();
    });
    $(".closeX").hover(function () {
        $(this).css("background", "url(/Lib/lightbox/images/jquery-lightbox-theme.png) no-repeat -220px -115px")
    }, function () {
        $(this).css("background", "url(/Lib/lightbox/images/jquery-lightbox-theme.png) no-repeat -190px -115px")
    });
    

    showLayerBox('C5_dialog'); //C5首页弹出框
});

//监听浏览器
$(window).resize(function () {
    AutoSize();
});

/*/*
 * @desc 首页弹出列表
 * @param elementClass：绑定事件的元素class名称
 */
function showLayerBox(elementClass) {
    $('.' + elementClass, document).click(function () {
        var _url = $(this).attr('iframe-url');
        if ('' !== _url) {
            showIframeToIndex(_url, _Width * 0.95, _Height * 0.9);
        } else {
            return;
        }
    });
}

//有数据显示双端降弓警告框
function alertwindow() {
    $('#AbnormalAlert').animate({ "top": "4px" });
};

//生成双端降弓dom元素
function Creat_Abnormal() {
    var html = '<div id="AbnormalAlert"><a href="javascript:void(0);" style="text-decoration:none;"><span class="AbnormalAlert_img1"></span>异常提醒（<span class="AbnormalAlert_font">0</span>）</a><span class="AbnormalAlert_img2"></span></div>';
    $('body').append(html);

    $(".AbnormalAlert_img2").click(function () {  //点击关闭按钮
        Animate();
    });
};

//查询双端降弓数据
function Abnormalinfo(starttime) {
    var url = '/C3/PC/MDeviceStatus/RemoteHandlers/GetExceptionList.ashx?action=count&starttime=' + starttime;
    $.ajax({
        type: "GET",
        url: url,
        async: true,
        cache: false,
        success: function (result) {
            var _json = eval('(' + result + ')');
            OldTime = _json.data[0].starttime;
            NewTime = _json.data[0].endtime;
            starttime = _json.data[0].newest;

            $("#Abnormal-font").text(_json.data[0].count).attr("Time", starttime);
            $(".AbnormalAlert_font").text(_json.data[0].count).attr("Time", starttime);

            newurl = "/C3/PC/MRTA/Abnormal.html?starttime=" + OldTime + "&endtime=" + NewTime; //赋值新连接

            if (_json.data[0].count > 0) {  //有数据

                if ($('#AbnormalAlert').css("top") == "-300px" && parseInt($(".jquery-lightbox-move").css("top")) > 0) {  //有lightbox并且警告框在屏幕外
                    alertwindow();
                }
            };
        }
    });

    //过Timer时间刷新
    setTimeout("intervalTwo()", Timer);
};

//双端降弓事件
function AbnormalClick() {
    $("#AbnormalAlert a").click(function () {  //小弹窗点击
        $("#Abnormal-font").text("0");
        $(".AbnormalAlert_font").text("0");
        window.open(newurl);
    });
    $("#Abnormal").click(function () {  //主页点击
        $("#Abnormal-font").text("0");
        $(".AbnormalAlert_font").text("0");
        window.open(newurl);
    });
};

function closeplay() {
    var _w = $(window).width() / 4;
    var _h = $(window).height() / 4;
    var _left = 0 - _w;
    $('#allp').hide();
    $('#play1').animate({ top: _h - 68, left: _left, opacity: 0, width: 0, height: _h * 2 }, 1000);
    document.getElementById('Iframe_bigPlay1').src = "";
    document.getElementById('Iframe_bigPlay3').src = "";
    document.getElementById('Iframe_bigPlay4').src = "";
    document.getElementById('Iframe_bigPlay5').src = "";
}

function closeIframe() {
    $('.jquery-lightbox-button-close').click();
}

//第二次判断有无数据
function intervalTwo() {
    var STR = $(".AbnormalAlert_font").attr("Time");
    if (STR != undefined) {
        starttime = STR;
    }
    if (starttime != "") {
        Abnormalinfo(starttime);//有时间
    } else {
        Abnormalinfo("");//无时间
    };
};

//点击关闭按钮之后执行的函数
function Animate() {
    if ($('#AbnormalAlert').css("top") != "-300px") {
        $("#AbnormalAlert").animate({ top: '-300px' }, 1000);
    };
};

//计算屏幕大小
function CountSize() {
    var w = $(window).width() / 2;
    var h = $(window).height() / 2;

    $('#LeftTop').css('right', w - 5).css('bottom', h-10);
    $('#LeftBottom').css('right', w - 5).css('top', h+18);

    $('#RightTop').css('left', w + 5).css('bottom', h-10);
    $('#RightBottom').css('left', w + 5).css('top', h+18);

    var _w = $(window).width() / 4;
    var _h = $(window).height() / 4;

    var box_w1 = _w / 2 - 13 //$(window).width() * 0.10980;
    var box_w2 = box_w1 * 2;

    var box_h1 = $(window).height() * 0.185; // 0.23328;
    var box_h2 = box_h1 * 2 + 10;

    var box_h1d5 = box_h1 * 1.5; //1.5 用于下屏高度。

    $('.box1_1,.box1_1_BR').width(box_w1).height(box_h1);
    $('.box1_2,.box1_2_BR').width(box_w1).height(box_h2);

    $('.box2_1').width(box_w1 * 2 + 10).height((_h * 1.71 - 15) / 2);
    $('.box3_1').width(box_w1 * 3).height(box_h1);

    $('.box2_2').width(box_w2 + 10).height(box_h2);
    $('.box2_2_nomargin').width(box_w1 * 2 + 22).height(box_h1 * 2);
    $('.box1_2_nomargin').width(box_w1 * 1 + 12).height(box_h1 * 2);

    $('.box4_2').width(box_w1 * 4 + 30).height(box_h2);
    $('.box4_1').width(box_w1 * 4 + 30).height((_h * 1.71 - 15) / 2);

    $('.boxAddH').height(box_h1d5);

    $('.addw10').width($('.addw10').width() + 10);
    $('.addw20').width($('.addw20').width() + 20);

    $("#Bottom .box1_1").height();

    var img_1wh = box_h1 * 0.5;
    var img_2wh = box_w2 * 0.5;

    $('.box1_1 img,.box1_1_BR img').width(img_1wh).height(img_1wh)

    $('.box2_1 img').width(img_1wh).height(img_1wh)
    $('.box3_1 img').width(img_1wh).height(img_1wh)
    $('.box2_2 img').width(img_2wh).height(img_2wh);
    $('.box4_1 img').width(img_1wh).height(img_1wh);

    var img_h = $('.box1_1 img').height();

    if (img_h == null) {
        img_h = $('.box2_1 img').height();
    }

    var txt_h = $(window).height() * 0.026604;  //20px;
    $('.menuTitle').css("font-size", txt_h + "px");
    $('.tb_menu2 a').css("font-size", txt_h * 0.545 + "px");

    $('.boxAddH img').css("margin-top", (box_h1d5 - img_h - txt_h) / 2);

    $('.box1h').height((_h * 1.71 - 15) / 2);
    $('.box2h').height(_h * 1.71);

    $('.box1_8h').height(_h * 1.71);
    $('.box1_8h_6c').height(_h * 1.65);

    $('.box1h_6c').height((_h * 1.65 - 10) / 2);

    $('.box3h').height(((_h * 1.71 - 12) / 2) + (_h * 1.71)).css({ "left": -($('.box1_8h_6c').width() + 10), "position": "absolute" }); //1,2,4C一杆一档的宽高调整

    $('.box0_8h').height(_h * 0.525);

    $('.box0_9h').height((_h * 1.73 - 15) / 2);

    $('.box0_8h img').height(60);

    $('.box2_2 img').not(".gis img").css("margin-top", (box_h2 - img_h * 2 - txt_h) / 2);
    var _h1_2 = $('.box1_2').height();
    $('.box1_2 img').not(".gis img").css("margin-top", (box_h2 - img_h * 2 - txt_h) / 2);
    var _h2_1 = $('.box2_1').height();
    //$('.box2_1 img').not(".gis img").css("margin-top", ((box_h1 - img_h) / 2) - 18);
    $('.box2_1 img').css("margin-top", ((box_h1 - img_h) / 2) - 18);
    $('.box3_1 img').css("margin-top", (box_h1 - img_h - txt_h) / 2);
    $('.box1_1 img,.box1_1_BR img').css("margin-top", (box_h1 - img_h - txt_h) / 2);
    $('.box4_1 img').css("margin-top", (box_h1 - img_h - txt_h) / 2);

    $('.box0_9h img').not(".gis img").css("margin-top", (box_h1 * 0.72 - img_h) / 2);

    $('.gis a').css("padding-top", "0px")
    $('.gis a img').css("margin", "0px")

    //$('.j5').height($('.j5').height() - 5);

    $('.box1_8h_6c img').width($('.box1_8h_6c').width() / 3).height($('.box1_8h_6c').height() / 3).css("margin-top", $('.box1_8h_6c').height() / 6).css("margin-left", $('.box1_8h_6c').width() / -6);

    $('.box3h img').width($('.box3h').width() / 3).height($('.box3h').height() / 3).css("margin-top", $('.box3h').height() / 6).css("margin-left", $('.box3h').width() / -6);

    $(".small>img").css("margin-top", ($('.small').height() - $('.small img').height()) / 2).css("margin-left", $('.small img').width() / -2)

    //start：C5首页模块布局
    if (CurrentCateGory === '5C') {
        //start：C5首页模块样式 w:480 , h:243.5
        $('.box1_5c').width(_w * 1.46).height(_h * 1.75);//左上 w:704（1.46）,h:428（1.75）
        $('.box2_5c').width(_w * 1.01).height(_h * 1.75);//右上 w:488（1.01）,h:428（1.75）
        $('.box3_5c').width(_w * 1.46).height(_h * 0.887);//左下 w:704（1.46）,h:216（0.887）
        $('.box4_5c').width(_w * 1.01).height(_h * 0.887);//右下 w:488（1.01）,h:216（0.887）

        $('.box1_5c img').css({
            'width': $('.box1_5c').width() / 5,
            'height': 'auto',
            'margin-top': $('.box1_5c').height() / 3.5,
            'margin-left': -($('.box1_5c').width() / 11)
        });
        $('.box2_5c img').css({
            'width': $('.box2_5c').width() / 4,
            'height': 'auto',
            'margin-top': $('.box2_5c').height() / 3.1,
            'margin-left': -($('.box2_5c').width() / 9)
        });
        $('.box3_5c img').css({
            'width': $('.box3_5c').width() / 6,
            'height': 'auto',
            'margin-top': $('.box3_5c').height() / 4,
            'margin-left': ($('.box3_5c').width() / 2.3)
        });
        $('.box4_5c img').css({
            'width': $('.box4_5c').width() / 4,
            'height': 'auto',
            'margin-top': $('.box4_5c').height() / 3.5,
            'margin-left': ($('.box4_5c').width() / 2.7)
        });
        //end：C5首页模块样式

        $('#LeftTop').css('right', w - 113).css('bottom', h - 20);
        $('#LeftBottom').css('right', w - 113).css('top', h + 25);

        $('#RightTop').css('left', w + 113).css('bottom', h - 20);
        $('#RightBottom').css('left', w + 113).css('top', h + 25);
    }
    //end：C5首页模块布局
}

//退出系统
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

//设置iframe标签宽高度
function AutoSize() {
    var _h = $(window).height() / 4;
    var _w = $(window).width() / 4;
    $('#iframe_map,#box_map').height(_h * 4).width(_w * 3);
    $('#iframe_alarm,#box_alarm').height(_h * 4).width(_w * 1);
    $('#iframe_loca,#box_loca').height(_h * 1).width(_w * 3);
    //新添加的多屏按钮
    $(".div_look").css({ "left": _w * 3 - 140, "top": _h * 3 - 40, })

    $('#LockBox').css("right", _w)

    if (window.frames["Iframe_bigPlay1"].autosize != undefined) {
        window.frames["Iframe_bigPlay1"].autosize();
    }

    $('#ImgTypeBox').css('top', _h * 2 + 8).css('left', 0);
    $('#ImgTypeBox>div').height(28);
    _wAll = $(window).width();
    _hAll = $(window).height();
    var _imgTypeBox_h = $('#ImgTypeBox').outerHeight();
    if (_imgTypeBox_h > _h) {
        $('#ImgTypeBox').css('top', $('#ImgTypeBox').css('top') - (_imgTypeBox_h - _h));
    }

    if (_wAll < 1600) {
        var f1 = $(window).height() * 0.031104;  //20px;
        var f2 = $(window).height() * 0.021104;

        $('#ItemBox li').css({ 'font-size': f1 + 'px', 'padding': '1% 2% 1%' })
        $('.ItemBox_content').css({ 'font-size': f2 + 'px' })
    }

    $('#ItemBox').css('left', _w * 2 + 5).width(_w - 5).height(_h * 2.6 - 5);

    $('#play1').css({ top: _h - 68 });
    $('#play2').css({ width: _w * 2, height: _h * 2 + 68 });
    $('#play3').css({ width: _w * 2, height: _h * 2 });
    $('#play4').css({ width: _w * 2, height: _h * 2 });
    $('#play5').css({ width: _w * 2, height: _h * 2 });

    $('#Iframe_bigPlay1').css({ width: _w * 2, height: _h * 2 + 68 });
    $('#Iframe_bigPlay3,#Iframe_bigPlay4,#Iframe_bigPlay5').css({ width: _w * 2, height: _h * 2 });
    $('#Iframe_bigPlay1_gis').css({ width: _w * 2, height: _h });

    $('#allp').width(_w * 4).height(_h * 4);

    //判断iframe本身的高度
    if ($("#play1").css("left") == "0px" && $("#play4").css("display") == "none") {
        $('#play1').css({ top: 0 });
        $("#Iframe_bigPlay1").css({ width: $(window).width(), height: $(window).height() });
    };
    if ($("#play1").css("left") == "0px" && $("#play4").css("display") == "block") {
        $('#play1').css({ top: 0 });
    };
    if ($("#play3").css("left") == "0px" && $("#play3").css("top") == "0px") {
        $("#Iframe_bigPlay3").css({ width: $(window).width(), height: $(window).height() });
    };
    if ($("#play4").css("left") == "0px" && $("#play4").css("top") == "0px") {
        $("#Iframe_bigPlay4").css({ width: $(window).width(), height: $(window).height() });
    };
    if ($("#play5").css("left") == "0px" && $("#play5").css("top") == "0px") {
        $("#Iframe_bigPlay5").css({ width: $(window).width(), height: $(window).height() });
    };

    //刷新iframe里面内容的大小
    if ($("#Iframe_bigPlay1").contents()[0].defaultView.autosize != undefined)
        $("#Iframe_bigPlay1").contents()[0].defaultView.autosize();

    if ($("#Iframe_bigPlay3").contents()[0].defaultView.autosize != undefined)
        $("#Iframe_bigPlay3").contents()[0].defaultView.autosize();

    if ($("#Iframe_bigPlay4").contents()[0].defaultView.autosize != undefined)
        $("#Iframe_bigPlay4").contents()[0].defaultView.autosize();

    if ($("#Iframe_bigPlay5").contents()[0].defaultView.autosize != undefined)
        $("#Iframe_bigPlay5").contents()[0].defaultView.autosize();
}

//设置首页标签
function GetLi(names) {
    var re = '';
    //基础数据组
    if (names.indexOf('line') > -1) {
        re += '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/Common/MFoundation/LineList.htm?' + att + '" class="i_manage lightbox aa1">线路管理</a></li>'
    }
    if (names.indexOf('pole') > -1) {
        re += '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/Common/MFoundation/PoleList.htm?' + att + '" class="i_manage lightbox aa1">支柱管理</a></li>'
    }
    if (names.indexOf('position') > -1) {
        re += '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/Common/MFoundation/PositionList.htm?' + att + '" class="i_manage lightbox aa1">区/站管理</a></li>'
    }
    if (names.indexOf('Locomotive') > -1) {
        re += '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/Common/MFoundation/LocomotiveList.htm?' + att + '" class="i_manage lightbox aa1">设备管理</a></li>'
    }
    if (names.indexOf('LocationInfo') > -1 && FunEnable('Fun_LocationDatabase') == "True") { //如果存在定位数据库功能
        re += '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/Common/MFoundation/LocationInfoList.htm?' + att + '" class="i_manage lightbox aa">定位数据库</a></li>'
    }
    if (names.indexOf('CrossList') > -1 && FunEnable('Fun_LKJDataManagement') == "True") {  //如果存在LKJ数据管理功能
        re += '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/Common/MFoundation/CrossList.htm?' + att + '" class="i_manage lightbox aa">LKJ数据管理</a></li>'
    }
    //6c
    if (names.indexOf('device6c') > -1) {
        re += '<li><a href="/Common/MFoundation/C6_DeviceList.htm?' + att + '" class="i_manage lightbox aa">设备管理</a></li>'
    }
    if (names.indexOf('substation') > -1) {
        re += '<li><a href="/Common/MFoundation/SubstationList.htm?' + att + '" class="i_manage lightbox aa">变电所管理</a></li>'
    }
    if (names.indexOf('CurrentFault') > -1) {
        re += '<li><a href="/C6/PC/MFoundation/CurrentFault.htm?' + att + '"  class="i_manage lightbox aa">电流致热设备判据</a></li>'
    }
    if (names.indexOf('DeviceContral') > -1) {
        re += '<li><a href="/C6/PC/MFoundation/DeviceContral.htm?' + att + '" class="i_manage lightbox aa">高压开关设备和控制设备</a></li>'
    }
    if (names.indexOf('VoltageFault') > -1) {
        re += '<li><a href="/C6/PC/MFoundation/VoltageFault.htm?' + att + '" class="i_manage lightbox aa">电压致热设备缺陷诊断判据</a></li>'
    }
    //系统管理组 org,user,dictionary
    if (names.indexOf('org') > -1) {
        re += '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/Common/MFoundation/OrganizationList.htm?' + att + '"  class="lightbox aa1">组织机构</a></li>'
    }
    if (names.indexOf('orgm') > -1) {
        re += '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/Common/MFoundation/DutyRangeList.htm?' + att + '" class="lightbox aa1">组织管辖</a></li>'
    }
    if (names.indexOf('dataPermisson') > -1) {
        re += '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/Common/MSystem/DataPermissonList.htm?' + att + '" class="lightbox aa1">数据权限</a></li>'
    }
    if (names.indexOf('Permission') > -1) {
        re += '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/Common/MSystem/Permission.htm?category=' + currentCategory + '&' + att + '" class="lightbox aa1">页面权限</a></li>'
    }
    //if (names.indexOf('Permission') > -1) {
    //    re += '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/test/test.htm?category=' + currentCategory + '&' + att + '" class="lightbox aa1">测试</a></li>'
    //}
    if (names.indexOf('user') > -1) {
        re += '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/Common/MFoundation/UserList.htm?' + att + '" class="lightbox aa1">人员管理</a></li>'
    }
    if (names.indexOf('dictionary') > -1 && FunEnable('Fun_DataDictionary') == "True") { //如果存在数据字典功能
        re += '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/Common/MFoundation/SysDictionaryList.htm?' + att + '" class="lightbox aa1">数据字典</a></li>'
    }
    if (names.indexOf('log') > -1) {
        re += '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/Common/MSystem/LogList.htm?' + att + '" class="lightbox aa1">日志查看</a></li>'
    }
    if (names.indexOf('menu') > -1 && FunEnable('Fun_MenuManagement') == "True") {  //如果存在菜单管理功能
        re += '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/Common/MSystem/FunMenuList.htm?category=' + currentCategory + '&' + att + '" class="lightbox aa1">菜单管理</a></li>'
    }
    if (names.indexOf('Paramter') > -1 && FunEnable('Fun_ParameterManagement') == "True") {  //如果存在参数管理功能
        re += '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/Common/MParameter/ParameterList.htm?' + att + '" class="lightbox aa1">参数管理</a></li>'
    }
    if (names.indexOf('Mail') > -1) {
        re += '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/Common/Mail/MailList.htm?' + att + '" class="lightbox aa1">短信管理</a></li>'
    }
    if (names.indexOf('password') > -1) {
        re += '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/Common/Index/changePW.html?' + changePW + '" class="lightbox aa1">修改密码</a></li>'
    }
    //4C 地面软件大小4C切换
    if (names.indexOf('C4Big') > -1) {
        re += '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="OpenC4Big:" class="aa1">大4C</a></li>'
    }
    if (names.indexOf('C4Small') > -1) {
        re += '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="OpenC4Small:" class="aa1">小4C</a></li>'
    }
    return re;
}

//className:box1_1 ,box2_1,box3_1,box2_2
//category:1C,2C,3C,4C,5C,6C,DPC
//type:fault,alarm,task
//涉及功能的注释块：C1功能、C2功能、C3功能、C4功能、C5功能、C6功能、DPC功能、公共功能
function GetItem(className, category, type, menu2list) {
    var re = "";
    var category2 = category.toLowerCase();
    currentCategory = category;
    var urlName = "";
    if (getConfig('SubstationNumber') == "1") {
        urlName = "OneSubstationRealTimeMonitring.htm";
    } else {
        urlName = "SubstationRealTimeMonitring.htm";
    }

    var category_titleEx = '';//'【' + category + '】'; //功能标题后缀

    switch (type) {
        //--------------------------------------------- C1功能 ---------------------------------------------
        //在公共功能里
        //--------------------------------------------- C2功能 ---------------------------------------------
        //在公共功能里
        //--------------------------------------------- C3功能 ---------------------------------------------
        case "mrta3C": //C3, 实时监控
            var _w = $(window).width();
            //if (_w < 1920) {
            //    re = '<div class="mrta ' + className + '">\
            //            <a href="/C3/PC/MRTA/MonitorIndexThree1.aspx?' + att_v + '"  target="_blank">\
            //                <img src="/Common/Index/images/moduleLogo/i_jiank.png" />\
            //                <div class="menuTitle">在线实时检测' + category_titleEx + '</div>\
            //            </a>\
            //        </div>';
            //}
            //else {
            //大屏版。
            re = '<a href="/C3/PC/MRTA/mrta_big.htm?' + att_v + '"  target="_blank">\
                    <div class="mrta ' + className + '">\
                        <img src="/Common/Index/images/moduleLogo/在线实时检测.png" class="myIMG1"/>\
                        <div class="menuTitle">在线实时检测' + category_titleEx + '</div>\
                    </div>\
                </a>';
            // }
            break;
        case "GJ": //C3, 设备轨迹
            if (GetIsPowerOrg() != "1") {
                re = ' <a href="/C3/PC/MDetectionOfTrace/MonitorLocGJList.htm?' + att + '" class="lightbox">\
                            <div class="GJ  ' + className + '">\
                                  <img src="/Common/Index/images/moduleLogo/监测运行轨迹.png" class="myIMG"/>\
                                  <span class="menuTitle">检测运行轨迹' + category_titleEx + '</span>\
                            </div>\
                        </a>';
            } else {
                re = '<a href="/C3/PC/MDetectionOfTrace/MonitorLocGJList_New.htm?' + att + '" class="lightbox">\
                        <div class="GJ  ' + className + '">\
                            <img src="/Common/Index/images/moduleLogo/监测运行轨迹.png" class="myIMG"/>\
                            <span class="menuTitle">检测运行轨迹' + category_titleEx + '</span>\
                        </div>\
                    </a>';
            }
            break;
        case "deviceStatus3C": //C3, 设备状态
            //            if (FunEnable('Fun_LOCSTATE_NEW') == "True") {
            if (GetIsPowerOrg() != "1") {
                re = '<a href="/C3/PC/MDeviceStatus/MonitorLocoStateListNew.htm?' + att + '" class="lightbox">\
                        <div class="device3C  ' + className + '">\
                                <img src="/Common/Index/images/moduleLogo/设备状态监测.png" class="myIMG"/>\
                                <span class="menuTitle">设备状态监测' + category_titleEx + '</span>\
                        </div>\
                     </a>';
            } else {
                re = '<a href="/C3/PC/MDeviceStatus/MonitorLocoStateList_New.htm?' + att + '" class="lightbox">\
                        <div class="device3C  ' + className + '">\
                            <img src="/Common/Index/images/moduleLogo/设备状态监测.png" class="myIMG" />\
                            <span class="menuTitle">设备状态监测' + category_titleEx + '</span>\
                        </div>\
                    </a>';
            }
            break;
        case "video": //C3, 视频直播
            re = '<div class="video ' + className + '">\
                        <a href="#" class="iframevideo" style="display:block;height:100%;">\
                            <img src="/Common/Index/images/moduleLogo/车顶实时监测.png" class="myIMG"/>\
                            <span class="menuTitle">车顶实时监测' + category_titleEx + '</span>\
                       </a>\
                </div>\
                <div id="allp" style="display: none;">\
                    <div id="play1" style="display: none;">\
                        <iframe class="box1-1" id="Iframe_bigPlay1" name="Iframe_bigPlay1" scrolling="no" src="" frameborder="0"></iframe>\
                    </div>\
                    <div id="play3" style="display: none;position: absolute;z-index: 10500;">\
                        <iframe class="box1-1" id="Iframe_bigPlay3" name="Iframe_bigPlay3" scrolling="no" src="" frameborder="0"></iframe>\
                    </div>\
                    <div id="play4" style="display: none;position: absolute;z-index: 10500;">\
                        <iframe class="box1-1" id="Iframe_bigPlay4" name="Iframe_bigPlay4" scrolling="no" src="" frameborder="0"></iframe>\
                    </div>\
                    <div id="play5" style="display: none;position: absolute;z-index: 10500;">\
                        <iframe class="box1-1" id="Iframe_bigPlay5" name="Iframe_bigPlay5" scrolling="no" src="" frameborder="0"></iframe>\
                    </div>\
                    <div class="closeX"></div>\
                </div>';
            break;
        case "intelligence_3c": //C3, 智能分析
            var result = "";
            //if (FunEnable('Fun_RepeatedAlarmAnalysis') == "True") {
            //    //存在重复报警分析功能。
            //    result += '<li><a href="/Common/MDataAnalysis/RepeatAlarm.htm?' + att + '" target="_blank">重复报警分析</a></li>';
            //};
            if (FunEnable('Fun_DefectTemperatureAnalysis') == "True") {
                //存在缺陷温度分析功能。
                result += '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/C3/PC/MRTA/Celsius.htm?' + att + '" class="lightbox aa2">缺陷温度分析</a></li>';
            };
            //if (FunEnable('Fun_RunStatus') == "True") {
            //    //存在缺陷温度分析功能。
            //    result += '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/Report/RunStatusReport.htm?' + att + '" class="lightbox aa2">设备运行状态监控</a></li>';
            //};
            //if (FunEnable('Fun_LineDefectAnalysis') == "True") {
            //    //存在线路缺陷分析功能。
            //    result += '<li><a href="/C3/PC/MRTA/C3Bar.htm?type=ALL&' + att + '" class="lightbox aa2">线路缺陷分析</a></li>';
            //};
            //if (FunEnable('Fun_AlarmAnalysisAndStatistics') == "True") {
            //    //存在报警分析统计功能。
            //    result += '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/C3/PC/MAlarmMonitoring/MonitorLocoAlarmListFXTJ.htm?' + att + '" class="lightbox aa2">报警分析统计</a></li>';
            //};
            //if (FunEnable('Fun_AlarmAnalysisLog') == "True") {
            //    //存在报警分析日志功能。
            //    result += '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/C3/PC/MAlarmMonitoring/MonitorLocoAlarmListFX.htm?' + att + '"  class="lightbox aa2">报警分析日志</a></li>';
            //};
            if (FunEnable('Fun_StateAnalysisLog') == "True") {
                //存在状态分析日志功能。
                result += '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/C3/PC/MDeviceStatus/MonitorLocoStateListFX.htm?' + att + '"  class="lightbox aa2">状态分析日志</a></li>';
            };
            if (FunEnable('Fun_VerificationTool') == "True") {
                //存在验证工具功能。
                result += '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a  target="_blank" href="/Common/MGIS/Verify.html?' + att + '"    class="aa2">验证工具</a></li>';
            };
            //if (FunEnable('Fun_EquipmentStatistics') == "True") {
            //    //存在设备运行状态统计功能。
            //    result += '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/Report/RunStatus.htm?' + att + '"  class="lightbox aa2">设备运行状态统计</a></li>';
            //};
            if (FunEnable('Fun_OneGear') == "True" && window.location.href.indexOf('index_3C_new') <0) {
                //存在一杆一档功能。
                result += '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a target="_blank" href="/Common/MOnePoleData/home.htm?category=3C&' + att + '"  class="aa2">一杆一档</a></li>';
            };
            if (FunEnable("Fun_isCRH") == 'True') {
                if (FunEnable('Fun_LineAlarm') == "True") {
                    //存在  线路缺陷分析  功能。
                    result += '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/C3/PC/MRTA/C3Bar.htm?type=ALL&' + att + '" class="lightbox aa2">线路缺陷分析</a></li>';
                };
            }
           
            if (FunEnable('Fun_MileageCount') == "True") {
                //存在  设备检测里程统计  功能。
                result += '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a target="_blank" href="/C3/PC/MMileageCount/mileageCount.htm?' + att + '" class="aa2">设备检测里程统计</a></li>';
            };
            if (FunEnable('Fun_AlarmDelayAnalysisDetails') == "True") {
                //存在报警延时分析详情功能。
                result += '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a target="_blank" href="/Common/MAlarmMonitoring/AlarmDelayDetails.htm?category=3C&' + att + '"  class="aa2">报警延时分析详情</a></li>';
            };
            if (FunEnable('Fun_Alarm_delay_Analysis') == "True") {
                //存在  报警延时统计分析  功能。
                result += '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a target="_blank" href="/Common/MAlarmMonitoring/Alarm_delay_analysis.html?' + att + '" class="aa2">报警延时统计分析</a></li>';
            };
            if (FunEnable('Fun_AlarmStatisticalTrend') == "True") {
                //存在统计报警数量趋势功能。
                result += '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a target="_blank" href="/Common/MAlarmMonitoring/AlarmStatisticalTrend.htm?category=3C&' + att + '"  class="aa2">统计报警数量趋势</a></li>';
            };
            if (FunEnable('Fun_AlarmStatistical_PowerSupply') == "True") {
                //存在供电管辖报警统计功能。
                result += '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a target="_blank" href="/Common/MAlarmMonitoring/AlarmStatistical_PowerSupply.htm?category=3C&' + att + '"  class="aa2">供电管辖报警统计</a></li>';
            };
            if (FunEnable('Fun_GisMapfind') == "True") {
                //存在地图查找点功能。
                result += '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a target="_blank" href="/Common/MOnePoleData/getGisPoint.html?category=3C&' + att + '"  class="aa2">GPS定位查找</a></li>';
            };
            if (FunEnable('Fun_Arc_Analysis') == "True") {
                //燃弧分析
                result += '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a target="_blank" href="/Common/MAlarmMonitoring/AlarmArcingAnalysis.html?category=3C&' + att + '"  class="aa2">燃弧分析</a></li>';
            };
            //if (FunEnable('Fun_HardDisk_Data') == "True") {
            //    //硬盘数据管理
            //    result += '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a target="_blank" href="/Common/MAlarmMonitoring/hardDiskData_new.html?category=3C&' + att + '"  class="aa2">硬盘数据管理</a></li>';
            //};
            if (FunEnable('Fun_LineCoverge') == "True") {
                //线路覆盖
                result += '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a target="_blank" href="/Common/LineCoverage/LineCoverage.html?category=3C&' + att + '"  class="aa2">线路覆盖</a></li>';
            };
            //if (FunEnable('Fun_IsAbnormity') == "True") {
            if(flag){
                //正常数据
                result += '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a target="_blank" href="/C3/PC/MAlarmMonitoring/MonitorLocoAlarmList.htm?IsAbnormity=0&category=' + category + '&data_type=ALARM&' + att + '" class="lightbox aa2"">正常报警数据</a></li>';
            };
            re = '<a href="#">\
                    <div class="intelligence flip_zzj ' + className + '" id="sj">\
                        <img src="/Common/Index/images/moduleLogo/数据分析.png" class="myIMG"/>\
                        <span class="menuTitle" style="margin: 1%;">数据分析' + category_titleEx + '</span>\
                    </div>\
                 </a>\
                 <div class="intelligence  ' + className + '" id="sj2" style="display: none">\
                     <ul class="tb_menu2 "><li class="cfbjfx"><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/Common/MDataAnalysis/RepeatAlarm.htm?' + att + '" class="aa2" target="_blank">重复报警分析</a></li>\
                         ' + result + '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/Report/comprehensiveAnalysis.htm?Category_Code=' + category+'&' + att + '" class="i_manage lightbox aa2">缺陷多维分析</a></li><li><a href="#" id="sj_return" class="a_return cfReturn">返回</a></li>\
                     </ul>\
                 </div>';
            break;
        case "problem_3c"://C3, 问题库管理
            re = '<a href="/Common/DPCExcelAlarm/Problem.html?dataType=' + '&' + att + '&isSubsystem_WJ=false" target="blank">\
                    <div class="problem_3c ' + className + '">\
                        <img src="/Common/Index/images/moduleLogo/问题库管理.png" class="myIMG" />\
                        <span  class="menuTitle">6C问题库管理</span>\
                    </div>\
                 </a>';
            break;
        case "fault3c": //C3, 缺陷库
            re = '<a href="/C3/PC/MAlarmMonitoring/MonitorLocoAlarmList.htm?category=' + category + '&data_type=FAULT&' + att + '" class="lightbox">\
                    <div class="fault ' + className + '">\
                        <img src="/Common/Index/images/moduleLogo/缺陷库.png" class="myIMG" />\
                        <div class="menuTitle">缺陷库' + category_titleEx + '</div>\
                    </div>\
                 </a>';
            break;
        case "alarm3c": //C3, 检测数据
            re = '<a href="/C3/PC/MAlarmMonitoring/MonitorLocoAlarmList.htm?category=' + category + '&data_type=ALARM&' + att + '" class="lightbox">\
                    <div class="alarm ' + className + '">\
                        <img src="/Common/Index/images/moduleLogo/报警监测.png"  class="myIMG"/>\
                        <div  class="menuTitle">检测数据' + category_titleEx + '</div>\
                    </div>\
                 </a>';
            break;
        case "help_txtLeft": //C3, 帮助
            re = '<a href="/Help/Help.htm?CateGroy=' + category + '&' + att_v + '&lightbox[iframe]=true&lightbox[width]=90p&lightbox[height]=20p" class="lightbox">\
                    <div class="help  ' + className + '">\
                        <img src="/Common/Index/images/moduleLogo/帮助.png" class="myIMG"/>\
                        <span class="menuTitle">帮助' + category_titleEx + '</span>\
                    </div>\
                 </a>';
            break;
        case "sys_txtLeft": //C3, 系统管理
            re = '<a href="#">\
                    <div class="sys flip_zzj ' + className + '" id="sys">\
                        <img src="/Common/Index/images/moduleLogo/系统管理.png" class="myIMG" />\
                        <span class="menuTitle">系统管理' + category_titleEx + '</span>\
                    </div>\
                </a>\
                <div class="sys ' + className + '" id="sys2" style="display: none">\
                    <ul class="tb_menu2">\
                            ' + GetLi(menu2list) + '\
                        <li  class="myRETURN"><a href="#" id="sys_return" class="a_return">返回</a></li>\
                    </ul>\
                </div>';
            break;
        case "AlarmSupervise3C"://报警监控
            re = '<a href="/C3/PC/MAlarmMonitoring/MonitorLocoAlarmList.htm?category=' + category + '&data_type=SUPERVISE&' + att + '" class="lightbox">\
                    <div class="alarmSupervise flip_zzj ' + className + '" id="alarmSupervise">\
                        <img src="/Common/Index/images/moduleLogo/报警监控.png" class="myIMG" />\
                        <span class="menuTitle">报警监控' + category_titleEx + '</span>\
                    </div>\
                </a>'
            break;
        case "getData"://主动获取数据
            re = '<a target="_blank" href="/C3/PC/MLiveStreaming/OriginalFile.html?category=' + category + '&data_type=getData&' + att + '" class="">\
                    <div class="_get_Data ' + className + '" id="_get_Data">\
                        <span class="menuTitle">主动检测' + category_titleEx + '</span>\
                    </div>\
                </a>'
            break;
        //--------------------------------------------- C4功能 ---------------------------------------------
        //在公共功能里
        //--------------------------------------------- C5功能 ---------------------------------------------
        case "C5_detect": //C5, 检测数据
            re = '<a class="C5_dialog C5_detect ' + className + '" iframe-url="/C5/html/detect_list.html?' + att_v + '" href="javascript:void(0)">\
                    <img src="/Common/Index/images/moduleLogo/c5_detect.png" />\
                    <span>检测数据</span>\
                 </a>';
            break;
        case "C5_fault": //C5, 缺陷库
            re = '<a class="C5_dialog C5_fault ' + className + '" iframe-url="/C5/html/fault_list.html?' + att_v + '" href="javascript:void(0)">\
                    <img src="/Common/Index/images/moduleLogo/c5_fault.png" />\
                    <span>缺陷库</span>\
                 </a>';
            break;
        case "C5_report": //C5, 统计报表
            re = '<a class="C5_dialog C5_report ' + className + '" iframe-url="" href="javascript:void(0)">\
                    <img src="/Common/Index/images/moduleLogo/c5_report.png" />\
                    <span>统计报表</span>\
                </a>';
            break;
        case "C5_camera": //C5, 相机管理
            re = '<a class="C5_dialog C5_camera ' + className + '" iframe-url="/C5/html/camera_list.html?' + att_v + '" href="javascript:void(0)">\
                    <img src="/Common/Index/images/moduleLogo/c5_camera.png" />\
                    <span>相机管理</span>\
                 </a>';
            break;
        //--------------------------------------------- C6功能 ---------------------------------------------
        case "RemoteControl": //C6, 远程控制
            re = '<div class="RemoteControl ' + className + '">\
                    <a href="/C6/PC/MAlarmMonitoring/RemoteControl.html?' + "lightbox[iframe]=true&lightbox[width]=95p&lightbox[height]=85p&" + att_v + '" class="lightbox">\
                        <img src="/Common/Index/images/moduleLogo/远程控制.png" />\
                        <div class="menuTitle">远程控制' + category_titleEx + '</div>\
                    </a>\
                 </div>';
            break;
        case "SubstationMonitoring": //C6, 监控数据
            re = '<div class="SubstationMonitoring ' + className + '">\
                    <a href="/C6/PC/MAlarmMonitoring/SubstationMonitoringQuery.htm?' + "lightbox[iframe]=true&lightbox[width]=95p&lightbox[height]=85p&" + att_v + '" class="lightbox">\
                      <img src="/Common/Index/images/moduleLogo/实时监控.png" />\
                      <div class="menuTitle">监控数据' + category_titleEx + '</div>\
                    </a>\
                </div>';
            break;
        case "mrta6C": //C6, 实时监控
            re = '<div class="mrta ' + className + '">\
                      <a href="/C6/PC/MAlarmMonitoring/'+ urlName + '?' + att_v + '"  target="_blank">\
                          <img src="/Common/Index/images/moduleLogo/i_jiank.png" />\
                          <div class="menuTitle">实时监控' + category_titleEx + '</div>\
                      </a>\
                  </div>';
            break;
        case "fault6c": //C6, 缺陷库
            re = '<a href="/C6/PC/MAlarmMonitoring/SubstationFaultList.htm?category=' + category + '&data_type=FAULT&' + att + '" class="lightbox">\
                    <div class="fault ' + className + '">\
                        <img src="/Common/Index/images/moduleLogo/缺陷库.png"  class="myIMG"/>\
                        <div  class="menuTitle">缺陷库' + category_titleEx + '</div>\
                    </div>\
                 </a>';
            break;
        case "fault6c-span": //C6, 缺陷库
            re = '<div class="fault ' + className + '">\
                    <a href="/C6/PC/MAlarmMonitoring/SubstationFaultList.htm?category=' + category + '&data_type=FAULT&' + att + '" class="lightbox">\
                        <img src="/Common/Index/images/moduleLogo/缺陷库.png" class="myIMG"/>\
                        <span  class="menuTitle">缺陷库' + category_titleEx + '</span>\
                    </a>\
                 </div>';
            break;
        case "alarm6c-span": //C6, 报警监控
            re = '<div class="alarm ' + className + '">\
                    <a href="/C6/PC/MAlarmMonitoring/SubstationAlarmList.htm?category=' + category + '&' + att + '" class="lightbox">\
                        <img src="/Common/Index/images/moduleLogo/报警监测.png"  class="myIMG"/>\
                        <span  class="menuTitle">报警监控' + category_titleEx + '</span>\
                    </a>\
                 </div>';
            break;
            //--------------------------------------------- DPC功能 ---------------------------------------------
        case "report6c": //DPC, 报表统计
            re = '<a href="#">\
                    <div class="report6c flip_zzj ' + className + '" id="bj">\
                        <img src="/Common/Index/images/moduleLogo/analyze.png" class="myIMG"/>\
                        <span class="menuTitle">报表统计</span>\
                    </div>\
                 </a>\
                <div class="report6c ' + className + '" id="bj2" style="display: none">\
                    <ul class="tb_menu2">\
                        <li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/Report/CommonReport.htm?reportType=day&category=' + category + '&lightbox[iframe]=true&lightbox[width]=95p&lightbox[height]=88p&lightbox[modal]=true&' + att_v + '" class="i_manage lightbox aa1">日报</a></li>\
                        <li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/Report/CommonReport.htm?reportType=week&category=' + category + '&lightbox[iframe]=true&lightbox[width]=95p&lightbox[height]=90p&lightbox[modal]=true&' + att_v + '" class="i_manage lightbox aa1">周报</a></li>\
                        <li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/Report/CommonReport.htm?reportType=month&category=' + category + '&lightbox[iframe]=true&lightbox[width]=95p&lightbox[height]=88p&lightbox[modal]=true&' + att_v + '" class="i_manage lightbox aa1">月报</a></li>\
                        <li><a href="#" id="bj_return" class="a_return">返回</a></li>\
                    </ul>\
                </div>';
            break;
        case "analysis": //DPC, 综合分析
            re = '<a href="/6C/PC/portal1.1.htm?lightbox[iframe]=true&lightbox[width]=95p&lightbox[height]=91p&' + att_v + '" class="lightbox">\
                        <div class="analysis ' + className + '">\
                            <img src="/Common/Index/images/moduleLogo/全景.png" class="myIMG"/>\
                            <span  class="menuTitle">综合分析</span>\
                       </div>\
                 </a>';
            break;
        case "mrta": //DPC, 实时监控
            re = '<a href="/6C/PC/MRTA/mrta_big.htm?' + att_v + '"  target="_blank">\
                    <div class="mrta ' + className + '">\
                            <img src="/Common/Index/images/moduleLogo/i_jiank.png" />\
                            <div  class="menuTitle">在线实时检测</div>\
                    </div>\
                </a>';
            break;
        case "onepole6C": //DPC, 一杆一档
            re = '<a href="/6C/PC/MAlarmMonitoring/MonitorDeviceList.htm?' + att + '" class="lightbox">\
                    <div class="onePole ' + className + '">\
                            <img src="/Common/Index/images/moduleLogo/逻辑拓扑.png" class="myIMG"/>\
                            <div  class="menuTitle">一杆一档</div>\
                    </div>\
                 </a>';
            break;
        case "polling6C": //DPC, 线路巡检
            re = '<a href="/6C/PC/HardDisk/6CHardDiskManage.htm?' + att + '" class="lightbox">\
                        <div class="polling6C ' + className + '">\
                            <img src="/Common/Index/images/moduleLogo/巡检.png" class="myIMG"/>\
                            <span  class="menuTitle">线路巡检</span>\
                    </div>\
                </a>';
            break;
        case "intelligence": //DPC, 智能分析
            re = ' <a href="#">\
                        <div class="intelligence flip_zzj ' + className + '" id="zn">\
                             <img src="/Common/Index/images/moduleLogo/智能分析.png" class="myIMG2"/>\
                            <span class="menuTitle">智能分析</span>\
                        </div>\
                    </a>\
                    <div class="intelligence  ' + className + '" id="zn2" style="display: none">\
                        <ul class="tb_menu2">\
                            <li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/Common/MDataAnalysis/RepeatAlarm.htm?' + att + '" class="aa" target="_blank">重复报警分析</a></li>\
                            <li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/Report/comprehensiveAnalysis.htm?' + att + '" class="i_manage lightbox aa">缺陷多维分析</a></li>\
                            <li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/6C/PC/MDataAnalysis/LineAlarmCount.htm?' + att + '" class="i_manage lightbox aa">线路缺陷分析</a></li>\
                            <li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/6C/PC/MDataAnalysis/OrgAlarmCount.htm?' + att + '" class="i_manage lightbox aa">故障设备分析</a></li>\
                            <li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/6C/PC/AlarmingTrendEcharts/AlarmingTrend.html?category=' + category + '&' + att + '" class="i_manage lightbox aa">缺陷处理趋势分析</a></li>\
                            <li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/6C/PC/AlarmingTrendEcharts/AlarmingTrendActive.html?&category=' + category + '&' + att + '" class="i_manage lightbox aa">多维度缺陷处理对比分析（动态）</a></li>\
                            <li style="display:none"><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/6C/PC/MFault/FaultListFH.htm?' + att + '"  class="i_manage lightbox aa">检修结果复核</a></li>\
                            <li style="display:none"><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/6C/PC/Nalysis/NalysisOLList.htm?' + att + '"  class="i_manage lightbox aa">隐患路段发现</a></li>\
                            <li style="display:none"><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/6C/PC/Nalysis/FaultYsisList.htm?' + att + '"  class="i_manage lightbox aa">缺陷自动发现</a></li>\
                            <li style="display:none"><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/6C/PC/MRTA/Celsius.htm?' + att + '" class="i_manage lightbox aa">温度统计分析</a></li>\
                            <li><a href="#" id="zn_return" class="a_return">返回</a></li>\
                        </ul>\
                    </div>'
            break;
        case "device3C": //DPC, 中3c设备
            re = '<div class="device3C flip_zzj ' + className + '" id="loc">\
                    <a href="#">\
                        <img src="/Common/Index/images/moduleLogo/机车.png" />\
                        <div class="menuTitle">3C设备</div>\
                    </a>\
                </div>\
                <div class="device3C  ' + className + '" id="loc2" style="display: none">\
                    <ul class="tb_menu2">\
                            <li><a href="/C3/PC/MDeviceStatus/MonitorLocoStateList.htm?' + att + '"  class="i_manage lightbox aa">3C设备状态</a></li>\
                            <li><a href="/C3/PC/MAlarmMonitoring/MonitorLocoAlarmList.htm?' + att + '"  class="i_manage lightbox aa">报警</a></li>\
                            <li><a href="/C3/PC/MDetectionOfTrace/MonitorLocGJList.htm?' + att + '" class="i_manage lightbox aa">轨迹</a></li>\
                            <li><a href="#" id="loc_return" class="a_return">返回</a></li>\
                    </ul>\
                </div>';
            break;
        case "oneplace": //DPC,一所一档
            re = '<a href="/Common/MOnePlaceData/C6_OnePlaceOnefile.htm?' + att + '" class="lightbox">\
                    <div class="oneplace ' + className + '">\
                        <img src="/Common/Index/images/moduleLogo/变电.png" class="myIMGsmall"/>\
                        <div  class="menuTitle">一所一档</div>\
                    </div>\
                 </a>';
            break;
        case "alarm": //DPC, 报警监控
            if (category == "DPC") {
                re = '<a href="/Common/MAlarmMonitoring/MonitorAlarmList.htm?category=' + category + '&data_type=ALARM&' + att + '" class="lightbox">\
                        <div class="alarm ' + className + '">\
                            <img src="/Common/Index/images/moduleLogo/报警监测.png" class="myIMG"/>\
                            <div  class="menuTitle">报警监控</div>\
                        </div>\
                     </a>';
            } else {
                re = '<a href="/Common/MAlarmMonitoring/MonitorAlarmList.htm?category=' + category + '&data_type=ALARM&' + att + '" class="lightbox">\
                        <div class="alarm ' + className + '">\
                            <img src="/Common/Index/images/moduleLogo/报警监测.png"  class="myIMG"/>\
                            <div  class="menuTitle">报警监控' + category_titleEx + '</div>\
                        </div>\
                    </a>';
            }
            break;
        case "alarm6c": //DPC, 报警监控
            re = '<a href="/C6/PC/MAlarmMonitoring/SubstationAlarmList.htm?category=' + category + '&' + att + '" class="lightbox">\
                    <div class="alarm ' + className + '">\
                        <img src="/Common/Index/images/moduleLogo/报警监测.png"  class="myIMG"/>\
                        <div  class="menuTitle">报警监控' + category_titleEx + '</div>\
                    </div>\
                  </a>';
            break;
        case "MPlan": //DPC, 检测计划管理
            re = '<a href="/Common/MPlan/PlanManagement.html?dataType=' + category + '&' + att + '" class="lightbox">\
                    <div class="MPlan ' + className + '">\
                        <img src="/Common/Index/images/moduleLogo/检测计划管理.png" class="myIMG" />\
                        <div  class="menuTitle">检测计划管理</div>\
                    </div>\
                </a>';
            break;
        case "repair": //DPC, 检修结果
            re = '<a href="/6C/PC/MFault/FaultListFH.htm?dataType=' + category + '&' + att + '" class="lightbox">\
                    <div class="repair ' + className + '">\
                        <img src="/Common/Index/images/moduleLogo/实时监控.png" align="absmiddle" class="myIMG"/>\
                        <div  class="menuTitle">检修结果</div>\
                    </div>\
                </a>';
            break;
            //--------------------------------------------- 公共功能 ---------------------------------------------
        case "report_common": //C1, C2, C3, C4, 报表
            var J_report = '';
            var lineKM = '';
            var D_report = '';
            var RW_report = '';
            if (GetIsPowerOrg() == "1") {
                if (FunEnable('Fun_3cWeekReport') == "True") {
                    J_report = '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/Report/3CRunStatus.htm?category=' + category + '&' + att + '" class="lightbox aa2">3C装置月报</a></li>';
                } else {
                    if (json.PersonName.indexOf("乌鲁木齐") > -1) {
                        J_report = '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/Report/3CRunStatus.htm?category=' + category + '&' + att + '" class="lightbox aa2">3C装置月报</a></li>';
                    }
                }
                if (FunEnable('Fun_kmCount') == "True") {
                    lineKM = '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/Report/KmStatReport.htm?category=' + category + '&' + att + '" class="lightbox aa2">行驶里程统计</a></li>';
                }
            }
            var f1 = '';
            if (FunEnable('Fun_deviceAlarmCount') == "True") {
                //存在  设备缺陷统计  功能。
                f1 += '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/Report/LocReport.htm?' + att + '" class="lightbox aa1">设备缺陷统计</a></li>';
            };
            var f2 = '';
            if (FunEnable('Fun_WDCount') == "True") {
                //存在  温度统计分析  功能。
                f2 += '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/Report/WDReport.htm?' + att + '" class="lightbox aa1">温度统计分析</a></li>';
            };
            if (FunEnable('Fun_AlarmDaycount') == "True") {
                D_report += '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/Report/CommonReportdayCount.htm?reportType=day&category=' + category + '&' + att + '" class="lightbox aa1">报警处理统计</a></li>'
            };
            if (FunEnable('Fun_RailwayReport') == "True") {
                RW_report += '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/Report/RailwayData.htm?category=' + category + '&' + att + '" class="lightbox aa1">各路局数据</a></li>'
            }
            if (FunEnable('Fun_RailwayReport') == "True") {
                RW_report += '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/Report/AlarmBureau.htm?category=' + category + '&' + att + '" class="lightbox aa1">各局报警分析</a></li>'
            }
            if (FunEnable('Fun_Handle_monthly') == "True") {
                f2 += '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/Report/AlarmHandled.htm?' + att + '" class="lightbox aa1">各类报警处理</a></li>';
                f2 += '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/Report/SysCancel.htm?' + att + '" class="lightbox aa1">系统自动取消</a></li>';
                f2 += '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/Report/SysCancel_P.htm?' + att + '" class="lightbox aa1">手动取消统计</a></li>';
                f2 += '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/Report/AlarmHandled_Third.htm?' + att + '" class="lightbox aa1">三类缺陷处理</a></li>';
            };
            var temp_li = '';
            switch (category) {
                case "3C":
                    if (flag) { //内部版
                        temp_li =
                             '<li>\
                                <img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/Report/CommonReport.htm?reportType=day&category=' + category + '&' + att + '" class="lightbox aa1">日报,</a>\
                                <a href="/Report/CommonReport.htm?reportType=week&category=' + category + '&' + att + '" class="lightbox aa1">周报,</a>\
                                <a href="/Report/CommonReport.htm?reportType=month&category=' + category + '&' + att + '" class="lightbox aa1">月报</a>\
                             </li>';
                    } else { //外部版
                        temp_li =
                             '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/Report/CommonReport.htm?reportType=day&category=' + category + '&' + att + '" class="lightbox aa1">日报</a></li>\
                              <li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/Report/CommonReport.htm?reportType=week&category=' + category + '&' + att + '" class="lightbox aa1">周报</a></li>\
                              <li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/Report/CommonReport.htm?reportType=month&category=' + category + '&' + att + '" class="lightbox aa1">月报</a></li>';
                    }
                    break;
                default: //C1, C2, C4, 报表
                    temp_li =
                         '<li><img src="/Common/Index/images/小箭头.png" class="mySmallBiao"/><a href="/Report/CommonReport.htm?reportType=week&category=' + category + '&' + att + '" class="lightbox aa2">缺陷综合分析</a></li>';
                    break;
            }
            re = '<a href="#">\
                     <div class="report6c flip_zzj ' + className + '" id="bb">\
                         <img src="/Common/Index/images/moduleLogo/统计报表.png" class="myIMG"/>\
                        <span class="menuTitle">统计报表' + category_titleEx + '</span>\
                     </div>\
                   </a>\
                   <div class="report6c  ' + className + '" id="bb2" style="display: none">\
                    <ul class="tb_menu2">\
                        ' + f1 + '\
                        ' + f2 + '\
                        ' + temp_li + '\
                        ' + D_report + '\
                        ' + RW_report + '\
                        ' + J_report + '\
                        ' + lineKM + '\
                        <li><a href="#" id="bb_return" class="a_return">返回</a></li>\
                    </ul>\
                   </div>';
            break;
        case "onepole": //C1, C2, C4, 一杆一档
            re = '<a target="_blank" href="/Common/MOnePoleData/home.htm?category=' + category + '&' + att + '"  target="_blank">\
                    <div class="onePole ' + className + '">\
                        <img src="/Common/Index/images/moduleLogo/逻辑拓扑.png" class="myIMG"/>\
                        <div  class="menuTitle">一杆一档' + category_titleEx + '</div>\
                    </div>\
                 </a>';
            break;
        case "handdisk": //C1, C2, C4, 巡检数据
            re = '<a href="/Common/MHardDisk/HardDiskManage.htm?category=' + category + '&' + att + '"  class="lightbox">\
                    <div class="handdisk ' + className + '">\
                        <img src="/Common/Index/images/moduleLogo/机车状态.png" class="myIMG"/>\
                        <div  class="menuTitle">巡检数据' + category_titleEx + '</div>\
                    </div>\
                </a>';
            break;
        case "handdisk-span": //C1, C2, C4, 巡检数据
            re = '<a href="/Common/MHardDisk/HardDiskManage.htm?category=' + category + '&' + att + '"  class="lightbox">\
                    <div class="handdisk ' + className + '">\
                        <img src="/Common/Index/images/moduleLogo/机车状态.png" class="myIMG"/>\
                        <span  class="menuTitle">巡检数据' + category_titleEx + '</span>\
                    </div>\
                  </a>';
            break;
        case "fault": //C1, C2, C4, DPC, 缺陷库
            if (category == "DPC") {
                re = '<a href="/Common/MAlarmMonitoring/MonitorAlarmList.htm?category=' + category + '&data_type=FAULT&' + att + '" class="lightbox">\
                         <div class="fault ' + className + '">\
                            <img src="/Common/Index/images/moduleLogo/缺陷库.png" class="myIMG"/>\
                            <div  class="menuTitle">缺陷库</div>\
                        </div>\
                     </a>';
            } else {
                re = '<a href="/Common/MAlarmMonitoring/MonitorAlarmList.htm?category=' + category + '&data_type=FAULT&' + att + '" class="lightbox">\
                        <div class="fault ' + className + '">\
                            <img src="/Common/Index/images/moduleLogo/缺陷库.png" class="myIMG" />\
                            <div  class="menuTitle">缺陷库' + category_titleEx + '</div>\
                        </div>\
                     </a>';
            }
            break;
        case "task": //C1, C2, C3, C4, DPC, 任务管理
            if (category == "DPC") {
                re = '<a href="/Common/MTask/TaskList.htm?dataType=' + category + '&' + att + '" class="lightbox">\
                        <div class="task ' + className + '">\
                            <img src="/Common/Index/images/moduleLogo/任务管理.png" class="myIMG" />\
                            <span  class="menuTitle">任务管理</span>\
                        </div>\
                     </a>';
            } else {
                re = '<a href="/Common/MTask/TaskList.htm?dataType=' + category + '&' + att + '" target="_blank">\
                        <div class="task ' + className + '">\
                            <img src="/Common/Index/images/moduleLogo/任务管理.png" class="myIMG" />\
                            <span  class="menuTitle">任务管理' + category_titleEx + '</span>\
                        </div>\
                     </a>';
            }
            break;
        case "task_txtBottom": //C1, C2, C4, DPC, 任务管理
            if (category == "") {
                re = '<a href="/Common/MTask/TaskList.htm?dataType=' + category + '&' + att + '" target="_blank">\
                        <div class="task ' + className + '">\
                            <img src="/Common/Index/images/moduleLogo/任务管理.png" class="myIMG" />\
                            <div  class="menuTitle">任务管理</div>\
                        </div>\
                     </a>';
            } else {
                re = '<a href="/Common/MTask/TaskList.htm?dataType=' + category + '&' + att + '" target="_blank">\
                        <div class="task ' + className + '">\
                            <img src="/Common/Index/images/moduleLogo/任务管理.png"  class="myIMG"/>\
                            <div  class="menuTitle">任务管理' + category_titleEx + '</div>\
                        </div>\
                     </a>';
            }
            break;
        case "gis": //C1, C2, C3, C4, DPC, GIS分析
            if (category == "DPC") {
                re = '<a href="/Common/MGIS/GIS.htm?Category_Code=' + category + '&' + att + '" target="_blank" >\
                        <div class="gis ' + className + '">\
                            <img src="/Common/Index/images/moduleLogo/gis分析.png"  class="myIMGsmall" id="myIMGDPC"/>\
                            <div  class="menuTitle">GIS分析</div>\
                        </div>\
                     </a>';
            } else {
                re = '<a href="/Common/MGIS/GIS.htm?Category_Code=' + category + '&' + att + '" target="_blank" >\
                        <div class="gis ' + className + '">\
                            <img src="/Common/Index/images/moduleLogo/gis分析.png"  class="myIMG" id="myIMG"/>\
                            <div  class="menuTitle">GIS分析</div>\
                        </div>\
                    </a>';
            }
            break;
        case "soft": //C1, C2, C3, C4, 线路巡检, 硬盘数据分析
            //if (FunEnable('Fun_LineInspection') == "True") {
            //    re = '<a href="/C3/PC/LineInspection/LineInspection_list.html?category=' + category + '&data_type=FAULT&' + att + '" class="lightbox" >\
            //            <div class="soft ' + className + '">\
            //                <img src="/Common/Index/images/moduleLogo/监测运行轨迹.png" class="myIMG"/>\
            //                <div  class="menuTitle">线路巡检' + category_titleEx + '</div>\
            //            </div>\
            //         </a>';
            //} else {
                var _open = '';
                switch (category) {
                    case '1C': _open = 'OpenC1:'; break;
                    case '2C': _open = 'OpenC2:'; break;
                }
                if ('4C' === category) {
                    re = '<a href="#">\
                            <div class="soft flip_zzj ' + className + '" id="yp">\
                                <img src="/Common/Index/images/moduleLogo/监测运行轨迹.png" class="myIMG" />\
                                <span  class="menuTitle">硬盘数据分析</span>\
                            </div>\
                        </a>\
                        <div class="soft flipbox1 ' + className + '" id="yp2" style="display: none">\
                            <ul class="tb_menu2">\
                                ' + GetLi(menu2list) + '\
                                <li id="myRETURN">\
                                      <a href="#" id="yp_return" class="a_return">返回</a>\
                                </li>\
                            </ul>\
                        </div>';
                } else {
                    re = '<a href="/Common/MAlarmMonitoring/hardDiskData_new.html?category=3C&' + att + '&lightbox[iframe]=true&lightbox[width]=95p&lightbox[height]=90p" class="lightbox">\
                        <div class="soft ' + className + '">\
                            <img src="/Common/Index/images/moduleLogo/监测运行轨迹.png" class="myIMG"/>\
                            <div  class="menuTitle">硬盘数据管理' + category_titleEx + '</div>\
                        </div>\
                    </a>';
                }
            //}
            break;
        case "help": //C1, C2, C3, C4, DPC, 帮助
            if (category == "DPC") {
                re = '<a href="/Help/Help.htm?CateGroy=' + category + '&' + att_v + '&lightbox[iframe]=true&lightbox[width]=90p&lightbox[height]=20p" class="lightbox">\
                        <div class="help  ' + className + '">\
                            <img src="/Common/Index/images/moduleLogo/帮助.png" class="myIMGsmall"/>\
                            <div class="menuTitle">帮助</div>\
                        </div>\
                     </a>';
            } else {
                re = '<a href="/Help/Help.htm?CateGroy=' + category + '&' + att_v + '&lightbox[iframe]=true&lightbox[width]=90p&lightbox[height]=20p" class="lightbox">\
                        <div class="help  ' + className + '">\
                            <img src="/Common/Index/images/moduleLogo/帮助.png" class="myIMG3" />\
                            <div class="menuTitle">帮助' + category_titleEx + '</div>\
                        </div>\
                     </a>';
            }
            break;
        case "base": //C3, C6, DPC, 基础数据
            if (category == "DPC") {
                re = '<a href="#">\
                        <div class="base flip_zzj ' + className + '" id="jc">\
                            <img src="/Common/Index/images/moduleLogo/基础数据.png" class="myIMG" />\
                            <span  class="menuTitle">基础数据</span>\
                        </div>\
                    </a>\
                    <div class="base flipbox1 ' + className + '" id="jc2" style="display: none">\
                        <ul class="tb_menu2">\
                            ' + GetLi(menu2list) + '\
                            <li id="myRETURN">\
                                  <a href="#" id="jc_return" class="a_return">返回</a>\
                            </li>\
                        </ul>\
                    </div>'
            } else {
                re = '<div class="base flip_zzj ' + className + '" id="jc">\
                        <a href="#">\
                            <img src="/Common/Index/images/moduleLogo/基础数据.png" class="myIMG"/>\
                            <span  class="menuTitle">基础数据' + category_titleEx + '</span>\
                        </a>\
                    </div>\
                    <div class="base flipbox1 ' + className + '" id="jc2" style="display: none">\
                        <ul class="tb_menu2">\
                            ' + GetLi(menu2list) + '\
                            <li  class="myRETURN">\
                                  <a href="#" id="jc_return" class="a_return">返回</a>\
                            </li>\
                        </ul>\
                    </div>'
            }
            break;
        case "base_txtBottom": //C1, C2, C4, 基础数据
            re = ' <a href="#">\
                        <div class="base flip_zzj ' + className + '" id="jc">\
                            <img src="/Common/Index/images/moduleLogo/基础数据.png" class="myIMG" />\
                            <div  class="menuTitle">基础数据' + category_titleEx + '</div>\
                        </div>\
                    </a>\
                    <div class="base flipbox1 ' + className + '" id="jc2" style="display: none">\
                        <ul class="tb_menu2">\
                            ' + GetLi(menu2list) + '\
                            <li  class="myRETURN">\
                                  <a href="#" id="jc_return" class="a_return">返回</a>\
                            </li>\
                        </ul>\
                    </div>'
            break;
        case "sys": //C1, C2, C3, C4, C6, DPC, 系统管理
            if (category == "DPC") {
                re = '<a href="#">\
                        <div class="sys flip_zzj ' + className + '" id="sys">\
                            <img src="/Common/Index/images/moduleLogo/系统管理.png" class="myIMGsmall" />\
                            <div class="menuTitle">系统管理</div>\
                        </div>\
                    </a>\
                    <div class="sys ' + className + '" id="sys2" style="display: none">\
                        <ul class="tb_menu2 tb_menuSmall">\
                              ' + GetLi(menu2list) + '\
                            <li  class="myRETURN"><a href="#" id="sys_return" class="a_return">返回</a></li>\
                        </ul>\
                    </div>';

            } else {
                re = '<a href="#">\
                        <div class="sys flip_zzj ' + className + '" id="sys">\
                            <img src="/Common/Index/images/moduleLogo/系统管理.png" class="myIMG" />\
                            <div class="menuTitle">系统管理' + category_titleEx + '</div>\
                        </div>\
                    </a>\
                    <div class="sys ' + className + '" id="sys2" style="display: none">\
                        <ul class="tb_menu2">\
                                ' + GetLi(menu2list) + '\
                            <li  class="myRETURN"><a href="#" id="sys_return" class="a_return">返回</a></li>\
                        </ul>\
                    </div>';
            }
            break;
    }
    document.write(re);
}
