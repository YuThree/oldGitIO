/*========================================================================================*
* 功能说明：线路列表主页面
* 注意事项：
* 作    者： ybc
* 版本日期：2017年7月26日
* 变更说明：
* 版 本 号： V1.0.0

*=======================================================================================*/

var pageSize = 15;
var timer
var winOpen



$(function () {
    pageSize = parseInt(($(window).height() - $('.html_content').height() - 170) / 35);//一页条数
    $(window).resize(function () {
        pageSize = parseInt(($(window).height() - $('.html_content').height() - 170) / 35);//一页条数
        //console.log(pageSize)

    });
   
    if (getLocalStorage('LineCoverage_startTime') != '' && getLocalStorage('LineCoverage_startTime') != undefined) {
        $('#startTime').val(getLocalStorage('LineCoverage_startTime'));
        $('#endTime').val(getLocalStorage('LineCoverage_endTime'));
        $('#org_tree').val(getLocalStorage('LineCoverage_org')).attr({ 'code': getLocalStorage('LineCoverage_org_tree_code'), 'treetype': getLocalStorage('LineCoverage_org_treetype') });
    } else {
        $('#startTime').val((dateNowStr() + "00:00:00"));
        $('#endTime').val((dateNowStr() + "23:59:59"));
    }
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
        height: 240,
        //onClick: function (event, treeId, treeNode) {
        //    console.log(treeNode)
        //}
    });

    //查询
    $('#doQuery').click(doquery)
    doquery();
})




//查询按钮
function doquery() {
    if (dojudge()) {
    

        $('#paging').paging({
            index: 1,
            url: function () {
                pageindex = $('.pageValue').val();
                var org_code = $('#org_tree').attr('code')== undefined?'':$('#org_tree').attr('code');//组织机构
                var org_type = $('#org_tree').attr('treetype') == undefined ? '' : $('#org_tree').attr('treetype');//org-type
                var ju_code = '';
                var duan_code = '';
                switch (org_type) {
                    case 'TOPBOSS':
                        ju_code = '';
                        duan_code = '';
                        break;
                    case 'YSJ':
                        ju_code = '';
                        duan_code = '';
                        break;
                    case 'J':
                        ju_code = org_code;
                        duan_code = '';
                        break;
                    default:
                        ju_code = '';
                        duan_code = org_code;
                        break;
                }
                var LocomotiveCode = $('#car_tree').val();//设备号
                var sTime = $('#startTime').val(); //开始时间
                var eTime = $('#endTime').val();  //结束时间

                //设置通用时间
                localStorage["LineCoverage_startTime"] = sTime;
                localStorage["LineCoverage_endTime"] = eTime;
                localStorage["LineCoverage_org_tree_code"] = org_code;
                localStorage["LineCoverage_org_treetype"] = org_type;
                localStorage["LineCoverage_org"] = $('#org_tree').val();
                var _url = '/Common/LineCoverage/RemoteHandlers/MileageDetail.ashx?TYPE=query'
                    + '&PageIndex=' + pageindex
                    + '&PageSize=' + pageSize
                    + '&BUREAU_CODE=' + ju_code
                    + '&ORG_CODE=' + duan_code
                    + '&LocoCode=' + LocomotiveCode
                    + '&StartTime=' + sTime
                    + '&EndTime=' + eTime
                //console.log(_url)
                return _url;
            },
            beforeSend: function () {
                layer.load(1, {
                    shade: [0.5, '#fff'] //0.1透明度的白色背景
                });
            },
            success: function (re) {
                layer.closeAll();
                if (re != null && re != '' && re != undefined) {
                    var _html = '';//内容
                    if (re.rows.length < 1) {
                        var a = layer.msg('暂无数据！');
                        return;
                    }
                    var data = re.rows;
                    for (var i = 0; i < data.length; i++) {
                        var percent = '';
                        if (data[i].Distance != '' && data[i].TOTALDISTANCE != '') {
                            
                            var littleNum = (parseInt(data[i].Distance) / parseInt(data[i].TOTALDISTANCE)).toFixed(4);
                            console.log(littleNum)
                            if (littleNum.split('.')[0] == '0') {
                                percent = littleNum.split('.')[1];
                                percent = (percent.split('')[0] == '0' ? '' : percent.split('')[0]) + percent.split('')[1] + '.' + percent.split('')[2] + percent.split('')[3]
                            } else {
                                percent = '100'
                            }
                            
                            percent += '%';
                        }
                        _html += '<tr class="click_Jump '+(data[i].STATUS=='close'?'listhide':'')+'">\
                                  <td class="click_hide"><span class="glyphicon glyphicon-adjust" title="点击\'屏蔽/解除屏蔽\'"></span>' + '</td>\
                                  <td class="BUREAU_NAME">' +data[i].BUREAU_NAME + '</td>\
                                  <td class="ORG_NAME" code="' + data[i].ORG_CODE + '">' + data[i].ORG_NAME + '</td>\
                                 <td class="LINE_CODE" code="' + data[i].LINE_CODE + '">' + (data[i].LINE_NAME == '' ? '' : (data[i].LINE_NAME + '<span class="lineInfor" data-toggle="tooltip" data-html="true" data-placement="right" title="静态里程数：' + (data[i].TOTALDISTANCE == '' ? '' : data[i].TOTALDISTANCE) + '<br/>管辖区间：' + (data[i].RANGE ? data[i].RANGE : '') + '"></span>')) + '</td>\
                                 <td class="Direction">' + data[i].Direction + '</td>\
                                 <td class="LOCO_CODE">' + data[i].LOCO_CODE + '</td>\
                                 <td class="START_DATE">' + data[i].START_DATE + '</td>\
                                 <td class="END_DATE">' + data[i].END_DATE + '</td>\
                                 <td>' + (data[i].Distance == '' ? '' : data[i].Distance )+ '</td>\
                                 <td>' + percent + '</td></tr>'
                                //<td class="LineConfir"></td>\
                    }
                    $(".listbody").html(_html);
                    
                    domevent()
                } else {
                    layer.msg('暂无数据！')
                }
            },
            error:function(re)
            {
                layer.closeAll();
                layer.msg('暂无数据！');
                var _html = '';
                $(".listbody").html(_html);
                domevent();
            }
        })
    }
}

