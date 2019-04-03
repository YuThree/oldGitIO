var AlarmJson; //申明的同点对比Json对象
var GPSJson;
var _h = $(window).height() / 2;
var _w = $(window).width() / 2;


function AutoSize() {

    _h = $(window).height() / 2;
    _w = $(window).width() / 2;

    $('RowLR').height(_h);

    $('#hw').height(_h).width(_w);
    $('#kjg').height(_h).width(_w);
    $('#BigImg').height(_h).width(_w);
    $("#lbtd").width(_w);
    $('#allimg').height(_h - 2).width(_w - 2);
    $('#tableinfo').height((_h / 2)-40);

    $('#btn_Set_hw').css({ top: _h - 32, left: _w - 32 });
    $('#btn_Set_kjg').css({ top: _h - 32, left: _w });
    $('#btn_Set_all').css({ top: _h, left: _w - 32 });
    $('#panel-6652').css("top", _h  - 42).css("bottom", "inherit");
    $("#ImgPole").width(($(window).width() / 4)-20).height(($(window).height() / 2) - 75);
}
$(document).ready(function () {

    AutoSize();
    $('body').show();

    $(window).resize(function () {
        AutoSize();
    });

    var _w2 = _h / 0.75
    $("#kjg").elevateZoom({ zoomWindowPosition: 7, zoomWindowHeight: _h - 10, zoomWindowWidth: _w2 - 50 });


    createZoom("allimg", "/Common/img/暂无图片.png", "");

    $('#Ureportdate').val(dateNowStr());


    loadForm();
    loadFlexGrid('alarm', 'flexTableAlarm');
    loadFlexGrid('fault', 'flexTableFault');
    hideC3infobyID("jltr"); //隐藏动车数据的交路运用区段信息

    hideNoNeed(); //master.js


    $('.lightbox').lightbox();


    $('.gBlock').css('z-index', '0');

    var _Infowidth = $('#panel-6652').width();

    $('#btn_locInfoControl').click(function () {

        var src = $(this).attr('src');
        if (src.indexOf('left') > 0) {
            $('#btn_locInfoControl').attr('src', '/Common/img/locoPlay/right.png');

            //   $('#panel-6652').width(35)
            $('#panel-6652').animate({ width: 35 }, 500);

            $('#locInfo').animate({ opacity: 0 }, 500);

        } else {
            $('#btn_locInfoControl').attr('src', '/Common/img/locoPlay/left.png');
            //  $('#panel-6652').width('auto');


            $('#panel-6652').animate({ width: _Infowidth }, 500);

            $('#locInfo').animate({ opacity: 1 }, 800);
        }

    })


    if ($(window).width() < 1600) {
        //PC的样式。
        $('.bDiv').height('50px');
        $('.table-condensed th, .table-condensed td').css('padding', '0px 5px');

    }

    var alarmID = GetQueryString("alarmid");
    LoadEditBox("3C", alarmID);


    $('#btn_raised_time').click(function () {

        $('#box_delay').modal().css({
            width: 'auto',
            'margin-left': function () {
                return -($(this).width() / 2);
            },
            'margin-top': function () {
                return -($(this).height() / 2);
            }
        });
    })


    $("#E_btnOk2").click(function () {

        SetAlarmID("3C", alarmID);
    })
    $("#E_btnCan2").click(function () {

        SetAlarmID("3C", alarmID, 1);
    })


    $('#E_save').click(function () {
        AddSave();
    })

    $('#E_saveList').click(function () {
        GetSave();
    })

    LoadSaveListBox("3C");
    $("#btn_fx").click(function () {
        repeatFX();
    });


    $("#btn_replay").click(function () {

        var timeStr = $('#raised_time').text();

        var cDate2 = new Date(timeStr);
        var cdate2_times = parseInt(cDate2.getTime()); //得到毫秒级时间戳  13位

        var wz = $('#BOW_TYPE').text().replace("弓", "");

        //回放按钮
        showBox("视频回放", "/C3/PC/MLiveStreaming/MonitorLocoPlayNew.htm?page=meta_big&btn_tc=0&replay=1&playtime=" + cdate2_times + "&wz=" + wz + "&loca=" + $('#trainNo').text() + '&v=' + version, 800, 600);

    });

});

