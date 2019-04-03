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

//   时间控件
$(".datepicker").on('click', function(e){
    e.stopPropagation();
    $(this).lqdatetimepicker({
        css : 'datetime-day',
        dateType:"YYYY-MM-DD",
    });
});

//验证  

var obj =  $("#signupForm").validate({
    rules: {
      firstname: {
        required: true,
        minlength: 3
      },
      firstname1: {
        required: true,
        minlength: 3
      },
      firstname3: {
        required: true,
        minlength: 3
      }
    },
    errorClass:"errorClass_"
});
obj.form();


 // 侧边栏表格
    var dataSet = [
      [ "01", "2018-03-07", "高危筛查", ""],
      [ "01", "2018-03-07", "高危筛查", ""],
      [ "01", "2018-03-07", "高危筛查", ""],
      [ "01", "2018-03-07", "高危筛查", ""],
      [ "01", "2018-03-07", "高危筛查", ""],
      [ "01", "2018-03-07", "高危筛查", ""],
      [ "01", "2018-03-07", "高危筛查", ""],
      [ "01", "2018-03-07", "高危筛查", ""],
      [ "01", "2018-03-07", "高危筛查", ""],
      [ "01", "2018-03-07", "高危筛查", ""],
      [ "01", "2018-03-07", "高危筛查", ""],
      [ "01", "2018-03-07", "高危筛查", ""],
      [ "01", "2018-03-07", "高危筛查", ""],
      [ "01", "2018-03-07", "高危筛查", ""],
      [ "01", "2018-03-07", "高危筛查", ""],
      [ "01", "2018-03-07", "高危筛查", ""],
      [ "01", "2018-03-07", "高危筛查", ""],
      [ "01", "2018-03-07", "高危筛查", ""],
        
    ];

    var tableObj=$(".tableShowInfo").showTable({
        data:dataSet,
        title:[
            "序号",
            "评分时间",
            "项目",
            "评分孕周"
        ],
        scrollHeight:".tableShowInfo",
        scrollHeightPC:45,
        edit:false,
        geometric: 0
    });