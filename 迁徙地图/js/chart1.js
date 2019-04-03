
// echarts颜色
var pieColor = ["#51C3E8","#E79092","#56DDB4","#C49DFD","#D9B65A","#438FE0","#1FCCC2","#CE90AC","#5F7CD3","#CAA168",
				"#3C86EA","#22BDA3","#C4AAFD","#C66487","#A169D6","#559ADA","#ADA0CB","#C9D27D","#92B815","#B383BC"
			];
var barColor = ["#37A4FC","#567CE8","#40E9FE","#DC71C9","#5CD6C7","#FC9D9D","#44D2F9","#435FE7","#2DD19F"];
var lineColor = ["#FC8B3F","#7E9BEB","#22BD8F","#4EBFDF","#3F8FFC","#DC71C9","#DBB546","#DB6F90"];
var tipsBg = "rgba(42,193,236,.85)";
var axisLabelColor = "#9CC6E4"; // 坐标字体颜色

// 流动人口原因构成
var myChart1 = echarts.init(document.getElementById('echarts1'));
myChart1.on('click', function (params) {  //鼠标事件 
    var datas = params;
    console.log(datas);
});
myChart1.setOption({
	color: "pieColor",
	tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)",
        backgroundColor: tipsBg,
    },

    visualMap: {
        show: false,
        min: 80,
        max: 600,
        inRange: {
            colorLightness: [0, 1]
        }
    },
    series: [{
        name: '访问来源',
        type: 'pie',
        radius: '70%',
        center: ['50%', '50%'],
        data: [
            { value: 335, name: '务工' },
            { value: 310, name: '经商' },
            { value: 274, name: '随迁' },
            { value: 235, name: '其他' },
        ].sort(function(a, b) { return a.value - b.value; }),
        roseType: 'radius',
        label: {
            normal: {
                textStyle: {
                    color: '#fff'
                }
            }
        },
        labelLine: {
            normal: {
                lineStyle: {
                    color: '#fff'
                },
                smooth: 0.2,
                length: 10,
                length2: 20
            }
        },
        itemStyle: {
            normal: {
                color: function(params) {
                    return pieColor[0];
                },
                shadowBlur: 200,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        },
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: function(idx) {
            return Math.random() * 200;
        }
    }]
});
window.addEventListener("resize", function() {
	myChart1.resize();
});

//  孩次出生率
var myChart2 = echarts.init(document.getElementById('echarts2'));
myChart2.on('click', function(params) { //鼠标事件 
    var datas = params;
    console.log(datas);
});
myChart2.setOption({
	color: ["#37A4FC","#567CE8"],
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
        		width:2
        	}
        },
        axisLabel:{
        	color: axisLabelColor
        }
    }],
    yAxis: [{
        type: 'value',
        axisLine: {
        	lineStyle: {
        		color: "#447CCD",
        		width:2
        	}
        },
        splitLine:{
        	lineStyle:{
        		color: "rgba(82,141,235,.5)"
        	}
        },
        axisLabel:{
        	color: axisLabelColor
        }

    }],
    series: [
    	{
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
    myChart2.resize();
});

// 流动人口区域排名
var dataSet = [
    [ "青羊区", "22.33万人", "1.23万人","10%"],
    [ "青羊区", "22.33万人", "1.23万人","10%"],
    [ "青羊区", "22.33万人", "1.23万人","10%"],
    [ "青羊区", "22.33万人", "1.23万人","10%"],
    [ "青羊区", "22.33万人", "1.23万人","10%"],
    [ "青羊区", "22.33万人", "1.23万人","10%"],
    [ "青羊区", "22.33万人", "1.23万人","10%"],
    [ "青羊区", "22.33万人", "1.23万人","10%"],
    [ "青羊区", "22.33万人", "1.23万人","10%"],
    [ "青羊区", "22.33万人", "1.23万人","10%"],
    [ "青羊区", "22.33万人", "1.23万人","10%"],
    
];

