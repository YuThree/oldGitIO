
/*========================================================================================*
* 功能说明：桥梁隧道信息
* 注意事项：
* 作    者： wcg
* 版本日期：2013年9月26日
* 修 改 人： 邓杰
* 修改日期：2013年9月26日
* 变更说明：
* 版 本 号： V1.0
*=======================================================================================*/
//获取桥梁隧道的坐标点

function getMisBridgeTunePoint(mislineid, map) {
    var json = getMisBridgeTunePointsData(mislineid);
    var ImgUrl = "";
    for (var i = 0; i < json.length; i++) {
        var Point = new BMap.Point(json[i].GIS_X, json[i].GIS_Y);
        var labelMark = new BMap.Label(json[i].BRG_TUN_NAME, { point: Point });
        labelMark.setOffset(new BMap.Size(-20, -20));
        var icon = "";
        if (json[i].PROC_BRG_TYPE == "1") {
            icon = new BMap.Icon("../img/channel.png", new BMap.Size(40, 28));
        } else {
            icon = new BMap.Icon("../img/brige.png", new BMap.Size(40, 28));
        }
        var marker = new BMap.Marker(Point, { icon: icon });
        marker.setLabel(labelMark);
        map.addOverlay(marker);
        //marker.disableDragging(true);
        marker.json = json[i];
        marker.addEventListener("click", getBridgeTuneInfo);
    }
    return json;
};
var Map;
var deviceid;
var json;
var Je;
///桥梁隧道单击事件弹出菜单
function getBridgeTuneInfo(e) {
    Map = this.map;
    json = this.json;
    Je = e;
    deviceid = this.json.BRG_TUN_CODE;
    var html = "<div style='height:60px;overflow-y:auto;'>";
    var c3html = " <table border='0' cellpadding='1' cellspacing='1' style='width: 100px'><tr>";

    c3html += " <td style='width: 40px'><a href='#' onclick='serchBridgeTunemoveTo()'>基本信息</a></td><td style='width: 10px'></td>";

    c3html += "</tr><tr><td style='width: 40px'><a href='#' onclick='getBridgeTunemoveTo()'>支柱信息</a></td><td style='width: 10px'></td></tr></table>";
    html += c3html;

    html += " </div>";
    infoWindow = new BMap.InfoWindow(html);
    Map.openInfoWindow(infoWindow, e.point);
};
//桥梁隧道基本信息菜单
function serchBridgeTunemoveTo() {
    var html = "<div style='height:60px;overflow-y:auto;'>";
    var c3html = " <table border='0' cellpadding='1' cellspacing='1' style='width: 100px'><tr>";

    c3html += " <td style='width: 40px'><a href='#' onclick='serchBridgeTunemoveTo()'>信息</a></td><td style='width: 10px'></td>";

    c3html += "</tr><tr><td style='width: 40px'><a href='#'>支柱</a></td><td style='width: 10px'></td></tr></table>";
    html += c3html;

    html += " </div>";
    infoWindow = new BMap.InfoWindow(html);
    Map.openInfoWindow(infoWindow, Je.point);
};
//桥梁进入第三层支柱信息
function getBridgeTunemoveTo() {
    getMisPoleCenterPoints(json.MIS_POSITION_ID, Map.maplevel + 9, Map);
};