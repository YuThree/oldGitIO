
/*========================================================================================*
* 功能说明：地图对象的数据操作类
* 注意事项：
* 作    者： wcg
* 版本日期：2013年5月29日
* 修 改 人： wcg
* 修改日期：2013年5月29日
* 变更说明：
* 版 本 号： V1.0
*=======================================================================================*/
//获取多条线路中心点数据

//获取标注站点
function getPostionData(lineCode, OrgCode, OrgType) {
    var url = "/Common/MGIS/ASHX/Position/BMapLineDataPoints.ashx?mislineid=" + lineCode + "&OrgCode=" + OrgCode + "&OrgType=" + OrgType + "&level=getAllPosion";
    var json;
    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        async: true,
        cache: true,
        success: function (result) {
            json = result;
            getBmapOnePoints(json);
        }
    });
    return json;
};

function getMislineSCenterPointsData(lineCode, OrgCode, OrgType, mapLevel, map) {
    var url = "RemoteHandlers/BMapLinesDataPoints.ashx?LineCode=" + lineCode + "&OrgCode=" + OrgCode + "&OrgType=" + OrgType;
    var json;
    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        async: true,
        cache: true,
        success: function (result) {
            json = result;
            for (var i = 1; i < json.length; i++) {
                if (json[i][i][0].ID != "") {
                    getMislinePointsData(json[i][i][0].ID, mapLevel, map);
                }

            }
        }
    });
    return json;
};


function getMislineSCenterPointsData2(lineCode, OrgCode, OrgType, mapLevel, map) {
    var url = "RemoteHandlers/BMapLinesDataPoints.ashx?LineCode=" + lineCode + "&OrgCode=" + OrgCode + "&OrgType=" + OrgType;
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


//获取一条线路中心点数据
function getMislineCenterPointsData(mislineid) {
    var url = "/Common/MGIS/ASHX/Position/BMapLineDataPoints.ashx?mislineid=" + mislineid + "&level=1";
    var json;
    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        async: false,
        cache: true,
        success: function (result) {
            json = result;
        }
    });
    return json;
};

//获取标注站点
function getMislinePointsData(mislineid, mapLevel, map) {
    var url = "/Common/MGIS/ASHX/Position/BMapLineDataPoints.ashx?mislineid=" + mislineid + "&level=2";
    var json;
    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        async: true,
        cache: true,
        success: function (result) {
            json = result;
            getBmapOnePoints(json);
        }
    });
    return json;
};




//获取变电站
function getMisSubstationPointsData(mislineid) {
    var url = "/Common/MGIS/ASHX/MisSubstation/BMapSubstationDataPoints.ashx?mislineid=" + mislineid + "&level=3";
    var json = "";
    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        async: false,
        cache: true,
        success: function (result) {
            if (result != "") {
                json = result;
            }
        }
    });
    return json;
};

//获取C3设备的坐标点
//mislineid  线路过滤将来用
function getMisC3PointsData(mislineid, _org, _OrgType, _locatype) {
    var key = escape($("body", parent.document).find("#iframe_loca").contents().find("#txt_so").val());
    if (key == undefined || key == 'undefined') {
        key = '';
    }

    var url = "RemoteHandlers/BMapC3DataPoint.ashx?type=1&mislineid=" + mislineid + "&OrgCode=" + _org + "&OrgType=" + _OrgType + "&LocaType=" + _locatype + "&key=" + key;
    var json;
    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        async: true,
        cache: true,
        success: function (result) {
            json = result;
            getMisC3Point(json, _org, _OrgType, _locatype);
        }
    });
    return json;
};


function getMisC3PointsData_call(options) {


    var defaults = {
        mislineid: '', //必须
        org: '', //必须      
        OrgType: "", //必须
        locatype: '',
        key: '',
        Callback: function () { }
    };
    var opts = $.extend(defaults, options);


    if (opts.key == undefined || opts.key == 'undefined') {
        opts.key = '';
    }

    var url = "RemoteHandlers/BMapC3DataPoint.ashx?type=1&mislineid=" + opts.mislineid + "&OrgCode=" + opts.org + "&OrgType=" + opts.OrgType + "&LocaType=" + opts.locatype + "&key=" + opts.key;
    var json;
    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        async: true,
        cache: true,
        success: function (result) {
            json = result;
            opts.Callback(json);
            //  getMisC3Point(json, _org, _OrgType, _locatype);
        }
    });
    return json;

}



