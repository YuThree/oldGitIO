/*========================================================================================*
* 功能说明：C3设备轨迹信息
* 注意事项：
* 作    者： Dj
* 版本日期：2013年5月29日
* 修 改 人： Dj
* 修改日期：2013年5月29日
* 变更说明：
* 版 本 号： V1.0
*=======================================================================================*/


var first = true;
var smsNumber = 0; //动态加载点的第几位
var C3SmsJson; //轨迹JSON
var setSmsshow; //自动刷新
var map; //地图对象
var _deviceid; //车哈
var _startdate; //开始时间
var _enddate; //结束时间
var _josn; //全部轨迹JSON
//_josn[0][2] 滑块使用的json, 按分钟数分组。时间+序号。
//_josn[0][1] 各车的状态列表josn.  
var _GJC3AlarmJson; //轨迹告警JSON
var c3SmsId;
var overlays = [];
var drawingManager;
var point1;
var point2;
var animateMarker = null;
var B_SmsNumberArray;
var reload_html = true;//是否重加载页面

//轨迹页面加载
function OrbMapbind(deviceid, startdate, enddate) {
    BindMap("orBmapDiv", 8);


    getC3Sms_Info(map, deviceid, startdate, enddate, "", GetQueryString("DIRECTION"), "", "", GetQueryString("LINE_CODE"));

};

//初始轨迹页面
function getC3Sms_Info(c3Map, deviceid, startdate, enddate, txtqz, direction, startSpeed, endSpeed, txtLine, alarmType) {
    c3Map.clearOverlays();    //清除地图上所有覆盖物
    map = c3Map;
    _deviceid = deviceid;
    _startdate = startdate;
    _enddate = enddate;
    if (direction == undefined || direction == "undefined") {
        direction = "";
    }
    if (txtLine == undefined || txtLine == "undefined") {
        txtLine = "";
    }
    //同级目录 BMapObjData.js
    getC3ProcessInfoPointsData(deviceid, startdate, enddate, txtqz, direction, startSpeed, endSpeed, txtLine, alarmType);

};
//动态加载机车轨迹
function getC3Sms_infoAsync(josn, deviceid, startdate, enddate, txtqz, direction, startSpeed, endSpeed, txtLine, alarmType) {
    _josn = josn;
    C3SmsJson = josn[0][1].JCINFO;
    if (josn != undefined) {
        EndNumber = josn[0][2].Dtime.length - 1;
        Setslider(josn[0][2].Dtime.length - 1);  //设置滑块最大值。
        if (josn == null || josn.length == 0 || josn[0][1].JCINFO.length == 0) {
            if (first == false) {
                ymPrompt.errorInfo(deviceid + '； 当前车没有运行数据，请稍后再试。', null, null, '提示信息', null);
                return;
            } else {
                $('#Submit1').click()
                first = false;
            }
            return
        }
        if (josn[0][0].GIS_X != "" && josn[0][0].GIS_X != "0") {
            var point = new BMap.Point(josn[0][0].GIS_X, josn[0][0].GIS_Y);    // 创建点坐标
            map.panTo(point);
            //添加右键事件
            map.addEventListener("rightclick", function (e) {
                getC3Mapmenu(e, map, josn[0][1].JCINFO);
            });


            //BmapC3.js
            var GJC3AlarmJson = getMisC3AlarmPoint(map, deviceid, startdate, enddate, "2", txtLine, direction, alarmType);
            _GJC3AlarmJson = GJC3AlarmJson;
            map.GJC3AlarmJson = GJC3AlarmJson;


            $("#_Content_Sta_Lab").html("" + josn[0][2].Dtime[0].Dtime);
            $("#_Content_End").html("结束时间：" + josn[0][2].Dtime[josn[0][2].Dtime.length - 1].Dtime);

            for (var i = 0; i < josn[0][1].JCINFO.length; i++) {

                //josn[0][2] 滑块使用的json, 按分钟数分组。时间+序号。
                //josn[0][1] 各车的状态列表josn.  
                //Dtime，yyyy-mm-dd hh:mi
                try {
                    if (josn[0][2].Dtime[0].Dtime == josn[0][1].JCINFO[i].SmsJson[0].Dtime) {

                        //初始化各车显示的数组下标。
                        if (i == 0) {
                            B_SmsNumberArray = "0";
                        } else {
                            B_SmsNumberArray = B_SmsNumberArray + ",0";
                        }
                        var Point = new BMap.Point(josn[0][1].JCINFO[i].SmsJson[0].GIS_X, josn[0][1].JCINFO[i].SmsJson[0].GIS_Y);
                        var lable = josn[0][1].JCINFO[i].SmsJson[0].TRAIN_NO; //+ "当前位置"
                        var icon = "";
                        if (lable.split('CR').length > 1) {
                            icon = new BMap.Icon(Ico_Loca_DC, new BMap.Size(Ico_Loca_Width, Ico_Loca_Height));
                        } else {
                            icon = new BMap.Icon(Ico_Loca_JC, new BMap.Size(Ico_Loca_Width, Ico_Loca_Height));

                        }
                        var labelMark;




                        //车头上的信息。

                        lable += "<br /> " + josn[0][1].JCINFO[i].SmsJson[0].WZ;
                        //if (josn[0][1].JCINFO[i].CROSSING_NO != "" && josn[0][1].JCINFO[i].CROSSING_NO != null) {
                        //    lable += "<br /> " + josn[0][1].JCINFO[i].CROSSING_NO + "号交路";
                        //} if (josn[0][1].JCINFO[i].KM_MARK != "0") {
                        //    lable += " K" + parseInt(josn[0][1].JCINFO[i].KM_MARK / 1000) + "+" + parseInt(josn[0][1].JCINFO[i].KM_MARK % 1000);
                        //}
                        lable += "<br/>" + josn[0][1].JCINFO[i].SmsJson[0].DETECT_TIME;
                        labelMark = new BMap.Label(lable, { point: Point });
                        labelMark.setOffset(new BMap.Size(-30, -50)); //labelMark.setOffset(new BMap.Size(-40, -30));
                        labelMark.type = "LableSms";
                        labelMark.setStyle(labelMark_style);
                        marker = new BMap.Marker(Point, { icon: icon });
                        marker.setLabel(labelMark);
                        marker.json = josn[0][1].JCINFO[i].SmsJson[0];
                        marker.setZIndex(10);
                        smsNumber = 1;
                        marker.type = "C3Sms";
                        marker.number = josn[0][1].JCINFO[i].SmsJson[0].TRAIN_NO + 0;
                        map.addOverlay(marker);
                        DIRECTION = josn[0][1].JCINFO[i].DIRECTION;
                        marker.addEventListener("click", getC3SmsOtherInfo);

                        //以上是初始化车。

                    } else {
                        if (i == 0) {
                            B_SmsNumberArray = "";
                        } else {
                            B_SmsNumberArray = B_SmsNumberArray + ",";
                        }
                    }

                } catch (e) {
                    if (i == 0) {
                        B_SmsNumberArray = "";
                    } else {
                        B_SmsNumberArray = B_SmsNumberArray + ",";
                    }
                }

            }

            chageSpeed(window.parent.checkDom, window.parent.speed);

            //            setSmsshow = setInterval('SetC3Sms()', 200);
        }
    } else {
        Setslider(0);
    }
    return josn;
}

