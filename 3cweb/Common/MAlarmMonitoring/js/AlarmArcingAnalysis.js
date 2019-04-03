//全局变量
var pageSize = 21; //一页显示条数
var pageIndex=1; //某页
var positionCode;
var positionType;
var direction;
var s_time;
var e_time;
var Emputy = "";
$(function () {
    //线路区站控件
    $('#line-position').mySelectTree({
        tag: 'STATIONSECTION',
        height: 250,
        enableFilter: true,
        filterNumber: 2,
        //enableCheck: true,
        //chkboxType: { "Y": "s", "N": "s" },
        //nocheck: true,
        //onCheck: function (event, treeId, treeNode) {
        //    var zTree = $.fn.zTree.getZTreeObj(treeId),
        //    nodes = zTree.getCheckedNodes(true),
        //     v = "", code = "";
        //    for (var i = 0, l = nodes.length; i < l; i++) {
        //        v += nodes[i].name + ",";
        //        code += nodes[i].id + ",";
        //    }
        //    if (v.length > 0) v = v.substring(0, v.length - 1);
        //    if (code.length > 0) code = code.substring(0, code.length - 1);
        //    var cityObj = $("#line-position");
        //    cityObj.attr("value", v).attr("code", code).attr("treetype", "LINE");
        //},
        onClick: function (event, treeId, treeNode) {
            //var treeObj = $.fn.zTree.getZTreeObj(treeId);
            //treeObj.checkAllNodes(false);
            $('#line-position').attr("value", "");
            $('#line-position').val(treeNode.name).attr({ "code": treeNode.id, "treetype": treeNode.treeType });
        }
    });
    $('#line-position').next().css('top', '-4px');
    $('#direction').mySelectTree({
        tag: 'Get_Drection',
        height: 50,
        width: 128,
        enableFilter: false,
        onClick: function (event, treeId, treeNode) {
            $('#direction').val(treeNode.name).attr({ "code": treeNode.id });
        }
    });
    $('#direction').next().css('top', '-4px');

    //默认时间
    document.getElementById('s-time').value = DateLastWeekTime() + "00:00:00";
    document.getElementById('e-time').value = dateNowStr() + "23:59:59";

    if ($(document).height() < 910) {
        pageSize = 18;
    };
    if ($(document).height() < 770) {
        pageSize = 15;
    };

    Dquery();

    //点击分析按钮
    $('.j-query-alarm').click(function () {
        Dquery();
    });

    //关闭当前页
    $('.j-close').click(function () {
        window.close();
    });
    //滚动事件
    $("#inner_cont").scroll(function () {
        if ($(this).scrollTop() > 1) {
            $(".inner-head").css({ "position": "absolute", "background": "#ccc", "top": $("#inner_cont").scrollTop() + 'px' });
        } else {
            $(".inner-head").css({ "position": "static", "background": "", "top": "" });
        }
    });
});


