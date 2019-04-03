/*========================================================================================*
* 功能说明：C3设备信息
* 注意事项：
* 作    者： Dj
* 版本日期：2013年5月29日
* 修 改 人： Dj
* 修改日期：2013年5月29日
* 变更说明：
* 版 本 号： V1.0
*=======================================================================================*/


//获取C3设备的坐标点
var marker = "";
var C3Locojson; //设备JSON串
//参数说明：mislineid=线路CODE；map地图对象
function getMisC3Point(mislineid, map) {
    getMisC3PointsData(mislineid, map);

};
//异步调用之后在执行加载数据方法
function getMisC3PointAsync(json, mislineid, map) {
    if (C3Locojson == undefined) {
        if (json != undefined) {
            for (var i = 0; i < json.length; i++) {
                var Point = new BMap.Point(json[i].GIS_X, json[i].GIS_Y);

                var lable = json[i].TRAIN_NO;
                if (json[i].CROSSING_NO != "" && json[i].CROSSING_NO != null) {
                    lable += "<br /> " + json[i].CROSSING_NO + "号交路";
                } if (json[i].KM_MARK != "0" && json[i].KM_MARK != "-1") {
                    lable += " K" + parseInt(json[i].KM_MARK / 1000) + "+" + parseInt(json[i].KM_MARK % 1000);
                }

                lable += "<br/>" + json[i].DETECT_TIME;
                var labelMark = new BMap.Label(lable, { point: Point })
                labelMark.setOffset(new BMap.Size(-50, -50));
                // var hasAlarm = ifAlarmingTrain(json[i].TRAIN_NO);
                var icon;
                if (lable.split('CR').length > 1) {
                    icon = new BMap.Icon("/Common/MRTA/img/动车.png", new BMap.Size(30, 37));
                } else {
                    icon = new BMap.Icon("/Common/MRTA/img/机车.png", new BMap.Size(30, 37));

                }
                marker = new BMap.Marker(Point, { icon: icon });
                marker.setLabel(labelMark);
                marker.type = "Loco";
                marker.setZIndex(10);
                map.addOverlay(marker);
                //marker.disableDragging(true);
                marker.jsons = json[i];

                marker.addEventListener("click", getC3SmsInfo);
            }
        }
    } else {

        if (json != undefined) {
            for (var i = 0; i < json.length; i++) {
                var Point = new BMap.Point(json[i].GIS_X, json[i].GIS_Y);
                var labelMark;
                var k = 0;
                var lable = json[i].TRAIN_NO;
                for (var j = 0; j < C3Locojson.length; j++) {
                    if (json[i].TRAIN_NO == C3Locojson[j].TRAIN_NO && json[i].DETECT_TIME == C3Locojson[j].DETECT_TIME) {
                        k = 1;
                    }
                }
                if (k == 0) {

                    if (json[i].CROSSING_NO != "" && json[i].CROSSING_NO != null) {
                        lable += "<br /> " + json[i].CROSSING_NO + "号交路";
                    } if (json[i].KM_MARK != "0") {
                        lable += " K" + parseInt(json[i].KM_MARK / 1000) + "+" + parseInt(json[i].KM_MARK % 1000);
                    }

                    lable += "<br/>" + json[i].DETECT_TIME;
                    labelMark = new BMap.Label(lable, { point: Point });
                    labelMark.setOffset(new BMap.Size(-50, -50));
                } else {

                    labelMark = new BMap.Label(json[i].TRAIN_NO, { point: Point });
                    labelMark.setOffset(new BMap.Size(-20, -20));
                }

                // var hasAlarm = ifAlarmingTrain(json[i].TRAIN_NO);
                var icon;
                if (lable.split('CR').length > 1) {
                    icon = new BMap.Icon("/Common/MRTA/img/动车.png", new BMap.Size(30, 37));
                } else {
                    icon = new BMap.Icon("/Common/MRTA/img/机车.png", new BMap.Size(30, 37));

                }

                marker = new BMap.Marker(Point, { icon: icon });
                marker.setLabel(labelMark);
                marker.setZIndex(10);
                marker.type = "Loco";
                map.addOverlay(marker);
                //marker.disableDragging(true);
                marker.jsons = json[i];

                marker.addEventListener("click", getC3SmsInfo);
            }
        }
    }

    C3Locojson = json; //用于判断刷新机车是用
    map.c3json = json;
}

