/**
 * Created by CDCT on 2018/3/8.
 *    type  图象类型  -1为不指定，根据option自行生产     0为折线图       1为柄状图     2为柱状图（支持无限级）   3为环状图 4为曲线图
 *    曲线，折线（ line）图参数说明：
 *       1、 lineTitleTxt-为折线图的标题   
 *       2、lineTitleX-标题x轴的位置，三个方位left、center、right.(也支持px和%，一般不设数字)
 *       3、lineTitleY-标题Y轴的位置bottom、top   (也支持px和%，一般不设数字)
 *       4、lineXdata--折线要X轴数据
 *       5、lineYinterval-number类型， 折线图y轴刻度。   
 *       6、lineSeriesName-折线鼠标移入提示内容。 
 *       7、lineSeriesData-折线数据
 * 		 8、lineAreaFill 区域填充
 *    柄状（Handle）图参数说明：
 *       1、handleTitleTxt-柄状图的标题   
 *       2、handleTitleX-标题x轴的位置，三个方位left、center、right(也支持px和%，一般不设数字)
 *       3、handleTitleY-标题Y轴的位置bottom、top  (也支持px和%，一般不设数字)
 *       4、handleLegendData-左侧显示的小图
 *       5、handleSeriesData-鼠标移入详情数据
 *    柱状（Column）图参数说明：
 *       1、columnTitleTxt-柱状图的标题   
 *       2、columnTitleX-标题x轴的位置，三个方位left、center、right.(也支持px和%，一般不设数字)
 *       3、columnTitleY-标题Y轴的位置bottom、top  (也支持px和%，一般不设数字) 
 *       4、columnLegendData-小图标数据
 *       5、columnXAxisData-x轴数据
 *       6、columnYAxisInterval-Y轴刻度
 *       7、columnSeries-主体数据（一个{}表示一条）
 * 	   环状图参数说明:
 * 		 1、circularGraphData 主要数据
 * 		 2、circularGraphName 标题
 *		 3、circularGraphSub 标题下面的下标
 */

