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


// echarts颜色
var pieColor = ["#51C3E8","#E79092","#56DDB4","#C49DFD","#D9B65A","#438FE0","#1FCCC2","#CE90AC","#5F7CD3","#CAA168",
                "#3C86EA","#22BDA3","#C4AAFD","#C66487","#A169D6","#559ADA","#ADA0CB","#C9D27D","#92B815","#B383BC"
            ];
var barColor = ["#37A4FC","#567CE8","#40E9FE","#DC71C9","#5CD6C7","#FC9D9D","#44D2F9","#435FE7","#2DD19F"];
var lineColor = ["#FC8B3F","#7E9BEB","#22BD8F","#4EBFDF","#3F8FFC","#DC71C9","#DBB546","#DB6F90"];
var tipsBg = "rgba(42,193,236,.85)";
var axisLabelColor = "#9CC6E4"; // 坐标字体颜色

// 区域人口增长趋势
var myChart1 = echarts.init(document.getElementById('echarts1'));
myChart1.on('click', function (params) {  //鼠标事件 
    var datas = params;
    console.log(datas);
});
myChart1.setOption({
    color: lineColor,
    tooltip: {
        trigger: 'axis',
        backgroundColor: tipsBg,
    },
    legend: {
        data: ['年死亡率', '年出生率','自然增长率'],
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
                width:2
            }
        },
        axisLabel:{
            color: axisLabelColor
        }
    },
    yAxis: {
        type: 'value',
        name: "百分比",
        axisLine: {
            lineStyle: {
                color: "#447CCD",
                width:2
            }
        },
        nameTextStyle: {
            color: "#fff"
        },
        splitLine:{
            lineStyle:{
                color: "rgba(82,141,235,.5)"
            }
        },
        axisLabel:{
            color: axisLabelColor
        }
    },
    series: [{
        name: "年死亡率",
        data: [72, 60, 80, 62, 73, 58],
        type: 'line',
        smooth: true,  // 是否平滑曲线显示。
    },{
        name: "年出生率",
        data: [63, 78, 60, 56, 62, 81],
        type: 'line',
        smooth: true,  // 是否平滑曲线显示。
    },{
        name: "自然增长率",
        data: [80, 25, 60, 82, 45, 32],
        type: 'line',
        smooth: true,  // 是否平滑曲线显示。
    }]
});
window.addEventListener("resize", function() {
    myChart1.resize();
});

// 户口占比
var myChart2 = echarts.init(document.getElementById('echarts2'));
var datas2 = [
    {name: '农业人口',value: 3534,},
    {name: '非农业人口', value: 3544,},
    {name: '其他',value: 3434,},
]
var seriesObj2 = [];

var itemStyle2 = {
    normal: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: '#40E7FE'
        }, {
            offset: 1,
            color: '#567EE8'
        }])
    }
}

var label2 = {
    normal: {
        position: 'center'
    }
};

for(var i = 0; i < datas2.length; i ++ ){
    var items = {};
    var mydata = [{
        value: 75,
        name: datas2[i].name,
        itemStyle:itemStyle2,
        label: {
            normal: {
                formatter: datas2[i].name,
                textStyle: {
                    color: '#fff',
                    fontSize: 16
                }
            }
        }
        }, {
            value: 25,
            label: {
                normal: {
                    formatter: '' + datas2[i].value,
                    textStyle: {
                        color: '#40E7FE',
                        fontSize: 18

                    }   
                }
            },
            itemStyle: {
               normal: {
                    color: 'transparent'
               }
            }
        },{
            value: 0,
            name: '%',
            label: {
                normal: {
                    formatter: '单位:万/人',
                    textStyle: {
                        color: '#fff',
                        fontSize: 16

                    }
                }
            }
       }]
    items.name = datas2[i].name;
    items.type = 'pie',
    items.radius = [100, 120],
    items.center = [ i *  30 + 16 + '%','50%'],
    items.startAngle = 225,
    items.label = label2,
    items.data = mydata
    seriesObj2.push(items);
    console.log(seriesObj2)
}
myChart2.setOption({
    series: seriesObj2
});
window.addEventListener("resize", function() {
    myChart2.resize();
});

