
//初始加载任务弹框 事件
function loadOriginalFileBox() {

    document.getElementById('loca_strTime').value = datehhssNowStr();
    $('#OriginalFile_TreeAll').myTree({
        type: 'VideoDevice',
        tag: 'LOCOMOTIVE',
        isVideo: '1',
        enableFilter: true,
        isDefClick: false,
        onClick: function (event, treeId, treeNode) {
            if (treeNode.treeType != "LOCOMOTIVE") return;
            $('#locomotive_NB').html(treeNode.name);
            $('#OriginalFile_TreeAll').fadeOut();
            $('.div-menus .ztreeInput').fadeOut(50);

            //加载车厢号列表。
            GetreLations(treeNode.relations);
        },
        callback: function (event, treeId, treeNode, msg) {
            var treeObj = $.fn.zTree.getZTreeObj(treeId);
            treeObj.expandAll(true);

            GetOnline(); //车在线否
        }
    });

    $('#LinePosition').mySelectTree({
        tag: 'STATIONSECTION',
        height: 170,
        enableFilter: true,
        filterNumber: 2,
        //enableCheck: true,
        //chkboxType: { "Y": "s", "N": "s" },
        //nocheck: true,
        //onCheck: function (event, treeId, treeNode) {
        //    var zTree = $.fn.zTree.getZTreeObj(treeId),
        //    nodes = zTree.getCheckedNodes(true),
        //     v = "", code = "";
        //    for (var i = 0, l = nodes.length; i < l; i++) {
        //        v += nodes[i].name + ",";
        //        code += nodes[i].id + ",";
        //    }
        //    if (v.length > 0) v = v.substring(0, v.length - 1);
        //    if (code.length > 0) code = code.substring(0, code.length - 1);
        //    var cityObj = $("#LinePosition");
        //    cityObj.attr("value", v).attr("code", code).attr("treetype", "LINE");
        //},
        onClick: function (event, treeId, treeNode) {
            //var treeObj = $.fn.zTree.getZTreeObj(treeId);
            //treeObj.checkAllNodes(false);
            $('#LinePosition').attr("value", "");
            $('#LinePosition').val(treeNode.name).attr({ "code": treeNode.id, "treetype": treeNode.treeType });
        }        
    });

    //纯设备编号控件
    $('#loca').inputSelect({
        type: 'loca',
        contant: 2
    });
    $('#xingbie').mySelectTree({
        tag: 'Get_Drection',
        height: 200,
        width: 128,
        enableFilter: false,
        onClick: function (event, treeId, treeNode) {
            $('#xingbie').val(treeNode.name).attr({ "code": treeNode.id });
        }
    });
    $("#limit_loco").val(getConfig("LimitNumber"));//现在次数默认值

    $(".div-menus").hover(
	    function () {
	        $('#OriginalFile_TreeAll').fadeIn(50);
	        $('.div-menus .ztreeInput').fadeIn(50);
	        $(this).find("img").attr("src", "/Common/img/playico/xia-blue.png");
	        if (GetIsPowerOrg() == 1) {
	            $("#OriginalFile_TreeAll").empty();
	            $("#OriginalFile_TreeAll").powersection();
	            $('.div-menus .ztreeInput').hide();
	        }
	    },
	    function () {
	        $('#OriginalFile_TreeAll').fadeOut(50);
	        $('.div-menus .ztreeInput').fadeOut(50);
	        $(this).find("img").attr("src", "/Common/img/playico/xia.png")
	    }
    );

    $(".newcreat_title_p2").click(function () {
        $("#newcreat_time").hide();
        $("#newcreat_loca").show();
        $(this).addClass("newcreat_title_active").siblings().removeClass("newcreat_title_active");
        $(".newcreat_title_p1").css("borderBottom", "2px solid #488cb4");
        $(this).css("borderBottom", "none")
    });

    $("#newcreat_loca>h4>.newcreat_loca_img").click(function () {
        var imgsrc = $(this).attr("src");
        if (imgsrc == "/Common/MAlarmMonitoring/img/open.png") {
            $(this).attr("src", "/Common/MAlarmMonitoring/img/close.png");
        } else {
            $(this).attr("src", "/Common/MAlarmMonitoring/img/open.png");
        }
        $("#newcreat_loca_set").toggle();
    });


    $(".newcreat_title_p1").click(function () {
        $("#newcreat_time").show();
        $("#newcreat_loca").hide();
        $(this).addClass("newcreat_title_active").siblings().removeClass("newcreat_title_active");
        $(this).css("borderBottom", "none");
        $(".newcreat_title_p2").css("borderBottom", "2px solid #488cb4");
    });


















    //时间方式点击请求
    $("#BtnSubmit_time").click(function () {
        var taskname_time = $("#taskname_time").val(); //任务名称
        var Locomotivecode = $("#locomotive_NB").text(); //车号
        var Startime = $("#new-strTime").val(); //开始时间
        var Endtime = $("#new-endTime").val(); //结束时间
        var BowPostition = ""; //所选弓位置
        GetLocaPlayMemo_GTs(Locomotivecode);//根据车号取得json
        $("#OriginalFile_txt_AB").find("input[name='GWZ']").each(function () {
            if ($(this).is(":checked")) {
                var Values = $(this).val();
                var ip = GetIp_down(json_config_json, Values);  //取得弓位置
                BowPostition = ip.replace(Locomotivecode, "").replace("#", "%23");
            }
        })
        var alarmID = GetQueryString('alarmid')
        if (checkCondition(taskname_time, Locomotivecode, Startime, Endtime)) {
            var _url = '/C3/PC/MLiveStreaming/RemoteHandlers/OriginalFile.ashx?action=createTask&taskname=' + taskname_time + '&tasktype=time&alarmid='+alarmID+'&linecode=&positioncode=&brgtuncode=&direction=&polenumber=&polecode=&kmmark=&starttime=' + Startime + '&limittimes=&limitendtime=' + Endtime + '&limitlocomotive=' + Locomotivecode + '&bowposition=' + BowPostition;
            layer.load();
            $.ajax({
                type: 'POST',
                url: _url,
                async: true,
                cache: false,
                success: function (result) {
                    layer.closeAll('loading');
                    var _json;
                    if (result != "" && result != null) {
                        _json = result;
                        if (_json == "True") {
                            layer.alert("创建任务成功", { icon: 6 }, function (index) { layer.closeAll() });
                        } else {
                            layer.alert("创建任务失败", { icon: 5 });
                        }
                    }
                }
            })
        } else {
            return false;
        }
    });

    //位置方式点击请求
    $("#BtnSubmit_loca").click(function () {
        var taskname = $("#taskname").val(); //任务名称
        var line_code;
        var position_code;
        var brgtuncode;
        var lp_type = $("#LinePosition").attr("treetype"); //线路区站类型
        if (lp_type == "LINE") {
            line_code = $("#LinePosition").attr("code");
        } else {
            position_code = $("#LinePosition").attr("code");
        }
        var xingbie = '0'//行别
        if ($('#xingbie').val() != '') {
            xingbie = $('#xingbie').attr('code')
        }
        var pole_num = $("#pole_NUM").val();//杆号
        var loca_strTime = $("#loca_strTime").val(); //开始时间
        var limit_loco = $("#limit_loco").val(); //次数限制
        var loca_endTime = $("#loca_endTime").val(); //结束时间
        var loco_check = ''; //已选车号
        $('#checked_loca').find('span').each(function () {
            loco_check += $(this).attr("id") + ',';
        })
        loco_check = loco_check.substring(0, loco_check.length - 1);
        var alarmID = GetQueryString('alarmid')
        if (checkloca(taskname, lp_type, xingbie, pole_num, loca_strTime, limit_loco, loca_endTime)) {
            var _url = '/C3/PC/MLiveStreaming/RemoteHandlers/OriginalFile.ashx?action=createTask&taskname=' + escape(taskname) + '&tasktype=address&alarmid=' + alarmID + '&linecode=' + line_code + '&positioncode=' + position_code + '&brgtuncode=' + brgtuncode + '&direction=' + escape(xingbie) + '&polenumber=' + escape(pole_num) + '&polecode=&kmmark=&starttime=' + loca_strTime + '&limittimes=' + limit_loco + '&limitendtime=' + loca_endTime + '&limitlocomotive=' + loco_check + '&bowposition=';
            layer.load();
            $.ajax({
                type: 'POST',
                url: _url,
                async: true,
                cache: false,
                success: function (result) {
                    layer.closeAll('loading');
                    var _json;
                    if (result != "" && result != null) {
                        _json = result;
                        if (_json == "True") {
                            layer.alert("创建任务成功", { icon: 6 }, function (index) { layer.closeAll(); });
                        } else {
                            layer.alert("创建任务失败", { icon: 5 });
                        }
                    }
                }
            })
        } else {
            return false;
        }
    });
}

