
var _w;
var pagename = 'wu';//乌局专用
$(document).ready(function () {
    $(window).resize(function () {
        changesize();
    });
    changesize();

    $("#alarms").parent().parent().scroll(function () {
        $('.smallBox>.title_bg').css('left', $("#alarms").offset().left)
        //console.log($("#alarms").offset().left)
    })
    $('#lineselect').mySelectTree({
        tag: 'LINE',
        height: 200,
    });
    $('#orgselect').mySelect({
        tag: "Organization",
        code: '',
        type: 'GDD',
    });
    document.getElementById('startdate').value = DateLastWeekTime() + "00:00:00";;
    document.getElementById('enddate').value = ServerTime("0", "0");

    var jsonUser = getCurUser();
    $('#ddlorg').mySelectTree({
        tag: 'ORGANIZATION',
        type: jsonUser.orgcode,
        where_place: 'up',
        _hegiht: "250",
        mis_px: '9',
        onClick: function (event, treeId, treeNode) {
            $("#hf_ddlorg").val(treeNode.id);
            $("#ddlorg").val(treeNode.name);
            $("#hf_type_ddlorg").val(treeNode.treeType);
        }
    });
    //报警类型
    $('#citySel').mySelectTree_Level2({
        isSelectChildren: true,
        height: $(window).height() < 800 ? '350px' : '400px'
    });

    if (FunEnable('Fun_TypicalDefects') == "True") {
        $("#bug_switch").parent().parent().show();
    };



    /// 加载地图信息

    BindMap("qxDiv", getConfig("mapLevel"));
    QueryAlarmInfo(); ///执行查询 (当前JS)
    //分页首页
    $(".page-top").click(function () {
        page = 1;
        QueryAlarmInfo(); ///执行查询 (当前JS)
    });
    //分页上一页
    $(".page-pre").click(function () {
        if (page > 1) {
            page--;
            QueryAlarmInfo(); ///执行查询 (当前JS)
        }
    });
    //分页下一页
    $(".page-nex").click(function () {
        if (page < PageCount) {
            page++;
            QueryAlarmInfo(); ///执行查询 (当前JS)
        }
    });
    //分页尾页
    $(".page-last").click(function () {
        page = PageCount;
        QueryAlarmInfo(); ///执行查询 (当前JS)
    });






    $('#page-numb').bind('keypress', function (event) {
        if (event.keyCode == "13") {
            page = $("#page-numb").val();
            QueryAlarmInfo(); ///执行查询 (当前JS)
        }
    });
    $('#querybtn').click(function () { page = 1; QueryAlarmInfo(); })//查询按钮

    //设置按钮点击事件
    $("#upORdownBtn").toggle(
                function () {
                    $(this).css("transform", "rotate(180deg)");
                    $("#con_one_2_div").animate({ bottom: -$('#con_one_2_div').height() });
                },
                function () {
                    $(this).css("transform", "");
                    $("#con_one_2_div").animate({ bottom: "0" });
                }
            );

    $('#queryList .insideCtrl').toggle(
                function () {
                    $(this).css("transform", "rotate(-90deg)");
                    $("#queryList").animate({ left: -$("#queryList").outerWidth() + 30 });
                },
                function () {
                    $(this).css("transform", "rotate(90deg)");
                    $("#queryList").animate({ left: "0" });
                }
            );






    //翻页按钮鼠标经过变图片
    $(".page-top").children("img").hover(function () {
        $(this).attr("src", "img/gis-img/top-light.png")
    }, function () {
        $(this).attr("src", "img/gis-img/top.png")
    });
    $(".page-pre").children("img").hover(function () {
        $(this).attr("src", "img/gis-img/pre-light.png")
    }, function () {
        $(this).attr("src", "img/gis-img/pre.png")
    });
    $(".page-nex").children("img").hover(function () {
        $(this).attr("src", "img/gis-img/nex-light.png")
    }, function () {
        $(this).attr("src", "img/gis-img/nex.png")
    });
    $(".page-last").children("img").hover(function () {
        $(this).attr("src", "img/gis-img/last-light.png")
    }, function () {
        $(this).attr("src", "img/gis-img/last.png")
    });


});

