/*========================================================================================*
* 功能说明：C1设备轨迹信息
* 注意事项：
* 作    者： Dj
* 版本日期：2015年9月24日
* 修 改 人： Dj
* 修改日期：2015年9月24日
* 变更说明：
* 版 本 号： V1.0
*=======================================================================================*/
function OrbMapbind(ID) {
    var mapLevel = 15;//初次加载地图层次
    var C1Map = NewMap("orBmapDiv", mapLevel);
    map = C1Map;
    var url = "/Common/MGIS/ASHX/Sms/C1EventInfo.ashx?ID=" + ID;
    var json = GetData(url);
    getC1Event(json);
    C1EventJson = json;
};

var EventNumber = 0;//动态加载点的第几位
var C1EventJson;//轨迹JSON
var setSmsshow;//自动刷新
var map;//地图对象
var _deviceid;//车哈
var _startdate;//开始时间
var _enddate;//结束时间
var _json;//全部轨迹JSON
var __GJC3AlarmJson; //轨迹告警JSON

//动态加载机车轨迹
function getC1Event(json) {


    if (json != undefined) {
        if (json == null || json.length == 0) {
            ymPrompt.errorInfo(deviceid + '； 当前车没有运行数据，请稍后再试。', null, null, '提示信息', null);
            return;
        }
        if (json[0].GIS_X != "" && json[0].GIS_X != "0") {
            var point = new BMap.Point(json[0].GIS_X, json[0].GIS_Y);    // 创建点坐标
            map.panTo(point);



            var Point = new BMap.Point(json[0].GIS_X, json[0].GIS_Y);
            var lable = "当前位置";
            var icon = "";

            icon = new BMap.Icon("/Common/MRTA/img/动车.png", new BMap.Size(30, 37));

            var labelMark;


            lable += "<br/>" + json[0].POLE_NUMBER;
            labelMark = new BMap.Label(lable, { point: Point });
            labelMark.setOffset(new BMap.Size(-40, -30));
            labelMark.type = "LableSms";
            labelMark.setStyle({
                color: "white",
                fontSize: "12px",

                backgroundColor: "rgba(10, 10, 27, 0.58)",
                border: "0",
                fontWeight: "bold"
            });
            marker = new BMap.Marker(Point, { icon: icon });
            marker.setLabel(labelMark);
            marker.json = json[0];
            marker.setZIndex(10);
            EventNumber = 0;
            marker.type = "C1Event";
            marker.number = EventNumber;
            map.addOverlay(marker);
            if (json[EventNumber].ALARM_ID != "") {
                NewAlarm(json[EventNumber], Point);
            }
            setSmsshow = setInterval('SetC1Event()', 200);
        }
    }
    return json;
}



//动态加载
function SetC1Event() {
    if (EventNumber < C1EventJson.length - 1) {
        var overlays = map.getOverlays();
        var p;

        for (var i = 0; i < overlays.length; i++) {

            var m = overlays[i];
            if (m.type == "C1Event" && m.number == EventNumber) {
                var Icon = new BMap.Icon("/Common/MGIS/img/1.png", new BMap.Size(40, 27));
                m.setIcon(Icon);
                m.getLabel().hide();
                p = m.getPosition();

            }

        }
        var Points = new Array(2);
        Points[0] = p;
        EventNumber++;


        var Point = new BMap.Point(C1EventJson[EventNumber].GIS_X, C1EventJson[EventNumber].GIS_Y);
        Points[1] = Point;

        var bs = map.getBounds();   //获取可视区域
        var bssw = bs.getSouthWest();   //可视区域左下角
        var bsne = bs.getNorthEast();   //可视区域右上角
        if (bssw.lng > parseFloat(C1EventJson[EventNumber].GIS_X)) {
            map.panTo(Point);
        } else if (bsne.lng < parseFloat(C1EventJson[EventNumber].GIS_X)) {
            map.panTo(Point);
        } else if (bssw.lat > parseFloat(C1EventJson[EventNumber].GIS_Y)) {
            map.panTo(Point);
        } else if (bsne.lat < parseFloat(C1EventJson[EventNumber].GIS_Y)) {
            map.panTo(Point);
        }

        var lable = "当前位置";
        var icon = "";
        icon = new BMap.Icon("/Common/MRTA/img/动车.png", new BMap.Size(30, 37));

        var labelMark;
        lable += "<br/>" + C1EventJson[EventNumber].POSITION_NAME;

        lable += "<br/>" + C1EventJson[EventNumber].POLE_NUMBER + "号支柱；";
        labelMark = new BMap.Label(lable, { point: Point });
        labelMark.setOffset(new BMap.Size(-40, -30));
        labelMark.type = "LableSms";
        labelMark.setStyle({
            color: "white",
            fontSize: "12px",
            backgroundColor: "rgba(10, 10, 27, 0.58)",
            border: "0",
            fontWeight: "bold"
        });
        marker = new BMap.Marker(Point, { icon: icon });
        marker.setLabel(labelMark);
        marker.json = C1EventJson[EventNumber];
        marker.setZIndex(4);
        marker.type = "C1Event";
        marker.number = EventNumber;
        map.addOverlay(marker);
        var redline = new BMap.Polyline(Points, { strokeColor: "#00EE00", strokeWeight: 5, strokeOpacity: 1, strokeStyle: "solid" });
        //  redline.setStrokeStyle("dashed");
        map.addOverlay(redline);
        if (C1EventJson[EventNumber].ALARM_ID != "") {
            NewAlarm(C1EventJson[EventNumber], Point);
        }
    } else {
        clearInterval(setSmsshow);
    }
}

