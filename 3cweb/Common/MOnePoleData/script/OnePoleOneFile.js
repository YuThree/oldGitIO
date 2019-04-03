/*========================================================================================*
* 功能说明：一杆一档详情页
* 注意事项：
* 作    者： ybc
* 版本日期：2017年3月20日
* 变更说明：
* 版 本 号： V1.0.0

*=======================================================================================*/
//var queryIP = getConfig('HardDiskIMAHelpURL')//请求链接地址
var queryIP_IRV = getConfig('HardDiskIRVHelpURL')//请求链接地址red
var queryIP_OV = getConfig('HardDiskOVHelpURL')//请求链接地址ov
var queryIP_VI = getConfig('HardDiskVIHelpURL')//请求链接地址vi
//var queryIP_AUX = getConfig('HardDiskAUXHelpURL')//请求链接地址Fz
var sessionID = new Date().getTime() + 's' + Math.random();//当前时间戳
var OnClickNumber = 1;//地图点击次数
var map;
var pageindex = 1
var pagesize = 5;
var poleNumber = '';
var poleCode = '';
var queryTime_A = 0;//请求次数
var queryTime_B = 0;//请求次数
var playIndex = 0;//播放索引
var playIndex_B = 0;//播放索引右
var interval_A = '';//报警播放定时器左
var interval_B = '';//报警播放定时器右
var speed_A = 500;//报警播放速度
var full_json = ''//全局json左
var full_json_B = ''//全局json右
var is_play_A = true;//播放暂停
var is_play_B = true;//播放暂停右
var CompleteImgNum_A = 3;//图片加载左
var CompleteImgNum_B = 3;//图片加载右
var RED_A = true;
var HD_A = true;
var OVER_A = true;
var RED_B = true;
var HD_B = true;
var OVER_B = true;
var time_speed = 10;
$(function () {
    pagesize = parseInt($('.table_body_out').height() / 30);
    $("#query_listA,#query_listB").validationEngine({
        validationEventTriggers: "blur",  //触发的事件  "keyup blur",   
        inlineValidation: true, //是否即时验证，false为提交表单时验证,默认true   
        success: false, //为true时即使有不符合的也提交表单,false表示只有全部通过验证了才能提交表单,默认false
        promptPosition: "topLeft" //提示位置，topLeft, topRight, bottomLeft,  centerRight, bottomRight
        //        validateNonVisibleFields: true
    });
    getpoleInfo()//初始信息获取
    var lastZt = getQueryStringOne('zt')//来源处状态值
    if (lastZt != '' && lastZt != undefined && lastZt != 'undefined') {
        var lastZtArry = lastZt.split(',');
        for (var s = 0; s < lastZtArry.length; s++) {
            $('#ddlzt > option[value="' + lastZtArry[s] + '"]').attr('selected', true);
        }
    }
    $("#ddlzt").multiselect({
        noneSelectedText: "全部",
        checkAllText: "全选",
        uncheckAllText: '全不选',
        selectedList: 6,
        height: 200
    });

    var jbJson = GetSeverityJson();//获取级别
    var jsHtml = "";
    for (var i = 0; i < jbJson.length; i++) {
        jsHtml += "<option value='" + jbJson[i].code + "'>" + jbJson[i].name + "</option>";
    }
    $("#jb").html(jsHtml);
    var lastJb = getQueryStringOne('jb')//来源处状态值
    if (lastJb != '' && lastJb != undefined && lastJb != 'undefined') {
        var lastJbArry = lastJb.split(',');
        for (var s = 0; s < lastJbArry.length; s++) {
            $('#jb > option[value="' + lastJbArry[s] + '"]').attr('selected', true);
        }
    }
    $("#jb").multiselect({
        noneSelectedText: "全部",
        checkAllText: "全选",
        uncheckAllText: '全不选',
        height: 100,
        selectedList: 3
    });

    //默认时间
    var lastStime = getQueryStringOne('stime');
    var lastEtime = getQueryStringOne('etime');
    if (lastStime != '' && lastStime != undefined && lastStime != 'undefined') {
        $('#startdate').val(lastStime)
        $('#enddate').val(lastEtime)
    } else {
        chooseTime('left', 89)
    }
    chooseTime('right', 181)
    //时间下拉框内部点击切换颜色
    $('#hideUL li,#hideUL2 li').click(function () {
        $(this).siblings().css('color', 'black')
        $(this).css('color', '#488CB4')
        //doQuery()
    })

    //时间下拉框点击
    $('.pic_9').toggle(function () {
        $('#hideUL').css({ left: $('.pic_9').offset().left - $(this).outerWidth() / 2 + "px", top: $('.pic_9').offset().top + $('.pic_9').outerHeight() + 5 + "px" }).show()
        $(this).addClass('pic_8')
    }, function () { $('#hideUL').hide(); $(this).removeClass('pic_8') })
    $('.pic_10').toggle(function () {
        $('#hideUL2').css({ left: $('.pic_10').offset().left - $(this).outerWidth() / 2 + "px", top: $('.pic_10').offset().top + $('.pic_10').outerHeight() + 5 + "px" }).show()
        $(this).addClass('pic_8')
    }, function () { $('#hideUL2').hide(); $(this).removeClass('pic_8') })
    //点击任意地方关闭时间下拉框
    $('body').bind("mousedown", function (e) {
        if ($(e.target).parents("#hideUL").length === 0 && $('#hideUL').css('display') != 'none' && !$(e.target).hasClass('pic_9')) {
            $('.pic_9').click();
        }
        if ($(e.target).parents("#hideUL2").length === 0 && $('#hideUL2').css('display') != 'none' && !$(e.target).hasClass('pic_10')) {
            $('.pic_10').click();
        }
        if ($(e.target).hasClass('showMfc3')) {
            window.open('/C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=' + $(e.target).attr('code') + '&haveNextAlarm=no')
        }
    });


    //点击时间框页面滚动条问题
    $('.Wdate').click(function () {
        setTimeout(function () { $('html').scrollTop(0) }, 1)
    })

    $('#A_btnQuery').click(function () { queryTime_A = 0; queryBtn_A() })
    $('#L_btnQuery').click(function () { queryTime_B = 0; queryBtn_B() })
    $('#ToTop').click(function () {
        $('html').animate({ scrollTop: 0 }, 200)
    })
    //setTimeout(function () { Map('aaaaa', 121.316196, 31.196870) },1000)
    var sT = $('.box-table-info').offset().top//获取对比title的高
    $(window).scroll(function () {
        //console.log(sT)
        if ($('html').scrollTop() >= sT) {
            //$('.box-table-info').css('position', 'relative').css('top', $('body').scrollTop() - sT).css('width', $('.box-table-img table').width()).css('z-index', '10')
            $('.box-table-info').css('position', 'fixed').css('top', 0).css('width', $('.box-table-img table').width()).css('z-index', '10')
            $('.box-table-img').css('padding-top', $('.box-table-info').height())
        } else {
            $('.box-table-info').css('position', 'static').css('top', 0)
            $('.box-table-img').css('padding-top', 0)
        }
        if ($('html').scrollTop() > 0) {
            $('#ToTop').show()
        } else {
            $('#ToTop').hide()

        }
    })

    defalt_click()
})

//默认点击事件
function defalt_click() {
    //显示隐藏更多表格
    $('.imgToggle').toggle(function () {
        $(this).removeClass('__show')
        $('.hide_list').show();
    }, function () {
        $(this).addClass('__show')
        $('.hide_list').hide();
    })


    A_player_click()
    B_player_click()
}

Array.prototype.max = function () {
    var max = this[0];
    var len = this.length;
    for (var i = 1; i < len; i++) {
        if (this[i] > max) {
            max = this[i];
        }
    }
    return max;
}
//获取url参数
function getQueryStringOne(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    //var r = window.location.href.substr(1).match(reg);
    if (window.location.href.split('?').length > 1) {
        var r = window.location.href.split('?')[1].match(reg);
    } else {
        layer.alert('url地址异常！')
    }
    if (r != null) return unescape(r[2]); return null;
};
//初始杆请求
function getpoleInfo() {
    //var url = "/Common/MOnePoleData/RemoteHandlers/MyDeviceList.ashx?action=getPole&ID=" + GetQueryString("id");
    console.log(getQueryStringOne('device_id'))
    //layer.msg(getQueryStringOne('device_id'))
    var url = "/Common/MOnePoleData/RemoteHandlers/MyDeviceList.ashx?action=getPole&polecode=" + escape(getQueryStringOne("device_id"));
    $.ajax({
        type: "post",
        url: url,
        async: true,
        cache: false,
        success: function (re) {
            poleNumber = re.POLE_NO;
            poleCode = re.POLE_CODE;
            $('#data_pole_number').html(re.POLE_NO).attr('code', escape(re.POLE_CODE));
            $('#data_pole_ico').html('&ensp;<img src="img/OnePoleOneFile_ditu.png" alt="地图" title="显示地图">');
            try {
                if (re.POLESTRCT.length > 0) {
                    var hml = '';
                    var namearry = [];
                    for (var i = 0; i < re.POLESTRCT.length; i++) {
                        namearry.push(re.POLESTRCT[i].POLE_STRCT_TYPE.length);
                        hml += "<span class='tooilp_name'>" + re.POLESTRCT[i].POLE_STRCT_TYPE + "</span><span class='tooilp_value'>：" + re.POLESTRCT[i].POLE_STRCT_VALUE + "</span><br>"
                    }
                    $("#poleDetail").attr("data-original-title", hml).show();
                    $('#poleDetail').tooltip({ "placement": "bottom", delay: { show: 0, hide: 1 }, });
                    $('#poleDetail').hover(function () {
                        $('.tooltip .tooilp_name').css('width', namearry.max() * 14);
                    })
                } else {
                    $("#poleDetail").hide();
                }
            } catch (e) {
                $("#poleDetail").hide();
                console.log('json  POLESTRCT  字段无')
            }

            $('#data_line_name').html(re.LINE_NAME).attr('code', re.LINE_CODE);
            $('#data_direction').html(re.POLE_DIRECTION);
            $('#data_position_name').html(re.POSITION_NAME).attr('code', re.POSITION_CODE);
            $('#data_bridge').html(re.BRG_TUN_NAME).attr('code', re.BRG_TUN_CODE);
            $('#data_km_mark').html(re.KMSTANDARD).attr('code', re.KMSTANDARD_n);
            //地图点击事件
            $('img[alt="地图"]').click(function () {
                $('#box_gis').modal()
                setTimeout(function () { Map(re.LINE_NAME + '&ensp;' + re.POSITION_NAME + '&ensp;' + re.BRG_TUN_NAME + '&ensp;' + re.POLE_DIRECTION + '&ensp;' + re.KMSTANDARD + '&ensp;' + (re.POLE_NO == '' ? '' : (re.POLE_NO + '支柱')), re.GIS_LON, re.GIS_LAT) }, 400)
            })

            queryBtn_A()
            queryBtn_B()

            $('#less_pole').click(function () {
                changePoleNumber('previous', $('#data_pole_number').attr('code'));
            })
            $('#next_pole').click(function () {
                changePoleNumber('next', $('#data_pole_number').attr('code'));
            })




        }
    });
};

