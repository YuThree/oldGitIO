
/*========================================================================================*
* 功能说明：C3报警信息
* 注意事项：
* 作    者： Dj
* 版本日期：2013年5月29日
* 修 改 人： Dj
* 修改日期：2013年5月29日
* 变更说明：
* 版 本 号： V1.0
*=======================================================================================*/



var cc = 0; //记录当前层数
function getC3ProcessInfo(startdate, enddate) {
    var json = getC3Sms_Info(map, deviceid, startdate, enddate);
    return json;
};

//查看设备短信信息《无短信和轨迹》
function getC3SmsOtherInfo(e) {
    var html = GerSmsHtml(this.json);
    var p = new BMap.Point(this.json.GIS_X, this.json.GIS_Y);
    if (animateMarker == null) {
        animateMarker = new AnimateMarker(p, html);
        animateMarker.type = "animateMarker";
        map.addOverlay(animateMarker);
    }
    else {
        animateMarker.setPointAndText(p, html);
    }
};
//右键查看设备短信信息《无短信和轨迹》
function getC3RightClickSmsOtherInfo(map, e) {
    var html = GerSmsHtml(e);
    var p = new BMap.Point(e.GIS_X, e.GIS_Y);
    if (animateMarker == null) {
        animateMarker = new AnimateMarker(p, html);
        animateMarker.type = "animateMarker";
        map.addOverlay(animateMarker);
    }
    else {
        animateMarker.setPointAndText(p, html);
    }
};



//设备短信
function getC3SMSInfo() {
    var url = "ASHX/C3ProcessInfo.ashx?deviceid=" + deviceid + "&type=2";
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        cache: true,
        success: function (result) {
            alert("短信发送成功，请稍后...");
        }
    });
};
var alarmJson;
var displayStr = "";
//设备报警点
function getMisC3AlarmPoint(map, deviceid, startTime, endTime, leNum, lineCode, direction, alarmType) {
    if (direction == undefined || direction == "undefined") {
        direction = "";
    }

    if (alarmType == undefined || alarmType == "undefined") {
        alarmType = "";
    }


    //调用异步查询数据的方法  

    var json = getMisC3AlarmPointsData(deviceid, startTime, endTime, leNum, lineCode, map, direction, alarmType);
    //bMapObjData.js   回调 getMisC3AlaemPointAsync
    return json;
};

