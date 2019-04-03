
// 请求路径的参数
var alarmid = ''; //报警id
var device_id = ''; //杆编码

// 报警详情所需变量
var alarm_json; //报警详细信息json
var alarm_img_json; //报警图片详细信息json
var alarm_ab_surface = 'A';//AB面
var alarm_raised_time = '';
// 报警播放器变量
var alarm_set; //定时器
var alarm_imgNum = 0; //报警图片计数
var alarm_isPaly = 1; //播放控制
// 报警图片变量
var alarm_IR_index = 0; //红外帧
var alarm_VI_index = 0; //可见帧
var alarm_OA_index = 0; //全景帧A
var alarm_OB_index = 0; //全景帧B
var alarm_infrared_param_index = 0; //红外参数

//分隔

// 巡检详情所需变量
var pole_id = ''; //支柱id
var pole_code = ''; //支柱code
var inspection_json; //巡检详细信息json
var inspection_ab_surface = 'A';//AB面
// 巡检播放器变量
var inspection_set; //定时器
var inspection_imgNum = -1; //巡检图片计数
var inspection_isPaly = 1; //播放控制
// 巡检图片变量
var inspection_IR_index = -1; //红外帧
var inspection_VI_index = -1; //可见帧
var inspection_OA_index = -1; //全景帧A
var inspection_OB_index = -1; //全景帧B
var inspection_infrared_param_index = -1; //红外参数

//var ECharts; //ECharts

//分隔

// slide click
var li_col = ''; //巡检信息中的所有li标签
var li_width = ''; //一个li标签的宽度
var viewWindow = ''; //可视数量
var li_items_n = 0; //li标签的数量
var x_pos = 0; //所有li标签的宽度之和
var total_clicks = 0; //需隐藏的li标签的数量
var left_clicks = 0; //需隐藏在左边的li标签的数量
var right_clicks = 0; //需隐藏在右边的li标签的数量
var isClickGreen = false; //内部判断，是否点击了，如果是，那么移出事件内部函数直接跳过
var isClickGray = false; //内部判断，是否点击了，如果是，那么移出事件内部函数直接跳过

// 获取巡检id所需变量
var pole_number = ''; //支柱
var line = ''; //线路
var qz = ''; //区站
var direction = ''; //行别
var km = ''; //公里标
var bridge_tunnel_no = ''; //桥隧

$(document).ready(function () {

    if (undefined !== GetQueryString('alarmid') && '' !== GetQueryString('alarmid') && 'undefined' !== GetQueryString('alarmid') && null !== GetQueryString('alarmid')) {
        alarmid = GetQueryString('alarmid');
    }
    if (undefined !== GetQueryString('device_id') && '' !== GetQueryString('device_id') && 'undefined' !== GetQueryString('device_id') && null !== GetQueryString('device_id')) {
        device_id = GetQueryString('device_id');
    }
    //设置图片可见区域的高度
    var screenHeight = document.body.clientHeight; //网页可见区域高
    $('.row-height').height(screenHeight); //设置元素的高度（最外层）
    var boxTableImgTop = $('.box-table-img').offset().top; //一个元素（比如div）的顶部距屏幕顶部距离的象素值
    var boxTableImgHeight = screenHeight - boxTableImgTop; //计算元素的高度
    $('.box-table-img').height(boxTableImgHeight); //设置元素的高度（图片层）
    //设置图片的高度
    var height = $(window).height() - $('.box-title').outerHeight(true) - $('.box-car-content').outerHeight(true) - 254;
    $('#alarm-infrared').height(height);
    $('#alarm-visible-light').height(height);
    $('#alarm-panorama').height(height);
    $('#alarm-temperature').height(height);
    $('#alarm-pull-out').height(height);
    $('#alarm-high-conductivity').height(height);

    $('#inspection-infrared').height(height);
    $('#inspection-visible-light').height(height);
    $('#inspection-panorama').height(height);
    $('#inspection-temperature').height(height);
    $('#inspection-pull-out').height(height);
    $('#inspection-high-conductivity').height(height);

    //初始化对比信息
    load_analysis_info();

    //报警播放器点击事件
    alarm_player_click();

    //巡检播放器点击事件
    inspection_player_click();

    //上一杆
    $('.j-prev-pole').click(function () {
        get_inspect_id(device_id, 'PRIOR', $(this));
    });

    //下一杆
    $('.j-next-pole').click(function () {
        get_inspect_id(device_id, 'NEXT', $(this));
    });

    //一杆一档详情
    $('.j-pole-detail').click(function () {
        var url = '/Common/MOnePoleData/oneChockoneGAN.html?device_id=' + device_id;
        window.open(url);
    }); 

});

/**
 * @desc 获取巡检id
 * @param 
 */
function get_inspect_id(device_id, pole_type, obj) {
    var url = '/C3/PC/LineInspection/RemoteHandlers/GetComparativeAnalysisList.ashx?action=repeatlist'
        + '&POLE_CODE=' + device_id;
    $.ajax({
        type: 'post',
        url: url,
        async: true,
        cache: false,
        success: function (json) {
            if (null === json || '' === json) {
                layer.msg('没有数据', {
                    time: 800 //0.8秒关闭（如果不配置，默认是3秒）
                });
            } else {
                if (json.data <= 0) {
                    layer.msg('没有数据', {
                        time: 800 //0.8秒关闭（如果不配置，默认是3秒）
                    });
                } else {
                    var data = json.data;
                    for (var i = 0; i < data.length; i++) {
                        if (i === 0) {
                            inspect_id = data[i].ID; //巡检id
                            change_pole($(obj), pole_type, inspect_id);
                        }
                    }
                }
            }
        },
        error: function (msg) {
            layer.msg(msg);
        }
    });
}

/**
 * @desc 上一杆、下一杆
 * @param 
 */
function change_pole(obj, changeSign, lineInspectID) {
    var url = '/c3/pc/lineinspection/remotehandlers/getcomparativeanalysislist.ashx?'
        + 'action=getlinepole'
        + '&sign=' + changeSign
        + '&POLE_CODE=' + device_id
        + '&LINE_INSPECT_ID=' + lineInspectID;
    $.ajax({
        type: 'post',
        url: url,
        async: true,
        cache: false,
        success: function (pole_code) {
            if ('' === pole_code || undefined === pole_code || null === pole_code) {
                layer.tips('未查询到数据', $(obj), {
                    tips: [1, '#a959ee'],
                    time: 5000
                });
            } else {
                device_id = pole_code;
                show_pole_info(lineInspectID,obj, device_id, inspection_ab_surface); //显示杆的信息
                reset_inspection_variate(); //重置变量值（巡检）
                load_inspection_info(); //显示巡检信息
            }
        },
        error: function (msg) {
            layer.msg(msg);
        }
    });
}

/**
 * @desc 显示杆的信息
 * @param 
 */
function show_pole_info(lineInspectID, obj, poleCode, inspection_ab_surface) {
    var url = '/C3/PC/LineInspection/RemoteHandlers/GetComparativeAnalysisList.ashx?action=info'
    + '&LINE_INSPECT_ID=' + lineInspectID
    + '&POLE_CODE=' + poleCode
    + '&AB_SURFACE=' + inspection_ab_surface;
    $.ajax({
        type: 'post',
        url: url,
        async: true,
        cache: false,
        success: function (result) {
            if (null === result || '' === result || undefined === result) {
                layer.tips('未查询到数据', $(obj), {
                    tips: [1, '#a959ee'],
                    time: 1000
                });
            } else {
                json = result;
                //线路信息
                $('#data-pole-number').html(json.POLE_NUMBER); //支柱
                $('#data-pole-number').attr('code', json.POLE_CODE); //支柱编码
                $('#data-line-name').html(json.LINE_NAME); //线路
                $('#data-position-name').html(json.POSITION_NAME); //区站
                $('#data-direction').html(json.DIRECTION); //行别
                $('#data-km-mark-o').html(json.KM_MARK); //公里标
            }
            
        },
        error: function (msg) {
            layer.msg(msg);
        }
    });
}

/**
 * @desc 初始化对比信息
 * @param 
 */
