
/*========================================================================================*
* 功能说明：地图自定义控件类
* 注意事项：
* 作    者： wcg
* 版本日期：2013年5月13日
* 变更说明：
* 版 本 号： V1.0
*=======================================================================================*/
/************图片放大镜说明框**********************/
function getImage(imgName, position) {
    imgName = "#" + imgName;
    $(imgName).elevateZoom({ zoomWindowPosition: position });
}




/************正上方操作框****************/

//function bmapTopUserCbutton() {
//    this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
//    this.defaultOffset = new BMap.Size(400, 5);
//}

//bmapTopUserCbutton.prototype = new BMap.Control();

//bmapTopUserCbutton.prototype.initialize = function (map) {
//    var div = document.createElement("div");
//    div.style.cursor = "pointer";
//    div.style.border = "1px solid gray";
//    div.innerHTML = " <div class='nav-collapse collapse'><p class='navbar-text pull-center'></p></div>";
//    // 添加DOM 元素到地图中
//    map.getContainer().appendChild(div);
//    // 将DOM 元素返回
//    return div;
//}
/*******************右键菜单栏************************/
//第一层右键操作    *****开始*****
var menuOne;
var moveMap; //全局Map对象
var infoWindow; //展示的HTML
var maplevel;
var jcjson; //设备JSON
function getOneMapmenu(e, map) {
    AgainRefsetInterval(); //重启定时器
    moveMap = map;
    menuOne = new BMap.ContextMenu();
    maplevel = moveMap.maplevel;
    var jcType = "1"; //右键定位确定是否是设备
    jcjson = moveMap.c3json;
    var DivHeight = 0;
    if (moveMap.c3json != undefined) {
        DivHeight = parseInt(moveMap.c3json.length);
    }
    if (moveMap.Subjson != undefined) {
        DivHeight = parseInt(DivHeight) + parseInt(moveMap.Subjson.length);
    }
    if (moveMap.c3alarm != undefined) {
        DivHeight = parseInt(DivHeight) + parseInt(moveMap.c3alarm.length);
    }
    if (moveMap.lineCenterjson != undefined) {
        DivHeight = parseInt(moveMap.lineCenterjson.length);
    }
    if (DivHeight <= 18 && DivHeight > 10) {
        var html = " <a href='#' onclick='getchObgmoveTo()'>返回首页</a><br><div style='height:230px;overflow-y:auto;overflow-x:hidden;'>";
    } else if (DivHeight > 18) {
        var html = " <a href='#' onclick='getchObgmoveTo()'>返回首页</a><br><div style='height:255px;overflow-y:auto;overflow-x:hidden;'>";
    } else {
        var html = " <a href='#' onclick='getchObgmoveTo()'>返回首页</a><br><div style='height:200px;overflow-y:auto;overflow-x:hidden;'>";
    }
    var c3html = " <fieldset>设备信息<table  border='0' cellpadding='1' cellspacing='1' style='width: 550px'><tr>";
    if (moveMap.c3json != undefined) {
        for (var i = 0; i < moveMap.c3json.length; i++) {
            if (i != 0 && parseInt(i % 5) == 0) {
                c3html += "</tr><tr>";
            }
            c3html += " <td style='width: 100px'><a href='#' onclick='serchObgmoveTo(" + moveMap.c3json[i].GIS_X + "," + moveMap.c3json[i].GIS_Y + "," + jcType + "," + i + ")'>" + moveMap.c3json[i].TRAIN_NO + "</a></td><td style='width: 10px'></td>";
        }
    }
    c3html += "</tr></table></fieldset>";

    if (getConfig("For6C") == "6C") {
        var bdsType = "3";
        bdsjson = moveMap.Subjson;
        var html2 = " <fieldset>变电站信息<table border='0' cellpadding='1' cellspacing='1' style='width: 550px'><tr>";
        if (moveMap.Subjson != undefined) {
            for (var i = 0; i < moveMap.Subjson.length; i++) {
                if (i != 0 && parseInt(i % 5) == 0) {
                    html2 += "</tr><tr>";
                }
                html2 += " <td style='width: 100px'><a href='#' onclick='serchObgmoveTo(" + moveMap.Subjson[i].GIS_X + "," + moveMap.Subjson[i].GIS_Y + "," + bdsType + "," + i + ")' >" + moveMap.Subjson[i].SUBSTATION_NAME + "</a></td><td style='width: 10px'></td>";
            }
        }
        html2 += "</tr></table></fieldset>";
    }

    var qxType = "5";

    qxJson = moveMap.c3alarm;
    var c3AlarmHtml = " <fieldset>报警信息<table border='0'  cellpadding='1' cellspacing='1' style='width: 550px'><tr>";
    if (moveMap.c3alarm != undefined) {
        for (var i = 0; i < moveMap.c3alarm.length; i++) {
            if (i != 0 && parseInt(i % 5) == 0) {
                c3AlarmHtml += "</tr><tr style='line-height:20px;'>";
            }
            c3AlarmHtml += " <td style='width: 90px'><a href='#' onclick='serchObgmoveTo(" + moveMap.c3alarm[i].GIS_X + "," + moveMap.c3alarm[i].GIS_Y + "," + qxType + "," + i + ")' >" + moveMap.c3alarm[i].RAISED_TIME + "</a></td><td style='width: 10px'></td>";
        }
    }
    c3AlarmHtml += "</tr></table></fieldset>";
    if (getConfig("For6C") == "6C") {
        c3html += html2;
    }

    c3html += c3AlarmHtml;
    html += getRightClickMapMenu(moveMap, 1);
    html += c3html;

    html += " </div>";
    infoWindow = new BMap.InfoWindow(html);
    map.openInfoWindow(infoWindow, e.point);
}
//右键菜单融合
function getRightClickMapMenu(moveMap, type) {

    var c3html = "";
    c3html = " <fieldset>线路信息<table border='0'  cellpadding='1' cellspacing='1' style='width: 550px'><tr>";
    if (moveMap.lineCenterjson != undefined) {
        for (var i = 1; i < moveMap.lineCenterjson.length; i++) {
            if (i != 0 && parseInt(i % 6) == 0) {
                c3html += "</tr><tr>";
            }
            c3html += " <td style='width: 100px'><a href='#' onclick='getOneMapmenuToBmap(\"" + moveMap.lineCenterjson[i][i][0].LINE_NAME + "\")'>" + moveMap.lineCenterjson[i][i][0].LINE_NAME + "</a></td><td style='width: 10px'></td>";
        }
    }
    c3html += "</tr></table></fieldset>";
    //当前组织ID
    //    var orgId = "3";
    //    获取管辖下级的组织信息
    //    var orgjson = getMisOrgsPointsData(orgId);
    //    c3html += " <fieldset>管辖信息<table border='0'  cellpadding='1' cellspacing='1' style='width: 550px'><tr>";
    //    for (var i = 0; i < orgjson.length; i++) {
    //        if (i != 0 && parseInt(i % 5) == 0) {
    //            c3html += "</tr><tr>";
    //        }
    //        c3html += " <td style='width: 100px'><a href='#' onclick=''>" + orgjson[i].ORG_NAME + "</a></td><td style='width: 10px'></td>";
    //    }
    //    c3html += "</tr></table></fieldset>";
    return c3html;
}
//右键菜单返回首页
function getchObgmoveTo() {
    moveMap.level = "1";
    getMislineSCenterPoints(parseInt(getConfig('mapLevel')), moveMap);
    document.cookie = "C3Sms=0";
}

