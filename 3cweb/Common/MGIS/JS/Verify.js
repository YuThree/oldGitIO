var map;
var myDis;
var overlays = [];
var CZType;
var drawingManager;
var polemarker = [];//地图杆号存放

function VerifyMapbind() {
    map = new BMap.Map("orBmapDiv", {}); // 创建Map实例
    var point = new BMap.Point(103.9642206, 30.573644);    // 创建点坐标
    map.clearOverlays();    //清除地图上所有覆盖物
    map.centerAndZoom(point, 14); // 初始化地图，设置中心点坐标和地图级别。
    map.enableScrollWheelZoom();
    myDis = new BMapLib.DistanceTool(map);
    map.addControl(new BMap.MapTypeControl({ anchor: BMAP_ANCHOR_TOP_LEFT }));   //左上角，默认地图控件


    newtools();
};

function newtools() {
    //实例化鼠标绘制工具


    var overlaycomplete = function (e) {

        overlays.push(e.overlay);
        if (overlays.length > 0) {
            var point1 = e.overlay.getPath()[0];
            var point2 = e.overlay.getPath()[2];

            var pointlon1 = point1.lng;
            var pointlat1 = point1.lat;
            var pointlon3 = point2.lng;
            var pointlat3 = point2.lat;
            clickFK(pointlon1, pointlon3, pointlat1, pointlat3);
        }

    };
    var styleOptions = {
        strokeColor: "red",    //边线颜色。
        fillColor: "red",      //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 3,       //边线的宽度，以像素为单位。
        strokeOpacity: 0.8,    //边线透明度，取值范围0 - 1。
        fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' //边线的样式，solid或dashed。
    }

    drawingManager = new BMapLib.DrawingManager(map, {
        isOpen: false, //是否开启绘制模式
        drawingType: BMAP_DRAWING_MARKER, enableDrawingTool: true,
        enableDrawingTool: false, //是否显示工具栏
        enableCalculate: false,
        drawingToolOptions: {
            anchor: BMAP_ANCHOR_TOP_RIGHT,
            offset: new BMap.Size(5, 5),
            drawingTypes: [
                BMAP_DRAWING_RECTANGLE
            ],
            drawingModes: [BMAP_DRAWING_RECTANGLE]
        },
        rectangleOptions: styleOptions //矩形的样式
    });
    //添加鼠标绘制工具监听事件，用于获取绘制结果
    drawingManager.addEventListener('overlaycomplete', overlaycomplete);
};

//清除所有数据
function QC() {
    map.clearOverlays();    //清除地图上所有覆盖物
    newtools();
}
function clearAll() {
    for (var i = 0; i < overlays.length; i++) {
        map.removeOverlay(overlays[i]);
        overlays[i]
    }
    overlays.length = 0
}
var pagePoleNumber = 1;
var pageInfoNumber = 1;
var pagePoleSNumber = 1;
var pageInfoSNumber = 1;
var Polejson;
var DPolejson;
var gpsjson;
var Dgpsjson;
function GetPosition() {
    if ($('#org_tree').attr('treetype') == 'J' || $('#org_tree').attr('treetype') == 'TOPBOSS' || $('#org_tree').attr('treetype') == 'YSJ') {
        var ju = $('#org_tree').attr('code'); //局
        var jwd = '';
    }
    else {
        var str = $('#org_tree').attr('code');
        console.log(str);
        var arry = [];
        arry = str.split('$');
        console.log(arry);
        var ju = arry[0] + '$' + arry[1]; //局
        console.log(ju);
        var jwd = $('#org_tree').attr('code'); //机务段
    }
    var line = document.getElementById('lineselect').value; //线路
    var XB = '0'//行别
    if ($('#ddlxb').val() != '') {
        XB = $('#ddlxb').attr('code')
    }
    var jl = document.getElementById('jl').value; //
    var _jl = document.getElementById('_jl').value; //
    var type = "Position";
    json = getMisGpsPointsData(ju, jwd, line, XB, type, pagePoleNumber, jl, _jl);
}

function setPosition(json) {
    if (json != undefined) {
        for (var i = 0; i < json.length; i++) {
            var Point = new BMap.Point(json[i].gis_lon, json[i].gis_lat);
            var labelMark = new BMap.Label(json[i].position_name, { point: Point });
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
            marker.setZIndex(1);
            map.addOverlay(marker);
        }
    }
}
//查询支柱
function CXPole() {
    GetPosition();
    CZType = "Pole";
    if ($('#org_tree').attr('treetype') == 'J' || $('#org_tree').attr('treetype') == 'TOPBOSS' || $('#org_tree').attr('treetype') == 'YSJ') {
        var ju = $('#org_tree').attr('code'); //局
        var jwd = '';
    }
    else {
        var str = $('#org_tree').attr('code');
        console.log(str);
        var arry = [];
        arry = str.split('$');
        console.log(arry);
        var ju = arry[0] + '$' + arry[1]; //局
        console.log(ju);
        var jwd = $('#org_tree').attr('code'); //机务段
    }
    var line = document.getElementById('lineselect').value; //线路
    var XB = '0'//行别
    if ($('#ddlxb').val() != '') {
        XB = $('#ddlxb').attr('code')
    }
    var jl = document.getElementById('jl').value; //
    var _jl = document.getElementById('_jl').value; //
    var type = "Pole";
    var points = [];  // 添加海量点数据
    Polejson = getMisGpsPointsData(ju, jwd, line, XB, type, pagePoleNumber, jl, _jl);
    if (Polejson != undefined) {
        if (Polejson.length > 0) {
            map.setCenter(new BMap.Point(Polejson[0].gis_lon_calc, Polejson[0].gis_lat_calc));
        } else {
            alert("没有数据");
        }
        for (var i = 0; i < Polejson.length; i++) {
            var gpsPoint = new BMap.Point(Polejson[i].gis_lon_calc, Polejson[i].gis_lat_calc);
            gpsPoint.jsons = Polejson[i];
            points.push(gpsPoint);
            //BMap.Convertor.translate(gpsPoint, 0, GPSZH, i)
        }


        var options = {
            size: BMAP_POINT_SIZE_BIGGER,
            color: '#B22222'
        }
        var pointCollection = new BMap.PointCollection(points, options);  // 初始化PointCollection
        pointCollection.addEventListener('click', clickPole);
        map.addOverlay(pointCollection);  // 添加Overlay
        // document.getElementById('_page').style.display = "";
        document.getElementById('Page').innerHTML = pagePoleNumber;
        //   document.getElementById('count').value = gpsjson[0].count;
    } else {
        alert("没有数据");
    }
}
//查询已删支柱
function CXSPole() {
    GetPosition();
    CZType = "Pole_BAK";
    if ($('#org_tree').attr('treetype') == 'J' || $('#org_tree').attr('treetype') == 'TOPBOSS' || $('#org_tree').attr('treetype') == 'YSJ') {
        var ju = $('#org_tree').attr('code'); //局
        var jwd = '';
    }
    else {
        var str = $('#org_tree').attr('code');
        console.log(str);
        var arry = [];
        arry = str.split('$');
        console.log(arry);
        var ju = arry[0] + '$' + arry[1]; //局
        console.log(ju);
        var jwd = $('#org_tree').attr('code'); //机务段
    }
    var line = document.getElementById('lineselect').value; //线路
    var XB = '0'//行别
    if ($('#ddlxb').val() != '') {
        XB = $('#ddlxb').attr('code')
    }
    var jl = document.getElementById('jl').value; //
    var _jl = document.getElementById('_jl').value; //
    var type = "Pole_BAK";
    var points = [];  // 添加海量点数据
    DPolejson = getMisGpsPointsData(ju, jwd, line, XB, type, pagePoleSNumber, jl, _jl);
    if (DPolejson != undefined) {
        if (DPolejson.length > 0) {
            map.setCenter(new BMap.Point(DPolejson[0].gis_lon_calc, DPolejson[0].gis_lat_calc));
        } else {
            alert("没有数据");
        }
        for (var i = 0; i < DPolejson.length; i++) {
            var gpsPoint = new BMap.Point(DPolejson[i].gis_lon_calc, DPolejson[i].gis_lat_calc);
            gpsPoint.jsons = DPolejson[i];
            points.push(gpsPoint);
            //BMap.Convertor.translate(gpsPoint, 0, GPSZH, i)
        }


        var options = {
            size: BMAP_POINT_SIZE_BIGGER,
            color: '#9FB6CD'
        }
        var pointCollection = new BMap.PointCollection(points, options);  // 初始化PointCollection
        pointCollection.addEventListener('click', clickPoleBAK);
        map.addOverlay(pointCollection);  // 添加Overlay
        // document.getElementById('_page').style.display = "";
        //document.getElementById('Page').innerHTML = pagePoleNumber;
        //   document.getElementById('count').value = gpsjson[0].count;
    } else {
        alert("没有数据");
    }
}
//查询定位数据        原来的
//function CXGPS() {
//    fullShow();
//    GetPosition();
//    CZType = "INFO";
//    if ($('#org_tree').attr('treetype') == 'J' || $('#org_tree').attr('treetype') == 'TOPBOSS' || $('#org_tree').attr('treetype') == 'YSJ') {
//var ju = $('#org_tree').attr('code'); //局
//var jwd = '';
//}
//else {
//    var str = $('#org_tree').attr('code');
//    console.log(str);
//    var arry = [];
//    arry = str.split('$');
//    console.log(arry);
//    var ju = arry[0] + '$' + arry[1]; //局
//    console.log(ju);
//    var jwd = $('#org_tree').attr('code'); //机务段
//}
//    var line = document.getElementById('lineselect').value; //线路
//    var XB = document.getElementById('ddlxb').value; //
//    var jl = document.getElementById('jl').value; //
//    var _jl = document.getElementById('_jl').value; //
//    var type = "INFO";
//    gpsjson = getMisGpsPointsData(ju, jwd, line, XB, type, pageInfoNumber, jl, _jl);


