
var alarm_json = ''; //报警数据
var theString = GetRequest(); // 请求路径的参数
var orgcode = ''; //机构code
var j_name = theString.ju_name;
$(document).ready(function () {

    //初始化控件
    initControls();

    //获取报警数据
    getAlarmData();

    //查询报警数据
    $('.j-query-alarm').click(function () {
        j_name = $('#org').attr('value');
        getAlarmData();  //获取报警数据
    });

    //查询报警数据
    $('.j-alarm').click(function () {
        var sTime = $('#s-time').val();
        var eTime = $('#e-time').val();
        var ju_name = theString.ju_name;
        var duan_name = '';
        getOrgCode(alarm_json, ju_name); //获取机构code
        var url = '/Common/MAlarmMonitoring/AlarmStatisticalTrend.htm?'
                + '&s_time=' + sTime
                + '&e_time=' + eTime
                + '&ju_name=' + escape(ju_name)
                + '&duan_name=' + escape(duan_name)
                + '&org_code=' + orgcode
                + '&treetype=J';
        window.open(url);
    });

    //时间下拉框内部点击
    $('#hide-time li').click(function () {
        $(this).parent().find('li').css('color', '#555555');
        var day = $(this).attr('data');
        var week = $(this).attr('data-week');
        if (undefined === week && undefined !== day) {
            initTime('system', day, '#s-time', '#e-time'); //加载时间
        }
        j_name = $('#org').attr('value');
        getAlarmData(); //获取报警数据
        $(this).css('color', '#488CB4');
        $('#hide-time').hide();
        $('.j-time').removeClass('time-ico-cur');
    });
});

/**
 * @desc 初始化控件
 * @param 
 */
function initControls() {
    //关闭当前页
    $('.j-close').click(function () {
        window.close();
    });
    //加载时间
    initTime('system', 6, '#s-time', '#e-time');
    //时间下拉框点击
    $('.j-time').click(function () {
        $('#hide-time').css({
            //left: $('.j-time').offset().left - $(this).outerWidth() / 2 - 65 + 'px',
            left: $('.j-time').offset().left - $(this).outerWidth() / 2 + 'px',
            top: $('.j-time').offset().top + $('.j-time').outerHeight() + 5 + 'px'
        });
        $('#hide-time').toggle();
    });
    //点击任何地方都隐藏该元素
    $(document).click(function () {
        $('#hide-time').hide();
    });
    //阻止冒泡事件
    $('.j-time').click(function (event) {
        event.stopPropagation();
    });
    //设置高度
    var echarts_offsetY = $('#statistical-charts').offset().top;
    var clientHeight = document.body.clientHeight; //网页可见区域高
    $('#statistical-charts').css('height', clientHeight - echarts_offsetY - 60);
    //组织机构-局
    $('#org').mySelectTree({
        tag: 'ORGANIZATION_J',
        enableFilter: true
    });

    if (undefined !== theString.s_time) {
        $('#s-time').attr('value', theString.s_time); //开始时间
    }
    if (undefined !== theString.e_time) {
        $('#e-time').attr('value', theString.e_time); //结束时间
    }
    if (undefined !== theString.ju_name) {
        $('#org').attr('value', theString.ju_name); //结束时间
    }
}

/**
 * @desc 加载时间
 * @param 
 */
function initTime(time_type, day, element_stime, element_etime) {
    if ('system' == time_type) {
        var sysTime = new Date();
        var e_Time = sysTime.format('yyyy-MM-dd');
        var beforeTime = AddDays(sysTime, -day);
        var s_Time = beforeTime.format('yyyy-MM-dd');
        $(element_stime).attr('value', s_Time + ' 00:00:00');
        $(element_etime).attr('value', e_Time + ' 23:59:59');
    } else if ('condition' == time_type) {
        var s_Time = $(element_stime).val();
        var e_Time = $(element_etime).val();
        $(element_stime).attr('value', s_Time);
        $(element_etime).attr('value', e_Time);
    }
}

/**
 * @desc 获取报警数据
 * @param 
 */
function getAlarmData() {

    var sTime = $('#s-time').val();
    var eTime = $('#e-time').val();
    var url = '/Common/MAlarmMonitoring/RemoteHandlers/AlarmStatistical_PowerSupply.ashx?active=query'
        + '&starttime=' + sTime
        + '&endtime=' + eTime;
    $.ajax({
        url: url,
        cache: false,
        beforeSend: function () {
            $('#statistical-charts').html('<div id="loadingPage_1">数据加载中,请稍等...</div>');
        },
        success: function (json) {
            if (json != '' && json != undefined) {
                if (json.data.length > 0) {
                    alarm_json = json.data;
                    initCharts('statistical-charts', alarm_json, j_name); //图表
                } else {
                    layer.msg('暂无数据！');
                    $('#statistical-charts').html('');
                }
            }
            else {
                layer.msg('暂无数据！');
                $('#statistical-charts').html('');
            }
        },
        error: function () {
            layer.msg('查询失败！');
            $('#statistical-charts').html('');
        }
    });
}

