/**
 * Created by CDCT on 2017/9/21.
 * author 375361172@qq.com
 *
 * V1.0 (20170925 新增top self parent窗口指向)
 * V1.0.01 (20171013) 1.为forStyle新增footer参数 2.新增参数forType 杂项类型 clickMaskClose点击遮罩是否关闭模态框
 * V1.0.02 (20171016) (新增doc对象属性 指定文档对象 在forType类型下面
 *   styleTypeStr string类型 模态框样式属性的字符串 默认为data-styleType
 *   多个Class使用方式 .aaa.ccc.ddd.eee (注意:中间是没有空格的!!!)
 *   header Object类型 模态框header部分样式
 *   maxBoxClass string类型 模态框的最大容器的样式
 *   headerClass string类型 header的class默认为m-top
 *   contentClass string类型 content的class默认为m-middle
 *   titleClass string类型 title的class默认为m-modal-title
 *   dialogClass string类型 模态框dialog的class 默认为m-modal-dialog
 *   sureClass string类型 模态框确认按钮的class 默认为m-btn-sure
 *   cancelClass string类型 模态框取消按钮的class 默认为m-btn-cancel
 *   footerClass string类型 模态框底部容器的class 默认为m-bottom)
 *  V1.0.03 (20171018) 修改forWnd指向bug
 *  V1.0.04 (20171019) 为动画新增扩展
 *  V1.0.05 (20171020) 新增关闭之前触发函数 closeBefore 参数一模态框节点 参数二控制模态框的对象
 *  V1.0.06 (20171031) 新增关闭之后触发函数 closeAfter 参数一模态框节点 参数二控制模态框的对象
 *  V1.0.07 (20171106) 新增最大盒子样式 maxBox object类型 默认为{}  修复全局替换bug
 *  V1.0.08 (20171113) 新增参数animate 字符串类型 默认为"true"如果不为这个就表示不需要动画
 */

