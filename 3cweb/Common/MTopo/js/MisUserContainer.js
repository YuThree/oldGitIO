//第一层右键
var thisScene;
var thisNum;
function getOnemenu(scene) {
    thisScene = scene;
    thisNum = 1;
    html = "<button type='button' class='close' onclick='divClose()'>×</button>";
    if (thisScene.AlarmTopo == "AlarmTopo" || thisScene.AlarmTopo == "6CAlarmTopo") {
        html += getRightClickMapMenuAlarmTopo(scene, 1);
    } else {
        html += "<a href='#' onclick='oneurl()'>返回首页</a>" + getRightClickMapMenu(scene, 1);
    }
    return html;
}

var Positionjson;
//二层右键
function getTwomenu(scene) {
    thisScene = scene;
    thisNum = 2;
    html1 = "<button type='button' class='close' onclick='divClose()'>×</button>";
    html1 += " <a href='#' onclick='oneurl()'>返回首页</a><br/><fieldset style='border-width: 0px'>站点信息<table border='0'  cellpadding='1' cellspacing='1' style='width: 600px'><tr>";
    Positionjson = scene.posJson;
    var zdType = "2";
    for (var i = 0; i < Positionjson.length; i++) {
        if (i != 0 && parseInt(i % 5) == 0) {
            html1 += "</tr><tr>";
        }
        html1 += " <td style='width: 100px'><a href='#' onclick='serchObgmoveTo(" + Positionjson[i].startLongitude + "," + Positionjson[i].startLatitude + ")' >" + Positionjson[i].StationSectionName + "</a></td><td style='width: 10px'></td>";
    }
    html1 += "</tr></table></fieldset>";

    var html = getRightClickMapMenu(scene, 2);
    html1 += html;
    return html1;
}

//第三层右键菜单
var zzjson;
function getThreeMapmenu(scene) {
    thisScene = scene;
    var zzType = "4";
    zzjson = scene.poleJson; //支柱对象JSON串
    var stationSectionName = "";
    if (zzjson.length > 0) {
        stationSectionName = zzjson[0].stationSection;
    }
    html = "<button type='button' class='close' onclick='divClose()'>×</button>";
    html += "<a href='#' onclick='oneurl()'>返回首页</a><br>";
    html += "</tr></table></fieldset>" + getDeviceRightMenu(scene) + "</div>";
    html += "<div style='height:350px;overflow-y:auto;'> <fieldset>" + stationSectionName + "支柱信息<table  border='0' cellpadding='1' cellspacing='1' style='width: 600px'><tr>";
    for (var i = 0; i < zzjson.length; i++) {
        if (i != 0 && parseInt(i % 5) == 0) {
            html += "</tr><tr>";
        }
        html += " <td style='width: 13px'><a href='#' onclick='serchPolemoveTo(" + zzjson[i].kmmark + ")' >" + zzjson[i].poleCode + "</a></td><td style='width: 5px'></td>";
    }

    html += "</tr></table></fieldset></div>";
    return html;
}
function getDeviceRightMenu(scene) {
    var c3html = " <fieldset>线路信息<table border='0'  cellpadding='1' cellspacing='1' style='width: 600px'><tr>";
    for (var i = 1; i < scene.linJson.length; i++) {
        if (i != 0 && parseInt(i % 6) == 0) {
            c3html += "</tr><tr>";
        }
        c3html += " <td style='width: 100px'><a href='#' onclick='twourl(\"" + scene.linJson[i][i][0].ID + "" + "\")'>" + scene.linJson[i][i][0].LINE_NAME + "</a></td><td style='width: 10px'></td>";
    }
    c3html += "</tr></table></fieldset>";
    return c3html;
}
//缺陷右键
function getAlarmmenu(scene) {
    thisScene = scene;
    var qxType = "5";

    thisNum = 4;
    qxJson = scene.alarmJson;
    var alarmJsonHtml = " <button type='button' class='close' onclick='divClose()'>×</button><fieldset style='border-width: 0px'>缺陷信息<table border='0'  cellpadding='1' cellspacing='1' style='width: 600px'><tr>";
    for (var k = 0; k < 6; k++) {

        var j = 0;
        var Chtml = "<br/><fieldset>" + (k + 1) + "C</fieldset><table border='0'  cellpadding='1' cellspacing='1' style='width: 600px'><tr>";
        for (var i = 0; i < scene.alarmJson.length; i++) {
            if (j != 0 && parseInt(j % 5) == 0) {
                Chtml += "</tr><tr>";
            }
            if (scene.alarmJson[i].CATEGORY_CODE == (k + 1) + "C") {
                Chtml += " <td style='width: 100px'><a href='#' onclick='serchObgmoveTo(" + scene.alarmJson[i].GIS_X + "," + scene.alarmJson[i].GIS_Y + ")' >" + scene.alarmJson[i].RAISED_TIME + "</a></td><td style='width: 10px'></td>";
                j++;
            }
        }
        alarmJsonHtml += "</tr></table></fieldset>";
        if (j == 0)
        { } else {
            alarmJsonHtml += Chtml;
        }
    }
    alarmJsonHtml += "</fieldset>";
    return alarmJsonHtml;
}

