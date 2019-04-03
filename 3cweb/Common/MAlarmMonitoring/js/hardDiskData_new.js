//全局变量
var pageSize = 11; //一页显示条数
var pageIndex = 1; //某页
var re;
var loadingLayer=false;//标准线是准备完毕
var fixicon = false;//修正图标是否展示

$(function () {
    if (FunEnable('Fun_fixHarddiskData') == "True" ){
        $('#JD_type').parent().show();
        fixicon = true;
    }
    if ($(document).height() < 910) {
        pageSize = 9;
    };
    if ($(document).height() < 770) {
        pageSize = 7;
    };
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
    $('#line').mySelectTree({
        tag: 'LINE',
        height: 250,
        enableFilter: true,
        filterNumber: 2,
        onClick: function (event, treeId, treeNode) {
            $('#line').attr("value", "");
            $('#line').val(treeNode.name).attr({ "code": treeNode.id, "treetype": treeNode.treeType });
        }
    });
    //行别
    $('#xz_direction').mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: '3C',
        cateGory: 'DRTFLG',
        enableFilter: false,
        onClick: function (event, treeId, treeNode) {
            $("#xz_direction").attr('code', treeNode.id).val(treeNode.name);
        }
    });
    $('#direction').mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: '3C',
        cateGory: 'DRTFLG',
        enableFilter: false,
        onClick: function (event, treeId, treeNode) {
            $("#direction").attr('code', treeNode.id).val(treeNode.name);
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
    //组织机构
    $('#ddlorg').mySelectTree({
        tag: 'ORGANIZATION',
        //     type: jsonUser.orgcode,
        enableFilter: true,
        onClick: function (event, treeId, treeNode) {
            $("#hf_ddlorg").val(treeNode.id);
            $("#ddlorg").val(treeNode.name);
            $("#hf_type_ddlorg").val(treeNode.treeType);
        }
    });
    $("#ddlorg").siblings("a").click(function () {
        $("#hf_ddlorg").val("");
    });

    $('#TJ-loco').next().css('top', '3px');
    $('#JD-loco').next().css('top', '3px');
    //默认时间
    document.getElementById('TJ-GD-star').value = dateHalfYearStr() + "00:00:00";
    document.getElementById('TJ-GD-end').value = dateNowStr() + "23:59:59";
    document.getElementById('TJ-CL-star').value = dateHalfYearStr() + "00:00:00"; //"2016-11-18 00:00:00"; 
    document.getElementById('TJ-CL-end').value = dateNowStr() + "23:59:59";
    document.getElementById('TJ-LINE-star').value = dateNowMouth();
    //document.getElementById('TJ-LINE-end').value = dateNowStr();
    document.getElementById('JD-star').value = dateHalfYearStr();
    document.getElementById('JD-end').value = dateNowStr();


    $("#harddisk-Record>iframe").attr('src', '/Common/MAlarmMonitoring/hardDisk_Record.html?category=3C&v=' + version);

    //供电视图、车辆视图、标准线路切换
    $(".TJ-GD-control").unbind("click").click(function () {
        $(this).addClass("TJ-nav-active").siblings().removeClass("TJ-nav-active");
        $("#TJ-GD-condition").show();
        $("#TJ-CL-condition").hide();
        $("#TJ-LINE-condition").hide();
    });
    $(".TJ-CL-control").unbind("click").click(function () {
        $(this).addClass("TJ-nav-active").siblings().removeClass("TJ-nav-active");
        $("#TJ-GD-condition").hide();
        $("#TJ-LINE-condition").hide();
        $("#TJ-CL-condition").show();
        if ($("#TJ-CL-content").text() == "") {
            CL_doquery();
        }
    });
    $(".TJ-LINE-control").unbind("click").click(function () {
        $(this).addClass("TJ-nav-active").siblings().removeClass("TJ-nav-active");
        $("#TJ-GD-condition").hide();
        $("#TJ-CL-condition").hide();
        $("#TJ-LINE-condition").show();
        if ($("#TJ-LINE-content").text() == "") {
            LINE_doquery();
        }
    });

    //硬盘数据统计、统计信息生成进度、硬盘取盘记录切换
    $(".harddisk-TJ-control").unbind("click").click(function () {
        $(this).addClass("nav-active").siblings().removeClass("nav-active");
        $("#harddisk-TJ").show();
        $("#harddisk-JD").hide();
        $("#harddisk-Record").hide();
    });
    $(".harddisk-JD-control").unbind("click").click(function () {
        $(this).addClass("nav-active").siblings().removeClass("nav-active");
        $("#harddisk-Record").hide();
        $("#harddisk-TJ").hide();
        $("#harddisk-JD").show();
        if ($("#JD-body").text() == "") {
            JD_doquery();
        }
    });
    $(".harddisk-Record-control").unbind("click").click(function () {
        $('#harddisk-Record').height($(window).height() - 143)
        $(this).addClass("nav-active").siblings().removeClass("nav-active");
        $("#harddisk-TJ").hide();
        $("#harddisk-JD").hide();
        $("#harddisk-Record").show();
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
    //点击标准线路查询按钮
    $('.TJ-LINE-query').click(function () {
        LINE_doquery();
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
    if (!checktime(TJ_GD_star, TJ_GD_end, '#TJ-GD-star', '#TJ-GD-end')) {
        return;
    }
    layer.load();
    $('#TJ-GD-paging').paging({
        index: 1,
        url: function () {
            pageIndex = $('#TJ-GD-paging .pageValue').val();
            var _url = '/Common/MHardDisk/RemoteHandlers/HardDiskData.ashx?&active=PowerStatistics'
                    + '&positiontype=' + positionType
                    + '&positioncode=' + positionCode
                    + '&starttime=' + TJ_GD_star
                    + '&endtime=' + TJ_GD_end
                    + '&pagesize=' + pageSize
                    + '&pageindex=' + pageIndex;
            return _url
        },
        success: function (data) {
            layer.closeAll('loading');
            var _JSON = data;
            if (_JSON.data.length > 0) {
                var _HTML = '<table id="TJ-GD-table"><tr class="GD_titleTR"><td class="GD_title_line GD_title">线路</td><td class="GD_title_loco GD_title">设备编号</td><td class="GD_title_pos GD_title">区站</td></tr>';
                document.getElementById("TJ-GD-content").innerHTML = ""; //清空内容
                for (var i = 0; i < _JSON.data.length; i++) {
                    var imgsrc;
                    if (_JSON.data[i].loco_list.length > 0) {
                        imgsrc = '<span class="line_Click harddisk-ico harddisk-open-ico"></span>';
                    } else {
                        imgsrc = '<span class="harddisk-ico harddisk-close-ico"></span>';
                    }
                    if (_JSON.data[i].line_name == '无线路' || _JSON.data[i].direction == '无行别') {
                        _HTML += '<tr class="GD_content_tr hoverTR" style="display:none"><td class="GD_content_line"><span title="' + _JSON.data[i].line_name + '&nbsp;&nbsp;' + _JSON.data[i].direction + '&nbsp;&nbsp;(' + _JSON.data[i].loco_count + '次)">' + _JSON.data[i].line_name + '&nbsp;&nbsp;' + _JSON.data[i].direction + '&nbsp;&nbsp;(' + _JSON.data[i].loco_count + '次)</span>&nbsp;&nbsp;' + imgsrc + '</td><td class="GD_content_loco"><ul></ul></td><td class="GD_content_pos"><div class="GD_content_posdiv"></div></td></tr>';
                    } else {
                        _HTML += '<tr class="GD_content_tr hoverTR"><td class="GD_content_line"><span title="' + _JSON.data[i].line_name + '&nbsp;&nbsp;' + _JSON.data[i].direction + '&nbsp;&nbsp;(' + _JSON.data[i].loco_count + '次)">' + _JSON.data[i].line_name + '&nbsp;&nbsp;' + _JSON.data[i].direction + '&nbsp;&nbsp;(' + _JSON.data[i].loco_count + '次)</span>&nbsp;&nbsp;' + imgsrc + '</td><td class="GD_content_loco"><ul></ul></td><td class="GD_content_pos"><div class="GD_content_posdiv"></div></td></tr>';
                    }
                    
                }
                _HTML += '</table>';
                document.getElementById("TJ-GD-content").innerHTML = _HTML;
                line_click(_JSON.data); //线路点击下一层
                //滚动事件
                $("#TJ-GD-content").scroll(function () {
                    if ($(this).scrollTop() > 1) {
                        $(".GD_titleTR").css({ "position": "absolute", "z-index": "1", "background": "#ccc", "top": $("#inner_cont").scrollTop() + 'px' });
                        $(".GD_title_pos").width($("#TJ-GD-content").width()-615 + "px");
                    } else {
                        $(".GD_titleTR").css({ "position": "static", "background": "", "top": "" });
                        $(".GD_title_pos").width("");
                    }
                });
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
    if (!checktime(TJ_CL_star, TJ_CL_end, '#TJ-CL-star', '#TJ-CL-end')) {
        return;
    }

    layer.load();
    $('#TJ-CL-paging').paging({
        index: 1,
        url: function () {
            pageIndex = $('#TJ-CL-paging .pageValue').val();
            var _Url = '/Common/MHardDisk/RemoteHandlers/HardDiskData.ashx?&active=P_ORG_Statistics'
                    + '&locomotivecode=' + TJ_loco
                    + '&starttime=' + TJ_CL_star
                    + '&endtime=' + TJ_CL_end
                    + '&pagesize=' + pageSize
                    + '&pageindex=' + pageIndex;
            return _Url
        },
        success: function (data) {
            layer.closeAll('loading');
            var _JSON = data;
            if (_JSON.data.length > 0) {
                var _HTML = '<table id="TJ-CL-table"><tr class="CL_titleTR"><td class="CL_title_loco CL_title">设备编号</td><td class="CL_title_time CL_title">时间</td><td class="CL_title_line CL_title">线路</td><td class="CL_title_pos CL_title">区站</td></tr>';
                document.getElementById("TJ-CL-content").innerHTML = ""; //清空内容
                for (var i = 0; i < _JSON.data.length; i++) {
                    var imgsrc;
                    if (_JSON.data[i].date_list.length > 0) {
                        imgsrc = '<span class="loco_Click harddisk-ico harddisk-open-ico"></span>';
                    } else {
                        imgsrc = '<span class="harddisk-ico harddisk-close-ico"></span>';
                    }
                    _HTML += '<tr class="CL_content_tr hoverTR"><td class="CL_content_loco"><span>' + _JSON.data[i].locomotive_code + '&nbsp;&nbsp;(' + _JSON.data[i].run_date + '次)</span>&nbsp;&nbsp;' + imgsrc + '</td><td class="CL_content_time"><ul></ul></td><td class="CL_content_line"><ul></ul></td><td class="CL_content_pos"><div class="CL_content_posdiv"></div></td></tr>';
                }
                _HTML += '</table>';
                document.getElementById("TJ-CL-content").innerHTML = _HTML;
                loco_Click(_JSON.data); //车号点击下一层
                //滚动事件
                $("#TJ-CL-content").scroll(function () {
                    if ($(this).scrollTop() > 1) {
                        $(".CL_titleTR").css({ "position": "absolute", "z-index": "1", "background": "#ccc", "top": $("#inner_cont").scrollTop() + 'px' });
                        $(".CL_title_pos").width($("#TJ-CL-content").width() - 760 + "px");
                    } else {
                        $(".CL_titleTR").css({ "position": "static", "background": "", "top": "" });
                        $(".CL_title_pos").width("");
                    }
                });

            } else {
                layer.msg("无数据!");
                document.getElementById("TJ-CL-content").innerHTML = ""; //清空内容
            }
        }
    });
};

//标准线路查询
function LINE_doquery() {
    var line_Code = $("#line").attr("code"); //线路code
    var direction_Code = $("#direction").attr("code"); //行别
    var ddlorg_Code = $("#hf_ddlorg").val(); //组织机构code
    var ddlorg_Type = $("#hf_type_ddlorg").val(); //组织机构type
    if (ddlorg_Code == '') { ddlorg_Type='' }
    var TJ_LINE_star = $('#TJ-LINE-star').val(); //开始日期
    //var TJ_LINE_end = $('#TJ-LINE-end').val(); //结束日期
    //if (!checktime(TJ_LINE_star, TJ_LINE_end, '#TJ-LINE-star', '#TJ-LINE-end')) {
    //    return;
    //}
    //if (TJ_LINE_star == '') {
    //    layer.msg('请选择时间！')
    //    return;
    //}
    layer.load();
    $('#TJ-LINE-paging').paging({
        index: 1,
        url: function () {
            pageIndex = $('#TJ-LINE-paging .pageValue').val();
            var _Url = '/Common/MHardDisk/RemoteHandlers/HardDiskStandard.ashx?&active=GetList'
                    + '&line_Code=' + escape(line_Code)
                    + '&direction_Code=' + escape(direction_Code)
                    + '&ddlorg_Code=' + ddlorg_Code
                    + '&ddlorg_Type=' + ddlorg_Type
                    + '&starttime=' + TJ_LINE_star
                    //+ '&endtime=' + TJ_LINE_end
                    + '&pagesize=' + pageSize
                    + '&pageindex=' + pageIndex;
            return _Url
        },
        success: function (data) {
            layer.closeAll('loading');
            var _JSON = data;
            if (_JSON.data.length > 0) {
                var _HTML = '<table id="TJ-LINE-table"><tr class="LINE_titleTR"><td class="LINE_title_date LINE_title">日期</td><td class="LINE_title_line LINE_title">线路</td><td class="LINE_title_ju LINE_title">局</td><td class="LINE_title_duan LINE_title">段</td></tr>';
                document.getElementById("TJ-LINE-content").innerHTML = ""; //清空内容
                for (var i = 0; i < _JSON.data.length; i++) {
                    var imgsrc;
                    if (_JSON.data[i].bureau_list.length > 0) {
                        imgsrc = '<span class="sta_line_Click harddisk-ico harddisk-open-ico"></span>';
                    } else {
                        imgsrc = '<span class="harddisk-ico harddisk-close-ico"></span>';
                    }
                    _HTML += '<tr class="LINE_content_tr hoverTR" stime="' + _JSON.data[i].date + '"><td class="LINE_content_date">' + _JSON.data[i].date.replace("-", "年") + '月</td><td class="LINE_content_line"><span class="jumpdiv" linecode="' + _JSON.data[i].line_code + '" linename="' + _JSON.data[i].line_name + '" direction="' + _JSON.data[i].direction + '" bureaucode="" bureauname="" orgcode="" orgname="">' + _JSON.data[i].line_name + '&nbsp;&nbsp;' + _JSON.data[i].direction + '</span>&nbsp;&nbsp;' + imgsrc + '</td><td class="LINE_content_ju"><ul></ul></td><td class="LINE_content_duan"><div class="LINE_content_duandiv"></div></td></tr>';
                }
                _HTML += '</table>';
                document.getElementById("TJ-LINE-content").innerHTML = _HTML;
                sta_line_click(_JSON.data); //线路点击下一层
                showDiv();
                //滚动事件
                $("#TJ-LINE-content").scroll(function () {
                    if ($(this).scrollTop() > 1) {
                        $(".LINE_titleTR").css({ "position": "absolute", "z-index": "1", "background": "#ccc", "top": $("#inner_cont").scrollTop() + 'px' });
                        $(".LINE_title_duan").width($("#TJ-LINE-content").width() - 700 + "px");
                    } else {
                        $(".LINE_titleTR").css({ "position": "static", "background": "", "top": "" });
                        $(".LINE_title_duan").width("");
                    }
                });
            } else {
                layer.msg("无数据!");
                document.getElementById("TJ-LINE-content").innerHTML = ""; //清空内容
            }
        }
    });
};

//时间检验
function checktime(time1, time2,el1,el2) {

    if ('' !== time1 && '' !== time2) {
        if (time1 > time2) {
            tip('开始时间须小于结束时间', el1, 3000, 'top');
            $('.layui-layer-tips .layui-layer-content').css({ 'min-width': '12px' });
            return false;
        }
    }
    if ('' === time1) {
        tip('请选择开始时间', el1, 3000, 'top');
        $('.layui-layer-tips .layui-layer-content').css({ 'min-width': '12px' });
        return false;
    }
    if ('' === time2) {
        tip('请选择结束时间', el2, 3000, 'top');
        $('.layui-layer-tips .layui-layer-content').css({ 'min-width': '12px' });
        return false;
    }
    return true;
};

//供电视图点击展开第二层
function line_click(data) {
    $(".line_Click").unbind('click').click(function () {
        var tagetDOM = $(this).parent().siblings('.GD_content_loco').find("ul");
        var Index = $(this).parent().parent().index()-1;
        if ($(this).hasClass("harddisk-open-ico")) {
            $(this).addClass("harddisk-close-ico").removeClass("harddisk-open-ico");
            tagetDOM.show();
            $(this).parent().parent().addClass("colorTR");
        } else {
            $(this).addClass("harddisk-open-ico").removeClass("harddisk-close-ico");
            tagetDOM.hide();
            $(this).parent().parent().find(".addback").remove();
            tagetDOM.find("span").addClass("harddisk-open-ico").removeClass("harddisk-close-ico");
            tagetDOM.find("li").css("background", "#F1FFE0");
            $(this).parent().siblings('.GD_content_pos').find(".GD_content_posdiv").hide();
            $(this).parent().parent().removeClass("colorTR");
        }
        if (tagetDOM.html() != "") {
            LOCO_Click(data); //区站点击下一层
            return;
        } else {
            var _innerhtml = '';
            for (var y = 0; y < data[Index].loco_list.length; y++) {
                var _imgsrc;

                if (data[Index].loco_list[y].position_list.length > 0) {
                    _imgsrc = '<span class="LOCO_Click harddisk-ico harddisk-open-ico"></span>';
                } else {
                    _imgsrc = '<span class="harddisk-ico harddisk-close-ico"></span>';
                }
                _innerhtml += '<li class="jumpdiv" locomotivecode="' + data[Index].loco_list[y].locomotive_code + '" linecode="' + data[Index].loco_list[y].line_code + '" linename="' + data[Index].loco_list[y].line_name + '" positioncode="" positionname="" direction="' + data[Index].loco_list[y].direction + '" p_date="' + data[Index].loco_list[y].loco_end_date.split(" ")[0] + '" starttime="' + data[Index].loco_list[y].loco_start_date + '" endtime="' + data[Index].loco_list[y].loco_end_date + '" starttimestamp="' + data[Index].loco_list[y].loco_start_timestamp + '" endtimestamp="' + data[Index].loco_list[y].loco_end_timestamp + '"><div class="jump_div">' + data[Index].loco_list[y].loco_start_date + '--' + data[Index].loco_list[y].loco_end_date.split(" ")[1] + '&nbsp;&nbsp;' + data[Index].loco_list[y].locomotive_code + '</div>&nbsp;&nbsp;' + _imgsrc + '</li>';
            }
            tagetDOM.html(_innerhtml);
            LOCO_Click(data); //区站点击下一层
            showDiv();
        }
    })
};

//供电视图点击展开第三层
function LOCO_Click(Data) {
    $(".LOCO_Click").unbind('click').click(function () {
        var _tagetDOM = $(this).parent().parent().parent().siblings('.GD_content_pos').children(".GD_content_posdiv");
        _tagetDOM.hide();
        _height = $(this).parent().parent().parent().height() - 31;
        _tagetDOM.css("min-height", _height+'px');
        var trindex = $(this).parents("tr.GD_content_tr").index() -1;
        var _Index = $(this).parent().index();
        if ($(this).hasClass("harddisk-open-ico")) {
            $(this).addClass("harddisk-close-ico").removeClass("harddisk-open-ico");
            $(this).parent().siblings().children("span").removeClass("harddisk-close-ico").addClass("harddisk-open-ico");
            $(this).parent().css("background", "#fff");
            $(this).parent().siblings().css("background", "#F1FFE0");
            _tagetDOM.show();
            addback(this);
            $(this).parent().siblings().children(".addback").remove();
        } else {
            $(this).addClass("harddisk-open-ico").removeClass("harddisk-close-ico");
            $(this).parent().css("background", "#F1FFE0");
            _tagetDOM.hide();
            $(this).siblings(".addback").remove();
        }
        var _html = '';
        for (var x = 0; x < Data[trindex].loco_list[_Index].position_list.length; x++) {
            _html += '<div class="jumpdiv" locomotivecode="' + Data[trindex].loco_list[_Index].position_list[x].locomotive_code + '" linecode="' + Data[trindex].loco_list[_Index].position_list[x].line_code + '" linename="' + Data[trindex].loco_list[_Index].position_list[x].line_name + '" positioncode="' + Data[trindex].loco_list[_Index].position_list[x].position_code + '" positionname="' + Data[trindex].loco_list[_Index].position_list[x].position_name + '" direction="' + Data[trindex].loco_list[_Index].position_list[x].direction + '" p_date="' + Data[trindex].loco_list[_Index].position_list[x].position_end_date.split(" ")[0] + '" starttime="' + Data[trindex].loco_list[_Index].position_list[x].position_start_date + '" endtime="' + Data[trindex].loco_list[_Index].position_list[x].position_end_date + '" starttimestamp="' + Data[trindex].loco_list[_Index].position_list[x].position_start_timestamp + '" endtimestamp="' + Data[trindex].loco_list[_Index].position_list[x].position_end_timestamp + '">' + Data[trindex].loco_list[_Index].position_list[x].position_start_date.split(" ")[1] + '--' + Data[trindex].loco_list[_Index].position_list[x].position_end_date.split(" ")[1] + '<br /> ' + Data[trindex].loco_list[_Index].position_list[x].position_name + '</div>'
        }
        _tagetDOM.html(_html);
        showDiv();
    })
};

//车辆视图点击展开第二层
function loco_Click(DATA) {
    $(".loco_Click").unbind('click').click(function () {
        var tagetDOM = $(this).parent().siblings('.CL_content_time').find("ul");
        var Index = $(this).parent().parent().index() - 1;
        if ($(this).hasClass("harddisk-open-ico")) {
            $(this).addClass("harddisk-close-ico").removeClass("harddisk-open-ico");
            tagetDOM.show();
            $(this).parent().parent().addClass("colorTR");
        } else {
            $(this).addClass("harddisk-open-ico").removeClass("harddisk-close-ico");
            tagetDOM.hide();
            $(this).parent().parent().find(".addback").remove();
            tagetDOM.find("span").addClass("harddisk-open-ico").removeClass("harddisk-close-ico");
            tagetDOM.find("li").css("background", "#F1FFE0");
            $(this).parent().siblings('.CL_content_line').find("ul").hide();
            $(this).parent().siblings('.CL_content_pos').find(".CL_content_posdiv").hide();
            $(this).parent().parent().removeClass("colorTR");
        }
        if (tagetDOM.html() != "") {
            time_Click(DATA); //时间点击下一层
            return;
        } else {
            var _innerhtml = '';
            for (var y = 0; y < DATA[Index].date_list.length; y++) {
                var _imgsrc;

                if (DATA[Index].date_list[y].line_list.length > 0) {
                    _imgsrc = '<span class="time_Click harddisk-ico harddisk-open-ico"></span>';
                } else {
                    _imgsrc = '<span class="harddisk-ico harddisk-close-ico"></span>';
                }
                _innerhtml += '<li class="jumpdiv" locomotivecode="' + DATA[Index].date_list[y].locomotive_code + '" linecode="" linename="" positioncode="" positionname="" direction="" p_date="' + DATA[Index].date_list[y].date + '" starttime="' + DATA[Index].date_list[y].date_start_time + '" endtime="' + DATA[Index].date_list[y].date_end_time + '" starttimestamp="' + DATA[Index].date_list[y].date_start_timestamp + '" endtimestamp="' + DATA[Index].date_list[y].date_end_timestamp + '"><div class="jump_div">' + DATA[Index].date_list[y].date + '&nbsp;&nbsp;' + DATA[Index].date_list[y].date_start_time + '--' + DATA[Index].date_list[y].date_end_time + '</div>&nbsp;&nbsp;' + _imgsrc + '</li>';
            }
            tagetDOM.html(_innerhtml);
            time_Click(DATA); //时间点击下一层
            showDiv();
        }
    })
};
//车辆视图点击展开第三层
function time_Click(data) {
    $(".time_Click").unbind('click').click(function () {
        var _tagetDOM = $(this).parent().parent().parent().siblings('.CL_content_line').find("ul");
        _height = $(this).parent().parent().height();
        _tagetDOM.css("min-height", _height + 'px');
        var trindex = $(this).parents("tr.CL_content_tr").index() - 1;
        var _Index = $(this).parent().index();
        if ($(this).hasClass("harddisk-open-ico")) {
            $(this).addClass("harddisk-close-ico").removeClass("harddisk-open-ico");
            $(this).parent().siblings().children("span").removeClass("harddisk-close-ico").addClass("harddisk-open-ico");
            $(this).parent().css("background", "#fff");
            $(this).parent().siblings().css("background", "#F1FFE0");
            _tagetDOM.show();
            addback(this);
            $(this).parent().siblings().children(".addback").remove();
            $(this).parent().parent().parent().siblings('.CL_content_pos').find(".CL_content_posdiv").hide();
        } else {
            $(this).addClass("harddisk-open-ico").removeClass("harddisk-close-ico");
            $(this).parent().css("background", "#F1FFE0");
            _tagetDOM.hide();
            $(this).parents("tr.CL_content_tr").find(".addback").remove();
            $(this).parent().parent().parent().siblings('.CL_content_pos').find(".CL_content_posdiv").hide();
        }
        var _html = '';
        for (var x = 0; x < data[trindex].date_list[_Index].line_list.length; x++) {
            var _imgsrc;

            if (data[trindex].date_list[_Index].line_list[x].position_list.length > 0) {
                _imgsrc = '<span class="LINE_Click harddisk-ico harddisk-open-ico"></span>';
            } else {
                _imgsrc = '<span class="harddisk-ico harddisk-close-ico"></span>';
            }
            _html += '<li class="jumpdiv" locomotivecode="' + data[trindex].date_list[_Index].line_list[x].locomotive_code + '" linecode="' + data[trindex].date_list[_Index].line_list[x].line_code + '" linename="' + data[trindex].date_list[_Index].line_list[x].line_name + '" positioncode="" positionname="" direction="' + data[trindex].date_list[_Index].line_list[x].direction + '" p_date="' + data[trindex].date_list[_Index].line_list[x].date + '" starttime="' + data[trindex].date_list[_Index].line_list[x].line_start_time + '" endtime="' + data[trindex].date_list[_Index].line_list[x].line_end_time + '" starttimestamp="' + data[trindex].date_list[_Index].line_list[x].line_start_timestamp + '" endtimestamp="' + data[trindex].date_list[_Index].line_list[x].line_end_timestamp + '"><i class="time_img"></i><div class="jump_div">' + data[trindex].date_list[_Index].line_list[x].line_start_time + '--' + data[trindex].date_list[_Index].line_list[x].line_end_time + '&nbsp;&nbsp;' + data[trindex].date_list[_Index].line_list[x].line_name + '&nbsp;&nbsp;' + data[trindex].date_list[_Index].line_list[x].direction + '</div>&nbsp;&nbsp;' + _imgsrc + '</li>';
            _tagetDOM.html(_html);
            LINE_Click(data);//线路点击下一层
            showDiv();
            if (FunEnable('Fun_fixHarddiskData') == "True") {
                time_img_click()
            }
        }
    })
};
//车辆视图点击展开第四层
function LINE_Click(data) {
    $(".LINE_Click").unbind('click').click(function () {
        var _tagetDOM = $(this).parent().parent().parent().siblings('.CL_content_pos').children(".CL_content_posdiv");
        _height = $(this).parent().parent().parent().height() - 31;
        _tagetDOM.css("min-height", _height + 'px');
        var oneindex = $(this).parents("tr.CL_content_tr").index() - 1;
        var twoindex = $(this).parents("td.CL_content_line").siblings('td.CL_content_time').find(".harddisk-close-ico").parent().index();
        var _Index = $(this).parent().index();
        if ($(this).hasClass("harddisk-open-ico")) {
            $(this).addClass("harddisk-close-ico").removeClass("harddisk-open-ico");
            $(this).parent().siblings().children("span").removeClass("harddisk-close-ico").addClass("harddisk-open-ico");
            _tagetDOM.show();
            addimg(this);
        } else {
            $(this).addClass("harddisk-open-ico").removeClass("harddisk-close-ico");
            _tagetDOM.hide();
            $(".addimg").remove();
        }
        var _html = '';
        _tagetDOM.html("");
        for (var x = 0; x < data[oneindex].date_list[twoindex].line_list[_Index].position_list.length; x++) {
            if (data[oneindex].date_list[twoindex].line_list[_Index].position_list[x].position_start_time == "-" && data[oneindex].date_list[twoindex].line_list[_Index].position_list[x].position_start_time == "-") {
                continue;
            } else {
                _html += '<div class="jumpdiv" locomotivecode="' + data[oneindex].date_list[twoindex].line_list[_Index].position_list[x].locomotive_code + '" linecode="' + data[oneindex].date_list[twoindex].line_list[_Index].position_list[x].line_code + '" linename="' + data[oneindex].date_list[twoindex].line_list[_Index].position_list[x].line_name + '" positioncode="' + data[oneindex].date_list[twoindex].line_list[_Index].position_list[x].position_code + '" positionname="' + data[oneindex].date_list[twoindex].line_list[_Index].position_list[x].position_name + '" direction="' + data[oneindex].date_list[twoindex].line_list[_Index].position_list[x].direction + '" p_date="' + data[oneindex].date_list[twoindex].line_list[_Index].position_list[x].date + '" starttime="' + data[oneindex].date_list[twoindex].line_list[_Index].position_list[x].position_start_time + '" endtime="' + data[oneindex].date_list[twoindex].line_list[_Index].position_list[x].position_end_time + '" starttimestamp="' + data[oneindex].date_list[twoindex].line_list[_Index].position_list[x].position_start_timestamp + '" endtimestamp="' + data[oneindex].date_list[twoindex].line_list[_Index].position_list[x].position_end_timestamp + '">' + data[oneindex].date_list[twoindex].line_list[_Index].position_list[x].position_start_time + '--' + data[oneindex].date_list[twoindex].line_list[_Index].position_list[x].position_end_time + '<br /> ' + data[oneindex].date_list[twoindex].line_list[_Index].position_list[x].position_name + '</div>'
            }
            _tagetDOM.html(_html);
            showDiv();
        }
    })
};

//标准线路点击展开第二层
function sta_line_click(data) {
    $(".sta_line_Click").unbind('click').click(function () {
        var tagetDOM = $(this).parent().siblings('.LINE_content_ju').find("ul");
        var Index = $(this).parent().parent().index() - 1;
        if ($(this).hasClass("harddisk-open-ico")) {
            $(this).addClass("harddisk-close-ico").removeClass("harddisk-open-ico");
            tagetDOM.show();
            $(this).parent().parent().addClass("colorTR");
        } else {
            $(this).addClass("harddisk-open-ico").removeClass("harddisk-close-ico");
            tagetDOM.hide();
            $(this).parent().parent().find(".addback").remove();
            tagetDOM.find("span").addClass("harddisk-open-ico").removeClass("harddisk-close-ico");
            tagetDOM.find("li").css("background", "#F1FFE0");
            $(this).parent().siblings('.LINE_content_duan').find(".LINE_content_duandiv").hide();
            $(this).parent().parent().removeClass("colorTR");
        }
        if (tagetDOM.html() != "") {
            JU_Click(data); //区站点击下一层
            return;
        } else {
            var _innerhtml = '';
            for (var y = 0; y < data[Index].bureau_list.length; y++) {
                var _imgsrc;

                if (data[Index].bureau_list[y].org_list.length > 0) {
                    _imgsrc = '<span class="JU_Click harddisk-ico harddisk-open-ico"></span>';
                } else {
                    _imgsrc = '<span class="harddisk-ico harddisk-close-ico"></span>';
                }
                _innerhtml += '<li class="jumpdiv" linecode="' + data[Index].bureau_list[y].line_code + '" linename="' + data[Index].bureau_list[y].line_name + '" direction="' + data[Index].bureau_list[y].direction + '"bureaucode="' + data[Index].bureau_list[y].bureau_code + '" bureauname="' + data[Index].bureau_list[y].bureau_name + '" orgcode="" orgname=""><div class="jump_div">' + data[Index].bureau_list[y].bureau_name + '</div>&nbsp;&nbsp;' + _imgsrc + '</li>';
            }
            tagetDOM.html(_innerhtml);
            JU_Click(data); //区站点击下一层
            showDiv();
        }
    })
};

//标准线路点击展开第三层
function JU_Click(Data) {
    $(".JU_Click").unbind('click').click(function () {
        var _tagetDOM = $(this).parent().parent().parent().siblings('.LINE_content_duan').children(".LINE_content_duandiv");
        _tagetDOM.hide();
        _height = $(this).parent().parent().parent().height() - 31;
        _tagetDOM.css("min-height", _height + 'px');
        var trindex = $(this).parents("tr.LINE_content_tr").index() - 1;
        var _Index = $(this).parent().index();
        if ($(this).hasClass("harddisk-open-ico")) {
            $(this).addClass("harddisk-close-ico").removeClass("harddisk-open-ico");
            $(this).parent().siblings().children("span").removeClass("harddisk-close-ico").addClass("harddisk-open-ico");
            $(this).parent().css("background", "#fff");
            $(this).parent().siblings().css("background", "#F1FFE0");
            _tagetDOM.show();
            addback(this);
            $(this).parent().siblings().children(".addback").remove();
        } else {
            $(this).addClass("harddisk-open-ico").removeClass("harddisk-close-ico");
            $(this).parent().css("background", "#F1FFE0");
            _tagetDOM.hide();
            $(this).siblings(".addback").remove();
        }
        var _html = '';
        for (var x = 0; x < Data[trindex].bureau_list[_Index].org_list.length; x++) {
            if (Data[trindex].bureau_list[_Index].org_list[x].org_name.indexOf(",") != -1) {
                continue;
            }else{
                _html += '<div class="jumpdiv" linecode="' + Data[trindex].bureau_list[_Index].org_list[x].line_code + '" linename="' + Data[trindex].bureau_list[_Index].org_list[x].line_name + '" bureaucode="' + Data[trindex].bureau_list[_Index].org_list[x].bureau_code + '" bureauname="' + Data[trindex].bureau_list[_Index].org_list[x].bureau_name + '" direction="' + Data[trindex].bureau_list[_Index].org_list[x].direction + '" orgcode="' + Data[trindex].bureau_list[_Index].org_list[x].org_code + '" orgname="' + Data[trindex].bureau_list[_Index].org_list[x].org_name + '">' + Data[trindex].bureau_list[_Index].org_list[x].org_name + '</div>'
            }
        }
        _tagetDOM.html(_html);
        showDiv();
    })
};


//进度查询
function JD_doquery() {

    var JD_loco = $("#JD-loco").val(); //车号
    var JD_star = $('#JD-star').val(); //开始时间
    var JD_end = $('#JD-end').val(); //结束时间
    //var JD_CJstar = $('#CJ-star').val(); //创建任务开始时间
    //var JD_CJend = $('#CJ-end').val(); //创建任务结束时间
    if (!checktime(JD_star, JD_end, '#JD-star', '#JD-end')) {
        return;
    }
    //if (!checktime(JD_CJstar, JD_CJend, '#CJ-star', '#CJ-end')) {
    //    return;
    //}
    var JD_type = $("#JD_type").val(); //任务类型
    var JD_state = $("#JD_state").val(); //任务状态
    layer.load();
    $('#JD-paging').paging({
        index: 1,
        url: function () {
            pageIndex = $('#JD-paging .pageValue').val();
            var _url = '/Common/MHardDisk/RemoteHandlers/HardDiskData.ashx?&active=StatisticsProgress'
                    + '&locomotivecode=' + JD_loco
                    + '&tasktype=' + JD_type
                    + '&taskstatus=' + JD_state
                    + '&starttime=' + JD_star
                    + '&endtime=' + JD_end
                    + '&pagesize=' + pageSize
                    + '&pageindex=' + pageIndex;
            return _url
        },
        success: function (data) {
            layer.closeAll('loading');
            var _JSON = data;
            if (_JSON.data.length > 0) {
                var _HTML = "";
                document.getElementById("JD-body").innerHTML = ""; //清空内容
                for (var i = 0; i < _JSON.data.length; i++) {

                    //var layuiProgress;
                    //if (_JSON.data[i].task_type == "重算" || _JSON.data[i].task_status == "统计完成") {
                    //    layuiProgress = "";
                    //} else {
                    //    layuiProgress = '<div class="layui-progress layui-progress-big" lay-filter="demo" lay-showPercent="true"><div class="layui-progress-bar layui-bg-blue" lay-percent="' + _JSON.data[i].task_progress + '%"></div></div>';
                    //}

                    _HTML += '<li><span>' + _JSON.data[i].locomotive_code + '</span><span>' + _JSON.data[i].task_date + '</span><span>' + _JSON.data[i].start_time + '</span><span>' + _JSON.data[i].end_time + '</span><span>' + _JSON.data[i].create_time + '</span><span>' + _JSON.data[i].task_type + '</span><div><span>' + _JSON.data[i].task_status + '</span></div></li>'
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

//白色背景
function addback(obj) {
    $(obj).siblings(".addback").remove();
    var _Html = "";
    _Html = '<div class="addback"></div>';
    $(obj).parent().append(_Html);
};
//三角图形
function addimg(obj) {
    $(".addimg").remove();
    var _Html = "";
    _Html = '<img class="addimg" src="/Common/MAlarmMonitoring/img/sanjiao.png" />';
    $(obj).parent().append(_Html);
};

//移入添加弹出框
function showDiv() {
    $(".jumpdiv").hover(function () {
        $(".hoverDiv").remove();
        var html = "";
        html = '<div class="hoverDiv"><div class="hoverDiv_bg"></div><ul><li><a href="javascript:void(0);" class="TJ-GD-GJ"><img src="/Common/MAlarmMonitoring/img/tuxing.png" title="图形化轨迹" /></a></li><li><a href="javascript:void(0);" class="TJ-GD-PLAY"><img src="/Common/MAlarmMonitoring/img/play.png" title="播放" /></a></li><li class="' + (fixicon?'':'hidden') + '"><a href="javascript:void(0);" class="TJ-GD-XZ"><img src="/Common/MAlarmMonitoring/img/xiuzheng.png" title="修正位置" /></a></li><li><a href="javascript:void(0);" class="TJ-LINE-PLAY"><img src="/Common/MAlarmMonitoring/img/play.png" title="播放" /></a></li></ul></div>';
        $(this).append(html);
        threeClick();
    }, function () {
        $(".hoverDiv").remove();
    })
};


//弹出框事件
function threeClick() {

    //图形化轨迹
    $(".TJ-GD-GJ").click(function () {
        var Dom = $(this).parent().parent().parent().parent(".jumpdiv");
        var loco = Dom.attr("locomotivecode"); //车号
        var p_date = Dom.attr("p_date"); //日期
        var starttime = Dom.attr("starttime"); //开始时间
        var endtime = Dom.attr("endtime"); //结束时间
        var _url;
        if (starttime.indexOf("-") != -1) {
            _url = '/Common/MGIS/OrbitGIS.htm?Category_Code=DPC&deviceid=' + loco + '&startdate=' + starttime + '&enddate=' + endtime + '&v=' + version;
        } else {
            _url = '/Common/MGIS/OrbitGIS.htm?Category_Code=DPC&deviceid=' + loco + '&startdate=' + p_date + ' ' + starttime + '&enddate=' + p_date + ' ' + endtime + '&v=' + version;
        }

        window.open(_url);
    });

    //播放
    $(".TJ-GD-PLAY").click(function () {
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
        var bigStarttime;
        var bigEndtime;
        if ($(".TJ-GD-control").hasClass("TJ-nav-active")) {
            bigStarttime = $('#TJ-GD-star').val();
            bigEndtime = $('#TJ-GD-end').val();
        } else {
            bigStarttime = $('#TJ-CL-star').val();
            bigEndtime = $('#TJ-CL-end').val();
        }
        
        

        if (starttime.indexOf("-") != -1) {
            Url = '/Common/LineInspectionDataAnalysis/LineInspection_data_analysis.html?'
                + '&line_code=' + escape(lineCode)
                + '&line_name=' + escape(lineName)
                + '&direction=' + escape(DR)
                + '&position_code=' + escape(positionCode)
                + '&position_name=' + escape(positionName)
                + '&start_time=' + starttime
                + '&end_time=' + endtime
                + '&bigStarttime=' + bigStarttime
                + '&bigEndtime=' + bigEndtime
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
                + '&bigStarttime=' + bigStarttime
                + '&bigEndtime=' + bigEndtime
                + '&starttimestamp=' + starttimestamp
                + '&endtimestamp=' + endtimestamp
                + '&locomotive_code=' + loco
        }
        
        window.open(Url, "_blank");

    });

    //修正位置
    $(".TJ-GD-XZ").click(function () {
        $("#xz_star").hide();
        $("#xz_end").hide();
        $("#full_gj").hide();
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

    //标准线路播放
    $(".TJ-LINE-PLAY").click(function () {
        var Dom = $(this).parent().parent().parent().parent(".jumpdiv");
        var lineCode = Dom.attr("linecode"); //线路code
        var lineName = Dom.attr("linename"); //线路name
        var bureau_code = Dom.attr("bureaucode"); //局code
        var bureau_name = Dom.attr("bureauname"); //局name
        var DR = Dom.attr("direction"); //行别
        var org_code = Dom.attr("orgcode"); //段code
        var org_name = Dom.attr("orgname"); //段name
        var mouth = $(this).parents('.LINE_content_tr').attr('stime');//月份
        var starttime = dateNowMouthLastdate(mouth)[0]; //开始时间
        var endtime = dateNowMouthLastdate(mouth)[1]; //结束时间
        var Url;

        Url = '/Common/LineInspectionDataAnalysis/LineInspection_data_analysis.html?'
            + '&line_code=' + escape(lineCode)
            + '&line_name=' + escape(lineName)
            + '&bureau_code=' + escape(bureau_code)
            + '&bureau_name=' + escape(bureau_name)
            + '&direction=' + escape(DR)
            + '&org_code=' + escape(org_code)
            + '&org_name=' + escape(org_name)
            + '&start_time=' + starttime
            + '&end_time=' + endtime
            + '&isFromStandardLine=true';

        var _url = '/Common/MHardDisk/RemoteHandlers/HardDiskStandard.ashx?active=GetStatus'
            + '&line_code=' + escape(lineCode)
            + '&bureauc_code=' + escape(bureau_code)
            + '&direction=' + escape(DR)
            + '&org_code=' + escape(org_code)
            + '&month=' + mouth;
        StandardLineStart(_url, Url)
        

    });
};

//蒙版层  播放初次准许请求
function StandardLineStart(url,opendURL) {
    $.ajax({
        url: url,
        ansyc: true,
        cache: false,
        beforeSend: function () {
            layer.msg('标准线路生成中...', { icon: 16, shade: 0.3, time: 0, closeBtn: 1 });
        },
        success: function (re) {
            if (re.data != 'True') {
                loadingLayer = true;
                setTimeout(function(){
                    StandardLineFor(url, opendURL)
                },200) 
            } else {
                layer.closeAll();
                window.open(opendURL, "_blank");
            }
        },
        error: function () {
            layer.msg('标准线播放数据获取失败!')
        }
    })

}
function StandardLineFor(url, opendURL) {
    $.ajax({
        url: url,
        ansyc: true,
        cache: false,
        success: function (re) {
            if (re.data != 'True') {
                setTimeout(function () {
                    StandardLineFor(url, opendURL)
                }, 200)
            } else {
                if ($('.layui-layer-content').length > 0) {
                    layer.closeAll();
                    window.open(opendURL, "_blank");
                }

            }
        },
        error: function () {
            layer.msg('标准线播放数据获取失败!')
        }
    })

}

//修正位置

function replaceAddr_xz(loco, p_date, starttimestamp, endtimestamp, linecode, direction) {
    var _url;
    layer.load();
    _url = '/Common/MHardDisk/RemoteHandlers/HardDiskData.ashx?active=ModifyPosition&locomotivecode=' + loco + '&linecode=' + linecode + '&direction=' + direction + '&p_date=' + p_date + '&starttime=' + starttimestamp + '&endtime=' + endtimestamp;
    $.ajax({
        type: "POST",
        url: _url,
        ansyc: true,
        cache: false,
        success: function (result) {
            layer.closeAll('loading');
            console.log(result);
            if (result == "1") {
                layer.closeAll();
                layer.msg("修正成功!");
                CL_doquery();
            } else {
                layer.msg("修正失败!");
            }
        }
    });
};

//获取半年前日期
function dateHalfYearStr() {
    var beforeDate = new Date();
    beforeDate.setTime(beforeDate.getTime() - 1000 * 60 * 60 * 24 * 30 * 6);
    var strYear2 = beforeDate.getFullYear();
    var strMon2 = beforeDate.getMonth() + 1;
    var strDate2 = beforeDate.getDate();
    var ret = strYear2 + "-" + ("00" + strMon2).slice(-2) + "-" + ("00" + strDate2).slice(-2) + " ";
    return ret;
};
//获取当前月
function dateNowMouth() {
    var d = new Date();
    var ret = d.getFullYear() + "-";
    ret += ("00" + (d.getMonth() + 1)).slice(-2);
    //var day = new Date(d.getFullYear(), d.getMonth()+2, 0);
    //var lastdate = d.getFullYear() + '-' + (d.getMonth()+2) + '-' + day.getDate();//获取当月最后一天日期    
       // console.log(lastdate)
    return ret;
}
//获取当前月最后一天
function dateNowMouthLastdate(first) {
    
    var day = new Date(parseInt( first.split('-')[0]), parseInt(first.split('-')[1]), 0);
    var ret = first + "-01 00:00:00"
   
    var last = first + '-' + day.getDate() + " 23:59:59";//获取当月最后一天日期   
    var arry = new Array(2)
    arry[0] = ret;
    arry[1] = last;
    //alert(typeof (arry))
   return [ret, last];
}


//进度自动刷新

function JDfresh(obj) {
    var _src = $(obj).attr("src");
    if (_src == "img/no_chose1.png") {
        $(obj).attr("src", "img/chose.png");
        re = setInterval(JD_doquery, 5000);
    } else {
        $(obj).attr("src", "img/no_chose1.png");
        clearInterval(re);
    }
};


//车辆视图线路前面时间图标点击

function time_img_click() {
    $(".time_img").click(function () {
        var _this = $(this);
        layer.msg('请标记该条信息类型！', {
            time: 0 //不自动关闭
          , btn: ['标记开始', '标记结束', '取消标记']
          , yes: function (index) {
              var _tags = _this.parent().parent("ul").find(".endtime_img");
              layer.close(index);
              if (_this.parent().parent("ul").find(".startime_img").length >= 1) {
                  layer.msg('已经标志过开始时间点');
              } else {
                  layer.msg('已标记为开始时间');
                  _this.addClass("startime_img").removeClass("endtime_img").css("background-image", "url(/Common/MAlarmMonitoring/img/starting_time.png)");
                  if (_tags.length == 1 && _tags.parent().index() > _this.parent().index()) {
                      var star_dom = _this.parent("li.jumpdiv");
                      var end_dom = _tags.parent("li.jumpdiv");
                      full_xz(star_dom, end_dom);
                  }
              }
          }
          , btn2: function (index) {
              var _Tags = _this.parent().parent("ul").find(".startime_img");
              layer.close(index);
              if (_this.parent().parent("ul").find(".endtime_img").length >= 1) {
                  layer.msg('已经标志过结束时间点');
              } else {
                  layer.msg('已标记为结束时间');
                  _this.addClass("endtime_img").removeClass("startime_img").css("background-image", "url(/Common/MAlarmMonitoring/img/terminal_time.png)");
                  if (_Tags.length == 1 && _Tags.parent().index() < _this.parent().index()) {
                      var star_dom = _Tags.parent("li.jumpdiv");
                      var end_dom = _this.parent("li.jumpdiv");
                      full_xz(star_dom, end_dom);
                  }
              }
          }
        , btn3: function (index) {
            layer.close(index);
            layer.msg('已取消标记');
            _this.removeClass("startime_img endtime_img").css("background-image", "url(/Common/MAlarmMonitoring/img/default_time.png)");
        }
        });
    })

};


//批量修正位置
function full_xz(star_dom, end_dom) {
    $("#xz_star").show();
    $("#xz_end").show();
    $("#full_gj").show();
    var full_loco = star_dom.attr("locomotivecode"); //车号
    var full_p_date = star_dom.attr("p_date"); //日期
    var full_starttime = star_dom.attr("starttime"); //开始时间
    var full_endtime = end_dom.attr("endtime"); //结束时间
    var starttimestamp = star_dom.attr("starttimestamp"); //开始时间戳
    var endtimestamp = end_dom.attr("endtimestamp"); //结束时间戳
    layer.open({
        title: false,
        closeBtn: 0,
        area: '300px',
        type: 1,
        shade: 0.5,
        content: $("#replaceAddr")
    });
    $("#xz_star_time").val(full_p_date + " " + full_starttime);
    $("#xz_end_time").val(full_p_date + " " + full_endtime);
    $("#xz_line").val("").attr("code", ""); //清空线路
    $("#xz_direction").val("").attr("code", ""); //清空行别

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
        replaceAddr_xz(full_loco, full_p_date, starttimestamp, endtimestamp, linecode, direction);
    });
    //图形化轨迹
    $("#full_gj").click(function () {
        var _url = '/Common/MGIS/OrbitGIS.htm?Category_Code=DPC&deviceid=' + full_loco + '&startdate=' + full_p_date + ' ' + full_starttime + '&enddate=' + full_p_date + ' ' + full_endtime + '&v=' + version;
        window.open(_url);
    });
}