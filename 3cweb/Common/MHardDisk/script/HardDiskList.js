var option;
var category = GetQueryString("category");

$(document).ready(function () {

    fullShow();
    switch (category) {
        case "1C":
            $('#listTitle').html("弓网综合检测数据");
            break;
        case "2C":
            $('#listTitle').html("接触网安全巡检检测数据");
            break;
        case "4C":
            $('#listTitle').html("接触网悬挂状态检测数据");
            break;
    }
    $('.lightbox').lightbox();
    $('#_loctree').height($(window).height() - 70);
    $('#lineTree').myTree({
        tag: 'LINE',
        onClick: function (event, treeId, treeNode) {
            $('#LineName').attr(treeNode.name);
        }
    });

    loadFlexiGrid();
});



///页面列表数据加载
function loadFlexiGrid() {


    var startTime = escape(document.getElementById("startTime").value);
    var endTime = escape(document.getElementById("endTime").value);
    var lineName = escape(document.getElementById("LineName").value);

    option = {
        url: 'RemoteHandlers/HardDiskHandler.ashx?type=loadList&category=' + category + '&startTime=' + startTime + '&endTime=' + endTime + '&lineName=' + lineName + '&temp=' + Math.random(),
        dataType: 'json',
        colModel: [
            { display: '巡检开始日期', name: 'startTime', width: 120, sortable: false, align: 'center' },
            { display: '巡检结束日期', name: 'endTime', width: 120, sortable: false, align: 'center' },
            { display: '线路', name: 'lineName', width: 60, sortable: false, align: 'center' },
            { display: '线路Code', name: 'Line_code', width: 100, sortable: false, align: 'center', hide: true },
            { display: '行别', name: 'direction', width: 25, sortable: false, align: 'center' },
            { display: '起始公里标', name: 'startKm', width: 60, sortable: false, align: 'center' },
            { display: '终止公里标', name: 'endKm', width: 60, sortable: false, align: 'center' },
            { display: '起始站点', name: 'START_STATION', width: 100, sortable: false, align: 'center' },
            { display: '终止站点', name: 'END_STATION', width: 100, sortable: false, align: 'center' },
            { display: '线路CODE', name: 'LINE_CODE', hide: true, width: 120, sortable: false, align: 'center' },
            { display: '线路主键', name: 'MIS_LINE_ID', width: 170, hide: true, sortable: false, align: 'center' },
            { display: '视频路径', name: 'VIDEO_PATH', width: 170, hide: true, sortable: false, align: 'center' },
            { display: '缺陷数', name: 'alarmN', width: 80, sortable: false, align: 'center' },
            { display: '操作', name: 'CZ', width: 250, sortable: false, align: 'center' },
            { display: 'ID', name: 'ID', width: 80, pk: true, hide: true, sortable: false, align: 'center' }



        ],
        usepager: true,
        pagestat: '显示第 {from} 条到 {to} 条,共 {total} 条数据', // 显示当前页和总页面的样式
        procmsg: '正在处理,请稍候 ...', // 正在处理的提示信息
        nomsg: '没有数据存在!', // 无结果的提示信息
        pagetext: '当前第',
        outof: '页，总页数',
        findtext: '条件查询：',
        useRp: true,
        checkbox: false, // 是否要多选框
        rowId: 'ID', // 多选框绑定行的id
        rp: 15,
        showTableToggleBtn: true,
        // onRowDblclick: rowDblclick, //双击事件
        onSuccess: fullHide, //数据加载成功事件,
        onError: fullHide,
        preProcess: function (e) {
            fullHide();

            return e;
        },
        width: 'auto',
        height: $(window).height() - 206,
        title: false, //是否包含标题 
        resizable: false, //是否可伸缩 
        striped: true //是否显示斑纹效果，默认是奇偶交互的形式
    };
    $("#flexTable").flexigrid(option);
}

//行双击
function rowDblclick(rowData) {

    var url = "";
    switch (category) {
        case "1C":
            url = "/Common/MHardDisk/HardDiskForm.htm?categoryCode=1C&id=" + rowData.ID + '&v=' + version;
            break;
        case "2C":
            url = "/Common/MHardDisk/HardDiskForm.htm?categoryCode=2C&id=" + rowData.ID + '&v=' + version;
            break;
        case "4C":
            url = "/Common/MHardDisk/HardDiskForm.htm?categoryCode=4C&id=" + rowData.ID + '&v=' + version;
            break;
    }


    $("#tanchu").attr("href", url + "&lightbox[iframe]=true&lightbox[width]=90p&lightbox[height]=80p");
    $("#tanchu").click();

}

//查询
function doQuery() {
    loadFlexiGrid();
    $("#flexTable").flexOptions(option).flexReload();
}
//新增
function addC1HardDisk() {
    document.getElementById('Iframe1').src = "HardDiskForm.htm";
    document.getElementById('modal-xz').click();
}
//查看综合分析
function openC1HardDiskManage(rowData) {
    window.open("/C1/PC/Event/C1Event.htm?id=" + rowData.id + "&Line_code=" + $('div', rowData)[3].innerHTML + "&XB=" + escape($('div', rowData)[4].innerHTML) + '&v=' + version, "_blank");
}

//查看原始数据
function openC1EventList(rowData) {
    window.open("/C1/PC/Event/C1EventLists.htm?id=" + rowData.id + '&v=' + version, "_blank");
}


//查看报警数据
function openC1FaultList(rowData) {
    window.open("/Common/MAlarmMonitoring/MonitorAlarmList.htm?category=1C&data_type=ALARM&Harddisk_Manage_ID=" + rowData.id + '&v=' + version, "_blank");
}

function openC4Event(rowData) {
    window.open("/C4/PC/Event/C4Event.htm?id=" + rowData.id + '&v=' + version, "_blank");
}

function openC2Event(rowData) {
    window.open("/C2/PC/Event/C2Event_New.htm?id=" + rowData.id + '&v=' + version, "_blank");
}


function openMap(LineCode, DIRECTION, id, CateGory,st,et) {

    //var url = '/Common/MGIS/EventAlarm.htm?LineCode=' + LineCode + "&XB=" + escape(DIRECTION) + "&id=" + id + "&CateGory=" + escape(CateGory) + '&v=' + version;
    var url = "/Common/MAlarmMonitoring/MonitorAlarmList.htm?category=" + escape(CateGory) + "&data_type=FAULT&Harddisk_Manage_ID=" + id + "&frominspectionList=true" + "&dllzt=" + "&startdate=" + st + ' 00:00:00' + "&enddate=" + et + ' 23:59:59' + '&v=' + version;

    window.open(url, "_blank");
}


function delete_Data(ID) {
    var Url = '/Common/MHardDisk/RemoteHandlers/HardDiskHandler.ashx?type=deletedata&HARDDISK_MANAGE_ID=' + ID.id + '&DATA_TYPE=' + category;
    $.ajax({
        type: 'POST',
        url: Url,
        async: true,
        cache: false,
        success: function (data) {
            if (data.re == "True") {
                layer.msg('删除数据成功！');
                doQuery();
            } else {
                layer.msg('删除数据失败，请重试！');
            }
        },
        error: function (re) {

        }
    })
};