
var option; //表格内容

function loadFlexiGrid(code, treeType) {
    var _h = $(window).height() - 200;
    var _PageNum = parseInt(_h / 25);
    option = {
        url: '',
        dataType: 'json',
        colModel: [
                            { display: '用户名', name: 'USER_NAME', width: 80, sortable: true, align: 'center' },
                            { display: '功能模块', name: 'MODULE_NAME', width: 80, sortable: true, align: 'center' },
                            { display: '客户端IP', name: 'CLIENT_IP', width: 80, sortable: true, align: 'center' },
                            { display: '详细信息', name: 'DETAIL', width: 500, sortable: false,  align: 'center' },
                            { display: '发生时间', name: 'LOG_TIME', width: 180, sortable: false, align: 'center' },
                            { display: '操作结果', name: 'IS_SUCCEED', width: 80, sortable: true, align: 'center' },
                            { display: '日志类型', name: 'OPERATION_NAME', width: 80, sortable: true, align: 'center' },
                            { display: 'id', name: 'id', width: 80, sortable: false, hide: true, pk: true, align: 'center' }
                            ],
        usepager: true,
        title: '日志列表',
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
    var USER_NAME = $('#USER_NAME').val();
    var CLIENT_IP = $('#CLIENT_IP').val();
    var OPERATION_NAME = $('#OPERATION_NAME').val();
    var START_TIME = $('#START_TIME').val();
    var END_TIME = $('#END_TIME').val();
    var IS_SUCCEED = $('#IS_SUCCEED').val();
    var CZinfo = $("#CZinfo").val();
    var ModuleFunction = $('#ModuleFunction').val();
    option.url = 'RemoteHandlers/SysLogControl.ashx?USER_NAME=' + escape(USER_NAME) + '&CLIENT_IP=' + escape(CLIENT_IP) + '&START_TIME=' + escape(START_TIME) + '&END_TIME=' + escape(END_TIME) + '&OPERATION_NAME=' + escape(OPERATION_NAME) + '&IS_SUCCEED=' + escape(IS_SUCCEED) + '&CZinfo=' + escape(CZinfo) + '&ModuleFunction=' + escape(ModuleFunction);
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