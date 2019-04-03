/*========================================================================================*
* 功能说明：百度api封装 数据访问
* 作    者： DJ
* 版本日期：2016.1.4

*=======================================================================================*/

//获取线路数据
function getMislineData(org, orgtype, lineCode) {
    var url = "/Common/MGIS/ASHX/MisLine/getMislineData.ashx?org=" + escape(org) + "&orgtype=" + escape(orgtype) + "&lineCode=" + escape(lineCode);
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

//获取站点数据
function getMisPositionData(org, orgtype, lineCode) {
    var url = "/Common/MGIS/ASHX/Position/MisPositionData.ashx?org=" + escape(org) + "&orgtype=" + escape(orgtype) + "&lineCode=" + escape(lineCode);
    var json;
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        cache: false,
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

function getMisC3SmsData(org, OrgType, locatype, lineCode, key) {
    var url = "/Common/MGIS/ASHX/Sms/C3ProcessInfo.ashx?type=Newest&lineCode=" + escape(lineCode) + "&OrgCode=" + escape(org) + "&OrgType=" + escape(OrgType) + "&LocaType=" + escape(locatype) + "&key=" + escape(key);
    var json;
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        cache: false,
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
function getMisC3AlarmData(deviceid, startTime, endTime, lineCode, direction, org, OrgType, locatype, status) {
    var url = "";
    if (startTime != "" && status != "") {
        var ju = document.getElementById('juselect').value; //局
        var duan = document.getElementById('duanselect').value; //段
        var chejian = document.getElementById('chejianselect').value; //车间
        var gongqu = document.getElementById('gongquselect').value; //工区
        var line = document.getElementById('lineselect').value; //线路
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
        url = '/Common/MGIS/ASHX/MisAlarm/BMapC3DataPoint.ashx?type=FaultQuery&deviceid=' + escape(deviceid) + '&duan=' + escape(duan) +
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
            '&direction=' + escape(direction) +
            '&Category_Code=' + GetQueryString("Category_Code") +
            '&temp=' + Math.random();

    } else {
        url = "/Common/MGIS/ASHX/MisAlarm/BMapC3DataPoint.ashx?type=Query&deviceid=" + escape(deviceid) + "&LineCode=" + lineCode + "&startTime=" + startTime + "&endTime=" + endTime + "&Org=" + org + "&OrgType=" + OrgType + "&LocaTpye=" + locatype + "&status=" + escape(status) + "&Category_Code=" + GetQueryString("Category_Code") + "&direction=" + escape(direction) + "&_YS=" + GetQueryString("YS");
    }
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



//获取区站下的支柱中心点
function getMisPoleCenterPointsData(StationSectionName, PositionCode, mislineid, mapLevel, map) {
    var url = "/Common/MGIS/ASHX/MisPole/BMapPoleDataPoints.ashx?mispositionid=" + encodeURIComponent(StationSectionName) + "&PositionCode=" + PositionCode + "&mislineid=" + mislineid + "&level=1";
    var json;
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        cache: true,
        success: function (result) {
            json = eval('(' + result + ')');
            getMisPoleCenterPointsAsync(json, StationSectionName, PositionCode, mislineid, mapLevel, map);
        }
    });
};
//获取区站下的支柱点
function getMisPolePointsData(StationSectionName, PositionCode, mislineid, mapLevel, map) {
    var url = "/Common/MGIS/ASHX/MisPole/BMapPoleDataPoints.ashx?mispositionid=" + encodeURIComponent(StationSectionName) + "&PositionCode=" + PositionCode + "&mislineid=" + mislineid + "&level=2";
    var json;
    $.ajax({
        type: "POST",
        url: url,
        async: true,
        cache: true,
        success: function (result) {
            json = eval('(' + result + ')');
            getMisPolePointsAsync(json, StationSectionName, PositionCode, mislineid, mapLevel, map)
        }
    });
};

//获取设备轨迹
function getC3ProcessInfoPointsData(deviceid, startdate, enddate, txtqz, direction, startspeed, endspeed, txtline) {
    if (txtline == undefined) {
        txtline = "";
    }
    var url = "/Common/MGIS/ASHX/Sms/C3ProcessInfo.ashx?deviceid=" + deviceid + "&startdate=" + startdate + "&enddate=" + enddate + "&txtqz=" + txtqz + "&direction=" + escape(direction) + "&startspeed=" + startspeed + "&endspeed=" + endspeed + "&_type=OK&type=1" + "&jl=" + GetQueryString("jl") + "&txtline=" + txtline;
    var json;
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        cache: false,
        success: function (result) {
            json = eval('(' + result + ')');
        }
    });
    return json;
};


