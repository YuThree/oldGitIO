/*========================================================================================*
* 功能说明：告警列表
* 注意事项：
* 作    者： yhh
* 版本日期：2014年9月29日
* 变更说明：
* 版 本 号： V1.0.0
*=======================================================================================*/

/*========================================================================================*
* 功能说明：缺陷列表，报警列表。
* 注意事项：
* 作    者： zzj
* 版本日期：2014年11月26日
* 变更说明：改为1C-6C通用。 缺陷列表，报警列表。

页面参数        说明                        例子
ShowCloseBtn    &ShowCloseBtn=1             显示关闭按钮              
category        &category=1C                只查询某个C的数据     此属性会影响“检测类型”与“报警类型”的选项。     
data_type       &data_type=FAULT            设置显示“报警”还是“缺陷”,不传默认“报警”
dllzt           &dllzt=AFSTATUS04           设置默认状态（新上报、已计划....）                      
startdate       &startdate=2013-11-04       设置默认开始日期
enddate         &enddate=2013-12-04         设置默认结束日期
line            &line=DQX                   设置默认线路

AlarmTime       &AlarmTime=2013-11-04       设置默认开始日期（以前的参数，保持兼容）
id              &id=C2f3559354d1c4e0c8e6a0291dd6e0538   

Harddisk_Manage_ID                          巡检ID
summary         &summary=导高               缺陷描述
severity        &severity=一类              缺陷类型

* 版 本 号： V1.1.0
*=======================================================================================*/

var option; //表格内容
var V_CateGory = "0"; //0为取全部数据
var data_type = "";
var t_closeImgBox;
var t_closeArgumentsBox;
var Category = GetQueryString("category");//类型
var _index_fault; //添加缺陷的弹出框所属index
var pageSize_P = 24;  //支柱一页条数
var LogoJson = getCurUser();
var _index_add_fault; //提交缺陷是加载的遮罩层所属的index
var alarmStatus = GetQueryString("alarmStatus");//报警状态

//初始化加载
$(document).ready(function () {
    fullShow();

    //if (FunEnable('Fun_RepeatTypeWithAlarmType') == "True" && getConfig('For6C') == 'DPC' && 'DPC' !== Category) { //去重复，DPC中的1C、2C、4C报警列表独立版使用
    if (FunEnable('Fun_RepeatTypeWithAlarmType') == "True" && getConfig('For6C') == 'DPC') { //去重复，DPC中的1C、2C、4C、综合报警列表使用
        $('#chooseRepeatBtn').parent().show();
    } else {
        $('#chooseRepeatBtn').parent().hide();
    }

    //$('.dropdown-toggle').click(function () {
    //    $('.chooseType_saveList').css({ left: $('.caret').parent().offset().left + "px", top: $('.caret').parent().offset().top + $('.caret').parent().outerHeight() + "px" })
    //})//自动匹配下拉框位置
    if (FunEnable('Fun_batchSaveHandle') === 'False') {
        $('#taskHandle-btn').hide();
    }
    if (FunEnable('Fun_CollectAndBatchHandle') === 'False') {
        $('#batch').hide();
    }

    if (Category == "1C") {
        $("#import2C").hide();
        $("#import3C").hide();
        $("#import4C").hide();
        $("#import1C>a").html('<i class="icon-file"></i>反馈表');
    } else if (Category == "2C") {
        $("#import1C").hide();
        $("#import3C").hide();
        $("#import4C").hide();
        $("#import2C>a").html('<i class="icon-file"></i>反馈表');
    }else if (Category == "4C") {
        $("#import1C").hide();
        $("#import2C").hide();
        $("#import3C").hide();
        $("#import4C>a").html('<i class="icon-file"></i>反馈表');
    }
    else if (Category == "DPC") {
        $("#import1C").show();
        $("#import2C").show();
        $("#import3C").show();
        $("#import4C").show();
    } else {
        $("#import1C").hide();
        $("#import3C").hide();
    }
    var _time = new Date();
    _time.setTime(_time.getTime() - getConfig('DPCAriseTime') * 24 * 60 * 60 * 1000)

    //默认时间
    //document.getElementById('startdate').value = DateLastWeekTime() + "00:00:00";
    document.getElementById('startdate').value = _time.format('yyyy-MM-dd') + " 00:00:00";
    document.getElementById('enddate').value = dateNowStr() + "23:59:59";
    

    var jbJson = GetSeverityJson();//获取级别
    var jsHtml = "";
    for (var i = 0; i < jbJson.length; i++) {
        jsHtml += "<option value='" + jbJson[i].code + "'>" + jbJson[i].name + "</option>";
    }
    if (jsHtml) {
        $("#jb").html(jsHtml);
    }
    $("#jb").multiselect({
        //header: false,
        noneSelectedText: "全部",
        checkAllText: "全选",
        uncheckAllText: '全不选',
        selectedList: 3,
        height: 100,
        //wherePlace: 'up'

    });

    //去掉非3C的缺陷级别的三级
    //setTimeout(function () {
    //    switch (Category) {
    //        case 'C3':
    //            break;
    //        default:
    //            var typeNum = Category.split('C')[1];
    //            removeLevelThree('jb', typeNum);
    //            break;
    //    }
    //}, 800);

    $('#btn_close').click(function () {
        window.close();
    });
    loadOrgSelect("juselect", "duanselect", "chejianselect", "gongquselect");

    $('#txtqz').jHint({
        type: 'StationSection',
        listContainerCSSName: 'listContainerWhite',
        line: '',
        isStartEnd: true,
        //fixed: 'true'
    });

    //绑定行别
    $("#ddlxb").mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: '3C',
        cateGory: 'DRTFLG',
        enableFilter: false,
        onClick: function (event, treeId, treeNode) {
            $("#ddlxb").attr('code', treeNode.id).val(treeNode.name);
        }
    });

    //绑定检测类型
    $("#dll_lx").mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: 'DPC',
        p_code: "DET_TYPE",
        cateGory: 'DET_TYPE',
        enableFilter: false,
        onClick: function (event, treeId, treeNode) {
            $("#dll_lx").attr('code', treeNode.id).val(treeNode.name);
            var num = Number(treeNode.name.split('C')[0]);
            if (!isNaN(num) && num < 5) { //是数字，并且小于5
                $('.dropdown-menu > li').hide();
                $('.dropdown-menu > li:eq(' + num + ')').show();
                $('.dropdown-menu > li:eq(0)').show();
            } else {
                $('.dropdown-menu > li').hide();
                $('.dropdown-menu > li:eq(0)').show();
            }
        }
    });

    $('#dll_lx').next().find('img').click(function () {
        $('.dropdown-menu > li').show();
    });

    loadFlexiGrid();

    if ('' !== GetQueryString("line") && null !== GetQueryString("line") && undefined !== GetQueryString("line") && 'undefined' !== GetQueryString("line") &&
                '' !== GetQueryString("orgname") && null !== GetQueryString("orgname") && undefined !== GetQueryString("orgname") && 'undefined' !== GetQueryString("orgname")) {
        $('#lineselect').mySelect({
            tag: 'LINE',
            code: GetQueryString("line"),
            name: GetQueryString("orgname"),
            defaultValue: GetQueryString("line"),
            defaultText: GetQueryString("orgname")
        });
        setTimeout('doQuery()', 300);
    } else {
        $('#lineselect').mySelect({
            tag: 'LINE'
        });
        doQuery();
    }

    // 加载批量处理弹出框内容
    LoadSaveListBox("DPC");
    LoadSureBox()//加载报警确认框

    // 点击综合报警列表的批量按钮
    //$('#E_saveList').click(function () {
    //    GetSave();
    //});

    //if (FunEnable('Fun_BatchConfirmAlarm') == "True") {  //批量确认按钮
    //    $("#btn_PSureAlarm").show();
    //}
    //if (FunEnable('Fun_BatchButton') == "False") { //批量按钮
    //    $("#S_btnExlnew").hide();
    //} else {
        //if ('DPC' !== GetQueryString("category")) {
        //    $("#S_btnExlnew").hide();
        //}
    //}

    eventAddFault(); //手动添加缺陷事件

    $('.j-pole-check').click(function () {
        var _this = $(this);
        _this.addClass('pole-checked').siblings('.pole-raido').removeClass('pole-checked'); //siblings：遍历同胞元素
        var poleType = _this.attr('type');
        if ('pole-single' === poleType) { //选择单杆则禁用范围
            $('#txtpole-single').removeAttr('readonly').addClass('cur-pole-input');
            $('#txtpole-start').attr('readonly', 'readonly').removeClass('cur-pole-input').val('');
            $('#txtpole-end').attr('readonly', 'readonly').removeClass('cur-pole-input').val('');;
        }
        if ('pole-area' === poleType) { //选择范围则禁用单杆
            $('#txtpole-start').removeAttr('readonly').addClass('cur-pole-input');
            $('#txtpole-end').removeAttr('readonly').addClass('cur-pole-input');
            $('#txtpole-single').attr('readonly', 'readonly').removeClass('cur-pole-input').val('');
        }
    });
    chooseRepeat();
});

