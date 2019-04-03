/*========================================================================================*
* 功能说明：行驶里程统计
* 注意事项：
* 作    者： tangmiao
* 版本日期：2016年8月3日
* 变更说明：
* 版 本 号： V1.0.0

页面参数    例子                说明

*=======================================================================================*/

var curDevice3C = '';  //当前站点所属的3C设备
var curRowID_del = '';  //当前站点的rowID
var index_add = '';  //弹出添加站点框的所属编号
var index_edit = '';  //弹出编辑站点框的所属编号
var index_delete = '';  //弹出删除询问框的所属编号
var index_add_device_station = '';  //弹出添加设备和站点框的所属编号
var index_special_station = ''; //弹出特站距离框的所属 编号
var scroll_bar_height = ''; //滚动条高度
var pageSize = 10; //每页数量
var min_time = ''; //站点间最小时间
var max_time = ''; //站点间最大时间 

$(document).ready(function () {

    //初始化控件
    initControls();

    //展示结果详情
    showDetail();

    //条件处的按钮事件
    topBtnEvent();

    //分析结果里的按钮事件
    analysisResultEvent();
});

/**
 * @desc 初始化控件
 * @param 
 */
function initControls() {
    //置顶
    loadGoTop();
    //加载组织机构下拉
    loadOrg($('#organization'));
    //加载3C设备下拉
    loadDevice3C($('#device3C'));
    //加载3C设备下拉2
    loadDevice3C($('#device'));
    //加载站点
    loadStation($('#station_line_address'));
    //加载站点2
    loadStation($('#station_line_address_device'));
    //加载指定时间
    loadTime('system', $('#startTime'), $('#endTime'));
    //$($(document).find('#organization').next()).css('top', '-5px');
    //$($(document).find('#device3C').next()).css('top', '1px');
    //$($(document).find('#device3C').parent().find('#ul_device3C')).css('margin-top', '-3px');
    //添加站点的按钮hover效果
    add_station_btn_hover();
    //移入图标显示说明
    var _index_change_line = '';
    var _index_km_count = '';
    var _index_custom_distance = '';
    $(document).on('mouseenter', '.j-change-line', function () {
        _index_change_line = layer.tips('换线站点', $(this), {
            tips: [1, '#a959ee'],
            time: ''
        });
    }).on('mouseleave', '.j-change-line', function () {
        layer.close(_index_change_line);
    });
    $(document).on('mouseenter', '.j-km-count', function () {
        _index_km_count = layer.tips('换线站点数据缺失', $(this), {
            tips: [1, '#a959ee'],
            time: ''
        });
    }).on('mouseleave', '.j-km-count', function () {
        layer.close(_index_km_count);
    });
    $(document).on('mouseenter', '.j-custom-distance', function () {
        _index_custom_distance = layer.tips('换线站点自定义数据', $(this), {
            tips: [1, '#a959ee'],
            time: ''
        });
    }).on('mouseleave', '.j-custom-distance', function () {
        layer.close(_index_custom_distance);
    });
    //移入站点显示该站点的线路
    $(document).on('mouseenter', '.j-line-name', function () {
        $(this).find('.line-name').removeClass('hide');
    }).on('mouseleave', '.j-line-name', function () {
        $(this).find('.line-name').addClass('hide');
    });
    //关闭弹出框
    $(document).on('click', '.j_close', function () {
        var act = $(this).parent().find('.act').val();
        if ('add' === act) {
            layer.close(index_add);
        } else if ('update' === act) {
            layer.close(index_edit);
        } else if ('delete' === act) {
            layer.close(index_delete);
        } else if ('add_device' === act) {
            layer.close(index_add_device_station);
        } else if ('special-station' === act) {
            layer.close(index_special_station);
        }
        resetHidden();  //清空隐藏标签的值
    });
    //移入图标提示查看图形化轨迹
    $(document).on('mouseenter', '.j-orbit-gis', function () {
        _index_orbit_gis = layer.tips('点击查看图形化轨迹', $(this), {
            tips: [1, '#a959ee'],
            time: ''
        });
    }).on('mouseleave', '.j-orbit-gis', function () {
        layer.close(_index_orbit_gis);
    });
    //加载站点（新）
    loadStation($('#position'));
    //loadStation($('#position-first'));
    //loadStation($('#position-second'));
    //在站点间添加站点或设置站点间距离（卡片切换至 添加站点）
    $('.j-add-edit-title').click(function () {
        var j_add_edit_title = $('.j-add-edit-title');
        var j_add_edit_distance = $('.j-add-edit-distance');
        var station_con = $('#station_con');
        var station_distance_con = $('#station_distance_con');
        if (!$(j_add_edit_title).hasClass('cur-card') && $(station_con).hasClass('hide')
            && $(j_add_edit_distance).hasClass('cur-card') && !$(station_distance_con).hasClass('hide')) {
            $(j_add_edit_title).addClass('cur-card');
            $(station_con).removeClass('hide');
            $(j_add_edit_distance).removeClass('cur-card');
            $(station_distance_con).addClass('hide');
        }
    });
    //在站点间添加站点或设置站点间距离（卡片切换至 站点距离）
    $('.j-add-edit-distance').click(function () {
        var j_add_edit_title = $('.j-add-edit-title');
        var j_add_edit_distance = $('.j-add-edit-distance');
        var station_con = $('#station_con');
        var station_distance_con = $('#station_distance_con');
        if ($(j_add_edit_title).hasClass('cur-card') && !$(station_con).hasClass('hide')
            && !$(j_add_edit_distance).hasClass('cur-card') && $(station_distance_con).hasClass('hide')) {
            $(j_add_edit_title).removeClass('cur-card');
            $(station_con).addClass('hide');
            $(j_add_edit_distance).addClass('cur-card');
            $(station_distance_con).removeClass('hide');
        }
    });
}

/**
 * @desc 条件处的按钮事件
 * @param 
 */
