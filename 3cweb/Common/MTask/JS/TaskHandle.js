
/*========================================================================================*
* 功能说明：任务处理js
* 注意事项：
* 作    者： tm
* 版本日期：2017年9月16日
* 变更说明：
* 版 本 号： V1.0
*=======================================================================================*/

var taskId = GetQueryString('id'); //任务id
var alarmid = GetQueryString('alarmid'); //报警id
var openType = GetQueryString('type'); //任务类型（openFaultTask【缺陷入口】，openMisTask【待处理任务入口】，openMisTaskTrac【任务过程入口】）
var listToOperaType = GetQueryString('operaType'); //从列表页获取的操作类别(review)
var toTaskType = GetQueryString('toTaskType'); //转任务类型→步巡转任务[step_pet_Totask]不查询任务基础信息；批量转任务[batchTotask)]要查询任务基础信息；
var operaType = ''; //从详情中获取的操作类别(create, handle, review)

var jsonUser = getCurUser(); //用户信息json

var _w = $(window).width(); //页面宽度
var _h = $(window).height(); //页面高度

var taskPic = []; //转任务图片
var assignPic = []; //派发图片
var checkPic = []; //复测图片
var rectBeforePic = []; //整治前图片
var rectAfterPic = []; //整治后图片

var indexTip = 0; //弹出的提示框的编号
var indexConfirm = 0; //弹出的询问框的编号
var indexLabelTip = 0; //文本提示框的编号

var curEventName = ''; //当前任务名称
var curAction = ''; //当前操作名称

$(document).ready(function () {

    fullShow(); //全屏loading

    if (self != top) { //如果页面在iframe中
        $('.j-page-close').hide();
        if (undefined === alarmid || 'undefined' === alarmid || null === alarmid) {
            alarmid = parent.GetQueryString('alarmid');
        }
    }

    //反馈机构开关
    if (FunEnable('Fun_Feedback') == "True") {
        $('#receive_dept').show();
        $('#receive_dept').parent().show();
        $('#receive_dept').parent().parent().find('td:last-child').attr('colspan', '0');
        if (_w > 1400) {
            $('#form_checekrname').parent().find('span:first-child').css('width', '85px');
            $('#form_check_time').parent().find('span:first-child').css('width', '85px');
            $('#form_check_ticket_1').parent().find('span:first-child').css('width', '85px');
        }
    } else {
        $('#form_checekrname').parent().find('span:first-child').css('width', '85px');
        $('#form_check_time').parent().find('span:first-child').css('width', '85px');
        $('#form_check_ticket_1').parent().find('span:first-child').css('width', '85px');
    }

    $('.insideTable').parent().css('padding', 0);
    $('.img_switch_hook li img').css('height', _h).css('width', _w);

    $('.j-page-close').click(function () { //关闭页面
        window.close();
    });
    $('.j-close-pic').click(function () { //关闭查看图片
        $('.img-box').hide();
    });

    eventViewPic('task'); //查看转任务图片
    eventViewPic('assign'); //查看派发图片
    eventViewPic('check'); //查看复测图片
    eventViewPic('rect-before'); //查看整治前图片
    eventViewPic('rect-after'); //查看整治后图片

    //基础信息折叠
    $('.lititle_titleTD img').click(function () {
        if ($(this).attr('src') == 'img/more_.png') {
            $(this).attr('src', 'img/more-.png');
            $(this).parent().parent().find('.insideTable').hide();
        } else {
            $(this).attr('src', 'img/more_.png');
            $(this).parent().parent().find('.insideTable').show();
        }
    });

    //检测时间链接到DPC综合缺陷详情页
    $('.j-to-alarm').click(function () {
        var _url = '';
        var curCategory = $('#category_code').html();
        toAlarmDetails(curCategory, alarmid);
    }).mouseenter(function () {
        $(this).css('text-decoration', 'underline');
    }).mouseleave(function () {
        $(this).css('text-decoration', 'none');
    }).css('color', '#317eac').css('cursor', 'pointer');

    if ('step_pet_Totask' === toTaskType) { //添加步巡缺陷的转任务中自动匹配不可切换
        $('#form_recv_deptname_input').hide();
        if ($('#form_recv_deptname_input').parent().is('div')) {
            $('#form_recv_deptname_input').parent().hide();
        }
        $('#dept_checkbox').attr('checked', 'checked');
    } else {
        $('#dept_checkbox').change(function () {  //自动匹配
            if ($('#dept_checkbox').is(':checked')) {
                $('#form_org_name_label').show();
                $('#form_recv_deptname_input').hide();
                if ($('#form_recv_deptname_input').parent().is('div')) {
                    $('#form_recv_deptname_input').parent().hide();
                }
            } else {
                $('#form_org_name_label').hide();
                $('#form_recv_deptname_input').show();
                if ($('#form_recv_deptname_input').parent().is('div')) {
                    $('#form_recv_deptname_input').parent().css('display', 'inline-block');
                }
            }
        });
    }

    //点击显示对应按钮
    $('.nav-tabs li a').click(function () {
        $('.btn-tr input').hide(); //标签页下面的所有操作按钮
        $('.upload-tr').hide(); //标签页下面的所有上传控件

        switch ($(this).attr('class')) {
            case 'taskChangeMission': //转任务
                $('.changeMissHide').hide(); //任务描述行

                $('#tr-upload-task-distribute').show(); //转任务、派发上传图片
                $('#btnTask').show(); //转任务提交按钮
                break;
            case 'taskDistribute': //派发
                $('.changeMissHide').hide(); //任务描述行

                $('#tr-upload-task-distribute').show(); //转任务、派发上传图片
                $('#btnSend').show(); //派发提交按钮
                break;
            case 'taskReviewInfo': //复测
                $('#tr-upload-check').show(); //复测上传图片
                $('#btnCheck').show(); //复测提交按钮
                $('#btnCheck-save').show(); //复测保存按钮
                break;
            case 'taskComplete': //整治反馈
                $('#tr-upload-rectification').show(); //整治反馈上传图片
                $('#btnComplete').show(); //整治反馈提交按钮
                $('#btnComplete-save').show(); //整治反馈保存按钮
                break;
            case 'taskCancel': //取消
                $('#btnCancel').show(); //取消提交按钮
                $('#btnCancel-save').show(); //取消保存按钮
                break;
        }
    });

    //转任务、派发上传控件
    $('#upload-resource').myWebUpload({
        uploadBtnId: '#ctlBtn-resource',
        uploadCategories: 'filesAndImages',
        server: '/Common/MAlarmMonitoring/RemoteHandlers/UploadFiles.ashx',
        uploadParams: {
            action: 'UpLoad',
            alarmid: alarmid
        },
        onFinished: function (addCount, files, fileStr) {
            if (addCount === files.length) {
                putFileInForm('#form_resource', fileStr);
                taskHandle(curEventName, curAction);
            }
        }
    });

    //复测上传控件
    $('#upload-check').myWebUpload({
        uploadBtnId: '#ctlBtn-check',
        uploadCategories: 'images',
        server: '/Common/MAlarmMonitoring/RemoteHandlers/UploadFiles.ashx',
        uploadParams: {
            action: 'UpLoad',
            alarmid: alarmid
        },
        onFinished: function (addCount, files, fileStr) {
            if (addCount === files.length) {
                putFileInForm('#form_check_picture', fileStr);
                taskHandle(curEventName, curAction);
            }
            if (addCount > files.length) { //点击保存后，已上传的文件不再上传，只执行提交。
                putFileInForm('#form_check_picture', $('#form_check_picture').val());
                taskHandle(curEventName, curAction);
            }
        }
    });

    //整治前图片上传控件
    $('#upload-rectBefore').myWebUpload({
        uploadBtnId: '#ctlBtn-rectBefore',
        uploadCategories: 'images',
        server: '/Common/MAlarmMonitoring/RemoteHandlers/UploadPicture.ashx',
        uploadParams: {
            action: 'UpLoad',
            alarmid: alarmid,
            feather: 'wait'
        },
        onFinished: function (addCount, files, fileStr) {
            if (addCount === files.length) {
                putFileInForm('#form_wait_repair_picture', fileStr);
                if (isAddImg('#upload-rectAfter')) {
                    triggerUpload('#ctlBtn-rectAfter');
                } else {
                    taskHandle(curEventName, curAction);
                }
            }
        }
    });
    //整治后图片上传控件
    $('#upload-rectAfter').myWebUpload({
        uploadBtnId: '#ctlBtn-rectAfter',
        uploadCategories: 'images',
        server: '/Common/MAlarmMonitoring/RemoteHandlers/UploadPicture.ashx',
        uploadParams: {
            action: 'UpLoad',
            alarmid: alarmid,
            feather: 'done'
        },
        onFinished: function (addCount, files, fileStr) {
            if (addCount === files.length) {
                putFileInForm('#form_done_repair_picture', fileStr);
                taskHandle(curEventName, curAction);
            }
        }
    });

    //提交或保存任务
    $('.j-task input').click(function () {
        var name = $(this).attr('id');
        if (name.indexOf('save') >= 0) {
            switch (name) {
                case 'btnCheck-save': //复测 保存
                    $('#form_recv_dept').attr('name', ''); //接收机构编码
                    $('#form_recv_deptname').attr('name', ''); //接收机构名称
                    task_uploadFile('toTaskCheck', 'save'); //上传文件后，进行任务处理
                    break;
                case 'btnComplete-save': //整治反馈 保存
                    $('#form_deal_time_1').attr('name', ''); //取消日期
                    $('#form_deal_ticket_1_1').attr('name', ''); //处理工作票
                    $('#form_deal_ticket_2_1').attr('name', ''); //处理工作票
                    $('#form_dealername_1').attr('name', ''); //取消人
                    $('#form_deal_result_1').attr('name', ''); //取消原因
                    task_uploadFile('toTaskComplete', 'save'); //上传文件后，进行任务处理
                    break;
                case 'btnCancel-save': //取消 保存
                    $('#form_deal_time').attr('name', ''); //整治日期
                    $('#form_dealername').attr('name', ''); //处理人
                    $('#form_deal_ticket_1').attr('name', ''); //处理工作票
                    $('#form_deal_ticket_2').attr('name', ''); //处理工作票
                    $('#form_deal_result').attr('name', ''); //整治方案
                    taskHandle('toTaskCancel', 'save'); //任务处理
                    break;
            }
        } else {
            indexConfirm = layer.confirm('确认要提交信息？', {
                btn: ['确定', '取消'] //按钮
            }, function () {
                switch (name) {
                    case 'btnTask': //转任务 提交
                        $('#form_recv_dept_1').attr('name', ''); //接收机构编码
                        $('#form_recv_deptname_1').attr('name', ''); //接收机构名称
                        task_uploadFile('toTask', 'commit'); //上传文件后，进行任务处理
                        break;
                    case 'btnSend': //派发 提交
                        $('#form_recv_dept_1').attr('name', ''); //接收机构编码
                        $('#form_recv_deptname_1').attr('name', ''); //接收机构名称
                        task_uploadFile('toTaskBute', 'commit'); //上传文件后，进行任务处理
                        break;
                    case 'btnCheck': //复测 提交
                        $('#form_recv_dept').attr('name', ''); //接收机构编码
                        $('#form_recv_deptname').attr('name', ''); //接收机构名称
                        task_uploadFile('toTaskCheck', 'commit'); //上传文件后，进行任务处理
                        break;
                    case 'btnComplete': //整治反馈 提交
                        $('#form_deal_time_1').attr('name', ''); //取消日期
                        $('#form_deal_ticket_1_1').attr('name', ''); //处理工作票
                        $('#form_deal_ticket_2_1').attr('name', ''); //处理工作票
                        $('#form_dealername_1').attr('name', ''); //取消人
                        $('#form_deal_result_1').attr('name', ''); //取消原因
                        task_uploadFile('toTaskComplete', 'commit'); //上传文件后，进行任务处理
                        break;
                    case 'btnCancel': //取消 提交
                        $('#form_deal_time').attr('name', ''); //整治日期
                        $('#form_dealername').attr('name', ''); //处理人
                        $('#form_deal_ticket_1').attr('name', ''); //处理工作票
                        $('#form_deal_ticket_2').attr('name', ''); //处理工作票
                        $('#form_deal_result').attr('name', ''); //整治方案
                        taskHandle('toTaskCancel', 'commit'); //任务处理
                        break;
                }
            }, function () {
                layer.close(indexConfirm);
            });
        }
    });

    $('.btn-warning').mouseenter(function () { //橙色按钮（提交）
        layer.close(indexTip);
        var id = $(this).attr('id');
        var str = '';
        switch (id) {
            case 'btnTask': //转任务
                str = '提交后，信息不可再修改，任务状态将变成【新建】';
                break;
            case 'btnSend': //派发
                str = '提交后，任务状态将变成【派发】';
                break;
            case 'btnCheck': //复测
                str = '提交后，任务状态将变成【复测】';
                break;
            case 'btnComplete': //整治反馈
                str = '提交后，信息不可再修改，任务状态将变成【完成】';
                break;
            case 'btnCancel': //取消
                str = '提交后，信息不可再修改，任务状态将变成【取消】';
                break;
        }
        indexTip = validTip('#' + id, str);
    }).mouseleave(function () {
        layer.close(indexTip);
    });
    $('.btn-success').mouseenter(function () { //绿色按钮（保存）
        layer.close(indexTip);
        var id = '#' + $(this).attr('id');
        indexTip = validTip(id, '临时保存，任务状态不改变');
    }).mouseleave(function () {
        layer.close(indexTip);
    });

    if ('batchTotask' === toTaskType || 'step_pet_Totask' === toTaskType) { //在报警列表页和缺陷详情页的批量转任务用batchTotask，要获取任务信息；在报警列表页的添加步巡缺陷转任务用step_pet_Totask，不获取任务信息
        $('.onlyTaskHide').hide();
        $('title').html('任务处理');
        $('#li-opera').show(); //任务处理
        $('#li-process').hide(); //任务流程
        $('#li-opera').css('width', '99%');
        $('.taskChangeMission').click();
        $('.handle').remove();
        if ('batchTotask' === toTaskType) {
            getTaskDetail(); //获取任务详情
        }
        fullHide();
    } else {
        getTaskDetail(); //获取任务详情
    }

    validTextarea('.textarea-length');
});

