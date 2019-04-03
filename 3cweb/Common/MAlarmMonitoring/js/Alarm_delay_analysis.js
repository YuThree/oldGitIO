/*========================================================================================*
* 功能说明：报警延时分析统计
* 注意事项：
* 作    者： ybc
* 版本日期：2016年11月29日
* 变更说明：
* 版 本 号： V1.0.0

*=======================================================================================*/


var maxXdata = 200;//柱状图y轴同时最多显示多少列数据
var carnumber = 200;//请求车辆数
var lineCODE;
var lineType;
var loccode;
var orgCODE;
var orgType;
var startdate;
var enddate;
var orgName;
var lineName;
var isCRH = true;
var showData = ['5分钟内', '5-10分钟', '10-20分钟', '20分钟以上', '延时时间不确定'];
var color = ['#91C7AE', '#61A0A8', '#DD8668', '#C23531', '#B2B7BB'];
$(document).ready(function () {

    if (FunEnable('Fun_isCRH') == "False") {
        isCRH = false;
        showData = ['半小时以内', '半小时至1小时', '1-12小时', '12-24小时', '24-48小时', '48-72小时', '72-168小时', '168小时以上', '延时时间不确定'];
        //color = ['#6AB0B8', '#E98F6F', '#9FDABF', '#7FAE90', '#DE9325', '#CFB2A9', '#797B7F', '#5C6F7B', '#334B5C'];
        color = ['#dd6b66', '#759aa0', '#e69d87', '#8dc1a9', '#ea7e53', '#eedd78', '#73a373', '#73b9bc', '#7289ab', '#91ca8c', '#f49f42'];
    }

    //线路
    $('#line_tree').mySelectTree({
        tag: 'BRIDGETUNE',
        height: 250,
        enableFilter: true,
        filterNumber: 2
    });

    //设备编号控件
    $('#car_tree').LocoSelect({
        position: 'MonitorLocoAlarmList'
    });
    $('#car_tree').inputSelect({
        type: 'loca',
        contant: 2,
    });

    //组织机构
    $('#org_tree').mySelectTree({
        tag: 'ORGANIZATION',
        enableFilter: true,
        height: 240

    });

    //时间下拉框内部点击
    $('#hideUL li').click(function () {
        $('#hideUL li').css('color', 'black')
        $(this).css('color', '#488CB4')
        doQuery()
    })
    //时间下拉框点击
    $('.pic_9').toggle(function () {
        $('#hideUL').css({ left: $('.pic_9').offset().left - $(this).outerWidth() / 2 + "px", top: $('.pic_9').offset().top + $('.pic_9').outerHeight() + 5 + "px" }).show()
        $(this).addClass('pic_8')
    }, function () { $('#hideUL').hide(); $(this).removeClass('pic_8') })


    //默认时间
    $('#startTime').val(DateLastWeekTime() + "00:00:00")
    $('#endTime').val(getNowFormatDate())

    //点击任意地方关闭时间下拉框
    $('body').bind("mousedown", function (e) {
        if ($(e.target).parents("#hideUL").length === 0 && $('#hideUL').css('display') != 'none') {
            $('.pic_9').click();
        }
    });
    //查询
    $('#searchBtn').click(doQuery)
    $('#portoutBtn').click(portOut)//导出
    doQuery()

    
})

//获取时间   blue为多少天前 start 为start 或者空
function getNowFormatDate(blue, start) {
    var date = new Date();
    if (blue != '' && blue != undefined) {
        date.setUTCDate(date.getDate() - parseInt(blue));
    }
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var strSecond = date.getSeconds();
    var strHours = date.getHours();
    var strMinutes = date.getMinutes();

    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    //if (strSecond >= 0 && strSecond <= 9) {
    //    strSecond = "0" + strSecond;
    //}
    //if (strHours >= 0 && strHours <= 9) {
    //    strHours = "0" + strHours;
    //}
    //if (strMinutes >= 0 && strMinutes <= 9) {
    //    strMinutes = "0" + strMinutes;
    //}
    if (start == 'start') {
        strSecond = "00"
        strHours = "00"
        strMinutes = "00"
    } else {
        strSecond = "59"
        strHours = "23"
        strMinutes = "59"
    }




    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + strHours + seperator2 + strMinutes
            + seperator2 + strSecond;
    return currentdate;
}

