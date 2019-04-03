/*========================================================================================*
* 功能说明：区站列表页面操作和数据展示JS
* 注意事项：
* 作    者： lc
* 版本日期：2014年9月29日
* 变更说明：
* 版 本 号： V1.0.0
*=======================================================================================*/

var option; //表格内容

function loadFlexiGrid(code, treeType) {
    var _h = $(window).height() - 250;
    var _PageNum = parseInt(_h / 25);
    option = {
        url: 'RemoteHandlers/PositionControl.ashx?type=all&CODE=' + code + "&TREETYPE=" + treeType,
        dataType: 'json',
        colModel: [
                            { display: '操作', name: 'cz', width: 110, sortable: false, align: 'center' },
			                { display: '位置编号', name: 'POSITION_CODE', width: 0, sortable: false, hide: true, align: 'center' },
                            { display: '区站名称', name: 'POSITION_NAME', width: 180, sortable: false, align: 'center' },
                            { display: '区间里程', name: 'POSITION_LENGTH', width: 70, sortable: false, align: 'center' },
                            { display: '起始公里标', name: 'START_KM', width: 70, sortable: false, align: 'center' },
                            { display: '结束公里标', name: 'END_KM', width: 70, sortable: false, align: 'center' },
			                { display: '所属线路名称', name: 'LINE_NAME', width: 120, sortable: false, align: 'center' },
			                { display: '线路主键', name: 'LINE_CODE', width: 0, hide: true, sortable: false, align: 'center' },
			                { display: '区站顺序', name: 'POSITION_ORDER', width: 0, sortable: true, hide: true, align: 'center' },
			                { display: '区站类型', name: 'PROC_POSITION_TYPE', width: 60, sortable: false, align: 'center' },
			                { display: '使用状态', name: 'SECTION_STATE', width: 0, sortable: false, hide: true, align: 'center' },
			                { display: '所属车间', name: 'WORKSHOP_NAME', width: 180, hide: false, sortable: false, align: 'center' },
			                { display: '车间主键', name: 'WORKSHOP_CODE', width: 0, hide: true, sortable: false, align: 'center' },
			                { display: '所属工区', name: 'ORG_CODE', width: 0, sortable: false, hide: true, align: 'center' },
			                { display: '供电组织机构', name: 'ORG_NAME', width: 180, sortable: false, hide: false, align: 'center' },
			                { display: '经度', name: 'GIS_X', width: 70, sortable: false, align: 'center' },
			                { display: '纬度', name: 'GIS_Y', width: 70, sortable: false, align: 'center' },
			                { display: '总量(条公里)', name: 'POSITION_TGL', width: 0, hide: true, sortable: false, align: 'center' },
			                { display: '是否重污染', name: 'ISZWR', width: 70, sortable: false, align: 'center' },
                            { display: '电化股道数', name: 'TRCS_NUM', width: 70, sortable: false, align: 'center' },
			                { display: '是否显示', name: 'GIS_SHOW', width: 60, sortable: false, align: 'center' },
			                { display: '图标路径', name: 'ICONPATH', width: 0, sortable: false, hide: true, align: 'center' },
			                { display: '备注', name: 'NOTE', width: 0, sortable: false, hide: true, align: 'center' },

                            { display: '', name: 'POSITION_CODE_PLUS', width: 0, hide: true, sortable: false },
                            { display: 'id', name: 'id', width: 80, hide: true, pk: true, sortable: false, align: 'center' }
        ],
        title: '区站列表',
        pagestat: '显示第 {from} 条到 {to} 条,共 {total} 条数据', // 显示当前页和总页面的样式
        procmsg: '正在处理,请稍候 ...', // 正在处理的提示信息
        nomsg: '没有数据存在!', // 无结果的提示信息
        pagetext: '当前第',
        outof: '页，总页数',
        findtext: '条件查询：',
        checkbox: false, // 是否要多选框
        rowId: 'id', // 多选框绑定行的id
        rp: _PageNum,
        width: 'auto',
        height: _h,
        rpOptions: [20, 50, 100, _PageNum],
        striped: true, //是否显示斑纹效果，默认是奇偶交互的形式
        onSuccess: function () {
            //初始化修改和删除按钮
            var flexTable_tr = $('#flexTable tr');
            var btn_delete = "<span class= 'btn-delete j-delete ' style='padding-right:15px'></span>";
            var btn_edit = "<span class='btn-edit j-edit ' style='padding-left:15px'></span>";
            for (var i = 0; i < flexTable_tr.length; i++) {
                $(flexTable_tr[i]).find(' td:eq(0) div').html(btn_edit + btn_delete);
            }
            //$('#flexTable tr').mouseover(function () {
            //    $(this).find('.j-edit').removeClass('hide');
            //    $(this).find('.j-delete').removeClass('hide');
            //}).mouseout(function () {
            //    $(this).find('.j-edit').addClass('hide');
            //    $(this).find('.j-delete').addClass('hide');
            //});
            //给修改图标和删除图标添加鼠标事件
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
            //给修改图标和删除图标增加点击事件，点击后执行相应的修改和删除功能
            $('.j-delete').click(function () {
                var rowData = $(this).parent().parent().parent()[0];
                deletePosition(rowData);
            });
            $('.j-edit').click(function () {
               
                var rowData = $(this).parent().parent().parent()[0];

                updatePositionModal(rowData);

            });

        }
    };
    $("#flexTable").flexigrid(option);
}

