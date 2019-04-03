/*========================================================================================*
* 功能说明：任务、任务跟踪列表JS
* 注意事项：
* 作    者： wcg
* 版本日期：2013年11月5日
* 变更说明：
* 版 本 号： V1.0
*=======================================================================================*/
//加载缺陷任务列表

var option_db
var option_url;
function loadTaskFlexiGrid() {
    buttonControl(); //控制按钮状态
    var dataType = GetQueryString("dataType");
    loadToDoTaskFlexiGrid('toDoTask', dataType);
    mySelftaskFlexTable('mySelfTask', dataType);
    histaskFlexTable('hisTask', dataType);
    sendTaskFlexTable('sendTask', dataType);
}
function loadMrtaTaskFlexiGrid() {
    buttonControl(); //控制按钮状态
    var dataType = GetQueryString("dataType");
    var taskJson = GetTaskList('toDoTask', dataType);
    return taskJson;
}
function loadMrtaXGTaskFlexiGrid() {
    buttonControl(); //控制按钮状态
    var dataType = GetQueryString("dataType");
    var taskJson = GetTaskList('mySelfTask', dataType);
    return taskJson;
}
function loadMrtaLSTaskFlexiGrid() {
    buttonControl(); //控制按钮状态
    var dataType = GetQueryString("dataType");
    var taskJson = GetTaskList('hisTask', dataType);
    return taskJson;
}
function loadMrtaCSTaskFlexiGrid() {
    buttonControl(); //控制按钮状态
    var dataType = GetQueryString("dataType");
    var taskJson = GetTaskList('sendTask', dataType);
    return taskJson;
}
//加载统计任务列表
function loadTjTaskFlexiGrid() {
    var dataType = GetQueryString("dataType");
    loadToDoTaskFlexiGrid('toDoTjTask', dataType);
    mySelftaskFlexTable('mySelfTjTask', dataType);
    histaskFlexTable('hisTjTask', dataType);
    sendTaskFlexTable('sendTjTask', dataType);
}
var setshow; //定时器
//开启定时器
function RefsetInterval() {

    $("#Colse").css("display", "");
    $("#Open").css("display", "none");
    var showtime = 5000; //提示时间
    setshow = setInterval('show_pop()', showtime);
}
//关闭定时器
function AgainRefsetInterval() {

    $("#Colse").css("display", "none");
    $("#Open").css("display", "");
    clearInterval(setshow); //关闭定时器
}
//执行刷新
function show_pop() {
    //   loadTaskFlexiGrid();
    if (option_db != undefined) {
        option_db.url = option_url + "&r=" + Math.random();
        option_db.newp = 1;
        $("#toDotaskFlexTable").flexigrid(option_db);
        $("#toDotaskFlexTable").flexOptions(option_db).flexReload();
    }
}