//加载默认位置信息
function loadOriginalFile_location(type, stime, LOCNO, BOW_TYPE, line, LINE_CODE, position, POSITION_CODE, BRIDGE_TUNNEL_NO, DIRECTION, POLE_NUMBER) {
    if (LOCNO != undefined && LOCNO != 'undefined') {
        $('#locomotive_NB').html(LOCNO);//选择车
        GetreLations(GetLocomotive(LOCNO).RELATIONS);//加载弓
        $("#OriginalFile_txt_AB").find("label").each(function () {//选择默认弓
            if ($(this).text() == BOW_TYPE) {
                $(this).find('input').attr("checked", true)
            }
           //console.log($(this).text())
        })
        $('#new-strTime,#new-endTime,#loca_strTime').val(stime)//加载默认时间
        
    }
    if (LINE_CODE != '' && LINE_CODE != undefined && LINE_CODE != 'undefined') {
        $("#LinePosition").attr("treetype", 'LINE')
        $("#LinePosition").attr('code', LINE_CODE).val(line).attr("disabled", "disabled").css("cursor", "no-drop").next().hide();

    }
    if (POSITION_CODE != '' && POSITION_CODE != undefined && POSITION_CODE != 'undefined') {
        $("#LinePosition").attr("treetype", 'POSITION')
        $("#LinePosition").attr('code', POSITION_CODE).val(line + ' ' + position).attr("disabled", "disabled").css("cursor", "no-drop").next().hide()
    }
    if (DIRECTION != undefined && DIRECTION != 'undefined') {
        $("#xingbie").val(DIRECTION).attr('code', DIRECTION).attr("disabled", "disabled").css("cursor", "no-drop").next().hide(); //行别
    }
    if (POLE_NUMBER != undefined && POLE_NUMBER != 'undefined') {
        $("#pole_NUM").val(POLE_NUMBER).attr("disabled", "disabled"); //杆号
    }
    if (type != 'time') {
        $(".newcreat_title_p2").click();//切换标签  为位置
    } else {
        $(".newcreat_title_p1").click();//切换标签  为时间
        $(".div-menus").unbind('hover')
    }
}

