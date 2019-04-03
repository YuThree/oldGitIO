var debug = getConfig("debug");
var dirpath; //前面路径ss
var dirpath_allimg; //全景路径。
var josnpath; //中间路径
var alarmid; //默认第一个缺陷ID
var set; //定时器
var imaname; //imaname
var jpgname; //jpgname
var Imgjson;
var ImgNum = -1; //图片计数
var ImgNum_hw = 0; //红外
var ImgNum_vi = 0; //局部
var ImgNum_all = 0; //全部
var AlarmJson_3Cform4;
var imaCount;
var jpgCount;
var InfoNum = 0; //信息计数
var locinfo;
var Ispaly = 1;
var frame_index; //缺陷帧
var set_frame_record = 0; //设置缺陷帧的记录
//全局JSON
var Allimg;
var OAB;
//var _url = "";
var _url = "?r=" + Math.random();
//Imgjson.FRAME_INFO[0].TEMP_IRV;

var control_obj = 'Global'//控制范围  默认全局

var FLAG; //是否是缺陷帧
var JsonAlarm;
var CompleteImgNum = 0;

var PageName = 'big22';

if (window.location.href.indexOf('mrta_big_alarm.htm') > 0 || window.location.href.indexOf('GIS_bak.htm') > 0) {
    PageName = 'big44';
}
else if (window.location.href.indexOf('MonitorAlarm3CForm4.htm') > 0) {
    PageName = 'detail';
}

document.onkeydown = keyDown;

var ECharts;


//鼠标点击弹出层
$(function () {
    if (window.location.href.indexOf('mrta_big_alarm.htm') > 0) {
        $('#hw').click(function () {
            if (!$('#note').is(':visible')) {
                $('#note').css({ display: 'block', top: '-5px' }).animate({ top: '+5' }, 500);
            }
        });
    } else {
        $('#hw.ssjk_hw').click(function () {
            if (!$('#note').is(':visible')) {
                $('#note').css({ display: 'block', top: '-5px' }).animate({ top: '+5' }, 500);
            }
        });
    }

});

function keyDown(e) {
    var keycode = e.which;
    var realkey = String.fromCharCode(e.which);

    //空格判断播放/暂停
    if (keycode == 32 && !e.ctrlKey && $('input:focus').length == 0) {
        dbImgShuffling();
    }

    //箭头左和A 上一帧
    if (keycode == 37 || keycode == 65 && $('input:focus').length == 0) {
        Ispaly = 0;
        Suspended(); //暂停;
        if (control_obj == 'Global') {
            $("#note-IR").show();
            $("#note-VI").show();
            if ($("#allimg").is(":visible")) {
                $("#note-OAB").show();
            };
            $(".iconstar").attr("src", "/C3/PC/MAlarmMonitoring/ImgTmp/play.png");
            ImgNum = JsonAlarm.PLAY_IDX[ImgNum].IR;
            if (ImgNum > 0) {
                ImgNum = ImgNum - 1;
            }
            play();
        } else if (control_obj == 'IR') {
            $("#note-IR").show();
            upImg_IR()
        } else if (control_obj == 'KJG') {
            $("#note-VI").show();
            upImg_VI()
        } else if (control_obj == 'OAB') {
            $("#note-OAB").show();
            upImg_OAB()
        }


    }

    //箭头右和D 下一帧
    if (keycode == 39 || keycode == 68 && $('input:focus').length == 0) {
        Ispaly = 0;
        Suspended(); //暂停;
        if (control_obj == 'Global') {
            $("#note-IR").show();
            $("#note-VI").show();
            if ($("#allimg").is(":visible")) {
                $("#note-OAB").show();
            };
            $(".iconstar").attr("src", "/C3/PC/MAlarmMonitoring/ImgTmp/play.png");

            ImgNum = JsonAlarm.PLAY_IDX[ImgNum].IR;
            if (ImgNum >= JsonAlarm.PLAY_IDX.length - 2) {
                ImgNum = -1;
            }

            if (ImgNum == JsonAlarm.PLAY_IDX.length) {
                ImgNum = 0;
            } else {
                ImgNum++;
            }

            play();
        } else if (control_obj == 'IR') {
            $("#note-IR").show();
            lastImg_IR()
        } else if (control_obj == 'KJG') {
            $("#note-VI").show();
            lastImg_VI()
        } else if (control_obj == 'OAB') {
            $("#note-OAB").show();
            lastImg_OAB()
        }
    }
    // F键显示全景
    if (keycode == 70 && !e.ctrlKey && $('input:focus').length == 0) {
        ShowAllImg();
    }
    // T键显示缺陷帧
    if (keycode == 84 && !e.ctrlKey && $('input:focus').length == 0) {
        GoToAlarmFrame();
    }
    //G键展示文字
    if (keycode == 71 && !e.ctrlKey && $('input:focus').length == 0) {
        $("#btn_locInfoControl").click()
    }
    // M键显示地图
    if (keycode == 77 && !e.ctrlKey && $('input:focus').length == 0) {
        if ($(".layui-layer-iframe").length) {
            $(".layui-layer-close2").click();
        } else {
            MapAfterClick();
            //$('#satellites').click();
        }
    }
    // W键显示上一条
    if (keycode == 87 && !e.ctrlKey && $('input:focus').length == 0) {
        PreAlarm(true);
    }
    // S键显示下一条
    if (keycode == 83 && !e.ctrlKey && $('input:focus').length == 0) {
        PreAlarm(false);
    }
    // Q键确认报警
    if (keycode == 81 && !e.ctrlKey && !lockType && $('input:focus').length == 0) {
        if ($("#mybox1").css("display") == "block" && $("#myModalLabel_2").text() == "报警确认") {
            $("#btn_closeSureBox").click();
        } else {
            $("#E_btnOk2").click();
        }
    }
    // C键关闭页面
    if (keycode == 67 && !e.ctrlKey && $('input:focus').length == 0) {
        $('#S_btclose').click()
    }
    // E键取消报警
    if (keycode == 69 && !lockType && $('input:focus').length == 0) {
        if ($("#mybox1").css("display") == "block" && $("#myModalLabel_2").text() == "报警取消") {
            $("#btn_closeSureBox").click();
        } else {
            $('#E_btnCan2').click();
        }
    }
    // H键温度曲线
    if (keycode == 72 && !e.ctrlKey && $('input:focus').length == 0) {
        hide_all_img();
        $("#wd").click();
    }
    // Z键拉出曲线
    if (keycode == 90 && !e.ctrlKey && $('input:focus').length == 0) {
        hide_all_img();
        $("#lc").click();
    }
    // X键导高曲线
    if (keycode == 88 && !e.ctrlKey && $('input:focus').length == 0) {
        hide_all_img();
        $('#dg').click()
    }
    // L键温导曲线
    if (keycode == 76 && !e.ctrlKey && $('input:focus').length == 0) {
        hide_all_img();
        $('#wdd').click()
    }
    // 1键第一帧
    if (keycode == 49 && $('input:focus').length == 0) {
        if ($(':focus').length == 0) {
            FristFrame();
        } else {
            return true;
        }
    }
};

//可见光曝光页面
function BKJGImg() {
    var VI_index = JsonAlarm.PLAY_IDX[ImgNum].VI;  //可见帧
    window.open("/C3/PC/MAlarmMonitoring/ShowImg.html?type=1&index=" + VI_index + "&Img=" + JsonAlarm.VI_PICS[VI_index] + "&alarmid=" + GetQueryString("alarmid") + "&v=" + version, "_blank");
};

//全景曝光页面
function BQJImg() {
    var _index = "0";
    var OA_index = JsonAlarm.PLAY_IDX[ImgNum].OA;  //全景A帧号
    var OB_index = JsonAlarm.PLAY_IDX[ImgNum].OB;  //全景B帧号
    if (OA_index > -1)
        _index = OA_index;

    if (OB_index > -1)
        _index = OB_index;

    window.open("/C3/PC/MAlarmMonitoring/ShowImg.html?type=2&index=" + _index + "&Img=" + Allimg + "&alarmid=" + GetQueryString("alarmid") + "&v=" + version, "_blank");
};

/*/*
 * @desc 获取缺陷帧
 * @param 
 */
function getFrame() {
    //计算出缺陷帧
    for (var i = 0; i < JsonAlarm.PLAY_IDX.length; i++) {
        if (JsonAlarm.PLAY_IDX[i].FLAG == 1) {
            //找到对应的序号。
            frame_index = JsonAlarm.PLAY_IDX[i].IR;
            break;
        }
    }
}

