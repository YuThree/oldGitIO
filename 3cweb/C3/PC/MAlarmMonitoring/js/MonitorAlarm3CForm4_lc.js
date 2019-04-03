
var isFault = false; //是否缺陷
var IRfaultFrame = 0; //红外缺陷帧序号
var HWImgInfo = ''; //红外图信息

var center_x = ''; //设置后的中心点横坐标（用于保存、计算需进行比例缩放）
var center_y = ''; //设置后的中心点纵坐标（用于保存、计算需进行比例缩放）

var ImgTouchPointEvent = ''; // 图片接触点事件
var ImgCenterPointEvent = ''; // 图片中心点事件
var white_JC = ''; // 接触点按钮背景事件
var yellow_JC = ''; // 接触点按钮背景事件
var white_ZX = ''; // 中心点按钮背景事件
var yellow_ZX = ''; // 中心点按钮背景事件

var width_poor = ''; //压缩图片与原始图片宽的比例
var height_poor = ''; //压缩图片与原始图片高的比例

var curNumber = $('#curFrame').text(); //当前帧
var isRefresh = false; //刷新
var isExit = true; // 退出
var toolName = ''; //工具名称
var ts_img_size = ''; //原始透视图的大小
var continuous_temperature = 'continuou';//测温类型
var rectangleIndex = 0;//矩形层级
var AlarmJson_3Cform4;
var IMG_Width_height;//图片真实宽高
var getWidthHeight = false;//获取图片真实宽高成功