function loadForm() {
    var url = "RemoteHandlers/DeviceForm.ashx?type=getPoleDetail&deviceId=" + GetQueryString("deviceId") + "&alarmid=" + GetQueryString("alarmid");
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        cache: false,
        success: function (result) {
            if (result != undefined) {
                var responseData = eval('(' + result + ')');
                json_imgs = responseData.imgs;
                document.getElementById('ImgPole').src = responseData.POLE_IMG; //线路
                document.getElementById('line_name').innerHTML = responseData.LINE_NAME; //线路
                document.getElementById('QZ').innerHTML = responseData.QZ; //区站
                document.getElementById('bureau').innerHTML = responseData.JU; //局
                document.getElementById('GDD').innerHTML = responseData.GDD; //供电段
                document.getElementById('CJ').innerHTML = responseData.CJ; //车间
                document.getElementById('GQ').innerHTML = responseData.BZ; //工区
                document.getElementById('brige').innerHTML = responseData.BRG_TUN_NAME; //桥隧
                document.getElementById('DIRECTION').innerHTML = responseData.DIRECTION; //行别
                document.getElementById('pole_number').innerHTML = responseData.POLE_NUMBER; //支柱
                document.getElementById('km_mark').innerHTML = responseData.KM; //公里标
                document.getElementById('BCDAOGAO_T').innerHTML = responseData.BCDAOGAO_T;
                document.getElementById('STAGGER_T').innerHTML = responseData.STAGGER_T;
                document.getElementById('wendu').innerHTML = responseData.wendu;
                document.getElementById('hjwendu').innerHTML = responseData.hjwendu;
                document.getElementById('samplled_time').innerHTML = responseData.SAMPLLED_TIME; //巡检时间
                getAlarminfo(GetQueryString("alarmid"));
            }
        }
    });
};


var option; //表格内容
function loadFlexGrid(type, tableName) {
    option = {
        url: 'RemoteHandlers/DeviceForm.ashx?type=' + type + '&alarmid=' + GetQueryString("alarmid") + '&deviceId=' + GetQueryString("deviceId"),
        dataType: 'json',
        colModel: [
            { display: '设备编号', name: 'LOCOMOTIVE_CODE', width: 50, sortable: false, align: 'center' },
            { display: '发生时间', name: 'RAISED_TIME', width: 150, sortable: false, align: 'center' },
            { display: '位置', name: 'WZ', width: 450, sortable: false, align: 'center' },
            { display: '级别', name: 'SEVERITY', width: 50, sortable: false, align: 'center' },
            { display: '状态', name: 'STATUS_NAME', width: 80, sortable: false, align: 'center' },
            { display: '操作', name: 'CZ', width: 80, sortable: false, align: 'center' },
            { display: '主键', name: 'ID', width: 80, sortable: false, pk: true, hide: true, align: 'center' }
        ],
        width: 'auto',
        height: _h / 2 - 110,
        singleSelect: true,
        rp: parseInt((_h / 2 - 110) / 25),
        rowId: 'ID'
    };
    $('#' + tableName).flexigrid(option);
};
//查看详细信息
function selectInfo(rowdata) {
    var alarmid = rowdata.id.substr(1);
    window.open("/C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=" + alarmid + '&v=' + version);

};


//弹出任务
function taskOpen() {
    var taskid = document.getElementById('taskid').value;
    ShowMTwin("/Common/MTask/TaskForm.htm?id=" + taskid + "&type=openMisTask&openType=openAlarm&v=" + version);
};

function ShowMTwin(str) {
    $("#tanchu").attr("href", str + "&lightbox[iframe]=true&lightbox[width]=95p&lightbox[height]=90p");
    $("#tanchu").click();
};
//查看详细信息
function selectRepeatInfo() {
    window.open("/Common/MDataAnalysis/C3RepeatAlarmImg.aspx?showclose=false&id=" + GetQueryString("alarmid") + "&temp=" + Math.random());
};

