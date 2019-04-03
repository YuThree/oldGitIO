/**
 * Created by CDCT on 2017/9/22.
 * author 375361172@qq.com
 * V1.0 (20170925)
 * V1.0.01(20171013) 1新增获取option的方法 2让在非多选情况下的selectText可以使用了
 * V1.0.02(20171025) 当下拉框的offset top大于窗口内容高度的一半的情况下的时候 会自动改变下拉的出现方向 为节点新增了参数保存属性
 * V1.0.03(20171026) 新增maxHeight属性 关联控件panel实现滚动条
 * V1.0.04(20171106) 修复以前删除的属性 userDefineStr selectCreateEnd
 * V1.0.05 (20171129) 新增无限制初始化
 * V1.0.06 (20171206) 为返回对象新增方法 删除option 新增option 修改option  设置value 等
 * V1.0.07 (20171207) 修复一直增加节点bug
 * V1.0.08 (20171208) 修复userDefineStr存在的一些bug
 * V1.0.09 (20171213) 修复卡顿bug
 * V1.0.10 (20171215) 新增在点击文档对象关闭触发回调函数 closeCallBack 之前  closeCallBackAfter 之后
 * V1.0.11 (20180102) 新增参数isStopPro 阻止事件冒泡
 */
/*模拟select*/
/**
 *自定义事件
 * change  当控件的value发生改变
 * clickChild  当点击控件的select
 * clickClose  当点击控件的关闭按钮
 *传入参数说明
 * 节点相关
 * hideElement JQ对象 option的父级节点
 * titleElement JQ对象 显示的文本节点
 * hideChildElement JQ对象 option节点
 * searchElement JQ对象 搜索框节点
 * value相关
 * attrValue string option节点组保存value的属性
 * multiple BOOL 是否多选
 * defaultValue array 设置默认选中的值
 * defaultValueNode BOOL defaultValue是按照节点还是value
 * defaultValueB value 当没有选择的值的时候显示value内容值
 * 文本相关
 * selectText string 设置选择的文本可以插入节点{a}为选择的text
 * 杂项
 * closeClass string 多选情况下的close的class
 * isStopPro 是否阻止冒泡 true 阻止冒泡 false 不阻止冒泡 默认为true
 * 返回对象 说明
 * getOption 获取传入的option
 * addOption 新增一个选项
 * setValue 设置value
 * removeOption 移除一个option
 * changeOption 改变一个option
 * 节点扩充对象说明
 * 为节点新增了一个属性 select 表示调用初始化方法返回的对象
 * domObj.select.getValue() 可以直接这样去获取选中的值
 * 多选情况下应该清除掉默认选中的值
 * */
