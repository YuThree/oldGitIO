/*========================================================================================*
* 功能说明：3C缺陷列表，报警列表。
* 注意事项：
* 作    者： zzj
* 版本日期：2015年1月6日
* 变更说明：改为1C-6C通用。 缺陷列表，报警列表。

页面参数        说明                        例子
data_type       &data_type=FAULT            设置显示“报警”还是“缺陷”,不传默认“报警”

* 版 本 号： V1.1.0
*=======================================================================================*/

var option; //存放表格内容
var data_type;
//var _data_type = 'ALARM';//
var _data_type = ""; //默认为空防止导出缺陷报表时数据不对应
var t_closeImgBox;
var over_alarmID = '';
var progressBar = "";//2016 8 5 加入进度条
var limitCount = getConfig("ExportLimit");
var IsPowerOrg = GetIsPowerOrg();
var StatisticsSign = '';//是否为链接页面查询
var openTime = 0;//进入页面初始查询次
var IsSpark = GetQueryString('is_spark'); //是否是燃弧分析页面连接过来参数
var sample_url; //样本文件路径
var alarmStatus = GetQueryString("alarmStatus");//报警状态
var CatheTime = '';

$(document).ready(function () {
    if (GetQueryString('IsAbnormity') == '0') {
        $('#IsAbnormity', document).find('option[value=0]').attr('selected', 'selected ');
    };
    GetLabel("IsAbnormity", "text", $('#IsAbnormity option:selected').html());//数据范围（正常/异常）
    if (FunEnable('Fun_TaskManage') == "False") { $('#S_btnExlnew').next().find('.Mission').hide() }
    if (FunEnable('Fun_portOutOne') == "True") { $('#S_btnCombine').css('display', '') }
    if (FunEnable('Fun_portOutMore') == "True") { $('#S_btnMore').css('display', '') }
    if (FunEnable('Fun_portOutWeekend') == "True") { $('#S_btnWeekend').css('display', '') }
    if (FunEnable('Fun_portOutWeekend_cld') == "True") { $('#S_btnWeekend_cld').css('display', '') }
    if (FunEnable('Fun_portOutWeekendRepeat') == "True") { $('#S_btnsumRepeat').css('display', '') }
    if (getConfig('For6C') == 'DPC') { $('#import3C').css('display', '') }
    if (FunEnable('Fun_isCRH') == "False" && getConfig('debug') == "1") { $('#carTypeSelect').css('display', '') }//车型选择
    if (FunEnable('Fun_deal_time') == "True") { $('#deal_startdate').parent().css('display', '') }//处理时间
    if (FunEnable('Fun_notIncludedRepeatHistory') == "True") { $('#S_btn_notIncludedRepeatHistory').show() }
    if (FunEnable('Fun_RepeatTypeWithAlarmType') == "True") { $('#chooseRepeatBtn').parent().show() }//去重复
    if (FunEnable('Fun_Original') == "True") { $('#S_btnNot_oneOriginal').show() }//原始文件批量

    if (FunEnable('Fun_bow') === 'True') { //新准弓位置过滤
        var _html_1 = '<option value="0">全部</option>\
                    <option value="A弓">A弓</option>\
                    <option value="B弓">B弓</option>';
        $('#txt_bow').html(_html_1);
    } else {
        var _html_2 = '<option value="0">全部</option>\
                    <option value="A弓">A弓</option>\
                    <option value="B弓">B弓</option>\
                    <option value="2车">2车</option>\
                    <option value="3车">3车</option>\
                    <option value="4车">4车</option>\
                    <option value="6车">6车</option>\
                    <option value="7车">7车</option>\
                    <option value="10车">10车</option>\
                    <option value="15车">15车</option>';
        $('#txt_bow').html(_html_2);
    }

    if (getConfig('debug') == "1") {
        $('#IsAbnormitySelect').show()
        $('#IsLock').parent().show()
        $('#IsTransmit').parent().show()
        //$('#alarm_order').show()
        $('#Parsing_cancel').parent().parent().show()
        $('#Sample_type').parent().show()
        $('.align_span:nth-of-type(3n-1)').css({ 'width': '250px', 'margin-left': '20px' })
        $('.align_span:nth-of-type(3n)').css({ 'width': '250px', 'margin-left': '15px' })
        $('div.align_span:last').css({ 'width': '400px', 'margin-left': '20px' })
        $('.align_span2').css({ 'width': '250px', 'margin-left': '20px' })
        $("#ScenceSample").parents('.align_span').css({ 'width': '520px' })
        $('#importHistory').show();
        $('#ScenceSample').parents('.align_span').show();
        $('#ArcingSize_star').parent().show();
        $('#START_NUM_PIXELS').parent().show();
        $('#criterion').parent().show();
    }

    //内部版本X无行别分为2种情况
    if (getConfig('debug') == "1") {
        $('#direction').mySelectTree({
            tag: 'Get_Drection',
            height: 100,
            width: 128,
            IsShowMoreOption_name: '无法确认,无定位数据',
            IsShowMoreOption_code: '1,2',
            enableFilter: false,
            onClick: function (event, treeId, treeNode) {
                $('#direction').val(treeNode.name).attr({ "code": treeNode.id });
            }
        });
        $('#criterion').mySelectTree({//判断依据
            tag: 'CRITERION',
            height: 100,
            width: 128,
            enableCheck: true,
            chkboxType: { "Y": "s", "N": "s" },
            nocheck: true,
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
                var cityObj = $("#criterion");
                cityObj.attr("value", v).attr("code", code);
            },
            onClick: function (event, treeId, treeNode) {
                if (treeNode.pId != '' && treeNode.pId != undefined) {
                    var treeObj = $.fn.zTree.getZTreeObj(treeId);
                    treeObj.checkAllNodes(false);
                    //treeObj.checkNode(treeNode, !treeNode.checked, null, true);
                    $('#criterion').attr("value", "");
                    $("#criterion").attr('code', treeNode.id).val(treeNode.name);
                } else {
                    return false;
                }
            },
            callback: function () {
                $("#criterion").siblings("a").click(function () {   //清除线判断依据的checkbox勾选
                    $.fn.zTree.getZTreeObj("ULcriterion").checkAllNodes(false);
                });
            }
        });
        
    } else {
        $('#direction').mySelectTree({
            tag: 'Get_Drection',
            height: 100,
            width: 128,
            IsShowMoreOption_name: '无行别',
            IsShowMoreOption_code: '3',
            enableFilter: false,
            onClick: function (event, treeId, treeNode) {
                $('#direction').val(treeNode.name).attr({ "code": treeNode.id });
            }
        });
    }


    $('#seleHeadDiv').mouseleave(function () {
        $("#seleHeadDiv").hide();
    });

    $('#seleHeadDiv').hover(function () {
        clearTimeout(t_closeImgBox);
    });

    $("#Form1").validationEngine({
        validationEventTriggers: "blur",  //触发的事件  "keyup blur",   
        inlineValidation: true, //是否即时验证，false为提交表单时验证,默认true   
        success: false, //为true时即使有不符合的也提交表单,false表示只有全部通过验证了才能提交表单,默认false
        promptPosition: "topLeft" //提示位置，topLeft, topRight, bottomLeft,  centerRight, bottomRight
        //        validateNonVisibleFields: true
    });



    urlControl();

    document.getElementById("_loctree").style.height = $(window).height() - 64 - 15 + "px";
    $('#txt_whereMemo').width($('#txt_whereMemo').width() - $('#txt_whereTitle').width() - 20);

    //老的局-段-车联动选择框，现在不用了
    //var null_option = '<option value="0">全部</option>';
    //$("#juselect").mySelect({
    //    tag: "Organization", code: "TOPBOSS", type: "J"
    //}).change(function () {
    //    var jcode = $(this).val();
    //    if (jcode == "0") {
    //        $("#duanselect").html(null_option);
    //    }
    //    else {
    //        $("#duanselect").mySelect({
    //            tag: "Organization",
    //            code: jcode
    //            //  ,type: "JWD" || "CLD"              
    //        })
    //    }
    //});



    if (GetQueryString("deviceid")) {
        $('#txtloccode').val(GetQueryString("deviceid"));
    }

    //$('#citySel').mySelectTree({
    //    CateGory: 'AFCODE',
    //    CodeType: '3C'
    //})
    //$("#citySel").mySelectTree({
    //    tag: 'SYSDICTIONARYTREE',
    //    codeType: '3C',
    //    cateGory: 'AFCODE',
    //    isDefClick: false,
    //    isSelectChildren: true,
    //    onClick: function (event, treeId, treeNode) {
    //        $("input[id='citySel']").attr("value", treeNode.name);
    //    }
    //});


    $('#btn_openSearch').click(function () {
        if (!$("#chooseRepeatBox").is(":hidden")) {
            $("#chooseRepeatBox").hide(200);
        }
        $('#box_search').modal().css({
            width: 'auto',
            'margin-left': function () {
                return -($(this).width() / 2);
            },
            'margin-top': function () {
                return -($(this).height() / 2);
            }
        });
    });

    $('#btn_search,#S_btnQuery').click(function () {
        var bool = $("#Form1").validationEngine("validate");
        var obj = $(document).find('#ScenceSample');
        var SceneBool = SceneValidate(obj)
        if (bool && SceneBool) {
            doQuery(1);
            $("#myDiv").hide(200);
            //            $('#box_search').modal('toggle')
        }
        $("#S_btnQuery").removeAttr("disabled").removeClass('disabled');
    });

    $('#btn_reset').click(function () {
        ymPrompt.confirmInfo({
            message: '确认要清空查询条件?',
            handler: function (tp) {
                if (tp == 'ok') {
                    $('#search_bg input[type="text"]').val('').attr("code", "");
                    $('#search_bg select').each(function () {
                        $(this).find('option:first').prop("selected", 'selected');
                    });
                    $('#search_bg select[multiple="multiple"]').each(function () {//多选选中取消
                        $(this).val('');
                    });

                    try {
                        var SampleObj = $.fn.zTree.getZTreeObj("ULSample_type");  //清除样本类型选择的checkbox勾选
                        SampleObj.checkAllNodes(false);
                        var locationObj = $.fn.zTree.getZTreeObj("ULlocation");  //清除线路选择的checkbox勾选
                        locationObj.checkAllNodes(false);
                        var QX_markObj = $.fn.zTree.getZTreeObj("ULQX_mark");  //清除缺陷标志的checkbox勾选
                        QX_markObj.checkAllNodes(false);
                        var Parsing_cancelObj = $.fn.zTree.getZTreeObj("ULParsing_cancel");  //清除解析取消的checkbox勾选
                        Parsing_cancelObj.checkAllNodes(false);
                        $.fn.zTree.getZTreeObj("ULcriterion").checkAllNodes(false);//清除判断依据的checkbox勾选

                    } catch (e) { }
                    $('#btn_search,#S_btnQuery').click();
                }
                if (tp == 'cancel') {
                    //  cancelFn();
                }
                if (tp == 'close') {
                    //   closeFn()
                }
            }
        });
    });
    $("#btn_openSearch").click(function (e) {
        if (GetQueryString('IsAbnormity') == '0') {
            $('#IsAbnormity', document).find('option[value=0]').attr('selected', 'selected ');
        }
        if (!$("#myDiv").hasClass("hide")) {
            $("#myDiv").hide("fast");
        }
        $("#myDiv").show("fast", function () {
            //            $(this).css({ "top": "200", "position": "absolute" });
        });
        $("#S_btnQuery").attr("disabled", "disabled").addClass('disabled');
        $("#myDiv,#ULcitySel,#ULddlorg").click(function () { return false; });

        e.stopPropagation();
    });
    $(document).click(function (e) {
        //去重复按钮
        if (!$("#chooseRepeatBox").is(":hidden") && $(e.target).parents("#chooseRepeatBox").length === 0 && $(e.target).attr("id") != 'chooseRepeatBox' && $(e.target).attr("id") != 'chooseRepeatBtn') {
            $('#chooseRepeatBox').hide(200)
        }

        if ($("#Form1").validationEngine("validate") && !$("#myDiv").hasClass("hide") && $(e.target).parents(".ztree").length === 0 && $(e.target).parents("[name='ztree']").length === 0 && $(e.target).parents('.ztree_box').length === 0 && $(e.target).parents('.ui-multiselect-menu').length === 0) {
            if ($(e.target).context.className.indexOf('layui-layer-') >= 0
                || '确定' === $(e.target).context.innerHTML
                || $(e.target).context.innerHTML.indexOf('样本文件路径') >= 0
                || $(e.target).context.innerHTML.indexOf('\\') >= 0) {
                if ($(e.target).context.className.indexOf('layui-layer-shade') < 0 && $(e.target).context.className.indexOf('layui-layer-title') < 0&& $(e.target).context.className.indexOf('layui-layer-content')) {
                    $("#myDiv").show("fast");
                    $("#S_btnQuery").attr("disabled", "disabled").addClass('disabled');
                    $("#myDiv,#ULcitySel,#ULddlorg").click(function () { return false; });
                }
            } else {
                $("#myDiv").hide("fast");
                $('#Form1').validationEngine('hideAll');
                $("#S_btnQuery").removeAttr("disabled").removeClass('disabled');
            }
        }
    });
    GradeClick();//级别点击事件

    //小屏幕样式调整
    if (screen.width <= 1366) {
        $(".justDIV").css("display", "inline-block");
    }
    if (screen.width <= 1280) {
        $(".justLT>.dropdown-menu").css("left", "-134px");
    }

    //去重复按钮start
    $('#chooseRepeatBtn').click(function (e) {
        if (!$("#myDiv").is(":hidden")) {
            $("#myDiv").hide(200);
            $("#S_btnQuery").removeAttr("disabled").removeClass('disabled');
        }

        if (!$('#chooseRepeatBox').is(":hidden")) {
            $('#chooseRepeatBox').hide(200);
        } else {
            if (window.screen.width < 1441 && window.screen.width > 1366) {
                $('#chooseRepeatBox').show(200).css({ 'left': $('#chooseRepeatBtn').offset().left, 'top': $('#chooseRepeatBtn').offset().top + 25 });
            } else if (window.screen.width < 1367 && window.screen.width > 1280) {
                $('#chooseRepeatBox').show(200).css({ 'left': $('#chooseRepeatBtn').offset().left, 'top': $('#chooseRepeatBtn').offset().top + 25 });
            } else if (window.screen.width < 1281 && window.screen.width > 1024) {
                $('#chooseRepeatBox').show(200).css({ 'left': $('#chooseRepeatBtn').offset().left, 'top': $('#chooseRepeatBtn').offset().top + 25 });
            } else if (window.screen.width < 1025) {
                $('#chooseRepeatBox').show(200).css({ 'left': $('#chooseRepeatBtn').offset().left - 120, 'top': $('#chooseRepeatBtn').offset().top + 25 });
            } else {
                $('#chooseRepeatBox').show(200).css({ 'left': $('#chooseRepeatBtn').offset().left + 10, 'top': $('#chooseRepeatBtn').offset().top + 25 });
            }
        }

        if ($(this).hasClass("chooseNotOne")) {
            $(this).removeClass("chooseNotOne").addClass('chooseOne');
            $('#chooseRepeatBtnNot').removeClass("chooseOne").addClass('chooseNotOne');
            if ($(this).attr('first') == 'true') {//初次点击设置选中
                $(this).attr('first', 'false');
                $('.chooseLiMast').removeClass("chooseNotOne").addClass('chooseOne');
            }
        }
        e.stopPropagation();
    })
    $('#chooseRepeatBtnNot').click(function (e) {
        if (!$("#myDiv").is(":hidden")) {
            $("#myDiv").hide(200);
            $("#S_btnQuery").removeAttr("disabled").removeClass('disabled');
        }

        if ($(this).hasClass("chooseNotOne")) {
            $(this).removeClass("chooseNotOne").addClass('chooseOne');
            $('#chooseRepeatBtn').removeClass("chooseOne").addClass('chooseNotOne');
            $('#chooseRepeatBox').hide(200);
        }
        e.stopPropagation();
    })

    $('#chooseRepeatBox div').click(function () {
        if ($(this).hasClass("chooseOne")) {
            $(this).removeClass("chooseOne").addClass('chooseNotOne');
        } else if ($(this).hasClass("chooseNotOne")) {
            $(this).removeClass("chooseNotOne").addClass('chooseOne');
        }
    })
    //去重复按钮end

    //$('#E_save').click(function () {

    //    var alarmID = over_alarmID;
    //    //添加收藏。
    //    var SaveAlarms = getCookieValue("SaveAlarms");
    //    if (SaveAlarms != '') {
    //        if (SaveAlarms.indexOf(alarmID) >= 0) {
    //            //已经存在
    //            //ymPrompt.alert('已经收藏');
    //            DelSaveAlarms(alarmID);
    //            $('#i_save').removeClass("icon-color").addClass("icon-white");
    //            return;

    //        }
    //        else {
    //            SaveAlarms += '_' + alarmID;

    //            $('#i_save').removeClass("icon-white").addClass("icon-color");

    //            // ymPrompt.alert('收藏成功');
    //        }
    //    }
    //    else {
    //        SaveAlarms = alarmID;
    //        $('#i_save').removeClass("icon-white").addClass("icon-color");
    //        //  ymPrompt.alert('收藏成功');
    //    }

    //    deleteCookie("SaveAlarms", "/");
    //    addCookie("SaveAlarms", SaveAlarms, 30, "/");
    //});

    // 加载批量处理弹出框内容
    LoadSaveListBox("DPC");
    LoadSureBox()//加载报警确认框

    //设置标签隐藏的内容显示
    $(document).find('#sample_img').click(function () {
        var str = '<div>正样本库路径：</div><div style="height:24px;">' + sample_url + '</div>';
        layer.alert(str, {
            icon: 1,
            skin: 'layer-ext-moon',
            move: false, //禁止拖动
            closeBtn: 0
        }, function (index) {
            layer.close(index);
        });
    });
});