//按钮点击事件
function btnOnClick(btntype) {

    if ("btnTask" == btntype) {
        var url = "/Common/MTask/TaskForm.htm?id=" + GetQueryString("alarmid") + "&type=openFaultTask&openType=&v=" + version;
        ShowMTwin(url);
    } else {
        document.getElementById('modal-update').click();
        if (btntype == "btnOk") {
            document.getElementById('updatetitle').innerHTML = "报警确认";
            document.getElementById('updatetype').value = "btnOk";
            yzAlarmData();
        }
        else {
            document.getElementById('updatetitle').innerHTML = "报警取消";
            document.getElementById('updatetype').value = "btnCan";
            yzAlarmData();
        }
    }
};

function ShowMTwin(str) {
    $("#tanchu").attr("href", str + "&lightbox[iframe]=true&lightbox[width]=95p&lightbox[height]=90p");
    $("#tanchu").click();
};
//确认/取消告警
function btnAlarmUpdate() {
    if (yzAlarmData()) {
        var btntype = document.getElementById('updatetype').value;
        var afcode = document.getElementById('citySel').value; //缺陷类型
        var severity = document.getElementById('Useverity').value; //等级
        var txtDefect = document.getElementById('UtxtDefect').value; //缺陷分析
        var txtAdvice = document.getElementById('UtxtAdvice').value; //处理建议
        var txtNote = document.getElementById('UtxtNote').value; //备注
        var txtReporter = document.getElementById('UtxtReporter').value; //报告人
        var reportdate = document.getElementById('Ureportdate').value; //日期


        if (txtDefect.length > 250) {
            ymPrompt.succeedInfo('缺陷分析最多250个字', null, null, '提示信息', null);
            return;
        }

        if (txtAdvice.length > 250) {
            ymPrompt.succeedInfo('处理建议最多250个字', null, null, '提示信息', null);
            return;
        }

        if (txtNote.length > 250) {
            ymPrompt.succeedInfo('备注最多250个字', null, null, '提示信息', null);
            return;
        }



        //调用更新方法
        var responseData = XmlHttpHelper.transmit(false, "get", "text", "RemoteHandlers/MonitorAlarmSave.ashx?alarmid=" + GetQueryString("alarmid") + "&btntype=" + btntype + "&txtDefect=" + escape(txtDefect) + "&txtAdvice=" + escape(txtAdvice) + "&txtNote=" + escape(txtNote) + "&txtReporter=" + escape(txtReporter) + "&reportdate=" + reportdate + "&afcode=" + escape(afcode) + "&severity=" + escape(severity) + "&tmpe=" + Math.random(), null, null);
        if (responseData != null && responseData != "") {
            ymPrompt.succeedInfo('保存成功', null, null, '提示信息', null);
            loadForm();
        } else {
            ymPrompt.errorInfo('操作失败！请联系管理员', null, null, '提示信息', null);
        }
        document.getElementById('btncols').click();
    }
    else {
        return false;
    }
};
//验证数据
function yzAlarmData() {
    var btntype = document.getElementById('updatetype').value;
    var YZ = 0;
    if (btntype == "btnOk") {
        var txtDefect = document.getElementById('UtxtDefect').value; //缺陷分析
        //var afcode = document.getElementById('dll_zt').value; //缺陷类型 
        var severity = document.getElementById('Useverity').value; //等级
        // if (afcode != "0") { document.getElementById('afcodeYZ').className = ""; }
        //else if (afcode == "0") { document.getElementById('afcodeYZ').className = "control-group error"; YZ = 1; }
        if (severity != "请选择") { document.getElementById('UseverityYZ').className = ""; }
        else if (severity == "请选择") { document.getElementById('UseverityYZ').className = "control-group error"; YZ = 1; }
        if (txtDefect.replace(/[ ]/g, "") != "" && txtDefect != undefined) { document.getElementById('UtxtDefectYZ').className = ""; }
        else if (txtDefect.replace(/[ ]/g, "") == "" || txtDefect == undefined) { document.getElementById('UtxtDefectYZ').className = "control-group error"; YZ = 1; }
    }
    else if (btntype == "btnCan") {
        var txtDefect = document.getElementById('UtxtDefect').value; //缺陷分析
        if (txtDefect.replace(/[ ]/g, "") != "" && txtDefect != undefined) { document.getElementById('UtxtDefectYZ').className = ""; }
        else if (txtDefect.replace(/[ ]/g, "") == "" || txtDefect == undefined) { document.getElementById('UtxtDefectYZ').className = "control-group error"; YZ = 1; }
    }
    if (YZ != 0) { return false; } else { return true; }
};
function btnClose() {
    window.close(this);
    if (GetQueryString("rsurl") == "no") {

    } else if (GetQueryString("rsurl") != undefined && GetQueryString("rsurl") != "no") {
        opener.location.href = GetQueryString("rsurl");
    } else {
        opener.location.href = 'MonitorLocoAlarmList.htm?v='+version;
    }

};