//搜索转换
function getOneMapmenuToBmap(linename) {
    document.cookie = "C3Sms=0";
    var lineId = ""; //
    if (moveMap.lineCenterjson != undefined) {
        for (var i = 1; i < moveMap.lineCenterjson.length; i++) {
            if (moveMap.lineCenterjson[i][i][0].LINE_NAME == linename) {
                lineId = moveMap.lineCenterjson[i][i][0].ID;
                break;
            }
        }
        if (lineId != "") {
            moveMap.clearOverlays();
            getMislineCenterPoints(lineId, maplevel, moveMap, "");
        }
    }
}
//第二层右键菜单
var menuTwo;
var bdsjson; //全局变量变电所对象信息
function getTwoMapmenu(e, map, maplevel, json) {
    // map.removeContextMenu(menuOne);
    moveMap = map;
    var zdType = "2"; //定义变电所 为右键所用
    var html = " <a href='#' onclick='getchObgmoveTo()'>返回首页</a><br><div style='height:400px;overflow-y:auto;'>";
    var html1 = " <fieldset>站点信息<table border='0'  cellpadding='1' cellspacing='1' style='width: 550px'><tr>";
    if (moveMap.positionjson != undefined) {
        for (var i = 0; i < moveMap.positionjson.length; i++) {
            if (i != 0 && parseInt(i % 5) == 0) {
                html1 += "</tr><tr>";
            }
            html1 += " <td style='width: 100px'><a href='#' onclick='serchObgmoveTo(" + moveMap.positionjson[i].startLongitude + "," + moveMap.positionjson[i].startLatitude + "," + zdType + ")' >" + moveMap.positionjson[i].StationSectionName + "</a></td><td style='width: 10px'></td>";
        }
    }
    html1 += "</tr></table></fieldset>";
    if (getConfig("For6C") == "6C") {
        var bdsType = "3";
        bdsjson = json[1];
        var html2 = " <fieldset>变电站信息<table border='0' cellpadding='1' cellspacing='1' style='width: 550px'><tr>";
        if (json[1] != undefined) {
            for (var i = 0; i < json[1].length; i++) {
                if (i != 0 && parseInt(i % 5) == 0) {
                    html2 += "</tr><tr>";
                }
                html2 += " <td style='width: 100px'><a href='#' onclick='serchObgmoveTo(" + json[1][i].GIS_X + "," + json[1][i].GIS_Y + "," + bdsType + "," + i + ")' >" + json[1][i].SUBSTATION_NAME + "</a></td><td style='width: 10px'></td>";
            }
        }
        html2 += "</tr></table></fieldset>";
    }

    var jcType = "1";
    jcjson = json[2];
    var html3 = " <fieldset>设备信息<table border='0' cellpadding='1' cellspacing='1' style='width: 550px'><tr>";
    if (json[2] != undefined) {
        for (var i = 0; i < json[2].length; i++) {
            if (i != 0 && parseInt(i % 5) == 0) {
                html3 += "</tr><tr>";
            }
            html3 += " <td style='width: 100px'><a href='#' onclick='serchObgmoveTo(" + json[2][i].GIS_X + "," + json[2][i].GIS_Y + "," + jcType + "," + i + ")'>" + json[2][i].TRAIN_NO + "</a></td><td style='width: 10px'></td>";
        }
    }
    html3 += "</tr></table></fieldset>";
    html += html1;
    if (getConfig("For6C") == "6C") {
        html += html2;
    }

    html += html3;
    html += getRightClickMapMenu(moveMap, 1);
    html += " </div>";
    infoWindow = new BMap.InfoWindow(html);
    map.openInfoWindow(infoWindow, e.point);
}
//全局变量为右键菜单支柱定位弹出
var zzjson;
//第三层右键菜单
function getThreeMapmenu(e, map, json) {
    moveMap = map;
    var zzType = "4";
    zzjson = json; //支柱对象JSON串
    var stationSectionName = "";
    if (json.length > 0) {
        stationSectionName = json[0].stationSection;
    }
    var html = "<a href='#' onclick='getchObgmoveTo()'>返回首页</a><br><div style='height:350px;overflow-y:auto;'> <fieldset>" + stationSectionName + "支柱信息<table  border='0' cellpadding='1' cellspacing='1' style='width: 550px'><tr>";
    if (json != undefined) {
        for (var i = 0; i < json.length; i++) {
            if (i != 0 && parseInt(i % 5) == 0) {
                html += "</tr><tr>";
            }
            html += " <td style='width: 13px'><a href='#' onclick='serchObgmoveTo(" + json[i].longitude + "," + json[i].latitude + "," + zzType + "," + i + ")' >" + json[i].poleCode + "</a></td><td style='width: 5px'></td>";
        }
    }
    html += "</tr></table></fieldset>" + getRightClickMapMenu(moveMap, 1) + "</div>";
    infoWindow = new BMap.InfoWindow(html);
    map.openInfoWindow(infoWindow, e.point);
}

