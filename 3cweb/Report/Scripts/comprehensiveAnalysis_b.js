var leixin = {};
var jibie = {};
var zhuangtai = {};
var line_data = {};
var Type_control_name = 'which_C';
var lastaction = 'POWER_SECTION';
var lastLineaction = 'LINE';
var resizeTimer = null;//解决resize多次执行
var severityChart
var summaryChart
var statusChart
var lineChart
var ORGChart
//初始化表格工具
var ECharts;
// 路径配置
require.config({
    paths: {
        'echarts': '/Lib/Echarts-2.0/2.0/echarts',
        'echarts/chart': '/Lib/Echarts-2.0/2.0/echarts'
    }
});
require(['echarts', 'echarts/chart'], function (ec) {
    ECharts = ec;
});





//初始化
$(document).ready(function () {

    $('#stardate').val(getDateStr_day(datehhssNowStr(), (0 - parseInt(getConfig('WJ_FaultCountAnalysis_days')))))//默认时间  配置项 WJ_FaultCountAnalysis_days
    $('#enddate').val(dateNowStr() + "23:59:59")

    //var jbJson = GetSeverityJson();
    //var jsHtml = "";
    //for (var i = 0; i < jbJson.length; i++) {
    //    jsHtml += "<option value='" + jbJson[i].code + "'>" + jbJson[i].name + "</option>";
    //}
    //if (jsHtml) {
    //    $("#jb").html($("#jb").html() + jsHtml);
    //}


   
        //问题分类
        $('#question_classify').mySelectTree({
            tag: 'SYSDICTIONARYTREE',
            codeType: '3C',
            cateGory: 'RECTIFY_INFORM',
            p_code: 'QU_CLASSIFY',
            isDefClick: false,
            enableFilter: false,
            onClick: function (event, treeId, treeNode) {
                $('#question_classify').val(treeNode.name).attr('code', treeNode.id);
            },

        });
        //专业分类
        $('#major_classify').mySelectTree({
            tag: 'SYSDICTIONARYTREE',
            codeType: '3C',
            cateGory: 'RECTIFY_INFORM',
            p_code: 'MAJOR_CLASSIFY',
            isDefClick: false,
            enableFilter: false,
            onClick: function (event, treeId, treeNode) {
                $('#major_classify').val(treeNode.name).attr('code', treeNode.id);
            },

        });
        //问题等级
        $('#question_level').mySelectTree({
            tag: 'SYSDICTIONARYTREE',
            codeType: '3C',
            cateGory: 'RECTIFY_INFORM',
            p_code: 'LV',
            isDefClick: false,
            enableFilter: false,
            onClick: function (event, treeId, treeNode) {
                $('#question_level').val(treeNode.name).attr('code', treeNode.id);
            },

        });
        //负责单位
        $('#duty_units').mySelectTree({
            tag: "ORGANIZATION_JUNIORBUREAU",
            code: '',
            type: '',
            isDefClick: false,
            enableFilter: false,
            height: 150,
            action:'YuanDong',
            onClick: function (event, treeId, treeNode) {
                $('#duty_units').val(treeNode.name).attr('code', treeNode.id);
            },
        });
    



















    setTimeout('doQuery()', 500);
    atuoSize();

    $(window).resize(function () {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            doQuery();
            atuoSize();
        }, 500);
    });
});

function atuoSize() {
    $('#taskchart,#severityChart,#summaryChart,#statusChart,#majorChart').height(($(window).height() / 2) - 105);
    $('#line_chart').height(($(window).height() / 2));
    $('#line_chart_right').css("minHeight", ($(window).height() / 2) - 5);
    $('.Type_control').css({ 'top': $('#line_chart').offset().top - 20, 'left': ($(window).width() - $('.Type_control').outerWidth()) / 2 });
    $('.lineCtrl,.control_icon').css({ 'top': $('#line_chart').offset().top - 20 });
}
//查询表格
function doQuery() {
    fullShow();
    setTimeout('Load_pic2()', 500);
};


function Load_pic2() {
    
    majorChart = ECharts.init(document.getElementById('majorChart'), theme);
    severityChart = ECharts.init(document.getElementById('severityChart'), theme);
    summaryChart = ECharts.init(document.getElementById('summaryChart'), theme);
    statusChart = ECharts.init(document.getElementById('statusChart'), theme);
    //lineChart = ECharts.init(document.getElementById('line_chart_left'), theme);
    ORGChart = ECharts.init(document.getElementById('line_chart_right'), theme);

    GetChartOption("类型");
    GetChartOption_bottom(lastLineaction);
   

   

    fullHide();
};