var markers = [];
//数据加载之后执行加载告警信息
function getMisC3AlaemPointAsync(QXmap, json, deviceid, startTime, endTime, leNum, lineCode) {
    var jbJson = GetSeverityJson();
    markers = [];
    alarmJson = json;
    var markerClusterer;
    var IscheckType1 = $("#cb_type1").is(':checked');
    var IscheckType2 = $("#cb_type2").is(':checked');
    var IscheckType3 = $("#cb_type3").is(':checked');
    if (json != undefined) {
        for (var i = 0; i < json.length; i++) {
            if (json[i].CATEGORY_CODE == "6C") {
                if (leNum == "3") { } else {
                    continue;
                }
            }
            displayStr = "";
            var m = json[i];
            if (m.CODE_NAME != "新上报" || m.SEVERITY == "一类" && !IscheckType1 || m.SEVERITY == "二类" && !IscheckType2 || m.SEVERITY == "三类" && !IscheckType3) {
                displayStr = "hide";
            }
            if (leNum == "3") {
                displayStr = "";

            }
            if (json[i].GIS_X != "0") {
                var Point = new BMap.Point(json[i].GIS_X, json[i].GIS_Y);
                markers.push(new BMap.Marker(Point));
                var icon = "";


                if (json[i].SEVERITY_CODE == "一类") {
                    icon = new BMap.Icon("/Common/MGIS/img/ico1.png", new BMap.Size(Ico_alarm_width, Ico_alarm_heigth));
                }
                else if (json[i].SEVERITY_CODE == "二类") {
                    icon = new BMap.Icon("/Common/MGIS/img/ico2.png", new BMap.Size(Ico_alarm_width, Ico_alarm_heigth));
                }
                else if (json[i].SEVERITY_CODE == "三类") {
                    icon = new BMap.Icon("/Common/MGIS/img/ico3.png", new BMap.Size(Ico_alarm_width, Ico_alarm_heigth));
                }



                var marker = new BMap.Marker(Point, { icon: icon });
                //marker.setLabel(labelMark);
                QXmap.addOverlay(marker);
                marker.disableDragging(true);
                marker.json = json[i];

                marker.setOffset(new BMap.Size(0, -15));
                marker.setZIndex(5); //缺陷
                marker.type = "Alarm";
                if (displayStr != "") {
                    marker.hide();
                } else {
                    marker.show();
                }
                if (leNum == "2") {
                    marker.hide();
                }
                if (getCookieValue("GISSmall") == "small") {
                    marker.show();
                }
                marker.addEventListener("click", getC3AlarmInfo);
                marker.addEventListener("dblclick", getC3AlarmInfo1);
            } else {
                if (parseFloat(json[i].GIS_X_O) > 180 || parseFloat(json[i].GIS_X_O) < 0 || parseFloat(json[i].GIS_Y_O) > 90 || parseFloat(json[i].GIS_Y_O) < 0) {
                    continue;
                }
                var Point = new BMap.Point(json[i].GIS_X_O, json[i].GIS_Y_O);
                BMap.Convertor.translate(Point, 0, GPSZH, i, leNum)
            }
        }
        if (leNum == "3") {
            markerClusterer = new BMapLib.MarkerClusterer(QXmap, { markers: markers });
            QXmap.markerClusterer = markerClusterer;
            QXmap.markers = markers;
        }
    }
    if (deviceid != "" && deviceid != null) {
        QXmap.markerClusterer = markerClusterer;
        QXmap.markers = markers;
    }
    if (leNum == "1") {

        QXmap.markerClusterer = markerClusterer;
        QXmap.markers = markers;
    }
    //写入Cookie 缓存告警最新事件
    if (json.length > 0)
        document.cookie = "C3Alarm=" + json[0].RAISED_TIME;
    else
        document.cookie = "C3Alarm=";
    //整体告警json串加入QXmap对象中  方便后边获取告警数据
    QXmap.c3alarm = json;
    return json;
}
//做转换
GPSZH = function (point, num, leNum) {
    var icon = "";
    if (alarmJson[num].SEVERITY == "一类") {
        icon = new BMap.Icon("/Common/MGIS/img/ico1.png", new BMap.Size(Ico_alarm_width, Ico_alarm_heigth));
    }
    else if (alarmJson[num].SEVERITY == "二类") {
        icon = new BMap.Icon("/Common/MGIS/img/ico2.png", new BMap.Size(Ico_alarm_width, Ico_alarm_heigth));
    }
    else if (alarmJson[num].SEVERITY == "三类") {
        icon = new BMap.Icon("/Common/MGIS/img/ico3.png", new BMap.Size(Ico_alarm_width, Ico_alarm_heigth));
    }
    var marker = new BMap.Marker(point, { icon: icon });
    map.addOverlay(marker);
    marker.json = alarmJson[num];
    marker.type = "Alarm";
    if (displayStr != "") {
        marker.hide();
    } else {
        marker.show();
    }
    if (leNum == "2") {
        marker.hide();
    }
    marker.setZIndex(5); //缺陷
    marker.type = "Alarm";
    //    if (displayStr != "") {
    //        marker.hide();
    //    } else {
    //        marker.show();
    //    }
    marker.setZIndex(5); //缺陷
    marker.addEventListener("click", getC3AlarmInfo);
};
function translate(point, type, callback, j, leNum) {
    var callbackName = 'cbk_' + Math.round(Math.random() * 10000);    //随机函数名
    var xyUrl = "http://api.map.baidu.com/ag/coord/convert?from=" + type + "&to=4&x=" + point.lng + "&y=" + point.lat + "&callback=BMap.Convertor." + callbackName;
    //动态创建script标签
    load_script(xyUrl);
    BMap.Convertor[callbackName] = function (xyResult) {
        delete BMap.Convertor[callbackName];    //调用完需要删除改函数
        var point = new BMap.Point(xyResult.x, xyResult.y);
        callback && callback(point, j, leNum);
    }
};

//C3设备报警信息  //单击
var type; //类型
var id;  //缺陷、报警ID

var oldp = null;

