/*========================================================================================*
* 功能说明：国铁自研设备视频直播
* 作    者： zzj
* 版本日期：2015.8.7

*=======================================================================================*/
var json_config = '';
var zyGT2Play = false;
var mode = "playbox_mode1";
var playNo = 0;
var debug;
var timeList; //历史回放时间段
var RecTime; //回放时间，目前动车回放使用
var replayTime; //详细页传来的缺陷发生时间
var replayTime_hmc = ''; // 详细页传来的缺陷发生时间，毫秒差。
var _min = -2880 * 60; //回放播放条最大值
var RecTime_Current = '';//当前回放时间戳
var Mode_prev_next = "next"; //播放上一帧，还是下一帧。决定是加步长还是减步长。


function bind() {
    var page = GetQueryString("page");

    if (page != undefined && page == 'meta_big') {
        // $('#div_ckLink').show(); //隐藏直连非直连
    }


    debug = getConfig("debug");
    if (debug == "1") {
        $('.debug').show();
    }
    else {
        $('.debug').hide();
    }

    DirctLink = getConfig("DirctLink");
    if (DirctLink == "1") {
        $('#cb_linkQ').attr('checked', 'checked');
    }


    //GetLocaPlayMemo_GT({
    //    locomotiveCode: treeNode.name       
    //})

    $('#locomotive_no').change(function () {
        alert($(this).text());
    });





    $('#ul_select_type>li').click(function () {

        $('#txt_type').text($(this).text());
        ReSetImg(); //切换时，图片还原默认。
        changeImgDisplay_label();
        playNo++;
        Stop_GT();
        setTimeout(Play_GT, 2000);

    });

    $('#ul_select_AB_jc>li').click(function () {

        $('#txt_AB_jc').text($(this).text());
        ReSetImg(); //切换时，图片还原默认。
        changeImgDisplay_label();
        playNo++;
        Stop_GT();
        setTimeout(Play_GT, 2000);

    });

    $('#ul_select_type_jc>li').click(function () {

        $('#txt_type_jc').text($(this).text());
        ReSetImg(); //切换时，图片还原默认。
        changeImgDisplay_label();
        playNo++;
        Stop_GT();
        setTimeout(Play_GT, 2000);

    });

    //机车，直播、回放选择
    $('#ul_select_playmode_jc>li').click(function () {

        $('#txt_playmode_jc').text($(this).text());
        if ($('#txt_playmode_jc').text() == "回放") {
            $('#btn_recOption_GT').show();
            RecSetUp();
            $('#playTime').show();
        }
        else {
            $('#playTime').hide();
            RecTime = '';
            $('#btn_recOption_GT').hide();
            ReSetImg(); //切换时，图片还原默认。
            playNo++;
            Stop_GT();
            setTimeout(Play_GT, 2000);
        }
    });

    //动车 直播、回放选择
    $('#ul_select_playmode_dc>li').click(function () {
        $('#txt_playmode_dc').text($(this).text());
        if ($('#txt_playmode_dc').text() == "回放") {
            RecSetUp();
            Stop_GT();//暂停
            $('#playTime').show();
            //    $('#playbtn_prev_next').show();

            SetRec_DC(); //设置回放图片质量。
        }
        else {
            $('#playTime').hide();
            RecTime = '';
            playNo++;
            Stop_GT();
            setTimeout(Play_GT, 2000);
        }
    });


    $('#btn_recOption_GT').click(function () {
        //回放设置按钮。  
        RecSetUp();
    });

    $('#btn_RecOption_Ok').click(function () {

        SetHistoryPastTime();

    });

    $('#btn_sliderTime_Ok').click(function () {
        if (json_config.VIDEO_VENDOR == "GT2-HIKVISION-DC") {
            $('#playTime').show();  //动车显示时间
        } else {
            $('#playTime').show();
        }

        RecTime = '';
        var _v = parseInt($("#slider_time").slider("value"));

        var cDate2 = new Date($("#startdate").val());

        cDate2.setTime(cDate2.getTime()); //减N秒。
        var cdate2_times = parseInt(cDate2.getTime());  //得到毫秒级时间戳  13位
        RecTime_Current = cdate2_times;//设置回放当前时间戳



        if (json_config.VIDEO_VENDOR == "GT2-HIKVISION-DC") {
            //动车回放开始

            RecTime = 1000 * 60 * _v;

            playNo++;
            // Stop_GT();
            setTimeout(Play_GT, 500);

            layer.closeAll();
        }
        else {
            //if (json_config.DEVICE_VERSION.indexOf("B") == -1) {
                RecTime = 1000 * 60 * _v;
                playNo++;
                setTimeout(Play_GT, 500);
                layer.closeAll();
            //} else {
            //    //机车回放开始得到秒级时间戳10位
            //    if (timeList.length <= 0) {
            //        layer.msg("回放时间列表为空");
            //    }

            //    var cdate2_times_10 = cdate2_times / 1000;
            //    var _StartTime = FindTime(cdate2_times_10); //确定startTime.
            //    var timeSpan = cdate2_times_10 - _StartTime; // 开始时间戳要小些。得到时间差值。
            //    $('#select_time').val(_StartTime);
            //    $('#Txt_rec_second').val(timeSpan);
            //    changeHisDate();
            //    SetHistoryPastTime();
            //}
        }

        setTimeout(loadLocaInfo, 700); //刷新位置


    });

    //图像大小设置
    $('#ul_definition>li').click(function () {

        $('#txt_definition').text($(this).text());


        switch ($('#txt_definition').text()) {
            case "标清":
                //   $("#slider").slider("value", 30);
                //    $('#slider_txt').text(30);
                break;
            case "高清":
                //    $("#slider").slider("value", 60);
                //    $('#slider_txt').text(60);
                break;
            case "超清":
                //    $("#slider").slider("value", 95);
                //    $('#slider_txt').text(95);
                break;

        }

        SetRec_DC(); //设置回放图片质量。

        // changeImgDisplay_label();
        playNo++;
        Stop_GT();
        setTimeout(Play_GT, 2000);




    });

    $('#btn_play_GT').click(function () {
        Play_GT();
    });

    //停止
    $('#btn_stop_GT').click(function () {
        Stop_GT();
    });

    //图像质量滚动条
    $("#slider").slider({
        value: 80,
        min: 1,
        max: 95,
        step: 1,
        slide: function (event, ui) {

            if (event.keyCode == undefined)  //按钮不执行。
            {
                $('#slider_txt').text(ui.value);
                //  GoToFrame(parseInt(ui.value));


            }
        },
        change: function (event, ui) {
            if (event.keyCode == undefined) {
                //非按键操作
                if (event.originalEvent == undefined) {
                    //设置值
                }
                else {
                    //鼠标点击
                    SetRec_DC(); //设置回放图片质量。
                }
            }
            else {
                //按键操作
            }
        }
    });


    var _min = -2880 * 60;
    var _v = -10;
    var replay = GetQueryString("replay");

    if (replay != undefined && replay != "") {

        // $('#div_ckLink').show(); //隐藏直连非直连


        $('#txt_playmode_dc').text("回放");
        //$('#playTime').show();
        setTimeout(RecSetUp, 1000);

        replayTime = GetQueryString("playtime"); //开始时间戳 发生时间戳
        var thisTime = new Date();
        replayTime_hmc = replayTime - thisTime.getTime();

        var SUMMARYDICCODE = GetQueryString("SUMMARYDIC_code");
        if (SUMMARYDICCODE == "AFCODEBOWBROKEN") {   //报警类型为打弓异常
            _v = parseInt(replayTime_hmc / 1000) - getConfig("VedioReplayTime");
        } else {
            _v = parseInt(replayTime_hmc / 1000) - 10;
        };
        _min = _v - 60 * 30;


        wz = GetQueryString("wz"); //弓位置  A B  4 5 10 13 缺陷详细页视频回放

        if (wz.indexOf('弓') > 0) {
            // $('#txt_AB').text('四车');
            // $('#txt_AB_jc').text('A弓');

            $('#txt_AB_jc').text(wz);

        }
        else {
            // $('#txt_AB').text('五车');
            // $('#txt_AB_jc').text('B弓');
            $('#txt_AB').text(wz);

        }

    }



    //回放时间滚动条设置
    $("#slider_time").slider({
        value: _v,
        min: _min,
        max: -1,
        step: 1,
        slide: function (event, ui) {

            if (event.keyCode == undefined)  //按钮不执行。
            {
                change_slider_time(ui.value);
            }
        }
        //,change: function (event, ui) {
        //    if (event.keyCode == undefined) {
        //        //非按键操作
        //        if (event.originalEvent == undefined) {
        //            //设置值
        //        }
        //        else {                 
        //            change_slider_time(ui.value);
        //        }
        //    }
        //    else {
        //        //按键操作
        //    }
        //}
    });

    var _n = parseInt($("#slider_time").slider("value"));
    change_slider_time(_n);



    $('#btn_prev').click(function () {
        //上一帧
        Mode_prev_next = 'prev';
        zyGT2Play = true;
        Play_GT_Step2();
    });

    $('#btn_next').click(function () {
        //下一帧
        Mode_prev_next = 'next';
        zyGT2Play = true;
        Play_GT_Step2();
    });



};