//上下杆切换
function changePoleNumber(type, code) {
    //window.location.href = '/common/monepoledata/remotehandlers/mydevicelist.ashx?action=NextPole&tag=' + type + '&polecode=' + code
    var line_code = $('#data_line_name').attr('code');
    var direction = $('#data_direction').html();
    if (direction == '') {
        direction = '-1';
    }
    var url = '/common/monepoledata/remotehandlers/mydevicelist.ashx?action=NextPole&tag=' + type + '&polecode=' + code + '&line_code=' + line_code + '&direction=' + direction
    $.ajax({
        type: "POST",
        url: url,
        async: true,
        cache: false,
        success: function (result) {
            if (result.re != '' && result.re != undefined) {
                window.location.href = ' /Common/MOnePoleData/oneChockoneGAN.html?device_id=' + result.re
            } else {
                if (type == 'previous') {
                    layer.msg('没有上一根杆了！')
                } else {
                    layer.msg('没有下一根杆了！')
                }
            }

        },
        error: function () {
            layer.msg('请求错误！')
        }

    })

    //window.location.href =' /Common/MOnePoleData/OnePoleOneFile.html?device_id='
}




//查询按钮 A  B
function queryBtn_A() {

    if (dojudge_A() && $('#query_listA').validationEngine("validate")) {

        $('#paging_A').paging({
            index: 1,
            size: 'small',
            url: function () {
                pageindex = $('#paging_A .pageValue').val();
                var LPB_code = '';//线路区间
                var LPB_type = '';//线路级别
                if ($('#line_tree').attr('code') != undefined) {
                    LPB_code = $('#line_tree').attr('code')
                }
                if ($('#line_tree').attr('treetype') != undefined) {
                    LPB_type = $('#line_tree').attr('treetype')
                }
                var obj = document.getElementById('ddlzt');
                var zt = getSelectedItem(obj);
                var jbobj = document.getElementById('jb');
                var jb = getSelectedItem(jbobj);
                if (getConfig('debug') != '1' && jb == '') {
                    jb = '一类,二类';
                }
                var sTime = $('#startdate').val() + ' 00:00:00'; //开始时间
                var eTime = $('#enddate').val() + ' 23:59:59';  //结束时间


                var direction = '0'//行别
                if ($('#data_direction').html() != '') {
                    direction = $('#data_direction').html()
                }
                var locationName = '';
                var locationCode = '';
                var locationType = '';

                locationName = $('#data_line_name').html()
                locationCode = $('#data_line_name').attr('code')
                locationType = 'LINE'
                if ($('#data_position_name').html() != '') {
                    locationName = $('#data_position_name').html()
                    locationCode = $('#data_position_name').attr('code')
                    locationType = 'POSITION'
                }
                if ($('#data_bridge').html() != '') {
                    locationName = $('#data_bridge').html()
                    locationCode = $('#data_bridge').attr('code')
                    locationType = 'BRIDGETUNE'
                }

                //var kmMark = parseInt($('#data_km_mark').html().split('+')[0].split('K')[1]) * 1000 + parseInt($('#data_km_mark').html().split('+')[1]); //开始
                //if (kmMark == 0) {
                var kmMark = '';
                //};
                var url = "/C3/PC/MAlarmMonitoring/RemoteHandlers/GetMonitorLocoAlarmList.ashx?action=list"
                    + "&zt=" + escape(zt)
                    + "&jb=" + escape(jb)
                    + "&startkm=" + escape(kmMark)
                    + "&endkm=" + escape(kmMark)
                    + '&xb=' + escape(direction)
                    + '&locationCode=' + escape(locationCode)
                    + '&locationName=' + escape(locationName)
                    + '&locationType=' + escape(locationType)
                    + "&startdate=" + escape(sTime)
                    + "&enddate=" + escape(eTime)
                    + "&txtpole=" + escape(poleNumber)
                    + "&device_id=" + escape(poleCode)
                    + "&page=" + pageindex
                    + "&rp=" + pagesize;
                return url;
            },
            success: function (re) {
                if (re != null && re != '' && re != undefined) {
                    var _html = '';//内容
                    if (re.rows.length < 1) {
                        //var a = layer.msg('暂无报警');
                        $(".left_list .table_body_out").css({ 'background': 'url(img_detail/no1.png) no-repeat 50% 50%', "background-size": "25%" })
                        $('#paging_A').css('opacity', 0)
                    } else {
                        $(".left_list .table_body_out").css({ 'background': '' })
                        $('#paging_A').css('opacity', 1)

                    }
                    for (var i = 0; i < re.rows.length; i++) {
                        json = re.rows
                        var chooseclassA = '';//初始展示区背景展示 匹配上一个背景是哪一个区域
                        var chooseclassB = '';
                        try {
                            if (json[i].ID == full_json.ID) {
                                chooseclassA = 'chooseOne';
                            }
                            if (json[i].ID == full_json_B.ID) {
                                chooseclassB = 'chooseOne';
                                }
                        } catch (e) { }
                        _html += '  <tr>\
                                <td class="col100">' + json[i].NOWDATE + '</td>\
                                <td class="col100">' + json[i].LOCOMOTIVE_CODE + '</td>\
                                <td class="col100">' + json[i].JB + '</td>\
                                <td class="col100">' + json[i].QXZT + '</td>\
                                <td class="col200" code="' + json[i].ID + '">\
                                    <span class="s1 ' + chooseclassA + '">1</span>\
                                    <span class="s2 ' + chooseclassB + '">2</span>\
                                </td>\
                            </tr>'
                    }
                    _html = _html.replace(/<font[^>]*>/g, '').replace(/<\/font>/g, '')//去除json中的颜色代码
                    $("#alarm_list").html(_html);
                    $('.table_head').css('width', $('.table_body').width())//表格对齐
                    if (queryTime_A == 0) {
                        queryTime_A++;
                        $('#paging_A .pageWrap').css('margin-left', ($('#paging_A').width() - $('#paging_A .pageWrap').width() - 30) / 2)
                    }
                    $('.page_input').css('margin-bottom', '0')

                    CompareOneTwo();//对比按钮
                    if (full_json == '') {
                        $('.left_list .s1:eq(0)').click()
                    }

                } else {
                    //layer.msg('暂无报警！')
                    $('#paging_A').css('opacity', 0)

                    $(".left_list .table_body_out").css({ 'background': 'url(img_detail/no1.png) no-repeat 50% 50%', "background-size": "25%" })


                }


            },
            error: function () {
                $('#paging_A').css('opacity', 0)
                $(".left_list .table_body_out").css({ 'background': 'url(img_detail/no1.png) no-repeat 50% 50%', "background-size": "25%" })
            }
        })
    }
}
function queryBtn_B() {
    if (dojudge_B() && $('#query_listB').validationEngine("validate")) {

        $('#paging_B').paging({
            index: 1,
            size: 'small',
            url: function () {
                pageindex = $('#paging_B .pageValue').val();
                var pole_code = $('#data_pole_number').attr('code')
                var sTime = $('#startdate_line').val(); //开始时间
                var eTime = $('#enddate_line').val();  //结束时间


                var direction = '0'//行别
                if ($('#data_direction').html() != '') {
                    direction = $('#data_direction').html()
                }
                var line_code = '';
                var position_code = '';
                var brg_tun_code = '';

                brg_tun_code = $('#data_bridge').attr('code') == undefined ? '' : $('#data_bridge').attr('code')
                position_code = $('#data_position_name').attr('code') == undefined ? '' : $('#data_position_name').attr('code')
                line_code = $('#data_line_name').attr('code') == undefined ? '' : $('#data_line_name').attr('code')


                var kmMark = parseInt($('#data_km_mark').html().split('+')[0].split('K')[1]) * 1000 + parseInt($('#data_km_mark').html().split('+')[1]); //开始
                if (kmMark == 0) {
                    kmMark = '';
                };
                var url = "/Common/MOnePoleData/RemoteHandlers/HardDiskData.ashx?action=list"
                    + "&pole_code=" + pole_code
                    + "&line_code=" + line_code
                    + "&pole_direction=" + direction
                    + "&position_code=" + position_code
                    + '&brg_tun_code=' + brg_tun_code
                    + '&km_mark=' + kmMark
                    + '&start_time=' + sTime
                    + '&end_time=' + eTime
                    + "&pageindex=" + pageindex
                    + "&pagesize=" + pagesize;
                return url;
            },
            success: function (re) {
                if (re != null && re != '' && re != undefined) {
                    var _html = '';//内容
                    if (re.data.length < 1) {
                        $('#paging_B').css('opacity', 0)
                        $(".right_list .table_body_out").css({ 'background': 'url(img_detail/no1.png) no-repeat 50% 50%', "background-size": "25%" })
                    } else {
                        $(".right_list .table_body_out").css({ 'background': '' })
                        $('#paging_B').css('opacity', 1)

                    }
                    for (var i = 0; i < re.data.length; i++) {
                        json = re.data
                        var chooseclassA = '';//初始展示区背景展示 匹配上一个背景是哪一个区域
                        var chooseclassB = '';
                        try {
                            if (json[i].LOCOMOTIVE_CODE == full_json.LOCOMOTIVE_CODE && json[i].MIN_TIMESTAMP_IRV == full_json.MIN_TIMESTAMP_IRV && json[i].MAX_TIMESTAMP_IRV == full_json.MAX_TIMESTAMP_IRV) {
                                chooseclassA = 'chooseOne';
                            }
                            if (json[i].LOCOMOTIVE_CODE == full_json_B.LOCOMOTIVE_CODE && json[i].MIN_TIMESTAMP_IRV == full_json_B.MIN_TIMESTAMP_IRV && json[i].MAX_TIMESTAMP_IRV == full_json_B.MAX_TIMESTAMP_IRV) {
                                chooseclassB = 'chooseOne';
                            }
                        } catch (e) { }
                        _html += '  <tr>\
                                <td class="col300">' + json[i].DATETIME + '</td>\
                                <td class="col300 LOCOMOTIVE_CODE" code="' + json[i].LOCOMOTIVE_CODE + '">' + json[i].LOCOMOTIVE_CODE + '</td>\
                                <td class="col200"  ST="' + json[i].MIN_TIMESTAMP_IRV + '" ET="' + json[i].MAX_TIMESTAMP_IRV + '">\
                                    <span class="s1 ' + chooseclassA + '">1</span>\
                                    <span class="s2 ' + chooseclassB + '">2</span>\
                                </td>\
                            </tr>'
                    }
                    $("#inspection_list").html(_html);
                    $('.table_head').css('width', $('.table_body').width())//表格对齐
                    if (queryTime_B == 0) {
                        queryTime_B++;
                        $('#paging_B .pageWrap').css('margin-left', ($('#paging_B').width() - $('#paging_B .pageWrap').width() - 30) / 2)
                    }
                    $('.page_input').css('margin-bottom', '0')
                    CompareOneTwo();//对比按钮
                    if (full_json_B == '') {
                        $('.right_list .s2:eq(0)').click()
                    }

                } else {
                    $('#paging_B').css('opacity', 0)
                    $(".right_list .table_body_out").css({ 'background': 'url(img_detail/no1.png) no-repeat 50% 50%', "background-size": "25%" })

                }


            },
            error: function () {
                $(".right_list .table_body_out").css({ 'background': 'url(img_detail/no1.png) no-repeat 50% 50%', "background-size": "25%" });
                //$('#paging_B').css();
            }
        })
    }


}

