
// 请求路径的参数
var theString = GetRequest();
var device_number = ''; //设备编号
var org_type = ''; //组织机构类型
var org_code = ''; //组织机构代码
var line_position_type = ''; //线路类型
var line_position_code = ''; //线路代码
var s_time = ''; //开始时间
var e_time = ''; //结束时间
var delay_type = 'MAXFILEDELAY'; //延时类型
var min_delay = -1; //最小耗时
var max_delay = -1; //最大耗时
var html_name = 'AlarmDelayDetails'; //页面名称

var pageSize = 8; //一页显示条数
var pageIndex; //某页
var _index_time = ''; //提示框基数
var order_way = 'DESC'; //排序方式
var order_field = 'MAXFILEDELAY'; //排序字段
var _html_head = ''; //表头

$(document).ready(function () {

    //获取请求的参数
    html_name = theString.htmlName;
    if ('' === html_name || undefined === html_name) {
        html_name = 'AlarmDelayDetails';
    }
    //初始化控件
    initControls();

    //初始化表格
    initTable(createTableHead('default'), html_name);

    //按条件查询报警详情
    $('.j-query-alarm').click(function () {
        initTable(createTableHead('default'), html_name);
    });

    //进入报警详情
    $(document).on('click', '.j-to-alarm-details', function () {
        var alarm_id = $(this).attr('alarm-id');
        var alarm_details_id = $(this).attr('id');
        if ('' === alarm_id) {
            var _index_t = tip('没有数据', '#' + alarm_details_id, 3000, 'top');
            $('#layui-layer' + _index_t + ' .layui-layer-content').css({ 'min-width': '20px', 'width': '55px' });
        } else {
            var url = '/C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=' + $(this).attr('alarm-id');
            window.open(url);
        }
    });

    //表格内容提示
    $(document).on('mouseenter', '.j-time', function () {
        var time_id = $(this).attr('id');
        var data = $(this).attr('data').split(',');
        var max_length = 0; //最大长度
        var field_name = []; //字段名
        var field_time = []; //字段时间
        var str = ''; //字符串
        for (var i = 0; i < data.length; i++) {
            var field = data[i].split('：');
            field_name[i] = field[0] + '：';
            field_time[i] = field[1];

            var txt_length = field[0].length;
            if (txt_length > max_length) {
                max_length = txt_length;
            }
        }
        var width = '';
        var width2 = '';
        if (data.length === 2) {
            width = '133px';
            width2 = (253 - 133) + 'px';
        } else {
            width = max_length * 13 + 'px';
            width2 = (253 - max_length * 13) + 'px';
        }

        for (var j = 0; j < data.length; j++) {
            str += '<span style="display:block;width:99%;"><span style="display:inline-block;width:' + width + ';text-align:right">' + field_name[j] + '</span><span style="display:inline-block;text-align:left;  word-break: break-all; width: ' + width2 + '; vertical-align: top;">' + field_time[j] + '</span></span>';
        }

        if (undefined !== $(this).attr('category') && 'ANA_TIME' === $(this).attr('category')) {
            _index_time = tip(str, '#' + time_id, '', 'top', 'right');
        } else {
            _index_time = tip(str, '#' + time_id, '', 'top');
        }
    });
    $(document).on('mouseleave', '.j-time', function () {
        layer.close(_index_time);
    });

    //排序
    $(document).on('click', '.j-order', function () {
        var _this = $(this);
        var child_span = _this.find('span');
        var arr = [];
        order_field = child_span.attr('order-field'); //排序字段
        var child_ranking = child_span.attr('ranking'); //排位

        if (!child_span.hasClass('arrow-down-cur') && !child_span.hasClass('arrow-up-cur')) {
            order_way = 'DESC'; //降序
            arr = initOrder(child_ranking, 'arrow-down-cur');
            initTable(createTableHead('customize', arr), html_name);
            return;
        }
        if (child_span.hasClass('arrow-down-cur') && !child_span.hasClass('arrow-up-cur')) {
            order_way = 'ASC'; //升序
            arr = initOrder(child_ranking, 'arrow-up-cur');
            initTable(createTableHead('customize', arr), html_name);
            return;
        }
        if (!child_span.hasClass('arrow-down-cur') && child_span.hasClass('arrow-up-cur')) {
            order_way = 'DESC'; //降序
            arr = initOrder(child_ranking, 'arrow-down-cur');
            initTable(createTableHead('customize', arr), html_name);
            return;
        }
    });

    //展开行与折叠行
    $(document).on('click', '.j-switch', function () {
        var status = $(this).attr('status');
        var class_name = $(this).parent().parent().attr('class');
        class_name = class_name.split(' ')[0]; //获取第一个class
        var number = class_name.split('_')[1];
        if ('tr-open' === status) { //关闭行
            //关闭当前行
            $(this).attr('status', 'tr-close');
            if ($(this).hasClass('arrow-right') && !$(this).hasClass('arrow-down')) {
                $(this).removeClass('arrow-right').addClass('arrow-down');
            }
            var arr = $(this).parent().parent().siblings();
            for (var i = 0; i < arr.length; i++) {
                if ($(arr[i]).hasClass('similar_' + number)) {
                    $(arr[i]).hide();
                }
            }
            $(this).parent().attr('rowspan', '0');
            $(this).parent().next().attr('rowspan', '0');
            return;
        }
        if ('tr-close' === status) { //打开行
            //打开当前行
            $(this).attr('status', 'tr-open');
            if (!$(this).hasClass('arrow-right') && $(this).hasClass('arrow-down')) {
                $(this).addClass('arrow-right').removeClass('arrow-down');
            }
            var arr = $(this).parent().parent().siblings();
            for (var i = 0; i < arr.length; i++) {
                if ($(arr[i]).hasClass('similar_' + number)) {
                    $(arr[i]).show();
                }
            }
            $(this).parent().attr('rowspan', '10');
            $(this).parent().next().attr('rowspan', '10');
            return;
        }
    });

    //移入行背景色改变
    $(document).on('mouseenter', '.j-similar-tr-bg', function () {
        $(this).css('background-color', '#d9ebf5');
    });
    $(document).on('mouseleave', '.j-similar-tr-bg', function () {
        $(this).css('background-color', '#fff');
    });
    $(document).on('mouseenter', '.j-top-td-bg', function () {
        var td = $(this).parent().find('td');
        for (var c = 2; c < td.length; c++) {
            $(td[c]).css('background-color', '#d9ebf5');
        }
    });
    $(document).on('mouseleave', '.j-top-td-bg', function () {
        var td = $(this).parent().find('td');
        for (var c = 2; c < td.length; c++) {
            $(td[c]).css('background-color', '#fff');
        }
    });

});

/**
 * @desc 初始化表格中的排序箭头
 * @param 
 */
function initOrder(ranking, element_class) {
    var arr = [];
    for (var j = 0; j < 6; j++) {
        if (parseInt(ranking) === j) {
            arr[j] = element_class + ',color-blue';
        } else {
            arr[j] = 'arrow-down-defult,N';
        }
    }
    return arr;
}

/**
 * @desc 初始化表格
 * @param 
 */
