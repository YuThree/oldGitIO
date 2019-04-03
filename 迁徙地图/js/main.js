$(".MS").panel({
	iWheelStep:32,
});

// 导航显示隐藏
// $(".navBtn").click(function(){
// 	$(".nav").toggleClass('show');
// 	$(this).toggleClass('on');
// });

$(".navBtn").click(function(){
	$(this).toggleClass('on');
	if($(this).hasClass("on")){
		$(".cdct_clearfix").hide("slow");
		$(".iframe").css({"height":"calc(100% - 100px)"});
		$("#Nav").animate({"top":"20px"},"slow");
		$("#Nav").css({"transform":"rotate(90deg)","transition":"transform 1s"});
	}else{
		$(".cdct_clearfix").show("slow");
		$(".iframe").css({"height":"calc(100% - 175px)"});
		$("#Nav").animate({"top":"90px"},"slow");
		$("#Nav").css({"transform":"rotate(0deg)","transition":"transform 1s"});
	}
})


var subLeave = true;
var timer;



// 登入登出菜单
$(".userBox").click(function(event){
	event.stopPropagation();
	$(".dropdown-menu").show();
	$("body").click(function(){
		$(".dropdown-menu").hide();
	})
})

var setMenu = function(obj){
	var defaultObj={
		Menu:[
			{firstTitle:'一级菜单',firstHref:'',subMenu:[],subHref:[]},
			{firstTitle:'一级菜单',firstHref:'',subMenu:[],subHref:[]},
			{firstTitle:'一级菜单',firstHref:'',subMenu:[],subHref:[]},
			{firstTitle:'一级菜单',firstHref:'',subMenu:[],subHref:[]},
			{firstTitle:'一级菜单',firstHref:'',subMenu:[],subHref:[]},
			{firstTitle:'一级菜单',firstHref:'',subMenu:[],subHref:[]},
			{firstTitle:'一级菜单',firstHref:'',subMenu:[],subHref:[]},
		],
		subMenu: [['子菜单-index.html','子菜单','子菜单']],
	};
	$.extend(defaultObj,obj);
	$("#nav").html("");
	defaultObj.Menu.forEach(function(item,index){
		var firstHref = typeof item.firstHref != 'undefined' ? item.firstHref: '';
		if(index == 0){
			$("#nav").append('<li class="on" data-item="'+ index +'" data-href="'+ firstHref +'">'+ item.firstTitle+'</li>')
		}else{
			$("#nav").append('<li data-item="'+ index +'" data-href="'+ firstHref +'">'+ item.firstTitle+'</li>');
		}
	});
	$('#nav').on('click','li',function(){
		var href = $(this).attr('data-href');
		$('#iframe').attr('src',href);
		$(this).addClass('on').siblings().removeClass('on');
	})
	var subIndex;
	var activeIndex;  // 一级菜单索引
	var currentParent; // 当前父元素
	// 导航切换
	$(".nav").find("li").mouseover(function(event) {
		$('.subNav').html('');
		activeIndex = $(this).attr('data-item');
		if(typeof defaultObj.Menu[activeIndex].subMenu != 'undefined'){
			defaultObj.Menu[activeIndex].subMenu.forEach(function(item,index){
				var subHref = defaultObj.Menu[activeIndex].subHref[index];
				if (typeof subHref == 'undefined'){ subHref = ' ';}
				var page = '<div class="page" data-index="'+ index +'" data-href="'+ subHref +'">'+item+'</div>';
				if(subIndex == index && currentParent == activeIndex){
					page = '<div class="page active" data-index="'+ index +'" data-href="'+ subHref +'">'+item+'</div>';
				}
				$('.subNav').append(page);
			})
		}
		

		if($(".nav").hasClass("show")){
			clearTimeout(timer);
			var currentTarget = event.currentTarget;
			var subNavLeft = $(currentTarget).offset().left + 5;
			var subNavTop = $(currentTarget).offset().top + $(currentTarget).height();
			// 方案一 一半位置切换样式
			// if(subNavLeft > ($(".mainBox").width() )/ 2){
			// 	subNavLeft = $(currentTarget).offset().left + $(currentTarget).width() - $(".subNav").width();
			// }

			// 方案二
			if(subNavLeft > $(".mainBox").width() - $(".subNav").width()){
				subNavLeft = $(currentTarget).offset().left + $(currentTarget).width() - $(".subNav").width();
			}
			
			$(".subNav").css({
				top: subNavTop,
				left: subNavLeft
			}).show();
		}
		
	}).mouseleave(function(event){
		clearTimeout(timer);
		timer = setTimeout(function(){
			if(subLeave){
				$(".subNav").hide();
			}
		},100);
		$(".subNav").mouseover(function(event){
			clearTimeout(timer);
			subLeave = false;
		}).mouseleave(function(){
			subLeave = true;
			$(this).hide();
		});
	});

	$('.subNav').on('click','.page',function(){
		var href = $(this).attr('data-href');
		subIndex = $(this).attr('data-index');
		$('#iframe').attr('src',href);
		$(this).addClass('active').siblings().removeClass('active');
		$('#nav').find('li').removeClass('on');
		$($('#nav').find('li')[activeIndex]).addClass('on');
		currentParent = activeIndex;
	})
}