//待办任务
function loadToDoTaskFlexiGrid(type, dataType) {
    option_url = 'RemoteHandlers/TaskList.ashx?type=' + type + '&dataType=' + dataType;

    option_db = {
        url: 'RemoteHandlers/TaskList.ashx?type=' + type + '&dataType=' + dataType,
        dataType: 'json',
        colModel: [
                            { display: '任务编号', name: 'TASK_CODE', width: 100, sortable: false, align: 'left' },
                            { display: '任务描述', name: 'TASK_DESCRIPT', width: 150, sortable: false, align: 'center' },
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
			                { display: '数据来源', name: 'DATATYPE', width: 60, sortable: false, align: 'left' },
                            { display: '缺陷类型', name: 'CATEGORY_CODE', width: 60, sortable: false, align: 'center' },
                            { display: '操作', name: 'CZ', width: 120, sortable: false, align: 'center' },
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
        showTableToggleBtn: true,
        width: 'auto',
        height: $(window).height() - 180,
        title: false, //是否包含标题 
        resizable: false, //是否可伸缩 
        striped: true //是否显示斑纹效果，默认是奇偶交互的形式
    }
    $("#toDotaskFlexTable").flexigrid(option_db);
}

function GetTaskList(type, dataType) {
    var url = 'RemoteHandlers/TaskList.ashx?type=' + type + '&dataType=' + dataType;
    var json;
    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        async: true,
        cache: true,
        success: function (result) {
            json = result;
            if (type == "toDoTask")
                GetDBTaskList(json);
            if (type == "mySelfTask")
                GetXGTaskList(json);
            if (type == "hisTask")
                GetLSTaskList(json);
            if (type == "sendTask")
                GetCSTaskList(json);
        }
    });
    return json;
};
//相关任务
function mySelftaskFlexTable(type, dataType) {
    var option = {
        url: 'RemoteHandlers/TaskList.ashx?type=' + type + '&dataType=' + dataType,
        dataType: 'json',
        colModel: [
                            { display: '任务编号', name: 'TASK_CODE', width: 100, sortable: false, align: 'left' },
                            { display: '任务描述', name: 'TASK_DESCRIPT', width: 130, sortable: false, align: 'center' },
                            { display: '等级', name: 'SEVERITY', width: 80, sortable: false, align: 'center' },
                            { display: '截止日期', name: 'DEADLINE', width: 120, sortable: false, align: 'center' },
                            { display: '状态', name: 'STATUS', width: 100, sortable: false, align: 'center' },
                            { display: '状态更新时间', name: 'STATUS_ITME', width: 120, sortable: false, align: 'left' },
                            { display: '接收机构', name: 'RECV_DEPTNAME', width: 100, sortable: false, hide: true, align: 'left' },
			                { display: '接收人', name: 'RECEIVERNAME', width: 80, sortable: false, hide: true, align: 'left' },
                            { display: '派发机构', name: 'DISPOSE_DEPTNAME', width: 100, sortable: false, align: 'left' },
                            { display: '派发时间', name: 'DISPOSE_TIME', width: 120, sortable: false, hide: true, align: 'left' },
                            { display: '发起机构', name: 'SPONSOR_DEPTNAME', width: 100, sortable: false, align: 'left' },
			                { display: '发起人', name: 'SPONSORNAME', width: 80, sortable: false, align: 'left' },
			                { display: '发起时间', name: 'SPONSOR_TIME', width: 120, sortable: false, align: 'left' },
			                { display: '数据来源', name: 'DATATYPE', width: 80, sortable: false, align: 'left' },
                            { display: '缺陷类型', name: 'CATEGORY_CODE', width: 80, sortable: false, align: 'center' },
                            { display: '操作', name: 'CZ', width: 120, sortable: false, align: 'center' },
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
        showTableToggleBtn: true,
        width: 'auto',
        height: $(window).height() - 180,
        title: false, //是否包含标题 
        resizable: false, //是否可伸缩 
        striped: true //是否显示斑纹效果，默认是奇偶交互的形式
    }
    $("#mySelftaskFlexTable").flexigrid(option);
}
//历史任务
function histaskFlexTable(type, dataType) {
    var option = {
        url: 'RemoteHandlers/TaskList.ashx?type=' + type + '&dataType=' + dataType,
        dataType: 'json',
        colModel: [
                            { display: '任务编号', name: 'TASK_CODE', width: 100, sortable: false, align: 'left' },
                            { display: '任务描述', name: 'TASK_DESCRIPT', width: 250, sortable: false, align: 'center' },
                            { display: '等级', name: 'SEVERITY', width: 80, sortable: false, align: 'center' },
                            { display: '截止日期', name: 'DEADLINE', width: 120, sortable: false, align: 'center' },
                            { display: '状态', name: 'STATUS', width: 100, sortable: false, align: 'center' },
                            { display: '状态更新时间', name: 'STATUS_ITME', width: 120, sortable: false, align: 'left' },
                            { display: '派发机构', name: 'DISPOSE_DEPTNAME', width: 100, sortable: false, hide: true, align: 'left' },
                            { display: '接收机构', name: 'RECV_DEPTNAME', width: 100, sortable: false, hide: true, align: 'left' },
			                { display: '接收人', name: 'RECEIVERNAME', width: 80, sortable: false, hide: true, align: 'left' },
                            { display: '派发时间', name: 'DISPOSE_TIME', width: 120, sortable: false, hide: true, align: 'left' },
                            { display: '发起机构', name: 'SPONSOR_DEPTNAME', width: 100, sortable: false, align: 'left' },
			                { display: '发起人', name: 'SPONSORNAME', width: 80, sortable: false, align: 'left' },
			                { display: '发起时间', name: 'SPONSOR_TIME', width: 120, sortable: false, align: 'left' },
			                { display: '数据来源', name: 'DATATYPE', width: 80, sortable: false, align: 'left' },
                            { display: '缺陷类型', name: 'CATEGORY_CODE', width: 80, sortable: false, align: 'center' },
                            { display: '操作', name: 'CZ', width: 120, sortable: false, align: 'center' },
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
        showTableToggleBtn: true,
        width: 'auto',
        height: $(window).height() - 180,
        title: false, //是否包含标题 
        resizable: false, //是否可伸缩 
        striped: true //是否显示斑纹效果，默认是奇偶交互的形式
    }
    $("#histaskFlexTable").flexigrid(option);
}
//加载抄送任务信息
function sendTaskFlexTable(type, dataType) {
    var option = {
        url: 'RemoteHandlers/TaskList.ashx?type=' + type + '&dataType=' + dataType,
        dataType: 'json',
        colModel: [
                            { display: '任务编号', name: 'TASK_CODE', width: 100, sortable: false, align: 'left' },
                            { display: '任务描述', name: 'TASK_DESCRIPT', width: 250, sortable: false, align: 'center' },
                            { display: '等级', name: 'SEVERITY', width: 80, sortable: false, align: 'center' },
                            { display: '截止日期', name: 'DEADLINE', width: 120, sortable: false, align: 'center' },
                            { display: '状态', name: 'STATUS', width: 100, sortable: false, align: 'center' },
                            { display: '状态更新时间', name: 'STATUS_ITME', width: 120, sortable: false, align: 'left' },
                            { display: '派发机构', name: 'DISPOSE_DEPTNAME', width: 100, sortable: false, hide: true, align: 'left' },
                            { display: '接收机构', name: 'RECV_DEPTNAME', width: 100, sortable: false, hide: true, align: 'left' },
			                { display: '接收人', name: 'RECEIVERNAME', width: 80, sortable: false, hide: true, align: 'left' },
                            { display: '派发时间', name: 'DISPOSE_TIME', width: 120, sortable: false, hide: true, align: 'left' },
                            { display: '发起机构', name: 'SPONSOR_DEPTNAME', width: 100, sortable: false, align: 'left' },
			                { display: '发起人', name: 'SPONSORNAME', width: 80, sortable: false, align: 'left' },
			                { display: '发起时间', name: 'SPONSOR_TIME', width: 120, sortable: false, align: 'left' },
			                { display: '数据来源', name: 'DATATYPE', width: 80, sortable: false, align: 'left' },
                            { display: '缺陷类型', name: 'CATEGORY_CODE', width: 80, sortable: false, align: 'center' },
                            { display: '操作', name: 'CZ', width: 120, sortable: false, align: 'center' },
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
        showTableToggleBtn: true,
        width: 'auto',
        height: $(window).height() - 180,
        title: false, //是否包含标题 
        resizable: false, //是否可伸缩 
        striped: true //是否显示斑纹效果，默认是奇偶交互的形式
    }
    $("#sendTaskFlexTable").flexigrid(option);
}
//加载缺陷任务轨迹列表
function loadTaskTracFlexiGrid() {
    var option = {
        url: 'RemoteHandlers/TaskList.ashx?type=taskTracgrid&id=' + GetQueryString("id"),
        dataType: 'json',
        colModel: [
                            { display: '处理机构', name: 'DEAL_DEPTNAME', width: 100, sortable: false, align: 'left' },
			                { display: '处理人', name: 'DEALERNAME', width: 80, sortable: false, align: 'left' },
                            { display: '处理结果', name: 'DEAL_RESULT', width: 120, sortable: false, align: 'left' },

                            { display: '处理描述', name: 'DEAL_DESCRIPT', width: 100, sortable: false, align: 'left' },
			                { display: '处理时间', name: 'DEAL_TIME', width: 120, sortable: false, align: 'left' },
                            { display: '派发机构', name: 'DISPOSE_DEPTNAME', width: 100, sortable: false, align: 'left' },
			                { display: '派发人', name: 'DISPOSERNAME', width: 80, sortable: false, align: 'left' },
			                { display: '派发时间', name: 'DISPOSE_TIME', width: 120, sortable: false, align: 'left' },
			                { display: '状态', name: 'STATUS', width: 380, sortable: false, align: 'left' },
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
        rp: 10,
        showTableToggleBtn: true,
        width: 'auto',
        height: 550,
        title: false, //是否包含标题 
        resizable: false, //是否可伸缩 
        striped: true //是否显示斑纹效果，默认是奇偶交互的形式
    }
    $("#tasktracflexTable").flexigrid(option);
    misTaskTracMap();
}
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
            for (var i = 0; i < json.rows.length; i++) {
                if (i == json.rows.length - 1) {
                    tracHtml += "<input value=\"" + json.rows[i].DEAL_DEPTNAME + "\" onclick=\"onclickMisSend('" + json.rows[i].SENDNAMES + "')\"  title=\"点击查看抄送部门\" onfocus=\"true\" style=\"width: 120px; height: 60px; left: 0px;top: 20px; background-color: #f60e35;\"  class=\"btn-round\" type=\"button\" />";
                } else {
                    tracHtml += "<input value=\"" + json.rows[i].DEAL_DEPTNAME + "\" onclick=\"onclickMisSend('" + json.rows[i].SENDNAMES + "')\" title=\"点击查看抄送部门\" onfocus=\"true\" style=\"width: 120px; height: 60px; left: 0px;top: 20px; background-color:#6fbae8;\"  class=\"btn-round\" type=\"button\" />";
                    tracHtml += "<img  title=\"" + json.rows[i + 1].STATUS + "\"  src=\"/Common/img/344.png\"  style=\"width: 60px; height: 20px;\"  />";
                }
            }

            document.getElementById("misTaskTracMap").innerHTML = tracHtml;

        }
    });
}
//抄送部门信息展示
function onclickMisSend(sendNames) {
    if ("" == sendNames) {
        ymPrompt.alert("没有抄送部门", null, null, '提示信息', null);
    } else {
        document.getElementById('modal-container-Send').style.display = "";
        // document.getElementById('modal-Send').click();
        document.getElementById("modal-body").innerHTML = sendNames;
    }

}
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
}
//弹出关联缺陷信息 to do：根据缺陷类型打开相应的缺陷详情页面
function openDataTypeUrl(rowData) {
    var url = "";
    if (GetDataType() != "DPC") {
        switch ($('div', rowData)[14].innerHTML.replace("&nbsp;", "")) {
            case "1C":
                url = "/C1/PC/MAlarmMonitoring/MonitorAlarmC1Form.htm?alarmid=" + $('div', rowData)[16].innerHTML.replace("&nbsp;", "") + "";
                break;
            case "2C":
                url = "/C2/PC/Fault/MonitorAlarmC2Form.htm?alarmid=" + $('div', rowData)[16].innerHTML.replace("&nbsp;", "") + "";
                break;
            case "3C":
                url = "/C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=" + $('div', rowData)[16].innerHTML.replace("&nbsp;", "") + "";
                break;
            case "4C":
                url = "/C4/PC/Fault/MonitorAlarmC4Form.htm?alarmid=" + $('div', rowData)[16].innerHTML.replace("&nbsp;", "") + "";
                break;
            case "5C":
                break;
            case "6C":
                url = "/6C/PC/MAlarmMonitoring/MonitorAlarmC6Form6C.htm?alarmid=" + $('div', rowData)[16].innerHTML.replace("&nbsp;", "") + "";
                break;
            default:
        }
    }
    else if (GetDataType() == "DPC") {
        switch ($('div', rowData)[14].innerHTML.replace("&nbsp;", "")) {
            case "1C":
                url = "/6C/PC/MAlarmMonitoring/MonitorAlarm1CForm6C.htm?alarmid=" + $('div', rowData)[16].innerHTML.replace("&nbsp;", "") + "";
                break;
            case "2C":
                url = "/6C/PC/MAlarmMonitoring/MonitorAlarmC2Form6C.htm?alarmid=" + $('div', rowData)[16].innerHTML.replace("&nbsp;", "") + "";
                break;
            case "3C":
                url = "/6C/PC/MAlarmMonitoring/MonitorAlarm3CForm6C.htm?alarmid=" + $('div', rowData)[16].innerHTML.replace("&nbsp;", "") + "";
                break;
            case "4C":
                url = "/6C/PC/MAlarmMonitoring/MonitorAlarmC4Form6C?alarmid=" + $('div', rowData)[16].innerHTML.replace("&nbsp;", "") + "";
                break;
            case "5C":
                break;
            case "6C":
                break;
            default:
        }
    }
    //var url = "../Monitor/MonitorAlarm" + $('div', rowData)[14].innerHTML.replace("&nbsp;", "") + "FormNew.htm?alarmid=" + $('div', rowData)[16].innerHTML.replace("&nbsp;", "") + "";
    //    var url = "../../../C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=" + $('div', rowData)[16].innerHTML.replace("&nbsp;", "") + "";
    window.open(url + '&v=' + version, "_blank");
    // window.open(url, 'newwindow', 'height=' + window.screen.height + ', width=' + window.screen.width + ',top=10,left=10,toolbar=no,scrollbars=yes,menubar=no,resizable=no,status=no,location=no');
}
//弹出待办任务处理信息
function openMisTask(rowData) {
    if (rowData != undefined) {
        if (rowData.length != undefined && rowData.length > 0) {
            document.getElementById('url').src = "../MTask/TaskForm.htm?id=" + rowData[0].id + "&type=openMisTask&v=" + version;
        } else {
            document.getElementById('url').src = "../MTask/TaskForm.htm?id=" + rowData.id + "&type=openMisTask&v=" + version;
        }
    } else {
        document.getElementById('url').src = "../MTask/TaskForm.htm?id=&type=addTask&v=" + version;
    }
    document.getElementById('modal-22256').click();
}
//弹出相关任务详情
function openSelfMisTask(rowData) {
    if (rowData != undefined) {
        if (rowData.length != undefined && rowData.length > 0) {
            document.getElementById('url').src = "../MTask/TaskForm.htm?id=" + rowData[0].id + "&type=openSelfMisTask&v=" + version;
        } else {
            document.getElementById('url').src = "../MTask/TaskForm.htm?id=" + rowData.id + "&type=openSelfMisTask&v=" + version;
        }
    }
    document.getElementById('modal-22256').click();
}
//加载缺陷任务轨迹信息
function openMisTaskTrac(rowData) {
    if (rowData != undefined) {
        if (rowData.length != undefined && rowData.length > 0) {
            document.getElementById('url').src = "../MTask/TaskTracList.htm?id=" + rowData[rowData.length - 1].id + "&type=taskTracgrid&v=" + version;
        } else {
            document.getElementById('url').src = "../MTask/TaskTracList.htm?id=" + rowData.id + "&type=taskTracgrid&v=" + version;
        }
        document.getElementById('modal-22256').click();
        document.getElementById("btnDiv").innerHTML = " <button id='close' aria-hidden='true' class='btn btn-primary' data-dismiss='modal'>关闭</button>";
    }
}
//查阅任务
function lookMisTask(rowData) {
    if (rowData != undefined) {
        if (rowData.length != undefined && rowData.length > 0) {
            document.getElementById('url').src = "../MTask/TaskForm.htm?id=" + rowData[rowData.length - 1].id + "&type=lookTask&v=" + version;
        } else {
            document.getElementById('url').src = "../MTask/TaskForm.htm?id=" + rowData.id + "&type=lookTask&v=" + version;
        }
        document.getElementById('modal-22256').click();
    }
}
//弹出检修复核
function openFaultFh(rowData) {
    var url = "";
    if (rowData != undefined) {
        url = "../../6C/PC/MFault/FHForm.htm?alarmid=" + $('div', rowData)[16].innerHTML.replace("&nbsp;", "") + "&type=" + $('div', rowData)[14].innerHTML.replace("&nbsp;", "");
    }
    window.open(url + '&v=' + version, "_blank");
}
//绑定操作按钮
function bindBtnDiv(btn) {
    document.getElementById("btnDiv").innerHTML = btn;
}

//关闭抄送信息
function closeSend() {
    document.getElementById('modal-container-Send').style.display = "none";
};