function GetChartOption(category) {

    var startdate = document.getElementById('stardate').value;
    var enddate = document.getElementById('enddate').value;


    var duty_units = $('#duty_units').attr("code");
    if (duty_units == undefined) {
        duty_units = "";
    }
    var question_classify = $('#question_classify').attr("code");
    if (question_classify == undefined) {
        question_classify = "";
    }
    var question_level = $('#question_level').attr("code");
    if (question_level == undefined) {
        question_level = "";
    }
    var major_classify = $('#major_classify').attr("code");
    if (major_classify == undefined) {
        major_classify = "";
    }
    
    var statas = $('#statas').val();

    if (startdate != null && startdate != "" && enddate != null && enddate != "") {
        if (enddate < startdate) {
            ymPrompt.errorInfo('结束时间必须比开始时间大~！！', null, null, '提示信息', null);
            return;
        }
    }
    
    
    var url = '/Common/YuanDong/RemoteHandlers/StatisYuanDong.ashx?type=SynthesizedStatistic'
                + '&startdate=' + startdate
                + '&enddate=' + enddate
                + '&duty_units=' + duty_units
                + '&question_classify=' + question_classify
                + '&question_level=' + question_level
                + '&major_classify=' + major_classify
                + '&process_statas=' + statas
                + '&temp=' + Math.random();
    var _json;
    var data = [];
    var _color = [];
    $.ajax({
        type: "POST",
        url: url,
        async: true,
        cache: false,
        success: function (result) {
            _json = result;
            if (_json.data.length == 0) {
                layer.msg('无数据！')
                return;
            }
            if (_json != '' && _json.data.length > 0) {
                //switch (category) {
                //case '类型':
                for (var i = 0; i < _json.data[0].length; i++) {
                    var name = _json.data[0][i].split("|")[0];
                    var value = _json.data[0][i].split("|")[2];
                    if (value != '0' && name != '') {
                        data.push({ "value": value, "name": name });
                    } else {
                        data.push({});
                    }
                }
                leixin = data;
                //_color = ['#B3DFFC', '#63BEF9', '#289CE8', '#0782D1', '#1E6897', '#02507E'];
                _color = ['#B3DFFC', '#63BEF9', '#289CE8', '#0782D1', '#1E6897', '#02507E', '#0f4262', '#d6eefd'];

                var severityOption = ConfigOptions(leixin, "问题分类", _color);
                severityChart.clear();
                severityChart.setOption(severityOption);


                //break;

                //case '状态':
                data = [];
                for (var i = 0; i < _json.data[2].length; i++) {
                    var name = _json.data[2][i].split("|")[0];
                    var value = _json.data[2][i].split("|")[2];
                    if (value != '0' && name != '') {
                        data.push({ "value": value, "name": name });
                    } else {
                        data.push({});
                    }
                }
                zhuangtai = data;
                _color = ['#D74B29', '#F67D4C', '#FEB08F', '#FDDED1'];

                var statusOption = ConfigOptions(zhuangtai, "专业分类", _color);
                majorChart.clear();
                majorChart.setOption(statusOption);


                //    break;
                //case '级别':
                data = [];
                for (var i = 0; i < _json.data[1].length; i++) {
                    var name = _json.data[1][i].split("|")[0];
                    var value = _json.data[1][i].split("|")[2];
                    if (value != '0' && name != '') {
                        data.push({ "value": value, "name": name });
                    } else {
                        data.push({});
                    }
                }
                jibie = data;
                _color = ['#D2773D', '#ECB24F', '#FDEE9C', '#fff9d9'];

                var summaryOption = ConfigOptions(jibie, "问题等级", _color);
                summaryChart.clear();
                summaryChart.setOption(summaryOption);

                //    break; 
                

                //case '状态':
                data = [];
                for (var i = 0; i < _json.data[3].length; i++) {
                    var name = _json.data[3][i].split("|")[0];
                    var value = _json.data[3][i].split("|")[2];
                    if (value != '0' && name != '') {
                        data.push({ "value": value, "name": name });
                    } else {
                        data.push({});
                    }
                }
                zhuangtai = data;
                _color = ['#6AE89C', '#BEFFD8', '#49C378', '#1BA453', '#057B38', '#CCCCCC'];

                var statusOption = ConfigOptions(zhuangtai, "销号状态", _color);
                statusChart.clear();
                statusChart.setOption(statusOption);
                //}
            } else {
                majorChart.clear();
                severityChart.clear();
                statusChart.clear();
                summaryChart.clear();
            }
        }
    });
};