var OnClickNumber = 1;
var map;
var point1;

function Map() {


    if (OnClickNumber == 1) {
        Bmaps();
    }


    $('#box_gis').modal().css({
        width: 'auto',
        'margin-left': function () {
            return -($(this).width() / 2);
        },
        'margin-top': function () {
            return -($(this).height() / 2);
        }
    });

    // document.getElementById('modal-22256').click();

    map.centerAndZoom(point1, 9);

    setTimeout(function () {
        $('.anchorBL,. anchorBL').hide();
        //   $('#mapDiv span').hide();
    }, 500)


};

function Bmaps() {
    OnClickNumber = OnClickNumber + 1;
    //var map = new BMap.Map("mapDiv", { mapType: BMAP_HYBRID_MAP }); // 创建Map实例
    //   map = new BMap.Map("mapDiv"); // 创建Map实例
    map = new BMap.Map("mapDiv", { mapType: BMAP_HYBRID_MAP }); // 创建Map实例

    if (GPSJson.GIS_X != "0") {
        var point = new BMap.Point(GPSJson.GIS_X, GPSJson.GIS_Y);    // 创建点坐标
        point1 = new BMap.Point(parseFloat(GPSJson.GIS_X) - 1.54, parseFloat(GPSJson.GIS_Y) + 0.85);    // 创建点坐标
        map.clearOverlays();    //清除地图上所有覆盖物
        map.centerAndZoom(point1, 9); // 初始化地图，设置中心点坐标和地图级别。

        map.enableScrollWheelZoom();
        map.enableKeyboard();
        map.disableDoubleClickZoom();

        var icon = new BMap.Icon("/Common/img/baojing.gif", new BMap.Size(20, 20));
        var marker = new BMap.Marker(point, { icon: icon });
        map.addOverlay(marker);

        //map.panTo(point);
    } else {
        var point = new BMap.Point(GPSJson.GIS_X_O, GPSJson.GIS_Y_O);    // 创建点坐标
        point1 = new BMap.Point(parseFloat(GPSJson.GIS_X_O) - 1.54, parseFloat(GPSJson.GIS_Y_O) + 0.85);    // 创建点坐标
        map.clearOverlays();    //清除地图上所有覆盖物
        map.centerAndZoom(point1, 9); // 初始化地图，设置中心点坐标和地图级别。

        map.enableScrollWheelZoom();
        map.enableKeyboard();
        map.disableDoubleClickZoom();

        var Point = new BMap.Point(GPSJson.GIS_X_O, GPSJson.GIS_Y_O);
        BMap.Convertor.translate(Point, 0, GPSZH, 0)
    }
    //  map.addControl(bmapUserTopOneRightInfo);
    //  map.addControl(new BMap.OverviewMapControl());
    map.addControl(new BMap.MapTypeControl({ anchor: BMAP_ANCHOR_TOP_LEFT }));    //左上角，默认地图控件
    map.setCurrentCity("武汉");   //由于有3D图，需要设置城市哦
    // var cr = new BMap.CopyrightControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT });
    // map.addControl(cr); //添加版权控件
    //  cr.addCopyright({ id: 1, content: "<a href='http://www.railwaytec.com'></a>" });


};
GPSZH = function (point, num) {
    var icon = new BMap.Icon("/Common/img/baojing.gif", new BMap.Size(24, 32));
    var marker = new BMap.Marker(point, { icon: icon });
    map.addOverlay(marker);
};
function translate(point, type, callback, j) {
    var callbackName = 'cbk_' + Math.round(Math.random() * 10000);    //随机函数名
    var xyUrl = "http://api.map.baidu.com/ag/coord/convert?from=" + type + "&to=4&x=" + point.lng + "&y=" + point.lat + "&callback=BMap.Convertor." + callbackName;
    //动态创建script标签
    load_script(xyUrl);
    BMap.Convertor[callbackName] = function (xyResult) {
        delete BMap.Convertor[callbackName];    //调用完需要删除改函数
        var point = new BMap.Point(xyResult.x, xyResult.y);
        callback && callback(point, j);
    }
};
function bmapUserTopOneRightInfo() {
    // 设置默认停靠位置和偏移量
    this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
    this.defaultOffset = new BMap.Size(5, 5);

};




