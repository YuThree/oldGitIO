
var map = "";
var mapLevel = "";
var json_dicLevel;
var second = 30000; //信息框关闭时间
var PopTime = 10000; //信息框提示时间
var locoTime = 60000; //设备刷新时间
var time_outNomassage = 60//超过60分钟的，不弹提示框。
var LastStatusTime;//最后状态时间
var MinServerTime;


function bMapbind() {

    json_dicLevel = GetSeverityJson();

    //--------初始化地图--------//
    var type = getConfig('mapType'); //获取初始值是加载卫星地图还是一般地图
    //    if (type == "1") //卫星
    map = new BMap.Map("allmap", { mapType: BMAP_HYBRID_MAP }); // 创建Map实例
    //    else //地图
    // map = new BMap.Map("allmap", { mapType: BMAP_NORMAL_MAP }); // 创建Map实例
    mapLevel = getConfig('mapLevel'); //获取地图初始加载层次；

    var CenterLon = getCookieValue("CenterLon");
    if (CenterLon == "null" || CenterLon == "") {
        CenterLon = getConfig('CenterLon');
    }
    var CenterLat = getCookieValue("CenterLat");
    if (CenterLat == "null" || CenterLat == "") {
        CenterLat = getConfig('CenterLat');
    }
    var point = new BMap.Point(CenterLon, CenterLat);    // 创建点坐标
    map.centerAndZoom(point, mapLevel); // 初始化地图，设置中心点坐标和地图级别。
    map.clearOverlays();
    //---------加载数据---------//

    SetRefreshMap();
    if (FunEnable('Fun_SubStation') == "True" ) {
        getSubstationPoint();
    }


    //-------样式及地图屏蔽操作-------//
    map.enableScrollWheelZoom(true);

    map.enableKeyboard();
    map.disableDoubleClickZoom();
    map.addControl(bmapUserTopOneRightInfo);
    //  map.addControl(new BMap.OverviewMapControl());

    $('#map div.anchorBL').hide();
    var myStyleJson1 = [

          {
              "featureType": "water",
              "elementType": "all",
              "stylers": {
                  "color": "#021019"
              }
          },
          {
              "featureType": "highway",
              "elementType": "geometry.fill",
              "stylers": {
                  "color": "#000000"
              }
          },
          {
              "featureType": "highway",
              "elementType": "geometry.stroke",
              "stylers": {
                  "color": "#147a92"
              }
          },
          {
              "featureType": "arterial",
              "elementType": "geometry.fill",
              "stylers": {
                  "color": "#000000"
              }
          },
          {
              "featureType": "arterial",
              "elementType": "geometry.stroke",
              "stylers": {
                  "color": "#0b3d51"
              }
          },
          {
              "featureType": "local",
              "elementType": "geometry",
              "stylers": {
                  "color": "#000000"
              }
          },
          {
              "featureType": "land",
              "elementType": "all",
              "stylers": {
                  "color": "#08304b"
              }
          },
          {
              "featureType": "railway",
              "elementType": "all",
              "stylers": {
                  "color": "#1eaed7",
                  "lightness": 2,
                  "saturation": 91,
                  "visibility": "on"
              }

          },
          {
              "featureType": "subway",
              "elementType": "geometry",
              "stylers": {
                  "lightness": -70
              }
          },
          {
              "featureType": "building",
              "elementType": "geometry.fill",
              "stylers": {
                  "color": "#000000"
              }
          },
          {
              "featureType": "all",
              "elementType": "labels.text.fill",
              "stylers": {
                  "color": "#857f7f"
              }
          },
          {
              "featureType": "all",
              "elementType": "labels.text.stroke",
              "stylers": {
                  "color": "#000000"
              }
          },
          {
              "featureType": "building",
              "elementType": "geometry",
              "stylers": {
                  "color": "#022338"
              }
          },
          {
              "featureType": "green",
              "elementType": "geometry",
              "stylers": {
                  "color": "#062032"
              }
          },
          {
              "featureType": "boundary",
              "elementType": "all",
              "stylers": {
                  "color": "#1e1c1c"
              }
          },
          {
              "featureType": "highway",
              "elementType": "all",
              "stylers": {
                  "color": "#022338",
                  "visibility": "off"
              }
          },
          {
              "featureType": "arterial",
              "elementType": "all",
              "stylers": {
                  "visibility": "off"
              }
          },
          {
              "featureType": "local",
              "elementType": "all",
              "stylers": {
                  "visibility": "off"
              }
          },
          {
              "featureType": "subway",
              "elementType": "all",
              "stylers": {
                  "visibility": "off"
              }
          },
          {
              "featureType": "poi",
              "elementType": "all",
              "stylers": {
                  "visibility": "off"
              }
          },
          {
              "featureType": "label",
              "elementType": "labels.text.fill",
              "stylers": {
                  "color": "#f3f3f3",
                  "weight": "5.9",
                  "lightness": 13,
                  "saturation": 36,
                  "visibility": "on"
              }
          }

    ];
    map.setMapStyle({ styleJson: myStyleJson1 });
    map.setCurrentCity("武汉");   //由于有3D图，需要设置城市哦


    var bs = map.getBounds();   //返回地图可视区域
    var cr = new BMap.CopyrightControl({ anchor: BMAP_ANCHOR_TOP_LEFT });   //设置
    map.addControl(cr); //添加

    //  cr.addCopyright({ id: 1, content: "  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href='#' class='btn btn-primary' onclick='window.parent.closess()' style='background: #4A6F9C;color:White;margin-top: 10px;'>关闭</a>", bounds: bs });    //Copyright(id,content,bounds)类作为CopyrightControl.addCopyright()方法的参数


    map.addControl(new BMap.MapTypeControl({ anchor: BMAP_ANCHOR_TOP_RIGHT }));   //左上角，默认地图控件



    //setTimeout(function () {
    //    var animateText = new AnimateText(workPlaces.zhongguancun.center, "aaaaaa");
    //    map.addOverlay(animateText);

    //    var trafficLayer = new TrafficLayer({
    //        map: map
    //    });
    //    for (var key in workPlaces) trafficLayer.setStyle(key, {
    //        strokeStyle: workPlaces[key].strokeStyle,
    //        lineWidth: workPlaces[key].lineWidth
    //    });
    // //   trafficLayer.show(["zhongguancun"]);
    //    trafficLayer.ShowCircle(workPlaces.zhongguancun.center);

    //    $('#aside_list a[key="zhongguancun"]').addClass("current");
    //    $('#aside_list a[key="zhongguancun"]').addClass("current");


    //    var animateMarker = new AnimateMarker(workPlaces.zhongguancun.center, workPlaces.zhongguancun.name);
    //    map.addOverlay(animateMarker);



    //    setTimeout(function () {
    //        animateMarker.fadeOut()
    //    }, 1000)

    //}, 5000)




    //$("#aside_list").delegate("a", "click", function () {
    //    var e = ($(this).html(), $(this).attr("key")),
    //    t = workPlaces[e];
    //    $("#aside_list a").removeClass("current"),
    //    $(this).addClass("current"),
    //    e ? (trafficLayer.show([e]), animateMarker.show(), animateMarker.setPointAndText(t.center, t.name), setTimeout(function () {
    //        animateMarker.fadeOut()
    //    },
    //    2e3), map.centerAndZoom(t.center, 12)) : (trafficLayer.show(allKeys), map.centerAndZoom(new BMap.Point(116.404, 39.915), 12))
    //})

    //$(".aside_title").bind("touchend",function () {
    //    $("#aside_list").toggle("quick")
    //});


};




//function changeImgType() {
//    $("span[_cid='1']").parent().css('left', '10px').css('bottom', '10px');
//    $('#ImgTypeBox').show();
//}
function GetalarmList() {

    try {
        $("body", parent.document).find("#iframe_alarm").contents()[0].defaultView.GetList();

        ChangeLevel_Status();
    }
    catch (e) {
        setTimeout(GetalarmList, 500);
    }
};

function GetlocaList() {
    try {
        $("body", parent.document).find("#iframe_loca").contents()[0].defaultView.GetlocaList();
        CountLoco();
    }
    catch (e) {
        setTimeout(GetlocaList, 200);
    }
};


function CountLoco() {
    var locoN_all = C3Locojson.length;
    var locoN_my = 0;
    var locoN_overme = 0;

    for (var i = 0; i < C3Locojson.length; i++) {
        //自有,途经
        if (C3Locojson[i].type.indexOf("自有") > -1) {
            locoN_my++;
        }
        if (C3Locojson[i].type.indexOf("途经") > -1) {
            locoN_overme++;
        }
    }

    window.parent.SetLocoNumber(locoN_all, locoN_my, locoN_overme);





}

/************左上角悬浮说明框**********************/
//第一层
function bmapUserTopOneRightInfo() {
    // 设置默认停靠位置和偏移量
    this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
    this.defaultOffset = new BMap.Size(5, 5);
};

//*****************线路、站点****************//