var null_option = "<option value='0'>全部</option>";

//弹出添加蒙层
function addPositionModal() {
   // $("#divtxtPOSITION_NAME").addClass("control-group error");
    //$("#divPOSITION_TGL").addClass("control-group error");
   // $("#divtxtPOSITION_ORDER").addClass("control-group error");
    //$("#divtxtGIS_Y").addClass("control-group error");
    //$("#divtxtGIS_X").addClass("control-group error");
    $("#txtPOSITION_CODE").val("");
    $('#txtPOSITION_NAME').val("");

    $("#ddlLine").removeAttr("disabled");
    $("#ddlLine option:first").attr("selected", true);
    $("#startStation").html(null_option);
    $("#endStation").html(null_option);
    $("#ddlOrg").html(null_option);
    $("#ddlOrg option:first").attr("selected", true);

    $("#ddlWorkshop option:first").attr("selected", true);
    $("#txtPOSITION_ORDER").val("").removeAttr("readonly");
    $("#ddlGis option:first").attr("selected", true);
    $("#startStation option:first").attr("selected", true);
    $("#endStation option:first").attr("selected", true);
    $("#POSITION_TYPE option:first").attr("selected", true);
    $("#SECTION_STATE").val("");
    $("#WORKSHOP_NAME").val("");
    $('#TRCS_NUM').val("");
    $("#txtGIS_Y").val("");
    $("#txtGIS_X").val("");
    $("#POSITION_TGL").val("");
    $("#ISZWR option:first").attr("selected", true);
    $("#ICONPATH").val("");
    $("#txtNOTE").val("");
    $('#POSITION_LENGTH').val("");
    $('#START_KM').val("");
    $('#END_KM').val("");
    $("#trStation").hide();
    document.getElementById("text").value = "add";
    //document.getElementById('modal-22256').click();
    $("#modal-container-22256").modal();
}

