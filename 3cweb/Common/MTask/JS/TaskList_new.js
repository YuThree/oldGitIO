/*========================================================================================*
 * 任务列表页js
/*========================================================================================*/

var index = 1;
var pageSize = 18;
var pageIndex = 1;
var _w = $(window).width();
var _h = $(window).height();
var dataType = GetQueryString('dataType');

$(() => {
    var H = $(window).height() - 35;
    $(".mian").height(H);
    //来自综合分析页面  的设置
    if (GetQueryString('fromzh') == 'yes') {
        $("#waitFor_START_RAISED_TIME").val((dateyearbeforeStr() + " 00:00:00")) //开始检测时间
        $("#waitFor_END_RAISED_TIME").val((dateNowStr() + "23:59:59"))//结束检测时间
    }
   
    var jbJson = GetSeverityJson();//获取级别
    var jsHtml = "";
    for (var i = 0; i < jbJson.length; i++) {
        jsHtml += "<option value='" + jbJson[i].code + "'>" + jbJson[i].name + "</option>";
    }
    if (jsHtml) {
        $("#waitFor_SEVERITY_CODE").html(jsHtml);
        $("#my_SEVERITY_CODE").html(jsHtml);
        $("#allTask_SEVERITY_CODE").html(jsHtml);
    }
    $("#waitFor_SEVERITY_CODE").multiselect({
        noneSelectedText: "全部",
        checkAllText: "全选",
        uncheckAllText: '全不选',
        selectedList: 3,
        height: 100
    });
    $("#my_SEVERITY_CODE").multiselect({
        noneSelectedText: "全部",
        checkAllText: "全选",
        uncheckAllText: '全不选',
        selectedList: 3,
        height: 100
    });
    $("#allTask_SEVERITY_CODE").multiselect({
        noneSelectedText: "全部",
        checkAllText: "全选",
        uncheckAllText: '全不选',
        selectedList: 3,
        height: 100
    });

    //去掉非3C的缺陷级别的三级
    //setTimeout(function () {
    //    var dataType = GetQueryString('dataType');
    //    switch (dataType) {
    //        case '3C':
    //            break;
    //        default:
    //            var typeNum = dataType.split('C')[0];
    //            removeLevelThree('waitFor_SEVERITY_CODE', typeNum);
    //            removeLevelThree('my_SEVERITY_CODE', typeNum);
    //            removeLevelThree('allTask_SEVERITY_CODE', typeNum);
    //            break;
    //    }
    //}, 800);

    //$("#allTask_STATUS").multiselect({
    //    noneSelectedText: "==请选择==",
    //    checkAllText: "全选",
    //    uncheckAllText: '全不选',
    //    selectedList: 3
    //});

    $('#waitFor_LINE_CODE').mySelect({
        tag: 'LINE'
    });
    $('#my_LINE_CODE').mySelect({
        tag: 'LINE'
    });
    $('#allTask_LINE_CODE').mySelect({
        tag: 'LINE'
    });

    //绑定检测类型
    $("#waitFor_CATEGORY_CODE").mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: 'DPC',
        p_code: "DET_TYPE",
        cateGory: 'DET_TYPE',
        enableFilter: false,
        onClick: function (event, treeId, treeNode) {
            $("#waitFor_CATEGORY_CODE").attr('code', treeNode.id).val(treeNode.name);
        }
    });
    //绑定检测类型
    $("#my_CATEGORY_CODE").mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: 'DPC',
        p_code: "DET_TYPE",
        cateGory: 'DET_TYPE',
        enableFilter: false,
        onClick: function (event, treeId, treeNode) {
            $("#my_CATEGORY_CODE").attr('code', treeNode.id).val(treeNode.name);
        }
    });
    //绑定检测类型
    $("#allTask_CATEGORY_CODE").mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: 'DPC',
        p_code: "DET_TYPE",
        cateGory: 'DET_TYPE',
        enableFilter: false,
        onClick: function (event, treeId, treeNode) {
            $("#allTask_CATEGORY_CODE").attr('code', treeNode.id).val(treeNode.name);
        }
    });

    if ('' !== dataType) {
        $('#my_CATEGORY_CODE').val(dataType).attr({ 'disabled': 'true', 'code': dataType }).next().remove();
        $('#waitFor_CATEGORY_CODE').val(dataType).attr({ 'disabled': 'true', 'code': dataType }).next().remove();
        $('#allTask_CATEGORY_CODE').val(dataType).attr({ 'disabled': 'true', 'code': dataType }).next().remove();
    }
    //绑定行别
    $("#waitFor_DIRECTION").mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: '3C',
        cateGory: 'DRTFLG',
        enableFilter: false,
        onClick: function (event, treeId, treeNode) {
            $("#waitFor_DIRECTION").attr('code', treeNode.id).val(treeNode.name);
        }
    });

    //绑定行别
    $("#my_DIRECTION").mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: '3C',
        cateGory: 'DRTFLG',
        enableFilter: false,
        onClick: function (event, treeId, treeNode) {
            $("#my_DIRECTION").attr('code', treeNode.id).val(treeNode.name);
        }
    });

    //绑定行别
    $("#allTask_DIRECTION").mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: '3C',
        cateGory: 'DRTFLG',
        enableFilter: false,
        onClick: function (event, treeId, treeNode) {
            $("#allTask_DIRECTION").attr('code', treeNode.id).val(treeNode.name);
        }
    });

    //组织机构
    var jsonUser = getCurUser();
    $('#allTask_RECV_DEPT').mySelectTree({
        tag: 'ORGANIZATION',
        type: jsonUser.orgcode,
        height: 200,
        onClick: function (event, treeId, treeNode) {
            $("#hf_RECV_DEPT").val(treeNode.id);
            $("#allTask_RECV_DEPT").val(treeNode.name);
            $("#hf_type_RECV_DEPT").val(treeNode.treeType);
        }
    });
    $("#allTask_RECV_DEPT").siblings("a").click(function () {
        $("#hf_RECV_DEPT").val("");
    });

    //分辨率适应
    if (_w < 1601) {
        $("#waitFor_SEVERITY_CODE,#my_SEVERITY_CODE,#allTask_SEVERITY_CODE,#my_STATUS,#allTask_STATUS,#waitFor_STATUS").css("width", "96px");
        $("#my_START_KM_MARK,#my_END_KM_MARK,#allTask_START_KM_MARK,#allTask_END_KM_MARK").css("width", "52px");
        $("#waitFor_SEVERITY_CODE,#my_SEVERITY_CODE,#allTask_SEVERITY_CODE").siblings("button").css("width", "98px");
        pageSize = 16;
    };
    if (_w < 1441) {
        $("#waitFor_SEVERITY_CODE,#my_SEVERITY_CODE,#allTask_SEVERITY_CODE,#my_STATUS,#allTask_STATUS,#waitFor_STATUS").css("width", "100px");
        $("#my_START_KM_MARK,#my_END_KM_MARK,#allTask_START_KM_MARK,#allTask_END_KM_MARK").css("width", "56px");
        $("#waitFor_SEVERITY_CODE,#my_SEVERITY_CODE,#allTask_SEVERITY_CODE").siblings("button").css("width", "102px");
        pageSize = 13;
    };
    if (_w < 1367) {
        $("#waitFor_SEVERITY_CODE,#my_SEVERITY_CODE,#allTask_SEVERITY_CODE,#my_STATUS,#allTask_STATUS,#waitFor_STATUS").css("width", "76px");
        $("#my_START_KM_MARK,#my_END_KM_MARK,#allTask_START_KM_MARK,#allTask_END_KM_MARK").css("width", "42px");
        $("#waitFor_SEVERITY_CODE,#my_SEVERITY_CODE,#allTask_SEVERITY_CODE").siblings("button").css("width", "78px");
        pageSize = 12;
    };
    if (_w < 1241) {
        pageSize = 9;
    }
    $(".aside>ul>li").click(function () {
        $(this).siblings().removeClass("active");
        $(this).addClass("active");

        if ($(this).hasClass("waitFor")) {
            $(".waitFor>img").attr("src", "img/waitFor_hover.png");
            $(".my>img").attr("src", "img/my.png");
            $(".allTask>img").attr("src", "img/allTask.png");
            load_waitFor();
        }
        if ($(this).hasClass("my")) {
            $(".waitFor>img").attr("src", "img/waitFor.png");
            $(".my>img").attr("src", "img/my_hover.png");
            $(".allTask>img").attr("src", "img/allTask.png");
            load_my();
        }
        if ($(this).hasClass("allTask")) {
            $(".waitFor>img").attr("src", "img/waitFor.png");
            $(".my>img").attr("src", "img/my.png");
            $(".allTask>img").attr("src", "img/allTask_hover.png");
            load_allTask();
        }
    });
    //来自综合分析页面右下角  的设置
    if (GetQueryString('fromzhright') == 'yes') {
        //$('.aside li').removeClass('active');
        //$('.aside .allTask').addClass('active');
        $("#allTask_START_RAISED_TIME").val((dateyearbeforeStr() + " 00:00:00")) //开始检测时间
        $("#allTask_END_RAISED_TIME").val((dateNowStr() + "23:59:59"))//结束检测时间
        $("#hf_RECV_DEPT").val(GetQueryString('orgcode'))
        $("#allTask_RECV_DEPT").val(GetQueryString('orgname'))
        if (GetQueryString('tasktype')=='完成') {
            $("#allTask_STATUS").val('完成')
        }
        $('.allTask').click();
        $(".waitFor_title").hide();
        $(".my_title").hide();
        $(".allTask_title").show();
        load_allTask();
    } else {
        load_waitFor();
    }
    //setTimeout("load_waitFor()", 500);
    
});