function ConfigOptions(_json, Text, _color) {
    var optings = {
        backgroundColor: '#031440',
        color: _color,
        //legend: {
        //       orient: 'vertical',
        //        x: 'left',

        //},
        title: {
            text: Text,
            x: 'center',
            y: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)'
        },
        toolbox: {
            show: true,
            feature: {
                saveAsImage: { show: false },
            }
        },
        calculable: false,
        series: [
        {
            type: 'pie',
            radius: ['32%', '45%'],
            data: _json
        }
        ]
    }
    return optings;
};


function GetChartOption_bottom(search_type) {
    var startdate = document.getElementById('stardate').value;
    var enddate = document.getElementById('enddate').value;


    var duty_units = $('#duty_units').attr("code");
    if (duty_units == undefined) {
        duty_units = "";
    }
    var question_classify = $('#question_classify').attr("code");
    if (question_classify == undefined) {
        question_classify = "";
    }
    var question_level = $('#question_level').attr("code");
    if (question_level == undefined) {
        question_level = "";
    }
    var major_classify = $('#major_classify').attr("code");
    if (major_classify == undefined) {
        major_classify = "";
    }

    var statas = $('#statas').val();

    if (startdate != null && startdate != "" && enddate != null && enddate != "") {
        if (enddate < startdate) {
            ymPrompt.errorInfo('结束时间必须比开始时间大~！！', null, null, '提示信息', null);
            return;
        }
    }


    var _url = '/Common/YuanDong/RemoteHandlers/StatisYuanDong.ashx?type=SynthesizedStatisticByCondition'
                + '&startdate=' + startdate
                + '&enddate=' + enddate
                + '&duty_units=' + duty_units
                + '&question_classify=' + question_classify
                + '&question_level=' + question_level
                + '&major_classify=' + major_classify
                + '&process_statas=' + statas
                + '&temp=' + Math.random();
    var _Json;

    var LINENAME = [];  //线路名

    var QUES1 = [];  //通道
    var QUES2 = []; //调度主站硬件
    var QUES3 = [];  //调度主站（软件）
    var QUES4 = [];//被控站 通讯
    var QUES5 = []; //被控站 一次设备
    var QUES6 = [];  //被控站（二次设备）

    var GT = [];  //高铁
    var PS = [];  //普速
    var DL = [];  //电力

    var FIRST = [];  //1级
    var SECOND = [];//2级
    var THIRD = [];//3级

    var SOLVED = [];  //已销号
    var UNSOLVED = [];  //未销号

    $.ajax({
        type: "POST",
        url: _url,
        async: true,
        cache: false,
        success: function (result) {
            _Json = result;
            if (_Json.data.length == 0) {
                ORGChart.clear();
                layer.msg('暂无数据！');
                return;
            }
            for (var i = 0; i < _Json.data.length; i++) {
                LINENAME.push(_Json.data[i].STATISTICNAME);
                QUES1.push(_Json.data[i].QUES1 == undefined ? '0' : _Json.data[i].QUES1);
                QUES2.push(_Json.data[i].QUES2 == undefined ? '0' : _Json.data[i].QUES2);
                QUES3.push(_Json.data[i].QUES3 == undefined ? '0' : _Json.data[i].QUES3);
                QUES4.push(_Json.data[i].QUES4 == undefined ? '0' : _Json.data[i].QUES4);
                QUES5.push(_Json.data[i].QUES5 == undefined ? '0' : _Json.data[i].QUES5);
                QUES6.push(_Json.data[i].QUES6 == undefined ? '0' : _Json.data[i].QUES6);
                GT.push(_Json.data[i].GT == undefined ? '0' : _Json.data[i].GT);
                PS.push(_Json.data[i].PS == undefined ? '0' : _Json.data[i].PS);
                DL.push(_Json.data[i].DL == undefined ? '0' : _Json.data[i].DL);
                FIRST.push(_Json.data[i].FIRST == undefined ? '0' : _Json.data[i].FIRST)
                SECOND.push(_Json.data[i].SECOND == undefined ? '0' : _Json.data[i].SECOND)
                THIRD.push(_Json.data[i].THIRD == undefined ? '0' : _Json.data[i].THIRD)
                SOLVED.push(_Json.data[i].SOLVED == undefined ? '0' : _Json.data[i].SOLVED)
                UNSOLVED.push(_Json.data[i].UNSOLVED == undefined ? '0' : _Json.data[i].UNSOLVED)
            }
            switch (Type_control_name) {
                case 'grade':
                    QUES1 = [];
                    QUES2 = [];
                    QUES3 = [];
                    QUES4 = [];
                    QUES5 = [];
                    QUES6 = [];
                    GT = [];
                    PS = [];
                    DL = [];
                    SOLVED = [];
                    UNSOLVED = [];
                    //FIRST = [];
                    //SECOND = [];
                    //THIRD = [];
                    break;
                case 'status':
                    QUES1 = [];
                    QUES2 = [];
                    QUES3 = [];
                    QUES4 = [];
                    QUES5 = [];
                    QUES6 = [];
                    GT = [];
                    PS = [];
                    DL = [];
                    //SOLVED = [];
                    //UNSOLVED = [];
                    FIRST = [];
                    SECOND = [];
                    THIRD = [];
                    break;
                case 'which_C':
                    //QUES1 = [];
                    //QUES2 = [];
                    //QUES3 = [];
                    //QUES4 = [];
                    //QUES5 = [];
                    //QUES6 = [];
                    GT = [];
                    PS = [];
                    DL = [];
                    SOLVED = [];
                    UNSOLVED = [];
                    FIRST = [];
                    SECOND = [];
                    THIRD = [];
                    break;

                case 'major':
                    QUES1 = [];
                    QUES2 = [];
                    QUES3 = [];
                    QUES4 = [];
                    QUES5 = [];
                    QUES6 = [];
                    //GT = [];
                    //PS = [];
                    //DL = [];
                    SOLVED = [];
                    UNSOLVED = [];
                    FIRST = [];
                    SECOND = [];
                    THIRD = [];
                    break;
            }



            line_data = { LINENAME, QUES1, QUES2, QUES3, QUES4, QUES5, QUES6, GT, PS, DL, FIRST, SECOND, THIRD, SOLVED, UNSOLVED};

            
                $('#line_chart_right').css("height", LINENAME.length * 28);
                ORGChart = ECharts.init(document.getElementById('line_chart_right'), theme);
                var ORGOption = ConfigOptions_bottom(line_data, "负责单位分布情况");
                ORGChart.clear();
                ORGChart.setOption(ORGOption);
            
        }
    })
};

