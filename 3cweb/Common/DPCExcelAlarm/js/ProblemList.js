var _w = $(window).width();
var _h = $(window).height();
var PageAlarmJson = '';
var option;//表格内容
var layerIndex = '';
var pageSize_P = 24;
var PageCount = 1;  //支柱总页数
var pageSize_P = 24;  //支柱一页条数
$(document).ready(function () {
    //加载上传控件
    loadSelect();//加载下拉菜单
    //$('.ztreeInput').find('input ::-webkit-input-placeholder').css('text-align', 'center');
    var org_name = getCurUser().orgName;
    if (org_name.indexOf('车间') > -1 || org_name.indexOf('工区') > -1) {
        $('#S_btnAdd').css('background-color', 'grey');
        $('#S_btnAdd').attr('disabled', 'disabled');
    };
    $('#close').click(function () {
        $('.formError').hide();
        $('.U-resource').remove();
        $('.U-resourceFile').remove();
        $('#processdetails-resource').html('');
        $('#processdetails-resourceFile').html('');
        $('#fileList-resource-pic').html('');
        $('#fileList-resource-file').html('');
        $('#fileList-resourceFile-pic').html('');
        $('#fileList-resourceFile-file').html('');
        var formError = $('.formError', document);
        if (formError.length > 1) {
            for (var i = 0; i < formError.length; i++) {
                if (!$(formError[i]).hasClass('DUTY_UNITSformError')) {
                    $(formError[i]).remove();
                }
            }
        };
    });
    document.getElementById('RaisedTime').value = DateLastWeekTime();
    document.getElementById('txt_StartDate').value = DateLastWeekTime();
    document.getElementById('txt_EndDate').value = dateNowStr();
    $("#Form1").validationEngine({
        validationEventTriggers: "blur",  //触发的事件  "keyup blur",   
        inlineValidation: true, //是否即时验证，false为提交表单时验证,默认true   
        success: false, //为true时即使有不符合的也提交表单,false表示只有全部通过验证了才能提交表单,默认false
        promptPosition: "topLeft" //提示位置，topLeft, topRight, bottomLeft,  centerRight, bottomRight
        //        validateNonVisibleFields: true
    });
    //$('.PoleNumberformError').find('.formErrorContent').html('*只能为数字或者字母');
    $('#defaultForm').validationEngine({
        validationEventTriggers: "",  //触发的事件  "keyup blur",   
        inlineValidation: true, //是否即时验证，false为提交表单时验证,默认true   
        success: false, //为true时即使有不符合的也提交表单,false表示只有全部通过验证了才能提交表单,默认false
        promptPosition: "topLeft", //提示位置，topLeft, topRight, bottomLeft,  centerRight, bottomRight
        autoHidePrompt: true,
        showOneMessage: true,
        autoHideDelay: 1000,
        fadeDuration: 0.3,
        showPrompts: false
    });
    $('#S_btnQuery').click(function () {//绑定查询事件
        var bool = $("#Form1").validationEngine("validate");
        if (bool) {
            doQuery(1);
        }
    });
    $('#downMedal').click(function () {//绑定下载模板事件
        var url_ = "/Common/DPCExcelAlarm/6CAlarm_Model.xls";
        Downer(url_);
    })
    $('#S_btnExport').click(function () {//绑定导出事件
        ExportToExcel();
    });
    //支柱点击事件
    $('#PoleNumber').bind('input propertychange', function () {
        $('.pol_choose_div').css({
            'top': $('#Severity').offset().top, 'left': $('#PoleNumber').offset().left
        });//设置支柱列表位置
        //  if ($('.pol_choose_div').is(":hidden")) {
        var pole_nu = $(this).val();
        var KmMark = $('#KmMark_km').val()
        page = 1;
        QueryPoleList(1, pole_nu, KmMark);
        $('.pol_choose_div').show();
        //  };
    });
    //公里标点击事件
    $('#KmMark_km').bind('input propertychange', function () {
        console.log($('#KmMark_km').width())
        $('.pol_choose_div').css({
            'top': $('#DevName').offset().top, 'left': $('#KmMark_km').offset().left - $('.pol_choose_div').width() + $('#KmMark_km').width()
        })
        //设置支柱列表位置
        //    if ($('.pol_choose_div').is(":hidden")) {
        var KmMark = $(this).val();
        var pole_nu = $('#PoleNumber').val();
        page = 1;
        QueryPoleList(1, pole_nu, KmMark);
        $('.pol_choose_div').show();
        //    };
    });
    //点击其余任何地方关闭支柱列表下拉框
    $('html').bind("mousedown", function (e) {
        if ($(e.target).parents(".pol_choose_div").length === 0 && $('.pol_choose_div').css('display') != 'none' && $(e.target).attr('id') != 'PoleNumber' && $(e.target).attr('class') != 'pol_choose_div') {
            $('.pol_choose_div').hide();
        }
    });

    $('#sub').click(function () {//绑定添加和修改的保存事件
        var bool = $("#defaultForm").validationEngine("validate");
        if (bool) {
            addOrUpdate();
        }
    });
    var org_name = getCurUser().orgName;
    if (org_name.indexOf('段') > -1 || org_name.indexOf('车间') > -1 || org_name.indexOf('工区') > -1) {
        $('#S_btnImport').css('background-color', 'grey');
        $('#S_btnImport').attr('disabled', 'disabled');
        $('#downMedal').hide();
    };
    if ($(window).width() < 1441) {
        $('#btn-td').css('width', '140px');
        $('#end-td').css('height', '20px');
    }
    loadFlexiGrid(); //绑定表格
});
function loadFlexiGrid() {
    var _h = $(window).height() - 250;
    var _PageNum = parseInt(_h / 27);
    var json = [
                { display: '操作', name: 'CZ', width: 70, sortable: false, align: 'center' },  //0       
                { display: '缺陷及处置详情', name: 'PROCESS_DETAILS', width: 80, sortable: false, align: 'center' },//1
                { display: '检测类型', name: 'CATEGORY_CODE', width: 60, sortable: false, align: 'center' },//2
                { display: '检测监测日期', name: 'RAISED_TIME_D', width: 100, sortable: false, align: 'center' },//3
				{ display: '线路', name: 'LINE_NAME', width: 100, sortable: false, align: 'center' },//4
				{ display: '站、区间', name: 'POSITION_NAME', width: 160, sortable: false, align: 'center' },//5
				{ display: '行别', name: 'DIRECTION', width: 60, sortable: false, align: 'center' },//6
				{ display: '公里标（Km）', name: 'KM_MARK', width: 80, sortable: false, align: 'center' },//7
				{ display: '支柱号', name: 'POLE_NUMBER', width: 80, sortable: false, align: 'center' },//8
				{ display: '分析日期', name: 'REPORT_DATE_D', width: 100, sortable: false, align: 'center' },//9
				{ display: '分析人员', name: 'REPORT_PERSON', width: 100, sortable: false, align: 'center' },//10
				{ display: '分析部门', name: 'REPORT_DEPTNAME', width: 100, sortable: false, align: 'center' },//11
				{ display: '缺陷部位', name: 'DEV_NAME', width: 100, sortable: false, align: 'center' },//12
				{ display: '缺陷等级', name: 'SEVERITY_NAME', width: 60, sortable: false, align: 'center' },//13
				{ display: '缺陷描述', name: 'DETAIL', width: 180, sortable: false, align: 'center', nowrap: 'true' },//14
				{ display: '缺陷类型', name: 'CODE_NAME', width: 100, sortable: false, align: 'center' },//15
				{ display: '负责单位', name: 'PROCESS_DEPTNAME', width: 100, sortable: false, align: 'center' },//16
                { display: '复测结果', name: 'CHECK_RESULT', width: 80, pk: true, sortable: false, align: 'center' },//17
				{ display: '整改日期', name: 'PROCESS_DATE_D', width: 100, sortable: false, align: 'center' },//18
				{ display: '处理人', name: 'PROCESS_PERSON', width: 100, sortable: false, align: 'center' },//19
				{ display: '处理状态', name: 'PROCESS_STATUS', width: 80, sortable: false, align: 'center' },//20				
                { display: 'ID', name: 'ID', width: 80, hide: true, pk: true, sortable: false, align: 'center' },//21
	            { display: '分析过期', name: 'REPORT_OVERDUE', width: 80, pk: true, hide: true, sortable: false, align: 'center' },//22
	            { display: '处理过期', name: 'PROCESS_OVERDUE', width: 80, pk: true, hide: true, sortable: false, align: 'center' },//23
    ]
    option = {
        colModel: json,
        url: 'RemoteHandlers/GetExcelAlarmList.ashx?type=all&START_DATE=' + $('#txt_StartDate').val() + '&END_DATE=' + $('#txt_EndDate').val(),
        dataType: 'json',
        method: 'get',
        usepager: true,
        title: '问题库管理',
        pagestat: '显示第 {from} 条到 {to} 条,共 {total} 条数据', // 显示当前页和总页面的样式
        procmsg: '正在处理,请稍候 ...', // 正在处理的提示信息
        nomsg: '没有数据存在!', // 无结果的提示信息
        pagetext: '当前第',
        outof: '页，总页数',
        findtext: '条件查询：',
        useRp: true, //是否可以动态设置每页显示的结果数
        checkbox: false, // 是否要多选框
        rowId: 'ID', // 多选框绑定行的id
        rp: _PageNum,
        width: 'auto',
        height: _h,
        rpOptions: [20, 50, 100, _PageNum], //可选择的每页显示的结果数
        resizable: false, //是否可伸缩 
        striped: true, //是否显示斑纹效果，默认是奇偶交互的形式
        onSuccess: function (re) {
            try {
                PageAlarmJson = re;
            } catch (e) { };
            //初始化删除、修改和查看按钮
            var flexTable_tr = $('#flexTable tr');
            var btn_delete = "<span class= 'btn-delete j-delete' ></span>";
            var btn_edit = "<span class='btn-edit j-edit'></span>";
            var btn_check = "<a class='btn_check j-check 'style='cursor: pointer' onclick='LoadShowListBox(this)' >查看</a>";

            for (var i = 0; i < flexTable_tr.length; i++) {
                $(flexTable_tr[i]).find(' td:eq(14) div').css({ 'white-space': 'nowrap', 'overflow': 'hidden', 'text-overflow': 'ellipsis' });//给缺陷描述栏设置样式
                var org_name = getCurUser().orgName;
                //if (org_name.indexOf('局') > -1 || org_name.indexOf('检测所') > -1 || org_name.indexOf('总公司') > -1) {
                //    $(flexTable_tr[i]).find(' td:eq(0) div').html(btn_edit + '&nbsp &nbsp &nbsp &nbsp' + btn_delete);//加载修改和删除按钮
                //};
                if (org_name.indexOf('工区') > -1 || org_name.indexOf('车间') > -1) {
                    if ($(flexTable_tr[i]).find(' td:eq(20) div').html() == '已销号') {
                        $(flexTable_tr[i]).find(' td:eq(0) div').html("");
                    } else {
                        $(flexTable_tr[i]).find(' td:eq(0) div').html(btn_edit);//加载修改按钮
                    }
                } else {
                    $(flexTable_tr[i]).find(' td:eq(0) div').html(btn_edit + '&nbsp &nbsp &nbsp &nbsp' + btn_delete);//加载修改和删除按钮
                };
                if (org_name.indexOf('段') > -1) {
                    if ($(flexTable_tr[i]).find(' td:eq(2) div').html() !== '1C') {//段级用户不能删除1C数据
                        $(flexTable_tr[i]).find(' td:eq(0) div').html(btn_edit + '&nbsp &nbsp &nbsp &nbsp' + btn_delete);//加载修改按钮
                    } else {
                        $(flexTable_tr[i]).find(' td:eq(0) div').html(btn_edit);
                    };
                };
                $(flexTable_tr[i]).find(' td:eq(1) div').html(btn_check);//加载查看按钮
                $(flexTable_tr[i]).find('.j-check').attr('rowid', $(flexTable_tr[i]).find(' td:eq(21) div').html());//给rowid赋值
                var _title = $(flexTable_tr[i]).find(' td:eq(14) div').html();
                $(flexTable_tr[i]).find(' td:eq(14) div').attr('title', _title);
            }
            //给分析/处理过期添加不用的颜色样式
            for (var i = 0; i < flexTable_tr.length; i++) {
                var select1 = $(flexTable_tr[i]).find('td:eq(23) div').html();
                if (select1 == "处理过期") {
                    $(flexTable_tr[i]).css('color', '#fc3434');
                };
                var process_status = $(flexTable_tr[i]).find('td:eq(20) div').html();
                if (process_status == '已销号') {
                    $(flexTable_tr[i]).css('color', 'green');
                }
                //if (select1 == "处理过期") { 6C问题库，“已消号、处理过期”缺陷就显示绿色【优先级高于处理过期】
                //    $(flexTable_tr[i]).css('color', '#fc3434');
                //};
            };
            //给修改图标和删除图标添加鼠标事件
            $('.j-edit').mouseover(function () {
                $(this).css('background', 'url(img/edit.png) no-repeat');
            }).mouseout(function () {
                $(this).css('background', 'url(img/edit_mouseout.png) no-repeat')
            });
            $('.j-delete').mouseover(function () {
                $(this).css('background', 'url(img/delete.png) no-repeat');
            }).mouseout(function () {
                $(this).css('background', 'url(img/delete_mouseout.png) no-repeat')
            });
            //给修改图标和删除图标绑定点击事件，点击后执行相应的修改和删除功能
            $('.j-delete').click(function () {
                var id = $(this).parent().parent().parent().attr('id');
                deleteProblem(id)//删除
            });
            $('.j-edit').click(function () {
                var id = $(this).parent().parent().parent().attr('id')
                updateProblemModal(id);//弹出修改蒙层
            });
        }
    };
    $("#flexTable").flexigrid(option);//加载列表
};


