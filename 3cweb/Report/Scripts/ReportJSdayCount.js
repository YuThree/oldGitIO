
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
    $("#ddlLine").mySelect({
        tag: "Line",
        callback: function (rs) {
            //            $("#ddlLine").html(rs);
        }
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
            document.getElementById('title').innerText = "日报统计";
           

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
        var lineCode = $('#ddlLine').val();
        if ($('#ddlorg').val() == "") {
            orgCode = "0";
        }
        var url = 'CommonReportdayCount.aspx?startDate=' + getFormDate(GetQueryString("reportType"))
                                                                 + '&category=' + GetQueryString("category")
                                                                 + '&endDate=' + enddate
                                                                 + '&orgCode=' + orgCode
                                                                 + '&orgType=' + orgType
                                                                 + '&lineCode=' + lineCode
                                                                 + '&reportType=' + GetQueryString("reportType")
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
    var lineCode = $('#ddlLine').val();

    if (startdate != null && startdate != "" && enddate != null && enddate != "") {
        if (enddate < startdate) {
            ymPrompt.errorInfo('结束时间必须比开始时间大~！！', null, null, '提示信息', null);
            return;
        }
    }
    if ($('#ddlorg').val() == "") {
        orgCode = "0";
    }


    option.url = 'RemoteHandlers/ReportControldayCount.ashx?type=table&reportType=' + GetQueryString("reportType") + '&startdate=' + getFormDate(GetQueryString("reportType"))
                                                                                 + '&category=' + GetQueryString("category")
                                                                                 + '&enddate=' + enddate
                                                                                     + '&lineCode=' + lineCode
                                                                                     + '&orgCode=' + orgCode
                                                                                     + '&orgType=' + orgType
                                                                                 + '&temp=' + Math.random()

    option.newp = 1;
    $("#flexTable").flexigrid(option);
    $("#flexTable").flexOptions(option).flexReload();

    //    setTimeout('fullHide()', 3000);
    //    fullHide();
}

function Load_pic() {
    var severityChart = ECharts.init(document.getElementById('severityChart'), theme);
    var summaryChart = ECharts.init(document.getElementById('summaryChart'), theme);
    var statusChart = ECharts.init(document.getElementById('statusChart'), theme);
    var severityOption = GetChartOption("severity");
    var summaryOption = GetChartOption("summary");
    var statusOption = GetChartOption("status");

    severityChart.setOption(severityOption);
    summaryChart.setOption(summaryOption);
    statusChart.setOption(statusOption);

};

function GetChartOption(chartType) {

    var startdate = document.getElementById('startdate').value;
    var enddate = document.getElementById('enddate').value;
    var orgCode = $('#hf_ddlorg').val();
    var orgType = $('#hf_type_ddlorg').val();
    var lineCode = $('#ddlLine').val();

    if (startdate != null && startdate != "" && enddate != null && enddate != "") {
        if (enddate < startdate) {
            ymPrompt.errorInfo('结束时间必须比开始时间大~！！', null, null, '提示信息', null);
            return;
        }
    }
    if ($('#ddlorg').val() == "") {
        orgCode = "0";
    }


    var url = 'RemoteHandlers/ReportControldayCount.ashx?reportType=' + GetQueryString("reportType") + '&type=' + chartType + '&startdate=' + getFormDate(GetQueryString("reportType"))
                                                                            + '&category=' + GetQueryString("category")
                                                                             + '&enddate=' + enddate
                                                                                 + '&lineCode=' + lineCode
                                                                                 + '&orgCode=' + orgCode
                                                                                 + '&orgType=' + orgType
                                                                             + '&temp=' + Math.random()
    var json;
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        cache: true,
        success: function (result) {
            json = eval('(' + result + ')');
        }
    });
    return json;
};


function loadFlexiGrid() {
    var _h = ($(window).height() / 2) - 80 - 30;
    var PageNum = parseInt(_h / 25);

    var selecturl;
    if (GetQueryString("category") == "3C") {
        option = {
            url: '',
            dataType: 'json',
            colModel: [
                         { display: '设备编号', name: 'DETECT_DEVICE_CODE', width: 80, align: 'left', sortable: true },
                         { display: '处理时间', name: 'REPORT_DATE', width: 130, align: 'left' },
                         { display: '线路', name: 'LINE_NAME', width: 80, align: 'left' },
                         { display: '区站', name: 'POSITION_NAME', width: 120, align: 'left' },
                         { display: '公里标', name: 'KM_MARK', width: 60, align: 'left' },
                         { display: '东经', name: 'GIS_X', width: 65, align: 'left', sortable: true },
                         { display: '北纬', name: 'GIS_Y', width: 65, align: 'left' },
                         { display: '速度km/h', name: 'NVALUE1', width: 50, align: 'left' },
                         { display: '导高值mm', name: 'NVALUE2', width: 50, align: 'left' },
                         { display: '拉出值mm', name: 'NVALUE3', width: 50, align: 'left' },
                         { display: '最高温度℃', name: 'NVALUE4', width: 60, align: 'left' },
                         { display: '环境温度℃', name: 'NVALUE5', width: 60, align: 'left' },
                         { display: '级别', name: 'SEVERITY', width: 40, align: 'left' },
                         { display: '类型', name: 'SUMMARY', width: 120, align: 'left' },
                         { display: '状态', name: 'STATUS', width: 50, align: 'left' },
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
    var url = 'RemoteHandlers/ReportControldayCount.ashx?type=line&temp=' + Math.random()
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
}

