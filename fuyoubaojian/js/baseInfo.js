// 下拉
var allEle=$(".cdct_select");
for(var i = 0;i<allEle.length;i++){
    $(allEle[i]).simulationSelect({
        selectText:'{a}<span class="selectDown"></span>'
    });
}

//    滚动条
$(".scrollJS").panel({
    iWheelStep:40,
    scrollWIng:function(){
        console.log(arguments);
    }
});  

// $(".z-Box11").panel({
//     iWheelStep:40,
//     scrollWIng:function(){
//         console.log(arguments);
//     }
// });

//   时间控件
$(".datepicker").on('click', function(e){
    e.stopPropagation();
    $(this).lqdatetimepicker({
        css : 'datetime-day',
        dateType:"YYYY-MM-DD",
    });
});