var BigimgPath;
var bigtype;
function ALLimg(e, type) {
    Suspended();
    document.getElementById("note").style.display = "none";
    //document.getElementById("table").style.display = "none";
    document.getElementById("BigDiv").style.display = "";
   // document.getElementById("main").style.display = "none";
    document.getElementById("BigImg").src = e.src;
    bigtype = type;
    if (type == "HW") {
        BigImgPlayhw();
    } else if (type == "KJG") {
        BigImgPlaykjg();
    } else {
        BigImgPlayqj();
    }
}

function CloseALLimg(e) {
    clearInterval(setbig);
    ImgShuffling();
    document.getElementById("table").style.display = "";
    document.getElementById("BigDiv").style.display = "none";
    if (isqj == 1) {
        document.getElementById("main").style.display = "";
    } else {
        document.getElementById("main").style.display = "none";
    }
}

var setbig;
//全屏播放红外
function BigImgPlayhw() {
    if (ImgNum == imaCount) {
        document.getElementById("BigImg").src = dirpath + Imgjson.IRV_DIR_NAME + imaname + ".JPG";
        document.getElementById("Biglocnew").style.display = "none";
        document.getElementById("Biglocold").style.display = "";
        document.getElementById("Biglocinfo").innerHTML = locinfo;
        ImgNum = Imgjson.START_INDEX; //计数器还原
        clearInterval(setbig); //关闭定时器 
        setbig = setInterval('BigImgPlayhw()', 5000);
    }
    else {
        document.getElementById("BigImg").src = dirpath + Imgjson.IRV_DIR_NAME + imaname + ImgNum + ".JPG";
        bindBigLog(InfoNum);
        ImgNum++;
        InfoNum++;
        clearInterval(setbig);
        setbig = setInterval('BigImgPlayhw()', 500);
    }
}
//全屏播放可见光
function BigImgPlaykjg() {
    if (ImgNum == imaCount) {
        document.getElementById("BigImg").src = dirpath + Imgjson.VI_DIR_NAME + jpgname + Imgjson.START_INDEX + ".JPG";
        document.getElementById("Biglocnew").style.display = "none";
        document.getElementById("Biglocold").style.display = "";
        document.getElementById("Biglocinfo").innerHTML = locinfo;
        ImgNum = Imgjson.START_INDEX; //计数器还原
        clearInterval(setbig); //关闭定时器
        setbig = setInterval('BigImgPlaykjg()', 5000);
    }
    else {
        document.getElementById("BigImg").src = dirpath + Imgjson.VI_DIR_NAME + jpgname + ImgNum + ".JPG";
        bindBigLog(InfoNum);
        ImgNum++;
        InfoNum++;
        clearInterval(setbig);
        setbig = setInterval('BigImgPlaykjg()', 500);
    }
}
//全屏播放全景
function BigImgPlayqj() {
    if (ImgNum == imaCount) {
        document.getElementById("BigImg").src = dirpathall + Imgjson.START_INDEX + ".JPG";
        document.getElementById("Biglocnew").style.display = "none";
        document.getElementById("Biglocold").style.display = "";
        document.getElementById("Biglocinfo").innerHTML = locinfo;
        ImgNum = Imgjson.START_INDEX; //计数器还原
        clearInterval(setbig); //关闭定时器 
        setbig = setInterval('BigImgPlayqj()', 5000);
    }
    else {
        document.getElementById("BigImg").src = dirpathall + ImgNum + ".JPG";
        bindBigLog(InfoNum);
        ImgNum++;
        InfoNum++;
        clearInterval(setbig);
        setbig = setInterval('BigImgPlayqj()', 500);
    }
}

