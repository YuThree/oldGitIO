/**
 * Created by CDCT on 2017/12/8.
 */
/**
 * Created by CDCT on 2017/10/25.
 */

/*分页*/
//allPage 总页数
//nowPage 当前页
//allDataNum 总数据量
//showNum 显示的数据量
//showNumArr 选择显示数据量的下拉选择
//pageBoxClass 放分页的容器的class
//showPage 显示的页数
//pageFun 当当前页改变触发的函数
//showNumFun 当选择一页数据量的时候触发的函数
pageIng({
    allDataNum:30,
    showNum:10,
    showNumArr:[10,20,30],
    pageBoxClass:"pageFather",
    allPage:100,
    showPage: 5,
    nowPage:2,
    pageFun:function(num,O){
        console.log(num);
        console.log(O);
    },
    showNumFun:function(num){
        console.log(num);
    }
});

$("#chk_suc").maskFun({
    forEle:"parent=>boxInputInfo=>.cdct_input "
});
$("#chk_suca").maskFun({
    forEle:"parent=>boxSelectInfo=>.checkspan"
});
$("#chk_sucb").maskFun({
    forEle:"parent=>boxInputInfo=>.cdct_input"
});
$("#chk_succ").maskFun({
    forEle:"parent=>boxInputInfo=>.cdct_input"
});
$("#chk_sucd").maskFun({
    forEle:"parent=>boxInputInfo=>.cdct_input"
});

$("#chk_suce").maskFun({
    forEle:"parent=>boxInputInfo=>.cdct_input=>1"
});
/*搜索栏为三的动画效果*/
$(".showcondition").click(function(){
    $(this).stop().slideUp(function(){
        $(".hidecondition").stop().slideDown();

    });
    $(".navHide").stop().fadeIn(600);
    $(".commonButtonTwo").stop().animate({
        top:'72px'
    })
});
$(".hidecondition").click(function(){
    $(this).stop().slideUp(function(){
        $(".showcondition").stop().slideDown();

    });
    $(".navHide").stop().fadeOut(600);
    $(".commonButtonTwo").stop().animate({
        top:'42px',
    })
});
(function(){
    var all=$(".cdct_select");
    for(var i =0;i<all.length;i++){
        $(all[i]).simulationSelect({
            selectText:'{a}<span class="selectDown"></span>',
            position:"fixed"
        });
    }
})();


/*调用时间插件*/
$(".datepicker").on("click",function(e){
    e.stopPropagation();
    $(this).lqdatetimepicker({
        css : 'datetime-day',
        dateType:"YYYY-MM-DD"
    });
});
$('#config-demo').daterangepicker({
    /*  "startDate": "YYYY-MM-DD",
     "endDate": "07/15/2015" */
}, function (start, end, label){
    console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
});
$('#config-demo3').daterangepicker({
    /*  "startDate": "YYYY-MM-DD",
     "endDate": "07/15/2015" */
}, function (start, end, label) {

    console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
});





/*表格1*/
var dataSet = [
    [ '01', "张三", "001111", "男", "1955-05-05","26","1955-05-05","不治","不改","2","否","否","1","1"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","1955-05-05","不治","不改","2","否","否","1","1"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","1955-05-05","不治","不改","2","否","否","1","1"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","1955-05-05","不治","不改","2","否","否","1","1"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","1955-05-05","不治","不改","2","否","否","1","1"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","1955-05-05","不治","不改","2","否","否","1","1"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","1955-05-05","不治","不改","2","否","否","1","1"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","1955-05-05","不治","不改","2","否","否","1","1"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","1955-05-05","不治","不改","2","否","否","1","1"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","1955-05-05","不治","不改","2","否","否","1","1"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","1955-05-05","不治","不改","2","否","否","1","1"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","1955-05-05","不治","不改","2","否","否","1","1"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","1955-05-05","不治","不改","2","否","否","1","1"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","1955-05-05","不治","不改","2","否","否","1","1"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","1955-05-05","不治","不改","2","否","否","1","1"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","1955-05-05","不治","不改","2","否","否","1","1"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","1955-05-05","不治","不改","2","否","否","1","1"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","1955-05-05","不治","不改","2","否","否","1","1"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","1955-05-05","不治","不改","2","否","否","1","1"]
];
var tableObj=$(".tablMainOne").showTable({
    data:dataSet,
    title:[
        "编号",
        "姓名",
        "档案编号",
        "性别",
        "出生日期",
        "年龄",
        "始治日期",
        "始治方案",
        "更改方案",
        "随访次数",
        "是否做过入户随访",
        "是否结案",
        "登记号",
        "病案号"
    ],
    scrollHeight:".tablMainOne",
    scrollHeightPC:45,
    edit:false
});
/*为表格添加横向滚动条*/
$(".tablMainOne").panel({
    iWheelStep:32,
    vScroll:false,
    scrollWResize:true
});



