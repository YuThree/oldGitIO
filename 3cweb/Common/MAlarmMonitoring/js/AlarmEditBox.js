
var checkbox = false;
function LoadEditBox(_category, _alarmid) {
    var height = 440;
    if (FunEnable('Fun_EditPosition') == "True") {
        height = 440;
    } else {
        height = 230;
    }

    $("body").append('<div id="myEditbox1" style="display:none"  class="modal fade"  role="dialog" >\
        <div style="width:800px" class="modal-dialog ">\
            <div class="modal-header">\
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
                <h4 class="modal-title" >编辑位置</h4>\
            </div>\
            <div class="modal-content">\
                <iframe id="iframe_AlarmEdit" src="" frameborder="0" height="' + height + '" width="100%"></iframe>\
            </div>\
            <div id="BJ" class="modal-footer">\
            <button type="button" id="btn_closeEditBox" class="btn btn-default" data-dismiss="modal">关闭</button>\
                <button type="button" class="btn btn-primary" id="btn_SureEdit">保存</button>\
            </div>\
        </div>\
    </div>');

    if (getConfig('debug') == "1") {
        $("#ckdj").css("display", "");
        $('.debug').show();
    }


    $('#iframe_AlarmEdit').attr('src', '/Common/MAlarmMonitoring/AlarmEditPlace.htm?v=' + version + '&category=' + _category + '&alarmid=' + _alarmid);



    $('#btn_SureEdit').click(function () {
        if (_category == "3C"){
            var svalue3 = $('#iframe_AlarmEdit').contents()[0].defaultView.svalue3;
            var i = 0;
            svalue3.IRV_DIR = $('#iframe_AlarmEdit').contents().find("#IRV_DIR").val();
            svalue3.VI_DIR = $('#iframe_AlarmEdit').contents().find("#VI_DIR").val();
            svalue3.OVA_DIR = $('#iframe_AlarmEdit').contents().find("#OVA_DIR").val();
            svalue3.OVB_DIR = $('#iframe_AlarmEdit').contents().find("#OVB_DIR").val();
            svalue3.IRV_NUM = $('#iframe_AlarmEdit').contents().find("#IRV_NUM").val();
            svalue3.VI_NUM = $('#iframe_AlarmEdit').contents().find("#VI_NUM").val();
            svalue3.OVA_NUM = $('#iframe_AlarmEdit').contents().find("#OVA_NUM").val();
            svalue3.OVB_NUM = $('#iframe_AlarmEdit').contents().find("#OVB_NUM").val();
            svalue3.PLAY_IDX = JSON.parse($('#iframe_AlarmEdit').contents().find("#PLAY_IDX").val());
            svalue3.START_IDX = $('#iframe_AlarmEdit').contents().find("#START_IDX").val();
            svalue3.FAULT_IDX = $('#iframe_AlarmEdit').contents().find("#FAULT_IDX").val();
            svalue3.VI_IDX = $('#iframe_AlarmEdit').contents().find("#VI_IDX").val();
            svalue3.OVA_IDX = $('#iframe_AlarmEdit').contents().find("#OVA_IDX").val();
            svalue3.OVB_IDX = $('#iframe_AlarmEdit').contents().find("#OVB_IDX").val();
            $('#iframe_AlarmEdit').contents().find("#TabContent div").each(function () {
                var jlh = $(this).find("input[id='tab" + i + "_jlh']").val();
                var km = $(this).find("input[id='tab" + i + "_km']").val();
                var maxTemp = Math.round(parseFloat($(this).find("input[id='tab" + i + "_maxTemp']").val()) * 100);
                var envTemp = Math.round(parseFloat($(this).find("input[id='tab" + i + "_envTemp']").val()) * 100);
                var dgz = $(this).find("input[id='tab" + i + "_dgz']").val();
                var lcz = $(this).find("input[id='tab" + i + "_lcz']").val();
                var speed = $(this).find("input[id='tab" + i + "_speed']").val();
                var row_info = i + "," + jlh + "," + km + "," + maxTemp + "," + envTemp + "," + dgz + "," + lcz + "," + speed;
                svalue3.FRAME_INFO[i] = row_info;
                i++;
            });
            var fault_frame = svalue3.FRAME_INFO[svalue3.FAULT_IDX].split(',');
            $('#iframe_AlarmEdit').contents().find("#NVALUE1").val(fault_frame[7]); //速度
            $('#iframe_AlarmEdit').contents().find("#NVALUE2").val(fault_frame[5]); //导高
            $('#iframe_AlarmEdit').contents().find("#NVALUE3").val(fault_frame[6]); //拉出
            $('#iframe_AlarmEdit').contents().find("#NVALUE4").val(fault_frame[3]); //报警温度
            $('#iframe_AlarmEdit').contents().find("#NVALUE5").val(fault_frame[4]); //环境温度
            //        var km = $('#iframe_AlarmEdit').contents().find("#txt_km").val(); //公里标
            //        var nvalue1 = $('#iframe_AlarmEdit').contents().find("#NVALUE1").val(); //速度
            //        var nvalue2 = $('#iframe_AlarmEdit').contents().find("#NVALUE2").val(); //导高
            //        var nvalue3 = $('#iframe_AlarmEdit').contents().find("#NVALUE3").val(); //拉出
            //        var nvalue4 = $('#iframe_AlarmEdit').contents().find("#NVALUE4").val(); //报警温度
            //        var nvalue5 = $('#iframe_AlarmEdit').contents().find("#NVALUE5").val(); //环境温度
            //        var fault_frame = svalue3.FRAME_INFO[svalue3.FAULT_IDX].split(',');
            //        svalue3.FRAME_INFO[svalue3.FAULT_IDX] = fault_frame[0] + "," + fault_frame[1] + "," + km + "," + nvalue4 + "," + nvalue5 + "," + nvalue2 + "," + nvalue3 + "," + nvalue1;


            $('#iframe_AlarmEdit').contents().find("#SVALUE3").val(JSON.stringify(svalue3));
        }
        var bool = $('#iframe_AlarmEdit').contents()[0].defaultView.GetValid()

        if (bool) {

            //保存
            ymPrompt.confirmInfo({
                message: '确认要修改位置信息吗?',
                handler: function (tp) {
                    if (tp == 'ok') {
                        //checkbox = document.getElementById('ckdj').checked;
                        $('#iframe_AlarmEdit').contents()[0].defaultView.save();
                    }
                    if (tp == 'cancel') {
                        //  cancelFn();
                    }
                    if (tp == 'close') {
                        //   closeFn()
                    }
                }
            });
        }
    });



    //$('#btn_editWZ').click(function () {
    //    $('#myEditbox1').modal().css({
    //        width: 'auto',
    //        'margin-left': function () {
    //            return -($(this).width() / 2);
    //        },
    //        'margin-top': function () {
    //            return -($(this).height() / 2);
    //        }
    //    });
    //});

}

function CloseEdBox() {
    $('#btn_closeEditBox').click();
}

//function SetIstypical(type) {
//    var b = false;
//    if (type == "1") {
//        b = true;
//    }
//    $("#ckdj").attr("checked", b);
//}

function marker_bug() {
    var alarmID = GetQueryString("alarmid");
    var T = $('#ckdj span:eq(0)').hasClass('btn-defects-ico-selected');
    var F = $('#signPortout span:eq(0)').hasClass('btn-mark-ico-selected');
    if (!T == true) {
        $('#ckdj span:eq(0)').addClass("btn-defects-ico-selected");
        checkbox = true;
    } else {
        $('#ckdj span:eq(0)').removeClass("btn-defects-ico-selected");
        checkbox = false;
    }
    if (!F == true) {
        var weekly = false;
    } else {
        var weekly = true;
    }
    var url = "/Common/MAlarmMonitoring/RemoteHandlers/AlarmEdit.ashx?active=Marker&alarmid=" + alarmID + "&typical=" + checkbox + '&weekly=' + weekly;
    $.ajax({
        type: 'POST',
        url: url,
        ansyc: false,
        cache: false,
        success: function (result) {
            var Json = result;
        }
    })
};
