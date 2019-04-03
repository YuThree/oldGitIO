/*========================================================================================*
* 功能说明：超图api封装
* 作    者： zzj
* 版本日期：2015.7.14

*=======================================================================================*/


var infowin = null; //信息窗口对象定义
var map, layer, markerlayer, vectorlayer;
var markerlayer_loca, markerlayer_alarm, markerlayer_position;
var vectorLayer_label;
var vectorLayer_line;

var clickMarker = '';

var C3Locojson; //设备JSON串
var alarmJson; //报警列表
var One_number = 0, Two_number = 0, Three_number = 0;//等级计数
var new_number = 0, sure_number = 0, plan_number = 0, check_number = 0, close_number = 0;//状态计数
var lastDateTime_alarmNew = ''; //最新的报警日期。
var allowUpdate_lastDateTime_alarmNew = true;
var pageName;
var setshow; //信息框定时器
var setloco; //设备刷新定时器
var second = 3000; //信息框关闭时间
var showtime = 30000; //信息框提示时间
var locotime = 120000; //设备刷新时间

//var url = "http://192.168.1.130:8091/iserver/services/map-china400/rest/maps/China";  //中国地图
//var url = "http://192.168.1.130:8091/iserver/services/map-world/rest/maps/World";  //世界地图
//var url = "http://192.168.1.130:8091/iserver/services/map-China4002/rest/maps/中国400万地图";  
var url = "http://192.168.1.130:8091/iserver/services/map-China4002/rest/maps/中国400万";


function addMapLeft() {

    var html=' <div id="ImgTypeBox">\
                    <div>\
                         <input id="cb_station" type="checkbox" style="vertical-align: middle;" /><span style="vertical-align: middle; color: White;"><label for="cb_station">站点　&nbsp;<img style="width: 20px; height: 20px;" align="absmiddle" src="/Common/MRTA/img/station.png"></label></span>\
                    </div>\
<div>\
<input id="cb_type1" type="checkbox" checked style="vertical-align: middle;" /><span style="vertical-align: middle; color: White;"><label for="cb_type1">一类　&nbsp;<img style="width: 20px; height: 20px;" align="absmiddle" src="/Common/MGIS/img/ico1_new.png"></label></span>&nbsp;(<span id="one_number">0</span>)\
        </div>\
        <div>\
            <input id="cb_type2" type="checkbox" checked style="vertical-align: middle;" /><span\
    style="color: White;"><label for="cb_type2">二类　&nbsp;<img style="width: 20px; height: 20px;" align="absmiddle" src="/Common/MGIS/img/ico2_new.png"></label></span>&nbsp;(<span\
            id="two_number">0</span>)\
        </div>\
        <div>\
            <input id="cb_type3" type="checkbox" checked style="vertical-align: middle;" /><span\
    style="color: White;"><label for="cb_type3">三类　&nbsp;<img style="width: 20px; height: 20px;" align="absmiddle" src="/Common/MGIS/img/ico3_new.png"></label></span>&nbsp;(<span\
            id="three_number">0</span>)\
        </div>\
        <div>\
            <input id="cb_new" type="checkbox" checked style="vertical-align: middle;" /><span\
    style="color: White;"><label for="cb_new">新上报&nbsp;<img style="width: 20px; height: 20px;"\
        align="absmiddle" src="/Common/MGIS/img/new0.png"></label></span>&nbsp;(<span id="new_number">0</span>)\
        </div>\
        <div>\
            <input id="cb_sure" type="checkbox" checked style="vertical-align: middle;" /><span style="color: White;"><label\
    for="cb_sure">已确认&nbsp;<img style="width: 20px; height: 20px;" align="absmiddle" src="/Common/MGIS/img/sure0.png"></label></span>&nbsp;(<span\
        id="sure_number">0</span>)\
        </div>\
        <div>\
            <input id="cb_plan" type="checkbox" style="vertical-align: middle;" /><span style="color: White;"><label\
    for="cb_plan">已计划&nbsp;<img style="width: 20px; height: 20px;" align="absmiddle" src="/Common/MGIS/img/plan0.png"></label></span>&nbsp;(<span\
        id="plan_number">0</span>)\
        </div>\
        <div>\
            <input id="cb_check" type="checkbox" style="vertical-align: middle;" /><span style="color: White;"><label\
    for="cb_check">检修中&nbsp;<img style="width: 20px; height: 20px;" align="absmiddle" src="/Common/MGIS/img/check0.png"></label></span>&nbsp;(<span\
        id="check_number">0</span>)\
        </div>\
        <div>\
            <input id="cb_close" type="checkbox" style="vertical-align: middle;" /><span style="color: White;"><label\
    for="cb_close">已关闭&nbsp;<img style="width: 20px; height: 20px;" align="absmiddle" src="/Common/MGIS/img/close0.png"></label></span>&nbsp;(<span\
        id="close_number">0</span>)\
        </div>\
</div>'

    if ($('#ImgTypeBox').length == 0)
    {
        $('body').append(html);

        var _h = $(window).height();

        $('#ImgTypeBox>div').height(28);

        var _top = _h - $('#ImgTypeBox').innerHeight()

        $('#ImgTypeBox').css('top', _top).css('left', 0);

        $('#cb_station').click(function () {
            RefreshPosition();
        })

        $('#cb_type1,#cb_type2,#cb_type3,#cb_new,#cb_sure,#cb_plan,#cb_check,#cb_close').click(function () {         
            RefreshAlarm();
        })

    }

}

