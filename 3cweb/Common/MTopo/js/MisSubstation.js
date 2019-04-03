var sceneContainer;
function GetSubstation(nodes, Lincode, scene, topoStyle) {
    sceneContainer = scene;
    var subJson = getMisSubstationPointsData(Lincode);
    for (var i = 0; i < subJson.length; i++) {
        var node0 = new JTopo.Node(subJson[i].SUBSTATION_NAME);
        node0.style.fontColor = "black";
        node0.style.fontSize = "15px";
        //node0.setLocation(getXbyLon(subJson[i].GIS_X, scene.CenterLon, scene.CenterX, scene.XUnit), getYbyLat(subJson[i].GIS_Y, scene.CenterLat, scene.CenterY, scene.YUnit));
        node0.setImage("../MGIS/img/BDS.png", true);
        node0.json = subJson[i];
        node0.lon = subJson[i].GIS_X;
        node0.lat = subJson[i].GIS_Y;
        if (topoStyle == "GIS") {
            addCookie("Clicked-Substation-X", scene.CenterX, 1, "");
            addCookie("Clicked-Substation-Y", scene.CenterY, 1, "");
            node0.setLocation(getXbyLon(subJson[i].GIS_X, scene.CenterLon, scene.CenterX, scene.XUnit), getYbyLat(subJson[i].GIS_Y, scene.CenterLat, scene.CenterY, scene.YUnit));
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
                            subJson[i].GIS_X = node0.lon;
                            subJson[i].GIS_Y = node0.lat;
                        } else {
                            x = nodes[j].x;
                            y = nodes[j].y + Math.abs(json.distance / 111110 * scene.YUnit);
                            node0.setLocation(x, y);
                            node0.lon = nodes[j].json.startLongitude;
                            node0.lat = parseFloat(nodes[j].json.startLatitude) + parseFloat(json.distance / 111110);
                            subJson[i].GIS_X = node0.lon;
                            subJson[i].GIS_Y = node0.lat;
                        }

                        if (getCookieValue("Topo-Click-Substation") == node0.name) {//是点击的设备
                            addCookie("Clicked-Substation-X", x, 1, "");
                            addCookie("Clicked-Substation-Y", y, 1, "");
                        }
                        break;
                    }
                }
            }
        }
        node0.addEventListener("click", function (e) {
            getC3ClickSubInfo(e.pageX, e.pageY + 30, e.target.json);
        });
        scene.add(node0);
    }
    return subJson;
}
function clickSubSubstationOnMenu(smsJson) {
    getC3ClickSubInfo(getConfig('CenterX'), getConfig('CenterY'), smsJson);
}
var id;


