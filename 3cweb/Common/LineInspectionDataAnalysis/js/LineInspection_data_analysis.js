/*========================================================================================*
* 功能说明：线路巡检播放页
* 注意事项：
* 作    者： ybc
* 版本日期：2017年3月13日
* 变更说明：
* 版 本 号： V1.0.0

*=======================================================================================*/
var queryIP_IRV = getConfig('HardDiskIRVHelpURL')//请求链接地址red
var queryIP_OV = getConfig('HardDiskOVHelpURL')//请求链接地址ov
var queryIP_VI = getConfig('HardDiskVIHelpURL')//请求链接地址vi
var queryIP_AUX = getConfig('HardDiskAUXHelpURL')//请求链接地址Fz

var sessionID = 'sessionID';//sessionid
var time_speed = 1;//播放速度
var pageIndex = 1;//初始播放内容页
var pageIndexGetData = 0;//率先请求页码
var page = 1;//支柱列表分页
var PageCount = 1;  //支柱总页数
var pageSize_P = 24;  //支柱一页条数
var pageSize = 500;//初始播放条数
var sumPage = 0;//播放总页数
var Ispaly = true;//播放  默认开启
var t; //定时器
var number = 0;//请求第几次 第一次设置数组长度
var slider;//播放进度条
var sliderNumber = 0;//进度值
var nowSlideNumber = 0;//进度值   显示的这一帧
var jsonPlay;//json数据
var count = 0;//进度条最大值
var Sumcount = 0;//进度条最大值really
var sumArrayA = [];//总数组A
var sumArrayB = [];//总数组B
var sumArrayC = [];//总数组C
var sumArrayD = [];//总数组D
//var change = false;//是否进行拖动
var myChart1;
var myChart2;
var myChart3;
var option1;
var option2;
var option3;
var CompleteImgNum = 5;//图片预加载
var AB_SURFACE = 'A';//播放弓位置
var LINE_CODE = '';
var bigIMG = 'DLV';//大图播放种类
var bigGlass = false;//放大镜是否开启
var judgeAnswer = true;//输入验证
var f = $('#F').data('elevateZoom');//放大dom
var nodata = false;//重置结果集查询结果为空
var ehcartsClick = false;//echarts点击
var bridge_isThere = false;//是否有桥隧
var imgSize = 70;//图片质量
var start_time = '';
var end_time = '';
var start_timestamp = '';
var end_timestamp = '';
var line_code = '';
var line_name = '';
var pole_direction = '';
var position_code = '';
var position_name = '';
var position_name = '';
var locomotive_code = '';
var locomotive_name = '';
var bow_position_code = '';
var continuous_temperature = 'continuou';//测温类型
var RED = true;//红外加载完毕
var HD = true;//高清
var OVER = true;//全景
var FZ = true;//辅助
var isChangeBow = false;//是否切换弓位置
var img_RED = 0;//是否请求小红外
var img_HD = 0;//是否请求小可见光
var img_OA = 0;//是否请求小全景
var img_FZ = 0;//是否请求小辅助
var is_MoveSilde = false;//是否拖动silde
//报警确认
var alarm_loc = ''; //车号
var alarm_alarmTime = ''; //时间
var alarm_IRVTimeStamp = '' //时间戳
var alarm_IRVPATH = '' //红外
var alarm_VIPATH = '' //可见光
var alarm_OVPATH = '' //全景
var IRVIDX = '';//红外索引

var alarm_enter = false;//报警确认状态


var rectangleArry = [];//温度获取矩形坐标
var rectangleIndex = 0;//矩形层级
var rectangleName = ''//矩形层级名字

var alarm_vi_Offset = 0;//可见光偏移
var alarm_ov_Offset = 0;//全景偏移
var autoExposure = false;//是否自动曝光

var Request = '';//url数据

var isFromStandardLine = 'false'//是否来自标准线路列表
var StandardLineNumber = 0;//标准线请求次数
var SumarryStandardLine = [];//标准线杆数组 二维数组
var standardline_sildeNumber_poleIndex = 0;//标准线播放索引    杆
var standardline_sildeNumber_poleIndex_ready = 0;//标准线播放索引    已请求杆总数
var standardline_sildeNumber_poleIndex_sum = 0;//标准线播放索引    杆总数
var standardline_sildeNumber_eachOne = 0;//标准线播放索引      二层
var nowSlideNumber_Forline = [0, 0];//当前帧pole和帧
var least_sildeNumber_poleIndex = 0;//最小有数据杆
var max_sildeNumber_poleIndex = 0;//已有数据中最大杆
var polecount = 20;//一次请求杆数
var canMakePrioriy = false;//能否设置优先级
var bowChange = ''//供切换定时器
var firstChangeBow = 0;//切換弓次數
//对比分析数据
//按键事件

var forward = '0'//是否为拖动播放
var standardline_halfNumber = 0;//标准线预请求杆Index   根据每次标准线请求获得

var last_RED = '/C3/PC/LineInspection/img/bg.jpg';//红外上一帧路径
var last_HD = '/C3/PC/LineInspection/img/bg.jpg';//可见光上一帧路径
var last_OA = '/C3/PC/LineInspection/img/bg.jpg';//全景上一帧路径
var last_FZ = '/C3/PC/LineInspection/img/bg.jpg';//辅助上一帧路径
var last_BIG = '/C3/PC/LineInspection/img/bg.jpg';//大图上一帧路径

var startForPush = true;//数组写入for循环完成否
var play_direction_cahrtClear = 0;//播放状态 跳动 前一帧 减一    清空曲线  

//-----------------------------------------原始数据参数   start---------------------------
var alarm_start_time = '';//  快速回到报警发生 那一帧
var originalFile_starttimestamp = '';//  自定范围 开始 时间戳
var originalFile_endtimestamp = '';//  自定范围 结束 时间戳
var showTimeStart = '';//  自定范围 开始 时间
var showTimeEnd = '';//  自定范围 结束 时间
//-----------------------------------------原始数据参数   end---------------------------
$(document).keyup(function (e) {
    var key = e.which;
    if (key == 32 && $('input:focus,textarea:focus').length == 0) {
        if (Ispaly) {
            $('#btn_play').click()
        } else {
            $('#btn_pause').click()
        };
    }
    if (key == 37 && $('input:focus,textarea:focus').length == 0) {
        console.log(sliderNumber)
        $('#btn_less').children("img").click();
    }
    if (key == 39 && $('input:focus,textarea:focus').length == 0) {
        $('#btn_next').children("img").click();
    }
    if (key == 13 && $('input:focus,textarea:focus').length == 0) {
        if (alarm_enter) {
            $(".arrows").hide();
            alarm_enter = false;
            $('#E_btnOk2').click();
            hardDiskSetAlarmID(alarm_loc, alarm_alarmTime, alarm_IRVTimeStamp, alarm_IRVPATH, alarm_VIPATH, alarm_OVPATH, IRVIDX, alarm_vi_Offset, alarm_ov_Offset);
            $('.LineInspection_Confirm').children("img").attr("src", "img/LineInspection_play_Confirm.png");
        } else {
            return false;
        }
    }
    if (key == 27 && $('input:focus,textarea:focus').length == 0) {
        if (alarm_enter) {
            $(".arrows").hide();
            alarm_enter = false;
            alarm_vi_Offset = 0;//偏移置空
            alarm_ov_Offset = 0;
            $('.LineInspection_Confirm').children("img").attr("src", "img/LineInspection_play_Confirm.png");
        } else {
            return false;
        }

    }
});
//页面加载
$(function () {

    Request = GetRequest();//获取url参数
    //setTimeout(loadSureBox, 1000);

    //设置优先级
    $('.bgBtn').click(function () {
        if (canMakePrioriy && $('#firstLevel').val() != '' && $('#firstLevel').val() >= 0) {
            var sumArray_all = [];
            if (AB_SURFACE == 'A') {
                sumArray_all = sumArrayA
            } else if (AB_SURFACE == 'B') {
                sumArray_all = sumArrayB
            } else if (AB_SURFACE == 'C') {
                sumArray_all = sumArrayC
            } else if (AB_SURFACE == 'D') {
                sumArray_all = sumArrayD
            }
            var _url = '/Common/LineInspectionDataAnalysis/RemoteHandlers/HardDIskDataVedioPlay.ashx?&action=ModifiedPrioriy'
            + '&line_code=' + sumArray_all[nowSlideNumber].LINE_CODE
            + '&direction=' + sumArray_all[nowSlideNumber].DIRECTION
            + '&start_timestamp=' + Request.starttimestamp
            + '&end_timestamp=' + Request.endtimestamp
            + '&prioriy=' + $('#firstLevel').val()
            + '&bow_position_code=' + sumArray_all[nowSlideNumber].BOW_POSITION_CODE
            + '&start_POLE_SERIALNO=' + $('.start_title_time').attr('POLE_SERIALNO')
            + '&end_POLE_SERIALNO=' + $('.end_title_time').attr('POLE_SERIALNO')
            + '&loco=' + sumArray_all[nowSlideNumber].LOCOMOTIVE_CODE;
            $.ajax({
                url: _url,
                async: true,
                cache: false,
                beforeSend: function () {
                    layer.msg('设置中', {
                        icon: 16, shade: 0.01, time: 0
                    });
                    //setTimeout(function () { layer.closeAll() }, 2000)
                },
                success: function (re) {
                    layer.closeAll()
                    if (re.RESULT == 'True') {
                        layer.msg('设置成功！')
                        setTimeout(function () {
                            $('.Details_list_linePolling').click();//刷新检测数据列表
                        }, 500)
                        $('.end_title_Level,.start_title_Level').html('&nbsp;优先级' + $('#firstLevel').val())//设置成功重写操作结果列表

                    } else {
                        layer.msg('设置失败！')
                    }
                },
                error: function () {
                    layer.closeAll()
                    layer.msg('设置出错！')
                }
            })
        } else {
            if ($('#firstLevel').val() < 0) {
                layer.msg('优先级不能小于0 请检查输入！');
            } else {
                layer.msg('请检查开始结束时间与优先级！');
            }
        }
    })

    $('.littleimg,.fz_div').hover(function () {
        if ($(this).children('.show_font').is(':hidden') && !alarm_enter) {
            $(this).children('.img_ctorl').show();
        }
    }, function () {
        if ($(this).children('.show_font').is(':hidden')) {
            $(this).children('.img_ctorl').hide();
        }
    })
    $('.img_ctorl').click(function () {
        if ($(this).children('.circle_font').html() == '关闭') {
            $(this).siblings('.show_font').show();
            $(this).siblings('.show_loading').show();
            $(this).addClass('chooseOpen');
            $(this).children('.circle_font').html('打开')

        } else {
            $(this).siblings('.show_font').hide()
            $(this).removeClass('chooseOpen')
            $(this).children('.circle_font').html('关闭')

        }
    })
    //辅助图像开关
    $('#assist_ctorl').click(function () {
        if ($(this).hasClass('chooseOpen')) {
            $(this).removeClass('chooseOpen')
            $('#FZ_IMG_DIR').hide();
            $('#FZ_IMG_DIR').find('.show_loading').show();
            img_FZ = 0;
            forward = '1';
            //关闭辅助通道时大图如果是辅助就切到全景
            if (bigIMG == 'FZ') {
                $('#OVER_IMG_DIR img,#OVER_IMG_DIR .show_font').click()
            }
        } else {
            $(this).addClass('chooseOpen')
            $('#FZ_IMG_DIR').show();
            $('#FZ_IMG_DIR .show_font').hide();
            $('#FZ_ctorl').hide().removeClass('chooseOpen').children('.circle_font').html('关闭');
            img_FZ = 1;
            changeNowImg();
        }
    })
    $('#RED_ctorl').click(function () {
        if (img_RED == 1) {
            forward = '1';
            img_RED = 0;
        } else {
            img_RED = 1;
        }
        changeNowImg();
    })
    $('#HD_ctorl').click(function () {
        if (img_HD == 1) {
            forward = '1';
            img_HD = 0;
        } else {
            img_HD = 1;
        }
        changeNowImg();
    })
    $('#OVER_ctorl').click(function () {
        if (img_OA == 1) {
            forward = '1';
            img_OA = 0;
        } else {
            img_OA = 1;
        }
        changeNowImg();
    })
    $('#FZ_ctorl').click(function () {
        if (img_FZ == 1) {
            forward = '1';
            img_FZ = 0;
        } else {
            img_FZ = 1;
        }
        changeNowImg();
    })


    $('#direction').mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: '3C',
        cateGory: 'DRTFLG',
        enableFilter: false,
        onClick: function (event, treeId, treeNode) {
            $("#direction").attr('code', treeNode.id).val(treeNode.name);
        }
    });

    $("#linspForm").validationEngine({
        validationEventTriggers: "blur",  //触发的事件  "keyup blur",   
        inlineValidation: true, //是否即时验证，false为提交表单时验证,默认true   
        success: false, //为true时即使有不符合的也提交表单,false表示只有全部通过验证了才能提交表单,默认false
        promptPosition: "topLeft" //提示位置，topLeft, topRight, bottomLeft,  centerRight, bottomRight
        //        validateNonVisibleFields: true
    });

    //放大镜
    $("#F").elevateZoom({
        zoomType: "lens",
        lensShape: "round",
        lensSize: 300
    });

    $('#F').data('elevateZoom').changeState('disable');//默认关闭放大
    $('#F').data('elevateZoom').showHideWindow('hide');//默认关闭
    $('.content_jpg').css('height', $(document.body).height() - $('.controller_content').height() + 'px')//根据屏幕高度设置大图高度
    //小图点击
    $('.littleimg img,.littleimg .show_font').click(function () {
        $('.littleimg').removeClass('chooseOne');
        $(this).parent().addClass('chooseOne');
        if ($(this).parent().attr('id') != 'DLV_IMG_DIR') {
            $('.closse_A').click();
        } else {

            $('.LineInspection_Magnifier').children("img").attr("src", "img/LineInspection_play_Magnifier.png");
            $('.zoomContainer').css('display', 'none');
            bigGlass = false;
            $('#F').data('elevateZoom').changeState('disable');
            $('#F').data('elevateZoom').showHideWindow('hide');
        }
    });
    //筛选
    $('#Submit1').click(function () {

        if ($('#linspForm').validationEngine("validate")) {
            dojudge()
            if (judgeAnswer) {
                //screenBtn();
                makelocation();
            }
        }

    })
    //对比分析 打开对比页 传值
    $('#compara_btn').children("img").click(function () {
        if (alarm_enter) {
            return false;
        };
        if (isFromStandardLine == 'true') {
            POLE_CODE = SumarryStandardLine[nowSlideNumber_Forline[0]][nowSlideNumber_Forline[1]].POLE_CODE

        } else {
            if (AB_SURFACE == 'A') {
                POLE_CODE = sumArrayA[sliderNumber].POLE_CODE;
            } else if (AB_SURFACE == 'B') {
                POLE_CODE = sumArrayB[sliderNumber].POLE_CODE;
            } else if (AB_SURFACE == 'C') {
                POLE_CODE = sumArrayC[sliderNumber].POLE_CODE;
            } else if (AB_SURFACE == 'D') {
                POLE_CODE = sumArrayD[sliderNumber].POLE_CODE;
            }
        }
        if (POLE_CODE != '') {
            var _url = '/Common/MOnePoleData/oneChockoneGAN.html?id=polenoinfo&device_id=' + escape(POLE_CODE.replace('#', '%23'));
            //alert(('sumArray' + AB_SURFACE)[1])
            //console.log(typeof ('sumArray' + AB_SURFACE)[1])
            window.open(_url)
        } else {
            layer.msg('暂无定位数据，无法进入！')
        }

    })



    $('#line_tree').mySelectTree({
        tag: 'LINE',
        height: 250,
        enableFilter: true,
        onClick: function (event, treeId, treeNode) {
            $('#line_tree').val(treeNode.name).attr({ "code": treeNode.id });
            $("body").find($("#ULLineTreeselect")).parent().remove();
            $('#LineTreeselect').attr('code', '').val('')
            $('#LineTreeselect').mySelectTree({
                tag: 'LINE_FILTER',
                is_only_section: 'true',
                bureau_code: Request.bureau_code,
                org_code: Request.org_code,
                codeType: treeNode.id,
                height: 250,
                enableFilter: true,
                onClick: function (event, treeId, treeNode) {
                    //console.log(event)
                    $('#LineTreeselect').val(treeNode.name).attr({ "code": treeNode.id });
                    $("body").find($("#ULBRIDGETUNE")).parent().remove();
                    $('#BRIDGETUNE').attr('code', '').val('')
                    $('#BRIDGETUNE').mySelectTree({
                        tag: 'LINE_ONLY_BRIDGE',
                        codeType: treeNode.id,
                        height: 150,
                        enableFilter: true,
                        callback: function (event, treeId, treeNode, msg) {
                            if (msg.length < 10) {
                                bridge_isThere = false;
                                $("body").find($("#ULBRIDGETUNE")).parent().remove();
                            } else {
                                bridge_isThere = true;
                            }
                            console.log(msg);
                        }
                    })

                }
            });
        },
        callback: function (event, treeId, treeNode, msg) {
            $('ULLineTreeselect').parent().remove();
        }
    });
    $('#LineTreeselect').click(function () {
        if ($('#line_tree').val() != '') {

        } else {
            $(this).val('')
            layer.tips("<span style='color:black'>请先选择线路!</span>", '#line_tree', { tips: [2, '#41D0F4'] });
            //layer.tips("<span style='color:#41D0F4'>请先选择线路!</span>", '#line_tree', { tips: [2, 'black'] });
            $("body").find($("#ULLineTreeselect")).parent().remove();
        }

    })
    $('#BRIDGETUNE').click(function () {
        if ($('#LineTreeselect').val() != '') {
            if (!bridge_isThere) {
                layer.tips("<span style='color:black'>该区站暂无桥隧!</span>", '#LineTreeselect', { tips: [2, '#41D0F4'] });
            } else {
                layer.closeAll('tips');
            }
        } else {
            $(this).val('')
            $("body").find($("#ULBRIDGETUNE")).parent().remove();
            layer.tips("<span style='color:black'>请先选择区站!</span>", '#LineTreeselect', { tips: [2, '#41D0F4'] });
            //layer.tips("<span style='color:#41D0F4'>请先选择线路!</span>", '#line_tree', { tips: [2, 'black'] });

        }
    })



    //支柱点击事件
    $('#polNumber').click(function () {
        $('.pol_choose_div').css({
            'top': $('#btn_hideSoBox').offset().top, 'left': $('#polNumber').offset().left
        })//设置支柱列表位置
        if ($('.pol_choose_div').is(":hidden")) {
            var pole_nu = $(this).val();
            page = 1;
            queryPoleList(1, pole_nu);
            $('.pol_choose_div').show();
        }
    })
    $('#polNumber').bind('input propertychange', function () {
        var pole_nu = $(this).val();
        page = 1;
        queryPoleList(1, pole_nu);
    });
    //清晰度选择
    $('.LineInspection_choose').click(function () {
        if ($('.LineInspection_choose_UL').is(':hidden')) {
            $('.LineInspection_choose_UL').css({
                left: $(this).offset().left + ($(this).outerWidth() - $('.LineInspection_choose_UL').outerWidth()) / 2, top: $(this).offset().top + $(this).outerHeight() + 5
            }).show();
        } else {
            $('.LineInspection_choose_UL').hide();
        }
    })
    $('.LineInspection_choose_UL div').click(function () {
        $('.LineInspection_choose').html($(this).html());
        imgSize = $(this).attr('code');
        $('.LineInspection_choose_UL').hide();
        changeNowImg();
    })




    //弓位置选择
    $('.LineInspection_choose_car').click(function () {
        if (alarm_enter) {
            return false;
        };
        if ($('.LineInspection_choose_carUL').is(':hidden')) {
            $('.LineInspection_choose_carUL').css({
                left: $(this).offset().left + ($(this).outerWidth() - $('.LineInspection_choose_carUL').outerWidth()) / 2, top: $(this).offset().top + $(this).outerHeight() + 5
            }).show();
        } else {
            $('.LineInspection_choose_carUL').hide();
        }
    })
    //点击任意地方关闭弓位置下拉框
    $('html').bind("mousedown", function (e) {
        //点击任意地方关闭弓位置下拉框
        if ($(e.target).parents(".LineInspection_choose_carUL").length === 0 && $('.LineInspection_choose_carUL').css('display') != 'none' && !$(e.target).hasClass('LineInspection_choose_car')) {
            $('.LineInspection_choose_carUL').hide();
        }
        //点击任意地方关闭清晰度下拉框
        if ($(e.target).parents(".LineInspection_choose_UL").length === 0 && $('.LineInspection_choose_UL').css('display') != 'none' && !$(e.target).hasClass('LineInspection_choose')) {
            $('.LineInspection_choose_UL').hide();
        }
        //点击任意地方关闭详情下拉框
        if ($('.LineInspection_choose_DetailsUL').css('display') != 'none' && !$(e.target).parents(".LineInspection_details").length != 0 && !$(e.target).parents(".LineInspection_choose_DetailsUL").length != 0) {
            $('.LineInspection_choose_DetailsUL').hide();
        }
        //支柱列表
        if ($(e.target).parents(".pol_choose_div").length === 0 && $('.pol_choose_div').css('display') != 'none' && $(e.target).attr('id') != 'polNumber' && $(e.target).attr('class') != 'pol_choose_div') {
            $('.pol_choose_div').hide();
        }
    });
    //测温选择框
    $('.IR_content').click(function () {
        $('.IR_content').children('.choose_serial').attr('src', 'img/LineInspection_pole_chooseNot.png')
        $(this).children('.choose_serial').attr('src', 'img/LineInspection_pole_choose.png')
        continuous_temperature = $(this).attr('code');
        //if($(this))

    })
    $('.choose_clear').click(function () {
        canvasClear('#cavars,#tempCavars');
    })




    
    //getJson('first')

    if (Request.fromoriginalfile == 'true') {
        alarm_start_time = Request.stampst;
        //选择时间范围
        //layer.open({
        //    title: false,
        //    closeBtn: false,
        //    area: '558px',
        //    type: 1,
        //    shade: 0.5,
        //    content: $("#chooseTimeLaye")
        //})
        //$('#chooseTimeLaye .li_one').click(function () {
        //    if (!$(this).hasClass('times_cheack')) {
        //        $('#chooseTimeLaye .li_one').removeClass('times_cheack')
        //        $(this).addClass('times_cheack')
        //    }
        //})
        //$('#set_time_btn').click(function () {
        //    $('#chooseTimeLaye .li_one').each(function () {
        //        if ($(this).hasClass('times_cheack')) {
        //            setTimeStamp($(this).attr('code'));
        //            getJson('first');
        //            $('.backToalarm').show();
        //        }

        //    })
        //});
        queryIP_IRV = getConfig('FileTaskIRVHelpURL')//请求链接地址red
        queryIP_OV = getConfig('FileTaskOVHelpURL')//请求链接地址ov
        queryIP_VI = getConfig('FileTaskVIHelpURL')//请求链接地址vi
        queryIP_AUX = getConfig('FileTaskAUXHelpURL')//请求链接地址Fz
        $('title').html('原始数据播放')
    } 
    //初始获取json
    getJson('first')
});



