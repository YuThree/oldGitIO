//画缺陷
var Alarmscene;
function GetAlarm(LineCode, nodes, scene, startTime, endTime, leve, topoStyle) {
    var leNum = "1";
    if (startTime != "") {
        leNum = "3";
    }
    if (startTime == "1") {
        leNum = "3";
        startTime = "";
    }
    var AlarmTopo = "";
    if (scene.AlarmTopo == "6CAlarmTopo") {
        AlarmTopo = scene.AlarmTopo;
        leNum = "3";
    }
    Alarmscene = scene;
    var alarmJson = getMisC3AlarmPointsData(LineCode, AlarmTopo, startTime, endTime, leNum);
    if (alarmJson != undefined) {
        // var topoStyle = getConfig('TopoStyle');
        var Jsons = new Array();
        var k = 0;
        for (var i = 0; i < alarmJson.length; i++) {
            //        var node0 = new JTopo.Node("");
            //        node0.style.fontColor = "black";
            //        node0.setLocation(getXbyLon(alarmJson[i].GIS_X, scene.CenterLon, scene.CenterX, scene.XUnit), getYbyLat(alarmJson[i].GIS_Y, scene.CenterLat, scene.CenterY, scene.YUnit));
            //        node0.setImage("./img/alarm.png", true);
            //        node0.json = alarmJson[i];
            //        scene.add(node0);

            var images = [];
            images.push('./img/alarm.png');
            images.push('./img/alarm_1.png');
            var node0 = new JTopo.AnimateNode(images, 500, true);
            node0.json = alarmJson[i];
            node0.lon = alarmJson[i].GIS_X;
            node0.lat = alarmJson[i].GIS_Y;
            if (topoStyle == "GIS") {
                node0.setLocation(getXbyLon(alarmJson[i].GIS_X, scene.CenterLon, scene.CenterX, scene.XUnit), getYbyLat(alarmJson[i].GIS_Y, scene.CenterLat, scene.CenterY, scene.YUnit));
                node0.type = "alarm";
                addCookie("Clicked-Alarm-X", scene.CenterX, 1, "");
                addCookie("Clicked-Alarm-Y", scene.CenterY, 1, "");
            } else {
                var json = getMisC3AlarmNearByPos(node0.lon, node0.lat, alarmJson[i].BUREAU_CODE);
                if (json.posCode != "") {
                    for (var j = 0; j < nodes.length; j++) {
                        if (nodes[j].positionCode == json.posCode) {
                            var x;
                            var y;
                            if (nodes[j].direction == "HX") {
                                x = nodes[j].x + Math.abs(json.distance / 111110 * scene.YUnit);
                                y = nodes[j].y;
                                node0.setLocation(x, y);
                                node0.lon = parseFloat(nodes[j].json.startLongitude) + parseFloat(json.distance / 111110);
                                node0.lat = nodes[j].json.startLatitude;
                                alarmJson[i].GIS_X = node0.lon;
                                alarmJson[i].GIS_Y = node0.lat;
                            } else {
                                x = nodes[j].x;
                                y = nodes[j].y + Math.abs(json.distance / 111110 * scene.YUnit);
                                node0.setLocation(x, y);
                                node0.lon = nodes[j].json.startLongitude;
                                node0.lat = parseFloat(nodes[j].json.startLatitude) + parseFloat(json.distance / 111110);
                                alarmJson[i].GIS_X = node0.lon;
                                alarmJson[i].GIS_Y = node0.lat;
                            }

                            if (getCookieValue("Topo-Click-AlarmID") == node0.json.ALARM_ID) {//是点击的设备
                                addCookie("Clicked-Alarm-X", x, 1, "");
                                addCookie("Clicked-Alarm-Y", y, 1, "");
                            }
                            break;
                        }
                    }
                }
            }

            node0.repeatPlay = true;
            node0.play();
            node0.addEventListener('click', function (e) {
                DJonclickAlarm(e, 1);
            });
            if (node0.x != 0) {
                scene.add(node0);
                Jsons.push(alarmJson[i]);

            }
        }
    }
    return alarmJson;
}