function get_sample_url() {
    $.ajax({
        type: "POST",
        url: '/C3/PC/MAlarmMonitoring/RemoteHandlers/GetMonitorLocoAlarmList.ashx?action=samplePath',
        cache: false,
        async: true,
        success: function (result) {
            sample_url = result;
        }
    });
}

// 级别点击事件
function GradeClick() {

    $(".red-block").click(function () {
        var show = $(".red-check").css("display");
        if (show != "none") {
            $(this).css({ 'background': 'url("/Common/img/MAlarmMonitoring/Grade-gray1.png") center no-repeat', 'color': '#cecece' });
            $(this).find('.grade-img>img').attr('src', '/Common/img/MAlarmMonitoring/gray-block.png');
            $('.red-check').hide();
        } else {
            $(this).css({ 'background': 'url("/Common/img/MAlarmMonitoring/Grade-red.png") center no-repeat', 'color': '#e02929' });
            $(this).find('.grade-img>img').attr('src', '/Common/img/MAlarmMonitoring/red-block.png');
            $('.red-check').show();
        }
    });
    $(".orange-block").click(function () {
        var show = $(".orange-check").css("display");
        if (show != "none") {
            $(this).css({ 'background': 'url("/Common/img/MAlarmMonitoring/Grade-gray2.png") center no-repeat', 'color': '#cecece' });
            $(this).find('.grade-img>img').attr('src', '/Common/img/MAlarmMonitoring/gray-block.png');
            $('.orange-check').hide();
        } else {
            $(this).css({ 'background': 'url("/Common/img/MAlarmMonitoring/Grade-orange.png") center no-repeat', 'color': '#f29318' });
            $(this).find('.grade-img>img').attr('src', '/Common/img/MAlarmMonitoring/orange-block.png');
            $('.orange-check').show();
        }
    });
    $(".yellow-block").click(function () {
        var show = $(".yellow-check").css("display");
        if (show != "none") {
            $(this).css({ 'background': 'url("/Common/img/MAlarmMonitoring/Grade-gray3.png") center no-repeat', 'color': '#cecece' });
            $(this).find('.grade-img>img').attr('src', '/Common/img/MAlarmMonitoring/gray-block.png');
            $('.yellow-check').hide();
        } else {
            $(this).css({ 'background': 'url("/Common/img/MAlarmMonitoring/Grade-yellow.png") center no-repeat', 'color': '#d6cc27' });
            $(this).find('.grade-img>img').attr('src', '/Common/img/MAlarmMonitoring/yellow-block.png');
            $('.yellow-check').show();
        }
    });

};


function OneTreeLoad(mark) {
    //加载左边树结构
    if (IsPowerOrg == "1") {
        //_treeType = "line-station";

        $("#myTab li a").eq(0).text("线路区站");

        $('#TreeAll').myTree({
            tag: "STATIONSECTION",
            height: $(this).height() - 210,
            enableFilter: true
        });
    }
    else {
        $('#TreeAll').myTree({
            tag: "LOCOMOTIVE",
            height: $(this).height() - 210,
            enableFilter: true,
            isDefClick: false,
            onClick: function (event, treeId, treeNode) {
                if (treeNode.treeType == "LOCOMOTIVE") {
                    $('#txtloccode').val(treeNode.name);
                    $("#hf_ddlorg").val('');
                    $("#ddlorg").val('');
                    $("#hf_type_ddlorg").val('');
                } else {
                    $("#hf_ddlorg").val(treeNode.id);
                    $("#ddlorg").val(treeNode.name);
                    $("#hf_type_ddlorg").val(treeNode.treeType);
                    if ($("#txtloccode").length > 0)
                        $('#txtloccode').val('');
                }

                doQuery(1);

            }
        });
    };
    $('#myTab a:first').tab('show');
    $('#myTab a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });

    if (FunEnable('Fun_TrainType') == "True") {  //车辆类型显示与否
        //车辆类型
        $("#TreeAll_locoType").myTree({
            tag: "LOCOMOTIVE_VERSION",
            enableFilter: true
        });

    }
    else {
        $('.clx_box').hide();
    };

    //设备编号
    $('#txtloccode').LocoSelect({
        position: 'MonitorLocoAlarmList'
    });

    //设备编号控件
    $('#txtloccode').inputSelect({
        type: 'loca',
        contant: 2
    });
    //报警类型控件
    $('#citySel').mySelectTree_Level2({
        //isSelectChildren: true
    });
    //原始报警类型
    $('#INITIAL_CODE').mySelectTree_Level2({
        //isSelectChildren: true,
        height: '400px'
    });

    $("#ScenceSample").mySelect_Sample({
        tag: "none",
        codeType: "3C",
        cateGory: "SCENE_SAMPLE",
        p_code: "SCENE_SAMPLE",
        enableFilter: true,
        mark: true,
        isRepeatUse: true,
        //height:85,
        //width:400    //迷你款
    });

    setTimeout(TwoTreeLoad, 1500);
};

function TwoTreeLoad() {
    //线路区站
    $('#location').mySelectTree({
        tag: 'BRIDGETUNE',
        enableCheck: true,
        chkboxType: { "Y": "s", "N": "s" },
        nocheck: true,
        height: 250,
        enableFilter: true,
        filterNumber: 2,
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
            var cityObj = $("#location");
            cityObj.attr("value", v).attr("code", code).attr("treetype", "LINE");
        },
        onClick: function (event, treeId, treeNode) {
            var treeObj = $.fn.zTree.getZTreeObj(treeId);
            treeObj.checkAllNodes(false);
            $('#location').attr("value", "");
            $('#location').val(treeNode.name).attr({ "code": treeNode.id, "treetype": treeNode.treeType });
        }
    });

    //组织机构
    $('#ddlorg').mySelectTree({
        tag: 'ORGANIZATION',
        //     type: jsonUser.orgcode,
        enableFilter: true,
        onClick: function (event, treeId, treeNode) {
            $("#hf_ddlorg").val(treeNode.id);
            $("#ddlorg").val(treeNode.name);
            $("#hf_type_ddlorg").val(treeNode.treeType);
        }
    });
    //供电段用户左边栏加载组织机构
    if (IsPowerOrg == "1") {
        $(".org_box,#tab_gdorg").css("display", "");
        $("#search_bg>div:eq(2)>div:eq(2)").css("margin-left", 0);
        $("#TreeOrg").myTree({
            tag: "ORGANIZATION",
            isDefClick: false,
            enableFilter: true,
            onClick: function (event, treeId, treeNode) {
                $("#hf_ddlorg").val(treeNode.id);
                $("#ddlorg").val(treeNode.name);
                $("#hf_type_ddlorg").val(treeNode.treeType);
                doQuery(1);
            }
        });
    };
    //内部版本加载缺陷标志
    if (getConfig('debug') == "1") { //内部版本
        $('#QX_mark').parent().parent().css("display", "");
        $("#QX_mark").mySelectTree({
            tag: 'GetDefectMark',
            cateGory: 'AFLG',
            codeType: '3C',
            enableCheck: true,
            chkboxType: { "Y": "s", "N": "s" },
            nocheck: true,
            height: 250,
            enableFilter: true,
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
                var cityObj = $("#QX_mark");
                cityObj.attr("value", v).attr("code", code);
            },
            onClick: function (event, treeId, treeNode) {
                if (treeNode.pId == null) return;
                var treeObj = $.fn.zTree.getZTreeObj(treeId);
                treeObj.checkAllNodes(false);
                //treeObj.checkNode(treeNode, !treeNode.checked, null, true);
                $('#QX_mark').attr("value", "");
                $("#QX_mark").attr('code', treeNode.id).val(treeNode.name);
            }
        });

        $("#JXWJ").parent().css('display', ''); //内部解析文件
    };
    //对外隐藏空位置选项
    if (FunEnable('Fun_PositionNull') == "False") {
        $("#position_null").parent().parent().parent().hide();
    };
    //更多条件仅收藏开关
    if (FunEnable('Fun_FavoritesButton') == "False" || FunEnable('Fun_FavoritesButton') == "True") {
        $("#alarm_switch").parent().parent().parent().hide();
        $("#search_bg>div").eq(0).css("margin-left", "20px");
    };

    $("#location").siblings("a").click(function () {   //清除线路选择的checkbox勾选
        var treeObj = $.fn.zTree.getZTreeObj("ULlocation");
        treeObj.checkAllNodes(false);
    });
    $("#QX_mark").siblings("a").click(function () {   //清除线路缺陷标志的checkbox勾选
        var QX_markObj = $.fn.zTree.getZTreeObj("ULQX_mark");
        QX_markObj.checkAllNodes(false);
    });


    //解析服务自动取消树
    if (getConfig('debug') == "1") {
        $('#Parsing_cancel').mySelectTree({
            tag: 'GET_ANALYTICAL_CANCELLED',
            height: 100,
            enableFilter: true,
            chkboxType: { "Y": "s", "N": "s" },
            nocheck: true,
            enableCheck: true,
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
                if (treeNode.pId == null || treeNode.pId == '') {
                    if (nodes.length < 1) {
                        $("#Parsing_cancel").attr('value', '').attr("code", '')
                    }
                    $("#Parsing_cancel").attr("value", nodes[0].name + '全部').attr("code", code)
                    return;
                } else {
                    $("#Parsing_cancel").attr("value", v).attr("code", code);

                }

            },
            onClick: function (event, treeId, treeNode) {
                //if (treeNode.pId == null || treeNode.pId=='') {
                //    treeObj.checkAllNodes(true);
                //    return;
                //}
                var treeObj = $.fn.zTree.getZTreeObj(treeId);
                if (treeNode.pId == null || treeNode.pId == '') {
                    treeObj.checkAllNodes(true);
                    var nodes = treeObj.getCheckedNodes(true), code = "";

                    for (var i = 0, l = nodes.length; i < l; i++) {
                        code += nodes[i].id + ",";
                    }
                    $('#Parsing_cancel').val(nodes[0].name + '全部').attr({ "code": code });
                } else {
                    treeObj.checkAllNodes(false);
                    treeObj.checkNode(treeNode, !treeNode.checked, null, true);
                    $('#Parsing_cancel').val(treeNode.name).attr({ "code": treeNode.id });
                }


            }
        });
    }
    $("#Parsing_cancel").siblings("a").click(function () {   //清除线路缺陷标志的checkbox勾选
        var QX_markObj = $.fn.zTree.getZTreeObj("ULParsing_cancel");
        QX_markObj.checkAllNodes(false);
    });

    //样本选择
    if (getConfig('debug') == "1") {
        get_sample_url();
        $('#Sample_type').mySelectTree({
            tag: 'GET_SAMPLE_LIBRARY',
            cateGory: 'SMPLFLG',
            codeType: '3C',
            p_code: 'DRTFLG_ZHB',
            height: 200,
            enableFilter: true,
            enableCheck: true,
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
                var cityObj = $("#Sample_type");
                cityObj.attr("value", v).attr("code", code).attr('s_type', 'D');
            },
            onClick: function (event, treeId, treeNode) {
                //$('#Sample_type').val(treeNode.name).attr({ "code": treeNode.id });
                //if (treeNode.pId == null) return;
                var treeObj = $.fn.zTree.getZTreeObj(treeId);
                treeObj.checkAllNodes(false);
                treeObj.checkNode(treeNode, !treeNode.checked, null, true);
                $('#Sample_type').attr("value", "");
                if (treeNode.pId === 'DRTFLG_FUB') {
                    var arr = treeNode.children,
                        code = '';
                    for (var j = 0; j < arr.length; j++) {
                        code += arr[j].id + ',';
                    }
                    if (code.length > 0) {
                        code = code.substring(0, code.length - 1);
                    }
                    $("#Sample_type").attr('s_type', 'D').attr('code', code).val(treeNode.name);
                } else {
                    if (treeNode.id === 'DRTFLG_FUB' || treeNode.id === 'DRTFLG_ZHB') {
                        $("#Sample_type").attr('s_type', 'S').attr('code', treeNode.id).val(treeNode.name);
                    } else {
                        $("#Sample_type").attr('s_type', 'D').attr('code', treeNode.id).val(treeNode.name);
                    }
                }
            },
            callback: function () {
                $("#Sample_type", document).parent().find("a").click(function () {   //清除样本类型的checkbox勾选
                    var Sample_typeObj = $.fn.zTree.getZTreeObj("ULSample_type");
                    Sample_typeObj.checkAllNodes(false);
                });
            }
        });
    }
};

