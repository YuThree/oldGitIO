/**
 * Created by CDCT on 2017/6/1.
 */
//获取节点的所有父节点
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
$(document).on("click", function(e) {
	//兼容事件对象
	if(window.event){
		e=window.event;
	}else if(typeof event!="undefined"){
		e=event;
	}else{
		e=arguments.callee.arguments[0];
	}
	//循环事件源的所有父节点判断是否拥有属性data-role 如果拥有就会执行开页面的操作
	if(!e.path) {
		if(e.target) {
			e.path = getParentNode(e.target);
		} else {
			e.path = getParentNode(e.srcElement);
		}
	}
	for(var i = 0; i < e.path.length; i++) {
		if(!e.path[i]) {
			continue;
		}
		if(!e.path[i].getAttribute) {
			continue;
		}
		if(e.path[i].getAttribute("data-role") == "oneMenu") {
			/*    $("#menuLevalOneBox").html("");
			    $("#min_title_list").html("");
			    $("#iframe_box").html("");
			  */ //如果菜单拥有data-role="oneMenu"发送ajax加载二级菜单
			var a = i;
			/*var str = '[' + '[{"name":"公共卫生","userLevel":"1","list":[{"name":"二级菜单","userLevel":"2","list":[{"name":"三级菜单","userLevel":"3","list":null,"url":null,"icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20},{"name":"三级菜单","userLevel":"3","list":null,"url":null,"icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20}],"url":null,"icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20},{"name":"汽车之家","userLevel":"2","list":[{"name":"三级菜单","userLevel":"3","list":null,"url":null,"icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20},{"name":"三级菜单","userLevel":"3","list":null,"url":null,"icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20}],"url":"http://www.autohome.com.cn/beijing/#pvareaid=100519","icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20}],"url":"https://www.baidu.com/","icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20},{"name":"360导航","userLevel":"1","list":[{"name":"二级菜单","userLevel":"2","list":[{"name":"三级菜单","userLevel":"3","list":null,"url":null,"icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20},{"name":"三级菜单","userLevel":"3","list":null,"url":null,"icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20}],"url":null,"icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20},{"name":"汽车之家","userLevel":"2","list":[{"name":"三级菜单","userLevel":"3","list":null,"url":null,"icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20},{"name":"三级菜单","userLevel":"3","list":null,"url":null,"icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20}],"url":"http://www.autohome.com.cn/beijing/#pvareaid=100519","icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20}],"url":"https://hao.360.cn/?src=lm&ls=n482bfbdf97","icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20}],' +
				'[{"name":"汽车之家","userLevel":"1","list":[{"name":"二级菜单","userLevel":"2","list":[{"name":"三级菜单","userLevel":"3","list":null,"url":null,"icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20},{"name":"三级菜单","userLevel":"3","list":null,"url":null,"icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20}],"url":null,"icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20},{"name":"汽车之家","userLevel":"2","list":[{"name":"三级菜单","userLevel":"3","list":null,"url":null,"icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20},{"name":"三级菜单","userLevel":"3","list":null,"url":null,"icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20}],"url":"http://www.autohome.com.cn/beijing/#pvareaid=100519","icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20}],"url":"http://www.autohome.com.cn/beijing/#pvareaid=100519","icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20}],' +
				'[{"name":"阿里巴巴邮箱","userLevel":"1","list":[{"name":"二级菜单","userLevel":"2","list":[{"name":"三级菜单","userLevel":"3","list":null,"url":null,"icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20},{"name":"三级菜单","userLevel":"3","list":null,"url":null,"icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20}],"url":null,"icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20},{"name":"汽车之家","userLevel":"2","list":[{"name":"三级菜单","userLevel":"3","list":null,"url":null,"icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20},{"name":"三级菜单","userLevel":"3","list":null,"url":null,"icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20}],"url":"http://www.autohome.com.cn/beijing/#pvareaid=100519","icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20}],"url":"http://mail.iri.cn/","icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20},{"name":"网址大全","userLevel":"1","list":[{"name":"二级菜单","userLevel":"2","list":[{"name":"三级菜单","userLevel":"3","list":null,"url":null,"icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20},{"name":"三级菜单","userLevel":"3","list":null,"url":null,"icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20}],"url":null,"icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20},{"name":"汽车之家","userLevel":"2","list":[{"name":"三级菜单","userLevel":"3","list":null,"url":null,"icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20},{"name":"三级菜单","userLevel":"3","list":null,"url":null,"icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20}],"url":"http://www.autohome.com.cn/beijing/#pvareaid=100519","icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20}],"url":"http://www.jiegeng.com/","icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20}],' +
				'[{"name":"阿里巴巴邮箱","userLevel":"1","list":[{"name":"二级菜单","userLevel":"2","list":[{"name":"三级菜单","userLevel":"3","list":null,"url":null,"icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20},{"name":"三级菜单","userLevel":"3","list":null,"url":null,"icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20}],"url":null,"icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20},{"name":"汽车之家","userLevel":"2","list":[{"name":"三级菜单","userLevel":"3","list":null,"url":null,"icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20},{"name":"三级菜单","userLevel":"3","list":null,"url":null,"icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20}],"url":"http://www.autohome.com.cn/beijing/#pvareaid=100519","icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20}],"url":"http://mail.iri.cn/","icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20},{"name":"爱淘宝","userLevel":"1","list":[{"name":"二级菜单","userLevel":"2","list":[{"name":"三级菜单","userLevel":"3","list":null,"url":null,"icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20},{"name":"三级菜单","userLevel":"3","list":null,"url":null,"icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20}],"url":null,"icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20},{"name":"汽车之家","userLevel":"2","list":[{"name":"三级菜单","userLevel":"3","list":null,"url":null,"icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20},{"name":"三级菜单","userLevel":"3","list":null,"url":null,"icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20}],"url":"http://www.autohome.com.cn/beijing/#pvareaid=100519","icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20}],"url":"https://ai.taobao.com/?pid=mm_112628724_11936611_53304806","icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20},{"name":"关于我么","userLevel":"1","list":[{"name":"二级菜单","userLevel":"2","list":[{"name":"三级菜单","userLevel":"3","list":null,"url":null,"icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20},{"name":"三级菜单","userLevel":"3","list":null,"url":null,"icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20}],"url":null,"icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20},{"name":"汽车之家","userLevel":"2","list":[{"name":"三级菜单","userLevel":"3","list":null,"url":null,"icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20},{"name":"三级菜单","userLevel":"3","list":null,"url":null,"icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20}],"url":"http://www.autohome.com.cn/beijing/#pvareaid=100519","icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20}],"url":"about.html","icon":"image/icon/A1.png--image/icon/A1.png","plJL":20,"plZL":20}]' + ']';
		*/
		       var str = '[[],[],[]]';
		if(e.path[i].getAttribute("data-url").search("local") != -1) {
				var data =JSON.parse(str);
				data = data[e.path[i].getAttribute("data-url").split("=>")[1]];
			/*console.log(data);*/
			data=data.concat(typeof huyuewen!="undefined"?huyuewen:[]);
			data=data.concat(typeof yinhui!="undefined"?yinhui:[]);
				$.treeView.addAttribute(data, "plJL", 20);
				$.treeView.addAttribute(data, "plZL", 20);
				$("#menuLevalOneBox").showTreeView({
					preStr: '<div class="oneMenuName">' + $(e.path[a]).text() + '</div>',
					data: data,
					type: "LOCAL",
					treeViewClass: "treeClass",
					showOne:true,
					error: function() {
						console.log("错误了")
					},
					success: function() {
						if($("#menuLevalOneBox a")[0]) {
							$("#menuLevalOneBox a")[0].click();
						}
					}
				});
			}
		}
	}

});
//初始化ajax