function SetAlarmNumber(O) {
    $("#one_number").text(One_number);
    $("#two_number").text(Two_number);
    $("#three_number").text(Three_number);
    $("#new_number").text(new_number);
    $("#sure_number").text(sure_number);
    $("#plan_number").text(plan_number);
    $("#check_number").text(check_number);
    $("#close_number").text(close_number);

}

//BindMap("map");
//markerlayer = new SuperMap.Layer.Markers("markerLayer");
//addMarkerData(11983722.7315, 3942864.5449, markerlayer, "marker.png", "缺陷1");
//vectorlayer = new SuperMap.Layer.Vector("vectorLayer");
//addVectorData(12984722.7315, 3942864.5449, vectorlayer, "矢量图说明");
//addVectorData(12984722.7315, 3982864.5449, vectorlayer, "矢量图说明2");
//BindVector_click(vectorlayer);

function sm_clearAll() {
    try {
        markerlayer_loca.clearMarkers();
        markerlayer_alarm.clearMarkers();
        markerlayer_position.clearMarkers();
    }
    catch (ex) { }
}

//绑定地图
function BindMap(_mapID,_pageName)
{

    pageName = _pageName;

    map = new SuperMap.Map(_mapID, {
        controls: [
     //   new SuperMap.Control.Zoom(),
        new SuperMap.Control.Navigation()
        ]
    });


    map.events.on({
        "click": function () {

            closeInfoWin();
            
            if(clickMarker!='')
                markerlayer_alarm.removeMarker(clickMarker);
        }
    });


    markerlayer = new SuperMap.Layer.Markers("markerLayer");
    vectorlayer = new SuperMap.Layer.Vector("vectorLayer");
    markerlayer_loca = new SuperMap.Layer.Markers("markerLayer");
    markerlayer_alarm = new SuperMap.Layer.Markers("markerLayer");
    markerlayer_position = new SuperMap.Layer.Markers("markerLayer");

    vectorLayer_line = new SuperMap.Layer.Vector("vector");
    vectorLayer_line.style = {
        strokeColor: "#7B68EE",
        strokeWidth: 4
    } ;

    var strategy = new SuperMap.Strategy.GeoText();
    strategy.style = {
        fontColor: "#FF7F00",
        fontWeight: "bolder",
        fontSize: "14px",
        fill: true,
        fillColor: "#FFFFFF",
        fillOpacity: 0.8,
        stroke: true,
        strokeColor: "#8B7B8B"

    };
    vectorLayer_label = new SuperMap.Layer.Vector("Label", { strategies: [strategy] });


    //底层加载
    layer = new SuperMap.Layer.TiledDynamicRESTLayer("China", url, null, { maxResolution: "auto" });
    layer.events.on({ "layerInitialized": addLayer });


    addMapLeft();

}

//增加图层
function addLayer() {


    map.addLayers([layer, markerlayer, vectorlayer, markerlayer_loca, markerlayer_alarm, markerlayer_position, vectorLayer_label, vectorLayer_line]);



    var mapLevel = getConfig('mapLevel'); //获取地图初始加载层次；
    var CenterLon = getCookieValue("CenterLon");
    if (CenterLon == "null" || CenterLon == "") {
        CenterLon = getConfig('CenterLon');
    }
    var CenterLat = getCookieValue("CenterLat");
    if (CenterLat == "null" || CenterLat == "") {
        CenterLat = getConfig('CenterLat');
    }

    map.setCenter(new SuperMap.LonLat(CenterLon, CenterLat), mapLevel);
}

function addLayer_Lable()
{
    //新建一个策略并使用在矢量要素图层(vector)上。
    
  //  vectorLayer_label = new SuperMap.Layer.Vector("Label", { strategies: [strategy] });
   // map.addLayers([vectorLayer_label]);
}

function addLayer_line(point) {
    var line = new SuperMap.Geometry.LineString(point);
    var FeaLine = new SuperMap.Feature.Vector(line);
    FeaLine.style = {
        strokeColor: "#7B68EE",
        strokeWidth: 4

    };
    vectorLayer_line = new SuperMap.Layer.Vector("vector");
    var FeaLine = new SuperMap.Feature.Vector(line);
    vectorLayer_line.addFeatures(FeaLine);
    map.addLayers([vectorLayer_line]);
}

//添加站点marker
function addMarkerData_station(options) {

    var defaults = {
        lon: '', //必须
        lat: '', //必须      
        json: "",//必须
        popHtml: "",//指定弹出html
        markerlayer: markerlayer_position,//marker图层
        icoName: "station.png", 
        sizeW: 20,
        sizeH:30,
        ClickCallback: function () { }
    };
  
    var opts = $.extend(defaults, options);


    if (opts.popHtml == "")
    {
        opts.popHtml = opts.json.StationSectionName;
    }

    //  markerlayer.removeMarker(marker);
    var size = new SuperMap.Size(opts.sizeW, opts.sizeH);
    var offset = new SuperMap.Pixel(-(size.w / 2), -size.h);
    var icon = new SuperMap.Icon('/Common/js/SuperMap/theme/images/' + opts.icoName, size, offset);
    var marker = new SuperMap.Marker(new SuperMap.LonLat(opts.lon, opts.lat), icon);
    marker.HtmlInfo = opts.popHtml;
    marker.json = opts.json;
    marker.type = "站点";

    marker.events.on({
        "click": function () {

            openInfoWin_html(this);

            opts.ClickCallback(marker.json);
        },
        "scope": marker
    });

    opts.markerlayer.addMarker(marker);

    return marker
}