function topBtnEvent() {
    //点击搜索
    $(document).on('click', '.j_search', function () {
        validateSearch();//搜索验证
    });
    //点击导出
    $(document).on('click', '.j_export', function () {
        //var url = '/Report/KmCountReport.aspx?&_w=' + window.screen.width + "&_h=" + window.screen.height;
        url = '/Report/KmCountReport.aspx?action=query&_w=' + window.screen.width + "&_h=" + window.screen.height
            + '&bureauName=' + $('#organization').attr('code')
            + '&locomotive=' + $('#device3C').val()
            + '&startTime=' + $('#startTime').val()
            + '&endTime=' + $('#endTime').val();
        window.open(url);
    });
    //点击添加设备和站点
    $(document).on('click', '.j_add_device_station', function () {
        //设置隐藏属性
        $('#add_device_station_info').find('.act').attr('value', 'add_device');
        //打开添加设备和站点框
        index_add_device_station = showDialog($('#add_device_station_info'), '514px', '420px');
    });
    //点击添加设备和站点的确定
    $(document).on('click', '.j_device_station_ok', function () {
        var act = $('#add_device_station_info').find('.act').val();
        var device = $('#device').val();
        var stationLineAddressDevice = $('#station_line_address_device').attr('code');
        var deviceDetectionTime = $('#device_detection_time').val();
        if ('' !== device && '' !== stationLineAddressDevice && '' !== deviceDetectionTime) {
            stationAdd(act, device, stationLineAddressDevice, deviceDetectionTime);//添加设备和站点
        } else {
            layer.msg('请选择设备或站点或时间');
        }
    });
    //查看特站距离
    $(document).on('click', '.j_special_station', function () {
        $('#special-station .act').attr('value', 'special-station');
        index_special_station = showDialog($('#special-station'), '700px', '540px');
        getDistance();
    });
}

/**
 * @desc 分析结果里的按钮事件
 * @param 
 */
function analysisResultEvent() {
    add_station_start_or_end(); //在本车开始或末尾途径站
    edit_station(); //编辑站点
    sub_data(); //提交数据
    del_station(); //删除站点
    add_station_between_or_set_distance(); //站点间添加站点或设置距离
    //图形化轨迹
    $(document).on('click', '.j-orbit-gis', function () {
        var sTime = $('#startTime').val();
        var eTime = $('#endTime').val();
        var device = $(this).attr('device');
        var url = '/Common/MGIS/OrbitGIS.htm?Category_Code=DPC&deviceid=' + device + '&startdate=' + sTime + '&enddate=' + eTime;
        window.open(url);
    });
    //站点间图形化轨迹
    $(document).on('click', '.j-orbit-gis-in', function () {
        var sTime = $(this).parent().parent().prev().find('.time').html();
        sTime = Replace(sTime, '.', '-');
        var eTime = $(this).parent().parent().find('.time').html();
        eTime = Replace(eTime, '.', '-');
        var device = $(this).attr('device');
        var url = '/Common/MGIS/OrbitGIS.htm?Category_Code=DPC&deviceid=' + device + '&startdate=' + sTime + '&enddate=' + eTime;
        window.open(url);
    });
    //特站距离中的条件搜索
    $(document).on('click', '.j-search-station', function () {
        getDistance();
    });
}

/**
 * @desc 编辑站点
 * @param 
 */
function edit_station() {
    //点击编辑本车途经站
    $(document).on('click', '.j_edit', function () {
        //获取当前站点的设备编号、rowID、站点名称、时间
        var stationAuto = $(this).parent().parent().next();
        curDevice3C = $(stationAuto).find('.device3CName').val();
        var curRowID = $(stationAuto).find('.rowID').val();
        var curAddress = $(stationAuto).find('.address_auto .position-name').html();
        var curAddressCode = $(stationAuto).find('.address_auto .position-name').attr('code');
        var curTime = $(stationAuto).find('.time').html();
        var curLine = $(this).parent().parent().parent().prev().find('.line_name').html();
        if ('' !== curLine && undefined !== curLine && null !== curLine) {
            $('#ULstation_line_address').prev().find('input[name=ztree]').val(curLine);
            $('#ULstation_line_address').prev().find('input[name=ztree]').trigger($.Event('input'));
        }
        //var reg = '\.';
        //curTime = curTime.replace(reg, '-');
        //curTime = curTime.replace(reg, '-');
        curTime = Replace(curTime, '.', '-');
        //设置隐藏属性
        $('#station_line_address').attr('value', curAddress);
        $('#station_line_address').attr('code', curAddressCode);
        $('#detection_time').attr('value', curTime);
        $('.rowID').attr('value', curRowID);
        $('#add_edit_station_info').find('.act').attr('value', 'update');
        //打开编辑站点框
        index_edit = showDialog($('#add_edit_station_info'), '505px', '320px');
        scroll_bar_height = $(document).scrollTop();
    });

    ////在两个站点之间添加站点
    //$(document).on('click', '.j-add-station-between', function () {
    //    //设置隐藏属性
    //    $('#add_edit_station_info').find('.act').attr('value', 'add');
    //    //获取当前的设备编号
    //    var deviceTable = $(this).parent().parent().parent().prev().find('span.device_3C');
    //    curDevice3C = $(deviceTable).text();
    //    //获取两个站点之间的线路
    //    var currentLine = $(this).parent().find('.line_name').html();
    //    if ('' !== currentLine && undefined !== currentLine && null !== currentLine) {
    //        $('#ULstation_line_address').prev().find('input[name=ztree]').val(currentLine);
    //        $('#ULstation_line_address').prev().find('input[name=ztree]').trigger($.Event('input'));
    //    }
    //    //获取前一站点的时间
    //    var prev_time = '';
    //    prev_time = $(this).parent().parent().prev().find('.time').html();
    //    prev_time = Replace(prev_time, '.', '-');
    //    prev_time = new Date(Date.parse(prev_time));
    //    //获取后一站点的时间
    //    var next_time = '';
    //    next_time = $(this).parent().next().find('.time').html();
    //    next_time = Replace(next_time, '.', '-');
    //    next_time = new Date(Date.parse(next_time));
    //    //计算站点时间差（单位：秒）
    //    var seconds_diff = ''; // 秒差
    //    seconds_diff = (next_time - prev_time) / 1000 / 2;  //获取秒差（单位：秒）
    //    //根据两个相邻站点的时间，计算出添加站点时的默认时间
    //    var cur_time = ''; // 加上时间差之后的时间
    //    var arr = formatTimeStamp(seconds_diff); //将秒差格式化成 年月天 时分秒
    //    cur_time = AddSeconds(prev_time, +arr.seconds); //增加秒
    //    cur_time = AddMinutes(prev_time, +arr.minutes); //增加分
    //    cur_time = AddHours(prev_time, +arr.hours); //增加时
    //    cur_time = AddDays(prev_time, +arr.days); //增加天
    //    cur_time = AddMonths(prev_time, +arr.months); //增加月
    //    cur_time = AddYears(prev_time, +arr.years); //增加年

    //    cur_time = cur_time.format('yyyy-MM-dd hh:mm:ss');
    //    $('#detection_time').val(cur_time);

    //    //打开添加站点框
    //    index_add = showDialog($('#add_edit_station_info'), '505px', '320px');
    //    scroll_bar_height = $(document).scrollTop();
    //});
}

