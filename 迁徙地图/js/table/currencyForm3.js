/*表格数据*/
var data=[
    {
        name1:"",
        name2:"<div style='text-align: left' class='i1_a'><div class='iconOpen1'></div>个人档案</div>",
        name3:"",
        name4:"",
        name5:"",
        child:[
            {
                info1:"<div style='text-align: right' class='i2_a'><div class='iconOpen1'></div>个人基本信息</div>",info2:"",
                child:[
                    {name1:'<div class="cdct_chk cdct_chk_suc vMiddle"><input id="chk_sucd" type="checkbox"><label class="labelInpTwo" for="chk_sucd"></label> </div>',
                        name2:"2017年6月",name3:"张三",name4:"过期作废",name5:"2017年6月"}
                ]
            }
        ]
    },
    {
        name1:"",
        name2:"<div style='text-align: left' class='i1_a'><div class='iconOpen1'></div>个人档案2</div>",
        name3:"",
        name4:"",
        name5:"",
        child:[
            {
                info1:"<div style='text-align: right' class='i2_a'><div class='iconOpen1'></div>个人基本信息</div>",info2:"",
                child:[
                    {name1:'<div class="cdct_chk cdct_chk_suc vMiddle"><input id="chk_sucd" type="checkbox"><label class="labelInpTwo" for="chk_sucd"></label> </div>',
                        name2:"2017年6月",name3:"张三",name4:"过期作废",name5:"2017年6月"}
                ]
            }
        ]
    },
    {
        name1:"",
        name2:"<div style='text-align: left' class='i1_a'><div class='iconOpen1'></div>个人档案3</div>",
        name3:"",
        name4:"",
        name5:"",
        child:[
            {
                info1:"<div style='text-align: right' class='i2_a'><div class='iconOpen1'></div>个人基本信息</div>",info2:"",
                child:[
                    {name1:'<div class="cdct_chk cdct_chk_suc vMiddle"><input id="chk_sucd" type="checkbox"><label class="labelInpTwo" for="chk_sucd"></label> </div>',
                        name2:"2017年6月",name3:"张三",name4:"过期作废",name5:"2017年6月"}
                ]
            }
        ]
    },
    {
        name1:"",
        name2:"<div style='text-align: left' class='i1_a'><div class='iconOpen1'></div>个人档案</div>",
        name3:"",
        name4:"",
        name5:"",
        child:[
            {
                info1:"<div style='text-align: right' class='i2_a'><div class='iconOpen1'></div>个人基本信息</div>",info2:"",
                child:[
                    {name1:'<div class="cdct_chk cdct_chk_suc vMiddle"><input id="chk_sucd" type="checkbox"><label class="labelInpTwo" for="chk_sucd"></label> </div>',
                        name2:"2017年6月",name3:"张三",name4:"过期作废",name5:"2017年6月"}
                ]
            }
        ]
    },
    {
        name1:"",
        name2:"<div style='text-align: left' class='i1_a'><div class='iconOpen1'></div>个人档案</div>",
        name3:"",
        name4:"",
        name5:"",
        child:[
            {
                info1:"<div style='text-align: right' class='i2_a'><div class='iconOpen1'></div>个人基本信息</div>",info2:"",
                child:[
                    {name1:'<div class="cdct_chk cdct_chk_suc vMiddle"><input id="chk_sucd" type="checkbox"><label class="labelInpTwo" for="chk_sucd"></label> </div>',
                        name2:"2017年6月",name3:"张三",name4:"过期作废",name5:"2017年6月"}
                ]
            }
        ]
    },
    {
        name1:"",
        name2:"<div style='text-align: left' class='i1_a'><div class='iconOpen1'></div>个人档案</div>",
        name3:"",
        name4:"",
        name5:"",
        child:[
            {
                info1:"<div style='text-align: right' class='i2_a'><div class='iconOpen1'></div>个人基本信息</div>",info2:"",
                child:[
                    {name1:'<div class="cdct_chk cdct_chk_suc vMiddle"><input id="chk_sucd" type="checkbox"><label class="labelInpTwo" for="chk_sucd"></label> </div>',
                        name2:"2017年6月",name3:"张三",name4:"过期作废",name5:"2017年6月"}
                ]
            },
            {
                info1:"<div style='text-align: right' class='i2_a'><div class='iconOpen1'></div>个人高级信息</div>",info2:"",
                child:[
                    {name1:'<div class="cdct_chk cdct_chk_suc vMiddle"><input id="chk_sucd" type="checkbox"><label class="labelInpTwo" for="chk_sucd"></label> </div>',
                        name2:"2017年6月",name3:"张三",name4:"过期作废",name5:"2017年6月"}
                ]
            }
        ]
    }
];
//可以自己设置无限级表格树形
$(".tablMainOne").showTable({
    data:data,
    isStopPro:true,
    //一级表格表头
    title:[
        {title:"name1",content:"选择"},
        {title:"name2",content:"条目"},
        {title:"name3",content:"删除人"},
        {title:"name4",content:"删除原因"},
        {title:"name5",content:"删除时间"}
    ],
    scrollHeight:$(".tablMainOne"),
    scrollHeightPC:48,
    edit:false,
    clickTr:true,
    //双击tr触发函数
    selectTr:function(tr,con,ele){
        //一个中间变量 最后会被施放
        console.log(arguments);
        var jqEle=null;
        if(typeof tr=="undefined"){return}//如果回调的tr为undefined就return
        if(!ele.show){//判断节点是否是打开的是就移出下级不是就添加下级
            ele.show=true;
            jqEle=$(ele).find(".i1_a .iconOpen1");//改变class
            jqEle.removeClass("iconOpen1");
            jqEle.addClass("iconOpen");
            if(ele.showTableObj){//如果节点是调用了showTable就会有这样一个属性 没有就调用showTable
                ele.showTableObj.ele.remove();
                ele.showTableObj.showTable(ele);
                ele.showTableObj.scrollHead.remove();
                ele.showTableObj.scrollBody.css({
                    minHeight:"auto"
                });
                ele.showTableObj.initEvent();
            }else{
                if(typeof tr=="undefined"){return;}
                var Obj=$(ele).showTable({
                    data:tr.child,//这里的数据是子集数据
                    title:["info1","info2"],
                    widthInfo:["13%","87%"],
                    scrollBody:false,
                    edit:false,
                    clickTr:true,
                    isStopPro:true,
                    selectTr:function(trs,cons,eles){
                        console.log(arguments);
                        if(typeof trs=="undefined"){return}
                        if(!eles.show){
                            jqEle=$(eles).find(".i2_a .iconOpen1");
                            jqEle.removeClass("iconOpen1");
                            jqEle.addClass("iconOpen");
                            eles.show=true;
                            if(eles.showTableObj){
                                eles.showTableObj.ele.remove();
                                eles.showTableObj.showTable(eles);
                                eles.showTableObj.scrollHead.remove();
                                eles.showTableObj.scrollBody.css({
                                    minHeight:"auto"
                                });
                                eles.showTableObj.initEvent();
                            }else{
                                var OBJSD=$(eles).showTable({
                                    isStopPro:true,
                                    data:trs.child,
                                    title:[
                                        {title:"name1",content:"选择"},
                                        {title:"name2",content:"条目"},
                                        {title:"name3",content:"删除人"},
                                        {title:"name4",content:"删除原因"},
                                        {title:"name5",content:"删除时间"}
                                    ],
                                    edit:false,
                                    widthInfo:["5%","21%","20%","27%","27%"],
                                    scrollBody:false
                                });
                                OBJSD.scrollHead.remove();
                                OBJSD.scrollBody.css({
                                    minHeight:"auto"
                                });
                            }

                        }else{
                            eles.show=false;
                            eles.showTableObj.ele.remove();
                            jqEle=$(eles).find(".i2_a .iconOpen");
                            jqEle.removeClass("iconOpen");
                            jqEle.addClass("iconOpen1");
                        }

                    }
                });
                Obj.scrollHead.remove();
                Obj.scrollBody.css({
                    minHeight:"auto"
                });
            }
        }else{
            ele.show=false;
            ele.showTableObj.ele.remove();
            jqEle=$(ele).find(".i1_a .iconOpen");
            jqEle.removeClass("iconOpen");
            jqEle.addClass("iconOpen1");
        }



    },
    widthInfo:["5%","21%","20%","27%","27%"]
});
/*为表格添加横向滚动条*/
$(".tablMainOne").panel({
    iWheelStep:32,
    vScroll:false,
    scrollWResize:true
});


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
    allDataNum: 30,
    showNum: 10,
    showNumArr: [10, 20, 30],
    pageBoxClass: "pageFather",
    allPage: 100,
    showPage: 5,
    nowPage: 2,
    pageFun: function (num, O) {
        console.log(num);
        console.log(O);
    },
    showNumFun: function (num) {
        console.log(num);
    }
});