//添加车辆marker
function addMarkerData_loca(options) {

    var defaults = {
        lon: '', //必须
        lat: '', //必须      
        json: "",//必须
        popHtml: "",//指定弹出html
        markerlayer: markerlayer_loca,//marker图层
        icoName: "动车_s.png",
        sizeW: 30,
        sizeH: 40,
        pageName:'',
        ClickCallback: function () { }
    };
   
    var opts = $.extend(defaults, options);


    if (opts.popHtml == "") {

        opts.popHtml = GetLocaInfo(opts.json);


      
    }

    //  markerlayer.removeMarker(marker);
    var size = new SuperMap.Size(opts.sizeW, opts.sizeH);
    var offset = new SuperMap.Pixel(-(size.w / 2), -size.h - 10);
    var icon = new SuperMap.Icon('/Common/js/SuperMap/theme/images/' + opts.icoName, size, offset);
    var marker = new SuperMap.Marker(new SuperMap.LonLat(opts.lon, opts.lat), icon);
    marker.HtmlInfo = opts.popHtml;
    marker.json = opts.json;
    marker.type = "Loco";
    
    
    
    marker.events.on({
        "click": function () {


         
            var lonlat = marker.getLonLat();
            map.setCenter(lonlat);

            openInfoWin_html(this);

            opts.ClickCallback(marker.json);
        },
        "scope": marker
    });

    opts.markerlayer.addMarker(marker);

    return marker

}

function GetLocaInfo(jsons)
{
    deviceid = jsons.TRAIN_NO;
    _DETECT_TIME = escape( jsons.DETECT_TIME)
    _CROSSING_NO = jsons.CROSSING_NO
    var deviceVersion = jsons.deviceVersion; //getDeviceVersion(deviceid);
    var html = "<div style='width:620px;'><table width='620px'><tr><td style='width:100%'>" + deviceid + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

    html += "<div style='right:0px; float:right;'><input class='btn btn-primary'  value='查看检测轨迹' style='width:100px'  type='button' onclick=getC3SmsInfo11('" + jsons.TRAIN_NO + "','" + _DETECT_TIME + "','" + _CROSSING_NO + "') /> ";
    if (deviceVersion != "PS3") {
        if (getCookieValue("GISSmall") != "small") {

            html += " <input class='btn btn-primary'  value='车顶实时监测'  type='button' style='width:120px' onclick=playRealtimeVideo('" + deviceid + "') />";

            // html += " <input class='btn btn-primary'  value='双屏视频直播'  type='button' style='width:120px' onclick='playRealtimeVideoTwo();'/>";
        }
    }
    html += "<div></td></tr>";
    html += "<tr><td style='width:100%'>"
    html += "<table class='table table-bordered table-condensed' width='100%' cellspacing='1'  cellpadding='1'>"
    html += "<tr><td style='width:20%'>时间：</td><td style='width:25%'>" + jsons.DETECT_TIME + "</td>"
    html += "<td style='width:15%'>当前位置：</td><td style='width:40%' >";
    var intnum = 0;
    if (jsons.CROSSING_NO.replace(/[ ]/g, "") != "" && jsons.CROSSING_NO.replace(/[ ]/g, "") != null) {
        html += jsons.CROSSING_NO + "号交路"
        intnum = 1;
    }
    if (jsons.ROUTING_CODE != "" && jsons.ROUTING_CODE != undefined) {
        if (intnum == 1) {
            html += "(";
        }
        html += jsons.ROUTING_CODE;
        if (intnum == 1) {
            html += ")";
        }
        intnum = 1;
    }
    if (jsons.STATION_NO != "") {
        if (intnum == 1) {
            html += ":";
        }
        html += jsons.STATION_NO + "号站";
        intnum = 1;
    }
    if (jsons.STATION_NAME != "" && jsons.STATION_NAME != undefined) {
        if (intnum == 1) {
            html += "(";
        }
        html += jsons.STATION_NAME;
        if (intnum == 1) {
            html += ")";
        }
        intnum = 1;
    }

    if (jsons.LINE_NAME != "") {
        if (intnum == 1) {
            html += ";";
        }
        html += jsons.LINE_NAME;
        intnum = 1;
    }
    if (jsons.DIRECTION != "") {
        if (intnum == 1) {
            html += ":";
        }
        html += jsons.DIRECTION;
        intnum = 1;
    }

    if (jsons.STATION_NAME != "") {
        if (intnum == 1) {
            html += ":";
        }
        html += jsons.STATION_NAME;
        intnum = 1;
    }
    if (jsons.KM_MARK != 0) {
        if (intnum == 1) {
            html += "，";
        }
        html += "公里标K" + parseInt(jsons.KM_MARK / 1000) + "+" + parseInt(jsons.KM_MARK % 1000);
        intnum = 1;
    }
    //  html += " (卫星数：" + jsons.SATELLITE_NUM + ")";
    html += "</td></tr>"

    html += "<tr><td >最高温度：</td><td >" + jsons.IRV_TEMP + "℃</td><td >环境温度：</td><td >" + jsons.SENSOR_TEMP + "℃</td></tr>"
    html += "<tr><td>导高值：</td><td>" + jsons.LINE_HEIGHT.toString() + "mm</td><td>拉出值：</td><td>" + jsons.PULLING_VALUE.toString() + "mm</td></tr>"
    html += "<tr><td>设备运行状态：</td><td>" + TRAINSTATUS(jsons.TRAIN_STATUS) + "</td><td>速度：</td><td>" + jsons.SPEED + "km/h</td></tr>"
    html += "<tr><td>东经：</td><td>" + jsons.GIS_X_O + "</td><td>北纬：</td> <td>" + jsons.GIS_Y_O + "</td></tr></table>"
    html += "</td></tr></table></div>";
  
    return html;
}