function getBmapOnePoints(positionjson) {
    // var positionjson = getMislinePointsData(mislineid);
    var Points = new Array(positionjson.length);

    for (var i = 0; i < positionjson.length; i++) {
        var Point = new BMap.Point(positionjson[i].startLongitude, positionjson[i].startLatitude);
        if (GetQueryString("Type") == "FX") {

            Points[i] = Point;
            // var curve = new BMapLib.CurveLine(Points, { strokeColor: "blue", strokeWeight: 3, strokeOpacity: 0.5 }); //创建弧线对象


        } else {
            if (getCookieValue("GISSmall") == "small") {
                if (i == 0 || i == positionjson.length - 1) {
                    var labelMark = new BMap.Label(positionjson[i].StationSectionName, { point: Point });
                    labelMark.setStyle({
                        color: "white",
                        fontSize: "12px",

                        backgroundColor: "rgba(15,15,17,0)",
                        border: "0",
                        fontWeight: "bold"
                    });
                    labelMark.setOffset(new BMap.Size(-17, -17));
                    var icon = new BMap.Icon("/Common/MRTA/img/station.png", new BMap.Size(20, 30));
                    var marker = new BMap.Marker(Point, { icon: icon });
                    marker.setLabel(labelMark);
                    marker.type = "站点";
                    marker.setZIndex(1);
                    map.addOverlay(marker);
                }
            } else {
                if (positionjson[i].GIS_SHOW == '1') {
                    var labelMark = new BMap.Label(positionjson[i].StationSectionName, { point: Point });
                    labelMark.setStyle({
                        color: "white",
                        fontSize: "12px",

                        backgroundColor: "rgba(15,15,17,0)",
                        border: "0",
                        fontWeight: "bold"
                    });
                    labelMark.setOffset(new BMap.Size(-17, -17));
                    var icon = new BMap.Icon("/Common/MRTA/img/station.png", new BMap.Size(20, 30));
                    var marker = new BMap.Marker(Point, { icon: icon });
                    marker.setLabel(labelMark);
                    marker.type = "站点";

                    var Is_cb_station = $("body", parent.document).find("#cb_station").is(':checked');


                    if (Is_cb_station) {
                        marker.show();
                    } else {
                        marker.hide();
                    }

                    marker.setZIndex(1);
                    map.addOverlay(marker);
                    // marker.enableDragging(true);
                    // marker.setAnimation(BMAP_ANIMATION_BOUNCE);
                }
            }
            Points[i] = Point;

        }

        //    if (getCookieValue("GISSmall") == "small") {
        //        var blackline = new BMap.Polyline(Points, { strokeColor: "black", strokeWeight: 6, strokeOpacity: 0.5, strokeStyle: "solid" });
        //        var whiteline = new BMap.Polyline(Points, { strokeColor: "white", strokeWeight: 6, strokeOpacity: 0.8, strokeStyle: "dashed" });
        //    } else {
        //        var blackline = new BMap.Polyline(Points, { strokeColor: "black", strokeWeight: 8, strokeOpacity: 0.5, strokeStyle: "solid" });
        //        var whiteline = new BMap.Polyline(Points, { strokeColor: "white", strokeWeight: 8, strokeOpacity: 0.8, strokeStyle: "dashed" });
        //    }
        //    map.addOverlay(blackline);
        //    map.addOverlay(whiteline);
        //    blackline.addEventListener("click", function () {
        //        bMapTwobind(mislineid, map, maplevel);
        //    });
        //    whiteline.addEventListener("click", function () {
        //        bMapTwobind(mislineid, map, maplevel);
        //    });
    }
    if (GetQueryString("Type") == "FX") {
        var polyline = new BMap.Polyline(Points, { strokeColor: "red", strokeWeight: 6, strokeOpacity: 0.5 });   //创建折线
        map.addOverlay(polyline);   //增加折线
    }
};

///*****************报警*******************///
var maps;
var alarmJson;
var One_number = 0;
var Two_number = 0;
var Three_number = 0;

var new_number = 0;
var sure_number = 0;
var plan_number = 0;
var check_number = 0;
var close_number = 0;

var wc_number = 0;
var displayStr = "";
var jbJson;

//显示
function getDisplayStr(m) {

    var IScheckWC = $("body", parent.document).find("#cb_type4").is(':checked');

    // var IscheckSubstation = $("body", parent.document).find("#cb_substation").is(':checked');//变电所
    var IscheckSubstation_Jump = $("body", parent.document).find("#cb_substationJump").is(':checked');//跳闸
    var IscheckSubstation_normal = $("body", parent.document).find("#cb_substationNormal").is(':checked');//正常
    //m.代表变电所状态的值      是否变电所   跳闸状态
    //if (!IscheckSubstation && m.type == "stationPoint") {
    //    displayStr = "hide";
    //}
    if (!IscheckSubstation_Jump && m.json.ponint_type == "True") {
        displayStr = "hide";
    }
    if (!IscheckSubstation_normal && m.json.ponint_type == "False") {
        displayStr = "hide";
    }

    var IscheckType1 = $("body", parent.document).find("#cb_type1").is(':checked');
    var IscheckType2 = $("body", parent.document).find("#cb_type2").is(':checked');
    var IscheckType3 = $("body", parent.document).find("#cb_type3").is(':checked');

    var Ischeck_new = $("body", parent.document).find("#cb_new").is(':checked');
    var Ischeck_sure = $("body", parent.document).find("#cb_sure").is(':checked');
    var Ischeck_plan = $("body", parent.document).find("#cb_plan").is(':checked');
    var Ischeck_check = $("body", parent.document).find("#cb_check").is(':checked');
    var Ischeck_close = $("body", parent.document).find("#cb_close").is(':checked');

    if (!IscheckType1 && m.SEVERITY_Code == "一类") {
        displayStr = "hide";
    }

    if (!IscheckType2 && m.SEVERITY_Code == "二类") {
        displayStr = "hide";
    }

    if (!IscheckType3 && m.SEVERITY_Code == "三类") {
        displayStr = "hide";
    }

    if (!Ischeck_new && m.STATUS == "AFSTATUS01") {
        displayStr = "hide";
    }

    if (!Ischeck_sure && m.STATUS == "AFSTATUS03") {
        displayStr = "hide";
    }

    if (!Ischeck_plan && m.STATUS == "AFSTATUS04") {
        displayStr = "hide";
    }

    if (!Ischeck_check && m.STATUS == "AFSTATUS07") {
        displayStr = "hide";
    }

    if (!Ischeck_close && m.STATUS == "AFSTATUS05") {
        displayStr = "hide";
    }
    return displayStr;
}
//ico
function getIcoUrl(m) {
    //ico生成。
    var icoUrl = '/Common/MGIS/img/StatusLevel.png';
    switch (m.STATUS) {
        case 'AFSTATUS01':
            icoUrl = icoUrl.replace('Status', 'new');
            break;
        case 'AFSTATUS03':
            icoUrl = icoUrl.replace('Status', 'sure');
            break;
        case 'AFSTATUS04':
            icoUrl = icoUrl.replace('Status', 'plan');
            break;
        case 'AFSTATUS07':
            icoUrl = icoUrl.replace('Status', 'check');
            break;
        case 'AFSTATUS05':
            icoUrl = icoUrl.replace('Status', 'close');
            break;
    }

    switch (m.SEVERITY_Code) {
        case '一类':
            //   One_number++;
            icoUrl = icoUrl.replace('Level', '1');
            break;
        case '二类':
            //    Two_number++;
            icoUrl = icoUrl.replace('Level', '2');
            break;
        case '三类':
            //   Three_number++;
            icoUrl = icoUrl.replace('Level', '3');
            break;
    }
    return icoUrl;
}
//地图画点
function drawNewMarker(map, m, icoUrl, displayStr, _type) {
    var Point = new BMap.Point(m.GIS_X, m.GIS_Y);
    //                    markers.push(new BMap.Marker(Point));
    var icon = "";

    icon = new BMap.Icon(icoUrl, new BMap.Size(Ico_alarm_width, Ico_alarm_heigth));

    var marker = new BMap.Marker(Point, { icon: icon });
    //marker.setLabel(labelMark);
    map.addOverlay(marker);
    marker.disableDragging(true);
    marker.json = m;
    marker.type = "Alarm";
    marker.id = m.ID;
    marker.addEventListener("click", getC3AlarmInfo);
    marker.addEventListener("dblclick", getC3AlarmInfo2);
    if (displayStr != "" && _type == "") {
        marker.hide();
    } else {
        marker.show();
    }
    marker.setOffset(new BMap.Size(Ico_alarm_left, Ico_alarm_top));
    marker.setZIndex(10);
    return marker;
}
//设备报警点
function getMisC3AlarmPoint(json, map, deviceid, _lastTime, endTime, leNum, _line, _org, _OrgType, _locatype, _type, firstLoad) {



    jbJson = GetSeverityJson();
    //var firstLoad = true;
    var markers = [];

    if (firstLoad) {
        //初次加载
        map.c3alarm = json;
        alarmJson = json;
    }
    else {
        //更新地图
        firstLoad = false;
        markers = maps.markers;


    }
    //    map.c3alarm.splice(0, 0, a);

    maps = map;
    var markerClusterer;

    if (_lastTime != '') {
        document.cookie = "C3Alarm=" + _lastTime;
        LastStatusTime = _lastTime;
        MinServerTime = json.MinServerTime;
    }
    else {
        LastStatusTime = datehhssNowStr();
    }


    if (json != undefined && json.length > 0) {

        //判断是否初次加载
        if (firstLoad) {
            for (var i = 0; i < json.length; i++) {
                var m = json[i];
                if (m.CATEGORY_CODE == "6C") {
                    if (leNum == "3") { } else {
                        continue;
                    }
                }
                displayStr = getDisplayStr(m);
                var icoUrl = getIcoUrl(m);

                if (m.GIS_X != "0") {
                    var marker = drawNewMarker(map, m, icoUrl, displayStr, _type);
                    markers.push(marker);
                }
            }
        }
        else {

            var n_add = 0;
            var HTML = "<table style='line-height:20px;'>";

            for (var j = 0; j < json.length; j++) {
                var m = json[j];

                if (m.CATEGORY_CODE == "6C") {
                    if (leNum == "3") { } else {
                        continue;
                    }
                }
                displayStr = getDisplayStr(m);
                var icoUrl = getIcoUrl(m);

                var _index = GetAlarmMarkIndex(m);
                if (_index.toString().indexOf('#') > -1) {
                    //没找到,返回需要插入的位置index
                    var _insertIndex = _index.replace('#', '');
                    var _timeSpan = (new Date() - new Date(m.RAISED_TIME)) / 1000 / 60; //发生时间差。
                    if (_timeSpan > time_outNomassage ) {

                    }
                    else {
                        n_add++;
                        HTML += "<tr><td><a href='#' ondblclick=\"dblpopAlarm_id('" + m.ALARM_ID + "'," + i + ")\" onclick=\"clickpopAlarm_id('" + m.ALARM_ID + "'," + i + ")\">" + m.RAISED_TIME + "<td></tr>";
                    }


                    if (m.STATUS != 'AFSTATUS02') {
                        //不是取消的。才添加
                        var marker = drawNewMarker(map, m, icoUrl, displayStr, _type);
                        markers.splice(_insertIndex, 0, marker);
                        map.c3alarm.splice(_insertIndex, 0, m);
                    }

                }
                else {
                    // 找到返回index
                    //找到了，先删除
                    map.removeOverlay(markers[_index]);
                    markers.splice(_index, 1);
                    map.c3alarm.splice(_index, 1);

                    if (m.STATUS != 'AFSTATUS02') {
                        //不是取消的。才添加
                        var marker = drawNewMarker(map, m, icoUrl, displayStr, _type);
                        markers.splice(_index, 0, marker);
                        map.c3alarm.splice(_index, 0, m);
                    }

                }


            }

            HTML += "</table>";


            if (n_add > 0) {
                //遍历
                play_click(this, '/Common/MGIS/mp3/140_SCREAM.mp3');
                document.getElementById("winpop").style.display = "block";
                document.getElementById("AlarmSpan").innerHTML = HTML;
                setTimeout("hid_pop()", second); //30秒后自动关闭

            }



        }
        if (leNum == "3") {
            markerClusterer = new BMapLib.MarkerClusterer(map, { markers: markers });
        }


    }

    if (deviceid != "" && deviceid != null) {
        maps.markerClusterer = markerClusterer;
        maps.markers = markers;
    }
    if (leNum == "1") {
        maps.markerClusterer = markerClusterer;
        maps.markers = markers;
    }
    // window.parent.SetAlarmNumber(One_number, Two_number, Three_number, new_number, sure_number, plan_number, check_number, close_number);

    if (firstLoad) {
        //搜索，与初加载。
        GetalarmList();
    }
    else if (json != undefined && json.length > 0) {
        //监视更新。有数据变化才更新列表。

        filterMarks();

        GetalarmList();



    }



    alarmJson = map.c3alarm;
    return map.c3alarm;
};
GPSZH = function (point, num) {
    var icon = "";
    for (var j = 0; j < jbJson.length; j++) {
        if (alarmJson[num].SEVERITY == jbJson[j].name) {
            if (jbJson[j].code == "一类") {
                One_number++;
                icon = new BMap.Icon("/Common/MGIS/img/ico1.png", new BMap.Size(20, 20));
            }
            else if (jbJson[j].code == "二类") {
                Two_number++;
                icon = new BMap.Icon("/Common/MGIS/img/ico2.png", new BMap.Size(20, 20));
            }
            else if (jbJson[j].code == "三类") {
                Three_number++;
                icon = new BMap.Icon("/Common/MGIS/img/ico3.png", new BMap.Size(20, 20));
            }
        }
    }



    var Point = new BMap.Point(alarmJson[num].GIS_X, alarmJson[num].GIS_Y);
    var marker = new BMap.Marker(point, { icon: icon });
    maps.addOverlay(marker);
    marker.jsons = alarmJson[num];
    marker.type = "Alarm";
    if (displayStr != "" && _type == undefined) {
        marker.hide();
    } else {
        marker.show();
    }
    marker.addEventListener("click", getC3AlarmInfo);
};
WCGPSZH = function (point, num, icourl) {
    var icon = "";

    icon = new BMap.Icon(icourl, new BMap.Size(20, 20));

    var Point = new BMap.Point(alarmJson[num].GIS_X, alarmJson[num].GIS_Y);
    var marker = new BMap.Marker(point, { icon: icon });
    maps.addOverlay(marker);
    marker.jsons = alarmJson[num];
    // marker.type = "WC";
    if (displayStr != "" && _type == undefined) {
        marker.hide();
    } else {
        marker.show();
    }
    marker.addEventListener("click", getC3AlarmInfo);
};
function translate(point, type, callback, j, icourl) {
    var callbackName = 'cbk_' + Math.round(Math.random() * 10000);    //随机函数名
    var xyUrl = "http://api.map.baidu.com/ag/coord/convert?from=" + type + "&to=4&x=" + point.lng + "&y=" + point.lat + "&callback=BMap.Convertor." + callbackName;
    //动态创建script标签
    load_script(xyUrl);
    BMap.Convertor[callbackName] = function (xyResult) {
        delete BMap.Convertor[callbackName];    //调用完需要删除改函数
        var point = new BMap.Point(xyResult.x, xyResult.y);
        callback && callback(point, j, icourl);
    }
};



