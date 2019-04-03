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
    [ '+', "张三", "001111", "51025454445454444", "1955-05-05","成都市","13608184009","李四","1955-05-05","公卫"],
    [ '+', "张三", "001111", "51025454445454444", "1955-05-05","成都市","13608184009","李四","1955-05-05","公卫"],
    [ '+', "张三", "001111", "51025454445454444", "1955-05-05","成都市","13608184009","李四","1955-05-05","公卫"],
    [ '+', "张三", "001111", "51025454445454444", "1955-05-05","成都市","13608184009","李四","1955-05-05","公卫"],
    [ '+', "张三", "001111", "51025454445454444", "1955-05-05","成都市","13608184009","李四","1955-05-05","公卫"],
    [ '+', "张三", "001111", "51025454445454444", "1955-05-05","成都市","13608184009","李四","1955-05-05","公卫"],
    [ '+', "张三", "001111", "51025454445454444", "1955-05-05","成都市","13608184009","李四","1955-05-05","公卫"],
    [ '+', "张三", "001111", "51025454445454444", "1955-05-05","成都市","13608184009","李四","1955-05-05","公卫"],
    [ '+', "张三", "001111", "51025454445454444", "1955-05-05","成都市","13608184009","李四","1955-05-05","公卫"],
    [ '+', "张三", "001111", "51025454445454444", "1955-05-05","成都市","13608184009","李四","1955-05-05","公卫"],

];
var tableObj=$(".tablMainOne").showTable({
    data:dataSet,
    title:[
        "操作",
        "户主姓名",
        "家庭档案编号",
        "身份证",
        "户主出生日期",
        "家庭地址",
        "联系电话",
        "建党人",
        "建档日期",
        "建党机构"
    ],
    scrollHeight:".tablMainOne",
    scrollHeightPC:45,
    clickTd:function(a){   //回调可以添加树形无限下级
        if(a.innerText=="+"|| a.innerHTML=="-"){
            if(typeof a.show=="undefined"|| a.show==false){
                a.show=true;
                a.innerHTML="-";
                if($(a).parent()[0].showTableObj){
                    $(a).parent()[0].showTableObj.ele.remove();
                    $(a).parent()[0].showTableObj.showTable($(a).parent()[0])
                }else{
                    $(a).parent().showTable({
                        isStopPro:true,
                        data:[
                            ["张三","儿子","45345453421·1·2","女","1955-05-05","汉族","成都市"],
                            ["张三","儿子","45345453421·1·2","女","1955-05-05","汉族","成都市"],
                            ["张三","儿子","45345453421·1·2","女","1955-05-05","汉族","成都市"]
                        ],
                        scrollBody:false,
                        title:["姓名","与户主关系","档案编号","性别","出生日期","名族","家庭住址"]
                    });
                }
            }else{
                $(a).parent()[0].showTableObj.ele.remove();

                a.innerHTML="+";
                a.show=false;
            }


        }

    }
});
/*为表格添加横向滚动条*/
$(".tablMainOne").panel({
    iWheelStep:32,
    vScroll:false,
    scrollWResize:true
});



//树形的模拟数据
var case_data=[
    {
        userLevel:1,
        name:"菜单一",
        checkedMP:1,
        open:"true",
        userAddAttri:"aa|10",
        customAttr:{
            a:10,
            id:"200"
        },
        menu:[
            {
                clickFun:function(){},
                img:"../../img/PerationAndMaintenance/icontjdxj.png",
                str:"添加平级"

            },
            {
                clickFun:function(){},
                img:"../../img/PerationAndMaintenance/icon_tjxj.png",
                str:"添加下级"

            },
            {
                clickFun:function(){},
                img:"../../img/PerationAndMaintenance/icon_sc.png",
                str:"删除"

            },
            {
                clickFun:function(){},
                img:"../../img/PerationAndMaintenance/icon_bj.png",
                str:"编辑"

            }
        ],
        list:[
            {
                userLevel:2,
                name:"菜单二",

                checkedSelect:1
            },
            {
                userLevel:2,
                name:"菜单二"

            },
            {
                userLevel:2,
                name:"菜单二"

            }

        ]
    },
    {
        userLevel:1,
        checkedMP:1,
        name:"菜单一2",
        userAddAttri:"aa|10",
        customAttr:{
            a:10,
            id:"200"
        },
        menu:[
            {
                clickFun:function(){},
                img:"../../img/PerationAndMaintenance/icontjdxj.png",
                str:"添加平级"

            },
            {
                clickFun:function(){},
                img:"../../img/PerationAndMaintenance/icon_tjxj.png",
                str:"添加下级"

            },
            {
                clickFun:function(){},
                img:"../../img/PerationAndMaintenance/icon_sc.png",
                str:"删除"

            },
            {
                clickFun:function(){},
                img:"../../img/PerationAndMaintenance/icon_bj.png",
                str:"编辑"

            }
        ],
        list:[
            {
                userLevel:2,
                name:"菜单二2"
            },
            {
                userLevel:2,
                name:"菜单二2"
            }

        ]
    },
    {
        userLevel:1,
        name:"菜单一3",
        userAddAttri:"aa|10",
        customAttr:{
            a:10,
            id:"200"
        },
        menu:[
            {
                clickFun:function(){},
                img:"../../img/PerationAndMaintenance/icontjdxj.png",
                str:"添加平级"

            },
            {
                clickFun:function(){},
                img:"../../img/PerationAndMaintenance/icon_tjxj.png",
                str:"添加下级"

            },
            {
                clickFun:function(){},
                img:"../../img/PerationAndMaintenance/icon_sc.png",
                str:"删除"

            },
            {
                clickFun:function(){},
                img:"../../img/PerationAndMaintenance/icon_bj.png",
                str:"编辑"

            }
        ],
        list:[
            {
                userLevel:2,
                name:"菜单二3",
                list:[
                    {
                        userLevel:3,
                        name:"菜单三3",
                        checkedSelect:1
                    },
                    {
                        userLevel:3,
                        name:"菜单三3"
                    }
                ]
            }
        ]
    }
];
//改变模拟数据的各个参数
$.treeView.addAttribute(case_data,"checkedStr",'<div class="checkbox checkbox-success"> <input type="checkbox"> <label></label> </div>');
$.treeView.addAttribute(case_data,"icon","../../image/Jurisdiction/treeViewIcon.png--");
//实例树形
var tree=$(".treeViewMaxBoxInfo").showTreeView({
    data:case_data,
    orderArr:[0,2,1,3],
    childClickFun:function(){
        console.log(arguments);
    },
    checked:1
});
$(".treeViewMaxBoxInfo").panel({
    iWheelStep:32
});