//*********************************初始数据获取*****************************************//


//获取url数据
function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串 
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
};

//绑定桥隧
function getBridge(code) {
    $('#BRIDGETUNE').mySelectTree({
        tag: 'LINE_ONLY_BRIDGE',
        codeType: code,
        height: 150,
        enableFilter: true,
        callback: function (event, treeId, treeNode, msg) {
            if (msg.length < 10) {
                bridge_isThere = false;
                $("body").find($("#ULBRIDGETUNE")).parent().remove();
            } else {
                bridge_isThere = true;
            }
        }
    })


}

//绑定区站
function getPosition(code) {
    $('#LineTreeselect').mySelectTree({
        tag: 'LINE_FILTER',
        bureau_code: Request.bureau_code,
        org_code: Request.org_code,
        is_only_section: 'true',
        codeType: code,
        height: 250,
        enableFilter: true,
        onClick: function (event, treeId, treeNode) {
            //console.log(event)
            $('#LineTreeselect').val(treeNode.name).attr({ "code": treeNode.id });
            $("body").find($("#ULBRIDGETUNE")).parent().remove();
            $('#BRIDGETUNE').attr('code', '').val('')
            $('#BRIDGETUNE').mySelectTree({
                tag: 'LINE_ONLY_BRIDGE',
                codeType: treeNode.id,
                height: 150,
                enableFilter: true,
                callback: function (event, treeId, treeNode, msg) {
                    if (msg.length < 10) {
                        bridge_isThere = false;
                        $("body").find($("#ULBRIDGETUNE")).parent().remove();
                    } else {
                        bridge_isThere = true;
                    }
                }
            })
        }
    });


}

