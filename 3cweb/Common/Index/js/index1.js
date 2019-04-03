
var category = 'DPC';
var att = 'v=' + version;
var _w = $(window).width() / 4;
var _h = $(window).height() / 4;
var _h2 = _h * 0.8;
var _top2 = _h * 0.2;
var padding_t = 10;
var padding_l = 10;
var padding_wh = 16;
var padding_allL = 35;

var _headPT = _h - 150;
var _headH = _h - _headPT;
$(document).ready(function () {
    $('.openIframe').removeAttr('target');

    $('.openIframe').click(function () {
        var _url = $(this).attr('iframe-url');
        var _width = $(window).width() * 0.94;
        var _height = $(window).height() * 0.94;
        if ($(this).attr("id") == "catenary") {
            showIframe(_url, _width, _height, "");
        }else{
            showIframe(_url, _width, _height, "no");
        }
    });
    $('.openIframe1').click(function () {
        var _url = $(this).attr('iframe-url');
        var _width = $(window).width() * 0.25;
        var _height = $(window).height() * 0.35;
        showIframe(_url, _width, _height, "no");
    });


    var UserN = '';
    //var UserC = '';
    UserN = getCurUser().name;
   // UserC = getCurUser().code;
    //$('#UserName').html(UserN);
    $('#UName').html(UserN);
    //$('#UserCode').html(UserC);
    $('#close').click(function () {

        if (GetQueryString("btnClose") != null) {
            window.close();
        } else {
            logOut();
            //window.location = "/Common/login.htm?v=" + version;
            window.location = "/Common/login_new.htm?v=" + version;
        }

    });
    var pic = document.getElementById('pic_close');
    $('#pic_close').mouseover(function () {
        pic.src = "images/mouseover.png";
    }).mouseout(function () {
        pic.src = "images/close.png";
    });
   
    $('.flip_yyy').click(function () {
        var id = $(this).attr('id');
        var id2 = id + "2";
        //var id = $(this).attr('id');
        //var id2 = id + "2";
        $(this).fadeOut();
        $('#' + id2).fadeIn(1000)
    });
    $('.b_return').click(function () {
        var id = $(this).attr('id').replace('_return', '');
        var id2 = id + "2";
        $('#' + id2).fadeOut();
        $('#' + id).fadeIn(1000);
    })
   



});


