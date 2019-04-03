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
    [ '01', "张三", "001111", "男", "1955-05-05","26","26","1955-05-05","<span class='control'>查看</span>","否","<span class='control'>操作</span>"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","26","1955-05-05","<span class='control'>查看</span>","否","<span class='control'>操作</span>"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","26","1955-05-05","<span class='control'>查看</span>","否","<span class='control'>操作</span>"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","26","1955-05-05","<span class='control'>查看</span>","否","<span class='control'>操作</span>"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","26","1955-05-05","<span class='control'>查看</span>","否","<span class='control'>操作</span>"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","26","1955-05-05","<span class='control'>查看</span>","否","<span class='control'>操作</span>"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","26","1955-05-05","<span class='control'>查看</span>","否","<span class='control'>操作</span>"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","26","1955-05-05","<span class='control'>查看</span>","否","<span class='control'>操作</span>"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","26","1955-05-05","<span class='control'>查看</span>","否","<span class='control'>操作</span>"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","26","1955-05-05","<span class='control'>查看</span>","否","<span class='control'>操作</span>"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","26","1955-05-05","<span class='control'>查看</span>","否","<span class='control'>操作</span>"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","26","1955-05-05","<span class='control'>查看</span>","否","<span class='control'>操作</span>"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","26","1955-05-05","<span class='control'>查看</span>","否","<span class='control'>操作</span>"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","26","1955-05-05","<span class='control'>查看</span>","否","<span class='control'>操作</span>"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","26","1955-05-05","<span class='control'>查看</span>","否","<span class='control'>操作</span>"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","26","1955-05-05","<span class='control'>查看</span>","否","<span class='control'>操作</span>"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","26","1955-05-05","<span class='control'>查看</span>","否","<span class='control'>操作</span>"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","26","1955-05-05","<span class='control'>查看</span>","否","<span class='control'>操作</span>"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","26","1955-05-05","<span class='control'>查看</span>","否","<span class='control'>操作</span>"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","26","1955-05-05","<span class='control'>查看</span>","否","<span class='control'>操作</span>"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","26","1955-05-05","<span class='control'>查看</span>","否","<span class='control'>操作</span>"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","26","1955-05-05","<span class='control'>查看</span>","否","<span class='control'>操作</span>"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","26","1955-05-05","<span class='control'>查看</span>","否","<span class='control'>操作</span>"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","26","1955-05-05","<span class='control'>查看</span>","否","<span class='control'>操作</span>"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","26","1955-05-05","<span class='control'>查看</span>","否","<span class='control'>操作</span>"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","26","1955-05-05","<span class='control'>查看</span>","否","<span class='control'>操作</span>"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","26","1955-05-05","<span class='control'>查看</span>","否","<span class='control'>操作</span>"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","26","1955-05-05","<span class='control'>查看</span>","否","<span class='control'>操作</span>"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","26","1955-05-05","<span class='control'>查看</span>","否","<span class='control'>操作</span>"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","26","1955-05-05","<span class='control'>查看</span>","否","<span class='control'>操作</span>"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","26","1955-05-05","<span class='control'>查看</span>","否","<span class='control'>操作</span>"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","26","1955-05-05","<span class='control'>查看</span>","否","<span class='control'>操作</span>"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","26","1955-05-05","<span class='control'>查看</span>","否","<span class='control'>操作</span>"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","26","1955-05-05","<span class='control'>查看</span>","否","<span class='control'>操作</span>"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","26","1955-05-05","<span class='control'>查看</span>","否","<span class='control'>操作</span>"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","26","1955-05-05","<span class='control'>查看</span>","否","<span class='control'>操作</span>"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","26","1955-05-05","<span class='control'>查看</span>","否","<span class='control'>操作</span>"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","26","1955-05-05","<span class='control'>查看</span>","否","<span class='control'>操作</span>"],
    [ '01', "张三", "001111", "男", "1955-05-05","26","26","1955-05-05","<span class='control'>查看</span>","否","<span class='control'>操作</span>"]
];
var tableObj=$(".tablMainOne").showTable({
    data:dataSet,
    title:[
        "体检日期",
        "体检号码",
        "总检医师",
        "姓名",
        "学号",
        "证件号码",
        "性别",
        "年龄",
        "项目明细",
        "导入时间",
        "操作"
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