/**
 * @desc 在本车开始或末尾途径站
 * @param 
 */
function add_station_start_or_end() {
    //在第一个站点前添加站点
    $(document).on('click', '.j-add-station-start', function () {
        //设置隐藏属性
        $('#add_edit_station_info').find('.act').attr('value', 'add');
        //获取当前的设备编号
        var deviceTable = $(this).parent().prev().find('span.device_3C');
        curDevice3C = $(deviceTable).text();
        //获取后一个站点的线路
        var currentLine = $(this).next().find('.line_name').html();
        if ('' !== currentLine && undefined !== currentLine && null !== currentLine) {
            $('#ULstation_line_address').prev().find('input[name=ztree]').val(currentLine);
            $('#ULstation_line_address').prev().find('input[name=ztree]').trigger($.Event('input'));
        }
        //获取后一个站点的时间
        var next_time = $(this).next().find('.time').html();
        //根据后一个站点的时间，计算出添加站点时的默认时间
        var cur_time = '';
        cur_time = AddMinutes(parseDate(next_time), -30);
        cur_time = cur_time.format('yyyy-MM-dd hh:mm:ss');
        $('#detection_time').val(cur_time);
        //打开添加站点框
        index_add = showDialog($('#add_edit_station_info'), '505px', '320px');
        scroll_bar_height = $(document).scrollTop();
    });

    //在最后一个站点后添加站点
    $(document).on('click', '.j-add-station-end', function () {
        //设置隐藏属性
        $('#add_edit_station_info').find('.act').attr('value', 'add');
        //获取当前的设备编号
        var deviceTable = $(this).parent().prev().find('span.device_3C');
        curDevice3C = $(deviceTable).text();
        //获取前一个站点的线路
        var currentLine = $(this).prev().find('.line_name').html();
        if ('' !== currentLine && undefined !== currentLine && null !== currentLine) {
            $('#ULstation_line_address').prev().find('input[name=ztree]').val(currentLine);
            $('#ULstation_line_address').prev().find('input[name=ztree]').trigger($.Event('input'));
        }
        //获取前一个站点的时间
        var prev_time = $(this).prev().find('.time').html();
        //根据前一个站点的时间，计算出添加站点时的默认时间
        var cur_time = '';
        cur_time = AddMinutes(parseDate(prev_time), +30);
        cur_time = cur_time.format('yyyy-MM-dd hh:mm:ss');
        $('#detection_time').val(cur_time);
        //打开添加站点框
        index_add = showDialog($('#add_edit_station_info'), '505px', '320px');
        scroll_bar_height = $(document).scrollTop();
    });
}

/**
 * @desc 提交数据
 * @param 
 */
function sub_data() {
    //点击添加或编辑站点的确定
    $(document).on('click', '.j_station_ok', function () {
        var act = $('#add_edit_station_info').find('.act').val();
        var stationLineAddress = $('#station_line_address').attr('code');
        var detectionTime = $('#detection_time').val();
        if (('' !== stationLineAddress && '' !== detectionTime)) {
            if (act === 'add') {
                stationAdd(act, curDevice3C, stationLineAddress, detectionTime);//添加站点
            }
            if (act === 'update') {
                stationUpdate(curDevice3C, stationLineAddress, detectionTime);//更新站点
            }
        } else {
            layer.msg('请选择站点或时间');
        }
    });
}

/**
 * @desc 删除站点
 * @param 
 */
function del_station() {
    //点击删除
    $(document).on('click', '.j_delete', function () {
        curRowID_del = $(this).parent().parent().next().find('.rowID').val();
        //设置隐藏属性
        $('#delete_station_info').find('.act').attr('value', 'delete');
        //打开删除确认框
        index_delete = showDialog($('#delete_station_info'), '312px', '204px');
        scroll_bar_height = $(document).scrollTop();
    });

    //点击删除的确定
    $(document).on('click', '.j_del_ok', function () {
        //删除站点
        stationDelete(curRowID_del);
    });
}

/**
 * @desc 站点间添加站点或设置距离
 * @param 
 */
