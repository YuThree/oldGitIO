// 下拉
var allEle=$(".cdct_select");
for(var i = 0;i<allEle.length;i++){
    $(allEle[i]).simulationSelect({
        selectText:'{a}<span class="selectDown"></span>'
    });
}

//   时间控件
$(".datepicker").on('click', function(e){
    e.stopPropagation();
    $(this).lqdatetimepicker({
        css : 'datetime-day',
        dateType:"YYYY-MM-DD",
    });
});

//    滚动条
$(".scrollJS").panel({
    iWheelStep:40,
    scrollWIng:function(){
        console.log(arguments);
    }
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

//分数计算

$("[type='checkbox']").on('click',function() {
    var Atotal = 0;
    var Btotal = 0;
    var Ctotal = 0;
    var all = 0;
    $(":checked").each(function(index,element){
      if($(element).val() == 5){
        Atotal += ~~$(element).val();
      }else if($(element).val() == 10){
        Btotal += ~~$(element).val();
      }else if($(element).val() == 20){
        Ctotal += ~~$(element).val();
      }else {
        console.log('error');
      }
      all = ~~Atotal + Btotal + Ctotal;
      $("#lvA").val(Atotal);
      $("#lvB").val(Btotal);
      $("#lvC").val(Ctotal);
      $("#toP").val(all)
    })
});


// 侧边栏表格
   var dataSet = [
     [ "01", "2018-03-07", "高危筛查", "xixii"],
     [ "01", "2018-03-07", "高危筛查", "xixii"],
     [ "01", "2018-03-07", "高危筛查", "xixii"],
     [ "01", "2018-03-07", "高危筛查", "xixii"],
     [ "01", "2018-03-07", "高危筛查", "xixii"],
     [ "01", "2018-03-07", "高危筛查", "xixii"],
     [ "01", "2018-03-07", "高危筛查", "xixii"],
     [ "01", "2018-03-07", "高危筛查", "xixii"],
     [ "01", "2018-03-07", "高危筛查", "xixii"],
     [ "01", "2018-03-07", "高危筛查", "xixii"],
     [ "01", "2018-03-07", "高危筛查", "xixii"],
     [ "01", "2018-03-07", "高危筛查", "xixii"],
     [ "01", "2018-03-07", "高危筛查", "xixii"],
     [ "01", "2018-03-07", "高危筛查", "xixii"],
     [ "01", "2018-03-07", "高危筛查", "xixii"],
     [ "01", "2018-03-07", "高危筛查", "xixii"],
     [ "01", "2018-03-07", "高危筛查", "xixii"],
     [ "01", "2018-03-07", "高危筛查", "xixii"],
       
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
        edit:false
   });

   /*为表格添加横向滚动条*/
   $(".tablMainOne").panel({
       iWheelStep:32,
       vScroll:false,
       scrollWResize:true
   });