function initTable(_html_head, htmlName) {
    device_number = $('#device-number').val(); //设备编号

    org_type = $('#organization').attr('treetype'); //组织机构类型
    org_code = ''; //组织机构代码
    if (org_type === 'TOPBOSS') {
        org_code = $('#organization').attr('code'); //总公司
        org_type = ''; //?
    } else if (org_type === 'YSJ') {
        org_code = $('#organization').attr('code'); //部
        org_type = ''; //?
    } else if (org_type === 'J') {
        org_code = $('#organization').attr('code'); //局
        org_type = 'BUREAU_CODE';
    } else {
        org_code = $('#organization').attr('code'); //段
        org_type = 'ORG_CODE';
    }

    line_position_type = $('#line-position').attr('treetype'); //线路区站类型
    line_position_code = $('#line-position').attr('code'); //线路代码
    if ('' !== line_position_type && line_position_type === 'LINE') {
        line_position_code = $('#line-position').attr('code'); //线
        line_position_type = 'LINE_CODE';
    }
    if ('' !== line_position_type && line_position_type === 'POSITION') {
        line_position_code = $('#line-position').attr('code'); //站
        line_position_type = 'POSITION_CODE';
    }

    s_time = $('#s-time').val(); //开始时间
    e_time = $('#e-time').val(); //结束时间
    if ('' !== s_time && '' !== e_time) {
        if (s_time > e_time) {
            tip('开始时间须小于结束时间', '#s-time', 3000, 'top');
            $('.layui-layer-tips .layui-layer-content').css({ 'min-width': '12px' });
            return;
        }
    }
    if ('' === s_time) {
        tip('请选择发生时间', '#s-time', 3000, 'top');
        $('.layui-layer-tips .layui-layer-content').css({ 'min-width': '12px' });
        return;
    }
    if ('' === e_time) {
        tip('请选择发生时间', '#e-time', 3000, 'top');
        $('.layui-layer-tips .layui-layer-content').css({ 'min-width': '12px' });
        return;
    }

    delay_type = $('#delay-type').val(); //延时类型

    min_delay = $('#min-delay').val(); //最小延时
    min_delay = $.trim(min_delay);
    if (isNaN(min_delay)) {
        tip('请输入数字', '#min-delay', 3000, 'top');
        $('.layui-layer-tips .layui-layer-content').css({ 'min-width': '12px' });
        return;
    }

    max_delay = $('#max-delay').val(); //最大延时
    max_delay = $.trim(max_delay);
    if (isNaN(max_delay)) {
        tip('请输入数字', '#max-delay', 3000, 'top');
        $('.layui-layer-tips .layui-layer-content').css({ 'min-width': '12px' });
        return;
    }

    if ('' !== min_delay && '' !== max_delay) {
        if (parseInt(min_delay) > parseInt(max_delay)) {
            tip('最小延时须小于最大延时', '#min-delay', 3000, 'top');
            $('.layui-layer-tips .layui-layer-content').css({ 'min-width': '12px' });
            return;
        }
    }
    if ('' === min_delay) {
        min_delay = -1;
    }
    if ('' === max_delay) {
        max_delay = -1;
    }

    $('#paging').paging({
        index: 1,
        url: function () {
            pageIndex = $('.pageValue').val();

            var url = '/Common/MAlarmMonitoring/RemoteHandlers/AlarmDelayDetails.ashx?active=query'
            + '&LocomotiveCode=' + device_number
            + '&orgCode=' + org_code
            + '&orgType=' + org_type
            + '&positionCode=' + line_position_code
            + '&positionType=' + line_position_type
            + '&startTime=' + s_time
            + '&endTime=' + e_time
            + '&delayType=' + delay_type
            + '&minDelayTime=' + min_delay
            + '&maxDelayTime=' + max_delay
            + '&order=' + order_field
            + '&by=' + order_way
            + '&pageSize=' + pageSize
            + '&pageIndex=' + pageIndex;

            return url;
        },
        beforeSend: function () {
            $('#table-details').html('<div id="loadingPage_1">数据加载中,请稍等...</div>');
        },
        success: function (json) {
            if ('' === json || null === json || undefined === json) {
                layer.msg('没有数据');
                clearTable();
            } else {
                if (json.data.length < 1) {
                    layer.msg('没有数据');
                    clearTable();
                } else {
                    var data = json.data;
                    var _html_con = ''; //内容
                    var arr_color = []; //颜色
                    var arr_time = []; //耗时

                    var arr_create_tm = []; // 文件生成时间  CREATE_TM
                    var arr_trans_start_tm = []; // 上传开始时间  TRANS_START_TM
                    var arr_trans_end_tm = []; // 上传结束时间  TRANS_END_TM
                    var arr_cp2lp_tm = []; // 转入待解析时间  CP2LP_TM
                    var arr_proc_start_tm = []; // 解析开始时间  PROC_START_TM
                    var arr_proc_end_tm = []; // 解析完成时间  PROC_END_TM

                    for (var i = 0; i < data.length; i++) {
                        var UPDATE_DELAY = data[i].UPDATE_DELAY; // 上传等待耗时
                        var UPDATE_TIME = data[i].UPDATE_TIME; // 上传耗时
                        var TRANS_TIME = data[i].TRANS_TIME; // 转入解析耗时
                        var ANA_DELAY = data[i].ANA_DELAY;  // 解析等待耗时
                        var ANA_TIME = data[i].ANA_TIME; // 解析耗时
                        arr_time = [UPDATE_DELAY + '|UPDATE_DELAY', UPDATE_TIME + '|UPDATE_TIME', TRANS_TIME + '|TRANS_TIME', ANA_DELAY + '|ANA_DELAY', ANA_TIME + '|ANA_TIME']; //耗时

                        var SCS_CREATE_TM = data[i].SCS_CREATE_TM;   //SCS文件生成时间
                        var IRV_CREATE_TM = data[i].IRV_CREATE_TM;   //红外IRV文件生成时间
                        var IRV_IDX_CREATE_TM = data[i].IRV_IDX_CREATE_TM;   //红外IDX文件生成时间
                        var VI_CREATE_TM = data[i].VI_CREATE_TM;   //可见光文件生成时间
                        var VI_IDX_CREATE_TM = data[i].VI_IDX_CREATE_TM;   //可见光IDX文件生成时间
                        var OA_CREATE_TM = data[i].OA_CREATE_TM;   //全景文件生成时间
                        var OA_IDX_CREATE_TM = data[i].OA_IDX_CREATE_TM;   //全景IDX文件生成时间
                        var AUX_CREATE_TM = data[i].AUX_CREATE_TM;   //辅助文件生成时间
                        var AUX_IDX_CREATE_TM = data[i].AUX_IDX_CREATE_TM;   //辅助IDX文件生成时间
                        arr_create_tm = [SCS_CREATE_TM, IRV_CREATE_TM, IRV_IDX_CREATE_TM, VI_CREATE_TM, VI_IDX_CREATE_TM, OA_CREATE_TM, OA_IDX_CREATE_TM, AUX_CREATE_TM, AUX_IDX_CREATE_TM]; //文件生成时间 o
                        //CREATE_TM
                        var SCS_TRANS_START_TM = data[i].SCS_TRANS_START_TM;   //SCS文件上传开始时间
                        var IRV_TRANS_START_TM = data[i].IRV_TRANS_START_TM;   //红外IRV文件上传开始时间
                        var IRV_IDX_TRANS_START_TM = data[i].IRV_IDX_TRANS_START_TM;   //红外IDX文件上传开始时间
                        var VI_TRANS_START_TM = data[i].VI_TRANS_START_TM;   //可见光文件上传开始时间
                        var VI_IDX_TRANS_START_TM = data[i].VI_IDX_TRANS_START_TM;   //可见光IDX文件上传开始时间
                        var OA_TRANS_START_TM = data[i].OA_TRANS_START_TM;   //全景文件上传开始时间
                        var OA_IDX_TRANS_START_TM = data[i].OA_IDX_TRANS_START_TM;   //全景IDX文件上传开始时间
                        var AUX_TRANS_START_TM = data[i].AUX_TRANS_START_TM;   //辅助文件上传开始时间
                        var AUX_IDX_TRANS_START_TM = data[i].AUX_IDX_TRANS_START_TM;   //辅助IDX文件上传开始时间
                        arr_trans_start_tm = [SCS_TRANS_START_TM, IRV_TRANS_START_TM, IRV_IDX_TRANS_START_TM, VI_TRANS_START_TM, VI_IDX_TRANS_START_TM, OA_TRANS_START_TM, OA_IDX_TRANS_START_TM, AUX_TRANS_START_TM, AUX_IDX_TRANS_START_TM]; //上传开始时间
                        //TRANS_START_TM
                        var SCS_TRANS_END_TM = data[i].SCS_TRANS_END_TM;   //SCS文件上传结束时间
                        var IRV_TRANS_END_TM = data[i].IRV_TRANS_END_TM;   //红外IRV文件上传结束时间
                        var IRV_IDX_TRANS_END_TM = data[i].IRV_IDX_TRANS_END_TM;   //红外IDX文件上传结束时间
                        var VI_TRANS_END_TM = data[i].VI_TRANS_END_TM;   //可见光文件上传结束时间
                        var VI_IDX_TRANS_END_TM = data[i].VI_IDX_TRANS_END_TM;   //可见光IDX文件上传结束时间
                        var OA_TRANS_END_TM = data[i].OA_TRANS_END_TM;   //全景文件上传结束时间
                        var OA_IDX_TRANS_END_TM = data[i].OA_IDX_TRANS_END_TM;   //全景IDX文件上传结束时间
                        var AUX_TRANS_END_TM = data[i].AUX_TRANS_END_TM;   //辅助文件上传结束时间
                        var AUX_IDX_TRANS_END_TM = data[i].AUX_IDX_TRANS_END_TM;   //辅助IDX文件上传结束时间
                        arr_trans_end_tm = [SCS_TRANS_END_TM, IRV_TRANS_END_TM, IRV_IDX_TRANS_END_TM, VI_TRANS_END_TM, VI_IDX_TRANS_END_TM, OA_TRANS_END_TM, OA_IDX_TRANS_END_TM, AUX_TRANS_END_TM, AUX_IDX_TRANS_END_TM]; //上传结束时间
                        //TRANS_END_TM
                        var SCS_CP2LP_TM = data[i].SCS_CP2LP_TM;   //SCS文件转入待解析时间
                        var IRV_CP2LP_TM = data[i].IRV_CP2LP_TM;   //红外IRV文件转入待解析时间
                        var IRV_IDX_CP2LP_TM = data[i].IRV_IDX_CP2LP_TM;   //红外IDX文件转入待解析时间
                        var VI_CP2LP_TM = data[i].VI_CP2LP_TM;   //可见光文件转入待解析时间
                        var VI_IDX_CP2LP_TM = data[i].VI_IDX_CP2LP_TM;   //可见光IDX文件转入待解析时间
                        var OA_CP2LP_TM = data[i].OA_CP2LP_TM;   //全景文件转入待解析时间
                        var OA_IDX_CP2LP_TM = data[i].OA_IDX_CP2LP_TM;   //全景IDX文件转入待解析时间
                        var AUX_CP2LP_TM = data[i].AUX_CP2LP_TM;   //辅助文件转入待解析时间
                        var AUX_IDX_CP2LP_TM = data[i].AUX_IDX_CP2LP_TM;   //辅助IDX文件转入待解析时间
                        arr_cp2lp_tm = [SCS_CP2LP_TM, IRV_CP2LP_TM, IRV_IDX_CP2LP_TM, VI_CP2LP_TM, VI_IDX_CP2LP_TM, OA_CP2LP_TM, OA_IDX_CP2LP_TM, AUX_CP2LP_TM, AUX_IDX_CP2LP_TM]; //转入待解析时间
                        //CP2LP_TM
                        var SCS_PROC_START_TM = data[i].SCS_PROC_START_TM;   //SCS文件解析开始时间
                        var IRV_PROC_START_TM = data[i].IRV_PROC_START_TM;   //红外IRV文件解析开始时间
                        var IRV_IDX_PROC_START_TM = data[i].IRV_IDX_PROC_START_TM;   //红外IDX文件解析开始时间
                        var VI_PROC_START_TM = data[i].VI_PROC_START_TM;   //可见光文件解析开始时间
                        var VI_IDX_PROC_START_TM = data[i].VI_IDX_PROC_START_TM;   //可见光IDX文件解析开始时间
                        var OA_PROC_START_TM = data[i].OA_PROC_START_TM;   //全景文件解析开始时间
                        var OA_IDX_PROC_START_TM = data[i].OA_IDX_PROC_START_TM;   //全景IDX文件解析开始时间
                        var AUX_PROC_START_TM = data[i].AUX_PROC_START_TM;   //辅助文件解析开始时间
                        var AUX_IDX_PROC_START_TM = data[i].AUX_IDX_PROC_START_TM;   //辅助IDX文件解析开始时间
                        arr_proc_start_tm = [SCS_PROC_START_TM, IRV_PROC_START_TM, IRV_IDX_PROC_START_TM, VI_PROC_START_TM, VI_IDX_PROC_START_TM, OA_PROC_START_TM, OA_IDX_PROC_START_TM, AUX_PROC_START_TM, AUX_IDX_PROC_START_TM]; //解析开始时间
                        //PROC_START_TM
                        var SCS_PROC_END_TM = data[i].SCS_PROC_END_TM; //SCS文件解析完成时间
                        var IRV_PROC_END_TM = data[i].IRV_PROC_END_TM;   //红外IRV文件解析完成时间
                        var IRV_IDX_PROC_END_TM = data[i].IRV_IDX_PROC_END_TM;   //红外IDX文件解析完成时间
                        var VI_PROC_END_TM = data[i].VI_PROC_END_TM;   //可见光文件解析完成时间
                        var VI_IDX_PROC_END_TM = data[i].VI_IDX_PROC_END_TM;   //可见光IDX文件解析完成时间
                        var OA_PROC_END_TM = data[i].OA_PROC_END_TM;   //全景文件解析完成时间
                        var OA_IDX_PROC_END_TM = data[i].OA_IDX_PROC_END_TM;   //全景IDX文件解析完成时间
                        var AUX_PROC_END_TM = data[i].AUX_PROC_END_TM;   //辅助文件解析完成时间
                        var AUX_IDX_PROC_END_TM = data[i].AUX_IDX_PROC_END_TM;   //辅助IDX文件解析完成时间
                        arr_proc_end_tm = [SCS_PROC_END_TM, IRV_PROC_END_TM, IRV_IDX_PROC_END_TM, VI_PROC_END_TM, VI_IDX_PROC_END_TM, OA_PROC_END_TM, OA_IDX_PROC_END_TM, AUX_PROC_END_TM, AUX_IDX_PROC_END_TM]; // 解析完成时间
                        //PROC_END_TM

                        var max_create_tm_min = findTimeMaxMin(arr_create_tm);
                        var max_trans_start_tm_min = findTimeMaxMin(arr_trans_start_tm);
                        var max_trans_end_tm_min = findTimeMaxMin(arr_trans_end_tm);
                        var max_cp2lp_tm_min = findTimeMaxMin(arr_cp2lp_tm);
                        var max_proc_start_tm_min = findTimeMaxMin(arr_proc_start_tm);
                        var max_proc_end_tm_min = findTimeMaxMin(arr_proc_end_tm);

                        var _html_update_delay = '<td class="j-top-td-bg"><span class="td-text text-mt-0 j-time" id="UPDATE_DELAY' + i + '" data="文件生成时间(最小)：' + max_create_tm_min.MIN + ',上传开始时间(最大)：' + max_trans_start_tm_min.MAX + '"><span>' + UPDATE_DELAY + '</span></span></td>';
                        var _html_update_time = '<td class="j-top-td-bg"><span class="td-text text-mt-0 j-time" id="UPDATE_TIME' + i + '" data="上传开始时间(最小)：' + max_trans_start_tm_min.MIN + ',上传结束时间(最大)：' + max_trans_end_tm_min.MAX + '"><span>' + UPDATE_TIME + '</span></span></td>';
                        var _html_trans_time = '<td class="j-top-td-bg"><span class="td-text text-mt-0 j-time" id="TRANS_TIME' + i + '" data="上传结束时间(最小)：' + max_trans_end_tm_min.MIN + ',转入待解析时间(最大)：' + max_cp2lp_tm_min.MAX + '"><span>' + TRANS_TIME + '</span></span></td>';
                        var _html_ana_delay = '<td class="j-top-td-bg"><span class="td-text text-mt-0 j-time" id="ANA_DELAY' + i + '" data="转入待解析时间(最小)：' + max_cp2lp_tm_min.MIN + ',解析开始时间(最大)：' + max_proc_start_tm_min.MAX + '"><span>' + ANA_DELAY + '</span></span></td>';
                        var _html_ana_time = '<td class="j-top-td-bg"><span class="td-text text-mt-0 j-time" category="ANA_TIME" id="ANA_TIME' + i + '" data="解析开始时间(最小)：' + max_proc_start_tm_min.MIN + ',解析结束时间(最大)：' + max_proc_end_tm_min.MAX + '"><span>' + ANA_TIME + '</span></span></td>';

                        var max_flag = findMax(arr_time);

                        if ('UPDATE_DELAY' === max_flag) {
                            _html_update_delay = '<td class="j-top-td-bg"><span class="td-text text-mt-0 j-time" id="UPDATE_DELAY' + i + '" data="文件生成时间(最小)：' + max_create_tm_min.MIN + ',上传开始时间(最大)：' + max_trans_start_tm_min.MAX + '"><span class="max-time">' + UPDATE_DELAY + '</span></span></td>';
                        }
                        if ('UPDATE_TIME' === max_flag) {
                            _html_update_time = '<td class="j-top-td-bg"><span class="td-text text-mt-0 j-time" id="UPDATE_TIME' + i + '" data="上传开始时间(最小)：' + max_trans_start_tm_min.MIN + ',上传结束时间(最大)：' + max_trans_end_tm_min.MAX + '"><span class="max-time">' + UPDATE_TIME + '</span></span></td>';
                        }
                        if ('TRANS_TIME' === max_flag) {
                            _html_trans_time = '<td class="j-top-td-bg"><span class="td-text text-mt-0 j-time" id="TRANS_TIME' + i + '" data="上传结束时间(最小)：' + max_trans_end_tm_min.MIN + ',转入待解析时间(最大)：' + max_cp2lp_tm_min.MAX + '"><span class="max-time">' + TRANS_TIME + '</span></span></td>';
                        }
                        if ('ANA_DELAY' === max_flag) {
                            _html_ana_delay = '<td class="j-top-td-bg"><span class="td-text text-mt-0 j-time" id="ANA_DELAY' + i + '" data="转入待解析时间(最小)：' + max_cp2lp_tm_min.MIN + ',解析开始时间(最大)：' + max_proc_start_tm_min.MAX + '"><span class="max-time">' + ANA_DELAY + '</span></span></td>';
                        }
                        if ('ANA_TIME' === max_flag) {
                            _html_ana_time = '<td class="j-top-td-bg"><span class="td-text text-mt-0 j-time" category="ANA_TIME" id="ANA_TIME' + i + '" data="解析开始时间(最小)：' + max_proc_start_tm_min.MIN + ',解析结束时间(最大)：' + max_proc_end_tm_min.MAX + '"><span class="max-time">' + ANA_TIME + '</span></span></td>';
                        }

                        //展开行与折叠行
                        var _html_switch = ''; //开关
                        var _html_multi_td_one = ''; //多行合并1
                        var _html_multi_td_two = ''; //多行合并2
                        var _html_similar_tr = ''; //同类行
                        //if (i === 0) { //首行展开
                        //    _html_switch = '<span class="table-ico tr-switch arrow-right j-switch" status="tr-open"></span>';
                        //    _html_multi_td_one = '<td rowspan="10" class="child-td">';
                        //    _html_multi_td_two = '<td rowspan="10">' + data[i].MAXFILEDELAY + '</td>';
                        //    _html_similar_tr = '<tr class="similar_' + i + '">';
                        //} else { //其他行折叠
                        _html_switch = '<span class="table-ico tr-switch arrow-down j-switch" status="tr-close"></span>';
                        _html_multi_td_one = '<td rowspan="0" class="child-td">';
                        _html_multi_td_two = '<td rowspan="0">' + data[i].MAXFILEDELAY + '</td>';
                        _html_similar_tr = '<tr class="similar_' + i + ' j-similar-tr-bg" style="display: none;">';
                        //}

                        //甘特图数据计算
                        var _html_pillars = [];

                        // 1、SCS文件（SCS）a -----------------------------------
                        var a1_1 = getProportion(data[i].SCS_CREATE_TM, max_create_tm_min.MIN, UPDATE_DELAY); //获取所占比例（灰）
                        var a1_2 = ((Number(data[i].SCS_UPDATE_DELAY)) / Number(UPDATE_DELAY)); //获取所占比例（绿）
                        var a1_3 = getString(a1_1, a1_2, 'CLASSNAME'); //获取字符串
                        _html_pillars['A1'] = getString(a1_1, a1_2, 'BAR'); //获取字符串

                        var a2_1 = getProportion(data[i].SCS_TRANS_START_TM, max_trans_start_tm_min.MIN, UPDATE_TIME); //获取所占比例（灰）
                        var a2_2 = ((Number(data[i].SCS_UPDATE_TIME)) / Number(UPDATE_TIME)); //获取所占比例（绿）
                        var a2_3 = getString(a2_1, a2_2, 'CLASSNAME'); //获取字符串
                        _html_pillars['A2'] = getString(a2_1, a2_2, 'BAR'); //获取字符串

                        var a3_1 = getProportion(data[i].SCS_TRANS_END_TM, max_trans_end_tm_min.MIN, TRANS_TIME); //获取所占比例（灰）
                        var a3_2 = ((Number(data[i].SCS_TRANS_TIME)) / Number(TRANS_TIME)); //获取所占比例（绿）
                        var a3_3 = getString(a3_1, a3_2, 'CLASSNAME'); //获取字符串
                        _html_pillars['A3'] = getString(a3_1, a3_2, 'BAR'); //获取字符串

                        var a4_1 = getProportion(data[i].SCS_CP2LP_TM, max_cp2lp_tm_min.MIN, ANA_DELAY); //获取所占比例（灰）
                        var a4_2 = ((Number(data[i].SCS_ANA_DELAY)) / Number(ANA_DELAY)); //获取所占比例（绿）
                        var a4_3 = getString(a4_1, a4_2, 'CLASSNAME'); //获取字符串
                        _html_pillars['A4'] = getString(a4_1, a4_2, 'BAR'); //获取字符串

                        var a5_1 = getProportion(data[i].SCS_PROC_START_TM, max_proc_start_tm_min.MIN, ANA_TIME); //获取所占比例（灰）
                        var a5_2 = ((Number(data[i].SCS_ANA_TIME)) / Number(ANA_TIME)); //获取所占比例（绿）
                        var a5_3 = getString(a5_1, a5_2, 'CLASSNAME'); //获取字符串
                        _html_pillars['A5'] = getString(a5_1, a5_2, 'BAR'); //获取字符串

                        // 2、红外IRV（IRV）b -----------------------------------
                        var b1_1 = getProportion(data[i].IRV_CREATE_TM, max_create_tm_min.MIN, UPDATE_DELAY); //获取所占比例（灰）
                        var b1_2 = ((Number(data[i].IRV_UPDATE_DELAY)) / Number(UPDATE_DELAY)); //获取所占比例（绿）
                        var b1_3 = getString(b1_1, b1_2, 'CLASSNAME'); //获取字符串
                        _html_pillars['B1'] = getString(b1_1, b1_2, 'BAR'); //获取字符串

                        var b2_1 = getProportion(data[i].IRV_TRANS_START_TM, max_trans_start_tm_min.MIN, UPDATE_TIME); //获取所占比例（灰）
                        var b2_2 = ((Number(data[i].IRV_UPDATE_TIME)) / Number(UPDATE_TIME)); //获取所占比例（绿）
                        var b2_3 = getString(b2_1, b2_2, 'CLASSNAME'); //获取字符串
                        _html_pillars['B2'] = getString(b2_1, b2_2, 'BAR'); //获取字符串

                        var b3_1 = getProportion(data[i].IRV_TRANS_END_TM, max_trans_end_tm_min.MIN, TRANS_TIME); //获取所占比例（灰）
                        var b3_2 = ((Number(data[i].IRV_TRANS_TIME)) / Number(TRANS_TIME)); //获取所占比例（绿）
                        var b3_3 = getString(b3_1, b3_2, 'CLASSNAME'); //获取字符串
                        _html_pillars['B3'] = getString(b3_1, b3_2, 'BAR'); //获取字符串

                        var b4_1 = getProportion(data[i].IRV_CP2LP_TM, max_cp2lp_tm_min.MIN, ANA_DELAY); //获取所占比例（灰）
                        var b4_2 = ((Number(data[i].IRV_ANA_DELAY)) / Number(ANA_DELAY)); //获取所占比例（绿）
                        var b4_3 = getString(b4_1, b4_2, 'CLASSNAME'); //获取字符串
                        _html_pillars['B4'] = getString(b4_1, b4_2, 'BAR'); //获取字符串

                        var b5_1 = getProportion(data[i].IRV_PROC_START_TM, max_proc_start_tm_min.MIN, ANA_TIME); //获取所占比例（灰）
                        var b5_2 = ((Number(data[i].IRV_ANA_TIME)) / Number(ANA_TIME)); //获取所占比例（绿）
                        var b5_3 = getString(b5_1, b5_2, 'CLASSNAME'); //获取字符串
                        _html_pillars['B5'] = getString(b5_1, b5_2, 'BAR'); //获取字符串

                        // 3、红外IDX（IRV_IDX）c -----------------------------------
                        var c1_1 = getProportion(data[i].IRV_IDX_CREATE_TM, max_create_tm_min.MIN, UPDATE_DELAY); //获取所占比例（灰）
                        var c1_2 = ((Number(data[i].IRV_IDX_UPDATE_DELAY)) / Number(UPDATE_DELAY)); //获取所占比例（绿）
                        var c1_3 = getString(c1_1, c1_2, 'CLASSNAME'); //获取字符串
                        _html_pillars['C1'] = getString(c1_1, c1_2, 'BAR'); //获取字符串

                        var c2_1 = getProportion(data[i].IRV_IDX_TRANS_START_TM, max_trans_start_tm_min.MIN, UPDATE_TIME); //获取所占比例（灰）
                        var c2_2 = ((Number(data[i].IRV_IDX_UPDATE_TIME)) / Number(UPDATE_TIME)); //获取所占比例（绿）
                        var c2_3 = getString(c2_1, c2_2, 'CLASSNAME'); //获取字符串
                        _html_pillars['C2'] = getString(c2_1, c2_2, 'BAR'); //获取字符串

                        var c3_1 = getProportion(data[i].IRV_IDX_TRANS_END_TM, max_trans_end_tm_min.MIN, TRANS_TIME); //获取所占比例（灰）
                        var c3_2 = ((Number(data[i].IRV_IDX_TRANS_TIME)) / Number(TRANS_TIME)); //获取所占比例（绿）
                        var c3_3 = getString(c3_1, c3_2, 'CLASSNAME'); //获取字符串
                        _html_pillars['C3'] = getString(c3_1, c3_2, 'BAR'); //获取字符串

                        var c4_1 = getProportion(data[i].IRV_IDX_CP2LP_TM, max_cp2lp_tm_min.MIN, ANA_DELAY); //获取所占比例（灰）
                        var c4_2 = ((Number(data[i].IRV_ANA_DELAY)) / Number(ANA_DELAY)); //获取所占比例（绿）
                        var c4_3 = getString(c4_1, c4_2, 'CLASSNAME'); //获取字符串
                        _html_pillars['C4'] = getString(c4_1, c4_2, 'BAR'); //获取字符串

                        var c5_1 = getProportion(data[i].IRV_IDX_PROC_START_TM, max_proc_start_tm_min.MIN, ANA_TIME); //获取所占比例（灰）
                        var c5_2 = ((Number(data[i].IRV_IDX_ANA_TIME)) / Number(ANA_TIME)); //获取所占比例（绿）
                        var c5_3 = getString(c5_1, c5_2, 'CLASSNAME'); //获取字符串
                        _html_pillars['C5'] = getString(c5_1, c5_2, 'BAR'); //获取字符串

                        // 4、可见光（VI）d -----------------------------------
                        var d1_1 = getProportion(data[i].VI_CREATE_TM, max_create_tm_min.MIN, UPDATE_DELAY); //获取所占比例（灰）
                        var d1_2 = ((Number(data[i].VI_UPDATE_DELAY)) / Number(UPDATE_DELAY)); //获取所占比例（绿）
                        var d1_3 = getString(d1_1, d1_2, 'CLASSNAME'); //获取字符串
                        _html_pillars['D1'] = getString(d1_1, d1_2, 'BAR'); //获取字符串

                        var d2_1 = getProportion(data[i].VI_TRANS_START_TM, max_trans_start_tm_min.MIN, UPDATE_TIME); //获取所占比例（灰）
                        var d2_2 = ((Number(data[i].VI_UPDATE_TIME)) / Number(UPDATE_TIME)); //获取所占比例（绿）
                        var d2_3 = getString(d2_1, d2_2, 'CLASSNAME'); //获取字符串
                        _html_pillars['D2'] = getString(d2_1, d2_2, 'BAR'); //获取字符串

                        var d3_1 = getProportion(data[i].VI_TRANS_END_TM, max_trans_end_tm_min.MIN, TRANS_TIME); //获取所占比例（灰）
                        var d3_2 = ((Number(data[i].VI_TRANS_TIME)) / Number(TRANS_TIME)); //获取所占比例（绿）
                        var d3_3 = getString(d3_1, d3_2, 'CLASSNAME'); //获取字符串
                        _html_pillars['D3'] = getString(d3_1, d3_2, 'BAR'); //获取字符串

                        var d4_1 = getProportion(data[i].VI_CP2LP_TM, max_cp2lp_tm_min.MIN, ANA_DELAY); //获取所占比例（灰）
                        var d4_2 = ((Number(data[i].VI_ANA_DELAY)) / Number(ANA_DELAY)); //获取所占比例（绿）
                        var d4_3 = getString(d4_1, d4_2, 'CLASSNAME'); //获取字符串
                        _html_pillars['D4'] = getString(d4_1, d4_2, 'BAR'); //获取字符串

                        var d5_1 = getProportion(data[i].VI_PROC_START_TM, max_proc_start_tm_min.MIN, ANA_TIME); //获取所占比例（灰）
                        var d5_2 = ((Number(data[i].VI_ANA_TIME)) / Number(ANA_TIME)); //获取所占比例（绿）
                        var d5_3 = getString(d5_1, d5_2, 'CLASSNAME'); //获取字符串
                        _html_pillars['D5'] = getString(d5_1, d5_2, 'BAR'); //获取字符串

                        // 5、可见光IDX（VI_IDX）e -----------------------------------
                        var e1_1 = getProportion(data[i].VI_IDX_CREATE_TM, max_create_tm_min.MIN, UPDATE_DELAY); //获取所占比例（灰）
                        var e1_2 = ((Number(data[i].VI_IDX_UPDATE_DELAY)) / Number(UPDATE_DELAY)); //获取所占比例（绿）（灰）
                        var e1_3 = getString(e1_1, e1_2, 'CLASSNAME'); //获取字符串
                        _html_pillars['E1'] = getString(e1_1, e1_2, 'BAR'); //获取字符串

                        var e2_1 = getProportion(data[i].VI_IDX_TRANS_START_TM, max_trans_start_tm_min.MIN, UPDATE_TIME); //获取所占比例（灰）
                        var e2_2 = ((Number(data[i].VI_IDX_UPDATE_TIME)) / Number(UPDATE_TIME)); //获取所占比例（绿）
                        var e2_3 = getString(e2_1, e2_2, 'CLASSNAME'); //获取字符串
                        _html_pillars['E2'] = getString(e2_1, e2_2, 'BAR'); //获取字符串

                        var e3_1 = getProportion(data[i].VI_IDX_TRANS_END_TM, max_trans_end_tm_min.MIN, TRANS_TIME); //获取所占比例（灰）
                        var e3_2 = ((Number(data[i].VI_IDX_TRANS_TIME)) / Number(TRANS_TIME)); //获取所占比例（绿）
                        var e3_3 = getString(e3_1, e3_2, 'CLASSNAME'); //获取字符串
                        _html_pillars['E3'] = getString(e3_1, e3_2, 'BAR'); //获取字符串

                        var e4_1 = getProportion(data[i].VI_IDX_CP2LP_TM, max_cp2lp_tm_min.MIN, ANA_DELAY); //获取所占比例（灰）
                        var e4_2 = ((Number(data[i].VI_IDX_ANA_DELAY)) / Number(ANA_DELAY)); //获取所占比例（绿）
                        var e4_3 = getString(e4_1, e4_2, 'CLASSNAME'); //获取字符串
                        _html_pillars['E4'] = getString(e4_1, e4_2, 'BAR'); //获取字符串

                        var e5_1 = getProportion(data[i].VI_IDX_PROC_START_TM, max_proc_start_tm_min.MIN, ANA_TIME); //获取所占比例（灰）
                        var e5_2 = ((Number(data[i].VI_IDX_ANA_TIME)) / Number(ANA_TIME)); //获取所占比例（绿）
                        var e5_3 = getString(e5_1, e5_2, 'CLASSNAME'); //获取字符串
                        _html_pillars['E5'] = getString(e5_1, e5_2, 'BAR'); //获取字符串

                        // 6、全景（OA）f -----------------------------------
                        var f1_1 = getProportion(data[i].OA_CREATE_TM, max_create_tm_min.MIN, UPDATE_DELAY); //获取所占比例（灰）
                        var f1_2 = ((Number(data[i].OA_UPDATE_DELAY)) / Number(UPDATE_DELAY)); //获取所占比例（绿）
                        var f1_3 = getString(f1_1, f1_2, 'CLASSNAME'); //获取字符串
                        _html_pillars['F1'] = getString(f1_1, f1_2, 'BAR'); //获取字符串

                        var f2_1 = getProportion(data[i].OA_TRANS_START_TM, max_trans_start_tm_min.MIN, UPDATE_TIME); //获取所占比例（灰）
                        var f2_2 = ((Number(data[i].OA_UPDATE_TIME)) / Number(UPDATE_TIME)); //获取所占比例（绿）
                        var f2_3 = getString(f2_1, f2_2, 'CLASSNAME'); //获取字符串
                        _html_pillars['F2'] = getString(f2_1, f2_2, 'BAR'); //获取字符串

                        var f3_1 = getProportion(data[i].OA_TRANS_END_TM, max_trans_end_tm_min.MIN, TRANS_TIME); //获取所占比例（灰）
                        var f3_2 = ((Number(data[i].OA_TRANS_TIME)) / Number(TRANS_TIME)); //获取所占比例（绿）
                        var f3_3 = getString(f3_1, f3_2, 'CLASSNAME'); //获取字符串
                        _html_pillars['F3'] = getString(f3_1, f3_2, 'BAR'); //获取字符串

                        var f4_1 = getProportion(data[i].OA_CP2LP_TM, max_cp2lp_tm_min.MIN, ANA_DELAY); //获取所占比例（灰）
                        var f4_2 = ((Number(data[i].OA_ANA_DELAY)) / Number(ANA_DELAY)); //获取所占比例（绿）
                        var f4_3 = getString(f4_1, f4_2, 'CLASSNAME'); //获取字符串
                        _html_pillars['F4'] = getString(f4_1, f4_2, 'BAR'); //获取字符串

                        var f5_1 = getProportion(data[i].OA_PROC_START_TM, max_proc_start_tm_min.MIN, ANA_TIME); //获取所占比例（灰）
                        var f5_2 = ((Number(data[i].OA_ANA_TIME)) / Number(ANA_TIME)); //获取所占比例（绿）
                        var f5_3 = getString(f5_1, f5_2, 'CLASSNAME'); //获取字符串
                        _html_pillars['F5'] = getString(f5_1, f5_2, 'BAR'); //获取字符串

                        // 7、全景IDX（OA_IDX）g -----------------------------------
                        var g1_1 = getProportion(data[i].OA_IDX_CREATE_TM, max_create_tm_min.MIN, UPDATE_DELAY); //获取所占比例（灰）
                        var g1_2 = ((Number(data[i].OA_IDX_UPDATE_DELAY)) / Number(UPDATE_DELAY)); //获取所占比例（绿）
                        var g1_3 = getString(g1_1, g1_2, 'CLASSNAME'); //获取字符串
                        _html_pillars['G1'] = getString(g1_1, g1_2, 'BAR'); //获取字符串

                        var g2_1 = getProportion(data[i].OA_IDX_TRANS_START_TM, max_trans_start_tm_min.MIN, UPDATE_TIME); //获取所占比例（灰）
                        var g2_2 = ((Number(data[i].OA_IDX_UPDATE_TIME)) / Number(UPDATE_TIME)); //获取所占比例（绿）
                        var g2_3 = getString(g2_1, g2_2, 'CLASSNAME'); //获取字符串
                        _html_pillars['G2'] = getString(g2_1, g2_2, 'BAR'); //获取字符串

                        var g3_1 = getProportion(data[i].OA_IDX_TRANS_END_TM, max_trans_end_tm_min.MIN, TRANS_TIME); //获取所占比例（灰）
                        var g3_2 = ((Number(data[i].OA_IDX_TRANS_TIME)) / Number(TRANS_TIME)); //获取所占比例（绿）
                        var g3_3 = getString(g3_1, g3_2, 'CLASSNAME'); //获取字符串
                        _html_pillars['G3'] = getString(g3_1, g3_2, 'BAR'); //获取字符串

                        var g4_1 = getProportion(data[i].OA_IDX_CP2LP_TM, max_cp2lp_tm_min.MIN, ANA_DELAY); //获取所占比例（灰）
                        var g4_2 = ((Number(data[i].OA_IDX_ANA_DELAY)) / Number(ANA_DELAY)); //获取所占比例（绿）
                        var g4_3 = getString(g4_1, g4_2, 'CLASSNAME'); //获取字符串
                        _html_pillars['G4'] = getString(g4_1, g4_2, 'BAR'); //获取字符串

                        var g5_1 = getProportion(data[i].OA_IDX_PROC_START_TM, max_proc_start_tm_min.MIN, ANA_TIME); //获取所占比例（灰）
                        var g5_2 = ((Number(data[i].OA_IDX_ANA_TIME)) / Number(ANA_TIME)); //获取所占比例（绿）
                        var g5_3 = getString(g5_1, g5_2, 'CLASSNAME'); //获取字符串
                        _html_pillars['G5'] = getString(g5_1, g5_2, 'BAR'); //获取字符串

                        // 8、辅助（AUX）h -----------------------------------
                        var h1_1 = getProportion(data[i].AUX_CREATE_TM, max_create_tm_min.MIN, UPDATE_DELAY); //获取所占比例（灰）
                        var h1_2 = ((Number(data[i].AUX_UPDATE_DELAY)) / Number(UPDATE_DELAY)); //获取所占比例（绿）
                        var h1_3 = getString(h1_1, h1_2, 'CLASSNAME'); //获取字符串
                        _html_pillars['H1'] = getString(h1_1, h1_2, 'BAR'); //获取字符串

                        var h2_1 = getProportion(data[i].AUX_TRANS_START_TM, max_trans_start_tm_min.MIN, UPDATE_TIME); //获取所占比例（灰）
                        var h2_2 = ((Number(data[i].AUX_UPDATE_TIME)) / Number(UPDATE_TIME)); //获取所占比例（绿）
                        var h2_3 = getString(h2_1, h2_2, 'CLASSNAME'); //获取字符串
                        _html_pillars['H2'] = getString(h2_1, h2_2, 'BAR'); //获取字符串

                        var h3_1 = getProportion(data[i].AUX_TRANS_END_TM, max_trans_end_tm_min.MIN, TRANS_TIME); //获取所占比例（灰）
                        var h3_2 = ((Number(data[i].AUX_TRANS_TIME)) / Number(TRANS_TIME)); //获取所占比例（绿）
                        var h3_3 = getString(h3_1, h3_2, 'CLASSNAME'); //获取字符串
                        _html_pillars['H3'] = getString(h3_1, h3_2, 'BAR'); //获取字符串

                        var h4_1 = getProportion(data[i].AUX_CP2LP_TM, max_cp2lp_tm_min.MIN, ANA_DELAY); //获取所占比例（灰）
                        var h4_2 = ((Number(data[i].AUX_ANA_DELAY)) / Number(ANA_DELAY)); //获取所占比例（绿）
                        var h4_3 = getString(h4_1, h4_2, 'CLASSNAME'); //获取字符串
                        _html_pillars['H4'] = getString(h4_1, h4_2, 'BAR'); //获取字符串

                        var h5_1 = getProportion(data[i].AUX_PROC_START_TM, max_proc_start_tm_min.MIN, ANA_TIME); //获取所占比例（灰）
                        var h5_2 = ((Number(data[i].AUX_ANA_TIME)) / Number(ANA_TIME)); //获取所占比例（绿）
                        var h5_3 = getString(h5_1, h5_2, 'CLASSNAME'); //获取字符串
                        _html_pillars['H5'] = getString(h5_1, h5_2, 'BAR'); //获取字符串

                        // 9、辅助IDX（AUX_IDX）k -----------------------------------
                        var k1_1 = getProportion(data[i].AUX_IDX_CREATE_TM, max_create_tm_min.MIN, UPDATE_DELAY); //获取所占比例（灰）
                        var k1_2 = ((Number(data[i].AUX_IDX_UPDATE_DELAY)) / Number(UPDATE_DELAY)); //获取所占比例（绿）
                        var k1_3 = getString(k1_1, k1_2, 'CLASSNAME'); //获取字符串
                        _html_pillars['K1'] = getString(k1_1, k1_2, 'BAR'); //获取字符串

                        var k2_1 = getProportion(data[i].AUX_IDX_TRANS_START_TM, max_trans_start_tm_min.MIN, UPDATE_TIME); //获取所占比例（灰）
                        var k2_2 = ((Number(data[i].AUX_IDX_UPDATE_TIME)) / Number(UPDATE_TIME)); //获取所占比例（绿）
                        var k2_3 = getString(k2_1, k2_2, 'CLASSNAME'); //获取字符串
                        _html_pillars['K2'] = getString(k2_1, k2_2, 'BAR'); //获取字符串

                        var k3_1 = getProportion(data[i].AUX_IDX_TRANS_END_TM, max_trans_end_tm_min.MIN, TRANS_TIME); //获取所占比例（灰）
                        var k3_2 = ((Number(data[i].AUX_IDX_TRANS_TIME)) / Number(TRANS_TIME)); //获取所占比例（绿）
                        var k3_3 = getString(k3_1, k3_2, 'CLASSNAME'); //获取字符串
                        _html_pillars['K3'] = getString(k3_1, k3_2, 'BAR'); //获取字符串

                        var k4_1 = getProportion(data[i].AUX_IDX_CP2LP_TM, max_cp2lp_tm_min.MIN, ANA_DELAY); //获取所占比例（灰）
                        var k4_2 = ((Number(data[i].AUX_IDX_ANA_DELAY)) / Number(ANA_DELAY)); //获取所占比例（绿）
                        var k4_3 = getString(k4_1, k4_2, 'CLASSNAME'); //获取字符串
                        _html_pillars['K4'] = getString(k4_1, k4_2, 'BAR'); //获取字符串

                        var k5_1 = getProportion(data[i].AUX_IDX_PROC_START_TM, max_proc_start_tm_min.MIN, ANA_TIME); //获取所占比例（灰）
                        var k5_2 = ((Number(data[i].AUX_IDX_ANA_TIME)) / Number(ANA_TIME)); //获取所占比例（绿）
                        var k5_3 = getString(k5_1, k5_2, 'CLASSNAME'); //获取字符串
                        _html_pillars['K5'] = getString(k5_1, k5_2, 'BAR'); //获取字符串

                        var wz = ((data[i].wz).substring(0, 6) === '&nbsp;') ? ((data[i].wz).substring(6, (data[i].wz).length)) : data[i].wz; //位置

                        // 内容拼接
                        _html_con +=
                            '<tr class="top_' + i + ' ">'
                                + _html_multi_td_one
                                    + _html_switch
                                    + '<span class="multi-line-con">'
                                        + '<label>' + data[i].DETECT_DEVICE_CODE + '</label><br />'
                                        + '<label id="alarm-details-' + i + '" class="alarm-time j-to-alarm-details" alarm-id="' + data[i].ID + '">' + data[i].RAISED_TIME + '</label><br />'
                                        + '<label>' + wz + '</label>'
                                    + '</span>'
                                + '</td>'
                                + _html_multi_td_two
                                + '<td class="j-top-td-bg">阶段最长耗时</td>'
                                + '<td class="j-top-td-bg"><span id="TOTAL_DELAY' + i + '" class="j-time" data="文件生成时间(最小)：' + max_create_tm_min.MIN + ',解析完成时间(最大)：' + max_proc_end_tm_min.MAX + '">' + data[i].MAXFILEDELAY + '</span></td>'
                                + _html_update_delay
                                + _html_update_time
                                + _html_trans_time
                                + _html_ana_delay
                                + _html_ana_time
                           + '</tr>'
                            + _html_similar_tr
                                + '<td>SCS文件</td>'
                                + '<td><span class="td-text text-mt-0 j-time" id="SCS_TOTAL_DELAY' + i + '" data="文件生成时间：' + data[i].SCS_CREATE_TM + ',解析完成时间：' + data[i].SCS_PROC_END_TM + '">' + data[i].SCS_TOTAL_DELAY + '</span></td>'
                                + '<td>' + _html_pillars.A1 + '<span class="td-text text-mt-0 j-time" id="SCS_UPDATE_DELAY' + i + '" data="文件生成时间：' + data[i].SCS_CREATE_TM + ',上传开始时间：' + data[i].SCS_TRANS_START_TM + '">' + data[i].SCS_UPDATE_DELAY + '</span></td>'
                                + '<td>' + _html_pillars.A2 + '<span class="td-text bar-base ' + a2_3 + ' j-time" id="SCS_UPDATE_TIME' + i + '" data="上传开始时间：' + data[i].SCS_TRANS_START_TM + ',上传结束时间：' + data[i].SCS_TRANS_END_TM + ',上传开始时间(最小)：' + max_trans_start_tm_min.MIN + ',等待（分）：' + getDifferenceMinute(data[i].SCS_TRANS_START_TM, max_trans_start_tm_min.MIN) + '【上传开始时间-上传开始时间(最小)】,耗时（分）：' + data[i].SCS_UPDATE_TIME + '【上传结束时间-上传开始时间】">' + data[i].SCS_UPDATE_TIME + '</span></td>'
                                + '<td>' + _html_pillars.A3 + '<span class="td-text bar-base ' + a3_3 + ' j-time" id="SCS_TRANS_TIME' + i + '" data="上传结束时间：' + data[i].SCS_TRANS_END_TM + ',转入待解析时间：' + data[i].SCS_CP2LP_TM + ',上传结束时间(最小)：' + max_trans_end_tm_min.MIN + ',等待（分）：' + getDifferenceMinute(data[i].SCS_TRANS_END_TM, max_trans_end_tm_min.MIN) + '【上传结束时间-上传结束时间(最小)】,耗时（分）：' + data[i].SCS_TRANS_TIME + '【转入待解析时间-上传结束时间】">' + data[i].SCS_TRANS_TIME + '</span></td>'
                                + '<td>' + _html_pillars.A4 + '<span class="td-text bar-base ' + a4_3 + ' j-time" id="SCS_ANA_DELAY' + i + '" data="转入待解析时间：' + data[i].SCS_CP2LP_TM + ',解析开始时间：' + data[i].SCS_PROC_START_TM + ',转入待解析时间(最小)：' + max_cp2lp_tm_min.MIN + ',等待（分）：' + getDifferenceMinute(data[i].SCS_CP2LP_TM, max_cp2lp_tm_min.MIN) + '【转入待解析时间-转入待解析时间(最小)】,耗时（分）：' + data[i].SCS_ANA_DELAY + '【解析开始时间-转入待解析时间】">' + data[i].SCS_ANA_DELAY + '</span></td>'
                                + '<td>' + _html_pillars.A5 + '<span class="td-text bar-base ' + a5_3 + ' j-time" category="ANA_TIME" id="SCS_ANA_TIME' + i + '" data="解析开始时间：' + data[i].SCS_PROC_START_TM + ',解析结束时间：' + data[i].SCS_PROC_END_TM + ',解析开始时间(最小)：' + max_proc_start_tm_min.MIN + ',等待（分）：' + getDifferenceMinute(data[i].SCS_PROC_START_TM, max_proc_start_tm_min.MIN) + '【解析开始时间-解析开始时间(最小)】,耗时（分）：' + data[i].SCS_ANA_TIME + '【解析结束时间-解析开始时间】">' + data[i].SCS_ANA_TIME + '</span></td>'
                            + '</tr>'
                            + _html_similar_tr
                                + '<td>红外IRV</td>'
                                + '<td><span class="td-text text-mt-0 j-time" id="IRV_TOTAL_DELAY' + i + '" data="文件生成时间：' + data[i].IRV_CREATE_TM + ',解析完成时间：' + data[i].IRV_PROC_END_TM + '">' + data[i].IRV_TOTAL_DELAY + '</span></td>'
                                + '<td>' + _html_pillars.B1 + '<span class="td-text text-mt-0 j-time" id="IRV_UPDATE_DELAY' + i + '" data="文件生成时间：' + data[i].IRV_CREATE_TM + ',上传开始时间：' + data[i].IRV_TRANS_START_TM + '">' + data[i].IRV_UPDATE_DELAY + '</span></td>'
                                + '<td>' + _html_pillars.B2 + '<span class="td-text bar-base ' + b2_3 + ' j-time" id="IRV_UPDATE_TIME' + i + '" data="上传开始时间：' + data[i].IRV_TRANS_START_TM + ',上传结束时间：' + data[i].IRV_TRANS_END_TM + ',上传开始时间(最小)：' + max_trans_start_tm_min.MIN + ',等待（分）：' + getDifferenceMinute(data[i].IRV_TRANS_START_TM, max_trans_start_tm_min.MIN) + '【上传开始时间-上传开始时间(最小)】,耗时（分）：' + data[i].IRV_UPDATE_TIME + '【上传结束时间-上传开始时间】">' + data[i].IRV_UPDATE_TIME + '</span></td>'
                                + '<td>' + _html_pillars.B3 + '<span class="td-text bar-base ' + b3_3 + ' j-time" id="IRV_TRANS_TIME' + i + '" data="上传结束时间：' + data[i].IRV_TRANS_END_TM + ',转入待解析时间：' + data[i].IRV_CP2LP_TM + ',上传结束时间(最小)：' + max_trans_end_tm_min.MIN + ',等待（分）：' + getDifferenceMinute(data[i].IRV_TRANS_END_TM, max_trans_end_tm_min.MIN) + '【上传结束时间-上传结束时间(最小)】,耗时（分）：' + data[i].IRV_TRANS_TIME + '【转入待解析时间-上传结束时间】">' + data[i].IRV_TRANS_TIME + '</span></td>'
                                + '<td>' + _html_pillars.B4 + '<span class="td-text bar-base ' + b4_3 + ' j-time" id="IRV_ANA_DELAY' + i + '" data="转入待解析时间：' + data[i].IRV_CP2LP_TM + ',解析开始时间：' + data[i].IRV_PROC_START_TM + ',转入待解析时间(最小)：' + max_cp2lp_tm_min.MIN + ',等待（分）：' + getDifferenceMinute(data[i].IRV_CP2LP_TM, max_cp2lp_tm_min.MIN) + '【转入待解析时间-转入待解析时间(最小)】,耗时（分）：' + data[i].IRV_ANA_DELAY + '【解析开始时间-转入待解析时间】">' + data[i].IRV_ANA_DELAY + '</span></td>'
                                + '<td>' + _html_pillars.B5 + '<span class="td-text bar-base ' + b5_3 + ' j-time" category="ANA_TIME" id="IRV_ANA_TIME' + i + '" data="解析开始时间：' + data[i].IRV_PROC_START_TM + ',解析结束时间：' + data[i].IRV_PROC_END_TM + ',解析开始时间(最小)：' + max_proc_start_tm_min.MIN + ',等待（分）：' + getDifferenceMinute(data[i].IRV_PROC_START_TM, max_proc_start_tm_min.MIN) + '【解析开始时间-解析开始时间(最小)】,耗时（分）：' + data[i].IRV_ANA_TIME + '【解析结束时间-解析开始时间】">' + data[i].IRV_ANA_TIME + '</span></td>'
                           + '</tr>'
                            + _html_similar_tr
                                + '<td>红外IDX</td>'
                                + '<td><span class="td-text text-mt-0 j-time" id="IRV_IDX_TOTAL_DELAY' + i + '" data="文件生成时间：' + data[i].IRV_IDX_CREATE_TM + ',解析完成时间：' + data[i].IRV_IDX_PROC_END_TM + '">' + data[i].IRV_IDX_TOTAL_DELAY + '</span></td>'
                                + '<td>' + _html_pillars.C1 + '<span class="td-text text-mt-0 j-time" id="IRV_IDX_UPDATE_DELAY' + i + '" data="文件生成时间：' + data[i].IRV_IDX_CREATE_TM + ',上传开始时间：' + data[i].IRV_IDX_TRANS_START_TM + '">' + data[i].IRV_IDX_UPDATE_DELAY + '</span></td>'
                                + '<td>' + _html_pillars.C2 + '<span class="td-text bar-base ' + c2_3 + ' j-time" id="IRV_IDX_UPDATE_TIME' + i + '" data="上传开始时间：' + data[i].IRV_IDX_TRANS_START_TM + ',上传结束时间：' + data[i].IRV_IDX_TRANS_END_TM + ',上传开始时间(最小)：' + max_trans_start_tm_min.MIN + ',等待（分）：' + getDifferenceMinute(data[i].IRV_IDX_TRANS_START_TM, max_trans_start_tm_min.MIN) + '【上传开始时间-上传开始时间(最小)】,耗时（分）：' + data[i].IRV_IDX_UPDATE_TIME + '【上传结束时间-上传开始时间】">' + data[i].IRV_IDX_UPDATE_TIME + '</span></td>'
                                + '<td>' + _html_pillars.C3 + '<span class="td-text bar-base ' + c3_3 + ' j-time" id="IRV_IDX_TRANS_TIME' + i + '" data="上传结束时间：' + data[i].IRV_IDX_TRANS_END_TM + ',转入待解析时间：' + data[i].IRV_IDX_CP2LP_TM + ',上传结束时间(最小)：' + max_trans_end_tm_min.MIN + ',等待（分）：' + getDifferenceMinute(data[i].IRV_IDX_TRANS_END_TM, max_trans_end_tm_min.MIN) + '【上传结束时间-上传结束时间(最小)】,耗时（分）：' + data[i].IRV_IDX_TRANS_TIME + '【转入待解析时间-上传结束时间】">' + data[i].IRV_IDX_TRANS_TIME + '</span></td>'
                                + '<td>' + _html_pillars.C4 + '<span class="td-text bar-base ' + c4_3 + ' j-time" id="IRV_IDX_ANA_DELAY' + i + '" data="转入待解析时间：' + data[i].IRV_IDX_CP2LP_TM + ',解析开始时间：' + data[i].IRV_IDX_PROC_START_TM + ',转入待解析时间(最小)：' + max_cp2lp_tm_min.MIN + ',等待（分）：' + getDifferenceMinute(data[i].IRV_IDX_CP2LP_TM, max_cp2lp_tm_min.MIN) + '【转入待解析时间-转入待解析时间(最小)】,耗时（分）：' + data[i].IRV_ANA_DELAY + '【解析开始时间-转入待解析时间】">' + data[i].IRV_IDX_ANA_DELAY + '</span></td>'
                                + '<td>' + _html_pillars.C5 + '<span class="td-text bar-base ' + c5_3 + ' j-time" category="ANA_TIME" id="IRV_IDX_ANA_TIME' + i + '" data="解析开始时间：' + data[i].IRV_IDX_PROC_START_TM + ',解析结束时间：' + data[i].IRV_IDX_PROC_END_TM + ',解析开始时间(最小)：' + max_proc_start_tm_min.MIN + ',等待（分）：' + getDifferenceMinute(data[i].IRV_IDX_PROC_START_TM, max_proc_start_tm_min.MIN) + '【解析开始时间-解析开始时间(最小)】,耗时（分）：' + data[i].IRV_IDX_ANA_TIME + '【解析结束时间-解析开始时间】">' + data[i].IRV_IDX_ANA_TIME + '</span></td>'
                           + '</tr>'
                            + _html_similar_tr
                                + '<td>可见光</td>'
                                + '<td><span class="td-text text-mt-0 j-time" id="VI_TOTAL_DELAY' + i + '" data="文件生成时间：' + data[i].VI_CREATE_TM + ',解析完成时间：' + data[i].VI_PROC_END_TM + '">' + data[i].VI_TOTAL_DELAY + '</span></td>'
                                + '<td>' + _html_pillars.D1 + '<span class="td-text text-mt-0 j-time" id="VI_UPDATE_DELAY' + i + '" data="文件生成时间：' + data[i].VI_CREATE_TM + ',上传开始时间：' + data[i].VI_TRANS_START_TM + '">' + data[i].VI_UPDATE_DELAY + '</span></td>'
                                + '<td>' + _html_pillars.D2 + '<span class="td-text bar-base ' + d2_3 + ' j-time" id="VI_UPDATE_TIME' + i + '" data="上传开始时间：' + data[i].VI_TRANS_START_TM + ',上传结束时间：' + data[i].VI_TRANS_END_TM + ',上传开始时间(最小)：' + max_trans_start_tm_min.MIN + ',等待（分）：' + getDifferenceMinute(data[i].VI_TRANS_START_TM, max_trans_start_tm_min.MIN) + '【上传开始时间-上传开始时间(最小)】,耗时（分）：' + data[i].VI_UPDATE_TIME + '【上传结束时间-上传开始时间】">' + data[i].VI_UPDATE_TIME + '</span></td>'
                                + '<td>' + _html_pillars.D3 + '<span class="td-text bar-base ' + d3_3 + ' j-time" id="VI_TRANS_TIME' + i + '" data="上传结束时间：' + data[i].VI_TRANS_END_TM + ',转入待解析时间：' + data[i].VI_CP2LP_TM + ',上传结束时间(最小)：' + max_trans_end_tm_min.MIN + ',等待（分）：' + getDifferenceMinute(data[i].VI_TRANS_END_TM, max_trans_end_tm_min.MIN) + '【上传结束时间-上传结束时间(最小)】,耗时（分）：' + data[i].VI_TRANS_TIME + '【转入待解析时间-上传结束时间】">' + data[i].VI_TRANS_TIME + '</span></td>'
                                + '<td>' + _html_pillars.D4 + '<span class="td-text bar-base ' + d4_3 + ' j-time" id="VI_ANA_DELAY' + i + '" data="转入待解析时间：' + data[i].VI_CP2LP_TM + ',解析开始时间：' + data[i].VI_PROC_START_TM + ',转入待解析时间(最小)：' + max_cp2lp_tm_min.MIN + ',等待（分）：' + getDifferenceMinute(data[i].VI_CP2LP_TM, max_cp2lp_tm_min.MIN) + '【转入待解析时间-转入待解析时间(最小)】,耗时（分）：' + data[i].VI_ANA_DELAY + '【解析开始时间-转入待解析时间】">' + data[i].VI_ANA_DELAY + '</span></td>'
                                + '<td>' + _html_pillars.D5 + '<span class="td-text bar-base ' + d5_3 + ' j-time" category="ANA_TIME" id="VI_ANA_TIME' + i + '" data="解析开始时间：' + data[i].VI_PROC_START_TM + ',解析结束时间：' + data[i].VI_PROC_END_TM + ',解析开始时间(最小)：' + max_proc_start_tm_min.MIN + ',等待（分）：' + getDifferenceMinute(data[i].VI_PROC_START_TM, max_proc_start_tm_min.MIN) + '【解析开始时间-解析开始时间(最小)】,耗时（分）：' + data[i].VI_ANA_TIME + '【解析结束时间-解析开始时间】">' + data[i].VI_ANA_TIME + '</span></td>'
                           + '</tr>'
                            + _html_similar_tr
                                + '<td>可见光IDX</td>'
                                + '<td><span class="td-text text-mt-0 j-time" id="VI_IDX_TOTAL_DELAY' + i + '" data="文件生成时间：' + data[i].VI_IDX_CREATE_TM + ',解析完成时间：' + data[i].VI_IDX_PROC_END_TM + '">' + data[i].VI_IDX_TOTAL_DELAY + '</span></td>'
                                + '<td>' + _html_pillars.E1 + '<span class="td-text text-mt-0 j-time" id="VI_IDX_UPDATE_DELAY' + i + '" data="文件生成时间：' + data[i].VI_IDX_CREATE_TM + ',上传开始时间：' + data[i].VI_IDX_TRANS_START_TM + '">' + data[i].VI_IDX_UPDATE_DELAY + '</span></td>'
                                + '<td>' + _html_pillars.E2 + '<span class="td-text bar-base ' + e2_3 + ' j-time" id="VI_IDX_UPDATE_TIME' + i + '" data="上传开始时间：' + data[i].VI_IDX_TRANS_START_TM + ',上传结束时间：' + data[i].VI_IDX_TRANS_END_TM + ',上传开始时间(最小)：' + max_trans_start_tm_min.MIN + ',等待（分）：' + getDifferenceMinute(data[i].VI_IDX_TRANS_START_TM, max_trans_start_tm_min.MIN) + '【上传开始时间-上传开始时间(最小)】,耗时（分）：' + data[i].VI_IDX_UPDATE_TIME + '【上传结束时间-上传开始时间】">' + data[i].VI_IDX_UPDATE_TIME + '</span></td>'
                                + '<td>' + _html_pillars.E3 + '<span class="td-text bar-base ' + e3_3 + ' j-time" id="VI_IDX_TRANS_TIME' + i + '" data="上传结束时间：' + data[i].VI_IDX_TRANS_END_TM + ',转入待解析时间：' + data[i].VI_IDX_CP2LP_TM + ',上传结束时间(最小)：' + max_trans_end_tm_min.MIN + ',等待（分）：' + getDifferenceMinute(data[i].VI_IDX_TRANS_END_TM, max_trans_end_tm_min.MIN) + '【上传结束时间-上传结束时间(最小)】,耗时（分）：' + data[i].VI_IDX_TRANS_TIME + '【转入待解析时间-上传结束时间】">' + data[i].VI_IDX_TRANS_TIME + '</span></td>'
                                + '<td>' + _html_pillars.E4 + '<span class="td-text bar-base ' + e4_3 + ' j-time" id="VI_IDX_ANA_DELAY' + i + '" data="转入待解析时间：' + data[i].VI_IDX_CP2LP_TM + ',解析开始时间：' + data[i].VI_IDX_PROC_START_TM + ',转入待解析时间(最小)：' + max_cp2lp_tm_min.MIN + ',等待（分）：' + getDifferenceMinute(data[i].VI_IDX_CP2LP_TM, max_cp2lp_tm_min.MIN) + '【转入待解析时间-转入待解析时间(最小)】,耗时（分）：' + data[i].VI_IDX_ANA_DELAY + '【解析开始时间-转入待解析时间】">' + data[i].VI_IDX_ANA_DELAY + '</span></td>'
                                + '<td>' + _html_pillars.E5 + '<span class="td-text bar-base ' + e5_3 + ' j-time" category="ANA_TIME" id="VI_IDX_ANA_TIME' + i + '" data="解析开始时间：' + data[i].VI_IDX_PROC_START_TM + ',解析结束时间：' + data[i].VI_IDX_PROC_END_TM + ',解析开始时间(最小)：' + max_proc_start_tm_min.MIN + ',等待（分）：' + getDifferenceMinute(data[i].VI_IDX_PROC_START_TM, max_proc_start_tm_min.MIN) + '【解析开始时间-解析开始时间(最小)】,耗时（分）：' + data[i].VI_IDX_ANA_TIME + '【解析结束时间-解析开始时间】">' + data[i].VI_IDX_ANA_TIME + '</span></td>'
                           + '</tr>'
                            + _html_similar_tr
                                + '<td>全景</td>'
                                + '<td><span class="td-text text-mt-0 j-time" id="OA_TOTAL_DELAY' + i + '" data="文件生成时间：' + data[i].OA_CREATE_TM + ',解析完成时间：' + data[i].OA_PROC_END_TM + '">' + data[i].OA_TOTAL_DELAY + '</span></td>'
                                + '<td>' + _html_pillars.F1 + '<span class="td-text text-mt-0 j-time" id="OA_UPDATE_DELAY' + i + '" data="文件生成时间：' + data[i].OA_CREATE_TM + ',上传开始时间：' + data[i].OA_TRANS_START_TM + '">' + data[i].OA_UPDATE_DELAY + '</span></td>'
                                + '<td>' + _html_pillars.F2 + '<span class="td-text bar-base ' + f2_3 + ' j-time" id="OA_UPDATE_TIME' + i + '" data="上传开始时间：' + data[i].OA_TRANS_START_TM + ',上传结束时间：' + data[i].OA_TRANS_END_TM + ',上传开始时间(最小)：' + max_trans_start_tm_min.MIN + ',等待（分）：' + getDifferenceMinute(data[i].OA_TRANS_START_TM, max_trans_start_tm_min.MIN) + '【上传开始时间-上传开始时间(最小)】,耗时（分）：' + data[i].OA_UPDATE_TIME + '【上传结束时间-上传开始时间】">' + data[i].OA_UPDATE_TIME + '</span></td>'
                                + '<td>' + _html_pillars.F3 + '<span class="td-text bar-base ' + f3_3 + ' j-time" id="OA_TRANS_TIME' + i + '" data="上传结束时间：' + data[i].OA_TRANS_END_TM + ',转入待解析时间：' + data[i].OA_CP2LP_TM + ',上传结束时间(最小)：' + max_trans_end_tm_min.MIN + ',等待（分）：' + getDifferenceMinute(data[i].OA_TRANS_END_TM, max_trans_end_tm_min.MIN) + '【上传结束时间-上传结束时间(最小)】,耗时（分）：' + data[i].OA_TRANS_TIME + '【转入待解析时间-上传结束时间】">' + data[i].OA_TRANS_TIME + '</span></td>'
                                + '<td>' + _html_pillars.F4 + '<span class="td-text bar-base ' + f4_3 + ' j-time" id="OA_ANA_DELAY' + i + '" data="转入待解析时间：' + data[i].OA_CP2LP_TM + ',解析开始时间：' + data[i].OA_PROC_START_TM + ',转入待解析时间(最小)：' + max_cp2lp_tm_min.MIN + ',等待（分）：' + getDifferenceMinute(data[i].OA_CP2LP_TM, max_cp2lp_tm_min.MIN) + '【转入待解析时间-转入待解析时间(最小)】,耗时（分）：' + data[i].OA_ANA_DELAY + '【解析开始时间-转入待解析时间】">' + data[i].OA_ANA_DELAY + '</span></td>'
                                + '<td>' + _html_pillars.F5 + '<span class="td-text bar-base ' + f5_3 + ' j-time" category="ANA_TIME" id="OA_ANA_TIME' + i + '" data="解析开始时间：' + data[i].OA_PROC_START_TM + ',解析结束时间：' + data[i].OA_PROC_END_TM + ',解析开始时间(最小)：' + max_proc_start_tm_min.MIN + ',等待（分）：' + getDifferenceMinute(data[i].OA_PROC_START_TM, max_proc_start_tm_min.MIN) + '【解析开始时间-解析开始时间(最小)】,耗时（分）：' + data[i].OA_ANA_TIME + '【解析结束时间-解析开始时间】">' + data[i].OA_ANA_TIME + '</span></td>'
                           + '</tr>'
                            + _html_similar_tr
                                + '<td>全景IDX</td>'
                                + '<td><span class="td-text text-mt-0 j-time" id="OA_IDX_TOTAL_DELAY' + i + '" data="文件生成时间：' + data[i].OA_IDX_CREATE_TM + ',解析完成时间：' + data[i].OA_IDX_PROC_END_TM + '">' + data[i].OA_IDX_TOTAL_DELAY + '</span></td>'
                                + '<td>' + _html_pillars.G1 + '<span class="td-text text-mt-0 j-time" id="OA_IDX_UPDATE_DELAY' + i + '" data="文件生成时间：' + data[i].OA_IDX_CREATE_TM + ',上传开始时间：' + data[i].OA_IDX_TRANS_START_TM + '">' + data[i].OA_IDX_UPDATE_DELAY + '</span></td>'
                                + '<td>' + _html_pillars.G2 + '<span class="td-text bar-base ' + g2_3 + ' j-time" id="OA_IDX_UPDATE_TIME' + i + '" data="上传开始时间：' + data[i].OA_IDX_TRANS_START_TM + ',上传结束时间：' + data[i].OA_IDX_TRANS_END_TM + ',上传开始时间(最小)：' + max_trans_start_tm_min.MIN + ',等待（分）：' + getDifferenceMinute(data[i].OA_IDX_TRANS_START_TM, max_trans_start_tm_min.MIN) + '【上传开始时间-上传开始时间(最小)】,耗时（分）：' + data[i].OA_IDX_UPDATE_TIME + '【上传结束时间-上传开始时间】">' + data[i].OA_IDX_UPDATE_TIME + '</span></td>'
                                + '<td>' + _html_pillars.G3 + '<span class="td-text bar-base ' + g3_3 + ' j-time" id="OA_IDX_TRANS_TIME' + i + '" data="上传结束时间：' + data[i].OA_IDX_TRANS_END_TM + ',转入待解析时间：' + data[i].OA_IDX_CP2LP_TM + ',上传结束时间(最小)：' + max_trans_end_tm_min.MIN + ',等待（分）：' + getDifferenceMinute(data[i].OA_IDX_TRANS_END_TM, max_trans_end_tm_min.MIN) + '【上传结束时间-上传结束时间(最小)】,耗时（分）：' + data[i].OA_IDX_TRANS_TIME + '【转入待解析时间-上传结束时间】">' + data[i].OA_IDX_TRANS_TIME + '</span></td>'
                                + '<td>' + _html_pillars.G4 + '<span class="td-text bar-base ' + g4_3 + ' j-time" id="OA_IDX_ANA_DELAY' + i + '" data="转入待解析时间：' + data[i].OA_IDX_CP2LP_TM + ',解析开始时间：' + data[i].OA_IDX_PROC_START_TM + ',转入待解析时间(最小)：' + max_cp2lp_tm_min.MIN + ',等待（分）：' + getDifferenceMinute(data[i].OA_IDX_CP2LP_TM, max_cp2lp_tm_min.MIN) + '【转入待解析时间-转入待解析时间(最小)】,耗时（分）：' + data[i].OA_IDX_ANA_DELAY + '【解析开始时间-转入待解析时间】">' + data[i].OA_IDX_ANA_DELAY + '</span></td>'
                                + '<td>' + _html_pillars.G5 + '<span class="td-text bar-base ' + g5_3 + ' j-time" category="ANA_TIME" id="OA_IDX_ANA_TIME' + i + '" data="解析开始时间：' + data[i].OA_IDX_PROC_START_TM + ',解析结束时间：' + data[i].OA_IDX_PROC_END_TM + ',解析开始时间(最小)：' + max_proc_start_tm_min.MIN + ',等待（分）：' + getDifferenceMinute(data[i].OA_IDX_PROC_START_TM, max_proc_start_tm_min.MIN) + '【解析开始时间-解析开始时间(最小)】,耗时（分）：' + data[i].OA_IDX_ANA_TIME + '【解析结束时间-解析开始时间】">' + data[i].OA_IDX_ANA_TIME + '</span></td>'
                           + '</tr>'
                            + _html_similar_tr
                                + '<td>辅助</td>'
                                + '<td><span class="td-text text-mt-0 j-time" id="AUX_TOTAL_DELAY' + i + '" data="文件生成时间：' + data[i].AUX_CREATE_TM + ',解析完成时间：' + data[i].AUX_PROC_END_TM + '">' + data[i].AUX_TOTAL_DELAY + '</span></td>'
                                + '<td>' + _html_pillars.H1 + '<span class="td-text text-mt-0 j-time" id="AUX_UPDATE_DELAY' + i + '" data="文件生成时间：' + data[i].AUX_CREATE_TM + ',上传开始时间：' + data[i].AUX_TRANS_START_TM + '">' + data[i].AUX_UPDATE_DELAY + '</span></td>'
                                + '<td>' + _html_pillars.H2 + '<span class="td-text bar-base ' + h2_3 + ' j-time" id="AUX_UPDATE_TIME' + i + '" data="上传开始时间：' + data[i].AUX_TRANS_START_TM + ',上传结束时间：' + data[i].AUX_TRANS_END_TM + ',上传开始时间(最小)：' + max_trans_start_tm_min.MIN + ',等待（分）：' + getDifferenceMinute(data[i].AUX_TRANS_START_TM, max_trans_start_tm_min.MIN) + '【上传开始时间-最小上传开始时间】,耗时（分）：' + data[i].AUX_UPDATE_TIME + '【上传结束时间-上传开始时间】">' + data[i].AUX_UPDATE_TIME + '</span></td>'
                                + '<td>' + _html_pillars.H3 + '<span class="td-text bar-base ' + h3_3 + ' j-time" id="AUX_TRANS_TIME' + i + '" data="上传结束时间：' + data[i].AUX_TRANS_END_TM + ',转入待解析时间：' + data[i].AUX_CP2LP_TM + ',上传结束时间(最小)：' + max_trans_end_tm_min.MIN + ',等待（分）：' + getDifferenceMinute(data[i].AUX_TRANS_END_TM, max_trans_end_tm_min.MIN) + '【上传结束时间-最小上传结束时间】,耗时（分）：' + data[i].AUX_TRANS_TIME + '【转入待解析时间-上传结束时间】">' + data[i].AUX_TRANS_TIME + '</span></td>'
                                + '<td>' + _html_pillars.H4 + '<span class="td-text bar-base ' + h4_3 + ' j-time" id="AUX_ANA_DELAY' + i + '" data="转入待解析时间：' + data[i].AUX_CP2LP_TM + ',解析开始时间：' + data[i].AUX_PROC_START_TM + ',转入待解析时间(最小)：' + max_cp2lp_tm_min.MIN + ',等待（分）：' + getDifferenceMinute(data[i].AUX_CP2LP_TM, max_cp2lp_tm_min.MIN) + '【转入待解析时间-最小转入待解析时间】,耗时（分）：' + data[i].AUX_ANA_DELAY + '【解析开始时间-转入待解析时间】">' + data[i].AUX_ANA_DELAY + '</span></td>'
                                + '<td>' + _html_pillars.H5 + '<span class="td-text bar-base ' + h5_3 + ' j-time" category="ANA_TIME" id="AUX_ANA_TIME' + i + '" data="解析开始时间：' + data[i].AUX_PROC_START_TM + ',解析结束时间：' + data[i].AUX_PROC_END_TM + ',解析开始时间(最小)：' + max_proc_start_tm_min.MIN + ',等待（分）：' + getDifferenceMinute(data[i].AUX_PROC_START_TM, max_proc_start_tm_min.MIN) + '【解析开始时间-最小解析开始时间】,耗时（分）：' + data[i].AUX_ANA_TIME + '【解析结束时间-解析开始时间】">' + data[i].AUX_ANA_TIME + '</span></td>'
                           + '</tr>'
                            + _html_similar_tr
                                + '<td>辅助IDX</td>'
                                + '<td><span class="td-text text-mt-0 j-time" id="AUX_IDX_TOTAL_DELAY' + i + '" data="文件生成时间：' + data[i].AUX_IDX_CREATE_TM + ',解析完成时间：' + data[i].AUX_IDX_PROC_END_TM + '">' + data[i].AUX_IDX_TOTAL_DELAY + '</span></td>'
                                + '<td>' + _html_pillars.K1 + '<span class="td-text text-mt-0 j-time" id="AUX_IDX_UPDATE_DELAY' + i + '" data="文件生成时间：' + data[i].AUX_IDX_CREATE_TM + ',上传开始时间：' + data[i].AUX_IDX_TRANS_START_TM + '">' + data[i].AUX_IDX_UPDATE_DELAY + '</span></td>'
                                + '<td>' + _html_pillars.K2 + '<span class="td-text bar-base ' + k2_3 + ' j-time" id="AUX_IDX_UPDATE_TIME' + i + '" data="上传开始时间：' + data[i].AUX_IDX_TRANS_START_TM + ',上传结束时间：' + data[i].AUX_IDX_TRANS_END_TM + ',上传开始时间(最小)：' + max_trans_start_tm_min.MIN + ',等待（分）：' + getDifferenceMinute(data[i].AUX_IDX_TRANS_START_TM, max_trans_start_tm_min.MIN) + '【上传开始时间-最小上传开始时间】,耗时（分）：' + data[i].AUX_IDX_UPDATE_TIME + '【上传结束时间-上传开始时间】">' + data[i].AUX_IDX_UPDATE_TIME + '</span></td>'
                                + '<td>' + _html_pillars.K3 + '<span class="td-text bar-base ' + k3_3 + ' j-time" id="AUX_IDX_TRANS_TIME' + i + '" data="上传结束时间：' + data[i].AUX_IDX_TRANS_END_TM + ',转入待解析时间：' + data[i].AUX_IDX_CP2LP_TM + ',上传结束时间(最小)：' + max_trans_end_tm_min.MIN + ',等待（分）：' + getDifferenceMinute(data[i].AUX_IDX_TRANS_END_TM, max_trans_end_tm_min.MIN) + '【上传结束时间-最小上传结束时间】,耗时（分）：' + data[i].AUX_IDX_TRANS_TIME + '【转入待解析时间-上传结束时间】">' + data[i].AUX_IDX_TRANS_TIME + '</span></td>'
                                + '<td>' + _html_pillars.K4 + '<span class="td-text bar-base ' + k4_3 + ' j-time" id="AUX_IDX_ANA_DELAY' + i + '" data="转入待解析时间：' + data[i].AUX_IDX_CP2LP_TM + ',解析开始时间：' + data[i].AUX_IDX_PROC_START_TM + ',转入待解析时间(最小)：' + max_cp2lp_tm_min.MIN + ',等待（分）：' + getDifferenceMinute(data[i].AUX_IDX_CP2LP_TM, max_cp2lp_tm_min.MIN) + '【转入待解析时间-最小转入待解析时间】,耗时（分）：' + data[i].AUX_IDX_ANA_DELAY + '【解析开始时间-转入待解析时间】">' + data[i].AUX_IDX_ANA_DELAY + '</span></td>'
                                + '<td>' + _html_pillars.K5 + '<span class="td-text bar-base ' + k5_3 + ' j-time" category="ANA_TIME" id="AUX_IDX_ANA_TIME' + i + '" data="解析开始时间：' + data[i].AUX_IDX_PROC_START_TM + ',解析结束时间：' + data[i].AUX_IDX_PROC_END_TM + ',解析开始时间(最小)：' + max_proc_start_tm_min.MIN + ',等待（分）：' + getDifferenceMinute(data[i].AUX_IDX_PROC_START_TM, max_proc_start_tm_min.MIN) + '【解析开始时间-最小解析开始时间】,耗时（分）：' + data[i].AUX_IDX_ANA_TIME + '【解析结束时间-解析开始时间】">' + data[i].AUX_IDX_ANA_TIME + '</span></td>'
                           + '</tr>';
                    }
                    $('#table-details').html(_html_head + _html_con);
                    $('.j-time').css({ 'cursor': 'pointer' });
                    $('.j-order').css('cursor', 'pointer');

                    //展示甘特图
                    for (var j = 0; j < data.length; j++) {
                        var arr_similar = $('tr.similar_' + j); //获取有甘特图的行
                        for (var t1 = 0; t1 < arr_similar.length; t1++) {
                            var arr_bar_base = $(arr_similar[t1]).find('span.bar-base'); //获取有甘特图的表格td
                            for (var t2 = 0; t2 < arr_bar_base.length; t2++) {
                                var width = $(arr_bar_base[t2]).width(); //获取表格宽度

                                var pillars_gray = $(arr_bar_base[t2]).parent().find('.pillars-gray').attr('proportion'); //获取灰色柱子的比例
                                $(arr_bar_base[t2]).parent().find('.pillars-gray').css({ 'width': pillars_gray * width }); //设置灰色柱子在表格中的长度

                                var pillars_green = $(arr_bar_base[t2]).parent().find('.pillars-green').attr('proportion'); //获取绿色柱子的比例
                                $(arr_bar_base[t2]).parent().find('.pillars-green').css({ 'width': pillars_green * width });//设置绿色柱子在表格中的长度
                            }
                        }
                    }

                    //展开与折叠按钮位置设置
                    var tr_switch = $('#table-details .tr-switch');
                    for (var t = 0; t < tr_switch.length; t++) {
                        var height = $(tr_switch[t]).next('.multi-line-con').height() - 22;
                        $(tr_switch[t]).css({ 'margin-top': height * 0.5 + 'px' });
                    }

                }
            }
        }
    });
}

