
/*========================================================================================*
* 功能说明：任务详细页面操作JS
* 注意事项：
* 作    者： ybc
* 版本日期：2017年6月19日
* 变更说明：
* 版 本 号： V1.0
*=======================================================================================*/
//加载任务
var json;
var ztreeMore;
var ids;
var TOSEND = 'off';//是否抄送  默认否
var User = getCurUser();
function loadTaskForm() {
    var id = GetQueryString("id");
    ids = id;
    switch (ids) {
        case 'BatchOk':
            ids = $("body", parent.document).find("#hf_alarmID").val();
            break;
    }

    $('#id').val(ids);


    var type = GetQueryString("type"); //任务打开【openMisTask】，缺陷打开【openFaultTask】,查阅【lookTask】
    var openType = GetQueryString("openType");


    bindTaskFormDataNew(ids, type, openType);

};
//绑定任务信息

function bindTaskFormDataNew(id, type, openType) {
    var url = "RemoteHandlers/TaskForm.ashx?type=" + type + "&id=" + id + "&openType=" + openType + "&Task=" + GetQueryString("Task");
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        cache: false,
        success: function (result) {
            json = eval('(' + result + ')');
            if (json != undefined) {
                if (json.BTN == 'handle') {
                    
                    $('.create').remove();//无转任务
                    $('.taskDistribute').click();
                    $('#DUE_TIME').parent().parent().hide()
                } else if (json.BTN == 'create') {
                    $('.taskChangeMission').click();
                    $('.creat_hide span[id^=list_show-]').hide(); 
                    $('.handle').remove();//只有转任务
                } else if (json.BTN == 'review') {
                    $('.viewHide').hide();
                    $('.titleshow_height_no').css('max-height', '500px');
                    $('#tr-img-file').hide();
                    //$('.fault_show').click();
                }
                
                //任务基础信息
                $("#list_show-number").html(json.TASK_CODE); //任务编号
                $("#list_show-comfrom").html(json.DATATYPE); //数据来源
                $("#list_show-status").html(json.STATUS); //状态
                $("#list_show-time").html(json.STATUS_TIME); //状态更新时间
                $("#list_show-startMsg").html(json.SPONSORNAME + '(' + json.SPONSOR_DEPTNAME + ')' + '&nbsp;<img class="show_time_Ico" src="img/time.png" data-toggle="tooltip" data-html="true" data-placement="right" title="' + json.SPONSOR_TIME + '（发起）<br/>' + json.DEADLINE + '（截止）" />'); //发起者
                $("#list_show-payoutMsg").html(json.DISPOSERNAME + '(' + json.DISPOSE_DEPTNAME + ')' + '&nbsp;<img class="show_time_Ico" src="img/time.png" data-toggle="tooltip" data-placement="right" title="' + json.DISPOSE_TIME + '（派发）" />'); //派发者
                var recvImg = '';
                if (json.DUE_TIME != '') {
                    recvImg = '&nbsp;<img class="show_time_Ico" src="img/time.png" data-toggle="tooltip" data-placement="right" title="' + json.DUE_TIME + '（计划完成）" />'
                }
                var recvOrg = '';
                if (json.RECV_DEPTNAME != '') {
                    recvOrg = '(' + json.RECV_DEPTNAME + ')'
                }

                $("#list_show-saveMsg").html(json.RECEIVERNAME + recvOrg + recvImg); //接收者
                $("#list_show-describe").html(json.TASK_DESCRIPT); //任务描述
                $("#list_show-opinion").html(json.PROPOSAL); //意见
                $("#PROPOSAL").html(json.PROPOSAL); //form框意见

                //隐藏input
                $('#TASK_CODE').val(json.TASK_CODE)
                $('#DATATYPE').val(json.DATATYPE)
                $('#STATUS').val(json.STATUS)
                $('#STATUS_TIME').val(json.STATUS_TIME)
                $('#SPONSORNAME').val(json.SPONSORNAME)
                $('#SPONSOR').val(json.SPONSOR)
                $('#SPONSOR_DEPTNAME').val(json.SPONSOR_DEPTNAME)
                $('#SPONSOR_DEPT').val(json.SPONSOR_DEPT)
                $('#SPONSOR_TIME').val(json.SPONSOR_TIME)
                $('#DEADLINE').val(json.DEADLINE)

                $('#DISPOSERNAME').val(json.DISPOSERNAME)
                $('#DISPOSER').val(json.DISPOSER)
                $('#DISPOSE_DEPTNAME').val(json.DISPOSE_DEPTNAME)
                $('#DISPOSE_DEPT').val(json.DISPOSE_DEPT)
                $('#DISPOSE_TIME').val(json.DISPOSE_TIME)
                $('#RECEIVERNAME').val(json.RECEIVERNAME)
                $('#RECEIVER').val(json.RECEIVER)
                $('#DUE_TIME').val(getDateStr_day(datehhssNowStr(),7))

                //$('#TASK_DESCRIPT').val(json.TASK_DESCRIPT)
                


                $('#SEVERITY').val(json.SEVERITY)
                $('#CATEGORY_CODE').val(json.CATEGORY_CODE)
                $('#CODE').val(json.CODE)
                $('#SUMMARY').val(json.SUMMARY)
                $('#ALARM_ANALYSIS').val(json.ALARM_ANALYSIS)
                //$('#FAULT_DESCRIPT').val(json.FAULT_DESCRIPT)



                //复核
                $("#list_show-checkOrg").html(json.CHECK_DEPTNAME); //复核机构
                $("#list_show-checkName").html(json.CHECEKRNAME); //	复核者
                $("#list_show-checkVal").html(json.CHECK_VALUE); //复测值
                $("#list_show-checkTicNumber").html(json.CHECK_TICKET_1 + ('' !== json.CHECK_TICKET_2 ? '-'+ json.CHECK_TICKET_2 : '') ); //复测工作票号
                $("#list_show-checkCase").html(json.CHECK_DESCRIPT); //复核情况
                $("#list_show-checkTime").html((json.CHECK_TIME.indexOf('0001') !='-1' ? '' : json.CHECK_TIME)); //复核时间
                //if (json.CHECK_DEPTNAME == '' && json.CHECEKRNAME == '') {
                //    $('.Check_img').click();
                //}
                //复核默认信息 绑定input
                $('#CHECK_TICKET_1').val(json.CHECK_TICKET_1);
                $('#CHECK_TICKET_2').val(json.CHECK_TICKET_2);
                $('#CHECK_VALUE').val(json.CHECK_VALUE)
                $('#CHECK_DESCRIPT').val(json.CHECK_DESCRIPT)
                $('#check-time').val(json.CHECK_TIME);
                $('#raise-time').val(json.RAISED_TIME); //检测时间



                //处理
                $("#list_show-dealOrg").html(json.DEAL_DEPTNAME); //处理机构
                $("#list_show-dealName").html(json.DEALERNAME); //	处理者
                $("#list_show-dealTime").html((json.CHECK_TIME.indexOf('0001') !='-1' ? '' : json.DEAL_TIME)); //处理时间
                $("#list_show-dealTicNumber").html(json.DEAL_TICKET_1 + ('' !== json.DEAL_TICKET_2 ? '-' + json.DEAL_TICKET_2 : '')); //处理工作票号
                $("#list_show-dealCase").html(json.DEAL_DESCRIPT); //处理情况
                $("#list_show-dealResult").html(json.DEAL_RESULT); //处理结果
                $("#list_show-dealVal").html(json.DEAL_VALUE); //调整值
                $("#list_show-dealRemark").html(json.REMARK); //备注
                //if (json.DEAL_DEPTNAME == '' && json.DEALERNAME == '') {
                //    $('.Deal_img').click();
                //}
                

                //缺陷
                $("#list_show-faultClassification").html(json.CATEGORY_CODE); //监测分类
                $("#list_show-faultLevel").html(json.SEVERITY_NAME); //缺陷等级
                $("#list_show-faultType").html(json.SUMMARY); //缺陷类型
                $("#list_show-faultDescribe").html(json.FAULT_DESCRIPT); //缺陷描述
                $("#list_show-faultAnalyze").html(json.ALARM_ANALYSIS); //缺陷分析

                
                if (json.ORG_CODE == "" || json.ORG_CODE == null) {
                    $('#AUTOMATICCHOOSE').removeAttr("checked").attr("disabled", "disabled");
                    $('.atuoHide').css('visibility', 'visible');
                    $('.atuo_Cheack').css("color", "#bfb8b8");
                }


                $("input[name='RECV_DEPT']").attr("value", json.RECV_DEPT); //接收机构code
                $("input[name='RECV_DEPTNAME']").attr("value", json.RECV_DEPTNAME); //接收机构名称
                var recvZtree = $("#RECV_DEPTNAME").mySelectTree({ //接收机构名称控件
                    tag: 'ORGANIZATION',
                    isDefClick: false,
                    height: 130,
                    callback: function () {
                        var node = recvZtree.getNodeByParam("name", json.RECV_DEPTNAME, null);
                        recvZtree.expandNode(node, true, true, true);
                        recvZtree.selectNode(node);

                        //$('.myselectBox').css({ 'height': '250px', 'overflow-x': 'hidden', 'overflow-y': 'auto' });
                        //$("#ULRECV_DEPTNAME").parent().height(160);//超过160像素时会被iframe遮盖
                    },
                    onClick: function (event, treeId, treeNode) {
                        $("input[name='RECV_DEPT']").attr("value", treeNode.id);
                        $("input[name='RECV_DEPTNAME']").attr("value", treeNode.name);
                    }
                });
                if (json.RECV_DEPTNAME == "") {
                    var jsonUser = getCurUser();
                    $("#RECV_DEPT").val(jsonUser.orgcode);
                    $("#RECV_DEPTNAME").val(jsonUser.orgName);
                    //$("#RECEIVERNAME").mySelect({
                    //    tag: "USER",
                    //    code: jsonUser.orgcode,
                    //    type: true
                    //});
                };


                $("textarea[name='TASK_DESCRIPT']").attr("value", json.TASK_DESCRIPT); //任务描述
                $('#TASK_DESCRIPT').mySelectTree({ //任务描述控件
                    tag: 'SYSDICTIONARYTREE',
                    cateGory: 'taskwords',
                    codeType: 'TASK_DESCRIPT',
                    enableContent: true,
                    //where_place: 'up',
                    //_hegiht: '80',
                    //mis_px: '10',
                    onClick: function (event, treeId, treeNode) {
                        $("textarea[name='TASK_DESCRIPT']").attr("value", treeNode.name);
                    }
                });

                $('#DEAL_RESULT').mySelectTree({ //处理结果控件
                    tag: 'SYSDICTIONARYTREE',
                    enableContent: true,
                    cateGory: 'taskwords',
                    codeType: 'DEAL_RESULT',
                    onClick: function (event, treeId, treeNode) {
                        $("textarea[name='DEAL_RESULT']").attr("value", treeNode.name);
                    }
                });

                
                $('#DEAL_DESCRIPT').mySelectTree({ //处理描述控件
                    tag: 'SYSDICTIONARYTREE',
                    enableContent: true,
                    cateGory: 'taskwords',
                    codeType: 'DEAL_DESCRIPT',
                    onClick: function (event, treeId, treeNode) {
                        $("textarea[name='DEAL_DESCRIPT']").attr("value", treeNode.name);
                    }
                });

                // 抄送信息
                ztreeMore = $('#SENDDEPTNAME').mySelectTree({ //选择抄送部门控件
                    tag: 'ORGANIZATION',
                    isDefClick: false,
                    chkboxType: { "Y": "", "N": "" },
                    enableCheck: true,
                    height:100,
                    onCheck: function (event, treeId, treeNode) {
                        var zTree = $.fn.zTree.getZTreeObj(treeId),
                        nodes = zTree.getCheckedNodes(true),
                         v = "", code = "";
                        for (var i = 0, l = nodes.length; i < l; i++) {
                            v += nodes[i].name + ",";
                            code += nodes[i].id + ",";
                        }
                        if (v.length > 0) v = v.substring(0, v.length - 1);
                        if (code.length > 0) code = code.substring(0, code.length - 1);
                        $("#SENDDEPTNAME").attr("value", v).attr("code", code);
                    },
                    onClick: function (event, treeId, treeNode) {
                        if (treeNode.checked) {
                            treeNode.checked = false;
                        } else {
                            treeNode.checked = true;
                        }
                        ztreeMore.updateNode(treeNode);

                        $('#SENDDEPTNAME').val(treeNode.name).attr('code', treeNode.id);
                    }
                });
                 
                //复核保存
                $("input[name='CHECK_DEPT']").attr("value", User.orgcode); //复核机构code
                $("input[name='CHECK_DEPTNAME']").attr("value", User.orgName); //复核机构名称
                //var dealZtree = $("#CHECK_DEPTNAME").mySelectTree({ //复核机构
                //    tag: 'ORGANIZATION',
                //    isDefClick: false,
                //    callback: function () {
                //        var node = dealZtree.getNodeByParam("name", User.orgName, null);
                //        dealZtree.expandNode(node, true, true, true);
                //        dealZtree.selectNode(node);
                //    },
                //    onClick: function (event, treeId, treeNode) {
                //        $("input[name='CHECKER']").attr("value", treeNode.id);
                //        $("input[name='CHECEKRNAME']").attr("value", treeNode.name);
                //        $("#check_name").mySelect({ //复核人姓名控件
                //            tag: "USER",
                //            code: treeNode.id,
                //            type: true
                //        });
                //    }
                //});

                $("input[name='CHECKER']").attr("value", User.code); //复核人code
                $("input[name='CHECEKRNAME']").attr("value", User.name); //复核人姓名
                $('#CHECEKRNAME').val(User.name); //复核人姓名
                //$("#check_name").mySelect({ //复核人姓名控件
                //    tag: "USER",
                //    code: User.orgcode,
                //    type: true,
                //    callback: function () {
                //        LoadDropdSelected("deal_name", User.name); //绑定复核人姓名
                //        $("#check_name").html('<option selected>' + User.name + '</option>')
                //    }
                //});
               

                //处理保存
                $("input[name='DEAL_DEPT']").attr("value", User.orgcode); //处理机构code
                $("input[name='DEAL_DEPTNAME']").attr("value", User.orgName); //处理机构名称
                //var dealZtree = $("#DEAL_DEPTNAME").mySelectTree({ //处理机构
                //    tag: 'ORGANIZATION',
                //    isDefClick: false,
                //    callback: function () {
                //        var node = dealZtree.getNodeByParam("name", User.orgName, null);
                //        dealZtree.expandNode(node, true, true, true);
                //        dealZtree.selectNode(node);
                //    },
                //    onClick: function (event, treeId, treeNode) {
                //        $("input[name='DEAL_DEPT']").attr("value", treeNode.id);
                //        $("input[name='DEAL_DEPTNAME']").attr("value", treeNode.name);
                //        $("#deal_name").mySelect({ //处理人姓名控件
                //            tag: "USER",
                //            code: treeNode.id,
                //            type: true
                //        });
                //    }
                //});

                $("input[name='DEALER']").attr("value", User.code); //处理人code
                $("input[name='DEALERNAME']").attr("value", User.name); //处理人姓名
                //$("#deal_name").mySelect({ //发起人姓名控件
                //    tag: "USER",
                //    code: User.orgcode,
                //    type: true,
                //    callback: function () {
                //        LoadDropdSelected("deal_name", User.name); //绑定发起人姓名
                //        $("#deal_name").html('<option selected>' + User.name + '</option>')
                //    }
                //});

            }
        }
    })

}