/*/*
 * @desc 设置alarmid的值
 * @param id：其他id值
 * @return 无
 */
function setAlarmId(id) {
    alarmid = id;
}

/*/*
 * @desc 判断是否添加了图片
 * @param uploadId：上传控件的id
 * @return flag：false，true
 */
function isAddImg(uploadId) {
    var uploaderList = $(uploadId).find('.uploader-list');
    var flag = false;
    var temp_c = 0;
    for (var i = 0; i < uploaderList.length; i++) {
        if ('' !== $(uploaderList[i]).html()) {
            temp_c++;
        }
    }
    if (temp_c > 0) {
        flag = true;
    }
    return flag;
}

/*/*
 * @desc 触发上传按钮，开始上传文件
 * @param uploadBtnId：上传按钮的id
 * @return 无
 */
function triggerUpload(uploadBtnId) {
    $(uploadBtnId).trigger('click');
}

/*/*
 * @desc 将文件路径放入form表单的对应控件的图片容器中，用于提交时存入数据库
 * @param uploadFileFormId：form表单的对应控件的图片容器id
 * @param curFiles：上传完的图片数据
 * @return 无
 */
function putFileInForm(uploadFileFormId, curFiles) {
    if ($(uploadFileFormId).val() === '') {
        $(uploadFileFormId).val(curFiles);
    }
}

/*/*
 * @desc 任务处理前先上传文件，上传完成后跳转到上传控件的onFinished方法中（取消不用上传文件）
 * @param eventName：任务名称
 * @param action：操作名称
 * @return 无
 */
function task_uploadFile(eventName, action) {
    curEventName = eventName;
    curAction = action;
    if (!validTaskForm(eventName)) {
        switch (eventName) {
            case 'toTask': //转任务
            case 'toTaskBute': //派发
                if (isAddImg('#upload-resource')) {
                    triggerUpload('#ctlBtn-resource');
                } else {
                    taskHandle(curEventName, curAction);
                }
                break;
            case 'toTaskCheck': //复测
                if (isAddImg('#upload-check')) {
                    triggerUpload('#ctlBtn-check');
                } else {
                    taskHandle(curEventName, curAction);
                }
                break;
            case 'toTaskComplete': //整治
                triggerUpload('#ctlBtn-rectBefore');
                break;
        }
    }
}

/*/*
 * @desc 任务处理
 * @param handleName：任务处理名称（toTask，toTaskBute，toTaskCheck，toTaskComplete，toTaskCancel）
 * @param action：具体处理类型（save，commit）
 * @return 无
 */
