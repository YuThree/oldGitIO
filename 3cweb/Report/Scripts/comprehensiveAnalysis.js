var leixin = {};
var jibie = {};
var zhuangtai = {};
var alarmtype = {};
var line_data = {};
var Type_control_name = 'which_C';
var bgcolor = 'transparent';
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
    if (GetQueryString('Category_Code') == '3C') {
        $('.Category_Code').hide();
        $("#category_code").attr('code','3C').val('3C')
    }
    $('#stardate').val(getDateStr_day(datehhssNowStr(), (0 - parseInt(getConfig('WJ_FaultCountAnalysis_days')))))//默认时间  配置项 WJ_FaultCountAnalysis_days
    $('#enddate').val(dateNowStr() + "23:59:59")

    var jbJson = GetSeverityJson();
    var jsHtml = "";
    for (var i = 0; i < jbJson.length; i++) {
        jsHtml += "<option value='" + jbJson[i].code + "'>" + jbJson[i].name + "</option>";
    }
    if (jsHtml) {
        $("#jb").html($("#jb").html() + jsHtml);
    }

    //$("#jb").multiselect({
    //    header: false,
    //    noneSelectedText: "==请选择==",
    //    checkAllText: "全选",
    //    uncheckAllText: '全不选',
    //    selectedList: 3,
    //    height: 100
    //});

    $('#ddlLine').mySelectTree({
        tag: "LINE",
        action:"Problem",
        height: 250,
        enableFilter: true
    });


    var jsonUser = getCurUser();
    $('#ddlorg').mySelectTree({
        tag: 'ORGANIZATION',
        type: jsonUser.orgcode,
        onClick: function (event, treeId, treeNode) {
            $("#hf_ddlorg").val(treeNode.id);
            $("#ddlorg").val(treeNode.name);
            $("#hf_type_ddlorg").val(treeNode.treeType);
        }
    });
    $('#DIRECTION').mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: '3C',
        cateGory: 'DRTFLG',
        p_code: 'DRTFLG',
        isDefClick: false,
        onClick: function (event, treeId, treeNode) {
            $('#DIRECTION').val(treeNode.name);
        }
    });
    $("#category_code").mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: '3C',
        p_code: "DET_TYPE",
        cateGory: 'DET_TYPE',
        enableFilter: false,
        onClick: function (event, treeId, treeNode) {
            $("#category_code").attr('code', treeNode.id).val(treeNode.name);
        }
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
    $('#taskchart,#severityChart,#summaryChart,#statusChart,#alarmtypeChart').height(($(window).height() / 2) - 105 - 12);
    $('#line_chart').height(($(window).height() / 2));
    $('#line_chart_left,#line_chart_right').css("minHeight", ($(window).height() / 2) - 5);
    $('.Type_control').css({ 'top': $('#line_chart').offset().top - 20, 'left': ($(window).width() - $('.Type_control').outerWidth()) / 2 });
    $('.lineCtrl,.control_icon').css({ 'top': $('#line_chart').offset().top - 20 });
}
//查询表格
function doQuery() {
    fullShow();
    setTimeout('Load_pic2()', 500);
};