//查询方法
function doQuery(_pageIndex) {
    var CATEGORY_CODE = '';//检测类型
    if ($('#txt_CategoryCode').val() != null && $('#txt_CategoryCode').val() != undefined) {
        CATEGORY_CODE = $('#txt_CategoryCode').val();
    };
    var POWER_SECTION_CODE = '';//供电段code
    if ($('#txt_GDD option:selected')[0].value != null && $('#txt_GDD option:selected')[0].value != undefined) {
        POWER_SECTION_CODE = $('#txt_GDD option:selected')[0].value;
    };
    var POWER_SECTION_NAME = '';//供电段name
    if ($('#ddlGDD').val() != null && $('#ddlGDD').val() != undefined) {
        POWER_SECTION_NAME = $('#ddlGDD').val();
    }
    var LINE_CODE = '';//线路code
    if ($('#ddlTxtLine').attr('code') != null && $('#ddlTxtLine').attr('code') != undefined) {
        LINE_CODE = $('#ddlTxtLine').attr('code');
    };
    var LINE_NAME = '';//线路name
    if ($('#ddlTxtLine').val() != null && $('#ddlTxtLine').val() != undefined) {
        LINE_NAME = $('#ddlTxtLine').val();
    }
    var DIRECTION = '';//行别
    if ($('#txt_direction').val() != null && $('#txt_direction').val() != undefined) {
        DIRECTION = $('#txt_direction').val();
    };
    var PROCESS_STATUS = '';//处理状态
    if ($('#txt_ProcessStatus option:selected')[0].value != null && $('#txt_ProcessStatus option:selected')[0].value != undefined) {
        PROCESS_STATUS = $('#txt_ProcessStatus option:selected')[0].value;
    };
    var START_KM = '';//起始公里标
    if ($('#txt_StartKm').val() != null && $('#txt_StartKm').val() != undefined) {
        START_KM = getKmmark_w($('#txt_StartKm').val());
    };
    var END_KM = '';//结束公里标
    if ($('#txt_EndKm').val() != null && $('#txt_EndKm').val() != undefined) {
        END_KM = getKmmark_w($('#txt_EndKm').val());
    };
    var START_DATE = '';//起始时间
    if ($('#txt_StartDate').attr('value') != null && $('#txt_StartDate').attr('value') != undefined) {
        START_DATE = $('#txt_StartDate').attr('value');
    };
    var END_DATE = '';//结束时间
    if ($('#txt_EndDate').attr('value') != null && $('#txt_EndDate').attr('value') != undefined) {
        END_DATE = $('#txt_EndDate').attr('value');
    };
    var REPORT_PROCESS = '';//分析/处理过期
    if ($('#txt_ReportOrProcess option:selected')[0].value != null && $('#txt_ReportOrProcess option:selected')[0].value != undefined) {
        REPORT_PROCESS = $('#txt_ReportOrProcess option:selected')[0].value;
    };
    var SEVERITY = '';//缺陷等级
    if ($('#txtSeverity').attr('code') != null && $('#txtSeverity').attr('code') != undefined) {
        SEVERITY = $('#txtSeverity').attr('code');
    };
    option.url = 'RemoteHandlers/GetExcelAlarmList.ashx?type=all&CATEGORY_CODE=' + CATEGORY_CODE
+ '&POWER_SECTION_NAME=' + escape(POWER_SECTION_NAME)
+ '&POWER_SECTION_CODE=' + POWER_SECTION_CODE
+ '&LINE_CODE=' + LINE_CODE
+ '&DIRECTION=' + escape(DIRECTION)
+ '&PROCESS_STATUS=' + escape(PROCESS_STATUS)
+ '&START_KM=' + START_KM
+ '&END_KM=' + END_KM
+ '&START_DATE=' + START_DATE
+ '&END_DATE=' + END_DATE
+ '&REPORT_PROCESS=' + escape(REPORT_PROCESS)
+ '&SEVERITY=' + SEVERITY
+ '&temp=' + Math.random();

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
    $("#flexTable").flexigrid(option);
    $("#flexTable").flexOptions(option).flexReload();
}

