///第三层描绘中心点
var s;
function getMisPoleCenterPoints(StationSectionName, PositionCode, mislineid, scene, kmmark) {
    s = scene;
    var jsons = getMisPolePoints(StationSectionName, PositionCode, mislineid);
    scene.poleJson = jsons;
    if (jsons.length > 0) {
        if (kmmark == "") {//未带kmmark，是首次打开设备页面
            kmmark = jsons[parseInt(jsons.length / 2)].kmmark;
        }
        serchPolemoveTo(kmmark);
    }
    else {
        var textNode = new JTopo.TextNode('没有支柱信息');
        textNode.setLocation(Number(scene.CenterX), Number(scene.CenterY));
        //textNode.style.fontColor = "black";
        textNode.style.fontSize = "15pt";
        scene.add(textNode);
    }
}
///第三层描绘支柱
var markers = null;
function getMisPolePoints(position, PositionCode, mislineid) {
    markers = [];
    var json = getMisPolePointsData(position, PositionCode, mislineid);
    for (var i = 0; i < json.length; i++) {
        var node;
        //根据支柱是否有缺陷确定显示效果
        if (json[i].faultnum != 0) {
            var images = [];
            images.push('../../img/pole_fault.png');
            images.push('../../img/pole.png');
            node = new JTopo.AnimateNode(images, 500, true);
            node.name = json[i].poleCode;
            node.repeatPlay = true;
            node.play();
        }
        else {
            node = new JTopo.Node(json[i].poleCode);
            node.setImage("../../img/pole.png", true);
        }

        node.json = json[i];
        node.name = node.name; // + "&&(" + json[i].KMSTANDARD + ")";
        node.drawText = drawTextMutiLine;
        //node.style.fontColor = "#ffffff";
        //先不加载支柱，等待
        markers.push(node);
        node.addEventListener("click", function (e) {
            clickEpmtMenu(e.target.json, e.pageX, e.pageY + 50);
        });
    }
    return json;
}
var poleCode;
//点击支柱的响应
function clickEpmtMenu(json, x, y) {
    var html = " <div>";
    poleCode = json.POLE_CODE;
    var html1 = "<li><button type='button' class='close' onclick='divClose()'>×</button></li>";
    html1 += " <li>杆号：" + json.poleCode + " 线路：" + json.line + " 区站：" + json.stationSection + "</li>";
    html1 += "<li>公里标：" + json.KMSTANDARD + "<font></li>";
    html1 += " <li style='border-bottom: 1px solid #aaa;'>所属：" + json.powerSection + "/" + json.workshop + "/" + json.workArea + "</li>";
    html1 += " <li><a style='border-bottom: 1px solid #aaa;'onclick='getMisPoleInfo()' >" + "查看支柱基本信息" + "</a></li>";
    var html2 = " <li><a style='border-bottom: 1px solid #aaa;' onclick='getMisPoleCheck()' >" + "查看支柱报警" + "</a></li>";
    var html3 = " <li><a style='border-bottom: 1px solid #aaa;' onclick='getMisPoleSB()' >" + "查看支柱挂接设备" + "</a></li>";
    html += html1;
    if (json.faultnum != 0) {
        html += html2;
    }
    html += html3;
    html += " </div>";

    $("#rightmenu").html(html);
    $("#rightmenu").css({
        top: y,
        left: x
    }).show();
}

