
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
function getMislineSCenterPointsData(lineCode, OrgCode, OrgType) {
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
        async: false,
        cache: true,
        success: function (result) {
            json = eval('(' + result + ')');
        }
    });
    return json;
};
//获取标注站点
function getMislinePointsData(mislineid) {
    var url = "/Common/MGIS/ASHX/Position/BMapLineDataPoints.ashx?mislineid=" + mislineid + "&level=2";
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
//获取变电站
function getMisSubstationPointsData(mislineid) {
    var url = "/Common/MGIS/ASHX/MisSubstation/BMapSubstationDataPoints.ashx?mislineid=" + mislineid + "&level=3";
    var json = "";
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
        async: false,
        cache: true,
        success: function (result) {
            json = eval('(' + result + ')');
        }
    });
    return json;
};
//获取C3基础信息
function getMisC3DeviceVersion(TrainNo) {
    var url = "/Common/MGIS/ASHX/Sms/C3ProcessInfo.ashx?type=4&TrainNo=" + TrainNo; //4代表查询设备版本
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
//获取C3设备报警缺陷的坐标点
function getMisC3AlarmPointsData(deviceid, startTime, endTime, LeNum, lineCode, _org, _OrgType, _locatype, severity, status) {

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
        async: false,
        cache: true,
        success: function (result) {
            json = eval('(' + result + ')');
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
        async: false,
        cache: true,
        success: function (result) {
            json = eval('(' + result + ')');
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
        async: false,
        cache: true,
        success: function (result) {
            json = eval('(' + result + ')');
        }
    });
    return json;
};

