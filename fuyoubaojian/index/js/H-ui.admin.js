/*
 */
$.cookie = function(key, value, options) {
	// Write
	if (arguments.length > 1 && !$.isFunction(value)) {
		options = $.extend({},
			config.defaults, options);

		if (typeof options.expires === 'number') {
			var days = options.expires,
				t = options.expires = new Date();
			t.setMilliseconds(t.getMilliseconds() + days * 864e+5);
		}

		return (document.cookie = [encode(key), '=', stringifyCookieValue(value), options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
			options.path ? '; path=' + options.path: '', options.domain ? '; domain=' + options.domain: '', options.secure ? '; secure': ''].join(''));
	}
	// Read
	var result = key ? undefined: {},
	// To prevent the for loop in the first place assign an empty array
	// in case there are no cookies at all. Also prevents odd result when
	// calling $.cookie().
		cookies = document.cookie ? document.cookie.split('; ') : [],
		i = 0,
		l = cookies.length;
	for (; i < l; i++) {
		var parts = cookies[i].split('='),
			name = decode(parts.shift()),
			cookie = parts.join('=');
		if (key === name) {
			// If second argument (value) is a function it's a converter...
			result = read(cookie, value);
			break;
		}
		// Prevent storing a cookie that we couldn't decode.
		if (!key && (cookie = read(cookie)) !== undefined) {
			result[name] = cookie;
		}
	}
	return result;
};
var num=0,oUl=$("#min_title_list"),hide_nav=$("#Hui-tabNav");

/*获取顶部选项卡总长度*/
function tabNavallwidth(){
	var taballwidth=0,
		$tabNav = hide_nav.find(".acrossTab"),
		$tabNavWp = hide_nav.find(".Hui-tabNav-wp"),
		$tabNavitem = hide_nav.find(".acrossTab li"),
		$tabNavmore =hide_nav.find(".Hui-tabNav-more");
	if (!$tabNav[0]){return}
	$tabNavitem.each(function(index, element) {
		taballwidth += Number(parseFloat($(this).width()+60))
	});
	$tabNav.width(taballwidth+25);
	var w = $tabNavWp.width();
	if(taballwidth+25>w){
		$tabNavmore.show()}
	else{
		$tabNav.css({left:"40px"});
	}
}

/*左侧菜单响应式*/
function Huiasidedisplay(){
	if($(window).width()>=768){
		$(".Hui-aside").show();
	}
}
/*获取皮肤cookie*/
function getskincookie(){
	var v = $.cookie("Huiskin");
	var hrefStr=$("#skin").attr("href");
	if(v==null||v==""){
		v="default";
	}
	if(hrefStr!=undefined){
		var hrefRes=hrefStr.substring(0,hrefStr.lastIndexOf('skin/'))+'skin/'+v+'/skin.css';
		$("#skin").attr("href",hrefRes);
	}
}
/*菜单导航*/
function Hui_admin_tab(obj){
	var bStop = false,
		bStopIndex = 0,
		href = $(obj).attr('data-href'),
		title = $(obj).attr("data-title"),
		topWindow = $(window.parent.document),
		show_navLi = topWindow.find("#min_title_list li"),
		iframe_box = topWindow.find("#iframe_box");
	//console.log(topWindow);
	if(!href||href==""){
		alert("data-href不存在，v2.5版本之前用_href属性，升级后请改为data-href属性");
		return false;
	}if(!title){
		alert("v2.5版本之后使用data-title属性");
		return false;
	}
	if(title==""){
		alert("data-title属性不能为空");
		return false;
	}
	/*debugger;*/
	show_navLi.each(function() {
		if($(this).find('.spanInfoA').attr("data-href")==href){
			bStop=true;
			bStopIndex=show_navLi.index($(this));
			if(obj.getAttribute("data-reload")==1){
				window.top.frames[bStopIndex].location.reload();
			}
			return false;
		}
	});
	if(!bStop){
		creatIframe(href,title);
		min_titleList();
	}
	else{
		show_navLi.removeClass("active").eq(bStopIndex).addClass("active");
		iframe_box.find(".show_iframe").hide().eq(bStopIndex).show().find("iframe").attr("src",href);
	}
	/*
	 * 增加的
	 */
	var treeView=$(".treeViewSpan");
	show_navLi = topWindow.find("#min_title_list li.active");
	treeView.each(function(a,b){
		if(show_navLi.find(".spanInfoA").attr("data-href")==$(b).find("a").attr("data-href")){
			treeView.removeClass("change");
			$(b).addClass("change");
		}
	});
	$("#consulationTop").find('[data-BARcontent="1"]').html(title);


}