//查询
function Dquery() {

    positionCode = $("#line-position").attr("code");
    positionType = $("#line-position").attr("treetype");
    if (positionType == "") {
        positionType = "LINE";
    }
    direction = escape($("#direction").attr('code'));
    if ($("#direction").val() == '') {
        direction = "";
    }
    s_time = $('#s-time').val(); //开始时间
    e_time = $('#e-time').val(); //结束时间

    if ('' !== s_time && '' !== e_time) {
        if (s_time > e_time) {
            tip('开始时间须小于结束时间', '#s-time', 3000, 'top');
            $('.layui-layer-tips .layui-layer-content').css({ 'min-width': '12px' });
            return;
        }
    }
    if ('' === s_time) {
        tip('请选择开始时间', '#s-time', 3000, 'top');
        $('.layui-layer-tips .layui-layer-content').css({ 'min-width': '12px' });
        return;
    }
    if ('' === e_time) {
        tip('请选择结束时间', '#e-time', 3000, 'top');
        $('.layui-layer-tips .layui-layer-content').css({ 'min-width': '12px' });
        return;
    }

    layer.load();
    $('#paging').paging({
        index: 1,
        url: function () {
            pageIndex = $('.pageValue').val();
            var url = '/Common/MAlarmMonitoring/RemoteHandlers/AlarmArcingAnalysis.ashx?active=analyse'
            + '&positionCode=' + positionCode
            + '&positionType=' + positionType
            + '&startTime=' + s_time
            + '&endTime=' + e_time
            + '&direction=' + direction
            + '&pageSize=' + pageSize
            + '&pageIndex=' + pageIndex;
            return url;
        },
        //beforeSend: function () {
        //    $('#inner_body').html('<div id="loadingPage_1">数据加载中,请稍等...</div>');
        //},
        success: function (data) {
            layer.closeAll('loading');
            var _JSON = data;
            if (_JSON.data.length > 0) {
                var _HTML = "";
                document.getElementById("inner_body").innerHTML = ""; //清空内容

                for (var i = 0; i < _JSON.data.length; i++) {
                    var imgsrc;
                    var spack;
                    if (_JSON.positiontype == 'POSITION') {
                        if (_JSON.data[i].data[0].data.length > 0) {
                            imgsrc = '<img class="line_Click open_img" src="img/open.png" />';
                        } else {
                            imgsrc = '<img class="open_img" src="img/close.png" />';
                        }
                        if (_JSON.data[i].data[0].spark_rate == "-") {
                            spack = _JSON.data[i].data[0].spark_rate;
                        } else {
                            spack = _JSON.data[i].data[0].spark_rate + "%";
                        }
                        _HTML += '<div class="inner-body-one"><div class="one-content"><span class="little-Span">' + imgsrc + '</span><span class="big-Span">' + _JSON.data[i].data[0].position_name + '</span><span class="mid-Span">' + _JSON.data[i].data[0].direction + '</span><span class="big-Span">' + _JSON.data[i].data[0].date + '</span><span class="mid-Span">' + _JSON.data[i].data[0].loco_cnt + '</span><span class="big-Span">' + (_JSON.data[i].data[0].spark_cnt == "-" ? _JSON.data[i].data[0].spark_cnt : '<a href="javascript:void(0)" onclick=AAA_alarm("' + Emputy + '","' + _JSON.data[i].data[0].position_code + '","' + _JSON.data[i].data[0].position_name + '","' + _JSON.data[i].data[0].direction + '","' + _JSON.data[i].data[0].date + '","POSITION"); target="_blank">' + _JSON.data[i].data[0].spark_cnt + '</a>') + '</span><span class="big-Span">' + _JSON.data[i].data[0].spark_tm + '</span><span class="big-Span">' + _JSON.data[i].data[0].msc + '</span><span class="big-Span">' + spack + '</span><span class="big-Span">' + (_JSON.data[i].data[0].spark_mx == "-" ? _JSON.data[i].data[0].spark_mx : '<a href="javascript:void(0)" target="_blank" onclick=AAA_3CForm4("' + _JSON.data[i].data[0].alarmid + '")>' + _JSON.data[i].data[0].spark_mx + '</a>') + '</span><div class="Clear"></div></div><div class="inner-body-two"></div></div>'
                    } else {
                        if (_JSON.data[i].data.length > 0) {
                            imgsrc = '<img class="line_Click open_img" src="img/open.png" />';
                        } else {
                            imgsrc = '<img class="open_img" src="img/close.png" />';
                        }
                        if (_JSON.data[i].spark_rate == "-") {
                            spack = _JSON.data[i].spark_rate;
                        } else {
                            spack = _JSON.data[i].spark_rate + "%";
                        }
                        _HTML += '<div class="inner-body-one"><div class="one-content"><span class="little-Span">' + imgsrc + '</span><span class="big-Span">' + _JSON.data[i].line + '</span><span class="mid-Span">' + _JSON.data[i].direction + '</span><span class="big-Span">' + _JSON.data[i].date + '</span><span class="mid-Span">' + _JSON.data[i].loco_cnt + '</span><span class="big-Span">' + (_JSON.data[i].spark_cnt == "-" ? _JSON.data[i].spark_cnt : '<a href="javascript:void(0)" target="_blank" onclick=AAA_alarm("' + Emputy + '","' + _JSON.data[i].line_code + '","' + _JSON.data[i].line + '","' + _JSON.data[i].direction + '","' + _JSON.data[i].date + '","LINE");>' + _JSON.data[i].spark_cnt + '</a>') + '</span><span class="big-Span">' + _JSON.data[i].spark_tm + '</span><span class="big-Span">' + _JSON.data[i].msc + '</span><span class="big-Span">' + spack + '</span><span class="big-Span">' + (_JSON.data[i].spark_mx == "-" ? _JSON.data[i].spark_mx : '<a href="javascript:void(0)" onclick=AAA_3CForm4("' + _JSON.data[i].alarmid + '") target="_blank">' + _JSON.data[i].spark_mx + '</a>') + '</span><div class="Clear"></div></div><div class="inner-body-two"></div></div>'
                    }
                }
                document.getElementById("inner_body").innerHTML = _HTML;

                line_click(_JSON.data, _JSON.positiontype); //线路点击下一层

            } else {
                layer.msg("无数据!");
                document.getElementById("inner_body").innerHTML = ""; //清空内容
            }
        }
    });
};

