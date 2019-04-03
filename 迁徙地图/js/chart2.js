$(".container").panel({
    iWheelStep:32
});

// echarts颜色
var pieColor = ["#51C3E8", "#E79092", "#56DDB4", "#C49DFD", "#D9B65A", "#438FE0", "#1FCCC2", "#CE90AC", "#5F7CD3", "#CAA168",
    "#3C86EA", "#22BDA3", "#C4AAFD", "#C66487", "#A169D6", "#559ADA", "#ADA0CB", "#C9D27D", "#92B815", "#B383BC"
];
var barColor = ["#37A4FC", "#567CE8", "#40E9FE", "#DC71C9", "#5CD6C7", "#FC9D9D", "#44D2F9", "#435FE7", "#2DD19F"];
var lineColor = ["#FC8B3F", "#7E9BEB", "#22BD8F", "#4EBFDF", "#3F8FFC", "#DC71C9", "#DBB546", "#DB6F90"];
var tipsBg = "rgba(42,193,236,.85)";
var axisLabelColor = "#9CC6E4"; // 坐标字体颜色

// 婴儿死亡率
var myChart1 = echarts.init(document.getElementById('echarts1'));
myChart1.on('click', function(params) { //鼠标事件 
    console.log(params)
});
myChart1.setOption({
    // color: lineColor,  // 公用色
    color: ["#FC8B3F", "#9DFF00"], //设计图色
    tooltip: {
        trigger: 'axis',
        backgroundColor: tipsBg,
    },
    legend: {
        data: ['自然增长率', '年出生率'],
        type: "plain",
        textStyle: {
            color: "#fff"
        }
    },
    xAxis: {
        type: 'category',
        data: ['2013', '2014', '2015', '2016', '2017', '2017'],
        axisLine: {
            lineStyle: {
                color: "#447CCD",
                width: 2
            }
        },
        axisLabel: {
            color: axisLabelColor
        }
    },
    yAxis: {
        type: 'value',
        name: "百分比",
        axisLine: {
            lineStyle: {
                color: "#447CCD",
                width: 2
            }
        },
        nameTextStyle: {
            color: "#fff"
        },
        splitLine: {
            lineStyle: {
                color: "rgba(82,141,235,.5)"
            }
        },
        axisLabel: {
            color: axisLabelColor
        }
    },
    series: [{
        name: "自然增长率",
        data: [72, 60, 80, 62, 73, 58],
        type: 'line',
        smooth: true, // 是否平滑曲线显示。
    }, {
        name: "年出生率",
        data: [63, 78, 60, 82, 62, 81],
        type: 'line',
        smooth: true, // 是否平滑曲线显示。
    }]
});

window.addEventListener("resize", function() {
    myChart1.resize();
});



// 生育率
var myChart2 = echarts.init(document.getElementById('echarts2'));
var dataStyle = {
    normal: {
        label: {
            show: false
        },
        labelLine: {
            show: false
        },
        shadowBlur: 40,
        shadowColor: 'rgba(40, 40, 40, 0.5)',
    }
};

