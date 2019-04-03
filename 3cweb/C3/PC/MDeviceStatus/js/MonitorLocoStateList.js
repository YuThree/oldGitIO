var debug = getConfig("debug");
var option; //存放表格内容


function loadFlexiGrid() {
    var startdate = document.getElementById('startdate').value; //时间
    var enddate = document.getElementById('enddate').value; //时间

    var _h = $(window).height() - 240;
    var _PageNum = parseInt(_h / 25) - 1;

    var cm;
    cm = [
                            { display: '设备编号', name: 'TRAIN_NO', width: 90, align: 'center' },
			                { display: '时间', name: 'DETECT_TIME', width: 120, align: 'center' },
                            { display: '位置', name: 'wz', width: 460, align: 'left' },
                            { display: '红外温度℃', name: 'IRV_TEMP', width: 110, align: 'center' },
                            { display: '环境温度℃', name: 'SENSOR_TEMP', width: 110, align: 'center' },
                            { display: '导高值mm', name: 'LINE_HEIGHT', width: 80, align: 'center' },
                            { display: '拉出值mm', name: 'PULLING_VALUE', width: 80, align: 'center' },
                            { display: '速度km/h', name: 'SPEED', width: 80, align: 'center' },
                            { display: '温度传感器的连接状态', name: 'SENSOR', width: 150, align: 'center' },
                            { display: '红外连接状态', name: 'CIR', width: 150, align: 'center' },
                            { display: '红外录像状态', name: 'RIR', width: 150, align: 'center' },
                            { display: '可见光连接状态', name: 'CVI', width: 150, align: 'center' },
                            { display: '可见光录像状态', name: 'RVI', width: 150, align: 'center' },
                            { display: '全景设备连接状态', name: 'IS_CONNECTED_OV', width: 150, align: 'center' },
                            { display: '全景设备录像状态', name: 'IS_RECORD_OV', width: 150, align: 'center' },
                            { display: '辅助相机连接状态', name: 'IS_CONNECTED_FZ', width: 150, align: 'center' },
                            { display: '辅助相机录像状态', name: 'IS_RECORD_FZ', width: 150, align: 'center' },
                            { display: '设备运行状态', name: 'TRAIN_STATUS', width: 80, align: 'center' },
                            { display: '东经', name: 'GIS_X', width: 80, align: 'center' },
                            { display: '北纬', name: 'GIS_Y', width: 80, align: 'center' },
                            { display: '卫星数量', name: 'SATELLITE_NUM', width: 80, align: 'center' },
                            { display: '弓状态', name: 'BOW_UPDOWN_STATUS', width: 100, align: 'center' }


                            ];
    option = {
        url: 'RemoteHandlers/GetLocoGJList.ashx?locid=&startdate=' + startdate + '&enddate=' + enddate,
        dataType: 'json',
        colModel: cm,
        width: 'auto',
        height: _h,
        rp: _PageNum,
        useRp: true,
        //  nowrap: true,
        rpOptions: [20, 50, 100, _PageNum]
    };
    $("#flexTable").flexigrid(option);
};
//弹出轨迹列表
function OpenLocusList(rowData) {
    ShowWinOpen("MonitorAlarmList.htm?locoid=" + rowData.id + "&v=" + version);
};
//行双击
function rowDblclick(rowData) {
    var id = rowData.id;  //rowData.属性名,源码中放进json的名
    var type = rowData.SOURCE;
    ShowWinOpen("MonitorDeviceForm.htm?id=" + id + "&v=" + version);
};
//弹出一类缺陷
function selectYLnumInfo(rowData) {
    ShowWinOpen("MonitorLocoStateC3AlarmList.htm?locid=" + $('div', rowData)[0].innerHTML + "&alarmtype=1&startdate=" + document.getElementById('startdate').value + "&enddate=" + document.getElementById('enddate').value + "&v=" + version);
};
//弹出二类缺陷
function selectELnumInfo(rowData) {
    ShowWinOpen("MonitorLocoStateC3AlarmList.htm?locid=" + $('div', rowData)[0].innerHTML + "&alarmtype=2&startdate=" + document.getElementById('startdate').value + "&enddate=" + document.getElementById('enddate').value + "&v=" + version);
};
//弹出三类缺陷
function selectSLnumInfo(rowData) {
    ShowWinOpen("MonitorLocoStateC3AlarmList.htm?locid=" + $('div', rowData)[0].innerHTML + "&alarmtype=3&startdate=" + document.getElementById('startdate').value + "&enddate=" + document.getElementById('enddate').value + "&v=" + version);
};
//弹出轨迹页面
function selectInfo(rowData) {
    //ShowWinOpen("MonitorLocoGJList.htm?locid=" + $('div', rowData)[0].innerHTML + "&startdate=" + document.getElementById('startdate').value + "&enddate=" + document.getElementById('enddate').value);
    if (getConfig('UseLogicTopo') == 'true') {
        ShowWinOpen("/Common/MTopo/OrbitTopo.htm?Category_Code=3C&deviceid=" + $('div', rowData)[0].innerHTML + "&startdate=" + $('div', rowData)[3].innerHTML + "&enddate=" + $('div', rowData)[4].innerHTML + "&v=" + version);
    } else {
        ShowWinOpen("/Common/MGIS/OrbitGIS.htm?Category_Code=3C&deviceid=" + $('div', rowData)[0].innerHTML + "&startdate=" + $('div', rowData)[3].innerHTML + "&enddate=" + $('div', rowData)[4].innerHTML + "&v=" + version);
    }
};
//弹出轨迹明细
function selectDetailInfo(rowData) {
    ShowWinOpen("MonitorLocoGJList.htm?locid=" + $('div', rowData)[0].innerHTML + "&startdate=" + document.getElementById('startdate').value + "&enddate=" + document.getElementById('enddate').value + "&v=" + version);
};