//初始json请求
function getJson(wate, changebow, last_Ispaly_stadus) {


    if (number <= 0 || isChangeBow) {
        number++;

        start_time = Request.start_time;
        end_time = Request.end_time;
        start_timestamp = Request.starttimestamp;
        end_timestamp = Request.endtimestamp;
        if (Request.fromoriginalfile == 'true') {//原始数据跳转至此 时间范围重置
            start_timestamp = originalFile_starttimestamp
            end_timestamp = originalFile_endtimestamp
        }
        line_code = Request.line_code;
        line_name = Request.line_name;
        pole_direction = Request.direction;
        position_code = Request.position_code;
        position_name = Request.position_name;
        locomotive_code = Request.locomotive_code;
        if (locomotive_code == undefined) { locomotive_code = '' };

        if (position_code != '' && position_code != undefined) {
            if (position_code == '-') {
                position_code = '-1';
            } else {
                if (number <= 1) {
                    getBridge(position_code);
                }
            }
        } else if (line_code != '' && line_code != undefined) {
            if (number <= 1) {
                getPosition(line_code);
            }
        }
        if (line_code != '' && line_code != undefined) {
            if (line_code == '无线路' || line_code == '-') {
                $('#Q_by_loc').hide();
                $('#line_tree').val(line_code).attr('code', '-1');
                line_code = '-1'
            } else {
                $('#line_tree').val(line_name).attr('code', line_code).css('cursor', '').attr('disabled', 'disabled').siblings('a').hide();

            }
        }
        if (position_code != '' && position_code != undefined) {
            if (position_code == '-1') {
                $('#LineTreeselect').val('无区站').attr('code', position_code);
            } else {
                $('#LineTreeselect').val(position_name).attr('code', position_code).css('cursor', '').attr('disabled', 'disabled').siblings('a').hide();
            }
        } else {
            position_code = '';
            position_name = '';
        }


        //title
        if (Request.fromoriginalfile != 'true') {
            if (start_time.split(' ')[0] == end_time.split(' ')[0]) {
                $('.title_font').html(locomotive_code + '&nbsp;' + start_time + '-' + end_time.split(' ')[1] + '&nbsp;' + line_name + '&nbsp;' + pole_direction + '&nbsp;' + position_name);
            } else {
                $('.title_font').html(locomotive_code + '&nbsp;' + start_time + '-' + end_time + '&nbsp;' + line_name + '&nbsp;' + pole_direction + '&nbsp;' + position_name);
            }
        }
        if (pole_direction != '' && pole_direction != undefined) {
            if (pole_direction == '无行别' || pole_direction == '-') {
                $('#direction').val(pole_direction).attr('code', '-1');
                pole_direction = '-1';
                $('.Qtitle').removeClass('title_choose_one').addClass('title_choosenot_one');
                $('#Q_by_time').removeClass('title_choosenot_one').addClass('title_choose_one');
                $('.qTime').css('visibility', 'visible');
                $('.qLoc').hide();
                $('.QueryBuilder').height(170).css('background', 'url(img/shijian_bg.png)  no-repeat');
            } else {
                $('#direction').val(pole_direction).attr('code', pole_direction).css('cursor', '').attr('disabled', 'disabled').siblings('a').hide();
            }
        }

        //----------------------------------------------------------------------------------标准线路提取参数start--------------------------------------------->>
        if (Request.isFromStandardLine != undefined) {
            isFromStandardLine = Request.isFromStandardLine;//来自标准线路提取

        }
        if (isFromStandardLine == 'true') {
            $('.LineInspection_details_inside_linePolling').height('400px');
            $('.secend_list_title_linePolling ,.afterDo_blackDiv,.LineInspection_Confirm').hide();

            $('.LineInspection_choose_car').hide()//取消弓切换
            $('.title_font').hide()//title切换
            $('.forLine').show()//title切换
            setTimeout(function () {//影藏时间定位
                $('#Q_by_loc').click(); $('#Q_by_loc').next().width('368px')
                $('#Q_by_time').hide()
            }, 500)

            getStandardLineJson(standardline_sildeNumber_poleIndex);
            return;
        }
        //----------------------------------------------------------------------------------标准线路提取参数end--------------------------------------------->>
        //时间默认值
        $('#startTime').click(function () {
            if (Request.fromoriginalfile != 'true') {//原始数据
                WdatePicker({
                    dateFmt: 'yyyy-MM-dd HH:mm:ss', isShowToday: false, isShowClear: false, minDate: start_time.replace(/\//g, "-"), maxDate: end_time.replace(/\//g, "-")
                })
            } else {
                WdatePicker({
                    dateFmt: 'yyyy-MM-dd HH:mm:ss', isShowToday: false, isShowClear: false, minDate: showTimeStart.replace(/\//g, "-"), maxDate: showTimeEnd.replace(/\//g, "-")
                })
            }
          
        })
        //getalarmList()//报警列表获取
    }

    var url = '/Common/LineInspectionDataAnalysis/RemoteHandlers/HardDIskDataVedioPlay.ashx?action='+(Request.fromoriginalfile == 'true'?'FileTaskPlayList':'VedioPlayList')
         + '&pole_direction=' + pole_direction
         + '&position_code=' + position_code
         + '&start_timestamp=' + start_timestamp
         + '&end_timestamp=' + end_timestamp
         + '&locomotive_code=' + locomotive_code
         + '&pageIndex=' + (wate == 'getData' ? pageIndexGetData : (pageIndex < 1 ? 1 : pageIndex))
         + '&pageSize=' + pageSize
         + '&bow_position_code=' + bow_position_code
         + '&line_code=' + line_code
         + '&total=' + Sumcount;
    var url_first = '/Common/LineInspectionDataAnalysis/RemoteHandlers/HardDIskDataVedioPlay.ashx?action=TotalPages'
        + '&pole_direction=' + pole_direction
        + '&position_code=' + position_code
        + '&start_timestamp=' + start_timestamp
        + '&end_timestamp=' + end_timestamp
        + '&locomotive_code=' + locomotive_code
        + '&bow_position_code=' + bow_position_code
        + '&line_code=' + line_code;

    var url_originalfile = '/common/lineinspectiondataanalysis/remotehandlers/harddiskdatavedioplay.ashx?action=FileTaskTotalPages&taskid=' + Request.taskid + '&queueid=' + Request.queueid;
    if (wate == 'first') {
        $.ajax({
            url: (Request.fromoriginalfile == 'true' ? url_originalfile : url_first),
            async: false,
            cache: false,
            success: function (re) {
                if (re != '' && re != undefined && re.TotalPages != 0) {
                    if (Request.fromoriginalfile == 'true') {//原始数据
                        originalFile_starttimestamp = re.start_timestamp;
                        originalFile_endtimestamp = re.end_timestamp;
                        $('.title_font').html(Request.locomotive_code + '&nbsp;' + timestampToTime(originalFile_starttimestamp).replace(/\//g, "-") + '-' + timestampToTime(originalFile_endtimestamp).split(' ')[1].replace(/\//g, "-"));//设置title 原始数据
                    }

                    jsonPlay = re;
                    sessionID = re.sessionid;
                    getRowNumber(jsonPlay, changebow);
                }
                else {
                    getlocomotive_bown(locomotive_code);

                    layer.msg('暂无数据！建议切换弓位置查看');
                    $('#F,#RED,#HD,#OVER,#FZ').attr({
                        'src': 'img/bg.jpg'
                    });
                }
            }
        })
    } else if (wate == 'getData') {
        $.ajax({
            url: url,
            async: true,
            cache: false,
            success: function (re) {
                if (re != '' && re != undefined && re.TotalPages != 0) {
                    pageIndex = pageIndexGetData;
                    jsonPlay = re;
                    ParamSetting(jsonPlay);
                }
            }
        })
    } else if (wate == 'slider') {
        $.ajax({
            url: url,
            async: true,
            cache: false,
            success: function (re) {
                layer.closeAll();
                if (re != '' && re != undefined && re.data.length != 0) {

                    jsonPlay = re;
                    ParamSetting(jsonPlay, true);
                    if (pageIndex < sumPage) {
                        pageIndexGetData = (pageIndex + 1)
                        getJson('getData');//下一页
                    }

                    //进度条点击获取到number  为changebow
                    CompleteImgNum = 5;//图片预加载
                    RED = true;//红外加载完毕
                    HD = true;//高清
                    OVER = true;//全景
                    FZ = true;//辅助
                    Ispaly = last_Ispaly_stadus;
                    sliderNumber = parseInt(changebow);
                    slidePlay(sliderNumber)

                }
                else {
                    layer.msg('暂无数据！');
                    $('#F,#RED,#HD,#OVER,#FZ').attr({
                        'src': 'img/bg.jpg'
                    });
                }
            }
        })
    } else {
        $.ajax({
            url: url,
            async: false,
            cache: false,
            success: function (re) {
                if (re != '' && re != undefined && re.data.length != 0) {
                    jsonPlay = re;
                    ParamSetting(jsonPlay);
                    if (isChangeBow || number <= 1) {
                        number++;
                        //进度条设置上限

                        Setslider(Sumcount);
                    }
                    if (number <= 2) {
                        number++;
                        Getrelations(jsonPlay);
                        //echarts初始化
                        createLineChart();
                        //播放
                        play();
                    }
                    if (wate == 'wite') {

                        BroadcastPace(sliderNumber);
                        //if (sliderNumber > Sumcount) {
                        //    sliderNumber = 0;
                        //}
                        //$('#btn_pause').click();
                        //$('.LineInspection_choose_carUL').hide();//隐藏车号下拉
                    }
                    if (wate == 'atuoPlay') {//重放默认播放
                        $('#btn_pause').click();
                    }
                }
                else {

                    layer.msg('暂无数据！');
                    $('#F,#RED,#HD,#OVER,#FZ').attr({
                        'src': 'img/bg.jpg'
                    });
                }
            }
        })
    }
};

//----------------------------------------------------------------------------------标准线路提取json start--------------------------------------------->>
//获取标准线路json  100根
function getStandardLineJson(index, move, last_Ispaly_stadus) {
    StandardLineNumber++;

    start_time = Request.start_time
    end_time = Request.end_time
    line_code = Request.line_code
    direction = Request.direction
    bureau_code = Request.bureau_code
    org_code = Request.org_code


    //获取100根杆下面的所有帧
    var _url = '/Common/LineInspectionDataAnalysis/RemoteHandlers/HardDiskLineVedioPlay.ashx?&action=VedioPlayList'
             + '&line_code=' + (line_code == 'undefined' ? '' : line_code)
             + '&bureau_code=' + (bureau_code == 'undefined' ? '' : bureau_code)
             + '&org_code=' + (org_code == 'undefined' ? '' : org_code)
             + '&direction=' + (direction == 'undefined' ? '' : direction)
             + '&start_time=' + (start_time == 'undefined' ? '' : start_time)
             + '&end_time=' + (end_time == 'undefined' ? '' : end_time)
             + '&polecount=' + polecount
             + '&index=' + index;
    if (move == 'moreStandardLineJson')//预先请求下一批数据
    {
        $.ajax({
            url: _url,
            async: true,
            cache: false,
            success: function (re) {
                if (re != '' && re != undefined) {
                    data = re.data;
                    standardline_sildeNumber_poleIndex_ready = parseInt(data[0].POLE_INDEX) + polecount
                    for (var i = 0; i < data.length; i++) {
                        SumarryStandardLine[parseInt(data[i].POLE_INDEX)].push(data[i]);
                    }
                    max_sildeNumber_poleIndex = parseInt(data[data.length - 1].POLE_INDEX);//最大的有数据的杆index
                }
            },
            error: function () {
                console.log('标准线预加载数据获取失败')
            }
        })
    } if (move == 'slider')//预先请求下一批数据
    {
        $.ajax({
            url: _url,
            async: true,
            cache: false,
            success: function (re) {
                layer.closeAll();
                if (re != '' && re != undefined) {
                    if (re.request_index != '' && re.request_index != undefined) {
                        standardline_halfNumber = parseInt(re.request_index)//预请求节点
                    }
                    data = re.data;
                    standardline_sildeNumber_poleIndex_ready = parseInt(data[0].POLE_INDEX) + polecount
                    for (var i = 0; i < data.length; i++) {
                        SumarryStandardLine[parseInt(data[i].POLE_INDEX)].push(data[i]);
                    }
                    standardline_sildeNumber_poleIndex = parseInt(data[0].POLE_INDEX);
                    standardline_sildeNumber_eachOne = 0;
                    CompleteImgNum = 5;
                    RED = true;//红外加载完毕
                    HD = true;//高清
                    OVER = true;//全景
                    FZ = true;//辅助
                    Ispaly = last_Ispaly_stadus;
                    if (Ispaly) {
                        play();
                    } else {
                        BroadcastPace_stdanradlin(standardline_sildeNumber_poleIndex, standardline_sildeNumber_eachOne)
                    }
                } else {
                    //slider.slider("value", standardline_sildeNumber_poleIndex_sum);
                    Ispaly = false;
                    layer.msg('标准线播放无数据了')
                }
            },
            error: function () {
                layer.msg('标准线播放数据获取失败')
                Ispaly = false;
            }
        })
    }
    else {
        $.ajax({
            url: _url,
            async: false,
            cache: false,
            success: function (re) {
                if (re != '' && re != undefined) {
                    if (re.request_index != '' && re.request_index != undefined) {
                        standardline_halfNumber = parseInt(re.request_index)//预请求节点
                    }
                    data = re.data;
                    if (move == 'dontMove') {
                        if (parseInt(re.data[0].POLE_INDEX) != index) {//请求到的数据没有定位杆数据
                            layer.msg('该定位杆无数据！')
                        } else {
                            standardline_sildeNumber_poleIndex_ready = parseInt(data[0].POLE_INDEX) + polecount
                            for (var i = 0; i < data.length; i++) {
                                SumarryStandardLine[parseInt(data[i].POLE_INDEX)].push(data[i]);
                            }
                            max_sildeNumber_poleIndex = parseInt(data[data.length - 1].POLE_INDEX);//最大的有数据的杆index

                            CompleteImgNum = 5;
                            RED = true;//红外加载完毕
                            HD = true;//高清
                            OVER = true;//全景
                            FZ = true;//辅助
                            playJudge_standLine();
                        }
                    } else {
                        if (StandardLineNumber <= 1) { //第一次设置数组 进度条
                            sessionID = re.sessionid;
                            setStandardLineArray(data)

                        }
                        max_sildeNumber_poleIndex = parseInt(data[data.length - 1].POLE_INDEX);//最大的有数据的杆index

                        standardline_sildeNumber_poleIndex_ready = parseInt(data[0].POLE_INDEX) + polecount;//第二次请求所需index
                        for (var i = 0; i < data.length; i++) {
                            SumarryStandardLine[parseInt(data[i].POLE_INDEX)].push(data[i]);
                        }//每一杆数组写入


                        //得到第一个有数据的杆index和对应的下面多少帧

                        standardline_sildeNumber_poleIndex = parseInt(data[0].POLE_INDEX);//得到   有数据的第一根杆
                        standardline_sildeNumber_eachOne = 0;//帧号置为0
                        if (StandardLineNumber <= 1) {
                            createLineChartForStanarndlin(SetsliderStandLine[standardline_sildeNumber_poleIndex], standardline_sildeNumber_eachOne);
                        }
                        CompleteImgNum = 5;
                        RED = true;//红外加载完毕
                        HD = true;//高清
                        OVER = true;//全景
                        FZ = true;//辅助

                        if (Ispaly) {
                            play('StandardLine')
                        } else {
                            playJudge_standLine();
                        }
                    }
                } else {
                    //slider.slider("value", standardline_sildeNumber_poleIndex_sum);
                    Ispaly = false;
                    layer.msg('标准线播放无数据了')
                }
            },
            error: function () {
                layer.msg('标准线播放数据获取失败')
                Ispaly = false;
            }
        })
    }



}




//标准线路参数设置
function setStandardLineArray(obj) {
    standardline_sildeNumber_poleIndex_sum = parseInt(obj[0].POLE_TOTAL - 1);//进度条最大值really
    SumarryStandardLine = new Array(parseInt(obj[0].POLE_TOTAL));
    for (var k = 0; k < parseInt(obj[0].POLE_TOTAL) ; k++) {
        SumarryStandardLine[k] = new Array();
    }//每一杆定义为数组

    //console.log(SumarryStandardLine)
    SetsliderStandLine(standardline_sildeNumber_poleIndex_sum)//设置进度条
    least_sildeNumber_poleIndex = parseInt(obj[0].POLE_INDEX);//最小的有数据的杆index
}

//获取标准线路json   1根
function oneploRequest(index) {
    start_time = Request.start_time;
    end_time = Request.end_time;
    line_code = Request.line_code;
    direction = Request.direction;
    bureau_code = Request.bureau_code;
    org_code = Request.org_code;

    //获取左边最近有数据的1根杆下面的所有帧
    var _url = '/Common/LineInspectionDataAnalysis/RemoteHandlers/HardDiskLineVedioPlay.ashx?&action=VedioPlaySingel'
             + '&line_code=' + (line_code == 'undefined' ? '' : line_code)
             + '&bureau_code=' + (bureau_code == 'undefined' ? '' : bureau_code)
             + '&org_code=' + (org_code == 'undefined' ? '' : org_code)
             + '&direction=' + (direction == 'undefined' ? '' : direction)
             + '&start_time=' + (start_time == 'undefined' ? '' : start_time)
             + '&end_time=' + (end_time == 'undefined' ? '' : end_time)
             + '&sort=' + 'left'
             + '&index=' + index;

    $.ajax({
        url: _url,
        async: false,
        cache: false,
        success: function (re) {
            if (re.data != '' && re.data != undefined) {
                //每一杆数组写入
                standardline_sildeNumber_poleIndex = parseInt(re.data[re.data.length - 1].POLE_INDEX);
                for (var i = 0; i < re.data.length; i++) {
                    SumarryStandardLine[parseInt(re.data[i].POLE_INDEX)].push(re.data[i]);
                }

                //得到最新的杆index和对应的下面多少帧
                //standardline_sildeNumber_poleIndex = data[0].POLE_INDEX
                standardline_sildeNumber_eachOne = SumarryStandardLine[standardline_sildeNumber_poleIndex].length - 1;//获取

                dohtmlForline(standardline_sildeNumber_poleIndex, standardline_sildeNumber_eachOne)//展示一帧
            } else {
                console.log('无前一杆数据！')
            }
        }, error: function () {
            console.log('前一杆数据请求错误！')
        }

    })





}












//----------------------------------------------------------------------------------标准线路提取json end--------------------------------------------->>
//请求车弓信息
function getlocomotive_bown(locomotive_code) {
    var _url = '/common/lineinspectiondataanalysis/remotehandlers/harddiskdatavedioplay.ashx?action=locomotive&locomotive_code=' + locomotive_code
    $.ajax({
        type: 'post',
        url: _url,
        async: true,
        cache: false,
        success: function (re) {
            if (re != '' && re != undefined) {
                Getrelations(re, 'isOnlyBow')
            }
        }
    })
}
//车号添加
function Getrelations(json, isOnlyBow) {

    var html = "";
    var relations = json.DEVICE_BOW_RELATIONS;
    var firstcarname = '';
    if (relations != "") {
        if (json.DEVICE_BOW_RELATIONS.indexOf('#') > -1) {
            var Array_relations = relations.split('#');
            for (var i = 0; i < Array_relations.length; i++) {
                for (var j = 0; j < Array_relations[i].split(':')[1].split(',').length; j++) {
                    var code = "ip" + (i + 1);
                    if (j == 0) {
                        code = code + "_A";
                    } else {
                        code = code + "_B";
                    }
                    html += '<div code="' + code + '">' + Array_relations[i].split(':')[1].split(',')[j] + "车</div>";
                }
            }
            bow_position_code = 'ip1_A';
            firstcarname = Array_relations[0].split(':')[1].split(',')[0]
        }
        else {
            for (var j = 0; j < relations.split(':')[1].split(',').length; j++) {
                var code = "";
                if (j == 0) {
                    code = "ip_A";
                } else {
                    code = "ip_B";
                }
                html += '<div code="' + code + '">' + relations.split(':')[1].split(',')[j] + '车</div>';
            }
            bow_position_code = 'ip_A';
            firstcarname = relations.split(':')[1].split(',')[0]
        }
    } else {
        html = '<div code="ip_A">4车</div><div code="ip_B">6车</div>';
        bow_position_code = 'ip_A';
        firstcarname = 4;
    }
    if (!isOnlyBow) {
        $('.LineInspection_choose_car').html(json.data[0].BOW_POSITION_NAME);
    } else {
        $('.LineInspection_choose_car').html(firstcarname + '车');
    }
    $(".LineInspection_choose_carUL").html(html);

    $('.LineInspection_choose_carUL div').click(function () {
        forward = '1';
        setTimeout(function () { $('.show_loading').show(); }, 100)
        Ispaly = false;
        $('.LineInspection_choose_car').html($(this).html());
        var lastBowCode = AB_SURFACE;//前一个弓位置
        bow_position_code = $(this).attr('code');
        switch (bow_position_code) {
            case 'ip1_A':
                AB_SURFACE = 'A'
                break;
            case 'ip_A':
                AB_SURFACE = 'A'
                break;
            case 'ip1_B':
                AB_SURFACE = 'B'
                break;
            case 'ip_B':
                AB_SURFACE = 'B'
                break;
            case 'ip2_A':
                AB_SURFACE = 'C'
                break;
            case 'ip2_B':
                AB_SURFACE = 'D'
                break;
        }
        isChangeBow = true;
        if (!isOnlyBow) {
            getChangeBownSlideNumber(lastBowCode);//根据条件获取播放索引  为同步请求

            getJson('first', 'wite');
        } else {
            resetAll('isFirst');
            createLineChart();

            getJson('first');

        }

        CompleteImgNum = 5;//图片预加载
        RED = true;//红外加载完毕
        HD = true;//高清
        OVER = true;//全景
        Ispaly = true;
        if (sliderNumber > Sumcount) {
            sliderNumber = 0;
        }
        play();
        $('.LineInspection_choose_carUL').hide();
    })

    if (Request.BOW_POSITION_NAME != '' && Request.BOW_POSITION_NAME != undefined && firstChangeBow < 1) {
        firstChangeBow++;
        if (Request.BOW_POSITION_NAME != $('.LineInspection_choose_car').html()) {
            $('.LineInspection_choose_carUL div').each(function () {
                if ($(this).html() == Request.BOW_POSITION_NAME) {
                    var that = $(this);
                    bowChange = setInterval(function () {
                        if (nowSlideNumber >= 0) {
                            that.click(); Ispaly = false;
                            $('#Q_by_loc').click();
                            //定位
                            makelocation(Request.POLE_CODE);
                            clearInterval(bowChange)
                        }
                    }, 1)

                }

            })
        } else {
            Ispaly = false;
            $('#Q_by_loc').click();
            //定位
            makelocation(Request.POLE_CODE);
        }

    }

    if (Request.whicbow != '' && Request.whicbow != undefined && firstChangeBow < 1) {//原始数据来源 获取弓位置
        firstChangeBow++;
        if (Request.whicbow != $('.LineInspection_choose_car').html()) {
            $('.LineInspection_choose_carUL div').each(function () {
                if ($(this).html() == Request.whicbow) {
                    var that = $(this);
                    bowChange = setInterval(function () {
                        if (nowSlideNumber >= 0) {
                            $('.carchoose').html(that.context.innerText)
                            //that.click(); Ispaly = false;
                            //$('#Q_by_time').click();
                            //$('#startTime').val(alarm_start_time)
                            //时间定位
                            //makelocation();
                            clearInterval(bowChange)
                        }
                    }, 1)

                }

            })
        }
    }
}

//重置页面
function resetAll(isFirst) {
    $('.show_loading').show();//loading层显示
    pageIndex = 1;//初始播放内容页
    sumPage = 0;//播放总页数
    sliderNumber = 0;//进度值
    nowSlideNumber = 0;//进度值 now
    count = 0;//进度条最大值
    Sumcount = 0;//进度条最大值really
    number = 0;//请求第几次 第一次设置数组长度
    CompleteImgNum = 0;//图片预加载
    if (!isFirst) {
        clearEcharts();//清空echarts
    }
    clearTimeout(t)
    CompleteImgNum = 5;//图片预加载
    RED = true;//红外加载完毕
    HD = true;//高清
    OVER = true;//全景
    FZ = true;//辅助
    Ispaly = true;
    //clearTimeout(t)
    $('.rightSixDiv img,#F').attr('src', 'img/bg.jpg')
    $('#alarm_Table_content tr').removeClass('now_alarm')//清除播放过的报警
    //change = false;//是否进行拖动

};
//标准线重置
function resetLineAll() {
    $('.show_loading').show();//loading层显示
    number = 0;
    StandardLineNumber = 0;//标准线请求次数
    standardline_sildeNumber_poleIndex = 0;//标准线播放索引    杆
    standardline_sildeNumber_poleIndex_ready = 0;//标准线播放索引    已请求杆总数
    standardline_sildeNumber_poleIndex_sum = 0;//标准线播放索引    杆总数
    standardline_sildeNumber_eachOne = 0;//标准线播放索引      二层
    nowSlideNumber_Forline = [0, 0];//当前帧pole和帧
    least_sildeNumber_poleIndex = 0;//最小有数据杆
    max_sildeNumber_poleIndex = 0;//已有数据中最大杆
    standardline_halfNumber = 0;//预请求 所需开始节点
    clearEcharts()
    CompleteImgNum = 5;//图片预加载
    RED = true;//红外加载完毕
    HD = true;//高清
    OVER = true;//全景
    FZ = true;//辅助
    Ispaly = true;
    clearTimeout(t)
    $('.rightSixDiv img,#F').attr('src', 'img/bg.jpg')
}
//获取总条数
function getRowNumber(jsonPlay, changebow) {
    Sumcount = parseInt(jsonPlay.TotalPages);//进度条最大值really
    if (changebow == 'wite') { getJson('wite'); } else if (changebow == 'atuoPlay') { getJson('atuoPlay') } else { getJson(); }
}


//数组写入及参数设置  预加载文件请求
function ParamSetting(jsonPlay, slide) {
    if (slide) {
        startForPush = false;
    }
    sentFileQuest(jsonPlay)//预加载文件请求

    sumPage = parseInt(jsonPlay.totalPages);//总页数;
    //count += parseInt(jsonPlay.Current_pagesize)//进度条最大值
    count = (pageIndex - 1) * pageSize + parseInt(jsonPlay.Current_pagesize) - 1;
    Sumcount = parseInt(jsonPlay.total_Rows);//进度条最大值really
    //if (number <= 1) {
    //    sumArrayA = new Array(Sumcount);
    //    sumArrayB = new Array(Sumcount);
    //    for (var i = 0; i < jsonPlay.data.length; i++) {
    //        sumArrayA[i] = jsonPlay.data[i]
    //    }
    //} else {
    if (AB_SURFACE == 'A') {
        for (var i = 0; i < jsonPlay.data.length; i++) {
            sumArrayA[i + (pageIndex - 1) * pageSize] = jsonPlay.data[i]
            if (i == jsonPlay.data.length - 1) {
                startForPush = true;
            };
        };
    } else if (AB_SURFACE == 'B') {
        for (var i = 0; i < jsonPlay.data.length; i++) {
            sumArrayB[i + (pageIndex - 1) * pageSize] = jsonPlay.data[i]
            if (i == jsonPlay.data.length - 1) {
                startForPush = true;
            };
        };
    } else if (AB_SURFACE == 'C') {
        for (var i = 0; i < jsonPlay.data.length; i++) {
            sumArrayC[i + (pageIndex - 1) * pageSize] = jsonPlay.data[i]
            if (i == jsonPlay.data.length - 1) {
                startForPush = true;
            };
        };
    } else if (AB_SURFACE == 'D') {
        for (var i = 0; i < jsonPlay.data.length; i++) {
            sumArrayD[i + (pageIndex - 1) * pageSize] = jsonPlay.data[i]
            if (i == jsonPlay.data.length - 1) {
                startForPush = true;
            };
        };
    };;
    //}
    //console.log(jsonPlay.totalPages)
};


//鼠标事件
$(function () {
    //查询
    $('#query_btn').children("img").hover(function () {

        if ($(".QueryBuilder").css("display") == "none") {//未点击时
            $(this).attr("src", "img/LineInspection_play_searchHover.png")
        }
    }, function () {
        if ($(".QueryBuilder").css("display") == "none") {
            $(this).attr("src", "img/LineInspection_play_search.png")
        }
    });
    $('#query_btn').children("img").click(function () {
        if (alarm_enter) {
            return false;
        };
        $('.QueryBuilder').css({
            'left': $('#query_btn').offset().left - 5
        })//设置定位列表位置
        $(this).attr("src", "img/LineInspection_play_searchClick.png")
        Ispaly = false;
        $('.QueryBuilder').toggle()

    });

    //对比分析
    $('#compara_btn').children("img").hover(function () {
        $(this).attr("src", "img/LineInspection_play_comparaHover.png")
    }, function () {
        $(this).attr("src", "img/LineInspection_play_compara.png")
    });
    $('#compara_btn').children("img").click(function () {
        Ispaly = false;
        //play();
    });

    //曝光
    $('.LineInspection_exposure').children("img").hover(function () {
        if ($(this).attr('src') == "img/LineInspection_play_baoguang.png") {
            $(this).attr("src", "img/LineInspection_play_baoguangHover.png")
        }
    }, function () {
        if ($(this).attr('src') == "img/LineInspection_play_baoguangHover.png") {
            $(this).attr("src", "img/LineInspection_play_baoguang.png")
        }
    });
    $('.LineInspection_exposure').children("img").click(function () {
        if ($(this).attr('src') == "img/LineInspection_play_baoguangClick.png") {
            $(this).attr("src", "img/LineInspection_play_baoguang.png")
            autoExposure = false;
            changeNowImg();
        } else {
            $(this).attr("src", "img/LineInspection_play_baoguangClick.png")
            autoExposure = true;
            changeNowImg();
        }
    })


    //前一张
    $('#btn_less').children("img").hover(function () {
        $(this).attr("src", "img/LineInspection_play_leftHover.png")
    }, function () {
        $(this).attr("src", "img/LineInspection_play_left.png")
    });
    //播放
    $('#btn_play').children("img").hover(function () {
        $(this).attr("src", "img/LineInspection_play_playHover.png")
    }, function () {
        $(this).attr("src", "img/LineInspection_play_play.png")
    });
    $('#btn_play').click(function () {

        Ispaly = false;
        play();
    });
    //暂停
    $('#btn_pause').children("img").hover(function () {
        $(this).attr("src", "img/LineInspection_play_stopHover.png")
    }, function () {
        $(this).attr("src", "img/LineInspection_play_stop.png")
    });
    $('#btn_pause').click(function () {
        if (play_direction_cahrtClear < 0) {
            play_direction_cahrtClear = 0;
        }
        CompleteImgNum = 5;//图片预加载
        RED = true;//红外加载完毕
        HD = true;//高清
        OVER = true;//全景
        FZ = true;//辅助
        Ispaly = true;
        play();
    });
    //下一张
    $('#btn_next').children("img").hover(function () {
        $(this).attr("src", "img/LineInspection_play_rightHover.png")
    }, function () {
        $(this).attr("src", "img/LineInspection_play_right.png")
    });
    //重播
    $('#btn_repeat').children("img").hover(function () {
        $(this).attr("src", "img/LineInspection_play_replayHover.png")
    }, function () {
        $(this).attr("src", "img/LineInspection_play_replay.png")
    });
    //详细信息

    //$('.LineInspection_details').children("img").click(function () {
    //    if ($('.LineInspection_details_inside').css('display') == 'block') {
    //        $(this).attr("src", "img/LineInspection_play_Details.png");
    //        $('.LineInspection_details_inside').hide();
    //    } else {
    //        $('.LineInspection_details_inside').show();
    //        $(this).attr("src", "img/LineInspection_play_DetailsHover.png");
    //    }
    //});
    $('.LineInspection_details').children("img").hover(function () {
        if ($(this).attr('src') == "img/LineInspection_play_Details.png") {
            $(this).attr("src", "img/LineInspection_play_DetailsHover.png")
        }
    }, function () {
        if ($(this).attr('src') == "img/LineInspection_play_DetailsHover.png") {
            $(this).attr("src", "img/LineInspection_play_Details.png")
        }

    })
    $('.LineInspection_details').children("img").click(function () {
        $('.LineInspection_choose_DetailsUL').css({
            left: $(this).offset().left, top: $(this).offset().top + $(this).outerHeight() + 5
        });
        if ($('.LineInspection_choose_DetailsUL').css('display') == 'block') {
            //$(this).attr("src", "img/LineInspection_play_Details.png");
            $('.LineInspection_choose_DetailsUL').hide();
        } else {
            $('.LineInspection_choose_DetailsUL').show();
            //$(this).attr("src", "img/LineInspection_play_DetailsHover.png");
        }
    });
    $('.LineInspection_choose_DetailsUL>div').click(function () {
        $('.LineInspection_details img').attr("src", "img/LineInspection_play_DetailsClick.png");
        $('.detailes').hide();
        $('.LineInspection_choose_DetailsUL').hide();
        $('.LineInspection_choose_DetailsUL div').removeClass('list_ChooseOne');
        $(this).addClass('list_ChooseOne');

        if ($(this).hasClass('Details_list_play')) {
            $('.LineInspection_details_inside').show();
        } else if ($(this).hasClass('Details_list_alarm')) {
            $('.LineInspection_details_inside_alarm').show();
        } else if ($(this).hasClass('Details_list_linePolling')) {
            Ispaly = false;
            $('.LineInspection_details_inside_linePolling').show();
            getLininspctionList();//请求监测数据列表
        }
    });

    $('.btn_hide').children("img").hover(function () {
        $(this).attr("src", "img/LineInspection_play_DetailsshowHover.png")
    }, function () {
        $(this).attr("src", "img/LineInspection_play_Detailsshow.png")
    });
    $('.btn_hide').children("img").click(function () {
        $('.LineInspection_choose_DetailsUL div').removeClass('list_ChooseOne');
        $('.LineInspection_details').children("img").attr("src", "img/LineInspection_play_Details.png");
        $(this).parents('.detailes').hide()
    });

    //放大 与否
    $('.LineInspection_Magnifier').children("img").hover(function () {
        if ($(this).attr('src') == "img/LineInspection_play_Magnifier.png") {
            $(this).attr("src", "img/LineInspection_play_MagnifierHover.png")
        }
    }, function () {
        if ($(this).attr('src') == "img/LineInspection_play_MagnifierHover.png") {
            $(this).attr("src", "img/LineInspection_play_Magnifier.png")
        }
    });
    $('.LineInspection_Magnifier').children("img").click(function () {
        if (bigGlass == false) {
            if (!$('#DLV_IMG_DIR').hasClass('chooseOne') && !$('#FZ_IMG_DIR').hasClass('chooseOne')) {
                $(this).attr("src", "img/LineInspection_play_MagnifierClick.png");
                $('.zoomContainer').css('display', 'block');
                bigGlass = true;
                $('#F').data('elevateZoom').changeState('enable');
                $('#F').data('elevateZoom').showHideWindow('show');
                $('#F').data('elevateZoom').swaptheimage($('#F').attr('src'), $('#F').attr('src'));
            } else {
                layer.msg('红外图像与辅助图像不支持放大！')
            }
        } else {
            $(this).attr("src", "img/LineInspection_play_Magnifier.png");
            $('.zoomContainer').css('display', 'none');
            bigGlass = false;
            $('#F').data('elevateZoom').changeState('disable');
            $('#F').data('elevateZoom').showHideWindow('hide');
        }
    });


    //关闭
    $('.title_of_title a img').hover(function () {
        $(this).attr("src", "img/LineInspection_play_closseAllHover.png")
    }, function () {
        $(this).attr("src", "img/LineInspection_play_closseAll.png")
    })


    //查询 隐藏
    $('#btn_hideSoBox').click(function () {
        $('#query_btn').children("img").attr("src", "img/LineInspection_play_search.png");
        $('.QueryBuilder').hide();
    });

    //小图点击切换大图
    $('#DLV_IMG_DIR img,#DLV_IMG_DIR .show_font').click(function () {
        if (bigIMG != 'DLV') {
            $('#bigIMG_OVER').find('.show_loading').show();
            setTimeout(function () { if (Ispaly) { $('#bigIMG_OVER').find('.show_loading').show() }; }, 100)
            bigIMG = 'DLV';
            if (img_RED == 0) {
                forward = '1';
            }
            $('.zoomContainer').css('display', 'none');
            $('#F').attr('src', $('#RED').attr('src'));
            if ($('#RED').attr('src') == '/C3/PC/LineInspection/img/bg.jpg') {
                $('#bigIMG_OVER').find('.show_loading').show();
            }
        }
    });
    $('#FZ_IMG_DIR img,#FZ_IMG_DIR .show_font').click(function () {
        if (bigIMG != 'FZ') {
            $('#bigIMG_OVER').find('.show_loading').show();
            setTimeout(function () { if (Ispaly) { $('#bigIMG_OVER').find('.show_loading').show() }; }, 100)
            bigIMG = 'FZ';
            if (img_FZ == 0) {
                forward = '1';
            }
            $('.zoomContainer').css('display', 'none');
            $('#F').attr('src', $('#FZ').attr('src'));
            if ($('#FZ').attr('src') == '/C3/PC/LineInspection/img/bg.jpg') {
                $('#bigIMG_OVER').find('.show_loading').show();
            }
        }
    });
    $('#HD_IMG_DIR img,#HD_IMG_DIR .show_font').click(function () {
        if (bigIMG != 'HD') {
            $('#bigIMG_OVER').find('.show_loading').show();
            setTimeout(function () { if (Ispaly) { $('#bigIMG_OVER').find('.show_loading').show() }; }, 100)
            if (bigGlass) {
                $('#F').data('elevateZoom').changeState('enable');
                $('#F').data('elevateZoom').showHideWindow('show');
                $('.zoomContainer').css('display', 'block');
            }
            bigIMG = 'HD';
            if (img_HD == 0) {
                forward = '1';
            }
            var bigsrc = $('#HD').attr('src').split('&swidth')[0];
            $('#F').data('elevateZoom').swaptheimage(bigsrc, bigsrc);
            if (bigsrc == '/C3/PC/LineInspection/img/bg.jpg') {
                $('#bigIMG_OVER').find('.show_loading').show();
            }
        }
    });
    $('#OVER_IMG_DIR img,#OVER_IMG_DIR .show_font').click(function () {
        if (bigIMG != 'OVER') {
            $('#bigIMG_OVER').find('.show_loading').show();
            setTimeout(function () { if (Ispaly) { $('#bigIMG_OVER').find('.show_loading').show() }; }, 100)
            bigIMG = 'OVER';
            if (img_OA == 0) {
                forward = '1';
            }
            if (bigGlass) {
                $('#F').data('elevateZoom').changeState('enable');
                $('#F').data('elevateZoom').showHideWindow('show');
                $('.zoomContainer').css('display', 'block');
            };
            var bigsrc = $('#OVER').attr('src').split('&swidth')[0];
            $('#F').data('elevateZoom').swaptheimage(bigsrc, bigsrc);
            if (bigsrc == '/C3/PC/LineInspection/img/bg.jpg') {
                $('#bigIMG_OVER').find('.show_loading').show();
            }
        }
    });
    $('.littleimg').click(function () {
        changeNowImg();
    })
    //跳转title切换
    $('#Q_by_time').click(function () {
        $('.Qtitle').removeClass('title_choose_one').addClass('title_choosenot_one');
        $(this).removeClass('title_choosenot_one').addClass('title_choose_one');
        $('.qTime').css('visibility', 'visible');
        $('.qLoc').hide();
        $('.QueryBuilder').height(170).css('background', 'url(img/shijian_bg.png)  no-repeat');
        //.css('background-size','100% 100%')
    });
    $('#Q_by_loc').click(function () {
        $('.Qtitle').removeClass('title_choose_one').addClass('title_choosenot_one');
        $(this).removeClass('title_choosenot_one').addClass('title_choose_one');
        $('.qTime').css('visibility', 'hidden');
        $('.qLoc').show();
        $('.QueryBuilder').height(258).css('background', 'url(img/LineInspection_play_QueryBuilder.png) no-repeat ');

    });



    //翻页按钮鼠标经过变图片
    $(".page-top").children("img").hover(function () {
        $(this).attr("src", "/Common/MGIS/img/gis-img/top-light.png")
    }, function () {
        $(this).attr("src", "/Common/MGIS/img/gis-img/top.png")
    });
    $(".page-pre").children("img").hover(function () {
        $(this).attr("src", "/Common/MGIS/img/gis-img/pre-light.png")
    }, function () {
        $(this).attr("src", "/Common/MGIS/img/gis-img/pre.png")
    });
    $(".page-nex").children("img").hover(function () {
        $(this).attr("src", "/Common/MGIS/img/gis-img/nex-light.png")
    }, function () {
        $(this).attr("src", "/Common/MGIS/img/gis-img/nex.png")
    });
    $(".page-last").children("img").hover(function () {
        $(this).attr("src", "/Common/MGIS/img/gis-img/last-light.png")
    }, function () {
        $(this).attr("src", "/Common/MGIS/img/gis-img/last.png")
    });



    //红外温度测量
    $('.LineInspection_Temp').children("img").hover(function () {
        if ($(".IR_alert").css("display") == "none") {//未点击时
            $(this).attr("src", "img/LineInspection_play_TempHover.png")
        }
    }, function () {
        if ($(".IR_alert").css("display") == "none") {
            $(this).attr("src", "img/LineInspection_play_Temp.png")
        }
    });
    $('.LineInspection_Temp').children("img").click(function () {
        if (alarm_enter) {
            $('canvas').css('cursor', 'default')
            return;
        };
        $(this).attr("src", "img/LineInspection_play_TempClick.png")
        if ($('.IR_alert').is(':hidden')) {

            $('.littleimg').removeClass('chooseOne');

            $('#DLV_IMG_DIR').addClass('chooseOne');
            $('#RED').click();

            $('.btn_hide').children('img').click();

            $('#cavars').bind({
                click: ImgTouchPointEvent
            });
            drawPen();
            $('canvas').css('cursor', 'crosshair')
        } else {
            canvasClear('#cavars')
            $('#cavars').unbind({
                click: ImgTouchPointEvent
            })
            $('canvas').css('cursor', 'default')
        }
        Ispaly = false;
        $('.IR_alert').toggle()
        $(".IR_alert").draggable({
            containment: "#bigIMG_OVER", scroll: false, handle: ".IR_title"
        });

    });
    //红外关闭
    $('.closse_A').click(function () {
        $('.LineInspection_Temp').children("img").attr("src", "img/LineInspection_play_Temp.png");
        $('.IR_alert').hide();
        canvasClear('#cavars,#tempCavars');
        $('#cavars').unbind({
            click: ImgTouchPointEvent
        })
        $('canvas').css('cursor', 'default');
        //可能要关闭获取温度画布
    })


    //确认报警
    $('.LineInspection_Confirm').children("img").hover(function () {
        $(this).attr("src", "img/LineInspection_play_ConfirmHover.png")
    }, function () {
        $(this).attr("src", "img/LineInspection_play_Confirm.png")
    })
    //$('.LineInspection_Confirm').children("img").click(function () {
    //    $(this).attr("src", "img/LineInspection_play_ConfirmHover.png")
    //})
    //报警确认点击
    $('.LineInspection_Confirm').children("img").on("click", function () {
        $(this).children("img").attr("src", "img/LineInspection_play_ConfirmHover.png")
        $('.closse_A').click();//关闭红外测温
        $('#btn_hideSoBox').click()//关闭定位框
        Ispaly = false; //暂停
        AlarmSure();
    });

    $('.echarsAndJpg').height($(window).height())
    //红外温度画布
    $('#cavars,#tempCavars').attr({ 'width': $('.content_jpg').width(), 'height': $(document.body).height() - $('.controller').height() }).css('height', $(document.body).height() - $('.controller').height() + 'px').css('top', $('.controller').height() + 'px')//根据屏幕高度设置大图高度
    //console.log($('.controller').height())

    $(".choose_clear").bind("click", function (event) {
        event.stopPropagation();
    });//移除清除按钮冒泡

    //报警确认偏移按钮
    $('.arrows').click(function () {
        switch ($(this).attr('id')) {
            case 'HD_left':
                alarm_vi_Offset--;
                break;
            case 'HD_right':
                alarm_vi_Offset++;
                break;
            case 'OV_left':
                alarm_ov_Offset--;
                break;
            case 'OV_right':
                alarm_ov_Offset++;
                break;
        };
        doHtml(nowSlideNumber, isOffset);
    })

})
ImgTouchPointEvent = function (e) {
    if (continuous_temperature == 'single_point') {
        canvasClear('#cavars,#tempCavars')
    } else if (continuous_temperature == 'rectangle') {
        return;
    }
    //$('#cavars').removeLayer(rectangleName)
    var start_arr = [];
    var end_arr = [];
    end_arr[0] = e.pageX; //压缩图上的值
    end_arr[1] = e.pageY - $('.controller').height(); //压缩图上的值
    //drawLine('cavars', end_arr);
    getTemp(end_arr);
}

//温度请求
function getTemp(end_arr) {
    if (isFromStandardLine == 'true') {
        var sumArray_all = SumarryStandardLine[nowSlideNumber_Forline[0]];
        nowSlideNumber = nowSlideNumber_Forline[1];

    } else {

        var sumArray_all = [];
        if (AB_SURFACE == 'A') {
            sumArray_all = sumArrayA
        } else if (AB_SURFACE == 'B') {
            sumArray_all = sumArrayB
        } else if (AB_SURFACE == 'C') {
            sumArray_all = sumArrayC
        } else if (AB_SURFACE == 'D') {
            sumArray_all = sumArrayD
        }

    }

    var x1 = parseInt(end_arr[0] / $('#cavars').width() * 640);
    var y1 = parseInt(end_arr[1] / $('#cavars').height() * 480);
    var x2 = 0;
    var y2 = 0;
    if (end_arr.length > 2) {
        x2 = parseInt(end_arr[2] / $('#cavars').width() * 640);
        y2 = parseInt(end_arr[3] / $('#cavars').height() * 480);
    }
    console.log(x1, y1, x2, y2)
    //console.log(x, y)
    var _url = '/Common/LineInspectionDataAnalysis/RemoteHandlers/HardDIskDataVedioPlay.ashx?&path=' + sumArray_all[nowSlideNumber].FILEPATH_IRV
             + '&timestamp=' + sumArray_all[nowSlideNumber].TIMESTAMP_IRV
             + '&locomotive=' + sumArray_all[nowSlideNumber].LOCOMOTIVE_CODE
             + '&action=IRVTemp&IRVIDX=' + sumArray_all[nowSlideNumber].IRV_IDX + '&x1=' + x1 + '&y1=' + y1 + '&x2=' + x2 + '&y2=' + y2
    $.ajax({
        type: 'post',
        url: _url,
        async: true,
        cache: false,
        success: function (re) {
            if (re.irvTemp != undefined) {
                if (end_arr.length == 2) {
                    drawLine('tempCavars', end_arr, re.irvTemp)
                } else {
                    if (re.x != 0 && re.y != 0 && re.irvTemp != 0) {
                        drawMax('tempCavars', [re.x, re.y], re.irvTemp)//坐标来自后台
                    } else {
                        layer.msg('请求温度异常！')
                    }
                }
            } else {
                //drawLine('tempCavars', end_arr, 18.5)
                //drawMax('tempCavars', [end_arr[2], end_arr[3]], 18.5)//坐标来自后台
                layer.msg('请求温度失败！')
            }
        },
        error: function () {

            layer.msg('请求出错！');
        }


    })

}
//画点温度
function drawLine(canvasId, end_arr, temp) {
    //将线画在画布(canvas)上
    var c = document.getElementById(canvasId); //画布
    var cxt = c.getContext('2d'); //画笔
    //画线
    var draw = function (x, y, width, height, radius, color, type) {
        cxt.beginPath();
        cxt.moveTo(x, y + radius);
        cxt.lineTo(x, y + height - radius);
        cxt.quadraticCurveTo(x, y + height, x + radius, y + height);
        cxt.lineTo(x + width - radius, y + height);
        cxt.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
        cxt.lineTo(x + width, y + radius);
        cxt.quadraticCurveTo(x + width, y, x + width - radius, y);
        cxt.lineTo(x + radius, y);
        cxt.quadraticCurveTo(x, y, x, y + radius);
        cxt[type + 'Style'] = color || params.color;
        cxt.closePath();
        cxt[type]();
    }
    
    
    if (end_arr[0] > ($('#cavars').width() - 100)) {//画矩形背景
        draw((end_arr[0] - 100), (end_arr[1] - 14), (temp.toString().length * 14 + 20), 30, 5, '#80D716', 'fill')
    } else {
        draw((end_arr[0] + 22), (end_arr[1] - 14), (temp.toString().length * 14 + 20), 30, 5, '#80D716', 'fill')
    }
    cxt.beginPath();

    cxt.arc(end_arr[0], end_arr[1], 2, 0, 360, false);
    cxt.fillStyle = "red";//填充颜色,默认是黑色
    cxt.fill();//画实心圆
    cxt.closePath();
    //设置字体样式
    cxt.beginPath();
    cxt.font = "18px Microsoft YaHei";
    //设置字体填充颜色
    cxt.fillStyle = "white";
    //cxt.fillStyle = "red";
    //从坐标点(50,50)开始绘制文字
    if (end_arr[0] > ($('#cavars').width() - 100)) {
        cxt.fillText(temp + "℃", end_arr[0] - 90, end_arr[1] + 8);
    } else {
        cxt.fillText(temp + "℃", end_arr[0] + 30, end_arr[1] + 8);
    }
    cxt.closePath();
    cxt.beginPath();
    cxt.strokeStyle = '#80D816';//线条颜色：绿色
    //cxt.strokeStyle = '#3279C0';//线条颜色：蓝色
    cxt.lineWidth = 4;//设置线宽
    cxt.moveTo(end_arr[0] + 14, end_arr[1]);
    cxt.lineTo(end_arr[0] - 14, end_arr[1]);
    cxt.moveTo(end_arr[0], end_arr[1] + 14);
    cxt.lineTo(end_arr[0], end_arr[1] - 14);
    cxt.stroke();//画线
    cxt.closePath();
   
}
//画矩形最大温度
function drawMax(canvasId, end_arr, temp) {
    end_arr[0] = end_arr[0] * $('#cavars').width() / 640
    end_arr[1] = end_arr[1] * $('#cavars').height() / 480

    //将线画在画布(canvas)上
    var c = document.getElementById(canvasId); //画布
    var cxt = c.getContext('2d'); //画笔
    //画线
    var draw = function (x, y, width, height, radius, color, type) {
        cxt.beginPath();
        cxt.moveTo(x, y + radius);
        cxt.lineTo(x, y + height - radius);
        cxt.quadraticCurveTo(x, y + height, x + radius, y + height);
        cxt.lineTo(x + width - radius, y + height);
        cxt.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
        cxt.lineTo(x + width, y + radius);
        cxt.quadraticCurveTo(x + width, y, x + width - radius, y);
        cxt.lineTo(x + radius, y);
        cxt.quadraticCurveTo(x, y, x, y + radius);
        cxt[type + 'Style'] = color || params.color;
        cxt.closePath();
        cxt[type]();
    }

    if (end_arr[0] > ($('#cavars').width() - 135)) {//画矩形背景
        draw((end_arr[0] - 130), (end_arr[1] - 14), (temp.toString().length * 14 + 55), 30, 5, '#80D716', 'fill')
    } else {
        draw((end_arr[0] + 22), (end_arr[1] - 14), (temp.toString().length * 14 + 55), 30, 5, '#80D716', 'fill')
    }

    cxt.beginPath();

    cxt.arc(end_arr[0], end_arr[1], 2, 0, 360, false);
    cxt.fillStyle = "red";//填充颜色,默认是黑色
    cxt.fill();//画实心圆
    cxt.closePath();
    //设置字体样式
    cxt.beginPath();
    cxt.font = "18px Microsoft YaHei";
    //设置字体填充颜色
    cxt.fillStyle = "white";
    //从坐标点(50,50)开始绘制文字
    //cxt.fillText('Max:' + temp + "℃", end_arr[0] + 10, end_arr[1] + 5);
    if (end_arr[0] > ($('#cavars').width() - 135)) {
        cxt.fillText('Max:' + temp + "℃", end_arr[0] - 120, end_arr[1] + 8);
    } else {
        cxt.fillText('Max:' + temp + "℃", end_arr[0] + 30, end_arr[1] + 8);
    }
    cxt.closePath();
    cxt.beginPath();
    cxt.strokeStyle = '#80D816';//线条颜色：绿色
    //cxt.strokeStyle = 'black';//线条颜色：黑色
    cxt.lineWidth = 4;//设置线宽
    cxt.moveTo(end_arr[0] + 14, end_arr[1]);
    cxt.lineTo(end_arr[0] - 14, end_arr[1]);
    cxt.moveTo(end_arr[0], end_arr[1] + 14);
    cxt.lineTo(end_arr[0], end_arr[1] - 14);
    cxt.stroke();//画线
    cxt.closePath();



}
//清除画布
function canvasClear(canvasIds) {
    var canvasId = canvasIds.split(',');
    //var id = canvasId.split('#')[1];
    //var c = document.getElementById(id); //画布
    //var ctx = c.getContext('2d'); //画笔
    //ctx.clearRect(0, 0, $(canvasId).attr('width'), $(canvasId).attr('height'));
    for (var i = 0; i < canvasId.length; i++) {
        var id = canvasId[i].split('#')[1];
        var c = document.getElementById(id); //画布
        var ctx = c.getContext('2d'); //画笔
        ctx.clearRect(0, 0, $(canvasId[i]).attr('width'), $(canvasId[i]).attr('height'));
        $(canvasId[i]).removeLayers();
        $(canvasId[i]).attr('width', $(canvasId).attr('width'));
    }


}


//验证时间
function dojudge() {
    if ($('#startTime').val() != '' && $('#endTime').val() != '') {
        if ($('#startTime').val() >= $('#endTime').val()) {
            layer.msg('时间输入有误！')
            judgeAnswer = false
        } else {
            judgeAnswer = true
        }
    } else {
        judgeAnswer = true
    }
    DoKmjudge();
};


//验证大小判断
function DoKmjudge() {
    if ($('#kmStart').val() != '' && $('#kmEnd').val() != '') {
        if (parseInt($('#kmStart').val()) > parseInt($('#kmEnd').val())) {
            layer.tips('请输入更大的数', '#kmEnd', {
                tips: [1, '#3595CC']
            });
            judgeAnswer = false
        } else {
            judgeAnswer = true
        }
    } else {
        judgeAnswer = true
    }
}
//控制条
$(function () {


    //前一帧
    $('#btn_less').children("img").click(function () {
        $('#btn_play').css('display', 'none');
        $('#btn_pause').css('display', 'block');
        if (play_direction_cahrtClear > 0) {
            play_direction_cahrtClear = 0;
        }
        if (isFromStandardLine != 'true') {
            sliderNumber = nowSlideNumber;
            if (Ispaly) {
                Ispaly = false;
                is_MoveSilde = true;
                sliderNumber -= 2;//进度
            } else {
                sliderNumber--;//进度
            }
            //console.log(sliderNumber)
            if (sliderNumber < 0) {
                layer.msg('没有上一帧了！')
                sliderNumber = 0
            } else {
                if (AB_SURFACE == "A" && sumArrayA[sliderNumber] == undefined || AB_SURFACE == "B" && sumArrayB[sliderNumber] == undefined || AB_SURFACE == "C" && sumArrayC[sliderNumber] == undefined || AB_SURFACE == "D" && sumArrayD[sliderNumber] == undefined) {
                    pageIndex--;
                    getJson();
                }
                playJudge()
            }

        } else {
            standardline_sildeNumber_poleIndex = nowSlideNumber_Forline[0];
            standardline_sildeNumber_eachOne = nowSlideNumber_Forline[1];
            if (Ispaly) {
                Ispaly = false;
            }
            standardline_sildeNumber_eachOne--;
            if (standardline_sildeNumber_eachOne < 0) {
                if (standardline_sildeNumber_poleIndex <= least_sildeNumber_poleIndex) {
                    layer.msg('没有上一帧了！');
                    standardline_sildeNumber_eachOne = 0;
                    standardline_sildeNumber_poleIndex = least_sildeNumber_poleIndex;
                } else {
                    standardline_sildeNumber_poleIndex--;
                    if (SumarryStandardLine[standardline_sildeNumber_poleIndex].length > 0) {
                        standardline_sildeNumber_eachOne = SumarryStandardLine[standardline_sildeNumber_poleIndex].length - 1
                        dohtmlForline(standardline_sildeNumber_poleIndex, standardline_sildeNumber_eachOne)//展示一帧
                    } else {
                        oneploRequest(standardline_sildeNumber_poleIndex);

                    }
                    //if (standardline_sildeNumber_eachOne <= 0) {//前一根杆也为空
                    //    nowSlideNumber_Forline[standardline_sildeNumber_poleIndex, standardline_sildeNumber_eachOne];//全局至小一档继续下一帧
                    //    $('#btn_less').children("img").click();
                    //}
                }
            } else {
                dohtmlForline(standardline_sildeNumber_poleIndex, standardline_sildeNumber_eachOne)//展示一帧
            }
        }
        play_direction_cahrtClear = -1;
    });

    //后一帧
    $('#btn_next').children("img").click(function () {
        if (play_direction_cahrtClear < 0) {
            play_direction_cahrtClear = 0;
        }
        $('#btn_play').css('display', 'none');
        $('#btn_pause').css('display', 'block');
        if (isFromStandardLine != 'true') {
            sliderNumber = nowSlideNumber;
            if (Ispaly) {
                Ispaly = false;
                is_MoveSilde = true;

            } else {
                sliderNumber++;//进度
            }
            if (sliderNumber >= Sumcount) {
                sliderNumber = Sumcount - 1
                layer.msg('没有下一帧了！')
            } else {
                playJudgeGetData()
                playJudge()
            }
        } else {
            standardline_sildeNumber_poleIndex = nowSlideNumber_Forline[0];
            standardline_sildeNumber_eachOne = nowSlideNumber_Forline[1];
            if (Ispaly) {
                Ispaly = false;
            }
            standardline_sildeNumber_eachOne++;
            if (standardline_sildeNumber_eachOne >= SumarryStandardLine[standardline_sildeNumber_poleIndex].length) {
                if (standardline_sildeNumber_poleIndex >= max_sildeNumber_poleIndex) {
                    getStandardLineJson(standardline_sildeNumber_poleIndex)
                    //请求下面的杆
                } else {
                    standardline_sildeNumber_poleIndex++;
                    if (SumarryStandardLine[standardline_sildeNumber_poleIndex].length > 0) {
                        standardline_sildeNumber_eachOne = 0;
                        dohtmlForline(standardline_sildeNumber_poleIndex, standardline_sildeNumber_eachOne)//展示一帧
                    } else {
                        nowSlideNumber_Forline[0] = standardline_sildeNumber_poleIndex;
                        $('#btn_next').children("img").click()
                    }

                }
            } else {
                dohtmlForline(standardline_sildeNumber_poleIndex, standardline_sildeNumber_eachOne)//展示一帧
            }
        }
    });

    //重放
    $('#btn_repeat').children("img").click(function () {
        setTimeout(function () {
            $('.show_loading').show();//loading层显示
        }, 100)
        if (isFromStandardLine != 'true') {
            resetAll();
            getJson('first', 'atuoPlay');
        } else {
            resetLineAll();
            getJson('first');
        }
    })
});

//播放位置判断
function playJudge() {
    layer.closeAll();
    if (sliderNumber >= count) {
        //当前页是否为最后一页
        if (pageIndex >= sumPage) {
            Ispaly = false;
            BroadcastPace(sliderNumber);
            //console.log(sliderNumber);
            clearTimeout(t);
            $('#btn_play').css('display', 'none');
            $('#btn_pause').css('display', 'block');
        } else {
            pageIndex += 1;
            getJson('wite', 'wite');//下一页

        }
    } else {
        //-------------------------------------------------------------------------------开始
        //如果定位而来  先定位了一个大的数  在定位一个小的数 小的数没有 请求改页数据
        var sumArray_all = [];
        if (AB_SURFACE == 'A') {
            sumArray_all = sumArrayA
        } else if (AB_SURFACE == 'B') {
            sumArray_all = sumArrayB
        } else if (AB_SURFACE == 'C') {
            sumArray_all = sumArrayC
        } else if (AB_SURFACE == 'D') {
            sumArray_all = sumArrayD
        }
        if (sumArray_all[sliderNumber] == undefined) {
            pageIndex += 1;
            getJson('wite', 'wite');//指定页请求
            return;
        }
        //-------------------------------------------------------------------------------结束
        BroadcastPace(sliderNumber);
    }

};
//预请求判断
function playJudgeGetData() {
    if (sliderNumber == (count - pageSize / 2)) {
        //当前页是否为最后一页
        if (pageIndex < sumPage) {
            pageIndexGetData = (pageIndex + 1);
            getJson('getData');//下一页

        }
    }

};
function playJudge_standLine(index) {
    layer.closeAll();
    if (index && SumarryStandardLine[standardline_sildeNumber_poleIndex].length <= 0) {
        getStandardLineJson(index, 'dontMove');//请求下一段    从index开始 
        standardline_sildeNumber_eachOne = 0;
        return;
    }

    if (standardline_sildeNumber_poleIndex == standardline_halfNumber && standardline_sildeNumber_eachOne == 0) {
        getStandardLineJson(standardline_sildeNumber_poleIndex_ready, 'moreStandardLineJson')
    }

    if (standardline_sildeNumber_eachOne >= SumarryStandardLine[standardline_sildeNumber_poleIndex].length - 1) {//帧号是当前杆最后一帧
        if (standardline_sildeNumber_poleIndex >= standardline_sildeNumber_poleIndex_sum) {//当前杆是否为最后一杆
            Ispaly = false;
            //播放一帧
            BroadcastPace_stdanradlin(standardline_sildeNumber_poleIndex, standardline_sildeNumber_eachOne)

            clearTimeout(t);
        } else if (standardline_sildeNumber_poleIndex >= standardline_sildeNumber_poleIndex_ready) {
            standardline_sildeNumber_poleIndex++;
            getStandardLineJson(standardline_sildeNumber_poleIndex);//请求下一段     有数据的一百杆
            standardline_sildeNumber_eachOne = 0;

        } else {
            standardline_sildeNumber_poleIndex++;//下一杆
            if (SumarryStandardLine[standardline_sildeNumber_poleIndex].length > 0) {
                standardline_sildeNumber_eachOne = 0;
                BroadcastPace_stdanradlin(standardline_sildeNumber_poleIndex, standardline_sildeNumber_eachOne)
            } else {
                playJudge_standLine();//又进入判断
            }
        }
    } else {
        //播放一帧
        BroadcastPace_stdanradlin(standardline_sildeNumber_poleIndex, standardline_sildeNumber_eachOne)

    }


}

//标准线路播放一帧
function BroadcastPace_stdanradlin(poleIndex, sildeNumber_eachOne) {

    //slider.slider("value", poleIndex);
    doHtml_stdanradlin(poleIndex, sildeNumber_eachOne);//页面操作;
    //if (!ehcartsClick) {
    //    addMychartData_stdanradlin(SumarryStandardLine[standardline_sildeNumber_poleIndex], sildeNumber_eachOne)
    //}

}
//dom操作  标准线
function doHtml_stdanradlin(poleIndex, sildeNumber_eachOne) {
    if (SumarryStandardLine[poleIndex][sildeNumber_eachOne] != undefined) {
        dohtmlForline(poleIndex, sildeNumber_eachOne)
    } else {
        layer.msg('暂无数据！')
        setTimeout(function () {
            $('#F,#RED,#HD,#OVER,#FZ').attr({
                'src': 'img/bg.jpg'
            });
        }, 100)

    }


}

//dom 标准线提取公用
function dohtmlForline(poleIndex, sliderNumber) {
    if ($('.LineInspection_details_inside_linePolling').is(':visible')) {
        $('.Details_list_play').click()//隐藏检测列表
    }
    if (!$('.IR_alert').is(':hidden')) {
        $('.closse_A').click();//隐藏温度检测
    }
    slider.slider("value", poleIndex);
    if (!ehcartsClick && nowSlideNumber_Forline[1] != parseInt(sliderNumber) || parseInt(sliderNumber) == 0) {
        addMychartData_stdanradlin(SumarryStandardLine[standardline_sildeNumber_poleIndex], sliderNumber)
    }
    if (SumarryStandardLine[poleIndex][sliderNumber] != undefined) {


        nowSlideNumber_Forline = [parseInt(poleIndex), parseInt(sliderNumber)];
        console.log(nowSlideNumber_Forline)
        var sumArray_all = SumarryStandardLine[poleIndex];
        var OV_OFFSET = 0;
        var VI_OFFSET = 0;
        var AUX_OFFSET = 0;
        if (sumArray_all[sliderNumber].OV_OFFSET != '') {
            OV_OFFSET = sumArray_all[sliderNumber].OV_OFFSET;
        }
        if (sumArray_all[sliderNumber].VI_OFFSET != '') {
            VI_OFFSET = sumArray_all[sliderNumber].VI_OFFSET;
        }
        if (sumArray_all[sliderNumber].AUX_OFFSET != '') {
            AUX_OFFSET = sumArray_all[sliderNumber].AUX_OFFSET;
        }

        var url_IR = 'http://' + queryIP_IRV + '/3CDataProvider/GetImgData?file=' + sumArray_all[sliderNumber].FILEPATH_IRV + '&type=GetIrvImgData' + '&size=' + imgSize + '&locomotive=' + sumArray_all[sliderNumber].LOCOMOTIVE_CODE + '&sessionID=' + sessionID + '&imgIdx=' + sumArray_all[sliderNumber].IRV_IDX + '&autoExposure=' + autoExposure + '&forward=' + forward;
        var url_VI = 'http://' + queryIP_VI + '/3CDataProvider/GetImgData?file=' + sumArray_all[sliderNumber].FILEPATH_VI + '&type=GetViImgData' + '&size=' + imgSize + '&locomotive=' + sumArray_all[sliderNumber].LOCOMOTIVE_CODE + '&sessionID=' + sessionID + '&imgIdx=' + (parseInt(sumArray_all[sliderNumber].VI_IDX) + alarm_vi_Offset + parseInt(VI_OFFSET)) + '&autoExposure=' + autoExposure + '&forward=' + forward;
        var url_OA = 'http://' + queryIP_OV + '/3CDataProvider/GetImgData?file=' + sumArray_all[sliderNumber].FILEPATH_OV + '&type=GetMv3ImgData' + '&size=' + imgSize + '&locomotive=' + sumArray_all[sliderNumber].LOCOMOTIVE_CODE + '&sessionID=' + sessionID + '&imgIdx=' + (parseInt(sumArray_all[sliderNumber].OV_IDX) + alarm_ov_Offset + parseInt(OV_OFFSET)) + '&autoExposure=' + autoExposure + '&forward=' + forward;
        var url_FZ = 'http://' + queryIP_AUX + '/3CDataProvider/GetImgData?file=' + sumArray_all[sliderNumber].FILEPATH_AUX + '&type=GetAuxImgData' + '&size=' + imgSize + '&locomotive=' + sumArray_all[sliderNumber].LOCOMOTIVE_CODE + '&sessionID=' + sessionID + '&imgIdx=' + (parseInt(sumArray_all[sliderNumber].AUX_IDX) + parseInt(AUX_OFFSET)) + '&autoExposure=' + autoExposure + '&forward=' + forward;


        var f = $('#F').data('elevateZoom');
        CompleteImgNum = 4 - img_RED - img_HD - img_OA - img_FZ;

        if (img_RED == 1) {
            preLoadImg(sliderNumber, url_IR, $('#RED'))
        } else {
            RED = true;
        }
        if (img_FZ == 1) {
            preLoadImg(sliderNumber, url_FZ, $('#FZ'))
        } else {
            FZ = true;
        }
        switch (bigIMG) {
            case 'OVER':
                if (img_HD == 1) {
                    preLoadImg(sliderNumber, url_VI, $('#HD'), 'small')
                } else {
                    HD = true;
                }
                if (img_OA == 1) {
                    preLoadImg(sliderNumber, url_OA, $('#OVER'))
                } else {
                    OVER = true;
                }

                preLoadImg(sliderNumber, url_OA, $('#F'))

                var imgurl = url_OA;
                if (bigGlass) {
                    $('.zoomContainer').css('display', 'block');
                    f.swaptheimage(imgurl, imgurl);
                    f.changeState('enable');
                    f.showHideWindow('show');
                } else {
                    f.changeState('disable');
                    f.showHideWindow('hide');
                    $('.zoomContainer').css('display', 'none');
                };
                break;
            case 'HD':
                if (img_HD == 1) {
                    preLoadImg(sliderNumber, url_VI, $('#HD'))
                } else {
                    HD = true;
                }
                if (img_OA == 1) {
                    preLoadImg(sliderNumber, url_OA, $('#OVER'), 'small')
                } else {
                    OVER = true;
                }
                preLoadImg(sliderNumber, url_VI, $('#F'));

                var imgurl = url_VI;
                if (bigGlass) {
                    $('.zoomContainer').css('display', 'block');
                    f.swaptheimage(imgurl, imgurl);
                    f.changeState('enable');
                    f.showHideWindow('show');
                } else {
                    f.changeState('disable');
                    f.showHideWindow('hide');
                    $('.zoomContainer').css('display', 'none');

                };
                break;
            case 'DLV':
                if (img_HD == 1) {
                    preLoadImg(sliderNumber, url_VI, $('#HD'), 'small')
                } else {
                    HD = true;
                }
                if (img_OA == 1) {
                    preLoadImg(sliderNumber, url_OA, $('#OVER'), 'small')
                } else {
                    OVER = true;
                }
                preLoadImg(sliderNumber, url_IR, $('#F'));

                f.showHideWindow('hide');
                $('.zoomContainer').css('display', 'none');
                break;
            case 'FZ':
                if (img_HD == 1) {
                    preLoadImg(sliderNumber, url_VI, $('#HD'), 'small')
                } else {
                    HD = true;
                }
                if (img_OA == 1) {
                    preLoadImg(sliderNumber, url_OA, $('#OVER'), 'small')
                } else {
                    OVER = true;
                }
                preLoadImg(sliderNumber, url_FZ, $('#F'));

                f.showHideWindow('hide');
                $('.zoomContainer').css('display', 'none');
        }

        //if (sumArray_all[sliderNumber].TIMESTAMP_IRV==)
        //$('#alarm_Table_content tr').removeClass('now_alarm')//清除播放过的报警
        //var GEO_STATUS = '（单目识别）';
        //if (sumArray_all[sliderNumber].GEO_STATUS == 'done') {
        //    GEO_STATUS = '（双目识别）';
        //}
        $('#alarm_Table_content').find("tr[tmcode='" + sumArray_all[sliderNumber].TIMESTAMP_IRV + "']").addClass('now_alarm')
        var location = sumArray_all[sliderNumber].LINE_NAME + '&nbsp;' + sumArray_all[sliderNumber].POSITION_NAME + '&nbsp;' + sumArray_all[sliderNumber].BRG_TUN_NAME + sumArray_all[sliderNumber].DIRECTION + '&nbsp;' + (sumArray_all[sliderNumber].KM == '-1' || '0' ? '' : sumArray_all[sliderNumber].KM) + '&nbsp;' + (sumArray_all[sliderNumber].POLE_NUMBER == '' ? '' : sumArray_all[sliderNumber].POLE_NUMBER + '支柱');
        $('#location').html(location);
        if (sumArray_all[sliderNumber].BUREAU_NAME == '' && sumArray_all[sliderNumber].ORG_NAME == '') {
            $('.forLine').html('<img src="img/standrandLineLog.png" /> <span style="color:#41D0F4;display: inline-block;border-bottom: 2px solid #41D0F4;height: 52px;;">标准线路</span>——' + sumArray_all[sliderNumber].LINE_NAME + '&nbsp;' + sumArray_all[sliderNumber].DIRECTION)//标准线title
        } else {
            $('.forLine').html('<img src="img/standrandLineLog.png" /> <span style="color:#41D0F4;display: inline-block;border-bottom: 2px solid #41D0F4;height: 52px;;">标准线路</span>——' + sumArray_all[sliderNumber].LINE_NAME + '&nbsp;' + sumArray_all[sliderNumber].DIRECTION + '&nbsp;(' + sumArray_all[sliderNumber].BUREAU_NAME + '&nbsp;' + sumArray_all[sliderNumber].ORG_NAME + ')')//标准线title
        }

        $('#timer').html(sumArray_all[sliderNumber].time);
        $('#deviceID').html(sumArray_all[sliderNumber].LOCOMOTIVE_CODE);
        $('#bowLocation').html(sumArray_all[sliderNumber].BOW_POSITION_NAME);
        sumArray_all[sliderNumber].N_HIGH == '-1000' ? $('#topValue').html('') : $('#topValue').html(sumArray_all[sliderNumber].N_HIGH == '' ? '' : (sumArray_all[sliderNumber].N_HIGH + 'mm'));
        sumArray_all[sliderNumber].N_STAGGER == '-1000' ? $('#outValue').html('') : $('#outValue').html(sumArray_all[sliderNumber].N_STAGGER == '' ? '' : (sumArray_all[sliderNumber].N_STAGGER + 'mm'));
        sumArray_all[sliderNumber].N_IRV_TEMP == '-1000' ? $('#tempe').html('') : $('#tempe').html(sumArray_all[sliderNumber].N_IRV_TEMP == '' ? '' : (sumArray_all[sliderNumber].N_IRV_TEMP + '℃'));
        $('#carSpeed').html(sumArray_all[sliderNumber].N_SPEED == '' ? '' : sumArray_all[sliderNumber].N_SPEED + 'km/h');


        $('#_Content_Sta_Lab').html(location + '&ensp;&ensp;');


        $('#_Content_Pecent_Lab').html((poleIndex + 1) + '/' + (standardline_sildeNumber_poleIndex_sum + 1))

        if ($('#_Content_Sta_Lab').html().length + $('#_Content_Pecent_Lab').html().length - 24 > 33 && $(window).width() >= 1900) {
            $('#_Content_Sta_Lab').append('<br/>');
        }
        //$('#_Content_Pecent_Lab').html();
        if (forward == '1') {//重置图片拖动参数为正常
            forward = '0';
        }
    }
}

//曲线for线路标准
function addMychartData_stdanradlin(sumArray_all, sliderNumber) {
    if (play_direction_cahrtClear == 0) {
        clearEcharts();
    }
    if (sumArray_all[sliderNumber] != undefined) {
        //console.log(option3.xAxis.data)
        if (option1.series.data.length > 10) {
            option1.series.data.splice(0, 1);
            option2.series.data.splice(0, 1);
            option3.series.data.splice(0, 1);
            option1.xAxis.data.splice(0, 1);
            option2.xAxis.data.splice(0, 1);
            option3.xAxis.data.splice(0, 1);
        }
        option1.series.data.push(sumArray_all[sliderNumber].N_IRV_TEMP);
        if (sumArray_all[sliderNumber].PVALUE == '-1000') {
            option2.series.data.push('');
        } else {
            option2.series.data.push(sumArray_all[sliderNumber].N_STAGGER);
        }
        //option2.series.data.push(sumArray_all[sliderNumber].PVALUE);
        if (sumArray_all[sliderNumber].HVALUE == '-1000') {
            option3.series.data.push('');
        } else {
            option3.series.data.push(sumArray_all[sliderNumber].N_HIGH);
        }

        option1.xAxis.data.push(sliderNumber + 1);
        option2.xAxis.data.push(sliderNumber + 1);
        option3.xAxis.data.push(sliderNumber + 1);
        myChart1.setOption(option1);
        myChart2.setOption(option2);
        myChart3.setOption(option3);
        play_direction_cahrtClear++;
        //另一种方法  暂时不行
        //myChart1.setOption({
        //    xAxis: {
        //        data: sliderNumber
        //    },
        //    series: [{
        //        // 根据名字对应到相应的系列
        //        name: '温度',
        //        data: sumArrayA[sliderNumber].MXIRTEMP
        //    }]

        //})

    };


}



//dom操作
function doHtml(sliderNumber, isOffset) {
    var sumArray_all = [];
    if (AB_SURFACE == 'A') {
        sumArray_all = sumArrayA
    } else if (AB_SURFACE == 'B') {
        sumArray_all = sumArrayB
    } else if (AB_SURFACE == 'C') {
        sumArray_all = sumArrayC
    } else if (AB_SURFACE == 'D') {
        sumArray_all = sumArrayD
    }
    nowSlideNumber = sliderNumber;//对外当前播放进度
    if ($('.LineInspection_details_inside_linePolling').is(':visible')) {
        //getLininspctionList()//刷新巡检列表
        $('.Details_list_play').click()//隐藏检测列表
    }
    if (isOffset == 'true') {
        //调整偏移判断
    }

    if (sumArray_all[sliderNumber] != undefined) {
        var OV_OFFSET = 0;
        var VI_OFFSET = 0;
        var AUX_OFFSET = 0;
        if (sumArray_all[sliderNumber].OV_OFFSET != '') {
            OV_OFFSET = sumArray_all[sliderNumber].OV_OFFSET;
        }
        if (sumArray_all[sliderNumber].VI_OFFSET != '') {
            VI_OFFSET = sumArray_all[sliderNumber].VI_OFFSET;
        }
        if (sumArray_all[sliderNumber].AUX_OFFSET != '') {
            AUX_OFFSET = sumArray_all[sliderNumber].AUX_OFFSET;
        }

        var url_IR = 'http://' + queryIP_IRV + '/3CDataProvider/GetImgData?file=' + sumArray_all[sliderNumber].FILEPATH_IRV + '&type=GetIrvImgData' + '&size=' + imgSize + '&locomotive=' + sumArray_all[sliderNumber].LOCOMOTIVE_CODE + '&sessionID=' + sessionID + '&imgIdx=' + sumArray_all[sliderNumber].IRV_IDX + '&autoExposure=' + autoExposure + '&forward=' + forward;
        var url_VI = 'http://' + queryIP_VI + '/3CDataProvider/GetImgData?file=' + sumArray_all[sliderNumber].FILEPATH_VI + '&type=GetViImgData' + '&size=' + imgSize + '&locomotive=' + sumArray_all[sliderNumber].LOCOMOTIVE_CODE + '&sessionID=' + sessionID + '&imgIdx=' + (parseInt(sumArray_all[sliderNumber].VI_IDX) + alarm_vi_Offset + parseInt(VI_OFFSET)) + '&autoExposure=' + autoExposure + '&forward=' + forward;
        var url_OA = 'http://' + queryIP_OV + '/3CDataProvider/GetImgData?file=' + sumArray_all[sliderNumber].FILEPATH_OV + '&type=GetMv3ImgData' + '&size=' + imgSize + '&locomotive=' + sumArray_all[sliderNumber].LOCOMOTIVE_CODE + '&sessionID=' + sessionID + '&imgIdx=' + (parseInt(sumArray_all[sliderNumber].OV_IDX) + alarm_ov_Offset + parseInt(OV_OFFSET)) + '&autoExposure=' + autoExposure + '&forward=' + forward;
        var url_FZ = 'http://' + queryIP_AUX + '/3CDataProvider/GetImgData?file=' + sumArray_all[sliderNumber].FILEPATH_AUX + '&type=GetAuxImgData' + '&size=' + imgSize + '&locomotive=' + sumArray_all[sliderNumber].LOCOMOTIVE_CODE + '&sessionID=' + sessionID + '&imgIdx=' + (parseInt(sumArray_all[sliderNumber].AUX_IDX) + parseInt(AUX_OFFSET)) + '&autoExposure=' + autoExposure + '&forward=' + forward;
        //if (imgreadyNumber <= (sliderNumber + 1)) {
        //    imgreadyNumber = sliderNumber + 2;
        //    for (var i = 0; i < 4; i++) {
        //        var imgurl = 'http://' + queryIP + '/3CDataProvider/GetImgData?file=' + sumArray_all[sliderNumber + i].FILEPATH_IRV + '&type=GetIrvImgData' + '&size=' + imgSize + '&locomotive=' + sumArray_all[sliderNumber + i].LOCOMOTIVE_CODE + '&sessionID=' + sessionID + '&imgIdx=' + sumArray_all[sliderNumber + i].IRV_IDX + '&autoExposure=' + autoExposure;
        //        LoadImg(imgurl);
        //    }
        //}
        var f = $('#F').data('elevateZoom');
        CompleteImgNum = 4 - img_RED - img_HD - img_OA - img_FZ;

        if (img_RED == 1) {
            preLoadImg(sliderNumber, url_IR, $('#RED'))
        } else {
            RED = true;
        }
        if (img_FZ == 1) {
            preLoadImg(sliderNumber, url_FZ, $('#FZ'))
        } else {
            FZ = true;
        }
        switch (bigIMG) {
            case 'OVER':
                if (img_HD == 1) {
                    preLoadImg(sliderNumber, url_VI, $('#HD'), 'small')
                } else {
                    HD = true;
                }
                if (img_OA == 1) {
                    preLoadImg(sliderNumber, url_OA, $('#OVER'))
                } else {
                    OVER = true;
                }

                preLoadImg(sliderNumber, url_OA, $('#F'))

                var imgurl = url_OA;
                if (bigGlass) {
                    $('.zoomContainer').css('display', 'block');
                    f.swaptheimage(imgurl, imgurl);
                    f.changeState('enable');
                    f.showHideWindow('show');
                } else {
                    f.changeState('disable');
                    f.showHideWindow('hide');
                    $('.zoomContainer').css('display', 'none');
                };
                break;
            case 'HD':
                if (img_HD == 1) {
                    preLoadImg(sliderNumber, url_VI, $('#HD'))
                } else {
                    HD = true;
                }
                if (img_OA == 1) {
                    preLoadImg(sliderNumber, url_OA, $('#OVER'), 'small')
                } else {
                    OVER = true;
                }
                preLoadImg(sliderNumber, url_VI, $('#F'));

                var imgurl = url_VI;
                if (bigGlass) {
                    $('.zoomContainer').css('display', 'block');
                    f.swaptheimage(imgurl, imgurl);
                    f.changeState('enable');
                    f.showHideWindow('show');
                } else {
                    f.changeState('disable');
                    f.showHideWindow('hide');
                    $('.zoomContainer').css('display', 'none');

                };
                break;
            case 'DLV':
                if (img_HD == 1) {
                    preLoadImg(sliderNumber, url_VI, $('#HD'), 'small')
                } else {
                    HD = true;
                }
                if (img_OA == 1) {
                    preLoadImg(sliderNumber, url_OA, $('#OVER'), 'small')
                } else {
                    OVER = true;
                }
                preLoadImg(sliderNumber, url_IR, $('#F'));

                f.showHideWindow('hide');
                $('.zoomContainer').css('display', 'none');
                break;
            case 'FZ':
                if (img_HD == 1) {
                    preLoadImg(sliderNumber, url_VI, $('#HD'), 'small')
                } else {
                    HD = true;
                }
                if (img_OA == 1) {
                    preLoadImg(sliderNumber, url_OA, $('#OVER'), 'small')
                } else {
                    OVER = true;
                }
                preLoadImg(sliderNumber, url_FZ, $('#F'));

                f.showHideWindow('hide');
                $('.zoomContainer').css('display', 'none');
        }

        //if (sumArray_all[sliderNumber].TIMESTAMP_IRV==)
        //$('#alarm_Table_content tr').removeClass('now_alarm')//清除播放过的报警
        //var GEO_STATUS = '（单目识别）';
        //if (sumArray_all[sliderNumber].GEO_STATUS == 'done') {
        //    GEO_STATUS = '（双目识别）';
        //}
        var GEO_STATUS = '';
        $('#alarm_Table_content').find("tr[tmcode='" + sumArray_all[sliderNumber].TIMESTAMP_IRV + "']").addClass('now_alarm')
        var location = sumArray_all[sliderNumber].LINE_NAME + '&nbsp;' + sumArray_all[sliderNumber].POSITION_NAME + '&nbsp;' + sumArray_all[sliderNumber].BRG_TUN_NAME + sumArray_all[sliderNumber].DIRECTION + '&nbsp;' + (sumArray_all[sliderNumber].KM == '-1' || '0' ? '' : sumArray_all[sliderNumber].KM) + '&nbsp;' + (sumArray_all[sliderNumber].POLE_NUMBER == '' ? '' : sumArray_all[sliderNumber].POLE_NUMBER + '支柱');
        $('#location').html(location);
        $('#timer').html(sumArray_all[sliderNumber].time);
        $('#deviceID').html(sumArray_all[sliderNumber].LOCOMOTIVE_CODE);
        $('#bowLocation').html(sumArray_all[sliderNumber].BOW_POSITION_NAME);
        sumArray_all[sliderNumber].N_HIGH == '-1000' ? $('#topValue').html('') : $('#topValue').html(sumArray_all[sliderNumber].N_HIGH == '' ? '' : (sumArray_all[sliderNumber].N_HIGH + 'mm' + GEO_STATUS));
        sumArray_all[sliderNumber].N_STAGGER == '-1000' ? $('#outValue').html('') : $('#outValue').html(sumArray_all[sliderNumber].N_STAGGER == '' ? '' : (sumArray_all[sliderNumber].N_STAGGER + 'mm' + GEO_STATUS));
        sumArray_all[sliderNumber].N_IRV_TEMP == '-1000' ? $('#tempe').html('') : $('#tempe').html(sumArray_all[sliderNumber].N_IRV_TEMP == '' ? '' : (sumArray_all[sliderNumber].N_IRV_TEMP + '℃'));
        $('#carSpeed').html(sumArray_all[sliderNumber].N_SPEED == '' ? '' : sumArray_all[sliderNumber].N_SPEED + 'km/h');


        $('#_Content_Sta_Lab').html(location + '&ensp;&ensp;');

        if (Sumcount == 0) {
            $('#_Content_Pecent_Lab').html((sliderNumber + 1) + '/' + (Sumcount + 1))
        } else {
            $('#_Content_Pecent_Lab').html((sliderNumber + 1) + '/' + (Sumcount))
        }
        if ($('#_Content_Sta_Lab').html().length + $('#_Content_Pecent_Lab').html().length - 24 > 33) {
            $('#_Content_Sta_Lab').append('<br/>');
        }
        //$('#_Content_Pecent_Lab').html();
        if (forward == '1') {//重置图片拖动参数为正常
            forward = '0';
        }
    } else {
        layer.msg('暂无数据！')
        setTimeout(function () {
            $('#F,#RED,#HD,#OVER,#FZ').attr({
                'src': 'img/bg.jpg'
            });
        }, 100)

    }

};

//播放进度条 
function Setslider(count) {
    slider = $("#Sms_slider").slider({
        range: "min",
        value: sliderNumber,
        min: 0,
        max: count - 1,
        slide: function (event, ui) {
            if (startForPush) {
                clearEcharts();
                startForPush = false;
                clearTimeout(t)
                var last_Ispaly_stadus = Ispaly;
                Ispaly = false;
                $('.show_loading').show();
                setTimeout(function () { $('.show_loading').show(); }, 100);
                //layer.msg('加载中...', { time: 0 })
                if (Sumcount == 0) {
                    $('#_Content_Pecent_Lab').html((ui.value + 1) + '/' + (Sumcount + 1))
                } else {
                    $('#_Content_Pecent_Lab').html((ui.value + 1) + '/' + (Sumcount))
                }
                is_MoveSilde = true;
                forward = '1';//拖动
                //change = true;//拖动状态
                pageIndex = parseInt(ui.value / pageSize) + 1;//根据进度位置计算所在页
                //console.log(pageIndex)
                getJson('slider', ui.value, last_Ispaly_stadus);


                //BroadcastPace(sliderNumber);

                //console.log(sliderNumber)
            } else { return; }
        }
    });
};

//播放进度条 标准线
function SetsliderStandLine(count) {
    slider = $("#Sms_slider").slider({
        range: "min",
        value: standardline_sildeNumber_poleIndex,
        min: 0,
        max: count,
        slide: function (event, ui) {
            clearEcharts();
            $('.show_loading').show();
            setTimeout(function () { $('.show_loading').show(); }, 100);
            var last_Ispaly_stadus = Ispaly;//点击前状态
            Ispaly = false;
            forward = '1';//拖动
            //layer.msg('加载中...', { time: 0 })
            $('#_Content_Pecent_Lab').html(ui.value + '/' + count)
            //standardline_sildeNumber_poleIndex = ui.value; //当前帧数
            getStandardLineJson(ui.value, 'slider', last_Ispaly_stadus);

        }
    });
};
//echarts 实例化

function createLineChart() {

    myChart1 = echarts.init(document.getElementById('main1'));
    myChart2 = echarts.init(document.getElementById('main2'));
    myChart3 = echarts.init(document.getElementById('main3'));
    var sumArray_all = [];
    if (AB_SURFACE == 'A') {
        sumArray_all = sumArrayA
    } else if (AB_SURFACE == 'B') {
        sumArray_all = sumArrayB
    } else if (AB_SURFACE == 'C') {
        sumArray_all = sumArrayC
    } else if (AB_SURFACE == 'D') {
        sumArray_all = sumArrayD
    }
    var xTitle = [];//X轴
    option1 = {

        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                var res;
                //console.log(params[0])
                if (params[0].name == '') {
                    params[0].name = 0
                }

                if (sumArray_all[params[0].name].POLE_NUMBER == undefined) {
                    res = '';
                } else {
                    res = sumArray_all[params[0].name].POLE_NUMBER + '号杆<br/>'
                }
                res += params[0].seriesName + ':' + params[0].data + '℃';

                return res;

            }

        },
        dataZoom: [{
            type: 'inside',
            show: true,
            realtime: true,
            start: 0,
            end: 100,
            xAxisIndex: 0
        }, {
            start: 0,
            end: 100,
            show: false,
        }],
        grid: {
            y: '35',
            y2: '10',
            x: '40',
            x2: '10',
            borderColor: 'black'
        },
        xAxis:
        {
            type: 'category',
            axisLabel: {
                show: false
            },
            splitLine: {
                show: false
            },
            axisLine: {
                show: false
            },
            data: []
        }
        ,
        yAxis: [
    {
        axisLine: {
            show: true, lineStyle: {
                color: 'white', width: 0
            }
        },
        axisLabel: {
            textStyle: {
                color: 'white'
            }
        },
        type: 'value',
        splitLine: {
            show: true, lineStyle: {
                type: 'dashed'
            }
        },
        name: '红外温度(℃)',

    }
        ],
        series:
    {
        name: '红外温度',
        type: 'line',
        symbolSize: 4,
        hoverAnimation: true,
        data: []


    }
    };

    option2 = {

        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                var res;
                //console.log(params[0])
                if (params[0].name == '') {
                    params[0].name = 0
                }

                if (sumArray_all[params[0].name].POLE_NUMBER == undefined) {
                    res = '';
                } else {
                    res = sumArray_all[params[0].name].POLE_NUMBER + '号杆<br/>'
                }
                res += params[0].seriesName + ':' + params[0].data + 'mm';

                return res;

            }

        },
        grid: {
            y: '35',
            y2: '10',
            x: '40',
            x2: '10',
            borderColor: 'black'
        },
        dataZoom: [{
            type: 'inside',
            show: true,
            realtime: true,
            start: 0,
            end: 100,
            xAxisIndex: 0
        }, {
            start: 0,
            end: 100,
            show: false,
        }],
        xAxis:
        {
            type: 'category',
            axisLabel: {
                show: false
            },
            splitLine: {
                show: false
            },
            axisLine: {
                show: false
            },
            data: []
        }
    ,
        yAxis:
    {
        axisLine: {
            show: true, lineStyle: {
                color: 'white', width: 0
            }
        },
        axisLabel: {
            textStyle: {
                color: 'white'
            }
        },
        type: 'value',
        splitLine: {
            show: true, lineStyle: {
                type: 'dashed'
            }
        },
        name: '拉出值(mm)',

    }
    ,
        series:
    {
        name: '拉出值',
        type: 'line',
        symbolSize: 4,
        hoverAnimation: true,
        data: []


    }
    };

    option3 = {

        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                var res;
                if (params[0].name == '') {
                    params[0].name = 0
                }
                //console.log(params[0])

                if (sumArray_all[params[0].name].POLE_NUMBER == undefined) {
                    res = '';
                } else {
                    res = sumArray_all[params[0].name].POLE_NUMBER + '号杆<br/>'
                }
                res += params[0].seriesName + ':' + params[0].data + 'mm';

                return res;
            }
        },
        dataZoom: [{
            type: 'inside',
            realtime: true,
            start: 0,
            end: 100,
            xAxisIndex: 0
        }, {
            start: 0,
            end: 100, height: 20, x: 80, y: 3,
            color: 'red',
            show: false,
        }]
           ,
        grid: {
            y: '35',
            y2: '25',
            x: '45',
            x2: '10',
            borderColor: 'black'
        },
        xAxis:
{
    type: 'category',
    axisLabel: {
        show: true, textStyle: {
            color: 'white'
        }
    },
    splitLine: {
        show: false
    },
    axisTick: {
        inside: false, onGap: false
    },
    boundaryGap: true,
    data: []
},

        yAxis:
        {
            name: '导高值(mm)',
            axisLine: {
                show: true, lineStyle: {
                    color: 'white', width: 0
                }
            },
            axisLabel: {
                textStyle: {
                    color: 'white'
                }
            },
            type: 'value',
            splitLine: {
                show: true, lineStyle: {
                    type: 'dashed'
                }
            },
            boundaryGap: [0, '100%'],

            max: 7000,
            min: 5000,
            scale: true,

        }
            ,
        series:
    {
        name: '导高值',
        type: 'line',
        symbolSize: 4,
        hoverAnimation: true,
        data: []

    }
    };



    //实例化
    myChart1.setOption(option1);
    myChart2.setOption(option2);
    myChart3.setOption(option3);
    echarts.connect([myChart1, myChart2, myChart3]);
    myChart1.on('click', function (params) {
        eConsole(params)
    })
    myChart2.on('click', function (params) {
        eConsole(params)
    })
    myChart3.on('click', function (params) {
        eConsole(params)
    })

};
//标准线 echarts
function createLineChartForStanarndlin(sumArray_all) {
    myChart1 = echarts.init(document.getElementById('main1'));
    myChart2 = echarts.init(document.getElementById('main2'));
    myChart3 = echarts.init(document.getElementById('main3'));
    var xTitle = [];//X轴
    option1 = {

        tooltip: {
            trigger: 'axis',
            //formatter: function (params) {
            //    var res;
            //    //console.log(params[0])
            //    if (params[0].name == '') {
            //        params[0].name = 0
            //    }

            //    if (sumArray_all[params[0].name].POLE_NUMBER == undefined) {
            //        res = '';
            //    } else {
            //        res = sumArray_all[params[0].name].POLE_NUMBER + '号杆<br/>'
            //    }
            //    res += params[0].seriesName + ':' + params[0].data + '℃';

            //    return res;

            //}

        },
        dataZoom: [{
            type: 'inside',
            show: true,
            realtime: true,
            start: 0,
            end: 100,
            xAxisIndex: 0
        }, {
            start: 0,
            end: 100,
            show: false,
        }],
        grid: {
            y: '35',
            y2: '10',
            x: '40',
            x2: '10',
            borderColor: 'black'
        },
        xAxis:
        {
            type: 'category',
            axisLabel: {
                show: false
            },
            splitLine: {
                show: false
            },
            axisLine: {
                show: false
            },
            data: []
        }
        ,
        yAxis: [
    {
        axisLine: {
            show: true, lineStyle: {
                color: 'white', width: 0
            }
        },
        axisLabel: {
            textStyle: {
                color: 'white'
            }
        },
        type: 'value',
        splitLine: {
            show: true, lineStyle: {
                type: 'dashed'
            }
        },
        name: '红外温度(℃)',

    }
        ],
        series:
    {
        name: '红外温度',
        type: 'line',
        symbolSize: 4,
        hoverAnimation: true,
        data: []


    }
    };

    option2 = {

        tooltip: {
            trigger: 'axis',
            //formatter: function (params) {
            //    var res;
            //    //console.log(params[0])
            //    if (params[0].name == '') {
            //        params[0].name = 0
            //    }

            //    if (sumArray_all[params[0].name].POLE_NUMBER == undefined) {
            //        res = '';
            //    } else {
            //        res = sumArray_all[params[0].name].POLE_NUMBER + '号杆<br/>'
            //    }
            //    res += params[0].seriesName + ':' + params[0].data + 'mm';

            //    return res;

            //}

        },
        grid: {
            y: '35',
            y2: '10',
            x: '40',
            x2: '10',
            borderColor: 'black'
        },
        dataZoom: [{
            type: 'inside',
            show: true,
            realtime: true,
            start: 0,
            end: 100,
            xAxisIndex: 0
        }, {
            start: 0,
            end: 100,
            show: false,
        }],
        xAxis:
        {
            type: 'category',
            axisLabel: {
                show: false
            },
            splitLine: {
                show: false
            },
            axisLine: {
                show: false
            },
            data: []
        }
    ,
        yAxis:
    {
        axisLine: {
            show: true, lineStyle: {
                color: 'white', width: 0
            }
        },
        axisLabel: {
            textStyle: {
                color: 'white'
            }
        },
        type: 'value',
        splitLine: {
            show: true, lineStyle: {
                type: 'dashed'
            }
        },
        name: '拉出值(mm)',

    }
    ,
        series:
    {
        name: '拉出值',
        type: 'line',
        symbolSize: 4,
        hoverAnimation: true,
        data: []


    }
    };

    option3 = {

        tooltip: {
            trigger: 'axis',
            //formatter: function (params) {
            //    var res;
            //    if (params[0].name == '') {
            //        params[0].name = 0
            //    }
            //    //console.log(params[0])

            //    if (sumArray_all[params[0].name].POLE_NUMBER == undefined) {
            //        res = '';
            //    } else {
            //        res = sumArray_all[params[0].name].POLE_NUMBER + '号杆<br/>'
            //    }
            //    res += params[0].seriesName + ':' + params[0].data + 'mm';

            //    return res;
            //}
        },
        dataZoom: [{
            type: 'inside',
            realtime: true,
            start: 0,
            end: 100,
            xAxisIndex: 0
        }, {
            start: 0,
            end: 100, height: 20, x: 80, y: 3,
            color: 'red',
            show: false,
        }]
           ,
        grid: {
            y: '35',
            y2: '25',
            x: '45',
            x2: '10',
            borderColor: 'black'
        },
        xAxis:
{
    type: 'category',
    axisLabel: {
        show: true, textStyle: {
            color: 'white'
        }
    },
    splitLine: {
        show: false
    },
    axisTick: {
        inside: false, onGap: false
    },
    boundaryGap: true,
    data: []
},

        yAxis:
        {
            name: '导高值(mm)',
            axisLine: {
                show: true, lineStyle: {
                    color: 'white', width: 0
                }
            },
            axisLabel: {
                textStyle: {
                    color: 'white'
                }
            },
            type: 'value',
            splitLine: {
                show: true, lineStyle: {
                    type: 'dashed'
                }
            },
            boundaryGap: [0, '100%'],

            max: 7000,
            min: 5000,
            scale: true,

        }
            ,
        series:
    {
        name: '导高值',
        type: 'line',
        symbolSize: 4,
        hoverAnimation: true,
        data: []

    }
    };



    //实例化
    myChart1.setOption(option1);
    myChart2.setOption(option2);
    myChart3.setOption(option3);
    echarts.connect([myChart1, myChart2, myChart3]);

}
//点击事件执行的方法
function eConsole(params) {
    if (!alarm_enter) {
        Ispaly = false;
        ehcartsClick = true;
        //console.log(params.name)
        sliderNumber = params.name - 1;
        playJudge();

        ehcartsClick = false;
    }
}