//播放请求
function queryPlyer_A(id) {
    var url = '/C3/PC/MAlarmMonitoring/RemoteHandlers/GetMonitorAlarmC3Form.ashx?type=total&alarmid=' + id
    $.ajax({
        type: "POST",
        url: url,
        async: true,
        cache: false,
        success: function (result) {
            if (result != '' && result != undefined) {
                json = eval('(' + result + ')');
                if (json)
                    full_json = json;
                if (full_json_B != '' && full_json != '') {
                    if (full_json.ID == full_json_B.ID) {
                        full_json_B = '';

                        $('.j-history-note-2,.j-history-infrared,.j-history-visible-light,.j-history-panorama').click()
                        clearCompearPlace();
                    }
                }
                clearCompearPlace('A');

                is_play_A = true;
                playIndex = 0;
                //播放
                play_A()
                loadSlider()

                //曲线
                createLineChart(document.getElementById('latest-temperature'), json, 'A')
                createLC_LineChart(document.getElementById('latest-pull-out'), json, 'A')
                createDG_LineChart(document.getElementById('latest-high-conductivity'), json, 'A')

            }
        }
    });
}
function queryPlyer_B(id) {
    var url = '/C3/PC/MAlarmMonitoring/RemoteHandlers/GetMonitorAlarmC3Form.ashx?type=total&alarmid=' + id
    $.ajax({
        type: "POST",
        url: url,
        async: true,
        cache: false,
        success: function (result) {
            if (result != '' && result != undefined) {
                json = eval('(' + result + ')');
                if (json)
                    full_json_B = json;
                if (full_json_B != '' && full_json != '') {
                    if (full_json.ID == full_json_B.ID) {
                        full_json = '';
                        //$('.j-latest-note-2,.j-latest-infrared,.j-latest-visible-light,.j-latest-panorama').click()


                        clearCompearPlace()

                    }
                }
                clearCompearPlace('B');

                is_play_B = true;
                playIndex_B = 0

                //播放
                play_B()
                loadSlider_B()

                //曲线
                createLineChart(document.getElementById('history-temperature'), json, 'B')
                createLC_LineChart(document.getElementById('history-pull-out'), json, 'B')
                createDG_LineChart(document.getElementById('history-high-conductivity'), json, 'B')
            }
        }
    });
}
function queryPlyer_A_lineInspection(ST, ET, locomotive_code, bow_position_code, bow_position_name) {
    var pole_code = $('#data_pole_number').attr('code')
    var direction = '0'//行别
    if ($('#data_direction').html() != '') {
        direction = $('#data_direction').html()
    }
    var line_code = '';
    var position_code = '';
    var brg_tun_code = '';

    brg_tun_code = $('#data_bridge').attr('code') == undefined ? '' : $('#data_bridge').attr('code')
    position_code = $('#data_position_name').attr('code') == undefined ? '' : $('#data_position_name').attr('code')
    line_code = $('#data_line_name').attr('code') == undefined ? '' : $('#data_line_name').attr('code')

    var locationName = $('#data_position_name').html()
    var locationCode = $('#data_position_name').attr('code')
    var kmMark = parseInt($('#data_km_mark').html().split('+')[0].split('K')[1]) * 1000 + parseInt($('#data_km_mark').html().split('+')[1]); //开始
    if (kmMark == 0) {
        kmMark = '';
    };
    var url = '/Common/MOnePoleData/RemoteHandlers/HardDiskData.ashx?action=detail'
            + '&pole_code=' + pole_code
            + '&line_code=' + line_code
            + '&pole_direction=' + direction
            + '&position_code=' + position_code
            + '&km_mark=' + kmMark
            + '&start_timestamp=' + ST
            + '&end_timestamp=' + ET
            + '&locomotive_code=' + locomotive_code
    //+ '&bow_position_code=' + (bow_position_code == undefined ? '' : bow_position_code)
    $.ajax({
        type: "POST",
        url: url,
        async: true,
        cache: false,
        success: function (result) {
            if (result != '' && result != undefined && !isEmptyObject(result)) {
                json = result;
                var bowJson;
                if (bow_position_code == undefined) {
                    for (var i = 0; i < json.content.length; i++) {
                        if (isEmptyObject(json.content[i])) {
                            continue;
                        } else {
                            bowJson = json.content[i];
                            continue;

                        }
                    }
                } else {
                    for (var i = 0; i < json.content.length; i++) {
                        if (isEmptyObject(json.content[i])) {
                            continue;
                        } else if (json.content[i].bow_position_name == bow_position_name) {
                            bowJson = json.content[i];
                            continue;
                        }
                    }
                }
                if (bowJson) {
                    full_json = bowJson;
                } else {
                    full_json = '';
                }
                if (full_json_B != '' && full_json != '') {
                    if (full_json.ID == full_json_B.ID && full_json.start_time == full_json_B.start_time) {
                        full_json_B = '';

                        $('.j-history-note-2,.j-history-infrared,.j-history-visible-light,.j-history-panorama').click()
                        clearCompearPlace();
                    }
                }
                clearCompearPlace('A');
                if (bowJson == '' || bowJson == undefined) {
                    layer.msg('该弓暂无数据！')
                    clearCompearPlace('A');
                    return false;
                }
                is_play_A = true;
                playIndex = 0;
                //播放
                play_A()
                //加载车厢号列表。
                Getrelations(json, bowJson, $('#chooseCar'), 'A', ST, ET, locomotive_code, bow_position_name);
                //silde加载
                loadSlider_A_inspection()

                //曲线
                createLineChart(document.getElementById('latest-temperature'), bowJson, 'A', 'LineInsPection')
                createLC_LineChart(document.getElementById('latest-pull-out'), bowJson, 'A')
                createDG_LineChart(document.getElementById('latest-high-conductivity'), bowJson, 'A')

            } else {
                full_json = '';
                layer.msg('1号展示区暂无可展示数据！')
                clearCompearPlace('A');

            }
        },
        error: function () {
            full_json = '';
            layer.msg('1号展示区请求出错！')
            clearCompearPlace('A');

        }

    });
}
function queryPlyer_B_lineInspection(ST, ET, locomotive_code, bow_position_code, bow_position_name) {

    var pole_code = $('#data_pole_number').attr('code')
    var direction = '0'//行别
    if ($('#data_direction').html() != '') {
        direction = $('#data_direction').html()
    }
    var line_code = '';
    var position_code = '';
    var brg_tun_code = '';

    brg_tun_code = $('#data_bridge').attr('code') == undefined ? '' : $('#data_bridge').attr('code')
    position_code = $('#data_position_name').attr('code') == undefined ? '' : $('#data_position_name').attr('code')
    line_code = $('#data_line_name').attr('code') == undefined ? '' : $('#data_line_name').attr('code')

    var locationName = $('#data_position_name').html()
    var locationCode = $('#data_position_name').attr('code')
    var kmMark = parseInt($('#data_km_mark').html().split('+')[0].split('K')[1]) * 1000 + parseInt($('#data_km_mark').html().split('+')[1]); //开始
    if (kmMark == 0) {
        kmMark = '';
    };
    var url = '/Common/MOnePoleData/RemoteHandlers/HardDiskData.ashx?action=detail'
            + '&pole_code=' + pole_code
            + '&line_code=' + line_code
            + '&pole_direction=' + direction
            + '&position_code=' + position_code
            + '&km_mark=' + kmMark
            + '&start_timestamp=' + ST
            + '&end_timestamp=' + ET
            + '&locomotive_code=' + locomotive_code
    //+ '&bow_position_code=' + (bow_position_code == undefined ? '' : bow_position_code)
    $.ajax({
        type: "POST",
        url: url,
        async: true,
        cache: false,
        success: function (result) {
            if (result != '' && result != undefined && !isEmptyObject(result)) {
                json = result;
                var bowJson;
                if (bow_position_code == undefined) {
                    for (var i = 0; i < json.content.length; i++) {
                        if (isEmptyObject(json.content[i])) {
                            continue;
                        } else {
                            bowJson = json.content[i];
                            continue;

                        }
                    }
                } else {
                    for (var i = 0; i < json.content.length; i++) {
                        if (isEmptyObject(json.content[i])) {
                            continue;
                        } else if (json.content[i].bow_position_name == bow_position_name) {
                            bowJson = json.content[i];
                            continue;
                        }
                    }
                }
                if (bowJson) {
                    full_json_B = bowJson;
                } else {
                    full_json_B = '';
                }
                if (full_json_B != '' && full_json != '') {
                    if (full_json.ID == full_json_B.ID && full_json.start_time == full_json_B.start_time) {
                        full_json = '';
                        $('.j-latest-note-2,.j-latest-infrared,.j-latest-visible-light,.j-latest-panorama').click()
                        clearCompearPlace()

                    }
                }
                clearCompearPlace('B');
                if (bowJson == '' || bowJson == undefined) {
                    layer.msg('该弓暂无数据！')
                    clearCompearPlace('B');
                    return false;
                }
                is_play_B = true;
                playIndex_B = 0

                //播放
                play_B()
                //加载车厢号列表。
                Getrelations(json, bowJson, $('#chooseCarB'), 'B', ST, ET, locomotive_code, bow_position_name);
                //silde加载
                loadSlider_B_inspection()
                //曲线
                createLineChart(document.getElementById('history-temperature'), bowJson, 'B', 'LineInsPection')
                createLC_LineChart(document.getElementById('history-pull-out'), bowJson, 'B')
                createDG_LineChart(document.getElementById('history-high-conductivity'), bowJson, 'B')

            } else {
                full_json_B = '';
                layer.msg('2号展示区暂无可展示数据！')
                clearCompearPlace('B');
            }
        },
        error: function () {
            full_json_B = '';
            layer.msg('2号展示区请求出错！')
            clearCompearPlace('B');
        }
    });
}