//弹出添加蒙层
function addProblemModal() {
    //初始化弹框
    $("#modal-container-22256").modal({ backdrop: 'static', keyboard: false }).css({
        width: (_w > 920 ? 920 : _w),
        height: (_h - 100),
        'margin-left': function () {
            return -($(this).width() / 2);
        },
        'margin-top': function () {
            return -($(this).height() / 2);
        }
    });
    //初始化上传控件
    $('#processdetails-resourceFile').html('');
    $('#processdetails-resource').html('');
    UploadMethod('images', 'resource');//加载上传控件
    $('#Category_Code').val("");
    $('#LineName').val("");
    $('#PositionName').val("");
    $('#direction').val("");
    $('#KmMark_km').val("");
    $('#KmMark_m').val("");
    $('#PoleNumber').val("");
    $('#ReportDate').val("");
    $('#ReportPerson').val("");
    $('#ReportDeptName').val("");
    $('#DevName').val("");
    $('#Severity').val("");
    $('#Detail').val("");
    $('#CodeName').val("");
    $('#ProcessDeptCode').val("");
    $('#ProcessDate').val("");
    $('#ProcessPerson').val("");
    $('#ProcessStatus').val("");
    $('#ProcessDetails').val("");
    $('#feedback_situation').val("");
    $('#analysis_causes').val("");
    $('#deal_situation').val("");
    $('#check_result').val("");
    $("#text").val("add");
}
//添加修改蒙层
function updateProblemModal(id) {
    $('#processdetails-resource').html('');
    //初始化弹窗
    $("#modal-container-22256").modal({ backdrop: 'static', keyboard: false }).css({
        width: (_w > 920 ? 920 : _w),
        height: (_h - 100),
        'margin-left': function () {
            return -($(this).width() / 2);
        },
        'margin-top': function () {
            return -($(this).height() / 2);
        }
    });
    //获得ID=id的JSON
    var AlarmJson = PageAlarmJson.rows;
    var m = '';
    for (var i = 0; i < AlarmJson.length; i++) {
        if (AlarmJson[i].ID == id) {
            m = AlarmJson[i];
        };
    };
    $('#Category_Code').val(m.CATEGORY_CODE);
    //缺陷部位
    $('#ULDevName').parent().remove();
    $('#DevName').mySelectTree({
        tag: 'SYSDIC_AFTOPO',
        codeType: m.CATEGORY_CODE,
        cateGory: '',
        p_code: 'AFTOPO',
        isDefClick: false,
        onClick: function (event, treeId, treeNode) {
            $('#DevName').val(treeNode.name).attr('code', treeNode.id);
            $('.DevNameformError').hide();
        },
        height: 200
    });
    $('#RaisedTime').val(m.RAISED_TIME);
    $('#LineName').val(m.LINE_NAME);
    $('#LINE_NAME').val(m.LINE_NAME);
    $('#LINE_CODE').val(m.LINE_CODE);
    LineChange(m.LINE_CODE);
    $('#PositionName').val(m.POSITION_NAME);
    $('#POSITION_NAME').val(m.POSITION_NAME);
    $('#PositionCode').val(m.POSITION_CODE);
    $('#direction').val(m.DIRECTION);
    $('#KmMark_km').val(m.KM_MARK);
    $('#PoleNumber').val(m.POLE_NUMBER);
    $('#ReportDate').val(m.REPORT_DATE);
    $('#ReportPerson').val(m.REPORT_PERSON);
    $('#ReportDeptName').val(m.REPORT_DEPTNAME);
    $('#DevName').val(m.DEV_NAME);
    $('#Severity').val(m.SEVERITY_NAME);
    $('#Detail').val(m.DETAIL);
    $('#CodeName').val(m.CODE_NAME);
    var deptName = m.PROCESS_DEPTNAME;
    $('#ProcessDeptName').val(deptName);
    var deptCode = m.PROCESS_DEPTCODE;
    LoadDropdSelected1('ProcessDeptCode', deptCode);
    $('#ProcessDate').val(m.PROCESS_DATE);
    $('#ProcessPerson').val(m.PROCESS_PERSON);
    $('#ProcessStatus').val(m.PROCESS_STATUS);
    $('#feedback_situation').val(m.feedback_situation);
    $('#analysis_causes').val(m.analysis_causes);
    $('#deal_situation').val(m.deal_situation);
    $('#check_result').val(m.CHECK_RESULT);
    $('#pid').val(m.ID);
    $("#text").val("update");
    var _pic = m.fj_pic;//缺陷图片路径
    var _pic_name = m.fj_pic_name;
    var rectify_pic = m.rectify_pic;//整改后图片路径
    var rectify_pic_name = m.rectify_pic_name;
    var _file = m.fj_file;//1C检修单路径
    var _file_name = m.fj_file_name;//1C检修单文件名
    var resourceId = $('#resource').attr('id');
    var resourceFileId = $('#resourceFile').attr('id');
    $('#ULCodeName').parent().remove();
    $('#CodeName').mySelectTree_Level2({
        codeType: m.CATEGORY_CODE,
        cateGory: "AFCODE",
        DPCSelectChildren: true,
        height: '300px',
        onClick: function () {
            $('.CodeNameformError').hide();
        }
    });
    if ($('#PoleNumber').attr('class') != '') {
        $('#PoleNumber').addClass("validate[required]");
        $('#PoleNumber').next().show();
        $('#defaultForm').validationEngine({
            validationEventTriggers: "",  //触发的事件  "keyup blur",   
            inlineValidation: true, //是否即时验证，false为提交表单时验证,默认true   
            success: false, //为true时即使有不符合的也提交表单,false表示只有全部通过验证了才能提交表单,默认false
            promptPosition: "topLeft", //提示位置，topLeft, topRight, bottomLeft,  centerRight, bottomRight
            autoHidePrompt: true,
            showOneMessage: true,
            autoHideDelay: 1000,
            fadeDuration: 0.3,
            showPrompts: false
        });
    }
    switch (m.CATEGORY_CODE) {
        case '3C':
            $('#Td_3C').show();
            $('#Td_default').hide();
            $('#processdetails-resource').html('').css({ 'max-height': '136px', 'overflow-x': 'hidden' });
            UploadMethod('files_doc', 'resource');//加载上传控件
            $('#resource').val(_pic);
            getFile('files', _pic, _pic_name, resourceId);
            $('#filePicker-resource').css('background', 'url(/Common/DPCExcelAlarm/img/upload_file.png) no-repeat');
            break;
        default:
            $('#Td_3C').hide();
            $('#Td_default').show();
            $('#processdetails-resource').html('');
            UploadMethod('images', 'resource');//加载上传控件
            $('#resource').val(_pic);
            getFile('images', _pic, _pic_name, resourceId);
    };
    switch (m.CATEGORY_CODE) {
        case "1C":
            //当检测类型为1C时移出class属性
            $('#PoleNumber').removeAttr("class");
            $('#PoleNumber').next().hide();
            $('#5C,#6C,#2345C').hide();
            $('#1234C,#16C').show();
            $('#C234').hide();
            $('#C1').show();
            $('#Td_3C_Fan').hide();
            $('#processdetails-resourceFile').html('');
            UploadMethod('files', 'resourceFile');//加载上传控件
            $('#filePicker-resourceFile').css('background', 'url(/Common/DPCExcelAlarm/img/upload_file.png) no-repeat');
            $('#resourceFile').val(_file);
            getFile('files', _file, _file_name, resourceFileId);
            break;
        case "2C":
            $('#5C,#6C,#16C').hide();
            $('#1234C,#2345C').show();
            $('#C234').show();
            $('#C1').hide();
            $('#Td_3C_Fan').hide();
            $('#processdetails-resourceFile').html('');
            UploadMethod('images', 'resourceFile');//加载上传控件
            $('#filePicker-resourceFile').css('background', 'url(/Common/DPCExcelAlarm/img/rectify_pic.png) no-repeat');
            $('#resourceFile').val(_file);
            getFile('images', rectify_pic, rectify_pic_name, resourceFileId);
            break;
        case "3C":
            $('#5C,#6C,#16C').hide();
            $('#1234C,#2345C').show();
            $('#C234').hide();
            $('#C1').hide();
            $('#Td_3C_Fan').show();
            $('#processdetails-resourceFile').html('');
            UploadMethod('files_doc', 'resourceFile');//加载上传控件
            $('#filePicker-resourceFile').css('background', 'url(/Common/DPCExcelAlarm/img/upload_file.png) no-repeat');
            $('#resourceFile').val(_file);
            getFile('files', _file, _file_name, resourceFileId);
            break;
        case "4C":
            $('#5C,#6C,#16C').hide();
            $('#1234C,#2345C').show();
            $('#C234').show();
            $('#C1').hide();
            $('#Td_3C_Fan').hide();
            $('#processdetails-resourceFile').html('');
            UploadMethod('images', 'resourceFile');//加载上传控件
            $('#filePicker-resourceFile').css('background', 'url(/Common/DPCExcelAlarm/img/rectify_pic.png) no-repeat');
            $('#rectify_pic').val(rectify_pic);
            getFile('images', rectify_pic, rectify_pic_name, resourceFileId);
            break;
        case "5C":
            //添加问题
            $('#1234C,#6C').hide();
            $('#5C').show();
            $('#16C').hide();
            $('#2345C').show();
            $('#C234').hide();
            $('#C1').hide();
            $('#Td_3C_Fan').hide();
            $('#processdetails-resourceFile').html('');
            $('#processdetails-resource').html('').css({ 'max-height': '136px', 'overflow-x': 'hidden' });
            $('#processdetails-resource').myUploadFile({
                uploadCategories: 'images',
                server: '/Common/MAlarmMonitoring/RemoteHandlers/UploadFiles.ashx',
                action: 'UpLoad',
                fileListId: '#fileList-resource',
                filePickerId: '#filePicker-resource',
                uploadBtnId: '#ctlBtn-resource'
            });
            $('#resource').val(_pic);
            getFile('images', _pic, _pic_name, resourceId);
            break;
        case "6C":
            $('#1234C,#5C').hide();
            $('#6C').show();
            $('#2345C').hide();
            $('#16C').show();
            $('#C234').hide();
            $('#C1').hide();
            $('#Td_3C_Fan').hide();
            //添加问题
            $('#processdetails-resourceFile').html('');
            $('#processdetails-resource').html('').css({ 'max-height': '136px', 'overflow-x': 'hidden' });
            $('#processdetails-resource').myUploadFile({
                uploadCategories: 'images',
                server: '/Common/MAlarmMonitoring/RemoteHandlers/UploadFiles.ashx',
                action: 'UpLoad',
                fileListId: '#fileList-resource',
                filePickerId: '#filePicker-resource',
                uploadBtnId: '#ctlBtn-resource'
            });
            $('#resource').val(_pic);
            getFile('images', _pic, _pic_name, resourceId);
            break;
    };
    //段、车间、工区级用户只能修改复测信息，其他信息的input、select被禁用
    var org_name = getCurUser().orgName;
    if (org_name.indexOf('车间') > -1 || org_name.indexOf('工区') > -1) {
        if ($("#text").val() == "update") {
            $('#Category_Code').attr('disabled', 'disabled');
            $('#RaisedTime').attr('disabled', 'disabled');
            $('#LineName').attr('disabled', 'disabled');
            $('#PositionName').attr('disabled', 'disabled');
            $('#direction').attr('disabled', 'disabled');
            $('#KmMark_km').attr('disabled', 'disabled');
            $('#PoleNumber').attr('disabled', 'disabled');
            $('#DevName').attr('disabled', 'disabled');
            $('#Severity').attr('disabled', 'disabled');
            $('#CodeName').attr('disabled', 'disabled');
            $('#Detail').attr('disabled', 'disabled');
            $('#ReportDate').attr('disabled', 'disabled');
            $('#ReportPerson').attr('disabled', 'disabled');
            $('#ReportDeptName').attr('disabled', 'disabled');
            $('#ProcessDeptCode').attr('disabled', 'disabled');
            $('#DevName').attr('disabled', 'disabled');
            $('#processdetails-resource').html('');
            $('.U-resource').remove();
            UploadMethod('', 'resource');//加载上传控件
            getFile('images', _pic, _pic_name);
        };
    };
};