(function(f){
    var selectArr=[];
    function getParentNode(Obj,Arr){
        if(!Arr){
            var Arr=[];
        }
        Arr.push(Obj);

        if(Obj&&Obj.parentNode){
            getParentNode(Obj.parentNode,Arr);
        }

        return Arr;
    }
    var select=function(Obj,optionObj){
        var defaultObj={
            isStopPro:true,
            hideElement:Obj.find(".hideUl"),//option的父级节点
            titleElement:Obj.find(".checkspan"),//显示的文本节点
            hideChildElement:Obj.find(".hideUlLi"),//option节点
            searchElement:Obj.find(".searchElement"),//搜索节点
            attrValue:"data-selectOption",//节点的value值
            multiple:false,//是否多选
            selectText:"<div class='selectDiv'>{a}<span class='close'>&times;</span></div>",//设置选择的文本 {a}为选择的text
            defaultValue:[0],//默认选择的节点
            defaultValueNode:false,//defaultValue 默认选中的是node还是value
            closeClass:"close",//多选 关闭已经选择的存在
            defaultValueB:-1,//value
            maxHeight:150,
            closeCallBack:function(){},
            closeCallBackAfter:function(){},
            userDefineStr:"",//用户自定义字符串一般和selectCreateEnd配合使用
            selectCreateEnd:function(){console.log("aaa");}//select生成触发函数
        };
        $.extend(defaultObj,optionObj);
        defaultObj.idArr=[];
        Obj.attr("data-valueA","");
        /*产生一个随机的唯一id*/
        function getId(){
            var idArr=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
            var str="";
            for(var i = 0;i<16;i++){
                if(i%4==0&&i!=0){
                    str=str+"-";
                    str=str+idArr[Math.round(Math.random()*25)];
                }else{
                    str=str+idArr[Math.round(Math.random()*25)];
                }
            }
            for(i=0;i<defaultObj.idArr.length;i++){
                if(defaultObj.idArr[i]==str){
                    return getId();
                }
            }
            defaultObj.idArr.push(str);
            return str;
        }
        var O=null;
        if(typeof Obj[0]!="undefined" && typeof Obj[0].select=="undefined"){
            O=new Object();
        }else if(typeof Obj[0]!="undefined"){
            O=Obj[0].select;
        }else if(typeof Obj[0]=="undefined"){
        	console.log("element is not find ");
        	return ;
        }
        Obj[0].select=O;
        /*保存选择的节点id*/
        O.value=[];
        O.defaultObj=defaultObj;
        O.bsEle=Obj[0];
        O.getValue=function(){
            var arr=new Array();
                for(var q= 0; q< O.value.length;q++){
                    for(var i =0 ; i <defaultObj.hideChildElement.length;i++){
                    if(defaultObj.hideChildElement[i].id== O.value[q]){
                        arr.push(defaultObj.hideChildElement[i].getAttribute(defaultObj.attrValue));
                    }
                }
            }
            return arr;
        };
        /*设置id*/
        O.setValue=function(arr){
            arr= O.valueOfId(arr);
            O.value=arr;
            Obj.attr("data-valueA",encodeURIComponent(JSON.stringify(O.value)));
            txt();
        };
        O.changeOption=function(txt,val){
            for(var i =0;i< O.defaultObj.hideChildElement.length;i++){
                if( O.defaultObj.hideChildElement[i].getAttribute(O.defaultObj.attrValue)==val){
                    O.defaultObj.hideChildElement[i].innerHTML=txt;
                }
            }
        };
        O.addOption=function(txt,val){
            var ele=$('<li class="hideUlLi">'+txt+'</li>');
            ele.attr(O.defaultObj.attrValue,val);
            ele[0].id=getId();
            O.defaultObj.hideElement.append(ele);
            O.defaultObj.hideChildElement=Obj.find(".hideUlLi");
        };
        O.removeOption=function(val){
            var idArr= O.valueOfId([val]);
            for(var i = 0;i< O.defaultObj.hideChildElement.length;i++){
                if(idArr[0]==O.defaultObj.hideChildElement[i].getAttribute("id")){
                    $(O.defaultObj.hideChildElement[i]).remove();
                }
            }
            O.defaultObj.hideChildElement=Obj.find(".hideUlLi");
            for(i=0;i< O.value.length;i++){
                if(O.value[i]==idArr[0]){
                    O.value.splice(i,1);
                    Obj.attr("data-valueA",encodeURIComponent(JSON.stringify(O.value)));
                    txt();
                }
            }

        };

        function txt(){
            $(select).html("");
            var valArr= O.getValue();
            for(var i =0;i< O.value.length;i++){
                for(var q= 0;q< O.defaultObj.hideChildElement.length;q++){
                    if(O.value[i]== O.defaultObj.hideChildElement[q].getAttribute("id")){
                        if(O.defaultObj.multiple){
                            if(valArr[i]!= O.defaultObj.defaultValueB){
                                var defoutStr=defaultObj.selectText.replace("{a}", O.defaultObj.hideChildElement[q].innerHTML);
                                defoutStr=$(defoutStr);
                                $(select).append(defoutStr);
                                defoutStr.find("."+defaultObj.closeClass).attr("data-Pid",O.defaultObj.hideChildElement[q].id);
                            }

                            fun3();
                        }else{
                            var defoutStr=defaultObj.selectText.replace("{a}", O.defaultObj.hideChildElement[q].innerHTML);
                            $(select).html(defoutStr);
                        }

                    }
                }
            }

        }

        O.valueOfId=function(arr){
            var arrs=[];
            for(var i = 0;i<arr.length;i++){
                for(var q=0;q< O.defaultObj.hideChildElement.length;q++){
                    if(O.defaultObj.hideChildElement[q].getAttribute(O.defaultObj.attrValue)==arr[i]){
                        arrs.push(O.defaultObj.hideChildElement[q].getAttribute("id"));
                    }
                }
            }
            return arrs;
        };
        for(var i=0;i<defaultObj.hideChildElement.length;i++){
            defaultObj.hideChildElement[i].id=getId();
        }

        var selectPr=defaultObj.hideElement.parent();


        if(defaultObj.userDefineStr==""){
            if(typeof Obj[0]!="undefined"&&typeof Obj[0].dv=="undefined"){
                Obj[0].dv=document.createElement("div");
            }else{
                console.log("element is not find");
            }
            var dv=  Obj[0].dv;
            $(dv).append(defaultObj.hideElement);
            if(selectPr[0]!=dv){
                selectPr.append(dv);
            }
        }

        var bool=false;
        for(var iq =0;iq<selectArr.length;iq++){
            if(O.bsEle==selectArr[iq].bsEle){
                selectArr[iq]=O;
                bool=true;
            }
        }
        if(bool==false){
            selectArr.push(O);
        }
        var ul=defaultObj.hideElement;
        var select=defaultObj.titleElement;

        /*关闭按钮添加事件*/
        function fun3(index){
            if(index<=-1){
                console.log("error:index is error function local fun3");
            }
            var h=$(select).find("."+defaultObj.closeClass);
            $(h).off("click");
            $(h).on("click",function(e){
                Obj.trigger("clickClose",[O,this]);
                for(var i =0;i< O.value.length;i++){
                    if(O.value[i]==this.getAttribute("data-Pid")){
                        O.value.splice(i,1);
                        i--;
                        Obj.trigger("change",[O]);
                    }
                }
                $(this.parentNode).remove();
                Obj.attr("data-valueA",encodeURIComponent(JSON.stringify(O.value)));
                fun2();
            });
        }
        function fun2(){
            for(var i=0;i<defaultObj.hideChildElement.length;i++){
                if(defaultObj.hideChildElement[i].getAttribute(defaultObj.attrValue)==defaultObj.defaultValueB&&defaultObj.defaultValue[0]!=defaultObj.defaultValueB){
                    defaultObj.hideChildElement[i].style.display="none";
                }
                if(((!defaultObj.defaultValue.length)&&(!O.value.length||(O.value.length==1&& O.getValue()==defaultObj.defaultValueB))&&defaultObj.hideChildElement[i].getAttribute(defaultObj.attrValue)==defaultObj.defaultValueB)||
                    (!O.value.length||(O.value.length==1&& O.getValue()==defaultObj.defaultValueB))&&defaultObj.hideChildElement[i].getAttribute(defaultObj.attrValue)==defaultObj.defaultValueB){
                  //  defaultObj.hideChildElement[i].style.display="block";
                    var selectLi= defaultObj.hideChildElement[i].innerHTML;
                    if(defaultObj.multiple==true){
                        for(var q =0;q< O.value.length;q++){
                            if(O.value[q]==defaultObj.hideChildElement[i].id){
                                $(select).html(selectLi);
                                fun3(i);
                                return;
                            }
                        }
                        O.value.push(defaultObj.hideChildElement[i].id);
                        Obj.attr("data-valueA",encodeURIComponent(JSON.stringify(O.value)));
                        $(select).html(selectLi);
                        fun3(i);
                    }else{
                        O.value[0]=defaultObj.hideChildElement[i].id;
                        Obj.attr("data-valueA",encodeURIComponent(JSON.stringify(O.value)));
                        $(select).html(selectLi);
                    }
                }
            }
        }
        fun2();
        for(i=0;i<defaultObj.hideChildElement.length;i++){
            for(var q=0;q<=defaultObj.defaultValue.length;q++){
                var tj=(typeof defaultObj.defaultValue.node!="undefined"&&defaultObj.defaultValue.node==false)||defaultObj.defaultValueNode==false?defaultObj.defaultValue[q]==$(defaultObj.hideChildElement[i]).attr(defaultObj.attrValue):defaultObj.defaultValue[q]==i;
                if(tj){
                    var selectLi= defaultObj.hideChildElement[i].innerHTML;
                    if(defaultObj.multiple==true){
                        if(O.value.length==1&&O.getValue()[0]==defaultObj.defaultValueB){
                            $(select).html("");
                        }
                        O.value.push(defaultObj.hideChildElement[i].id);
                        var defoutStr=defaultObj.selectText.replace("{a}",selectLi);
                        defoutStr=$(defoutStr);
                        defoutStr.find("."+defaultObj.closeClass).attr("data-Pid",defaultObj.hideChildElement[i].id);
                        $(select).append(defoutStr);
                        Obj.attr("data-valueA",encodeURIComponent(JSON.stringify(O.value)));
                        fun3(defaultObj.hideChildElement[i].id,i)
                    }else{
                        var defoutStr=defaultObj.selectText.replace("{a}",selectLi);
                        O.value[0]=defaultObj.hideChildElement[i].id;
                        Obj.attr("data-valueA",encodeURIComponent(JSON.stringify(O.value)));
                        $(select).html(defoutStr);
                    }
                }
            }
        }
        $(defaultObj.hideElement).on("click",function(e){
            if(O.defaultObj.isStopPro){
                if(e.stopPropagation){
                    e.stopPropagation();
                }else{
                    e.returnValue=false
                }
            }

        });
        if(typeof O.funBuffer!="undefined"){
        	  $(select).off("click", O.funBuffer);
        }
      
            O.funBuffer=function(e){
                if(!defaultObj.multiple){
                    ul.slideUp(0);
                    ul.css({
                        top:"",
                        bottom:""
                    });
                    if(defaultObj.userDefineStr==""){
                        $(dv).css({
                            height:"0px"
                        });
                    }

                    defaultObj.hideChildElement.off("click");
                }
                if(O.defaultObj.isStopPro){
                    e.stopPropagation&& e.stopPropagation();
                    e.cancelBubble&&(e.cancelBubble = true);
                }

                var THIS = this;
                if(ul.is(":hidden")){
                    ul.slideDown(0, function(){
                        if(defaultObj.userDefineStr!=""){
                            defaultObj.clickTitle(ul,defaultObj,Obj);
                            return;
                        }
                        defaultObj.hideChildElement.on("click",function(e){
                            if(e.defaultPrevented){
                                e.defaultPrevented()
                            }else{
                                e.returnValue=false;
                            }
                            var selectLi=$(this).text();
                            var buf=null;
                            if(defaultObj.multiple==false){
                                var defoutStr=defaultObj.selectText.replace("{a}",selectLi);
                                $(THIS).html(defoutStr);
                                $(ul).slideUp(0);
                                if(defaultObj.userDefineStr==""){
                                    $(dv).css({
                                        height:"0px"
                                    });
                                }

                                ul.css({
                                    top:"",
                                    bottom:""
                                });
                                buf= O.value[0];
                                O.value[0]=this.id;
                                Obj.trigger("clickChild",[O]);
                                Obj.attr("data-valueA",encodeURIComponent(JSON.stringify(O.value)));
                                if(O.value[0]!=buf){
                                    Obj.trigger("change",[O]);
                                    fun2();
                                }
                            }else{
                                for(var i =0;i< O.value.length;i++){
                                    if(O.value[i]==this.id){
                                        return;
                                    }
                                }
                                Obj.trigger("clickChild",[O]);
                                Obj.attr("data-valueA",encodeURIComponent(JSON.stringify(O.value)));
                                var defoutStr=defaultObj.selectText.replace("{a}",selectLi);
                                defoutStr=$(defoutStr);
                                defoutStr.find("."+defaultObj.closeClass).attr("data-Pid",this.id);
                                if(O.value.length==1&&O.getValue()[0]==defaultObj.defaultValueB){
                                    $(THIS).html("");
                                    $(THIS).append(defoutStr);
                                }else{
                                    $(THIS).append(defoutStr);
                                }
                                O.value.push(this.id);
                                Obj.attr("data-valueA",encodeURIComponent(JSON.stringify(O.value)));
                                Obj.trigger("change",[O]);
                                fun3($(THIS).find("."+defaultObj.closeClass).length-1);
                                fun2();
                            }

                        });
                        var ulH=ul.outerHeight();
                        if(defaultObj.userDefineStr!=""){
                                return
                        }
                        $(dv).css({
                            zIndex:10000
                        });
                        if(defaultObj.hideElement.outerHeight()<defaultObj.maxHeight){
                            $(dv).css({
                                height:ulH+"px",
                                position:"absolute",
                                width:"100%",
                                left:"0",
                                top:"100%"
                            });
                            ul.css({
                                top:"0",
                                bottom:"auto"
                            });
                            if(ul.offset().top<document.documentElement.clientHeight/2){
                                $(dv).css({
                                    top:"",
                                    bottom:""
                                })
                            }else{
                                $(dv).css({
                                    top:"auto",
                                    bottom:"100%"
                                })
                            }
                        }else{
                            $(dv).css({
                                height:defaultObj.maxHeight+"px",
                                position:"absolute",
                                width:"100%",
                                left:"0",
                                top:"100%"
                            });
                            ul.css({
                                top:"0",
                                bottom:"auto",
                                left:"0"
                            });
                            if(ul.offset().top<document.documentElement.clientHeight/2){
                                $(dv).css({
                                    top:"",
                                    bottom:""
                                })
                            }else{
                                $(dv).css({
                                    top:"auto",
                                    bottom:"100%"
                                })
                            }

                            if($(document).panel){
                                if (typeof select[0]!="undefined"&&typeof  select[0].panelBuf=="undefined"&&select[0].panelBuf!=true){
                                    select[0].panelBuf=true;
                                    $(dv).panel({
                                        iWheelStep:"32"
                                    })
                                }

                            }
                        }



                    });
                }else{
                    if(!defaultObj.multiple){
                        ul.slideUp(0);
                        $(dv).css({
                            height:"0px"
                        });
                        defaultObj.hideChildElement.off("click");
                        ul.css({
                            top:"",
                            bottom:""
                        })
                    }
                }
            };

        $(select).on("click", O.funBuffer);
        O.close=function(){
            O.defaultObj.closeCallBack(O);
            defaultObj.hideElement.slideUp(0);
            $(dv).css({
                height:"0px"
            });
            $(defaultObj.hideElement).css({
                top:"",
                bottom:""
            });
            defaultObj.hideChildElement.off("click");
            O.defaultObj.closeCallBackAfter(O);
        };
        defaultObj.searchElement&&($(defaultObj.searchElement).on("click",function(e){

            e.stopPropagation&& e.stopPropagation();
            e.cancelBubble&&(e.cancelBubble = true);
        }));
        defaultObj.searchElement&&($(defaultObj.searchElement).on("keyup",function(e){
            e.stopPropagation&& e.stopPropagation();
            e.cancelBubble&&(e.cancelBubble = true);
            var tsInput=$(this).find("input");
            var  values=tsInput.val();
            var $thisParentNode= defaultObj.hideChildElement;
            for(var i=0;i<$thisParentNode.length;i++){
                if($thisParentNode[i].getAttribute(defaultObj.attrValue)==defaultObj.defaultValueB){
                    break;
                }
                if($thisParentNode[i].innerHTML.search(values)!=-1){
                    $thisParentNode[i].style.display="";
                }else{
                    $thisParentNode[i].style.display="none";
                }

            }

        }));

        O.getOption=function(){
            return defaultObj;
        };
        if(defaultObj.userDefineStr!=""){
            ul.html(defaultObj.userDefineStr);
            defaultObj.selectCreateEnd(ul,defaultObj,Obj);
            return;
        }


        return O;
    };
    $(document).on("click",function(e){
        if(!selectArr.length)return;
        var target= typeof e.srcElement=="undefined"?e.target:e.srcElement;
        var path = getParentNode(target);
        for(var i =0 ;i<selectArr.length;i++){
            if(selectArr[i].defaultObj.isStopPro==false){
                var bool=true;
                for(var q= 0 ;q<path.length;q++){
                    if(path[q].getAttribute&&path[q].getAttribute("data-valueA")!=null){
                        bool=false;
                    }
                }
                if(bool)selectArr[i].close();
            }else{
                selectArr[i].close();
            }
        }
    });
    f(select);
})(function(A){
    $.fn.simulationSelect=function(Obj){

        return A(this,Obj);
    }
});