//选择时间
function chooseTime(day) {
    $('#startTime').val(getNowFormatDate(day, 'start'))
    $('#endTime').val(getNowFormatDate())
    $('.pic_9').click()
}

//时间判断
function dojudge() {
    if ($('#startTime').val() == '' || $('#endTime').val() == '') {
        layer.msg('请输入完整时间！')
        return false;
    } else {
        //console.log($('#startTime').val() + $('#endTime').val())
        if ($('#startTime').val() >= $('#endTime').val()) {
            layer.msg('时间输入有误！')
            return false;
        } else {
            return true;
        }
    }
}

//查询
function doQuery() {

    if (dojudge()) {
        layer.load(1, {
            shade: [0.5, '#000'] //0.1透明度的白色背景
        });
        lineCODE = $('#line_tree').attr('code'); //线路区间
        lineType = $('#line_tree').attr('treetype'); //线路区间
        lineName = $('#line_tree').val(); //线路名
        switch (lineType) {
            case 'LINE':
                lineType = 'LINE_CODE';
                break;
            case 'POSITION':
                lineType = 'POSITION_CODE';
                break;
            case 'BRIDGETUNE':
                lineType = 'BRG_TUN_CODE';
                break;
        }

        loccode = document.getElementById('car_tree').value; //设备编号
        orgCODE = $('#org_tree').attr('code'); //组织机构
        orgType = $('#org_tree').attr('treetype'); //组织机构
        orgName = $('#org_tree').val(); //组织名
        if (orgType == 'J') {
            orgType = ' BUREAU_CODE';
        } else if (orgType == 'TOPBOSS' || orgType == undefined || orgType == 'YSJ') {
            orgType = '';
        } else {
            orgType = 'ORG_CODE';
        }


        startdate = document.getElementById('startTime').value; //开始时间
        enddate = document.getElementById('endTime').value; //结束时间
        var allovertime = document.getElementById('allovertime').value; // 总延时超时

        var _url = '';

        if (!isCRH) {
            _url = '/Common/MAlarmMonitoring/RemoteHandlers/AlarmDelayHome.ashx?active=jiche'
        } else {
            _url = '/Common/MAlarmMonitoring/RemoteHandlers/AlarmDelayHome.ashx?active=total'
        }
        _url += '&positionCode=' + (lineCODE == undefined ? '' : lineCODE)
             + '&positionType=' + (lineType == undefined ? '' : lineType)
             + '&LocomotiveCode=' + (loccode == undefined ? '' : loccode)
             + '&orgCode=' + (orgCODE == undefined ? '' : orgCODE)
             + '&orgType=' + (orgType == undefined ? '' : orgType)
             + '&starttime=' + startdate
             + '&endtime=' + enddate
             + '&DelayTime=' + (allovertime == '' ? '-1' : allovertime)
             + '&carnum=' + carnumber

        $.ajax({
            url: _url,
            cache: false,
            success: function (re) {
                if (re != '' && re != undefined) {

                    if (!isCRH) {
                        var data = [];
                        data.push(re.total.HALF, re.total.ONE, re.total.TWELVE, re.total.TWENTY_FOUR, re.total.FOURTY_EIGHT, re.total.SEVENTY_TWO, re.total.HUNDRED_SIXTY_EIGHT, re.total.HUNDRED_SIXTY_EIGHT_OVER, re.total.ZERO);
                        creatPieecharts(data);//饼图
                        var xdata = [];
                        var z_t_half = [];
                        var t_o_data = [];
                        var z_f_data = [];
                        var f_t_data = [];
                        var t_tw_data = [];
                        var tw_data = [];
                        var litMax_data = [];
                        var max_data = [];
                        var notsure_data = [];
                        for (var i = 0; i < re.data.length; i++) {
                            xdata.push(re.data[i].DETECT_DEVICE_CODE)
                            z_t_half.push(re.data[i].HALF)
                            t_o_data.push(re.data[i].ONE)
                            z_f_data.push(re.data[i].TWELVE)
                            f_t_data.push(re.data[i].TWENTY_FOUR)
                            t_tw_data.push(re.data[i].FOURTY_EIGHT)
                            tw_data.push(re.data[i].SEVENTY_TWO)
                            litMax_data.push(re.data[i].HUNDRED_SIXTY_EIGHT)
                            max_data.push(re.data[i].HUNDRED_SIXTY_EIGHT_OVER)
                            notsure_data.push(re.data[i].ZERO)
                        }
                        creatBarechartsJC(xdata, z_t_half, t_o_data, z_f_data, f_t_data, t_tw_data, tw_data, litMax_data, max_data, notsure_data, (maxXdata / re.data.length) * 100)
                    } else {
                        var data = [];
                        data.push(re.total.ZEROTOFIVE, re.total.FIVETOTEN, re.total.TENTOTWENTY, re.total.OVERTWENTY, re.total.ZERO);
                        creatPieecharts(data);//饼图
                        var xdata = [];
                        var z_f_data = [];
                        var f_t_data = [];
                        var t_tw_data = [];
                        var tw_data = [];
                        var notsure_data = [];
                        for (var i = 0; i < re.data.length; i++) {
                            xdata.push(re.data[i].DETECT_DEVICE_CODE)
                            z_f_data.push(re.data[i].ZEROTOFIVE_)
                            f_t_data.push(re.data[i].FIVETOTEN_)
                            t_tw_data.push(re.data[i].TENTOTWENTY_)
                            tw_data.push(re.data[i].OVERTWENTY_)
                            notsure_data.push(re.data[i].ZERO)
                        }
                        creatBarecharts(xdata, z_f_data, f_t_data, t_tw_data, tw_data, notsure_data, (maxXdata / re.data.length) * 100)
                    }


                }
                else {
                    layer.msg('暂无数据！');
                }
                layer.closeAll('loading')
            },
            error: function () {
                layer.msg('查询失败！');
                layer.closeAll('loading')
            }
        })


    }


}

