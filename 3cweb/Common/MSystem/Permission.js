/*========================================================================================*
* 功能说明：用户页面权限列表页面操作和数据展示JS
* 注意事项：
* 作    者： lc
* 版本日期：2014年9月29日
* 变更说明：
* 版 本 号： V1.0.0
*=======================================================================================*/
var _type;//判断是组织机构还是用户
var setting = {
    data: {
        simpleData: {
            enable: true
        }
    }
    //    ,
    //    check: {
    //        enable: true
    //    }
};

//绑定树
function getzNodes() {
    var _url = "RemoteHandlers/Permission.ashx?type=tree";
    var json;
    $.ajax({
        type: "POST",
        url: _url,
        async: false,
        cache: true,
        success: function (result) {
            json = eval('(' + result + ')');
        }
    });
    return json;
}

var zNodes = getzNodes();
//加载树
function loadTree() {
    $.fn.zTree.init($("#orgTree"), setting, zNodes);
    var treeObj = $.fn.zTree.getZTreeObj("orgTree");
    treeObj.expandAll(true);
}
//单击树
function TreeClick(id, type) {
    _type = type;
    loadFormTree();
    document.getElementById("code").value = id;
    var checkList = getFormTreeChecked(id);
    var funList = checkList.split('$');
    var formTree = $.fn.zTree.getZTreeObj("formTree");
    for (var i = 0; i < funList.length; i++) {
        var fun = funList[i].split(';');
        var obj = formTree.getNodesByParam("id", fun[0], null)
        if (obj.length > 0) {
            formTree.checkNode(obj[0], true, false);
            if (fun[1] == "1")
                document.getElementById("insert_" + obj[0].tId).checked = true;
            if (fun[2] == "1")
                document.getElementById("delete_" + obj[0].tId).checked = true;
            if (fun[3] == "1")
                document.getElementById("update_" + obj[0].tId).checked = true;
            if (fun[4] == "1")
                document.getElementById("select_" + obj[0].tId).checked = true;
            if (fun[5] != "") {
                var qtObj = fun[5].split(',');
                for (var j = 0; j < qtObj.length; j++) {
                    if (qtObj[j].split('@')[1] == "1") {
                        document.getElementById(qtObj[j].split('@')[0] + "_" + obj[0].tId).checked = true;
                    }
                }
            }
        }
    }
}
function checkPermission(type, checked) {
    //    var id = document.getElementById("code").value;
    //    var checkList = getFormTreeChecked(id);
    //    var funList = checkList.split('$');
    //    var formTree = $.fn.zTree.getZTreeObj("formTree");
    //    for (var i = 0; i < funList.length; i++) {
    //    var fun = funList[i].split(';');
    //    var obj = formTree.getNodesByParam("id", fun[0], null)
    //    if (obj.length > 0) {
    //            formTree.checkNode(obj[0], true, false);
    var formTree = $.fn.zTree.getZTreeObj("formTree");
    for (var i = 0; i < formTree.getCheckedNodes(true).length; i++) {
        switch (type) {
            case "select":
                document.getElementById("select_" + formTree.getCheckedNodes(true)[i].tId).checked = checked;
                break;
            case "insert":
                document.getElementById("insert_" + formTree.getCheckedNodes(true)[i].tId).checked = checked;
                break;
            case "update":
                document.getElementById("update_" + formTree.getCheckedNodes(true)[i].tId).checked = checked;
                break;
            case "delete":
                document.getElementById("delete_" + formTree.getCheckedNodes(true)[i].tId).checked = checked;
                break;
            case "all":
                document.getElementById("select_" + formTree.getCheckedNodes(true)[i].tId).checked = checked;
                document.getElementById("insert_" + formTree.getCheckedNodes(true)[i].tId).checked = checked;
                document.getElementById("update_" + formTree.getCheckedNodes(true)[i].tId).checked = checked;
                document.getElementById("delete_" + formTree.getCheckedNodes(true)[i].tId).checked = checked;
                for (var j = 0; j < formTree.getCheckedNodes(true)[i].json.length; j++) {
                    if (formTree.getCheckedNodes(true)[i].json[j].XT_BUTTON_TYPE == "其他")
                        document.getElementById(formTree.getCheckedNodes(true)[i].json[j].XT_BUTTON_CODE + "_" + formTree.getCheckedNodes(true)[i].tId).checked = checked;
                }
                break;
            default:

        }
    }
    //    }
    //    }
}
//根据组织机构树查询出他对应的页面权限
function getFormTreeChecked(id) {
    responseData = XmlHttpHelper.transmit(false, "get", "text", "RemoteHandlers/Permission.ashx?type=checked&MASTERID=" + id + '&temp=' + Math.random(), null, null);
    return responseData;
}