function bindBigLog(i) {
    if (i > 9) {
        InfoNum = 0;
        i = InfoNum;
    }
    document.getElementById("Biglocnew").style.display = "";
    document.getElementById("Biglocold").style.display = "none";
    document.getElementById("zgwd11").innerHTML = Imgjson.FRAME_INFO[i].TEMP_IRV / 100;
    document.getElementById("hjwd11").innerHTML = Imgjson.FRAME_INFO[i].TEMP_ENV / 100;
    document.getElementById("dgz11").innerHTML = Imgjson.FRAME_INFO[i].LINE_HEIGHT;
    document.getElementById("lcz11").innerHTML = Imgjson.FRAME_INFO[i].PULLING_VALUE;
    document.getElementById("sd11").innerHTML = Imgjson.FRAME_INFO[i].SPEED;

}
var Isbigpaly = 1;
//
function BigdbImgShuffling() {
    if (Isbigpaly == "1") {
        Isbigpaly = 0;
        clearInterval(setbig);
    } else {
        Isbigpaly = 1;
        if (bigtype == "HW") {
            BigImgPlayhw();
        } else if (bigtype == "KJG") {
            BigImgPlaykjg();
        } else {
            BigImgPlayqj();
        }
    }
}


function NextAlarm() {

    var para = window.location.href.split('?')[1]
    var newid = XmlHttpHelper.transmit(false, "get", "text", "RemoteHandlers/NextAlarm.ashx?" + para, null, null);

    if (newid == '') {
        ymPrompt.alert('已经没有下一条数据了');
    }
    else {
        var n = para.indexOf('&');
        var para_noID = para.substring(n, para.length - 1);
        window.location.href = "MonitorAlarm3CForm4.htm?alarmid=" + newid + para_noID;
    }
}
var islookwd = 1;
function lookWD() {
    if (islookwd == "1") {
        islookwd = 0;
        document.getElementById("main").style.display = "";
        loadC3Echarts();
    } else {
        islookwd = 1;
        document.getElementById("main").style.display = "none";
    }
}

//DIV拖动事件
var rDrag = {
    o: null,
    init: function (o) {
        o.onmousedown = this.start;
    },
    start: function (e) {
        var o;
        e = rDrag.fixEvent(e);
        e.preventDefault && e.preventDefault();
        rDrag.o = o = this;
        o.x = e.clientX - rDrag.o.offsetLeft;
        o.y = e.clientY - rDrag.o.offsetTop;
        document.onmousemove = rDrag.move;
        document.onmouseup = rDrag.end;
    },
    move: function (e) {
        e = rDrag.fixEvent(e);
        var oLeft, oTop;
        oLeft = e.clientX - rDrag.o.x;
        oTop = e.clientY - rDrag.o.y;
        rDrag.o.style.left = oLeft + 'px';
        rDrag.o.style.top = oTop + 'px';
    },
    end: function (e) {
        e = rDrag.fixEvent(e);
        rDrag.o = document.onmousemove = document.onmouseup = null;
    },
    fixEvent: function (e) {
        if (!e) {
            e = window.event;
            e.target = e.srcElement;
            e.layerX = e.offsetX;
            e.layerY = e.offsetY;
        }
        return e;
    }
}

function SetFrame(_type) {



    if (_type == "OAB") {
        _type = OAB;
    }

    var responseData = XmlHttpHelper.transmit(false, "get", "text", "RemoteHandlers/GetMonitorAlarmC3Form.ashx?type=set&alarmid=" + GetQueryString("alarmid") + "&imgType=" + _type + "&index=" + ImgNum + "&r=" + Math.random(), null, null);

    getAlarminfo(GetQueryString("alarmid"));

    ymPrompt.succeedInfo('设置成功', null, null, '提示信息', null);


}