$(document).ready(function () {

    //获取红外图信息
  //  getHWImgInfo();
    setTimeout(getHWImgInfo, 1000);

    // 设置弹出框可移动
    $('#LC').draggable({ containment: 'document' });

    // 中心点可移动设置
    $('#circle-zx-big').hover(function () {
        $(this).css('cursor', 'url(/C3/PC/MAlarmMonitoring/ImgTmp/cursor_green.png),auto'); //设置鼠标的样式
    });
    $('#circle-zx-big').draggable({
        stop: function (e, t) {
            center_x = e.pageX; //当前尺寸下的中心点横坐标
            center_y = e.pageY; //当前尺寸下的中心点纵坐标
            if ('block' === $('#row_LC').css('display')) {
                $('#row_LC').css('display', 'none');
            }
            if ('block' === $('#row_LC_orig').css('display')) {
                $('#row_LC_orig').css('display', 'none');
            }
            //清空画布
            canvasClear('#myCanvas');
            //知原图坐标、压缩图与原图的比例，可算出压缩后的中心点坐标  通过原图坐标和比例计算出现在的坐标点，将圆点标出
            $('#curCoordinates').html(e.pageX + ',' + e.pageY);// 当前点击的地方（坐标）
            $('.curMidpoint').attr('pixel-x', (center_x / width_poor).toFixed(2));
            $('.curMidpoint').attr('pixel-y', (center_y / height_poor).toFixed(2));
            //弹出框显示
            $('#LC').stop(true, true).css({
                'display': 'inline-block',
                'left': (e.pageX - 100) + 'px',
                'top': (e.pageY + 30) + 'px'
            });
        }
    });

    // 设置中心点坐标
    $('#btn_Set_zx').click(function () {
        // 将播放状态置为暂停
        Ispaly = 0;
        Suspended();
        $("#note-IR").show();
        $("#note-VI").show();
        if ($("#allimg").is(":visible")) {
            $("#note-OAB").show();
        };
        $(".iconstar").attr("src", "/C3/PC/MAlarmMonitoring/ImgTmp/play.png");

        // 设置当前为计算模式
        isExit = false;

        // 标识当前为设置中心点坐标
        toolName = 'ZX';

        // 开启可拖动
        $('#circle-zx-big').draggable('enable');

        //设置弹出框标题
        $('#LC h3').html('中心点设置');

        //设置鼠标的样式
        $('#myCanvas').css('cursor', 'default'); 
         
        //计算比例
        if ('' === width_poor) {
            width_poor = $('#hw').width() / ts_img_size.split(',')[0]; //透视图压缩图片与透视图原始图片宽的比例
        }
        if ('' === height_poor) {
            height_poor = $('#hw').height() / ts_img_size.split(',')[1]; //透视图压缩图片与透视图原始图片高的比例
        }

        // 初始化图片信息
        initImgInfo(Number($('#curFrame').html()) - 1);

        // 切换成红外透视图
        if ($('#hw').attr('src').indexOf('_P.JPG') <= 0) { //判断当前图片不是透视图

            var hw_ts = GetTSimg($('#hw').attr('src'));

            $('#hw').attr('src', hw_ts);
        }

        // 改变接触点按钮背景图片
        $("#note-IR .note-IR-jc").attr("src", "ImgTmp/jc_point.png");
        $("#note-IR .note-IR-jc").bind({
            mouseenter: yellow_JC,
            mouseleave: white_JC
        });

        // 改变中心点按钮背景图片
        $("#note-IR .note-IR-zx").attr("src", "ImgTmp/zx_point_hover.png");
        $("#note-IR .note-IR-zx").unbind({
            mouseleave: white_ZX
        });

        $('#LC').css({ 'display': 'none' });
        $('#cursor').css({ 'display': 'none' });
        $('#circle-zx').css({ 'display': 'none' });
        $('#circle-zx-big').css({ 'display': 'none' });

        $('#myCanvas').css('display', 'inline-block'); //显示画布
        canvasClear('#myCanvas'); //清空画布
        
        // 改变事件
        //$('#myCanvas').bind({
        //    click: ImgCenterPointEvent
        //});
        $('#myCanvas').unbind({
            click: ImgTouchPointEvent
        });

        //将原始图上的中心点横、纵坐标通过比例缩放，计算出在当前图片上的横、纵坐标，并显示出中心点
        var curX = (width_poor * Number('' !== $('.curMidpoint').attr('pixel-x') ? $('.curMidpoint').attr('pixel-x') : $('.midpoint').attr('pixel-x'))).toFixed(2);
        var curY = (height_poor * Number('' !== $('.curMidpoint').attr('pixel-y') ? $('.curMidpoint').attr('pixel-y') : $('.midpoint').attr('pixel-y'))).toFixed(2);
        var re = /^[0-9]+.?[0-9]*$/; //数字正则
        if (re.test(curX) && re.test(curY)) {
            $('#curCoordinates').html(curX + ',' + curY);
            //$('#circle-zx').stop(true, true).css({
            //    'display': 'inline-block',
            //    //'left': (curX -3.5) + 'px',
            //    //'top': (curY -3.5) + 'px'
            //    'left': (curX) + 'px',
            //    'top': (curY) + 'px'
            //});
            $('#circle-zx-big').stop(true, true).css({
                'display': 'inline-block',
                'left': (curX - 7).toFixed(2) + 'px',
                'top': (curY - 7).toFixed(2) + 'px'
            });
        } 
    });

    // 设置接触点坐标
    $('#btn_Set_jc').click(function () {
        // 将播放状态置为暂停
        Ispaly = 0;
        Suspended();
        $("#note-IR").show();
        $("#note-VI").show();
        if ($("#allimg").is(":visible")) {
            $("#note-OAB").show();
        };
        $(".iconstar").attr("src", "/C3/PC/MAlarmMonitoring/ImgTmp/play.png");

        // 设置当前为计算模式
        isExit = false;

        // 标识当前为设置接触点坐标
        toolName = 'JC';

        // 禁止其拖动功能
        $('#circle-zx-big').draggable('disable');

        //设置弹出框标题
        $('#LC h3').html('接触点设置');

        //设置鼠标的样式
        $('#myCanvas').css('cursor', 'default');
        //$('#myCanvas').css('cursor', 'url(/C3/PC/MAlarmMonitoring/ImgTmp/cursor_green.png),auto'); 

        //计算比例
        if ('' === width_poor) {
            width_poor = $('#hw').width() / ts_img_size.split(',')[0]; //透视图压缩图片与透视图原始图片宽的比例
        }
        if ('' === height_poor) {
            height_poor = $('#hw').height() / ts_img_size.split(',')[1]; //透视图压缩图片与透视图原始图片高的比例
        }

        // 初始化图片信息
        initImgInfo(Number($('#curFrame').html()) - 1);

        // 切换成红外透视图
        if ($('#hw').attr('src').indexOf('_P.JPG') <= 0) { //判断当前图片不是透视图
            var hw_ts =GetTSimg ( $('#hw').attr('src'));
            $('#hw').attr('src', hw_ts);
        }

        // 改变接触点按钮背景图片
        $("#note-IR .note-IR-jc").attr("src", "ImgTmp/jc_point_hover.png");
        $("#note-IR .note-IR-jc").unbind({
            mouseleave: white_JC
        });

        // 改变中心点按钮背景图片
        $("#note-IR .note-IR-zx").attr("src", "ImgTmp/zx_point.png");
        $("#note-IR .note-IR-zx").bind({
            mouseenter: yellow_ZX,
            mouseleave: white_ZX
        });

        $('#LC').css({ 'display': 'none' });
        $('#cursor').css({ 'display': 'none' });
        $('#circle-zx').css({ 'display': 'none' });
        //$('#circle-zx-big').css({ 'display': 'none' });

        $('#myCanvas').css('display', 'inline-block'); //显示画布
        canvasClear('#myCanvas'); //清空画布

        // 改变事件
        $('#myCanvas').unbind({
            click: ImgCenterPointEvent
        });
        $('#myCanvas').bind({
            click: ImgTouchPointEvent
        });

        //将原始图上的中心点横、纵坐标通过比例缩放，计算出在当前图片上的横、纵坐标，并显示出中心点
        var curX = (width_poor * Number('' !== $('.curMidpoint').attr('pixel-x') ? $('.curMidpoint').attr('pixel-x') : $('.midpoint').attr('pixel-x')));
        var curY = (height_poor * Number('' !== $('.curMidpoint').attr('pixel-y') ? $('.curMidpoint').attr('pixel-y') : $('.midpoint').attr('pixel-y')));
        var re = /^[0-9]+.?[0-9]*$/; //数字正则
        if (re.test(curX) && re.test(curY)) {
            $('#circle-zx-big').stop(true, true).css({
                'display': 'inline-block',
                //'left': (curX -3.5) + 'px',
                //'top': (curY -3.5) + 'px'
                'left': (curX - 7).toFixed(2) + 'px',
                'top': (curY - 7).toFixed(2) + 'px'
            });
        }
    });

    //保存坐标或拉出值
    $('.j-set-lc').click(function () {
        var title = $('#LC h3').html();
        curNumber = $('#curFrame').text() - 1;

        defectsFrame(); //计算出缺陷帧号
        if (Number($('#curFrame').html()) === IRfaultFrame) { //判断是否为缺陷帧
            isFault = true;
        } else {
            isFault = false;
        }

        if ('中心点设置' === title) {
            $('.curMidpoint').attr('pixel-x', (center_x / width_poor).toFixed(2)); //若没有原始的中心点坐标，则无法计算图之间的比例，则后续的操作则无法完成。
            $('.curMidpoint').attr('pixel-y', (center_y / height_poor).toFixed(2));
            var url = '/Common/MAlarmMonitoring/RemoteHandlers/AlarmEdit.ashx?'
                    + 'active=CalculateStagger'
                    + '&alarmid=' + GetQueryString('alarmid')
                    + '&FRAME_NO=' + (Number($('#curFrame').html()) - 1)
                    + '&PULLING_VALUE=' + $('.origLC').attr('value')
                    + '&isfault=' + isFault
                    + '&centerx=' + $('.curMidpoint').attr('pixel-x')
                    + '&centery=' + $('.curMidpoint').attr('pixel-y');
            saveLC(url, '中心点设置');
        }
        if ('接触点设置' === title) {
            var url = '/Common/MAlarmMonitoring/RemoteHandlers/AlarmEdit.ashx?'
                    + 'active=CalculateStagger'
                    + '&alarmid=' + GetQueryString('alarmid')
                    + '&FRAME_NO=' + (Number($('#curFrame').html()) - 1)
                    + '&PULLING_VALUE=' + $('#curLC').attr('value')
                    + '&isfault=' + isFault
                    + '&centerx=' + $('.midpoint').attr('pixel-x')
                    + '&centery=' + $('.midpoint').attr('pixel-y');
            saveLC(url, '接触点设置');
        }
    });

    //关闭弹出框
    $(document).on('click', '#LC .j-close', function () {
        if ('接触点设置' === $('#LC h3').html()) {
            clearSet();
        }
        if ('中心点设置' === $('#LC h3').html()) {
            //$('#circle-zx-big').stop(true, true).css({
            //    'display': 'none',
            //    'left': Number($('.midpoint').attr('pixel-x')) + 'px',
            //    'top': Number($('.midpoint').attr('pixel-y')) + 'px'
            //});
        }
        closeLayerBox();
    });

    //退出计算模式
    $(document).on('click', '#LC .j-exit', function () {
        toolName = '';
        isExit = true;
        clearSet(); //清除中心点图标、接触点图标，清空画布

        // 切换成红外图
        var hw = $('#hw').attr('src').replace('_P.','.')  ;   // GetTSimg($('#hw').attr('src'));
        $('#hw').attr({ 'src': hw, 'display': 'inline-block' });
    });

    $('#btn_Set_cw').click(function () {
        // 将播放状态置为暂停
        Ispaly = 0;
        Suspended();
        $("#note-IR").show();
        $("#note-VI").show();
        if ($("#allimg").is(":visible")) {
            $("#note-OAB").show();
        };
        $(".iconstar").attr("src", "/C3/PC/MAlarmMonitoring/ImgTmp/play.png");
        $('#btn_Set_cw').children("img").attr("src", "ImgTmp/temperature_over.png");
        //红外温度测量弹出窗口
        if ($('.CW_warpper').is(':hidden')) {
            $('#cavars,#tempCavars,.CW_warpper').css('display', 'inline-block'); //显示画布/元素
            $('#note-IR').css({ 'background': 'url(/C3/PC/MAlarmMonitoring/ImgTmp/bg_w_356_light.png) no-repeat', 'width': '356px' });
            $("#btn_Set_hw").hide();
            if (FunEnable('Fun_setLC') === 'True') {
                $('#btn_Set_jc,#btn_Set_zx').hide();
            }
            
            var changeFirstImg = true;//是否改变默认选中图片
            $("#note-IR .CW_warpper img").each(function () {//第二次打开 不设置默认选中
                if ($(this).attr('src').split('_light').length > 1) {
                    changeFirstImg = false;
                }
            })
            if (changeFirstImg) {
                $("#note-IR .note_cw_continue").attr("src", "ImgTmp/continue_light.png");
                $("#note-IR .note_cw_continue").unbind({
                    mouseleave: yellow_CW_continue
                });
            }
            $('#cavars,#tempCavars').attr('width', $(window).width() / 2).attr('height', $(window).height() / 2);
            canvas_Clear('#cavars'); //清空画布
            $('#cavars').bind({
                click: ImgTouchPointEvent_CW
            });
            drawPen();
            $('canvas').css('cursor', 'crosshair')
            $("#note-IR .note-IR-cw").unbind({
                mouseleave: yellow_CW
            });
        } else {
            if (HWImgInfo == "") {
                $('#note-IR').css({ 'background': 'url(/C3/PC/MAlarmMonitoring/ImgTmp/bg_w_188_light.png) no-repeat', 'width': '188px' });//控制条背景
                $("#btn_Set_hw").css('display', 'inline-block');
            } else {
                if (FunEnable('Fun_setLC') === 'True' && FunEnable('Fun_hw') === 'True') {
                    $('#note-IR').css({ 'background': 'url(/C3/PC/MAlarmMonitoring/ImgTmp/bg_w_294_light.png) no-repeat', 'width': '294px' });//控制条背景
                    $("#btn_Set_hw,#btn_Set_jc,#btn_Set_zx").css('display', 'inline-block');
                } else if (FunEnable('Fun_setLC') === 'True') {//只有拉出true
                    $('#note-IR').css({ 'background': 'url(/C3/PC/MAlarmMonitoring/ImgTmp/bg_w_252_light.png) no-repeat', 'width': '252px' });//控制条背景
                    $('#btn_Set_jc,#btn_Set_zx').css('display', 'inline-block');;
                } else if (FunEnable('Fun_hw') === 'True') {//只有红外
                    $('#note-IR').css({ 'background': 'url(/C3/PC/MAlarmMonitoring/ImgTmp/bg_w_188_light.png) no-repeat', 'width': '188px' });//控制条背景
                    $('#btn_Set_hw').css('display', 'inline-block');;
                }
                
            }
            $('#note-VI').css('background', 'url("/C3/PC/MAlarmMonitoring/ImgTmp/bg_w_188.png") no-repeat');//控制条背景颜色
            $('#note-OAB').css('background', 'url("/C3/PC/MAlarmMonitoring/ImgTmp/bg_w_188.png") no-repeat');//控制条背景颜色
            canvas_Clear('#cavars,#tempCavars')
            $('#cavars').unbind({
                click: ImgTouchPointEvent_CW
            })
            $('canvas').css('cursor', 'default');
            $("#note-IR .note-IR-cw").bind({
                mouseleave: yellow_CW
            });
            $('#cavars,#tempCavars,.CW_warpper').css('display', 'none'); //隐藏画布/元素
        }
    });
    $("#btn_cw_single").click(function () {
        continuous_temperature = "single_point";
        $("#note-IR .note_cw_single").unbind({
            mouseleave: yellow_CW_single
        });
        $("#note-IR .note_cw_continue").attr("src", "ImgTmp/continue.png");
        $("#note-IR .note_cw_continue").bind({
            mouseleave: yellow_CW_continue
        });
        $("#note-IR .note_cw_area").attr("src", "ImgTmp/area.png");
        $("#note-IR .note_cw_area").bind({
            mouseleave: yellow_CW_area
        });
        canvas_Clear('#cavars,#tempCavars');
    });
    $("#btn_cw_continue").click(function () {
        continuous_temperature = "continuou";
        $("#note-IR .note_cw_continue").unbind({
            mouseleave: yellow_CW_continue
        });
        $("#note-IR .note_cw_single").attr("src", "ImgTmp/single.png");
        $("#note-IR .note_cw_single").bind({
            mouseleave: yellow_CW_single
        });
        $("#note-IR .note_cw_area").attr("src", "ImgTmp/area.png");
        $("#note-IR .note_cw_area").bind({
            mouseleave: yellow_CW_area
        });
        canvas_Clear('#cavars,#tempCavars');
    });
    $("#btn_cw_area").click(function () {
        continuous_temperature = "rectangle";
        $("#note-IR .note_cw_area").unbind({
            mouseleave: yellow_CW_area
        });
        $("#note-IR .note_cw_continue").attr("src", "ImgTmp/continue.png");
        $("#note-IR .note_cw_continue").bind({
            mouseleave: yellow_CW_continue
        });
        $("#note-IR .note_cw_single").attr("src", "ImgTmp/single.png");
        
        $("#note-IR .note_cw_single").bind({
            mouseleave: yellow_CW_single
        });
        canvas_Clear('#cavars,#tempCavars');
    });
    $('#btn_cw_clean').click(function (e) {
        e.stopPropagation();
        canvas_Clear('#cavars,#tempCavars');
    })

});

