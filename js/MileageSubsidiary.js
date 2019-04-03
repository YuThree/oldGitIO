/*========================================================================================*
* 功能说明：线路列表主页面
* 注意事项：
* 作    者： ybc
* 版本日期：2017年7月26日
* 变更说明：
* 版 本 号： V1.0.0

*=======================================================================================*/

var pageSize = 15;
var pageIndex = 1;




$(function () {
    $(window).resize(function () {
        pageSize =parseInt( ($(window).height() - $('.html_content').height() - 40 - 100) / 35);//一页条数
        console.log(pageSize)

    });
    //标记确认车
    $('.LineConfir').click(function () {
        if ($(this).hasClass('choose')) {
            $(this).removeClass('choose')
            //id 重算需要用   每一列标识符
        } else {
            $(this).addClass('choose')
        }
    })
    // $("[data-toggle='tooltip']").tooltip();
    //$('.lineInfor').hover(function () {
    //    layer.tips('默认就是向右的', this, {
    //        tips: [1, '#0FA6D8'] //还可配置颜色
    //    });
    //}, function () {
    //    layer.tips('默认就是向右的', this, {
    //        tips: [4, '#0FA6D8'] //还可配置颜色
    //    });

    //})







      //设备编号控件
      $('#car_tree').LocoSelect({
        position: 'MonitorLocoAlarmList'
    });
      $('#car_tree').inputSelect({
        type: 'loca',
        contant: 2,
    });
      $('.select_icon').css('top','1px')
    //组织机构
    $('#org_tree').mySelectTree({
        tag: 'ORGANIZATION',
        enableFilter: true,
        height: 240
    });
})