function importToWord() {
    var url = "/Report/AlarmReport.aspx?alarmid=" + GetQueryString("alarmid") + "&isReturn=1&_w=" + window.screen.width + "&_h=" + window.screen.height;
    window.open(url);
    //            ShowWinOpenhw(url);
}

function ShowMTwin(str, w, h) {
    $("#tanchu").attr("href", str + "&lightbox[iframe]=true&lightbox[width]=90p&lightbox[height]=90p");
    $("#tanchu").click();
};
//模态任务弹出关闭
function TaskClose() {
    $.lightbox().close();
}

function LoadSave() {
    var alarmID = GetQueryString("alarmid");
    //添加收藏。
    var SaveAlarms = getCookieValue("SaveAlarms");
    if (SaveAlarms != '') {
        if (SaveAlarms.indexOf(alarmID) >= 0) {
            //已经存在
            $('#i_save').removeClass("icon-white").addClass("icon-color");
        }
        else {
            $('#i_save').removeClass("icon-color").addClass("icon-white");
        }
    }
}

function AddSave() {

    var alarmID = GetQueryString("alarmid");
    //添加收藏。
    var SaveAlarms = getCookieValue("SaveAlarms");
    if (SaveAlarms != '') {
        if (SaveAlarms.indexOf(alarmID) >= 0) {
            //已经存在
            //ymPrompt.alert('已经收藏');
            DelSaveAlarms(alarmID);
            $('#i_save').removeClass("icon-color").addClass("icon-white");
            return;

        }
        else {
            SaveAlarms += '_' + alarmID;

            $('#i_save').removeClass("icon-white").addClass("icon-color");

            // ymPrompt.alert('收藏成功');
        }
    }
    else {
        SaveAlarms = alarmID;
        $('#i_save').removeClass("icon-white").addClass("icon-color");
        //  ymPrompt.alert('收藏成功');
    }

    deleteCookie("SaveAlarms", "/");
    addCookie("SaveAlarms", SaveAlarms, 30, "/");

}

function GetSave() {
    var SaveAlarms = GetSaveAlarms();

    // alert(SaveAlarms);
}

function modalShow() {
    $("#ddlzt").html("");
    $("#range").val(getConfig("RepeatRange"));
    $("#repeatCount").val(getConfig("RepeatCount"));
    var stausAll = "AFSTATUS01,AFSTATUS02,AFSTATUS03,AFSTATUS04,AFSTATUS05".split(',');
    var status = getConfig("RepeatStatus");
    for (var j = 0; j < stausAll.length; j++) {
        var name = "";
        switch (stausAll[j]) {
            case "AFSTATUS01":
                name = "新上报";
                break;
            case "AFSTATUS02":
                name = "已取消";
                break;
            case "AFSTATUS03":
                name = "已确认";
                break;
            case "AFSTATUS04":
                name = "已计划";
                break;
            case "AFSTATUS05":
                name = "已关闭";
                break;
            default:
        }
        if (status.indexOf(stausAll[j]) > -1)
            $("#ddlzt").html($("#ddlzt").html() + "<option value='" + stausAll[j] + "' selected>" + name + "</option>");
        else
            $("#ddlzt").html($("#ddlzt").html() + "<option value='" + stausAll[j] + "'>" + name + "</option>");
    }
    if (GPSJson.LOCNO.indexOf("CRH") > -1) {
        $(".tdXb").css("display", "none");
        $(".tdLx").attr("colspan", "3");
        var content = "东经" + GPSJson.GIS_X + "  北纬" + GPSJson.GIS_Y + "  发生时间" + GPSJson.RAISED_TIME;
        $("#td_title").text(content);
    }
    else {
        var content = GPSJson.LINE + "  " + GPSJson.QZ + "  " + GPSJson.DIRECTION + "  " + GPSJson.KM + "  " + GPSJson.RAISED_TIME;
        $("#td_title").text(content);
    }
    $('#citySel').mySelectTree({
        cateGory: 'AFCODE',
        codeType: '3C',
        chkboxType: { "Y": "s", "N": "s" },
        enableCheck: true,
        onClick: false,
        tag: "SYSDICTIONARYTREE",
        onCheck: function (event, treeId, treeNode) {
            var zTree = $.fn.zTree.getZTreeObj(treeId),
                    nodes = zTree.getCheckedNodes(true),
                     v = "", code = "";
            for (var i = 0, l = nodes.length; i < l; i++) {
                v += nodes[i].name + ",";
                code += nodes[i].id + ",";
            }
            if (v.length > 0) v = v.substring(0, v.length - 1);
            if (code.length > 0) code = code.substring(0, code.length - 1);
            var cityObj = $("#citySel");
            cityObj.attr("value", v).attr("code", code);
        },
        callback: function (event, treeId, treeNode, msg) {
            var treeCode = getConfig("RepeatCode").split(',');
            if (treeCode[0] == "") {
                var treeObj = $.fn.zTree.getZTreeObj(treeId);
                treeObj.checkAllNodes(true);
                var node = treeObj.getNodeByParam("name", "干扰", null);
                treeObj.checkNode(node, false, true);
            } else {
                for (var i = 0; i < treeCode.length; i++) {
                    var treeObj = $.fn.zTree.getZTreeObj(treeId);
                    var node = treeObj.getNodeByParam("id", treeCode[i], null);
                    treeObj.checkNode(node, true, true);
                }
                var zTree = $.fn.zTree.getZTreeObj(treeId),
                    nodes = zTree.getCheckedNodes(true),
                     v = "", code = "";
                for (var i = 0, l = nodes.length; i < l; i++) {
                    v += nodes[i].name + ",";
                    code += nodes[i].id + ",";
                }
                if (v.length > 0) v = v.substring(0, v.length - 1);
                if (code.length > 0) code = code.substring(0, code.length - 1);
                var cityObj = $("#citySel");
                cityObj.attr("value", v).attr("code", code);

            }
        }
    });
    $("#ddlzt").multiselect({
        noneSelectedText: "==请选择==",
        checkAllText: "全选",
        uncheckAllText: '全不选',
        selectedList: 5
    });

}