function play() {

    if (JsonAlarm == null || JsonAlarm.length == 0) return false;

    if (ImgNum >= JsonAlarm.PLAY_IDX.length) {
        ImgNum = 0;
    }

    var IR_index = JsonAlarm.PLAY_IDX[ImgNum].IR;  //红外帧
    var VI_index = JsonAlarm.PLAY_IDX[ImgNum].VI;  //可见帧
    var OA_index = JsonAlarm.PLAY_IDX[ImgNum].OA;  //全景A帧号
    var OB_index = JsonAlarm.PLAY_IDX[ImgNum].OB;  //全景B帧号

    FLAG = JsonAlarm.PLAY_IDX[ImgNum].FLAG;

    if (1 === FLAG) {
        if ($("#slider").length > 0) {
            $("#slider").slider("value", IR_index);
            $("#slider").slider({ range: "min" });
            $('#A2 img').attr('src', '/C3/PC/MAlarmMonitoring/ImgTmp/jump-light.png');
        }
    } else {
        if ($("#slider").length > 0) {
            $("#slider").slider("value", ImgNum);
            $("#slider").slider({ range: "min" });
            $('#A2 img').attr('src', '/C3/PC/MAlarmMonitoring/ImgTmp/jump.png');
        }
        if (frame_index === IR_index) { //播放到缺陷帧，则高亮
            $('#A2 img').attr('src', '/C3/PC/MAlarmMonitoring/ImgTmp/jump-light.png');
        } else {
            $('#A2 img').attr('src', '/C3/PC/MAlarmMonitoring/ImgTmp/jump.png');
        }
    }

    ImgNum_hw = IR_index;
    ImgNum_vi = VI_index;

    var OA_length = JsonAlarm.OA_PICS.length;
    var OB_length = JsonAlarm.OB_PICS.length;

    if ($('#locInfo').length > 0) {
        // $('#locInfo').html(JsonAlarm.FRAME_INFO[IR_index])    //字幕信息
        // parseFloat( JsonAlarm.FRAME_INFO_LIST[i].TEMP_IRV / 100).toFixed(1);
        if ($("#btn-save").css("display") != "none") {
            EditInfo(IR_index);
        } else {
            ReturnInfo(IR_index);
        }
    }

    if ('1' === debug && location.href.indexOf("MonitorAlarm3CForm4") > 0 && '' !== toolName) {//在计算模式下
        if (HWImgInfo.length > 0) {
            //红外换图
            $('#hw').attr('src', JsonAlarm.IR_PICS[IR_index].split('.')[0] + '_P.JPG' + '?v=' + version);
        }
    } else {
        //红外换图
        $('#hw').attr('src', JsonAlarm.IR_PICS[IR_index] + '?v=' + version);
    }
    $('#hw-Backup').attr('src', JsonAlarm.IR_PICS[IR_index] + '?v=' + version); //隐藏的红外图

    //新增
    if ('1' === debug && location.href.indexOf("MonitorAlarm3CForm4") > 0) {
        if (HWImgInfo.length > 0) {
            // 初始化图片信息
            initImgInfo(IR_index);
        }
    }

    //可见光换图
    var _a = '';
    if (JsonAlarm.delay_vi === '') {
        _a = '?r=0';
    } else {
        _a = '?r=1';
    }
    var kjgurl = JsonAlarm.VI_PICS[VI_index] + _a + '&v=' + version;

    $('#kjg').attr('src', kjgurl);

    try {
        var ez = $('#kjg').data('elevateZoom');
        ez.swaptheimage(kjgurl, kjgurl); //C2500

        if (defaultImg === $('#kjg').attr('src') || '' === $('#kjg').attr('src')) {
            $('.zoomContainer', document).hide();
        } else {
            $('.zoomContainer', document).show();
        }
    }
    catch (ex) { }

    if ($('#locInfo').length > 0) {
        $('#locInfo').html();
    }


    //全景换图
    $('#btn_openAllimg').show();
    Allimg = '';
    if (OA_index > -1 && JsonAlarm.OA_PICS.length != 0) {
        //有A端
        ImgNum_all = OA_index;

        Allimg = JsonAlarm.OA_PICS[OA_index] + '?v=' + version;
        OAB = "OA";
        changeZoomImg("allimg", Allimg, Allimg);
        $(".OABxuhao-play").text(OA_index + 1); //全景当前播放帧
        showAllimgBtn();
    }
    else if (OB_index > -1 && JsonAlarm.OB_PICS.length != 0) {
        //没有A，有B
        ImgNum_all = OB_index;
        Allimg = JsonAlarm.OB_PICS[OB_index] + '?v=' + version;
        OAB = "OB";
        changeZoomImg("allimg", Allimg, Allimg);
        $(".OABxuhao-play").text(OB_index + 1); //全景当前播放帧
        showAllimgBtn();
    }
    else {
        //没有全景图
        $('#btn_openAllimg').hide();
        $('#qjbtn').hide();
        $('#a_BQJ').hide();
        $('.dropdown-menu #irvD').hide();
    }

    if (PageName == 'big44' || PageName == 'detail') {
        //全景图赋值
        try {
            $('#allimg').attr('src', Allimg)

        }
        catch (e) { }

    }
    else if (PageName == "big22") {

        $("body", parent.document).find("#allimg").attr('src', Allimg);

        //$('#allimg').attr('src', Allimg)
    }
    if (1 === FLAG) {
        $(".xuhao-play").text(IR_index + 1); //当前播放帧
    } else {
        $(".xuhao-play").text(ImgNum + 1); //当前播放帧
    }
    $(".IRxuhao-play").text(IR_index + 1); //红外当前播放帧
    $('#curFrame').text(IR_index + 1); //红外当前播放帧
    $(".VIxuhao-play").text(VI_index + 1); //局部当前播放帧

    $("#note-IR .note-IR-jc").attr("src", "ImgTmp/jc_point.png");
    $("#note-IR .note-IR-zx").attr("src", "ImgTmp/zx_point.png");
    // 改变事件
    try {
        $("#note-IR .note-IR-jc").bind({
            mouseenter: yellow_JC,
            mouseleave: white_JC
        });
        $("#note-IR .note-IR-zx").bind({
            mouseenter: yellow_ZX,
            mouseleave: white_ZX
        });
    } catch (e) {
    }

};

//显示全景
function showAllimgBtn() {
    $('#btn_openAllimg').show();
    $('#qjbtn').show();
    $('#a_BQJ').show();
    $('.dropdown-menu #irvD').show();
}
//仅红外换图
function play_IR() {
    if (ImgNum_hw >= JsonAlarm.IR_PICS.length) {
        ImgNum_hw = 0;
    }

    if ('1' === debug && location.href.indexOf("MonitorAlarm3CForm4") > 0 && '' !== toolName) {//在计算模式下
        if (HWImgInfo.length > 0) {
            //红外换图
            $('#hw').attr('src', JsonAlarm.IR_PICS[ImgNum_hw].split('.')[0] + '_P.JPG' + '?v=' + version);
        }
    } else {
        //红外换图
        $('#hw').attr('src', JsonAlarm.IR_PICS[ImgNum_hw] + '?v=' + version);
    }
    $('#hw-Backup').attr('src', JsonAlarm.IR_PICS[ImgNum_hw] + '?v=' + version); //隐藏的红外图

    $(".IRxuhao-play").text(ImgNum_hw + 1); //红外当前播放帧
    $('#curFrame').text(ImgNum_hw + 1); //红外当前播放帧
    if ('1' === debug && location.href.indexOf("MonitorAlarm3CForm4") > 0) {
        if (HWImgInfo.length > 0) {
            // 初始化图片信息
            initImgInfo(ImgNum_hw);
        }
    }

    if ($('#locInfo').length > 0) {

        if ($("#btn-save").css("display") != "none") {
            EditInfo(ImgNum_hw);
        } else {
            ReturnInfo(ImgNum_hw);
        }
    }
};
//仅可见帧换图
function play_VI() {
    if (ImgNum_vi >= JsonAlarm.VI_PICS.length) {
        ImgNum_vi = 0;
    }
    var _a = '';
    if (JsonAlarm.delay_vi === '') {
        _a = '?r=0';
    } else {
        _a = '?r=1';
    }
    var kjgurl = JsonAlarm.VI_PICS[ImgNum_vi] + _a + '&v=' + version;

    $('#kjg').attr('src', kjgurl);
    $(".VIxuhao-play").text(ImgNum_vi + 1); //局部当前播放帧 

    try {
        var ez = $('#kjg').data('elevateZoom');
        ez.swaptheimage(kjgurl, kjgurl);

        if (defaultImg === $('#kjg').attr('src') || '' === $('#kjg').attr('src')) {
            $('.zoomContainer', document).hide();
        } else {
            $('.zoomContainer', document).show();
        }
    }
    catch (ex) {

    }
};
//仅全景换图
function play_OAB() {

    $('#btn_openAllimg').show();
    Allimg = '';
    if (JsonAlarm.OA_PICS.length != 0) {
        //有A端

        if (ImgNum_all >= JsonAlarm.OA_PICS.length) {
            ImgNum_all = 0;
        }

        Allimg = JsonAlarm.OA_PICS[ImgNum_all] + '?v=' + version;
        OAB = "OA";
        $(".OABxuhao-play").text(ImgNum_all + 1); //全景当前播放帧
        showAllimgBtn();

    }
    else if (JsonAlarm.OB_PICS.length != 0) {
        //没有A，有B

        if (ImgNum_all >= JsonAlarm.OB_PICS.length) {
            ImgNum_all = 0;
        }

        Allimg = JsonAlarm.OB_PICS[ImgNum_all] + '?v=' + version;
        OAB = "OB";
        $(".OABxuhao-play").text(ImgNum_all + 1); //全景当前播放帧
        showAllimgBtn();

    }
    else {
        //没有全景图
        $('#btn_openAllimg').hide();

        $('#qjbtn').hide();
        $('#a_BQJ').hide();
        $('.dropdown-menu #irvD').hide();
    }

    if (PageName == 'big44' || PageName == 'detail') {
        //全景图赋值

        try {
            $('#allimg').attr('src', Allimg)
            changeZoomImg("allimg", Allimg, Allimg);
        }
        catch (e) { }
    }
    else if (PageName == "big22") {

        $("body", parent.document).find("#allimg").attr('src', Allimg);
        changeZoomImg("allimg", Allimg, Allimg);

    }
};

function changeZoomImg(ImgID, s_img, big_img) {

    if ($('#' + ImgID).is(":visible")) {

        $('#' + ImgID).attr('src', s_img);

        myInstance = $('#' + ImgID).data('CloudZoom');
        myInstance.loadImage(s_img, big_img);

    }
};