function LoadSave(alarmID) {
    //  var alarmID = over_alarmID;
    //添加收藏。
    var SaveAlarms = getCookieValue("SaveAlarms");
    if (SaveAlarms != '') {
        if (SaveAlarms.indexOf(alarmID) >= 0) {
            //已经存在
            $('#i_save').removeClass("icon-white").addClass("icon-color");
        }
        else {
            $('#i_save').removeClass("icon-color").addClass("icon-white");
        }
    }
};

var isCheck = false;
/*function ckAll() {
    if (!isCheck) {
        $("#btn_ckAll .i_save").removeClass("icon-white").addClass("icon-color");
    }
    else {
        $("#btn_ckAll .i_save").removeClass("icon-color").addClass("icon-white");
    }
    $("#flexTable tr .collect").each(function () {
        var alarmID = $(this).parent().parent().parent().find('td:last')[0].innerText;

        //添加收藏。
        var SaveAlarms = getCookieValue("SaveAlarms"); // window.localStorage.SaveAlarms;  //;
        if (SaveAlarms != undefined && SaveAlarms != '') {
            if (SaveAlarms.indexOf(alarmID) >= 0) {
                //已经存在
                //ymPrompt.alert('已经收藏');
                if (isCheck) {
                    DelStorageSaveAlarms(alarmID);
                    $(this).find('.i_save').removeClass("icon-color").addClass("icon-white");
                }
                return;

            }
            else {
                if (!isCheck) {
                    SaveAlarms += '_' + alarmID;
                    if (SaveAlarms.split('_').length > 1000) {
                        ymPrompt.alert('超过收藏最大限值1000，请先处理再进行操作！');
                        return false;
                    }
                    $(this).find('.i_save').removeClass("icon-white").addClass("icon-color");
                }
                // ymPrompt.alert('收藏成功');
            }
        }
        else {
            SaveAlarms = alarmID;
            $(this).find('.i_save').removeClass("icon-white").addClass("icon-color");
            //  ymPrompt.alert('收藏成功');
        }

        window.localStorage.SaveAlarms = SaveAlarms;
        //        deleteCookie("SaveAlarms", "/");
        //        addCookie("SaveAlarms", SaveAlarms, 30, "/");
    });

    isCheck = !isCheck;
}
*/
//根据编码获得级别
//function GetjbByID(str) {
//    if (str == "一类") { return "一类"; }
//    else if (str == "二类") { return "二类"; }
//    else if (str == "三类") { return "三类"; }
//    else { return "0"; }
//};
//绑定表格

