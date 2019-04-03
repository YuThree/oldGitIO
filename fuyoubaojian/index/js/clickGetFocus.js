/**
 * Created by CDCT on 2017/10/13.
 * 使用场景 (点击顶层获得焦点) 顶层子节点的最上层
 * author 375361172@qq.com
 * version 20171013 初始版本
 * 使用该方法应该具有以下文档结构
 * <div><input type="text"><div data-topGetFocus="1"></div></div>
 *
 *
 * 为选择的节点扩展方法removeClassFun 移除class
 */
(function(){
    var data=[];
    var getParentNode=function(Obj,Arr){
        if(!Arr){
            var Arr=[];
        }
        Arr.push(Obj);
        if(Obj&&Obj.parentNode){
            getParentNode(Obj.parentNode,Arr);
        }
        return Arr;
    };
    var a=function(e){
        var tg= e.target?e.target: e.srcElement;
        var path=getParentNode(tg);
        for(var q=0;q<data.length;q++){

            for(var w=0;w<path.length;w++){
                if(path[w]==data[q]){
                    return;
                }
            }
            $(data[q]).removeClass(data[q].getAttribute("data-bufClass"));
            $(data[q]).find("input").val("");
        }
    };
    $.fn.clickGetFocus=function(O){
        return this.each(function(){
            var defaultObj={
                getFocusClass:"getFocus"
            };
            $.extend(defaultObj,O);
            var $this=$(this);
            var top=$this.find("[data-topGetFocus='1']");
            $this.on("click",function(e){
                e.stopPropagation();
                $this.addClass(defaultObj.getFocusClass);
                $this.attr("data-bufClass",defaultObj.getFocusClass);
                $(this).find("input").focus();
            });
            this.removeClassFun=a;
            data.push(this);
        });
    };
    $(document).on("click",function(e){a(e)});
    if(window.location.href.search("http")!=-1){
        $(window.top.document).on("click",function(e){a(e)});
    }
})();


