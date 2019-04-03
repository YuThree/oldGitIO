/*========================================================================================*
* 功能说明：百度地图API，抽象出的业务方法类
* 注意事项：
* 作    者： wcg
* 版本日期：2013年5月9日
* 变更说明：
* 版 本 号： V1.0
*=======================================================================================*/
//百度地图加载-第一层
var map;
function bMapbind(mapLevel) {
    document.cookie = "C3Sms=0";
    var type = getConfig('mapType');
    if (type == "1") //卫星
    {//map = new BMap.Map("mapDiv", { mapType: BMAP_HYBRID_MAP }); // 创建Map实例
        try {
            map = new BMap.Map("mapDiv", { mapType: BMAP_HYBRID_MAP }); // 创建Map实例 
        } catch (e) {
            console.log('百度地图加载失败！')
            return
        }
    }
    else //地图
    { //map = new BMap.Map("mapDiv", { mapType: BMAP_NORMAL_MAP }); // 创建Map实例
        try {
            map = new BMap.Map("mapDiv", { mapType: BMAP_NORMAL_MAP }); // 创建Map实例 
        } catch (e) {
            console.log('百度地图加载失败！')
            return
        }
    }
    mapLevel = getConfig('mapLevel');
    getMislineSCenterPoints(Number(mapLevel), map);
    //添加地图控件
    //bmapUserTopOneRightInfo = new bmapUserTopOneRightInfo();
    map.addControl(bmapUserTopOneRightInfo);
    map.addControl(new BMap.OverviewMapControl());
    map.level = "1";
    //由于有3D图，需要设置城市哦
    var cr = new BMap.CopyrightControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT });
    map.addControl(cr); //添加版权控件
    cr.addCopyright({ id: 1, content: "<a href='http://www.railwaytec.com'></a>" });
    if (getCookieValue("GISSmall") == "small") {
        map.addControl(new BMap.MapTypeControl({ anchor: BMAP_ANCHOR_TOP_RIGHT }));   //左上角，默认地图控件

        var cr = new BMap.CopyrightControl({ anchor: BMAP_ANCHOR_TOP_LEFT });   //设置
        map.addControl(cr); //添加

        var bs = map.getBounds();   //返回地图可视区域
        cr.addCopyright({ id: 1, content: "  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href='#' class='btn btn-primary' onclick=' MonitorindexJtopo()' style='background: #4A6F9C;color:White; display:none;'>拓扑模式</a>", bounds: bs });    //Copyright(id,content,bounds)类作为CopyrightControl.addCopyright()方法的参数

    } else {
        map.addControl(new BMap.MapTypeControl({ anchor: BMAP_ANCHOR_TOP_RIGHT, offset: new BMap.Size(120, 15), }));   //左上角，默认地图控件
    }
};

//百度地图加载-第二层
function bMapTwobind(lineid, map, mapLevel, QX) {
    if (QX != "Repeat")
        map.clearOverlays();    //清除地图上所有覆盖物
    document.cookie = "C3Sms=0";
    getMislineCenterPoints(lineid, mapLevel, map, QX);
};
function ZoomControl() {
    // 默认停靠位置和偏移量
    this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
    this.defaultOffset = new BMap.Size(10, 10);
};
//百度地图加载-第三层
function bMapThreebind(e, map, mapLevel, QZname) {
    document.cookie = "C3Sms=0";
    //需要考虑区站ID如何获取？
    var QZStationSectionName = "";
    var QZStationSectionCode = "";
    if (QZname != null) {
        QZStationSectionName = e.target.josnS.StationSectionName + "*" + e.target.josn.StationSectionName;
        QZStationSectionCode = e.target.josnS.POSITION_CODE + "*" + e.target.josn.POSITION_CODE;
    } else {
        QZStationSectionName = e.target.josn.StationSectionName;
        QZStationSectionCode = e.target.josn.POSITION_CODE;
    }
    getMisPoleCenterPoints(QZStationSectionName, QZStationSectionCode, e.target.josn.MIS_LINE_ID, mapLevel + 9, map);

};
//第二个页面缺陷GIS

var QXmap;
function bqxMapbind(mapLevel, startTime, endTime) {
    document.cookie = "C3Sms=0";
    // QXmap = new BMap.Map("qxDiv", { mapType: BMAP_HYBRID_MAP }); // 创建Map实例
    try {
        QXmap = new BMap.Map("qxDiv", { mapType: BMAP_HYBRID_MAP }); // 创建Map实例 
    } catch (e) {
        console.log('百度地图加载失败！')
        return
    }

    mapLevel = getConfig('mapLevel');
    getxqMislineSCenterPoints(Number(mapLevel), QXmap, startTime, endTime);
    QXmap.addControl(new BMap.OverviewMapControl());
    QXmap.addControl(new BMap.MapTypeControl({ anchor: BMAP_ANCHOR_TOP_RIGHT, offset: new BMap.Size(120, 15), }));    //左上角，默认地图控件
    QXmap.setCurrentCity("武汉");   //由于有3D图，需要设置城市哦
    QXmap.enableScrollWheelZoom();
    QXmap.enableKeyboard();
    QXmap.enableDragging(false);
    QXmap.disableDoubleClickZoom();
    var cr = new BMap.CopyrightControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT });
    QXmap.addControl(cr); //添加版权控件
    cr.addCopyright({ id: 1, content: "<a href='http://www.railwaytec.com'></a>" });
};