var placeHolderStyle = {
    normal: {
        color: 'rgba(44,59,70,1)', // 未完成的圆环的颜色
        label: {
            show: false
        },
        labelLine: {
            show: false
        }
    },
    emphasis: {
        color: '#1E324A' // 未完成的圆环的颜色
    }
};
myChart2.setOption({
    color: pieColor,
    tooltip: {
        show: false,
    },
    toolbox: {
        show: false,
    },
    series: [{
        name: '符合政策生育率',
        type: 'pie',
        clockWise: false,
        radius: [80, 85],
        itemStyle: dataStyle,
        hoverAnimation: false,
        center: ['33%', '45%'],
        data: [{
            value: 23,
            label: {
                normal: {
                    formatter: '{d}%',
                    position: 'center',
                    show: true,
                    textStyle: {
                        fontSize: '36',
                        fontWeight: 'normal',
                        color: '#fff',
                        padding: [80, 0, 0, 0]
                    }
                }
            },
            itemStyle: {
                normal: {
                    color: '#37A4FC',
                    shadowColor: '#3dd4de',
                    shadowBlur: 10
                }
            }
        }, {
            value: 77,
            name: '符合政策生育率',
            itemStyle: placeHolderStyle,
            label: {
                normal: {
                    formatter: '{a}',
                    position: 'center',
                    show: true,
                    textStyle: {
                        fontSize: '18',
                        fontWeight: 'normal',
                        color: '#fff',
                        padding: [170, 0, 0, 0]
                    }
                }
            },
        }]
    }, {
        name: '怀孕过预产期未生育率',
        type: 'pie',
        clockWise: false,
        radius: [80, 85],
        itemStyle: dataStyle,
        hoverAnimation: false,
        center: ['66%', '45%'],
        data: [{
            value: 52,
            label: {
                normal: {
                    formatter: '{d}%',
                    position: 'center',
                    show: true,
                    textStyle: {
                        fontSize: '36',
                        fontWeight: 'normal',
                        color: '#fff',
                        padding: [80, 0, 0, 0]
                    }
                }
            },
            itemStyle: {
                normal: {
                    color: '#C554FF',
                    shadowColor: '#3dd4de',
                    shadowBlur: 10
                }
            }
        }, {
            value: 48,
            name: '怀孕过预产期未生育率',
            itemStyle: placeHolderStyle,
            label: {
                normal: {
                    formatter: '{a}',
                    position: 'center',
                    show: true,
                    textStyle: {
                        fontSize: '18',
                        fontWeight: 'normal',
                        color: '#fff',
                        padding: [170, 0, 0, 0]
                    }
                }
            },
        }]
    }]
});
window.addEventListener("resize", function() {
    myChart2.resize();
});

// 出生性别分布
var myChart3 = echarts.init(document.getElementById('echarts3'));
myChart3.setOption({
    color: pieColor,
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)",
        backgroundColor: tipsBg,
    },
    series: [{
        name: '访问来源',
        type: 'pie',
        radius: '70%',
        center: ['50%', '45%'],
        clockwise: false, //是否顺时针
        data: [
            { value: 5632, name: '出生女婴' },
            { value: 2345, name: '出生男婴' },
        ],
        itemStyle: {
            emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        }
    }]
});
window.addEventListener("resize", function() {
    myChart3.resize();
});

// 婚姻状况
var myChart4 = echarts.init(document.getElementById('echarts4'));
myChart4.setOption({
    tooltip: {
        show: true,
        trigger: 'item',
        formatter: "{b} <br/>人数: {c} 人 <br/> 占比：%",
        backgroundColor: tipsBg,
    },
    series: [{
        type: 'treemap',
        height: "95%",
        bottom: 15,
        roam: false, //是否开启移动和缩放
        nodeClick: false, //节点点击无反应
        data: [{
            name: '婚姻状况', // First tree
            color: pieColor,
            value: 100,
            children: [{
                name: '未婚', // First leaf of first tree
                value: 30,
            }, {
                name: '早婚', // First leaf of first tree
                value: 20
            }, {
                name: '有效婚姻', // First leaf of first tree
                value: 20
            }, {
                name: '晚婚', // First leaf of first tree
                value: 10
            }, {
                name: '离婚', // First leaf of first tree
                value: 8
            }, {
                name: '再婚', // First leaf of first tree
                value: 7
            }, {
                name: '丧婚', // First leaf of first tree
                value: 2
            }, {
                name: '事实婚姻', // First leaf of first tree
                value: 3
            }]
        }],
        breadcrumb: {
            show: false,
        },
    }],
});
window.addEventListener("resize", function() {
    myChart4.resize();
});

