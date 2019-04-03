/*========================================================================================*
* 功能说明：任务、任务跟踪列表JS
* 注意事项：
* 作    者： wcg
* 版本日期：2013年11月5日
* 变更说明：
* 版 本 号： V1.0
*=======================================================================================*/
//加载缺陷任务列表
$(function () {
//点击title刷新
    //$('.nav-tabs a').click(function () {
    //        show_pop();
    //});
    var jbJson = GetSeverityJson();//获取级别
    var jsHtml = "";
    for (var i = 0; i < jbJson.length; i++) {
        jsHtml += "<option value='" + jbJson[i].code + "'>" + jbJson[i].name + "</option>";
    } 
    if (jsHtml) {
        $("#jb").html(jsHtml);
    }
    $("#jb").multiselect({
        //header: false,
        noneSelectedText: "全部",
        checkAllText: "全选",
        uncheckAllText: '全不选',
        selectedList: 3,
        height: 100,
        //wherePlace: 'up'

    });
    $("#jb").siblings().css("text-align-last", "auto");
})
var option_db;
var option_url;
var option_db_todo;
var option_url_todo;
var option_db_his;
var option_url_his;
var option_db_send;
var option_url_send;
var option_db_lower;
var option_url_lower;
var url_ex;
function loadTaskFlexiGrid() {
    buttonControl(); //控制按钮状态
    var dataType = GetQueryString("dataType");
    loadToDoTaskFlexiGrid('toDoTask', dataType);
    mySelftaskFlexTable('mySelfTask', dataType);
    histaskFlexTable('hisTask', dataType);
    sendTaskFlexTable('sendTask', dataType);
    lowerTaskFlexTable('lowerTask', dataType);
};
function loadMrtaTaskFlexiGrid() {
    buttonControl(); //控制按钮状态
    var dataType = GetQueryString("dataType");
    var taskJson = GetTaskList('toDoTask', dataType);
    return taskJson;
};
function loadMrtaXGTaskFlexiGrid() {
    buttonControl(); //控制按钮状态
    var dataType = GetQueryString("dataType");
    var taskJson = GetTaskList('mySelfTask', dataType);
    return taskJson;
};
function loadMrtaLSTaskFlexiGrid() {
    buttonControl(); //控制按钮状态
    var dataType = GetQueryString("dataType");
    var taskJson = GetTaskList('hisTask', dataType);
    return taskJson;
};
function loadMrtaCSTaskFlexiGrid() {
    buttonControl(); //控制按钮状态
    var dataType = GetQueryString("dataType");
    var taskJson = GetTaskList('sendTask', dataType);
    return taskJson;
};
//加载统计任务列表
function loadTjTaskFlexiGrid() {
    var dataType = GetQueryString("dataType");
    loadToDoTaskFlexiGrid('toDoTjTask', dataType);
    mySelftaskFlexTable('mySelfTjTask', dataType);
    histaskFlexTable('hisTjTask', dataType);
    sendTaskFlexTable('sendTjTask', dataType);
    lowerTaskFlexTable('lowerTask', dataType);
};
var setshow; //定时器
////开启定时器
//function RefsetInterval() {

//    $("#Colse").css("display", "");
//    $("#Open").css("display", "none");
//    var showtime = 5000; //提示时间
//    setshow = setInterval('show_pop()', showtime);
//};
////关闭定时器
//function AgainRefsetInterval() {

//    $("#Colse").css("display", "none");
//    $("#Open").css("display", "");
//    clearInterval(setshow); //关闭定时器
//};
//执行刷新
function show_pop() {
    //   loadTaskFlexiGrid();

    option_db.url = option_url + URL_add() + "&r=" + Math.random();
    option_db.newp = 1;
    option_db_todo.url = option_url_todo + URL_add() + "&r=" + Math.random();
    option_db_todo.newp = 1;
    option_db_his.url = option_url_his + URL_add() + "&r=" + Math.random();
    option_db_his.newp= 1;
    option_db_send.url = option_url_send + URL_add() + "&r=" + Math.random();
    option_db_send.newp = 1;
    option_db_lower.url = option_url_lower + URL_add() + "&r=" + Math.random();
    option_db_lower.newp = 1;
    $("#toDotaskFlexTable").flexigrid(option_db);
    $("#toDotaskFlexTable").flexOptions(option_db).flexReload();
    $("#mySelftaskFlexTable").flexigrid(option_db_todo);
    $("#mySelftaskFlexTable").flexOptions(option_db_todo).flexReload();
    $("#histaskFlexTable").flexigrid(option_db_his);
    $("#histaskFlexTable").flexOptions(option_db_his).flexReload();
    $("#sendTaskFlexTable").flexigrid(option_db_send);
    $("#sendTaskFlexTable").flexOptions(option_db_send).flexReload();
    $("#lowerTaskFlexTable").flexigrid(option_db_lower);
    $("#lowerTaskFlexTable").flexOptions(option_db_lower).flexReload();
};