var tableObj=$(".tableShowInfo").showTable({
    data:dataSet,
    title:[
        "区域",
        "平均人口",
        "流动人口",
        "流动人口占比",
    ],
    scrollHeight:".tableShowInfo",
    scrollHeightPC:45,
    edit:false,
    widthInfo:["25%","25%","25%",-1]  //设置表格固定宽度  -1自适应
});



// 年平均人口数
var myChart4 = echarts.init(document.getElementById('echarts4'));
var mainData = [];
mainData.push({
    name: '新生儿数',
    value: 12.4,
    total: 20,
    color: ["#5779E7","#D6DBED"]
});
mainData.push({
    name: '流动人数',
    value: 12.4,
    total: 20,
    color: ["#FD9D9D","#FFECEC"]
});
mainData.push({
    name: '避孕人数',
    value: 12.4,
    total: 20,
    color: ["#2CF2B6","#EBFFF9"]
});

function createSeries(mainData) {
    var result = [];
    var insideLabel = {
        normal: {
            position: 'center',
            formatter: function(params) {
                return params.value + "万人";
            },
            textStyle: {
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontSize: 16,
                color: "#fff",
            },
        }
    };

    for (var i = 0; i < mainData.length; i++) {
        result.push({
            type: 'pie',
            center: [i * 20 + 45 + '%', '45%'],
            radius: ['38%', '50%'],
            clockwise: false,  //饼图的扇区是否是顺时针排布。
            data: [{
                name: mainData[i].name,
                value: mainData[i].value,
                itemStyle: {
                	normal: {
                	    color: mainData[i].color[0],
                	}
                },
                label: insideLabel,
            }, {
                name: mainData[i].name,
                value: mainData[i].total - mainData[i].value,
                itemStyle: {
                    normal: {
                        color: mainData[i].color[1]
                    }
                	
                },
                label: {
                	formatter: function(params) {
                	    return params.name;
                	},
                	normal: {
                        position: 'outsize',
        	            textStyle: {
        	                fontSize: 18,
        	                color: "#fff",
        	                padding: [230,0,0,-125]
        	            },
        	        }
                },
                labelLine: {
                    normal: {
                        show: false,
                    },
                    emphasis:{
                        show: false
                    }
                }
            }],
        });
    }
    return result;
}
myChart4.setOption({
	title: {
		text: '964.51万人',
	    // x: 'center',
	    y: 'center',
	    left:35,
	    textStyle: {
	        fontWeight: 'normal',
	        color: '#6FC9FF',
	        fontSize: '37'
	    }
	},
    series: createSeries(mainData)
});
window.addEventListener("resize", function() {
    myChart4.resize();
});

// 人口趋势
var myChart5 = echarts.init(document.getElementById('echarts5'));
myChart5.setOption({
	// color: lineColor,  // 公用色
	color: ["#FC8B3F","#9DFF00"],  //设计图色
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
		name: "自然增长率",
		data: [72, 60, 80, 62, 73, 58],
		type: 'line',
		smooth: true,  // 是否平滑曲线显示。
	},{
		name: "年出生率",
		data: [63, 78, 60, 82, 62, 81],
		type: 'line',
		smooth: true,  // 是否平滑曲线显示。
	}]
});
window.addEventListener("resize", function() {
    myChart5.resize();
});

// 出生人口区域排名
var myChart6 = echarts.init(document.getElementById('echarts6'));
myChart6.setOption({
		color: ["#37A4FC","#567CE8"],
	    tooltip: {
	        //触发类型
	        trigger: 'axis',
	        //指示器
	        axisPointer: {
	            type: 'shadow'
	        },
	        backgroundColor: tipsBg,
	    },
	    calculable: true,
	    xAxis: [{
	        type: 'category',
	        data: ['武侯区', '高新区', '青羊区', "天府新区", "龙泉驿区", "锦江区","武侯区","武侯区"],
	        axisLine: {
	        	lineStyle: {
	        		color: "#447CCD",
	        		width:2
	        	}
	        },
	        axisLabel:{
	        	color: axisLabelColor
	        }
	    }],
	    yAxis: [{
	        type: 'value',
	        axisLine: {
	        	lineStyle: {
	        		color: "#447CCD",
	        		width:2
	        	}
	        },
	        name: "万人",
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

	    }],
	    series: [
	    	{
	            name: '孩次率',
	            type: 'bar',
	            data: [80, 70, 95,59,110,88,125,90],
	            barMaxWidth: 30
	        },
	    ]
});
window.addEventListener("resize", function() {
    myChart6.resize();
});