//查询基础版本
function getDeviceVersion(trainNo) {
    var json = getMisC3DeviceVersion(trainNo);
    return json[0].deviceVersion;
};

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
};

//简单添加marker
function addMarkerData(_lon, _lat, _markerlayer, _imgname, _html,_json) {
    //  markerlayer.removeMarker(marker);
    var size = new SuperMap.Size(25, 25);
    var offset = new SuperMap.Pixel(-(size.w / 2), -size.h);
    var icon = new SuperMap.Icon('/Common/js/SuperMap/theme/images/' + _imgname, size, offset);
    var marker = new SuperMap.Marker(new SuperMap.LonLat(_lon, _lat), icon);
    marker.HtmlInfo = _html;
    marker.json = _json;

    marker.events.on({
        "click": openInfoWin,
        "scope": marker,
        "dblclick": function () {

            var marker = this;
            var id = marker.json.ALARM_ID;           
            url = "/C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=" + id + '&v=' + version;
            window.open(url, "_blank");
        }
    });

    _markerlayer.addMarker(marker);
}

//添加缺陷marker
function addMarkerData_alert(options) {

    var defaults = {
        lon: '', //必须
        lat: '', //必须      
        json: "",//必须
        popHtml: "",//指定弹出html
        markerlayer: markerlayer_alarm,//marker图层
        icoName: "marker.png",
        sizeW: 25,
        sizeH: 25,
        MarkerOver: true,     
        ClickCallback: function () { }, //单击完成事件。
        dblClickCallback: function () { }  //双击完成事件
    };   
    var opts = $.extend(defaults, options);


    if (opts.popHtml == "") {
    //    opts.popHtml = "选中缺陷";
    }

    //  markerlayer.removeMarker(marker);
    var size = new SuperMap.Size(opts.sizeW, opts.sizeH);
    var offset = new SuperMap.Pixel(-(size.w / 2), -(size.h / 2));
    var icon = new SuperMap.Icon('/Common/js/SuperMap/theme/images/' + opts.icoName, size, offset);
    var marker = new SuperMap.Marker(new SuperMap.LonLat(opts.lon, opts.lat), icon);
    marker.HtmlInfo = opts.popHtml;
    marker.json = opts.json;
    marker.type = "Alarm";
    marker.mysize = size;
    marker.myoffset = offset;
   

    marker.events.on({        
        "scope": marker,
        "click": function () {

            showMarkerOver(marker, opts.MarkerOver);

           // openInfoWin_html(this);       

            opts.ClickCallback(marker.json);

        


        },
        "dblclick": function () {

            var marker = this;
            var id = marker.json.ALARM_ID;           
            url = "/C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=" + id + '&v=' + version;
            window.open(url, "_blank");
        }
    });

    opts.markerlayer.addMarker(marker);
    return marker
}

function showMarkerOver(marker, _MarkerOver)
{
    closeInfoWin();

    if (clickMarker != '')
        markerlayer_alarm.removeMarker(clickMarker);



    var lonlat = marker.getLonLat();
  //  map.setCenter(lonlat);


    var icon_over = new SuperMap.Icon('/Common/js/SuperMap/theme/images/marker.png', marker.mysize, marker.myoffset);

    if (_MarkerOver) {
        clickMarker = addMarkerData_alert({
            lon: lonlat.lon, //必须
            lat: lonlat.lat, //必须      
            json: marker.json,//必须
            sizeW: 30,
            sizeH: 30,
            icoName: "ico_clickmarker.png",
            MarkerOver: false
        })


    }
}


//添加矢量元素。
function addVectorData(_lon, _lat, _vectorlayer, _html) {

    //    vectorlayer.removeAllFeatures();
    var point = new SuperMap.Geometry.Point(_lon, _lat);
    pointFeature = new SuperMap.Feature.Vector(point);

    pointFeature.HtmlInfo = _html;

    pointFeature.style = {
        fillColor: "red",
        strokeColor: "yellow",
        pointRadius: 7
    };
    _vectorlayer.zIndex = 1;
    _vectorlayer.addFeatures(pointFeature);

}



//绑定矢量图的点击事件，传入矢量图层
function BindVector_click(_vectorlayer) {
    var callbacks = {
        click: function (currentFeature) {
            closeInfoWin();

            var _html = currentFeature.HtmlInfo;

            var popup = new SuperMap.Popup.FramedCloud("popwin",
            new SuperMap.LonLat(currentFeature.geometry.x, currentFeature.geometry.y),
            null,
            _html,
            null,
            true);
            infowin = popup;
            map.addPopup(popup);
        }
    };
    var selectFeature = new SuperMap.Control.SelectFeature(_vectorlayer,
    {
        callbacks: callbacks
    });
    map.addControl(selectFeature);
    selectFeature.activate();
}

