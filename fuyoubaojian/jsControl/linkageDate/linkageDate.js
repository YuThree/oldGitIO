/**
 * Created by CDCT on 2017/10/17.
 * author 375361172@qq.com
 * 初始版本20171017(基于jq)
 *
 *
 *
 *  传入数据说明
 *  userAttr 用户自定义属性 Obj
 *  name 内容
 *  data 字迹
 *
 *  author 375361172@qq.com
 *  初始版本1.0 (20171031)
 *  V1.0.02 (20171212) 修复一些bug
 *  data 联动的data
 *  valueArr 默认值Arr
 *  isLast 选择到最后一级触发的函数
 *  linkProtoBox 扩展样式
 *  initStr 初始字符串
 *  headerAfterStr 头部每级选择之后的内容 以数组表示
 *  bottomAfterStr 子节点每级选择之后的内容 以数组表示
 *  isShow 是否显示
 *  headerShow 是否显示头部
 *  bottomShow 是否显示内容
 */
;(function(f){
    function centerF(O){
        var  getParentNode=function(Obj,Arr){
            if(!Arr){
                var Arr=[];
            }
            Arr.push(Obj);

            if(Obj&&Obj.parentNode){
                getParentNode(Obj.parentNode,Arr);
            }

            return Arr;
        };
        var defaultObj={
            data:[],
            valueArr:[0],
            isLast:function(){
                console.log("code is now")
            },
            linkProtoBox:-1,
            initStr:"<div data-linkBox='1'>" +
            "<div class='top'></div>" +
            "<div class='bottom'></div>"+
            "</div>",
            headerAfterStr:[],
            bottomAfterStr:[],
            clickTabClearChild:false,
            isShow:false,
            headerShow:false,
            bottomShow:false,
            appendEnd:function(A){

                /*console.log(arguments);*/
            }
        };
        $.extend(defaultObj,O);
        if(defaultObj.THIS.length!=1){
            console.log("error:linkageDate is only 1 element");
        }
        var A = new Object();
        A.option=defaultObj;
        A.initStr=defaultObj.initStr;
        A.box=$(A.initStr);
        if(A.option.linkProtoBox!=-1){
            A.box.attr("data-linkProtoBox",A.option.linkProtoBox);
        }

        A.getEleBottom=function(arr){
            var strA="<div class='childBoxClass'><div class='scrollBoxLinkAge'>";
            for(var i =0;i<arr.length;i++){
                strA=strA+"<div data-childId='"+i+"' class='child'>"+arr[i].name+"</div>";
                if(typeof A.option.bottomAfterStr[i]!="undefined"){
                    strA=strA+A.option.bottomAfterStr[i];
                }
            }
            strA=strA+"</div></div>";
            return $(strA);
        };
        A.getEleTop=function(str,userAttr){
            var strA="";
            var strB="";
            if(typeof userAttr!="undefined"){
                for(var i in userAttr){
                    strB=strB+" data-"+i+"="+userAttr[i]+" ";
                }
            }
            if(typeof A.option.headerAfterStr[A.intA]!="undefined"){
                strA=strA+"<div "+strB+" class='topBox'>"+str+"</div>"+A.option.headerAfterStr[A.intA];
            }else{
                strA=strA+"<div "+strB+" class='topBox'>"+str+"</div>"
            }
            return $(strA);
        };
        A.nowShow=0;
        A.addEvent=function(){
            var headerEle=A.box.find(".topBox");
            var childEle= A.box.find(".childBoxClass");
            headerEle.on("click",function(e){
                e.stopPropagation();
                if($(this).hasClass("change")|| A.option.clickTabClearChild==false){
                    $(headerEle).removeClass("change");
                    $(headerEle[headerEle.index(this)]).addClass("change");
                    childEle.css({
                        display:"none"
                    });
                    $(childEle[headerEle.index(this)]).css({
                        display:""
                    });
                    return;
                }else{
                    A.option.valueArr.splice(headerEle.index(this)+1,headerEle.length);
                    A.appendEle();
                    A.box.find(".topBox:last-child").html("请选择");
                    A.addEvent();
                }
            });

            childEle.on("click",function(e){
                e.stopPropagation();
                var tg= e.target? e.target: e.srcElement;
                var path=getParentNode(tg);
                for(var o=0;o<path.length;o++){
                    if($(path[o]).hasClass("child")){
                        if(A.option.valueArr[A.option.valueArr.length-1]==-1){
                            A.option.valueArr.pop();
                        }
                        var  headerEleSelect=A.box.find(".topBox.change");
                        A.option.valueArr.splice(headerEle.index(headerEleSelect[0])+1, A.option.valueArr.length);
                        var number=A.option.valueArr.length-1;
                        if(number<0){
                            number=0;
                        }
                        A.option.valueArr[number]=parseInt($(path[o]).attr("data-childId"));
                        A.intB=0;
                        A.hasChild();
                        A.appendEle();
                        A.addEvent();
                        return;
                    }
                }
            });
        };
        A.hasChild=function(Obj){
            if(typeof Obj=="undefined"){
                if(A.intB< A.option.valueArr.length){
                    if(typeof A.option.data[A.option.valueArr[A.intB]]!="undefined"&&typeof A.option.data[A.option.valueArr[A.intB]]!="undefined"&&typeof A.option.data[A.option.valueArr[A.intB]].data!="undefined"&&A.option.data[A.option.valueArr[A.intB]].data.length>=1){
                        A.intB++;
                        A.hasChild(A.option.data[A.option.valueArr[A.intB-1]].data);
                    }
                    if(A.intB == A.option.valueArr.length-1){
                        if(typeof A.option.data[A.option.valueArr[A.intB]]!="undefined"&&typeof A.option.data[A.option.valueArr[A.intB]].data!="undefined"&&A.option.data[A.option.valueArr[A.intB]].data.length>=1){
                            A.option.valueArr.push(0);
                            A.option.valueArr.push(-1);
                        }else{
                            if(typeof A.option.data[A.option.valueArr[A.intB]]!="undefined"){
                                A.intB=0;
                                A.option.isLast(A);
                                return "false"
                            }

                        }
                    }
                } else{
                    A.intB=0;
                }
            }else{
                if(A.intB < A.option.valueArr.length){
                    if(A.intB == A.option.valueArr.length-1){
                        if(typeof Obj[A.option.valueArr[A.intB]]!="undefined"&&typeof Obj[A.option.valueArr[A.intB]].data!="undefined"&&Obj[A.option.valueArr[A.intB]].data.length>=1){
                            A.option.valueArr.push(0);
                            A.option.valueArr.push(-1);
                        }else{
                            if(typeof Obj[A.option.valueArr[A.intB]]!="undefined"){
                                A.intB=0;
                                A.option.isLast(A);
                                return "false"
                            }

                        }
                    }
                    if (typeof Obj[A.option.valueArr[A.intB]]!="undefined"&&typeof Obj[A.option.valueArr[A.intB]].data != "undefined" && Obj[A.option.valueArr[A.intB]].data.length >= 1) {
                        A.intB++;
                        A.hasChild(Obj[A.option.valueArr[A.intB-1]].data);
                    }


                }else{
                    A.intB=0;
                }
            }

        };
        A.intA=0;
        A.intB=0;
        A.appendEle=function(str,Obj){
            if(typeof str=="undefined"){
                A.box.find(".top").html("");
                A.box.find(".bottom").html("");
                if(A.intA== A.nowShow){

                    if(A.option.valueArr[A.intA]==-1){
                        var ele=A.getEleTop("请选择",A.option.data[A.option.valueArr[A.intA]].userAttr);
                        ele[0]=$(ele[0]).addClass("change")[0];
                        A.box.find(".top").append(ele);
                    }else{

                        var ele=A.getEleTop(A.option.data[A.option.valueArr[A.intA]].name,A.option.data[A.option.valueArr[A.intA]].userAttr);
                        ele[0]=$(ele[0]).addClass("change")[0];
                        A.box.find(".top").append(ele);

                    }
                    A.box.find(".bottom").append(A.getEleBottom(A.option.data).css({display:""}));
                }else{

                    A.box.find(".top").append(A.getEleTop(A.option.data[A.option.valueArr[A.intA]].name,A.option.data[A.option.valueArr[A.intA]].userAttr));
                    A.box.find(".bottom").append(A.getEleBottom(A.option.data).css({display:"none"}));

                    A.box.find(".topBox").removeClass("change");
                    var allTop=A.box.find(".topBox");
                    $(allTop[allTop.length-1]).addClass("change");
                    A.box.find(".childBoxClass").css({display:"none"});
                    A.box.find(".childBoxClass:last-child").css({display:""});
                }
                if(A.intA< A.option.valueArr.length-1){
                    A.intA++;
                    A.appendEle("true",A.option.data[A.option.valueArr[A.intA-1]].data);
                }else{
                    A.intA=0;
                }
            }else{

                if(A.intA== A.nowShow){
                    if(A.option.valueArr[A.intA]==-1){
                        var ele=A.getEleTop("请选择",Obj[A.option.valueArr[A.intA]].userAttr);
                        ele[0]=$(ele[0]).addClass("change")[0];
                        A.box.find(".top").append(ele);
                    }else{

                        var ele =A.getEleTop(Obj[A.option.valueArr[A.intA]].name,Obj[A.option.valueArr[A.intA]].userAttr);
                        ele[0]=$(ele[0]).addClass("change")[0];
                        A.box.find(".top").append(ele);
                    }
                    A.box.find(".bottom").append(A.getEleBottom(Obj).css({display:""}));
                }else{
                    A.box.find(".top").append(A.getEleTop(Obj[A.option.valueArr[A.intA]].name,Obj[A.option.valueArr[A.intA]].userAttr));
                    A.box.find(".bottom").append(A.getEleBottom(Obj).css({display:"none"}));
                }
                if(A.intA< A.option.valueArr.length-1){
                    A.intA++;
                    if(A.option.valueArr[A.intA]==-1){
                        A.box.find(".topBox").removeClass("change");
                        var allTop=A.box.find(".topBox");
                        $(allTop[allTop.length-1]).addClass("change");
                        A.box.find(".topBox:last-child").html("请选择");
                        A.box.find(".childBoxClass").css({display:"none"});
                        A.box.find(".childBoxClass:last-child").css({display:""});
                        A.nowShow=A.intA-1;
                        A.intA=0;
                        return 0;
                    }
                    A.appendEle("true",Obj[A.option.valueArr[A.intA-1]].data);
                }else{
                    A.box.find(".topBox").removeClass("change");
                    var allTop=A.box.find(".topBox");
                    $(allTop[allTop.length-1]).addClass("change");
                    A.box.find(".childBoxClass").css({display:"none"});
                    A.box.find(".childBoxClass:last-child").css({display:""});
                    A.nowShow=A.intA-1;
                    A.intA=0;
                }
            }
            A.option.appendEnd(A);
            if(A.box.find(".bottom .childBoxClass").panel){
                var all=A.box.find(".bottom .childBoxClass");
                $.each(all,function(){
                    if(typeof this.show=="undefined"){
                        this.show=true;
                        $(this).panel({
                            iWheelStep:32
                        })
                    }
                });
            }
        };
        A.show=function(){
            var ele= A.option.THIS;
            var x=ele.offset().left;
            var y=ele.offset().top+ele.height();

            A.appendEle();
            if(A.option.isShow){
                A.option.THIS.append(A.box);
                var header= A.box.find(".topBox");
                var bottom= A.box.find(".childBoxClass");

                if(A.option.headerShow){
                    A.box.find(".top").css({
                        display:""
                    });
                }else{
                    A.box.find(".top").css({
                        display:"none"
                    });
                }
                if(A.option.bottomShow){
                    $(bottom[header.index(A.box.find(".topBox.change")[0])]).css({
                        display:""
                    });
                }else{
                    bottom.css({
                        display:"none"
                    });
                }
            }else{
                A.box.css({
                    "position":"absolute",
                    "left":x,
                    "top":y
                });
                $(document.body).append(A.box);
            }

            A.addEvent();
        };
        A.close=function(){
            A.box.remove();
        };
        A.option.THIS.on("click",function(){
            A.show();
        });
        $(document).on("click",function(e){
            if(A.option.isShow){
                var header= A.box.find(".topBox");
                var bottom= A.box.find(".childBoxClass");

                if(A.option.headerShow){
                    A.box.find(".top").css({
                        display:""
                    });
                }else{
                    A.box.find(".top").css({
                        display:"none"
                    });
                }
                if(A.option.bottomShow){
                    $(bottom[header.index(A.box.find(".topBox.change")[0])]).css({
                        display:""
                    });
                }else{
                    bottom.css({
                        display:"none"
                    });
                }
                return
            }
            var tg= e.target? e.target: e.srcElement;
            var path=getParentNode(tg);
            for(var i = 0;i<path.length;i++){
                if(path[i]== A.option.THIS[0]||path[i]== A.box[0]){
                    return;
                }
            }
            A.close();
        });

        if(A.option.isShow){
            A.show();
        }
        return A;
    }
    f(centerF)
})(function(O){
    $.fn.linkageDate=function(Obj){
        if(typeof Obj=="undefined"){
            Obj={};
        }
        Obj.THIS=this;
        return O(Obj);
    }
});