//清除默认位置信息
function resetOriginalFile_location() {
    $('#checked_loca').html('');
    $('#OriginalFileBox input').val('').attr({ 'code': '', 'treetype': '' }).attr("disabled", false).css("cursor", "defult").next().show();
    $('#locomotive_NB').html('请选择');
    $('#OriginalFile_txt_AB').html('');
    $("#limit_loco").val(getConfig("LimitNumber"));//现在次数默认值
    //document.getElementById('loca_strTime').value = datehhssNowStr();
}


//车在线否
function GetOnline() {
    var url = '/C3/PC/MLiveStreaming/RemoteHandlers/VideoDeviceInfoHandler.ashx?type=getOnlineLoco';
    $.ajax({
        type: "POST",
        url: url,
        async: true,
        cache: false,
        success: function (result) {

            $('.level2').each(function () {
                var _id = $(this).attr('id');
                var span_id = _id + "_span"; //   TreeAll_7_span
                var c_loco = $('#' + span_id).text();
                var relist = result.split(',');
                for (var i = 0; i < relist.length; i++) {
                    if (relist[i].indexOf(c_loco) > -1) {

                        $('#' + span_id).css("color", "green");
                        $('#' + span_id).attr('onlinePort', relist[i]); // _A _B #1_A #1_B #2_A #2_B
                        break;
                    }
                    else {
                        $('#' + span_id).css("color", "#333");
                    }
                }
            })
        },
        error: function () { }
    });
};