//去重复
function chooseRepeat() {

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
    });
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
    });
    $('#chooseRepeatBox div').click(function () {
        if ($(this).hasClass("chooseOne")) {
            $(this).removeClass("chooseOne").addClass('chooseNotOne');
        } else if ($(this).hasClass("chooseNotOne")) {
            $(this).removeClass("chooseNotOne").addClass('chooseOne');
        }
    });
    //去重复按钮end

    $(document).click(function (e) {
        //去重复按钮
        if (!$("#chooseRepeatBox").is(":hidden") && $(e.target).parents("#chooseRepeatBox").length === 0 && $(e.target).attr("id") != 'chooseRepeatBox' && $(e.target).attr("id") != 'chooseRepeatBtn') {
            $('#chooseRepeatBox').hide(200)
        }
    });
}

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

/*/*
   * 获取本地缓存中收藏的报警id
   *
   */
function GetSave() {
    var SaveAlarms = GetSaveAlarms();
};

function loadFlexiGrid() {

    if (GetQueryString("data_type") != null) {
        data_type = GetQueryString("data_type");
        var data_type_from = GetQueryString('data_type_from');
        if ('' === alarmStatus || undefined === alarmStatus || null === alarmStatus) {
            if (data_type == "FAULT") {
                if ('6CHardDiskManage' === data_type_from) {
                    $("#ddlzt option").attr("selected", true)//全选中
                } else {
                    $('#ddlzt').val('AFSTATUS03');
                    $("#ddlzt>option[value='AFSTATUS04']").attr('selected', true);
                    $("#ddlzt>option[value='AFSTATUS01']").remove();
                }
            }
        } else {
            var curAlarmStatus = alarmStatus.split('$');
            $("#ddlzt option").attr("selected", false)//全未选中
            for (var i = 0; i < curAlarmStatus.length; i++) {
                $('#ddlzt > option[value="' + curAlarmStatus[i] + '"]').attr('selected', true);
            }
        }
    }

    if (GetQueryString("ShowCloseBtn") != undefined && GetQueryString("ShowCloseBtn") != "") {
        $('#btn_close').show(); //显示关闭按钮
    }

    var selecturl;
    var baseUrl = "../RemoteHandlers/GetMonitorAlarmList.ashx";

    $('#choose-repeat').val(getSelectedItemRepeat());

    if (GetQueryString("category") != undefined && GetQueryString("category") != "") {
        V_CateGory = GetQueryString("category").toUpperCase();
        if (V_CateGory == "DPC") {
            if (data_type == "ALARM") {
                //$("#dll_lx option[value='2C']").remove();
                //$("#dll_lx option[value='4C']").remove();
            }


        }
        if (V_CateGory != "DPC") {
            $('#dll_lx').val(V_CateGory).attr({ 'disabled': "true", "code": V_CateGory });
            $('#dll_lx').next().remove();
        }
    }
    if (V_CateGory == "4C") {
        $('#DIV_LX_4C').css('display', '');
    }
    $("#citySel").attr('code', '');
    $('#citySel').mySelectTree_Level2({
        codeType: V_CateGory,
        cateGory: 'AFCODE',
        DPCSelectChildren: true,
        height: ($(window).height()-$('#citySel').parents('.box-content').height()) + 'px'
    });
    //$("#citySel").mySelectTree({
    //    tag: 'SYSDICTIONARYTREE',
    //    codeType: V_CateGory,
    //    cateGory: 'AFCODE',
    //    isDefClick: false,
    //    isSelectChildren: true,
    //    onClick: function (event, treeId, treeNode) {
           
            
    //        if (treeNode.pId == 'AFCODE') {
    //            var arr = treeNode.children, code = '';
    //            for (var j = 0; j < arr.length; j++) {
    //                code += arr[j].id + ',';
    //            }
    //            if (code.length > 0) {
    //                code = code.substring(0, code.length - 1);
    //            }
    //            $("#citySel").val(treeNode.name).attr("code", code);
    //        } else  {
    //            $("#citySel").val(treeNode.name).attr("code", treeNode.id);
    //        }
    //        if (treeNode.id == 'AFCODE') {
    //            $("#citySel").attr("code", '');
    //        }
    //        // $("input[id='citySel']").attr("value", treeNode.name);
    //    }
    //});

    var frominspectionList = GetQueryString("frominspectionList");//如果是来自巡检列表
    if (frominspectionList == 'true') {
        $('#startdate').val('');//开始时间清空
        $("#ddlzt option").attr("selected",true)//全选中
    }

    if (GetQueryString("dllzt") != undefined && GetQueryString("dllzt") != "") {

        var ids = GetQueryString("dllzt");

        //设置ddlzt的状态。。。。暂略

        $("#ddlzt").attr("value", ""); //清空选中项。 
        // var ids = '1,3,6'; //设置选中框ID。 
        var id_Ojbect = (ids).split(","); //分割为Ojbect数组。 
        var count = $("#ddlzt option").length; //获取下拉框的长度。 
        for (var c = 0; c < id_Ojbect.length; c++) {
            for (var c_i = 0; c_i < count; c_i++) {
                if ($("#ddlzt").get(0).options[c_i].value == id_Ojbect[c]) {
                    $("#ddlzt").get(0).options[c_i].selected = true; //设置为选中。 
                }
            }
        }

    }
    //来自综合分析页面  的设置
    if (GetQueryString('fromzh') == 'yes') {
        document.getElementById('startdate').value = (dateyearbeforeStr() + " 00:00:00");
        $('#ddlzt').find("option:contains('新上报')").attr("selected", true);
        $('#ddlzt').find("option:contains('已确认')").attr("selected", false);
        $('#ddlzt').find("option:contains('已计划')").attr("selected", false);
        $('#ddlzt').find("option:contains('检修中')").attr("selected", false);
        $('#ddlzt').find("option:contains('已取消')").attr("selected", false);
        $('#ddlzt').find("option:contains('已关闭')").attr("selected", false);
    }

    $("#ddlzt").multiselect({
        noneSelectedText: "==请选择==",
        checkAllText: "全选",
        uncheckAllText: '全不选',
        selectedList: 2
    });
    if (GetQueryString("id") != undefined && GetQueryString("id") != "") {
        //设置ID，以便查询使用....暂略
    }


    if (GetQueryString("AlarmTime") != "" && GetQueryString("AlarmTime") != undefined && GetQueryString("AlarmTime") != 'undefined') {
        var startDate = GetQueryString("AlarmTime");
        $('#startdate').val(startDate);
    }

    if (GetQueryString("startdate") != "" && GetQueryString("startdate") != undefined && GetQueryString("startdate") != 'undefined') {
        var startDate = GetQueryString("startdate");
        $('#startdate').val(startDate);
    }

    if (GetQueryString("enddate") != "" && GetQueryString("enddate") != undefined && GetQueryString("enddate") != 'undefined') {
        var startDate = GetQueryString("enddate");
        $('#enddate').val(startDate);
    }

    //if (GetQueryString("line") != "" && GetQueryString("line") != undefined) {
    //    var lineCode = GetQueryString("line");
    //    $('#lineselect').attr('value', lineCode);
    //}

    if (GetQueryString('direction') !== '' && GetQueryString('direction') !== undefined && GetQueryString("direction") != 'undefined') {
        var direction = GetQueryString('direction'); //行别
        $('#ddlxb').attr('value', direction);
    }

    //V_CateGory
    var _model;
    switch (V_CateGory) {
        case "1C":
            _model = [
                    { display: '拉出值', name: 'STAGGER', width: 150, sortable: false, hide: true, align: 'left' },
                    { display: '导高值', name: 'LINEHEIGHT', width: 150, sortable: false, hide: true, align: 'left' },
                    { display: '网压值', name: 'NETV', width: 150, sortable: false, hide: true, align: 'left' },
                    { display: '硬点值', name: 'HARDPOINT', width: 150, sortable: false, hide: true, align: 'left' },

                    { display: '线路', name: 'LINE_CODE', width: 80, align: 'left' },
                    { display: '位置信息', name: 'WZ', width: 330, align: 'left' },
                    { display: '检测时间', name: 'CREATED_TIME', width: 120, align: 'left' },
                    { display: '摘要', name: 'SUMMARY', width: 442, align: 'left' },
                    { display: '缺陷类型', name: 'QXTYPE', width: 85, align: 'left' },
                    { display: '缺陷等级', name: 'SEVERITY', width: 45, align: 'left' },
                    { display: '缺陷状态', name: 'STATUS', width: 60, align: 'left' },
                    { display: '检测类型', name: 'CATEGORY', width: 45, align: 'left' },
                    { display: '检测类型', name: 'CATEGORY_CODE', width: 45, hide: true, align: 'left' },
                    { display: '工区', name: 'G_TSYS_ORG', width: 100, align: 'left' },
                    { display: '车间', name: 'G_CJ_ORG', width: 100, align: 'left' },
                    { display: '段', name: 'G_DUAN_ORG', width: 100, align: 'left' },
                    { display: '局', name: 'G_JU', width: 100, align: 'left' },
                    { display: '主键', name: 'ID', width: 80, pk: true, hide: true, align: 'left' },
                    { display: '类型', name: 'C4TYPE', width: 80, hide: true, align: 'left' }
            ];
            //1C报警列表 显示拉出值、导高值、网压值、硬点值
            if (FunEnable('Fun_ARGUMENTS_1C') == "True") {
                _model.splice(4, 0, { display: '', name: 'arguments_1C', width: 25, sortable: false, align: 'center' });
                if ($('#S_btnExlnew').is(":hidden")) {
                    _model.splice(5, 0, { display: '收藏至', name: 'SELECT_DPC', width: 60, sortable: false, align: 'left', hide: true, });
                } else {
                    _model.splice(5, 0, { display: '收藏至', name: 'SELECT_DPC', width: 60, sortable: false, align: 'left' });

                }
            };
            break;
        case "2C":
            _model = [
                    { display: '高清全景', name: 'C2500Img', width: 150, sortable: false, hide: true, align: 'left' },
                    { display: '普通全景', name: 'C2100Img', width: 150, sortable: false, hide: true, align: 'left' },

                    { display: '线路', name: 'LINE_CODE', width: 80, align: 'left' },
                    { display: '位置信息', name: 'WZ', width: 260, align: 'left' },
                    { display: '检测时间', name: 'CREATED_TIME', width: 150, align: 'left' },
                    { display: '摘要', name: 'SUMMARY', width: 200, align: 'left' },
                    { display: '缺陷类型', name: 'QXTYPE', width: 85, align: 'left' },
                    { display: '缺陷等级', name: 'SEVERITY', width: 85, align: 'left' },
                    { display: '缺陷状态', name: 'STATUS', width: 80, align: 'left' },
                    { display: '检测类型', name: 'CATEGORY', width: 50, align: 'left' },
                    { display: '检测类型', name: 'CATEGORY_CODE', width: 45, hide: true, align: 'left' },
                    { display: '工区', name: 'G_TSYS_ORG', width: 150, align: 'left' },
                    { display: '车间', name: 'G_CJ_ORG', width: 150, align: 'left' },
                    { display: '段', name: 'G_DUAN_ORG', width: 150, align: 'left' },
                    { display: '局', name: 'G_JU', width: 150, align: 'left' },
                    { display: '主键', name: 'ID', width: 80, pk: true, hide: true, align: 'left' },
                    { display: '类型', name: 'C4TYPE', width: 80, hide: true, align: 'left' }
            ];
            //2C报警列表 全景图标显示
            if (FunEnable('Fun_IMG_2C') == "True") {
                _model.splice(2, 0, { display: '', name: 'IMG_2C', width: 25, sortable: false, align: 'center' });
                if ($('#S_btnExlnew').is(":hidden")) {
                    _model.splice(3, 0, { display: '收藏至', name: 'SELECT_DPC', width: 60, sortable: false, align: 'left', hide: true, });
                } else {
                    _model.splice(3, 0, { display: '收藏至', name: 'SELECT_DPC', width: 60, sortable: false, align: 'left' });

                }
            };
            break;
        case "4C":
            _model = [
                    { display: '局部', name: 'C4FaultImg', width: 150, sortable: false, hide: true, align: 'left' },
                    { display: '全景', name: 'C4AllImg', width: 150, sortable: false, hide: true, align: 'left' },

                    { display: '线路', name: 'LINE_CODE', width: 80, align: 'left' },
                    { display: '位置信息', name: 'WZ', width: 300, align: 'left' },
                    { display: '检测时间', name: 'CREATED_TIME', width: 120, align: 'left' },
                    { display: '摘要', name: 'SUMMARY', width: 400, align: 'left' },
                    { display: '缺陷类型', name: 'QXTYPE', width: 60, align: 'left' },
                    { display: '缺陷等级', name: 'SEVERITY', width: 60, align: 'left' },
                    { display: '缺陷状态', name: 'STATUS', width: 60, align: 'left' },
                    { display: '检测类型', name: 'CATEGORY', width: 50, align: 'left' },
                    { display: '检测类型', name: 'CATEGORY_CODE', width: 45, hide: true, align: 'left' },
                    { display: '工区', name: 'G_TSYS_ORG', width: 100, align: 'left' },
                    { display: '车间', name: 'G_CJ_ORG', width: 100, align: 'left' },
                    { display: '段', name: 'G_DUAN_ORG', width: 100, align: 'left' },
                    { display: '局', name: 'G_JU', width: 100, align: 'left' },
                    { display: '主键', name: 'ID', width: 80, pk: true, hide: true, align: 'left' },
                    { display: '类型', name: 'C4TYPE', width: 80, hide: true, align: 'left' }
            ];
            //4C报警列表 图标显示（全景、局部）
            if (FunEnable('Fun_IMG_4C') == "True") {
                _model.splice(2, 0, { display: '', name: 'IMG_4C', width: 25, sortable: false, align: 'center' });
                if ($('#S_btnExlnew').is(":hidden")) {
                    _model.splice(3, 0, { display: '收藏至', name: 'SELECT_DPC', width: 60, sortable: false, align: 'left', hide: true, });
                } else {
                    _model.splice(3, 0, { display: '收藏至', name: 'SELECT_DPC', width: 60, sortable: false, align: 'left' });

                }
            };
            break;
        default:
            _model = [
                    // 1C
                    { display: '拉出值', name: 'STAGGER', width: 150, sortable: false, hide: true, align: 'left' },
                    { display: '导高值', name: 'LINEHEIGHT', width: 150, sortable: false, hide: true, align: 'left' },
                    { display: '网压值', name: 'NETV', width: 150, sortable: false, hide: true, align: 'left' },
                    { display: '硬点值', name: 'HARDPOINT', width: 150, sortable: false, hide: true, align: 'left' },
                    // 2C
                    { display: '高清全景', name: 'C2500Img', width: 150, sortable: false, hide: true, align: 'left' },
                    { display: '普通全景', name: 'C2100Img', width: 150, sortable: false, hide: true, align: 'left' },
                    // 3C
                    { display: '红外', name: 'C3IRV', width: 150, sortable: false, hide: true, align: 'left' },
                    { display: '局部', name: 'C3VI', width: 150, sortable: false, hide: true, align: 'left' },
                    { display: '全景', name: 'C3OA', width: 150, sortable: false, hide: true, align: 'left' },
                    // 4C
                    { display: '局部', name: 'C4FaultImg', width: 150, sortable: false, hide: true, align: 'left' },
                    { display: '全景', name: 'C4AllImg', width: 150, sortable: false, hide: true, align: 'left' },

                    { display: '线路', name: 'LINE_CODE', width: 80, align: 'left' },
                    { display: '位置信息', name: 'WZ', width: 300, align: 'left' },
                    { display: '检测时间', name: 'CREATED_TIME', width: 120, align: 'left' },
                    { display: '摘要', name: 'SUMMARY', width: 500, align: 'left' },
                    { display: '缺陷类型', name: 'QXTYPE', width: 100, align: 'left' },
                    { display: '缺陷等级', name: 'SEVERITY', width: 45, align: 'left' },
                    { display: '缺陷状态', name: 'STATUS', width: 60, align: 'left' },
                    { display: '检测类型', name: 'CATEGORY', width: 45, align: 'left' },
                    { display: '检测类型', name: 'CATEGORY_CODE', width: 45, hide: true, align: 'left' },
                    { display: '工区', name: 'G_TSYS_ORG', width: 80, align: 'left' },
                    { display: '车间', name: 'G_CJ_ORG', width: 100, align: 'left' },
                    { display: '段', name: 'G_DUAN_ORG', width: 80, align: 'left' },
                    { display: '局', name: 'G_JU', width: 80, align: 'left' },
                    { display: '主键', name: 'ID', width: 80, pk: true, hide: true, align: 'left' },
                    { display: '类型', name: 'C4TYPE', width: 80, hide: true, align: 'left' }
            ];
            //DPC综合报警列表的显示图片和收藏
            //1C报警列表 显示拉出值、导高值、网压值、硬点值
            //2C报警列表 全景图标显示
            //3C报警列表 图标显示（红外、全景、局部）
            //4C报警列表 图标显示（全景、局部）
            if (FunEnable('Fun_IMG_COLLECT_DPC') == "True") {
                _model.splice(11, 0, { display: '', name: 'IMG_COLLECT_DPC', width: 25, sortable: false, align: 'center' });
                if ($('#S_btnExlnew').is(":hidden")) {
                    _model.splice(12, 0, { display: '收藏至', name: 'SELECT_DPC', width: 60, sortable: false, align: 'left', hide: true, });
                } else {
                    if (FunEnable('Fun_CollectAndBatchHandle') === 'False') {
                        _model.splice(12, 0, { display: '收藏至', name: 'SELECT_DPC', width: 60, sortable: false, align: 'left', hide: true, });
                    } else { 
                        _model.splice(12, 0, { display: '收藏至', name: 'SELECT_DPC', width: 60, sortable: false, align: 'left' });
                    }
                }
            };

    }

    var _height = $(window).height() - 230 - 20;
    if (($(parent.window).width() === 1440 && $(parent.window).height() === 900) || ($(parent.window).width() === 1680 && $(parent.window).height() === 1050)) {
        _height = $(window).height() - 230 - 20 - 40;
    }

    option = {
        url: selecturl,
        dataType: 'json',
        colModel: _model,
        width: 'auto',
        height: _height,
        rowId: 'ID',
        // showToggleBtn: true,
        onRowDblclick: newRowDblclick, //双击事件
        rp: parseInt(($(window).height() - 220) / 26.4),
        rpOptions: [parseInt(($(window).height() - 220) / 26.4), 30, 40],
        onSuccess: function (result) {
            fullHide();
            var json;

            if ('' !== result) {
                json = result.rows;
            }

            var flexTable_tr = $('#flexTable tr');
            for (var i = 0; i < json.length; i++) {
                if (FunEnable('Fun_TaskManage') == "False") {
                    $(flexTable_tr[i]).find('.table_select option[value="Mission"]').remove();
                }
            }

            //1C报警列表 显示拉出值、导高值、网压值、硬点值
            $('#flexTable tr .arguments-1C').each(function () {
                $(this).hover(function (e) {

                    clearTimeout(t_closeArgumentsBox);

                    var _LC_value = $(this).parent().parent().parent().find('td')[0].innerText; //拉出值
                    var _high_conductivity_value = $(this).parent().parent().parent().find('td')[1].innerText; //导高值
                    var _network_voltage_value = $(this).parent().parent().parent().find('td')[2].innerText; //网压值
                    var _hard_point_value = $(this).parent().parent().parent().find('td')[3].innerText; //硬点值
                    if (_LC_value == '-1000') {
                        _LC_value = ''; 
                    }
                    if (_high_conductivity_value == '-1000') {
                        _high_conductivity_value = '';
                    }
                    if (_network_voltage_value == '-1000') {
                        _network_voltage_value = '';
                    }
                    if (_hard_point_value == '-1000') {
                        _hard_point_value = '';
                    }
                    $('#LC').html(_LC_value + ' mm');
                    $('#high-conductivity').html(_high_conductivity_value + ' mm');
                    $('#network-voltage').html(_network_voltage_value);
                    $('#hard-point').html(_hard_point_value);

                    over(this, 'argumentsDiv', e);

                }, function () {
                    t_closeArgumentsBox = setTimeout(function () {
                        $('#argumentsDiv').hide();
                    }, 100);
                });
            });

            //2C报警列表 显示全景
            $('#flexTable tr .image-2C').each(function () {
                $(this).hover(function (e) {

                    clearTimeout(t_closeImgBox);

                    var _img_hd_view_2C = $(this).parent().parent().parent().find('td')[0].innerText; //高清全景
                    var _img_ordinary_view_2C = $(this).parent().parent().parent().find('td')[1].innerText; //普通全景

                    $('#img_hd_view_2C').attr('src', _img_hd_view_2C);
                    $('#img_ordinary_view_2C').attr('src', _img_ordinary_view_2C);

                    over(this, 'seleHeadDiv_2C', e);

                }, function () {
                    t_closeImgBox = setTimeout(function () {
                        $('#seleHeadDiv_2C').hide();
                    }, 100);
                });
            });

            //4C报警列表 显示全景、局部
            $('#flexTable tr .image-4C').each(function () {
                $(this).hover(function (e) {

                    clearTimeout(t_closeImgBox);

                    var _img_fault_view_4C = $(this).parent().parent().parent().find('td')[0].innerText; //局部
                    var _img_all_view_4C = $(this).parent().parent().parent().find('td')[1].innerText; //全景

                    $('#img_fault_view_4C').attr('src', _img_fault_view_4C);
                    $('#img_all_view_4C').attr('src', _img_all_view_4C);

                    over(this, 'seleHeadDiv_4C', e);

                }, function () {
                    t_closeImgBox = setTimeout(function () {
                        $('#seleHeadDiv_4C').hide();
                    }, 100);
                });
            });
            $('#flexTable .table_select').change(function () {
                var status = $(this).parent().parent().parent().find('span[class=status]').text();  //取出状态值
                if (status != '新上报' && status != '已确认') {
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
                //$('#chooseCansOrMissonDiv').hide();
            })

            $('#flexTable tr .table_select').each(function () {
                //遍历是否收藏指定类型 并显示 
                find_localStorg($(this), $(this).attr('code'))

            })
            //DPC综合报警列表显示图片和收藏按钮
            $('#flexTable tr .image-collect-DPC').each(function () {
                //移入图标显示图片
                $(this).hover(function (e) {

                    clearTimeout(t_closeImgBox);

                    var dll_lx = $(this).parent().parent().parent().find('td')[20].innerText; //检测类型
                    dll_lx = dll_lx.split('C')[0] + 'C';

                    var _data_DPC_1 = '';
                    var _data_DPC_2 = '';
                    var _data_DPC_3 = '';
                    var _data_DPC_4 = '';

                    var _img_view_DPC_1 = '';
                    var _img_view_DPC_2 = '';
                    var _img_view_DPC_3 = '';
                    if('0' === dll_lx || '5C' === dll_lx || '6C' === dll_lx){
                        return;
                    } else {
                        if ('1C' === dll_lx) {
                            _data_DPC_1 = $(this).parent().parent().parent().find('td')[0].innerText; //拉出值
                            _data_DPC_2 = $(this).parent().parent().parent().find('td')[1].innerText; //导高值
                            _data_DPC_3 = $(this).parent().parent().parent().find('td')[2].innerText; //网压值
                            _data_DPC_4 = $(this).parent().parent().parent().find('td')[3].innerText; //硬点值

                            $('#LC').html(_data_DPC_1 + ' mm');
                            $('#high-conductivity').html(_data_DPC_2 + ' mm');
                            $('#network-voltage').html(_data_DPC_3);
                            $('#hard-point').html(_data_DPC_4);

                            over(this, 'argumentsDiv', e);
                        } else {

                            _data_DPC_1 = '';
                            _data_DPC_2 = '';
                            _data_DPC_3 = '';
                            _data_DPC_4 = '';

                            if ('2C' === dll_lx) {
                                _img_view_DPC_1 = $(this).parent().parent().parent().find('td')[4].innerText; //高清全景
                                _img_view_DPC_2 = $(this).parent().parent().parent().find('td')[5].innerText; //普通全景
                            } else if ('3C' === dll_lx) {
                                _img_view_DPC_1 = $(this).parent().parent().parent().find('td')[6].innerText; //红外
                                _img_view_DPC_2 = $(this).parent().parent().parent().find('td')[7].innerText; //局部
                                _img_view_DPC_3 = $(this).parent().parent().parent().find('td')[8].innerText; //全景
                            } else if ('4C' === dll_lx) {
                                _img_view_DPC_1 = $(this).parent().parent().parent().find('td')[9].innerText; //局部
                                _img_view_DPC_2 = $(this).parent().parent().parent().find('td')[10].innerText; //全景
                            } else {
                                _img_view_DPC_1 = '';
                                _img_view_DPC_2 = '';
                                _img_view_DPC_3 = '';
                            }

                            if ('' !== _img_view_DPC_1) {
                                $('#img_view_DPC_1').css('display', '');
                                $('#img_view_DPC_1').attr('src', _img_view_DPC_1);
                            } else {
                                $('#img_view_DPC_1').css('display','none');
                            }
                            if ('' !== _img_view_DPC_2) {
                                $('#img_view_DPC_2').css('display', '');
                                $('#img_view_DPC_2').attr('src', _img_view_DPC_2);
                            } else {
                                $('#img_view_DPC_2').css('display', 'none');
                            }
                            if ('' !== _img_view_DPC_3) {
                                $('#img_view_DPC_3').css('display', '');
                                $('#img_view_DPC_3').attr('src', _img_view_DPC_3);
                            } else {
                                $('#img_view_DPC_3').css('display', 'none');
                            }

                            over(this, 'seleHeadDiv_DPC', e);
                        }
                    }
                }, function () {
                    t_closeImgBox = setTimeout(function () {
                        $('#argumentsDiv').hide();
                        $('#seleHeadDiv_DPC').hide();
                    }, 100);
                });
                //遍历是否收藏并标识 
                //var _alarmID = $(this).parent().parent().parent().find('td:last')[0].innerText.substr(1);  //去掉前面的'C'
                
                //var SaveAlarms = getCookieValue('SaveAlarms'); // window.localStorage.SaveAlarms; 
                //if (SaveAlarms != undefined && SaveAlarms != '') {
                //    if (SaveAlarms.indexOf(_alarmID) >= 0) {//已经存在
                //        $(this).find('.i_save').removeClass('icon-white').addClass('icon-color');
                //    } else {
                //        $(this).find('.i_save').removeClass('icon-color').addClass('icon-white');
                //    }
                //}

           



                //收藏功能
                //if (FunEnable('Fun_COLLECT_DPC') == 'True') {
                //    $(this).click(function () {
                //        var alarmID = $(this).parent().parent().parent().find('td:last')[0].innerText.substr(1); // $(this).parent().parent().parent().find('td')[20].innerText;
                //        var status = $(this).parent().parent().parent().find('span[class=status]').text();  //取出状态值
                        
                //        //添加收藏
                //        var SaveAlarms = getCookieValue('SaveAlarms'); // window.localStorage.SaveAlarms;
                //        if (SaveAlarms != undefined && SaveAlarms != '') {
                //            if (SaveAlarms.indexOf(alarmID) >= 0) { //已经存在
                //                DelStorageSaveAlarms(alarmID);
                //                $(this).find('.i_save').removeClass('icon-color').addClass('icon-white');
                //                return;
                //            } else if (status == '新上报' || status == '已确认') {//状态值为特定几种才能收藏
                //                SaveAlarms += '_' + alarmID;
                //                if (SaveAlarms.split('_').length > 1000) {
                //                    ymPrompt.alert('超过收藏最大限值1000，请先处理再进行操作！');
                //                    return false;
                //                }
                //                $(this).find('.i_save').removeClass('icon-white').addClass('icon-color');
                //            } else {
                //                ymPrompt.alert(status+"数据不能加入收藏");
                //            }
                //        } else {
                //            SaveAlarms = alarmID;
                //            $(this).find('.i_save').removeClass('icon-white').addClass('icon-color');
                //        }

                //        window.localStorage.SaveAlarms = SaveAlarms;
                //    });
                //}
                //new 收藏
                //if (FunEnable('Fun_COLLECT_DPC') == 'True') {
                //    $(this).click(function (e) {


                //        var alarmID = $(this).parent().parent().parent().find('td:last')[0].innerText.substr(1);
                //        var status = $(this).parent().parent().parent().find('span[class=status]').text(); //取出状态值

                //        //添加收藏
                //        var SaveAlarms = getCookieValue('SaveAlarms'); // window.localStorage.SaveAlarms;
                //        if (SaveAlarms != undefined && SaveAlarms != '') {
                //            if (SaveAlarms.indexOf(alarmID) >= 0) { //已经存在
                //                DelStorageSaveAlarms(alarmID);
                //                $(this).find('.i_save').removeClass('icon-color').addClass('icon-white');
                //                return;
                //            } else if (status == '新上报' || status == '已确认') {//状态值为特定几种才能收藏
                //                SaveAlarms += '_' + alarmID;
                //                over(this, 'chooseCansOrMissonDiv', e);
                //                $('#chooseCansOrMissonDiv').attr('code', alarmID)
                //                $('#flexTable').find('.icon-shoudle').removeClass('icon-shoudle')
                //                $(this).find('.i_save').addClass('icon-shoudle');
                //            } else {
                //                ymPrompt.alert(status + "数据不能加入收藏");
                //            }
                //        } else {
                //            SaveAlarms = alarmID;
                //            over(this, 'chooseCansOrMissonDiv', e);
                //            $('#chooseCansOrMissonDiv').attr('code', alarmID)
                //            $('#flexTable').find('.icon-shoudle').removeClass('icon-shoudle')
                //            $(this).find('.i_save').addClass('icon-shoudle');
                //        }
                //        window.localStorage.SaveAlarms = SaveAlarms;
                //    })
                //}
                });

        },
        onError: function () {
            fullHide();
        },
        preProcess: function (e) {
            fullHide();

            return e;
        }
    };
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
}

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
}