//弹出信息窗口，根据marker的HtmlInfo
function openInfoWin_html(marker)
{
    closeInfoWin(); 
    var _html = marker.HtmlInfo;
    var lonlat = marker.getLonLat();
    var size = new SuperMap.Size(0, 33);
    var offset = new SuperMap.Pixel(0, size.h - 10);
    var icon = new SuperMap.Icon("/Common/js/SuperMap/theme/images/marker.png", size, offset);
    var popup = new SuperMap.Popup.FramedCloud("popwin", new SuperMap.LonLat(lonlat.lon, lonlat.lat), null, _html, icon, true);
    infowin = popup;
    map.addPopup(popup);
}

//打开信息框
function openInfoWin() {
    closeInfoWin();
    var marker = this;
    var _html = marker.HtmlInfo;
    var lonlat = marker.getLonLat();
    var size = new SuperMap.Size(0, 33);
    var offset = new SuperMap.Pixel(0, size.h-20);
    var icon = new SuperMap.Icon("/Common/js/SuperMap/theme/images/marker.png", size, offset);
    var popup = new SuperMap.Popup.FramedCloud("popwin",
    new SuperMap.LonLat(lonlat.lon, lonlat.lat), null, _html, icon, true);
    infowin = popup;
    map.addPopup(popup);
}
//关闭信息框
function closeInfoWin() {
    if (infowin) {
        try {
            infowin.hide();
            infowin.destroy();
        }
        catch (e) { }
    }
}



function AddLable(_x, _y, _title)
{
    try {

        var geoText = new SuperMap.Geometry.GeoText(_x, _y, _title);
        var geotextFeature = new SuperMap.Feature.Vector(geoText);
        vectorLayer_label.addFeatures([geotextFeature]);
    }
    catch(ex){}
}










//取线路数据，根据线路再找站点
function LoadPosition(options) {


    var defaults = {
        Ischeckstation: false, //显示站点 
        org: '',   
        line: "",
        locatype: "",
        OrgType: '',
        IsShowLine:false
    };
    var opts = $.extend(defaults, options);

    markerlayer_position.clearMarkers();


  //  var Ischeckstation = $("body", parent.document).find("#cb_station").is(':checked');

  //  if ($("body", parent.document).find("#cb_station").length == 0) Ischeckstation = true;

    if (opts.Ischeckstation) {

        var lineCenterjson = getMislineSCenterPointsData(opts.line, opts.org, opts.OrgType); //获取线路
        for (var i = 1; i < lineCenterjson.length; i++) {
            if (lineCenterjson[i][i][0].ID != "") {
                CreatePositionPoints(lineCenterjson[i][i][0].ID, opts.IsShowLine);
            }

        }
    }


}

////找站点，画站点
function CreatePositionPoints(mislineid,IsShowLine) {
    var positionjson = getMislinePointsData(mislineid);
    var Points = new Array(positionjson.length);

    var LinePoints = [];

    for (var i = 0; i < positionjson.length; i++) {

        var _marker = addMarkerData_station({
            lon: positionjson[i].startLongitude,
            lat: positionjson[i].startLatitude,
            json: positionjson[i],
            ClickCallback: function (e) {

            }
        })

        LinePoints.push(new SuperMap.Geometry.Point(positionjson[i].startLongitude, positionjson[i].startLatitude))

    }


    if (IsShowLine)
    {
        addLayer_line(LinePoints)
    }

}



/////****************机车*****************///
////获取设备的坐标点
////参数说明：mislineid=线路CODE；map地图对象
function LoadLoca(options) {

    var defaults = {
        line: '', //线路 
        org: '',    
        locatype: "",
        OrgType: ''     
    };
    var opts = $.extend(defaults, options);


    vectorLayer_label.removeAllFeatures();
    markerlayer_loca.clearMarkers();

    //设备   
    if (getConfig('IsCar') != "1") {
        return null;
    }
   
    
    var json = getMisC3PointsData(opts.line, opts.org, opts.OrgType, opts.locatype);
    C3Locojson = json;

    if (json != undefined) {
        for (var i = 0; i < json.length; i++) {


            var lable = json[i].TRAIN_NO;
            AddLable(json[i].GIS_X_O, json[i].GIS_Y_O, lable);

            var icon = "机车_s.png";
            if (json[i].TRAIN_NO.split('CR').length > 1) {
                icon = "动车_s.png";
            }

            addMarkerData_loca({
                lon: json[i].GIS_X_O,
                lat: json[i].GIS_Y_O,
                json: json[i],
                icoName: icon,
                ClickCallback: function (e) {


                    try {
                        switch (pageName) {
                            case "44在线实时监控":

                                if ($.browser.msie) {
                                    //IE         
                                    window.parent.frames["iframe_loca"].Setloca(e.TRAIN_NO);
                                }
                                else {
                                    //FF                  
                                    $("body", parent.document).find("#iframe_loca").contents()[0].defaultView.Setloca(e.TRAIN_NO);
                                }

                                break;
                        }

                    }
                    catch (ex) { }



                }
            })
        }
    }


    return json;
};