/*/*
 * @desc 获取红外透视图原始的大小
 * @param 
 */
function getHWTSSize() {
    var IRImgUrl_P = '';
    if (undefined !== $('#hw').attr('src') && $('#hw').attr('src').indexOf('_P.JPG') <= 0) { //判断当前图片不是透视图
        // 获取当前图片路径
        IRImgUrl_P = GetTSimg($('#hw').attr('src'));
    }

    // 获取当前红外透视图的原始大小
    var IRImg = new Image();
    IRImg.onload = function () {
        var width = IRImg.width;
        var height = IRImg.height;
        ts_img_size = IRImg.width + ',' + IRImg.height;
    }
    IRImg.src = IRImgUrl_P;
}

/*/*
 * @desc 保存拉出值
 * @param 
 */
function saveLC(url, titleType) {
    $.ajax({
        type: 'POST',
        url: url,
        cache: false,
        async: true,
        success: function (json) {
            if ('True' === json) {
                layer.msg('保存成功');
                if ('接触点设置' === titleType) {
                    isRefresh = true;
                    //刷新页面
                    loadC3Form();
                }
                if ('中心点设置' === titleType) {
                    // 获取红外信息
                    getHWImgInfo();
                }
            }
            if ('False' === json) {
                layer.msg('保存失败');
            }
        },
        error: function () {
            layer.msg('保存失败!');
        }
    });
}

