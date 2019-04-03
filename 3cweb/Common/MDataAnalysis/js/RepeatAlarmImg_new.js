var isShow; //是否是同点对比false为同点对比
var htmlJson = window.opener.AlarmJson; //全局JSON  某组重复报警集合
$(document).ready(function () {
   
    //只有在已确认的重复报警中alarmid才会有值
    if (GetQueryString("alarmid")) {
        $.ajax({
            type: "POST",
            data: { "alarmid": GetQueryString("alarmid") },
            url: "/Common/MDataAnalysis/RemoteHandlers/RepeatAlarm.ashx?type=getJson",
            async: true,
            cache: false,
            success: function (json) {
                if (json) {
                    htmlJson = eval(json);
                    pageLoad();
                }
            }
        });
    }
    else {
        pageLoad();
    }

    //绑定行别
    $("#POLE_DIRECTION").mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: '3C',
        cateGory: 'DRTFLG',
        enableFilter: false,
        onClick: function (event, treeId, treeNode) {
            $("#POLE_DIRECTION").attr('code', treeNode.id).val(treeNode.name);
        }
    });


    //批量编辑模态框位置
    $('#edit_WZ_modal').css({ 'left': ($(window).width() - 800) / 2, 'marginLeft': 0 });



    setTimeout(OtderBind, 1500);

    $("#E_btnOk2").click(function () {//报警确认按钮
        SetAlarmID("REPEAT", GetQueryString("alarmid"));
        setTimeout("setAlarmTable()", 2000);
    });
    $("#E_btnCan2").click(function () {//报警取消按钮
        SetAlarmID("REPEAT", GetQueryString("alarmid"), 1);
        setTimeout("setAlarmTable()", 2000);
    });
});