function taskHandle(handleName, action) {
    var _Id = '';
    if ('toTask' === handleName) { //在任务列表里跳转不会有转任务情况，只有新上报的报警才会进行转任务
        _Id = alarmid;
    } else {
        _Id = taskId;
    }
    var _url = '/Common/MTask/RemoteHandlers/TaskForm.ashx?type=' + handleName + '&action=' + action + '&id=' + _Id;
    var valid = validTaskForm(handleName);
    var options = {
        beforeSubmit: valid,
        url: _url,
        data: [{ name: 'id', value: _Id }],
        type: 'post',
        success: function (data) {
            var result = data.result;

            //操作成功
            if (result.indexOf('操作成功') > -1) { 
                layer.msg(result);
                //提交
                if ('commit' === action) {
                    //转任务（toTask）（单条和批量）
                    if ('toTask' === handleName) { 
                        if (top !== self) {
                            //在报警详情页刷新页面
                            if (parent.parent.location.href.indexOf('MonitorAlarm3CForm4.htm') > -1 ||
                                parent.parent.location.href.indexOf('MonitorAlarmDailyWalk.htm') > -1 ||
                                parent.parent.location.href.indexOf('MonitorAlarmDPC.htm') > -1 ||
                                parent.location.href.indexOf('MonitorAlarm3CForm4.htm') > -1 ||
                                parent.location.href.indexOf('MonitorAlarmDailyWalk.htm') > -1 ||
                                parent.location.href.indexOf('MonitorAlarmDPC.htm') > -1) {
                                parent.parent.location.reload();
                            } else {
                                //在报警列表页刷新页面： DPC综合列表（MonitorAlarmList.htm），3C报警列表（MonitorLocoAlarmList.htm），下同
                                if (parent.parent.location.href.indexOf('MonitorAlarmList.htm') > -1 || 
                                    parent.parent.location.href.indexOf('MonitorLocoAlarmList.htm') > -1) {
                                    //在报警列表页进行批量转任务时
                                    $('#btn_closeSaveListBox', parent.parent.document).click();
                                    $('#btn_closeSureBox', parent.parent.document).click();
                                    parent.parent.doQuery(1); 
                                } else if (parent.location.href.indexOf('MonitorAlarmList.htm') > -1 ||
                                    parent.location.href.indexOf('MonitorLocoAlarmList.htm') > -1) {
                                    $('#btn_closeSaveListBox', parent.document).click();
                                    $('#btn_closeSureBox', parent.document).click();
                                    parent.doQuery(1);
                                    parent.layer.closeAll();
                                } else {
                                    window.doQuery(1);
                                }
                            }
                        }
                        DelStorageSaveAlarms(alarmid); //删除收藏的报警
                    } else { 
                        //派发（toTaskBute），复测（toTaskCheck），完成（toTaskComplete），取消（toTaskCancel）【在详情页操作】
                        parent.parent.location.reload();
                    }
                } else {
                    //保存
                    getTaskBaseInfoAndHandleInfo(); //获取任务基础信息和处理信息
                }
            } else {
                //操作失败
                layer.msg(result);
            }
            $('.j-task input').removeAttr('disabled');
        },
        error: function (msg) {
            console.log(msg);
        }
    };
    if (valid) {
        layer.close(indexConfirm);
        setTimeout(function () {
            layer.close(indexTip);
        }, 2000);
        return;
    } else {
        $('.j-task input').attr('disabled', 'disabled');
        $('#taskForm').ajaxSubmit(options);
    }
}

/*/*
 * @desc 验证字段
 * @param type：任务处理类别
 * @return 无
 */
function validTaskForm(type) {
    switch (type) {
        case 'toTask': //转任务
            if ($('#form_recv_deptname_input').val() == '' && !$('#dept_checkbox').is(':checked')) { //接收机构
                indexTip = validTip('#form_recv_deptname_input', '接收机构不能为空');
                $('#form_recv_deptname_input').focus().css('border-color', 'red');
                return true;
            }
            if ($('#form_proposal').val() == '') { //意见
                indexTip = validTip('#form_proposal', '意见不能为空');
                $('#form_proposal').focus().css('border-color', 'red');
                return true;
            }
            if ($('#form_proposal').val().length > 128) { //意见
                indexTip = validTip('#form_proposal', '最多128个文字，请重新填写');
                $('#form_proposal').focus().css('border-color', 'red');
                return true;
            }
            return false;
            break;
        case 'toTaskBute': //派发
            if ($('#form_recv_deptname_input').val() == '' && !$('#dept_checkbox').is(':checked')) { //接收机构
                indexTip = validTip('#form_recv_deptname_input', '接收机构不能为空');
                $('#form_recv_deptname_input').focus().css('border-color', 'red');
                return true;
            }
            if ($('#form_proposal').val() == '') { //意见
                indexTip = validTip('#form_proposal', '意见不能为空');
                $('#form_proposal').focus().css('border-color', 'red');
                return true;
            }
            if ($('#form_proposal').val().length > 128) { //意见
                indexTip = validTip('#form_proposal', '最多128个文字，请重新填写');
                $('#form_proposal').focus().css('border-color', 'red');
                return true;
            }
            return false;
            break;
        case 'toTaskCheck': //复测
            //反馈机构开关
            if (FunEnable('Fun_Feedback') == "True") {
                if ($('#form_recv_deptname_input_1').val() == '') { //反馈机构
                    indexTip = validTip('#form_recv_deptname_input_1', '反馈机构不能为空');
                    $('#form_recv_deptname_input_1').focus().css('border-color', 'red');
                    return true;
                }
            }
            if ($('#form_check_value').val() == '') { //复测值
                indexTip = validTip('#form_check_value', '复测值不能为空');
                $('#form_check_value').focus().css('border-color', 'red');
                return true;
            }
            //if ($('#form_check_ticket_1').val() == '') { //复测工作票
            //    indexTip = validTip('#form_check_ticket_1', '复测工作票不能为空');
            //    $('#form_check_ticket_1').focus().css('border-color', 'red');
            //    return true;
            //}
            //if ($('#form_check_ticket_2').val() == '') { //复测工作票
            //    indexTip = validTip('#form_check_ticket_2', '复测工作票不能为空');
            //    $('#form_check_ticket_2').focus().css('border-color', 'red');
            //    return true;
            //}
            if ($('#form_checekrname').val() == '') { //复测人
                indexTip = validTip('#form_checekrname', '复测人不能为空');
                $('#form_checekrname').focus().css('border-color', 'red');
                return true;
            }
            if ($('#form_check_time').val() == '') { //复测时间
                indexTip = validTip('#form_check_time', '复测时间不能为空');
                $('#form_check_time').focus().css('border-color', 'red');
                return true;
            }
            if ($('#form_check_time').val() < $('#raised_time').html()) { //复测时间
                indexTip = validTip('#form_check_time', '检测时间为&nbsp;' + $('#raised_time').html() + '，复测时间不能小于检测时间');
                $('#form_check_time').focus().css('border-color', 'red');
                return true;
            }
            if ($('#form_check_descript').val().length > 128) { //复测情况
                indexTip = validTip('#form_check_descript', '最多128个文字，请重新填写');
                $('#form_check_descript').focus().css('border-color', 'red');
                return true;
            }
            return false;
            break;
        case 'toTaskComplete': //整治反馈
            if ($('#form_deal_time').val() == '') { //整治时间
                indexTip = validTip('#form_deal_time', '整治时间不能为空');
                $('#form_deal_time').focus().css('border-color', 'red');
                return true;
            }
            if ('' !== $('#form_deal_time').val() && '' !== $('#form_check_time').attr('from-database-time')) {
                if ($('#form_deal_time').val() < $('#form_check_time').attr('from-database-time')) { //整治时间
                    indexTip = validTip('#form_deal_time', '复测时间为&nbsp;' + $('#form_check_time').attr('from-database-time') + '，整治时间不能小于复测时间');
                    $('#form_deal_time').focus().css('border-color', 'red');
                    return true;
                }
            } else {
                if ($('#form_deal_time').val() < $('#raised_time').html()) { //整治时间
                    indexTip = validTip('#form_deal_time', '检测时间为&nbsp;' + $('#raised_time').html() + '，整治时间不能小于检测时间');
                    $('#form_deal_time').focus().css('border-color', 'red');
                    return true;
                }
            }
            if ($('#form_dealername').val() == '') { //处理人
                indexTip = validTip('#form_dealername', '处理人不能为空');
                $('#form_dealername').focus().css('border-color', 'red');
                return true;
            }
            if ($('#form_deal_ticket_1').val() == '') { //处理工作票
                indexTip = validTip('#form_deal_ticket_1', '处理工作票不能为空');
                $('#form_deal_ticket_1').focus().css('border-color', 'red');
                return true;
            }
            if ($('#form_deal_ticket_2').val() == '') { //处理工作票
                indexTip = validTip('#form_deal_ticket_2', '处理工作票不能为空');
                $('#form_deal_ticket_2').focus().css('border-color', 'red');
                return true;
            }
            if ($('#form_deal_result').val() == '') { //整治方案
                indexTip = validTip('#form_deal_result', '整治方案不能为空');
                $('#form_deal_result').focus().css('border-color', 'red');
                return true;
            }
            if ($('#form_deal_result').val().length > 128) { //整治方案
                indexTip = validTip('#form_deal_result', '最多128个文字，请重新填写');
                $('#form_deal_result').focus().css('border-color', 'red');
                return true;
            }
            return false;
            break;
        case 'toTaskCancel': //取消
            if ($('#form_deal_time_1').val() == '') { //取消日期
                indexTip = validTip('#form_deal_time_1', '取消日期不能为空');
                $('#form_deal_time_1').focus().css('border-color', 'red');
                return true;
            }
            if ($('#form_dealername_1').val() == '') { //取消人
                indexTip = validTip('#form_dealername_1', '取消人不能为空');
                $('#form_dealername_1').focus().css('border-color', 'red');
                return true;
            }
            if ($('#form_deal_result_1').val() == '') { //取消原因
                indexTip = validTip('#form_deal_result_1', '取消原因不能为空');
                $('#form_deal_result_1').focus().css('border-color', 'red');
                return true;
            }
            if ($('#form_deal_result_1').val().length > 128) { //取消原因
                indexTip = validTip('#form_deal_result_1', '最多128个文字，请重新填写');
                $('#form_deal_result_1').focus().css('border-color', 'red');
                return true;
            }
            return false;
            break;
    }
};

