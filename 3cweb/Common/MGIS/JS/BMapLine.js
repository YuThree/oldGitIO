/*========================================================================================*
* 功能说明：GIS线路业务数据方法类，与BMapJS的方法类做接口
* 注意事项：
* 作    者： wcg
* 版本日期：2013年5月9日
* 变更说明：
* 版 本 号： V1.0
*=======================================================================================*/
var AlarmLen = 1; //定义查询缺陷时地图的层次（1：实时GIS第一层新上报的告警；3：标示缺陷GIS查询的）
//获取中心点数据并加载Map
function getMislineSCenterPoints(maplevel, map) {
    //先加载地图  在异步加载数据信息

    map.clearOverlays();    //清除地图上所有覆盖物
    var CenterLon = getCookieValue("CenterLon");
    if (CenterLon == "null" || CenterLon == "") {
        CenterLon = getConfig('CenterLon');
    }
    var CenterLat = getCookieValue("CenterLat");
    if (CenterLat == "null" || CenterLat == "") {
        CenterLat = getConfig('CenterLat');
    }
    var point = new BMap.Point(CenterLon, CenterLat);    // 创建点坐标
    map.centerAndZoom(point, maplevel); // 初始化地图，设置中心点坐标和地图级别。
    map.enableScrollWheelZoom();
    map.enableKeyboard();
    map.disableDoubleClickZoom();
    // map：地图对象  maplevel：层次
    getMislineSCenterPointsData(maplevel, map, "ALARM"); //为了异步调用

};
//数据异步加载之后在执行此方法进行lineCenterjson：线路数据JSON map：地图对象  maplevel：层次
function GetMislineSCenterPointsAsync(lineCenterjson, map, maplevel) {
    if (lineCenterjson[0].X != "") {
        // for (var i = 1; i < lineCenterjson.length; i++) {
        if (getConfig('IsLine') == "1") {
            map.setZoom(8)
           // getBmapOnePoints("", maplevel, map);  //区站显示
        }
        if (getConfig("For6C") == "6C") {
            // getMisSubstationPoints(lineCenterjson[i][i][0].ID, maplevel, map, "3"); //3表示根据线路信息画变电所
        }
        // }
        if (getConfig("For6C") == "6C") {
            // map.Subjson = getMisSubstationPoints("", maplevel, map, "1"); //1表示只取变电所JSON信息
        }

        map.lineCenterjson = lineCenterjson;
        map.maplevel = maplevel;

        //设备

        if (getConfig('IsCar') == "1") {
            // --线路CODE  map：地图对象 
            getMisC3Point("", map);
        }

        //报警 map：地图对象  --车号 --开始时间 --结束时间 --(参数1、2、3)查询  --线路CODE
        AlarmLen = "1";
        getMisC3AlarmPoint(map, "", "", "", AlarmLen, "");
        //添加右键事件
        map.addEventListener("rightclick", function (e) { getOneMapmenu(e, map); });
    }
}
//自动刷新设备
function refushLocos() {

    var SmsId = 0;
    //读取Cookie获取最新设备时间
    var strCookie = document.cookie;
    var arrCookie = strCookie.split(";");
    for (var i = 0; i < arrCookie.length; i++) {
        var arr = arrCookie[i].split("=");
        if (arr[0].replace(/[ ]/g, "") == "C3Sms") {
            SmsId = arr[1];
        }
    }
    //SmsId判断是否刷新（0：标示为可以执行刷新，1：标示已经正在操作不能进行刷新）
    if (SmsId == 0) {
        //设备
        for (var i = 0; i < map.c3json.length; i++) {
            var Point = new BMap.Point(map.c3json[i].GIS_X, map.c3json[i].GIS_Y);
            for (var j = 0; j < map.getOverlays().length; j++) {
                if (map.getOverlays()[j].type == "Loco") {

                    map.removeOverlay(map.getOverlays()[j]);

                }
            }
        }

        //重画设备
        getMisC3Point("", map);
    } else if (SmsId == "1") {
        getC3ProcessInfo("", "");
    }
};
//刷新缺陷
function refushAlarm() {
    hid_pop();
    //缺陷
    for (var i = 0; i < map.c3alarm.length; i++) {
        var Point = new BMap.Point(map.c3alarm[i].GIS_X, map.c3alarm[i].GIS_Y);
        for (var j = 0; j < map.getOverlays().length; j++) {
            if (map.getOverlays()[j].type == "Alarm") {

                map.removeOverlay(map.getOverlays()[j]);

            }
        }
    }

    // 变电所
    if (getConfig("For6C") == "6C") {
        for (var i = 0; i < map.Subjson.length; i++) {
            var Point = new BMap.Point(map.Subjson[i].GIS_X, map.Subjson[i].GIS_Y);
            for (var j = 0; j < map.getOverlays().length; j++) {
                if (map.getOverlays()[j].Zu == "Marker") {
                    if (Point.lat == map.getOverlays()[j].getPosition().lat && Point.lng == map.getOverlays()[j].getPosition().lng) {
                        map.removeOverlay(map.getOverlays()[j]);
                    }
                }
            }
        }

        //重画变电所
        getMisSubstationPoints("", Number(('mapLevel')), map, "2"); //表示自动刷新的获取变电所信息
    }

    //重画缺陷
    AlarmLen = "1"; //定义查alarm层次
    getMisC3AlarmPoint(map, "", "", "", AlarmLen, "");

    map.addEventListener("rightclick", function (e) { getOneMapmenu(e, map); });
};
//自动刷新设备 ----- 未实现
function getMisC3Pointreflesh(mapss) {
    RefushLoco(mapss);
};