// 人数统计
var myChart3 = echarts.init(document.getElementById('echarts3'));

var dataStyle3 = {
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

var placeHolderStyle3 = {
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
var datas3 = [
    {name: '计划生育登记人数',value: 56448, total: 100000},
    {name: '育龄妇女人数', value: 45812, total: 100000},
    {name: '男性人数',value: 84611, total: 100000},
    {name: '女性人数',value: 16461, total: 100000}
]
var seriesObj3 = [];

for(var i = 0; i < datas3.length; i ++ ){
    var items = {};
    var datas = [{
        value: datas3[i].value,
        label: {
            normal: {
                formatter: '{c}',
                position: 'center',
                show: true,
                textStyle: {
                    fontSize: '20',
                    fontWeight: 'normal',
                    color: '#fff',
                    padding: [45, 0, 0, 0]
                }
            }
        },
        itemStyle: {
            normal: {
                color: pieColor[i],
                shadowColor: '#20354E',
                shadowBlur: 10
            }
        }
    },{
        value: datas3[i].total - datas3[i].value,
        name: datas3[i].name,
        itemStyle: placeHolderStyle3,
        label: {
            normal: {
                formatter: '{a}',
                position: 'center',
                show: true,
                textStyle: {
                    fontSize: '16',
                    fontWeight: 'normal',
                    color: '#fff',
                    padding: [120, 0, 0, 0]
                }
            }
        },
    }];
    items.name = datas3[i].name;
    items.type = 'pie',
    items.clockWise = false,   //是否顺时针
    items.radius = [55, 60],
    items.itemStyle = dataStyle3,
    items.hoverAnimation = false,
    items.center = [ i *  24 + 13 + '%','40%'],
    items.data = datas
    seriesObj3.push(items);
}

myChart3.setOption({
    color: pieColor,
    tooltip: {
        show: false,
    },
    toolbox: {
        show: false,
    },
    series: seriesObj3
    
});
window.addEventListener("resize", function() {
    myChart3.resize();
});

// 健康状况占比
var myChart4 = echarts.init(document.getElementById('echarts4'));
myChart4.setOption({
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
            { value: 335, name: '健康或良好人数' },
            { value: 310, name: '先天性疾病人数' },
            { value: 274, name: '后天性疾病人数' },
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
    myChart4.resize();
});

// 年龄组死亡率
var myChart5 = echarts.init(document.getElementById('echarts5'));
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
myChart5.setOption({
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
        right: 20,
        itemHeight: 15,
        data: ['0-6岁', '7-17岁', '18-40岁', '41-65岁','66岁以上'],
        textStyle: {
            color: '#75CAF0'
        },

        selectedMode: true,
        orient: "vertical",

    },
    series: [{
        name: '0-6岁',
        type: 'pie',
        clockWise: true, //顺时加载
        hoverAnimation: false, //鼠标移入变大
        radius: [85, 95],
        itemStyle: placeHolderStyle6,
        data: getData(0.75)
    }, {
        name: '7-17岁',
        type: 'pie',
        clockWise: true, //顺时加载
        hoverAnimation: false, //鼠标移入变大
        radius: [70, 80],
        itemStyle: placeHolderStyle6,
        data: getData(0.65, "")
    }, {
        name: '18-40岁',
        type: 'pie',
        clockWise: true, //顺时加载
        hoverAnimation: false, //鼠标移入变大
        radius: [55, 65],
        itemStyle: placeHolderStyle6,
        data: getData(0.6)
    }, {
        name: '41-65岁',
        type: 'pie',
        clockWise: true, //顺时加载
        hoverAnimation: false, //鼠标移入变大
        radius: [40, 50],
        itemStyle: placeHolderStyle6,
        data: getData(0.5)
    }, {
        name: '66岁以上',
        type: 'pie',
        clockWise: true, //顺时加载
        hoverAnimation: false, //鼠标移入变大
        radius: [25, 35],
        itemStyle: placeHolderStyle6,
        data: getData(0.5)
    }]
});
window.addEventListener("resize", function() {
    myChart5.resize();
});

