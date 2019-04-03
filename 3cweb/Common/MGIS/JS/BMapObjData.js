/*========================================================================================*
* 功能说明：地图对象的数据操作类
* 注意事项：
* 作    者： dj
* 版本日期：2013年5月29日
* 修 改 人： dj
* 修改日期：2013年5月29日
* 变更说明：
* 版 本 号： V1.0
*=======================================================================================*/
//获取多条线路中心点数据
function getMislineSCenterPointsData(maplevel, map, type) {
    var url = "/Common/MGIS/ASHX/MisLine/BMapLinesDataPoints.ashx";
    var json;
    $.ajax({
        type: "POST",
        url: url,
        async: true,
        cache: true,
        success: function (result) {
            json = eval('(' + result + ')');
            if (type == "ALARM")
                GetMislineSCenterPointsAsync(json, map, maplevel); //数据加载完成执行 报警页面
            else
                getxqMislineSCenterPointsAsync(json, map, maplevel);  //数据加载完成执行 缺陷页面
        }
    });
    return json;
};

//获取一条线路中心点数据
function getMislineCenterPointsData(mislineid, maplevel, map, QX) {
    var url = "/Common/MGIS/ASHX/Position/BMapLineDataPoints.ashx?mislineid=" + mislineid + "&level=1";
    var json;
    $.ajax({
        type: "POST",
        url: url,
        async: true,
        cache: true,
        success: function (result) {
            json = eval('(' + result + ')');
            //数据加载完成之后执行
            if (QX != "Event") {
                getMisLineCenterPointsAsync(json, mislineid, maplevel, map, QX);
            } else {
                getEventMislineCenterPointsAsync(json, mislineid, maplevel, map);
            }
        }
    });
    return json;
};
//获取标注站点
function getMislinePointsData(mislineid, maplevel, map) {
    var url = "/Common/MGIS/ASHX/Position/BMapLineDataPoints.ashx?mislineid=" + mislineid + "&level=getAllPosion";
    var json;
    $.ajax({
        type: "POST",
        url: url,
        async: true,
        cache: true,
        success: function (result) {
            json = eval('(' + result + ')');
            if (map.level == "2") {
                getBmapTwoPointsAsync(json, mislineid, maplevel, map); //数据加载完成执行第二层次的单条线路
            } else {
                getBmapOnePointsAsync(json, mislineid, maplevel, map); //数据加载完成执行第一层次的多条线路
            }
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
function getMisC3PointsData(mislineid, map) {
    var url = "/Common/MGIS/ASHX/MisAlarm/BMapC3DataPoint.ashx?type=1&mislineid=" + mislineid;
    var json;
    $.ajax({
        type: "POST",
        url: url,
        async: true,
        cache: false,
        success: function (result) {
            json = eval('(' + result + ')');
            getMisC3PointAsync(json, mislineid, map)
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
function getMisC3AlarmPointsData(deviceid, startTime, endTime, LeNum, lineCode, map, direction, alarmType) {
    var url = "";
    var alarmType_type = '';//报警类型类别
    if (window.location.href.indexOf("MGIS/OrbitGIS.htm") > 0 && $('#citySel').val() != '') {
        alarmType_type = $('#citySel').attr('treetype');
    }
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
            '&direction=' + escape(direction) +
            '&LeNum=' + LeNum +
            '&Category_Code=' + GetQueryString("Category_Code") +
            '&temp=' + Math.random();

    } else {

        var txtqz = '';

        if (document.getElementById('txtqz')) {
            txtqz = document.getElementById('txtqz').value; //区站
        }
        var zt = getSelectedItem(document.getElementById('ddlzt'))//缺陷状态
        if (zt == undefined) {
            zt = '';
        }
        
        url = "/Common/MGIS/ASHX/MisAlarm/BMapC3DataPoint.ashx?type=2&deviceid=" + deviceid + "&LineCode=" + lineCode + "&startTime=" + startTime + "&endTime=" + endTime + "&LeNum=" + LeNum + "&Category_Code=" + GetQueryString("Category_Code") + "&direction=" + escape(direction) + "&_YS=" + GetQueryString("YS") + "&alarmType=" + alarmType + "&alarmType_type=" + alarmType_type + "&txtqz=" + txtqz + "&zt=" + zt;
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
                getMisC3AlaemPointAsync(map, json, deviceid, startTime, endTime, LeNum, lineCode);
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
function getC3ProcessInfoPointsData(deviceid, startdate, enddate, txtqz, direction, startspeed, endspeed, txtline, alarmType) {
    if (txtline == undefined) {
        txtline = "";
    }
    layer.load();
    var alarmType_type = '';//报警类型类别
    if (window.location.href.indexOf("MGIS/OrbitGIS.htm") > 0 && $('#citySel').val() != '') {
        alarmType_type = $('#citySel').attr('treetype');
    }
    var url = "/Common/MGIS/ASHX/Sms/C3ProcessInfo.ashx?deviceid=" + deviceid + "&startdate=" + startdate + "&enddate=" + enddate + "&txtqz=" + txtqz + "&direction=" + escape(direction) + "&startspeed=" + startspeed + "&endspeed=" + endspeed + "&_type=OK&type=1" + "&jl=" + GetQueryString("jl") + "&txtline=" + txtline + "&alarmType=" + alarmType + "&alarmType_type=" + alarmType_type;
    var json;
    $.ajax({
        type: "POST",
        url: url,
        async: true,
        cache: false,
        success: function (result) {
            layer.closeAll('loading');
            json = eval('(' + result + ')');
            getC3Sms_infoAsync(json, deviceid, startdate, enddate , txtqz, direction, startspeed, endspeed, txtline, alarmType);
        }
    });
    return json;
};


//获取设备轨迹
function getC3ProcessInfoPointsData1(deviceid, startdate, enddate, map, lineCode, direction) {
    var url = "/Common/MGIS/ASHX/Sms/C3ProcessInfo.ashx?deviceid=" + deviceid + "&startdate=" + startdate + "&enddate=" + enddate + "&_type=NO&type=1" + "&jl=" + GetQueryString("jl") + "&txtline=" + lineCode + "&direction=" + escape(direction) + "&startspeed=" + GetQueryString("startspeed") + "&endspeed=" + GetQueryString("endspeed") + "&txtqz=" + GetQueryString("txtqz");
    var json;
    $.ajax({
        type: "POST",
        url: url,
        async: true,
        cache: false,
        success: function (result) {
            json = eval('(' + result + ')');
            GetSmsJsonAsync(json, map, deviceid, startdate, enddate, lineCode, direction)
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
function getRepeatAlarm(alarmid, linecode, xb, jb, org_code, org_name, org_type, locomotive_code, startdate, enddate, txtqz, start_km, end_km, gis_x1, gis_y1, gis_x2, gis_y2, zt, afcode, distance, count, type) {
    var url = "/Common/MDataAnalysis/RemoteHandlers/RepeatAlarm.ashx?ALARM_ID=" + alarmid
    + "&LINE_CODE=" + linecode
    + "&XB=" + xb
    + "&JB=" + jb
    + "&ORG_CODE=" + org_code
    + "&ORG_NAME=" + org_name
    + "&ORG_TYPE=" + org_type
    + "&LOCOMOTIVE_CODE=" + locomotive_code
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
    window.parent.fullShow();
    $.ajax({
        type: "POST",
        url: url,
        async: true,
        cache: false,
        success: function (result) {
            window.parent.fullHide();
            jsonResult = eval('(' + result + ')');
            insertRepeatAlarm_list(jsonResult)
            drawRepeatAlarm(RepeatMap, jsonResult);
        },
        error: function () { fullHide(); }
    });
    //    return json;
};
//绘画重复报警地图点
function drawRepeatAlarm(map, jsonResult) {
    if (map.repeatAlamJson != undefined) {
        for (var j = 0; j < map.getOverlays().length; j++) {
            if (map.getOverlays()[j].type == "repeat") {
                map.removeOverlay(map.getOverlays()[j]);
                j--;
            }
        }
    }
    RepeatJsonList = jsonResult;
    if (jsonResult != undefined && jsonResult != null && jsonResult.length > 0) {
        for (var i = 0; i < jsonResult.length; i++) {
            var repeatAlamJson = jsonResult[i]; //得到一个重复报警对象，包含重复报警本身和其所有子报警
            if (repeatAlamJson.length > 0) {//每一个重复报警对象，在地图上生成一个点
                var Point = new BMap.Point(repeatAlamJson[0].GIS_X, repeatAlamJson[0].GIS_Y); //第一个是重复报警本身
                var icon;
                if (repeatAlamJson.length < 5) {
                    icon = new BMap.Icon("/Common/img/repeatAlarm/repeat_green.png", new BMap.Size(50, 50));
                }
                else if (repeatAlamJson.length < 10) {
                    icon = new BMap.Icon("/Common/img/repeatAlarm/repeat_blue.png", new BMap.Size(50, 50));
                }
                else {
                    icon = new BMap.Icon("/Common/img/repeatAlarm/repeat_red.png", new BMap.Size(50, 50));
                }
                var marker = new BMap.Marker(Point, { icon: icon });
                if (i == 0 || i == jsonResult.length - 1)
                    map.panTo(Point);
                map.addOverlay(marker);
                marker.disableDragging(true);
                marker.json = repeatAlamJson;
                marker.addEventListener("click", geRepeatAlarmInfo);  //BMapC3.js geRepeatAlarmInfo
                marker.type = "repeat";
                var opts = {
                    position: Point,    // 指定文本标注所在的地理位置
                    offset: new BMap.Size(12, -6)    //设置文本偏移量
                }
                var label = new BMap.Label(repeatAlamJson.length, opts);  // 创建文本标注对象
                label.setStyle({
                    color: "red",
                    fontSize: "15px",
                    height: "20px",
                    lineHeight: "20px",
                    fontFamily: "黑体",
                    fontWeight: "bold"
                });
                marker.setLabel(label);
            }

        }
    }
    else {
        ymPrompt.alert('没有重复报警', null, null, '提示信息', null);
    }

    map.repeatAlamJson = jsonResult;
}

//重复报警地列表html
function insertRepeatAlarm_list(json) {
    var list_html = '';
    for (var i = 0; i < json.length; i++) {
        var time = json[i].length;
        var position_html = json[i][0].LINE_NAME + '&ensp;' + json[i][0].POSITION_NAME + '</br>' + json[i][0].DIRECTION + '&ensp;' + json[i][0].KM_MARK + '&ensp;' + json[i][0].POLE_NUMBER
        json[i][0].POLE_NUMBER != '' && json[i][0].POLE_NUMBER != undefined ? position_html += '支柱' : position_html = position_html
        list_html += ' <div X="' + json[i][0].GIS_X + '" Y="' + json[i][0].GIS_Y + '" ><span>' + position_html + '</span><span style="line-height:36px;">' + time + '</span></div>'
    }
    //console.log(json[i][0])
    window.sessionStorage.setItem('repeatAlarm_html', list_html);
    window.sessionStorage.setItem('repeatAlarm_html_start', true);

}

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
    var direction = '';
    if ($('#direction').val() != '') {
        direction = $('#direction').attr('code');
    }
    var startspeed = $('#startSpeed').val();
    var endspeed = $('#endSpeed').val();
    var xb = '';
    if ($('#xb').val() != '') {
        xb = $('#xb').attr('code');
    }
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
    if (obj != null && obj != undefined) {
        for (var i = 0; i < obj.options.length; i++)
            if (obj.options[i].selected == true) {
                slct += obj.options[i].value;
            }
    }
    return slct;
};