/*/*
 * @desc 新的列表行双击事件
 * @param 无
 * @return 无
 */
function newRowDblclick(rowData) {
    var id = rowData.ID.substr(1);  //rowData.属性名,源码中放进json的名;去掉前面的'C'
    var type = rowData.CATEGORY_CODE;
    toAlarmDetails(type, id);
};

//查询方法
function doQuery() {
    var ju = document.getElementById('juselect').value; //局
    var duan = document.getElementById('duanselect').value; //段
    var duanText = document.getElementById('duanselect').options[document.getElementById('duanselect').options.selectedIndex].text; //段名称
    var chejian = document.getElementById('chejianselect').value; //车间
    var gongqu = document.getElementById('gongquselect').value; //工区
    var line = document.getElementById('lineselect').value; //线路
    var xb = document.getElementById('ddlxb').value; //行别
    var txtqz = document.getElementById('txtqz').value; //区站
    if (txtqz != '') {
        var positioncode = $('#txtqz').attr('code'); //区站
        option.params = [{ name: 'positioncode', value: positioncode }];
    } else {
        option.params = '';
    }
    
    var txtstartkm = document.getElementById('txtstartkm').value; //开始公里标
    if (txtstartkm.length > 9 ) {
        tip('字符串过长，请重新填写', '#txtstartkm');
        return;
    }
    var txtendkm = document.getElementById('txtendkm').value; //开始公里标
    if (txtendkm.length > 9) {
        tip('字符串过长，请重新填写', '#txtendkm');
        return;
    }
    var obj = document.getElementById('jb'); //级别
    var jb = getSelectedItem(obj);
    var ddllx = $('#dll_lx').attr("code"); //检测类型 1C 2C 3C
    if (ddllx == "") {
        ddllx = 0
    }
    var lx_4c = document.getElementById('LX_4C').value; //类型 查询小4C和老4C

    if (ddllx != "4C") {
        lx_4c = "0";
    }

    //var codeName = document.getElementById('citySel').value; //报警类型
    var code = ''; //报警类型
    if ($('#citySel').val() != '') { code = $('#citySel').attr("code"); }//报警类型

    var dllzt = getSelectedItem(document.getElementById('ddlzt'));
    var startdate = document.getElementById('startdate').value;
    var enddate = document.getElementById('enddate').value;
    if('' === startdate){
        tip('不能为空', '#startdate');
        return;
    }
    if ('' === enddate) {
        tip('不能为空', '#enddate');
        return;
    }
    if (startdate != null && startdate != "" && enddate != null && enddate != "") {
        if (enddate < startdate) {
            ymPrompt.errorInfo('结束时间必须比开始时间大~！！', null, null, '提示信息', null);
            return;
        }
    }
    //var txtpole = document.getElementById('txtpole').value;

    var poleSingle = $('#txtpole-single').val();
    var poleStart = $('#txtpole-start').val();
    var poleEnd = $('#txtpole-end').val();

    var RepeatType = getSelectedItemRepeat();//重复类型

    option.url = 'RemoteHandlers/GetMonitorAlarmList.ashx?duan=' + escape(duan) +
           '&duanText=' + escape(duanText) +
            '&chejian=' + escape(chejian) +
            '&ju=' + escape(ju) +
            '&gongqu=' + escape(gongqu) +
            '&line=' + escape(line) +
            '&xb=' + escape(xb) +
            //'&txtqz=' + escape(txtqz) +
            '&txtstartkm=' + txtstartkm +
            '&txtendkm=' + txtendkm +
            '&ddllx=' + ddllx +
            '&dllzt=' + dllzt +
            '&startdate=' + startdate +
            '&enddate=' + enddate +
            '&jb=' + escape(jb) +
            '&txtpole=' + poleSingle +
            '&start_pole_no=' + poleStart +
            '&end_pole_no=' + poleEnd +
            //'&codeName=' + escape(codeName) +
            '&code=' + code +
            '&lx_4c=' + escape(lx_4c) +
            '&temp=' + Math.random() +
            '&RepeatdivceType=' + RepeatType;

    //来自综合分析页面  的设置
    if (GetQueryString('fromzh') == 'yes') {
        option.url += "&data_type=ALARM";
    }else if (data_type != undefined && data_type != "") {

        option.url += "&data_type=" + data_type;

        switch (data_type) {
            case 'FAULT':
                $('#list_title').html('缺陷数据');
                break;
        }

    }
    var tempUrl_para = GetQueryString("id");
    if (tempUrl_para != undefined && tempUrl_para != "") {

        option.url += "&id=" + tempUrl_para;

    }

    tempUrl_para = GetQueryString("Harddisk_Manage_ID");
    if (tempUrl_para != undefined && tempUrl_para != "") {

        option.url += "&Harddisk_Manage_ID=" + tempUrl_para;

    }

    tempUrl_para = GetQueryString("summary");
    if (tempUrl_para != undefined && tempUrl_para != "") {

        option.url += "&summary=" + tempUrl_para;

    }

    tempUrl_para = GetQueryString("severity");
    if (tempUrl_para != undefined && tempUrl_para != "") {

        option.url += "&severity=" + tempUrl_para;

    }
    option.newp = 1;
    $("#flexTable").flexigrid(option);
    $("#flexTable").flexOptions(option).flexReload();
    clearValue();
};
//导出
function importToExcelBack() {
    var ju = document.getElementById('juselect').value; //局
    var duan = document.getElementById('duanselect').value; //段
    var chejian = document.getElementById('chejianselect').value; //车间
    var gongqu = document.getElementById('gongquselect').value; //工区
    var line = document.getElementById('lineselect').value; //线路
    var txtqz = document.getElementById('txtqz').value; //区站
    var xb = document.getElementById('ddlxb').value; //行别
    var startkm = document.getElementById('txtstartkm').value; //开始公里标
    var endkm = document.getElementById('txtendkm').value; //开始公里标
    var ddllx = $('#dll_lx').attr("code"); //数据类型
    if (ddllx == "") {
        ddllx = 0
    }
    var dllzt = getSelectedItem(document.getElementById('ddlzt')); //数据状态
    var startdate = document.getElementById('startdate').value; //起始日期
    var enddate = document.getElementById('enddate').value; //结束日期
    //var txtpole = document.getElementById('txtpole').value; //杆号
    var poleSingle = $('#txtpole-single').val();
    var poleStart = $('#txtpole-start').val();
    var poleEnd = $('#txtpole-end').val();

    var obj = document.getElementById('jb'); //级别
    var jb = getSelectedItem(obj);
    //    var qxtype = document.getElementById('citySel').value; //报警类型 缺陷类型
    var qxtype = ''; //报警类型

    if ($('#citySel').val() != '') { qxtype = $('#citySel').attr("code"); }//报警类型
    var RepeatType = getSelectedItemRepeat();//重复类型

    var url = "/Report/6CAlarmTable.aspx?ju=" + escape(ju)
            + "&gdd=" + escape(duan)
            + "&cj=" + escape(chejian)
            + "&gq=" + escape(gongqu)
            + "&line=" + line
            + "&qz=" + txtqz
            + "&xb=" + xb
            + '&txtpole=' + poleSingle 
            + '&start_pole_no=' + poleStart 
            + '&end_pole_no=' + poleEnd 
            + '&jb=' + escape(jb)
            + "&startdate=" + startdate
            + "&enddate=" + enddate
            + "&startkm=" + startkm
            + "&endkm=" + endkm
            + "&qxtype=" + escape(qxtype)
            + "&category=" + ddllx
            + "&status=" + dllzt
            + "&data_type=" + data_type
            + "&_h=" + window.screen.height
            + "&_w=" + window.screen.width
            + '&RepeatdivceType=' + RepeatType;
    window.open(url);
};
function importToExcel(num) {
    var ju = document.getElementById('juselect').value; //局
    var duan = document.getElementById('duanselect').value; //段
    var duanText = document.getElementById('duanselect').options[document.getElementById('duanselect').options.selectedIndex].text; //段名称
    var chejian = document.getElementById('chejianselect').value; //车间
    var gongqu = document.getElementById('gongquselect').value; //工区
    var line = document.getElementById('lineselect').value; //线路
    var xb = document.getElementById('ddlxb').value; //行别
    var txtqz = document.getElementById('txtqz').value; //区站
    var positioncode = '';
    if (txtqz != '') {
        positioncode = $('#txtqz').attr('code'); //区站
        option.params = [{ name: 'positioncode', value: positioncode }];
    } else {
        option.params = '';
    }
    var txtstartkm = document.getElementById('txtstartkm').value; //开始公里标
    var txtendkm = document.getElementById('txtendkm').value; //开始公里标
    var obj = document.getElementById('jb'); //级别
    var jb = getSelectedItem(obj);
    var ddllx = $('#dll_lx').attr("code"); //检测类型 1C 2C 3C
    if (ddllx == "") {
        ddllx = 0
    }
    var lx_4c = document.getElementById('LX_4C').value; //类型 查询小4C和老4C

    if (ddllx != "4C") {
        lx_4c = "0";
    }

    //var codeName = document.getElementById('citySel').value; //报警类型
    var code = ''; //报警类型

    if ($('#citySel').val() != '') { code = $('#citySel').attr("code"); }//报警类型


    var dllzt = getSelectedItem(document.getElementById('ddlzt'));
    var startdate = document.getElementById('startdate').value;
    var enddate = document.getElementById('enddate').value;
    if (startdate != null && startdate != "" && enddate != null && enddate != "") {
        if (enddate < startdate) {
            ymPrompt.errorInfo('结束时间必须比开始时间大~！！', null, null, '提示信息', null);
            return;
        }
    }
    //var txtpole = document.getElementById('txtpole').value;
    var poleSingle = $('#txtpole-single').val();
    var poleStart = $('#txtpole-start').val();
    var poleEnd = $('#txtpole-end').val();

    var RepeatType = getSelectedItemRepeat();//重复类型

    var _url = "";
    if (num == "0") {
        _url = '/Report/6CAlarmTable.aspx?'
    } else if (num == "1") {
        _url = '/Report/1CTaskReport.aspx?'
    } else if (num == "2") {
        _url = '/Report/2CTaskReport.aspx?'
    } else if (num == "3") {
        _url = '/Report/3CTaskReport.aspx?'
    } else if (num == "4") {
        _url = '/Report/4CTaskReport.aspx?'
    } 

    _url += 'duan=' + escape(duan) +
           '&duanText=' + escape(duanText) +
            '&chejian=' + escape(chejian) +
            '&ju=' + escape(ju) +
            '&gongqu=' + escape(gongqu) +
            '&line=' + escape(line) +
            '&xb=' + escape(xb) +
            //'&txtqz=' + escape(txtqz) +
            '&positioncode=' + positioncode +
            '&txtstartkm=' + txtstartkm +
            '&txtendkm=' + txtendkm +
            '&ddllx=' + ddllx +
            '&dllzt=' + dllzt +
            '&startdate=' + startdate +
            '&enddate=' + enddate +
            '&jb=' + escape(jb) +
            '&txtpole=' + poleSingle + 
            '&start_pole_no=' + poleStart +
            '&end_pole_no=' + poleEnd + 
            '&code=' + code +
            '&lx_4c=' + escape(lx_4c) +
            '&temp=' + Math.random()+
            "&_h=" + window.screen.height+
            "&_w=" + window.screen.width +
            '&RepeatdivceType=' + RepeatType;

    if (data_type != undefined && data_type != "") {

        _url += "&data_type=" + data_type;

        switch (data_type) {
            case 'FAULT':
                $('#list_title').html('缺陷数据');
                break;
        }

    }
    var tempUrl_para = GetQueryString("id");
    if (tempUrl_para != undefined && tempUrl_para != "") {

        _url += "&id=" + tempUrl_para;

    }

    tempUrl_para = GetQueryString("Harddisk_Manage_ID");
    if (tempUrl_para != undefined && tempUrl_para != "") {

        _url += "&Harddisk_Manage_ID=" + tempUrl_para;

    }

    tempUrl_para = GetQueryString("summary");
    if (tempUrl_para != undefined && tempUrl_para != "") {

        _url += "&summary=" + tempUrl_para;

    }

    tempUrl_para = GetQueryString("severity");
    if (tempUrl_para != undefined && tempUrl_para != "") {

        _url += "&severity=" + tempUrl_para;

    }
    window.open(_url);

}
//
function tableToexcel() {
    AllAreaExcel('flexTable');
};
//
function showModel() {
    document.getElementById('modal-select').click();
};
//线路改变
function lineChange(pcode) {
    if (pcode == '0') {
        pcode = '';
    } 
    $('#txtqz').jHint({
        type: 'StationSection',
        line: pcode,
        listContainerCSSName: 'listContainerWhite',
        //fixed: 'true',
        isStartEnd: true
    });

};


