/*========================================================================================*
* 功能说明：百度api封装
* 作    者： DJ
* 版本日期：2016.1.4

*=======================================================================================*/
var map;
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
var jbJson;//级别JSON


var _deviceid;
var _DETECT_TIME;
var _CROSSING_NO;
var oldp;
var smsNumber;
var DIRECTION;
var setSmsshow;
var _XHNumber = 1;//循环次数
var color = "#00EE00";// "#D8BFD8";
var infoWindow; //展示的HTML
var LocaType; //展示的HTML

///初始化地图   
///参数：id-DIV的ID，mapLevel-地图初始显示层次
function BindMap(id, mapLevel) {
    var type = getConfig('mapType');
    if (type == "1") //卫星
        map = new BMap.Map(id, { mapType: BMAP_HYBRID_MAP }); // 创建Map实例
    else //地图
        map = new BMap.Map(id, { mapType: BMAP_NORMAL_MAP }); // 创建Map实例

    map.clearOverlays();    //清除地图上所有覆盖物
    var CenterLon = getCookieValue("CenterLon");
    if (CenterLon == "null" || CenterLon == "") {
        CenterLon = getConfig('CenterLon');
    }
    var CenterLat = getCookieValue("CenterLat");
    if (CenterLat == "null" || CenterLat == "") {
        CenterLat = getConfig('CenterLat');
    }
    var point = new BMap.Point(CenterLon, CenterLat);    // 创建点坐标
    map.centerAndZoom(point, mapLevel); // 初始化地图，设置中心点坐标和地图级别。
    map.enableScrollWheelZoom();
    map.enableKeyboard();
    map.disableDoubleClickZoom();
    map.addControl(new BMap.OverviewMapControl());
    var cr = new BMap.CopyrightControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT });
    map.addControl(cr); //添加版权控件
    cr.addCopyright({ id: 1, content: "<a href='http://www.railwaytec.com'></a>" });
  //  map.addControl(new BMap.MapTypeControl({ anchor: BMAP_ANCHOR_TOP_RIGHT, offset: new BMap.Size(120, 15), }));   //左上角，默认地图控件
};

///初始化加载线路信息  
///参数：org-组织机构CODE，orgtype-组织机构类型，lineCode-线路CODE  此方法为提供右键中线路信息用
function GetLine(org, orgtype, lineCode) {
    var lineJson = getMislineData(org, orgtype, lineCode);
    map.lineJson = lineJson;
};

///初始化加载站点信息 
///参数：org-组织机构CODE，orgtype-组织机构类型，lineCode-线路CODE  此方法为提供站点显示及右键中站点信息用
function GetPosition(org, orgtype, lineCode, visible) {
    var positionJson = getMisPositionData(org, orgtype, lineCode);
    if (positionJson != undefined) {
        for (var i = 0; i < positionJson.length; i++) {
            var Point = new BMap.Point(positionJson[i].startLongitude, positionJson[i].startLatitude);
            if (positionJson[i].GIS_SHOW == '1') {
                var labelMark = new BMap.Label(positionJson[i].StationSectionName, { point: Point });
                labelMark.setStyle({
                    color: "white",
                    fontSize: "12px",
                    backgroundColor: "rgba(15,15,17,0)",
                    border: "0",
                    fontWeight: "bold"
                });
                labelMark.setOffset(new BMap.Size(-17, -17));
                var icon = new BMap.Icon("/Common/MRTA/img/station.png", new BMap.Size(20, 30));
                var marker = new BMap.Marker(Point, { icon: icon });
                marker.setLabel(labelMark);
                marker.setZIndex(1);
                marker.type = "站点";
                if (visible) {
                    marker.show();
                } else {
                    marker.hide();
                }
                map.addOverlay(marker);
            }
        }
    }
    map.positionJson = 0;
};

function GetSubstation() {

};

function GetPole() {

};

