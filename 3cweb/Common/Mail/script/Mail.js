//加载短信信息
var toDoOption;
var doOption;
function loadMailFlexiGrid() {
    var userName = escape(document.getElementById("USER_NAME").value);
    var mailTel = escape(document.getElementById("MAIL_TEL").value);
    var mailTitle = escape(document.getElementById("MAIL_TITLE").value);
    var startTime = escape(document.getElementById("startTime").value);
    var endTime = escape(document.getElementById("endTime").value);
    loadToDoMailFlexGrid(userName, mailTel, mailTitle, startTime, endTime);
    loadDoMailFlexGrid(userName, mailTel, mailTitle, startTime, endTime);
}
//加载待办短信信息
function loadToDoMailFlexGrid(userName, mailTel, mailTitle, startTime, endTime) {
    toDoOption = {
        url: 'RemoteHandlers/MailHandler.ashx?type=toDoMailList&userName=' + userName + '&mailTel=' + mailTel + '&mailTitle=' + mailTitle + '&startTime=' + startTime + '&endTime=' + endTime + '',
        dataType: 'json',
        colModel: [
                            { display: '人员名称', name: 'USER_NAME', width: 100, sortable: false, align: 'left' },
                            { display: '手机号码', name: 'MAIL_TEL', width: 100, sortable: false, align: 'center' },
                            { display: '短信标题', name: 'MAIL_TITLE', width: 180, sortable: false, align: 'center' },
                            { display: '短信内容', name: 'MAIL_CONTEXT', width: 450, sortable: false, align: 'center' },
                            { display: '创建时间', name: 'CREATE_TIME', width: 120, sortable: false, align: 'center' },
			                { display: '备注', name: 'MAIL_REMARKS', width: 180, sortable: false, align: 'left' },
                            { display: '操作', name: 'CZ', width: 120, sortable: false, align: 'center' },
                            { display: '缺陷主键', name: 'ALARM_ID', width: 300, sortable: false, hide: true, align: 'center' },
			                { display: '主键', name: 'ID', width: 80, sortable: false, pk: true, hide: true, align: 'center' }
                            ],
        usepager: true,
        title: '短信列表',
        pagestat: '显示第 {from} 条到 {to} 条,共 {total} 条数据', // 显示当前页和总页面的样式
        procmsg: '正在处理,请稍候 ...', // 正在处理的提示信息
        nomsg: '没有数据存在!', // 无结果的提示信息
        pagetext: '当前第',
        outof: '页，总页数',
        findtext: '条件查询：',
        useRp: true,
        checkbox: false, // 是否要多选框
        rowId: 'ID', // 多选框绑定行的id
        rp: parseInt(($(window).height() - 240) / 25),
        showTableToggleBtn: true,
        width: 'auto',
        height: $(window).height() - 240,
        title: false, //是否包含标题 
        resizable: false, //是否可伸缩 
        striped: true //是否显示斑纹效果，默认是奇偶交互的形式
    }
    $("#toDoMailFlexTable").flexigrid(toDoOption);
}
//加载已发送短信信息
function loadDoMailFlexGrid(userName, mailTel, mailTitle, startTime, endTime) {
    doOption = {
        url: 'RemoteHandlers/MailHandler.ashx?type=doMailList&userName=' + userName + '&mailTel=' + mailTel + '&mailTitle=' + mailTitle + '&startTime=' + startTime + '&endTime=' + endTime + '',
        dataType: 'json',
        colModel: [
                          { display: '人员名称', name: 'USER_NAME', width: 100, sortable: false, align: 'left' },
                            { display: '手机号码', name: 'MAIL_TEL', width: 100, sortable: false, align: 'center' },
                            { display: '短信标题', name: 'MAIL_TITLE', width: 180, sortable: false, align: 'center' },
                            { display: '短信内容', name: 'MAIL_CONTEXT', width: 580, sortable: false, align: 'center' },
                            { display: '创建时间', name: 'CREATE_TIME', width: 120, sortable: false, align: 'center' },
			                { display: '备注', name: 'MAIL_REMARKS', width: 180, sortable: false, align: 'left' },
                            { display: '缺陷主键', name: 'ALARM_ID', width: 300, sortable: false, hide: true, align: 'center' },
			                { display: '主键', name: 'ID', width: 80, sortable: false, pk: true, hide: true, align: 'center' }
                            ],
        usepager: true,
        pagestat: '显示第 {from} 条到 {to} 条,共 {total} 条数据', // 显示当前页和总页面的样式
        procmsg: '正在处理,请稍候 ...', // 正在处理的提示信息
        nomsg: '没有数据存在!', // 无结果的提示信息
        pagetext: '当前第',
        outof: '页，总页数',
        findtext: '条件查询：',
        useRp: true,
        rowId: 'ID', // 多选框绑定行的id
        rp: parseInt(($(window).height() - 240) / 25),
        width: 'auto',
        height: $(window).height() - 240,
        striped: true //是否显示斑纹效果，默认是奇偶交互的形式
    }
    $("#doMailFlexTable").flexigrid(doOption);
}



//查询
function doQuery() {
    loadMailFlexiGrid();
    $("#toDoMailFlexTable").flexOptions(toDoOption).flexReload();
    $("#doMailFlexTable").flexOptions(doOption).flexReload();
}