/*/*
* @desc 获取已上传的图片或文件
* @param 
*/
function getFile(fileType, data, name, ID) {
    var resourcePic = $('#fileList-' + ID + '-pic', document);
    if ('images' === fileType && '' !== data) {
        resourcePic.html('');
        var liImage = $('<div id="' + ID + '-image-0" class="cp_img">' +
                            '<img src="' + data + '">' +
                            '<div class="cp_img_jian_defined"></div>' +
                        '</div>');
        resourcePic.append(liImage);
        $('#processdetails-' + ID + '').find('.count-info').html('（共1个文件）');
        $('#processdetails-' + ID + '').find('.file-count').val('1');
        var $input = $('<input class="U-' + ID + '" value="' + data + '" type="hidden" />');
        $('#processdetails-' + ID + '').after($input);
        //段、车间、工区级用户不能删除图片
        var org_name = getCurUser().orgName;
        if (org_name.indexOf('车间') > -1 || org_name.indexOf('工区') > -1) {
            $(this).children('.cp_img_jian_defined').css('display', 'none');
        } else {
            $(resourcePic).find('.cp_img').mouseenter(function () { //显示图片的删除按钮
                $(this).children('.cp_img_jian_defined').css('display', 'block');
            }).mouseleave(function () { //隐藏图片的删除按钮
                $(this).children('.cp_img_jian_defined').css('display', 'none');
            });
        }
        //执行图片的删除方法
        $(resourcePic).find('.cp_img_jian_defined').click(function () {
            resourcePic.html('');
            $('#processdetails-' + ID + '').find('.count-info').html('（共0个文件）');
            $('#processdetails-' + ID + '').find('.file-count').val('0');
            $('#processdetails-' + ID + '').find('.default-file-count').val('0');
            $('.U-' + ID).remove();
            deleteFile(data);//在虚拟目录中删除
        });
    }
    var resourceFile = $('#fileList-' + ID + '-file', document);
    if ('files' === fileType && '' !== data) {
        resourceFile.html('');
        var liFile = $('<div id="' + ID + '-file-0" class="file-item">' +
                            '<a class="file-info" href="javascript:void(0)" title="' + name + '">' + name + '</a>' +
                            '<div class="file-sta">' +
                            '<span class="file-state">等待上传...</span>' +
                            '<span class="file-jian-defined"></span>' +
                            '</div>' +
                        '</div>');
        resourceFile.append(liFile);
        $('#processdetails-' + ID + '').find('.count-info').html('（共1个文件）');
        $('#processdetails-' + ID + '').find('.file-count').val('1');
        var $input = $('<input class="U-' + ID + '" value="' + data + '" type="hidden" />');
        $('#processdetails-' + ID + '').after($input);
        var org_name = getCurUser().orgName;
        if (org_name.indexOf('工区') > -1 || org_name.indexOf('车间') > -1) {
            $(this).find('.file-jian-defined').css('display', 'none');
        } else {
            $(resourceFile).find('.file-item').mouseenter(function () { //显示文件的删除按钮
                $(this).find('.file-jian-defined').css('display', 'inline-block');
            }).mouseleave(function () { //隐藏文件的删除按钮
                $(this).find('.file-jian-defined').css('display', 'none');
            });
        }
        //执行文件的删除方法

        $(resourceFile).find('.file-jian-defined').click(function () {
            resourceFile.html('');
            $('#processdetails-' + ID + '').find('.count-info').html('（共0个文件）');
            $('#processdetails-' + ID + '').find('.file-count').val('0');
            $('#processdetails-' + ID + '').find('.default-file-count').val('0');
            $('.U-' + ID).remove();
            deleteFile(data);//在虚拟目录中删除
        });
    }
    if ('' === data) {
        $('#processdetails-' + ID + '').find('.default-file-count').val('0');
    } else {
        $('#processdetails-' + ID + '').find('.default-file-count').val('1');
    }
};
// 判断是添加还是修改
function addOrUpdate() {
    //在请求后台之前去掉disabled属性，使能成功表单提交
    $('#Category_Code').removeAttr('disabled');
    $('#RaisedTime').removeAttr('disabled');
    $('#LineName').removeAttr('disabled');
    $('#PositionName').removeAttr('disabled');
    $('#direction').removeAttr('disabled');
    $('#KmMark_km').removeAttr('disabled');
    $('#PoleNumber').removeAttr('disabled');
    $('#DevName').removeAttr('disabled');
    $('#Severity').removeAttr('disabled');
    $('#CodeName').removeAttr('disabled');
    $('#Detail').removeAttr('disabled');
    $('#ReportDate').removeAttr('disabled');
    $('#ReportPerson').removeAttr('disabled');
    $('#ReportDeptName').removeAttr('disabled');
    $('#ProcessDeptCode').removeAttr('disabled');
    $('#DevName').removeAttr('disabled');
    var type = $("#text").val();
    var catgory_code = $('#Category_Code').val();
    var uploadCount = 0; //上传的图片的数量
    var uploadCount1 = 0; //上传的图片的数量
    var fileCount = 0; //上传控件中上传成功的数量
    var fileCount1 = 0; //上传控件中上传成功的数量
    switch (type) {
        case 'add': //添加
            //添加缺陷图片
            $('#ctlBtn-resource').trigger('click');
            uploadCount = $('#processdetails-resource').parent().find('.U-resource:first', document).length;
            fileCount = $('#processdetails-resource .file-count').val();
            if (catgory_code !== '5C' && catgory_code !== '6C') {
                //添加附件
                $('#ctlBtn-resourceFile').trigger('click');
                uploadCount1 = $('#processdetails-resourceFile').parent().find('.U-resourceFile:first', document).length;
                fileCount1 = $('#processdetails-resourceFile .file-count').val();
            }
            break;
        case 'update': //修改
            //添加缺陷图片
            $('#ctlBtn-resource').trigger('click');
            uploadCount = $('#processdetails-resource').parent().find('.U-resource', document).length;
            fileCount = $('#processdetails-resource .default-file-count').val();
            //添加附件
            if (catgory_code !== '5C' && catgory_code !== '6C') {
                $('#ctlBtn-resourceFile').trigger('click');
                uploadCount1 = $('#processdetails-resourceFile').parent().find('.U-resourceFile', document).length;
                fileCount1 = $('#processdetails-resourceFile .default-file-count').val();
                break;
            }
    }


    switch (type) {
        case 'add':
            if (uploadCount === Number(fileCount) && uploadCount1 === Number(fileCount1)) {
                var upload = $('#processdetails-resource').parent().find('.U-resource:first', document);
                var val = '';
                for (var i = 0; i < upload.length; i++) {
                    val += $(upload[i]).val();
                }
                $('#resource').val(val);
                if (catgory_code !== '5C' && catgory_code !== '6C') {
                    switch (catgory_code) {
                        //1C：两个控件，图片和文档；
                        //2C：两个控件，图片和图片；
                        //3C：两个控件，图片和图片；
                        //4C：两个控件，图片和图片；
                        //5C：一个控件，图片；
                        //6C：一个控件，图片；
                        case '1C':
                        case '3C':
                            var upload1 = $('#processdetails-resourceFile').parent().find('.U-resourceFile:first', document);
                            var val1 = '';
                            for (var i = 0; i < upload1.length; i++) {
                                val1 += $(upload1[i]).val();
                            }
                            $('#resourceFile').val(val1);
                            break;
                        default:
                            var upload2 = $('#processdetails-resourceFile').parent().find('.U-resourceFile', document);
                            var val2 = '';
                            for (var i = 0; i < upload2.length; i++) {
                                val2 += $(upload2[i]).val();
                            }
                            $('#rectify_pic').val(val2);
                            break;
                    }
                }

                Save_AddOrUpdate();//添加和修改保存事件
            } else {
                switch (type) {
                    case 'add':
                        setTimeout('addOrUpdate()', 750);
                        break;
                    case 'update':
                        setTimeout('addOrUpdate()', 750);
                        break;
                };
            }
            break;
        case 'update':
            var addPicNum = $('#add-resource').val();
            var addFilePicNum = $('#add-resourceFile').val();
            addPicNum = Number(addPicNum);
            addFilePicNum = Number(addFilePicNum);
            fileCount = Number(fileCount) + addPicNum;
            fileCount1 = Number(fileCount1) + addFilePicNum;
            //1C：两个控件，图片和文档；
            //2C：两个控件，图片和图片；
            //3C：两个控件，word文档和word文档；
            //4C：两个控件，图片和图片；
            //5C：一个控件，图片；
            //6C：一个控件，图片；

            if (uploadCount === Number(fileCount) && uploadCount1 === Number(fileCount1)) {
                var upload = $('#processdetails-resource').parent().find('.U-resource:first', document);
                var val = '';
                for (var i = 0; i < upload.length; i++) {
                    val += $(upload[i]).val();
                }
                $('#resource').val(val);
                if (catgory_code !== '5C' && catgory_code !== '6C') {
                    switch (catgory_code) {
                        case '1C':
                        case '3C':
                            var upload1 = $('#processdetails-resourceFile').parent().find('.U-resourceFile:first', document);
                            var val1 = '';
                            for (var i = 0; i < upload1.length; i++) {
                                val1 += $(upload1[i]).val();
                            }
                            $('#resourceFile').val(val1);
                            break;
                        default:
                            var upload2 = $('#processdetails-resourceFile').parent().find('.U-resourceFile:first', document);
                            var val2 = '';
                            for (var i = 0; i < upload2.length; i++) {
                                val2 += $(upload2[i]).val();
                            }
                            $('#rectify_pic').val(val2);
                            break;
                    }
                }
                Save_AddOrUpdate(); //添加和修改保存事件
            } else {
                switch (type) {
                    case 'add':
                        setTimeout('addOrUpdate()', 750);
                        break;
                    case 'update':
                        setTimeout('addOrUpdate()', 750);
                        break;
                }
            }
            break;
    }
}
//添加和修改保存事件
function Save_AddOrUpdate() {
    var m = getKmmark_w($('#KmMark_km').val()); //转换成米级
    $('#KmMark_km').val(m);
    var type = $('#text').val();
    var tip_S = '';
    var tip_F = '';
    var tip_Y = '该条报警已存在';
    switch (type) {
        case 'add':
            tip_S = '添加成功';
            tip_F = '添加失败';
            break;
        case 'update':
            tip_S = '修改成功';
            tip_F = '修改失败';
            break;
    };
    var options = {
        url: "/Common/DPCExcelAlarm/RemoteHandlers/GetExcelAlarmList.ashx?type=" + type + "&id=" + $('#pid').val(),
        type: 'POST',
        success: function (rs) {
            if (rs == "1") {
                ymPrompt.succeedInfo(tip_S, null, null, '提示信息', function () {
                    $("#flexTable").flexReload();
                    $('.U-resource').remove();
                    $('.U-resourceFile').remove();
                    $('#processdetails-resource').html('');
                    $('#processdetails-resourceFile').html('');
                    $('#add-resource').val('');
                    $('#add-resourceFile').val('');
                });
            } else if (rs == "0") {
                ymPrompt.errorInfo(tip_Y, null, null, '提示信息', null);
                return true;
            } else {
                ymPrompt.errorInfo(tip_F, null, null, '提示信息', null);
                return true;
            }
            document.getElementById('close').click();

        }
    };
    $('#defaultForm').ajaxSubmit(options);

}

