

var layerIndex = '';
var plan_id = '';
$(function () {

    if (GetQueryString('plan_id') != null && GetQueryString('plan_id') != '') {
        $('#title_html').html('修改');
        plan_id = GetQueryString('plan_id');
        loadInput(plan_id);
    }
    atuohtml_size();
    $(window).resize(function () {
        atuohtml_size();
    }
        )

    $('#addLineBtn').click(function () {
        if (makeJudgeInside()) {
            var id = Math.round(Math.random() * 1000000)//随机id
            var html = ' <div class="line_table_row">\
                    <span>\
                        <span class="ctrl_btn dele_btn" title="删除"></span>\
                    </span>\
                    <span ><input class="linecode" id="line_row_' + id + '" type="text" need="yes"/></span>\
                    <span><input class="dirctioncode" id="direction_row_'+ id + '" type="text" need="yes"/></span>\
                    <span><input class="spostioncode" id="s_location_' + id + '" type="text" /></span>\
                    <span><input class="epostioncode" id="e_location_' + id + '" type="text" /></span>\
                    <span><input id="start_time_' + id + '" class="Wdate st" type="text" onclick="WdatePicker({ dateFmt: ' + "'" + 'yyyy-MM-dd HH:mm:ss' + "'" + ' })"  /></span>\
                    <span><input id="end_time_' + id + '" class="Wdate et" type="text" onclick="WdatePicker({ dateFmt: ' + "'" + 'yyyy-MM-dd HH:mm:ss' + "'" + ' })" /></span>\
                </div>'

            $('#box_bottom .list_row_box').append(html)
            atuohtml_size();//调整页面css
            bindTree_line(id, '', false); //绑定线路，联动区站
            bindTree_direction(id); //绑定行别
            bindClick();//编辑 删除 事件
        }

    })

    //开始时间 选中  结束时间默认
    $('#p_start_time').blur(function () {
        $('#p_end_time').val($('#p_start_time').val())
    })

    //绑定检测类型  多选
    $("#category").mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: 'DPC',
        p_code: "DET_TYPE",
        cateGory: 'DET_TYPE',
        enableCheck: true,
        chkboxType: { "Y": "s", "N": "s" },
        nocheck: true,
        enableFilter: false,
        onCheck: function (event, treeId, treeNode) {
            var zTree = $.fn.zTree.getZTreeObj(treeId),
            nodes = zTree.getCheckedNodes(true),
             v = "", code = "";
            for (var i = 0, l = nodes.length; i < l; i++) {
                v += nodes[i].name + ",";
                code += nodes[i].id + ",";
            }
            if (v.length > 0) v = v.substring(0, v.length - 1);
            if (code.length > 0) code = code.substring(0, code.length - 1);
            $("#category").attr("value", v).attr("code", code).attr("treetype", "LINE");
        },
        onClick: function (event, treeId, treeNode) {
            var treeObj = $.fn.zTree.getZTreeObj(treeId);
            treeObj.checkAllNodes(false);
            $("#category").attr('code', treeNode.id).val(treeNode.name);
        }
    });





    $('#close_btn').click(function () {
        parent.cloasemode()//父页面关闭box方法
    })

    //保存
    $('#save_btn').click(function () {
        if (makeJudge()) {
            dosave()
        }
    })

})

//动态改变  列表title宽度
function atuohtml_size() {
    if (document.getElementsByClassName('line_table_row').length >= 4) {
        $('#box_bottom .line_table_title').width($('#box_bottom .line_table').width() - 12)
        $('.list_row_box')[0].scrollTop = $('.list_row_box')[0].scrollHeight
    } else {
        $('#box_bottom .line_table_title').width($('#box_bottom .line_table').width())
    }

}

//绑定行别
function bindTree_direction(id, hide) {
    var direction_id = 'direction_row_' + id;
    $('#' + direction_id).mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: '3C', height: 80,
        cateGory: 'DRTFLG',
        enableFilter: false,
        onClick: function (event, treeId, treeNode) {
            $('#' + direction_id).attr('code', treeNode.id).val(treeNode.name);
        },
        callback: function () {
            $('#' + direction_id).siblings('a[name="ztree"]').css('right', 8).css('top', 5)
            $('#' + direction_id).parent().css('width', '');
            if (hide == 'hide') {
                $('#' + direction_id).siblings('a[name="ztree"]').hide().addClass('showNot')
            }
        }
    });
}

