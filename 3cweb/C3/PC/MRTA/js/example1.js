var BMapExt;
var map;
var container;
var point;
(function () {
    require.config({
        paths: {
            echarts: 'js'
        },
        packages: [
            {
                name: 'BMap',
                location: 'js',
                main: 'main'
            }
        ]
    });
    require(
    [
        'echarts',
        'BMap',
        'echarts/chart/map'
    ],
    function (echarts, BMapExtension) {
        $('#main').css({
            height: $('body').height(),
            width: $('body').width()
        });

        // 初始化地图
        BMapExt = new BMapExtension($('#main')[0], BMap, echarts, {
            enableMapClick: false
        });
        map = BMapExt.getMap();
        container = BMapExt.getEchartsContainer();

        var startPoint = {

            x: 117.104171,
            y: 40.008703
        };
        point = new BMap.Point(startPoint.x, startPoint.y);
        map.centerAndZoom("武汉", 6);
        map.enableScrollWheelZoom(true);
        //-------样式及地图屏蔽操作-------//

        map.enableKeyboard();
        map.disableDoubleClickZoom();
        map.addControl(bmapUserTopOneRightInfo);
        map.addControl(new BMap.OverviewMapControl());

        // 地图自定义样式
        setMapStyle("off");
    }
);
})();