var RepeatMap;
var Repeatmarker = "";
var overlays = [];
var drawingManager;
///重复告警
function RepeatMapbind(alarmid, linecode, xb, startdate, enddate, txtqz, start_km, end_km, gis_x1, gis_y1, gis_x2, gis_y2, zt, afcode, distance, count, type) {
   // var map = new BMap.Map("repeatMapDiv", { mapType: BMAP_HYBRID_MAP }); // 创建Map实例
    try {
       var map = new BMap.Map("repeatMapDiv", { mapType: BMAP_HYBRID_MAP }); // 创建Map实例 
    } catch (e) {
        console.log('百度地图加载失败！')
        return
    }
    RepeatMap = map;
    var mapStyle = {
        //features: ["road", "building", "water", "land"], //隐藏地图上的poi
        features: ["water", "land"], //隐藏地图上的poi
        style: "normal"  //设置地图风格为高端黑
    }
    map.setMapStyle(mapStyle);
    map.clearOverlays();
    var overlaycomplete = function (e) {
        clearAll();
        overlays.push(e.overlay);
        var point1 = e.overlay.getPath()[0];
        var point2 = e.overlay.getPath()[2];
        window.parent.setGPS(point1.lng, point1.lat, point2.lng, point2.lat);
        // map.panTo(point1);
    };
    var styleOptions = {
        strokeColor: "blue",    //边线颜色。
        fillColor: "blue",      //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 3,       //边线的宽度，以像素为单位。
        strokeOpacity: 0.4,    //边线透明度，取值范围0 - 1。
        fillOpacity: 0.1,      //填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' //边线的样式，solid或dashed。
    }
    //实例化鼠标绘制工具
    drawingManager = new BMapLib.DrawingManager(map, {
        isOpen: false, //是否开启绘制模式
        drawingType: BMAP_DRAWING_MARKER, enableDrawingTool: true,
        enableDrawingTool: true, //是否显示工具栏
        enableCalculate: false,
        drawingToolOptions: {
            anchor: BMAP_ANCHOR_TOP_RIGHT,
            offset: new BMap.Size(5, 5),
            drawingTypes: [
                BMAP_DRAWING_MARKER
            ],
            drawingModes: [BMAP_DRAWING_RECTANGLE]
        },
        rectangleOptions: styleOptions //矩形的样式
    });
    //添加鼠标绘制工具监听事件，用于获取绘制结果
    drawingManager.addEventListener('overlaycomplete', overlaycomplete);
    // getBmapRepeat(alarmid, linecode, xb, startdate, enddate, txtqz, start_km, end_km, gis_x1, gis_y1, gis_x2, gis_y2, zt, afcode, distance, count, type);
    map.addControl(bmapUserTopOneRightInfo);
    map.addControl(new BMap.OverviewMapControl());
    //由于有3D图，需要设置城市哦
    var cr = new BMap.CopyrightControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT });
    map.addControl(cr); //添加版权控件
    cr.addCopyright({ id: 1, content: "<a href='http://www.railwaytec.com'></a>" });
    map.addControl(new BMap.MapTypeControl({ anchor: BMAP_ANCHOR_TOP_RIGHT, offset: new BMap.Size(150, 15), }));   //左上角，默认地图控件

    var cr = new BMap.CopyrightControl({ anchor: BMAP_ANCHOR_TOP_LEFT });   //设置
    map.addControl(cr); //添加

    map.clearOverlays();    //清除地图上所有覆盖物
    var point = new BMap.Point(getConfig('CenterLon'), getConfig('CenterLat'));    // 创建点坐标
    // 初始化地图，设置中心点坐标和地图级别。
    map.centerAndZoom(point, 10);
    map.enableScrollWheelZoom();
    map.enableKeyboard();
    map.disableDoubleClickZoom();
    var bs = map.getBounds();   //返回地图可视区域
    cr.addCopyright({ id: 1, content: "  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href='#' class='btn btn-primary' onclick=' window.parent.frameJtopo()' style='background: #4A6F9C;color:White; display:none;'>拓扑模式</a>", bounds: bs });    //Copyright(id,content,bounds)类作为CopyrightControl.addCopyright()方法的参数

};

