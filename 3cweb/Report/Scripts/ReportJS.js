
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
//var ECharts;= GetECharts();

//初始化
$(document).ready(function () {
    $('#taskchart').height(($(window).height() / 2) - 80);
    $('#severityChart').height(($(window).height() / 2) - 80);
    $('#summaryChart').height(($(window).height() / 2) - 80);
    $('#statusChart').height(($(window).height() / 2) - 80);
    //加载线路下拉
    //$("#ddlLine").mySelect({
    //    tag: "Line",
    //    callback: function (rs) {
    //        //            $("#ddlLine").html(rs);
    //    }
    //});
    $('#ddlLine').mySelectTree({
        tag: "LINE",
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


    //    var zTree = $.fn.zTree.getZTreeObj("treeDemo_ddlorg");
    //    var node = zTree.getNodeByParam("id", jsonUser.orgcode);

    //    if (node != null) {

    //        zTree.selectNode(node); //选择点  
    //        zTree.setting.callback.onClick(null, zTree.setting.treeId, node); //调用事件  
    //    }

    switch (GetQueryString("reportType")) {
        case "day":
            //$("#importRunStatus").css("display", "");
            document.getElementById('daydate').style.display = "";
            document.getElementById('title').innerText = "日报";

            var now = new Date();
            var nowStr = now.format("yyyy-MM-dd");
            $('#daydate').val(nowStr);
            break;
        case "week":
            document.getElementById('startdate').style.display = "";
            document.getElementById('enddate').style.display = "";
            document.getElementById('label1').style.display = "inline";
            document.getElementById('title').innerText = "周报";

            var now = new Date();
            var nowStr = now.format("yyyy-MM-dd");

            var start1 = getthedate(now, -6);

            $('#startdate').val(start1);
            $('#enddate').val(nowStr);

            var now = new Date();

            var nowStr = now.format("yyyy-MM-dd");
            $('#enddate').val(nowStr);

            break;
        case "month":
            document.getElementById('monthdate').style.display = "";
            document.getElementById('title').innerText = "月报";

            var now = new Date();
            var nowStr = now.format("yyyy-MM");
            $('#monthdate').val(nowStr);

            break;
        default:
    }
    $('#import').click(function () {
        var startdate = document.getElementById('startdate').value;
        var enddate = document.getElementById('enddate').value;
        var orgCode = $('#hf_ddlorg').val();
        var orgType = $('#hf_type_ddlorg').val();
        var lineCode = $('#ddlLine').attr("code");
        if (lineCode == "" || lineCode == undefined) {
            lineCode = "0";
        }
        if ($('#ddlorg').val() == "") {
            orgCode = "0";
        }
        var url = 'CommonReport.aspx?'
            + 'reportType=' + GetQueryString("reportType")
            + '&startDate=' + getFormDate(GetQueryString("reportType"))
            + '&endDate=' + enddate
            + '&category=' + GetQueryString("category")
            + '&orgCode=' + orgCode
            + '&orgType=' + orgType
            + '&lineCode=' + lineCode
            + "&_w=" + window.screen.width
            + "&_h=" + window.screen.height
            + '&temp=' + Math.random();

        window.open(url);

    })
    $("#importRunStatus,#Button1").click(function () {
        var startdate = document.getElementById('daydate').value;
        var url = "RunStatus.aspx?p_date=" + startdate
                 + "&_w=" + window.screen.width
                 + "&_h=" + window.screen.height
                 + '&temp=' + Math.random();
        window.open(url);
    });


    LoadPage();
    doQuery();

    //在日报、周报、月报中点击查询的处理
    $('#reportQuery').click(function () {
        var daydate = $('#daydate').val();
        var monthdate = $('#monthdate').val();
        var startdate = $('#startdate').val();
        var enddate = $('#enddate').val();
        switch (GetQueryString("reportType")) {
            case "day":
                if ('' === daydate) {
                    layer.tips('不能为空', '#daydate', {
                        tips: 1
                    });
                    return;
                }
                if (daydate != null && daydate != "") {
                    doQuery();
                }
                break;
            case "week":
                if ('' === startdate) {
                    layer.tips('不能为空', '#startdate', {
                        tips: 1
                    });
                    return;
                }
                if ('' === enddate) {
                    layer.tips('不能为空', '#enddate', {
                        tips: 1
                    });
                    return;
                }
                if (startdate != null && startdate != "" && enddate != null && enddate != "") {
                    doQuery();
                }
                break;
            case "month":
                if ('' === monthdate) {
                    layer.tips('不能为空', '#monthdate', {
                        tips: 1
                    });
                    return;
                }
                if (monthdate != null && monthdate != "") {
                    doQuery();
                }
                break;
        }
    });
});
//需要初始化的地方
function LoadPage() {
    loadFlexiGrid();
};

//查询表格
function doQuery() {
    fullShow();
    setTimeout('Load_pic()', 500);

    var startdate = document.getElementById('startdate').value;
    var enddate = document.getElementById('enddate').value;
    var orgCode = $('#hf_ddlorg').val();
    var orgType = $('#hf_type_ddlorg').val();
    var lineCode = $('#ddlLine').attr("code");
    if (lineCode == "" || lineCode == undefined) {
        lineCode = "0";
    }

    if (startdate != null && startdate != "" && enddate != null && enddate != "") {
        if (enddate < startdate) {
            ymPrompt.errorInfo('结束时间必须比开始时间大~！！', null, null, '提示信息', null);
            return;
        }
    }
    if ($('#ddlorg').val() == "") {
        orgCode = "0";
    }

    option.url = 'RemoteHandlers/ReportControl.ashx?'
        + 'reportType=' + GetQueryString("reportType")
        + '&type=table'
        + '&startdate=' + getFormDate(GetQueryString("reportType"))
        + '&enddate=' + enddate
        + '&category=' + GetQueryString("category")
        + '&lineCode=' + lineCode
        + '&orgCode=' + orgCode
        + '&orgType=' + orgType
        + '&temp=' + Math.random();

    option.newp = 1;
    $("#flexTable").flexigrid(option);
    $("#flexTable").flexOptions(option).flexReload();

    //    setTimeout('fullHide()', 3000);
    //    fullHide();
}

function Load_pic() {
    try {
        var severityChart = ECharts.init(document.getElementById('severityChart'), theme);
        var summaryChart = ECharts.init(document.getElementById('summaryChart'), theme);
        var statusChart = ECharts.init(document.getElementById('statusChart'), theme);
        var severityOption = GetChartOption("severity");
        var summaryOption = GetChartOption("summary");
        var statusOption = GetChartOption("status");

        severityChart.setOption(severityOption);
        summaryChart.setOption(summaryOption);
        statusChart.setOption(statusOption);
    } catch (e) {
        setTimeout(Load_pic, 200)
    }

};

function GetChartOption(chartType) {

    var startdate = document.getElementById('startdate').value;
    var enddate = document.getElementById('enddate').value;
    var orgCode = $('#hf_ddlorg').val();
    var orgType = $('#hf_type_ddlorg').val();
    var lineCode = $('#ddlLine').attr("code");
    if (lineCode == "" || lineCode == undefined) {
        lineCode = "0";
    }

    if (startdate != null && startdate != "" && enddate != null && enddate != "") {
        if (enddate < startdate) {
            ymPrompt.errorInfo('结束时间必须比开始时间大~！！', null, null, '提示信息', null);
            return;
        }
    }
    if ($('#ddlorg').val() == "") {
        orgCode = "0";
    }


    var url = 'RemoteHandlers/ReportControl.ashx?'
        + 'reportType=' + GetQueryString("reportType")
        + '&type=' + chartType
        + '&startdate=' + getFormDate(GetQueryString("reportType"))
        + '&enddate=' + enddate
        + '&category=' + GetQueryString("category")
        + '&lineCode=' + lineCode
        + '&orgCode=' + orgCode
        + '&orgType=' + orgType
        + '&temp=' + Math.random();
    var json;
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        cache: true,
        success: function (result) {
            json = eval('(' + result + ')');
            //if ('summary' === chartType) {
            //    if (json.series[0].data.length > 8) {
            //        json.series[0].radius = '15%';
            //        json.series[0].center = ['50%', '90%'];
            //        var itemStyle = {
            //            normal: {
            //                labelLine: {
            //                    length: 0.001,
            //                },
            //            }
            //        };
            //        json.series[0].itemStyle = itemStyle;
            //    }
            //}
        }
    });
    return json;
};


