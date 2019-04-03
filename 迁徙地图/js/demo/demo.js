// var angles = "<div class='topAngle angles'></div><div class='rightAngle angles'></div><div class='bottomAngle angles'></div><div class='leftAngle angles'></div>";
// $(".angleBorder").append(angles);


//   时间控件
$(".timeSlotPut").on('click', function(e){
    e.stopPropagation();
    $(this).lqdatetimepicker({
        css : 'datetime-day',
        dateType:"YYYY-MM-DD",
    });
});

$('#config-demo1').daterangepicker({
    /*  "startDate": "YYYY-MM-DD",
     "endDate": "07/15/2015" */
    format:"YYYY-MM-DD"
}, function (start, end, label) {
    // alert("改变了哦")   ; //改变后的回调
});

//  下拉控件
$(".cdct_select1").each(function(index,element){
    $(element).simulationSelect({selectText:'{a}<span class="selectDown"></span>'});
})