//加载待办任务
function load_waitFor() {
    $(".waitFor_title").show();
    $(".my_title").hide();
    $(".allTask_title").hide();

    //获取参数

    var waitFor_TASK_CODE = $("#waitFor_TASK_CODE").val();  //整改通知书号
    var obj = document.getElementById('waitFor_SEVERITY_CODE'); //等级
    var waitFor_SEVERITY_CODE = getSelectedItem(obj);
    var waitFor_CATEGORY_CODE = $("#waitFor_CATEGORY_CODE").attr("code");  //检测类型
    if (waitFor_CATEGORY_CODE == undefined) {
        waitFor_CATEGORY_CODE = '';
    }
    var waitFor_START_RAISED_TIME = $("#waitFor_START_RAISED_TIME").val();  //开始检测时间
    var waitFor_END_RAISED_TIME = $("#waitFor_END_RAISED_TIME").val();  //结束检测时间
    if (!checktime(waitFor_START_RAISED_TIME, waitFor_END_RAISED_TIME, '#waitFor_START_RAISED_TIME', '#waitFor_END_RAISED_TIME')) {
        return;
    }
    var waitFor_STATUS = $("#waitFor_STATUS").val();  //状态
    if (waitFor_STATUS == "0") {
        waitFor_STATUS = "";
    }
    var waitFor_LINE_CODE = $("#waitFor_LINE_CODE").val();  //线路
    if (waitFor_LINE_CODE == "0") {
        waitFor_LINE_CODE = "";
    }
    var waitFor_POSITION_CODE = $("#waitFor_POSITION_CODE").val();  //区站
    if (waitFor_POSITION_CODE == "0") {
        waitFor_POSITION_CODE = "";
    }
    var waitFor_DIRECTION = $("#waitFor_DIRECTION").val();  //行别
    var waitFor_START_KM_MARK = $("#waitFor_START_KM_MARK").val();  //开始公里标
    var waitFor_END_KM_MARK = $("#waitFor_END_KM_MARK").val();  //结束公里标

    layer.load();
    $('#content_page').paging({
        index: 1,
        url: function () {
            pageIndex = $('#content_page .pageValue').val();
            var _url = '/Common/MTask/RemoteHandlers/TaskList_NEW.ashx?type=toDoTask'
                    + '&TASK_CODE=' + waitFor_TASK_CODE
                    + '&SEVERITY_CODE=' + waitFor_SEVERITY_CODE
                    + '&CATEGORY_CODE=' + waitFor_CATEGORY_CODE
                    + '&START_RAISED_TIME=' + waitFor_START_RAISED_TIME
                    + '&END_RAISED_TIME=' + waitFor_END_RAISED_TIME
                    + '&STATUS=' + waitFor_STATUS
                    + '&LINE_CODE=' + waitFor_LINE_CODE
                    + '&POSITION_CODE=' + waitFor_POSITION_CODE
                    + '&DIRECTION=' + waitFor_DIRECTION
                    + '&START_KM_MARK=' + waitFor_START_KM_MARK
                    + '&END_KM_MARK=' + waitFor_END_KM_MARK
                    + '&PAGESIZE=' + (pageSize+1)
                    + '&PAGEINDEX=' + pageIndex;
            return _url
        },
        success: function (data) {
            layer.closeAll('loading');

            $("#ReceiveOrg").hide();
            $("#DEAL_TICKET").hide();
            $("#DEALER").hide();
            $("#DEAL_TIME").hide();

            var _JSON = data;
            if (_JSON.data.length > 0) {

                var Html = '';
                for (var i = 0; i < _JSON.data.length; i++) {
                   
                    var Feedback = "";
                    var status_color = "nocolor";
                    if (_JSON.data[i].TSTATUS == "完成" || _JSON.data[i].TSTATUS == "取消") {
                        Feedback = '<img src="img/Feedback.png" width="16" height="18" title="查看整治反馈单" onclick=downloadFeedback("' + _JSON.data[i].TID + '") />';
                    };
                    if (_JSON.data[i].TSTATUS == "复测") {
                        status_color = "redcolor";
                    } else if (_JSON.data[i].TSTATUS == "完成") {
                        status_color = "greencolor";
                    } else if (_JSON.data[i].TSTATUS == "取消") {
                        status_color = "bluecolor";
                    } else {
                        status_color = "nocolor";
                    };

                    Html += '<div class="table_li ' + status_color + '" ondblclick=jumpHandle("' + _JSON.data[i].TID + '","待处理","' + _JSON.data[i].ALARM_ID + '","openMisTask")><span class="width1"><span class="label btn_save collect" title="查看图片"><i class="icon icon-image icon-white"></i></span></span><span class="width2_1"><img src="img/taskTodo.png" width="16" height="16" title="处理任务" onclick=jumpHandle("' + _JSON.data[i].TID + '","待处理","' + _JSON.data[i].ALARM_ID + '","openMisTask") /><img src="img/bugInfo.png" width="16" height="16" title="查看缺陷详情" onclick=jumpalarminfo("' + _JSON.data[i].ALARM_ID + '","' + _JSON.data[i].CATEGORY_CODE + '","' + _JSON.data[i].C4Type + '") /><img src="img/notice.png" width="16" height="18" title="查看整改通知书" onclick=downloadnotice("' + _JSON.data[i].TID + '") />' + Feedback + '</span><span class="width3">' + _JSON.data[i].TASK_CODE + '</span><span class="width2">' + _JSON.data[i].SEVERITY_NAME + '</span><span class="width3">' + _JSON.data[i].RAISED_TIME + '</span><span class="width4" title="' + _JSON.data[i].WZ + '&nbsp;&nbsp;' + _JSON.data[i].CODE_NAME + '">' + _JSON.data[i].WZ + '&nbsp;&nbsp;' + _JSON.data[i].CODE_NAME + '</span><span class="width4_1" title="' + _JSON.data[i].PROPOSAL + '">' + _JSON.data[i].PROPOSAL + '</span><span class="width2">' + _JSON.data[i].TSTATUS + '</span><span class="width2">' + _JSON.data[i].CATEGORY + '</span><span class="width3">' + _JSON.data[i].DEADLINE + '</span><span class="width3">' + _JSON.data[i].CHECK_TICKET + '</span><span class="width3">' + _JSON.data[i].CHECEKRNAME + '</span><span class="width3">' + _JSON.data[i].CHECK_TIME + '</span></div>'
                }
                document.getElementById("table_main").innerHTML = Html;

                $("#table_main>div.table_li").hover(function () {
                    $(this).children().css("background-color", "#ccc");
                }, function () {
                    $(this).children().css("background-color", "");
                });

                showImg(_JSON);

                
            } else {
                document.getElementById("table_main").innerHTML = "<p>无数据</p>"; //清空内容
            }
        }
    });
};