//dom 事件
function domevent() {
    $("[data-toggle='tooltip']").tooltip();//tips

    //标记确认车
    $('.LineConfir').click(function (e) {
        if ($(this).hasClass('choose')) {
            $(this).removeClass('choose')
            //id 重算需要用   每一列标识符
        } else {
            $(this).addClass('choose')
        }
        e.stopPropagation();
    })
    //轨迹按钮
    $('img[src="img/lineInspection _play.png"]').click(function () {
        var sTime = $('#startTime').val(); //开始时间
        var eTime = $('#endTime').val();  //结束时间
        var _url = '/C3/PC/LineInspection/LineInspection_play.html?id=' + $(this).attr('id') + '&sTime=' + sTime + '&eTime=' + eTime + '&Line_code=' + $(this).attr('Line_code')

        window.open(_url)
    })
    //双击跳转到人工标记页面
    $('.click_Jump').dblclick(function () {
        winOpen = window.open('/Common/MGIS/LineCoverage.htm?type=GetSmsGps&deviceid=' + $(this).find('.LOCO_CODE').html() + '&startdate=' + $(this).find('.START_DATE').html() + '&enddate=' + $(this).find('.END_DATE').html())
        //window.clearInterval(timer)
        //timer = window.setInterval("IfWindowClosed()", 500);
        //jumpJudge($(this))
    })
    $('.click_hide .glyphicon').click(function (e) {
        if ($(this).parent().parent().hasClass('listhide')) {
            listhide(true, $(this).parent().parent())
        } else {
            listhide(false, $(this).parent().parent())
        }
        e.stopPropagation();
    })
   
}

//时间判断
function dojudge() {
    //layer.msg('kaishi ');
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
}

//双击跳转判断
function jumpJudge(dom) {
    $.ajax({
        type: "POST",
        url: '',
        async: true,
        cache: false,
        success: function (re) {
            if (re != '' && re != undefined) {
                if (re.xxx = 'xxx') {
                    winOpen = window.open('/Common/MGIS/LineCoverage.htm?type=GetSmsGps&deviceid=' + dom.find('.LOCO_CODE').html() + '&startdate=' + dom.find('.START_DATE').html() + '&enddate=' + dom.find('.END_DATE').html())
                } else {
                    layer.msg('重算中请稍后再试！')
                }
            } else {
                layer.msg('出错了！')
            }
        },
        error: function (textStatus) {
            layer.msg('出错了！')
        }
    });





   
}

//屏蔽设置   bool 为true  打开屏蔽
function listhide(bool,dom) {
    var STATUS = '';
    if (bool) {
        STATUS = 'open';
    } else {
        STATUS = 'close';
    }
    var _url = '/Common/LineCoverage/RemoteHandlers/MileageDetail.ashx?TYPE=status'
            + '&STATUS=' + STATUS
            + '&START_DATE=' + dom.find('.START_DATE').html()
            + '&END_DATE=' + dom.find('.END_DATE').html()
            + '&LOCO_CODE=' + dom.find('.LOCO_CODE').html()
            + '&ORG_CODE=' + dom.find('.ORG_NAME').attr('code')
            + '&Direction=' + dom.find('.Direction').html()
            + '&LINE_CODE=' + dom.find('.LINE_CODE').attr('code')
    ;

    $.ajax({
            type: "POST",
            url: _url,
            async: true,
            cache: false,
            success: function (re) {
                try {
                    if (re != '' && re != undefined && re.STATUS == 'TRUE') {
                        layer.msg('操作成功！');
                        if (dom.hasClass('listhide')) {
                            dom.removeClass('listhide')
                        } else {
                            dom.addClass('listhide')
                        }
                    } else {
                        layer.alert('操作失败！', {
                            icon: 5
                        }, function (index) {
                            layer.close(index);
                        })
                    }
                } catch (e) {
                    layer.alert('出错了！', {
                        icon: 5
                    }, function (index) {
                        layer.close(index);
                    })
                }
    },
            error: function (textStatus) {
                layer.alert('出错了！', {
                    icon: 5
                }, function (index) {
                    layer.close(index);
                })
    }
});
}