
/*========================================================================================*
* 功能说明：区间站场标注并画线
* 注意事项：
* 作    者： wcg
* 版本日期：2013年5月29日
* 修 改 人： wcg
* 修改日期：2013年5月29日
* 变更说明：
* 版 本 号： V1.0
*=======================================================================================*/

//获取地图第一层标注站点--标注并画线
function getBmapOnePoints(mislineid, maplevel, map) {
    getMislinePointsData(mislineid, maplevel, map); //异步加载区站信息数据

};
///异步加载每条线路的区站信息
function getBmapOnePointsAsync(positionjson, mislineid, maplevel, map) {
    if (positionjson != undefined) {
        var Points = [];
        var blackline;
        var whiteline;
        var positionNo = -1;
        for (var i = 0; i < positionjson.length; i++) {
            var Point = new BMap.Point(positionjson[i].startLongitude, positionjson[i].startLatitude);
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
                    marker.setZIndex(1);
                    map.addOverlay(marker);
                    // marker.enableDragging(true);
                    // marker.setAnimation(BMAP_ANIMATION_BOUNCE);
                }
            }
            mislineid = positionjson[i].MIS_LINE_ID;
            if (i != 0 && positionjson[i - 1].MIS_LINE_ID != positionjson[i].MIS_LINE_ID) {
                if (getCookieValue("GISSmall") == "small") {
                    blackline = new BMap.Polyline(Points, { strokeColor: "black", strokeWeight: 6, strokeOpacity: 0.5, strokeStyle: "solid" });
                    whiteline = new BMap.Polyline(Points, { strokeColor: "white", strokeWeight: 6, strokeOpacity: 0.8, strokeStyle: "dashed" });
                } else {
                    blackline = new BMap.Polyline(Points, { strokeColor: "black", strokeWeight: 8, strokeOpacity: 0.5, strokeStyle: "solid" });
                    whiteline = new BMap.Polyline(Points, { strokeColor: "white", strokeWeight: 8, strokeOpacity: 0.8, strokeStyle: "dashed" });
                }
                //map.addOverlay(blackline);
                //map.addOverlay(whiteline);
                //if (getCookieValue("GISSmall") != "small") {
                //    blackline.addEventListener("click", function () {
                //        bMapTwobind(mislineid, map, maplevel, '');
                //    });
                //    whiteline.addEventListener("click", function () {
                //        bMapTwobind(mislineid, map, maplevel, '');
                //    });
                //}
                positionNo = -1;
                Points = [];
            }
            blackline = null;
            whiteline = null;
            positionNo++;
            Points.push(Point);

        }


        if (getCookieValue("GISSmall") == "small") {
            blackline = new BMap.Polyline(Points, { strokeColor: "black", strokeWeight: 6, strokeOpacity: 0.5, strokeStyle: "solid" });
            whiteline = new BMap.Polyline(Points, { strokeColor: "white", strokeWeight: 6, strokeOpacity: 0.8, strokeStyle: "dashed" });
        } else {
            blackline = new BMap.Polyline(Points, { strokeColor: "black", strokeWeight: 8, strokeOpacity: 0.5, strokeStyle: "solid" });
            whiteline = new BMap.Polyline(Points, { strokeColor: "white", strokeWeight: 8, strokeOpacity: 0.8, strokeStyle: "dashed" });
        }
        //map.addOverlay(blackline);
        //map.addOverlay(whiteline);
        //if (getCookieValue("GISSmall") != "small") {
        //    blackline.addEventListener("click", function () {
        //        bMapTwobind(mislineid, map, maplevel, '');
        //    });
        //    whiteline.addEventListener("click", function () {
        //        bMapTwobind(mislineid, map, maplevel, '');
        //    });
        //}


    }
}

