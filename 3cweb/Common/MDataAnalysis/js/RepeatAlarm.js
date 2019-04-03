function showModel(rowData) {
    var id = $('div', rowData)[0].innerHTML.replace("&nbsp;", "");
    option1.url = 'RemoteHandlers/RepeatAlarm.ashx?type=queryByID&ID=' + escape(id) + '&temp=' + Math.random();
    option1.newp = 1;
    $("#flexTable1").flexOptions(option1).flexReload();
    document.getElementById('modal-22256').click();
};

function getVal(id) {
    if (!(/(^[1-9]\d*$)/.test(document.getElementById(id).value))) {
        ymPrompt.alert('重复次数必须大于1的整数', null, null, '提示信息', null);
        document.getElementById(id).value = "";
        return;
    }
    if (parseFloat(document.getElementById(id).value) < 2) {
        ymPrompt.alert('重复次数必须大于1的整数', null, null, '提示信息', null);
        document.getElementById(id).value = "";
        return;
    }
};
function getValjj(id) {
    if (!(/(^[1-9]\d*$)/.test(document.getElementById(id).value))) {
        ymPrompt.alert('间距必须大于1的整数', null, null, '提示信息', null);
        document.getElementById(id).value = "";
        return;
    }
    if (parseFloat(document.getElementById(id).value) < 2) {
        ymPrompt.alert('间距次数必须大于1的整数', null, null, '提示信息', null);
        document.getElementById(id).value = "";
        return;
    }
};