function Load_pic() {
    GetChartOption("类型");
    //GetChartOption("级别");
    // GetChartOption("状态");
    GetChartOption_bottom("LINE");
    GetChartOption_bottom("BUREAU");

    fullHide();
};
function Load_pic2() {
    try {
        alarmtypeChart = ECharts.init(document.getElementById('alarmtypeChart'), theme);
        severityChart = ECharts.init(document.getElementById('severityChart'), theme);
        summaryChart = ECharts.init(document.getElementById('summaryChart'), theme);
        statusChart = ECharts.init(document.getElementById('statusChart'), theme);
        lineChart = ECharts.init(document.getElementById('line_chart_left'), theme);
        ORGChart = ECharts.init(document.getElementById('line_chart_right'), theme);
        GetChartOption("类型");
        // GetChartOption("级别");
        //GetChartOption("状态");
        GetChartOption_bottom(lastLineaction);
        if ($('#hf_type_ddlorg').val() == "J") {
            //$('input[value="局"]').attr('checked', true)
            //GetChartOption_bottom("BUREAU");
            GetChartOption_bottom(lastaction);

        } else if ($('#hf_type_ddlorg').val() == "GDD" || $('#hf_type_ddlorg').val() == "JWD") {
            GetChartOption_bottom("POWER_SECTION");
        } else if ($('#hf_type_ddlorg').val() == "CJ") {
            GetChartOption_bottom("WORKSHOP");
        } else if ($('#hf_type_ddlorg').val() == "GQ") {
            GetChartOption_bottom("ORG");
        } else {
            GetChartOption_bottom(lastaction);
        }

        fullHide();
    } catch (e) {
        setTimeout('Load_pic2()', 500);

    }


};

function GetChartOption(category) {

    var startdate = document.getElementById('stardate').value;
    var enddate = document.getElementById('enddate').value;
    var orgCode = $('#hf_ddlorg').val();
    var orgType = $('#hf_type_ddlorg').val();

    if (orgType == 'J') {
        orgType = ' BUREAU_CODE';
    } else if (orgType == 'TOPBOSS' || orgType == undefined || orgType == 'YSJ') {
        orgType = '';
    } else if (orgType == 'GDD') {
        orgType = 'POWER_SECTION_CODE';
    } else if (orgType == 'CJ' || orgType == 'DK') {
        orgType = 'WORKSHOP_CODE';
    } else if (orgType == 'GQ') {
        orgType = 'ORG_CODE';
    } else if (orgType == 'JWD') {
        orgType = 'P_ORG_CODE';
    }

    var lineCode = $('#ddlLine').attr("code");
    if (lineCode == "" || lineCode == undefined) {
        lineCode = "";
    }
    var direction = $('#DIRECTION').val();
    if (direction == "0") {
        direction = "";
    }
    var statas = $('#statas').val();

    if (startdate != null && startdate != "" && enddate != null && enddate != "") {
        if (enddate < startdate) {
            ymPrompt.errorInfo('结束时间必须比开始时间大~！！', null, null, '提示信息', null);
            return;
        }
    }
    if ($('#ddlorg').val() == "") {
        orgCode = "";
    }
    var jb = getSelectedItem(document.getElementById('jb'));
    var CATEGORY_CODE = '';
    if ($('#category_code').attr('code') != undefined) {
        CATEGORY_CODE = $('#category_code').attr('code');
    };
    var url = '/6C/PC/MAlarmMonitoring/RemoteHandlers/DPC_new/DPCAlarmStatistics.ashx?type=SynthesizedStatistic'
                + '&startdate=' + startdate
                + '&enddate=' + enddate
                + '&lineCode=' + lineCode
                + '&org_code=' + orgCode
                + '&orgType=' + orgType
                + '&direction=' + direction
                + '&statas=' + statas
                + '&severity=' + jb
                + '&category=' + CATEGORY_CODE
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
                for (var i = 0; i < _json.data[2].length; i++) {
                    var name = _json.data[2][i].split("|")[0];
                    var value = _json.data[2][i].split("|")[2];
                    if (value != '0' && name != '') {
                        data.push({ "value": value, "name": name });
                    } else {
                        data.push({});
                    }
                }
                leixin = data;
                //_color = ['#B3DFFC', '#63BEF9', '#289CE8', '#0782D1', '#1E6897', '#02507E'];
                _color = ['#B3DFFC', '#63BEF9', '#289CE8', '#0782D1', '#1E6897', '#02507E', '#0f4262', '#d6eefd'];

                var severityOption = ConfigOptions(leixin, "检测类型", _color);
                severityChart.clear();
                severityChart.setOption(severityOption);

                //    break;
                //case '级别':
                data = [];
                for (var i = 0; i < _json.data[0].length; i++) {
                    var name = _json.data[0][i].split("|")[0];
                    var value = _json.data[0][i].split("|")[2];
                    if (value != '0' && name != '') {
                        data.push({ "value": value, "name": name });
                    } else {
                        data.push({});
                    }
                }
                jibie = data;
                _color = ['#D2773D', '#ECB24F', '#FDEE9C', '#fff9d9'];

                var summaryOption = ConfigOptions(jibie, "缺陷等级", _color);
                summaryChart.clear();
                summaryChart.setOption(summaryOption);

                //    break; 
                //case '状态':
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
                zhuangtai = data;
                _color = ['#6AE89C', '#BEFFD8', '#49C378', '#1BA453', '#057B38', '#CCCCCC'];

                var statusOption = ConfigOptions(zhuangtai, "状态分布", _color);
                statusChart.clear();
                statusChart.setOption(statusOption);

                //break;

                //case '报警类型':
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
                alarmtype = data;
                

                //_color = ['#c12e34', '#e6b600', '#0098d9', '#2b821d', '#005eaa', '#339ca8', '#cda819', '#32a487'];
                _color = ['#D53A35', '#334B5C', '#6AB0B8', '#E98F6F', '#9FDABF', '#7FAE90', '#DE9325', '#CFB2A9', '#797B7F', '#5C6F7B', '#D7E0E8', '#c12e34'];

                var alarmtypeOption = ConfigOptions(alarmtype, "缺陷类型", _color);
                alarmtypeChart.clear();
                alarmtypeChart.setOption(alarmtypeOption);
                //}
            } else {
                severityChart.clear();
                statusChart.clear();
                summaryChart.clear();
                alarmtypeChart.clear();
            }
        }
    });
};