//页面加载事件
function pageLoad() {
   

    var _Infowidth1 = $('#panel-6653').width();
    var _Infowidth = $('#panel-6652').width();
    $('#btn_locInfoControl1').click(function () {
        var src = $(this).attr('src');
        if (src.indexOf('left') > 0) {
            $('#btn_locInfoControl1').attr('src', '/Common/img/locoPlay/right.png');
            $('#panel-6653').animate({ width: 0, height: 27 }, 500);
            $('#locInfo1').animate({ opacity: 0 }, 500);
        }
        else {
            $('#btn_locInfoControl1').attr('src', '/Common/img/locoPlay/left.png');
            $('#panel-6653').animate({ width: _Infowidth1 }, 500);
            $('#locInfo1').animate({ opacity: 1 }, 800);
        }
    });
    $('#btn_locInfoControl').click(function () {
        var src = $(this).attr('src');
        if (src.indexOf('left') > 0) {
            $('#btn_locInfoControl').attr('src', '/Common/img/locoPlay/right.png');
            $('#panel-6652').animate({ width: 0, height: 27 }, 500);
            $('#locInfo').animate({ opacity: 0 }, 500);
        }
        else {
            $('#btn_locInfoControl').attr('src', '/Common/img/locoPlay/left.png');
            $('#panel-6652').animate({ width: _Infowidth }, 500);
            $('#locInfo').animate({ opacity: 1 }, 800);
        }
    });
    $("#btnImport").click(function () {
        if (htmlJson != undefined && htmlJson.length > 1) {
            $("#alarmid").val("");  
            //获取所有checkBox选中项的值
            $(":checkbox:checked[name='tbCheckBox']").each(function (i) {
                $("#alarmid").val($("#alarmid").val() + "," + this.value);
            });
            $("#repeat_info").val($("#repeatDetail").text().replace(htmlJson.length + '次', $(":checkbox:checked[name='tbCheckBox']").length + '次'));
            post("/Report/AlarmRepeat.aspx");
        }
    });
    $("#btnImportExcel").click(function () {
        //var htmlJson = window.opener.AlarmJson;
        if (htmlJson != undefined && htmlJson.length > 1) {
            $("#alarmid").val("");
            //获取所有checkBox选中项的值
            $(":checkbox:checked[name='tbCheckBox']").each(function (i) {
                $("#alarmid").val($("#alarmid").val() + "," + this.value);
            });
            //加上第一条报警
            $("#repeat_info").val($("#repeatDetail").text().replace(htmlJson.length + '次', $(":checkbox:checked[name='tbCheckBox']").length + '次'));
            post("/Report/AlarmRepeatDetailExcel.aspx");
        }
    });
    isShow = GetQueryString("showclose");
    var html = "";
    if (isShow != "false") {
        $("#modal-container-check").css("height", "660");
        //        $("#modal - body").css("height", "660");
    }
    else {
        $("#modal-container-check").css("height", "490");
        $("#modal-body").css("height", "365");
    }
    if (htmlJson.length > 0) {
        if (htmlJson[0].STATUS_NAME == "已计划") {
            $("#E_btnOk2,#E_btnCan2").css("display", "none");
        }
        for (var i = 0; i < htmlJson.length; i++) {
            //            $("#alarmid").val($("#alarmid").val() + "," + htmlJson[i].ID);
            var label = "";
            if (htmlJson[i].KM_MARK != "-1" && htmlJson[i].KM_MARK != "-99999999" && htmlJson[i].KM_MARK != "" && htmlJson[i].KM_MARK != undefined && htmlJson[i].KM_MARK != '-(K99999+999)') {
                label = htmlJson[i].DETECT_DEVICE_CODE + "&nbsp;&nbsp;" + htmlJson[i].RAISED_TIME + "&nbsp;&nbsp;" + htmlJson[i].LINE_NAME + "&nbsp;&nbsp;" + htmlJson[i].POSITION_NAME + "&nbsp;&nbsp;" + htmlJson[i].POSITION_NAME + "&nbsp;&nbsp;" + htmlJson[i].KM_MARK + "&nbsp;&nbsp;" + htmlJson[i].STATUS_NAME;
            } else{
                label = htmlJson[i].DETECT_DEVICE_CODE + "&nbsp;&nbsp;" + htmlJson[i].RAISED_TIME + "&nbsp;&nbsp;东经" + htmlJson[i].GIS_X + "&nbsp;&nbsp;北纬" + htmlJson[i].GIS_Y + "&nbsp;&nbsp;" + htmlJson[i].STATUS_NAME;
            }
            html += "<input id='ck" + i + "' type='checkbox' name='checkBox' checked='checked' value='" + htmlJson[i].ID + "' />&nbsp;&nbsp;<label style='font-size:14px;' for='ck" + i + "'>" + label + "</label><br/>";
        }
        $("#modal-body").html(html);
    }
    alarmid1 = htmlJson[0].ID;
    //判断是否传入ID，或ID是否为第一条,来设置当前选中项
    if (!GetQueryString("id") || GetQueryString("id") == htmlJson[0].ID) {
        alarmid = htmlJson[1].ID;
    }
    else {
        alarmid = GetQueryString("id");
    }
   
    var Height = $(window).height() - $('.box-title').outerHeight(true) - $('.box-title-loco').outerHeight(true) - 236

    document.getElementById("ImgHW").style.height = Height + "px";
    document.getElementById("ImgKJG").style.height = Height + 40 + "px";
    document.getElementById("hw").style.height = Height + "px";
    document.getElementById("kjg").style.height = Height + 40 + "px";
    document.getElementById("Imgallimg").style.height = Height + 40 + "px";
    document.getElementById("linechart1").style.height = Height + 40 + "px";
    document.getElementById("allimg").style.height = Height + 40 + "px";
    document.getElementById("linechart").style.height = Height + 40 + "px";
    document.getElementById("main").style.height = Height + 40 + "px";
    document.getElementById("main1").style.height = Height + 40 + "px";
    document.getElementById("main2").style.height = Height + 40 + "px";
    document.getElementById("main3").style.height = Height + 40 + "px";
    $('.box-title-one').height(Height + 40);
    $('.box-playimg').height(Height + 40);
    $('.box-mid-title').height(Height + 40 - 2);
    $('.box-title-one span').css('marginTop', ($('.box-title-one').height() - $('.box-title-one span').height()) / 2 + 'px');
    $('.box-mid-title span').css('marginTop', ($('.box-mid-title').height() - $('.box-mid-title span').height()) / 2 + 'px');

    getListInfo();
    getAlarminfo(alarmid);
    getAlarminfo1(alarmid1);
    urlControl_new(); //控制按钮状态
   

    $(".note_a2").hover(function () {
        $(this).find("img").attr("src", "/C3/PC/MAlarmMonitoring/ImgTmp/left-light.png");
    }, function () {
        $(this).find("img").attr("src", "/C3/PC/MAlarmMonitoring/ImgTmp/left.png");
    })
    $(".note_a3").hover(function () {
        $(this).find("img").attr("src", "/C3/PC/MAlarmMonitoring/ImgTmp/right-light.png");
    }, function () {
        $(this).find("img").attr("src", "/C3/PC/MAlarmMonitoring/ImgTmp/right.png");
    })
    $(".note_a4").hover(function () {
        $(this).find("img").attr("src", "/C3/PC/MAlarmMonitoring/ImgTmp/close-light.png");
    }, function () {
        $(this).find("img").attr("src", "/C3/PC/MAlarmMonitoring/ImgTmp/close1.png");
    });
    $(".note_a5").hover(function () {
        var IMG = $(this).find('img').attr("src");
        if (IMG == '/C3/PC/MAlarmMonitoring/ImgTmp/play.png') {
            $(this).find('img').attr("src", "/C3/PC/MAlarmMonitoring/ImgTmp/play-light.png")
        }
        if (IMG == '/C3/PC/MAlarmMonitoring/ImgTmp/pause.png') {
            $(this).find('img').attr("src", "/C3/PC/MAlarmMonitoring/ImgTmp/pause-light.png")
        }

    }, function () {
        var IMG = $(this).find('img').attr("src");
        if (IMG == '/C3/PC/MAlarmMonitoring/ImgTmp/play-light.png') {
            $(this).find('img').attr("src", "/C3/PC/MAlarmMonitoring/ImgTmp/play.png")
        }
        if (IMG == '/C3/PC/MAlarmMonitoring/ImgTmp/pause-light.png') {
            $(this).find('img').attr("src", "/C3/PC/MAlarmMonitoring/ImgTmp/pause.png")
        }
    });
    $(".note_a6").hover(function () {
        $(this).find("img").attr("src", "/C3/PC/MAlarmMonitoring/ImgTmp/jump-light.png");
    }, function () {
        $(this).find("img").attr("src", "/C3/PC/MAlarmMonitoring/ImgTmp/jump.png");
    });

    $('.box-Content-img>img').click(function () {
        var SRC = $(this).attr('src');
        if (SRC == '/Common/img/repeatAlarm/repeat-icon-up.png') {
            $(this).attr('src', '/Common/img/repeatAlarm/repeat-icon-down.png');
        } else {
            $(this).attr('src', '/Common/img/repeatAlarm/repeat-icon-up.png');
        }
        $('#box-new-ch').toggle();
        $('#box-new-status').toggle();
        $('.box-new-ch').toggle();
        $('.box-new-status').toggle();
        $('#box-new-ch1').toggle();
        $('#box-new-status1').toggle();
        $('#box-new-bow').toggle();
        $('#box-new-bow1').toggle();
        $('#box-new-chu').toggle();
        $('.box-new-bow').toggle();
        $('#box-new-lachu').toggle();
        $('.box-new-lachu').toggle();
        $('#box-new-lachu1').toggle();
        $('#box-new-daoGAO').toggle();
        $('#box-new-daoGAO1').toggle();
        $('.box-new-daoGAO').toggle();
        $('.box-new-wenDu').toggle();
        $('#box-new-wenDu').toggle();
        $('#box-new-wenDu1').toggle();
        $('#box-new-suDu').toggle();
        $('#box-new-suDu1').toggle();
        $('.box-new-suDu').toggle();
        $('.box-new-hjwenDu').toggle();
        $('#box-new-hjwenDu').toggle();
        $('#box-new-hjwenDu1').toggle();
        $('.box-new-armTYPE').toggle();
        $('#box-new-armTYPE1').toggle();
        $('#box-new-armTYPE').toggle();

        
        
       


    })
    //setTimeout("loadC3Echarts()", 300);
    //setTimeout("loadC3Echarts1()", 300); //加载温度曲线
    //setTimeout("load3cechartsmain()", 300);//加载拉出值曲线
    //setTimeout("load3cechartsmain1()", 300);//加载拉出值曲线
    //setTimeout("load3cechartsmain3()", 300);//加载导高值
    //setTimeout("load3cechartsmain2()", 300);//加载导高值
    

    setTimeout("LoadCharts_new()", 300);
    setTimeout("LoadCharts_2()", 300);
    
    var _W = ($('.box-Content').width() - 86) / 2;
    $('.box-Content-left').width(_W);
    $('.box-Content-right').width(_W - 20);
    $('.box-playimg-left').width(_W);
    $('.box-playimg-right').width(_W - 20);

    //拖拽提示
    $('.nav-tabs li').mouseenter(function () {
        if (!$(this).hasClass('theNew') && !$(this).hasClass('active')) {
            layer.tips('请拖拽', '#' + $(this).attr('id'), {
                tips: [1, '#a959ee']
            });
        }
        if ($(this).hasClass('theNew-white') && $(this).hasClass('theNew')) {
            layer.tips('请拖拽', '#' + $(this).attr('id'), {
                tips: [1, '#a959ee']
            });
        }
    }).mouseleave(function () {
        layer.tips('请拖拽', '#' + $(this).attr('id'), {
            tips: [1, '#a959ee'],
            time: 10
        });
    });
    //拖拽提示
    $(document).on('mouseenter', '.nav-tabs li.no-drag', function () {
        layer.tips('不能拖拽', '#' + $(this).attr('id'), {
            tips: [1, '#ff0000']
        });
    });
    $(document).on('mouseleave', '.nav-tabs li.no-drag', function () {
        layer.tips('不能拖拽', '#' + $(this).attr('id'), {
            tips: [1, '#ff0000'],
            time: 10
        });
    });
   
    //报警信息点击事件
    alarm_info_click();
};


function OtderBind()
{

    $('#citySel').mySelectTree({
        CateGory: 'AFCODE',
        CodeType: '3C',
        IsSelectChildren: false,
        IsSelectLastOne: true
    });

    //批量编辑位置默认信息
    $('#lineselect').mySelect({
        tag: 'LINE',
        async: false,
        defaultText: '暂无'  //线路名
    });
    $('#lineselect').val(htmlJson[0].LINE_CODE);

    $('#positionselect').mySelect({
        tag: 'STATIONSECTION',
        async: false,
        code: htmlJson[0].LINE_CODE,
        defaultText: '暂无'  //区站名
    });
    $('#positionselect').val(htmlJson[0].POSITION_CODE);

    $('#brgtunselect').mySelect({
        tag: 'BRIDGETUNE',
        async: false,
        code: htmlJson[0].POSITION_CODE,
        defaultText: '暂无'  //桥隧名
    });
}

function LoadCharts_new()
{
    loadC3Echarts1(); //最新报警温度图表 
    load3cechartsmain1(); //最新报警拉出值图表
    load3cechartsmain3(); //最新报警导高值图表
}