// 孩次率
var myChart5 = echarts.init(document.getElementById('echarts5'));
myChart5.setOption({
    color: ["#37A4FC", "#567CE8"],
    // grid: {
    // 	top: 10  //图表位置
    // },
    tooltip: {
        //触发类型
        trigger: 'axis',
        //指示器
        axisPointer: {
            type: 'shadow'
        },
        backgroundColor: tipsBg,
    },
    legend: {
        data: ['孩次率', '孩次出生率'],
        textStyle: {
            color: "#fff"
        },
    },
    calculable: true,
    xAxis: [{
        type: 'category',
        data: ['一孩', '二孩', '三孩以上'],
        axisLine: {
            lineStyle: {
                color: "#447CCD",
                width: 2
            }
        },
        axisLabel: {
            color: axisLabelColor
        }
    }],
    yAxis: [{
        type: 'value',
        axisLine: {
            lineStyle: {
                color: "#447CCD",
                width: 2
            }
        },
        splitLine: {
            lineStyle: {
                color: "rgba(82,141,235,.5)"
            }
        },
        axisLabel: {
            color: axisLabelColor
        }

    }],
    series: [{
            name: '孩次率',
            type: 'bar',
            data: [80, 58, 50],
            barMaxWidth: 30
        },
        {
            name: '孩次出生率',
            type: 'bar',
            data: [65, 42, 66],
            barMaxWidth: 30
        }
    ]
});
window.addEventListener("resize", function() {
    myChart5.resize();
});

// 年龄组初婚率
var myChart6 = echarts.init(document.getElementById('echarts6'));

function getData(percent) {
    return [{
        value: percent,
        name: percent,
    }, {
        value: 1 - percent,
        itemStyle: {
            normal: {
                color: 'transparent'
            }
        }
    }];
}

placeHolderStyle6 = {
    normal: {
        label: {
            show: false,
        },
        labelLine: {
            show: false,
        },

    },
};
myChart6.setOption({
    color: pieColor,
    tooltip: {
        trigger: 'item',
        formatter: function(params, ticket, callback) {
            return params.seriesName + ": " + params.name * 100 + "%";
        },
        backgroundColor: tipsBg,

    },
    legend: {
        top: 0,
        left: "30%",
        itemHeight: 15,
        data: ['18岁以下', '18-29岁', '30-45岁', '46岁以上'],
        textStyle: {
            color: '#75CAF0'
        },

        selectedMode: true,
        orient: "vertical",

    },
    series: [{
        name: '18岁以下',
        type: 'pie',
        clockWise: true, //顺时加载
        hoverAnimation: false, //鼠标移入变大
        radius: [125, 140],
        itemStyle: placeHolderStyle6,
        data: getData(0.75)
    }, {
        name: '18-29岁',
        type: 'pie',
        clockWise: true, //顺时加载
        hoverAnimation: false, //鼠标移入变大
        radius: [100, 115],
        itemStyle: placeHolderStyle6,
        data: getData(0.65, "")
    }, {
        name: '30-45岁',
        type: 'pie',
        clockWise: true, //顺时加载
        hoverAnimation: false, //鼠标移入变大
        radius: [75, 90],
        itemStyle: placeHolderStyle6,
        data: getData(0.6)
    }, {
        name: '46岁以上',
        type: 'pie',
        clockWise: true, //顺时加载
        hoverAnimation: false, //鼠标移入变大
        radius: [50, 65],
        itemStyle: placeHolderStyle6,
        data: getData(0.5)
    }]
});
window.addEventListener("resize", function() {
    myChart6.resize();
});

