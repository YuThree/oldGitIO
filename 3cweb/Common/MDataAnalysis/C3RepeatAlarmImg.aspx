<%@ page language="C#" autoeventwireup="true" inherits="C3RepeatAlarmImg, App_Web_njzsyl54" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>重复报警分析对比</title>
    <script src="/Common/js/6cweb/LoadPubFile_base.js" type="text/javascript"></script>
    <script type="text/javascript">
        loadControl("layer");
        loadControl("flexigrid");
        loadControl("elevatezoom");
        loadControl("jqueryUI_2");
        loadControl("mySelectTree");
        loadControl("Echarts");
        loadJs("/Common/MDataAnalysis/js/RepeatAlarm.js?v=" + version);
        loadJs("/Common/MDataAnalysis/js/RepeatAlarmImg_new.js?v=" + version);
        loadCss("/Lib/scrollBar/scrollStyle.css?v=" + version);

    </script>
 
    <style>
        #loadingPage_bg
        {
            opacity: 0.95;
            background-color: Black;
        }
    </style>
    <link href="/Lib/bootstrap/css/opa-icons.css" rel="stylesheet" type="text/css" />
    <link href="/Common/MDataAnalysis/css/C3RepeatAlarmImg_new.css" rel="stylesheet" />
</head>
<body>
       <script>
 fullShow();
    </script>
    <div class="row-fluid">
        <div id="note" style="display: none;">
            <a href="#" style="color: White" onclick="upImg()" class="note_a2" title="上一张"><img src="/C3/PC/MAlarmMonitoring/ImgTmp/left.png" alt="上一张" /></a>
             <a href="#" style="color: White" onclick="dbImgShuffling()" class="note_a5" title="播放/暂停"><img src="/C3/PC/MAlarmMonitoring/ImgTmp/play.png" alt="播放/暂停" /></a>
            <a href="#" style="color: White" onclick="lastImg()" class="note_a3" title="下一张"><img src="/C3/PC/MAlarmMonitoring/ImgTmp/right.png" alt="下一张" /></a>
            <a href="#" style="color: White" onclick='GoToAlarmFrame()' class="note_a6" title="跳转到缺陷帧"><img src="/C3/PC/MAlarmMonitoring/ImgTmp/jump.png" alt="跳转到缺陷帧" /></a> 
            <a href="#" style="color: White" onclick="out()" class="note_a4" title="关闭"><img src="/C3/PC/MAlarmMonitoring/ImgTmp/close1.png" alt="关闭" /></a>
            <div id="slider"></div>
        </div>
        <div id="note1" style="display: none;">
            <a href="#" style="color: White" onclick="upImg1()" class="note_a2" title="上一张"><img src="/C3/PC/MAlarmMonitoring/ImgTmp/left.png" alt="上一张" /></a>
            <a href="#" style="color: White" onclick="dbImgShuffling1()" class="note_a5" title="播放/暂停"><img src="/C3/PC/MAlarmMonitoring/ImgTmp/play.png" alt="播放/暂停" /></a> 
            <a href="#" style="color: White" onclick="lastImg1()" class="note_a3" title="下一张"><img src="/C3/PC/MAlarmMonitoring/ImgTmp/right.png" alt="下一张" /></a>
            <a href="#" style="color: White" onclick='GoToAlarmFrame1()' class="note_a6" title="跳转到缺陷帧"><img src="/C3/PC/MAlarmMonitoring/ImgTmp/jump.png" alt="跳转到缺陷帧" /></a> 
            <a href="#" style="color: White" onclick="out1()" class="note_a4" title="关闭"><img src="/C3/PC/MAlarmMonitoring/ImgTmp/close1.png" alt="关闭" /></a>
            <div id="slider1"></div>
        </div>
        <div class="row-fluid">
            <div class="box-title">
                <h1>
                    重复报警情况说明</h1>
                <div class="row-fluid box-title-info">
                    <div class="span4">
                        <span class="box-title-color">线&nbsp;&nbsp;路:</span><span id="box-LINE_NAME"></span></div>
                    <div class="span4">
                        <span class="box-title-color">区&nbsp;&nbsp;站:</span><span id="box-POSITION_NAME"></span></div>
                    <div class="span4">
                        <span class="box-title-color">行&nbsp;&nbsp;别:</span><span id="box-DIRECTION"></span></div>
                    <div class='span3' style='display:none;'>
                        <span class='so_LT'>标签编码：</span><strong><span id='HideAlarmCode'></span></strong>
                    </div>
                    <%--<div class="span1 box-title-color">公里标</div><div class="span1" id="box-KM_MARK"></div>
                    <div class="span1 box-title-color">支&nbsp;&nbsp;柱</div><div class="span1" id="box-POLE"></div>--%>
                </div>
                <div class="row-fluid box-title-info">
                    <div class="span2 box-title-color" style="text-align: center;">
                        情况说明</div>
                    <div class="span10" id="repeatDetail">
                    </div>
                </div>
            </div>
            <div class="row-fluid box-title-loco">
                <div>
                    <div id="div_bottom">
                        <div style="width: 4%; float: left;">
                            &nbsp;
                        </div>
                        <div class="blk_18" style="float: left;">
                            <a href="#" onmouseup="ISL_StopUp_1()" onmouseout="ISL_StopUp_1()" onmousedown="ISL_GoUp_1()"
                                class='carousel-control1'>
                                <img src="/Common/img/repeatAlarm/repeat-left.jpg" alt="" /></a>
                            <div style="width: 200px; float: left;">
                            </div>
                            <div class="pcont" id="ISL_Cont_1" style="float: left;">
                                <div class="ScrCont">
                                    <div id="List1_1" runat="server">
                                        <!-- piclist end -->
                                    </div>
                                    <div id="List2_1">
                                    </div>
                                </div>
                            </div>
                            <a href="#" onmouseup="ISL_StopDown_1()" onmouseout="ISL_StopDown_1()" onmousedown="ISL_GoDown_1()"
                                class='carousel-control1 blk_18A'>
                                <img src="/Common/img/repeatAlarm/repeat-right.jpg" alt="" /></a>
                        </div>
                        <div style="width: 5px; height: 70px; background-color: #A7A7A7; float: left; margin-left: 80px;
                            margin-top: 10px;">
                        </div>
                        <div class="box-title-btn">
                            <a href="#" id="E_btnOk2" name="E_btnOk2">
                                <img src="/Common/img/repeatAlarm/repeat-sure.png" / id="mySUREimg"></a> <a href="#" id="btnImport">
                               <%--  <img src="/Common/img/repeatAlarm/repeat-sure.png" / id="mySUREimg1"></a> <a href="#" id="btnImport1">--%>
                                    <img src="/Common/img/repeatAlarm/repeat-daochu.png" /></a> <a href="#" id="E_btnCan2" name="E_btnCan2">
                                        <img src="/Common/img/repeatAlarm/repeat-cancel.png" alt="" /></a> <a href="#" id="edit_WZ" name="edit_WZ">
                                            <img src="/Common/img/repeatAlarm/repeat-alledia.png" alt="" /></a>
                        </div>
                        <div class="box-title-btn1">
                            <a href="#" id="E_btnOk3">
                                <img src="/Common/img/repeatAlarm/repeat-sure.png" / id="mySUREimg1"></a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="box-Content info-area">
                <h1>
                    报警信息对比</h1>
                <div style="width: 100%;">
                    <div class="box-Content-left">
                        <div class="box-Content-new">
                            <p>
                                最新报警信息</p>
                            <p id="box-new-loco">
                            </p>
                            <p id="box-new-time">
                            </p>
                        </div>
                    </div>
                    <div class="box-Content-mid">
                        <p class="box-Content-img">
                            <img src="/Common/img/repeatAlarm/repeat-icon-down.png" alt="" /></p>
                        <p>
                            精确位置</p>
                        <p>
                            发生日期</p>
                    </div>
                    <div class="box-Content-right">
                        <p>
                            重复报警信息</p>
                        <p id="box-new-loco1">
                        </p>
                        <p id="box-new-time1">
                        </p>
                      
                    </div>
                </div>
                <div style="clear: both;">
                </div>
            </div>
            <div class="box-playimg">
                <div class="box-playimg-left">
                    <p id="box-new-ch">
                    </p>
                    <p id="box-new-status">
                    </p>
                    <p id="box-new-bow">
                    </p>
                     <p id="box-new-lachu">
                    </p>
                     <p id="box-new-daoGAO">
                    </p>
                     <p id="box-new-wenDu"></p>
                     <p id="box-new-suDu"></p>
                      <p id="box-new-hjwenDu"></p>
                    <p id="box-new-armTYPE"></p>

                   
                   

                    <div class="item">
                        <img class="img-polaroid" src="#" id="ImgHW" onclick="dbImgShuffling1()" style="height: 250px"
                            runat="server" alt="" />
                        <div class="tab-pane active" id="panel-6653" style="background-color: rgba(19, 36, 127, 0.75);">
                            <div id="locInfo1">
                            </div>
                        </div>
                    </div>
                    <div class="item">
                        <img class="img-polaroid" src="#" id="ImgKJG" onclick="dbImgShuffling1()" style="height: 250px"
                            runat="server" alt="" />
                    </div>
                    <div class="item">
                        <img class="img-polaroid" src="/Common/img/暂无图片.png" id="Imgallimg" onclick="dbImgShuffling1()"
                            style="height: 250px" runat="server" alt="" />
                    </div>
                    <div class="item">
                        <div id="linechart1" style="height: 100%; width: 100%;">
                        </div>
                    </div>
                    <%--拉出值曲线--%>
                    <div class="item">
                        <div id="main1" style="height: 100%; width: 100%;">
                        </div>
                    </div>
                    <%--导高值曲线--%>
                    <div class="item">
                        <div id="main3" style="height: 100%; width: 100%;">
                        </div>
                    </div>

                  </div>
                     
                <div class="box-playimg-mid">
                    <p class="box-new-ch">
                        设备编号</p>
                    <p class="box-new-status">
                        报警类型</p>
                    <p class="box-new-bow">
                        弓位置</p>
                    <p class="box-new-lachu">
                        拉出值
                        </p>
                    <p class="box-new-daoGAO">
                        导高值
                        </p>
                    <p class="box-new-wenDu">
                        报警温度
                    </p>
                    <p class="box-new-suDu">速度</p>
                      <p class="box-new-hjwenDu">环境温度</p>
                     <p class="box-new-armTYPE">报警级别</p>
               
                    <div class="box-title-one">
                        <span>红<br />
                            外<br />
                            图<br />
                            像</span></div>
                    <div class="box-mid-title">
                        <span>可<br />
                            见<br />
                            光<br />
                            图<br />
                            像</span></div>
                    <div class="box-mid-title">
                        <span>全<br />
                            景<br />
                            图<br />
                            像</span></div>
                    <div class="box-mid-title">
                        <span>温<br/>度<br/>曲<br />
                            线<br />
                            图</span></div>
                    <div class="box-mid-title">
                        <span>拉<br />
                            出<br />
                            曲<br/>线</span></div>
                     
                   <div class="box-mid-title">
                        <span>导<br />
                            高<br />
                            曲<br/>线</span></div>
                    
                </div>
                <div class="box-playimg-right">
                    <p id="box-new-ch1">
                    </p>
                    <p id="box-new-status1">
                    </p>
                    <p id="box-new-bow1">
                    </p>
                    <p id="box-new-lachu1"></p>
                    <p id="box-new-daoGAO1"></p>
                    <p id="box-new-wenDu1"></p>
                    <p id="box-new-suDu1"></p>
                      <p id="box-new-hjwenDu1"></p>
                     <p id="box-new-armTYPE1"></p>
                    
                    <div class="item">
                        <img class="img-polaroid" src="#" id="hw" onclick="dbImgShuffling()" style="height: 250px"
                            runat="server" alt="" />
                        <div class="tab-pane active" id="panel-6652" style="background-color: rgba(19, 36, 127, 0.75);">
                            <div id="locInfo">
                            </div>
                        </div>
                    </div>
                    <div class="item">
                        <img class="img-polaroid" src="#" id="kjg" onclick="dbImgShuffling()" style="height: 250px"
                            runat="server" alt="" />
                    </div>
                    <div class="item">
                        <img class="img-polaroid" src="/Common/img/暂无图片.png" id="allimg" onclick="dbImgShuffling()"
                            style="height: 250px" runat="server" alt="" />
                    </div>
                    <div class="item">
                        <div id="linechart" style="height: 100%; width: 100%;">
                        </div>
                    </div>
                    <%--拉出值曲线--%>
                     <div class="item">
                        <div id="main" style="height: 100%; width: 100%;">
                        </div>
                     </div>
                    <%--导高值曲线--%>
                    <div class="item">
                        <div id="main2" style="height: 100%; width: 100%;">
                        </div>
                     </div>
                </div>
                <div style="clear: both;">
                </div>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        var ECharts;
        var myChart1;
        var myChart;
        // 路径配置
        require.config({
            paths: {
                'echarts': '/Lib/Echarts-2.0/2.0/echarts',
                'echarts/chart/line': '/Lib/Echarts-2.0/2.0/echarts'
            }
        });
        require(['echarts', 'echarts/chart/line'], function (ec) {
            ECharts = ec;
        });

        /**
         * @desc 最新报警温度图表
         * @param 
         */
        function loadC3Echarts1() {
            myChart1 = ECharts.init(document.getElementById('linechart1'));

            var str_X = '[';
            for (var i = 1; i <= JsonAlarm1.FRAME_INFO_LIST.length; i++) {
                if (i == 1) {
                    str_X += i;
                }
                else {
                    str_X += "," + i.toString();
                }
            }
            str_X += "]";
            var _XTitle = eval('(' + str_X + ')');  //申明横坐标

            var str_data = '[';
            var Y_min = 0;
            for (var i = 0; i < JsonAlarm1.FRAME_INFO_LIST.length; i++) {
                var temp_dx = parseFloat(JsonAlarm1.FRAME_INFO_LIST[i].TEMP_IRV.replace("℃", ""));
                if (temp_dx >= 0) {
                    Y_min = 0;
                } else {
                    if (temp_dx > Y_min) {
                        Y_min = Y_min;
                    } else {
                        Y_min = temp_dx;
                    }
                }
                if (i == 0) {
                    str_data += JsonAlarm1.FRAME_INFO_LIST[i].TEMP_IRV.replace("℃", "");
                }
                else {
                    str_data += "," + JsonAlarm1.FRAME_INFO_LIST[i].TEMP_IRV.replace("℃", "");
                }
            }
            str_data += ']';
            var _data = eval('(' + str_data + ')'); //申明数据

            var option = {
                tooltip: {
                    trigger: 'axis',
                    showDelay: 1,             // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
                    formatter: function (params) {
                        var res;
                        res = params[0][0] + ':' + params[0][2] + '℃';
                        return res;
                    }
                },
                grid: {
                    x: 80,
                    y: 30,
                    x2: 20,
                    y2: 30
                },
                xAxis: [{
                        type: 'category',
                        axisLabel: { show: true, textStyle: { color: '#fff'} },
                        boundaryGap: true,
                        axisTick: { onGap: false },
                        splitLine: { show: false },
                        data: _XTitle
                }],
                yAxis: [{
                        show: true,
                        type: 'value',
                        scale: true,
                        precision: 2,
                        min: Y_min,
                        boundaryGap: [0.05, 0.05],
                        axisLabel: {
                            textStyle: { color: '#fff' },
                            formatter: function (v) {
                                return v + '℃'
                            }
                        }
                }],
                series: [{
                        name: '接触点温度',
                        type: 'line',
                        showAllSymbol: true,
                        data: _data
                }]
            };
            myChart1.setOption(option);
            myChart1.on('click', function (params) { eConsole(params, 'latest_alarm') });
        }

        /**
         * @desc 重复报警温度图表
         * @param 
         */
        function loadC3Echarts() {
            myChart = ECharts.init(document.getElementById('linechart'));

            var str_X = '[';
            for (var i = 1; i <= JsonAlarm.FRAME_INFO_LIST.length; i++) {
                if (i == 1) {
                    str_X += i;
                }
                else {
                    str_X += "," + i.toString();
                }
            }
            str_X += "]";
            var _XTitle = eval('(' + str_X + ')');  //申明横坐标

            var str_data = '[';
            var Y_min = 0;
            for (var i = 0; i < JsonAlarm.FRAME_INFO_LIST.length; i++) {
                var temp_dx = parseFloat(JsonAlarm.FRAME_INFO_LIST[i].TEMP_IRV.replace("℃", ""));
                if (temp_dx >= 0) {
                    Y_min = 0;
                } else {
                    if (temp_dx > Y_min) {
                        Y_min = Y_min;
                    } else {
                        Y_min = temp_dx;
                    }
                }
                if (i == 0) {
                    str_data += JsonAlarm.FRAME_INFO_LIST[i].TEMP_IRV.replace("℃", "");
                }
                else {
                    str_data += "," + JsonAlarm.FRAME_INFO_LIST[i].TEMP_IRV.replace("℃", "");
                }
            }
            str_data += ']';
            var _data = eval('(' + str_data + ')'); //声明数据

            var option = {
                tooltip: {
                    trigger: 'axis',
                    showDelay: 1,             // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
                    formatter: function (params) {
                        var res;
                        res = params[0][0] + ':' + params[0][2] + '℃';
                        return res;
                    }
                },
                grid: {
                    x: 80,
                    y: 30,
                    x2: 20,
                    y2: 30
                },
                xAxis: [{
                    type: 'category',
                    axisLabel: { show: true, textStyle: { color: '#fff'} },
                    boundaryGap: true,
                    axisTick: { onGap: false },
                    splitLine: { show: false },
                    data: _XTitle
                }],
                yAxis: [{
                    show: true,
                    type: 'value',
                    scale: true,
                    precision: 2,
                    min: Y_min,
                    boundaryGap: [0.05, 0.05],
                    axisLabel: {
                        textStyle: { color: '#fff' },
                        formatter: function (v) {
                            return v + '℃'
                        }
                    }
                }],
                series: [{
                    name: '接触点温度',
                    type: 'line',
                    showAllSymbol: true,
                    data: _data
                }]
            };
            myChart.setOption(option);
            myChart.on('click', function (params) { eConsole(params, 'repeat_alarm') });
        }

        /**
         * @desc 最新报警拉出值图表
         * @param 
         */
        function load3cechartsmain1() {
            var myeChart = ECharts.init(document.getElementById('main1'));
            var str_X = '[';
            for (var i = 1; i <= JsonAlarm1.FRAME_INFO_LIST.length; i++) {
                if (JsonAlarm1.FRAME_INFO_LIST[i - 1].PULLING_VALUE.toString() == '' || JsonAlarm1.FRAME_INFO_LIST[i - 1].PULLING_VALUE == '-1000') {
                    continue;
                }
                if (str_X == '[') {
                    str_X += i;
                }
                else {
                    str_X += "," + i.toString();
                }
            }
            str_X += "]";
            var _XTitle = eval('(' + str_X + ')');  //申明横坐标

            var str_data = '[';
            for (var i = 0; i < JsonAlarm1.FRAME_INFO_LIST.length; i++) {
                if (JsonAlarm1.FRAME_INFO_LIST[i].PULLING_VALUE.toString() == '' || JsonAlarm1.FRAME_INFO_LIST[i].PULLING_VALUE == '-1000') {
                    continue;
                }
                if (str_data == '[') {
                    str_data += JsonAlarm1.FRAME_INFO_LIST[i].PULLING_VALUE.replace("mm", "");
                }
                else {
                    str_data += "," + JsonAlarm1.FRAME_INFO_LIST[i].PULLING_VALUE.replace("mm", "");
                }
            }
            str_data += ']';
            var _data = eval('(' + str_data + ')'); //声明数据
            
            var option = {
                tooltip: {
                    trigger: 'axis',
                    showDelay: 1,             // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
                    formatter: function (params) {
                        var res;
                        res = params[0][0] + ':' + params[0][2] + 'mm';
                        return res;
                    }
                },
                grid: {
                    x: 80,
                    y: 30,
                    x2: 20,
                    y2: 30
                },
                xAxis: [{
                    type: 'category',
                    axisLabel: { show: true, textStyle: { color: '#fff' } },
                    boundaryGap: true,
                    axisTick: { onGap: false },
                    splitLine: { show: false },
                    data: _XTitle
                }],
                yAxis: [{
                    show: true,
                    type: 'value',
                    scale: true,
                    axisLabel: {
                        textStyle: { color: '#fff' },
                        formatter: function (v) {
                            return v + 'mm'
                        }
                    }
                }],
                series: [{
                        name: '拉出值',
                        type: 'line',
                        showAllSymbol: true,
                        data: _data
                }]
            }
            myeChart.setOption(option);
            myeChart.on('click', function (params) { eConsole(params, 'latest_alarm') });
        }

        /**
         * @desc 重复报警拉出值图表
         * @param 
         */
        function load3cechartsmain() {
            var myceChart = ECharts.init(document.getElementById('main'));

            var str_X = '[';
            for (var i = 1; i <= JsonAlarm.FRAME_INFO_LIST.length; i++) {
                if (JsonAlarm.FRAME_INFO_LIST[i - 1].PULLING_VALUE.toString() == '' || JsonAlarm.FRAME_INFO_LIST[i - 1].PULLING_VALUE == '-1000') {
                    continue;
                }
                if (str_X == '[') {
                    str_X += i;
                }
                else {
                    str_X += "," + i.toString();
                }
            }
            str_X += "]";
            var _XTitle = eval('(' + str_X + ')');  //申明横坐标

            var str_data = '[';
            for (var i = 0; i < JsonAlarm.FRAME_INFO_LIST.length; i++) {

                if (JsonAlarm.FRAME_INFO_LIST[i].PULLING_VALUE.toString() == '' || JsonAlarm.FRAME_INFO_LIST[i].PULLING_VALUE == '-1000') {
                    continue;
                }

                if (str_data == '[') {
                    str_data += JsonAlarm.FRAME_INFO_LIST[i].PULLING_VALUE.replace("mm", "");
                }
                else {
                    str_data += "," + JsonAlarm.FRAME_INFO_LIST[i].PULLING_VALUE.replace("mm", "");
                }
            }
            str_data += ']';
            var _data = eval('(' + str_data + ')'); //声明数据

            var option = {
                tooltip: {
                    trigger: 'axis',
                    showDelay: 1,             // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
                    formatter: function (params) {
                        var res;
                        res = params[0][0] + ':' + params[0][2] + 'mm';
                        return res;
                    }
                },
                grid: {
                    x: 80,
                    y: 30,
                    x2: 20,
                    y2: 30
                },
                xAxis: [{
                    type: 'category',
                    axisLabel: { show: true, textStyle: { color: '#fff' } },
                    boundaryGap: true,
                    axisTick: { onGap: false },
                    splitLine: { show: false },
                    data: _XTitle
                }],
                yAxis: [{
                    show: true,
                    type: 'value',
                    scale: true,
                    axisLabel: {
                        textStyle: { color: '#fff' },
                        formatter: function (v) {
                            return v + 'mm'
                        }
                    }                     
                }],
                series: [{
                    name: '拉出值',
                    type: 'line',
                    showAllSymbol: true,
                    data: _data
                }]
            };
            myceChart.setOption(option);
            myceChart.on('click', function (params) { eConsole(params, 'repeat_alarm') });
        }

        /**
         * @desc 最新报警导高值图表
         * @param 
         */
        function load3cechartsmain3() {
            var myedChart = ECharts.init(document.getElementById('main3'));
            var str_X = '[';
            for (var i = 1; i <= JsonAlarm1.FRAME_INFO_LIST.length; i++) {
                if (JsonAlarm1.FRAME_INFO_LIST[i - 1].LINE_HEIGHT.toString() == '' || JsonAlarm1.FRAME_INFO_LIST[i - 1].LINE_HEIGHT == '-1000') {
                    continue;
                }
                if (str_X == '[') {
                    str_X += i;
                }
                else {
                    str_X += "," + i.toString();
                }
            }
            str_X += "]";
            var _XTitle = eval('(' + str_X + ')');  //申明横坐标

            var str_data = '[';
            for (var i = 0; i < JsonAlarm1.FRAME_INFO_LIST.length; i++) {
                if (JsonAlarm1.FRAME_INFO_LIST[i].LINE_HEIGHT.toString() == '' || JsonAlarm1.FRAME_INFO_LIST[i].LINE_HEIGHT == '-1000') {
                    continue;
                }
                if (str_data == '[') {
                    str_data += JsonAlarm1.FRAME_INFO_LIST[i].LINE_HEIGHT.replace("mm", "");
                }
                else {
                    str_data += "," + JsonAlarm1.FRAME_INFO_LIST[i].LINE_HEIGHT.replace("mm", "");
                }
            }
            str_data += ']';
            var _data = eval('(' + str_data + ')'); // 声明数据
            
            var option = {
                tooltip: {
                    trigger: 'axis',
                    showDelay: 1,             // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
                    formatter: function (params) {
                        var res;
                        res = params[0][0] + ':' + params[0][2] + 'mm';
                        return res;
                    }
                },
                grid: {
                    x: 80,
                    y: 30,
                    x2: 20,
                    y2: 30
                },
                xAxis: [{
                    type: 'category',
                    axisLabel: { show: true, textStyle: { color: '#fff' } },
                    boundaryGap: true,
                    axisTick: { onGap: false },
                    splitLine: { show: false },
                    data: _XTitle
                }],
                yAxis: [{
                    show: true,
                    type: 'value',
                    scale: true,
                    axisLabel: {
                        textStyle: { color: '#fff' },
                        formatter: function (v) {
                            return v + 'mm'
                        }
                    }
                }],
                series: [{
                    name: '导高值',
                    type: 'line',
                    showAllSymbol: true,
                    data: _data
                }]
            }
            myedChart.setOption(option);
            myedChart.on('click', function (params) { eConsole(params, 'latest_alarm') });
        }

        /**
         * @desc 重复报警导高值图表
         * @param 
         */
        function load3cechartsmain2() {
            var myeCharts = ECharts.init(document.getElementById('main2'));
            var str_X = '[';
            for (var i = 1; i <= JsonAlarm.FRAME_INFO_LIST.length; i++) {
                if (JsonAlarm.FRAME_INFO_LIST[i - 1].LINE_HEIGHT.toString() == '' || JsonAlarm.FRAME_INFO_LIST[i - 1].LINE_HEIGHT == '-1000') {
                    continue;
                }
                if (str_X == '[') {
                    str_X += i;
                }
                else {
                    str_X += "," + i.toString();
                }
            }
            str_X += "]";
            var _XTitle = eval('(' + str_X + ')');  //申明横坐标

            var str_data = '[';
            for (var i = 0; i < JsonAlarm.FRAME_INFO_LIST.length; i++) {
                if (JsonAlarm.FRAME_INFO_LIST[i].LINE_HEIGHT.toString() == '' || JsonAlarm.FRAME_INFO_LIST[i].LINE_HEIGHT == '-1000') {
                    continue;
                }
                if (str_data == '[') {
                    str_data += JsonAlarm.FRAME_INFO_LIST[i].LINE_HEIGHT.replace("mm", "");
                }
                else {
                    str_data += "," + JsonAlarm.FRAME_INFO_LIST[i].LINE_HEIGHT.replace("mm", "");
                }
            }
            str_data += ']';
            var _data = eval('(' + str_data + ')'); //声明数据
            
            var option = {
                tooltip: {
                    trigger: 'axis',
                    showDelay: 1,             // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
                    formatter: function (params) {
                        var res;
                        res = params[0][0] + ':' + params[0][2] + 'mm';
                        return res;
                    }
                },
                grid: {
                    x: 80,
                    y: 30,
                    x2: 20,
                    y2: 30
                },
                xAxis: [{
                    type: 'category',
                    axisLabel: { show: true, textStyle: { color: '#fff' }, },
                    boundaryGap: true,
                    axisTick: { onGap: false },
                    splitLine: { show: false },
                    data: _XTitle
                }],
                yAxis: [{
                    show: true,
                    type: 'value',
                    scale: true,
                    axisLabel: {        
                        textStyle: { color: '#fff' },
                        formatter: function (v) {
                            return v + 'mm'
                        }
                    }                    
                }],
                series: [{
                    name: '导高值',
                    type: 'line',
                    showAllSymbol: true,
                    data: _data
                }]
            }
            myeCharts.setOption(option);
            myeCharts.on('click', function (params) { eConsole(params, 'repeat_alarm') });
        }
        
    </script>
    <input id="alarmid" type="hidden" runat="server" />
    <input id="repeat_info" type="hidden" runat="server" />
    <a id="modal-check" href="#modal-container-check" data-toggle="modal" style="display: none;">
    </a>
    <!--弹出模态-->
    <div aria-hidden="true" id="modal-container-check" class="modal hide fade" role="dialog"
        aria-labelledby="myModalLabel" style="width: 660px;">
        <div class="modal-header">
            <h4 tyle="float: left;">
                请选择分析
            </h4>
        </div>
        <div id="modal-body" class="modal-body">
        </div>
        <div class="modal-footer">
            <button id="btnSure" class="btn btn-primary">
                确认
            </button>
            <button id="btncols" aria-hidden="true" class="btn btn-primary" data-dismiss="modal">
                关闭
            </button>
        </div>
    </div>
    <%-- 批量位置编辑模态框 --%>
    <div aria-hidden="true" id="edit_WZ_modal" class="modal fade" aria-labelledby="mymodalLabel"
        role="dialog" style="width: 800px;">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                        &times;</button>
                    <h4>
                        批量编辑位置</h4>
                </div>
                <div class="modal-body">
                    <table cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tr>
                            <td height="25" align="right">
                                线路名称：
                            </td>
                            <td height="25" align="left">
                                <select id="lineselect" name="lineselect" style="width: 220px;" onchange="lineChange(this.value,this.options[this.options.selectedIndex].text)">
                                </select>
                            </td>
                            <td height="25" align="right">
                                区、站名称：
                            </td>
                            <td height="25" align="left">
                                <select id="positionselect" name="positionselect" style="width: 220px;" onchange="positionChange(this.value,this.options[this.options.selectedIndex].text)">
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td height="25" align="right">
                                行别：
                            </td>
                            <td height="25" align="left">
                                <input type="text" id="POLE_DIRECTION" style="width: 210px;"/>
                            </td>
                            <td height="25" align="right">
                                桥隧名称：
                            </td>
                            <td height="25" align="left">
                                <select id="brgtunselect" name="brgtunselect" style="width: 220px;" onchange="brgtunChange(this.value,this.options[this.options.selectedIndex].text)">
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td height="25" align="right">
                                杆号：
                            </td>
                            <td height="25" align="left">
                                <input class="validate[custom[integer],min[0]]" type="text" id="POLE_NO" name="POLE_NO"
                                    style="width: 210px;" />
                            </td>
                            <td height="25" align="right">
                                所属公里标：
                            </td>
                            <td height="25" align="left">
                                <input class="validate[custom[integer]]" type="text" id="txt_km" name="txt_km" style="width: 210px;" />
                            </td>
                        </tr>
                    </table>
                    <div id="checkBox_repeat">
                        &nbsp;&nbsp;&nbsp;&nbsp;<input type="checkbox" id="cb_showRepeat" class="zrw" /><label
                            for="cb_showRepeat" style="display: inline;" class="zrw">
                            <h3 style="display: inline;">
                                选中报警列表
                            </h3>
                        </label>
                    </div>
                    <div id="box_repeat" class="zrw" style="display: none;">
                        <div id="repeat-body" style="height: 115px; margin: 10px 20px 0px 20px; overflow-y: scroll;
                            width: 98%;">
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">
                        关闭</button>
                    <button type="button" onclick="keepinfo()" class="btn btn-primary">
                        保存</button>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
<script src="/Common/MAlarmMonitoring/js/AlarmSureBox.js" type="text/javascript"></script>
<script type="text/javascript">
    LoadSureBox('REPEAT', GetQueryString("alarmid"), '');
    //SetAlarmID("REPEAT", GetQueryString("alarmid"));
</script>