function load() {
    $("#1C").attr("href", "/C1/index_new.htm?btnClose=1&userName=" + escape(GetQueryString("userName") + "&v=" + version));
    $("#2C").attr("href", "/C2/index_new.htm?btnClose=1&userName=" + escape(GetQueryString("userName") + "&v=" + version));
    $("#3C").attr("href", "/C3/index_new.htm?btnClose=1&userName=" + escape(GetQueryString("userName") + "&v=" + version));
    $("#4C").attr("href", "/C4/index_new.htm?btnClose=1&userName=" + escape(GetQueryString("userName") + "&v=" + version));
    $("#5C").attr("href", "/C5/index_new.htm?btnClose=1&userName=" + escape(GetQueryString("userName") + "&v=" + version));

    if (FunEnable('Fun_C6SystemLink') === 'True') {
        $("#6C").attr("href", "/C6/index.htm?btnClose=1&userName=" + escape(GetQueryString("userName") + "&v=" + version)); //公司自己的C6项目
    } else {
        $("#6C").attr("href", "http://183.203.132.154:8090");
    }


    $("#problem").attr("iframe-url", "/Common/MAlarmMonitoring/MonitorAlarmList.htm?category=" + category + "&data_type=FAULT&" + att + "&btnClose=1&userName=" + escape(GetQueryString("userName") + "&v=" + version));
    $("#onePole").attr("iframe-url", "/6C/PC/MAlarmMonitoring/MonitorDeviceList.htm? ");
    $("#gis").attr("href", "/Common/MGIS/GIS.htm?category=" + category + "&" + att + "&btnClose=1&userName=" + escape(GetQueryString("userName") + "&v=" + version));
    //任务管理
    if (FunEnable('Fun_TaskManage') == "True") { 
        $("#task").attr("href", "/Common/MTask/TaskList.htm?dataType=&" + att + "&btnClose=1&userName=" + escape(GetQueryString("userName") + "&v=" + version));
    } else {
        $("#task").attr("href", 'javascript:void(0)');
        $('#task').click(function () {
            layer.msg('该功能未开放');
        })
    }
    $("#onePlace").attr("iframe-url", "/Common/MOnePlaceData/C6_OnePlaceOnefile.htm?" +"&"+ att + "&btnClose=1&userName=" + escape(GetQueryString("userName") + "&v=" + version));
    $("#repair").attr("iframe-url", "/6C/PC/MFault/FaultListFH.htm?" + att + "&btnClose=1&userName=" + escape(GetQueryString("userName") + "&v=" + version));
    $('#detectPlan').attr("iframe-url", "/Common/MPlan/PlanManagement.html?" + att);
    $('#catenary').attr("iframe-url", "/6C/PC/portal1.1.htm?" + att);
    $("#polling").attr("iframe-url", "/6C/PC/HardDisk/6CHardDiskManage.htm?" + att + "&btnClose=1&userName=" + escape(GetQueryString("userName") + "&v=" + version));
    $("#DPC").attr("href", "/6C/PC/MRTA/mrta_big.htm?" + att);
    $("#day").attr("iframe-url", "/Report/CommonReport.htm?reportType=day&category=" + category + "&" + att);
    $("#week").attr("iframe-url", "/Report/CommonReport.htm?reportType=week&category=" + category + "&" + att);
    $("#month").attr("iframe-url", "/Report/CommonReport.htm?reportType=month&category=" + category + "&" + att);

    


    //$("#Iname").innerText = GetQueryString("userName");
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


$(function () {
    $('.pageBody').width(_w * 4).height(_h * 4);
    var h_header = $('.header').height(_headH - 12).css('text-align', 'center');
    $('.page_content').height($('.pageBody').height() - $('.header').height() - $('#foot').height());
    var _w1 = [$('.page_content').width() - padding_wh * 4 - padding_allL * 2] / 5;
    var _h1 = [$('.page_content').height() - padding_wh * 4 - padding_t] / 5;
    var _h3 = [$('.page_content').height() - padding_wh * 5 - padding_t] / 6;

    //$('.page_content>a').css({ 'text-align': 'center' }).mouseover(function () {
    //    //$(this).addClass('border1')
    //}).mouseout(function () {
    //    $('.page_content>a').removeClass("border1")
    //})
    //$('.page_content').children('#problem,#task,#onePole,#polling').mouseover(function () {
    //   // $(this).removeClass("border1").addClass("border")
    //}).mouseout(function () {
    //    $(this).removeClass("border");
    //});


    $('#intelligence2').width(_w1).height(_h1).css({ 'top': $('.header').height() + padding_t + _h1 * 3 + padding_wh * 3, 'right': padding_allL, 'position': 'absolute', 'background': 'linear-gradient(to bottom, rgba(54,209,220,1) 0%,rgba(91,134,229,1) 100%)', 'background-color': 'rgba(0,0,0,0.5)' });
    $('#system2').width(_w1).height(_h1).css({ 'top': $('.header').height() + padding_t + _h1 * 4 + padding_wh * 4, 'right': padding_allL, 'position': 'absolute', 'background': 'linear-gradient(to bottom, rgba(54,209,220,1) 0%,rgba(91,134,229,1) 100%)' });
    $('#report2').width(_w1).height(_h3).css({ 'top': $('.header').height() + _h3 * 5 + padding_t + padding_wh * 5, 'right': _w1 + padding_wh + padding_allL, 'position': 'absolute', 'background': 'linear-gradient(to bottom, rgba(54,209,220,1) 0%,rgba(91,134,229,1) 100%)' });
    $('#DPC img').width(_w1 * 2 + padding_wh).height(_h1 * 2 + padding_wh);
    $('#catenary img').width(_w1).height(_h3 * 2 + padding_wh);
    $('.tb_menu2').find('a').removeClass("border");
    

    setTimeout(show1, 50);
    setTimeout(show2, 50);
    setTimeout(show3, 50);
    setTimeout(show4, 50);
    setTimeout(show5, 50);
    setTimeout(show6, 50);
    setTimeout(showDPC, 50);
    setTimeout(showProblem, 50);
    setTimeout(showDetectPlan, 50);
    setTimeout(showOnePole, 50);
    setTimeout(showGIS, 50);
    setTimeout(showTask, 50);
    setTimeout(showCatenary, 50);
    setTimeout(showOnePlace, 50);
    setTimeout(showReport, 50);
    setTimeout(showRepair, 50);
    setTimeout(showPolling, 50);
    setTimeout(showIntelligence, 50);
    setTimeout(showSystem, 50);
    load();
    function showDPC() {//DPC
        $('#DPC').animate({
            top: $('.header').height() + padding_t,
            left: padding_allL, opacity: 1,
            width: _w1 * 2 + padding_wh,
            height: _h1 * 2 + padding_wh
        }, 0);
    };
    function show1() {//1C
        $('#1C').animate({
            top: $('.header').height() + _h1 * 2 + padding_wh * 2 + padding_t,
            left: padding_allL, opacity: 1,
            width: _w1,
            height: _h1
        }, 0);

    };

    function show2() {//2C
        $('#2C').animate({
            top: $('.header').height() + _h1 * 2 + padding_wh * 2 + padding_t,
            left: _w1 + padding_wh + padding_allL,
            opacity: 1,
            width: _w1,
            height: _h1
        }, 0);

    };

    function show3() {//3C
        $('#3C').animate({
            top: $('.header').height() + _h1 * 3 + padding_wh * 3 + padding_t,
            left: padding_allL,
            opacity: 1,
            width: _w1,
            height: _h1
        },0);

    };
    function show4() {//4C
        $('#4C').animate({
            top: $('.header').height() + _h1 * 3 + padding_wh * 3 + padding_t,
            left: _w1 + padding_wh + padding_allL,
            opacity: 1,
            width: _w1,
            height: _h1
        }, 0);

    };
    function show5() {//5C
        $('#5C').animate({
            top: $('.header').height() + _h1 * 4 + padding_wh * 4 + padding_t,
            left: padding_allL,
            opacity: 1,
            width: _w1,
            height: _h1
        }, 0);

    };
    function show6() {//6C
        $('#6C').animate({
            top: $('.header').height() + _h1 * 4 + padding_wh * 4 + padding_t,
            left: _w1 + padding_wh + padding_allL,
            opacity: 1,
            width: _w1,
            height: _h1
        }, 0);
    };
    function showProblem() {//缺陷库
        // $('#6C').css('top', _h + _h2).css("right", '0px');
        $('#problem').animate({
            top: $('.header').height() + padding_t,
            left: _w1 * 2 + padding_wh * 2 + padding_allL,
            opacity: 1,
            width: _w1,
            height: _h3 * 2 + padding_wh
        }, 0);
    }
    function showDetectPlan() {//检测计划管理
        // $('#6C').css('top', _h + _h2).css("right", '0px');
        $('#detectPlan').animate({
            top: $('.header').height() + _h3 * 2 + padding_t + padding_wh * 2,
            left: _w1 * 2 + padding_wh * 2 + padding_allL,
            opacity: 1,
            width: _w1,
            height: _h3
        }, 0);
    };
    function showOnePole() {//一杆一档
        $('#onePole').animate({
            top: $('.header').height() + _h3 * 3 + padding_t + padding_wh * 3,
            left: _w1 * 2 + padding_wh * 2 + padding_allL,
            opacity: 1,
            width: _w1,
            height: _h3 * 2 + padding_wh
        }, 0);
    };
    function showGIS() {//GIS分析
        $('#gis').animate({
            top: $('.header').height() + _h3 * 5 + padding_t + padding_wh * 5,
            left: _w1 * 2 + padding_wh * 2 + padding_allL,
            opacity: 1,
            width: _w1,
            height: _h3
        }, 0);
    };
    function showTask() {//任务管理
        $('#task').animate({
            top: $('.header').height() + padding_t,
            right: _w1 + padding_wh + padding_allL,
            opacity: 1,
            width: _w1,
            height: _h3 * 2 + padding_wh
        }, 0);
    };
    function showCatenary() {//接触网实时监测
        $('#catenary').animate({
            top: $('.header').height() + _h3 * 2 + padding_t + padding_wh * 2,
            right: _w1 + padding_wh + padding_allL,
            opacity: 1,
            width: _w1,
            height: _h3 * 2 + padding_wh
        }, 0);
    };
    function showOnePlace() {//一所一档
        $('#onePlace').animate({
            top: $('.header').height() + _h3 * 4 + padding_t + padding_wh * 4,
            right: _w1 + padding_wh + padding_allL,
            opacity: 1,
            width: _w1,
            height: _h3
        }, 0);
    };
    function showReport() {//报表统计
        $('#report').animate({
            top: $('.header').height() + _h3 * 5 + padding_t + padding_wh * 5,
            right: _w1 + padding_wh + padding_allL,
            opacity: 1,
            width: _w1,
            height: _h3
        }, 0);
    };
    function showRepair() {//检修结果复核
        $('#repair').animate({
            top: $('.header').height() + padding_t,
            right: padding_allL,
            opacity: 1,
            width: _w1,
            height: _h1
        }, 0);
    };
    function showPolling() {//线路巡检
        $('#polling').animate({
            top: $('.header').height() + padding_t + _h1 + padding_wh,
            right: padding_allL,
            opacity: 1,
            width: _w1,
            height: _h1 * 2 + padding_wh
        }, 0);
    };
    function showIntelligence() {//智能分析
        $('#intelligence').animate({
            top: $('.header').height() + padding_t + _h1 * 3 + padding_wh * 3,
            right: padding_allL,
            opacity: 1,
            width: _w1,
            height: _h1
        }, 0);
    };
    function showSystem() {//系统管理
        $('#system').animate({
            top: $('.header').height() + padding_t + _h1 * 4 + padding_wh * 4,
            right: padding_allL,
            opacity: 1,
            width: _w1,
            height: _h1
        }, 0);
    }

});