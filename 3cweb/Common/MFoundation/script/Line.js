/*========================================================================================*
* 功能说明：线路列表页面操作和数据展示JS
* 注意事项：
* 作    者： lc
* 版本日期：2014年9月29日
* 变更说明：
* 版 本 号： V1.0.0
*=======================================================================================*/
var option; //表格内容

function loadFlexiGrid(code, treeType) {
    var _h = $(window).height() - 230 - 10;
    var _PageNum = parseInt(_h / 25);
    var json = [
                { display: '操作', name: 'CZ', width: 120, sortable: false, align: 'center' },
                { display: '线路名称', name: 'LINE_NAME', width: 210, sortable: false, align: 'center' },
                { display: '线路号', name: 'LINE_NO', width: 90, sortable: false, align: 'center' },
                { display: '线路类别', name: 'LINETYPE', width: 90, sortable: false, align: 'center' },
                { display: '线路编码', name: 'LINE_CODE', sortable: false, hide: true },
                { display: '线路行别', name: 'DIRECTION', width: 80, sortable: false, align: 'center' },
                { display: '路局名称', name: 'BUREAU_NAME', width: 200, sortable: false, align: 'center' },
                { display: '路局编码', name: 'BUREAU_CODE', sortable: false, hide: true },
                { display: '起始站点', name: 'START_STATION_NAME', width: 110, sortable: false, align: 'center' },
                { display: '终止站点', name: 'END_STATION_NAME', width: 110, sortable: false, align: 'center' },
                { display: '起始站点CODE', name: 'START_STATION_CODE', sortable: false, hide: true },
                { display: '终止站点CODE', name: 'END_STATION_CODE', sortable: false, hide: true },
                { display: '起始公里标', name: 'START_KM', width: 80, sortable: false, align: 'center' },
                { display: '终止公里标', name: 'END_KM', width: 80, sortable: false, align: 'center' },
                { display: '速度等级', name: 'SPEED_DGR', width: 110, sortable: false, align: 'center' },
                { display: '线路等级', name: 'LINE_DGR', width: 110, sortable: false, align: 'center' },
                { display: '电化开通日期', name: 'OPEN_DATE', width: 110, sortable: false, align: 'center' },
                { display: '运营里程', name: 'OperationMile', width: 110, sortable: false, align: 'center' },
                { display: '供电方式', name: 'PowerMethod', width: 110, sortable: false, align: 'center' },
                { display: '悬挂类型', name: 'HangType', width: 110, sortable: false, align: 'center' },
                { display: '资产所属单位', name: 'Department', width: 110, sortable: false, align: 'center' },
                { display: '其他(备注)', name: 'OTHER', width: 110, sortable: false, align: 'center' },
                { display: 'ID', name: 'ID', sortable: false, hide: true, pk: true },
                { display: 'IS_SHOW', name: 'IS_SHOW', hide: true, align: 'center' },
                { display: '', name: 'START_KM_YS', hide: true },
                { display: '', name: 'END_KM_YS', hide: true }
    ];
    option = {
        colModel: json,
        url: 'RemoteHandlers/LineControl.ashx?type=all&CODE=' + code + "&TREETYPE=" + treeType,
        dataType: 'json',
        usepager: true,//是否分页
        title: '线路列表',
        pagestat: '显示第 {from} 条到 {to} 条,共 {total} 条数据', // 显示当前页和总页面的样式
        procmsg: '正在处理,请稍候 ...', // 正在处理的提示信息
        nomsg: '没有数据存在!', // 无结果的提示信息
        pagetext: '当前第',
        outof: '页，总页数',
        findtext: '条件查询：',
        useRp: true, //是否可以动态设置每页显示的结果数
        checkbox: false, // 是否要多选框
        rowId: 'ID', // 多选框绑定行的id
        rp: _PageNum,
        width: 'auto',
        height: _h,
        rpOptions: [20, 50, 100, _PageNum], //可选择的每页显示的结果数
        resizable: false, //是否可伸缩 
        striped: true, //是否显示斑纹效果，默认是奇偶交互的形式
        onSuccess: function () {
            var flexTable_tr = $('#flexTable tr');
            var btn_delete = "<span class= 'btn-delete j-delete ' style='padding-right:15px'></span>";
            var btn_edit = "<span class='btn-edit j-edit ' style='padding-left:15px'></span>";




            for (var i = 0; i < flexTable_tr.length; i++) {
                $(flexTable_tr[i]).find(' td:eq(0) div').html(btn_edit + btn_delete);
                //   $(flexTable_tr[i]).find(' td:eq(0) div').html(btn_delete);

            }
            $('.j-delete').click(function () {
                var id = $(this).parent().parent().parent().attr('id');
                deleteLine(id);
            });
            $('.j-edit').click(function () {

                //var rowData = $(this).parent().parent().parent().attr('id');
                var rowData = $(this).parent().parent().parent()[0];

                updateLineModal(rowData);

            });

        
            //添加删除按钮和删除按钮的鼠标事件
            //$('#flexTable tr').mouseover(function () {
            //    $(this).find('.j-edit').removeClass('hide');
            //    $(this).find('.j-delete').removeClass('hide');
            //}).mouseout(function () {
            //    $(this).find('.j-edit').addClass('hide');
            //    $(this).find('.j-delete').addClass('hide');
            //});
            $('.j-edit').mouseover(function () {
                $(this).css('background', 'url(/Common/MFoundation/img/edit.png) no-repeat');
            }).mouseout(function () {
                $(this).css('background', 'url(/Common/MFoundation/img/edit_mouseout.png) no-repeat')
            });
            $('.j-delete').mouseover(function () {
                $(this).css('background', 'url(/Common/MFoundation/img/delete.png) no-repeat');
            }).mouseout(function () {
                $(this).css('background', 'url(/Common/MFoundation/img/delete_mouseout.png) no-repeat')
            });
        }
    };
    $("#flexTable").flexigrid(option);

}

