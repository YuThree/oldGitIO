/*========================================================================================*
* 功能说明：1C 趋势图封装
* 作    者： tm
* 版本日期：2017.6.20
* 参数说明：

eventID         巡检单个设备事件ID，如果harddiskID为空，则通过eventID计算harddiskID与deviceID。
harddiskID      巡检ID（推荐使用）
deviceID        设备ID（推荐使用）
*=======================================================================================*/
(function ($) {
    $.fn.Echart_1C = function (options) {
        var defaults = {
            curTitle: '',
            eventID: '', //eventID 
            harddiskID: '', //巡检ID
            deviceID: '', //设备ID

            before_Title: '',
            before_EventID: '',
            before_HarddiskID: '',
            before_DeviceID: '',

            eid_DG: '', //导高元素id
            eid_LC: '', //拉出元素id
            eid_WY: '', //网压元素id
            eid_HP: '', //硬点元素id
            callback: function () { }
        };
        var objID = $(this).attr('id');
        var p = $.extend(defaults, options);

        loadC3Echarts(objID, p.curTitle, p.eventID, p.harddiskID, p.deviceID, p.before_Title, p.before_EventID, p.before_HarddiskID, p.before_DeviceID);

        p.callback();

        /*/*
         * @desc 设置值为-1000的数据不显示
         * @param arry：数组数据
         * @return 无
         */
        function removeThousand(arry) {
            var a = arry;
            if (a.length > 0) {
                for (var i = 0; i < a.length; i++) {
                    if (a[i] == '-1000' || a[i].value == '-1000') {
                        a[i] = '-';
                    }
                }
                return a;
            }
        }

        /*/*
         * @desc 设置曲线的最大值的标签值
         * @param arry：数组数据
         * @return 无
         */
        function setSymbolSize(arry) {
            for (var j = 0; j < arry.length; j++) {
                if (isNaN(arry[j])) {
                    arry[j].symbolSize = 16;
                }
            }
        }

        /*/*
         * @desc 加载C1曲线
         * @param objID：绑定曲线的元素的id名；curTitle：标题；eid：报警id；harddiskid：硬盘id；deviceid：支柱id
         * @param before_Title：标题；before_EventID：报警id；before_HarddiskID：硬盘id；before_DeviceID：支柱id
         * @return 无
         */
        function loadC3Echarts(objID, curTitle, eid, harddiskid, deviceid, before_Title, before_EventID, before_HarddiskID, before_DeviceID) {

            // 基于准备好的dom，初始化echarts图表
            var myChartDG; //导高
            var myChartLC; //拉出
            var myChartWY; //网压
            var myChartHP; //硬点

            var html = '<div class="row-fluid">\
                            <div id="' + p.eid_DG + '" style="width: 100%; height: 100px; background-color: #333"></div>\
                            <div id="' + p.eid_LC + '" style="width: 100%; height: 100px; background-color: #333"></div>\
                            <div id="' + p.eid_WY + '" style="width: 100%; height: 50px; background-color: #333"></div>\
                            <div id="' + p.eid_HP + '" style="width: 100%; height: 80px; background-color: #333"></div>\
                        </div>';

            $('#' + objID).html(html);

            var _h = $('#' + objID).height() / 4;

            document.getElementById(p.eid_DG).style.height = _h + 'px';
            document.getElementById(p.eid_LC).style.height = _h - 15 + 'px';
            document.getElementById(p.eid_WY).style.height = _h + 15 + 'px';
            document.getElementById(p.eid_HP).style.height = _h + 'px';

            myChartDG = echarts.init(document.getElementById(p.eid_DG)); //导高
            myChartLC = echarts.init(document.getElementById(p.eid_LC)); //拉出
            myChartWY = echarts.init(document.getElementById(p.eid_WY)); //网压
            myChartHP = echarts.init(document.getElementById(p.eid_HP)); //硬点

            var optionDG; //导高
            var optionLC; //拉出
            var optionWY; //网压
            var optionHP; //硬点

            // ---------------------------------------------------------------------------------------------
            if ('' !== before_HarddiskID) {
                var before_C1json = getNodes(before_EventID, before_DeviceID, before_HarddiskID); //之前的
                var before_c1wy = before_C1json[0]; //网压
                removeThousand(before_c1wy);
                if (0 !== before_c1wy[0]) {
                    setSymbolSize(before_c1wy);
                }
                var before_c1yd = before_C1json[1]; //硬点
                removeThousand(before_c1yd);
                if (0 !== before_c1yd[0]) {
                    setSymbolSize(before_c1yd);
                }
                var before_c1dg = before_C1json[2]; //导高值
                removeThousand(before_c1dg);
                if (0 !== before_c1dg[0]) {
                    setSymbolSize(before_c1dg);
                }
                var before_c1lc = before_C1json[3]; //拉出值
                removeThousand(before_c1lc);
                if (0 !== before_c1lc[0]) {
                    setSymbolSize(before_c1lc);
                }
            }

            // ---------------------------------------------------------------------------------------------

            var C1json = getNodes(eid, deviceid, harddiskid); //当前的
            var c1wy = C1json[0]; //网压
            removeThousand(c1wy);
            setSymbolSize(c1wy);

            var c1yd = C1json[1]; //硬点
            removeThousand(c1yd);
            setSymbolSize(c1yd);

            var c1dg = C1json[2]; //导高值
            removeThousand(c1dg);
            setSymbolSize(c1dg);

            var c1lc = C1json[3]; //拉出值
            removeThousand(c1lc);
            setSymbolSize(c1lc);

            var xTitle = C1json[6];; //申明横坐标  杆号

            var c1bzdg = removeThousand(C1json[4]); //标准导高
            var c1bzlc = removeThousand(C1json[5]); //标准拉出

            // ---------------------------------------------------------------------------------------------

            var line_color = { 'DG': '#fe8463', 'LC': '#9bca63', 'WY': '#fad860', 'HP': '#96e3ec', 'white': '#ffffff' };
            var legend = ['导高值', '拉出值', '网压值', '硬点值'];
            
            optionDG = createOption(xTitle, legend[0], [createSeries(curTitle + ' ' + legend[0], line_color.DG, c1dg)], '单位mm', 18);//导高
            optionLC = createOption(xTitle, legend[1], [createSeries(curTitle + ' ' + legend[1], line_color.LC, c1lc)], '单位mm', 23);//拉出
            optionWY = createOption(xTitle, legend[2], [createSeries(legend[2], line_color.WY, c1wy)], '', 10.5);//网压
            optionHP = createOption(xTitle, legend[3], [createSeries(legend[3], line_color.HP, c1yd)], '', 29);//硬点

            if ('' === before_Title) {
                var seriesDG = optionDG.series;
                seriesDG.splice(1, 1);
                var seriesLC = optionLC.series;
                seriesLC.splice(1, 1);
                var seriesWY = optionWY.series;
                seriesWY.splice(1, 1);
                var seriesHP = optionHP.series;
                seriesHP.splice(1, 1);
            }

            //导高
            if (undefined !== before_c1dg && 'undefined' !== before_c1dg && '' !== before_c1dg && null !== before_c1dg && 0 !== before_c1dg[0]) { 
                var seriesDG = createSeries(before_Title + ' ' + legend[0], line_color.DG, before_c1dg);
                optionDG.series.push(seriesDG);
            }
            //标准导高
            if (undefined !== c1bzdg && 'undefined' !== c1bzdg && '' !== c1bzdg && null !== c1bzdg && 0 !== c1bzdg && c1bzdg.length > 0) {
                var seriesBZDG = createSeries('标准导高值', line_color.white, c1bzdg);
                optionDG.series.push(seriesBZDG);
            }

            //拉出
            if (undefined !== before_c1lc && 'undefined' !== before_c1lc && '' !== before_c1lc && null !== before_c1lc && 0 !== before_c1lc[0]) { 
                var seriesLC = createSeries(before_Title + ' ' + legend[1], line_color.LC, before_c1lc);
                optionLC.series.push(seriesLC);
            }
            //标准拉出
            if (undefined !== c1bzlc && 'undefined' !== c1bzlc && '' !== c1bzlc && null !== c1bzlc && 0 !== c1bzlc && c1bzlc.length > 0) {
                var seriesBZLC = createSeries('标准拉出值', line_color.white, c1bzlc);
                optionLC.series.push(seriesBZLC);
            }

            //网压
            if (undefined !== before_c1wy && 'undefined' !== before_c1wy && '' !== before_c1wy && null !== before_c1wy && 0 !== before_c1wy[0]) { 
                var seriesWY = createSeries(legend[2], line_color.WY, before_c1wy);
                optionWY.series.push(seriesWY);
            }

            //硬点
            if (undefined !== before_c1yd && 'undefined' !== before_c1yd && '' !== before_c1yd && null !== before_c1yd && 0 !== before_c1yd[0]) { 
                var seriesHP = createSeries(legend[3], line_color.HP, before_c1yd);
                optionHP.series.push(seriesHP);
            }

            // 为echarts对象加载数据 
            myChartDG.setOption(optionDG);
            myChartLC.setOption(optionLC);
            myChartWY.setOption(optionWY);
            myChartHP.setOption(optionHP);
            // 多表关联
            echarts.connect([myChartDG, myChartLC, myChartWY, myChartHP]);
        };

        //创建曲线图表的option，合并或拆分的
        function createOption(xTitle, legend, seriesArr, unit, margin) {
            var option = {
                backgroundColor: '#000',
                grid: {
                    x: 30,
                    y: 40,
                    x2: 20,
                    y2: 10,
                    containLabel: true
                },
                tooltip: { //提示框
                    show: true,
                    trigger: 'axis',
                    backgroundColor: '#fff',
                    borderColor: '#ddd',
                    borderWidth: 1,
                    extraCssText: 'box-shadow: 0 0 5px rgba(0, 0, 0, 0.1)',
                    textStyle: { color: '#000', fontSize: 12, align: 'left' },
                    formatter: function (params) {
                        var res = '';
                        var pole = params[0].name + '支柱';
                        var temp = '';
                        if (params[0].seriesName.indexOf('导高') > -1 || params[0].seriesName.indexOf('拉出') > -1) {
                            temp = params[0].seriesName + '：' + params[0].value + 'mm';
                        } else {
                            temp = params[0].seriesName + '：' + params[0].value;
                        }

                        var temp_ = '';
                        if (undefined !== params[1]) {
                            if (params[1].seriesName.indexOf('导高') > -1 || params[1].seriesName.indexOf('拉出') > -1) {
                                temp_ = params[1].seriesName + '：' + params[1].value + 'mm';
                            } else {
                                temp_ = params[1].seriesName + '：' + params[1].value;
                            }
                        }

                        res = pole + '<br />' + temp + '<br />' + temp_;
                        return res;
                    }
                },
                legend: {
                    show: true,
                    x: 'left',
                    y: 'top',
                    left: '4%',
                    textStyle: { color: '#96e3ec' },
                    selectedMode: true,
                    data: legend
                },
                xAxis: [
                    {
                        show: true,
                        type: 'category', //坐标轴类型
                        splitLine: { //网格分隔线
                            show: false,
                            lineStyle: { color: '#fff' }
                        },
                        axisLabel: {
                            textStyle: { color: '#fff' }
                        },
                        data: xTitle
                    }
                ],
                yAxis: [
                    {
                        precision: 0,
                        scale: true,
                        name: unit,
                        type: 'value',
                        position: 'left',
                        nameTextStyle: {
                            color: '#fff'
                        },
                        axisLabel: { //坐标轴刻度标签
                            textStyle: { color: '#fff' },
                            formatter: function (v) { return v; },
                            margin: margin
                        },
                        axisLine: { show: true },//坐标轴轴线
                        splitLine: { //网格分隔线
                            show: true,
                            interval: '1',
                            lineStyle: { color: '#555', type: 'dashed' }
                        }
                    }
                ],
                series: seriesArr
            };
            return option;
        }

        //创建曲线图表的series
        function createSeries(seriesName, lineColor, data) {
            var series = {
                name: seriesName,
                type: 'line',
                symbolSize: 8,
                symbol: 'circle',
                itemStyle: {
                    normal: {
                        color: lineColor,
                        barBorderRadius: 0,
                        label: {
                            show: false,
                            position: 'top',
                            formatter: function (p) { return p.value > 0 ? (p.value) : ''; }
                        }
                    }
                },
                data: data
            };
            return series;
        }

        //获取C1趋势图JSON串
        function getNodes(eid, deviceid, harddiskid) {
            var url = '/Common/RemoteHandlers/GetC1Json.ashx?type=allvalue&eventid=' + eid + '&datatype=&deviceid=' + deviceid + '&harddiskid=' + harddiskid;
            var json;
            $.ajax({
                type: 'post',
                url: url,
                async: false,
                cache: true,
                success: function (result) {
                    if ('' !== result && null !== result && undefined !== result && 'undefined' !== result) {
                        json = eval('(' + result + ')');
                    } else {
                        json = '';
                    }
                }
            });
            return json;
        }
    };
})(jQuery);