/*/*
 * @desc 获取所占比例
 * @param 
 */
function getProportion(time_1, time_2, total_timme) {
    return ((Date.parse(time_1) - Date.parse(time_2)) / 1000 / 60 / total_timme);
}

/*/*
 * @desc 获取分差
 * @param 
 */
function getDifferenceMinute(time_1, time_2) {
    return ((Date.parse(time_1) - Date.parse(time_2)) / 1000 / 60).toFixed(2);
}

/*/*
 * @desc 获取字符串
 * @param 
 */
function getString(val_1, val_2, stringType) {
    var string = '';
    if ('CLASSNAME' === stringType) {
        var re = /^[0-9]+.?[0-9]*$/; //数字正则
        if (re.test(val_1) || re.test(val_2)) {
            if (val_1 === 0 && val_2 === 0) {
                string = 'text-mt-0';
            } else {
                string = 'text-mt-18';
            }
        } else if (!re.test(val_1) && !re.test(val_2)) {
            string = 'text-mt-0';
        }
    }
    if ('BAR' === stringType) {
        string = '<span class="pillars pillars-gray" proportion="' + val_1 + '"></span><span class="pillars pillars-green" proportion="' + val_2 + '"></span>';
    }
    return string;
}

/*/*
 * @desc 获取时间的最大值最小值
 * @param 
 */