//弹出添加蒙层
function addLineModal() {
    //$("#divLineName").addClass("control-group error");
    //$("#divStartKm").addClass("control-group error");
    //$("#divEndKm").addClass("control-group error");
    //$("#divLINE_CODE").addClass("control-group error");

    $('#LineName').val("");
    $('#LINE_NO').val("");
    $("#Sel_LINE_TYPE option:first").attr("selected", true);
    $("#LINE_TYPE").val("");
    myTree.checkAllNodes(false);
    $('#LINE_CODE').val("").removeAttr("readonly");
    $("#DIRECTION").val("");
    $("#BUREAU_NAME").val("");
    $("#BUREAU_CODE").val("");
    $("#LineType").val("");
    $("#StartKm").val("");
    $("#EndKm").val("");
    $('#PowerMethod').val("");
    $('#SPEED_DGR').val("");
    $('#LINE_DGR ').val("");
    $('#OPEN_DATE').val('');
    $('#Hang_TYPE option:first').attr('selected',true);
    $('#Department option:first').attr('selected', true);
    $("#ddlPositionStart option:first").attr("selected", true);
    $("#ddlPositionEnd option:first").attr("selected", true);
    $("#text").val("add");
    //document.getElementById('modal-22256').click();
    //初始化弹窗
    $("#modal-container-22256").modal({ backdrop: 'static', keyboard: false }).css({
        width: 'auto',
        'margin-left': function () {
            return -($(this).width() / 2);
        },
        'margin-top': function () {
            return -($(this).height() / 2);
        }
    });
}