//查询条件
function OnClickSmsInfo() {

    var deviceid = GetQueryString("deviceid");
    var startTime = $("#Text2").val();
    var endTime = $("#Text3").val();

    getC3Sms_Info(map, deviceid, startTime, endTime);
}

var setshowSms; //定时器
function RefreshSms() {
    var showtime = 60000; //刷新时间
    setshowSms = setInterval('show_Sms()', showtime);
}
//关闭定时器
function closeTime() {
    clearInterval(setshowSms); //关闭定时器
}
//加速显示
function show_Sms() {
    var deviceid = GetQueryString("deviceid");
    var startTime = C3SmsJson[0].DETECT_TIME;
    var endTime = datehhssNowStr();
    var json = getC3ProcessInfoPointsData(deviceid, startTime, endTime);

    if (json != undefined) {
        if (json == null || json.length == 0) {
            return;
        }
        if (C3SmsJson.length < json[0][1].JCINFO.length) {
            C3SmsJson = json[0][1].JCINFO;
            setSmsshow = setInterval('SetC1Event()', 200);
        }

    }

}

function JSSms() {

    clearInterval(setSmsshow);
    var showtime = 1; //刷新时间
    setSmsshow = setInterval('SetC1Event()', 0);

}

function getC3AlarmInfo(e) {
    var id = this.json.ALARM_ID;
    var url = "../../C1/PC/MAlarmMonitoring/MonitorAlarmC1Form.htm?alarmid=" + id + '&v=' + version;
    window.open(url, "_blank");
}


function NewAlarm(json, Point) {
    var IScheckWC = $("body", parent.document).find("#cb_type4").is(':checked');
    var IscheckType1 = $("body", parent.document).find("#cb_type1").is(':checked');
    var IscheckType2 = $("body", parent.document).find("#cb_type2").is(':checked');
    var IscheckType3 = $("body", parent.document).find("#cb_type3").is(':checked');

    var Ischeck_new = $("body", parent.document).find("#cb_new").is(':checked');
    var Ischeck_sure = $("body", parent.document).find("#cb_sure").is(':checked');
    var Ischeck_plan = $("body", parent.document).find("#cb_plan").is(':checked');
    var Ischeck_check = $("body", parent.document).find("#cb_check").is(':checked');
    var Ischeck_close = $("body", parent.document).find("#cb_close").is(':checked');

    displayStr = "";
    //            if (m.CODE_NAME != "新上报" && !IScheckWC || m.SEVERITY == "一类" && !IscheckType1 || m.SEVERITY == "二类" && !IscheckType2 || m.SEVERITY == "三类" && !IscheckType3) {
    //                displayStr = "hide";
    //            }

    if (!IscheckType1 && json.SEVERITY == "一类") {
        displayStr = "hide";
    }

    if (!IscheckType2 && json.SEVERITY == "二类") {
        displayStr = "hide";
    }

    if (!IscheckType3 && json.SEVERITY == "三类") {
        displayStr = "hide";
    }

    if (!Ischeck_new && json.STATUS == "AFSTATUS01") {
        displayStr = "hide";
    }

    if (!Ischeck_sure && m.STATUS == "AFSTATUS03") {
        displayStr = "hide";
    }

    if (!Ischeck_plan && json.STATUS == "AFSTATUS04") {
        displayStr = "hide";
    }

    if (!Ischeck_check && json.STATUS == "AFSTATUS07") {
        displayStr = "hide";
    }

    if (!Ischeck_close && json.STATUS == "AFSTATUS05") {
        displayStr = "hide";
    }

    var icoUrl = '/Common/MGIS/img/StatusLevel.png';
    switch (json.STATUS) {
        case 'AFSTATUS01':
            new_number++;
            icoUrl = icoUrl.replace('Status', 'new');
            break;
        case 'AFSTATUS03':
            sure_number++;
            icoUrl = icoUrl.replace('Status', 'sure');
            break;
        case 'AFSTATUS04':
            plan_number++;
            icoUrl = icoUrl.replace('Status', 'plan');
            break;
        case 'AFSTATUS07':
            check_number++;
            icoUrl = icoUrl.replace('Status', 'check');
            break;
        case 'AFSTATUS05':
            close_number++;
            icoUrl = icoUrl.replace('Status', 'close');
            break;
    }



    switch (json.SEVERITY) {
        case '一类':
            One_number++;
            icoUrl = icoUrl.replace('Level', '1');
            break;
        case '二类':
            Two_number++;
            icoUrl = icoUrl.replace('Level', '2');
            break;
        case '三类':
            Three_number++;
            icoUrl = icoUrl.replace('Level', '3');
            break;
    }

    var Alarmicon = new BMap.Icon(icoUrl, new BMap.Size(20, 20));
    var markerAlarm = new BMap.Marker(Point, { icon: Alarmicon });
    //marker.setLabel(labelMark);
    map.addOverlay(markerAlarm);
    markerAlarm.disableDragging(true);
    markerAlarm.json = json;
    markerAlarm.setZIndex(5); //缺陷
    markerAlarm.type = "Alarm";
    markerAlarm.addEventListener("click", getC3AlarmInfo);
    if (displayStr != "") {
        markerAlarm.hide();
    } else {
        markerAlarm.show();
    }
    SetAlarmNumber(One_number, Two_number, Three_number, new_number, sure_number, plan_number, check_number, close_number);
}