//页面树设置
var formsetting = {
    data: {
        simpleData: {
            enable: true
        }
    },
    check: {
        enable: true
    },
    view: {
        addDiyDom: addDiyDom
    }
    //    ,
    //    callback: {
    //        beforeCheck: zTreeBeforeCheck,
    //        onCheck: zTreeOnCheck,
    //    }
};

var IDMark_Switch = "_switch",
    IDMark_Icon = "_ico",
    IDMark_Span = "_span",
    IDMark_Input = "_input",
    IDMark_Check = "_check",
    IDMark_Edit = "_edit",
    IDMark_Remove = "_remove",
    IDMark_Ul = "_ul",
    IDMark_A = "_a";

function addDiyDom(treeId, treeNode) {
    if (treeNode.parentNode && treeNode.parentNode.id != 2) return;
    var aObj = $("#" + treeNode.tId + IDMark_A);
    var space = "";
    var length = 0;
    if (treeNode.level == 0) {
        length = 0; space += "----";
    }
    else if (treeNode.level == 1) {
        length = 1;
    }
    else if (treeNode.level == 2) {
        length = 10;
    }
    for (var i = 0; i < (8 - aObj[0].text.length) * 2; i++) {
        space += "-";
    }
    if (aObj[0].text.length == 4 && treeNode.level == 1) { space = "---------"; }
    else if (aObj[0].text.length == 2 && treeNode.level == 1) { space = "--------------"; }
    else if (aObj[0].text.length == 5 && treeNode.level == 1) { space = "-------"; }
    else if (aObj[0].text.length == 6 && treeNode.level == 0) { space = "-------"; }
    if (treeNode.level == 2) {
        space = "------";
    }
    var editStr = "";
    var Insert_disabled = "disabled";
    var Update_disabled = "disabled";
    var Select_disabled = "disabled";
    var Delete_disabled = "disabled";
    var QT_Str = "";

    if (treeNode.json.length > 0) {
        for (var i = 0; i < treeNode.json.length; i++) {
            if (treeNode.json[i].XT_BUTTON_TYPE == "其他") {
                QT_Str += "&nbsp;<input id='" + treeNode.json[i].XT_BUTTON_CODE + "_" + treeNode.tId + "' name='QT' type='checkbox' value='QT'>" + treeNode.json[i].XT_BUTTON_NAME;
            }
            if (treeNode.json[i].XT_BUTTON_TYPE == "查询") {
                Select_disabled = "";
            }
            if (treeNode.json[i].XT_BUTTON_TYPE == "新增") {
                Insert_disabled = "";
            }
            if (treeNode.json[i].XT_BUTTON_TYPE == "修改") {
                Update_disabled = "";
            }
            if (treeNode.json[i].XT_BUTTON_TYPE == "删除") {
                Delete_disabled = "";
            }
        }
    }
    editStr += space + "<input id='select_" + treeNode.tId + "' " + Select_disabled + " name='ckboxSelect' type='checkbox' value='QUERY'>查询&nbsp;";
    editStr += "<input id='insert_" + treeNode.tId + "' " + Insert_disabled + " name='ckboxInsert' type='checkbox' value='INSERT'>新增&nbsp;";
    editStr += "<input id='update_" + treeNode.tId + "' " + Update_disabled + " name='ckboxUpdate' type='checkbox' value='UPDATE'>修改&nbsp;";
    editStr += "<input id='delete_" + treeNode.tId + "' " + Delete_disabled + " name='ckboxDelete' type='checkbox' value='DELETE'>删除";
    editStr += QT_Str;
    aObj.after(editStr);
}