function LoadCharts_2() {
    loadC3Echarts(); //重复报警温度图表
    load3cechartsmain(); //重复报警拉出值图表
    load3cechartsmain2(); //重复报警导高值图表
}

//form post 提交
function post(URL) {
    var temp_form = document.createElement("form");
    temp_form.action = URL;
    temp_form.target = "_blank";
    temp_form.method = "post";
    temp_form.style.display = "none";
    temp_form.appendChild(document.getElementById("alarmid"));
    temp_form.appendChild(document.getElementById("repeat_info"));

    document.body.appendChild(temp_form);
    temp_form.submit();
}

var dirpath; //前面路径
var josnpath; //中间路径
var alarmid; //默认第一个缺陷ID
var set; //定时器
var imaname; //imaname
var jpgname; //jpgname
var Imgjson;
var ImgNum = 0; //图片计数
var imaCount;
var jpgCount;
var InfoNum = 0; //信息计数
var locinfo;
var Ispaly = 1;
var FLAG; //是否是缺陷帧
var JsonAlarm;

function play() {
    if (ImgNum >= JsonAlarm.PLAY_IDX.length) {
        ImgNum = 0;
    }

    if ($("#slider").length > 0) {
        $("#slider").slider("value", ImgNum);
        $("#slider").slider({ range: "min" });
    }

    var IR_index = JsonAlarm.PLAY_IDX[ImgNum].IR;  //红外帧
    var VI_index = JsonAlarm.PLAY_IDX[ImgNum].VI;  //可见帧
    var OA_index = JsonAlarm.PLAY_IDX[ImgNum].OA;  //全景帧A
    var OB_index = JsonAlarm.PLAY_IDX[ImgNum].OB;  //全景帧B

    FLAG = JsonAlarm.PLAY_IDX[ImgNum].FLAG;

    var temp = '最高温度：' + JsonAlarm.FRAME_INFO_LIST[IR_index].TEMP_IRV + " &nbsp;";
    temp += '环境温度：' + JsonAlarm.FRAME_INFO_LIST[IR_index].TEMP_ENV + " &nbsp;";
    temp += '导高值：' + JsonAlarm.FRAME_INFO_LIST[IR_index].LINE_HEIGHT + " &nbsp;";
    temp += '拉出值：' + JsonAlarm.FRAME_INFO_LIST[IR_index].PULLING_VALUE + " &nbsp;";
    temp += '速度：' + JsonAlarm.FRAME_INFO_LIST[IR_index].SPEED + " &nbsp;";
    $('#locInfo').html(temp);
    //            }

    //红外换图
    $('#hw').attr('src', JsonAlarm.IR_PICS[IR_index])

    //可见光换图
    $('#kjg').attr('src', JsonAlarm.VI_PICS[VI_index])

    //全景
    if (JsonAlarm.OA_PICS == "") {
        $('#allimg').attr('src', JsonAlarm.OB_PICS[OB_index]);
    } else {
        $('#allimg').attr('src', JsonAlarm.OA_PICS[OA_index]);
    }

    if ($('#locInfo').length > 0) {
        $('#locInfo').html();
    }
}

//为IMG赋值  播放
function ImgShuffling() {

    play();

    ImgNum++;

    if (FLAG == 1) {
        clearInterval(set); //关闭定时器 
        set = setInterval('ImgShuffling()', 5000);
    }
    else {
        clearInterval(set);
        set = setInterval('ImgShuffling()', 500);
    }
}

//线路改变
function lineChange(value, text) {
    $('#positionselect').mySelect({
        tag: 'STATIONSECTION',
        code: value,
        defaultText: '暂无'
    });
    $("#LINE_NAME").val(text);
};
function positionChange(value, text) {
    $('#brgtunselect').mySelect({
        tag: 'BRIDGETUNE',
        code: value,
        defaultText: '暂无'
    });
    $("#POSITION_NAME").val(text);
};
function brgtunChange(value, text) {
    $("#BRG_TUN_NAME").val(text);
};

