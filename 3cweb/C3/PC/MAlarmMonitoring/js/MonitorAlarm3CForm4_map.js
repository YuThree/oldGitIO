var map_wz = '';
var map_gis_x = '';
var map_gis_y = '';
var map_gis_x_o = '';
var map_gis_y_o = '';
var severity_code = '';

var OnClickNumber = 1;
var map;
var point1;

$(document).ready(function () {
    map_wz = GetQueryString('map_wz');
    map_gis_x_o = GetQueryString('map_gis_x_o');
    map_gis_y_o = GetQueryString('map_gis_y_o');
    map_gis_x = GetQueryString('map_gis_x');
    map_gis_y = GetQueryString('map_gis_y');
    severity_code = GetQueryString('severity_code');

    $("#_WZ").html(map_wz);
    var debug = getConfig("debug");
    if (debug == '1') {
        $('#GPSshow,#GPSrefresh').css('display', 'inline-block')
    }
   
    $("#gisX").html(map_gis_x_o);
    $("#gisY").html(map_gis_y_o);

    if (map_gis_x_o == 0 && map_gis_y_o == 0) {
        layer.msg("无效坐标");
    }
    $('[rel="tooltip"],[data-rel="tooltip"]').tooltip({ "placement": "right", delay: { show: 0, hide: 0 }, });
    var i = true;
    $("#GPSrefresh").click(function () {
        if (i) {
            $("#GPSshow").html('纬经度( <span id="gisY"></span>,<span id="gisX"></span> )');
            $("#gisX").html(map_gis_x_o);
            $("#gisY").html(map_gis_y_o);
            i = !i;
        } else {
            $("#GPSshow").html('经纬度( <span id="gisX"></span>,<span id="gisY"></span> )');
            $("#gisX").html(map_gis_x_o);
            $("#gisY").html(map_gis_y_o);
            i = !i;
        }
    });
});
$(function () {
    Map(); //加载地图
});
function Map() {

    if (OnClickNumber == 1) {
        Bmaps();
    }

    $('#box_gis').modal().css({
        width: 'auto',
        'margin-left': function () {
            return -($(this).width() / 2);
        },
        'margin-top': function () {
            return -($(this).height() / 2);
        }
    });

    // document.getElementById('modal-22256').click();

    map.centerAndZoom(point1, 9);

    setTimeout(function () {
        $('.anchorBL,. anchorBL').hide();
        //   $('#mapDiv span').hide();
    }, 500)

};

function Bmaps() {
    OnClickNumber = OnClickNumber + 1;
    //var map = new BMap.Map("mapDiv", { mapType: BMAP_HYBRID_MAP }); // 创建Map实例
    //   map = new BMap.Map("mapDiv"); // 创建Map实例
    map = new BMap.Map("mapDiv", { mapType: BMAP_HYBRID_MAP }); // 创建Map实例
    var point;
    if (map_gis_x != "0") {
        point = new BMap.Point(map_gis_x, map_gis_y);    // 创建点坐标
        point1 = new BMap.Point(parseFloat(map_gis_x) - 1.54, parseFloat(map_gis_y) + 0.85);    // 创建点坐标
        map.clearOverlays();    //清除地图上所有覆盖物
        map.centerAndZoom(point1, 9); // 初始化地图，设置中心点坐标和地图级别。

        map.enableScrollWheelZoom();
        map.enableKeyboard();
        map.disableDoubleClickZoom();
        var imgUrl = "/Common/img/baojing.gif";
        if (severity_code == "一类") { imgUrl = "/Common/MGIS/img/ico1.png"; }
        else if (severity_code == "二类") { imgUrl = "/Common/MGIS/img/ico2.png"; }
        else { imgUrl = "/Common/MGIS/img/ico3.png"; }
        var icon = new BMap.Icon(imgUrl, new BMap.Size(Ico_alarm_width, Ico_alarm_heigth));
        var marker = new BMap.Marker(point, { icon: icon });
        marker.setOffset(new BMap.Size(Ico_alarm_left, Ico_alarm_top));
        map.addOverlay(marker);

    } else {
        point = new BMap.Point(map_gis_x_o, map_gis_y_o);    // 创建点坐标
        point1 = new BMap.Point(parseFloat(map_gis_x_o) - 1.54, parseFloat(map_gis_y_o) + 0.85);    // 创建点坐标
        map.clearOverlays();    //清除地图上所有覆盖物
        map.centerAndZoom(point1, 9); // 初始化地图，设置中心点坐标和地图级别。

        map.enableScrollWheelZoom();
        map.enableKeyboard();
        map.disableDoubleClickZoom();

        //var Point = new BMap.Point(map_gis_x_o, map_gis_y_o);
        //BMap.Convertor.translate(Point, 0, GPSZH, 0)
    }
    map.addControl(new BMap.MapTypeControl({ anchor: BMAP_ANCHOR_TOP_LEFT }));    //左上角，默认地图控件

};
GPSZH = function (point, num) {
    var icon = new BMap.Icon("/Common/img/baojing.gif", new BMap.Size(24, 32));
    var marker = new BMap.Marker(point, { icon: icon });
    map.addOverlay(marker);
};
function translate(point, type, callback, j) {
    var callbackName = 'cbk_' + Math.round(Math.random() * 10000);    //随机函数名
    var xyUrl = "http://api.map.baidu.com/ag/coord/convert?from=" + type + "&to=4&x=" + point.lng + "&y=" + point.lat + "&callback=BMap.Convertor." + callbackName;
    //动态创建script标签
    load_script(xyUrl);
    BMap.Convertor[callbackName] = function (xyResult) {
        delete BMap.Convertor[callbackName];    //调用完需要删除改函数
        var point = new BMap.Point(xyResult.x, xyResult.y);
        callback && callback(point, j);
    }
};
function bmapUserTopOneRightInfo() {
    // 设置默认停靠位置和偏移量
    this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
    this.defaultOffset = new BMap.Size(5, 5);

};