$(document).on("click", '.icon', function() {
	$(".icon").find('[data-bg]').css({
		display: "none"
	});
	$(this).find('[data-bg]').css({
		display: "block"
	});
	for(var i = 0; i < $(".icon").length; i++) {
		$(".icon")[i].isclick = false;
	}
	this.isclick = true;
});
$(document).on("mousemove", '.icon', function() {
	for(var i = 0; i < $(".icon").length; i++) {
		if($(".icon")[i].isclick) {
			$($(".icon")[i]).find('[data-bg]').css({
				display: "block"
			});
		} else {
			$($(".icon")[i]).find('[data-bg]').css({
				display: "none"
			});
		}
	}
	$(this).find('[data-bg]').css({
		display: "block"
	});
});
$(document).on("mouseout", '.icon', function() {
	for(var i = 0; i < $(".icon").length; i++) {
		if($(".icon")[i].isclick) {
			$($(".icon")[i]).find('[data-bg]').css({
				display: "block"
			});
		} else {
			$($(".icon")[i]).find('[data-bg]').css({
				display: "none"
			});
		}
	}
});
var strMenu = '[{"url":"local=>0","name":"首页","icon":"image/icon/icon.png","iconBg":"image/icon/menu_02.png"},{"url":"local=>1","name":"数据质控","icon":"image/icon/icon1.png","iconBg":"image/icon/menu_02.png"},{"url":"local=>2","name":"区域平台","icon":"image/icon/icon2.png","iconBg":"image/icon/menu_02.png"}]';
(function() {
	var data = JSON.parse(strMenu);
	var str = "";
	for(var i = 0; i < data.length; i++) {
		str = str + '<li data-role="oneMenu" data-url="' + data[i].url + '" class="li">' +
			'<div class="icon"><img width="60px" height="60px" src="' + data[i].icon + '">' +
			'<img data-bg width="88px" height="88px" src="' + data[i].iconBg + '" style="margin-top: -44px;position:absolute;top:50%;margin-left:-44px;left:50%;margin-left:-44px;display: none" />' + '</div>' +
			'<span class="span">' + data[i].name + '</span>' +
			'</li>'
	}
	
	$("#oneLevalMenu").html(str);
	$("#oneLevalMenu").find('.icon')[0].click();
})();
$(".CTXD-left-menu").panel({
	iWheelStep: 32
});
$(".Hui-aside").panel({
	iWheelStep: 32
});