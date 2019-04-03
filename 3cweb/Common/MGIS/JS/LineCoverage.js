/*========================================================================================*
* 功能说明：线路覆盖轨迹页面
* 注意事项：
* 作    者：刘亮
* 版本日期：2017年8月11日
* 变更说明：
* 版 本 号：V5.0.2
*=======================================================================================*/

var pageindex = 1;//当前页
var pagesize = 24;//页大小
var sumPage = 0;//总页数
var smsNumber = 0; //动态加载点的第几位
var C3SmsJson; //轨迹JSON
var setSmsshow; //自动刷新
var map; //地图对象
var _josn; //全部轨迹JSON
var animateMarker = null;
var B_SmsNumberArray;

var speed = 400; //初始播放速度
var silderNumber = 0; //记录最后一次拖动的帧号
var EndNumber = 0;
//动态加载
var _XHNumber = 3; //线颜色取值
var opa = 0.5;
var color = "#00EE00"; // "#D8BFD8";

var listStart = '';//开始点时间
var listEnd = '';//结束点时间
var listTimer = null;//改变完成执行列表滚动

var img_change_url = 'img/flash_up_red.png';//改动后图片
var img_url = 'img/flash_up.png';//改动前图片

var styleColor = [

         {
             "Color": "#00EE00"
         },
         {
             "Color": "#FF8C00"
         },
         {
             "Color": "#A4D3EE"
         },
         {
             "Color": "#2A3436"
         }
];