///初始化加载最新车信息 
///参数：org-组织机构CODE，orgtype-组织机构类型，lineCode-线路CODE，key-搜索车号  此方法为提供最新车显示及右键中最新车信息用
function GetSms(org, OrgType, locatype, lineCode, key, type) {
    LocaType = type;
    var SmsJson = getMisC3SmsData(org, OrgType, locatype, lineCode, key);

    if (SmsJson != undefined) {
        for (var i = 0; i < SmsJson.length; i++) {
            var Point = new BMap.Point(SmsJson[i].GIS_X, SmsJson[i].GIS_Y);

            var lable = SmsJson[i].TRAIN_NO;
            if (SmsJson[i].WZ != "")
                lable += "<br/>" + SmsJson[i].WZ;
            var labelMark = new BMap.Label(lable, { point: Point })
            labelMark.setStyle({
                color: "#FFFFFF",
                fontSize: "12px",
                backgroundColor: "rgba(15,15,17,0.5)",
                border: "0",
                padding: "3px",
                fontWeight: "bold"
            });
            labelMark.setOffset(new BMap.Size(-35, -36));
            // labelMark.setOffset(new BMap.Size(-30, -35));

            var icon;
            if (lable.split('CR').length > 1) {
                icon = new BMap.Icon("/Common/MRTA/img/动车.png", new BMap.Size(25, 30));
            } else {
                icon = new BMap.Icon("/Common/MRTA/img/机车.png", new BMap.Size(25, 30));

            }
            marker = new BMap.Marker(Point, { icon: icon });
            marker.setLabel(labelMark);
            map.addOverlay(marker);
            //marker.disableDragging(true);
            marker.SmsJsons = SmsJson[i];
            marker.type = "Loco";
            marker.addEventListener("click", getC3SmsClick);
            //  marker.addEventListener("dblclick", getC3SmsInfo1);
            marker.setZIndex(5);
        }
    }
    map.SmsJson = SmsJson;

};

