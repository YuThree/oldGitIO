/*========================================================================================*
* 功能说明：线路巡检首页
* 注意事项：
* 作    者： ybc
* 版本日期：2016年9月18日
* 变更说明：
* 版 本 号： V1.0.0

*=======================================================================================*/

var pagesize = 10;//一页显示条数
var pageindex = 1;// 当前页



$(document).ready(function () {
   //console.log($('#dataTable').height()<600)

    
    if ($('#dataTable').height()<600){
        pagesize = 7;
        if ($('#dataTable').height() < 350) {
            pagesize = 5;
        }
    }
    

 //线路
    $('#line_tree').mySelectTree({
        tag: 'LINE',
        height: 250,
        enableFilter: true,
    });
    // $('img[src="/Common/img/tree_clear.png"]').css('margin-top','-10px')
  

    //$('#startTime').val(getNowFormatDate(true))
    $('#endTime').val(getNowFormatDate())
    $('.ztreeInput a').css('margin-top', '5px')
    $('img[src="img/lineInspection _btn.png"]').click(queryBtn)
    queryBtn()
})

function getNowFormatDate(two) {
    var date = new Date();
    if (two) {
        date.setMonth(date.getMonth() - 2);
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
    if (strSecond >= 0 && strSecond <= 9) {
        strSecond = "0" + strSecond;
    }
    if (strHours >= 0 && strHours <= 9) {
        strHours = "0" + strHours;
    }
    if (strMinutes >= 0 && strMinutes <= 9) {
        strMinutes = "0" + strMinutes;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + strHours + seperator2 + strMinutes
            + seperator2 + strSecond;
    return currentdate;
}


//查询按钮
function queryBtn() {
    
    if (dojudge()) {
        
        $('#paging').paging({
            index: 1,
            url: function () {
                pageindex = $('.pageValue').val();
                var LPB_code = '';//线路区间
                var LPB_type = '';//线路级别
                if ($('#line_tree').attr('code') != undefined) {
                    LPB_code = $('#line_tree').attr('code')
                }
                if ($('#line_tree').attr('treetype') != undefined) {
                    LPB_type = $('#line_tree').attr('treetype')
                }
                //var dirct = "";//行别
                //if ($('#direction').val() != 0) {
                //    dirct = escape($('#direction').val())
                //}
                var MONTH_NO = $('#InspectionBatch').val();//巡检批次
                var sTime = $('#startTime').val(); //开始时间
                var eTime = $('#endTime').val();  //结束时间
                var _url='/C3/PC/Lineinspection/Remotehandlers/Getlineinspectionlist.ashx?action=query'
                    + '&PageIndex=' + pageindex
                    + '&PageSize=' + pagesize
                    + '&LINE_CODE=' + LPB_code
                    + '&MONTH_NO=' + MONTH_NO
                    + '&starttime=' + sTime
                    + '&endtime=' + eTime

                return _url;
            },
            success: function (re) {
                if (re != null && re != '' && re != undefined) {
                    var _html = '';//内容
                    if (re.data.length < 1) {
                        var a = layer.msg('没有数据');
                    }
                    for (var i = 0; i < re.data.length; i++) {
                        _html += '<tr>\
                                  <td>' + re.data[i].LINE_NAME + '</td>\
                                  <td>' + re.data[i].MONTH_NO + '</td>\
                                 <td>' + re.data[i].BEGIN_TIME + '&ensp;至&ensp;' + re.data[i].END_TIME + '</td>\
                                 <td><img Line_code="' + re.data[i].LINE_CODE + '" id="' + re.data[i].ID + '" src="img/lineInspection _play.png" alt="play" /></td>\
                              </tr>'
                    }
                    $(".listbody").html(_html);
                    $('img[src="img/lineInspection _play.png"]').click(function () {
                        var sTime = $('#startTime').val(); //开始时间
                        var eTime = $('#endTime').val();  //结束时间
                        var _url = '/C3/PC/LineInspection/LineInspection_play.html?id=' + $(this).attr('id') + '&sTime=' + sTime + '&eTime=' + eTime + '&Line_code=' + $(this).attr('Line_code')

                        window.open(_url)
                    })
                } else {
                    layer.msg('暂无数据！')
                }


            }
       })
    }
}

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
}