//查看支柱综合信息
function getMisPoleInfo() {
    //    $("#clickmenu").hide();
    //    var str = "../MAlarmMonitoring/MonitorDeviceForm.htm?deviceid=" + poleCode;
    //    var h = window.screen.height;
    //    var w = window.screen.width;
    //    window.open(str, 'newwindow', 'height=' + h + ', width=' + w + ',toolbar=no,scrollbars=yes,menubar=no,resizable=no,status=no,location=no')
    var url = "/Common/MFoundation/PoleForm.htm?poleCode=" + poleCode + '&v=' + version;
    window.open(url);
}
function getMisPoleCheck() {
    // poleCode
    var url = "ASPX/MonitorAlarmList.htm?poleCode=" + poleCode + '&v=' + version;
    window.open(url);
}
function getMisPoleSB() {
    var url = "../MAlarmMonitoring/MonitorDeviceForm.htm?deviceid=" + poleCode + '&v=' + version;
    window.open(url);
}
//平移到查询的支柱
function serchPolemoveTo(kmflag) {
    divClose();
    //清除所有元素
    s.clear();
    //重定位中心
    for (var i = 0; i < markers.length; i++) {
        if (markers[i].json.kmmark > (kmflag - 2000) && markers[i].json.kmmark < (Number(kmflag) + Number(2000))) {
            if (markers[i].json.kmmark == kmflag) {
                s.CenterLon = markers[i].json.longitude;
                s.CenterLat = markers[i].json.latitude;

                break;
            }
        }
    }

    //根据选择的支柱，显示支柱两边共2000米范围内的覆盖物
    var points = [];
    var PointsSX = new Array();
    var PointsXX = new Array();
    var point = null;
    for (var i = 0; i < markers.length; i++) {
        if (markers[i].json.kmmark > (kmflag - 1000) && markers[i].json.kmmark < (Number(kmflag) + Number(1000))) {
            if (markers[i].json.direction == '上行') {
                markers[i].json.latitude = Number(markers[i].json.latitude) + Number(0.002);
                PointsSX.push(markers[i]);
            } else {
                PointsXX.push(markers[i]);
            }
            markers[i].setLocation(getXbyLon(markers[i].json.longitude, s.CenterLon, s.CenterX, s.XUnit), getYbyLat(markers[i].json.latitude, s.CenterLat, s.CenterY, s.YUnit));
            markers[i].json.x = markers[i].x;
            markers[i].json.y = markers[i].y;
            markers[i].lon = markers[i].json.longitude;
            markers[i].lat = markers[i].json.latitude;
            if (markers[i].json.kmmark == kmflag) {
                markers[i].selected = true;
            }
            s.add(markers[i]);
        }
    }

    for (var i = 0; i < PointsSX.length - 1; i++) {
        var link = new JTopo.Link(PointsSX[i], PointsSX[i + 1]); // 增加连线
        //link.style.strokeStyle = '#000000';
        link.style.lineWidth = '1';
        link.json = "";
        s.add(link);
    }
    for (var i = 0; i < PointsXX.length - 1; i++) {
        var link = new JTopo.Link(PointsXX[i], PointsXX[i + 1]); // 增加连线
        //link.style.strokeStyle = '#ffffff';
        link.json = "";
        link.style.lineWidth = '1';
        s.add(link);
    }
}
//获取区站下的支柱中心点
function getMisPoleCenterPointsData(StationSectionName, PositionCode, mislineid) {
    var url = "../MGIS/ASHX/MisPole/BMapPoleDataPoints.ashx?mispositionid=" + encodeURIComponent(StationSectionName) + "&PositionCode=" + PositionCode + "&mislineid=" + mislineid + "&level=1";
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
//获取区站下的支柱点
function getMisPolePointsData(StationSectionName, PositionCode, mislineid) {
    var url = "../MGIS/ASHX/MisPole/BMapPoleDataPoints.ashx?mispositionid=" + encodeURIComponent(StationSectionName) + "&PositionCode=" + PositionCode + "&mislineid=" + mislineid + "&level=2";
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

function divClose() {
    $("#rightmenu").hide();
    $("#clickmenu").hide();
}

//缺省名称显示方式，但支持节点名称换行
function drawTextMutiLine(e) {
    var t = this.name;
    if (!t || t == "")
        return;

    var words = t.split("&&");
    for (var n = 0; n < words.length; n++) {
        var width = e.measureText(words[n]).width;
        e.beginPath();
        e.font = this.style.fontSize + " " + this.style.font;
        e.fillStyle = "rgba(" + this.style.fontColor + ", " + this.alpha + ")";
        var r = this.getTextPostion(this.label.position, width);
        e.fillText(words[n], r.x, r.y + n * 15);
        e.closePath();
    }
}
