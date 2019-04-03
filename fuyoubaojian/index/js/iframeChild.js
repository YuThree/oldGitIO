/**
 * 内嵌的iframe引入的JS
 */
//data-CTXDtype监听拥有这个属性的
//data-CTXDurl 跳转地址
//data-CTXDtype 跳转类型
//可选项
//target 浏览器新窗口
//_target 后台管理新窗口
//view_window 当前窗口
//data-CTXDtitle 页面标题 target不支持(可选属性 如果没有设置就是点击节点的innerHTML 如果innerHTML也没有定义 标题将会显示’未命名页面’)
//data-iframeData  json格式对象 (
//	这个属性是json字符串类型的
//如果设置了请确认json字符串是正确的
//如果正确将会给主层window的Global扩展这个字符串的所有属性
//方便另一个iframe使用
//)
//data-closeNow 设置为1表示关闭当前_tab页面
//第一步 主层引入 iframeGlobal.js
//
//非主层进入 iframeChild.js(请在页脚引入)
//在接收到值的页面 请重新定义一个对象将window.top.Global复制到自己页面
//实例
//var obj=new Object();
//window.top.GlobalFunc.copyAttribute(obj);
//这样obj就储存了另一个页面传过来的json键值了
$(document).on("click",'[data-CTXDtype]',function(){
	//将以前页面的值删除掉
	window.top.GlobalFunc.deleteAllAttriute();

	//设置默认title
	var title="";
	var reload="";
	var closeNow;
	if(this.getAttribute("data-CTXDtitle")){
		title=this.getAttribute("data-CTXDtitle");
	}else{
		if(/^\s*$/.test(this.innerText)){
			title="未命名页面"
		}else{
			title=this.innerText;
		}
	}
	
	reload=this.getAttribute("data-reload")?this.getAttribute("data-reload"):"";
	closeNow=this.getAttribute("data-closeNow")?this.getAttribute("data-closeNow"):"";

	//调用顶层跳转页面的函数
	window.top.changeIframe(this.getAttribute("data-CTXDurl"),this.getAttribute("data-CTXDtype"),title,this.getAttribute("data-iframeData"),reload,closeNow);
});