//第二个页面的右键菜单
var qxJson;
function getQxMapmenu(map, e) {
    if (map.c3alarm != undefined) {
        if (map.c3alarm.length > 0) {
            moveMap = map;
            var qxType = "5";
            qxJson = map.c3alarm;
            var html = "<div style='height:350px;overflow-y:auto; width:550px'> <fieldset>缺陷信息";
            for (var k = 0; k < 6; k++) {

                var j = 0;
                var Chtml = "<br/><fieldset>" + (k + 1) + "C</fieldset><table border='0'  cellpadding='1' cellspacing='1' style='width: 550px'><tr>";
                for (var i = 0; i < map.c3alarm.length; i++) {
                    if (j != 0 && parseInt(j % 3) == 0) {
                        Chtml += "</tr><tr>";
                    }
                    if (map.c3alarm[i].CATEGORY_CODE == (k + 1) + "C") {
                        //Chtml += " <td style='width: 60px'><a href='#' onclick='serchObgmoveTo(" + map.c3alarm[0][i].GIS_X + "," + map.c3alarm[0][i].GIS_Y + "," + qxType + "," + i + ")' >" + map.c3alarm[0][i].POSITION_NAME + " " + map.c3alarm[0][i].BRG_TUN_NAME + " " + map.c3alarm[0][i].POLE_NUMBER + "</a></td><td style='width: 10px'></td>";
                        Chtml += " <td style='width: 60px'><a href='#' onclick='serchObgmoveTo(" + map.c3alarm[i].GIS_X + "," + map.c3alarm[i].GIS_Y + "," + qxType + "," + i + ")' >" + map.c3alarm[i].RAISED_TIME + "</a></td><td style='width: 10px'></td>";
                        j++;
                    }
                }
                Chtml += "</tr></table></fieldset>";
                if (j == 0)
                { } else {
                    html += Chtml;
                }
            }
            html += "</fieldset></div>";
            infoWindow = new BMap.InfoWindow(html);
            map.openInfoWindow(infoWindow, e.point);
        }
    } else {
        var html = "<div style='height:350px;overflow-y:auto; width:550px'> <fieldset>没有缺陷，请查询..........";
        html += "</fieldset></div>";
        infoWindow = new BMap.InfoWindow(html);
        map.openInfoWindow(infoWindow, e.point);
    }
}