var One_number = 0;
var Two_number = 0;
var Three_number = 0;

var new_number = 0;
var sure_number = 0;
var plan_number = 0;
var check_number = 0;
var close_number = 0;

var wc_number = 0;
var displayStr = "";

function showType(_type, _isShow) {

    //new_number = 0, sure_number = 0, plan_number = 0, check_number = 0, close_number = 0;

    var overlays = map.getOverlays();
    //	alert(overlays.length);
    for (var i = 0; i < overlays.length; i++) {



        var m = overlays[i];



        if (m.type == "Alarm" && m.json.SEVERITY == _type) {

            var isCheckedStatus = false;
            switch (m.json.STATUS) {
                case 'AFSTATUS01':
                    if (_isShow) {
                        new_number++;
                    } else {
                        new_number--;
                    }
                    isCheckedStatus = $("body", parent.document).find("#cb_new").is(':checked');
                    break;
                case 'AFSTATUS03':
                    if (_isShow) {
                        sure_number++;
                    } else {
                        sure_number--;
                    }
                    isCheckedStatus = $("body", parent.document).find("#cb_sure").is(':checked');
                    break;
                case 'AFSTATUS04':
                    if (_isShow) {
                        plan_number++;
                    } else {
                        plan_number--;
                    }
                    isCheckedStatus = $("body", parent.document).find("#cb_plan").is(':checked');
                    break;
                case 'AFSTATUS07':
                    if (_isShow) {
                        check_number++;
                    } else {
                        check_number--;
                    }
                    isCheckedStatus = $("body", parent.document).find("#cb_check").is(':checked');
                    break;
                case 'AFSTATUS05':
                    if (_isShow) {
                        close_number++;
                    } else {
                        close_number--;
                    }
                    isCheckedStatus = $("body", parent.document).find("#cb_close").is(':checked');
                    break;


            }
            if (_isShow && isCheckedStatus) {
                overlays[i].show();

            }
            else {

                overlays[i].hide();

            }
        }
    }
    SetAlarmNumber(One_number, Two_number, Three_number, new_number, sure_number, plan_number, check_number, close_number);

}

function showStatus(_status, _isShow) {


    var overlays = map.getOverlays();
    for (var i = 0; i < overlays.length; i++) {
        var m = overlays[i];

        if (m.type == "Alarm" && m.json.STATUS == _status) {

            var isCheckedType = false;
            switch (m.json.SEVERITY) {
                case '一类':
                    isCheckedType = $("body", parent.document).find("#cb_type1").is(':checked');
                    break;
                case '二类':
                    isCheckedType = $("body", parent.document).find("#cb_type2").is(':checked');
                    break;
                case '三类':
                    isCheckedType = $("body", parent.document).find("#cb_type3").is(':checked');
                    break;

            }



            if (_isShow && isCheckedType) {
                overlays[i].show();

            }
            else {
                overlays[i].hide();

            }
        }
    }
}


function SetAlarmNumber(One_number, Two_number, Three_number, _new, _sure, _plan, _check, _close) {
    $("#one_number").html(One_number);
    $("#two_number").html(Two_number);
    $("#three_number").html(Three_number);
    //$("#wc_number").html(wc_number);

    $("#new_number").text(_new);
    $("#sure_number").text(_sure);
    $("#plan_number").text(_plan);
    $("#check_number").text(_check);
    $("#close_number").text(_close);


}