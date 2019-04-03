/*========================================================================================*
* ����˵����ʹ�÷���Ч��
* ��    �ߣ� zzj
* �汾���ڣ�2014.12.26
* ˵����

���˵�div1 class����flip_zzj 
�Ӳ˵�div2��ID Ϊ div1��ID+"2";
�رհ�ť��ID Ϊ div1��ID+"_return" ��class Ϊ"a_return";
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
        str[k] = parseInt(rgb.split(',')[k]).toString(16); //str ���鱣���ֺ������ 
    }
    return '#' + str[0] + str[1] + str[2];
}