//饼图
function creatPieecharts(data) {
    var sereDara = [];
    for (var i = 0; i < data.length; i++) {
        var a = {
            value: data[i], name: showData[i]
        }
        sereDara.push(a)
    }

    var myChart = echarts.init(document.getElementById('main'), '');

    // 指定图表的配置项和数据
    var option = {
        color: color,

        title: {
            text: '最长耗时分布情况',
            top: 10,
            left: 20,
            textStyle: {
                fontSize: 18,
                fontWeight: 'bolder',
                color: '#333'
            }
        },
        tooltip: {
            trigger: 'item',
            //formatter: "{a} <br/>{b} : {c} ({d}%)"
            formatter: function (params) {
                //console.log(params)
                var re = params.name + ':' + params.value
                if (params.value != 0) {
                    re += '(' + params.percent + '%)'
                }
                return re

            },
        },

        //color:['red', 'green']  ,
        legend: {
            orient: 'vertical',
            bottom: 'center',
            right: 20,
            borderColor: '#ccc',
            borderWidth: 1,
            padding: 10,
            //icon: 'map',
            //icon : 'bar',
            data: showData
        },
        //toolbox: {
        //    show: true,
        //    feature: {
        //        mark: { show: true },
        //        dataView: { show: true, readOnly: false },
        //        magicType: {
        //            show: true,
        //            type: ['pie', 'funnel'],
        //            option: {
        //                funnel: {
        //                    x: '25%',
        //                    width: '50%',
        //                    funnelAlign: 'left',
        //                    max: 1548
        //                }
        //            }
        //        },
        //        restore: { show: true },
        //        saveAsImage: { show: true }
        //    }
        //},
        calculable: true,
        series: [
            {
                name: '数量',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                symbol: 'droplet',
                data: sereDara
            }
        ]
    };


    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    if (isCRH) {
        myChart.on('click', function (params) { eConsole(params) })
    }
}

