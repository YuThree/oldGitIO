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
    var _h = $(window).height() - 125 - 20;
    var _PageNum = parseInt(_h / 25);
    option = {
        url: 'RemoteHandlers/FunMenuControl.ashx?type=grid&funMenuCode=' + encodeURIComponent(code) + '&category=' + GetQueryString("category"),
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
        rp: _PageNum,
        showTableToggleBtn: true,
        width: 'auto',
        height: _h,
        rpOptions: [20, 50, 100, _PageNum],
        title: false, //是否包含标题 
        resizable: false, //是否可伸缩 
        striped: true //是否显示斑纹效果，默认是奇偶交互的形式
    }
    myGrid = $("#flexTable").flexigrid(option);

}

var myTree, myGrid;
//加载树
function loadTree() {
    myTree = $("#funMenutree").myTree({
        tag: 'FUNMENU',
        isDefClick: false,
        onClick: function (event, treeId, treeNode) {
            option.url = 'RemoteHandlers/FunMenuControl.ashx?type=grid&funMenuCode=' + encodeURIComponent(treeNode.id) + '&category=' + GetQueryString("category");
            option.newp = 1;
            $("#flexTable").flexOptions(option).flexReload();
        }
    });
}

//添加
function addFunMenu(rowData) {
    $('#url').css('height', '300px');
    $("#url").attr("src", "FunMenuForm.htm?type=addFunMenu&id=" + rowData.id + '&v=' + version);
    $('#modal-22256').trigger("click");

}

function AddButton(code) {
    $('#url').css('height','500px');
    $("#url").attr("src", "XtButton.html?type=addXtButton&Code=" + code + '&v=' + version);
    $('#modal-22256').trigger("click");
}
//修改
function updateFunMenu(rowData) {
    $('#url').css('height', '300px');
    $("#url").attr("src", "FunMenuForm.htm?type=updateFunMenu&id=" + rowData.id + '&v=' + version);
    $('#modal-22256').trigger("click");
}
//删除
function deleteFunMenu(rowData) {
    ymPrompt.succeedInfo("是否要删除信息？", null, null, '提示信息', function (mes) {
        if (mes == "ok") {
            var url = "RemoteHandlers/FunMenuControl.ashx?type=deleteFunMenu&id=" + rowData.id;
            $.ajax({
                type: "POST",
                url: url,
                async: false,
                cache: false,
                success: function (result) {
                    if (result == "1") {
                        ymPrompt.errorInfo("删除成功", null, null, '提示信息', function () {
                            myGrid.flexReload();
                            myTree.reAsyncChildNodes(null, "refresh");
                            document.getElementById('close').click();
                        });
                    }
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
    var url = "RemoteHandlers/FunMenuControl.ashx?type=grid&id=" + id;
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
            url: "RemoteHandlers/FunMenuControl.ashx?type=" + type + "&id=" + id,
            type: 'POST',
            success: function (result) {
                if (result == "1") {
                    ymPrompt.succeedInfo("数据保存成功！", null, null, '提示信息', function () {
                        parent.myGrid.flexReload();
                        parent.myTree.reAsyncChildNodes(null, "refresh");
                        parent.document.getElementById('close').click();
                    });
                }
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

function removeClass(val) {
    if (val.value.replace(/^ +| +$/g, '') == '') {
        $("#div" + val.id).addClass("control-group error");
    } else {
        $("#div" + val.id).removeClass();
    }
}
/***********************表单结束*******************/