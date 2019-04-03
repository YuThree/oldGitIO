

// 请求路径的参数
var lineCode = ''; //线路code
var lineName = ''; //线路名称
var positionCode = ''; //区站code
var positionName = ''; //区站名称
var brgTunCode = ''; //桥隧code
var direction = ''; //行别
var kmMarkO = '';  //原始公里标
var kmMark = '';  //公里标
var poleNumber = ''; //杆号、支柱
var poleCode = ''; //杆号、支柱code
var lineInspectID = ''; //巡检id

//分隔

// 最新巡检详情所需变量
var latest_json_inspect; //最新巡检详细信息json
var latest_ab_surface = '';//AB面
// 最新播放器变量
var latest_set; //定时器
var latest_imgNum = 0; //最新图片计数
var latest_isPaly = 1; //播放控制
// 最新图片变量
var latest_IR_index = 0; //红外帧
var latest_VI_index = 0; //可见帧
var latest_OA_index = 0; //全景帧A
var latest_OB_index = 0; //全景帧B
var latest_infrared_param_index = 0; //红外参数

//分隔

// 历史巡检详情所需变量
var history_json_inspect; //历史巡检详细信息json
var history_ab_surface = '';//AB面
// 历史播放器变量
var history_set; //定时器
var history_imgNum = -1; //历史图片计数
var history_isPaly = 1; //播放控制
// 历史图片变量
var history_IR_index = -1; //红外帧
var history_VI_index = -1; //可见帧
var history_OA_index = -1; //全景帧A
var history_OB_index = -1; //全景帧B
var history_infrared_param_index = -1; //红外参数

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

$(document).ready(function () {

    //获取请求的参数
    var theResponse = GetRequest();
    lineCode = theResponse.LINE_CODE; //线路code
    lineName = theResponse.LINE_NAME; //线路名称
    positionCode = theResponse.POSITION_CODE; //区站code
    positionName = theResponse.STATION_NAME; //区站名称
    brgTunCode = theResponse.BRG_TUN_CODE; //桥隧code
    direction = theResponse.DIRECTION; //行别
    kmMarkO = theResponse.KM_MARK_O; //原始公里标
    kmMark = theResponse.KM_MARK; //公里标
    poleNumber = theResponse.POLE_NUMBER;  //支柱号
    poleCode = theResponse.POLE_CODE; //杆号、支柱code
    lineInspectID = theResponse.LINE_INSPECT_ID; //巡检ID
    deviceID = theResponse.DEVICE_ID; //杆编码
    abSurface = theResponse.AB_SURFACE; //A  B  面
    if('' === abSurface || undefined === abSurface || null === abSurface){
        latest_ab_surface = 'A';
        history_ab_surface = 'A';
    } else {
        latest_ab_surface = abSurface;
        history_ab_surface = abSurface;
    }
    if (undefined === deviceID) {
        deviceID = poleCode;
    }

    //设置图片可见区域的高度
    var screenHeight = document.body.clientHeight; //网页可见区域高
    $('.row-height').height(screenHeight); //设置元素的高度（最外层）
    var boxTableImgTop = $('.box-table-img').offset().top; //一个元素（比如div）的顶部距屏幕顶部距离的象素值
    var boxTableImgHeight = screenHeight - boxTableImgTop; //计算元素的高度
    $('.box-table-img').height(boxTableImgHeight); //设置元素的高度（图片层）
    //设置图片的高度
    var height = $(window).height() - $('.box-title').outerHeight(true) - $('.box-car-content').outerHeight(true) - 208;
    $('#latest-infrared').height(height);
    $('#latest-visible-light').height(height);
    $('#latest-panorama').height(height);
    $('#latest-temperature').height(height);
    $('#latest-pull-out').height(height);
    $('#latest-high-conductivity').height(height);

    $('#history-infrared').height(height);
    $('#history-visible-light').height(height);
    $('#history-panorama').height(height);
    $('#history-temperature').height(height);
    $('#history-pull-out').height(height);
    $('#history-high-conductivity').height(height);

    //显示表格数据
    show_table_param();

    //显示巡检信息（调用了显示详情、图片、图表方法）
    show_inspection_info();

    //最新播放器按钮点击事件
    latest_player_click();

    //历史播放器按钮点击事件
    history_player_click();

    //上一杆
    $('.j-prev-pole').click(function () {
        change_pole($(this),'PRIOR');
    });

    //下一杆
    $('.j-next-pole').click(function () {
        change_pole($(this), 'NEXT');
    });

    //一杆一档详情
    $('.j-pole-detail').click(function () {
        var url = '/Common/MOnePoleData/oneChockoneGAN.html?device_id=' + deviceID;
        window.open(url);
    });

});

/**
 * @desc 上一杆、下一杆
 * @param 
 */
function change_pole(obj, changeSign) {
    var url = '/c3/pc/lineinspection/remotehandlers/getcomparativeanalysislist.ashx?'
        + 'action=getlinepole'
        + '&sign=' + changeSign
        + '&POLE_CODE=' + deviceID
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
                deviceID = pole_code;
                poleCode = pole_code;
                show_pole_info(obj); //显示杆的信息
                reset_latest_variate(); //重置变量值（最新）
                reset_history_variate(); //重置变量值（历史）
                show_inspection_info(); //显示巡检信息
            }
        }
    });
}

/**
 * @desc 初始化图表
 * @param 
 */
function load_ECharts(info_type) {
    if ('latest' === info_type) {
        Echarts_temperature(info_type, 'latest-temperature', latest_json_inspect);
        Echarts_pullOut(info_type, 'latest-pull-out', latest_json_inspect);
        Echarts_highConductivity(info_type, 'latest-high-conductivity', latest_json_inspect);
    }
    if ('history' === info_type) {
        Echarts_temperature(info_type, 'history-temperature', history_json_inspect);
        Echarts_pullOut(info_type, 'history-pull-out', history_json_inspect);
        Echarts_highConductivity(info_type, 'history-high-conductivity', history_json_inspect);
    }
}

/**
 * @desc 初始化线路列表信息
 * @param 
 */
function show_table_param() {
    $('#data-pole-number').html(poleNumber);
    $('#data-pole-number').attr('code', poleCode);
    $('#data-line-name').html(lineName);
    $('#data-position-name').html(positionName);
    $('#data-direction').html(direction);
    $('#data-km-mark-o').html(kmMark);
}

/**
 * @desc 显示杆的信息
 * @param 
 */