//查询重复告警
function getBmapRepeat(alarmid, linecode, xb, jb, org_code, org_name, org_type, locomotive_code, startdate, enddate, txtqz, start_km, end_km, gis_x1, gis_y1, gis_x2, gis_y2, zt, afcode, distance, count, type) {

    drawingManager.close();
   
    getRepeatAlarmInfo(RepeatMap, alarmid, linecode, xb, jb, org_code, org_name, org_type, locomotive_code, startdate, enddate, txtqz, start_km, end_km, gis_x1, gis_y1, gis_x2, gis_y2, zt, afcode, distance, count, type);//BMapC3中
}


function clearAll() {
    for (var i = 0; i < overlays.length; i++) {
        RepeatMap.removeOverlay(overlays[i]);
    }
    overlays.length = 0
};

//缺陷统计
function QxTjMapbind(linecode, startTime, endTime, SEVERITY, QX) {
    //var map = new BMap.Map("qxTjMapDiv", { mapType: BMAP_HYBRID_MAP }); // 创建Map实例
    try {
       var map = new BMap.Map("qxTjMapDiv", { mapType: BMAP_HYBRID_MAP }); // 创建Map实例 
    } catch (e) {
        console.log('百度地图加载失败！')
        return
    }

    var mapStyle = {
        //features: ["road", "building", "water", "land"], //隐藏地图上的poi
        features: ["water", "land"], //隐藏地图上的poi
        style: "normal"  //设置地图风格为高端黑
    }
    map.setMapStyle(mapStyle);
    map.clearOverlays();
    // bMapTwobind(linecode, map, 6, QX);
    var point = new BMap.Point(getConfig('CenterLon'), getConfig('CenterLat'));    // 创建点坐标
    // 初始化地图，设置中心点坐标和地图级别。
    map.centerAndZoom(point, 8);
    map.enableScrollWheelZoom();
    map.enableKeyboard();
    map.disableDoubleClickZoom();
    var json = getQxTjAlarmInfo(map, linecode, startTime, endTime, SEVERITY);
    if (json != null && json.length > 0)
    {
        var Point = new BMap.Point(json[0].GIS_X, json[0].GIS_Y);
        map.panTo(Point);
    }
    map.addControl(bmapUserTopOneRightInfo);
    map.addControl(new BMap.OverviewMapControl());
    map.addControl(new BMap.MapTypeControl({ anchor: BMAP_ANCHOR_TOP_RIGHT }));    //左上角，默认地图控件
    //由于有3D图，需要设置城市哦
    var cr = new BMap.CopyrightControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT });
    map.addControl(cr); //添加版权控件
    cr.addCopyright({ id: 1, content: "<a href='http://www.railwaytec.com'></a>" });
};





/*========================================================================================*
* 功能说明：自己内部功能  GPS和惯导数据对比 和 测距
* 注意事项：
* 作    者： DJ
* 版本日期：2014年3月5日
* 变更说明：
* 版 本 号： V1.0
*=======================================================================================*/
//测试
var myDis;
function GPSMapbind() {
    //var map = new BMap.Map("orBmapDiv", { mapType: BMAP_HYBRID_MAP }); // 创建Map实例
    try {
       var map = new BMap.Map("orBmapDiv", { mapType: BMAP_HYBRID_MAP }); // 创建Map实例 
    } catch (e) {
        console.log('百度地图加载失败！')
        return
    }
    var point = new BMap.Point(103.9642206, 30.573644);    // 创建点坐标
    map.clearOverlays();    //清除地图上所有覆盖物
    map.centerAndZoom(point, 14); // 初始化地图，设置中心点坐标和地图级别。
    map.enableScrollWheelZoom();
    map.enableKeyboard();
    map.disableDoubleClickZoom();

    myDis = new BMapLib.DistanceTool(map);
    OrgGPS(map, "", "", "", "", "", "");
    map.addControl(bmapUserTopOneRightInfo);
    map.addControl(new BMap.OverviewMapControl());
    map.addControl(new BMap.ScaleControl());                    // 添加默认比例尺控件

    map.addControl(new BMap.ScaleControl({ anchor: BMAP_ANCHOR_TOP_LEFT }));                    // 左上
    map.addControl(new BMap.ScaleControl({ anchor: BMAP_ANCHOR_TOP_RIGHT }));                    // 右上
    map.addControl(new BMap.ScaleControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT }));                    // 左下
    map.addControl(new BMap.MapTypeControl({ anchor: BMAP_ANCHOR_TOP_LEFT }));    //左上角，默认地图控件
    //由于有3D图，需要设置城市哦
    var cr = new BMap.CopyrightControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT });
    map.addControl(cr); //添加版权控件
    cr.addCopyright({ id: 1, content: "<a href='http://www.railwaytec.com'></a>" });
};
//测距
function CJOpen() {
    myDis.open();  //开启鼠标测距
};
/************左上角悬浮说明框**********************/
//第一层
function bmapUserTopOneRightInfo() {
    // 设置默认停靠位置和偏移量
    this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
    this.defaultOffset = new BMap.Size(5, 5);
}
function OrbitJtopo() {
    MonitorindexOrbitJtopo(x, y);
}