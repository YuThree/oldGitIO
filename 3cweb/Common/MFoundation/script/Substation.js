/*========================================================================================*
* 功能说明：变电所列表页面操作和数据展示JS
* 注意事项：
* 作    者： lc
* 版本日期：2014年9月29日
* 变更说明：
* 版 本 号： V1.0.0
*=======================================================================================*/

var option; //表格内容


function loadFlexiGrid(code, treeType) {
    option = {
        url: 'RemoteHandlers/SubstationControl.ashx?type=all&CODE=' + escape(code || "") + "&TREETYPE=" + (treeType || ""),
        dataType: 'json',
        colModel: [
                            { display: 'id', name: 'id', width: 80, hide: true, pk: true, sortable: false, align: 'center' },
			                { display: 'CODE', name: 'SUBSTATION_CODE', hide: true, width: 100, sortable: false, align: 'center' },
			                { display: '变电站编号', name: 'SUBSTATION_NO', width: 100, sortable: false, align: 'center' },
			                { display: '变电站', name: 'SUBSTATION_NAME', width: 100, sortable: false, align: 'center' },
                            { display: '变电站类型', name: 'SUBSTATION_TYPE', hide: true, sortable: false, align: 'center' },
                            { display: '局', name: 'BUREAU_NAME', width: 80, sortable: false, align: 'center' },
                            { display: '局CODE', name: 'BUREAU_CODE', hide: true, sortable: false, align: 'center' },
                            { display: '供电段', name: 'POWER_SECTION_NAME', width: 80, sortable: false, align: 'center' },
                            { display: '供电段CODE', name: 'POWER_SECTION_CODE', hide: true, sortable: false, align: 'center' },
                            { display: '车间', name: 'WORKSHOP_NAME', hide: true, sortable: false, align: 'center' },
                            { display: '车间CODE', name: 'WORKSHOP_CODE', hide: true, sortable: false, align: 'center' },
                            { display: '工区', name: 'ORG_NAME', hide: true, sortable: false, align: 'center' },
                            { display: '工区CODE', name: 'ORG_CODE', hide: true, sortable: false, align: 'center' },
                            { display: '线路', name: 'LINE_NAME', width: 80, sortable: false, align: 'center' },
                            { display: '线路CODE', name: 'LINE_CODE', hide: true, sortable: false, align: 'center' },
                            { display: '区站', name: 'POSITION_NAME', hide: true, sortable: false, align: 'center' },
                            { display: '区站CODE', name: 'POSITION_CODE', hide: true, sortable: false, align: 'center' },
			                { display: '经度', name: 'GIS_LAT', width: 80, sortable: false, align: 'center' },
			                { display: '纬度', name: 'GIS_LON', width: 80, sortable: false, align: 'center' },
                            { display: '地理位置', name: 'MONITOR_PLACE', hide: true, sortable: false, hide: true, align: 'center' },
                            { display: '上行公里标', name: 'KM_MARK_SX', hide: true, sortable: false, hide: true, align: 'center' },
			                { display: '下行公里标', name: 'KM_MARK_XX', hide: true, sortable: false, align: 'center' },
			                { display: '接口版本', name: 'INF_VERSION', hide: true, sortable: false, hide: true, align: 'center' },
			                { display: '备注', name: 'NOTE', hide: true, sortable: false, align: 'center' },
                            { display: '操作', name: 'cz', width: 80, sortable: false, hide: true, align: 'center' },
        ],
        usepager: true,
        title: '变电所列表',
        pagestat: '显示第 {from} 条到 {to} 条,共 {total} 条数据', // 显示当前页和总页面的样式
        procmsg: '正在处理,请稍候 ...', // 正在处理的提示信息
        nomsg: '没有数据存在!', // 无结果的提示信息
        pagetext: '当前第',
        outof: '页，总页数',
        findtext: '条件查询：',
        useRp: true,
        checkbox: false, // 是否要多选框
        rowId: 'id', // 多选框绑定行的id
        rp: 30,
        showTableToggleBtn: true,
        width: 'auto',
        height: flexTableh - 80,
        title: false, //是否包含标题 
        resizable: false, //是否可伸缩 
        striped: true //是否显示斑纹效果，默认是奇偶交互的形式
    }
    $("#flexTable").flexigrid(option);
}