///****************机车*****************///
//画设备
var marker = "";
var C3Locojson; //设备JSON串
//参数说明：mislineid=线路CODE；map地图对象
function getMisC3Point(json, _org, _OrgType, _locatype) {
    map.c3json = json;
    // var json = getMisC3PointsData(mislineid, _org, _OrgType, _locatype);
    // if (C3Locojson == undefined) {
    if (json != undefined) {
        for (var i = 0; i < json.length; i++) {
            var Point = new BMap.Point(json[i].GIS_X, json[i].GIS_Y);

            var lable = json[i].TRAIN_NO;
            //  lable += "<br /> " + json[i].WZ;
            //if (json[i].CROSSING_NO != "" && json[i].CROSSING_NO != null) {
            //    lable += "<br /> " + json[i].CROSSING_NO + "号交路";
            //}

            //if (json[i].KM_MARK != "0") {
            //    lable += " K" + parseInt(json[i].KM_MARK / 1000) + "+" + parseInt(json[i].KM_MARK % 1000);
            //}

            // lable += "<br/>" + json[i].DETECT_TIME;
            var labelMark = new BMap.Label(lable, { point: Point });
            labelMark.setStyle(labelMark_style);
            labelMark.setOffset(new BMap.Size(-30, -21));
            // labelMark.setOffset(new BMap.Size(-30, -35));

            var icon;
            if (lable.split('CR').length > 1) {
                icon = new BMap.Icon(Ico_Loca_DC, new BMap.Size(Ico_Loca_Width, Ico_Loca_Height));
            } else {
                icon = new BMap.Icon(Ico_Loca_JC, new BMap.Size(Ico_Loca_Width, Ico_Loca_Height));


            }
            marker = new BMap.Marker(Point, { icon: icon });
            marker.setLabel(labelMark);
            map.addOverlay(marker);
            //marker.disableDragging(true);
            marker.jsons = json[i];
            marker.type = "Loco";

            var _isShow = $("body", parent.document).find('#cb_car')[0].checked;

            var LocoDispMode = $("body", parent.document).find('input[name="rd1"]:checked').val();

            if (!_isShow) {
                //没勾显示，全部隐藏。
                marker.hide();
            }
            else {

                if (LocoDispMode == '') {
                    //所有显示
                    // marker.show();
                }
                else {

                    if (marker.jsons.type.indexOf(LocoDispMode) > -1) {
                        //包含选中的值。
                        // marker.show();
                    }
                    else {
                        marker.hide();
                    }

                }




            }



            //if (displayStr != "" && _type == undefined) {
            //    marker.hide();
            //} else {
            //    marker.show();
            //}

            marker.addEventListener("click", getC3SmsInfo);
            marker.addEventListener("dblclick", getC3SmsInfo1);
            marker.setZIndex(5);
        }
    }
    //} else {

    //    if (json != undefined) {
    //        for (var i = 0; i < json.length; i++) {
    //            var Point = new BMap.Point(json[i].GIS_X, json[i].GIS_Y);
    //            var labelMark;
    //            var k = 0;
    //            for (var j = 0; j < C3Locojson.length; j++) {
    //                if (json[i].TRAIN_NO == C3Locojson[j].TRAIN_NO && json[i].DETECT_TIME == C3Locojson[j].DETECT_TIME) {
    //                    k = 1;
    //                }
    //            }
    //            if (k == 0) {
    //                var lable = json[i].TRAIN_NO;

    //                //if (json[i].CROSSING_NO != "" && json[i].CROSSING_NO != null) {
    //                //    lable += "<br /> " + json[i].CROSSING_NO + "号交路";
    //                //}
    //                //if (json[i].KM_MARK != "0") {
    //                //    lable += " K" + parseInt(json[i].KM_MARK / 1000) + "+" + parseInt(json[i].KM_MARK % 1000);
    //                //}

    //                //  lable += "<br/>" + json[i].DETECT_TIME;
    //                labelMark = new BMap.Label(lable, { point: Point });

    //                labelMark.setOffset(new BMap.Size(-20, -16));
    //            } else {

    //                labelMark = new BMap.Label(json[i].TRAIN_NO, { point: Point });
    //                labelMark.setOffset(new BMap.Size(-30, -21));
    //            }

    //            var icon;
    //            if (json[i].TRAIN_NO.split('CR').length > 1) {
    //                icon = new BMap.Icon(Ico_Loca_DC, new BMap.Size(Ico_Loca_Width, Ico_Loca_Height));
    //            } else {
    //                icon = new BMap.Icon(Ico_Loca_JC, new BMap.Size(Ico_Loca_Width, Ico_Loca_Height));


    //            }
    //            labelMark.setStyle(labelMark_style);

    //            marker = new BMap.Marker(Point, { icon: icon });
    //            marker.setLabel(labelMark);
    //            map.addOverlay(marker);
    //            marker.setZIndex(5);
    //            //marker.disableDragging(true);
    //            marker.jsons = json[i];
    //            marker.type = "Loco";
    //            marker.addEventListener("click", getC3SmsInfo);
    //            marker.addEventListener("dblclick", getC3SmsInfo1);
    //        }
    //    }
    //}

    C3Locojson = json;
    GetlocaList();
    return json;
};

function getC3AlarmInfo2(e) {

    id = this.json.ALARM_ID;
    url = "/C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=" + id + '&v=' + version;
    window.open(url, "_blank");

};