//报警播放一帧
function alarmPlay() {
    //表格信息
    if (full_json != '' && full_json != undefined) {
        $('#latest-inspect-time').html(full_json.RAISED_TIME + '(<a code="' + full_json.ID + '" class="showMfc3" style="color:#91CA53" href="#">点击查看详情&gt;&gt;</a>)')
        $('#latest-locomotive-code').html(full_json.LOCNO)
        $('#latest-alarmType-code').html(full_json.STATUSDIC == '' ? full_json.INITIAL_CODE_NAME : full_json.STATUSDIC + ',' + full_json.SUMMARYDIC)
        $('#latest-bownStion-code').html(full_json.BOW_TYPE)
        $('#latest-LC-code').html(full_json.PULLING_VALUE == '' ? full_json.PULLING_VALUE : full_json.PULLING_VALUE + 'mm')
        $('#latest-DG-code').html(full_json.LINE_HEIGHT == '' ? full_json.LINE_HEIGHT : full_json.LINE_HEIGHT + 'mm')
        $('#latest-alarmTp-code').html(full_json.WENDU)
        $('#latest-speed-code').html(full_json.SPEED == '' ? full_json.SPEED : full_json.SPEED + 'km/h')
        $('#latest-environmentTp-code').html(full_json.HJWENDU)
        $('#latest-alarmLevle-code').html(full_json.SEVERITY)
        //简略信息
        $('#latest-infrared-param').html(full_json.FRAME_INFO[playIndex])

        //红外
        preLoadImg(full_json.IR_PICS[full_json.PLAY_IDX[playIndex].IR], $('#latest-infrared'), 'A')
        //$('#latest-infrared').attr('src', full_json.IR_PICS[full_json.PLAY_IDX[playIndex].IR])
        //可见
        preLoadImg(full_json.VI_PICS[full_json.PLAY_IDX[playIndex].VI], $('#latest-visible-light'), 'A')

        //$('#latest-visible-light').attr('src', full_json.VI_PICS[full_json.PLAY_IDX[playIndex].VI])
        //全景
        preLoadImg(full_json.OA_PICS[full_json.PLAY_IDX[playIndex].OA], $('#latest-panorama'), 'A')

        //$('#latest-panorama').attr('src', full_json.OA_PICS[full_json.PLAY_IDX[playIndex].OA])
        $('#latest-slider').slider('value', playIndex);
    }

}
function alarmPlay_B() {
    if (full_json_B != '' && full_json_B != undefined) {
        //表格信息
        $('#history-inspect-time').html(full_json_B.RAISED_TIME + '(<a code="' + full_json_B.ID + '" class="showMfc3" style="color:#91CA53" href="#">点击查看详情&gt;&gt;</a>)')
        $('#history-locomotive-code').html(full_json_B.LOCNO)
        $('#history-alarmType-code').html(full_json_B.STATUSDIC == '' ? full_json_B.INITIAL_CODE_NAME : full_json_B.STATUSDIC + ',' + full_json_B.SUMMARYDIC)
        $('#history-bownStion-code').html(full_json_B.BOW_TYPE)
        $('#history-LC-code').html(full_json_B.PULLING_VALUE == '' ? full_json_B.PULLING_VALUE : full_json_B.PULLING_VALUE + 'mm')
        $('#history-DG-code').html(full_json_B.LINE_HEIGHT == '' ? full_json_B.LINE_HEIGHT : full_json_B.LINE_HEIGHT + 'mm')
        $('#history-alarmTp-code').html(full_json_B.WENDU)
        $('#history-speed-code').html(full_json_B.SPEED == '' ? full_json_B.SPEED : full_json_B.SPEED + 'km/h')
        $('#history-environmentTp-code').html(full_json_B.HJWENDU)
        $('#history-alarmLevle-code').html(full_json_B.SEVERITY)
        //简略信息
        $('#history-infrared-param').html(full_json_B.FRAME_INFO[playIndex_B])

        //红外
        preLoadImg(full_json_B.IR_PICS[full_json_B.PLAY_IDX[playIndex_B].IR], $('#history-infrared'), 'B')
        //$('#latest-infrared').attr('src', full_json.IR_PICS[full_json.PLAY_IDX[playIndex].IR])
        //可见
        preLoadImg(full_json_B.VI_PICS[full_json_B.PLAY_IDX[playIndex_B].VI], $('#history-visible-light'), 'B')

        //$('#latest-visible-light').attr('src', full_json.VI_PICS[full_json.PLAY_IDX[playIndex].VI])
        //全景
        preLoadImg(full_json_B.OA_PICS[full_json_B.PLAY_IDX[playIndex_B].OA], $('#history-panorama'), 'B')

        //$('#latest-panorama').attr('src', full_json.OA_PICS[full_json.PLAY_IDX[playIndex].OA])
        $('#history-slider').slider('value', playIndex_B);
    }
}
function alarmPlay_A_lininspection() {
    if (full_json != '' && full_json != undefined) {
        //表格信息
        $('#latest-inspect-time').html(full_json.start_time)
        $('#latest-locomotive-code').html(full_json.locomotive_code)
        $('#latest-alarmType-code').html('')
        $('#latest-bownStion-code').html(full_json.bow_position_name)
        $('#latest-LC-code').html(full_json.PULLING_VALUE == '' ? full_json.PULLING_VALUE : full_json.PULLING_VALUE + 'mm')
        $('#latest-DG-code').html(full_json.LINE_HEIGHT == '' ? full_json.LINE_HEIGHT : full_json.LINE_HEIGHT + 'mm')
        $('#latest-alarmTp-code').html('')
        $('#latest-speed-code').html(full_json.SPEED == '' ? full_json.SPEED : full_json.SPEED + 'km/h')
        $('#latest-environmentTp-code').html(full_json.TEMP_ENV == '' ? full_json.TEMP_ENV : full_json.TEMP_ENV / 100 + '℃')
        $('#latest-alarmLevle-code').html('')
        //简略信息
        $('#latest-infrared-param').html(full_json.INFO[playIndex])
        //        var url_IR = '/common/lineinspectiondataanalysis/remotehandlers/harddiskdatavedioplay.ashx?action=GetIMA&file=' + full_json.IRV[playIndex]
        //+ '&timestamp=' + full_json.TIMESTAMP_IRV[playIndex] + '&size=50&locomotive=' + full_json.locomotive_code + '&type=GetIrvImgData'
        //        var url_VI = '/common/lineinspectiondataanalysis/remotehandlers/harddiskdatavedioplay.ashx?action=GetIMA&file=' + full_json.VI[playIndex]
        //        + '&timestamp=' + full_json.TIMESTAMP_IRV[playIndex] + '&size=50&locomotive=' + full_json.locomotive_code + '&type=GetViImgData'
        //        var url_OA = '/common/lineinspectiondataanalysis/remotehandlers/harddiskdatavedioplay.ashx?action=GetIMA&file=' + full_json.VI[playIndex]
        //        + '&timestamp=' + full_json.TIMESTAMP_IRV[playIndex] + '&size=50&locomotive=' + full_json.locomotive_code + '&type=GetMv3ImgData'



        //var url_IR = 'http://' + queryIP + '/3CDataProvider/GetImgData?file=' + full_json.IRV[playIndex] + '&timestamp=' + full_json.TIMESTAMP_IRV[playIndex] + '&size=50&locomotive=' + full_json.locomotive_code + '&type=GetIrvImgData' + '&sessionID=' + sessionID;
        //var url_VI = 'http://' + queryIP + '/3CDataProvider/GetImgData?file=' + full_json.VI[playIndex] + '&timestamp=' + full_json.TIMESTAMP_IRV[playIndex] + '&size=50&locomotive=' + full_json.locomotive_code + '&type=GetViImgData' + '&sessionID=' + sessionID;
        //var url_OA = 'http://' + queryIP + '/3CDataProvider/GetImgData?file=' + full_json.VI[playIndex] + '&timestamp=' + full_json.TIMESTAMP_IRV[playIndex] + '&size=50&locomotive=' + full_json.locomotive_code + '&type=GetMv3ImgData' + '&sessionID=' + sessionID;


        var OV_OFFSET = 0;
        var VI_OFFSET = 0;
        if (full_json.OV_OFFSET[playIndex] != '') {
            OV_OFFSET = full_json.OV_OFFSET[playIndex];
        }
        if (full_json.VI_OFFSET[playIndex] != '') {
            VI_OFFSET = full_json.VI_OFFSET[playIndex];
        }


        var url_IR = 'http://' + queryIP_IRV + '/3CDataProvider/GetImgData?file=' + full_json.IRV[playIndex] + '&timestamp=' + full_json.TIMESTAMP_IRV[playIndex] + '&size=50&locomotive=' + full_json.locomotive_code + '&type=GetIrvImgData' + '&sessionID=' + sessionID + '&imgIdx=' + full_json.IRV_IDX[playIndex] + '&autoExposure=true';
        var url_VI = 'http://' + queryIP_VI + '/3CDataProvider/GetImgData?file=' + full_json.VI[playIndex] + '&timestamp=' + full_json.TIMESTAMP_IRV[playIndex] + '&size=50&locomotive=' + full_json.locomotive_code + '&type=GetViImgData' + '&sessionID=' + sessionID + '&imgIdx=' + (parseInt(full_json.VI_IDX[playIndex]) + parseInt(VI_OFFSET)) + '&autoExposure=true';
        var url_OA = 'http://' + queryIP_OV + '/3CDataProvider/GetImgData?file=' + full_json.OV[playIndex] + '&timestamp=' + full_json.TIMESTAMP_IRV[playIndex] + '&size=50&locomotive=' + full_json.locomotive_code + '&type=GetMv3ImgData' + '&sessionID=' + sessionID + '&imgIdx=' + (parseInt(full_json.OV_IDX[playIndex]) + parseInt(OV_OFFSET)) + '&autoExposure=true';



        //红外
        preLoadImg(url_IR, $('#latest-infrared'), 'A')
        ////可见
        preLoadImg(url_VI, $('#latest-visible-light'), 'A')

        ////全景
        preLoadImg(url_OA, $('#latest-panorama'), 'A')

        $('#latest-slider').slider('value', playIndex);
    }
}
function alarmPlay_B_lininspection() {
    if (full_json_B != '' && full_json_B != undefined) {
        //表格信息
        $('#history-inspect-time').html(full_json_B.start_time)
        $('#history-locomotive-code').html(full_json_B.locomotive_code)
        $('#history-alarmType-code').html('')
        $('#history-bownStion-code').html(full_json_B.bow_position_name)
        $('#history-LC-code').html(full_json_B.PULLING_VALUE == '' ? full_json_B.PULLING_VALUE : full_json_B.PULLING_VALUE + 'mm')
        $('#history-DG-code').html(full_json_B.LINE_HEIGHT == '' ? full_json_B.LINE_HEIGHT : full_json_B.LINE_HEIGHT + 'mm')
        $('#history-alarmTp-code').html('')
        $('#history-speed-code').html(full_json_B.SPEED == '' ? full_json_B.SPEED : full_json_B.SPEED + 'km/h')
        $('#history-environmentTp-code').html(full_json_B.TEMP_ENV == '' ? full_json_B.TEMP_ENV : full_json_B.TEMP_ENV / 100 + '℃')
        $('#history-alarmLevle-code').html('')
        //简略信息
        $('#history-infrared-param').html(full_json_B.INFO[playIndex_B])
        //        var url_IR = '/common/lineinspectiondataanalysis/remotehandlers/harddiskdatavedioplay.ashx?action=GetIMA&file=' + full_json_B.IRV[playIndex_B]
        //+ '&timestamp=' + full_json_B.TIMESTAMP_IRV[playIndex_B] + '&size=50&locomotive=' + full_json_B.locomotive_code + '&type=GetIrvImgData'
        //        var url_VI = '/common/lineinspectiondataanalysis/remotehandlers/harddiskdatavedioplay.ashx?action=GetIMA&file=' + full_json_B.VI[playIndex_B]
        //        + '&timestamp=' + full_json_B.TIMESTAMP_IRV[playIndex_B] + '&size=50&locomotive=' + full_json_B.locomotive_code + '&type=GetViImgData'
        //        var url_OA = '/common/lineinspectiondataanalysis/remotehandlers/harddiskdatavedioplay.ashx?action=GetIMA&file=' + full_json_B.VI[playIndex_B]
        //        + '&timestamp=' + full_json_B.TIMESTAMP_IRV[playIndex_B] + '&size=50&locomotive=' + full_json_B.locomotive_code + '&type=GetMv3ImgData'
        var OV_OFFSET = 0;
        var VI_OFFSET = 0;
        if (full_json_B.OV_OFFSET[playIndex_B] != '') {
            OV_OFFSET = full_json_B.OV_OFFSET[playIndex_B];
        }
        if (full_json_B.VI_OFFSET[playIndex_B] != '') {
            VI_OFFSET = full_json_B.VI_OFFSET[playIndex_B];
        }


        var url_IR = 'http://' + queryIP_IRV + '/3CDataProvider/GetImgData?file=' + full_json_B.IRV[playIndex_B] + '&timestamp=' + full_json_B.TIMESTAMP_IRV[playIndex_B] + '&size=50&locomotive=' + full_json_B.locomotive_code + '&type=GetIrvImgData' + '&sessionID=' + sessionID + '&imgIdx=' + full_json_B.IRV_IDX[playIndex_B] + '&autoExposure=true';
        var url_VI = 'http://' + queryIP_VI + '/3CDataProvider/GetImgData?file=' + full_json_B.VI[playIndex_B] + '&timestamp=' + full_json_B.TIMESTAMP_IRV[playIndex_B] + '&size=50&locomotive=' + full_json_B.locomotive_code + '&type=GetViImgData' + '&sessionID=' + sessionID + '&imgIdx=' + (parseInt(full_json_B.VI_IDX[playIndex_B]) + parseInt(VI_OFFSET)) + '&autoExposure=true';
        var url_OA = 'http://' + queryIP_OV + '/3CDataProvider/GetImgData?file=' + full_json_B.OV[playIndex_B] + '&timestamp=' + full_json_B.TIMESTAMP_IRV[playIndex_B] + '&size=50&locomotive=' + full_json_B.locomotive_code + '&type=GetMv3ImgData' + '&sessionID=' + sessionID + '&imgIdx=' + (parseInt(full_json_B.OV_IDX[playIndex_B]) + parseInt(OV_OFFSET)) + '&autoExposure=true';






        //红外
        preLoadImg(url_IR, $('#history-infrared'), 'B')
        ////可见
        preLoadImg(url_VI, $('#history-visible-light'), 'B')

        ////全景
        preLoadImg(url_OA, $('#history-panorama'), 'B')

        $('#history-slider').slider('value', playIndex_B);
    }
}
//播放报警
function play_A() {
    if (full_json != '' && full_json != undefined) {
        clearInterval(interval_A);//关闭定时器 
        if (CompleteImgNum_A >= 3 && RED_A && HD_A && OVER_A) {
            CompleteImgNum_A = 0;
            RED_A = false;
            HD_A = false;
            OVER_A = false;
            if (full_json.PLAY_IDX) {

                if (is_play_A) {
                    alarmPlay();

                    $('#latest-note .note-2').find('img').attr('src', 'img/player_play.png');
                    if (playIndex < full_json.PLAY_IDX.length - 1) {
                        playIndex++;
                    } else {
                        playIndex = 0;
                    }
                    interval_A = setInterval('play_A()', speed_A); //重新设置定时器
                } else {
                    alarmPlay();

                    $('#latest-note .note-2').find('img').attr('src', 'img/player_pause.png');
                }
            } else {
                if (is_play_A) {
                    alarmPlay_A_lininspection();

                    $('#latest-note .note-2').find('img').attr('src', 'img/player_play.png');
                    if (playIndex < full_json.TIMESTAMP_IRV.length - 1) {
                        playIndex++;
                    } else {
                        playIndex = 0;
                    }
                    interval_A = setInterval('play_A()', speed_A); //重新设置定时器
                } else {
                    alarmPlay_A_lininspection();

                    $('#latest-note .note-2').find('img').attr('src', 'img/player_pause.png');
                }
            }


        } else {
            setTimeout('play_A()', time_speed)
        }


    }
}
function play_B() {
    if (full_json_B != '' && full_json_B != undefined) {
        clearInterval(interval_B);//关闭定时器 
        if (CompleteImgNum_B >= 3 && RED_B && HD_B && OVER_B) {
            CompleteImgNum_B = 0;
            RED_B = false;
            HD_B = false;
            OVER_B = false;
            if (full_json_B.PLAY_IDX) {
                if (is_play_B) {
                    alarmPlay_B();
                    $('#history-note .note-2').find('img').attr('src', 'img/player_play.png');

                    if (playIndex_B < full_json_B.PLAY_IDX.length - 1) {
                        playIndex_B++;
                    } else {
                        playIndex_B = 0;
                    }
                    interval_B = setInterval('play_B()', speed_A); //重新设置定时器
                } else {
                    alarmPlay_B();

                    $('#history-note .note-2').find('img').attr('src', 'img/player_pause.png');
                }
            } else {
                if (is_play_B) {
                    alarmPlay_B_lininspection();
                    $('#history-note .note-2').find('img').attr('src', 'img/player_play.png');

                    if (playIndex_B < full_json_B.TIMESTAMP_IRV.length - 1) {
                        playIndex_B++;
                    } else {
                        playIndex_B = 0;
                    }
                    interval_B = setInterval('play_B()', speed_A); //重新设置定时器
                } else {
                    alarmPlay_B_lininspection();

                    $('#history-note .note-2').find('img').attr('src', 'img/player_pause.png');
                }
            }
        } else {
            setTimeout('play_B()', time_speed)
        }




    }
}