//弹出添加蒙层
function addSubstationModal() {
    $("#divSUBSTATION_NAME").addClass("control-group error");
    $("#divSUBSTATION_TYPE").addClass("control-group error");
    $("#divGIS_LON").addClass("control-group error");
    $("#divGIS_LAT").addClass("control-group error");
    $("#divBUREAU_CODE").addClass("control-group error");
    $("#divPOWER_SECTION_CODE").addClass("control-group error");
    $("#divLINE_CODE").addClass("control-group error");
    $("#divSUBSTATION_NO").addClass("control-group error");

    $('#SUBSTATION_NAME').removeAttr("readonly");
    $("#SUBSTATION_TYPE").removeAttr("disabled");
    $("#LINE_CODE").removeAttr("disabled");
    $('#SUBSTATION_NO').removeAttr("readonly");

    $('#SUBSTATION_NAME').val("");
    $("#SUBSTATION_TYPE option:first").attr("selected", true);
    $("#BUREAU_CODE option:first").attr("selected", true);
    $("#BUREAU_NAME").val("");
    $("#POWER_SECTION_CODE option:first").attr("selected", true);
    $("#BUREAU_NAME").val("");
    $("#WORKSHOP_CODE option:first").attr("selected", true);
    $("#WORKSHOP_NAME").val("");
    $("#ORG_CODE option:first").attr("selected", true);
    $("#ORG_NAME").val("");
    $("#LINE_CODE option:first").attr("selected", true);
    $("#LINE_NAME").val("");
    $("#POSITION_CODE option:first").attr("selected", true);
    $("#POSITION_NAME").val("");
    $('#GIS_LAT').val("");
    $('#GIS_LON').val("");
    $("#SUBSTATION_NO").val("");
    $("#MONITOR_PLACE").val("");
    $("#KM_MARK_SX").val("");
    $("#KM_MARK_XX").val("");
    //$("#INF_VERSION").val("");
    $("#NOTE").val("");
    document.getElementById("text").value = "add";
    document.getElementById('modal-22256').click();
}

//弹出修改蒙层
function updateSubstationModal(rowData) {
    $("#divSUBSTATION_NAME").removeClass();
    $("#divSUBSTATION_TYPE").removeClass();
    $("#divGIS_LON").removeClass();
    $("#divGIS_LAT").removeClass();
    $("#divBUREAU_CODE").removeClass();
    $("#divPOWER_SECTION_CODE").removeClass();
    $("#divLINE_CODE").removeClass();
    $("#divSUBSTATION_NO").removeClass();

    $('#SUBSTATION_ID').val($('div:eq(0)', rowData).text().trim());
    $('#SUBSTATION_NAME').val($('div:eq(3)', rowData).text().trim());
    //$("#SUBSTATION_TYPE").val($('div:eq(4)', rowData).text().trim());
    LoadDropdSelected('SUBSTATION_TYPE', $('div:eq(4)', rowData).text().trim());
    $("#BUREAU_CODE").val($('div:eq(6)', rowData).text().trim());
    $("#BUREAU_NAME").val($('div:eq(5)', rowData).text().trim());
    $("#LINE_CODE").val($('div:eq(14)', rowData).text().trim());
    $("#LINE_NAME").val($('div:eq(13)', rowData).text().trim());
    if ($('div:eq(6)', rowData).text().trim() != "")
        $("#POWER_SECTION_CODE").mySelect({
            tag: "ORGANIZATION",
            type: "GDD",
            code: $('div:eq(6)', rowData).text().trim(),
            callback: function () {
                $("#POWER_SECTION_CODE").val($('div:eq(8)', rowData).text().trim());
                $("#POWER_SECTION_NAME").val($('div:eq(7)', rowData).text().trim());
            }
        });
    else
        $("#POWER_SECTION_CODE").html("<option value='0'>全部</option>");
    if ($('div:eq(8)', rowData).text().trim() != "")
        $("#WORKSHOP_CODE").mySelect({
            tag: "ORGANIZATION",
            code: $('div:eq(8)', rowData).text().trim(),
            callback: function () {
                $("#WORKSHOP_CODE").val($('div:eq(10)', rowData).text().trim());
                $("#WORKSHOP_NAME").val($('div:eq(9)', rowData).text().trim());
            }
        });
    else
        $("#WORKSHOP_CODE").html("<option value='0'>全部</option>");
    if ($('div:eq(10)', rowData).text().trim() != "")
        $("#ORG_CODE").mySelect({
            tag: "ORGANIZATION",
            code: $('div:eq(10)', rowData).text().trim(),
            callback: function () {
                $("#ORG_CODE").val($('div:eq(12)', rowData).text().trim());
                $("#ORG_NAME").val($('div:eq(11)', rowData).text().trim());
            }
        });
    else
        $("#ORG_CODE").html("<option value='0'>全部</option>");
    if ($('div:eq(14)', rowData).text().trim() != "")
        $("#POSITION_CODE").mySelect({
            tag: "STATIONSECTION",
            code: $('div:eq(14)', rowData).text().trim(),
            callback: function () {
                $("#POSITION_CODE").val($('div:eq(16)', rowData).text().trim());
                $("#POSITION_NAME").val($('div:eq(15)', rowData).text().trim());
            }
        });
    else
        $("#POSITION_CODE").html("<option value='0'>全部</option>");
    $('#GIS_LAT').val($('div:eq(17)', rowData).text().trim());
    $('#GIS_LON').val($('div:eq(18)', rowData).text().trim());
    $("#SUBSTATION_NO").val($('div:eq(2)', rowData).text().trim());
    $("#MONITOR_PLACE").val($('div:eq(19)', rowData).text().trim());
    $("#KM_MARK_SX").val($('div:eq(20)', rowData).text().trim());
    $("#KM_MARK_XX").val($('div:eq(21)', rowData).text().trim());
    //$("#INF_VERSION").val($('div:eq(22)', rowData).text().trim());
    $("#NOTE").val($('div:eq(23)', rowData).text().trim());

    $('#SUBSTATION_NAME').attr("readonly", "readonly");
   // $("#SUBSTATION_TYPE").attr("disabled", "disabled");
   // $("#LINE_CODE").attr("disabled", "disabled");
    $('#SUBSTATION_NO').attr("readonly", "readonly");

    document.getElementById("text").value = "update";
    document.getElementById('modal-22256').click();
}

