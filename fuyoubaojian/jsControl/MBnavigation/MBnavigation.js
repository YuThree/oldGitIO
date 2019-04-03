/**
 * Created by CDCT on 2017/9/21.
 * author 375361172@qq.com
 * V1.0 (20170925)
 *
 *
 *
 *   jq选择的应该是最大的容器
 * childFirst 装导航的容器
 * childClass 每一个导航的class
 *
 *    controller 控制按钮
 * left 控制左边移动的按钮
 * right 控制右边移动的按钮
 * isShow 默认为true 当不满足左右移动的时候 就会隐藏按钮
 *
 *    MBnavigation.addMethod为方法扩展方法 参数 1 this jq选择的节点对象 defaultObject 包含了你传入的一些option (列入和iframe嵌套使用哦!!)
 * */
$.fn.MBnavigation=function(Obj){
    var defaultObj={
        childFirst:this.children(":first-child"),
        childClass:"MBnavigation",
        controller:{
            left:null,
            right:null,
            isShow:true
        },
        amtCallback:function(){
            
        },
        mj:10,
        xPC:0
    };
    $.extend(defaultObj,Obj);

    return this.each(function(a,b){
        var jqThis=$(this);
        var child=$(defaultObj.childFirst);
        var isShowCon=function(){
            var wThis=jqThis.outerWidth()-defaultObj.xPC;
            var wChild=child.outerWidth();
            /*判断是否显示控制按钮*/
            if(defaultObj.controller.isShow){

                return 0;
            }else{
                if(wThis>wChild){
                    $(defaultObj.childFirst).css({
                        "marginLeft":""
                    });
                    defaultObj.controller.left&&$(defaultObj.controller.left).css({display:"none"});
                    defaultObj.controller.left&&$(defaultObj.controller.right).css({display:"none"});
                }else{
                    defaultObj.controller.left&&$(defaultObj.controller.left).css({display:""});
                    defaultObj.controller.left&&$(defaultObj.controller.right).css({display:""});
                }
            }

        };
        $(jqThis).on("mouseover",isShowCon);
        $(window).on("resize",isShowCon);
        function left(){
    
            var wThis=jqThis.outerWidth()-defaultObj.xPC;
            var wChild=child.outerWidth();
            if(wThis>wChild){
                $(defaultObj.childFirst).css({
                    "marginLeft":""
                });
                return;
            }
            if(parseInt($(defaultObj.childFirst).css("marginLeft"))-jqThis.find("."+defaultObj.childClass).outerWidth()<=wThis-wChild){
                $(defaultObj.childFirst).animate({
                    "marginLeft":wThis-wChild+"px"
                },250,"linear",function(){
                    defaultObj.amtCallback(defaultObj);
                });
            }else{
                $(defaultObj.childFirst).animate({
                    "marginLeft":parseInt($(defaultObj.childFirst).css("marginLeft"))-defaultObj.mj-jqThis.find("."+defaultObj.childClass).outerWidth()+"px"
                },250,"linear",function(){
                    defaultObj.amtCallback(defaultObj);
                });
            }
        }
        function right(){
            var wThis=jqThis.width()-defaultObj.xPC;
            var wChild=child.width();
            if(wThis>wChild){
                $(defaultObj.childFirst).css({
                    "marginLeft":""
                });
                return;
            }
            if(parseInt($(defaultObj.childFirst).css("marginLeft"))+jqThis.find("."+defaultObj.childClass).outerWidth()>=0){
                $(defaultObj.childFirst).animate({
                    "marginLeft":"0px"
                },250,"linear",function(){
                    defaultObj.amtCallback(defaultObj);
                });
            }else{
               $(defaultObj.childFirst).animate({
                    "marginLeft":parseInt($(defaultObj.childFirst).css("marginLeft"))+jqThis.find("."+defaultObj.childClass).outerWidth()+defaultObj.mj+"px"
                },250,"linear",function(){
                    defaultObj.amtCallback(defaultObj);
                });
            }
        }
        $(defaultObj.controller.left).on("click",left);
        $(defaultObj.controller.right).on("click",right);
        isShowCon();
        $.fn.MBnavigation.addMethod&&$.fn.MBnavigation.addMethod(this,defaultObj);
    });
};