function add_station_between_or_set_distance() {
    //在两个站点之间添加站点或设置距离（新）
    $(document).on('click', '.j-add-station-between-new', function () {
        $('#site-time').val('');
        //添加站点
        //设置隐藏属性
        $('#station_con').find('.act').attr('value', 'add');
        //获取当前的设备编号
        var deviceTable = $(this).parent().parent().parent().prev().find('span.device_3C');
        curDevice3C = $(deviceTable).text();
        //获取两个站点之间的线路
        var currentLine = $(this).parent().find('.line_name').html();
        if ('' !== currentLine && undefined !== currentLine && null !== currentLine) {
            $('#ULposition').prev().find('input[name=ztree]').val(currentLine);
            $('#ULposition').prev().find('input[name=ztree]').trigger($.Event('input'));
        }
        //获取前一站点的时间
        var prev_time = '';
        prev_time = $(this).parent().parent().prev().find('.time').html();
        prev_time = Replace(prev_time, '.', '-');
        prev_time = new Date(Date.parse(prev_time));
        min_time = prev_time.format('yyyy-MM-dd hh:mm:ss');
        //获取后一站点的时间
        var next_time = '';
        next_time = $(this).parent().next().find('.time').html();
        next_time = Replace(next_time, '.', '-');
        next_time = new Date(Date.parse(next_time));
        max_time = next_time.format('yyyy-MM-dd hh:mm:ss');
        //计算站点时间差（单位：秒）
        var seconds_diff = ''; // 秒差
        seconds_diff = (next_time - prev_time) / 1000 / 2;  //获取秒差（单位：秒）
        //根据两个相邻站点的时间，计算出添加站点时的默认时间
        var cur_time = ''; // 加上时间差之后的时间
        var arr = formatTimeStamp(seconds_diff); //将秒差格式化成 年月天 时分秒
        cur_time = AddSeconds(prev_time, +arr.seconds); //增加秒
        cur_time = AddMinutes(prev_time, +arr.minutes); //增加分
        cur_time = AddHours(prev_time, +arr.hours); //增加时
        cur_time = AddDays(prev_time, +arr.days); //增加天
        cur_time = AddMonths(prev_time, +arr.months); //增加月
        cur_time = AddYears(prev_time, +arr.years); //增加年

        cur_time = cur_time.format('yyyy-MM-dd hh:mm:ss');
        $('#station_con #site-time').val(cur_time);

        //设置距离
        $('#station_distance_con').find('.act').attr('value', 'setDistance');
        var prev_position = $(this).parent().parent().prev().find('.position-name').html();
        var prev_position_code = $(this).parent().parent().prev().find('.position-name').attr('code');
        var next_position = $(this).parent().next().find('.position-name').html();
        var next_position_code = $(this).parent().next().find('.position-name').attr('code');
        $('#position-first').val(prev_position).attr('code', prev_position_code);
        $('#position-second').val(next_position).attr('code', next_position_code);
        var arr_km = $(this).parent().find('.sta_distance').html().split('k');
        $('#site-distance').val(arr_km[0]);

        //打开添加站点框
        index_add = showDialog($('#site_between_station_info'), '373px', '248px');
        scroll_bar_height = $(document).scrollTop();
        //判断是否显示站点距离
        if ($(this).parent().parent().prev().find('.address') !== 0) {
            if ($(this).parent().parent().prev().find('.address span').length !== 2) {
                $(document).find('.j-add-edit-distance').addClass('hide');
            } else {
                $(document).find('.j-add-edit-distance').removeClass('hide');
            }
            $(document).find('#d-type').attr('value', $(this).parent().parent().prev().find('.address span').eq(0).attr('d-type'));
        }
        if ($(this).parent().parent().prev().find('.address_auto').length !== 0) {
            if ($(this).parent().parent().prev().find('.address_auto span').length !== 2) {
                $(document).find('.j-add-edit-distance').addClass('hide');
            } else {
                $(document).find('.j-add-edit-distance').removeClass('hide');
            }
            $(document).find('#d-type').attr('value', $(this).parent().parent().prev().find('.address_auto span').eq(0).attr('d-type'));
        }
    });
    //点击添加的确定
    $(document).on('click', '.j_station_confirm', function () {
        var act = $('#site_between_station_info #station_con').find('.act').val();
        var position_code = $('#position').attr('code');
        var site_time = $('#site-time').val();
        if (('' !== position_code && '' !== site_time)) {
            if (act === 'add') {
                stationAdd(act, curDevice3C, position_code, site_time);//添加站点
            }
        } else {
            layer.msg('请选择站点或时间');
        }
    });
    //点击设置距离的确定
    $(document).on('click', '.j_distance_confirm', function () {
        var act = $('#site_between_station_info #station_distance_con').find('.act').val();
        var position_first_code = $('#position-first').attr('code');
        var position_second_code = $('#position-second').attr('code');
        var site_distance = $('#site-distance').val();
        var d_type = $('#d-type').val();
        if (act === 'setDistance') {
            if ('' !== site_distance) {
                if (!isNaN(site_distance)) {
                    var minus = site_distance.indexOf('-'); //0说明是负数，-1说明是正数
                    var dot = site_distance.indexOf('.'); //验证小数  1说明是小数，-1说明是整数或负数
                    if (minus != -1) {
                        layer.tips('请输入整数或小数', '#site-distance');
                        return;
                    } else {
                        if (dot != -1) {
                            var dotCnt = site_distance.substring(dot + 1, site_distance.length);
                            if (dotCnt.length > 3) {
                                layer.tips('小数位已超过3位！', '#site-distance');
                                return;
                            }
                        }
                        if ('km-count' === d_type) { //换线站点数据缺失
                            set_station_distance(act, position_first_code, position_second_code, site_distance); //设置站点距离
                        }
                        if ('custom-distance' === d_type) { //换线站点自定义数据
                            update_station_distance(act, position_first_code, position_second_code, site_distance); //更新站点距离
                        }
                    }
                } else {
                    layer.tips('数字不合法！', '#site-distance');
                    return;
                }
            } else {
                layer.msg('请填写距离');
            }
        }
    });
}

/*/*
 * @desc 返回站点间的最小时间
 * @param 
 */
function set_min_time() {
    return min_time;
}

/*/*
 * @desc 返回站点间的最大时间
 * @param 
 */
function set_max_time() {
    return max_time;
}

/**
 * @desc 查看特站距离
 * @param 
 */
function getDistance() {

    var stationName = $('#station-name').val();

    $('#paging').paging({
        index: 1,
        url: function () {
            pageIndex = $('.pageValue').val();
            var url = '/C3/PC/MMileageCount/kmMarkCount.ashx?action=queryAddedDistance'
                    + '&stationname=' + stationName
                    + '&pagesize=' + pageSize
                    + '&pageindex=' + pageIndex;
            return url;
        },
        success: function (json) {
            var _html_head =  //表头
                    '<tr>'
                        + '<th>开始站点</th>'
                        + '<th>结果站点</th>'
                        + '<th>距&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;离</th>'
                    + '</tr>';
            var _html_con = ''; //表内容
            if (undefined === json) {
                _html_con = '<tr><td colspan="3">没有数据</td></tr>'
            } else {
                if (json.data.length === 0) {
                    _html_con = '<tr><td colspan="3">没有数据</td></tr>'
                } else {
                    var data = json.data;
                    for (var i = 0; i < data.length; i++) {
                        _html_con +=
                        '<tr>'
                            + '<td>' + data[i].STARTPOSITIONNAME + '</td>'
                            + '<td>' + data[i].ENDPOSITIONNAME + '</td>'
                            + '<td>' + (data[i].KM) / 1000 + 'km</td>'
                       + '</tr>';
                    }
                }
            }
            $('#table-distance').html(_html_head + _html_con);
        }
    });
}

