//全局变量
var pageSize = 11; //一页显示条数
var pageIndex; //某页
var positionCode;
var positionType;
var direction;
var s_time;
var e_time;
var _treeType = "VideoDevice";
var json_config_json;  //车弓位置
var layer_index = '';
$(function () {
    //线路区站控件
    $('#line-position').mySelectTree({
        tag: 'STATIONSECTION',
        height: 250,
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
        //    var cityObj = $("#line-position");
        //    cityObj.attr("value", v).attr("code", code).attr("treetype", "LINE");
        //},
        onClick: function (event, treeId, treeNode) {
            //var treeObj = $.fn.zTree.getZTreeObj(treeId);
            //treeObj.checkAllNodes(false);
            $('#line-position').attr("value", "");
            $('#line-position').val(treeNode.name).attr({ "code": treeNode.id, "treetype": treeNode.treeType });
        }
    });
    $('#LinePosition').mySelectTree({
        tag: 'STATIONSECTION',
        height: 250,
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
    $('#line-position').next().css('top', '-4px');
    $('#LinePosition').next().css('top', '-12px');

    //按组织机构选择设备编号控件
    $('#original_loco').LocoSelect({
        position: 'MonitorLocoAlarmList'
    });
    //纯设备编号控件
    $('#original_loco').inputSelect({
        type: 'loca',
        contant: 2
    });
    //纯设备编号控件
    $('#loca').inputSelect({
        type: 'loca',
        contant: 2
    });
    //行别
    $('#direction').mySelectTree({
        tag: 'Get_Drection',
        height: 50,
        width: 128,
        enableFilter: false,
        onClick: function (event, treeId, treeNode) {
            $('#direction').val(treeNode.name).attr({ "code": treeNode.id });
        }
    });
    $('#xingbie').mySelectTree({
        tag: 'Get_Drection',
        height: 50,
        width: 128,
        enableFilter: false,
        onClick: function (event, treeId, treeNode) {
            $('#xingbie').val(treeNode.name).attr({ "code": treeNode.id });
        }
    });
    $('#direction').next().css('top', '-4px');
    $('#xingbie').next().css('top', '-12px');

    $('#original_loco').next().css('top', '3px');

    //默认时间
    document.getElementById('s-time').value = DateLastWeekTime() + "00:00:00";
    document.getElementById('e-time').value = dateNowStr() + "23:59:59";
    document.getElementById('loca_strTime').value = datehhssNowStr();

    if ($(document).height() < 910) {
        pageSize = 10;
    };
    if ($(document).height() < 770) {
        pageSize = 8;
    };

    $("#Form1").validationEngine({
        validationEventTriggers: "blur",  //触发的事件  "keyup blur",   
        inlineValidation: true, //是否即时验证，false为提交表单时验证,默认true   
        success: false, //为true时即使有不符合的也提交表单,false表示只有全部通过验证了才能提交表单,默认false
        promptPosition: "topLeft" //提示位置，topLeft, topRight, bottomLeft,  centerRight, bottomRight
    });

    $('#OriginalFile_TreeAll').myTree({
        type: _treeType,
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
    //机车屏蔽“按位置获取数据”功能
    var isCRH = FunEnable("Fun_isCRH");
    if (isCRH == 'False') {
        $('.newcreat_title_p2').hide();
        $('.newcreat_title_empty').css('width','74%')
    }

    //新建任务
    $("#newcreat").click(function () {
        layer_index = layer.open({
            title: false,
            closeBtn: 0,
            area: '521px',
            type: 1,
            shade: 0.5,
            content: $("#OriginalFile")
        });
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

    var alarmID = GetQueryString("alarmid");
    //console.log(alarmID);
    if (alarmID != null && alarmID != "") {
        ////$(".newcreat_title_p1").hide(); //隐藏时间选项
        //$("#LinePosition").attr("treetype", "POSITION").attr("code", GetQueryString("positioncode")).val(GetQueryString("line") +' '+ GetQueryString("position"));  //线路区站，默认显示区站
        //$("#xingbie").val(GetQueryString("direction")).attr('code', GetQueryString("direction")); //行别
        //$("#pole_NUM").val(GetQueryString("pole")); //杆号
        
        //$("#LinePosition").attr("disabled", "disabled").css("cursor", "no-drop");
        //$("#xingbie").attr("disabled", "disabled").css("cursor", "no-drop");
        //$("#pole_NUM").attr("disabled", "disabled");
        ////$(".newcreat_title_empty").width("74%");
        //if (GetQueryString("tyep") == "NewCreat") {
        //    $("#newcreat").click();
        //    $(".newcreat_title_p2").click();
        //} else {
        //    $("#original_ID").val(alarmID);
        //}
        $('#original_ID').val(alarmID);
        document.getElementById('s-time').value = '';

    }
    //else {
        $(".newcreat_title_p1").click(function () {
            $("#newcreat_time").show();
            $("#newcreat_loca").hide();
            $(this).addClass("newcreat_title_active").siblings().removeClass("newcreat_title_active");
            $(this).css("borderBottom", "none");
            $(".newcreat_title_p2").css("borderBottom", "2px solid #488cb4");
        });
    //}
    var loca = GetQueryString("locno");
    if (loca != null && loca != '') {
        $('#locomotive_NB').text(loca);
        GetreLations(GetLocomotive(loca).RELATIONS);
    }
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
                var dev_code = json_config_json.LOCOMOTIVE_CODE;
                if (dev_code.indexOf("CR") != -1)
                    BowPostition = ip.replace(Locomotivecode, "").replace("#", "%23");//根据原来动车方式获取A和B端
                else
                BowPostition = Values.replace("ip", "");//机车情况下，JS从前端获取A或B端（前端获取的A和B端分别对应ip_A和ip_B）
            }
        })

        if (checkCondition(taskname_time,Locomotivecode, Startime, Endtime)) {
            var _url = '/C3/PC/MLiveStreaming/RemoteHandlers/OriginalFile.ashx?action=createTask&taskname=' + taskname_time + '&tasktype=time&alarmid=&linecode=&positioncode=&brgtuncode=&direction=&polenumber=&polecode=&kmmark=&starttime=' + Startime + '&limittimes=&limitendtime=' + Endtime + '&limitlocomotive=' + Locomotivecode + '&bowposition=' + BowPostition;
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
                            layer.alert("创建任务成功", { icon: 6 });
                            doquery();//查询
                            layer.close(layer_index);
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
            if (alarmID != null && alarmID != "") {
                line_code = GetQueryString("linecode");
                brgtuncode = GetQueryString("Bridgecode");
            }
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

        if (checkloca(taskname, lp_type, xingbie, pole_num, loca_strTime, limit_loco, loca_endTime)) {
            var _url = '/C3/PC/MLiveStreaming/RemoteHandlers/OriginalFile.ashx?action=createTask&taskname=' + escape(taskname) + '&tasktype=address&alarmid=' + alarmID + '&linecode=' + escape(line_code) + '&positioncode=' + escape(position_code) + '&brgtuncode=' + escape(brgtuncode) + '&direction=' + escape(xingbie) + '&polenumber=' + escape(pole_num) + '&polecode=&kmmark=&starttime=' + loca_strTime + '&limittimes=' + limit_loco + '&limitendtime=' + loca_endTime + '&limitlocomotive=' + loco_check + '&bowposition=';
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
                            layer.alert("创建任务成功", { icon: 6 });
                            doquery();//查询
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

    doquery();//查询

    $(".j-query-alarm").click(function () {
        if ($("#Form1").validationEngine("validate")) {
            doquery();//查询
        }
    });
    //关闭当前页
    $('.j-close').click(function () {
        window.close();
    });
    //滚动事件
    $("#inner_cont").scroll(function () {
        if ($(this).scrollTop() > 1) {
            $(".inner-head").css({ "position": "absolute","z-index":"99999" ,"background": "#ccc", "top": $("#inner_cont").scrollTop() + 'px' });
            $('#inner-body').css('padding-top','46px');
        } else {
            $(".inner-head").css({ "position": "static", "background": "", "top": "" });
            $('#inner-body').css('padding-top', '0');
        }
    });
});

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
    if (!(/^[0-9]*[1-9][0-9]*$/).test(limit_loco) && limit_loco !="") {
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
                return json.ip_A;
            };
            break;
        case "ip_B":
            if (json_config_json.VIDEO_VENDOR == "GT2-HIKVISION-DC") { //动车
                return json.carB;
            } else {
                return json.ip_B;
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

//查询
function doquery() {
    var original_name = $("#original_name").val(); //任务名称
    var original_loco = $("#original_loco").val(); //设备编号
    var sTime = $("#s-time").val(); //开始时间
    var eTime = $("#e-time").val(); //结束时间
    var original_ID = $("#original_ID").val(); //报警id
    var original_state = $("#original_state").val(); //任务状态
    var linePositionType = $("#line-position").attr("treetype"); //线路区站类型
    var linePositionCode = $("#line-position").attr("code"); //线路区站code
    var direction = '0'//行别
    if ($('#direction').val() != '') {
        direction = $('#direction').attr('code')
    }
    var sKM = $("#s-KM").val(); //开始公里标
    var eKM = $("#e-KM").val(); //结束公里标
    var original_pole = $("#original_pole").val(); //杆号
    var URL;
    if (sKM != "" && eKM !="" && parseInt(sKM) > parseInt(eKM)) {
        layer.msg("起始公里标不能大于结束公里标", { icon: 5 });
        return false;
    }
    if (new Date(sTime).getTime() > new Date(eTime).getTime()) {
        layer.msg("开始时间必须小于结束时间", { icon: 5 });
        return false;
    }
    layer.load();
    $('#paging').paging({
        index: 1,
        url: function () {
            pageIndex = $('.pageValue').val();
            var url = '/C3/PC/MLiveStreaming/RemoteHandlers/OriginalFile.ashx?action=queryTask'
            + '&taskname=' + original_name
            + '&alarmid=' + original_ID
            + '&positiontype=' + linePositionType
            + '&positioncode=' + linePositionCode
            + '&direction=' + direction
            + '&polenumber=' + original_pole
            + '&startkmmark=' + sKM
            + '&endkmmark=' + eKM
            + '&starttime=' + sTime
            + '&endtime=' + eTime
            + '&limitlocomotive=' + original_loco
            + '&taskstatus=' + original_state
            + '&pagesize=' + pageSize
            + '&pageindex=' + pageIndex;
            return url;
        },
        success: function (result) {
            layer.closeAll('loading');
            if (result.data.length > 0) {
                var _HTML = "";
                document.getElementById("inner-body").innerHTML = ""; //清空内容
                for (var i = 0; i < result.data.length; i++) {
                    var Handle, imgsrc,alarm_ico;
                    if (result.data[i].taskstatus == "处理中") {
                        //Handle = '<a href="#" class="btn btn-primary btnPush" alarmid="' + result.data[i].taskid + '">暂停</a>';
                        Handle = '<span class="curserImg play_img btnPush"  title="暂停" alarmid="' + result.data[i].taskid + '"></span>'
                    } else if (result.data[i].taskstatus == "暂停") {
                        //Handle = '<a href="#" class="btn btn-primary btnPush" alarmid="' + result.data[i].taskid + '">下载</a>';
                        Handle = '<span class="curserImg stop_img btnPush" title="下载" alarmid="' + result.data[i].taskid + '"></span>'

                    } else {
                        Handle = "";
                    }

                    if (result.data[i].data.length > 0) {
                        imgsrc = '<img class="line_Click open_img" src="/Common/MAlarmMonitoring/img/open.png" Index="' + i + '" />';
                    } else {
                        imgsrc = '<img class="open_img" src="/Common/MAlarmMonitoring/img/close.png" />';
                        //imgsrc = '';
                    }
                    if (result.data[i].alarmid != '-' && result.data[i].alarmid != '') {
                        alarm_ico = '<span class="curserImg alarm_img" data-original-title="查看原由缺陷" data-html="true" data-rel="tooltip"  herf="/C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=' + result.data[i].alarmid + '"></span>'
                    } else {
                        alarm_ico = '';
                    }
                    if (result.data[i].tasktype == "time") { //按时间创建的任务
                        var playImg = '';
                        var Fileurl = "-";
                        if (result.data[i].data.length > 0) {
                            Fileurl = result.data[i].data[0].fileurl_net.replace(/%5C/g, "\\");
                        }
                        for (var j = 0; j < result.data[i].data.length; j++) {//遍历子任务有无可播放的
                            if (result.data[i].data[j].taskqueuesattus == '可播放') {
                                playImg = '<span class="curserImg vedio_img" title="播放" limitloco="' + result.data[i].limitloco + '" starttime="' + result.data[i].task_start_timestamp + '" endtime="' + result.data[i].task_end_timestamp + '" stimetime="' + result.data[i].starttime + '" etimetime="' + result.data[i].limitendtime + '" bow="' + result.data[i].data[j].bowname + '" taskid="' + result.data[i].taskid + '" queueid=""></span>'
                                break;
                            }
                        }
                        //playImg = '<span class="curserImg vedio_img" title="播放" limitloco="' + result.data[i].limitloco + '" starttime="' + result.data[i].task_start_timestamp + '" endtime="' + result.data[i].task_end_timestamp + '"></span>'
                        _HTML += '<div class="row-fluid"><div class="row-fluid row_color"><span class="original_half">' + imgsrc + '</span><span class="original_TYPE">' + result.data[i].source + '</span><span class="original_2" title="' + result.data[i].taskname + '">' + result.data[i].taskname + '</span><span class="original_eight">按时间</span><span class="original_4">' + result.data[i].limitloco + '&nbsp;&nbsp;' + result.data[i].starttime + '—' + result.data[i].limitendtime + '</span><span class="original_3" style="line-height: 18px;">' + Fileurl + '</span><span class="original_one">' + result.data[i].createdatetime + '</span><span class="original_1">' + result.data[i].createusername + '</span><span class="original_1">' + result.data[i].taskstatus + '</span><span class="original_do">' + Handle + alarm_ico + playImg + '</span></div><div class="original-twoli"></div></div>';
                    } else {//按位置创建的任务
                        var WZ;
                        WZ = (result.data[i].linename == "" ? "" : (result.data[i].linename + '&nbsp;&nbsp;')) + (result.data[i].positionname == "" ? "" : (result.data[i].positionname + '&nbsp;&nbsp;')) + (result.data[i].brg_tun_name == "" ? "" : (result.data[i].brg_tun_name + '&nbsp;&nbsp;')) + (result.data[i].direction == "" ? "" : (result.data[i].direction + '&nbsp;&nbsp;')) + strToKm(result.data[i].kmmark) + '&nbsp;&nbsp;' + result.data[i].pole_num + '支柱' +  '<br />' + (result.data[i].limittimes == "0" ? "" : '次数限制:' + result.data[i].limittimes) + '&nbsp;开始时间:' + result.data[i].starttime + (result.data[i].limitendtime == "" ? "" : ' 截止时间:' + result.data[i].limitendtime) + ' 任务数:' + result.data[i].data.length; //位置拼接

                        
                        
                        _HTML += '<div class="row-fluid"><div class="row-fluid row_color"><span class="original_half">' + imgsrc + '</span><span class="original_TYPE">' + result.data[i].source + '</span><span class="original_2" title="' + result.data[i].taskname + '">' + result.data[i].taskname + '</span><span class="original_eight">按位置</span><span class="original_4" style="padding:4px 0;white-space: nowrap;">' + WZ + '</span><span class="original_3">-</span><span class="original_one">' + result.data[i].createdatetime + '</span><span class="original_1">' + result.data[i].createusername + '</span><span class="original_1">' + result.data[i].taskstatus + '</span><span class="original_do">' + Handle + alarm_ico + '</span></div><div class="original-twoli"></div></div>'
                    }

                }
                document.getElementById("inner-body").innerHTML = _HTML;
                line_click(result); //点击加载下一层

                $(".btnPush").click(function () {
                    pushclick(this);//下载或暂停
                });
                $('.alarm_img').tooltip({ "placement": "top", delay: { show: 0, hide: 10 }, });
            
                $('.alarm_img').click(function () {//缺陷原由 跳转详情页面
                    window.open($(this).attr('herf'))
                });
                $('.vedio_img').click(function () {//播放点击  跳播放页面
                    console.log($(this).attr('limitloco'))
                    vedio_img_click(this)
                });
            } else {
                layer.msg("无数据!");
                document.getElementById("inner-body").innerHTML = ""; //清空内容
            }
        }
    });
};

//下一层点击加载
function line_click(result) {
    $(".original_half>img.line_Click").unbind('click').click(function () {
        var tagetDOM = $(this).parent().parent().siblings('.original-twoli');
        tagetDOM.toggle();
        if ($(this).attr("src") == "/Common/MAlarmMonitoring/img/open.png") {
            $(this).attr("src", "/Common/MAlarmMonitoring/img/close.png");
        } else {
            $(this).attr("src", "/Common/MAlarmMonitoring/img/open.png");
        }
        if (tagetDOM.html() != "") {
            return;
        } else {
            var _Index = $(this).attr("Index");
            var _INNERHTML = "";
            var playImgInside = '';
            for (var x = 0; x < result.data[_Index].data.length; x++) {
                if (result.data[_Index].data[x].taskqueuesattus == '可播放') {
                    playImgInside = '<i></i><span class="curserImg vedio_img" title="播放" limitloco="' + result.data[_Index].data[x].locomotivecode + '" starttime="' + result.data[_Index].data[x].start_timestamp + '" endtime="' + result.data[_Index].data[x].end_timestamp + '" stimetime="' + result.data[_Index].data[x].getdatatime + '" etimetime="' + result.data[_Index].data[x].getdatatime + '" bow="' + result.data[_Index].data[x].bowname + '" taskid="" queueid="' + result.data[_Index].data[x].queueid + '"></span>'
                }
              

                _INNERHTML += '<div class="row-fluid row_color"><span class="original_half"></span><span class="original_half">' + (x + 1) + '</span><span class="original_11">' + result.data[_Index].data[x].locomotivecode + '<i></i>' + result.data[_Index].data[x].getdatatime + '<i></i>' + result.data[_Index].data[x].fileurl_net.replace(/%5C/g, "\\") + '<i></i><aside style="display: inline;">' + result.data[_Index].data[x].taskqueuesattus + '</aside>' + playImgInside + '</span>' + '</div>';
            }
            tagetDOM.html(_INNERHTML);
            $('.vedio_img').click(function () {//播放点击  跳播放页面
                vedio_img_click(this)
            });
        }
    })
};

function pushclick(obj) {
    var alarmId = $(obj).attr("alarmid");
    var status;
    if ($(obj).hasClass('play_img')) {
        status = 'PAUSE';
    } else {
        status = 'WAIT';
    }
    $.ajax({
        type: 'POST',
        url: '/C3/PC/MLiveStreaming/RemoteHandlers/OriginalFile.ashx?action=setTaskStatus&taskid=' + alarmId + '&status=' + status,
        async: true,
        cache: false,
        success: function (result) {
            if (result == "True") {
                if ($(obj).hasClass('play_img')) {
                    $(obj).removeClass("play_img").addClass('stop_img').attr('title', '下载');
                    $(obj).parent().prev().text("暂停");
                    if ($(obj).parent().parent().parent().find('aside').text() == '处理中') {
                        $(obj).parent().parent().parent().find('aside').text('暂停')
                    }
                    
                } else {
                    $(obj).removeClass("stop_img").addClass('play_img').attr('title', '暂停');
                    $(obj).parent().prev().text("处理中");
                    if ($(obj).parent().parent().parent().find('aside').text() == '暂停') {
                        $(obj).parent().parent().parent().find('aside').text('处理中')
                    }
                }
            } else {
                layer.msg("处理失败!");
            }
        }
    });
};

//跳转播放页面
function vedio_img_click(obj) {
    var __url = '/Common/LineInspectionDataAnalysis/LineInspection_data_analysis.html?&fromoriginalfile=true&line_code=&line_name=&direction=&position_code=&position_name=&start_time=&end_time=&bigStarttime=&bigEndtime=&starttimestamp=' + $(obj).attr('starttime') + '&endtimestamp=' + $(obj).attr('endtime') + '&locomotive_code=' + $(obj).attr('limitloco') + '&stampst=' + $(obj).attr('stimetime') + '&stampen=' + $(obj).attr('etimetime') + '&whicbow=' + ($(obj).attr('bow') != '' ? escape($(obj).attr('bow') + '车') : '') + '&taskid=' + $(obj).attr('taskid') + '&queueid=' + $(obj).attr('queueid')
    window.open(__url)
}