/**
 * @desc 图表
 * @param 
 */
function initCharts(elementId, alarm_json, j_name) {
    var myChart = echarts.init(document.getElementById(elementId));

    var _XTitle = []; //横坐标
    var _data = []; //报警数
    for (var i = 0; i < alarm_json.length; i++) {
        ju_name = alarm_json[i].bureau.split('|')[0];
        if (j_name === ju_name) {
            for (var k = 0; k < alarm_json[i].org.length; k++) {
                _XTitle[k] = alarm_json[i].org[k].split('|')[0];
                _data[k] = alarm_json[i].org[k].split('|')[1];
            }
        }
    }

    var fomatter_fn = function (v) {
        return v.value;
    };
    var _label = {
        normal: {
            show: true,
            position: 'inside',
            formatter: fomatter_fn,
            textStyle: {
                color: '#333',
                //color: '#fff',
                fontWeight: 700,
                fontSize: 12
            }
        }
    };
    option = {
        color: ['#96a2e8'],
        backgroundColor: '#fff',
        grid: {
            containLabel: true,
            left: 75,
            right: 105,
            bottom: 30
        },
        tooltip: {
            show: true,
            backgroundColor: '#fff',
            borderColor: '#ddd',
            borderWidth: 1,
            textStyle: {
                color: '#3c3c3c',
                fontSize: 13
            },
            formatter: function (p) {
                //console.log('1——'+p);
                var str = '';
                var _html_param = p.seriesName + '：' + p.value;
                var _html_org = '<br />' + '组织机构：' + p.name;
                str = _html_param + _html_org;
                return str;
            },
            extraCssText: 'box-shadow: 0 0 5px rgba(0, 0, 0, 0.1)'
        },
        legend: {
            show: true,
            right: 0,
            top: 0,
            //data: legendData,
            selectedMode: true
        },
        title: {
            text: '段级报警统计'
        },
        xAxis: [{
            splitLine: { //网格分隔线
                show: false
            },
            data: _XTitle
        }],
        yAxis: [{
            name: '报警数',
            type: 'value',
            position: 'left',
            min: 0,
            axisLabel: {
                formatter: function (v) { return v; }
            }
        }],
        dataZoom: [{ //数据缩放
            show: true,
            height: 28,
            xAxisIndex: [0],
            bottom: -8,
            start: 0
        }, {
            type: 'inside',
            show: true,
            height: 25,
            xAxisIndex: [0],
            start: 0
        }],
        series: [{
            type: 'bar',
            name: '报警数',
            label: _label,
            legendHoverLink: false,
            barWidth: 30,
            data: _data
        }]
    };

    myChart.setOption(option);

    myChart.on('click', function (params) {
        eConsole(params);
    });
}

/**
 * @desc 点击图表柱子执行的方法
 * @param 
 */
function eConsole(params) {
    var sTime = $('#s-time').val();
    var eTime = $('#e-time').val();
    var ju_name = theString.ju_name;
    var duan_name = params.name;
    getOrgCode(alarm_json, duan_name); //获取机构code
    var url = '/Common/MAlarmMonitoring/AlarmStatisticalTrend.htm?'
            + '&s_time=' + sTime
            + '&e_time=' + eTime
            + '&ju_name=' + escape(ju_name)
            + '&duan_name=' + escape(duan_name)
            + '&org_code=' + orgcode
            + '&treetype=D';
    window.open(url);
    return;
}

/**
 * @desc 获取各个局和段的code
 * @param 
 */
function getOrgCode(alarm_json, d_name) {
    alarm_json_ju = alarm_json;
    var ju_name = '', duan_name = '';
    if (alarm_json_ju.length > 0) {
        for (var i = 0; i < alarm_json_ju.length; i++) {
            ju_name = alarm_json_ju[i].bureau.split('|')[0]; //局名

            if (theString.ju_name === ju_name) {
                orgcode = alarm_json_ju[i].bureau.split('|')[2];
                for (var k = 0; k < alarm_json_ju[i].org.length; k++) {
                    duan_name = alarm_json_ju[i].org[k].split('|')[0]; //段名
                    if (d_name === duan_name) {
                        orgcode = alarm_json_ju[i].org[k].split('|')[2];
                        return;
                    }
                }
            }
        }
    }
}