function load_analysis_info() {
    var url = 'RemoteHandlers/GetMonitorAlarmC3Form.ashx?alarmid=' + alarmid;
    $.ajax({
        type: 'post',
        url: url,
        async: true,
        cache: false,
        success: function (result) {
            if (null === result || '' === result) {
                layer.msg('没有数据', {
                    time: 800 //0.8秒关闭（如果不配置，默认是3秒）
                });
            } else {
                alarm_json = eval('(' + result + ')');
            }
            if (alarm_json != undefined) {
                //线路信息
                $('#data-pole-number').html(alarm_json.POLE_NUMBER); //支柱
                $('#data-pole-number').attr('code', device_id); //支柱编码
                $('#data-line-name').html(alarm_json.LINE); //线路
                $('#data-position-name').html(alarm_json.QZ); //区站
                $('#data-direction').html(alarm_json.DIRECTION); //行别
                $('#data-km-mark-o').html(alarm_json.KM); //公里标
                $('#data-bridge-tune').val(alarm_json.BRIDGE_TUNNEL_NO); //桥隧

                pole_number = alarm_json.POLE_NUMBER; //支柱
                line = alarm_json.LINE; //线路
                qz = alarm_json.QZ; //区站
                direction = alarm_json.DIRECTION; //行别
                km = alarm_json.KM; //公里标
                bridge_tunnel_no = alarm_json.BRIDGE_TUNNEL_NO; //桥隧

                //获取支柱（杆）id
                //get_pole_id();

                //初始化巡检信息
                load_inspection_info();
                
                //报警信息
                var _html_link = "&nbsp;&nbsp;(&nbsp;<a href=\"javascript:window.open('/C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=" + alarmid + '&v=' + version + "','_blank')\">详情&gt;&gt;</a>&nbsp;)";
                $('#alarm-raised-time').html(alarm_json.RAISED_TIME + _html_link); //发生日期
                $('#alarm-locomotive-code').html(alarm_json.LOCNO); //设备编号
                alarm_raised_time = alarm_json.RAISED_TIME;

                var SUMMARYDIC = alarm_json.SUMMARYDIC; //报警类型
                var SEVERITY = alarm_json.SEVERITY; //报警级别
                var CUST_ALARM_CODE = alarm_json.CUST_ALARM_CODE; //标签
                var PROPOSAL = alarm_json.PROPOSAL; //处理意见
                var REMARK = alarm_json.REMARK; //备注
                var ALARM_ANALYSIS = alarm_json.ALARM_ANALYSIS; //报警分析
                var STATUSDIC = alarm_json.STATUSDIC; //报警状态

                $('#alarm-analysis').html(SUMMARYDIC + '&nbsp;' + SEVERITY + '&nbsp;' + CUST_ALARM_CODE + '&nbsp;' + PROPOSAL + '&nbsp;' + REMARK + '&nbsp;' + ALARM_ANALYSIS + '&nbsp;' + STATUSDIC); //报警分析
                $('#alarm-note .note-2 img').attr('src', 'img/player_play.png');

                //初始化报警详情
                load_alarm_info();
            }
        }
    });
}

/**
 * @desc 初始化报警详情
 * @param 
 */
function load_alarm_info() {
    var url = '/C3/PC/MRTA/RemoteHandlers/GetlocAlarmImgInfo.ashx?alarmid=' + alarmid;
    $.ajax({
        type: 'post',
        url: url,
        async: true,
        cache: false,
        success: function (result) {
            if (null === result || '' === result) {
                layer.msg('没有数据', {
                    time: 800 //0.8秒关闭（如果不配置，默认是3秒）
                });
            } else {
                alarm_img_json = eval('(' + result + ')');
            }
            if (alarm_img_json != undefined) {
                alarm_imgNum = 0; //报警图片计数

                if ($('#alarm-slider').length > 0) {
                    $('#alarm-slider').slider({
                        value: 0,
                        min: 0,
                        max: alarm_img_json.PLAY_IDX.length - 2,
                        step: 1,
                        range: 'min',
                        slide: function (event, ui) {
                            if (event.keyCode == undefined) {  //按钮不执行。
                                GoToFrame(parseInt(ui.value));
                            }
                        }
                    });
                }

                //显示播放器
                $('#alarm-note').css('display','inline-block');

                //播放报警图像
                alarm_img_play();

                //初始化报警图表
                load_alarm_echarts();
            }
        }
    });
};

/**
 * @desc  初始化报警图表
 * @param 
 */
function load_alarm_echarts(){
    Echarts_alarm_temperature();
    Echarts_alarm_pullOut();
    Echarts_alarm_highConductivity();
}

/**
 * @desc 关闭定时器（报警）
 * @param 
 */
function alarm_suspended() {
    clearInterval(alarm_set); //关闭定时器
}

/**
 * @desc 重置播放器状态（报警）
 * @param 
 */
function reset_alarm_player_status() {
    clearInterval(alarm_set); //关闭定时器
    reset_alarm_variate(); //重置变量值（报警）
}

/**
 * @desc 重置变量值（报警）
 * @param 
 */
function reset_alarm_variate() {
    //播放器变量
    alarm_imgNum = 0; //报警图片计数
    alarm_isPaly = 1; //播放控制
    //图片变量
    alarm_IR_index = 0; //红外帧
    alarm_VI_index = 0; //可见帧
    alarm_OA_index = 0; //全景帧A
    alarm_OB_index = 0; //全景帧B
    alarm_infrared_param_index = 0; //红外参数
}

/**
 * @desc 播放报警图像
 * @param 
 */
function alarm_img_play() {
    alarm_img_detail(); //报警图像详情

    alarm_imgNum++; //图片数量
    alarm_infrared_param_index++;//红外参数
    alarm_IR_index++;//红外
    alarm_VI_index++;//可见光
    alarm_OA_index++;//全景A
    alarm_OB_index++;//全景B

    clearInterval(alarm_set);//关闭定时器 
    alarm_set = setInterval('alarm_img_play()', 500); //重新设置定时器
}

/**
 * @desc 报警图像详情
 * @param 
 */
function alarm_img_detail() {
    if (alarm_imgNum >= alarm_img_json.PLAY_IDX.length - 1) {
        alarm_imgNum = 0; //图片数量
        alarm_infrared_param_index = 0;//红外参数
        alarm_IR_index = 0;//红外
        alarm_VI_index = 0;//可见光
        alarm_OA_index = 0;//全景A
        alarm_OB_index = 0;//全景B
    }
    if (alarm_imgNum < 0) {
        var play_idx = alarm_img_json.PLAY_IDX.length - 2;
        alarm_imgNum = play_idx;
        alarm_infrared_param_index = play_idx;//红外参数
        alarm_IR_index = play_idx;//红外
        alarm_VI_index = play_idx;//可见光
        alarm_OA_index = play_idx;//全景A
        alarm_OB_index = play_idx;//全景B
    }

    if ($('#alarm-slider').length > 0) {
        $('#alarm-slider').slider('value', alarm_imgNum);
        $('#alarm-slider').slider({ range: 'min' });
    }

    //红外参数切换
    $('#alarm-infrared-param').html(alarm_img_json.FRAME_INFO[alarm_infrared_param_index]);
    //红外换图
    $('#alarm-infrared').attr('src', alarm_img_json.IR_PICS[alarm_IR_index]);
    //可见光换图
    $('#alarm-visible-light').attr('src', alarm_img_json.VI_PICS[alarm_VI_index]);
    //全景换图
    if (alarm_ab_surface == 'B') {
        $('#alarm-panorama').attr('src', alarm_img_json.OB_PICS[alarm_OB_index]);
    } else {
        $('#alarm-panorama').attr('src', alarm_img_json.OA_PICS[alarm_OA_index]);
    }

    if ($('#alarm-infrared-param').length > 0) {
        $('#alarm-infrared-param').html();
    }
}

/**
 * @desc 上一张（报警）
 * @param 
 */
function alarm_prev_img() {
    alarm_imgNum--; //图片数量
    alarm_infrared_param_index--;//红外参数
    alarm_IR_index--;//红外
    alarm_VI_index--;//可见光
    alarm_OA_index--;//全景A
    alarm_OB_index--;//全景B

    alarm_img_play();
}

/**
 * @desc 播放或暂停报警图像
 * @param 
 */
function alarm_play_or_pause_img() {
    if (alarm_isPaly == '1') {
        alarm_isPaly = 0;
        alarm_suspended(); //关闭定时器
        $('#alarm-note .note-2').find('img').attr('src', 'img/player_pause.png');
    } else {
        alarm_isPaly = 1;
        alarm_img_play();
        $('#alarm-note .note-2').find('img').attr('src', 'img/player_play.png');
    }
}