//柱状图
function creatBarecharts(xdata, z_f_data, f_t_data, t_tw_data, tw_data, notsure_data, percent) {


    var myChart = echarts.init(document.getElementById('main2'), '');
    var option = {
        color: color,
        title: {
            text: '车辆上报耗时排行',
            x: 'left',
            left: 20,
            textStyle: {
                fontSize: 18,
                fontWeight: 'bolder',
                color: '#333'
            }
        },
        tooltip: {
            trigger: 'item',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: function (params) {
                //console.log(params)
                var re = params.name + '</br>' + params.seriesName + ':' + params.value
                return re
            },
        },
        legend: {
            data: showData,
            orient: 'vertical',
            bottom: 'center',
            right: 20,
            borderColor: '#ccc',
            borderWidth: 1,
            padding: 10,
        },

        calculable: true,
        dataZoom: [
        {
            type: 'inside',//一个bug  你想要实现缩放条和 鼠标滚轮缩放同时实现 必须用数组对象
        }, {
            start: 0,
            end: percent,
        }],
        grid: {
            //width:500,
            x: 50,
            x2: 200,
            y: 100,
            x2: 200,
        },
        xAxis: [
            {
                name: '设备编号',
                nameTextStyle: {
                    fontSize: 12,
                    fontWeight: 'bolder',
                    color: '#333'
                },
                type: 'category',
                // data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                data: xdata
            }
        ],
        yAxis: [
            {
                name: '报警数',
                type: 'value',
                nameTextStyle: {
                    fontSize: 12,
                    fontWeight: 'bolder',
                    color: '#333'
                }
            }
        ],
        series: [

            {
                name: showData[0],
                type: 'bar',
                stack: '广告',
                //data: [120, 132, 101, 134, 90, 230, 210]
                data: z_f_data
            },
            {
                name: showData[1],
                type: 'bar',
                stack: '广告',
                //data: [220, 182, 191, 234, 290, 330, 310]
                data: f_t_data
            },
            {
                name: showData[2],
                type: 'bar',
                stack: '广告',
                //data: [150, 232, 201, 154, 190, 330, 410]
                data: t_tw_data
            },
            {
                name: showData[3],
                type: 'bar',
                stack: '广告',
                //data: [150, 232, 201, 154, 190, 330, 410]
                data: tw_data
            },
            {
                name: showData[4],
                type: 'bar',
                stack: '广告',
                //data: [150, 232, 201, 154, 190, 330, 410]
                data: notsure_data
            }

        ]
    };

    myChart.setOption(option);
    myChart.on('click', function (params) { eConsole(params, true) })

}
function creatBarechartsJC(xdata, z_t_half, t_o_data, z_f_data, f_t_data, t_tw_data, tw_data, litMax_data, max_data, notsure_data, percent) {
    var myChart = echarts.init(document.getElementById('main2'), '');
    var option = {
        color: color,
        title: {
            text: '车辆上报耗时排行',
            x: 'left',
            left: 20,
            textStyle: {
                fontSize: 18,
                fontWeight: 'bolder',
                color: '#333'
            }
        },
        tooltip: {
            trigger: 'item',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: function (params) {
                //console.log(params)
                var re = params.name + '</br>' + params.seriesName + ':' + params.value
                return re
            },
        },
        legend: {
            data: showData,
            orient: 'vertical',
            bottom: 'center',
            right: 20,
            borderColor: '#ccc',
            borderWidth: 1,
            padding: 10,
        },

        calculable: true,
        dataZoom: [
        {
            type: 'inside',//一个bug  你想要实现缩放条和 鼠标滚轮缩放同时实现 必须用数组对象
        }, {
            start: 0,
            end: percent,
        }],
        grid: {
            //width:500,
            x: 50,
            x2: 200,
            y: 100,
            x2: 200,
        },
        xAxis: [
            {
                name: '设备编号',
                nameTextStyle: {
                    fontSize: 12,
                    fontWeight: 'bolder',
                    color: '#333'
                },
                type: 'category',
                data: xdata
            }
        ],
        yAxis: [
            {
                name: '报警数',
                type: 'value',
                nameTextStyle: {
                    fontSize: 12,
                    fontWeight: 'bolder',
                    color: '#333'
                }
            }
        ],
        series: [

            {
                name: showData[0],
                type: 'bar',
                stack: '广告',
                data: z_t_half
            },
            {
                name: showData[1],
                type: 'bar',
                stack: '广告',
                data: t_o_data
            },
            {
                name: showData[2],
                type: 'bar',
                stack: '广告',
                data: z_f_data
            },
            {
                name: showData[3],
                type: 'bar',
                stack: '广告',
                data: f_t_data
            },
            {
                name: showData[4],
                type: 'bar',
                stack: '广告',
                data: t_tw_data
            },
            {
                name: showData[5],
                type: 'bar',
                stack: '广告',
                data: tw_data
            },
            {
                name: showData[6],
                type: 'bar',
                stack: '广告',
                data: litMax_data
            },
            {
                name: showData[7],
                type: 'bar',
                stack: '广告',
                data: max_data
            },
            {
                name: showData[8],
                type: 'bar',
                stack: '广告',
                data: notsure_data
            }

        ]
    };

    myChart.setOption(option);
}
//柱状图表点击事件
function eConsole(param, bol) {
    //console.log(param)
    if ('0' === param.value) {
        return;
    } else {
        if (bol) {
            loccode = param.name; //设备编号
            var seriesName = param.seriesName//时段

        } else {
            var seriesName = param.name//时段
        }

        var min_delay = '';
        var max_delay = '';
        switch (seriesName) {
            case '5分钟内':
                min_delay = 0;
                max_delay = 5;
                break;
            case '5-10分钟':
                min_delay = 5;
                max_delay = 10;
                break;
            case '10-20分钟':
                min_delay = 10;
                max_delay = 20;
                break;
            case '20分钟以上':
                min_delay = 20;
                max_delay = '-1';
                break;
            case '延时时间不确定':
                min_delay = 0;
                max_delay = 0;
                break;
        }
        var url = '/Common/MAlarmMonitoring/AlarmDelayDetails.htm?&htmlName=Alarm_delay_analysis'
             + '&LocomotiveCode=' + (loccode == undefined ? '' : loccode)
                + '&orgCode=' + (orgCODE == undefined ? '' : orgCODE)
                + '&orgType=' + (orgType == undefined ? '' : orgType)
                + '&orgName=' + escape(orgName)
                + '&positionCode=' + (lineCODE == undefined ? '' : lineCODE)
                + '&positionType=' + (lineType == undefined ? '' : lineType)
                + '&lineName=' + escape(lineName)
                + '&startTime=' + startdate
                + '&endTime=' + enddate
                + '&minDelayTime=' + min_delay
                + '&maxDelayTime=' + max_delay

        window.open(url)
    }
}

//导出
function portOut() {
    layer.load(1, {
        shade: [0.5, '#000'] //0.1透明度的白色背景
    });
    var allovertime = document.getElementById('allovertime').value; // 总延时超时
    var _url = '/Common/MAlarmMonitoring/RemoteHandlers/AlarmDelayHome.ashx?active=download_jiche'
    _url += '&positionCode=' + (lineCODE == undefined ? '' : lineCODE)
            + '&positionType=' + (lineType == undefined ? '' : lineType)
            + '&LocomotiveCode=' + (loccode == undefined ? '' : loccode)
            + '&orgCode=' + (orgCODE == undefined ? '' : orgCODE)
            + '&orgType=' + (orgType == undefined ? '' : orgType)
            + '&starttime=' + startdate
            + '&endtime=' + enddate
            + '&DelayTime=' + (allovertime == '' ? '-1' : allovertime)
            + '&carnum=' + carnumber
    $.ajax({
        url: _url,
        cache: false,
        success: function (re) {
            if (re.url != '' && re != undefined) {
                Downer(re.url);
            }
            else {
                layer.msg('导出失败！');
            }
            layer.closeAll('loading')
        },
        error: function () {
            layer.msg('导出失败！');
            layer.closeAll('loading')
        }
    })
}
