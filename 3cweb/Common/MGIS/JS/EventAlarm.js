var moveMap;
//百度地图加载-第二层
function bMapTwobind(mapLevel) {
    map = new BMap.Map("mapDiv", { mapType: BMAP_HYBRID_MAP }); // 创建Map实例
    moveMap = map;
    mapLevel = getConfig('mapLevel');
    getMislineCenterPoints(Number(mapLevel), map);
    //添加地图控件
    bmapUserTopOneRightInfo = new bmapUserTopOneRightInfo();
    map.addControl(bmapUserTopOneRightInfo);
    map.addControl(new BMap.OverviewMapControl());

    map.setCurrentCity("武汉");   //由于有3D图，需要设置城市哦
    var cr = new BMap.CopyrightControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT });
    map.addControl(cr); //添加版权控件
    cr.addCopyright({ id: 1, content: "<a href='http://www.railwaytec.com'></a>" });
    if (getCookieValue("Small") == "small") {
        map.addControl(new BMap.MapTypeControl({ anchor: BMAP_ANCHOR_TOP_RIGHT }));   //左上角，默认地图控件

        var cr = new BMap.CopyrightControl({ anchor: BMAP_ANCHOR_TOP_LEFT });   //设置
        map.addControl(cr); //添加

        var bs = map.getBounds();   //返回地图可视区域
        cr.addCopyright({ id: 1, content: "  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href='#' class='btn btn-primary' onclick=' MonitorindexJtopo()' style='background: #4A6F9C;color:White;'>拓扑模式</a>", bounds: bs });    //Copyright(id,content,bounds)类作为CopyrightControl.addCopyright()方法的参数

    } else {
        map.addControl(new BMap.MapTypeControl({ anchor: BMAP_ANCHOR_TOP_RIGHT }));   //左上角，默认地图控件
        var cr = new BMap.CopyrightControl({ anchor: BMAP_ANCHOR_TOP_RIGHT });   //设置
        map.addControl(cr); //添加

        var bs = map.getBounds();   //返回地图可视区域
        cr.addCopyright({ id: 1, content: "  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href='#' class='btn btn-primary' onclick=' window.close()' style='background: #4A6F9C;color:White;'>关闭</a>", bounds: bs });    //Copyright(id,content,bounds)类作为CopyrightControl.addCopyright()方法的参数
    }
};
//获取中心点数据并加载Map
function getMislineCenterPoints(maplevel, map) {

    getMislineCenterPointsData(GetQueryString("LineCode"), maplevel, map, "Event");

};
//
function getEventMislineCenterPointsAsync(lineCenterjson, mislineid, maplevel, map) {
    if (lineCenterjson[0].longitudeCenter != "") {
        map.clearOverlays();    //清除地图上所有覆盖物
        var point = new BMap.Point(lineCenterjson[0].longitudeCenter, lineCenterjson[0].latitudeCenter);    // 创建点坐标
        // 初始化地图，设置中心点坐标和地图级别。
        map.centerAndZoom(point, maplevel);
        map.enableScrollWheelZoom();
        map.enableKeyboard();
        map.disableDoubleClickZoom();
        getBmapTwoPoints(GetQueryString("LineCode"), maplevel, map)
        getMisAlarmPoint(map, GetQueryString("LineCode"), GetQueryString("XB"), GetQueryString("ID"));

    }
}
//设备报警点
function getMisAlarmPoint(map, LineCode, XB, ID) {
    getEventMisAlarmPointsData(LineCode, map, XB, ID);
};
//异步加载巡检报警
function getEventMisAlarmPointsDataAsync(json, map) {
    var markers = [];
    maps = map;
    var markerClusterer;
    if (json != undefined) {
        for (var i = 0; i < json.length; i++) {
            if (json[i].CATEGORY_CODE == "6C") {
                if (leNum == "3") { } else {
                    continue;
                }
            }
            var Point = new BMap.Point(json[i].GIS_X, json[i].GIS_Y);
            markers.push(new BMap.Marker(Point));
            //var labelMark = new BMap.Label(json[i].RAISED_TIME, { point: Point });
            //labelMark.setOffset(new BMap.Size(-40, -21));
            var icon = "";
            if (json[i].SEVERITY == "一类") {
                icon = new BMap.Icon("/Common/MGIS/img/ico1.png", new BMap.Size(20, 20));
            }
            else if (json[i].SEVERITY == "二类") {
                icon = new BMap.Icon("/Common/MGIS/img/ico2.png", new BMap.Size(20, 20));
            }
            else if (json[i].SEVERITY == "三类") {
                icon = new BMap.Icon("/Common/MGIS/img/ico3.png", new BMap.Size(20, 20));
            }
            var marker = new BMap.Marker(Point, { icon: icon });
            //marker.setLabel(labelMark);
            map.addOverlay(marker);
            marker.disableDragging(true);
            marker.json = json[i];
            marker.addEventListener("click", getC3AlarmInfo);
        }
        map.addEventListener("rightclick", function (e) { getOneMapmenu(e, map, json); });
    }
}