function createZoom(ImgID, s_img, big_img, _position) {

    if (_position == undefined) {
        _position = 4;
    }

    var myInstance = $('#' + ImgID).data('CloudZoom');
    if (myInstance != undefined) {
        myInstance.destroy();
    }

    var options = {
        zoomImage: big_img,
        //   zoomSizeMode: 'image',      
        animationTime: 0,
        easeTime: 0,
        easing: 0,
        tintOpacity: 0,
        zoomPosition: _position,
        zoomOffsetX: 0,
        zoomOffsetY: 0,
        zoomWidth: $(window).width() / 2 - 20,
        zoomHeight: $(window).height() / 2 - 10
        //        zoomImage: big_img,
        //                    zoomSizeMode: 'image',
        //                    animationTime: 0,
        //                    easeTime: 0,
        //                    easing:0,
        //                    tintOpacity:0

    };

    $('#' + ImgID).attr('src', s_img);
    $('#' + ImgID).CloudZoom(options);

};

//为IMG赋值  播放
function ImgShuffling() {
    Ispaly = 1;
    $("#note .iconstar").attr("src", "/C3/PC/MAlarmMonitoring/ImgTmp/pause.png");
    ImgNum++;

    play();

    if (FLAG == 1) {
        clearInterval(set); //关闭定时器
        Ispaly = 0;
        $("#note .iconstar").attr("src", "/C3/PC/MAlarmMonitoring/ImgTmp/play.png");
        set = setInterval('ImgShuffling()', 5000);
    }
    else {
        clearInterval(set);
        set = setInterval('ImgShuffling()', 500);
    }

};

var CompleteImgNum_Fault = 0;
function preLoadImg_Fault(url) {
    var img = new Image();
    img.src = url;
    img.onerror = function () {

        $('#hw').attr('src', "/Common/img/暂无图片.png");
        $('#kjg').attr('src', "/Common/img/暂无图片.png");
        $("#L-bg").hide();
        $("#R-bg").hide();

        if (defaultImg === $('#kjg').attr('src') || '' === $('#kjg').attr('src')) {
            $('.zoomContainer', document).hide();
        } else {
            $('.zoomContainer', document).show();
        }
    };
    img.onload = function () {
        CompleteImgNum_Fault++;
        if (CompleteImgNum_Fault >= 2) {

            var maxPlayIDX = JsonAlarm.PLAY_IDX.length - 1;
            var _IR_index = JsonAlarm.PLAY_IDX[maxPlayIDX].IR;  //红外帧
            var _VI_index = JsonAlarm.PLAY_IDX[maxPlayIDX].VI;  //可见帧

            // 新增
            //计算出缺陷帧
            //for (var i = 0; i < JsonAlarm.PLAY_IDX.length; i++) {
            //    if (JsonAlarm.PLAY_IDX[i].FLAG == 1) {
            //        //找到对应的序号。
            //        ImgNum = i;
            //        break;
            //    }
            //}
            //FLAG = JsonAlarm.PLAY_IDX[ImgNum].FLAG;
            //var _IR_index = JsonAlarm.PLAY_IDX[ImgNum].IR;  //红外帧
            //var _VI_index = JsonAlarm.PLAY_IDX[ImgNum].VI;  //可见帧

            $('#hw').attr('src', JsonAlarm.IR_PICS[_IR_index] + '?v=' + version);
            var _a = '';
            if (JsonAlarm.delay_vi === '') {
                _a = '?r=0';
            } else {
                _a = '?r=1';
            }
            var kjgurl = JsonAlarm.VI_PICS[_VI_index] + _a + '&v=' + version;
            $('#kjg').attr('src', kjgurl);

            try {
                var ez = $('#kjg').data('elevateZoom');
                ez.swaptheimage(kjgurl, kjgurl); //C2500

                if (defaultImg === $('#kjg').attr('src') || '' === $('#kjg').attr('src')) {
                    $('.zoomContainer', document).hide();
                } else {
                    $('.zoomContainer', document).show();
                }
            } catch (ex) { }

            // $('#all').attr('src', JsonAlarm.IR_PICS[_IR_index]);

            //红外、可见光图片预加载  全部完成后执行播放
            setTimeout(function () {

                for (var i = 0; i < JsonAlarm.IR_PICS.length; i++) {
                    preLoadImg(JsonAlarm.IR_PICS[i]);
                }

                for (var i = 0; i < JsonAlarm.VI_PICS.length; i++) {
                    preLoadImg(JsonAlarm.VI_PICS[i]);
                }

            }, 10);

        };
        $("#L-bg").hide();
        $("#R-bg").hide();
    }
};

//预加载图片
function preLoadImg(url) {
    var img = new Image();
    img.src = url;
    img.onload = function () {
        CompleteImgNum++;
        var totalN = JsonAlarm.IR_PICS.length + JsonAlarm.VI_PICS.length;
        if (CompleteImgNum >= totalN) {
            if (set_frame_record > 0) {
                ImgNum = 10;
            }
            ImgShuffling(); //播放
        }
    }
    img.onerror = function () {
        //加载出错，还是要播放。
        CompleteImgNum++;
        var totalN = JsonAlarm.IR_PICS.length + JsonAlarm.VI_PICS.length;
        if (CompleteImgNum >= totalN) {
            if (set_frame_record > 0) {
                ImgNum = 10;
            }
            ImgShuffling(); //播放
        }
    }
};

//获取信息
function getAlarminfo(alarm) {
    //getImgjson(alarm);   //得到红外分析串。
    if (undefined != alarm) {
        alarmid = alarm;
        if (AlarmJson_3Cform4 != undefined && AlarmJson_3Cform4 != 'none') {
            JsonAlarm = AlarmJson_3Cform4;
            //判断全景图片有无
            if (JsonAlarm.OA_PICS.length == 0 && JsonAlarm.OB_PICS.length == 0) {
                //没有全景图
                $('#qjbtn').hide();
                $('#a_BQJ').hide();
                $('.dropdown-menu #irvD').hide();
            } else {
                showAllimgBtn();
            }

            if (JsonAlarm != undefined) {
                ImgNum = 0; // Imgjson.START_INDEX;
                InfoNum = 0;

                //先加载缺陷帧图片

                var maxPlayIDX = JsonAlarm.PLAY_IDX.length - 1;
                var _IR_index = JsonAlarm.PLAY_IDX[maxPlayIDX].IR;  //红外帧
                var _VI_index = JsonAlarm.PLAY_IDX[maxPlayIDX].VI;  //可见帧

                var hwurl = JsonAlarm.IR_PICS[_IR_index];

                var kjgurl = JsonAlarm.VI_PICS[_VI_index];

                getFrame(); //获取缺陷帧

                preLoadImg_Fault(hwurl);
                preLoadImg_Fault(kjgurl);

                // ImgShuffling();

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

                SetEcharts(); //动态显示曲线图

                $(".xuhao-all").text(JsonAlarm.PLAY_IDX.length - 1); //一共多少帧
                $(".IRxuhao-all").text(JsonAlarm.IR_PICS.length); //红外一共多少帧
                $(".VIxuhao-all").text(JsonAlarm.VI_PICS.length); //局部一共多少帧
                if (JsonAlarm.OA_PICS.length == 0) {
                    $(".OABxuhao-all").text(JsonAlarm.OB_PICS.length); //全景一共多少帧 
                } else {
                    $(".OABxuhao-all").text(JsonAlarm.OA_PICS.length); //全景一共多少帧
                };
            }
        } else {
            var url = "/C3/PC/MRTA/RemoteHandlers/GetlocAlarmImgInfo.ashx?alarmid=" + alarmid;
            $.ajax({
                type: "POST",
                url: url,
                async: true,
                cache: false,
                success: function (result) {
                    JsonAlarm = eval('(' + result + ')');
                    //判断全景图片有无
                    if (JsonAlarm.OA_PICS.length == 0 && JsonAlarm.OB_PICS.length == 0) {
                        //没有全景图
                        $('#qjbtn').hide();
                        $('#a_BQJ').hide();
                        $('.dropdown-menu #irvD').hide();
                    } else {
                        showAllimgBtn();
                    }
                    if (JsonAlarm != undefined) {
                        ImgNum = 0; // Imgjson.START_INDEX;
                        InfoNum = 0;

                        //先加载缺陷帧图片

                        var maxPlayIDX = JsonAlarm.PLAY_IDX.length - 1;
                        var _IR_index = JsonAlarm.PLAY_IDX[maxPlayIDX].IR;  //红外帧
                        var _VI_index = JsonAlarm.PLAY_IDX[maxPlayIDX].VI;  //可见帧

                        var hwurl = JsonAlarm.IR_PICS[_IR_index];
                        var kjgurl = JsonAlarm.VI_PICS[_VI_index];

                        preLoadImg_Fault(hwurl);
                        preLoadImg_Fault(kjgurl);

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

                        SetEcharts(); //动态显示曲线图

                        $(".xuhao-all").text(JsonAlarm.PLAY_IDX.length - 1); //一共多少帧
                        $(".IRxuhao-all").text(JsonAlarm.IR_PICS.length); //红外一共多少帧
                        $(".VIxuhao-all").text(JsonAlarm.VI_PICS.length); //局部一共多少帧
                        if (JsonAlarm.OA_PICS.length == 0) {
                            $(".OABxuhao-all").text(JsonAlarm.OB_PICS.length); //全景一共多少帧 
                        } else {
                            $(".OABxuhao-all").text(JsonAlarm.OA_PICS.length); //全景一共多少帧
                        };
                    }
                }
            });
        }
    }


    if (PageName == 'big44') {
        allimgck();
    }
    else {
        window.parent.allimgck();
    }
};

function allimgck() {

    //    $('#allimg_box').hide();
    //    $('.wdqx').show();

    $("#allimg_box").fadeOut(250, function () {
        $("#wdqx").fadeIn(250);
    });

};