//第二层C3右键菜单
var GJjson;
function getC3Mapmenu(e, map, json) {
    moveMap = map;
    var html = "<a href='#' onclick='getchObgmoveTo()'>返回首页</a><br><div style='height:280px;overflow-y:auto; width:550px;overflow-x:hidden;'>";
    var gjType = "6";
    GJjson = json;

    var c3html = "";
    if (json != undefined) {
        for (var j = 0; j < json.length; j++) {
            c3html += " <fieldset>" + json[j].SmsJson[0].TRAIN_NO + "检测轨迹信息<table border='0'  cellpadding='1' cellspacing='1' style='width: 550px'><tr>";
            for (var i = 0; i < json[j].SmsJson.length; i++) {
                if (i != 0 && parseInt(i % 3) == 0) {
                    c3html += "</tr><tr>";
                }
                c3html += " <td style='width: 90px'><a href=\"javascript:OpenMaker('" + json[j].SmsJson[i].GIS_X + "','" + json[j].SmsJson[i].GIS_Y + "','" + gjType + "','" + i + "','" + j + "')\" >" + json[j].SmsJson[i].DETECT_TIME + "</a></td><td style='width: 10px'></td>";
            }

            c3html += "</tr></table></fieldset>";
        }
    }
    var qxType = "5";

    var c3AlarmHtml = " <fieldset>报警信息<table border='0'  cellpadding='1' cellspacing='1' style='width: 550px'><tr>";
    qxJson = map.GJC3AlarmJson;
    if (map.GJC3AlarmJson != undefined) {
        for (var i = 0; i < map.GJC3AlarmJson.length; i++) {
            if (i != 0 && parseInt(i % 4) == 0) {
                c3AlarmHtml += "</tr><tr>";
            }
            c3AlarmHtml += " <td style='width: 90px'><a href='#' onclick='OpenMaker(" + map.GJC3AlarmJson[i].GIS_X + "," + map.GJC3AlarmJson[i].GIS_Y + "," + qxType + "," + i + ")' >" + map.GJC3AlarmJson[i].RAISED_TIME + "</a></td><td style='width: 10px'></td>";
        }
    }
    c3AlarmHtml += "</tr></table></fieldset>";

    html += c3html;
    html += c3AlarmHtml;
    html += " </div>";
    var infoWindow = new BMap.InfoWindow(html);
    moveMap.openInfoWindow(infoWindow, e.point);
}