function ConfigOptions(_json, Text, _color) {
    var optings = {
        backgroundColor: bgcolor,
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
    var orgCode = $('#hf_ddlorg').val();
    var orgType = $('#hf_type_ddlorg').val();

    if (orgType == 'J') {
        orgType = ' BUREAU_CODE';
    } else if (orgType == 'TOPBOSS' || orgType == undefined || orgType == 'YSJ') {
        orgType = '';
    } else if (orgType == 'GDD') {
        orgType = 'POWER_SECTION_CODE';
    } else if (orgType == 'CJ' || orgType == 'DK') {
        orgType = 'WORKSHOP_CODE';
    } else if (orgType == 'GQ') {
        orgType = 'ORG_CODE';
    } else if (orgType == 'JWD') {
        orgType = 'P_ORG_CODE';
    }


    var lineCode = $('#ddlLine').attr("code");
    if (lineCode == "" || lineCode == undefined) {
        lineCode = "";
    }
    var direction = $('#DIRECTION').val();
    if (direction == "0") {
        direction = "";
    }
    var statas = getSelectedItem(document.getElementById('statas'));


    if (startdate != null && startdate != "" && enddate != null && enddate != "") {
        if (enddate < startdate) {
            ymPrompt.errorInfo('结束时间必须比开始时间大~！！', null, null, '提示信息', null);
            return;
        }
    }
    if ($('#ddlorg').val() == "") {
        orgCode = "";
    }
    var jb = getSelectedItem(document.getElementById('jb'));
    var CATEGORY_CODE = '';
    if ($('#category_code').attr('code') != undefined) {
        CATEGORY_CODE = $('#category_code').attr('code');
    };
    var _url = '/6C/PC/MAlarmMonitoring/RemoteHandlers/DPC_new/DPCAlarmStatistics.ashx?type=SynthesizedStatisticByCondition'
                + '&startdate=' + startdate
                + '&enddate=' + enddate
                + '&lineCode=' + lineCode
                + '&org_code=' + orgCode
                + '&orgType=' + orgType
                + '&direction=' + direction
                + '&statas=' + statas
                + '&statisticsType=' + search_type
                + '&severity=' + jb
                + '&category=' + CATEGORY_CODE
                + '&temp=' + Math.random();
    var _Json;
    var LINENAME = [];  //线路名
    var FIRSTALARM = [];  //一类报警数
    var SECONDALARM = []; //二类报警数
    var THIRDALARM = [];  //三类报警数
    var GRADEZEROALARM = [];//空报警类型警数

    var NEWALARM = []; //新上报报警数
    var CONFIRMEDALARM = [];  //已确认报警数
    var CANCELEDALARM = [];  //已取消报警数
    var PLANEDALARM = [];  //已计划报警数
    var CLOSEDALARM = [];  //已关闭报警数
    var REPAIRINGALARM = [];  //检修中报警数

    var overAlarm = [];//已消缺
    var notOverAlarm = [];//未消缺

    var C1ALARM = [];  //C1报警数
    var C2ALARM = [];  //C2报警数
    var C3ALARM = [];  //C3报警数
    var C4ALARM = [];  //C4报警数
    var C5ALARM = [];  //C5报警数
    var C6ALARM = [];  //C6报警数
    var BXALARM = [];  //步巡报警数
    var which_CALARM = [];//空检测类型报警数

    var alarmTypeArry = [];//所有数据类型
    $.ajax({
        type: "POST",
        url: _url,
        async: true,
        cache: false,
        success: function (result) {
            _Json = result;
            if (_Json.data.length == 0) {
                if (search_type == "LINE" || search_type == "POSTION") {
                    lineChart.clear();
                    layer.msg('线路分布无数据！');
                } else {
                    ORGChart.clear();
                    layer.msg('组织机构分布无数据！');

                }
                return;
            }
            //var _Json = { "data": [{ "STATISTICNAME": "", "STATISTICCODE": "", "STATISTICALARM": "1", "FIRSTALARM": "0", "SECONDALARM": "1", "THIRDALARM": "0", "OTHER_SEVERITY": "0", "SOLVED": "0", "UNSOLVED": "1", "C1ALARM": "0", "C2ALARM": "0", "C3ALARM": "0", "C4ALARM": "0", "C5ALARM": "0", "C6ALARM": "1", "STEPALARM": "0", "OTHER_CATEGORY": "0" }, { "STATISTICNAME": "兰新客专", "STATISTICCODE": "LXKZ$90001", "STATISTICALARM": "1", "FIRSTALARM": "0", "SECONDALARM": "1", "THIRDALARM": "0", "OTHER_SEVERITY": "0", "SOLVED": "0", "UNSOLVED": "1", "C1ALARM": "1", "C2ALARM": "0", "C3ALARM": "0", "C4ALARM": "0", "C5ALARM": "0", "C6ALARM": "0", "STEPALARM": "0", "OTHER_CATEGORY": "0" }, { "STATISTICNAME": "大张线", "STATISTICCODE": "DZX", "STATISTICALARM": "18", "FIRSTALARM": "14", "SECONDALARM": "4", "THIRDALARM": "0", "OTHER_SEVERITY": "0", "SOLVED": "2", "UNSOLVED": "16", "C1ALARM": "0", "C2ALARM": "0", "C3ALARM": "0", "C4ALARM": "0", "C5ALARM": "0", "C6ALARM": "0", "STEPALARM": "18", "OTHER_CATEGORY": "0" }], "alarmtype": [{ "STATISTICNAME": "测试线", "STATISTICCODE": "", "data": [{ "name": "xx", "value": "3" }, { "name": "xx", "value": "23" }, { "name": "xx", "value": "3" }, { "name": "xx", "value": "2" }, { "name": "xx", "value": "11" }] }, { "STATISTICNAME": "测试线2", "STATISTICCODE": "", "data": [{ "name": "xx", "value": "13" }, { "name": "xx", "value": "23" }, { "name": "xx", "value": "3" }, { "name": "xx", "value": "2" }, { "name": "xx", "value": "61" }] }] }
            for (var i = 0; i < _Json.data.length; i++) {
                LINENAME.push(_Json.data[i].STATISTICNAME);
                FIRSTALARM.push(_Json.data[i].FIRSTALARM);
                SECONDALARM.push(_Json.data[i].SECONDALARM);
                THIRDALARM.push(_Json.data[i].THIRDALARM);
                //NEWALARM.push(_Json.data[i].NEWALARM);
                //CONFIRMEDALARM.push(_Json.data[i].CONFIRMEDALARM);
                //CANCELEDALARM.push(_Json.data[i].CANCELEDALARM);
                //PLANEDALARM.push(_Json.data[i].PLANEDALARM);
                //CLOSEDALARM.push(_Json.data[i].CLOSEDALARM);
                //REPAIRINGALARM.push(_Json.data[i].REPAIRINGALARM);
                C1ALARM.push(_Json.data[i].C1ALARM);
                C2ALARM.push(_Json.data[i].C2ALARM);
                C3ALARM.push(_Json.data[i].C3ALARM);
                C4ALARM.push(_Json.data[i].C4ALARM);
                C5ALARM.push(_Json.data[i].C5ALARM);
                C6ALARM.push(_Json.data[i].C6ALARM);
                overAlarm.push(_Json.data[i].SOLVED == undefined ? '0' : _Json.data[i].SOLVED)
                notOverAlarm.push(_Json.data[i].UNSOLVED == undefined ? '0' : _Json.data[i].UNSOLVED)
                BXALARM.push(_Json.data[i].STEPALARM == undefined ? '0' : _Json.data[i].STEPALARM)
                which_CALARM.push(_Json.data[i].OTHER_CATEGORY == undefined ? '0' : _Json.data[i].OTHER_CATEGORY)
                GRADEZEROALARM.push(_Json.data[i].OTHER_SEVERITY == undefined ? '0' : _Json.data[i].OTHER_SEVERITY)
            }

            //alarmtype 数据写入
            if (_Json.alarmtype.length > 0) {
                alarmTypeArry = _Json.alarmtype;
            }
            
            switch (Type_control_name) {
                case 'grade':
                    overAlarm = [];
                    notOverAlarm = [];
                    NEWALARM = [];
                    CONFIRMEDALARM = [];
                    CANCELEDALARM = [];
                    PLANEDALARM = [];
                    CLOSEDALARM = [];
                    REPAIRINGALARM = [];
                    C1ALARM = [];
                    C2ALARM = [];
                    C3ALARM = [];
                    C4ALARM = [];
                    C5ALARM = [];
                    C6ALARM = [];
                    BXALARM = [];
                    which_CALARM = [];
                    alarmTypeArry = [];
                    break;
                case 'status':
                    GRADEZEROALARM = [];
                    FIRSTALARM = [];
                    SECONDALARM = [];
                    THIRDALARM = [];
                    C1ALARM = [];
                    C2ALARM = [];
                    C3ALARM = [];
                    C4ALARM = [];
                    C5ALARM = [];
                    C6ALARM = [];
                    BXALARM = [];
                    which_CALARM = [];
                    alarmTypeArry = [];
                    break;
                case 'which_C':
                    overAlarm = [];
                    notOverAlarm = [];
                    GRADEZEROALARM = [];
                    FIRSTALARM = [];
                    SECONDALARM = [];
                    THIRDALARM = [];
                    NEWALARM = [];
                    CONFIRMEDALARM = [];
                    CANCELEDALARM = [];
                    PLANEDALARM = [];
                    CLOSEDALARM = [];
                    REPAIRINGALARM = [];
                    alarmTypeArry = [];
                    break;
                case 'alarmtype':
                    overAlarm = [];
                    notOverAlarm = [];
                    NEWALARM = [];
                    CONFIRMEDALARM = [];
                    CANCELEDALARM = [];
                    PLANEDALARM = [];
                    CLOSEDALARM = [];
                    REPAIRINGALARM = [];
                    C1ALARM = [];
                    C2ALARM = [];
                    C3ALARM = [];
                    C4ALARM = [];
                    C5ALARM = [];
                    C6ALARM = [];
                    BXALARM = [];
                    which_CALARM = [];
                    GRADEZEROALARM = [];
                    FIRSTALARM = [];
                    SECONDALARM = [];
                    THIRDALARM = [];
                    break;
            }



            line_data = { LINENAME, FIRSTALARM, SECONDALARM, THIRDALARM, NEWALARM, CONFIRMEDALARM, CANCELEDALARM, PLANEDALARM, CLOSEDALARM, REPAIRINGALARM, C1ALARM, C2ALARM, C3ALARM, C4ALARM, C5ALARM, C6ALARM, overAlarm, notOverAlarm, BXALARM, which_CALARM, GRADEZEROALARM, alarmTypeArry};

            if (search_type == "LINE" || search_type == "POSTION") {
                $('#line_chart_left').css("height", LINENAME.length * 28);
                if (alarmTypeArry.length > 0) {
                    $('#line_chart_left').css("height", alarmTypeArry.length * 28);
                }
                lineChart = ECharts.init(document.getElementById('line_chart_left'), theme);
                var lineOption = ConfigOptions_bottom(line_data, "线路分布情况");
                lineChart.clear();
                lineChart.setOption(lineOption);
            } else {
                $('#line_chart_right').css("height", LINENAME.length * 28);
                if (alarmTypeArry.length > 0) {
                    $('#line_chart_right').css("height", alarmTypeArry.length * 28);
                }
                ORGChart = ECharts.init(document.getElementById('line_chart_right'), theme);
                var ORGOption = ConfigOptions_bottom(line_data, "组织机构分布情况");
                ORGChart.clear();
                ORGChart.setOption(ORGOption);
            }
        }
    })
};

function ConfigOptions_bottom(_json, Text, Icon) {
    var Icon_img = [];
    var _padding = [10];
    //if (Text == "线路分布情况") {
    //    Icon_img = ['一类', '二类', '三类', '新上报', '已确认', '已取消', '已计划', '已关闭', '检修中', 'C1', 'C2', 'C3', 'C4'];
    //    _padding = [25, 10];
    //}
    var optings = {
        backgroundColor: bgcolor,
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
            x: 220,
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
                name: '【空】',
                type: 'bar',
                barWidth: 15,
                itemStyle: {
                    normal: { color: '#fff9d9' },
                    emphasis: { color: '#fff9d9' }
                },
                barGap: '-10%',
                stack: '状态',
                data: _json.GRADEZEROALARM
            },
            {
                name: '一级',
                type: 'bar',
                barWidth: 15,
                itemStyle: {
                    normal: { color: '#D2773D' },
                    emphasis: { color: '#D2773D' }
                },
                barGap: '-10%',
                stack: '状态',
                data: _json.FIRSTALARM
            },
            {
                name: '二级',
                type: 'bar',
                barWidth: 15,
                itemStyle: {
                    normal: { color: '#ECB24F' },
                    emphasis: { color: '#ECB24F' }
                },
                barGap: '-10%',
                stack: '状态',
                data: _json.SECONDALARM
            },
            {
                name: '三级',
                type: 'bar',
                barWidth: 15,
                itemStyle: {
                    normal: { color: '#FDEE9C' },
                    emphasis: { color: '#FDEE9C' }
                },
                barGap: '-10%',
                stack: '状态',
                data: _json.THIRDALARM
            },
            {
                name: '新上报',
                type: 'bar',
                barWidth: 15,
                itemStyle: {
                    normal: { color: '#BEFFD8' },
                    emphasis: { color: '#BEFFD8' }
                },
                stack: '状态',
                data: _json.NEWALARM
            },
            {
                name: '已确认',
                type: 'bar',
                barWidth: 15,
                itemStyle: {
                    normal: { color: '#6AE89C' },
                    emphasis: { color: '#6AE89C' }
                },
                stack: '状态',
                data: _json.CONFIRMEDALARM
            },
            {
                name: '已取消',
                type: 'bar',
                barWidth: 15,
                itemStyle: {
                    normal: { color: '#CCCCCC' },
                    emphasis: { color: '#CCCCCC' }
                },
                stack: '状态',
                data: _json.CANCELEDALARM
            },
            {
                name: '已计划',
                type: 'bar',
                barWidth: 15,
                itemStyle: {
                    normal: { color: '#49C378' },
                    emphasis: { color: '#49C378' }
                },
                stack: '状态',
                data: _json.PLANEDALARM
            },
            {
                name: '已关闭',
                type: 'bar',
                barWidth: 15,
                itemStyle: {
                    normal: { color: '#057B38' },
                    emphasis: { color: '#057B38' }
                },
                stack: '状态',
                data: _json.CLOSEDALARM
            },
            {
                name: '检修中',
                type: 'bar',
                barWidth: 15,
                itemStyle: {
                    normal: { color: '#1BA453' },
                    emphasis: { color: '#1BA453' }
                },
                stack: '状态',
                barGap: '-10%',
                data: _json.REPAIRINGALARM
            },
            {
                name: '【空】',
                type: 'bar',
                barWidth: 15,
                itemStyle: {
                    normal: { color: '#d6eefd' },
                    emphasis: { color: '#d6eefd' }
                },
                stack: '状态',
                data: _json.which_CALARM
            },
            {
                name: '1C',
                type: 'bar',
                barWidth: 15,
                itemStyle: {
                    normal: { color: '#B3DFFC' },
                    emphasis: { color: '#B3DFFC' }
                },
                stack: '状态',
                data: _json.C1ALARM
            },
            {
                name: '2C',
                type: 'bar',
                barWidth: 15,
                itemStyle: {
                    normal: { color: '#63BEF9' },
                    emphasis: { color: '#63BEF9' }
                },
                stack: '状态',
                data: _json.C2ALARM
            },
            {
                name: '3C',
                type: 'bar',
                barWidth: 15,
                itemStyle: {
                    normal: { color: '#289CE8' },
                    emphasis: { color: '#289CE8' }
                },
                stack: '状态',
                data: _json.C3ALARM
            },
            {
                name: '4C',
                type: 'bar',
                barWidth: 15,
                itemStyle: {
                    normal: { color: '#0782D1' },
                    emphasis: { color: '#0782D1' }
                },
                stack: '状态',
                barGap: '-10%',
                data: _json.C4ALARM
            },
            {
                name: '5C',
                type: 'bar',
                barWidth: 15,
                itemStyle: {
                    normal: { color: '#1E6897' },
                    emphasis: { color: '#1E6897' }
                },
                stack: '状态',
                barGap: '-10%',
                data: _json.C5ALARM
            },
            {
                name: '6C',
                type: 'bar',
                barWidth: 15,
                itemStyle: {
                    normal: { color: '#02507E' },
                    emphasis: { color: '#02507E' }
                },
                stack: '状态',
                barGap: '-10%',
                data: _json.C6ALARM
            },
            {
                name: '步巡',
                type: 'bar',
                barWidth: 15,
                itemStyle: {
                    normal: { color: '#0f4262' },
                    emphasis: { color: '#0f4262' }
                },
                stack: '状态',
                barGap: '-10%',
                data: _json.BXALARM
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
                data: _json.overAlarm
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
                data: _json.notOverAlarm
            }
        ]
    }
    if (_json.alarmTypeArry.length > 0) {
        var yarry = [];
        //var color = ['#c12e34', '#e6b600', '#0098d9', '#2b821d', '#005eaa', '#339ca8', '#cda819', '#32a487'];
        var color = ['#D53A35', '#334B5C', '#6AB0B8', '#E98F6F', '#9FDABF', '#7FAE90', '#DE9325', '#CFB2A9', '#797B7F', '#5C6F7B', '#D7E0E8', '#c12e34'];
        for (var k = 0; k < _json.alarmTypeArry.length; k++) {
            yarry.push(_json.alarmTypeArry[k].STATISTICNAME);
        }
        for (var j = 0; j < _json.alarmTypeArry[0].data.length; j++) {
            var val = [];
            for (var i = 0; i < _json.alarmTypeArry.length; i++) {
                val.push(_json.alarmTypeArry[i].data[j].value);
            }
            var ss = {
                name: _json.alarmTypeArry[0].data[j].name,
                type: 'bar',
                barWidth: 15,
                itemStyle: {
                    normal: { color: color[(j % color.length)] },
                    emphasis: { color: color[(j % color.length)] }
                },
                barGap: '-10%',
                stack: '状态',
                data: val
            }
            optings.series.push(ss)
        }
        optings.yAxis[0].data = yarry;
    }
    
    //console.log(optings.series)
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

    GetChartOption_bottom(lastLineaction);

    GetChartOption_bottom(lastaction);


}