//删除
function deleteProblem(id) {
    ymPrompt.confirmInfo({
        message: '确认要删除这条记录吗?',
        handler: function (tp) {
            if (tp == 'ok') {

                var url = "RemoteHandlers/GetExcelAlarmList.ashx?type=delete&ID=" + id;
                $.ajax({
                    type: "post",
                    url: url,
                    async: false,
                    cache: false,
                    success: function (result) {
                        if (result == "1") {
                            ymPrompt.succeedInfo('删除成功', null, null, '提示信息', function () {
                                $("#flexTable").flexReload();
                            });
                        } else {
                            ymPrompt.errorInfo('删除失败', null, null, '提示信息', null);
                        }
                    }
                });
            }
        }
    });


}
//加载下拉列表
function loadSelect() {
    //加载检测类型下拉框（查询条件）
    $("#txt_CategoryCode").mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: '3C',
        p_code: "DET_TYPE",
        cateGory: 'DET_TYPE',
        enableFilter: false,
        onClick: function (event, treeId, treeNode) {
            $("#txt_CategoryCode").attr('code', treeNode.id).val(treeNode.name);
        }
    });
    //加载检测类型下拉框（添加页）
    $("#Category_Code").mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: '3C',
        p_code: "DET_TYPE",
        cateGory: 'DET_TYPE',
        enableFilter: false,
        onClick: function (event, treeId, treeNode) {
            if ($('#PoleNumber').attr('class') != '') {
                $('#PoleNumber').addClass("validate[required]");
                $('#PoleNumber').next().show();
            }
            $('#defaultForm').validationEngine({
                validationEventTriggers: "",  //触发的事件  "keyup blur",   
                inlineValidation: true, //是否即时验证，false为提交表单时验证,默认true   
                success: false, //为true时即使有不符合的也提交表单,false表示只有全部通过验证了才能提交表单,默认false
                promptPosition: "topLeft", //提示位置，topLeft, topRight, bottomLeft,  centerRight, bottomRight
                autoHidePrompt: true,
                showOneMessage: true,
                autoHideDelay: 1000,
                fadeDuration: 0.3,
                showPrompts: false
            });
            $("#Category_Code").attr('code', treeNode.id).val(treeNode.name);
            $('.Category_CodeformError').hide();
            $('#ULCodeName').parent().remove();
            var category = treeNode.id;
            //缺陷类型
            $('#CodeName').mySelectTree_Level2({
                codeType: category,
                cateGory: "AFCODE",
                DPCSelectChildren: true,
                height: '300px',
                onClick: function () {
                    $('.CodeNameformError').hide();
                }
            });
            //缺陷部位
            $('#ULDevName').parent().remove();
            $('#DevName').val('');
            $('#DevName').mySelectTree({
                tag: 'SYSDIC_AFTOPO',
                codeType: category,
                cateGory: '',
                p_code: 'AFTOPO',
                isDefClick: false,
                onClick: function (event, treeId, treeNode) {
                    $('#DevName').val(treeNode.name).attr('code', treeNode.id);
                    $('.DevNameformError').hide();
                },
                height: 200
                //noreadonly: true
            });
            switch (category) {
                case '3C':
                    $('#Td_3C').show();
                    $('#Td_default').hide();
                    $('#processdetails-resource').html('');
                    UploadMethod('files_doc', 'resource');//加载上传控件
                    $('#filePicker-resource').css('background', 'url(/Common/DPCExcelAlarm/img/upload_file.png) no-repeat');
                    break;
                default:
                    $('#Td_3C').hide();
                    $('#Td_default').show();
                    $('#processdetails-resource').html('');
                    UploadMethod('images', 'resource');//加载上传控件
                    break;
            }
            switch (category) {
                case "1C":
                    $('#PoleNumber').removeAttr("class");
                    $('#PoleNumber').next().hide();
                    $('#5C,#6C,#2345C').hide();
                    $('#1234C,#16C').show();
                    $('#C1').show();
                    $('#C234').hide();
                    $('#Td_3C_Fan').hide()
                    //添加问题
                    $('#processdetails-resourceFile').html('');
                    UploadMethod('files', 'resourceFile');//加载上传控件
                    $('#filePicker-resourceFile').css('background', 'url(/Common/DPCExcelAlarm/img/upload_file.png) no-repeat');
                    break;
                case "2C":
                    $('#5C,#6C,#16C').hide();
                    $('#1234C,#2345C').show();
                    $('#C234').show();
                    $('#C1').hide();
                    $('#Td_3C_Fan').hide()
                    //添加问题
                    $('#processdetails-resourceFile').html('');
                    UploadMethod('images', 'resourceFile');//加载上传控件
                    $('#filePicker-resourceFile').css('background', 'url(/Common/DPCExcelAlarm/img/rectify_pic.png) no-repeat');

                    break;
                case "3C":
                    $('#5C,#6C,#16C').hide();
                    $('#1234C,#2345C').show();
                    $('#C234').hide();
                    $('#C1').hide();
                    $('#Td_3C_Fan').show()
                    //添加问题
                    $('#processdetails-resourceFile').html('');
                    UploadMethod('files_doc', 'resourceFile');//加载上传控件
                    $('#filePicker-resourceFile').css('background', 'url(/Common/DPCExcelAlarm/img/upload_file.png) no-repeat');
                    break;
                case "4C":
                    $('#5C,#6C,#16C').hide();
                    $('#1234C,#2345C').show();
                    $('#C234').show();
                    $('#C1').hide();
                    $('#Td_3C_Fan').hide()
                    //添加问题
                    $('#processdetails-resourceFile').html('');
                    UploadMethod('images', 'resourceFile');//加载上传控件
                    $('#filePicker-resourceFile').css('background', 'url(/Common/DPCExcelAlarm/img/rectify_pic.png) no-repeat');
                    break;
                case "5C":
                    $('#1234C,#6C').hide();
                    $('#5C').show();
                    $('#16C').hide();
                    $('#2345C').show();
                    $('#C234').hide();
                    $('#C1').hide();
                    $('#Td_3C_Fan').hide()
                    $('#processdetails-resourceFile').html('');
                    //添加问题
                    $('#processdetails-resource').css({ 'max-height': '136px', 'overflow-x': 'hidden' });
                    $('#processdetails-resource').html('');
                    $('#processdetails-resource').myUploadFile({
                        uploadCategories: 'images',
                        server: '/Common/MAlarmMonitoring/RemoteHandlers/UploadFiles.ashx',
                        action: 'UpLoad',
                        fileListId: '#fileList-resource',
                        filePickerId: '#filePicker-resource',
                        uploadBtnId: '#ctlBtn-resource'
                    });
                    break;
                case "6C":
                    $('#1234C,#5C').hide();
                    $('#6C').show();
                    $('#2345C').hide();
                    $('#16C').show();
                    $('#C234').hide();
                    $('#C1').hide();
                    $('#Td_3C_Fan').hide()
                    $('#processdetails-resourceFile').html('');
                    //添加问题
                    $('#processdetails-resource').css({ 'max-height': '136px', 'overflow-x': 'hidden' });
                    $('#processdetails-resource').html('');
                    $('#processdetails-resource').myUploadFile({
                        uploadCategories: 'images',
                        server: '/Common/MAlarmMonitoring/RemoteHandlers/UploadFiles.ashx',
                        action: 'UpLoad',
                        fileListId: '#fileList-resource',
                        filePickerId: '#filePicker-resource',
                        uploadBtnId: '#ctlBtn-resource'
                    });
                    break;
            };
        },
        callback: function () {//回调函数，设置下拉框的最大宽度
            var _width = $('#Category_Code').width();
            $('#ULCategory_Code').css('max-width', _width);
            $('#ULCategory_Code').prev().css('max-width', _width);
        }
    });
    //加载行别下拉框（查询条件）
    $('#txt_direction').mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: '3C',
        cateGory: 'DRTFLG',
        p_code: 'DRTFLG',
        isDefClick: false,
        onClick: function (event, treeId, treeNode) {
            $('#txt_direction').val(treeNode.name).attr('code', treeNode.id);
        },
        callback: function () {
            var _width = $('#txt_direction').width();
            $('#ULtxt_direction').css('max-width', _width);
            $('#ULtxt_direction').prev().css('max-width', _width);
        }

    });
    //加载行别下拉框（添加页）
    $('#direction').mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: '3C',
        cateGory: 'DRTFLG',
        p_code: 'DRTFLG',
        isDefClick: false,
        onClick: function (event, treeId, treeNode) {
            $('#direction').val(treeNode.name).attr('code', treeNode.id);
            $('.directionformError ').hide();
        },
        callback: function () {
            var _width = $('#direction').width();
            $('#ULdirection').css('max-width', _width);
            $('#ULdirection').prev().css('max-width', _width);
        }

    });
    $('#ddlTxtLine').mySelectTree({
        tag: 'LINE',
        height: 250,
        enableFilter: true,
        isDefClick: false,
        action: 'Problem',
        onClick: function (event, treeId, treeNode) {
            $('#ddlTxtLine').val(treeNode.name);
            $('#ddlTxtLine').attr('code', treeNode.id)
        }
    });
    //$("#LineName").mySelect({
    //    tag: "LINE",
    //    callback: function () {
    //        $('#LineName option:first-child').val('');
    //        $('#LineName option:first-child').html('请选择')
    //    }

    //}).change(function () {
    //    //var dcode = $(this).val();
    //    var dOption = $(this).find('option:selected').html();
    //    // var dName = '';
    //    //for (var i = 0; i < dOption.length; i++) {
    //    //    if (dOption[i].value === dcode) {
    //    //        dName = dOption[i].innerHTML;
    //    //    }
    //    //}
    //    $('#LINE_NAME').val(dOption);
    //});
    $('#LineName').mySelectTree({
        tag: 'LINE',
        height: 250,
        enableFilter: true,
        isDefClick: false,
        action: 'Problem',
        onClick: function (event, treeId, treeNode) {
            $('#LineName').val(treeNode.name);
            $('#LINE_NAME').val(treeNode.name);
            $('#LINE_CODE').val(treeNode.id);
            $('.LineNameformError').hide();
            LineChange(treeNode.id)//加载区站
            var _width = $('#LineName').width();
            $('#ULLineName').css('max-width', _width);
            $('#ULLineName').prev().css('max-width', _width);
        }
    });


    $('#txt_GDD').mySelect({
        tag: "Organization",
        code: '',
        type: 'GDD',
        callback: function () {
            $('#txt_GDD option:first-child').val('');
        }
    }).change(function () {
        var dOption = $(this).find('option:selected').html();

        $('#ddlGDD').val(dOption);
    });
    //加载负责单位下拉框
    $('#ProcessDeptCode').mySelect({
        tag: "Organization",
        code: '',
        type: 'GDD',
        callback: function () {
            $('#ProcessDeptCode option:first-child').val('');
            $('#ProcessDeptCode option:first-child').html('请选择');
            $('#ProcessDeptName').val('');
        }
    }).change(function () {
        var dOption = $(this).find('option:selected').html();
        if (dOption == '请选择') {
            $('#ProcessDeptName').val('');
        } else {
            $('#ProcessDeptName').val(dOption);
        };
    });

    //加载缺陷等级下拉框（添加页）
    $('#Severity').mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: '3C',
        cateGory: 'SEVERITY',
        p_code: 'SEVERITY',
        onClick: function (event, treeid, treenode) {
            $('#Severity').val(treenode.name).attr('code', treenode.id);
            $('body').find('.SeverityformError').hide();
        },
        callback: function () {
            var _width = $('#Severity').width();
            $('#ULSeverity').css('max-width', _width);
            $('#ULSeverity').prev().css('max-width', _width);
        }
    })
    //加载缺陷等级下拉框（查询条件）
    $('#txtSeverity').mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: '3C',
        cateGory: 'SEVERITY',
        p_code: 'SEVERITY',
        onClick: function (event, treeid, treenode) {
            $('#txtSeverity').val(treenode.name).attr('code', treenode.id);
        },
        callback: function () {
            var _width = $('#txtSeverity').width();
            $('#ULtxtSeverity').css('max-width', _width);
            $('#ULtxtSeverity').prev().css('max-width', _width);
        }
    })
};
function LineChange(code) {
    if ($('body').find('#ULPositionName').length) {
        $('body').find('#ULPositionName').parent().remove();
    }
    $('#PositionName').val('');
    $('#POSITION_NAME').val('');
    $('#PositionCode').val('');
    $('#PositionName').mySelectTree({
        tag: 'LINE_ONLY_POSITION',
        codeType: code,
        isDefClick: false,
        onClick: function (event, treeId, treeNode) {
            $('#PositionName').val(treeNode.name);
            $('#POSITION_NAME').val(treeNode.name);
            $('#PositionCode').val(treeNode.id);
            $('.PositionNameformError').hide();
        },
        height: 200
        //noreadonly: true
    });


    //$("#PositionName").mySelect({
    //    tag: "STATIONSECTION",
    //    code: code,
    //    //type: "POSITION",
    //    callback: function () {
    //        $('#PositionName option:first-child').val('');
    //        $('#PositionName option:first-child').html('请选择')
    //    }
    //}).change(function () {
    //    var dOption = $(this).find('option:selected').html();
    //    $('#POSITION_NAME').val(dOption);
    //});
};