//播放声音
function play_click(sef, url) {
    var div = document.getElementById('div1');
    div.innerHTML = '<embed src="' + url + '" loop="0" starttime="00:10" autostart="true" hidden="false"></embed>';
    var emb = document.getElementsByTagName('EMBED')[0];
    if (emb) {
        /* 这里可以写成一个判断 wav 文件是否已加载完毕，以下采用setTimeout模拟一下 */
        div = document.getElementById('div2');
        div.innerHTML = 'loading: ' + emb.src;
        sef.disabled = true;
        setTimeout(function () { div.innerHTML = ''; }, 1000);
    }
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

function getIP() {
    responseData = XmlHttpHelper.transmit(false, "get", "text", "../Report/RemoteHandlers/ReportControl.ashx?type=ip", null, null);
    return responseData;
}


//根据编码获得级别
function GetjbByID(str) {
    if (str == "1l") { return "一类"; }
    else if (str == "2l") { return "二类"; }
    else if (str == "3l") { return "三类"; }
    else { return "0"; }
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
function find_localStorg(obj,_alarmID) {
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

}

/*/*
 * 初始化缺陷信息
 *
 */
function initFaultInfo() {
    initDateControl('#raise-time'); //发生时间控件
    initDateControl('#report-time'); //报告时间控件

    $('#reporter').val(LogoJson.name); //报告人
    $('#report-time').val((new Date()).format('yyyy-MM-dd hh:mm:ss')); //报告时间

    //报警类型
    $('#alarm-type').mySelectTree_Level2({
        codeType: V_CateGory,
        cateGory: 'AFCODE',
        DPCSelectChildren: true,
        height: ($(window).height() - $('#citySel').parents('.box-content').height()) + 'px'
    });

    //线路区站
    $('#location').mySelectTree({
        tag: 'BRIDGETUNE',
        enableCheck: false,
        chkboxType: { "Y": "s", "N": "s" },
        nocheck: true,
        height: 250,
        enableFilter: true,
        filterNumber: 2,
        onClick: function (event, treeId, treeNode) {
            var treeObj = $.fn.zTree.getZTreeObj(treeId);
            treeObj.checkAllNodes(false);
            var treeNodeParent = '';
            var lineCode = '';
            var lineName = '';
            var positionName = '';
            var positionCode = '';
            var pName = '';

            if (!treeNode.isParent) { //如果是区站
                treeNodeParent = treeNode.getParentNode();
                lineName = treeNodeParent.name;
                lineCode = treeNodeParent.id;

                positionName = ' - ' + treeNode.name;
                pName = treeNode.name;
                positionCode = treeNode.id;
            } else { //如果是线路
                lineName = treeNode.name;
                lineCode = treeNode.id;

                positionName = '';
                positionCode = '';
            }

            $('#location').attr("value", "");
            $('#location').val(lineName + positionName).attr({ 'linename': lineName, 'linecode': lineCode, "positionname": pName, "positioncode": positionCode, "treetype": treeNode.treeType });
        }
    });

    //行别
    $("#directselect").mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: '3C',
        cateGory: 'DRTFLG',
        enableFilter: false,
        onClick: function (event, treeId, treeNode) {
            $("#directselect").attr('code', treeNode.id).val(treeNode.name);
        }
    });

    if ( '' === $('#upload-resource-file').html()) {
        //上传图片
        $('#upload-resource-file').myWebUpload({
            uploadBtnId: '#ctlBtn',
            uploadCategories: 'images',
            server: '/Common/MAlarmMonitoring/RemoteHandlers/DaliyWalkAlarm.ashx',
            uploadParams: {
                action: 'UpLoad'
            },
            onFinished: function (addCount, files, fileStr) {
                if (addCount === files.length) {
                    if ($('#pictures').val() === '') {
                        $('#pictures').val(fileStr);
                    }
                    addFault();
                }
            }
        });
    }

    //加载转任务html
    $('#iframe_task').attr('src', '/Common/MTask/TaskHandle.htm?id=BatchOk&type=openFaultTask&toTaskType=step_pet_Totask&v=' + version).css('height', '372px');
    setTimeout(function () {
        $('#iframe_task').contents().find('body').css('padding', '0');
        $('#iframe_task').contents().find('.task-ul').css('margin', '0').css('width', '100%');
    }, 500);
}

