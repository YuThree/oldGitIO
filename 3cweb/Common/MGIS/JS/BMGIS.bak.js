var json_dicLevel;
var _w
$(document).ready(function () {
    var category = GetQueryString('Category_Code')//获取打开位置
    var V_CateGory = '';
    if (category != 'DPC' && category != '' && category != undefined) {
        V_CateGory = category;
        $('#dll_lx').val(category).attr("code", category)//选中检测类型
        $('#dll_lx').parent().hide();//隐藏检测类型
    }
    $("#ImgTypeBox").html(GetSeverityLegend(15, 15, true, "123")); //加载图例

    json_dicLevel = GetSeverityJson();
    var _h = (parseInt($(window).height())) / 4;
    _w = parseInt($(window).width()) / 4;

    // $("#kjg").elevateZoom({ zoomWindowPosition: 01, zoomWindowWidth: 0, zoomWindowHeight: 0 });
    var _Divh = (parseInt($(window).height()));
    var _Divw = parseInt($(window).width());
    $("#qxDiv").width(_Divw + 20).height(_Divh);

    //$("#C3Alarm").width(_Divw / 4).height(_Divh);

    //$("#C3Alarm_1").width(_w).height(_h);
    $("#C3Alarm").css('right', -_w);
    $("#C3Alarm_2").width(_w).height(_h);
    $("#C3Alarm_3").width(_w).height(_h);
    $("#C3Alarm_4").width(_w).height(_h);
    $("#linechart,#lc_chart,#dg_chart").width(_w).height(_h);
    $("#allimg_box").width(_w).height(_h);

    $('#lineselect').mySelect({
        tag: 'LINE'
    });
    document.getElementById('startdate').value = DateLastWeekTime() + "00:00:00";
    document.getElementById('enddate').value = ServerTime("0", "0");

    ////缺陷级别下拉列表
    //$('#jb').mySelect({
    //    tag: 'SYSDICTIONARY',
    //    code: 'SEVERITY'
    //});

    //下拉选择控件
    $('#txtloccode').LocoSelect({
        position: 'MonitorLocoAlarmList'
    });

    //设备编号控件
    $('#txtloccode').inputSelect({
        type: 'loca',
        contant: 2
    });



    ////区站选择控件

    if (getConfig('For6C') == 'DPC') {
        $('#txtqz').jHint({
            type: 'StationSection',
            listContainerCSSName: 'listContainerWhite',
            line: '',
            isStartEnd: true,
            clo: '2',
            //fixed:'true'
        });
    } else {
        $('#txtqz').inputSelect({
            type: 'StationSection',
            contant: 1
        });
    }



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
        codeType: V_CateGory,
        cateGory: 'AFCODE',
        //isSelectChildren: true,
        height: $(window).height() < 800 ? '350px' : '400px'
    });

    if (FunEnable('Fun_TypicalDefects') == "True") {
        $("#bug_switch").parent().parent().show();
    };


    //图例单击事件
    $('#cb_type1,#cb_type2,#cb_type3,#cb_new,#cb_sure,#cb_plan,#cb_check,#cb_close,#cb_cancel').click(function () {
        ChangeLevel_Status();
        changeRowNumber()
    })

    //查询
    $('#btn_query').click(function () {
        page = 1;
        QueryAlarmInfo();
    })
    /// 加载地图信息
    var smapLevel = getConfig('mapLevel'); //获取地图初始加载层次；
    if (smapLevel == undefined || smapLevel == '') {
        smapLevel = 7;
    }
    BindMap("qxDiv", smapLevel);
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
    $("#btn_remove").click(function () {
        ClearQueryC();
    });

    //加载完成后弹出信息框
    $("#con_one_2_div").width($(window).width()).height($(window).height() / 4);
    $("#con_one_2_div").fadeIn();

    $('#box1_1').show();
    if (getConfig('debug') === '1' && FunEnable('Fun_PassTrain') == 'True') { //内部版显示途经车辆功能时，设置图例的位置，正确设置是getConfig('debug') === '1'
        if ($(window).width() < 1920) {
            $('#box1_1').css({ 'top': '', 'bottom': $('#con_one_2_div').height() + 55 });
        } else {
            $('#box1_1').css({ 'top': '', 'bottom': $('#con_one_2_div').height() + 55 });
        }
    } else {
        if ($(window).width() < 1920) {
            $('#box1_1').css({ 'top': '', 'bottom': $('#con_one_2_div').height() });
        } else {
            $('#box1_1').css({ 'top': '', 'bottom': $('#con_one_2_div').height() });
        }
    }


    //设置右边图片div高度
    var _height = parseInt(($(window).height() - $('#con_one_2_div').height()) / 3);
    $("#C3Alarm_2").height(_height);
    $("#C3Alarm_3").height(_height);
    $("#C3Alarm_4").height(_height);
    $("#linechart,#lc_chart,#dg_chart").height(_height);
    $("#allimg").height(_height);

    $(window).resize(function () {
        var _height = parseInt(($(window).height() - $('#con_one_2_div').height()) / 3);
        $("#C3Alarm_2").height(_height);
        $("#C3Alarm_3").height(_height);
        $("#C3Alarm_4").height(_height);
        $("#linechart,#lc_chart,#dg_chart").height(_height);
        $("#allimg").height(_height);
        var _H = $('.boxTitle').parent().height();
        var _W = $('.boxTitle').parent().width();
        var fz = $('.boxTitle').parent().height() * 0.07104;
        $('.boxTitle').width(_W / 15).height(_H).css("font-size", fz + "px");
        var Margin = ($('.boxTitle').height() - $(".fg_white").height()) / 2;
        $(".fg_white").css("marginTop", Margin);
        $('#box1_1').css('top', $(window).height() / 2);
    })
    $('#page-numb').bind('keypress', function (event) {
        if (event.keyCode == "13") {
            page = $("#page-numb").val();
            QueryAlarmInfo(); ///执行查询 (当前JS)
        }
    });

    //设置右边三个播放DIV文字的居中
    var _H = $('.boxTitle').parent().height();
    var _W = $('.boxTitle').parent().width();
    var fz = $('.boxTitle').parent().height() * 0.07104;

    $('.boxTitle').width(_W / 15).height(_H).css("font-size", fz + "px");

    $("#linechart,#lc_chart,#dg_chart").width(_w - $('.boxTitle').width()).css('marginLeft', $(".boxTitle").width());
    //设置按钮点击事件
    if (getConfig('debug') === '1' && FunEnable('Fun_PassTrain') == 'True') { //内部版显示途经车辆功能时，设置按钮的事件，正确设置是getConfig('debug') === '1'
        $("#upORdownBtn").toggle(
            function () {
                $(this).css("transform", "rotate(180deg)").css('bottom', '28px');
                $("#con_one_2_div").animate({ bottom: -$('#con_one_2_div').height() });
                $('.control-btn').show();
                $('.j-list').css({ 'display': "none" });
            },
            function () {
                $(this).css("transform", "").css('bottom', '0px');
                $("#con_one_2_div").animate({ bottom: "0" });
                $('.control-btn').hide();
                $('.j-list').css({ 'display': "inline-block" });
            });
    } else {
        $("#upORdownBtn").toggle(
                function () {
                    $(this).css("transform", "rotate(180deg)");
                    $("#con_one_2_div").animate({ bottom: -$('#con_one_2_div').height() });
                },
                function () {
                    $(this).css("transform", "");
                    $("#con_one_2_div").animate({ bottom: "0" });
                }
            )
    }

    //设置高级查询的位置
    $("#myDiv").css("bottom", _h)

    $("#btn_reset").click(function () {
        $("#myDiv").fadeOut();
    });
    $("#btn_openSearch").click(function () {
        $("#myDiv").fadeToggle('slow');
        //$("#C3Alarm").hide();
        $("#C3Alarm").animate({ "right": -(_w + 25) + 'px' });
    });
    $("#btn_openSearch").hover(function () {
        $(this).attr("src", "img/gis-img/more-light.png")
    }, function () {
        $(this).attr("src", "img/gis-img/more.png")
    });
    $("#btn_query").hover(function () {
        $(this).attr("src", "img/gis-img/newsearch-light.png")
    }, function () {
        $(this).attr("src", "img/gis-img/newsearch.png")
    });
    $("#btn_query_train").hover(function () {
        $(this).attr("src", "img/gis-img/newsearch-light.png")
    }, function () {
        $(this).attr("src", "img/gis-img/newsearch.png")
    });
    $("#btn_colse").hover(function () {
        $(this).attr("src", "img/gis-img/close-light.png")
    }, function () {
        $(this).attr("src", "img/gis-img/close.png")
    });
    $("#ExportReport").hover(function () {
        $(this).attr("src", "img/gis-img/ExportReport-light.png")
    }, function () {
        $(this).attr("src", "img/gis-img/ExportReport.png")
    });
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
    $('.BMapLib_last').attr('title', "框选查询告警区域");
    $('#btn_reset').hover(function () {
        $(this).attr("src", "img/gis-img/guanbi-light.png")
    }, function () {
        $(this).attr("src", "img/gis-img/guanbi.png")
    });

    $("#ExportReport").click(function (e) {
        $('.Report-menu').toggle();
        e.stopPropagation();
    });
    $(document).click(function () {
        $('.Report-menu').hide();
    });
    $('.Report-menu').click(function (e) {
        e.stopPropagation();
    })

    eventTrain(); //途经车辆事件

    if (getConfig('debug') === '1' && FunEnable('Fun_PassTrain') == 'True') { //内部版显示途经车辆功能，需初始化途经车辆查询条件、选项卡切换、途经车辆事件，正确设置是getConfig('debug') === '1'
        document.getElementById('sdate').value = DateLastWeekTime() + "00:00:00";;
        document.getElementById('edate').value = ServerTime("0", "0");
        $('.control-btn').css('display', 'none'); //控制按钮

        //选项卡切换
        $('.j-list').click(function () {
            var _this = $(this);
            var i = _this.index(); //下标第一种写法
            _this.addClass('list-active').siblings().removeClass('list-active'); //选项卡
            $('.list').eq(i).removeClass('hide').siblings('.list').addClass('hide'); //列表
            $('.box3_1_title').eq(i).show().siblings('.box3_1_title').hide(); //条件标题
            $('.search-condi').eq(i).show().siblings('.search-condi').hide(); //条件
            $('.btn-query').eq(i).show().siblings('.btn-query').hide(); //按钮
            if (_this.hasClass('alarm-list')) { //报警列表
                _this.find('img').attr('src', 'img/gis-img/alarm_list_select.png');

                /// 加载地图信息
                BindMap("qxDiv", 7);
                QueryAlarmInfo(); ///执行查询 (当前JS)
                layer.closeAll();

            } else { //途经车辆
                _this.find('img').attr('src', 'img/gis-img/train_tujing_select.png');

                // 加载地图信息
                BindMap("qxDiv", 7);
                //QueryTrainInfo(); ///执行查询 (当前JS)
                ColseC3AlarmInfo(); //关闭报警信息
                layer.msg('请在地图上框选范围');

            }
        });
    } else {
        $('.train-list').css('display', 'none'); //途经车辆
        $('.alarm-list').css({ //报警列表
            'top': '0',
            'left': '0',
            'font-size': '15px',
            'font-weight': 'bold',
            'letter-spacing': '2px',
            'border': 'none',
            'background-color': 'transparent',
        }).removeClass('list-active');
        $('#upORdownBtn').css('top', '-26px'); //控制按钮
    }

});