function repeatFX() {
    var obj = document.getElementById('ddlzt');
    var status = getSelectedItem(obj); //缺陷状态
    var zTree = $.fn.zTree.getZTreeObj("ULcitySel");
    var nodes = zTree.getCheckedNodes(true);
    var code = "";
    for (var i = 0, l = nodes.length; i < l; i++) {
        code += nodes[i].id + ",";
    }
    if (code.length > 0) code = code.substring(0, code.length - 1); //缺陷类型
    var direction = $("#direction").val();
    var startTime = $("#startTime").val();
    var endTime = $("#endTime").val();
    var range = $("#range").val();
    var repeatCount = $("#repeatCount").val();
    var url = "RemoteHandlers/GetAlarmTD.ashx?alarmid=" + GetQueryString("alarmid")
    + "&direction=" + direction
    + "&startTime=" + startTime
    + "&endTime=" + endTime
    + "&range=" + range
    + "&repeatCount=" + repeatCount
    + "&code=" + code
    + "&status=" + status
    + "&temp=" + Math.random();
    //loadTdGrid(url);
}
//获取选中项
function getSelectedItem(obj) {
    var slct = "";
    for (var i = 0; i < obj.options.length; i++)
        if (obj.options[i].selected == true) {
            slct += ',' + obj.options[i].value;
        }
    return slct.substring(1);
};
//设置选中项
function setSelectdItem(selectobj) {
    $("button span").eq(0).html("新上报, 已计划, 已确认");
    $("#ui-multiselect-ddlzt-option-0").attr("checked", true);
    $("#ui-multiselect-ddlzt-option-1").attr("checked", true);
    $("#ui-multiselect-ddlzt-option-2").attr("checked", true);
    $("#ui-multiselect-ddlzt-option-3").attr("checked", false);
    $("#ui-multiselect-ddlzt-option-4").attr("checked", false);
    var val = "AFSTATUS01,AFSTATUS03,AFSTATUS04";
    for (var i = 0; i < selectobj[0].length; i++)
        if (val.indexOf(selectobj[0][i].value) >= 0) {
            selectobj[0][i].selected = true;
        } else {
            selectobj[0][i].selected = false;
        }
};