//全局变量
var pageSize = 11; //一页显示条数
var pageIndex = 1; //某页


$(function () {
    //线路区站控件
    $('#line-position').mySelectTree({
        tag: 'STATIONSECTION',
        height: 250,
        enableFilter: true,
        filterNumber: 2,
        onClick: function (event, treeId, treeNode) {
            $('#line-position').attr("value", "");
            $('#line-position').val(treeNode.name).attr({ "code": treeNode.id, "treetype": treeNode.treeType });
        }
    });
    $('#xz_line').mySelectTree({
        tag: 'LINE',
        height: 250,
        enableFilter: true,
        filterNumber: 2,
        onClick: function (event, treeId, treeNode) {
            $('#xz_line').attr("value", "");
            $('#xz_line').val(treeNode.name).attr({ "code": treeNode.id, "treetype": treeNode.treeType });
        }
    });
    //行别
    $('#xz_direction').mySelectTree({
        tag: 'Get_Drection',
        height: 50,
        width: 128,
        enableFilter: false,
        onClick: function (event, treeId, treeNode) {
            $('#xz_direction').val(treeNode.name).attr({ "code": treeNode.id });
        }
    });
    $('#line-position').next().css('top', '-4px');
    //按组织机构选择设备编号控件
    $('#TJ-loco').LocoSelect({
        position: 'MonitorLocoAlarmList'
    });
    $('#JD-loco').LocoSelect({
        position: 'MonitorLocoAlarmList'
    });
    //纯设备编号控件
    $('#TJ-loco').inputSelect({
        type: 'loca',
        contant: 2
    });
    $('#JD-loco').inputSelect({
        type: 'loca',
        contant: 2
    });
    $('#TJ-loco').next().css('top', '3px');
    $('#JD-loco').next().css('top', '3px');
    //默认时间
    document.getElementById('TJ-GD-star').value = "1900-03-22 00:00:00";//DateLastWeekTime() + "00:00:00";
    document.getElementById('TJ-GD-end').value = "2099-03-22 00:00:00";//dateNowStr() + "23:59:59";
    document.getElementById('TJ-CL-star').value = "1900-03-22 00:00:00";//DateLastWeekTime() + "00:00:00";
    document.getElementById('TJ-CL-end').value = "2099-03-22 00:00:00"; //dateNowStr() + "23:59:59";
    document.getElementById('JD-star').value = "1900-03-22 00:00:00";//DateLastWeekTime() + "00:00:00";
    document.getElementById('JD-end').value = "2099-03-22 00:00:00"; //dateNowStr() + "23:59:59";

    //供电视图、车辆视图切换
    $(".TJ-GD-control").unbind("click").click(function () {
        $(this).addClass("TJ-nav-active").siblings().removeClass("TJ-nav-active");
        $("#TJ-GD-condition").show();
        $("#TJ-CL-condition").hide();
    });
    $(".TJ-CL-control").unbind("click").click(function () {
        $(this).addClass("TJ-nav-active").siblings().removeClass("TJ-nav-active");
        $("#TJ-GD-condition").hide();
        $("#TJ-CL-condition").show();
        if ($("#TJ-CL-content").text() == "") {
            CL_doquery();
        }
    });

    //硬盘数据统计、统计信息生成进度切换
    $(".harddisk-TJ-control").unbind("click").click(function () {
        $(this).addClass("nav-active").siblings().removeClass("nav-active");
        $("#harddisk-TJ").show();
        $("#harddisk-JD").hide();
    });
    $(".harddisk-JD-control").unbind("click").click(function () {
        $(this).addClass("nav-active").siblings().removeClass("nav-active");
        $("#harddisk-TJ").hide();
        $("#harddisk-JD").show();
        if ($("#JD-body").text() == "") {
            JD_doquery();
        }
    });

    TJ_doquery(); // 供电视图查询

    //点击供电视图查询按钮
    $('.TJ-GD-query').click(function () {
        TJ_doquery();
    });
    //点击车辆视图查询按钮
    $('.TJ-CL-query').click(function () {
        CL_doquery();
    });
    //点击进度查询按钮
    $(".JD-query").click(function () {
        JD_doquery();
    });

    //关闭当前页
    $('.j-close').click(function () {
        window.close();
    });

});


