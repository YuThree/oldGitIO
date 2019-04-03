/**
 * 为基础框架做的扩展 隐藏menu
 * 在子页面引入即可隐藏父窗口的菜单
 * 
 */
if(!$(window.top.document).find(".pngfix").hasClass("open")){
	$(window.top.document).find(".pngfix").trigger("click");
}
$(window.top.document).find(".pngfix").css({
	left:"0px"
});
$(window.top.document).find("#consulationTop [data-barsystem='1']").css({
	display:"none"
});
$(window.top.document).find("#consulationTop img").css({
	display:"none"
});
$(window.top.document.body).find(".CTXD-left-menu").css({
	display:"none"
});
$(window.top.document.body).find(".Hui-article-box").css({
	left:"0px"
});
/*$(window.top.document.body).addClass("big-page");*/