//}



//画点  locationInfo数据
function SetInfo(gpsjson) {
    var points = [];  // 添加海量点数据
    var points1 = [];  // 添加海量点数据  杆号不正常
    var points2 = [];  // 添加海量点数据  大距离不正常
    var points3 = [];  // 添加海量点数据  小距离不正常
    var points4 = [];  // 添加海量点数据  偏移点
    var points5 = [];  // 添加海量点数据  边界点
    if (gpsjson != undefined) {
        if (gpsjson.length > 0) {
            map.setCenter(new BMap.Point(gpsjson[0].gis_lon_b, gpsjson[0].gis_lat_b));
        } else {
            ymPrompt.errorInfo('没有数据！', null, null, '提示信息', null);
        }
        for (var i = 0; i < gpsjson.length; i++) {

            var gpsPoint = new BMap.Point(gpsjson[i].gis_lon_b, gpsjson[i].gis_lat_b);
            gpsPoint.jsons = gpsjson[i];
            //10-15废弃
            //if (gpsjson[i].EXCEPTION_DATA_TYPE != "") {
            //    points4.push(gpsPoint);
            //} else if (gpsjson[i].ISZC == "1") {
            //    points1.push(gpsPoint);
            //} else if (gpsjson[i].JL == "1") {
            //    points2.push(gpsPoint);
            //} else if (gpsjson[i].XJL == "1") {
            //    points3.push(gpsPoint);
            //} else {
            //    points.push(gpsPoint);
            //}
            if (gpsjson[i].EXCEPTION_DATA_TYPE != "") {
                points4.push(gpsPoint);
            } else if (gpsjson[i].JL == "1") {
                points2.push(gpsPoint);
            } else if (gpsjson[i].XJL == "1") {
                points3.push(gpsPoint);
            } else if (gpsjson[i].DUP_PW == '' && gpsjson[i].ACDesc == '' && gpsjson[i].MCDesc == '') {
                points.push(gpsPoint);
            } else if (gpsjson[i].DUP_POLE != '') {
                points5.push(gpsPoint);
            } else {
                points1.push(gpsPoint);//异常 红点
            }


        }
        var options = {
            size: BMAP_POINT_SIZE_BIG,
            color: 'green'
        }
        var options1 = {
            size: BMAP_POINT_SIZE_BIGGER,
            color: 'red'
        }
        var options2 = {
            size: BMAP_POINT_SIZE_BIGGER,
            color: '#000000'
        }
        var options3 = {
            size: BMAP_POINT_SIZE_BIGGER,
            color: '#ffd800'
        }
        var options4 = {
            size: BMAP_POINT_SIZE_BIGGER,
            color: '#9932CC'
        }
        var options5 = {
            size: BMAP_POINT_SIZE_BIGGER,
            color: 'orange'
        }
        var ddlyc = document.getElementById('ddlyc').value; //

        var pointCollection = new BMap.PointCollection(points, options);  // 初始化PointCollection
        pointCollection.addEventListener('click', clickGPS);

        var pointCollection1 = new BMap.PointCollection(points1, options1);  // 初始化PointCollection
        pointCollection1.addEventListener('click', clickGPS);

        var pointCollection2 = new BMap.PointCollection(points2, options2);  // 初始化PointCollection
        pointCollection2.addEventListener('click', clickGPS);
        var pointCollection3 = new BMap.PointCollection(points3, options3);  // 初始化PointCollection
        pointCollection3.addEventListener('click', clickGPS);
        var pointCollection4 = new BMap.PointCollection(points4, options4);  // 初始化PointCollection
        pointCollection4.addEventListener('click', clickGPS);
        var pointCollection5 = new BMap.PointCollection(points5, options5);  // 初始化PointCollection
        pointCollection5.addEventListener('click', clickGPS);
        //每一个点生成杆号标识

        //var map = new BMap.Map("allmap");
        //var point = new BMap.Point(116.417854, 39.921988);
        //map.centerAndZoom(point, 15);
        //var opts = {
        //    position: point,    // 指定文本标注所在的地理位置
        //    offset: new BMap.Size(30, -30)    //设置文本偏移量
        //}
        //var label = new BMap.Label("欢迎使用百度地图，这是一个简单的文本标注哦~", opts);  // 创建文本标注对象
        //label.setStyle({
        //    color: "red",
        //    fontSize: "12px",
        //    height: "20px",
        //    lineHeight: "20px",
        //    fontFamily: "微软雅黑"
        //});
        //map.addOverlay(label);




        if (ddlyc == "0") {
            map.addOverlay(pointCollection);  // 添加Overlay
            map.addOverlay(pointCollection1);
            map.addOverlay(pointCollection2);
            map.addOverlay(pointCollection3);
            map.addOverlay(pointCollection4);
            map.addOverlay(pointCollection5);

        } else if (ddlyc == "2") {
            map.addOverlay(pointCollection1);
        } else if (ddlyc == "3") {
            map.addOverlay(pointCollection2);
        } else if (ddlyc == "4") {
            map.addOverlay(pointCollection3);
        } else if (ddlyc == "5") {
            map.addOverlay(pointCollection4);
        }
        layer.closeAll();
        //添加地图更改缩放级别结束时触发事件。
        //map.addEventListener('zoomend', function () {
        //    labelInMap(ddlyc, points, points1, points2, points3, points4)
        //});


        // document.getElementById('_page_infp').style.display = "";
        // document.getElementById('Page_info').innerHTML = pageInfoNumber;
        //  document.getElementById('count_info').value = gpsjson[0].count;
    } else {
        ymPrompt.errorInfo('没有数据！', null, null, '提示信息', null);
    }
    fullHide();
}

//开始加入地图标注
function labelInMap(ddlyc, points, points1, points2, points3, points4) {
    if (map.getZoom() > 18) {
        $(".BMapLabel").css("display", "")
        if (ddlyc == "0") {
            dolabel(points)
            dolabel(points1)
            dolabel(points2)
            dolabel(points3)
            dolabel(points4)
        } else if (ddlyc == "2") { dolabel(points1) }
        else if (ddlyc == "3") { dolabel(points2) }
        else if (ddlyc == "4") { dolabel(points3) }
        else if (ddlyc == "5") { dolabel(points4) }
    } else {
        $(".BMapLabel").css("display", "none")
    }
}


//地图文本标注
function dolabel(point) {
    if (map.getZoom() > 18) {
        for (var i = 0; i < point.length; i++) {
            polemarker[i] = new BMap.Point(point[i].lng, point[i].lat); //获取坐标 
            var opts = {
                position: polemarker[i],    // 指定文本标注所在的地理位置
                offset: new BMap.Size(-70, -25)    //设置文本偏移量
            }
            var label = new BMap.Label('杆号：' + point[i].jsons.POLE_NO, opts);
            map.addOverlay(label);
        }
    }
}
//查询已删定位数据
function CXSGPS() {
    GetPosition();
    CZType = "INFO_BAK";
    if ($('#org_tree').attr('treetype') == 'J' || $('#org_tree').attr('treetype') == 'TOPBOSS' || $('#org_tree').attr('treetype') == 'YSJ') {
        var ju = $('#org_tree').attr('code'); //局
        var jwd = '';
    }
    else {
        var str = $('#org_tree').attr('code');
        console.log(str);
        var arry = [];
        arry = str.split('$');
        console.log(arry);
        var ju = arry[0] + '$' + arry[1]; //局
        console.log(ju);
        var jwd = $('#org_tree').attr('code'); //机务段
    }
    var line = document.getElementById('lineselect').value; //线路
    var XB = '0'//行别
    if ($('#ddlxb').val() != '') {
        XB = $('#ddlxb').attr('code')
    }
    var type = "INFO_BAK";
    var points = [];  // 添加海量点数据
    Dgpsjson = getMisGpsPointsData(ju, jwd, line, XB, type, pageInfoSNumber);
    if (Dgpsjson != undefined) {
        if (Dgpsjson.length > 0) {
            map.setCenter(new BMap.Point(Dgpsjson[0].gis_lon_b, Dgpsjson[0].gis_lat_b));
        } else {

            alert("没有数据");
        }
        for (var i = 0; i < Dgpsjson.length; i++) {
            var gpsPoint = new BMap.Point(Dgpsjson[i].gis_lon_b, Dgpsjson[i].gis_lat_b);
            gpsPoint.jsons = Dgpsjson[i];
            points.push(gpsPoint);
        }
        var options = {
            size: BMAP_POINT_SIZE_BIGGER,
            color: '#CD3700'
        }
        var pointCollection = new BMap.PointCollection(points, options);  // 初始化PointCollection
        pointCollection.addEventListener('click', clickGPSBAK);
        map.addOverlay(pointCollection);  // 添加Overlay
        // document.getElementById('_page_infp').style.display = "";
        // document.getElementById('Page_info').innerHTML = pageInfoNumber;
        //  document.getElementById('count_info').value = gpsjson[0].count;
    } else {
        alert("没有数据");
    }

}
//获取数据方法
function getMisGpsPointsData(ju, jwd, line, XB, type, page, jl, _JL) {
    var url = "ASHX/Sms/Verify.ashx?ju=" + ju + "&jwd=" + jwd + "&line=" + line + "&XB=" + escape(XB) + "&type=" + type + "&page=" + page + "&jl=" + jl + "&_JL=" + _JL;
    var json;
    $.ajax({
        type: "POST",
        url: url,
        async: true,
        cache: false,
        success: function (result) {
            json = eval('(' + result + ')');
            if (type == "INFO") {
                SetInfo(json);
            } else if (type == "Position")
                setPosition(json);

            gpsjson = json;
        }
    });
    return json;
}
var PoleE;

