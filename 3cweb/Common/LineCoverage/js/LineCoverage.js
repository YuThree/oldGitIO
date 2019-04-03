/*========================================================================================*
* 功能说明：线路覆盖手风琴主页面
* 注意事项：
* 作    者： ybc
* 版本日期：2017年7月25日
* 变更说明：
* 版 本 号： V1.0.0

*=======================================================================================*/


$(document).ready(function () {
    //绑定元素点击事件
    $(".menu_list ul li").click(function () {
        //判断对象是显示还是隐藏
        if ($(this).children(".div1").is(":hidden")) {
            //表示隐藏
            if (!$(this).children(".div1").is(":animated")) {
                $(this).children(".xiala").attr('src', 'img/menuUlchoose.png').css('margin-top', '29px');
                //如果当前没有进行动画，则添加新动画
                $(this).children(".div1").animate({
                    height: 'show'
                }, 500)
                    //siblings遍历div1的元素
                    .end().siblings().find(".div1").hide(500);
                $(this).siblings().children(".xiala").attr('src', 'img/menuUl.png').css('margin-top', '27px');
            }
        } else {
            //表示显示
            if (!$(this).children(".div1").is(":animated")) {
                $(this).children(".xiala").attr('src', 'img/menuUl.png').css('margin-top', '27px');
                $(this).children(".div1").animate({
                    height: 'hide'
                }, 500)
                    .end().siblings().find(".div1").hide(500);
            }
        }
    });

    //阻止事件冒泡，子元素不再继承父元素的点击事件
    $('.div1').click(function (e) {
        e.stopPropagation();
    });

    //点击子菜单为子菜单添加样式，并移除所有其他子菜单样式
    $(".menu_list ul li .div1 .zcd").click(function () {
        //设置当前菜单为选中状态的样式，并移除同类同级别的其他元素的样式
        $(this).addClass("removes").siblings().removeClass("removes");
        var ifSrc = $(this).attr('ifSrc');
        if (ifSrc == undefined || ifSrc == '') {
            ifSrc = '../视觉差/位移/index.html'
        }
        $('#frameContent').attr('src', ifSrc);
        //遍历获取所有父菜单元素
        $(".div1").each(function () {
            //判断当前的父菜单是否是隐藏状态
            if ($(this).is(":hidden")) {
                //如果是隐藏状态则移除其样式
                $(this).children(".zcd").removeClass("removes");
            }
        });
    });


    //侧边点击事件
    $('.minIcon').click(function () {
        if ($(this).css('left') == '0px') {
            $(this).animate({ 'left': $('.leftMenu').width() }); $(this).addClass('InOne').removeClass('Outone')
            $('.leftMenu').animate({ 'margin-left': 0 });
            $('.iframBox').animate({ 'width': $(window).width() - $('.leftMenu').width() })
        } else {
            $(this).animate({ 'left': 0 }); 
            $(this).addClass('Outone').removeClass('InOne')
            $('.leftMenu').animate({'margin-left':0 - $('.leftMenu').width()});
            $('.iframBox').animate({ 'width': '100%' })
        }

    })
    
});