function allimgck_show() {
    //    $('#allimg_box').show();
    //    $('.wdqx').hide();
    $("#wdqx").fadeOut(250);
    $("#allimg_box").fadeIn(250);
    $('#allimg').attr('src', Allimg)
};

//关闭定时器
function Suspended() {
    clearInterval(set); //关闭定时器
};

//点击事件执行的方法
function eConsole(e) {

    if (e.name == '标准导高设计值')
        return;
    //红外图点击。

    clearInterval(set);

    //点击的序号  与红外帧号对应。
    var _index = parseInt(e.dataIndex);  //kdo
    //var _index = parseInt(e.dataIndex);  //echarts


    //计算出播放序列数组对应项。

    for (var i = 0; i < JsonAlarm.PLAY_IDX.length; i++) {
        if (JsonAlarm.PLAY_IDX[i].IR == _index) {
            //找到对应的序号。
            ImgNum = i;
            break;
        }
    }
    play();
}



//画温度曲线
function createLineChart() {
    myChart = echarts.init(document.getElementById('linechart'));

    var TempNumber = 0;

    var str_X = '[';
    for (var i = 1; i <= JsonAlarm.FRAME_INFO_LIST.length; i++) {
        if (i == 1) {
            str_X += i;
        }
        else {
            str_X += "," + i.toString();
        }
    }
    str_X += "]";

    var str_data = '[';
    for (var i = 0; i < JsonAlarm.FRAME_INFO_LIST.length; i++) {
        var aa = parseFloat(JsonAlarm.FRAME_INFO_LIST[i].TEMP_IRV / 100).toFixed(1)
        if (parseInt(aa) < -300 || aa == undefined) {
            aa = '';
        }
        if (i + 1 == JsonAlarm.FRAME_INFO_LIST.length) {
            str_data += aa + ']';
        } else {
            str_data += aa + ',';
        }
        if (parseFloat(JsonAlarm.FRAME_INFO_LIST[i].TEMP_IRV / 100) >= 80) {
            TempNumber++;
        }

    }

    //if (TempNumber > 0) {
    //    if (document.getElementById('rhTime'))
    //        document.getElementById('rhTime').innerHTML = "(燃弧时长:" + TempNumber * 20 + "毫秒)";
    //        $("#rhTime").attr("title", "(燃弧时长:" + TempNumber * 20 + "毫秒)")
    //}
    //最大导高差值
    DGchazhi(JsonAlarm);

    var _data = eval('(' + str_data + ')');

    var _XTitle = eval('(' + str_X + ')');  //申明横坐标

    var option = {
        color: ['#F17D5D', '#92D050'],
        backgroundColor: '#1b1b1b',
        tooltip: {
            trigger: 'axis',
            showDelay: 1,             // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
            formatter: function (params) {
                var res;


                if (params[0].value == undefined || params[0].value == '-1000' || params[0].value === '' || parseInt(params[0].value) < -300) {
                    res = '';
                } else {
                    res = params[0].seriesName + ':' + params[0].value + '℃';
                }
                return res;

            }
        },
        grid: {
            x: 50,
            y: 30,
            x2: 20,
            y2: 30
        },
        xAxis: [
                                        {

                                            type: 'category',
                                            boundaryGap: true,
                                            axisTick: { onGap: false },
                                            splitLine: { show: false },
                                            axisLabel: {
                                                textStyle: {
                                                    color: '#BFBFBF'
                                                }
                                            },
                                            axisLine: {
                                                show: false
                                            },
                                            data: _XTitle
                                        }
        ],
        yAxis: [

                                        {
                                            axisLine: { show: true, lineStyle: { color: 'white', width: 0 } },
                                            axisLabel: {
                                                textStyle: { color: '#fff' },
                                                formatter: function (v) {
                                                    if (check(v)) {
                                                        return v.toFixed(1) + '℃'
                                                    } else {
                                                        return v.toFixed(0) + '℃'
                                                    }
                                                }
                                            },
                                            type: 'value',
                                            splitLine: {
                                                show: true, lineStyle: {
                                                    type: 'dashed'
                                                }
                                            }
                                        }
        ],
        series: [
                                        {
                                            name: '温度',
                                            type: 'line',
                                            showAllSymbol: true,
                                            data: _data
                                        }
        ]

    };
    myChart.setOption(option);
    //绑定点击事件
    myChart.on('click', function (params) { eConsole(params) })


    $("#divDropButton").css("display", "");


};

function createLC_LineChart() {

    myChart = echarts.init(document.getElementById('lc_chart'));

    var str_X = '[';
    for (var i = 1; i <= JsonAlarm.FRAME_INFO_LIST.length; i++) {
        if (i == JsonAlarm.FRAME_INFO_LIST.length) {
            str_X += i + ']';
        } else {
            str_X += i + ',';
        }
    }

    var str_data = '[';
    for (var i = 0; i < JsonAlarm.FRAME_INFO_LIST.length; i++) {
        //if (JsonAlarm.FRAME_INFO_LIST[i].PULLING_VALUE.toString() == '' || JsonAlarm.FRAME_INFO_LIST[i].PULLING_VALUE == '-1000') {
        //    continue;
        //}
        //if (str_data == '[') {
        //    str_data += parseInt(JsonAlarm.FRAME_INFO_LIST[i].PULLING_VALUE);
        //}
        //else {
        //    str_data += "," + parseInt(JsonAlarm.FRAME_INFO_LIST[i].PULLING_VALUE);
        //}
        var aa = JsonAlarm.FRAME_INFO_LIST[i].PULLING_VALUE
        if (parseInt(aa) <= -1000) {
            aa = '';
        }
        if (i + 1 == JsonAlarm.FRAME_INFO_LIST.length) {
            if (aa == '') {
                str_data += aa + ']';
            } else {
                str_data += parseInt(aa) + ']';
            }
        } else {
            if (aa == '') {
                str_data += aa + ',';
            } else {
                str_data += parseInt(aa) + ',';

            }
        }


    }

    //  var _data = [Imgjson.FRAME_INFO[0].TEMP_IRV / 100, Imgjson.FRAME_INFO[1].TEMP_IRV / 100, Imgjson.FRAME_INFO[2].TEMP_IRV / 100, Imgjson.FRAME_INFO[3].TEMP_IRV / 100, Imgjson.FRAME_INFO[4].TEMP_IRV / 100, Imgjson.FRAME_INFO[5].TEMP_IRV / 100, Imgjson.FRAME_INFO[6].TEMP_IRV / 100, Imgjson.FRAME_INFO[7].TEMP_IRV / 100, Imgjson.FRAME_INFO[8].TEMP_IRV / 100, Imgjson.FRAME_INFO[9].TEMP_IRV / 100];
    var _data = eval('(' + str_data + ')');


    //var axisData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];  //申明横坐标
    var _XTitle = eval('(' + str_X + ')');  //申明横坐标

    //最大导高差值
    DGchazhi(JsonAlarm);

    var option = {
        color: ['#F17D5D', '#92D050'],
        backgroundColor: '#1b1b1b',
        tooltip: {
            trigger: 'axis',
            showDelay: 1,             // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
            formatter: function (params) {
                var res;
                if (params[0].value == undefined || params[0].value == '-1000' || params[0].value === '' || parseInt(params[0].value) < -1000) {
                    res = '';
                } else {
                    res = params[0].seriesName + ':' + params[0].value + 'mm';
                }
                return res;

            }
        },
        grid: {
            x: 60,
            y: 30,
            x2: 20,
            y2: 30
        },
        xAxis: [
                                        {

                                            type: 'category',
                                            boundaryGap: true,
                                            axisTick: { onGap: false },
                                            splitLine: { show: false },
                                            axisLabel: {
                                                textStyle: {
                                                    color: '#BFBFBF'
                                                }
                                            },
                                            axisLine: {
                                                show: false
                                            },
                                            data: _XTitle
                                        }
        ],
        yAxis: [

                                        {
                                            axisLine: { show: true, lineStyle: { color: 'white', width: 0 } },
                                            axisLabel: {
                                                textStyle: { color: '#fff' },
                                                formatter: function (v) {
                                                    if (check(v)) {
                                                        return v.toFixed(1) + 'mm'
                                                    } else {
                                                        return v.toFixed(0) + 'mm'
                                                    }
                                                }

                                            },
                                            type: 'value',
                                            splitLine: {
                                                show: true, lineStyle: {
                                                    type: 'dashed'
                                                }
                                            }
                                        }
        ],
        series: [
                                        {
                                            name: '拉出值',
                                            type: 'line',
                                            showAllSymbol: true,
                                            data: _data
                                        }
        ]

    };
    myChart.setOption(option);
    //绑定点击事件
    myChart.on('click', function (params) { eConsole(params) })

}
function createDG_LineChart() {

    myChart = echarts.init(document.getElementById('dg_chart'));

    var str_X = '[';
    for (var i = 1; i <= JsonAlarm.FRAME_INFO_LIST.length; i++) {
        //if (JsonAlarm.FRAME_INFO_LIST[i - 1].LINE_HEIGHT.toString() == '' || JsonAlarm.FRAME_INFO_LIST[i - 1].LINE_HEIGHT == '-1000' || JsonAlarm.FRAME_INFO_LIST[i-1].LINE_HEIGHT == 0) {
        //    continue;
        //}
        //if (str_X == '[') {
        //    str_X += i;
        //}
        //else {
        //    str_X += "," + i.toString();
        //}
        if (i == JsonAlarm.FRAME_INFO_LIST.length) {
            str_X += i + ']';
        } else {
            str_X += i + ',';
        }
    }


    var str_data = '[';
    for (var i = 0; i < JsonAlarm.FRAME_INFO_LIST.length; i++) {
        var aa = JsonAlarm.FRAME_INFO_LIST[i].LINE_HEIGHT
        if (aa == '' || parseInt(aa) <= 3700 || aa == 0 || parseInt(aa) > 7000) {
            aa = '';
        }


        if (i + 1 == JsonAlarm.FRAME_INFO_LIST.length) {
            if (aa == '') {
                str_data += aa + ']';
            } else {
                str_data += parseInt(aa) + ']';
            }
        } else {
            if (aa == '') {
                str_data += aa + ',';
            } else {
                str_data += parseInt(aa) + ',';

            }
        }




        //if (str_data == '[') {
        //    str_data += parseInt( aa);
        //}
        //else {
        //    str_data += "," + parseInt(aa);
        //}
    }


    var _data = eval('(' + str_data + ')');
    console.log(_data)


    var _XTitle = eval('(' + str_X + ')');  //申明横坐标

    //最大导高差值
    DGchazhi(JsonAlarm);

    var option = {
        color: ['#F17D5D', '#92D050'],
        backgroundColor: '#1b1b1b',
        tooltip: {
            trigger: 'axis',
            showDelay: 1,             // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
            formatter: function (params) {
                console.log(params)
                var res;
                if (params[0].value == undefined || params[0].value == '-1000' || params[0].value === '' || parseInt(params[0].value) < -1000) {
                    res = '';
                } else {
                    res = params[0].seriesName + ':' + params[0].value + 'mm';
                }
                return res;

            }
        },
        grid: {
            x: 70,
            y: 30,
            x2: 20,
            y2: 30
        },
        xAxis: [
                                        {

                                            type: 'category',
                                            boundaryGap: true,
                                            axisTick: { onGap: false },
                                            splitLine: { show: false },
                                            axisLabel: {
                                                textStyle: {
                                                    color: '#BFBFBF'
                                                }
                                            },
                                            axisLine: {
                                                show: false
                                            },
                                            data: _XTitle
                                        }
        ],
        yAxis: [

                                        {
                                            show: true,
                                            type: 'value',
                                            scale: true,
                                            //precision: 1,
                                            //min: 3700,
                                            //max: 7000,
                                            boundaryGap: [0.05, 0.05],
                                            axisLabel: {
                                                textStyle: { color: '#fff' },
                                                formatter: function (v) {
                                                    if (check(v)) {
                                                        return v.toFixed(1) + 'mm'
                                                    } else {
                                                        return v.toFixed(0) + 'mm'
                                                    }
                                                }
                                            },
                                            axisLine: { show: true, lineStyle: { color: 'white', width: 0 } },
                                            splitLine: {
                                                show: true, lineStyle: {
                                                    type: 'dashed'
                                                }
                                            }
                                        }
        ],
        series: [
                                        {
                                            name: '导高值',
                                            type: 'line',
                                            showAllSymbol: true,
                                            data: _data
                                            //                                            ,
                                            //                                            markLine: {
                                            //                                                itemStyle: {
                                            //                                                    color: '#000000'
                                            //                                                },
                                            //                                                data: [
                                            //    											[
                                            //    											    { name: '标准导高设计值', value: 7000, x: 0, y: 30, itemStyle: { normal: { color: '#1e90ff'}} },
                                            //    											    { name: '', x: 700, y: 30, itemStyle: { normal: { color: '#1e90ff'}} }
                                            //    											],
                                            //    											[
                                            //    											    { name: '标准导高设计值', value: 5000, x: 0, y: 310, itemStyle: { normal: { color: '#1e90ff'}} },
                                            //    											    { name: '', x: 700, y: 310, itemStyle: { normal: { color: '#1e90ff'}} }
                                            //    											]
                                            //                                              ]
                                            //                                            }
                                        }
        ]

    };
    myChart.setOption(option);
    //绑定点击事件
    //myChart.on(ecConfig.EVENT.CLICK, eConsole);
    myChart.on('click', function (params) { eConsole(params) })


    //    $("#dg_chart").kendoChart({

    //        chartArea: {
    //            background: ""
    //        },
    //        seriesDefaults: {
    //            type: "line",
    //            style: "smooth"
    //        },
    //        legend: {
    //            visible: false
    //        },
    //        valueAxis: {
    //            labels: {
    //                format: "{0:N0}mm"
    //            },
    //            color: "#fff"
    //        },
    //        series: [{
    //            name: "导高值",
    //            data: _data
    //        }],
    //        categoryAxis: {
    //            categories: _XTitle,
    //            majorGridLines: {
    //                visible: false
    //            },
    //            color: "#fff",
    //            visible: true
    //        },
    //        tooltip: {
    //            visible: true,
    //            format: "{0}%",
    //            template: "#= series.name #: #= value #mm",
    //            color: "#fff"
    //        },
    //        seriesClick: Showbarinfo
    //    });
}