//加载进度条
function loadSlider() {
    if (full_json.PLAY_IDX.length > 0) {
        $('#latest-note').show();
        $('#latest-slider').slider({
            value: 0,
            min: 0,
            max: full_json.PLAY_IDX.length - 1,
            step: 1,
            range: 'min',
            slide: function (event, ui) {

                //clearInterval(interval_A); //关闭定时器
                playIndex = parseInt(ui.value)
                alarmPlay();

            }
        });
    }
}
function loadSlider_B() {
    if (full_json_B.PLAY_IDX.length > 0) {
        $('#history-note').show();

        $('#history-slider').slider({
            value: 0,
            min: 0,
            max: full_json_B.PLAY_IDX.length - 1,
            step: 1,
            range: 'min',
            slide: function (event, ui) {

                //clearInterval(interval_B); //关闭定时器
                playIndex_B = parseInt(ui.value)
                alarmPlay_B();

            }
        });
    }
}
function loadSlider_A_inspection() {
    if (full_json.TIMESTAMP_IRV.length > 0) {
        $('#latest-note').show();

        $('#latest-slider').slider({
            value: 0,
            min: 0,
            max: full_json.TIMESTAMP_IRV.length - 1,
            step: 1,
            range: 'min',
            slide: function (event, ui) {

                //clearInterval(interval_B); //关闭定时器
                playIndex = parseInt(ui.value)
                alarmPlay_A_lininspection();

            }
        });
    }
}
function loadSlider_B_inspection() {
    if (full_json_B.TIMESTAMP_IRV.length > 0) {
        $('#history-note').show();

        $('#history-slider').slider({
            value: 0,
            min: 0,
            max: full_json_B.TIMESTAMP_IRV.length - 1,
            step: 1,
            range: 'min',
            slide: function (event, ui) {

                //clearInterval(interval_B); //关闭定时器
                playIndex_B = parseInt(ui.value)
                alarmPlay_B_lininspection();

            }
        });
    }
}
//预加载图片
function preLoadImg(url, dom, type) {
    var img = new Image();
    img.src = url;
    img.onload = function () {
        if (type == 'A') {
            CompleteImgNum_A++;
            dom.attr('src', url)
        } else if (type == 'B') {
            CompleteImgNum_B++;
            dom.attr('src', url)

        }
        switch (dom.attr('id')) {
            case 'history-infrared':
                RED_B = true;
                break;
            case 'history-visible-light':
                HD_B = true;
                break;
            case 'history-panorama':
                OVER_B = true;
                break;
            case 'latest-infrared':
                RED_A = true;
                break;
            case 'latest-visible-light':
                HD_A = true;
                break;
            case 'latest-panorama':
                OVER_A = true;
                break;
        }
    }
    img.onerror = function () {
        if (type == 'A') {
            CompleteImgNum_A++;
            dom.attr('src', url)
        } else if (type == 'B') {
            CompleteImgNum_B++;
            dom.attr('src', url)
        }
        dom.attr('src', 'img/无图.png')
        switch (dom.attr('id')) {
            case 'history-infrared':
                RED_B = true;
                break;
            case 'history-visible-light':
                HD_B = true;
                break;
            case 'history-panorama':
                OVER_B = true;
                break;
            case 'latest-infrared':
                RED_A = true;
                break;
            case 'latest-visible-light':
                HD_A = true;
                break;
            case 'latest-panorama':
                OVER_A = true;
                break;
        }
    }
};

//AB播放器点击事件 
function A_player_click() {
    //上一张（最新）
    $('.j-latest-note-1').click(function () {
        is_play_A = false;
        if (full_json.PLAY_IDX) {
            if (playIndex == 0) {
                playIndex = full_json.PLAY_IDX.length - 1;
            } else {
                playIndex--;
            }
        } else {
            if (playIndex == 0) {
                playIndex = full_json.TIMESTAMP_IRV.length - 1;
            } else {
                playIndex--;
            }
        }
        play_A()
        if ($('.j-latest-note-3').find('img').attr('src') == 'img/player_after_hover.png') {
            $('.j-latest-note-3').find('img').attr('src', 'img/player_after.png');
        }
        $('.j-latest-note-1').find('img').attr('src', 'img/player_prev_hover.png');
        $('#latest-note .note-2').find('img').attr('src', 'img/player_pause.png');
    });
    //播放、暂停（最新）
    $('.j-latest-note-2,.j-latest-infrared,.j-latest-visible-light,.j-latest-panorama').click(function () {
        if (is_play_A) {
            is_play_A = false;
            $('#latest-note .note-2').find('img').attr('src', 'img/player_pause.png');
        } else {
            is_play_A = true;
            $('#latest-note .note-2').find('img').attr('src', 'img/player_play.png');
        }
        play_A()
        $('.j-latest-note-1').find('img').attr('src', 'img/player_prev.png');
        $('.j-latest-note-3').find('img').attr('src', 'img/player_after.png');
    });
    //下一张（最新）
    $('.j-latest-note-3').click(function () {
        is_play_A = false;
        if (full_json.PLAY_IDX) {
            if (playIndex >= full_json.PLAY_IDX.length - 1) {
                playIndex = 0;
            } else {
                playIndex++;
            }
        } else {
            if (playIndex >= full_json.TIMESTAMP_IRV.length - 1) {
                playIndex = 0;
            } else {
                playIndex++;
            }
        }

        play_A()

        if ($('.j-latest-note-1').find('img').attr('src') == 'img/player_prev_hover.png') {
            $('.j-latest-note-1').find('img').attr('src', 'img/player_prev.png');
        }
        $('.j-latest-note-3').find('img').attr('src', 'img/player_after_hover.png');
        $('#latest-note .note-2').find('img').attr('src', 'img/player_pause.png');
    });
}
function B_player_click() {
    //上一张（历史）
    $('.j-history-note-1').click(function () {
        is_play_B = false;
        if (full_json_B.PLAY_IDX) {
            if (playIndex_B == 0) {
                playIndex_B = full_json_B.PLAY_IDX.length - 1;
            } else {
                playIndex_B--;
            }
        } else {
            if (playIndex_B == 0) {
                playIndex_B = full_json_B.TIMESTAMP_IRV.length - 1;
            } else {
                playIndex_B--;
            }
        }

        play_B()
        if ($('.j-history-note-3').find('img').attr('src') == 'img/player_after_hover.png') {
            $('.j-history-note-3').find('img').attr('src', 'img/player_after.png');
        }
        $('.j-history-note-1').find('img').attr('src', 'img/player_prev_hover.png');
        $('#history-note .note-2').find('img').attr('src', 'img/player_pause.png');
    });
    //播放、暂停（历史）
    $('.j-history-note-2,.j-history-infrared,.j-history-visible-light,.j-history-panorama').click(function () {
        if (is_play_B) {
            is_play_B = false;
            $('#history-note .note-2').find('img').attr('src', 'img/player_pause.png');

        } else {
            is_play_B = true;
            $('#history-note .note-2').find('img').attr('src', 'img/player_play.png');

        }
        play_B()
        $('.j-history-note-1').find('img').attr('src', 'img/player_prev.png');
        $('.j-history-note-3').find('img').attr('src', 'img/player_after.png');
    });
    //下一张（历史）
    $('.j-history-note-3').click(function () {
        is_play_B = false;

        if (full_json_B.PLAY_IDX) {
            if (playIndex_B >= full_json_B.PLAY_IDX.length - 1) {
                playIndex_B = 0;
            } else {
                playIndex_B++;
            }
        } else {
            if (playIndex_B >= full_json_B.TIMESTAMP_IRV.length - 1) {
                playIndex_B = 0;
            } else {
                playIndex_B++;
            }
        }
        play_B()
        if ($('.j-history-note-1').find('img').attr('src') == 'img/player_prev_hover.png') {
            $('.j-history-note-1').find('img').attr('src', 'img/player_prev.png');
        }
        $('.j-history-note-3').find('img').attr('src', 'img/player_after_hover.png');
        $('#history-note .note-2').find('img').attr('src', 'img/player_pause.png');
    });



}