function play(StandardLine) {
    clearTimeout(t);
    if (StandardLine == 'StandardLine' || isFromStandardLine == 'true') {
        imgReady_StandardLine();
    } else {
        imgReady();
    }
};


//播放进度控制
function BroadcastPace(sliderNumber) {
    if (!$('.IR_alert').is(':hidden')) {
        $('.closse_A').click();
    }
    slider.slider("value", sliderNumber);
    doHtml(sliderNumber);//页面操作;
    if (!ehcartsClick) {
        addMychartData(sliderNumber)
    }


};
//动态加入数据echarts
function addMychartData(sliderNumber) {
    if (play_direction_cahrtClear == 0) {
        clearEcharts();
    }
    //console.log(play_direction_cahrtClear)
    //option1.xAxis.data.push(sliderNumber);
    var sumArray_all = [];
    if (AB_SURFACE == 'A') {
        sumArray_all = sumArrayA
    } else if (AB_SURFACE == 'B') {
        sumArray_all = sumArrayB
    } else if (AB_SURFACE == 'C') {
        sumArray_all = sumArrayC
    } else if (AB_SURFACE == 'D') {
        sumArray_all = sumArrayD
    }

    if (sumArray_all[sliderNumber] != undefined) {
        //console.log(option3.xAxis.data)
        if (option1.series.data.length > 10) {
            option1.series.data.splice(0, 1);
            option2.series.data.splice(0, 1);
            option3.series.data.splice(0, 1);
            option1.xAxis.data.splice(0, 1);
            option2.xAxis.data.splice(0, 1);
            option3.xAxis.data.splice(0, 1);
        }
        option1.series.data.push(sumArray_all[sliderNumber].N_IRV_TEMP);
        if (sumArray_all[sliderNumber].PVALUE == '-1000') {
            option2.series.data.push('');
        } else {
            option2.series.data.push(sumArray_all[sliderNumber].N_STAGGER);
        }
        //option2.series.data.push(sumArray_all[sliderNumber].PVALUE);
        if (sumArray_all[sliderNumber].HVALUE == '-1000') {
            option3.series.data.push('');
        } else {
            option3.series.data.push(sumArray_all[sliderNumber].N_HIGH);
        }

        option1.xAxis.data.push(sliderNumber + 1);
        option2.xAxis.data.push(sliderNumber + 1);
        option3.xAxis.data.push(sliderNumber + 1);
        myChart1.setOption(option1);
        myChart2.setOption(option2);
        myChart3.setOption(option3);
        play_direction_cahrtClear++;
        //另一种方法  暂时不行
        //myChart1.setOption({
        //    xAxis: {
        //        data: sliderNumber
        //    },
        //    series: [{
        //        // 根据名字对应到相应的系列
        //        name: '温度',
        //        data: sumArrayA[sliderNumber].MXIRTEMP
        //    }]

        //})

    };
};


