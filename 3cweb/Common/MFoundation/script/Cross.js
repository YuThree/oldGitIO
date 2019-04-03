/*========================================================================================*
* 功能说明：交路列表页面操作和数据展示JS
* 注意事项：
* 作    者： lc
* 版本日期：2014年9月29日
* 变更说明：
* 版 本 号： V1.0.0
*=======================================================================================*/
var option; //表格内容
var option1;
var option2;

function loadFlexiGrid() {
    var _h = $(window).height() - 180 - 25;
    var _PageNum = parseInt(_h / 25);
    option = {
        url: 'RemoteHandlers/CrossControl.ashx?type=all',
        dataType: 'json',
        colModel: [
                    { display: '交路号', name: 'ROUTING_NO', width: 80, sortable: false, align: 'center' },
			        { display: '运用区段', name: 'AREA_SECTION', width: 250, sortable: false, align: 'center' },
			        { display: '客/货', name: 'CUSTOMER_GOODS', width: 100, sortable: false, align: 'center' },
			        { display: '相关局code', name: 'BUREAU_CODE', width: 80, hide: true, sortable: false, align: 'center' },
			        { display: '相关局名称', name: 'BUREAU_NAME', width: 80, sortable: false, align: 'center' },
			        { display: 'ROUTING_CODE', name: 'ROUTING_CODE', width: 80, hide: true, sortable: false, align: 'center' },
			        { display: '操作', name: 'cz', width: 80, sortable: false, align: 'center' },
			        { display: 'id', name: 'id', width: 80, hide: true, pk: true, sortable: false, align: 'center' },
        ],
        usepager: true,
        title: '交路列表',
        pagestat: '显示第 {from} 条到 {to} 条,共 {total} 条数据', // 显示当前页和总页面的样式
        procmsg: '正在处理,请稍候 ...', // 正在处理的提示信息
        nomsg: '没有数据存在!', // 无结果的提示信息
        pagetext: '当前第',
        outof: '页，总页数',
        findtext: '条件查询：',
        useRp: true,
        checkbox: false, // 是否要多选框
        rowId: 'id', // 多选框绑定行的id
        rp: _PageNum,
        showTableToggleBtn: true,
        width: 'auto',
        height: _h,
        rpOptions: [20, 50, 100, _PageNum],
        title: false, //是否包含标题 
        resizable: false, //是否可伸缩 
        striped: true //是否显示斑纹效果，默认是奇偶交互的形式
    }
    $("#flexTable").flexigrid(option);
}

function doQuery() {
    var CROSSING_NUMBER = $('#txt_CrossNumber').val();
    var BUREAU_CODE = $('#ddlJu').val();
    option.url = 'RemoteHandlers/CrossControl.ashx?type=all&CROSSING_NUMBER=' + escape(CROSSING_NUMBER) + '&BUREAU_CODE=' + BUREAU_CODE;
    option.newp = 1;
    $("#flexTable").flexOptions(option).flexReload();
}

//弹出添加蒙层
function addCrossModal() {

    $("#RoutNo").removeAttr("readonly");
    $("#ddlOrg").removeAttr("disabled");

    $("#divCover").hide();
    $("#divInfo").hide();
    $("#divRoutNo").addClass("control-group error");
    $("#divddlOrg").addClass("control-group error");
    $('#RoutNo').val("");
    $("#AreaSection").val("");
    $("#CustomerGoods").val("");
    $("#ddlOrg option:first").attr("selected", true);
    $("#CODE").val("");
    $('#stationNo').val("");
    $('#stationName').val("");
    document.getElementById("text").value = "add";
    //document.getElementById('modal-22256').click();
    $("#modal-container-22256").modal();
}

//管理车站信息
function mgrCrossModal(rowData) {
    var routCode = $('div:eq(5)', rowData).text().trim();
    $('#ROUTING_CODE').val(routCode);
    $('#ROUTEING_NO').val($('div:eq(0)', rowData).text().trim());
    $('#BUREAU_CODE').val($('div:eq(3)', rowData).text().trim());
    $('#BUREAU_NAME').val($('div:eq(4)', rowData).text().trim());

    option1.url = 'RemoteHandlers/CrossControl.ashx?type=lkj&RoutCode=' + routCode;
    option1.newp = 1;
    $("#flexTable1").flexOptions(option1).flexReload();
    document.getElementById('modal-22257').click();
}