//获取中心点数据并加载Map
function getMislineCenterPoints(mislineid, maplevel, map, QX) {

    map.level = "2";
    getMislineCenterPointsData(mislineid, maplevel, map, QX);

};
//异步读取数据之后执行加载数据方法
function getMisLineCenterPointsAsync(lineCenterjson, mislineid, maplevel, map, QX) {
    if (lineCenterjson != undefined) {
        if (lineCenterjson.length > 0) {
            if (lineCenterjson[0].longitudeCenter != "") {
                var point = new BMap.Point(lineCenterjson[0].longitudeCenter, lineCenterjson[0].latitudeCenter);    // 创建点坐标
                // 初始化地图，设置中心点坐标和地图级别。
                map.centerAndZoom(point, maplevel);
                map.enableScrollWheelZoom();
                map.enableKeyboard();
                map.disableDoubleClickZoom();
                var jsons = [];
                if (QX == "") {
                    AlarmLen = "1"; //定义查alarm层次
                    getMisC3AlarmPoint(map, "", "", "", AlarmLen, mislineid);

                }
                if (QX != "Repeat")
                    getBmapTwoPoints(mislineid, maplevel, map);
                if (QX == "" || QX == undefined) {
                    getMisC3Point(mislineid, map);

                    if (getConfig("For6C") == "DPC") {
                        jsons.push(getMisSubstationPoints(mislineid, maplevel, map));
                    }

                    map.maplevel = maplevel;
                    // map.c3json = "";

                    //添加右键事件
                    map.addEventListener("rightclick", function (e) { getTwoMapmenu(e, map, maplevel, jsons); });
                }
            }
        } else {
            var point = new BMap.Point(getConfig('CenterLon'), getConfig('CenterLat'));    // 创建点坐标
            // 初始化地图，设置中心点坐标和地图级别。
            map.centerAndZoom(point, maplevel);
            map.enableScrollWheelZoom();
            map.enableKeyboard();
            map.disableDoubleClickZoom();
        }
    }
}

/*==========第二个页签===============================*/
//缺陷查询页面加载数据方法
//maplevel:地图层次, QXmap：缺陷地图对象, startTime：开始时间（现在未用）, endTime：结束时间（现在未用）
function getxqMislineSCenterPoints(maplevel, QXmap, startTime, endTime) {
    //调用异步加载线路中心点和线路信息 maplevel:地图层次, QXmap：缺陷地图对象 --实时GIS和缺陷GIS查询都调用同一方法（用ALARM和FAULT判断）
    // getMislineSCenterPointsData(maplevel, QXmap, "FAULT");
    getxqMislineSCenterPointsAsync(QXmap, maplevel, startTime, endTime);

};

//得到异步调用线路信息后执行操作
//maplevel:地图层次, QXmap：缺陷地图对象, lineCenterjson：返回的线路中心点和线路信息
function getxqMislineSCenterPointsAsync(QXmap, maplevel, startTime, endTime) {
    var point = new BMap.Point(getConfig('CenterLon'), getConfig('CenterLat'));    // 创建点坐标
    QXmap.centerAndZoom(point, maplevel); // 初始化地图，设置中心点坐标和地图级别。

    // for (var i = 1; i < lineCenterjson.length; i++) {

   // getBmapOnePoints("", maplevel, QXmap);   //取区站。 BMapPosition.js
    if (getConfig("For6C") == "6C") {
        //getMisSubstationPoints(lineCenterjson[i][i][0].MIS_LINE_ID, maplevel, map);
    }
    //}
    //判断时间是否为空，如果为空就不执行查询（二次判断，时间为空数据量太大）
    if (startTime != "") {
        AlarmLen = "3"; //定义缺陷查询
        getMisC3AlarmPoint(QXmap, "", "", "", AlarmLen, "");
    }
    //添加右键事件
    QXmap.addEventListener("rightclick", function (e) { getQxMapmenu(QXmap, e); });

}