var qxJson;
function getOneMapmenu(e, map, c3alarm) {
    var html = " <a href='#' onclick='getchObgmoveTo()'>返回首页</a><br><div style='height:230px;overflow-y:auto;overflow-x:hidden;'>";

    var qxType = "5";
    qxJson = c3alarm;
    var c3AlarmHtml = " <fieldset>报警信息<table border='0'  cellpadding='1' cellspacing='1' style='width: 550px'><tr>";
    if (c3alarm != undefined) {
        for (var i = 0; i < c3alarm.length; i++) {
            if (i != 0 && parseInt(i % 5) == 0) {
                c3AlarmHtml += "</tr><tr style='line-height:20px;'>";
            }
            c3AlarmHtml += " <td style='width: 90px'><a href='#' onclick='serchObgmoveTo(" + c3alarm[i].GIS_X + "," + c3alarm[i].GIS_Y + "," + qxType + "," + i + ")' >" + c3alarm[i].POSITION_NAME + c3alarm[i].BRG_TUN_NAME + c3alarm[i].POLE_NUMBER + "</a></td><td style='width: 10px'></td>";
        }
    }
    c3AlarmHtml += "</tr></table></fieldset>";

    html += c3AlarmHtml;

    html += " </div>";
    infoWindow = new BMap.InfoWindow(html);
    map.openInfoWindow(infoWindow, e.point);
}
//获取一条线路中心点数据
function getMislineCenterPointsData(mislineid) {
    var url = "/Common/MGIS/ASHX/Position/BMapLineDataPoints.ashx?mislineid=" + mislineid + "&level=1";
    var json;
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        cache: true,
        success: function (result) {
            json = eval('(' + result + ')');
        }
    });
    return json;
};
//获取C3设备报警缺陷的坐标点
function getEventMisAlarmPointsData(LineCode, map, XB, ID) {
    var url = "/Common/MGIS/ASHX/MisAlarm/QxDataPoint.ashx?type=2&LINE_CODE=" + LineCode + "&XB=" + XB + "&ID=" + ID + "&Category_Code=";
    var json;
    $.ajax({
        type: "POST",
        url: url,
        async: true,
        cache: false,
        success: function (result) {
            if (result != "") {
                json = eval('(' + result + ')');
                getEventMisAlarmPointsDataAsync(json, map);
            }

        }
    });
    return json;
};
//获取地图第二层标注站点--标注并画线
function getBmapTwoPoints(mislineid, maplevel, map) {
    getMislinePointsData(mislineid, maplevel, map); //异步加载区站信息数据
};
//获取标注站点
function getMislinePointsData(mislineid) {
    var url = "/Common/MGIS/ASHX/Position/BMapLineDataPoints.ashx?mislineid=" + mislineid + "&level=2";
    var json;
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        cache: true,
        success: function (result) {
            json = eval('(' + result + ')');
        }
    });
    return json;
};
function serchObgmoveTo(x, y, type, tyepjson) {
    var Point = new BMap.Point(x, y);    // 创建点坐标
    moveMap.closeInfoWindow(infoWindow);
    moveMap.panTo(Point); //平移点
    switch (type) {
        case 1:
            //设备右键
            getC3RightClickSmsInfo(moveMap, moveMap.c3json[tyepjson]);
            break;
            //        case 2:                                                            
            //            break;                                                            
        case 3:
            //变电所右键
            getSubRightClickSubstationInfo(moveMap, bdsjson[tyepjson]);
            break;
        case 4:
            //支柱右键
            serchPolemoveTo(zzjson[tyepjson].kmmark); //平移点 画支柱
            clickRightClickEpmtMenu(moveMap, zzjson[tyepjson]);
            break;
        case 5:
            //缺陷右键
            getC3RightClickAlarmInfo(moveMap, qxJson[tyepjson]);
            break;
        case 6:
            //短信右键
            getC3RightClickSmsOtherInfo(moveMap, GJjson[tyepjson]);
            break;
        default:
            break;
    }
};

function getC3RightClickAlarmInfo(moveMap, e) {

    type = e.CATEGORY_CODE;
    id = e.ALARM_ID;
    switch (type) {
        case "1C":
            url = "/C1/PC/MAlarmMonitoring/MonitorAlarmC1Form.htm?alarmid=";
            break;
        case "2C":
            url = "/C2/PC/Fault/MonitorAlarmC2Form.htm?alarmid=";
            break;

        case "4C":
            url = "/C4/PC/Fault/MonitorAlarmC4Form.htm?alarmid=";
            break;

        default:
            break;
    }
    var HTMLURL;
    if (getConfig('For6C') == 'DPC') {
        HTMLURL = url + id + "";
    }
    else {
        HTMLURL = url + id + "";
    }
    window.open(HTMLURL + '&v=' + version, "_blank");
    var point = new BMap.Point(e.GIS_X, e.GIS_Y);    // 创建点坐标
    moveMap.panTo(point);
};
var type; //类型
var id;  //缺陷、报警ID
function getC3AlarmInfo(e) {
    type = this.json.CATEGORY_CODE;
    id = this.json.ALARM_ID;
    switch (type) {
        case "1C":
            url = "/C1/PC/MAlarmMonitoring/MonitorAlarmC1Form.htm?alarmid=";
            break;
        case "2C":
            url = "/C2/PC/Fault/MonitorAlarmC2Form.htm?alarmid=";
            break;

        case "4C":
            url = "/C4/PC/Fault/MonitorAlarmC4Form.htm?alarmid=";
            break;

        default:
            break;
    }
    var HTMLURL;
    if (getConfig('For6C') == 'DPC') {
        HTMLURL = url + id + "";
    }
    else {
        HTMLURL = url + id;
    }
    window.open(HTMLURL + '&v=' + version, "_blank");

    var point = new BMap.Point(this.json.GIS_X, this.json.GIS_Y);    // 创建点坐标
    maps.panTo(point);


};
function bmapUserTopOneRightInfo() {
    // 设置默认停靠位置和偏移量
    this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
    this.defaultOffset = new BMap.Size(5, 5);

};