//C3设备短信信息

var deviceid; //车哈
var _DETECT_TIME; //车时间 用于做轨迹用
var _CROSSING_NO; //交路号 用于做轨迹用
function getC3SmsInfo(e) {
    AgainRefsetInterval(); //重启定时器
    deviceid = this.jsons.TRAIN_NO;
    _DETECT_TIME = this.jsons.DETECT_TIME;
    _CROSSING_NO = this.jsons.CROSSING_NO
    var deviceVersion = getDeviceVersion(deviceid);
    var html = "<div style='width:600px;'><table width='95%'><tr><th style='width:100%'>" + this.jsons.TRAIN_NO + "<input class='btn btn-primary'  value='查看检测轨迹' style='width:100px'  type='button' onclick='getC3SmsInfo11();RefC3ProcessInfo();'/>  <input class='btn btn-primary'  value='查看设备报警缺陷'  type='button' style='width:120px' onclick='getC3Alarm()'/>"
    if (deviceVersion != "PS3") {
        if (getCookieValue("GISSmall") != "small") {

            html += " <input class='btn btn-primary'  value='观看设备视频直播'  type='button' style='width:120px' onclick='playRealtimeVideo();'/>";
        } else {
            html += " <input class='btn btn-primary'  value='观看设备视频直播'  type='button' style='width:120px' onclick='playRealtimeVideoTwo();'/>";
        }
    }
    html += "</th></tr>";
    html += "<tr><td style='width:100%'>"
    html += "<table class='table table-bordered table-condensed' width='100%' cellspacing='1'  cellpadding='1'>"
    html += "<tr><th style='width:25%'>当前位置：</th><td style='width:75%' colspan='3'>";
    html += this.jsons.WZ;
 //   html += " (卫星数：" + this.jsons.SATELLITE_NUM + ")";
    html += "</td></tr>"
    html += "<tr><th style='width: 25%'>时间：</th><td style='width: 75%' colspan='3'>" + this.jsons.DETECT_TIME + "</td></tr>"

    html += "<tr><th>最高温度(℃)：</th><td >" + this.jsons.IRV_TEMP + "</td><th >环境温度(℃)：</th><td >" + this.jsons.SENSOR_TEMP + "</td></tr>"
    html += "<tr><th>导高值(mm)：</th><td>" + this.jsons.LINE_HEIGHT.toString() + "</td><th>拉出值(mm)：</th><td>" + this.jsons.PULLING_VALUE.toString() + "</td></tr>"
    html += "<tr><th>弓状态：</th><td>" + (this.jsons.BOW_UPDOWN_STATUS) + "</td><th>速度(km/h)：</th><td>" + this.jsons.SPEED + "</td></tr>"
    html += "<tr><th>东经：</th><td>" + this.jsons.GIS_X_O + "</td><th>北纬：</th> <td>" + this.jsons.GIS_Y_O + "</td></tr></table>"
    html += "</td></tr></table></div>";
    var infoWindow = new BMap.InfoWindow(html);
    this.openInfoWindow(infoWindow);
};