function findTimeMaxMin(arr) {
    var max_index = 0, max = arr[0];
    var min_index = 0, min = arr[0];
    for (var i = 0; i < arr.length; i++) {
        if (undefined !== arr[i] && '' !== arr[i]) {
            if (arr[i] > max) {
                max = arr[i];
                max_index = i;
            }
            if (arr[i] < min) {
                min = arr[i];
                min_index = i;
            }
        }
    }
    return {
        MAX: max,
        MIN: min
    };
}

/*/*
 * @desc 获取最大值的标志
 * @param 
 */
function findMax(arr_time) {
    var max_index = 0, max = Number(arr_time[0].split('|')[0]), max_flag = arr_time[0].split('|')[1];
    if ('' === arr_time[0].split('|')[0]) {
        max_flag = '';
    }
    for (var i = 0; i < arr_time.length; i++) {
        var arr = arr_time[i].split('|');
        if (undefined !== arr[0] && '' !== arr[0]) {
            arr[0] = Number(arr[0]);
            if (arr[0] > max) {
                max = arr[0];
                max_flag = arr[1];
                max_index = i;
            }
        }
    }
    return max_flag;
}

/**
 * @desc 初始化控件
 * @param 
 */
function initControls() {
    //按组织机构选择设备编号控件
    $('#device-number').LocoSelect({
        position: 'MonitorLocoAlarmList'
    });
    //纯设备编号控件
    $('#device-number').inputSelect({
        type: 'loca',
        contant: 2
    });
    //组织机构控件
    $('#organization').mySelectTree({
        tag: 'ORGANIZATION',
        enableFilter: true
    });
    //线路区站控件
    $('#line-position').mySelectTree({
        tag: 'BRIDGETUNE',
        height: 250,
        enableFilter: true,
        filterNumber: 2,
        enableCheck: true,
        chkboxType: { "Y": "s", "N": "s" },
        nocheck: true,
        onCheck: function (event, treeId, treeNode) {
            var zTree = $.fn.zTree.getZTreeObj(treeId),
            nodes = zTree.getCheckedNodes(true),
             v = "", code = "";
            for (var i = 0, l = nodes.length; i < l; i++) {
                v += nodes[i].name + ",";
                code += nodes[i].id + ",";
            }
            if (v.length > 0) v = v.substring(0, v.length - 1);
            if (code.length > 0) code = code.substring(0, code.length - 1);
            var cityObj = $("#line-position");
            cityObj.attr("value", v).attr("code", code).attr("treetype", "LINE");
        },
        onClick: function (event, treeId, treeNode) {
            var treeObj = $.fn.zTree.getZTreeObj(treeId);
            treeObj.checkAllNodes(false);
            $('#line-position').attr("value", "");
            $('#line-position').val(treeNode.name).attr({ "code": treeNode.id, "treetype": treeNode.treeType });
        }
    });
    //发生时间
    initTime('system', '#s-time', '#e-time');
    //设备编号
    $('#droup_device-number').css('margin-top', '0');
    $('#device-number').next().css('top', '3px');
    $('#ul_device-number').css('margin-top', '0');
    //组织机构
    $('#organization').next().css('top', '-4px');
    //线路区站
    $('#line-position').next().css('top', '-4px');
    //关闭当前页
    $('.j-close').click(function () {
        window.close();
    });
    if (undefined !== theString.LocomotiveCode) {
        device_number = theString.LocomotiveCode;
        $('#device-number').val(device_number); //设备编号
    }
    if (undefined !== theString.orgType) {
        org_type = theString.orgType;
        $('#organization').attr('treetype', org_type); //组织类型
    }
    if (undefined !== theString.orgCode) {
        org_code = theString.orgCode;
        $('#organization').attr('code', org_code); //组织编码
    }
    if (undefined !== theString.orgName) {
        $('#organization').attr('value', theString.orgName); //组织名
    }
    if (undefined !== theString.positionType) {
        line_position_type = theString.positionType;
        $('#line-position').attr('treetype', line_position_type); //线路区站类型
    }
    if (undefined !== theString.positionCode) {
        line_position_code = theString.positionCode;
        $('#line-position').attr('code', line_position_code); //线路代码
    }
    if (undefined !== theString.lineName) {
        $('#line-position').attr('value', theString.lineName); //线路名
    }
    if (undefined !== theString.startTime) {
        s_time = theString.startTime;
        $('#s-time').val(s_time); //开始时间
    }
    if (undefined !== theString.endTime) {
        e_time = theString.endTime;
        $('#e-time').val(e_time); //结束时间
    }
    if (undefined !== theString.minDelayTime) {
        min_delay = parseInt(theString.minDelayTime);
        if (-1 !== min_delay) {
            $('#min-delay').val(min_delay); //最小延时
        }
    }
    if (undefined !== theString.maxDelayTime) {
        max_delay = parseInt(theString.maxDelayTime);
        if (-1 !== max_delay) {
            $('#max-delay').val(max_delay); //最大延时
        }
    }
}

