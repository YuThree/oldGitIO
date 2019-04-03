/*========================================================================================*
* 功能说明：组织机构页面操作和数据展示JS
* 注意事项：
* 作    者： 邓杰
* 版本日期：2013年10月23日
* 变更说明：
* 版 本 号： V1.0
*=======================================================================================*/

var option;
///页面列表数据加载
function loadFlexiGrid(code, treeType) {
    var _h = $(window).height() - 200 - 20;
    var _PageNum = parseInt(_h / 25);
    option = {
        url: 'RemoteHandlers/OrganizationControl.ashx?type=all&CODE=' + escape(code) + "&TREETYPE=" + escape(treeType),
        dataType: 'json',
        colModel: [
                            { display: '机构名称', name: 'ORG_NAME', width: 120, sortable: false, align: 'center' },
                            { display: '机构类型', name: 'ORG_TYPE', width: 120, hide: true, sortable: false, align: 'center' },
                            { display: '机构顺序', name: 'ORG_ORDER', width: 60, sortable: false, align: 'center' },
                            { display: '上级机构名称', name: 'SUP_ORG_NAME', width: 120, sortable: false, align: 'center' },
                            { display: '联系人', name: 'LINK_MAN', width: 80, sortable: false, align: 'center' },
                            { display: '联系电话', name: 'LINK_TEL', width: 80, sortable: false, align: 'center' },
                            { display: '地址', name: 'ORG_ADDR', width: 80, sortable: false, align: 'center' },
                            { display: '邮编', name: 'POSTCODE', width: 80, hide: true, sortable: false, align: 'center' },
                            { display: '经度坐标', name: 'GIS_LON', width: 60, sortable: false, align: 'center' },
                            { display: '纬度坐标', name: 'GIS_LAT', width: 60, sortable: false, align: 'center' },
                            { display: '编码', name: 'ORG_CODE', hide: true, width: 80, sortable: false, align: 'center' },
                            { display: '操作', name: 'cz', width: 120, sortable: false, align: 'center' },
                            { display: 'id', name: 'id', width: 80, pk: true, hide: true, sortable: false, align: 'center' },
                            { display: 'ORG_DERGEE', name: 'ORG_DERGEE', hide: true, sortable: false, align: 'center' }
        ],
        usepager: true,
        title: '组织列表',
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

function GoGX(rowData) {

}

//查询方法
function doQuery() {
    var org_name = $('#Organization').val();
    option.url = 'RemoteHandlers/OrganizationControl.ashx?type=all&ORG_NAME=' + escape(org_name) + '&temp=' + Math.random();
    option.newp = 1;
    $("#flexTable").flexOptions(option).flexReload();

}

//弹出添加蒙层
function addOrganizationModal() {
    var IsSuccessful = loadSelect($("#TXTTREEORG_TYPE").val());
    //    if (IsSuccessful == undefined) {
    //        ymPrompt.errorInfo('请选择父级组织机构！', null, null, '提示信息', null);
    //    }
    if (IsSuccessful == "GQ") {
        ymPrompt.errorInfo('操作失败！没有下级不能新增组织', null, null, '提示信息', null);
    } else {
        document.getElementById("dllTYPE").style.display = "table-row"; //设置编号列显示
        document.getElementById("ORG_CODE").style.display = "table-cell"; //设置编号列显示
        document.getElementById("EditorORG_CODE").style.display = "block"; //设置编号编辑框显示
        document.getElementById("ORG_NAME").colspan = "1"; //设置编号编辑列的合并
        document.getElementById("TXTORG_NAME").style.width = "120px"; //设置编号编辑框的宽度
        $("#divTXTORG_CODE").addClass("control-group error");
        $("#divTXTORG_NAME").addClass("control-group error");
        $('#TXTORG_CODE').val("");
        $('#TXTORG_NAME').val("");
        $("#TXTLINK_MAN").val("");
        $("#TXTLINK_TEL").val("");
        $("#TXTORG_ADDR").val("");
        $("#TXTORG_ORDER").val("");
        $("#TXTPOSTCODE").val("");
        $("#TXTGIS_LON").val("");
        $("#TXTGIS_LAT").val("");

        $("#ddlORG_LAYER option:first").attr("selected", true);
        $("#ddlPERMISSON_LAYER option:first").attr("selected", true);

        $("#txtSORG_CODE").val($("#TXTTREEORG_CODE").val());
        $("#text").val("add");
        document.getElementById('modal-22256').click();
    }
}

//弹出修改蒙层
function updateOrganizationModal(rowData) {

    $("#dllTYPE").hide();
    $("#ORG_CODE").hide();
    $("#EditorORG_CODE").hide();
    $("#ORG_ID").val($('div:eq(12)', rowData).text().trim());
    $("#TXTORG_NAME").width(360);
    $("#divORG_NAME").attr("colspan", 3);
//    $("#divType").removeClassSelect();
    $("#divTXTORG_NAME").removeClass();
    $("#divTXTORG_CODE").removeClass();
    $('#TXTORG_NAME').val($('div:eq(0)', rowData).text().trim()); //机构名称
    $("#TXTLINK_MAN").val($('div:eq(4)', rowData).text().trim()); //联系人
    $("#TXTORG_ORDER").val($('div:eq(2)', rowData).text().trim()); //联系人
    $("#TXTLINK_TEL").val($('div:eq(5)', rowData).text().trim()); //联系电话
    $("#TXTORG_ADDR").val($('div:eq(6)', rowData).text().trim()); //地址
    $("#TXTPOSTCODE").val($('div:eq(7)', rowData).text().trim()); //邮编
    $("#TXTGIS_LON").val($('div:eq(8)', rowData).text().trim()); //经度
    $("#TXTGIS_LAT").val($('div:eq(9)', rowData).text().trim()); //纬度
    $('#TXTORG_CODE').val($('div:eq(10)', rowData).text().trim()); //机构编码
    var layers = $('div:eq(13)', rowData).text().trim().split("$");
    if (layers.length == 2) {
        $("#ddlORG_LAYER").val("ORG_LAYER_" + layers[0]);
        $("#ddlPERMISSON_LAYER").val("PERMISSON_LAYER_" + layers[1]);
    }
    $("#TXTORG_DERGEE").val($('div:eq(13)', rowData).text().trim());
    document.getElementById("text").value = "update";
    document.getElementById('modal-22256').click();
}

//判断是新增还是修改
function addOrgUpdate() {
    var type = $("#text").val();
    if (type == "add") {
        Add();
    }
    else if (type == "update") {
        Update();
    }
}
//添加
function Add() {
    if (validate()) {
        var ol = $("#ddlORG_LAYER").val().replace("ORG_LAYER_", "");
        var pl = $("#ddlPERMISSON_LAYER").val().replace("PERMISSON_LAYER_", "");

        var dt = {
            type: "add",
            TreeCode: $('#TXTTREEORG_CODE').val(),
            ORG_CODE: $('#TXTORG_CODE').val(),
            ORG_NAME: $('#TXTORG_NAME').val(),
            LINK_MAN: $('#TXTLINK_MAN').val(),
            LINK_TEL: $('#TXTLINK_TEL').val(),
            ORG_ADDR: $('#TXTORG_ADDR').val(),
            POSTCODE: $("#TXTPOSTCODE").val(),
            ORG_TYPE: $("#ddlOrgType").val(),
            GIS_LON: $('#TXTGIS_LON').val(),
            GIS_LAT: $('#TXTGIS_LAT').val(),
            ORG_ORDER: $('#TXTORG_ORDER').val(),
            ORG_DEGREE: ((ol == "0" || pl == "0") ? "" : ol + "$" + pl)
        };
        $.ajax({
            type: "POST",
            url: "RemoteHandlers/OrganizationControl.ashx",
            async: false,
            cache: true,
            data: dt,
            success: function (result) {
                if (result == "1") {
                    ymPrompt.succeedInfo('添加成功', null, null, '提示信息', function () {
                        $("#flexTable").flexReload();
                        $("#TXTTREEORG_CODE").val("");
                        $("#TXTTREEORG_TYPE").val("");
                        myTree.reAsyncChildNodes(null, "refresh");
                    });
                } else if (result == "-2") {
                    ymPrompt.errorInfo('机构编码已存在，请更改相关信息后重试！', null, null, '提示信息', null);
                }
                else {
                    ymPrompt.errorInfo('操作失败！请联系管理员', null, null, '提示信息', null);
                }

                document.getElementById('close').click();
            }
        });
    }
}
//修改
function Update() {
    if (validate()) {
        var ol = $("#ddlORG_LAYER").val().replace("ORG_LAYER_", "");
        var pl = $("#ddlPERMISSON_LAYER").val().replace("PERMISSON_LAYER_", "");

        var dt = {
            type: "update",
            id: $("#ORG_ID").val(),
            TreeCode: $('#TXTTREEORG_CODE').val(),
            ORG_CODE: $('#TXTORG_CODE').val(),
            ORG_NAME: $('#TXTORG_NAME').val(),
            LINK_MAN: $('#TXTLINK_MAN').val(),
            LINK_TEL: $('#TXTLINK_TEL').val(),
            ORG_ADDR: $('#TXTORG_ADDR').val(),
            POSTCODE: $("#TXTPOSTCODE").val(),
            ORG_TYPE: $("#ddlOrgType").val(),
            GIS_LON: $('#TXTGIS_LON').val(),
            GIS_LAT: $('#TXTGIS_LAT').val(),
            ORG_ORDER: $('#TXTORG_ORDER').val(),
            ORG_DEGREE: ((ol == "0" || pl == "0") ? "" : ol + "$" + pl)
        };

        if ($('#TXTORG_NAME').val().trim() != "") {
            $.ajax({
                type: "POST",
                url: "RemoteHandlers/OrganizationControl.ashx",
                async: false,
                cache: true,
                data: dt,
                success: function (result) {
                    if (result == "1") {
                        ymPrompt.succeedInfo('保存成功', null, null, '提示信息', function () {
                            $("#flexTable").flexReload();
                            $("#TXTTREEORG_CODE").val("");
                            $("#TXTTREEORG_TYPE").val("");
                            myTree.reAsyncChildNodes(null, "refresh");
                        });
                    }
                    else {
                        ymPrompt.errorInfo('操作失败！请联系管理员', null, null, '提示信息', null);
                    }
                    document.getElementById('close').click();
                }
            });
        } else {
            ymPrompt.errorInfo('机构名称不能为空', null, null, '提示信息', null);
        }
    }
}
//删除
function deleteOrganization(rowData) {
    if (confirm('确认要删除这条记录吗?')) {
        $.ajax({
            type: "POST",
            url: "RemoteHandlers/OrganizationControl.ashx?type=delete&id=" + escape($('div:eq(12)', rowData).text().trim()),
            async: false,
            cache: true,
            success: function (result) {
                if (result == "1") {
                    ymPrompt.succeedInfo('保存成功', null, null, '提示信息', function () {
                        $("#flexTable").flexReload();
                        $("#TXTTREEORG_CODE").val("");
                        $("#TXTTREEORG_TYPE").val("");
                        myTree.reAsyncChildNodes(null, "refresh");
                    });
                }
                else {
                    ymPrompt.errorInfo('操作失败！请联系管理员', null, null, '提示信息', null);
                }
            }
        });
    }
}

var myTree;
//加载树
function loadTree() {
    $("#TXTTREEORG_TYPE").val("ORG");

    myTree = $("#tree").myTree({
        tag: "ORGANIZATION",
        isDefClick: false,
        onClick: function (event, treeId, treeNode) {
            option.url = 'RemoteHandlers/OrganizationControl.ashx?type=all&CODE=' + escape(treeNode.id) + "&TREETYPE=" + escape(treeNode.treeType);
            option.newp = 1;
            $("#flexTable").flexOptions(option).flexReload();
            $("#TXTTREEORG_CODE").val(treeNode.id);
            $("#TXTTREEORG_TYPE").val(treeNode.treeType);
        }
    });


    $("#ddlORG_LAYER").mySelect({
        tag: "SYSDICTIONARY",
        code: "ORG_LAYER"
    });

    $("#ddlPERMISSON_LAYER").mySelect({
        tag: "SYSDICTIONARY",
        code: "PERMISSON_LAYER"
    });
}


//加载下拉列表
function loadSelect(cd) {
    $("#ddlOrgType").mySelect({
        tag: "SYSDICTIONARY",
        code: cd,
        defaultValue: "0",          //默认选择项的值
        defaultText: "请选择"        //默认选择项的名称
    });
    return cd;
}




function validate() {
   // if ($("#ddlOrgType").val() == "0") { ymPrompt.errorInfo('类型不能为空!', null, null, '提示信息', null); return false; } //类型
    if ($("#TXTORG_CODE").val() == "") { ymPrompt.errorInfo('机构编码不能为空!', null, null, '提示信息', null); return false; } //用户名
    if ($("#TXTORG_NAME").val() == "") { ymPrompt.errorInfo('机构名称不能为空!', null, null, '提示信息', null); return false; } //用户密码
    if (!StringHelper.isInt($("#TXTORG_ORDER").val()) && $("#TXTORG_ORDER").val() != "") { ymPrompt.errorInfo('顺序必须为整数!', null, null, '提示信息', null); return false; }
    if (!StringHelper.isFloat($("#TXTGIS_LON").val()) && $("#TXTGIS_LON").val() != "") { ymPrompt.errorInfo('经度必须为数字!', null, null, '提示信息', null); return false; }
    if (!StringHelper.isFloat($("#TXTGIS_LAT").val()) && $("#TXTGIS_LAT").val() != "") { ymPrompt.errorInfo('纬度必须为数字!', null, null, '提示信息', null); return false; }
    if (($("#ddlORG_LAYER").val() != "0" && $("#ddlPERMISSON_LAYER").val() == "0") || ($("#ddlORG_LAYER").val() == "0" && $("#ddlPERMISSON_LAYER").val() != "0"))
    { ymPrompt.errorInfo('机构层级或权限层级必须两者同时选择!', null, null, '提示信息', null); return false; }
    return true;
}

function removeClass(val) {
    if (val.value.replace(/^ +| +$/g, '') == '') {
        $(val).parent().addClass("control-group error");
    }
    if (val.value.replace(/^ +| +$/g, '') != '')
    { $(val).parent().removeClass(); }
}
function removeClassSelect(val) {
    if (val.value == '0') {
        $(val).parent().addClass("control-group error");
    }
    else
    { $(val).parent().removeClass(); }
}
function refreshOrganization() {
    $.ajax({
        type: "POST",
        url: "RemoteHandlers/OrganizationControl.ashx?type=refresh&&temp=" + Math.random(),
        async: false,
        cache: true,
        success: function (result) {
            if (result == "1") {
                ymPrompt.succeedInfo('缓存刷新成功！', null, null, '提示信息', function () {
                    $("#flexTable").flexReload();
                    $("#TXTTREEORG_CODE").val("");
                    $("#TXTTREEORG_TYPE").val("");
                    myTree.reAsyncChildNodes(null, "refresh");
                });
            }
            else {
                ymPrompt.errorInfo('操作失败！请联系管理员', null, null, '提示信息', null);
            }
        }
    });
}