//弹出修改蒙层
function updateLineModal(rowData) {
    $("#divLineName").removeClass();
    $("#divStartKm").removeClass();
    $("#divEndKm").removeClass();
    $("#divLINE_CODE").removeClass();
    $('#LineName').val($('div:eq(1)', rowData).text().trim());
    $('#LINE_NO').val($('div:eq(2)', rowData).text().trim());
    $("#LINE_TYPE").val($('div:eq(3)', rowData).text().trim());
    $('#LINE_CODE').val($('div:eq(4)', rowData).text().trim()).attr("readonly", "readonly");
    $('#DIRECTION').val($('div:eq(5)', rowData).text().trim());
    LoadDropdSelected('Sel_LINE_TYPE', $('div:eq(6)', rowData).text().trim());
   // $('#BUREAU_CODE').val($('div:eq(7)', rowData).text().trim());
    //$('#START_STATION_NAME').val($('div:eq(8)', rowData).text().trim());
    //$('#END_STATION_NAME').val($('div:eq(9)', rowData).text().trim());
    //$('#START_STATION_CODE').val($('div:eq(10)', rowData).text().trim());
    //$('#END_STATION_CODE').val($('div:eq(11)', rowData).text().trim());
    //$('#START_KM').val($('div:eq(12)', rowData).text().trim());
    //$('#END_KM').val($('div:eq(13)', rowData).text().trim());
    $("#ddlPositionStart").val($('div:eq(8)', rowData).text().trim());
    $("#ddlPositionEnd").val($('div:eq(9)', rowData).text().trim());
    $("#StartKm").val($('div:eq(12)', rowData).text().trim());
    $("#EndKm").val($('div:eq(13)', rowData).text().trim());
    $('#SPEED_DGR').val($('div:eq(14)', rowData).text().trim());    
    $('#LINE_DGR').val($('div:eq(15)', rowData).text().trim());
    $('#OPEN_DATE').val($('div:eq(16)', rowData).text().trim());
    $('#OperationMile').val($('div:eq(17)', rowData).text().trim());
    $('#PowerMethod').val($('div:eq(18)', rowData).text().trim());
    $('#HangType').val($('div:eq(19)', rowData).text().trim());
    $('#Department').val($('div:eq(20)', rowData).text().trim());
    $('#OTHER').val($('div:eq(21)', rowData).text().trim());
   
    //var ids = $('div:eq(22)', rowData).text().trim();
    //var idOjbect = (ids).split(","); //分割为Ojbect数组。 
    //for (var i in idOjbect) {
    //    if (idOjbect[i] != "") {
    //        myTree.checkNode(myTree.getNodeByParam("id", idOjbect[i], null), true, true);
    //    }
    //}

    //$("#BUREAU_CODE").val(ids);
    //$('#DIRECTION').val($('div', rowData).text().trim());
 
    $('#pid' ).val($('div:eq(22)', rowData).text().trim());
    $('#IS_SHOW').val($('div:eq(23)', rowData).text().trim());
    $("#text").val("update");
    //document.getElementById('modal-22256').click();

    //初始化弹窗
    $("#modal-container-22256").modal({ backdrop: 'static', keyboard: false }).css({
        width: 'auto',
        'margin-left': function () {
            return -($(this).width() / 2);
        },
        'margin-top': function () {
            return -($(this).height() / 2);
        }
    });
}
//添加
function Add() {
    if (validate()) {
        var options = {
            url: "RemoteHandlers/LineControl.ashx?type=add",
            type: 'POST',
            success: function (result) {
                if (result == "1") {
                    ymPrompt.succeedInfo('添加成功', null, null, '提示信息', function () {
                        $("#flexTable").flexReload();
                    });
                }
                else if (result == "-2") {
                    ymPrompt.errorInfo('线路编码已存在,请更改编码后重试！', null, null, '提示信息', null);
                    return true;
                }
                else {
                    ymPrompt.errorInfo('添加失败', null, null, '提示信息', null);
                    return true;
                }
                document.getElementById('close').click();
            }
        };
        $('#defaultForm').ajaxSubmit(options);
    }
}
//修改
function Update() {
    if (validate()) {
        var options = {
            url: "RemoteHandlers/LineControl.ashx?type=update&id=" + $('#pid').val(),
            type: 'POST',
            success: function (result) {
                if (result == "1") {
                    ymPrompt.succeedInfo('修改成功', null, null, '提示信息', function () {
                        $("#flexTable").flexReload();
                       
                    });
                } else {
                    ymPrompt.errorInfo('修改失败', null, null, '提示信息', null);
                    return true;
                }
                document.getElementById('close').click();
            }
        };
        $('#defaultForm').ajaxSubmit(options);
    }
}
//删除




function deleteLine(id) {
    if (confirm('确认要删除这条记录吗?')) {
        var url = "RemoteHandlers/LineControl.ashx?type=delete&ID=" + id;
        $.ajax({
            type: "POST",
            url: url,
            async: false,
            cache: false,
            success: function (result) {
                if (result == "1") {
                    ymPrompt.succeedInfo('删除成功', null, null, '提示信息', function () {
                        $("#flexTable").flexReload();
                    });
                } else {
                    ymPrompt.errorInfo('删除失败', null, null, '提示信息', null);
                }
            }
        });
    }
}

function addOrUpdate() {
    var type = document.getElementById("text").value;
    if (type == "add") {
        Add();
    }
    else if (type == "update") {
        Update();
    }
}