//添加
function addMail() {
    document.getElementById('url').src = "../Mail/MailForm.htm?id=&type=addMail&v=" + version;
    document.getElementById('modal-xz').click();
}

//修改
function updateMail(rowData) {
    document.getElementById('url').src = "../Mail/MailForm.htm?id=" + rowData.id + "&type=updateMail&v=" + version;
    document.getElementById('modal-xz').click();
}
//删除
function deleteMail(rowData) {
    ymPrompt.succeedInfo("是否要删除信息？", null, null, '提示信息', function (mes) {
        if (mes == "ok") {
            var url = "RemoteHandlers/MailHandler.ashx?type=deleteMail&id=" + rowData.id + "";
            $.ajax({
                type: "POST",
                url: url,
                async: false,
                cache: false,
                success: function (result) {
                    ymPrompt.succeedInfo(result, null, null, '提示信息', function (mess) {
                        if (mess == "ok") {
                            location.reload();
                        }
                    });
                }
            });
        }
    });
}
//绑定操作按钮
function bindBtnDiv(btn) {
    document.getElementById("btnDiv").innerHTML = btn;
}

function toDoMail(rowData) {
    var url = "RemoteHandlers/MailHandler.ashx?type=toDoMail&id=" + rowData.id + "";
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        cache: false,
        success: function (result) {
            ymPrompt.succeedInfo(result, null, null, '提示信息', function (mess) {
                if (mess == "ok") {
                    //location.reload();
                }
            });
        }
    });
}
/**************************************************************************/


function removeClass(val) {
    if (val.value.replace(/^ +| +$/g, '') == '') {
        $("#div" + val.id).addClass("control-group error");
    } else {
        $("#div" + val.id).removeClass();
    }
}

//页面树设置
var setting = {
    data: {
        simpleData: {
            enable: true
        }
    },
    check: {
        enable: true
    }
};
//绑定树
function getzNodes() {
    var url = "../MSystem/RemoteHandlers/Permission.ashx?type=tree";
    var json;
    $.ajax({
        type: "POST",
        url: url,
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
    treeObj.expandAll(false);
}
/*******************************************************************/

function loadMailForm() {
    loadTree();
    var id = GetQueryString("id");
    var url = "RemoteHandlers/MailHandler.ashx?type=loadMail&id=" + id + "";
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        cache: false,
        success: function (result) {
            if (result != undefined && result != "") {
                var json = eval('(' + result + ')');
                $("input[name='MAIL_TITLE']").attr("value", json.rows[0].MAIL_TITLE);
                $("input[name='MAIL_USER']").attr("value", json.rows[0].USER_NAME + "[" + json.rows[0].MAIL_TEL + "]");
                $("input[name='MAIL_USERCODE']").attr("value", json.rows[0].MAIL_TEL);
                $("textarea[name='MAIL_CONTEXT']").attr("value", json.rows[0].MAIL_CONTEXT);
                $("select[name='MAIL_STATUS']").attr("value", json.MAIL_STATUS);
                removeClass(document.getElementById("MAIL_TITLE"));
                removeClass(document.getElementById("MAIL_CONTEXT"));
            }


        }
    });
    window.parent.bindBtnDiv("<input id='S_btnTask' class='btn btn-primary' type='button' onclick='child.window.saveMail()' value='保存'></input><button id='close' aria-hidden='true' class='btn btn-primary' data-dismiss='modal'>关闭</button>");
}
///
function saveMail() {
    var id = GetQueryString("id");
    var options = {
        beforeSubmit: validMailForm(),
        url: "RemoteHandlers/MailHandler.ashx?type=saveMail&id=" + id + "&ALARM_ID=" + GetQueryString("ALARM_ID"),
        type: 'POST',
        success: function (result) {
            ymPrompt.succeedInfo(result, null, null, '提示信息', function (mes) { if (mes == "ok") { parent.location.reload(); } });
        }
    };
    $('#mailForm').ajaxSubmit(options);
}

function validMailForm() {
    if ($("#MAIL_TITLE").val() == "") {
        ymPrompt.alert('标题不能为空', null, null, '提示信息', function (mes) {
            if (mes == "ok") {
                document.getElementById("MAIL_TITLE").focus();
                $("#divMAIL_TITLE").addClass("control-group error");
            }
        });
        return true;
    }
    if ($("#MAIL_CONTEXT").val() == "") {
        ymPrompt.alert('短信内容不能为空', null, null, '提示信息', function (mes) {
            if (mes == "ok") {
                document.getElementById("MAIL_CONTEXT").focus();
                $("#divMAIL_CONTEXT").addClass("control-group error");
            }
        });
        return true;
    }
    var orgTree = $.fn.zTree.getZTreeObj("orgTree");
    for (var i = 0; i < orgTree.getCheckedNodes(true).length; i++) {
        if (orgTree.getCheckedNodes(true)[i].icon == "person.png") {
            document.getElementById("MAIL_USERCODE").value += orgTree.getCheckedNodes(true)[i].id + ";";
        }
    }
    var type = GetQueryString("type");
    if (type != undefined && type == "addMail") {
        if (document.getElementById("MAIL_USERCODE").value == "") {
            ymPrompt.alert('请选择人员信息', null, null, '提示信息');
            return true;
        }
    }

};