/**
 * 传入参数说明
 * forTime结构  时间类型
 *   cancel object类型 取消按钮  倒计时
 *     timeEnd number类型 请设置以千为倍数的时间毫秒 默认2000
 *     timeBool bool类型 为true将启动倒计时 默认false
 *   sure object类型 确认按钮  倒计时
 *     timeEnd number类型 请设置以千为倍数的时间毫秒 默认2000
 *     timeBool bool类型 为true将启动倒计时 默认false
 *   modelShowAnimateTime number类型 模态框出来或者关闭的动画过度时间 默认为500
 * forText结构  文本类型
 *   title string类型 模态框的标题 默认为""
 *   content string类型 模态框的内容 默认为""
 *   cancel string类型 取消按钮显示的内容 默认为"取消"
 *   sure string类型 确认按钮显示的内容 默认为"确认"
 * forFunction结构  方法类型
 *   cancel function类型 点击取消按钮触发的函数 参数一 当前的模态框节点 参数二为控制模态框的对象 参数三位event对象 参数四是this
 *   sure function类型 点击成功按钮触发的函数 参数一 当前的模态框节点 参数二为控制模态框的对象 参数三位event对象 参数四是this
 *   close function类型 点击关闭按钮触发的函数 参数一 当前的模态框节点 参数二为控制模态框的对象 参数三位event对象 参数四是this
 *   animateEnd function类型 模态框动画完毕触发的函数 参数一 当前的模态框节点 参数二为控制模态框的对象
 *   createModelEnd function类型 模态框创建完毕触发的函数 参数一 当前的模态框节点 参数二为控制模态框的对象
 *   model function类型 点击模态框触发的函数 参数一 当前的模态框节点 参数二为控制模态框的对象 参数三位event对象
 *   closeBefore function类型 模态框关闭之前触发函数 参数一当前的模态框节点 参数二为控制模态框的对象
 *   closeAfter function类型 模态框关闭之后触发函数 参数一当前的模态框节点 参数二为控制模态框的对象
 * forStyle结构  样式类型
 *   styleTypeStr string类型 模态框样式属性的字符串 默认为data-styleType
 *   maxBox Object类型 模态框最大div的样式 默认为{}
 *   maxBoxClass string类型 模态框的最大容器的样式
 *   header Object类型 模态框header部分样式 默认为{}
 *   headerClass string类型 header的class默认为m-top
 *   content  object类型 模态框放content的盒子样式 默认为{}
 *   styleType number类型 模态框的样式类型 通过属性选择器控制样式 （局部样式的概念)默认为{}
 *   content  object类型 模态框放content的盒子样式 默认为{}
 *   contentClass string类型 content的class默认为m-middle
 *   title  object类型 模态框放title的盒子样式 默认为{}
 *   titleClass string类型 title的class默认为m-modal-title
 *   dialog  object类型 模态框dialog的样式 默认为{}
 *   dialogClass string类型 模态框dialog的class 默认为m-modal-dialog
 *   sure  object类型 模态框确认按钮的样式 默认为{}
 *   sureClass string类型 模态框确认按钮的class 默认为m-btn-sure
 *   cancel  object类型 模态框取消按钮的样式  默认为{}
 *   cancelClass string类型 模态框取消按钮的class 默认为m-btn-cancel
 *   footer  object类型 模态框底部容器的样式 默认为{}
 *   footerClass string类型 模态框底部容器的class 默认为m-bottom
 *   mModalShow bool类型 是否显示遮罩层 默认为true
 *   forWind string 类型top顶层 (需要有服务器) self 当前 parent 父窗口
 * forAnimate字符串  动画过度类型
 *   TopToBottom 动画从顶部到中间
 *   BottomToTop 动画从底部到中间
 *   LeftToRight 动画从左边到中间
 *   RightToLeft 动画从右边到中间
 * forAnimateProto结构 动画的一些配置
 *   animate 字符串类型 是否需要动画 默认为"true"
 *   end 表示动画结束的时候模态框的位置 默认为50%
 * forType 结构 杂项
 *   clickMaskClose BOOL类型 点击阴影是否关闭
 *   doc document文档对象指定文档对象
 * forDrop 结构 拖动类型
 *   dropStart function类型 拖动中触发的函数 参数一是当前的dialog 参数二是x，参数三是y 参数四 是event对象
 *   dropMove function类型 拖动中触发的函数 参数一是当前的dialog 参数二是x，参数三是y 参数四 是event对象
 *   dropEnd function类型 拖动中触发的函数 参数一是当前的dialog 参数二是x，参数三是y 参数四 是event对象
 *   isStrong bool类型 默认为true 判断边界
 */
/**
 * 返回对象说明
 * 方法
 *  show 显示模态框
 *  close 关闭模态框
 *  setOption 设置模态框的参数同传入参数一样
 *  dropModel 拖动方法
 * */