//选择告警
function getC3AlarmInfo(e) {


    if ($.browser.msie) {
        //IE         
        window.parent.frames["iframe_alarm"].ClickAlarm(this.json.ALARM_ID, 'GIS');
        window.parent.frames["iframe_alarm"].SetTop(this.json.ALARM_ID);


        window.parent.frames["iframe_alarm"].SetItemBox(this.json.ALARM_ID);
    }
    else {
        //FF                  
        $("body", parent.document).find("#iframe_alarm").contents()[0].defaultView.ClickAlarm(this.json.ALARM_ID, 'GIS');
        $("body", parent.document).find("#iframe_alarm").contents()[0].defaultView.SetTop(this.json.ALARM_ID);

        $("body", parent.document).find("#iframe_alarm").contents()[0].defaultView.SetItemBox(this.json.ALARM_ID);

        //  $("#Iframe2").contents()[0].defaultView.clickLoco(locaCode);
    }

};

//弹出框C3设备报警信息
function getC3ShopAlarmInfo(e, number) {
    SetAlarmGIS(e[number].ALARM_ID);
    window.parent.frames["iframe_alarm"].ClickAlarm(e[number].ALARM_ID);
    window.parent.frames["iframe_alarm"].SetItemBox(e[number].ALARM_ID);
};

//弹出框C3设备报警信息
function getC3ShopAlarmInfo1(e, number) {
    var id = e[number].ALARM_ID;
    url = "/C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=" + id + '&v=' + version;
    window.open(url, "_blank");
};

function clickpopAlarm_id(_id) {
    SetAlarmGIS(_id);
    window.parent.frames["iframe_alarm"].ClickAlarm(_id);
    window.parent.frames["iframe_alarm"].SetItemBox(_id);
};

function dblpopAlarm_id(_id) {
    //   var id = e[number].ALARM_ID;
    url = "/C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=" + _id + '&v=' + version;
    window.open(url, "_blank");
};

//选择机车
function getC3SmsInfo(e) {

    getC3SmsInfo2(this.jsons);
    if ($.browser.msie) {
        //IE         
        window.parent.frames["iframe_loca"].Setloca(this.jsons.TRAIN_NO);
    }
    else {
        //FF                  
        $("body", parent.document).find("#iframe_loca").contents()[0].defaultView.Setloca(this.jsons.TRAIN_NO);
        //  $("#Iframe2").contents()[0].defaultView.clickLoco(locaCode);
    }

    var point = new BMap.Point(this.jsons.GIS_X, this.jsons.GIS_Y);    // 创建点坐标
    map.panTo(point);
};
function getC3SmsInfo1(e) {
    var jsons= this.jsons
    var startdate = AddHours(parseDate(jsons.DETECT_TIME), -getConfig("TrackLength")).format("yyyy/MM/dd hh:mm:ss");
    var point = new BMap.Point(this.jsons.GIS_X, this.jsons.GIS_Y);    // 创建点坐标
    map.panTo(point);

    window.open("/Common/MGIS/OrbitGIS.htm?deviceid=" + jsons.TRAIN_NO + "&startdate=" + startdate + "&enddate=" + jsons.DETECT_TIME + "&jl=" + jsons.CROSSING_NO + "&Category_Code=3C&LINE_CODE=&DIRECTION=" + "&v=" + version);
    //window.open("/Common/MGIS/OrbitGIS.htm?deviceid=" + this.jsons.TRAIN_NO + "&startdate=&enddate=&Category_Code=3Cjl=&LINE_CODE=&DIRECTION=" + "&v=" + version);
};
function getC3SmsInfo11() {

    var date1 = parseDate(_DETECT_TIME);
    var date1_add = AddHours(date1, -getConfig("TrackLength"));
    var startdate = date1_add.format("yyyy/MM/dd hh:mm:ss");

    window.open("/Common/MGIS/OrbitGIS.htm?deviceid=" + _deviceid + "&startdate=" + startdate + "&enddate=" + _DETECT_TIME + "&jl=" + _CROSSING_NO + "&Category_Code=3C&LINE_CODE=&DIRECTION=" + "&v=" + version);
};
//重新设置新的中心点
function SetMapCenter(X, Y) {
    map.panTo(new BMap.Point(X, Y));
};
function GetAlarmJson() {
    return map.c3alarm;
};

function GetLocaJson() {
    return map.c3json;
};

var oldp = null;

//选择告警
function SetAlarmGIS(alarmID, Type) {

    var re = '';
    var overlays = map.getOverlays();
    //	alert(overlays.length);
    for (var i = 0; i < overlays.length; i++) {

        var m = overlays[i];
        //   re += "<br/>" + m.at;
        //	alert(m.at);
        if (m.type == "Alarm" && m.json.ALARM_ID == alarmID || m.type == "WC" && m.json.ALARM_ID == alarmID) {


            var p = m.getPosition();



            if (Type != 'GIS') {
                map.setCenter(p);
            }

            if (oldp != null) {
                oldp.setAnimation(null);
            }

            m.setAnimation(BMAP_ANIMATION_BOUNCE);
            //  m.setAnimation(BMAP_ANIMATION_DROP);


            oldp = m;
            break;

        }
    }


};

//站点筛选
function showStation(_isShow) {


    var overlays = map.getOverlays();
    //	alert(overlays.length);
    for (var i = 0; i < overlays.length; i++) {

        var m = overlays[i];
        if (m.type == "站点") {

            if (_isShow) {
                overlays[i].show();
            }
            else {
                overlays[i].hide();

            }

        }
    }

};

////设备筛选
//function showCar(_isShow) {


//    var overlays = map.getOverlays();
//    //	alert(overlays.length);
//    for (var i = 0; i < overlays.length; i++) {

//        var m = overlays[i];
//        if (m.type == "Loco") {

//            if (_isShow) {
//                overlays[i].show();
//            }
//            else {
//                overlays[i].hide();

//            }

//        }
//    }


//     $("body", parent.document).find("#iframe_loca").contents()[0].defaultView.showLoco(_isShow);//loca.htm


//};

//3C设备  _type  my我的  overme途经  all全部
function showCar_type(_isShow, _type) {


    var overlays = map.getOverlays();
    //	alert(overlays.length);
    for (var i = 0; i < overlays.length; i++) {

        var m = overlays[i];
        if (m.type == "Loco") {

            if (m.jsons.type.indexOf(_type) > -1 && _isShow) {
                overlays[i].show();
            }
            else {
                overlays[i].hide();

            }

        }
    }

    $("body", parent.document).find("#iframe_loca").contents()[0].defaultView.showLocoItem_class(_type, _isShow); //loca.htm

};

//// my自有  overme途经  all全部
//function showCar_typeModel(_v)
//{
//    var overlays = map.getOverlays();
//    //	alert(overlays.length);
//    for (var i = 0; i < overlays.length; i++) {      

//        var m = overlays[i];
//        if (m.type == "Loco") {

//            if (m.jsons.type.indexOf(_v) > -1) {
//                overlays[i].show();
//            }
//            else {
//                overlays[i].hide();
//            }

//        }

//    }

//    $("body", parent.document).find("#iframe_loca").contents()[0].defaultView.showLocoItem_class(_v,true);//loca.htm

//}



//等级筛选
//function showType(_type, _isShow) {

//    //new_number = 0, sure_number = 0, plan_number = 0, check_number = 0, close_number = 0;

//    var overlays = map.getOverlays();
//    //	alert(overlays.length);
//    for (var i = 0; i < overlays.length; i++) {



//        var m = overlays[i];



//        if (m.type == "Alarm" && m.json.SEVERITY == _type) {

//            var isCheckedStatus = false;
//            switch (m.json.STATUS) {
//                case 'AFSTATUS01':
//                    if (_isShow) {
//                        new_number++;
//                    } else {
//                        new_number--;
//                    }
//                    isCheckedStatus = $("body", parent.document).find("#cb_new").is(':checked');
//                    break;
//                case 'AFSTATUS03':
//                    if (_isShow) {
//                        sure_number++;
//                    } else {
//                        sure_number--;
//                    }
//                    isCheckedStatus = $("body", parent.document).find("#cb_sure").is(':checked');
//                    break;
//                case 'AFSTATUS04':
//                    if (_isShow) {
//                        plan_number++;
//                    } else {
//                        plan_number--;
//                    }
//                    isCheckedStatus = $("body", parent.document).find("#cb_plan").is(':checked');
//                    break;
//                case 'AFSTATUS07':
//                    if (_isShow) {
//                        check_number++;
//                    } else {
//                        check_number--;
//                    }
//                    isCheckedStatus = $("body", parent.document).find("#cb_check").is(':checked');
//                    break;
//                case 'AFSTATUS05':
//                    if (_isShow) {
//                        close_number++;
//                    } else {
//                        close_number--;
//                    }
//                    isCheckedStatus = $("body", parent.document).find("#cb_close").is(':checked');
//                    break;

//            }

//            if (_isShow && isCheckedStatus) {
//                overlays[i].show();
//             //   $("body", parent.document).find("#iframe_alarm").contents()[0].defaultView.showItem(m.json.ALARM_ID, true);

//            }
//            else {

//                overlays[i].hide();
//            //    $("body", parent.document).find("#iframe_alarm").contents()[0].defaultView.showItem(m.json.ALARM_ID, false);

//            }

//        }
//    }
//    window.parent.SetAlarmNumber(One_number, Two_number, Three_number, new_number, sure_number, plan_number, check_number, close_number);

//};


////状态筛选
//function showStatus(_status, _isShow) {


//    var overlays = map.getOverlays();
//    for (var i = 0; i < overlays.length; i++) {
//        var m = overlays[i];

//        if (m.type == "Alarm" && m.json.STATUS == _status) {

//            var isCheckedType = false;
//            switch (GetSeverityCode2(m.json.SEVERITY, json_dicLevel)) {
//                case '一类':
//                    isCheckedType = $("body", parent.document).find("#cb_type1").is(':checked');
//                    break;
//                case '二类':
//                    isCheckedType = $("body", parent.document).find("#cb_type2").is(':checked');
//                    break;
//                case '三类':
//                    isCheckedType = $("body", parent.document).find("#cb_type3").is(':checked');
//                    break;

//            }



