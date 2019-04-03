
(function() {
    var e = $(".cdct_nav .target")[0]
    var a = document.querySelectorAll(".cdct_nav > ul > li > a");

    function c() {
        if (!$(this.parentNode).hasClass("active")) {
            for (var h = 0; h < a.length; h++) {
                if ($(a[h].parentNode).hasClass("active")) {
                    $(a[h].parentNode).removeClass("active");
                }
            }
            $(this.parentNode).addClass("active");
            var j = this.getBoundingClientRect().width;
            var f = this.getBoundingClientRect().height;
            var l = this.offsetLeft + window.pageXOffset ;
            var k = 0 + window.pageYOffset;
            e.style.width = j + "px";
            e.style.height = f + "px";
            $(e).stop();
            $(e).css({
                display:"block"
            });
            $(e).animate({
                left:l + "px"
            },350);
            e.style.top = k + "px";
            e.style.borderColor = "#30B3F9";
            e.style.transform = "none";
        }
    }
    function getParentNode(Obj, Arr) {
        if(!Arr) {
            var Arr = [];
        }
        Arr.push(Obj);
    
        if(Obj && Obj.parentNode) {
            getParentNode(Obj.parentNode, Arr);
        }
    
        return Arr;
    }
    $(".cdct_nav_ul .more a").on("click",function(){
        var path = getParentNode(this);
        for(var i= 0;i<path.length;i++){
            if($(path[i]).hasClass("more")){
                $(".cdct_nav_ul a").removeClass("on");
                $(path[i]).find(">a").addClass("on");
                $(e).css({
                    display:"none"
                })
            }
        }
    })
    for (var b = 0; b < a.length; b++) {
        a[b].addEventListener("click", function(f) {
            
            $.each(a,function(){$(this).removeClass("on");});$(this).addClass("on");
            
        });
        a[b].addEventListener("mouseenter", c);
    }
    $(".cdct_nav").mouseleave(function(g) {
        var h = $(".on").offset().left;
        var f = $(".on").width();
        $(".cdct_nav .target").stop();
        $(".cdct_nav .target").css(
            {
                display:"block"
            }
        );
        $(".cdct_nav .target").animate({
            "left": h + "px"
        },350,"linear",function(){
            $(".cdct_nav .target").css(
                {
                    display:"none"
                }
            );
        });
        
        $(".cdct_nav .target").css("width", f + "px");
        $(".cdct_nav ul li").removeClass("active");
    });

    function d() {
        var h = document.querySelector(".cdct_nav li.active");
        if (h) {
            var g = h.getBoundingClientRect().left + window.pageXOffset;
            var f = h.getBoundingClientRect().top + window.pageYOffset;
            e.style.left = g + "px";
            e.style.top = f + "px";
        }
    }
    window.addEventListener("resize", d);
    $(document).on("click",'[data-clickChangeIfr="true"]',function(e){
        if(e.returnValue){
            e.returnValue = false;
        }else{
            e.preventDefault();
        }
   
          $("#forIfr").attr("src",this.getAttribute("href"))
    });
    /*调用面包屑导航*/
     /*菜单相关*/
	$("#cdct_nav").MBnavigation({
        controller:{
            left:$("#cdct_nav .leftA"),
            right:$("#cdct_nav .rightA"),
            isShow:false
        },
        amtCallback:function(){
            var l = $(".cdct_nav ul li a.on")[0].offsetLeft + window.pageXOffset;
            $(e).css({
                    display:"none",
                     left:l + "px"
                });
        },
        childClass:"cdct_nav_ul>li",
        childFirst: $("#cdct_nav").find(".cdct_nav_ul"),
        xPC:60
    });

   
    var buffEle = document.createElement("div");
    var nowEle=null;
    /*点击菜单下面的A标签*/
    function clickA(){
        $(".cdct_nav_ul a").removeClass("on");
        $(nowEle).find("a").addClass("on");
        $(".cdct_nav .target").css({
            left:$(nowEle).position().left+"px"
        });
    }
    $(document).on("mousemove",function(e){
        var tg=e.target?e.target:e.srcElement;
        var allEle=getParentNode(tg);
        var bool=true;
        $.each(allEle,function(){
            var $this  = $(this);
            if($this.attr("data-menuGetMove")){
                var index=$this.attr("data-menuGetMove");
                var ele =$("[data-menuSetMove='"+index+"']");
                bool=false;
                $(document.body).append(buffEle);
            
                ele.css({
                    left:$this.offset().left+"px",
                    width:$this.outerWidth()+"px",
                    top:$this.offset().top+$this.outerHeight()+"px"
                });
                nowEle=$this;
                ele.show(250,function(){
                    $(buffEle).css({
                        position:"absolute",
                        opacity:0,
                        zIndex:1000,
                        left:$this.offset().left-20+"px",
                        width:$this.outerWidth()+40+"px",
                        height:ele.outerHeight()+30+"px",
                        top:$this.offset().top+$this.outerHeight()+"px"
                    });
                    ele.find("a").off("click",clickA);
                    ele.find("a").on("click",clickA);
                });
                return false;
            }
            if($this.attr("data-menuSetMove")){
                bool=false;
            }
        });

        if(bool){
            nowEle=null;
            $(buffEle).remove();
            $("[data-menuSetMove]").hide(250)
        };
    });


})();