function loadFlexiGrid(str) {

    if (GetQueryString("data_type") != null) {
        data_type = GetQueryString("data_type");
        if ('' === alarmStatus || undefined === alarmStatus || null === alarmStatus) {
            if (data_type == "FAULT") {
                _data_type = "FAULT";
                $('#ddlzt').val('AFSTATUS03');
                $("#ddlzt>option[value='AFSTATUS04']").attr('selected', true);
                $("#ddlzt>option[value='AFSTATUS01']").remove();
            } else {
                $("#ddlzt>option[value='AFSTATUS01']").attr('selected', true); //新     
                $("#ddlzt>option[value='AFSTATUS03']").attr('selected', true); //确认
                $("#ddlzt>option[value='AFSTATUS04']").attr('selected', true); //计划
                $("#ddlzt>option[value='AFSTATUS05']").attr('selected', true); //关闭
            }
        } else {
            var curAlarmStatus = alarmStatus.split('$');
            $("#ddlzt option").attr("selected", false)//全未选中
            for (var i = 0; i < curAlarmStatus.length; i++) {
                $('#ddlzt > option[value="' + curAlarmStatus[i] + '"]').attr('selected', true);
            }
        }

    }

    var _h = '';
    if ($(window).height() > 800 && $(window).height() < 1000) {
        _h = $(window).height() - 243 - 30;
    } else {
        _h = $(window).height() - 235 - 30;
    }
    var PageNum = parseInt(($(window).height() - 240) / 25) - 1;


    //收藏按钮和速度列同时不显示
    var cm = [
                            { display: '红外', name: 'HW', width: 150, sortable: false, hide: true, align: 'left' },
                            { display: '可见光', name: 'KJG', width: 150, sortable: false, hide: true, align: 'left' },
                            { display: '全景', name: 'QJ', width: 150, sortable: false, hide: true, align: 'left' },
                            { display: 'GISX', name: 'GISX', width: 80, sortable: false, align: 'center', hide: true },
                            { display: 'GISY', name: 'GISY', width: 80, sortable: false, align: 'center', hide: true },

                            { display: '设备编号', name: 'LOCOMOTIVE_CODE', width: 90, sortable: false, align: 'center' },
                            { display: '发生时间', name: 'NOWDATE', width: 120, sortable: false, align: 'center' },
                            { display: '报警级别', name: 'JB', width: 45, sortable: false, align: 'center' },
                            { display: '报警状态', name: 'ZT', width: 45, sortable: false, align: 'center' },
                            { display: '位置信息', name: 'WZ', width: 290, sortable: false, align: 'left' },
                            //{ display: '重复次数', name: 'polealarmcount', width: 45, sortable: false, align: 'center' },
                            { display: '弓位置', name: 'GWZ', width: 45, sortable: false, align: 'center' },
                            { display: '最高温度℃', name: 'WD', width: 55, sortable: false, align: 'center' },
                            { display: '环境温度℃', name: 'HJWD', width: 55, sortable: false, align: 'center' },
                            { display: '导高值mm', name: 'DGZ', width: 55, sortable: false, align: 'center' },
                            { display: '拉出值mm', name: 'LCZ', width: 55, sortable: false, align: 'center' },
                            { display: '报警类型', name: 'QXZT', width: 120, sortable: false, align: 'center' },
                            { display: '报警分析', name: 'alarm_analysis', width: 150, sortable: false, align: 'left' },


                            { display: '操作', name: 'CZ', width: 80, sortable: false, hide: true, align: 'center' },
                            { display: '下载', name: 'XZ', width: 80, sortable: false, hide: true, align: 'center' },
                            { display: '标签', name: 'bjbm', width: 80, sortable: false, align: 'center' },
                            //{ display: '燃弧大小', name: 'SPART_PIXEL_PCT', width: 45, sortable: false, align: 'center' },
                            { display: 'ID', name: 'ID', width: 80, sortable: false, pk: true, hide: true, align: 'center' }//id后面不要放列
    ];
    var num = 7;
    //供电用户列表中增加组织机构列
    if (GetIsPowerOrg() == "1") {
        cm.splice(cm.length - 3, 0, { display: '组织机构', name: 'ORG', width: 150, sortable: false, align: 'center' }); //在列表中添加组织机构展示
    }
    //收藏按钮显示
    //if (FunEnable('Fun_CollectionButton') == "True") {
    //    cm.splice(3, 0, { display: ' <span id="btn_ckAll" class="label btn_save" onclick="ckAll();"><i  class="i_save icon icon-star-on icon-white" ></i>收藏</span> ', name: 'Save', width: 50, sortable: false, align: 'center' });
    //    num = num + 1;
    //};
    //收藏按钮显示
    if (FunEnable('Fun_CollectionButton') == "True") {
        cm.splice(3, 0, { display: '', name: 'Save', width: 25, sortable: false, align: 'center' });
        num = num + 1;
    };
    //收藏选项
    if ($('#S_btnExlnew').is(":hidden")) {
        cm.splice(4, 0, { display: '收藏至', name: 'SELECT_DPC', width: 60, sortable: false, align: 'left', hide: true, });
        num = num + 1;
    } else {
        if (FunEnable('Fun_CollectAndBatchHandle') === 'False') {
            cm.splice(4, 0, { display: '收藏至', name: 'SELECT_DPC', width: 60, sortable: false, align: 'left', hide: true, });
        } else {
            cm.splice(4, 0, { display: '收藏至', name: 'SELECT_DPC', width: 60, sortable: false, align: 'left' });
        }
        num = num + 1;
    }
    //导出列显示
    if (FunEnable('Fun_portOutsingle') == "True") {
        cm.splice(5, 0, { display: '导出报告', name: 'portOut', width: 80, sortable: false, align: 'center' });
        num = num + 1;
    };
    //处理意见列显示
    if (FunEnable('Fun_AlarmSuggestion') == "True") {
        cm.splice(cm.length - 4, 0, { display: '处理意见', name: 'proposal', width: 80, sortable: false, align: 'left' });
        num = num + 1;
    };

    //原始报警列显示
    if (FunEnable('Fun_OriginalAlarmType') == "True") {
        //$('#myDiv').css('height', '360px')
        $('#INITIAL_CODE').parents('.span4').css('display', '')
        cm.splice(cm.length - 6, 0, { display: '原始类型', name: 'INITIAL_CODE_NAME', width: 120, sortable: false, align: 'center' });
    };
    //报告人
    if (FunEnable('Fun_ReportPerson') == "True") {
        $("#ReportPerson").parent().parent().css('display', '');
        cm.splice(cm.length - 5, 0, { display: '报告人', name: 'ReportPerson', width: 45, sortable: false, align: 'center' });
    };

    //速度列显示
    if (FunEnable('Fun_SpeedList') == "True") {
        cm.splice(num + 7, 0, { display: '速度km/h', name: 'SD', width: 45, sortable: false, align: 'center' });
    };

    if (getConfig('debug') == "1") { //内部版本
        cm.splice(cm.length - 1, 0, { display: '缺陷标志', name: 'qxbz', width: 80, sortable: false, align: 'center' });
    };
    //浏览量
    if (FunEnable('Fun_PageView') == "True") {
        cm.splice(cm.length - 20, 0, { display: '浏览', name: 'ACCESSCOUNT', width: 20, sortable: false, align: 'center' });
    }

    //重复次数
    if (FunEnable("Fun_StatisticsTimes") == "True") {
        cm.splice(cm.length - 20, 0, { display: '重复', name: 'polealarmcount', width: 20, sortable: false, align: 'center' });
    };
    //车型
    if (FunEnable("Fun_isCRH") === 'False' && getConfig('debug') == "1") {
        cm.splice(cm.length - 20, 0, { display: '车型', name: 'IsCrack', width: 24, sortable: false, align: 'center' });
    } else {
        cm.splice(cm.length - 20, 0, { display: '车型', name: 'IsCrack', width: 24, sortable: false, align: 'center', hide: true });
    }
    //燃弧大小显示 燃弧像素点 报警判断依据
    if (getConfig('debug') == "1") {
        cm.splice(cm.length - 1, 0, { display: '燃弧大小', name: 'SPART_PIXEL_PCT', width: 45, sortable: false, align: 'center' });
        cm.splice(cm.length - 1, 0, { display: '燃弧像素点', name: 'SPART_PIXELS', width: 55, sortable: false, align: 'center' });
        cm.splice(cm.length - 1, 0, { display: '报警判断依据', name: 'CRITERION', width: 68, sortable: false, align: 'center' });
    };
    //报警锁定
    if (FunEnable("Fun_lock_sureOrcancel") == "True") {
        cm.splice(3, 0, { display: '', name: 'LOCK_PERSON_NAME', width: 10, sortable: false, align: 'center' });
    };
    //处理时间
    if (FunEnable('Fun_deal_time') == "True") {
        cm.splice(cm.length - 1, 0, { display: '处理时间', name: 'REPORT_DATE', width: 120, sortable: false, align: 'center' });
    }
    //卫星数
    if (FunEnable('Fun_ShowSatellite') == "True") {
        cm.splice(cm.length - 1, 0, { display: '卫星数', name: 'WXS', width: 35, sortable: false, align: 'center' });
    }
    //卫星数
    if (getConfig('debug') == "1") {
        cm.splice(cm.length - 1, 0, { display: '转发状态', name: 'IS_TRANS_ALLOWED', width: 70, sortable: false, align: 'center' });
    }

    
    var urlstr = "";

    option = {
        url: urlstr,
        dataType: 'json',
        colModel: cm,
        width: 'auto',
        rowId: 'ID',
        height: _h,
        nowrap: true,
        onRowDblclick: rowDblclick, //双击事件
        rp: PageNum,
        useRp: true,
        rpOptions: [20, 50, 100, PageNum],
        onSuccess: function (result) {
            var json;
            if ('' !== result && result != undefined) {
                json = result.rows;
                var flexTable_tr = $('#flexTable tr');
                for (var i = 0; i < json.length; i++) {
                    if (FunEnable('Fun_TaskManage') == "False") {
                        $(flexTable_tr[i]).find('.table_select option[value="Mission"]').remove();
                    }
                }
            }
           

            //      $("[data-toggle='tooltip']").tooltip();

            totalRows = this.total;
            // option.rp=

            //$('[rel="tooltip"],[data-rel="tooltip"]').tooltip({ "placement": "bottom", delay: { show: 0, hide: 0 }, }).on('shown.bs.tooltip', function () {

            //    $('.tooltip').width(400);//.css("left",_left);
            //    $('.toolbg').css('padding', "20px")

            //    $('.tooltip-inner').css({"max-width":"inherit","max-height":"inherit","text-align":"left","line-height": "25px" ,"font-size":"15px"  })

            //})
            // $('.hDivBox th').attr('align', 'center');

            $('.hDivBox th>div').css('text-align', 'center');

            //    $(this).find('td')[2]
            //翻页时将勾选状态默认改为不勾选
            isCheck = false;
            $("#btn_ckAll .i_save").removeClass("icon-color").addClass("icon-white");

            $("#flexTable tr .collect").each(function () {
                //  var overOBJ = $(this).children('td:eq(2)');

                var _alarmID = $(this).parent().parent().parent().find('td:last')[0].innerText;

                var SaveAlarms = getCookieValue("SaveAlarms"); // window.localStorage.SaveAlarms; 
                if (SaveAlarms != undefined && SaveAlarms != '') {
                    if (SaveAlarms.indexOf(_alarmID) >= 0) {
                        //已经存在
                        $(this).find('.i_save').removeClass("icon-white").addClass("icon-color");
                    }
                    else {
                        $(this).find('.i_save').removeClass("icon-color").addClass("icon-white");
                    }
                }

                $(this).hover(function (e) {

                    clearTimeout(t_closeImgBox);

                    //   $("#seleHeadDiv").show();
                    //   $("#flexTable tr").removeClass('tr_over');
                    //  $(this).addClass('tr_over');

                    //  $(this).parent().parent().parent().find('td')[16].innerText
                    var _hw = $(this).parent().parent().parent().find('td')[0].innerText;
                    var _kjg = $(this).parent().parent().parent().find('td')[1].innerText;
                    var _qj = $(this).parent().parent().parent().find('td')[2].innerText;

                    // $('#temp_alarmID').text(_alarmID);
                    // alert(_hw)

                    $('#img_hw').attr('src', _hw);
                    $('#img_kjg').attr('src', _kjg);
                    $('#img_qj').attr('src', _qj);


                    over(this, "seleHeadDiv", e);

                }, function () {
                    // $(this).removeClass('tr_over');
                    t_closeImgBox = setTimeout(function () {
                        $("#seleHeadDiv").hide();
                    }, 100)

                });



                //if (FunEnable('Fun_FavoritesButton') == "True") {

                //    $(this).click(function () {

                //        var alarmID = $(this).parent().parent().parent().find('td:last')[0].innerText; // $(this).parent().parent().parent().find('td')[20].innerText;

                //        //添加收藏。
                //        var SaveAlarms = getCookieValue("SaveAlarms"); // window.localStorage.SaveAlarms;
                //        if (SaveAlarms != undefined && SaveAlarms != '') {
                //            if (SaveAlarms.indexOf(alarmID) >= 0) {
                //                //已经存在
                //                //ymPrompt.alert('已经收藏');
                //                DelStorageSaveAlarms(alarmID);
                //                $(this).find('.i_save').removeClass("icon-color").addClass("icon-white");
                //                return;

                //            }
                //            else {
                //                SaveAlarms += '_' + alarmID;
                //                if (SaveAlarms.split('_').length > 1000) {
                //                    ymPrompt.alert('超过收藏最大限值1000，请先处理再进行操作！');
                //                    return false;
                //                }
                //                $(this).find('.i_save').removeClass("icon-white").addClass("icon-color");

                //                // ymPrompt.alert('收藏成功');
                //            }
                //        }
                //        else {
                //            SaveAlarms = alarmID;
                //            $(this).find('.i_save').removeClass("icon-white").addClass("icon-color");
                //            //  ymPrompt.alert('收藏成功');
                //        }

                //        window.localStorage.SaveAlarms = SaveAlarms;
                //        //                 deleteCookie("SaveAlarms", "/");
                //        //                 addCookie("SaveAlarms", SaveAlarms, 30, "/");


                //    })
                //};
                //$(this).mouseleave(function () {
                //    $("#seleHeadDiv").hide();
                //})

            });

            $('#flexTable .table_select').change(function () {
                var status = $(this).parent().parent().parent().find('span[class=status]').text();  //取出状态值
                var cartype = $(this).parent().parent().parent().find('span[class=choose_carType_forIsSaveBtn]').text();  //取出车类型
                if (cartype != '破解' && getConfig('debug') == "1" && FunEnable('Fun_isCRH') == "False") {  //内部机车破解版才能收藏
                    layer.msg("该车型数据不能加入收藏！")
                    $(this).val('0')
                } else if (status != '新上报' && status != '已确认') {
                    //ymPrompt.alert(status + "数据不能加入收藏");
                    layer.msg(status + "数据不能加入收藏")
                    $(this).val('0')
                } else {
                    //初始化localStorage
                    if (!window.localStorage["SaveAlarms"]) {
                        window.localStorage.SaveAlarms = '';
                    }
                    if (!window.localStorage["CansAlarms"]) {
                        window.localStorage.CansAlarms = '';
                    }
                    if (!window.localStorage["MissionAlarms"]) {
                        window.localStorage.MissionAlarms = '';
                    }
                    chooseLocalstorg($(this).val(), $(this).attr('code'));
                }
            })

            $('#flexTable tr .table_select').each(function () {
                //遍历是否收藏指定类型 并显示 
                find_localStorg($(this), $(this).attr('code'));
            })

        }
    };

    // $("#flexTable").flexigrid(option);
};

function getoffset(e) {
    var t = e.offsetTop;
    var l = e.offsetLeft;
    while (e = e.offsetParent) {
        t += e.offsetTop;
        l += e.offsetLeft;
    }
    var rec = new Array(1);
    rec[0] = t;
    rec[1] = l;
    return rec
};
function over(obj, divid, e) {
    var div = document.getElementById(divid);
    var rec = getoffset(obj);
    div.style.postion = "absolute";

    var _top = rec[0] + obj.offsetHeight;
    var _left = rec[1] + obj.offsetWidth; // event.pageX;
    // var _left = event.pageX;


    if (_top + $('#' + divid).height() > $(window).height()) {
        _top = rec[0] - $('#' + divid).height();
    }

    if (_left + $('#' + divid).width() > $(window).width()) {
        _left = $(window).width() - $('#' + divid).width();
    }

    $('#' + divid).animate({ top: _top, left: _left }, 50);

    //$('#' + divid).css('top', _top);
    //$('#' + divid).css('left', _left);


    //  div.style.top = rec[0] + obj.offsetHeight;
    //  div.style.left = rec[1] - 300;





    div.style.display = "";
};

//设置对应的本地缓存
function chooseLocalstorg(calss, alarmID) {
    DelStorageSaveAlarms(alarmID);//清除本id 然后赋值
    var CansAlarms = window.localStorage['CansAlarms'];
    var MissionAlarms = window.localStorage['MissionAlarms'];
    //console.log(alarmID)
    if (calss == 'Canc') {
        if (CansAlarms != undefined && CansAlarms != '') {
            CansAlarms += '_' + alarmID;
        } else {
            CansAlarms = alarmID;
        }
        window.localStorage.CansAlarms = CansAlarms;
    } else if (calss == 'Mission') {

        if (MissionAlarms != undefined && MissionAlarms != '') {
            MissionAlarms += '_' + alarmID;
        } else {
            MissionAlarms = alarmID;
        }
        window.localStorage.MissionAlarms = MissionAlarms;
    }
    //console.log('CansAlarms:::' + window.localStorage['CansAlarms'] + '\nMissionAlarms:::' + window.localStorage['MissionAlarms'])

}

//遍历是否收藏指定类型 并显示 
function find_localStorg(obj, _alarmID) {
    var CansAlarms = window.localStorage["CansAlarms"];
    var MissionAlarms = window.localStorage["MissionAlarms"];

    if (CansAlarms != undefined && CansAlarms != '') {
        if (CansAlarms.indexOf(_alarmID) >= 0) {
            obj.val("Canc");
        }
    }
    if (MissionAlarms != undefined && MissionAlarms != '') {
        if (MissionAlarms.indexOf(_alarmID) >= 0) {
            //console.log(obj.find('.table_select').html())
            obj.val("Mission");
        }
    }

};

//弹出详细
function selectInfo(rowData) {
    var id = rowData.id;  //rowData.属性名,源码中放进json的名;去掉前面的'C'
    var responseData = XmlHttpHelper.transmit(false, "get", "text", "RemoteHandlers/locPs3orPs4.ashx?alarmid=" + id + "", null, null);
    if (responseData != null && responseData != "") {
        if (responseData == "PS3") {
            window.open("MonitorAlarm3CForm4PS3.htm?alarmid=" + id + "&v=" + version, "_blank");
        } else {
            window.open("MonitorAlarm3CForm4.htm?alarmid=" + id + "&v=" + version, "_blank");
        }
    }
};
//修改页面
function UpdateInfo(rowData) {
    var id = rowData.id;  //rowData.属性名,源码中放进json的名;去掉前面的'C'
    ShowWinOpen("MonitorAlarmC3FormUpdate.aspx?alarmid=" + id);
};
//双击
function rowDblclick(rowData) {
    var id = rowData.ID;  //rowData.属性名,源码中放进json的名;去掉前面的'C'

    //window.open("MonitorAlarm3CForm4.htm?alarmid=" + id + "&" + GetUrlEx() + "&v=" + version, "_blank");
    if (getConfig('For6C') == '3C') {
        window.open("MonitorAlarm3CForm4.htm?alarmid=" + id + "&" + GetUrlEx() + "&v=" + version, "_blank");
    } else {
        window.open("/6C/PC/MAlarmMonitoring/MonitorAlarmDPC.htm?alarmid=" + id + '&cateGoryName=3C&' + GetUrlEx() + '&v=' + version, "_blank");
    }
};