//设置尺寸
function changesize() {
    $('#box2_1').css('width', '100%');
    $('#box1_1').css({ 'left': $(window).width() - $('#box1_1').width() });
    $('.page').css({ 'right': ($(window).width() - 500) / 2, '': '' });
    $('#upORdownBtn').parent().css('left', ($(window).width() - $('#upORdownBtn').parent().width()) / 2)
    //加载完成后弹出信息框
    $("#con_one_2_div").width($(window).width()).height($(document.body).height() / 3);
    $("#con_one_2_div").fadeIn();

    $('#box1_1').show();
    $('#box1_1').css({ 'top': '', 'bottom': $('#con_one_2_div').height() + 1 });
    $('#alarms').parent().css({ 'height': $("#con_one_2_div").height() - $('.listTitle').outerHeight() - $('.title_bg').outerHeight() - $('.page').outerHeight() - 25, 'width': $('.title_bg').width() });
    $('.page').css('bottom', '3px');
    //$('#queryList').css({ 'bottom': $('#con_one_2_div').height() + $('.listTitle').outerHeight() })
    var _h = (parseInt($(window).height())) / 4;
    _w = parseInt($(window).width()) / 4;

    var _Divh = (parseInt($(document.body).height()));
    var _Divw = parseInt($(window).width());
    $("#qxDiv").width(_Divw).height(_Divh);
}

///设置分页显示
function SetPage() {

    PageCount = parseInt(PageAlarmJson.total / pagesize);
    if (PageAlarmJson.total % pagesize > 0) {
        PageCount++;
    }
    if (PageAlarmJson.total == "0") {
        page = 1;
        PageCount = 1;
    }
    $("#page-numb").val(page);
    $("#pageCount").html(PageCount);
    $("#Count").html(PageAlarmJson.total);
    var PageSizeCount = (page * pagesize) - ((page - 1) * pagesize);
    if (page * pagesize > PageAlarmJson.total) {
        PageSizeCount = PageAlarmJson.total - ((page - 1) * pagesize);
    }
    $("#PageSize").html(PageSizeCount);
}

var jbJson = []; //缺陷级别CODE数组
//设置图例数量
function SetAlarmNumber() {
    for (var i = 0; i < jbJson.length; i++) {
        $("#number" + (i + 1)).html(jbJson[i].count);
    }
    //    $("#one_number").html(One_number);
    //    $("#two_number").html(Two_number);
    //    $("#three_number").html(Three_number);
    //$("#wc_number").html(wc_number);

    $("#new_number").text(new_number);
    $("#sure_number").text(sure_number);
    $("#plan_number").text(plan_number);
    $("#check_number").text(check_number);
    $("#close_number").text(close_number);
    $("#cancel_number").text(cancel_number);


}
///根据图例设置告警在地图上的显示或隐藏（级别的一类二类三类）
function ChangeLevel_Status() {

    var json = GetSeverityJson(); //缺陷级别集合
    for (var i = 0; i < json.length; i++) {
        jbJson.push({});
        jbJson[i].code = json[i].code;
        jbJson[i].count = 0;
    }

    var cb_type1 = $("#cb_type1").is(':checked');
    var cb_type2 = $("#cb_type2").is(':checked');
    var cb_type3 = $("#cb_type3").is(':checked');

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

    IDs_show = '';
    IDs_hide = '';

    var overlays = map.getOverlays();
    for (var i = 0; i < overlays.length; i++) {
        var m = overlays[i];

        if (m.type != "Alarm") continue;


        //遍历报警级别
        for (var j = 0; j < jbJson.length; j++) {
            if (m.alarmJson && jbJson[j].code == m.alarmJson.SEVERITY_CODE) {
                jbJson[j].count = jbJson[j].count + 1;
                if ($("#ImgTypeBox :checkbox[code='" + jbJson[j].code + "']").is(':checked')) {
                    ChangeLevel_Status_StatusCreate(m);
                }
                else {
                    m.hide();
                }
                break;
            }
        }



    }
    GetList();
    SetAlarmNumber();
}