function getC3AlarmInfo(e) {
    type = this.json.CATEGORY_CODE;

    id = this.json.ALARM_ID;

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
                //url = "/6C/PC/MAlarmMonitoring/MonitorAlarm3CForm6C.htm?alarmid=";
                url = "/C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=";
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
    if (getCookieValue("GISSmall") == "small") {
        window.open(HTMLURL + '&v=' + version, "_blank");

        var point = new BMap.Point(this.json.GIS_X, this.json.GIS_Y);    // 创建点坐标
        QXmap.panTo(point);
    } else {
        OpenC3AlarmAnimation();
        $("#C3Alarm").css('display', '');
        SetAlarmID(getConfig('For6C'), id);
        getAlarminfo(id);

        document.getElementById('crossing_no').innerHTML = this.json.AREA_SECTION; // 运用区段
        document.getElementById('line_code').innerHTML = this.json.LINE_NAME; //线路
        document.getElementById('CJ').innerHTML = this.json.CJ; //车间
        document.getElementById('BZ').innerHTML = this.json.BZ; //班组
        document.getElementById('QZ').innerHTML = this.json.QZ; //QZ
        document.getElementById('brige').innerHTML = this.json.BRIDGE_TUNNEL_NO; //桥隧
        document.getElementById('pole_number').innerHTML = this.json.POLE_NUMBER; //支柱
        document.getElementById('km_mark').innerHTML = this.json.KM; //公里标
        document.getElementById('status').innerHTML = this.json.STATUSDIC; //状态
        document.getElementById('reportdate').value = this.json.REPORT_DATE; //报告时间
        document.getElementById('raised_time').innerHTML = "<a href='#' onclick='GetC3AlarmFrom(\"" + id + "\")'>" + this.json.RAISED_TIME + "</a>"; //发生
        document.getElementById('status_time').innerHTML = this.json.STATUS_TIME; //状态
        document.getElementById('trainNo').innerHTML = this.json.LOCNO; //设备号
        document.getElementById('vendor').innerHTML = this.json.VENDOR; //设备厂商
        document.getElementById('jlh').innerHTML = this.json.CROSSING_NO; //交路号
        document.getElementById('sudu').innerHTML = this.json.SPEED; //速度
        document.getElementById('wendu').innerHTML = this.json.WENDU; //温度
        document.getElementById('hjwendu').innerHTML = this.json.HJWENDU; //温度
        document.getElementById('dgz').innerHTML = this.json.LINE_HEIGHT; //导高
        document.getElementById('lcz').innerHTML = this.json.PULLING_VALUE; //拉出值
        document.getElementById('txtDefect').innerHTML = this.json.ALARM_ANALYSIS; //缺陷分析
        document.getElementById('txtAdvice').innerHTML = this.json.PROPOSAL; //处理建议
        document.getElementById('txtNote').innerHTML = this.json.REMARK; //备注
        document.getElementById('severity').innerHTML = this.json.SEVERITY; //级别
        document.getElementById('SUMMARYDIC').innerHTML = this.json.SUMMARYDIC; //故障状态
        document.getElementById('txtReporter').innerHTML = this.json.REPORT_PERSON; //报告人
        document.getElementById('reportdate').innerHTML = this.json.REPORT_DATE; //报告时间
        document.getElementById('STATION_NO').innerHTML = this.json.STATION_NO; //车站
        document.getElementById('WZ').innerHTML = this.json.wz; //车站
        document.getElementById('BOW_TYPE').innerHTML = this.json.BOW_TYPE; //弓位置
        if (this.json.MisShow == "false") {
        } else {
            document.getElementById('E_btnOk2').style.display = 'none';
            document.getElementById('E_btnCan2').style.display = 'none';
        }
        var html = getAlarmHtml(this.json);  //GetHtml.js 中
        var point = new BMap.Point(this.json.GIS_X, this.json.GIS_Y);
        if (animateMarker == null) {
            animateMarker = new AnimateMarker(point, html);
            map.addOverlay(animateMarker);
        }
        else {
            animateMarker.setPointAndText(point, html);
        }
        //加载报警确认取消和转任务弹出框
        LoadSureBox('3C', id);
        $('.footSure').click(function () {
            SetAlarmID("3C", id);
        });
      
        $(".footCancel").click(function () {

            SetAlarmID("3C", id, 1);
            });
    }

};