/*/*
 * @desc 获取红外图信息
 * @param 
 */
function getHWImgInfo() {
    var url = '/C3/PC/MAlarmMonitoring/RemoteHandlers/GetMonitorAlarmC3Form.ashx?'
            + 'type=getStaggerByPerson'
            + '&alarmid=' + GetQueryString('alarmid');
    $.ajax({
        type: 'POST',
        url: url,
        cache: false,
        async: true,
        success: function (json) {
            if (undefined !== json && '' !== json) {
                if (undefined !== json.data && json.data.length > 0) {
                    HWImgInfo = json.data;
                } else {
                    $($(document).find('#btn_Set_jc')).css({ 'display': 'none' }); //隐藏设置接触点坐标
                    $($(document).find('#btn_Set_zx')).css({ 'display': 'none' }); //隐藏设置中心点坐标
                    $('#note-IR').css({ 'background': 'url(/C3/PC/MAlarmMonitoring/ImgTmp/bg_w_188.png) no-repeat', 'width': '188px' });
                    $('#note-IR a').css('margin-left', '0');
                }
            } else {
                $($(document).find('#btn_Set_jc')).css({ 'display': 'none' }); //隐藏设置接触点坐标
                $($(document).find('#btn_Set_zx')).css({ 'display': 'none' }); //隐藏设置中心点坐标
                $('#note-IR').css({ 'background': 'url(/C3/PC/MAlarmMonitoring/ImgTmp/bg_w_188.png) no-repeat', 'width': '188px' });
                $('#note-IR a').css('margin-left','0');
            }
        }
    });
}

/*/*
 * @desc 初始化图片信息
 * @param 
 */
function initImgInfo(_index) {
    //新增：重置元素的属性
    $('#hw').attr('width', $(window).width() / 2).attr('height', $(window).height() / 2);
    $('#myCanvas').attr('width', $(window).width() / 2).attr('height', $(window).height() / 2);

    //画图
    drawIMG('#myCanvas');

    //新增：将原始图片的中心点坐标、拉出值隐藏在页面中
    $('.midpoint').attr('pixel-x', HWImgInfo[_index].BOWCENTERX);
    $('.midpoint').attr('pixel-y', HWImgInfo[_index].BOWCENTERY);
    $('.curMidpoint').attr('pixel-x', HWImgInfo[_index].BOWCENTERX);
    $('.curMidpoint').attr('pixel-y', HWImgInfo[_index].BOWCENTERY);
    $('.origLC').attr('value', HWImgInfo[_index].STAGGER_CUR);
    $('#orig_LC').html(HWImgInfo[_index].STAGGER_CUR);
    $('.proportionLC').attr('value',HWImgInfo[_index].MATSCALE);

    //将原始图上的中心点横、纵坐标通过比例缩放，计算出在当前图片上的横、纵坐标，并显示出中心点
    var curX = (width_poor * Number('' !== $('.curMidpoint').attr('pixel-x') ? $('.curMidpoint').attr('pixel-x') : $('.midpoint').attr('pixel-x'))).toFixed(2);
    var curY = (height_poor * Number('' !== $('.curMidpoint').attr('pixel-y') ? $('.curMidpoint').attr('pixel-y') : $('.midpoint').attr('pixel-y'))).toFixed(2);

    if (isExit){
        $('#circle-zx,#circle-zx-big').stop(true, true).css({ //隐藏中心点图标
            'display': 'none',
            //'left': (curX -3.5) + 'px',
            //'top': (curY -3.5) + 'px'
            'left': (curX - 7) + 'px',
            'top': (curY - 7) + 'px'
        });
    } else {
        // 切换成红外透视图
        var hw_ts = GetTSimg ( $('#hw-Backup').attr('src') );
        $('#hw').css({ 'display': 'inline-block' });
        $('#hw').attr({ 'src': hw_ts });

        $('#circle-zx').stop(true, true).css({ //隐藏中心点图标
            'display': 'none',
            //'left': (curX -3.5) + 'px',
            //'top': (curY -3.5) + 'px'
            'left': (curX - 7).toFixed(2) + 'px',
            'top': (curY - 7).toFixed(2) + 'px'
        });
        $('#circle-zx-big').stop(true, true).css({ //显示中心点图标
            'display': 'inline-block',
            //'left': (curX -3.5) + 'px',
            //'top': (curY -3.5) + 'px'
            'left': (curX - 7).toFixed(2) + 'px',
            'top': (curY - 7).toFixed(2) + 'px'
        });
    }

    //新增：重置canvas的属性
    $('#myCanvas').attr('width', $('#myCanvas').attr('width')).attr('height', $('#myCanvas').attr('height'));
}