//点击加载车号
function add_trainNo() {
    var trainNo = $("#loca").val();
    var checkhtml = $("#checked_loca").html();
    if (checkhtml.indexOf(trainNo) == -1) {
        checkhtml += '<span id="' + trainNo + '">' + trainNo + '&nbsp;&nbsp;<img style="cursor:pointer;vertical-align: initial;" src="/C3/PC/MAlarmMonitoring/ImgTmp/send-del.png" /></span>';
    } else {
        return;
    };
    $("#loca").val("");
    $("#checked_loca").html(checkhtml);
    $('#checked_loca span img').click(function () {
        $(this).parent().remove();
    })
};

//加载弓
function GetreLations(relations) {
    var html = "";
    if (relations != "") {
        var Array_relations = relations.split('#');
        for (var i = 0; i < Array_relations.length; i++) {
            for (var j = 0; j < Array_relations[i].split(':')[1].split(',').length; j++) {
                var code = "ip" + (i + 1);
                if (j == 0) {
                    code = code + "_A";
                } else {
                    code = code + "_B";
                }
                //html += "<li><a href='#' style='width: 50px' code='" + code + "'>" + Array_relations[i].split(':')[1].split(',')[j] + "车</a></li>";
                html += '<div class="span3"><label for="' + Array_relations[i].split(':')[1].split(',')[j] + '"><input id="' + Array_relations[i].split(':')[1].split(',')[j] + '" type="radio" checked name="GWZ" value="' + code + '" />' + Array_relations[i].split(':')[1].split(',')[j] + '车</label></div>'
            }
        }
    } else {
        html = '<div class="span3"><label for="4a"><input id="4a" type="radio" name="GWZ" value="ip_A" checked />4车</label></div><div class="span3"><label for="6b"><input id="6b" type="radio" name="GWZ" value="ip_B" checked />6车</label></div>';
    }
    $('#OriginalFile_txt_AB').html(html);
};

//开始时间点击后结束时间自动增加5S
function changeEndTime() {
    var Startime = $("#new-strTime").val(); //开始时间
    var d = new Date();
    if (Startime != "") {
        d.setTime(new Date(Startime).getTime() + 5000);
        $("#new-endTime").val(d.format("yyyy-MM-dd hh:mm:ss"));
    }
};

