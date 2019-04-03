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
}
//获取C3设备的坐标点
//mislineid  线路过滤将来用
function getMisC3PointsData(mislineid) {
    var url = "/Common/MGIS/ASHX/MisAlarm/BMapC3DataPoint.ashx?type=1&mislineid=" + mislineid;
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
}
//线路
function getMislineSCenterPointsData() {
    var url = "/Common/MGIS/ASHX/MisLine/BMapLinesDataPoints.ashx";
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
}
//站点
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
}
//报警
function getMisC3AlarmPointsData(LineCode, deviceid, startTime, endTime, LeNum) {
    var url = "";
    if (LeNum == "3") {
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
        url = '/Common/MGIS/ASHX/MisAlarm/BMapC3DataPoint.ashx?type=2&deviceid=' + deviceid + '&duan=' + escape(duan) +
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

    } else {
        url = "/Common/MGIS/ASHX/MisAlarm/BMapC3DataPoint.ashx?type=2&LineCode=" + LineCode + "&deviceid=" + deviceid + "&startTime=&endTime=&LeNum=" + LeNum + "&Category_Code=" + GetQueryString("Category_Code") + "";

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
}

//获取报警最近的区站和与区站的距离
function getMisC3AlarmNearByPos(lon, lat, bureauCode) {
    var url = "/Common/MGIS/ASHX/MisAlarm/BMapC3DataPoint.ashx?type=3&lon=" + lon + "&lat=" + lat + "&bureauCode=" + bureauCode;
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
}

//获取报警
function GetAlarms(Line_Code, GIS_X, GIS_Y, startTime, Time, TYPE) {
    var url = "ASHX/TwoAlarm.ashx?Line_Code=" + Line_Code + "&GIS_X=" + GIS_X + "&GIS_Y=" + GIS_Y + "&startTime=" + startTime + "&Time=" + Time + "&TYPE=" + TYPE;
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
}

//报警
function getMisTWOC3AlarmPointsData(ID) {
    var url = "ASHX/GetAlarm.ashx?type=2&ID=" + ID;
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
}
//获取重复报警分析结果
function getRepeatAlarm(alarmid, linecode, xb, startdate, enddate, distance, count) {
    var url = "/Common/MDataAnalysis/RemoteHandlers/RepeatAlarm.ashx?ALARM_ID=" + alarmid + "&LINE_CODE=" + linecode + "&XB=" + xb + "&START_DATE=" + startdate + "&END_DATE=" + enddate + "&RANGE=" + distance + "&REPEAT_COUT=" + count + "&type=click&isGis=1";
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
//获取选中项
function getSelectedItem(obj) {
    var slct = "";
    for (var i = 0; i < obj.options.length; i++)
        if (obj.options[i].selected == true) {
            slct += obj.options[i].value;
        }
    return slct;
};