//图片加载完成播放下一帧
function imgReady() {

    t = setTimeout(function () {
        if (Ispaly) {
            $('#btn_pause').css('display', 'none');
            $('#btn_play').css('display', 'block');//播放
        } else {
            $('#btn_pause').css('display', 'block');
            $('#btn_play').css('display', 'none');// 暂停
        }
        if (CompleteImgNum >= 5 && RED && HD && OVER && FZ) {
            CompleteImgNum = 0;
            RED = false;
            HD = false;
            OVER = false;
            FZ = false;
            if (Ispaly) {
                is_MoveSilde = false;
                playJudgeGetData()
                playJudge();
                imgReady();
                sliderNumber++;

            } else {
                if (sliderNumber > 0 && !is_MoveSilde) {
                    sliderNumber--;
                }
            }
        } else {
            setTimeout(
               ' imgReady()'
            , time_speed);
        }

    }, time_speed)
};
function imgReady_StandardLine() {
    t = setTimeout(function () {
        if (Ispaly) {
            $('#btn_pause').css('display', 'none');
            $('#btn_play').css('display', 'block');//播放
        } else {
            $('#btn_pause').css('display', 'block');
            $('#btn_play').css('display', 'none');// 暂停
        }
        if (CompleteImgNum >= 5 && RED && HD && OVER && FZ) {
            CompleteImgNum = 0;
            RED = false;
            HD = false;
            OVER = false;
            FZ = false;
            if (Ispaly) {
                is_MoveSilde = false;
                playJudge_standLine();
                imgReady_StandardLine();
                standardline_sildeNumber_eachOne++;
            }
        } else {
            setTimeout(
               ' imgReady_StandardLine()'
            , time_speed);
        }

    }, time_speed)

}