//弹出修改蒙层
function updatePositionModal(rowData) {
    $("#divtxtPOSITION_NAME").removeClass();
    $("#divPOSITION_TGL").removeClass();
    $("#divtxtPOSITION_ORDER").removeClass();
    $("#divtxtGIS_Y").removeClass();
    $("#divtxtGIS_X").removeClass();
    //$("#txtPOSITION_CODE").val($('div:eq(0)', rowData).text().trim());
    $('#txtPOSITION_NAME').val($('div:eq(2)', rowData).text().trim());//区站名称

    LoadDropdSelected('ddlLine', $('div:eq(6)', rowData).text().trim());//所属线路

    $("#txtPOSITION_ORDER").val($('div:eq(8)', rowData).text().trim()) //.attr("readonly", "readonly");//区站顺序
    $('#POSITION_LENGTH').val($('div:eq(3)', rowData).text().trim())//运营里程
    LoadDropdSelected('POSITION_TYPE', $('div:eq(9)', rowData).text().trim());//区站类型

    if ($("#POSITION_TYPE").val() == "S") {
        $("#trStation").hide();
    } else {
        $("#trStation").show();
    }

    //$("#SECTION_STATE").val($('div:eq(6)', rowData).text().trim());

   // $("#ddlLine").attr("disabled", "disabled");
    LoadDropdSelected('ddlWorkshop', $('div:eq(11)', rowData).text().trim());

    chejianChange($("#ddlWorkshop").val());

    LoadDropdSelected('ddlOrg', $('div:eq(14)', rowData).text().trim());
    $("#ORG_NAME").val($('div:eq(14)', rowData).text().trim());
    lineChange($("#ddlLine").val());

    var codePlus = $('div:eq(19)', rowData).text().split("*");

    $("#startStation").val(codePlus[0]);
    $("#endStation").val(codePlus[1]);
    $('#START_KM').val($('div:eq(4)', rowData).text().trim())
    $('#END_KM').val($('div:eq(5)', rowData).text().trim())


    $("#txtGIS_Y").val($('div:eq(16)', rowData).text().trim());
    $("#txtGIS_X").val($('div:eq(15)', rowData).text().trim());
    $("#POSITION_TGL").val($('div:eq(17)', rowData).text().trim());//总条数
    LoadDropdSelected('ISZWR', $('div:eq(18)', rowData).text().trim());
    $('#TRCS_NUM').val($('div:eq(19)', rowData).text().trim());
    LoadDropdSelected('ddlGis', $('div:eq(20)', rowData).text().trim());
    $("#ICONPATH").val($('div:eq(16)', rowData).text().trim());
    $("#txtNOTE").val($('div:eq(22)', rowData).text().trim());
   // $("#txtNOTE").val($('div:eq(17)', rowData).text().trim());
    $("#POSITION_ID").val($('div:eq(24)', rowData).text().trim().replace("pos", ""));
    document.getElementById("text").value = "update";
    document.getElementById('modal-22256').click();
}

//查询方法
function doQuery() {
    var POSITION_NAME = $("#POSITION_NAME").val();
    var LINE_CODE = $("#ddlTxtLine").attr("value");
    option.url = 'RemoteHandlers/PositionControl.ashx?type=all&POSITION_NAME=' + escape(POSITION_NAME) + '&LINE_CODE=' + escape(LINE_CODE);
    option.newp = 1;
    $("#flexTable").flexigrid(option);
    $("#flexTable").flexOptions(option).flexReload();

}

//执行添加区站操作
function Add() {
    if (validate()) {
        var options = {
            url: "RemoteHandlers/PositionControl.ashx?type=add",
            type: 'POST',
            success: function (result) {
                if (result == "1") {
                    ymPrompt.succeedInfo('添加成功', null, null, '提示信息', function () {
                        $("#POSITION_NAME").val('');
                        $("#flexTable").flexReload();
                        myTree.reAsyncChildNodes(null, "refresh");//表示清空后重新加载
                    });
                } else if (result == "-2") {
                    ymPrompt.errorInfo('区站编码已存在，请更改相关信息后重试！', null, null, '提示信息', null);
                    return true;
                }
                else {
                    ymPrompt.errorInfo('添加失败', null, null, '提示信息', null);
                }
                document.getElementById('close').click();
            }
        };
        $('#positionForm').ajaxSubmit(options);
    }
}

//执行修改区站操作
function Update() {
    if (validate()) {
        var options = {
            url: "RemoteHandlers/PositionControl.ashx?type=update&id=" + $("#POSITION_ID").val(),
            type: 'POST',
            success: function (result) {
                if (result == "1") {
                    $("#POSITION_NAME").val('');
                    ymPrompt.succeedInfo('修改成功', null, null, '提示信息', function () {
                        $("#flexTable").flexReload();
                        myTree.reAsyncChildNodes(null, "refresh");
                    });
                } else {
                    ymPrompt.errorInfo('修改失败', null, null, '提示信息', null);
                }
                document.getElementById('close').click();
            }
        };
        $('#positionForm').ajaxSubmit(options);
    }
}