//绑定线路下拉控件
function bindTree_line(id, hide, isCallbackBindTree_location) {
    var line_id = 'line_row_' + id;
    $('#' + line_id).mySelectTree({//绑定线路
        tag: 'LINE',
        height: 80,
        enableFilter: true,
        onClick: function (event, treeId, treeNode) {
            $('#' + line_id).attr('code', treeNode.id).val(treeNode.name);

            if ($('#s_location_' + id).parent().is('div')) {
                $('#s_location_' + id).next().remove();
                $('#ULs_location_' + id).parent().remove();
            }
            if ($('#e_location_' + id).parent().is('div')) {
                $('#e_location_' + id).next().remove();
                $('#ULe_location_' + id).parent().remove();
            }

            bindTree_location('s_location_' + id, '', treeNode.id, false);
            bindTree_location('e_location_' + id, '', treeNode.id, false);
            $('#s_location_' + id, document).val('').attr('code', '');
            $('#e_location_' + id, document).val('').attr('code', '');
        },
        callback: function () {
            $('#' + line_id).siblings('a[name="ztree"]').css('right', 8).css('top', 5);
            $('#' + line_id).parent().css('width', '');
            if (hide == 'hide') {
                $('#' + line_id).siblings('a[name="ztree"]').hide().addClass('showNot')
            }
            if (isCallbackBindTree_location) {
                bindTree_location('s_location_' + id, hide, $('#' + id).attr('code'), true);
                bindTree_location('e_location_' + id, hide, $('#' + id).attr('code'), true);
            }
        }
    });
}

//绑定区站下拉控件 //开始 结束 站点
function bindTree_location(id, hide, line_code, isCallbackBindValue_location) {
    $('#' + id).mySelectTree({//绑定线路
        tag: 'POSITION_STAGE',
        height: 80,
        enableFilter: true,
        line_code: line_code,
        onClick: function (event, treeId, treeNode) {
            $('#' + id).attr('code', treeNode.id).val(treeNode.name);
        },
        callback: function () {
            $('#' + id).siblings('a[name="ztree"]').css('right', 8).css('top', 5);
            $('#' + id).parent().css('width', '');
            if (hide == 'hide') {
                $('#' + id).siblings('a[name="ztree"]').hide().addClass('showNot');
            }
            if (isCallbackBindValue_location) {
                $('#' + id).val($('#' + id).parent().parent().find('.font_show').html());
                $('#' + id).attr('code', $('#' + id).parent().parent().find('.font_show').attr('code'));
            }
        }
    });
}

function makeJudge() {
    var bool = true;
    if ($('#category').val() == '') {
        layer.tips('请选择检测类型！', '#category', { tips: [1, '#3595CC'] });
        bool = false;
        return false;
    }
    if ($('#p_start_time').val() == '') {
        layer.tips('请选择计划开始时间！', '#p_start_time', { tips: [1, '#3595CC'] });
        bool = false;
        return false;
    }
    if ($('#p_end_time').val() == '') {
        layer.tips('请选择计划结束时间！', '#p_end_time', { tips: [1, '#3595CC'] });
        bool = false;
        return false;
    }
    if ($('#p_start_time').val() > $('#p_end_time').val() && $('#p_start_time').val() != '' && $('#p_end_time').val() != '') {
        layer.tips('开始时间不能大于结束时间！', '#p_start_time', { tips: [1, '#3595CC'] });
        bool = false;
        return false;
    }
    var bool2 = makeJudgeInside();
    if (bool && bool2) {
        bool = true;
    } else {
        bool = false;
    }
    return bool;
}

//列表 添加判断
function makeJudgeInside() {
    var bool = true;
    $('input[need="yes"]').each(function () {
        var that = $(this);
        if (that.val() == '' && !that.hasClass('showNot')) {
            layer.tips('不能为空！', ('#' + that.attr('id')), { tips: [1, '#3595CC'] });
            bool = false;
            return false;
        }
    })
    if (bool == false) {
        return false;
    }
    $('.line_table_row').each(function () {
        var that = $(this);
        if (that.find('.spostioncode').val() == that.find('.epostioncode').val() && that.find('.epostioncode').val() != '' && that.find('.spostioncode').val() != '' && !that.find('.spostioncode').hasClass('showNot')) {
            layer.tips('不能与开始站点相同！', ('#' + that.find('.epostioncode').attr('id')), { tips: [1, '#3595CC'] });
            bool = false;
            return false;
        }
        if (that.find('.st').val() == that.find('.et').val() && that.find('.st').val() != '' && that.find('.et').val() != '' && !that.find('.st').hasClass('showNot')) {
            layer.tips('时间不能相同！', ('#' + that.find('.et').attr('id')), { tips: [1, '#3595CC'] });
            bool = false;
            return false;
        }
        if (that.find('.st').val() > that.find('.et').val() && that.find('.st').val() != '' && that.find('.et').val() != '' && !that.find('.st').hasClass('showNot')) {
            layer.tips('开始时间不能大于结束时间！', ('#' + that.find('.st').attr('id')), { tips: [1, '#3595CC'] });
            bool = false;
            return false;
        }
    })
    return bool;
}