////画缺陷点
function LoadAlarm(options) {

    //map, deviceid, startTime, endTime, leNum, _line, _org, _OrgType, _locatype, _type
    var defaults = {
        line: '', //线路 
        org: '',
        locatype: "",
        OrgType: '',
        deviceid:'',
        startTime: '',
        endTime: '',
        IscheckType1: true,
        IscheckType2: true,
        IscheckType3: true,
        Ischeck_new: true,
        Ischeck_sure: true,
        Ischeck_plan: true,
        Ischeck_check: true,
        Ischeck_close:true     
    };
    var opts = $.extend(defaults, options);



   

    //var IscheckType1 = $("body", parent.document).find("#cb_type1").is(':checked');
    //var IscheckType2 = $("body", parent.document).find("#cb_type2").is(':checked');
    //var IscheckType3 = $("body", parent.document).find("#cb_type3").is(':checked');

    //var Ischeck_new = $("body", parent.document).find("#cb_new").is(':checked');
    //var Ischeck_sure = $("body", parent.document).find("#cb_sure").is(':checked');
    //var Ischeck_plan = $("body", parent.document).find("#cb_plan").is(':checked');
    //var Ischeck_check = $("body", parent.document).find("#cb_check").is(':checked');
    //var Ischeck_close = $("body", parent.document).find("#cb_close").is(':checked');

   


    return json;
}


function AddMarks_alarm_byJSON(json)
{
    markerlayer_alarm.clearMarkers();


    One_number = 0;
    Two_number = 0;
    Three_number = 0;
    new_number = 0;
    sure_number = 0;
    plan_number = 0;
    check_number = 0;
    close_number = 0;


    if (json != undefined) {
        for (var i = 0; i < json.length; i++) { //遍历报警点

            var m = json[i];
            //ico生成。
            var icoUrl = 'StatusLevel.png';
            switch (m.STATUS) {
                case 'AFSTATUS01': //新上报

                    new_number++;
                    icoUrl = icoUrl.replace('Status', 'new');

                    if (allowUpdate_lastDateTime_alarmNew) {
                        lastDateTime_alarmNew = m.RAISED_TIME;//最新上报时间。
                        allowUpdate_lastDateTime_alarmNew = false; //查询只更新一次，只从得到新报警后，才开放更新。
                    }

                    break;
                case 'AFSTATUS03':
                    sure_number++;
                    icoUrl = icoUrl.replace('Status', 'sure');
                    break;
                case 'AFSTATUS04':
                    plan_number++;
                    icoUrl = icoUrl.replace('Status', 'plan');
                    break;
                case 'AFSTATUS07':
                    check_number++;
                    icoUrl = icoUrl.replace('Status', 'check');
                    break;
                case 'AFSTATUS05':
                    close_number++;
                    icoUrl = icoUrl.replace('Status', 'close');
                    break;
            }



            switch (m.SEVERITY) {
                case '一类':
                    One_number++;
                    icoUrl = icoUrl.replace('Level', '1');
                    break;
                case '二类':
                    Two_number++;
                    icoUrl = icoUrl.replace('Level', '2');
                    break;
                case '三类':
                    Three_number++;
                    icoUrl = icoUrl.replace('Level', '3');
                    break;
            }

            if (json[i].GIS_X_O != "0") {


                addMarkerData_alert({
                    lon: json[i].GIS_X_O,
                    lat: json[i].GIS_Y_O,
                    json: json[i],
                    icoName: icoUrl,
                    ClickCallback: function (e) {


                        try {

                            switch (pageName) {
                                case "44在线实时监控":
                                    if ($.browser.msie) {
                                        //IE         
                                        window.parent.frames["iframe_alarm"].ClickAlarm(this.json.ALARM_ID, 'GIS');
                                        window.parent.frames["iframe_alarm"].SetItemBox(this.json.ALARM_ID);
                                    }
                                    else {
                                        //FF       
                                        $("body", parent.document).find("#iframe_alarm").contents()[0].defaultView.SetItemBox(this.json.ALARM_ID);

                                        $("body", parent.document).find("#iframe_alarm").contents()[0].defaultView.ClickAlarm(this.json.ALARM_ID, 'GIS');

                                    }
                                    break;
                                case "实时GIS":
                                case "缺陷GIS":
                                    getC3AlarmInfo(this);
                                    break;

                            }


                        }
                        catch (ex) { }

                    }
                })

            }

        }

        SetAlarmNumber();


    }
}