function getC3AlarmInfo1(e) {

    type = this.json.CATEGORY_CODE;

    id = this.json.ALARM_ID;


    if (getConfig('For6C') == 'DPC') {
        switch (type) {
            case "1C":
                url = "/6C/PC/MAlarmMonitoring/MonitorAlarm1CForm6C.htm?alarmid=";
                break;
            case "2C":
                url = "/6C/PC/MAlarmMonitoring/MonitorAlarmC2Form6C.htm?alarmid=";
                break;
            case "3C":
                url = "/C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=";
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

    window.open(HTMLURL + '&v=' + version, "_blank");

    var point = new BMap.Point(this.json.GIS_X, this.json.GIS_Y);    // 创建点坐标
    map.panTo(point);


};




//删除自定义样式弹出框
function ClearAnimateMarker() {
    map.removeOverlay(animateMarker);
    animateMarker = null;
}


function GetC3AlarmFrom(id) {
    var url = "/C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=" + id + "&rsurl=no&type=SSGIS&v=" + version;
    window.open(url, "_blank");
}

function GetC3AlarmFrom(id) {
    var url = "/C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=" + id + "&rsurl=no&type=SSGIS&v=" + version;
    window.open(url, "_blank");
}


//按钮点击事件
function btnOnClick(btntype) {

    if ("btnTask" == btntype) {
        var url = "/Common/MTask/TaskForm.htm?id=" + id + "&type=openFaultTask&openType=&v=" + version;
        ShowMTwin(url);
    } else {
        document.getElementById('modal-update').click();
        if (btntype == "btnOk") {
            document.getElementById('updatetitle').innerHTML = "报警确认";
            document.getElementById('updatetype').value = "btnOk";
            $('.zrw').show();
            yzAlarmData();
        }
        else {
            $('.zrw').hide();
            document.getElementById('updatetitle').innerHTML = "报警取消";
            document.getElementById('updatetype').value = "btnCan";
            yzAlarmData();
        }
    }
};
//验证数据
function yzAlarmData() {
    var btntype = document.getElementById('updatetype').value;
    var YZ = 0;
    if (btntype == "btnOk") {
        var txtDefect = document.getElementById('UtxtDefect').value; //缺陷分析
        //var afcode = document.getElementById('dll_zt').value; //缺陷类型
        var severity = document.getElementById('Useverity').value; //等级
        // if (afcode != "0") { document.getElementById('afcodeYZ').className = ""; }
        //else if (afcode == "0") { document.getElementById('afcodeYZ').className = "control-group error"; YZ = 1; }
        if (severity != "请选择") { document.getElementById('UseverityYZ').className = ""; }
        else if (severity == "请选择") { document.getElementById('UseverityYZ').className = "control-group error"; YZ = 1; }
        if (txtDefect.replace(/[ ]/g, "") != "" && txtDefect != undefined) { document.getElementById('UtxtDefectYZ').className = ""; }
        else if (txtDefect.replace(/[ ]/g, "") == "" || txtDefect == undefined) { document.getElementById('UtxtDefectYZ').className = "control-group error"; YZ = 1; }
    }
    else if (btntype == "btnCan") {
        var txtDefect = document.getElementById('UtxtDefect').value; //缺陷分析
        if (txtDefect.replace(/[ ]/g, "") != "" && txtDefect != undefined) { document.getElementById('UtxtDefectYZ').className = ""; }
        else if (txtDefect.replace(/[ ]/g, "") == "" || txtDefect == undefined) { document.getElementById('UtxtDefectYZ').className = "control-group error"; YZ = 1; }
    }
    if (YZ != 0) { return false; } else { return true; }
};


//关闭报警
function ColseC3AlarmInfo() {
    var overlays = QXmap.getOverlays();
    for (var i = 0; i < overlays.length; i++) {
        var m = overlays[i];

        if (oldp != null) {
            oldp.setAnimation(null);
        }
    }
    $("#C3Alarm").css("display", "none");
    // id = "";
}
//打开报警
function OpenC3AlarmAnimation() {
    var overlays = QXmap.getOverlays();
    for (var i = 0; i < overlays.length; i++) {
        var m = overlays[i];

        if (m.type == "Alarm") {
            if (m.json.ALARM_ID == id) {
                m.setAnimation(BMAP_ANIMATION_BOUNCE);
                oldp = m;
            }
        }
    }
}

//弹出重复报警页面详情
var mySquare;
function geRepeatAlarmInfo1(e) {
    var json = this.json;
    //拼DIV
    //重复报警的描述，取第0条报警
    var html = "<button type='button' class='close' onclick='SquareClose()'><h3><b>×</b></h3></button><div data-original-title style='height:10px;background-color: #f5f5f5;margin:10px;padding:10px;'><h5><span>重复报警情况说明</span></h5><span style='float:right;'><input type='submit' name='btnOk' value='报警确认' id='btnOk' onclick=btnOnClick('btnOk','" + json[0].ID + "') title='确认疑似缺陷属实' class='btn btn-primary ' />&nbsp;<input type='submit' name='btnCan' value='报警取消' id='btnCan' onclick=btnOnClick('btnCan','" + json[0].ID + "') title='疑似缺陷属于误报，取消该缺陷显示' class='btn btn-primary' /></span></div><div class='row-fluid'><div class='span12' style='text-align: left;'><p style='text-align: left;margin-left:20px;'>";
    if (json[1].LINE != null && json[1].LINE.LINE_NAME != null)
        html += json[1].LINE.LINE_NAME + "，";
    if (json[1].MIS_POSITION != null && json[1].MIS_POSITION.POSITION_NAME != null)
        html += json[1].MIS_POSITION.POSITION_NAME + "站，";
    html += json[0].DETAIL + "</p></div></div>";
    //第一条报警的信息，，取第1条报警
    var jsonSVALUE2 = eval('(' + json[1].SVALUE2 + ')');
    var c3IMA = jsonSVALUE2.SNAPPED_IMA.substring(0, jsonSVALUE2.SNAPPED_IMA.length - 4) + "_IRV.jpg";
    var hwImg = "../FtpRoot/" + json[1].DIR_PATH + c3IMA;
    var kjgImg = "../FtpRoot/" + json[1].DIR_PATH + jsonSVALUE2.SNAPPED_JPG;
    html += "<div class='row-fluid'><div class='box span12'><div class='row-fluid'><div style='height:10px;background-color: #f5f5f5;margin:10px;padding:10px;' data-original-title><h5><span>最近报警信息</span></h5></div><div class='span12' style='text-align: left;'>" + "<p style='text-align: left;'>车号:" + json[1].DETECT_DEVICE_CODE + "&nbsp;&nbsp;时间:" + formatJsonTime(json[1].RAISED_TIME) + "&nbsp;&nbsp;报警温度:" + json[1].NVALUE2 / 100 + "℃&nbsp;&nbsp;环境温度:" + json[1].NVALUE5 / 100 + "℃&nbsp;&nbsp;导高值:" + json[1].NVALUE3 + "mm&nbsp;&nbsp;拉出值:" + json[1].NVALUE4 + "mm&nbsp;&nbsp;速度:" + json[1].NVALUE1 + "km/h</p></div></div><div class='row-fluid'><table><tr><td style='padding-left: 20px; padding-right: 10px;'><img src='" + hwImg + "' height='320px' width='450px'></img></td><td style='padding-left: 50px; padding-right: 10px;'><img src='" + kjgImg + "' height='320px' width='450px'></img></td></tr></table></div><div><p></p></div><div class='row-fluid'>";
    html += "<div style='height:10px;background-color: #f5f5f5;margin:10px;padding:10px;' data-original-title><h5><span>重复报警信息</span></h5></div><div class='carousel slide' id='carousel-938255'><div class='carousel-inner'>";
    //其他报警的信息
    for (var i = 2; i < json.length; i++) {
        var jsonSVALUE2 = eval('(' + json[i].SVALUE2 + ')');
        var c3IMA = jsonSVALUE2.SNAPPED_IMA.substring(0, jsonSVALUE2.SNAPPED_IMA.length - 4) + "_IRV.jpg";
        var hwImg = "../FtpRoot/" + json[i].DIR_PATH + c3IMA;
        var kjgImg = "../FtpRoot/" + json[i].DIR_PATH + jsonSVALUE2.SNAPPED_JPG;
        if (i == 2) {
            html += "<div class='item active' width='950px'><table><tr><td  style='padding-left:20px;padding-right:10px;'><img id='hw1' alt='' src='" + hwImg + "' height='320px' width='450px'/></td><td style='padding-left:50px;padding-right:10px;'><img id='kjg1' alt='' src='" + kjgImg + "'height='320px' width='450px' /></td></tr></table><div class='carousel-caption'><p id='descript' style='text-align: left;'>第" + i + "条&nbsp;车号:" + json[i].DETECT_DEVICE_CODE + "&nbsp;&nbsp;时间:" + formatJsonTime(json[i].RAISED_TIME) + "&nbsp;&nbsp;报警温度:" + json[i].NVALUE2 / 100 + "℃&nbsp;&nbsp;环境温度:" + json[i].NVALUE5 / 100 + "℃&nbsp;&nbsp;导高值:" + json[i].NVALUE3 + "mm&nbsp;&nbsp;拉出值:" + json[i].NVALUE4 + "mm&nbsp;&nbsp;速度:" + json[i].NVALUE1 + "km/h</p></div></div>";
        } else {
            html += "<div class='item' width='950px'><table><tr><td  style='padding-left:20px;padding-right:10px;'><img id='hw1' alt='' src='" + hwImg + "' height='320px' width='450px'/></td><td style='padding-left:50px;padding-right:10px;'><img id='kjg1' alt='' src='" + kjgImg + "'height='320px' width='450px' /></td></tr></table><div class='carousel-caption'><p id='descript' style='text-align: left;'>第" + i + "条&nbsp;车号:" + json[i].DETECT_DEVICE_CODE + "&nbsp;&nbsp;时间:" + formatJsonTime(json[i].RAISED_TIME) + "&nbsp;&nbsp;报警温度:" + json[i].NVALUE2 / 100 + "℃&nbsp;&nbsp;环境温度:" + json[i].NVALUE5 / 100 + "℃&nbsp;&nbsp;导高值:" + json[i].NVALUE3 + "mm&nbsp;&nbsp;拉出值:" + json[i].NVALUE4 + "mm&nbsp;&nbsp;速度:" + json[i].NVALUE1 + "km/h</p></div></div>";
        }

    };
    html += "</div><a data-slide='prev' href='#carousel-938255' onclick='' class='left carousel-control'> ‹</a><a data-slide='next' href='#carousel-938255' class='right carousel-control'>›</a></div>"
    html += "</div></div>";
    //mySquare = new SquareOverlay(map.getCenter(), 820, 800, "white", html);
    //map.addOverlay(mySquare);
    var type = GetQueryString("type");
    if (type == "repeat") {
        $("#sss").html(html);
        $("#sss").css({
            top: 40,
            left: 230
        }).show();
    } else {
        $("#sss").html(html);
        $("#sss").css({
            top: 1,
            left: 255
        }).show();
    }

}

var AlarmJson = null;
//重复报警弹出具体信息
function geRepeatAlarmInfo(e) {
    AlarmJson = this.json;
    window.open("/Common/MDataAnalysis/C3RepeatAlarmImg.aspx");

}
//重复页面列表点击事件   repeatalarm.js
function setPoleClick_list(map, BMap, x, y) {
    var overlays = map.getOverlays();
    for (var i = 1; i < overlays.length; i++) {
        if (overlays[i].type == 'repeat') {
            if (overlays[i].json[0].GIS_X == x && overlays[i].json[0].GIS_Y == y) {
                AlarmJson = overlays[i].json;
                console.log(window.location.href)
                window.open("/Common/MDataAnalysis/C3RepeatAlarmImg.aspx");
            }
        }

    };
}

function changeAlarmJson(objJson)
{
    for (var i = 0 ; i < objJson.length ; i++) {
        for (var y = 0 ; y < AlarmJson.length ; y++) {
            if (objJson[i].ID == AlarmJson[y].ID) {
                AlarmJson[y].LINE_CODE = objJson[i].LINE_CODE;
                AlarmJson[y].LINE_NAME = objJson[i].LINE_NAME;
                AlarmJson[y].POSITION_CODE = objJson[i].POSITION_CODE;
                AlarmJson[y].POSITION_NAME = objJson[i].POSITION_NAME;
                AlarmJson[y].DIRECTION = objJson[i].DIRECTION;
                AlarmJson[y].BRG_TUN_CODE = objJson[i].BRG_TUN_CODE;
                AlarmJson[y].BRG_TUN_NAME = objJson[i].BRG_TUN_NAME;
                AlarmJson[y].POLE_NUMBER = objJson[i].POLE_NUMBER;
                AlarmJson[y].KM_MARK = objJson[i].KM_MARK;
                AlarmJson[y].KM_MARK_NUMBER = objJson[i].KM_MARK_NUMBER;
            }
        }
    } 
}

//时间转换
function formatJsonTime(time) {
    var date = new Date(parseInt(time.replace("/Date(", "").replace(")/", ""), 10));
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}
//隐藏
function SquareClose() {
    $("#sss").hide();
}
//跳转 查看详细信息
function MonitorAlarmForm() {
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
    var HTMLURL;
    if (getConfig('For6C') == '6C') {
        HTMLURL = url + id + "";
    }
    else {
        HTMLURL = url + id + "";
    }
    HTMLURL += "&rsurl=no";
    window.open(HTMLURL + '&v=' + version, "_blank");
    //window.parent.ShowMTwin("../" + HTMLURL, "95", "75");

};
//右键C3设备报警信息
function getC3RightClickAlarmInfo(moveMap, e) {

  //  AgainRefsetInterval(); //重启定时器
    type = e.CATEGORY_CODE;
    id = e.ALARM_ID;
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
    var HTMLURL;
    if (getConfig('For6C') == '6C') {
        HTMLURL = url + id + "";
    }
    else {
        HTMLURL = url + id + "";
    }
    HTMLURL += "&rsurl=no";
    window.open(HTMLURL + '&v=' + version, "_blank");


    var point = new BMap.Point(e.GIS_X, e.GIS_Y);    // 创建点坐标
    moveMap.panTo(point);
    //    var infoWindow = new BMap.InfoWindow(html, post);
    //    moveMap.openInfoWindow(infoWindow, point);

};
//弹出框C3设备报警信息
function getC3ShopAlarmInfo(e, number) {
    type = e[number].CATEGORY_CODE;

    id = e[number].ALARM_ID;
    var point = new BMap.Point(e[number].GIS_X, e[number].GIS_Y);    // 创建点坐标

    map.panTo(point); //平移点

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
    var HTMLURL;
    if (getConfig('For6C') == '6C') {
        HTMLURL = url + id + "";
    }
    else {
        HTMLURL = url + id + "";
    }
    HTMLURL += "&rsurl=no";
    window.open(HTMLURL + '&v=' + version, "_blank");


};


///设备状态
function TRAINSTATUS(status) {
    switch (status) {
        case "1":
            return "刚开机";
            break;
        case "2":
            return "正在运行";
            break;
        case "3":
            return "关机";
            break;
        default:
            return "";
            break;
    }
};
//视频下载
function IRVXZ() {
    var responseData = XmlHttpHelper.transmit(false, "get", "text", "../../C1/PC/MAlarmMonitoring/RemoteHandlers/GetIRVUrlByAlarmID.ashx?alarmid=" + id + "&tmpe=" + Math.random(), null, null);
    if (responseData != null && responseData != "") {
        showImg(responseData);
    }
};
//打开视频直播页面
function playRealtimeVideo() {
    document.getElementById('modal-22256').click();
    document.getElementById('url').src = "../../C3/PC/MLiveStreaming/MonitorLocoPlayNew.htm?IsP=NO&locomotiveCode=" + deviceid + "&v=" + version;
    //    var url = "../Monitor/MonitorLocoPlayMini.htm?locomotiveCode=" + deviceid;
    //    var h = window.screen.height;
    //    var w = window.screen.width;
    //    window.open(url, 'newwindows', 'height=' + h + ', width=' + w + ',top=0,left=0,toolbar=no,scrollbars=yes,menubar=no,resizable=no,status=no,location=no')
};
//设备联动视频直播
function playRealtimeVideoTwo() {
    window.parent.onClickIframeTwo(deviceid);
};
var Distance;
var RepeatJsonList = null;
//获取重复告警
function getRepeatAlarmInfo(map, alarmid, linecode, xb, jb, org_code, org_name, org_type, locomotive_code, startdate, enddate, txtqz, start_km, end_km, gis_x1, gis_y1, gis_x2, gis_y2, zt, afcode, distance, count, type) {
    Distance = distance;
    var jsonResult = getRepeatAlarm(alarmid, linecode, xb, jb, org_code, org_name, org_type, locomotive_code, startdate, enddate, txtqz, start_km, end_km, gis_x1, gis_y1, gis_x2, gis_y2, zt, afcode, distance, count, type); //得到服务端返回的二位json数组  BMapObjData中
}

function getC2AlarmInfoForC2Event(e) {
    var id = this.json.ALARM_ID;
    //取得告警对应的图片路径，刷新父页面的元素
    var url = "../../C2/PC/MAlarmMonitoring/RemoteHandlers/GetMonitorAlarmC2Form.ashx?alarmid=" + id;
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        cache: false,
        success: function (result) {
            var responseData = eval('(' + result + ')');
            if (responseData != undefined) {
                window.parent.document.getElementById('imgFrame').src = "C2EventInside.htm?img100=" + responseData.C2100Img + "&img500=" + responseData.C2500Img + '&v=' + version;
            }
        }
    });
}
//缺陷统计的告警
function getQxTjAlarmInfo(map, linecode, startTime, endTime, SEVERITY) {
    var json = getQxTjAlarm(linecode, startTime, endTime, SEVERITY);
    var jbJson = GetSeverityJson();
    if (json != null && json.length > 0) {
        for (var i = 0; i < json.length; i++) {
            var Point = new BMap.Point(json[i].GIS_X, json[i].GIS_Y);
            var icon = "";
            for (var j = 0; j < jbJson.length; j++) {
                if (json[i].SEVERITY == jbJson[j].code) {
                    if (jbJson[j].name == "一类") {
                        icon = new BMap.Icon("/Common/MGIS/img/ico1.png", new BMap.Size(Ico_alarm_width, Ico_alarm_heigth));
                    }
                    else if (jbJson[j].name == "二类") {
                        icon = new BMap.Icon("/Common/MGIS/img/ico2.png", new BMap.Size(Ico_alarm_width, Ico_alarm_heigth));
                    }
                    else if (jbJson[j].name == "三类") {
                        icon = new BMap.Icon("/Common/MGIS/img/ico3.png", new BMap.Size(Ico_alarm_width, Ico_alarm_heigth));
                    }
                }
            }


            var marker = new BMap.Marker(Point, { icon: icon });
            map.addOverlay(marker);
            marker.disableDragging(true);
            marker.json = json[i];
            marker.setZIndex(5);
            var For6C = getConfig("For6C");
            if (For6C == "2C") {
                marker.addEventListener("click", getC2AlarmInfoForC2Event);
            }
            else {
                marker.addEventListener("click", getC3AlarmInfo1);
            }
        }
    }
    return json;
}