//时间选项下面表单验证
function checkCondition(taskname_time, Locomotivecode, Startime, Endtime) {
    if (taskname_time == "") {
        layer.msg("请填写任务名称!", { icon: 5 });
        return false;
    } else {
        var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？%+_]");
        if (pattern.test(taskname_time)) {
            layer.msg("任务名称输入错误!", { icon: 5 });
            return false;
        }
    }
    if (Locomotivecode == "请选择") {
        layer.msg("请选择车号!", { icon: 5 });
        $(".layui-layer-ico5").parent().parent().css('backgroundColor', 'white');
        return false;
    };
    if (Startime == "") {
        layer.msg("请选择开始时间!", { icon: 5 });
        $(".layui-layer-ico5").parent().parent().css('backgroundColor', 'white');
        return false;
    };
    if (Endtime == "") {
        layer.msg("请选择结束时间!", { icon: 5 });
        $(".layui-layer-ico5").parent().parent().css('backgroundColor', 'white');
        return false;
    };
    if (new Date(Startime).getTime() > new Date(Endtime).getTime()) {
        layer.msg("开始时间必须小于结束时间", { icon: 5 });
        $(".layui-layer-ico5").parent().parent().css('backgroundColor', 'white');
        return false;
    } else if ((new Date(Endtime).getTime() - new Date(Startime).getTime()) > 60000) {
        layer.msg("时间长度不超过1分钟!", { icon: 5 });
        $(".layui-layer-ico5").parent().parent().css('backgroundColor', 'white');
    }
    else {
        return true;
    }
};
//位置选项下面表单验证
function checkloca(taskname, lp_type, xingbie, pole_num, loca_strTime, limit_loco, loca_endTime) {
    if (taskname == "") {
        layer.msg("请填写任务名称!", { icon: 5 });
        return false;
    } else {
        var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？%+_]");
        if (pattern.test(taskname)) {
            layer.msg("任务名称输入错误!", { icon: 5 });
            return false;
        }
    }
    if (lp_type == "" || lp_type == undefined) {
        layer.msg("请选择线路区站!", { icon: 5 });
        return false;
    };
    if (xingbie == "") {
        layer.msg("请选择行别!", { icon: 5 });
        return false;
    };
    if (pole_num == "") {
        layer.msg("请填写杆号!", { icon: 5 });
        return false;
    };
    if (loca_strTime == "") {
        layer.msg("请选择开始时间!", { icon: 5 });
        return false;
    }
    if (!(/^[0-9]*[1-9][0-9]*$/).test(limit_loco) && limit_loco != "") {
        layer.msg("次数限制输入错误!", { icon: 5 });
        return false;
    }
    if (limit_loco == "" && loca_endTime == "") {
        layer.msg("次数限制和截止时间不能同时为空!", { icon: 5 });
        return false;
    }
    if (loca_endTime != "") {
        if (new Date(loca_strTime).getTime() > new Date(loca_endTime).getTime()) {
            layer.msg("开始时间必须小于结束时间", { icon: 5 });
            return false;
        }
    }

    return true;
};

function GetIp_down(json, code) {
    switch (code) {
        case "ip1_A":
            if (json.ip1_A != undefined) {
                return json.car1_A;//16编组，
            }

            if (json.ipA != undefined) {
                return json.carA;//非16编组，改过默认车厢号
            }

            break;
        case "ip1_B":

            if (json.ip1_B != undefined) {
                return json.car1_B; //16编组，
            }

            if (json.ipB != undefined) {
                return json.carB;//非16编组，改过默认车厢号
            }

            break;
        case "ip2_A":
            return json.car2_A;
            break;
        case "ip2_B":
            return json.car2_B;
            break;
        case "ip_A":
            if (json_config_json.VIDEO_VENDOR == "GT2-HIKVISION-DC") { //动车
                return json.carA;
            } else {
                return json.ipA;
            };
            break;
        case "ip_B":
            if (json_config_json.VIDEO_VENDOR == "GT2-HIKVISION-DC") { //动车
                return json.carB;
            } else {
                return json.ipB;
            };
            break;
    }
};

//得到设备播放参数。
function GetLocaPlayMemo_GTs(locomotiveCode) {
    var url = '/C3/PC/MLiveStreaming/RemoteHandlers/VideoDeviceInfoHandler.ashx?type=getLocomotiveVideoInfo_GT&locomotiveCode=' + escape(locomotiveCode);
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        cache: false,
        success: function (result) {
            if (result != "") {
                json_config_json = eval('(' + result + ')');
            }
        }
    })
};