/**
 * @desc 下一张（报警）
 * @param 
 */
function alarm_after_img() {
    alarm_img_play();
}

/**
 * @desc 报警播放器点击事件
 * @param
 */
function alarm_player_click() {
    //上一张（报警）
    $('.j-alarm-note-1').click(function () {
        if (alarm_imgNum > 0) {
            alarm_imgNum--; //图片数量
            alarm_infrared_param_index--;//红外参数
            alarm_IR_index--;//红外
            alarm_VI_index--;//可见光
            alarm_OA_index--;//全景A
            alarm_OB_index--;//全景B
        }
        alarm_prev_img();
        alarm_suspended();
        alarm_isPaly = 0;
        if ($('.j-alarm-note-3').find('img').attr('src') == 'img/player_after_hover.png') {
            $('.j-alarm-note-3').find('img').attr('src', 'img/player_after.png');
        }
        $('.j-alarm-note-1').find('img').attr('src', 'img/player_prev_hover.png');
        $('#alarm-note .note-2').find('img').attr('src', 'img/player_pause.png');
    });
    //播放、暂停（报警）
    $('.j-alarm-note-2,.j-alarm-infrared,.j-alarm-visible-light,.j-alarm-panorama').click(function () {
        alarm_play_or_pause_img();
        $('.j-alarm-note-1').find('img').attr('src', 'img/player_prev.png');
        $('.j-alarm-note-3').find('img').attr('src', 'img/player_after.png');
    });
    //下一张（报警）
    $('.j-alarm-note-3').click(function () {
        if (alarm_imgNum > alarm_img_json.PLAY_IDX.length - 1) {
            alarm_imgNum = 0; //图片数量
            alarm_infrared_param_index = 0;//红外参数
            alarm_IR_index = 0;//红外
            alarm_VI_index = 0;//可见光
            alarm_OA_index = 0;//全景A
            alarm_OB_index = 0;//全景B
        }
        alarm_after_img();
        alarm_suspended();
        alarm_isPaly = 0;
        if ($('.j-alarm-note-1').find('img').attr('src') == 'img/player_prev_hover.png') {
            $('.j-alarm-note-1').find('img').attr('src', 'img/player_prev.png');
        }
        $('.j-alarm-note-3').find('img').attr('src', 'img/player_after_hover.png');
        $('#alarm-note .note-2').find('img').attr('src', 'img/player_pause.png');
    });
    //正面（报警）
    $('.j-alarm-note-4').click(function () {
        reset_alarm_player_status(); //重置播放器状态（报警）
        $('#alarm-slider').slider('value', '0');
        alarm_ab_surface = 'A';
        $('#alarm-default-surface').attr('surface','A');
        load_alarm_info(); //显示报警图像      
        if ($('.j-alarm-note-5').find('img').attr('src') == 'img/player_surface_B_hover.png') {
            $('.j-alarm-note-5').find('img').attr('src', 'img/player_surface_B.png');
        }
        $('.j-alarm-note-4').find('img').attr('src', 'img/player_surface_A_hover.png');
    }); 
    //反面（报警）
    $('.j-alarm-note-5').click(function () {
        reset_alarm_player_status(); //重置播放器状态（报警）
        $('#alarm-slider').slider('value', '0');
        alarm_ab_surface = 'B';
        $('#alarm-default-surface').attr('surface', 'B');
        load_alarm_info(); //显示报警图像        
        if ($('.j-alarm-note-4').find('img').attr('src') == 'img/player_surface_A_hover.png') {
            $('.j-alarm-note-4').find('img').attr('src', 'img/player_surface_A.png');
        }
        $('.j-alarm-note-5').find('img').attr('src', 'img/player_surface_B_hover.png');
    });
}


//分隔


/**
 * @desc 初始化巡检信息
 * @param
 */
function load_inspection_info() {
    var url = '/C3/PC/LineInspection/RemoteHandlers/GetComparativeAnalysisList.ashx?action=repeatlist'
    + '&POLE_CODE=' + device_id;
    $.ajax({
        type: 'post',
        url: url,
        async: true,
        cache: false,
        success: function (json) {
            if (null === json || '' === json) {
                layer.msg('没有数据', {
                    time: 800 //0.8秒关闭（如果不配置，默认是3秒）
                });
                $('#car-info').html('');
            } else {
                if (json.data <= 0) {
                    layer.msg('没有数据', {
                        time: 800 //0.8秒关闭（如果不配置，默认是3秒）
                    });
                    $('#car-info').html('');
                } else {
                    var data = json.data;
                    var _html_car_info_newer = ''; //车信息（较新的）
                    var _html_car_info_older = ''; //车信息（较旧的）
                    for (var i = 0; i < data.length; i++) {
                        var ID = data[i].ID; //巡检id
                        var LINE_CODE = data[i].LINE_CODE; //线路code
                        var LINE_NAME = data[i].LINE_NAME; //线路名称
                        var MONTH_NO = data[i].MONTH_NO; //线路巡检批次
                        var BEGIN_TIME = data[i].BEGIN_TIME; //开始时间
                        var END_TIME = data[i].END_TIME; //结束时间

                        if (''!== ID) {
                            if (BEGIN_TIME > alarm_raised_time) {
                                if(i === 0){
                                    _html_car_info_newer +=
                                        '<li class="border-green current">'
                                            + '<span class="pic-flag pic-camera pic-camera-green"></span>'
                                            + '<span>' + BEGIN_TIME + '</span>'
                                            + '<span>' + END_TIME + '</span>'
                                            + '<span>' + MONTH_NO + '</span>'
                                            + '<span class="blank-white blank-green" isSelect="T"></span>'
                                            + '<input line-inspect-id="' + ID + '" type="hidden" />'
                                        + '</li>';
                                } else {
                                    _html_car_info_newer +=
                                        '<li class="border-green">'
                                            + '<span class="pic-flag pic-camera pic-camera-green"></span>'
                                            + '<span>' + BEGIN_TIME + '</span>'
                                            + '<span>' + END_TIME + '</span>'
                                            + '<span>' + MONTH_NO + '</span>'
                                            + '<span class="blank-white" isSelect="F"></span>'
                                            + '<input line-inspect-id="' + ID + '" type="hidden" />'
                                        + '</li>';
                                }
                            } else {
                                if (i === 0) {
                                    _html_car_info_older +=
                                        '<li class="border-gray current">'
                                            + '<span class="pic-flag pic-camera pic-camera-gray"></span>'
                                            + '<span>' + BEGIN_TIME + '</span>'
                                            + '<span>' + END_TIME + '</span>'
                                            + '<span>' + MONTH_NO + '</span>'
                                            + '<span class="blank-white blank-gray" isSelect="T"></span>'
                                            + '<input line-inspect-id="' + ID + '" type="hidden" />'
                                        + '</li>';
                                } else {
                                    _html_car_info_older +=
                                        '<li class="border-gray">'
                                            + '<span class="pic-flag pic-camera pic-camera-gray"></span>'
                                            + '<span>' + BEGIN_TIME + '</span>'
                                            + '<span>' + END_TIME + '</span>'
                                            + '<span>' + MONTH_NO + '</span>'
                                            + '<span class="blank-white" isSelect="F"></span>'
                                            + '<input line-inspect-id="' + ID + '" type="hidden" />'
                                        + '</li>';
                                }
                            }
                        }
                    }

                    $('#car-info').html(_html_car_info_newer + _html_car_info_older);

                    //滑动播放事件
                    li_col = $('#car-info > li');
                    li_width = li_col.outerWidth(true);
                    viewWindow = Math.round(($('#carousel-info').width() / li_width) - 1 );
                    slide_click(); //滑动播放事件
                   
                    //巡检信息的鼠标移入移出效果
                    inspection_info_hover();

                    //点击轮播中的巡检信息
                    $('#car-info li').click(function () {
                        inspect_info_click(this);
                    });

                    load_inspection_detail('repeat_play'); //显示巡检图像 （重复播放）
                }
            }
        },
        error: function (msg) {
            layer.msg(msg);
        }
    });
}

/**
 * @desc 点击轮播中的巡检信息
 * @param
 */
