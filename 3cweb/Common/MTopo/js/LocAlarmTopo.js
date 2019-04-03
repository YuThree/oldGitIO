var option; //存放表格内容
//树样式信息
var setting = {
    data: {
        simpleData: {
            enable: true
        }
    }
};
//获取树数据节点
function getzNodes() {
    var url = "js/LocAlarmTree.ashx?type=tree";
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

var zNodes = getzNodes();
//加载树
function loadTree() {
    $.fn.zTree.init($("#treeLoco"), setting, zNodes);
    var treeObj = $.fn.zTree.getZTreeObj("treeLoco");
    //treeObj.expandAll(true);
};
//type ORG局LOCOMOTIVE车ALARM缺陷
function TreeClick(gisx, gisy, type, ID) {

    if (gisx != "0") {
        serchObgmoveTo(gisx, gisy, ID);
    }
}
function topofull() {
    document.getElementById('treediv').style.display = 'none';
    document.getElementById('topo').className = "box span11";
}

//绑定表格
function loadFlexiGrid() {
    if (marcar == '1') {
        option = {
            url: 'js/LocAlarmTree.ashx?type=list',
            dataType: 'json',
            colModel: [
                            { display: 'GISX', name: 'GISX', width: 80, sortable: false, align: 'center', hide: true },
                            { display: 'GISY', name: 'GISY', width: 80, sortable: false, align: 'center', hide: true },
                            { display: '设备编号', name: 'LOCOMOTIVE_CODE', width: 80, sortable: false, align: 'center' },
                            { display: '发生时间', name: 'NOWDATE', width: 140, sortable: false, align: 'center' },
                            { display: '位置信息', name: 'WZ', width: 140, sortable: false, align: 'center' },
			                { display: '公里标', name: 'KM', width: 80, sortable: false, align: 'center' },
                            { display: '地理位置', name: 'GIS', width: 150, sortable: false, align: 'center' },
                            { display: '弓位置', name: 'GWZ', width: 80, sortable: false, align: 'center' },
                            { display: '速度km/h', name: 'SD', width: 80, sortable: false, align: 'center' },
                            { display: '最高温度℃', name: 'WD', width: 60, sortable: false, align: 'center' },
                            { display: '环境温度℃', name: 'HJWD', width: 60, sortable: false, align: 'center' },
                            { display: '导高值mm', name: 'DGZ', width: 70, sortable: false, align: 'center' },
                            { display: '拉出值mm', name: 'LCZ', width: 70, sortable: false, align: 'center' },
                            { display: '报警级别', name: 'JB', width: 50, sortable: false, align: 'center' },
                            { display: '报警状态', name: 'ZT', width: 50, sortable: false, align: 'center' },
                            { display: '报警类型', name: 'QXZT', width: 150, sortable: false, align: 'center' },
                            { display: '报警分析', name: 'CZ', width: 80, sortable: false, align: 'center' },
                            { display: '下载', name: 'XZ', width: 80, sortable: false, hide: true, align: 'center' },
                            { display: 'ID', name: 'ID', width: 80, sortable: false, pk: true, hide: true, align: 'center' }
                            ],
            usepager: false,
            useRp: false,
            width: 'auto',
            rowId: 'ID',
            height: 'auto',
            onRowDblclick: rowDblclick, //双击事件
            onRowclick: rowclick,
            rp: 10
        }
    } else {
        option = {
            url: 'js/LocAlarmTree.ashx?type=list',
            dataType: 'json',
            colModel: [
                            { display: 'GISX', name: 'GISX', width: 80, sortable: false, align: 'center', hide: true },
                            { display: 'GISY', name: 'GISY', width: 80, sortable: false, align: 'center', hide: true },
                            { display: '设备编号', name: 'LOCOMOTIVE_CODE', width: 80, sortable: false, align: 'center' },
                            { display: '发生时间', name: 'NOWDATE', width: 140, sortable: false, align: 'center' },
                            { display: '位置信息', name: 'WZ', width: 140, sortable: false, align: 'center' },
			                { display: '公里标', name: 'KM', width: 80, sortable: false, align: 'center' },
                            { display: '地理位置', name: 'GIS', width: 150, sortable: false, align: 'center' },
                            { display: '弓位置', name: 'GWZ', width: 80, sortable: false, align: 'center' },
                            { display: '速度km/h', name: 'SD', width: 80, sortable: false, align: 'center' },
                            { display: '最高温度℃', name: 'WD', width: 60, sortable: false, align: 'center' },
                            { display: '环境温度℃', name: 'HJWD', width: 60, sortable: false, align: 'center' },
                            { display: '导高值mm', name: 'DGZ', width: 70, sortable: false, align: 'center' },
                            { display: '拉出值mm', name: 'LCZ', width: 70, sortable: false, align: 'center' },
                            { display: '报警级别', name: 'JB', width: 50, sortable: false, align: 'center' },
                            { display: '报警状态', name: 'ZT', width: 50, sortable: false, align: 'center' },
                            { display: '报警类型', name: 'QXZT', width: 150, sortable: false, align: 'center' },
                            { display: '报警分析', name: 'CZ', width: 80, sortable: false, align: 'center' },
                            { display: '下载', name: 'XZ', width: 80, sortable: false, hide: true, align: 'center' },
                            { display: 'ID', name: 'ID', width: 80, sortable: false, pk: true, hide: true, align: 'center' }
                            ],
            usepager: false,
            useRp: false,
            width: 'auto',
            rowId: 'ID',
            height: 'auto',
            onRowDblclick: rowDblclick, //双击事件
            onRowclick: rowclick,
            rp: 10

        }
    };
    $("#flexTable").flexigrid(option);
};

function load6CFlexiGrid() {
    var selecturl;
    selecturl = 'js/LocAlarmTree.ashx?type=6C';

    option = {
        url: selecturl,
        dataType: 'json',
        colModel: [
                            { display: 'GISX', name: 'GISX', width: 80, sortable: false, align: 'center', hide: true },
                            { display: 'GISY', name: 'GISY', width: 80, sortable: false, align: 'center', hide: true },
                         { display: '线路', name: 'LINE_CODE', width: 80, align: 'center' },
                         { display: '区站', name: 'POSITION_CODE', width: 100, align: 'center' },
                         { display: '公里标', name: 'KM_MARK', width: 80, align: 'center' },
                         { display: '杆号', name: 'POLE_NUMBER', width: 50, align: 'center' },
                         { display: '发生时间', name: 'CREATED_TIME', width: 150, align: 'center' },
                         { display: '级别', name: 'SEVERITY', width: 50, align: 'center' },
                         { display: '摘要', name: 'SUMMARY', width: 400, align: 'left' },
                            { display: '状态', name: 'STATUS', width: 80, align: 'center' },
                            { display: '局', name: 'G_JU', width: 80, align: 'center' },
                            { display: '段', name: 'G_DUAN_ORG', width: 80, align: 'center' },
			                { display: '车间', name: 'G_CJ_ORG', width: 100, align: 'center' },
			                { display: '工区', name: 'G_TSYS_ORG', width: 80, align: 'center' },
                            { display: '数据类型', name: 'CATEGORY_CODE', width: 50, align: 'center' },
                            { display: '主键', name: 'ID', width: 80, pk: true, hide: true, align: 'center' }
                            ],
        usepager: false,
        useRp: false,
        width: 'auto',
        rowId: 'ID',
        height: 'auto',
        onRowDblclick: rowDblclick6c, //双击事件
        onRowclick: rowclick,
        rp: 10
    }
    $("#flexTable").flexigrid(option);
};

function rowDblclick6c(rowData) {
    var id = rowData.ID.substr(1);  //rowData.属性名,源码中放进json的名;去掉前面的'C'
    var type = rowData.CATEGORY_CODE;
    if (type == "1C") {
        ShowWinOpen("../MAlarmMonitoring/MonitorAlarmC1Form.htm?alarmid=" + id + "&C3title=1" + "&rsurl=no");
    }
    else if (type == "2C") {
        ShowWinOpen("../MAlarmMonitoring/MonitorAlarmC2Form.htm?alarmid=" + id + "&C3title=1" + "&rsurl=no");
    }
    else if (type == "3C") {
        ShowWinOpen("../MAlarmMonitoring/MonitorAlarmC3Form.htm?alarmid=" + id + "&C3title=1" + "&rsurl=no");
    }
    else if (type == "4C") {
        ShowWinOpen("../MAlarmMonitoring/MonitorAlarmC4Form.htm?alarmid=" + id + "&C3title=1" + "&rsurl=no");
    }
    else if (type == "5C") {
        ShowWinOpen("../MAlarmMonitoring/MonitorAlarmC5Form.htm?alarmid=" + id + "&C3title=1" + "&rsurl=no");
    }
    else if (type == "6C") {
        ShowWinOpen("../MAlarmMonitoring/MonitorAlarmC6Form.htm?alarmid=" + id + "&C3title=1" + "&rsurl=no");
    }
    else if (type == "综合分析") {
        ShowWinOpen("../MAlarmMonitoring/MonitorAlarmAnalizedFormNew.htm?alarmid=" + id + "&rsurl=no");
    }
    else {
    }
};
function rowclick(rowData) {
    var GISX = rowData.GISX;
    var GISY = rowData.GISY;
    var ID = rowData.ID.substr(1);
    TreeClick(GISX, GISY, "", ID);
};

function rowDblclick(rowData) {
    var id = rowData.ID.substr(1);  //rowData.属性名,源码中放进json的名;去掉前面的'C'
    ShowWinOpen("../MAlarmMonitoring/MonitorAlarmC3FormNew.htm?alarmid=" + id + "&rsurl=no");
};
var map; var marker;
function ShowGis(rowData) {
    if (OnClickNumber == 1) {
        Bmaps(rowData.cells[0].innerText, rowData.cells[1].innerText);
    } else {
        map.setCenter(new BMap.Point(rowData.cells[0].innerText, rowData.cells[1].innerText));
        marker.setPosition(new BMap.Point(rowData.cells[0].innerText, rowData.cells[1].innerText));
    }
    document.getElementById('modal-22256').click();
};
var OnClickNumber = 1;
function Bmaps(GIS_X, GIS_Y) {
    OnClickNumber = OnClickNumber + 1;
    //var map = new BMap.Map("mapDiv", { mapType: BMAP_HYBRID_MAP }); // 创建Map实例
    map = new BMap.Map("mapDiv"); // 创建Map实例
    var point = new BMap.Point(GIS_X, GIS_Y);    // 创建点坐标
    map.clearOverlays();    //清除地图上所有覆盖物
    map.centerAndZoom(point, 9); // 初始化地图，设置中心点坐标和地图级别。

    map.enableScrollWheelZoom();
    map.enableKeyboard();
    map.disableDoubleClickZoom();

    var icon = new BMap.Icon("/Common/img/baojing.gif", new BMap.Size(20, 20));
    marker = new BMap.Marker(point, { icon: icon });
    map.addOverlay(marker);
    map.addControl(bmapUserTopOneRightInfo);
    map.addControl(new BMap.OverviewMapControl());
    map.addControl(new BMap.MapTypeControl({ anchor: BMAP_ANCHOR_TOP_LEFT }));    //左上角，默认地图控件
    map.setCurrentCity("武汉");   //由于有3D图，需要设置城市哦
    var cr = new BMap.CopyrightControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT });
    map.addControl(cr); //添加版权控件
    cr.addCopyright({ id: 1, content: "<a href='http://www.railwaytec.com'></a>" });

};
function bmapUserTopOneRightInfo() {
    // 设置默认停靠位置和偏移量
    this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
    this.defaultOffset = new BMap.Size(5, 5);

};

function oneAlarmurl(type) {
    window.location.href = "LocAlarmTopo.htm?TopoStyle=" + type + '&v=' + version;
}

function oneAlarmurl6C(type) {
    window.location.href = "6CLocAlarmTopo.htm?TopoStyle=" + type + '&v=' + version;
}