//C3轨迹
var SmsPoint;

//弹出轨迹页面
function getC3SmsInfo11() {
    var date1 = parseDate(_DETECT_TIME);
    var date1_add = AddHours(date1, -3);
    var startdate = date1_add.format("yyyy/MM/dd hh:mm:ss");
    window.open("/Common/MGIS/OrbitGIS.htm?deviceid=" + deviceid + "&startdate=" + startdate + "&enddate=" + _DETECT_TIME + "&jl=" + _CROSSING_NO + "&LINE_CODE=" + escape(GetQueryString("LINE_CODE")) + "&DIRECTION=" + escape(GetQueryString("DIRECTION")) + "&Category_Code=3C&v=" + version);
}
//全部原始轨迹
function QB() {
    var deviceid = GetQueryString("deviceid"); //车号
    var startdate = $("#Text2").val();
    var enddate = $("#Text3").val();
    var txtline = $("#lineselect").val();
    var txtqz = $("#txtqz").val();
    var direction = ''//行别
    if ($('#direction').val() != '') {
        direction = $('#direction').attr('code')
    }
    var startSpeed = $("#startSpeed").val();
    var endSpeed = $("#endSpeed").val();
    var jl = GetQueryString("jl"); //交路
    window.open("/Common/MGIS/OrbitGIS1.htm?deviceid=" + escape(deviceid) + "&startdate=" + escape(startdate) + "&enddate=" + escape(enddate) + "&jl=" + escape(jl) + "&LINE_CODE=" + escape(txtline) + "&DIRECTION=" + escape(direction) + "&txtqz=" + escape(txtqz) + "&startSpeed=" + escape(startSpeed) + "&endSpeed=" + escape(endSpeed) + "&Category_Code=3C&YS=YS&v=" + version);
}
//动态加载
var DIRECTION = ""; //行别
var _DIRECTION = ""; //行别
var _XHNumber = 1; //循环次数
var opa = 0.5;
var color = "#00EE00"; // "#D8BFD8";

