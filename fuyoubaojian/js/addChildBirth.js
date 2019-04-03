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

var num2 = 1;
//胎儿添加
$('#addChild').on("click",function(){
  var num = ~~$("#num").val();
  num += 1;
  num2 += 1;
  $("#num").val(num);
  var str = '<div class="bx">'+
                '<div class="cdct_row cdct_rows_col3 infos">'+
                    '<div class="cdct_col cdct_colLeft">'+
                        '<span class="cdct_tit">'+
                            '<div class="cdct_chk cdct_chk_suc cho">'+
                                '<input id="child'+num2+'" class="newChil" type="checkbox" value="1">'+
                                '<label for="child'+num2+'"></label>'+
                            '</div>'+
                        '</span>'+
                    '</div>'+
                    '<div class="cdct_col cdct_colRight">'+
                        '<div class="cdct_row">'+
                            '<div class="cdct_txt">'+
                                '<span class="cdct_tit">信息</span>'+
                            '</div>'+
                            '<div class="cdct_info">'+
                                '<label class="cdct_inputLable">姓名<input type="text" class="cdct_inputLine cdct_line80"></label>'+
                                '性别'+
                                '<div data-selectsimu="1" class="cdct_select">'+
                                    '<div class="selectBox">'+
                                        '<span data-selectnew="1" class="checkspan">'+
                                            '<span class="optD">'+
                                                '<span class="fontMain">性别</span>'+
                                            '</span>'+
                                            '<span class="selectDown"></span>'+
                                        '</span>'+
                                        '<div class="ulParent">'+
                                            '<ul class="hideUl" data-selectbox="1" style="display: none;">'+
                                                '<li class="hideUlLi" data-selectoption="1">健康档案1</li>'+
                                                '<li class="hideUlLi" data-selectoption="2">健康档案2</li>'+
                                                '<li class="hideUlLi" data-selectoption="3">健康档案3</li>'+
                                                '<li class="hideUlLi" data-selectoption="-1" style="display: none;">'+
                                                    '<span class="optD">'+
                                                        '<span class="fontMain">性别</span>'+
                                                    '</span>'+
                                                    '<span class="selectDown"></span>'+
                                                '</li>'+
                                            '</ul>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                                '<label class="cdct_inputLable">体重<input type="text" class="cdct_inputLine cdct_line80">kg</label>'+
                                '<label class="cdct_inputLable">身长<input type="text" class="cdct_inputLine cdct_line80">cm</label>'+
                                '阿氏评分'+
                                '<button type="button" class="cdct_btn">评分</button>'+
                            '</div>'+
                        '</div>'+
                        '<div class="cdct_row cdct_row1_col4">'+
                            '<div class="cdct_col cdct_colLeft">'+
                                '<div class="cdct_txt">'+
                                    '<span class="cdct_tit">出生缺陷诊断</span>'+
                                '</div>'+
                                '<div class="cdct_info">'+
                                    '<input name="firstname3" class="cdct_inputNone " placeholder="" required>'+
                                '</div>'+
                            '</div>'+
                            '<div class="cdct_col cdct_colRight">'+
                                '<div class="cdct_txt">'+
                                    '<span class="cdct_tit">新生儿并发症</span>'+
                                '</div>'+
                                '<div class="cdct_info">'+
                                    '<input name="firstname3" class="cdct_inputNone " placeholder="" required>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                        '<div class="cdct_row cdct_row1_col4">'+
                            '<div class="cdct_col cdct_colLeft">'+
                                '<div class="cdct_txt">'+
                                    '<span class="cdct_tit">卡介疫苗接种</span>'+
                                '</div>'+
                                '<div class="cdct_info">'+
                                    '<div class="cdct_radio cdct_radio_suc">'+
                                        '<input id="kjwjz'+num2+'" type="radio" name="kj" value="">'+
                                        '<label for="kjwjz'+num2+'">未接种</label>'+
                                    '</div>'+
                                    '<div class="cdct_radio cdct_radio_suc">'+
                                        '<input id="kjyjz'+num2+'" type="radio" name="kj" value="">'+
                                        '<label for="kjyjz'+num2+'">已接种</label>'+
                                    '</div>'+
                                    '<label class="cdct_inputLable">时间<input type="text" class="cdct_inputLine cdct_line125 datepicker" placeholder="日期"></label>'+
                                '</div>'+
                            '</div>'+
                            '<div class="cdct_col cdct_colRight">'+
                                '<div class="cdct_txt">'+
                                    '<span class="cdct_tit">乙肝疫苗接种</span>'+
                                '</div>'+
                                '<div class="cdct_info">'+
                                    '<div class="cdct_radio cdct_radio_suc">'+
                                        '<input id="ygwjz'+num2+'" type="radio" name="yg" value="">'+
                                        '<label for="ygwjz'+num2+'">未接种</label>'+
                                    '</div>'+
                                    '<div class="cdct_radio cdct_radio_suc">'+
                                        '<input id="ygyjz'+num2+'" type="radio" name="yg" value="">'+
                                        '<label for="ygyjz'+num2+'">已接种</label>'+
                                    '</div>'+
                                    '<label class="cdct_inputLable">时间<input type="text" class="cdct_inputLine cdct_line125 datepicker" placeholder="日期"></label>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                        '<div class="cdct_row">'+
                            '<div class="cdct_txt">'+
                                '<span class="cdct_tit">听力筛查</span>'+
                            '</div>'+
                            '<div class="cdct_info">'+
                                '<div class="cdct_radio cdct_radio_suc">'+
                                    '<input id="tlwz'+num2+'" type="radio" name="tl" value="">'+
                                    '<label for="tlwz'+num2+'">未做</label>'+
                                '</div>'+
                                '<div class="cdct_radio cdct_radio_suc">'+
                                    '<input id="tltg'+num2+'" type="radio" name="tl" value="">'+
                                    '<label for="tltg'+num2+'">通过</label>'+
                                '</div>'+
                                '<div class="cdct_radio cdct_radio_suc">'+
                                    '<input id="tlxfc'+num2+'" type="radio" name="tl" value="">'+
                                    '<label for="tlxfc'+num2+'">需复查</label>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                        '<div class="cdct_row">'+
                            '<div class="cdct_txt">'+
                                '<span class="cdct_tit">耳聋基因筛查</span>'+
                            '</div>'+
                            '<div class="cdct_info">'+
                                '<div class="cdct_radio cdct_radio_suc">'+
                                    '<input id="elwz'+num2+'" type="radio" name="el" value="">'+
                                    '<label for="elwz'+num2+'">未做</label>'+
                                '</div>'+
                                '<div class="cdct_radio cdct_radio_suc">'+
                                    '<input id="eltg'+num2+'" type="radio" name="el" value="">'+
                                    '<label for="eltg'+num2+'">通过</label>'+
                                '</div>'+
                                '<div class="cdct_radio cdct_radio_suc">'+
                                    '<input id="elwtg'+num2+'" type="radio" name="el" value="">'+
                                    '<label for="elwtg'+num2+'">需复查</label>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                        '<div class="cdct_row">'+
                            '<div class="cdct_txt">'+
                                '<span class="cdct_tit">视力筛查</span>'+
                            '</div>'+
                            '<div class="cdct_info">'+
                                '<div class="cdct_radio cdct_radio_suc">'+
                                    '<input id="slwz'+num2+'" type="radio" name="sl" value="">'+
                                    '<label for="slwz'+num2+'">未做</label>'+
                                '</div>'+
                                '<div class="cdct_radio cdct_radio_suc">'+
                                    '<input id="sltg'+num2+'" type="radio" name="sl" value="">'+
                                    '<label for="sltg'+num2+'">通过</label>'+
                                '</div>'+
                                '<div class="cdct_radio cdct_radio_suc">'+
                                    '<input id="slxfc'+num2+'" type="radio" name="sl" value="">'+
                                    '<label for="slxfc'+num2+'">需复查</label>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+  
                '</div>'+
            '</div>'
  $('#bo').before(str);
  var allEle=$(".cdct_select");
  for(var i = 0;i<allEle.length;i++){
      $(allEle[i]).simulationSelect({
          selectText:'{a}<span class="selectDown"></span>'
      });
  }

    $(".datepicker").on('click', function(e){
      e.stopPropagation();
      $(this).lqdatetimepicker({
          css : 'datetime-day',
          dateType:"YYYY-MM-DD",
      });
  });
})

//胎儿删除
$("#delChild").on("click",function(){
  var num = ~~$("#num").val();
  $(":checked").each(function(index,element){
    $(element).parents('.bx').remove();
    num -=1;
    $("#num").val(num)
  })
})