///初始化地图加载告警信息
///参数：deviceid-车号，(startTime/endTime)-开始时间和结束时间这个是用于缺陷GIS的;实时GIS和实时监控传空值，org-组织机构CODE，orgtype-组织机构类型，lineCode-线路CODE
///      status-状态（实时GIS传入AFSTATUS01;其他的传入空值），IscheckType1-一类是否显示，IscheckType2-二类是否显示，IscheckType3-三类是否显示
///      Ischeck_new-新上报是否显示， Ischeck_sure-已确认是否显示， Ischeck_plan-已计划是否显示， Ischeck_check-检修中是否显示， Ischeck_close-已关闭是否显示
function GetAlarm(deviceid, startTime, endTime, line, direction, org, OrgType, locatype, status, IscheckType1, IscheckType2, IscheckType3, Ischeck_new, Ischeck_sure, Ischeck_plan, Ischeck_check, Ischeck_close) {
    jbJson = GetSeverityJson();
    One_number = 0;
    Two_number = 0;
    Three_number = 0;

    new_number = 0;
    sure_number = 0;
    plan_number = 0;
    check_number = 0;
    close_number = 0;

    wc_number = 0;
    var markers = [];
    var alarmJson = getMisC3AlarmData(deviceid, startTime, endTime, line, direction, org, OrgType, locatype, status);
    if (alarmJson != undefined && alarmJson.length > 0) {
        document.cookie = "C3Alarm=" + alarmJson[0].RAISED_TIME;
        for (var i = 0; i < alarmJson.length; i++) {

            var m = alarmJson[i];
            displayStr = "";
            //            if (m.CODE_NAME != "新上报" && !IScheckWC || m.SEVERITY == "一类" && !IscheckType1 || m.SEVERITY == "二类" && !IscheckType2 || m.SEVERITY == "三类" && !IscheckType3) {
            //                displayStr = "hide";
            //            }
            for (var j = 0; j < jbJson.length; j++) {
                if (m.SEVERITY == jbJson[j].name) {
                    if (!IscheckType1 && jbJson[j].code == "一类") {
                        displayStr = "hide";
                    }

                    if (!IscheckType2 && jbJson[j].code == "二类") {
                        displayStr = "hide";
                    }

                    if (!IscheckType3 && jbJson[j].code == "三类") {
                        displayStr = "hide";
                    }
                }
            }


            if (!Ischeck_new && m.STATUS == "AFSTATUS01") {
                displayStr = "hide";
            }

            if (!Ischeck_sure && m.STATUS == "AFSTATUS03") {
                displayStr = "hide";
            }

            if (!Ischeck_plan && m.STATUS == "AFSTATUS04") {
                displayStr = "hide";
            }

            if (!Ischeck_check && m.STATUS == "AFSTATUS07") {
                displayStr = "hide";
            }

            if (!Ischeck_close && m.STATUS == "AFSTATUS05") {
                displayStr = "hide";
            }


            //ico生成。
            var icoUrl = '/Common/MGIS/img/StatusLevel.png';
            switch (m.STATUS) {
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

            if (status != "") {
                icoUrl = '/Common/MGIS/img/icoLevel.png';
            }
            for (var j = 0; j < jbJson.length; j++) {
                if (m.SEVERITY == jbJson[j].code) {
                    switch (jbJson[j].code) {
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
                }
            }


            if (alarmJson[i].GIS_X != "0") {


                var Point = new BMap.Point(alarmJson[i].GIS_X, alarmJson[i].GIS_Y);
                markers.push(new BMap.Marker(Point));
                var icon = "";

                icon = new BMap.Icon(icoUrl, new BMap.Size(Ico_alarm_width, Ico_alarm_heigth));

                var marker = new BMap.Marker(Point, { icon: icon });
                //marker.setLabel(labelMark);
                map.addOverlay(marker);
                marker.disableDragging(true);
                marker.alarmJson = alarmJson[i];
                marker.type = "Alarm";
                marker.id = alarmJson[i].ID;
                marker.addEventListener("click", getC3AlarmClick);
                // marker.addEventListener("dblclick", getC3AlarmInfo2);
                if (displayStr != "") {
                    marker.hide();
                } else {
                    marker.show();
                }

                marker.setOffset(new BMap.Size(Ico_alarm_left, Ico_alarm_top));
                marker.setZIndex(10);

            }
            else {

            }
        }
        if (startTime != "" && status != "") {
            markerClusterer = new BMapLib.MarkerClusterer(map, { markers: markers });
        }


    }
    if (startTime != "" && startTime != null && status != "") {
        map.markerClusterer = markerClusterer;
        map.markers = markers;
    }
    map.json = alarmJson;
};

///轨迹加载
function getSmsInfo(type, deviceid, startdate, enddate, txtqz, direction, startSpeed, endSpeed, txtLine) {
    var C3SmsInfoJson = getC3ProcessInfoPointsData(deviceid, startdate, enddate, txtqz, direction, startSpeed, endSpeed, txtLine);
    if (C3SmsInfoJson != undefined) {
        if (C3SmsInfoJson == null || C3SmsInfoJson.length == 0 || C3SmsInfoJson[0][1].JCINFO.length == 0) {
            ymPrompt.errorInfo(deviceid + '； 当前车没有运行数据，请稍后再试。', null, null, '提示信息', null);
            return;
        }
        if (C3SmsInfoJson[0][0].GIS_X != "" && C3SmsInfoJson[0][0].GIS_X != "0") {
            var point = new BMap.Point(C3SmsInfoJson[0][1].JCINFO[0].GIS_X, C3SmsInfoJson[0][1].JCINFO[0].GIS_Y);    // 创建点坐标
            map.panTo(point);
            //添加右键事件
            map.addEventListener("rightclick", function (e) {
                getC3Mapmenu(e, map, C3SmsInfoJson[0][1].JCINFO);
            });

            GetAlarm(deviceid, startdate, enddate, txtLine, direction, "", "", "", "", true, true, true, true, true, true, true, true);
            var overlays = map.getOverlays();
            for (var i = 0; i < overlays.length; i++) {

                var m = overlays[i];
                if (m.type == "Alarm") {
                    m.hide();
                }


            }
            var Point = new BMap.Point(C3SmsInfoJson[0][1].JCINFO[0].GIS_X, C3SmsInfoJson[0][1].JCINFO[0].GIS_Y);
            var lable = C3SmsInfoJson[0][1].JCINFO[0].TRAIN_NO;//+ "当前位置"
            var icon = "";
            if (lable.split('CR').length > 1) {
                icon = new BMap.Icon("/Common/MRTA/img/动车.png", new BMap.Size(30, 37));
            } else {
                icon = new BMap.Icon("/Common/MRTA/img/机车.png", new BMap.Size(30, 37));

            }
            var labelMark;

            lable += "<br /> " + C3SmsInfoJson[0][1].JCINFO[0].WZ;
            lable += "<br/>" + C3SmsInfoJson[0][1].JCINFO[0].DETECT_TIME;
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
            marker.SmsJsons = C3SmsInfoJson[0][1].JCINFO[0];
            marker.setZIndex(10);
            smsNumber = 0;
            marker.type = "C3Sms";
            marker.number = smsNumber;
            map.addOverlay(marker);
            DIRECTION = C3SmsInfoJson[0][1].JCINFO[0].DIRECTION;
            marker.addEventListener("click", getC3SmsClick);
            setSmsshow = setInterval('SetC3Sms("正常")', 200);
        }
    }
    map.C3SmsInfoJson = C3SmsInfoJson[0][1].JCINFO;
};

/// 动态加载地图轨迹 2毫秒加载一次
function SetC3Sms(DataType) {
    var C3SmsJson = map.C3SmsInfoJson;
    if (smsNumber < map.C3SmsInfoJson.length - 1) {
        var overlays = map.getOverlays();
        var p = new BMap.Point(C3SmsJson[smsNumber].GIS_X, C3SmsJson[smsNumber].GIS_Y);

        for (var i = 0; i < overlays.length; i++) {

            var m = overlays[i];
            if (m.type == "C3Sms" && m.number == smsNumber) {
                var Icon = new BMap.Icon("/Common/MGIS/img/1.png", new BMap.Size(40, 27));
                m.setIcon(Icon);
                m.getLabel().hide();
            }

        }
        var Points = new Array(2);
        Points[0] = p;
        smsNumber++;

        var startetime = C3SmsJson[smsNumber - 1].DETECT_TIME;
        var endtime = C3SmsJson[smsNumber].DETECT_TIME;

        var Point = new BMap.Point(C3SmsJson[smsNumber].GIS_X, C3SmsJson[smsNumber].GIS_Y);
        Points[1] = Point;
        if (endtime >= startetime) {

        } else {

        }
        var bs = map.getBounds();   //获取可视区域
        var bssw = bs.getSouthWest();   //可视区域左下角
        var bsne = bs.getNorthEast();   //可视区域右上角
        if (bssw.lng > parseFloat(C3SmsJson[smsNumber].GIS_X)) {
            map.panTo(Point);
        } else if (bsne.lng < parseFloat(C3SmsJson[smsNumber].GIS_X)) {
            map.panTo(Point);
        } else if (bssw.lat > parseFloat(C3SmsJson[smsNumber].GIS_Y)) {
            map.panTo(Point);
        } else if (bsne.lat < parseFloat(C3SmsJson[smsNumber].GIS_Y)) {
            map.panTo(Point);
        }

        var lable = C3SmsJson[smsNumber].TRAIN_NO;//+ "当前位置"
        var icon = "";
        if (lable.split('CR').length > 1) {
            icon = new BMap.Icon("/Common/MRTA/img/动车.png", new BMap.Size(30, 37));
        } else {
            icon = new BMap.Icon("/Common/MRTA/img/机车.png", new BMap.Size(30, 37));

        }
        var labelMark;
        lable += "<br /> " + C3SmsJson[smsNumber].WZ;
        lable += "<br/>" + C3SmsJson[smsNumber].DETECT_TIME;
        labelMark = new BMap.Label(lable, { point: Point });
        labelMark.setOffset(new BMap.Size(-40, -40));
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
        marker.SmsJsons = C3SmsJson[smsNumber];
        marker.setZIndex(4);
        marker.type = "C3Sms";
        marker.number = smsNumber;
        map.addOverlay(marker);
        marker.addEventListener("click", getC3SmsClick);
        var redline = "";

        if (DIRECTION != C3SmsJson[smsNumber].DIRECTION) {
            DIRECTION = C3SmsJson[smsNumber].DIRECTION;
            if (_XHNumber == styleColor.length) {
                _XHNumber = 0;
            }
            color = styleColor[_XHNumber].Color;// '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6);
            _XHNumber++;

        }
        if (GetDateC(C3SmsJson[smsNumber - 1].DETECT_TIME, C3SmsJson[smsNumber].DETECT_TIME) > 1) {
            if (_XHNumber == styleColor.length) {
                _XHNumber = 0;
            }
            color = styleColor[_XHNumber].Color;// '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6);
            _XHNumber++;
        }

        redline = new BMap.Polyline(Points, { strokeColor: color, strokeWeight: 5, strokeOpacity: 1, strokeStyle: "solid" });
        //  redline.setStrokeStyle("dashed");
        redline.type = "C3Sms";
        if (GetDateC(C3SmsJson[smsNumber - 1].DETECT_TIME, C3SmsJson[smsNumber].DETECT_TIME) > 1 || C3SmsJson[smsNumber - 1].IsAbnormal == "异常点" || C3SmsJson[smsNumber].IsAbnormal == "异常点") {
            // color = '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6);
            if (DataType == "全部") {
                map.addOverlay(redline);
            }
        } else {
            map.addOverlay(redline);
        }

        for (var i = 0; i < overlays.length; i++) {

            var m = overlays[i];
            if (m.type == "Alarm") {
                var alarmTime = m.alarmJson.RAISED_TIME;

                var beginTimes = Date.parse(startetime);
                var endTimes = Date.parse(endtime);
                var alarmTimes = Date.parse(alarmTime);
                if (beginTimes <= alarmTimes && alarmTimes <= endTimes) {
                    m.show();
                }
            }

        }
    } else {
        clearInterval(setSmsshow);
    }
}



/// 单击车时弹出信息框
function getC3SmsClick(e) {
    getC3SmsInfo(this.SmsJsons, this.type);
};
/// 车信息框具体内容
function getC3SmsInfo(jsons, type) {
    _deviceid = jsons.TRAIN_NO;
    _DETECT_TIME = jsons.DETECT_TIME;
    _CROSSING_NO = jsons.CROSSING_NO;
    var html = "<div style='width:620px;'><table width='620px'><tr><th valign='middle' style='line-height:300%;padding-bottom:2px'>" + jsons.TRAIN_NO + "";
    if (type != "C3Sms") {
        html += "<div style='right:15px; float:right;text-align:center;'><input class='btn btn-primary'  value='查看检测轨迹' style='width:100px'  type='button' onclick='getC3SmsTrajectory();'/> ";
        if (LocaType != "Loca")
            html += " <input class='btn btn-primary'  value='车顶实时监测'  type='button' style='width:120px' onclick='playRealtimeVideo();'/>";
    }
    html += "<div></th></tr>";
    html += "<tr><td style='width:100%'>";
    html += "<table class='table table-bordered table-condensed' width='100%' cellspacing='1'  cellpadding='1'>"
    html += "<tr><td style='width:15%'><strong>当前位置：</strong></td><td style='width:75%' colspan='3'>";
    html += jsons.WZ;
    html += "</td></tr>";
    html += "<tr><th style='width:15%'>时间：</th><td style='width:75%' colspan='3'>" + jsons.DETECT_TIME + "</td></tr>";
    html += "<tr><th >最高温度(℃)：</th><td >" + (jsons.IRV_TEMP != "" ? jsons.IRV_TEMP + "" : "") + "</td><th style='width:15%'>环境温度(℃)：</th><td >" + (jsons.SENSOR_TEMP != "" ? jsons.SENSOR_TEMP + "" : "") + "</td></tr>";
    html += "<tr><th>导高值(mm)：</th><td>" + (jsons.LINE_HEIGHT != "" ? jsons.LINE_HEIGHT + "" : "") + "</td><th>拉出值(mm)：</th><td>" + (jsons.PULLING_VALUE != "" ? jsons.PULLING_VALUE + "" : "") + "</td></tr>";
    html += "<tr><th>弓状态：</th><td>" + (jsons.BOW_UPDOWN_STATUS) + "</td><th>速度(km/h)：</th><td>" + (jsons.SPEED != "" ? jsons.SPEED + "" : "") + "</td></tr>";
    html += "<tr><th>东经：</th><td>" + jsons.GIS_X_O + "</td><th>北纬：</th> <td>" + jsons.GIS_Y_O + "</td></tr></table>";
    html += "</td></tr></table></div>";
    var infoWindow = new BMap.InfoWindow(html);
    var point = new BMap.Point(jsons.GIS_X, jsons.GIS_Y);
    map.openInfoWindow(infoWindow, point);
    map.panTo(point);
};

///单击告警调用方法   公用时 getC3AlarmInfo自己写
function getC3AlarmClick(e) {
    getC3AlarmInfo(this.alarmJson);
};


//站点筛选
function showStation(_isShow) {


    var overlays = map.getOverlays();
    //	alert(overlays.length);
    for (var i = 0; i < overlays.length; i++) {

        var m = overlays[i];
        if (m.type == "站点") {

            if (_isShow) {
                overlays[i].show();
            }
            else {
                overlays[i].hide();

            }

        }
    }

};


//关闭报警
function ColseC3AlarmInfo() {
    var overlays = map.getOverlays();
    for (var i = 0; i < overlays.length; i++) {
        var m = overlays[i];

        if (oldp != null) {
            oldp.setAnimation(null);
        }
    }
    $("#C3Alarm").css("display", "none");
    // id = "";
};

//打开报警
function OpenC3AlarmAnimation() {
    var overlays = map.getOverlays();
    for (var i = 0; i < overlays.length; i++) {
        var m = overlays[i];

        if (m.type == "Alarm") {
            if (m.json.ALARM_ID == id) {
                m.setAnimation(BMAP_ANIMATION_BOUNCE);
                oldp = m;
            }
        }
    }
};

//弹出缺陷详情页面
function GetC3AlarmFrom(id) {
    var url = "/C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=" + id + "&rsurl=no&v=" + version;
    window.open(url, "_blank");
};

///弹出机车轨迹
function getC3SmsTrajectory() {
    var date1 = parseDate(_DETECT_TIME);
    var date1_add = AddHours(date1, -3);
    var startdate = date1_add.format("yyyy/MM/dd hh:mm:ss");
    window.open("/Common/MGIS/OrbitGIS.htm?deviceid=" + _deviceid + "&startdate=" + startdate + "&enddate=" + _DETECT_TIME + "&jl=" + _CROSSING_NO + "&LINE_CODE=&DIRECTION=&Category_Code=3C&v=" + version);
};



function MapClearOverlays() {
    map.clearOverlays();    //清除地图上所有覆盖物
};

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
    var _org = $("#OrgCode", window.parent.document).html().trim();
    var _line = $("#LineCode", window.parent.document).html().trim();
    var _locatype = $("#LocoCode", window.parent.document).html().trim();
    var _OrgType = $("#OrgType", window.parent.document).html().trim();

    var _deviceID = $("body", parent.document).find("#iframe_loca").contents()[0].defaultView.GetLocaTxt();
    if (_org == undefined) {
        _org = "";
    }
    if (_line == undefined) {
        _line = "";
    } if (_locatype == undefined) {
        _locatype = "";
    } if (_OrgType == undefined) {
        _OrgType = "";
    } if (_deviceID == undefined) {
        _deviceID = "";
    }

    var _url = "/Common/MGIS/ASHX/Cue/Cue.ashx?Time=" + alarmtime + "&Category_Code=" + GetQueryString("Category_Code") + '&_org=' + escape(_org) + '&_line=' + escape(_line) + '&_locatype=' + escape(_locatype) + '&_OrgType=' + escape(_OrgType) + '&_deviceID=' + escape(_deviceID) + '&type=Alarm&temp=' + Math.random();
    // responseData = XmlHttpHelper.transmit(false, "get", "text", _url, null, null);

    $.ajax({
        type: "GET",
        url: _url,
        async: false,
        cache: false,
        success: function (responseData) {
            var responseDatalist = responseData.split('!@#');
            if (responseDatalist[0] > 0) {
                refushAlarm();
                play_click(this, '/Common/MGIS/mp3/140_SCREAM.mp3');
                document.getElementById("winpop").style.display = "block";
                document.getElementById("AlarmSpan").innerHTML = responseDatalist[1];
                setTimeout("playhid_pop()", second); //30秒后自动关闭
                i++;
                xmlHttp = null;
            }
            xmlHttp = null;
            responseData = null;
        }
    });
};

//刷新设备和信息框提示方法
var setshow; //信息框定时器
var setloco; //设备刷新定时器
function RefsetInterval(type) {
    var showtime = 5000; //信息框提示时间
    var locotime = 120000; //设备刷新时间
    setshow = setInterval('show_pop()', showtime);
    if (type != "small")
        setloco = setInterval('refushLocos()', locotime);
};
//关闭定时器重新启用定时器
function AgainRefsetInterval() {
    clearInterval(setshow); //关闭信息框定时器
    clearInterval(setloco); //关闭刷新设备定时器
    var showtime = 5000; //信息框提示时间
    var locotime = 120000; //设备刷新时间
    setshow = setInterval('show_pop()', showtime);
    setloco = setInterval('refushLocos()', locotime);
};




function hid_pop() {//隐藏窗口
    var div = document.getElementById('div1');
    div.innerHTML = "";
    document.getElementById("winpop").style.display = "none";
};
function playhid_pop() {//
    var div = document.getElementById('div1');
    div.innerHTML = "";
};

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
};


