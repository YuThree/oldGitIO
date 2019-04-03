var smssene;
function GetSms(nodes, scene, leve, topoStyle) {
    smssene = scene;
    var SmsJson = getMisC3PointsData();
    var Jsons = new Array();
    var k = 0;
    for (var i = 0; i < SmsJson.length; i++) {
        var images = [];
        images.push('./img/jc.png');
        images.push('./img/jc_1.png');
        var node0 = new JTopo.AnimateNode(images, 500, true);
        node0.drawText = drawTextH;
        node0.name = SmsJson[i].TRAIN_NO;
        node0.style.fontColor = "255,0,0";
        node0.style.fontSize = "15px";
        node0.setSize(10, 100);
        node0.repeatPlay = true;
        node0.json = SmsJson[i];
        node0.lon = SmsJson[i].GIS_X;
        node0.lat = SmsJson[i].GIS_Y;
        node0.play();

        //var topoStyle = getConfig('TopoStyle');
        if (topoStyle == "GIS") {
            addCookie("Clicked-Train-X", scene.CenterX, 1, "");
            addCookie("Clicked-Train-Y", scene.CenterY, 1, "");
            node0.setLocation(getXbyLon(SmsJson[i].GIS_X, scene.CenterLon, scene.CenterX, scene.XUnit), getYbyLat(SmsJson[i].GIS_Y, scene.CenterLat, scene.CenterY, scene.YUnit));
        } else {
            var json = getMisC3AlarmNearByPos(node0.lon, node0.lat, null);
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
                            SmsJson[i].GIS_X = node0.lon;
                            SmsJson[i].GIS_Y = node0.lat;
                        } else {
                            x = nodes[j].x;
                            y = nodes[j].y + Math.abs(json.distance / 111110 * scene.YUnit);
                            node0.setLocation(x, y);
                            node0.lon = nodes[j].json.startLongitude;
                            node0.lat = parseFloat(nodes[j].json.startLatitude) + parseFloat(json.distance / 111110);
                            SmsJson[i].GIS_X = node0.lon;
                            SmsJson[i].GIS_Y = node0.lat;
                        }

                        if (getCookieValue("Topo-Click-TrainNo") == node0.name) {//是点击的设备
                            addCookie("Clicked-Train-X", x, 1, "");
                            addCookie("Clicked-Train-Y", y, 1, "");
                        }
                        break;
                    }
                }
            }
        }
        node0.addEventListener("click", function (e) {
            getC3ClickSmsInfo(e, e.pageX, e.pageY, e.target.json);
        });
        if (node0.x != 0) {
            scene.add(node0);
            Jsons.push(SmsJson[i]);
        }
    }
    return Jsons;
}