//导出
function port_Out() {
    var startdate = document.getElementById('stardate').value;
    var enddate = document.getElementById('enddate').value;
    var orgCode = $('#hf_ddlorg').val();
    var orgType = $('#hf_type_ddlorg').val();

    if (orgType == 'J') {
        orgType = ' BUREAU_CODE';
    } else if (orgType == 'TOPBOSS' || orgType == undefined || orgType == 'YSJ') {
        orgType = '';
    } else if (orgType == 'GDD') {
        orgType = 'POWER_SECTION_CODE';
    } else if (orgType == 'CJ' || orgType == 'DK') {
        orgType = 'WORKSHOP_CODE';
    } else if (orgType == 'GQ') {
        orgType = 'ORG_CODE';
    } else if (orgType == 'JWD') {
        orgType = 'P_ORG_CODE';
    }


    var lineCode = $('#ddlLine').attr("code");
    if (lineCode == "" || lineCode == undefined) {
        lineCode = "";
    }
    var direction = $('#DIRECTION').val();
    if (direction == "0") {
        direction = "";
    }
    var statas = getSelectedItem(document.getElementById('statas'));

    if (startdate != null && startdate != "" && enddate != null && enddate != "") {
        if (enddate < startdate) {
            ymPrompt.errorInfo('结束时间必须比开始时间大~！！', null, null, '提示信息', null);
            return;
        }
    }
    if ($('#ddlorg').val() == "") {
        orgCode = "";
    }
    var jb = getSelectedItem(document.getElementById('jb'));
    var CATEGORY_CODE = '';
    if ($('#category_code').attr('code') != undefined) {
        CATEGORY_CODE = $('#category_code').attr('code');
    };

    var severityChartdata = severityChart.getDataURL("png");
    var summaryChartdata = summaryChart.getDataURL("png");
    var statusChartdata = statusChart.getDataURL("png");
    var lineChartdata = lineChart.getDataURL("png");
    var ORGChartdata = ORGChart.getDataURL("png");

    //console.log(severityChartdata, summaryChartdata)
    var _url = '/Report/DPCAlarmStatistics.aspx?'
+ 'startdate=' + startdate
+ '&enddate=' + enddate
+ '&lineCode=' + lineCode
+ '&org_code=' + orgCode
+ '&orgType=' + orgType
+ '&direction=' + direction
+ '&statas=' + statas
+ '&distribution=' + Type_control_name
+ '&typeLine=' + lastLineaction
+ '&typeOrg=' + lastaction
+ '&severity=' + jb
+ '&category=' + CATEGORY_CODE
+ '&_w=' + window.screen.width + '&_h=' + window.screen.height;
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