$(function(){
	var iframeUrl = ['2-1-1妇女基本信息登记表.html','2-2-2乳腺癌筛查登记表.html','2-3-2宫颈癌筛查登记表.html']
	$('#selectUl').find('li').each(function(e){
		$(this).click(function(){
			$('.cdct_iframe').find('iframe').attr('src',iframeUrl[e]);
		});
	});

});
