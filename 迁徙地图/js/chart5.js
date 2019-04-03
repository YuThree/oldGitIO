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

// 图表1
var myChart1 = echarts.init(document.getElementById('echarts1'));
myChart1.on('click', function (params) {  //鼠标事件 
    var datas = params;
    console.log(datas);
});
myChart1.setOption({
});
window.addEventListener("resize", function() {
    myChart1.resize();
});


// 图表2
var myChart2 = echarts.init(document.getElementById('echarts2'));
myChart2.setOption({
});
window.addEventListener("resize", function() {
    myChart2.resize();
});

// 图表3
var myChart3 = echarts.init(document.getElementById('echarts3'));
myChart3.setOption({
});
window.addEventListener("resize", function() {
    myChart3.resize();
});

// 图表4
var myChart4 = echarts.init(document.getElementById('echarts4'));
myChart4.setOption({
});
window.addEventListener("resize", function() {
    myChart4.resize();
});

// 图表5
var myChart5 = echarts.init(document.getElementById('echarts5'));
myChart5.setOption({
});
window.addEventListener("resize", function() {
    myChart5.resize();
});