function GetTSimg( oldurl)
{
    return oldurl.toUpperCase().split('?')[0].replace('.JPG', '_P.JPG') + '?v=' + version;
}

/*/*
 * @desc 初始化图片事件
 * @param 
 */
function initImgEvent() {
    // 图片中心点事件
    ImgCenterPointEvent = function (e) {
        center_x = e.pageX; //当前尺寸下的中心点横坐标
        center_y = e.pageY; //当前尺寸下的中心点纵坐标
        // 中心点显示
        $('#circle-zx-big').stop(true, true).css({
            'display': 'inline-block',
            //'left': (e.pageX -3.5) + 'px',
            //'top': (e.pageY -3.5) + 'px'
            'left': (e.pageX - 7) + 'px',
            'top': (e.pageY - 7) + 'px'
        });
        //if ('none' === $('#curLC_null').css('display')) {
        //    $('#curLC_null').css('display', 'inline-block');
        //}
        //if ('inline-block' === $('#curLC').css('display')) {
        //    $('#curLC').css('display', 'none');
        //}
        //清空画布
        canvasClear('#myCanvas');
        //知原图坐标、压缩图与原图的比例，可算出压缩后的中心点坐标  通过原图坐标和比例计算出现在的坐标点，将圆点标出
        $('#curCoordinates').html(e.pageX + ',' + e.pageY);// 当前点击的地方（坐标）
        //弹出框显示
        $('#LC').stop(true, true).css({
            'display': 'inline-block',
            'left': (e.pageX - 100) + 'px',
            'top': (e.pageY + 30) + 'px'
        });
    }

    // 图片接触点事件
    ImgTouchPointEvent = function (e) {
        // 接触点显示
        $('#cursor').stop(true, true).css({
            'display': 'inline-block',
            //'left': (e.pageX -3.5) + 'px',
            //'top': (e.pageY -3.5) + 'px'
            'left': (e.pageX) + 'px',
            'top': (e.pageY) + 'px'
        });
        if ('none' === $('#row_LC').css('display')) {
            $('#row_LC').css('display', 'block');
        }
        if ('none' === $('#row_LC_orig').css('display')) {
            $('#row_LC_orig').css('display', 'block');
        }
        //清空画布
        canvasClear('#myCanvas');
        //画线
        var start_arr = [];
        start_arr[0] = (width_poor * Number('' !== $('.curMidpoint').attr('pixel-x') ? $('.curMidpoint').attr('pixel-x') : $('.midpoint').attr('pixel-x'))).toFixed(2); //压缩图上的值
        start_arr[1] = (height_poor * Number('' !== $('.curMidpoint').attr('pixel-y') ? $('.curMidpoint').attr('pixel-y') : $('.midpoint').attr('pixel-y'))).toFixed(2); //压缩图上的值
        var end_arr = [];
        end_arr[0] = e.pageX; //压缩图上的值
        end_arr[1] = e.pageY; //压缩图上的值
        drawLine('#myCanvas', start_arr, end_arr);

        $('#curCoordinates').html(e.pageX + ',' + e.pageY);// 当前点击的地方（坐标）
        //（接触点-中心点）（用原始图上的值进行计算）
        var tp_x = e.pageX/width_poor; //原始图上的接触点横坐标
        var zx_x = Number('' !== $('.curMidpoint').attr('pixel-x') ? $('.curMidpoint').attr('pixel-x') : $('.midpoint').attr('pixel-x')); //原始图上的中心点横坐标
        $('#curLC').attr('value', Math.round(((tp_x - zx_x) / Number($('.proportionLC').attr('value'))).toFixed(2))); //当前拉出值
        //弹出框显示
        $('#LC').stop(true, true).css({
            'display': 'inline-block',
            'left': (e.pageX - 100) + 'px',
            'top': (e.pageY + 30) + 'px'
        });
    }
    //图片事件变化
    ImgEventChange();
}

/*/*
 * @desc 画线
 * @param 
 */
function drawLine(canvasId, start_arr, end_arr) {
    //将线画在画布(canvas)上
    var id = canvasId.split('#')[1];
    var c = document.getElementById(id); //画布
    var ctx = c.getContext('2d'); //画笔
    //画线
    ctx.moveTo(start_arr[0], start_arr[1]);
    ctx.lineTo(end_arr[0], end_arr[1]);
    ctx.strokeStyle = '#ff0000';
    ctx.stroke();
}

/*/*
 * @desc 画图
 * @param 
 */