/*/*
 * @desc 获取任务详情的基础信息
 * @param 无
 * @return 无
 */
function getTaskBaseInfoAndHandleInfo() {
    var _Id = '';
    if ('openFaultTask' === openType) { //从报警详情页跳转到该页面
        _Id = alarmid;
    } else {
        _Id = taskId; //从任务列表页跳转到该页面
    }

    var _url = '/Common/MTask/RemoteHandlers/TaskForm.ashx?type=' + openType + '&id=' + _Id;
    var json;
    $.ajax({
        type: 'post',
        url: _url,
        async: true,
        cache: false,
        dataType: 'json',
        beforeSend: function (xmlHttp) {
            xmlHttp.setRequestHeader('If-Modified-Since', '0');
            xmlHttp.setRequestHeader('Cache-Control', 'no-cache');
        },
        success: function (result) {
            if (undefined !== result || 'undefined' === result || null === result || '' === result) {
                json = result;
            } else {
                return;
            }
            //---任务基础信息
            showTaskBaseInfo(json);

            //---任务处理信息
            showTaskHandleInfo(json);
        }
    });
}

/*/*
 * @desc 获取任务详情
 * @param 无
 * @return 无
 */
function getTaskDetail() {
    var _Id = '';
    if ('openFaultTask' === openType) { //从报警详情页跳转到该页面
        _Id = alarmid;
    } else {
        _Id = taskId; //从任务列表页跳转到该页面
    }

    var _url = '/Common/MTask/RemoteHandlers/TaskForm.ashx?type=' + openType + '&id=' + _Id;
    var json;
    $.ajax({
        type: 'post',
        url: _url,
        async: true,
        cache: false,
        dataType: 'json',
        beforeSend: function (xmlHttp) {
            xmlHttp.setRequestHeader('If-Modified-Since', '0');
            xmlHttp.setRequestHeader('Cache-Control', 'no-cache');
        },
        success: function (result) {
            if (undefined !== result || 'undefined' === result || null === result || '' === result) {
                json = result;
            } else {
                return;
            }

            //---任务基础信息
            showTaskBaseInfo(json);

            //---任务处理信息
            showTaskHandleInfo(json);

            operaType = json.BTN;

            //---设置选项卡显示
            if ('review' === listToOperaType && undefined !== listToOperaType && null !== listToOperaType && '' !== listToOperaType) {
                $('#li-opera').hide(); //任务处理
                $('title').html('任务详情');
                $('#li-process').css('width', '100%'); //任务流程
                getTaskProcess(); //获取任务流程
            } else {
                if ('create' === operaType) { //只有转任务
                    $('title').html('任务处理');
                    $('#li-opera').show(); //任务处理
                    $('#li-process').hide(); //任务流程
                    $('#li-opera').css('width', '99%');
                    $('.taskChangeMission').click();
                    $('.handle').remove();
                    fullHide();
                }
                if ('handle' === operaType) { //派发、整治、取消、复核
                    $('title').html('任务处理');
                    $('#li-opera').show(); //任务处理
                    $('.create').remove(); //无转任务
                    $('.taskDistribute').click(); //默认派发
                    $('.taskDistribute').parent().addClass('active'); //激活派发
                    getTaskProcess(); //获取任务流程
                }
                if ('review' === operaType) { //无任务处理，只有详情和流程
                    $('#li-opera').hide(); //任务处理
                    $('title').html('任务详情');
                    $('#li-process').css('width', '100%'); //任务流程
                    getTaskProcess(); //获取任务流程
                }
            }
        }
    });
}

/*/*
 * @desc 显示任务基础信息
 * @param json：任务信息json
 * @return 无
 */
function showTaskBaseInfo(json) {
    //转任务图片、派发图片在流程图中获取
    checkPic = ((undefined === json.CHECK_PICTURE || json.CHECK_PICTURE.length < 1) ? [] : json.CHECK_PICTURE); //复测图片
    rectBeforePic = ((undefined === json.WAIT_REPAIR_PICTURE || json.WAIT_REPAIR_PICTURE.length < 1) ? [] : json.WAIT_REPAIR_PICTURE); //整治前设备图片
    rectAfterPic = ((undefined === json.DONE_REPAIR_PICTURE || json.DONE_REPAIR_PICTURE.length < 1) ? [] : json.DONE_REPAIR_PICTURE); //整治后设备图片

    //缺陷信息
    $('#raised_time').html(getEffectDate(json.RAISED_TIME)); //检测时间
    $('#wz').html(json.WZWEB); //位置
    $('#severity').html(json.SEVERITY_NAME); //缺陷级别
    $('#summary').html(json.SUMMARY); //缺陷类型
    $('#category_code').html(json.CATEGORY_CODE); //检测类型
    $('#alarm_analysis').html(json.ALARM_ANALYSIS); //分析
    $('#alarm_status').html(json.ALARM_STATUS); //缺陷状态

    //任务信息
    $('#task_code').html(json.TASK_CODE); //整改通知书号
    $('#status').html(json.STATUS); //状态
    $('#recv_deptname').html(json.RECV_DEPTNAME); //接收机构
    //$('#task_descript').html(json.TASK_DESCRIPT); //任务描述
    $('#proposal').html(json.PROPOSAL); //意见
    $('#due_time').html(getEffectDate(json.DUE_TIME)); //计划完成日期

    //复测信息
    $('#check_time').html(getEffectDate(json.CHECK_TIME)); //复测时间
    $('#checekrname').html(json.CHECEKRNAME); //复测人
    $('#check_deptname').html(json.CHECK_DEPTNAME); //复测机构
    $('#check_value').html(json.CHECK_VALUE); //复测值
    $('#check_ticket').html(json.CHECK_TICKET_1 + ('' === json.CHECK_TICKET_2 ? '' : '-' + json.CHECK_TICKET_2)); //复测工作票
    $('#check_descript').html(json.CHECK_DESCRIPT); //复测情况
    if (json.CHECK_PICTURE.length > 0) { //复测图片
        $('.j-view-pic-check').parent().find('label').remove();
        $('.j-view-pic-check').show();
    } else {
        $('.j-view-pic-check').parent().find('label').remove();
        $('.j-view-pic-check').hide().before($('<label>无图片</label>'));
        $('#check_picture').val(json.CHECK_PICTURE); //复测图片
    }
    if ('' !== json.CHECK_TIME && '' !== json.CHECK_VALUE && '' !== json.CHECEKRNAME) {
        $('#check-info').show(); //显示复测信息
    }

    //整治反馈
    $('#deal_time').html(getEffectDate(json.DEAL_TIME)); //整治时间
    $('#deal_result').html(json.DEAL_RESULT); //整治方案
    $('#dealername').html(json.DEALERNAME); //处理人
    $('#accepter').html(json.ACCEPTER); //接收人
    $('#auditor').html(json.AUDITOR); //审核人
    $('#declare_time').html(getEffectDate(json.DECLARE_TIME)); //填报日期
    $('#declarer').html(json.DECLARER); //填报人
    if (json.WAIT_REPAIR_PICTURE.length > 0) { //整治前设备图片
        $('.j-view-pic-rect-before').parent().find('label').remove();
        $('.j-view-pic-rect-before').show();
    } else {
        $('.j-view-pic-rect-before').parent().find('label').remove();
        $('.j-view-pic-rect-before').hide().before($('<label>无图片</label>'));
        $('#wait_repair_picture').val(json.WAIT_REPAIR_PICTURE); //整治前设备图片
    }
    if (json.DONE_REPAIR_PICTURE.length > 0) { //整治后设备图片
        $('.j-view-pic-rect-after').parent().find('label').remove();
        $('.j-view-pic-rect-after').show();
    } else {
        $('.j-view-pic-rect-after').parent().find('label').remove();
        $('.j-view-pic-rect-after').hide().before($('<label>无图片</label>'));
        $('#done_repair_picture').val(json.DONE_REPAIR_PICTURE); //整治后设备图片
    }

    //取消信息
    $('#deal_time_1').html(getEffectDate(json.DEAL_TIME)); //取消日期
    $('#dealername_1').html(json.DEALERNAME); //取消人
    $('#deal_ticket').html(json.DEAL_TICKET_1 + ('' === json.DEAL_TICKET_1 ? '' : '-' + json.DEAL_TICKET_1)); //取消人
    $('#deal_deptname').html(json.DEAL_DEPTNAME); //取消机构
    $('#deal_result_1').html(json.DEAL_RESULT); //取消原因

    if ('完成' === json.STATUS) {
        $('#rect-info').show(); //显示整治信息
    }
    if ('取消' === json.STATUS) {
        $('#cancel-info').show(); //显示取消信息
    }
}