//待办任务
function loadToDoTaskFlexiGrid(type, dataType) {
    option_url = 'RemoteHandlers/TaskList.ashx?type=' + type + '&dataType=' + dataType;

    option_db = {
        url: option_url + URL_add(),
        dataType: 'json',
        colModel: [
                            { display: '操作', name: 'CZ', width: 161, sortable: false, align: 'center' },
			                { display: '数据来源', name: 'DATATYPE', width: 60, sortable: false, align: 'left', hide: true },
                            { display: '任务编号', name: 'TASK_CODE', width: 120, sortable: false, align: 'left' },
                            { display: '任务描述', name: 'TASK_DESCRIPT', width: 350, sortable: false, align: 'center' },
                            { display: '等级', name: 'SEVERITY', width: 56, sortable: false, align: 'center' },
                            { display: '截止日期', name: 'DEADLINE', width: 130, sortable: false, align: 'center' },
                            { display: '状态', name: 'STATUS', width: 50, sortable: false, align: 'center' },
                            { display: '接收机构', name: 'RECV_DEPTNAME', width: 100, sortable: false, hide: true, align: 'left' },
			                { display: '接收人', name: 'RECEIVERNAME', width: 80, sortable: false, hide: true, align: 'left' },
                            { display: '派发机构', name: 'DISPOSE_DEPTNAME', width: 100, sortable: false, align: 'left' },
			                { display: '派发人', name: 'DISPOSERNAME', width: 80, sortable: false, align: 'left' },
                            { display: '派发时间', name: 'DISPOSE_TIME', width: 130, sortable: false, align: 'left' },
                            { display: '发起机构', name: 'SPONSOR_DEPTNAME', width: 80, sortable: false, align: 'left' },
			                { display: '发起人', name: 'SPONSORNAME', width: 80, sortable: false, align: 'left' },
			                { display: '发起时间', name: 'SPONSOR_TIME', width: 130, sortable: false, align: 'left' },
                            { display: '复测工作票', name: 'CHECK_TICKET', width: 130, sortable: false, align: 'left' },
                            { display: '复测人', name: 'CHECEKRNAME', width: 130, sortable: false, align: 'left' },
                            { display: '复测时间', name: 'CHECK_TIME', width: 130, sortable: false, align: 'left' },
                            { display: '处理工作票', name: 'DEAL_TICKET', width: 130, sortable: false, align: 'left' },
                            { display: '处理人', name: 'DEALERNAME', width: 130, sortable: false, align: 'left' },
                            { display: '处理时间', name: 'DEAL_TIME', width: 130, sortable: false, align: 'left' },
                            { display: '检测类型', name: 'CATEGORY_CODE', width: 60, sortable: false, align: 'center' },
                            { display: '缺陷主键', name: 'FAULTID', width: 300, sortable: false, hide: true, align: 'center' },
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
        rp: parseInt(($(window).height() - 180) / 35),
        rpOptions: [parseInt(($(window).height() - 180) / 35),  25, 30, 40],
        showTableToggleBtn: true,
        width: 'auto',
        title: false, //是否包含标题 
        height: $(window).height() - 300,
        resizable: false, //是否可伸缩 
        striped: true, //是否显示斑纹效果，默认是奇偶交互的形式
        onSuccess: function () {
            setTaskColorMarkingByTaskStatus('#toDotaskFlexTable', 6); // 根据任务状态设置任务颜色标识
        }
    };
    $("#toDotaskFlexTable").flexigrid(option_db);
};

function GetTaskList(type, dataType) {
    var url = 'RemoteHandlers/TaskList.ashx?type=' + type + '&dataType=' + dataType;
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
};
//相关任务
function mySelftaskFlexTable(type, dataType) {
    option_url_todo = 'RemoteHandlers/TaskList.ashx?type=' + type + '&dataType=' + dataType;
    option_db_todo = {
        url: option_url_todo + URL_add(),
        dataType: 'json',
        colModel: [
                            { display: '操作', name: 'CZ', width: 161, sortable: false, align: 'center' },
			                { display: '数据来源', name: 'DATATYPE', width: 80, sortable: false, align: 'left',hide: true  },
                            { display: '任务编号', name: 'TASK_CODE', width: 120, sortable: false, align: 'left' },
                            { display: '任务描述', name: 'TASK_DESCRIPT', width: 330, sortable: false, align: 'center' },
                            { display: '等级', name: 'SEVERITY', width: 80, sortable: false, align: 'center' },
                            { display: '截止日期', name: 'DEADLINE', width: 120, sortable: false, align: 'center' },
                            { display: '状态', name: 'STATUS', width: 100, sortable: false, align: 'center' },
                            { display: '状态更新时间', name: 'STATUS_TIME', width: 120, sortable: false, align: 'left' },
                            { display: '接收机构', name: 'RECV_DEPTNAME', width: 100, sortable: false, hide: true, align: 'left' },
			                { display: '接收人', name: 'RECEIVERNAME', width: 80, sortable: false, hide: true, align: 'left' },
                            { display: '派发机构', name: 'DISPOSE_DEPTNAME', width: 100, sortable: false, align: 'left' },
                            { display: '派发时间', name: 'DISPOSE_TIME', width: 120, sortable: false, hide: true, align: 'left' },
                            { display: '发起机构', name: 'SPONSOR_DEPTNAME', width: 100, sortable: false, align: 'left' },
			                { display: '发起人', name: 'SPONSORNAME', width: 80, sortable: false, align: 'left' },
			                { display: '发起时间', name: 'SPONSOR_TIME', width: 120, sortable: false, align: 'left' },
                            { display: '复测工作票', name: 'CHECK_TICKET', width: 130, sortable: false, align: 'left' },
                            { display: '复测人', name: 'CHECEKRNAME', width: 130, sortable: false, align: 'left' },
                            { display: '复测时间', name: 'CHECK_TIME', width: 130, sortable: false, align: 'left' },
                            { display: '处理工作票', name: 'DEAL_TICKET', width: 130, sortable: false, align: 'left' },
                            { display: '处理人', name: 'DEALERNAME', width: 130, sortable: false, align: 'left' },
                            { display: '处理时间', name: 'DEAL_TIME', width: 130, sortable: false, align: 'left' },
                            { display: '缺陷类型', name: 'CATEGORY_CODE', width: 80, sortable: false, align: 'center' },
                            { display: '缺陷主键', name: 'FAULTID', width: 300, sortable: false, hide: true, align: 'center' },
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
        rp: parseInt(($(window).height() - 180) / 35),
        rpOptions: [parseInt(($(window).height() - 180) / 35), 25, 30, 40],
        showTableToggleBtn: true,
        width: 'auto',
        height: $(window).height() - 300,
        title: false, //是否包含标题 
        resizable: false, //是否可伸缩 
        striped: true, //是否显示斑纹效果，默认是奇偶交互的形式
        onSuccess: function () {
            setTaskColorMarkingByTaskStatus('#mySelftaskFlexTable', 6); // 根据任务状态设置任务颜色标识
        }
    };
    $("#mySelftaskFlexTable").flexigrid(option_db_todo);
};
//历史任务
function histaskFlexTable(type, dataType) {
    option_url_his = 'RemoteHandlers/TaskList.ashx?type=' + type + '&dataType=' + dataType;
    option_db_his = {
        url: option_url_his + URL_add(),
        dataType: 'json',
        colModel: [
                            { display: '操作', name: 'CZ', width: 161, sortable: false, align: 'center' },
			                { display: '数据来源', name: 'DATATYPE', width: 80, sortable: false, align: 'left' ,hide:true},
                            { display: '任务编号', name: 'TASK_CODE', width: 120, sortable: false, align: 'left' },
                            { display: '任务描述', name: 'TASK_DESCRIPT', width: 550, sortable: false, align: 'center' },
                            { display: '等级', name: 'SEVERITY', width: 80, sortable: false, align: 'center' },
                            { display: '截止日期', name: 'DEADLINE', width: 120, sortable: false, align: 'center' },
                            { display: '状态', name: 'STATUS', width: 100, sortable: false, align: 'center' },
                            { display: '状态更新时间', name: 'STATUS_TIME', width: 120, sortable: false, align: 'left' },
                            { display: '派发机构', name: 'DISPOSE_DEPTNAME', width: 100, sortable: false, hide: true, align: 'left' },
                            { display: '接收机构', name: 'RECV_DEPTNAME', width: 100, sortable: false, hide: true, align: 'left' },
			                { display: '接收人', name: 'RECEIVERNAME', width: 80, sortable: false, hide: true, align: 'left' },
                            { display: '派发时间', name: 'DISPOSE_TIME', width: 120, sortable: false, hide: true, align: 'left' },
                            { display: '发起机构', name: 'SPONSOR_DEPTNAME', width: 100, sortable: false, align: 'left' },
			                { display: '发起人', name: 'SPONSORNAME', width: 80, sortable: false, align: 'left' },
			                { display: '发起时间', name: 'SPONSOR_TIME', width: 120, sortable: false, align: 'left' },
                            { display: '复测工作票', name: 'CHECK_TICKET', width: 130, sortable: false, align: 'left' },
                            { display: '复测人', name: 'CHECEKRNAME', width: 130, sortable: false, align: 'left' },
                            { display: '复测时间', name: 'CHECK_TIME', width: 130, sortable: false, align: 'left' },
                            { display: '处理工作票', name: 'DEAL_TICKET', width: 130, sortable: false, align: 'left' },
                            { display: '处理人', name: 'DEALERNAME', width: 130, sortable: false, align: 'left' },
                            { display: '处理时间', name: 'DEAL_TIME', width: 130, sortable: false, align: 'left' },
                            { display: '缺陷类型', name: 'CATEGORY_CODE', width: 80, sortable: false, align: 'center' },
                            { display: '缺陷主键', name: 'FAULTID', width: 300, sortable: false, hide: true, align: 'center' },
			                { display: '主键', name: 'ID', width: 80, sortable: false, pk: true, hide: true, align: 'center' },
			                { display: '类型', name: 'C4Type', width: 80, sortable: false, pk: true, hide: true, align: 'center' }
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
        title: false, //是否包含标题 
        rp: parseInt(($(window).height() - 180) / 35),
        rpOptions: [parseInt(($(window).height() - 180) / 35), 25, 30, 40],
        showTableToggleBtn: true,
        width: 'auto',
        height: $(window).height() - 300,
        resizable: false, //是否可伸缩 
        striped: true, //是否显示斑纹效果，默认是奇偶交互的形式
        onSuccess: function () {
            setTaskColorMarkingByTaskStatus('#histaskFlexTable', 6); // 根据任务状态设置任务颜色标识
        }
    };
    $("#histaskFlexTable").flexigrid(option_db_his);
};
//加载抄送任务信息
function sendTaskFlexTable(type, dataType) {
    option_url_send = 'RemoteHandlers/TaskList.ashx?type=' + type + '&dataType=' + dataType;
    option_db_send = {
        url: option_url_send + URL_add(),
        dataType: 'json',
        colModel: [
                            { display: '操作', name: 'CZ', width: 161, sortable: false, align: 'center' },
			                { display: '数据来源', name: 'DATATYPE', width: 80, sortable: false, align: 'left', hide: true },
                            { display: '任务编号', name: 'TASK_CODE', width: 120, sortable: false, align: 'left' },
                            { display: '任务描述', name: 'TASK_DESCRIPT', width: 550, sortable: false, align: 'center' },
                            { display: '等级', name: 'SEVERITY', width: 80, sortable: false, align: 'center' },
                            { display: '截止日期', name: 'DEADLINE', width: 120, sortable: false, align: 'center' },
                            { display: '状态', name: 'STATUS', width: 100, sortable: false, align: 'center' },
                            { display: '状态更新时间', name: 'STATUS_TIME', width: 120, sortable: false, align: 'left' },
                            { display: '派发机构', name: 'DISPOSE_DEPTNAME', width: 100, sortable: false, hide: true, align: 'left' },
                            { display: '接收机构', name: 'RECV_DEPTNAME', width: 100, sortable: false, hide: true, align: 'left' },
			                { display: '接收人', name: 'RECEIVERNAME', width: 80, sortable: false, hide: true, align: 'left' },
                            { display: '派发时间', name: 'DISPOSE_TIME', width: 120, sortable: false, hide: true, align: 'left' },
                            { display: '发起机构', name: 'SPONSOR_DEPTNAME', width: 100, sortable: false, align: 'left' },
			                { display: '发起人', name: 'SPONSORNAME', width: 80, sortable: false, align: 'left' },
			                { display: '发起时间', name: 'SPONSOR_TIME', width: 120, sortable: false, align: 'left' },
                            { display: '复测工作票', name: 'CHECK_TICKET', width: 130, sortable: false, align: 'left' },
                            { display: '复测人', name: 'CHECEKRNAME', width: 130, sortable: false, align: 'left' },
                            { display: '复测时间', name: 'CHECK_TIME', width: 130, sortable: false, align: 'left' },
                            { display: '处理工作票', name: 'DEAL_TICKET', width: 130, sortable: false, align: 'left' },
                            { display: '处理人', name: 'DEALERNAME', width: 130, sortable: false, align: 'left' },
                            { display: '处理时间', name: 'DEAL_TIME', width: 130, sortable: false, align: 'left' },
                            { display: '缺陷类型', name: 'CATEGORY_CODE', width: 80, sortable: false, align: 'center' },
                            { display: '缺陷主键', name: 'FAULTID', width: 300, sortable: false, hide: true, align: 'center' },
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
        rp: parseInt(($(window).height() - 180) / 35),
        rpOptions: [parseInt(($(window).height() - 180) / 35), 25, 30, 40],
        showTableToggleBtn: true,
        width: 'auto',
        height: $(window).height() - 300,
        title: false, //是否包含标题 
        resizable: false, //是否可伸缩 
        striped: true, //是否显示斑纹效果，默认是奇偶交互的形式
        onSuccess: function () {
            setTaskColorMarkingByTaskStatus('#sendTaskFlexTable', 6); // 根据任务状态设置任务颜色标识
        }
    };
    $("#sendTaskFlexTable").flexigrid(option_db_send);
};
//加载下级任务信息
function lowerTaskFlexTable(type, dataType) {
    option_url_lower = 'RemoteHandlers/TaskList.ashx?type=' + type + '&dataType=' + dataType;
    option_db_lower = {
        url: option_url_lower + URL_add(),
        dataType: 'json',
        colModel: [
                            { display: '操作', name: 'CZ', width: 161, sortable: false, align: 'center' },
			                { display: '数据来源', name: 'DATATYPE', width: 80, sortable: false, align: 'left', hide: true },
                            { display: '任务编号', name: 'TASK_CODE', width: 120, sortable: false, align: 'left' },
                            { display: '任务描述', name: 'TASK_DESCRIPT', width: 330, sortable: false, align: 'center' },
                            { display: '等级', name: 'SEVERITY', width: 80, sortable: false, align: 'center' },
                            { display: '截止日期', name: 'DEADLINE', width: 120, sortable: false, align: 'center' },
                            { display: '状态', name: 'STATUS', width: 100, sortable: false, align: 'center' },
                            { display: '状态更新时间', name: 'STATUS_TIME', width: 120, sortable: false, align: 'left' },
                            { display: '接收机构', name: 'RECV_DEPTNAME', width: 100, sortable: false, hide: true, align: 'left' },
			                { display: '接收人', name: 'RECEIVERNAME', width: 80, sortable: false, hide: true, align: 'left' },
                            { display: '派发机构', name: 'DISPOSE_DEPTNAME', width: 100, sortable: false, align: 'left' },
                            { display: '派发时间', name: 'DISPOSE_TIME', width: 120, sortable: false, hide: true, align: 'left' },
                            { display: '发起机构', name: 'SPONSOR_DEPTNAME', width: 100, sortable: false, align: 'left' },
			                { display: '发起人', name: 'SPONSORNAME', width: 80, sortable: false, align: 'left' },
			                { display: '发起时间', name: 'SPONSOR_TIME', width: 120, sortable: false, align: 'left' },
                            { display: '复测工作票', name: 'CHECK_TICKET', width: 130, sortable: false, align: 'left' },
                            { display: '复测人', name: 'CHECEKRNAME', width: 130, sortable: false, align: 'left' },
                            { display: '复测时间', name: 'CHECK_TIME', width: 130, sortable: false, align: 'left' },
                            { display: '处理工作票', name: 'DEAL_TICKET', width: 130, sortable: false, align: 'left' },
                            { display: '处理人', name: 'DEALERNAME', width: 130, sortable: false, align: 'left' },
                            { display: '处理时间', name: 'DEAL_TIME', width: 130, sortable: false, align: 'left' },
                            { display: '缺陷类型', name: 'CATEGORY_CODE', width: 80, sortable: false, align: 'center' },
                            { display: '缺陷主键', name: 'FAULTID', width: 300, sortable: false, hide: true, align: 'center' },
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
        rp: parseInt(($(window).height() - 180) / 35),
        rpOptions: [parseInt(($(window).height() - 180) / 35), 25, 30, 40],
        showTableToggleBtn: true,
        width: 'auto',
        height: $(window).height() - 300,
        title: false, //是否包含标题 
        resizable: false, //是否可伸缩 
        striped: true, //是否显示斑纹效果，默认是奇偶交互的形式
        onSuccess: function () {
            setTaskColorMarkingByTaskStatus('#lowerTaskFlexTable', 6); // 根据任务状态设置任务颜色标识
        }
    };
    $("#lowerTaskFlexTable").flexigrid(option_db_lower);
};
//加载缺陷任务轨迹列表
function loadTaskTracFlexiGrid() {
    var option = {
        url: 'RemoteHandlers/TaskList.ashx?type=taskTracgrid&id=' + GetQueryString("id"),
        dataType: 'json',
        colModel: [
                            //{ display: '派发机构', name: 'DISPOSE_DEPTNAME', width: 100, sortable: false, align: 'left' },
			                //{ display: '处理人', name: 'DISPOSERNAME', width: 150, sortable: false, align: 'left' },
			                //{ display: '派发时间', name: 'DISPOSE_TIME', width: 120, sortable: false, align: 'left' },
                             { display: '处理机构', name: 'DEAL_DEPTNAME', width: 100, sortable: false, align: 'left' },

			                { display: '处理人', name: 'DEALERNAME', width: 80, sortable: false, align: 'left' },
			                { display: '操作时间', name: 'DEAL_TIME', width: 120, sortable: false, align: 'left' },
			                { display: '状态', name: 'STATUS', width: 120, sortable: false, align: 'left' },
			                { display: '相关文件', name: 'SOURCE', width: 300, sortable: false, align: 'left' },
                            { display: '处理情况', name: 'DEAL_DESCRIPT', width: 100, sortable: false, align: 'left' },
                            { display: '处理结果', name: 'DEAL_RESULT', width: 120, sortable: false, align: 'left' },
			                { display: '意见', name: 'PROPOSAL', width: 300, sortable: false, align: 'left' },
			                { display: '主键', name: 'ID', width: 80, sortable: false, pk: true, hide: true, align: 'center' }
                            ],
        usepager: true,
        useRp: true,
        checkbox: false, // 是否要多选框
        rowId: 'ID', // 多选框绑定行的id
        rp: (parseInt(($(this).height()) / 70)) < 7 ? 7 : parseInt(($(this).height()) / 70),
        rpOptions: [(parseInt(($(this).height()) / 70)) < 7 ? 7 : parseInt(($(this).height()) / 70), 25, 30, 40],
        width: 'auto',
        height: (($(this).height() < 440 )? 220 : ($(this).height() / 2)),
        striped: true, //是否显示斑纹效果，默认是奇偶交互的形式
        onSuccess: function () {
            $('#big-img').dblclick(function () { //隐藏全屏图片
                $(this).addClass('hide');
            });
            $('#tasktracflexTable tr .source-pic').dblclick(function () { //显示全屏图片
                $('#big-img').css({
                    //'width': $(window).width(),
                    //'height': $(window).height()
                    'left': $(window).width()/4
                }).removeClass('hide');
                loadImg($('#big-img'), $(this).attr('src'));
            });
        }
    };
    $("#tasktracflexTable").flexigrid(option);
    misTaskTracMap();
};
//加载任务轨迹图形
function misTaskTracMap() {
    var url = "RemoteHandlers/TaskList.ashx?type=taskTracgrid&id=" + GetQueryString("id");
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        cache: false,
        success: function (result) {
            var json = eval('(' + result + ')');
            var tracHtml = "&nbsp;&nbsp;&nbsp;&nbsp;";
            tracHtml += "<input value='" + json.title + "' style=\"width: 120px; height: 60px; left: 0px;top: 20px; background-color: #F1F1F1;\" title=\"发起者\" class=\"btn-round\" type=\"button\" />";
            for (var i = 0; i < json.rows.length; i++) {
                if (i == json.rows.length - 1) {
                    tracHtml += "<img  title=\"" + json.rows[i].STATUS + "\"  src=\"/Common/img/344.png\"  style=\"width: 60px; height: 20px;\"  />";
                    tracHtml += "<input value=\"" + json.rows[i].DEAL_DEPTNAME + "\"  title=\"点击查看抄送部门\" onfocus=\"true\" style=\"width: 120px; height: 60px; left: 0px;top: 20px; background-color: #f60e35;\"  class=\"btn-round\" type=\"button\" />";
                } else {
                    tracHtml += "<img  title=\"" + json.rows[i].STATUS + "\"  src=\"/Common/img/344.png\"  style=\"width: 60px; height: 20px;\"  />";
                    tracHtml += "<input value=\"" + json.rows[i].DEAL_DEPTNAME + "\"  title=\"点击查看抄送部门\" onfocus=\"true\" style=\"width: 120px; height: 60px; left: 0px;top: 20px; background-color:#6fbae8;\"  class=\"btn-round\" type=\"button\" />";
                    
                }
            }

            document.getElementById("misTaskTracMap").innerHTML = tracHtml;

        }
    });
};
//抄送部门信息展示
function onclickMisSend(sendNames) {
    if ("" == sendNames) {
        ymPrompt.alert("没有抄送部门", null, null, '提示信息', null);
    } else {
        document.getElementById('modal-container-Send').style.display = "";
        document.getElementById("modal-body").innerHTML = sendNames;
    }

};
//删除缺陷任务列表
function deleteMisTask(rowData) {
    if (confirm('确认要删除这条记录吗?')) {
        var url = "RemoteHandlers/TaskList.ashx?type=deleteMisTask&id=" + rowData[1].id;
        $.ajax({
            type: "POST",
            url: url,
            async: false,
            cache: false,
            success: function (result) {
                ymPrompt.succeedInfo(result, null, null, '提示信息', function (mes) { if (mes == "ok") { location.reload(); } });
            }
        });
    }
};
//弹出关联缺陷信息 to do：根据缺陷类型打开相应的缺陷详情页面
function openDataTypeUrl(rowData) {
    var id = $(rowData).find('.faultid').html().replace("&nbsp;", "");
    var type = $(rowData).find('.category').html().replace("&nbsp;", "");

    toAlarmDetails(type, id);
};
//弹出待办任务处理信息
function openMisTask(rowData) {
    if (rowData != undefined) {
        if (rowData.length != undefined && rowData.length > 0) {
            document.getElementById('url').src = "../MTask/TaskForm.htm?id=" + rowData[0].id + "&type=openMisTask" + "&v=" + version;
        } else {
            document.getElementById('url').src = "../MTask/TaskForm.htm?id=" + rowData.id + "&type=openMisTask" + "&v=" + version;
        }
    } else {
        document.getElementById('url').src = "../MTask/TaskForm.htm?id=&type=addTask" + "&v=" + version;
    }
    document.getElementById('modal-22256').click();
    $('#modal-container-22256').css({
        width: $(this).width() - 40,
        height: $(this).height() - 20,
        'margin-left': function () {
            return -($(this).width() / 2);
        },
        'margin-top': function () {
            return -($(this).height() / 2);
        }
    });
    $('#url').height($(this).height() - 50);
    $(document).find('#btnDiv').hide();
};
//弹出相关任务详情
function openSelfMisTask(rowData) {
    if (rowData != undefined) {
        if (rowData.length != undefined && rowData.length > 0) {
            document.getElementById('url').src = "../MTask/TaskForm.htm?id=" + rowData[0].id + "&type=openSelfMisTask" + "&v=" + version;
        } else {
            document.getElementById('url').src = "../MTask/TaskForm.htm?id=" + rowData.id + "&type=openSelfMisTask" + "&v=" + version;
        }
    }
    document.getElementById('modal-22256').click();
    $('#modal-container-22256').css({
        width: $(this).width() - 40,
        height: $(this).height() - 20,
        'margin-left': function () {
            return -($(this).width() / 2);
        },
        'margin-top': function () {
            return -($(this).height() / 2);
        }
    });
    $('#url').height($(this).height() - 50);
    $(document).find('#btnDiv').hide();
};
//加载缺陷任务轨迹信息
function openMisTaskTrac(rowData) {
    if (rowData != undefined) {
        if (rowData.length != undefined && rowData.length > 0) {
            document.getElementById('url').src = "../MTask/TaskTracList.htm?id=" + rowData[rowData.length - 1].id + "&type=taskTracgrid" + "&v=" + version;
        } else {
            document.getElementById('url').src = "../MTask/TaskTracList.htm?id=" + rowData.id + "&type=taskTracgrid" + "&v=" + version;
        }
        document.getElementById('modal-22256').click();
        $('#modal-container-22256').css({
            width: $(this).width() - 40,
            height: $(this).height() / 1.5,
            'margin-left': function () {
                return -($(this).width() / 2);
            },
            'margin-top': function () {
                return -($(this).height() / 2);
            }
        });
        $(document).find('#btnDiv').show();
        document.getElementById("btnDiv").innerHTML = " <button id='close' aria-hidden='true' class='btn btn-primary' data-dismiss='modal'>关闭</button>";
        
        $('#url').height($('#modal-container-22256').height() - 50);
    }
};
//查阅任务
function lookMisTask(rowData) {
    if (rowData != undefined) {
        if (rowData.length != undefined && rowData.length > 0) {
            document.getElementById('url').src = "../MTask/TaskForm.htm?id=" + rowData[rowData.length - 1].id + "&type=lookTask" + "&v=" + version;
        } else {
            document.getElementById('url').src = "../MTask/TaskForm.htm?id=" + rowData.id + "&type=lookTask" + "&v=" + version;
        }
        document.getElementById('modal-22256').click();

        $('#modal-container-22256').css({
            width: $(this).width() - 40,
            height: $(this).height() - 20,
            'margin-left': function () {
                return -($(this).width() / 2);
            },
            'margin-top': function () {
                return -($(this).height() / 2);
            }
        });
        $('#url').height($(this).height() - 50);
    }
};
//弹出检修复核
function openFaultFh(rowData) {
    var url = "";
    if (rowData != undefined) {
        url = "/6C/PC/MFault/maintenanceReview.html?alarmid=" + $('div', rowData)[22].innerHTML.replace("&nbsp;", "") + "&cateGoryName=" + $('div', rowData)[21].innerHTML.replace("&nbsp;", "");
    }
    window.open(url, "_blank");
};
//绑定操作按钮
function bindBtnDiv(btn) {
    document.getElementById("btnDiv").innerHTML = btn;
};

//关闭抄送信息
function closeSend() {
    document.getElementById('modal-container-Send').style.display = "none";
};

//查询条件

function URL_add() {
    var Review_ticket_1 = $("#Review_ticket_1").val();  //复测票据号
    var Review_ticket_2 = $("#Review_ticket_2").val();  //复测票据号

    var Handle_ticket_1 = $("#Handle_ticket_1").val();  //处理票据号
    var Handle_ticket_2 = $("#Handle_ticket_2").val();  //处理票据号

    var Review_startime = $("#Review_startime").val();  //复核时间
    var Review_endtime = $("#Review_endtime").val();  //复核时间
    var Handle_startime = $("#Handle_startime").val();  //处理时间
    var Handle_endtime = $("#Handle_endtime").val();  //处理时间
    var Reviewer = $("#Reviewer").val();  //复核人
    var HandlePerson = $("#HandlePerson").val(); //处理人
    var obj = document.getElementById('jb'); //级别
    var jb = getSelectedItem(obj);  //级别
    var ddllx = document.getElementById('dll_lx').value; //数据类型

    url_ex = '&Review_ticket_1=' + Review_ticket_1
           + '&Review_ticket_2=' + Review_ticket_2
           + '&Handle_ticket_1=' + Handle_ticket_1
           + '&Handle_ticket_2=' + Handle_ticket_2
           + '&Review_startime=' + Review_startime
           + '&Review_endtime=' + Review_endtime
           + '&Handle_startime=' + Handle_startime
           + '&Handle_endtime=' + Handle_endtime
           + '&Reviewer=' + Reviewer
           + '&HandlePerson=' + HandlePerson
           + '&jb=' + jb
           + '&ddllx=' + ddllx;

    return url_ex;
};

//获取选中项
function getSelectedItem(obj) {
    var slct = "";
    if (obj != '' && obj != undefined) {
        for (var i = 0; i < obj.options.length; i++)
            if (obj.options[i].selected == true) {
                slct += obj.options[i].value;
            }
    }
    return slct;
};

// 根据任务状态设置任务颜色标识
function setTaskColorMarkingByTaskStatus(tableId, tdIndex) {
    var taskTable_tr = $(tableId + ' tr');
    var _task_retest = '复';
    var _task_complete = '完成';
    var _task_cancel = '取消';
    for (var i = 0; i < taskTable_tr.length; i++) {
        var statusName = $(taskTable_tr[i]).find('td:eq(' + tdIndex + ') div').html();
        if (statusName.indexOf(_task_retest) >= 0) {
            $(taskTable_tr[i]).addClass('task_retest');
        }
        if (_task_complete === statusName) {
            $(taskTable_tr[i]).addClass('task_complete');
        }
        if (_task_cancel === statusName) {
            $(taskTable_tr[i]).addClass('task_cancel');
        }
    }
}