//            if (_isShow && isCheckedType) {
//                overlays[i].show();
//                //if (m.type == "Alarm") {
//                //    $("body", parent.document).find("#iframe_alarm").contents()[0].defaultView.showItem(m.json.ALARM_ID, true);
//                //}
//            }
//            else {
//                overlays[i].hide();

//                //if (m.type == "Alarm") {
//                //    $("body", parent.document).find("#iframe_alarm").contents()[0].defaultView.showItem(m.json.ALARM_ID, false);
//                //}
//            }
//        }
//    }
//};

var IDs_show;
var IDs_hide;
function ChangeLevel_Status() {

    //    var ck_dom = $("body", parent.document).find("#legend :checkbox");
    var json = GetSeverityJson(); //缺陷级别集合
    var jbJson = []; //缺陷级别CODE数组
    for (var i = 0; i < json.length; i++) {
        jbJson.push({});
        jbJson[i].code = json[i].code;
        jbJson[i].count = 0;
    }
    //    var cb_type1 = $("body", parent.document).find("#cb_type1").is(':checked');
    //    var cb_type2 = $("body", parent.document).find("#cb_type2").is(':checked');
    //    var cb_type3 = $("body", parent.document).find("#cb_type3").is(':checked');

    //    One_number = 0;
    //    Two_number = 0;
    //    Three_number = 0;

    new_number = 0;
    sure_number = 0;
    plan_number = 0;
    check_number = 0;
    close_number = 0;

    wc_number = 0;

    IDs_show = '';
    IDs_hide = '';

    var overlays = map.getOverlays();
    for (var i = 0; i < overlays.length; i++) {
        var m = overlays[i];

        if (m.type != "Alarm") continue;//如果不是报警则跳过

        //遍历报警级别
        for (var j = 0; j < jbJson.length; j++) {
            if (jbJson[j].code == m.json.SEVERITY_Code) {
                jbJson[j].count = jbJson[j].count + 1;
                if ($("body", parent.document).find("#legend :checkbox[code='" + jbJson[j].code + "']").is(':checked')) {
                    ChangeLevel_Status_StatusCreate(m);
                }
                else {
                    m.hide();
                }
                break;
            }
        }
    }

    window.parent.SetAlarmNumber(jbJson, new_number, sure_number, plan_number, check_number, close_number);


    $("body", parent.document).find("#iframe_alarm").contents()[0].defaultView.showIDs(IDs_show);

}

function ChangeLevel_Status_StatusCreate(m) {

    var cb_new = $("body", parent.document).find("#cb_new").is(':checked');
    var cb_sure = $("body", parent.document).find("#cb_sure").is(':checked');
    var cb_plan = $("body", parent.document).find("#cb_plan").is(':checked');
    var cb_check = $("body", parent.document).find("#cb_check").is(':checked');
    var cb_close = $("body", parent.document).find("#cb_close").is(':checked');

    var _isShow = false;



    m.show();
    //$("body", parent.document).find("#iframe_alarm").contents()[0].defaultView.showItem(m.json.ALARM_ID, true);


    if (m.type == "Alarm" && m.json.STATUS == "AFSTATUS01") {
        new_number++;
        if (cb_new) {
            _isShow = true;
        }
    }

    if (m.type == "Alarm" && m.json.STATUS == "AFSTATUS03") {
        sure_number++;
        if (cb_sure) {
            _isShow = true;
        }
    }

    if (m.type == "Alarm" && m.json.STATUS == "AFSTATUS04") {
        plan_number++;
        if (cb_plan) {
            _isShow = true;
        }
    }

    if (m.type == "Alarm" && m.json.STATUS == "AFSTATUS07") {
        check_number++;
        if (cb_check) {
            _isShow = true;
        }
    }

    if (m.type == "Alarm" && m.json.STATUS == "AFSTATUS05") {
        close_number++;
        if (cb_close) {
            _isShow = true;
        }
    }

    if (_isShow) {
        m.show();

        if (IDs_show == '') {
            IDs_show = "#" + m.json.ALARM_ID;
        }
        else {
            IDs_show += ",#" + m.json.ALARM_ID;
        }

        // $("body", parent.document).find("#iframe_alarm").contents()[0].defaultView.showItem(m.json.ALARM_ID, true);
    }
    else {
        m.hide();
        //  $("body", parent.document).find("#iframe_alarm").contents()[0].defaultView.showItem(m.json.ALARM_ID, false);
    }


    // $("body", parent.document).find("#iframe_alarm").contents()[0].defaultView.GetList();

}


function GetAlarm(id) {
    var url = "/C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=";
    url = url + id + "";

    url += "&rsurl=no";
    window.open(url + '&v=' + version, "_blank");
};
//选择机车
function SetLocaGIS(LocaID) {
    var Point = "";
    for (var i = 0; i < map.c3json.length; i++) {

        if (map.c3json[i].TRAIN_NO == LocaID) {
            Point = new BMap.Point(map.c3json[i].GIS_X, map.c3json[i].GIS_Y);
        }
    }
    if (Point != "") {
        map.panTo(Point);
    }
};


//------------------------刷新GIS
//消息提示框


function AgainRefsetInterval() {


    setTimeout(function () {
        show_pop();
    }, PopTime);

    setTimeout(function () {
        refushLocos();
    }, locoTime);

};

var i = 0;
function show_pop() {

    refushAlarm(false);

    setTimeout(function () {
        show_pop();
    }, PopTime);

    return;


    //var alarmtime = "";
    //var strCookie = document.cookie;
    //var arrCookie = strCookie.split(";");
    //for (var i = 0; i < arrCookie.length; i++) {

    //    var arr = arrCookie[i].split("=");
    //    if (arr[0].replace(/[ ]/g, "") == "C3Alarm") {
    //        alarmtime = arr[1];
    //    }
    //}
    //var _org = $("#OrgCode", window.parent.document).html().trim();
    //var _line = $("#LineCode", window.parent.document).html().trim();
    //var _locatype = $("#LocoCode", window.parent.document).html().trim();
    //var _OrgType = $("#OrgType", window.parent.document).html().trim();

    //var _deviceID = $("body", parent.document).find("#iframe_loca").contents()[0].defaultView.GetLocaTxt();


    //var _url = "/Common/MGIS/ASHX/Cue/Cue.ashx?Time=" + alarmtime + "&Category_Code=" + GetQueryString("Category_Code") + '&_org=' + escape(_org) + '&_line=' + escape(_line) + '&_locatype=' + escape(_locatype) + '&_OrgType=' + escape(_OrgType) + '&_deviceID=' + escape(_deviceID) + '&type=Alarm&temp=' + Math.random();
    //// responseData = XmlHttpHelper.transmit(false, "get", "text", _url, null, null);

    //$.ajax({
    //    type: "GET",
    //    url: _url,
    //    async: true,
    //    cache: false,
    //    success: function (responseData) {
    //        var responseDatalist = responseData.split('!@#');
    //        if (responseDatalist[0] > 0) {
    //            refushAlarm(false);
    //            play_click(this, '/Common/MGIS/mp3/140_SCREAM.mp3');
    //            document.getElementById("winpop").style.display = "block";
    //            document.getElementById("AlarmSpan").innerHTML = responseDatalist[1];
    //            setTimeout("playhid_pop()", second); //30秒后自动关闭
    //            i++;
    //            xmlHttp = null;
    //        }
    //        xmlHttp = null;
    //        responseData = null;

    //        setTimeout(function () {
    //            show_pop();
    //        }, PopTime);

    //    }
    //});
};

function hid_pop() {//隐藏窗口
    var div = document.getElementById('div1');
    div.innerHTML = "";
    document.getElementById("winpop").style.display = "none";
};
function playhid_pop() {//
    var div = document.getElementById('div1');
    div.innerHTML = "";
};

//播放声音
function play_click(sef, url) {
    var div = document.getElementById('div1');
    div.innerHTML = '<embed src="' + url + '" loop="0" starttime="00:10" autostart="true" hidden="false"></embed>';
    var emb = document.getElementsByTagName('EMBED')[0];
    if (emb) {
        /* 这里可以写成一个判断 wav 文件是否已加载完毕，以下采用setTimeout模拟一下 */
        div = document.getElementById('div2');
        div.innerHTML = 'loading: ' + emb.src;
        sef.disabled = true;
        setTimeout(function () { div.innerHTML = ''; }, 1000);
    }
};

//刷新缺陷
function refushAlarm(firstLoad) {


    var _org = $("#OrgCode", window.parent.document).html().trim();
    var _line = $("#LineCode", window.parent.document).html().trim();
    var _locatype = $("#LocoCode", window.parent.document).html().trim();
    var _OrgType = $("#OrgType", window.parent.document).html().trim();


    //重画缺陷
    _deviceID = $("body", parent.document).find("#iframe_loca").contents()[0].defaultView.GetLocaTxt();

    var alarmtime = "";
    var strCookie = document.cookie;
    var arrCookie = strCookie.split(";");
    for (var i = 0; i < arrCookie.length; i++) {

        var arr = arrCookie[i].split("=");
        if (arr[0].replace(/[ ]/g, "") == "C3Alarm") {
            alarmtime = arr[1];
        }
    }

    getMisC3AlarmPointsData(map, _deviceID, alarmtime, '', "1", _line, _org, _OrgType, _locatype, "", "", firstLoad)


};

