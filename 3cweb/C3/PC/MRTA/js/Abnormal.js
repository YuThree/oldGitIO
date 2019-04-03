//异常状态提醒js

var pagesize = 12;//一页显示条数
var pageindex = 1;// 当前页

$(document).ready(function () {

    if ($('#dataTable').height() < 600) {
        pagesize = 9;
        if ($('#dataTable').height() < 350) {
            pagesize = 7;
        }
    };
    //设备编号
    $('#txtloccode').LocoSelect({
        position: 'MonitorLocoAlarmList'
    });

    //设备编号控件
    $('#txtloccode').inputSelect({
        type: 'loca',
        contant: 2
    });

    //  $('#startTime').val(getNowFormatDate(true))
    // $('#endTime').val(getNowFormatDate())
    $('.ztreeInput a').css('margin-top', '5px');

    if (GetQueryString("starttime") != "" && GetQueryString("endtime") != "") {
        var Sta = new Date(GetQueryString("starttime"));//开始时间
        var End = new Date(GetQueryString("endtime"));//结束时间

        var data1 = Sta.format("yyyy-MM-dd hh:mm:ss");
        var data2 = End.format("yyyy-MM-dd hh:mm:ss");
        if (data1 != "") {
            $("#startTime").val(data1);
        };
        if (data2 != "") {
            $("#endTime").val(data2);
        };
    };
    $(".search_btn").click(function () {
        searchinfo();
    });
    searchinfo();
});


function searchinfo(starttime) {

    if (dojudge()) {

        $('#paging').paging({
            index: 1,
            url: function () {
                pageindex = $('.pageValue').val();
                var txtloccode = $('#txtloccode').val(); //车号
                var sTime = $('#startTime').val(); //开始时间
                var eTime = $('#endTime').val();  //结束时间
                var AbnormalType = $('#AbnormalType').val();//异常类型

                var _url = '/C3/PC/MDeviceStatus/RemoteHandlers/GetExceptionList.ashx?action=monitor'
                    + '&starttime=' + sTime
                    + '&endtime=' + eTime
                    + '&pageIndex=' + pageindex
                    + '&pageSize=' + pagesize
                    + '&LOCOMOTIVE_CODE=' + txtloccode
                    + '&EXP_TYPE=' + AbnormalType;

                return _url;
            },
            success: function (re) {
                if (re != null && re != '' && re != undefined) {
                    var _html = '';//内容
                    if (re.list.length < 1) {
                        var a = layer.msg('没有数据');
                    }
                    for (var i = 0; i < re.list.length; i++) {
                        _html += '<tr forid="' + re.list[i].SMS_ID + '">\
                                  <td>' + re.list[i].ROW_ + '</td>\
                                  <td>' + re.list[i].LOCOMOTIVE_CODE + '</td>\
                                  <td>' + re.list[i].CREATE_TIME + '</td>\
                                  <td>' + re.list[i].WZ + '</td>\
                                  <td>' + re.list[i].EXP_TYPE + '<a href="#" LOC_CODE="' + re.list[i].LOCOMOTIVE_CODE + '"  starttime="' + re.list[i].starttime + '" endtime="' + re.list[i].endtime + '" class="AbnormalInfo">查看详情>></a></td>\
                                  <td class="select">\
                                      <select name="" id="" class="Abnormalselect">\
                                        <option value="1"></option>\
                                        <option value="2">30分钟内不再提醒</option>\
                                        <option value="3">2小时内不再提醒</option>\
                                        <option value="4">6小时内不再提醒</option>\
                                        <option value="5">一天内不再提醒</option>\
                                     </select></td>\
                              </tr>'
                    }
                    $(".listbody").html(_html);  //生成列表

                    //字符串长度
                    indexLength();

                    //点击按钮跳页面
                    $(".AbnormalInfo").each(function () {
                        var url = '/C3/PC/MDeviceStatus/MonitorLocoStateListNew.htm?starttime=' + $(this).attr("starttime") + '&endtime=' + $(this).attr("endtime") + '&LOCOMOTIVE_CODE=' + $(this).attr("LOC_CODE");

                        $(this).click(function () {
                            window.open(url);
                        })
                    });

                } else {
                    layer.msg('暂无数据！')
                }
            }
        })
    };
};


//时间判断
function dojudge() {
    if ($('#startTime').val() != '' && $('#endTime').val() != '') {
        if ($('#startTime').val() >= $('#endTime').val()) {
            layer.msg('时间输入有误！')
            return false;
        } else {
            return true;
        }
    } else {
        return true;
    }
};

//提取字符串长度
function indexLength() {
    $('select').change(function () {
        var selectVal = $('select').find('option:selected').text();
        var _url;
        var sms_id = $(this).parent().parent().attr("forid")
        //判断select框中的值
        if (selectVal == '30分钟内不再提醒') {
            _url = '/c3/pc/mdevicestatus/remotehandlers/getexceptionlist.ashx?action=settime&sms_id=' + sms_id + '&time=30';
            querryAjax(_url);
        } else if (selectVal == '2小时内不再提醒') {
            _url = '/c3/pc/mdevicestatus/remotehandlers/getexceptionlist.ashx?action=settime&sms_id=' + sms_id + '&time=120';
            querryAjax(_url);

        } else if (selectVal == '6小时内不再提醒') {
            _url = '/c3/pc/mdevicestatus/remotehandlers/getexceptionlist.ashx?action=settime&sms_id=' + sms_id + '&time=360';
            querryAjax(_url);

        } else {
            _url = '/c3/pc/mdevicestatus/remotehandlers/getexceptionlist.ashx?action=settime&sms_id=' + sms_id + '&time=1440';
            querryAjax(_url);
        }
    })
};
//封装选择ajax
function querryAjax(url) {
    $.ajax({
        type: 'POST',
        url: url,
        ansyc: true,
        cache: false,
        success: function (result) {
            if (result === '1') {
                alert('成功')
            } else {
                alert('失败')
            }
        }
    })
};