/*最新tab标题栏列表*/
function min_titleList(){
	var topWindow = $(window.parent.document),
		show_nav = topWindow.find("#min_title_list"),
		aLi = show_nav.find("li");
}

/*创建iframe*/
function creatIframe(href,titleName){
	var topWindow=$(window.parent.document),
		show_nav=topWindow.find('#min_title_list'),
		iframe_box=topWindow.find('#iframe_box'),
		iframeBox=iframe_box.find('.show_iframe'),
		$tabNav = topWindow.find(".acrossTab"),
		$tabNavWp = topWindow.find(".Hui-tabNav-wp"),
		$tabNavmore =topWindow.find(".Hui-tabNav-more");
	var taballwidth=0;

	show_nav.find('li').removeClass("active");
	show_nav.append('<li class="active"><span class="flushA"></span><span class="spanInfoA" data-href="'+href+'">'+titleName+'</span><i></i></li>');
	if('function'==typeof $('#min_title_list li').contextMenu){
		$("#min_title_list li").contextMenu('Huiadminmenu', {
			bindings: {
				'closethis': function(t) {
					var $t = $(t);
					if($t.find("i")){
						$t.find("i").trigger("click");
					}
				},
				'closeall': function(t) {
					$("#min_title_list li i").trigger("click");
				},
				'closeother':function(t){
					removeOtherIframe(t)
				},
				"flushNow":function(t){
					flushNow(t);
				}
			}
		});
	}else {

	}
	var $tabNavitem = topWindow.find(".acrossTab li");
	if (!$tabNav[0]){return}
	$tabNavitem.each(function(index, element) {
		taballwidth+=Number(parseFloat($(this).width()+60))
	});
	$tabNav.width(taballwidth+25);
	var w = $tabNavWp.width();
	if(taballwidth+25>w){
		$tabNavmore.show()}
	else{
		$tabNav.css({left:"40px"})
	}
	iframeBox.hide();
	iframe_box.append('<div class="show_iframe">'+
		'<div class="preloader">'+
		/*'<svg class="circular" viewBox="25 25 50 50">'+
		'<circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10" />'+
		'</svg>'+*/
		'</div>'+
		'<iframe frameborder="0" src='+href+'></iframe></div>');
	var showBox=iframe_box.find('.show_iframe:visible');
	showBox.find('iframe').load(function(){
		showBox.find('.preloader').hide();
	});
}



/*关闭iframe*/
function removeIframe(){
	var topWindow = $(window.parent.document),
		iframe = topWindow.find('#iframe_box .show_iframe'),
		tab = topWindow.find(".acrossTab li"),
		showTab = topWindow.find(".acrossTab li.active"),
		showBox=topWindow.find('.show_iframe:visible'),
		i = showTab.index();
	tab.eq(i-1).addClass("active");
	tab.eq(i).remove();
	iframe.eq(i-1).show();
	iframe.eq(i).remove();
}
function flushNow(){
	var topWindow = $(window.parent.document),
	iframe = topWindow.find('#iframe_box .show_iframe'),
	tab = topWindow.find(".acrossTab li"),
	showTab = topWindow.find(".acrossTab li.active"),
	showBox=topWindow.find('.show_iframe:visible'),
	i = showTab.index();

	iframe.eq(i).find("iframe")[0].contentWindow.location.reload();
}
/*关闭所有iframe*/
function removeIframeAll(){
	var topWindow = $(window.parent.document),
		iframe = topWindow.find('#iframe_box .show_iframe'),
		tab = topWindow.find(".acrossTab li");
	for(var i=0;i<tab.length;i++){
		if(tab.eq(i).find("i").length>0){
			tab.eq(i).remove();
			iframe.eq(i).remove();
		}
	}
}
function removeOtherIframe(ele){
	var topWindow = $(window.parent.document),
			iframe = topWindow.find('#iframe_box .show_iframe'),
			tab = topWindow.find(".acrossTab li");
	for(var i=0;i<tab.length;i++){
		if(tab[i]==ele){
			ele.click();
			continue;
		}
		if(tab.eq(i).find("i").length>0){
			tab.eq(i).remove();
			iframe.eq(i).remove();
		}
	}
}