function RefreshAlarm() {


    var _org = '', _line = '', _locatype = '', _OrgType = '';

    switch (pageName) {
        case '44在线实时监控':
            _org = $("#OrgCode", window.parent.document).html().trim();
            _line = $("#LineCode", window.parent.document).html().trim();
            _locatype = $("#LocoCode", window.parent.document).html().trim();
            _OrgType = $("#OrgType", window.parent.document).html().trim();
            break;
    }


    var _IscheckType1 = $("#cb_type1").is(':checked');
    var _IscheckType2 = $("#cb_type2").is(':checked');
    var _IscheckType3 = $("#cb_type3").is(':checked');
    var _Ischeck_new = $("#cb_new").is(':checked');
    var _Ischeck_sure = $("#cb_sure").is(':checked');
    var _Ischeck_plan = $("#cb_plan").is(':checked');
    var _Ischeck_check = $("#cb_check").is(':checked');
    var _Ischeck_close = $("#cb_close").is(':checked');

    var severity = '';
    if (_IscheckType1 && _IscheckType2 && _IscheckType3) {

    }
    else {
        if (_IscheckType1) { severity += ",一类" }
        if (_IscheckType2) { severity += ",二类" }
        if (_IscheckType3) { severity += ",三类" }
        if (severity != '') { severity = severity.substr(1, severity.length - 1); }
    }

    var status = '';
    if (_Ischeck_new) { status += "AFSTATUS01" }
    if (_Ischeck_sure) { status += "AFSTATUS03" }
    if (_Ischeck_plan) { status += "AFSTATUS04" }
    if (_Ischeck_check) { status += "AFSTATUS07" }
    if (_Ischeck_close) { status += "AFSTATUS05" }


    //报警
    // getMisC3AlarmPoint(map, "", "", "", "1", _line, _org, _OrgType, _locatype);

     //var json = getAlarmJson(opts.deviceid, opts.startTime, opts.endTime, opts.line, opts.org, opts.OrgType, opts.locatype, severity, status);
    //alarmJson = json;

    switch (pageName) {
        case '44在线实时监控':
        case "实时GIS":
            getAlarmJson_ss({
                line: _line,
                org: _org,
                OrgType: _OrgType,
                locatype: _locatype,
                severity: severity,
                status: status,
                LoadCallback: function (_json) {

                    alarmJson = _json;
                    AddMarks_alarm_byJSON(_json)
                }

            })
            break;
        case "缺陷GIS":

            var startdate = document.getElementById('startdate').value;
            var enddate = document.getElementById('enddate').value;

            if (startdate == "") {
                ymPrompt.errorInfo('查询开始时间不能为空', null, null, '提示信息', null);
            }
            else if (enddate == "") {
                ymPrompt.errorInfo('查询结束时间不能为空', null, null, '提示信息', null);
            }
            else if (enddate < startdate) {
                ymPrompt.errorInfo('结束时间必须比开始时间大~！！', null, null, '提示信息', null);
                return;
            }
            else {

                //   bqxMapbind(mapLevel, startdate, enddate);

                getAlarmJson_where({
                    startTime: startdate,
                    endTime: enddate,
                    LoadCallback: function (json) {

                        AddMarks_alarm_byJSON(json);
                    }
                })

            }


            break;

    }








    switch (pageName) {
        case '44在线实时监控':
            GetalarmList(); //重新加载报警列表。
            break;
    }

}

function RefreshPosition()
{
    var _Ischeckstation = $("#cb_station").is(':checked');
    var _org = '', _line = '', _locatype = '', _OrgType = '';
    switch (pageName) {
        case '44在线实时监控':
            _org = $("#OrgCode", window.parent.document).html().trim();
            _line = $("#LineCode", window.parent.document).html().trim();
            _locatype = $("#LocoCode", window.parent.document).html().trim();
            _OrgType = $("#OrgType", window.parent.document).html().trim();
            break;
    }

    LoadPosition({
        Ischeckstation: _Ischeckstation, //显示站点 
        _org: _org,
        _line: _line,
        _locatype: _locatype,
        _OrgType: _OrgType
    });
}



//异步调用，取带条件缺陷json.并处理。
function getAlarmJson_where(options) {

    var defaults = {
        LeNum: "3",
        startTime: '',
        endTime: "",
        LoadCallback: function () { }//加载完成事件
    };

    var opts = $.extend(defaults, options);

    //deviceid, startTime, endTime, LeNum, lineCode

    var LeNum = opts.LeNum;
    var lineCode = opts.lineCode;
    var startTime = opts.startTime;
    var endTime = opts.endTime;
    var deviceid = opts.deviceid;


    var url = "";
    var ju = document.getElementById('juselect').value; //局
    var duan = document.getElementById('duanselect').value; //段
    var chejian = document.getElementById('chejianselect').value; //车间
    var gongqu = document.getElementById('gongquselect').value; //工区
    var line = document.getElementById('ddl_Line').value; //线路
    var xb = document.getElementById('ddlxb').value; //行别
    var txtqz = document.getElementById('txtqz').value; //区站
    var txtstartkm = document.getElementById('txtstartkm').value; //开始公里标
    var txtendkm = document.getElementById('txtendkm').value; //开始公里标
    var ddllx = document.getElementById('dll_lx').value; //检测类型 1C 2C 3C
    var zhuangtai = document.getElementById('citySel').value; //报警类型
    var dllzt = getSelectedItem(document.getElementById('ddlzt'));
    var startdate = document.getElementById('startdate').value;
    var enddate = document.getElementById('enddate').value;
    if (startdate != null && startdate != "" && enddate != null && enddate != "") {
        if (enddate < startdate) {
            ymPrompt.errorInfo('结束时间必须比开始时间大~！！', null, null, '提示信息', null);
            return;
        }
    }
    var txtpole = document.getElementById('txtpole').value;
    url = '/Common/MGIS/ASHX/MisAlarm/BMapC3DataPoint.ashx?type=2&duan=' + escape(duan) +
        '&chejian=' + escape(chejian) +
        '&ju=' + escape(ju) +
        '&gongqu=' + escape(gongqu) +
        '&line=' + escape(line) +
        '&xb=' + escape(xb) +
        '&txtqz=' + escape(txtqz) +
        '&txtstartkm=' + txtstartkm +
        '&txtendkm=' + txtendkm +
        '&ddllx=' + ddllx +
        '&dllzt=' + dllzt +
        '&startTime=' + startdate +
        '&endTime=' + enddate +
        '&txtpole=' + txtpole +
        '&zhuangtai=' + escape(zhuangtai) +
        '&LeNum=' + LeNum +
        '&Category_Code=' + GetQueryString("Category_Code") +
        '&temp=' + Math.random();


    var json;
    $.ajax({
        type: "POST",
        url: url,
        async: true,
        cache: true,
        success: function (result) {
            if (result != "") {
                json = eval('(' + result + ')');


                opts.LoadCallback(json);

            }

        }
    });
    return json;
};