function MapToggle() {
    if ($('#Iframe_gis').is(":visible") == true) {
        $('#Iframe_gis').hide();
    }
    else {
        $('#Iframe_gis').attr('src', '/C3/PC/MRTA/GIS_Loca.html?Loca=' + $('#locomotive_no').text() + '&v=' + version);
        $('#Iframe_gis').show().css("z-index", "10502");
    }


};

//加载车辆运行状态数据
function loadLocaInfo() {

    var replay_time = "";
    if ($("#txt_playmode_dc").text() == "回放") {
        replay_time = $("#playTime").text().split(" ")[0] + " " + $("#playTime").text().split(" ")[1];
    } else {
        replay_time = "";
    }


    var url = "/Common/MGIS/ASHX/Sms/C3ProcessInfo.ashx?type=Newest&lineCode=&OrgCode=&OrgType=&LocaType=&key=" + escape($('#locomotive_no').text()) + "&time=" + replay_time;
    var jsons;
    $.ajax({
        type: "POST",
        url: url,
        async: true,
        cache: false,
        success: function (result) {
            jsons = eval('(' + result + ')');

            if (jsons.length > 0) {
                var json = jsons[0];

                // json.DETECT_TIME  

                var date_DETECT_TIME = new Date(json.DETECT_TIME);
                var date_now = new Date();

                var _timespan_m = (date_now - date_DETECT_TIME) / 1000 / 60;

                if ($("#txt_playmode_dc").text() != "回放") {
                    if (_timespan_m <= 5) {

                        $('#loca_info').html(json.P_ORG_NAME + ' ' + json.WZ2 + ' 速度(km/h)：' + json.SPEED);
                    }
                    else {
                        $('#loca_info').html('');//超过5分钟的不显示。
                    }

                } else {
                    if (json.SPEED == "0") {
                        $('#loca_info').html(json.P_ORG_NAME + ' ' + json.WZ2);
                    } else {
                        $('#loca_info').html(json.P_ORG_NAME + ' ' + json.WZ2 + ' 速度(km/h)：' + json.SPEED);
                    }
                }
            }
        }
    });


    // $('#Iframe_gis').hide();
    //if ($('#Iframe_gis').is(":visible") == true) {
    //    $('#Iframe_gis').attr('src', '/C3/PC/MRTA/GIS_Loca.html?Loca=' + $('#locomotive_no').text());
    //}
};

//设置动车回放参数——图片大小与质量
function SetRec_DC() {

    return;

    //是动车，并且为回放状态，才进行设置 
    if (json_config.VIDEO_VENDOR == "GT2-HIKVISION-DC" && $('#txt_playmode_dc').text() == "回放") {
        var _ip;
        if (GetAB_value() == "四车") {
            _ip = json_config.ip_A;
        }
        else {
            _ip = json_config.ip_B;
        }

        var _type;
        switch (GetType_value()) {
            case '红外':
                _type = 1;
                break;
            case '全景':
                _type = 3;
                break;
            case '局部':
                _type = 2;
                break;
        }

        var _type2 = GetImgQuality(_type);

        var url = '/C3/PC/MLiveStreaming/RemoteHandlers/VideoDeviceInfoHandler.ashx?type=SetRec_DC&ip=' + _ip + "&typeN=" + _type2;
        $.ajax
        ({
            type: "GET",
            url: url,
            success: function (data) {
                layer.msg("设置回放图像质量成功");
            }
        });
    }
};