//查询方法
function doQuery(_pageIndex) {
    var LINE_NAME = '';
    if ($('#txt_LineName').attr('value') != null && $('#txt_LineName').attr('value') != undefined && $('#txt_LineName').attr('value') != "") {
        LINE_NAME = $('#txt_LineName').attr('value');
    };
    var DIRECTION = '';
    if ($('#txt_direction').val() != null && $('#txt_direction').val()!= undefined&&$('#txt_direction').val()!= ""){
        DIRECTION = $('#txt_direction').val();
    };
    var LINE_TYPE = '';
    if ($('#txt_LineType option:selected')[0].value != null && $('#txt_LineType option:selected')[0].value != undefined) {
        LINE_TYPE = $('#txt_LineType option:selected')[0].value;
    };
    var SPEED_DGR = '';
    if ($('#txt_speed_dgr').val() != null && $('#txt_speed_dgr').val() != undefined) {
        SPEED_DGR = $('#txt_speed_dgr').val();
    };
    var LINE_DGR = '';
    if ($('#txt_line_dgr').val() != null && $('#txt_line_dgr').val() != undefined) {
        LINE_DGR = $('#txt_line_dgr').val();
    };
    var select1 = '';
    if ($('#select1').val() != null && $('#select1').val() != undefined) {
        select1 = $('#select1').val();
    };
    var PowerMethod = '';
    if ($('#txt_PowerMethod').val() != null && $('#txt_PowerMethod').val() != undefined) {
        PowerMethod = $('#txt_PowerMethod').val();
    };
    var HangType = '';
    if ($('#txt_HangType').val() != null && $('#txt_HangType').val() != undefined) {
        HangType = $('#txt_HangType').val();
    };

    
    option.url = 'RemoteHandlers/LineControl.ashx?type=all&LINE_NAME=' + escape(LINE_NAME) + "&DIRECTION=" + DIRECTION + "&LINE_TYPE=" + LINE_TYPE
        + "&SPEED_DGR=" + SPEED_DGR + "&LINE_DGR=" + LINE_DGR + "&select1=" + select1 + "&PowerMethod=" + PowerMethod + "&HangType=" + HangType + '&temp=' + Math.random();
    if (_pageIndex > 0) {
        option.newp = _pageIndex;
    }
    else if (_pageIndex == -1) {
        //从详细页关闭后，刷新。先取出当前页码。
        var _thisPage = $('.pGroup>.pcontrol>input').val();
        option.newp = _thisPage;
    }
    else {
        //正常操作分页按钮。
    }

    // option.newp = 1;


    $("#flexTable").flexigrid(option);
    $("#flexTable").flexOptions(option).flexReload();

}

