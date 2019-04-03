
function LoadSaveListBox(_category) {


    $("body").append('<div id="mySaveListbox1" style="display:none"  class="modal fade"  role="dialog" >\
        <div style="width:1100px" class="modal-dialog ">\
            <div class="modal-header">\
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
                <h4 class="modal-title" >批量确认/取消报警</h4>\
            </div>\
            <div class="modal-content">\
                <iframe id="iframe_AlarmSaveList" name="iframe_AlarmSaveList" src="" frameborder="0" height="580" width="100%"></iframe>\
            </div>\
            <div class="modal-footer">\
                <span style="vertical-align: middle;margin-right: 10px;">已选<span id="list-num" >0</span>条，总共<span id="list-allnum" >0</span>条</span>\
                <button type="button" class="btn btn-info " id="btn_CancleSave"><i class="icon icon-white icon-star-off"></i>取消收藏</button>\
                <button type="button" class="btn btn-danger" id="btn_PSureAlarm" style="display:none;"><i class="icon-white icon-ok-sign"></i>批量确认报警</button>\
                <button type="button" class="btn btn-success" id="btn_CancleAlarm"><i class="icon-white icon-remove-sign"></i>批量取消报警</button>\
                <button type="button" class="btn btn-success" id="btn_ForwardingTasks" style="display:none;"><i class="icon-white icon-remove-sign"></i>批量转任务</button>\
                <button type="button" id="btn_closeSaveListBox" class="btn btn-default" data-dismiss="modal">关闭</button>\
            </div>\
        </div>\
    </div>');

    //                <button type="button" class="btn btn-danger E_btnOk2" id="btn_SureAlarm">确认报警</button>\


  //  $('#iframe_AlarmSaveList').attr('src', '/Common/MAlarmMonitoring/AlarmSaveList.htm');

    $('#btn_CancleSave').click(function () {
        //取消收藏
        var ids = $(window.frames["iframe_AlarmSaveList"].document).find("#vIDs").val();
        if (ids == undefined) {
            return;
        }

        if (ids == '') {
            ymPrompt.alert('请先选择');
        }
        else {
            DelStorageSaveAlarms(ids);   //DelSaveAlarms(ids);
            $('#iframe_AlarmSaveList').attr('src', '/Common/MAlarmMonitoring/AlarmSaveList.htm?r=' + Math.random() + '&v=' + version);
            doQuery()//刷新页面
        }

    })

    $('#btn_PSureAlarm').click(function () {


        var ids = $(window.frames["iframe_AlarmSaveList"].document).find("#vIDs").val();

        
        //
        //$("#iframe_AlarmSaveList").contents()[0].defaultView.refushAlarm();
        //  alert('iframe中vIDs值为：'+ids);

        if (ids == '') {
            ymPrompt.alert('请先选择');
        }
        else {
         
            //   SetAlarmID(_category, ids,0);
            SetAlarmID(_category, 'BatchOk', 0);

            $('#mybox1').modal().css({
                width: 'auto',
                'margin-left': function () {
                    return -($(this).width() / 2);
                },
                'margin-top': function () {
                    return -($(this).height() / 2);
                }
            });

            $('#myModalLabel_2').text("报警确认");
            $("#iframe_AlarmSure").height(400);
            $('#btn_SureAndTask').show();
            $('#btn_TaskDpc').hide();
        }
    })

    $('#btn_CancleAlarm').click(function () {


     //   var ids = $(window.frames["iframe_AlarmSaveList"].document).find("#vIDs").val();

        var ids = $("#iframe_AlarmSaveList").contents()[0].defaultView.GetHF_ids();
        //
        //$("#iframe_AlarmSaveList").contents()[0].defaultView.refushAlarm();
        //  alert('iframe中vIDs值为：' + ids);
        if (ids == '') {
            ymPrompt.alert('请先选择');
        }
        else {

            //  SetAlarmID(_category, ids,1);
            if (_category == 'DPC') {
                SetAlarmID(_category, 'BatchOk', 1, 'PDCcancle');
                $("#iframe_AlarmSure").height(200);

            } else {
                SetAlarmID(_category, 'BatchOk', 1);
                $("#iframe_AlarmSure").height(400);
            }
            $('#mybox1').modal().css({
                width: 'auto',
                'margin-left': function () {
                    return -($(this).width() / 2);
                },
                'margin-top': function () {
                    return -($(this).height() / 2);
                }
            });

            $('#myModalLabel_2').text("报警取消");
            $('#btn_SureAndTask,#btn_TaskDpc').hide();
            $('#btn_Sure').show();
        }
    })
//转任务
    $('#btn_ForwardingTasks').click(function () {

        var ids = $("#iframe_AlarmSaveList").contents()[0].defaultView.GetHF_ids();
       
        if (ids == '') {
            ymPrompt.alert('请先选择');
        }
        else {
            SetAlarmID(_category, 'BatchOk', 0, 'DPCmission');
            $('#mybox1').modal().css({
                width: 'auto',
                'margin-left': function () {
                    return -($(this).width() / 2);
                },
                'margin-top': function () {
                    return -($(this).height() / 2);
                }
            });

            $('#myModalLabel_2').text("转任务");
            $("#iframe_AlarmSure").height(200);
            $('#btn_SureAndTask,#btn_Sure').hide();
            $('#btn_TaskDpc').show();
        }
    })

    $('#E_saveList').click(function () {

        $('#iframe_AlarmSaveList').attr('src', '/Common/MAlarmMonitoring/AlarmSaveList.htm?v=' + version + '&category=' + _category).height($(window).height() - 200);
        $('#mySaveListbox1').modal().css({
            width: 'auto',
            height: $(window).height() - 100,
            'margin-left': function() {
                return -($(this).width() / 2);
            },
            'margin-top': function() {
                return -($(this).height() / 2);
            }
        });
        $("#list-num").text(0);
    });

    $('.chooseType_saveList li').click(function () {
        var type = $(this).attr('class')
        if (type == 'Mission') {
            $('#btn_ForwardingTasks').show()//批量转任务按钮
            $('#btn_CancleAlarm').hide()//批量转任务按钮
            $('#mySaveListbox1 .modal-title').html('批量转任务')
        } else if (type == 'Canc') {
            $('#mySaveListbox1 .modal-title').html('批量取消')
            $('#btn_ForwardingTasks').hide()//批量转任务按钮
            $('#btn_CancleAlarm').show()//批量转任务按钮
        }
        $('#iframe_AlarmSaveList').attr('src', '/Common/MAlarmMonitoring/AlarmSaveList.htm?v=' + version + '&category=' + _category + '&type=' + type + '&stylemode=' + GetQueryString("category")).height($(window).height() - 200);
        $('#mySaveListbox1').modal().css({
            width: 'auto', height: $(window).height()-100,
            'margin-left': function () {
                return -($(this).width() / 2);
            },
            'margin-top': function () {
                return -($(this).height() / 2);
            }
        });
        $("#list-num").text(0);
    });
}

function CloseEditBox()
{
    $('#btn_closeSaveListBox').click();
}


function SaveListReLoad() {
    $('#btn_CancleSave').click();
}