//供电查询
function TJ_doquery() {

    var positionCode = $("#line-position").attr("code");
    var positionType = $("#line-position").attr("treetype");
    if (positionType == "") {
        positionType = "LINE";
    }
    var TJ_GD_star = $('#TJ-GD-star').val(); //开始时间
    var TJ_GD_end = $('#TJ-GD-end').val(); //结束时间
    checktime(TJ_GD_star, TJ_GD_end);
    if ($('#TJ-GD-paging .pageValue').val() != undefined) {
        pageIndex = $('#TJ-GD-paging .pageValue').val();
    }
    var _url = '/Common/MHardDisk/RemoteHandlers/HardDiskData.ashx?&active=PowerStatistics'
        + '&positiontype=' + positionType
        + '&positioncode=' + positionCode
        + '&starttime=' + TJ_GD_star
        + '&endtime=' + TJ_GD_end
        +'&pagesize='+pageSize
        +'&pageindex=' + pageIndex;

    layer.load();
    $('#TJ-GD-paging').paging({
        index: 1,
        url: function () { return _url },
        success: function (data) {
            layer.closeAll('loading');
            var _JSON = data;
            if (_JSON.data.length > 0) {
                var _HTML = '<table id="TJ-GD-table">';
                document.getElementById("TJ-GD-content").innerHTML = ""; //清空内容
                for (var i = 0; i < _JSON.data.length; i++) {
                    var imgsrc;
                    if (_JSON.data[i].loco_list.length > 0) {
                        imgsrc = '<span class="line_Click harddisk-ico harddisk-open-ico"></span>';
                    } else {
                        imgsrc = '<span class="harddisk-ico harddisk-close-ico"></span>';
                    }
                    _HTML += '<tr class="oneindex"><td class="TJ-GD-default" colspan="2"><span>' + _JSON.data[i].line_name + '&nbsp;&nbsp;' + _JSON.data[i].direction + '&nbsp;&nbsp;(' + _JSON.data[i].loco_count + '条)</span>&nbsp;&nbsp;' + imgsrc + '</td><td class="TJ-GD-newL">' + _JSON.data[i].line_name + '<br />' + _JSON.data[i].direction + '<br />（' + _JSON.data[i].loco_count + '条）<br /><span class="harddisk-ico harddisk-close-ico"></span></td><td class="TJ-GD-newR"></td></tr>';
                }
                _HTML += '</table>';
                document.getElementById("TJ-GD-content").innerHTML = _HTML;
                line_click(_JSON.data); //线路点击下一层

            } else {
                layer.msg("无数据!");
                document.getElementById("TJ-GD-content").innerHTML = ""; //清空内容
            }
        }
    });
};