/**
 * @desc 设置站点距离
 * @param 
 */
function set_station_distance(act, StartStation, EndStation, distance) {
    var url = '/C3/PC/MMileageCount/kmMarkCount.ashx?action=addDistance'
           + '&StartStation=' + StartStation
           + '&EndStation=' + EndStation
           + '&distance=' + distance;
    $.ajax({
        type: 'post',
        url: url,
        async: true,
        cache: false,
        success: function (data) {
            if ('True' === data) {
                layer.msg('更新成功');
            }
            if ('False' === data) {
                layer.msg('更新失败');
            }
            if ('setDistance' === act) {
                layer.close(index_add);
            }
            loadTime('condition', $('#startTime'), $('#endTime'));  //加载指定时间
            resetHidden();  //清空隐藏标签的值
            showDetail();  //显示详情
        },
        error: function (msg) {
            layer.msg(msg);
        }
    });
}

/**
 * @desc 更新设置的站点距离
 * @param 
 */
function update_station_distance(act, StartStation, EndStation, distance) {
    var url = '/C3/PC/MMileageCount/kmMarkCount.ashx?action=updateAddedDistance'
           + '&StartStation=' + StartStation
           + '&EndStation=' + EndStation
           + '&distance=' + distance;
    $.ajax({
        type: 'post',
        url: url,
        async: true,
        cache: false,
        dataType: 'text',
        success: function (str) {
            if ('True' === str) {
                layer.msg('更新成功');
            }
            if ('False' === str) {
                layer.msg('更新失败');
            }
            if ('setDistance' === act) {
                layer.close(index_add);
            }
            loadTime('condition', $('#startTime'), $('#endTime'));  //加载指定时间
            resetHidden();  //清空隐藏标签的值
            showDetail();  //显示详情
        },
        error: function (msg) {
            layer.msg(msg + '报错');
        }
        //error: function (XMLHttpRequest, textStatus, errorThrown) {
        //    alert(XMLHttpRequest.status);
        //    alert(XMLHttpRequest.readyState);
        //    alert(textStatus);
        //}
    });
}

/**
 * @desc 添加站点的按钮hover效果
 * @param 
 */
function add_station_btn_hover() {
    $(document).on('mouseenter', '.j-add-station-start', function () {
        var _this = $(this);
        if (_this.hasClass('btn-add-station-start') && !_this.hasClass('btn-add-station-start-hover')) {
            _this.removeClass('btn-add-station-start').addClass('btn-add-station-start-hover');
        }
    });
    $(document).on('mouseleave', '.j-add-station-start', function () {
        var _this = $(this);
        if (!_this.hasClass('btn-add-station-start') && _this.hasClass('btn-add-station-start-hover')) {
            _this.removeClass('btn-add-station-start-hover').addClass('btn-add-station-start');
        }
    });
    $(document).on('mouseenter', '.j-add-station-end', function () {
        var _this = $(this);
        if (_this.hasClass('btn-add-station-end') && !_this.hasClass('btn-add-station-end-hover')) {
            _this.removeClass('btn-add-station-end').addClass('btn-add-station-end-hover');
        }
    });
    $(document).on('mouseleave', '.j-add-station-end', function () {
        var _this = $(this);
        if (!_this.hasClass('btn-add-station-end') && _this.hasClass('btn-add-station-end-hover')) {
            _this.removeClass('btn-add-station-end-hover').addClass('btn-add-station-end');
        }
    });
    $(document).on('mouseenter', '.j-add-station-between', function () {
        var _this = $(this);
        if (_this.hasClass('btn-add-station-between') && !_this.hasClass('btn-add-station-between-hover')) {
            _this.removeClass('btn-add-station-between').addClass('btn-add-station-between-hover');
        }
    });
    $(document).on('mouseleave', '.j-add-station-between', function () {
        var _this = $(this);
        if (!_this.hasClass('btn-add-station-between') && _this.hasClass('btn-add-station-between-hover')) {
            _this.removeClass('btn-add-station-between-hover').addClass('btn-add-station-between');
        }
    });
    $(document).on('mouseenter', '.j-add-station-between-new', function () {
        var _this = $(this);
        if (_this.hasClass('btn-add-station-between') && !_this.hasClass('btn-add-station-between-hover')) {
            _this.removeClass('btn-add-station-between').addClass('btn-add-station-between-hover');
        }
    });
    $(document).on('mouseleave', '.j-add-station-between-new', function () {
        var _this = $(this);
        if (!_this.hasClass('btn-add-station-between') && _this.hasClass('btn-add-station-between-hover')) {
            _this.removeClass('btn-add-station-between-hover').addClass('btn-add-station-between');
        }
    });
}

/**
 * @desc 添加站点
 * @param 
 */
function stationAdd(act, $device3C, $stationLineAddress, $detectionTime) {
    var url = '/C3/PC/MMileageCount/kmMarkCount.ashx?action=add'
        + '&locomotive=' + $device3C
        + '&posiCode=' + $stationLineAddress
        + '&runDate=' + $detectionTime;
    $.ajax({
        type: 'post',
        url: url,
        async: true,
        cache: false,
        success: function () {
            if ('add' === act) {
                layer.close(index_add);
            }
            if ('add_device' === act) {
                layer.close(index_add_device_station);
            }
            loadTime('condition', $('#startTime'), $('#endTime'));  //加载指定时间
            resetHidden();  //清空隐藏标签的值
            showDetail();  //显示详情
        },
        error: function (msg) {
            layer.msg(msg);
        }
    });
}

/**
 * @desc 更新站点
 * @param 
 */
function stationUpdate($curDevice3C, $stationLineAddress, $detectionTime) {
    var url = '/C3/PC/MMileageCount/kmMarkCount.ashx?action=update'
        + '&rowID=' + urlencode($('.rowID').val())
        + '&locomotive=' + $curDevice3C
        + '&runDate=' + $detectionTime
        + '&posiCode=' + $stationLineAddress;
    $.ajax({
        type: 'post',
        url: url,
        async: true,
        cache: false,
        success: function () {
            layer.close(index_edit);
            showDetail();  //显示详情
            resetHidden();  //清空隐藏标签的值
        },
        error: function (msg) {
            layer.msg(msg);
        }
    });
}

