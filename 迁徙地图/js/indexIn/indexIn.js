/**
 * Created by CDCT on 2018/6/7.
 */
$(function(){
    /*适应js
    * 设置属性maxHeight来适应
    * 主要用于图片
    * scale 缩放因素
    * maxHeight 最大高度就适应
    * */
    function resize(){
        var allScale = $('[maxHeight]');
        allScale.each(function(){
            var attr = this.getAttribute("scale")?this.getAttribute("scale"):0.8;
            var $this = $(this);
            if(!(document.documentElement.clientHeight<this.getAttribute("maxHeight"))){
                if(this.bufferWidth){
                    $this.css({
                        width:""
                    });
                }

                return;
            }
            if(!this.bufferWidth){
                this.bufferWidth = $this.outerWidth();
            }
            $this.css({
                width:this.bufferWidth*attr+"px"
            });
        })
    }
    /*
    * Obj 对象类型 {}
    * 可传入的配置项
    * btn1ClickHander 点击class btn1的回调函数
    * btn2ClickHander 点击class btn2的回调函数
    * head 头部内容
    * content 内容内容
    * btn1 btn1内容
    * btn2 btn2内容
    * */
    function toolTip(Obj){
        var THIS = this;
        this.option=new Object();
        this.show = function(){
            this.close();
            this.addEvent();
           $(document.body).append(this.ele);
            this.ele.css({
                opacity:0
            });
            this.ele.animate({
                opacity:1
            });
        };
        this.setOption=function(Obj){
            var defaultObj = {
                btn1ClickHander:function(){

                },
                btn2ClickHander:function(){

                },
                head:"温馨提示",
                content:"我是内容",
                btn1:"按钮1",
                btn2:"按钮2"
            };
            $.extend(defaultObj,Obj);
            $.extend(this.option,defaultObj);
            this.init();
            this.addEvent();
        };
        this.init=function(){
            this.ele.find(".toolTipHead .txt").html(this.option.head);
            this.ele.find(".toolTipContent .scroll").html(this.option.content);
            this.ele.find(".tooltipFoot .btn1").html(this.option.btn1);
            this.ele.find(".tooltipFoot .btn2").html(this.option.btn2);
        };
        this.ele=$("<div class='toolTipBox'>" +
            "<div class='toolTipHead'>" +
            "<span class='txt'>温馨提示</span>" +
            "<span class='close'>×</span>" +
            "</div>" +
            "<div class='toolTipContent'>" +
            "<div class='scroll'>四等奖啊时代简欧我撒娇的哦我欧艾斯蒂哦我爱搜集的 </div>" +
            "</div>" +
            "<div class='tooltipFoot'>" +
            "<div class='btn1'>修改密码</div>" +
            "<div class='btn2'>查看日志</div>" +
            "</div>" +
            "</div>");
        this.close=function(){
            this.ele.remove();
        };
        this._bufferObj = {
            closeClickHander:function(e){
                THIS.close();
            },
            btn1ClickHander:function(e){
                THIS.option.btn1ClickHander.call(this,THIS,e);
            },
            btn2ClickHander:function(e){
                THIS.option.btn2ClickHander.call(this,THIS,e);
            }
        };
        this.addEvent=function(){
            this.removeEvent();
            this.ele.find(".btn1").on("click",this._bufferObj.btn1ClickHander);
            this.ele.find(".btn2").on("click",this._bufferObj.btn2ClickHander);
            this.ele.find(".close").on("click",this._bufferObj.closeClickHander);
        };
        this.removeEvent=function(){
            this.ele.find(".btn1").off("click",this._bufferObj.btn1ClickHander);
            this.ele.find(".btn2").off("click",this._bufferObj.btn2ClickHander);
            this.ele.find(".close").off("click",this._bufferObj.closeClickHander);
        };
        this.setOption(Obj);
        this.show();
        return this;
    }
    var d = new toolTip({
        btn1ClickHander:function(THIS,e){
            THIS.close();
            console.log(this,arguments);
        },
        btn2ClickHander:function(THIS,e){
            THIS.close();
            console.log(this,arguments);
        },
        content:"你好啊! 世界"
    });

    $(window).on("resize",function(){
        setTimeout(resize,10);
    });
    resize();
});

// 修改资料
$('.list').on('click',function(){
    $('.modifyBox').show();
})

// 时间控件
$(".datepicker").on("click",function(e){
    e.stopPropagation();
    $(this).lqdatetimepicker({
        css : 'datetime-day',
        dateType:"YYYY-MM-DD",
    });   
});
//下拉
$(".cdct_select").each(function(index,element){ $(element).simulationSelect({selectText:'{a}<span class="selectDown"></span>'}); })

$('.modifyBox').mouseleave(function(){
    $(this).hide();
})
$('.modifyBox').click(function(){
    $(this).hide();
})
// 显示模态框
function showModal(){
    $('.modifyInfo').show();
    $('.modifyPwd').hide();
    $('.mask').show();
}

function closeModal(){
    $('.modifyInfo').hide();
    $('.mask').hide();
}
function showModal1(){
    $('.modifyPwd').show();
    $('.modifyInfo').hide();
    $('.mask').show();
}

function closeModal1(){
    $('.modifyPwd').hide();
    $('.mask').hide();
}

$('.mask').click(function(){
    $('.modifyInfo').hide();
    $('.modifyPwd').hide();
    $(this).hide();
})