//车辆查询
function CL_doquery() {

    var TJ_loco = $("#TJ-loco").val(); //车号
    var TJ_CL_star = $('#TJ-CL-star').val(); //开始时间
    var TJ_CL_end = $('#TJ-CL-end').val(); //结束时间
    checktime(TJ_CL_star, TJ_CL_end);
    if ($('#TJ-CL-paging .pageValue').val() != undefined) {
        pageIndex = $('#TJ-CL-paging .pageValue').val();
    }
    var _Url = '/Common/MHardDisk/RemoteHandlers/HardDiskData.ashx?&active=P_ORG_Statistics'
        + '&locomotivecode=' + TJ_loco
        + '&starttime=' + TJ_CL_star
        + '&endtime=' + TJ_CL_end
        + '&pagesize=' + pageSize
        + '&pageindex=' + pageIndex;

    layer.load();
    $('#TJ-CL-paging').paging({
        index: 1,
        url: function () { return _Url },
        success: function (data) {
            layer.closeAll('loading');
            var _JSON = data;
            if (_JSON.data.length > 0) {
                var _HTML = '<table id="TJ-CL-table">';
                document.getElementById("TJ-CL-content").innerHTML = ""; //清空内容
                for (var i = 0; i < _JSON.data.length; i++) {
                    var imgsrc;
                    if (_JSON.data[i].date_list.length > 0) {
                        imgsrc = '<span class="loco_Click harddisk-ico harddisk-open-ico"></span>';
                    } else {
                        imgsrc = '<span class="harddisk-ico harddisk-close-ico"></span>';
                    }
                    _HTML += '<tr class="oneindex"><td class="TJ-CL-default" colspan="2"><span>' + _JSON.data[i].locomotive_code + '&nbsp;&nbsp;(' + _JSON.data[i].run_date + '次)</span>&nbsp;&nbsp;' + imgsrc + '</td><td class="TJ-CL-newL">' + _JSON.data[i].locomotive_code + '<br />（' + _JSON.data[i].run_date + '次）<br /><span class="harddisk-ico harddisk-close-ico"></span></td><td class="TJ-CL-newR"></td></tr>';
                }
                _HTML += '</table>';
                document.getElementById("TJ-CL-content").innerHTML = _HTML;
                loco_Click(_JSON.data); //车号点击下一层

            } else {
                layer.msg("无数据!");
                document.getElementById("TJ-CL-content").innerHTML = ""; //清空内容
            }
        }
    });
};

//时间检验
function checktime(time1, time2) {

    if ('' !== time1 && '' !== time2) {
        if (time1 > time2) {
            tip('开始时间须小于结束时间', '#s-time', 3000, 'top');
            $('.layui-layer-tips .layui-layer-content').css({ 'min-width': '12px' });
            return;
        }
    }
    if ('' === time1) {
        tip('请选择开始时间', '#s-time', 3000, 'top');
        $('.layui-layer-tips .layui-layer-content').css({ 'min-width': '12px' });
        return;
    }
    if ('' === time2) {
        tip('请选择结束时间', '#e-time', 3000, 'top');
        $('.layui-layer-tips .layui-layer-content').css({ 'min-width': '12px' });
        return;
    }
};


//供电视图点击展开第二层
function line_click(data) {
    $(".line_Click").unbind('click').click(function () {
        var tagetDOM = $(this).parent().siblings('.TJ-GD-newR');
        var Index = $(this).parent().parent().index();
        $(this).parent().hide();
        $(this).parent().siblings().show();
        if (tagetDOM.html() != "") {
            LOCO_Click(data); //区站点击下一层
            return;
        } else {
            var _innerhtml = '<table class="GD-newR-tab">';
            for (var y = 0; y < data[Index].loco_list.length; y++) {
                var _imgsrc;

                if (data[Index].loco_list[y].position_list.length > 0) {
                    _imgsrc = '<span class="LOCO_Click harddisk-ico harddisk-open-ico"></span>';
                } else {
                    _imgsrc = '<span class="harddisk-ico harddisk-close-ico"></span>';
                }
                _innerhtml += '<tr><td class="GD-new-left jumpdiv" colspan="2" locomotivecode="' + data[Index].loco_list[y].locomotive_code + '" linecode="' + data[Index].loco_list[y].line_code + '" linename="' + data[Index].loco_list[y].line_name + '" positioncode="" positionname="" direction="' + data[Index].loco_list[y].direction + '" p_date="' + data[Index].loco_list[y].loco_end_date.split(" ")[0] + '" starttime="' + data[Index].loco_list[y].loco_start_date + '" endtime="' + data[Index].loco_list[y].loco_end_date + '" starttimestamp="' + data[Index].loco_list[y].loco_start_timestamp + '" endtimestamp="' + data[Index].loco_list[y].loco_end_timestamp + '">' + data[Index].loco_list[y].loco_start_date + '--' + data[Index].loco_list[y].loco_end_date.split(" ")[1] + '&nbsp;&nbsp;' + data[Index].loco_list[y].locomotive_code + '&nbsp;&nbsp;' + _imgsrc + '</td><td class="GD-new-right"></td></tr>';
            }
            _innerhtml += '</table>';
            tagetDOM.html(_innerhtml);
            LOCO_Click(data); //区站点击下一层
            showDiv();
        }
    })
    $(".TJ-GD-newL>span.harddisk-close-ico").unbind("click").click(function () {
        $(this).parent().hide();
        $(this).parent().siblings('.TJ-GD-newR').hide();
        $(this).parent().siblings('.TJ-GD-default').show();
    });
};