//获取对比页滚动标签
function getListInfo() {
    var list = htmlJson;
    var Distance;
    if (isShow != "false") {
        Distance = window.opener.Distance;
    }
    else {
        Distance = $("#range", window.opener.document).val();
    }
    var html = "<div class='tabbable tabs-below' id='tabs-603018'>\
                        <ul class='nav nav-tabs' style='margin-bottom: 0px;border-top:none;'>\
                        ";
    $(list).each(function (i) {
        if (i >= 0) {

            //判断是否传入ID，或ID是否为第一条,来设置当前选中项
            var isActive = "class='block-drag drag theHist'";
            if (GetQueryString("id") != undefined && GetQueryString("id") != list[0].ID) {
                if (this.ID == GetQueryString("id"))
                    isActive = "class='block-drag no-drag drag active'";
            }
            else {
                if (i == 1)
                    isActive = "class='block-drag no-drag drag active'";
            }
            if (i == 0) {
                html += "<li id=alarm-number" + i + " alarm-id='" + this.ID + "' class='block-drag no-drag drag theNew'  style='position:relative;background-color: #3671CF;'><div class='new'></div><input name='tbCheckBox' type='checkbox' checked='checked' style='position:absolute;bottom:8px;right:8px;' value='" + this.ID + "'/><a >";
            }
            else {
                isActive = isActive.replace("active", "active theHist");
                html += "<li id=alarm-number" + i + " alarm-id='" + this.ID + "' " + isActive + " style='position:relative;background-color: #fff;'><div class='addres'></div><input name='tbCheckBox' type='checkbox' checked='checked' style='position:absolute;bottom:8px;right:8px;' value='" + this.ID + "'/><a href='#' data-toggle='tab'>";
            }
            html += this.DETECT_DEVICE_CODE + "<br />";
            html += this.RAISED_TIME + "<br />";
            //线路条件查询
            if (this.KM_MARK != "-1" && this.KM_MARK != "-99999999" && this.KM_MARK != "" && this.KM_MARK != undefined && this.KM_MARK != '-(K99999+999)') {
                html += this.LINE_NAME + "&nbsp;" + this.POSITION_NAME + "&nbsp;" + this.DIRECTION + "&nbsp;" + this.KM_MARK + (this.POLE_NUMBER == "" ? "" : "&nbsp;" + this.POLE_NUMBER + "支柱") + "<br />";
            }
            //gps条件查询
            else {
                
                html += "东经" + this.GIS_X_O;
                html += "北纬" + this.GIS_Y_O + "<br />";
            }
            html += " " + this.STATUS_NAME + "&nbsp;" + this.CODE_NAME;
            html += "</a></li>";
        }
    });
    html += "</ul></div>";
    var content = "";
    
    //线路条件查询
    if (list[0].KM_MARK != "-1" && list[0].KM_MARK != "-99999999" && list[0].KM_MARK != "" && list[0].KM_MARK != undefined && list[0].KM_MARK != '-(K99999+999)') {
        content += (list[0].KM_MARK == "" ? "" : "<span style='color:#3671cf'>" + list[0].KM_MARK + "</span>公里标，") + (list[0].POLE_NUMBER == "" ? "" : "<span style='color:#3671cf'>" + list[0].POLE_NUMBER + "</span>号杆");
    }
    //gps条件查询
    else {
        
            content += "东经" + list[0].GIS_X_O + "北纬" + list[0].GIS_Y_O;
        
    }
    $("#repeatDetail").html(content + "周围<span style='color:#3671cf'>" + (Distance ? Distance + "</span>米范围内" : "") + "，在<span style='color:#3671cf'>" + list[list.length - 1].RAISED_TIME
                                    + "</span>到<span style='color:#3671cf'>" + list[0].RAISED_TIME + "</span>之间，检测出<span style='color:#3671cf'>" + list.length + "</span>次疑似缺陷告警");

    $("#List1_1").html(html);
    
    element_drag(); //拖动报警信息
    var li = $('.box-title-loco .block-drag');
    li.each(function (index) {
        var _this = $(this);
        if (_this.hasClass('no-drag')) {
            _this.draggable('disable'); // 禁止其拖动功能
        }
    });

    //if (list[0].SVALUE15 == "重复报警") {
    //    $('#mySUREimg').css("display", "none");
    //    $('#mySUREimg1').css("display", "block");
    //} else {
    //    $('#mySUREimg').css("display", "block");
    //    $('#mySUREimg1').css("display", "none");
    //};


   
    $('#brgtunselect').val(list[0].BRG_TUN_CODE);

    $('#POLE_DIRECTION').val(list[0].DIRECTION);  //行别
    $('#POLE_NO').val(list[0].POLE_NUMBER);   //杆号
    if (list[0].KM_MARK_NUMBER != undefined) {
        $('#txt_km').val(list[0].KM_MARK_NUMBER);    //公里标
    } else {
        $('#txt_km').val(parseInt(list[0].KM_MARK.split('+')[0].split('K')[1]) * 1000 + parseInt(list[0].KM_MARK.split('+')[1]));    //公里标
    }


    //头部标题栏的信息
    $('#box-LINE_NAME').html(list[0].LINE_NAME);
    $('#box-POSITION_NAME').html(list[0].POSITION_NAME);
    $('#box-DIRECTION').html(list[0].DIRECTION);
    //隐藏的告警编码
    var alarmc;
    if (list[0].CUST_ALARM_CODE == "") {
        alarmc = list[0].RAISED_TIME.substring(2, 16).replace(/\D/g, '');
    } else {
        alarmc = list[0].CUST_ALARM_CODE;
    }
    document.getElementById('HideAlarmCode').innerHTML = alarmc;

    //最新报警信息栏的信息
    //$('#box-new-loco').html((list[0].KM_MARK == "" ? "" : list[0].KM_MARK + ',') + (list[0].POLE_NUMBER == "" ? "" : '支柱:' + list[0].POLE_NUMBER));
    //$('#box-new-time').html(list[0].RAISED_TIME.replace(/-/g, '/') + "&nbsp;&nbsp;(&nbsp;<a href=\"javascript:window.open('/C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=" + list[0].ID + '&v=' + version + "','_blank')\" style='color:#A8D376;'>详情>></a>&nbsp;)");
    //$('#box-new-ch').html(list[0].DETECT_DEVICE_CODE);
    //$('#box-new-status').html((list[0].STATUS_NAME == "" ? "" : list[0].STATUS_NAME + '，') + list[0].CODE_NAME);
    //$('#box-new-bow').html(list[0].BOW_TYPE);
    //$('#box-new-daoGAO').html(list[0].DGZ + 'mm');
    //$('#box-new-lachu').html(list[0].LCZ + 'mm');
    //$('#box-new-wenDu').html(list[0].WD + '℃');
    //$('#box-new-suDu').html(list[0].SPEED + 'km/h');
    //$('#box-new-hjwenDu').html(list[0].HJWD + '℃');
    //$('#box-new-armTYPE').html(list[0].SEVERITY); 
    
    
    
    //重复报警信息栏的信息
    //$('#box-new-loco1').html((list[1].KM_MARK == "" ? "" : list[1].KM_MARK + ',') + (list[1].POLE_NUMBER == "" ? "" : '支柱:' + list[1].POLE_NUMBER));
    //$('#box-new-time1').html(list[1].RAISED_TIME.replace(/-/g, '/') + "&nbsp;&nbsp;(&nbsp;<a href=\"javascript:window.open('/C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=" + list[1].ID + '&v=' + version + "','_blank')\" style='color:#A8D376;'>详情>></a>&nbsp;)");
    //$('#box-new-ch1').html(list[1].DETECT_DEVICE_CODE);
    //$('#box-new-status1').html((list[1].STATUS_NAME == "" ? "" : list[1].STATUS_NAME + '，') + list[1].CODE_NAME);
    //$('#box-new-bow1').html(list[1].BOW_TYPE);
    //$('#box-new-daoGAO1').html(list[1].DGZ + 'mm');
    //$('#box-new-lachu1').html(list[1].LCZ + 'mm');
    //$('#box-new-wenDu1').html(list[1].WD + '℃');
    //$('#box-new-suDu1').html(list[1].SPEED + 'km/h');
    //$('#box-new-hjwenDu1').html(list[1].HJWD + '℃');
    //$('#box-new-armTYPE1').html(list[1].SEVERITY);
}

/**
 * @desc 点击报警信息
 * @param
 */
function alarm_info_click() {

    $(document).on('mousedown', '.nav-tabs li.theNew a,.nav-tabs li.theNew-blue a,.nav-tabs li.theHist-dark-blue a', function () {
        $(this).removeAttr('data-toggle');
    });
    $(document).on('mousedown', '.nav-tabs li.theNew-white a', function () {
        $(this).removeAttr('data-toggle');
    });

    //点击报警信息
    $(document).on('click', '.nav-tabs li a', function () {
        var _li = $(this).parent();
        if (_li.hasClass('theNew') || _li.hasClass('theNew-blue') || _li.hasClass('theNew-white') || _li.hasClass('theHist-dark-blue')) {
            return;
        } else {
            _li.addClass('no-drag');
            $(this).css('color', '#fff');
            _li.draggable('disable'); // 禁止其拖动功能

            var li = $('.box-title-loco .block-drag');
            li.each(function (index) {
                var _this = $(this);
                if (_this.hasClass('theHist') && !_this.hasClass('active') && !_this.hasClass('theHist-dark-blue')) {
                    _this.removeClass('no-drag');
                    _this.css('background-color', '#fff');
                    _this.find('a').css('color', '#3671cf');
                    _this.find('a').attr('data-toggle', 'tab');
                    _this.draggable('enable'); // 激活其拖动功能
                }
                if (!_this.hasClass('theHist') && !_this.hasClass('active') && _this.hasClass('theNew-blue')) {
                    _this.removeClass('no-drag').removeClass('theNew-blue').addClass('theNew-white');
                    _this.css('background-color', '#fff');
                    _this.find('a').css('color', '#3671cf');
                    _this.draggable('enable'); // 激活其拖动功能
                }
            });

            getAlarminfo(_li.attr('alarm-id'));
            LoadCharts_2();
        }
    });
}

/**
 * @desc 清除边框的红色
 * @param
 */
function clear_border_color_red() {
    $('.box-Content-left').removeClass('border-red');
    $('.box-playimg-left').removeClass('border-red');
    $('.box-Content-right').removeClass('border-red');
    $('.box-playimg-right').removeClass('border-red');
}
/**
 * @desc 拖动报警信息
 * @param
 */