//弹出修改蒙层
function updateCrossModal(rowData) {
    $("#RoutNo").attr("readonly", "readonly");
    $("#ddlOrg").attr("disabled", "disabled");

    $("#divCover").hide();
    $("#divInfo").hide();
    $("#divRoutNo").removeClass();
    $("#divddlOrg").removeClass();
    $('#RoutNo').val($('div:eq(0)', rowData).text().trim());
    $("#AreaSection").val($('div:eq(1)', rowData).text().trim());
    $("#CustomerGoods").val($('div:eq(2)', rowData).text().trim());
    $("#ddlOrg").val($('div:eq(3)', rowData).text().trim());
    $("#CODE").val($('div:eq(5)', rowData).text().trim());
    $("#RoutId").val($('div:eq(7)', rowData).text().trim());
    $('#stationNo').val("");
    $('#stationName').val("");
    $("#btnLKJAdd").show();
    document.getElementById("text").value = "update";
    document.getElementById('modal-22256').click();
    option1.url = 'RemoteHandlers/CrossControl.ashx?type=lkj&RoutCode=' + $('div:eq(5)', rowData).text();
    option1.newp = 1;
    $("#flexTable1").flexOptions(option1).flexReload();
}

function addOrUpdate() {
    var type = $("#text").val();
    if (type == "add") { Add(); }
    else if (type == "update") { Update(); }
}

//添加交路
function Add() {
    if (validate()) {
        var dt = {
            type: "add",
            ROUTING_NO: $('#RoutNo').val(),
            AREA_SECTION: $("#AreaSection").val(),
            CUSTOMER_GOODS: $("#CustomerGoods").val(),
            BUREAU_CODE: $("#ddlOrg").val(),
            BUREAU_NAME: $("#ddlOrg").find("option:selected").text()
        };

        $.ajax({
            type: "post",
            url: "RemoteHandlers/CrossControl.ashx",
            cache: false,
            data: dt,
            success: function (result) {
                if (result == "1") {
                    ymPrompt.succeedInfo('添加成功', null, null, '提示信息', function () {
                        $("#flexTable").flexReload();
                        $('#CODE').val($('#RoutNo').val() + "$" + $('#ddlOrg').val());
                        document.getElementById('close').click();
                    });
                }
                else if (result == "-2") {
                    ymPrompt.errorInfo('交路号已存在', null, null, '提示信息', null);
                }
                else {
                    ymPrompt.errorInfo('添加失败', null, null, '提示信息', null);
                }

            }
        });
    }
}

//修改交路
function Update() {
    if (validate()) {
        var dt = {
            type: "update",
            id: $("#RoutId").val(),
            ROUTING_NO: $('#RoutNo').val(),
            AREA_SECTION: $("#AreaSection").val(),
            CUSTOMER_GOODS: $("#CustomerGoods").val(),
            BUREAU_CODE: $("#ddlOrg").val(),
            BUREAU_NAME: $("#ddlOrg").find("option:selected").text()
        };
        $.ajax({
            type: "post",
            url: "RemoteHandlers/CrossControl.ashx",
            cache: false,
            data: dt,
            success: function (result) {
                if (result == "1") {
                    ymPrompt.succeedInfo('修改成功', null, null, '提示信息', function () {
                        $("#flexTable").flexReload();
                        document.getElementById('close').click();
                    });
                }
                else if (result == "-2") {
                    ymPrompt.errorInfo('交路号已存在', null, null, '提示信息', null);
                }
                else {
                    ymPrompt.errorInfo('修改失败', null, null, '提示信息', null);
                }
                //document.getElementById('close').click();
            }
        });
    }
}

//删除交路
function deleteCross(rowData) {
    ymPrompt.confirmInfo({
        message: '确认要删除这条记录吗?', handler: function (tp) {
            if (tp == 'ok') {
                $.ajax({
                    type: "post",
                    url: "RemoteHandlers/CrossControl.ashx?type=delete&id=" + escape($('div:eq(7)', rowData).text()),
                    cache: false,
                    success: function (result) {
                        if (result == "1") {
                            ymPrompt.succeedInfo('删除成功', null, null, '提示信息', function () {
                                $("#flexTable").flexReload();
                            });
                        }
                        else {
                            ymPrompt.errorInfo('删除失败', null, null, '提示信息', null);
                        }
                    }
                });
            }
        }
    })
}

