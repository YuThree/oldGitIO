/*========================================================================================*
* 功能说明：异常数据提醒数子 轮训
* 注意事项：
* 作    者： ybc
* 版本日期：2018年2月5日
* 变更说明：
* 版 本 号： V1.0.0
*=======================================================================================*/


$(document).ready(function () {


    if (FunEnable('Fun_AbnormalData') == "True") {//异常提醒按钮开关

        var laststime = localStorage["AbnormalDataStartTime"];//获取开始时间缓存
        if (laststime == null || laststime == "" || laststime == undefined) {//默认值设置
            localStorage["AbnormalDataStartTime"] = DateAddORSub('h', '-', parseInt(getConfig('DataMessageDefaultTime'))).format("yyyy-MM-dd hh:mm:ss");
            localStorage["AbnormalDataEndTime"] = datehhssNowStr();
        }
        if (window.location.href.indexOf('MonitorAlarm3CForm4.htm') != -1) {//详情页
            $("#j-alarm-datamessage").css({ 'display': 'inline-block' }).click(function () {
                $('#datamessage').hide();
                setTimeout(function () { localStorage["AbnormalDataStartTime"] = localStorage["AbnormalDataEndTime"] }, 300)
                window.open('/Common/MDataMessage/DataMessage.html')
            })
        } else {
            $('#datamessage').parent().show().click(function () {
                $('#datamessage').hide();
                setTimeout(function () { localStorage["AbnormalDataStartTime"] = localStorage["AbnormalDataEndTime"] }, 300)
                window.open('/Common/MDataMessage/DataMessage.html')
            })
        }
        startQueryAbnormalData();//默认查询一次
        setInterval(startQueryAbnormalData, parseInt(getConfig('DataMessagePollingTime')));//开始轮训
    }


})

//数量查询
function startQueryAbnormalData() {
    var endtime = datehhssNowStr();
    var _url = '/Common/MDataMessage/RemoteHandlers/GetDataMessage.ashx?type=count&start_date=' + localStorage["AbnormalDataStartTime"] + '&end_date=' + endtime + '&loco=&bureau='
    $.ajax({
        type: 'POST',
        url: _url,
        async: true,
        cache: false,
        success: function (re) {
            console.log(re.data);
            if (re.data != '') {
                localStorage["AbnormalDataEndTime"] = endtime;
                if (parseInt(re.data) < 100) {
                    if (re.data == '0') {
                        $('#datamessage').hide();
                    } else {
                        $('#datamessage').html(re.data).show();
                    }
                } else {
                    $('#datamessage').html('···')
                }
            }

        }, error: function () {
            $('#datamessage').hide();
            console.log('轮训异常统计条数出错！')
            //localStorage["AbnormalDataStartTime"] = localStorage["AbnormalDataEndTime"]
            //localStorage["AbnormalDataEndTime"] = endtime;
            //$('#datamessage').html('···')
        }
    })
}

