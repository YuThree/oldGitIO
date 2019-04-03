<%@ page language="C#" autoeventwireup="true" inherits="C3RepeatAlarmImg_old, App_Web_njzsyl54" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title></title>
    <script src="/Common/js/6cweb/LoadPubFile_base.js" type="text/javascript"></script>
    <script>
        loadControl("flexigrid");
        loadControl("elevatezoom");
        loadControl("mySelectTree");
        loadControl("Echarts");
        //        loadControl("kendo");
        loadJs("/Common/MDataAnalysis/js/RepeatAlarm.js?v=" + version);
        loadJs("/Common/MDataAnalysis/js/RepeatAlarmImg.js?v=" + version);
    </script>
    <link href="/Lib/bootstrap/css/opa-icons.css" rel="stylesheet" type="text/css" />
    <style type="text/css">
        #note
        {
            position: absolute;
            width: 173px;
            padding: 10px;
            background: url(/C3/PC/MAlarmMonitoring/ImgTmp/cfbjbg.png) no-repeat;
            /*border: 1px solid #ccc;*/
            left: 43%;
            top: 30%;
            z-index: 9999;
            display: none;
            filter: alpha(Opacity=60);
            -moz-opacity: 0.6;
            opacity: 0.6;
            opacity: 1.0;
            height:43px;
            line-height:40px;
        }
        #note a,#note1 a{
            display:inline-block;
        }
        .carousel-control1
        {
            position: absolute;
            left: 10px;
            width: 40px;
            height: 40px;
            margin-top: -20px;
            font-size: 60px;
            font-weight: 100;
            line-height: 30px;
            color: #ffffff;
            text-align: center;
            background: #222222;
            border: 3px solid #ffffff;
            -webkit-border-radius: 23px;
            -moz-border-radius: 23px;
            border-radius: 23px;
            opacity: 0.5;
            filter: alpha(opacity=50);
        }
        
        #note1
        {
            position: absolute;
            width: 173px;
            padding: 10px;
            background: url(/C3/PC/MAlarmMonitoring/ImgTmp/cfbjbg.png) no-repeat;
            /*border: 1px solid #ccc;*/
            left: 43%;
            top: 50%;
            z-index: 9999;
            display: none;
            filter: alpha(Opacity=60);
            -moz-opacity: 0.6;
            opacity: 1.0;
            height:43px;
            line-height:40px;
        }
        
        .box-header-Repeat
        {
            border: none;
            padding-top: 5px;
            border-bottom: 1px solid #DEDEDE;
            border-radius: 3px 3px 0 0;
            -webkit-border-radius: 3px 3px 0 0;
            -moz-border-radius: 3px 3px 0 0;
            height: 12px;
            min-height: 12px;
            margin-bottom: 0;
            font-weight: bold;
            font-size: 16px;
            background: -moz-linear-gradient(top, rgba(255,255,255,0) 0%, rgba(0,0,0,0.1) 100%);
            background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(255,255,255,0)), color-stop(100%,rgba(0,0,0,0.1)));
            background: -webkit-linear-gradient(top, rgba(255,255,255,0) 0%,rgba(0,0,0,0.1) 100%);
            background: -o-linear-gradient(top, rgba(255,255,255,0) 0%,rgba(0,0,0,0.1) 100%);
            background: -ms-linear-gradient(top, rgba(255,255,255,0) 0%,rgba(0,0,0,0.1) 100%);
            background: linear-gradient(to bottom, rgba(255,255,255,0) 0%,rgba(0,0,0,0.1) 100%);
            filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00ffffff', endColorstr='#1a000000',GradientType=0 );
            min-height: 20px;
            padding: 5px 5px 10px 10px;
            margin-bottom: 5px;
            background-color: #f5f5f5;
            border: 1px solid #eee;
            border: 1px solid rgba(0, 0, 0, 0.05);
            -webkit-border-radius: 4px;
            -moz-border-radius: 4px;
            border-radius: 4px;
            -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);
            -moz-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);
            box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);
        }
        
        .box-header-Repeat h2
        {
            font-size: 15px;
            width: auto;
            clear: none;
            float: left;
            line-height: 25px;
            white-space: nowrap;
        }
        
        .blk_18
        {
            overflow: hidden;
            zoom: 1;
            font-size: 9pt;
            border: 1px solid #e3e3e3;
            background: #eee;
            width: 92%;
            margin-top: 1px;
        }
        
        .blk_18 .pcont
        {
            width: 100%;
            float: left;
            overflow: hidden;
            padding-left: 5px;
        }
        
        .blk_18 .ScrCont
        {
            width: 32766px;
            zoom: 1;
            margin-left: -5px;
        }
        
        .blk_18 #List1_1, .blk_18 #List2_1
        {
            float: left;
        }
        
        .blk_18 .pl img
        {
            display: block;
            cursor: pointer;
            border: none;
            margin: 6px auto 1px auto;
        }
        
        .blk_18 .pl
        {
            width: 105px;
            border: 1px solid #f3f3f3;
            float: left;
            float: left;
            text-align: center;
            line-height: 24px;
        }
        
        .blk_18 a.pl:hover
        {
            border: 1px solid #5dacec;
            color: #5dacec;
            background: #fff;
        }
        
        .blk_18 a.carousel-control1:hover
        {
            color: #ffffff;
            text-decoration: none;
            opacity: 0.9;
            filter: alpha(opacity=90);
        }
        .tabs-below > .nav-tabs > .active > a, .tabs-below > .nav-tabs > .active > a:hover
        {
            border-color: transparent #ddd #ddd #ddd;
            background-color: rgba(175, 188, 253, 0.75);
            color: black;
        }
        .nav > li > a:hover
        {
            background-color: rgba(255,255,255,0);
        }
        .theNew
        {
            background-color: rgba(19, 36, 127, 0.75);
        }
        .theNew a
        {
            color: White;
        }
        .theNew > li > a:hover
        {
            background-color: rgba(175, 188, 253, 0.75);
        }
        .theHist
        {
        }
        .theHist a
        {
        }
        .new
        {
            width: 36px;
            height: 36px;
            background: url(/Common/img/new.png);
            background-size: 36px 36px;
            background-repeat: no-repeat;
            transform: rotate(90deg);
            position: absolute;
            z-index: 99;
            right: 0;
        }
        .imgshareing
        {
            -webkit-animation: twinkling 2s infinite ease-in-out;
            width: 32px;
            height: 25px;
            display: inline-block;
            cursor: pointer;
            position: absolute;
            left: 0;
            top: 7px;
        }
        p#locInfo1
        {
            position: relative;
            left: 20px;
            top: 3px;
        }
        p#locInfo
        {
            position: relative;
            left: 20px;
            top: 3px;
        }
        .note_a1{
            margin-left:5px;
        }
        .note_a2,.note_a3,.note_a4{
            margin-left:10px;
        }
    </style>