function inspect_info_click(obj) {
    var _this = $(obj);
    if (_this.hasClass('border-green')) {
        isClickGreen = true;
    }
    if (_this.hasClass('border-gray')) {
        isClickGray = true;
    }
    if (!_this.hasClass('current')) {
        //选中巡检信息前，将被选li标签的current移除，并重新设置这个li标签的相关样式
        var car_info = _this.parent();
        var current_li = $(car_info).find('li.current');
        var current_span = $(current_li).find('span.blank-white');
        var current_select = $(current_span).attr('isSelect');
        if ($(current_li).hasClass('border-green') && $(current_span).hasClass('blank-green') && 'T' === current_select) {
            $(current_li).removeClass('current');
            $(current_span).removeClass('blank-green');
            $(current_span).attr('isSelect','F');
        }
        if ($(current_li).hasClass('border-gray') && $(current_span).hasClass('blank-gray') && 'T' === current_select) {
            $(current_li).removeClass('current');
            $(current_span).removeClass('blank-gray');
            $(current_span).attr('isSelect', 'F');
        }

        //选中巡检信息后，为当前li标签添加current，为span标签添加相应的背景色
        _this.addClass('current');
        var blank_span = _this.find('span.blank-white');
        var select = $(blank_span).attr('isSelect');
        if (_this.hasClass('border-green') && !_this.hasClass('blank-green') && 'F' === select) {
            $(blank_span).addClass('blank-green');
            $(blank_span).attr('isSelect', 'T');
        }
        if (_this.hasClass('border-gray') && !_this.hasClass('blank-gray') && 'F' === select) {
            $(blank_span).addClass('blank-gray');
            $(blank_span).attr('isSelect', 'T');
        }

        //显示巡检图像（重复播放）
        load_inspection_detail('repeat_play');
    } else {
        //显示巡检图像（重复播放）
        load_inspection_detail('repeat_play');
    }
};

/**
 * @desc 巡检信息的鼠标移入移出效果，及发生点击事件后的处理
 * @param
 */
function inspection_info_hover() {
    $(document).on('mouseenter', '#car-info li', function () {
        var _this = $(this);
        if (_this.hasClass('border-green')) {
            isClickGreen = false;
        }
        if (_this.hasClass('border-gray')) {
            isClickGray = false;
        }
        var blank_span = _this.find('.blank-white');
        if (_this.hasClass('border-green') && !$(blank_span).hasClass('blank-green')) {
            $(blank_span).addClass('blank-green');
        }
        if (_this.hasClass('border-gray') && !$(blank_span).hasClass('blank-gray')) {
            $(blank_span).addClass('blank-gray');
        }
    });
    $(document).on('mouseleave', '#car-info li', function () {
        var _this = $(this);
        var blank_span = _this.find('.blank-white');
        var select = $(blank_span).attr('isSelect');
        if('F' === select){
            if (!isClickGreen) {
                if (_this.hasClass('border-green') && $(blank_span).hasClass('blank-green')) {
                    $(blank_span).removeClass('blank-green');
                }
            } else {
                return;
            }
            if (!isClickGray) {
                if (_this.hasClass('border-gray') && $(blank_span).hasClass('blank-gray')) {
                    $(blank_span).removeClass('blank-gray');
                }
            } else {
                return;
            }
        }
        if ('T' === select) {
            return;
        }
    });
}

/**
 * @desc 初始化巡检详情
 * @param
 */
function load_inspection_detail(play_type) {
    //显示巡检图像
    var inspect_id = $('#car-info').find('.current').find('input').attr('line-inspect-id');
    if (inspect_id !== undefined) {
        inspection_detail(play_type, inspect_id, device_id, inspection_ab_surface);
    } 
}

/**
 * @desc 巡检详情
 * @param 
 */
function inspection_detail(play_type, lineInspectID, poleCode, ab_surface) {
    var url = '/C3/PC/LineInspection/RemoteHandlers/GetComparativeAnalysisList.ashx?action=info'
        + '&LINE_INSPECT_ID=' + lineInspectID
        + '&POLE_CODE=' + poleCode
        + '&AB_SURFACE=' + ab_surface;
    $.ajax({
        type: 'post',
        url: url,
        async: true,
        cache: false,
        success: function (json) {
            inspection_json = json;
            if ('repeat_play' === play_type) {
                inspection_detail_repeat_play(inspection_json);
            }
            if ('singleness_play' === play_type) {
                inspection_detail_singleness_play(inspection_json);
            }
            load_ECharts_inspection(); //加载巡检图表（温度、拉出值、导高值）
        },
        error: function (msg) {
            layer.msg(msg);
        }
    });
}

/**
 * @desc 巡检详情（循环播放）
 * @param 
 */
function inspection_detail_repeat_play(inspection_json) {
    if (null === inspection_json || '' === inspection_json) {
        layer.msg('没有数据', {
            time: 800 //0.8秒关闭（如果不配置，默认是3秒）
        });
        //$('#inspection-raised-time').html(''); //发生日期
        //$('#inspection-locomotive-code').html(''); //设备编号
        $('#inspection-infrared').attr('src', 'img/无图.png'); //巡检 红外图像
        $('#inspection-infrared-param').html(''); //巡检 红外参数
        $('#inspection-visible-light').attr('src', 'img/无图.png'); //巡检 可见光图像
        $('#inspection-panorama').attr('src', 'img/无图.png'); //巡检 全景图像
        $('#inspection-temperature').html(''); //巡检 温度曲线图
        $('#inspection-pull-out').html(''); //巡检 拉出曲线图
        $('#inspection-high-conductivity').html(''); //巡检 导高曲线图
        clearInterval(inspection_set); //关闭定时器
        reset_inspection_variate(); //重置变量值（巡检）
    } else {
        if (inspection_json != undefined) {
            inspection_imgNum = -1;
            if ($('#inspection-slider').length > 0) {
                $('#inspection-slider').slider({
                    value: 0,
                    min: 0,
                    max: inspection_json.PLAY_IDX.length - 1,
                    step: 1,
                    range: 'min',
                    slide: function (event, ui) {
                        if (event.keyCode == undefined) { //按钮不执行
                            inspection_go_to_frame(parseInt(ui.value));
                        }
                    }
                });
            }

            //巡检巡检信息
            $('#inspection-raised-time').html(inspection_json.INSPECT_TIME); //检测时间
            $('#inspection-locomotive-code').html(inspection_json.LOCOMOTIVE_CODE); //检测设备编码
            $('#inspection-note').css('display', 'inline-block'); //显示播放器
            $('#inspection-note .note-2 img').attr('src', 'img/player_play.png');

            inspection_img_play(); //播放巡检图像（红外、可见光、全景）
        }
    }
}

/**
 * @desc 巡检详情（播放当前帧的A 面 或 B 面）
 * @param 
 */
function inspection_detail_singleness_play(inspection_json) {
    if ('' === inspection_json || undefined === inspection_json || null === inspection_json) {
        layer.msg('没有数据', {
            time: 800 //0.8秒关闭（如果不配置，默认是3秒）
        });
        //$('#inspection-raised-time').html(''); //发生日期
        //$('#inspection-locomotive-code').html(''); //设备编号
        $('#inspection-infrared').attr('src', 'img/无图.png'); //巡检 红外图像
        $('#inspection-infrared-param').html(''); //巡检 红外参数
        $('#inspection-visible-light').attr('src', 'img/无图.png'); //巡检 可见光图像
        $('#inspection-panorama').attr('src', 'img/无图.png'); //巡检 全景图像
        $('#inspection-temperature').html(''); //巡检 温度曲线图
        $('#inspection-pull-out').html(''); //巡检 拉出曲线图
        $('#inspection-high-conductivity').html(''); //巡检 导高曲线图
        clearInterval(inspection_set); //关闭定时器
        //reset_inspection_variate(); //重置变量值（巡检）
    } else {
        // 红外参数切换
        $('#inspection-infrared-param').html(inspection_json.FRAME_INFO[inspection_infrared_param_index]);
        //红外换图
        $('#inspection-infrared').attr('src', inspection_json.DLV_IMG_DIR[inspection_IR_index]);
        //可见光换图
        $('#inspection-visible-light').attr('src', inspection_json.HD_IMG_DIR[inspection_VI_index]);
        //全景换图
        if (inspection_json.AB_SURFACE == 'B') {
            $('#inspection-panorama').attr('src', inspection_json.OVER_IMG_DIR[inspection_OB_index]);
        } else {
            $('#inspection-panorama').attr('src', inspection_json.OVER_IMG_DIR[inspection_OA_index]);
        }
    }    
}

