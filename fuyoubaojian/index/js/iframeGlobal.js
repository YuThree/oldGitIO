/**
 *  顶层引入的JS
 */

    //定义顶层储存跨页面传值的中间变量
	var Global={};

    //定义处理顶层的变量
	var GlobalFunc={};


	//删除所有的储存值
	GlobalFunc.deleteAllAttriute=function(){
		var k=Object.keys(Global);
		for(var i=0;i<k.length;i++){
			if(typeof  Global[k[i]]!="function"){
				delete Global[k[i]];
			}
		}
	};

    //复制储存的所有值
	GlobalFunc.copyAttribute=function(Obj){
		var k=Object.keys(Global);
		for(var i=0;i<k.length;i++){
			Obj[k[i]]=Global[k[i]];
		}
	};

    //插入值不过没有用
	GlobalFunc.pushAttribute=function(key,value){
		var k=Object.keys(Global);
		for(var i=0;i<k.length;i++){
			if(k[i]==key){
				throw new Error("key 已经存在请不要在传入");
				return 0;
			}
		}
		if(typeof value == "function"){
			console.warn("Global value is function type");
		}
		Global.key=value;
	};
    //删除指定的值
	GlobalFunc.deleteAttribute=function(key){
		var k=Object.keys(Global);
		for(var i=0;i<k.length;i++){
			if(k[i]==key){
				delete Global[k[i]];
			}
		}
	};
	/**
	 * url 跳转地址
	 * type 类型 _target target view_window
	 * title 显示的title target 不支持该属性
	 * Global 需要传的参数 
	 */
	//改变当前页的视图src
	function viewWindowTab(src,title){
		var lis=$("#min_title_list").find("li");
		var num=0;
		for(var i=0;i<lis.length;i++){
			if($(lis[i]).hasClass("active")){
				$(lis[i]).attr("data-href",src);
				$(lis[i]).find("span").html(title);
				num=i;
			}
		}
		var showIframe=$("#iframe_box").find(".show_iframe");
		$(showIframe[num]).find("iframe").attr("src",src);
	}
	GlobalFunc.changeIframe=function(Obj){
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
		}
		changeIframe(O.url,O.type,O.title,O.GlobalEx,O.reload,O.closeNow);
	};
	//新增视图函数
	function changeIframe(url,type,title,GlobalEx,reload,closeNow){
		try{
			GlobalEx=JSON.parse(GlobalEx)
		}catch(e){
			console.log("传入json格式有问题");
			GlobalEx=null;
		}
		$.extend(Global,GlobalEx);

		//判断传入的跳转类型
		switch (type){
		//	新增窗口相对于管理后台面包屑
		case "_target":{
			var a=document.createElement("a");
			a.setAttribute("data-title", title);
			a.setAttribute("data-href",url);
			a.setAttribute("data-reload",reload);
			if(closeNow){
				removeIframe();
			}
			Hui_admin_tab(a);
			a=null;
			break;
		}
		//		新增窗口相对于浏览器
		case "target":{
			window.open(url);
			break;
		}
		//		修改当前页面的src 相对于当前的view
		case "view_window":{
			viewWindowTab(url,title);
			break;
		}
		}
	}