//获取地图第二层标注站点--标注并画线
function getBmapTwoPoints(mislineid, maplevel, map) {
    getMislinePointsData(mislineid, maplevel, map); //异步加载区站信息数据

};
//获取地图第二层标注站点--标注并画线
function getBmapTwoPointsAsync(positionjson, mislineid, maplevel, map) {
    if (positionjson != undefined) {
        // var markerClusterer = new BMapLib.MarkerClusterer(map, { markers: markers })
        var markers = [];
        for (var i = 0; i < positionjson.length; i++) {
            var Point = new BMap.Point(positionjson[i].startLongitude, positionjson[i].startLatitude);
            var labelMark = new BMap.Label(positionjson[i].StationSectionName, { point: Point });
            labelMark.setStyle({
                color: "white",
                fontSize: "12px",

                backgroundColor: "rgba(15,15,17,0)",
                border: "0",
                fontWeight: "bold"
            });
            labelMark.setOffset(new BMap.Size(-14, -17));
            var icon = new BMap.Icon("/Common/MRTA/img/station.png", new BMap.Size(20, 30));
            var marker = new BMap.Marker(Point, { icon: icon });
            marker.setLabel(labelMark);
            marker.setZIndex(1);
            map.addOverlay(marker);
            // marker.enableDragging(true);
            marker.josn = positionjson[i];
            if (getCookieValue("GISSmall") != "small") {
                marker.addEventListener("click", function (e) {
                    bMapThreebind(e, map, maplevel, null);
                });
            }
            markers.push(marker);
            if (i != 0) {
                var Points = new Array(2);
                var fPoint = new BMap.Point(positionjson[i - 1].startLongitude, positionjson[i - 1].startLatitude);
                Points[0] = fPoint;
                Points[1] = Point;

                var blackline = new BMap.Polyline(Points, { strokeColor: "#0066CC", strokeWeight: 8, strokeOpacity: 0.5, strokeStyle: "solid" });
                var whiteline = new BMap.Polyline(Points, { strokeColor: "white", strokeWeight: 8, strokeOpacity: 0.8, strokeStyle: "dashed" });

                map.addOverlay(blackline);
                map.addOverlay(whiteline);
                var QZStationSectionName = positionjson[i].StationSectionName + "－" + positionjson[i - 1].StationSectionName;
                blackline.josn = positionjson[i];
                blackline.josnS = positionjson[i - 1];
                map.QZStationSectionName = QZStationSectionName;
                whiteline.josn = positionjson[i];
                whiteline.josnS = positionjson[i - 1];
                if (getCookieValue("GISSmall") != "small") {
                    blackline.addEventListener("click", function (e) {
                        bMapThreebind(e, map, maplevel, QZStationSectionName);
                    });
                    whiteline.addEventListener("click", function (e) {
                        bMapThreebind(e, map, maplevel, QZStationSectionName);
                    });
                }
            }

        }
    }
    //markerClusterer.addMarkers(markers);
    map.positionjson = positionjson;
    return positionjson;
};

//绑定区间信息
function bMapPositionQujianBind(e) {
    var infoQujianWindowOpts = {
        width: 100,     // 信息窗口宽度
        height: 60,     // 信息窗口高度
        title: "朱坡车长-黑龙堰车站"  // 信息窗口标题
    };
    var infoQujianWindow = new BMap.InfoWindow("朱坡车长-黑龙堰车站:三个缺陷", infoQujianWindowOpts);
    var Point = new BMap.Point((this.M[0].lng + this.M[1].lng) / 2, (this.M[0].lat + this.M[1].lat) / 2);
    this.map.openInfoWindow(infoQujianWindow, Point);
    this.map.centerAndZoom(e.point, this.map.getZoom());
};
//工区
function getMisOrgPoint(mislineid, map) {
    var json = getMisOrgPointsData(mislineid);
    for (var i = 0; i < json.length; i++) {
        var Point = new BMap.Point(json[i].GIS_X, json[i].GIS_Y);
        var labelMark = new BMap.Label(json[i].ORG_NAME, { point: Point });
        labelMark.setOffset(new BMap.Size(-20, -20));
        var icon = new BMap.Icon("/Common/img/gq.PNG", new BMap.Size(50, 50));
        var marker = new BMap.Marker(Point, { icon: icon });
        marker.setLabel(labelMark);
        marker.setZIndex(1);
        map.addOverlay(marker);
        //marker.disableDragging(true);
        marker.json = json[i];
        marker.addEventListener("click", "");
    }
    return json;
};