//点击加载下一层

function line_click(Data, type) {
    $(".line_Click").unbind('click').click(function () {
        var tagetDOM = $(this).parent().parent().siblings('.inner-body-two');
        tagetDOM.toggle();
        if ($(this).attr("src") == "img/open.png") {
            $(this).attr("src", "img/close.png");
        } else {
            $(this).attr("src", "img/open.png");
        }
        if (tagetDOM.html() != "") {
            return;
        } else {
            var Index = $(this).parent().parent().parent().index();
            var _innerhtml = "";
            if (type == 'POSITION') {
                for (var n = 0; n < Data[Index].data[0].data.length; n++) {
                    var _imgsrc;
                    var _spack;
                    if (Data[Index].data[0].data[n].spark_rate == "-") {
                        _spack = Data[Index].data[0].data[n].spark_rate;
                    } else {
                        _spack = Data[Index].data[0].data[n].spark_rate + "%";
                    }
                    _innerhtml += '<div class="two-content"><div class="two-content-all"><span class="little-Span empty-Span"></span><span class="little-Span">' + (n + 1) + '</span><span class="big-Span-S">' + Data[Index].data[0].data[n].LOCOMOTIVE_CODE + '&nbsp;&nbsp;&nbsp;&nbsp;<img src="/Common/img/speed.png" alt="速度" style="vertical-align: inherit; ">&nbsp;' + Data[Index].data[0].data[n].speed + 'km/h</span><span class="mid-Span">' + Data[Index].data[0].data[n].loco_cnt + '</span><span class="big-Span color_Span">' + (Data[Index].data[0].data[n].spark_cnt == "-" ? Data[Index].data[0].data[n].spark_cnt : '<a href="javascript:void(0)" target="_blank" onclick=AAA_alarm("' + Data[Index].data[0].data[n].LOCOMOTIVE_CODE + '","' + Data[Index].data[0].position_code + '","' + Data[Index].data[0].position_name + '","' + Data[Index].data[0].direction + '","' + Data[Index].data[0].date + '","POSITION");>' + Data[Index].data[0].data[n].spark_cnt + '</a>') + '</span><span class="big-Span">' + Data[Index].data[0].data[n].spark_tm + '</span><span class="big-Span">' + Data[Index].data[0].data[n].msc + '</span><span class="big-Span">' + _spack + '</span><span class="big-Span color_Span">' + (Data[Index].data[0].data[n].spark_mx == "-" ? Data[Index].data[0].data[n].spark_mx : '<a href="javascript:void(0)" onclick=AAA_3CForm4("' + Data[Index].data[0].data[n].alarmid + '") target="_blank">' + Data[Index].data[0].data[n].spark_mx + '</a>') + '</span><div class="Clear"></div></div><div class="inner-body-three"></div></div>'
                }
                tagetDOM.html(_innerhtml);
            } else {
                for (var y = 0; y < Data[Index].data.length; y++) {
                    var _imgsrc;
                    var _spack;
                    if (Data[Index].data[y].data.length > 0) {
                        _imgsrc = '<img class="POSITION_Click open_img" src="img/open.png" />';
                    } else {
                        _imgsrc = '<img class="open_img" src="img/close.png" />';
                    }
                    if (Data[Index].data[y].spark_rate == "-") {
                        _spack = Data[Index].data[y].spark_rate;
                    } else {
                        _spack = Data[Index].data[y].spark_rate + "%";
                    }
                    _innerhtml += '<div class="two-content"><div class="two-content-all"><span class="little-Span empty-Span"></span><span class="little-Span">' + _imgsrc + '</span><span class="big-Span-S">' + Data[Index].data[y].position_name + '</span><span class="mid-Span">' + Data[Index].data[y].loco_cnt + '</span><span class="big-Span color_Span">' + (Data[Index].data[y].spark_cnt == "-" ? Data[Index].data[y].spark_cnt : '<a href="javascript:void(0)" target="_blank" onclick=AAA_alarm("' + Emputy + '","' + Data[Index].data[y].position_code + '","' + Data[Index].data[y].position_name + '","' + Data[Index].data[y].direction + '","' + Data[Index].data[y].date + '","POSITION");>' + Data[Index].data[y].spark_cnt + '</a>') + '</span><span class="big-Span">' + Data[Index].data[y].spark_tm + '</span><span class="big-Span">' + Data[Index].data[y].msc + '</span><span class="big-Span">' + _spack + '</span><span class="big-Span color_Span">' + (Data[Index].data[y].spark_mx == "-" ? Data[Index].data[y].spark_mx : '<a href="javascript:void(0)" onclick=AAA_3CForm4("' + Data[Index].data[y].alarmid + '") target="_blank">' + Data[Index].data[y].spark_mx + '</a>') + '</span><div class="Clear"></div></div><div class="inner-body-three"></div></div>'
                }
                tagetDOM.html(_innerhtml);

                position_click(Data[Index].data); //区站点击下一层
            }
        }
    });
};