//自动刷新设备
function refushLocos(reload) {
    //var smstime = "";
    //var strCookie = document.cookie;
    //var arrCookie = strCookie.split(";");
    //for (var i = 0; i < arrCookie.length; i++) {

    //    var arr = arrCookie[i].split("=");
    //    if (arr[0].replace(/[ ]/g, "") == "C3Sms") {
    //        smstime = arr[1];
    //    }
    //}

    if (reload == undefined)
        reload = false; //强制刷新


    var _org = $("#OrgCode", window.parent.document).html().trim();
    var _line = $("#LineCode", window.parent.document).html().trim();
    var _locatype = $("#LocoCode", window.parent.document).html().trim();
    var _OrgType = $("#OrgType", window.parent.document).html().trim();

    var _deviceID = $("body", parent.document).find("#iframe_loca").contents()[0].defaultView.GetLocaTxt();

    //responseData = XmlHttpHelper.transmit(false, "get", "text", "/Common/MGIS/ASHX/Cue/Cue.ashx?Time=" + smstime + "&Category_Code=" + GetQueryString("Category_Code") + '&_org=' + escape(_org) + '&_line=' + escape(_line) + '&_locatype=' + escape(_locatype) + '&_OrgType=' + escape(_OrgType) + '&_deviceID=' + escape(_deviceID) + '&type=Loco&temp=' + Math.random(), null, null);
    //var responseDatalist = responseData;
    //if (responseDatalist > 0 || key != "") {




    //重画设备
    // getMisC3PointsData(_line, _org, _OrgType, _locatype);

    getMisC3PointsData_call({
        mislineid: _line, //必须
        org: _org, //必须      
        OrgType: _OrgType, //必须
        locatype: _locatype,
        key: _deviceID,
        Callback: function (json) {

            if (json != undefined && json.length > 0) {

                var _fristTime = $("body", parent.document).find("#iframe_loca").contents()[0].defaultView.GetNewTime();

                if (_fristTime != json[0].DETECT_TIME || reload) {

                    //清除
                    for (var j = 0; j < map.getOverlays().length; j++) {
                        if (map.getOverlays()[j].type == "Loco") {
                            map.removeOverlay(map.getOverlays()[j]);
                            j--;
                        }
                    }


                    getMisC3Point(json, _org, _OrgType, _locatype);

                    GetlocaList();

                }

                setTimeout(function () {
                    refushLocos();
                }, locoTime);


            }
            else {
                for (var j = 0; j < map.getOverlays().length; j++) {
                    if (map.getOverlays()[j].type == "Loco") {
                        map.removeOverlay(map.getOverlays()[j]);
                        j--;
                    }
                }

                map.c3json = [];
                GetlocaList();
            }

        }
    })






    //}
};

//自动刷新设备 ----- 未实现
function getMisC3Pointreflesh(mapss) {
    RefushLoco(mapss);
};


function SetRefreshMap() {

    map.clearOverlays();

    var _org = $("#OrgCode", window.parent.document).html().trim();
    var _line = $("#LineCode", window.parent.document).html().trim();
    var _locatype = $("#LocoCode", window.parent.document).html().trim();
    var _OrgType = $("#OrgType", window.parent.document).html().trim();



    //设备
    var c3json; //= getMisC3Point("", map);
    if (getConfig('IsCar') == "1") {
        getMisC3PointsData(_line, _org, _OrgType, _locatype);  // getMisC3PointsData(mislineid, _org, _OrgType, _locatype)

        //  document.cookie = "C3Sms=" + datehhssNowStr();
    } else {
        //   document.cookie = "C3Sms=" + "";
    }

    //报警
    getMisC3AlarmPointsData(map, "", "", "", "1", _line, _org, _OrgType, _locatype, "", "", true);
    // getMisC3AlarmPointsData(map, deviceid, startTime, endTime, LeNum, lineCode, _org, _OrgType, _locatype, severity, status)



    //  getPostionData(_line, _org, _OrgType)



    ////获取线路
    //if (getConfig('IsLine') == "1") {
    //    getMislineSCenterPointsData("", "", "", mapLevel, map);
    //}

};




function QXbMapbind(_org, _line, _locatype, _OrgType) {
    //--------初始化地图--------//
    var type = getConfig('mapType'); //获取初始值是加载卫星地图还是一般地图
    //    if (type == "1") //卫星
    map = new BMap.Map("allmap", { mapType: BMAP_HYBRID_MAP }); // 创建Map实例
    //    else //地图
    //  map = new BMap.Map("allmap", { mapType: BMAP_NORMAL_MAP }); // 创建Map实例
    var mapLevel = getConfig('mapLevel'); //获取地图初始加载层次；

    var CenterLon = getCookieValue("CenterLon");
    if (CenterLon == "null" || CenterLon == "") {
        CenterLon = getConfig('CenterLon');
    }
    var CenterLat = getCookieValue("CenterLat");
    if (CenterLat == "null" || CenterLat == "") {
        CenterLat = getConfig('CenterLat');
    }
    var point = new BMap.Point(CenterLon, CenterLat);    // 创建点坐标
    map.centerAndZoom(point, mapLevel); // 初始化地图，设置中心点坐标和地图级别。
    map.clearOverlays();
    //---------加载数据---------//

    var lineCenterjson = getMislineSCenterPointsData(_line, _org, _OrgType); //获取线路
    for (var i = 1; i < lineCenterjson.length; i++) {
        if (lineCenterjson[i][i][0].ID != "") {
            getBmapOnePoints(lineCenterjson[i][i][0].ID, mapLevel, map);
        }

    }
    One_number = 0;
    Two_number = 0;
    Three_number = 0;

    new_number = 0;
    sure_number = 0;
    plan_number = 0;
    check_number = 0;
    close_number = 0;

    wc_number = 0;
    //报警
    var c3alarm = getMisC3AlarmPoint(map, "", QdatehhssNowStr(), datehhssNowStr(), "1", _line, _org, _OrgType, _locatype, 'show', true);
    if (c3alarm.length > 0)
        document.cookie = "C3Alarm=" + c3alarm[0].RAISED_TIME;
    else
        document.cookie = "C3Alarm=";

    if (GetQueryString("ISCar") == "1") {
        var c3json = getMisC3Point(_line, _org, _OrgType, _locatype);
        document.cookie = "C3Sms=" + datehhssNowStr();
    }



    //-------样式及地图屏蔽操作-------//
    map.enableScrollWheelZoom(true);

    map.enableKeyboard();
    map.disableDoubleClickZoom();
    map.addControl(bmapUserTopOneRightInfo);
    map.addControl(new BMap.OverviewMapControl());

    $('#map div.anchorBL').hide();
    var myStyleJson1 = [

          {
              "featureType": "water",
              "elementType": "all",
              "stylers": {
                  "color": "#021019"
              }
          },
          {
              "featureType": "highway",
              "elementType": "geometry.fill",
              "stylers": {
                  "color": "#000000"
              }
          },
          {
              "featureType": "highway",
              "elementType": "geometry.stroke",
              "stylers": {
                  "color": "#147a92"
              }
          },
          {
              "featureType": "arterial",
              "elementType": "geometry.fill",
              "stylers": {
                  "color": "#000000"
              }
          },
          {
              "featureType": "arterial",
              "elementType": "geometry.stroke",
              "stylers": {
                  "color": "#0b3d51"
              }
          },
          {
              "featureType": "local",
              "elementType": "geometry",
              "stylers": {
                  "color": "#000000"
              }
          },
          {
              "featureType": "land",
              "elementType": "all",
              "stylers": {
                  "color": "#08304b"
              }
          },
          {
              "featureType": "railway",
              "elementType": "all",
              "stylers": {
                  "color": "#1eaed7",
                  "lightness": 2,
                  "saturation": 91,
                  "visibility": "on"
              }

          },
          {
              "featureType": "subway",
              "elementType": "geometry",
              "stylers": {
                  "lightness": -70
              }
          },
          {
              "featureType": "building",
              "elementType": "geometry.fill",
              "stylers": {
                  "color": "#000000"
              }
          },
          {
              "featureType": "all",
              "elementType": "labels.text.fill",
              "stylers": {
                  "color": "#857f7f"
              }
          },
          {
              "featureType": "all",
              "elementType": "labels.text.stroke",
              "stylers": {
                  "color": "#000000"
              }
          },
          {
              "featureType": "building",
              "elementType": "geometry",
              "stylers": {
                  "color": "#022338"
              }
          },
          {
              "featureType": "green",
              "elementType": "geometry",
              "stylers": {
                  "color": "#062032"
              }
          },
          {
              "featureType": "boundary",
              "elementType": "all",
              "stylers": {
                  "color": "#1e1c1c"
              }
          },
          {
              "featureType": "highway",
              "elementType": "all",
              "stylers": {
                  "color": "#022338",
                  "visibility": "off"
              }
          },
          {
              "featureType": "arterial",
              "elementType": "all",
              "stylers": {
                  "visibility": "off"
              }
          },
          {
              "featureType": "local",
              "elementType": "all",
              "stylers": {
                  "visibility": "off"
              }
          },
          {
              "featureType": "subway",
              "elementType": "all",
              "stylers": {
                  "visibility": "off"
              }
          },
          {
              "featureType": "poi",
              "elementType": "all",
              "stylers": {
                  "visibility": "off"
              }
          },
          {
              "featureType": "label",
              "elementType": "labels.text.fill",
              "stylers": {
                  "color": "#ffffff",
                  "visibility": "on"
              }
          }

    ];
    map.setMapStyle({ styleJson: myStyleJson1 });
    map.setCurrentCity("武汉");   //由于有3D图，需要设置城市哦
    var cr = new BMap.CopyrightControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT });
    map.addControl(cr); //添加版权控件
    cr.addCopyright({ id: 1, content: "<a href='http://www.railwaytec.com'></a>" });
    //    if (getCookieValue("GISSmall") == "small") {
    //        map.addControl(new BMap.MapTypeControl({ anchor: BMAP_ANCHOR_TOP_RIGHT }));   //左上角，默认地图控件

    //        var cr = new BMap.CopyrightControl({ anchor: BMAP_ANCHOR_TOP_LEFT });   //设置
    //        map.addControl(cr); //添加

    //        var bs = map.getBounds();   //返回地图可视区域
    //        cr.addCopyright({ id: 1, content: "  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href='#' class='btn btn-primary' onclick=' MonitorindexJtopo()' style='background: #4A6F9C;color:White;'>拓扑模式</a>", bounds: bs });    //Copyright(id,content,bounds)类作为CopyrightControl.addCopyright()方法的参数

    //    } else {
    map.addControl(new BMap.MapTypeControl({ anchor: BMAP_ANCHOR_TOP_RIGHT }));   //左上角，默认地图控件
    //}
};



