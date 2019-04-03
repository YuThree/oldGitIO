///==============GIS页面操作JS====================
//两个GIS页面轮换
function setTab(name, cursel, n) {
    for (i = 1; i <= n; i++) {
        var menu = document.getElementById(name + i);
        var con = document.getElementById("con_" + name + "_" + i);
        menu.className = i == cursel ? "hover" : "";
        con.style.display = i == cursel ? "block" : "none";
    }
}
///缺陷GIS的条件过滤
function TimeAlarmInfo() {
    var startdate = document.getElementById('startdate').value;
    var enddate = document.getElementById('enddate').value;
    var mapLevel = getConfig('mapLevel');
    if (startdate == "") {
        ymPrompt.errorInfo('查询开始时间不能为空', null, null, '提示信息', null);
    } else if (enddate == "") {
        ymPrompt.errorInfo('查询结束时间不能为空', null, null, '提示信息', null);
    } else
        if (enddate < startdate) {
            ymPrompt.errorInfo('结束时间必须比开始时间大~！！', null, null, '提示信息', null);
            return;
        } else {
            //  QXmap.clearOverlays();
            // AlarmLen = "3"; //定义缺陷查询
            //getMisC3AlarmPoint(QXmap, "", "", "", AlarmLen, "");
            getxqMislineSCenterPoints(mapLevel, QXmap, startdate, enddate);
            // getMisC3AlarmPoint(QXmap, "", startdate, enddate, "3", "")
            //  bqxMapbind(mapLevel, startdate, enddate);
        }
}
//消息提示框
var second = 3000; //信息框关闭时间
var i = 0;
function show_pop() {

    var alarmtime = "";
    var strCookie = document.cookie;
    var arrCookie = strCookie.split(";");
    for (var i = 0; i < arrCookie.length; i++) {

        var arr = arrCookie[i].split("=");
        if (arr[0].replace(/[ ]/g, "") == "C3Alarm") {
            alarmtime = arr[1];
        }
    }
    responseData = XmlHttpHelper.transmit(false, "get", "text", "ASHX/Cue/Cue.ashx?Time=" + alarmtime + "&Category_Code=" + GetQueryString("Category_Code") + '&type=Alarm&temp=' + Math.random(), null, null);
    var responseDatalist = responseData.split('!@#');
    if (responseDatalist[0] > 0) {
        refushAlarm();
        if (getCookieValue("GISSmall") == "small") {
            window.parent.frames["url"].src = "/C3/PC/MRTA/C3AlarmImg.aspx";
        }

        play_click(this, 'mp3/140_SCREAM.mp3');
        document.getElementById("winpop").style.display = "block";
        document.getElementById("AlarmSpan").innerHTML = responseDatalist[1];
        setTimeout("playhid_pop()", second); //3秒后自动关闭
        i++;
        xmlHttp = null;
    }
    xmlHttp = null;
    responseData = null;
}

function hid_pop() {//隐藏窗口
    var div = document.getElementById('div1');
    div.innerHTML = "";
    document.getElementById("winpop").style.display = "none";
}
function playhid_pop() {//
    var div = document.getElementById('div1');
    div.innerHTML = "";
}

//播放声音
function play_click(sef, url) {
    var div = document.getElementById('div1');
    div.innerHTML = '<embed src="' + url + '" loop="0" starttime="00:10" autostart="true" hidden="false"></embed>';
    var emb = document.getElementsByTagName('EMBED')[0];
    if (emb) {
        /* 这里可以写成一个判断 wav 文件是否已加载完毕，以下采用setTimeout模拟一下 */
        div = document.getElementById('div2');
        div.innerHTML = 'loading: ' + emb.src;
        sef.disabled = true;
        setTimeout(function () { div.innerHTML = ''; }, 1000);
    }
}

//刷新页面
function myrefresh() {
    window.location.reload();
}
//下拉列表
function MisLinesSelect() {
    responseData = XmlHttpHelper.transmit(false, "get", "text", "ASHX/Select/Select.ashx?type=1", null, null);
    var list = responseData.toString().split("$");
    document.getElementById("divddlOrg").innerHTML = list[1];
    document.getElementById("divddlLine").innerHTML = list[0];
    LineChange2($("#txtLine option:first").attr("value"));
    OrgChange3($("#ddlOrg option:first").attr("value"));
    OrgChange4($("#ddlWorkshop option:first").attr("value"));
}
//下拉列表连动区站
function LineChange2(code) {
    responseData = XmlHttpHelper.transmit(false, "get", "text", "ASHX/Select/Select.ashx?type=2&LINE_CODE=" + escape(code), null, null);
    document.getElementById("divddlPosition").innerHTML = responseData;
}
//下拉列表连动车间
function OrgChange3(code) {
    responseData = XmlHttpHelper.transmit(false, "get", "text", "ASHX/Select/Select.ashx?type=3&ORG_CODE=" + escape(code), null, null);
    document.getElementById("divddlWorkshop").innerHTML = responseData;
}
//下拉列表连动工区
function OrgChange4(code) {
    responseData = XmlHttpHelper.transmit(false, "get", "text", "ASHX/Select/Select.ashx?type=4&ORG_CODE=" + escape(code), null, null);
    document.getElementById("divddlWorkshoporg").innerHTML = responseData;
}
//刷新设备和信息框提示方法
var setshow; //信息框定时器
var setloco; //设备刷新定时器
function RefsetInterval(type) {
    var showtime = 30000; //信息框提示时间
    var locotime = 120000; //设备刷新时间
    setshow = setInterval('show_pop()', showtime);
    if (type != "small")
        setloco = setInterval('refushLocos()', locotime);
}
//关闭定时器重新启用定时器
function AgainRefsetInterval() {
    clearInterval(setshow); //关闭信息框定时器
    clearInterval(setloco); //关闭刷新设备定时器
    var showtime = 30000; //信息框提示时间
    var locotime = 120000; //设备刷新时间
    setshow = setInterval('show_pop()', showtime);
    setloco = setInterval('refushLocos()', locotime);
}

//全屏模式
function toADisplay(type) {
    if (type == "1") {
        document.getElementById("FullScreen").style.display = "none";
        document.getElementById("ExitFullScreen").style.display = "block";
        document.getElementById("mapDiv").style.height = "1000px";
    } else {
        document.getElementById("FullScreen").style.display = "block";
        document.getElementById("ExitFullScreen").style.display = "none";
    }
}