function createWD_LineChart() {
    var myChart = echarts.init(document.getElementById('wd_chart'));



    var str_X = '[';
    for (var i = 1; i <= JsonAlarm.FRAME_INFO_LIST.length; i++) {
        if (i == 1) {
            str_X += i;
        }
        else {
            str_X += "," + i.toString();
        }
    }
    str_X += "]";

    var str_data = '[';
    for (var i = 0; i < JsonAlarm.FRAME_INFO_LIST.length; i++) {
        var aa = parseFloat(JsonAlarm.FRAME_INFO_LIST[i].TEMP_IRV / 100).toFixed(1)
        if (parseInt(aa) < -300 || aa == undefined) {
            aa = '';
        }
        if (i + 1 == JsonAlarm.FRAME_INFO_LIST.length) {
            str_data += aa + ']';
        } else {
            str_data += aa + ',';
        }


    }

    var _data = eval('(' + str_data + ')');

    var str_dataDG = '[';
    //for (var i = 0; i < JsonAlarm.FRAME_INFO_LIST.length; i++) {
    //    if (JsonAlarm.FRAME_INFO_LIST[i].LINE_HEIGHT.toString() == '' || JsonAlarm.FRAME_INFO_LIST[i].LINE_HEIGHT == '-1000' || JsonAlarm.FRAME_INFO_LIST[i].LINE_HEIGHT == 0) {
    //        str_dataDG += ","
    //        continue;
    //    }
    //    if (i < JsonAlarm.FRAME_INFO_LIST.length) {
    //        str_dataDG += parseInt(JsonAlarm.FRAME_INFO_LIST[i].LINE_HEIGHT)+',';
    //    }

    //}

    for (var i = 0; i < JsonAlarm.FRAME_INFO_LIST.length; i++) {
        var aa = JsonAlarm.FRAME_INFO_LIST[i].LINE_HEIGHT
        if (aa == '' || parseInt(aa) <= 3700 || aa == 0 || parseInt(aa) > 7000) {
            aa = '';
        }


        if (i + 1 == JsonAlarm.FRAME_INFO_LIST.length) {
            if (aa == '') {
                str_dataDG += aa + ']';
            } else {
                str_dataDG += parseInt(aa) + ']';
            }
        } else {
            if (aa == '') {
                str_dataDG += aa + ',';
            } else {
                str_dataDG += parseInt(aa) + ',';

            }
        }




        //if (str_data == '[') {
        //    str_data += parseInt( aa);
        //}
        //else {
        //    str_data += "," + parseInt(aa);
        //}
    }



    var _dataDG = eval('(' + str_dataDG + ')');


    var _XTitle = eval('(' + str_X + ')');  //申明横坐标




    // 指定图表的配置项和数据
    var option = {
        color: ['#F17D5D', '#92D050'],
        backgroundColor: '#1b1b1b',
        legend: {
            data: ['温度', '导高'],
            x: 'left',
            textStyle: {
                color: '#BFBFBF'
            }
        },
        tooltip: {
            formatter: function (params) {
                var res = ''; console.log(params)
                if (params[0].value != undefined) {
                    res = params[0].seriesName + ':' + params[0].value + '℃' + '<br/>';
                }
                if (params[1].value != undefined) {
                    res += params[1].seriesName + ':' + params[1].value + 'mm';
                }
                return res;

            },
            trigger: 'axis',
            showDelay: 1,             // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
            axisPointer: {
                animation: false
            }

        },
        grid: {
            x: 55,
            y: 65,
            x2: 70,
            y2: 30
        },
        xAxis: [
                      {

                          type: 'category',
                          boundaryGap: true,
                          axisTick: { onGap: false },
                          splitLine: { show: false },
                          axisLabel: {
                              textStyle: {
                                  color: '#BFBFBF'
                              }
                          },
                          axisLine: {
                              show: false
                          },
                          data: _XTitle
                      }
        ],
        yAxis: [

                       {
                           axisLine: { show: true, lineStyle: { color: 'white', width: 0 } },
                           axisLabel: {
                               textStyle: { color: '#fff' },
                               formatter: function (v) {
                                   if (check(v)) {
                                       return v.toFixed(1) + '℃'
                                   } else {
                                       return v.toFixed(0) + '℃'
                                   }
                               }
                           },
                           type: 'value',
                           splitLine: {
                               show: true, lineStyle: {
                                   type: 'dashed'
                               }
                           },


                           name: '温度(℃)',
                           //min:-40

                       },
                      {
                          axisLine: { show: true, lineStyle: { color: 'white', width: 0 } },
                          axisLabel: {
                              textStyle: { color: '#fff' },
                              formatter: function (v) {
                                  if (check(v)) {
                                      return v.toFixed(1) + 'mm'
                                  } else {
                                      return v.toFixed(0) + 'mm'
                                  }
                              }

                          },

                          type: 'value',
                          splitLine: {
                              show: true, lineStyle: {
                                  type: 'dashed'
                              }
                          },
                          name: '导高(mm)',
                          scale: true
                      }
        ],
        series: [
                     {
                         name: '温度',
                         type: 'line',
                         showAllSymbol: true,
                         data: _data
                     },
                     {

                         yAxisIndex: 1,
                         name: '导高',
                         type: 'line',
                         data: _dataDG
                     }
        ]

    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    myChart.on('click', function (params) { eConsole(params) })
    // $('#linechart,#lc_chart,#dg_chart,#wd_chart').css('background', 'rgb(27,27,27)');
}

function createLC_morethanOne_LineChart(json) {

    myChart = echarts.init(document.getElementById('lcm_chart'));
    var color = ['#F17D5D', '#73C221', '#3DD5F1', '#9E6BB8']//曲线颜色

    var legend_data = []//控制器值 与曲线对应

    var series = []//曲线值
    var select_option = ''//下拉选择的选项
    var str_X = '[';
    for (var i = 1; i <= json.data.length; i++) {
        if (i == 1) {
            str_X += i;
        }
        else {
            str_X += "," + i;
        }
    }
    str_X += "]";



    for (var i = 0; i < 4; i++) {
        if (json.data[i].STAGGER.split(',')[i] != '' && json.data[i].STAGGER.split(',')[i] != undefined) {

            var data_one = [];
            for (var j = 0; j < json.data.length; j++) {
                if (parseInt(json.data[j].STAGGER.split(',')[i]) > -1000 && parseInt(json.data[j].STAGGER.split(',')[i]) < 1000 && parseInt(json.data[j].STAGGER.split(',')[i]) != '')
                    data_one[j] = json.data[j].STAGGER.split(',')[i]
            }
            series[i] = {
                name: '第' + (i + 1) + '组',
                type: 'line',
                //stack:'拉出',//折线堆积使用
                data: data_one
            }
            legend_data[i] = '第' + (i + 1) + '组';
            select_option += '<option value="' + (i + 1) + '">' + legend_data[i] + '</option>'
        }

    }
    //console.log(series)
    //console.log(str_X)
    console.log(series)

    var _XTitle = eval('(' + str_X + ')');  //申明横坐标





    // 指定图表的配置项和数据
    var option = {
        backgroundColor: '#1b1b1b',
        color: color,
        title: {
            text: '多组拉出值选择:',
            left: 'left',
            textStyle: { color: '#3898D1', fontSize: 13 },
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                console.log(params)
                console.log(params.length)
                console.log(params[0].name)
                var res = '';
                //res=
                for (var i = 0; i < params.length; i++) {
                    if (params[i].data == undefined || params[i].data == '') {
                        params[i].data = '';
                    }
                    switch (params[i].seriesName) {
                        case '第' + (i + 1) + '组':
                            res += '<span style="color:' + color[i] + ';">第' + (i + 1) + '组</span>:' + params[i].data + '<br/>'
                            break;
                    }
                }
                return res;

            }
        },
        legend: {
            textStyle: { color: ['#BBBBBB'] },
            data: legend_data,
            left: 0,
            top: '5%',
            selectedMode: true
        },
        grid: {
            y: '15%',
            x: '70',
            x2: '10',
            y2: '30',
        },
        xAxis: {
            type: 'category',
            boundaryGap: true,
            axisTick: { onGap: false },
            splitLine: { show: false },
            axisLabel: {
                textStyle: {
                    color: '#BFBFBF'
                }
            },
            axisLine: {
                show: false
            },
            data: _XTitle
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                textStyle: { color: '#fff' },
                formatter: function (v) {
                    if (check(v)) {
                        return v.toFixed(1) + 'mm'
                    } else {
                        return v.toFixed(0) + 'mm'
                    }
                }
            },
            axisLine: { show: true, lineStyle: { color: 'white', width: 0 } },
            splitLine: {
                show: true, lineStyle: {
                    type: 'dashed'
                }
            },

            scale: true
        },
        series: series
    };




    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    var __html = ' <div style="position:absolute;width:280px;height:60px;color:white;top:0;right:0">\
                        <div style="height:60px;margin:0 auto;width:280px;float:right">\
                            <span style="line-height:35px;display:inline-block;">请选择：</span>\
                            <select id="LC_chose" style="width:90px;border-radius:4px;margin:5px 0">'+ select_option + '\
                            </select>\
                            <a name="btn_sendinfo" id="btn_saveLC" title="保存" class="btn btn-info " style="padding:4px 5px 4px;"><i class="glyphicon glyphicon-list-alt"></i> 保存</a>\
                            <a name="btn_sendinfo" id="btn_cansLC" title="取消" class="btn btn-success " style="padding:4px 5px 4px;"><i class="icon-remove-sign icon-white"></i> 取消</a>\
                        </div>\
                    </div>'
    $('#lcm_chart').append(__html)
    $('#btn_cansLC').click(function () { $('#lcm_chart').hide() })
    $('#btn_saveLC').click(function () { LC_choose_notOne_save() })

    myChart.on('click', function (params) { eConsole(params) })
    // $('#linechart,#lc_chart,#dg_chart,#wd_chart').css('background', 'rgb(27,27,27)');

}