function element_drag() {
    var alarm_id = ''; //报警id
    //拖动事件
    $('.box-title-loco .block-drag').draggable({
        connectToSortable: '.info-area',
        handle: '.drag',
        helper: 'clone',
        start: function (e, t) {
            //获取被拖动的报警id
            alarm_id = $(this).attr('alarm-id');
            $('.box-Content-left').addClass('border-red');
            $('.box-playimg-left').addClass('border-red');
            $('.box-Content-right').addClass('border-red');
            $('.box-playimg-right').addClass('border-red');
        },
        drag: function (e, t) {
            var width = $(this).width();
            t.helper.width(width);
        },
        stop: function (e, t) {
            clear_border_color_red(); //清除边框的红色

            var clientWidth = document.body.clientWidth; //网页可见区域宽
            var left_min_clientX = 0;
            var left_max_clientX = clientWidth / 2;
            var right_min_clientX = clientWidth / 2;
            var right_max_clientX = clientWidth;

            var box_content_offsetY = $('.box-Content').offset().top;
            var clientHeight = document.body.clientHeight; //网页可见区域高
            var left_min_clientY = box_content_offsetY;
            var left_max_clientY = clientHeight;
            var right_min_clientY = box_content_offsetY;
            var right_max_clientY = clientHeight;
            
            var li = $(this).parent().find('li');
            //拖动到最新报警区域
            if (e.clientX >= left_min_clientX && e.clientX <= left_max_clientX && e.clientY >= left_min_clientY && e.clientY <= left_max_clientY) {
                getAlarminfo1(alarm_id); //获取信息（最新报警）
                LoadCharts_new(); //获取信息（最新图表）

                li.each(function (i) {
                    var _this = $(this);
                    if (_this.hasClass('theNew') && !_this.hasClass('theNew-blue')) { //如果是“最新”（深蓝色），则置为“最新”（白色）
                        _this.removeClass('no-drag').addClass('theNew-white');
                        _this.css('background-color', '#fff');
                        _this.find('a').css('color', '#3671CF');
                        _this.find('a').attr('data-toggle', 'tab');
                        _this.draggable('enable'); // 激活其拖动功能
                        return;
                    }
                    if (_this.hasClass('theHist-dark-blue')) { //如果是“重复”（深蓝色），则置为“重复”（白色）
                        _this.removeClass('theHist-dark-blue').removeClass('no-drag');
                        _this.css('background-color', '#fff');
                        _this.find('a').css('color', '#3671CF');
                        _this.find('a').attr('data-toggle', 'tab');
                        _this.draggable('enable'); // 激活其拖动功能
                        return;
                    }
                });

                if ($(this).hasClass('theNew-white')) { //如果拖动的是“最新”（白色），则置为“最新”（深蓝色）
                    $(this).removeClass('theNew-white').addClass('no-drag');
                    $(this).css('background-color', '#3671CF');
                    $(this).find('a').css('color', '#fff');
                    $(this).find('a').removeAttr('data-toggle');
                    $(this).draggable('disable'); // 禁止其拖动功能
                    $('.box-Content-new p:eq(0)').html('最新报警信息');
                    return;
                }
                if ($(this).hasClass('theHist') && !$(this).hasClass('active')) { //如果拖动的是“重复”（白色），则置为“重复”（深蓝色）
                    $(this).addClass('no-drag').addClass('theHist-dark-blue');
                    $(this).css('background-color', '#3671CF');
                    $(this).find('a').css('color', '#fff');
                    $(this).find('a').removeAttr('data-toggle');
                    $(this).draggable('disable'); // 禁止其拖动功能
                    $('.box-Content-new p:eq(0)').html('重复报警信息');
                    return;
                }
            }

            //拖动到重复报警区域
            if (e.clientX >= right_min_clientX && e.clientX <= right_max_clientX && e.clientY >= right_min_clientY && e.clientY <= right_max_clientY) {
                getAlarminfo(alarm_id);  //获取信息（重复报警）
                LoadCharts_2(); //获取信息（重复图表）

                li.each(function (i) {
                    var _this = $(this);
                    if (_this.hasClass('theNew') && _this.hasClass('theNew-blue')) { //如果是“最新”（浅蓝色），则置为“最新”（白色）
                        _this.removeClass('theNew-blue').removeClass('no-drag').addClass('theNew-white');
                        _this.css('background-color', '#fff');
                        _this.find('a').css('color', '#3671CF');
                        _this.find('a').attr('data-toggle', 'tab');
                        _this.draggable('enable'); // 激活其拖动功能
                        return;
                    }
                    if (_this.hasClass('active')) { //如果是“重复”（浅蓝色），则置为“重复”（白色）
                        _this.removeClass('active').removeClass('no-drag');
                        _this.css('background-color', '#fff');
                        _this.find('a').css('color', '#3671CF');
                        _this.find('a').attr('data-toggle', 'tab');
                        _this.draggable('enable'); // 激活其拖动功能
                        return;
                    }
                });

                if ($(this).hasClass('theNew') && $(this).hasClass('theNew-white')) { //如果拖动的是“最新”（白色），则置为“最新”（浅蓝色）
                    $(this).removeClass('theNew-white').addClass('no-drag').addClass('theNew-blue');
                    $(this).css('background-color', '#12B3EE');
                    $(this).find('a').css('color', '#fff');
                    $(this).find('a').removeAttr('data-toggle');
                    $(this).draggable('disable'); // 禁止其拖动功能
                    $('.box-Content-right p:eq(0)').html('最新报警信息');
                    return;
                }
                if ($(this).hasClass('theHist') || !$(this).hasClass('active')) { //如果拖动的是“重复”（白色），则置为“重复”（浅蓝色）
                    $(this).addClass('no-drag').addClass('active');
                    $(this).css('background-color', '#12B3EE');
                    $(this).find('a').css('color', '#fff');
                    $(this).find('a').removeAttr('data-toggle');
                    $(this).draggable('disable'); // 禁止其拖动功能
                    $('.box-Content-right p:eq(0)').html('重复报警信息');
                    return;
                }
            }
        }
    });
}