/*/*
 * @desc 显示任务处理信息
 * @param json：任务信息json
 * @return 无
 */
function showTaskHandleInfo(json) {
    //转任务、派发
    $('#form_recv_dept').val(json.RECV_DEPT).attr('name', 'RECV_DEPT'); //接收机构编码
    $('#form_recv_deptname').val(json.RECV_DEPTNAME).attr('name', 'RECV_DEPTNAME');//接收机构名称
    $('#form_recv_deptname_input').val(json.RECV_DEPTNAME); //接收机构名称
    var recvZtree = $('#form_recv_deptname_input').mySelectTree({ //接收机构名称控件
        tag: 'ORGANIZATION',
        isDefClick: false,
        height: 130,
        onClick: function (event, treeId, treeNode) {
            $('#form_recv_dept').val(treeNode.id);
            $('#form_recv_deptname').val(treeNode.name);
            $('#form_recv_deptname_input').val(treeNode.name);
        },
        callback: function () {
            var node = recvZtree.getNodeByParam('name', json.RECV_DEPTNAME, null);
            recvZtree.expandNode(node, true, true, true);
            recvZtree.selectNode(node);
        }
    });
    var clear = $('#form_recv_deptname_input').parent().find('a[name="ztree"]');
    $(clear).click(function () { //清空接收机构
        $('#form_recv_dept').val('');
        $('#form_recv_deptname').val('');
    });
    if ('' === json.RECV_DEPTNAME) {
        //$('#form_recv_dept').val(jsonUser.orgcode); //接收机构编码
        //$('#form_recv_deptname').val(jsonUser.orgName); //接收机构名称
        //$('#form_recv_deptname_input').val(jsonUser.orgName); //接收机构名称
        $('#form_recv_dept').val(''); //接收机构编码
        $('#form_recv_deptname').val(''); //接收机构名称
        $('#form_recv_deptname_input').val('').attr('placeholder', '请选择'); //接收机构名称
    };
    $('#form_org_code').val(json.ORG_CODE); //组织机构编码
    $('#form_org_name').val(json.ORG_NAME); //组织机构名称
    $('#form_org_name_label').html(json.ORG_NAME); //组织机构名称
    if ('' === json.ORG_NAME) { //当组织机构名称为空时，禁用自动匹配
        try {
            if (alarmid.split(',').length > 1) {
                $('#dept_checkbox').attr('checked', 'checked');
                $('#form_org_name_label').show();
                $('#form_recv_deptname_input').hide();
                if ($('#form_recv_deptname_input').parent().is('div')) {
                    $('#form_recv_deptname_input').parent().hide();
                }
            }
        } catch (e) {
            $('#dept_checkbox').attr('disabled', 'disabled');
        }
    } else {
        $('#dept_checkbox').attr('checked', 'checked');
        $('#form_org_name_label').show();
        $('#form_recv_deptname_input').hide();
        if ($('#form_recv_deptname_input').parent().is('div')) {
            $('#form_recv_deptname_input').parent().hide();
        }
    }
    //$('#form_task_descript').val(json.TASK_DESCRIPT); //任务描述
    //$('#form_task_descript').mySelectTree({ //任务描述控件
    //    tag: 'SYSDICTIONARYTREE',
    //    cateGory: 'taskwords',
    //    codeType: 'TASK_DESCRIPT',
    //    enableContent: true,
    //    onClick: function (event, treeId, treeNode) {
    //        $('#form_task_descript').val(treeNode.name);
    //    }
    //});
    $('#form_proposal').val(json.PROPOSAL); //意见

    //复测
    $('#form_check_value').val(json.CHECK_VALUE); //复测值
    $('#form_recv_dept_1').val(json.RECV_DEPT).attr('name', 'RECV_DEPT'); //接收机构编码
    $('#form_recv_deptname_1').val(json.RECV_DEPTNAME).attr('name', 'RECV_DEPTNAME'); //接收机构名称
    $('#form_recv_deptname_input_1').val(json.RECV_DEPTNAME); //接收机构名称
    if ($('#form_recv_deptname_input_1').next().attr('name') !== 'ztree') {
        var recvZtree_1 = $('#form_recv_deptname_input_1').mySelectTree({ //接收机构名称控件
            tag: 'ORGANIZATION',
            isDefClick: false,
            height: 130,
            onClick: function (event, treeId, treeNode) {
                $('#form_recv_dept_1').val(treeNode.id);
                $('#form_recv_deptname_1').val(treeNode.name);
                $('#form_recv_deptname_input_1').val(treeNode.name);
            },
            callback: function () {
                var node = recvZtree_1.getNodeByParam('name', json.RECV_DEPTNAME, null);
                recvZtree_1.expandNode(node, true, true, true);
                recvZtree_1.selectNode(node);
            }
        });
        var clear = $('#form_recv_deptname_input_1').parent().find('a[name="ztree"]');
        $(clear).click(function () { //清空反馈机构
            $('#form_recv_dept_1').val('');
            $('#form_recv_deptname_1').val('');
        });
    }
    if ('' === json.RECV_DEPTNAME) {
        $('#form_recv_dept_1').val('').attr('name', 'RECV_DEPT'); //接收机构编码
        $('#form_recv_deptname_1').val('').attr('name', 'RECV_DEPTNAME'); //接收机构名称
        $('#form_recv_deptname_input_1').val('').attr('placeholder', '请选择'); //接收机构名称
    }
    $('#form_check_ticket_1').val(json.CHECK_TICKET_1); //复测工作票
    $('#form_check_ticket_2').val(json.CHECK_TICKET_2); //复测工作票
    $('#form_checekrname').val(getEffectUser(json.CHECEKRNAME)); //复测人
    $('#form_check_time').val(getEffectDateInput(json.CHECK_TIME, 'time')).attr('from-database-time', json.CHECK_TIME); //复测时间
    $('#form_check_descript').val(json.CHECK_DESCRIPT); //复测情况

    //整治
    $('#form_deal_time').val(getEffectDateInput(json.DEAL_TIME, 'time')).attr('name', 'DEAL_TIME'); //整治时间
    $('#form_dealername').val(getEffectUser(json.DEALERNAME)).attr('name', 'DEALERNAME'); //处理人
    $('#form_accepter').val(getEffectUser(json.ACCEPTER)); //验收人
    $('#form_declare_time').val(getEffectDateInput(json.DECLARE_TIME, 'date')); //填报日期
    $('#form_declarer').val(getEffectUser(json.DECLARER)); //填报人
    $('#form_auditor').val(getEffectUser(json.AUDITOR)); //审核人
    $('#form_deal_value').val(json.DEAL_VALUE); //调整值 
    $('#form_deal_ticket_1').val(json.DEAL_TICKET_1).attr('name', 'DEAL_TICKET_1'); //处理工作票
    $('#form_deal_ticket_2').val(json.DEAL_TICKET_2).attr('name', 'DEAL_TICKET_2'); //处理工作票
    $('#form_deal_result').val(json.DEAL_RESULT).attr('name', 'DEAL_RESULT'); //整治方案

    //取消
    $('#form_deal_time_1').val(getEffectDateInput(json.DEAL_TIME, 'time')).attr('name', 'DEAL_TIME'); //取消日期
    $('#form_dealername_1').val(getEffectUser(json.DEALERNAME)).attr('name', 'DEALERNAME'); //取消人
    $('#form_deal_ticket_1_1').val(json.DEAL_TICKET_1).attr('name', 'DEAL_TICKET_1'); //处理工作票
    $('#form_deal_ticket_2_1').val(json.DEAL_TICKET_2).attr('name', 'DEAL_TICKET_2'); //处理工作票
    $('#form_deal_result_1').val(json.DEAL_RESULT).attr('name', 'DEAL_RESULT'); //取消原因

    //---隐藏input
    $('#form_tid').val(json.TID); //任务id 
    $('#form_faultid').val(json.FAULTID); //缺陷id 
    $('#form_org_code').val(json.ORG_CODE); //组织机构编码 
    $('#form_org_name').val(json.ORG_NAME); //组织机构名 
    $('#form_category_code').val(json.CATEGORY_CODE); //检测分类 
    $('#form_severity').val(json.SEVERITY); //SEVERITY 
    $('#form_code').val(json.CODE); //缺陷类型编码 
    $('#form_summary').val(json.SUMMARY); //缺陷类型 
    $('#form_alarm_analysis').val(json.ALARM_ANALYSIS); //分析 
    $('#form_remark').val(json.REMARK); //备注 
    $('#form_fault_descript').val(json.FAULT_DESCRIPT); //描述 
    $('#form_wz').val(json.WZ); //位置信息 
    $('#form_raised_time').val(getEffectDate(json.RAISED_TIME)); //检测时间 
    $('#form_locomotive_code').val(json.LOCOMOTIVE_CODE); //设备类型 
    $('#form_lcz').val(json.LCZ); //3C拉出值 
    $('#form_dgz').val(json.DGZ); //3C导高值 
    $('#form_hjwd').val(json.HJWD); //3C环境温度 
    $('#form_zgwd').val(json.ZGWD); //3C报警温度 
    $('#form_task_code').val(json.TASK_CODE); //整改通知书号 
    $('#form_datatype').val(json.DATATYPE); //数据来源 
    $('#form_status').val(json.STATUS); //状态 
    $('#form_status_time').val(getEffectDate(json.STATUS_TIME)); //状态更新时间 
    $('#form_is_tel').val(json.IS_TEL); //是否发短信 
    $('#form_is_mail').val(json.IS_MAIL); //是否发邮件 
    $('#form_deal_descript').val(json.DEAL_DESCRIPT); //处理描述 
    $('#form_sponsor_deptname').val(json.SPONSOR_DEPTNAME); //发起机构名称 
    $('#form_sponsor_dept').val(json.SPONSOR_DEPT); //发起机构编码 
    $('#form_sponsorname').val(json.SPONSORNAME); //发起人名 
    $('#form_sponsor').val(json.SPONSOR); //发起人编码 
    $('#form_sponsor_time').val(getEffectDate(json.SPONSOR_TIME)); //发起时间 
    $('#form_deadline').val(json.DEADLINE); //截止时间 
    $('#form_receivername').val(json.RECEIVERNAME); //当前接受者 
    $('#form_receiver').val(json.RECEIVER); //当前接受者编码 
    $('#form_senddeptname').val(json.SENDDEPTNAME); //抄送部门名称 
    $('#form_senddept').val(json.SENDDEPT); //抄送部门编码 
    $('#form_btn').val(json.BTN); //功能标识 
    $('#form_disposername').val(json.DISPOSERNAME); //派发着名称 
    $('#form_disposer').val(json.DISPOSER); //派发着编码 
    $('#form_dispose_deptname').val(json.DISPOSE_DEPTNAME); //派发机构名称 
    $('#form_dispose_dept').val(json.DISPOSE_DEPT); //派发机构编码 
    $('#form_dispose_time').val(getEffectDate(json.DISPOSE_TIME)); //派发时间 
    $('#form_dealer').val(json.DEALER); //处理人编码 
    $('#form_deal_dept').val(json.DEAL_DEPT); //处理机构/取消机构编码 
    $('#form_deal_deptname').val(json.DEAL_DEPTNAME); //处理机构/取消机构 
    $('#form_checker').val(json.CHECKER); //复测人编码 
    $('#form_check_dept').val(json.CHECK_DEPT); //复测机构编码 
    $('#form_check_deptname').val(json.CHECK_DEPTNAME); //复测机构 
    $('#form_severity_name').val(json.SEVERITY_NAME); //缺陷等级名称 
    $('#form_due_time').val(getEffectDate(json.DUE_TIME)); //计划完成时间 

    //$('#form_resource').val(json.RESOURCE); //转任务、派发图片路径
    //$('#form_check_picture').val(json.CHECK_PICTURE); //复测图片路径 
    //$('#form_wait_repair_picture').val(json.WAIT_REPAIR_PICTURE); //整治前设备图片路径 
    //$('#form_done_repair_picture').val(json.DONE_REPAIR_PICTURE); //整治后设备图片路径 

    taskId = json.TID;
}