//时间判断
function dojudge_A() {
    if ($('#startdate').val() != '' && $('#enddate').val() != '') {
        if ($('#startdate').val() >= $('#enddate').val()) {
            layer.msg('时间输入有误！')
            return false;
        } else {
            return true;
        }
    } else {
        return true;
    }

}
function dojudge_B() {
    if ($('#startdate_line').val() != '' && $('#enddate_line').val() != '') {
        if ($('#startdate_line').val() >= $('#enddate_line').val()) {
            layer.msg('时间输入有误！')
            return false;
        } else {
            return true;
        }
    } else {
        return true;
    }
}






//获取选中项
function getSelectedItem(obj) {
    var slct = "";
    for (var i = 0; i < obj.options.length; i++)
        if (obj.options[i].selected == true) {
            slct += obj.options[i].value;
        }
    return slct;
};
//判断对象为空
function isEmptyObject(obj) {
    for (var key in obj) {
        return false;
    }
    return true;
}
//获取时间   blue为多少天前 start 为start 或者空
function getNowFormatDate(blue, start) {
    var date = new Date();
    if (blue != '' && blue != undefined) {
        date.setUTCDate(date.getDate() - parseInt(blue));
    }
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var strSecond = date.getSeconds();
    var strHours = date.getHours();
    var strMinutes = date.getMinutes();

    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    //if (strSecond >= 0 && strSecond <= 9) {
    //    strSecond = "0" + strSecond;
    //}
    //if (strHours >= 0 && strHours <= 9) {
    //    strHours = "0" + strHours;
    //}
    //if (strMinutes >= 0 && strMinutes <= 9) {
    //    strMinutes = "0" + strMinutes;
    //}
    //if (start == 'start') {
    //    strSecond = "00"
    //    strHours = "00"
    //    strMinutes = "00"
    //} else {
    //    strSecond = "59"
    //    strHours = "23"
    //    strMinutes = "59"
    //}




    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate

    //" " + strHours + seperator2 + strMinutes
    //+ seperator2 + strSecond;
    return currentdate;
}
//选择时间
function chooseTime(left, day) {
    if (left == 'left') {
        $('#startdate').val(getNowFormatDate(day))
        $('#enddate').val(getNowFormatDate())
        $('.pic_9').click()

    } else {
        $('#startdate_line').val(getNowFormatDate(day))
        $('#enddate_line').val(getNowFormatDate())
        $('.pic_10').click()
    }

}




//画温度曲线
function createLineChart(dom, JsonAlarm, type, isLineInsPection) {
    myChart = echarts.init(dom);
    var str_X = '[';
    for (var i = 1; i <= JsonAlarm.FRAME_INFO_LIST.length; i++) {
        if (i == 1) {
            str_X += i;
        }
        else {
            str_X += "," + i.toString();
        }
    }
    str_X += "]";

    var str_data = '[';
    for (var i = 0; i < JsonAlarm.FRAME_INFO_LIST.length; i++) {
        var aa = '';
        if (isLineInsPection == 'LineInsPection') {
            aa = parseFloat(JsonAlarm.FRAME_INFO_LIST[i].TEMP_IRV).toFixed(1)
        } else {
            aa = parseFloat(JsonAlarm.FRAME_INFO_LIST[i].TEMP_IRV / 100).toFixed(1)
        }
        if (parseInt(aa) < -300 || aa == undefined) {
            aa = '';
        }
        if (i + 1 == JsonAlarm.FRAME_INFO_LIST.length) {
            str_data += aa + ']';
        } else {
            str_data += aa + ',';
        }

    }

    var _data = eval('(' + str_data + ')');

    var _XTitle = eval('(' + str_X + ')');  //申明横坐标

    var option = {
        color: ['#F17D5D', '#92D050'],
        backgroundColor: '#1b1b1b',
        tooltip: {
            trigger: 'axis',
            showDelay: 1,             // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
            formatter: function (params) {
                var res;


                if (params[0].value == undefined || params[0].value == '-1000' || params[0].value === '' || parseInt(params[0].value) < -300) {
                    res = '';
                } else {
                    res = params[0].seriesName + ':' + params[0].value + '℃';
                }
                return res;

            }
        },
        grid: {
            x: 50,
            y: 30,
            x2: 20,
            y2: 30
        },
        xAxis: [
                                        {

                                            type: 'category',
                                            boundaryGap: true,
                                            axisTick: { onGap: false },
                                            splitLine: { show: false },
                                            axisLabel: {
                                                textStyle: {
                                                    color: '#BFBFBF'
                                                }
                                            },
                                            axisLine: {
                                                show: false
                                            },
                                            data: _XTitle
                                        }
        ],
        yAxis: [

                                        {
                                            axisLine: { show: true, lineStyle: { color: 'white', width: 0 } },
                                            axisLabel: {
                                                textStyle: { color: '#fff' },
                                                formatter: function (v) {
                                                    if (check(v)) {
                                                        return v.toFixed(1) + '℃'
                                                    } else {
                                                        return v.toFixed(0) + '℃'
                                                    }
                                                }
                                            },
                                            type: 'value',
                                            splitLine: {
                                                show: true, lineStyle: {
                                                    type: 'dashed'
                                                }
                                            }
                                        }
        ],
        series: [
                                        {
                                            name: '温度',
                                            type: 'line',
                                            showAllSymbol: true,
                                            data: _data
                                        }
        ]

    };
    myChart.setOption(option);
    //绑定点击事件
    if (type == "A") {
        myChart.on('click', function (params) { eConsoleA(params) })

    } else {
        myChart.on('click', function (params) { eConsoleB(params) })

    }


};
//画拉出曲线
function createLC_LineChart(dom, JsonAlarm, type) {

    myChart = echarts.init(dom);

    var str_X = '[';
    for (var i = 1; i <= JsonAlarm.FRAME_INFO_LIST.length; i++) {
        if (i == JsonAlarm.FRAME_INFO_LIST.length) {
            str_X += i + ']';
        } else {
            str_X += i + ',';
        }
    }

    var str_data = '[';
    for (var i = 0; i < JsonAlarm.FRAME_INFO_LIST.length; i++) {

        var aa = JsonAlarm.FRAME_INFO_LIST[i].PULLING_VALUE
        if (parseInt(aa) <= -1000) {
            aa = '';
        }
        if (i + 1 == JsonAlarm.FRAME_INFO_LIST.length) {
            if (aa == '') {
                str_data += aa + ']';
            } else {
                str_data += parseInt(aa) + ']';
            }
        } else {
            if (aa == '') {
                str_data += aa + ',';
            } else {
                str_data += parseInt(aa) + ',';

            }
        }


    }

    //  var _data = [Imgjson.FRAME_INFO[0].TEMP_IRV / 100, Imgjson.FRAME_INFO[1].TEMP_IRV / 100, Imgjson.FRAME_INFO[2].TEMP_IRV / 100, Imgjson.FRAME_INFO[3].TEMP_IRV / 100, Imgjson.FRAME_INFO[4].TEMP_IRV / 100, Imgjson.FRAME_INFO[5].TEMP_IRV / 100, Imgjson.FRAME_INFO[6].TEMP_IRV / 100, Imgjson.FRAME_INFO[7].TEMP_IRV / 100, Imgjson.FRAME_INFO[8].TEMP_IRV / 100, Imgjson.FRAME_INFO[9].TEMP_IRV / 100];
    var _data = eval('(' + str_data + ')');


    //var axisData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];  //申明横坐标
    var _XTitle = eval('(' + str_X + ')');  //申明横坐标


    var option = {
        color: ['#F17D5D', '#92D050'],
        backgroundColor: '#1b1b1b',
        tooltip: {
            trigger: 'axis',
            showDelay: 1,             // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
            formatter: function (params) {
                var res;
                if (params[0].value == undefined || params[0].value == '-1000' || params[0].value === '' || parseInt(params[0].value) < -1000) {
                    res = '';
                } else {
                    res = params[0].seriesName + ':' + params[0].value + 'mm';
                }
                return res;

            }
        },
        grid: {
            x: 60,
            y: 30,
            x2: 20,
            y2: 30
        },
        xAxis: [
                                        {

                                            type: 'category',
                                            boundaryGap: true,
                                            axisTick: { onGap: false },
                                            splitLine: { show: false },
                                            axisLabel: {
                                                textStyle: {
                                                    color: '#BFBFBF'
                                                }
                                            },
                                            axisLine: {
                                                show: false
                                            },
                                            data: _XTitle
                                        }
        ],
        yAxis: [

                                        {
                                            axisLine: { show: true, lineStyle: { color: 'white', width: 0 } },
                                            axisLabel: {
                                                textStyle: { color: '#fff' },
                                                formatter: function (v) {
                                                    if (check(v)) {
                                                        return v.toFixed(1) + 'mm'
                                                    } else {
                                                        return v.toFixed(0) + 'mm'
                                                    }
                                                }

                                            },
                                            type: 'value',
                                            splitLine: {
                                                show: true, lineStyle: {
                                                    type: 'dashed'
                                                }
                                            }
                                        }
        ],
        series: [
                                        {
                                            name: '拉出值',
                                            type: 'line',
                                            showAllSymbol: true,
                                            data: _data
                                        }
        ]

    };
    myChart.setOption(option);
    //绑定点击事件
    if (type == "A") {
        myChart.on('click', function (params) { eConsoleA(params) })

    } else {
        myChart.on('click', function (params) { eConsoleB(params) })

    }
}
//画导高曲线
function createDG_LineChart(dom, JsonAlarm, type) {

    myChart = echarts.init(dom);

    var str_X = '[';
    for (var i = 1; i <= JsonAlarm.FRAME_INFO_LIST.length; i++) {

        if (i == JsonAlarm.FRAME_INFO_LIST.length) {
            str_X += i + ']';
        } else {
            str_X += i + ',';
        }
    }


    var str_data = '[';
    for (var i = 0; i < JsonAlarm.FRAME_INFO_LIST.length; i++) {
        var aa = JsonAlarm.FRAME_INFO_LIST[i].LINE_HEIGHT
        if (aa == '' || parseInt(aa) <= 3700 || aa == 0 || parseInt(aa) > 7000) {
            aa = '';
        }


        if (i + 1 == JsonAlarm.FRAME_INFO_LIST.length) {
            if (aa == '') {
                str_data += aa + ']';
            } else {
                str_data += parseInt(aa) + ']';
            }
        } else {
            if (aa == '') {
                str_data += aa + ',';
            } else {
                str_data += parseInt(aa) + ',';

            }
        }

    }


    var _data = eval('(' + str_data + ')');
    //console.log(_data)


    var _XTitle = eval('(' + str_X + ')');  //申明横坐标



    var option = {
        color: ['#F17D5D', '#92D050'],
        backgroundColor: '#1b1b1b',
        tooltip: {
            trigger: 'axis',
            showDelay: 1,             // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
            formatter: function (params) {
                console.log(params)
                var res;
                if (params[0].value == undefined || params[0].value == '-1000' || params[0].value === '' || parseInt(params[0].value) < -1000) {
                    res = '';
                } else {
                    res = params[0].seriesName + ':' + params[0].value + 'mm';
                }
                return res;

            }
        },
        grid: {
            x: 70,
            y: 30,
            x2: 20,
            y2: 30
        },
        xAxis: [
                                        {

                                            type: 'category',
                                            boundaryGap: true,
                                            axisTick: { onGap: false },
                                            splitLine: { show: false },
                                            axisLabel: {
                                                textStyle: {
                                                    color: '#BFBFBF'
                                                }
                                            },
                                            axisLine: {
                                                show: false
                                            },
                                            data: _XTitle
                                        }
        ],
        yAxis: [

                                        {
                                            show: true,
                                            type: 'value',
                                            scale: true,
                                            //precision: 1,
                                            min: 5000,
                                            max: 7000,
                                            boundaryGap: [0.05, 0.05],
                                            axisLabel: {
                                                textStyle: { color: '#fff' },
                                                formatter: function (v) {
                                                    if (check(v)) {
                                                        return v.toFixed(1) + 'mm'
                                                    } else {
                                                        return v.toFixed(0) + 'mm'
                                                    }
                                                }
                                            },
                                            axisLine: { show: true, lineStyle: { color: 'white', width: 0 } },
                                            splitLine: {
                                                show: true, lineStyle: {
                                                    type: 'dashed'
                                                }
                                            }
                                        }
        ],
        series: [
                                        {
                                            name: '导高值',
                                            type: 'line',
                                            showAllSymbol: true,
                                            data: _data
                                        }
        ]

    };
    myChart.setOption(option);
    if (type == "A") {
        myChart.on('click', function (params) { eConsoleA(params) })

    } else {
        myChart.on('click', function (params) { eConsoleB(params) })

    }

}