/*/*
 * 添加缺陷事件
 *
 */
function eventAddFault() {


    //转任务
    if (FunEnable('Fun_TaskManage') == "False") {
        $('#taskHandle').hide();
    } else {
        $('#taskHandle').show();
    }


    initFaultInfo(); //初始化缺陷信息


    //弹出添加缺陷框
    $('#S_add_fault').click(function () {
        if ('' === $('#upload-resource-file').html()) {
            //上传图片
            $('#upload-resource-file').myWebUpload({
                uploadBtnId: '#ctlBtn',
                uploadCategories: 'images',
                server: '/Common/MAlarmMonitoring/RemoteHandlers/DaliyWalkAlarm.ashx',
                uploadParams: {
                    action: 'UpLoad'
                },
                onFinished: function (addCount, files, fileStr) {
                    if (addCount === files.length) {
                        if ($('#pictures').val() === '') {
                            $('#pictures').val(fileStr);
                        }
                        addFault();
                    }
                }
            });
        }
        _index_fault = showDialog($('#add-fault'), '682px', '630px');
    });

    //支柱点击事件
    $('#polNumber').click(function () {
        var pole_nu = $(this).val();
        page = 1;
        queryPoleList(1, pole_nu);
    })
    $('#polNumber').bind('input propertychange', function () {
        var pole_nu = $(this).val();
        page = 1;
        queryPoleList(1, pole_nu);
    });

    //点击任意地方关闭弓位置下拉框
    $('html').bind("mousedown", function (e) {
        //支柱列表
        if ($(e.target).parents("#pol_choose").length === 0 && $('#pol_choose').css('display') != 'none' && $(e.target).attr('id') != 'polNumber' && $(e.target).attr('class') != 'pol_choose_div') {
            $('#pol_choose').hide();
        }
    });

    //添加缺陷提交事件
    $('#btn-add-fault').click(function (e) {
        $('#ctlBtn').trigger('click');
        e.stopPropagation();
    });
};

