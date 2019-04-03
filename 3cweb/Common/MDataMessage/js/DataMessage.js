/*========================================================================================*
* 功能说明：异常数据提醒列表
* 注意事项：
* 作    者： ybc
* 版本日期：2018年2月5日
* 变更说明：
* 版 本 号： V1.0.0
*=======================================================================================*/


var pagesize = 10;//一页显示条数
var pageindex = 1;// 当前页
var layerindex = ''//layerIndex  关闭用

var locolistTime = 4;//分钟设备状态数据列表默认查询时间 范围 单位：  min
var alarmlist_time = 30;//报警列表默认查询时间 范围 单位： min
$(document).ready(function () {

    //默认时间 AbnormalDataStartTime  AbnormalDataEndTime
    $('#startTime').val(localStorage["AbnormalDataStartTime"])
    $('#endTime').val(localStorage["AbnormalDataEndTime"])

    $('#dataTable>.listdiv').height($(window).height() - $('.html_content').outerHeight() - $('.html_title').outerHeight() - 140)
    pagesize = parseInt(($('#dataTable>div').height()-70) / 37);
    //layer.alert(pagesize)
    //组织机构
    $('#org').mySelectTree({
        tag: 'ORGANIZATION_J',
        //     type: jsonUser.orgcode,
        enableFilter: true,
       
    });

    //设备编号
    $('#txtloccode').LocoSelect({
        position: 'MonitorLocoAlarmList',
    });
    //设备编号控件
    $('#txtloccode').inputSelect({
        type: 'loca',
        contant: 2
    });
    $('.select_icon').css('top', 1)



    $('#btnQuery').click(queryBtn);
 
    //追踪按钮
    $('.alarmTrackBtn').click(function () {
        if (!$(this).hasClass('active')) {
            $('.list_title span').removeClass('active');
            $(this).addClass('active');
            $('#dataTable>div').removeClass('active');
            $('.alarmTracklList').addClass('active');
        }
    })
    //设备异常按钮
    $('.abnormalBtn').click(function () {
        if (!$(this).hasClass('active')) {
            $('.list_title span').removeClass('active');
            $(this).addClass('active');
            $('#dataTable>div').removeClass('active');
            $('.abnormalList').addClass('active');
        }
    })
    queryBtn()
})








//查询按钮
function queryBtn() {

    if (dojudge()) {
        $('#paging').paging({
            index: 1,
            url: function () {
                return getUrl('loco');
            },
            success: function (re) {
                if (re != null && re != '' && re != undefined) {
                    var _html = '';//内容
                    if (re.data.length < 1) {
                        var a = layer.msg('设备异常暂无数据');
                    }
                    for (var i = 0; i < re.data.length; i++) {
                        _html += '<tr>\
                                  <td>' + re.data[i].LOCOMOTIVE + '</td>\
                                  <td>' + re.data[i].TYPE + '</td>\
                                 <td>' + re.data[i].START_TIME + '&ensp;至&ensp;' + re.data[i].END_TIME + '</td>\
                                 <td>' + re.data[i].REMARK + '</td>\
                                <th class="jump_img" BOW_TYPE="' + re.data[i].BOW_TYPE + '" loco="' + re.data[i].LOCOMOTIVE + '" st="' + re.data[i].START_TIME + '" et="' + re.data[i].END_TIME + '"><span class="alarm_list"></span><span class="playOnline_list"></span><span class="equipment_list"></span><span class="trajectory_list"></span></th>\
                                  <td>' + re.data[i].CREATE_TIME + '</td>\
                              </tr>'
                    }
                    $(".abnormalList .listbody").html(_html);
                    iconhover();//移入
                    iconclicka();//点击事件
                } else {
                    layer.msg('设备异常暂无数据！')
                }
            }
        })
        //$('#paging2').paging({
        //    index: 1,
        //    url: function () {
        //        return getUrl('alarm');
        //    },
        //    success: function (re) {
        //        if (re != null && re != '' && re != undefined) {
        //            var _html = '';//内容
        //            if (re.data.length < 1) {
        //                var a = layer.msg('报警追踪暂无数据');
        //            }
        //            for (var i = 0; i < re.data.length; i++) {
        //                _html += '<tr>\
        //                          <td>' + re.data[i].TYPE + '</td>\
        //                          <td>' + re.data[i].REPORT_TIME + '</td>\
        //                          <td>' + re.data[i].WZ + '</td>\
        //                         <td>' + re.data[i].REMARK + '</td>\
        //                        <th class="jump_img"><span class="alarm_list"></span></th>\
        //                      </tr>'
        //            }
        //            $(".alarmTracklList .listbody").html(_html);
        //            iconhover();//移入
        //            iconclickb();//点击事件
        //        } else {
        //            layer.msg('报警追踪暂无数据！')
        //        }
        //    },
        //    error: function () {

        //    }
        //})
    }
}

//url返回事件
function getUrl(type) {
    if (type == 'loco') { pageindex = $('#paging .pageValue').val(); } else { pageindex = $('#paging2 .pageValue').val(); }
        
    var loco = $('#txtloccode').val();//线路区间
    var bureau = '';//局
    if ($('#org').val() != '' && $('#org').attr('code') != 'TOPBOSS') {
        bureau = $('#org').attr('code');
    }
    var sTime = $('#startTime').val(); //开始时间
    var eTime = $('#endTime').val();  //结束时间
    var message_code = $('#message_code').val();  //类型
    var _url = '/Common/MDataMessage/RemoteHandlers/GetDataMessage.ashx?type=' + type
        + '&pageindex=' + pageindex
        + '&pagesize=' + pagesize
        + '&loco=' + loco
        + '&bureau=' + bureau
        + '&start_date=' + sTime
        + '&end_date=' + eTime
        + '&message_code=' +escape( message_code)

    return _url;
}