//加载对应的按钮
function bindTaskFormBtn(type, json) {
    if (type == "lookTask") {
        document.getElementById("btnSendTask").style.display = "none";

        $("select[name='SPONSOR_DEPTNAME']").attr("readonly", "readonly");
        $("select[name='SPONSORNAME']").attr("readonly", "readonly");
        $("input[name='SPONSOR_TIME']").attr("readonly", "readonly");
        $("input[name='DEADLINE']").attr("readonly", "readonly");

        $("input[name='FAULT_DESCRIPT']").attr("readonly", "readonly");
        $("select[name='SEVERITY']").attr("readonly", "readonly");
        $("select[name='SUMMARY']").attr("readonly", "readonly");
        $("input[name='ALARM_ANALYSIS']").attr("readonly", "readonly");
        $("input[name='PROPOSAL']").attr("readonly", "readonly");
        $("input[name='REMARK']").attr("readonly", "readonly");

        $("input[name='IS_TEL']").attr("readonly", "readonly");
        $("input[name='IS_MAIL']").attr("readonly", "readonly");
        $("select[name='RECV_DEPTNAME']").attr("readonly", "readonly");
        //$("select[name='RECEIVERNAME']").attr("readonly", "readonly");
        $("input[name='DUE_TIME']").attr("readonly", "readonly");
        //$("textarea[name='DEAL_RESULT']").attr("readonly", "readonly");
        //$("textarea[name='DEAL_DESCRIPT']").attr("readonly", "readonly");
        $("textarea[name='TASK_DESCRIPT']").attr("readonly", "readonly");
        $("textarea[name='SENDDEPTNAMES']").attr("readonly", "readonly");
        $("select[name='SENDDEPTNAME']").attr("readonly", "readonly");
    }
    if (json.STATUS != "新建") {
        $("input[name='TASK_CODE']").attr("readonly", "readonly");
        $("select[name='DATATYPE']").attr("readonly", "readonly");
        $("select[name='STATUS']").attr("readonly", "readonly");
        $("select[name='SPONSOR_DEPTNAME']").attr("readonly", "readonly");
        $("select[name='SPONSORNAME']").attr("readonly", "readonly");
        $("input[name='SPONSOR_TIME']").attr("readonly", "readonly");
        $("input[name='DEADLINE']").attr("readonly", "readonly");

        $("input[name='FAULT_DESCRIPT']").attr("readonly", "readonly");
        $("select[name='SEVERITY']").attr("readonly", "readonly");
        $("select[name='SUMMARY']").attr("readonly", "readonly");
        $("input[name='ALARM_ANALYSIS']").attr("readonly", "readonly");
        $("input[name='PROPOSAL']").attr("readonly", "readonly");
        $("input[name='REMARK']").attr("readonly", "readonly");
    }
    if (GetQueryString("Task") == "MrtaTask") {
        document.getElementById("btnDiv").innerHTML = json.BTN;
    } else {
        if (GetQueryString("type") != null && GetQueryString("type") == "openFaultTask") {
            document.getElementById("btnDiv").innerHTML = json.BTN;
        } else {
            window.parent.bindBtnDiv(json.BTN);
        }
    }
};

