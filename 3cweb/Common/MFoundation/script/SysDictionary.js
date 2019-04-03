/*========================================================================================*
* 功能说明：字典 列表页面操作和数据展示JS
* 注意事项：
* 作    者： lc
* 版本日期：2014年9月29日
* 变更说明：
* 版 本 号： V1.0.0
*=======================================================================================*/
///页面列表数据加载
function loadFlexiGrid(code) {
    var _h = $(window).height() - 200 - 20;
    var _PageNum = parseInt(_h / 25);
    option = {
        url: 'RemoteHandlers/SysDictionaryControl.ashx?type=all&CODE=' + escape(code),
        dataType: 'json',
        colModel: [
                            { display: '字典名称', name: 'CODE_NAME', width: 180, sortable: false, align: 'center' },
                            { display: '字典编码', name: 'DIC_CODE', width: 180, sortable: false, align: 'center' },
                            { display: '字典类型', name: 'category', width: 180, sortable: false, align: 'center' },
                            { display: '字典父编码', name: 'P_CODE', width: 80, hide: false, sortable: false, align: 'center' },
                            { display: 'CODE_TYPE', name: 'CODE_TYPE', width: 80, hide: false, sortable: false, align: 'center' },
                            { display: 'DESCRIPTION', name: 'DESCRIPTION', width: 80, hide: true, sortable: false, align: 'center' },
                            { display: '操作', name: 'cz', width: 100, sortable: false, align: 'center' },
                            { display: 'id', name: 'id', width: 80, pk: true, hide: true, sortable: false, align: 'center' }
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


//查询方法
function doQuery() {
    var CODE_NAME = $('#Sysdictionary').val();
    option.url = 'RemoteHandlers/SysDictionaryControl.ashx?type=all&CODE_NAME=' + escape(CODE_NAME);
    option.newp = 1;
    $("#flexTable").flexOptions(option).flexReload();

}

//弹出添加蒙层
function addSysDictionaryModal() {
    $("#divTXTCODE_NAME").addClass("control-group error");
    $("#divTXTDIC_CODE").addClass("control-group error");

    if ($("#TXTTREEORG_CODE").val() == "0") {
        $("#trCategory").css("display", "table-row");
    }
    $('#TXTDIC_CODE').removeAttr("readonly");
    $('#TXTCategory').val("");
    $('#TXTDIC_CODE').val("");
    $("#TXTCODE_NAME").val("");
    $('#txtP_code').val($("#TXTTREEORG_CODE").val());
    $('#txt_codeType').val('');
    $("#text").val("add");
    document.getElementById('modal-22256').click();

}

//弹出修改蒙层
function updateSysDictionaryModal(rowData) {
    $("#divTXTCODE_NAME").removeClass();
    $("#divTXTDIC_CODE").removeClass();
    $("#TXTDIC_CODE").attr("readonly", "readonly")
    $('#TXTCODE_NAME').val($('div:eq(0)', rowData).text().trim()); //机构名称
    $('#TXTDIC_CODE').val($('div:eq(1)', rowData).text().trim());
    $('#TXTCategory').val($('div:eq(2)', rowData).text().trim());
    $('#txtP_code').val($('div:eq(3)', rowData).text().trim());
    $('#txt_codeType').val($('div:eq(4)', rowData).text().trim());
    $("#txtId").val($('div:eq(7)', rowData).text().trim());
    $("#text").val("update");
    document.getElementById('modal-22256').click();
}

//判断是新增还是修改
function addSysDictionaryUpdate() {
    var type = document.getElementById("text").value;
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
        var tc = $("#TXTTREEORG_CODE").val(); // 当前树选中的CODE

        if (tc == "0") {
            tc = $("#TXTCategory").val(); //字典类型
        }

        var dc = $('#TXTDIC_CODE').val(); //字典编码
        if (dc == "ORG") {
            ymPrompt.errorInfo('添加失败', null, null, '提示信息', null);
            return;
        }

        var dt = {
            type: "add",
            CODE_NAME: $("#TXTCODE_NAME").val(),//字典名称
            DIC_CODE: dc, //字典编码
            category: $("#TXTCategory").val(), //字典类型
            P_CODE: $("#txtP_code").val(), //父级编码
            codeType: $("#txt_codeType").val() //CodeType
        };


        $.ajax({
            type: "POST",
            url: "RemoteHandlers/SysDictionaryControl.ashx",
            async: false,
            cache: true,
            data: dt,
            success: function (result) {
                if (result == "1") {
                    ymPrompt.succeedInfo('添加成功', null, null, '提示信息', function () {
                        $("#flexTable").flexReload();
                        myTree.reAsyncChildNodes(null, "refresh");
                    });
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
        var dt = {
            type: "update",
            CODE_NAME: $('#TXTCODE_NAME').val(), //字典名称
            DIC_CODE: $('#TXTDIC_CODE').val(),  //字典编码
            category: $('#TXTCategory').val(), //字典类型
            P_CODE: $('#txtP_code').val(), //父级编码
            codeType: $('#txt_codeType').val() //CodeType
        };

        if (dt.CODE_NAME.replace(/[ ]/g, "") != "" && dt.CODE_NAME.replace(/[ ]/g, "") != null) {
            $.ajax({
                type: "POST",
                url: "RemoteHandlers/SysDictionaryControl.ashx",
                async: false,
                cache: true,
                data: dt,
                success: function (result) {
                    if (result == "1") {
                        ymPrompt.succeedInfo('更新成功', null, null, '提示信息', function () {
                            $("#flexTable").flexReload();
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
            ymPrompt.errorInfo('字典名称不能为空', null, null, '提示信息', null);
        }
    }
}

//删除
function deleteSysDictionary(rowData) {
    if (confirm('确认要删除这条记录吗?')) {
        $.ajax({
            type: "POST",
            url: "RemoteHandlers/SysDictionaryControl.ashx?type=delete&Code=" + escape($('div:eq(1)', rowData).text().trim()),
            async: false,
            cache: true,
            success: function (result) {
                if (result == "1") {
                    ymPrompt.succeedInfo('删除成功', null, null, '提示信息', function () {
                        $("#flexTable").flexReload();
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

var myTree = null;
//加载树
function loadTree() {
    myTree = $("#tree").myTree({
        tag: 'SYSDICTIONARYTREE',
        isDefClick: false,
        onClick: function (event, treeId, treeNode) {
            $("#TXTTREEORG_CODE").val(treeNode.id);
            if(0 == treeNode.level){
                if(treeNode.isParent){
                    option.url = 'RemoteHandlers/SysDictionaryControl.ashx?type=all&CODE=' + escape(treeNode.id), option.newp = 1;
                } else {
                    option.url = 'RemoteHandlers/SysDictionaryControl.ashx?type=all&DIC_CODE=' + escape(treeNode.id), option.newp = 1;
                }
            } else {
                option.url = 'RemoteHandlers/SysDictionaryControl.ashx?type=all&DIC_CODE=' + escape(treeNode.id), option.newp = 1;
            }
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
    if ($("#TXTCODE_NAME").val() == "") { ymPrompt.errorInfo('字典名称不能为空!', null, null, '提示信息', null); return false; } //机车号 
    if ($("#TXTDIC_CODE").val() == "") { ymPrompt.errorInfo('字典编码不能为空!', null, null, '提示信息', null); return false; } //生产日期
    return true;

}