//重复报警分析
function btnClick(f) {
    Distance_val = $("#Distance").val();
    if ($("#repeatCount").val() == "") {
        ymPrompt.alert('重复次数必须大于1的整数', null, null, '提示信息', null);
        return;
    }
    var org_code = $("#hf_org_id").val();
    var org_name = $("#org_name").val();
    var org_type = $("#hf_org_type").val();
    var locomotive_code = $("#locomotive_code").val();
    var obj = document.getElementById('ddlzt');
    var zt = getSelectedItem(obj);
    var line_code; //线路
    var position_code; //区站
    var warningLevel;//报警级别
    var zTree = $.fn.zTree.getZTreeObj("ULcitySel");
    var nodes = zTree.getCheckedNodes(true);
    var code = "";
    for (var i = 0, l = nodes.length; i < l; i++) {
        code += nodes[i].id + ",";
    }
    if (code.length > 0) code = code.substring(0, code.length - 1);
    var afcode = code; // $('#citySel').val()
    var type = ($('#rdo1').hasClass("fxactive") ? "line" : "gps");parseInt()
    var start_km = ($("#skm1").val() == '' ? "" : parseInt($("#skm1").val())*1000) + ($("#skm2").val() == '' ? "" : parseInt($("#skm2").val()));
    var end_km = ($("#ekm1").val() == '' ? "" : parseInt($("#ekm1").val()) * 1000) + ($("#ekm2").val() == '' ? "" : parseInt($("#ekm2").val()));

    if ($("#lblMark").attr("start") != "0" && $("#lblMark").attr("end") != "0" && start_km != "" && end_km != "") {
        var sk = Number($("#lblMark").attr("start")) >= Number($("#lblMark").attr("end")) ? Number($("#lblMark").attr("end")) : Number($("#lblMark").attr("start"));
        var ek = Number($("#lblMark").attr("start")) <= Number($("#lblMark").attr("end")) ? Number($("#lblMark").attr("end")) : Number($("#lblMark").attr("start"));
        if (Number(start_km) >= sk && Number(end_km) <= ek) { }
        else {
            ymPrompt.alert('起止公里标范围超出该区站范围', null, null, '提示信息', null);
            return;
        }
    }
    //if ($("#txtqz").val() == "") {
    //    $("#lblMark").text("");
    //}
    
    if ($("#lineCode").attr("treetype") == "LINE") {
        line_code = $("#lineCode").attr("code");
        position_code = "";
    } else if ($("#lineCode").attr("treetype") == "POSITION") {
        line_code = "0";
        position_code = $("#lineCode").val();
    } else {
        line_code = "0";
        position_code = "";
    };
    if ($('#jb').next().children("span:last").text() == '全部') {
        warningLevel ='一类,二类,三类'
    } else {
        warningLevel = getSelectedItem(document.getElementById('jb'))
        //console.log(warningLevel)
    }
    if (f == 0) {
        var url = "/Common/MGIS/RepeatGIS.htm?Category_Code=3C&linecode=" + line_code
        + "&xb=" + $("#xb").val()
        + "&jb=" + warningLevel
        + "&org_code=" + org_code
        + "&org_name=" + org_name
        + "&org_type=" + org_type
        + "&locomotive_code=" + locomotive_code
        + "&startdate=" + escape($("#startTime").val())
        + "&enddate=" + escape($("#endTime").val())
        + "&txtqz=" + escape(position_code)
        + "&skm1=" + escape($("#skm1").val())
        + "&skm2=" + escape($("#skm2").val())
        + "&ekm1=" + escape($("#ekm1").val())
        + "&ekm2=" + escape($("#ekm2").val())
        + "&gis_x1=" + escape($("#gis_x1").val())
        + "&gis_y1=" + escape($("#gis_y1").val())
        + "&gis_x2=" + escape($("#gis_x2").val())
        + "&gis_y2=" + escape($("#gis_y2").val())
        + "&zt=" + escape(zt)
        + "&afcode=" + escape(afcode)
        + "&distance=" + escape($("#Distance").val())
        + "&count=" + escape($("#repeatCount").val())
        + "&type=" + type
        + "&v=" + version;
        $("#frameMap").attr("src", url);
    }
    else {
        $("#frameMap").contents()[0].defaultView.getBmapRepeat("", line_code, $("#xb").val(), escape(warningLevel), org_code, org_name, org_type, locomotive_code, escape($("#startTime").val()), escape($("#endTime").val()), escape(position_code), start_km, end_km, $("#gis_x1").val(), $("#gis_y1").val(), $("#gis_x2").val(), $("#gis_y2").val(), zt, afcode, $("#Distance").val(), $("#repeatCount").val(), type) //BMapJS中
        window.sessionStorage.setItem('repeatAlarm_html_start', false);
    }
    SetWhereMemo();
    $("#btnClose").click();
    if ($('#rdo2').hasClass('fxactive')) {
        $('.detail_list_foot img').css({ ' margin-left': '46%', 'margin-top': '18px', 'transform': 'rotate(180deg)', 'transition': 'linear all .3s' })
        $('#detail_list').animate({ height: "122px" })
    } else {
        $('.detail_list_foot img').css({ ' margin-left': '47%', 'margin-top': '15px', 'transform': 'rotate(0)', 'transition': 'linear all .3s' })
        $('#detail_list').animate({ height: "700px" })
    }
    getList_html()
};
//获取列表html
function getList_html() {
    
    if (window.sessionStorage.getItem('repeatAlarm_html_start') == 'true') {
        $('.detail_list_body').html(window.sessionStorage.getItem('repeatAlarm_html'))
        var overlays = $('#frameMap').contents()[0].defaultView.RepeatMap.getOverlays()
        let sum = 0;
        for (var i = 0; i < overlays.length; i++) {
            if (overlays[i].type == 'repeat') {
                sum++
            }
        }
        $('.sumCount').html('（共<span style="color:#46C9FF">' + sum + '</span>条）')
        $('.detail_list_body>div').click(function () {
            var map = $('#frameMap').contents()[0].defaultView.RepeatMap
            var BMap = $('#frameMap').contents()[0].defaultView.BMap
            //let point = new BMap.Point($(this).attr('X'), $(this).attr('Y'))
            //map.setZoom(18)
           // map.setCenter(point)
            $('#frameMap').contents()[0].defaultView.setPoleClick_list(map, BMap, $(this).attr('X'), $(this).attr('Y'));
            //b.getSize();
           // window.open("/Common/MDataAnalysis/C3RepeatAlarmImg.aspx");

        })
    } else {
        setTimeout('getList_html()',1000)
    }
}