//转任务前先上传文件
function event_task(eventName) {
    if (self.frameElement && self.frameElement.tagName == "IFRAME") {
        if ($('#alarm_id', window.parent.document).length > 0 && (undefined !== $('#alarm_id', window.parent.document) || '' !== $('#alarm_id', window.parent.document) || null !== $('#alarm_id', window.parent.document) || 'undefined' !== $('#alarm_id', window.parent.document))) {
            ids = $('#alarm_id', window.parent.document).val();
        }
    }
    $('#ctlBtn').trigger('click');

    var uploadCount = $('.upload-resource', document).length;
    var fileCount = $('.file-count').val();

    if (uploadCount === Number(fileCount)) {
        switch (eventName) {
            case 'toTask': toTask()
                break;
            case 'toTaskBute': toTaskBute()
                break;
            case 'checkTask': checkTask()
                break;
            case 'toTaskComplete': toTaskComplete()
                break;
            case 'toTaskCancel': toTaskCancel()
                break;
        }
        //关闭遮罩
        if (self.frameElement && self.frameElement.tagName == "IFRAME") {
            if ($('#index_add_fault', window.parent.document).length > 0 && (undefined !== $('#index_add_fault', window.parent.document) || '' !== $('#index_add_fault', window.parent.document) || null !== $('#index_add_fault', window.parent.document) || 'undefined' !== $('#index_add_fault', window.parent.document))) {
                var _index_add_fault = $('#index_add_fault', window.parent.document).val();
                window.parent.layer.close(_index_add_fault);
            };
        }
    } else {
        switch (eventName) {
            case 'toTask':
                //setTimeout('toTask()', 1000);
                setTimeout('event_task("toTask")', 1000);
                break;
            case 'toTaskBute':
                //setTimeout('toTaskBute()', 1000);
                setTimeout('event_task("toTaskBute")', 1000);
                break;
            case 'checkTask':
                //setTimeout('checkTask()', 1000);
                setTimeout('event_task("checkTask")', 1000);
                break;
            case 'toTaskComplete':
                //setTimeout('toTaskComplete()', 1000);
                setTimeout('event_task("toTaskComplete")', 1000);
                break;
            case 'toTaskCancel':
                //setTimeout('toTaskCancel()', 1000);
                setTimeout('event_task("toTaskCancel")', 1000);
                break;
        }
    }
}