function GetDateC(date1, date2) {
    var date3 = new Date(date2).getTime() - new Date(date1).getTime()  //时间差的毫秒数
    var leave1 = date3 % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000))
    return hours;
};


function MapAddRigthClick() {
    map.addEventListener("rightclick", function (e) { RigthClick(e); });
};


function RigthClick(e) {
    var c3html = " <fieldset>设备信息<table  border='0' cellpadding='1' cellspacing='1' style='width: 550px'><tr>";
    if (map.SmsJson != undefined) {
        for (var i = 0; i < map.SmsJson.length; i++) {
            if (i != 0 && parseInt(i % 5) == 0) {
                c3html += "</tr><tr>";
            }
            c3html += " <td style='width: 100px'><a href='#' onclick='serchObgmoveTo(" + i + "," + "\"Loco\"" + ")'>" + map.SmsJson[i].TRAIN_NO + "</a></td><td style='width: 10px'></td>";
        }
    }
    c3html += "</tr></table></fieldset>";
    infoWindow = new BMap.InfoWindow(c3html);
    map.openInfoWindow(infoWindow, e.point);
};

function serchObgmoveTo(i, type) {
    if (type == "Loco") {
        getC3SmsInfo(map.SmsJson[i], "");
    }
};

//打开视频直播页面
function playRealtimeVideo() {
    try {
        window.parent.ShowPlay1(_deviceid);
    }
    catch (e) {
        document.getElementById('modal-22256').click();
        document.getElementById('url').src = "/C3/PC/MLiveStreaming/MonitorLocoPlayNew.htm?IsP=NO&locomotiveCode=" + _deviceid + '&v=' + version;
    }
};
//设备联动视频直播
function playRealtimeVideoTwo() {
    try {
        window.parent.ShowPlay2(_deviceid);
    }
    catch (e) {
        window.parent.onClickIframeTwo(_deviceid);
    }
};