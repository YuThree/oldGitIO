
/*========================================================================================*
* 功能说明：GIS支柱业务数据方法类，与BMapJS的方法类做接口
* 注意事项：
* 作    者： wcg
* 版本日期：2013年5月10日
* 修 改 人： wcg
* 修改日期：2013年5月10日
* 变更说明：
* 版 本 号： V1.0
*=======================================================================================*/
///第三层描绘中心点
function getMisPoleCenterPoints(StationSectionName, PositionCode, mislineid, mapLevel, map) {
    //调用异步读取数据方法StationSectionName：区站名称，PositionCode：区站Code,mislineid:线路Code,map:地图对象
    getMisPoleCenterPointsData(StationSectionName, PositionCode, mislineid, mapLevel, map);

};
//异步读取数据完后执行加载数据方法(取中心点) json:返回查询的数据json对象 StationSectionName：区站名称，PositionCode：区站Code,mislineid:线路Code,map:地图对象
function getMisPoleCenterPointsAsync(json, StationSectionName, PositionCode, mislineid, mapLevel, map) {
    if (json[0].longitude != "") {
        map.clearOverlays();    //清除地图上所有覆盖物
        //  map.removeControl(bmapUserTopTwoRightInfo);
        map.removeEventListener("rightclick", getTwoMapmenu);
        var point = new BMap.Point(json[0].longitude, json[0].latitude);    // 创建点坐标
        map.enableScrollWheelZoom();

        getMisPolePoints(StationSectionName, PositionCode, mislineid, mapLevel, map);

    } else {
        ymPrompt.errorInfo(StationSectionName + '; 还没有支柱信息~！！，请补齐支柱基础数据。', null, null, '提示信息', null);
        return;
    }
}
///第三层描绘支柱
var markers = null;
function getMisPolePoints(position, PositionCode, mislineid, mapLevel, map) {
    //调用异步读取支柱数据信息方法 position:区站名称，PositionCode:区站Code,mislineid:线路Code,mapLevel:地图层次，map:地图对象。
    getMisPolePointsData(position, PositionCode, mislineid, mapLevel, map);
};
//调用异步读取支柱数据信息后加载数据json:查询后的支柱Json串，position:区站名称，PositionCode:区站Code,mislineid:线路Code,mapLevel:地图层次，map:地图对象。
function getMisPolePointsAsync(json, position, PositionCode, mislineid, mapLevel, map) {
    var jsons = [];
    jsons.push(json);
    markers = [];
    for (var i = 0; i < json.length; i++) {
        if (json[i].longitude == "0") {
            continue;
        }
        var Point = new BMap.Point(parseFloat(json[i].longitude), parseFloat(json[i].latitude));
        var marker = new BMap.Marker(Point);
        marker.point = Point;
        //先不加载支柱，等待
        //map.addOverlay(marker);
        markers.push(marker);
        marker.json = json[i];
        marker.addEventListener("click", function (e) {
            clickEpmtMenu(this);
        });
    }
    map.addEventListener("rightclick", function (e) { getThreeMapmenu(e, map, jsons[0]); });
    moveMap = map;
    serchPolemoveTo(jsons[0][0].kmmark);

}
var poleCode;
//点击支柱的响应
function clickEpmtMenu(poleMaker) {
    poleElement = poleMaker;
    var html = " <div>";
    poleCode = poleElement.json.POLE_CODE;
    var html1 = " <li  style ='text-decoration: underline '><font>  杆号：" + poleElement.json.poleCode + " 线路：" + poleElement.json.line + " 区站：" + poleElement.json.stationSection + "<font></li>";
    html1 += "<li  style ='text-decoration: underline '>公里标：" + poleElement.json.KMSTANDARD + "<font></li>";
    html1 += " <li style ='text-decoration: underline '><font>所属：" + poleElement.json.powerSection + "/" + poleElement.json.workshop + "/" + poleElement.json.workArea + "<font></li>";
    html1 += " <li><font><a onclick='getMisPoleInfo()' >" + "查看支柱综合信息" + "</a><font></li>";
    var html2 = " <li><font><a onclick='getMisPoleCheck()' >" + "查看支柱缺陷" + "</a><font></li>";
    html += html1;
    if (poleElement.json.faultnum != 0) {
        html += html2;
    }
    // html += html3;
    html += " </div>";
    infoWindow = new BMap.InfoWindow(html);
    poleElement.map.openInfoWindow(infoWindow, poleElement.point);
};
//右键点击支柱的响应
function clickRightClickEpmtMenu(poleMaker, e) {
    var html = " <div>";
    poleCode = e.POLE_CODE;
    var html1 = " <li  style ='text-decoration: underline '><font> 杆号：" + e.poleCode + " 线路：" + e.line + " 区站：" + e.stationSection + "<font></li>";
    html1 += "<li  style ='text-decoration: underline '>公里标：" + e.KMSTANDARD + "<font></li>";
    html1 += " <li  style ='text-decoration: underline '><font>所属：" + e.powerSection + "/" + e.workshop + "/" + e.workArea + "<font></li>";
    html1 += " <li><font><a onclick='getMisPoleInfo()' >" + "查看支柱综合信息" + "</a><font></li>";
    var html2 = " <li><font><a onclick='getMisPoleCheck()' >" + "查看支柱缺陷" + "</a><font></li>";
    html += html1;
    if (e.faultnum != 0) {
        html += html2;
    }
    // html += html3;
    html += " </div>";
    infoWindow = new BMap.InfoWindow(html);
    var point = new BMap.Point(e.longitude, e.latitude);
    poleMaker.openInfoWindow(infoWindow, point);
};
//查看支柱综合信息
function getMisPoleInfo() {
    // poleCode
    var url = "/Common/MFoundation/PoleForm.htm?poleCode=" + poleCode + '&v=' + version;
    window.open(url);
};
//平移到查询的支柱
function serchPolemoveTo(kmflag) {
    moveMap.clearOverlays();    //清除地图上所有覆盖物
    moveMap.closeInfoWindow(infoWindow);

    //根据选择的支柱，显示支柱两边共2000米范围内的覆盖物
    var points = [];
    var PointsSX = new Array();
    var PointsXX = new Array();
    var point = null;
    for (var i = 0; i < markers.length; i++) {
        if (markers[i].json.kmmark > (kmflag - 2000) && markers[i].json.kmmark < (Number(kmflag) + Number(2000))) {
            if (i != 0 && markers[i - 1].json.BRG_TUN_NAME == markers[i].json.BRG_TUN_NAME) {
                if (Math.abs(markers[i - 1].json.poleCode - markers[i].json.poleCode) < 6) {

                } else {
                    continue;
                }
            }
            var icon = null;
            //此处根据支柱是否有缺陷，选择显示图片效果
            if (markers[i].json.faultnum != 0) {
                icon = new BMap.Icon('img/pole_flash.gif', new BMap.Size(76, 100));
            } else {
                icon = new BMap.Icon('img/pole.png', new BMap.Size(76, 100));
            }
            markers[i].setIcon(icon);
            var labelMark = new BMap.Label(markers[i].json.poleCode, { point: markers[i].point });
            labelMark.setOffset(new BMap.Size(25, 6));
            markers[i].setLabel(labelMark);
            moveMap.addOverlay(markers[i]);
            if (markers[i].json.kmmark == kmflag) {
                point = markers[i].point;
            }
            if (point == null) {
                point = markers[i].point;
            }


            if (markers[i].json.direction == '上行') {
                PointsSX.push(markers[i].point);
            } else {
                PointsXX.push(markers[i].point);
            }
        }
    }

    //绘制支柱连线。上行用黑色线，下行用白色线
    var blackLine = new BMap.Polyline(PointsSX, { strokeColor: "black", strokeWeight: 4, strokeOpacity: 0.8, strokeStyle: "dashed" });
    var whiteLine = new BMap.Polyline(PointsXX, { strokeColor: "black", strokeWeight: 4, strokeOpacity: 0.8, strokeStyle: "dashed" });
    moveMap.addOverlay(blackLine);
    moveMap.addOverlay(whiteLine);

    moveMap.centerAndZoom(point, 17);
    moveMap.enableScrollWheelZoom();
};

function getMisPoleCheck() {
    // poleCode
    var url = "/c3/pc/MAlarmMonitoring/MonitorLocoAlarmList.htm?&category=3C&data_type=ALARM&poleCode=" + escape(poleCode) + '&v=' + version;
    window.open(url);
}

function getMisPoleSB() {
    var url = "../MAlarmMonitoring/MonitorDeviceForm.htm?deviceid=" + poleCode + '&v=' + version;
}