function drawIMG(canvasId) {
    //// 切换成红外透视图
    //if ($('#hw').attr('src').indexOf('_P.JPG') <= 0) { //判断当前图片不是透视图
    //    //新增：获取当前图片路径
    //    curIRImgUrl = $('#hw').attr('src');
    //    curIRImgUrl = curIRImgUrl.split('?')[0];
    //    curIRImgUrl_P = $('#hw').attr('src').split('.')[0] + '_P.JPG' + '?v=' + version;
    //}

    ////新增：重置元素的属性
    //$('#hw').attr('width', $(window).width() / 2).attr('height', $(window).height() / 2);
    //$('#myCanvas').attr('width', $(window).width() / 2).attr('height', $(window).height() / 2);

    ////新增：获取当前红外透视图的原始大小
    //curIRImg = new Image();
    //curIRImg.onload = function () {
    //    var width = curIRImg.width;
    //    var height = curIRImg.height;
    //}
    ////curIRImg.src = curIRImgUrl;
    //curIRImg.src = curIRImgUrl_P;

    //将图画在画布(canvas)上
    var id = canvasId.split('#')[1];
    var c = document.getElementById(id); //画布
    var ctx = c.getContext('2d'); //画笔
    var img = document.getElementById('hw'); //红外图
    //var img = document.getElementById('hw_ts'); //红外透视图
    //画图
    img.onload = function () {
        //ctx.drawImage(img, 0, 0);
    }
}

/*/*
 * @desc 清空画布
 * @param 
 */
function canvasClear(canvasId) {
    var id = canvasId.split('#')[1];
    var c = document.getElementById(id); //画布
    var ctx = c.getContext('2d'); //画笔
    ctx.clearRect(0, 0, $(canvasId).attr('width'), $(canvasId).attr('height'));
    $(canvasId).attr('width', $(canvasId).attr('width'));
}

/*/*
 * @desc 图片事件变化
 * @param 
 */
function ImgEventChange() {
    $('#myCanvas').unbind({
        click: ImgCenterPointEvent
    });
    $('#myCanvas').unbind({
        click: ImgTouchPointEvent
    });
}

/*/*
 * @desc 关闭弹出框
 * @param 
 */
function closeLayerBox() {
    $('#LC').css('display', 'none'); //隐藏弹出框
    $('#hw').css('cursor', 'default'); //设置鼠标图案
}

/*/*
 * @desc 清除中心点图标、接触点图标，清空画布
 * @param 
 */
function clearSet() {
    $('#cursor').stop(true, true).css({ //隐藏接触点图标
        'display': 'none',
        'left': 0 + 'px',
        'top': 0 + 'px'
    });
    canvasClear('#myCanvas'); //清空画布
    if (isExit) {
        $('#myCanvas').css('display', 'none'); //隐藏画布
        $('#circle-zx').stop(true, true).css({ //隐藏中心点图标
            'display': 'none'
        });
        $('#circle-zx-big').stop(true, true).css({ //隐藏中心点图标
            'display': 'none'
        });
        closeLayerBox();

        // 改变接触点按钮背景图片
        $("#note-IR .note-IR-jc").attr("src", "ImgTmp/jc_point.png");
        $("#note-IR .note-IR-jc").bind({
            mouseenter: yellow_JC,
            mouseleave: white_JC
        });
        // 改变中心点按钮背景图片
        $("#note-IR .note-IR-zx").attr("src", "ImgTmp/zx_point.png");
        $("#note-IR .note-IR-zx").bind({
            mouseenter: yellow_ZX,
            mouseleave: white_ZX
        });

    } else {
        if('JC' === toolName){
            // 改变接触点按钮背景图片
            $("#note-IR .note-IR-jc").attr("src", "ImgTmp/jc_point_hover.png");
            $("#note-IR .note-IR-jc").unbind({
                mouseleave: white_JC
            });
        }
        if ('ZX' === toolName) {
            // 改变中心点按钮背景图片
            $("#note-IR .note-IR-zx").attr("src", "ImgTmp/zx_point_hover.png");
            $("#note-IR .note-IR-zx").unbind({
                mouseleave: white_ZX
            });
        }

        $('#LC').css({'display': 'none'}); //隐藏弹出框
        $('#myCanvas').css('display', 'inline-block'); //显示画布
    }
}

/*/*
 * @desc 计算出缺陷帧
 * @param 
 */
function defectsFrame() {
    for (var i = 0; i < JsonAlarm.PLAY_IDX.length; i++) {
        if (JsonAlarm.PLAY_IDX[i].FLAG === 1) {
            //找到对应的序号。
            IRfaultFrame = JsonAlarm.PLAY_IDX[i].IR + 1;  //红外缺陷帧
            break;
        }
    }
}


ImgTouchPointEvent_CW = function (e) {
    if (continuous_temperature == 'single_point') {
        canvas_Clear('#cavars,#tempCavars')
    } else if (continuous_temperature == 'rectangle') {
        return;
    }
    //$('#cavars').removeLayer(rectangleName)
    var start_arr = [];
    var end_arr = [];
    end_arr[0] = e.pageX; //压缩图上的值
    end_arr[1] = e.pageY//压缩图上的值
    getTemp(end_arr);
};

