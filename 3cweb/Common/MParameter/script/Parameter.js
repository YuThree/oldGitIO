///页面列表数据加载
var option;
function loadParamterFlexiGrid() {
    var title = escape(document.getElementById("TITLE").value);
    var key = escape(document.getElementById("KEY").value);
    option = {
        url: 'RemoteHandlers/ParameterHandler.ashx?type=loadList&TITLE=' + title + '&KEY=' + key + '',
        dataType: 'json',
        colModel: [
            { display: '标题', name: 'TITILE', width: 300, sortable: false, align: 'left' },
            { display: '键值', name: 'KEY', width: 140, sortable: false, align: 'left' },
            { display: '数值', name: 'VALUE', width: 300, sortable: false, align: 'left' },
            { display: '时间', name: 'TIME', width: 120, sortable: false, align: 'center' },
            { display: '说明', name: 'CONTEXT', width: 80, sortable: false, align: 'center' },
            { display: '操作', name: 'CZ', width: 250, sortable: false, align: 'center' },
            { display: 'ID', name: 'ID', width: 80, pk: true, hide: true, sortable: false, align: 'center' }
        ],
        rowId: 'ID', // 多选框绑定行的id
        rp: parseInt(($(window).height() - 180) / 27),
        showTableToggleBtn: true,
        width: 'auto',
        height: $(window).height() - 180,
    };
    $("#flexTable").flexigrid(option);
};
//添加
function addParamter() {
    document.getElementById('url').src = "../MParameter/ParameterForm.htm?id=&type=addParamter&v=" + version;
    document.getElementById('modal-xz').click();
}
//查看
function seeParamter(rowData) {
    document.getElementById('url').src = "../MParameter/ParameterForm.htm?id=" + rowData.id + "&type=seeParamter&v=" + version;
    document.getElementById('modal-xz').click();
}
//修改
function updateParamter(rowData) {
    document.getElementById('url').src = "../MParameter/ParameterForm.htm?id=" + rowData.id + "&type=updateParamter&v=" + version;
    document.getElementById('modal-xz').click();
}
//删除
function deleteParamter(rowData) {
    ymPrompt.succeedInfo("这个是否在系统中已应用？与你的七大姑八大姨商量好了没？是否要删除信息？", null, null, '提示信息', function(mes) {
        if (mes == "ok") {
            var url = "RemoteHandlers/ParameterHandler.ashx?type=deleteParamter&id=" + rowData.id + "";
            $.ajax({
                type: "POST",
                url: url,
                async: false,
                cache: false,
                success: function(result) {
                    ymPrompt.succeedInfo(result, null, null, '提示信息', function(mess) {
                        if (mess == "ok") {
                            location.reload();
                        }
                    });
                }
            });
        }
    });
}

/*****************************************************************************/

//加载参数设置详细
function loadParamterForm() {
    var id = GetQueryString("id");
    var type = GetQueryString("type");
    if (type == "updateParamter" || type == "seeParamter") {
        var url = "RemoteHandlers/ParameterHandler.ashx?type=" + type + "&id=" + id + "";
        $.ajax({
            type: "POST",
            url: url,
            async: false,
            cache: false,
            success: function (result) {
                json = eval('(' + result + ')');
                if (json != undefined) {
                    $("input[name='TITILE']").attr("value", json.rows[0].TITILE);
                    $("input[name='KEY']").attr("value", json.rows[0].TITILE);
                    $("textarea[name='VALUE']").attr("value", json.rows[0].VALUE);
                    $("textarea[name='CONTEXT']").attr("value", json.rows[0].CONTEXT);
                    removeClass(document.getElementById("TITILE"));
                    removeClass(document.getElementById("KEY"));
                    removeClass(document.getElementById("VALUE"));
                }
            }
        });
    }
    if (type == "updateParamter" || type == "addParamter") {
        window.parent.bindBtnDiv("<input id='S_btnTask' class='btn btn-primary' type='button' onclick='child.window.optionParamterForm()' value='保存'></input><button id='close' aria-hidden='true' class='btn btn-primary' data-dismiss='modal'>关闭</button>");
    }
}
//绑定操作按钮
function bindBtnDiv(btn) {
    document.getElementById("btnDiv").innerHTML = btn;
}
//操作参数设置
function optionParamterForm() {
    var id = GetQueryString("id");
    var options = {
        beforeSubmit: validParamterForm(),
        url: "RemoteHandlers/ParameterHandler.ashx?type=addParamter&id=" + id,
        type: 'POST',
        success: function (result) {
            ymPrompt.succeedInfo(result, null, null, '提示信息', function (mes) { if (mes == "ok") { parent.location.reload(); } });
        }
    };
    $('#ParamterForm').ajaxSubmit(options);
}

//验证字段
function validParamterForm() {
    if ($("#TITILE").val() == "") { ymPrompt.alert('标题不能为空', null, null, '提示信息', function (mes) { if (mes == "ok") { document.getElementById("TITILE").focus(); $("#divTITILE").addClass("control-group error"); } }); return true; }
    if ($("#KEY").val() == "") { ymPrompt.alert('键值不能为空', null, null, '提示信息', function (mes) { if (mes == "ok") { document.getElementById("KEY").focus(); $("#divKEY").addClass("control-group error"); } }); return true; }
    //if ($("#VALUE").val() == "") { ymPrompt.alert('数值不能为空', null, null, '提示信息', function (mes) { if (mes == "ok") { document.getElementById("VALUE").focus(); $("#divVALUE").addClass("control-group error"); } }); return true; }
};
function removeClass(val) {
    if (val.value.replace(/^ +| +$/g, '') == '') {
        $("#div" + val.id).addClass("control-group error");
    } else {
        $("#div" + val.id).removeClass();
    }
}
//查询
function doQuery() {
    loadParamterFlexiGrid();
    $("#flexTable").flexOptions(option).flexReload();
}