//点击事件执行的方法
function eConsoleA(e) {
    playIndex = parseInt(e.dataIndex)
    //is_play_A = true;
    play_A()
    is_play_A = false;

}
function eConsoleB(e) {
    playIndex_B = parseInt(e.dataIndex)
    //is_play_B = true;
    play_B()
    is_play_B = false;

}

//地图显示
function Map(wz, gis_x, gis_y) {

    //地图调整大小
    $('#box_gis').css({
        width: 'auto',
        'margin-left': function () {
            return -($(this).width() / 2);
        },
        'margin-top': function () {
            return -($(this).height() / 2);
        }
    });
    if (OnClickNumber == 1) {
        Bmaps(gis_x, gis_y);
    } else {
        var point = new BMap.Point(gis_x, gis_y);    // 创建点坐标
        var marker = new BMap.Marker(point);
        map.clearOverlays();    //清除地图上所有覆盖物
        map.addOverlay(marker);               // 将标注添加到地图中
        marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
    }


    document.getElementById('_WZ').innerHTML = wz; //GIS_X
    document.getElementById('gisX').innerHTML = gis_x; //GIS_X
    document.getElementById('gisY').innerHTML = gis_y; //GIS_Y


    if (getConfig("debug") != '1') {//内部显示gis
        $('#GIS').hide();
    }


    map.centerAndZoom(point, 15);

};

function Bmaps(gis_x, gis_y) {
    OnClickNumber = OnClickNumber + 1;
    map = new BMap.Map("mapDiv", { mapType: BMAP_HYBRID_MAP });
    map.addControl(new BMap.MapTypeControl({ anchor: BMAP_ANCHOR_TOP_LEFT }));    //左上角，默认地图控件

    var point = new BMap.Point(gis_x, gis_y);
    map.centerAndZoom(point, 13);

    map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
    var marker = new BMap.Marker(point);  // 创建标注
    map.addOverlay(marker);               // 将标注添加到地图中
    marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
};

//js判断是否为小数
function check(c) {
    var r = /^[+-]?[1-9]?[0-9]*\.[0-9]*$/;
    return r.test(c);
}

//1 2 按钮事件
function CompareOneTwo() {
    $('.col200 span').click(function () {
        if ($(this).html() == '1') {
            $('.s1').removeClass('chooseOne')
            if ($(this).parent().attr('code')) {
                queryPlyer_A($(this).parent().attr('code'))//播放数据请求
            } else {
                queryPlyer_A_lineInspection($(this).parent().attr('ST'), $(this).parent().attr('ET'), $(this).parent().siblings('.LOCOMOTIVE_CODE').attr('code'))//巡检播放数据请求
            }
        } else if ($(this).html() == '2') {
            $('.s2').removeClass('chooseOne')
            if ($(this).parent().attr('code')) {
                queryPlyer_B($(this).parent().attr('code'))//播放数据请求
            } else {
                queryPlyer_B_lineInspection($(this).parent().attr('ST'), $(this).parent().attr('ET'), $(this).parent().siblings('.LOCOMOTIVE_CODE').attr('code'))//巡检播放数据请求
            }
        }
        $(this).siblings().removeClass('chooseOne')
        $(this).addClass('chooseOne')
    })

}

//车号添加
function Getrelations(json, bowJson, dom, Type, ST, ET, locomotive_code, bow_position_name) {

    var html = "";
    var relations = json.DEVICE_BOW_RELATIONS;
    if (relations != "") {
        if (json.DEVICE_BOW_RELATIONS.indexOf('#') > -1) {
            var Array_relations = relations.split('#');
            for (var i = 0; i < Array_relations.length; i++) {
                for (var j = 0; j < Array_relations[i].split(':')[1].split(',').length; j++) {
                    if (i == 0 && j == 0) {

                        html = '<a href="#" class="carNumber" data-toggle="dropdown" code="" >' + (bowJson.bow_position_name == '' ? bow_position_name : bowJson.bow_position_name) + '</a>\
                                        <ul class="dropdown-menu" id="hide_' + Type + '">';
                    }
                    var code = "ip" + (i + 1);
                    if (j == 0) {
                        code = code + "_A";
                    } else {
                        code = code + "_B";
                    }
                    html += '<li><a href="#" class="chooseCar" code="' + code + '">' + Array_relations[i].split(':')[1].split(',')[j] + "车</a></li>";
                }
            }
        }
        else {
            for (var j = 0; j < relations.split(':')[1].split(',').length; j++) {
                if (j == 0) {

                    html = '<a href="#" class="carNumber" data-toggle="dropdown" code="" >' + (bowJson.bow_position_name == '' ? bow_position_name : bowJson.bow_position_name) + '</a>\
                                        <ul class="dropdown-menu" id="hide_' + Type + '">';
                }

                var code = "";
                if (j == 0) {
                    code = "ip_A";
                } else {
                    code = "ip_B";
                }
                html += '<li><a href="#" class="chooseCar" code="' + code + '">' + relations.split(':')[1].split(',')[j] + '车</a></li>'
            }
        }
    } else {
        html = '<a href="#" class="carNumber" data-toggle="dropdown" code="" >' + (bowJson.bow_position_name == "" ? bow_position_name : bowJson.bow_position_name) + '</a>\
                                        <ul class="dropdown-menu" id="hide_' + Type + '">'
                                        + '<li><a href="#" class="chooseCar" code="ip_A">4车</a></li>'
                                        + '<li><a href="#" class="chooseCar" code="ip_B">6车</a></li>'
    }


    html += "</ul>";

    dom.html(html);
    if (Type == 'A') {
        $('#chooseCar').show()
        AchooseCar(ST, ET, locomotive_code)
    } else {
        $('#chooseCarB').show()
        BchooseCar(ST, ET, locomotive_code)
    }
}

