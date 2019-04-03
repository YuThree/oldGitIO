var map;              //地图对象
var One_number = 0;   //一类数量
var Two_number = 0;   //二类数量
var Three_number = 0; // 三类数量

var new_number = 0;   //新上报数量
var sure_number = 0;  //已确认数量
var plan_number = 0;  //已计划数量
var check_number = 0;  //检修中数量
var close_number = 0;  //已关闭数量
var cancel_number = 0;  //已取消数量
var displayStr = "";  // 显示或页面
var PageAlarmJson;  // 包含分页的告警列表JSON
var page = 1;  // 分页当前页数
var pagesize = 500;  // 分页每页数量
var Count = 0;  // 分页总页数
var overlays = [];  //画矩形框集合
var drawingManager;      //实例化鼠标绘制工具
var animateMarker = null; //弹出框新样式

var RECTANGLE_op = true;//矩形框点击事件次数
var completeTimer = null;//解决矩形框compelet多次执行

var PageTrainJson;  // 包含分页的途径车辆列表JSON
var page_train = 1;  // 途径车辆分页当前页数
var pagesize_train = 500;  // 途径车辆分页每页数量
var Count_train = 0;  // 途径车辆分页总页数
var overlays_train = [];  //途径车辆画矩形框集合
var drawingManager_train;      //途径车辆实例化鼠标绘制工具
var animateMarker_train = null; //途径车辆弹出框新样式

///初始化地图   
///参数：id-DIV的ID，mapLevel-地图初始显示层次
function BindMap(id, mapLevel) {
    var type = getConfig('mapType');
    if (type == "1") //卫星
        map = new BMap.Map(id, { mapType: BMAP_HYBRID_MAP }); // 创建Map实例
    else //地图
        map = new BMap.Map(id, { mapType: BMAP_NORMAL_MAP }); // 创建Map实例

    map.clearOverlays();    //清除地图上所有覆盖物
    GetDrawingManager();
    var CenterLon = getCookieValue("CenterLon");
    if (CenterLon == "null" || CenterLon == "") {
        CenterLon = getConfig('CenterLon');
    }
    var CenterLat = getCookieValue("CenterLat");
    if (CenterLat == "null" || CenterLat == "") {
        CenterLat = getConfig('CenterLat');
    }
    var point = new BMap.Point(CenterLon, CenterLat);    // 创建点坐标
    map.centerAndZoom(point, mapLevel); // 初始化地图，设置中心点坐标和地图级别。
    map.enableScrollWheelZoom();
    map.enableKeyboard();
    map.disableDoubleClickZoom();
    map.addControl(new BMap.OverviewMapControl());
    var cr = new BMap.CopyrightControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT });
    map.addControl(cr); //添加版权控件
    cr.addCopyright({ id: 1, content: "<a href='http://www.railwaytec.com'></a>" });
};