//点击跳转到某一帧上。
function Showbarinfo(e) {

    //红外图点击。

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
    play();
};


//点击跳转到某一帧上。
function GoToFrame(_index) {

    clearInterval(set);

    //滑块点击。

    ImgNum = _index;
    Ispaly = 0;
    $("#note-IR").show();
    $("#note-VI").show();
    if ($("#allimg").is(":visible")) {
        $("#note-OAB").show();
    };
    $(".iconstar").attr("src", "/C3/PC/MAlarmMonitoring/ImgTmp/play.png");

    play();
};

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
    //ImgNum = frame_index;
    Ispaly = 0;
    $("#note-IR").show();
    $("#note-VI").show();
    if ($("#allimg").is(":visible")) {
        $("#note-OAB").show();
    };
    $(".iconstar").attr("src", "/C3/PC/MAlarmMonitoring/ImgTmp/play.png");

    play();

    //新增
    if ('1' === debug && location.href.indexOf("MonitorAlarm3CForm4") > 0) { //对内
        clearSet(); //清除中心点图标、接触点图标，清空画布
    }
};


//关闭层
function out() {
    $('#note').animate({ top: '0' }, 500, function () {
        $(this).css({ display: 'none', top: '-5px' });
    });
};
//处理事件
function ShowC3Form() {
    //    window.open("../MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=" + alarmid, "_blank");
    window.open("/C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=" + alarmid + "&v=" + version, "_blank");
};
//查看全景
function ShowAllImg() {
    // out();
    if (Allimg != "") {

        switch (PageName) {
            case 'big44':


                if ($("#wdqx").is(":visible")) {
                    allimgck_show();
                }
                else {

                    allimgck();
                }



                break;
            case 'big22':
                $("body", parent.document).find("#allimg").show();
                $("body", parent.document).find("#Iframe3").hide();

                break;
            case 'detail':

                if ($("#allimg").is(":visible")) {
                    $("#allimg").fadeOut(250);
                    $("#note-OAB").fadeOut(250);
                } else {
                    $("#allimg").css({ "zIndex": "1", "position": "absolute", "top": "0" });
                    $("#allimg").fadeIn(250);
                    $("#note-OAB").fadeIn(250);

                    changeZoomImg("allimg", Allimg, Allimg);
                }

                break;
        }


    } else {
        ymPrompt.errorInfo('<span style="color:#000;">全景图像还未上传</span>', null, null, '提示信息', null);
    }
};

/*/*
 * @desc 设置播放器高亮或正常
 * @param 
 */
function setControlLight(PlayerType, PlayerStatus) {
    if ('active' === PlayerStatus) { //设置高亮
        if ('IR' === PlayerType) { //红外
            if ($('#note-IR').css('background').indexOf('bg_w_188') > 0) {
                $('#note-IR').css('background', 'url("/C3/PC/MAlarmMonitoring/ImgTmp/bg_w_188_light.png") no-repeat');
            }
            if ($('#note-IR').css('background').indexOf('bg_w_294') > 0) {
                $('#note-IR').css('background', 'url("/C3/PC/MAlarmMonitoring/ImgTmp/bg_w_294_light.png") no-repeat');
            }
            if ($('#note-IR').css('background').indexOf('bg_w_356') > 0) {
                $('#note-IR').css('background', 'url("/C3/PC/MAlarmMonitoring/ImgTmp/bg_w_356_light.png") no-repeat');
            }
            if ($('#note-IR').css('background').indexOf('bg_w_252') > 0) {
                $('#note-IR').css('background', 'url("/C3/PC/MAlarmMonitoring/ImgTmp/bg_w_252_light.png") no-repeat');
            }


        } else if ('KJG' === PlayerType) { //局部
            $('#note-VI').css('background', 'url("/C3/PC/MAlarmMonitoring/ImgTmp/bg_w_188_light.png") no-repeat');
        } else if ('OAB' === PlayerType) { //全景
            $('#note-OAB').css('background', 'url("/C3/PC/MAlarmMonitoring/ImgTmp/bg_w_188_light.png") no-repeat');
        }
    }
    if ('normal' === PlayerStatus) { //设置正常
        if ('IR' === PlayerType) { //红外
            if ($('#note-IR').css('background').indexOf('bg_w_188_light') > 0) {
                $('#note-IR').css('background', 'url("/C3/PC/MAlarmMonitoring/ImgTmp/bg_w_188.png") no-repeat');
            }
            if ($('#note-IR').css('background').indexOf('bg_w_294_light') > 0) {
                $('#note-IR').css('background', 'url("/C3/PC/MAlarmMonitoring/ImgTmp/bg_w_294.png") no-repeat');
            }
            if ($('#note-IR').css('background').indexOf('bg_w_356_light') > 0) {
                $('#note-IR').css('background', 'url("/C3/PC/MAlarmMonitoring/ImgTmp/bg_w_356.png") no-repeat');
            }
            if ($('#note-IR').css('background').indexOf('bg_w_252_light') > 0) {
                $('#note-IR').css('background', 'url("/C3/PC/MAlarmMonitoring/ImgTmp/bg_w_252.png") no-repeat');
            }
        } else if ('KJG' === PlayerType) { //局部
            $('#note-VI').css('background', 'url("/C3/PC/MAlarmMonitoring/ImgTmp/bg_w_188.png") no-repeat');
        } else if ('OAB' === PlayerType) { //全景
            $('#note-OAB').css('background', 'url("/C3/PC/MAlarmMonitoring/ImgTmp/bg_w_188.png") no-repeat');
        }
    }
}

