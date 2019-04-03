var Points;
var orbitScene;
function getC3ProcessInfo(deviceid, startdate, enddate, scene, centerLon, centerLat) {
    orbitScene = scene;
    var json = getC3ProcessInfoPointsData(deviceid, startdate, enddate);
    if (json == null || json.length == 0) {
        return;
    }
    if (json[0][0].GIS_X != "") {
        scene.OrbitJson = json[0][1].JCINFO;

        if (centerLon == 'null' && centerLat == 'null') {
            scene.CenterLon = json[0][1].JCINFO[0].GIS_X;
            scene.CenterLat = json[0][1].JCINFO[0].GIS_Y;
        }
        else {
            scene.CenterLon = centerLon;
            scene.CenterLat = centerLat;
        }



        //获取报警信息
        var GJC3AlarmJson = getMisC3AlarmPoint(scene, deviceid, startdate, enddate, "2");
        scene.GJC3AlarmJson = GJC3AlarmJson;

        Points = new Array(json[0][1].JCINFO.length);
        for (var i = 0; i < json[0][1].JCINFO.length; i++) {
            var mathPoint;
            if (i == 0 || i == json[0][1].JCINFO.length - 1) {
                if (i == 0) {
                    var images = [];
                    images.push('./img/jc.png');
                    images.push('./img/jc_1.png');
                    var Point = new JTopo.AnimateNode(images, 500, true);
                    Point.drawText = drawTextH;
                    Point.style.fontColor = "255,0,0";
                    Point.style.fontSize = "14px";
                    var x = getXbyLon(json[0][1].JCINFO[i].GIS_X, scene.CenterLon, scene.CenterX, scene.XUnit);
                    var y = getYbyLat(json[0][1].JCINFO[i].GIS_Y, scene.CenterLat, scene.CenterY, scene.YUnit);
                    Point.setLocation(x, y);
                    Point.json = json[0][1].JCINFO[i];
                    Point.lon = json[0][1].JCINFO[i].GIS_X;
                    Point.lat = json[0][1].JCINFO[i].GIS_Y;
                    Point.addEventListener("click", function (e) {
                        getC3SmsOtherInfo(e.target.json, e.pageX, e.pageY);
                    });
                    var labelMark = json[0][1].JCINFO[i].TRAIN_NO + "当前位置 ";
                    if (json[0][1].JCINFO[i].CROSSING_NO != "" && json[0][1].JCINFO[i].CROSSING_NO != null) {
                        labelMark += json[0][1].JCINFO[i].CROSSING_NO + "号交路";
                    }
                    if (json[0][1].JCINFO[i].KM_MARK != "0" && json[0][1].JCINFO[i].KM_MARK != null) {
                        labelMark += " K" + parseInt(json[0][1].JCINFO[i].KM_MARK / 1000) + "+" + json[0][1].JCINFO[i].KM_MARK % 1000;
                    }
                    labelMark += " " + json[0][1].JCINFO[i].DETECT_TIME;
                    Point.name = labelMark;
                    Point.json = json[0][1].JCINFO[i];
                    Point.repeatPlay = true;
                    Point.play();
                    scene.add(Point);
                    mathPoint = Point;
                    Points[i] = Point;
                } else {
                    var Point = new JTopo.Node();
                    Point.drawText = drawTextH;
                    Point.setImage("./img/jc.png", true);
                    Point.name = "起点位置";
                    Point.style.fontColor = "255,0,0";
                    Point.style.fontSize = "14px";
                    var x = getXbyLon(json[0][1].JCINFO[i].GIS_X, scene.CenterLon, scene.CenterX, scene.XUnit);
                    var y = getYbyLat(json[0][1].JCINFO[i].GIS_Y, scene.CenterLat, scene.CenterY, scene.YUnit);
                    Point.setLocation(x, y);
                    Point.json = json[0][1].JCINFO[i];
                    Point.lon = json[0][1].JCINFO[i].GIS_X;
                    Point.lat = json[0][1].JCINFO[i].GIS_Y;
                    Point.addEventListener("click", function (e) {
                        getC3SmsOtherInfo(e.target.json, e.pageX, e.pageY);
                    });
                    scene.add(Point);
                    mathPoint = Point;
                    Points[i] = Point;
                }


            } else {
                if (Math.abs(json[0][1].JCINFO[i].GIS_Y - mathPoint.lat) < 0.005 || Math.abs(json[0][1].JCINFO[i].GIS_X - mathPoint.lng) < 0.002) {
                    continue; //两点之间差距太小，不描
                } else {
                    var Point = new JTopo.Node();
                    var x = getXbyLon(json[0][1].JCINFO[i].GIS_X, scene.CenterLon, scene.CenterX, scene.XUnit);
                    var y = getYbyLat(json[0][1].JCINFO[i].GIS_Y, scene.CenterLat, scene.CenterY, scene.YUnit);
                    Point.setLocation(x, y);
                    Point.json = json[0][1].JCINFO[i];
                    Point.lon = json[0][1].JCINFO[i].GIS_X;
                    Point.lat = json[0][1].JCINFO[i].GIS_Y;
                    Point.addEventListener("click", function (e) {
                        getC3SmsOtherInfo(e.target.json, e.pageX, e.pageY);
                    });
                    Point.style.fontColor = "255,0,0";
                    Point.height = 16;
                    Point.width = 16;
                    Points[i] = Point;
                    scene.add(Point);

                    if (json[0][1].JCINFO[i].GIS_Y > json[0][1].JCINFO[i - 1].GIS_Y) {//箭头向下
                        Point.setImage("/Common/MGIS/img/flash_down.png");
                    }
                    else if (json[0][1].JCINFO[i].GIS_Y < json[0][1].JCINFO[i - 1].GIS_Y) {//箭头向上
                        Point.setImage("/Common/MGIS/img/flash_up.png");
                    }
                    else if ((json[0][1].JCINFO[i].GIS_Y == json[0][1].JCINFO[i - 1].GIS_Y) && (json[0][1].JCINFO[i].GIS_X > json[0][1].JCINFO[i - 1].GIS_X)) {//箭头向左
                        Point.setImage("/Common/MGIS/img/flash_left.png");
                    }
                    else {//箭头向右
                        Point.setImage("/Common/MGIS/img/flash_right.png");
                    }
                    mathPoint = Point;
                }
            }
        }

        //        for (var i = 0; i < Points.length - 1; i++) {
        //            var link = new JTopo.Link(Points[i], Points[i + 1]); // 增加连线
        //            link.style.strokeStyle = "255, 0, 0";
        //            link.style.lineWidth = '1';
        //            link.json = "";
        //            scene.add(link);
        //        }

        return json;
    }
    orbitScene = scene;
}