//获取图片真实尺寸
function getImg_reallyWH(src){
    var image = new Image()
    image.src = src;
    image.onload = function () {
        IMG_Width_height = [image.width, image.height];
        getWidthHeight = true;
    }
    image.onerror=function(){
        layer.msg('图片请求出错！')
    }
}
//温度请求
function getTemp(end_arr) {
    if (AlarmJson_3Cform4 != undefined && AlarmJson_3Cform4 != 'none') {
        var IRVIDX = $(".IRxuhao-play").text() - 1;
        getImg_reallyWH(AlarmJson_3Cform4.IR_PICS[IRVIDX]);//获取图片真实尺寸
        if (getWidthHeight) {
            getWidthHeight = false;
            console.log(IMG_Width_height)
            var x1 = parseInt(end_arr[0] / $('#cavars').width() * IMG_Width_height[0]);
            var y1 = parseInt(end_arr[1] / $('#cavars').height() * IMG_Width_height[1]);
            var x2 = 0;
            var y2 = 0;
            if (end_arr.length > 2) {
                x2 = parseInt(end_arr[2] / $('#cavars').width() * IMG_Width_height[0]);
                y2 = parseInt(end_arr[3] / $('#cavars').height() * IMG_Width_height[1]);
            }
            //console.log(x1, y1, x2, y2)
            var _url = '/C3/PC/MAlarmMonitoring/RemoteHandlers/GetMonitorAlarmC3Form.ashx?&type=getTemper'
                 + '&backupfile=' + AlarmJson_3Cform4.BackUpFile
                 + '&scsname=' + escape(AlarmJson_3Cform4.scs)
                 + '&locomotive=' + AlarmJson_3Cform4.LOCNO
                 + '&IRVIDX=' + IRVIDX
                 + '&IsCrack=' + AlarmJson_3Cform4.IsCrack
                 + '&x1=' + x1 + '&y1=' + y1 + '&x2=' + x2 + '&y2=' + y2;

            $.ajax({
                type: 'post',
                url: _url,
                async: true,
                cache: false,
                success: function (re) {
                    if (re.irvTemp != undefined) {
                        if (end_arr.length == 2) {
                            drawLine_CW('tempCavars', end_arr, re.irvTemp)
                        } else {
                            if (re.x === '' || re.y === '' || re.irvTemp === '') {
                                layer.msg('请求温度异常！')
                            } else {
                                drawMax('tempCavars', [re.x, re.y], re.irvTemp)//坐标来自后台
                            }
                        }
                    } else {
                        layer.msg('请求温度失败！')
                    }
                },
                error: function () {
                    layer.msg('请求出错！');
                }
            })
        } else {
            setTimeout(function(){
                getTemp(end_arr)
            },100)
        }
    } else {
        layer.msg('请求出错！');
    }
};

//区域获取温度
CanvasExt = {
    drawRect: function (canvasId, penColor, strokeWidth) {
        var that = this;
        that.penColor = penColor;
        that.penWidth = strokeWidth;

        var canvas = document.getElementById(canvasId);
        //canvas 的矩形框
        var canvasRect = canvas.getBoundingClientRect();
        //矩形框的左上角坐标
        var canvasLeft = canvasRect.left;
        var canvasTop = canvasRect.top;

        var layerIndex = rectangleIndex;
        var layerName = "layer";
        var x = 0;
        var y = 0;
        canvas.onmouseout = function (layer) {
            return;
        };
        //鼠标点击按下事件，画图准备
        canvas.onmousedown = function (e) {
            if (continuous_temperature != 'rectangle' || $('.CW_warpper').is(':hidden')) {
                return false;
            }
            canvas_Clear('#cavars,#tempCavars');
            //设置画笔颜色和宽度
            var color = that.penColor;
            var penWidth = that.penWidth;
            if (layerName != 'layer') {
                $("#" + canvasId).removeLayer(layerName).drawLayers();
            }

            layerIndex++;
            rectangleIndex++;

            layerName += layerIndex;
            rectangleName = layerName;
            x = e.clientX - canvasLeft;
            y = e.clientY - canvasTop;

            $("#" + canvasId).addLayer({
                type: 'rectangle',
                strokeStyle: color,
                strokeWidth: penWidth,
                name: layerName,
                fromCenter: false,
                x: x, y: y,
                width: 1,
                height: 1
            });

            $("#" + canvasId).drawLayers();
            $("#" + canvasId).saveCanvas();

            //鼠标移动事件，画图
            canvas.onmousemove = function (e) {
                width = e.clientX - canvasLeft - x;
                height = e.clientY - canvasTop - y;

                $("#" + canvasId).removeLayer(layerName);

                $("#" + canvasId).addLayer({
                    type: 'rectangle',
                    strokeStyle: color,
                    strokeWidth: penWidth,
                    name: layerName,
                    fromCenter: false,
                    x: x, y: y,
                    width: width,
                    height: height
                });

                $("#" + canvasId).drawLayers();
            }
        };

        canvas.onmouseup = function (e) {
            if (continuous_temperature != 'rectangle' || $('.CW_warpper').is(':hidden')) {
                return false;
            }
            var color = that.penColor;
            var penWidth = that.penWidth;

            canvas.onmousemove = null;

            width = e.clientX - canvasLeft - x;
            height = e.clientY - canvasTop - y;

            //$("#" + canvasId).removeLayer(layerName);

            $("#" + canvasId).addLayer({
                type: 'rectangle',
                strokeStyle: color,
                strokeWidth: penWidth,
                name: layerName,
                fromCenter: false,
                x: x, y: y,
                width: width,
                height: height
            });

            $("#" + canvasId).drawLayers();
            $("#" + canvasId).saveCanvas();
            rectangleArry = [x, y, (x + width), (y + height)]

            // 获取矩形左上和右下点坐标
            if (rectangleArry[0] > rectangleArry[2]) {
                var b = rectangleArry[0];
                rectangleArry[0] = rectangleArry[2];
                rectangleArry[2] = b;
            }
            if (rectangleArry[1] > rectangleArry[3]) {
                var b = rectangleArry[1];
                rectangleArry[1] = rectangleArry[3];
                rectangleArry[3] = b;
            }
            getTemp(rectangleArry)
            console.log(rectangleArry)
        }
    }
};

function drawPen() {
    var color = "#FBD82F";
    var width = 1;
    var a = CanvasExt.drawRect("cavars", color, width);
};

function canvas_Clear(canvasIds) {
    var canvasId = canvasIds.split(',');
    for (var i = 0; i < canvasId.length; i++) {
        var id = canvasId[i].split('#')[1];
        var c = document.getElementById(id); //画布
        var ctx = c.getContext('2d'); //画笔
        ctx.clearRect(0, 0, $(canvasId[i]).attr('width'), $(canvasId[i]).attr('height'));
        $(canvasId[i]).removeLayers();
        $(canvasId[i]).attr('width', $(canvasId).attr('width'));
    }
};