//支柱点击，弹出html
function clickPole(e) {
    PoleE = e;
    var html = "<div style='width:400px;'>"
    html += "<input class='btn btn-primary' value='编辑' onclick='updatePole(\"" + e.point.jsons.id + "\")' type='button' />";
    html += "<input class='btn btn-primary' style='display:none;' value='删除' onclick='deletePole(\"" + e.point.jsons.id + "\")' type='button' />";
    html += "<input class='btn btn-primary' value='关闭' onclick='Close()' type='button' />";
    html += "<table class='table table-bordered table-condensed' style='table-layout:fixed ;' width='100%' cellspacing='1'  cellpadding='1'>"
    html += "<tr><td style='width:25%'>局：</td><td style='width:75%'>" + e.point.jsons.bureauName + "</td></tr>"
    html += "<tr><td style='width:25%'>段：</td><td style='width:75%'>" + e.point.jsons.org_name + "</td></tr>"
    html += "<tr><td style='width:25%'>线路：</td><td style='width:75%'>" + e.point.jsons.line_name + "</td></tr>"
    html += "<tr><td style='width:25%'>区间：</td><td style='width:75%'>" + e.point.jsons.position_name + "</td></tr>"
    html += "<tr><td style='width:25%'>桥隧：</td><td style='width:75%'>" + e.point.jsons.BRG_TUN_NAME + "</td></tr>"
    html += "<tr><td style='width:25%'>行别：</td><td style='width:75%'>" + e.point.jsons.pole_direction + "</td></tr>"
    html += "<tr><td style='width:25%'>杆号：</td><td style='width:75%'>" + e.point.jsons.pole_no + "</td></tr>"
    html += "<tr><td style='width:25%'>公里标：</td><td style='width:75%'>" + e.point.jsons.kmstandard + "</td></tr>"
    html += "<tr><td style='width:25%'>百度经度：</td><td style='width:75%'>" + e.point.jsons.gis_lon_calc + "</td></tr>"
    html += "<tr><td style='width:25%'>百度纬度：</td><td style='width:75%'>" + e.point.jsons.gis_lat_calc + "</td></tr>"
    html += "</table>"
    html += "</div>";
    var infoWindow = new BMap.InfoWindow(html);
    map.openInfoWindow(infoWindow, e.point);
}
function clickPoleBAK(e) {
    var html = "<div style='width:400px;'>"
    html += "<input class='btn btn-primary' value='关闭' onclick='Close()' type='button' />";
    // html += "<input class='btn btn-primary' value='编辑' onclick='updatePole(\"" + e.point.jsons.id + "\")' type='button' />";
    // html += "<input class='btn btn-primary' value='删除' onclick='deletePole(\"" + e.point.jsons.id + "\")' type='button' />";
    html += "<table class='table table-bordered table-condensed' style='table-layout:fixed ;' width='100%' cellspacing='1'  cellpadding='1'>"
    html += "<tr><td style='width:25%'>局：</td><td style='width:75%'>" + e.point.jsons.bureauName + "</td></tr>"
    html += "<tr><td style='width:25%'>段：</td><td style='width:75%'>" + e.point.jsons.org_name + "</td></tr>"
    html += "<tr><td style='width:25%'>线路：</td><td style='width:75%'>" + e.point.jsons.line_name + "</td></tr>"
    html += "<tr><td style='width:25%'>区间：</td><td style='width:75%'>" + e.point.jsons.position_name + "</td></tr>"
    html += "<tr><td style='width:25%'>桥隧：</td><td style='width:75%'>" + e.point.jsons.BRG_TUN_NAME + "</td></tr>"
    html += "<tr><td style='width:25%'>行别：</td><td style='width:75%'>" + e.point.jsons.pole_direction + "</td></tr>"
    html += "<tr><td style='width:25%'>杆号：</td><td style='width:75%'>" + e.point.jsons.pole_no + "</td></tr>"
    html += "<tr><td style='width:25%'>公里标：</td><td style='width:75%'>" + e.point.jsons.kmstandard + "</td></tr>"
    html += "<tr><td style='width:25%'>百度经度：</td><td style='width:75%'>" + e.point.jsons.gis_lon_calc + "</td></tr>"
    html += "<tr><td style='width:25%'>百度纬度：</td><td style='width:75%'>" + e.point.jsons.gis_lat_calc + "</td></tr>"
    html += "</table>"
    html += "</div>";
    var infoWindow = new BMap.InfoWindow(html);
    map.openInfoWindow(infoWindow, e.point);
}
var InfoE;

//locationInfo节点，点击弹出html
function clickGPS(e) {
    InfoE = e;
    var __json = e.point.jsons
    setPoleClick(e.point, __json.id)
}
function clickGPSBAK(e) {
    //  InfoE = e;
    var html = "<div style='width:400px;'>"
    html += "<input class='btn btn-primary' value='关闭' onclick='Close()' type='button' />";
    //  html += "<input class='btn btn-primary' value='编辑' onclick='updateInfo(\"" + e.point.jsons.id + "\")' type='button' />";
    //  html += "<input class='btn btn-primary' value='删除' onclick='deleteInfo(\"" + e.point.jsons.id + "\")' type='button' />";
    html += "<table class='table table-bordered table-condensed' style='table-layout:fixed ;' width='100%' cellspacing='1'  cellpadding='1'>"
    html += "<tr><td style='width:25%'>局：</td><td style='width:25%'>" + e.point.jsons.bureauName + "</td><td style='width:25%'>段：</td><td style='width:25%'>" + "" + "</td></tr>"
    html += "<tr><td style='width:25%'>线路：</td><td style='width:25%'>" + e.point.jsons.line_name + "</td><td style='width:25%'></td><td style='width:25%'>" + "" + "</td></tr>"
    html += "<tr><td style='width:25%'>区间：</td><td style='width:25%'>" + e.point.jsons.position_name + "</td><td style='width:25%'></td><td style='width:25%'>" + "" + "</td></tr>"
    html += "<tr><td style='width:25%'>桥隧：</td><td style='width:25%'>" + e.point.jsons.BRG_TUN_NAME + "</td><td style='width:25%'></td><td style='width:25%'>" + "" + "</td></tr>"
    html += "<tr><td style='width:25%'>行别：</td><td style='width:25%'>" + e.point.jsons.direction + "</td><td style='width:25%'>杆号</td><td style='width:25%'>" + e.point.jsons.POLE_NO + "" + "</td></tr>"
    html += "<tr><td style='width:25%'>公里标：</td><td style='width:25%'>" + e.point.jsons.km_mark + "</td><td style='width:25%'>编号：</td><td style='width:25%'>" + e.point.jsons.SERIAL_NO + "</td></tr>"
    html += "<tr><td style='width:25%'>GPS经度：</td><td style='width:25%'>" + e.point.jsons.gis_lon + "</td><td style='width:25%'>GPS纬度：</td><td style='width:25%'>" + e.point.jsons.gis_lat + "</td></tr>"
    html += "<tr><td style='width:25%'>百度经度：</td><td style='width:25%'>" + e.point.jsons.gis_lon_b + "</td><td style='width:25%'>百度纬度：</td><td style='width:25%'>" + e.point.jsons.gis_lat_b + "</td></tr>"
    html += "</table>"
    html += "</div>";
    var infoWindow = new BMap.InfoWindow(html);
    map.openInfoWindow(infoWindow, e.point);
}