//清空添加缺陷中的值
function clearValue() {
    $('#alarm-type').attr('value', '').val('');
    $('#Useverity').val('0');
    $('#raise-time').attr('value', '').val('');
    $('#location').attr('value', '').val('').attr('linename', '').attr('linecode', '').attr('positionname', '').attr('positioncode', '');

    $('#directselect').val('');
    $('#polNumber').attr('value', '').val('');
    $('#kmStart').attr('value', '').val('');

    $('#org').html('组织机构');
    $('#GIS').html('GPS');
    $('#alarm_analysis').attr('value', '').val('');
    $('#upload-resource-file_listPic').html('');
    $('#upload-resource-file_listFile').html('');
    $('#upload-resource-file').html('');
}

//支柱列表请求
function queryPoleList(page, pole_nu) {
    var lineCode = $('#location').attr('linecode');  //线路code
    if (lineCode == null || lineCode == 0 || lineCode == undefined) {
        lineCode = '';
    }
    var positionCode = $('#location').attr('positioncode');  //区间code
    if (positionCode == null || positionCode == 0 || positionCode == undefined) {
        positionCode = '';
    }
    var dirct = "";//行别
    if ($('#directselect').val() != '') {
        dirct = $('#directselect').val();
    }
    var kmStart = $('#kmStart').val();  //开始公里标
    var kmEnd = $('#kmStart').val();  //结束公里标
    if (pole_nu == undefined) {
        pole_nu = $('#polNumber').val();
    } else {
        pole_nu = pole_nu.replace('#', '%23');
    }

    var _url = '/Common/MAlarmMonitoring/RemoteHandlers/DaliyWalkAlarm.ashx?action=GetPoleList'
                + '&lineCode=' + lineCode
                + '&direction=' + dirct
                + '&positionCode=' + positionCode
                + '&pole_no=' + pole_nu
                + '&startKM=' + kmStart
                + '&endKM=' + kmEnd
                + '&pageIndex=' + page
                + '&pageSize=' + pageSize_P;
    $.ajax({
        type: 'post',
        url: _url,
        async: true,
        cache: false,
        success: function (re) {
            if (re != '' && re != undefined && re != '-1' && re != '0' && re.data.length > 0) {
                PageCount = re.totalPages;
                $('#pol_choose').show();

                var html = '';
                for (var i = 0; i < re.data.length; i++) {

                    html += '<div class="one_pole" pole_no="' + re.data[i].POLE_NO + '" pole_code="' + re.data[i].POLE_CODE + '" km_mark="' + re.data[i].KM_MARK + '" km="' + re.data[i].KM + '" gis_lat="' + re.data[i].GIS_LAT + '" gis_lon="' + re.data[i].GIS_LON + '" org="' + re.data[i].ORG + '" org_code="' + re.data[i].ORG_CODE + '" org_name="' + re.data[i].ORG_NAME + '" ">\
                                   <div class="pole_number">'+ re.data[i].POLE_NO + '支柱</div>\
                                   <div class="km_number">' + re.data[i].KM + '</div>\
                               </div>'
                }

                html += ' <div class="pageOutSide">\
                                        <div class="page">\
                                            <div class="page-bg">\
                                                <a href="#" class="page-top">\
                                                    <img src="/Common/MGIS/img/gis-img/top.png" title="页首" alt="页首">\
                                                </a> <a href="#" class="page-pre">\
                                                    <img src="/Common/MGIS/img/gis-img/pre.png" title="上一页" alt="上一页">\
                                                </a> &nbsp;&nbsp;第&nbsp;&nbsp;<span class="page-numb pagecolor" id="page-numb">' + re.pageIndex + '</span>\
                                                &nbsp;&nbsp;页,共&nbsp;<span class="pagecolor" id="pageCount">' + re.totalPages + '</span>&nbsp;&nbsp;页,当前页<span class="pagecolor" id="PageSize">' + re.Current_pagesize + '</span>条,共<span class="pagecolor" id="Count">' + re.total_Rows + '</span>条数据\
                                                <a href="#" class="page-nex">\
                                                    <img src="/Common/MGIS/img/gis-img/nex.png" title="下一页" alt="下一页">\
                                                </a> <a href="#" class="page-last">\
                                                    <img src="/Common/MGIS/img/gis-img/last.png" title="页尾" alt="页尾">\
                                                </a>\
                                            </div>\
                                        </div>\
                                    </div>'
                $('#pol_choose').html(html);
                $('.pageOutSide').css({
                    left: (($('#pol_choose').outerWidth() - $('.pageOutSide').width()) / 2) > 35 ? 35 : (($('#pol_choose').outerWidth() - $('.pageOutSide').width()) / 2)
                });

                pageCtrl();
            } else {
                $('#pol_choose').html('');
                //$('#pol_choose').html('<div style="color:white;font-size:20px;line-height:50px;text-align:center;margin-bottom: -30px;">暂无数据！</div>');
                layer.msg('暂无支柱数据');
                return;
            }
        },
        error: function (msg) {
            console.log(msg);
        }
    });
};

