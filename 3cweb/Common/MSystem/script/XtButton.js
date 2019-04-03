
var option; //表格内容

function loadFlexiGrid(code, treeType) {
    option = {
        url: 'RemoteHandlers/XtButtonControl.ashx?type=list&Code=' + GetQueryString("Code"),
        dataType: 'json',
        colModel: [
                            { display: '按钮CODE', name: 'XT_BUTTON_CODE', width: 80, sortable: true, align: 'center' },
                            { display: '菜单CODE', name: 'XT_MEM_CODE', width: 80, sortable: true, align: 'center' },
                            { display: '按钮名称', name: 'XT_BUTTON_NAME', width: 80, sortable: true, align: 'center' },
                            { display: '按钮标签ID', name: 'XT_BUTTON_OBJ_ID', width: 180, sortable: false, align: 'center' },
                            { display: '按钮类型', name: 'XT_BUTTON_TYPE', width: 500, sortable: false, align: 'center' },
                            { display: '后台请求方法', name: 'XT_REQ_METHOD', width: 180, sortable: false, align: 'center' },
                            { display: '备注', name: 'XT_MEMO', width: 80, sortable: true, align: 'center' },
                            { display: 'id', name: 'id', width: 80, sortable: false, hide: true, pk: true, align: 'center' }
        ],
        usepager: true,
        title: '按钮列表',
        pagestat: '显示第 {from} 条到 {to} 条,共 {total} 条数据', // 显示当前页和总页面的样式
        procmsg: '正在处理,请稍候 ...', // 正在处理的提示信息
        nomsg: '没有数据存在!', // 无结果的提示信息
        pagetext: '当前第',
        outof: '页，总页数',
        findtext: '条件查询：',
        useRp: true,
        checkbox: false, // 是否要多选框
        rowId: 'id', // 多选框绑定行的id
        rp: 30,
        showTableToggleBtn: true,
        width: 'auto',
        height: window.screen.height / 2 + 20,
        title: false, //是否包含标题 
        resizable: false, //是否可伸缩 
        striped: true //是否显示斑纹效果，默认是奇偶交互的形式
    }
    $("#flexTable").flexigrid(option);
}

//查询方法
function doQuery() {
    var USER_NAME = $('#USER_NAME').val();
    var CLIENT_IP = $('#CLIENT_IP').val();
    var OPERATION_NAME = $('#OPERATION_NAME').val();
    var START_TIME = $('#START_TIME').val();
    var END_TIME = $('#END_TIME').val();
    var IS_SUCCEED = $('#IS_SUCCEED').val();
    var OPERATION_NAME = $('#OPERATION_NAME').val();
    option.url = 'RemoteHandlers/SysLogControl.ashx?USER_NAME=' + escape(USER_NAME) + '&CLIENT_IP=' + escape(CLIENT_IP) + '&START_TIME=' + escape(START_TIME) + '&END_TIME=' + escape(END_TIME) + '&OPERATION_NAME=' + escape(OPERATION_NAME) + '&IS_SUCCEED=' + escape(IS_SUCCEED);
    option.newp = 1;
    $("#flexTable").flexOptions(option).flexReload();

}

function removeClass(val) {
    if (val.value.replace(/^ +| +$/g, '') == '') {
        $("#div" + val.id).addClass("control-group error");
    }
    if (val.value.replace(/^ +| +$/g, '') != '')
    { $("#div" + val.id).removeClass(); }
}


function Add() {
    var code = GetQueryString("Code");
    var XT_BUTTON_NAME = $('#XT_BUTTON_NAME').val();
    var XT_BUTTON_OBJ_ID = $('#XT_BUTTON_OBJ_ID').val();
    var XT_REQ_METHOD = $('#XT_REQ_METHOD').val();
    var XT_MEMO = $('#XT_MEMO').val();
    var XT_BUTTON_TYPE = $('#XT_BUTTON_TYPE').val();

    var options = {
        url: "RemoteHandlers/XtButtonControl.ashx?type=add&Code=" + code,
        type: 'POST',
        success: function (result) {
            if (result == "1") {
                ymPrompt.succeedInfo('添加成功', null, null, '提示信息', function () {
                    $("#flexTable").flexReload();
                });
            }
            
            else {
                ymPrompt.errorInfo('添加失败', null, null, '提示信息', null);
            }
        }
    };
    $('#defaultForm').ajaxSubmit(options);

}