//播放一帧。
function SetC3Sms() {
    if (smsNumber <= EndNumber) {

        $("#Sms_slider").slider("option", "values", [smsNumber, EndNumber]);
        $("#_Content1").html("当前时间：" + _josn[0][2].Dtime[smsNumber].Dtime);
        var SetB_SmsNumberArray;

        //_josn[0][2] 滑块使用的json, 按分钟数分组。时间+序号。
        //_josn[0][1] 各车的状态列表josn.  
        for (var i = 0; i < _josn[0][1].JCINFO.length; i++) {
            var numbers = B_SmsNumberArray.toString().split(',');
            var p;
            var overlays = map.getOverlays();
            if (numbers[i] != "") {


                for (var j = 0; j < overlays.length; j++) {

                    var m = overlays[j];

                    //当前不是最后一帧。
                    if (numbers[i] != _josn[0][1].JCINFO[i].SmsJson.length - 1 && _josn[0][2].Dtime[smsNumber].Dtime == _josn[0][1].JCINFO[i].SmsJson[parseInt(numbers[i]) + 1].Dtime) {
                        if (m.type == "C3Sms" && m.number == _josn[0][1].JCINFO[i].SmsJson[numbers[i]].TRAIN_NO + numbers[i]
                            //     || _josn[0][1].JCINFO[i].SmsJson[number].Dtime == _josn[0][1].JCINFO[i].SmsJson[number - 1].Dtime
                            ) {

                            var Icon = new BMap.Icon("/Common/MGIS/img/1.png", new BMap.Size(40, 27));
                            m.setIcon(Icon);
                            m.getLabel().hide();
                            p = m.getPosition();

                        }
                    }
                }
            }
            var number = numbers[i];
            if (number == "") {
                number = 0;
            } else {
                number++;
            }

            //if (_josn[0][1].JCINFO[i].SmsJson[number].Dtime == _josn[0][1].JCINFO[i].SmsJson[number-1].Dtime)
            //{
            //    //当前帧的时间，与上一帧的时间相同。下标加1.

            //}

            if (number < _josn[0][1].JCINFO[i].SmsJson.length && _josn[0][2].Dtime[smsNumber].Dtime == _josn[0][1].JCINFO[i].SmsJson[number].Dtime) {
                if (i == 0) {
                    SetB_SmsNumberArray = number;
                } else {
                    SetB_SmsNumberArray = SetB_SmsNumberArray + "," + number;
                }
                if (p == null) {
                    var Point = new BMap.Point(_josn[0][1].JCINFO[i].SmsJson[number].GIS_X, _josn[0][1].JCINFO[i].SmsJson[number].GIS_Y);
                    p = Point;
                }
                var Points = new Array(2);
                Points[0] = p;

                var startetime;
                if (smsNumber == 0) {
                    startetime = _josn[0][2].Dtime[smsNumber].Dtime;
                } else {
                    startetime = _josn[0][2].Dtime[smsNumber - 1].Dtime;
                }
                var endtime = _josn[0][2].Dtime[smsNumber].Dtime;

                var Point = new BMap.Point(_josn[0][1].JCINFO[i].SmsJson[number].GIS_X, _josn[0][1].JCINFO[i].SmsJson[number].GIS_Y);
                Points[1] = Point;
                if (endtime >= startetime) {

                } else {

                }
                var bs = map.getBounds();   //获取可视区域
                var bssw = bs.getSouthWest();   //可视区域左下角
                var bsne = bs.getNorthEast();   //可视区域右上角
                if (bssw.lng > parseFloat(_josn[0][1].JCINFO[i].SmsJson[number].GIS_X)) {
                    map.panTo(Point);
                } else if (bsne.lng < parseFloat(_josn[0][1].JCINFO[i].SmsJson[number].GIS_X)) {
                    map.panTo(Point);
                } else if (bssw.lat > parseFloat(_josn[0][1].JCINFO[i].SmsJson[number].GIS_Y)) {
                    map.panTo(Point);
                } else if (bsne.lat < parseFloat(_josn[0][1].JCINFO[i].SmsJson[number].GIS_Y)) {
                    map.panTo(Point);
                }

                var lable = _josn[0][1].JCINFO[i].SmsJson[number].TRAIN_NO; //+ "当前位置"
                var icon = "";
                if (lable.split('CR').length > 1) {
                    icon = new BMap.Icon(Ico_Loca_DC, new BMap.Size(Ico_Loca_Width, Ico_Loca_Height));
                } else {
                    icon = new BMap.Icon(Ico_Loca_JC, new BMap.Size(Ico_Loca_Width, Ico_Loca_Height));


                }
                var labelMark;
                lable += "<br /> " + _josn[0][1].JCINFO[i].SmsJson[number].WZ;

                //if (C3SmsJson[smsNumber].CROSSING_NO != "" && C3SmsJson[smsNumber].CROSSING_NO != null) {
                //    lable += "<br /> " + C3SmsJson[smsNumber].CROSSING_NO + "号交路";
                //} if (C3SmsJson[smsNumber].KM_MARK != "0") {
                //    lable += " K" + parseInt(C3SmsJson[smsNumber].KM_MARK / 1000) + "+" + parseInt(C3SmsJson[smsNumber].KM_MARK % 1000);
                //}

                lable += "<br/>" + _josn[0][1].JCINFO[i].SmsJson[number].DETECT_TIME;
                labelMark = new BMap.Label(lable, { point: Point });
                labelMark.setOffset(new BMap.Size(-30, -50)); //labelMark.setOffset(new BMap.Size(-40, -30));
                labelMark.type = "LableSms";
                labelMark.setStyle(labelMark_style);
                marker = new BMap.Marker(Point, { icon: icon });
                marker.setLabel(labelMark);
                marker.json = _josn[0][1].JCINFO[i].SmsJson[number];
                marker.setZIndex(4);
                marker.type = "C3Sms";
                marker.number = _josn[0][1].JCINFO[i].SmsJson[number].TRAIN_NO + number;
                smsNumber == 1 ? map.centerAndZoom(Point, 10) : '';
                map.addOverlay(marker);
                marker.addEventListener("click", getC3SmsOtherInfo);
                var redline = "";

                if (_josn[0][1].JCINFO[i].SmsJson[number].DIRECTION == "") {
                    _XHNumber = 0;
                } else if (_josn[0][1].JCINFO[i].SmsJson[number].DIRECTION == "上行") {
                    _XHNumber = 1;
                } else {
                    _XHNumber = 2;
                }
                if (smsNumber != 0 && number != 0) {

                    color = styleColor[_XHNumber].Color; // '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6);

                    redline = new BMap.Polyline(Points, { strokeColor: color, strokeWeight: 5, strokeOpacity: 1, strokeStyle: "solid" });


                    //连线。
                    if (GetDateC(_josn[0][1].JCINFO[i].SmsJson[number - 1].DETECT_TIME, _josn[0][1].JCINFO[i].SmsJson[number].DETECT_TIME) > 1 || _josn[0][1].JCINFO[i].SmsJson[number - 1].IsAbnormal == "异常点" || _josn[0][1].JCINFO[i].SmsJson[number].IsAbnormal == "异常点") {
                        // color = '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6);
                    } else {
                        map.addOverlay(redline);
                    }
                }
                for (var n = 0; n < overlays.length; n++) {

                    var m = overlays[n];
                    if (m.type == "Alarm") {
                        var alarmTime = m.json.RAISED_TIME;
                        var beginTimes = Date.parse(startetime);
                        var endTimes = Date.parse(endtime);
                        var alarmTimes = Date.parse(alarmTime);
                        if (beginTimes <= alarmTimes && alarmTimes <= endTimes) {
                            m.show();
                        }
                    }

                }
                if (smsNumber == EndNumber) {
                    $('#btn_play').show();
                    $('#btn_pause').hide();
                    clearInterval(setSmsshow);
                }
                //前几帧判断地图车图像加载成功没有   没有就刷新页面
                if (i <= 2 && j <= 2) {
                    $('#orBmapDiv').find('.BMap_Marker').each(function () {
                        if ($(this).find('img').attr('src') == '/Common/MRTA/img/动车.png' || $(this).find('img').attr('src') == '/Common/MRTA/img/机车.png') {
                            reload_html = false;
                            return false;
                        }
                    })
                    if (reload_html) {
                        location.reload()
                    }
                }



            } else {
                if (i == 0) {
                    if (number == 0) {
                        number = "";
                        SetB_SmsNumberArray = number;
                    } else {
                        SetB_SmsNumberArray = (parseInt(number) - 1);
                    }
                } else {
                    if (number == 0) {
                        number = "";
                        SetB_SmsNumberArray = SetB_SmsNumberArray + "," + number;
                    } else {
                        SetB_SmsNumberArray = SetB_SmsNumberArray + "," + (parseInt(number) - 1);
                    }
                }
            }
        }
        B_SmsNumberArray = SetB_SmsNumberArray;
    } else {
        $('#btn_play').show();
        $('#btn_pause').hide();
        clearInterval(setSmsshow);
    }
    smsNumber++;
}