var type; //类型
var id;  //缺陷、报警ID
//跳转 查看详细信息
function MonitorAlarmForm() {
    switch (type) {
        case "1C":
            url = "/6C/PC/MAlarmMonitoring/MonitorAlarm1CForm6C.htm?alarmid=";
            break;
        case "2C":
            url = "/6C/PC/MAlarmMonitoring/MonitorAlarmC2Form6C.htm?alarmid=";
            break;
        case "3C":
            if (getConfig('For6C') == 'DPC') {
                url = "/6C/PC/MAlarmMonitoring/MonitorAlarm3CForm6C.htm?alarmid=";
            }
            else {
                url = "/C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=";
            }
            break;
        case "4C":
            url = "/6C/PC/MAlarmMonitoring/MonitorAlarmC4Form6C.htm?alarmid=";
            break;
        case "5C":
            url = "/6C/PC/MAlarmMonitoring/MonitorAlarmC5Form.htm?alarmid=";
            break;
        case "6C":
            url = "/6C/PC/MAlarmMonitoring/MonitorAlarmC6Form.htm?alarmid=";
            break;
        default:
            break;
    }
    var HTMLURL = url + id + '&v=' + version;
    ShowWinOpen(HTMLURL);
}
//单击C3设备报警信息
function onclickAlarm(event, node) {
    type = event.target.json.CATEGORY_CODE;
    id = event.target.json.ALARM_ID;
    var url = "";
    switch (type) {
        case "1C":
            url = "/6C/PC/MAlarmMonitoring/MonitorAlarm1CForm6C.htm?alarmid=";
            break;
        case "2C":
            url = "/6C/PC/MAlarmMonitoring/MonitorAlarmC2Form6C.htm?alarmid=";
            break;
        case "3C":
            if (getConfig('For6C') == 'DPC') {
                url = "/6C/PC/MAlarmMonitoring/MonitorAlarm3CForm6C.htm?alarmid=";
            }
            else {
                url = "/C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=";
            }
            break;
        case "4C":
            url = "/6C/PC/MAlarmMonitoring/MonitorAlarmC4Form6C.htm?alarmid=";
            break;
        case "5C":
            url = "/6C/PC/MAlarmMonitoring/MonitorAlarmC5Form.htm?alarmid=";
            break;
        case "6C":
            url = "/6C/PC/MAlarmMonitoring/MonitorAlarmC6Form.htm?alarmid=";
            break;
        default:
            break;
    }
    var HTMLURL = url + event.target.json.ALARM_ID + '&v=' + version;
    window.open(HTMLURL, "_blank");

}

//视频下载
function IRVXZ() {
    var responseData = XmlHttpHelper.transmit(false, "get", "text", "../MAlarmMonitoring/RemoteHandlers/GetIRVUrlByAlarmID.ashx?alarmid=" + id + "&tmpe=" + Math.random(), null, null);
    if (responseData != null && responseData != "") {
        showImg(responseData);
    }
};
function divClose() {
    $("#rightmenu").hide();
    $("#clickmenu").hide();
}
//右键C3设备报警信息
function YJonclickAlarm(e, leve) {
    var arr = e.split(",");
    type = arr[0];

    id = arr[1];
    var url = "";
    switch (type) {
        case "1C":
            url = "/6C/PC/MAlarmMonitoring/MonitorAlarm1CForm6C.htm?alarmid=";
            break;
        case "2C":
            url = "/6C/PC/MAlarmMonitoring/MonitorAlarmC2Form6C.htm?alarmid=";
            break;
        case "3C":
            if (getConfig('For6C') == 'DPC') {
                url = "/6C/PC/MAlarmMonitoring/MonitorAlarm3CForm6C.htm?alarmid=";
            }
            else {
                url = "/C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=";
            }
            break;
        case "4C":
            url = "/6C/PC/MAlarmMonitoring/MonitorAlarmC4Form6C.htm?alarmid=";
            break;
        case "5C":
            url = "/6C/PC/MAlarmMonitoring/MonitorAlarmC5Form.htm?alarmid=";
            break;
        case "6C":
            url = "/6C/PC/MAlarmMonitoring/MonitorAlarmC6Form.htm?alarmid=";
            break;
        default:
            break;
    }
    var HTMLURL = url + '&v=' + version;
    window.open(HTMLURL, "_blank");


}

//点击报警弹出
function DJonclickAlarm(e, leve) {
    Alarmscene.CenterLon = e.target.lon;
    Alarmscene.CenterLat = e.target.lat;

    var allElments = Alarmscene.elements;
    for (var i = 0; i < allElments.length; i++) {

        if (getCookieValue("TPSmall") == "small") {
            allElments[i].x = getXbyLon(allElments[i].lon, Alarmscene.CenterLon, parseInt(Alarmscene.CenterX), Alarmscene.XUnit);
            allElments[i].y = getYbyLat(allElments[i].lat, Alarmscene.CenterLat, parseInt(Alarmscene.CenterY), Alarmscene.YUnit);
        } else {
            allElments[i].x = getXbyLon(allElments[i].lon, Alarmscene.CenterLon, parseInt(Alarmscene.CenterX), Alarmscene.XUnit);
            allElments[i].y = getYbyLat(allElments[i].lat, Alarmscene.CenterLat, parseInt(Alarmscene.CenterY), Alarmscene.YUnit);
        }
        allElments[i].json.x = allElments[i].x;
        allElments[i].json.y = allElments[i].y;
        allElments[i].selected = false;
    }
    type = e.target.json.CATEGORY_CODE;


    var url = "";
    switch (type) {
        case "1C":
            url = "/6C/PC/MAlarmMonitoring/MonitorAlarm1CForm6C.htm?alarmid=";
            break;
        case "2C":
            url = "/6C/PC/MAlarmMonitoring/MonitorAlarmC2Form6C.htm?alarmid=";
            break;
        case "3C":
            if (getConfig('For6C') == 'DPC') {
                url = "/6C/PC/MAlarmMonitoring/MonitorAlarm3CForm6C.htm?alarmid=";
            }
            else {
                url = "/C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=";
            }
            break;
        case "4C":
            url = "/6C/PC/MAlarmMonitoring/MonitorAlarmC4Form6C.htm?alarmid=";
            break;
        case "5C":
            url = "/6C/PC/MAlarmMonitoring/MonitorAlarmC5Form.htm?alarmid=";
            break;
        case "6C":
            url = "/6C/PC/MAlarmMonitoring/MonitorAlarmC6Form.htm?alarmid=";
            break;
        default:
            break;
    }

    var HTMLURL = url + e.target.json.ALARM_ID;

    HTMLURL = url + e.target.json.ALARM_ID + '&v=' + version;

    window.open(HTMLURL, "_blank");


}