$.fn.jqEcharts=function(Obj){
        var defaultObj={
            option:null,
            type:"-1",
            lineTitleTxt:"",
            lineTitleX:"center",
            lineTitleY:"bottom",
            lineXdata:[],
            lineYinterval:100,
            lineSeriesName:"",
			lineSeriesData:[],
			lineAreaFill:true,
            handleTitleTxt:"",
            handleTitleX:"center",
            handleTitleY:"bottom",
            handleLegendData:[],
            handleSeriesData:[],
            handleSeriesLabform:"{d}%",
            columnTitleTxt:"",
            columnTitleX:"center",
            columnTitleY:"bottom",
            columnLegendData:[],
            columnXAxisData:[],
            columnYAxisInterval:100,
			columnSeries:[],
			circularGraphName:"",
			circularGraphSub:"",
            circularGraphData:[]
        };
        $.extend(defaultObj,Obj);
        var arr= new Array();
        var O =null;

        if(this.length==1){
            O = echarts.init(this[0]);
            O.ele=this[0];
        }else if(this.length==0){
            return console.log("jq is not find element");
        }

        switch (defaultObj.type){
            case "-1":{
                $.each(this,function(){
                    O = echarts.init(this);
                    $(window).resize(function() {
						 O.resize();
					});
                    O.setOption(defaultObj.option);
                    O.ele=this;
                    arr.push(O);
                });
                break;
            }
           /* 折线图*/
            case "0":{
                $.each(this,function(){
                    O = echarts.init(this);
                    $(window).resize(function() {
						 O.resize();
					});
					var D={
                        title: {
                            text: defaultObj.lineTitleTxt,
                             x:defaultObj.lineTitleX,  
							 y:defaultObj.lineTitleY,
                        },
                       tooltip : {
					            trigger: 'axis',
					            axisPointer: {
					                type: 'cross',
					                label: {
					                    backgroundColor: '#6a7985'
					                }
					            }
					        },
					        color:['#1A91EB'],
					        lineStyle:{
					            normal:{
					                color:'#1A91EB'
					            }
					        },
					        areaStyle:{
					            normal:{
					                //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
					                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
					                    offset: 0,
					                    color: 'rgba(26,145,235,0.39)'
					                }, {
					                    offset: .34,
					                    color: 'rgba(26,145,235,0.25)'
					                },{
					                    offset: 1,
					                    color: 'rgba(26,145,235,0.00)'
					                }])
					
					            }
					        },
					        grid: {                //图像离各边的距离
					            left: '30px',
					            right: '30px',
					            bottom: '30px',
					            containLabel: true
					        },
					        xAxis : [
					            {
					                type : 'category',
					                boundaryGap : false,
					                axisLine:{
					                    lineStyle:{
					                        color:'#bbbec3',
					                    }
					                },
					                data : defaultObj.lineXdata
					            }
					        ],
					        yAxis : [
					            {
					                interval:defaultObj.lineYinterval,      
					                axisLine:{
					                    lineStyle:{
					                        color:'#bbbec3',
					                    }
					                },
					                type : 'value'
					            }
					        ],
					        series : [
					            {
					                name:defaultObj.lineSeriesName,
					                type:'line',
					                /*stack: '总量',*/
					                label: {
					                    normal: {
					                        show: true,
					                        position: 'top'
					                    }
					                },
					                areaStyle: {normal: {}},
					                data:defaultObj.lineSeriesData
					            },
					
					        ]
					}
					if(defaultObj.lineAreaFill!=true){
						delete D.tooltip.areaStyle;
					}
                    O.setOption(D);
                    O.ele=this;
                    arr.push(O);
                });
                break;
			}
			case "4":{
                $.each(this,function(){
                    O = echarts.init(this);
                    $(window).resize(function() {
						 O.resize();
					});
					var D={
                        title: {
                            text: defaultObj.lineTitleTxt,
                             x:defaultObj.lineTitleX,  
							 y:defaultObj.lineTitleY,
                        },
                       tooltip : {
					            trigger: 'axis',
					            axisPointer: {
					                type: 'cross',
					                label: {
					                    backgroundColor: '#6a7985'
					                }
					            }
					        },
					        color:['#1A91EB'],
					        lineStyle:{
					            normal:{
					                color:'#1A91EB'
					            }
					        },
					        areaStyle:{
					            normal:{
					                //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
					                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
					                    offset: 0,
					                    color: 'rgba(26,145,235,0.39)'
					                }, {
					                    offset: .34,
					                    color: 'rgba(26,145,235,0.25)'
					                },{
					                    offset: 1,
					                    color: 'rgba(26,145,235,0.00)'
					                }])
					
					            }
					        },
					        grid: {                //图像离各边的距离
					            left: '30px',
					            right: '30px',
					            bottom: '30px',
					            containLabel: true
					        },
					        xAxis : [
					            {
					                type : 'category',
					                boundaryGap : false,
					                axisLine:{
					                    lineStyle:{
					                        color:'#bbbec3',
					                    }
					                },
					                data : defaultObj.lineXdata
					            }
					        ],
					        yAxis : [
					            {
					                interval:defaultObj.lineYinterval,      
					                axisLine:{
					                    lineStyle:{
					                        color:'#bbbec3',
					                    }
					                },
					                type : 'value'
					            }
					        ],
					        series : [
					            {
					                name:defaultObj.lineSeriesName,
					                type:'line',
					                /*stack: '总量',*/
					                label: {
					                    normal: {
					                        show: true,
					                        position: 'top'
					                    }
					                },
					                areaStyle: {normal: {}},
					                data:defaultObj.lineSeriesData,
									smooth: true
								}
					
					        ]
					};
					if(defaultObj.lineAreaFill!=true){
						delete D.tooltip.areaStyle;
					}
                    O.setOption(D);
                    O.ele=this;
                    arr.push(O);
                });
                break;
            }
           /* 柄状图*/
            case "1":{
                $.each(this,function(){
                    O = echarts.init(this);
                    $(window).resize(function() {
						 O.resize();
					});
                    O.setOption({
                       title: {
							 text: defaultObj.handleTitleTxt,
							 x:defaultObj.handleTitleX,
							 y:defaultObj.handleTitleY,
						},
						legend: {
							orient : 'vertical',
							x : 'left',
							data:defaultObj.handleLegendData
						},
						tooltip: {
							 trigger: 'item',
			                 formatter: "{a} <br/>{b} : {c} ({d}%)"
						},
						series: [
							{
								name:'医院数据',
								type:'pie',
								radius : '75%',
								center: ['50%', '50%'],
								data:defaultObj.handleSeriesData,
								label:{            //饼图图形上的文本标签
									normal:{
										show:true,
										position:'inner', //标签的位置
										textStyle : {
											fontWeight : 300 ,
											fontSize : 16    //文字的字体大小
										},
										formatter:defaultObj.handleSeriesLabform     //显示百分比，不设置显示文字
									}
								},
							}
						],
						color:['#1DE9B6', '#04A9F5','#A389D4','#3FC529','#8584a6','#3d83a5', '#bc6264','#e17e5e','#01aaff','#96bbff','#b7e3e4','#cccd93',
							    '#559b99','#1b6767','#8584a6','#7ec8ab','#756de5','#afacd7','#bdaddb','#2e2b5a','#8483a5','#464657','#e4e3db','535f9c',
							    '#3aafab','#015ea4','#d596cf','#cbcbff','#bdadd3','#0192f2','#ffa08e','#782d41','#abd9ab','#e6872b','#554255','#8cbcbd',
							    '#afb7d0','#549b98','#8cadd2','#9a9900','#666666','cccccc','#fecacc','#6e2e6a','#b9d9ef','#158fd2','#123865','#5775be',
							    '#a2a2d4','#e2cfda','#8bb7c4','#394306','#8ab3d3','#t58b99','#01c134','#e7c201','#f57b01','#fc2601','#4d46a6','#999a60'],
					    });
                    O.ele=this;
                    arr.push(O);
                });
                break;  
            }
           /*柱状图*/
            case "2":{
                $.each(this,function(){
                    O = echarts.init(this);
                    $(window).resize(function() {
						 O.resize();
					});
                    O.setOption({
                     title: {
								 text: defaultObj.columnTitleTxt,
								 x:defaultObj.columnTitleX,
								 y:defaultObj.columnTitleY,
							},
							tooltip: {
								trigger: 'axis',
								axisPointer: {
									type: 'shadow'
								}
							},
							legend: {
								data:defaultObj.columnLegendData
							},
							grid: {                //图像离各边的距离
					            left: '3%',
					            right: '3%',
					            bottom: '6%',
					            containLabel: true
					        },
							xAxis: {
								data: defaultObj.columnXAxisData,
								axisLine:{
					                    lineStyle:{
					                        color:'#bbbec3',
					                    }
					                }
							},
							yAxis: {
								    interval:defaultObj.columnYAxisInterval,      
					                axisLine:{
					                    lineStyle:{
					                        color:'#bbbec3',
					                    }
					                },
					                type : 'value'
					            
							    },
							series: defaultObj.columnSeries,
							color:['#1DE9B6', '#04A9F5','#A389D4','#3FC529','#8584a6','#3d83a5', '#bc6264','#e17e5e','#01aaff','#96bbff','#b7e3e4','#cccd93',
							'#559b99','#1b6767','#8584a6','#7ec8ab','#756de5','#afacd7','#bdaddb','#2e2b5a','#8483a5','#464657','#e4e3db','535f9c',
							'#3aafab','#015ea4','#d596cf','#cbcbff','#bdadd3','#0192f2','#ffa08e','#782d41','#abd9ab','#e6872b','#554255','#8cbcbd',
							'#afb7d0','#549b98','#8cadd2','#9a9900','#666666','cccccc','#fecacc','#6e2e6a','#b9d9ef','#158fd2','#123865','#5775be',
							'#a2a2d4','#e2cfda','#8bb7c4','#394306','#8ab3d3','#t58b99','#01c134','#e7c201','#f57b01','#fc2601','#4d46a6','#999a60']
					    });
                    O.ele=this;
                    arr.push(O);
                });
                break;  
			}
			case "3":{
				var arr = [];
				var obj = {};
				for(var o = 0;o<defaultObj.circularGraphData.length;o++){
					arr.push(defaultObj.circularGraphData[o].name);
					obj[defaultObj.circularGraphData[o].name]=true;
				}
				$.each(this,function(){
                    O = echarts.init(this);
                    $(window).resize(function() {
						 O.resize();
					});
					O.setOption({
						title : {
							text: defaultObj.circularGraphName,
							subtext: defaultObj.circularGraphSub,
							x:'center'
						},
						tooltip : {
							trigger: 'item',
							formatter: "{a} <br/>{b} : {c} ({d}%)"
						},
						legend: {
							type: 'scroll',
							orient: 'vertical',
							right: 10,
							top: 20,
							bottom: 20,
							data: arr,
							selected: obj
						},
						series : [
							{
								name: '姓名',
								type: 'pie',
								radius : ['55%',"70%"],
								center: ['40%', '50%'],
								data: defaultObj.circularGraphData,
								itemStyle: {
									emphasis: {
										shadowBlur: 10,
										shadowOffsetX: 0,
										shadowColor: 'rgba(0, 0, 0, 0.5)'
									}
								}
							}
						],
						color:['#1DE9B6', '#04A9F5','#A389D4','#3FC529','#8584a6','#3d83a5', '#bc6264','#e17e5e','#01aaff','#96bbff','#b7e3e4','#cccd93',
							    '#559b99','#1b6767','#8584a6','#7ec8ab','#756de5','#afacd7','#bdaddb','#2e2b5a','#8483a5','#464657','#e4e3db','535f9c',
							    '#3aafab','#015ea4','#d596cf','#cbcbff','#bdadd3','#0192f2','#ffa08e','#782d41','#abd9ab','#e6872b','#554255','#8cbcbd',
							    '#afb7d0','#549b98','#8cadd2','#9a9900','#666666','cccccc','#fecacc','#6e2e6a','#b9d9ef','#158fd2','#123865','#5775be',
							    '#a2a2d4','#e2cfda','#8bb7c4','#394306','#8ab3d3','#t58b99','#01c134','#e7c201','#f57b01','#fc2601','#4d46a6','#999a60']
					});
					O.ele=this;
					arr.push(O);
				});
				break;
			}
        }
        return arr;
    };