/**
 * @desc 加载时间
 * @param 
 */
function initTime(time_type, element_stime, element_etime) {
    if ('system' == time_type) {
        var sysTime = new Date();
        var e_Time = sysTime.format('yyyy-MM-dd');
        //var beforeTime = AddDays(sysTime, -7);
        //var s_Time = beforeTime.format('yyyy-MM-dd');
        $(element_stime).attr('value', DateLastWeekTime() + '00:00:00');
        $(element_etime).attr('value', e_Time + ' 23:59:59');
    } else if ('condition' == time_type) {
        var s_Time = $(element_stime).val();
        var e_Time = $(element_etime).val();
        $(element_stime).attr('value', s_Time);
        $(element_etime).attr('value', e_Time);
    }
}

/**
 * @desc 创建表头
 * @param 
 */
function createTableHead(head_type, arr_obj) {
    var _html_create_head = '';
    if ('default' === head_type && arr_obj === undefined) {
        _html_create_head =
        '<tr>'
            + '<th class="letter-spacing-big th-w-big">报警</th>'
            + '<th class="letter-spacing-small th-w-middle"><span id="total-time-consuming" class="j-order color-blue">最长耗时(分)<span class="alarm-delay-ico arrow-ico arrow-down-cur" ranking="0" order-field="MAXFILEDELAY"></span></span></th>'
            + '<th>文件类型</th>'
            + '<th><span id="classifi-total-time-consuming">分类总耗时（分）</span></th>'
            + '<th><span id="upload-wait-time-consuming" class="j-order">上传等待耗时（分）<span class="alarm-delay-ico arrow-ico arrow-down-defult" ranking="1" order-field="UPDATE_DELAY"></span></span></th>'
            + '<th><span id="upload-time-consuming" class="j-order">上传耗时（分）<span class="alarm-delay-ico arrow-ico arrow-down-defult" ranking="2" order-field="UPDATE_TIME"></span></span></th>'
            + '<th><span id="take-time-consuming" class="j-order">转入解析耗时（分）<span class="alarm-delay-ico arrow-ico arrow-down-defult" ranking="3" order-field="TRANS_TIME"></span></span></th>'
            + '<th><span id="parse-wait-time-consuming" class="j-order">解析等待耗时（分）<span class="alarm-delay-ico arrow-ico arrow-down-defult" ranking="4" order-field="ANA_DELAY"></span></span></th>'
            + '<th><span id="parse-time-consuming" class="j-order">解析耗时（分）<span class="alarm-delay-ico arrow-ico arrow-down-defult" ranking="5" order-field="ANA_TIME"></span></span></th>'
        + '</tr>';
    }
    if ('customize' === head_type && arr_obj !== undefined) {
        _html_create_head =
        '<tr>'
            + '<th class="letter-spacing-big th-w-big">报警</th>'
            + '<th class="letter-spacing-small th-w-middle"><span id="total-time-consuming" class="j-order ' + arr_obj[0].split(',')[1] + '">最长耗时(分)<span class="alarm-delay-ico arrow-ico ' + arr_obj[0].split(',')[0] + '" ranking="0" order-field="MAXFILEDELAY"></span></span></th>'
            + '<th>文件类型</th>'
            + '<th><span id="classifi-total-time-consuming">分类总耗时（分）</span></th>'
            + '<th><span id="upload-wait-time-consuming" class="j-order ' + arr_obj[1].split(',')[1] + '">上传等待耗时（分）<span class="alarm-delay-ico arrow-ico ' + arr_obj[1].split(',')[0] + '" ranking="1" order-field="UPDATE_DELAY"></span></span></th>'
            + '<th><span id="upload-time-consuming" class="j-order ' + arr_obj[2].split(',')[1] + '">上传耗时（分）<span class="alarm-delay-ico arrow-ico ' + arr_obj[2].split(',')[0] + '" ranking="2" order-field="UPDATE_TIME"></span></span></th>'
            + '<th><span id="take-time-consuming" class="j-order ' + arr_obj[3].split(',')[1] + '">转入解析耗时（分）<span class="alarm-delay-ico arrow-ico ' + arr_obj[3].split(',')[0] + '" ranking="3" order-field="TRANS_TIME"></span></span></th>'
            + '<th><span id="parse-wait-time-consuming" class="j-order ' + arr_obj[4].split(',')[1] + '">解析等待耗时（分）<span class="alarm-delay-ico arrow-ico ' + arr_obj[4].split(',')[0] + '" ranking="4" order-field="ANA_DELAY"></span></span></th>'
            + '<th><span id="parse-time-consuming" class="j-order ' + arr_obj[5].split(',')[1] + '">解析耗时（分）<span class="alarm-delay-ico arrow-ico ' + arr_obj[5].split(',')[0] + '" ranking="5" order-field="ANA_TIME"></span></span></th>'
        + '</tr>';
    }
    return _html_create_head;
}

/**
 * @desc 清空表格
 * @param 
 */
function clearTable() {
    var _html_head = createTableHead('default');
    var _html_con = '<tr><td colspan="9">没有数据</td></tr>';
    $('#table-details').html(_html_head + _html_con);
}