///根据图例设置告警在地图上的显示或隐藏（状态的新上报、已确认等）
function ChangeLevel_Status_StatusCreate(m) {

    var cb_new = $("#cb_new").is(':checked');
    var cb_sure = $("#cb_sure").is(':checked');
    var cb_plan = $("#cb_plan").is(':checked');
    var cb_check = $("#cb_check").is(':checked');
    var cb_close = $("#cb_close").is(':checked');
    var cb_cancel = $("#cb_cancel").is(':checked');

    var _isShow = false;



    m.show();
    //$("#iframe_alarm").contents()[0].defaultView.showItem(m.json.ALARM_ID, true);


    if (m.type == "Alarm" && m.alarmJson.STATUS == "AFSTATUS01") {
        new_number++;
        if (cb_new) {
            _isShow = true;
        }
    }

    if (m.type == "Alarm" && m.alarmJson.STATUS == "AFSTATUS03") {
        sure_number++;
        if (cb_sure) {
            _isShow = true;
        }
    }

    if (m.type == "Alarm" && m.alarmJson.STATUS == "AFSTATUS04") {
        plan_number++;
        if (cb_plan) {
            _isShow = true;
        }
    }

    if (m.type == "Alarm" && m.alarmJson.STATUS == "AFSTATUS07") {
        check_number++;
        if (cb_check) {
            _isShow = true;
        }
    }

    if (m.type == "Alarm" && m.alarmJson.STATUS == "AFSTATUS05") {
        close_number++;
        if (cb_close) {
            _isShow = true;
        }
    }
    if (m.type == "Alarm" && m.alarmJson.STATUS == "AFSTATUS02") {
        cancel_number++;
        if (cb_cancel) {
            _isShow = true;
        }
    }

    if (_isShow) {
        m.show();

        if (IDs_show == '') {
            IDs_show = "#" + m.alarmJson.ALARM_ID;
        }
        else {
            IDs_show += ",#" + m.alarmJson.ALARM_ID;
        }

        // $("#iframe_alarm").contents()[0].defaultView.showItem(m.json.ALARM_ID, true);
    }
    else {
        m.hide();
        //  $("#iframe_alarm").contents()[0].defaultView.showItem(m.json.ALARM_ID, false);
    }


    // $("#iframe_alarm").contents()[0].defaultView.GetList();

}

///加载列表数据
function GetList() {


    var alarmsJSON = PageAlarmJson.rows;


    var result = '';

    for (var i = 0; i < alarmsJSON.length; i++) {



        var m = alarmsJSON[i];

        if (m.GIS_X == 0) continue;


        result += "<div class='alarmItem' c_code='" + m.CATEGORY_CODE + "' id='" + m.ALARM_ID + "' status='" + m.CODE_NAME + "'>\
  <div class='m_type_t d'  title='" + m.wz + "'>" + m.wz + "</div>\
    <div class='m_mapInfo d'  title='" + m.RAISED_TIME + "'>" + m.RAISED_TIME + "</div>\
    <div class='m_level  d'  title='" + m.SEVERITY + "'>" + m.SEVERITY + "</div>\
    <div class='m_level d' title='" + m.STATUS_NAME + "'>" + m.STATUS_NAME + "</div>\
    <div class='m_level d' title='" + m.CODE_NAME + "'>" + m.CODE_NAME + "</div>\
    <div class='m_locaNo d' title='" + m.DETECT_DEVICE_CODE + "'>" + m.DETECT_DEVICE_CODE + "</div>\
    <div class='m_memo d' style='display:none' data-toggle='tooltip' title='" + m.Summary + "'>" + m.Summary + "</div>\
    <div class='cls'></div>\
    <div style='display:none' class='m_task d' title='" + m.taskName + "'>" + m.taskName + "</div>\
</div>";
    }

    $('#alarms').html(result);

    $('.alarmItem').click(function () {
        var _id = $(this).attr('id');
        clickListRow(_id);
    });
    $('.alarmItem').dblclick(function () {
        var _alarmid = $(this).attr('id');
        if ($(this).attr('c_code') == '3C') {
            window.open('/C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=' + _alarmid + "&v=" + version);
        }
    })
}

