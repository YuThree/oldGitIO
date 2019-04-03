/*========================================================================================*
* 功能说明：通用一杆一档
* 注意事项：
* 作    者： zzj
* 版本日期：2014年11月28日
* 变更说明：
* 版 本 号： V1.0.0

页面参数    例子                说明
category    &category=2C        列表数据中统计不同的类型

*=======================================================================================*/
var category = "1C"; //设备类型。默认C1
var option; //表格内容
$(document).ready(function () {
    fullShow();
    $('#lineselect').mySelect({
        tag: 'LINE'
    });
    $('#txtPositionName').jHint({
        type: 'StationSection'
    });
    $('#_loctree').height($(window).height() - 50);
    $('#treeDevice').myTree({
        tag: 'BRIDGETUNE',
        onClick: function (event, treeId, treeNode) {
            switch (treeNode.treeType) {
                case "LINE":
                    $("#lineselect option[value='" + treeNode.id + "']").attr("selected", true);
                    break;
                case "POSITION":
                    $('#txtPositionName').val(treeNode.name);
                    break;
                case "BRIDGETUNE":
                    $('#txtBrgTunName').val(treeNode.name);
                    break;
            }
        }
    });


    loadFlexiGrid();
    doQuery();
    document.onkeydown = function (event) {
        e = event ? event : (window.event ? window.event : null);
        if (e.keyCode == 13) {
            //执行的方法  
            doQuery();
        }
    };
});
//线路改变查询区站
function lineChange(code) {
    $('#txtPositionName').jHint({
        type: 'StationSection',
        line: code
    });
}
//列表数据加载
function loadFlexiGrid() {
    var tempCategory = GetQueryString("category");
    if (tempCategory != null) {
        category = GetQueryString("category");
        $('#span_category').html(category);
    };
    var _colModel = [
        { display: '业务主键', name: 'POLE_CODE', width: 80, sortable: false, hide: true, align: 'center' },
        { display: '杆号', name: 'POLE_NO', width: 70, sortable: false, align: 'center' },
        { display: '线路', name: 'LINE_NAME', width: 80, sortable: false, align: 'center' },
        { display: '区/站', name: 'POSITION_NAME', width: 160, sortable: false, align: 'center' },
        { display: '桥梁、隧道', name: 'BRG_TUN_NAME', width: 100, sortable: false, align: 'center' },
        { display: '行别', name: 'POLE_DIRECTION', width: 50, sortable: false, align: 'center' },
        { display: '公里标', name: 'KMSTANDARD', width: 80, sortable: true, align: 'center' },
        { display: '工区', name: 'ORG_NAME', width: 130, sortable: false, align: 'center' },
        { display: '巡检数量', name: 'EVENT_COUNT', width: 80, sortable: true, align: 'center' },
        { display: '缺陷数量', name: 'ALARM_COUNT', width: 80, sortable: true, align: 'center' },
        { display: 'ID', name: 'ID', width: 80, pk: true, hide: true, sortable: false, align: 'center' }
    ];
    if ("3C" == category) {
        _colModel = [
        { display: '业务主键', name: 'POLE_CODE', width: 80, sortable: false, hide: true, align: 'center' },
        { display: '杆号', name: 'POLE_NO', width: 70, sortable: false, align: 'center' },
        { display: '线路', name: 'LINE_NAME', width: 80, sortable: false, align: 'center' },
        { display: '区/站', name: 'POSITION_NAME', width: 160, sortable: false, align: 'center' },
        { display: '桥梁、隧道', name: 'BRG_TUN_NAME', width: 100, sortable: false, align: 'center' },
        { display: '行别', name: 'POLE_DIRECTION', width: 50, sortable: false, align: 'center' },
        { display: '公里标', name: 'KMSTANDARD', width: 80, sortable: true, align: 'center' },
        { display: '工区', name: 'ORG_NAME', width: 130, sortable: false, align: 'center' },
        { display: '巡检数量', name: 'EVENT_COUNT', width: 80, hide: true, sortable: true, align: 'center' },
        { display: '缺陷数量', name: 'ALARM_COUNT', width: 80, sortable: true, align: 'center' },
        { display: 'ID', name: 'ID', width: 80, pk: true, hide: true, sortable: false, align: 'center' }
    ];
    }
    var selecturl = 'RemoteHandlers/DeviceList.ashx';
    option = {
        url: selecturl,
        dataType: 'json',
        colModel: _colModel,
        width: 'auto',
        rowId: 'ID',
        height: $(window).height() - 185,
        onRowDblclick: rowDblclick, //双击事件
        rp: parseInt(($(window).height() - 190) / 24),
        onSuccess: function () {
            fullHide();
        },
        onError: function () {
            fullHide();
        },
        onChangeSort: function (e) {
            doQuery();
            return true;
        }
    };
};
//行双击
function rowDblclick(rowData) {
    var deviceid = rowData.POLE_CODE; //设备编号
    var url = "/Common/RemoteHandlers/GetEvent.ashx?type=GetModel&category=" + category + "&deviceId=" + deviceid + '&temp=' + Math.random();
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        cache: false,
        success: function (result) {
            var json = eval('(' + result + ')');
            var eid = json.eventID;
            var harddiskID = json.harddiskID;
            if (eid != "") {
                switch (category) {
                    case "1C":
                        ShowWinOpen("/C1/PC/Device/DeviceForm.htm?eventId=" + eid + "&deviceId=" + deviceid + "&harddiskID=" + harddiskID + "&v=" + version);
                        break;
                    case "2C":
                        ShowWinOpen("/C2/PC/Device/DeviceForm.htm?eventId=" + eid + "&deviceId=" + deviceid + "&harddiskID=" + harddiskID + "&v=" + version);
                        break;
                    case "3C":
                        ShowWinOpen("/C3/PC/Device/DeviceForm.htm?alarmid=" + eid + "&deviceId=" + deviceid + "&v=" + version);
                        break;
                    case "4C":
                        ShowWinOpen("/C4/PC/Device/DeviceForm.htm?eventId=" + eid + "&deviceId=" + deviceid + "&harddiskID=" + harddiskID + "&v=" + version);
                        break;
                }

            }
            else {
                ymPrompt.errorInfo('该支柱不存在巡检信息', null, null, '提示信息', null);
            }


        }
    });
};
//弹出报警列表
function selectAlarmInfo(rowData) {
    var id = rowData.id.substr(1);
    document.getElementById('alarmInfo').src = "DeviceAlarmList.htm?deviceid=" + id + "&v=" + version;
    document.getElementById('modal-td').click();
};
//弹出缺陷列表
function selectFaultInfo(rowData) {
    var id = rowData.id.substr(1);
    document.getElementById('alarmInfo').src = "DeviceFluatList.htm?deviceid=" + id + "&v=" + version;
    document.getElementById('modal-td').click();
};
//查询事件
function doQuery() {
    var deviceCode = $('#txtdevicecode').val();
    var startKM = $('#txtstartkm').val();
    var lineCode = $('#lineselect').attr("value");
    var positionName = $('#txtPositionName').val();
    var brgTunName = $('#txtBrgTunName').val();
    var endKM = $('#txtendkm').val();
    var direction = $('#ddlDirection').val();

    option.url = 'RemoteHandlers/DeviceList.ashx?deviceCode=' + escape(deviceCode) + '&direction=' + direction
                                                                + '&startKM=' + escape(startKM) + '&endKM=' + escape(endKM)
                                                                + '&lineCode=' + escape(lineCode) + '&positionName=' + escape(positionName)
                                                                + '&brgTunName=' + escape(brgTunName)
                                                                + "&category=" + category
                                                                + '&temp=' + Math.random();
    option.newp = 1;
    $("#flexTable").flexigrid(option);
    $("#flexTable").flexOptions(option).flexReload();
};