function clickSmsOnMenu(smsJson) {
    getYJC3ClickSmsInfo(smsJson);
}
var deviceid;
function getC3ClickSmsInfo(e, x, y, smsJson) {
    smssene.CenterLon = e.target.lon;
    smssene.CenterLat = e.target.lat;
    var allElments = smssene.elements;
    for (var i = 0; i < allElments.length; i++) {
        if (getCookieValue("TPSmall") == "small") {
            allElments[i].x = getXbyLon(allElments[i].lon, smssene.CenterLon, parseInt(smssene.CenterX), smssene.XUnit); // 
            allElments[i].y = getYbyLat(allElments[i].lat, smssene.CenterLat, parseInt(parseInt(smssene.CenterY)) + 50, smssene.YUnit);
        } else {
            allElments[i].x = getXbyLon(allElments[i].lon, smssene.CenterLon, parseInt(smssene.CenterX), smssene.XUnit); // 
            allElments[i].y = getYbyLat(allElments[i].lat, smssene.CenterLat, parseInt(smssene.CenterY) + 50, smssene.YUnit);
        }
        allElments[i].json.x = allElments[i].x;
        allElments[i].json.y = allElments[i].y;
        allElments[i].selected = false;
    }
    deviceid = smsJson.TRAIN_NO;
    var deviceVersion = getDeviceVersion(deviceid);
    var html = "<table  width='600px'><tr><td width='600px'><button type='button' class='close' onclick='divClose()'>×</button>" + deviceid + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input class='btn btn-primary'  value='查看设备报警缺陷'  type='button' style='width:120px' onclick='getC3Alarms();'/>" //<input class='btn btn-primary'  value='查看检测轨迹' style='width:100px'  type='button' onclick='orbiturl(\"" + deviceid + "," + smsJson.GIS_X + "," + smsJson.GIS_Y + "\");'/>
    if (deviceVersion != "PS3") {

        html += "&nbsp;&nbsp;&nbsp;&nbsp;<input class='btn btn-primary'  value='观看设备视频直播'  type='button' style='width:120px' onclick='playRealtimeVideo();'/>";

    }
    html += " </td></tr>";

    html += "<tr><td>"
    html += "<table class='table table-bordered table-condensed ' style='border-collapse:collapse;border:1px solid #ccc' width='95%' cellspacing='1'  cellpadding='1'>";
    html += "<tr><td style='border:1px solid #ccc' width='15%'>时间</td><td style='border:1px solid #ccc' width='25%'>" + smsJson.DETECT_TIME + "</td>";
    html += "<td style='width:15%'>当前位置</td><td style='width:45%'>";
    var intnum = 0;
    if (smsJson.CROSSING_NO.replace(/[ ]/g, "") != "" && smsJson.CROSSING_NO.replace(/[ ]/g, "") != null) {
        html += smsJson.CROSSING_NO + "号交路"
        intnum = 1;
    }
    if (smsJson.ROUTING_CODE != "" && smsJson.ROUTING_CODE != undefined) {
        if (intnum == 1) {
            html += "(";
        }
        html += smsJson.ROUTING_CODE;
        if (intnum == 1) {
            html += ")";
        }
        intnum = 1;
    }
    if (smsJson.STATION_NO != "") {
        if (intnum == 1) {
            html += ":";
        }
        html += smsJson.STATION_NO + "号站";
        intnum = 1;
    }
    if (smsJson.STATION_NAME != "" && smsJson.STATION_NAME != undefined) {
        if (intnum == 1) {
            html += "(";
        }
        html += smsJson.STATION_NAME;
        if (intnum == 1) {
            html += ")";
        }
        intnum = 1;
    }

    if (smsJson.LINE_NAME != "") {
        if (intnum == 1) {
            html += ";";
        }
        html += smsJson.LINE_NAME;
        intnum = 1;
    }
    if (smsJson.STATION_NAME != "") {
        if (intnum == 1) {
            html += ":";
        }
        html += smsJson.STATION_NAME;
        intnum = 1;
    }
    if (smsJson.KM_MARK != 0) {
        if (intnum == 1) {
            html += "，";
        }
        html += "公里标K" + parseInt(smsJson.KM_MARK / 1000) + "+" + parseInt(smsJson.KM_MARK % 1000);
        intnum = 1;
    }

    html += "</td></tr>"

    html += "<tr><td style='border:1px solid #ccc'>红外温度</td><td style='border:1px solid #ccc'>" + smsJson.SENSOR_TEMP + "℃</td><td style='border:1px solid #ccc' >环境温度</td><td style='border:1px solid #ccc' >" + smsJson.IRV_TEMP + "℃</td></tr>";
    html += "<tr><td style='border:1px solid #ccc'>导高值</td><td>" + smsJson.LINE_HEIGHT + "mm</td><td style='border:1px solid #ccc' >拉出值</td><td style='border:1px solid #ccc'>" + smsJson.PULLING_VALUE + "mm</td></tr>";
    html += "<tr><td style='border:1px solid #ccc'>设备运行状态</td><td style='border:1px solid #ccc' >" + TRAINSTATUS(smsJson.TRAIN_STATUS) + "</td><td>速度</td><td style='border:1px solid #ccc' >" + smsJson.SPEED + "km/h</td></tr>";
    html += "<tr><td style='border:1px solid #ccc'>东经</td><td>" + smsJson.GIS_X + "</td><td>北纬</td> <td>" + smsJson.GIS_Y + "</td></tr></table>";
    html += "</td></tr></table>";
    if (getCookieValue("TPSmall") == "small") {
        var centery = parseInt(smssene.CenterY);
        var centerx = parseInt(smssene.CenterX);
    } else {
        var centery = parseInt(smssene.CenterY);
        var centerx = parseInt(smssene.CenterX);
    }
    $("#rightmenu").html(html);
    $("#rightmenu").css({
        top: Number(parseInt(parseInt(centery) - 200)) + 5,
        left: Number(parseInt(parseInt(centerx) - 300)) + 35
    }).show();
}