//列表点击
function clickListRow(ALARM_ID) {

    SetAlarmGISJump(ALARM_ID);//跳動dian
    $('#alarms>div').removeClass('alarmItem_over');
    $('#' + ALARM_ID).addClass('alarmItem_over');
    SetTopNew(ALARM_ID);//列表滚动   
}

function SetTopNew(_alarmID) {
    $("#alarms").parent().parent().animate({ scrollTop: $("#" + _alarmID)[0].offsetTop - 80 }, 500);
}
//选择告警 地图点 跳動
function SetAlarmGISJump(alarmID) {
    var re = '';
    var overlays = map.getOverlays();
    //	alert(overlays.length);
    for (var i = 0; i < overlays.length; i++) {

        var m = overlays[i];
        //   re += "<br/>" + m.at;
        //	alert(m.at);
        if (m.type == "Alarm" && m.alarmJson.ID == alarmID || m.type == "WC" && m.alarmJson.ID == alarmID) {
            layer.closeAll();
            var p = m.getPosition();
            map.setCenter(p);
            if (oldp != null) {
                oldp.setAnimation(null);
            }
            m.setAnimation(BMAP_ANIMATION_BOUNCE);
            oldp = m;//計入上一個點  全局參數 在MapAlarm.js
            break;

        } else if (i == overlays.length - 1) {
            layer.msg('该数据无坐标信息！')
        }
    }


};



//获取级别
function getSelectedJB(obj) {
    var slct = "";
    for (var i = 0; i < obj.options.length; i++)
        if (obj.options[i].selected == true) {
            slct += obj.options[i].value;
        };
    return slct;
}

//图像URL
function getIcoUrlWu(m) {
    //ico生成。
    var icoUrl = '/Common/MGIS/img/StatusLevel.png';
    switch (m.PROCESS_STATUS) {
        case '未销号':
            //   new_number++;
            icoUrl = icoUrl.replace('Status', 'notyet');
            break;
        case '已销号':
            //  sure_number++;
            icoUrl = icoUrl.replace('Status', 'already');
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
        case '一级':
            //    One_number++;
            icoUrl = icoUrl.replace('Level', '1');
            break;
        case '二级':
            //  Two_number++;
            icoUrl = icoUrl.replace('Level', '2');
            break;
        case '三级':
            //  Three_number++;
            icoUrl = icoUrl.replace('Level', '3');
            break;
    }
    return icoUrl;
}
///获取告警信息并加载
function queryLongList() {


    getlonglistJson(); //当前JS  (包含分页信息)

};

