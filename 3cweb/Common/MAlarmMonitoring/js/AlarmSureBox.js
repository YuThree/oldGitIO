
function LoadSureBox(_category, _alarmid, _addpara) {

    // $('#mybox1').remove();
    if ($("#mybox1").length == 0) {
        $("body").append('<div id="mybox1"  style="display:none;"  class="modal fade"  role="dialog" >\
        <div style="width:950px" class="modal-dialog ">\
            <div class="modal-header">\
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
                <h4 class="modal-title" id="myModalLabel_2">报警确认</h4>\
            </div>\
            <div class="modal-content">\
                <iframe id="iframe_AlarmSure" src="" frameborder="0" height="375px" width="100%"></iframe>\
            </div>\
            <div class="modal-footer">\
                <button type="button" id="btn_closeSureBox" class="btn btn-default" data-dismiss="modal">关闭</button>\
                <button type="button" class="btn btn-primary" style="display:none" id="btn_SureAndTask">确认并转任务</button>\
                <button type="button" class="btn btn-primary" id="btn_Sure">确认</button>\
                <button type="button" class="btn btn-primary" id="btn_TaskDpc" style="display:none;">转任务</button>\
            </div>\
        </div>\
    </div>');
    }
    if (_addpara == undefined) {
        _addpara = "";
    }

    // $('#iframe_AlarmSure').attr('src', '/Common/MAlarmMonitoring/AlarmSure.html?category=' + _category + '&alarmid=' + _alarmid + _addpara);
    //判断是否绑定事件
    if (!$("#btn_SureAndTask").data("events")) { 
        $('#btn_SureAndTask').click(function () {
        
            $('#iframe_AlarmSure').contents()[0].defaultView.SureAndTask();
        
        });
    }
    $('#btn_Sure').click(function () {
        //btnAlarmUpdate()
        //$(window).contents().find("#iframe_AlarmSure")[0].contentWindow.btnAlarmUpdate()
        $('#iframe_AlarmSure').contents()[0].defaultView.btnAlarmUpdate();
        //location.reload();
        //$('#iframe_AlarmSure').contents()[0].defaultView.btnAlarmUpdate();
        //$('#iframe_AlarmSure').contents().find(btnAlarmUpdate)
        //$("body", parent.parent.document).find("#iframe_AlarmSure").contents()[0].defaultView.btnAlarmUpdate()
        //$('#iframe_AlarmSure').contents()[0].defaultView.btnAlarmUpdate();

    });
    //批量转任务
    if (!$("#btn_TaskDpc").data("events")) {
        $('#btn_TaskDpc').click(function () {
            $('#iframe_AlarmSure').contents()[0].defaultView.TaskDpc()
        })
    }
    


    $('#E_btnOk2,.E_btnOk2').click(function () {
        $('#myModalLabel_2').text("报警确认");
        $('#iframe_AlarmSure').contents().find("#checkBox_sure").show();
        //  $('#btn_SureAndTask').show();
        if ($('#iframe_AlarmSure').contents().find("#cb_showTask").is(':checked')) {
            $('#iframe_AlarmSure').contents().find("#box_task").show();
        }
        //重置重复报警选中
        $('#iframe_AlarmSure').contents().find("#cb_showRepeat").removeAttr("checked");
        $('#iframe_AlarmSure').contents().find("#box_repeat").css("display", "none");

        if (FunEnable('Fun_SendLocale') == "True") {
            $("#iframe_AlarmSure").height(420);//转发
        } else {
            $("#iframe_AlarmSure").height(375);
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

        setAlarmTable(); //设置重复报警信息
      //  SetAlarmID("3C", _alarmid);
    });

    //批量编辑模态框
    $('#edit_WZ').click(function () {
        $('#edit_WZ_modal').modal();

        $('#cb_showRepeat').click(function () {
            var v = this.checked;
            if (v) {
                $('#box_repeat').css("display", "");
            }
            else {
                $('#box_repeat').css("display", "none");
            }
        });

        setAlarmTable(); //设置重复报警信息
        
    });


    $('#E_btnCan2,.E_btnCan2').click(function () {

        //重置重复报警选中
        $('#iframe_AlarmSure').contents().find("#cb_showRepeat").removeAttr("checked");
        $('#iframe_AlarmSure').contents().find("#box_repeat").css("display", "none");

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



        $("#iframe_AlarmSure").height(375);



        $('#iframe_AlarmSure').contents().find("#checkBox_sure").hide();


        $('#iframe_AlarmSure').contents().find("#box_task").hide();


        $('#btn_SureAndTask').hide();


        $('#iframe_AlarmSure').contents().find("#citySel").val("干扰").attr('code', "AFGR");

        setAlarmTable(); //设置重复报警信息

      //  SetAlarmID("3C", _alarmid, 1);
    });
    
}

function CloseSureBox() {
    $('#btn_closeSureBox').click();
}

$(function () {
    if (getConfig("debug") == '1') {
        $('#Useverity').change(function () {
            var parent_url = window.parent.location.href;

            if (parent_url.indexOf('C3RepeatAlarmImg.aspx') < 0) {
                $('#UseverityYZ').addClass('controls')
                if ($('#citySel').val() != "待判定" && $('#citySel').val() != "温差报警" && $("body", parent.document).find("#myModalLabel_2").text() != "报警取消") {
                    $('#UtxtDefect').val($('#citySel').val());
                }
            };
        });
    }

})

function SetAlarmID(_category, _alarmid, _IsCancle,_PDCcancle) {


    $('#iframe_AlarmSure').attr('src', '/Common/MAlarmMonitoring/AlarmSure.html?v=' + version + '&category=' + _category + '&alarmid=' + _alarmid + "&IsCancle=" + _IsCancle + "&PDCcancle=" + _PDCcancle);

}
//硬盘管理播放界面的报警确认
function hardDiskSetAlarmID(loc, alarmTime, IRVTimeStamp, IRVPATH, VIPATH, OVPATH) {
    $('#iframe_AlarmSure').attr('src', '/Common/MAlarmMonitoring/hardDiskAlarmSure.html?v=' + version + '&loc=' + loc + '&alarmTime=' + alarmTime + '&IRVTimeStamp=' + IRVTimeStamp + '&IRVPATH=' + escape(IRVPATH) + '&VIPATH=' + escape(VIPATH) + '&OVPATH=' + escape(OVPATH));
}

//设置重复报警ID文本框的值
function setAlarmTable() {
    $("#alarmid", window.parent.document).val("");
    if (window.parent.opener) {
        var htmlJson = window.parent.opener.AlarmJson ? window.parent.opener.AlarmJson : window.parent.htmlJson;
    } else {
        var htmlJson = window.parent.htmlJson;
    }
    var html = "";
    if (htmlJson != undefined && htmlJson.length > 0) {
        html += "<table id='repeateTable' width='100%'><tr><th width='15%' align='center'>设备编号</th><th width='18%' align='center'>发生时间</th><th width='48%' align='center'>位置信息</th><th width='7%' align='center'>状态</th><th width='12%' align='center'>缺陷类型</th></tr>";
        for (var i = 0; i < htmlJson.length; i++) {

            var label = "";
            if (htmlJson.GT == "false") {
                label += "<tr><td>" + htmlJson[i].DETECT_DEVICE_CODE + "</td><td>" + htmlJson[i].RAISED_TIME + "</td><td>" + htmlJson[i].LINE_NAME + "&nbsp;&nbsp;" + htmlJson[i].POSITION_NAME + "&nbsp;&nbsp;" + htmlJson[i].KM_MARK + (htmlJson[i].POLE_NUMBER == "" ? "" : "&nbsp;&nbsp;" + htmlJson[i].POLE_NUMBER + "支柱") + "</td><td>" + htmlJson[i].STATUS_NAME + "</td><td>" + htmlJson[i].CODE_NAME + "</td></tr>";
            }
            else {
                //如果动车包含地理位置信息，优先展示位置信息
                if (htmlJson[i].LINE_NAME != null && htmlJson[i].LINE_NAME != "") {
                    label += "<tr><td>" + htmlJson[i].DETECT_DEVICE_CODE + "</td><td>" + htmlJson[i].RAISED_TIME + "</td><td>" + htmlJson[i].LINE_NAME + "&nbsp;&nbsp;" + htmlJson[i].POSITION_NAME + "&nbsp;&nbsp;" + htmlJson[i].KM_MARK + (htmlJson[i].POLE_NUMBER == "" ? "" : "&nbsp;&nbsp;" + htmlJson[i].POLE_NUMBER + "支柱") + "</td><td>" + htmlJson[i].STATUS_NAME + "</td><td>" + htmlJson[i].CODE_NAME + "</td></tr>";
                }
                else {
                    label += "<tr><td>" + htmlJson[i].DETECT_DEVICE_CODE + "</td><td>" + htmlJson[i].RAISED_TIME + "</td><td>" + "东经" + htmlJson[i].GIS_X + "&nbsp;&nbsp;北纬" + htmlJson[i].GIS_Y + "</td><td>" + htmlJson[i].STATUS_NAME + "</td><td>" + htmlJson[i].CODE_NAME + "</td></tr>";
                }
            }
            var ck = $(":checkbox[name='tbCheckBox'][value='" + htmlJson[i].ID + "']", window.parent.document);
            if (ck.attr("checked") == "checked") {
                html += label;

                $("#alarmid", window.parent.document).val($("#alarmid", window.parent.document).val() + "," + ck.val());
            }
        }
        html += "</table>";
        $("#iframe_AlarmSure").contents().find("#repeat-body").html(html);
        $('#repeat-body').html(html);
        if ($("#alarmid", window.parent.document).length > 0) {
            $("#alarmid", window.parent.document).val($("#alarmid", window.parent.document).val().substring(1, $("#alarmid", window.parent.document).val().length));
        }
    }

};