//清空echarts
function clearEcharts() {
    option1.series.data = [];
    option2.series.data = [];
    option3.series.data = [];
    option1.xAxis.data = [];
    option2.xAxis.data = [];
    option3.xAxis.data = [];
    myChart1.clear();
    myChart2.clear();
    myChart3.clear();
};


//支柱列表请求
function queryPoleList(page, pole_nu) {
    var lineCode = $('#line_tree').attr('code');  //线路code
    if (lineCode == null || lineCode == 0 || lineCode == undefined) {
        lineCode = '';
    }
    var position = $('#LineTreeselect').attr('code');  //区间code
    if (position == null || position == 0 || position == undefined) {
        position = '';
    }
    var bridgetune = $('#BRIDGETUNE').attr('code');  //桥隧code
    if (bridgetune == null || bridgetune == 0 || bridgetune == undefined) {
        bridgetune = '';
    }
    var dirct = "";//行别
    if ($('#direction').val() != '') {
        dirct = $('#direction').attr('code')
    }
    var kmStart = $('#kmStart').val();  //开始公里标
    var kmEnd = $('#kmEnd').val();  //结束公里标
    if (pole_nu == undefined) {
        pole_nu = $('#polNumber').val()
    } else {
        pole_nu = pole_nu.replace('#', '%23')
    }
    var bureau_code = '';//局编码标准线
    if (Request.bureau_code != undefined) {
        bureau_code = Request.bureau_code;
    }
    var org_code = '';//段编码标准线
    if (Request.org_code != undefined) {
        org_code = Request.org_code;
    }



    //加两个code    局   段
    var _url = '/common/monepoledata/remotehandlers/mydevicelist.ashx?action=PoleList'
                + '&lineCode=' + lineCode
                + '&direction=' + dirct
                + '&position=' + position
                + '&bridgetune=' + bridgetune
                + '&startKM=' + kmStart
                + '&endKM=' + kmEnd
                + '&pole_no=' + pole_nu
                + '&bureau_code=' + bureau_code
                + '&org_code=' + org_code
                + '&pageIndex=' + page
                + '&pageSize=' + pageSize_P;
    $.ajax({
        type: 'post',
        url: _url,
        async: true,
        cache: false,
        success: function (re) {
            if (re != '' && re != undefined && re != '-1' && re != '0' && re.data.length > 0) {
                PageCount = re.totalPages;
                var html = '';
                for (var i = 0; i < re.data.length; i++) {

                    html += '<div class="one_pole" POLE_NO="' + re.data[i].POLE_NO + '" code="' + re.data[i].POLE_CODE + '">\
                                   <div class="pole_number">'+ re.data[i].POLE_NO + '支柱</div>\
                                   <div class="km_number">' + re.data[i].KM + '</div>\
                               </div>'
                }

                html += ' <div class="pageOutSide">\
                                        <div class="page">\
                                            <div class="page-bg">\
                                                <a href="#" class="page-top">\
                                                    <img src="/Common/MGIS/img/gis-img/top.png" title="页首" alt="页首">\
                                                </a> <a href="#" class="page-pre">\
                                                    <img src="/Common/MGIS/img/gis-img/pre.png" title="上一页" alt="上一页">\
                                                </a> &nbsp;&nbsp;第&nbsp;&nbsp;<span class="page-numb pagecolor" id="page-numb">' + re.pageIndex + '</span>\
                                                &nbsp;&nbsp;页,共&nbsp;<span class="pagecolor" id="pageCount">' + re.totalPages + '</span>&nbsp;&nbsp;页,当前页<span class="pagecolor" id="PageSize">' + re.Current_pagesize + '</span>条,共<span class="pagecolor" id="Count">' + re.total_Rows + '</span>条数据\
                                                <a href="#" class="page-nex">\
                                                    <img src="/Common/MGIS/img/gis-img/nex.png" title="下一页" alt="下一页">\
                                                </a> <a href="#" class="page-last">\
                                                    <img src="/Common/MGIS/img/gis-img/last.png" title="页尾" alt="页尾">\
                                                </a>\
                                            </div>\
                                        </div>\
                                    </div>'
                $('.pol_choose_div').html(html);

                $('.pageOutSide').css({
                    left: (($('.pol_choose_div').outerWidth() - $('.pageOutSide').width()) / 2) > 35 ? 35 : (($('.pol_choose_div').outerWidth() - $('.pageOutSide').width()) / 2)
                });

                pageCtrl();
            }
            else {
                $('.pol_choose_div').html('<div style="color:white;font-size:20px;line-height:50px;text-align:center;margin-bottom: -30px;">暂无数据！</div>');
            }
        },
        error: function () {
            $('.pol_choose_div').html('请求出错！');
        }

    })

}
//支柱分页控制
function pageCtrl() {
    $('.one_pole').click(function () {
        $('#polNumber').val($(this).attr('POLE_NO')).attr('code', $(this).attr('code'))
        //$('#kmStart').val($(this).attr('POLE_NO')).attr('code', $(this).attr('code'))
        $('.pol_choose_div').hide();
    })
    //分页首页
    $(".page-top").click(function () {
        page = 1;
        queryPoleList(page); ///执行查询 (当前JS)
    });
    //分页上一页
    $(".page-pre").click(function () {
        if (page > 1) {
            page = page - 1;
            queryPoleList(page); ///执行查询 (当前JS)
        }
    });
    //分页下一页
    $(".page-nex").click(function () {
        if (page < PageCount) {
            page = page + 1;
            queryPoleList(page); ///执行查询 (当前JS)
        }
    });
    //分页尾页
    $(".page-last").click(function () {
        page = PageCount;
        queryPoleList(page); ///执行查询 (当前JS)
    });


}

