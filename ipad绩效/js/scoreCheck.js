/**
 * Created by Ybc on 2018/8/8.
 */
$(function () {
   
    $('.y_checkButton').on('click', function () {
        //模态
        loadModel();
    })
    //模态关闭
    $('.y_model .cancel').on('click', function () {
        closeModel();
    })
     //模态提交
    $('.y_model .sure').on('click', function () {
        //提交相关 js




        closeModel();
    })
})


//关闭model
function closeModel() {
    $('.y_modelBox').animate({
        top: "-50%",
        opacity: 0
    }, 300, function () {
        $('.y_model').hide();
    });
}
//弹出model
function loadModel() {
    $('.y_model').show();
    $('.y_modelBox').animate({
        top: "50%",
        opacity: 1
    }, 300);
}