//矩形框选择后，弹出html
function clickFK(pointlon1, pointlon3, pointlat1, pointlat3) {

    var html = "<div style='width:600px;'>"
    if (CZType == "Pole" || CZType == "INFO") {
        html += "<input class='btn btn-primary' value='编辑' id='update' onclick='PupdatePole(\"" + pointlon1 + "\",\"" + pointlon3 + "\",\"" + pointlat1 + "\",\"" + pointlat3 + "\")' type='button' />";
        html += "&nbsp;&nbsp;<input class='btn btn-primary'  style='display:none;' value='删除' id='delete' onclick='PdeletePole(\"" + pointlon1 + "\",\"" + pointlon3 + "\",\"" + pointlat1 + "\",\"" + pointlat3 + "\")' type='button' />";
        html += "&nbsp;&nbsp;<input class='btn btn-primary' value='设置为偏移数据' id='dc' onclick='SetInfoPY(\"" + pointlon1 + "\",\"" + pointlon3 + "\",\"" + pointlat1 + "\",\"" + pointlat3 + "\")' type='button' />";
        html += "&nbsp;&nbsp;<input class='btn btn-primary' value='导出偏移数据' id='dc' onclick='infoDc(\"" + pointlon1 + "\",\"" + pointlon3 + "\",\"" + pointlat1 + "\",\"" + pointlat3 + "\")' type='button' />";
        html += "&nbsp;&nbsp;<input class='btn btn-primary' value='偏移数据恢复为正常数据' id='dc' onclick='SetInfoHFPY(\"" + pointlon1 + "\",\"" + pointlon3 + "\",\"" + pointlat1 + "\",\"" + pointlat3 + "\")' type='button' />";
    } else {
        // html += "<input class='btn btn-primary' value='恢复' id='hf' onclick='PHFPole(\"" + pointlon1 + "\",\"" + pointlon3 + "\",\"" + pointlat1 + "\",\"" + pointlat3 + "\")' type='button' />";
    }
    html += "&nbsp;&nbsp;<input class='btn btn-primary' value='关闭' onclick='Close()' type='button' />";
    html += "</div>";
    var point = new BMap.Point(parseFloat(parseFloat(pointlon1) + parseFloat(pointlon3)) / 2, parseFloat(parseFloat(pointlat1) + parseFloat(pointlat3)) / 2)
    var infoWindow = new BMap.InfoWindow(html);
    infoWindow.disableCloseOnClick();
    map.openInfoWindow(infoWindow, point);
}
function Close() {
    clearAll();
    map.closeInfoWindow();
}

var _pointlon1;
var _pointlon3;
var _pointlat1;
var _pointlat3;
function PupdatePole(pointlon1, pointlon3, pointlat1, pointlat3) {
    _pointlon1 = pointlon1;
    _pointlon3 = pointlon3;
    _pointlat1 = pointlat1;
    _pointlat3 = pointlat3;
    document.getElementById('txtqz').value = "";
    document.getElementById('modal-update').click();
}

//设置偏移数据
function SetInfoPY(pointlon1, pointlon3, pointlat1, pointlat3) {
    if ($('#org_tree').attr('treetype') == 'J' || $('#org_tree').attr('treetype') == 'TOPBOSS' || $('#org_tree').attr('treetype') == 'YSJ') {
        var ju = $('#org_tree').attr('code'); //局
        var jwd = '';
    }
    else {
        var str = $('#org_tree').attr('code');
        console.log(str);
        var arry = [];
        arry = str.split('$');
        console.log(arry);
        var ju = arry[0] + '$' + arry[1]; //局
        console.log(ju);
        var jwd = $('#org_tree').attr('code'); //机务段
    }
    var line = document.getElementById('lineselect').value; //线路
    var XB = '0'//行别
    if ($('#ddlxb').val() != '') {
        XB = $('#ddlxb').attr('code')
    }
    var jl = document.getElementById('jl').value; //
    var _jl = document.getElementById('_jl').value; //

    responseData = XmlHttpHelper.transmit(false, "get", "text", "ASHX/Sms/PVerify.ashx?ju=" + ju + "&jwd=" + jwd + "&line=" + line + "&XB=" + escape(XB) + "&pointlon1=" + pointlon1 + "&pointlon3=" + pointlon3 + "&pointlat1=" + pointlat1 + "&pointlat3=" + pointlat3 + "&type=" + CZType + '&_type=SetPY&temp=' + Math.random(), null, null);
    alert(responseData);
    OCXGPS();
}

//恢复偏移数据
function SetInfoHFPY(pointlon1, pointlon3, pointlat1, pointlat3) {
    if ($('#org_tree').attr('treetype') == 'J' || $('#org_tree').attr('treetype') == 'TOPBOSS' || $('#org_tree').attr('treetype') == 'YSJ') {
        var ju = $('#org_tree').attr('code'); //局
        var jwd = '';
    }
    else {
        var str = $('#org_tree').attr('code');
        console.log(str);
        var arry = [];
        arry = str.split('$');
        console.log(arry);
        var ju = arry[0] + '$' + arry[1]; //局
        console.log(ju);
        var jwd = $('#org_tree').attr('code'); //机务段
    }
    var line = document.getElementById('lineselect').value; //线路
    var XB = '0'//行别
    if ($('#ddlxb').val() != '') {
        XB = $('#ddlxb').attr('code')
    }
    var jl = document.getElementById('jl').value; //
    var _jl = document.getElementById('_jl').value; //

    responseData = XmlHttpHelper.transmit(false, "get", "text", "ASHX/Sms/PVerify.ashx?ju=" + ju + "&jwd=" + jwd + "&line=" + line + "&XB=" + escape(XB) + "&pointlon1=" + pointlon1 + "&pointlon3=" + pointlon3 + "&pointlat1=" + pointlat1 + "&pointlat3=" + pointlat3 + "&type=" + CZType + '&_type=SetHFPY&temp=' + Math.random(), null, null);
    alert(responseData);
    OCXGPS();
}

function PHFPole(pointlon1, pointlon3, pointlat1, pointlat3) {
    if ($('#org_tree').attr('treetype') == 'J' || $('#org_tree').attr('treetype') == 'TOPBOSS' || $('#org_tree').attr('treetype') == 'YSJ') {
        var ju = $('#org_tree').attr('code'); //局
        var jwd = '';
    }
    else {
        var str = $('#org_tree').attr('code');
        console.log(str);
        var arry = [];
        arry = str.split('$');
        console.log(arry);
        var ju = arry[0] + '$' + arry[1]; //局
        console.log(ju);
        var jwd = $('#org_tree').attr('code'); //机务段
    }
    var line = document.getElementById('lineselect').value; //线路
    var XB = '0'//行别
    if ($('#ddlxb').val() != '') {
        XB = $('#ddlxb').attr('code')
    }
    var jl = document.getElementById('jl').value; //
    var _jl = document.getElementById('_jl').value; //

    var points = [];  // 添加海量点数据

    responseData = XmlHttpHelper.transmit(false, "get", "text", "ASHX/Sms/PVerify.ashx?ju=" + ju + "&jwd=" + jwd + "&line=" + line + "&XB=" + escape(XB) + "&pointlon1=" + pointlon1 + "&pointlon3=" + pointlon3 + "&pointlat1=" + pointlat1 + "&pointlat3=" + pointlat3 + "&type=" + CZType + '&_type=delete&temp=' + Math.random(), null, null);

    QC();
    GetPosition();
    Polejson = getMisGpsPointsData(ju, jwd, line, XB, CZType, pagePoleNumber, jl, _jl);
    // map.removeOverlay(PoleE.target);
    if (Polejson.length > 1) {
        for (var i = 0; i < Polejson.length; i++) {
            if (CZType == "Pole_BAK") {
                var gpsPoint = new BMap.Point(Polejson[i].gis_lon_calc, Polejson[i].gis_lat_calc);
                gpsPoint.jsons = Polejson[i];
                points.push(gpsPoint);
            } else {
                var gpsPoint = new BMap.Point(Polejson[i].gis_lon_b, Polejson[i].gis_lat_b);
                gpsPoint.jsons = Polejson[i];
                points.push(gpsPoint);
            }
        }

        var options = "";
        if (CZType == "Pole_BAK") {
            options = {
                size: BMAP_POINT_SIZE_BIGGER,
                color: '#9FB6CD'
            }
        } else {
            options = {
                size: BMAP_POINT_SIZE_BIGGER,
                color: '#CD3700'
            }
        }
        var pointCollection = new BMap.PointCollection(points, options);  // 初始化PointCollection
        if (CZType == "Pole_BAK") {
            pointCollection.addEventListener('click', clickPoleBAK);
        } else {

            pointCollection.addEventListener('click', clickGPSBAK);
        }
        map.addOverlay(pointCollection);  // 添加Overlay
    }
    clearAll();
    map.closeInfoWindow();
    alert(responseData)
}