/**
 * @desc 初始化巡检图表
 * @param 
 */
function load_ECharts_inspection() {
    Echarts_inspection_temperature();
    Echarts_inspection_pullOut();
    Echarts_inspection_highConductivity();
}

/**
 * @desc 点击跳转到某一帧上（巡检）
 * @param 
 */
function inspection_go_to_frame(_index) {
    clearInterval(latest_set);
    inspection_imgNum = _index;
    inspection_isPaly = 0;
    $('#inspection-note .note-2').find('img').attr('src', 'img/player_play.png');

    inspection_img_detail();
};

/**
 * @desc 关闭定时器（巡检）
 * @param 
 */
function inspection_suspended() {
    clearInterval(inspection_set); //关闭定时器
}

/**
 * @desc 重置播放器状态（巡检）
 * @param 
 */
function reset_inspection_player_status() {
    clearInterval(inspection_set); //关闭定时器
    reset_inspection_variate(); //重置变量值（巡检）
}

/**
 * @desc 重置变量值（巡检）
 * @param 
 */
function reset_inspection_variate() {
    //播放器变量
    inspection_imgNum = -1; //巡检图片计数
    inspection_isPaly = 1; //播放控制
    //播放器变量
    inspection_IR_index = -1; //红外帧
    inspection_VI_index = -1; //可见帧
    inspection_OA_index = -1; //全景帧A
    inspection_OB_index = -1; //全景帧B
    inspection_infrared_param_index = -1; //红外参数
}

/**
 * @desc 播放巡检图像
 * @param 
 */
function inspection_img_play() {
    inspection_imgNum++;
    inspection_infrared_param_index++;//红外参数
    inspection_IR_index++;//红外
    inspection_VI_index++;//可见光
    inspection_OA_index++;//全景A
    inspection_OB_index++;//全景B

    inspection_img_detail(); //最新图像详情

    clearInterval(inspection_set); //关闭定时器 
    inspection_set = setInterval('inspection_img_play()', 500);
}

/**
 * @desc 巡检图像详情
 * @param 
 */
function inspection_img_detail() {
    if (inspection_imgNum >= inspection_json.PLAY_IDX.length) {
        inspection_imgNum = 0;
        inspection_infrared_param_index = 0;//红外参数
        inspection_IR_index = 0;//红外
        inspection_VI_index = 0;//可见光
        inspection_OA_index = 0;//全景A
        inspection_OB_index = 0;//全景B
    }
    if (inspection_imgNum < 0) {
        var play_idx = inspection_json.PLAY_IDX.length - 1;
        inspection_imgNum = play_idx;
        inspection_infrared_param_index = play_idx;//红外参数
        inspection_IR_index = play_idx;//红外
        inspection_VI_index = play_idx;//可见光
        inspection_OA_index = play_idx;//全景A
        inspection_OB_index = play_idx;//全景B
    }

    if ($('#inspection-slider').length > 0) {
        $('#inspection-slider').slider('value', inspection_imgNum);
        $('#inspection-slider').slider({ range: 'min' });
    }

    inspection_detail_singleness_play(inspection_json);

    if ($('#inspection-infrared-param').length > 0) {
        $('#inspection-infrared-param').html();
    }
}

/**
 * @desc 上一张（巡检）
 * @param 
 */
function inspection_prev_img() {
    inspection_imgNum--;
    inspection_infrared_param_index--;//红外参数
    inspection_IR_index--;//红外
    inspection_VI_index--;//可见光
    inspection_OA_index--;//全景A
    inspection_OB_index--;//全景B

    inspection_img_play();
}

/**
 * @desc 播放或暂停巡检图像
 * @param 
 */
function inspection_play_or_pause_img() {
    if (inspection_isPaly == '1') {
        inspection_isPaly = 0;
        inspection_suspended();
        $('#inspection-note .note-2').find('img').attr('src', 'img/player_pause.png');
    } else {
        inspection_isPaly = 1;
        inspection_img_play();
        $('#inspection-note .note-2').find('img').attr('src', 'img/player_play.png');
    }
}

/**
 * @desc 下一张（巡检）
 * @param 
 */
function inspection_after_img() {
    inspection_img_play();
}

/**
 * @desc 巡检播放器点击事件
 * @param
 */
function inspection_player_click() {
    //上一张（巡检）
    $('.j-inspection-note-1').click(function () {
        if (inspection_imgNum > -1) {
            inspection_imgNum--;
            inspection_infrared_param_index--;//红外参数
            inspection_IR_index--;//红外
            inspection_VI_index--;//可见光
            inspection_OA_index--;//全景A
            inspection_OB_index--;//全景B
        }
        inspection_prev_img();
        inspection_suspended();
        inspection_isPaly = 0;
        if ($('.j-inspection-note-3').find('img').attr('src') == 'img/player_after_hover.png') {
            $('.j-inspection-note-3').find('img').attr('src', 'img/player_after.png');
        }
        $('.j-inspection-note-1').find('img').attr('src', 'img/player_prev_hover.png');
        $('#inspection-note .note-2').find('img').attr('src', 'img/player_pause.png');
    });
    //播放、暂停（巡检）
    $('.j-inspection-note-2,.j-inspection-infrared,.j-inspection-visible-light,.j-inspection-panorama').click(function () {
        inspection_play_or_pause_img();
        $('.j-inspection-note-1').find('img').attr('src', 'img/player_prev.png');
        $('.j-inspection-note-3').find('img').attr('src', 'img/player_after.png');
    });
    //下一张（巡检）
    $('.j-inspection-note-3').click(function () {
        if (inspection_imgNum > inspection_json.PLAY_IDX.length - 1) {
            inspection_imgNum = 0;
            inspection_infrared_param_index = 0;//红外参数
            inspection_IR_index = 0;//红外
            inspection_VI_index = 0;//可见光
            inspection_OA_index = 0;//全景A
            inspection_OB_index = 0;//全景B
        }
        inspection_after_img();
        inspection_suspended();
        inspection_isPaly = 0;
        if ($('.j-inspection-note-1').find('img').attr('src') == 'img/player_prev_hover.png') {
            $('.j-inspection-note-1').find('img').attr('src', 'img/player_prev.png');
        }
        $('.j-inspection-note-3').find('img').attr('src', 'img/player_after_hover.png');
        $('#inspection-note .note-2').find('img').attr('src', 'img/player_pause.png');
    });
    //正面（巡检）
    $('.j-inspection-note-4').click(function () {
        inspection_ab_surface = 'A';
        $('#inspection-default-surface').attr('surface', 'A');
        if(inspection_isPaly == 1){
            reset_inspection_player_status(); //重置播放器状态（巡检）
            $('#inspection-slider').slider('value', '0');
            load_inspection_detail('repeat_play'); //显示巡检图像（重复播放）
        } else {
            load_inspection_detail('singleness_play'); //显示巡检图像（播放当前帧的A 面）
        }
        if ($('.j-inspection-note-1').find('img').attr('src') == 'img/player_prev_hover.png') {
            $('.j-inspection-note-1').find('img').attr('src', 'img/player_prev.png');
        }
        if ($('.j-inspection-note-3').find('img').attr('src') == 'img/player_after_hover.png') {
            $('.j-inspection-note-3').find('img').attr('src', 'img/player_after.png');
        }
        if ($('.j-inspection-note-5').find('img').attr('src') == 'img/player_surface_B_hover.png') {
            $('.j-inspection-note-5').find('img').attr('src', 'img/player_surface_B.png');
        }
        $('.j-inspection-note-4').find('img').attr('src', 'img/player_surface_A_hover.png');
    });
    //反面（巡检）
    $('.j-inspection-note-5').click(function () {
        inspection_ab_surface = 'B';
        $('#inspection-default-surface').attr('surface', 'B');

        if (inspection_isPaly == 1) {
            reset_inspection_player_status(); //重置播放器状态（巡检）
            $('#inspection-slider').slider('value', '0');
            load_inspection_detail('repeat_play'); //显示巡检图像（重复播放）
        } else {
            load_inspection_detail('singleness_play'); //显示巡检图像（播放当前帧的B 面）
        }

        if ($('.j-inspection-note-1').find('img').attr('src') == 'img/player_prev_hover.png') {
            $('.j-inspection-note-1').find('img').attr('src', 'img/player_prev.png');
        }
        if ($('.j-inspection-note-3').find('img').attr('src') == 'img/player_after_hover.png') {
            $('.j-inspection-note-3').find('img').attr('src', 'img/player_after.png');
        }
        if ($('.j-inspection-note-4').find('img').attr('src') == 'img/player_surface_A_hover.png') {
            $('.j-inspection-note-4').find('img').attr('src', 'img/player_surface_A.png');
        }
        $('.j-inspection-note-5').find('img').attr('src', 'img/player_surface_B_hover.png');
    });
}