//导出
function ExportToExcel() {
    var CATEGORY_CODE = '';
    if ($('#txt_CategoryCode').val() != null && $('#txt_CategoryCode').val() != undefined) {
        CATEGORY_CODE = $('#txt_CategoryCode').val();
    };
    var POWER_SECTION_CODE = '';
    if ($('#txt_GDD option:selected')[0].value != null && $('#txt_GDD option:selected')[0].value != undefined) {
        POWER_SECTION_CODE = $('#txt_GDD option:selected')[0].value;
    };
    var LINE_CODE = '';//线路code
    if ($('#ddlTxtLine').attr('code') != null && $('#ddlTxtLine').attr('code') != undefined) {
        LINE_CODE = $('#ddlTxtLine').attr('code');
    };
    //var LINE_NAME = '';//线路name
    //if ($('#ddlTxtLine').val() != null && $('#ddlTxtLine').val() != undefined) {
    //    LINE_NAME = $('#ddlTxtLine').val();
    //}
    var DIRECTION = '';
    if ($('#txt_direction').val() != null && $('#txt_direction').val() != undefined) {
        DIRECTION = $('#txt_direction').val();
    };
    var PROCESS_STATUS = '';
    if ($('#txt_ProcessStatus option:selected')[0].value != null && $('#txt_ProcessStatus option:selected')[0].value != undefined) {
        PROCESS_STATUS = $('#txt_ProcessStatus option:selected')[0].value;
    };
    var START_KM = '';
    if ($('#txt_StartKm').val() != null && $('#txt_StartKm').val() != undefined) {
        START_KM = getKmmark_w($('#txt_StartKm').val());
    };
    var END_KM = '';
    if ($('#txt_EndKm').val() != null && $('#txt_EndKm').val() != undefined) {
        END_KM = getKmmark_w($('#txt_EndKm').val());
    };
    var START_DATE = '';
    if ($('#txt_StartDate').attr('value') != null && $('#txt_StartDate').attr('value') != undefined) {
        START_DATE = $('#txt_StartDate').attr('value');
    };
    var END_DATE = '';
    if ($('#txt_EndDate').attr('value') != null && $('#txt_EndDate').attr('value') != undefined) {
        END_DATE = $('#txt_EndDate').attr('value');
    };
    var REPORT_PROCESS = '';
    if ($('#txt_ReportOrProcess option:selected')[0].value != null && $('#txt_ReportOrProcess option:selected')[0].value != undefined) {
        REPORT_PROCESS = $('#txt_ReportOrProcess option:selected')[0].value;
    };
    var SEVERITY = '';
    if ($('#txtSeverity').attr('code') != null && $('#txtSeverity').attr('code') != undefined) {
        SEVERITY = $('#txtSeverity').attr('code');
    };
    _url = '/Common/DPCExcelAlarm/RemoteHandlers/downExcelAlarm.ashx?CATEGORY_CODE=' + CATEGORY_CODE
        + '&POWER_SECTION_CODE=' + POWER_SECTION_CODE
        + '&LINE_CODE=' + LINE_CODE
        + '&DIRECTION=' + escape(DIRECTION)
        + '&PROCESS_STATUS=' + escape(PROCESS_STATUS)
        + '&START_KM=' + START_KM
        + '&END_KM=' + END_KM
        + '&START_DATE=' + START_DATE
        + '&END_DATE=' + END_DATE
        + '&REPORT_PROCESS=' + escape(REPORT_PROCESS)
        + '&SEVERITY=' + SEVERITY
        + '&temp=' + Math.random();


    $.ajax({
        type: "post",
        url: _url,
        async: false,
        cache: false,
        success: function (result) {
            Downer(result.url);
        }
    });



}
/*/*
 * @desc 查看图片
 * @param picType：图片类型(task, assign, check, rect-before, rect-after)
 * @return 无
 */