//右键选中
function getC3RightClickSmsInfo(map, e) {
    AgainRefsetInterval(); //重启定时器
    deviceid = e.TRAIN_NO;
    _CROSSING_NO = e.CROSSING_NO
    _DETECT_TIME = e.DETECT_TIME;
    var deviceVersion = getDeviceVersion(deviceid);

    var html = "<div style='width:600px;'><table width='95%'><tr><th style='width:100%'>" + e.TRAIN_NO + "<input class='btn btn-primary'  value='查看检测轨迹' style='width:100px'  type='button' onclick='getC3SmsInfo11();RefC3ProcessInfo();'/>  <input class='btn btn-primary'  value='查看设备报警缺陷'  type='button' style='width:120px' onclick='getC3Alarm()'/>"
    // html += "<tr> <td><img id='img5' src='../images/C3/1_102_vi.png' onmousemove='getImage()' width='300px' height='200px' /></td><td><img id='img6' src='../images/C3/1_102_vi2.png' onmousemove='getImage()' width='300px' height='200px' /> </td></tr>"
    //html += "<tr><td > 时间  <input id='startdate' type='text' runat='server' class='date' style='width: 90px;'></td><td><input class='btn'  value='获取红外视频'  type='button' onclick='getC3RedSP()'/></td></tr>";
    if (deviceVersion != "PS3") {
        if (getCookieValue("GISSmall") != "small") {

            html += " <input class='btn btn-primary'  value='观看设备视频直播'  type='button' style='width:120px' onclick='playRealtimeVideo();'/>";
        } else {
            html += " <input class='btn btn-primary'  value='观看设备视频直播'  type='button' style='width:120px' onclick='playRealtimeVideoTwo();'/>";
        }
    }
    html += "</th></tr>";
    html += "<tr><td style='width:100%'>"
    html += "<table class='table table-bordered table-condensed' width='100%' cellspacing='1'  cellpadding='1'>"
    html += "<tr><th style='width:25%'>当前位置：</th><td style='width:75%' colspan='3'>";
    html += e.WZ;
  //  html += " (卫星数：" + e.SATELLITE_NUM + ")";
    html += "</td></tr>"
    html += "<tr><th style='width: 25%'>时间：</th><td style='width: 75%' colspan='3'>" + e.DETECT_TIME + "</td></tr>"

    html += "<tr><th  >最高温度(℃)：</th><td  >" + e.IRV_TEMP + "</td><th  >环境温度(℃)：</th><td  >" + e.SENSOR_TEMP + "</td></tr>"
    html += "<tr><th>导高值(mm)：</th><td>" + e.LINE_HEIGHT + "</td><th>拉出值(mm)：</th><td>" + e.PULLING_VALUE + "</td></tr>"
    html += "<tr><th>弓状态：</th><td>" + (e.BOW_UPDOWN_STATUS) + "</td><th>速度(km/h)：</th><td>" + e.SPEED + "</td></tr>"
    html += "<tr><th>东经：</th><td>" + e.GIS_X_O + "</td><th>北纬：</th> <td>" + e.GIS_Y_O + "</td></tr></table>"
    html += "</td></tr></table></div>";
    var infoWindow = new BMap.InfoWindow(html);
    var point = new BMap.Point(e.GIS_X_O, e.GIS_Y_O);
    map.openInfoWindow(infoWindow, point);
};
//查询基础版本
function getDeviceVersion(trainNo) {
    var json = getMisC3DeviceVersion(trainNo);
    return json[0].deviceVersion;
};

function getC3SmsInfo11() {
    var date1 = parseDate(_DETECT_TIME);
    var date1_add = AddHours(date1, -3);
    var startdate = date1_add.format("yyyy/MM/dd hh:mm:ss");
    window.open("/Common/MGIS/OrbitGIS.htm?deviceid=" + deviceid + "&startdate=" + startdate + "&enddate=" + _DETECT_TIME + "&jl=" + _CROSSING_NO + "&LINE_CODE=&DIRECTION=&Category_Code=3C" + "&v=" + version);
}

function getC3Alarm() {
    var url = "/C3/PC/MAlarmMonitoring/MonitorLocoAlarmList.htm?deviceid=" + deviceid + "&v=" + version;

    if (getCookieValue("GISSmall") == "small") {
        window.parent.ShowMTwin(url, "90", "90");
    }
    else {
        var h = window.screen.height;
        var w = window.screen.width;
        window.open(url, '_blank')

    }

};


//显示加载
function block() {
    document.getElementById("loading").style.display = "block";
};
//单击了机车轨迹 用于做刷新
function RefC3ProcessInfo() {
    document.cookie = "C3Sms=1";
};