function selectCookieGet() {
    if (GetQueryString("Portal") != undefined && GetQueryString("Portal") == "true") {
        var jb;
        if (GetQueryString("ser") == "一类") { jb = "一类"; }
        else if (GetQueryString("ser") == "二类") { jb = "二类"; }
        else if (GetQueryString("ser") == "三类") { jb = "三类"; }
        else if (GetQueryString("ser") == "一类,二类,三类") { jb = "0"; }
        else { jb = "0"; }
        document.getElementById('jb').value = jb;
        document.getElementById('ddlzt').options[0].selected = true;
        document.getElementById('ddlzt').options[1].selected = true;
        document.getElementById('ddlzt').options[2].selected = true;
        document.getElementById('ddlzt').options[4].selected = true;
        document.getElementById('startdate').value = dateLastMonthStr();
        document.getElementById('enddate').value = dateNowStr();
        document.getElementById('lineselect').value = GetLineCodeByName(GetQueryString("linename"));

    } else {
        if (getCookieValue("ju") != undefined && getCookieValue("ju") != "") {
            //获取Cookie内的值 付给查询控件
            var stdate = getCookieValue("startdate");
            stdate = stdate.replace("%20", " ").replace("%3A", ":").replace("%3A", ":");
            stdate = stdate.substring(0, 19);
            var endate = getCookieValue("enddate");
            endate = endate.replace("%20", " ").replace("%3A", ":").replace("%3A", ":");
            endate = endate.substring(0, 19);
            document.getElementById('juselect').value = getCookieValue("ju");
            loadOrgSelect(getCookieValue("ju"), 'duan', null, 'ddlduan', null);

            var _jwd = getCookieValue("jwd");
            if (_jwd != '') {
                document.getElementById('duanselect').value = _jwd;
            }
            document.getElementById('jlh').value = getCookieValue("jlh");
            document.getElementById('txtloccode').value = getCookieValue("loccode");
            document.getElementById('startdate').value = stdate;
            document.getElementById('enddate').value = endate;
            document.getElementById('startkm').value = getCookieValue("startkm");
            document.getElementById('endkm').value = getCookieValue("endkm");
            //   document.getElementById('dll_zt').value = getCookieValue("dll_zt");
            document.getElementById('lineselect').value = getCookieValue("line");
            document.getElementById('jb').value = getCookieValue("jb");
            setSelectdItem(getCookieValue("ddlzt").replace("%2C", ","), document.getElementById('ddlzt'));
            //   setSelectdItem(getCookieValue("dll_zt").replace("%2C", ","), document.getElementById('dll_zt').childNodes[0]);
            //结束
        }
        else if (getCookieValue("startdate") != undefined && getCookieValue("startdate") != "") {
            var stdate = getCookieValue("startdate");
            stdate = stdate.replace("%20", " ").replace("%3A", ":").replace("%3A", ":");
            stdate = stdate.substring(0, 19);
            document.getElementById('startdate').value = stdate;
        }
        else {
            document.getElementById('jb').value = "一类";
            document.getElementById('ddlzt').options[0].selected = true;
            document.getElementById('ddlzt').options[1].selected = true;
            document.getElementById('ddlzt').options[2].selected = true;
            document.getElementById('ddlzt').options[4].selected = true;
        }
    }
};
//执行查询
function doQuery(_pageIndex) {
    doQueryHistoricalTime(); ///  Common\js\6cweb\HistoricalTime.js

    if (GetQueryString('openType') == 'outside' && openTime == 0) {
        //$('.L_title').html($('.L_title').html() + '<span class="aaaa">本次查询来自报警统计趋势页面</span>')
        $('.span10 .box-header h2').append('<span class="newTitle" style="color:red">（供电视图）</span>')
        from_AlarmStatisticalTrend()
    } else {
        $('.newTitle').hide()

        StatisticsSign = '';
    };

    var startdate = document.getElementById('startdate').value; //时间
    var enddate = document.getElementById('enddate').value; //结束日期
    if (startdate == '') {
        return false;
    }
    if (enddate != '' && enddate != undefined && startdate > enddate) {
        layer.msg('时间有误！请检查输入！')
        return false;
    }
    
    //CatheTime = CatheTime + startdate + "----" + enddate + ";";
    //window.localStorage.setItem('_CacheTime', CatheTime);
    var selectrp = $('select[name="rp"]').val();
    if (selectrp != undefined) {
        option.rp = parseInt(selectrp);
    }
    option.url = 'RemoteHandlers/GetMonitorLocoAlarmList.ashx?' + GetUrlEx() + '&action=list' + '&temp=' + Math.random();
    if (document.getElementById('bjbm').value != '') {
        var bjbm = document.getElementById('bjbm').value;
        option.url = 'RemoteHandlers/GetMonitorLocoAlarmList.ashx?bjbm=' + bjbm + '&action=list' + '&temp=' + Math.random();
    } else {
        var show_saved = $("#alarm_switch").is(":checked");
        if (show_saved == true) {
            window.localStorage.setItem('show_saved', true)

            var reg = new RegExp("_", "g");
            var ids = getCookieValue("SaveAlarms").replace(reg, ",");
            if (ids != "" && ids != undefined) {
                option.params = [{ name: 'ids', value: ids }];
            } else {
                option.params = [{ name: 'ids', value: 'undefined' }];
                //ymPrompt.alert({ message: '还没有收藏的报警！', btn: [['是', 'yes']], title: '提醒' });
            }
        }
        else {
            window.localStorage.setItem('show_saved', false)
            option.params = [{ name: 'ids', value: '' }];
        }
    };

    if (data_type != null && data_type != undefined && data_type != "") {

        switch (data_type) {
            case 'FAULT':
                $('#list_title').html('设备检测疑似缺陷');
                break;
        }

    }


    SetWhereMemo();
    if (_pageIndex > 0) {
        option.newp = _pageIndex;
    }
    else if (_pageIndex == -1) {
        //从详细页关闭后，刷新。先取出当前页码。
        var _thisPage = $('.pGroup>.pcontrol>input').val();
        option.newp = _thisPage;
    }
    else {
        //正常操作分页按钮。
    }


    $("#flexTable").flexigrid(option).flexOptions(option).flexReload();



};

function GetUrlEx() {
    var obj = document.getElementById('ddlzt');
    //var jbobj = document.getElementById('jb');
    var ju = document.getElementById('juselect').value; //局
    var jwd = document.getElementById('duanselect').value; //段; //机务段

    var jwdText = ''; //  document.getElementById('duanselect').options[document.getElementById('duanselect').selectedIndex].text; //段; //机务段 名称
    if (document.getElementById('duanselect').selectedIndex > -1) {
        jwdText = document.getElementById('duanselect').options[document.getElementById('duanselect').selectedIndex].text;
    }

    var jlh = document.getElementById('jlh').value; //交路
    var loccode = document.getElementById('txtloccode').value; //设备编码
    var startdate = document.getElementById('startdate').value; //时间
    var enddate = document.getElementById('enddate').value; //结束日期
    var zt = getSelectedItem(obj); // document.getElementById('dll_zt').value; //状态
    var startkm = document.getElementById('startkm').value; //开始
    var endkm = document.getElementById('endkm').value; //结束公里标
    var jb = "";
    if (screen.width <= 1280) {
        jb = getSelectedItem(document.getElementById('jb'));//级别
    } else {
        jb = getSelectedJB(); //级别
    }
    if (jb == '' && getConfig('debug') != "1" && GetQueryString("data_type") != 'ALARM') {//外部非检测数据jb为空默认 1 2 类
        jb = '一类二类'
    }
    var afcode = $('#citySel').val();  // getSelectedItem(qxType.childNodes[0]);
    var line = document.getElementById('lineselect').value; //线路
    var bjbm = document.getElementById('bjbm').value; //报警编码
    var QX_mark = $('#QX_mark').attr('code');
    var direction = '0'//行别
    if ($('#direction').val() != '') {
        direction = $('#direction').attr('code')
    }
    var data = $("#Form1").serialize();
    var jc_type = $('#carType').val();
    if (jc_type == undefined || jc_type == '0' || jc_type == '') {
        jc_type = '';
    }

    //新位置信息 参数          老位置信息 参数为 line ,qz
    var locationCode = $('#location').attr("code");
    var locationName = $('#location').val();
    var locationType = $('#location').attr("treetype");

    var orgCode = $('#hf_ddlorg').val();
    var orgName = $('#ddlorg').val();
    var orgType = $('#hf_type_ddlorg').val();
    if ($('#ddlorg').val() == "") {
        orgCode = "0";
    }

    var code = ''; //报警类型
    var code_type = ''; //报警类型类别

    if ($('#citySel').val() != '') { code = $('#citySel').attr("code"); code_type = $('#citySel').attr("treetype") }//报警类型
    var INITIAL_CODE = ''; //原始报警类型
    var INITIAL_CODE_TYPE = ''; //原始报警类型类别

    if ($('#INITIAL_CODE').val() != '') { INITIAL_CODE = $('#INITIAL_CODE').attr("code"); INITIAL_CODE_TYPE = $('#INITIAL_CODE').attr("treetype") }
    //报告人
    var REPORT_PERSON = document.getElementById('ReportPerson').value;
    var SCENCE_SAMPLE = $('#ScenceSample').val().replace(/\s/g, "").replace(/\+/g, '%2B');//场景样本的选项值
    var JXWJ_VAL = $("#JXWJ").val();  //解析文件的选项值
    var VI_ANALYSIS = ""; //局部已解析
    var OX_ANALYSIS = ""; //全景已解析
    if (JXWJ_VAL == "OX_ANALYSIS") {
        VI_ANALYSIS = "";
        OX_ANALYSIS = "OX_ANALYSIS";
    } else if (JXWJ_VAL == "VI_ANALYSIS") {
        VI_ANALYSIS = "VI_ANALYSIS";
        OX_ANALYSIS = "";
    } else if (JXWJ_VAL == "all") {
        VI_ANALYSIS = "VI_ANALYSIS";
        OX_ANALYSIS = "OX_ANALYSIS";
    } else {
        VI_ANALYSIS = "";
        OX_ANALYSIS = "";
    };

    var Parsing_cancel = ''; //解析取消
    if ($('#Parsing_cancel').val() != '') { Parsing_cancel = $('#Parsing_cancel').attr("code"); }

    var Sample_code = ''; //样本编码
    var Sample_type = ''; //样本类型
    if ($('#Sample_type').val() != '') {
        Sample_code = $('#Sample_type').attr("code");
        Sample_type = $('#Sample_type').attr("s_type");
    }

    var IsLock = $('#IsLock').val();  //锁定状态
    //var IsTransmit = $('#IsTransmit').val();  //转发状态
    var IsTransmit = getSelectedItemWithDou(document.getElementById('IsTransmit'))//转发状态

    if (IsSpark == null) {
        IsSpark = "";
    }

    var txt_bow = escape($('#txt_bow').val());

    var qz = $('#txtqz').val(); //区站

    var start_report_date = $('#deal_startdate').val()//报告处理开始时间
    var end_report_date = $('#deal_enddate').val()//报告处理结束时间
    var ArcingSize_star = $('#ArcingSize_star').val()//燃弧大小
    var ArcingSize_end = $('#ArcingSize_end').val()//燃弧大小

    //如果选中向后台传入1，不选中则传空字符串，后台只用判断是否为空
    var show_repeat = $("#repeat_switch").is(":checked"); //重复报警
    var bug_switch = $("#bug_switch").is(":checked"); //典型缺陷
    var position_null = $("#position_null").is(":checked"); //位置为空
    var postOutSign = $("#portOut_sign").is(":checked"); //报告导出
    var alarm_order_sign = $("#alarm_order_sign").is(":checked"); //报警类型排序
    var notIncludedRepeatHistory = $("#notIncludedRepeatHistory").is(":checked"); //不包含历史重复
    var RepeatType = getSelectedItemRepeat();//重复类型
    var criterion = ($('#criterion').val() != '' ? $('#criterion').attr('code') : '');//判断类型

    var url_ex = data + '&ju=' + escape(ju)
                        + '&duanText=' + escape(jwdText)
                        + '&jwd=' + escape(jwd)
                        + '&jb=' + escape(jb)
                        + '&jlh=' + escape(jlh)
                        + '&locid=' + loccode
                        + '&startdate=' + startdate
                        + '&enddate=' + enddate
                        + '&zt=' + zt
                        + '&orgCode=' + orgCode
                        + '&orgName=' + orgName
                        + '&orgType=' + orgType
                        + '&locationCode=' + locationCode
                        + '&locationName=' + escape(locationName)
                        + '&locationType=' + locationType
                        + '&startkm=' + startkm
                        + '&endkm=' + endkm
                        + '&afcode=' + afcode
                   //     + '&line=' + line
                        + '&bjbm=' + bjbm
                        + '&QX_mark=' + QX_mark
                        + '&INITIAL_CODE=' +escape (INITIAL_CODE)
                        + '&INITIAL_CODE_TYPE=' +escape( INITIAL_CODE_TYPE)
    
                        + '&REPORT_PERSON=' + REPORT_PERSON
                        + '&SCENCESAMPLE_STR=' + SCENCE_SAMPLE//场景样本字符串
                        + '&VI_ANALYSIS=' + VI_ANALYSIS
                        + '&OX_ANALYSIS=' + OX_ANALYSIS
                        + '&xb=' + escape(direction)
                        + '&code=' + escape(code)
                        + '&code_type=' + escape(code_type)
                        + '&qz=' + escape(qz)
                        + '&show_repeat=' + escape(show_repeat ? "1" : "")
                        + '&bug_switch=' + escape(bug_switch ? "1" : "")
                        + '&position_null=' + escape(position_null ? "1" : "")
                        + '&weekly=' + escape(postOutSign ? "1" : "")
                        + '&JC_TYPE=' + jc_type
                        + '&start_report_date=' + start_report_date
                        + '&end_report_date=' + end_report_date
                        + '&start_per_of_arc=' + ArcingSize_star
                        + '&end_per_of_arc=' + ArcingSize_end
                        + '&StatisticsSign=' + StatisticsSign
                        + '&ACFLAG_CODE=' + escape(Parsing_cancel)
                        + '&SAMPLE_CODE=' + escape(Sample_code)
                        + '&SAMPLE_TYPE=' + escape(Sample_type)
                        + '&ISCLOCK=' + escape(IsLock)
                        + '&IS_TRANS_ALLOWED=' + escape(IsTransmit)
                        + '&is_spark=' + IsSpark
                        + '&criterion=' + criterion
                        + '&notIncludedRepeatHistory=' + escape(notIncludedRepeatHistory ? "1" : "")
                        + '&RepeatdivceType=' + RepeatType
                        + '&alarm_order_sign=' + escape(alarm_order_sign ? "1" : "")
    //     + '&temp=' + Math.random();

    if (data_type != null && data_type != undefined && data_type != "") {
        url_ex += "&data_type=" + data_type;
    }

    if (GetQueryString("poleCode") != null && GetQueryString("poleCode") != undefined && GetQueryString("poleCode") != "") {
        url_ex += "&poleCode=" + GetQueryString("poleCode");
    }

    return url_ex;


};