//获取设备轨迹
function getC3ProcessInfoPointsData(deviceid, startdate, enddate) {
    var url = "/Common/MGIS/ASHX/Sms/C3ProcessInfo.ashx?deviceid=" + deviceid + "&startdate=" + startdate + "&enddate=" + enddate + "&type=1&jl=";
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
}

//查看设备短信信息《无短信和轨迹》
function getC3SmsOtherInfo(json, x, y) {
    var html = " <div>";
    var html = "<table  width='600px'><tr><button type='button' class='close' onclick='divClose()'>×</button><td colspan='2'>" + json.TRAIN_NO + "</td></tr>"
    html += "<tr><td colspan='2' >"
    html += "<table class='table table-bordered table-condensed' width='95%'  cellspacing='1'  cellpadding='1'>"
    html += "<tr><td style='width:25%'>当前位置：</td><td style='width:75%' colspan='3'>";
    var intnum = 0;
    if (json.CROSSING_NO.replace(/[ ]/g, "") != "" && json.CROSSING_NO.replace(/[ ]/g, "") != null) {
        html += json.CROSSING_NO + "号交路"
        intnum = 1;
    }
    if (json.ROUTING_CODE != "" && json.ROUTING_CODE != undefined) {
        if (intnum == 1) {
            html += "(";
        }
        html += json.ROUTING_CODE;
        if (intnum == 1) {
            html += ")";
        }
        intnum = 1;
    }
    if (json.STATION_NO != "") {
        if (intnum == 1) {
            html += ":";
        }
        html += json.STATION_NO + "号站";
        intnum = 1;
    }
    if (json.STATION_NAME != "" && json.STATION_NAME != undefined) {
        if (intnum == 1) {
            html += "(";
        }
        html += json.STATION_NAME;
        if (intnum == 1) {
            html += ")";
        }
        intnum = 1;
    }

    if (json.LINE_NAME != "") {
        if (intnum == 1) {
            html += ";";
        }
        html += json.LINE_NAME;
        intnum = 1;
    }
    if (json.STATION_NAME != "") {
        if (intnum == 1) {
            html += ":";
        }
        html += json.STATION_NAME;
        intnum = 1;
    }
    if (json.KM_MARK != 0) {
        if (intnum == 1) {
            html += "，";
        }
        html += "公里标K" + parseInt(json.KM_MARK / 1000) + "+" + parseInt(json.KM_MARK % 1000);
        intnum = 1;
    }

    html += "</td></tr>"
    html += "<tr><td style='width: 25%'>时间：</td><td style='width: 75%' colspan='3'>" + json.DETECT_TIME + "</td></tr>"
    html += "<tr><td style='width: 25%'>最高温度：</td><td style='width: 25%'>" + json.SENSOR_TEMP + "℃</td><td style='width: 25%'>环境温度：</td><td style='width: 25%'>" + json.IRV_TEMP + "℃</td></tr>"
    html += "<tr><td>导高值：</td><td>" + json.LINE_HEIGHT + "mm</td><td>拉出值：</td><td>" + json.PULLING_VALUE + "mm</td></tr>"
    html += "<tr><td>设备运行状态：</td><td>" + TRAINSTATUS(json.TRAIN_STATUS) + "</td><td>速度：</td><td>" + json.SPEED + "km/h</td></tr>"
    html += "<tr><td>东经：</td><td>E:" + json.GIS_X + "</td><td>北纬：</td> <td>N:" + json.GIS_Y + "</td></tr></table>"
    html += "</td></tr></table>";
    html += " </div>";

    $("#inside").html(html);
    $("#clickmenu").css({
        top: y + 20,
        left: x - 25
    }).show();
}

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
}