//平移到查询点
function serchObgmoveTo(x, y, id) {
    divClose();
    if (id != "" && id != null) {
        for (var i = 0; i < thisScene.elements.length; i++) {
            if (thisScene.elements[i].json.ALARM_ID == id) {
                x = thisScene.elements[i].json.GIS_X;
                y = thisScene.elements[i].json.GIS_Y;
            }
            if (thisScene.elements[i].json.ID == id) {
                x = thisScene.elements[i].json.GIS_X;
                y = thisScene.elements[i].json.GIS_Y;
            }
        }
    }
    thisScene.CenterLon = x;
    thisScene.CenterLat = y;

    var allElments = thisScene.elements;
    for (var i = 0; i < allElments.length; i++) {
        allElments[i].selected = false;
        if (getCookieValue("TPSmall") == "small") {
            allElments[i].x = getXbyLon(allElments[i].lon, thisScene.CenterLon, parseInt(thisScene.CenterX), thisScene.XUnit);
            allElments[i].y = getYbyLat(allElments[i].lat, thisScene.CenterLat, parseInt(thisScene.CenterY), thisScene.YUnit);
        } else {
            allElments[i].x = getXbyLon(allElments[i].lon, thisScene.CenterLon, parseInt(thisScene.CenterX), thisScene.XUnit);
            allElments[i].y = getYbyLat(allElments[i].lat, thisScene.CenterLat, parseInt(thisScene.CenterY), thisScene.YUnit);
        }
        allElments[i].json.x = allElments[i].x;
        allElments[i].json.y = allElments[i].y;
        if (allElments[i].lon == x && allElments[i].lat == y) {
            allElments[i].selected = true;
        }

    }
}

//右键融合
var qxJson;
var smsJson;
function getRightClickMapMenu(scene, level) {
    var c3html = " <fieldset style='border-width: 0px'>线路信息<table border='0'  cellpadding='1' cellspacing='1' style='width: 600px'><tr>";
    for (var i = 1; i < scene.linJson.length; i++) {
        if (i != 0 && parseInt(i % 6) == 0) {
            c3html += "</tr><tr>";
        }
        c3html += " <td style='width: 100px'><a href='#' onclick='twourl(\"" + scene.linJson[i][i][0].ID + "\")'>" + scene.linJson[i][i][0].LINE_NAME + "</a></td><td style='width: 10px'></td>";
    }
    c3html += "</tr></table></fieldset>";

    if (getConfig("For6C") == "6C") {
        var bdsType = "3";
        bdsjson = scene.subJson;
        var html2 = " <fieldset style='border-width: 0px'>变电站信息<table border='0' cellpadding='1' cellspacing='1' style='width: 600px'><tr>";
        for (var i = 0; i < scene.subJson.length; i++) {
            if (i != 0 && parseInt(i % 5) == 0) {
                html2 += "</tr><tr>";
            }
            html2 += " <td style='width: 100px'><a href='#' onclick='serchObgmoveTo(" + scene.subJson[i].GIS_X + "," + scene.subJson[i].GIS_Y + ")' >" + scene.subJson[i].SUBSTATION_NAME + "</a></td><td style='width: 10px'></td>";
        }
        html2 += "</tr></table></fieldset>";
    }

    var qxType = "5";
    qxJson = scene.alarmJson;
    var alarmJsonHtml = " <fieldset style='border-width: 0px'>报警信息<table border='0'  cellpadding='1' cellspacing='1' style='width: 600px'><tr>";

    for (var k = 0; k < 6; k++) {

        var j = 0;
        var Chtml = "<br/><fieldset>" + (k + 1) + "C</fieldset><table border='0'  cellpadding='1' cellspacing='1' style='width: 550px'><tr>";
        if (scene.alarmJson != undefined) {
            for (var i = 0; i < scene.alarmJson.length; i++) {
                if (j != 0 && parseInt(j % 5) == 0) {
                    Chtml += "</tr><tr>";
                }
                if (scene.alarmJson[i].CATEGORY_CODE == (k + 1) + "C") {
                    Chtml += " <td style='width: 100px'><a href='#' onclick='serchObgmoveTo(" + scene.alarmJson[i].GIS_X + "," + scene.alarmJson[i].GIS_Y + ")' >" + scene.alarmJson[i].RAISED_TIME + "</a></td><td style='width: 10px'></td>";
                    j++;
                }
            }
        }
        Chtml += "</tr></table></fieldset>";

        if (j == 0)
        { } else {
            alarmJsonHtml += Chtml;
        }
    }
    alarmJsonHtml += "</tr></table>";
    alarmJsonHtml += "</fieldset>";

    var smsType = "1";
    smsJson = scene.smsJson;
    var smsJsonHtml = "";
    if (getConfig('IsCar') == "1") {
        smsJsonHtml = " <fieldset style='border-width: 0px'>设备信息<table border='0'  cellpadding='1' cellspacing='1' style='width: 600px'><tr>";
        for (var i = 0; i < scene.smsJson.length; i++) {
            if (i != 0 && parseInt(i % 5) == 0) {
                smsJsonHtml += "</tr><tr>";
            }
            smsJsonHtml += " <td style='width: 100px'><a href='#' onclick='serchObgmoveTo(" + scene.smsJson[i].GIS_X + "," + scene.smsJson[i].GIS_Y + ")' >" + scene.smsJson[i].TRAIN_NO + "</a></td><td style='width: 10px'></td>";
        }
        smsJsonHtml += "</tr></table></fieldset>";
    }
    if (getConfig("For6C") == "6C") {
        if (scene.subJson.length > 0) {
            c3html += html2;
        }
    }

    c3html += smsJsonHtml;
    c3html += alarmJsonHtml;

    c3html += "</tr></table><br></fieldset>";
    return c3html;
}