//执行查询
function doQuery() {
    var ju = document.getElementById('juselect').value; //局
    var jwd = document.getElementById('duanselect').value; //段; //机务段
    var loccode = document.getElementById('txtloccode').value; //设备编码
    var startdate = document.getElementById('startdate').value; //时间
    var enddate = document.getElementById('enddate').value; //时间
    var txtjl = document.getElementById('txtjl').value; //交路
    var txtqz = document.getElementById('txtqz').value; //区站
    var direction = document.getElementById('direction').value; //行别
    var startSpeed = document.getElementById('startSpeed').value; //最小速度
    var endSpeed = document.getElementById('endSpeed').value; //最大速度
    option.url = 'RemoteHandlers/GetLocoGJList.ashx?jl=' + escape(txtjl) + '&ju=' + escape(ju) + '&jwd=' + escape(jwd) + '&locid=' + loccode + '&startdate=' + startdate + '&enddate=' + enddate
    + '&txtqz=' + escape(txtqz) + '&direction=' + escape(direction) + '&startSpeed=' + startSpeed + '&endSpeed=' + endSpeed
    + '&temp=' + Math.random();
    option.newp = 1;

    var selectrp = $('select[name="rp"]').val();
    if (selectrp != undefined) {
        option.rp = parseInt(selectrp);
    }

    $("#flexTable").flexigrid(option);
    $("#flexTable").flexOptions(option).flexReload();
};
$(document).ready(function () {
    //弹出更多选择model

    $('#btn_openSearch').click(function () {
        $('#box_search').modal()
    });
    //查询
    $('#btn_search').click(function () {
        doQuery();
        $('#box_search').modal('toggle')
    });
    //清空查询条件
    $('#btn_reset').click(function () {

        ymPrompt.confirmInfo({
            message: '确认要清空查询条件?',
            handler: function (tp) {
                if (tp == 'ok') {

                    $('#search_bg input[type="text"]').val('');

                    $('#search_bg select').each(function () {

                        $(this).find('option:first').prop("selected", 'selected');

                    })

                }
                if (tp == 'cancel') {
                    //  cancelFn();
                }
                if (tp == 'close') {
                    //   closeFn()
                }
            }
        });

    });
});

//选择ju事件
function juChange(pcode) {
    loadOrgSelect(pcode, 'duan', null, 'ddlduan', null);
};
//选择DUAN事件
function duanChange(pcode) {
};

