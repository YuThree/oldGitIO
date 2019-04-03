/**
 * Created by CDCT on 2017/8/16.
 */
$(function() {
	$(".ul >li").click(tab);
	function tab() {
	        var tab = $(this).attr("newId");
		    $("#" + tab).show().siblings().hide();
		    
		};
	});


/*移入改变效果*/
var mouseObject={
    moveViewClass:"moveIsSearch",
    viewClass:"isSearch"
};
mouseObject.E1=function(e,THIS){
    var parentNode=THIS.parentNode.parentNode;
    var moveViewClass=$(parentNode).find("."+this.moveViewClass);
    var viewClass=$(parentNode).find("."+this.viewClass);
    var parent=THIS.parentNode;
    var allLi=$(parent).find(".Searchli");
    allLi.removeClass("moveClass");

    moveViewClass.css({
        opacity:1
    });

    moveViewClass.stop();
    moveViewClass.animate({
        left:$(THIS).position().left+"px"
    },250,function(){
        $(THIS).addClass("moveClass");
    });
};
mouseObject.O1=function(e,THIS){
    var parentNode=THIS.parentNode.parentNode;
    var moveViewClass=$(parentNode).find("."+this.moveViewClass);
    var viewClass=$(parentNode).find("."+this.viewClass);
    var parent=THIS.parentNode;
    var allLi=$(parent).find(".Searchli");
    allLi.removeClass("moveClass");

    moveViewClass.stop();
    moveViewClass.animate({
        left:$(parent).find(".changeLi").position().left+"px"
    },250,function(){
        moveViewClass.css({
            opacity:0
        })
    });
};
$(".consulationSearchDiv .selectSearchDiv .Searchli").hover(function(e){
    mouseObject.E1(e,this);
},function(e){
    mouseObject.O1(e,this);
});
/*点击tab选项卡*/
$(".consulationSearchDiv .selectSearchDiv .Searchli").on("click",function(){
    var parent=this.parentNode;
    var parentNode=this.parentNode.parentNode;
    var allLi=$(parent).find(".Searchli");
    allLi.removeClass("changeLi");
    var viewClass=$(parentNode).find("."+mouseObject.viewClass);
   $(this).addClass("changeLi");
    viewClass.css({
        left:$(this).position().left+"px"
    });
});
//滚动条
/*$(".SearchDivShowOne").panel({
    iWheelStep:32
});
*/

//设置input何时输入
$("#searchPathological").click(function(){
	if($(this).is(':checked')){
		$(".searchColumnInp").removeAttr("disabled")
	}else{
		$(".searchColumnInp").attr("disabled","disabled")
	}
	
})

$("#searchInspection").click(function(){
	if($(this).is(':checked')){
		$(".searchColumnTimeOne").removeAttr("disabled")
	}else{
		$(".searchColumnTimeOne").attr("disabled","disabled")
	}
	
})
$("#searchDiagnosis").click(function(){
	if($(this).is(':checked')){
		$(".searchColumnTimeTwo").removeAttr("disabled")
	}else{
		$(".searchColumnTimeTwo").attr("disabled","disabled")
	}
})
$(document).on("click",".SearchsSlect,.SearchDivShowTwoSlect,.cancaelBtnDate",function(e){
	e.stopPropagation();
		$(".SearchDivShow").slideToggle(250);

});
//点击其他区域关闭
/*$(document).on("click",function(e){
	var path = getParentNode(e.target);
	for(var i = 0;i<path.length;i++){
		if($(path[i]).hasClass("SearchDivShow")||$(path[i]).hasClass("daterangepicker")||$(path[i]).hasClass("calendar-date")){
			return 0;
		}
	}
	$(".SearchDivShow").slideUp(250);
});*/