function getRightClickMapMenuAlarmTopo(scene, level) {
    var c3html = "";
    var qxType = "5";
    qxJson = scene.alarmJson;
    var alarmJsonHtml = " <fieldset style='border-width: 0px'>报警信息<table border='0'  cellpadding='1' cellspacing='1' style='width: 600px'><tr>";
    if (scene.AlarmTopo == "6CAlarmTopo") {
        for (var k = 0; k < 6; k++) {

            var j = 0;
            var Chtml = "<br/><fieldset>" + (k + 1) + "C</fieldset><table border='0'  cellpadding='1' cellspacing='1' style='width: 600px'><tr>";
            for (var i = 0; i < scene.alarmJson.length; i++) {
                if (j != 0 && parseInt(j % 5) == 0) {
                    Chtml += "</tr><tr>";
                }
                if (scene.alarmJson[i].CATEGORY_CODE == "C" + (k + 1)) {
                    Chtml += " <td style='width: 100px'><a href='#' onclick='serchObgmoveTo(" + scene.alarmJson[i].GIS_X + "," + scene.alarmJson[i].GIS_Y + ")' >" + scene.alarmJson[i].RAISED_TIME + "</a></td><td style='width: 10px'></td>";
                    j++;
                }
            }
            alarmJsonHtml += "</tr></table></fieldset>";
            if (j == 0)
            { } else {
                alarmJsonHtml += Chtml;
            }
        }
        alarmJsonHtml += "</fieldset>";

    } else {
        for (var i = 0; i < scene.alarmJson.length; i++) {
            if (i != 0 && parseInt(i % 5) == 0) {
                alarmJsonHtml += "</tr><tr>";
            }
            alarmJsonHtml += " <td style='width: 100px'><a href='#' onclick='serchObgmoveTo(" + scene.alarmJson[i].GIS_X + "," + scene.alarmJson[i].GIS_Y + ")' >" + scene.alarmJson[i].RAISED_TIME + "</a></td><td style='width: 10px'></td>";
        }
        alarmJsonHtml += "</tr></table></fieldset>";
    }
    var smsType = "1";
    smsJson = scene.smsJson;
    var smsJsonHtml = "";
    if (getConfig('IsCar') == "1") {
        smsJsonHtml = " <fieldset style='border-width: 0px'>设备信息<table border='0'  cellpadding='1' cellspacing='1' style='width: 600px'><tr>";
        for (var i = 0; i < scene.smsJson.length; i++) {
            if (i != 0 && parseInt(i % 5) == 0) {
                smsJsonHtml += "</tr><tr>";
            }
            smsJsonHtml += " <td style='width: 100px'><a href='#' onclick='serchObgmoveTo(" + scene.smsJson[i].GIS_X + "," + scene.smsJson[i].GIS_Y + ")' >" + scene.smsJson[i].TRAIN_NO + "</a></td><td style='width: 10px'></td>";
        }
        smsJsonHtml += "</tr></table></fieldset>";
    }
    c3html += smsJsonHtml;
    c3html += alarmJsonHtml;

    c3html += "</tr></table><br></fieldset>";
    return c3html;
}
//第一个页面JTOP
function oneurl(TopoStyle) {
    //window.close();
    window.location.href = "LogicTopo.html?TopoStyle=" + TopoStyle + "&Category_Code=" + GetQueryString('Category_Code') + '&v=' + version;
}
function ReopenOneurl(centerLon, centerLat, xunit, yunit, type, json, TopoStyle) {
    //window.close();
    window.location.href = "LogicTopo.html?centerLon=" + centerLon + "&centerLat=" + centerLat + "&xunit=" + xunit + "&yunit=" + yunit + "&type=" + type + "&json=" + json + "&TopoStyle=" + TopoStyle + '&v=' + version;
}
//第二个页面JTOP
function twourl(lineCode, TopoStyle) {
    if (lineCode == "") {
        lineCode = getCookieValue("LineCode");
    } else {

        addCookie("LineCode", lineCode, 1, "");
    }
    window.close();
    window.location.href = "TwoTopo.htm?LineCode=" + lineCode + "&TopoStyle=" + TopoStyle + '&v=' + version;
}
function ReopenTwourl(LineCode, centerLon, centerLat, xunit, yunit, type, json, TopoStyle) {
    addCookie("LineCode", LineCode, 1, "");
    //window.close();
    window.location.href = "TwoTopo.htm?LineCode=" + LineCode + "&centerLon=" + centerLon + "&centerLat=" + centerLat + "&xunit=" + xunit + "&yunit=" + yunit + "&type=" + type + "&json=" + json + "&TopoStyle=" + TopoStyle + '&v=' + version;
}
//第三个页面JTOP
function threeurl(positionName, positionCode, lineCode) {
    //window.close();
    window.location.href = "ThreeTopo.htm?positionName=" + escape(positionName) + "&positionCode=" + positionCode + "&lineCode=" + lineCode + '&v=' + version;
}
function ReopenThreeurl(positionName, positionCode, lineCode, centerLon, centerLat, xunit, yunit, kmmark) {
    //window.close();
    window.location.href = "ThreeTopo.htm?positionName=" + escape(positionName) + "&positionCode=" + positionCode + "&lineCode=" + lineCode + "&centerLon=" + centerLon + "&centerLat=" + centerLat + "&xunit=" + xunit + "&yunit=" + yunit + "&kmmark=" + kmmark + '&v=' + version;
}
//第四个页面JTOP
function alarmurl(centerLon, centerLat, xunit, yunit, type, json, TopoStyle) {
    //window.close();
    window.location.href = "AlarmTopo.htm?centerLon=" + centerLon + "&centerLat=" + centerLat + "&xunit=" + xunit + "&yunit=" + yunit + "&type=" + type + "&json=" + json + "&TopoStyle=" + TopoStyle + '&v=' + version;
}
//轨迹页面
function orbiturl(arrays) {
    var array = arrays.split(',');
    var deviceid = array[0];
    var centerLon = array[1];
    var centerLat = array[2];
    if (getCookieValue("TPSmall") == "small")
        window.parent.ShowMTwin("../../Jtopos/OrbitTopo.htm?deviceid=" + deviceid + "&centerLon=" + centerLon + "&centerLat=" + centerLat + '&v=' + version, "90", "90");
    else
        ShowWinOpen("OrbitTopo.htm?deviceid=" + deviceid + "&centerLon=" + centerLon + "&centerLat=" + centerLat + '&v=' + version);
}
function ReopenOrbit(deviceid, centerLon, centerLat, index, xunit, yunit) {
    //window.close();
    window.location.href = "OrbitTopo.htm?deviceid=" + deviceid + "&centerLon=" + centerLon + "&centerLat=" + centerLat + "&index=" + index + "&xunit=" + xunit + "&yunit=" + yunit + '&v=' + version;
}
function divClose() {
    $("#rightmenu").hide();
    $("#clickmenu").hide();
}