//设置地图样式（type: off铁路隐藏；on铁路显示）
function setMapStyle(type) {
    map.setMapStyle({
        styleJson: [
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
                  "visibility": type

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
                  "visibility": "off"
              }
          }
            ]
    });
}
//获取C3趋势图JSON串 
function getNodes(type, code, _type) {
    var url = "RemoteHandlers/GetC3Position.ashx?type=" + type + "&Code=" + code + "&_type=" + _type;
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
};
//加载基础数据和画图
//type:类型（line,bureau）;code:编号（线路编号或者设备编号）；level:地图初始层次；name:标题（组织机构和线路名称）
function ssa(type, code, level, name) {
    var lineCenterjson = "";
    var nodes = ""; //所有站点坐标
    var position = ""; //所有连线信息
    var title = name; //设置标题
    nodes = getNodes("Position", code, type); //站点信息
    position = getNodes(type, code); //连线
    //删除所有信息 包含站点和缺陷信息
    for (var j = 0; j < map.getOverlays().length; j++) {

        if (map.getOverlays()[j].type == "position" || map.getOverlays()[j].type == "Alarm") {
            map.removeOverlay(map.getOverlays()[j]);
            j = j - 1; //删除一个以后数组自动减一
        }

    }
    var i = 0;
    var point; //坐标用于总公司和局视图时的中心点坐标
    for (var key in nodes) {
        //只计算一次
        if (i == 0) {
            point = new BMap.Point(nodes[key][0], nodes[key][1]);    // 创建点坐标
        }
        //画站点
        getBmapOnePoints(key, nodes[key]);
    }
    //如果是线路不用定位中心点 因为线路的中心点和组织的中心点算法不一致
    if (type != "line") {
        map.centerAndZoom(point, level);
        setMapStyle('off');
    }
    //线路层次时 不用连线  
    if (type == "line") {
        setMapStyle('on');
        position = "";
    }
    //数据集
    option = {

        color: ['gold', 'aqua', 'lime'],
        title: {
            text: title,
            subtext: '',
            x: '160',
            y: '20',
            textStyle: {
                color: '#fff'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: function (v) {
                return v.data.title + '最近一天缺陷数量有' + v.data.value + '条';
            }
        },
        legend: {
            orient: 'vertical',
            x: 'left',
            data: [],
            selectedMode: 'single',

            textStyle: {
                color: '#fff'
            }
        },

        toolbox: {
            show: true,
            orient: 'vertical',
            x: 'right',
            y: 'center'
        },
        dataRange: {
            min: 0,
            max: 20,
            x: 'right',
            calculable: true,
            color: ['red', '#ff3333', '#ff3333', '#FFA500', '#FFA500', '#FFFF00', '#FFFF00', '#FFFF00', 'green'],
            textStyle: {
                color: '#fff'
            }
        },
        series: [
        {
            name: '总公司',
            type: 'map',
            mapType: 'none',
            itemStyle: {
                normal: {
                    borderColor: 'rgba(100,149,237,1)',
                    borderWidth: 0.5,
                    areaStyle: {
                        color: '#1b1b1b'
                    }
                }
            },
            data: [],
            geoCoord:
              nodes
            ,
            markLine: {
                smooth: true,
                symbolSize: 1,
                smooth: true,
                effect: {
                    show: true,
                    scaleSize: 1,
                    period: 10,
                    color: '#fff',
                    shadowBlur: 10
                },
                itemStyle: {
                    normal: {
                        borderWidth: 2,
                        lineStyle: {
                            type: 'solid',
                            shadowBlur: 10
                        }
                    }
                },
                data: position
            },
            markPoint: {
                symbol: 'emptyCircle',
                symbolSize: function (v) {
                    return 10 + v / 10
                },
                effect: {
                    show: true,
                    shadowBlur: 0
                },
                itemStyle: {
                    normal: {
                        label: { show: false }
                    }
                },
                data: [
                ]
            }

        }
    ]
    };
    var myChart = BMapExt.initECharts(container);
    BMapExt.setOption(option);
    var ecConfig = require('echarts/config');
    function eConsole(param) {
        if (typeof param.seriesIndex != 'undefined') {
            loadPieCJ(param);
        }
    }
    //绑定点击事件
    myChart.on(ecConfig.EVENT.CLICK, eConsole);
}
//站点
function getBmapOnePoints(name, value) {
    var Point = new BMap.Point(parseFloat(value[0]), parseFloat(value[1]));
    var labelMark = new BMap.Label(name, { point: Point });
    labelMark.setStyle({
        color: "white",
        fontSize: "16px",
        backgroundColor: "rgba(15,15,17,0)",
        border: "0",
        fontWeight: "bold"
    });
    labelMark.setOffset(new BMap.Size(-12, -18));
    var icon = new BMap.Icon("/Common/MRTA/img/station2.png", new BMap.Size(20, 30));
    var marker = new BMap.Marker(Point, { icon: icon });
    marker.setLabel(labelMark);
    marker.type = "position";
    map.addOverlay(marker);
};

function bmapUserTopOneRightInfo() {
    // 设置默认停靠位置和偏移量
    this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
    this.defaultOffset = new BMap.Size(5, 5);
}
//单击事件
function loadPieCJ(e) {
    if (e.data.type == 1) {
        var zb = e.data.point;
        var point = new BMap.Point(zb.split(',')[1], zb.split(',')[0]);    // 创建点坐标
        map.centerAndZoom(point, 9);
        ssa('line', e.data.code, 9, e.data.title);
        var c3alarm = getMisC3AlarmPoint(map, "", QdatehhssNowStr(), datehhssNowStr(), "1", e.data.code, 10, "", "", "");
    }
}
//设置主菜单
function LoadOrg() {
    var url = "RemoteHandlers/GetC3Position.ashx?type=Org";
    var json;
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        cache: true,
        success: function (result) {
            $('#box_ul').html(result);
        }
    });
}
//缺陷信息
function getMisC3AlarmPoint(map, deviceid, startTime, endTime, leNum, _line, _org, _OrgType, _locatype) {
    var json = getMisC3AlarmPointsData(deviceid, startTime, endTime, leNum, _line, _org, _OrgType, _locatype);
    alarmJson = json;
    var markers = [];
    maps = map;
    var markerClusterer;
    if (json != undefined) {
        for (var i = 0; i < json.length; i++) {
            if (json[i].CATEGORY_CODE == "6C") {
                if (leNum == "3") { } else {
                    continue;
                }
            }
            if (json[i].GIS_X != "0") {
                var Point = new BMap.Point(json[i].GIS_X, json[i].GIS_Y);
                markers.push(new BMap.Marker(Point));
                var icon = "";
                if (json[i].SEVERITY == "一类")
                    icon = new BMap.Icon("/Common/MGIS/img/ico1.gif", new BMap.Size(20, 20));
                else if (json[i].SEVERITY == "二类")
                    icon = new BMap.Icon("/Common/MGIS/img/ico2.gif", new BMap.Size(20, 20));
                else if (json[i].SEVERITY == "三类")
                    icon = new BMap.Icon("/Common/MGIS/img/ico3.gif", new BMap.Size(20, 20));

                var marker = new BMap.Marker(Point, { icon: icon });
                //marker.setLabel(labelMark);
                map.addOverlay(marker);
                marker.disableDragging(true);
                marker.json = json[i];
                marker.type = "Alarm";
                marker.id = json[i].ID;
                marker.addEventListener("click", getC3AlarmInfo);
                //marker.addEventListener("dblclick", getC3AlarmInfo2);
            } else {
                var Point = new BMap.Point(json[i].GIS_X_O, json[i].GIS_Y_O);
                BMap.Convertor.translate(Point, 0, GPSZH, i)
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
    return json;
};
//坐标转换后画缺陷
GPSZH = function (point, num) {
    var icon = "";
    if (alarmJson[num].SEVERITY == "一类")
        icon = new BMap.Icon("/Common/MGIS/img/ico1.gif", new BMap.Size(20, 20));
    else if (alarmJson[num].SEVERITY == "二类")
        icon = new BMap.Icon("/Common/MGIS/img/ico2.gif", new BMap.Size(20, 20));
    else if (alarmJson[num].SEVERITY == "三类")
        icon = new BMap.Icon("/Common/MGIS/img/ico3.gif", new BMap.Size(20, 20));

    var Point = new BMap.Point(alarmJson[num].GIS_X_O, alarmJson[num].GIS_Y_O);
    var marker = new BMap.Marker(point, { icon: icon });
    maps.addOverlay(marker);
    marker.jsons = alarmJson[num];
    marker.type = "Alarm";
    marker.addEventListener("click", getC3AlarmInfo);
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

//获取当前系统前日日期
function QdatehhssNowStr() {
    var d = new Date();
    d.setDate(d.getDate());
    var ret = d.getFullYear() + "-"
    ret += ("00" + (d.getMonth() + 1)).slice(-2) + "-"
    ret += ("00" + (d.getDate() - 1)).slice(-2) + " "
    ret += ("00" + d.getHours()).slice(-2) + ":"
    ret += ("00" + d.getMinutes()).slice(-2) + ":"
    ret += ("00" + d.getSeconds()).slice(-2) + " "
    return ret;
};

function getC3AlarmInfo(e) {
    var id = this.json.ALARM_ID;
    var url = "/C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=";
    var HTMLURL = url + id + "" + '&v=' + version;
    window.open(HTMLURL, "_blank");
    var point = new BMap.Point(this.json.GIS_X, this.json.GIS_Y);    // 创建点坐标
    map.panTo(point);
}