////角色树选择前事件
//function zTreeBeforeCheck(treeId, treeNode) {
//    return true;
//};
////角色树选择后事件
//function zTreeOnCheck(event, treeId, treeNode) {
//             //alert(treeNode.tId + ", " + treeNode.name + "," + treeNode.checked);
////            var formTree = $.fn.zTree.getZTreeObj("formTree");
////            var orgTree = $.fn.zTree.getZTreeObj("tree");
////            for (var i = 0; i < formTree.getCheckedNodes(true).length; i++) 
////            {
////            document.getElementById("formPermission").value="";
////                 var s= formTree.getCheckedNodes(true)[i].id;
////            }
//};
//绑定角色树
function getRoleNodes() {
    var _url = "RemoteHandlers/Permission.ashx?type=formtree&category=" + GetQueryString("category");
    var json;
    $.ajax({
        type: "POST",
        url: _url,
        async: false,
        cache: true,
        success: function (result) {
            json = eval('(' + result + ')');
        }
    });
    return json;
}

//加载树
function loadFormTree() {
    $.fn.zTree.init($("#formTree"), formsetting, getRoleNodes());
    var treeObj = $.fn.zTree.getZTreeObj("formTree");
    treeObj.expandAll(true);
}

//授权
function Impower() {
    var relsult = "";
    var formTree = $.fn.zTree.getZTreeObj("formTree");
    var orgTree = $.fn.zTree.getZTreeObj("orgTree");
    if ($('#code').val() == "") { ymPrompt.errorInfo('请选择授权对象！', null, null, '提示信息', null); return; }
    //if (formTree.getCheckedNodes(true).length == 0) { ymPrompt.errorInfo('请选择授权页面！', null, null, '提示信息', null); return; }


    for (var i = 0; i < formTree.getCheckedNodes(true).length; i++) {
        var insert = "0";
        if (document.getElementById("insert_" + formTree.getCheckedNodes(true)[i].tId).checked) {
            insert = "1";
        }
        var del = "0";
        if (document.getElementById("delete_" + formTree.getCheckedNodes(true)[i].tId).checked) {
            del = "1";
        }
        var update = "0";
        if (document.getElementById("update_" + formTree.getCheckedNodes(true)[i].tId).checked) {
            update = "1";
        }
        var select = "0";
        if (document.getElementById("select_" + formTree.getCheckedNodes(true)[i].tId).checked) {
            select = "1";
        }
        var qt = "";
        for (var j = 0; j < formTree.getCheckedNodes(true)[i].json.length; j++) {
            if (formTree.getCheckedNodes(true)[i].json[j].XT_BUTTON_TYPE != "其他") {
                continue;
            }
            if (document.getElementById(formTree.getCheckedNodes(true)[i].json[j].XT_BUTTON_CODE + "_" + formTree.getCheckedNodes(true)[i].tId).checked) {
                if (j == 0) {
                    qt = formTree.getCheckedNodes(true)[i].json[j].XT_BUTTON_CODE + "@1";
                } else {
                    qt = qt + "," + formTree.getCheckedNodes(true)[i].json[j].XT_BUTTON_CODE + "@1";
                }

            } else {
                if (j == 0) {
                    qt = formTree.getCheckedNodes(true)[i].json[j].XT_BUTTON_CODE + "@0";
                } else {
                    qt = qt + "," + formTree.getCheckedNodes(true)[i].json[j].XT_BUTTON_CODE + "@0";
                }
            }

        }
        relsult += formTree.getCheckedNodes(true)[i].id + ";" + insert + ";" + del + ";" + update + ";" + select + ";" + qt + "$";

    }
    relsult = relsult.substring(0, relsult.length - 1);
    document.getElementById("formPermission").value = relsult;
    var url = "RemoteHandlers/Permission.ashx";
    var _data = "type=permission&USER_CODE=" + escape($('#code').val()) + "&_type=" + escape(_type) + "&PER_STR=" + escape($("#formPermission").val()) + '&temp=' + Math.random();
    var json;
    $.ajax({
        type: "POST",
        url: url,
        data: _data,
        async: false,
        cache: true,
        success: function (result) {
            json = result;
            if (json == "True") {
                ymPrompt.succeedInfo('添加成功', null, null, '提示信息', null);
            } else {
                ymPrompt.errorInfo('操作失败！请联系管理员', null, null, '提示信息', null);
            }
        }
    });
   
}