function eventViewPic(obj) {
    layer.closeAll();
    var liImg = '';
    var liPot = '';
    var pics = [];
    if ('' !== $(obj).attr('src') && $(obj).attr('src').indexOf('.') >= 0) {
        pics = $(obj).attr('src').split(';');
    } else {
        layer.msg('无图片');
        return;
    }
    if (pics.length > 0) {
        var li = getPicAndPot(pics);
        liImg = li[0];

        if (pics.length > 1) {
            liPot = li[1];
        }
        $('.img_switch_hook').html('<a id="Pic_blank" target="blank" href="">' + liImg + '</a>');
        $('.img_control_hook > ul').html(liPot);
        showDialog($('#view-pic-process'));
    } else {
        layer.msg('无图片');
    }

    $('.img_switch_hook li img').css('height', '100%').css('width', '100%');
    img_switch();
    // });
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
        if (arrPic[i] === '') {
            continue;
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
//转换㎞mark
function getKmmark_w(str) {
    if (str != '') {
        return parseFloat(parseFloat(str) * 1000);
    } else {
        return '';
    }
};
//加载已选择项
function LoadDropdSelected1(dropdid, selectedStr) {
    var dropd = document.getElementById(dropdid);
    for (var i = 0; i < dropd.length; i++) {
        if (dropd[i].value == selectedStr) {
            dropd[i].selected = true;
        }
    }
};
//导入单个文件
function portInfileOne() {
    var index = layer.open({
        type: 2,
        title: false,
        closeBtn: 1, //不显示关闭按钮
        shade: [0.8, '#fff'], //0.1透明度的白色背景
        area: ['600px', '100px'],
        offset: 'center', //右下角弹出
        anim: 2,
        content: ['/Common/DPCExcelAlarm/ExcelToData.aspx', 'no'], //iframe的url，no代表不显示滚动条
        end: function () {
            //此处用于演示
        }
    });
};
//导入文件夹
function portInfileMore() {
    layer.open({
        title: '<div style="color:#317eac;font-size:20px;font-weight: bold;">导入文件夹</div>',
        shade: [0.8, '#fff'], //0.1透明度的白色背景
        offset: 'center', //右下角弹出
        closeBtn: 1, //不显示关闭按钮
        type: 1,
        area: ['420px', '120px'], //宽高
        content: '<div style="margin:20px auto;text-align: center;"> <form id="uploadForm" enctype="multipart/form-data"><input type="file" id="file_input" webkitdirectory directory style="border:1px #43a1da solid; border-radius:5px; width:200px;padding-top: 4px;padding-left: 4px;color:black " /> <input id="btn_portIn" type="button" value="导入" onclick="upfile()" class="btn btn-primary"/>  </form></div>'
    });
};
//多文件上传
function upfile() {
    var file = document.getElementById("file_input").files;
    if (file.length == 0) {
        //layer.msg('请先选择导入文件！');
        layer.tips('请先选择导入文件！', '#file_input', {
            tips: [1, '#78BA32'], time: 850
        });
        return;
    }
    var formData = new FormData();
    for (i = 0; i < file.length; i++) {
        formData.append("file[" + i + "]", file[i]); //++++++++++    
    }
    //formData.append('file', $('#file_input')[0].files);
    //console.log(data)
    $.ajax({
        url: '/Common/DPCExcelAlarm/RemoteHandlers/Upload1CSource.ashx?action=upLoad',
        type: 'POST',
        data: formData,
        beforeSend: function () {
            showLayerLoad();
        },
        async: true,
        cache: false,
        contentType: false,
        processData: false,
        success: function (re) {
            if (re != '') {
                layer.closeAll();
                layer.alert('匹配成功' + re.success + '条，匹配失败' + re.failure + '条', { icon: 6 }, function (index) { layer.close(index); reload() })
            } else {
                layer.close(layerIndex)
                layer.tips('上传文件夹失败！', '#btn_portIn', {
                    tips: [1, 'red']
                });
            }
        },
        error: function (returndata) {
            layer.close(layerIndex)
            layer.tips('导入文件夹错误！', '#btn_portIn', {
                tips: [1, 'red']
            });

        }
    });
}
//加载中
function showLayerLoad() {
    layerIndex = layer.msg('导入中', {
        icon: 16, shade: 0.01, time: 0
    });
};
//执行文件在虚拟目录中的删除方法
function deleteFile(data) {
    var file = '';
    var ask_url = '/Common/MAlarmMonitoring/RemoteHandlers/UploadFiles.ashx?action=delete' + '&file=' + data;
    $.ajax({
        type: "post",
        url: ask_url,
        async: false,
        cache: false,
        success: function (addurls) {
            if (addurls == "删除失败") {
                layer.msg('删除失败');
            } else {
                layer.msg('删除成功');
            }
        }
    });
};
//获取所有的数据
function GetDutyUnitsJson() {
    var url = 'RemoteHandlers/GetExcelAlarmList.ashx?type=all&START_DATE=' + $('#txt_StartDate').val() + '&END_DATE=' + $('#txt_EndDate').val();
    var json = "";
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        cache: true,
        success: function (result) {
            if (result != "") {
                json = eval('(' + result + ')');
                console.log(json);
            }
        }
    });
    return json;
};
//获取支柱列表
function QueryPoleList(page, pole_nu, KmMark) {
    var LINE_CODE = '';//线路code
    if ($('#LINE_CODE').val() != null && $('#LINE_CODE').val() != undefined && $('#LINE_CODE').val() != '') {
        LINE_CODE = $('#LINE_CODE').val();
    };
    var LINE_NAME = '';//线路name
    if ($('#LINE_NAME').val() != null && $('#LINE_NAME').val() != undefined && $('#LINE_NAME').val() != '') {
        LINE_NAME = $('#LINE_NAME').val();
    }
    var DIRECTION = '';//行别
    if ($('#direction').val() != null && $('#direction').val() != undefined && $('#direction').val() != '') {
        DIRECTION = $('#direction').val();
    };
    var POSITION_NAME = '';//区站name
    var POSITION_CODE = '';//区站code
    if ($('#PositionName').val() != null && $('#PositionName').val() != undefined && $('#PositionName').val() != '') {
        POSITION_NAME = $('#PositionName').val();

        POSITION_CODE = $('#PositionCode').val();

    };
    $('.pol_choose_div').html('');
    var ask_url = '/Common/DPCExcelAlarm/RemoteHandlers/GetExcelAlarmList.ashx?type=PoleList'
               //     + '&LINE_NAME=' + LINE_NAME//线路name
                    + '&LINE_CODE=' + LINE_CODE//线路code
                    + '&DIRECTION=' + DIRECTION//行别
             //       + '&POSITION_NAME=' + POSITION_NAME//区站name
                    + '&POSITION_CODE=' + POSITION_CODE//区站code
                    + '&pole_no=' + pole_nu//支柱号输入值
                    + '&Km_no=' + KmMark//公里标输入值
                    + '&pageIndex=' + page
                    + '&pageSize=' + pageSize_P;
    $.ajax({
        type: 'post',
        url: ask_url,
        async: true,
        cache: false,
        success: function (re) {
            if (re != '' && re != undefined && re != '-1' && re != '0' && re.data.length > 0) {
                PageCount = re.totalPages;
                var html = '';
                for (var i = 0; i < re.data.length; i++) {
                    PageCount = re.totalPages;
                    var html = '';
                    for (var i = 0; i < re.data.length; i++) {
                        html += '<div class="one_pole" POLE_NO="' + re.data[i].POLE_NO + '" code="' + re.data[i].POLE_CODE + '">\
                                   <div class="pole_number">'+ re.data[i].POLE_NO + '支柱</div>\
                                   <div class="km_number">' + re.data[i].KM + '</div>\
                               </div>'
                    };
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
                    $('.pol_choose_div').html(html);
                    $('.pageOutSide').css({
                        left: (($('.pol_choose_div').outerWidth() - $('.pageOutSide').width()) / 2) > 35 ? 35 : (($('.pol_choose_div').outerWidth() - $('.pageOutSide').width()) / 2)
                    });
                    pageCtrl();
                };
            } else {
                $('.pol_choose_div').html('<div style="color:white;font-size:20px;line-height:50px;text-align:center;margin-bottom: -30px;">暂无数据！</div>');
            };
        }
    });
};
//支柱分页控制
function pageCtrl() {
    $('.one_pole').click(function () {
        $('#PoleNumber').val($(this).attr('POLE_NO')).attr('code', $(this).attr('code'))
        //$('#kmStart').val($(this).attr('POLE_NO')).attr('code', $(this).attr('code'))
        $('.PoleNumberformError').hide();
        $('.pol_choose_div').hide();
        $('#KmMark_km').val($(this).children('.km_number').html());
    })
    //分页首页
    $(".page-top").click(function () {
        page = 1;
        var pole_nu = $('#PoleNumber').val();
        var KmMark = $('#KmMark_km').val();
        QueryPoleList(page, pole_nu, KmMark); ///执行查询 (当前JS)
    });
    //分页上一页
    $(".page-pre").click(function () {
        if (page > 1) {
            page = page - 1;
            var KmMark = $('#KmMark_km').val();
            var pole_nu = $('#PoleNumber').val();
            QueryPoleList(page, pole_nu, KmMark); ///执行查询 (当前JS)
        }
    });
    //分页下一页
    $(".page-nex").click(function () {
        if (page < PageCount) {
            page = page + 1;
            var pole_nu = $('#PoleNumber').val();
            var KmMark = $('#KmMark_km').val();
            QueryPoleList(page, pole_nu, KmMark); ///执行查询 (当前JS)
        }
    });
    //分页尾页
    $(".page-last").click(function () {
        page = PageCount;
        var pole_nu = $('#PoleNumber').val();
        var KmMark = $('#KmMark_km').val();
        QueryPoleList(page, pole_nu, KmMark); ///执行查询 (当前JS)
    });
};

//文件或图片上传方法
function UploadMethod(type, id) {
    $('#processdetails-' + id).myUploadFile({
        uploadCategories: type,
        server: '/Common/MAlarmMonitoring/RemoteHandlers/UploadFiles.ashx',
        action: 'UpLoad',
        fileListId: '#fileList-' + id,
        filePickerId: '#filePicker-' + id,
        uploadBtnId: '#ctlBtn-' + id
    })
    //$('#processdetails-' + id).myWebUpload({
    //    uploadBtnId: '#ctlBtn-'+id,
    //    uploadCategories: type,
    //    server: '/Common/MAlarmMonitoring/RemoteHandlers/UploadFiles.ashx',
    //    uploadParams: {
    //        action: 'UpLoad',
    //        alarmid: ''
    //    },
    //    onFinished: function (addCount, files, fileStr) {
    //        if (addCount === files.length) {
    //            putFileInForm('#U-'+id, fileStr);
    //        }
    //    }
    //});
};