//途经车辆事件
function eventTrain() {
    //查询
    $('#btn_query_train').click(function () {
        page_train = 1;
        QueryTrainInfo();
    });
    //分页首页
    $(".j-train-page-top").click(function () {
        page_train = 1;
        QueryTrainInfo(); ///执行查询 (当前JS)
    });
    //分页上一页
    $(".j-train-page-pre").click(function () {
        if (page_train > 1) {
            page_train--;
            QueryTrainInfo(); ///执行查询 (当前JS)
        } else {
            layer.msg('无数据');
        }
    });
    //分页下一页
    $(".j-train-page-nex").click(function () {
        if (page_train < PageCount_train) {
            page_train++;
            QueryTrainInfo(); ///执行查询 (当前JS)
        } else {
            layer.msg('无数据');
        }
    });
    //分页尾页
    $(".j-train-page-last").click(function () {
        page_train = PageCount_train;
        QueryTrainInfo(); ///执行查询 (当前JS)
    });
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

///设置途经车辆分页显示
function SetPageTrain() {

    PageCount_train = parseInt(PageTrainJson.total / pagesize_train);
    if (PageTrainJson.total % pagesize_train > 0) {
        PageCount_train++;
    }
    if (PageTrainJson.total == "0") {
        page_train = 1;
        PageCount_train = 1;
    }
    $("#page-numb-train").val(page_train);
    $("#pageCount-train").html(PageCount_train);
    $("#Count-train").html(PageTrainJson.total);
    var PageSizeCount_train = (page_train * pagesize_train) - ((page_train - 1) * pagesize_train);
    if (page_train * pagesize_train > PageTrainJson.total) {
        PageSizeCount_train = PageTrainJson.total - ((page_train - 1) * pagesize_train);
    }
    $("#PageSize-train").html(PageSizeCount_train);
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
    //$('#cb_type3').parent().hide();

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


        //        var levelName = GetSeverityCode2(m.alarmJson.SEVERITY, json_dicLevel);
        //        if (m.type == "Alarm" && levelName == "一类") {
        //            One_number++;

        //            if (cb_type1) {
        //                ChangeLevel_Status_StatusCreate(m);
        //            }
        //            else {
        //                m.hide();
        //            }




        //        }

        //        if (m.type == "Alarm" && levelName == "二类") {
        //            Two_number++;

        //            if (cb_type2) {
        //                ChangeLevel_Status_StatusCreate(m);
        //            } else {
        //                m.hide();
        //            }
        //        }

        //        if (m.type == "Alarm" && levelName == "三类") {
        //            Three_number++;

        //            if (cb_type3) {
        //                ChangeLevel_Status_StatusCreate(m);
        //            } else {
        //                m.hide();
        //            }
        //        }

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


        var displayStr = "";
        //    var IScheckWC = ("#cb_type4").is(':checked');
        var IscheckType1 = $("#cb_type1").is(':checked');
        var IscheckType2 = $("#cb_type2").is(':checked');
        var IscheckType3 = $("#cb_type3").is(':checked');

        var Ischeck_new = $("#cb_new").is(':checked');
        var Ischeck_sure = $("#cb_sure").is(':checked');
        var Ischeck_plan = $("#cb_plan").is(':checked');
        var Ischeck_check = $("#cb_check").is(':checked');
        var Ischeck_close = $("#cb_close").is(':checked');
        var Ischeck_cancel = $("#cb_cancel").is(':checked');




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

        if (displayStr == 'hide') {
            displayStr = "style='display:none;'"
        }

        var _timeS = m.RAISED_TIME.split(' ');

        result += "<div class='alarmItem' category_code='" + m.CATEGORY_CODE + "' id='" + m.ALARM_ID + "' status='" + m.CODE_NAME + "' " + displayStr + " >\
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

    //if (alarmsJSON.length == 0) {
    //    $('#kjg,#hw').attr('src', '/Common/MRTA/img/test.jpg');

    //    $('#linechart').html('');

    //}

    // bind();

    $('.alarmItem').click(function () {
        var _id = $(this).attr('id');
        var cateGoryName = $(this).attr('category_code');
        ClickAlarmMaker(_id, cateGoryName);
    });
    $('.alarmItem').dblclick(function () {

        var id = $(this).attr('id');
        var cateGoryName = $(this).attr('category_code');

        toAlarmDetails(cateGoryName, id);
    })
    //var Margin = ($('.boxTitle').height() - $(".fg_white").height()) / 2
    if ($(window).height() < 768) {
        $(".fg_white").css("marginTop", 22)
    } else {
        $(".fg_white").css("marginTop", 50)
    }
}






//加载途经车辆信息
function GetListTrain() {
    var trainJSON = PageTrainJson.rows;
    var result = '';
    for (var i = 0; i < trainJSON.length; i++) {
        var m = trainJSON[i];
        if (m.GIS_X == 0) continue;
        var displayStr = "";
        //    var IScheckWC = ("#cb_type4").is(':checked');
        var IscheckType1 = $("#cb_type1").is(':checked');
        var IscheckType2 = $("#cb_type2").is(':checked');
        var IscheckType3 = $("#cb_type3").is(':checked');

        var Ischeck_new = $("#cb_new").is(':checked');
        var Ischeck_sure = $("#cb_sure").is(':checked');
        var Ischeck_plan = $("#cb_plan").is(':checked');
        var Ischeck_check = $("#cb_check").is(':checked');
        var Ischeck_close = $("#cb_close").is(':checked');
        var Ischeck_cancel = $("#cb_cancel").is(':checked');

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
        if (displayStr == 'hide') {
            displayStr = "style='display:none;'"
        }
        // 途经车辆列表数据绑定
        result +=
            '<div class="trainItem" id="' + m.TRAINNUM + '" ' + displayStr + ' >\
                <div class="m_loca d" title="' + m.TRAINNUM + '">' + m.TRAINNUM + '</div>\
                <div class="m_sTime d" title="' + m.STARTTIME + '">' + m.STARTTIME + '</div>\
                <div class="m_eTime d" title="' + m.ENDTIME + '">' + m.ENDTIME + '</div>\
                <div class="m_locus d">查看轨迹\
                    <a href="javascript:void(0)"  class="j-to-OrbitGIS" deviceid="' + m.TRAINNUM + '" stime="' + m.STARTTIME + '" etime="' + m.ENDTIME + '" crossing_no="" line_code="' + m.LINECODE + '" direction="' + m.DIRECTION + '">\
                        <img src="/Common/MGIS/img/gis-img/chakanguiji.png" />\
                    </a>\
                </div>\
                <div class="cls"></div>\
            </div>';
    }
    $('#trains').html(result);
    if ('' === result) {
        layer.msg('无数据');
    }
    //途经车辆点击事件
    $('.trainItem').click(function () {
        //var _id = $(this).attr('id');
        //ClickAlarmMaker(_id);
    });
    $('.trainItem').dblclick(function () {
        //var _alarmid = $(this).attr('id');
        //window.open('/C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=' + _alarmid + "&v=" + version);
    })
    if ($(window).height() < 768) {
        $(".fg_white").css("marginTop", 22)
    } else {
        $(".fg_white").css("marginTop", 50)
    }
}

//跳转到图形化轨迹页面
function toOrbitGIS(deviceid, begin_time, end_time, crossing_no, line_code, direction) {
    var _url = '';
    if (getConfig('UseLogicTopo') == 'true') {
        _url = "/Common/MTopo/OrbitTopo.htm?deviceid=" + deviceid
            + "&startdate=" + begin_time + "&Category_Code=3C&enddate=" + end_time
            + "&jl=" + crossing_no + "&LINE_CODE=" + line_code
            + "&DIRECTION=" + escape(direction) + "&v=" + version;
    } else {
        _url = "/Common/MGIS/OrbitGIS.htm?deviceid=" + deviceid
            + "&startdate=" + begin_time + "&enddate=" + end_time
            + "&jl=" + crossing_no + "&Category_Code=3C&LINE_CODE=" + line_code
            + "&DIRECTION=" + escape(direction) + "&v=" + version;
    }
    ShowWinOpen(_url);
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

//查询告警
function QueryAlarmInfo() {






    RemoveAlarmMaker();   //删除地图告警对象
    GetAlarm();           //根据分页获取告警列表信息（在MapAlarm.js）
    SetPage();            //加载分页信息
    ChangeLevel_Status();
    changeRowNumber();//当前页展示信息更新





}
//查询途经车辆
function QueryTrainInfo() {
    RemoveAlarmMaker();   //删除地图告警对象
    GetTrain();           //根据分页获取途经车辆列表信息（在MapAlarm.js）
    SetPageTrain();            //加载分页信息
    ChangeLevel_Status_train();

    //查看轨迹
    $('.j-to-OrbitGIS').click(function () {
        var _this = $(this);
        var deviceid = _this.attr('deviceid');
        var stime = _this.attr('stime');
        var etime = _this.attr('etime');
        var crossing_no = _this.attr('crossing_no');
        var line_code = _this.attr('line_code');
        var direction = _this.attr('direction');
        toOrbitGIS(deviceid, stime, etime, crossing_no, line_code, direction);
    });
}

///根据图例设置告警在地图上的显示或隐藏（级别的一类二类三类）
function ChangeLevel_Status_train() {
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

    GetListTrain();
    SetAlarmNumber();
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
//function lineChange(pcode) {
//    $('#txtqz').jHint({
//        type: 'StationSection',
//        line: pcode
//    });
//};
function lineChange(pcode) {
    if (pcode == '0') {
        pcode = '';
    }
    $('#txtqz').val('').attr('code', '')
    $('#ul_txtqz').remove();
    if (getConfig('For6C') == 'DPC') {
        $('#txtqz').jHint({
            type: 'StationSection',
            listContainerCSSName: 'listContainerWhite',
            line: pcode,
            isStartEnd: true,
            clo: '2',
        });
    } else {
        $('#txtqz').inputSelect({
            type: 'StationSection',
            line: pcode,
            contant: 1
        });
    }
}

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

//改变当前页条数
function changeRowNumber() {
    var RowNumber_page = 0;
    $('#alarms .alarmItem').each(function () {
        if ($(this).parent().is(":hidden")) {
            setTimeout(changeRowNumber, 200)
            return false;
        }
        if (!$(this).is(":hidden")) {
            RowNumber_page++;
        }
    })
    $('#PageSize').html(RowNumber_page);
};