//获取选中项
function getSelectedItem(obj) {
    var slct = "";
    for (var i = 0; i < obj.options.length; i++)
        if (obj.options[i].selected == true) {
            slct += ',' + obj.options[i].value;
        }
    return slct.substring(1);
};
//设置选中项
function setSelectdItem(selectobj) {
    $("button span").eq(0).html("新上报, 已计划, 已确认");
    $("#ui-multiselect-ddlzt-option-0").attr("checked", true);
    $("#ui-multiselect-ddlzt-option-1").attr("checked", true);
    $("#ui-multiselect-ddlzt-option-2").attr("checked", true);
    $("#ui-multiselect-ddlzt-option-3").attr("checked", false);
    $("#ui-multiselect-ddlzt-option-4").attr("checked", false);
    var val = "AFSTATUS01,AFSTATUS03,AFSTATUS04";
    for (var i = 0; i < selectobj[0].length; i++)
        if (val.indexOf(selectobj[0][i].value) >= 0) {
            selectobj[0][i].selected = true;
        } else {
            selectobj[0][i].selected = false;
        }
};


//确认/取消报警
function btnRepeatAlarmUpdate() {
    if (yzAlarmData()) {
        //        var json = repeatJson;
        var alarmid = document.getElementById('alarmid').value; //id
        var btntype = document.getElementById('updatetype').value;
        var afcode = document.getElementById('citySel').value; // document.getElementById('dll_zt').value; //缺陷类型
        var severity = document.getElementById('Useverity').value; //等级
        var txtDefect = document.getElementById('UtxtDefect').value; //缺陷分析
        var txtAdvice = document.getElementById('UtxtAdvice').value; //处理建议
        var txtNote = document.getElementById('UtxtNote').value; //备注
        var txtReporter = document.getElementById('UtxtReporter').value; //报告人
        var reportdate = document.getElementById('Ureportdate').value; //日期
        //                var linecode = json[0].LINE_CODE; //线路
        //                var positioncode = json[0].POSITION_CODE; //区站
        //                var detail = json[0].DETAIL; //描述
        //                var x = json[0].GIS_X; //x
        //                var y = json[0].GIS_Y; //y

        //调用更新方法
        var responseData = XmlHttpHelper.transmit(false, "get", "text", "RemoteHandlers/RepeatAlarm.ashx?alarmid=" + alarmid + "&type=manage&btntype=" + btntype + "&txtDefect=" + escape(txtDefect) + "&txtAdvice=" + escape(txtAdvice) + "&txtNote=" + escape(txtNote) + "&txtReporter=" + escape(txtReporter) + "&reportdate=" + reportdate + "&afcode=" + escape(afcode) + "&severity=" + escape(severity) + "&tmpe=" + Math.random(), null, null);
        if (responseData != null && responseData != "") {
            ymPrompt.succeedInfo('保存成功', null, null, '提示信息', null);
        } else {
            ymPrompt.alert('操作失败！请联系管理员', null, null, '提示信息', null);
        }
        document.getElementById('btncols').click();
    }
    else {
        return false;
    }
};

//按钮点击事件
function btnOnClick(btntype) {

    if ("btnTask" == btntype) {
        var url = "../MTask/TaskForm.htm?id=" + GetQueryString("alarmid") + "&type=openFaultTask&openType=" + "&v=" + version;
        ShowMTwin(url);
    } else {
        document.getElementById('modal-update').click();
        if (btntype == "btnOk") {
            document.getElementById('updatetitle').innerHTML = "报警确认";
            document.getElementById('updatetype').value = "btnOk";
            yzAlarmData();
        }
        else {
            document.getElementById('updatetitle').innerHTML = "报警取消";
            document.getElementById('updatetype').value = "btnCan";
            yzAlarmData();
        }
    }
};

