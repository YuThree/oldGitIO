var pieColor = ["#51C3E8", "#E79092", "#56DDB4", "#C49DFD", "#D9B65A", "#438FE0", "#1FCCC2", "#CE90AC", "#5F7CD3", "#CAA168",
    "#3C86EA", "#22BDA3", "#C4AAFD", "#C66487", "#A169D6", "#559ADA", "#ADA0CB", "#C9D27D", "#92B815", "#B383BC"
];
var tipsBg = "rgba(42,193,236,.85)";

var china = "js/map/json/china.json";

var myChart1 = echarts.init(document.getElementById('echarts1'));
echarts.extendsMap = function (id, opt) {
    // 实例
    var chart = this.init(document.getElementById(id), {
        renderer: 'svg'
    });

    var curGeoJson = {};

    var geoCoordMap = { // 配置红圈圈位置
        '伊犁哈萨克自治州': [82.5513, 43.5498],
        '舟山市': [122.2559, 30.2234],
    };
    var provinceMap = {
        "新疆": 'xinjiang',
        "四川": 'sichuan',
        "甘肃": 'gansu',
        "西藏": 'xizang',
        "青海": 'qinghai',
        "宁夏": 'ningxia',
        "陕西": 'shan3xi',
        "山西": 'shan1xi',
        "云南": 'yunnan',
        "贵州": 'guizhou',
        "重庆": 'chongqing',
        "广西": 'guangxi',
        "海南": 'hainan',
        "湖南": 'hunan',
        "湖北": 'hubei',
        "河南": 'henan',
        "河北": 'hebei',
        "内蒙古": 'neimenggu',
        "北京": 'beijing',
        "天津": 'tianjin',
        "黑龙江": 'heilongjiang',
        "吉林": 'jilin',
        "辽宁": 'liaoning',
        "山东": 'shandong',
        "安徽": 'anhui',
        "江西": 'jiangxi',
        "广东": 'guangdong',
        "澳门": 'macau',
        "香港": 'hongkong',
        "福建": 'fujian',
        "台湾": 'taiwan',
        "浙江": 'zhejiang',
        "上海": 'shanghai',
        "江苏": 'jiangsu',
    }
    var cityMap = {
        '鹰潭市': '1.json|yingtan',
        '抚州市': '2.json|fuzhou',
        '赣州市': '3.json|ganzhou',
        '吉安市': '4.json|jian',
        '景德镇市': '5.json|jingdezhen',
        '九江市': '6.json|jiujiang',
        '南昌市': '7.json|nanchang',
        '萍乡市': '8.json|pingxiang',
        '上饶市': '9.json|shangrao',
        '新余市': '10.json|xinyu',
        '宜春市': '11.json|yichun',
        '厦门市': '12.json|xiamen',
    }

    var defaultOpt = {
        mapName: 'china', // 地图展示
        goDown: false, // 是否下钻
        bgColor: '#404a59', // 画布背景色
        activeArea: [], // 区域高亮,同echarts配置项
        data: [],
        // 下钻回调(点击的地图名、实例对象option、实例对象)
        callback: function (name, option, instance) {}
    };
    if (opt) opt = this.util.extend(defaultOpt, opt);

    // 层级索引
    var name = [opt.mapName];
    var idx = 0;
    var pos = {
        leftPlus: 115,
        leftCur: 150,
        left: 198,
        top: 50
    };

    var line = [
        [0, 0],
        [8, 11],
        [0, 22]
    ];
    // style
    var style = {
        font: '18px "Microsoft YaHei", sans-serif',
        textColor: '#eee',
        lineColor: 'rgba(147, 235, 248, .8)',
    };

    var handleEvents = {
        /**
         * i 实例对象
         * o option
         * n 地图名
         **/
        resetOption: function (i, o, n) {
            var breadcrumb = this.createBreadcrumb(n);

            var j = name.indexOf(n);
            var l = o.graphic.length;
            if (j < 0) {
                o.graphic.push(breadcrumb);
                o.graphic[0].children[0].shape.x2 = 145;
                o.graphic[0].children[1].shape.x2 = 145;
                if (o.graphic.length > 2) {
                    for (var x = 0; x < opt.data.length; x++) {
                        if (n === opt.data[x].name + '市') {
                            o.series[0].data = handleEvents.initSeriesData([opt.data[x]]);
                            break;
                        } else o.series[0].data = [];
                    }
                };
                name.push(n);
                idx++;
            } else {
                o.graphic.splice(j + 2, l);
                if (o.graphic.length <= 2) {
                    o.graphic[0].children[0].shape.x2 = 60;
                    o.graphic[0].children[1].shape.x2 = 60;
                    o.series[0].data = handleEvents.initSeriesData(opt.data);
                };
                name.splice(j + 1, l);
                idx = j;
                pos.leftCur -= pos.leftPlus * (l - j - 1);
            };

            o.geo.map = n;
            o.geo.zoom = 0.4;
            i.clear();
            i.setOption(o);
            this.zoomAnimation();
            opt.callback(n, o, i);
        },

        /**
         * name 地图名
         **/
        createBreadcrumb: function (name) {
            var titleName;
            if (provinceMap[name]) {
                titleName = provinceMap[name].toUpperCase();
            } else if (cityMap[name]) {
                titleName = cityMap[name].split('|')[1].toUpperCase();
            } else {
                titleName = ''
            }
            var breadcrumb = {
                type: 'group',
                id: name,
                left: pos.leftCur + pos.leftPlus,
                top: pos.top,
                children: [{
                    type: 'polyline',
                    left: -90,
                    top: 'middle',
                    shape: {
                        points: line
                    },
                    style: { //  导航 > 的样式
                        stroke: '#fff',
                        key: name
                    },
                    onclick: function () {
                        var name = this.style.key;
                        handleEvents.resetOption(chart, option, name);
                    }
                }, { // 省级(二级)中文配置
                    type: 'text',
                    left: -58,
                    top: 'middle',
                    style: {
                        text: name,
                        textAlign: 'center',
                        fill: style.textColor,
                        font: style.font
                    },
                    onclick: function () {
                        var name = this.style.text;
                        handleEvents.resetOption(chart, option, name);
                    }
                }, {
                    type: 'text', // 省级(二级)英文配置
                    left: -58,
                    top: 10,
                    style: {
                        name: name,
                        // text: provinceMap[name]? provinceMap[name].toUpperCase(): '',
                        text: titleName,
                        textAlign: 'center',
                        fill: style.textColor,
                        font: '12px "Microsoft YaHei", sans-serif',
                    },
                    onclick: function () {
                        // console.log(this.style);
                        var name = this.style.name;
                        handleEvents.resetOption(chart, option, name);
                    }
                }]
            }

            pos.leftCur += pos.leftPlus;

            return breadcrumb;
        },

        // 设置effectscatter
        initSeriesData: function (data) {
            var temp = [];
            for (var i = 0; i < data.length; i++) {
                var geoCoord = geoCoordMap[data[i].name];
                if (geoCoord) {
                    temp.push({
                        name: data[i].name,
                        value: geoCoord.concat(data[i].value, data[i].level)
                    });
                }
            };
            return temp;
        },

        zoomAnimation: function () {
            var count = null;
            var zoom = function (per) {
                if (!count) count = per;
                count = count + per;
                // console.log(per,count);
                chart.setOption({
                    geo: {
                        zoom: count
                    }
                });
                if (count < 1) window.requestAnimationFrame(function () {
                    zoom(0.2);
                });
            };
            window.requestAnimationFrame(function () {
                zoom(0.2);
            });
        }
    };

    var option = {
        graphic: [{
            type: 'group',
            left: pos.left,
            top: pos.top - 4,
            children: [{
                type: 'line',
                left: 0,
                top: -20,
                shape: {
                    x1: 0,
                    y1: 0,
                    x2: 60,
                    y2: 0
                },
                style: {
                    stroke: style.lineColor,
                    stroke: 'transparent',
                }
            }, {
                type: 'line',
                left: 0,
                top: 20,
                shape: {
                    x1: 0,
                    y1: 0,
                    x2: 60,
                    y2: 0
                },
                style: {
                    stroke: style.lineColor,
                    stroke: 'transparent',
                }
            }]
        }, {
            id: name[idx],
            type: 'group',
            left: pos.left + 2,
            top: pos.top,
            children: [{
                type: 'polyline',
                left: 90,
                top: -12,
                shape: {
                    points: line
                },
                style: {
                    stroke: 'transparent',
                    key: name[0]
                },
                onclick: function () {
                    var name = this.style.key;
                    handleEvents.resetOption(chart, option, name);
                }
            }, {
                type: 'text',
                left: 0,
                top: 'middle',
                style: {
                    text: name[0] === '中国' ? '中国' : name[0],
                    textAlign: 'center',
                    fill: style.textColor,
                    font: style.font
                },
                onclick: function () {
                    handleEvents.resetOption(chart, option, '中国');
                    isCity = false;
                }
            }, {
                type: 'text',
                left: 0,
                top: 10,
                style: {
                    text: 'CHINA',
                    textAlign: 'center',
                    fill: style.textColor,
                    font: '12px "Microsoft YaHei", sans-serif',
                },
                onclick: function () {
                    handleEvents.resetOption(chart, option, '中国');
                    isCity = false;
                }
            }]
        }],
        geo: {
            map: opt.mapName,
            // roam: true,
            zoom: 1,
            label: {
                normal: {
                    show: true,
                    textStyle: {
                        color: '#fff'
                    }
                },
                emphasis: {
                    textStyle: {
                        color: '#fff'
                    }
                }
            },
            itemStyle: {
                normal: {
                    borderColor: '#2B84B9',
                    borderWidth: 1,
                    areaColor: '#25A8E7',
                    borderType: 'dotted', //描边线条类型
                    shadowColor: 'rgba(255, 255, 255, 1)',
                    shadowColor: '#2B84B9',
                    shadowOffsetX: -2,
                    shadowOffsetY: 2,
                    shadowBlur: 8
                },
                emphasis: {
                    areaColor: '#389BB7',
                    borderWidth: 0
                }
            },
            regions: opt.activeArea.map(function (item) { // 特殊区域颜色
                if (typeof item !== 'string') {
                    return {
                        name: item.name,
                        itemStyle: {
                            normal: {
                                areaColor: '#0D4F71',
                                borderColor: '#2C81B5',
                            }
                        },
                        label: {
                            normal: {
                                show: item.showLabel,
                                textStyle: {
                                    color: '#fff'
                                }
                            }
                        }
                    }
                } else {
                    return {
                        name: item,
                        itemStyle: {
                            normal: {
                                borderColor: '#2575A7',
                                areaColor: '#1D87BB'
                            }
                        }
                    }
                }
            })
        },
        series: [{
            type: 'effectScatter',
            coordinateSystem: 'geo',
            // symbol: 'diamond',
            showEffectOn: 'render',
            rippleEffect: {
                period: 15,
                scale: 6,
                brushType: 'fill'
            },
            hoverAnimation: true,
            itemStyle: {
                normal: {
                    color: '#CB5E3B', // 配置颜色 
                    shadowBlur: 10,
                    shadowColor: '#333'
                }
            },
            data: handleEvents.initSeriesData(opt.data)
        }],
        tooltip: {
            show: true,
            trigger: 'item',
            formatter: "123",
            backgroundColor: tipsBg, //提示框背景色
        },
    };

    chart.setOption(option);
    var isCity = false;
    // 添加事件
    chart.on('click', function (params) {
        var _self = this;
        if (opt.goDown && params.name !== name[idx] && !isCity) {
            if (provinceMap[params.name]) {
                var url = 'js/map/json/province/' + provinceMap[params.name] + '.json';
                $.get(url, function (response) {
                    curGeoJson = response;
                    echarts.registerMap(params.name, response);
                    handleEvents.resetOption(_self, option, params.name);
                });
            }

            isCity = true
        } else {
            chart.setMap(params.name)
        }
    });

    chart.setMap = function (mapName) {
        var _self = this;
        if (mapName.indexOf('市') < 0) mapName = mapName + '市';
        if (cityMap[mapName]) {
            var citySource = cityMap[mapName].split('|')[0];
        } else {
            return false
        }

        if (citySource) {
            var url = 'js/map/json/city/' + citySource;
            $.get(url, function (response) {
                curGeoJson = response;
                echarts.registerMap(mapName, response);
                handleEvents.resetOption(_self, option, mapName);
            });

        }
    };

    return chart;
};

$.getJSON(china, function (geoJson) {
    echarts.registerMap('中国', geoJson);
    var myChart = echarts.extendsMap('echarts1', {
        mapName: '中国', // 地图名
        goDown: true, // 是否下钻
        activeArea: ['黑龙江', '甘肃', '云南', '陕西', '河南', '湖北', '湖南', '江苏', '北京', '天津', {
                name: '宁夏'
            }, {
                name: '浙江'
            }, {
                name: '上海'
            },
            {
                name: '河北'
            }, {
                name: '安徽'
            }, {
                name: '山东'
            }, {
                name: '海南'
            }, {
                name: '广东'
            }, {
                name: '广西'
            }, {
                name: '贵州'
            }, {
                name: '福建'
            }
        ], // 特殊区域数组
        // 下钻回调
        callback: function (name, option, instance) {
            console.log(name, option, instance);
        },
        // 数据展示             
        data: [{
            name: '伊犁哈萨克自治州',
            value: 50,
            level: 1
        }, {
            name: '舟山市',
            value: 12,
            level: 2
        }]
    });
})

// myChart1.setOption({});
// window.addEventListener("resize", function() {
//     myChart1.resize();
// });