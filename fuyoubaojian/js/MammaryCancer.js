$(function(){
	// 下拉
	var allEle=$(".cdct_select");
	for(var i = 0;i<allEle.length;i++){
		$(allEle[i]).simulationSelect({
			selectText:'{a}<span class="selectDown"></span>'
		});
	}

	// 时间
	$(".datepicker").on('click', function(e){
		e.stopPropagation();
		$(this).lqdatetimepicker({
			css : 'datetime-day',
			dateType:"YYYY-MM-DD",
			showNode:$(this).parent()
		});
	});
	$(".datepicker1").on('click', function(e){
		e.stopPropagation();
		$(this).lqdatetimepicker({
			css : 'datetime-day',
			dateType:"YYYY",
			offse: {
				width: 'auto'
			}
		});
	});


	// 滚动条
	$(".rowScroll").panel({
		iWheelStep:32,
	});

	// 表格
	var dataSet = [
		[ '01', "2018-03-07", "哈哈哈"],
		[ '01', "2018-03-07", "哈哈哈"],
		[ '01', "2018-03-07", "哈哈哈"],
		[ '01', "2018-03-07", "哈哈哈"],
		[ '01', "2018-03-07", "哈哈哈"],
		[ '01', "2018-03-07", "哈哈哈"],
		[ '01', "2018-03-07", "哈哈哈"],
		[ '01', "2018-03-07", "哈哈哈"],
		[ '01', "2018-03-07", "哈哈哈"],
		[ '01', "2018-03-07", "哈哈哈"],
		[ '01', "2018-03-07", "哈哈哈"],
		[ '01', "2018-03-07", "哈哈哈"],
		[ '01', "2018-03-07", "哈哈哈"],
		[ '01', "2018-03-07", "哈哈哈"],
		[ '01', "2018-03-07", "哈哈哈"],
		[ '01', "2018-03-07", "哈哈哈"],
		[ '01', "2018-03-07", "哈哈哈"],
		[ '01', "2018-03-07", "哈哈哈"]
	];

	var tableObj=$(".tableShowInfo").showTable({
	    data:dataSet,
	    title:[
	        "序号",
	        "筛查日期",
	        "备注"
	    ],
	    scrollHeight:".tableShowInfo",
	    scrollHeightPC:45,
	    edit:false
	});

	// 表单验证
	var obj=$("#form").validate({
		rules:{
			scrqyz:{
				required:true,
			}
		},
		errorClass:"errorClass_"
	});
	obj.form();
});