/**
 * @desc 滑动播放事件
 * @param
 */
function slide_click() {

    li_col.each(function (index) {
        x_pos += $(this).outerWidth(true);
        li_items_n++;
    });

    right_clicks = li_items_n - viewWindow;
    //total_clicks = li_items_n - viewWindow;

    //设置ul的样式
    $('#car-info').css('position', 'relative');
    $('#car-info').css('left', '0px');
    $('#car-info').css('width', x_pos + 'px');

    var is_playing = false;
    var completed = function () { is_playing = false; }

    $('.j-slide-left').click(function () {
        cur_offset = $('#car-info').position().left;
        if (!is_playing) {
            if (left_clicks > 0) {
                is_playing = true;
                //$(selector).animate(styles, speed, easing, callback);
                $('#car-info').animate({ 'left': cur_offset + li_width + 'px' }, 400, 'swing', completed);
                right_clicks++;
                left_clicks--;
            } else {
                //循环播放
                //is_playing = true;
                //$('#car-info').animate({ 'left': -li_width * total_clicks + 'px' }, 700, 'linear', completed);
                //right_clicks = 0;
                //left_clicks = total_clicks;
                return;
            }
        }
    });
    $('.j-slide-right').click(function () {
        if (!is_playing) {
            cur_offset = $('#car-info').position().left;
            if (right_clicks > 0) {
                is_playing = true;
                //$(selector).animate(styles, speed, easing, callback);
                $('#car-info').animate({ 'left': cur_offset - li_width + 'px' }, 400, 'swing', completed);
                right_clicks--;
                left_clicks++;
            } else {
                //循环播放
                //is_playing = true;
                //$('#car-info').animate({ 'left': 0 + 'px' }, 700, 'linear', completed);
                //left_clicks = 0;
                //right_clicks = total_clicks;
                return;
            }
        }
    });
}



//分隔



/**
 * @desc 报警图像的温度曲线图
 * @param
 */
function Echarts_alarm_temperature() {
    var myEchart_alarm_temperature = echarts.init(document.getElementById('alarm-temperature'));

    var str_X = '[';
    for (var i = 1; i <= alarm_img_json.FRAME_INFO_LIST.length; i++) {
        if (i == 1) {
            str_X += i;
        }
        else {
            str_X += ',' + i.toString();
        }
    }
    str_X += ']';
    var _XTitle = eval('(' + str_X + ')');  //申明横坐标

    var str_data = '[';
    for (var i = 0; i < alarm_img_json.FRAME_INFO_LIST.length; i++) {
        if (i == 0) {
            //str_data += alarm_img_json.FRAME_INFO_LIST[i].TEMP_IRV;
            str_data += parseFloat(alarm_img_json.FRAME_INFO_LIST[i].TEMP_IRV / 100).toFixed(2);
        }
        else {
            //str_data += ',' + alarm_img_json.FRAME_INFO_LIST[i].TEMP_IRV;
            str_data += ',' + parseFloat(alarm_img_json.FRAME_INFO_LIST[i].TEMP_IRV / 100).toFixed(2);
        }
    }
    str_data += ']';
    var _data = eval('(' + str_data + ')'); //申明数据

    var option = { //选项
        tooltip: { //提示框
            //show: true, //显示策略
            trigger: 'axis', //触发类型
            showDelay: 1, // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
            formatter: function (params) { //内容格式器
                var res;
                res = params[0].seriesName + ':' + params[0].data + '℃';
                //res = params[0][0] + ':' + params[0][2] + '℃';
                return res;
            },
            textStyle: {
                color: '#A9A9A9'
            }
            //backgroundColor: '#333' //提示框的背景色
        },
        grid: { //直角坐标系内绘图网格
            x: 80, //直角坐标系内绘图网格左上角横坐标，数值单位px，支持百分比（字符串），如'50%'(显示区域横向中心)
            y: 30, //直角坐标系内绘图网格左上角纵坐标，数值单位px，支持百分比（字符串），如'50%'(显示区域纵向中心)
            x2: 20, //直角坐标系内绘图网格右下角横坐标，数值单位px，支持百分比（字符串），如'50%'(显示区域横向中心)
            y2: 30  //直角坐标系内绘图网格右下角纵坐标，数值单位px，支持百分比（字符串），如'50%'(显示区域纵向中心)
        },
        xAxis: [{ //直角坐标系中横轴数组
            type: 'category', //坐标轴类型
            axisLabel: { //坐标轴文本标签
                show: true, //显示策略（默认true）
                textStyle: { //文字样式
                    color: '#fff'
                }
            },
            axisLine: { //坐标轴线
                show: false, //显示策略（默认true）
                lineStyle: { //属性lineStyle控制线条样式
                    color: '#48b',
                    width: 2,
                    type: 'solid'
                }
            },
            boundaryGap: false, //类目起始和结束两端空白策略
            axisTick: { //坐标轴小标记
                onGap: false, //小标记是否显示为间隔，默认等于boundaryGap
                lineStyle: { //属性lineStyle控制线条样式
                    color: '#fff',
                    width: 0.6
                }
            },
            splitLine: { //分隔线
                show: false, //显示策略（默认true）
                lineStyle: { //属性lineStyle控制线条样式
                    type: 'solid'
                }
            },
            data: _XTitle //类目列表
        }],
        yAxis: [{ //直角坐标系中纵轴数组
            type: 'value', //坐标轴类型
            //scale: true, //脱离0值比例
            //precision: 2, //小数精度，默认为0，无小数点
            axisLabel: { //坐标轴文本标签
                textStyle: { color: '#fff' }, //文本样式
                //formatter: function (v) { //内容格式器
                //    return v + '℃'
                //}
                formatter: '{value}℃'
            },
            axisLine: { //坐标轴线
                show: false //显示策略（默认true）
            },
            //boundaryGap: [0.05, 0.05], //坐标轴两端空白策略，数组内数值代表百分比，[原始数据最小值与最终最小值之间的差额，原始数据最大值与最终最大值之间的差额]
            splitLine: { //分隔线
                show: true, //显示策略（默认true）
                lineStyle: { //属性lineStyle控制线条样式
                    type: 'solid'
                }
            }
        }],
        series: [{ //驱动图表生成的数据内容
            type: 'line', //图表类型，必要参数！
            name: '温度', //系列名称
            showAllSymbol: true, //标志图形默认只有主轴显示（随主轴标签间隔隐藏策略），如需全部显示可把showAllSymbol设为true
            data: _data //类目列表
        }]
    };
    myEchart_alarm_temperature.setOption(option);
    myEchart_alarm_temperature.on('click', function (params) { eConsole(params, 'alarm') });
}

/**
 * @desc 报警图像的拉出值线图
 * @param
 */