var myTree;
//加载下拉列表
function loadSelect() {
    //线路等级
    $('#txt_line_dgr').mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: 'DPC',
        cateGory: 'PSARC',
        p_code: 'LINE_LV',
        isdefclick: false,
        onclick: function (event, treeid, treenode) {
            $('#txt_line_dgr').val(treenode.name).attr('code', treenode.id);
        },
        callback: function () {
            $('#txt_line_dgr').val('');
        }
    });
    $('#LINE_DGR').mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: 'DPC',
        cateGory: 'PSARC',
        p_code: 'LINE_LV',
        isdefclick: false,
        onclick: function (event, treeid, treenode) {
            $('#LINE_DGR').val(treenode.name).attr('code', treenode.id);
        },
        callback: function () {
            $('#LINE_DGR').val('');
        }
    });
    //$("#txt_LineName").mySelect({
    //    tag: "LINE",
    //    callback: function () {
    //        $('#txt_LineName option:first-child').val('');
    //    }

    //});
    //行别
    $('#txt_direction,#DIRECTION').mySelectTree({
        tag: 'SYSDICTIONARYTREE',

        codeType: '3C',
        cateGory: 'DRTFLG',
        p_code: 'DRTFLG',
        isDefClick: false,
        onClick: function (event, treeId, treeNode) {
            $('#txt_direction,#DIRECTION').val(treeNode.name).attr('code', treeNode.id);
        },
        callback: function () {
            $('#txt_direction option:first-child').val('');
            
        }
    });
    //速度等级
    $('#txt_speed_dgr').mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: 'DPC',
        cateGory: 'PSARC',
        p_code: 'SPEED_LV',
        isdefclick: false,
        onclick: function (event, treeid, treenode) {
            $('#txt_speed_dgr').val(treenode.name).attr('code', treenode.id);
        },
        callback: function () {
            $('#txt_speed_dgr').val('');
        }
    });
    $('#SPEED_DGR').mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: 'DPC',
        cateGory: 'PSARC',
        p_code: 'SPEED_LV',
        isdefclick: false,
        onclick: function (event, treeid, treenode) {
            $('#SPEED_DGR').val(treenode.name).attr('code', treenode.id);
        },
        callback: function () {
            $('#SPEED_DGR').val('');
        }
    });
    //供电方式
    $('#txt_PowerMethod').mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: 'DPC',
        cateGory: 'SUBSTARC',
        p_code: 'POWER_SUPPLY_MODE',
        isdefclick: false,
        onclick: function (event, treeid, treenode) {
            $('#txt_PowerMethod').val(treenode.name).attr('code', treenode.id);
        },
        callback: function () {
            $('#txt_PowerMethod').val('');
        }
    });
    $('#PowerMethod').mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: 'DPC',
        cateGory: 'SUBSTARC',
        p_code: 'POWER_SUPPLY_MODE',
        isdefclick: false,
        onclick: function (event, treeid, treenode) {
            $('#PowerMethod').val(treenode.name).attr('code', treenode.id);
        },
        callback: function () {
            $('#PowerMethod').val('');
        }
    });
    //线路类别
    $("#Sel_LINE_TYPE").mySelect({
        tag: "SYSDICTIONARY",
        code: "LINE_TYPE"
    }).change(function () {
        $("#LINE_TYPE").val($("#Sel_LINE_TYPE option:selected").text());
    });
    $("#txt_LineType").mySelect({
        tag: "SYSDICTIONARY",
        code: "LINE_TYPE",
        callback: function () {
            $('#txt_LineType option:first-child').val('');
        }
    })
    //路局名称

    myTree = $("#BUREAU_NAME").mySelectTree({
        tag: "ORGANIZATION_J",
        enableCheck: true,
        isSelectChildren: true,
        chkboxType: { "Y": "s", "N": "s" },
        onCheck: function (event, treeId, treeNode) {
            var nodes = myTree.getCheckedNodes(true);
            var ids = ""; codes = "";
            for (var n in nodes) {
                if (nodes[n].id != "TOPBOSS") {
                    ids += nodes[n].id + ",";
                    codes += nodes[n].name + ",";
                }
            }
            $("#BUREAU_NAME").val(codes.substring(0, codes.length - 1));
            $("#BUREAU_CODE").val(ids.substring(0, ids.length - 1));
        }
    });



}

function validate() {
    if ($("#LineName").val() == "") { ymPrompt.errorInfo('线路名称不能为空!', null, null, '提示信息', null); return false; } //线路名称
    if ($("#LINE_CODE").val() == "") { ymPrompt.errorInfo('线路编码不能为空!', null, null, '提示信息', null); return false; } //线路编码
    if ($("#LINETYPE").val() == "") { ymPrompt.errorInfo('线路类别不能为空!', null, null, '提示信息', null); return false; } //线路类别
    if ($("#DIRECTION").val() == "") { ymPrompt.errorInfo('行别不能为空!', null, null, '提示信息', null); return false; } //行别
    if ($("#LINE_NO").val() == "") { ymPrompt.errorInfo('线路号不能为空!', null, null, '提示信息', null); return false; } //线路号
    if ($("#BUREAU_NAME").val() == "") { ymPrompt.errorInfo('路局名称不能为空!', null, null, '提示信息', null); return false; } //路局名称
    return true;
}

function removeClass(val) {
    if (val.value.replace(/^ +| +$/g, '') == '') {
        $("#div" + val.id).addClass("control-group error");
    }
    if (val.value.replace(/^ +| +$/g, '') != '')
    { $("#div" + val.id).removeClass(); }
};


//验证输入必须为数字
function NumValidate(obj,value) {
    if (!/^[\d\.\-]*$/.test(value))
    {
        layer.tips('输入必须为数字且不能为空！',obj, {
            tips: [1, '#3595CC'],
            time: 2000
        });
    }
}
//验证填写的线路编码是否已存在
function ExistenceValidate(value) {
    var LINE_CODE = '';
    var options = {
        url: "RemoteHandlers/LineControl.ashx?type=verify&LINE_CODE=" + value,
        type: 'POST',
        success: function (verify_result) {
            if (verify_result == "-1") {
                ymPrompt.errorInfo('线路编码已存在,请更改编码后重试！', null, null, '提示信息', null);
            }
        }
    }
};