/*/*
 * @desc 设置流程图排列
 * @param 无
 * @return 无
 */
function setProcessArrange() {
    var contentUL = $('.process-row .content-ul');
    var countW = 0; //从左到右排列的流程块的总和（包括开始、结束、开始箭头）
    for (var t = 0; t < contentUL.length; t++) {
        var ulW = $(contentUL[t]).width();
        var processRow = $(contentUL[t]).parent().parent();
        $(processRow).css('width', ulW);
        if ($(processRow).find('.border-bottom').length > 0) {
            $($(processRow).find('.border-bottom')).css('width', ulW);
        }
        if ($(processRow).find('.border-top').length > 0) {
            $($(processRow).find('.border-top')).css('width', ulW);
        }
        countW += $(contentUL[t]).width();
    }
    countW += $('#pro-start').width() + $('#start-border').width() + $('#pro-end').width();

    var aboutWidth = $('.about').width();
    $('.process-timeline').width(aboutWidth);
    //设置流程主体的宽度，使流程图全部横向排列不换行
    $('.process-body').css({ 'width': countW });

    fullHide();
}

/*/*
 * @desc 设置流程图样式
 * @param 无
 * @return 无
 */
function getTaskProcess() {
    var _url = '/Common/MTask/RemoteHandlers/TaskForm.ashx?type=openMisTaskTrac&id=' + taskId;
    var json;
    $.ajax({
        type: 'post',
        url: _url,
        async: true,
        cache: false,
        dataType: 'json',
        beforeSend: function (xmlHttp) {
            xmlHttp.setRequestHeader('If-Modified-Since', '0');
            xmlHttp.setRequestHeader('Cache-Control', 'no-cache');
        },
        success: function (result) {
            if (undefined !== result || 'undefined' === result || null === result || '' === result) {
                json = result;
            } else {
                return;
            }

            var _process_row_html = ''; //流程块（按照后台返回的数据顺序进行展示）

            //状态说明：5个状态：新建、派发、复测、完成、取消；完成、取消不同时显示；

            if (json.rows.length > 0) {
                for (var i = 0; i < json.rows.length; i++) {

                    var _temp_html = ''; //临时存放流程内容的变量
                    var _attach_show_html = ''; //附件显示
                    var _attach_report_html = ''; //附件 报表
                    var _attach_file_html = ''; //附件 文档
                    var _attach_pic_html = ''; //附件 图片
                    var _color_html = ''; //主题（紫色、灰色、红色）
                    var _color_stl_html = ''; //主题（紫色、灰色、红色）
                    var _title_pic_html = ''; //流程标题ico
                    var _time_html = '操作时间：' + json.rows[i].DEAL_TIME; //操作时间

                    //设置主题色
                    if (/*'复测' === json.rows[i].STATUS*/ json.rows[i].STATUS.indexOf('复') >= 0) { //红色
                        _color_html = 'red-t';
                        _color_stl_html = 'red-stl';
                    }
                    if ('完成' === json.rows[i].STATUS) { //绿色
                        _color_html = 'green-t';
                        _color_stl_html = 'green-stl';
                    }
                    if ('取消' === json.rows[i].STATUS) { //深蓝色
                        _color_html = 'blue-dark-t';
                        _color_stl_html = 'blue-dark-stl';
                    }
                    if ('待处理' === json.rows[i].STATUS) { //灰色
                        _color_html = 'gray-t';
                        _color_stl_html = 'gray-stl';
                    }
                    //设置状态图标
                    if ('新建' === json.rows[i].STATUS || '派发' === json.rows[i].STATUS) {
                        _title_pic_html = 'assign-pic';
                    }
                    if (/*'复测' === json.rows[i].STATUS*/ json.rows[i].STATUS.indexOf('复') >= 0) {
                        _title_pic_html = 'retest-pic';
                    }
                    if ('完成' === json.rows[i].STATUS) {
                        _title_pic_html = 'rect-pic';
                    }
                    if ('待处理' === json.rows[i].STATUS) {
                        _title_pic_html = 'resive-pic';
                    }
                    if ('取消' === json.rows[i].STATUS) {
                        _title_pic_html = 'cancel-pic';
                    }
                    //设置每种状态需要显示的附件
                    if ('新建' === json.rows[i].STATUS) { //显示 附件（整改通知书、文档、图片）
                        _attach_report_html = '<a class="bg-defined" href="/Report/3CRectify.aspx?id=' + taskId + '&_h=1080&_w=1920" target="_blank">整改通知书</a>';
                        if (json.rows[i].SOURCE.file.length > 0) {
                            for (var j = 0; j < json.rows[i].SOURCE.file.length; j++) {
                                var tempImg = '';
                                if (json.rows[i].SOURCE.file[j].indexOf('.doc') >= 0 || json.rows[i].SOURCE.file[j].indexOf('.DOC') >= 0) {
                                    tempImg = '/Common/MTask/img/taskProcess/file_word_blue.png';
                                }
                                if (json.rows[i].SOURCE.file[j].indexOf('.xls') >= 0 || json.rows[i].SOURCE.file[j].indexOf('.XLS') >= 0) {
                                    tempImg = '/Common/MTask/img/taskProcess/file_excel_blue.png';
                                }
                                if (json.rows[i].SOURCE.file[j].indexOf('.pdf') >= 0 || json.rows[i].SOURCE.file[j].indexOf('.PDF') >= 0) {
                                    tempImg = '/Common/MTask/img/taskProcess/file_pdf_blue.png';
                                }
                                if (json.rows[i].SOURCE.file[j].indexOf('.txt') >= 0 || json.rows[i].SOURCE.file[j].indexOf('.TXT') >= 0) {
                                    tempImg = '/Common/MTask/img/taskProcess/file_txt_blue.png';
                                }

                                _attach_file_html += '<a href="' + json.rows[i].SOURCE.file[j] + '"><img src="' + tempImg + '" /></a>';
                            }
                        }
                        if (json.rows[i].SOURCE.pic.length > 0) {
                            taskPic = json.rows[i].SOURCE.pic;
                            _attach_pic_html += '<span class="view-pic j-view-pic-task"></span>';
                        }
                    }
                    if ('派发' === json.rows[i].STATUS) { //显示 附件（文档、图片）
                        if (json.rows[i].SOURCE.file.length > 0) {
                            for (var j = 0; j < json.rows[i].SOURCE.file.length; j++) {
                                var tempImg = '';
                                if (json.rows[i].SOURCE.file[j].indexOf('.doc') >= 0 || json.rows[i].SOURCE.file[j].indexOf('.DOC') >= 0) {
                                    tempImg = '/Common/MTask/img/taskProcess/file_word_blue.png';
                                }
                                if (json.rows[i].SOURCE.file[j].indexOf('.xls') >= 0 || json.rows[i].SOURCE.file[j].indexOf('.XLS') >= 0) {
                                    tempImg = '/Common/MTask/img/taskProcess/file_excel_blue.png';
                                }
                                if (json.rows[i].SOURCE.file[j].indexOf('.pdf') >= 0 || json.rows[i].SOURCE.file[j].indexOf('.PDF') >= 0) {
                                    tempImg = '/Common/MTask/img/taskProcess/file_pdf_blue.png';
                                }
                                if (json.rows[i].SOURCE.file[j].indexOf('.txt') >= 0 || json.rows[i].SOURCE.file[j].indexOf('.TXT') >= 0) {
                                    tempImg = '/Common/MTask/img/taskProcess/file_txt_blue.png';
                                }

                                _attach_file_html += '<a href="' + json.rows[i].SOURCE.file[j] + '"><img src="' + tempImg + '" /></a>';
                            }
                        }
                        if (json.rows[i].SOURCE.pic.length > 0) {
                            assignPic = json.rows[i].SOURCE.pic;
                            _attach_pic_html += '<span class="view-pic j-view-pic-assign"></span>';
                        }
                    }
                    if (/*'复测' === json.rows[i].STATUS*/ json.rows[i].STATUS.indexOf('复') >= 0) { //显示 附件（图片）
                        if (checkPic.length > 0) {
                            _attach_pic_html += '<span class="view-pic j-view-pic-check"></span>';
                        }
                    }
                    if ('完成' === json.rows[i].STATUS || '取消' === json.rows[i].STATUS) { //显示 附件（整治反馈单） 
                        _attach_report_html = '<a class="bg-defined" href="/Report/3CRectifyBack.aspx?id=' + taskId + '&_h=1080&_w=1920" target="_blank">整治反馈单</a>';
                    }
                    if ('完成' === json.rows[i].STATUS) { //显示 附件（图片） 
                        if (rectBeforePic.length > 0) {
                            _attach_pic_html += '<span class="view-pic view-pic-before j-view-pic-rect-before"></span>';
                        }
                        if (rectAfterPic.length > 0) {
                            _attach_pic_html += '<span class="view-pic view-pic-after j-view-pic-rect-after"></span>';
                        }
                    }
                    //设置每种状态下附件是否显示
                    if ('新建' === json.rows[i].STATUS) { //显示 附件（整改通知书，图片，文档）
                        _attach_show_html =
                                '            <li class="li-m attach-li">'
                                + '                <div class="txt-defined">附件：</div>'
                                + _attach_report_html
                                + _attach_file_html
                                + _attach_pic_html
                                + '            </li>';
                    }
                    if ('派发' === json.rows[i].STATUS) { //显示 附件（文档、图片）
                        if (json.rows[i].SOURCE.pic.length > 0 || json.rows[i].SOURCE.file.length > 0) {
                            _attach_show_html =
                                '            <li class="li-b attach-li">'
                                + '                <div class="txt-defined">附件：</div>'
                                + _attach_file_html
                                + _attach_pic_html
                                + '            </li>';
                        }
                    }
                    if (/*'复测' === json.rows[i].STATUS*/ json.rows[i].STATUS.indexOf('复') >= 0) { //显示 附件（图片）
                        if (checkPic.length > 0) {
                            _attach_show_html =
                                    '            <li class="li-m attach-li">'
                                    + '                <div class="txt-defined">附件：</div>'
                                    + _attach_pic_html
                                    + '            </li>';
                        }
                    }
                    if ('完成' === json.rows[i].STATUS || '取消' === json.rows[i].STATUS) { //显示 附件（整治反馈单、图片；）
                        _attach_show_html =
                                '            <li class="li-b attach-li">'
                                + '                <div class="txt-defined">附件：</div>'
                                + _attach_report_html
                                + _attach_pic_html
                                + '            </li>';
                    }

                    if ('待处理' === json.rows[i].STATUS) {
                        _time_html = '';
                    }

                    _process_row_html +=
                    '<div class="process-row ' + _color_html + '" process-id="' + json.rows[i].ID + '">'
                    + '    <div class="process-content">'
                    + '        <ul class="content-ul clearfix ' + _color_stl_html + '">'
                    + '            <li class="li-s title-li">'
                    + '                <span class="title-ico ' + _title_pic_html + '"></span>'
                    + '                <span class="title">' + json.rows[i].STATUS + '</span>'
                    + '                <span class="triangle triangle-down"></span>'
                    + '                <span class="circle-ico circle j-circle"></span>'
                    + '            </li>'
                    + '            <li class="li-bb content-li">'
                    + '                <div class="bold">' + _time_html + '</div>'
                    + '                <div class="bold">'
                    + '                     <label id="dept_' + i + '" class="l-tip">' + json.rows[i].DEAL_DEPTNAME + '</label><br />'
                    + '                     <label id="dealer_' + i + '" class="l-tip">' + json.rows[i].DEALERNAME + '</label>'
                    + '                </div>'
                    + '                <div title="' + json.rows[i].PROPOSAL + '">' + json.rows[i].PROPOSAL + '</div>'
                    + '            </li>'
                    + _attach_show_html
                    + '        </ul>'
                    + '    </div>'
                    + '</div>';
                }
                //for循环结束

                //添加html
                $('#pro-end').before(_process_row_html);

                if ('完成' === json.rows[json.rows.length - 1].STATUS || '取消' === json.rows[json.rows.length - 1].STATUS) {
                    $('#pro-end').css("display", "inline-block");
                }
                //显示“已完成”印章
                if ('完成' === $('#status').html()) {
                    $('#pro-seal').removeClass('process-blank').removeClass('process-checked').addClass('process-completed');
                }
                //显示“已复测”印章
                if ('复测' === $('#status').html()) {
                    $('#pro-seal').removeClass('process-blank').removeClass('process-completed').addClass('process-checked');
                }

                //查看图片事件
                eventViewPic('task'); //查看转任务图片
                eventViewPic('assign'); //查看派发图片
                eventViewPic('check'); //查看复测图片
                eventViewPic('rect-before'); //查看整治前图片
                eventViewPic('rect-after'); //查看整治后图片

                //组织机构提示
                $('.l-tip').mouseenter(function () {
                    var id = $(this).attr('id');
                    var type = id.split('_')[0];
                    switch (type) {
                        case 'dept':
                            indexLabelTip = layer.tips('组织机构', '#' + id);
                            break;
                        case 'dealer':
                            indexLabelTip = layer.tips('用户', '#' + id);
                            break;
                    }
                    $('#layui-layer' + indexLabelTip).css('top', ($('#layui-layer' + indexLabelTip).css('top').split('p')[0] - 8) + 'px');
                }).mouseleave(function () {
                    layer.close(indexLabelTip);
                });

                //设置流程线
                var _border_top_html = '<div class="blank-div"><span class="border-top"></span></div>';
                var _border_bottom_html = '<span class="border-bottom"></span>';
                $('.process-row:nth-child(even)').find('.process-content').before(_border_top_html); //偶数
                $('.process-row:nth-child(odd)').find('.process-content').after(_border_bottom_html); //奇数
                $('.process-row:nth-child(even)').find('.triangle-down').removeClass('triangle-down').addClass('triangle-up'); //偶数

                setTimeout('setProcessArrange()', 1000); //设置流程图排列

                $('.process-row').mouseenter(function () { //设置移入移出效果
                    $(this).find('.circle-ico').removeClass('circle').addClass('circle-selected');
                }).mouseleave(function () {
                    $(this).find('.circle-ico').removeClass('circle-selected').addClass('circle');
                });
            }
        }
    });
}