//供电视图点击展开第三层
function LOCO_Click(Data) {
    $(".LOCO_Click").unbind('click').click(function () {
        var _tagetDOM = $(this).parent().siblings('.GD-new-right');
        var trindex = $(this).parents("tr.oneindex").index();
        var _Index = $(this).parent().parent().index();
        _tagetDOM.toggle();
        if ($(this).hasClass("harddisk-open-ico")) {
            $(this).addClass("harddisk-close-ico").removeClass("harddisk-open-ico");
            $(this).parent().css({ "text-align": "center", "text-indent": "initial" });
            $(this).parent().removeAttr("colspan");
        } else {
            $(this).addClass("harddisk-open-ico").removeClass("harddisk-close-ico");
            $(this).parent().css({ "text-align": "left", "text-indent": "2em" });
            $(this).parent().attr("colspan", "2");
        }
        if (_tagetDOM.html() != "") {
            return;
        } else {
            var _html = '';
            for (var x = 0; x < Data[trindex].loco_list[_Index].position_list.length; x++) {
                _html += '<div class="jumpdiv" locomotivecode="' + Data[trindex].loco_list[_Index].position_list[x].locomotive_code + '" linecode="' + Data[trindex].loco_list[_Index].position_list[x].line_code + '" linename="' + Data[trindex].loco_list[_Index].position_list[x].line_name + '" positioncode="' + Data[trindex].loco_list[_Index].position_list[x].position_code + '" positionname="' + Data[trindex].loco_list[_Index].position_list[x].position_name + '" direction="' + Data[trindex].loco_list[_Index].position_list[x].direction + '" p_date="' + Data[trindex].loco_list[_Index].position_list[x].position_end_date.split(" ")[0] + '" starttime="' + Data[trindex].loco_list[_Index].position_list[x].position_start_date + '" endtime="' + Data[trindex].loco_list[_Index].position_list[x].position_end_date + '" starttimestamp="' + Data[trindex].loco_list[_Index].position_list[x].position_start_timestamp + '" endtimestamp="' + Data[trindex].loco_list[_Index].position_list[x].position_end_timestamp + '">' + Data[trindex].loco_list[_Index].position_list[x].position_start_date.split(" ")[1] + '--' + Data[trindex].loco_list[_Index].position_list[x].position_end_date.split(" ")[1] + '<br /> ' + Data[trindex].loco_list[_Index].position_list[x].position_name + '</div>'
            }
            _tagetDOM.html(_html);
            showDiv();
        }
    })
};