//转任务
function toTask() {
    var options = {
        beforeSubmit: showRequest("toTask"),
        url: "RemoteHandlers/TaskForm.ashx?type=toTask",
        data: [{ name: 'id', value: ids }],
        type: 'POST',
        success: function (result) {

            ymPrompt.succeedInfo(result, null, null, '提示信息', function (mes) { if (mes == "ok") { parent.location.reload(); } });

        }
    };
    $('#taskForm').ajaxSubmit(options);
};


//转任务并派发
function toTaskAndBute() {
    var options = {
        beforeSubmit: showRequest("toTaskAndBute"),
        url: "RemoteHandlers/TaskForm.ashx?type=toTaskAndBute",
        type: 'POST',
        async: false,
        cache: false,
        success: function (result) {

            ymPrompt.succeedInfo(result, null, null, '提示信息', function (mes) { if (mes == "ok") { parent.parent.location.reload(); } });
        }
    };
    $('#taskForm').ajaxSubmit(options);
};


//转任务并派发
function toTaskAndBute2(_alarmID) {
    var options = {
        beforeSubmit: showRequest("toTaskAndBute"),
        url: "RemoteHandlers/TaskForm.ashx?type=toTaskAndBute&id=" + _alarmID,
        type: 'POST',
        success: function (result) {
            if ("openFaultTask" == GetQueryString("type")) {
                if (GetQueryString("openType") != null && GetQueryString("openType") == "openAlarm") {
                    //强制刷新父级参数。
                    ymPrompt.succeedInfo(result, null, null, '提示信息', function (mes) { if (mes == "ok") { parent.location.reload(); } });
                }
                else {
                    ymPrompt.succeedInfo(result, null, null, '提示信息', null);
                }
            } else {
                ymPrompt.succeedInfo(result, null, null, '提示信息', function (mes) { if (mes == "ok") { parent.location.reload(); } });
            }
        }
    };
    $('#taskForm').ajaxSubmit(options);
};
//转任务并派发
function toTaskAndBute3(category, _alarmID) {
    var options = {
        beforeSubmit: showRequest("toTaskAndBute"),
        url: "RemoteHandlers/TaskForm.ashx?type=toTaskAndBute&id=" + _alarmID + "&category=" + category,
        type: 'POST',
        success: function (result) {
            if ("openFaultTask" == GetQueryString("type")) {
                if (GetQueryString("openType") != null && GetQueryString("openType") == "openAlarm") {
                    //强制刷新父级参数。
                    ymPrompt.succeedInfo(result, null, null, '提示信息', function (mes) { if (mes == "ok") { } });
                }
                else {
                    ymPrompt.succeedInfo(result, null, null, '提示信息', null);
                }
            } else {
                ymPrompt.succeedInfo(result, null, null, '提示信息', function (mes) { if (mes == "ok") { } });
            }
        }
    };
    $('#taskForm').ajaxSubmit(options);
};

