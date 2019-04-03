//全局变量
var pageSize = 11; //一页显示条数
var pageIndex=1; //某页
var locomotive_code;  //车号
var start_time;  //开始时间
var end_time;  //结束时间
var instruction; //描述
$(function () {
    //纯设备编号控件
    $('#record_loco').LocoSelect({
        position: 'MonitorLocoAlarmList'
    });
    $('#record_loco').inputSelect({
        type: 'loca',
        contant: 2
    });
    $('#record_add_loco').LocoSelect({
        position: 'MonitorLocoAlarmList'
    });
    $('#record_add_loco').inputSelect({
        type: 'loca',
        contant: 2
    });
    $('#record_loco').next().css('top', '3px');
    $('#record_add_loco').next().css('top', '3px');
    //默认时间
    document.getElementById('record_star_time').value = dateHalfYearStr();
    document.getElementById('record_end_time').value = dateNowStr();

    if ($('body', window.parent.document).width() < 1601) {
        pageSize = 10;
    };
    if ($('body', window.parent.document).width() < 1367) {
        pageSize = 8;
    };

    Dquery();

    //点击分析按钮
    $('#record_query').click(function () {
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
    //添加弹出框
    $("#record_add_button").click(function () {
        layer.open({
            title: false,
            closeBtn: 0,
            area: '521px',
            type: 1,
            shade: 0.5,
            content: $("#record_Add")
        })
    });
    //添加任务
    $("#record_add_sure").click(function () {
        ADDrecord();
    });
});


//查询
function Dquery() {

    locomotive_code = $("#record_loco").val();
    if ($('#record_star_time').val() == "") {
        start_time = "";
    } else {
        start_time = $('#record_star_time').val() + " 00:00:00";
    }
    if ($('#record_end_time').val() == "") {
        end_time = "";
    } else {
        end_time = $('#record_end_time').val() + " 23:59:59";
    }
    instruction = $('#effect').val();

    if ('' !== start_time && '' !== end_time) {
        if (start_time > end_time) {
            tip('开始时间须小于结束时间', '#record_star_time', 3000, 'top');
            $('.layui-layer-tips .layui-layer-content').css({ 'min-width': '12px' });
            return;
        }
    }
    if ('' === start_time) {
        tip('请选择开始时间', '#record_star_time', 3000, 'top');
        $('.layui-layer-tips .layui-layer-content').css({ 'min-width': '12px' });
        return;
    }
    if ('' === end_time) {
        tip('请选择结束时间', '#record_end_time', 3000, 'top');
        $('.layui-layer-tips .layui-layer-content').css({ 'min-width': '12px' });
        return;
    }

    layer.load();
    $('#paging').paging({
        index: 1,
        url: function () {
            pageIndex = $('.pageValue').val();
            var url = '/Common/MHardDisk/RemoteHandlers/HardDiskRecord.ashx?active=GetList'
            + '&locomotive_code=' + $.trim(locomotive_code)
            + '&start_time=' + start_time
            + '&end_time=' + end_time
            + '&instruction=' + instruction
            + '&pageSize=' + pageSize
            + '&pageIndex=' + pageIndex;
            return url;
        },
        success: function (data) {
            layer.closeAll('loading');
            var _JSON = data;
            if (_JSON.data.length > 0) {
                var _HTML = "";
                document.getElementById("inner_body").innerHTML = ""; //清空内容

                for (var i = 0; i < _JSON.data.length; i++) {
                        
                    _HTML += '<div class="inner_body_li"><span class="mid-Span">' + _JSON.data[i].locomotive_code + '</span><span class="mid-Span">' + _JSON.data[i].start_time + '</span><span class="mid-Span">' + _JSON.data[i].end_time + '</span><span class="big-Span" title="' + _JSON.data[i].instruction + '">' + _JSON.data[i].instruction + '</span><span class="mid-Span">' + _JSON.data[i].priority + '</span><span class="mid-Span">' + _JSON.data[i].creat_person_name + '</span><span class="mid-Span">' + _JSON.data[i].create_time + '</span><span class="sm-Span"><a href="/Common/MGIS/OrbitGIS.htm?Category_Code=DPC&deviceid=' + _JSON.data[i].locomotive_code + '&startdate=' + _JSON.data[i].start_time + '&enddate=' + _JSON.data[i].end_time + '&v=' + version + '" target="_blank"><img src="img/line-gj.png" class="line-GJ" /></a></span><div class="Clear"></div></div>'
                }

                document.getElementById("inner_body").innerHTML = _HTML;

            } else {
                layer.msg("无数据!");
                document.getElementById("inner_body").innerHTML = ""; //清空内容
            }
        }
    });
};

//添加处理
function ADDrecord() {
    var _locomotive_code = $("#record_add_loco").val();  //车号
    var _start_time = $('#record_add_strTime').val();  //开始时间
    var _end_time = $('#record_add_endTime').val();  //结束时间
    var _instruction = $.trim($('#instruction').val());  //描述
    var _priority = $('#priority').val();  //优先级
    
    if (_locomotive_code == "") {
        tip('设备编号不能为空', '#record_add_loco', 3000, 'top');
        return;
    }
    if ('' !== _start_time && '' !== _end_time) {
        if (_start_time >= _end_time) {
            tip('开始时间须小于结束时间', '#record_add_strTime', 3000, 'top');
            $('.layui-layer-tips .layui-layer-content').css({ 'min-width': '12px' });
            return;
        }
    }
    if ('' === _start_time) {
        tip('请选择开始时间', '#record_add_strTime', 3000, 'top');
        $('.layui-layer-tips .layui-layer-content').css({ 'min-width': '12px' });
        return;
    }
    if ('' === _end_time) {
        tip('请选择结束时间', '#record_add_endTime', 3000, 'top');
        $('.layui-layer-tips .layui-layer-content').css({ 'min-width': '12px' });
        return;
    }
    _url = '/Common/MHardDisk/RemoteHandlers/HardDiskRecord.ashx?active=SetRecord'
            + '&locomotive_code=' + _locomotive_code
            + '&start_time=' + _start_time
            + '&end_time=' + _end_time
            + '&priority=' + _priority;
    $.ajax({
        type: 'POST',
        url: _url,
        data: {'instruction':_instruction},
        dataType:'text',
        async: true,
        cache: false,
        success: function (result) {
            if (result == "成功") {
                layer.msg("添加成功!");
                //还原弹出框
                $("#record_add_loco").val("");
                $('#record_add_strTime').val("");
                $('#record_add_endTime').val("");
                $('#instruction').val("");
                $('#priority').val("5");

                $(".layui-layer-close").click();

                Dquery();
            } else {
                layer.msg("添加失败!");
            }
        },
        error: function () {
            alert("添加错误");
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