//车辆视图点击展开第二层
function loco_Click(DATA) {
    $(".loco_Click").unbind('click').click(function () {
        var tagetDOM = $(this).parent().siblings('.TJ-CL-newR');
        var Index = $(this).parent().parent().index();
        $(this).parent().hide();
        $(this).parent().siblings().show();
        if (tagetDOM.html() != "") {
            time_Click(DATA); //时间点击下一层
            return;
        } else {
            var _innerhtml = '<table class="CL-newR-tab">';
            for (var y = 0; y < DATA[Index].date_list.length; y++) {
                var _imgsrc;

                if (DATA[Index].date_list[y].line_list.length > 0) {
                    _imgsrc = '<span class="time_Click harddisk-ico harddisk-open-ico"></span>';
                } else {
                    _imgsrc = '<span class="harddisk-ico harddisk-close-ico"></span>';
                }
                _innerhtml += '<tr class="twoindex"><td class="CL-new-left jumpdiv" colspan="2" locomotivecode="' + DATA[Index].date_list[y].locomotive_code + '" linecode="" linename="" positioncode="" positionname="" direction="" p_date="' + DATA[Index].date_list[y].date + '" starttime="' + DATA[Index].date_list[y].date_start_time + '" endtime="' + DATA[Index].date_list[y].date_end_time + '" starttimestamp="' + DATA[Index].date_list[y].date_start_timestamp + '" endtimestamp="' + DATA[Index].date_list[y].date_end_timestamp + '">' + DATA[Index].date_list[y].date + '&nbsp;&nbsp;' + DATA[Index].date_list[y].date_start_time + '--' + DATA[Index].date_list[y].date_end_time + '&nbsp;&nbsp;' + _imgsrc + '</td><td class="CL-new-right"></td></tr>';
            }
            _innerhtml += '</table>';
            tagetDOM.html(_innerhtml);
            time_Click(DATA); //时间点击下一层
            showDiv();
        }
    })
    $(".TJ-CL-newL>span.harddisk-close-ico").unbind("click").click(function () {
        $(this).parent().hide();
        $(this).parent().siblings('.TJ-CL-newR').hide();
        $(this).parent().siblings('.TJ-CL-default').show();
    });
};
//车辆视图点击展开第三层
function time_Click(data) {
    $(".time_Click").unbind('click').click(function () {
        var _tagetDOM = $(this).parent().siblings('.CL-new-right');
        var trindex = $(this).parents("tr.oneindex").index();
        var _Index = $(this).parent().parent().index();
        if ($(this).hasClass("harddisk-open-ico")) {
            $(this).addClass("harddisk-close-ico").removeClass("harddisk-open-ico");
            $(this).parent().css({ "text-align": "center", "text-indent": "initial" });
            $(this).parent().removeAttr("colspan");
            _tagetDOM.show();
        } else {
            $(this).addClass("harddisk-open-ico").removeClass("harddisk-close-ico");
            $(this).parent().css({ "text-align": "left", "text-indent": "2em" });
            $(this).parent().attr("colspan", "3");
            _tagetDOM.hide();
        }
        if (_tagetDOM.html() != "") {
            LINE_Click(data);//线路点击下一层
            return;
        } else {
            var _html = '<table class="CL-newR-tab2">';
            for (var x = 0; x < data[trindex].date_list[_Index].line_list.length; x++) {
                var _imgsrc;

                if (data[trindex].date_list[_Index].line_list[x].position_list.length > 0) {
                    _imgsrc = '<span class="LINE_Click harddisk-ico harddisk-open-ico"></span>';
                } else {
                    _imgsrc = '<span class="harddisk-ico harddisk-close-ico"></span>';
                }
                _html += '<tr><td class="CL-new-left2 jumpdiv" colspan="2" locomotivecode="' + data[trindex].date_list[_Index].line_list[x].locomotive_code + '" linecode="' + data[trindex].date_list[_Index].line_list[x].line_code + '" linename="' + data[trindex].date_list[_Index].line_list[x].line_name + '" positioncode="" positionname="" direction="' + data[trindex].date_list[_Index].line_list[x].direction + '" p_date="' + data[trindex].date_list[_Index].line_list[x].date + '" starttime="' + data[trindex].date_list[_Index].line_list[x].line_start_time + '" endtime="' + data[trindex].date_list[_Index].line_list[x].line_end_time + '" starttimestamp="' + data[trindex].date_list[_Index].line_list[x].line_start_timestamp + '" endtimestamp="' + data[trindex].date_list[_Index].line_list[x].line_end_timestamp + '">' + data[trindex].date_list[_Index].line_list[x].line_start_time + '--' + data[trindex].date_list[_Index].line_list[x].line_end_time + '&nbsp;&nbsp;' + data[trindex].date_list[_Index].line_list[x].line_name + '&nbsp;&nbsp;' + data[trindex].date_list[_Index].line_list[x].direction + '&nbsp;&nbsp;' + _imgsrc + '</td><td class="CL-new-right2"></td></tr>';
            }
            _html += '</table>';
            _tagetDOM.html(_html);
            LINE_Click(data);//线路点击下一层
            showDiv();
        }
    })
};
//车辆视图点击展开第四层
function LINE_Click(data) {
    $(".LINE_Click").unbind('click').click(function () {
        var _tagetDOM = $(this).parent().siblings('.CL-new-right2');
        var oneindex = $(this).parents("tr.oneindex").index();
        var twoindex = $(this).parents("tr.twoindex").index();
        var _Index = $(this).parent().parent().index();
        _tagetDOM.toggle();
        if ($(this).hasClass("harddisk-open-ico")) {
            $(this).addClass("harddisk-close-ico").removeClass("harddisk-open-ico");
            $(this).parent().css({ "text-align": "center", "text-indent": "initial" });
            $(this).parent().removeAttr("colspan");
        } else {
            $(this).addClass("harddisk-open-ico").removeClass("harddisk-close-ico");
            $(this).parent().css({ "text-align": "left", "text-indent": "2em" });
            $(this).parent().attr("colspan", "2");
        }
        if (_tagetDOM.html() != "") {
            return;
        } else {
            var _html = '';
            for (var x = 0; x < data[oneindex].date_list[twoindex].line_list[_Index].position_list.length; x++) {
                if (data[oneindex].date_list[twoindex].line_list[_Index].position_list[x].position_start_time == "-" && data[oneindex].date_list[twoindex].line_list[_Index].position_list[x].position_start_time == "-") {
                    continue;
                } else {
                    _html += '<div class="jumpdiv" locomotivecode="' + data[oneindex].date_list[twoindex].line_list[_Index].position_list[x].locomotive_code + '" linecode="' + data[oneindex].date_list[twoindex].line_list[_Index].position_list[x].line_code + '" linename="' + data[oneindex].date_list[twoindex].line_list[_Index].position_list[x].line_name + '" positioncode="' + data[oneindex].date_list[twoindex].line_list[_Index].position_list[x].position_code + '" positionname="' + data[oneindex].date_list[twoindex].line_list[_Index].position_list[x].position_name + '" direction="' + data[oneindex].date_list[twoindex].line_list[_Index].position_list[x].direction + '" p_date="' + data[oneindex].date_list[twoindex].line_list[_Index].position_list[x].date + '" starttime="' + data[oneindex].date_list[twoindex].line_list[_Index].position_list[x].position_start_time + '" endtime="' + data[oneindex].date_list[twoindex].line_list[_Index].position_list[x].position_end_time + '" starttimestamp="' + data[oneindex].date_list[twoindex].line_list[_Index].position_list[x].position_start_timestamp + '" endtimestamp="' + data[oneindex].date_list[twoindex].line_list[_Index].position_list[x].position_end_timestamp + '">' + data[oneindex].date_list[twoindex].line_list[_Index].position_list[x].position_start_time + '--' + data[oneindex].date_list[twoindex].line_list[_Index].position_list[x].position_end_time + '<br /> ' + data[oneindex].date_list[twoindex].line_list[_Index].position_list[x].position_name + '</div>'
                }
            }
            _tagetDOM.html(_html);
            showDiv();
        }
    })
};

