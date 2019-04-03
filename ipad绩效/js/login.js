/**
 * Created by Ybc on 2018/8/8.
 */
$(function(){
    //输入框输入事件 显示删除按钮
    $('input').on("input propertychange",function(){
        $(this).parent().parent().find('.y_removeValue').show();
    })
    //删除按钮 事件 
    $('.y_removeValue').on('click',function(){
        $(this).hide().siblings('.y_press').find('input').val('')
    })
})