//支柱分页控制
function pageCtrl() {
    $('.one_pole').click(function () {
        var _this = $(this);
        $('#polNumber').val(_this.attr('pole_no')).attr('code', _this.attr('pole_code'));
        $('#kmStart').val(_this.attr('km'));
        $('#org').html(_this.attr('org'));
        $('#GIS').html('GPS：经度 ' + _this.attr('gis_lon') + '      纬度 ' + _this.attr('gis_lat'));
        $('#pol_choose').hide();
        if ('' !== _this.attr('org_name')) {
            $('#iframe_task').contents().find('#form_org_name_label').html(_this.attr('org_name')).show(); //组织机构名称
            $('#iframe_task').contents().find('#form_org_name').val(_this.attr('org_name')); //组织机构名称
            $('#iframe_task').contents().find('#form_org_code').val(_this.attr('org_code')); //组织机构编码
            $('#iframe_task').contents().find('#dept_checkbox').attr('checked', 'checked').removeAttr('disabled');

            $('#iframe_task').contents().find('#form_recv_deptname_input').hide();
            if ($('#iframe_task').contents().find('#form_recv_deptname_input').parent().is('div')) {
                $('#iframe_task').contents().find('#form_recv_deptname_input').parent().hide();
            }
        }
    });
    //分页首页
    $(".page-top").click(function () {
        page = 1;
        queryPoleList(page); ///执行查询 (当前JS)
    });
    //分页上一页
    $(".page-pre").click(function () {
        if (page > 1) {
            page = page - 1;
            queryPoleList(page); ///执行查询 (当前JS)
        }
    });
    //分页下一页
    $(".page-nex").click(function () {
        if (page < PageCount) {
            page = page + 1;
            queryPoleList(page); ///执行查询 (当前JS)
        }
    });
    //分页尾页
    $(".page-last").click(function () {
        page = PageCount;
        queryPoleList(page); ///执行查询 (当前JS)
    });
};