/**
 * @desc 删除站点
 * @param 
 */
function stationDelete($rowID) {
    var url = '/C3/PC/MMileageCount/kmMarkCount.ashx?action=delete'
    + '&rowID=' + urlencode($rowID);
    $.ajax({
        type: 'post',
        url: url,
        async: true,
        cache: false,
        success: function () {
            layer.close(index_delete);
            showDetail();  //显示详情
        },
        error: function (msg) {
            layer.msg(msg);
        }
    });
}

/**
 * @desc 展示结果详情（默认显示前7天的，可根据条件搜索）
 * @param 
 */
function showDetail() {
    var url = '/C3/PC/MMileageCount/kmMarkCount.ashx?action=query'
        + '&bureauName=' + $('#organization').attr('code')
        + '&locomotive=' + $('#device3C').val()
        + '&startTime=' + $('#startTime').val()
        + '&endTime=' + $('#endTime').val();
    $.ajax({
        type: 'post',
        url: url,
        async: true,
        cache: false,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        beforeSend: function () {
            $('#carList').html('<div id="loadingPage_1">数据加载中,请稍等...</div>');
        },
        success: function (json) {
            if (null === json || '' === json || undefined === json) {
                //无数据处理
                var _html = '';
                _html +=
                '<div class="no_data_box ">'
                    + '<div class="no_data_bg">'
                        + '<div>没有您要查询的数据!</div>'
                    + '</div>'
                + '</div>';

                $('#carList').html(_html);
            } else {
                //有数据操作
                if (json.length > 0) {
                    var _html = '';
                    for (var i = 0; i < json.length; i++)  //遍历设备
                    {
                        var device3C = json[i].locoCode;  //3C设备名称
                        var mileage = (json[i].totalDis) / 1000;  //行驶里程
                        var days = json[i].runDays;  //行驶天数

                        var stationHtml_OneCar = '';
                        var _html_add_start = '';
                        var _html_add_end = '';
                        var stationList = json[i].PositionList;
                        for (var j = 0; j < stationList.length; j++)  //遍历站点
                        {
                            var address = stationList[j].positionName;  //站点名称
                            var time = stationList[j].detectTime;  //检测时间
                            var kmDistance = (stationList[j].kmDistance) / 1000;  //站点里程
                            var lineName = stationList[j].lineName;  //行驶线路
                            var rowID = stationList[j].rowID;  //站点rowID
                            var reviseFlag = stationList[j].reviseFlag;  //站点标识
                            var code = stationList[j].positionCode;
                            var changeLine = stationList[j].ChangeLine; //是否换线
                            var KMisright = stationList[j].KMisright; //计算结果是否正确
                            var CustomDistance = stationList[j].CustomDistance; //用户自定义距离

                            var _html_arrow = '';
                            //var _html_arrow_bend_right = '';
                            //var _html_arrow_bend_left = '';

                            _html_arrow =
                                '<div class="arrow_box">'
                                + '<div class="distance">'
                                    + '<div class="sta_distance">' + kmDistance + 'km</div>'
                                    + '<div class="line_name">' + lineName + '</div>'
                                + '</div>'
                                + '<div class="arrow_right"></div>'
                                + '<div class="arrow_bottom_blank"></div>'
                                //+ '<div class="btn-add-station-small btn-add-station-between j-add-station-between"></div>'
                                + '<div class="btn-add-station-small btn-add-station-between j-add-station-between-new"></div>'
                                + '<span device="' + device3C + '" class="orbit-gis-in j-orbit-gis-in"></span>'
                            + '</div>'

                            // _html_arrow_bend_left =
                            //    '<div class="arrow_bend_left_box">'
                            //        + '<div class="arrow_bend_left">'
                            //            + '<div class="distance_bend">'
                            //                + '<div class="bend_left_lineName">' + lineName + '</div>'
                            //                + '<div class="bend_left_distance">' + kmDistance + 'km</div>'
                            //            + '</div>'
                            //        + '</div>'
                            //    + '</div>'

                            // _html_arrow_bend_right =
                            //'<div class="arrow_bend_right_box">'
                            //     + '<div class="arrow_bend_right">'
                            //         + '<div class="distance_bend">'
                            //             + '<div class="bend_right_lineName">' + lineName + '</div>'
                            //             + '<div class="bend_right_distance">' + kmDistance + 'km</div>'
                            //         + '</div>'
                            //     + '</div>'
                            // + '</div>'

                            // _html_arrow =
                            // '<div class="arrow_box">'
                            //     + '<div class="distance">'
                            //         + '<div class="sta_distance">' + kmDistance + 'km</div>'
                            //         + '<div>' + lineName + '</div>'
                            //     + '</div>'
                            //     + '<div class="arrow_left"></div>'
                            //     + '<div class="arrow_bottom_blank"></div>'
                            // + '</div>'

                            var _html_station = '';
                            if (j === 0) {
                                _html_add_start = '<div class="btn-add-station-big btn-add-station-start margin-right20 j-add-station-start"></div>'
                            }
                            if (j === stationList.length - 1) {
                                _html_add_end = '<div class="btn-add-station-big btn-add-station-end margin-left24 j-add-station-end"></div>'
                            }
                            var _html_icon = '';
                            if (changeLine) {
                                if (KMisright) {
                                    _html_icon = '<span class="flag-icon change-line j-change-line" d-type="change-line" >&sect;</span>';
                                } else {
                                    if (CustomDistance) {
                                        _html_icon = '<span class="flag-icon custom-distance j-custom-distance" d-type="custom-distance" >&Sigma;</span>';
                                    } else {
                                        _html_icon = '<span class="flag-icon km-count j-km-count" d-type="km-count" >&empty;</span>';
                                    }
                                }
                            }
                            if (reviseFlag === '0') {
                                _html_station =
                                '<div class="station_box j_hover j-line-name">'
                                    + '<div class="station">'
                                        + '<input type="hidden" class="device3CName" value="' + device3C + '" />'
                                        + '<input type="hidden" class="rowID" value="' + rowID + '" />'
                                        + '<div class="address">' + _html_icon + '<span class="position-name" code="' + code + '">' + address + '</span>' + '</div>'
                                        + '<div class="time">' + time + '</div>'
                                        + '<div class="line-name hide">' + lineName + '</div>'
                                    + '</div>'
                                    + '<div class="add_station hide">'
                                        + '<div id="add_left' + [i] + '_' + [j + 1] + '" class="btn_add_left j_add" direction="left"></div>'
                                        + '<div>添加途径站</div>'
                                        + '<div id="add_right' + [i] + '_' + [j + 1] + '" class="btn_add_right j_add" direction="right"></div>'
                                    + '</div>'
                                    + '<div class="add_station_blank"></div>'
                                + '</div>'
                            } else {
                                _html_station =
                                '<div class="station_box j_hover j-line-name">'
                                     + '<div class="edit_station">'
                                         + '<div class="edit_bg">'
                                             + '<div class="btn_edit j_edit"></div>'
                                             + '<div class="btn_delete j_delete"></div>'
                                         + '</div>'
                                     + '</div>'
                                     + '<div class="station_auto">'
                                         + '<input type="hidden" class="device3CName" value="' + device3C + '" />'
                                         + '<input type="hidden" class="rowID" value="' + rowID + '" />'
                                         + '<div class="address_auto">' + _html_icon + '<span class="position-name" code="' + code + '">' + address + '</span>' + '</div>'
                                         + '<div class="time">' + time + '</div>'
                                         + '<div class="line-name hide">' + lineName + '</div>'
                                     + '</div>'
                                     + '<div class="add_station hide">'
                                         + '<div id="add_left' + [i] + '_' + [j + 1] + '" class="btn_add_left j_add" direction="left"></div>'
                                         + '<div>添加途径站</div>'
                                         + '<div id="add_right' + [i] + '_' + [j + 1] + '" class="btn_add_right j_add" direction="right"></div>'
                                     + '</div>'
                                     + '<div class="add_station_blank"></div>'
                                 + '</div>'
                            }

                            //生成站点列表
                            stationHtml_OneCar +=
                            '<div id="station' + [i] + '_' + [j + 1] + '" class="sta_box">'
                                + _html_arrow
                                //+ _html_arrow_bend_right
                                + _html_station
                                //+ _html_arrow_bend_left
                            + '</div>';
                        }

                        //生成设备列表
                        _html +=
                       '<!--设备 start-->'
                       + '<div id="device' + [i] + '" class="device_box">'
                            + '<table class="device_table">'
                                + '<tr>'
                                   + ' <td class="col2"></td>'
                                    + '<td class="col15"><span>3C设备</span></td>'
                                    + '<td class="col21 color_purple"><span class="device_3C">' + device3C + '</span><span device="' + device3C + '" class="orbit-gis j-orbit-gis"></span></td>'
                                    + '<td class="col2"></td>'
                                    + '<td class="col15"><span>检测里程</span></td>'
                                    + '<td class="col21 color_purple"><span>' + mileage + 'km</span></td>'
                                    + '<td class="col2"></td>'
                                    + '<td class="col15"><span>检测天数</span></td>'
                                    + '<td class="col21 color_purple"><span>' + days + '天</span></td>'
                                    + '<td class="col2"></td>'
                                    //+ '<td class="col21"><span class="btn_add_local_station j_add_local_station"><img src="img/btn_add_station_local.png"/></span></td>'
                                    //+ '<td class="col2"></td>'
                                + '</tr>'
                            + '</table>'
                            + '<!--站点列表 start-->'
                            + '<div class="device_detail_box">'
                                + _html_add_start
                                + stationHtml_OneCar
                                + _html_add_end
                            + '</div>'
                            + '<!--站点列表 end-->'
                        + '</div>'
                       + '<!--设备 end-->';
                    }

                    $('#carList').html(_html);

                    $(document).scrollTop(scroll_bar_height); //设置滚动条高度

                    //动态添加样式
                    for (var a = 1; a < json.length; a++) {
                        $('#device' + a).addClass('line_dotted');
                    }
                    //隐藏每个设备检测的第一个站点的左箭头且该站点的里程为0km
                    var detailBoxList = $('div.device_detail_box');
                    for (var c = 0; c < detailBoxList.length; c++) {
                        var staBox = $(detailBoxList[c]).find('div.sta_box').get(0);
                        var $arrowBox = $(staBox).find('div.arrow_box').get(0);
                        $($arrowBox).addClass('hide');
                    }
                } else {
                    //无数据处理
                    var _html = '';
                    _html +=
                    '<div class="no_data_box ">'
                        + '<div class="no_data_bg">'
                            + '<div>没有您要查询的数据!</div>'
                        + '</div>'
                    + '</div>';

                    $('#carList').html(_html);
                }
            }
        },
        error: function (msg) {
            layer.msg(msg);
        }
    });
};