/*/*
 * @desc 暂停
 * @param 
 */
function PauseImgShuffling() {
    //新增
    if ('1' === debug && location.href.indexOf("MonitorAlarm3CForm4") > 0) { //对内
        if ('' !== toolName && isExit === false) {
            toolName = '';
            isExit = true;
            // 切换成红外图
            var hw = $('#hw').attr('src').split('_P')[0] + '.jpg' + '?v=' + version;
            $('#hw').attr({ 'src': hw, 'display': 'inline-block' });
        }
    }

    Ispaly = 0;
    Suspended();
    $("#note-IR").show();
    $("#note-VI").show();
    if ($("#allimg").is(":visible")) {
        $("#note-OAB").show();
    };
    $(".iconstar").attr("src", "/C3/PC/MAlarmMonitoring/ImgTmp/play.png");

    //新增
    if ('1' === debug && location.href.indexOf("MonitorAlarm3CForm4") > 0) { //对内
        clearSet(); //清除中心点图标、接触点图标，清空画布
    }
};

//播放/暂停  
function dbImgShuffling() {
    //新增
    if ('1' === debug && location.href.indexOf("MonitorAlarm3CForm4") > 0) { //对内
        if ('' !== toolName && isExit === false) {
            toolName = '';
            isExit = true;
            // 切换成红外图
            var hw = $('#hw').attr('src').split('_P')[0] + '.jpg' + '?v=' + version;
            $('#hw').attr({ 'src': hw, 'display': 'inline-block' });
        }
    }

    if (Ispaly == "1") {
        Ispaly = 0;
        Suspended();
        $("#note-IR").show();
        $("#note-VI").show();
        if ($("#allimg").is(":visible")) {
            $("#note-OAB").show();
        };
        $(".iconstar").attr("src", "/C3/PC/MAlarmMonitoring/ImgTmp/play.png");
    } else {
        Ispaly = 1;
        ImgShuffling();
        $("#note-IR").hide();
        $("#note-VI").hide();
        $("#note-OAB").hide();
        $(".iconstar").attr("src", '/C3/PC/MAlarmMonitoring/ImgTmp/pause.png');
    }

    //新增
    if ('1' === debug && location.href.indexOf("MonitorAlarm3CForm4") > 0) { //对内
        clearSet(); //清除中心点图标、接触点图标，清空画布
    }
    try {
        setControlLight('OAB', 'normal');//设置播放器正常
        setControlLight('KJG', 'normal');//设置播放器正常
        setControlLight('IR', 'normal');//设置播放器正常
    } catch (e) {
    }


};
//上一张
function upImg() {
    Ispaly = 0;
    Suspended(); //暂停
    $("#note-IR").show();
    $("#note-VI").show();
    if ($("#allimg").is(":visible")) {
        $("#note-OAB").show();
    };
    $(".iconstar").attr("src", "/C3/PC/MAlarmMonitoring/ImgTmp/play.png");
    ImgNum = JsonAlarm.PLAY_IDX[ImgNum].IR;
    if (ImgNum > 0) {
        ImgNum--;
    }

    play();

    //新增
    if ('1' === debug && location.href.indexOf("MonitorAlarm3CForm4") > 0) { //对内
        clearSet(); //清除中心点图标、接触点图标，清空画布
    }
};
function upImg_IR() {

    Ispaly = 0;
    Suspended(); //暂停

    if (ImgNum_hw > 0) {
        ImgNum_hw--;
    }

    play_IR();

    //新增
    if ('1' === debug && location.href.indexOf("MonitorAlarm3CForm4") > 0) { //对内
        clearSet(); //清除中心点图标、接触点图标，清空画布
    }
};
function upImg_VI() {

    Ispaly = 0;
    $("#note .iconstar").attr("src", "/C3/PC/MAlarmMonitoring/ImgTmp/play.png");
    Suspended(); //暂停
    if (ImgNum_vi > 0) {
        ImgNum_vi--;
    }

    play_VI();
};
function upImg_OAB() {
    Ispaly = 0;
    $("#note .iconstar").attr("src", "/C3/PC/MAlarmMonitoring/ImgTmp/play.png");
    Suspended(); //暂停
    if (ImgNum_all > 0) {
        ImgNum_all--;
    }

    play_OAB();
};
//下一张
function lastImg() {
    Ispaly = 0;
    Suspended(); //暂停
    $("#note-IR").show();
    $("#note-VI").show();
    if ($("#allimg").is(":visible")) {
        $("#note-OAB").show();
    };
    $(".iconstar").attr("src", "/C3/PC/MAlarmMonitoring/ImgTmp/play.png");
    ImgNum = JsonAlarm.PLAY_IDX[ImgNum].IR;
    if (ImgNum >= JsonAlarm.PLAY_IDX.length - 2) {
        ImgNum = -1;
    }
    if (ImgNum < JsonAlarm.PLAY_IDX.length) {
        ImgNum++;
    }
    play();

    //新增
    if ('1' === debug && location.href.indexOf("MonitorAlarm3CForm4") > 0) { //对内
        clearSet(); //清除中心点图标、接触点图标，清空画布
    }
};
function lastImg_IR() {
    Ispaly = 0;
    $("#note .iconstar").attr("src", "/C3/PC/MAlarmMonitoring/ImgTmp/play.png");
    Suspended(); //暂停
    if (ImgNum_hw < JsonAlarm.IR_PICS.length) {
        ImgNum_hw++;
    }
    play_IR();

    //新增
    if ('1' === debug && location.href.indexOf("MonitorAlarm3CForm4") > 0) { //对内
        clearSet(); //清除中心点图标、接触点图标，清空画布
    }
};
function lastImg_VI() {
    Ispaly = 0;
    $("#note .iconstar").attr("src", "/C3/PC/MAlarmMonitoring/ImgTmp/play.png");
    Suspended(); //暂停
    if (ImgNum_vi < JsonAlarm.VI_PICS.length) {
        ImgNum_vi++;
    }
    play_VI();

};
function lastImg_OAB() {
    Ispaly = 0;
    $("#note .iconstar").attr("src", "/C3/PC/MAlarmMonitoring/ImgTmp/play.png");
    Suspended(); //暂停
    if (JsonAlarm.OA_PICS.length != 0) {
        if (ImgNum_all < JsonAlarm.OA_PICS.length) {
            ImgNum_all++;
        }
    } else if (JsonAlarm.OB_PICS.length != 0) {
        if (ImgNum_all < JsonAlarm.OB_PICS.length) {
            ImgNum_all++;
        }
    } else {

    }
    play_OAB();

};

//全屏图片
function ALLimg(e) {
    //document.getElementById("note").style.display = "none";
    window.parent.ALLimg(e);
};


//44大屏，报警列表点击。
function ClickAlarm(alarmid, Type) {

    SetAlarm(alarmid);

    SetGis(alarmid, Type);
};

//动态显示曲线图
function SetEcharts() {

    if ('拉出值超限' === JsonAlarm.SUMMARYDIC || '疑似水平间距过大' === JsonAlarm.SUMMARYDIC) {
        $("#curve").attr("qx", 'lc');
    } else if ('导高值超限' === JsonAlarm.SUMMARYDIC || '导高差' === JsonAlarm.SUMMARYDIC) {
        $("#curve").attr("qx", 'dg');
    } else {
        $("#curve").attr("qx", 'wd');
    }

    if ($(".RowLR #chartTitle").length > 0) {
        switch ($("#chartTitle").text()) {
            case "温度曲线":
                setTimeout("createLineChart()", 300);
                break;
            case "拉出值曲线":
                setTimeout("createLC_LineChart()", 300);
                break;
            case "导高值曲线":
                setTimeout("createDG_LineChart()", 300);
                break;
            case "温度导高曲线":
                setTimeout("createWD_LineChart()", 300);
                break;
        }
    } else {
        switch ($("#curve").attr("qx")) {
            case "wd":
                setTimeout("createLineChart()", 300);
                $("#linechart").show();
                $("#lc_chart").hide();
                $("#dg_chart").hide();
                $("#chartTitle").text("温度曲线");
                $("#curve").html("温<br />度<br />曲<br />线").attr("qx", "wd");
                break;
            case "lc":
                setTimeout("createLC_LineChart()", 300);
                $("#linechart").hide();
                $("#lc_chart").show();
                $("#dg_chart").hide();
                $("#chartTitle").text("拉出值曲线");
                $("#curve").html("拉<br />出<br />值<br />曲<br />线").attr("qx", "lc");
                break;
            case "dg":
                setTimeout("createDG_LineChart()", 300);
                $("#linechart").hide();
                $("#lc_chart").hide();
                $("#dg_chart").show();
                $("#chartTitle").text("导高值曲线");
                $("#curve").html("导<br />高<br />值<br />曲<br />线").attr("qx", "dg");
                break;
            default:
                setTimeout("createLineChart()", 300);
                $("#linechart").show();
                $("#lc_chart").hide();
                $("#dg_chart").hide();
                $("#chartTitle").text("温度曲线");
                $("#curve").html("温<br />度<br />曲<br />线").attr("qx", "wd");
                break;
        }
    }
};