//hover事件
function iconhover() {
    $('.alarm_list').hover(function () {
        layerindex = tip('报警监控', this, '', 'top')
    }, function () { layer.close(layerindex) })
    $('.onepole_list').hover(function () {
        layerindex = tip('一杆一档', this, '', 'top')
    }, function () { layer.close(layerindex) })
    $('.equipment_list').hover(function () {
        layerindex = tip('设备状态', this, '', 'top')
    }, function () { layer.close(layerindex) })
    $('.trajectory_list').hover(function () {
        layerindex = tip('运行轨迹', this, '', 'top')
    }, function () { layer.close(layerindex) })
    $('.playOnline_list').hover(function () {
        layerindex = tip('车顶实时监测', this, '', 'top')
    }, function () { layer.close(layerindex) })
}
//列表图标点击事件   设备
function iconclicka() {
    $('.playOnline_list').click(function () {
        var loco = $(this).parent().attr('loco');
        var st = $(this).parent().attr('st');
        var BOW_TYPE = escape($(this).parent().attr('BOW_TYPE'));
        
        if (loco == '' || loco == undefined || loco == null || BOW_TYPE == '' || BOW_TYPE == undefined || BOW_TYPE == null) {
            layer.msg('信息不全！！！');
        } else {
            var cDate2 = new Date(st);
            var cdate2_times = parseInt(cDate2.getTime());  //得到毫秒级时间戳  13位

            layer.open({
                type: 2,
                title: '视频回放',
                shadeClose: false,
                shade: 0.8,
                skin: "MyLayerBox",
                area: ['800px', '600px'],
                content: '/C3/PC/MLiveStreaming/MonitorLocoPlayNew.htm?replay=1&wz=' + BOW_TYPE + '&btn_tc=0&loca=' + loco + '&playtime=' + cdate2_times + '&r=' + Math.random(),
                success: function (layero, index) {
                    
                }
            });

            //window.open()//跳直播
        }
    })
    $('.equipment_list').click(function () {
        var loco = $(this).parent().attr('loco');
        var st = $(this).parent().attr('st');
        var et = $(this).parent().attr('et');
        if (loco == '' || loco == undefined || loco == null || st == '' || st == undefined || st == null || et == '' || et == undefined || et == null) {
            layer.msg('信息不全！！！');
        } else {
            var cDate2 = new Date(st);
            cdate2_times = AddMinutes(cDate2,0-locolistTime).format("yyyy-MM-dd hh:mm:ss")
            var cDate1 = new Date(et);
            cdate1_times = AddMinutes(cDate1, locolistTime).format("yyyy-MM-dd hh:mm:ss")
            window.open('/C3/PC/MDeviceStatus/MonitorLocoStateListNew.htm?LOCOMOTIVE_CODE=' + loco + '&starttime=' + cdate2_times + '&endtime=' + cdate1_times)//跳设备
        }
    })
    $('.trajectory_list').click(function () {
        var loco = $(this).parent().attr('loco');
        var st = $(this).parent().attr('st').split(' ')[0]+' 00:00:00';
        var et = $(this).parent().attr('et').split(' ')[0] + ' 23:59:59';
        if (loco == '' || loco == undefined || loco == null || st == '' || st == undefined || st == null || et == '' || et == undefined || et == null) {
            layer.msg('信息不全！！！');
        } else {
            
            //window.open('/C3/PC/MDetectionOfTrace/MonitorLocGJList.htm?loca=' + loco + '&sTime=' + st + '&eTime=' + et)//跳运行轨迹
            window.open('/Common/MGIS/OrbitGIS.htm?Category_Code=DPC&deviceid=' + loco + '&startdate=' + st + '&enddate=' + et + '&jl=&LINE_CODE=&DIRECTION')//跳运行轨迹
        }
    })
    $('.alarm_list').click(function () {
        var loco = $(this).parent().attr('loco');
        var st = $(this).parent().attr('st');
        var et = $(this).parent().attr('et');
        if (loco == '' || loco == undefined || loco == null || st == '' || st == undefined || st == null || et == '' || et == undefined || et == null) {
            layer.msg('信息不全！！！');
        } else {
            var cDate2 = new Date(st);
            cdate2_times = AddMinutes(cDate2, 0 - alarmlist_time).format("yyyy-MM-dd hh:mm:ss")
            var cDate1 = new Date(et);
            cdate1_times = AddMinutes(cDate1, alarmlist_time).format("yyyy-MM-dd hh:mm:ss")
            window.open('/C3/PC/MAlarmMonitoring/MonitorLocoAlarmList.htm?category=3C&data_type=ALARM&fromDataMessage=true&loca=' + loco + '&sTime=' + cdate2_times + '&eTime=' + cdate1_times)//跳运行轨迹
        }
    })
}
//列表图标点击事件  位置
function iconclickb() {
    $('.alarm_list').click(function () {
        window.open('/C3/PC/MAlarmMonitoring/MonitorLocoAlarmList.htm?category=3C&data_type=SUPERVISE&loca=CRH380A-2924&starttime=&endtime=')//跳设备
    })
}

//时间判断
function dojudge() {
    if ($('#startTime').val() != '' && $('#endTime').val() != '') {
        if ($('#startTime').val() > $('#endTime').val()) {
            layer.msg('时间输入有误！')
            return false;
        } else {
            return true;
        }
    } else {
        return true;
    }
}
