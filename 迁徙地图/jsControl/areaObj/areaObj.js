/**
 * Created by CDCT on 2018/5/22.
 */
;(function(f,$){
    var each = $.each;
    var extend  = $.extend;
    var int=function(v){
        return ~~v;
    };
    var isUndef = function(v){
        return typeof v === "undefined"
    };
    var float = function(v){
        return parseFloat(v);
    };
    var arrArr = new Array();
    var getId = function(){
        var nameA=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","-","_","a","b","c","d","e","f","g","h",
            "i","j","k","l","i","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
        var str="";
        for(var i = 0;i<16;i++){
            str=str+nameA[Math.round(Math.random()*53)];
        }
        for(i=0;i<arrArr.length;i++){
            if(arrArr[i]==str){
                return getId();
            }
        }
        arrArr.push(str);
        return str;
    };
    var docArr = [];
    /*获取所有父节点*/
    var parentNode=function(Obj,Arr){
        if(!Arr){
            var Arr=[];
        }
        Arr.push(Obj);
        if(Obj&&Obj.parentNode){
            parentNode(Obj.parentNode,Arr);
        }
        return Arr;
    };
    /*点击关闭*/
    $(document).on("click",function(e){
        var tg = isUndef(e.srcElement)? e.target: e.srcElement;
        var allParent = parentNode(tg);
        var bool = true;
        each(allParent,function(){
            if($(this).hasClass("areaObjClass")){
                bool=false;
            }
        });
        if(!bool){
            return;
        }

        each(docArr,function(){
            var THIS = this;
            var bool =true;
            each(allParent,function(){
                if(THIS._triggerEle.index(this)!=-1){
                    bool=false;
                }
            });
            if(bool){
                this.close();
            }

        });
    });
    /*构造函数*/
    function _status(){
        var THIS  = this;
        /*配置项*/
        this.option=Object.create(null);
        /*触发节点*/
        this._triggerEle=Object.create(null);
        /*是否组装节点*/
        this.splice=false;
        /*是否显示*/
        this.isShow=false;
        /*是否第一次显示*/
        this.isFirst=true;
        /*设置option*/
        this.setOption = function(obj){
            var defaultObj = {
                /*触发节点*/
                triggerEle:null,
                /*点击触发节点的回调*/
                clickAfter:function(){},
                /*第一次显示的回调*/
                firstShow:function(){}
            };
            extend(defaultObj,obj);
            extend(this.option,defaultObj);
        };
        /*头部缓存数组*/
        this.headItemArr=[];
        /*缓存对象*/
        this._bufObj = {
            _triggerEleClick:function(event){
                var docEle = this;
                THIS.show(docEle);
                THIS.option.clickAfter.call(THIS,THIS,this);
            }
        };
        /*最大容器*/
        this.maxBox = $("<div class='areaObjClass'></div>");
        /*头部节点*/
        this.headerBox = $("<div class='areaObjHeader'></div>");
        /*内容节点*/
        this.contentBox = $("<div class='areaObjContent'><div class='areaObjContentScroll'></div></div>");
        /*销毁在页面上的信息*/
        this.destory=function(){
            this.close();
            this.removeEvent();
            this.option=Object.create(null);
            this._triggerEle=Object.create(null);
            this.maxBox.empty();
            this.splice=false;
            this.isShow=false;
            this.isFirst=true;
            this.headItemArr=[];
            this.removeHead();
            this.removeContent();
            docArr.splice(docArr.indexOf(this),1);
        };
        /*组装节点*/
        this.spliceEle = function(){
            if(this.splice==true){
                return ;
            }
            this.maxBox.append(this.headerBox);
            this.maxBox.append(this.contentBox);
            this.splice=true;
            if(this.contentBox.panel){
                this.contentBox.panel({
                    iWheelStep:32
                })
            }
        };
        /*添加事件*/
        this.addEvent=function(){
            this._triggerEle.on("click",this._bufObj._triggerEleClick);
        };
        /*移除事件*/
        this.removeEvent=function(){
            this._triggerEle.off("click",this._bufObj._triggerEleClick);
        };
        /*关闭显示*/
        this.close=function(){
            if(!this.isShow){
                return;
            }
            this.maxBox.detach();
            this.isShow=false;
        };
        /*显示地区选择*/
        this.show=function(docEle){
            var $ele = $(docEle);
            $(document.body).append(this.maxBox);
            var rect = {
                w:$ele.outerWidth(),
                h:$ele.outerHeight(),
                x:$ele.offset().left,
                y:$ele.offset().top
            };
            var rect2={
                x:document.documentElement.clientWidth/2,
                y:document.documentElement.clientHeight/2,
                w:this.maxBox.outerWidth(),
                h:this.maxBox.outerHeight()
            };
            var x = 0;
            var y = 0;
            if(rect.x+rect.w/2<rect2.x){
                x=rect.x;
            }else{
                x=rect.x+rect.w-rect2.w;
            }
            if(rect.y+rect.h/2<rect2.y){
                y=rect.y+rect.h;
            }else{
                y=rect.y-rect2.h;
            }
            this.maxBox.css({
                left:x+"px",
                top:y+"px"
            });
            this.isShow=true;
            if(this.isFirst){
                this.isFirst=false;
                this.option.firstShow.call(this,this);
            }
        };
        /*初始化*/
        this.init=function(){
            this._triggerEle=$(this.option.triggerEle);
            if(!this._triggerEle.length){
                return console.log("trigger element is not find ~ ~");
            }
            this.removeEvent();
            this.addEvent();
            this.spliceEle();
        };
        /*添加头部item*/
        this.addHeaderItem=function(str){
            var ele = $("<div  class='item'>"+str+"</div>");
            ele.protoId = getId();
            this.headerBox.append(ele);
            this.headItemArr.push(ele);
            return ele;
        };
        /*移除头部item*/
        this.removeHeadItemAfterAll=function(id){
            var removeBool=false;
            var start=-1;
            each(this.headItemArr,function(i,item){
                if(removeBool){
                    this.remove();
                }
                if(this.protoId==id){
                    removeBool=true;
                    start=i;
                }
            });
            if(start!=-1){
                this.headItemArr.splice(start+1,this.headItemArr.length);
            }
        };
        /*移除所有head的item*/
        this.removeHead=function(){
            each(this.headItemArr,function(){
                this.remove();
            });
            this.headItemArr.splice(0,this.headItemArr.length);
        };
        /*添加内容item*/
        this.addContentItem=function(str){
            var ele = $("<div  class='item'>"+str+"</div>");
            this.contentBox.find(".areaObjContentScroll").append(ele);
            return ele;
        };
        /*移除所有content的item*/
        this.removeContent=function(){
            this.contentBox.find(".areaObjContentScroll").empty();
        };
        /*添加到一个数组里面方便点击空白处关闭*/
        docArr.push(this);
    }
    f(_status);
})(function(_status){
    $.fn.areaObj = function(Obj){
        var o = new _status();
        Obj = Obj||{};
        if(typeof Obj.triggerEle==="undefined"){
            Obj.triggerEle=this;
        }
        o.setOption(Obj);
        o.init();
        return o;
    }
},jQuery);