function SetWhereMemo() {
    $('#txt_whereMemo').html('');

    //GetLabel("juselect", "select", $("#juselect").find("option:selected").text());
    //GetLabel("duanselect", "select", $("#duanselect").find("option:selected").text());
    GetLabel("lineselect", "select", $("#lineselect").find("option:selected").text()); //线路
    GetLabel("direction", "text", $('#direction').val()); //行别
    GetLabel("carType", "select", $("#carType").find("option:selected").text()); //车型
    GetLabel("txt_bow", "select", $('#txt_bow').find("option:selected").text()); //弓位置
    GetLabel("JXWJ", "select", $('#JXWJ').find("option:selected").text()); //解析文件
    GetLabel("location", "text", $('#location').val()); //线路区站
    GetLabel("txtqz", "text", $('#txtqz').val()); //
    GetLabel("ddlorg", "text", $('#ddlorg').val()); //组织机构
    GetLabel("QX_mark", "text", $('#QX_mark').val()); //缺陷标志
    GetLabel("Parsing_cancel", "text", $('#Parsing_cancel').val()); //解析取消
    GetLabel("Sample_type", "text", $('#Sample_type').val()); //样本类型
    GetLabel("IsLock", "select", $('#IsLock').find("option:selected").text()); //锁定状态
    GetLabel("IsTransmit", "select", getseletText($('#IsTransmit'))); //转发状态

    GetLabel("txtpole", "text", $('#txtpole').val()); //杆号
    GetLabel("bjbm", "text", $('#bjbm').val()); //标签
    GetLabel("criterion", "text", $('#criterion').val()); //判断依据

    GetLabel("#startkm,#endkm", "text2", GetRangStr('startkm', 'endkm', '公里标')); //公里标

    GetLabel("citySel", "text", $('#citySel').val()); //数据类型
    GetLabel("INITIAL_CODE", "text", $('#INITIAL_CODE').val()); //原始类型
    GetLabel("ReportPerson", "text", $('#ReportPerson').val()); //报告人
    GetLabel("txt_fx", "text", $('#txt_fx').val()); //报警分析

    GetLabel("#txt_temp_hw1,#txt_temp_hw2", "text2", GetRangStr('txt_temp_hw1', 'txt_temp_hw2', '最高温度')); //最高温度
    GetLabel("#txt_temp_hj1,#txt_temp_hj2", "text2", GetRangStr('txt_temp_hj1', 'txt_temp_hj2', '环境温度')); //环境温度
    GetLabel("#txt_dg1,#txt_dg2", "text2", GetRangStr('txt_dg1', 'txt_dg2', '导高值')); //导高值
    GetLabel("#txt_lc1,#txt_lc2", "text2", GetRangStr('txt_lc1', 'txt_lc2', '拉出值')); //拉出值
    GetLabel("#txt_speed1,#txt_speed2", "text2", GetRangStr('txt_speed1', 'txt_speed2', '速度')); //速度
    GetLabel("#deal_startdate,#deal_enddate", "text2", GetRangStr('deal_startdate', 'deal_enddate', '处理时间')); //处理时间
    GetLabel("#ArcingSize_star,#ArcingSize_end", "text2", GetRangStr('ArcingSize_star', 'ArcingSize_end', '燃弧大小')); //燃弧大小
    GetLabel("#START_NUM_PIXELS,#END_NUM_PIXELS", "text2", GetRangStr('START_NUM_PIXELS', 'END_NUM_PIXELS', '燃弧像素')); //燃弧像素

    GetLabel("alarm_switch", "checkbox", $('#alarm_switch').is(":checked") ? "仅收藏" : ""); //仅收藏
    GetLabel("repeat_switch", "checkbox", $('#repeat_switch').is(":checked") ? "已确认重复报警" : ""); //已确认重复报警
    GetLabel("bug_switch", "checkbox", $('#bug_switch').is(":checked") ? "典型缺陷" : ""); //典型缺陷
    GetLabel("position_null", "checkbox", $('#position_null').is(":checked") ? "空位置" : ""); //空位置
    GetLabel("portOut_sign", "checkbox", $('#portOut_sign').is(":checked") ? "周报标志" : ""); //周报标志
    GetLabel("alarm_order_sign", "checkbox", $('#alarm_order_sign').is(":checked") ? "报警类型排序" : ""); //报警类型排序
    GetLabel("ScenceSample", "text", $('#ScenceSample').val());//场景样本
    GetLabel("IsAbnormity", "text", $('#IsAbnormity option:selected').html());//数据范围（正常/异常）
    $('.whereBlock').each(function () {

        var ForObjID = $(this).attr('For');
        var ForType = $(this).attr('ForType');

        var span_close = $(this).find('.lableClose');

        span_close.click(function () {

            switch (ForType) {
                case "select":
                    $('#' + ForObjID).val(0);
                    if ($('#' + ForObjID).attr('multiple') == 'multiple') { $('#' + ForObjID).multiselect('refresh') }//多选插件刷新
                    break;
                case "text":
                    $('#' + ForObjID).val('').attr("code", "");
                    if (ForObjID == 'location') {
                        var treeObj = $.fn.zTree.getZTreeObj("ULlocation");
                        treeObj.checkAllNodes(false);
                    };
                    if (ForObjID == 'QX_mark') {
                        var treeObj = $.fn.zTree.getZTreeObj("ULQX_mark");
                        treeObj.checkAllNodes(false);
                    };
                    if (ForObjID == 'Sample_type') {
                        var treeObj = $.fn.zTree.getZTreeObj("ULSample_type");
                        treeObj.checkAllNodes(false);
                    };
                    break;
                case "text2":
                    $(ForObjID).val('');

                    break;
                case "checkbox":
                    $('#' + ForObjID).removeAttr('checked');
                    if ($('#' + ForObjID).parent().hasClass('switch-on') && !$('#' + ForObjID).parent().hasClass('switch-off')) {
                        $('#' + ForObjID).parent().removeClass('switch-on');
                        $('#' + ForObjID).parent().addClass('switch-off')
                    }
                    break;
            }

            doQuery(1);

        })

    })


};

function GetLabel(objID, ForType, title) {

    if (title != undefined && title != '' && title != "全部" && title != "不限") {
        var re = "<span class='label label-info whereBlock' For='" + objID + "' ForType='" + ForType + "' >&nbsp;" + title + "&nbsp;<span class='icon-remove icon-white lableClose'></span>  </span>";
        // re += "<span>"+ line+"</span>";

        $('#txt_whereMemo').html($('#txt_whereMemo').html() + re);
    }
};

function GetRangStr(objID1, objID2, title) {
    var re = '';

    var att1 = '';
    if ($('#' + objID1).val() != '') {
        att1 = $('#' + objID1).val() + " ≤ ";
    }

    var att2 = '';
    if ($('#' + objID2).val() != '') {
        att2 = " ≤ " + $('#' + objID2).val();
    }



    if (att1 != '' || att2 != '') {
        re = att1 + title + att2;
    }

    return re;

};


//选择ju事件
function juChange(pcode) {
    loadOrgSelect(pcode, 'duan', null, 'ddlduan', null);
};
//选择DUAN事件
function duanChange(pcode) {

};

//线路改变
function lineChange(pcode) {
    $('#txtqz').inputSelect({
        type: 'StationSection',
        contant: 1,
        line: $('#lineselect').val()
    });
};



//获取选中项
function getSelectedItem(obj) {
    var slct = "";
    for (var i = 0; i < obj.options.length; i++)
        if (obj.options[i].selected == true) {
            slct += obj.options[i].value;
        }
    return slct;
};
//获取选中项 逗号版
function getSelectedItemWithDou(obj) {
    var slct = "";
    for (var i = 0; i < obj.options.length; i++)
        if (obj.options[i].selected == true) {
            slct += ',' + obj.options[i].value;
        }
    return slct.substring(1);
};
//获取选中项特定版  重复专用
function getSelectedItemRepeat() {
    var slct = "";
    if ($('#repeatOnlyNoRe').hasClass('chooseOne')) {
        slct += '1';
    }
    if ($('#repeatShowNewOne').hasClass('chooseOne')) {
        slct += '2';
    }
    if (slct == '12') {
        slct = '3';
    }
    if ($('#repeatWithAlarm').hasClass('chooseOne') && slct != '') {
        slct += 'alarm';
    }
    if ($('#chooseRepeatBtn').hasClass('chooseNotOne')) {
        slct = ''
    }
    return slct;
};

//获取级别
function getSelectedJB() {
    var slct = "";
    var red = $(".red-check").css('display');
    var orange = $(".orange-check").css('display');
    var yellow = $(".yellow-check").css('display');

    if (red != "none") {
        slct += $("#grade-one").attr('code');
    };
    if (orange != "none") {
        slct += $("#grade-two").attr('code');
    };
    if (yellow != "none") {
        slct += $("#grade-three").attr('code');
    };
    return slct;
};

//设置选中项
function setSelectdItem(objstr, selectobj) {
    for (var i = 0; i < selectobj.options.length; i++)
        if (objstr.indexOf(selectobj.options[i].value) >= 0) {
            selectobj.options[i].selected = true;
        }
};




function importToExcel(bol) {

    if (!make_html_input_judge()) {
        return false;
    }
    var show_saved = $("#alarm_switch").is(":checked");
    var reg = new RegExp("_", "g");
    var ids = getCookieValue("SaveAlarms").replace(reg, ",");
    if (ids != "" && ids != undefined) {


        var temp_form = document.createElement("form");

        temp_form.action = "/Report/AlarmExcel.aspx?" + GetUrlEx() + "&_w=" + window.screen.width + "&_h=" + window.screen.height;
        if (bol) {
            temp_form.action += '&pic_switch=true'
        } else {
            temp_form.action += '&pic_switch=false'
        }
        temp_form.target = "_blank";
        temp_form.method = "post";
        temp_form.style.display = "none";
        if (show_saved) {
            document.getElementById("saved_ids").name = 'ids';
            document.getElementById("saved_ids").value = ids;
            temp_form.appendChild(document.getElementById("saved_ids"));
        }
        document.body.appendChild(temp_form);
        temp_form.submit();
    } else {

        if (show_saved) {
            document.getElementById("saved_ids").value = "";
            ymPrompt.alert({ message: '还没有收藏的报警！', btn: [['是', 'yes']], title: '提醒' });
        } else {
            var url = '/Report/AlarmExcel.aspx?' + GetUrlEx() + "&_w=" + window.screen.width + "&_h=" + window.screen.height;
            if (bol) {
                url += '&pic_switch=true'
            } else {
                url += '&pic_switch=false'
            }
            window.open(url);
        }
    }
};

function importToRecord() {

    var show_saved = $("#alarm_switch").is(":checked");
    var reg = new RegExp("_", "g");
    var ids = getCookieValue("SaveAlarms").replace(reg, ",");
    if (ids != "" && ids != undefined) {


        var temp_form = document.createElement("form");

        temp_form.action = "/Report/3CTaskReport.aspx?table_type=3C&" + GetUrlEx() + "&_w=" + window.screen.width + "&_h=" + window.screen.height;
        temp_form.action += '&pic_switch=false'
        temp_form.target = "_blank";
        temp_form.method = "post";
        temp_form.style.display = "none";
        if (show_saved) {
            document.getElementById("saved_ids").name = 'ids';
            document.getElementById("saved_ids").value = ids;
            temp_form.appendChild(document.getElementById("saved_ids"));
        }
        document.body.appendChild(temp_form);
        temp_form.submit();
    } else {

        if (show_saved) {
            document.getElementById("saved_ids").value = "";
            ymPrompt.alert({ message: '还没有收藏的报警！', btn: [['是', 'yes']], title: '提醒' });
        } else {
            var url = '/Report/3CTaskReport.aspx?table_type=3C&' + GetUrlEx() + "&_w=" + window.screen.width + "&_h=" + window.screen.height;
            url += '&pic_switch=false'
            window.open(url);
        }
    }
};