//加载我办过的
function load_my() {
    $(".waitFor_title").hide();
    $(".my_title").show();
    $(".allTask_title").hide();

    //获取参数

    var my_TASK_CODE = $("#my_TASK_CODE").val();  //整改通知书号
    var my_CHECK_TICKET_1 = $("#my_CHECK_TICKET_1").val();  //复测工作票1
    var my_CHECK_TICKET_2 = $("#my_CHECK_TICKET_2").val();  //复测工作票2
    var my_START_CHECK_TIME = $("#my_START_CHECK_TIME").val();  //开始复测日期
    //if (my_START_CHECK_TIME != "") {
    //    my_START_CHECK_TIME = my_START_CHECK_TIME + " 00:00:00";
    //}
    var my_END_CHECK_TIME = $("#my_END_CHECK_TIME").val();  //结束复测日期
    //if (my_END_CHECK_TIME != "") {
    //    my_END_CHECK_TIME = my_END_CHECK_TIME + " 23:59:59";
    //}
    if (!checktime(my_START_CHECK_TIME, my_END_CHECK_TIME, '#my_START_CHECK_TIME', '#my_END_CHECK_TIME')) {
        return;
    }
    var my_CHECKER = $("#my_CHECKER").val();  //复测人
    var my_START_RAISED_TIME = $("#my_START_RAISED_TIME").val();  //开始检测时间
    var my_END_RAISED_TIME = $("#my_END_RAISED_TIME").val();  //结束检测时间
    if (!checktime(my_START_RAISED_TIME, my_END_RAISED_TIME, '#my_START_RAISED_TIME', '#my_END_RAISED_TIME')) {
        return;
    }
    var my_CATEGORY_CODE = $("#my_CATEGORY_CODE").attr("code");  //检测类型
    if (my_CATEGORY_CODE == undefined) {
        my_CATEGORY_CODE = '';
    }
    var my_DEAL_TICKET_1 = $("#my_DEAL_TICKET_1").val();  //处理工作票1
    var my_DEAL_TICKET_2 = $("#my_DEAL_TICKET_2").val();  //处理工作票2
    var my_START_DEAL_TIME = $("#my_START_DEAL_TIME").val();  //开始处理日期
    //if (my_START_DEAL_TIME != "") {
    //    my_START_DEAL_TIME = my_START_DEAL_TIME + " 00:00:00";
    //}
    var my_END_DEAL_TIME = $("#my_END_DEAL_TIME").val();  //结束处理日期
    //if (my_END_DEAL_TIME != "") {
    //    my_END_DEAL_TIME = my_END_DEAL_TIME + " 23:59:59";
    //}
    if (!checktime(my_START_DEAL_TIME, my_END_DEAL_TIME, '#my_START_DEAL_TIME', '#my_END_DEAL_TIME')) {
        return;
    }
    var my_DEALER = $("#my_DEALER").val();  //处理人
    var obj = document.getElementById('my_SEVERITY_CODE'); //等级
    var my_SEVERITY_CODE = getSelectedItem(obj);
    var my_STATUS = $("#my_STATUS").val();  //状态
    if (my_STATUS == "0") {
        my_STATUS = "";
    }
    var my_LINE_CODE = $("#my_LINE_CODE").val();  //线路
    if (my_LINE_CODE == "0") {
        my_LINE_CODE = "";
    }
    var my_POSITION_CODE = $("#my_POSITION_CODE").val();  //区站
    if (my_POSITION_CODE == "0") {
        my_POSITION_CODE = "";
    }
    var my_DIRECTION = $("#my_DIRECTION").val();  //行别
    var my_START_KM_MARK = $("#my_START_KM_MARK").val();  //开始公里标
    var my_END_KM_MARK = $("#my_END_KM_MARK").val();  //结束公里标

    layer.load();
    $('#content_page').paging({
        index: 1,
        url: function () {
            pageIndex = $('#content_page .pageValue').val();
            var _url = '/Common/MTask/RemoteHandlers/TaskList_NEW.ashx?type=doneTask'
                    + '&TASK_CODE=' + my_TASK_CODE
                    + '&CHECK_TICKET_1=' + my_CHECK_TICKET_1
                    + '&CHECK_TICKET_2=' + my_CHECK_TICKET_2
                    + '&START_CHECK_TIME=' + my_START_CHECK_TIME
                    + '&END_CHECK_TIME=' + my_END_CHECK_TIME
                    + '&CHECEKRNAME=' + my_CHECKER
                    + '&START_RAISED_TIME=' + my_START_RAISED_TIME
                    + '&END_RAISED_TIME=' + my_END_RAISED_TIME
                    + '&CATEGORY_CODE=' + my_CATEGORY_CODE
                    + '&DEAL_TICKET_1=' + my_DEAL_TICKET_1
                    + '&DEAL_TICKET_2=' + my_DEAL_TICKET_2
                    + '&START_DEAL_TIME=' + my_START_DEAL_TIME
                    + '&END_DEAL_TIME=' + my_END_DEAL_TIME
                    + '&DEALERNAME=' + my_DEALER
                    + '&SEVERITY_CODE=' + my_SEVERITY_CODE
                    + '&STATUS=' + my_STATUS
                    + '&LINE_CODE=' + my_LINE_CODE
                    + '&POSITION_CODE=' + my_POSITION_CODE
                    + '&DIRECTION=' + my_DIRECTION
                    + '&START_KM_MARK=' + my_START_KM_MARK
                    + '&END_KM_MARK=' + my_END_KM_MARK
                    + '&PAGESIZE=' + pageSize
                    + '&PAGEINDEX=' + pageIndex;
            return _url
        },
        success: function (data) {
            layer.closeAll('loading');

            $("#ReceiveOrg").hide();
            $("#DEAL_TICKET").show();
            $("#DEALER").show();
            $("#DEAL_TIME").show();

            var _JSON = data;
            if (_JSON.data.length > 0) {

                var Html = '';
                for (var i = 0; i < _JSON.data.length; i++) {

                    var Feedback = "";
                    var status_color = "nocolor";
                    if (_JSON.data[i].TSTATUS == "完成" || _JSON.data[i].TSTATUS == "取消") {
                        Feedback = '<img src="img/Feedback.png" width="16" height="18" title="查看整治反馈单" onclick=downloadFeedback("' + _JSON.data[i].TID + '") />';
                    }

                    if (_JSON.data[i].TSTATUS == "复测") {
                        status_color = "redcolor";
                    } else if (_JSON.data[i].TSTATUS == "完成") {
                        status_color = "greencolor";
                    } else if (_JSON.data[i].TSTATUS == "取消") {
                        status_color = "bluecolor";
                    } else {
                        status_color = "nocolor";
                    };

                    Html += '<div class="table_li ' + status_color + '" ondblclick=jumpHandle("' + _JSON.data[i].TID + '","","' + _JSON.data[i].ALARM_ID + '","openMisTask")><span class="width1"><span class="label btn_save collect" title="查看图片"><i class="icon icon-image icon-white"></i></span></span><span class="width2_1"><img src="img/TaskDetail.png" width="16" height="18" title="查看任务"  onclick=jumpHandle("' + _JSON.data[i].TID + '","","' + _JSON.data[i].ALARM_ID + '","openMisTask") /><img src="img/bugInfo.png" width="16" height="16" title="查看缺陷详情" onclick=jumpalarminfo("' + _JSON.data[i].ALARM_ID + '","' + _JSON.data[i].CATEGORY_CODE + '","' + _JSON.data[i].C4Type + '") /><img src="img/notice.png" width="16" height="18" title="查看整改通知书" onclick=downloadnotice("' + _JSON.data[i].TID + '") />' + Feedback + '</span><span class="width3">' + _JSON.data[i].TASK_CODE + '</span><span class="width2">' + _JSON.data[i].SEVERITY_NAME + '</span><span class="width3">' + _JSON.data[i].RAISED_TIME + '</span><span class="width4" title="' + _JSON.data[i].WZ + '&nbsp;&nbsp;' + _JSON.data[i].CODE_NAME + '">' + _JSON.data[i].WZ + '&nbsp;&nbsp;' + _JSON.data[i].CODE_NAME + '</span><span class="width4_1" title="' + _JSON.data[i].PROPOSAL + '">' + _JSON.data[i].PROPOSAL + '</span><span class="width2">' + _JSON.data[i].TSTATUS + '</span><span class="width2">' + _JSON.data[i].CATEGORY + '</span><span class="width3">' + _JSON.data[i].DEADLINE + '</span><span class="width3">' + _JSON.data[i].CHECK_TICKET + '</span><span class="width3">' + _JSON.data[i].CHECEKRNAME + '</span><span class="width3">' + _JSON.data[i].CHECK_TIME + '</span><span class="width3">' + _JSON.data[i].DEAL_TICKET + '</span><span class="width3">' + _JSON.data[i].DEALERNAME + '</span><span class="width3">' + _JSON.data[i].DEAL_TIME + '</span></div>'
                }
                document.getElementById("table_main").innerHTML = Html;

                $("#table_main>div.table_li").hover(function () {
                    $(this).children().css("background-color", "#ccc");
                }, function () {
                    $(this).children().css("background-color", "");
                });

                showImg(_JSON);
            } else {
                document.getElementById("table_main").innerHTML = "<p>无数据</p>"; //清空内容
            }
        }
    });
};