//locationInfo 数据编辑保存，根据矩形框。
function Save() {
    fullShow();
    if ($('#org_tree').attr('treetype') == 'J' || $('#org_tree').attr('treetype') == 'TOPBOSS' || $('#org_tree').attr('treetype') == 'YSJ') {
        var ju = $('#org_tree').attr('code'); //局
        var jwd = '';
    }
    else {
        var str = $('#org_tree').attr('code');
        console.log(str);
        var arry = [];
        arry = str.split('$');
        console.log(arry);
        var ju = arry[0] + '$' + arry[1]; //局
        console.log(ju);
        var jwd = $('#org_tree').attr('code'); //机务段
    }
    var line = document.getElementById('lineselect').value; //线路
    var XB = '0'//行别
    if ($('#ddlxb').val() != '') {
        XB = $('#ddlxb').attr('code')
    }
    var _ju = document.getElementById('_juselect').value; //局
    var _jwd = document.getElementById('_duanselect').value; //段; //机务段
    var _line = document.getElementById('_lineselect').value; //线路
    var _XB = '0'//行别
    if ($('#XB').val() != '') {
        _XB = $('#XB').attr('code')
    }
    var jl = document.getElementById('jl').value; //
    var _jl = document.getElementById('_jl').value; //
    var qz = $('#txtqz').val(); //区站

    var points = [];  // 添加海量点数据

    responseData = XmlHttpHelper.transmit(false, "get", "text", "ASHX/Sms/PVerify.ashx?ju=" + ju + "&jwd=" + jwd + "&line=" + line + "&XB=" + escape(XB) + "&_ju=" + _ju + "&_jwd=" + _jwd + "&_line=" + _line + "&_XB=" + escape(_XB) + "&_Position=" + escape(qz) + "&pointlon1=" + _pointlon1 + "&pointlon3=" + _pointlon3 + "&pointlat1=" + _pointlat1 + "&pointlat3=" + _pointlat3 + "&type=" + CZType + '&_type=update&temp=' + Math.random(), null, null);

    QC();
    GetPosition();
    Polejson = getMisGpsPointsData(ju, jwd, line, XB, CZType, pagePoleNumber, jl, _jl);
    // map.removeOverlay(PoleE.target);
    //if (Polejson.length > 1) {
    //    for (var i = 0; i < Polejson.length; i++) {
    //        if (CZType == "Pole") {
    //            var gpsPoint = new BMap.Point(Polejson[i].gis_lon_calc, Polejson[i].gis_lat_calc);
    //            gpsPoint.jsons = Polejson[i];
    //            points.push(gpsPoint);
    //        } else {
    //            var gpsPoint = new BMap.Point(Polejson[i].gis_lon_b, Polejson[i].gis_lat_b);
    //            gpsPoint.jsons = Polejson[i];
    //            points.push(gpsPoint);
    //        }
    //    }
    //    var options = "";
    //    if (CZType == "Pole") {
    //        options = {
    //            size: BMAP_POINT_SIZE_BIGGER,
    //            color: '#B22222'
    //        }
    //    } else {
    //        options = {
    //            size: BMAP_POINT_SIZE_BIGGER,
    //            color: '#9F79EE'
    //        }
    //    }
    //    var pointCollection = new BMap.PointCollection(points, options);  // 初始化PointCollection
    //    if (CZType == "Pole") {
    //        pointCollection.addEventListener('click', clickPole);
    //    } else {

    //        pointCollection.addEventListener('click', clickGPS);
    //    }
    //    map.addOverlay(pointCollection);  // 添加Overlay
    //}
    //clearAll();
    //map.closeInfoWindow();
    //alert(responseData)
    document.getElementById('btncols').click();
}

//批量删除支柱
function PdeletePole(pointlon1, pointlon3, pointlat1, pointlat3) {
    if ($('#org_tree').attr('treetype') == 'J' || $('#org_tree').attr('treetype') == 'TOPBOSS' || $('#org_tree').attr('treetype') == 'YSJ') {
        var ju = $('#org_tree').attr('code'); //局
        var jwd = '';
    }
    else {
        var str = $('#org_tree').attr('code');
        console.log(str);
        var arry = [];
        arry = str.split('$');
        console.log(arry);
        var ju = arry[0] + '$' + arry[1]; //局
        console.log(ju);
        var jwd = $('#org_tree').attr('code'); //机务段
    }
    var line = document.getElementById('lineselect').value; //线路
    var XB = '0'//行别
    if ($('#ddlxb').val() != '') {
        XB = $('#ddlxb').attr('code')
    }
    var jl = document.getElementById('jl').value; //
    var _jl = document.getElementById('_jl').value; //

    var points = [];  // 添加海量点数据

    responseData = XmlHttpHelper.transmit(false, "get", "text", "ASHX/Sms/PVerify.ashx?ju=" + ju + "&jwd=" + jwd + "&line=" + line + "&XB=" + escape(XB) + "&pointlon1=" + pointlon1 + "&pointlon3=" + pointlon3 + "&pointlat1=" + pointlat1 + "&pointlat3=" + pointlat3 + "&type=" + CZType + '&_type=delete&temp=' + Math.random(), null, null);

    QC();
    GetPosition();
    Polejson = getMisGpsPointsData(ju, jwd, line, XB, CZType, pagePoleNumber, jl, _jl);
    // map.removeOverlay(PoleE.target);
    if (Polejson.length > 1) {
        for (var i = 0; i < Polejson.length; i++) {
            if (CZType == "Pole") {
                var gpsPoint = new BMap.Point(Polejson[i].gis_lon_calc, Polejson[i].gis_lat_calc);
                gpsPoint.jsons = Polejson[i];
                points.push(gpsPoint);
            } else {
                var gpsPoint = new BMap.Point(Polejson[i].gis_lon_b, Polejson[i].gis_lat_b);
                gpsPoint.jsons = Polejson[i];
                points.push(gpsPoint);
            }
        }

        var options = "";
        if (CZType == "Pole") {
            options = {
                size: BMAP_POINT_SIZE_BIGGER,
                color: '#B22222'
            }
        } else {
            options = {
                size: BMAP_POINT_SIZE_BIGGER,
                color: '#9F79EE'
            }
        }
        var pointCollection = new BMap.PointCollection(points, options);  // 初始化PointCollection
        if (CZType == "Pole") {
            pointCollection.addEventListener('click', clickPole);
        } else {

            pointCollection.addEventListener('click', clickGPS);
        }
        map.addOverlay(pointCollection);  // 添加Overlay
    }
    clearAll();
    map.closeInfoWindow();
    alert(responseData)
}
function deletePole(id) {
    if ($('#org_tree').attr('treetype') == 'J' || $('#org_tree').attr('treetype') == 'TOPBOSS' || $('#org_tree').attr('treetype') == 'YSJ') {
        var ju = $('#org_tree').attr('code'); //局
        var jwd = '';
    }
    else {
        var str = $('#org_tree').attr('code');
        console.log(str);
        var arry = [];
        arry = str.split('$');
        console.log(arry);
        var ju = arry[0] + '$' + arry[1]; //局
        console.log(ju);
        var jwd = $('#org_tree').attr('code'); //机务段
    }
    var line = document.getElementById('lineselect').value; //线路
    var XB = '0'//行别
    if ($('#ddlxb').val() != '') {
        XB = $('#ddlxb').attr('code')
    }
    var jl = document.getElementById('jl').value; //
    var _jl = document.getElementById('_jl').value; //
    var type = "Pole";
    var points = [];  // 添加海量点数据


    responseData = XmlHttpHelper.transmit(false, "get", "text", "ASHX/Sms/OperationVerify.ashx?id=" + id + "&type=" + "Pole" + '&_type=delete&temp=' + Math.random(), null, null);

    Polejson = getMisGpsPointsData(ju, jwd, line, XB, type, pagePoleNumber, jl, _jl);
    // map.removeOverlay(PoleE.target);
    if (Polejson.length > 1) {
        for (var i = 0; i < Polejson.length; i++) {

            var gpsPoint = new BMap.Point(Polejson[i].gis_lon_calc, Polejson[i].gis_lat_calc);
            gpsPoint.jsons = Polejson[i];
            points.push(gpsPoint);
        }


        var options = {
            size: BMAP_POINT_SIZE_BIGGER,
            color: '#B22222'
        }
        var pointCollection = new BMap.PointCollection(points, options);  // 初始化PointCollection
        pointCollection.addEventListener('click', clickPole);
        map.addOverlay(pointCollection);  // 添加Overlay
    }
    clearAll();
    map.closeInfoWindow();
    alert(responseData)
    // alert(id);
}

//locationInfo 数据编辑保存，根据ID，单点更新 
function updateInfo(id) {
    var txtxb = $('#txtXB').val();
    var txtkm = $('#txtkm').val();
    if (txtkm != '0' && txtkm.split('+').length > 1) {
        txtkm = parseInt(txtkm.split('+')[0].split('K')[1]) * 1000 + parseInt(txtkm.split('+')[1])
    }
    var txtgh = $('#txtgh').val();
    var txtbh = $('#txtbh').val();
    responseData = XmlHttpHelper.transmit(false, "get", "text", "ASHX/Sms/Verify.ashx?ju=&jwd=&line=&XB=&page=1&type=update&id=" + id + "&txtxb=" + txtxb + "&txtkm=" + txtkm + "&txtgh=" + txtgh + "&txtbh=" + txtbh + '&temp=' + Math.random(), null, null);
    alert(responseData)
}