//列表加载
function setListHtml(alarmsJSON) {


    var result = '';

    for (var i = 0; i < alarmsJSON.length; i++) {



        var m = alarmsJSON[i];
        var colorStyle = '';
        if (m.REPORT_OVERDUE != '') {
            colorStyle = 'redOne';
        }
        if (m.PROCESS_OVERDUE != '') {
            colorStyle = 'yellowOne';
        }
        //if (m.GIS_X == 0) continue;

        var wz = m.LINE_NAME + '&nbsp;' + m.POSITION_NAME + '&nbsp;' + m.DIRECTION + '&nbsp;' + m.KM_MARK + '&nbsp;' + (m.POLE_NUMBER == '' ? '' : (m.POLE_NUMBER + '号'));
        var peopleJu = m.REPORT_DEPTNAME == '' ? (m.REPORT_PERSON + '') : (m.REPORT_PERSON + '(' + m.REPORT_DEPTNAME + ')');
        var REPORT_DATE = (m.REPORT_DATE == '0001/1/1 0:00:00' || m.REPORT_DATE == '01-1月 -01' ? '&nbsp;' : m.REPORT_DATE);
        console.log(m.fj);
        try {
            m.fj = m.fj.replace(/;/g, '')
            var fjtype = m.fj.split('.')[m.fj.split('.').length - 1];
            console.log(fjtype);
            if (fjtype == 'png' || fjtype == 'jpg' || fjtype == 'jpeg' || fjtype == 'JPG' || fjtype == 'JPEG') {
                var fj = "  <div class='cl_120 d fujianShowIMG' imgsrc='" + m.fj + "'  title='" + '点击查看图片' + "'>" + '查看图片' + "</div>"
            } else if (fjtype == 'xls' || fjtype == 'xlsx' || fjtype == 'xlsm' || fjtype == 'docx' || fjtype == 'doc' || fjtype == 'XLS' || fjtype == 'XLSX' || fjtype == 'XLSM' || fjtype == 'DOCX' || fjtype == 'DOC') {
                var fj = "  <div class='cl_120 d fujianDown' title='" + '点击下载附件' + "'><a href='" + m.fj + "' target ='_blank'>附件下载</a></div>"
            } else {
                var fj = "  <div class='cl_120 d fujianDown' title='" + '暂无附件' + "'><a href='' target ='_blank'></a></div>"
            }
        } catch (e) {
            var fj = "  <div class='cl_120 d fujianDown' title='" + '暂无附件' + "'><a href='' target ='_blank'></a></div>"
        }
        var showbox = '查看详情'
        //if( m.SEVERITY_NAME=='一级'||m.SEVERITY_NAME=='一类'){
        //    showbox='查看详情'
        //}

        result += "<div class='alarmItem title_bg " + colorStyle + "' c_code='" + m.CATEGORY_CODE + "' id='" + m.ID + "' status='" + m.CODE_NAME + "' >"
        +
        "  <div class='cl_120 d fujianDown' rowid='" + m.ID + "' data-toggle='modal' data-target='#myshowListbox1' onclick='LoadShowListBox(this)'><a href='JavaScript:0' >" + showbox + "</a></div>" +
    "<div class='cl_120 d'  title='" + m.CATEGORY_CODE + "'>" + m.CATEGORY_CODE + "</div>\
    <div class='cl_170  d'  title='" + m.RAISED_TIME + "'>" + (m.RAISED_TIME == '0001/1/1 0:00:00' || m.RAISED_TIME == '01-1月 -01' ? '&nbsp;' : m.RAISED_TIME) + "</div>\
    <div class='cl_365 d' title='" + wz + "'>" + wz + "</div>\
    <div class='cl_170 d' title='" + REPORT_DATE + "'>" + REPORT_DATE + "</div>\
    <div class='cl_170 d' title='" + peopleJu + "'>" + peopleJu + "</div>\
    <div class='cl_170 d' title='" + m.DEV_NAME + "'>" + m.DEV_NAME + "</div>\
    <div class='cl_130 d' title='" + (m.SEVERITY_NAME != undefined ? m.SEVERITY_NAME : '') + "'>" + (m.SEVERITY_NAME != undefined ? m.SEVERITY_NAME : '') + "</div>\
    <div class='cl_220 d' title='" + m.DETAIL + "'>" + m.DETAIL + "</div>\
    <div class='cl_140 d' title='" + m.CODE_NAME + "'>" + m.CODE_NAME + "</div>\
    <div class='cl_160 d' title='" + m.PROCESS_DEPTNAME + "'>" + m.PROCESS_DEPTNAME + "</div>\
    <div class='cl_170 d' title='" + m.PROCESS_DATE + "'>" + (m.PROCESS_DATE == '01-1月 -01' || m.PROCESS_DATE == '0001/1/1 0:00:00' ? '&nbsp;' : m.PROCESS_DATE) + "</div>\
    <div class='cl_120 d' title='" + m.PROCESS_PERSON + "'>" + m.PROCESS_PERSON + "</div>\
    <div class='cl_120 d' title='" + m.PROCESS_STATUS + "'>" + m.PROCESS_STATUS + "</div>\
    <div class='cls'></div>\
</div>";
    }
    $('#alarms').css('height', alarmsJSON.length * 36)
    $('#alarms').html(result);


    $('.fujianDown').click(function (e) {
        e.stopPropagation();

    })


    $('.alarmItem').click(function () {
        var _id = $(this).attr('id');
        clickListRow(_id);
    });
    //$('.alarmItem').dblclick(function () {
    //    var _alarmid = $(this).attr('id');
    //    if ($(this).attr('c_code') == '3C') {
    //        window.open('/C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=' + _alarmid + "&v=" + version);
    //    }
    //})

}

