/*========================================================================================*
* 功能说明：使用翻牌效果
* 作    者： zzj
* 版本日期：2014.12.26
* 说明：

主菜单div1 class加上flip_zzj 
子菜单div2的ID 为 div1的ID+"2";
关闭按钮的ID 为 div1的ID+"_return" ，class 为"a_return";
*=======================================================================================*/

$(function () {

    $('.flip_zzj').click(function () {


        var c = $(this).css('background-color');

        var str = changeColor(c);

        var id = $(this).attr('id');
        var id2 = id + "2";

        $('#' + id + ",#" + id2).flip({
            direction: 'rl',
            color: str,
            speed: 200,
            onEnd: showMu(id, id2)
        });

    })

    $('.a_return').click(function () {
        var id = $(this).attr('id').replace('_return', '');
        var id2 = id + "2";

        var c = $('#' + id).css('background-color');

        var str = changeColor(c);

        $('#' + id + ",#" + id2).flip({
            direction: 'lr',
            color: str,
            speed: 200,
            onEnd: showMu(id, id2)
        });
    })




})


function showMu(id, id2) {

    var xt = document.getElementById(id);
    var mu = document.getElementById(id2);
  
    if (mu.style.display != '') {
        mu.style.display = '';
    } else { mu.style.display = 'none' }
    if (xt.style.display != '') {
        xt.style.display = '';
    } else { xt.style.display = 'none' }
}

function changeColor(c) {

    var str = [];
    var rgb = c.split('(')[1];
    for (var k = 0; k < 3; k++) {
        str[k] = parseInt(rgb.split(',')[k]).toString(16); //str 数组保存拆分后的数据 
    }
    return '#' + str[0] + str[1] + str[2];
}

