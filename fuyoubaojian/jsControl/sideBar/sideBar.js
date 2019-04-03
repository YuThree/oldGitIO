$(function(){
	$('.cdct_sideBarTop').find('.close').click(function(){
		$('.cdct_sideBar').css('right','-320px');
		$('.cdct_toolTip').show();
	});

	$('.cdct_toolTip').click(function(){
		$('.cdct_sideBar').css('right','0');
		$(this).hide();
	});
});