///获取告警信息并加载
function GetAlarm() {
    One_number = 0;
    Two_number = 0;
    Three_number = 0;

    new_number = 0;
    sure_number = 0;
    plan_number = 0;
    check_number = 0;
    close_number = 0;
    cancel_number = 0;
    wc_number = 0;
    var markers = [];
    PageAlarmJson = getMisC3AlarmData(); //当前JS  (包含分页信息)
    SetPage();//分页
    var alarmJson = PageAlarmJson.rows;      //只含缺陷详情JSON
    if (alarmJson != undefined && alarmJson.length > 0) {
        for (var i = 0; i < alarmJson.length; i++) {

            var m = alarmJson[i];
            displayStr = getDisplayStr(m); //当前JS
            var icoUrl = getIcoUrl(m); //当前JS
            var Point = new BMap.Point(m.GIS_X, m.GIS_Y);
            markers.push(new BMap.Marker(Point));
            var icon = new BMap.Icon(icoUrl, new BMap.Size(Ico_alarm_width, Ico_alarm_heigth));

            var marker = new BMap.Marker(Point, { icon: icon });
            //marker.setLabel(labelMark);
            map.addOverlay(marker);
            marker.disableDragging(true);
            marker.alarmJson = m;
            marker.type = "Alarm";
            marker.id = m.ID;
            marker.addEventListener("click", getC3AlarmClick); //单击 当前JS
            marker.addEventListener("dblclick", getC3AlarmdbClick); //双击 当前JS
            if (displayStr != "") {
                marker.hide();
            } else {
                marker.show();
            }
            marker.setOffset(new BMap.Size(Ico_alarm_left, Ico_alarm_top));
            marker.setZIndex(10);
            var opts = {
                position: Point,    // 指定文本标注所在的地理位置
                offset: new BMap.Size(-6, -16)    //设置文本偏移量
            }
            if (m.REP_COUNT != "" && getConfig('debug') == "1") {
                if (parseInt(m.REP_COUNT) > 1) {
                    var label = new BMap.Label(m.REP_COUNT, opts);  // 创建文本标注对象
                    label.setStyle({
                        color: "red",
                        fontSize: "15px",
                        height: "20px",
                        lineHeight: "20px",
                        fontFamily: "黑体",
                        fontWeight: "bold",
                        cursor: "pointer"
                    });

                    label.alarmJson = m;
                    marker.setLabel(label);
                    label.addEventListener("click", geRepeatAlarmInfo);
                }
            }
        }

    }



    map.json = alarmJson;
};

//获取途径车辆信息
function GetTrain() {
    PageTrainJson = getMisC3TrainData(); //当前JS  (包含分页信息)
    var trainJson = PageTrainJson.rows;      //只含途经车辆详情JSON
    map.train_json = trainJson;
}

///单击告警调用方法   
function getC3AlarmClick(e) {
    var m = this.alarmJson;
    ClickAlarmMaker(m.ALARM_ID, m.CATEGORY_CODE);
};
///双击告警调用方法   
function getC3AlarmdbClick(e) {
    var m = this.alarmJson;
    var url = '';
    if ('6C' === m.CATEGORY_CODE) {
        url = '/C6/PC/MAlarmMonitoring/MonitorAlarmC6Form.htm?Eventid=' + m.ALARM_ID + '&ALARMID=' + m.ALARM_ID + '&v=' + version;;
    } else {
        url = "/C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=" + m.ALARM_ID + '&v=' + version;
    }
    window.open(url, "_blank");
};

//重复报警弹出具体信息
function geRepeatAlarmInfo(e) {
    var m = this.alarmJson;
    window.open("/Common/MDataAnalysis/C3RepeatAlarmImg.aspx?showclose=true&alarmid=" + m.ALARM_ID + "&id=" + m.ALARM_ID + '&v=' + version + "&temp=" + Math.random());
}

//设置选中告警列表样式及加载告警图像及曲线信息
function ClickAlarmMaker(ALARM_ID, CATEGORY_CODE) {
    if (CATEGORY_CODE == '3C' || CATEGORY_CODE == '6C') {//3c展示右侧其他不展示
        $("#myDiv").hide('slow');
        $("#C3Alarm").css("display", "").animate({ "right": 0 });
        getAlarminfo(ALARM_ID);
        SetAlarmGIS(ALARM_ID)
        $('#alarms>div').removeClass('alarmItem_over');


    } else {
        $("#myDiv").hide('slow');
        SetAlarmGIS(ALARM_ID)
    }
    $('#' + ALARM_ID).addClass('alarmItem_over');
    SetTop(ALARM_ID);

}
///设置滚动条
function SetTop(_alarmID) {
    $("#alarms").animate({ scrollTop: $("#" + _alarmID)[0].offsetTop - 80 }, 500);
}

var oldp = null;