/**
 * @desc 验证搜索
 * @param 
 */
function validateSearch() {
    var $orgCode = $('#organization').attr('code');
    var $device3C = $('#device3C').val();
    var $startTime = $('#startTime').val();
    var $endTime = $('#endTime').val();
    if ('' !== $orgCode || '' !== $device3C || '' !== $startTime || '' !== $endTime) {
        //展示结果详情（按条件搜索）
        showDetail();
    } else {
        layer.msg('请选择搜索条件！');
        var _html = '';
        _html +=
        '<div class="no_data_box ">'
            + '<div class="no_data_bg">'
                + '<div>请输入搜索条件！</div>'
            + '</div>'
        + '</div>';
        $('#carList').html(_html);
    }
}

/**
 * @desc 加载组织机构下拉
 * @param 
 */
function loadOrg($org) {
    $org.mySelectTree({
        tag: 'ORGANIZATION',
        enableFilter: true
    });
}

/**
 * @desc 加载3C设备下拉
 * @param 
 */
function loadDevice3C($device3C) {
    //下拉选择控件
    $device3C.LocoSelect({
        position: 'MonitorLocoAlarmList'
    });
    //设备编号控件
    $device3C.inputSelect({
        type: 'loca',
        contant: 2
    });
}

/**
 * @desc 加载站点
 * @param 
 */
function loadStation($stationLineAddress) {
    $($stationLineAddress).mySelectTree({
        tag: 'KMSTATION',
        height: 250,
        enableFilter: true
    });
}