function ConfigOptions_bottom(_json, Text, Icon) {
    var Icon_img = [];
    var _padding = [10];
    var optings = {
        backgroundColor: '#031440',
        title: {
            text: Text,
            x: 'left',
            padding: _padding
        },
        toolbox: {
            show: true,
            feature: {
                saveAsImage: {
                    show: false
                }
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function (params, ticket, callback) {
                //console.log(params, ticket, callback)
                var res = params[0][1] + '</br>';

                for (var i = 0; i < params.length; i++) {
                    if (params[i][2] == undefined || params[i][2] == '-1000' || params[i][2] === '' || params[i][2] == "-" || params[i][2] == "0") {
                        res += '';
                    } else {
                        res += params[i][0] + ':' + params[i][2] + '</br>';
                    }

                }
                return res;

            }
        },
        legend: {
            data: Icon_img
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            x: 450,
            containLabel: true
        },
        xAxis: [
            {
                type: 'value',
                position: 'top',
                axisLine: {
                    lineStyle: {
                        color: 'red',
                        width: 1,
                        type: 'solid'
                    }
                }
            }
        ],
        yAxis: [
            {
                type: 'category',
                data: _json.LINENAME,
                //axisLabel: {
                //    margin:'-20'
                //}
            }
        ],
        series: [
            {
                name: 'Ⅰ',
                type: 'bar',
                barWidth: 15,
                itemStyle: {
                    normal: { color: '#D2773D' },
                    emphasis: { color: '#D2773D' }
                },
                barGap: '-10%',
                stack: '状态',
                data: _json.FIRST
            },
            {
                name: 'Ⅱ',
                type: 'bar',
                barWidth: 15,
                itemStyle: {
                    normal: { color: '#ECB24F' },
                    emphasis: { color: '#ECB24F' }
                },
                barGap: '-10%',
                stack: '状态',
                data: _json.SECOND
            },
            {
                name: 'Ⅲ',
                type: 'bar',
                barWidth: 15,
                itemStyle: {
                    normal: { color: '#FDEE9C' },
                    emphasis: { color: '#FDEE9C' }
                },
                barGap: '-10%',
                stack: '状态',
                data: _json.THIRD
            },
            {
                name: '高铁',
                type: 'bar',
                barWidth: 15,
                itemStyle: {
                    normal: { color: '#D74B29' },
                    emphasis: { color: '#D74B29' }
                },
                barGap: '-10%',
                stack: '状态',
                data: _json.GT
            },
            
            {
                name: '普速',
                type: 'bar',
                barWidth: 15,
                itemStyle: {
                    normal: { color: '#F67D4C' },
                    emphasis: { color: '#F67D4C' }
                },
                barGap: '-10%',
                stack: '状态',
                data: _json.PS
            },
            {
                name: '电力',
                type: 'bar',
                barWidth: 15,
                itemStyle: {
                    normal: { color: '#FEB08F' },
                    emphasis: { color: '#FEB08F' }
                },
                barGap: '-10%',
                stack: '状态',
                data: _json.DL
            },
            {
                name: '通道',
                type: 'bar',
                barWidth: 15,
                itemStyle: {
                    normal: { color: '#B3DFFC' },
                    emphasis: { color: '#B3DFFC' }
                },
                stack: '状态',
                data: _json.QUES1
            },
            {
                name: '调度主站（硬件）',
                type: 'bar',
                barWidth: 15,
                itemStyle: {
                    normal: { color: '#63BEF9' },
                    emphasis: { color: '#63BEF9' }
                },
                stack: '状态',
                data: _json.QUES2
            },
            {
                name: '调度主站（软件）',
                type: 'bar',
                barWidth: 15,
                itemStyle: {
                    normal: { color: '#289CE8' },
                    emphasis: { color: '#289CE8' }
                },
                stack: '状态',
                data: _json.QUES3
            },
            {
                name: '被控站（通讯）',
                type: 'bar',
                barWidth: 15,
                itemStyle: {
                    normal: { color: '#0782D1' },
                    emphasis: { color: '#0782D1' }
                },
                stack: '状态',
                barGap: '-10%',
                data: _json.QUES4
            },
            {
                name: '被控站（一次设备）',
                type: 'bar',
                barWidth: 15,
                itemStyle: {
                    normal: { color: '#1E6897' },
                    emphasis: { color: '#1E6897' }
                },
                stack: '状态',
                barGap: '-10%',
                data: _json.QUES5
            },
            {
                name: '被控站（二次设备）',
                type: 'bar',
                barWidth: 15,
                itemStyle: {
                    normal: { color: '#02507E' },
                    emphasis: { color: '#02507E' }
                },
                stack: '状态',
                barGap: '-10%',
                data: _json.QUES6
            },
            {
                name: '已销号',
                type: 'bar',
                barWidth: 15,
                itemStyle: {
                    normal: { color: '#6AE89C' },
                    emphasis: { color: '#6AE89C' }
                },
                stack: '状态',
                barGap: '-10%',
                data: _json.SOLVED
            },
            {
                name: '未销号',
                type: 'bar',
                barWidth: 15,
                itemStyle: {
                    normal: { color: '#BEFFD8' },
                    emphasis: { color: '#BEFFD8' }
                },
                stack: '状态',
                barGap: '-10%',
                data: _json.UNSOLVED
            }
            
            
        ]
    }
    return optings;
};

function echart_toggle(action) {
    if (action != 'LINE' && action != 'POSTION') {
        lastaction = action
    } else {
        lastLineaction = action;
    }
    GetChartOption_bottom(action);
};


function Type_control_toggle(type) {
    Type_control_name = type;

    GetChartOption_bottom(lastaction);
}

//导出
function port_Out() {
    

    var severityChartdata = severityChart.getDataURL("png");
    var summaryChartdata = summaryChart.getDataURL("png");
    var statusChartdata = statusChart.getDataURL("png");
    var lineChartdata = lineChart.getDataURL("png");
    var ORGChartdata = ORGChart.getDataURL("png");


    var data = { 'img1': severityChartdata, 'img2': summaryChartdata, 'img3': statusChartdata, 'img4': lineChartdata, 'img5': ORGChartdata, }
    //window.open(_url);
    $.ajax({
        type: "POST",
        url: '/6C/PC/MALARMMONITORING/REMOTEHANDLERS/DPC_NEW/DOWNALARMSTATISTICS.ASHX',
        data: data,
        async: true,
        cache: false,
        success: function (re) {
            if (re != '' && re != undefined) {
                if (re.url != '') {
                    Downer(re.url)
                }
            }
        }
    })
}


//获取选中项
function getSelectedItem(obj) {
    var slct = "";
    for (var i = 0; i < obj.options.length; i++)
        if (obj.options[i].selected == true) {
            slct += ',' + obj.options[i].value;
        }
    return slct.substring(1);
};