
/*========================================================================================*
* 功能说明：变电站操作类
* 注意事项：
* 作    者： wcg
* 版本日期：2013年5月29日
* 修 改 人： wcg
* 修改日期：2013年5月29日
* 变更说明：
* 版 本 号： V1.0
*=======================================================================================*/
//获取变电站
function getMisSubstationPoints(mislineid, level, map, type) {
    var json = "";
    if (type == "1") {
        //只取变电所JSON
        json = getMisSubstationPointsData("");
    } else if (type == "2") {
        //自动刷新时获取变电所信息
        json = getMisSubstationPointsData("");
    } else {
        //根据线路信息获取变电所信息
        json = getMisSubstationPointsData(mislineid);
    }
    if (type != "1") {
        var imgUrl = "";

        if (json != undefined) {
            for (var i = 0; i < json.length; i++) {
                var Point = new BMap.Point(json[i].GIS_X, json[i].GIS_Y);
                var labelMark = new BMap.Label(json[i].SUBSTATION_NAME, { point: Point });
                labelMark.setOffset(new BMap.Size(-15, -18));
                if (json[i].C6AlarmId == "1") {
                    if (json[i].ICONPATH != "" && json[i].ICONPATH != null) {
                        imgUrl = "img/BDS.png";
                    } else {
                        imgUrl = "img/BDS.png";
                    }
                } else {
                    ///变电所缺陷信息
                    imgUrl = "img/BDS_flash.gif";
                }
                var icon = new BMap.Icon(imgUrl, new BMap.Size(28, 22));
                var marker = new BMap.Marker(Point, { icon: icon });
                marker.setLabel(labelMark);
                map.addOverlay(marker);

                // marker.disableDragging(true);
                marker.json = json[i];
                marker.addEventListener("click", getSubSubstationInfo);
            }
        }
    }
    return json;
};


//变电站信息

var id;
function getSubSubstationInfo(e) {
    if (this.json.C6AlarmId == "1") {
        var html = "<div style='width:600px;height:400px; overflow-y:auto; '>";
        html += "<table class='table table-bordered table-condensed'><tr><td colspan='2'>" + this.json.SUBSTATION_NAME + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;所属  -  线路：" + this.json.LINE_CODE + "  机构：" + this.json.POWER_SECTION_CODE + "-" + this.json.WORKSHOP_CODE + "-" + this.json.ORG_CODE + "-" + this.json.POSITION_CODE + "</td></tr>";
        html += "<tr><td colspan='2'>巡检  1号变压器（主变）-高压侧套管A-C相 信息</td></tr>"
        html += "<tr><td style='width:280px;'><img id='img1' width='300px' src='ASPX/Img/011850032027017_20130711_051552_201-A穿墙套管_2_IRV.jpg' /></td><td style='width:240px;'><img width='240px' id='img1' src='ASPX/Img/011850032027017_20130711_051552_201-A穿墙套管_2.jpg' /></td></tr>";
        //        html += "<tr><td colspan='2'>温度曲线图</td></tr>"
        //        html += "<tr><td><img id='img1' src='/ASPX/Img/Critical_IR.jpg' /></td><td><img id='img1' src='/Images/C6/Critical_IR.jpg' /></td></tr>";
        html += "<tr><td>运行电压:  </td><td>负荷电流:  </td></tr>"
        html += "<tr><td>测试仪器:  </td><td>辐&nbsp;&nbsp;射&nbsp;率:  </td></tr>"
        html += "<tr><td>区域温度:  </td><td>湿&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;度:  </td></tr></table></div>";
        html += "</div>"
        var infobdzWindow = new BMap.InfoWindow(html);
        this.openInfoWindow(infobdzWindow);
    } else {

        var div = document.createElement("iframe");
        var url = "ASPX/MonitorAlarmC6Form.htm?alarmid=";
        id = this.json.C6AlarmId;
        var HTMLURL = url + this.json.C6AlarmId;

        div.src = HTMLURL;

        div.width = "610px"; div.height = "100%";
        var html = "<div style='height:440px;overflow-y:auto; width:600px;overflow-x:hidden;'>";

        var post = { width: 610 };
        html += "<input class='btn btn-primary'  value='查看详细信息' style='width:120px'  type='button' onclick='SubMonitorAlarmForm()'/></p>"

        html += div.outerHTML;
        html += "</div>";
        var point = new BMap.Point(this.json.GIS_X, this.json.GIS_Y);    // 创建点坐标
        maps.panTo(point);
        var infoWindow = new BMap.InfoWindow(html, post);
        this.openInfoWindow(infoWindow);
    }
};

//变电站信息
function getSubRightClickSubstationInfo(submap, e) {
    if (e.C6AlarmId == "1") {
        var html = "<div style='width:600px; overflow-y:auto; height:400px;'>";
        html += "<table class='table table-bordered table-condensed'><tr><td colspan='2'>" + e.SUBSTATION_NAME + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;所属  -  线路：" + e.LINE_CODE + "  机构：" + e.POWER_SECTION_CODE + "-" + e.WORKSHOP_CODE + "-" + e.ORG_CODE + "-" + e.POSITION_CODE + "</td></tr>";
        html += "<tr><td colspan='2'>巡检  1号变压器（主变）-高压侧套管A-C相 信息</td></tr>"
        html += "<tr><td style='width:280px;'><img id='img1' width='300px' src='ASPX/Img/011850032027017_20130711_051552_201-A穿墙套管_2_IRV.jpg' /></td><td style='width:240px;'><img width='240px' id='img1' src='ASPX/Img/011850032027017_20130711_051552_201-A穿墙套管_2.jpg' /></td></tr>";
        //        html += "<tr><td colspan='2'>温度曲线图</td></tr>"
        //        html += "<tr><td><img id='img1' src='/Images/C6/Critical_IR.jpg' /></td><td><img id='img1' src='/Images/C6/Critical_IR.jpg' /></td></tr>";
        html += "<tr><td>运行电压:  </td><td>负荷电流:  </td></tr>"
        html += "<tr><td>测试仪器:  </td><td>辐&nbsp;&nbsp;射&nbsp;率:  </td></tr>"
        html += "<tr><td>区域温度:  </td><td>湿&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;度:  </td></tr></table></div>";
        html += "</div>"
        var infobdzWindow = new BMap.InfoWindow(html);
        var point = new BMap.Point(e.GIS_X, e.GIS_Y);
        submap.openInfoWindow(infobdzWindow, point);
    } else {

        var div = document.createElement("iframe");
        var url = "ASPX/MonitorAlarmC6Form.htm?alarmid=";
        id = e.C6AlarmId;
        var HTMLURL = url + e.C6AlarmId; ;

        div.src = HTMLURL;

        div.width = "610px"; div.height = "100%";
        var html = "<div style='height:440px;overflow-y:auto; width:600px;overflow-x:hidden;'>";
        var post = { width: 610 };
        html += "<input class='btn btn-primary'  value='查看详细信息' style='width:120px'  type='button' onclick='SubMonitorAlarmForm()'/></p>"

        html += div.outerHTML;
        html += "</div>";
        var point = new BMap.Point(e.GIS_X, e.GIS_Y);    // 创建点坐标
        maps.panTo(point);
        var infoWindow = new BMap.InfoWindow(html, post);
        submap.openInfoWindow(infoWindow, point);
    }
};
//C6缺陷弹出
function SubMonitorAlarmForm() {
    var url = "../Monitor/MonitorAlarmC6Form.htm?alarmid=";
    var HTMLURL = url + id + "&C3title=1";
    ShowWinOpen(HTMLURL);
};