//加载全部任务
function load_allTask() {
    $(".waitFor_title").hide();
    $(".my_title").hide();
    $(".allTask_title").show();

    //获取参数

    var allTask_TASK_CODE = $("#allTask_TASK_CODE").val();  //整改通知书号
    var allTask_CHECK_TICKET_1 = $("#allTask_CHECK_TICKET_1").val();  //复测工作票1
    var allTask_CHECK_TICKET_2 = $("#allTask_CHECK_TICKET_2").val();  //复测工作票2
    var allTask_START_CHECK_TIME = $("#allTask_START_CHECK_TIME").val();  //开始复测日期
    //if (allTask_START_CHECK_TIME != "") {
    //    allTask_START_CHECK_TIME = allTask_START_CHECK_TIME + " 00:00:00";
    //}
    var allTask_END_CHECK_TIME = $("#allTask_END_CHECK_TIME").val();  //结束复测日期
    //if (allTask_END_CHECK_TIME != "") {
    //    allTask_END_CHECK_TIME = allTask_END_CHECK_TIME + " 23:59:59";
    //}
    if (!checktime(allTask_START_CHECK_TIME, allTask_END_CHECK_TIME, '#allTask_START_CHECK_TIME', '#allTask_END_CHECK_TIME')) {
        return;
    }
    var allTask_CHECKER = $("#allTask_CHECKER").val();  //复测人
    var allTask_START_RAISED_TIME = $("#allTask_START_RAISED_TIME").val();  //开始检测时间
    var allTask_END_RAISED_TIME = $("#allTask_END_RAISED_TIME").val();  //结束检测时间
    if (!checktime(allTask_START_RAISED_TIME, allTask_END_RAISED_TIME, '#allTask_START_RAISED_TIME', '#allTask_END_RAISED_TIME')) {
        return;
    }
    var allTask_CATEGORY_CODE = $("#allTask_CATEGORY_CODE").attr("code");  //检测类型
    if (allTask_CATEGORY_CODE == undefined) {
        allTask_CATEGORY_CODE = '';
    }
    var allTask_DEAL_TICKET_1 = $("#allTask_DEAL_TICKET_1").val();  //处理工作票1
    var allTask_DEAL_TICKET_2 = $("#allTask_DEAL_TICKET_2").val();  //处理工作票2
    var allTask_START_DEAL_TIME = $("#allTask_START_DEAL_TIME").val();  //开始处理时间
    //if (allTask_START_DEAL_TIME != "") {
    //    allTask_START_DEAL_TIME = allTask_START_DEAL_TIME + " 00:00:00";
    //}
    var allTask_END_DEAL_TIME = $("#allTask_END_DEAL_TIME").val();  //结束处理时间
    //if (allTask_END_DEAL_TIME != "") {
    //    allTask_END_DEAL_TIME = allTask_END_DEAL_TIME + " 23:59:59";
    //}
    if (!checktime(allTask_START_DEAL_TIME, allTask_END_DEAL_TIME, '#allTask_START_DEAL_TIME', '#allTask_END_DEAL_TIME')) {
        return;
    }
    var allTask_DEALER = $("#allTask_DEALER").val();  //处理人
    var obj = document.getElementById('allTask_SEVERITY_CODE'); //等级
    var allTask_SEVERITY_CODE = getSelectedItem(obj);
    var allTask_STATUS = $("#allTask_STATUS").val();  //状态
    if (allTask_STATUS == "0") {
        allTask_STATUS = "";
    }
    var allTask_LINE_CODE = $("#allTask_LINE_CODE").val();  //线路
    if (allTask_LINE_CODE == "0") {
        allTask_LINE_CODE = "";
    }
    var allTask_POSITION_CODE = $("#allTask_POSITION_CODE").val();  //区站
    if (allTask_POSITION_CODE == "0") {
        allTask_POSITION_CODE = "";
    }
    var allTask_DIRECTION = $("#allTask_DIRECTION").val();  //行别
    var allTask_START_KM_MARK = $("#allTask_START_KM_MARK").val();  //开始公里标
    var allTask_END_KM_MARK = $("#allTask_END_KM_MARK").val();  //结束公里标

    var allTask_RECV_DEPT = $("#hf_RECV_DEPT").val(); //接收机构

    layer.load();
    $('#content_page').paging({
        index: 1,
        url: function () {
            pageIndex = $('#content_page .pageValue').val();
            var _url = '/Common/MTask/RemoteHandlers/TaskList_NEW.ashx?type=allTask'
                    + '&TASK_CODE=' + allTask_TASK_CODE
                    + '&CHECK_TICKET_1=' + allTask_CHECK_TICKET_1
                    + '&CHECK_TICKET_2=' + allTask_CHECK_TICKET_2
                    + '&START_CHECK_TIME=' + allTask_START_CHECK_TIME
                    + '&END_CHECK_TIME=' + allTask_END_CHECK_TIME
                    + '&CHECEKRNAME=' + allTask_CHECKER
                    + '&START_RAISED_TIME=' + allTask_START_RAISED_TIME
                    + '&END_RAISED_TIME=' + allTask_END_RAISED_TIME
                    + '&CATEGORY_CODE=' + allTask_CATEGORY_CODE
                    + '&DEAL_TICKET_1=' + allTask_DEAL_TICKET_1
                    + '&DEAL_TICKET_2=' + allTask_DEAL_TICKET_2
                    + '&START_DEAL_TIME=' + allTask_START_DEAL_TIME
                    + '&END_DEAL_TIME=' + allTask_END_DEAL_TIME
                    + '&DEALERNAME=' + allTask_DEALER
                    + '&SEVERITY_CODE=' + allTask_SEVERITY_CODE
                    + '&STATUS=' + allTask_STATUS
                    + '&LINE_CODE=' + allTask_LINE_CODE
                    + '&POSITION_CODE=' + allTask_POSITION_CODE
                    + '&DIRECTION=' + allTask_DIRECTION
                    + '&START_KM_MARK=' + allTask_START_KM_MARK
                    + '&END_KM_MARK=' + allTask_END_KM_MARK
                    + '&RECV_DEPT=' + allTask_RECV_DEPT
                    + '&PAGESIZE=' + pageSize
                    + '&PAGEINDEX=' + pageIndex;
            return _url
        },
        success: function (data) {
            layer.closeAll('loading');

            $("#ReceiveOrg").css("display", "inline-block");
            $("#DEAL_TICKET").show();
            $("#DEALER").show();
            $("#DEAL_TIME").show();

            var _JSON = data;
            if (_JSON.data.length > 0) {

                var Html = '';
                for (var i = 0; i < _JSON.data.length; i++) {

                    var Feedback = "";
                    var status_color = "nocolor";
                    if (_JSON.data[i].TSTATUS == "完成" || _JSON.data[i].TSTATUS == "取消") {
                        Feedback = '<img src="img/Feedback.png" width="16" height="18" title="查看整治反馈单" onclick=downloadFeedback("' + _JSON.data[i].TID + '") />';
                    }

                    if (_JSON.data[i].TSTATUS == "复测") {
                        status_color = "redcolor";
                    } else if (_JSON.data[i].TSTATUS == "完成") {
                        status_color = "greencolor";
                    } else if (_JSON.data[i].TSTATUS == "取消") {
                        status_color = "bluecolor";
                    } else {
                        status_color = "nocolor";
                    };

                    Html += '<div class="table_li ' + status_color + '" ondblclick=jumpHandle("' + _JSON.data[i].TID + '","","' + _JSON.data[i].ALARM_ID + '","openMisTask")><span class="width1"><span class="label btn_save collect" title="查看图片"><i class="icon icon-image icon-white"></i></span></span><span class="width2_1"><img src="img/TaskDetail.png" width="16" height="18" title="查看任务"  onclick=jumpHandle("' + _JSON.data[i].TID + '","","' + _JSON.data[i].ALARM_ID + '","openMisTask") /><img src="img/bugInfo.png" width="16" height="16" title="查看缺陷详情" onclick=jumpalarminfo("' + _JSON.data[i].ALARM_ID + '","' + _JSON.data[i].CATEGORY_CODE + '","' + _JSON.data[i].C4Type + '") /><img src="img/notice.png" width="16" height="18" title="查看整改通知书" onclick=downloadnotice("' + _JSON.data[i].TID + '") />' + Feedback + '</span><span class="width3">' + _JSON.data[i].TASK_CODE + '</span><span class="width2">' + _JSON.data[i].SEVERITY_NAME + '</span><span class="width3">' + _JSON.data[i].RAISED_TIME + '</span><span class="width4" title="' + _JSON.data[i].WZ + '&nbsp;&nbsp;' + _JSON.data[i].CODE_NAME + '">' + _JSON.data[i].WZ + '&nbsp;&nbsp;' + _JSON.data[i].CODE_NAME + '</span><span class="width4_1" title="' + _JSON.data[i].PROPOSAL + '">' + _JSON.data[i].PROPOSAL + '</span><span class="width2">' + _JSON.data[i].TSTATUS + '</span><span class="width2">' + _JSON.data[i].CATEGORY + '</span><span class="width3">' + _JSON.data[i].DEADLINE + '</span><span class="width3">' + _JSON.data[i].CHECK_TICKET + '</span><span class="width3">' + _JSON.data[i].CHECEKRNAME + '</span><span class="width3">' + _JSON.data[i].CHECK_TIME + '</span><span class="width3" title="' + _JSON.data[i].RECV_DEPTNAME + '">' + _JSON.data[i].RECV_DEPTNAME + '</span><span class="width3">' + _JSON.data[i].DEAL_TICKET + '</span><span class="width3">' + _JSON.data[i].DEALERNAME + '</span><span class="width3">' + _JSON.data[i].DEAL_TIME + '</span></div>'
                }
                document.getElementById("table_main").innerHTML = Html;

                $("#table_main>div.table_li").hover(function () {
                    $(this).children().css("background-color", "#ccc");
                }, function () {
                    $(this).children().css("background-color", "");
                });

                showImg(_JSON);
            } else {
                document.getElementById("table_main").innerHTML = "<p>无数据</p>"; //清空内容
            }
        }
    });
};