//定位
function makelocation(pole_Code) {
    var lineCode = $('#line_tree').attr('code');  //线路code
    if (lineCode == null || lineCode == 0 || lineCode == undefined) {
        lineCode = '';
    }
    var position = $('#LineTreeselect').attr('code');  //区间code
    if (position == null || position == 0 || position == undefined) {
        position = '';
    }
    var bridgetune = $('#BRIDGETUNE').attr('code');  //桥隧code
    if (bridgetune == null || bridgetune == 0 || bridgetune == undefined) {
        bridgetune = '';
    }
    var dirct = "";//行别
    if ($('#direction').val() != '') {
        dirct = $('#direction').attr('code')
    }
    var kmStart = $('#kmStart').val();  //开始公里标
    var kmEnd = $('#kmEnd').val();  //结束公里标
    var poleNumber = $('#polNumber').val();  //杆号
    var poleCode = '';
    if (poleNumber != '') {
        poleCode = $('#polNumber').attr('code').replace('#', '%23')
    }
    if (pole_Code) {
        poleCode = pole_Code;
    }
    var time = '';
    var _url;

    if (isFromStandardLine == 'true') {
        _url = '/Common/LineInspectionDataAnalysis/RemoteHandlers/HardDiskLineVedioPlay.ashx?action=Index'
                 + '&direction=' + pole_direction
                 + '&start_time=' + Request.start_time
                 + '&end_time=' + Request.end_time
                 + '&bureau_code=' + Request.bureau_code
                 + '&org_code=' + Request.org_code
        ;
    } else {
        _url = '/Common/LineInspectionDataAnalysis/RemoteHandlers/HardDIskDataVedioPlay.ashx?action=Index'
                 + '&pole_direction=' + pole_direction
                 + '&start_timestamp=' + start_timestamp
                 + '&end_timestamp=' + end_timestamp;
    }
    _url += '&position_code=' + position_code

             + '&locomotive_code=' + locomotive_code
             + '&bow_position_code=' + bow_position_code
             + '&line_code=' + line_code;


    if ($('#Q_by_time').hasClass('title_choose_one')) {
        time = $('#startTime').val();
        _url += ('&t_start_time=' + time)
    } else {
        _url += ('&t_line_code=' + lineCode
         + '&t_pole_direction=' + dirct
         + '&t_pole_code=' + poleCode
         + '&t_brg_tun_code=' + bridgetune
         + '&t_position_code=' + position
         + '&t_start_km=' + kmStart
         + '&t_end_km=' + kmEnd)
    };

    $.ajax({
        type: 'post',
        url: _url,
        async: true,
        cache: false,
        beforeSend: function () {
            layer.msg('加载中', {
                icon: 16, shade: 0.01, time: 0
            });
            setTimeout(function () { layer.closeAll() }, 2000)
        },
        success: function (re) {
            if (re != '' && re != undefined && re != '-1') {
                if (isFromStandardLine == 'true') {
                    if (re.POLE_INDEX == '-1') {
                        Ispaly = false;
                        layer.msg('未查找到指定位置！')
                    } else {
                        standardline_sildeNumber_poleIndex = parseInt(re.POLE_INDEX);
                        standardline_sildeNumber_eachOne = 0;
                        playJudge_standLine(standardline_sildeNumber_poleIndex)
                    }
                } else {
                    if (re.INDEX != '') {
                        if (re.INDEX == '-1') {
                            Ispaly = false;
                            layer.msg('未查找到指定位置！');
                            sliderNumber = 0;
                        } else {
                            sliderNumber = parseInt(re.INDEX) - 1;
                            pageIndex = parseInt(sliderNumber / pageSize);//计算页码
                            //console.log(pageIndex, sliderNumber)
                            playJudgeGetData()
                            playJudge();
                            if (Request.from_line == 'true') {
                                $('.Details_list_linePolling').click();
                            }

                        }
                    }
                    else {
                        layer.msg('定位失败！');
                    }
                }
            }
        },
        error: function () {
            layer.msg('请求出错！');
            layer.closeAll()
        }
    })
}
var imgreadyNumber = 0;
function LoadImg(url) {
    var img = new Image();
    //img.src = url.replace(/%5c/g, '\\');
    img.src = url;
}

//预加载图片
function preLoadImg(number, url, dom, size) {
    //if (size == 'small') {
    //    url += '&swidth=320&sheight=240'
    //}
    //if (number % 2 == 1 && dom.attr('id') != 'RED' && bigIMG != 'DLV') {
    //    switch (dom.attr('id')) {
    //        case 'HD':
    //            HD = true;
    //            break;
    //        case 'OVER':
    //            OVER = true;
    //            break;
    //    }
    //    CompleteImgNum++;
    //}
    //else {

    var img = new Image();
    //img.src = url.replace(/%5c/g, '\\');
    img.src = url;
    img.onload = function () {
        CompleteImgNum++;
        dom.siblings('.show_loading').hide();
        if (dom.attr('id') == 'F') {
            if (bigIMG == 'DLV' && url.indexOf('type=GetIrvImgData') != -1 || bigIMG == 'HD' && url.indexOf('type=GetViImgData') != -1 || bigIMG == 'OVER' && url.indexOf('type=GetMv3ImgData') != -1 || bigIMG == 'FZ' && url.indexOf('type=GetAuxImgData') != -1) {
                dom.attr('src', url)
                last_BIG = url;
            }

        } else {
            dom.attr('src', url)
        }
        switch (dom.attr('id')) {
            case 'RED':
                last_RED = url;
                RED = true;
                break;
            case 'HD':
                last_HD = url;
                HD = true;
                break;
            case 'OVER':
                last_OA = url;
                OVER = true;
                break;
            case 'FZ':
                last_FZ = url;
                FZ = true;
                break;
        }

    }
    img.onerror = function () {
        CompleteImgNum++;
        //dom.attr('src', '/C3/PC/LineInspection/img/bg.jpg')
        switch (dom.attr('id')) {
            case 'RED':
                if (last_RED != '/C3/PC/LineInspection/img/bg.jpg') {
                    dom.attr('src', last_RED)
                    last_RED = '/C3/PC/LineInspection/img/bg.jpg';
                } else {
                    dom.attr('src', '/C3/PC/LineInspection/img/bg.jpg')
                }
                RED = true;
                break;
            case 'HD':
                if (last_HD != '/C3/PC/LineInspection/img/bg.jpg') {
                    dom.attr('src', last_HD)
                    last_HD = '/C3/PC/LineInspection/img/bg.jpg';
                } else {
                    dom.attr('src', '/C3/PC/LineInspection/img/bg.jpg')
                }
                HD = true;
                break;
            case 'OVER':
                if (last_OA != '/C3/PC/LineInspection/img/bg.jpg') {
                    dom.attr('src', last_OA)
                    last_OA = '/C3/PC/LineInspection/img/bg.jpg';
                } else {
                    dom.attr('src', '/C3/PC/LineInspection/img/bg.jpg')
                }
                OVER = true;
                break;
            case 'FZ':
                if (last_FZ != '/C3/PC/LineInspection/img/bg.jpg') {
                    dom.attr('src', last_FZ)
                    last_FZ = '/C3/PC/LineInspection/img/bg.jpg';
                } else {
                    dom.attr('src', '/C3/PC/LineInspection/img/bg.jpg')
                }
                FZ = true;
                break;
            case 'F':
                if (last_BIG != '/C3/PC/LineInspection/img/bg.jpg') {
                    dom.attr('src', last_BIG)
                    last_BIG = '/C3/PC/LineInspection/img/bg.jpg';
                } else {
                    dom.attr('src', '/C3/PC/LineInspection/img/bg.jpg')
                }
                break;
        }
    }

    //}


};

function loadSureBox() {
    LoadSureBox('3C', '');
}

//报警确认点击事件判断
function AlarmSure() {
    var onejson;
    var _Url;
    switch (AB_SURFACE) {
        case "A":
            onejson = sumArrayA[sliderNumber];
            break;
        case "B":
            onejson = sumArrayB[sliderNumber];
            break;
        case "C":
            onejson = sumArrayC[sliderNumber];
            break;
        case "D":
            onejson = sumArrayD[sliderNumber];
            break;
    }
    //var loc = onejson.LOCOMOTIVE_CODE; //车号
    //var alarmTime = onejson.time; //时间
    //var IRVTimeStamp = onejson.TIMESTAMP_IRV //时间戳
    //var IRVPATH = onejson.FILEPATH_IRV //红外
    //var VIPATH = onejson.FILEPATH_VI //可见光
    //var OVPATH = onejson.FILEPATH_OV //全景
    alarm_loc = onejson.LOCOMOTIVE_CODE; //车号
    alarm_alarmTime = onejson.time; //时间
    alarm_IRVTimeStamp = onejson.TIMESTAMP_IRV //时间戳
    alarm_IRVPATH = onejson.FILEPATH_IRV //红外
    alarm_VIPATH = onejson.FILEPATH_VI //可见光
    alarm_OVPATH = onejson.FILEPATH_OV //全景
    IRVIDX = onejson.IRV_IDX
    _Url = '/Common/LineInspectionDataAnalysis/RemoteHandlers/HardDIskDataVedioPlay.ashx?action=IsAlarmExist&time=' + alarm_alarmTime + '&locomotive=' + alarm_loc;
    $.ajax({
        type: 'POST',
        url: _Url,
        async: true,
        cache: false,
        success: function (result) {
            var json = result;
            if (json.sign == '0') {
                $('#E_btnOk2').click();

                hardDiskSetAlarmID(alarm_loc, alarm_alarmTime, alarm_IRVTimeStamp, alarm_IRVPATH, alarm_VIPATH, alarm_OVPATH, IRVIDX, alarm_vi_Offset, alarm_ov_Offset); //弹出确认框

            } else if (json.sign == '1') {
                window.open('/C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=' + json.ID, "_blank");
            } else {
                layer.msg("请求出错!");
            }
        },
        error: function () {
            layer.msg("请求出错!");
        }
    })
};


//切换弓位置调整播放索引
function getChangeBownSlideNumber(lastBowCode) {
    var sumArray_all = [];
    var queryBy_Time = false;
    if (lastBowCode == 'A') {
        sumArray_all = sumArrayA
    } else if (lastBowCode == 'B') {
        sumArray_all = sumArrayB
    } else if (lastBowCode == 'C') {
        sumArray_all = sumArrayC
    } else if (lastBowCode == 'D') {
        sumArray_all = sumArrayD
    }
    if (sumArray_all[nowSlideNumber] != undefined) {


        var lineCode = sumArray_all[nowSlideNumber].LINE_CODE;  //线路code
        if (lineCode == null || lineCode == 0 || lineCode == undefined) {
            lineCode = '';
        }
        var position = sumArray_all[nowSlideNumber].POSITION_CODE;  //区间code
        if (position == null || position == 0 || position == undefined) {
            position = '';
        }
        var bridgetune = sumArray_all[nowSlideNumber].BRG_TUN_CODE;  //桥隧code
        if (bridgetune == null || bridgetune == 0 || bridgetune == undefined) {
            bridgetune = '';
        }
        var dirct = "";//行别
        if ($('#direction').val() != '') {
            dirct = sumArray_all[nowSlideNumber].DIRECTION
        }
        var KM_MARK = sumArray_all[nowSlideNumber].KM_MARK;  //开始公里标
        var poleNumber = sumArray_all[nowSlideNumber].POLE_NUMBER;  //杆号
        var poleCode = '';
        if (poleNumber != '') {
            poleCode = sumArray_all[nowSlideNumber].POLE_CODE.replace('#', '%23')
        }
        var time = '';//时间
        if (sumArray_all[nowSlideNumber].POLE_CODE == '') {
            queryBy_Time = true;
            time = sumArray_all[nowSlideNumber].time
        }
    } else {
        return false;//不改变索引
    }




    var _url;
    _url = '/Common/LineInspectionDataAnalysis/RemoteHandlers/HardDIskDataVedioPlay.ashx?action=Index'
         + '&pole_direction=' + pole_direction
         + '&position_code=' + position_code
         + '&start_timestamp=' + start_timestamp
         + '&end_timestamp=' + end_timestamp
         + '&locomotive_code=' + locomotive_code
         + '&bow_position_code=' + bow_position_code
         + '&line_code=' + line_code;

    if (queryBy_Time) {
        _url += ('&t_start_time=' + time)
    } else {
        _url += ('&t_line_code=' + lineCode
         + '&t_pole_direction=' + dirct
         + '&t_pole_code=' + poleCode
         + '&t_brg_tun_code=' + bridgetune
         + '&t_position_code=' + position
         + '&t_start_km=' + KM_MARK
         + '&t_end_km=' + KM_MARK)
    };



    $.ajax({
        type: 'post',
        url: _url,
        async: false,//必须设置为同步 先获取索引在切换位置才能播放
        cache: false,
        success: function (re) {
            if (re != '' && re != undefined && re != '-1' && re != '0') {
                if (re.INDEX != '') {
                    if (re.INDEX == '-1') {
                        sliderNumber = 0;
                    } else {
                        sliderNumber = parseInt(re.INDEX) - 1
                        pageIndex = parseInt(sliderNumber / pageSize) + 1;//计算页码
                    }
                }
                else {
                    sliderNumber = 0;
                }
            }
        },
        error: function () {
            sliderNumber = 0;
        }

    })
}

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
            if (continuous_temperature != 'rectangle' || $('.IR_alert').is(':hidden')) {
                return false;
            }
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
            if (continuous_temperature != 'rectangle' || $('.IR_alert').is(':hidden')) {
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
            //$("#" + canvasId).removeLayer(layerName);
            console.log(rectangleArry)
            // rectangle shape 
            //$("#" + canvasId).drawRect({
            //    //fillStyle: 'steelblue',
            //    type: 'rectangle',
            //    fillStyle: 'transparent',
            //    strokeStyle: '#FBD82F',
            //    strokeWidth: 1,
            //    x: rectangleArry[0], y: rectangleArry[1],
            //    fromCenter: false,
            //    name:'yy',
            //    width: rectangleArry[2] - rectangleArry[0],
            //    height: rectangleArry[3] - rectangleArry[1]
            //});
            //请求最高温点坐标及温度 

        }
    }
};



function drawPen() {
    var color = "#FBD82F";
    var width = 1;
    var a = CanvasExt.drawRect("cavars", color, width);
}


//报警确认点击事件判断
function AlarmSureback() {
    var onejson;
    var _Url;
    switch (AB_SURFACE) {
        case "A":
            onejson = sumArrayA[nowSlideNumber];
            break;
        case "B":
            onejson = sumArrayB[nowSlideNumber];
            break;
        case "C":
            onejson = sumArrayC[nowSlideNumber];
            break;
        case "D":
            onejson = sumArrayD[nowSlideNumber];
            break;
    }
    alarm_loc = onejson.LOCOMOTIVE_CODE; //车号
    alarm_alarmTime = onejson.time; //时间
    alarm_IRVTimeStamp = onejson.TIMESTAMP_IRV //时间戳
    alarm_IRVPATH = onejson.FILEPATH_IRV //红外
    alarm_VIPATH = onejson.FILEPATH_VI //可见光
    alarm_OVPATH = onejson.FILEPATH_OV //全景
    IRVIDX = onejson.IRV_IDX
    //hardDiskSetAlarmID(loc, alarmTime, IRVTimeStamp, IRVPATH, VIPATH, OVPATH); //弹出确认框  AlarmSureBox.js
    layer.confirm('进入调整模式？', {
        title: '提示', closeBtn: 0,
        btn: ['确定', '跳过'] //按钮
    }, function () {

        layer.confirm('调整完成回车键“Enter”保存', {
            title: '', closeBtn: 0, btn: ['开始调整']
        }, function (index) {
            alarm_enter = true;
            layer.close(index);
            $(".arrows").show();
        }, function () {
        });
    }, function () {
        $('#E_btnOk2').click();

        hardDiskSetAlarmID(alarm_loc, alarm_alarmTime, alarm_IRVTimeStamp, alarm_IRVPATH, alarm_VIPATH, alarm_OVPATH, IRVIDX, alarm_vi_Offset, alarm_ov_Offset);
        $('.LineInspection_Confirm').children("img").attr("src", "img/LineInspection_play_Confirm.png")
    });
};