//保存信息修改
function keepinfo() {
    var type = 'save';
    var list = htmlJson;
    var AlarmId = '';
    var JsonAll = '[';

    var Linecode = $('#lineselect').val(); //线路编码
    var Linename = $('#lineselect option:selected').text(); //线路名称
    var Positioncode = $('#positionselect').val(); //区站编码
    var Positionname = $('#positionselect option:selected').text(); //区站名称
    var Direction = $('#POLE_DIRECTION').val(); //行别
    var Brgtuncode = $('#brgtunselect').val(); //桥隧编码
    var Brgtunname = $('#brgtunselect option:selected').text(); //桥隧名称
    var Polenumber = $('#POLE_NO').val(); //杆号
    var Kmmark = $('#txt_km').val(); //公里标
    if (Kmmark.length > 8) {
        layer.tips('<span style="color:black;">*最多8个字符</span>', '#txt_km', {
            tips: [1, '#FEC7C7']
        })
        return false;
    }
    if (Kmmark != '') {
        if (Kmmark.length > 3) {
            Kmmark_K = 'K' + Kmmark.substring(0, Kmmark.length - 3) + '+' + Kmmark.substring(Kmmark.length - 3, Kmmark.length)
        } else {
            Kmmark_K = 'K0+' + Kmmark
        }
    }

    ymPrompt.confirmInfo({
        message: '确认要修改位置信息吗?',
        handler: function (tp) {
            //保存
            if (tp == 'ok') {
                //筛选被选中的信息框
                $('#tabs-603018 ul li').each(function (i) {
                    var inputchech = $(this).find('input').attr('checked');
                    if (inputchech == 'checked') {
                        AlarmId += $(this).find('input').val() + ',';
                        JsonAll += '{"ID":"' + $(this).find('input').val() + '","LINE_CODE":"' + Linecode + '","LINE_NAME":"' + Linename + '","POSITION_CODE":"' + Positioncode + '","POSITION_NAME":"' + Positionname + '","DIRECTION":"' + Direction + '","BRG_TUN_CODE":"' + Brgtuncode + '","BRG_TUN_NAME":"' + Brgtunname + '","POLE_NUMBER":"' + Polenumber + '","KM_MARK":"' + Kmmark_K + '","KM_MARK_NUMBER":"' + Kmmark + '"},';
                    }
                });
                JsonAll = JsonAll.substring(0, JsonAll.length - 1) + ']';
                JsonAll = eval('(' + JsonAll + ')');
                AlarmId = AlarmId.substr(0, AlarmId.length - 1);

                if (Kmmark.indexOf('+') >= 0) {
                    Kmmark = Kmmark.split('+')[0] + '%2B' + Kmmark.split('+')[1];
                }
                var url = "/Common/MDataAnalysis/RemoteHandlers/RepeatAlarm.ashx?type=" + type + "&AlarmId=" + AlarmId + '&Linecode=' + Linecode + '&Linename=' + Linename + '&Positioncode=' + Positioncode + '&Positionname=' + Positionname + '&Direction=' + Direction + '&Brgtuncode=' + Brgtuncode + '&Brgtunname=' + Brgtunname + '&Polenumber=' + Polenumber + '&Kmmark=' + Kmmark;

                $.ajax({
                    type: "POST",
                    url: url,
                    async: false,
                    cache: false,
                    success: function (result) {
                        var bool = result;

                        if (bool == 'True') {
                            ymPrompt.alert("保存成功", null, null, null, function () {
                                $('#edit_WZ_modal .close').click();
                                try {
                                    window.opener.changeAlarmJson(JsonAll);
                                } catch (e) {
                                    window.location.reload();
                                }

                                getListInfo();
                                window.location.reload();
                            });
                            

                        }
                        else {
                            ymPrompt.alert("保存失败", null, null, null, function () {
                                $('#edit_WZ_modal .close').click();
                            });
                        }
                    }
                })

            }
            if (tp == 'cancel') {
                $('#edit_WZ_modal .close').click();
            }
            if (tp == 'close') {
                $('#edit_WZ_modal .close').click();
            }
        }
    })
}
//获取信息
function getAlarminfo(alarm) {
    //getImgjson(alarm);   //得到红外分析串。
    alarmid = alarm;

    var url = "RemoteHandlers/GetlocAlarmImgInfo.ashx?alarmid=" + alarmid;
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        cache: false,
        success: function (result) {
            JsonAlarm = eval('(' + result + ')');

            if (JsonAlarm != undefined) {
                ImgNum = 0; // Imgjson.START_INDEX;
                InfoNum = 0;

                if ($('#slider').length > 0) {
                    $("#slider").slider({
                        value: 0,
                        min: 0,
                        max: JsonAlarm.PLAY_IDX.length - 1,
                        step: 1,
                        range: "min",
                        slide: function (event, ui) {
                            //  $("#FrameN").html("$" + ui.value);

                            if (event.keyCode == undefined)  //按钮不执行。
                            {
                                GoToFrame(parseInt(ui.value));
                            }
                        }
                    });
                }
                ImgShuffling(); //播放


                //重复报警信息栏的信息
                $('#box-new-loco1').html((JsonAlarm.km == "" ? "" : JsonAlarm.km + ',') + (JsonAlarm.POLE_NUMBER == "" ? "" : '支柱:' + JsonAlarm.POLE_NUMBER));

                //$('#box-new-time1').html(JsonAlarm.fssj + "&nbsp;&nbsp;(&nbsp;<a href=\"javascript:window.open('/C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=" + JsonAlarm.ID + '&v=' + version + "','_blank')\" style='color:#A8D376;'>详情>></a>&nbsp;)");

                $('#box-new-time1').html(JsonAlarm.fssj + "&nbsp;&nbsp;(&nbsp;<a href=\"javascript:toAlarmDetails('3C', '" + JsonAlarm.ID + "')\" style='color:#A8D376;'>详情>></a>&nbsp;)");

                $('#box-new-ch1').html(JsonAlarm.ch);
                $('#box-new-status1').html((JsonAlarm.STATUS_NAME == "" ? "" : JsonAlarm.STATUS_NAME + '，') + JsonAlarm.CODE_NAME);
                $('#box-new-bow1').html(JsonAlarm.BOW_TYPE);         
                $('#box-new-daoGAO1').html(JsonAlarm.DG + 'mm');
                $('#box-new-lachu1').html(JsonAlarm.LC + 'mm');
                $('#box-new-wenDu1').html(JsonAlarm.WD + '℃');
                $('#box-new-suDu1').html(JsonAlarm.SPEED + 'km/h');
                $('#box-new-hjwenDu1').html(JsonAlarm.HJWD + '℃');
                $('#box-new-armTYPE1').html(JsonAlarm.SEVERITY);
            }
        }
    });
}
//关闭定时器
function Suspended() {
    clearInterval(set); //关闭定时器
}



function Showbarinfo(e) {

    clearInterval(set);

    //点击的序号  与红外帧号对应。
    var _index = parseInt(e.category) - 1;  //kdo
    //var _index = parseInt(e.dataIndex);  //echarts


    //计算出播放序列数组对应项。

    for (var i = 0; i < JsonAlarm.PLAY_IDX.length; i++) {
        if (JsonAlarm.PLAY_IDX[i].IR == _index) {
            //找到对应的序号。
            ImgNum = i;
            break;
        }
    }
    play()
}

//点击跳转到某一帧上。
function GoToFrame(_index) {

    clearInterval(set);
    ImgNum = _index;
    Ispaly = 0;
    $("#note .note_a5").find('img').attr("src", "/C3/PC/MAlarmMonitoring/ImgTmp/play.png");

    play();
};


//跳转到缺陷帧
function GoToAlarmFrame() {

    clearInterval(set);

    //计算出缺陷帧
    for (var i = 0; i < JsonAlarm.PLAY_IDX.length; i++) {
        if (JsonAlarm.PLAY_IDX[i].FLAG == 1) {
            //找到对应的序号。
            ImgNum = i;
            break;
        }
    }
    Ispaly = 0;
    $("#note .note_a5").find('img').attr("src", "/C3/PC/MAlarmMonitoring/ImgTmp/play.png");

    play();
};

//鼠标点击弹出层
//        $(function () {
//            $('#hw').click(function () {
//                if (!$('#note').is(':visible')) {
//                    $('#note').css({ display: 'block', top: '-5px' }).animate({ top: '+5' }, 500);
//                }
//            });
//        });
function dbImgShuffling() {
    if (Ispaly == "1") {
        Ispaly = 0;
        Suspended();
        $("#note .note_a5").find('img').attr("src", "/C3/PC/MAlarmMonitoring/ImgTmp/play.png");
    } else {
        Ispaly = 1;
        ImgShuffling();
        $("#note .note_a5").find('img').attr("src", "/C3/PC/MAlarmMonitoring/ImgTmp/pause.png");
    }
    if (!$('#note').is(':visible')) {
        $('#note').css({ display: 'block', top: '-5px' }).animate({ top: 385 }, 500);
    }
}
//关闭层
function out() {
    $('#note').animate({ top: '100' }, 500, function () {
        $(this).css({ display: 'none', top: '-5px' });
    });
}
//播放/暂停
//        function dbImgShuffling() {
//            if (Ispaly == "1") {
//                Ispaly = 0;
//                Suspended();
//            } else {
//                Ispaly = 1;
//                ImgShuffling();
//            }
//        }
//上一张
function upImg() {
    ImgNum--;
    if (ImgNum < 0) {
        ImgNum = 0;
    }
    play();

}
//下一张
function lastImg() {
    ImgNum++;
    play();

}



var dirpath1; //前面路径
var josnpath1; //中间路径
var alarmid1; //默认第一个缺陷ID
var set1; //定时器
var imaname1; //imaname
var jpgname1; //jpgname
var Imgjson1;
var ImgNum1 = 0; //图片计数
var imaCount1;
var jpgCount1;
var InfoNum1 = 0; //信息计数
var locinfo1;
var Ispaly1 = 1;
var FLAG1; //是否是缺陷帧
var JsonAlarm1;