function position_click(result) {
    $(".POSITION_Click").unbind('click').click(function () {
        var _tagetDOM = $(this).parent().parent().siblings('.inner-body-three');
        _tagetDOM.toggle();
        if ($(this).attr("src") == "img/open.png") {
            $(this).attr("src", "img/close.png");
        } else {
            $(this).attr("src", "img/open.png");
        }
        if (_tagetDOM.html() != "") {
            return;
        } else {
            var _Index = $(this).parent().parent().parent().index();
            var _INNERHTML = "";

            for (var x = 0; x < result[_Index].data.length; x++) {

                var _spack1;
                if (result[_Index].data[x].spark_rate == "-") {
                    _spack1 = result[_Index].data[x].spark_rate;
                } else {
                    _spack1 = result[_Index].data[x].spark_rate + "%";
                }
                _INNERHTML += '<div class="three-content"><span class="little-Span-S empty-Span"></span><span class="little-Span">' + (x + 1) + '</span><span class="big-Span-SS">' + result[_Index].data[x].LOCOMOTIVE_CODE + (result[_Index].data[x].speed == "-" ? "" : '&nbsp;&nbsp;&nbsp;&nbsp;<img src="/Common/img/speed.png" alt="速度" style="vertical-align: inherit; ">&nbsp;' + result[_Index].data[x].speed + 'km/h') + '</span><span class="big-Span color_Span">' + (result[_Index].data[x].spark_cnt == "-" ? result[_Index].data[x].spark_cnt : '<a href="javascript:void(0)" target="_blank" onclick=AAA_alarm("' + result[_Index].data[x].LOCOMOTIVE_CODE + '","' + result[_Index].position_code + '","' + result[_Index].position_name + '","' + result[_Index].direction + '","' + result[_Index].date + '","POSITION");>' + result[_Index].data[x].spark_cnt + '</a>') + '</span><span class="big-Span">' + result[_Index].data[x].spark_tm + '</span><span class="big-Span">' + result[_Index].data[x].msc + '</span><span class="big-Span">' + _spack1 + '</span><span class="big-Span color_Span">' + (result[_Index].data[x].spark_mx == "-" ? result[_Index].data[x].spark_mx : '<a href="javascript:void(0)" onclick=AAA_3CForm4("' + result[_Index].data[x].alarmid + '") target="_blank">' + result[_Index].data[x].spark_mx + '</a>') + '</span><div class="Clear"></div></div>'
            }
            _tagetDOM.html(_INNERHTML);
        }
    })
};


//跳转到报警列表页
function AAA_alarm(loco, code, name, direction,time, type) {
    window.open("/C3/PC/MAlarmMonitoring/MonitorLocoAlarmList.htm?category=3C&data_type=ALARM&loco=" + loco + "&code=" + code + "&name=" + escape(name) + "&direction=" + escape(direction) + "&time=" + time + "&type=" + type + "&is_spark=is_spark&lightbox[iframe]=true&lightbox[width]=95p&lightbox[height]=90p", "_blank");
};

//跳转到详情页
function AAA_3CForm4(ID) {
    window.open("/C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=" + ID, "_blank");
};