//报警列表获取
function getalarmList() {
    var _url = '/common/lineinspectiondataanalysis/remotehandlers\harddiskdatavedioplay.ashx?action=AlarmList'
                + '&start_timestamp=' + start_timestamp
                + '&end_timestamp=' + end_timestamp
                + '&line_code=' + line_code
                + '&locomotive_code=' + locomotive_code
                + '&pole_direction=' + pole_direction
                + '&position_code=' + position_code;
    $.ajax({
        type: 'post',
        url: _url,
        async: true,
        cache: false,
        success: function (re) {
            if (re != '' && re != undefined && re.data.length > 0) {
                var _html = '';
                if (re.data.length < 7) {
                    $('.alarm_bg table').css('width', '100%')//表格头样式宽度
                }
                for (var i = 0; i < re.data.length; i++) {
                    var list = re.data[i];
                    _html += '<tr alarmID="' + list.ID + '" tmcode="' + list.RAISED_TIME_M + '"><td>' + list.RAISED_TIME + '</td><td>' + list.CODE_NAME + '</td><td>' + list.SEVERITY + '</td><td>' + list.BOW_POSITION + '</td></tr>'
                }
                $('#alarm_Table_content').html(_html);
                $('#alarm_Table_content tr').click(function () {
                    var id = $(this).attr('alarmID');
                    window.open('/C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=' + id, "_blank");
                })
            } else {
                $('.alarm_bg').html('无报警！').css({
                    'color': 'white', 'font-size': '30px', 'line-height': '240px', 'text-align': 'center'
                })
            }
        },
        error: function () {
            $('.alarm_bg').html('无报警！').css({
                'color': 'white', 'font-size': '30px', 'line-height': '240px', 'text-align': 'center'
            })
            console.warn('报警列表请求出错!!!');
        }
    })
}


//获取巡检数据列表
function getLininspctionList() {
    if (isFromStandardLine != 'true') {
        var sumArray_all = [];
        if (AB_SURFACE == 'A') {
            sumArray_all = sumArrayA
        } else if (AB_SURFACE == 'B') {
            sumArray_all = sumArrayB
        } else if (AB_SURFACE == 'C') {
            sumArray_all = sumArrayC
        } else if (AB_SURFACE == 'D') {
            sumArray_all = sumArrayD
        }

        var polecode = sumArray_all[nowSlideNumber].POLE_CODE;
        var line_code = sumArray_all[nowSlideNumber].LINE_CODE;
        var direction = sumArray_all[nowSlideNumber].DIRECTION;
        var start_time = Request.bigStarttime;
        var end_time = Request.bigEndtime;
        var bown_code = sumArray_all[nowSlideNumber].BOW_POSITION_CODE;

    } else {
        var polecode = SumarryStandardLine[nowSlideNumber_Forline[0]][nowSlideNumber_Forline[1]].POLE_CODE;
        var line_code = SumarryStandardLine[nowSlideNumber_Forline[0]][nowSlideNumber_Forline[1]].LINE_CODE;
        var direction = SumarryStandardLine[nowSlideNumber_Forline[0]][nowSlideNumber_Forline[1]].DIRECTION;
        var start_time = Request.start_time;
        var end_time = Request.end_time;
        var bown_code = '';
    }
    $('.bigdate').html(start_time + '—' + end_time)
    var _url = '/Common/LineInspectionDataAnalysis/RemoteHandlers/HardDiskLineVedioPlay.ashx?action=PoleToLoco'
             + '&start_time=' + start_time
             + '&end_time=' + end_time
             + '&bow_position_code=' + bown_code
             + '&line_code=' + line_code
             + '&direction=' + direction
             + '&pole_code=' + polecode;



    $.ajax({
        url: _url,
        async: true,
        cache: false,
        beforeSend: function () {
            $('#linePolling_Table_content').html('');//清空当前列表
            layer.msg('加载中!', {
                time: 0
            });
        },
        success: function (re) {
            layer.closeAll()
            if (re != '' && re != undefined) {
                var json = re.data;
                var _html = '';
                if (isFromStandardLine != 'true') {
                    for (var i = 0; i < json.length; i++) {
                        _html += '<tr start_timestamp="' + json[i].START_TIMESTAMP + '" end_timestamp="' + json[i].END_TIMESTAMP + '" LOCOMOTIVE_CODE="' + json[i].LOCOMOTIVE_CODE + '" LINE_CODE="' + json[i].LINE_CODE + '" LINE_NAME="' + json[i].LINE_NAME + '" DIRECTION="' + json[i].DIRECTION + '" START_TIME="' + json[i].START_TIME + '" END_TIME="' + json[i].END_TIME + '" bigStarttime="' + Request.bigStarttime + '" bigEndtime="' + Request.bigEndtime + '" BOW_POSITION_NAME="' + json[i].BOW_POSITION_NAME + '" POLE_CODE="' + json[i].POLE_CODE + '"><td>' + json[i].LOCOMOTIVE_CODE + '</td>\
                           <td>'+ json[i].DATE + '</td>\
                           <td class="PRIORITY">'+ json[i].PRIORITY + '</td>\
                           <td>'+ json[i].BOW_POSITION_NAME + '</td>\
                           <td><img class="playImg" src="img/changePlay.png" title="播放" /><span class="line_start" title="当前帧设置为开始">开始</span><span class="line_end" title="当前帧设置为结束">结束</span></td></tr>'
                    }
                } else {
                    for (var i = 0; i < json.length; i++) {
                        _html += '<tr start_timestamp="' + json[i].START_TIMESTAMP + '" end_timestamp="' + json[i].END_TIMESTAMP + '" LOCOMOTIVE_CODE="' + json[i].LOCOMOTIVE_CODE + '" LINE_CODE="' + json[i].LINE_CODE + '" LINE_NAME="' + json[i].LINE_NAME + '" DIRECTION="' + json[i].DIRECTION + '" START_TIME="' + json[i].START_TIME + '" END_TIME="' + json[i].END_TIME + '" bigStarttime="' + start_time + '" bigEndtime="' + end_time + '" BOW_POSITION_NAME="' + json[i].BOW_POSITION_NAME + '" POLE_CODE="' + json[i].POLE_CODE + '"><td>' + json[i].LOCOMOTIVE_CODE + '</td>\
                           <td>'+ json[i].DATE + '</td>\
                           <td class="PRIORITY">'+ json[i].PRIORITY + '</td>\
                           <td>'+ json[i].BOW_POSITION_NAME + '</td>\
                           <td><img class="playImg" src="img/changePlay.png" title="播放" /><span class="line_start" title="当前帧设置为开始">开始</span><span class="line_end" title="当前帧设置为结束">结束</span></td></tr>'
                    }

                }

                if (json.length <= 8) {//调整表头宽度适配
                    $('.linePolling_Table_title').width('100%');
                } else {
                    $('.linePolling_Table_title').width('calc(100% - 12px)');
                }
                $('#linePolling_Table_content').html(_html)
                if (isFromStandardLine != 'true') {
                    $('#linePolling_Table_content tr').each(function () { //判断某一排是不是当前播放的数据  然后显示 开始结束------------------------doing
                        if ($(this).attr('start_timestamp') == start_timestamp && $(this).attr('end_timestamp') == end_timestamp && $(this).attr('BOW_POSITION_NAME') == $('.LineInspection_choose_car').html()) {
                            $(this).find('.playImg').hide()
                            $(this).addClass('thisweb_One');
                        } else {
                            $(this).find('.line_start,.line_end').hide()
                        }
                    })
                } else {
                    $('#linePolling_Table_content').find('.line_start,.line_end').hide()
                }
                //跳转按钮
                $('.playImg').click(function () {

                    var loco = $(this).parents('tr').attr('LOCOMOTIVE_CODE'); //车号
                    var lineCode = $(this).parents('tr').attr('LINE_CODE'); //线路code
                    var lineName = $(this).parents('tr').attr('LINE_NAME'); //线路名
                    var positionCode = ''; //区站code
                    var positionName = ''; //区站名
                    var DR = $(this).parents('tr').attr('DIRECTION'); //行别
                    var starttime = $(this).parents('tr').attr('START_TIME'); //开始时间
                    var endtime = $(this).parents('tr').attr('END_TIME'); //结束时间
                    var starttimestamp = $(this).parents('tr').attr('start_timestamp'); //开始时间
                    var endtimestamp = $(this).parents('tr').attr('end_timestamp'); //结束时间
                    var bigStarttime = $(this).parents('tr').attr('bigStarttime'); //大范围开始时间
                    var bigEndtime = $(this).parents('tr').attr('bigEndtime'); //大范围结束时间
                    var BOW_POSITION_NAME = $(this).parents('tr').attr('BOW_POSITION_NAME')//弓位置
                    var POLE_CODE = $(this).parents('tr').attr('POLE_CODE')//弓位置

                    var Url = '/Common/LineInspectionDataAnalysis/LineInspection_data_analysis.html?'
                                   + '&line_code=' + escape(lineCode)
                                   + '&line_name=' + escape(lineName)
                                   + '&direction=' + escape(DR)
                                   + '&position_code=' + escape(positionCode)
                                   + '&position_name=' + escape(positionName)
                                   + '&start_time=' + starttime
                                   + '&end_time=' + endtime
                                   + '&starttimestamp=' + starttimestamp
                                   + '&endtimestamp=' + endtimestamp
                                   + '&locomotive_code=' + loco
                                   + '&bigStarttime=' + bigStarttime
                                   + '&bigEndtime=' + bigEndtime
                                   + '&BOW_POSITION_NAME=' + escape(BOW_POSITION_NAME)
                                   + '&POLE_CODE=' + POLE_CODE + '&from_line=true';
                    window.open(Url, "_blank");

                })
                //开始结束按钮
                $('.line_start,.line_end').click(function () {
                    var sumArray_all = [];
                    if (AB_SURFACE == 'A') {
                        sumArray_all = sumArrayA
                    } else if (AB_SURFACE == 'B') {
                        sumArray_all = sumArrayB
                    } else if (AB_SURFACE == 'C') {
                        sumArray_all = sumArrayC
                    } else if (AB_SURFACE == 'D') {
                        sumArray_all = sumArrayD
                    }
                    var that = $(this);
                    if ($(this).attr('class') == 'line_start') {
                        $('.greenOne').attr('nowSlideNumber', nowSlideNumber);
                        $('.start_title').html(sumArray_all[nowSlideNumber].LOCOMOTIVE_CODE + '&nbsp;')
                        $('.start_title_time').html(sumArray_all[nowSlideNumber].time).attr({ 'TIMESTAMP_IRV': sumArray_all[nowSlideNumber].TIMESTAMP_IRV, 'PP_id': sumArray_all[nowSlideNumber].ID, 'POLE_SERIALNO': sumArray_all[nowSlideNumber].POLE_SERIALNO })
                        $('.start_title_bown').html('&nbsp;' + sumArray_all[nowSlideNumber].BOW_POSITION_NAME)
                        $('.start_title_Level').html('&nbsp;优先级' + that.parents('tr').find('.PRIORITY').html())
                    } else {
                        $('.yellowOne').attr('nowSlideNumber', nowSlideNumber);
                        $('.end_title').html(sumArray_all[nowSlideNumber].LOCOMOTIVE_CODE + '&nbsp;')
                        $('.end_title_time').html(sumArray_all[nowSlideNumber].time).attr({ 'TIMESTAMP_IRV': sumArray_all[nowSlideNumber].TIMESTAMP_IRV, 'PP_id': sumArray_all[nowSlideNumber].ID, 'POLE_SERIALNO': sumArray_all[nowSlideNumber].POLE_SERIALNO })
                        $('.end_title_bown').html('&nbsp;' + sumArray_all[nowSlideNumber].BOW_POSITION_NAME)
                        $('.end_title_Level').html('&nbsp;优先级' + that.parents('tr').find('.PRIORITY').html())
                    }
                    if ($('.start_title_time').html() != '' && $('.end_title_time').html() != '') {
                        var a = new Date($('.start_title_time').html());
                        var b = new Date($('.end_title_time').html());
                        if (a >= b) {
                            layer.msg('结束时间必须大于开始时间！')
                            canMakePrioriy = false;
                        } else {
                            canMakePrioriy = true;
                        }
                    }
                    $('.text div').click(function () {
                        sliderNumber = parseInt($(this).attr('nowSlideNumber'));
                        doHtml(parseInt($(this).attr('nowSlideNumber')))
                        slider.slider("value", parseInt($(this).attr('nowSlideNumber')));
                    })

                })

            } else {
                layer.msg('暂无巡检列表数据!')
            }
        }, error: function () {
            layer.closeAll()
            layer.msg('巡检列表请求出错!')
        }

    })
}

//单帧对当前页面进行加载
function changeNowImg() {
    if (isFromStandardLine == 'true') {
        dohtmlForline(nowSlideNumber_Forline[0], nowSlideNumber_Forline[1])
    } else {
        doHtml(nowSlideNumber);
    }
}


//预加载文件请求
function sentFileQuest(json) {

    var __url = 'http://' + queryIP_IRV + '/3CDataProvider/NotifyNextInformation'
    var postdata = {
        sessionID: sessionID,
        playtype: json.linetype,
        summary: json.summary
    };
    //var b = '{"name":"2323","sex":"afasdf","age":"6262"}'
    //console.log(postdata)
    //var a = JSON.parse(b);
    //alert(a)
    //console.log(a)
    //console.log(JSON.parse(JSON.stringify(postdata)))
    //var str = '';
    //for (var i = 0; i < json.summary.lengh; i++) {
    //    str += json.summary[i]
    //}
    //console.log(JSON.stringify(json.summary))
    //$.ajax({ 
    //    url: __url,
    //    type:"POST",
    //    data: a,
    //    //dataType:'json',
    //    beforeSend: function(xhr) {
    //        xhr.setRequestHeader("Content-Type", "text/plain");
    //    },
    //    //headers: {
    //    //    "content-type": "json; charset=utf-8"
    //    //},
    //    async: true,
    //    cache: false,})
    //var a = JSON.stringify(json.summary).replace(/\\/,'/')
    //console.log(JSON.stringify(json.summary))

    var __url = 'http://' + queryIP_IRV + '/3CDataProvider/NotifyNextInformation?sessionID=' + sessionID + '&playType=' + json.linetype + '&jsonSummary={"summary":' + JSON.stringify(json.summary) + '}'
    if (json.linetype != '' && json.summary != '') {
        $.ajax({
            url: __url,
            type: "GET",
        })
    }



    //var xmlhttp;
    //if (window.XMLHttpRequest) {
    //    xmlhttp = new XMLHttpRequest();
    //}

    //xmlhttp.open('POST', __url, true);
    //xmlhttp.setRequestHeader("Content-type", "html");

    //xmlhttp.send(postdata);
    //ajaxa({
    //    type: "POST",

    //    url: __url,
    //    data: postdata,
    //    contentType: 'application/json'
    //})
    //$.post(__url, postdata,
    // function (data) {

    // },
    // "json");
}

function ajaxa(options) {
    options = options || {};
    options.type = (options.type || "GET").toUpperCase();
    options.dataType = options.dataType || "json";
    options.contentType = options.contentType || "application/x-www-form-urlencoded";
    var params = options.data

    //创建 - 非IE6 - 第一步
    if (window.XMLHttpRequest) {
        var xhr = new XMLHttpRequest();
    } else { //IE6及其以下版本浏览器
        var xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }

    //接收 - 第三步
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            var status = xhr.status;
            if (status >= 200 && status < 300) {
                options.success && options.success(xhr.responseText, xhr.responseXML);
            } else {
                options.fail && options.fail(status);
            }
        }
    }

    //连接 和 发送 - 第二步
    if (options.type == "GET") {
        xhr.open("GET", options.url + "?" + params, true);
        xhr.send(null);
    } else if (options.type == "POST") {
        xhr.open("POST", options.url, true);
        //设置表单提交时的内容类型
        xhr.setRequestHeader("Content-Type", options.contentType);
        xhr.send(params);
    }
}

//格式化参数
function formatParams(data) {
    var arr = [];
    for (var name in data) {
        arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
    }
    arr.push(("v=" + Math.random()).replace(".", ""));
    return arr.join("&");
}

//silde点击播放
function slidePlay(number) {
    if (startForPush) {
        if (Ispaly) {
            setTimeout(play, 200)
        } else {
            setTimeout(function () { BroadcastPace(number); }, 200);
        }
    } else {
        setTimeout(function () { slidePlay(number); }, 200);

    }
}


//根据 时间 选择  设置开始结束时间戳
function setTimeStamp(code) {
    switch (code) {
        case '1day':
            showTimeStart = Request.stampst.split(' ')[0] + ' 00:00:00';
            showTimeEnd = Request.stampen.split(' ')[0] + ' 23:59:59';
            break;
        case '1min':
            showTimeStart = DateAddORSub_y('min', '+', -1, Request.stampst, true);
            showTimeEnd = DateAddORSub_y('min', '+', +1, Request.stampen, true);
            break;
        case '5secend':
            showTimeStart = DateAddORSub_y('s', '+', -5, Request.stampst, true)
            showTimeEnd = DateAddORSub_y('s', '+', +5, Request.stampen, true);
            break;
    }
    originalFile_starttimestamp = getStamp(showTimeStart)
    originalFile_endtimestamp = getStamp(showTimeEnd)
    $('.title_font').html(Request.locomotive_code + '&nbsp;' + showTimeStart.replace(/\//g, "-") + '-' + showTimeEnd.split(' ')[1].replace(/\//g, "-"));//设置title 原始数据
    console.log(originalFile_starttimestamp, originalFile_endtimestamp)

}

//获取时间戳
function getStamp(str) {
    var date = new Date(str); //时间对象
    var stamp = date.getTime(); //转换成时间戳
    return stamp
}

//时间加减
function DateAddORSub_y(interval, type, number, time, str) {
    /*
    * 功能:实现Script的Date加减功能.
    * 参数:interval,字符串表达式，表示要添加的时间间隔.
    * 参数:number,数值表达式，表示要添加的时间间隔的个数.
    * 参数:type,加减类型.
    * 返回:新的时间对象.
    * var newDate =DateAddORSub("d","+",5);
    */
    if (time != '' && time != undefined) {
        var date = new Date(time);
    } else {
        var date = new Date();
    }
    switch (interval) {
        case "y":
            {
                if (type == "+") {
                    date.setFullYear(date.getFullYear() + number);
                } else {
                    date.setFullYear(date.getFullYear() - number);
                }

                break;
            }
        case "q":
            {
                if (type == "+") {
                    date.setMonth(date.getMonth() + number * 3);
                } else {
                    date.setMonth(date.getMonth() - number * 3);
                }

                break;
            }
        case "mon":
            {
                if (type == "+") {
                    date.setMonth(date.getMonth() + number);
                } else {
                    date.setMonth(date.getMonth() - number);
                }

                break;
            }
        case "w":
            {
                if (type == "+") {
                    date.setDate(date.getDate() + number * 7);
                } else {
                    date.setDate(date.getDate() - number * 7);
                }

                break;
            }
        case "d":
            {
                if (type == "+") {
                    date.setDate(date.getDate() + number);
                } else {
                    date.setDate(date.getDate() - number);
                }

                break;
            }
        case "h":
            {
                if (type == "+") {
                    date.setHours(date.getHours() + number);
                } else {
                    date.setHours(date.getHours() - number);
                }

                break;
            }
        case "min":
            {
                if (type == "+") {
                    date.setMinutes(date.getMinutes() + number);
                } else {
                    date.setMinutes(date.getMinutes() - number);
                }

                break;
            }
        case "s":
            {
                if (type == "+") {
                    date.setSeconds(date.getSeconds() + number);
                } else {
                    date.setSeconds(date.getSeconds() - number);
                }

                break;
            }
        default:
            {
                if (type == "+") {
                    date.setDate(d.getDate() + number);
                } else {
                    date.setDate(d.getDate() - number);
                }
                break;
            }
    }

    if (str) {
        var d = date;
        var ret = d.getFullYear() + "-";
        ret += ("00" + (d.getMonth() + 1)).slice(-2) + "-";
        ret += ("00" + d.getDate()).slice(-2) + " ";
        ret += ("00" + d.getHours()).slice(-2) + ":";
        ret += ("00" + d.getMinutes()).slice(-2) + ":";
        ret += ("00" + d.getSeconds()).slice(-2) + " ";
        return ret;
    } else {
        return date;
    }

};

//回到报警发生时间
function backAlarmTime() {
    Ispaly = false;
    //时间定位
    $('#Q_by_time').click();
    $('#startTime').val(alarm_start_time)
    makelocation();
}
//时间戳转时间
function timestampToTime(timestamp) {
    if (timestamp.length == 10) {
        var date = new Date(parseInt(timestamp) * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    } else if (timestamp.length == 13) {
        {
            var date = new Date(parseInt(timestamp));
        }
        Y = date.getFullYear() + '-';
        M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        D = date.getDate() + ' ';
        h = date.getHours() + ':';
        m = date.getMinutes() + ':';
        s = date.getSeconds();
        return Y + M + D + h + m + s;
    }
}

