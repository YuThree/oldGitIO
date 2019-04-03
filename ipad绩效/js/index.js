/**
 * Created by Ybc on 2018/8/8.
 */
$(function(){
    var html='';
    for (var i = 0; i < 20; i++) {
        html += '<div>\
        <span class="y_listSpan item1">医务科</span>\
        <span class="y_listSpan item1">内一科</span>\
        <span class="y_listSpan item1">年度</span>\
        <span class="y_listSpan item1">2017年 03月</span>\
        <span class="y_listSpan item1">待检查</span>\
        <span class="y_listSpan item1p3">\
            <span class="score">评分</span>\
            <span class="check">查看</span>\
        </span>\
    </div>'
    }
    
    $('.y_listBody').html(html)
$('.score').on('click',function(){
    window.open('评分查看列表.html','_self' )
})
$('.check').on('click',function(){
    window.open('评分查看列表.html?ischeck=1','_self' )
})




})