function Echarts_alarm_pullOut() {
    var myEchart_alarm_pullOut = echarts.init(document.getElementById('alarm-pull-out'));

    var str_X = '[';
    for (var i = 1; i <= alarm_img_json.FRAME_INFO_LIST.length; i++) {
        if (alarm_img_json.FRAME_INFO_LIST[i - 1].PULLING_VALUE.toString() == '' || alarm_img_json.FRAME_INFO_LIST[i - 1].PULLING_VALUE == '-1000') {
            continue;
        }
        if (str_X == '[') {
            str_X += i;
        }
        else {
            str_X += ',' + i.toString();
        }
    }
    str_X += ']';
    var _XTitle = eval('(' + str_X + ')');  //申明横坐标

    var str_data = '[';
    for (var i = 0; i < alarm_img_json.FRAME_INFO_LIST.length; i++) {
        if (alarm_img_json.FRAME_INFO_LIST[i].PULLING_VALUE.toString() == '' || alarm_img_json.FRAME_INFO_LIST[i].PULLING_VALUE == '-1000') {
            continue;
        }
        if (str_data == '[') {
            str_data += alarm_img_json.FRAME_INFO_LIST[i].PULLING_VALUE;
        }
        else {
            str_data += ',' + alarm_img_json.FRAME_INFO_LIST[i].PULLING_VALUE;
        }
    }
    str_data += ']';
    var _data = eval('(' + str_data + ')'); //申明数据

    var option = {
        tooltip: {
            trigger: 'axis',
            showDelay: 1,             // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
            formatter: function (params) {
                var res;
                if (params[0].data <= -1000) {
                    res = ''
                } else {
                    res = params[0].seriesName + ':' + params[0].data + 'mm';
                }
                //res = params[0][0] + ':' + params[0][2] + 'mm';
                return res;
            },
            textStyle: {
                color: '#A9A9A9'
            }
        },
        grid: {
            x: 80,
            y: 30,
            x2: 20,
            y2: 30
        },
        xAxis: [{
            type: 'category',
            axisLabel: { show: true, textStyle: { color: '#fff' } },
            axisLine: { show: false },
            boundaryGap: false, //类目起始和结束两端空白策略
            axisTick: { //坐标轴小标记
                onGap: false, //小标记是否显示为间隔，默认等于boundaryGap
                lineStyle: { //属性lineStyle控制线条样式
                    color: '#fff',
                    width: 0.6
                }
            },
            splitLine: { show: false },
            data: _XTitle
        }],
        yAxis: [{
            show: true,
            type: 'value',
            scale: true,
            precision: 2,
            min: -600,
            max: 600,
            boundaryGap: [0.05, 0.05],
            axisLabel: {
                textStyle: { color: '#fff' },
                formatter: function (v) {
                    return v + 'mm'
                }
            },
            axisLine: { show: false }
        }],
        series: [{
            name: '拉出值',
            type: 'line',
            showAllSymbol: true,
            data: _data
        }]
    }
    myEchart_alarm_pullOut.setOption(option);
    myEchart_alarm_pullOut.on('click', function (params) { eConsole(params, 'alarm') });
}

/**
 * @desc 报警图像的导高值曲线图
 * @param
 */
function Echarts_alarm_highConductivity() {
    var myEchart_alarm_highConductivity = echarts.init(document.getElementById('alarm-high-conductivity'));

    var str_X = '[';
    for (var i = 1; i <= alarm_img_json.FRAME_INFO_LIST.length; i++) {
        if (alarm_img_json.FRAME_INFO_LIST[i - 1].LINE_HEIGHT.toString() == '' || alarm_img_json.FRAME_INFO_LIST[i - 1].LINE_HEIGHT == '-1000') {
            continue;
        }
        if (str_X == '[') {
            str_X += i;
        }
        else {
            str_X += ',' + i.toString();
        }
    }
    str_X += ']';
    var _XTitle = eval('(' + str_X + ')');  //申明横坐标

    var str_data = '[';
    for (var i = 0; i < alarm_img_json.FRAME_INFO_LIST.length; i++) {
        if (alarm_img_json.FRAME_INFO_LIST[i].LINE_HEIGHT.toString() == '' || alarm_img_json.FRAME_INFO_LIST[i].LINE_HEIGHT == '-1000') {
            continue;
        }
        if (str_data == '[') {
            str_data += alarm_img_json.FRAME_INFO_LIST[i].LINE_HEIGHT;
        }
        else {
            str_data += ',' + alarm_img_json.FRAME_INFO_LIST[i].LINE_HEIGHT;
        }
    }
    str_data += ']';
    var _data = eval('(' + str_data + ')'); //申明数据

    var option = {
        tooltip: {
            trigger: 'axis',
            showDelay: 1,             // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
            formatter: function (params) {
                var res;
                if (params[0].data < 0) {
                    res = '';
                } else {
                    res = params[0].seriesName + ':' + params[0].data + 'mm';
                }
                //res = params[0][0] + ':' + params[0][2] + 'mm';
                return res;
            },
            textStyle: {
                color: '#A9A9A9'
            }
        },
        grid: {
            x: 80,
            y: 30,
            x2: 20,
            y2: 30
        },
        xAxis: [{
            type: 'category',
            axisLabel: { show: true, textStyle: { color: '#fff' } },
            axisLine: { show: false },
            boundaryGap: false, //类目起始和结束两端空白策略
            axisTick: { //坐标轴小标记
                onGap: false, //小标记是否显示为间隔，默认等于boundaryGap
                lineStyle: { //属性lineStyle控制线条样式
                    color: '#fff',
                    width: 0.6
                }
            },
            splitLine: { show: false },
            data: _XTitle
        }],
        yAxis: [{
            show: true,
            type: 'value',
            scale: true,
            precision: 2,
            min: 5000,
            max: 7000,
            boundaryGap: [0.05, 0.05],
            axisLabel: {
                textStyle: { color: '#fff' },
                formatter: function (v) {
                    return v + 'mm'
                }
            },
            axisLine: { show: false }
        }],
        series: [{
            name: '导高值',
            type: 'line',
            showAllSymbol: true,
            data: _data
        }]
    }
    myEchart_alarm_highConductivity.setOption(option);
    myEchart_alarm_highConductivity.on('click', function (params) { eConsole(params, 'alarm') });
}

/**
 * @desc 巡检图像的温度曲线图
 * @param
 */
function Echarts_inspection_temperature() {
    var myEchart_inspection_temperature = echarts.init(document.getElementById('inspection-temperature'));

    var str_X = '[';
    for (var i = 1; i <= inspection_json.FRAME_INFO_LIST.length; i++) {
        if (i == 1) {
            str_X += i;
        }
        else {
            str_X += ',' + i.toString();
        }
    }
    str_X += ']';
    var _XTitle = eval('(' + str_X + ')');  //申明横坐标

    var str_data = '[';
    for (var i = 0; i < inspection_json.FRAME_INFO_LIST.length; i++) {
        if (i == 0) {
            str_data += inspection_json.FRAME_INFO_LIST[i].MXIRTEMP.replace('℃', '');
        }
        else {
            str_data += ',' + inspection_json.FRAME_INFO_LIST[i].MXIRTEMP.replace('℃', '');
        }
    }
    str_data += ']';
    var _data = eval('(' + str_data + ')'); //申明数据

    var option = {
        tooltip: {
            trigger: 'axis',
            showDelay: 1,             // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
            formatter: function (params) {
                var res;
                res = params[0].seriesName + ':' + params[0].data + '℃';
                //res = params[0][0] + ':' + params[0][2] + '℃';
                return res;
            },
            textStyle: {
                color: '#A9A9A9'
            }
        },
        grid: {
            x: 80,
            y: 30,
            x2: 20,
            y2: 30
        },
        xAxis: [{
            type: 'category',
            axisLabel: { show: true, textStyle: { color: '#fff' } },
            axisLine: { show: false },
            boundaryGap: false, //类目起始和结束两端空白策略
            axisTick: { //坐标轴小标记
                onGap: false, //小标记是否显示为间隔，默认等于boundaryGap
                lineStyle: { //属性lineStyle控制线条样式
                    color: '#fff',
                    width: 0.6
                }
            },
            splitLine: { show: false },
            data: _XTitle
        }],
        yAxis: [{
            show: true,
            type: 'value',
            scale: true,
            precision: 2,
            min: 0,
            boundaryGap: [0.05, 0.05],
            axisLabel: {
                textStyle: { color: '#fff' },
                formatter: function (v) {
                    return v + '℃'
                }
            },
            axisLine: { show: false }
        }],
        series: [{
            name: '温度',
            type: 'line',
            showAllSymbol: true,
            data: _data
        }]
    };
    myEchart_inspection_temperature.setOption(option);
    myEchart_inspection_temperature.on('click', function (params) { eConsole(params, 'inspect') });
}

/**
 * @desc 巡检图像的拉出值曲线图
 * @param
 */