(function(fn){
    function $EXTEND(O1,O2,BOOL){
        BOOL=typeof BOOL!="undefined"?BOOL:false;
        for(var i in O2){
            if(typeof O2[i]=="object"&&typeof O1[i]!="undefined"&&typeof O1[i]=="object"&&i!="doc"){
                $EXTEND(O1[i],O2[i],BOOL);
            }else{
                O1[i]=O2[i];
            }
        }
        if(BOOL==true){
            O2=null;
        }
    }
    var str='<div class="m-modal">'+
                '<div class="m-modal-dialog">'+
                    '<div class="m-modal-icon1"></div>'+
                    '<div class="m-modal-icon2"></div>'+
                    '<div class="m-top">'+
                        '<h4 class="m-modal-title">'+
                        'title'+
                        '</h4>'+
                        '<span class="m-modal-close">&times;</span>'+
                    '</div>'+
                    '<div class="m-middle">'+
                        'content'+
                    '</div>'+
                    '<div class="m-bottom">'+
                        '<button class="m-btn-sure">确定</button>'+
                        '<button class="m-btn-cancel">取消</button>'+
                    '</div>'+
                '</div>'+
            '</div>';
    function modelShow(Obj){
        var defaultObj={
            forTime:{
                cancel:{
                    timeEnd:2000,
                    timeBool:false
                },
                sure:{
                    timeEnd:2000,
                    timeBool:false
                },
                modelShowAnimateTime:500
            },
            forText:{
                title:"",
                content:"",
                cancel:"取消",
                sure:"确认"
            },
            forFunction:{
                cancel:function(element,a,e,THIS){a.close()},
                sure:function(element,a,e,THIS){a.close()},
                close:function(element,a,e,THIS){a.close()},
                animateEnd:function(element,a){},
                createModelEnd:function(element,a){},
                model:function(element,a,e){},
                closeBefore:function(element,A){},
	            closeAfter:function(element,A){console.log(arguments);}
            },
            forType:{
                clickMaskClose:false,
                doc:document
            },
            forStyle:{
                maxBox:{},
                maxBoxClass:".m-modal",
                styleType:"1",
                styleTypeStr:"data-styleType",
                header:{},
                headerClass:".m-top",
                content:{},
                contentClass:".m-middle",
                dialog:{},
                dialogClass:".m-modal-dialog",
                title:{},
                titleClass:".m-modal-title",
                sure:{},
                sureClass:".m-btn-sure",
                cancel:{},
                cancelClass:".m-btn-cancel",
                mModalShow:true,
                footer:{},
                footerClass:".m-bottom",
                forWind:"top"
            },
            forAnimate:"TopToBottom",
            forAnimateProto:{
                end:"50%",
                animate:"true"
            },
            forDrop:{
                dropMove:function(a,b,c,d){},
                dropStart:function(a,b,c,d){},
                dropEnd:function(a,b,c,d){},
                isStrong:true,
                isDrop:false
            }
        };
        $EXTEND(defaultObj,Obj);
        var A=new Object();
        A.buffObj={};
        A.buffObj.dropFun=function(){
            if(A.defaultObj.forStyle.mModalShow){
                var targetA= A.$model.find(A.defaultObj.forStyle.dialogClass);
                var top=targetA.height()+parseInt(targetA.css("top"))+parseInt(targetA.css("marginTop"));
                if(top>=document.documentElement.clientHeight){
                    $(targetA).css({
                        top:document.documentElement.clientHeight-targetA.height()-parseInt($(targetA).css("marginTop"))+"px"
                    });
                }

                if(parseInt(targetA.css("top"))<0-parseInt($(targetA).css("marginTop"))){
                    $(targetA).css({
                        top:-parseInt($(targetA).css("marginTop"))+"px"
                    });
                }
                var left=targetA.width()+parseInt(targetA.css("left"))+parseInt(targetA.css("marginLeft"));
                if(left>=document.documentElement.clientWidth){
                    $(targetA).css({
                        left:document.documentElement.clientWidth-targetA.width()-parseInt($(targetA).css("marginLeft"))+"px"
                    });
                }
                if(parseInt(targetA.css("left"))<0-parseInt($(targetA).css("marginLeft"))){
                    $(targetA).css({
                        left:-parseInt($(targetA).css("marginLeft"))+"px"
                    });
                }
            }else{
                var targetA= A.$model.find(A.defaultObj.forStyle.dialogClass);
                var top=targetA.height()+parseInt(targetA.css("top"))+parseInt(targetA.css("marginTop"));
                if(top>=document.documentElement.clientHeight){
                    $(targetA).css({
                        top:document.documentElement.clientHeight-targetA.height()-parseInt($(targetA).css("marginTop"))+"px"
                    });
                }
                if(parseInt(targetA.css("top"))<0-parseInt($(targetA).css("marginTop"))){
                    $(targetA).css({
                        top:-parseInt($(targetA).css("marginTop"))+"px"
                    });
                }
                var left=targetA.width()+parseInt(targetA.css("left"))+parseInt(targetA.css("marginLeft"));
                if(left>=document.documentElement.clientWidth){
                    $(targetA).css({
                        left:document.documentElement.clientWidth-targetA.width()-parseInt($(targetA).css("marginLeft"))+"px"
                    });
                }
                if(parseInt(targetA.css("left"))<0-parseInt($(targetA).css("marginLeft"))){
                    $(targetA).css({
                        left:-parseInt($(targetA).css("marginLeft"))+"px"
                    });
                }
            }
        };
        A.defaultObj=defaultObj;
        /*处理Class字符串*/
        A.getClassName=function(string){
            if(typeof string != "string"){
                console.log("error:getClassName is error arguments require string");
                return;
            }
            return  string.replace(/\./g," ");
        };
        /*模态框显示*/


        A.show=function(){

            str=str.replace(/m-modal/,A.getClassName(A.defaultObj.forStyle.maxBoxClass));
            str=str.replace(/m-modal-title/,A.getClassName(A.defaultObj.forStyle.titleClass));
            str=str.replace(/m-top/,A.getClassName(A.defaultObj.forStyle.headerClass));
            str=str.replace(/m-middle/,A.getClassName(A.defaultObj.forStyle.contentClass));
            str=str.replace(/m-modal-dialog/,A.getClassName(A.defaultObj.forStyle.dialogClass));
            str=str.replace(/m-btn-sure/,A.getClassName(A.defaultObj.forStyle.sureClass));
            str=str.replace(/m-modal-cancel/,A.getClassName(A.defaultObj.forStyle.cancelClass));
            str=str.replace(/m-bottom/,A.getClassName(A.defaultObj.forStyle.footerClass));
            A.$model=$(str);
            A.$model.attr("data-styleType",A.defaultObj.forStyle.styleType);
            A.$model.find( A.defaultObj.forStyle.titleClass).html(A.defaultObj.forText.title).css(
                A.defaultObj.forStyle.title
            );
            A.$model.find( A.defaultObj.forStyle.contentClass).html(A.defaultObj.forText.content).css(
                A.defaultObj.forStyle.content
            );
            A.$model.find( A.defaultObj.forStyle.cancelClass).html(A.defaultObj.forText.cancel).css(
                A.defaultObj.forStyle.cancel
            );
            A.$model.find( A.defaultObj.forStyle.sureClass).html(A.defaultObj.forText.sure).css(
                A.defaultObj.forStyle.sure
            );
            A.$model.find( A.defaultObj.forStyle.dialogClass).css(
                A.defaultObj.forStyle.dialog
            );
            A.$model.css(
                A.defaultObj.forStyle.maxBox
            );
            A.$model.find( A.defaultObj.forStyle.headerClass).css(
                A.defaultObj.forStyle.header
            );
            A.$model.find( A.defaultObj.forStyle.footerClass).css(
                A.defaultObj.forStyle.footer
            );
            switch (A.defaultObj.forStyle.forWind){

                case "top":{
                    if(window.top!=window.self&&window.location.href.search("http")==-1){
                        $(window.document.body).append(A.$model);
                    }else{
                        $(window.top.document.body).append(A.$model);
                    }
                    break;
                }
                case "parent":{
                    if(window.parent!=window.self&&window.location.href.search("http")==-1){
                        $(window.document.body).append(A.$model);
                    }else{
                        $(window.parent.document.body).append(A.$model);
                    }
                    break;
                }
                case "self":{
                    $(window.self.document.body).append(A.$model);
                    break;
                }
                default :{
                    if(window.top!=window.self&&window.location.href.search("http")==-1){
                        $(window.document.body).append(A.$model);
                    }else{
                        $(window.top.document.body).append(A.$model);
                    }
                    console.log("error:forWind is not find local switch")
                }
            }

            var dialog=A.$model.find( A.defaultObj.forStyle.dialogClass);
            A.$model.css({
                display:"block"
            });
            dialog.css({
                marginLeft:-dialog.width()/2+"px",
                marginTop:-dialog.height()/2+"px"
            });
            function fun1(){
                A.defaultObj.forFunction.animateEnd(A.$model,A);
            }
            function animateType(element){
                if(A.defaultObj.forAnimateProto.animate!="true"){
                    element.css({
                        top: A.defaultObj.forAnimateProto.end,
                        opacity:1
                    });
                    fun1();
                    return;
                }
                switch (A.defaultObj.forAnimate){
                    case "TopToBottom":{
                        element.css({
                            top:"-10%",
                            opacity:0
                        });
                        element.animate({
                            top: A.defaultObj.forAnimateProto.end,
                            opacity:1
                        },A.defaultObj.forTime.modelShowAnimateTime,fun1);
                        break;
                    }
                    case "BottomToTop":{
                        element.css({
                            top:"110%",
                            opacity:0
                        });
                        element.animate({
                            top: A.defaultObj.forAnimateProto.end,
                            opacity:1
                        },A.defaultObj.forTime.modelShowAnimateTime,fun1);
                        break;
                    }
                    case "LeftToRight":{
                        element.css({
                            left:"-10%",
                            opacity:0
                        });
                        element.animate({
                            left: A.defaultObj.forAnimateProto.end,
                            opacity:1
                        },A.defaultObj.forTime.modelShowAnimateTime,fun1);
                        break;
                    }
                    case "RightToLeft":{
                        element.css({
                            left:"110%",
                            opacity:0
                        });
                        element.animate({
                            left: A.defaultObj.forAnimateProto.end,
                            opacity:1
                        },A.defaultObj.forTime.modelShowAnimateTime,fun1);
                    }
                }
            }
            if(A.defaultObj.forStyle.mModalShow){
                animateType(dialog);
            }else{
                dialog.css({
                    position:"static",
                    marginLeft:"",
                    marginTop:""
                });
                A.$model.css({
                    position:"fixed",
                    width:dialog.width()+"px",
                    height:dialog.height()+"px",
                    left:"50%",
                    top:"50%",
                    marginLeft:-dialog.width()/2+"px",
                    marginTop:-dialog.height()/2+"px"
                });
                animateType(A.$model);
            }

            A.$model.find( A.defaultObj.forStyle.cancelClass).off("click");
            A.$model.find( A.defaultObj.forStyle.sureClass).off("click");
            A.$model.find(".m-modal-close").off("click");
            A.$model.on("click").off("click");

            A.$model.find(A.defaultObj.forStyle.cancelClass).on("click",function(e){
                A.defaultObj.forFunction.cancel(A.$model,A,e,this);
            });
            A.$model.find(A.defaultObj.forStyle.sureClass).on("click",function(e){
                A.defaultObj.forFunction.sure(A.$model,A,e,this);
            });
            A.$model.find(".m-modal-close").on("click",function(e){
                A.defaultObj.forFunction.close(A.$model,A,e,this);
            });
            A.$model.on("click").on("click",function(e){
                e.stopPropagation();
                A.defaultObj.forFunction.model(A.$model,A,e);
                if(A.defaultObj.forType.clickMaskClose){
                    var tg= e.target? e.target: e.srcElement;
                    if(tg==this){
                        A.close();
                    }
                }
            });
            if(A.defaultObj.forTime.cancel.timeBool){
                var cancel= A.$model.find(A.defaultObj.forStyle.cancelClass);
                var cs=A.defaultObj.forTime.cancel.timeEnd/1000;
                cancel.html(A.defaultObj.forText.cancel+cs.toString());
                A.cancelTime=setInterval(function(){
                    if(cs==0){
                        cancel.trigger("click");
                        clearInterval(A.cancelTime);
                    }
                    cancel.html(A.defaultObj.forText.cancel+cs.toString());
                    cs--;
                },1000);
            }
            if(A.defaultObj.forTime.sure.timeBool){
                var sure= A.$model.find(A.defaultObj.forStyle.sureClass);
                var cs02=A.defaultObj.forTime.sure.timeEnd/1000;
                sure.html(A.defaultObj.forText.sure+cs02.toString());
                A.sureTime=setInterval(function(){
                    if(cs02==0){
                        sure.trigger("click");
                        clearInterval(A.sureTime);
                    }
                    sure.html(A.defaultObj.forText.sure+cs02.toString());
                    cs02--;
                },1000);
            }
            A.defaultObj.forFunction.createModelEnd(A.$model,A);
        };
        /*模态框关闭*/
        A.close=function(){
            A.defaultObj.forFunction.closeBefore(A.$model,A);
            var dialog=A.$model.find( A.defaultObj.forStyle.dialogClass);
            var topDoc=window.top.document.body;
            function endFun(){
                var allModel=$(topDoc).find(".m-modal");
                $(allModel[allModel.index(A.$model[0])]).remove();
                A.defaultObj.forFunction.closeAfter(A.$model,A);
            }
            function animateType02(ele){
                if(A.defaultObj.forAnimateProto.animate!="true"){
                    endFun();
                }
                switch (A.defaultObj.forAnimate){
                    case "TopToBottom":{
                        if(!A.defaultObj.forDrop.isDrop){
                            ele.css({
                                top: A.defaultObj.forAnimateProto.end,
                                opacity:1
                            });
                        }
                        ele.animate({
                            top:"-10%",
                            opacity:0
                        },A.defaultObj.forTime.modelShowAnimateTime,endFun);
                        break;
                    }
                    case "BottomToTop":{
                        if(!A.defaultObj.forDrop.isDrop){
                            ele.css({
                                top: A.defaultObj.forAnimateProto.end,
                                opacity:1
                            });
                        }
                        ele.animate({
                            top:"110%",
                            opacity:0
                        },A.defaultObj.forTime.modelShowAnimateTime,endFun);
                        break;
                    }
                    case "LeftToRight":{
                        if(!A.defaultObj.forDrop.isDrop){
                            ele.css({
                                left: A.defaultObj.forAnimateProto.end,
                                opacity:1
                            });
                        }
                        ele.animate({
                            left:"-10%",
                            opacity:0
                        },A.defaultObj.forTime.modelShowAnimateTime,endFun);
                        break;
                    }
                    case "RightToLeft":{
                        if(!A.defaultObj.forDrop.isDrop){
                            ele.css({
                                left: A.defaultObj.forAnimateProto.end,
                                opacity:1
                            });
                        }
                        ele.animate({
                            left:"110%",
                            opacity:0
                        },A.defaultObj.forTime.modelShowAnimateTime,endFun);
                    }
                }
            }
            if(A.defaultObj.forStyle.mModalShow){
                animateType02(dialog)
            }else{
                animateType02(A.$model)
            }
            if(A.cancelTime){
                clearInterval(A.cancelTime);
            }
            if(A.sureTime){
                clearInterval(A.sureTime);
            }
            A.defaultObj.forDrop.isDrop=false;
            $(window).off("resize",A.buffObj.dropFun);
        };
        /*设置模态框option*/
        A.setOption=function(Obj){
          $EXTEND(A.defaultObj,Obj);
        };
        //拖动
        A.dropModel=function(){
            if(typeof $(A.defaultObj.doc).dropIng=="undefined"){
                console.warn("Not load drop.js,Please contact 375361172@qq.com!!");
                return;
            }
            if(A.defaultObj.forStyle.mModalShow){
                A.$model.find(A.defaultObj.forStyle.dialogClass).dropIng(0,{
                    mode:"process",
                    doc: A.defaultObj.forType.doc,
                    returnValue:false,
                    processMoveFun:function(a,x,y,d){
                        if(A.defaultObj.forDrop.isStrong){
                            if($(a).height()+y+parseInt($(a).css("marginTop"))>=A.defaultObj.forType.doc.documentElement.clientHeight){
                                $(a).css({
                                    top:A.defaultObj.forType.doc.documentElement.clientHeight-$(a).height()-parseInt($(a).css("marginTop"))+"px"
                                });
                            }
                            if(y<0-parseInt($(a).css("marginTop"))){
                                $(a).css({
                                    top:-parseInt($(a).css("marginTop"))+"px"
                                });
                            }
                            if($(a).width()+x+parseInt($(a).css("marginLeft"))>=A.defaultObj.forType.doc.documentElement.clientWidth){
                                $(a).css({
                                    left:A.defaultObj.forType.doc.documentElement.clientWidth-$(a).width()-parseInt($(a).css("marginLeft"))+"px"
                                })
                            }
                            if(x<0-parseInt($(a).css("marginLeft"))){
                                $(a).css({
                                    left:-parseInt($(a).css("marginLeft"))+"px"
                                });
                            }
                        }
                        A.defaultObj.forDrop.dropMove(a,x,y,d);
                    },
                    processStartFun:function(a,x,y,d){
                        A.defaultObj.forDrop.dropStart(a,x,y,d);
                    },
                    processEndFun:function(a,b,c,d){
                        A.defaultObj.forDrop.dropEnd(a,b,c,d);
                    }
                });
            }else{
                A.$model.dropIng(0,{
                    mode:"process",
                    doc: A.defaultObj.forType.doc,
                    returnValue:false,
                    processMoveFun:function(a,x,y,d){
                        if(A.defaultObj.forDrop.isStrong){
                            if($(a).height()+y+parseInt($(a).css("marginTop"))>=A.defaultObj.forType.doc.documentElement.clientHeight){
                                $(a).css({
                                    top:A.defaultObj.forType.doc.documentElement.clientHeight-$(a).height()-parseInt($(a).css("marginTop"))+"px"
                                });
                            }
                            if(y<0-parseInt($(a).css("marginTop"))){
                                $(a).css({
                                    top:-parseInt($(a).css("marginTop"))+"px"
                                });
                            }
                            if($(a).width()+x+parseInt($(a).css("marginLeft"))>=A.defaultObj.forType.doc.documentElement.clientWidth){
                                $(a).css({
                                    left:A.defaultObj.forType.doc.documentElement.clientWidth-$(a).width()-parseInt($(a).css("marginLeft"))+"px"
                                })
                            }
                            if(x<0-parseInt($(a).css("marginLeft"))){
                                $(a).css({
                                    left:-parseInt($(a).css("marginLeft"))+"px"
                                });
                            }
                        }
                        A.defaultObj.forDrop.dropMove(a,x,y,d);
                    },
                    processStartFun:function(a,x,y,d){
                        A.defaultObj.forDrop.dropStart(a,x,y,d);
                    },
                    processEndFun:function(a,b,c,d){
                        A.defaultObj.forDrop.dropEnd(a,b,c,d);
                    }
                });
            }

            A.defaultObj.forDrop.isDrop=true;
            $(window).on("resize",A.buffObj.dropFun);
        };

        //点击遮罩关闭模态框

        /*引入页面跳转方法*/
        if(typeof changeIframe!="undefined"){
            A.changeIframe=function(Obj){
                var O={
                    url:"",//地址
                    type:"",//类型
                    title:"未命名页面",//标题,
                    GlobalEx:"",//传参
                    reload:"",//是否重新加载目标页
                    closeNow:""//是否关闭当前页
                };
                $.extend(O,Obj);
                if(O.GlobalEx!=""){
                    O.GlobalEx=JSON.stringify(O.GlobalEx);
                    console.log(O.GlobalEx);
                }
                changeIframe(O.url,O.type,O.title,O.GlobalEx,O.reload,O.closeNow);
            };
        }else{
            console.log("error:changeIframe method is not defined,contact 375361172@qq.com")
        }
        return A;
    }
    fn(modelShow);
})(function(ms){
    $.modelShow=function(Obj){
        var sd=ms(Obj);
        sd.show();
        return sd;
    }
});