//locationInfo 删除单点
function deleteInfo(id) {
    if ($('#org_tree').attr('treetype') == 'J' || $('#org_tree').attr('treetype') == 'TOPBOSS' || $('#org_tree').attr('treetype') == 'YSJ') {
        var ju = $('#org_tree').attr('code'); //局
        var jwd = '';
    }
    else {
        var str = $('#org_tree').attr('code');
        console.log(str);
        var arry = [];
        arry = str.split('$');
        console.log(arry);
        var ju = arry[0] + '$' + arry[1]; //局
        console.log(ju);
        var jwd = $('#org_tree').attr('code'); //机务段
    }
    var line = document.getElementById('lineselect').value; //线路
    var XB = '0'//行别
    if ($('#ddlxb').val() != '') {
        XB = $('#ddlxb').attr('code')
    }
    var jl = document.getElementById('jl').value; //
    var _jl = document.getElementById('_jl').value; //
    var type = "INFO";
    var points = [];  // 添加海量点数据
    map.removeOverlay(InfoE.target);
    if (gpsjson.length > 1) {
        for (var i = 0; i < gpsjson.length; i++) {
            if (gpsjson.id != id) {
                var gpsPoint = new BMap.Point(gpsjson[i].gis_lon_b, gpsjson[i].gis_lat_b);
                gpsPoint.jsons = gpsjson[i];
                points.push(gpsPoint);
            }
        }
        var options = {
            size: BMAP_POINT_SIZE_BIGGER,
            color: '#9F79EE'
        }
        var pointCollection = new BMap.PointCollection(points, options);  // 初始化PointCollection
        pointCollection.addEventListener('click', clickGPS);
        map.addOverlay(pointCollection);  // 添加Overlay
    }

    responseData = XmlHttpHelper.transmit(false, "get", "text", "ASHX/Sms/OperationVerify.ashx?id=" + id + "&type=" + "Info" + '&_type=delete&temp=' + Math.random(), null, null);
    alert(responseData)
    gpsjson = getMisGpsPointsData(ju, jwd, line, XB, type, pageInfoNumber, jl, _jl);
    map.closeInfoWindow();
}



//测距
function CJOpen() {
    myDis.open();  //开启鼠标测距
};
function DWOpen() {
    document.getElementById('modal-DW').click();
};
var DWNumber = 0;

// 定位转换。
function SaveDW() {
    if ($("#Text1").val() != '') {
        var p = $("#Text1").val();
        var gpsPoint = new BMap.Point(p.split(',')[0], p.split(',')[1]);
        var icon = new BMap.Icon("/Common/MGIS/img/DW.png", new BMap.Size(24, 32));
        var markergps = new BMap.Marker(gpsPoint, { icon: icon });
        map.addOverlay(markergps); //���GPS��ע
        var labelgps = new BMap.Label("GPS坐标" + (DWNumber + 1), { offset: new BMap.Size(20, -10) });
        markergps.setLabel(labelgps); //���GPS��ע
        translateCallback = function (point) {
            var icon = new BMap.Icon("/Common/MGIS/img/DW.png", new BMap.Size(24, 32));
            var marker = new BMap.Marker(point, { icon: icon });
            map.addOverlay(marker);
            var label = new BMap.Label("百度坐标" + (DWNumber + 1), { offset: new BMap.Size(20, -10) });
            marker.setLabel(label); //��Ӱٶ�label
            map.setCenter(point);
            DWNumber++;
        }
        setTimeout(function () {
            BMap.Convertor.translate(gpsPoint, 0, translateCallback);     //��ʵ��γ��ת�ɰٶ�����
        }, 2000);
    } else {
        layer.tips('请先输入值', '#Text1', { tips: [1, 'green'] })
    }

}
function HCXPole() {
    pagePoleNumber++;
    CXPole();
}
function HCXGPS() {
    pageInfoNumber++;
    CXGPS();
}
function OCXPole() {
    QC();
    pagePoleNumber = 1;
    CXPole();
}
//原来的查询定位数据
//function OCXGPS() {
//    QC();
//    pageInfoNumber = 1;
//    CXGPS();
//}
function OCXSPole() {
    pagePoleSNumber = 1;
    CXSPole();
}
function OCXSGPS() {
    pageInfoSNumber = 1;
    CXSGPS();

}
function HCXSPole() {
    pagePoleSNumber++;
    CXSPole();
}
function HCXSGPS() {
    pageInfoSNumber++;
    CXSGPS();
}

function saveAsExcel() {
    var ddlyc = document.getElementById('ddlyc').value; //
    var txtDC = "主键,局编号,局,线路编号,线路,区站编号,区站,桥隧编号,桥隧名称,行别,公里标,杆号,序号,帧号,经度,纬度,百度经度,百度纬度,相邻两点位置差距,时间,数据类型";
    if (gpsjson == null) {
        alert("请先查询出数据！");
        return;
    }
    if (ddlyc == "0") {
        for (var i = 0; i < gpsjson.length; i++) {
            var txt = "";
            txt = gpsjson[i].id + ",";
            txt += gpsjson[i].BUREAU_CODE + ",";
            txt += gpsjson[i].bureauName + ",";
            txt += gpsjson[i].LINE_CODE + ",";
            txt += gpsjson[i].line_name + ",";
            txt += gpsjson[i].POSITION_CODE + ",";
            txt += gpsjson[i].position_name + ",";
            txt += gpsjson[i].BRG_TUN_CODE + ",";
            txt += gpsjson[i].BRG_TUN_NAME + ",";
            txt += gpsjson[i].direction + ",";
            txt += gpsjson[i].km_mark + ",";
            txt += gpsjson[i].POLE_NO + ",";
            txt += gpsjson[i].SERIAL_NO + ",";
            txt += gpsjson[i].FRAME_NO + ",";
            txt += gpsjson[i].gis_lon + ",";
            txt += gpsjson[i].gis_lat + ",";
            txt += gpsjson[i].gis_lon_b + ",";
            txt += gpsjson[i].gis_lat_b + ",";
            txt += gpsjson[i].WZ + ",";
            txt += gpsjson[i].CREATE_TIME + ",";
            if (gpsjson[i].ISZC == "1") {
                txt += "杆号异常" + "";
            } else if (gpsjson[i].JL == "1") {
                txt += "相邻两点距离过大" + "";
            } else if (gpsjson[i].XJL == "1") {
                txt += "相邻两点距离过小" + "";
            } else if (gpsjson[i].EXCEPTION_DATA_TYPE != "") {
                txt += "数据偏移" + "";
            } else {
                txt += "正常" + "";
            }
            txtDC = txtDC + "\n" + txt;
        }
    } else if (ddlyc == "1") {
        for (var i = 0; i < gpsjson.length; i++) {
            if (gpsjson[i].ISZC == "0" && gpsjson[i].JL == "0" && gpsjson[i].XJL == "0") {
                var txt = "";
                txt = gpsjson[i].id + ",";
                txt += gpsjson[i].BUREAU_CODE + ",";
                txt += gpsjson[i].bureauName + ",";
                txt += gpsjson[i].LINE_CODE + ",";
                txt += gpsjson[i].line_name + ",";
                txt += gpsjson[i].POSITION_CODE + ",";
                txt += gpsjson[i].position_name + ",";
                txt += gpsjson[i].BRG_TUN_CODE + ",";
                txt += gpsjson[i].BRG_TUN_NAME + ",";
                txt += gpsjson[i].direction + ",";
                txt += gpsjson[i].km_mark + ",";
                txt += gpsjson[i].POLE_NO + ",";
                txt += gpsjson[i].SERIAL_NO + ",";
                txt += gpsjson[i].FRAME_NO + ",";
                txt += gpsjson[i].gis_lon + ",";
                txt += gpsjson[i].gis_lat + ",";
                txt += gpsjson[i].gis_lon_b + ",";
                txt += gpsjson[i].gis_lat_b + ",";
                txt += gpsjson[i].WZ + ",";
                txt += gpsjson[i].CREATE_TIME + ",";
                txt += "正常" + "";
                txtDC = txtDC + "\n" + txt;
            }
        }
    } else if (ddlyc == "2") {
        for (var i = 0; i < gpsjson.length; i++) {
            if (gpsjson[i].ISZC == "1") {
                var txt = "";
                txt = gpsjson[i].id + ",";
                txt += gpsjson[i].BUREAU_CODE + ",";
                txt += gpsjson[i].bureauName + ",";
                txt += gpsjson[i].LINE_CODE + ",";
                txt += gpsjson[i].line_name + ",";
                txt += gpsjson[i].POSITION_CODE + ",";
                txt += gpsjson[i].position_name + ",";
                txt += gpsjson[i].BRG_TUN_CODE + ",";
                txt += gpsjson[i].BRG_TUN_NAME + ",";
                txt += gpsjson[i].direction + ",";
                txt += gpsjson[i].km_mark + ",";
                txt += gpsjson[i].POLE_NO + ",";
                txt += gpsjson[i].SERIAL_NO + ",";
                txt += gpsjson[i].FRAME_NO + ",";
                txt += gpsjson[i].gis_lon + ",";
                txt += gpsjson[i].gis_lat + ",";
                txt += gpsjson[i].gis_lon_b + ",";
                txt += gpsjson[i].gis_lat_b + ",";
                txt += gpsjson[i].WZ + ",";
                txt += gpsjson[i].CREATE_TIME + ",";
                txt += "杆号错误" + "";
                txtDC = txtDC + "\n" + txt;
            }
        }
    } else if (ddlyc == "3") {
        for (var i = 0; i < gpsjson.length; i++) {
            if (gpsjson[i].JL == "1") {
                var txt = "";
                txt = gpsjson[i].id + ",";
                txt += gpsjson[i].BUREAU_CODE + ",";
                txt += gpsjson[i].bureauName + ",";
                txt += gpsjson[i].LINE_CODE + ",";
                txt += gpsjson[i].line_name + ",";
                txt += gpsjson[i].POSITION_CODE + ",";
                txt += gpsjson[i].position_name + ",";
                txt += gpsjson[i].BRG_TUN_CODE + ",";
                txt += gpsjson[i].BRG_TUN_NAME + ",";
                txt += gpsjson[i].direction + ",";
                txt += gpsjson[i].km_mark + ",";
                txt += gpsjson[i].POLE_NO + ",";
                txt += gpsjson[i].SERIAL_NO + ",";
                txt += gpsjson[i].FRAME_NO + ",";
                txt += gpsjson[i].gis_lon + ",";
                txt += gpsjson[i].gis_lat + ",";
                txt += gpsjson[i].gis_lon_b + ",";
                txt += gpsjson[i].gis_lat_b + ",";
                txt += gpsjson[i].WZ + ",";
                txt += gpsjson[i].CREATE_TIME + ",";
                txt += "相邻两点距离过大" + "";
                txtDC = txtDC + "\n" + txt;
            }
        }
    } else if (ddlyc == "4") {
        for (var i = 0; i < gpsjson.length; i++) {
            if (gpsjson[i].XJL == "1") {
                var txt = "";
                txt = gpsjson[i].id + ",";
                txt += gpsjson[i].BUREAU_CODE + ",";
                txt += gpsjson[i].bureauName + ",";
                txt += gpsjson[i].LINE_CODE + ",";
                txt += gpsjson[i].line_name + ",";
                txt += gpsjson[i].POSITION_CODE + ",";
                txt += gpsjson[i].position_name + ",";
                txt += gpsjson[i].BRG_TUN_CODE + ",";
                txt += gpsjson[i].BRG_TUN_NAME + ",";
                txt += gpsjson[i].direction + ",";
                txt += gpsjson[i].km_mark + ",";
                txt += gpsjson[i].POLE_NO + ",";
                txt += gpsjson[i].SERIAL_NO + ",";
                txt += gpsjson[i].FRAME_NO + ",";
                txt += gpsjson[i].gis_lon + ",";
                txt += gpsjson[i].gis_lat + ",";
                txt += gpsjson[i].gis_lon_b + ",";
                txt += gpsjson[i].gis_lat_b + ",";
                txt += gpsjson[i].WZ + ",";
                txt += gpsjson[i].CREATE_TIME + "";
                txt += "相邻两点距离过小" + "";
                txtDC = txtDC + "\n" + txt;
            }
        }
    } else if (ddlyc == "5") {
        for (var i = 0; i < gpsjson.length; i++) {
            if (gpsjson[i].EXCEPTION_DATA_TYPE != "") {
                var txt = "";
                txt = gpsjson[i].id + ",";
                txt += gpsjson[i].BUREAU_CODE + ",";
                txt += gpsjson[i].bureauName + ",";
                txt += gpsjson[i].LINE_CODE + ",";
                txt += gpsjson[i].line_name + ",";
                txt += gpsjson[i].POSITION_CODE + ",";
                txt += gpsjson[i].position_name + ",";
                txt += gpsjson[i].BRG_TUN_CODE + ",";
                txt += gpsjson[i].BRG_TUN_NAME + ",";
                txt += gpsjson[i].direction + ",";
                txt += gpsjson[i].km_mark + ",";
                txt += gpsjson[i].POLE_NO + ",";
                txt += gpsjson[i].SERIAL_NO + ",";
                txt += gpsjson[i].FRAME_NO + ",";
                txt += gpsjson[i].gis_lon + ",";
                txt += gpsjson[i].gis_lat + ",";
                txt += gpsjson[i].gis_lon_b + ",";
                txt += gpsjson[i].gis_lat_b + ",";
                txt += gpsjson[i].WZ + ",";
                txt += gpsjson[i].CREATE_TIME + ",";
                txt += "数据偏移" + "";
                txtDC = txtDC + "\n" + txt;
            }
        }
    }
    $('#txtDC').val(txtDC);

}

