/*========================================================================================*
* 功能说明：1C 趋势图封装
* 作    者： zzj
* 版本日期：2014.12.29
* 参数说明：

eventID         巡检单个设备事件ID，如果harddiskID为空，则通过eventID计算harddiskID与deviceID。
harddiskID      巡检ID（推荐使用）
deviceID        设备ID（推荐使用）
*=======================================================================================*/
(function ($) {
    $.fn.Echart_1C = function (options) {
        var defaults = {
            eventID: '', //eventID 
            harddiskID: '', //巡检ID
            deviceID: '', //设备ID
            callback: function () { }
        };
        var objID = $(this).attr('id');
        var opts = $.extend(defaults, options);

        require(['echarts', 'echarts/chart/line'], function (ec) {
            ECharts = ec;
            loadC3Echarts(opts.eventID, objID, opts.harddiskID, opts.deviceID);

            opts.callback();
        });

        function removeThousand(arry) {
            var a = arry
            if (a.length > 0) {
                for (var i = 0; i < a.length; i++) {
                    if (a[i] == '-1000' || a[i].value=='-1000') {
                        a[i] = '-';
                    }
                }
                //console.log(a)
                return a;
            }
            

        }

        function loadC3Echarts(eid, objID, harddiskid, deviceid) {
            // 基于准备好的dom，初始化echarts图表

            var myChart1; //导高
            var myChart2; //拉出
            var myChart3; //网压
            var myChart4; //硬点


            var html = '<div class="row-fluid">\
                    <div id="main1" style="width: 100%; height: 100px; background-color: #333">\
                    </div>\
                </div>\
                <div class="row-fluid">\
                    <div id="main2" style="width: 100%; height: 100px; background-color: #333">\
                    </div>\
                </div>\
                <div class="row-fluid">\
                    <div id="main3" style="width: 100%; height: 50px; background-color: #333">\
                    </div>\
                </div>\
                <div class="row-fluid">\
                    <div id="main4" style="width: 100%; height: 80px; background-color: #333">\
                    </div>\
                </div>';


            $('#' + objID).html(html);

            var _h = $('#' + objID).height() / 4;

            document.getElementById('main1').style.height = _h + "px";
            document.getElementById('main2').style.height = _h - 15 + "px";
            document.getElementById('main3').style.height = _h + 15 + "px";
            document.getElementById('main4').style.height = _h + "px";



            var C1json = getNodes(eid, deviceid, harddiskid);
            var c1wy = removeThousand(C1json[0]); //网压
            var c1yd = removeThousand(C1json[1]); //硬点
            var c1dg = removeThousand(C1json[2]); //导高值
            var c1lc = removeThousand(C1json[3]); //拉出值
            var c1bzdg = removeThousand(C1json[4]); //标准导高
            var c1bzlc = removeThousand(C1json[5]); //标准拉出
            var axisData = C1json[6]; ; //申明横坐标  杆号


            //if (c1lc != null) {
            //    for (var i = 0; i < c1lc.length; i++) {
            //        var tmp;
            //        if (c1lc[i].value != undefined) {
            //            tmp = c1lc[i].value;
            //            console.log(tmp);
            //        } else {
            //            tmp = c1lc[i];
            //        }
            //        if (tmp < 0 && c1bzlc[i]!='-')
            //            c1bzlc[i] = c1bzlc[i] * -1;
            //    }
            //}

            
            //    var chartTitle = getNodesTitle(eid, deviceid, harddiskid); //C1chart表头


            var option1 = {
                tooltip: {
                    trigger: 'axis',
                    showDelay: 1,             // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
                    formatter: function (params) {
                        var res = params[0][1] + "支柱";
                        res += '<br/>' + params[0][0] + ':' + params[0][2] + 'mm';
                        res += '<br/>' + params[1][0] + ':' + params[1][2] + 'mm';
                        return res;

                    }
                },
                legend: {
                    data: ['导高值', '拉出值', '网压值', '硬点值'],
                    textStyle: { color: "#fff" }
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
                                data: axisData
                            }
                        ],
                yAxis: [

                            {
                                show: true,
                                type: 'value',
                                scale: true,
                                precision: 2,
                                max: 7000,
                                min: 5500,
                                boundaryGap: [0.05, 0.05],
                                axisLabel: {
                                    textStyle: { color: '#fff' },
                                    formatter: function (v) {
                                        return v + 'mm';
                                    }
                                }
                            }
                        ],
                series: [
                            {
                                name: '导高值',
                                type: 'line',
                                showAllSymbol: true,
                                data: c1dg
                            },
                            {
                                name: '标准导高值',
                                type: 'line',
                                symbol: 'none',
                                mooth: true,
                                showAllSymbol: true,
                                data: c1bzdg
                            },
                            {
                                name: '拉出值',
                                type: 'line',
                                data: []
                            },
                            {
                                name: '网压值',
                                type: 'line',
                                data: []
                            }
                            ,
                            {
                                name: '硬点值',
                                type: 'line',
                                data: []
                            }

                        ]
            };
            var option2 = {
                tooltip: {
                    trigger: 'axis',
                    showDelay: 1,             // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
                    formatter: function (params) {
                        var res = params[0][1] + "支柱";
                        res += '<br/>' + params[0][0] + ':' + params[0][2] + 'mm';
                        res += '<br/>' + params[1][0] + ':' + params[1][2] + 'mm';
                        return res;
                    }
                },
                legend: {
                    y: -30,
                    data: ['导高值', '拉出值', '网压值', '硬点值']
                },

                grid: {
                    x: 80,
                    y: 5,
                    x2: 20,
                    y2: 15
                },
                xAxis: [
                            {
                                type: 'category',
                                position: 'top',
                                boundaryGap: true,
                                axisLabel: { textStyle: { color: '#fff'} },
                                axisTick: { onGap: false },
                                splitLine: { show: false },
                                data: axisData
                            }
                        ],
                yAxis: [
                            {
                                type: 'value',
                                scale: true,
                                splitNumber: 6,
                                max: 480,
                                min: -480,
                                boundaryGap: [0.05, 0.05],
                                splitArea: { show: true },
                                axisLabel: {
                                    textStyle: { color: '#fff' },
                                    formatter: function (v) {
                                        return v + 'mm';
                                    }
                                }

                            }
                        ],
                series: [
                            {
                                name: '拉出值',
                                type: 'line',
                                showAllSymbol: true,

                                smooth: true,
                                data: c1lc

                            },
                            {
                                name: '标准拉出值',
                                type: 'line',
                                symbol: 'none',
                                showAllSymbol: true,
                                smooth: true,
                                data: c1bzlc

                            }
                        ]
            };
            var option3 = {

                tooltip: {
                    trigger: 'axis',
                    showDelay: 1,             // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
                    formatter: function (params) {
                        var res = params[0][1] + "支柱";
                        res += '<br/>' + params[0][0] + ':' + params[0][2];
                        return res;
                    }
                },
                legend: {
                    y: -30,
                    data: ['导高值', '拉出值', '网压值', '硬点值']
                },

                grid: {
                    x: 80,
                    y: 5,
                    x2: 20,
                    y2: 15
                },
                xAxis: [
                            {
                                type: 'category',
                                position: 'bottom',
                                boundaryGap: true,
                                axisLabel: { show: false },
                                axisTick: { onGap: false },
                                splitLine: { show: false },
                                data: axisData
                            }
                        ],
                yAxis: [
                            {
                                type: 'value',
                                scale: true,
                                splitNumber: 4,
                                boundaryGap: [0.05, 0.05],
                                axisLabel: {
                                    textStyle: { color: '#fff' },
                                    formatter: function (v) {
                                        return v;
                                    }
                                },
                                splitArea: { show: true }
                            }
                        ],
                series: [
                            {
                                name: '网压值',
                                type: 'line',
                                smooth: true,
                                showAllSymbol: true,
                                data: c1wy
                            }
                        ]
            };
            var option4 = {
                tooltip: {
                    trigger: 'axis',
                    showDelay: 1,             // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
                    formatter: function (params) {
                        var res = params[0][1] + "支柱";
                        res += '<br/>' + params[0][0] + ':' + params[0][2];
                        return res;
                    }
                },
                legend: {
                    y: -30,
                    data: ['导高值', '拉出值', '网压值', '硬点值']
                },

                grid: {
                    x: 80,
                    y: 5,
                    x2: 20,
                    y2: 60
                },
                xAxis: [
                            {
                                type: 'category',
                                position: 'bottom',
                                boundaryGap: true,
                                axisTick: { onGap: false },
                                splitLine: { show: false },
                                axisLabel: {
                                    textStyle: { color: '#fff' }
                                },
                                data: axisData
                            }
                        ],
                yAxis: [
                            {
                                type: 'value',
                                scale: true,
                                splitNumber: 4,
                                boundaryGap: [0.05, 0.05],
                                axisLabel: {
                                    textStyle: { color: '#fff' },
                                    formatter: function (v) {
                                        return v;
                                    }
                                },
                                splitArea: { show: true }
                            }
                        ],
                series: [
                            {
                                name: '硬点值',
                                type: 'line',
                                smooth: true,
                                showAllSymbol: true,

                                data: c1yd
                            }
                        ]
            };


            myChart1 = ECharts.init(document.getElementById('main1'), theme);
            myChart2 = ECharts.init(document.getElementById('main2'), theme);
            myChart3 = ECharts.init(document.getElementById('main3'), theme);
            myChart4 = ECharts.init(document.getElementById('main4'), theme);

            // 为echarts对象加载数据 
            myChart1.setOption(option1);
            myChart2.setOption(option2);
            myChart3.setOption(option3);
            myChart4.setOption(option4);
            // 多表关联
            myChart1.connect([myChart2, myChart3, myChart4]);
            myChart2.connect([myChart1, myChart3, myChart4]);
            myChart3.connect([myChart1, myChart2, myChart4]);
            myChart4.connect([myChart1, myChart2, myChart3]);
            //新增数据
        };
        //获取C1趋势图JSON串
        function getNodes(eid, deviceid, harddiskid) {
            var url = "/Common/RemoteHandlers/GetC1Json.ashx?type=allvalue&eventid=" + eid + "&datatype=&deviceid=" + deviceid + "&harddiskid=" + harddiskid;
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
        }


    };
})(jQuery);