//页面加载是调用
$(document).ready(function () {
  
    try {
        var _h = parseInt($(window).height());
        var _w = parseInt($(window).width());
        $("#orBmapDiv").height(_h).width(_w);

       
        var deviceid = GetQueryString("deviceid"); //车号
        var startdate = GetQueryString("startdate").replace(/\//g, '-'); //开始时间
        var enddate = GetQueryString("enddate").replace(/\//g, '-'); //结束时间

        LineCoverageMapbind(deviceid, startdate, enddate); //加载机车轨迹 
    } catch (e) {
        // alert("地图加载不成功，请检查网络！");

    }

    binHoveAndClick();//绑定事件
   
    //hideListDiv();//隐藏容器
});

//绑定事件
function binHoveAndClick() {
    $('#btn_play').click(function () {
        //播放

        chageSpeed(speed)
        $(this).hide();
        $('#btn_pause').show();
    });

    $('#btn_pause').click(function () {
        //暂停
        clearInterval(setSmsshow); //关闭定时器
        $(this).hide();
        $('#btn_play').show();
    });


    //回播
    $('#_Content_Sta').click(function () {

        map.clearOverlays();
        smsNumber = silderNumber; //当前帧数
        clearB_SmsNumberArray();
        $("#_Content_Sta_Lab").html("" + _josn[0][2].Dtime[smsNumber].Dtime);
        $("#Sms_slider").slider("option", "values", [smsNumber, EndNumber]);
        clearInterval(setSmsshow); //关闭定时器

        $('#btn_play').hide();
        $('#btn_pause').show();

        chageSpeed(speed);
    });

    //改变按钮颜色
    $("#quanbu1").children("img").hover(function () {
        $(this).attr("src", "img/orbit-img/orbit-all-light.png")
    }, function () {
        $(this).attr("src", "img/orbit-img/orbit-all.png")
    });
    $("#btn_slow").children("img").hover(function () {
        $(this).attr("src", "img/orbit-img/orbit-left-light.png")
    }, function () {
        $(this).attr("src", "img/orbit-img/orbit-left.png")
    });
    $("#btn_play").children("img").hover(function () {
        $(this).attr("src", "img/orbit-img/orbit-play-light.png")
    }, function () {
        $(this).attr("src", "img/orbit-img/orbit-play.png")
    });
    $("#btn_pause").children("img").hover(function () {
        $(this).attr("src", "img/orbit-img/orbit-pause-light.png")
    }, function () {
        $(this).attr("src", "img/orbit-img/orbit-pause.png")
    });
    $("#btn_fast").children("img").hover(function () {
        $(this).attr("src", "img/orbit-img/orbit-right-light.png")
    }, function () {
        $(this).attr("src", "img/orbit-img/orbit-right.png")
    });
    $("#_Content_Sta").children("img").hover(function () {
        $(this).attr("src", "img/orbit-img/orbit-repeat-light.png")
    }, function () {
        $(this).attr("src", "img/orbit-img/orbit-repeat.png")
    });
    $(".orbit-close").children("img").hover(function () {
        $(this).attr("src", "img/orbit-img/orbit-close-light.png")
    }, function () {
        $(this).attr("src", "img/orbit-img/orbit-close.png")
    });
    $(".footSure").children("img").hover(function () {
        $(this).attr("src", "img/orbit-img/sure-light.png")
    }, function () {
        $(this).attr("src", "img/orbit-img/sure.png")
    });
    $(".footCancel").children("img").hover(function () {
        $(this).attr("src", "img/orbit-img/calcel-light.png")
    }, function () {
        $(this).attr("src", "img/orbit-img/cancel.png")
    });
    $('.AnimateMarker>a').children("img").hover(function () {
        $(this).attr("src", "img/gis-img/guanbi-light.png")
    }, function () {
        $(this).attr("src", "img/gis-img/guanbi.png")
    });

    $("#backToMin").click(function () {// 收缩函数
        if ($(".cxListTitle").css("display") == "block") {
            $("#boxChaXun").animate({ "height": "95px" });
            $("#backToMin img").attr("src", "/Common/MOnePoleData/img/nextpage.png");
            $("#cxFenYe").hide();
            $(".cxListTitle").hide();
        } else {
            $("#boxChaXun").animate({ "height": "55%" });
            $("#backToMin img").attr("src", "/Common/MOnePoleData/img/prepage.png");
            $("#cxFenYe").show();
            $(".cxListTitle").show();
        }
    })
}

//轨迹数据加载
function LineCoverageMapbind(deviceid, startdate, enddate) {
    BindMap("orBmapDiv", 8);

    LineCoverageInfo(map, deviceid, startdate, enddate);
};

//初始化轨迹地图
function LineCoverageInfo(c3Map, deviceid, startdate, enddate) {
    c3Map.clearOverlays();    //清除地图上所有覆盖物
    map = c3Map;
    getLineCoverageData(deviceid, startdate, enddate);

};

//获取设备轨迹
function getLineCoverageData(deviceid, startdate, enddate) {
    layer.load();
    var url = "/Common/LineCoverage/RemoteHandlers/GetCustomPosition.ashx?type=GetSmsGps&locomotive_code=" + deviceid + "&start_date=" + startdate + "&end_date=" + enddate;
    var json;
    $.ajax({
        type: "POST",
        url: url,
        async: true,
        cache: false,
        success: function (result) {
            layer.closeAll('loading');
            if (result != "") {
                json = result;
            }
            if (json == null || json.length == 0 || json[0][1].JCINFO.length == 0) {
                ymPrompt.errorInfo(deviceid + '； 当前车没有运行数据，请稍后再试。', null, null, '提示信息', null);
                return;
            }
            getC3Sms_LineCoverage(json, deviceid, startdate, enddate);
            loadList(json);
        },
        error: function (textStatus) {
            layer.closeAll('loading');
            ymPrompt.errorInfo(deviceid + '； 当前车没有运行数据，请稍后再试。', null, null, '提示信息', null);
            console.log(textStatus);
        }
    });
    return json;
};

//动态加载机车轨迹
function getC3Sms_LineCoverage(josn, deviceid, startdate, enddate) {
    _josn = josn;
    C3SmsJson = josn[0][1].JCINFO;
    if (josn != undefined) {
        EndNumber = josn[0][2].Dtime.length - 1;
        Setslider(josn[0][2].Dtime.length - 1);  //设置滑块最大值。
        if (josn[0][0].GIS_X != "" && josn[0][0].GIS_X != "0") {
            var point = new BMap.Point(josn[0][0].GIS_X, josn[0][0].GIS_Y);    // 创建点坐标
            map.panTo(point);
            
            $("#_Content_Sta_Lab").html("" + josn[0][2].Dtime[0].Dtime);
            $("#_Content_End").html("结束时间：" + josn[0][2].Dtime[josn[0][2].Dtime.length - 1].Dtime);

            for (var i = 0; i < josn[0][1].JCINFO.length; i++) {

                //josn[0][2] 滑块使用的json, 按分钟数分组。时间+序号。
                //josn[0][1] 各车的状态列表josn.  
                //Dtime，yyyy-mm-dd hh:mi

                if (josn[0][2].Dtime[0].Dtime == josn[0][1].JCINFO[i].SmsJson[0].Dtime) {

                    //初始化各车显示的数组下标。
                    if (i == 0) {
                        B_SmsNumberArray = "0";
                    } else {
                        B_SmsNumberArray = B_SmsNumberArray + ",0";
                    }
                    var Point = new BMap.Point(josn[0][1].JCINFO[i].SmsJson[0].GIS_X, josn[0][1].JCINFO[i].SmsJson[0].GIS_Y);
                    var lable = josn[0][1].JCINFO[i].SmsJson[0].LOCOMOTIVE_CODE; //+ "当前位置"
                    var icon = "";
                    if (lable.split('CR').length > 1) {
                        icon = new BMap.Icon(Ico_Loca_DC, new BMap.Size(Ico_Loca_Width, Ico_Loca_Height));
                    } else {
                        icon = new BMap.Icon(Ico_Loca_JC, new BMap.Size(Ico_Loca_Width, Ico_Loca_Height));

                    }
                    var labelMark;

                    //车头上的信息。

                    lable += "<br /> " + josn[0][1].JCINFO[i].SmsJson[0].WZ;
                    lable += "<br/>" + josn[0][1].JCINFO[i].SmsJson[0].DETECT_TIME;
                    labelMark = new BMap.Label(lable, { point: Point });
                    labelMark.setOffset(new BMap.Size(-30, -50));
                    labelMark.type = "LableSms";
                    labelMark.setStyle(labelMark_style);
                    marker = new BMap.Marker(Point, { icon: icon });
                    marker.setLabel(labelMark);
                    marker.json = josn[0][1].JCINFO[i].SmsJson[0];
                    marker.setZIndex(10);
                    smsNumber = 1;
                    marker.type = "C3Sms";
                    marker.number = josn[0][1].JCINFO[i].SmsJson[0].LOCOMOTIVE_CODE + 0;
                    map.addOverlay(marker);
                    DIRECTION = josn[0][1].JCINFO[i].DIRECTION;
                    marker.addEventListener("click", getLineCoverageInfo);

                    //以上是初始化车。

                } else {
                    if (i == 0) {
                        B_SmsNumberArray = "";
                    } else {
                        B_SmsNumberArray = B_SmsNumberArray + ",";
                    }
                }
            }

            chageSpeed( speed);
        }
    } else {
        Setslider(0);
    }
    return josn;
};


//开始播放 
function chageSpeed( delay) {
    //checkDom = e;
    speed = delay;
    //$("#1X,#2X,#4X,#8X").css("color", "White");
    //$(e).css("color", "rgb(255, 235, 77)");
    $('#btn_play').hide();
    $('#btn_pause').show();
    JSSms(delay);
}

//重载页面
function reload() {
    window.location.reload();
}

//加速
function chageSpeed_fast() {
    //speed 400  加速
    var _speed = speed / 2;
    var _sp = 400 / _speed;

    if (_sp > 32) {
        _sp = 32;
        _speed = 400 / 32;
    }

    speed = _speed;

    if (_sp == "1")
    { _sp = "正常"; }
    else {
        _sp = _sp + "倍";
    }

    $('#speendMemo').html(_sp);

    $('#btn_play').hide();
    $('#btn_pause').show();

    JSSms(speed);



}
//减速
function chageSpeed_slow() {
    //speed 400  减速
    var _speed = speed * 2;

    var _sp = 400 / _speed;

    if (_sp < 1) {
        _sp = 1;
        _speed = 400;
    }

    speed = _speed;

    if (_sp == "1")
    { _sp = "正常"; }
    else {
        _sp = _sp + "倍";
    }

    $('#speendMemo').html(_sp);

    $('#btn_play').hide();
    $('#btn_pause').show();

    JSSms(speed);
}
//进度条事件
function Setslider(count) {


    $("#Sms_slider").slider({
        range: true,
        min: 0,
        max: count,
        values: [0, count],
        slide: function (event, ui) {
            //  $("#FrameN").html("$" + ui.value);
            if (event.keyCode == undefined)  //按钮不执行。
            {
                $("#Sms_slider").slider("option", "values", [ui.values[0], ui.values[1]]);
                map.clearOverlays();
                EndNumber = ui.values[1];
                //getMisC3AlaemPointAsync(map, _GJC3AlarmJson, "", "", "", 2, ""); //重新加载一次告警(不用查询)
                smsNumber = ui.values[0]; //当前帧数
                if (ui.value == ui.values[0]) {
                    silderNumber = ui.values[0]; //回放时用
                }
                clearB_SmsNumberArray();
                clearInterval(setSmsshow); //关闭定时器
                $('#btn_play').show();
                $('#btn_pause').hide();
                $("#_Content_Sta_Lab").html("" + _josn[0][2].Dtime[silderNumber].Dtime);
                $("#_Content_End").html("结束时间:" + _josn[0][2].Dtime[EndNumber].Dtime);
                var startdate = _josn[0][2].Dtime[silderNumber].Dtime.replace(/\//g, '-'); //开始时间
                var enddate = _josn[0][2].Dtime[EndNumber].Dtime.replace(/\//g, '-'); //结束时间
                SetC3Sms();

                //设置当前时间div位置

                var p = parseInt($("#Sms_slider .ui-slider-handle").css("left"));
                $(".playTime").css("left", -96 + p + 'px');
            }

        },
        change: function (event, ui) {
            var p = parseInt($("#Sms_slider .ui-slider-handle").css("left"));
            $(".playTime").css("left", -96 + p + 'px');
        }
    });
}


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
                        if (m.type == "C3Sms" && m.number == _josn[0][1].JCINFO[i].SmsJson[numbers[i]].LOCOMOTIVE_CODE + numbers[i]) {
                            try {
                                if (_josn[0][1].JCINFO[i].SmsJson[numbers[i]].change == 'true') {
                                    var Icon = new BMap.Icon(img_change_url, new BMap.Size(16, 16));
                                } else {
                                    var Icon = new BMap.Icon(img_url, new BMap.Size(16, 16));
                                }
                            } catch (e) {
                                var Icon = new BMap.Icon(img_url, new BMap.Size(16, 16));
                            }

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

                var lable = _josn[0][1].JCINFO[i].SmsJson[number].LOCOMOTIVE_CODE; //+ "当前位置"
                var icon = "";
                if (lable.split('CR').length > 1) {
                    icon = new BMap.Icon(Ico_Loca_DC, new BMap.Size(Ico_Loca_Width, Ico_Loca_Height));
                } else {
                    icon = new BMap.Icon(Ico_Loca_JC, new BMap.Size(Ico_Loca_Width, Ico_Loca_Height));


                }
                var labelMark;
                lable += "<br /> " + _josn[0][1].JCINFO[i].SmsJson[number].WZ;

                lable += "<br/>" + _josn[0][1].JCINFO[i].SmsJson[number].DETECT_TIME;
                labelMark = new BMap.Label(lable, { point: Point });
                labelMark.setOffset(new BMap.Size(-30, -50));
                labelMark.type = "LableSms";
                labelMark.setStyle(labelMark_style);
                marker = new BMap.Marker(Point, { icon: icon });
                marker.setLabel(labelMark);
                marker.json = _josn[0][1].JCINFO[i].SmsJson[number];
                marker.setZIndex(4);
                marker.type = "C3Sms";
                marker.number = _josn[0][1].JCINFO[i].SmsJson[number].LOCOMOTIVE_CODE + number;
                smsNumber == 1 ? map.centerAndZoom(Point, 10) : '';
                map.addOverlay(marker);
                marker.addEventListener("click", getLineCoverageInfo);
                var redline = "";

                if (smsNumber != 0 && number != 0) {

                    color = styleColor[_XHNumber].Color;

                    redline = new BMap.Polyline(Points, { strokeColor: color, strokeWeight: 5, strokeOpacity: 1, strokeStyle: "solid" });

                    //连线。

                    map.addOverlay(redline);
                }
                for (var n = 0; n < overlays.length; n++) {

                    var m = overlays[n];

                }
                if (smsNumber == EndNumber) {
                    $('#btn_play').show();
                    $('#btn_pause').hide();
                    clearInterval(setSmsshow);
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
};

//重置速度播放接下来的数据    delay为间隔
function JSSms(delay) {

    clearInterval(setSmsshow);
    setSmsshow = setInterval('SetC3Sms()', delay);

};

//全部轨迹
function QBSms() {

    $('#btn_pause').click();
    EndNumber = _josn[0][2].Dtime.length - 1;
    smsNumber = EndNumber;
    $("#Sms_slider").slider("option", "values", [smsNumber, EndNumber]);
    $("#_Content1").html("当前时间：" + _josn[0][2].Dtime[EndNumber].Dtime);
    //var overlays = map.getOverlays();
    //for (var i = 0; i < overlays.length; i++) {

    //    var m = overlays[i];
    //    if (m.type == "C3Sms") {
    //        map.removeOverlay(m);
    //    }
    //}
    map.clearOverlays();
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

            var Points = new Array(2);
            var mathPoint;

            for (var i = 0; i < _josn[0][1].JCINFO.length; i++) {
                for (var j = 0; j < _josn[0][1].JCINFO[i].SmsJson.length; j++) {
                    if (parseFloat(_josn[0][1].JCINFO[i].SmsJson[j].GIS_X) > 180 || parseFloat(_josn[0][1].JCINFO[i].SmsJson[j].GIS_X) < 0 || parseFloat(_josn[0][1].JCINFO[i].SmsJson[j].GIS_Y) > 90 || parseFloat(_josn[0][1].JCINFO[i].SmsJson[j].GIS_Y) < 0) {
                        continue;
                    }
                    var Point = new BMap.Point(_josn[0][1].JCINFO[i].SmsJson[j].GIS_X, _josn[0][1].JCINFO[i].SmsJson[j].GIS_Y);
                    if (j == 0) {
                        Points[0] = Point;
                    } else {
                        var _Point = new BMap.Point(_josn[0][1].JCINFO[i].SmsJson[j - 1].GIS_X, _josn[0][1].JCINFO[i].SmsJson[j - 1].GIS_Y);
                        Points[0] = _Point;
                        Points[1] = Point;
                    }
                    mathPoint = Point;
                    var marker;

                    deviceid = _josn[0][1].JCINFO[i].SmsJson[j].LOCOMOTIVE_CODE;
                    if (j == 0 || j == _josn[0][1].JCINFO[i].SmsJson.length - 1) {
                        if (j == _josn[0][1].JCINFO[i].SmsJson.length - 1) {
                            var lable = _josn[0][1].JCINFO[i].SmsJson[j].LOCOMOTIVE_CODE + "当前位置";
                            var icon = "";
                            if (lable.split('CR').length > 1) {
                                icon = new BMap.Icon(Ico_Loca_DC, new BMap.Size(Ico_Loca_Width, Ico_Loca_Height));
                            } else {
                                icon = new BMap.Icon(Ico_Loca_JC, new BMap.Size(Ico_Loca_Width, Ico_Loca_Height));
                            }

                            var labelMark;

                            lable += "<br/>" + _josn[0][1].JCINFO[i].SmsJson[j].WZ;
                            lable += "<br/>" + _josn[0][1].JCINFO[i].SmsJson[j].DETECT_TIME;
                            labelMark = new BMap.Label(lable, { point: Point });
                            labelMark.setOffset(new BMap.Size(-30, -50)); 
                            labelMark.setStyle(labelMark_style);
                            SmsPoint = point;
                            marker = new BMap.Marker(Point, { icon: icon });
                            marker.setLabel(labelMark);
                            marker.json = _josn[0][1].JCINFO[i].SmsJson[j];
                            map.addOverlay(marker);
                            marker.addEventListener("click", getLineCoverageInfo);
                        } else {
                            var icon;
                            if (deviceid.split('CR').length > 1) {
                                icon = new BMap.Icon(Ico_Loca_DC, new BMap.Size(Ico_Loca_Width, Ico_Loca_Height));
                            } else {
                                icon = new BMap.Icon(Ico_Loca_JC, new BMap.Size(Ico_Loca_Width, Ico_Loca_Height));
                            }
                            var labelMark = new BMap.Label(deviceid + "起点位置", { point: Point });
                            labelMark.setOffset(new BMap.Size(-30, -50));
                            labelMark.setStyle(labelMark_style);
                            marker = new BMap.Marker(Point, { icon: icon });
                            marker.setLabel(labelMark);
                            marker.json = _josn[0][1].JCINFO[i].SmsJson[j];
                            map.addOverlay(marker);
                            marker.addEventListener("click", getLineCoverageInfo);
                        }
                    } else {

                        try {
                            if (_josn[0][1].JCINFO[i].SmsJson[j].change == 'true') {
                                icon = new BMap.Icon(img_change_url, new BMap.Size(16, 16));
                            } else {
                                icon = new BMap.Icon(img_url, new BMap.Size(16, 16));
                            }
                        } catch (e) {
                            icon = new BMap.Icon(img_url, new BMap.Size(16, 16));
                        }

                        marker = new BMap.Marker(Point, { icon: icon });
                        marker.json = _josn[0][1].JCINFO[i].SmsJson[j];
                        map.addOverlay(marker);
                        marker.addEventListener("click", getLineCoverageInfo);
                        mathPoint = Point;

                        if (j == 0) {
                            continue;
                        }
                        var redline = "";

                        color = styleColor[_XHNumber].Color;
                        redline = new BMap.Polyline(Points, { strokeColor: color, strokeWeight: 5, strokeOpacity: 1, strokeStyle: "solid" });
                        map.addOverlay(redline);
                    }
                }
            }
        }
    }
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
};

//查看点信息
function getLineCoverageInfo(e) {
    var html = GetLineCoverageHtml(this.json);
    var p = new BMap.Point(e.point.lng, e.point.lat);
    findListHover(this.json.ID);

    openInforWindow(html, p, this.json)
    
    //if (animateMarker == null) {
    //    animateMarker = new AnimateMarker(p, html);
    //    animateMarker.type = "animateMarker";
    //    map.addOverlay(animateMarker);
    //}
    //else {
    //    animateMarker.setPointAndText(p, html);
    //}
};

//删除自定义样式弹出框
function ClearAnimateMarker() {
    map.removeOverlay(animateMarker);
    animateMarker = null;
};
//删除iforwindow
function CloseInfoWindow() {
    map.closeInfoWindow();
    $('.myselectBox').hide();
    layer.closeAll();
};

//隐藏列表div
function hideListDiv() {
    $(".cxListTitle").hide();
    $("#boxChaXun").css({ "height": "95px" });
    $("#backToMin img").attr("src", "/Common/MOnePoleData/img/nextpage.png");
    $("#cxFenYe").hide();
    $(".cxListTitle").hide();
};


//列表点击事件
function setPoleClick(_ID,dom) {
    if (smsNumber < EndNumber) {
        QBSms();
        var overlays = map.getOverlays();
        for (var i = 0; i < overlays.length; i++) {
            if (overlays[i].json) {
                if (overlays[i].json.ID == _ID) {
                    var a = new BMap.Point(overlays[i].point.lng, overlays[i].point.lat);
                    map.setCenter(a)
                    break;
                }
            }
        }
    }
    var overlays = map.getOverlays();
    for (var i = 0; i < overlays.length; i++) {
        if (overlays[i].json) {
            if (overlays[i].json.ID == _ID) {
                var changed={
                    BUREAU_NAME:dom.find('.ju').html(),
                    ORG_NAME:dom.find('.duan').html(),
                    LINE_NAME:dom.find('.line').html(),
                    DIRECTION:dom.find('.xingbie').html(),
                    POSITION_NAME:dom.find('.qujian').html(),
                }
                

                var html = GetLineCoverageHtml(overlays[i].json, changed);
                var p = new BMap.Point(overlays[i].point.lng, overlays[i].point.lat);
                openInforWindow(html, p, overlays[i].json)
                return false; 
            }
        }
    }
};

//打开 inforwindow   传入HTML 与点p
function openInforWindow(html, p,json){
    var InfoWindow = new BMap.InfoWindow(html);
    InfoWindow.addEventListener('open', function (e) {
        
        try {
            $('#ULLineC_line').parent().remove();
            $('#ULLineC_direction').parent().remove();
        } catch (e) { }
        $('#LineC_direction').mySelectTree({
            tag: 'Get_Drection',
            height: 150,
            enableContent: true,
            enableFilter: false,
            onClick: function (event, treeId, treeNode) {
                $('#LineC_direction').val(treeNode.name).attr({ "code": treeNode.id });
            },
            callback: function () {
                $('.BMap_bubble_content').click(function (e) {
                    if ($(e.target).attr("id") != 'LineC_direction') {
                        $('body').find('#ULLineC_direction').parent().hide();
                    }
                })
            }
        });
        $('#LineC_ju').mySelectTree({
            tag: 'ORGANIZATION_J',
            enableContent: true,
            height: 150,
            onClick: function (event, treeId, treeNode) {
                if (treeNode.id != 'TOPBOSS') {//不是总公司才绑插件
                    $('#LineC_ju').val(treeNode.name).attr({ "code": treeNode.id });
                    $("#ULLineC_ju").parent().hide();
                    //段联动 重绑插件与input
                    $('#ULLineC_duan').parent().remove();
                    $('#LineC_duan').val('');
                    $('#LineC_duan').mySelectTree({
                        tag: 'ORGANIZATION_JUNIORBUREAU',
                        action: 'YuanDong',
                        codeType: treeNode.id,
                        enableContent: true,
                        height: 150,
                        onClick: function (event, treeId, treeNode) {
                            var treeObj = $.fn.zTree.getZTreeObj(treeId);
                            $('#LineC_duan').val(treeNode.name).attr({ "code": treeNode.id });
                            $('#ULLineC_duan').parent().hide();
                        },
                        callback: function () {
                            $('.BMap_bubble_content').click(function (e) {
                                if ($(e.target).attr("id") != 'LineC_duan') {
                                    $('body').find('#ULLineC_duan').parent().hide();
                                }
                            })
                        }
                    });
                    //线联动 重绑插件与input
                    $('#ULLineC_line').parent().remove();
                    $('#LineC_line').val('');
                    $('#LineC_line').mySelectTree({
                        tag: 'LINE',
                        codeType: treeNode.id,
                        enableContent: true,
                        filterNumber: 2,
                        height: 150,
                        onClick: function (event, treeId, treeNode) {
                            var treeObj = $.fn.zTree.getZTreeObj(treeId);
                            treeObj.checkAllNodes(false);
                            $('#LineC_position').attr({ "value": "", "code": "" });
                            $('#LineC_line').val(treeNode.name).attr({ "code": treeNode.id, "treetype": treeNode.treeType });


                            $("#ULLineC_line").parent().hide();
                            $('#ULLineC_position').parent().remove();
                            $('#LineC_position').mySelectTree({
                                tag: 'LINE_FILTER',
                                is_only_section: 'true',
                                codeType: treeNode.id,
                                enableContent: true,
                                height: 150,
                                onClick: function (event, treeId, treeNode) {
                                    var treeObj = $.fn.zTree.getZTreeObj(treeId);
                                    $('#LineC_position').val(treeNode.name).attr({ "code": treeNode.id });
                                    $('#ULLineC_position').parent().hide();
                                },
                                callback: function () {
                                    $('.BMap_bubble_content').click(function (e) {
                                        if ($(e.target).attr("id") != 'LineC_position') {
                                            $('body').find('#ULLineC_position').parent().hide();
                                        }
                                    })
                                }
                            });

                        },
                        callback: function () {
                            $('.BMap_bubble_content').click(function (e) {
                                if ($(e.target).attr("id") != 'LineC_line') {
                                    $('body').find('#ULLineC_line').parent().hide();
                                }
                            })
                        }
                    });
                    //区站去除
                    $('#LineC_position').val('');
                    $('#ULLineC_position').parent().remove();
                } else {
                    layer.tips('不能设置为总公司！', '#LineC_ju', { tips: [1, 'pink'], tipsMore: true, time: 800 });
                }

            },
            callback: function () {
                $('.BMap_bubble_content').click(function (e) {
                    if ($(e.target).attr("id") != 'LineC_ju') {
                        $('body').find('#ULLineC_ju').parent().hide();
                    }
                })
            }
        })
        
        //默认加载对应线路
        if (json.BUREAU_CODE != '') {
            $('#ULLineC_line').parent().remove();
            $('#LineC_line').mySelectTree({
                tag: 'LINE',
                codeType: json.BUREAU_CODE,
                enableContent: true,
                filterNumber: 2,
                height: 150,
                onClick: function (event, treeId, treeNode) {
                    var treeObj = $.fn.zTree.getZTreeObj(treeId);
                    treeObj.checkAllNodes(false);
                    $('#LineC_position').attr({ "value": "", "code": "" });
                    $('#LineC_line').val(treeNode.name).attr({ "code": treeNode.id, "treetype": treeNode.treeType });


                    $("#ULLineC_line").parent().hide();
                    $('#ULLineC_position').parent().remove();
                    $('#LineC_position').mySelectTree({
                        tag: 'LINE_FILTER',
                        is_only_section: 'true',
                        codeType: treeNode.id,
                        enableContent: true,
                        height: 150,
                        onClick: function (event, treeId, treeNode) {
                            var treeObj = $.fn.zTree.getZTreeObj(treeId);
                            $('#LineC_position').val(treeNode.name).attr({ "code": treeNode.id });
                            $('#ULLineC_position').parent().hide();
                        },
                        callback: function () {
                            $('.BMap_bubble_content').click(function (e) {
                                if ($(e.target).attr("id") != 'LineC_position') {
                                    $('body').find('#ULLineC_position').parent().hide();
                                }
                            })
                        }
                    });

                },
                callback: function () {
                    $('.BMap_bubble_content').click(function (e) {
                        if ($(e.target).attr("id") != 'LineC_line') {
                            $('body').find('#ULLineC_line').parent().hide();
                        }
                    })
                }
            });
        }


        //默认加载对应区站
        if (json.LINE_CODE != '') {
            $('#ULLineC_position').parent().remove();
            $('#LineC_position').mySelectTree({
                tag: 'LINE_FILTER',
                is_only_section: 'true',
                codeType: json.LINE_CODE,
                enableContent: true,
                height: 150,
                onClick: function (event, treeId, treeNode) {
                    var treeObj = $.fn.zTree.getZTreeObj(treeId);
                    $('#LineC_position').val(treeNode.name).attr({
                        "code": treeNode.id
                    });
                    $('#ULLineC_position').parent().hide();
                },
                callback: function () {
                    $('.BMap_bubble_content').click(function (e) {
                        if ($(e.target).attr("id") != 'LineC_position') {
                            $('body').find('#ULLineC_position').parent().hide();
                        }
                    })
                }
            });
         }
        //默认加载对应供电段
        if (json.BUREAU_CODE != '') {
            $('#ULLineC_duan').parent().remove();
            $('#LineC_duan').mySelectTree({
                tag: 'ORGANIZATION_JUNIORBUREAU',
                action: 'YuanDong',
                codeType: json.BUREAU_CODE,
                enableContent: true,
                height: 150,
                onClick: function (event, treeId, treeNode) {
                    var treeObj = $.fn.zTree.getZTreeObj(treeId);
                    $('#LineC_duan').val(treeNode.name).attr({ "code": treeNode.id });
                    $('#ULLineC_duan').parent().hide();
                },
                callback: function () {
                    $('.BMap_bubble_content').click(function (e) {
                        if ($(e.target).attr("id") != 'LineC_duan') {
                            $('body').find('#ULLineC_duan').parent().hide();
                        }
                    })
                }
            });
        }

        chooseBtn();//判断窗口btn
    });
    InfoWindow.disableCloseOnClick();//点击地图不关闭window
    
    map.openInfoWindow(InfoWindow, p);
   
}

//判空 判断
function dojudge(more) {
    if ($('#LineC_ju').val() == '') {
        layer.tips('<font style="color: black;">不能为空！</font>', '#LineC_ju', { tips: [1, 'pink'], tipsMore: true, time: 800 });
        return false;
    } else if ($('#LineC_duan').val() == '') {
        layer.tips('<font style="color: black;">不能为空！</font>', '#LineC_duan', { tips: [1, 'pink'], tipsMore: true, time: 800 });
        return false;
    } else if ($('#LineC_line').val() == '') {
        layer.tips('<font style="color: black;">不能为空！</font>', '#LineC_line', { tips: [1, 'pink'], tipsMore: true, time: 800 });
        return false;
    } else if ($('#LineC_direction').val() == '') {
        layer.tips('<font style="color: black;">不能为空！</font>', '#LineC_direction', { tips: [1, 'pink'], tipsMore: true, time: 800 });
        return false;
    } else if ($('#LineC_position').val() == '') {
        layer.tips('<font style="color: black;">不能为空！</font>', '#LineC_position', { tips: [1, 'pink'], tipsMore: true, time: 800 });
        return false;
    }

    if ($('#LineC_ju').val() != $('#LineC_ju').attr('lastvalue')) {
        $('#chooseChange').attr('change', '2')//改变状态
    }

    if ($('#LineC_duan').val() != $('#LineC_duan').attr('lastvalue')) {
        $('#chooseChange').attr('change', '2')//改变状态
    }

    if ($('#LineC_line').val() != $('#LineC_line').attr('lastvalue')) {
        $('#chooseChange').attr('change', '2')//改变状态
    }

    if ($('#LineC_direction').val() != $('#LineC_direction').attr('lastvalue')) {
        $('#chooseChange').attr('change', '2')//改变状态
    }

    if ($('#LineC_position').val() != $('#LineC_position').attr('lastvalue')) {
        $('#chooseChange').attr('change', '2')//改变状态
    }
    if (more == 'more') {
        return true;
    }else if ($('#chooseChange').attr('change') == '1') {
        layer.tips('<font style="color: black;">并无修改不用保存！</font>', '#chooseChange', { tips: [1, 'pink'], tipsMore: true, time: 800 });
        return false;
    }
    return true;
}

//保存 按钮 点击改变列表
function changeList(id) {
    if (dojudge()) {
        $('#boxCXresult .cxListBodyBox').find('.cxListBody').each(function(e){
            if ($(this).attr('id') == id) {
                changePublicJosn(id);//改变图标判断值
                changeListPublicDom($(this), false, Math.floor(Math.random() * 10000000000))
                var x = $(this)[0].offsetTop;
                $(".cxListBodyBox").animate({ scrollTop: (x - 250) }, 300);
                layer.msg('已保存至左侧列表！')
                return false;
            }
        })
    }
}

//列表请求
function loadList(re) {
    console.log(re[0][1].JCINFO[0].SmsJson[0])
    var jsonArry = re[0][1].JCINFO[0].SmsJson;
    var _html = '';
    $('#boxTitle').html(jsonArry[0].LOCOMOTIVE_CODE + '&nbsp;共' + jsonArry.length + '条数据')
    //return;
    for (var i = 0; i < jsonArry.length; i++) {
        
        var wz = jsonArry[i].WZ.split('&nbsp;')
       
        _html += '<div class="cxListBody" locomotive_code="' + jsonArry[i].LOCOMOTIVE_CODE + '" id="' + jsonArry[i].ID + '"><span class="width_1">' + (jsonArry[i].DETECT_TIME== '' ? '&nbsp;' : jsonArry[i].DETECT_TIME) + '</span><span class="width_2 ju" name="' + jsonArry[i].BUREAU_NAME + '">' + (jsonArry[i].BUREAU_NAME == '' ? '&nbsp;' : jsonArry[i].BUREAU_NAME)+ '</span><span class="width_2 xlqjName duan" name="' + jsonArry[i].ORG_NAME + '">' + (jsonArry[i].ORG_NAME == '' ? '&nbsp;' : jsonArry[i].ORG_NAME) + '</span><span class="width_2 line" name="' + jsonArry[i].LINE_NAME + '">' + (jsonArry[i].LINE_NAME == '' ? '&nbsp;' : jsonArry[i].LINE_NAME) + '</span><span class="width_2 xingbie" name="' + jsonArry[i].DIRECTION + '">' + (jsonArry[i].DIRECTION == '' ? '&nbsp;' : jsonArry[i].DIRECTION) + '</span><span class="width_2 xlqjName qujian" name="' + jsonArry[i].POSITION_NAME + '">' + jsonArry[i].POSITION_NAME + '</span></div>';
    }
  
    $(".cxListBodyBox").html(_html);

    $(".cxListBody").click(function () {
        var _ID = $(this).attr("id");
        $('.chooseList').removeClass('chooseList');
        $(this).addClass('chooseList');
        setPoleClick(_ID, $(this));
    });
    listHovebind();
}

//list 单列鼠标事件
function listHovebind() {
    $('.width_2').hover(function () {
        var that = this;
        try {
            if ($(this).attr("name").length > 3) {
                layer.tips($(this).attr("name"), that, {
                    tips: [1, '#3595CC'],
                    time: 1000000
                });
            }
        } catch (e) { }

    }, function () {
        layer.closeAll();
    })
}

//取消开始点设置
function cancelStart() {
    listStart = '';
    $('#setBegin').val('设置为开始点');
    $('#cancelStart').hide();
    $('#lineCoverage_sure').show();
}

//设置开始点 结束点
function changeListNotone(time) {
    if (listStart != '' && listEnd == '') {
        if (dojudge('more')) {
            listEnd = time;
            setListmore()
        }
    } else{
        listStart = time;
        chooseBtn()
        //layer.tips('设置开始点成功！关闭弹框去设置结束点以及位置信息', '#setBegin', { tips: [1, 'green'], tipsMore: true, time: 3000 });
    }
}

//按钮判断  打开infor窗口判断
function chooseBtn() {
    if (listStart != ''&& listEnd=='') {
        $('#cancelStart').show();
        $('#lineCoverage_sure').hide();
        $('#setBegin').val('设置为结束点并保存')
    }
    if (listStart == '' && listEnd == '') {
        $('#setBegin').val('设置为开始点');
        $('#cancelStart').hide();
        $('#lineCoverage_sure').show();
    }
}

//批量设置列表
function setListmore() {
    var len = $(".cxListBodyBox").find('.cxListBody').length;
    var sign= Math.floor(Math.random() * 10000000000);
    $(".cxListBodyBox").find('.cxListBody').each(function (i,dom) {
        var that = $(this);
        var listTime = $(this).find('.width_1').html();//时间
        if (compareTime(listTime, listEnd) && compareTime(listStart, listTime) || compareTime(listTime, listStart) && compareTime(listEnd, listTime)) {
            changePublicJosn(that.attr('id'));//改变图标判断值
            changeListPublicDom(that, true, sign);
            if (listTimer) { clearTimeout(listTimer) };
            listTimer = setTimeout(function () {
                var x = that[0].offsetTop;
                $(".cxListBodyBox").animate({ scrollTop: (x - 250) }, 300);
            }, 300);
            return true;//跳出本次 == continue
        }
        if (i === len - 1) {//
            listStart = '';
            listEnd = '';
            chooseBtn()
            layer.msg('已保存至左侧列表！')
        }
        
    })
}

//公用保存至列表  dom 为  $(this)dom对象   notone 为批量标记颜色不一样
function changeListPublicDom(dom, notone,sign) {
    if (notone) {
        dom.addClass('changeListNotone');
    } else {
        dom.addClass('changeList');
    }
    var _time = dom.find('.width_1').html();
    //html 改变     
    dom.html('<span class="width_1">' + _time + '</span><span class="width_2 ju" name="' + $('#LineC_ju').val() + '">' + $('#LineC_ju').val() + '</span><span class="width_2 duan" name="' + $('#LineC_duan').val() + '">' + $('#LineC_duan').val() + '</span><span class="width_2 line" name="' + $('#LineC_line').val() + '">' + $('#LineC_line').val() + '</span><span class="width_2 xingbie" name="' + $('#LineC_direction').val() + '">' + $('#LineC_direction').val() + '</span><span class="width_2 qujian" name="' + $('#LineC_position').val() + '">' + $('#LineC_position').val() + '</span>').attr('sign', sign)
    listHovebind();
    
}


//判断日期，时间大小  
function compareTime(startDate, endDate) {
    if (startDate!='' && endDate!='') {
        var startDateTemp = startDate.split(" ");
        var endDateTemp = endDate.split(" ");

        var arrStartDate = startDateTemp[0].split("/");
        var arrEndDate = endDateTemp[0].split("/");

        var arrStartTime = startDateTemp[1].split(":");
        var arrEndTime = endDateTemp[1].split(":");

        var allStartDate = new Date(arrStartDate[0], arrStartDate[1], arrStartDate[2], arrStartTime[0], arrStartTime[1], arrStartTime[2]);
        var allEndDate = new Date(arrEndDate[0], arrEndDate[1], arrEndDate[2], arrEndTime[0], arrEndTime[1], arrEndTime[2]);

        if (allStartDate.getTime() > allEndDate.getTime()) {
            //console.log("startTime不能大于endTime，不能通过");
            return false;
        } else {
            //console.log("startTime小于endTime，所以通过了");
            return true;
        }
    } else {
        //console.log("时间不能为空,所以通过了");
        return true;
    }
}

//保存
function savelist(type) {
    var list = '';
    var valChange = false;
    $('.cxListBodyBox .cxListBody').each(function(i){
        var that=$(this);
        if (that.attr('sign') != '' && that.attr('sign') != undefined) {
            list += 'time:' + that.find('.width_1').html()+','
                + 'ID:' + that.attr('id') + ','
                + 'LOCOMOTIVE_CODE:' +that.attr('locomotive_code') + ','
                + 'BUREAU_NAME:' + that.find('.ju').html() + ','
                + 'ORG_NAME:' + that.find('.duan').html() + ','
                + 'LINE_NAME:' + that.find('.line').html() + ','
                + 'DIRECTION:' + that.find('.xingbie').html() + ','
                + 'POSITION_NAME:' + that.find('.qujian').html() + ','
                + 'sign:' + that.attr('sign') + ';'
            valChange = true;
        
        }
    
    })
    //console.log(list)
//如果没有任何修改  不提交
    if (!valChange) {
        layer.msg('请修改后再提交！');
        return;
    }
    //return
    var data = {
        list:list
    }
    var _url = '';
    if (type=='add') {
        _url = '/Common/LineCoverage/RemoteHandlers/GetCustomPosition.ashx?type=setCustom&status=UPDATE'
    } else {
        _url = '/Common/LineCoverage/RemoteHandlers/GetCustomPosition.ashx?type=setCustom&status=ADD'
    }

    $.ajax({
        type: "POST",
        url: _url,
        data:data,
        async: true,
        cache: false,
        success: function (re) {
            try {
                if (re != '' && re != undefined && re.result != '') {
                    layer.alert(re.result, { icon: 6 }, function (index) {
                        layer.close(index);
                        //如果成功关闭页面
                        if (re.sign == 'True') {
                            window.close();
                        }
                    })
                } else {
                    layer.alert('出错了！', { icon: 6 }, function (index) {
                        layer.close(index);
                    })
                }
            } catch (e) {
                layer.alert('出错了！', { icon: 6 }, function (index) {
                    layer.close(index);
                })
            }
        },
        error: function (textStatus) {
            layer.msg('出错了！')
        }
    });
}

//改变原json属性值     用以判断图标重加载时 图片选用哪一张
function changePublicJosn(id) {
    for (var i = 0; i < _josn[0][1].JCINFO[0].SmsJson.length; i++) {
        if (_josn[0][1].JCINFO[0].SmsJson[i].ID == id) {
            _josn[0][1].JCINFO[0].SmsJson[i]['change'] = 'true';
            break;
        }
    }
    var overlays = map.getOverlays();
    for (var j = 0; j < overlays.length; j++) {//保存时 立即改变图标
        var m = overlays[j];
        try {
            if (m.json.ID == id) {
                var Icon = new BMap.Icon(img_change_url, new BMap.Size(16, 16));
                m.setIcon(Icon);
                break;
            }
        } catch (e) {
            continue;
        }
    }

}

//地图点点击 列表联动
function findListHover(id) {
    $('#boxCXresult .cxListBodyBox').find('.cxListBody').each(function (e) {
        if ($(this).attr('id') == id) {
            $('.chooseList').removeClass('chooseList');
            $(this).addClass('chooseList');
            var x = $(this)[0].offsetTop;
            $(".cxListBodyBox").animate({ scrollTop: (x - 250) }, 300);
            return false;
        }
    })

}

//还原修改
function resetList() {
    var layerIndex = layer.confirm('您确定要还原吗？', {
        title: false, closeBtn: 0,
        btn: ['确定', '取消'] //按钮
    }, function () {
        layer.close(layerIndex);
        layer.load();
        var deviceid = GetQueryString("deviceid"); //车号
        var startdate = GetQueryString("startdate").replace(/\//g, '-'); //开始时间
        var enddate = GetQueryString("enddate").replace(/\//g, '-'); //结束时间
        var url = "/Common/LineCoverage/RemoteHandlers/GetCustomPosition.ashx?type=GetSmsGps&locomotive_code=" + deviceid + "&start_date=" + startdate + "&end_date=" + enddate;
        $.ajax({
            type: "POST",
            url: url,
            async: true,
            cache: false,
            success: function (result) {
                layer.closeAll('loading');
                if (result == null || result.length == 0 || result[0][1].JCINFO.length == 0) {
                    ymPrompt.errorInfo(deviceid + '； 当前车没有运行数据，请稍后再试。', null, null, '提示信息', null);
                    return;
                }
                _josn = result;
                QBSms();
                loadList(_josn);
            },
            error: function (textStatus) {
                layer.closeAll('loading');
                ymPrompt.errorInfo(deviceid + '； 当前车没有运行数据，请稍后再试。', null, null, '提示信息', null);
                console.log(textStatus);
            }
        });
    });
    
}