var PYNumber = "0";
function infoDc(pointlon1, pointlon3, pointlat1, pointlat3) {

    if (parseFloat(pointlon1) >= parseFloat(pointlon3)) {
        if (parseFloat(pointlat1) >= parseFloat(pointlat3))
            SaveCsc(pointlon1, pointlon3, pointlat1, pointlat3);
        else
            SaveCsc(pointlon1, pointlon3, pointlat3, pointlat1);
    }
    else {
        if (parseFloat(pointlat1) >= parseFloat(pointlat3))
            SaveCsc(pointlon3, pointlon1, pointlat1, pointlat3)
        else
            SaveCsc(pointlon3, pointlon1, pointlat3, pointlat1)
    }
}

function SaveCsc(pointlon1, pointlon3, pointlat1, pointlat3) {
    var txtDC = "主键,局编号,局,线路编号,线路,区站编号,区站,桥隧编号,桥隧名称,行别,公里标,杆号,序号,帧号,经度,纬度,百度经度,百度纬度,相邻两点位置差距,时间,数据类型";
    for (var i = 0; i < gpsjson.length; i++) {
        if (parseFloat(gpsjson[i].gis_lon_b) <= parseFloat(pointlon1) && parseFloat(gpsjson[i].gis_lon_b) >= parseFloat(pointlon3) && parseFloat(gpsjson[i].gis_lat_b) <= parseFloat(pointlat1) && parseFloat(gpsjson[i].gis_lat_b) >= parseFloat(pointlat3)) {
            var txt = "";
            txt = gpsjson[i].id + ",";
            txt += gpsjson[i].BUREAU_CODE + ",";
            txt += gpsjson[i].bureauName + ",";
            txt += gpsjson[i].LINE_CODE + ",";
            txt += gpsjson[i].line_name + ",";
            txt += gpsjson[i].POSITION_CODE + ",";
            txt += gpsjson[i].position_name + ",";
            txt += gpsjson[i].BRG_TUN_CODE + ",";
            txt += gpsjson[i].BRG_TUN_NAME + ",";
            txt += gpsjson[i].direction + ",";
            txt += gpsjson[i].km_mark + ",";
            txt += gpsjson[i].POLE_NO + ",";
            txt += gpsjson[i].SERIAL_NO + ",";
            txt += gpsjson[i].FRAME_NO + ",";
            txt += gpsjson[i].gis_lon + ",";
            txt += gpsjson[i].gis_lat + ",";
            txt += gpsjson[i].gis_lon_b + ",";
            txt += gpsjson[i].gis_lat_b + ",";
            txt += gpsjson[i].WZ + ",";
            txt += gpsjson[i].CREATE_TIME + ",";
            txt += "数据偏移" + "";
            txtDC = txtDC + "\n" + txt;
        }
    }
    $('#txtDC').val(txtDC);
    PYNumber = "1";
    var BB = self.Blob;
    saveAs(
          new BB(
              ["\ufeff" + document.getElementById("txtDC").value] //\ufeff防止utf8 bom防止中文乱码
            , { type: "text/plain;charset=utf8" }
        )
        , document.getElementById("filename").value
    );
}

function Q_Alarm() {
    //map.clearOverlays();//清除地图上所有覆盖物
    for (var j = 0; j < map.getOverlays().length; j++) {
        if (map.getOverlays()[j].type == "Alarm") {

            map.removeOverlay(map.getOverlays()[j]);
            j = 0;
        }
    }
    var Loco = document.getElementById('locomotiveselect').value; //设备号
    if (Loco == "0") {  //默认全部值为0
        Loco = "";
    }
    var XB = '0'//行别
    if ($('#ddlxb').val() != '') {
        XB = $('#ddlxb').attr('code')
    }
    GetAlarm(Loco, "", "", "", XB, "", "", "", "");
}