// 初婚年龄分布
var myChart7 = echarts.init(document.getElementById('echarts7'));

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

placeHolderStyle = {
    normal: {
        label: {
            show: false,
        },
        labelLine: {
            show: false,
        },

    },
};
myChart7.setOption({
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
        radius: [145, 160],
        itemStyle: placeHolderStyle,
        data: getData(0.75)
    }, {
        name: '18-29岁',
        type: 'pie',
        clockWise: true, //顺时加载
        hoverAnimation: false, //鼠标移入变大
        radius: [120, 135],
        itemStyle: placeHolderStyle,
        data: getData(0.65,"")
    }, {
        name: '30-45岁',
        type: 'pie',
        clockWise: true, //顺时加载
        hoverAnimation: false, //鼠标移入变大
        radius: [95, 110],
        itemStyle: placeHolderStyle,
        data: getData(0.6)
    }, {
        name: '46岁以上',
        type: 'pie',
        clockWise: true, //顺时加载
        hoverAnimation: false, //鼠标移入变大
        radius: [70, 85],
        itemStyle: placeHolderStyle,
        data: getData(0.5)
    }]
});
window.addEventListener("resize", function() {
    myChart7.resize();
});

// 人工流产区域排名
var myChart8 = echarts.init(document.getElementById('echarts8'));

var tabData = [
	[42, 36, 35, 28, 21, 20, 15, 15, 5],
	[25, 36, 55, 38, 41, 20, 25, 12, 7],
]

var tabOptions = {
	tooltip: {
	    //触发类型
	    trigger: 'axis',
	    //指示器
	    axisPointer: {
	        type: 'shadow'
	    },
	    //提示悬浮文字
	    formatter: "{a} <br/>{b} : {c}",
	    backgroundColor: tipsBg,
	},
	grid: {
	    left: '9%',
	    right: '8%',
	    bottom: '5%',
	    top: '2%',
	    containLabel: true
	},
	xAxis: {
	    type: 'value',
	    nameLocation: 'end',
	    position: 'top',
	    //去掉，坐标尺度
	    axisTick: {
	        show: false
	    },
	    axisLabel: {
	        show: false
	    },
	    axisLine: {
	        show: false
	    },
	    splitLine: {
	        show: false
	    },

	},
	yAxis: {
	    type: 'category',
	    name: '单位名称',
	    nameLocation: 'start',
	    axisTick: {
	        show: false
	    },
	    inverse: 'true', //排序
	    data: ["锦江区", "青羊区", "金牛区", "武侯区", "成华区", "龙泉驿区", "青白江区", "温江区", "双流区"],
	    axisLine: {
	        lineStyle: {
	            color: "#577BE8",
	            width: 1
	        }
	    },
	    axisLabel:{
	    	fontSize: 16,
	    	color: '#75CAF0'
	    }
	},
	series: [{
	    name: '人工流产',
	    type: 'bar',
	    barMaxWidth: 20,
	    itemStyle: {
	        normal: {
	            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
	                offset: 0,
	                color: '#5779E7'
	            }, {
	                offset: 1,
	                color: '#40E9FE'
	            }]),
	        }
	    },
	    data: tabData[0],
	    label: {
	    	normal: {
	    		show: true,
	    		position: 'right',
	    		textStyle: {
	    			color: '#fff',
	    			fontSize: 16
	    		},
	    		formatter: '{c}万人',
	    		padding:20
	    	}
	    }
	}],
}
myChart8.setOption(tabOptions);
window.addEventListener("resize", function() {
    myChart8.resize();
});

// 点击切换图表8
$(".tabList").find(".tab").click(function(event) {
	$(this).addClass('on').siblings().removeClass('on');
	var item = $(this).index();
	myChart8.clear(); 
	tabOptions.series[0].data = tabData[item];
	myChart8.setOption(tabOptions);
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