/**
 * @desc 加载时间
 * @param 
 */
function loadTime($type, $startTime, $endTime) {
    if ('system' == $type) {
        var sysTime = new Date();
        var endTime = sysTime.format('yyyy-MM-dd');
        var beforeTime = AddDays(sysTime, -1);
        var startTime = beforeTime.format('yyyy-MM-dd');
        $($startTime).attr('value', startTime + ' 00:00:00');
        $($endTime).attr('value', endTime + ' 23:59:59');
    } else if ('condition' == $type) {
        var sTime = $($startTime).val();
        var eTime = $($endTime).val();
        $($startTime).attr('value', sTime);
        $($endTime).attr('value', eTime);
    }
}

/**
 * @desc 鼠标移入移出站点的效果
 * @param 
 */
function mouseOpera() {
    //鼠标移入站点
    $(document).on('mouseenter', '.j_hover', function () {
        var $addstation = $(this).find('div.add_station');
        var $addStationBlank = $(this).find('div.add_station_blank');
        if ($addstation.hasClass('hide') && !$addStationBlank.hasClass('hide')) {
            $addstation.removeClass('hide');
            $addStationBlank.addClass('hide');
        }
    });
    //鼠标移出站点
    $(document).on('mouseleave', '.j_hover', function () {
        var $addstation = $(this).find('div.add_station');
        var $addStationBlank = $(this).find('div.add_station_blank');
        if (!$addstation.hasClass('hide') && $addStationBlank.hasClass('hide')) {
            $addstation.addClass('hide');
            $addStationBlank.removeClass('hide');
        }
    });
};

/**
 * @desc 字符串过滤处理
 * @param 
 */
function urlencode(str) {
    return escape(str).replace(/\+/g, '%2b').replace(/\"/g, '%22').replace(/\'/g, '%27').replace(/\//g, '%2f');
}

/**
 * @desc 置顶
 * @param 
 */
function loadGoTop() {
    $('#updown').css('top', window.screen.availHeight / 2 + 240 + 'px');
    $(window).scroll(function () {
        if ($(window).scrollTop() >= 500) {
            $('#updown').fadeIn(300);
        } else {
            $('#updown').fadeOut(300);
        }
    });
    $('#updown .up').click(function () {
        $('html,body').animate({
            scrollTop: '0px'
        }, 800);
    });
}

/**
 * @desc 弹出对话框
 * @param 
 */
function showDialog($targetElement, width, height) {
    var _index =
        layer.open({
            type: 1,
            skin: 'dialog_box',
            shade: [0.3, '#393D49'],
            title: false, //不显示标题
            fix: false,
            closeBtn: 0,
            area: [width, height], //宽高
            content: $targetElement.show(), //捕获的元素
            cancel: function (index) {
                layer.close(index);
                resetHidden();  //清空隐藏标签的值
            }
        });
    return _index;
}

/**
 * @desc 清空隐藏标签的值
 * @param 
 */
function resetHidden() {
    $('#device').attr('value', '');
    $('#station_line_address_device').attr('value', '');
    $('#station_line_address_device').attr('code', '');
    $('#device_detection_time').attr('value', '');

    $('#station_line_address').attr('value', '');
    $('#station_line_address').attr('code', '');
    $('#detection_time').attr('value', '');
    $('#ULstation_line_address').prev().find('input[name=ztree]').val('');

    $('.rowID').attr('value', '');
    $('.act').attr('value', '');

    $('#position').attr('value', '');
    $('#position').attr('code', '');
    $('#ULposition').prev().find('input[name=ztree]').val('');

    $('#position-first').attr('value', '');
    $('#position-first').attr('code', '');
    //$('#ULposition-first').prev().find('input[name=ztree]').val('');

    $('#position-second').attr('value', '');
    $('#position-second').attr('code', '');
    //$('#ULposition-second').prev().find('input[name=ztree]').val('');

    $('#site-time').attr('value', '');
    $('#site-distance').attr('value', '');

    if (!$('.j-add-edit-title').hasClass('cur-card')) {
        $('.j-add-edit-title').addClass('cur-card');
    }
    if ($('.j-add-edit-distance').hasClass('cur-card')) {
        $('.j-add-edit-distance').removeClass('cur-card');
    }
    if ($('#station_con').hasClass('hide')) {
        $('#station_con').removeClass('hide');
    }
    if (!$('#station_distance_con').hasClass('hide')) {
        $('#station_distance_con').addClass('hide');
    }

    $('#station-name').attr('value', '');
}

/**
 * @desc 格式化时间戳为 年月日时分秒
 * @param 
 */
function formatTimeStamp(time_stamp) {
    var years = time_stamp / 60 / 60 / 24 / 30 / 12;
    var yearsRound = Math.floor(years);

    var months = time_stamp / 60 / 60 / 24 / 30 - (24 * 60 * 60 * 30 * 12 * yearsRound);
    var monthsRound = Math.floor(months);

    var days = time_stamp / 60 / 60 / 24 - (24 * 60 * 60 * 30 * 12 * yearsRound) - (24 * 60 * 60 * 30 * monthsRound);
    var daysRound = Math.floor(days);

    var hours = time_stamp / 60 / 60 - (24 * 60 * 60 * 30 * 12 * yearsRound) - (24 * 60 * 60 * 30 * monthsRound) - (24 * daysRound);
    var hoursRound = Math.floor(hours);

    var minutes = time_stamp / 60 - (24 * 60 * 60 * 30 * 12 * yearsRound) - (24 * 60 * 60 * 30 * monthsRound) - (24 * 60 * daysRound) - (60 * hoursRound);
    var minutesRound = Math.floor(minutes);

    var seconds = time_stamp - (24 * 60 * 60 * 30 * 12 * yearsRound) - (24 * 60 * 60 * 30 * monthsRound) - (24 * 60 * 60 * daysRound) - (60 * 60 * hoursRound) - (60 * minutesRound);
    var time_arr = {};
    time_arr['years'] = yearsRound;
    time_arr['months'] = monthsRound;
    time_arr['days'] = daysRound;
    time_arr['hours'] = hoursRound;
    time_arr['minutes'] = minutesRound;
    time_arr['seconds'] = seconds;

    return time_arr;
}