function show_pole_info(obj) {
    var url = '/C3/PC/LineInspection/RemoteHandlers/GetComparativeAnalysisList.ashx?action=info'
        + '&LINE_INSPECT_ID=' + lineInspectID
        + '&POLE_CODE=' + deviceID
        + '&AB_SURFACE=' + abSurface;
    $.ajax({
        type: 'post',
        url: url,
        async: true,
        cache: false,
        success: function (json) {
            if('' === json || undefined === json || null === json){
                layer.tips('未查询到数据', $(obj), {
                    tips: [1, '#a959ee'],
                    time: 1000
                });
            } else {
                $('#data-pole-number').html(json.POLE_NUMBER); //杆号
                $('#data-pole-number').attr('code',json.POLE_CODE); //杆编码
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
 * @desc 初始化巡检信息
 * @param 
 */
function show_inspection_info() {
    var url = '/C3/PC/LineInspection/RemoteHandlers/GetComparativeAnalysisList.ashx?action=repeatlist'
    //+ '&POLE_CODE=' + poleCode;
    + '&POLE_CODE=' + deviceID;

    $.ajax({
        type: 'post',
        url: url,
        async: true,
        cache: false,
        success: function (json) {
            if(null === json || '' === json){
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
                    var _html_car_info = ''; //车信息
                    for (var i = 0; i < data.length; i++) {
                        var ID = data[i].ID; //巡检id
                        var LINE_CODE = data[i].LINE_CODE; //线路code
                        var LINE_NAME = data[i].LINE_NAME; //线路名称
                        var MONTH_NO = data[i].MONTH_NO; //线路巡检批次
                        var BEGIN_TIME = data[i].BEGIN_TIME; //开始时间
                        var END_TIME = data[i].END_TIME; //结束时间

                        //生成html
                        if (undefined === lineInspectID) {
                            _html_car_info = show_inspection_status(i, _html_car_info, BEGIN_TIME, END_TIME, MONTH_NO, ID);
                        } else {
                            if (lineInspectID !== ID) {
                                _html_car_info = show_inspection_status(i, _html_car_info, BEGIN_TIME, END_TIME, MONTH_NO, ID);
                            } else {
                                _html_car_info = show_inspection_status(i, _html_car_info, BEGIN_TIME, END_TIME, MONTH_NO, ID);
                            }
                        }

                    }
                    $('#car-info').html(_html_car_info);

                    //拖拽提示
                    $('#car-info li').mouseenter(function () {
                        layer.tips('请拖动', '#' + $(this).attr('id'), {
                            tips: [1, '#a959ee'],
                            time: ''
                        });
                    }).mouseleave(function () {
                        layer.tips('请拖拽', '#' + $(this).attr('id'), {
                            tips: [1, '#a959ee'],
                            time: 1
                        });
                    });
                    //拖拽提示
                    $(document).on('mouseenter', '#car-info li.no-drag', function () {
                        layer.tips('不能拖拽', '#' + $(this).attr('id'), {
                            tips: [1, '#ff0000'],
                            time: ''
                        });
                    });
                    $(document).on('mouseleave', '#car-info li.no-drag', function () {
                        layer.tips('不能拖拽', '#' + $(this).attr('id'), {
                            tips: [1, '#ff0000'],
                            time: 1
                        });
                    });

                    //将巡检id放在指定位置
                    var latest_line_inspect_id = '';
                    var history_line_inspect_id = '';
                    latest_line_inspect_id = $('#car-info').find('.li-latest-dark-blue').find('input').attr('line-inspect-id');
                    history_line_inspect_id = $('#car-info').find('.li-history-blue').find('input').attr('line-inspect-id');
                    if (undefined !== latest_line_inspect_id) {
                        $('#latest-info').attr('latest-line-inspect-id', latest_line_inspect_id); //将巡检id存入最新信息区域
                    }
                    if (undefined !== history_line_inspect_id) {
                        $('#history-info').attr('history-line-inspect-id', history_line_inspect_id); //将巡检id存入历史信息区域
                    }

                    //滑动播放事件
                    li_col = $('#car-info > li');
                    li_width = li_col.outerWidth(true);
                    viewWindow = Math.round($('#carousel-info').width() / li_width);
                    slide_click();

                    //点击轮播中的巡检信息
                    $('#car-info li').click(function () {
                        inspect_info_click(this);
                    });

                    element_drag(); //拖动巡检信息
                    var li = $('#car-info li');
                    li.each(function (index) {
                        var _this = $(this);
                        if (_this.hasClass('no-drag')) {
                            _this.draggable('disable'); // 禁止其拖动功能
                        }
                    });

                    show_latest_inspection_img('repeat_play'); //显示最新巡检图像（重复播放）

                    show_history_inspection_img('repeat_play'); //显示历史巡检图像（重复播放）
                }
            }
        },
        error: function (msg) {
            layer.msg(msg);
        }
    });
}

/**
 * @desc 显示巡检信息的不同状态
 * @param
 */
function show_inspection_status(i, _html_car_info, BEGIN_TIME, END_TIME, MONTH_NO, ID) {
    if (i === 0) {
        _html_car_info +=
        '<li id="inspect-number' + i + '" class="block-drag drag no-drag li-latest-dark-blue">'
            + '<span></span>'
            + '<span>' + BEGIN_TIME + '</span>'
            + '<span>' + END_TIME + '</span>'
            + '<span>' + MONTH_NO + '</span>'
            + '<input line-inspect-id="' + ID + '" type="hidden" />'
        + '</li>';
    } else if (i === 1) {
        _html_car_info +=
        '<li id="inspect-number' + i + '" class="block-drag drag no-drag li-history-blue">'
            + '<span></span>'
            + '<span>' + BEGIN_TIME + '</span>'
            + '<span>' + END_TIME + '</span>'
            + '<span>' + MONTH_NO + '</span>'
            + '<input line-inspect-id="' + ID + '" type="hidden" />'
            + '</li>';
    } else {
        _html_car_info +=
        '<li id="inspect-number' + i + '" class="block-drag drag li-history-white">'
            + '<span></span>'
            + '<span>' + BEGIN_TIME + '</span>'
            + '<span>' + END_TIME + '</span>'
            + '<span>' + MONTH_NO + '</span>'
            + '<input line-inspect-id="' + ID + '" type="hidden" />'
        + '</li>';
    }
    return _html_car_info;
}

/**
 * @desc 显示最新巡检图像
 * @param
 */
function show_latest_inspection_img(play_type) {
    //显示最新巡检图像
    //var latest_line_inspect_id = $('#car-info').find('.li-dark-blue').find('input').attr('line-inspect-id');
    var latest_line_inspect_id = $('#latest-info').attr('latest-line-inspect-id');
    if (latest_line_inspect_id !== undefined && '' !== latest_line_inspect_id) {
        latest_inspection_detail(play_type, latest_line_inspect_id, poleCode, latest_ab_surface);
    }
}

/**
 * @desc 显示历史巡检图像
 * @param
 */
function show_history_inspection_img(play_type) {
    //显示历史巡检图像
    //var history_line_inspect_id = $('#car-info').find('.li-blue').find('input').attr('line-inspect-id');
    var history_line_inspect_id = $('#history-info').attr('history-line-inspect-id');
    if (history_line_inspect_id !== undefined && '' !== history_line_inspect_id) {
        history_inspection_detail(play_type, history_line_inspect_id, poleCode, history_ab_surface);
    }
}

/**
 * @desc 点击轮播中的巡检信息
 * @param
 */
function inspect_info_click(obj) {
    var _this = $(obj);
    if (_this.hasClass('li-history-white')) {
        //选中巡检信息前，将li标签中包含li-blue的li的li-blue移除，并重新设置这些标签的样式
        var car_info = _this.parent();
        var blue_li = $(car_info).find('li.li-history-blue');
        if ($(blue_li).hasClass('li-history-blue')) {
            $(blue_li).removeClass('li-history-blue').removeClass('no-drag').addClass('li-history-white');
            $(blue_li).draggable('enable'); // 激活其拖动功能
        }

        //选中巡检信息后，为当前li标签添加li-blue
        _this.removeClass('li-history-white').addClass('li-history-blue').addClass('no-drag');
        _this.draggable('disable'); // 禁止其拖动功能

        show_history_inspection_img('repeat_play'); //显示历史巡检图像（重复播放）
    } else if (_this.hasClass('li-history-blue')) {
        show_history_inspection_img('repeat_play'); //显示历史巡检图像（重复播放）
    } else {
        //点击提示
        if (_this.hasClass('li-latest-dark-blue') || _this.hasClass('li-history-dark-blue')) {
            layer.tips('不能点击，不能拖拽', '#' + $(_this).attr('id'), {
                tips: [1, '#ff0000'],
                time: ''
            });
        }
        if (_this.hasClass('li-latest-white') || _this.hasClass('li-latest-blue')) {
            layer.tips('不能点击，请拖拽', '#' + $(_this).attr('id'), {
                tips: [1, '#ff0000'],
                time: ''
            });
        }
        return;
    }
};

/**
 * @desc 表格边框的颜色设置
 * @param
 */
function set_table_border_color(infoType, borderColor) {
    if ('latest' === infoType) {
        $('.con-table-info tr:eq(0) td:eq(0)').css('border-color', borderColor);
        $('.con-table-info tr:eq(1) td:eq(0)').css('border-left-color', borderColor);
        $('.con-table-info tr:eq(1) td:eq(1),.con-table-info tr:eq(2) td:eq(0)').css('border-right-color', borderColor);
        $('.con-table-img tr:eq(0) td:eq(0),.con-table-img tr:eq(1) td:eq(0),.con-table-img tr:eq(2) td:eq(0),'
        + '.con-table-img tr:eq(3) td:eq(0),.con-table-img tr:eq(4) td:eq(0),.con-table-img tr:eq(5) td:eq(0)').css({ 'border-left-color': borderColor, 'border-right-color': borderColor });
        $('.con-table-img tr:eq(6) td:eq(0)').css({ 'border-left-color': borderColor, 'border-right-color': borderColor, 'border-bottom-color': borderColor });
    }
    if ('history' === infoType) {
        $('.con-table-info tr:eq(0) td:eq(2)').css('border-color', borderColor);
        $('.con-table-info tr:eq(1) td:eq(3)').css('border-right-color', borderColor);
        $('.con-table-info tr:eq(1) td:eq(3),.con-table-info tr:eq(2) td:eq(2)').css('border-left-color', borderColor);
        $('.con-table-info tr:eq(1) td:eq(4)').css('border-right-color', borderColor);
        $('.con-table-img tr:eq(0) td:eq(2),.con-table-img tr:eq(1) td:eq(1),.con-table-img tr:eq(1) td:eq(2),.con-table-img tr:eq(2) td:eq(2),'
        + '.con-table-img tr:eq(3) td:eq(2),.con-table-img tr:eq(4) td:eq(2),.con-table-img tr:eq(5) td:eq(2)').css({ 'border-left-color': borderColor, 'border-right-color': borderColor });
        $('.con-table-img tr:eq(6) td:eq(2)').css({ 'border-left-color': borderColor, 'border-right-color': borderColor, 'border-bottom-color': borderColor });
    }
}

/**
 * @desc 拖动巡检信息
 * @param
 */
function element_drag() {
    var line_inspect_id = ''; //巡检id

    //拖动事件
    $('.box-car-content .block-drag').draggable({
        connectToSortable: '.info-area',
        helper: 'clone',
        handle: '.drag',
        start: function (e, t) {
            //获取被拖动的巡检id
            line_inspect_id = $(this).find('input[type=hidden]').attr('line-inspect-id');
            set_table_border_color('latest', '#FF0000');
            set_table_border_color('history', '#FF0000');
        },
        drag: function (e, t) {
            var width = $(this).width();
            t.helper.width(width);
        },
        stop: function (e, t) {
            set_table_border_color('latest', '#3671cf');
            set_table_border_color('history', '#12B3EE');

            var clientWidth = document.body.clientWidth; //网页可见区域宽
            var left_min_clientX = 0;
            var left_max_clientX = clientWidth / 2;
            var right_min_clientX = clientWidth / 2;
            var right_max_clientX = clientWidth;

            var box_content_offsetY = $('.box-content').offset().top;
            var clientHeight = document.body.clientHeight; //网页可见区域高
            var left_min_clientY = box_content_offsetY;
            var left_max_clientY = clientHeight;
            var right_min_clientY = box_content_offsetY;
            var right_max_clientY = clientHeight;

            var li = $(this).parent().find('li');

            if (e.clientX >= left_min_clientX && e.clientX <= left_max_clientX && e.clientY >= left_min_clientY && e.clientY <= left_max_clientY) {
                $('#latest-info').attr('latest-line-inspect-id', line_inspect_id);
                show_latest_inspection_img('repeat_play'); //显示最新巡检图像（重复播放）
                
                li.each(function (i) {
                    var _this = $(this);
                    if (_this.hasClass('li-latest-dark-blue')) { //如果是“最新”（深蓝色），则置为“最新”（白色）
                        _this.removeClass('li-latest-dark-blue').removeClass('no-drag').addClass('li-latest-white');
                        _this.draggable('enable'); // 激活其拖动功能
                        return;
                    }
                    if (_this.hasClass('li-history-dark-blue')) { //如果是“历史”（深蓝色），则置为“历史”（白色）
                        _this.removeClass('li-history-dark-blue').removeClass('no-drag').addClass('li-history-white');
                        _this.draggable('enable'); // 激活其拖动功能
                        return;
                    }
                });

                if ($(this).hasClass('li-latest-white')) { //如果拖动的是“最新”（白色），则置为“最新”（深蓝色）
                    $(this).removeClass('li-latest-white').addClass('li-latest-dark-blue').addClass('no-drag');
                    $(this).draggable('disable'); // 禁止其拖动功能
                    $('.con-table-info tr:eq(0) td:eq(0)').html('最新信息');
                    return;
                }
                if ($(this).hasClass('li-history-white')) { //如果拖动的是“历史”（白色），则置为“历史”（深蓝色）
                    $(this).removeClass('li-history-white').addClass('li-history-dark-blue').addClass('no-drag');
                    $(this).draggable('disable'); // 禁止其拖动功能
                    $('.con-table-info tr:eq(0) td:eq(0)').html('历史信息');
                    return;
                }

            }
            if (e.clientX >= right_min_clientX && e.clientX <= right_max_clientX && e.clientY >= right_min_clientY && e.clientY <= right_max_clientY) {
                $('#history-info').attr('history-line-inspect-id', line_inspect_id);
                show_history_inspection_img('repeat_play'); //显示历史巡检图像（重复播放）

                li.each(function (i) {
                    var _this = $(this);
                    if (_this.hasClass('li-latest-blue')) { //如果是“最新”（浅蓝色），则置为“最新”（白色）
                        _this.removeClass('li-latest-blue').removeClass('no-drag').addClass('li-latest-white');
                        _this.draggable('enable'); // 激活其拖动功能
                        return;
                    }
                    if (_this.hasClass('li-history-blue')) { //如果是“历史”（浅蓝色），并置为“历史”（白色）
                        _this.removeClass('li-history-blue').removeClass('no-drag').addClass('li-history-white');
                        _this.draggable('enable'); // 激活其拖动功能
                        return;
                    }
                });

                if ($(this).hasClass('li-latest-white')) { //如果拖动的是“最新”（白色），则置为“最新”（浅蓝色）
                    $(this).removeClass('li-latest-white').addClass('li-latest-blue').addClass('no-drag');
                    $(this).draggable('disable'); // 禁止其拖动功能
                    $('.con-table-info tr:eq(0) td:eq(2)').html('最新信息');
                    return;
                }
                if ($(this).hasClass('li-history-white')) { //如果拖动的是“历史”（白色），则置为“历史”（浅蓝色）
                    $(this).removeClass('li-history-white').addClass('li-history-blue').addClass('no-drag');
                    $(this).draggable('disable'); // 禁止其拖动功能
                    $('.con-table-info tr:eq(0) td:eq(2)').html('历史信息');
                    return;
                }
            }
        }
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


// 分隔


/**
 * @desc 最新巡检详情
 * @param 
 */
function latest_inspection_detail(play_type, lineInspectID, poleCode, ab_surface) {
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
            latest_json_inspect = json;
            if ('repeat_play' === play_type) {
                latest_inspection_detail_repeat_play(latest_json_inspect);
            }
            if ('singleness_play' === play_type) {
                latest_inspection_detail_singleness_play(latest_json_inspect);
            }
            load_ECharts('latest'); //加载最新图表（温度、拉出值、导高值）
        },
        error: function (msg) {
            layer.msg(msg);
        }
    });
}

/**
 * @desc 最新巡检详情（循环播放）
 * @param 
 */
function latest_inspection_detail_repeat_play(latest_json_inspect) {
    if (null === latest_json_inspect || '' === latest_json_inspect) {
        layer.msg('没有数据', {
            time: 800 //0.8秒关闭（如果不配置，默认是3秒）
        });
        //$('#latest-inspect-time').html(''); //发生日期
        //$('#latest-locomotive-code').html(''); //设备编号
        $('#latest-infrared').attr('src', 'img/无图.png'); //最新 红外图像
        $('#latest-infrared-param').html(''); //最新 红外参数
        $('#latest-visible-light').attr('src', 'img/无图.png'); //最新 可见光图像
        $('#latest-panorama').attr('src', 'img/无图.png'); //最新 全景图像
        $('#latest-temperature').html(''); //最新 温度曲线图
        $('#latest-pull-out').html(''); //最新 拉出曲线图
        $('#latest-high-conductivity').html(''); //最新 导高曲线图
        clearInterval(latest_set); //关闭定时器
        reset_latest_variate(); //重置变量值（最新）
    } else {
        if (latest_json_inspect != undefined) {
            latest_imgNum = 0;
            if ($('#latest-slider').length > 0) {
                $('#latest-slider').slider({
                    value: 0,
                    min: 0,
                    max: latest_json_inspect.PLAY_IDX.length - 1,
                    step: 1,
                    range: 'min',
                    slide: function (event, ui) {
                        if (event.keyCode == undefined) { //按钮不执行
                            latest_go_to_frame(parseInt(ui.value));
                        }
                    }
                });
            }

            //最新巡检信息
            //$('#latest-inspect-detail').html('<a href="javascript:void(0)" target="_blank">&laquo;查看详情</a>'); //详情链接
            $('#latest-inspect-time').html(latest_json_inspect.INSPECT_TIME); //检测时间
            $('#latest-locomotive-code').html(latest_json_inspect.LOCOMOTIVE_CODE); //检测设备编码
            $('#latest-note').css('display', 'inline-block'); //显示播放器
            if ('A' === latest_json_inspect.AB_SURFACE) {
                $('#latest-note .j-latest-note-4 img').attr('src', 'img/player_surface_A_hover.png'); //显示A面
            }
            if ('B' === latest_json_inspect.AB_SURFACE) {
                $('#latest-note .j-latest-note-4 img').attr('src', 'img/player_surface_B_hover.png'); //显示B面
            }
            $('#latest-note .note-2 img').attr('src', 'img/player_play.png');

            latest_play_img(); //播放最新图像（红外、可见光、全景）
        }
    }
}

/**
 * @desc 最新巡检详情（播放当前帧的A 面 或 B 面）
 * @param 
 */
function latest_inspection_detail_singleness_play(latest_json_inspect) {

    if('' === latest_json_inspect || undefined === latest_json_inspect){
        layer.msg('没有数据', {
            time: 800 //0.8秒关闭（如果不配置，默认是3秒）
        });
        //$('#latest-inspect-time').html(''); //发生日期
        //$('#latest-locomotive-code').html(''); //设备编号
        $('#latest-infrared').attr('src', 'img/无图.png'); //最新 红外图像
        $('#latest-infrared-param').html(''); //最新 红外参数
        $('#latest-visible-light').attr('src', 'img/无图.png'); //最新 可见光图像
        $('#latest-panorama').attr('src', 'img/无图.png'); //最新 全景图像
        $('#latest-temperature').html(''); //最新 温度曲线图
        $('#latest-pull-out').html(''); //最新 拉出曲线图
        $('#latest-high-conductivity').html(''); //最新 导高曲线图
        clearInterval(latest_set); //关闭定时器
        //reset_latest_variate(); //重置变量值（最新）
    } else {
        //红外参数切换
        $('#latest-infrared-param').html(latest_json_inspect.FRAME_INFO[latest_infrared_param_index]);
        //红外换图
        $('#latest-infrared').attr('src', latest_json_inspect.DLV_IMG_DIR[latest_IR_index]);
        //可见光换图
        $('#latest-visible-light').attr('src', latest_json_inspect.HD_IMG_DIR[latest_VI_index]);
        //全景换图
        if (latest_json_inspect.AB_SURFACE == 'B') {
            $('#latest-panorama').attr('src', latest_json_inspect.OVER_IMG_DIR[latest_OB_index]);
        } else {
            $('#latest-panorama').attr('src', latest_json_inspect.OVER_IMG_DIR[latest_OA_index]);
        }
    }
}

/**
 * @desc 点击跳转到某一帧上（最新）
 * @param 
 */
function latest_go_to_frame(_index) {
    clearInterval(latest_set);
    latest_imgNum = _index;
    latest_isPaly = 0;
    $('#latest-note .note-2').find('img').attr('src', 'img/player_play.png');

    latest_img_detail();
};

/**
 * @desc 关闭定时器（最新）
 * @param 
 */
function latest_suspended() {
    clearInterval(latest_set); //关闭定时器
}

/**
 * @desc 重置播放器状态（最新）
 * @param 
 */
function reset_latest_player_status() {
    clearInterval(latest_set); //关闭定时器
    reset_latest_variate(); //重置变量值（最新）
}

/**
 * @desc 重置变量值（最新）
 * @param 
 */
function reset_latest_variate() {
    //播放器变量
    latest_imgNum = 0; //最新图片计数
    latest_isPaly = 1; //播放控制
    //图片变量
    latest_IR_index = 0; //红外帧
    latest_VI_index = 0; //可见帧
    latest_OA_index = 0; //全景帧A
    latest_OB_index = 0; //全景帧B
    latest_infrared_param_index = 0; //红外参数
}

/**
 * @desc 播放最新图像
 * @param 
 */
function latest_play_img() {
    latest_img_detail(); //最新图像详情

    latest_imgNum++; //图片数量
    latest_infrared_param_index++;//红外参数
    latest_IR_index++;//红外
    latest_VI_index++;//可见光
    latest_OA_index++;//全景A
    latest_OB_index++;//全景B

    clearInterval(latest_set);//关闭定时器 
    latest_set = setInterval('latest_play_img()', 500); //重新设置定时器
}

/**
 * @desc 最新图像详情
 * @param 
 */
function latest_img_detail() {
    if (latest_imgNum >= latest_json_inspect.PLAY_IDX.length) {
        latest_imgNum = 0; //图片数量
        latest_infrared_param_index = 0;//红外参数
        latest_IR_index = 0;//红外
        latest_VI_index = 0;//可见光
        latest_OA_index = 0;//全景A
        latest_OB_index = 0;//全景B
    }
    if(latest_imgNum < 0){
        var play_idx = latest_json_inspect.PLAY_IDX.length - 1;
        latest_imgNum = play_idx;
        latest_infrared_param_index = play_idx;//红外参数
        latest_IR_index = play_idx;//红外
        latest_VI_index = play_idx;//可见光
        latest_OA_index = play_idx;//全景A
        latest_OB_index = play_idx;//全景B
    }

    if ($('#latest-slider').length > 0) {
        $('#latest-slider').slider('value', latest_imgNum);
        $('#latest-slider').slider({ range: 'min' });
    }

    latest_inspection_detail_singleness_play(latest_json_inspect);

    if ($('#latest-infrared-param').length > 0) {
        $('#latest-infrared-param').html();
    }
}

/**
 * @desc 上一张（最新）
 * @param 
 */
function latest_prev_img() {
    latest_imgNum--;
    latest_infrared_param_index--;//红外参数
    latest_IR_index--;//红外
    latest_VI_index--;//可见光
    latest_OA_index--;//全景A
    latest_OB_index--;//全景B

    latest_play_img();
}

/**
 * @desc 播放或暂停最新图像
 * @param 
 */
function latest_play_or_pause_img() {
    if (latest_isPaly == '1') {
        latest_isPaly = 0;
        latest_suspended(); //关闭定时器
        $('#latest-note .note-2').find('img').attr('src', 'img/player_pause.png');
    } else {
        latest_isPaly = 1;
        latest_play_img();
        $('#latest-note .note-2').find('img').attr('src', 'img/player_play.png');
    }
}

/**
 * @desc 下一张（最新）
 * @param 
 */
function latest_after_img() {
    latest_play_img();
}

/**
 * @desc 最新播放器点击事件
 * @param
 */
function latest_player_click() {
    //上一张（最新）
    $('.j-latest-note-1').click(function () {
        if (latest_imgNum > 0) {
            latest_imgNum--;
            latest_infrared_param_index--;//红外参数
            latest_IR_index--;//红外
            latest_VI_index--;//可见光
            latest_OA_index--;//全景A
            latest_OB_index--;//全景B
        }
        latest_prev_img();
        latest_suspended();
        latest_isPaly = 0;
        if ($('.j-latest-note-3').find('img').attr('src') == 'img/player_after_hover.png') {
            $('.j-latest-note-3').find('img').attr('src', 'img/player_after.png');
        }
        $('.j-latest-note-1').find('img').attr('src', 'img/player_prev_hover.png');
        $('#latest-note .note-2').find('img').attr('src', 'img/player_pause.png');
    });
    //播放、暂停（最新）
    $('.j-latest-note-2,.j-latest-infrared,.j-latest-visible-light,.j-latest-panorama').click(function () {
        latest_play_or_pause_img();
        $('.j-latest-note-1').find('img').attr('src', 'img/player_prev.png');
        $('.j-latest-note-3').find('img').attr('src', 'img/player_after.png');
    });
    //下一张（最新）
    $('.j-latest-note-3').click(function () {
        if (latest_imgNum > latest_json_inspect.PLAY_IDX.length - 1) {
            latest_imgNum = 0;
            latest_infrared_param_index = 0;//红外参数
            latest_IR_index = 0;//红外
            latest_VI_index = 0;//可见光
            latest_OA_index = 0;//全景A
            latest_OB_index = 0;//全景B
        }
        latest_after_img();
        latest_suspended();
        latest_isPaly = 0;
        if ($('.j-latest-note-1').find('img').attr('src') == 'img/player_prev_hover.png') {
            $('.j-latest-note-1').find('img').attr('src', 'img/player_prev.png');
        }
        $('.j-latest-note-3').find('img').attr('src', 'img/player_after_hover.png');
        $('#latest-note .note-2').find('img').attr('src', 'img/player_pause.png');
    });
    //正面（最新）
    $('.j-latest-note-4').click(function () {
        latest_ab_surface = 'A';
        $('#latest-default-surface').attr('surface', 'A');

        if(latest_isPaly == 1){
            reset_latest_player_status(); //重置播放器状态（最新）
            $('#latest-slider').slider('value', '0');
            show_latest_inspection_img('repeat_play'); //显示最新巡检图像 （重复播放）
        } else {
            show_latest_inspection_img('singleness_play'); //显示最新巡检图像（播放当前帧的A面） 
        }

        if ($('.j-latest-note-1').find('img').attr('src') == 'img/player_prev_hover.png') {
            $('.j-latest-note-1').find('img').attr('src', 'img/player_prev.png');
        }
        if ($('.j-latest-note-3').find('img').attr('src') == 'img/player_after_hover.png') {
            $('.j-latest-note-3').find('img').attr('src', 'img/player_after.png');
        }
        if ($('.j-latest-note-5').find('img').attr('src') == 'img/player_surface_B_hover.png') {
            $('.j-latest-note-5').find('img').attr('src', 'img/player_surface_B.png');
        }
        $('.j-latest-note-4').find('img').attr('src', 'img/player_surface_A_hover.png');
    });
    //反面（最新）
    $('.j-latest-note-5').click(function () {
        latest_ab_surface = 'B';
        $('#latest-default-surface').attr('surface', 'B');

        if (latest_isPaly == 1) {
            reset_latest_player_status(); //重置播放器状态（最新）
            $('#latest-slider').slider('value', '0');
            show_latest_inspection_img('repeat_play'); //显示最新巡检图像 （重复播放）
        } else {
            show_latest_inspection_img('singleness_play'); //显示最新巡检图像 （播放当前帧的B面）
        }

        if ($('.j-latest-note-1').find('img').attr('src') == 'img/player_prev_hover.png') {
            $('.j-latest-note-1').find('img').attr('src', 'img/player_prev.png');
        }
        if ($('.j-latest-note-3').find('img').attr('src') == 'img/player_after_hover.png') {
            $('.j-latest-note-3').find('img').attr('src', 'img/player_after.png');
        }
        if ($('.j-latest-note-4').find('img').attr('src') == 'img/player_surface_A_hover.png') {
            $('.j-latest-note-4').find('img').attr('src', 'img/player_surface_A.png');
        }
        $('.j-latest-note-5').find('img').attr('src', 'img/player_surface_B_hover.png');
    });
}


// 分隔


/**
 * @desc 历史巡检详情
 * @param 
 */
function history_inspection_detail(play_type, lineInspectID, poleCode, ab_surface) {
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
            history_json_inspect = json;
            if ('repeat_play' === play_type) {
                history_inspection_detail_repeat_play(history_json_inspect);
            }
            if ('singleness_play' === play_type) {
                history_inspection_detail_singleness_play(history_json_inspect);
            }
            load_ECharts('history'); //加载历史图表（温度、拉出值、导高值）
        },
        error: function (msg) {
            layer.msg(msg);
        }
    });
}

/**
 * @desc 历史巡检详情（循环播放）
 * @param 
 */
function history_inspection_detail_repeat_play(history_json_inspect) {
    if (null === history_json_inspect || '' === history_json_inspect) {
        layer.msg('没有数据', {
            time: 800 //0.8秒关闭（如果不配置，默认是3秒）
        });
        //$('#history-inspect-time').html(''); //发生日期
        //$('#history-locomotive-code').html(''); //设备编号
        $('#history-infrared').attr('src', 'img/无图.png'); //历史 红外图像
        $('#history-infrared-param').html(''); //历史 红外参数
        $('#history-visible-light').attr('src', 'img/无图.png'); //历史 可见光图像
        $('#history-panorama').attr('src', 'img/无图.png'); //历史 全景图像
        $('#history-temperature').html(''); //历史 温度曲线图
        $('#history-pull-out').html(''); //历史 拉出曲线图
        $('#history-high-conductivity').html(''); //历史 导高曲线图
        clearInterval(history_set); //关闭定时器
        reset_history_variate(); //重置变量值（历史）
    } else {
        if (history_json_inspect != undefined) {
            history_imgNum = -1;
            if ($('#history-slider').length > 0) {
                $('#history-slider').slider({
                    value: 0,
                    min: 0,
                    max: history_json_inspect.PLAY_IDX.length - 1,
                    step: 1,
                    range: 'min',
                    slide: function (event, ui) {
                        if (event.keyCode == undefined) { //按钮不执行
                            history_go_to_frame(parseInt(ui.value));
                        }
                    }
                });
            }

            //历史巡检信息
            //$('#history-inspect-detail').html('<a href="javascript:void(0)" target="_blank">&laquo;查看详情</a>'); //详情链接
            $('#history-inspect-time').html(history_json_inspect.INSPECT_TIME); //检测时间
            $('#history-locomotive-code').html(history_json_inspect.LOCOMOTIVE_CODE); //检测设备编码
            $('#history-note').css('display', 'inline-block'); //显示播放器
            if ('A' === history_json_inspect.AB_SURFACE) {
                $('#history-note .j-history-note-4 img').attr('src', 'img/player_surface_A_hover.png'); //显示A面
            }
            if ('B' === history_json_inspect.AB_SURFACE) {
                $('#history-note .j-history-note-4 img').attr('src', 'img/player_surface_B_hover.png'); //显示B面
            }
            $('#history-note .note-2 img').attr('src', 'img/player_play.png');

            history_play_img(); //播放历史图像（红外、可见光、全景）
        }
    }
}

/**
 * @desc 历史巡检详情（播放当前帧的A 面 或 B 面）
 * @param 
 */
function history_inspection_detail_singleness_play(history_json_inspect) {
    if ('' === history_json_inspect || undefined === history_json_inspect) {
        layer.msg('没有数据', {
            time: 800 //0.8秒关闭（如果不配置，默认是3秒）
        });
        //$('#history-inspect-time').html(''); //发生日期
        //$('#history-locomotive-code').html(''); //设备编号
        $('#history-infrared').attr('src', 'img/无图.png'); //历史 红外图像
        $('#history-infrared-param').html(''); //历史 红外参数
        $('#history-visible-light').attr('src', 'img/无图.png'); //历史 可见光图像
        $('#history-panorama').attr('src', 'img/无图.png'); //历史 全景图像
        $('#history-temperature').html(''); //历史 温度曲线图
        $('#history-pull-out').html(''); //历史 拉出曲线图
        $('#history-high-conductivity').html(''); //历史 导高曲线图
        //clearInterval(history_set); //关闭定时器
        //reset_history_variate(); //重置变量值（历史）
    } else {
        // 红外参数切换
        $('#history-infrared-param').html(history_json_inspect.FRAME_INFO[history_infrared_param_index]);
        //红外换图
        $('#history-infrared').attr('src', history_json_inspect.DLV_IMG_DIR[history_IR_index]);
        //可见光换图
        $('#history-visible-light').attr('src', history_json_inspect.HD_IMG_DIR[history_VI_index]);
        //全景换图
        if (history_json_inspect.AB_SURFACE == 'B') {
            $('#history-panorama').attr('src', history_json_inspect.OVER_IMG_DIR[history_OB_index]);
        } else {
            $('#history-panorama').attr('src', history_json_inspect.OVER_IMG_DIR[history_OA_index]);
        }
    }
}

/**
 * @desc 点击跳转到某一帧上（历史）
 * @param 
 */
function history_go_to_frame(_index) {
    clearInterval(latest_set);
    history_imgNum = _index;
    history_isPaly = 0;
    $('#history-note .note-2').find('img').attr('src', 'img/player_play.png');

    history_img_detail();
};

/**
 * @desc 关闭定时器（历史）
 * @param 
 */
function history_suspended() {
    clearInterval(history_set); //关闭定时器
}

/**
 * @desc 重置播放器状态（历史）
 * @param 
 */
function reset_history_player_status() {
    clearInterval(history_set); //关闭定时器
    reset_history_variate(); //重置变量值（历史）
}

/**
 * @desc 重置变量值（历史）
 * @param 
 */
function reset_history_variate() {
    //播放器变量
    history_imgNum = -1; //历史图片计数
    history_isPaly = 1; //播放控制
    //播放器变量
    history_IR_index = -1; //红外帧
    history_VI_index = -1; //可见帧
    history_OA_index = -1; //全景帧A
    history_OB_index = -1; //全景帧B
    history_infrared_param_index = -1; //红外参数
}

/**
 * @desc 播放历史图像
 * @param 
 */
function history_play_img() {
    history_imgNum++;
    history_infrared_param_index++;//红外参数
    history_IR_index++;//红外
    history_VI_index++;//可见光
    history_OA_index++;//全景A
    history_OB_index++;//全景B

    history_img_detail(); //最新图像详情

    clearInterval(history_set); //关闭定时器 
    history_set = setInterval('history_play_img()', 500);
}

/**
 * @desc 历史图像详情
 * @param 
 */
function history_img_detail() {
    if (history_imgNum >= history_json_inspect.PLAY_IDX.length) {
        history_imgNum = 0;
        history_infrared_param_index = 0;//红外参数
        history_IR_index = 0;//红外
        history_VI_index = 0;//可见光
        history_OA_index = 0;//全景A
        history_OB_index = 0;//全景B
    }
    if (history_imgNum < 0) {
        var play_idx = history_json_inspect.PLAY_IDX.length - 1;
        history_imgNum = play_idx;
        history_infrared_param_index = play_idx;//红外参数
        history_IR_index = play_idx;//红外
        history_VI_index = play_idx;//可见光
        history_OA_index = play_idx;//全景A
        history_OB_index = play_idx;//全景B
    }

    if ($('#history-slider').length > 0) {
        $('#history-slider').slider('value', history_imgNum);
        $('#history-slider').slider({ range: 'min' });
    }

    history_inspection_detail_singleness_play(history_json_inspect);

    if ($('#history-infrared-param').length > 0) {
        $('#history-infrared-param').html();
    }
}

/**
 * @desc 上一张（历史）
 * @param 
 */
function history_prev_img() {
    history_imgNum--;
    history_infrared_param_index--;//红外参数
    history_IR_index--;//红外
    history_VI_index--;//可见光
    history_OA_index--;//全景A
    history_OB_index--;//全景B

    history_play_img();
}

/**
 * @desc 播放或暂停历史图像
 * @param 
 */
function history_play_or_pause_img() {
    if (history_isPaly == '1') {
        history_isPaly = 0;
        history_suspended();
        $('#history-note .note-2').find('img').attr('src', 'img/player_pause.png');
    } else {
        history_isPaly = 1;
        history_play_img();
        $('#history-note .note-2').find('img').attr('src', 'img/player_play.png');
    }
}

/**
 * @desc 下一张（历史）
 * @param 
 */
function history_after_img() {
    history_play_img();
}

/**
 * @desc 历史播放器点击事件
 * @param
 */
function history_player_click() {
    //上一张（历史）
    $('.j-history-note-1').click(function () {
        if (history_imgNum > -1) {
            history_imgNum--;
            history_infrared_param_index--;//红外参数
            history_IR_index--;//红外
            history_VI_index--;//可见光
            history_OA_index--;//全景A
            history_OB_index--;//全景B
        }
        history_prev_img();
        history_suspended();
        history_isPaly = 0;
        if ($('.j-history-note-3').find('img').attr('src') == 'img/player_after_hover.png') {
            $('.j-history-note-3').find('img').attr('src', 'img/player_after.png');
        }
        $('.j-history-note-1').find('img').attr('src', 'img/player_prev_hover.png');
        $('#history-note .note-2').find('img').attr('src', 'img/player_pause.png');
    });
    //播放、暂停（历史）
    $('.j-history-note-2,.j-history-infrared,.j-history-visible-light,.j-history-panorama').click(function () {
        history_play_or_pause_img();
        $('.j-history-note-1').find('img').attr('src', 'img/player_prev.png');
        $('.j-history-note-3').find('img').attr('src', 'img/player_after.png');
    });
    //下一张（历史）
    $('.j-history-note-3').click(function () {
        if (history_imgNum > history_json_inspect.PLAY_IDX.length - 1) {
            history_imgNum = 0;
            history_infrared_param_index = 0;//红外参数
            history_IR_index = 0;//红外
            history_VI_index = 0;//可见光
            history_OA_index = 0;//全景A
            history_OB_index = 0;//全景B
        }
        history_after_img();
        history_suspended();
        history_isPaly = 0;
        if ($('.j-history-note-1').find('img').attr('src') == 'img/player_prev_hover.png') {
            $('.j-history-note-1').find('img').attr('src', 'img/player_prev.png');
        }
        $('.j-history-note-3').find('img').attr('src', 'img/player_after_hover.png');
        $('#history-note .note-2').find('img').attr('src', 'img/player_pause.png');
    });
    //正面（历史）
    $('.j-history-note-4').click(function () {
        history_ab_surface = 'A';
        $('#history-default-surface').attr('surface', 'A');

        if (history_isPaly == 1) {
            reset_history_player_status(); //重置播放器状态（历史）
            $('#history-slider').slider('value', '0');
            show_history_inspection_img('repeat_play'); //显示历史巡检图像（重复播放）
        } else {
            show_history_inspection_img('singleness_play');//显示历史巡检图像（播放当前帧的A面）
        }

        if ($('.j-history-note-5').find('img').attr('src') == 'img/player_surface_B_hover.png') {
            $('.j-history-note-5').find('img').attr('src', 'img/player_surface_B.png');
        }
        $('.j-history-note-4').find('img').attr('src', 'img/player_surface_A_hover.png');
    });
    //反面（历史）
    $('.j-history-note-5').click(function () {
        history_ab_surface = 'B';
        $('#history-default-surface').attr('surface', 'B');

        if(history_isPaly == 1){
            reset_history_player_status(); //重置播放器状态（历史）
            $('#history-slider').slider('value', '0');
            show_history_inspection_img('repeat_play'); //显示历史巡检图像（重复播放）
        } else {
            show_history_inspection_img('singleness_play');//显示历史巡检图像（播放当前帧的B面）
        }

        if ($('.j-history-note-4').find('img').attr('src') == 'img/player_surface_A_hover.png') {
            $('.j-history-note-4').find('img').attr('src', 'img/player_surface_A.png');
        }
        $('.j-history-note-5').find('img').attr('src', 'img/player_surface_B_hover.png');
    });
}


//分隔


/**
 * @desc 播放器按钮图片切换（hover效果）
 * @param
 */
function player_img_switch() {
    //上一张
    $('.note-1').hover(function () {
        $(this).find('img').attr('src', 'img/player_prev_hover.png');
    }, function () {
        $(this).find('img').attr('src', 'img/player_prev.png');
    });
    //播放、暂停
    $('.note-2').hover(function () {
        var img = $(this).find('img').attr('src');
        if (img == 'img/player_play.png') {
            $(this).find('img').attr('src', 'img/player_play_hover.png');
        }
        if (img == 'img/player_pause.png') {
            $(this).find('img').attr('src', 'img/player_pause_hover.png');
        }
    }, function () {
        var img = $(this).find('img').attr('src');
        if (img == 'img/player_play_hover.png') {
            $(this).find('img').attr('src', 'img/player_play.png');
        }
        if (img == 'img/player_pause_hover.png') {
            $(this).find('img').attr('src', 'img/player_pause.png');
        }
    });
    //下一张
    $('.note-3').hover(function () {
        $(this).find('img').attr('src', 'img/player_after_hover.png');
    }, function () {
        $(this).find('img').attr('src', 'img/player_after.png');
    });
    //正面
    $('.note-4').hover(function () {
        $(this).find('img').attr('src', 'img/player_surface_A_hover.png');
    }, function () {
        $(this).find('img').attr('src', 'img/player_surface_A.png');
    });
    //反面
    $('.note-5').hover(function () {
        $(this).find('img').attr('src', 'img/player_surface_B_hover.png');
    }, function () {
        $(this).find('img').attr('src', 'img/player_surface_B.png');
    });
}


//分隔


// echarts路径配置
//require.config({
//    paths: {
//        'echarts': '/Lib/Echarts-2.0/2.0/echarts',
//        'echarts/chart/line': '/Lib/Echarts-2.0/2.0/echarts'
//    }
//});
//require(['echarts', 'echarts/chart/line'], function (ec) {
//    ECharts = ec;
//});

/**
 * @desc 温度曲线图
 * @param
 */
function Echarts_temperature(info_type, elementId, json_inspect) {
    var myEchart_temperature = echarts.init(document.getElementById(elementId));

    var str_X = '[';
    for (var i = 1; i <= json_inspect.FRAME_INFO_LIST.length; i++) {
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
    for (var i = 0; i < json_inspect.FRAME_INFO_LIST.length; i++) {
        if (i == 0) {
            str_data += json_inspect.FRAME_INFO_LIST[i].MXIRTEMP.replace('℃', '');
        }
        else {
            str_data += ',' + json_inspect.FRAME_INFO_LIST[i].MXIRTEMP.replace('℃', '');
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
            scale: true, //脱离0值比例
            precision: 2, //小数精度，默认为0，无小数点
            min: 0,
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
            boundaryGap: [0.05, 0.05], //坐标轴两端空白策略，数组内数值代表百分比，[原始数据最小值与最终最小值之间的差额，原始数据最大值与最终最大值之间的差额]
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
    myEchart_temperature.setOption(option);
    myEchart_temperature.on('click', function (params) { eConsole(params, info_type) });
}

/**
 * @desc 拉出值线图
 * @param
 */
function Echarts_pullOut(info_type, elementId, json_inspect) {
    var myEchart_pullOut = echarts.init(document.getElementById(elementId));

    var str_X = '[';
    for (var i = 1; i <= json_inspect.FRAME_INFO_LIST.length; i++) {
        if (json_inspect.FRAME_INFO_LIST[i - 1].PVALUE.toString() == '' || json_inspect.FRAME_INFO_LIST[i - 1].PVALUE == '-1000') {
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
    for (var i = 0; i < json_inspect.FRAME_INFO_LIST.length; i++) {
        if (json_inspect.FRAME_INFO_LIST[i].PVALUE.toString() == '' || json_inspect.FRAME_INFO_LIST[i].PVALUE == '-1000') {
            continue;
        }
        if (str_data == '[') {
            str_data += json_inspect.FRAME_INFO_LIST[i].PVALUE.replace('mm', '');
        }
        else {
            str_data += ',' + json_inspect.FRAME_INFO_LIST[i].PVALUE.replace('mm', '');
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
    }
    myEchart_pullOut.setOption(option);
    myEchart_pullOut.on('click', function (params) { eConsole(params, info_type) });
}

/**
 * @desc 导高值曲线图
 * @param
 */
function Echarts_highConductivity(info_type, elementId, json_inspect) {
    var myEchart_highConductivity = echarts.init(document.getElementById(elementId));

    var str_X = '[';
    for (var i = 1; i <= json_inspect.FRAME_INFO_LIST.length; i++) {
        if (json_inspect.FRAME_INFO_LIST[i - 1].HVALUE.toString() == '' || json_inspect.FRAME_INFO_LIST[i - 1].HVALUE == '-1000') {
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
    for (var i = 0; i < json_inspect.FRAME_INFO_LIST.length; i++) {
        if (json_inspect.FRAME_INFO_LIST[i].HVALUE.toString() == '' || json_inspect.FRAME_INFO_LIST[i].HVALUE == '-1000') {
            continue;
        }
        if (str_data == '[') {
            str_data += json_inspect.FRAME_INFO_LIST[i].HVALUE.replace('mm', '');
        }
        else {
            str_data += ',' + json_inspect.FRAME_INFO_LIST[i].HVALUE.replace('mm', '');
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
            axisLine: { show: true }
        }],
        series: [{
            name: '导高值',
            type: 'line',
            showAllSymbol: true,
            data: _data
        }]
    }
    myEchart_highConductivity.setOption(option);
    myEchart_highConductivity.on('click', function (params) { eConsole(params, info_type) });
}


//分隔


//获取url数据
function GetRequest() {
    var url = location.search; //获取url中'?'符后的字串 
    var theRequest = new Object();
    if (url.indexOf('?') != -1) {
        var str = url.substr(1);
        strs = str.split('&');
        for (var i = 1; i < strs.length; i++) {
            theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
        }
    }
    return theRequest;
}

/**
 * @desc 点击echart图表数据执行的方法
 * @param 
 */
function eConsole(e, info_type) {
    if ('latest' === info_type) {
        var _index = parseInt(e.dataIndex); //点击的序号  与帧号对应。
        for (var i = 0; i < latest_json_inspect.PLAY_IDX.length; i++) { //计算出播放序列数组对应项。
            if (latest_json_inspect.PLAY_IDX[i].FRAME_NO == _index - 3) { //找到对应的序号。
                latest_imgNum = i; //最新图片计数
                latest_IR_index = i; //红外帧
                latest_VI_index = i; //可见帧
                latest_OA_index = i; //全景帧A
                latest_OB_index = i; //全景帧B
                latest_infrared_param_index = i; //红外参数
                break;
            }
        }
        latest_play_img(); //播放巡检图像
        latest_suspended(); //关闭定时器
        latest_isPaly = 0;
        if ($('.j-latest-note-1').find('img').attr('src') == 'img/player_prev_hover.png') {
            $('.j-latest-note-1').find('img').attr('src', 'img/player_prev.png');
        }
        //$('.j-latest-note-3').find('img').attr('src', 'img/player_after_hover.png');
        $('#latest-note .note-2').find('img').attr('src', 'img/player_pause.png');
    }
    if ('history' === info_type) {
        var _index = parseInt(e.dataIndex); //点击的序号  与帧号对应。
        for (var i = 0; i < history_json_inspect.PLAY_IDX.length; i++) { //计算出播放序列数组对应项。
            if (history_json_inspect.PLAY_IDX[i].FRAME_NO == _index - 3) { //找到对应的序号。
                history_imgNum = i - 1; //历史图片计数
                history_IR_index = i - 1; //红外帧
                history_VI_index = i - 1; //可见帧
                history_OA_index = i - 1; //全景帧A
                history_OB_index = i - 1; //全景帧B
                history_infrared_param_index = i - 1; //红外参数
                break;
            }
        }
        history_play_img(); //播放巡检图像
        history_suspended(); //关闭定时器
        history_isPaly = 0;
        if ($('.j-history-note-1').find('img').attr('src') == 'img/player_prev_hover.png') {
            $('.j-history-note-1').find('img').attr('src', 'img/player_prev.png');
        }
        //$('.j-history-note-3').find('img').attr('src', 'img/player_after_hover.png');
        $('#history-note .note-2').find('img').attr('src', 'img/player_pause.png');
    }
}