function loadFlexiGrid1() {
    option1 = {
        url: 'RemoteHandlers/CrossControl.ashx?type=lkj',
        dataType: 'json',
        colModel: [
			        { display: 'ROUTING_CODE', name: 'ROUTING_CODE', width: 100, hide: true, sortable: false, align: 'center' },
			        { display: 'LKJ_CODE', name: 'LKJ_CODE', width: 100, hide: true, sortable: false, align: 'center' },
                    { display: '车站号', name: 'STATION_NO', width: 100, sortable: false, align: 'center' },
                    { display: '车站名称', name: 'STATION_NAME', width: 120, sortable: false, align: 'center' },
                    { display: '区间号', name: 'AREA_NO', width: 100, sortable: false, align: 'center' },
                    { display: '线路', name: 'LINE_NAME', width: 100, sortable: false, align: 'center' },
			        { display: '线路CODE', name: 'LINE_CODE', sortable: false, hide: true, align: 'center' },
			        { display: '交路号', name: 'ROUTING_CODE', sortable: false, hide: true, align: 'center' },
			        { display: '操作', name: 'cz', width: 120, sortable: false, align: 'center' },
			        { display: 'id', name: 'id', width: 80, hide: true, pk: true, sortable: false, align: 'center' }
        ],
        usepager: true,
        title: '交路区站列表',
        pagestat: '显示第 {from} 条到 {to} 条,共 {total} 条数据', // 显示当前页和总页面的样式
        procmsg: '正在处理,请稍候 ...', // 正在处理的提示信息
        nomsg: '没有数据存在!', // 无结果的提示信息
        pagetext: '当前第',
        outof: '页，总页数',
        findtext: '条件查询：',
        useRp: false,
        checkbox: false, // 是否要多选框
        rowId: 'id', // 多选框绑定行的id
        rp: 15,
        showTableToggleBtn: true,
        width: 650,
        height: 300,
        title: false, //是否包含标题 
        resizable: false, //是否可伸缩 
        striped: true //是否显示斑纹效果，默认是奇偶交互的形式
    }
    $("#flexTable1").flexigrid(option1);
}

function addOrUpdateLKJ() {
    var type = $("#btnTag").val();
    if (type == "add") { AddLKJ(); }
    else if (type == "update") { UpdateLKJ(); }
}


function showAddLKJ() {
    $("#STATION_NO").removeAttr("readonly");
    $("#AREA_NO").removeAttr("readonly");
    $("#ddltxtLine").removeAttr("disabled");

    $("#btnTag").val("add");
    $("#divSTATION_NO").addClass("control-group error");
    $("#divSTATION_NAME").addClass("control-group error");
    $("#divddltxtLine").addClass("control-group error");
    $('#STATION_NO').val("");
    $('#STATION_NAME').val("");
    $('#AREA_NO').val("");
    $("#ddltxtLine option:first").attr("selected", true);
    $("#lkjCover").fadeIn("fast", function () {
        $("#lkjModal").fadeIn();
    });
}

function showUpdateLKJ(rowData) {
    $("#STATION_NO").attr("readonly", "readonly");
    $("#AREA_NO").attr("readonly", "readonly");
    $("#ddltxtLine").attr("disabled", "disabled");

    $("#btnTag").val("update");
    $("#divSTATION_NO").removeClass();
    $("#divSTATION_NAME").removeClass();
    $("#divddltxtLine").removeClass();
    $("#LKJID").val($('div:eq(9)', rowData).text().trim());
    $('#STATION_NO').val($('div:eq(2)', rowData).text().trim());
    $('#STATION_NAME').val($('div:eq(3)', rowData).text().trim());
    $('#AREA_NO').val($('div:eq(4)', rowData).text().trim());
    $("#ddltxtLine").val($('div:eq(6)', rowData).text().trim());
    $("#lkjCover").fadeIn("fast", function () {
        $("#lkjModal").fadeIn();
    });
}

function closeLkj() {
    $("#lkjCover").fadeOut();
    $("#lkjModal").fadeOut();
}

function LKJSearch() {
    var stationNo = $('#stationNo').val();
    var stationName = $('#stationName').val();
    var lineCode = $('#ddlLine').val();
    var routCode = $('#ROUTING_CODE').val();
    option1.url = 'RemoteHandlers/CrossControl.ashx?type=lkj&stationNo=' + escape(stationNo)
        + '&RoutCode=' + escape(routCode)
        + '&stationName=' + escape(stationName)
        + '&lineCode=' + escape(lineCode); 
    option1.newp = 1;
    $("#flexTable1").flexOptions(option1).flexReload();
}