//批量转任务
function toTaskAndBute4(category, _alarmID) {
    var options = {
        beforeSubmit: showRequest("toTaskAndBute"),
        url: "RemoteHandlers/TaskForm.ashx?type=toTask&id=" + _alarmID + "&category=" + category,
        type: 'POST',
        success: function (result) {
            DelStorageSaveAlarms(_alarmID)//清除storg
            //$("body", parent.document).find("#iframe_AlarmSure").contents()[0].defaultView.alertSuccessInfo(result);
            //alertSuccessInfo(result)
            ymPrompt.succeedInfo(result, null, null, '提示信息', function (mes) {
                if (mes == "ok") {
                    $('#S_so1', parent.parent.document).click();
                    $('#btn_closeSureBox,#btn_closeSaveListBox', parent.parent.document).click();


                    //parent.parent.location.reload();
                }
            });
        }
    };
    $('#taskForm').ajaxSubmit(options);
};


//完成
function toTaskComplete() {
    var options = {
        beforeSubmit: showRequest("toTaskComplete"),
        url: "/Common/MTask/RemoteHandlers/TaskForm.ashx?type=toTaskComplete&id=" + GetQueryString("id"),
        type: 'POST',
        success: function (result) {
            ymPrompt.succeedInfo(result, null, null, '提示信息', function (mes) { if (mes == "ok") { parent.location.reload(); } });
        }
    };
    $('#taskForm').ajaxSubmit(options);
};
//取消
function toTaskCancel() {
    var options = {
        beforeSubmit: showRequest("toTaskCancel"),
        url: "RemoteHandlers/TaskForm.ashx?type=toTaskCancel&id=" + GetQueryString("id"),
        type: 'POST',
        success: function (result) {
            ymPrompt.succeedInfo(result, null, null, '提示信息', function (mes) { if (mes == "ok") { parent.location.reload(); } });
        }
    };
    $('#taskForm').ajaxSubmit(options);
};
//派发
function toTaskBute() {
    var options = {
        beforeSubmit: showRequest("toTaskBute"),
        url: "RemoteHandlers/TaskForm.ashx?type=toTaskBute&id=" + GetQueryString("id"),
        type: 'POST',
        success: function (result) {
            ymPrompt.succeedInfo(result, null, null, '提示信息', function (mes) { if (mes == "ok") { parent.location.reload(); } });
        }
    };
    $('#taskForm').ajaxSubmit(options);
};
//抄送任务
function toSendTask() {
    var options = {
        beforeSubmit: showRequest("toSendTask"),
        url: "RemoteHandlers/TaskForm.ashx?type=toSendTask&id=" + GetQueryString("id"),
        type: 'POST',
        success: function (result) {
            ymPrompt.succeedInfo(result, null, null, '提示信息', null);
        }
    };
    $('#taskForm').ajaxSubmit(options);
}
//接受任务
function toTaskAccept() {
    var options = {
        beforeSubmit: showRequest("toTaskAccept"),
        url: "RemoteHandlers/TaskForm.ashx?type=toTaskAccept&id=" + GetQueryString("id"),
        type: 'POST',
        success: function (result) {
            ymPrompt.succeedInfo(result, null, null, '提示信息', null);
        }
    };
    $('#taskForm').ajaxSubmit(options);
};
//拒绝任务
function toTaskReject() {
    var options = {
        beforeSubmit: showRequest("toTaskReject"),
        url: "RemoteHandlers/TaskForm.ashx?type=toTaskReject&id=" + GetQueryString("id"),
        type: 'POST',
        success: function (result) {
            ymPrompt.succeedInfo(result, null, null, '提示信息', function (mes) { if (mes == "ok") { parent.location.reload(); } });
        }
    };
    $('#taskForm').ajaxSubmit(options);
};
//查阅任务
function toLookTask() {
    var options = {
        beforeSubmit: showRequest("toLookTask"),
        url: "RemoteHandlers/TaskForm.ashx?type=toLookTask&id=" + GetQueryString("id"),
        type: 'POST',
        success: function (result) {
            ymPrompt.succeedInfo(result, null, null, '提示信息', function (mes) { if (mes == "ok") { parent.location.reload(); } });
        }
    };
    $('#taskForm').ajaxSubmit(options);
};

