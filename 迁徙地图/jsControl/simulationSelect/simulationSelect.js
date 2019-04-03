/**
 * Created by CDCT on 2017/9/22.
 * author 375361172@qq.com
 * V1.0 (20170925)
 * V1.0.01 (20171013) 1新增获取option的方法 2让在非多选情况下的selectText可以使用了
 * V1.0.02 (20171025) 当下拉框的offset top大于窗口内容高度的一半的情况下的时候 会自动改变下拉的出现方向 为节点新增了参数保存属性
 * V1.0.03 (20171026) 新增maxHeight属性 关联控件panel实现滚动条
 * V1.0.04 (20171106) 修复以前删除的属性 userDefineStr selectCreateEnd
 * V1.0.05 (20171129) 新增无限制初始化
 * V1.0.06 (20171206) 为返回对象新增方法 删除option 新增option 修改option  设置value 等
 * V1.0.07 (20171207) 修复一直增加节点bug
 * V1.0.08 (20171208) 修复userDefineStr存在的一些bug
 * V1.0.09 (20171213) 修复卡顿bug
 * V1.0.10 (20171215) 新增在点击文档对象关闭触发回调函数 closeCallBack 之前  closeCallBackAfter 之后
 * V1.0.11 (20180102) 新增参数isStopPro 阻止事件冒泡
 * V1.0.12 (20180202) 修改隐藏的option不能添加click事件的bug
 * V1.0.13 (20180308) 新增removeAllOption 和修复一些bug
 * V1.0.14 (20180321) 新增参数zIndexParent 指定一个父节点 该父节点会在显示的时候zIndex被修改
 * V1.0.15 (20180323) 新增参数showType 设置下拉内容是不是在当前文档对象的body节点下面显示
 * V1.0.16 (20180428) 为document点击事件触发传参simulationSelect
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
 * showType 显示类型 默认为normal 正常显示 top 会以body为最上层显示
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
            showType:"normal",//设置为top就是在body下面显示下拉内容
            zIndexParent:null,
            position:"absolute",
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
        function getClone(Obj){
            if($(Obj).attr("data-selectSimu")==1){
                return $(Obj).clone();
            }else{
                return getClone($(Obj).parent());
            }
        }
        function getClone02(Obj){
            var clone = null;
            clone= getClone(Obj);
            clone.addClass("cloneSlect");
            clone.css({
                position:"absolute",
                height:"0",
                borderRadius:"0",
                width:$(Obj).outerWidth()+"px",
                zIndex:100000,
                height:defaultObj.maxHeight+"px"
            });
            clone.find(".selectBox").css({
                border:"none",
                borderRadius:"0",
                height:"auto",
                padding:"0"
            });
            clone.find(".selectBox").attr("id","");
            
            clone.find(".selectBox").attr("data-valueA","");
            clone.find(".checkspan").css({
                display:"none"
            });
            var allHideLi= clone.find(".hideUlLi");
            allHideLi.attr("id","");
            allHideLi.each(function(){
                if($(this).attr(defaultObj.attrValue)==defaultObj.defaultValueB){
                    $(this).css({
                        display:"none"
                    })
                }
            });
            clone.find('[data-selectBox="1"]').css({
                position:"static"
            });
        
            clone.find(".selectBox").append(clone.find(".hideUl"));
            clone.find(".ulParent").remove();
            if($(document).panel){
                $(clone).panel({
                    iWheelStep:"32",
                    cScroll:true
                });
            }
            return clone;
        }
        O.cloneEle =getClone02(Obj);
    
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
        
            if(Array.isArray(val)&&Array.isArray(txt)){
                for(var i = 0;i<val.length;i++){
                    txt[i]=txt[i]||"未知选项";
                    var ele=$('<li class="hideUlLi">'+txt[i]+'</li>');
                    ele.attr(O.defaultObj.attrValue,val);
                    ele[0].id=getId();
                    O.defaultObj.hideElement.append(ele);
                }
            }else{
                var ele=$('<li class="hideUlLi">'+txt+'</li>');
                ele.attr(O.defaultObj.attrValue,val);
                ele[0].id=getId();
                O.defaultObj.hideElement.append(ele);
            }
            O.defaultObj.hideChildElement=Obj.find(".hideUlLi");
            if(O.defaultObj.showType=="top"){
                O.cloneEle=getClone02(Obj);
            }
        };
        O.removeOption=function(val){
            var idArr= O.valueOfId([val]);
            for(var i = 0;i< O.defaultObj.hideChildElement.length;i++){
                if(idArr[0]==O.defaultObj.hideChildElement[i].getAttribute("id")){
                    $(O.defaultObj.hideChildElement[i]).remove();
                    for(var o=0;o<defaultObj.idArr.length;o++){
                        if(defaultObj.idArr[o]==idArr[0]){
                            defaultObj.idArr.splice(o,1);
                        }
                    }
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
            if(O.defaultObj.showType=="top"){
                O.cloneEle=getClone02(Obj);
            }
        };
        O.removeAllOption=function(){
            var idArr= defaultObj.idArr;
            for(var i = 0;i< idArr.length;i++){
                if(idArr[i]==O.defaultObj.hideChildElement[i].getAttribute("id")){
                    $(O.defaultObj.hideChildElement[i]).remove();
                }
            }
            for( i = 0;i< idArr.length;i++){
            for(var w=0;w< O.value.length;w++){
                if(O.value[w]==idArr[i]){
                        O.value.splice(w,1);
                    }
                }
            }
            Obj.attr("data-valueA",encodeURIComponent(JSON.stringify(O.value)));
            txt();
            O.defaultObj.hideChildElement=Obj.find(".hideUlLi");

            defaultObj.idArr.splice(0,defaultObj.idArr.length);
            if(O.defaultObj.showType=="top"){
                O.cloneEle=getClone02(Obj);
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
                $(Obj[0].dv).addClass("ulParent");
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
                                return O;
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
        if(!O.clickChild){
            O.clickChild=function(e){
                if(e.defaultPrevented){
                    e.defaultPrevented()
                }else{
                    e.returnValue=false;
                }

                var THIS = select[0];
                var li=O.cloneEle.find(".hideUlLi");
                var selectLi=$(this).text();
                var buf=null;
                var value = "";
                if(defaultObj.showType=="top"){
                    value=li.index(this);
                    value=$(defaultObj.hideChildElement[value]).attr("id");
                }else{
                    value=this.getAttribute("id");
                }
                if(defaultObj.multiple==false){
                    var defoutStr=defaultObj.selectText.replace("{a}",selectLi);
                    $(THIS).html(defoutStr);
                    O.close();
                    if(defaultObj.zIndexParent!=null){
            
                        $(defaultObj.zIndexParent)[0].style.zIndex=defaultObj.bufzIndex;
                    }
                    buf= O.value[0];
                    O.value[0]=value;
                    Obj.trigger("clickChild",[O]);
                    Obj.attr("data-valueA",encodeURIComponent(JSON.stringify(O.value)));
                    if(O.value[0]!=buf){
                        Obj.trigger("change",[O]);
                        fun2();
                    }
                }else{
                    for(var i =0;i< O.value.length;i++){
                        if(O.value[i]==value){
                            return O;
                        }
                    }
                  
                    Obj.trigger("clickChild",[O]);
                    Obj.attr("data-valueA",encodeURIComponent(JSON.stringify(O.value)));
                    var defoutStr=defaultObj.selectText.replace("{a}",selectLi);
                    defoutStr=$(defoutStr);
                    defoutStr.find("."+defaultObj.closeClass).attr("data-Pid",value);
                    if(O.value.length==1&&O.getValue()[0]==defaultObj.defaultValueB){
                        $(THIS).html("");
                        $(THIS).append(defoutStr);
                    }else{
                        $(THIS).append(defoutStr);
                    }
                    O.value.push(value);
                    Obj.attr("data-valueA",encodeURIComponent(JSON.stringify(O.value)));
                    Obj.trigger("change",[O]);
                    fun3($(THIS).find("."+defaultObj.closeClass).length-1);
                    fun2();
                }

            };
        }

            O.funBuffer=function(e){
                var li = defaultObj.hideChildElement;
                $(document).trigger("click",["simulationSelect"]);
               
                if(!defaultObj.multiple){
                    O.close();
                    li.off("click", O.clickChild);
                }
                   /*控制下拉表格 树形扩展相关*/ 
                if(defaultObj.userDefineStr!=""){
                    defaultObj.clickTitle(ul,defaultObj,Obj,O,e);
                    return O;
                }
                if(O.defaultObj.isStopPro){
                    e.stopPropagation&& e.stopPropagation();
                    e.cancelBubble&&(e.cancelBubble = true);
                }

                if(O.defaultObj.showType=="top"){
                    $(document.body).append(O.cloneEle);
                    ul=O.cloneEle.find(".hideUl");
                    li=O.cloneEle.find(".hideUlLi");
                }
    
                if(ul.is(":hidden")){
                    ul.slideDown(0, function(){
                        var ele = null;
                        /*控制zIndex 相关*/ 
                        if(defaultObj.zIndexParent!=null){
                            defaultObj.bufzIndex=$(defaultObj.zIndexParent).css("zIndex");
                            $(defaultObj.zIndexParent)[0].style.zIndex=100000000;
                        }
                  
                        /*控制点击选择*/
                        li.on("click", O.clickChild);
                        var ulH=ul.outerHeight();
                        if(defaultObj.userDefineStr!=""){
                                return O
                        }
                        $(dv).css({
                            zIndex:10000000
                        });
                        var x = Obj.offset().left;
                        var y = Obj.offset().top;
                        if(defaultObj.position=="fixed"){
                            y=y-window.scrollY;
                        }
                        if(defaultObj.hideElement.outerHeight()<defaultObj.maxHeight){
                            if(defaultObj.position=="fixed"){
                                $(dv).css({
                                    height:ulH+"px",
                                    position:"fixed",
                                    width:Obj.outerWidth()+"px",
                                    left:x+"px",
                                    top:y+"px"
                                });
                            }else{
                                $(dv).css({
                                    height:ulH+"px",
                                    position:"absolute",
                                    width:"100%",
                                    left:"0",
                                    top:"100%"
                                });
                            }


                            ul.css({
                                top:"0",
                                bottom:"auto"
                            });
                            if(ul.offset().top<document.documentElement.clientHeight/2){
                                if(defaultObj.position=="fixed"){
                                       $(dv).css({
                                           top:y+Obj.outerHeight()+"px",
                                           bottom:"auto"
                                       })
                                }else{
                                    $(dv).css({
                                        top:"100%",
                                        bottom:"auto"
                                    })
                                }
                            }else{
                                if(defaultObj.position=="fixed"){
                                    $(dv).css({
                                        top:y-defaultObj.hideElement.outerHeight()+"px",
                                        bottom:"auto"
                                    });
                                }else{
                                    $(dv).css({
                                        top:"auto",
                                        bottom:"100%"
                                    })
                                }

                            }
                        }else{
                            if(defaultObj.position=="fixed"){
                                $(dv).css({
                                    height:defaultObj.maxHeight+"px",
                                    position:"fixed",
                                    width:Obj.outerWidth()+"px",
                                    left:x+"px",
                                    top:y+"px"
                                });
                            }else{
                                $(dv).css({
                                    height:defaultObj.maxHeight+"px",
                                    position:"absolute",
                                    width:"100%",
                                    left:"0",
                                    top:"100%"
                                });
                            }
                            ul.css({
                                top:"0",
                                bottom:"auto",
                                left:"0"
                            });
                            if(ul.offset().top<document.documentElement.clientHeight/2){
                                if(defaultObj.position=="fixed"){
                                    $(dv).css({
                                        top:y+Obj.outerHeight()+"px",
                                        bottom:"auto"
                                    })
                                }else{
                                    $(dv).css({
                                        top:"100%",
                                        bottom:"auto"
                                    })
                                }

                            }else{
                                if(defaultObj.position=="fixed"){
                                    $(dv).css({
                                        top:y-defaultObj.maxHeight+"px",
                                        bottom:"auto"
                                    });
                                }else{
                                    $(dv).css({
                                        top:"auto",
                                        bottom:"100%"
                                    })
                                }
                            }

                            if($(document).panel){
                                if (typeof select[0]!="undefined"&&typeof  select[0].panelBuf=="undefined"&&select[0].panelBuf!=true){
                                    select[0].panelBuf=true;
                                    $(dv).panel({
                                        iWheelStep:"32",
                                        cScroll:true
                                    })
                                }

                            }
                        }



                    });
                }else{
                    if(!defaultObj.multiple){
                        O.close();
                    }
                }
                if(O.defaultObj.showType=="top"){
                    var h = 150;
                    $(Obj).find(".ulParent").css({
                        display:"none"
                    })
                    O.cloneEle.find(".zUIpanelScrollBox").remove();
                    O.cloneEle.find(".zUIpanelScrollBar").remove();
                    O.cloneEle.find(".zUIpanelScrollBoxW").remove();
                    if(O.cloneEle.find(".selectBox").outerHeight()<defaultObj.maxHeight){
                        h=O.cloneEle.find(".selectBox").outerHeight()
                    }else{
                        h=defaultObj.maxHeight;
                    }
                    var t =$(Obj).offset().top+$(Obj).outerHeight();
                    var l =$(Obj).offset().left;
                    if($(Obj).offset().top>document.documentElement.clientHeight/2){
                        t=t-h-$(Obj).outerHeight();
                    }
                    O.cloneEle.css({
                       height:h+"px",
                       top:t+"px",
                       left:l+"px",
                    });
                    if($(document).panel){
                        $(O.cloneEle).panel({
                            iWheelStep:"32",
                            cScroll:true
                        });
                    }
                    initSearchEvent(O.cloneEle.find(".searchElement"));
                }
            };

        $(select).on("click", O.funBuffer);
        O.close=function(){
            O.defaultObj.closeCallBack(O);
            ul.slideUp(0);
            defaultObj.hideElement.slideUp(0);
            if(defaultObj.zIndexParent!=null){
            
                $(defaultObj.zIndexParent)[0].style.zIndex=defaultObj.bufzIndex;
            }
            $(dv).css({
                height:"0px"
            });
            $(defaultObj.hideElement).css({
                top:"",
                bottom:""
            });
            defaultObj.hideChildElement.off("click",O.clickChild);
            O.defaultObj.closeCallBackAfter(O);
            O.cloneEle&&O.cloneEle.remove();
        };
        function initSearchEvent(eleObj){
            eleObj&&($(eleObj).on("click",function(e){
                console.log("asd");
                e.stopPropagation&& e.stopPropagation();
                e.cancelBubble&&(e.cancelBubble = true);
            }));
            eleObj&&($(eleObj).on("keyup",function(e){
                console.log("keyup");
    
                e.stopPropagation&& e.stopPropagation();
                e.cancelBubble&&(e.cancelBubble = true);
                var tsInput=$(this).find("input");
                var  values=tsInput.val();
                var $thisParentNode= defaultObj.hideChildElement;
                if(O.defaultObj.showType=="top"){
                    $thisParentNode=O.cloneEle.find(".hideUlLi");
                }
                for(var i=0;i<$thisParentNode.length;i++){
                    if($thisParentNode[i].getAttribute(defaultObj.attrValue)==defaultObj.defaultValueB){
                        continue;
                    }
                    if($thisParentNode[i].innerHTML.search(values)!=-1){
                        $thisParentNode[i].style.display="";
                    }else{
                        $thisParentNode[i].style.display="none";
                    }
    
                }
    
            }));
        }
        initSearchEvent(defaultObj.searchElement);
      

        O.getOption=function(){
            return defaultObj;
        };
        if(defaultObj.userDefineStr!=""){
            ul.html(defaultObj.userDefineStr);
            defaultObj.selectCreateEnd(ul,defaultObj,Obj);
            return O;
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
                    if((path[q].getAttribute&&path[q].getAttribute("data-valueA")!=null)||(path[q].getAttribute&&path[q].getAttribute("data-selectSimu")!=null)){
                        bool=false;
                    }
                }
                if(bool)selectArr[i].close();
            }else{
                var bool=true;
                for(var q= 0 ;q<path.length;q++){
                    if($(path[q]).hasClass("hideDiv")){
                        bool=false;
                    }
                }
                if(selectArr[i].table){
                    TABLE_INFO_BUFFER_ARR.splice(TABLE_INFO_BUFFER_ARR.indexOf(selectArr[i].table),1);
                }
                if(bool)selectArr[i].close();
                
            }
        }
    });
    f(select);
})(function(A){
    $.fn.simulationSelect=function(Obj){

        return A(this,Obj);
    }
});

