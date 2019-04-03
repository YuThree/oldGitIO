
var alarm_json = ''; //报警数据
var theString = GetRequest(); // 请求路径的参数

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
    //组织机构
    $('#org').mySelectTree({
        tag: 'ORGANIZATION',
        enableFilter: true
    });
    //将路径中的参数值设置在标签中
    if (undefined !== theString.s_time) {
        $('#s-time').attr('value', theString.s_time); //开始时间
    }
    if (undefined !== theString.e_time) {
        $('#e-time').attr('value', theString.e_time); //结束时间
    }
    if (undefined !== theString.ju_name && undefined !== theString.duan_name && undefined !== theString.treetype && undefined !== theString.org_code) {
        $('#org').attr('treetype', theString.treetype); //组织机构类型
        if ('J' === theString.treetype) {
            if ('无' === theString.ju_name) {
                $('#org').attr('code', 'undefined');
            } else {
                $('#org').attr('value', theString.ju_name);
            }
        }
        if ('D' === theString.treetype) {
            $('#org').attr('value', theString.duan_name);
            if ('无' === theString.duan_name) {
                $('#org').attr('code', 'undefined');
            } else {
                $('#org').attr('code', theString.org_code); //组织机构代码
            }
        }
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
    var org_type = $('#org').attr('treetype'); //组织机构类型
    var org_code = ''; //组织机构代码
    if (org_type === 'TOPBOSS') {
        org_code = $('#org').attr('code'); //总公司
        org_type = ''; //?
    } else if (org_type === 'YSJ') {
        org_code = $('#org').attr('code'); //部
        org_type = ''; //?
    } else if (org_type === 'J') {
        org_code = $('#org').attr('code'); //局
        //org_type = 'BUREAU_CODE';
        org_type = 'J';
    } else {
        org_code = $('#org').attr('code'); //段
        //org_type = 'ORG_CODE';
        org_type = 'D';
    }
    var sTime = $('#s-time').val();
    var eTime = $('#e-time').val();
    var url = '/Common/MAlarmMonitoring/RemoteHandlers/AlarmStatisticalTrend.ashx?active=query'
        + '&starttime=' + sTime
        + '&endtime=' + eTime
        + '&orgtype=' + org_type
        + '&orgcode=' + org_code;
    $.ajax({
        url: url,
        cache: false,
        beforeSend: function () {
            $('#statistical-charts').html('<div id="loadingPage_1">数据加载中,请稍等...</div>');
        },
        success: function (json) {
            if (json != '' && json != undefined) {
                alarm_json = json;
                initCharts('statistical-charts', alarm_json); //图表
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

    var _XTitle = []; //横坐标
    var _data1 = []; //未处理
    var _data2 = []; //一级确认
    var _data3 = []; //二级确认
    var _data4 = []; //三级确认
    var _data5 = []; //已取消
    var _data6 = []; //总量
    var _data7 = []; //车辆数
    var _data8 = []; //线路数
    var _data9 = []; //每台车平均报警数
    var _percent_not_processed = []; //未处理百分比
    //var _percent_not_processed = []; //未处理百分比
    //var _percent_first_confirm = []; //一级确认百分比
    //var _percent_second_confirm = []; //二级确认百分比
    //var _percent_third_confirm = []; //三级确认百分比
    //var _percent_canceled = []; //已取消百分比

    for (var i = 0; i < json_alarm.length; i++) {

        var alarm_date = json_alarm[i].ALARM_DATE;

        var arys1 = new Array();
        arys1 = alarm_date.split('/');     //日期为输入日期，格式为 2013-3-10
        var ssdate = new Date(arys1[0], parseInt(arys1[1] - 1), arys1[2]);
        var week = ssdate.getDay();  //就是你要的星期几
        if (1 === week) {
            _XTitle[i] = alarm_date + '，星期一';
        } else if (2 === week) {
            _XTitle[i] = alarm_date + '，星期二';
        } else if (3 === week) {
            _XTitle[i] = alarm_date + '，星期三';
        } else if (4 === week) {
            _XTitle[i] = alarm_date + '，星期四';
        } else if (5 === week) {
            _XTitle[i] = alarm_date + '，星期五';
        } else if (6 === week) {
            _XTitle[i] = alarm_date + '，星期六';
        } else if (0 === week) {
            _XTitle[i] = alarm_date + '，星期日';
        }

        _data1[i] = json_alarm[i].NOT_PROCESSED;
        _data2[i] = json_alarm[i].FIRST_CONFIRM;
        _data3[i] = json_alarm[i].SECOND_CONFIRM;
        _data4[i] = json_alarm[i].THIRD_CONFIRM;
        _data5[i] = json_alarm[i].CANCELED;
        _data6[i] = json_alarm[i].TOTAL_ALARM;
        _data7[i] = json_alarm[i].TOTALCAR;
        _data8[i] = json_alarm[i].TOTALLINE;
        _data9[i] = (json_alarm[i].TOTAL_ALARM / json_alarm[i].TOTALCAR).toFixed(0);
        _percent_not_processed[i] = (json_alarm[i].NOT_PROCESS_RATE * 100).toFixed(2) + '%';
        //_percent_first_confirm[i] = ((json_alarm[i].FIRST_CONFIRM / json_alarm[i].TOTAL_ALARM) * 100).toFixed(4) + '%';
        //_percent_second_confirm[i] = ((json_alarm[i].SECOND_CONFIRM / json_alarm[i].TOTAL_ALARM) * 100).toFixed(4) + '%';
        //_percent_third_confirm[i] = ((json_alarm[i].THIRD_CONFIRM / json_alarm[i].TOTAL_ALARM) * 100 ).toFixed(4)+ '%';
        //_percent_canceled[i] = ((json_alarm[i].CANCELED / json_alarm[i].TOTAL_ALARM) * 100).toFixed(4) + '%';
    }

    var _max1 = Math.max.apply(null, _data7);
    var _max2 = Math.max.apply(null, _data8);
    var _max = _max1;
    if (_max1 > _max2) {
        _max = _max1;
    } else {
        _max = _max2;
    }

    var legendData = ['未处理', '一级确认', '二级确认', '三级确认', '已取消', '总量', '车辆数', '线路数'];
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
    var _label_2 = {
        normal: {
            show: true,
            position: 'top',
            formatter: fomatter_fn,
            textStyle: {
                color: '#333',
                fontWeight: 700,
                fontSize: 12
            }
        }
    };
    option = {
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
                var _html_1 = '';
                var _html_2 = '';
                var _html_param = p.seriesName + '：' + p.value;
                var _html_date = '<br />' + '日期：' + p.name;
                var _html_alarm_avg = '';
                if ('未处理' === p.seriesName) {
                    _html_1 = '<br />占比：' + _percent_not_processed[p.dataIndex];
                }
                if ('总量' !== p.seriesName) {
                    _html_2 = '<br />总量：' + json_alarm[p.dataIndex].TOTAL_ALARM;
                } else {
                    _html_1 = '<br />未处理占比：' + _percent_not_processed[p.dataIndex];
                    _html_2 =
                        '<br />未处理：' + json_alarm[p.dataIndex].NOT_PROCESSED +
                        '<br />一级确认：' + json_alarm[p.dataIndex].FIRST_CONFIRM +
                        '<br />二级确认：' + json_alarm[p.dataIndex].SECOND_CONFIRM +
                        '<br />三级确认：' + json_alarm[p.dataIndex].THIRD_CONFIRM +
                        '<br />已取消：' + json_alarm[p.dataIndex].CANCELED;
                }
                if ('车辆数' === p.seriesName) {
                    _html_alarm_avg = '<br />每台车平均报警数：' + _data9[p.dataIndex];
                }
                str = _html_param + _html_1 + _html_2 + _html_date + _html_alarm_avg;
                return str;
            },
            extraCssText: 'box-shadow: 0 0 5px rgba(0, 0, 0, 0.1)'
        },
        legend: {
            show: true,
            right: 0,
            top: 0,
            data: legendData,
            selectedMode: true
        },
        title: {
            text: '统计报警数量趋势'
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
        }, {
            type: 'value',
            name: '车辆线路数',
            position: 'left',
            offset: 80,
            min: 0,
            max: _max * 2,
            splitLine: { //网格分隔线
                show: false
            },
            axislabel: {
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
            name: '车辆数',
            yAxisIndex: 1,
            label: _label,
            legendHoverLink: false,
            barWidth: 30,
            itemStyle: {
                normal: { color: '#AD5A5A' },
                emphasis: { color: '#AD5A5A' }
            },
            data: _data7
        }, {
            type: 'bar',
            name: '未处理',
            stack: '广告',
            label: _label,
            legendHoverLink: false,
            barWidth: 30,
            itemStyle: {
                normal: { color: '#96e3ec' },
                emphasis: { color: '#96e3ec' }
            },
            data: _data1
        }, {
            name: '未处理',
            type: 'line',
            symbolSize: 10,
            symbol: 'circle',
            itemStyle: {
                normal: {
                    color: '#96e3ec',
                    barBorderRadius: 0,
                    label: {
                        show: true,
                        position: 'top',
                        formatter: function (p) {
                            return p.value > 0 ? (p.value) : '';
                        }
                    }
                }
            },
            data: _data1
        }, {
            type: 'bar',
            name: '一级确认',
            stack: '广告',
            label: _label,
            legendHoverLink: false,
            barWidth: 30,
            itemStyle: {
                normal: { color: '#ee99ea' },
                emphasis: { color: '#ee99ea' }
            },
            data: _data2
        }, {
            type: 'bar',
            name: '二级确认',
            stack: '广告',
            label: _label,
            legendHoverLink: false,
            barWidth: 30,
            itemStyle: {
                normal: {
                    color: '#ed9778'
                },
                emphasis: {
                    color: '#ed9778'
                }
            },
            data: _data3
        }, {
            type: 'bar',
            name: '三级确认',
            stack: '广告',
            label: _label,
            legendHoverLink: false,
            barWidth: 30,
            itemStyle: {
                normal: {
                    color: '#c9e59d'
                },
                emphasis: {
                    color: '#c9e59d'
                }
            },
            data: _data4
        }, {
            type: 'bar',
            name: '已取消',
            stack: '广告',
            legendHoverLink: false,
            barWidth: 30,
            label: _label,
            itemStyle: {
                normal: {
                    //color: '#87CEFA',
                    color: '#96a2e8'
                },
                emphasis: {
                    color: '#96a2e8'
                }
            },
            data: _data5
        }, {
            name: '总量',
            type: 'line',
            stack: '总量',
            symbol: 'circle',
            symbolSize: 10,
            showAllSymbol: true,
            itemStyle: {
                normal: {
                    color: '#cb8f85',
                    barBorderRadius: 0,
                    label: {
                        show: true,
                        position: 'top',
                        formatter: function (p) {
                            return p.value > 0 ? (p.value) : '';
                        }
                    }
                }
            },
            data: _data6
        }, {
            type: 'bar',
            name: '线路数',
            stack: '广告、总量',
            yAxisIndex: 1,
            //stack: '广告、总量',
            label: _label,
            legendHoverLink: false,
            barWidth: 30,
            itemStyle: {
                normal: { color: '#FF5809' },
                emphasis: { color: '#FF5809' }
            },
            data: _data8
        }]
    };

    myChart.setOption(option);
    myChart.on('click', function (params) { eConsole(params, true) })
}

//柱状图表点击事件
function eConsole(param, bol) {
    console.log(param)
    var __url = '';
    var jb = 0;
    var zt = '';
    var time = param.name.split('，')[0].replace(/\//g, '-');
    sTime = time + ' 00:00:00'
    eTime = time + ' 23:59:59'

    switch (param.seriesName) {
        case '总量':
            //console.log('总量')
            zt = '全部'
            __url = "/C3/PC/MAlarmMonitoring/MonitorLocoAlarmList.htm?category=3C&data_type=ALARM"
            break;
        case '线路数':
            __url = "/C3/PC/MDetectionOfTrace/MonitorLocGJList_New.htm?"
            //console.log('线路数')
            break;
        case '车辆数':
            // console.log('车辆数')
            __url = "/C3/PC/MDetectionOfTrace/MonitorLocGJList.htm?"
            break;
        case '已取消':
            __url = "/C3/PC/MAlarmMonitoring/MonitorLocoAlarmList.htm?category=3C&data_type=ALARM"
            zt = '已取消'
            //console.log('已取消')
            break;
        case '三级确认':
            __url = "/C3/PC/MAlarmMonitoring/MonitorLocoAlarmList.htm?category=3C&data_type=ALARM"
            zt = '已确认'
            jb = '3'
            // console.log('三级确认')
            break;
        case '二级确认':
            __url = "/C3/PC/MAlarmMonitoring/MonitorLocoAlarmList.htm?category=3C&data_type=ALARM"
            zt = '已确认'
            jb = '2'
            // console.log('二级确认')
            break;
        case '一级确认':
            __url = "/C3/PC/MAlarmMonitoring/MonitorLocoAlarmList.htm?category=3C&data_type=ALARM"
            zt = '已确认'
            jb = '1'
            //console.log('一级确认')
            break;
        default:
            __url = "/C3/PC/MAlarmMonitoring/MonitorLocoAlarmList.htm?"
            zt = '新上报'
            //console.log('报警')

    }
    //var url = '/Common/MAlarmMonitoring/AlarmDelayDetails.htm?&htmlName=Alarm_delay_analysis'
    //     + '&LocomotiveCode=' + (loccode == undefined ? '' : loccode)
    //        + '&orgCode=' + (orgCODE == undefined ? '' : orgCODE)
    //        + '&orgType=' + (orgType == undefined ? '' : orgType)
    //        + '&orgName=' + escape(orgName)
    //        + '&positionCode=' + (lineCODE == undefined ? '' : lineCODE)
    //        + '&positionType=' + (lineType == undefined ? '' : lineType)
    //        + '&lineName=' + escape(lineName)
    //        + '&startTime=' + startdate
    //        + '&endTime=' + enddate
    //        + '&minDelayTime=' + min_delay
    //        + '&maxDelayTime=' + max_delay
    var org_name = $('#org').val(); //名字
    var org_type = '';
    var org_code = '';
    if (org_name != '') {
        org_type = $('#org').attr('treetype'); //组织机构类型
        org_code = $('#org').attr('code'); //总公司
    }

    window.open(__url + 'category=3C&data_type=ALARM&openType=outside' + '&zt=' + escape(zt) + '&jb=' + jb + '&sTime=' + sTime + '&eTime=' + eTime + '&org_type=' + org_type + '&org_code=' + org_code + '&org_name=' + escape(org_name))
}
