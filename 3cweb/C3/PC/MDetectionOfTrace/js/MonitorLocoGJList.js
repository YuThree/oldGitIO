
var option; //表格内容

function loadFlexiGrid() {
    if (marcar == '1') {
        option = {
            url: 'RemoteHandlers/GetLocoGJList.ashx?locid=' + GetQueryString("locid") + '&startdate=' + GetQueryString("startdate") + '&enddate=' + GetQueryString("enddate") + '&jl=' + GetQueryString("jl") + '&LINE_CODE=' + GetQueryString("LINE_CODE") + '&DIRECTION=' + GetQueryString("DIRECTION"),
            dataType: 'json',
            colModel: [
                            { display: '设备编号', name: 'TRAIN_NO', width: 80, align: 'center' },
			                { display: '时间', name: 'DETECT_TIME', width: 140, align: 'center' },
                            { display: '位置', name: 'wz', width: 200, align: 'left' },
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
                            { display: '辅助相机连接状态', name: 'IS_CONNECTED_FZ', hide: true, width: 150, align: 'center' },
                            { display: '辅助相机录像状态', name: 'IS_RECORD_FZ', hide: true, width: 150, align: 'center' },
                            { display: '设备运行状态', name: 'TRAIN_STATUS', width: 80, align: 'center' },
                            { display: '东经', name: 'GIS_X', width: 80, align: 'center' },
                            { display: '北纬', name: 'GIS_Y', width: 80, align: 'center' },
                            { display: '卫星数量', name: 'SATELLITE_NUM', width: 80, align: 'center' }
            ],
            width: 'auto',
            height: $(window).height() - 60,
            rp: 30
        };
    } else {
        option = {
            url: 'RemoteHandlers/GetLocoGJList.ashx?locid=' + GetQueryString("locid") + '&startdate=' + GetQueryString("startdate") + '&enddate=' + GetQueryString("enddate"),
            dataType: 'json',
            colModel: [
                            { display: '设备编号', name: 'TRAIN_NO', width: 80, align: 'center' },
			                { display: '时间', name: 'DETECT_TIME', width: 140, align: 'center' },
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
                            { display: '辅助相机连接状态', name: 'IS_CONNECTED_FZ', hide: true, width: 150, align: 'center' },
                            { display: '辅助相机录像状态', name: 'IS_RECORD_FZ', hide: true, width: 150, align: 'center' },
                            { display: '设备运行状态', name: 'TRAIN_STATUS', width: 80, align: 'center' },
                            { display: '东经', name: 'GIS_X', width: 80, align: 'center' },
                            { display: '北纬', name: 'GIS_Y', width: 80, align: 'center' },
                            { display: '卫星数量', name: 'SATELLITE_NUM', width: 80, align: 'center' }
            ],
            width: 'auto',
            height: $(window).height() - 60,
            rp: 30
        };
    }
    $("#flexTable").flexigrid(option);
};

//导出方法
function tableToexcel() {
    AllAreaExcel('flexTable');
};