// 家庭构成
var myChart7 = echarts.init(document.getElementById('echarts7'));
myChart7.setOption({
    color: pieColor,
    tooltip: {
        trigger: 'item',
        formatter: "{b}: {c} ({d}%)",
        backgroundColor: tipsBg,
    },
    legend: {
        orient: 'vertical',
        x: 'right',
        data: ['一女', '一男', '一男一女', '二男', '二女',
            '三孩以上', '无子女', '伤残', '不详'
        ],
        textStyle: {
            color: '#fff',
        },
        itemGap: 5, // 图例间的纵向距离
        padding: [0, 20, 0, 0],
        align: 'left'
    },
    series: [{
        name: '家庭构成',
        type: 'pie',
        radius: ['65%', '85%'],
        center: ['45%', '47%'],
        avoidLabelOverlap: false,
        label: {
            normal: {
                show: false,
                position: 'center'
            },
            emphasis: {
                show: true,
                position: 'outside',
                textStyle: {
                    fontSize: '16',
                }
            }
        },
        labelLine: {
            normal: {
                show: false
            }
        },
        data: [
            { value: 50, name: '一女' },
            { value: 80, name: '一男' },
            { value: 90, name: '一男一女' },
            { value: 60, name: '二男' },
            { value: 20, name: '二女' },
            { value: 100, name: '三孩以上' },
            { value: 150, name: '无子女' },
            { value: 70, name: '伤残' },
            { value: 200, name: '不详' },
        ]
    }],

});
window.addEventListener("resize", function() {
    myChart7.resize();
});

// 年龄组生育率
var myChart8 = echarts.init(document.getElementById('echarts8'));
myChart8.setOption({
    tooltip: {
        show: true,
        trigger: 'item',
        formatter: "{b}率 <br/>生育人数: {c} 人 <br/> 生育占比：%",
        backgroundColor: tipsBg,
    },
    series: [{
        type: 'treemap',
        height: "95%",
        bottom: 15,
        roam: false, //是否开启移动和缩放
        nodeClick: false, //节点点击无反应
        data: [{
            name: '年龄组生育率', // First tree
            color: pieColor,
            value: 100,
            children: [{
                name: '18-29岁生育', // First leaf of first tree
                value: 30,
            }, {
                name: '30-45岁生育', // First leaf of first tree
                value: 30
            }, {
                name: '18岁以下生育', // First leaf of first tree
                value: 15
            }, {
                name: '45-60岁生育', // First leaf of first tree
                value: 15
            }, {
                name: '60岁以上生育', // First leaf of first tree
                value: 10
            }]
        }],
        breadcrumb: {
            show: false,  //面包屑
        },

    }],
});
window.addEventListener("resize", function() {
    myChart8.resize();
});

// 区域联动
var o = $("#regional").areaObj();

function addHead(json,str){
    str=str||json[0].name;
    var ele = o.addHeaderItem(str);
    $.each(json,function(){
        ele.childInfo =this;
        ele.on("click",function(){
            o.removeHeadItemAfterAll(ele.protoId);
            o.removeContent();
            if(ele.childInfo.child&&ele.childInfo.child.length){
                $.each(ele.childInfo.child,function(){
                   var eles = o.addContentItem(this.name);
                    var THIS = this;
                    eles.on("click",function(e){
                        e.stopPropagation();
                        o.removeContent();
                        if(THIS.child&&THIS.child.length){
                            addHead([THIS],THIS.name);
                        }else{
                            var str = "";
                            $.each(o.headItemArr,function(){
                                str+=this.html();
                            })
                            $("#regional").html(str);
                            o.close();

                        };
                        
                    });
                });
            }
        });
        if(this.child&&this.child.length){
            $.each(ele.childInfo.child,function(){
                var eles = o.addContentItem(this.name);
                var THIS = this;
                eles.on("click",function(e){
                    e.stopPropagation();
                    o.removeContent();
                    if(THIS.child&&THIS.child.length){
                        addHead([THIS],THIS.name);
                    }else{
                            var str = "";
                            $.each(o.headItemArr,function(){
                                str+=this.html();
                            })
                            $("#regional").html(str);
                            o.close();
                    };
                    
                });
            });
        }
    });
}
var json = [
    {
        name:"全国",
        child:testJson
    }
];
addHead(json);