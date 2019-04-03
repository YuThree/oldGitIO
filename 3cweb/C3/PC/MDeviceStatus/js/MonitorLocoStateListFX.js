var debug = getConfig("debug")
var option; //存放表格内容

var _h = $(window).height() - 200 - 30;
var _PageNum = parseInt(($(window).height() - 200) / 25);


//执行查询
function doQuery() {
    var ju = $("#juselect").val(); //局
    var jwd = $("#duanselect").val(); //段; 
    var loccode = $("#txtloccode").val();  //设备编码
    var startdate = $("#startdate").val(); ; //时间
    var enddate = $("#enddate").val(); //时间
    //var txtjl = document.getElementById('txtjl').value; //交路
    option.url = 'RemoteHandlers/GetLocoGJList.ashx?ju=' + escape(ju) + '&jwd=' + escape(jwd) + '&locid=' + loccode + '&startdate=' + startdate + '&enddate=' + enddate + '&_TYPE=FX&temp=' + Math.random();
    option.newp = 1;
    var selectrp = $('select[name="rp"]').val();
    if (selectrp != undefined) {
        option.rp = parseInt(selectrp);
    }

    $("#flexTable").flexOptions(option).flexReload();
};

function importToExcel() {
    var url = "/Report/StatusToExcelReport.aspx?ju=" + $("#juselect").val() + "&duan=" + $("#duanselect").val() + "&trainno=" + $("#txtloccode").val() + "&startdate=" + $("#startdate").val() + "&enddate=" + $("#enddate").val() + "&_w=" + window.screen.width + "&_h=" + window.screen.height + "&temp=" + Math.random();
    window.open(url);
}



function loadFlexiGridFX() {
    var startdate = document.getElementById('startdate').value; //时间
    var enddate = document.getElementById('enddate').value; //时间
    var cm = [
            { display: '设备编号', name: 'TRAIN_NO', width: 80, align: 'center' },
			{ display: '时间', name: 'DETECT_TIME', width: 140, align: 'center' },
			{ display: '上报时间', name: 'RECV_TIME', width: 140, align: 'center' },
			{ display: '上报时差', name: 'FXSC', width: 140, align: 'center' },
            { display: '位置', name: 'wz', width: 200, align: 'left' },
            { display: '红外温度℃', name: 'IRV_TEMP', width: 140, align: 'center' },
            { display: '环境温度℃', name: 'SENSOR_TEMP', width: 140, align: 'center' },
            { display: '导高值mm', name: 'LINE_HEIGHT', width: 80, align: 'center' },
            { display: '拉出值mm', name: 'PULLING_VALUE', width: 80, align: 'center' },
            { display: '速度km/h', name: 'SPEED', width: 80, align: 'center' },
            { display: '温度传感器的连接状态', name: 'SENSOR', width: 150, align: 'center' },
            { display: '红外连接状态', name: 'CIR', width: 150, align: 'center' },
            { display: '可见光连接状态', name: 'CVI', width: 150, align: 'center' },
            { display: '红外录像状态', name: 'RIR', width: 150, align: 'center' },
            { display: '可见光录像状态', name: 'RVI', width: 150, align: 'center' },
            { display: '全景设备连接状态', name: 'IS_CONNECTED_OV', width: 150, align: 'center' },
            { display: '全景设备录像状态', name: 'IS_RECORD_OV', width: 150, align: 'center' },
            { display: '设备运行状态', name: 'TRAIN_STATUS', width: 80, align: 'center' },
            { display: '东经', name: 'GIS_X', width: 80, align: 'center' },
            { display: '北纬', name: 'GIS_Y', width: 80, align: 'center' },
            { display: '卫星数量', name: 'SATELLITE_NUM', width: 80, align: 'center' }
            ];

    option = {
        url: 'RemoteHandlers/GetLocoGJList.ashx?locid=&startdate=' + startdate + '&enddate=' + enddate + "&_TYPE=FX",
        dataType: 'json',
        colModel: cm,
        width: 'auto',
        height: _h,
        rp: _PageNum
    }
    $("#flexTable").flexigrid(option);
};

function OnclickPJSC() {
    json_data = getPJSC();
    $("#faultsc").html(json_data[0].fx + "小时,最大时差" + json_data[0].max + "小时");
    document.getElementById('modal-22256').click();
}

//获取树数据节点
function getPJSC() {
    var ju = document.getElementById('juselect').value; //局
    var jwd = document.getElementById('duanselect').value; //段; //机务段
    var loccode = document.getElementById('txtloccode').value; //设备编码
    var startdate = document.getElementById('startdate').value; //时间
    var enddate = document.getElementById('enddate').value; //时间
    var url = 'RemoteHandlers/GetLocoGJListFXTJ.ashx?ju=' + escape(ju) + '&jwd=' + escape(jwd) + '&locid=' + loccode + '&startdate=' + startdate + '&enddate=' + enddate + '&temp=' + Math.random();
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