//选择告警
function SetAlarmGIS(alarmID) {

    var re = '';
    var overlays = map.getOverlays();
    //	alert(overlays.length);
    for (var i = 0; i < overlays.length; i++) {

        var m = overlays[i];
        //   re += "<br/>" + m.at;
        //	alert(m.at);
        if (m.type == "Alarm" && m.alarmJson.ALARM_ID == alarmID || m.type == "WC" && m.alarmJson.ALARM_ID == alarmID) {
            var p = m.getPosition();
            map.setCenter(p);
            if (oldp != null) {
                oldp.setAnimation(null);
            }
            m.setAnimation(BMAP_ANIMATION_BOUNCE);
            oldp = m;
            var hmtl = getAlarmHtml(m.alarmJson); //GetHtml.js 中
            

            if (animateMarker == null) {
                animateMarker = new AnimateMarker(p, hmtl);
                animateMarker.type = "animateMarker";
                map.addOverlay(animateMarker);
            }
            else {
                animateMarker.setPointAndText(p, hmtl);
            }
            if (m.alarmJson.CATEGORY_CODE == "6C") {
                $(document).find("div[class='span3']").css('display', 'none');
            }
            //加载报警确认取消和转任务弹出框
            LoadSureBox('3C', m.alarmJson.ALARM_ID);
            $("#E_btnOk2").click(function () {

                SetAlarmID("3C", alarmID);
            });
            $("#E_btnCan2").click(function () {

                SetAlarmID("3C", alarmID, 1);
            });
            break;

        }
    }


};
//图像URL
function getIcoUrl(m) {
    //ico生成。
    var icoUrl = '/Common/MGIS/img/StatusLevel.png';
    switch (m.STATUS) {
        case 'AFSTATUS01':
            //   new_number++;
            icoUrl = icoUrl.replace('Status', 'new');
            break;
        case 'AFSTATUS03':
            //  sure_number++;
            icoUrl = icoUrl.replace('Status', 'sure');
            break;
        case 'AFSTATUS04':
            //   plan_number++;
            icoUrl = icoUrl.replace('Status', 'plan');
            break;
        case 'AFSTATUS07':
            //   check_number++;
            icoUrl = icoUrl.replace('Status', 'check');
            break;
        case 'AFSTATUS05':
            //   close_number++;
            icoUrl = icoUrl.replace('Status', 'close');
            break;
        case 'AFSTATUS02':
            // cancel_number++;
            icoUrl = icoUrl.replace('Status', 'cancel');
            break;
    }

    switch (m.SEVERITY_CODE) {
        case '一类':
            //    One_number++;
            icoUrl = icoUrl.replace('Level', '1');
            break;
        case '二类':
            //  Two_number++;
            icoUrl = icoUrl.replace('Level', '2');
            break;
        case '三类':
            //  Three_number++;
            icoUrl = icoUrl.replace('Level', '3');
            break;
    }
    return icoUrl;
}

//显示
function getDisplayStr(m) {
    var IscheckType1 = $("#cb_type1").is(':checked');
    var IscheckType2 = $("#cb_type2").is(':checked');
    var IscheckType3 = $("#cb_type3").is(':checked');

    var Ischeck_new = $("#cb_new").is(':checked');
    var Ischeck_sure = $("#cb_sure").is(':checked');
    var Ischeck_plan = $("#cb_plan").is(':checked');
    var Ischeck_check = $("#cb_check").is(':checked');
    var Ischeck_close = $("#cb_close").is(':checked');
    var Ischeck_cancel = $("#cb_cancel").is(':checked');
    displayStr = "";
    if (!IscheckType1 && m.SEVERITY_CODE == "一类") {
        displayStr = "hide";
    }

    if (!IscheckType2 && m.SEVERITY_CODE == "二类") {
        displayStr = "hide";
    }

    if (!IscheckType3 && m.SEVERITY_CODE == "三类") {
        displayStr = "hide";
    }

    if (!Ischeck_new && m.STATUS == "AFSTATUS01") {
        displayStr = "hide";
    }

    if (!Ischeck_sure && m.STATUS == "AFSTATUS03") {
        displayStr = "hide";
    }

    if (!Ischeck_plan && m.STATUS == "AFSTATUS04") {
        displayStr = "hide";
    }

    if (!Ischeck_check && m.STATUS == "AFSTATUS07") {
        displayStr = "hide";
    }

    if (!Ischeck_close && m.STATUS == "AFSTATUS05") {
        displayStr = "hide";
    }

    if (!Ischeck_cancel && m.STATUS == "AFSTATUS02") {
        displayStr = "hide";
    }
    return displayStr;
}