//绑定事件  列表内 编辑 删除
function bindClick() {
    //移除 行
    $('.line_table_row .dele_btn').click(function () {
        var that = $(this);
        layerIndex = layer.confirm('您确定要删除？', {
            title: false, closeBtn: 0,
            btn: ['确定', '取消'] //按钮
        }, function () {
            that.parent().parent().remove();
            atuohtml_size();
            layer.close(layerIndex);
        });

    })
    //编辑 行
    $('.line_table_row .edi_btn').click(function () {
        if (makeJudgeInside()) {    //要做数据判断
            var that = $(this);
            that.parent().parent().find('.font_show').hide();
            that.parent().parent().find('.showNot').show();
            that.parent().parent().find('.showNot').removeClass('showNot');
        }

    })
}

//保存
function dosave() {
    var arrydata = getArryVal();
    var _url = '/common/mplan/remotehandlers/planmanageform.ashx?type=EDIT&plan_id=' + plan_id
    + '&CATEGORY_CODE=' + ($('#category').attr('code') == undefined ? '' : $('#category').attr('code'))
    + '&START_DATE=' + ($('#p_start_time').val() + ' 00:00:00')
    + '&END_DATE=' + ($('#p_end_time').val() + ' 23:59:59')
    + '&LOCOMOTIVE_CODE=' + $('#LOCOMOTIVE_CODE').val()
    + '&LOCOMOTIVE_NO=' + $('#LOCOMOTIVE_NO').val()       //che ci
    + '&PASSEN_DEPT=' + $('#do_org').val()        //bu men
    + '&PASSENGER=' + $('#do_user').val();      //ren yuan

    var data = { 'LINE_ARRY': arrydata[0], 'DIRECTION_ARRY': arrydata[1], 'SPOSTION_ARRY': arrydata[2], 'EPOSTION_ARRY': arrydata[3], 'STIME_ARRY': arrydata[4], 'ETIME_ARRY': arrydata[5] }
    //console.log(data);
    $.ajax({
        type: "POST",
        url: _url,
        data: data,
        cache: false,
        async: true,
        success: function (rea) {
            try {
                var re = eval('(' + rea + ')')
                if (re.sign == 'true') {
                    //layer.alert('保存成功', { icon: 1, title: '提示' });
                    layer.msg('保存成功!', {
                        icon: 6, time: 0, btn: ['确定'], yes: function (index) {
                            layer.close(index);
                            parent.cloasemode();
                            parent.doQuery();
                        }
                    });
                } else {
                    layer.alert('保存失败', { icon: 2, title: '提示' });
                }
            } catch (e) {
                layer.alert('保存失败', { icon: 2, title: '提示' });
            }
        },
        error: function () {
            layer.msg('保存出错！')
        }
    })



}