function importToExcel() {
    var url = "/Report/StatusToExcelReport.aspx?ju=" + $("#juselect").val() + "&duan=" + $("#duanselect").val() + "&trainno=" + $("#txtloccode").val() + "&routingno=" + $("#txtjl").val() + "&startdate=" + $("#startdate").val() + "&enddate=" + $("#enddate").val()
    + '&txtqz=' + escape($("#txtqz").val()) + '&direction=' + escape($("#direction").val()) + '&startSpeed=' + $("#startSpeed").val() + '&endSpeed=' + $("#endSpeed").val() + '&version=old' + "&_w=" + window.screen.width + "&_h=" + window.screen.height + "&temp=" + Math.random();
    window.open(url);
};



function loadFlexiGridFX() {
    var startdate = document.getElementById('startdate').value; //时间
    var enddate = document.getElementById('enddate').value; //时间



    var cm;
    cm = [
                            { display: '设备编号', name: 'TRAIN_NO', width: 80, align: 'center' },
			                { display: '时间', name: 'DETECT_TIME', width: 140, align: 'center' },
			                { display: '上报时间', name: 'RECV_TIME', width: 140, align: 'center' },
			                { display: '上报时差', name: 'FXSC', width: 140, align: 'center' },
                            { display: '位置', name: 'wz', width: 600, align: 'left' },
                            { display: '红外温度℃', name: 'IRV_TEMP', width: 140, align: 'center' },
                            { display: '环境温度℃', name: 'SENSOR_TEMP', width: 140, align: 'center' },
                            { display: '导高值mm', name: 'LINE_HEIGHT', width: 80, align: 'center' },
                            { display: '拉出值mm', name: 'PULLING_VALUE', width: 80, align: 'center' },
                            { display: '速度km/h', name: 'SPEED', width: 80, align: 'center' },
                            { display: '温度传感器的连接状态', name: 'SENSOR', width: 150, align: 'center' },
                            { display: '红外连接状态', name: 'CIR', width: 150, align: 'center' },
                            { display: '红外录像状态', name: 'RIR', width: 150, align: 'center' },
                            { display: '可见光连接状态', name: 'CVI', width: 150, align: 'center' },
                            { display: '可见光录像状态', name: 'RVI', width: 150, align: 'center' },
                            { display: '全景设备连接状态', name: 'IS_CONNECTED_OV', width: 150, align: 'center' },
                            { display: '全景设备录像状态', name: 'IS_RECORD_OV', width: 150, align: 'center' },
                            { display: '设备运行状态', name: 'TRAIN_STATUS', width: 80, align: 'center' },
                            { display: '东经', name: 'GIS_X', width: 80, align: 'center' },
                            { display: '北纬', name: 'GIS_Y', width: 80, align: 'center' },
                            { display: '卫星数量', name: 'SATELLITE_NUM', width: 80, align: 'center' }
            ];
    // }

    option = {
        url: 'RemoteHandlers/GetLocoGJList.ashx?locid=&startdate=' + startdate + '&enddate=' + enddate + "&_TYPE=FX",
        dataType: 'json',
        colModel: cm,
        width: 'auto',
        height: flexTableh + 40,
        rp: PageNum
    };
    $("#flexTable").flexigrid(option);
};


function OnclickPJSC() {
    json_data = getPJSC();
    document.getElementById('faultsc').innerHTML = json_data[0].fx + "小时,最大时差" + json_data[0].max + "小时";


    document.getElementById('modal-22256').click();



};

//获取树数据节点
function getPJSC() {
    var ju = document.getElementById('juselect').value; //局
    var jwd = document.getElementById('duanselect').value; //段; //机务段
    var loccode = document.getElementById('txtloccode').value; //设备编码
    var startdate = document.getElementById('startdate').value; //时间
    var enddate = document.getElementById('enddate').value; //时间
    var txtjl = document.getElementById('txtjl').value; //交路

    var url = 'RemoteHandlers/GetLocoGJListFXTJ.ashx?jl=' + escape(txtjl) + '&ju=' + escape(ju) + '&jwd=' + escape(jwd) + '&locid=' + loccode + '&startdate=' + startdate + '&enddate=' + enddate + '&temp=' + Math.random();
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