//非空判断
function notNull(val) {
    var f = true;
    if ('' === val || undefined === val || null === val || '' === val) {
        f = false;
    }
    return f;
};

//添加缺陷
function addFault() {
    
    var alarmTypeName = $('#alarm-type').val(); //报警类型名称
    if (!notNull(alarmTypeName)) {
        tip('请选择报警类型', '#alarm-type', '', 2);
        return;
    }
    var alarmTypeCode = $('#alarm-type').attr('code'); //报警类型code
    if (!notNull(alarmTypeCode)) {
        tip('请选择报警类型', '#alarm-type', '', 2);
        return;
    }

    var severity = $('#Useverity').val(); //报警级别
    if (!notNull(severity)) {
        tip('请选择报警级别', '#Useverity', '', 2);
        return;
    }
    if ('0' === severity) {
        tip('请选择报警级别', '#Useverity', '', 2);
        return;
    }
    var raiseTime = $('#raise-time').val(); //发生时间
    if (!notNull(raiseTime)) {
        tip('请选择发生时间', '#raise-time', '', 2);
        return;
    }

    var lineCode = $('#location').attr('linecode'); //线路code
    if (!notNull(lineCode)) {
        tip('请选择线路区站', '#location', '', 2);
        return;
    }
    var lineName = $('#location').attr('linename'); //线路名称
    if (!notNull(lineName)) {
        tip('请选择线路区站', '#location', '', 2);
        return;
    }

    var positionCode = $('#location').attr('positioncode'); //区站code
    var positionName = $('#location').attr('positionname'); //区站名称

    var direction = $('#directselect').val(); //行别
    if (!notNull(direction)) {
        tip('请选择行别', '#directselect', '', 2);
        return;
    }
    if ('0' === direction) {
        tip('请选择行别', '#directselect', '', 2);
        return;
    }

    var poleNo = $('#polNumber').val(); //杆号
    if (!notNull(poleNo)) {
        tip('请选择杆号或输入杆号', '#polNumber', '', 2);
        return;
    }
    var poleCode = $('#polNumber').attr('code'); //杆编码
    if (!notNull(poleCode)) {
        tip('请选择杆号或输入杆号', '#polNumber', '', 2);
        return;
    }

    var km = $('#kmStart').val(); //公里标
    if (!notNull(km)) {
        tip('请输入公里标', '#kmStart', '', 2);
        return;
    }
    var alarmAnalysis = $('#alarm_analysis').val(); //异常描述
 
    var reporter = $('#reporter').val(); //报告人
    var reportTime = $('#report-time').val(); //报告时间
    if (!notNull(reportTime)) {
        tip('请选择报告时间', '#report-time', '', 2);
        return;
    }

    var files = $('#pictures').val(); //图片

    var _url = '/Common/MAlarmMonitoring/RemoteHandlers/DaliyWalkAlarm.ashx?action=Add'
            + '&code=' + alarmTypeCode
            + '&code_name=' + alarmTypeName
            + '&severity=' + severity
            + '&raised_time=' + raiseTime
            + '&line_code=' + lineCode
            + '&line_name=' + lineName
            + '&position_code=' + positionCode
            + '&position_name=' + positionName
            + '&direction=' + direction
            + '&pole_no=' + poleNo
            + '&pole_code=' + poleCode
            + '&km=' + km
            + '&alarm_analysis=' + alarmAnalysis
            + '&files=' + files
            + '&report_person=' + reporter
            + '&report_date=' + reportTime;
    $.ajax({
        type: 'post',
        url: _url,
        async: true,
        cache: false,
        success: function (result) {
            if ('True' === result.re && '' !== result.alarmid) {
                //转任务所需参数
                $('#iframe_task').contents().find("#form_category_code").val('DailyWalk');
                $('#iframe_task').contents().find("#form_tid").val(result.alarmid);
                $('#iframe_task').contents().find("#form_summary").val(alarmTypeName);
                $('#iframe_task').contents().find("#form_severity_name").val(severity);
                $('#iframe_task').contents().find("#form_code").val(alarmTypeCode);

                //调用子页面的转任务方法
                $('#iframe_task').contents()[0].defaultView.setAlarmId(result.alarmid);

                $(window.frames['iframe_task'].document).find('#form_recv_dept_1').attr('name', ''); //接收机构编码
                $(window.frames['iframe_task'].document).find('#form_recv_deptname_1').attr('name', ''); //接收机构名称

                $('#iframe_task').contents()[0].defaultView.task_uploadFile('toTask', 'commit');

                //layer.msg('添加成功');
            }
            if ('False' === result.re) {
                layer.msg('添加失败');
            }
        },
        error: function (msg) {
            console.log(msg);
        }
    });
};

/**
 * @desc 弹出对话框
 * @param 
 */
function showDialog($targetElement, width, height) {
    var _index =
        layer.open({
            type: 1,
            skin: 'dialog_box',
            shade: [0.3, '#393D49'],
            title: false, //不显示标题
            fix: false,
            closeBtn: 2,
            area: [width, height], //宽高
            content: $targetElement.show(), //捕获的元素
            cancel: function (index) {
                layer.close(index);
                clearValue();
            }
        });
    return _index;
};

//根据屏幕大小移动节点，布局结构
$(function () {
    var _w = $(window).width();
    //根据屏幕大小移动节点，布局结构
    if (_w < 1601) {
        moveNode($('#condition-ul li:eq(11)'), $('#condition-ul li:eq(5)'));
    }
});

/*/*
 * @desc 移动节点
 * @param targetNode：目标节点
 * @param pendingNode：待移动的节点
 * @return 无
 */
function moveNode(targetNode, pendingNode) {
    var _targetNode = $(targetNode);
    var _pendingNode = $(pendingNode);
    _pendingNode.insertBefore(_targetNode); //移动节点
}