function play1() {
    if (ImgNum1 >= JsonAlarm1.PLAY_IDX.length) {
        ImgNum1 = 0;
    }

    if ($("#slider1").length > 0) {
        $("#slider1").slider("value", ImgNum1);
        $("#slider1").slider({ range: "min" });
    }

    var IR_index = JsonAlarm1.PLAY_IDX[ImgNum1].IR;  //红外帧
    var VI_index = JsonAlarm1.PLAY_IDX[ImgNum1].VI;  //可见帧
    var OA_index = JsonAlarm1.PLAY_IDX[ImgNum1].OA;  //全景帧A
    var OB_index = JsonAlarm1.PLAY_IDX[ImgNum1].OB;  //全景帧B

    FLAG1 = JsonAlarm1.PLAY_IDX[ImgNum1].FLAG;



    var temp = '最高温度：' + JsonAlarm1.FRAME_INFO_LIST[IR_index].TEMP_IRV + " &nbsp;";
    temp += '环境温度：' + JsonAlarm1.FRAME_INFO_LIST[IR_index].TEMP_ENV + " &nbsp;";
    temp += '导高值：' + JsonAlarm1.FRAME_INFO_LIST[IR_index].LINE_HEIGHT + " &nbsp;";
    temp += '拉出值：' + JsonAlarm1.FRAME_INFO_LIST[IR_index].PULLING_VALUE + " &nbsp;";
    temp += '速度：' + JsonAlarm1.FRAME_INFO_LIST[IR_index].SPEED + " &nbsp;";
    $('#locInfo1').html(temp);
    //                        }

    //红外换图
    $('#ImgHW').attr('src', JsonAlarm1.IR_PICS[IR_index])

    //可见光换图
    $('#ImgKJG').attr('src', JsonAlarm1.VI_PICS[VI_index])

    //全景
    if (JsonAlarm1.OA_PICS == "") {
        $('#Imgallimg').attr('src', JsonAlarm1.OB_PICS[OB_index]);
    } else {
        $('#Imgallimg').attr('src', JsonAlarm1.OA_PICS[OA_index]);
    }



    if ($('#locInfo1').length > 0) {
        $('#locInfo1').html();
    }
}

//为IMG赋值  播放
function ImgShuffling1() {

    play1();

    ImgNum1++;

    if (FLAG1 == 1) {
        clearInterval(set1); //关闭定时器 
        set1 = setInterval('ImgShuffling1()', 5000);
    }
    else {
        clearInterval(set1);
        set1 = setInterval('ImgShuffling1()', 500);
    }
}
//获取信息
function getAlarminfo1(alarm) {
    //getImgjson(alarm);   //得到红外分析串。
    alarmid1 = alarm;

    var url = "RemoteHandlers/GetlocAlarmImgInfo.ashx?alarmid=" + alarmid1;
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        cache: false,
        success: function (result) {
            JsonAlarm1 = eval('(' + result + ')');

            if (JsonAlarm1 != undefined) {
                ImgNum1 = 0; // Imgjson.START_INDEX;
                InfoNum1 = 0;
                if ($('#slider1').length > 0) {
                    $("#slider1").slider({
                        value: 0,
                        min: 0,
                        max: JsonAlarm1.PLAY_IDX.length - 1,
                        step: 1,
                        range: "min",
                        slide: function (event, ui) {
                            //  $("#FrameN").html("$" + ui.value);

                            if (event.keyCode == undefined)  //按钮不执行。
                            {
                                GoToFrame1(parseInt(ui.value));
                            }
                        }
                    });
                }
                ImgShuffling1(); //播放

                //最新报警信息栏的信息
                $('#box-new-loco').html((JsonAlarm1.KM_MARK == "" ? "" : JsonAlarm1.KM_MARK + ',') + (JsonAlarm1.POLE_NUMBER == "" ? "" : '支柱:' + JsonAlarm1.POLE_NUMBER));
                //$('#box-new-time').html(JsonAlarm1.fssj.replace(/-/g, '/') + "&nbsp;&nbsp;(&nbsp;<a href=\"javascript:window.open('/C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=" + JsonAlarm1.ID + '&v=' + version + "','_blank')\" style='color:#A8D376;'>详情>></a>&nbsp;)");

                $('#box-new-time').html(JsonAlarm1.fssj.replace(/-/g, '/') + "&nbsp;&nbsp;(&nbsp;<a href=\"javascript:toAlarmDetails('3C', '" + JsonAlarm1.ID + "')\" style='color:#A8D376;'>详情>></a>&nbsp;)");

                $('#box-new-ch').html(JsonAlarm1.ch);
                $('#box-new-status').html((JsonAlarm1.STATUS_NAME == "" ? "" : JsonAlarm1.STATUS_NAME + '，') + JsonAlarm1.CODE_NAME);
                $('#box-new-bow').html(JsonAlarm1.BOW_TYPE);
                $('#box-new-daoGAO').html(JsonAlarm1.DG + 'mm');
                $('#box-new-lachu').html(JsonAlarm1.LC + 'mm');
                $('#box-new-wenDu').html(JsonAlarm1.WD + '℃');
                $('#box-new-suDu').html(JsonAlarm1.SPEED + 'km/h');
                $('#box-new-hjwenDu').html(JsonAlarm1.HJWD + '℃');
                $('#box-new-armTYPE').html(JsonAlarm1.SEVERITY);
                


                $('#box-new-status').html((JsonAlarm1.STATUS_NAME == "" ? "" : JsonAlarm1.STATUS_NAME + '，') + JsonAlarm1.CODE_NAME);
                //数据加载完成时 延迟1秒关闭遮罩

                fullHide();
              

            }
        }
    });
}

//确认取消刷新页面信息
function fresh() {
    //getAlarminfo(alarmid);
    getAlarminfo1(alarmid1);
    
    if ($("#myModalLabel_2").text().trim() == "报警确认") {
        $("#List1_1>div>ul>li").each(function () {
            var thiscontetn = $(this).find("a").html();
            if (thiscontetn.indexOf("已确认") == -1) {
                var newcontent = thiscontetn.replace("已取消", "已确认").replace("新上报", "已确认").replace("已计划", "已确认").replace("已关闭", "已确认");
                $(this).find("a").html(newcontent);
            };
        });
        var newstatus = $("#box-new-status1").html();
        $("#box-new-status1").html(newstatus.replace("已取消", "已确认").replace("新上报", "已确认").replace("已计划", "已确认").replace("已关闭", "已确认"));
        //$('#mySUREimg').css("display", "none");
        //$('#mySUREimg1').css("display", "block");
        $('#box-new-armTYPE1').text($('#iframe_AlarmSure').contents()[0].defaultView.$('#Useverity').val());
    } else {
        $("#List1_1>div>ul>li").each(function () {
            var thiscontetn = $(this).find("a").html();
            if (thiscontetn.indexOf("已取消") == -1) {
                var newcontent = thiscontetn.replace("已确认", "已取消").replace("新上报", "已取消").replace("已计划", "已取消").replace("已关闭", "已取消");
                $(this).find("a").html(newcontent);
                };
            //var isChecked = $(':checkbox[name=tbCheckBox]');
            //var thiscontetn = [];
            //var newcontent = [];
            //for (i = 0; i < isChecked.length; i++) {
            //    thiscontetn[i] = $(isChecked[i]).parent('li').html();
            //    if (thiscontetn[i].indexOf("已取消") == -1 && $(isChecked[i]).attr("checked") == "checked") {
            //         newcontent[i] = thiscontetn[i].replace("已确认", "已取消").replace("新上报", "已取消").replace("已计划", "已取消").replace("已关闭", "已取消");
            //         $(isChecked[i]).parent('li').html(newcontent[i]);
            //         console.log($(thiscontetn[i]).find('a').html());
            //    }
            //}
        });
        //修改
        var newstatus = $("#box-new-status1").html();
            $("#box-new-status1").html(newstatus.replace("已确认", "已取消").replace("新上报", "已取消").replace("已计划", "已取消").replace("已关闭", "已取消"));
        ////修改
        //$('#mySUREimg').css("display", "block");
        //$('#mySUREimg1').css("display", "none");
    };
};