function change_slider_time(_value) {



    var v = Math.abs(_value);
    var _v = parseInt(_value);
    var cDate2 = new Date();
    //  cDate2.setTime(cDate2.getTime() + 1000 * 60 * _v);//减N分钟。
    //var _H = parseInt(v / 60);
    //var _M = v % 60;

    //var re = '';
    //if (_H > 0) {
    //    re = _H + '小时';
    //}
    //if (_M > 0) {
    //    re += _M + "分钟";
    //}

    //re = cDate2.format("yyyy-MM-dd hh:mm:ss") + "（" + re + "前）";

    //$('#slider_time_txt').text(re);


    cDate2.setTime(cDate2.getTime() + 1000 * _v); //减N秒。

    var re = GetTimeSpanStr(v);


    if (replayTime != undefined && replayTime != null && replayTime != '') {
        //从详细页进，显示缺陷发生时间，及差距。


        var date_fs = new Date(parseInt(replayTime));
        var sele_fs_timeS = parseInt((date_fs - cDate2) / 1000);
        var exStr = "前";
        if (sele_fs_timeS < 0) {
            var exStr = "后";
            sele_fs_timeS = Math.abs(sele_fs_timeS);
        }


        $('#select_time_txt').html('<br/><input id="startdate" class="Wdate" type="text" onclick="WdatePicker({ dateFmt: \'yyyy-MM-dd HH:mm:ss\', isShowToday: false,onpicked: change_slidevlaue})" style="width: 140px" value="' + cDate2.format("yyyy-MM-dd hh:mm:ss") + '">' + "（" + GetTimeSpanStr(sele_fs_timeS) + exStr + "）");
        rehtml = "缺陷发生时间：" + date_fs.format("yyyy-MM-dd hh:mm:ss");
        //rehtml += "<br/>选择播放时间：" 


        rehtml += "<br/>距离当前时间：" + re;

        //  rehtml += "<br/>距离发生时间：" + GetTimeSpanStr(sele_fs_timeS) + exStr;


    }
    else {

        //$('#select_time_txt').html(cDate2.format("yyyy-MM-dd hh:mm:ss"));
        $('#select_time_txt').html('<input id="startdate" class="Wdate" type="text" onclick="WdatePicker({ dateFmt: \'yyyy-MM-dd HH:mm:ss\', isShowToday: false,onpicked: change_slidevlaue })" style="width: 140px" value="' + cDate2.format("yyyy-MM-dd hh:mm:ss") + '">');

        rehtml = "<br/>距离当前时间：" + re;

    }



    $('#slider_time_txt').html(rehtml);
};

function change_slidevlaue() {
    var slidevalue = (new Date($("#startdate").val()).getTime() - new Date().getTime()) / 1000;
    $("#slider_time").slider("value", slidevalue);
    change_slider_time(parseInt($("#slider_time").slider("value")));
};

function GetTimeSpanStr(v) {

    var _H = parseInt(v / 3600);
    var _M = parseInt((v - _H * 3600) / 60);
    var _MM = parseInt(v - _H * 3600 - _M * 60);

    var re = '';
    if (_H > 0) {
        re = _H + '小时';
    }
    if (_M > 0) {
        re += _M + "分钟";
    }
    if (_MM >= 0) {
        re += _MM + "秒";
    }

    return re;
};


function LoadRecData() {

    timeList = new Array();
    timeList = [];

    var url = '/C3/PC/MLiveStreaming/RemoteHandlers/VideoDeviceInfoHandler.ashx?type=GetTimes&ip=' + json_config.ip_A;
    $.ajax
    ({
        type: "GET",
        dataType: "html",
        url: url,
        success: function (data) {
            //     alert(data);
            $('#select_time').html(data);



            $('#select_time>option').each(function () {
                var v = $(this).val();
                if (v != "0")
                    timeList.push(v);
            });

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            layer.msg('连接失败');
        }
    });
};

//回放设置
function RecSetUp() {
    //if (json_config.VIDEO_VENDOR == "GT2-HIKVISION-DC" || timeList.length > 0) {



        var onlineStr = '<span style="color:#ADFEBE">在线</span>';
        if (json_config.online == 'False') {
            onlineStr = '<span style="color:#FFA7B1">离线</span>';
        }

        var _html = "车辆状态：" + onlineStr;
        $('#slider_online').html(_html);

        if (json_config.VIDEO_VENDOR != "GT2-HIKVISION-DC") {
            $("#cb_IsframePlay").parent().hide();
        }

        //动车 或者 机车回放时间列表大于0
        layer.open({
            type: 1,
            shade: 0.6,
            title: false,
            area: '60%',
            content: $('#rec_optionBox'), //捕获的元素
            cancel: function (index) {
                layer.close(index);
            }
        });

        if (json_config.VIDEO_VENDOR != "GT2-HIKVISION-DC") {
            //if ($('#select_time>option').length > 1) {
                var nowDATA = new Date();
                //if (json_config.DEVICE_VERSION.indexOf("B") == -1) {
                    var Location = $("#txt_AB_jc").text();
                    var Camera;
                    var timeurl;
                    if (Location != "双端全景") {
                        Location = Location.replace("弓", "");
                    }
                    switch ($("#txt_type_jc").text()) {
                        case "红外":
                        case "全通道":
                            Camera = 1;
                            break;
                        case "局部":
                            Camera = 2;
                            break;
                        case "全景":
                            Camera = 3;
                            break;
                    }
                    timeurl = '/C3/PC/MLiveStreaming/RemoteHandlers/VideoPlayInfor_JC.ashx?tag=getHistoryStartTime&car=' + json_config.LOCOMOTIVE_CODE + '&location=' + Location + '&camera=' + Camera;
                    $.ajax({
                        type: 'POST',
                        url: timeurl,
                        async: true,
                        cache: false,
                        success: function (result) {
                            _min = -(nowDATA.getTime() / 1000 - parseInt(result.data.message));
                        }
                    })
                //} else {
                //    _min = -(nowDATA.getTime() / 1000 - $('#select_time>option').eq(1).val());
                //}
                $("#slider_time").slider({
                    min: _min
                });
            //}
        };

    //}
    //else {
    //    layer.msg('没有获取到历史播放记录，不能回放');
    //}

};

function FindTime(_cTime) {
    //timeList数组中，小的在前面，大的在后面。
    //1449034200,1449036000,1449037800,1449039600
    var _findTime = null;
    for (var i = timeList.length - 1; i >= 0; i--) {
        //用当前时间，与列表对比，从后面大的往前面小的比。
        if (_cTime >= timeList[i]) {
            //比到比当前日期小的值时，就用 当前列表项的时间为基准时间。
            _findTime = timeList[i];
            break;
        }
    }
    return _findTime;

};