///----------------------缺陷分析统计
function FXBMapbind() {
    //--------初始化地图--------//
    var type = getConfig('mapType'); //获取初始值是加载卫星地图还是一般地图
    //    if (type == "1") //卫星
    //        map = new BMap.Map("allmap", { mapType: BMAP_HYBRID_MAP }); // 创建Map实例
    //    else //地图
    map = new BMap.Map("allmap", { mapType: BMAP_NORMAL_MAP }); // 创建Map实例
    var mapLevel = getConfig('mapLevel'); //获取地图初始加载层次；

    var CenterLon = getCookieValue("CenterLon");
    if (CenterLon == "null" || CenterLon == "") {
        CenterLon = getConfig('CenterLon');
    }
    var CenterLat = getCookieValue("CenterLat");
    if (CenterLat == "null" || CenterLat == "") {
        CenterLat = getConfig('CenterLat');
    }
    var point = new BMap.Point(CenterLon, CenterLat);    // 创建点坐标
    map.centerAndZoom(point, mapLevel); // 初始化地图，设置中心点坐标和地图级别。
    map.clearOverlays();
    //---------加载数据---------//

    var lineCenterjson = getMislineSCenterPointsData("", "", ""); //获取线路
    for (var i = 1; i < lineCenterjson.length; i++) {
        if (lineCenterjson[i][i][0].ID != "") {
            getBmapOnePoints(lineCenterjson[i][i][0].ID, mapLevel, map);
        }

    }
    if (map.getZoom() == 8) {

    }



    //-------样式及地图屏蔽操作-------//
    map.enableScrollWheelZoom(true);

    map.enableKeyboard();
    map.disableDoubleClickZoom();
    map.addControl(bmapUserTopOneRightInfo);
    map.addControl(new BMap.OverviewMapControl());

    $('#map div.anchorBL').hide();
    var myStyleJson1 = [

          {
              "featureType": "water",
              "elementType": "all",
              "stylers": {
                  "color": "#021019"
              }
          },
          {
              "featureType": "highway",
              "elementType": "geometry.fill",
              "stylers": {
                  "color": "#000000"
              }
          },
          {
              "featureType": "highway",
              "elementType": "geometry.stroke",
              "stylers": {
                  "color": "#147a92"
              }
          },
          {
              "featureType": "arterial",
              "elementType": "geometry.fill",
              "stylers": {
                  "color": "#000000"
              }
          },
          {
              "featureType": "arterial",
              "elementType": "geometry.stroke",
              "stylers": {
                  "color": "#0b3d51"
              }
          },
          {
              "featureType": "local",
              "elementType": "geometry",
              "stylers": {
                  "color": "#000000"
              }
          },
          {
              "featureType": "land",
              "elementType": "all",
              "stylers": {
                  "color": "#08304b"
              }
          },
          {
              "featureType": "railway",
              "elementType": "all",
              "stylers": {
                  "color": "#1eaed7",
                  "lightness": 2,
                  "saturation": 91,
                  "visibility": "on"
              }

          },
          {
              "featureType": "subway",
              "elementType": "geometry",
              "stylers": {
                  "lightness": -70
              }
          },
          {
              "featureType": "building",
              "elementType": "geometry.fill",
              "stylers": {
                  "color": "#000000"
              }
          },
          {
              "featureType": "all",
              "elementType": "labels.text.fill",
              "stylers": {
                  "color": "#857f7f"
              }
          },
          {
              "featureType": "all",
              "elementType": "labels.text.stroke",
              "stylers": {
                  "color": "#000000"
              }
          },
          {
              "featureType": "building",
              "elementType": "geometry",
              "stylers": {
                  "color": "#022338"
              }
          },
          {
              "featureType": "green",
              "elementType": "geometry",
              "stylers": {
                  "color": "#062032"
              }
          },
          {
              "featureType": "boundary",
              "elementType": "all",
              "stylers": {
                  "color": "#1e1c1c"
              }
          },
          {
              "featureType": "highway",
              "elementType": "all",
              "stylers": {
                  "color": "#022338",
                  "visibility": "off"
              }
          },
          {
              "featureType": "arterial",
              "elementType": "all",
              "stylers": {
                  "visibility": "off"
              }
          },
          {
              "featureType": "local",
              "elementType": "all",
              "stylers": {
                  "visibility": "off"
              }
          },
          {
              "featureType": "subway",
              "elementType": "all",
              "stylers": {
                  "visibility": "off"
              }
          },
          {
              "featureType": "poi",
              "elementType": "all",
              "stylers": {
                  "visibility": "off"
              }
          },
          {
              "featureType": "label",
              "elementType": "labels.text.fill",
              "stylers": {
                  "color": "#ffffff",
                  "visibility": "on"
              }
          }

    ];
    map.setMapStyle({ styleJson: myStyleJson1 });
    map.setCurrentCity("武汉");   //由于有3D图，需要设置城市哦
    var cr = new BMap.CopyrightControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT });
    map.addControl(cr); //添加版权控件
    cr.addCopyright({ id: 1, content: "<a href='http://www.railwaytec.com'></a>" });
    //    if (getCookieValue("GISSmall") == "small") {
    //        map.addControl(new BMap.MapTypeControl({ anchor: BMAP_ANCHOR_TOP_RIGHT }));   //左上角，默认地图控件

    //        var cr = new BMap.CopyrightControl({ anchor: BMAP_ANCHOR_TOP_LEFT });   //设置
    //        map.addControl(cr); //添加

    //        var bs = map.getBounds();   //返回地图可视区域
    //        cr.addCopyright({ id: 1, content: "  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href='#' class='btn btn-primary' onclick=' MonitorindexJtopo()' style='background: #4A6F9C;color:White;'>拓扑模式</a>", bounds: bs });    //Copyright(id,content,bounds)类作为CopyrightControl.addCopyright()方法的参数

    //    } else {
    map.addControl(new BMap.MapTypeControl({ anchor: BMAP_ANCHOR_TOP_RIGHT }));   //左上角，默认地图控件
    //}
};

//获取当前系统前日日期
function QdatehhssNowStr() {
    var d = new Date();
    d.setDate(d.getDate());
    var ret = d.getFullYear() + "-";
    ret += ("00" + (d.getMonth() + 1)).slice(-2) + "-";
    ret += ("00" + (d.getDate())).slice(-2) + " ";
    ret += "00" + ":";
    ret += "00" + ":";
    ret += "00" + " ";
    return ret;
};


//C3设备短信信息
var c3Map;
var _deviceid;
var _DETECT_TIME;
var _CROSSING_NO;


function getC3SmsInfo2_json_index(_index) {
    getC3SmsInfo2(C3Locojson[_index]);
};

function getC3SmsInfo2(jsons) {
    // AgainRefsetInterval(); //重启定时器
    c3Map = this.map;
    _deviceid = jsons.TRAIN_NO;
    _DETECT_TIME = jsons.DETECT_TIME;
    _CROSSING_NO = jsons.CROSSING_NO;
    var deviceVersion = getDeviceVersion(deviceid);
    var html = "<div style='width:620px;'><table width='620px'><tr><th valign='middle' style='line-height:300%;padding-bottom:2px'>" + jsons.TRAIN_NO + "";

    html += "<div style='right:15px; float:right;text-align:center;'><input class='btn btn-primary'  value='查看检测轨迹' style='width:100px'  type='button' onclick='getC3SmsInfo11();RefC3ProcessInfo();'/> ";
    if (deviceVersion != "PS3") {
        if (getCookieValue("GISSmall") != "small") {

            html += " <input class='btn btn-primary'  value='车顶实时监测'  type='button' style='width:120px' onclick='playRealtimeVideo();'/>";

            // html += " <input class='btn btn-primary'  value='双屏视频直播'  type='button' style='width:120px' onclick='playRealtimeVideoTwo();'/>";
        }
    }
    html += "<div></th></tr>";
    html += "<tr><td style='width:100%'>";
    html += "<table class='table table-bordered table-condensed' width='100%' cellspacing='1'  cellpadding='1'>";

    //html += "<td style='width:20%'>时间：</td><td style='width:35%'>" + jsons.DETECT_TIME + "</td>"



    html += "<tr><td style='width:15%'><strong>当前位置：</strong></td><td style='width:75%' colspan='3'>";
    html += jsons.WZ;
    //  html += " (卫星数：" + jsons.SATELLITE_NUM + ")";
    html += "</td></tr>";
    html += "<tr><th style='width:15%'>时间：</th><td style='width:75%' colspan='3'>" + jsons.DETECT_TIME + "</td></tr>";
    html += "<tr><th >最高温度(℃)：</th><td >" + (jsons.IRV_TEMP != "" ? jsons.IRV_TEMP + "" : "") + "</td><th style='width:15%'>环境温度(℃)：</th><td >" + (jsons.SENSOR_TEMP != "" ? jsons.SENSOR_TEMP + "" : "") + "</td></tr>";
    html += "<tr><th>导高值(mm)：</th><td>" + (jsons.LINE_HEIGHT != "" ? jsons.LINE_HEIGHT + "" : "") + "</td><th>拉出值(mm)：</th><td>" + (jsons.PULLING_VALUE != "" ? jsons.PULLING_VALUE + "" : "") + "</td></tr>";
    html += "<tr><th>弓状态：</th><td>" + TRAINSTATUS(jsons.BOW_UPDOWN_STATUS) + "</td><th>速度(km/h)：</th><td>" + (jsons.SPEED != "" ? jsons.SPEED + "" : "") + "</td></tr>";
    if (getConfig('debug') == "1") {
        html += "<tr><th>东经：</th><td>" + jsons.GIS_X_O + "</td><th>北纬：</th> <td>" + jsons.GIS_Y_O + "</td></tr></table>";
    }
    html += "</td></tr></table></div>";
    var infoWindow = new BMap.InfoWindow(html);
    var point = new BMap.Point(jsons.GIS_X, jsons.GIS_Y);
    map.openInfoWindow(infoWindow, point);
};