function getYJC3ClickSmsInfo(smsJson, leve) {
    var arr = smsJson.split(",");
    deviceid = arr[0];
    var deviceVersion = getDeviceVersion(deviceid);
    var html = "<table  width='600px'><tr><td width='600px'><button type='button' class='close' onclick='divClose()'>×</button>" + deviceid + "当前运行到：[K" + parseInt(arr[1] / 1000) + "+" + parseInt(arr[1] % 1000) + "]<input class='btn btn-primary'  value='查看设备检测报警缺陷'  type='button' style='width:120px' onclick='getC3Alarms();'/>" //<input class='btn btn-primary'  value='查看检测轨迹' style='width:100px'  type='button' onclick='orbiturl(\"" + deviceid + "\");'/>
    if (deviceVersion != "PS3") {

        if (getCookieValue("Small") != "small") {

            html += "<input class='btn btn-primary'  value='观看设备视频直播'  type='button' style='width:120px' onclick='playRealtimeVideo();'/>";
        }
    }
    html += " </td></tr>";

    html += "<tr><td>"
    html += "<table class='table table-bordered table-condensed ' style='border-collapse:collapse;border:1px solid #ccc' width='95%' cellspacing='1'  cellpadding='1'>";
    html += "<tr><td style='border:1px solid #ccc' width='25%'>交路号：</td><td style='border:1px solid #ccc' width='25%'>" + arr[2] + "</td> <td style='border:1px solid #ccc' width='25%'>时间：</td><td style='border:1px solid #ccc' width='25%'>" + new Date(parseInt(arr[3].replace("/Date(", "").replace(")/", ""), 10)).toLocaleString() + "</td></tr>";
    html += "<tr><td style='border:1px solid #ccc'>红外温度</td><td style='border:1px solid #ccc' width='25%'>" + arr[4] + "℃</td><td style='border:1px solid #ccc' width='25%'>环境温度：</td><td style='border:1px solid #ccc' width='25%'>" + arr[5] + "℃</td></tr>";
    html += "<tr><td style='border:1px solid #ccc'>东经</td><td>" + arr[6] + "</td><td>北纬：</td> <td>" + arr[7] + "</td></tr>";
    html += "<tr><td style='border:1px solid #ccc'>导高值</td><td>" + arr[8] + "mm</td><td style='border:1px solid #ccc' width='25%'>拉出值</td><td style='border:1px solid #ccc' width='25%'>" + arr[9] + "mm</td></tr>";
    html += "<tr><td style='border:1px solid #ccc'>设备运行状态</td><td style='border:1px solid #ccc' width='25%'>" + TRAINSTATUS(arr[10]) + "</td><td>速度</td><td style='border:1px solid #ccc' width='25%'>" + arr[11] + "km/h</td></tr></table>";
    html += "</td></tr></table>";
    var AlarmY;
    var AlarmX;
    if (leve != 4) {
        AlarmY = 15;
        AlarmX = 15;
    } else {
        AlarmY = 75;
        AlarmX = 15;
    }
    $("#rightmenu").html(html);
    $("#rightmenu").css({
        top: Number(getCookieValue("Clicked-Train-Y")) + AlarmY,
        left: Number(getCookieValue("Clicked-Train-X")) + AlarmX
    }).show();
}

function getC3Alarms() {
    var url = "/Common/MAlarmMonitoring/MonitorAlarmList.htm?DETECT_DEVICE_CODE=" + deviceid + "&category=" + GetQueryString("Category_Code") + "" + '&v=' + version;
    if (getCookieValue("TPSmall") == "small") {
        window.parent.ShowMTwin("../" + url, "90", "90");
    } else {

        window.open(url, "_bank");
        //        var h = window.screen.height;
        //        var w = window.screen.width;
        //        window.open(url, 'newwindows', 'height=' + h + ', width=' + w + ',top=0,left=0,toolbar=no,scrollbars=yes,menubar=no,resizable=no,status=no,location=no')
    }
}

function playRealtimeVideo() {
    //by wcg 2014-05-27 联动设备视频
    if (getCookieValue("TPSmall") == "small") {
        window.parent.onClickIframeTwo(deviceid);
    } else {
        document.getElementById('modal-22256').click();
        document.getElementById('url').src = "/C3/PC/MLiveStreaming/MonitorLocoPlayMini.htm?locomotiveCode=" + deviceid + '&v=' + version;
        divClose();
    }
}

//查询基础版本
function getDeviceVersion(trainNo) {
    var json = getMisC3DeviceVersion(trainNo);
    return json[0].deviceVersion;
}

//获取C3基础信息
function getMisC3DeviceVersion(TrainNo) {
    var url = "../MGIS/ASHX/Sms/C3ProcessInfo.ashx?type=4&TrainNo=" + TrainNo; //4代表查询设备版本
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