</head>
<body>
    <div class="row-fluid">
        <div id="note" style="display: none;">
            <a href="#" style="color: White" onclick="lookWD()" class="note_a1" title="查看温度趋势图">
                <img src="/C3/PC/MAlarmMonitoring/ImgTmp/check.png" alt="查看温度趋势图" /></a>
            <a href="#" style="color: White" onclick="upImg()" class="note_a2" title="上一张">
                <img src="/C3/PC/MAlarmMonitoring/ImgTmp/left.png" alt="上一张" /></a>
            <a href="#" style="color: White" onclick="lastImg()" class="note_a3" title="下一张">
                <img src="/C3/PC/MAlarmMonitoring/ImgTmp/right.png" alt="下一张" /></a>
            <a href="#" style="color: White" onclick="out()" class="note_a4" title="关闭">
                <img src="/C3/PC/MAlarmMonitoring/ImgTmp/close1.png" alt="关闭" /></a>
        </div>
        <div id="note1" style="display: none;">
            <a href="#" style="color: White" onclick="lookWD1()" class="note_a1" title="查看温度趋势图">
                <img src="/C3/PC/MAlarmMonitoring/ImgTmp/check.png" alt="查看温度趋势图" /></a>
            <a href="#" style="color: White" onclick="upImg1()" class="note_a2" title="上一张">
                <img src="/C3/PC/MAlarmMonitoring/ImgTmp/left.png" alt="上一张" /></a>
            <a href="#" style="color: White" onclick="lastImg1()" class="note_a3" title="下一张">
                <img src="/C3/PC/MAlarmMonitoring/ImgTmp/right.png" alt="下一张" /></a>
            <a href="#" style="color: White" onclick="out1()" class="note_a4" title="关闭">
                <img src="/C3/PC/MAlarmMonitoring/ImgTmp/close1.png" alt="关闭" /></a>
        </div>
        <div class="row-fluid">
            <div class="box-header-Repeat">
                <h2>
                    重复报警情况说明</h2>
                <a id="btnClose" href="javascript:window.close();" style="float: right;" class="btn btn-close btn-round">
                    <i class="icon-remove"></i></a>
            </div>
            <div style="padding: 5px;">
                <div style="height: 20px;">
                    <div style="float: left;">
                        <p>
                            <font size="3"><span id="repeatDetail" runat="server"></span></font>
                        </p>
                    </div>
                </div>
            </div>
            <div class="box-header-Repeat">
                <h2>
                    最近报警信息</h2>
                <div style="float: left;">
                    <p id="descript" style="font-size: 14px; padding: 3px;">
                    </p>
                </div>
                <div style="text-align: right; float: right;">
                    <input type="submit" name="E_btnOk" value="报警确认" id="E_btnOk" title="确认疑似缺陷属实" class="btn btn-primary "
                        style="display: none;" />&nbsp;
                    <input type="submit" name="E_btnCan" value="报警取消" id="E_btnCan" title="疑似缺陷属于误报，取消该缺陷显示"
                        class="btn btn-primary" style="display: none;" />
                    <a id="edit_WZ" name="edit_WZ" class="btn btn-primary" title="批量编辑位置"><i class="icon-edit icon-white"></i>批量编辑位置</a>
                    <input type="submit" name="E_btnOk2" value="报警确认" id="E_btnOk2" title="确认疑似缺陷属实"
                        class="btn btn-primary " />
                    <input type="submit" name="E_btnCan2" value="报警取消" id="E_btnCan2" title="疑似缺陷属于误报，取消该缺陷显示"
                        class="btn btn-primary" />
                    <input type="submit" value="导出报告" id="btnImport" title="导出该组重复报警分析结果到文档中" class="btn btn-primary" />
                    <input type="submit" value="导出列表" id="btnImportExcel" title="导出该组重复报警分析列表到文档中" class="btn btn-primary" />
                    <%-- <input type="submit" name="btnOk" value="报警确认" id="E_btnOk" onclick="btnOnClick('btnOk')"
                        title="确认疑似缺陷属实" class="btn btn-primary " />&nbsp;
                    <input type="submit" name="btnCan" value="报警取消" id="E_btnCan" onclick="btnOnClick('btnCan')"
                        title="疑似缺陷属于误报，取消该缺陷显示" class="btn btn-primary" />--%>
                </div>
            </div>
            <div style="padding: 5px;">
                <div class="carousel-inner">
                    <div class="item">
                        <img class="img-polaroid span6" src="#" id="ImgHW" onclick="dbImgShuffling1()" style="height: 250px"
                            runat="server" />
                        <img class="img-polaroid span6" src="#" id="ImgKJG" onclick="dbImgShuffling1()" style="height: 250px"
                            runat="server" />
                        <div class="tab-pane active carousel-caption" id="panel-6653" style="background-color: rgba(19, 36, 127, 0.75);">
                            <%--<div class="new">
                            </div>--%>
                            <img id="btn_locInfoControl1" class="imgshareing" src="/Common/img/locoPlay/left.png" align="absmiddle" />
                            <p id="locInfo1">
                            </p>
                            <%--<div style="float: left; color: White;">
                                <font size="2">设备编号:<span id="ch1"></span>&nbsp;发生时间:<span id="fssj1"></span>&nbsp;线路:<span
                                    id="line1"></span>&nbsp;站:<span id="position1"></span>&nbsp;行别:<span id="xb1"></span>&nbsp;<span
                                        id="kmname1" style="display: none;">公里标:</span><span id="km1"></span><span id="gisxname1"
                                            style="display: none;">东经:</span><span id="gisx1"></span><span id="gisyname1" style="display: none;">北纬:</span><span
                                                id="gisy1"></span>&nbsp;</font></div>--%>
                            <div style="display: none;">
                                <div id="locold1" style="display: none; float: left; color: White;">
                                    <font size="2"><span id="locinfo1"></span></font>
                                </div>
                                <div id="locnew1" style="float: left; color: White;">
                                    <font size="2">最高温度:<span id="zgwd1"></span>℃&nbsp;环境温度:<span id="hjwd1"></span>℃&nbsp;导高值:<span
                                        id="dgz1"></span>mm&nbsp;拉出值:<span id="lcz1"></span>mm&nbsp;速度:<span id="sd1"></span>km/h</font>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <%--<div class="row-fluid">
            &nbsp;
        </div>--%>
        <div class="row-fluid">
            <div class="box-header-Repeat well">
                <h2>
                    重复报警信息</h2>
                <div style="float: left;">
                    <p id="descript1" style="font-size: 14px; padding: 3px;">
                    </p>
                </div>
            </div>
            <div style="padding: 5px;">
                <div class="carousel-inner">
                    <div class="item">
                        <img class="img-polaroid span6" src="#" id="hw" onclick="dbImgShuffling()" style="height: 250px" />
                        <img class="img-polaroid span6" src="#" id="kjg" onclick="dbImgShuffling()" style="height: 250px" />
                        <div class="tab-pane active carousel-caption" id="panel-6652" style="background-color: rgba(175, 188, 253, 0.75);">
                            <img id="btn_locInfoControl" class="imgshareing" src="/Common/img/locoPlay/left.png" align="absmiddle" />
                            <p id="locInfo" style="color: Black;">
                            </p>
                            <%--<div style="float: left; color: White; font-size: large;">
                                <font size="2">设备编号:<span id="ch"></span>&nbsp;发生时间:<span id="fssj"></span>&nbsp;线路:<span
                                    id="line"></span>&nbsp;站:<span id="position"></span>&nbsp;行别:<span id="xb"></span>&nbsp;<span
                                        id="kmname" style="display: none;">公里标:</span><span id="km"></span><span id="gisxname"
                                            style="display: none;">东经:</span><span id="gisx"></span><span id="gisyname" style="display: none;">北纬:</span><span
                                                id="gisy"></span>&nbsp;</font></div>--%>
                            <div style="display: none;">
                                <div id="locold" style="display: none; float: left; color: White; font-size: large;">
                                    <font size="2"><span id="locinfo"></span></font>
                                </div>
                                <div id="locnew" style="float: left; color: White; font-size: large;">
                                    <font size="2">最高温度:<span id="zgwd"></span>℃&nbsp;环境温度:<span id="hjwd"></span>℃&nbsp;导高值:<span
                                        id="dgz"></span>mm&nbsp;拉出值:<span id="lcz"></span>mm&nbsp;速度:<span id="sd"></span>km/h</font>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row-fluid">
                    <%--<span id="test" style="display: "></span><span id="test1" style="display: "></span>--%>
                    <span id="locnametag" runat="server"></span>
                    <div id="div_bottom">
                        <div style="width: 4%; float: left;">
                            &nbsp;
                        </div>
                        <div class="blk_18" style="float: left; margin-top: -1px;">
                            <a onmousedown="ISL_GoUp_1()" onmouseup="ISL_StopUp_1()" onmouseout="ISL_StopUp_1()"
                                href="javascript:void(0);" target="_self" class='carousel-control1'>‹</a>
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
                            <a onmousedown="ISL_GoDown_1()" onmouseup="ISL_StopDown_1()" onmouseout="ISL_StopDown_1()"
                                href="javascript:void(0);" target="_self" style="left: 96%;" class='carousel-control1'>
                                ›</a>
                        </div>
                        <%-- <div style="width: 4%; float: left;">
                            &nbsp;
                        </div>--%>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="linechart1" style="height: 150px; width: 300px; top: 196px; left: 480px;
        position: absolute;">
    </div>
    <div id="linechart" style="height: 150px; width: 300px; top: 498px; left: 480px;
        position: absolute;">
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

            var str_data = '[';
            for (var i = 0; i < JsonAlarm1.FRAME_INFO_LIST.length; i++) {
                if (i == 0) {
                    str_data += JsonAlarm1.FRAME_INFO_LIST[i].TEMP_IRV.replace("℃", "");
                }
                else {
                    str_data += "," + JsonAlarm1.FRAME_INFO_LIST[i].TEMP_IRV.replace("℃", "");
                }
            }
            str_data += ']';


            var _data = eval('(' + str_data + ')');


            var _XTitle = eval('(' + str_X + ')');  //申明横坐标

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
                    y2: 15
                },
                xAxis: [
                                        {

                                            type: 'category',
                                            axisLabel: { show: false },
                                            boundaryGap: true,
                                            axisTick: { onGap: false },
                                            splitLine: { show: false },
                                            data: _XTitle
                                        }
                ],
                yAxis: [

                                        {
                                            show: true,
                                            type: 'value',
                                            scale: true,
                                            precision: 2,
                                            boundaryGap: [0.05, 0.05],
                                            axisLabel: {
                                                textStyle: { color: '#fff' },
                                                formatter: function (v) {
                                                    return v + '℃'
                                                }
                                            }
                                        }
                ],
                series: [
                                        {
                                            name: '接触点温度',
                                            type: 'line',
                                            showAllSymbol: true,
                                            data: _data
                                        }

                ]
            };
            myChart1.setOption(option);
            var ecConfig = require('echarts/config');
            //点击事件执行的方法
            function eConsole(param) {
                if (typeof param.seriesIndex != 'undefined') {
                    ImgNum1 = param.name + 1;
                    InfoNum1 = param.name;
                    ImgShuffling1();
                    Suspended1();

                }
            }
            //绑定点击事件
            myChart1.on(ecConfig.EVENT.CLICK, eConsole);
        }
        //新增数据
        //            function dataadd(i) {
        //                myChart.addData([[0, Imgjson.FRAME_INFO[i].TEMP_IRV / 100, false, true, i]]);
        //            }
        //点击事件

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

            var str_data = '[';
            for (var i = 0; i < JsonAlarm.FRAME_INFO_LIST.length; i++) {
                if (i == 0) {
                    str_data += JsonAlarm.FRAME_INFO_LIST[i].TEMP_IRV.replace("℃", "");
                }
                else {
                    str_data += "," + JsonAlarm.FRAME_INFO_LIST[i].TEMP_IRV.replace("℃", "");
                }
            }
            str_data += ']';


            var _data = eval('(' + str_data + ')');


            var _XTitle = eval('(' + str_X + ')');  //申明横坐标

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
                    y2: 15
                },
                xAxis: [
                                        {

                                            type: 'category',
                                            axisLabel: { show: false },
                                            boundaryGap: true,
                                            axisTick: { onGap: false },
                                            splitLine: { show: false },
                                            data: _XTitle
                                        }
                ],
                yAxis: [

                                        {
                                            show: true,
                                            type: 'value',
                                            scale: true,
                                            precision: 2,
                                            boundaryGap: [0.05, 0.05],
                                            axisLabel: {
                                                textStyle: { color: '#fff' },
                                                formatter: function (v) {
                                                    return v + '℃'
                                                }
                                            }
                                        }
                ],
                series: [
                                        {
                                            name: '接触点温度',
                                            type: 'line',
                                            showAllSymbol: true,
                                            data: _data
                                        }

                ]
            };
            myChart.setOption(option);
            var ecConfig = require('echarts/config');
            //点击事件执行的方法
            function eConsole(param) {
                if (typeof param.seriesIndex != 'undefined') {
                    ImgNum = param.name + 1;
                    InfoNum = param.name;
                    ImgShuffling();
                    Suspended();

                }
            }
            //绑定点击事件
            myChart.on(ecConfig.EVENT.CLICK, eConsole);
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
    <div aria-hidden="true" id="edit_WZ_modal" class="modal fade" aria-labelledby="mymodalLabel" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4>批量位置编辑</h4>
                </div>
                <div class="modal-body">
                    <table cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tr>
                            <td height="25" align="right">
                                线路名称：
                            </td>
                            <td height="25" align="left">
                                <select id="lineselect" name="lineselect" style="width: 180px;" onchange="lineChange(this.value,this.options[this.options.selectedIndex].text)">
                                </select>
                            </td>
                            <td height="25" align="right">
                                区、站名称：
                            </td>
                            <td height="25" align="left">
                                <select id="positionselect" name="positionselect" style="width: 180px;" onchange="positionChange(this.value,this.options[this.options.selectedIndex].text)">
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td height="25" align="right">
                                行别：
                            </td>
                            <td height="25" align="left">
                                <select id="POLE_DIRECTION" name="POLE_DIRECTION" style="width: 180px;">
                                    <option value="">暂无</option>
                                    <option value="上行">上行</option>
                                    <option value="下行">下行</option>
                                </select>
                            </td>
                            <td height="25" align="right">
                                桥隧名称：
                            </td>
                            <td height="25" align="left">
                                <select id="brgtunselect" name="brgtunselect" style="width: 180px;" onchange="brgtunChange(this.value,this.options[this.options.selectedIndex].text)">
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td height="25" align="right">
                                杆号：
                            </td>
                            <td height="25" align="left">
                                <input class="validate[custom[integer],min[0]]" onblur="removeClass(this);" type="text" id="POLE_NO" name="POLE_NO" style="width: 170px;" />
                            </td>
                            <td height="25" align="right">
                                所属公里标：
                            </td>
                            <td height="25" align="left">
                                <input class="validate[custom[integer]]" onblur="removeClass(this);" type="text" id="txt_km" name="txt_km" style="width: 170px;" />
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
                    <button type="button" onclick="keepinfo()" class="btn btn-primary">保存</button>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
<script src="/Common/MAlarmMonitoring/js/AlarmSureBox.js"></script>
<script type="text/javascript">
    LoadSureBox('REPEAT', GetQueryString("alarmid"), '');
    SetAlarmID("REPEAT", GetQueryString("alarmid"));
</script>