//进度查询
function JD_doquery() {

    var JD_loco = $("#JD-loco").val(); //车号
    var JD_star = $('#JD-star').val(); //开始时间
    var JD_end = $('#JD-end').val(); //结束时间
    checktime(JD_star, JD_end);
    var JD_type = $("#JD_type").val(); //任务类型
    var JD_state = $("#JD_state").val(); //任务状态
    if ($('#JD-paging .pageValue').val() != undefined) {
        pageIndex = $('#JD-paging .pageValue').val();
    }
    var _url = '/Common/MHardDisk/RemoteHandlers/HardDiskData.ashx?&active=StatisticsProgress'
        + '&locomotivecode=' + JD_loco
        + '&tasktype=' + JD_type
        + '&taskstatus=' + JD_state
        + '&starttime=' + JD_star
        + '&endtime=' + JD_end
        + '&pagesize=' + pageSize
        + '&pageindex=' + pageIndex;

    layer.load();
    $('#JD-paging').paging({
        index: 1,
        url: function () { return _url },
        success: function (data) {
            layer.closeAll('loading');
            var _JSON = data;
            if (_JSON.data.length > 0) {
                var _HTML = "";
                document.getElementById("JD-body").innerHTML = ""; //清空内容
                for (var i = 0; i < _JSON.data.length; i++) {
                    _HTML += '<li><span>' + _JSON.data[i].locomotive_code + '</span><span>' + _JSON.data[i].task_date + '</span><span>' + _JSON.data[i].start_time + '</span><span>' + _JSON.data[i].end_time + '</span><span>' + _JSON.data[i].task_type + '</span><div><span>' + _JSON.data[i].task_status + '</span><div class="layui-progress layui-progress-big" lay-filter="demo" lay-showPercent="true"><div class="layui-progress-bar layui-bg-blue" lay-percent="' + _JSON.data[i].task_progress + '%"></div></div></div></li>'
                }
                document.getElementById("JD-body").innerHTML = _HTML;
                
                layui.use('element', function () {
                    var element = layui.element();
                    element.init();
                });

            } else {
                layer.msg("无数据!");
                document.getElementById("JD-body").innerHTML = ""; //清空内容
            }
        }
    });
};

