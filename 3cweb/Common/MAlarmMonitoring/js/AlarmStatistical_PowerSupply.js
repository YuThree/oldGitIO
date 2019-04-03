
var alarm_json = ''; //报警数据

$(document).ready(function () {

    //初始化控件
    initControls();

    //获取报警数据
    getAlarmData();

    //查询报警数据
    $('.j-query-alarm').click(function () {
        getAlarmData(); //获取报警数据
    });

    //时间下拉框内部点击
    $('#hide-time li').click(function () {
        $(this).parent().find('li').css('color', '#555555');
        var day = $(this).attr('data');
        var week = $(this).attr('data-week');
        if (undefined === week && undefined !== day) {
            initTime('system', day, '#s-time', '#e-time'); //加载时间
        }
        //if (undefined !== week && undefined === day) {
        //    data_week = week;
        //}
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
                    initCharts('statistical-charts', alarm_json); //图表
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
function initCharts(elementId, json_alarm) {
    var myChart = echarts.init(document.getElementById(elementId));

    var _XTitle = []; //横坐标 局
    var _data_ju = [];
    for (var i = 0; i < alarm_json.length; i++) {
        var arr = {};
        _XTitle[i] = alarm_json[i].bureau.split('|')[0]; //局名
        _data_ju[i] = alarm_json[i].bureau.split('|')[1]; //局的报警数
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
        color: ['#96e3ec'],
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
            text: '局级报警统计'
        },
        xAxis:
        [{
            splitLine: { //网格分隔线
                show: false
            },
            axisTick: {
                alignWithLabel: true
            },
            axisLabel: {
                interval: 0
            },
            //'axisLabel': { 'interval': 0 },
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
            legendhoverlink: false,
            barwidth: 30,
            data: _data_ju
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
    var url = '/Common/MAlarmMonitoring/AlarmStatistical_PowerSupply_detail.htm?'
            + '&s_time=' + sTime
            + '&e_time=' + eTime
            + '&ju_name=' + escape(params.name);
    //window.open(url);
    var clientHeight = document.body.clientHeight; //网页可见区域高
    var clientWidth = document.body.clientWidth; //网页可见区域宽
    showDialogIframe(url, parseInt(clientWidth * 0.9), parseInt(clientHeight * 0.9));
    return;
}

