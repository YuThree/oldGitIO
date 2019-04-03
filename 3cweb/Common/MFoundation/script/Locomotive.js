/*========================================================================================*
* 功能说明：机车列表
* 注意事项：
* 作    者： lc
* 版本日期：2014年9月29日
* 变更说明：
* 版 本 号： V1.0.0
*=======================================================================================*/
var option, mygrid; //表格内容


function loadFlexiGrid(treeName, LocCode, treeType) {
    var _h = $(window).height() - 200 - 30;
    var _PageNum = parseInt(_h / 25);
    option = {
        url: 'RemoteHandlers/LocomotiveControl.ashx?type=all&CODE=' + escape(LocCode) + "&TREETYPE=" + escape(treeType),
        dataType: 'json',
        colModel: [
                            { display: '设备编号', name: 'LOCOMOTIVE_CODE', width: 80, sortable: false, align: 'center' },
			                { display: '设备版本号', name: 'DEVICE_VERSION_CODE', width: 70, sortable: false, hide: true, align: 'center' },
			                { display: '设备版本号', name: 'DEVICE_VERSION', width: 70, sortable: false, align: 'center' },
			                { display: '设备型号', name: 'MODEL', width: 70, sortable: false, align: 'center' },
			                { display: '设备状态', name: 'STATUS', width: 60, sortable: false, align: 'center' },
			                { display: '设备厂家', name: 'VENDOR', width: 80, sortable: false, hide: true, align: 'center' },
			                { display: '生产日期', name: 'CREATE_DATE', width: 100, sortable: false, align: 'center' },
			                { display: '安装日期', name: 'INSTALL_DATE', width: 100, sortable: false, align: 'center' },
			                { display: '短信号码', name: 'PHONE_NUMBER', width: 70, sortable: false, align: 'center' },
			                { display: '铁路局Code', name: 'BUREAU_CODE', hide: true, width: 80, sortable: false, align: 'center' },
			                { display: '铁路局', name: 'BUREAU_NAME', width: 70, sortable: false, align: 'center' },
			                { display: '归属段Code', name: 'ORG_CODE', hide: true, width: 80, sortable: false, align: 'center' },
			                { display: '归属段', name: 'ORG_NAME', width: 70, sortable: false, align: 'center' },
			                { display: '配属段Code', name: 'P_ORG_CODE', hide: true, width: 80, sortable: false, align: 'center' },
			                { display: '配属段', name: 'P_ORG_NAME', width: 70, sortable: false, align: 'center' },
			                { display: '是否修复导高值', name: 'IS_FIX_GEO_PARA', width: 80, sortable: false, align: 'center' },
                            { display: '导高值修复基数', name: 'FIX_LINE_HEIGHT', width: 80, sortable: false, align: 'center' },
                            { display: '拉出值修复基数', name: 'FIX_PULLING_VALUE', width: 80, sortable: false, align: 'center' },
                            { display: '数据接收段', name: 'DATA_RECV_DEPT', width: 80, sortable: false, align: 'center' },
                            { display: '自动曝光', name: 'FLAG', hide: true, sortable: false, align: 'center' },
                            { display: '操作', name: 'cz', width: 80, sortable: false, align: 'center' },
			                { display: 'id', name: 'id', sortable: false, pk: true, hide: true, align: 'center' },
			                { display: '设备分组与车厢关系', name: 'DEVICE_BOW_RELATIONS', sortable: false, hide: true, align: 'center' }
        ],
        usepager: true,
        title: '设备列表',
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

    mygrid = $("#flexTable").flexigrid(option);
}

//查询方法
function doQuery() {
    var ORG_CODE = $("#ddlOrg").val();
    var LOCOMOTIVE_CODE = $("#ddlLocomotive").val();
    var BUREAU_CODE = $("#ddlBureau").val();
    option.url = 'RemoteHandlers/LocomotiveControl.ashx?type=all&LOCOMOTIVE_CODE=' + escape(LOCOMOTIVE_CODE) + '&ORG_CODE=' + ORG_CODE + '&BUREAU_CODE=' + BUREAU_CODE;
    option.newp = 1;
    mygrid.flexOptions(option).flexReload();
}

//添加
function Add() {
    if (validate()) {
        var options = {
            url: "RemoteHandlers/LocomotiveControl.ashx?type=add",
            type: 'POST',
            success: function (result) {
                if (result == "1") {
                    ymPrompt.succeedInfo('添加成功', null, null, '提示信息', function () {
                        $("#flexTable").flexReload();
                        var lcode = $("#LOCOMOTIVE_CODE").val();
                        var pnode = myTree.getNodeByParam("id", $("#ORG_CODE").val(), null);
                        var newNode = { name: lcode, id: lcode };
                        newNode = myTree.addNodes(pnode, newNode);
                    });
                } else if (result == "-2") {
                    ymPrompt.errorInfo('设备编码已存在，请更改相关信息后重试！', null, null, '提示信息', null);
                }
                else {
                    ymPrompt.errorInfo('添加失败', null, null, '提示信息', null);
                }
                document.getElementById('close').click();
            }
        };
        $('#detailForm').ajaxSubmit(options);
    }
}//弹出添加蒙层

function addLocomotiveModal() {

    $("#divLOCOMOTIVE_CODE").addClass("control-group error");
    $("#divCREATE_DATE").addClass("control-group error");
    $("#divP_ORG_CODE").addClass("control-group error");

    $('#LOCOMOTIVE_ID').val("");
    $('#LOCOMOTIVE_CODE').val("").removeAttr("readonly");
    $("#MODEL").val("");
    $("#STATUS").val("");
    $("#IS_FIX_GEO_PARA option:first").attr("selected", true);
    $("#FIX_LINE_HEIGHT").val("");
    $("#FIX_PULLING_VALUE").val("");
    $("#VENDOR").val("");
    $("#PHONE_NUMBER").val("");
    $("#CREATE_DATE").val("");
    $("#DEVICE_VERSION").val("");
    $("#BUREAU_CODE option:first").attr("selected", true);
    BUREAU_CODEChange("0");
    $("#BUREAU_NAME").val("");
    $("#ORG_CODE option:first").attr("selected", true);
    $("#ORG_NAME").val("");
    $("#P_ORG_CODE option:first").attr("selected", true);
    $("#P_ORG_NAME").val("");
    $("#INSTALL_DATE").val("");
    $("#ddlDATA_RECV_DEPT option:first").attr("selected", true);
    $("#DATA_RECV_DEPT").val("");
    $("#FLAG option:first").attr("selected", true);
    $("#DEVICE_BOW_RELATIONS").val("");
    document.getElementById("text").value = "add";
    //document.getElementById('modal-22256').click();
    $("#modal-container-22256").modal();
}


//修改
function Update() {
    if (validate()) {
        var options = {
            url: "RemoteHandlers/LocomotiveControl.ashx?type=update",
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
        $('#detailForm').ajaxSubmit(options);
    }
}

//删除
function deleteLocomotive(rowData) {
    ymPrompt.confirmInfo({
        message: '确认要删除这条记录吗?', handler: function (tp) {
            if (tp == 'ok') {
                var code = $('div:eq(0)', rowData).text();
                var id = $('div:eq(21)', rowData).text();
                $.ajax({
                    type: "POST",
                    url: "RemoteHandlers/LocomotiveControl.ashx?type=delete&id=" + escape(id),
                    async: false,
                    cache: false,
                    success: function (result) {
                        if (result == "1") {
                            ymPrompt.succeedInfo('删除成功', null, null, '提示信息', function () {
                                $("#flexTable").flexReload();
                                myTree.removeNode(myTree.getNodeByParam("id", code, null));
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


//弹出修改蒙层
function updateLocomotiveModal(rowData) {

    $("#divLOCOMOTIVE_CODE").removeClass();
    $("#divCREATE_DATE").removeClass();
    $("#divP_ORG_CODE").removeClass();
    $('#LOCOMOTIVE_CODE').val($('div:eq(0)', rowData).text().trim()).attr("readonly", "readonly");
    $('#LOCOMOTIVE_ID').val($('div:eq(21)', rowData).text().trim());
    $("#MODEL").val($('div:eq(3)', rowData).text().trim());
    $("#STATUS").val($('div:eq(4)', rowData).text().trim());
    $("#IS_FIX_GEO_PARA").val($('div:eq(15)', rowData).text().trim() == "是" ? "1" : "0");
    $("#FIX_LINE_HEIGHT").val($('div:eq(16)', rowData).text().trim());
    $("#FIX_PULLING_VALUE").val($('div:eq(17)', rowData).text().trim());
    $("#VENDOR").val($('div:eq(5)', rowData).text().trim());
    $("#PHONE_NUMBER").val($('div:eq(8)', rowData).text().trim());
    $("#CREATE_DATE").val($('div:eq(6)', rowData).text().trim());
    $("#DEVICE_VERSION").val($('div:eq(1)', rowData).text().trim());
    $("#BUREAU_CODE").val($('div:eq(9)', rowData).text().trim());
    $("#BUREAU_NAME").val($('div:eq(10)', rowData).text().trim());
    BUREAU_CODEChange($("#BUREAU_CODE").val().trim());
    $("#ORG_CODE").val($('div:eq(11)', rowData).text().trim());
    $("#ORG_NAME").val($('div:eq(12)', rowData).text().trim());
    $("#P_ORG_CODE").val($('div:eq(13)', rowData).text().trim());
    $("#P_ORG_NAME").val($('div:eq(14)', rowData).text().trim());
    $("#INSTALL_DATE").val($('div:eq(7)', rowData).text().trim());

    //$("#ddlDATA_RECV_DEPT").find("option[text='" + $('div:eq(18)', rowData).text().trim() + "']").attr("selected", true);

    LoadDropdSelected("ddlDATA_RECV_DEPT", $('div:eq(18)', rowData).text().trim());

    $("#DATA_RECV_DEPT").val($('div:eq(18)', rowData).text().trim());
    $("#FLAG").val($('div:eq(19)', rowData).text().trim() == "是" ? "1" : "0");
    $("#DEVICE_BOW_RELATIONS").val($('div:eq(22)', rowData).text().trim());
    document.getElementById("text").value = "update";
    document.getElementById('modal-22256').click();
}



//加载下拉列表
function loadSelect() {

    $("#ddlBureau").mySelect({
        tag: "ORGANIZATION",
        type: "J",
        callback: function (rs) {
            $("#BUREAU_CODE").html(rs);
        }
    });

    $("#ORG_CODE").change(function () {
        $("#ORG_NAME").val($(this).find("option:selected").text());
    });

    $("#P_ORG_CODE").change(function () {
        $("#P_ORG_NAME").val($(this).find("option:selected").text());
        if ($("#P_ORG_CODE").val() == "0") {
            $("#divP_ORG_CODE").addClass("control-group error");
        }
        else {
            $("#divP_ORG_CODE").removeClass();
        }
    });

    $("#ddlDATA_RECV_DEPT").change(function () {
        $("#DATA_RECV_DEPT").val($(this).find("option:selected").text());
    });

    $("#DEVICE_VERSION").mySelect({
        tag: "SYSDICTIONARY",
        code: "C3VERSION"
    });
}

function ddlBureauChange(val) {
    $("#ddlOrg").mySelect({
        tag: "ORGANIZATION",
        code: val
    });
}

function ddlOrgChange(val) {
    var TAG;
    if (GetIsPowerOrg() == 1) {
        TAG = "POWERLOCOMOTIVE"
    } else {
        TAG = "LOCOMOTIVE"
    }
    $("#ddlLocomotive").mySelect({
        tag: TAG,
        code: val
    });
}

function BUREAU_CODEChange(val) {

    $("#BUREAU_NAME").val($("#BUREAU_CODE").find("option:selected").text());

    $("#P_ORG_CODE").mySelect({
        tag: "ORGANIZATION",
        code: val,
        type: "CLD,JWD",
        async: false,
        callback: function (rs) {
            $("#ddlDATA_RECV_DEPT").html(rs);
        }
    });

    $("#ORG_CODE").mySelect({
        tag: "ORGANIZATION",
        code: val,
        type: "CLD,JWD",
        async: false
    });
}


//加载树
var myTree = null;
function loadTree() {
    var TAG;
    if (GetIsPowerOrg() == 1) {
        TAG= 'ALLPOWERLOCOMOTIVE'
        }else{
        TAG= 'LOCOMOTIVE'
        };
    myTree = $("#tree").myTree({
        tag: TAG,
        isDefClick: false,
        onClick: function (event, treeId, treeNode) {
            option.url = 'RemoteHandlers/LocomotiveControl.ashx?type=all&CODE=' + escape(treeNode.id) + "&TREETYPE=" + escape(treeNode.treeType),
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
    if ($("#LOCOMOTIVE_CODE").val() == "") { ymPrompt.errorInfo('设备编号不能为空!', null, null, '提示信息', null); return false; } //机车号 
    if ($("#CREATE_DATE").val() == "") { ymPrompt.errorInfo('生产日期不能为空!', null, null, '提示信息', null); return false; } //生产日期
    if ($("#P_ORG_CODE").val() == "0") { ymPrompt.errorInfo('配属段不能为空!', null, null, '提示信息', null); return false; } //配属段
    if (!StringHelper.isInt($("#FIX_LINE_HEIGHT").val()) && $("#FIX_LINE_HEIGHT").val() != "") { ymPrompt.errorInfo('导高值修复基数必须为整数!', null, null, '提示信息', null); return false; }
    if (!StringHelper.isInt($("#FIX_PULLING_VALUE").val()) && $("#FIX_PULLING_VALUE").val() != "") { ymPrompt.errorInfo('拉出值修复基数必须为整数!', null, null, '提示信息', null); return false; }
    return true;

}