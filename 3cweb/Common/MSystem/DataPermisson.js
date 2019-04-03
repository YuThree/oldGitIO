/*========================================================================================*
* 功能说明：数据权限列表页面操作和数据展示JS
* 注意事项：
* 作    者： lc
* 版本日期：2014年9月29日
* 变更说明：
* 版 本 号： V1.0.0
*=======================================================================================*/

var option; //表格内容

function loadFlexiGrid(code, treeType) {
    var _h = $(window).height() - 135;
    var _PageNum = parseInt(_h / 25);
    option = {
        url: 'RemoteHandlers/DataPermissonControl.ashx?type=all&CODE=' + code + "&TREETYPE=" + treeType,
        dataType: 'json',
        colModel: [
                            { display: 'CODE', name: 'CODE', width: 80, sortable: false, hide: true, align: 'center' },
                            { display: '授权对象', name: 'MASTERID', width: 180, sortable: false, hide: true, align: 'center' },
                            { display: '授权对象', name: 'MASTER_NAME', width: 200, sortable: false, align: 'center' },
                            { display: '类型', name: 'ROLE_TYPE', width: 200, sortable: false, hide: true, align: 'center' },
                            { display: '授权数据对象', name: 'ORG_NAME', width: 750, sortable: false, align: 'center' },
                            { display: '授权数据对象CODE', name: 'ORG_CODE', width: 150, sortable: false, hide: true, align: 'center' },
                            { display: '操作', name: 'cz', width: 150, sortable: false, align: 'center' },
                            { display: 'id', name: 'id', width: 80, sortable: false, hide: true, pk: true, align: 'center' }
                            ],
        usepager: true,
        title: '数据权限列表',
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
//弹出添加蒙层
function addPermissonModal() {
    $('#MASTERID').val("");
    $("#PERMISSIONTYPE").val("");
    $("#PERMISSIONVALUE").val("");
    $("#MASTER_NAME").val("");
    $('#SENDDEPTNAMES').val(""); //授权对象
    setTreeOrg();
    $('#SENDDEPT').val(""); //授权对象
    document.getElementById("text").value = "add";
    document.getElementById('modal-22256').click();
}

//弹出修改蒙层
function updatePermissonModal(rowData) {
    $('#CODE').val($('div:eq(0)', rowData).text().trim());
    $('#MASTERID').val($('div:eq(1)', rowData).text().trim()); //授权对象
    $('#MASTER_NAME').val($('div:eq(2)', rowData).text().trim()); //授权对象

    $('#TYPE').val($('div:eq(3)', rowData).text().trim());

    var orgName = $('div:eq(4)', rowData).text().trim();

    $('#SENDDEPTNAMES').val(orgName); //授权对象
    var orgCode = $('div:eq(5)', rowData).text().trim();
    setTreeOrg();
    var s = ztree;
    $('#SENDDEPT').val(orgCode); //授权对象
    document.getElementById("text").value = "update";
    document.getElementById('modal-22256').click();
}
//添加
function Add() {

    var SENDDEPTNAMES = document.getElementById('SENDDEPTNAMES').value;
    var SENDDEPT = document.getElementById('SENDDEPT').value;
    var MASTERID = document.getElementById('MASTERID').value;
    var TYPE = document.getElementById('TYPE').value;
    if (TYPE != "USER") {
        TYPE = "ORG";
    }
    responseData = XmlHttpHelper.transmit(false, "get", "text", "RemoteHandlers/DataPermissonControl.ashx?type=add&MASTERID=" + escape(MASTERID)
     + "&SENDDEPTNAMES=" + escape(SENDDEPTNAMES)
     + "&SENDDEPT=" + escape(SENDDEPT)
      + "&ROLETYPE=" + escape(TYPE)
       + '&temp=' + Math.random(), null, null);
    if (responseData == "True") {
        $("#flexTable").flexReload();
        ymPrompt.succeedInfo('添加成功', null, null, '提示信息', null);
    } else {
        ymPrompt.errorInfo('添加失败', null, null, '提示信息', null);
    }
    document.getElementById('close').click();

}
//修改
function Update() {
    var SENDDEPTNAMES = document.getElementById('SENDDEPTNAMES').value;
    var SENDDEPT = document.getElementById('SENDDEPT').value;
    var MASTERID = document.getElementById('MASTERID').value;
    var TYPE = document.getElementById('TYPE').value;
    var CODE = document.getElementById('CODE').value;
    if (TYPE != "USER") {
        TYPE = "ORG";
    }

    responseData = XmlHttpHelper.transmit(false, "get", "text", "RemoteHandlers/DataPermissonControl.ashx?type=update&MASTERID=" + escape(MASTERID)
     + "&SENDDEPTNAMES=" + escape(SENDDEPTNAMES)
     + "&SENDDEPT=" + escape(SENDDEPT)
      + "&ROLETYPE=" + escape(TYPE)
      + "&CODE=" + escape(CODE)
       + '&temp=' + Math.random(), null, null);
    if (responseData == "True") {
        $("#flexTable").flexReload();
        ymPrompt.succeedInfo('修改成功', null, null, '提示信息', null);
    } else {
        ymPrompt.errorInfo('修改失败', null, null, '提示信息', null);
    }
    document.getElementById('close').click();

}
//删除
function deletePermisson(rowData) {
    if (confirm('确认要删除这条记录吗?')) {
        responseData = XmlHttpHelper.transmit(false, "get", "text", "RemoteHandlers/DataPermissonControl.ashx?type=delete&ID=" + escape($('div', rowData)[0].innerHTML) + '&temp=' + Math.random(), null, null);
        if (responseData == true || responseData == "True" || responseData == "true") {
            $("#flexTable").flexReload();
            ymPrompt.succeedInfo('删除成功', null, null, '提示信息', null);
        } else {
            ymPrompt.errorInfo('删除失败', null, null, '提示信息', null);
        }
    }
}
//更新
function addOrUpdate() {
    var type = document.getElementById("text").value;
    if (type == "add") {
        Add();
    }
    else if (type == "update") {
        Update();
    }
}
var ztree;
///加载多选下拉组织树
function setTreeOrg() {
    ztree = $('#DIVSENDDEPT').myTree({
        tag: 'ORGANIZATION',
        isDefClick: false,
        chkboxType: { "Y": "", "N": "" },
        enableCheck: true,
        onClick: function (event, treeId, treeNode) {
            if (treeNode.checked) {
                treeNode.checked = false;
            } else {
                treeNode.checked = true;
            }
            ztree.updateNode(treeNode);

            onChangeObjs(treeNode.id, treeNode.name, document.getElementById('SENDDEPT'), document.getElementById('SENDDEPTNAMES'));
        },
        onCheck: function (event, treeId, treeNode) {
            onChangeObjs(treeNode.id, treeNode.name, document.getElementById('SENDDEPT'), document.getElementById('SENDDEPTNAMES'));
        }
    });
}

//多选
//objText:所选树的CODE
//objValue:所选树的name名称
//textObj:存所选CODE的控件对象
//valueObj:存所选NAME的控件对象
function onChangeObjs(objText, objValue, textObj, valueObj) {
    if (textObj.value != "") {
        var textJson = textObj.value.split(',');
        var valueJson = textObj.value.split(',');
        var bool = true;
        for (var i = 0; i < textJson.length; i++) {
            if (i == 0 && textJson[i] == objText) {
                textObj.value = textObj.value.replace(objText, '');
                valueObj.value = valueObj.value.replace(objValue, '');
                bool = false;
                break;
            } else if (textJson[i] == objText) {
                textObj.value = textObj.value.replace("," + objText, '');
                valueObj.value = valueObj.value.replace("," + objValue, '');
                bool = false;
                break;
            }
        }
        if (bool) {
            textObj.value += "," + objText;
            valueObj.value += "," + objValue;
        }
    } else {
        textObj.value = objText;
        valueObj.value = objValue;
    }
};