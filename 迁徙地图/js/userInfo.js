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

/*表格1*/
var dataSet = [
    ['综合信息分析', '<div class="cdct_chk cdct_chk_suc"><input id="chk_suc1" type="checkbox" checked=""><label for="chk_suc1"></label></div>', '<div class="cdct_chk cdct_chk_suc"><input id="chk_suc1" type="checkbox" checked=""><label for="chk_suc1"></label></div>', "/", "/", "/", "/"],
    ['健康数据监测', '<div class="cdct_chk cdct_chk_suc"><input id="chk_suc1" type="checkbox" checked=""><label for="chk_suc1"></label></div>', '<div class="cdct_chk cdct_chk_suc"><input id="chk_suc1" type="checkbox" checked=""><label for="chk_suc1"></label></div>', "/", "/", "/", "/"],
    ['报表统计', '<div class="cdct_chk cdct_chk_suc"><input id="chk_suc1" type="checkbox" checked=""><label for="chk_suc1"></label></div>', '<div class="cdct_chk cdct_chk_suc"><input id="chk_suc1" type="checkbox" checked=""><label for="chk_suc1"></label></div>', "/", "/", "/", "/"],
    ['用户管理', '<div class="cdct_chk cdct_chk_suc"><input id="chk_suc1" type="checkbox" checked=""><label for="chk_suc1"></label></div>', '<div class="cdct_chk cdct_chk_suc"><input id="chk_suc1" type="checkbox" checked=""><label for="chk_suc1"></label></div>', '<div class="cdct_chk cdct_chk_suc"><input id="chk_suc1" type="checkbox" checked=""><label for="chk_suc1"></label></div>', '<div class="cdct_chk cdct_chk_suc"><input id="chk_suc1" type="checkbox" checked=""><label for="chk_suc1"></label></div>', '<div class="cdct_chk cdct_chk_suc"><input id="chk_suc1" type="checkbox" checked=""><label for="chk_suc1"></label></div>', '<div class="cdct_chk cdct_chk_suc"><input id="chk_suc1" type="checkbox" checked=""><label for="chk_suc1"></label></div>'],
    ['设备管理', '<div class="cdct_chk cdct_chk_suc"><input id="chk_suc1" type="checkbox" checked=""><label for="chk_suc1"></label></div>', '<div class="cdct_chk cdct_chk_suc"><input id="chk_suc1" type="checkbox" checked=""><label for="chk_suc1"></label></div>', '<div class="cdct_chk cdct_chk_suc"><input id="chk_suc1" type="checkbox" checked=""><label for="chk_suc1"></label></div>', '<div class="cdct_chk cdct_chk_suc"><input id="chk_suc1" type="checkbox" checked=""><label for="chk_suc1"></label></div>', '<div class="cdct_chk cdct_chk_suc"><input id="chk_suc1" type="checkbox" checked=""><label for="chk_suc1"></label></div>', '<div class="cdct_chk cdct_chk_suc"><input id="chk_suc1" type="checkbox" checked=""><label for="chk_suc1"></label></div>'],
];
var tableObj=$(".tablMainOne").showTable({
    data:dataSet,
    title:[
        "模块名称",
        "模块可见",
        "查看",
        "创建",
        "编辑",
        "删除",
        "其他"
    ],
    lineInfo:[1,0,0,1],
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