//移入添加弹出框
function showDiv() {
    $(".jumpdiv").hover(function () {
        //e.stopPropagation（）//终止冒泡事件
        $(".hoverDiv").remove();
        var html = "";
        html = '<div class="hoverDiv"><ul><li><span class="harddisk-ico harddisk-gj-ico TJ-GD-GJ"></span><span>&nbsp;图形化轨迹</span></li><li><span class="harddisk-ico harddisk-play-ico TJ-GD-PLAY"></span><span>&nbsp;播&nbsp;&nbsp;&nbsp;&nbsp;放</span></li><li><span class="harddisk-ico harddisk-xz-ico TJ-GD-XZ"></span><span>&nbsp;修正位置</span></li></ul></div>';
        $(this).append(html);
        threeClick() //弹出框事件
        $("#TJ-CL-table>tbody>tr:first-child>.TJ-CL-newR tr:first-child>.CL-new-left>.hoverDiv").css("top", $(".CL-new-left").height());
    }, function () {
        $(".hoverDiv").remove();
    })
};


//弹出框事件
function threeClick() {

    //图形化轨迹
    $(".TJ-GD-GJ").click(function () {
        //alert("图形化轨迹");
        var Dom = $(this).parent().parent().parent().parent(".jumpdiv");
        var loco = Dom.attr("locomotivecode"); //车号
        var p_date = Dom.attr("p_date"); //日期
        var starttime = Dom.attr("starttime"); //开始时间
        var endtime = Dom.attr("endtime"); //结束时间
        var _url;
        if (starttime.indexOf("/") != -1) {
            _url = '/Common/MGIS/OrbitGIS.htm?Category_Code=DPC&deviceid=' + loco + '&startdate=' + starttime + '&enddate=' + endtime + '&v=' + version;
        } else {
            _url = '/Common/MGIS/OrbitGIS.htm?Category_Code=DPC&deviceid=' + loco + '&startdate=' + p_date + ' ' + starttime + '&enddate=' + p_date + ' ' + endtime + '&v=' + version;
        }

        window.open(_url);
    });

    //播放
    $(".TJ-GD-PLAY").click(function () {
        //alert("播放");
        var Dom = $(this).parent().parent().parent().parent(".jumpdiv");
        var loco = Dom.attr("locomotivecode"); //车号
        var lineCode = Dom.attr("linecode"); //线路code
        var lineName = Dom.attr("linename"); //线路名
        var positionCode = Dom.attr("positioncode"); //区站code
        var positionName = Dom.attr("positionname"); //区站名
        var DR = Dom.attr("direction"); //行别
        var p_date = Dom.attr("p_date"); //日期
        var starttime = Dom.attr("starttime"); //开始时间
        var endtime = Dom.attr("endtime"); //结束时间
        var starttimestamp = Dom.attr("starttimestamp"); //开始时间
        var endtimestamp = Dom.attr("endtimestamp"); //结束时间
        var Url;
        if (starttime.indexOf("/") != -1) {
            Url = '/Common/LineInspectionDataAnalysis/LineInspection_data_analysis.html?'
                + '&line_code=' + escape(lineCode)
                + '&line_name=' + escape(lineName)
                + '&direction=' + escape(DR)
                + '&position_code=' + escape(positionCode)
                + '&position_name=' + escape(positionName)
                + '&start_time=' + starttime
                + '&end_time=' + endtime
                + '&starttimestamp=' + starttimestamp
                + '&endtimestamp=' + endtimestamp
                + '&locomotive_code=' + loco
        } else {
            Url = '/Common/LineInspectionDataAnalysis/LineInspection_data_analysis.html?'
                + '&line_code=' + escape(lineCode)
                + '&line_name=' + escape(lineName)
                + '&direction=' + escape(DR)
                + '&position_code=' + escape(positionCode)
                + '&position_name=' + escape(positionName)
                + '&start_time=' + p_date + ' ' + starttime
                + '&end_time=' + p_date + ' ' + endtime
                + '&starttimestamp=' + starttimestamp
                + '&endtimestamp=' + endtimestamp
                + '&locomotive_code=' + loco
        }
        
        window.open(Url, "_blank");

    });

    //修正位置
    $(".TJ-GD-XZ").click(function () {
        var Dom = $(this).parent().parent().parent().parent(".jumpdiv");
        var loco = Dom.attr("locomotivecode"); //车号
        var lineCode = Dom.attr("linecode"); //线路code
        var lineName = Dom.attr("linename"); //线路名
        var DR = Dom.attr("direction"); //行别
        if (lineName == "无线路" || lineName == "-") {
            lineName = "";
            lineCode = "";
        }
        if (DR == "无行别" || DR == "-") {
            DR = "";
        }
        var p_date = Dom.attr("p_date"); //日期
        var starttime = Dom.attr("starttime"); //开始时间
        var endtime = Dom.attr("endtime"); //结束时间
        var starttimestamp = Dom.attr("starttimestamp"); //开始时间戳
        var endtimestamp = Dom.attr("endtimestamp"); //结束时间戳
        //加载弹出框
        layer.open({
            title: false,
            closeBtn: 0,
            area: '300px',
            type: 1,
            shade: 0.5,
            content: $("#replaceAddr")
        });
        $("#xz_line").val(lineName).attr("code", lineCode);

        $("#xz_direction").val(DR).attr("code", DR);

        $("#replaceAddr_btn").unbind("click").click(function () {
            var linecode = $("#xz_line").attr("code");; //线路
            var direction = $("#xz_direction").attr("code"); //行别
            if (linecode == "" || linecode == undefined || linecode == "无线路") {
                layer.msg("请选择线路!");
                return;
            }
            if (direction == "" || direction == undefined || direction == "无行别") {
                layer.msg("请选择行别!");
                return;
            }
            replaceAddr_xz(loco, p_date, starttimestamp, endtimestamp, linecode, direction);
        });
    });
};

//修正位置

function replaceAddr_xz(loco, p_date, starttimestamp, endtimestamp, linecode, direction) {
    var _url;
    
    _url = '/Common/MHardDisk/RemoteHandlers/HardDiskData.ashx?active=ModifyPosition&locomotivecode=' + loco + '&linecode=' + linecode + '&direction=' + direction + '&p_date=' + p_date + '&starttime=' + starttimestamp + '&endtime=' + endtimestamp;
    $.ajax({
        type: "POST",
        url: _url,
        ansyc: true,
        cache: false,
        success: function (result) {
            console.log(result);
            if (result == "1") {
                layer.closeAll();
                layer.msg("修正成功!");
            } else {
                layer.msg("修正失败!");
            }
        }
    });
};