//验证数据
function yzAlarmData() {
    var btntype = document.getElementById('updatetype').value;
    var YZ = 0;
    if (btntype == "btnOk") {
        var reportdate = document.getElementById('Ureportdate').value; //日期
        if (reportdate == "") { document.getElementById('UreportdateYZ').className = "control-group error"; YZ = 1; }
        var txtDefect = document.getElementById('UtxtDefect').value; //缺陷分析
        //var afcode = document.getElementById('dll_zt').value; //缺陷类型
        var severity = document.getElementById('Useverity').value; //等级
        // if (afcode != "0") { document.getElementById('afcodeYZ').className = ""; }
        //else if (afcode == "0") { document.getElementById('afcodeYZ').className = "control-group error"; YZ = 1; }
        if (severity != "请选择") { document.getElementById('UseverityYZ').className = ""; }
        else if (severity == "请选择") { document.getElementById('UseverityYZ').className = "control-group error"; YZ = 1; }
        if (txtDefect.replace(/[ ]/g, "") != "" && txtDefect != undefined) { document.getElementById('UtxtDefectYZ').className = ""; }
        else if (txtDefect.replace(/[ ]/g, "") == "" || txtDefect == undefined) { document.getElementById('UtxtDefectYZ').className = "control-group error"; YZ = 1; }
    }
    else if (btntype == "btnCan") {
        var txtDefect = document.getElementById('UtxtDefect').value; //缺陷分析
        if (txtDefect.replace(/[ ]/g, "") != "" && txtDefect != undefined) { document.getElementById('UtxtDefectYZ').className = ""; }
        else if (txtDefect.replace(/[ ]/g, "") == "" || txtDefect == undefined) { document.getElementById('UtxtDefectYZ').className = "control-group error"; YZ = 1; }
    }
    if (YZ != 0) { return false; } else { return true; }
};

function frameGIS() {
    document.getElementById('frameMap').style.display = "";
    document.getElementById('frameJtopo').style.display = "none";
};
function frameJtopo() {
    document.getElementById('frameMap').style.display = "none";
    document.getElementById('frameJtopo').style.display = "";
};


function checkNum(obj) {
    if (window.event.keyCode > '9'.charCodeAt(0) || window.event.keyCode < '0'.charCodeAt(0)) {
        window.event.returnValue = false;
        obj.focus();
    }
};

function setGPS(gis_x1, gis_y1, gis_x2, gis_y2) {
    $("#gis_x1").val(gis_x1);
    $("#gis_y1").val(gis_y1);
    $("#gis_x2").val(gis_x2);
    $("#gis_y2").val(gis_y2);
    $("#rdo2").trigger("click");

    if ($("#div_tj").attr("class") == "dh_in") {
        $("#imgButton").attr("src", "/Common/img/103.png").removeClass("img_in").addClass("img_out");
        $("#div_tj").removeClass("dh_in").addClass("dh_out");
        imgbtn = true;
    }
    //    $("#rdo2").attr("checked", "checked");
};
var json = getCurUser();
function importExcel() {
    var rpJson = $('#frameMap').contents()[0].defaultView.RepeatJsonList;
    if (rpJson != null && rpJson != undefined) {
        var distance = $("#Distance").val();
        $("#json").val(JSON.stringify(rpJson));
        if (json.PersonName == "乌鲁木齐局供电处" || json.PersonName == "乌鲁木齐铁路局") {
            post("/Report/WlmqRepeat.aspx?distance=" + distance + "&startdate=" + escape($("#startTime").val())
        + "&enddate=" + escape($("#endTime").val()));
        } else {
            post("/Report/AlarmRepeatExcel.aspx?distance=" + distance);
        }
    }
    else {
        ymPrompt.errorInfo('未找到要导出的相关信息！', null, null, '提示信息', null);
    }
    //    var ids = "";
    //    if (rpJson != undefined && rpJson != null) {
    //        $.ajax({
    //            type: "POST",
    //            url: "/Report/AlarmRepeatExcel.aspx",
    //            data: { json: JSON.stringify(rpJson) },
    //            async: false,
    //            cache: false,
    //            success: function (result) {
    //                window.open("/Report/AlarmRepeatExcel.aspx");
    //            }
    //        });
    //    }
};

//form post 提交
function post(URL) {
    var temp_form = document.createElement("form");
    temp_form.action = URL;
    temp_form.target = "_blank";
    temp_form.method = "post";
    temp_form.style.display = "none";
    temp_form.appendChild(document.getElementById("json"));

    document.body.appendChild(temp_form);
    temp_form.submit();
};