var getC3AlarmSSID;
//弹出框C3设备报警信息
function getC3ShopAlarm(GIS_X, GIS_Y, ID, Type) {
    getC3AlarmSSID = ID;
    if (GIS_X != "" && GIS_X != undefined && GIS_X != null && GIS_X != "null") {
        var point = new BMap.Point(GIS_X, GIS_Y);    // 创建点坐标
        map.panTo(point);
        var icon = new BMap.Icon("/Common/img/figure.png", new BMap.Size(25, 25));
        var marker = new BMap.Marker(point, { icon: icon });  // 创建标注
        map.addOverlay(marker);              // 将标注添加到地图中
        marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
        marker.addEventListener("click", getC3AlarmSS);
    }
};
//3C中弹出框关联具体信息页面
function getC3AlarmSS() {
    var url = "../../C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=";
    var HTMLURL;
    if (getConfig('For6C') == '6C') {
        HTMLURL = url + getC3AlarmSSID + "&";
    }
    else {
        HTMLURL = url + getC3AlarmSSID + "";
    }
    HTMLURL += "&rsurl=no";
    window.open(HTMLURL + '&v=' + version, "_blank");
}
var oldp;
//选择告警
function SetAlarmGIS(alarmID, Type) {

    var re = '';
    var overlays = map.getOverlays();
    //	alert(overlays.length);
    for (var i = 0; i < overlays.length; i++) {

        var m = overlays[i];
        //   re += "<br/>" + m.at;
        //	alert(m.at);
        if (m.type == "Alarm" && m.json.ALARM_ID == alarmID || m.type == "WC" && m.json.ALARM_ID == alarmID) {


            var p = m.getPosition();
            if (Type != 'GIS') {
                map.setCenter(p);
            }

            if (oldp != null) {
                oldp.setAnimation(null);
            }
            m.setAnimation(BMAP_ANIMATION_BOUNCE);
            oldp = m;
            break;
        }
    }
}

//显示隐藏
function showType(_type, _isShow) {
    _type = GetSeverityName(_type);
    var overlays;

    overlays = map.getOverlays();


    //	alert(overlays.length);
    for (var i = 0; i < overlays.length; i++) {

        var m = overlays[i];
        if (m.type == "Alarm" && m.json.SEVERITY == _type || _type == "站点" && m.type == "站点" || _type == "WC" && m.type == "WC") {

            if (_isShow) {
                overlays[i].show();
            }
            else {
                overlays[i].hide();
            }
        }
    }
}