var getRandomColor = function () {

    return '#' +
      (function (color) {
          return (color += '0123456789abcdef'[Math.floor(Math.random() * 16)])
            && (color.length == 6) ? color : arguments.callee(color);
      })('');
}
function GetDateC(date1, date2) {
    var date3 = new Date(date2).getTime() - new Date(date1).getTime()  //时间差的毫秒数
    var leave1 = date3 % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000)) + (date3 / (24 * 3600 * 1000) * 24);
    return hours;
}
//查询条件
function OnClickSmsInfo() {
    var deviceid = GetQueryString("deviceid");
    var startTime = $("#Text2").val();
    var endTime = $("#Text3").val();
    var txtline = $("#lineselect").val();
    var txtqz = $("#txtqz").val();
    var direction = '0'//行别
    if ($('#direction').val() != '') {
        direction = $('#direction').attr('code')
    }
    var startSpeed = $("#startSpeed").val();
    var endSpeed = $("#endSpeed").val();

    var alarmType = $('#citySel').val() != '' ? $('#citySel').attr('code') : ''; //报警类型
    if (endTime < startTime) {
        ymPrompt.errorInfo('结束时间必须比开始时间大~！！', null, null, '提示信息', null);
        return;
    }

    smsNumber = 0;
    $('#btn_play').hide();
    $('#btn_pause').show();
    clearInterval(setSmsshow); //关闭定时器
    getC3Sms_Info(map, deviceid, startTime, endTime, txtqz, direction, startSpeed, endSpeed, txtline, alarmType);
}

var setshowSms; //定时器
function RefreshSms() {
    var showtime = 60000; //刷新时间
    setshowSms = setInterval('show_Sms()', showtime);
}
//关闭定时器
function closeTime() {
    clearInterval(setshowSms); //关闭定时器
}
//加速显示
function show_Sms() {
    var deviceid = GetQueryString("deviceid");
    var startTime = C3SmsJson[0].DETECT_TIME;
    var endTime = datehhssNowStr();
    var josn = getC3ProcessInfoPointsData(deviceid, startTime, endTime);

    if (josn != undefined) {
        if (josn == null || josn.length == 0) {
            return;
        }
        if (C3SmsJson.length < josn[0][1].JCINFO.length) {
            C3SmsJson = josn[0][1].JCINFO;
            setSmsshow = setInterval('SetC3Sms()', 200);
        }

    }

}



var cc = 0; //记录当前层数