function toDuanInfo() {
    var url = "RemoteHandlers/TaskForm.ashx?type=toDuanInfo&id=" + GetQueryString("id");
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        cache: false,
        success: function (result) {
            ymPrompt.succeedInfo(result, null, null, '提示信息');
        }
    });
}
//验证字段
function validTaskForm(type) {
    if ($('#RESOURCE').val() === '') {
        var upload = $('.upload-resource', document);
        var val = '';
        for (var i = 0; i < upload.length; i++) {
            val += $(upload[i]).val();
        }
        $('#RESOURCE').val(val);
    }
    switch (type) {
        case "toTask":
            if ($("#TASK_DESCRIPT").val() == "") {
                ymPrompt.alert('任务描述不能为空', null, null, '提示信息', function (mes) {
                    if (mes == "ok") {
                        document.getElementById("TASK_DESCRIPT").focus();
                        $("#DIVTASK_DESCRIPT").addClass("control-group error");
                    }
                });
                //关闭遮罩
                if (self.frameElement && self.frameElement.tagName == "IFRAME") {
                    if (undefined !== $('#index_add_fault', window.parent.document) || '' !== $('#index_add_fault', window.parent.document) || null !== $('#index_add_fault', window.parent.document) || 'undefined' !== $('#index_add_fault', window.parent.document)) {
                        var _index_add_fault = $('#index_add_fault', window.parent.document).val();
                        window.parent.layer.close(_index_add_fault);
                    };
                }
                return true;
            }
            return false;
            break;
        case "toTaskCheck":
            if ($("#check-time").val() < $('#raise-time').val()) { 
                ymPrompt.alert('检测时间为' + $('#raise-time').val() + ',复测时间不能小于检测时间', null, null, '提示信息', function (mes) { 
                    if (mes == "ok") { $('#check-time').focus(); $("#check-time").addClass("control-group error"); } 
                });
                return true; 
            }
            return false;
            break;
        case "toTaskAndBute":
            if ($("#RECV_DEPT").val() == "" && !$('#AUTOMATICCHOOSE').is(':checked')) { ymPrompt.alert('接受机构不能为空', null, null, '提示信息', function (mes) { if (mes == "ok") { document.getElementById("RECV_DEPTNAME").focus(); $("#DIVRECV_DEPTNAME").addClass("control-group error"); } }); return true; }
            //if ($("#RECEIVER").val() == "") { ymPrompt.alert('接受者不能为空', null, null, '提示信息', function (mes) { if (mes == "ok") { document.getElementById("RECEIVERNAME").focus(); $("#DIVRECEIVER").addClass("control-group error"); } }); return true; }
            if ($("#TASK_DESCRIPT").val() == "") { ymPrompt.alert('任务描述不能为空', null, null, '提示信息', function (mes) { if (mes == "ok") { document.getElementById("TASK_DESCRIPT").focus(); $("#DIVTASK_DESCRIPT").addClass("control-group error"); } }); return true; }
            return false;
            break;
        case "toTaskComplete":
            if ('' !== $("#check-time").val()) {
                if ($("#DEAL_TIME").val() < $('#check-time').val()) {
                    ymPrompt.alert('复测时间为' + $('#raise-time').val() + ',整治时间不能小于复测时间', null, null, '提示信息', function (mes) {
                        if (mes == "ok") { $('#check-time').focus(); $("#check-time").addClass("control-group error"); }
                    });
                    return true;
                }
            } else {
                if ($("#DEAL_TIME").val() < $('#raise-time').val()) {
                    ymPrompt.alert('检测时间为' + $('#raise-time').val() + ',整治时间不能小于检测时间', null, null, '提示信息', function (mes) {
                        if (mes == "ok") { $('#check-time').focus(); $("#check-time").addClass("control-group error"); }
                    });
                    return true;
                }
            }
            if ($("#DEAL_RESULT").val() == "") { ymPrompt.alert('处理结果不能为空', null, null, '提示信息', function (mes) { if (mes == "ok") { document.getElementById("DEAL_RESULT").focus(); $("#DIVDEAL_RESULT").addClass("control-group error"); } }); return true; }
            if ($("#DEAL_DESCRIPT").val() == "") { ymPrompt.alert('处理描述不能为空', null, null, '提示信息', function (mes) { if (mes == "ok") { document.getElementById("DEAL_DESCRIPT").focus(); $("#DIVDEAL_DESCRIPT").addClass("control-group error"); } }); return true; }
            return false;
            break;
        case "toTaskCancel":
            if ($("#DEAL_RESULT").val() == "") { ymPrompt.alert('处理结果不能为空', null, null, '提示信息', function (mes) { if (mes == "ok") { document.getElementById("DEAL_RESULT").focus(); $("#DIVDEAL_RESULT").addClass("control-group error"); } }); return true; }
            if ($("#DEAL_DESCRIPT").val() == "") { ymPrompt.alert('处理描述不能为空', null, null, '提示信息', function (mes) { if (mes == "ok") { document.getElementById("DEAL_DESCRIPT").focus(); $("#DIVDEAL_DESCRIPT").addClass("control-group error"); } }); return true; }
            return false;
            break;
        case "toTaskBute":
            if ($("#RECV_DEPT").val() == "" && $('#AUTOMATICCHOOSE').is(':checked')) { ymPrompt.alert('接受机构不能为空', null, null, '提示信息', function (mes) { if (mes == "ok") { document.getElementById("RECV_DEPTNAME").focus(); $("#DIVRECV_DEPTNAME").addClass("control-group error"); } }); return true; }
            //if ($("#RECEIVER").val() == "") { ymPrompt.alert('接受者不能为空', null, null, '提示信息', function (mes) { if (mes == "ok") { document.getElementById("RECEIVERNAME").focus(); $("#DIVRECEIVER").addClass("control-group error"); } }); return true; }
            //if ($("#TASK_DESCRIPT").val() == "") { ymPrompt.alert('任务描述不能为空', null, null, '提示信息', function (mes) { if (mes == "ok") { document.getElementById("TASK_DESCRIPT").focus(); $("#DIVTASK_DESCRIPT").addClass("control-group error"); } }); return true; }
            return false;
            break;
        case "toTaskAccept":
            return false;
            break;
        case "toTaskReject":
            if ($("#DEAL_RESULT").val() == "") { ymPrompt.alert('处理结果不能为空', null, null, '提示信息', function (mes) { if (mes == "ok") { document.getElementById("DEAL_RESULT").focus(); $("#DIVDEAL_RESULT").addClass("control-group error"); } }); return true; }
            if ($("#DEAL_DESCRIPT").val() == "") { ymPrompt.alert('处理描述不能为空', null, null, '提示信息', function (mes) { if (mes == "ok") { document.getElementById("DEAL_RESULT").focus(); $("#DIVDEAL_RESULT").addClass("control-group error"); } }); return true; }
            return false;
            break;
        case "toLookTask":
            return false;
            break;
        case "toSendTask":
            if ($("#SENDDEPTNAMES").val() == "") { ymPrompt.errorInfo('抄送部门不能为空', null, null, '提示信息', function (mes) { if (mes == "ok") { document.getElementById("SENDDEPTNAME").focus(); $("#DIVSENDDEPTNAMES").addClass("control-group error"); } }); return true; }
            return false;
            break;
    }
};