//画点温度
function drawLine_CW(canvasId, end_arr, temp) {
    var c = document.getElementById(canvasId); //画布
    var cxt = c.getContext('2d'); //画笔

    cxt.beginPath();

    cxt.arc(end_arr[0], end_arr[1], 2, 0, 360, false);
    cxt.fillStyle = "red";//填充颜色,默认是黑色
    cxt.fill();//画实心圆
    cxt.closePath();
    //设置字体样式
    cxt.beginPath();
    cxt.font = "30px Microsoft YaHei";
    //设置字体填充颜色
    cxt.fillStyle = "#80D816";
    if (end_arr[0] > (IMG_Width_height[0] - 90)) {
        if (end_arr[1] > 20) {
            cxt.fillText(temp + "℃", end_arr[0] - 90, end_arr[1] + 5);
        } else {
            cxt.fillText(temp + "℃", end_arr[0] - 90, end_arr[1] + 30);
        }
    } else {
        if (end_arr[1] > 20) {
            cxt.fillText(temp + "℃", end_arr[0] + 10, end_arr[1] + 5);
        } else {
            cxt.fillText(temp + "℃", end_arr[0] + 10, end_arr[1] + 30);
        }
    }
    cxt.closePath();
    cxt.beginPath();
    cxt.strokeStyle = '#80D816';//线条颜色：绿色
    cxt.strokeStyle = '#3279C0';//线条颜色：蓝色
    cxt.lineWidth = 1;//设置线宽
    cxt.moveTo(end_arr[0] + 10, end_arr[1]);
    cxt.lineTo(end_arr[0] - 10, end_arr[1]);
    cxt.moveTo(end_arr[0], end_arr[1] + 10);
    cxt.lineTo(end_arr[0], end_arr[1] - 10);
    cxt.stroke();//画线
    cxt.closePath();
};
//画矩形最大温度
function drawMax(canvasId, end_arr, temp) {
    end_arr[0] = end_arr[0] * $('#cavars').width() / IMG_Width_height[0]
    end_arr[1] = end_arr[1] * $('#cavars').height() / IMG_Width_height[1]

    //将线画在画布(canvas)上
    var c = document.getElementById(canvasId); //画布
    var cxt = c.getContext('2d'); //画笔
    //画线

    cxt.beginPath();

    cxt.arc(end_arr[0], end_arr[1], 2, 0, 360, false);
    cxt.fillStyle = "red";//填充颜色,默认是黑色
    cxt.fill();//画实心圆
    cxt.closePath();
    //设置字体样式
    cxt.beginPath();
    cxt.font = "30px Microsoft YaHei";
    //设置字体填充颜色
    cxt.fillStyle = "#80D816";
    //从坐标点(50,50)开始绘制文字
    if (end_arr[0] > (IMG_Width_height[0]-160)) {
        if (end_arr[1] > 20) {
            cxt.fillText('Max:' + temp + "℃", end_arr[0] - 160, end_arr[1] + 5);
        } else {
            cxt.fillText('Max:' + temp + "℃", end_arr[0] - 160, end_arr[1] + 30);
        }
    } else {
        if (end_arr[1] > 20) {
            cxt.fillText('Max:' + temp + "℃", end_arr[0] + 10, end_arr[1] + 5);
        } else {
            cxt.fillText('Max:' + temp + "℃", end_arr[0] + 10, end_arr[1] + 30);
        }
    }
    //cxt.fillText('Max:' + temp + "℃", end_arr[0] + 10, end_arr[1] + 5);

    cxt.closePath();
    cxt.beginPath();
    cxt.strokeStyle = '#80D816';//线条颜色：绿色
    cxt.strokeStyle = 'black';//线条颜色：黑色
    cxt.lineWidth = 1;//设置线宽
    cxt.moveTo(end_arr[0] + 10, end_arr[1]);
    cxt.lineTo(end_arr[0] - 10, end_arr[1]);
    cxt.moveTo(end_arr[0], end_arr[1] + 10);
    cxt.lineTo(end_arr[0], end_arr[1] - 10);
    cxt.stroke();//画线
    cxt.closePath();
};

/*/*
 * @desc 获取像素
 * @param 
 */
//function getPixel(imgId) {
//    var img = $(imgId);
//    img.click(function (e) {
//        var imgSrc = img.attr('src');
//        var size = getImageSize(imgSrc); //获取图片原始尺寸
//        var width_poor = img.width() / size.width; //压缩图片与原始图片宽的比例
//        var height_poor = img.height() / size.height; //压缩图片与原始图片高的比例

//        var imgOffset = img.offset();
//        var imgX = Math.floor(e.pageX - imgOffset.left); //压缩后像素
//        var imgY = Math.floor(e.pageY - imgOffset.top); //压缩后像素
//        var originalX = Math.round(imgX / width_poor); //原始像素
//        var originalY = Math.round(imgY / height_poor); //原始像素

//        layer.msg(originalX + ',' + originalY);

//        var pixel_x = $('.midpoint').attr('pixel-x');
//        var pixel_y = $('.midpoint').attr('pixel-y');
//        $('#curLC').attr('value', originalY - pixel_x); //当前拉出值

//        var cursorX = (e.pageX - 5) + 'px';
//        var cursorY = (e.pageY - 5) + 'px';
//        $('#cursor').stop(true, true).css({
//            'display': 'inline-block',
//            'left': cursorX,
//            'top': cursorY
//        }).fadeOut(2500);

//        var lcX = '';
//        var lcY = '';

//        if (e.pageY <= 151 && e.pageY > 0) {
//            if ($('#LC .j-dot').hasClass('dot-bottom')) {
//                $('#LC .j-dot').removeClass('dot-bottom').addClass('dot-top'); //箭头向上
//            }
//            lcX = (e.pageX - 110) + 'px';
//            lcY = (e.pageY + 10) + 'px';
//        } else {
//            if ($('#LC .j-dot').hasClass('dot-top')) {
//                $('#LC .j-dot').removeClass('dot-top').addClass('dot-bottom'); //箭头向下
//            }
//            lcX = (e.pageX - 110) + 'px';
//            lcY = (e.pageY - 158) + 'px';
//        }

//        $('#LC').stop(true, true).css({
//            'display': 'inline-block',
//            'left': lcX,
//            'top': lcY
//        });
//    });
//}