//变电站信息
function getC3ClickSubInfo(x, y, e) {
    sceneContainer.CenterLon = e.GIS_X;
    sceneContainer.CenterLat = e.GIS_Y;

    var allElments = sceneContainer.elements;
    for (var i = 0; i < allElments.length; i++) {
        allElments[i].x = getXbyLon(allElments[i].lon, sceneContainer.CenterLon, sceneContainer.CenterX, sceneContainer.XUnit);
        allElments[i].y = getYbyLat(allElments[i].lat, sceneContainer.CenterLat, sceneContainer.CenterY, sceneContainer.YUnit);
        allElments[i].json.x = allElments[i].x;
        allElments[i].json.y = allElments[i].y;
        allElments[i].selected = false;
    }
    var html = "<button type='button' class='close' onclick='divClose()'>×</button>";
    html += "<table class='table table-bordered table-condensed'  cellspacing='1'  cellpadding='1'><tr><td colspan='2'>" + e.SUBSTATION_NAME + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;所属  -  线路：" + e.LINE_CODE + "  机构：" + e.POWER_SECTION_CODE + "-" + e.WORKSHOP_CODE + "-" + e.ORG_CODE + "-" + e.POSITION_CODE + "</td></tr>";
    html += "<tr><td colspan='2'>巡检  1号变压器（主变）-高压侧套管A-C相 信息</td></tr>"
    html += "<tr><td style='width:280px;'><img id='img1' width='300px' src='../GIS/ASPX/Img/011850032027017_20130711_051552_201-A穿墙套管_2_IRV.jpg' /></td><td style='width:240px;'><img width='240px' id='img1' src='../GIS/ASPX/Img/011850032027017_20130711_051552_201-A穿墙套管_2.jpg' /></td></tr>";
    //    html += "<tr><td colspan='2'>温度曲线图</td></tr>"
    //    html += "<tr><td><img id='img1' src='/Images/C6/Critical_IR.jpg' /></td><td><img id='img1' src='/Images/C6/Critical_IR.jpg' /></td></tr>";
    html += "<tr><td>运行电压:  </td><td>负荷电流:  </td></tr>"
    html += "<tr><td>测试仪器:  </td><td>辐&nbsp;&nbsp;射&nbsp;率:  </td></tr>"
    html += "<tr><td>区域温度:  </td><td>湿&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;度:  </td></tr></table>";
    $("#rightmenu").html(html);
    $("#rightmenu").css({
        top: Number(sceneContainer.CenterY),
        left: Number(sceneContainer.CenterX) + 25
    }).show();
    //    var AlarmY;
    //    var AlarmX;
    //    if (leve != 4) {
    //        AlarmY = 15;
    //        AlarmX = 15;
    //    } else {
    //        AlarmY = 75;
    //        AlarmX = 15;
    //    }
    //    $("#rightmenu").html(html);
    //    $("#rightmenu").css({
    //        top: Number(getCookieValue("Clicked-Substation-Y")) + AlarmY,
    //        left: Number(getCookieValue("Clicked-Substation-X")) + AlarmX
    //    }).show();
}
function Getsub(Lincode, scene) {
    var subJson = getMisSubstationPointsData(Lincode);
    if (subJson != undefined) {
        for (var i = 0; i < subJson.length; i++) {
            var json = getXY(parseInt(i) + 1, 4);
            var node0 = new JTopo.Node();
            node0.dragable = false;
            node0.json = subJson[i];
            node0.key = subJson[i].SUBSTATION_NAME;
            node0.setImage("../MGIS/img/BDS.png", true);
            node0.drawText = drawTextMutiLine;
            node0.name = subJson[i].SUBSTATION_NAME + "&&" + subJson[i].POSITION;
            node0.setLocation(json[0], json[1]);
            getPole(node0, scene, parseInt(i) + 1);
            scene.add(node0);
        }
        for (var i = 2; i < nodes1.length - 1; i = i + 2) {
            var link1 = new JTopo.Link(nodes1[i - 1], nodes1[i]); // 增加连线
            link1.style.lineJoin = 'round';
            link1.style.lineWidth = '1';
            link1.pattern = 10;
            //link1.paint = drawDashLine;
            link1.style.strokeStyle = '0,0,255';
            link1.json = "";
            scene.add(link1);
            var alarmNode = new JTopo.Node(7);
            alarmNode.x = (nodes1[i - 1].x + nodes1[i].x) / 2;
            alarmNode.y = (nodes1[i - 1].y + nodes1[i].y) / 2;
            alarmNode.setImage("/Common/img/repeatAlarm/repeat_red.png", true);
            scene.add(alarmNode);
        }
        for (var i = 2; i < nodes2.length - 1; i = i + 2) {
            var link2 = new JTopo.Link(nodes2[i - 1], nodes2[i]); // 增加连线
            link2.style.lineJoin = 'round';
            link2.style.lineWidth = '2';
            link2.pattern = 10;
            //link1.paint = drawDashLine;
            link2.style.strokeStyle = '255,0,0';
            link2.json = "";
            scene.add(link2);
            var alarmNode = new JTopo.Node(5);
            alarmNode.x = (nodes2[i - 1].x + nodes2[i].x) / 2;
            alarmNode.y = (nodes2[i - 1].y + nodes2[i].y) / 2;
            alarmNode.setImage("/Common/img/repeatAlarm/repeat_green.png", true);
            scene.add(alarmNode);
        }
    }
}
function getXY(i, N) {
    if (parseInt(i % N) != 0)
        var y = parseInt(i / N) + 1;
    else
        var y = parseInt(i / N);
    var x;
    if (y % 2 == 0) {//偶数行
        if (parseInt(i % N) != 0)
            x = parseInt(N - i % N + 1);
        else
            x = 1;
    } else {//奇数行
        if (parseInt(i % N) != 0)
            x = i % N;
        else
            x = N;
    }

    var json = [((x - 1) * 370) + 100, y * 170];
    return json;
}
var nodes1 = new Array();
var nodes2 = new Array();
var k = 0;
function getPole(node, scene, i) {
    var N = 4;
    if (parseInt(i % N) != 0)
        var y = parseInt(i / N) + 1;
    else
        var y = parseInt(i / N);
    var x;
    if (y % 2 == 0) {//偶数行
        var node2 = new JTopo.Node();
        node2.dragable = false;
        node2.key = "2";
        node2.setImage("../img/pole1.png", true);
        node2.setLocation(node.x + 50, node.y - 45);
        node2.drawText = drawTextMutiLine;
        var kmstr = String(Number(node.json.KM_MARK_SX / 2000).toFixed(3));
        var kmstrs = kmstr.split(".");
        node2.name = "K" + kmstrs[0] + "+" + kmstrs[1];
        scene.add(node2);
        nodes1[k] = node2;

        var node3 = new JTopo.Node();
        node3.dragable = false;
        node3.key = "3";
        node3.setImage("../img/pole1.png", true);
        node3.setLocation(node.x + 50, node.y + 10);
        node3.drawText = drawTextMutiLine;
        var kmstr = String(Number(node.json.KM_MARK_XX / 2000).toFixed(3));
        var kmstrs = kmstr.split(".");
        node3.name = "K" + kmstrs[0] + "+" + kmstrs[1];
        scene.add(node3);
        nodes2[k] = node3;
        k++;
        var node0 = new JTopo.Node();
        node0.dragable = false;
        node0.key = "0";
        node0.setImage("../img/pole1.png", true);
        node0.setLocation(node.x - 60, node.y - 45);
        node0.drawText = drawTextMutiLine;
        var kmstr = String(Number(node.json.KM_MARK_SX / 2000).toFixed(3));
        var kmstrs = kmstr.split(".");
        node0.name = "K" + kmstrs[0] + "+" + kmstrs[1];
        scene.add(node0);
        nodes1[k] = node0;

        var node1 = new JTopo.Node();
        node1.dragable = false;
        node1.key = "1";
        node1.setImage("../img/pole1.png", true);
        node1.setLocation(node.x - 60, node.y + 10);
        node1.drawText = drawTextMutiLine;
        var kmstr = String(Number(node.json.KM_MARK_XX / 2000).toFixed(3));
        var kmstrs = kmstr.split(".");
        node1.name = "K" + kmstrs[0] + "+" + kmstrs[1];
        scene.add(node1);
        nodes2[k] = node1;
        k++;
    } else {
        var node0 = new JTopo.Node();
        node0.dragable = false;
        node0.key = "0";
        node0.setImage("../img/pole1.png", true);
        node0.setLocation(node.x - 60, node.y - 45);
        node0.drawText = drawTextMutiLine;
        var kmstr = String(Number(node.json.KM_MARK_SX / 2000).toFixed(3));
        var kmstrs = kmstr.split(".");
        node0.name = "K" + kmstrs[0] + "+" + kmstrs[1];
        scene.add(node0);
        nodes1[k] = node0;

        var node1 = new JTopo.Node();
        node1.dragable = false;
        node1.key = "1";
        node1.setImage("../img/pole1.png", true);
        node1.setLocation(node.x - 60, node.y + 10);
        node1.drawText = drawTextMutiLine;
        var kmstr = String(Number(node.json.KM_MARK_XX / 2000).toFixed(3));
        var kmstrs = kmstr.split(".");
        node1.name = "K" + kmstrs[0] + "+" + kmstrs[1];
        scene.add(node1);
        nodes2[k] = node1;
        k++;
        var node2 = new JTopo.Node();
        node2.dragable = false;
        node2.key = "2";
        node2.setImage("../img/pole1.png", true);
        node2.setLocation(node.x + 50, node.y - 45);
        node2.drawText = drawTextMutiLine;
        var kmstr = String(Number(node.json.KM_MARK_SX / 2000).toFixed(3));
        var kmstrs = kmstr.split(".");
        node2.name = "K" + kmstrs[0] + "+" + kmstrs[1];

        scene.add(node2);
        nodes1[k] = node2;

        var node3 = new JTopo.Node();
        node3.dragable = false;
        node3.key = "3";
        node3.setImage("../img/pole1.png", true);
        node3.setLocation(node.x + 50, node.y + 10);
        node3.drawText = drawTextMutiLine;
        var kmstr = String(Number(node.json.KM_MARK_XX / 2000).toFixed(3));
        var kmstrs = kmstr.split(".");
        node3.name = "K" + kmstrs[0] + "+" + kmstrs[1];
        scene.add(node3);
        nodes2[k] = node3;
        k++;
    }

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