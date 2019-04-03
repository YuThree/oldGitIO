//滚动条
$(".scoll").panel({
    iWheelStep:32,
    scrollWIng:function(){
        console.log(arguments);
    }
});

//下拉
$(".cdct_select").simulationSelect({selectText:'{a}<span class="selectDown"></span>'});

// 面包屑
for(var i = 1;i <= $('.MBnavigationBox').length;i++){
    var str = '.MBnavigationBox' + i;
    $(str).MBnavigation({
        controller:{
            left:$(str).find(".leftA"),
            right:$(str).find(".rightA"),
            isShow:false
        },
        childFirst: $(str).find(".childBox"),
        xPC:60
    });
}

$(".MBnavigationBox").find(".MBnavigation").on("click",function(){
    var allEle= $(this).parent().parent().find(".MBnavigation");
    allEle.removeClass("change");
    $(this).addClass("change");
});

/*柱状  */ 
var arr1 = [{
            leg:['直接访问量','网站访问量'],
            X:['周一','周二','周三','周四','周五','周六','周日'],
            series:[{
                        name: "直接访问量",
                        type: 'bar',      //必须不能改变
                        data: [325, 200, 305, 150, 100, 220,165]
                    },{
                        name: '网站访问量',
                        type: 'bar',
                        data: [250, 350, 260, 100, 195, 230,150]
                    }]
            },{
            leg:['直接访问量','网站访问量'],
            X:['周一','周二','周三','周四','周五','周六','周日'],
            series:[{
                        name: "直接访问量",
                        type: 'bar',      //必须不能改变
                        data: [112, 200, 305, 150, 100, 220,165]
                    },{
                        name: '网站访问量',
                        type: 'bar',
                        data: [231, 350, 260, 100, 195, 230,150]
                    }]
            },{
            leg:['直接访问量','网站访问量'],
            X:['周一','周二','周三','周四','周五','周六','周日'],
            series:[{
                        name: "直接访问量",
                        type: 'bar',      //必须不能改变
                        data: [212, 200, 305, 150, 100, 220,165]
                    },{
                        name: '网站访问量',
                        type: 'bar',
                        data: [250, 350, 260, 100, 195, 230,150]
                    }]
            },{
            leg:['直接访问量','网站访问量'],
            X:['周一','周二','周三','周四','周五','周六','周日'],
            series:[{
                        name: "直接访问量",
                        type: 'bar',      //必须不能改变
                        data: [111, 200, 305, 150, 100, 220,165]
                    },{
                        name: '网站访问量',
                        type: 'bar',
                        data: [250, 350, 260, 100, 195, 230,150]
                    }]
            },{
            leg:['直接访问量','网站访问量'],
            X:['周一','周二','周三','周四','周五','周六','周日'],
            series:[{
                        name: "直接访问量",
                        type: 'bar',      //必须不能改变
                        data: [454, 200, 305, 150, 100, 220,165]
                    },{
                        name: '网站访问量',
                        type: 'bar',
                        data: [250, 350, 260, 100, 195, 230,150]
                    }]
            },{
            leg:['直接访问量','网站访问量'],
            X:['周一','周二','周三','周四','周五','周六','周日'],
            series:[{
                        name: "直接访问量",
                        type: 'bar',      //必须不能改变
                        data: [552, 200, 305, 150, 100, 220,165]
                    },{
                        name: '网站访问量',
                        type: 'bar',
                        data: [250, 350, 260, 100, 195, 230,150]
                    }]
            },{
            leg:['直接访问量','网站访问量'],
            X:['周一','周二','周三','周四','周五','周六','周日'],
            series:[{
                        name: "直接访问量",
                        type: 'bar',      //必须不能改变
                        data: [231, 200, 305, 150, 100, 220,165]
                    },{
                        name: '网站访问量',
                        type: 'bar',
                        data: [250, 350, 260, 100, 195, 230,150]
                    }]
            },{
            leg:['直接访问量','网站访问量'],
            X:['周一','周二','周三','周四','周五','周六','周日'],
            series:[{
                        name: "直接访问量",
                        type: 'bar',      //必须不能改变
                        data: [231, 200, 305, 150, 100, 220,165]
                    },{
                        name: '网站访问量',
                        type: 'bar',
                        data: [421, 350, 260, 100, 195, 230,150]
                    }]
            },];
var Obj1 = $(".charts1").jqEcharts({
        option:  null,
        type:"2",
        columnTitleX:"center",
        columnTitleY:"bottom",
        columnLegendData:arr1[0].leg,
        columnXAxisData:arr1[0].X,
        columnSeries:arr1[0].series,
        columnYAxisInterval:80,
    });

$("#z1 .MBnavigation").on("click",function(){
    var data = arr1[this.getAttribute("data-index")]
    Obj1[0].setOption({
        xAxis: [{
            data: data.X
        }],
        legend:{
           data:data.leg 
        },
        series:data.series,
        
    });
})

var arr2 = [{
            leg:['直接访问', '邮件营销','联盟广告'],
            series:[
                    {
                        name: '直接访问',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        data: [320, 302, 301, 334, 390, 330, 320]
                    },
                    {
                        name: '邮件营销',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        data: [120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                        name: '联盟广告',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        data: [220, 182, 191, 234, 290, 330, 310]
                    }
                ]
            },{
            leg:['直接访问', '邮件营销','联盟广告'],
            series:[
                    {
                        name: '直接访问',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        data: [323, 102, 201, 234, 390, 330, 320]
                    },
                    {
                        name: '邮件营销',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        data: [120, 232, 201, 134, 90, 230, 210]
                    },
                    {
                        name: '联盟广告',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        data: [320, 282, 191, 234, 290, 330, 310]
                    }
                ]
            },{
            leg:['直接访问', '邮件营销','联盟广告'],
            series:[
                    {
                        name: '直接访问',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        data: [120, 202, 301, 334, 390, 330, 320]
                    },
                    {
                        name: '邮件营销',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        data: [320, 132, 101, 334, 190, 230, 210]
                    },
                    {
                        name: '联盟广告',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        data: [120, 182, 191, 234, 290, 330, 310]
                    }
                ]
            },{
            leg:['直接访问', '邮件营销','联盟广告'],
            series:[
                    {
                        name: '直接访问',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        data: [120, 102, 301, 334, 390, 330, 320]
                    },
                    {
                        name: '邮件营销',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        data: [120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                        name: '联盟广告',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        data: [320, 282, 191, 234, 290, 330, 310]
                    }
                ]
            }];


var  option = {
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    legend: {
        data: arr2[0].leg
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis:  {
        type: 'value',  
        axisLine:{  
            lineStyle:{  
                color:'#bbbec3',  
                width:1, 
            }  
        }
    },
    yAxis: {
        type: 'category',
        data: ['周一','周二','周三','周四','周五','周六','周日'],
        axisLine:{  
            lineStyle:{  
                color:'#bbbec3',  
                width:1, 
            }  
        }
    },
    series: arr2[0].series
};

var Obj2 = $(".charts2").jqEcharts({
        option:  option,
        type:"-1",
        columnTitleX:"center",
        columnTitleY:"bottom",
        columnYAxisInterval:80,
    });

$(".hideUlLi").on("click",function(){
    var data = arr2[this.getAttribute("data-index")]
    Obj2[0].setOption({
        legend:{
           data:data.leg 
        },
        series:data.series,
    });
})