//1 2号展示区控制选择弓位置
function AchooseCar(ST, ET, locomotive_code) {
    $('#latest-note .carNumber').click(function () {
        if ($('#hide_A').is(':hidden')) {
            $('#hide_A').css({ left: $(this).parent().parent().width() - $(this).outerWidth() * 2, top: $(this).outerHeight() }).show()
        } else {
            $('#hide_A').hide()
        }
    })
    $('#latest-note .chooseCar').click(function () {
        $(this).parent().parent().siblings('.carNumber').html($(this).html())
        queryPlyer_A_lineInspection(ST, ET, locomotive_code, $(this).attr('code'), $(this).html())
        $('#hide_A').hide()
    })
    //点击任意地方关闭下拉框
    $('body').bind("mousedown", function (e) {
        if ($(e.target).parents("#hide_A").length === 0 && $('#hide_A').css('display') != 'none' && $(e.target).parent('#chooseCar').length === 0) {
            $('#chooseCar .carNumber').click();
        }
    });
}
function BchooseCar(ST, ET, locomotive_code) {
    $('#history-note .carNumber').click(function () {
        if ($('#hide_B').is(':hidden')) {
            $('#hide_B').css({ left: $(this).parent().parent().width() - $(this).outerWidth() * 2, top: $(this).outerHeight() }).show()
        } else {
            $('#hide_B').hide()
        }
    })
    $('#history-note .chooseCar').click(function () {
        $(this).parent().parent().siblings('.carNumber').html($(this).html())
        queryPlyer_B_lineInspection(ST, ET, locomotive_code, $(this).attr('code'), $(this).html())
        $('#hide_B').hide()
    })
    //点击任意地方关闭下拉框
    $('body').bind("mousedown", function (e) {
        if ($(e.target).parents("#hide_B").length === 0 && $('#hide_B').css('display') != 'none' && $(e.target).parent('#chooseCarB').length === 0) {
            $('#chooseCarB .carNumber').click();
        }
    });
}
//置空对比区
function clearCompearPlace(type) {
    //清空左部
    if (type == 'A') {

        CompleteImgNum_A = 3;
        RED_A = true;
        HD_A = true;
        OVER_A = true;
        //$('#chooseCar').html('')
        $('#latest-inspect-time').html('')
        $('#latest-locomotive-code').html('')
        $('#latest-alarmType-code').html('')
        $('#latest-bownStion-code').html('')
        $('#latest-LC-code').html('')
        $('#latest-DG-code').html('')
        $('#latest-alarmTp-code').html('')
        $('#latest-speed-code').html('')
        $('#latest-environmentTp-code').html('')
        $('#latest-alarmLevle-code').html('')
        //简略信息
        $('#latest-infrared-param').html('')

        //红外
        $('#latest-infrared').attr('src', 'img/无图.png')
        //可见
        $('#latest-visible-light').attr('src', 'img/无图.png')
        //全景
        $('#latest-panorama').attr('src', 'img/无图.png')
        echarts.init(document.getElementById('latest-temperature')).clear()
        echarts.init(document.getElementById('latest-pull-out')).clear()
        echarts.init(document.getElementById('latest-high-conductivity')).clear()
    } else if (type == 'B') {//清空右部

        CompleteImgNum_B = 3;
        RED_B = true;
        HD_B = true;
        OVER_B = true;
        //$('#chooseCarB').html('')

        $('#history-inspect-time').html('')
        $('#history-locomotive-code').html('')
        $('#history-alarmType-code').html('')
        $('#history-bownStion-code').html('')
        $('#history-LC-code').html('')
        $('#history-DG-code').html('')
        $('#history-alarmTp-code').html('')
        $('#history-speed-code').html('')
        $('#history-environmentTp-code').html('')
        $('#history-alarmLevle-code').html('')
        //简略信息
        $('#history-infrared-param').html('')

        //红外
        $('#history-infrared').attr('src', 'img/无图.png')
        //可见
        $('#history-visible-light').attr('src', 'img/无图.png')
        //全景
        $('#history-panorama').attr('src', 'img/无图.png')
        echarts.init(document.getElementById('history-temperature')).clear()
        echarts.init(document.getElementById('history-pull-out')).clear()
        echarts.init(document.getElementById('history-high-conductivity')).clear()
    } else {//清空全部
        CompleteImgNum_A = 3;
        RED_A = true;
        HD_A = true;
        OVER_A = true;
        CompleteImgNum_B = 3;
        RED_B = true;
        HD_B = true;
        OVER_B = true;
        var html = '<div class="box-table-info">\
                <table class="con-table-info">\
                    <tr>\
                        <td class="padding-right col500" colspan="2">\
                            <span class="chooseOne">1</span> 号展示区                                                                                                                        \
                        </td>                                                                                                                                                                \
                        <td class="td-border bg-gray"><img class="imgToggle __show" src="img/OnePoleOneFile_up.png" alt="" /></td>                                                           \
                        <td class="padding-left col500" colspan="2">                                                                                                                         \
                            <span class="colorF"> 2</span> 号展示区                                                                                                                          \
                        </td>                                                                                                                                                                \
                    </tr>                                                                                                                                                                    \
                    <tr>                                                                                                                                                                     \
                        <td class="text-center" rowspan="2">                                                                                                                                 \
                            <!--第一列-->                                                                                                                                                    \
                            <!-- 最新播放控制 -->                                                                                                                                            \
                            <div id="latest-note">                                                                                                                                           \
                                <a href="javascript:void(0)" class="note-1 j-latest-note-1" title="上一张"><img src="img/player_prev.png" alt="上一张" />       </a>                         \
                                <a href="javascript:void(0)" class="note-2 j-latest-note-2" title="播放/暂停"><img src="img/player_play.png" alt="播放/暂停" /> </a>                         \
                                <a href="javascript:void(0)" class="note-3 j-latest-note-3" title="下一张"><img src="img/player_after.png" alt="下一张" />      </a>                         \
                                <span id="chooseCar"></span>\
                                <div id="latest-slider"></div>                                                                                                                               \
                            </div>                                                                                                                                                           \
                        </td>                                                                                                                                                                \
                        <td class="text-dark-blue"><span id="latest-inspect-time"></span></td>\
                        <td class="bg-gray">发生日期</td>                                                                                                                                    \
                        <td class="text-default-blue"><span id="history-inspect-time"></span></td>                                                                         \
                        <td rowspan="2" class="text-center">                                                                                                                                 \
                            <!--最后列-->                                                                                                                                                    \
                            <!-- 历史播放控制 -->                                                                                                                                            \
                            <div id="history-note">                                                                                                                                          \
                                <a href="javascript:void(0)" class="note-1 j-history-note-1" title="上一张"><img src="img/player_prev.png" alt="上一张" />       </a>                        \
                                <a href="javascript:void(0)" class="note-2 j-history-note-2" title="播放/暂停"><img src="img/player_play.png" alt="播放/暂停" /> </a>                        \
                                <a href="javascript:void(0)" class="note-3 j-history-note-3" title="下一张"><img src="img/player_after.png" alt="下一张" />      </a>                        \
                            <span id="chooseCarB"></span>\
                                <div id="history-slider"></div>                                                                                                                              \
                            </div>                                                                                                                                                           \
                        </td>                                                                                                                                                                \
                    </tr>                                                                                                                                                                    \
                    <tr>                                                                                                                                                                     \
                        <td class="text-right padding-right"><span id="latest-locomotive-code"></span></td>                                                                        \
                        <td class="bg-gray">设备编号</td>                                                                                                                                    \
                        <td class="text-left padding-left"><span id="history-locomotive-code"></span></td>                                                                         \
                    </tr>                                                                                                                                                                    \
                    <tr class="hide_list">                                                                                                                                                   \
                        <td colspan="2" class="text-right padding-right"><span id="latest-alarmType-code"></span></td>                                                             \
                        <td class="bg-gray">报警类型</td>                                                                                                                                    \
                        <td colspan="2" class="text-left padding-left"><span id="history-alarmType-code"></span></td>                                                              \
                    </tr>                                                                                                                                                                    \
                    <tr class="hide_list">                                                                                                                                                   \
                        <td colspan="2" class="text-right padding-right"><span id="latest-bownStion-code"></span></td>                                                             \
                        <td class="bg-gray">弓位置</td>                                                                                                                                      \
                        <td colspan="2" class="text-left padding-left"><span id="history-bownStion-code"></span></td>                                                              \
                    </tr>                                                                                                                                                                    \
                    <tr class="hide_list">                                                                                                                                                   \
                        <td colspan="2" class="text-right padding-right"><span id="latest-LC-code"></span></td>                                                                    \
                        <td class="bg-gray">拉出值</td>                                                                                                                                      \
                        <td colspan="2" class="text-left padding-left"><span id="history-LC-code"></span></td>                                                                     \
                    </tr>                                                                                                                                                                    \
                    <tr class="hide_list">                                                                                                                                                   \
                        <td colspan="2" class="text-right padding-right"><span id="latest-DG-code"></span></td>                                                                    \
                        <td class="bg-gray">导高值</td>                                                                                                                                      \
                        <td colspan="2" class="text-left padding-left"><span id="history-DG-code"></span></td>                                                                     \
                    </tr>                                                                                                                                                                    \
                    <tr class="hide_list">                                                                                                                                                   \
                        <td colspan="2" class="text-right padding-right"><span id="latest-alarmTp-code"></span></td>                                                               \
                        <td class="bg-gray">报警温度</td>                                                                                                                                    \
                        <td colspan="2" class="text-left padding-left"><span id="history-alarmTp-code"></span></td>                                                                \
                    </tr>                                                                                                                                                                    \
                    <tr class="hide_list">                                                                                                                                                   \
                        <td colspan="2" class="text-right padding-right"><span id="latest-speed-code"></span></td>                                                                 \
                        <td class="bg-gray">速度</td>                                                                                                                                        \
                        <td colspan="2" class="text-left padding-left"><span id="history-speed-code"></span></td>                                                                  \
                    </tr>                                                                                                                                                                    \
                    <tr class="hide_list">                                                                                                                                                   \
                        <td colspan="2" class="text-right padding-right"><span id="latest-environmentTp-code"></span></td>                                                         \
                        <td class="bg-gray">环境温度</td>                                                                                                                                    \
                        <td colspan="2" class="text-left padding-left"><span id="history-environmentTp-code"></span></td>                                                          \
                    </tr>                                                                                                                                                                    \
                    <tr class="hide_list">                                                                                                                                                   \
                        <td colspan="2" class="text-right padding-right"><span id="latest-alarmLevle-code"></span></td>                                                            \
                        <td class="bg-gray">报警级别</td>                                                                                                                                    \
                        <td colspan="2" class="text-left padding-left"><span id="history-alarmLevle-code"></span></td>                                                             \
                    </tr>                                                                                                                                                                    \
                </table>                                                                                                                                                                     \
            </div>                                                                                                                                                                           \
            <!--最新、历史图像详情-->                                                                                                                                                        \
            <div class="box-table-img">                                                                                                                                                      \
                <table class="con-table-img">                                                                                                                                                \
                    <tr>                                                                                                                                                                     \
                        <td id="latest-info" latest-line-inspect-id=""><img id="latest-infrared" class="j-latest-infrared" src="img/无图.png" /><!--最新 红外图像--></td>                    \
                        <td class="bigFont" rowspan="2">红<br />外<br />图<br />像</td>                                                                                                      \
                        <td id="history-info" history-line-inspect-id=""><img id="history-infrared" class="j-history-infrared" src="img/无图.png" /><!--历史 红外图像--></td>                \
                    </tr>                                                                                                                                                                    \
                    <tr>                                                                                                                                                                     \
                        <td><span id="latest-infrared-param"></span></td>                                       \
                        <td><span id="history-infrared-param"></span></td>                                      \
                    </tr>                                                                                                                                                                    \
                    <tr>                                                                                                                                                                     \
                        <td><img id="latest-visible-light" class="j-latest-visible-light" src="img/无图.png" /><!--最新 可见光图像--></td>                                                   \
                        <td class="bigFont">可<br />见<br />光<br />图<br />像</td>                                                                                                          \
                        <td><img id="history-visible-light" class="j-history-visible-light" src="img/无图.png" /><!--历史 可见光图像--></td>                                                 \
                    </tr>                                                                                                                                                                    \
                    <tr>                                                                                                                                                                     \
                        <td><img id="latest-panorama" class="j-latest-panorama" src="img/无图.png" /><!--最新 全景图像--></td>                                                               \
                        <td class="bigFont">全<br />景<br />图<br />像</td>                                                                                                                  \
                        <td><img id="history-panorama" class="j-history-panorama" src="img/无图.png" /><!--历史 全景图像--></td>                                                             \
                    </tr>                                                                                                                                                                    \
                    <tr>                                                                                                                                                                     \
                        <td class="bg-black"><div id="latest-temperature"><!--最新 温度曲线图--></div></td>                                                                                  \
                        <td class="bigFont">温<br />度<br />曲<br />线<br />图</td>                                                                                                          \
                        <td class="bg-black"><div id="history-temperature"><!--历史 温度曲线图--></div></td>                                                                                 \
                    </tr>                                                                                                                                                                    \
                    <tr>                                                                                                                                                                     \
                        <td class="bg-black"><div id="latest-pull-out"><!--最新 拉出曲线图--></div></td>                                                                                     \
                        <td class="bigFont">拉<br />出<br />曲<br />线<br />图</td>                                                                                                          \
                        <td class="bg-black"><div id="history-pull-out"><!--历史 拉出曲线图--></div></td>                                                                                    \
                    </tr>                                                                                                                                                                    \
                    <tr>                                                                                                                                                                     \
                        <td class="bg-black"><div id="latest-high-conductivity"><!--最新 导高曲线图--></div></td>                                                                            \
                        <td class="bigFont">导<br />高<br />曲<br />线<br />图</td>                                                                                                          \
                        <td class="bg-black"><div id="history-high-conductivity"><!--历史 导高曲线图--></div></td>                                                                           \
                    </tr>                                                                                                                                                                    \
                </table>                                                                                                                                                                     \
            </div>    '
        $('.box-content').html(html)
        defalt_click()

    }



}