//获取C3设备报警缺陷的坐标点
function getMisC3AlarmData() {

    var txtqz = $('#txtqz').val();
    var positioncode = '';
    if (txtqz != '') {
        positioncode = $('#txtqz').attr('code'); //区站
    }
    if (getConfig('For6C') != 'DPC') { positioncode = '' };//DPC版本才使用 该字段
    var obj = { 'positioncode': positioncode }
    var queryType = 'QueryAlarm';
    if (getConfig('For6C') === 'DPC') {
        queryType = 'QueryAlarm6C';
    }
    url = '/Common/MGIS/ASHX/MisAlarm/BMapC3DataPoint.ashx?type=' + queryType + '&' + GetUrlEx()
    '&temp=' + Math.random();
    var json;
    $.ajax({
        type: "POST",
        url: url,
        data: obj,
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

//获取C3途径车辆的坐标点
function getMisC3TrainData() {
    var txtpole = ""; // document.getElementById('txtpole').value;
    url = '/Common/MGIS/ASHX/MisAlarm/DeviceInRectangular.ashx?' + GetUrlTrain() + '&temp=' + Math.random() + '途经车辆路径测试';
    var json;
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        cache: false,
        dataType: 'json',
        success: function (result) {
            if (result != "") {
                json = result;
            }
        }
    });
    return json;
}

//获取途经车辆 URL 根据查询条件拼接
function GetUrlTrain() {
    var obj = document.getElementById('ddlzt'); //报警状态
    var jbobj = document.getElementById('jb'); //报警级别
    var jwdText = ''; //  document.getElementById('duanselect').options[document.getElementById('duanselect').selectedIndex].text; //段; //机务段 名称
    var jlh = document.getElementById('jlh').value; //交路
    var loccode = document.getElementById('txtloccode').value; //设备编码
    var startdate = document.getElementById('sdate').value; //时间
    var enddate = document.getElementById('edate').value; //结束日期
    var zt = getSelectedItem(obj); // document.getElementById('dll_zt').value; //状态
    var startkm = document.getElementById('startkm').value; //开始
    var endkm = document.getElementById('endkm').value; //结束公里标
    var jb = getSelectedJB(jbobj); //等级code
    var afcode = $('#citySel').val();  // getSelectedItem(qxType.childNodes[0]);
    var line = document.getElementById('lineselect').value; //线路
    var bjbm = document.getElementById('bjbm').value; //报警编码
    var direction = '0'//行别
    if ($('#direction').val() != '') {
        direction = $('#direction').attr('code');
    }
    var data = $("#form1").serialize();
    // alert(data);
    var orgCode = $('#hf_ddlorg').val(); //组织机构编码
    var orgType = $('#hf_type_ddlorg').val(); //组织机构类型
    if ($('#ddlorg').val() == "") { //组织机构名称
        orgCode = "0";
    }
    var code = ''; //报警类型
    if ($('#citySel').val() != '')
        code = $('#citySel').attr("code"); //报警类型
    var txt_bow = escape($('#txt_bow').val()); //弓位置

    var qz = $('#txtqz').val(); //区站

    //如果选中向后台传入1，不选中则传空字符串，后台只用判断是否为空
    var show_repeat = $("#repeat_switch").is(":checked");//重复报警

    var bug_switch = $("#bug_switch").is(":checked"); //典型缺陷

    var url_ex = data
                        + '&duanText=' + escape(jwdText)
                        + '&page=' + escape(page)
                        + '&pagesize=' + escape(pagesize)
                        + '&jb=' + escape(jb)
                        + '&jlh=' + escape(jlh)
                        + '&locid=' + loccode
                        + '&startdate=' + startdate
                        + '&enddate=' + enddate
                        + '&zt=' + zt
                        + '&orgCode=' + orgCode
                        + '&orgType=' + orgType
                        + '&startkm=' + startkm
                        + '&endkm=' + endkm
                        + '&afcode=' + afcode
                        + '&line=' + line
                        + '&bjbm' + bjbm
                        + '&xb=' + escape(direction)
                        + '&code=' + escape(code)
                        + '&qz=' + escape(qz)
                        + '&show_repeat=' + escape(show_repeat ? "1" : "")
                        + '&bug_switch=' + escape(bug_switch ? "1" : "");
    return url_ex;
};

///获取ＵＲＬ根据查询条件拼接
function GetUrlEx() {
    var obj = document.getElementById('ddlzt'); //报警状态
    var jbobj = document.getElementById('jb'); //报警级别
    var jwdText = ''; //  document.getElementById('duanselect').options[document.getElementById('duanselect').selectedIndex].text; //段; //机务段 名称
    var jlh = document.getElementById('jlh').value; //交路
    var loccode = document.getElementById('txtloccode').value; //设备编码
    var startdate = document.getElementById('startdate').value; //时间
    var enddate = document.getElementById('enddate').value; //结束日期
    var zt = getSelectedItem(obj); // document.getElementById('dll_zt').value; //状态
    var startkm = document.getElementById('startkm').value; //开始
    var endkm = document.getElementById('endkm').value; //结束公里标
    var jb = getSelectedJB(jbobj); //等级code
    var afcode = $('#citySel').val();  // getSelectedItem(qxType.childNodes[0]);
    var line = document.getElementById('lineselect').value; //线路
    //var bjbm = document.getElementById('bjbm').value; //报警编码
    var direction = $('#direction').val();
    var data = $("#form1").serialize();
    // alert(data);

    var orgCode = $('#hf_ddlorg').val(); //组织机构编码
    var orgType = $('#hf_type_ddlorg').val(); //组织机构类型
    if ($('#ddlorg').val() == "") { //组织机构名称
        orgCode = "0";
    }
    var code = ''; //报警类型
    var code_type = ''; //报警类型类别
    if ($('#citySel').val() != '') { code = $('#citySel').attr("code"); code_type = $('#citySel').attr("treetype") }//报警类型
    var txt_bow = escape($('#txt_bow').val()); //弓位置

    var qz = $('#txtqz').val(); //区站
    if (getConfig('For6C') == 'DPC') { qz = '' };//DPC版本使用其他字段传值
    var dll_lx = ''; 
    if ($('#dll_lx').val() != '') {
        dll_lx = $('#dll_lx').attr('code');//检测类型
    }

    //如果选中向后台传入1，不选中则传空字符串，后台只用判断是否为空
    var show_repeat = $("#repeat_switch").is(":checked");//重复报警

    var bug_switch = $("#bug_switch").is(":checked"); //典型缺陷

    var url_ex = data
                        + '&duanText=' + escape(jwdText)
                        + '&page=' + escape(page)
                        + '&rp=' + escape(pagesize)
                        + '&jb=' + escape(jb)
                        + '&jlh=' + escape(jlh)
                        + '&locid=' + loccode
                        + '&startdate=' + startdate
                        + '&enddate=' + enddate
                        + '&zt=' + zt
                        + '&orgCode=' + orgCode
                        + '&orgType=' + orgType
                        + '&startkm=' + startkm
                        + '&endkm=' + endkm
                        + '&afcode=' + afcode
                        + '&line=' + line
                        //+ '&bjbm=' + bjbm 
                        //+ '&ddllx=' + dll_lx
                        + '&dllzt=' + dll_lx
                        + '&xb=' + escape(direction)
                        + '&code=' + escape(code)
                        + '&code_type=' + escape(code_type)
                        + '&qz=' + escape(qz)
                        + '&show_repeat=' + escape(show_repeat ? "1" : "")
                        + '&bug_switch=' + escape(bug_switch ? "1" : "");

    return url_ex;



};

function portOutProgress() {
    var url = '/C3/PC/MAlarmMonitoring/RemoteHandlers/GetMonitorLocoAlarmList.ashx?action=start&' + GetUrlEx() + "&show_head=false&limit=100&_w=" + window.screen.width + "&_h=" + window.screen.height;
    showLayer();
    $.ajax({//现在的等待函数
        type: "POST",
        url: url,
        cache: false,
        async: true,
        success: function (result) {
            if (result != "") {
                if (result == "True") {
                    url = '/C3/PC/MAlarmMonitoring/RemoteHandlers/GetMonitorLocoAlarmList.ashx?action=produce&limit=100&' + GetUrlEx()
                    var downloadUrl = "/C3/PC/MAlarmMonitoring/downloadreport.ashx?action=download&limit=100&" + GetUrlEx()
                    planAjax(url, downloadUrl);
                }

            }
        },
        error: function () {
            layer.msg('导出失败！')
        }
    })
}

function exportWord() {
    var txtqz = $('#txtqz').val();
    var positioncode = '';
    if (txtqz != '') {
        positioncode = $('#txtqz').attr('code');//区站
    }
    var url = '/Report/AlarmReport.aspx?' + GetUrlEx() + "&show_head=false&limit=&_w=" + window.screen.width + "&_h=" + window.screen.height + "&positioncode=" + positioncode;
    window.open(url);
};
function exportExcel() {
    var txtqz = $('#txtqz').val();
    var positioncode = '';
    if (txtqz != '') {
        positioncode = $('#txtqz').attr('code');//区站
    }
    var url = '/Report/AlarmExcel.aspx?' + GetUrlEx() + "&_w=" + window.screen.width + "&_h=" + window.screen.height + "&positioncode=" + positioncode;
    window.open(url);
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
//加载工具信息
function GetDrawingManager() {
    var mapStyle = {
        //features: ["road", "building", "water", "land"], //隐藏地图上的poi
        features: ["water", "land"], //隐藏地图上的poi
        style: "normal"  //设置地图风格为高端黑
    }
    map.setMapStyle(mapStyle);
    var overlaycomplete = function (e) {

        if (RECTANGLE_op) {
            console.log(e.overlay.getPath()[0]);
            var point1 = e.overlay.getPath()[0];
            var point2 = e.overlay.getPath()[2];
            $("#txtgis_x1").val(point1.lng);
            $("#txtgis_y1").val(point1.lat);
            $("#txtgis_x2").val(point2.lng);
            $("#txtgis_y2").val(point2.lat);
            //$("#myDiv").show();
            ColseC3AlarmInfo();
            //drawingManager.close();
            if (completeTimer) clearTimeout(completeTimer);
            completeTimer = setTimeout(function () {
                RECTANGLE_op = false;
            }, 300);
        }
        overlays.push(e.overlay);
        drawingManager.close();
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
            anchor: BMAP_ANCHOR_TOP_LEFT,
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

    $('.main .BMapLib_Drawing_panel').html($('.main .BMapLib_Drawing_panel').html() + '<a class="clearbox" href="javascript:void(0)" title="清除框选" onclick="clearRECTANGLE()">清除</a>')
    $('.BMapLib_rectangle').click(function () {
        console.log('开始绘制')
        clearAll();
        RECTANGLE_op = true;
    })
}

//清除更多条件的信息
function ClearQueryC() {
    clearAll();
    $("#startkm,#lineselect,#txtqz,#txtpole,#direction,#endkm,#ddlorg,#hf_ddlorg,#hf_type_ddlorg,#citySel,#txt_fx,#txt_temp_hw1,#txt_temp_hw2,#txt_temp_hj1,#txt_temp_hj2,#txt_bow,#txt_dg1,#txt_dg2,#txt_lc1,#txt_lc2,#txt_speed1,#txt_speed2,#bjbm").val("");
}


//清除区域框
function clearAll() {
    for (var i = 0; i < overlays.length; i++) {
        map.removeOverlay(overlays[i]);
    }
    overlays.length = 0;
    $("#txtgis_x1,#txtgis_y1,#txtgis_x2,#txtgis_y2").val("");
    RECTANGLE_op = false;
};
//清除区域框 文字按钮
function clearRECTANGLE() {
    clearAll();
    setTimeout(function () {
        drawingManager.close();
        if (window.location.href.indexOf('GIS.htm') > -1) {
            $('#btn_query').click();
        }
    }, 100)
    
}

//删除自定义样式弹出框
function ClearAnimateMarker() {
    map.removeOverlay(animateMarker);
    animateMarker = null;
}