//异步调用，得到实时GIS数据，并执行回调。
function getAlarmJson_ss(options) {

    //deviceid, startTime, endTime, lineCode, _org, _OrgType, _locatype, severity, status

    var defaults = {
        deviceid: "",
        startTime: '',
        endTime: "",
        lineCode: '',
        _org: '',
        _OrgType: '',
        _locatype: '',
        severity: '',
        status: '',
        LoadCallback: function () { }
    };

    var opts = $.extend(defaults, options);

    var url = "/Common/MGIS/ASHX/MisAlarm/BMapC3DataPoint.ashx?type=2&deviceid=" + opts.deviceid + "&LineCode=" + opts.lineCode + "&startTime=" + opts.startTime + "&endTime=" + opts.endTime + "&LeNum=1&Org=" + opts._org + "&OrgType=" + opts._OrgType + "&LocaTpye=" + opts._locatype + "&Category_Code=" + GetQueryString("Category_Code");

    if (opts.severity != undefined) {
        url += "&severity=" + opts.severity;
    }

    if (opts.status != undefined) {
        url += "&status=" + opts.status
    }

    var json;
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        cache: true,
        success: function (result) {
            if (result != "") {
                json = eval('(' + result + ')');

                opts.LoadCallback(json);
            }

        }
    });
    return json;
}


//刷新设备
function RefreshLoco() {

    var _org = '', _line = '', _locatype = '', _OrgType = '';
    switch (pageName) {
        case '44在线实时监控':
            _org = $("#OrgCode", window.parent.document).html().trim();
            _line = $("#LineCode", window.parent.document).html().trim();
            _locatype = $("#LocoCode", window.parent.document).html().trim();
            _OrgType = $("#OrgType", window.parent.document).html().trim();
            break;
    }


    LoadLoca({
        line: _line, //线路 
        org: _org,
        locatype: _locatype,
        OrgType: _OrgType
    })

    document.cookie = "C3Sms=" + datehhssNowStr();

    switch (pageName) {
        case '44在线实时监控':
            GetlocaList(); // 机车在地图上加载完成后，加载机车列表。 
            break;
    }



}

//定时刷新设备
function refushLocos() {
    var smstime = "";
    var strCookie = document.cookie;
    var arrCookie = strCookie.split(";");
    for (var i = 0; i < arrCookie.length; i++) {

        var arr = arrCookie[i].split("=");
        if (arr[0].replace(/[ ]/g, "") == "C3Sms") {
            smstime = arr[1];
        }
    }

    responseData = XmlHttpHelper.transmit(false, "get", "text", "/Common/MGIS/ASHX/Cue/Cue.ashx?Time=" + smstime + "&Category_Code=" + GetQueryString("Category_Code") + '&type=Loco&temp=' + Math.random(), null, null);
    var responseDatalist = responseData;
    if (responseDatalist > 0) {
        RefreshLoco();
    }
};




//消息提示框 播放声音
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
}
//消息提示框
function hid_pop() {//隐藏窗口
    var div = document.getElementById('div1');
    div.innerHTML = "";
    document.getElementById("winpop").style.display = "none";
}
function playhid_pop() {//
    var div = document.getElementById('div1');
    div.innerHTML = "";
}
function show_pop() {




    responseData = XmlHttpHelper.transmit(false, "get", "text", "/Common/MGIS/ASHX/Cue/Cue.ashx?Time=" + lastDateTime_alarmNew + "&Category_Code=" + GetQueryString("Category_Code") + '&type=Alarm&temp=' + Math.random(), null, null);
    var responseDatalist = responseData.split('!@#');
    if (responseDatalist[0] > 0) {


        allowUpdate_lastDateTime_alarmNew = true;
        RefreshAlarm();

        play_click(this, '/Common/MGIS/mp3/140_SCREAM.mp3');
        document.getElementById("winpop").style.display = "block";
        document.getElementById("AlarmSpan").innerHTML = responseDatalist[1];
        setTimeout("playhid_pop()", second); //30秒后自动关闭
        i++;
        xmlHttp = null;
    }
    xmlHttp = null;
    responseData = null;
}


////刷新设备和信息框提示方法
function RefsetInterval(type) {

    setshow = setInterval('show_pop()', showtime);
    if (type != "small")
        setloco = setInterval('refushLocos()', locotime);
}

////关闭定时器重新启用定时器
function AgainRefsetInterval() {
    clearInterval(setshow); //关闭信息框定时器
    clearInterval(setloco); //关闭刷新设备定时器

    setshow = setInterval('show_pop()', showtime);
    setloco = setInterval('refushLocos()', locotime);
}