//原始轨迹，页面加载
function getC3ProcessInfo1(deviceid, startdate, enddate) {
    BindMap("orBmapDiv", 8);
    var mapStyle = {
        //features: ["road", "building", "water", "land"], //隐藏地图上的poi
        features: ["water", "land"], //隐藏地图上的poi
        style: "normal"  //设置地图风格为高端黑
    }
    map.setMapStyle(mapStyle);
    map.clearOverlays();
    this.deviceid = deviceid;
    var overlaycomplete = function (e) {
        clearAll();
        c3SmsId = "";
        overlays.push(e.overlay);
        point1 = e.overlay.getPath()[0];
        point2 = e.overlay.getPath()[2];
        $("#txtPoint1").val(point1.lng + "," + point1.lat);
        $("#txtPoint2").val(point2.lng + "," + point2.lat);
        $(".BMapLib_box BMapLib_hander_hover").click();

        // window.parent.setGPS(point1.lng, point1.lat, point2.lng, point2.lat);
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

    var direction = GetQueryString("DIRECTION");
    if (direction == undefined || direction == "undefined") {
        direction = "";
    }
    var txtLine = GetQueryString("LINE_CODE");
    if (txtLine == undefined || txtLine == "undefined") {
        txtLine = "";
    }
    GetSmsJson(map, deviceid, startdate, enddate, txtLine, direction);
};

function GetSmsJson(map, deviceid, startdate, enddate, lineCode, direction) {
    //加载原始轨迹的异步调用方法 deviceid：车号 startdate：开始时间  enddate：结束时间 map：地图对象
    getC3ProcessInfoPointsData1(deviceid, startdate, enddate, map, lineCode, direction); //BMapObjData.js 
}
//加载原始轨迹的异步调用后加载数据 josn：状态数据对象Json deviceid：车号 startdate：开始时间  enddate：结束时间 map：地图对象
function GetSmsJsonAsync(josn, map, deviceid, startdate, enddate, lineCode, direction) {
    if (josn != undefined) {
        if (josn == null || josn.length == 0) {
            return;
        }
        if (josn[0][0].GIS_X != "") {
            var point = new BMap.Point(josn[0][1].JCINFO[0].SmsJson[0].GIS_X, josn[0][1].JCINFO[0].SmsJson[0].GIS_Y);    // 创建点坐标

            cc = 10;

            map.centerAndZoom(point, cc); // 初始化地图，设置中心点坐标和地图级别。

            //添加右键事件

            var GJC3AlarmJson = getMisC3AlarmPoint(map, deviceid, startdate, enddate, "2", lineCode, direction);
            map.GJC3AlarmJson = GJC3AlarmJson;

            map.addEventListener("rightclick", function (e) {
                getC3Mapmenu(e, map, josn[0][1].JCINFO);
            });
            var Points = new Array(josn[0][1].JCINFO.length);
            // var markers = [];
            var mathPoint;
            for (var i = 0; i < josn[0][1].JCINFO[0].SmsJson.length; i++) {
                //                if (josn[0][1].JCINFO[i].GIS_X == '0') {
                //                    alert(i + "," + josn[0][1].JCINFO[i].GIS_X);
                //                }
                if (parseFloat(josn[0][1].JCINFO[0].SmsJson[i].GIS_X) > 180 || parseFloat(josn[0][1].JCINFO[0].SmsJson[i].GIS_X) < 0 || parseFloat(josn[0][1].JCINFO[0].SmsJson[i].GIS_Y) > 90 || parseFloat(josn[0][1].JCINFO[0].SmsJson[i].GIS_Y) < 0) {
                    continue;
                }
                var Point = new BMap.Point(josn[0][1].JCINFO[0].SmsJson[i].GIS_X, josn[0][1].JCINFO[0].SmsJson[i].GIS_Y);
                Points[i] = Point;
                var marker;
                if (i == 0 || i == josn[0][1].JCINFO[0].SmsJson.length - 1) {
                    mathPoint = Point;
                    if (i == josn[0][1].JCINFO[0].SmsJson.length - 1) {
                        var lable = josn[0][1].JCINFO[0].SmsJson[i].TRAIN_NO + "当前位置";
                        var icon = "";
                        if (lable.split('CR').length > 1) {
                            icon = new BMap.Icon(Ico_Loca_DC, new BMap.Size(Ico_Loca_Width, Ico_Loca_Height));
                        } else {
                            icon = new BMap.Icon(Ico_Loca_JC, new BMap.Size(Ico_Loca_Width, Ico_Loca_Height));


                        }

                        var labelMark;
                        if (SmsPoint == point) {

                            labelMark = new BMap.Label("当前位置", { point: Point });
                            labelMark.setOffset(new BMap.Size(-30, -50)); //labelMark.setOffset(new BMap.Size(-8, -20));
                        } else {
                            lable += "<br/>" + josn[0][1].JCINFO[0].SmsJson[i].WZ

                            lable += "<br/>" + josn[0][1].JCINFO[0].SmsJson[i].DETECT_TIME;
                            labelMark = new BMap.Label(lable, { point: Point });
                            labelMark.setOffset(new BMap.Size(-30, -50)); //labelMark.setOffset(new BMap.Size(-8, -60));
                        }
                        SmsPoint = point;
                        var makIco1 = icon;
                        if (josn[0][1].JCINFO[0].SmsJson[i].INVALID_TRACK == "1") {

                            icon = new BMap.Icon("img/error.png", new BMap.Size(26, 26));
                        } else if (josn[0][1].JCINFO[0].SmsJson[i].INVALID_TRACK == "0") {

                            icon = new BMap.Icon("img/zq.png", new BMap.Size(26, 26));
                        }
                        marker = new BMap.Marker(Point, { icon: icon });

                        marker.ico1 = makIco1;
                        marker.ico2 = new BMap.Icon("img/error.png", new BMap.Size(26, 26));
                        marker.setLabel(labelMark);
                        marker.c3SmsId = josn[0][1].JCINFO[0].SmsJson[i].ID;
                        marker.json = josn[0][1].JCINFO[0].SmsJson[i];
                        map.addOverlay(marker);
                        marker.addEventListener("click", getC3SmsOtherInfo);
                        //  markers.push(marker);
                    } else {
                        var icon = new BMap.Icon("/Common/img/jc.gif", new BMap.Size(40, 28));
                        var labelMark = new BMap.Label("起点位置", { point: Point });
                        labelMark.setOffset(new BMap.Size(-30, -50)); //labelMark.setOffset(new BMap.Size(-8, -20));
                        if (josn[0][1].JCINFO[0].SmsJson[i].INVALID_TRACK == "1") {

                            icon = new BMap.Icon("img/error.png", new BMap.Size(26, 26));
                        } else if (josn[0][1].JCINFO[0].SmsJson[i].INVALID_TRACK == "0") {

                            icon = new BMap.Icon("img/zq.png", new BMap.Size(26, 26));
                        }
                        marker = new BMap.Marker(Point, { icon: icon });

                        marker.ico1 = new BMap.Icon("/Common/img/jc.gif", new BMap.Size(40, 28));
                        marker.ico2 = new BMap.Icon("img/error.png", new BMap.Size(26, 26));
                        marker.setLabel(labelMark);
                        marker.c3SmsId = josn[0][1].JCINFO[0].SmsJson[i].ID;
                        marker.json = josn[0][1].JCINFO[0].SmsJson[i];
                        map.addOverlay(marker);
                        marker.addEventListener("click", getC3SmsOtherInfo);
                        //  markers.push(marker);
                    }

                } else {
                    if (josn[0][1].JCINFO[0].SmsJson[i].DIRECTION == "上行") {
                        icon = new BMap.Icon("img/flash_up.png", new BMap.Size(16, 16));
                    } else if (josn[0][1].JCINFO[0].SmsJson[i].DIRECTION == "下行") {
                        icon = new BMap.Icon("img/flash_down.png", new BMap.Size(16, 16));
                    } else {

                        var icon;
                        if (josn[0][1].JCINFO[0].SmsJson[i].GIS_Y > josn[0][1].JCINFO[0].SmsJson[i - 1].GIS_Y) {//箭头向下
                            icon = new BMap.Icon("img/flash_down.png", new BMap.Size(16, 16));
                        }
                        else if (josn[0][1].JCINFO[0].SmsJson[i].GIS_Y < josn[0][1].JCINFO[0].SmsJson[i - 1].GIS_Y) {//箭头向上
                            icon = new BMap.Icon("img/flash_up.png", new BMap.Size(16, 16));
                        }
                        else if ((josn[0][1].JCINFO[0].SmsJson[i].GIS_Y == josn[0][1].JCINFO[0].SmsJson[i - 1].GIS_Y) && (josn[0][1].JCINFO[0].SmsJson[i].GIS_X > josn[0][1].JCINFO[0].SmsJson[i - 1].GIS_X)) {//箭头向左
                            icon = new BMap.Icon("img/flash_left.png", new BMap.Size(16, 16));
                        }
                        else {//箭头向右
                            icon = new BMap.Icon("img/flash_right.png", new BMap.Size(16, 16));
                        }

                        //  markers.push(marker);

                    }
                    var makIco1 = icon;
                    if (josn[0][1].JCINFO[0].SmsJson[i].INVALID_TRACK == "1") {

                        icon = new BMap.Icon("img/error.png", new BMap.Size(26, 26));
                    } else if (josn[0][1].JCINFO[0].SmsJson[i].INVALID_TRACK == "0") {

                        icon = new BMap.Icon("img/zq.png", new BMap.Size(26, 26));
                    }
                    marker = new BMap.Marker(Point, { icon: icon });

                    marker.ico1 = makIco1;
                    marker.ico2 = new BMap.Icon("img/error.png", new BMap.Size(26, 26));
                    marker.c3SmsId = josn[0][1].JCINFO[0].SmsJson[i].ID;
                    marker.json = josn[0][1].JCINFO[0].SmsJson[i];
                    map.addOverlay(marker);
                    marker.addEventListener("click", getC3SmsOtherInfo);
                    mathPoint = Point;
                }
            }
            var redline = new BMap.Polyline(Points, { strokeColor: "red", strokeWeight: 3, strokeOpacity: 0.5, strokeStyle: "solid" });
            map.addOverlay(redline);
            //  var markerClusterer = new BMapLib.MarkerClusterer(c3Map, { markers: markers });
            //document.getElementById("loading").style.display = "none";
        }
    }
    var overlays = map.getOverlays();
    for (var i = 0; i < overlays.length; i++) {

        var m = overlays[i];
        if (m.type == "Alarm") {
            m.show();

        }

    }
}


function JSSms(delay) {

    clearInterval(setSmsshow);
    //var showtime = 1; //刷新时间
    setSmsshow = setInterval('SetC3Sms()', delay);

}

//全部轨迹
function QBSms() {

    $('#btn_pause').click();
    EndNumber = _josn[0][2].Dtime.length - 1// _josn[0][1].JCINFO.length - 1;
    smsNumber = EndNumber;
    $("#Sms_slider").slider("option", "values", [smsNumber, EndNumber]);
    $("#_Content1").html("当前时间：" + _josn[0][2].Dtime[EndNumber].Dtime);
    var overlays = map.getOverlays();
    for (var i = 0; i < overlays.length; i++) {

        var m = overlays[i];
        if (m.type == "C3Sms") {
            map.removeOverlay(m);

        }

    }
    deviceid = GetQueryString("deviceid"); //车号

    clearInterval(setSmsshow);
    if (_josn != undefined) {
        if (_josn == null || _josn.length == 0) {
            return;
        }
        if (_josn[0][0].GIS_X != "" && _josn[0][0].GIS_X != "0") {
            var point = new BMap.Point(_josn[0][0].GIS_X, _josn[0][0].GIS_Y);    // 创建点坐标
            cc = 10;

            map.centerAndZoom(point, cc); // 初始化地图，设置中心点坐标和地图级别。

            //添加右键事件

            // var GJC3AlarmJson = getMisC3AlarmPoint(map, deviceid, startdate, enddate, "2");
            map.GJC3AlarmJson = _GJC3AlarmJson;

            map.addEventListener("rightclick", function (e) {
                getC3Mapmenu(e, map, _josn[0][1].JCINFO);
            });
            var Points = new Array(2);
            // var markers = [];
            var mathPoint;
            _XHNumber = 1;
            color = "#00EE00";

            for (var i = 0; i < _josn[0][1].JCINFO.length; i++) {
                for (var j = 0; j < _josn[0][1].JCINFO[i].SmsJson.length; j++) {
                    if (parseFloat(_josn[0][1].JCINFO[i].SmsJson[j].GIS_X) > 180 || parseFloat(_josn[0][1].JCINFO[i].SmsJson[j].GIS_X) < 0 || parseFloat(_josn[0][1].JCINFO[i].SmsJson[j].GIS_Y) > 90 || parseFloat(_josn[0][1].JCINFO[i].SmsJson[j].GIS_Y) < 0) {
                        continue;
                    }
                    var Point = new BMap.Point(_josn[0][1].JCINFO[i].SmsJson[j].GIS_X, _josn[0][1].JCINFO[i].SmsJson[j].GIS_Y);
                    if (j == 0) {
                        _DIRECTION = _josn[0][1].JCINFO[i].SmsJson[0].DIRECTION;
                        Points[0] = Point;
                    } else {
                        var _Point = new BMap.Point(_josn[0][1].JCINFO[i].SmsJson[j - 1].GIS_X, _josn[0][1].JCINFO[i].SmsJson[j - 1].GIS_Y);
                        Points[0] = _Point;
                        Points[1] = Point;
                    }
                    mathPoint = Point;
                    var marker;

                    deviceid = _josn[0][1].JCINFO[i].SmsJson[j].TRAIN_NO;
                    if (j == 0 || j == _josn[0][1].JCINFO[i].SmsJson.length - 1) {
                        if (j == _josn[0][1].JCINFO[i].SmsJson.length - 1) {
                            var lable = _josn[0][1].JCINFO[i].SmsJson[j].TRAIN_NO + "当前位置";
                            var icon = "";
                            if (lable.split('CR').length > 1) {
                                icon = new BMap.Icon(Ico_Loca_DC, new BMap.Size(Ico_Loca_Width, Ico_Loca_Height));
                            } else {
                                icon = new BMap.Icon(Ico_Loca_JC, new BMap.Size(Ico_Loca_Width, Ico_Loca_Height));


                            }

                            var labelMark;
                            //if (SmsPoint == point) {

                            //    labelMark = new BMap.Label(deviceid + "当前位置", { point: Point });
                            //    labelMark.setOffset(new BMap.Size(-30, -50)); //labelMark.setOffset(new BMap.Size(-8, -20));
                            //} else {

                            lable += "<br/>" + _josn[0][1].JCINFO[i].SmsJson[j].WZ;
                            lable += "<br/>" + _josn[0][1].JCINFO[i].SmsJson[j].DETECT_TIME;
                            labelMark = new BMap.Label(lable, { point: Point });
                            labelMark.setOffset(new BMap.Size(-30, -50)); //labelMark.setOffset(new BMap.Size(-8, -60));
                            // }

                            labelMark.setStyle(labelMark_style);
                            SmsPoint = point;
                            marker = new BMap.Marker(Point, { icon: icon });
                            marker.setLabel(labelMark);
                            marker.json = _josn[0][1].JCINFO[i].SmsJson[j];
                            map.addOverlay(marker);
                            marker.addEventListener("click", getC3SmsOtherInfo);
                            //  markers.push(marker);
                        } else {
                            var icon;
                            if (deviceid.split('CR').length > 1) {
                                icon = new BMap.Icon(Ico_Loca_DC, new BMap.Size(Ico_Loca_Width, Ico_Loca_Height));
                            } else {
                                icon = new BMap.Icon(Ico_Loca_JC, new BMap.Size(Ico_Loca_Width, Ico_Loca_Height));


                            }
                            var labelMark = new BMap.Label(deviceid + "起点位置", { point: Point });
                            labelMark.setOffset(new BMap.Size(-30, -50)); //labelMark.setOffset(new BMap.Size(-8, -20));
                            labelMark.setStyle(labelMark_style);
                            marker = new BMap.Marker(Point, { icon: icon });
                            marker.setLabel(labelMark);
                            marker.json = _josn[0][1].JCINFO[i].SmsJson[j];
                            map.addOverlay(marker);
                            marker.addEventListener("click", getC3SmsOtherInfo);
                            //  markers.push(marker);
                        }

                    } else {

                        //if (_josn[0][1].JCINFO[i].DIRECTION == "上行") {
                        //    icon = new BMap.Icon("img/flash_up.png", new BMap.Size(16, 16));
                        //} else if (_josn[0][1].JCINFO[i].DIRECTION == "下行") {
                        //    icon = new BMap.Icon("img/flash_down.png", new BMap.Size(16, 16));
                        //} else {
                        //    if (Math.abs(_josn[0][1].JCINFO[i].GIS_Y - mathPoint.lat) < 0.005 || Math.abs(_josn[0][1].JCINFO[i].GIS_X - mathPoint.lng) < 0.002) {
                        //        //  continue; //两点之间差距太小，不描
                        //    } else {
                        //        var icon;
                        //        if (_josn[0][1].JCINFO[i].GIS_Y > _josn[0][1].JCINFO[i - 1].GIS_Y) {//箭头向下
                        //            icon = new BMap.Icon("img/flash_down.png", new BMap.Size(16, 16));
                        //        }
                        //        else if (_josn[0][1].JCINFO[i].GIS_Y < _josn[0][1].JCINFO[i - 1].GIS_Y) {//箭头向上
                        //            icon = new BMap.Icon("img/flash_up.png", new BMap.Size(16, 16));
                        //        }
                        //        else if ((_josn[0][1].JCINFO[i].GIS_Y == _josn[0][1].JCINFO[i - 1].GIS_Y) && (_josn[0][1].JCINFO[i].GIS_X > _josn[0][1].JCINFO[i - 1].GIS_X)) {//箭头向左
                        //            icon = new BMap.Icon("img/flash_left.png", new BMap.Size(16, 16));
                        //        }
                        //        else {//箭头向右
                        //            icon = new BMap.Icon("img/flash_right.png", new BMap.Size(16, 16));
                        //        }

                        //        //  markers.push(marker);
                        //    }
                        //}


                        icon = new BMap.Icon("/Common/MGIS/img/1.png", new BMap.Size(40, 27));

                        marker = new BMap.Marker(Point, { icon: icon });
                        marker.json = _josn[0][1].JCINFO[i].SmsJson[j];
                        map.addOverlay(marker);
                        marker.addEventListener("click", getC3SmsOtherInfo);
                        mathPoint = Point;

                        if (j == 0) {
                            continue;
                        }
                        var redline = "";


                        if (_josn[0][1].JCINFO[i].SmsJson[j].DIRECTION == "") {
                            _XHNumber = 0;
                        } else if (_josn[0][1].JCINFO[i].SmsJson[j].DIRECTION == "上行") {
                            _XHNumber = 1;
                        } else {
                            _XHNumber = 2;
                        }

                        color = styleColor[_XHNumber].Color; // '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6);


                        redline = new BMap.Polyline(Points, { strokeColor: color, strokeWeight: 5, strokeOpacity: 1, strokeStyle: "solid" });
                        //  redline.setStrokeStyle("dashed");
                        if (GetDateC(_josn[0][1].JCINFO[i].SmsJson[j - 1].DETECT_TIME, _josn[0][1].JCINFO[i].SmsJson[j].DETECT_TIME) > 1 || _josn[0][1].JCINFO[i].SmsJson[j - 1].IsAbnormal == "异常点" || _josn[0][1].JCINFO[i].SmsJson[j].IsAbnormal == "异常点") {
                            var kkkkk = 0;
                            // color = '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6);
                        } else {
                            map.addOverlay(redline);
                        }

                    }
                }
            }


        }
    }
    var overlays = map.getOverlays();
    for (var i = 0; i < overlays.length; i++) {

        var m = overlays[i];
        if (m.type == "Alarm") {
            m.show();

        }

    }
}

var styleColor = [

         {
             "Color": "#00EE00"
         },
         {
             "Color": "#FF8C00"
         },
         {
             "Color": "#A4D3EE"
         }
]

//原始轨迹，修改。
function setC3SmsStatus() {
    fullShow();
    var tb = $('#tb').val();
    var _linecode = $('#lineselect').val();
    var _positioncode = $('#txtqz').val();
    var ju = $('#juselect').val();
    var duan = $('#duanselect').val();
    var deviceid = GetQueryString("deviceid"); //车号
    var startdate = GetQueryString("startdate"); //开始时间
    var enddate = GetQueryString("enddate"); //结束时间
    var jl = GetQueryString("jl"); //交路
    var LINE_CODE = GetQueryString("LINE_CODE"); //线路
    var DIRECTION = GetQueryString("DIRECTION"); //行别
    var point1lng = "";
    var point1lat = "";
    var point2lng = "";
    var point2lat = "";
    if (c3SmsId == "") {
        point1lng = point1.lng;
        point1lat = point1.lat;
        point2lng = point2.lng;
        point2lat = point2.lat;
    }
    var url = "/Common/MGIS/ASHX/Sms/C3ProcessInfo.ashx?ID=" + c3SmsId
        + "&jl=" + jl + "&LINE_CODE=" + LINE_CODE + "&DIRECTION=" + DIRECTION + "&status=" + tb
        + "&type=6&deviceid=" + deviceid + "&startdate=" + startdate + "&enddate=" + enddate
        + "&point1lng=" + point1lng + "&point1lat=" + point1lat
        + "&point2lng=" + point2lng + "&point2lat=" + point2lat
        + "&_linecode=" + _linecode + "&_positioncode=" + _positioncode
        + "&ju=" + ju + "&duan=" + duan;
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
            if (msg.split(',')[0] == "true") {
                //执行成功
                fullHide();
                ymPrompt.succeedInfo('设置成功！', null, null, '提示信息', null);
                $("#btnModal").click();
                if (tb == "-1") {
                } else {
                    window.location.reload();
                }
                clearAll();
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
function clearAll() {
    $("#txtPoint1").val("");
    $("#txtPoint2").val("");
    for (var i = 0; i < overlays.length; i++) {
        map.removeOverlay(overlays[i]);
    }
    overlays.length = 0;
};

//改变滑块时，改变当前帧序号。
function clearB_SmsNumberArray() {
    var SetB_SmsNumberArray = "";
    for (var i = 0; i < _josn[0][1].JCINFO.length; i++) {
        var number = "";
        for (var j = 0; j < _josn[0][1].JCINFO[i].SmsJson.length; j++) {
            if (_josn[0][2].Dtime[silderNumber].Dtime == _josn[0][1].JCINFO[i].SmsJson[j].Dtime) {
                number = j;
            }
        }
        if (number == "") {
            if (SetB_SmsNumberArray == "" && i == 0) {
                SetB_SmsNumberArray = "";
            } else {
                SetB_SmsNumberArray = SetB_SmsNumberArray + ",";
            }
        } else {
            number--;
            if (SetB_SmsNumberArray == "") {
                SetB_SmsNumberArray = number;
            } else {
                SetB_SmsNumberArray = SetB_SmsNumberArray + "," + number;
            }
        }

    }
    B_SmsNumberArray = SetB_SmsNumberArray;
}