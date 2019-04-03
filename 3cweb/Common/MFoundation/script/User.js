/*========================================================================================*
* 功能说明：用户管理页面操作和数据展示JS
* 注意事项：
* 作    者： 李超
* 版本日期：2013年10月23日
* 变更说明：
* 版 本 号： V1.0
*=======================================================================================*/
var option; //表格内容

function loadFlexiGrid(code, treeType) {
    var _h = $(window).height() - 200 - 20;
    var _PageNum = parseInt(_h / 25);
    option = {
        url: 'RemoteHandlers/UserControl.ashx?type=all&ORG_CODE=' + code,
        dataType: 'json',
        colModel: [
                            { display: 'CODE', name: 'USER_CODE', width: 80, sortable: false, hide: true, align: 'center' },
                            { display: '用户名', name: 'LOGINID', width: 80, sortable: false, align: 'center' },
                            { display: '用户密码', name: 'PASSWORD', width: 80, sortable: false, hide: true, align: 'center' },
                            { display: '用户姓名', name: 'PER_NAME', width: 80, sortable: false, align: 'center' },
                            { display: '角色Code', name: 'ROLE_CODE', width: 80, sortable: false, hide: true, align: 'center' },
                            { display: '角色名称', name: 'ROLE_NAME', width: 80, sortable: false,hide: true, align: 'center' },
                            { display: '性别', name: 'SEX', width: 80, sortable: false, hide: true, align: 'center' },
                            { display: '出生日期', name: 'BIRTHDATE', width: 80, sortable: false, hide: true, align: 'center' },
                            { display: '电话号码', name: 'TEL', width: 80, sortable: false, hide: true, align: 'center' },
                            { display: '电子邮件', name: 'EMAIL', width: 80, sortable: false, hide: true, align: 'center' },
                            { display: '地址', name: 'ADDR', width: 80, sortable: false, hide: true, align: 'center' },
                            { display: '部门Code', name: 'ORG_CODE', width: 80, sortable: false, hide: true, align: 'center' },
                            { display: '部门名称', name: 'ORG_NAME', width: 120, sortable: false, hide: false, align: 'center' },
                            { display: '职务', name: 'DUTY', width: 80, sortable: false, hide: false, align: 'center' },
                            { display: '职称', name: 'POSTTITLE', width: 80, sortable: false, hide: false, align: 'center' },
                            { display: '主管人', name: 'SUPERVISOR', width: 80, sortable: false, hide: true, align: 'center' },
                            { display: '职员类别', name: 'EMPLOYEE_TYPE', width: 80, sortable: false, hide: true, align: 'center' },
                            { display: '终聘日期', name: 'END_HIRE_DATE', width: 80, sortable: false, hide: true, align: 'center' },
                            { display: '聘用日期', name: 'HIRE_DATE', width: 80, sortable: false, hide: true, align: 'center' },
                            { display: '安全等级', name: 'SECURITY_CLASS', width: 80, sortable: false, hide: true, align: 'center' },
                            { display: '人员状态', name: 'PER_STATUS', width: 80, sortable: false, hide: false, align: 'center' },
                            { display: '操作', name: 'cz', width: 150, sortable: false, align: 'center' },
                            { display: 'id', name: 'id', width: 80, sortable: false, hide: true, pk: true, align: 'center' }
                            ],
        usepager: true,
        title: '用户列表',
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
function addUserModal() {
    $("#org").addClass("control-group error");
    $("#divLOGINID").addClass("control-group error");
    //$("#divPASSWORD").addClass("control-group error");
    $('#level').val("");
    $('#PER_NAME').val("");
    $('#LOGINID').val("");
    //$("#PASSWORD").val("");
    $('#SEX').val("");
    $('#BIRTHDATE').val("1900-01-01");
    $("#TEL").val("");
    $('#EMAIL').val("");
    $('#ADDR').val("");
    $("#ORG_CODE").val("");
    $("#DEPT_NAME").val("");
    $("#divDEPT_NAME").addClass("control-group error");
    mySelectTree.cancelSelectedNode(mySelectTree.getSelectedNodes()[0]);
    $('#DUTY').val("");
    $('#POSTTITLE').val("");
    $("#SUPERVISOR").val("");
    $('#EMPLOYEE_TYPE').val("");
    $('#END_HIRE_DATE').val("1900-01-01");
    $("#HIRE_DATE").val("1900-01-01");
    $("#SECURITY_CLASS option:first").attr("selected", true);
    $("#PER_STATUS option:first").attr("selected", true);
    document.getElementById("text").value = "add";
    document.getElementById('modal-22256').click();
}

//弹出修改蒙层
function updateUserModal(rowData) {
    $("#org").removeClass();
    $("#divLOGINID").removeClass();
    //$("#divPASSWORD").removeClass();
    $("#USERID").val($('div:eq(22)', rowData).text().trim());
    $("#LOGINID").val($('div:eq(1)', rowData).text().trim());
    $("#PASSWORD").val($('div:eq(2)', rowData).text().trim());
    $("#PER_NAME").val($('div:eq(3)', rowData).text().trim());
    $("#SEX").val($('div:eq(6)', rowData).text().trim());
    $("#BIRTHDATE").val($('div:eq(7)', rowData).text().trim());
    $("#TEL").val($('div:eq(8)', rowData).text().trim());
    $("#EMAIL").val($('div:eq(9)', rowData).text().trim());
    $("#ADDR").val($('div:eq(10)', rowData).text().trim());
    $("#ORG_CODE").val($('div:eq(11)', rowData).text().trim());
    $("#DEPT_NAME").val($('div:eq(12)', rowData).text().trim());
    $("#divDEPT_NAME").removeClass();
    mySelectTree.selectNode(mySelectTree.getNodeByParam("id", $('div:eq(11)', rowData).text().trim(), null));
    $("#DUTY").val($('div:eq(13)', rowData).text().trim());
    $("#POSTTITLE").val($('div:eq(14)', rowData).text().trim());
    $("#SUPERVISOR").val($('div:eq(15)', rowData).text().trim());
    $("#EMPLOYEE_TYPE").val($('div:eq(16)', rowData).text().trim());
    $("#END_HIRE_DATE").val($('div:eq(17)', rowData).text().trim());
    $("#HIRE_DATE").val($('div:eq(18)', rowData).text().trim());
    $("#SECURITY_CLASS").val($('div:eq(19)', rowData).text().trim());
    LoadDropdSelected('SECURITY_CLASS', $('div:eq(19)', rowData).text().trim());
    LoadDropdSelected('PER_STATUS', $('div:eq(20)', rowData).text().trim());
    document.getElementById("text").value = "update";
    document.getElementById('modal-22256').click();
}

//添加
function Add() {
    if (validate()) {
        var options = {
            url: "RemoteHandlers/UserControl.ashx?type=add",
            type: 'POST',
            success: function (result) {

                var re = result.split(',');

                if (re[0] == "1") {
                    ymPrompt.succeedInfo(re[1], null, null, '提示信息', function () {
                        $("#flexTable").flexReload();
                    });
                } else {
                    ymPrompt.errorInfo(re[1], null, null, '提示信息', null);
                }
                document.getElementById('close').click();
            }
        };
        $('#formEdit').ajaxSubmit(options);
    }
}

//修改
function Update() {
    if (validate()) {
        var options = {
            url: "RemoteHandlers/UserControl.ashx?type=update",
            type: 'POST',
            success: function (result) {
                if (result == "1") {
                    ymPrompt.succeedInfo('保存成功', null, null, '提示信息', function () {
                        $("#flexTable").flexReload();
                    });
                } else {
                    ymPrompt.errorInfo('操作失败！请联系管理员', null, null, '提示信息', null);
                }
                document.getElementById('close').click();
            }
        };
        $('#formEdit').ajaxSubmit(options);
    }
}

//删除
function deleteUser(rowData) {
    if (confirm('确认要删除这条记录吗?')) {
        var url = "RemoteHandlers/UserControl.ashx?type=delete&id=" + escape($('div:eq(22)', rowData).text().trim());
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

//判断是新增还是修改
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
    var PER_NAME = $('#txtPERSON_NAME').val();
    option.url = 'RemoteHandlers/UserControl.ashx?type=all&PER_NAME=' + escape(PER_NAME);
    option.newp = 1;
    $("#flexTable").flexOptions(option).flexReload();

}


///重新加载树
var myTree = null;
var mySelectTree = null;
function loadTree() {
    myTree = $("#tree").myTree({
        tag: 'ORGANIZATION',
        isDefClick: false,
        onClick: function (event, treeId, treeNode) {
            option.url = 'RemoteHandlers/UserControl.ashx?type=all&ORG_CODE=' + treeNode.id;
            option.newp = 1;
            $("#flexTable").flexOptions(option).flexReload();
        }
    });


    mySelectTree = $("#DEPT_NAME").mySelectTree({
        tag: "ORGANIZATION",
        isDefClick: false,
        onClick: function (event, treeId, treeNode) {
            $("#ORG_CODE").val(treeNode.id);
            $("#DEPT_NAME").val(treeNode.name);
            
            $("#divDEPT_NAME").removeClass();
        }
    });

}

function validate() {
    if ($("#LOGINID").val() == "") { ymPrompt.errorInfo('用户名不能为空!', null, null, '提示信息', null); return false; } //用户名
    if ($("#PASSWORD").val() == "") { ymPrompt.errorInfo('用户密码不能为空!', null, null, '提示信息', null); return false; } //用户密码

    //if ($("#PASSWORD").val().length<6) { ymPrompt.errorInfo('用户密码不能小于6位!', null, null, '提示信息', null); return false; } //用户密码
    var rgx = /^(?=.{6,})(?!\d+$)(?![a-zA-Z]+$)[a-zA-Z0-9@\.]+$/;
    if (!rgx.test($("#PASSWORD").val()) && $("#PasswordClick").hasClass('img_cheackNot')) {
        ymPrompt.errorInfo('用户密码不能小于6位!由字母和数字组成(可以包含@和.)', null, null, '提示信息', null); return false;
    } //用户密码

    if ($("#DEPT_NAME").val() == "") { ymPrompt.errorInfo('请选择所属部门!', null, null, '提示信息', null); return false; } //所属部门
    return true;
}

function removeClass(val) {
    if (val.value.replace(/^ +| +$/g, '') == '') {
        $("#div" + val.id).addClass("control-group error");
    }
    if (val.value.replace(/^ +| +$/g, '') != '')
    { $("#div" + val.id).removeClass(); }
}

function orgChange(val) {
    if (val == '0') {
        $("#org").addClass("control-group error");
    }
    else {
        $("#org").removeClass();
    }
}