//执行添加变电所操作
function Add() {
    if (validate()) {
        var options = {
            url: "RemoteHandlers/SubstationControl.ashx?type=add",
            type: 'POST',
            success: function (result) {
                if (result == "1") {
                    ymPrompt.succeedInfo('添加成功', null, null, '提示信息', function () {
                        $("#flexTable").flexReload();
                        myTree.reAsyncChildNodes(null, "refresh");
                        document.getElementById('close').click();
                    });
                } else if (result == "-2") {
                    ymPrompt.errorInfo('变电所编码已存在，请更改相关信息后重试！', null, null, '提示信息', null);
                } else {
                    ymPrompt.errorInfo('添加失败', null, null, '提示信息', null);
                    document.getElementById('close').click();
                }

            }
        };
        $('#StationForm').ajaxSubmit(options);
    }

}

//执行修改变电所操作
function Update() {
    if (validate()) {
        var options = {
            url: "RemoteHandlers/SubstationControl.ashx?type=update&id=" + $("#SUBSTATION_ID").val(),
            type: 'POST',
            success: function (result) {
                if (result == "1") {
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
        $('#StationForm').ajaxSubmit(options);
    }
}


//删除变电所
function deleteSubstation(rowData) {
    ymPrompt.confirmInfo({
        message: '确认要删除这条记录吗?',
        handler: function (tp) {
            if (tp == 'ok') {
                var url = "RemoteHandlers/SubstationControl.ashx?type=delete&id=" + escape($('div:eq(0)', rowData).text().trim());
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

//查询方法
function doQuery() {
    var BUREAU = $('#ddlju').val()
    var SECTION = $('#ddlduan').val()
    var line = $('#ddlline').val()
    var name = $('#txt_SUBSTATION_NAME').val()
    option.url = 'RemoteHandlers/SubstationControl.ashx?type=all&BUREAU=' + escape(BUREAU) + '&SECTION=' + escape(SECTION) + '&LINE=' + escape(line) + '&NAME=' + escape(name);
    option.newp = 1;
    $("#flexTable").flexOptions(option).flexReload();

}

//加载下拉列表
function loadSelect() {

    $("#SUBSTATION_NAME").blur(function () {
        $("#SUBSTATION_NAME_CODE").val(makePy($("#SUBSTATION_NAME").val()));
    });


    $("#ddlline").mySelect({
        tag: "Line",
        callback: function (rs) {
            $("#LINE_CODE").html(rs).change(function () {
                var lcode = $(this).val();
                if (lcode == "0") {
                    $("#divLINE_CODE").addClass("control-group error");
                    $("#POSITION_CODE").html("<option value='0'>全部</option>");
                } else {
                    $("#LINE_NAME").val($(this).find("option:selected").text());
                    $("#divLINE_CODE").removeClass();
                    $("#POSITION_CODE").mySelect({
                        tag: "StationSection",
                        code: lcode
                    }).change(function () {
                        if ($(this).val() != "0")
                            $("#POSITION_NAME").val($(this).find("option:selected").text());
                    });
                }
            });;
        }
    });
    $("#SUBSTATION_TYPE").mySelect({
        tag: "SYSDICTIONARY",
        code: "SUBSTATIONTYPE"
    }).change(function () {
        var val = $(this).val();
        if (val == "0") {
            $("#divSUBSTATION_TYPE").addClass("control-group error");
        } else {
            $("#SUBSTATION_TYPE_NAME").val($(this).find("option:selected").text());
            $("#divSUBSTATION_TYPE").removeClass();
        }
    });
    loadOrgSelect1("ddlju", "ddlduan", "ddlline");
    loadOrgSelect("BUREAU_CODE", "POWER_SECTION_CODE", "WORKSHOP_CODE", "ORG_CODE");

    $("#BUREAU_CODE").change(function () {
        var val = $(this).val();
        if (val == "0") {
            $("#divBUREAU_CODE").addClass("control-group error");
        } else {
            $("#BUREAU_NAME").val($(this).find("option:selected").text());
            $("#divBUREAU_CODE").removeClass();
        }
    });
    $("#POWER_SECTION_CODE").change(function () {
        var val = $(this).val();
        if (val == "0") {
            $("#divPOWER_SECTION_CODE").addClass("control-group error");
        } else {
            $("#POWER_SECTION_NAME").val($(this).find("option:selected").text());
            $("#divPOWER_SECTION_CODE").removeClass();
        }
    });

    $("#WORKSHOP_CODE").change(function () {
        if ($(this).val() != "0")
            $("#WORKSHOP_NAME").val($(this).find("option:selected").text());
    });

    $("#ORG_CODE").change(function () {
        if ($(this).val() != "0")
            $("#ORG_NAME").val($(this).find("option:selected").text());
    });
}

var myTree;
//加载树
function loadTree() {
    myTree = $("#tree").myTree({
        tag: "SUBSTATION",
        isDefClick: false,
        onClick: function (event, treeId, treeNode) {
            option.url = 'RemoteHandlers/SubstationControl.ashx?type=all&CODE=' + escape(treeNode.id) + "&TREETYPE=" + escape(treeNode.type) + "&PID=" + escape(treeNode.pId);
            option.newp = 1;
            $("#flexTable").flexOptions(option).flexReload();
        }
    });
}

function removeClass(val) {
    if (val.value.replace(/^ +| +$/g, '') == '') {
        $("#div" + val.id).addClass("control-group error");
    }
    if (val.value.replace(/^ +| +$/g, '') != '')
    { $("#div" + val.id).removeClass(); }
}

function validate() {
    if ($("#SUBSTATION_NAME").val() == "") { ymPrompt.errorInfo('变电所名称不能为空!', null, null, '提示信息', null); return false; } //区站名称 
  //  if ($("#SUBSTATION_TYPE").val() == "0") { ymPrompt.errorInfo('变电所类型不能为空!', null, null, '提示信息', null); return false; }
    if ($("#BUREAU_CODE").val() == "0") { ymPrompt.errorInfo('局不能为空!', null, null, '提示信息', null); return false; }
    if ($("#POWER_SECTION_CODE").val() == "0") { ymPrompt.errorInfo('段不能为空!', null, null, '提示信息', null); return false; }
    if ($("#LINE_CODE").val() == "0") { ymPrompt.errorInfo('线路不能为空!', null, null, '提示信息', null); return false; }

    if ($("#SUBSTATION_NO").val() == "") { ymPrompt.errorInfo('编号不能为空!', null, null, '提示信息', null); return false; }
    if ($("#GIS_LON").val() == "") { ymPrompt.errorInfo('纬度不能为空!', null, null, '提示信息', null); return false; } //纬度
    if ($("#GIS_LAT").val() == "") { ymPrompt.errorInfo('经度不能为空!', null, null, '提示信息', null); return false; } //经度 
    if ($("#SUBSTATION_NO").val() != "" && !StringHelper.isInt($("#SUBSTATION_NO").val())) { ymPrompt.errorInfo('编号必须为整数!', null, null, '提示信息', null); return false; }
    if ($("#GIS_LON").val() != "" && !StringHelper.isFloat($("#GIS_LON").val())) { ymPrompt.errorInfo('纬度必须为数字!', null, null, '提示信息', null); return false; } //纬度
    if ($("#GIS_LAT").val() != "" && !StringHelper.isFloat($("#GIS_LAT").val())) { ymPrompt.errorInfo('经度必须为数字!', null, null, '提示信息', null); return false; } //经度 
    return true;

}