function SetHistoryPastTime() {
    //设置postTime,
    if ($('#Txt_rec_second').val() > 1800) {
        //    $('#slider_msg').html("你请求的开始时间无数据");




        var _btime = $('#select_time').val();
        //   var _btime_v = (_btime*1000 - new Date().getTime()) / 1000;

        //   alert('_btime_v:' + _btime_v);



        var _btime_d = new Date(_btime * 1000).format("yyyy-MM-dd hh:mm:ss");
        $('#startdate').val(_btime_d);

        change_slidevlaue();
        //   $("#slider_time").slider("value", _btime_v);

        layer.msg("你请求的开始时间无数据,为您设置最接近的时间点");



        //  alert('你请求的开始时间无数据！');
        //   Stop_GT();
        return;
    }

    var url = '/C3/PC/MLiveStreaming/RemoteHandlers/VideoDeviceInfoHandler.ashx?type=SetHistoryPastTime&ip=' + json_config.ip_A + "&past_time=" + $('#Txt_rec_second').val();
    $.ajax
    ({
        type: "GET",
        dataType: "html",
        url: url,
        success: function (data) {
            playNo++;
            Stop_GT();
            layer.closeAll();
            setTimeout(Play_GT, 500);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
};

//历史时间段下拉框改变
function changeHisDate() {
    var newDateObj = new Date();
    var obj = document.all.select_time;
    var index = obj.selectedIndex;

    var url = '/C3/PC/MLiveStreaming/RemoteHandlers/VideoDeviceInfoHandler.ashx?type=SetHistoryStartTime&ip=' + json_config.ip_A + "&start_time=" + obj.options[index].value;

    //  var url = "/user.do?action=SetHistoryStartTime&start_time=" + obj.options[index].value + "&tid=" + newDateObj.getTime();

    $.ajax({
        type: "Get",
        url: url,
        async: false,
        cache: false,
        success: function (result) {
            layer.msg("设置开始时间成功");
        },
        error: function () {
            //  showOPInfo("未配置此设备")
        }

    });
};


//停止播放
function Stop_GT() {
    zyGT2Play = false;

    showOPInfo("已停止");


    $('#btn_play_GT').show();
    $('#btn_stop_GT').hide();

    if ($('#txt_playmode_dc').text() == "回放") {
        $('#playbtn_prev_next').show();
    }


    C_Sta_time = null;
    C_End_time = null;

};
//播放时间走完自动停止播放
function Stop_GT_Over() {
    zyGT2Play = false;

    showOPInfo("连续播放" + localStorage["Paramter_MaxPlayTime"] + "分钟，已停止");


    $('#btn_play_GT').show();
    $('#btn_stop_GT').hide();

    if ($('#txt_playmode_dc').text() == "回放") {
        $('#playbtn_prev_next').show();
    }

    C_Sta_time = null;
    C_End_time = null;

};


//播放
function Play_GT() {

    $('#playbtn_prev_next').hide();

    zyGT2Play = true;
    showOPInfo("正在播放");
    $('#btn_play_GT').hide();
    $('#btn_stop_GT').show();

    if (json_config == '') {
        json_config = { 'LOCOMOTIVE_CODE': 'test001', 'ip_A': '172.16.2.1', 'ip_B': '172.16.2.2' };
    }

    Play_GT_Step2();

};


function Play_GT_Step2() {
    if (json_config.VIDEO_VENDOR == "GT2-HIKVISION-DC") {
        //动车

        var ip = GetIp(json_config);
        switch (mode) {
            case "playbox_mode3": //三端模式
                //if (GetAB_value() == "四车") {
                img_Refresh(ip, "playbox_mode3_1", 1, "A", json_config.LOCOMOTIVE_CODE);
                img_Refresh(ip, "playbox_mode3_2", 2, "A", json_config.LOCOMOTIVE_CODE);
                img_Refresh(ip, "playbox_mode3_3", 3, "A", json_config.LOCOMOTIVE_CODE);


                //}
                //else {

                //    img_Refresh(json_config.ip_B, "playbox_mode3_1", 1, "B", json_config.LOCOMOTIVE_CODE);
                //    img_Refresh(json_config.ip_B, "playbox_mode3_2", 2, "B", json_config.LOCOMOTIVE_CODE);
                //    img_Refresh(json_config.ip_B, "playbox_mode3_3", 3, "B", json_config.LOCOMOTIVE_CODE);

                //}
                break;
            case "playbox_mode2": //双端模式
                //目前只有 双端高清             
                img_Refresh(json_config.ipA, "playbox_mode2_1", 2, "A", json_config.LOCOMOTIVE_CODE);
                img_Refresh(json_config.ipB, "playbox_mode2_2", 2, "B", json_config.LOCOMOTIVE_CODE);

                break;
            case "playbox_mode1": //单端模式
                //  if (GetAB_value() == "四车") {
                //四车
                switch (GetType_value()) {
                    case '红外':
                        img_Refresh(ip, "playbox_mode1_1", 1, "A", json_config.LOCOMOTIVE_CODE);
                        break;
                    case '全景':
                        img_Refresh(ip, "playbox_mode1_1", 3, "A", json_config.LOCOMOTIVE_CODE);
                        break;
                    case '局部':
                        img_Refresh(ip, "playbox_mode1_1", 2, "A", json_config.LOCOMOTIVE_CODE);
                        break;
                    case '辅助通道':
                        img_Refresh(ip, "playbox_mode1_1", 4, "A", json_config.LOCOMOTIVE_CODE);
                        break;
                }

                // }
                //else {
                //    //六车

                //    switch (GetType_value()) {
                //        case '红外':
                //            //   img_Refresh(json_config.ip_B, "playbox_mode1_1", 3);
                //            img_Refresh(json_config.ip_B, "playbox_mode1_1", 1, "B", json_config.LOCOMOTIVE_CODE);
                //            break;
                //        case '全景':
                //            img_Refresh(json_config.ip_B, "playbox_mode1_1", 3, "B", json_config.LOCOMOTIVE_CODE);
                //            break;
                //        case '局部':
                //            // img_Refresh(json_config.ip_B, "playbox_mode1_1", 5);
                //            img_Refresh(json_config.ip_B, "playbox_mode1_1", 2, "B", json_config.LOCOMOTIVE_CODE);
                //            break;
                //    }

                //}


                break;
        }
    }
    else {
        //机车
        switch (mode) {
            case "playbox_mode3": //三端模式    自研机车才有
                switch (GetAB_value()) {
                    case "A弓":
                        img_Refresh(json_config.ip_A, "playbox_mode3_1", 1, "A", json_config.LOCOMOTIVE_CODE);
                        img_Refresh(json_config.ip_A, "playbox_mode3_2", 2, "A", json_config.LOCOMOTIVE_CODE);
                        img_Refresh(json_config.ip_A, "playbox_mode3_3", 3, "A", json_config.LOCOMOTIVE_CODE);
                        break;
                    case "B弓":
                        img_Refresh(json_config.ip_B, "playbox_mode3_1", 1, "B", json_config.LOCOMOTIVE_CODE);
                        img_Refresh(json_config.ip_B, "playbox_mode3_2", 2, "B", json_config.LOCOMOTIVE_CODE);
                        img_Refresh(json_config.ip_B, "playbox_mode3_3", 3, "B", json_config.LOCOMOTIVE_CODE);
                        break;
                }
                break;
            case "playbox_mode2": //双端模式
                //目前只有 双端高清              

                switch (GetAB_value()) {
                    case "A弓":
                        img_Refresh(json_config.ip_A, "playbox_mode2_1", 1, "A", json_config.LOCOMOTIVE_CODE);
                        img_Refresh(json_config.ip_B, "playbox_mode2_2", 0, "B", json_config.LOCOMOTIVE_CODE);
                        break;
                    case "B弓":
                        img_Refresh(json_config.ip_A, "playbox_mode2_1", 3, "A", json_config.LOCOMOTIVE_CODE);
                        img_Refresh(json_config.ip_B, "playbox_mode2_2", 2, "B", json_config.LOCOMOTIVE_CODE);
                        break;
                    case "双端全景":
                        //if (json_config.DEVICE_VERSION.indexOf("B") == -1) {  //自研机车
                            img_Refresh(json_config.ip_A, "playbox_mode2_1", 3, "A", json_config.LOCOMOTIVE_CODE);
                            img_Refresh(json_config.ip_B, "playbox_mode2_2", 3, "B", json_config.LOCOMOTIVE_CODE);
                        //} else {
                        //    img_Refresh(json_config.ip_A, "playbox_mode2_1", 0, "A", json_config.LOCOMOTIVE_CODE);
                        //    img_Refresh(json_config.ip_B, "playbox_mode2_2", 2, "B", json_config.LOCOMOTIVE_CODE);
                        //}
                        break;
                }

                break;
            case "playbox_mode1": //单端模式
                //if (json_config.DEVICE_VERSION.indexOf("B") == -1) {  //自研机车
                    if (GetAB_value() == "A弓") {
                        //A弓
                        switch (GetType_value()) {
                            case '红外':
                                img_Refresh(json_config.ip_A, "playbox_mode1_1", 1, "A", json_config.LOCOMOTIVE_CODE);
                                break;
                            case '局部':
                                img_Refresh(json_config.ip_A, "playbox_mode1_1", 2, "A", json_config.LOCOMOTIVE_CODE);
                                break;
                            case '全景':
                                img_Refresh(json_config.ip_A, "playbox_mode1_1", 3, "A", json_config.LOCOMOTIVE_CODE);
                                break;
                        }
                    }
                    else {
                        //B弓
                        switch (GetType_value()) {
                            case '红外':
                                img_Refresh(json_config.ip_B, "playbox_mode1_1", 1, "B", json_config.LOCOMOTIVE_CODE);
                                break;
                            case '局部':
                                img_Refresh(json_config.ip_B, "playbox_mode1_1", 2, "B", json_config.LOCOMOTIVE_CODE);
                                break;
                            case '全景':
                                img_Refresh(json_config.ip_B, "playbox_mode1_1", 3, "B", json_config.LOCOMOTIVE_CODE);
                                break;
                        }
                    }
                //} else {
                //    if (GetAB_value() == "A弓") {
                //        //A弓
                //        switch (GetType_value()) {
                //            case '红外':
                //                img_Refresh(json_config.ip_A, "playbox_mode1_1", 1, "A", json_config.LOCOMOTIVE_CODE);
                //                break;
                //            case '全景':
                //                img_Refresh(json_config.ip_A, "playbox_mode1_1", 0, "A", json_config.LOCOMOTIVE_CODE);
                //                break;
                //        }

                //    }
                //    else {
                //        //B弓
                //        switch (GetType_value()) {
                //            case '红外':
                //                img_Refresh(json_config.ip_B, "playbox_mode1_1", 3, "B", json_config.LOCOMOTIVE_CODE);
                //                break;
                //            case '全景':
                //                img_Refresh(json_config.ip_B, "playbox_mode1_1", 2, "B", json_config.LOCOMOTIVE_CODE);
                //                break;
                //        }
                //    }
                //}
                break;
        }

    }

};


function GetOnline() {
    //level2

    var url = '/C3/PC/MLiveStreaming/RemoteHandlers/VideoDeviceInfoHandler.ashx?type=getOnlineLoco';
    $.ajax({
        type: "POST",
        url: url,
        async: true,
        cache: false,
        success: function (result) {


            $('.level2').each(function () {

                var _id = $(this).attr('id');
                var span_id = _id + "_span"; //   TreeAll_7_span
                var c_loco = $('#' + span_id).text();

                //if (result.indexOf(c_loco) > -1) {
                //    $('#' + span_id).css("color", "green");
                //}
                //else {
                //    $('#' + span_id).css("color", "#333");

                //}

                var relist = result.split(',');
                for (var i = 0; i < relist.length; i++) {
                    if (relist[i].indexOf(c_loco) > -1) {

                        $('#' + span_id).css("color", "green");
                        $('#' + span_id).attr('onlinePort', relist[i]); // _A _B #1_A #1_B #2_A #2_B



                        // $(this).css("color", "#9CEF9C");
                        //  $(this).attr('onlinePort', relist[i])
                        break;
                    }
                    else {
                        //  $(this).css("color", "#89898E");
                        $('#' + span_id).css("color", "#333");




                    }
                }

                ////临时debug
                //$('#TreeAll_73_span').css("color", "green");



            })

        },
        error: function () { }

    });



};

//得到选项一的值
function GetAB_value() {
    if (json_config.VIDEO_VENDOR == "GT2-HIKVISION-DC") {
        $("#ul_select_AB>li").each(function () {
            if ($(this).find("a").text() == $("#txt_AB").text()) {
                $('#txt_AB').attr("code", $(this).find("a").attr("code"));
            }
        });
        return $("#txt_AB").attr("code");
    }
    else {
        $("#ul_select_AB>li").each(function () {
            if ($(this).find("a").text() == $("#txt_AB").text()) {
                $('#txt_AB_jc').attr("code", $(this).find("a").attr("code"));
            }
        });
        return $('#txt_AB_jc').text();
    }


};

//得到选项二的值
function GetType_value() {
    if (json_config.VIDEO_VENDOR == "GT2-HIKVISION-DC") {
        return $('#txt_type').text();
    }
    else {
        return $('#txt_type_jc').text();
    }
};

function IsGT(_VIDEO_VENDOR) {
    if (_VIDEO_VENDOR == "GT2-HIKVISION-DC" || _VIDEO_VENDOR == "GT2-HIKVISION") {

        return true;

    }
    else {
        return false;
    }
};

//选择设备，显示合适的按钮。
function changeBtns(json) {

    // $('#txt_VIDEO_VENDOR').val(json.VIDEO_VENDOR);//保存

    if (json.VIDEO_VENDOR == "GT2-HIKVISION-DC") {
        //国铁自研版 动车
        if (debug == "1") {
            $("#ul_select_type").css('width', '95px');
            $(".fztd").show();
        }

        $('.div_KY').hide();
        $('.div_GT').show();

        $('.div_GT_DC').show();
        $('.div_GT_JC').hide();
       
        showOPInfo("参数获取成功");

        ////临时debug
        //if (json.LOCOMOTIVE_CODE == "CRH380A-2887")
        //{
        //    json.online = "True";
        //}

        if (json.online != 'False') {
            layer.msg('车辆当前在线');
            $('#locomotive_no').css('color', '#ADFEBE');
        }
        else {
            $('#locomotive_no').css('color', '#FFA7B1');
            layer.msg('车辆当前不在线');
        }

    }
    else if (json.VIDEO_VENDOR == "GT2-HIKVISION" || json.VIDEO_VENDOR == "HIKVISION") {

        //国铁自研版  机车
        $('.div_KY').hide();
        $('.div_GT').show();

        $('.div_GT_DC').hide();
        $('.div_GT_JC').show();
        $("#txt_playmode_jc").text("直播");
        if (json.DEVICE_VERSION.indexOf("B") == -1) {//自研机车
            $("#ul_select_playmode_jc li").eq(1).show();
        } else {
            $("#ul_select_playmode_jc li").eq(1).hide();
        }
        $('#txt_type_jc').text("红外");
        $("#jcJB").show();
        $("#jcQJ").show();
        $("#jcKJG").hide();

        showOPInfo("播放参数获取成功");

        if (json.online != 'False') {
            layer.msg('车辆当前在线');
            $('#locomotive_no').css('color', '#ADFEBE');
        }
        else {
            $('#locomotive_no').css('color', '#FFA7B1');
            layer.msg('车辆当前不在线');
        }

        //LoadRecData();

    }
    else {
        //科易
        $('.div_KY').show();
        $('.div_GT').hide();
        showOPInfo("");
    }

    changeImgDisplay_label();

};

//改变显示模式
function changeImgDisplay_label() {


    if (json_config.VIDEO_VENDOR == "GT2-HIKVISION-DC") {
        //动车
        $('#playbox>div').hide();
        if (GetAB_value() == '双车局部') {
            //双端全景

            //布局改变，左右布局。
            $('#txt_type').hide(); //不选类型。

            $('#playbox_mode2').show();

            mode = "playbox_mode2";

        }
        else {
            //单端模式。

            $('#txt_type').show();

            if ($('#txt_type').text() == "全通道") {
                $('#playbox_mode3').show();
                mode = "playbox_mode3";
            }
            else {
                //红外、高清、全景
                $('#playbox_mode1').show();
                mode = "playbox_mode1";
            }

        }

    }
    else {
        //机车

        $('#playbox>div').hide();
        if (GetAB_value() == '双端全景') {
            //布局改变，左右布局。
            $('#txt_type_jc').hide(); //不选类型。
            $('#playbox_mode2').show();
            mode = "playbox_mode2";

        }
        else {
            //单端模式。

            $('#txt_type_jc').show();
            if ($('#txt_type_jc').text() == "全通道") {
                //if (json_config.DEVICE_VERSION.indexOf("B") == -1) {  //自研机车
                    $('#playbox_mode3').show();
                    mode = "playbox_mode3";
                //} else {
                //    //左右
                //    $('#playbox_mode2').show();
                //    mode = "playbox_mode2";
                //}
            }
            else {
                //红外、高清、全景
                $('#playbox_mode1').show();
                mode = "playbox_mode1";
            }

        }

    }

};


//locomotiveCode //传入车号
//LoadCallback  完成事件
//得到设备播放参数。
function GetLocaPlayMemo_GT(options) {



    var defaults = {
        locomotiveCode: '',
        LoadCallback: false
    };

    var opts = $.extend(defaults, options);


    var url = '/C3/PC/MLiveStreaming/RemoteHandlers/VideoDeviceInfoHandler.ashx?type=getLocomotiveVideoInfo_GT&locomotiveCode=' + escape(opts.locomotiveCode);
    $.ajax({
        type: "POST",
        url: url,
        async: false,  //改为同步请求，解决第一次点击车号无法直播的问题。
        cache: false,
        success: function (result) {

            json_config = '';

            if (result != "") {
                json_config = eval('(' + result + ')');

                if (opts.LoadCallback)
                    opts.LoadCallback(json_config);

            }
            else {
                showOPInfo("未配置此设备");

                $('#btns_other,#btns_GT').hide();

            }


        },
        error: function () {
            showOPInfo("未配置此设备");
        }

    });

};


// 动车ip1 ( 1红外四车  2局部四车   3全景四车  4附助四车  )   动车ip2 ( 1红外六车  2局部六车   3全景六车   4附助六车 )
// 机车ip ( 1红外A  0高清A  3红外B  2高清B  )

// 1:红外A                3:红外B 
// 0:高清A(低分辨率)      2:高清B(低分辨率)   
// 4:超清A（高分辨率）    5:超清B（高分辨率）  
function img_Refresh(_ip, _objID, _type, _AB, _locaNo) {
    GetPlayDateTime();//视频播放超过限制时间后停止播放
    if (_ip == '' || _ip == undefined) {
        showOPInfo("IP未配置");
        return;
    }

    var _type2 = _type;
    var time_Str = '';

    //开始播放，控件未隐藏。
    if (zyGT2Play && $('#' + _objID).is(":visible") == true) {
        var newDateObj = new Date();

        var action = '';
        var auto = '1';

        var locaType = 'JC';

        if (json_config.VIDEO_VENDOR == "GT2-HIKVISION-DC") {
            locaType = 'DC';

            //国铁自研版 动车
            switch (_type) {
                case 1: //红外的
                    action = "GetRealTimeIRVImage";
                    break;
                case 2: //局部：2（500W）
                    action = "GetRealTimeNETImage";
                    break;
                case 3: //全景：3（200W）
                    action = "GetRealTimeALLImage";
                    break;
                case 4: //辅助：4
                    action = "GetRealTimeBOWImage";
                    break;
                    //default://以前的  
                    //    action = "GetRealTimeHDImage";                     
                    //    break;  
            }

            var playmode = $('#txt_playmode_dc').text(); // 动车  直播、回放
            if (playmode == "回放") {
                action = action.replace("GetRealTime", "GetHistory");  //回放的参数替换。

                if (RecTime != '') {

                    var IsframePlay = $('#cb_IsframePlay').is(':checked');

                    var cDate2 = new Date();
                    var cDate2_times;

                    if (IsframePlay) {
                        //逐帧
                        cDate2_times = RecTime_Current;

                        if (Mode_prev_next == "next") {

                            RecTime_Current += parseInt($('#txt_frameN').val()); //每次增加50毫秒。
                        }
                        else {
                            RecTime_Current -= parseInt($('#txt_frameN').val()); //每次减少50毫秒。
                        }
                    }
                    else {
                        //当前时间 + 中间差
                        var _v = parseInt($("#slider_time").slider("value"));
                        var hmc = 1000 * _v; //减N。
                        cDate2_times = cDate2.getTime() + hmc;

                    }

                    cDate2.setTime(cDate2_times);
                    $('#playTime').html(cDate2.format("yyyy-MM-dd hh:mm:ss S"));
                    var cdate2_times = parseInt(cDate2.getTime());  //得到毫秒级时间戳  13位
                    time_Str += "&time=" + cdate2_times;



                }

            }

            _type2 = GetImgQuality(_type2); //生成包含图像质量的type 

        }
        else {
            //机车

            var playmode = $('#txt_playmode_jc').text(); // //机车才有回放
            if (playmode == "回放") {
                switch (_type) {
                    case 1:
                    case 3:
                        //红外的
                        action = "GetHistoryIRVImage";
                        break;
                    default:
                        //高清的
                        action = "GetHistoryHDImage";
                        break;
                }

                var cDate2 = new Date();
                var cDate2_times;
                if (RecTime != '') {
                    cDate2_times = RecTime_Current;
                    if (Mode_prev_next == "next") {

                        RecTime_Current += parseInt($('#txt_frameN').val()); //每次增加50毫秒。
                    }
                    else {
                        RecTime_Current -= parseInt($('#txt_frameN').val()); //每次减少50毫秒。
                    }
                } else {
                    var _v = parseInt($("#slider_time").slider("value"));
                    var hmc = 1000 * _v; //减N。
                    cDate2_times = cDate2.getTime() + hmc;
                }
                cDate2.setTime(cDate2_times);

                $('#playTime').html(cDate2.format("yyyy-MM-dd hh:mm:ss S"));

                var cdate2_times = parseInt(cDate2.getTime());  //得到毫秒级时间戳  13位
                time_Str += "&time=" + cdate2_times;
            }
            else {
                switch (_type) {
                    case 1:
                    case 3:
                        //红外的
                        action = "GetRealTimeIRVImage";
                        break;
                    default:
                        //高清的
                        action = "GetRealTimeHDImage";
                        break;
                }
            }

        }


        var _url = "/C3/PC/MRTA/GetVideoImg.ashx?IP=" + _ip + "&action=" + action + "&type=" + _type2 + "&auto=" + auto + "&AB=" + _AB + "&locaType=" + locaType + "&locaNo=" + _locaNo + "&tid=" + newDateObj.getTime() + time_Str;

        var playmode = $('#txt_playmode_dc').text(); //直播还是回放
        var playmode_JC = $('#txt_playmode_jc').text(); //机车直播还是回放
        if ($('#cb_linkQ').is(':checked')) //  if (_ip.indexOf('125.69.149.77')>-1)
        {
            if (json_config.VIDEO_VENDOR == "GT2-HIKVISION-DC") {//动车
                var TypeArray = _type2.split("");
                _url = '/C3/PC/MLiveStreaming/RemoteHandlers/VideoPlayInfor.ashx?car=' + _ip.replace("#", "%23") + '&camera=' + _type + '&resolution=' + TypeArray[1] + '&quality=' + TypeArray[2] + TypeArray[3] + '&playmode=' + playmode + time_Str + "&tid=" + newDateObj.getTime();
            } else {//机车
                //if (json_config.DEVICE_VERSION.indexOf("B") == -1) {  //自研机车
                    if (playmode_JC == "直播") {
                        _url = '/C3/PC/MLiveStreaming/RemoteHandlers/VideoPlayInfor_JC.ashx?tag=VedioPlay&mode=real&car=' + _locaNo + '&camera=' + _type + '&location=' + _AB + "&tid=" + newDateObj.getTime();
                        $('#playTime').hide();
                    } else {
                        _url = '/C3/PC/MLiveStreaming/RemoteHandlers/VideoPlayInfor_JC.ashx?tag=VedioPlay&mode=history&car=' + _locaNo + '&camera=' + _type + '&location=' + _AB + time_Str + "&tid=" + newDateObj.getTime();
                        $('#playTime').show();
                    }
                //} else {
                //    _url = "http://" + _ip + "/user.do?action=" + action + "&type=" + _type2 + time_Str + "&tid=" + newDateObj.getTime();
                //    $('#playTime').hide();
                //}
            }
        } else {
            if (json_config.VIDEO_VENDOR == "GT2-HIKVISION-DC") {//动车
                var TypeArray = _type2.split("");
                _url = '/C3/PC/MLiveStreaming/RemoteHandlers/VideoPlayInfor.ashx?IP=' + _ip + '&action=' + action + '&type=' + _type2 + '&car=' + _ip.replace("#", "%23") + '&camera=' + _type + '&resolution=' + TypeArray[1] + '&quality=' + TypeArray[2] + TypeArray[3] + '&playmode=' + playmode + time_Str + "&tid=" + newDateObj.getTime();
            }
        };

        loadImage({
            objID: _objID,
            type: _type,
            url: _url,
            ip: _ip,
            AB: _AB,
            locaNo: _locaNo,
            LoadCallback: function (_opts) {

                if ($("#btn_stop_GT").is(":visible")) {
                    //播放中,显示的暂停按钮，继续
                    img_Refresh(_opts.ip, _opts.objID, _opts.type, _opts.AB, _opts.locaNo);
                }


            }

        });
    }
};

//获取图片质量，type参数生成
function GetImgQuality(_type2) {
    var _definition = $('#txt_definition').text(); //图像质量
    switch (_definition) {
        case "标清": //320x240
            _type2 += "0";
            break;
        case "高清": //480x360
            _type2 += "1";
            break;
        case "超清": //640x480
            _type2 += "2";
            break;
    }

    var _sliderV = $('#slider_txt').text();
    _type2 += _sliderV;

    return _type2;
};


function loadImage(options) {


    var defaults = {
        objID: '', //必须
        type: '', //必须      
        url: "", //必须
        ip: '',
        AB: '', //A面还是B面
        locaNo: '', //车号
        LoadCallback: function () { }
    };

    var opts = $.extend(defaults, options);


    var img = document.getElementById(opts.objID);
    var url = opts.url;
    loadImage2(url, opts, function (e, _playNo) {

        if (_playNo != playNo) {
            //   showOPInfo("已切换，停止加载上个通道的图片");
            return;

        }

        if (e.width <= 0 || e.height <= 0) {
            showOPInfo("连接失败,正在重试");
        }
        else {
            img.src = url;
        }

        opts.LoadCallback(opts);
    });


};

//图片预加载
function loadImage2(url, opts, callback) {
    var img = new Image(); //创建一个Image对象，实现图片的预下载

    img.playNo = playNo;
    img.src = url;

    if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数 
        //  opts.LoadCallback(opts);

        return; // 直接返回，不用再处理onload事件 
    }
    img.onload = function () { //图片下载完毕时异步调用callback函数。 

        if (zyGT2Play) {
            showOPInfo('正在播放'); //json_config.ip_A
            img.onload = null; //gif图片在ie下会循环请求
            callback(img, img.playNo);
        }
    };

    img.onerror = function () {
        showOPInfo("");
        if ($("#playbox_mode1").is(":visible")) {
            showOPInfo("连接不上");

            GetLocaPlayMemo_GT({
                locomotiveCode: $('#locomotive_no').text()
            });
        }
        //  showOPInfo(img.playNo);

        callback(img, img.playNo);
    };


};



//function loadImage(options) {


//    var defaults = {
//        objID: '', //必须
//        type: '', //必须      
//        url: "",//必须
//        ip:'',
//        LoadCallback: function () { }
//    };

//    var opts = $.extend(defaults, options);


//    //$('#' + opts.objID).attr('src', opts.url);


//    var obj = document.getElementById(opts.objID);
//    obj.src = opts.url;


//    obj.onload = function () { }

//    // obj.src = url;
//    if (obj.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数 
//      //  callback.call(opts.objID, opts._type);
//        opts.LoadCallback(opts);

//        return; // 直接返回，不用再处理onload事件 
//    }
//    obj.onload = function () { //图片下载完毕时异步调用callback函数。 
//        //  callback.call(opts.objID, opts._type); //将回调函数的this替换为Image对象 
//        opts.LoadCallback(opts);
//        showOPInfo("正在播放");
//    };

//    obj.onerror = function () {

//       // $('#' + opts.objID).attr('src', '../../img/test.JPG');
//        //$('#btn_play_GT').show();
//        //$('#btn_stop_GT').hide();
//        showOPInfo("连接失败,正在重试");
//        opts.LoadCallback(opts);
//    }

//}

function showOPInfo(szInfo) {
    // szInfo = "<p style='color: white'>" + dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss") + " " + szInfo + "</p>";

    szInfo = "<span style='color: white;margin:0px; font-size:14px;'>" + szInfo + "</span>";
    $("#divplaylog").html(szInfo);
};

var C_Sta_time; ///记录播放开始时间
var C_End_time;//记录播放当前时间
//视频播放超过限制时间后停止播放
function GetPlayDateTime() { //通道和车号
    if (C_Sta_time == null) {
        C_Sta_time = datehhssNowStr();
        C_End_time = datehhssNowStr();
    } else {
        C_End_time = datehhssNowStr();
    }
    var date1 = new Date(C_Sta_time);
    var date2 = new Date(C_End_time);
    var date3 = (date2.getTime() - date1.getTime()) / 1000;
    var MaxPlayTime = getConfig("MaxPlayTime");
    if (date3 > parseFloat(MaxPlayTime) * 60) {
        Stop_GT_Over();// 停止播放

    }
};

function GetIp(json) {
    var code = GetAB_value();
    switch (code) {
        case "ip1_A":
            if (json.ip1_A != undefined) {
                return json.car1_A;//16编组，
            }

            if (json.ipA != undefined) {
                return json.carA;//非16编组，改过默认车厢号
            }

            break;
        case "ip1_B":

            if (json.ip1_B != undefined) {
                return json.car1_B; //16编组，
            }

            if (json.ipB != undefined) {
                return json.carB;//非16编组，改过默认车厢号
            }

            break;
        case "ip2_A":
            return json.car2_A;
            break;
        case "ip2_B":
            return json.car2_B;
            break;
        case "ip_A":
            if (json_config.VIDEO_VENDOR == "GT2-HIKVISION-DC") { //动车
                return json.carA;
            } else {
                return json.ipA;
            };
            break;
        case "ip_B":
            if (json_config.VIDEO_VENDOR == "GT2-HIKVISION-DC") { //动车
                return json.carB;
            } else {
                return json.ipB;
            };
            break;
    }
};

function ReSetImg() {
    $('#playbox img').attr('src', '/Common/img/test.JPG'); //切换时，图片还原默认。
};