//地图点击事件
function getMapAlarmClick(e) {
    var m = this.alarmJson;
    clickListRow(m.ID, m.CATEGORY_CODE);//列表某行
}

//转换㎞mark
function getKmmark_w(str) {
    if (str != '') {
        return parseInt(parseFloat(str) * 1000);
    } else {
        return '';
    }

}

//获取页面所需json
function getlonglistJson() {
    var category_code = '';//设备类型
    if ($('#category_code').attr('code') != undefined) {
        category_code = $('#category_code').attr('code');
    }
    var orgselect = $('#orgselect').val();//段
    if (orgselect == undefined || orgselect == 0) {
        orgselect = '';
    }
    //var lineselect = $('#lineselect').attr('code');//线
    var lineselect = $('#lineselect').val();//线
    if (lineselect == undefined) {
        lineselect = '';
    }
    var direction = $('#direction').val();//行别
    if (direction == '0') { direction = ''; }
    var PROCESS_STATUS = $('#PROCESS_STATUS').val();//处理状态
    if (PROCESS_STATUS == '0') { PROCESS_STATUS = ''; }
    var startkm = getKmmark_w(document.getElementById('startKm').value); //开始
    var endkm = getKmmark_w(document.getElementById('endKm').value); //结束公里标
    var OverdueType = $('#overdue').val();//分析处理过期  
    var startdate = document.getElementById('startdate').value; //时间
    var enddate = document.getElementById('enddate').value; //结束日期
    var obj = document.getElementById('jb'); //级别
    var jb = getSelectedItem(obj);
    //console.log(orgselect, lineselect, direction, PROCESS_STATUS, startkm, endkm, OverdueType, startdate)
    url = '/Common/DPCExcelAlarm/RemoteHandlers/GetExcelAlarmList.ashx?type=all'
    + '&CATEGORY_CODE=' + escape($('#category_code').val())
    + '&POWER_SECTION_CODE=' + orgselect
    + '&LINE_NAME=' + lineselect
    + '&DIRECTION=' + direction
    + '&PROCESS_STATUS=' + PROCESS_STATUS
    + '&START_KM=' + startkm
    + '&END_KM=' + endkm
    + '&START_DATE=' + startdate
    + '&END_DATE=' + enddate
    + '&REPORT_PROCESS=' + OverdueType
    + '&SEVERITY=' + jb
    + '&page=' + page
    + '&rp=' + pagesize
    + '&temp=' + Math.random();


    var json;
    $.ajax({
        type: "POST",
        url: url,
        async: true,
        beforeSend: function () {
            layer.load(1, {
                shade: [0.5, '#fff'] //0.1透明度的白色背景
            });
        },
        cache: false,
        success: function (result) {
            layer.closeAll();
            var markers = [];
            if (result != "") {
                try { PageAlarmJson = eval('(' + result + ')'); } catch (e) {
                    layer.msg('数据转换失败！');
                    $('#alarms').html('<span style="color:white;font-size:20px;font-weight:bold;float: left;margin:' + $('#alarms').parent().height() / 2 + 'px 0 0 ' + $(window).width() / 2 + 'px;">数据转换失败！</span>').css('height', 4 * 36);
                    return
                }
                try {
                    var alarmJson = PageAlarmJson.rows;      //只含缺陷详情JSON
                } catch (e) {
                    $('#alarms').html('<span style="color:white;font-size:20px;font-weight:bold;float: left;margin:' + $('#alarms').parent().height() / 2 + 'px 0 0 ' + $(window).width() / 2 + 'px;">暂无数据！</span>').css('height', 4 * 36);
                    layer.closeAll();
                    return
                }
                if (alarmJson != undefined && alarmJson.length > 0) {
                    setListHtml(alarmJson)//列表 html
                    var _time = 0;
                    for (var i = 0; i < alarmJson.length; i++) {
                        if (alarmJson[i].GIS_X != '' && alarmJson[i].SEVERITY_CODE != '' && alarmJson[i].GIS_X != '0' && alarmJson[i].GIS_Y != '0') {
                            _time++;

                            var m = alarmJson[i];
                            var icoUrl = getIcoUrlWu(m); //当前.js
                            var Point = new BMap.Point(m.GIS_X, m.GIS_Y);
                            if (_time == 1) {
                                var p = {
                                    lat: 43.212337,
                                    lng: 88.540477
                                }
                                map.setCenter(Point);
                            }
                            markers.push(new BMap.Marker(Point));
                            var icon = new BMap.Icon(icoUrl, new BMap.Size(Ico_alarm_width, Ico_alarm_heigth));

                            var marker = new BMap.Marker(Point, { icon: icon });
                            //marker.setLabel(labelMark);
                            map.addOverlay(marker);
                            marker.disableDragging(true);
                            marker.alarmJson = m;
                            marker.type = "Alarm";
                            marker.id = m.ID;
                            marker.addEventListener("click", getMapAlarmClick); //单击 当前JS
                            //marker.addEventListener("dblclick", getC3AlarmdbClick); //双击 当前JS

                            marker.setOffset(new BMap.Size(Ico_alarm_left, Ico_alarm_top));
                            marker.setZIndex(10);
                            var opts = {
                                position: Point,    // 指定文本标注所在的地理位置
                                offset: new BMap.Size(-6, -16)    //设置文本偏移量
                            }
                        }
                    }

                } else {
                    $("#alarms").parent().parent().animate({ scrollTop: 0 }, 10);
                    $('#alarms').html('<span style="color:white;font-size:20px;font-weight:bold;float: left;margin:' + $('#alarms').parent().height() / 2 + 'px 0 0 ' + $(window).width() / 2 + 'px;">暂无数据！</span>').css('height', 4 * 36);
                }
                //layer.closeAll();
                SetPage();//分页



                map.json = alarmJson;
            }
        }, error: function () {
            layer.closeAll();
            $('#alarms').html('<span style="color:white;font-size:20px;font-weight:bold;float: left;margin:' + $('#alarms').parent().height() / 2 + 'px 0 0 ' + $(window).width() / 2 + 'px;">查询失败！</span>').css('height', 4 * 36);
        }
    });
    return json;
};