/**
 * @desc 验证文本区域的内容长度
 * @param $targetElement：目标元素
 * @return 无
 */
function validTextarea(id) {
    $(id).change(function (e) {
        var _this = $(this);
        var _val = _this.val();
        if ('' !== _val || null !== _val || undefined !== _val || 'undefined' !== _val) {
            if (_val.length > 128) {
                id = '#' + $(this).attr('id');
                //validTip(id, '最多128个文字');
            }
        }
    });
}

/**
 * @desc  验证提示
 * @param id：被验证的元素('#test')
 * @param string：提示语
 * @param time：关闭提示框的延迟时间('100')
 * @param direction：提示框显示的位置
 * @return 无
 */
function validTip(id, string, direction, time) {
    //小tips
    var number = 1;
    if (undefined === direction || 'top' === direction) {
        number = 1;
    }
    if ('right' === direction) {
        number = 2;
    }
    if ('bottom' === direction) {
        number = 3;
    }
    if ('left' === direction) {
        number = 4;
    }
    if (undefined === time) {
        time = '';
    }
    var index = layer.tips(string, id, {
        tips: [number, '#488cb4'],
        time: time
    });
    return index;
}

/**
 * @desc 弹出对话框
 * @param $targetElement：目标元素
 * @return 无
 */
function showDialog($targetElement) {
    var _index =
        layer.open({
            type: 1,
            skin: 'dialog_box',
            shade: [0.3, '#393D49'],
            title: false, //不显示标题
            fix: false,
            closeBtn: 2,
            area: [_w * 0.9 + 'px', _h * 0.9 + 'px'], //宽高
            content: $targetElement.show(), //捕获的元素
            cancel: function (index) {
                layer.closeAll();
            }
        });
    return _index;
};

