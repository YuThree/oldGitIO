/*========================================================================================*
* 功能说明：菜单操作JS类
* 注意事项：列表和表单都在里面
* 作    者： wcg
* 版本日期：2013年10月31日
* 变更说明：
* 版 本 号： V1.0
*=======================================================================================*/
/******************列表开始************************/
//加载列表控件及数据
function loadFlexiGrid(code) {
    option = {
        url: 'RemoteHandlers/FunMenu.ashx?type=grid&funMenuCode=' + encodeURIComponent(code) + '&category=' + GetQueryString("category"),
        dataType: 'json',
        colModel: [
                            { display: '编码', name: 'CODE', width: 80, sortable: false, align: 'left' },
			                { display: '名称', name: 'NAME', width: 80, sortable: false, align: 'left' },
			                { display: '相对路径', name: 'URL', width: 250, sortable: false, align: 'left' },
			                { display: '样式', name: 'IMG', width: 100, sortable: false, align: 'left' },
                            { display: '是否停用', name: 'FLAG', width: 80, sortable: false, align: 'center' },
			                { display: '是否顶级', name: 'LEAF', width: 80, sortable: false, align: 'center' },
			                { display: '备注', name: 'NOTE', width: 100, sortable: false, align: 'center' },
                            { display: '操作', name: 'CZ', width: 150, sortable: false, align: 'center' },
			                { display: '主键', name: 'ID', width: 80, sortable: false, pk: true, hide: true, align: 'center' }
                            ],
        usepager: true,
        title: '菜单列表',
        pagestat: '显示第 {from} 条到 {to} 条,共 {total} 条数据', // 显示当前页和总页面的样式
        procmsg: '正在处理,请稍候 ...', // 正在处理的提示信息
        nomsg: '没有数据存在!', // 无结果的提示信息
        pagetext: '当前第',
        outof: '页，总页数',
        findtext: '条件查询：',
        useRp: true,
        checkbox: false, // 是否要多选框
        rowId: 'ID', // 多选框绑定行的id
        rp: 30,
        showTableToggleBtn: true,
        width: 'auto',
        height: flexTableh + 100,
        title: false, //是否包含标题 
        resizable: false, //是否可伸缩 
        striped: true //是否显示斑纹效果，默认是奇偶交互的形式
    }
    $("#flexTable").flexigrid(option);
  
}
//获取树JSON数据
function getzNodes() {
    var url = "RemoteHandlers/FunMenu.ashx?type=tree&category=" + GetQueryString("category");
    var json;
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        cache: false,
        success: function (result) {
            if (result!=undefined&&result !="") {
                json = eval('(' + result + ')');
                document.getElementById('divBtn').style.display = "none";
            }
           
        }
    });
    return json;
}
//树样式设置
var setting = {
    data: {
        simpleData: {
            enable: true
        }
    },
    view: {
        showLine: true,
        selectedMulti: false
    }

};
//加载树
function loadTree() {
    $.fn.zTree.init($("#funMenutree"), setting, getzNodes());
    var treeObj = $.fn.zTree.getZTreeObj("funMenutree");
    treeObj.expandAll(false);
}

//单击树
function clickTree(code) {
    loadFlexiGrid(code);
    $("#flexTable").flexOptions(option).flexReload();
}
//添加
function addFunMenu(rowData) {
    document.getElementById('url').src = "FunMenuForm.htm?type=addFunMenu&id=" + rowData.id + '&v=' + version;
    document.getElementById('modal-22256').click();
}
//修改
function updateFunMenu(rowData) {
    document.getElementById('url').src = "FunMenuForm.htm?type=updateFunMenu&id=" + rowData.id + '&v=' + version;
    document.getElementById('modal-22256').click();
}
//删除
function deleteFunMenu(rowData) {
    ymPrompt.succeedInfo("是否要删除信息？", null, null, '提示信息', function (mes) {
        if (mes == "ok") {
            var url = "RemoteHandlers/FunMenu.ashx?type=deleteFunMenu&id=" + rowData.id;
            $.ajax({
                type: "POST",
                url: url,
                async: false,
                cache: false,
                success: function (result) {
                    ymPrompt.errorInfo(result, null, null, '提示信息', function (mes) { if (mes == "ok") { location.reload(); } });
                }
            });
        } 
    });

}
/**********************列表结束********************/

/**********************表单开始********************/
function funMenuForm() {
    var id = GetQueryString("id");
    var type = GetQueryString("type");
    var url = "RemoteHandlers/FunMenu.ashx?type=grid&id=" + id;
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        cache: false,
        success: function (result) {
            json = eval('(' + result + ')');
            if (json != undefined) {
                if ("addFunMenu" == type) {
                    $("input[name='SUBCODE']").attr("value", json.rows[0].CODE);
                    $("input[name='CODE']").attr("value", json.rows[0].CODE);
                    $("input[name='FLAG']").attr("value", "false");
                    $("input[name='LEAF']").attr("value", "false");
                }
                if ("updateFunMenu" == type) {
                    $("input[name='SUBCODE']").attr("value", json.rows[0].SUBCODE);
                    $("input[name='CODE']").attr("value", json.rows[0].CODE);
                    $("input[name='NAME']").attr("value", json.rows[0].NAME);
                    $("input[name='URL']").attr("value", json.rows[0].URL);
                    $("input[name='IMG']").attr("value", json.rows[0].IMG);
                    $("input[name='FLAG']").attr("value", json.rows[0].FLAG);
                    $("input[name='LEAF']").attr("value", json.rows[0].LEAF);
                    $("input[name='PARENTCODE']").attr("value", json.rows[0].CATEGORY);
                    removeClass(document.getElementById("SUBCODE"));
                    removeClass(document.getElementById("CODE"));
                    removeClass(document.getElementById("NAME"));
                }
            }
        }
    });
}
function funMenuSave() {
    var id = GetQueryString("id");
    var type = GetQueryString("type");
    if (validateFunMenu()) {
        var options = {
            beforeSubmit: showRequest,
            url: "RemoteHandlers/FunMenu.ashx?type=" + type + "&id=" + id,
            type: 'POST',
            success: function (result) {
                ymPrompt.succeedInfo(result, null, null, '提示信息', function (mes) { if (mes == "ok") { parent.location.reload(); } });
            }
        };
        $('#funMenuForm').ajaxSubmit(options);
    }
}
//验证
function validateFunMenu() {
    if ($("#SUBCODE").val() == "") { ymPrompt.alert('父编码不能为空', null, null, '提示信息', null); return false; }
    if ($("#CODE").val() == "") { ymPrompt.alert('编码不能为空', null, null, '提示信息', null); return false; }
    if ($("#NAME").val() == "") { ymPrompt.alert('名称不能为空', null, null, '提示信息', null); return false; }
    return true;
}
function showRequest() {
    var v = $("#funMenuForm").valid();
    return v;
}
function removeClass(val) {
    if (val.value.replace(/^ +| +$/g, '') == '') {
        $("#div" + val.id).addClass("control-group error");
    } else {
        $("#div" + val.id).removeClass();
    }
}
/***********************表单结束*******************/