function Echarts_inspection_pullOut() {
    var myEchart_inspection_pullOut = echarts.init(document.getElementById('inspection-pull-out'));

    var str_X = '[';
    for (var i = 1; i <= inspection_json.FRAME_INFO_LIST.length; i++) {
        if (inspection_json.FRAME_INFO_LIST[i - 1].PVALUE.toString() == '' || inspection_json.FRAME_INFO_LIST[i - 1].PVALUE == '-1000') {
            continue;
        }
        if (str_X == '[') {
            str_X += i;
        }
        else {
            str_X += ',' + i.toString();
        }
    }
    str_X += ']';
    var _XTitle = eval('(' + str_X + ')');  //申明横坐标

    var str_data = '[';
    for (var i = 0; i < inspection_json.FRAME_INFO_LIST.length; i++) {
        if (inspection_json.FRAME_INFO_LIST[i].PVALUE.toString() == '' || inspection_json.FRAME_INFO_LIST[i].PVALUE == '-1000') {
            continue;
        }
        if (str_data == '[') {
            str_data += inspection_json.FRAME_INFO_LIST[i].PVALUE.replace('mm', '');
        }
        else {
            str_data += ',' + inspection_json.FRAME_INFO_LIST[i].PVALUE.replace('mm', '');
        }
    }
    str_data += ']';
    var _data = eval('(' + str_data + ')'); //申明数据

    var option = {
        tooltip: {
            trigger: 'axis',
            showDelay: 1,             // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
            formatter: function (params) {
                var res;
                if (params[0].data <= -1000) {
                    res = '';
                } else {
                    res = params[0].seriesName + ':' + params[0].data + 'mm';
                }
                //res = params[0][0] + ':' + params[0][2] + 'mm';
                return res;
            },
            textStyle: {
                color: '#A9A9A9'
            }
        },
        grid: {
            x: 80,
            y: 30,
            x2: 20,
            y2: 30
        },
        xAxis: [{
            type: 'category',
            axisLabel: { show: true, textStyle: { color: '#fff' } },
            axisLine: { show: false },
            boundaryGap: false, //类目起始和结束两端空白策略
            axisTick: { //坐标轴小标记
                onGap: false, //小标记是否显示为间隔，默认等于boundaryGap
                lineStyle: { //属性lineStyle控制线条样式
                    color: '#fff',
                    width: 0.6
                }
            },
            splitLine: { show: false },
            data: _XTitle
        }],
        yAxis: [{
            show: true,
            type: 'value',
            scale: true,
            precision: 2,
            min: -600,
            max: 600,
            boundaryGap: [0.05, 0.05],
            axisLabel: {
                textStyle: { color: '#fff' },
                formatter: function (v) {
                    return v + 'mm'
                }
            },
            axisLine: { show: false }
        }],
        series: [{
            name: '拉出值',
            type: 'line',
            showAllSymbol: true,
            data: _data
        }]
    };
    myEchart_inspection_pullOut.setOption(option);
    myEchart_inspection_pullOut.on('click', function (params) { eConsole(params, 'inspect') });
}

/**
 * @desc 巡检图像的导高值曲线图
 * @param
 */
function Echarts_inspection_highConductivity() {
    var myEchart_inspection_highConductivity = echarts.init(document.getElementById('inspection-high-conductivity'));

    var str_X = '[';
    for (var i = 1; i <= inspection_json.FRAME_INFO_LIST.length; i++) {
        if (inspection_json.FRAME_INFO_LIST[i - 1].HVALUE.toString() == '' || inspection_json.FRAME_INFO_LIST[i - 1].HVALUE == '-1000') {
            continue;
        }
        if (str_X == '[') {
            str_X += i;
        }
        else {
            str_X += ',' + i.toString();
        }
    }
    str_X += ']';
    var _XTitle = eval('(' + str_X + ')');  //申明横坐标

    var str_data = '[';
    for (var i = 0; i < inspection_json.FRAME_INFO_LIST.length; i++) {
        if (inspection_json.FRAME_INFO_LIST[i].HVALUE.toString() == '' || inspection_json.FRAME_INFO_LIST[i].HVALUE == '-1000') {
            continue;
        }
        if (str_data == '[') {
            str_data += inspection_json.FRAME_INFO_LIST[i].HVALUE.replace('mm', '');
        }
        else {
            str_data += ',' + inspection_json.FRAME_INFO_LIST[i].HVALUE.replace('mm', '');
        }
    }
    str_data += ']';
    var _data = eval('(' + str_data + ')'); //申明数据

    var option = {
        tooltip: {
            trigger: 'axis',
            showDelay: 1,             // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
            formatter: function (params) {
                var res;
                if (params[0].data < 0) {
                    res = '';
                } else {
                    res = params[0].seriesName + ':' + params[0].data + 'mm';
                }
                //res = params[0][0] + ':' + params[0][2] + 'mm';
                return res;
            },
            textStyle: {
                color: '#A9A9A9'
            }
        },
        grid: {
            x: 80,
            y: 30,
            x2: 20,
            y2: 30
        },
        xAxis: [{
            type: 'category',
            axisLabel: { show: true, textStyle: { color: '#fff' } },
            axisLine: { show: false },
            boundaryGap: false, //类目起始和结束两端空白策略
            axisTick: { //坐标轴小标记
                onGap: false, //小标记是否显示为间隔，默认等于boundaryGap
                lineStyle: { //属性lineStyle控制线条样式
                    color: '#fff',
                    width: 0.6
                }
            },
            splitLine: { show: false },
            data: _XTitle
        }],
        yAxis: [{
            show: true,
            type: 'value',
            scale: true,
            precision: 2,
            min: 5000,
            max: 7000,
            boundaryGap: [0.05, 0.05],
            axisLabel: {
                textStyle: { color: '#fff' },
                formatter: function (v) {
                    return v + 'mm'
                }
            },
            axisLine: { show: false }
        }],
        series: [{
            name: '导高值',
            type: 'line',
            showAllSymbol: true,
            data: _data
        }]
    }
    myEchart_inspection_highConductivity.setOption(option);
    myEchart_inspection_highConductivity.on('click', function (params) { eConsole(params, 'inspect') });
}

/**
 * @desc 点击echart图表数据执行的方法
 * @param 
 */
function eConsole(e, info_type) {
    if ('alarm' === info_type) {
        var _index = parseInt(e.dataIndex); //点击的序号  与帧号对应。
        for (var i = 0; i < alarm_img_json.PLAY_IDX.length; i++) { //计算出播放序列数组对应项。
            if (alarm_img_json.PLAY_IDX[i].IR == _index) { //找到对应的序号。
                alarm_imgNum = i;
                alarm_infrared_param_index = i;//红外参数
                alarm_IR_index = i;//红外
                alarm_VI_index = i;//可见光
                alarm_OA_index = i;//全景A
                alarm_OB_index = i;//全景B
                break;
            }
        }
        alarm_img_play(); //播放报警图像
        alarm_suspended(); //关闭定时器
        alarm_isPaly = 0;
        if ($('.j-alarm-note-3').find('img').attr('src') == 'img/player_after_hover.png') {
            $('.j-alarm-note-3').find('img').attr('src', 'img/player_after.png');
        }
        //$('.j-alarm-note-1').find('img').attr('src', 'img/player_prev_hover.png');
        $('#alarm-note .note-2').find('img').attr('src', 'img/player_pause.png');
    }
    if ('inspect' === info_type) {
        var _index = parseInt(e.dataIndex); //点击的序号  与帧号对应。
        for (var i = 0; i < inspection_json.PLAY_IDX.length; i++) { //计算出播放序列数组对应项。
            if (inspection_json.PLAY_IDX[i].FRAME_NO == _index - 3) { //找到对应的序号。
                inspection_imgNum = i - 1;
                inspection_infrared_param_index = i - 1;//红外参数
                inspection_IR_index = i - 1;//红外
                inspection_VI_index = i - 1;//可见光
                inspection_OA_index = i - 1;//全景A
                inspection_OB_index = i - 1;//全景B
                break;
            }
        }
        inspection_img_play(); //播放巡检图像
        inspection_suspended(); //关闭定时器
        inspection_isPaly = 0;
        if ($('.j-inspection-note-3').find('img').attr('src') == 'img/player_after_hover.png') {
            $('.j-inspection-note-3').find('img').attr('src', 'img/player_after.png');
        }
        //$('.j-inspection-note-1').find('img').attr('src', 'img/player_prev_hover.png');
        $('#inspection-note .note-2').find('img').attr('src', 'img/player_pause.png');
    }
}