//设备报警点
function getMisC3AlarmPoint(scene, deviceid, startTime, endTime, leNum) {
    var json = getMisC3AlarmPointsData(null, deviceid, startTime, endTime, leNum);
    if (json != undefined) {
        for (var i = 0; i < json.length; i++) {
            var images = [];

            if (json[i].SEVERITY == "一类") {
                images.push('/Common/MGIS/img/ico1.png');
            }
            else if (json[i].SEVERITY == "二类") {
                images.push('/Common/MGIS/img/ico2.png');
            }
            else if (json[i].SEVERITY == "三类") {
                images.push('/Common/MGIS/img/ico3.png');
            }
            var node0 = new JTopo.AnimateNode(images, 500, true);
            node0.json = json[i];
            node0.setLocation(getXbyLon(json[i].GIS_X, scene.CenterLon, scene.CenterX, scene.XUnit), getYbyLat(json[i].GIS_Y, scene.CenterLat, scene.CenterY, scene.YUnit));
            node0.repeatPlay = true;
            node0.play();
            scene.add(node0);
        }
    }

    return json;
}

var GJjson;
function getC3Mapmenu(map, json) {
    var html = "<div style='height:400px;overflow-y:auto; width:500px;'>";
    var gjType = "6";
    GJjson = json;
    var c3html = "<button type='button' class='close' onclick='divClose()'>×</button>";
    c3html += " <fieldset>检测轨迹信息<table border='0'  cellpadding='1' cellspacing='1' style='width: 500px'><tr>";
    for (var i = 0; i < json.length; i++) {
        if (i != 0 && parseInt(i % 3) == 0) {
            c3html += "</tr><tr>";
        }
        c3html += " <td style='width: 130px'><a onclick='MoveGjTo(" + json[i].GIS_X + "," + json[i].GIS_Y + ")'>" + json[i].DETECT_TIME + "</a></td><td style='width: 10px'></td>";
    }
    c3html += "</tr></table></fieldset>";
    var qxType = "5";

    var c3AlarmHtml = " <fieldset>报警信息<table border='0'  cellpadding='1' cellspacing='1' style='width: 500px'><tr>";
    if (orbitScene.GJC3AlarmJson != undefined) {
        for (var i = 1; i < orbitScene.GJC3AlarmJson.length; i++) {
            if (i != 0 && parseInt(i % 4) == 0) {
                c3AlarmHtml += "</tr><tr>";
            }
            c3AlarmHtml += " <td style='width: 100px'><a href='#' onclick='MoveGjTo(" + orbitScene.GJC3AlarmJson[i].GIS_X + "," + orbitScene.GJC3AlarmJson[i].GIS_Y + ")' >" + orbitScene.GJC3AlarmJson[i].RAISED_TIME + "</a></td><td style='width: 10px'></td>";
        }
    }
    c3AlarmHtml += "</tr></table></fieldset>";

    html += c3html;
    html += c3AlarmHtml;
    html += " </div>";

    return html;
}

function MoveGjTo(x, y) {
    divClose();
    orbitScene.CenterLon = x;
    orbitScene.CenterLat = y;

    var allElments = orbitScene.elements;
    for (var i = 0; i < allElments.length; i++) {
        allElments[i].selected = false;
        allElments[i].x = getXbyLon(allElments[i].lon, orbitScene.CenterLon, orbitScene.CenterX, orbitScene.XUnit);
        allElments[i].y = getYbyLat(allElments[i].lat, orbitScene.CenterLat, orbitScene.CenterY, orbitScene.YUnit);
        allElments[i].json.x = allElments[i].x;
        allElments[i].json.y = allElments[i].y;
        if (allElments[i].lon == x && allElments[i].lat == y) {
            allElments[i].selected = true;
        }
    }
}

function divClose() {
    $("#rightmenu").hide();
    $("#clickmenu").hide();
}

function drawTextH(e) {
    var t = this.name;
    if (!t || t == "")
        return;

    var width = e.measureText(t).width;
    e.beginPath();
    e.font = this.style.fontSize + " " + this.style.font;
    e.fillStyle = "rgba(" + this.style.fontColor + ", " + this.alpha + ")";
    var r = this.getTextPostion(this.label.position, width);

    e.fillStyle = "#ffffff";
    e.fillRect(r.x, r.y - 15, width + 25, 20);
    e.fillStyle = "#ff0000";
    e.fillText(t, r.x, r.y);

    e.closePath();
}