//关闭定时器
function Suspended1() {
    clearInterval(set1); //关闭定时器
}


function Showbarinfo1(e) {

    clearInterval(set1);

    //点击的序号  与红外帧号对应。
    var _index = parseInt(e.category) - 1;  //kdo
    //var _index = parseInt(e.dataIndex);  //echarts


    //计算出播放序列数组对应项。

    for (var i = 0; i < JsonAlarm1.PLAY_IDX.length; i++) {
        if (JsonAlarm1.PLAY_IDX[i].IR == _index) {
            //找到对应的序号。
            ImgNum1 = i;
            break;
        }
    }
    play1()
}

//点击跳转到某一帧上。
function GoToFrame1(_index) {

    clearInterval(set1);
    ImgNum1 = _index;
    Ispaly1 = 0;
    $("#note1 .note_a5").find('img').attr("src", "/C3/PC/MAlarmMonitoring/ImgTmp/play.png");

    play1();
};

//跳转到缺陷帧
function GoToAlarmFrame1() {

    clearInterval(set1);

    //计算出缺陷帧
    for (var i = 0; i < JsonAlarm1.PLAY_IDX.length; i++) {
        if (JsonAlarm1.PLAY_IDX[i].FLAG == 1) {
            //找到对应的序号。
            ImgNum1 = i;
            break;
        }
    }
    Ispaly = 0;
    $("#note1 .note_a5").find('img').attr("src", "/C3/PC/MAlarmMonitoring/ImgTmp/play.png");

    play1();
};

//播放/暂停
function dbImgShuffling1() {
    if (Ispaly1 == "1") {
        Ispaly1 = 0;
        Suspended1();
        $("#note1 .note_a5").find('img').attr("src", "/C3/PC/MAlarmMonitoring/ImgTmp/play.png");
    } else {
        Ispaly1 = 1;
        ImgShuffling1();
        $("#note1 .note_a5").find('img').attr("src", '/C3/PC/MAlarmMonitoring/ImgTmp/pause.png');
    }
    if (!$('#note1').is(':visible')) {
        $('#note1').css({ display: 'block', top: '-5px' }).animate({ top: 385 }, 500);
    }
}
//关闭层
function out1() {
    $('#note1').animate({ top: '0' }, 500, function () {
        $(this).css({ display: 'none', top: '-5px' });
    });
}

//上一张
function upImg1() {
    ImgNum1--;
    play1();

}
//下一张
function lastImg1() {
    ImgNum1++;
    play1();

}

//轮播js
var Speed_1 = 10; //速度(毫秒)
var Space_1 = 20; //每次移动(px)
var PageWidth_1 = 107 * 6; //翻页宽度
var interval_1 = 5000; //翻页间隔时间
var fill_1 = 0; //整体移位
var MoveTimeObj_1;
var MoveWay_1 = "right";
var Comp_1 = 0;
function GetObj(objName) {
    if (document.getElementById) {
        return eval('document.getElementById("' + objName + '")');
    } else {
        return eval('document.all.' + objName);
    }
}
function ISL_StopUp_1() {
    if (MoveWay_1 == "right") { return };
    clearInterval(MoveTimeObj_1);
    if ((GetObj('ISL_Cont_1').scrollLeft - fill_1) % PageWidth_1 != 0) {
        Comp_1 = fill_1 - (GetObj('ISL_Cont_1').scrollLeft % PageWidth_1);
        CompScr_1();
    } else { MoveLock_1 = false }
}
function ISL_ScrUp_1() {
    GetObj('ISL_Cont_1').scrollLeft -= Space_1
}
function ISL_GoUp_1() {
    MoveWay_1 = "left";
    MoveTimeObj_1 = setInterval('ISL_ScrUp_1();', Speed_1);
}
function ISL_GoDown_1() {
    if ($(window).width < 1025) {
        if (GetObj('ISL_Cont_1').scrollLeft + $(window).width() * 0.46 > $("#tabs-603018").width())
            return;
    } else {
        if (GetObj('ISL_Cont_1').scrollLeft + $(window).width() * 0.76 > $("#tabs-603018").width())
            return;
    }
    MoveWay_1 = "right";
    MoveTimeObj_1 = setInterval('ISL_ScrDown_1()', Speed_1)
}
function ISL_StopDown_1() {
    if ($(window).width < 1025) {
        if (GetObj('ISL_Cont_1').scrollLeft + $(window).width() * 0.46 > $("#tabs-603018").width())
            return;
    } else {
        if (GetObj('ISL_Cont_1').scrollLeft + $(window).width() * 0.76 > $("#tabs-603018").width()) {
            clearInterval(MoveTimeObj_1);
            return;
        }
    }
    if (MoveWay_1 == "left") { return };
    clearInterval(MoveTimeObj_1);
    Comp_1 = PageWidth_1 - GetObj('ISL_Cont_1').scrollLeft % PageWidth_1 + fill_1;
    CompScr_1();

}
function ISL_ScrDown_1() {
    if (GetObj('ISL_Cont_1').scrollLeft + $(window).width() * 0.76 > $("#tabs-603018").width()) {
    }
    else {
        GetObj('ISL_Cont_1').scrollLeft += Space_1;
    }
}
function CompScr_1() {
    var num, TempSpeed = Speed_1, TempSpace = Space_1;
    if (Math.abs(Comp_1) < PageWidth_1 / 2) {
        TempSpace = Math.round(Math.abs(Comp_1 / Space_1));
        if (TempSpace < 1) { TempSpace = 1 }

    }
    if (Comp_1 < 0) {
        if (Comp_1 < -TempSpace) { Comp_1 += TempSpace; num = TempSpace } else { num = -Comp_1; Comp_1 = 0 }
        GetObj('ISL_Cont_1').scrollLeft -= num; setTimeout('CompScr_1()', TempSpeed)
    } else {
        if (Comp_1 > TempSpace) { Comp_1 -= TempSpace; num = TempSpace } else { num = Comp_1; Comp_1 = 0 }
        GetObj('ISL_Cont_1').scrollLeft += num; setTimeout('CompScr_1()', TempSpeed)
    }
}

/**
 * @desc 点击echart图表数据执行的方法
 * @param 
 */
function eConsole(e, info_type) {
    if ('latest_alarm' === info_type) {
        Suspended1(); //关闭定时器
        var _index = parseInt(e.dataIndex); //点击的序号  与帧号对应。
        for (var i = 0; i < JsonAlarm.PLAY_IDX.length; i++) { //计算出播放序列数组对应项。
            if (JsonAlarm.PLAY_IDX[i].IR == _index) { //找到对应的序号。
                ImgNum1 = i;
                break;
            }
        }
        play1(); //播放图像
        $('#note1 .note_a5').find('img').attr('src', '/C3/PC/MAlarmMonitoring/ImgTmp/play.png');
    }
    if ('repeat_alarm' === info_type) {
        Suspended(); //关闭定时器
        var _index = parseInt(e.dataIndex); //点击的序号  与帧号对应。
        for (var i = 0; i < JsonAlarm.PLAY_IDX.length; i++) { //计算出播放序列数组对应项。
            if (JsonAlarm.PLAY_IDX[i].IR == _index) { //找到对应的序号。
                ImgNum = i;
                break;
            }
        }
        play(); //播放图像
        $('#note .note_a5').find('img').attr('src', '/C3/PC/MAlarmMonitoring/ImgTmp/play.png');
    }
}