function RepeatMapbind(alarmid, linecode, xb, startdate, enddate, distance, count, scene) {
    var Jsons = new Array();
    var alarmJson = getRepeatAlarm(alarmid, linecode, xb, startdate, enddate, distance, count);
    for (var i = 0; i < alarmJson.length; i++) {
        //        var node0 = new JTopo.Node("");
        //        node0.style.fontColor = "black";
        //        node0.setLocation(getXbyLon(alarmJson[i].GIS_X, scene.CenterLon, scene.CenterX, scene.XUnit), getYbyLat(alarmJson[i].GIS_Y, scene.CenterLat, scene.CenterY, scene.YUnit));
        //        node0.setImage("./img/alarm.png", true);
        //        node0.json = alarmJson[i];
        //        scene.add(node0);

        var images = [];

        var node0 = new JTopo.Node(alarmJson[i].length - 1);
        if (alarmJson[i].length < 5) {
            node0.setImage("/Common/img/repeatAlarm/repeat_green.png", true);
        }
        else if (alarmJson[i].length < 10) {
            node0.setImage("/Common/img/repeatAlarm/repeat_blue.png", true);
        }
        else {
            node0.setImage("/Common/img/repeatAlarm/repeat_red.png", true);
        }
        node0.key = alarmJson[i].length - 1;
        node0.json = alarmJson[i][0];
        node0.lon = alarmJson[i][0].GIS_X;
        node0.lat = alarmJson[i][0].GIS_Y;

        var json = getMisC3AlarmNearByPos(node0.lon, node0.lat, alarmJson[i][0].BUREAU_CODE);
        if (json.posCode != "") {
            for (var j = 0; j < scene.nodes.length; j++) {
                if (scene.nodes[j].positionCode == json.posCode) {
                    var x;
                    var y;
                    if (scene.nodes[j].direction == "HX") {
                        x = scene.nodes[j].x + Math.abs(json.distance / 111110 * scene.YUnit);
                        y = scene.nodes[j].y;
                        node0.setLocation(x, y);
                        node0.lon = parseFloat(scene.nodes[j].json.startLongitude) + parseFloat(json.distance / 111110);
                        node0.lat = scene.nodes[j].json.startLatitude;
                        alarmJson[i][0].GIS_X = node0.lon;
                        alarmJson[i][0].GIS_Y = node0.lat;
                    } else {
                        x = scene.nodes[j].x;
                        y = scene.nodes[j].y + Math.abs(json.distance / 111110 * scene.YUnit);
                        node0.setLocation(x, y);
                        node0.lon = scene.nodes[j].json.startLongitude;
                        node0.lat = parseFloat(scene.nodes[j].json.startLatitude) + parseFloat(json.distance / 111110);
                        alarmJson[i][0].GIS_X = node0.lon;
                        alarmJson[i][0].GIS_Y = node0.lat;
                    }

                    if (getCookieValue("Topo-Click-AlarmID") == node0.json.ALARM_ID) {//是点击的设备
                        addCookie("Clicked-Alarm-X", x, 1, "");
                        addCookie("Clicked-Alarm-Y", y, 1, "");
                    }
                    break;
                }
            }
        }

        node0.json = alarmJson[i][0];
        node0.repeatPlay = true;
        //node0.play();
        node0.addEventListener('click', function (e) {
            geRepeatAlarmInfo(e);
        });
        if (node0.x != 0) {
            scene.add(node0);
            Jsons.push(alarmJson[i][0]);

        }
    }
}
function geRepeatAlarmInfo(e) {
    var json = e.target.json;
    window.open("/Common/MDataAnalysis/C3RepeatAlarmImg.aspx?alarmid=" + json.ID);

}