//查询告警
function QueryAlarmInfo() {
    if ($("#Form1").validationEngine({
        validationEventTriggers: "blur",  //触发的事件  "keyup blur",   
        scroll: false
    }) && $("#Form1").validationEngine('validate')) {
        RemoveAlarmMaker();   //删除地图告警对象
        queryLongList();           //根据分页获取告警列表信息（在当前js）
    }
}
//删除地图告警对象
function RemoveAlarmMaker() {
    for (var i = 0; i < map.getOverlays().length; i++) {
        var m = map.getOverlays()[i];
        if (m.type == "Alarm") {
            map.removeOverlay(m);
            i--;
        }
    }
}

//弹出模态
function ShowMTwin(str, w, h) {
    $("#tanchu").attr("href", str + "&lightbox[iframe]=true&lightbox[width]=" + w + "p&lightbox[height]=" + h + "p");
    $("#tanchu").click();
}

//线路改变
function lineChange(pcode) {
    $('#txtqz').jHint({
        type: 'StationSection',
        line: pcode
    });
};

//关闭告警信息框（红外、高清和曲线）
function ColseC3AlarmInfo() {
    $("#C3Alarm").animate({ "right": -(_w + 25) + 'px' });
    if (oldp != null)
        oldp.setAnimation(null);
    ClearAnimateMarker();
}


function ShowAllImg1() {
    if ($("#wdqx").is(":visible")) {
        allimgck_show();
    }
    else {
        allimgck();
    }
};

//获取选中项
function getSelectedItem(obj) {
    var slct = "";
    for (var i = 0; i < obj.options.length; i++)
        if (obj.options[i].selected == true) {
            slct += ',' + obj.options[i].value;
        }
    return slct.substring(1);
};