function GetAlarm(deviceid, startTime, endTime, line, direction, org, OrgType, locatype, status) {
    var startdate = document.getElementById('startdate').value;  //开始时间
    var enddate = document.getElementById('enddate').value;   //结束时间
    if (startdate != null && startdate != "" && enddate != null && enddate != "") {
        if (enddate < startdate) {
            ymPrompt.errorInfo('结束时间必须比开始时间大~！！', null, null, '提示信息', null);
            return;
        }
    } else {
        ymPrompt.errorInfo('请选择查询告警时间~！！', null, null, '提示信息', null);
        return ;
    }
    var alarmJson = getMisC3AlarmData(deviceid, startTime, endTime, line, direction, org, OrgType, locatype, status);
    if (alarmJson != undefined && alarmJson.length > 0) {

        for (var i = 0; i < alarmJson.length; i++) {

            var m = alarmJson[i];
            //ico生成。
            var icoUrl = '/Common/MGIS/img/icoLevel.png';

            for (var j = 0; j < jbJson.length; j++) {
                if (m.SEVERITY == jbJson[j].name) {
                    switch (jbJson[j].code) {
                        case '一类':
                            icoUrl = icoUrl.replace('Level', '1');
                            break;
                        case '二类':
                            icoUrl = icoUrl.replace('Level', '2');
                            break;
                        case '三类':
                            icoUrl = icoUrl.replace('Level', '3');
                            break;
                    }
                }
            }

            if (alarmJson[i].GIS_X != "0") {

                var Point = new BMap.Point(alarmJson[i].GIS_X, alarmJson[i].GIS_Y);
                var icon = "";
                if (i == 0) {
                    map.panTo(Point);
                }
                icon = new BMap.Icon(icoUrl, new BMap.Size(25, 25));

                var marker = new BMap.Marker(Point, { icon: icon });
                //marker.setLabel(labelMark);
                map.addOverlay(marker);
                marker.disableDragging(true);
                marker.alarmJson = alarmJson[i];
                marker.type = "Alarm";
                marker.id = alarmJson[i].ID;
                marker.addEventListener("click", getC3AlarmInfo);
                // marker.addEventListener("dblclick", getC3AlarmInfo2);

                marker.setZIndex(10);

            }
            else {

            }
        }
    } else {
        ymPrompt.errorInfo('没有告警数据！', null, null, '提示信息', null);
    }
    map.alarmJson = alarmJson;
};


function getMisC3AlarmData(deviceid, startTime, endTime, lineCode, direction, org, OrgType, locatype, status) {
    var url = "";
    if ($('#org_tree').attr('treetype') == 'J' || $('#org_tree').attr('treetype') == 'TOPBOSS' || $('#org_tree').attr('treetype') == 'YSJ') {
        var ju = $('#org_tree').attr('code'); //局
        var jwd = '';
    }
    else {
        var str = $('#org_tree').attr('code');
        if (str != undefined) {
            var arry = [];
            arry = str.split('$');
            var ju = arry[0] + '$' + arry[1]; //局
            var jwd = $('#org_tree').attr('code'); //机务段or供电段
        } else {
            var ju = 0;
            var jwd = 0;
        }
    };
    var linetype = $("#linen_tree").attr("treetype");
    if (linetype == "LINE") {
        var line = $("#linen_tree").attr("code"); //线路
        var position = 0;
        var bridgetune = 0;
    } else if (linetype == "POSITION") {
        var position = $("#linen_tree").attr("code"); //区站
        var line = 0;
        var bridgetune = 0;
    } else if (linetype == "BRIDGETUNE") {
        var bridgetune = $("#linen_tree").attr("code"); //桥隧
        var position = 0;
        var line = 0;
    } else {
        var line = 0;
        var position = 0;
        var bridgetune = 0;
    };
    var XB = '0'//行别
    if ($('#ddlxb').val() != '') {
        XB = $('#ddlxb').attr('code')
    }
    var txtstartkm = document.getElementById('txtstartkm').value; //开始公里标
    var txtendkm = document.getElementById('txtendkm').value; //结束公里标

    var jb = $("#jb").val(); // 级别
    if (jb == null) {
        jb = "";
    }
    var ddlzt = $("#ddlzt").val();/// 状态
    if (ddlzt == null) {
        ddllx = "0";
    }
    var startdate = document.getElementById('startdate').value;  //开始时间
    var enddate = document.getElementById('enddate').value;   //结束时间
    if (startdate != null && startdate != "" && enddate != null && enddate != "") {
        if (enddate < startdate) {
            ymPrompt.errorInfo('结束时间必须比开始时间大~！！', null, null, '提示信息', null);
            return;
        }
    } else {
        ymPrompt.errorInfo('请选择查询告警时间~！！', null, null, '提示信息', null);
        return;
    }
    var citySel = $("#citySel").attr("code");// 报警类型
    if ($("#citySel").val() == "") {
        citySel = "";
    }
    var txt_fx = $("#txt_fx").val();//分析
    var txt_temp_hw1 = $("#txt_temp_hw1").val(); //最高温度
    var txt_temp_hw2 = $("#txt_temp_hw2").val(); //最高温度
    var txt_temp_hj1 = $("#txt_temp_hj1").val(); //环境温度
    var txt_temp_hj2 = $("#txt_temp_hj2").val(); //环境温度
    var txt_bow = $("#txt_bow").val(); //弓位置
    var txt_dg1 = $("#txt_dg1").val(); //导高
    var txt_dg2 = $("#txt_dg2").val(); //导高
    var txt_lc1 = $("#txt_lc1").val(); //拉出
    var txt_lc2 = $("#txt_lc2").val(); //拉出
    var txt_speed1 = $("#txt_speed1").val(); //速度
    var txt_speed2 = $("#txt_speed2").val(); //速度
    var txt_id = $("#txt_id").val(); //告警id
    url = '/Common/MGIS/ASHX/MisAlarm/BMapC3DataPoint.ashx?type=2&leNum=3&deviceid=' + escape(deviceid) +
        '&ju=' + escape(ju) +
        '&line=' + escape(line) +
        '&position=' + escape(position) +
        '&bridgetune=' + escape(bridgetune) +
        '&xb=' + escape(XB) +
        '&txtstartkm=' + txtstartkm +
        '&txtendkm=' + txtendkm +
        '&ddllx=' + "" +
        '&startTime=' + startdate +
        '&endTime=' + enddate +
        '&startdate=' + startdate +
        '&enddate=' + enddate +
        '&jibie=' + jb +
        '&dllzt=' + ddlzt +
        '&zhuangtai=' + escape("") +
        '&direction=' + escape(direction) +
        '&Category_Code=' + "3C" +
        '&citySel=' + citySel +
        '&txt_fx=' + txt_fx +
        '&txt_temp_hw1=' + txt_temp_hw1 +
        '&txt_temp_hw2=' + txt_temp_hw2 +
        '&txt_temp_hj1=' + txt_temp_hj1 +
        '&txt_temp_hj2=' + txt_temp_hj2 +
        '&txt_bow=' + txt_bow +
        '&txt_dg1=' + txt_dg1 +
        '&txt_dg2=' + txt_dg2 +
        '&txt_lc1=' + txt_lc1 +
        '&txt_lc2=' + txt_lc2 +
        '&txt_speed1=' + txt_speed1 +
        '&txt_speed2=' + txt_speed2 +
        '&ids=' + txt_id +
        '&temp=' + Math.random();
    var json;
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        cache: false,
        success: function (result) {
            if (result != "") {
                json = eval('(' + result + ')');
            }
        }
    });

    return json;
};

function getC3AlarmInfo(e) {
    type = this.alarmJson.CATEGORY_CODE;

    id = this.alarmJson.ALARM_ID;

    if (getConfig('For6C') == 'DPC') {
        switch (type) {
            case "1C":
                url = "/6C/PC/MAlarmMonitoring/MonitorAlarm1CForm6C.htm?alarmid=";
                break;
            case "2C":
                url = "/6C/PC/MAlarmMonitoring/MonitorAlarmC2Form6C.htm?alarmid=";
                break;
            case "3C":
                url = "/6C/PC/MAlarmMonitoring/MonitorAlarm3CForm6C.htm?alarmid=";
                break;
            case "4C":
                url = "/6C/PC/MAlarmMonitoring/MonitorAlarmC4Form6C.htm?alarmid=";
                break;
            case "5C":
                url = "/6C/PC/MAlarmMonitoring/MonitorAlarm5CForm6C.htm?alarmid=";
                break;
            case "6C":
                url = "/6C/PC/MAlarmMonitoring/MonitorAlarmC6Form6C.htm?alarmid=";
                break;
            default:
                break;
        }
    } else {
        switch (type) {
            case "1C":
                url = "../../C1/PC/MAlarmMonitoring/MonitorAlarmC1Form.htm?alarmid=";
                break;
            case "2C":
                url = "../../C2/PC/Fault/MonitorAlarmC2Form.htm?alarmid=";
                break;
            case "3C":
                if (getConfig('For6C') == '6C') {
                    url = "../../C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=";
                }
                else {
                    url = "/C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=";
                }
                break;
            case "4C":
                url = "../../C4/PC/Fault/MonitorAlarmC4Form.htm?alarmid=";
                break;
            case "5C":
                url = "../../C5/PC/Fault/MonitorAlarmC5Form.htm?alarmid=";
                break;
            case "6C":
                url = "../../C6/PC/Fault/MonitorAlarmC6Form.htm?alarmid=";
                break;
            default:
                break;
        }
    }
    var HTMLURL;
    if (getConfig('For6C') == '6C') {
        HTMLURL = url + id + "";
    }
    else {
        HTMLURL = url + id + "";
    }
    HTMLURL += "&rsurl=no";

    window.open(HTMLURL + '&v=' + version, "_blank");

    var point = new BMap.Point(this.alarmJson.GIS_X, this.alarmJson.GIS_Y);    // 创建点坐标
    map.panTo(point);


};