var totalRows = 0;

function importToWord(show_head, level, type) {

    if (!make_html_input_judge()) {
        return false;
    }
    if (show_head) {
        // if (parseInt(totalRows) <= 60) {
        postRequest(show_head, limitCount);
        //} else {
        //    ymPrompt.alert({
        //        message: '超过导出上限' + (totalRows - 60) + '条，是否导出前60条数据？', btn: [['是', 'yes'], ['否', 'no']], title: '提醒', handler: function (msg) {
        //            if (msg == 'yes') {
        //                postRequest(show_head, 60);
        //            }
        //            else { }
        //        }
        //    })
        //}
    }
    else {
        if (parseInt(totalRows) <= limitCount) {

            postOUT(limitCount, level, type);
        } else {
            ymPrompt.alert({
                message: '超过导出上限' + (totalRows - limitCount) + '条，是否导出前' + limitCount + '条数据？', btn: [['是', 'yes'], ['否', 'no']], title: '提醒', handler: function (msg) {
                    if (msg == 'yes') {
                        postOUT(limitCount, level, type);
                    }
                    else { }
                }
            });
        }
    }
};




function postRequest(show_head, limitCount) {
    if (!make_html_input_judge()) {
        return false;
    }
    var show_saved = $("#alarm_switch").is(":checked");
    var ids = getCookieValue("SaveAlarms");
    if (ids != "" && ids != undefined) {
        document.getElementById("saved_ids").value = ids;
        var temp_form = document.createElement("form");
        temp_form.action = "/Report/AlarmReportCount.aspx?show_head=" + show_head + "&limit=" + limitCount + "&_w=" + window.screen.width + "&_h=" + window.screen.height;
        temp_form.target = "_blank";
        temp_form.method = "post";
        temp_form.style.display = "none";
        if (show_saved) {
            temp_form.appendChild(document.getElementById("saved_ids"));
        }
        document.body.appendChild(temp_form);
        temp_form.submit();
    } else {
        if (show_saved) {
            document.getElementById("saved_ids").value = "";
            ymPrompt.alert({ message: '还没有收藏的报警！', btn: [['是', 'yes']], title: '提醒' });
        } else {
            var url = '/Report/AlarmReportCount.aspx?' + GetUrlEx() + "&show_head=" + show_head + "&limit=" + limitCount + "&_w=" + window.screen.width + "&_h=" + window.screen.height;
            window.open(url);

        }
    }
}

//导出报告
function postOUT(limitCount, level, type) {

    if (!make_html_input_judge()) {
        return false;
    }
    var a = '';
    var show_saved = $("#alarm_switch").is(":checked");
    if (show_saved) {
        var reg = new RegExp("_", "g");
        a = getCookieValue("SaveAlarms").replace(reg, ",");
        if (a.length <= 0) {
            ymPrompt.alert({ message: '还没有收藏的报警！', btn: [['是', 'yes']], title: '提醒' });
            return false
        }
    }
    var idsdata = {
        ids: a
    };
    var url = '/C3/PC/MAlarmMonitoring/RemoteHandlers/GetMonitorLocoAlarmList.ashx?action=start&' + GetUrlEx() + "&limit=" + limitCount;

    showLayer();
    $.ajax({//现在的等待函数
        type: "POST",
        data: idsdata,
        url: url,
        cache: false,
        async: true,
        success: function (result) {
            if (result != "") {
                if (result == "True") {
                    url = '/C3/PC/MAlarmMonitoring/RemoteHandlers/GetMonitorLocoAlarmList.ashx?action=produce&' + GetUrlEx() + "&limit=" + limitCount;


                    if (level == 3) {
                        var downloadUrl = "/C3/PC/MAlarmMonitoring/downloadReportBureau_norepeat.ashx?" + GetUrlEx() + "&limit=" + limitCount + "&_w=" + window.screen.width + "&_h=" + window.screen.height;
                    } else if (level == 2) {
                        var downloadUrl = "/C3/PC/MAlarmMonitoring/downloadReportBureau.ashx?" + GetUrlEx() + "&limit=" + limitCount + "&_w=" + window.screen.width + "&_h=" + window.screen.height + "&gover_type=" + type;
                    } else if (level == 1) {
                        var downloadUrl = "/C3/PC/MAlarmMonitoring/downloadreportCombine.ashx?" + GetUrlEx() + "&limit=" + limitCount + "&_w=" + window.screen.width + "&_h=" + window.screen.height;
                    } else {
                        var downloadUrl = "/C3/PC/MAlarmMonitoring/downloadreport.ashx?action=download&" + GetUrlEx() + "&limit=" + limitCount + "&_w=" + window.screen.width + "&_h=" + window.screen.height;
                    }


                    planAjax(url, downloadUrl, idsdata, level);
                }
            }
        }
    })
}


//导出报告单个
function portOutwordSingle(wid) {

    if (!make_html_input_judge()) {
        return false;
    }
    var reg = new RegExp("_", "g");
    var ids = getCookieValue("SaveAlarms").replace(reg, ",");
    var downloadUrl = "/C3/PC/MAlarmMonitoring/downloadreport.ashx?action=downloadSingle&alarmid=" + wid.id;
    var url = "/C3/PC/MAlarmMonitoring/downloadReportDoc.aspx?action=start&alarmid=" + wid.id;
    $.ajax({//现在的等待函数
        type: "POST",
        url: url,
        cache: false,
        async: true,
        success: function (result) {
            if (result != "") {
                if (result == "True") {
                    down_ajax(downloadUrl)
                } else if (result == "False") {
                    showLayer()
                    url = "/C3/PC/MAlarmMonitoring/downloadReportDoc.aspx?action=produce&alarmid=" + wid.id;
                    planAjaxSingle(url, downloadUrl);
                }
            }
        }
    })
}




////进度请求递归ajax
//function planAjax(jingduUrl) {
//    $.ajax({//进度请求
//        type: "POST",
//        url: jingduUrl,
//        cache:false,
//        async: true,
//        success: function (result) {
//            if (result != "") {

//                var n = parseFloat(result);

//                progressBar.percent(n);
//                $('#pecentNumber').html(n);
//                if ( n< 100) {
//                    setTimeout(function () {
//                        planAjax(jingduUrl)
//                    }, 500);
//                }
//                else {

//                    setTimeout(function () {
//                        $("#download_word").css("display", "block");
//                        $("#download_word").click(function () {
//                            var url = "/C3/PC/MAlarmMonitoring/downLoadReportZip.aspx?" + GetUrlEx() + "&_w=" + window.screen.width + "&_h=" + window.screen.height;
//                            window.open(url);
//                        })
//                    }, 500)
//                 }
//               }
//            }
//        })
//    }


function importToTemp() {

    if (!make_html_input_judge()) {
        return false;
    }
    var reg = new RegExp("_", "g");
    var ids = '';
    var show_saved = $("#alarm_switch").is(":checked");
    if (show_saved) {
        ids = getCookieValue("SaveAlarms").replace(reg, ",");
    }
    var url = '/Report/AlarmTemp.aspx?' + GetUrlEx() + "&ids_a=" + ids + "&_w=" + window.screen.width + "&_h=" + window.screen.height;

    var bjbm = document.getElementById('bjbm').value; //报警编码.
    if (bjbm != '') {
        url = '/Report/AlarmTemp.aspx?' + "&bjbm=" + bjbm + "&_w=" + window.screen.width + "&_h=" + window.screen.height;
    }
    window.open(url);
};

//查看重复对比详细信息
function goRepeate(id, pid) {
    var alarmid = pid;
    window.open("/Common/MDataAnalysis/C3RepeatAlarmImg.aspx?showclose=true&alarmid=" + alarmid + "&id=" + id + '&v=' + version + "&temp=" + Math.random());
};


function init_doquery() {
    if (FunEnable('Fun_batchSaveHandle') == "True" && GetQueryString('data_type') != 'ALARM') { $('#S_btnExlnew').show() }//批量处理按钮   控制项一层判断
    if (FunEnable('Fun_isCRH') == "False" && getConfig('debug') == "1") { $('#S_btnExlnew').show() }//批量处理按钮   内部机车直接放出来 不受控制项控制
    if (getConfig('debug') == "1") { //内部版本三级缺陷全部显示
        $("#TypicalDefects").css('display', '');
        $('#portOut_sign_choose').css('display', '');
    };

    if (getConfig('LevelType').indexOf("1") != -1) {
        $('.red-block').css({ 'background': 'url("/Common/img/MAlarmMonitoring/Grade-red.png") center no-repeat', 'color': '#e02929' });
        $('.red-block').find('.grade-img>img').attr('src', '/Common/img/MAlarmMonitoring/red-block.png');
        $('.red-check').show();
    }
    if (getConfig('LevelType').indexOf("2") != -1) {
        $('.orange-block').css({ 'background': 'url("/Common/img/MAlarmMonitoring/Grade-orange.png") center no-repeat', 'color': '#f29318' });
        $('.orange-block').find('.grade-img>img').attr('src', '/Common/img/MAlarmMonitoring/orange-block.png');
        $('.orange-check').show();
    }
    if (getConfig('LevelType').indexOf("3") != -1) {
        if (GetQueryString('data_type') == 'FAULT' || GetQueryString('data_type') == 'SUPERVISE') {
            //$(".yellow-block").css({ 'background': 'url("/Common/img/MAlarmMonitoring/Grade-gray3.png") center no-repeat', 'color': '#cecece' });
            //$(".yellow-block").find('.grade-img>img').attr('src', '/Common/img/MAlarmMonitoring/gray-block.png');
            //$('.yellow-check').hide();
            $('.yellow-block').hide();
            $('.GradeDiv').css('width', '260px');
        };
    };

    if (getConfig('LevelType').indexOf("3") == -1) {
        if (GetQueryString('data_type') == 'ALARM') {
            $(".yellow-block").css({ 'background': 'url("/Common/img/MAlarmMonitoring/Grade-gray3.png") center no-repeat', 'color': '#cecece' });
            $(".yellow-block").find('.grade-img>img').attr('src', '/Common/img/MAlarmMonitoring/gray-block.png');
            $('.yellow-check').hide();
        } else {
            $('.yellow-block').hide();
            $('.GradeDiv').css('width', '260px');
        };
    };
    //加载默认级别
    var jbJson = GetSeverityJson();
    for (var i = 0; i < jbJson.length; i++) {
        if (jbJson[i].code == "一类") {
            $("#grade-one").html(jbJson[i].name).attr('code', jbJson[i].code);
        }
        if (jbJson[i].code == "二类") {
            $("#grade-two").html(jbJson[i].name).attr('code', jbJson[i].code);
        }
        if (jbJson[i].code == "三类") {
            $("#grade-three").html(jbJson[i].name).attr('code', jbJson[i].code);
        }
    };
    if ($("#grade-three").html() == '') {
        if (getConfig('debug') != "1") {//三类 字典无  外部
            $("#grade-three").html(getConfig('Severity_Third')).attr('code', '三类');
        } else {
            $(".yellow-block").hide();
            $('.yellow-check').hide();
        }

    }
    var jsHtml = "";
    for (var i = 0; i < jbJson.length; i++) {
        if (jbJson[i].code == "三类" && getConfig('debug') != "1") {
            jsHtml += "<option value='" + jbJson[i].code + "'>" + jbJson[i].name + "</option>";
        } else {
            jsHtml += "<option selected value='" + jbJson[i].code + "'>" + jbJson[i].name + "</option>";
        }
    }
    if (jsHtml.split('三级').length == 1 && getConfig('debug') != "1") {
        jsHtml += "<option value='" + '三类' + "'>" + getConfig('Severity_Third') + "</option>";
    }
    if (jsHtml) {
        $("#jb").html(jsHtml);
    }
    //检测数据默认勾选三级
    if (GetQueryString('data_type') == 'ALARM') {
        $(".yellow-block").css({ 'background': 'url("/Common/img/MAlarmMonitoring/Grade-yellow.png") center no-repeat', 'color': '#d6cc27' });
        $(".yellow-block").find('.grade-img>img').attr('src', '/Common/img/MAlarmMonitoring/yellow-block.png');
        $('.yellow-check').show();
        $("#jb").val('三类');
    }
   
    $("#jb").multiselect({
        header: false,
        noneSelectedText: "请选择级别",
        checkAllText: "全选",
        uncheckAllText: '全不选',
        selectedList: 3,
        height: 100
    });
    //默认时间
    document.getElementById('startdate').value = DateLastWeekTime() + "00:00:00";
    document.getElementById('enddate').value = dateNowStr() + "23:59:59";

    if (GetQueryString("AlarmTime") != "" && GetQueryString("AlarmTime") != undefined) {

        $('#startdate').val(GetQueryString("AlarmTime"));
        $('#enddate').val(CdatehhssNowStr());

        doQuery(1);

    } else {
        if (IsSpark != null) {
            fromAlarmArcingAnalysis(); //从燃弧分析页面传数据过来
        }
        if (GetQueryString("fromDataMessage") == "true" ) {
            fromAbnormalRemindLoco()//参数来自异常数据列表设备列
        }
        loadFlexiGrid(); //加载flexigrid数据   
        doQuery(1);
    }
};