//获取C3基础信息
function getMisC3DeviceVersion(TrainNo) {
    var url = "/Common/MGIS/ASHX/Sms/C3ProcessInfo.ashx?type=4&TrainNo=" + TrainNo; //4代表查询设备版本
    var json;
    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        async: false,
        cache: true,
        success: function (result) {
            json = result;
        }
    });
    return json;
};
//获取C3设备报警缺陷的坐标点
function getMisC3AlarmPointsData(map, deviceid, startTime, endTime, LeNum, lineCode, _org, _OrgType, _locatype, severity, status, firstLoad) {

    var url = "RemoteHandlers/BMapC3DataPoint.ashx?type=4&deviceid=" + deviceid + "&LineCode=" + lineCode + "&startTime=" + startTime + "&endTime=" + endTime + "&LeNum=" + LeNum + "&Org=" + _org + "&OrgType=" + _OrgType + "&LocaTpye=" + _locatype + "&Category_Code=" + GetQueryString("Category_Code") + "&firstLoad=" + firstLoad;

    if (severity != undefined) {
        url += "&severity=" + severity;
    }

    if (status != undefined) {
        url += "&status=" + status
    }

    var json;
    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        async: true,
        cache: false,
        success: function (result) {
            //  if (result != "") {

            if (result != null) {
                json = result.json;
                
                getMisC3AlarmPoint(json, map, deviceid, result.last_time, endTime, LeNum, lineCode, _org, _OrgType, _locatype, "", firstLoad);
            }
            else {
                json = [];
                getMisC3AlarmPoint(json, map, deviceid, LastStatusTime, endTime, LeNum, lineCode, _org, _OrgType, _locatype, "", firstLoad);
            }

            //   }

        }
    });
    return json;
};

//获取C3设备报警缺陷的坐标点
function getMisC3AlarmPointsData2(deviceid, startTime, endTime, LeNum, lineCode, _org, _OrgType, _locatype, severity, status) {

    var url = "RemoteHandlers/BMapC3DataPoint.ashx?type=4&deviceid=" + deviceid + "&LineCode=" + lineCode + "&startTime=" + startTime + "&endTime=" + endTime + "&LeNum=" + LeNum + "&Org=" + _org + "&OrgType=" + _OrgType + "&LocaTpye=" + _locatype + "&Category_Code=" + GetQueryString("Category_Code");

    if (severity != undefined) {
        url += "&severity=" + severity;
    }

    if (status != undefined) {
        url += "&status=" + status
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
            }

        }
    });
    return json;
};




//获取区站下的支柱中心点
function getMisPoleCenterPointsData(StationSectionName, PositionCode, mislineid) {
    var url = "/Common/MGIS/ASHX/MisPole/BMapPoleDataPoints.ashx?mispositionid=" + encodeURIComponent(StationSectionName) + "&PositionCode=" + PositionCode + "&mislineid=" + mislineid + "&level=1";
    var json;
    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        async: false,
        cache: true,
        success: function (result) {
            json = result;
        }
    });
    return json;
};
//获取区站下的支柱点
function getMisPolePointsData(StationSectionName, PositionCode, mislineid) {
    var url = "/Common/MGIS/ASHX/MisPole/BMapPoleDataPoints.ashx?mispositionid=" + encodeURIComponent(StationSectionName) + "&PositionCode=" + PositionCode + "&mislineid=" + mislineid + "&level=2";
    var json;
    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        async: false,
        cache: true,
        success: function (result) {
            json = result;
        }
    });
    return json;
};

//获取设备轨迹
function getC3ProcessInfoPointsData(deviceid, startdate, enddate) {
    var url = "/Common/MGIS/ASHX/Sms/C3ProcessInfo.ashx?deviceid=" + deviceid + "&startdate=" + startdate + "&enddate=" + enddate + "&type=1" + "&jl=" + GetQueryString("jl");
    var json;
    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        async: false,
        cache: true,
        success: function (result) {
            json = result;
        }
    });
    return json;
};