function loadInput(id) {
    var _url = '/common/mplan/remotehandlers/planmanageform.ashx?type=QUERY&plan_id=' + id
    $.ajax({
        type: "POST",
        url: _url,
        cache: false,
        async: true,
        success: function (rea) {
            try {
                var re = eval('(' + rea + ')')
                $('#category').attr('code', re.rows[0].CATEGORY_CODE)
                $('#category').val(re.rows[0].CATEGORY_NAME)
                $('#LOCOMOTIVE_NO').val(re.rows[0].LOCOMOTIVE_NO)
                $('#LOCOMOTIVE_CODE').val(re.rows[0].LOCOMOTIVE_CODE)
                $('#p_start_time').val(setTime(re.rows[0].START_DATE))
                $('#p_end_time').val(setTime(re.rows[0].END_DATE))
                $('#do_org').val(re.rows[0].PASSEN_DEPT)
                $('#do_user').val(re.rows[0].PASSENGER)
                if (re.rows[0].task.length > 0) {
                    load_rowInside(re.rows[0].task)//小表
                }
            } catch (e) {
                layer.alert('获取数据失败', { icon: 2, title: '提示' });
            }
        },
        error: function () {
            layer.msg('获取数据出错！')
        }
    })

}
//时间去除结尾
function setTime(a) {
    var b = [''];
    if (a != '') {
        b = a.split(" ");
    }
    return b[0];
}
//已存在  列表加载
function load_rowInside(json) {
    for (var i = 0; i < json.length; i++) {
        var id = Math.round(Math.random() * 1000000)//随机id
        var Sst = '';
        var Eet = '';
        if (json[i].START_TASK_DATE.split('0001').length == 1) {
            Sst = json[i].START_TASK_DATE
        }
        if (json[i].END_TASK_DATE.split('0001').length == 1) {
            Eet = json[i].END_TASK_DATE
        }
        var html =
            '<div class="line_table_row">\
                <span>\
                    <span class="ctrl_btn edi_btn" title="编辑"></span>\
                    <span class="ctrl_btn dele_btn" title="删除"></span>\
                </span>\
                <span >\
                    <span class="font_show" code="' + json[i].LINE_CODE +'">' + json[i].LINE_NAME + '</span>\
                    <input class="linecode showNot" id="line_row_' + id + '" type="text" need="yes" value="' + json[i].LINE_NAME + '" code="' + json[i].LINE_CODE + '"/>\
                </span>\
                <span>\
                    <span class="font_show" code="' + json[i].DIRECTION + '">' + json[i].DIRECTION_NAME + '</span>\
                    <input class="dirctioncode showNot" id="direction_row_' + id + '" type="text" need="yes" value="' + json[i].DIRECTION_NAME + '" code="' + json[i].DIRECTION + '"/>\
                </span>\
                <span>\
                    <span class="font_show" code="' + json[i].START_POSITION_CODE + '">' + json[i].START_POSITION_NAME + '</span>\
                    <input class="spostioncode showNot" id="s_location_' + id + '" style="width:140px;" type="text" value="' + json[i].START_POSITION_NAME + '" code="' + json[i].START_POSITION_CODE + '"/>\
                </span>\
                <span>\
                    <span class="font_show" code="' + json[i].END_POSITION_CODE + '">' + json[i].END_POSITION_NAME + '</span>\
                    <input class="epostioncode showNot" id="e_location_' + id + '" style="width:140px;" type="text" value="' + json[i].END_POSITION_NAME + '" code="' + json[i].END_POSITION_CODE + '"/>\
                </span>\
                <span>\
                    <span class="font_show">' + Sst + '</span>\
                    <input id="start_time_' + id + '" class="Wdate st showNot" type="text" onclick="WdatePicker({ dateFmt: ' + "'" + 'yyyy-MM-dd HH:mm:ss' + "'" + ' })" value="' + Sst + '" />\
                </span>\
                <span>\
                    <span class="font_show">' + Eet + '</span>\
                    <input id="end_time_' + id + '" class="Wdate et showNot" type="text" onclick="WdatePicker({ dateFmt: ' + "'" + 'yyyy-MM-dd HH:mm:ss' + "'" + ' })" value="' + Eet + '" />\
                </span>\
            </div>'
        $('#box_bottom .list_row_box').append(html);
        bindTree_line(id, 'hide', true); //绑定线路，联动绑定区站
        bindTree_direction(id, 'hide'); //绑定行别
    }
    $('.showNot').hide();
    atuohtml_size();//调整页面css
    bindClick();//编辑 删除 事件
}

//获取所有线路 等列表项
function getArryVal() {
    var a = [];
    var b = [];
    var c = [];
    var d = [];
    var e = [];
    var f = [];

    var g = '';
    var h = '';
    var i = '';
    var j = '';
    var k = '';
    var l = '';
    $('.line_table_row').each(function () {
        var that = $(this)
        a.push((that.find('.linecode').attr('code') == undefined ? '' : that.find('.linecode').attr('code')));
        b.push((that.find('.dirctioncode').attr('code') == undefined ? '' : that.find('.dirctioncode').attr('code')));
        c.push((that.find('.spostioncode').attr('code') == undefined ? '' : that.find('.spostioncode').attr('code')));
        d.push((that.find('.epostioncode').attr('code') == undefined ? '' : that.find('.epostioncode').attr('code')));
        e.push(that.find('.st').val());
        f.push(that.find('.et').val());
    })
    for (var z = 0; z < a.length; z++) {
        if (z == (a.length - 1)) {
            g += a[z];
            h += b[z];
            i += c[z];
            j += d[z];
            k += e[z];
            l += f[z];
        } else {
            g += a[z] + ',';
            h += b[z] + ',';
            i += c[z] + ',';
            j += d[z] + ',';
            k += e[z] + ',';
            l += f[z] + ',';
        }
    }
    return [g, h, i, j, k, l]
}