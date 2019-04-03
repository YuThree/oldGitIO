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

            bqxMapbind(mapLevel, startdate, enddate);
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


//刷新缺陷
function refushAlarm() {

    hid_pop();


    //LoadAlarm({});
    RefreshAlarm();

}




function getC3AlarmInfo(e) {
    AgainRefsetInterval(); //重启定时器
    type = e.json.CATEGORY_CODE;

    id = e.json.ALARM_ID;

    ColseC3AlarmInfo();
    if (getConfig('For6C') == 'DPC') {
        switch (type) {
            case "1C":
                url = "/6C/PC/MAlarmMonitoring/MonitorAlarm1CForm6C.htm?alarmid=";
                break;
            case "2C":
                url = "/6C/PC/MAlarmMonitoring/MonitorAlarmC2Form6C.htm?alarmid=";
                break;
            case "3C":
                url = "/6C/PC/MAlarmMonitoring/MonitorAlarm3CForm6C.htm?alarmid=";
                break;
            case "4C":
                url = "/6C/PC/MAlarmMonitoring/MonitorAlarmC4Form6C.htm?alarmid=";
                break;
            case "5C":
                url = "/6C/PC/MAlarmMonitoring/MonitorAlarm5CForm6C.htm?alarmid=";
                break;
            case "6C":
                url = "/6C/PC/MAlarmMonitoring/MonitorAlarmC6Form6C.htm?alarmid=";
                break;
            default:
                break;
        }
    } else {
        switch (type) {
            case "1C":
                url = "../../C1/PC/MAlarmMonitoring/MonitorAlarmC1Form.htm?alarmid=";
                break;
            case "2C":
                url = "../../C2/PC/Fault/MonitorAlarmC2Form.htm?alarmid=";
                break;
            case "3C":
                if (getConfig('For6C') == '6C') {
                    url = "../../C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=";
                }
                else {
                    url = "../../C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=";
                }
                break;
            case "4C":
                url = "../../C4/PC/Fault/MonitorAlarmC4Form.htm?alarmid=";
                break;
            case "5C":
                url = "../../C5/PC/Fault/MonitorAlarmC5Form.htm?alarmid=";
                break;
            case "6C":
                url = "../../C6/PC/Fault/MonitorAlarmC6Form.htm?alarmid=";
                break;
            default:
                break;
        }
    }
    var HTMLURL;
    if (getConfig('For6C') == '6C') {
        HTMLURL = url + id + "";
    }
    else {
        HTMLURL = url + id + "";
    }
    HTMLURL += "&rsurl=no";
    if (getConfig('For6C') != "3C" || getCookieValue("GISSmall") == "small" ) {
        window.open(HTMLURL + '&v=' + version, "_blank");

        //var point = new BMap.Point(e.json.GIS_X, e.json.GIS_Y);    // 创建点坐标
        //maps.panTo(point);
    } else {
        OpenC3AlarmAnimation();
        $("#C3Alarm").css('display', '');
        SetAlarmID(getConfig('For6C'), id);
        getAlarminfo(id);

        document.getElementById('crossing_no').innerHTML = e.json.AREA_SECTION; // 运用区段
        document.getElementById('line_code').innerHTML = e.json.LINE_NAME; //线路
        document.getElementById('CJ').innerHTML = e.json.CJ; //车间
        document.getElementById('BZ').innerHTML = e.json.BZ; //班组
        document.getElementById('QZ').innerHTML = e.json.QZ; //QZ
        document.getElementById('brige').innerHTML = e.json.BRIDGE_TUNNEL_NO; //桥隧
        document.getElementById('pole_number').innerHTML = e.json.POLE_NUMBER; //支柱
        document.getElementById('km_mark').innerHTML = e.json.KM; //公里标
        document.getElementById('status').innerHTML = e.json.STATUSDIC; //状态
        document.getElementById('reportdate').value = e.json.REPORT_DATE; //报告时间
        document.getElementById('raised_time').innerHTML = "<a href='#' onclick='GetC3AlarmFrom(\"" + id + "\")'>" + e.json.RAISED_TIME + "</a>"; //发生
        document.getElementById('status_time').innerHTML = e.json.STATUS_TIME; //状态
        document.getElementById('trainNo').innerHTML = e.json.LOCNO; //设备号
        document.getElementById('vendor').innerHTML = e.json.VENDOR; //设备厂商
        document.getElementById('jlh').innerHTML = e.json.CROSSING_NO; //交路号
        document.getElementById('sudu').innerHTML = e.json.SPEED; //速度
        document.getElementById('wendu').innerHTML = e.json.WENDU; //温度
        document.getElementById('hjwendu').innerHTML = e.json.HJWENDU; //温度
        document.getElementById('dgz').innerHTML = e.json.LINE_HEIGHT; //导高
        document.getElementById('lcz').innerHTML = e.json.PULLING_VALUE; //拉出值
        document.getElementById('txtDefect').innerHTML = e.json.ALARM_ANALYSIS; //缺陷分析
        document.getElementById('txtAdvice').innerHTML = e.json.PROPOSAL; //处理建议
        document.getElementById('txtNote').innerHTML = e.json.REMARK; //备注
        document.getElementById('severity').innerHTML = e.json.SEVERITY; //级别
        document.getElementById('SUMMARYDIC').innerHTML = e.json.SUMMARYDIC; //故障状态
        document.getElementById('txtReporter').innerHTML = e.json.REPORT_PERSON; //报告人
        document.getElementById('reportdate').innerHTML = e.json.REPORT_DATE; //报告时间
        document.getElementById('STATION_NO').innerHTML = e.json.STATION_NO; //车站
        document.getElementById('WZ').innerHTML = e.json.wz; //车站
        document.getElementById('BOW_TYPE').innerHTML = e.json.BOW_TYPE; //弓位置
        if (e.json.MisShow == "false") {
        } else {
            document.getElementById('E_btnOk2').style.display = 'none';
            document.getElementById('E_btnCan2').style.display = 'none';
        }

    }

}


function ColseC3AlarmInfo() {
    //var overlays = maps.getOverlays();
    //for (var i = 0; i < overlays.length; i++) {
    //    var m = overlays[i];

    //    if (oldp != null) {
    //        oldp.setAnimation(null);
    //    }
    //}

    $("#C3Alarm").css("display", "none");
    // id = "";
}


function OpenC3AlarmAnimation() {
    //var overlays = maps.getOverlays();
    //for (var i = 0; i < overlays.length; i++) {
    //    var m = overlays[i];

    //    if (m.type == "Alarm") {
    //        if (m.json.ALARM_ID == id) {
    //            m.setAnimation(BMAP_ANIMATION_BOUNCE);
    //            oldp = m;
    //        }
    //    }
    //}
}