//原始文件批量导出
function original_file_export() {
    if (!make_html_input_judge()) {
        return false;
    }
    var a = '';
    var show_saved = $("#alarm_switch").is(":checked");
    if (show_saved) {
        var reg = new RegExp("_", "g");
        a = getCookieValue("SaveAlarms").replace(reg, ",");
        if (a.length <= 0) {
            ymPrompt.alert({ message: '还没有收藏的报警！', btn: [['是', 'yes']], title: '提醒' });
            return false
        }
    }
    var idsdata = {
        ids: a
    };
    layer.load(1, {
        shade: [0.5, '#000'] //0.1透明度的白色背景
    });
    var url = '/c3/pc/malarmmonitoring/batchdownloadmfc3.aspx?action=original&scencesample_sign=' + '&' + GetUrlEx()
    $.ajax({
        type: "POST",
        url: url,
        data: idsdata,
        async: true,
        cache: true,
        success: function (result) {
            layer.closeAll('loading')
            if (result != "" && result != undefined && result.url.length > 0) {
                for (var i = 0; i < result.url.length; i++) {
                    Downer("/c3/pc/malarmmonitoring/batchdownloadmfc3.aspx?action=originalrename&file=" + result.url[i] + "")
                }
            }
        },
        error: function (xhr) {
            layer.closeAll('loading')
            layer.msg('出错了！')
            console.warn(xhr)
        }

    });

}

//mfc3文件批量导出


function mfc3_portout_notOnlyOne() {
    if (!make_html_input_judge()) {
        return false;
    }

    var a = '';
    var show_saved = $("#alarm_switch").is(":checked");
    if (show_saved) {
        var reg = new RegExp("_", "g");
        a = getCookieValue("SaveAlarms").replace(reg, ",");
        if (a.length <= 0) {
            ymPrompt.alert({ message: '还没有收藏的报警！', btn: [['是', 'yes']], title: '提醒' });
            return false
        }
    }
    var idsdata = {
        ids: a
    };
    layer.load(1, {
        shade: [0.5, '#000'] //0.1透明度的白色背景
    });
    var url = '/c3/pc/malarmmonitoring/batchdownloadmfc3.aspx?action=getid&' + GetUrlEx()
    $.ajax({
        type: "POST",
        data: idsdata,
        url: url,
        async: true,
        cache: true,
        success: function (re) {
            layer.closeAll('loading')
            if (re != "" && re != undefined && re.list.length > 0) {
                for (var i = 0; i < re.list.length; i++) {
                    Loop_request_mfc3('', re.list[i])
                }
            }
        },
        error: function (xhr) {
            layer.closeAll('loading')
            layer.msg('出错了！')
            console.warn(xhr)
        }

    });

}
////mfc3文件导出(含报警历史)
function mfc3_portout_AlarmHistory() {
    if (!make_html_input_judge()) {
        return false;
    }
    var a = '';
    var show_saved = $("#alarm_switch").is(":checked");
    if (show_saved) {
        var reg = new RegExp("_", "g");
        a = getCookieValue("SaveAlarms").replace(reg, ",");
        if (a.length <= 0) {
            ymPrompt.alert({ message: '还没有收藏的报警！', btn: [['是', 'yes']], title: '提醒' });
            return false
        }
    }
    var idsdata = {
        ids: a
    };
    layer.load(1, {
        shade: [0.5, '#000'] //0.1透明度的白色背景
    });
    var url = '/c3/pc/malarmmonitoring/batchdownloadmfc3.aspx?action=getid&scencesample_sign=1' + '&' + GetUrlEx();
    $.ajax({
        type: "POST",
        data: idsdata,
        url: url,
        async: true,
        cache: true,
        success: function (re) {
            layer.closeAll('loading')
            if (re != "" && re != undefined && re.list.length > 0) {
                for (var i = 0; i < re.list.length; i++) {
                    Loop_request_mfc3('1', re.list[i])
                }
            }
        },
        error: function (xhr) {
            layer.closeAll('loading')
            layer.msg('出错了！')
            console.warn(xhr)
        }

    });

} 

//循环请求mfc3文件下载
function Loop_request_mfc3(hist, id) {
    var url = '/c3/pc/malarmmonitoring/batchdownloadmfc3.aspx?action=zip&scencesample_sign=' + hist + '&alarmid=' + id;
    Downer(url)
}

//趋势页面跳转附加条件获取
function from_AlarmStatisticalTrend() {
    if (GetQueryString('openType') == 'outside') {
        openTime++;
        StatisticsSign = 1;
        var sTime = GetQueryString('sTime')//开始时间
        var eTime = GetQueryString('eTime')//结束时间
        $('#startdate').val(sTime)
        $('#enddate').val(eTime)
        $('#ddlorg').val(GetQueryString('org_name'))
        $('#hf_ddlorg').val(GetQueryString('org_code'))
        $('#hf_type_ddlorg').val(GetQueryString('org_type'))
        var zt = GetQueryString('zt') //报警状态
        var jb = GetQueryString('jb') //报警级别
        $("#ddlzt>option").attr('selected', false)//置空状态栏
        //报警级别
        switch (jb) {
            case '0':
                $(".red-block").css({ 'background': 'url("/Common/img/MAlarmMonitoring/Grade-red.png") center no-repeat', 'color': '#e02929' });
                $(".red-block").find('.grade-img>img').attr('src', '/Common/img/MAlarmMonitoring/red-block.png');
                $('.red-check').show();

                $(".orange-block").css({ 'background': 'url("/Common/img/MAlarmMonitoring/Grade-orange.png") center no-repeat', 'color': '#f29318' });
                $(".orange-block").find('.grade-img>img').attr('src', '/Common/img/MAlarmMonitoring/orange-block.png');
                $('.orange-check').show();

                $(".yellow-block").css({ 'background': 'url("/Common/img/MAlarmMonitoring/Grade-yellow.png") center no-repeat', 'color': '#d6cc27' });
                $(".yellow-block").find('.grade-img>img').attr('src', '/Common/img/MAlarmMonitoring/yellow-block.png');
                $('.yellow-check').show();
                break;
            case '1':
                $(".red-block").css({ 'background': 'url("/Common/img/MAlarmMonitoring/Grade-red.png") center no-repeat', 'color': '#e02929' });
                $(".red-block").find('.grade-img>img').attr('src', '/Common/img/MAlarmMonitoring/red-block.png');
                $('.red-check').show();

                $(".orange-block").css({ 'background': 'url("/Common/img/MAlarmMonitoring/Grade-gray2.png") center no-repeat', 'color': '#cecece' });
                $(".orange-block").find('.grade-img>img').attr('src', '/Common/img/MAlarmMonitoring/gray-block.png');
                $('.orange-check').hide();

                $(".yellow-block").css({ 'background': 'url("/Common/img/MAlarmMonitoring/Grade-gray3.png") center no-repeat', 'color': '#cecece' });
                $(".yellow-block").find('.grade-img>img').attr('src', '/Common/img/MAlarmMonitoring/gray-block.png');
                $('.yellow-check').hide();
                break;
            case '2':
                $(".red-block").css({ 'background': 'url("/Common/img/MAlarmMonitoring/Grade-gray1.png") center no-repeat', 'color': '#cecece' });
                $(".red-block").find('.grade-img>img').attr('src', '/Common/img/MAlarmMonitoring/gray-block.png');
                $('.red-check').hide();

                $(".orange-block").css({ 'background': 'url("/Common/img/MAlarmMonitoring/Grade-orange.png") center no-repeat', 'color': '#f29318' });
                $(".orange-block").find('.grade-img>img').attr('src', '/Common/img/MAlarmMonitoring/orange-block.png');
                $('.orange-check').show();

                $(".yellow-block").css({ 'background': 'url("/Common/img/MAlarmMonitoring/Grade-gray3.png") center no-repeat', 'color': '#cecece' });
                $(".yellow-block").find('.grade-img>img').attr('src', '/Common/img/MAlarmMonitoring/gray-block.png');
                $('.yellow-check').hide();
                break;
            case '3':

                $(".red-block").css({ 'background': 'url("/Common/img/MAlarmMonitoring/Grade-gray1.png") center no-repeat', 'color': '#cecece' });
                $(".red-block").find('.grade-img>img').attr('src', '/Common/img/MAlarmMonitoring/gray-block.png');
                $('.red-check').hide();

                $(".orange-block").css({ 'background': 'url("/Common/img/MAlarmMonitoring/Grade-gray2.png") center no-repeat', 'color': '#cecece' });
                $(".orange-block").find('.grade-img>img').attr('src', '/Common/img/MAlarmMonitoring/gray-block.png');
                $('.orange-check').hide();

                $(".yellow-block").css({ 'background': 'url("/Common/img/MAlarmMonitoring/Grade-yellow.png") center no-repeat', 'color': '#d6cc27' });
                $(".yellow-block").find('.grade-img>img').attr('src', '/Common/img/MAlarmMonitoring/yellow-block.png');
                $('.yellow-check').show();
                break;

        }
        //报警状态
        switch (zt) {
            case '已取消':
                $("#ddlzt>option[value='AFSTATUS02']").attr('selected', true); //取消    
                break;
            case '新上报':
                $("#ddlzt>option[value='AFSTATUS01']").attr('selected', true); //新上报 
                break;
            case '已确认':
                $("#ddlzt>option[value='AFSTATUS03']").attr('selected', true); //已确认 
                break;
            case '全部':
                $("#ddlzt>option").attr('selected', true); //全选 
                break;
        }

    } else {
        return
    }

}

//从燃弧分析页面传数据过来
function fromAlarmArcingAnalysis() {
    var loco = GetQueryString('loco'); //车号
    var code = GetQueryString('code');  //线路或区站code
    var name = GetQueryString('name');  //线路或区站名称
    var direction = GetQueryString('direction');  //行别
    var time = GetQueryString('time'); //开始时间
    //var e_time = GetQueryString('e_time'); //结束时间
    var type = GetQueryString('type');   //判断线路或者是区站

    $("#txtloccode").val(loco);
    $("#location").val(name).attr({ "code": code, "treetype": type });
    $("#direction").val(direction).attr("code", direction);
    $('#startdate').val(time + " 00:00:00");
    $('#enddate').val(time + " 23:59:59");

    $("#ddlzt>option[value='AFSTATUS02']").attr('selected', true); //检修中    
    $("#ddlzt>option[value='AFSTATUS07']").attr('selected', true); //已取消
    $("title").text("设备检测数据列表");
};

//验证函数
function make_html_input_judge() {
    if (!$("#Form1").validationEngine("validate")) {
        return false;
    } else {
        return true;
    }
}
//验证场景样本输入格式
function SceneValidate(obj) {
    var val = obj.val().replace(/\s/g, "");
    if (val == '' || val == undefined) {
        return true;
    } else {
        var pattern = new RegExp(/^-?[\u4E00-\u9FA5]{1,}((-|\+|\*)[\u4E00-\u9FA5]{1,})*$/);
        if (pattern.test(val)) {
            return true;
        } else {
            layer.msg('场景样本输入格式有误！')
            return false;
        }
    };
}

//获取多选框文本值
function getseletText(jqobj) {
    var _text = '';
    jqobj.find("option:selected").each(function () {
        _text += ',' + $(this).text();
    })
    return _text.substring(1);
}


//从异常提醒页面 过来 位置
function fromAbnormalRemind() {
    var code = GetQueryString('orgcode');  //组织机构code
    var name = GetQueryString('orgname');  //组织机构name
    
    var direction = GetQueryString('direction');  //行别
    var directioncode = GetQueryString('directionCode');  //行别
    var stime = GetQueryString('stime'); //开始时间
    var etime = GetQueryString('etime'); //结束时间
    var startkm = GetQueryString('startkm'); //开始公里标
    var endkm = GetQueryString('endkm'); //结束公里标

    $("#ddlorg").val(name);//局名字
    $('#hf_type_ddlorg').val('J');//局type
    $('#hf_ddlorg').val(code)//局code
    $('#startdate').val(stime);
    $('#enddate').val(etime);
    $('#direction').val(direction).attr('code', directioncode);
    $('#startkm').val(startkm);
    $('#endkm').val(endkm);

    $("#ddlzt>option[value='AFSTATUS02']").attr('selected', true); //检修中    
    $("#ddlzt>option[value='AFSTATUS07']").attr('selected', true); //已取消
};


//从异常提醒页面 过来 设备
function fromAbnormalRemindLoco() {
    var loco = GetQueryString('loca');  //车

    var stime = GetQueryString('stime'); //开始时间
    var etime = GetQueryString('etime'); //结束时间
   
    $('#txtloccode').val(loco)
    $('#startdate').val(stime);
    $('#enddate').val(etime);

    $("#ddlzt>option[value='AFSTATUS02']").attr('selected', true); //检修中    
    $("#ddlzt>option[value='AFSTATUS07']").attr('selected', true); //已取消
};