//线路改变
function lineChange1(pcode) {
    if (pcode == '0') {
        pcode = '';
    }
    $('#waitFor_POSITION_CODE').mySelect({
        tag: 'STATIONSECTION',
        code: pcode
    });

};
//线路改变
function lineChange2(pcode) {
    if (pcode == '0') {
        pcode = '';
    }
    $('#my_POSITION_CODE').mySelect({
        tag: 'STATIONSECTION',
        code: pcode
    });

};
//线路改变
function lineChange3(pcode) {
    if (pcode == '0') {
        pcode = '';
    }
    $('#allTask_POSITION_CODE').mySelect({
        tag: 'STATIONSECTION',
        code: pcode
    });

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
//显示图片
function showImg(_JSON) {
    
    $('.table_li span.btn_save').each(function () {
        $(this).hover(function (e) {

            var _index = $(this).parent().parent().index();

            var tag = _JSON.data[_index].CATEGORY_CODE;

            switch (tag) {
                case "2C":
                    $("#img_C2500Img").attr('src', _JSON.data[_index].C2500Img);
                    $("#img_C2100Img").attr('src', _JSON.data[_index].C2100Img);
                    $("#seleHeadDiv_2C").show();
                    $("#seleHeadDiv_3C").hide();
                    $("#seleHeadDiv_4C").hide();
                    $("#seleHeadDiv_DailyWalk").hide();
                    over(this, 'seleHeadDiv_2C', e);
                    break;
                case "3C":
                    $("#img_C3IRV").attr('src', _JSON.data[_index].C3IRV);
                    $("#img_C3VI").attr('src', _JSON.data[_index].C3VI);
                    $("#img_C3OA").attr('src', _JSON.data[_index].C3OA);
                    $("#seleHeadDiv_2C").hide();
                    $("#seleHeadDiv_3C").show();
                    $("#seleHeadDiv_4C").hide();
                    $("#seleHeadDiv_DailyWalk").hide();
                    over(this, 'seleHeadDiv_3C', e);
                    break;
                case "4C":
                    $("#img_C4FaultImg").attr('src', _JSON.data[_index].C4FaultImg);
                    $("#img_C4AllImg").attr('src', _JSON.data[_index].C4AllImg);
                    $("#seleHeadDiv_2C").hide();
                    $("#seleHeadDiv_3C").hide();
                    $("#seleHeadDiv_4C").show();
                    $("#seleHeadDiv_DailyWalk").hide();
                    over(this, 'seleHeadDiv_4C', e);
                    break;
                case "DailyWalk":
                case "STEP_PET":
                    $("#img_DailyWalkFaultImg").attr('src', _JSON.data[_index].DailyWalkFaultImg);
                    $("#seleHeadDiv_2C").hide();
                    $("#seleHeadDiv_3C").hide();
                    $("#seleHeadDiv_4C").hide();
                    $("#seleHeadDiv_DailyWalk").show();
                    over(this, 'seleHeadDiv_DailyWalk', e);
                    break;
            }
        }, function () {
            $("#seleHeadDiv_2C").hide();
            $("#seleHeadDiv_3C").hide();
            $("#seleHeadDiv_4C").hide();
            $("#seleHeadDiv_DailyWalk").hide();
        });
    });
};


//图片位置
function over(obj, divid, e) {
    var div = document.getElementById(divid);
    var rec = getoffset(obj);
    div.style.postion = "absolute";

    var _top = rec[0] + obj.offsetHeight;
    var _left = rec[1] + obj.offsetWidth;

    if (_top + $('#' + divid).height() > $(window).height()) {
        _top = rec[0] - $('#' + divid).height();
    }

    if (_left + $('#' + divid).width() > $(window).width()) {
        _left = $(window).width() - $('#' + divid).width();
    }

    $('#' + divid).animate({ top: _top, left: _left }, 50);

    div.style.display = "";
};
function getoffset(e) {
    var t = e.offsetTop;
    var l = e.offsetLeft;
    while (e = e.offsetParent) {
        t += e.offsetTop;
        l += e.offsetLeft;
    }
    var rec = new Array(1);
    if (t > window.flexTableh) {
        t = window.flexTableh;
    }
    rec[0] = t;
    rec[1] = l;
    return rec
};


//跳转报警详情页
function jumpalarminfo(alarmid, cateGoryName, C4Type) {
    toAlarmDetails(cateGoryName, alarmid);
};

//跳处理页面
function jumpHandle(id, TSTATUS, alarmId, type) {
    var Url;
    
    if (TSTATUS != "") {
        var Url = '/Common/MTask/TaskHandle.htm?id=' + id + '&alarmid=' + alarmId + '&type=' + type;
    } else {
        var Url = '/Common/MTask/TaskHandle.htm?id=' + id + '&alarmid=' + alarmId + '&type=' + type + '&operaType=review';
    }

    window.open(Url);
};

//下载整改通知书
function downloadnotice(id) {
    var _url = '/Report/3CRectify.aspx?id=' + id + "&_h=" + window.screen.height + "&_w=" + window.screen.width;
    window.open(_url);
};

//下载整治反馈单
function downloadFeedback(id) {
    var _url = '/Report/3CRectifyBack.aspx?id=' + id + "&_h=" + window.screen.height + "&_w=" + window.screen.width;
    window.open(_url);
};

//时间检验
function checktime(time1, time2, el1, el2) {

    if ('' !== time1 && '' !== time2) {
        if (time1 > time2) {
            tip('开始时间须小于结束时间', el1, 3000, 'top');
            $('.layui-layer-tips .layui-layer-content').css({ 'min-width': '12px' });
            return false;
        }
    }
    //if ('' === time1) {
    //    tip('请选择开始时间', el1, 3000, 'top');
    //    $('.layui-layer-tips .layui-layer-content').css({ 'min-width': '12px' });
    //    return false;
    //}
    //if ('' === time2) {
    //    tip('请选择结束时间', el2, 3000, 'top');
    //    $('.layui-layer-tips .layui-layer-content').css({ 'min-width': '12px' });
    //    return false;
    //}
    return true;
};