/*/*
 * @desc 判断日期是否有效
 * @param val：日期字符串
 * @return 无
 */
function getEffectDate(val) {
    var value = (val.indexOf('0001') >= 0 ? '' : val);
    return value;
}

/*/*
 * @desc 日期控件的日期无效时，返回系统日期
 * @param val：日期字符串
 * @return 无
 */
function getEffectDateInput(val, dateType) {
    var value = '';
    var format = 'yyyy-MM-dd';
    if ('time' === dateType) {
        format = 'yyyy-MM-dd hh:mm:ss';
    }
    if ('date' === dateType) {
        format = 'yyyy-MM-dd';
    }
    value = (val.indexOf('0001') >= 0 ? (new Date()).format(format) : val);
    return value;
}

/*/*
 * @desc 设置选项卡的各个处理人
 * @param val：json中的数据
 * @return 无
 */
function getEffectUser(val) {
    var value = ('' === val ? jsonUser.name : val);
    return value;
}

/*/*
 * @desc 图片切换事件
 * @param 无
 * @return 无
 */
function img_switch() {
    var obj = $('.img_control_hook > ul >li');
    var _targetDom = $('.img_switch_hook > li');
    var Index = $('.img_control_hook > ul').find('li.active').index();
    obj.click(function () {
        var _index = $(this).index();
        obj.removeClass('active');
        $(this).addClass('active');
        Index = _index;

        //_targetDom.eq(_index).siblings().fadeOut('fast');
        //_targetDom.eq(_index).fadeIn('fast');
        _targetDom.eq(_index).siblings().hide();
        _targetDom.eq(_index).show();
    });
};

/*/*
 * @desc 查看图片
 * @param picType：图片类型(task, assign, check, rect-before, rect-after)
 * @return 无
 */
function eventViewPic(picType) {
    $('.j-view-pic-' + picType, document).click(function () {
        layer.closeAll();
        var liImg = '';
        var liPot = '';
        switch (picType) {
            case 'task': //转任务图片
                if (taskPic.length > 0) {
                    var li = getPicAndPot(taskPic);
                    liImg = li[0];

                    if (taskPic.length > 1) {
                        liPot = li[1];
                    }
                    $('.img_switch_hook').html(liImg);
                    $('.img_control_hook > ul').html(liPot);
                    showDialog($('#view-pic-process'));
                    //$('.img-box').show();
                } else {
                    layer.msg('无图片');
                }
                break;
            case 'assign': //派发图片
                if (assignPic.length > 0) {
                    var li = getPicAndPot(assignPic);
                    liImg = li[0];

                    if (assignPic.length > 1) {
                        liPot = li[1];
                    }
                    $('.img_switch_hook').html(liImg);
                    $('.img_control_hook > ul').html(liPot);
                    showDialog($('#view-pic-process'));
                    //$('.img-box').show();
                } else {
                    layer.msg('无图片');
                }
                break;
            case 'check': //复测图片
                if (checkPic.length > 0) {
                    var li = getPicAndPot(checkPic);
                    liImg = li[0];

                    if (checkPic.length > 1) {
                        liPot = li[1];
                    }
                    $('.img_switch_hook').html(liImg);
                    $('.img_control_hook > ul').html(liPot);
                    showDialog($('#view-pic-process'));
                    //$('.img-box').show();
                } else {
                    layer.msg('无图片');
                }
                break;
            case 'rect-before': //整治前图片
                if (rectBeforePic.length > 0) {
                    var li = getPicAndPot(rectBeforePic);
                    liImg = li[0];

                    if (rectBeforePic.length > 1) {
                        liPot = li[1];
                    }
                    $('.img_switch_hook').html(liImg);
                    $('.img_control_hook > ul').html(liPot);
                    showDialog($('#view-pic-process'));
                    //$('.img-box').show();
                } else {
                    layer.msg('无图片');
                }
                break;
            case 'rect-after': //整治后图片
                if (rectAfterPic.length > 0) {
                    var li = getPicAndPot(rectAfterPic);
                    liImg = li[0];

                    if (rectAfterPic.length > 1) {
                        liPot = li[1];
                    }
                    $('.img_switch_hook').html(liImg);
                    $('.img_control_hook > ul').html(liPot);
                    showDialog($('#view-pic-process'));
                    //$('.img-box').show();
                } else {
                    layer.msg('无图片');
                }
                break;
        }

        $('.img_switch_hook li img').css('height', '100%').css('width', '100%');
        img_switch();
    });
}

/*/*
 * @desc 获取各类图片
 * @param 无
 * @return 无
 */
function getPicAndPot(arrPic) {
    var liImg = '';
    var liPot = '';
    for (var i = 0; i < arrPic.length; i++) {
        if (arrPic[i].indexOf(',') > 0) { //如果图片路径中有逗号，要去掉逗号
            arrPic[i] = arrPic[i].split(',')[0];
        }
        liImg += '<li><img class="sliderimg" src="' + arrPic[i] + '" alt=""></li>';
        if (i === 0) {
            liPot += '<li class="active"></li>';
        } else {
            liPot += '<li class=""></li>';
        }
    }
    return [liImg, liPot];
}

//单选
function onChangeObj(objText, objName) {
    objName.value = objText;
};

//多选
function onChangeObjs() {
    var checkNode = ztreeMore.getCheckedNodes();
    var checkNodeName = '';
    var checkNodeId = '';
    $(checkNode).each(function () {
        checkNodeName += this.name + ',';
        checkNodeId += this.id + ',';
    });
    checkNodeName = checkNodeName.substr(0, checkNodeName.length - 1);
    checkNodeId = checkNodeId.substr(0, checkNodeId.length - 1);
    $('textarea[name="SENDDEPTNAMES"]').attr('value', checkNodeName);
    $('input[name="SENDDEPT"]').attr('value', checkNodeId);

};