//平移到查询点
function OpenMaker(x, y, type, tyepjson,number) {
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
        case "6":
            //短信右键
            getC3RightClickSmsOtherInfo(moveMap, GJjson[number].SmsJson[tyepjson]);
            break;
        default:
            break;
    }
}

//搜索线路
function getOneSearchResult(e, map) {
    var infoWindowOpts = {
        width: 300,     // 信息窗口宽度
        height: 400,     // 信息窗口高度
        title: "搜索线路"  // 信息窗口标题
    };
    var html = " <div id='r-result'>请输入:<br /><input type='text' id='suggestId' size='20' value='百度' style='width: 150px;' /></div><div id='searchResultPanel' style='border: 1px solid #C0C0C0; width: 150px; height: auto;'></div>";
    var infoWindow = new BMap.InfoWindow(html, infoWindowOpts);
    map.openInfoWindow(infoWindow);

    //鼠标放在下拉列表上的事件
    //    ac.addEventListener("onhighlight", function (e) {
    //        var str = "";
    //        var _value = e.fromitem.value;
    //        var value = "";
    //        if (e.fromitem.index > -1) {
    //            value = _value.province + _value.city + _value.district + _value.street + _value.business;
    //        }
    //        str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

    //        value = "";
    //        if (e.toitem.index > -1) {
    //            _value = e.toitem.value;
    //            value = _value.province + _value.city + _value.district + _value.street + _value.business;
    //        }
    //        str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
    //        document.getElementById("searchResultPanel").innerHTML = str;
    //    });
    //    var myValue;
    //    ac.addEventListener("onconfirm", function (e) {    //鼠标点击下拉列表后的事件
    //        var _value = e.item.value;
    //        myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
    //        document.getElementById("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;

    //        //setPlace();
    //    });
}
//第一层右键操作    *****结束*****
function getMapmenu(e) {
    var menu = new BMap.ContextMenu();
    var txtMenuItem = [{
        text: '查看上一级',
        callback: function () { map.zoomIn() }
    }, {
        text: '查看下一级',
        callback: function () { map.zoomOut() }
    }, {
        text: '放置到最初级',
        callback: function () { map.setZoom(18) }
    }];
    for (var i = 0; i < txtMenuItem.length; i++) {
        menu.addItem(new BMap.MenuItem(txtMenuItem[i].text, txtMenuItem[i].callback, 100));
        //        if (i == 1) {
        //            menu.addSeparator();
        //        }
    }
    this.addContextMenu(menu);
}
/*******************查询条件栏************************/
var serchMap;
function getMapSerch(map, level, maplevel) {
    var html;
    serchMap = map;
    switch (level) {
        case 1:
            html = "<div><table><tr> <td> <select id='obj_type'> <option value='0'>--请选择查询条件--</option><option value='1'>站场</option><option value='2'>变电站</option><option value='3'>C3设备</option></select>"
            html += "  </td><td><input id='obj_name' type='text' class='input-small'/></td>"
            html += "<td> <input  value='查询'  type='button' onclick='getMapSerchData(" + level + "," + maplevel + ")'/></td></tr></table></div>";
            break;
    }
    return html;
}
function getMapSerchData(level, maplevel) {
    var objName = document.getElementById("obj_name").value;
    var objType = document.getElementById("obj_type").value;
    if (objType != 0 && objName != "") {
        var url = "ASHX/BMapSerch.ashx?objName=" + encodeURIComponent(objName) + "&objType=" + objType + "&level=" + level + "";
        $.ajax({
            type: "POST",
            url: url,
            async: false,
            cache: false,
            success: function (result) {
                if (result != "") {
                    var json = eval('(' + result + ')');
                    var point = new BMap.Point(json[0].GIS_X, json[0].GIS_Y);    // 创建点坐标
                    serchMap.panTo(point);
                }
            }
        });
    }
}