//添加LKJ
function AddLKJ() {

    if (validateLKJ()) {
        var dt = {
            type: "InsertLKJ",
            STATION_NO: $("#STATION_NO").val(),
            STATION_NAME: $('#STATION_NAME').val(),
            AREA_NO: $('#AREA_NO').val(),
            LINE_NAME: $('#ddltxtLine').find("option:selected").text(),
            LINE_CODE: $('#ddltxtLine').val(),
            ROUTING_CODE: $('#ROUTING_CODE').val(),
            ROUTEING_NO: $('#ROUTEING_NO').val(),
            BUREAU_CODE: $('#BUREAU_CODE').val(),
            BUREAU_NAME: $('#BUREAU_NAME').val()
        };

        $.ajax({
            type: "post",
            url: "RemoteHandlers/CrossControl.ashx",
            cache: false,
            data: dt,
            success: function (result) {
                if (result == "1") {
                    ymPrompt.succeedInfo('添加成功', null, null, '提示信息', function () {
                        $("#flexTable1").flexReload();
                        closeLkj();
                    });
                } else if (result == "-2") {
                    ymPrompt.errorInfo('车站编码已存在，请更改相关信息后重试！', null, null, '提示信息', null);
                }
                else {
                    ymPrompt.errorInfo('添加失败！', null, null, '提示信息', null);
                }
            }
        });

    }
}

//更新LKJ
function UpdateLKJ() {
    if (validateLKJ()) {
        var dt = {
            type: "UpdateLKJ",
            id: $("#LKJID").val(),
            //STATION_NO: $("#STATION_NO").val(),
            STATION_NAME: $('#STATION_NAME').val(),
            //AREA_NO: $('#AREA_NO').val(),
            //LINE_NAME: $('#ddltxtLine').find("option:selected").text(),
            //LINE_CODE: $('#ddltxtLine').val(),
            //ROUTING_CODE: $('#ROUTING_CODE').val(),
            //ROUTEING_NO: $('#ROUTEING_NO').val(),
            //BUREAU_CODE: $('#BUREAU_CODE').val(),
            //BUREAU_NAME: $('#BUREAU_NAME').val()
        };

        $.ajax({
            type: "post",
            url: "RemoteHandlers/CrossControl.ashx",
            cache: false,
            data: dt,
            success: function (result) {
                if (result == "1") {
                    ymPrompt.succeedInfo('修改成功', null, null, '提示信息', function () {
                        $("#flexTable1").flexReload();
                        closeLkj();
                    });
                }
                else {
                    ymPrompt.errorInfo('修改失败', null, null, '提示信息', null);
                }
            }
        });
    }
}

//移除
function reMove(rowData) {
    ymPrompt.confirmInfo({
        message: '确认要删除这条记录吗?', handler: function (tp) {
            if (tp == 'ok') {
                $.ajax({
                    type: "post",
                    url: "RemoteHandlers/CrossControl.ashx?type=remove&id=" + escape($('div:eq(9)', rowData).text()),
                    cache: false,
                    success: function (result) {
                        if (result == "1") {
                            $("#flexTable1").flexReload();
                        }
                    }
                });
            }
        }
    })


}

//加载下拉列表
function loadSelect() {
    $("#ddlJu").mySelect({
        tag: "ORGANIZATION",
        type: "J",
        callback: function (rs) {
            $("#ddlOrg").html(rs).change(function () {
                document.getElementById("divddlOrg").className = $(this).val() == "0" ? "control-group error" : "";
            });
        }
    });
}


//加载下拉列表
function loadLineSelect() {
    $("#ddltxtLine").mySelect({ tag: "Line" }).change(function () {
        document.getElementById("divddltxtLine").className = $(this).val() == "0" ? "control-group error" : "";
    });
}

function validate() {
    if ($("#RoutNo").val() == "") { ymPrompt.errorInfo('交路号不能为空！', null, null, '提示信息', null); return false; } 
    if ($("#ddlOrg").val() == "0") { ymPrompt.errorInfo('请先选择相关铁路局！', null, null, '提示信息', null); return false; }
    return true;
}

function validateLKJ()
{
    if ($("#STATION_NO").val() == "") { ymPrompt.errorInfo('车站号不能为空！', null, null, '提示信息', null); return false; } 
    if ($("#STATION_NAME").val() == "") { ymPrompt.errorInfo('车站名称不能为空！', null, null, '提示信息', null); return false; } 
    if ($("#ddltxtLine").val() == "0") { ymPrompt.errorInfo('请先选择线路！', null, null, '提示信息', null); return false; }
    return true;
}

function removeClass(val) {
    if (val.value.replace(/^ +| +$/g, '') == '') {
        $("#div" + val.id).addClass("control-group error");
    }
    if (val.value.replace(/^ +| +$/g, '') != '')
    { $("#div" + val.id).removeClass(); }
}
