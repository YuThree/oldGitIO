function LoadShowListBox(obg) {
    var id = $(obg).attr('rowid')
    var height = 469;
    try {
        if ($(obg).find('a').html().length < 3) {
            return false;
        }
    } catch (e) { }

    if ($("body").find('#myshowListbox1').length == 0) {
        $("body").append('<div id="myshowListbox1" style=""  class="modal fade"  role="dialog" >\
        <div style="width:800px" class="modal-dialog ">\
            <div class="modal-header">\
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
                <h4 class="modal-title" >缺陷处理详情</h4>\
            </div>\
            <div class="modal-content">\
                <div class="myshowListbox" style="height:' + height + 'px;width:100%;">\
                    \
                </div>\
            </div>\
            <div id="BJ" class="modal-footer" style="text-align:center;">\
                <button type="button" id="btn_closeEditBox" class="btn btn-primary" data-dismiss="modal" style="width:88px;">关闭</button>\
            </div>\
        </div>\
    </div>');
        loadShowListBoxInside(id)
    } else {
        loadShowListBoxInside(id)
    }

    $('#myshowListbox1').modal({ backdrop: 'static', keyboard: false }).css({
        width: 'auto',
        'margin-left': function () {
            return -($(this).width() / 2);
        },
        'margin-top': function () {
            return -($(this).height() / 2);
        }
    });
}
function loadShowListBoxInside(id) {
    console.log(PageAlarmJson.rows)
    var alarmsJSON = PageAlarmJson.rows;
    var m = '';
    for (var i = 0; i < alarmsJSON.length; i++) {
        if (alarmsJSON[i].ID == id) {
            m = alarmsJSON[i];
            break;
        }
    }
    if (m != '') {
        try {
            m.fj = m.fj.replace(/;/g, '')
            var fjtype = m.fj.split('.')[m.fj.split('.').length - 1];
            if (fjtype == 'png' || fjtype == 'jpg' || fjtype == 'jpeg' || fjtype == 'JPG' || fjtype == 'JPEG') {
                var fj = "  <div class='imgOutbox fujianShowIMG' imgsrc='" + m.fj + "'  title='" + '点击查看大图' + "'> <img src='" + m.fj + "'/></div>"
            } else if (fjtype == 'xls' || fjtype == 'xlsx' || fjtype == 'xlsm' || fjtype == 'docx' || fjtype == 'doc' || fjtype == 'XLS' || fjtype == 'XLSX' || fjtype == 'XLSM' || fjtype == 'DOCX' || fjtype == 'DOC' || fjtype == 'txt' || fjtype == 'TXT') {
                var fj = " <a href='" + m.fj + "' target ='_blank'>附件下载</a>"
            } else {
                var fj = ''
            }
        } catch (e) {
            var fj = ''
        }
        try {
            m.fj_pic = m.fj_pic.replace(/;/g, '')
            var fjtype = m.fj_pic.split('.')[m.fj_pic.split('.').length - 1];
            if (fjtype == 'png' || fjtype == 'jpg' || fjtype == 'jpeg' || fjtype == 'JPG' || fjtype == 'JPEG') {
                var fj_pic = "  <div class='imgOutbox fujianShowIMG' imgsrc='" + m.fj_pic + "'  title='" + '点击查看大图' + "'> <img src='" + m.fj_pic + "'/></div>"
            } else if (fjtype == 'xls' || fjtype == 'xlsx' || fjtype == 'xlsm' || fjtype == 'docx' || fjtype == 'doc' || fjtype == 'XLS' || fjtype == 'XLSX' || fjtype == 'XLSM' || fjtype == 'DOCX' || fjtype == 'DOC' || fjtype == 'txt' || fjtype == 'TXT') {
                var fj_pic = " <a href='" + m.fj_pic + "' target ='_blank'>附件下载</a>"
            } else {
                var fj_pic = ''
            }
        } catch (e) {
            var fj_pic = ''
        }
        //var img = '';
        //if (m.fj_pic != '' && m.fj_pic != undefined) {
        //    img = "  <div class='imgOutbox fujianShowIMG' imgsrc='" + m.fj_pic + "'  title='" + '点击查看大图' + "'> <img src='" + m.fj_pic + "'/></div>"
        //}
        var colorStyle_r = 'hidden';
        var colorStyle_y = 'hidden';
        if (m.REPORT_OVERDUE != '') {
            var colorStyle_r = 'redOne';
            var font_f = '分析过期'
        }
        if (m.PROCESS_OVERDUE != '') {
            var colorStyle_y = 'yellowOne';
            var font_c = '处理过期'
        }
        var name = '';
        var titlename1 = '缺陷图片';
        var titlename = '测量单';
        if (m.CATEGORY_CODE == '2C' || m.CATEGORY_CODE == '3C' || m.CATEGORY_CODE == '4C') {
            name = ['复测情况', '原因分析', '处理情况']
            if (m.CATEGORY_CODE == '3C') {
                titlename1 = '缺陷报告';
                titlename = '反馈报告';
            } else {
                titlename = '整改图片'
            }
        } else if (m.CATEGORY_CODE == '1C') {
            name = ['复测情况', '原因分析', '整改情况'];
            titlename = '测量单'
        } else if (m.CATEGORY_CODE == '6C') {
            name = ['现场查看情况', '原因分析', '整改情况']
            titlename = '';
        } else {
            name = ['反馈情况', '原因分析', '处理情况']
            titlename = '';
        }
        var html = '<div class="list_row" >\
            <div class="w_300"><span class="title_span">检测类型</span>：' + m.CATEGORY_CODE + '</div>\
            <div class="w_300"><span class="title_span">检测监测日期</span>：' + (m.RAISED_TIME == '0001/1/1 0:00:00' || m.RAISED_TIME == '01-1月 -01' ? '&nbsp;' : m.RAISED_TIME) + '</div>\
            <div class="w_300"><span class="title_span">线路</span>：' + m.LINE_NAME + '</div>\
            <div class="w_300"><span class="title_span">站、区间</span>：' + m.POSITION_NAME + '</div>\
            <div class="w_300"><span class="title_span">行别</span>：' + m.DIRECTION + '</div>\
            <div class="w_300"><span class="title_span">公里标</span>：' + m.KM_MARK + '</div>\
            <div class="w_300"><span class="title_span">支柱号</span>：' + m.POLE_NUMBER + '</div>\
                </div>\
                    <div class="list_row">\
            <div class="w_300"><span class="title_span">缺陷部位</span>：' + m.DEV_NAME + '</div>\
            <div class="w_300"><span class="title_span">缺陷等级</span>：' + (m.SEVERITY_NAME != undefined ? m.SEVERITY_NAME : '') + '</div>\
            <div class="w_300"><span class="title_span">缺陷类型</span>：' + m.CODE_NAME + '</div>\
            <div class="w_600"><span class="title_span">缺陷描述</span>：<span class="longtext">' + m.DETAIL + '<span></div>\
                    </div>\
                    <div class="list_row" style="position: relative;">\
            <div class="w_300"><span class="title_span">分析日期</span>：' + (m.REPORT_DATE == '0001/1/1 0:00:00' || m.REPORT_DATE == '01-1月 -01' ? '&nbsp;' : m.REPORT_DATE) + '</div>\
            <div class="w_300"><span class="title_span">分析人员</span>：' + m.REPORT_PERSON + '</div>\
            <div class="w_300"><span class="title_span">分析部门</span>：' + m.REPORT_DEPTNAME + '</div>\
            <div class="w_300"><span class="title_span">负责单位</span>：' + m.PROCESS_DEPTNAME + '</div>\
            <div class="log_box ' + colorStyle_r + '"><div>' + font_f + '</div></div>\
                    </div>\
                    <div class="list_row" style="position: relative;">\
            <div class="w_300"><span class="title_span">整改日期</span>：' + (m.PROCESS_DATE == '01-1月 -01' || m.PROCESS_DATE == '0001/1/1 0:00:00' ? '&nbsp;' : m.PROCESS_DATE) + '</div>\
            <div class="w_300"><span class="title_span">处理人</span>：' + m.PROCESS_PERSON + '</div>\
            <div class="w_300"><span class="title_span">处理状态</span>：' + m.PROCESS_STATUS + '</div>\
            <div class="w_300"><span class="title_span">复测结果</span>：' + m.CHECK_RESULT + '</div>\
            <div class="log_box ' + colorStyle_y + '"><div>' + font_c + '</div></div>\
                    </div>\
                    <div class="list_row">\
            <div class="w_300"><span class="title_span">' + titlename1 + '</span><span style="float: left;">：</span>' + fj_pic + '</div>\
            <div class="w_300"><span class="title_span">' + titlename + '</span><span style="float: left;">' + (titlename == '' ? '' : ':') + '</span>' + fj + '</div></div>\
                    <div class="list_row">\
            <div class="w_600"><span class="title_span">' + name[0] + '</span>：<span class="longtext">' + m.feedback_situation + '<span></div>\
            <div class="w_600"><span class="title_span">' + name[1] + '</span>：<span class="longtext">' + m.analysis_causes + '<span></div>\
            <div class="w_600"><span class="title_span">' + name[2] + '</span>：<span class="longtext">' + m.deal_situation + '<span></div>\
                    </div>\
            ';


        $('#myshowListbox1 .myshowListbox').html(html)
        //附件查看图片
        $('.fujianShowIMG').click(function (e) {
            e.stopPropagation();
            var srcc = $(this).attr('imgsrc');

            getreallyImgWH(srcc);//获取图片真实宽高


        })

    }


}

function getreallyImgWH(srcc) {
    var _w = $(window).width();//获取浏览器的宽度
    var _h = $(window).height();//获取浏览器的高度

    var img = $(this);
    var realWidth = 600;
    var realHeight = 600;
    //这里做下说明，$("<img/>")这里是创建一个临时的img标签，类似js创建一个new Image()对象！
    var timeOut = 'false';
    $("<img/>").attr("src", srcc).load(function () {
        timeOut = 'true';
        realWidth = this.width;
        realHeight = this.height;
        if (realWidth >= _w || realHeight >= _h) {
            realWidth = (_w - 100); realHeight = (_h - 100);
        }

        var wH = [realWidth, realHeight];
        layer.open({
            type: 1,
            title: false,
            closeBtn: 1,
            shade: 0.8,
            shadeClose: true,
            content: '<img src="' + srcc + '" />'
        });
        $('.layui-layer-page').css({ top: ($(window).height() - parseInt(wH[1])) / 2, left: ($(window).width() - parseInt(wH[0])) / 2, height: wH[1], width: wH[0] });
        $('.layui-layer-page .layui-layer-content img').attr({ 'width': wH[0], 'height': wH[1] }).css('cursor', 'pointer')
        $('.layui-layer-content').click(function () {
            var url = $(this).find('img').attr('src')
            window.open(url)
        })
        $('body').find('.layui-layer-close2').css('transition', ' all 0.001s')//取消过渡动画
    });
    setTimeout(function () {
        if (timeOut == 'false') {
            layer.msg('图片获取失败！请检查路径')
        }
    }, 500)

}
