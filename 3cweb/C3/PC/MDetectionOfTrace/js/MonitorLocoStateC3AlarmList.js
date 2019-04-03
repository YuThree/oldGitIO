var option; //表格内容
function loadFlexiGrid() {
    if (marcar == '1') {
        option = {
            url: 'RemoteHandlers/GetLocoStateC3AlarmList.ashx?locid=' + GetQueryString("locid") + '&alarmtype=' + GetQueryString("alarmtype") + '&jl=' + GetQueryString("jl") + '&startdate=' + GetQueryString("startdate") + '&enddate=' + GetQueryString("enddate") + '&LINE_CODE=' + GetQueryString("LINE_CODE") + '&DIRECTION=' + GetQueryString("DIRECTION"),
            dataType: 'json',
            colModel: [
                         { display: '设备编号', name: 'LOCOMOTIVE_CODE', width: 100, sortable: false, align: 'center' },
                            { display: '发生时间', name: 'NOWDATE', width: 150, sortable: false, align: 'center' },
                            { display: '交路', name: 'JL', width: 40, sortable: false, align: 'center', hide: true },
                            { display: '运用区段', name: 'QD', width: 200, sortable: false, align: 'center', hide: true },
			                { display: '位置', name: 'wz', width: 300, sortable: false, align: 'left' },
                            { display: '最高温度℃', name: 'WD', width: 60, sortable: false, align: 'center' },
                            { display: '环境温度℃', name: 'HJWD', width: 60, sortable: false, align: 'center' },
                            { display: '报警级别', name: 'JB', width: 80, sortable: false, align: 'center' },
                            { display: '报警状态', name: 'ZT', width: 80, sortable: false, align: 'center' },
                            { display: '速度km/h', name: 'SD', width: 80, sortable: false, align: 'center' },
                            { display: '操作', name: 'CZ', width: 70, sortable: false, align: 'center' },
                            { display: '下载', name: 'XZ', width: 80, sortable: false, hide: true, align: 'center' },
                            { display: 'ID', name: 'ID', width: 80, sortable: false, pk: true, hide: true, align: 'center' }
                            ],

            width: 'auto',
            height: $(window).height() - 60,
            rowId: 'ID',
            //onRowDblclick: rowDblclick, //双击事件
            rp: 30
        }
    } else {
        option = {
            url: 'RemoteHandlers/GetLocoStateC3AlarmList.ashx?locid=' + GetQueryString("locid") + '&alarmtype=' + GetQueryString("alarmtype") + '&jl=' + GetQueryString("jl") + '&startdate=' + GetQueryString("startdate") + '&enddate=' + GetQueryString("enddate") + '&LINE_CODE=' + GetQueryString("LINE_CODE") + '&DIRECTION=' + GetQueryString("DIRECTION"),
            dataType: 'json',
            colModel: [
                         { display: '设备编号', name: 'LOCOMOTIVE_CODE', width: 100, sortable: false, align: 'center' },
                            { display: '发生时间', name: 'NOWDATE', width: 150, sortable: false, align: 'center' },
			                { display: '交路', name: 'JL', width: 40, sortable: false, align: 'center' },
                            { display: '运用区段', name: 'QD', width: 200, sortable: false, align: 'center' },
			                { display: '公里标', name: 'KM', width: 80, sortable: false, align: 'center' },
                            { display: '最高温度℃', name: 'WD', width: 60, sortable: false, align: 'center' },
                            { display: '环境温度℃', name: 'HJWD', width: 60, sortable: false, align: 'center' },
                            { display: '报警级别', name: 'JB', width: 80, sortable: false, align: 'center' },
                            { display: '报警状态', name: 'ZT', width: 80, sortable: false, align: 'center' },
                            { display: '速度km/h', name: 'SD', width: 80, sortable: false, align: 'center' },
                            { display: '操作', name: 'CZ', width: 70, sortable: false, align: 'center' },
                            { display: '下载', name: 'XZ', width: 80, sortable: false, hide: true, align: 'center' },
                            { display: 'ID', name: 'ID', width: 80, sortable: false, pk: true, hide: true, align: 'center' }
                            ],

            width: 'auto',
            height: $(window).height() - 60,
            rowId: 'ID',
            //onRowDblclick: rowDblclick, //双击事件
            rp: 30
        }
    }
    $("#flexTable").flexigrid(option);
};

//视频下载
function IRVXZ(rowData) {
    var newid = rowData.id.substr(1);
    var responseData = XmlHttpHelper.transmit(false, "get", "text", "RemoteHandlers/GetIRVUrlByAlarmID.ashx?alarmid=" + newid + "&tmpe=" + Math.random(), null, null);
    if (responseData != null && responseData != "") {
        showImg(responseData);
    }
};
//处理
function selectInfo(rowData) {
    var id = rowData.id.substr(1);  //rowData.属性名,源码中放进json的名;去掉前面的'C'
    ShowWinOpen("../MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=" + id + '&v=' + version);
};