function loadFlexiGrid() {
    var _h = ($(window).height() / 2) - 80 - 30 - 20;
    var PageNum = parseInt(_h / 25);

    var selecturl;
    if (GetQueryString("category") == "3C") {

        var cm = [
                { display: '设备编号', name: 'DETECT_DEVICE_CODE', width: 80, align: 'left', sortable: true },
                { display: '发生时间', name: 'RAISED_TIME', width: 130, align: 'left' },
                { display: '线路', name: 'LINE_NAME', width: 80, align: 'left' },
                { display: '区站', name: 'POSITION_NAME', width: 120, align: 'left' },
                { display: '行别', name: 'DIRECTION', width: 50, align: 'left' },
                { display: '公里标', name: 'KM_MARK', width: 60, align: 'left' },
                //{ display: '东经', name: 'GIS_X', width: 65, align: 'left', sortable: true },
                //{ display: '北纬', name: 'GIS_Y', width: 65, align: 'left' },
                { display: '速度km/h', name: 'NVALUE1', width: 50, align: 'left' },
                { display: '导高值mm', name: 'NVALUE2', width: 50, align: 'left' },
                { display: '拉出值mm', name: 'NVALUE3', width: 50, align: 'left' },
                { display: '最高温度℃', name: 'NVALUE4', width: 60, align: 'left' },
                { display: '环境温度℃', name: 'NVALUE5', width: 60, align: 'left' },
                { display: '级别', name: 'SEVERITY', width: 40, align: 'left' },
                { display: '类型', name: 'SUMMARY', width: 120, align: 'left' },
                { display: '状态', name: 'STATUS', width: 50, align: 'left' },
                { display: '主键', name: 'ID', width: 80, pk: true, hide: true, align: 'left' }
        ];
        if (getConfig('debug') == "1") { //内部版本
            cm.splice(6, 0, { display: '东经', name: 'GIS_X', width: 65, align: 'left', sortable: true });
            cm.splice(7, 0, { display: '北纬', name: 'GIS_Y', width: 65, align: 'left' });
        };

        option = {
            url: '',
            dataType: 'json',
            colModel: cm,
            width: 'auto',
            height: _h,
            nowrap: true,
            rowId: 'ID',
            showToggleBtn: true,
            sortable: true,
            onRowDblclick: rowDblclick, //双击事件
            rp: PageNum,
            rpOptions: [20, 50, 100, PageNum],
            onSuccess: function () {
                fullHide();
            }
        }
    } else {
        option = {
            url: '',
            dataType: 'json',
            colModel: [
                         { display: '线路', name: 'LINE_CODE', width: 80, align: 'left' },
                         { display: '位置信息', name: 'WZ', width: 250, align: 'left' },
                         { display: '发生时间', name: 'CREATED_TIME', width: 120, align: 'left' },
                         { display: '检修日期', name: 'JXTIME', width: 150, hide: true, align: 'left' },
                         { display: '检修人', name: 'JXR', width: 150, hide: true, align: 'left' },
                         { display: '摘要', name: 'SUMMARY', width: 480, align: 'left' },
                         { display: '缺陷类型', name: 'QXTYPE', width: 120, align: 'left' },
                         { display: '缺陷级别', name: 'SEVERITY', width: 50, align: 'left' },
                         { display: '状态', name: 'STATUS', width: 60, align: 'left' },
                         { display: '检测类型', name: 'CATEGORY_CODE', width: 50, align: 'left' },
                         { display: '工区', name: 'G_TSYS_ORG', width: 90, align: 'left' },
                         { display: '车间', name: 'G_CJ_ORG', width: 90, align: 'left' },
                         { display: '段', name: 'G_DUAN_ORG', width: 90, align: 'left' },
                         { display: '局', name: 'G_JU', width: 80, align: 'left' },
                         { display: '主键', name: 'ID', width: 80, pk: true, hide: true, align: 'left' }
                            ],
            width: 'auto',
            height: _h,
            nowrap: true,
            rowId: 'ID',
            showToggleBtn: true,
            sortable: true,
            rp: PageNum,
            rpOptions: [20, 50, 100, PageNum],
            onSuccess: function () {
                fullHide();
            }
        }
    }

};

function getFormDate(reportType) {
    switch (reportType) {
        case "day":
            return document.getElementById('daydate').value;
            break;
        case "week":
            return document.getElementById('startdate').value;
            break;
        case "month":
            return document.getElementById('monthdate').value;
            break;
        default:
            return "1900-01-01";
    }

}

function loadLineSelect() {
    var url = 'RemoteHandlers/ReportControl.ashx?type=line&temp=' + Math.random()
    var json;
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        cache: true,
        success: function (result) {
            json = result;
        }
    });
    document.getElementById("ddlxl").innerHTML = json;
};
//双击
function rowDblclick(rowData) {
    var id = rowData.ID;
    toAlarmDetails('3C',id);
};