//右键选中
function getC3RightClickSmsInfo(maps, e) {
    // AgainRefsetInterval(); //重启定时器
    deviceid = e.TRAIN_NO;

    _CROSSING_NO = e.CROSSING_NO;
    _DETECT_TIME = e.DETECT_TIME;
    var deviceVersion = getDeviceVersion(deviceid);

    c3Map = maps;
    var html = "<div style='width:1000px;'><table width='600px'><tr><td style='width:100%'>" + e.TRAIN_NO + "<input class='btn btn-primary'  value='查看检测轨迹' style='width:100px'  type='button' onclick='getC3ProcessInfo(&quot;&quot;,&quot;&quot;);RefC3ProcessInfo();'/>  ";
    // html += "<tr> <td><img id='img5' src='../images/C3/1_102_vi.png' onmousemove='getImage()' width='300px' height='200px' /></td><td><img id='img6' src='../images/C3/1_102_vi2.png' onmousemove='getImage()' width='300px' height='200px' /> </td></tr>"
    //html += "<tr><td > 时间  <input id='startdate' type='text' runat='server' class='date' style='width: 90px;'></td><td><input class='btn'  value='获取红外视频'  type='button' onclick='getC3RedSP()'/></td></tr>";
    if (deviceVersion != "PS3") {
        if (getCookieValue("GISSmall") != "small") {

            html += " <input class='btn btn-primary'  value='单屏视频直播'  type='button' style='width:120px' onclick='playRealtimeVideo();'/>";

            html += " <input class='btn btn-primary'  value='双屏视频直播'  type='button' style='width:120px' onclick='playRealtimeVideoTwo();'/>";
        }
    }
    html += "</td></tr>";
    html += "<tr><td style='width:100%'>";
    html += "<table class='table table-bordered table-condensed' width='100%' cellspacing='1'  cellpadding='1'>";
    html += "<tr><td style='width:15%'>当前位置：</td><td style='width:75%' colspan='3'>";


    html += e.WZ;


    html += "</td></tr>";

    html += "<tr><td style='width:20%'>时间：</td><td style='width:75%' colspan='3'>" + e.DETECT_TIME + "</td></tr>";
    html += "<tr><td  >最高温度(℃)：</td><td  >" + e.IRV_TEMP + "</td><td  >环境温度(℃)：</td><td  >" + e.SENSOR_TEMP + "</td></tr>";
    html += "<tr><td>导高值(mm)：</td><td>" + e.LINE_HEIGHT + "</td><td>拉出值(mm)：</td><td>" + e.PULLING_VALUE + "</td></tr>";
    html += "<tr><td>弓状态：</td><td>" + TRAINSTATUS(e.BOW_UPDOWN_STATUS) + "</td><td>速度(km/h)：</td><td>" + e.SPEED + "</td></tr>";
    html += "<tr><td>东经：</td><td>" + e.GIS_X_O + "</td><td>北纬：</td> <td>" + e.GIS_Y_O + "</td></tr></table>";
    html += "</td></tr></table></div>";
    var infoWindow = new BMap.InfoWindow(html);
    var point = new BMap.Point(e.GIS_X, e.GIS_Y);
    maps.openInfoWindow(infoWindow, point);
};

//查询基础版本
function getDeviceVersion(trainNo) {
    var json = getMisC3DeviceVersion(trainNo);
    return json[0].deviceVersion;
};

///设备状态
function TRAINSTATUS(status) {
    switch (status) {
        case "0":
            return "正常";
            break;
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
};

//打开视频直播页面
function playRealtimeVideo() {
    window.parent.ShowPlay1(_deviceid);
};
//设备联动视频直播
function playRealtimeVideoTwo() {
    window.parent.ShowPlay2(_deviceid);
};


function filterMarks(_MinServerTime) {
    for (var i = 0; i < maps.markers.length; i++) {

        var obj = maps.markers[i].json;

        if (new Date(obj.RAISED_TIME) < new Date(_MinServerTime)) {
            //小于最小的服务器时间。删除。
            map.removeOverlay(obj);
            map.c3alarm.splice(i, 1);
        }

    }
}

//查找对应marker的index. 找到返回index,没找到返回需要插入的位置index
function GetAlarmMarkIndex(m) {
    var _alarmid = m.ALARM_ID;
    var _insertIndex = 0;  //默认播放到第一条。
    var isSet = false;

    for (var i = 0; i < maps.markers.length; i++) {
        var obj = maps.markers[i].json;
        if (obj.ALARM_ID == _alarmid) {
            return i;
        }

        if (!isSet && new Date(m.RAISED_TIME) > new Date(obj.RAISED_TIME)) {
            //默认是倒序排的，取第一个比当前报警发生时间大的对象。
            _insertIndex = i;
            isSet = true;
        }

    }

    if (!isSet) {
        //没有找到比当前小的。没设置过
        _insertIndex = maps.markers.length;
    }

    return '#' + _insertIndex;

};




//地图画变电所   跳闸 正常
function drawSubstationMarker(map, m, icoUrl, displayStr, _type, jump) {


    var Point = new BMap.Point(m.GIS_X, m.GIS_Y);
    //                    markers.push(new BMap.Marker(Point));
    var icon = "";

    icon = new BMap.Icon(icoUrl, new BMap.Size(Ico_alarm_width, Ico_alarm_heigth));

    var marker = new BMap.Marker(Point, { icon: icon });
    if (m.ponint_type == 'True') {
        marker.setZIndex(7);
    } else {
        marker.setZIndex(6);
    }
    marker.setOffset(new BMap.Size(Ico_alarm_left, Ico_alarm_top));

    //marker.setLabel(labelMark);
    map.addOverlay(marker);
    if (jump == 'truee' && m.ponint_type == 'True') {//跳闸并且    暂时不跳
        marker.setAnimation(BMAP_ANIMATION_BOUNCE)
    }
    marker.disableDragging(true);
    marker.json = m;
    marker.type = _type;
    marker.id = m.ID;
    marker.addEventListener("click", SubstationPointClick);
    //marker.addEventListener("dblclick", getC3AlarmInfo2);
    if (displayStr == "hide") {
        marker.hide();
    } else {
        marker.show();
    }
    //return marker;
}
//变电所跳闸点   点击事件与变电所列表页面 联动     SubstationPointClick
function getSubstationPoint() {
    var _url = '/Common/MSubstation/RemoteHandlers/SubstationAbnormal.ashx?action=queryAllList'
    $.ajax({
        type: "POST",
        url: _url,
        async: true,
        cache: false,
        success: function (re) {
            //console.log(re)
            if (re != '' && re != undefined) {
                var overlays = map.getOverlays();
                for (var i = 0; i < overlays.length; i++) {
                    if (overlays[i].type == 'stationPoint') {
                        map.removeOverlay(overlays[i]);
                    }
                }
                var allNumber = 0;
                var jumpNumber = 0;
                var normalNumber = 0;
                if (re.data.length > 0) {
                    for (var i = 0; i < re.data.length; i++) {
                        //if (re.data[i].GIS_LAT === '' || (re.data[i].GIS_LAT == '0' && re.data[i].GIS_LON == '0')) continue;
                        allNumber++;
                        var m = { GIS_X: re.data[i].GIS_LON, GIS_Y: re.data[i].GIS_LAT, SUBSTATION_CODE: re.data[i].SUBSTATION_CODE, SUBSTATION_NAME: re.data[i].SUBSTATION_NAME, LINE_NAME: re.data[i].LINE_NAME, LINE_CODE: re.data[i].LINE_CODE, ponint_type: re.data[i].ERROR, type: 'stationPoint' };
                        var displayStr = getDisplayStr(m);//是否显示
                        var icoUrl = ''; //图标
                        if (re.data[i].ERROR == 'False') {
                            icoUrl = '/Common/MGIS/img/biandiansuo_zhengchang.png';
                            normalNumber++;
                        } else if (re.data[i].ERROR == 'True') {
                            icoUrl = ' /Common/MGIS/img/biandiansuo_tiaozha.png';
                            jumpNumber++;
                        }
                        var _type = 'stationPoint';//变电所类型
                        var jump = 'false';
                        if (re.data[i].TRBL_TIME != '' && re.data[i].TRBL_TIME >= getDateStr_day(datehhssNowStr(), -1)) {//缺陷时间在最近一天内 跳动
                            jump = 'true';
                        }
                        drawSubstationMarker(map, m, icoUrl, displayStr, _type, jump)
                    }

                }
                window.parent.SetSubstationNumber(allNumber, jumpNumber, normalNumber);//设置图例 括号内数字 

            }

        }
    })

}



//变电所跳闸点  点击事件   点击默认查询列表带入  所亭名称
function SubstationPointClick(e) {
    console.log(this.json)
    setSubstation_center(this.json.SUBSTATION_CODE, 'fasle')
    $("body", parent.document).find("#iframe_XZForm").contents()[0].defaultView.getSubstationList(this.json.SUBSTATION_NAME)
    $("body", parent.document).find("#btn_BDS").click();
}


//改变变电所图标显示状态
function ChangeSubstation_Status() {
    var overlays = map.getOverlays();
    for (var i = 0; i < overlays.length; i++) {
        var m = overlays[i];
        try { if (m.type != "stationPoint") { continue } } catch (e) {
            continue;
        }
        //如果不是变电所则跳过
        displayStr = '';
        displayStr = getDisplayStr(m)//获取状态
        if (displayStr == 'hide') {
            m.hide();
        } else {
            m.show();
        }
    }
}

var lastSubstation = null;
//定位变电所中心
function setSubstation_center(sid, setcenter) {
    var overlays = map.getOverlays();
    for (var i = 0; i < overlays.length; i++) {
        var m = overlays[i];
        try { if (m.type != "stationPoint") { continue } } catch (e) {
            continue;
        }//如果不是变电所则跳过

        if (m.json.SUBSTATION_CODE == sid) {
            if (lastSubstation != null) {
                lastSubstation.setAnimation(null);
            }
            m.setAnimation(BMAP_ANIMATION_BOUNCE);
            lastSubstation = m;
            if (setcenter != 'fasle') {
                map.setCenter(m.getPosition());
            }
        }
    }
}