function showRequest(type) {
    v = validTaskForm(type);
    return v;
};

//单选
function onChangeObj(objText, objName) {
    objName.value = objText;
    //$("input[name='" + objName + "']").attr("value", objText);
};
//多选

function onChangeObjs() {
    $("input[name='SENDDEPT']").attr("value", "");
    $("textarea[name='SENDDEPTNAMES']").attr("value", "");
    // $('#modal-container-selectOrg').hide();
    var checkNode = ztreeMore.getCheckedNodes();
    var checkNodeName = "";
    var checkNodeId = "";
    $(checkNode).each(function () {
        checkNodeName += this.name + ",";
        checkNodeId += this.id + ",";
    });
    checkNodeName = checkNodeName.substr(0, checkNodeName.length - 1);
    checkNodeId = checkNodeId.substr(0, checkNodeId.length - 1);
    $("textarea[name='SENDDEPTNAMES']").attr("value", checkNodeName);
    $("input[name='SENDDEPT']").attr("value", checkNodeId);

};
//关闭组织机构
function closeSelectOrg() {
    $('#modal-container-selectOrg').hide();
};

//复核信息
function checkTask() {
    var options = {
        beforeSubmit: showRequest("toTaskCheck"),
        url: "RemoteHandlers/TaskForm.ashx?type=toTaskCheck&id=" + GetQueryString("id"),
        type: 'POST',
        success: function (result) {
            ymPrompt.succeedInfo(result, null, null, '提示信息', function (mes) { if (mes == "ok") { parent.location.reload(); } });
        }
    };
    $('#taskForm').ajaxSubmit(options);
}