//22屏，报警列表点击。
function getAlarminfoAndGIS(alarmid, gisx, gisy, type, linecode) {
    getAlarminfo(alarmid);
    if ($.browser.msie) {
        //IE         
        window.parent.frames["Iframe1"].SetAlarmGIS(alarmid, "");
    }
    else {
        //FF                  
        $("body", parent.document).find("#Iframe1").contents()[0].defaultView.SetAlarmGIS(alarmid, "");
        //  $("#Iframe2").contents()[0].defaultView.clickLoco(locaCode);
    }

    window.parent.Getlineinfo(linecode);
};

function GetPLAY_IDX() {
    var IR_index = JsonAlarm.PLAY_IDX[ImgNum].IR;  //红外帧
    var VI_index = JsonAlarm.PLAY_IDX[ImgNum].VI;  //可见帧
    var IR_img = JsonAlarm.IR_PICS[IR_index].split('/')[5] + "/" + JsonAlarm.IR_PICS[IR_index].split('/')[6];  //红外帧
    var VI_img = JsonAlarm.VI_PICS[VI_index].split('/')[5] + "/" + JsonAlarm.VI_PICS[VI_index].split('/')[6];  //可见帧
    return IR_img + "@" + VI_img;
};

//点击帧编辑信息
function EditInfo(IR_index) {
    //var editInfo = $('#locInfo').html();
    var listinfo = "";
    var temp_irv = parseFloat(JsonAlarm.FRAME_INFO_LIST[IR_index].TEMP_IRV / 100).toFixed(1);
    if (temp_irv > -1000) {
        //小于-1000的不显示。
        listinfo += '最高温度：<input class="locInfo_Temp_Irv" type="text" value="' + temp_irv + '" /> ℃ &nbsp;';
    } else {
        listinfo += '最高温度：<input class="locInfo_Temp_Irv" type="text" /> ℃ &nbsp;';
    }
    var temp_env = parseFloat(JsonAlarm.FRAME_INFO_LIST[IR_index].TEMP_ENV / 100).toFixed(1);
    if (temp_env > -1000) {
        //小于-1000的不显示。
        listinfo += '环境温度：<input class="locInfo_Temp_Env" type="text" value="' + temp_env + '" /> ℃ &nbsp;';
    } else {
        listinfo += '环境温度：<input class="locInfo_Temp_Env" type="text" /> ℃ &nbsp;';
    }

    if (JsonAlarm.FRAME_INFO_LIST[IR_index].LINE_HEIGHT > 0) {
        listinfo += '导高值：<input class="locInfo_Line_Height" type="text" value="' + JsonAlarm.FRAME_INFO_LIST[IR_index].LINE_HEIGHT + '" /> mm &nbsp;';
    } else {
        listinfo += '导高值：<input class="locInfo_Line_Height" type="text" /> mm &nbsp;';
    }

    if (JsonAlarm.FRAME_INFO_LIST[IR_index].PULLING_VALUE > -1000 && JsonAlarm.FRAME_INFO_LIST[IR_index].PULLING_VALUE < 999) {
        listinfo += '拉出值：<input class="locInfo_Pulling_Value" type="text" value="' + JsonAlarm.FRAME_INFO_LIST[IR_index].PULLING_VALUE + '" /> mm &nbsp;';
    } else {
        listinfo += '拉出值：<input class="locInfo_Pulling_Value" type="text" /> mm &nbsp;';
    }

    if (JsonAlarm.FRAME_INFO_LIST[IR_index].SPEED >= 0 && JsonAlarm.FRAME_INFO_LIST[IR_index].SPEED <= 400) {
        listinfo += '速度：<input class="locInfo_Speed" type="text" value="' + JsonAlarm.FRAME_INFO_LIST[IR_index].SPEED + '" /> km/h &nbsp;';
    } else {
        listinfo += '速度：<input class="locInfo_Speed" type="text" /> km/h &nbsp;';
    }

    $('#locInfo').html(listinfo);
};
//返回默认信息
function ReturnInfo(ImgNum_hw) {
    var temp = '';
    var temp_irv = parseFloat(JsonAlarm.FRAME_INFO_LIST[ImgNum_hw].TEMP_IRV / 100).toFixed(1);
    if (temp_irv > -1000) {
        //小于-1000的不显示。
        temp += '最高温度：' + temp_irv + "℃ &nbsp;";
    }
    else {

    }
    var temp_env = parseFloat(JsonAlarm.FRAME_INFO_LIST[ImgNum_hw].TEMP_ENV / 100).toFixed(1);
    if (temp_env > -1000) {
        //小于-1000的不显示。
        temp += '环境温度：' + temp_env + "℃ &nbsp;";
    }
    else {

    }
    if (JsonAlarm.FRAME_INFO_LIST[ImgNum_hw].LINE_HEIGHT > 0) {
        temp += '导高值：' + JsonAlarm.FRAME_INFO_LIST[ImgNum_hw].LINE_HEIGHT + "mm &nbsp;";
    }

    if (JsonAlarm.FRAME_INFO_LIST[ImgNum_hw].PULLING_VALUE > -1000 && JsonAlarm.FRAME_INFO_LIST[ImgNum_hw].PULLING_VALUE < 999) {
        temp += '拉出值：' + JsonAlarm.FRAME_INFO_LIST[ImgNum_hw].PULLING_VALUE + "mm &nbsp;";
    }

    if (JsonAlarm.FRAME_INFO_LIST[ImgNum_hw].SPEED >= 0 && JsonAlarm.FRAME_INFO_LIST[ImgNum_hw].SPEED <= 400)
        temp += '速度：' + JsonAlarm.FRAME_INFO_LIST[ImgNum_hw].SPEED + "km/h &nbsp;";

    $('#locInfo').html(temp);
    if (FunEnable('Fun_EditPosition') == "True") {
        $("#btn-start").show();
    }
};

//计算导高差值

function DGchazhi(JsonAlarm) {
    //最大导高差值
    if (document.getElementById('dgzdcz')) {
        var dg = [];
        var DgValue;
        for (var i = 0; i < JsonAlarm.FRAME_INFO_LIST.length; i++) {
            if (JsonAlarm.FRAME_INFO_LIST[i].LINE_HEIGHT == "-1000" || parseInt(JsonAlarm.FRAME_INFO_LIST[i].LINE_HEIGHT) <= 3700 || parseInt(JsonAlarm.FRAME_INFO_LIST[i].LINE_HEIGHT) > 7000) {
                continue;
            } else {
                dg.push(JsonAlarm.FRAME_INFO_LIST[i].LINE_HEIGHT);
            }
        }
        if (dg.length == 1) {
            DgValue = 0;
        } else {
            dg.sort(function (a, b) { return a - b });
            DgValue = dg[dg.length - 1] - dg[0];
        }

        $("#dgzdcz").attr("data-original-title", "最大导高差值：" + DgValue + "mm");
        //绑定标签插件
        $('[rel="tooltip"],[data-rel="tooltip"]').tooltip({ "placement": "right", delay: { show: 0, hide: 0 }, });
    }
};

//第一帧
function FristFrame() {
    clearInterval(set);
    ImgNum = 0;
    Ispaly = 0;
    $("#note-IR").show();
    $("#note-VI").show();
    if ($("#allimg").is(":visible")) {
        $("#note-OAB").show();
    };
    $(".iconstar").attr("src", "/C3/PC/MAlarmMonitoring/ImgTmp/play.png");

    play();
    ImgNum_vi = 0;
    ImgNum_all = 0;
    play_VI();
    play_OAB();
};


//如果全景存在就影藏
function hide_all_img() {
    if ($("#allimg").is(":visible")) {
        $("#allimg").fadeOut(250);
        $("#note-OAB").fadeOut(250);
    }
    $("#lcm_chart").hide()

}

//獲取控制對象 關於AD控制的
$(function () {
    if (PageName == 'detail') {
        $('.RowLR .R,.RowLR #divDropButton,.RowLR .L div').click(function () {
            control_obj = 'Global';
            setControlLight('OAB', 'normal');//设置播放器正常
            setControlLight('KJG', 'normal');//设置播放器正常
            setControlLight('IR', 'normal');//设置播放器正常
            //console.log(control_obj)
        })
        $('#allimg').click(function () {
            control_obj = 'OAB';
            setControlLight('OAB', 'active');//设置播放器高亮
            setControlLight('KJG', 'normal');//设置播放器正常
            setControlLight('IR', 'normal');//设置播放器正常
            //console.log(control_obj)
        })
        $('#kjg').click(function () {
            control_obj = 'KJG';
            setControlLight('OAB', 'normal');//设置播放器正常
            setControlLight('KJG', 'active');//设置播放器高亮
            setControlLight('IR', 'normal');//设置播放器正常
            //console.log(control_obj)
        })
        $('#hw').click(function () {
            control_obj = 'IR';
            setControlLight('OAB', 'normal');//设置播放器正常
            setControlLight('KJG', 'normal');//设置播放器正常
            setControlLight('IR', 'active');//设置播放器高亮
            //console.log(control_obj)
        })
    }

    //$('body').click(function () {
    //    console.log($(this).parent())
    //    //$('#allimg')



    //})

})
//js判断是否为小数
function check(c) {
    var r = /^[+-]?[1-9]?[0-9]*\.[0-9]*$/;
    return r.test(c);
}