//删除区站
function deletePosition(rowData) {
    ymPrompt.confirmInfo({
        message: '确认要删除这条记录吗?',
        handler: function (tp) {
            if (tp == 'ok') {
                var url = "RemoteHandlers/PositionControl.ashx?type=delete&id=" + escape($('div:eq(24)', rowData).text().trim().replace("pos", "")) + '&temp=' + Math.random();
                $.ajax({
                    type: "POST",
                    url: url,
                    async: false,
                    cache: false,
                    success: function (result) {
                        if (result == "1") {
                            ymPrompt.succeedInfo('删除成功', null, null, '提示信息', function () {
                                $("#flexTable").flexReload();
                                myTree.reAsyncChildNodes(null, "refresh");
                            });
                        } else {
                            ymPrompt.errorInfo('删除失败', null, null, '提示信息', null);
                        }
                    }
                });
            }
        }
    });
}

//判断添加还是修改
function addOrUpdate() {
    var type = document.getElementById("text").value;
    if (type == "add") {
        Add();
    }
    else if (type == "update") {
        Update();
    }

}


function loadSelect() {

    $("#ddlTxtLine").mySelect({
        tag: "LINE",
        callback: function (rs) {
            $("#ddlLine").html(rs);
        }
    });

    $("#ddlWorkshop").mySelect({
        tag: "ORGANIZATION",
        type: "CJ"
    });

}

function lineChange(value) {

    $("#LINE_NAME").val($("#ddlLine").find("option:selected").text());

    $("#startStation").mySelect({
        tag: "STATIONSECTION",
        code: value,
        type: "S",
        async: false,
        callback: function (rs) {
            $("#endStation").html(rs);
        }
    });
}


//
function chejianChange(code) {
    $("#ddlOrg").mySelect({
        tag: "ORGANIZATION",
        code: code,
        async: false
    });

    $("#WORKSHOP_NAME").val($("#ddlWorkshop").find("option:selected").text());
}

function orgChange(value) {
    $("#ORG_NAME").val($("#ddlOrg").find("option:selected").text());
}

function postionTypeChange(val) {
    if (val == "Q") {
        $("#trStation").show();
    }
    else {
        $("#trStation").hide();
    }
}

//
function removeClass(val) {
    if (val.value.replace(/^ +| +$/g, '') == '') {
        $("#div" + val.id).addClass("control-group error");
    }
    if (val.value.replace(/^ +| +$/g, '') != '')
    { $("#div" + val.id).removeClass(); }
}
//
function validate() {
    if ($("#txtPOSITION_NAME").val() == "") { ymPrompt.errorInfo('区站名称不能为空!', null, null, '提示信息', null); return false; } //区站名称 
    if ($("#POSITION_LENGTH").val() == "") { ymPrompt.errorInfo('区间里程不能为空!', null, null, '提示信息', null); return false; } //总量(条公里)
    if (!StringHelper.isFloat($("#POSITION_LENGTH").val())) { ymPrompt.errorInfo('区间里程必须为数字!', null, null, '提示信息', null); return false; } //总量(条公里)
    if ($("#txtPOSITION_ORDER").val() == "") { ymPrompt.errorInfo('区站编码不能为空!', null, null, '提示信息', null); return false; } //区站顺序 
    if (!StringHelper.isInt($("#txtPOSITION_ORDER").val())) { ymPrompt.errorInfo('区站顺序必须为整数!', null, null, '提示信息', null); return false; } //区站顺序 
    if ($("#txtGIS_Y").val() == "") { ymPrompt.errorInfo('纬度不能为空!', null, null, '提示信息', null); return false; } //纬度
    if (!StringHelper.isFloat($("#txtGIS_Y").val())) { ymPrompt.errorInfo('纬度必须为数字!', null, null, '提示信息', null); return false; } //纬度
    if ($("#txtGIS_X").val() == "") { ymPrompt.errorInfo('经度不能为空!', null, null, '提示信息', null); return false; } //经度 
    if (!StringHelper.isFloat($("#txtGIS_X").val())) { ymPrompt.errorInfo('经度必须为数字!', null, null, '提示信息', null); return false; } //经度 

    if ($("#POSITION_TYPE").val() == "Q" && ($("#startStation").val() == "0" || $("#endStation").val() == "0")) {
        ymPrompt.errorInfo('必须选择开始和结束车站!', null, null, '提示信息', null); return false;
    }


    if ($("#POSITION_TYPE").val() == "Q" && $("#startStation").val() == $("#endStation").val()) {
        ymPrompt.errorInfo('选择开始与结束站不能相同!', null, null, '提示信息', null); return false;
    }

    return true;

}