/*时间*/
function getHTMLDate(obj) {
	var d = new Date();
	var weekday = new Array(7);
	var _mm = "";
	var _dd = "";
	var _ww = "";
	weekday[0] = "星期日";
	weekday[1] = "星期一";
	weekday[2] = "星期二";
	weekday[3] = "星期三";
	weekday[4] = "星期四";
	weekday[5] = "星期五";
	weekday[6] = "星期六";
	_yy = d.getFullYear();
	_mm = d.getMonth() + 1;
	_dd = d.getDate();
	_ww = weekday[d.getDay()];
	obj.html(_yy + "年" + _mm + "月" + _dd + "日 " + _ww);
};

$(function(){
	getHTMLDate($("#top_time"));
	/*getskincookie();*/
	//layer.config({extend: 'extend/layer.ext.js'});
	Huiasidedisplay();
	var resizeID;
	$(window).resize(function(){
		clearTimeout(resizeID);
		resizeID = setTimeout(function(){
			Huiasidedisplay();
		},500);
	});

	$(".nav-toggle").click(function(){
		$(".Hui-aside").slideToggle();
	});
	$(".Hui-aside").on("click",".menu_dropdown dd li a",function(){
		if($(window).width()<768){
			$(".Hui-aside").slideToggle();
		}
	});

	/*选项卡导航*/
	$(".Hui-aside").on("click",".menu_dropdown a",function(){
		Hui_admin_tab(this);
	});

	$(document).on("click","#min_title_list li",function(){
		var bStopIndex=$(this).index();
		var iframe_box=$("#iframe_box");
		$("#min_title_list li").removeClass("active").eq(bStopIndex).addClass("active");
		iframe_box.find(".show_iframe").hide().eq(bStopIndex).show();
		$("#consulationTop").find('[data-BARcontent="1"]').html(this.innerText);
		//增加的
		var treeView=$(".treeViewSpan");
		var show_navLi =$(window.parent.document).find("#min_title_list li.active");
		treeView.each(function(a,b){
			if(show_navLi.find(".spanInfoA").attr("data-href")==$(b).find("a").attr("data-href")){
				treeView.removeClass("change");
				$(b).addClass("change");
				if(show_navLi.find(".spanInfoA").attr("data-reload")==1){
					window.top.frames[bStopIndex].location.reload();
				}

			}
		})
	});
	$(document).on("click","#min_title_list li i",function(){
		var aCloseIndex=$(this).parents("li").index();
		$(this).parent().remove();
		$('#iframe_box').find('.show_iframe').eq(aCloseIndex).remove();
		num==0?num=0:num--;
		tabNavallwidth();
		$("#consulationTop").find('[data-BARcontent="1"]').html($("#min_title_list .active").text());
	});
	$(document).on("click","#min_title_list li .flushA",function(){
		flushNow();
	});
	$(document).on("dblclick","#min_title_list li",function(){
		var aCloseIndex=$(this).index();
		var iframe_box=$("#iframe_box");
		if(aCloseIndex>0){
			$(this).remove();
			$('#iframe_box').find('.show_iframe').eq(aCloseIndex).remove();
			num==0?num=0:num--;
			$("#min_title_list li").removeClass("active").eq(aCloseIndex-1).addClass("active");
			iframe_box.find(".show_iframe").hide().eq(aCloseIndex-1).show();
			tabNavallwidth();
		}else{
			return false;
		}
	});
	tabNavallwidth();

	$('#js-tabNav-next').click(function(){
		num==oUl.find('li').length-1?num=oUl.find('li').length-1:num++;
		toNavPos();
	});
	$('#js-tabNav-prev').click(function(){
		num==0?num=0:num--;
		toNavPos();
	});

	function toNavPos(){
		var leftNumber="";
		if(-num==0){
			leftNumber="40px";
		}else{
			leftNumber=-num*190+40;
		}
		oUl.stop().animate({'left':leftNumber},100);
	}

	/*换肤*/
	/*$("#Hui-skin .dropDown-menu a").click(function(){
	 var v = $(this).attr("data-val");
	 $.cookie("Huiskin", v);
	 var hrefStr=$("#skin").attr("href");
	 var hrefRes=hrefStr.substring(0,hrefStr.lastIndexOf('skin/'))+'skin/'+v+'/skin.css';
	 $(window.frames.document).contents().find("#skin").attr("href",hrefRes);
	 });*/
});
function displaynavbar(obj){
	$("body").removeClass("big-pageO");
	if($(obj).hasClass("open")){
		$(obj).removeClass("open");$("body").removeClass("big-page")
		$(".CTXD-left-menu").css({
			display:""
		});
		$(obj).css({
			left:""
		});
		$(".Hui-article-box").css({
			left:""
		});
		$(".controlHideMenu")[0].show=true;
	}else{

		$(obj).addClass("open");$("body").addClass("big-page");
	}
}
$(".controlHideMenu").on("click",function(){
	var THIS = this;
	if(typeof  this.show!="undefined" &&this.show==false){
		this.show=true;
		$("body").removeClass("big-page");
		$(".pngfix").removeClass("open");$("body").removeClass("big-pageO");
	}else{
		this.show=false;
		$("body").removeClass("big-page");
		$(".pngfix").addClass("open");$("body").addClass("big-pageO");
	}
});
/*table 点击显示隐藏的icon*/
$(document).on("click",function(){
	$(".overHiddenBox").css({display:"none"});
	for(var i=0;i<$('[data-iconTd]').length;i++){
		$('[data-iconTd]')[i].showBox=false;
		$('[data-iconTd]')[i].setAttribute("data-title","更多");
		$($('[data-iconTd]')[i]).addClass("rotate_90");
	}
});
$(document).on("click",'[data-iconTd]',function(e){
	var THIS = this;
	var THIS_FU=this.parentNode?this.parentNode:document.createElement("div");
	var THIS_FU_TARGET=null;
	for(var i=0;i<$('[data-iconTd]').length;i++){
		THIS_FU_TARGET=$('[data-iconTd]')[i]?$('[data-iconTd]')[i]:document.createElement("div");
		if($('[data-iconTd]')[i]!=THIS){
			$('[data-iconTd]')[i].showBox=false;
			$(THIS_FU_TARGET).find(".overHiddenBox").css({display:"none"});
			$('[data-iconTd]')[i].setAttribute("data-title","更多");
			$($('[data-iconTd]')[i]).addClass("rotate_90");
		}
	}
	if(!THIS.showBox){
		THIS.showBox=true;
		if(e.stopPropagation){
			e.stopPropagation();
		}else{
			window.event&&(window.event.cancelBubble=true);
		}
		$(THIS_FU).find(".overHiddenBox").css({display:"block"});
		THIS.setAttribute("data-title","");
		$(THIS).removeClass("rotate_90");
	}else{
		THIS.showBox=false;
		$(THIS_FU).find(".overHiddenBox").css({display:"none"});
		THIS.setAttribute("data-title","更多");
		$(THIS).addClass("rotate_90");
	}

});
/*消息触发js*/
$(document).on("click",function(e){
	var tg = e.srcElement? e.srcElement: e.target;
	var path = getParentNode(tg);
	var bool = false;
	$('[aria-expanded]').attr("aria-expanded","false");
	$('[aria-expanded]').parent().removeClass("open");
	for (var i = 0;i<path.length;i++){
		if($(path[i]).attr("data-toggle")=="dropdown"&&bool==false){
			bool=true;
			$(path[i]).attr("aria-expanded","true");
			$(path[i].parentNode).addClass("open");
		}
	}
});