//获取设备轨迹
function getC3ProcessInfoPointsData1(deviceid, startdate, enddate, map, lineCode, direction) {
    var url = "/Common/MGIS/ASHX/Sms/C3ProcessInfo.ashx?deviceid=" + deviceid + "&startdate=" + startdate + "&enddate=" + enddate + "&_type=NO&type=1" + "&jl=" + GetQueryString("jl") + "&txtline=" + lineCode + "&direction=" + escape(direction);
    var json;
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        cache: false,
        success: function (result) {
            json = eval('(' + result + ')');
        }
    });
    return json;
};

//获取线路下的桥梁隧道
function getMisBridgeTunePointsData(mislineid) {
    var url = "/Common/MGIS/ASHX/MisBridgeTune/BMapBridgeTuneDataPoints.ashx?deviceid=" + mislineid + "&type=1";
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

//获取线路下的工区
function getMisOrgPointsData(mislineid) {
    var url = "/Common/MGIS/ASHX/Position/BMapLineDataPoints.ashx?mislineid=" + mislineid + "&level=4";
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

//获取机务段
function getMisOrgsPointsData(orgId) {
    var url = "/Common/MGIS/ASHX/Position/BMapOrgDataPoints.ashx?ID=" + orgId;
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

//获取全景
function GetOBJNormal(lat, log) {
    var url = "/Common/MGIS/ASHX/Normal/BMapNormal.ashx?lat=" + lat + "&log=" + log + "&type=1";
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
//获取上下针
function GetOBJNormalDirection(harddisk_id, direction) {
    var url = "/Common/MGIS/ASHX/Normal/C2BMapNormal.ashx?harddisk_id=" + harddisk_id + "&direction=" + direction + "&type=2";
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

//获取重复报警分析结果
function getRepeatAlarm(alarmid, linecode, xb, startdate, enddate, txtqz, start_km, end_km, gis_x1, gis_y1, gis_x2, gis_y2, zt, afcode, distance, count, type) {
    var url = "/Common/MDataAnalysis/RemoteHandlers/RepeatAlarm.ashx?ALARM_ID=" + alarmid
    + "&LINE_CODE=" + linecode
    + "&XB=" + xb
    + "&START_DATE=" + startdate
    + "&END_DATE=" + enddate
    + "&TXTQZ=" + txtqz
    + "&START_KM=" + start_km
    + "&END_KM=" + end_km
    + "&GIS_X1=" + gis_x1
    + "&GIS_Y1=" + gis_y1
    + "&GIS_X2=" + gis_x2
    + "&GIS_Y2=" + gis_y2
    + "&ZT=" + zt
    + "&AFCODE=" + afcode
    + "&RANGE=" + distance
    + "&REPEAT_COUT=" + count
    + "&QTYPE=" + type + "&type=click";
    var json;
    fullShow();
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        cache: false,
        success: function (result) {
            fullHide();
            json = eval('(' + result + ')');
        },
        error: function () { fullHide(); }
    });
    return json;
};

//获取缺陷统计信息
function getQxTjAlarm(linecode, startTime, endTime, SEVERITY) {
    var url = "/Common/MGIS/ASHX/MisAlarm/TjQxDataPoint.ashx?LINE_CODE=" + linecode + "&startTime=" + startTime + "&endTime=" + endTime + "&SEVERITY=" + SEVERITY;
    var json;
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        cache: false,
        success: function (result) {
            json = eval('(' + result + ')');
        }
    });
    return json;
};
//设置设备轨迹行别
function setDirection() {
    fullShow();
    var deviceid = GetQueryString("deviceid"); //车号
    var startdate = $('#Text2').val();
    var enddate = $('#Text3').val();
    var txtqz = $('#txtqz').val();
    var direction = $('#direction').val();
    var startspeed = $('#startSpeed').val();
    var endspeed = $('#endSpeed').val();
    var xb = $('#xb').val();
    var url = "/Common/MGIS/ASHX/Sms/C3ProcessInfo.ashx?deviceid=" + deviceid + "&startdate=" + startdate + "&enddate=" + enddate + "&txtqz=" + txtqz + "&direction=" + direction + "&startspeed=" + startspeed + "&endspeed=" + endspeed + "&type=5" + "&jl=" + GetQueryString("jl") + "&xb=" + xb;
    var json;
    $.ajax({
        type: "POST",
        url: url,
        async: true,
        cache: false,
        error: function () {
            fullHide();
            ymPrompt.errorInfo('设置失败！', null, null, '提示信息', null);
        },
        success: function (msg) {
            if (msg == "true") {
                //执行成功
                fullHide();
                ymPrompt.succeedInfo('设置成功！', null, null, '提示信息', null);
                $("#btnModal").click();
            }
            else {
                //执行失败
                fullHide();
                ymPrompt.errorInfo('设置失败！', null, null, '提示信息', null);
            }
        }
    });
    return json;
};
//获取选中项
function getSelectedItem(obj) {
    var slct = "";
    for (var i = 0; i < obj.options.length; i++)
        if (obj.options[i].selected == true) {
            slct += obj.options[i].value;
        }
    return slct;
};