var isShow; //是否是同点对比false为同点对比
var htmlJson = window.opener.AlarmJson; //全局JSON  某组重复报警集合
$(document).ready(function () {
    //只有在已确认的重复报警中alarmid才会有值
    if (GetQueryString("alarmid")) {
        fullShow();
        $.ajax({
            type: "POST",
            data: { "alarmid": GetQueryString("alarmid") },
            url: "/Common/MDataAnalysis/RemoteHandlers/RepeatAlarm.ashx?type=getJson",
            async: false,
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
        //        var htmlJson = window.opener.AlarmJson;
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
            if (htmlJson.GT == "false" || getConfig('debug') != "1")
                label = htmlJson[i].DETECT_DEVICE_CODE + "&nbsp;&nbsp;" + htmlJson[i].RAISED_TIME + "&nbsp;&nbsp;" + htmlJson[i].LINE_NAME + "&nbsp;&nbsp;" + htmlJson[i].POSITION_NAME + "&nbsp;&nbsp;" + htmlJson[i].POSITION_NAME + "&nbsp;&nbsp;" + htmlJson[i].KM_MARK + "&nbsp;&nbsp;" + htmlJson[i].STATUS_NAME;
            else
                label = htmlJson[i].DETECT_DEVICE_CODE + "&nbsp;&nbsp;" + htmlJson[i].RAISED_TIME + "&nbsp;&nbsp;东经" + htmlJson[i].GIS_X + "&nbsp;&nbsp;北纬" + htmlJson[i].GIS_Y + "&nbsp;&nbsp;" + htmlJson[i].STATUS_NAME;
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
    $('#citySel').mySelectTree({
        CateGory: 'AFCODE',
        CodeType: '3C',
        IsSelectChildren: false,
        IsSelectLastOne: true
    });

    document.getElementById("ImgHW").style.height = (window.screen.height - 251 - 36) / 2 + "px";
    document.getElementById("ImgKJG").style.height = (window.screen.height - 251 - 36) / 2 + "px";
    document.getElementById("hw").style.height = (window.screen.height - 251 - 36) / 2 + "px";
    document.getElementById("kjg").style.height = (window.screen.height - 251 - 36) / 2 + "px";
    document.getElementById("linechart1").style.left = (window.screen.width / 2) - 20 - 300 + "px";
    document.getElementById("linechart1").style.top = (window.screen.height - 275) / 2 + 120 - 195 + 10 + "px";
    document.getElementById("linechart").style.left = (window.screen.width / 2) - 20 - 300 + "px";
    document.getElementById("linechart").style.top = (window.screen.height - 295) + "px";
    $(".carousel-control1").css("top", window.screen.height - 40);
    getListInfo();
    getAlarminfo(alarmid);
    getAlarminfo1(alarmid1);
    urlControl_new(); //控制按钮状态

    //按钮移上去变颜色

    $(".note_a1").hover(function () {
        $(this).find("img").attr("src", "/C3/PC/MAlarmMonitoring/ImgTmp/check-light.png");
    }, function () {
        $(this).find("img").attr("src", "/C3/PC/MAlarmMonitoring/ImgTmp/check.png");
    })
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
    //加载批量位置编辑模态框
    $('#edit_WZ').click(function () {
        $('#edit_WZ_modal').modal();
    });

};

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

    var IR_index = JsonAlarm.PLAY_IDX[ImgNum].IR;  //红外帧
    var VI_index = JsonAlarm.PLAY_IDX[ImgNum].VI;  //可见帧

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
                        <ul class='nav nav-tabs' style='margin-bottom: 0px;'>\
                        ";
    $(list).each(function (i) {
        if (i >= 0) {

            //判断是否传入ID，或ID是否为第一条,来设置当前选中项
            var isActive = "class='theHist'";
            if (GetQueryString("id") != undefined && GetQueryString("id") != list[0].ID) {
                if (this.ID == GetQueryString("id"))
                    isActive = "class='active'";
            }
            else {
                if (i == 1)
                    isActive = "class='active'";
            }
            if (i == 0) {
                html += "<li disabled='disabled' class='theNew'  style='position:relative;background-color: rgba(19, 36, 127, 0.75);'><div class='new'></div><input name='tbCheckBox' type='checkbox' checked='checked' style='position:absolute;top:8px;' value='" + this.ID + "'/><a >";
            }
            else {
                isActive = isActive.replace("active", "active theHist");
                html += "<li " + isActive + " style='position:relative;'><input name='tbCheckBox' type='checkbox' checked='checked' style='position:absolute;top:8px;' value='" + this.ID + "'/><a href='#' data-toggle='tab' onclick=getAlarminfo('" + this.ID + "')>";
            }
            html += this.DETECT_DEVICE_CODE + "<br />";
            html += this.RAISED_TIME + "<br />";
            //线路条件查询
            if (this.TYPE == "line" || getConfig('debug') != "1") {
                html += this.LINE_NAME + "&nbsp;" + this.POSITION_NAME + "&nbsp;" + this.DIRECTION + "&nbsp;" + this.KM_MARK + (this.POLE_NUMBER == "" ? "" : "&nbsp;" + this.POLE_NUMBER + "支柱") + "<br />";
            }
            //gps条件查询
            else {
                if (this.LINE_NAME != null && this.LINE_NAME != "") {
                    html += this.LINE_NAME + "&nbsp;" + this.POSITION_NAME + "&nbsp;" + this.DIRECTION + "&nbsp;" + this.KM_MARK + (this.POLE_NUMBER == "" ? "" : "&nbsp;" + this.POLE_NUMBER + "支柱") + "<br />";
                }
                html += "东经" + this.GIS_X;
                html += "北纬" + this.GIS_Y + "<br />";
            }
            html += " " + this.STATUS_NAME + "&nbsp;" + this.CODE_NAME;
            html += "</a></li>";
        }
    });
    html += "</ul></div>";
    var content = "";

    //线路条件查询
    if (list[0].TYPE == "line"||getConfig('debug') != "1") {
        content += (list[0].LINE_NAME == "" ? "" : list[0].LINE_NAME + ",") + (list[0].POSITION_NAME == "" ? "" : list[0].POSITION_NAME + ",") + list[0].DIRECTION + "," + list[0].KM_MARK + (list[0].POLE_NUMBER == "" ? "" : "," + list[0].POLE_NUMBER + "号杆");
    }
    //gps条件查询
    else {
        if (list[0].LINE_NAME != null && list[0].LINE_NAME != "") {
            content += (list[0].LINE_NAME == "" ? "" : list[0].LINE_NAME + ",") + (list[0].POSITION_NAME == "" ? "" : list[0].POSITION_NAME + ",") + list[0].DIRECTION + "," + list[0].KM_MARK + (list[0].POLE_NUMBER == "" ? "" : "," + list[0].POLE_NUMBER + "号杆");
        }
        content += "东经" + list[0].GIS_X + "北纬" + list[0].GIS_Y;
    }
    $("#repeatDetail").html(content + "周围" + (Distance ? Distance + "米范围内" : "") + "在" + list[list.length - 1].RAISED_TIME
                                    + "到" + list[0].RAISED_TIME + "之间，检测出" + list.length + "次疑似缺陷告警");

    $("#List1_1").html(html);

    //批量编辑位置默认信息
    $('#lineselect').mySelect({
        tag: 'LINE',
        async: false,
        defaultText: '暂无'  //线路名
    });
    $('#lineselect').val(list[0].LINE_CODE);

    $('#positionselect').mySelect({
        tag: 'STATIONSECTION',
        async: false,
        code: list[0].LINE_CODE,
        defaultText: '暂无'  //区站名
    });
    $('#positionselect').val(list[0].POSITION_CODE);

    $('#brgtunselect').mySelect({
        tag: 'BRIDGETUNE',
        async: false,
        code: list[0].POSITION_CODE,
        defaultText: '暂无'  //桥隧名
    });
    $('#brgtunselect').val(list[0].BRG_TUN_CODE);

    $('#POLE_DIRECTION').val(list[0].DIRECTION);  //行别
    $('#POLE_NO').val(list[0].POLE_NUMBER);   //杆号
    $('#txt_km').val(list[0].KM_MARK);    //公里标
}

//保存信息修改
function keepinfo() {
    var type = 'save';
    var list = window.opener.AlarmJson;
    var AlarmId = '';
    //$(list).each(function(i){
    //    AlarmId += list[i].ID+','
    //})

    //筛选被选中的信息框
    $('#tabs-603018 ul li').each(function () {
        var inputchech = $(this).find('input').attr('checked');
        if (inputchech == 'checked') {
            AlarmId += $(this).find('input').val() + ',';
        }
    })
    AlarmId = AlarmId.substr(0, AlarmId.length - 1);
    var Linename = $('#lineselect').val(); //线路
    var Positionname = $('#positionselect').val(); //区站
    var Direction = $('#POLE_DIRECTION').val(); //行别
    var Brgtunname = $('#brgtunselect').val(); //桥隧
    var Polenumber = $('#POLE_NO').val(); //杆号
    var Kmmark = $('#txt_km').val(); //公里标

    var url = "/Common/MDataAnalysis/RemoteHandlers/RepeatAlarm.ashx?type=" + type + "&AlarmId=" + AlarmId + '&Linename=' + Linename + '&Positionname=' + Positionname + '&Direction=' + Direction + '&Brgtunname=' + Brgtunname + '&Polenumber=' + Polenumber + '&Kmmark=' + Kmmark;

    $.ajax({
        type: "POST",
        url: url,
        async: false,
        cache: false,
        success: function (result) {
            var bool = result;
            //保存
            ymPrompt.confirmInfo({
                message: '确认要修改位置信息吗?',
                handler: function (tp) {
                    if (tp == 'ok') {
                        if (bool == 'True') {
                            ymPrompt.alert("保存成功", null, null, null, function () {
                                $('#edit_WZ_modal .close').click();
                            });
                            getListInfo()
                        }
                        else {
                            ymPrompt.alert("保存失败", null, null, null, function () {
                                $('#edit_WZ_modal .close').click();
                            });
                        }
                    }
                    if (tp == 'cancel') {
                        //  cancelFn();
                        $('#edit_WZ_modal .close').click();
                    }
                    if (tp == 'close') {
                        //   closeFn()
                        $('#edit_WZ_modal .close').click();
                    }
                }
            });
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
                var temp = "";
                //线路条件分析
                if (htmlJson != null && htmlJson.length > 0 && htmlJson[0].TYPE == "line") {
                    temp = '&nbsp;&nbsp;&nbsp;设备编号：' + JsonAlarm.ch + "&nbsp;";
                    if (JsonAlarm.line != null && JsonAlarm.line != "")
                        temp += '线路：' + JsonAlarm.line + " &nbsp;";
                    if (JsonAlarm.position != null && JsonAlarm.position != "")
                        temp += '区站：' + JsonAlarm.position + " &nbsp;";
                    if (JsonAlarm.BRG_TUN_NAME != null && JsonAlarm.BRG_TUN_NAME != "")
                        temp += '桥隧：' + JsonAlarm.BRG_TUN_NAME + " &nbsp;";
                    if (JsonAlarm.xb != null && JsonAlarm.xb != "")
                        temp += '行别：' + JsonAlarm.xb + " &nbsp;";
                    if (JsonAlarm.km != null && JsonAlarm.km != "")
                        temp += '公里标：' + JsonAlarm.km + " &nbsp;";
                    if (JsonAlarm.POLE_NUMBER != null && JsonAlarm.POLE_NUMBER != "")
                        temp += '支柱：' + JsonAlarm.POLE_NUMBER + " &nbsp;";
                    if (JsonAlarm.BOW_TYPE != null && JsonAlarm.BOW_TYPE != "")
                        temp += '弓位置：' + JsonAlarm.BOW_TYPE + " &nbsp;";
                    if (JsonAlarm.fssj != null && JsonAlarm.fssj != "")
                        temp += '发生时间：' + JsonAlarm.fssj + " &nbsp;";
                }
                else {
                    temp = '&nbsp;&nbsp;&nbsp;设备编号：' + JsonAlarm.ch + "&nbsp;";
                    if (JsonAlarm.line != null && JsonAlarm.line != "") {
                        if (JsonAlarm.line != null && JsonAlarm.line != "")
                            temp += '线路：' + JsonAlarm.line + " &nbsp;";
                        if (JsonAlarm.position != null && JsonAlarm.position != "")
                            temp += '区站：' + JsonAlarm.position + " &nbsp;";
                        if (JsonAlarm.BRG_TUN_NAME != null && JsonAlarm.BRG_TUN_NAME != "")
                            temp += '桥隧：' + JsonAlarm.BRG_TUN_NAME + " &nbsp;";
                        if (JsonAlarm.xb != null && JsonAlarm.xb != "")
                            temp += '行别：' + JsonAlarm.xb + " &nbsp;";
                        if (JsonAlarm.km != null && JsonAlarm.km != "")
                            temp += '公里标：' + JsonAlarm.km + " &nbsp;";
                        if (JsonAlarm.POLE_NUMBER != null && JsonAlarm.POLE_NUMBER != "")
                            temp += '支柱：' + JsonAlarm.POLE_NUMBER + " &nbsp;";
                    }
                    if (JsonAlarm.BOW_TYPE != null && JsonAlarm.BOW_TYPE != "")
                        temp += '弓位置：' + JsonAlarm.BOW_TYPE + " &nbsp;";
                    if (JsonAlarm.gis_x != null && JsonAlarm.gis_x != "")
                        temp += '东经：' + JsonAlarm.gis_x + " &nbsp;";
                    if (JsonAlarm.gis_y != null && JsonAlarm.gis_y != "")
                        temp += '北纬：' + JsonAlarm.gis_y + " &nbsp;";
                    if (JsonAlarm.fssj != null && JsonAlarm.fssj != "")
                        temp += '发生时间：' + JsonAlarm.fssj + " &nbsp;";
                }
                temp += "&nbsp;&nbsp;<a href=\"javascript:window.open('/C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=" + JsonAlarm.ID + '&v=' + version + "','_blank')\">详情</a>";
                $('#descript1').html(temp);
                ImgShuffling(); //播放

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
    } else {
        Ispaly = 1;
        ImgShuffling();
    }
    if (!$('#note').is(':visible')) {
        $('#note').css({ display: 'block', top: '-5px' }).animate({ top: window.screen.height * 0.532 }, 500);
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

    var IR_index = JsonAlarm1.PLAY_IDX[ImgNum1].IR;  //红外帧
    var VI_index = JsonAlarm1.PLAY_IDX[ImgNum1].VI;  //可见帧

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
                var temp = "";
                //线路条件分析
                if (htmlJson != null && htmlJson.length > 0 && htmlJson[0].TYPE == "line") {
                    temp = '&nbsp;&nbsp;&nbsp;设备编号：' + JsonAlarm1.ch + "&nbsp;";
                    if (JsonAlarm1.line != null && JsonAlarm1.line != "")
                        temp += '线路：' + JsonAlarm1.line + " &nbsp;";
                    if (JsonAlarm1.position != null && JsonAlarm1.position != "")
                        temp += '区站：' + JsonAlarm1.position + " &nbsp;";
                    if (JsonAlarm1.BRG_TUN_NAME != null && JsonAlarm1.BRG_TUN_NAME != "")
                        temp += '桥隧：' + JsonAlarm1.BRG_TUN_NAME + " &nbsp;";
                    if (JsonAlarm1.xb != null && JsonAlarm1.xb != "")
                        temp += '行别：' + JsonAlarm1.xb + " &nbsp;";
                    if (JsonAlarm1.km != null && JsonAlarm1.km != "")
                        temp += '公里标：' + JsonAlarm1.km + " &nbsp;";
                    if (JsonAlarm1.POLE_NUMBER != null && JsonAlarm1.POLE_NUMBER != "")
                        temp += '支柱：' + JsonAlarm1.POLE_NUMBER + " &nbsp;";
                    if (JsonAlarm1.BOW_TYPE != null && JsonAlarm1.BOW_TYPE != "")
                        temp += '弓位置：' + JsonAlarm1.BOW_TYPE + " &nbsp;";
                    if (JsonAlarm1.fssj != null && JsonAlarm1.fssj != "")
                        temp += '发生时间：' + JsonAlarm1.fssj + " &nbsp;";
                }
                else {
                    temp = '&nbsp;&nbsp;&nbsp;设备编号：' + JsonAlarm1.ch + "&nbsp;";
                    if (JsonAlarm1.line != null && JsonAlarm1.line != "") {
                        if (JsonAlarm1.line != null && JsonAlarm1.line != "")
                            temp += '线路：' + JsonAlarm1.line + " &nbsp;";
                        if (JsonAlarm1.position != null && JsonAlarm1.position != "")
                            temp += '区站：' + JsonAlarm1.position + " &nbsp;";
                        if (JsonAlarm1.BRG_TUN_NAME != null && JsonAlarm1.BRG_TUN_NAME != "")
                            temp += '桥隧：' + JsonAlarm1.BRG_TUN_NAME + " &nbsp;";
                        if (JsonAlarm1.xb != null && JsonAlarm1.xb != "")
                            temp += '行别：' + JsonAlarm1.xb + " &nbsp;";
                        if (JsonAlarm1.km != null && JsonAlarm1.km != "")
                            temp += '公里标：' + JsonAlarm1.km + " &nbsp;";
                        if (JsonAlarm1.POLE_NUMBER != null && JsonAlarm1.POLE_NUMBER != "")
                            temp += '支柱：' + JsonAlarm1.POLE_NUMBER + " &nbsp;";
                    }
                    if (JsonAlarm1.BOW_TYPE != null && JsonAlarm1.BOW_TYPE != "")
                        temp += '弓位置：' + JsonAlarm1.BOW_TYPE + " &nbsp;";
                    if (JsonAlarm1.gis_x != null && JsonAlarm1.gis_x != "")
                        temp += '东经：' + JsonAlarm1.gis_x + " &nbsp;";
                    if (JsonAlarm1.gis_y != null && JsonAlarm1.gis_y != "")
                        temp += '北纬：' + JsonAlarm1.gis_y + " &nbsp;";
                    if (JsonAlarm1.fssj != null && JsonAlarm1.fssj != "")
                        temp += '发生时间：' + JsonAlarm1.fssj + " &nbsp;";
                }
                temp += "&nbsp;&nbsp;<a href=\"javascript:window.open('/C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=" + JsonAlarm1.ID + '&v=' + version + "','_blank')\">详情</a>";
                $('#descript').html(temp);
                ImgShuffling1(); //播放
                //数据加载完成时 延迟1秒关闭遮罩
                setTimeout("fullHide()", 1000);
            }
        }
    });
}
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
    play()
}


//鼠标点击弹出层
//        $(function () {
//            $('#ImgHW').click(function () {
//                if (!$('#note').is(':visible')) {
//                    $('#note').css({ display: 'block', top: '-5px' }).animate({ top: '+5' }, 500);
//                }
//            });
//        });
function dbImgShuffling1() {
    if (Ispaly1 == "1") {
        Ispaly1 = 0;
        Suspended1();
    } else {
        Ispaly1 = 1;
        ImgShuffling1();
    }
    if (!$('#note1').is(':visible')) {
        $('#note1').css({ display: 'block', top: '-5px' }).animate({ top: window.screen.height * 0.099 }, 500);
    }
}
//关闭层
function out1() {
    $('#note1').animate({ top: '0' }, 500, function () {
        $(this).css({ display: 'none', top: '-5px' });
    });
}
//播放/暂停
//        function dbImgShuffling1() {
//            if (Ispaly == "1") {
//                Ispaly = 0;
//                Suspended1();
//            } else {
//                Ispaly = 1;
//                ImgShuffling1();
//            }
//        }
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

var islookwd = 1;
function lookWD() {
    if (islookwd == "1") {
        islookwd = 0;
        document.getElementById("linechart").style.display = "";
        loadC3Echarts();
    } else {
        islookwd = 1;
        document.getElementById("linechart").style.display = "none";
    }
}
var islookwd1 = 1;
function lookWD1() {
    if (islookwd1 == "1") {
        islookwd1 = 0;
        document.getElementById("linechart1").style.display = "";
        loadC3Echarts1();
    } else {
        islookwd1 = 1;
        document.getElementById("linechart1").style.display = "none";
    }
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
    if (GetObj('ISL_Cont_1').scrollLeft + $(window).width() * 0.9 > $("#tabs-603018").width())
        return;
    MoveWay_1 = "right";
    MoveTimeObj_1 = setInterval('ISL_ScrDown_1()', Speed_1)
}
function ISL_StopDown_1() {
    if (GetObj('ISL_Cont_1').scrollLeft + $(window).width() * 0.9 > $("#tabs-603018").width()) {
        clearInterval(MoveTimeObj_1);
        return;
    }
    if (MoveWay_1 == "left") { return };
    clearInterval(MoveTimeObj_1);
    Comp_1 = PageWidth_1 - GetObj('ISL_Cont_1').scrollLeft % PageWidth_1 + fill_1;
    CompScr_1();

}
function ISL_ScrDown_1() {
    if (GetObj('ISL_Cont_1').scrollLeft + $(window).width() * 0.9 > $("#tabs-603018").width()) {
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

////////////////////////////////

//$(function () {
//    var btnType = "";
//    $("#E_btnOk").click(function () {
//        ckBox();
//        document.getElementById('modal-check').click();
//        btnType = "btnOk"
//    });
//    $("#E_btnCan").click(function () {
//        ckBox();
//        document.getElementById('modal-check').click();
//        btnType = "btnCan"
//    });
//    $("#btnSure").click(function () {
//        $("#btncols").click();
//        var checkbox = $(":checkbox:checked[name='checkBox']");
//        for (var i = 0; i < checkbox.length; i++) {
//            $("#alarmid").val("," + checkbox[i].value);
//        }
//        $("#alarmid").val($("#alarmid").val().substring(1, $("#alarmid").val().length));
//        if (btnType == "btnOk")
//            $("#E_btnOk2").click();
//        else
//            $("#E_btnCan2").click();
//    });
//})

//function ckBox() {
//    $(":checkbox[name='tbCheckBox']").each(function (i) {
//        if ($(this).attr("checked") == "checked") {
//            $(":checkbox[name='checkBox'][value='" + $(this).val() + "']").attr("checked", "checked");
//        } else {
//            $(":checkbox[name='checkBox'][value='" + $(this).val() + "']").removeAttr("checked");
//        }
//    });

//}