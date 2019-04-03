/**
 * Created by CDCT on 2018/5/23.
 */
;(function(f,$){
    /*循环*/
    var each = $.each;
    /*继承*/
    var extend  = $.extend;
    var int=function(v){
        return ~~v;
    };
    /*是否是undefined*/
    var isUndef = function(v){
        return typeof v === "undefined"
    };
    var float = function(v){
        return parseFloat(v);
    };
    /*获取所有父元素*/
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
    /*获取id*/
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
    function _status(){
        var THIS = this;
        this.option=Object.create(null);
        this._container=Object.create(null);
        this.selectObj=null;
        this.selectQuarter1Obj=null;
        this.selectQuarter2Obj=null;
        this.selectDateStart=null;
        this.selectDateEnd=null;
        this.nowType="";
        this.box=$("<div class='time_box'></div>");
        this.select=$("<div data-selectSimu=\"1\" class=\"time_slect\">"+
            "        <div  class=\"selectBox\">"+
            "            <span data-selectNew=\"1\" class=\"checkspan\"></span>"+
            "            <ul class=\"hideUl\" data-selectBox=\"1\">"+
            "            <li class=\"hideUlLi\" value=\"0\" data-selectOption=\"0\">全部</li>"+
            "            <li class=\"hideUlLi\" value=\"1\" data-selectOption=\"1\">年</li>"+
            "            <li class=\"hideUlLi\" value=\"2\" data-selectOption=\"2\">月</li>"+
            "            <li class=\"hideUlLi\" value=\"3\" data-selectOption=\"3\">日</li>"+
            "            <li class=\"hideUlLi\" value=\"4\" data-selectOption=\"4\">季度</li>"+
            "            </ul>"+
            "            </div>"+
            "         </div>");
        this.selectQuarter1=$("<div data-selectSimu=\"1\" class=\"time_slectDp\">"+
            "        <div  class=\"selectBox\">"+
            "            <span data-selectNew=\"1\" class=\"checkspan\"></span>"+
            "            <ul class=\"hideUl\" data-selectBox=\"1\">"+
            "            <li class=\"hideUlLi\" value=\"0\" data-selectOption=\"0\">第一季度</li>"+
            "            <li class=\"hideUlLi\" value=\"1\" data-selectOption=\"1\">第二季度</li>"+
            "            <li class=\"hideUlLi\" value=\"2\" data-selectOption=\"2\">第三季度</li>"+
            "            <li class=\"hideUlLi\" value=\"3\" data-selectOption=\"3\">第四季度</li>"+
            "            </ul>"+
            "            </div>"+
            "         </div>");
        this.selectQuarter2=$("<div data-selectSimu=\"1\" class=\"time_slectDp\">"+
            "        <div  class=\"selectBox\">"+
            "            <span data-selectNew=\"1\" class=\"checkspan\"></span>"+
            "            <ul class=\"hideUl\" data-selectBox=\"1\">"+
            "            <li class=\"hideUlLi\" value=\"0\" data-selectOption=\"0\">第一季度</li>"+
            "            <li class=\"hideUlLi\" value=\"1\" data-selectOption=\"1\">第二季度</li>"+
            "            <li class=\"hideUlLi\" value=\"2\" data-selectOption=\"2\">第三季度</li>"+
            "            <li class=\"hideUlLi\" value=\"3\" data-selectOption=\"3\">第四季度</li>"+
            "            </ul>"+
            "            </div>"+
            "         </div>");
        this.start=$("<input class='time_start' readonly='readonly'/>");
        this.end=$("<input class='time_end' readonly='readonly'/>");
        this.startBox = $("<div class='__startBox'></div>");
        this.endBox = $("<div class='__endBox'></div>");
        this.companyStart=$("<div class='companyStart __start'>年</div>");
        this.companyEnd=$("<div class='companyStart __end'>年</div>");
        /*获取时间对象*/
        this.getDateObj = function(year,mouth,day){
            day=day||1;

            var O = new Date();
            if(year){
                O.setYear(year);
            }
            if(mouth){
                O.setMonth(mouth);
            }else{
                O.setMonth(0);
            }
            if(day){
                O.setDate(day);
            }
            O.setHours(0);
            O.setMinutes(0);
            O.setSeconds(0);
            return O;
        };
        /*缓存事件方法*/
        this._bufObj={
            "changeSelect":function(){
                var val=THIS.selectObj.getValue()[0];
                THIS["value"+val].call(THIS,val);
                THIS.start.val("");
                THIS.end.val("");
                THIS.selectDateEnd=null;
                THIS.selectDateStart=null;
            },
            "clickStart":function(e){
                e.stopPropagation();
                THIS.start.lqdatetimepicker({
                    css : 'datetime-day time_select_date',
                    dateType:THIS.format,
                    selectTimeEnd:function(){
                        THIS.selectDateStart=THIS.getDateObj(this.data_year,this.data_mouth,this.data_day);
                        if(THIS.selectDateEnd){
                            var timeSlotEnd = THIS.selectDateEnd.getTime();
                            var timeSlotStart = THIS.selectDateStart.getTime();
                            if(timeSlotEnd<=timeSlotStart){
                                THIS.start.val("");
                                THIS.selectDateStart=null;
                                THIS.option.errorCall.call(THIS);
                            }
                        }
                    }
                });
            },
            "clickEnd":function(e){
                e.stopPropagation();
                THIS.end.lqdatetimepicker({
                    css : 'datetime-day time_select_date',
                    dateType:THIS.format,
                    selectTimeEnd:function(){
                        THIS.selectDateEnd=THIS.getDateObj(this.data_year,this.data_mouth,this.data_day);
                        if(THIS.selectDateStart){
                            var timeSlotEnd = THIS.selectDateEnd.getTime();
                            var timeSlotStart = THIS.selectDateStart.getTime();
                            if(timeSlotEnd<=timeSlotStart){
                                THIS.end.val("");
                                THIS.selectDateEnd=null;
                                THIS.option.errorCall.call(THIS);
                            }
                        }
                    }
                });
            }
        };
        /*组装节点*/
        this.spliceEle=function(){
            this.box.append(this.select);
            this.box.append(this.startBox);
            this.startBox.append(this.start);
            this.box.append(this.companyStart);
            this.box.append(this.selectQuarter1);
            this.box.append(this.endBox);
            this.endBox.append(this.end);
            this.box.append(this.companyEnd);
            this.box.append(this.selectQuarter2);
        };
        /*设置配置项*/
        this.setOption=function(Obj){
            var defaultObj = {
                container:null,//容器
                showInfo:0,//选择类型的默认值
                Quarter1:0,//第一个季度狂的的默认值
                Quarter2:0,//第二个季度框的默认值
                formatSign:"-",//选择时间的分隔符
                errorCall:function(){//错误回调

                },
                initCall:function(){//init结束回调

                }
            };
            extend(defaultObj,Obj);
            extend(this.option,defaultObj);
        };
        /*添加事件*/
        this.addEvent=function(){
            this.select.on("change",this._bufObj.changeSelect);
            this.start.on("click",this._bufObj.clickStart);
            this.end.on("click",this._bufObj.clickEnd);
        };
        /*移除事件*/
        this.removeEvent=function(){
            this.select.off("change",this._bufObj.changeSelect);
            this.start.off("click",this._bufObj.clickStart);
            this.end.off("click",this._bufObj.clickEnd);
        };
        /*显示季度*/
        this.showQuarter=function(){
            this.selectQuarter1.css({
                display:""
            });
            this.selectQuarter2.css({
                display:""
            });
        };
        /*获取选择值信息*/
        this.getValInfo=function(){
            var info = Object.create(null);
            info.nowType=this.nowType;
            info.start=this.start.val();
            info.end=this.end.val();
            if(this.nowType=="quarter"){
                info.quarterStart=this.selectQuarter1Obj.getValue()[0];
                info.quarterEnd=this.selectQuarter2Obj.getValue()[0];
            }

            return info;
        };
        /*隐藏季度*/
        this.hideQuarter=function(){
            this.selectQuarter1.css({
                display:"none"
            });
            this.selectQuarter2.css({
                display:"none"
            });
        };
        /*显示单位*/
        this.showCampany=function(str){
            this.companyEnd.html(str);
            this.companyStart.html(str);
            this.companyEnd.css({display:""});
            this.companyStart.css({display:""});
        };
        /*隐藏单位*/
        this.hideCampany=function(){
            this.companyEnd.css({display:"none"});
            this.companyStart.css({display:"none"});
        };
        /*设置信息*/
        this.setValInfo = function(Obj){
            //nowType
            //start
            //end
            //quarterStart
            //quarterEnd
            var o ={
                all:0,
                year:1,
                mouth:2,
                day:3,
                quarter:4
            };
            this.nowType=Obj.nowType;
            var bool = true;
            for(var i in o ){
                if(i==this.nowType){
                    bool=false;
                }
            }
            if(bool){
                return console.log("error:type is not defined");
            }
            if(!Obj.start){
                return console.log("error:start is not defined");
            }
            if(!Obj.end){
                return console.log("error:end is not defined");
            }
            this.selectObj.setValue([o[this.nowType]]);
            this.select.trigger("change",[this.selectObj]);
            var arr1 = Obj.start.split(this.option.formatSign);
            var arr2 = Obj.end.split(this.option.formatSign);

            this.start.val(Obj.start);
            this.end.val(Obj.end);

            this.start[0].data_year=arr1[0];
            this.start[0].data_mouth=arr1[1]?arr1[1]:0;
            this.start[0].data_day=arr1[2]?arr1[2]:1;
            this.end[0].data_year=arr2[0];
            this.end[0].data_mouth=arr2[1]?arr2[1]:0;
            this.end[0].data_day=arr2[2]?arr2[2]:1;

            if(this.nowType=="quarter"){
                if(typeof Obj.quarterStart!="undefined"){
                    this.selectQuarter1Obj.setValue([Obj.quarterStart]);
                    this.selectQuarter1.trigger("change",[this.selectObj]);
                }
                if(typeof Obj.quarterEnd!="undefined"){
                    this.selectQuarter2Obj.setValue([Obj.quarterEnd]);
                    this.selectQuarter2.trigger("change",[this.selectObj]);
                }
            }

        };
        /*全部类型处理方式*/
        this.value0=function(){
            this.format="YYYY"+this.option.formatSign+"MM"+this.option.formatSign+"DD";
            this.hideQuarter();
            this.showCampany("日");
            this.nowType="all";
        };
        /*年类型处理方式*/
        this.value1=function(){
            this.format="YYYY";
            this.hideQuarter();
            this.showCampany("年");
            this.nowType="year";
        };
        /*月类型处理方式*/
        this.value2=function(){
            this.format="YYYY"+this.option.formatSign+"MM";
            this.hideQuarter();
            this.showCampany("月");
            this.nowType="mouth";
        };
        /*日类型处理方式*/
        this.value3=function(){
            this.format="YYYY"+this.option.formatSign+"MM"+this.option.formatSign+"DD";
            this.hideQuarter();
            this.showCampany("日");
            this.nowType="day"
        };
        /*季度类型处理方式*/
        this.value4=function(){
            this.format="YYYY";
            this.showQuarter();
            this.hideCampany();
            this.nowType="quarter";
        };
        /*初始化方法*/
        this.init=function(){
            if(this.option.container==null){
                return console.log("error:container is not find ~~");
            }
            this._container=$(this.option.container);
            this.spliceEle();
            this._container.append(this.box);
            this.selectObj=this.select.simulationSelect({
                selectText:"{a}<span class='selectDown'></span>",
                defaultValue:[this.option.showInfo]
            });
            this.selectQuarter1Obj=this.selectQuarter1.simulationSelect({
                selectText:"{a}<span class='selectDown'></span>",
                defaultValue:[this.option.Quarter1]
            });
            this.selectQuarter2Obj=this.selectQuarter2.simulationSelect({
                selectText:"{a}<span class='selectDown'></span>",
                defaultValue:[this.option.Quarter2]
            });
            this["value"+this.option.showInfo]();
            this.addEvent();
            this.option.initCall.call(this);
        };
    }
    f(_status);
})(function(_status){
    $.fn.timeProto=function(Obj){
        var o = new _status();
        Obj=Obj||{};
        if(typeof Obj.container=="undefined"){
            Obj.container=this;
        }
        o.setOption(Obj);
        o.init();
        return o;
    }
},jQuery);