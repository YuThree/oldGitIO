var _w = $(window).width();
var _h = $(window).height();
var m = '';
var option;//表格内容
$(document).ready(function () {
    document.getElementById('txt_StartDate').value = DateLastWeekTime();
    document.getElementById('txt_EndDate').value = dateNowStr();
    document.getElementById('HAPPEN_DATE').value = DateLastWeekTime();
    loadSelect() //加载下拉菜单
    var org_name = getCurUser().orgName;
    if (org_name.indexOf('段') > -1) {
        $('#S_btnImport').css('background-color', 'grey');
        $('#S_btnImport').attr('disabled', 'disabled');
        $('#downMedal').hide();
    };
    if (org_name.indexOf('车间') > -1 || org_name.indexOf('工区') > -1) {
        $('#S_btnAdd').css('background-color', 'grey');
        $('#S_btnAdd').attr('disabled', 'disabled');
        $('#S_btnImport').css('background-color', 'grey');
        $('#S_btnImport').attr('disabled', 'disabled');
        $('#downMedal').hide();
    };
    loadFlexiGrid();//加载列表
    $('#S_btnQuery').click(function () {//查询
        var bool = $("#Form1").validationEngine("validate");
        if (bool) {
            doQuery(1);
        }
    });
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
    $('#downMedal').click(function () {//下载模板
        var url_ = "/Common/YuanDong/YuanDong_Model.xls";
        Downer(url_);
    });

    $('#S_btnExport').click(function () {//导出
        ExportQuestion();
    });

    $('#S_btnAdd').click(function () {//添加
        $('#sub').removeAttr('disabled');
        addQuestionModal();
    });

    $('#sub').click(function () {//保存
        var bool = $("#defaultForm").validationEngine("validate");
        var DU_bool = '';
        var ui_multiselect_checkboxes = $(document).find('.ui-multiselect-checkboxes > li');
        var i = 0
        for (var j = 0; j < ui_multiselect_checkboxes.length; j++) {
            var _aria_elected = $(ui_multiselect_checkboxes[j]).find('input[name=multiselect_DUTY_UNITS]').attr('aria-selected');
            if (_aria_elected == 'true') {
                i++;
            };
        };
        if (i == 0) {
            var DU_bool = false;
            $('.DUTY_UNITSformError').css('display', 'block')
        } else {
            var DU_bool = true;
            $('.DUTY_UNITSformError').css('display', 'none')
        };
        if (bool && DU_bool) {
            $('#sub').attr('disabled', 'disabled');
            addOrUpdate();
        };
    });
    $('#S_btnImport').click(function () {//导入
        var index = layer.open({
            type: 2,
            title: false,
            closeBtn: 1, //不显示关闭按钮
            shade: [0.8, '#fff'], //0.1透明度的白色背景
            area: ['600px', '100px'],
            offset: 'center', //右下角弹出
            anim: 2,
            content: ['/Common/YuanDong/YuanDongExcelToData.aspx', 'no'] //iframe的url，no代表不显示滚动条
        });
    });
    //加载上传附件图片
    $('#close').click(function () {
        $('.formError').hide();
        $('.U-resourceBefore').remove();
        $('.U-resourceAfter').remove();
        $('#processdetails-resourceBefore').html('');
        $('#processdetails-resourceAfter').html('');
        $('.ui-multiselect-none').trigger('click')
    });

});
//重新加载列表
function reload() {
    layer.closeAll();
    doQuery(1);
};
//绑定列表插件
function loadFlexiGrid() {
    var _h = $(window).height() - 250;
    var _PageNum = parseInt(_h / 27);
    var json = [
                { display: '操作', name: 'CZ', width: 100, sortable: false, align: 'center' },  //0  
                { display: '查看详情', name: 'CHECK_DETAIL', width: 80, sortable: false, align: 'center' },//1
                { display: '发生日期', name: 'HAPPEN_DATE', width: 120, sortable: false, align: 'center' },//2
                { display: '处所', name: 'location', width: 120, sortable: false, align: 'center' },//3
                { display: '问题分类', name: 'QUESTION_CLASSIFY', width: 120, sortable: false, align: 'center' },//4
				{ display: '专业分类', name: 'MAJOR_CLASSIFY', width: 80, sortable: false, align: 'center' },//5
				{ display: '问题等级', name: 'LV', width: 80, sortable: false, align: 'center' },//6
				{ display: '负责单位', name: 'DUTY_UNITS', width: 160, sortable: false, align: 'center' },//7
				{ display: '整改日期', name: 'RECTIFY_DATE', width: 120, sortable: false, align: 'center' },//8
				{ display: '处理人', name: 'HANDLER', width: 80, sortable: false, align: 'center' },//9
                { display: '问题内容', name: 'CONTENT', width: 220, sortable: false, align: 'center' },//10
				{ display: '问题原因', name: 'CAUSE', width: 220, sortable: false, align: 'center' },//11
                { display: 'ID', name: 'id', width: 80, hide: true, pk: true, sortable: false, align: 'center' },//12
                { display: '问题处理详情', name: 'DETAIL', width: 220, sortable: false, align: 'center' },//13
                { display: '销号状态', name: 'process_status', width: 80, sortable: false, align: 'center' },//14
                { display: '整改前图片', name: 'before_repair_pic', width: 80, hide: true, pk: true, sortable: false, align: 'center' },//15
                { display: '整改后图片', name: 'after_repair_pic', width: 80, hide: true, pk: true, sortable: false, align: 'center' },//16
                { display: '整改前图片名', name: 'before_repair_picname', width: 80, hide: true, pk: true, sortable: false, align: 'center' },//17
                { display: '整改后图片名', name: 'after_repair_picname', width: 80, hide: true, pk: true, sortable: false, align: 'center' },//18
    ]
    option = {
        colModel: json,
        url: 'RemoteHandlers/GetYuanDongList.ashx?type=all' + '&START_DATE=' + $('#txt_StartDate').val() + '&END_DATE=' + $('#txt_EndDate').val(),
        dataType: 'json',
        usepager: true,
        title: '远动库管理',
        pagestat: '显示第 {from} 条到 {to} 条,共 {total} 条数据', // 显示当前页和总页面的样式
        procmsg: '正在处理,请稍候 ...', // 正在处理的提示信息
        nomsg: '没有数据存在!', // 无结果的提示信息
        pagetext: '当前第',
        outof: '页，总页数',
        findtext: '条件查询：',
        useRp: true, //是否可以动态设置每页显示的结果数
        checkbox: false, // 是否要多选框
        rowId: 'id', // 多选框绑定行的id
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
            //初始化删除和修改的图形按钮
            var flexTable_tr = $('#flexTable tr');
            var btn_delete = "<span class= 'btn-delete j-delete'></span>";
            var btn_edit = "<span class='btn-edit j-edit'></span>";
            var btn_check = "<a class='btn_check j-check 'style ='cursor:pointer'>查看</a>";
            for (var i = 0; i < flexTable_tr.length; i++) {
                //加载删除、修改和查看按钮

                if ($(flexTable_tr[i]).find(' td:eq(14) div').html() == '已销号') {
                    $(flexTable_tr[i]).css('color', 'green');
                };//已销号，颜色变为绿色
                var org_name = getCurUser().orgName;
                if (org_name.indexOf('工区') > -1 || org_name.indexOf('车间') > -1) {
                    if ($(flexTable_tr[i]).find(' td:eq(14) div').html() == '已销号') {
                        $(flexTable_tr[i]).find(' td:eq(0) div').html("");
                    } else {
                        $(flexTable_tr[i]).find(' td:eq(0) div').html(btn_edit);//加载修改按钮
                    }
                } else {
                    $(flexTable_tr[i]).find(' td:eq(0) div').html(btn_edit + '&nbsp &nbsp &nbsp &nbsp' + btn_delete);//加载修改和删除按钮
                }
                $(flexTable_tr[i]).find(' td:eq(1) div').html(btn_check);

                $(flexTable_tr[i]).find(' td:eq(10) div').css({ 'white-space': 'nowrap', 'overflow': 'hidden', 'text-overflow': 'ellipsis' });//给问题内容栏设置样式
                $(flexTable_tr[i]).find(' td:eq(7) div').css({ 'white-space': 'nowrap', 'overflow': 'hidden', 'text-overflow': 'ellipsis' });//给负责单位栏设置样式
                $(flexTable_tr[i]).find(' td:eq(11) div').css({ 'white-space': 'nowrap', 'overflow': 'hidden', 'text-overflow': 'ellipsis' });//给问题原因栏设置样式
                $(flexTable_tr[i]).find(' td:eq(13) div').css({ 'white-space': 'nowrap', 'overflow': 'hidden', 'text-overflow': 'ellipsis' });//给问题处理详情栏设置样式
                ////给问题内容、问题原因、问题处理详情设置title值
                var _title1 = $(flexTable_tr[i]).find('td:eq(10) div').html();
                $(flexTable_tr[i]).find('td:eq(10) div').attr('title', _title1);
                var _title2 = $(flexTable_tr[i]).find('td:eq(11) div').html();
                $(flexTable_tr[i]).find('td:eq(11) div').attr('title', _title2);
                var _title3 = $(flexTable_tr[i]).find('td:eq(7) div').html();
                $(flexTable_tr[i]).find('td:eq(7) div').attr('title', _title3);
                var _title3 = $(flexTable_tr[i]).find('td:eq(13) div').html();
                $(flexTable_tr[i]).find('td:eq(13) div').attr('title', _title3);

            };
            //绑定鼠标移入移出事件
            $('.j-edit').mouseover(function () {
                $(this).css('background', 'url(/Common/DPCExcelAlarm/img/edit.png) no-repeat');
            }).mouseout(function () {
                $(this).css('background', 'url(/Common/DPCExcelAlarm/img/edit_mouseout.png) no-repeat')
            });
            $('.j-delete').mouseover(function () {
                $(this).css('background', 'url(/Common/DPCExcelAlarm/img/delete.png) no-repeat');
            }).mouseout(function () {
                $(this).css('background', 'url(/Common/DPCExcelAlarm/img/delete_mouseout.png) no-repeat')
            });
            //给修改图标和删除图标增加点击事件，点击后执行相应的修改和删除功能
            $('.j-delete').click(function () {
                var id = $(this).parent().parent().parent().attr('id');
                deleteQuestion(id)
            });
            $('.j-edit').click(function () {
                var id = $(this).parent().parent().parent().attr('id');
                $('#sub').removeAttr('disabled');
                updateQuestionModal(id);//修改  
            });
            $('.j-check').click(function () {
                var id = $(this).parent().parent().parent().attr('id');
                checkQuestionModal(id);//查看
            })
        }
    }
    $("#flexTable").flexigrid(option);
};

//查询方法
function doQuery(_pageIndex) {
    var LOCATION = "";
    if ($('#txt_location').val() != null && $('#txt_location').val() != undefined) {
        LOCATION = $('#txt_location').val();
    };
    var QUESTION_CLASSIFY = "";
    if ($('#question_classify').val() != null && $('#question_classify').val() != undefined) {
        QUESTION_CLASSIFY = $('#question_classify').val();
    };
    var START_DATE = '';
    if ($('#txt_StartDate').attr('value') != null && $('#txt_StartDate').attr('value') != undefined) {
        START_DATE = $('#txt_StartDate').attr('value');
    };
    var END_DATE = '';
    if ($('#txt_EndDate').attr('value') != null && $('#txt_EndDate').attr('value') != undefined) {
        END_DATE = $('#txt_EndDate').attr('value');
    };
    var DUTY_UNITS = "";
    if ($('#duty_units').attr('value') != null && $('#duty_units').attr('value') != undefined) {
        DUTY_UNITS = $('#duty_units').attr('value');
    };
    var LV = "";
    if ($('#txt_lv').attr('value') != null && $('#txt_lv').attr('value') != undefined) {
        LV = $('#txt_lv').attr('value');
    };
    var MAJOR_CLASSIFY = "";
    if ($('#major_classify').attr('value') != null && $('#major_classify').attr('value') != undefined) {
        MAJOR_CLASSIFY = $('#major_classify').attr('value');
    };
    var PROCESS_STATUS = "";
    if ($('#txt_ProcessStatus').attr('value') != null && $('#txt_ProcessStatus').attr('value') != undefined) {
        PROCESS_STATUS = $('#txt_ProcessStatus').attr('value');
    };
    option.url = 'RemoteHandlers/GetYuanDongList.ashx?type=all&LOCATION=' + escape(LOCATION)
        + '&QUESTION_CLASSIFY=' + escape(QUESTION_CLASSIFY)
        + '&START_DATE=' + START_DATE
        + '&END_DATE=' + END_DATE
        + '&DUTY_UNITS=' + escape(DUTY_UNITS)
        + '&LV=' + LV
        + '&MAJOR_CLASSIFY=' + MAJOR_CLASSIFY
        + '&process_status=' + PROCESS_STATUS
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
};
//弹出添加蒙层
function addQuestionModal() {
    $("#modal-container-22256").modal({ backdrop: 'static', keyboard: false }).css({
        width: '750px',
        'margin-left': function () {
            return -($(this).width() / 2);
        },
        'margin-top': function () {
            return -($(this).height() / 1.7);
        }
    });
    $('#processdetails-resourceBefore').html('');
    UploadMethod('images', 'resourceBefore');//绑定上传图片方法
    $('#filePicker-resourceBefore').css('background', 'url(/Common/YuanDong/img/change_before.png) no-repeat');
    $('#processdetails-resourceAfter').html('');
    UploadMethod('images', 'resourceAfter');//绑定上传图片方法
    $('#filePicker-resourceAfter').css('background', 'url(/Common/YuanDong/img/change_after.png) no-repeat');
    $('#modal-container-22256').find('input,select,textarea').val('');
    document.getElementById('HAPPEN_DATE').value = DateLastWeekTime();
    //$('#DUTY_UNITS').next().find('span:eq(1)').html('请选择');
    $('.ui-multiselect-none').trigger('click');
    $("#text").val("add");
}
//弹出修改蒙层
function updateQuestionModal(id) {
    //初始化弹窗
    $("#modal-container-22256").modal({ backdrop: 'static', keyboard: false }).css({
        width: '750px',
        'margin-left': function () {
            return -($(this).width() / 2);
        },
        'margin-top': function () {
            return -($(this).height() / 1.7);
        }
    });
    getRowJson(id);//获取该行的json
    var _pic_name = '';
    var before_pic = m.before_repair_pic;
    var after_pic = m.after_repair_pic;
    var resourceBeforeId = $('#resourceBefore').attr('id');
    var resourceAfterId = $('#resourceAfter').attr('id');
    $('#processdetails-resourceBefore').html();
    UploadMethod('images', 'resourceBefore');//绑定上传图片方法
    $('#filePicker-resourceBefore').css('background', 'url(/Common/YuanDong/img/change_before.png) no-repeat');
    $('#resourceBefore').val(before_pic);
    getFile('images', before_pic, _pic_name, resourceBeforeId);
    $('#processdetails-resourceAfter').html();
    UploadMethod('images', 'resourceAfter');//绑定上传图片方法
    $('#filePicker-resourceAfter').css('background', 'url(/Common/YuanDong/img/change_after.png) no-repeat');
    $('#resourceAfter').val(after_pic);
    getFile('images', after_pic, _pic_name, resourceAfterId);
    $('#HAPPEN_DATE').val(m.HAPPEN_DATE_T);//发生日期
    $('#LOCATION').val(DealStr(m.location));//处所
    $('#QUESTION_CLASSIFY').val(m.QUESTION_CLASSIFY);//问题分类
    $('#MAJOR_CLASSIFY').val(m.MAJOR_CLASSIFY);//专业分类
    $('#CONTENT').val(DealStr(m.CONTENT));//问题内容
    $('#LV').val(m.LV);//问题等级
    $('#ui-corner-all').trigger('click');
    $('.ui-icon-triangle-1-s').next('span').html(m.DUTY_UNITS);
    //获取默认勾选
    var DU_obj = m.DUTY_UNITS.split(',');
    var obj = document.getElementById('DUTY_UNITS');
    var ui_multiselect_checkboxes = $(document).find('.ui-multiselect-checkboxes > li');
    if (DU_obj != '' && DU_obj != undefined) {
        for (var i = 0; i < DU_obj.length; i++) {
            for (var j = 0; j < ui_multiselect_checkboxes.length; j++) {
                if (DU_obj[i] == $(ui_multiselect_checkboxes[j]).find('span').html()) {
                    $(ui_multiselect_checkboxes[j]).find('input[name=multiselect_DUTY_UNITS]').trigger('click');
                    $(ui_multiselect_checkboxes[j]).find('input[name=multiselect_DUTY_UNITS]').attr('aria-selected', 'true')
                    document.getElementById('DUTY_UNITS').options[j].selected = true;
                    $(obj.options[j]).trigger('click');
                };
            };
        };
    } else {
        $('.ui-multiselect-none').trigger('click')
    };
    $('#RECTIFY_DATE').val(m.RECTIFY_DATE_T);//整改日期
    $('#HANDLER').val(DealStr(m.HANDLER));//处理人
    $('#CAUSE').val(DealStr(m.CAUSE));//问题原因
    $('#pid').val(m.id);//获取id
    $('#DETAIL').val(DealStr(m.DETAIL));//获取问题处理详情
    $('#ProcessStatus').val(DealStr(m.process_status));//获取问题处理详情
    $("#text").val("update");
};
//弹出查看蒙层
function checkQuestionModal(id) {
    $("#modal-container-22257").modal({ backdrop: 'static', keyboard: false }).css({
        width: '650px',
        'margin-left': function () {
            return -($(this).width() / 2);
        },
        'margin-top': function () {
            return -($(this).height() / 1.7);
        }
    });
    getRowJson(id);//获取该行的json
    var before_html = '';
    var after_html = '';
    var before_pic = m.before_repair_pic;
    var after_pic = m.after_repair_pic;
    //if ('' !== before_pic && before_pic.indexOf('/') >= 0) {
    if (before_pic.indexOf('gif') >= 0 || before_pic.indexOf('jpg') >= 0 || before_pic.indexOf('jpeg') >= 0 || before_pic.indexOf('bmp') >= 0 || before_pic.indexOf('png') >= 0 || before_pic.indexOf('GIF') >= 0 || before_pic.indexOf('JPG') >= 0 || before_pic.indexOf('JPEG') >= 0 || before_pic.indexOf('BMP') >= 0 || before_pic.indexOf('PNG') >= 0) {
        before_html = '<div class="cp_img"><img title="点击查看大图" src="' + before_pic + '"  onclick="eventViewPic1(this)"></div>';
    } else {
        before_html = '';
    };
    if (after_pic.indexOf('gif') >= 0 || after_pic.indexOf('jpg') >= 0 || after_pic.indexOf('jpeg') >= 0 || after_pic.indexOf('bmp') >= 0 || after_pic.indexOf('png') >= 0 || after_pic.indexOf('GIF') >= 0 || after_pic.indexOf('JPG') >= 0 || after_pic.indexOf('JPEG') >= 0 || after_pic.indexOf('BMP') >= 0 || after_pic.indexOf('PNG') >= 0) {
        after_html = '<div class="cp_img"><img title="点击查看大图"  src="' + after_pic + '"  onclick="eventViewPic1(this)"></div>';
    } else {
        after_html = '';
    };
    $('#divPicBefore').html(before_html);
    $('#divPicAfter').html(after_html);
    $('#divHappenDate').html(m.HAPPEN_DATE_T);//发生日期
    $('#divLocation').html(m.location);//处所
    $('#divQuestionClassify').html(m.QUESTION_CLASSIFY);//问题分类
    $('#divMajorClassify').html(m.MAJOR_CLASSIFY);//专业分类
    $('#divContent').html(m.CONTENT);//问题内容
    $('#divLV').html(m.LV);//问题等级
    $('#divDutyUnits').html(m.DUTY_UNITS);//负责单位
    $('#divRectifyDate').html(m.RECTIFY_DATE_T);//整改日期
    $('#divHandler').html(m.HANDLER);//处理人
    $('#divCause').html(m.CAUSE);//问题原因
    $('#divDetail').html(m.DETAIL);//问题处理详情
    $('#divProcessStatus').html(m.process_status);//销号状态
};

//判断是添加还是修改
function addOrUpdate() {
    var type = document.getElementById("text").value;
    var uploadCount = 0; //上传的图片的数量
    var uploadCount1 = 0; //上传的图片的数量
    var fileCount = 0; //上传控件中上传成功的数量
    var fileCount1 = 0; //上传控件中上传成功的数量
    var obj = document.getElementById('DUTY_UNITS');
    var duty_units = getSelectedItem(obj);
    $('#txt_DUTY_UNITS').val(duty_units);
    console.log($('#txt_DUTY_UNITS').val());
    switch (type) {
        case 'add': //添加
            $('#ctlBtn-resourceBefore').trigger('click');
            uploadCount = $('#processdetails-resourceBefore').parent().find('.U-resourceBefore:first', document).length;
            fileCount = $('#processdetails-resourceBefore .file-count').val();

            $('#ctlBtn-resourceAfter').trigger('click');
            uploadCount1 = $('#processdetails-resourceAfter').parent().find('.U-resourceAfter:first', document).length;
            fileCount1 = $('#processdetails-resourceAfter .file-count').val();
            break;
        case 'update': //修改
            $('#ctlBtn-resourceBefore').trigger('click');
            uploadCount = $('#processdetails-resourceBefore').parent().find('.U-resourceBefore', document).length;
            fileCount = $('#processdetails-resourceBefore .default-file-count').val();

            $('#ctlBtn-resourceAfter').trigger('click');
            uploadCount1 = $('#processdetails-resourceAfter').parent().find('.U-resourceAfter', document).length;
            fileCount1 = $('#processdetails-resourceAfter .default-file-count').val();
            break;
    };

    switch (type) {
        case 'add':
            if (uploadCount === Number(fileCount) && uploadCount1 === Number(fileCount1)) {
                var upload = $('#processdetails-resourceBefore').parent().find('.U-resourceBefore', document);
                var val = '';
                for (var i = 0; i < upload.length; i++) {
                    val += $(upload[i]).val();
                }
                $('#resourceBefore').val(val);
                var upload1 = $('#processdetails-resourceAfter').parent().find('.U-resourceAfter', document);
                var val1 = '';
                for (var i = 0; i < upload1.length; i++) {
                    val1 += $(upload1[i]).val();
                }
                $('#resourceAfter').val(val1);
                Save_AddOrUpdate();
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
        case 'update'://修改
            var addPicBeforeNum = $('#add-resourceBefore').val();
            var addPicAfterNum = $('#add-resourceAfter').val();
            addPicBeforeNum = Number(addPicBeforeNum);
            addPicAfterNum = Number(addPicAfterNum);
            fileCount = Number(fileCount) + addPicBeforeNum;
            fileCount1 = Number(fileCount1) + addPicAfterNum;
            if (uploadCount === Number(fileCount) && uploadCount1 === Number(fileCount1)) {
                var upload = $('#processdetails-resourceBefore').parent().find('.U-resourceBefore:first', document);
                var val = '';
                for (var i = 0; i < upload.length; i++) {
                    val += $(upload[i]).val();
                }
                $('#resourceBefore').val(val);
                var upload1 = $('#processdetails-resourceAfter').parent().find('.U-resourceAfter:first', document);
                var val1 = '';
                for (var i = 0; i < upload1.length; i++) {
                    val1 += $(upload1[i]).val();
                }
                $('#resourceAfter').val(val1);
                Save_AddOrUpdate();
            } else {
                switch (type) {
                    case 'add':
                        setTimeout('addOrUpdate()', 750);
                        break;
                    case 'update':
                        setTimeout('addOrUpdate()', 750);
                        break;
                }
            };
            break;
    }

};

//添加和修改的保存事件
function Save_AddOrUpdate() {
    var type = $('#text').val();
    var tip_S = '';
    var tip_F = '';
    if (type == 'add') {
        tip_S = '添加成功';
        tip_F = '添加失败';
    } else if (type == 'update') {
        tip_S = '修改成功';
        tip_F = '修改失败';
    }
    var options = {
        url: "/Common/YuanDong/RemoteHandlers/GetYuanDongList.ashx?type=" + type + "&id=" + $('#pid').val(),
        type: 'POST',
        success: function (rs) {
            if (rs == "1") {
                ymPrompt.succeedInfo(tip_S, null, null, '提示信息', function () {
                    $("#flexTable").flexReload();
                    $('.U-resourceBefore').remove();
                    $('.U-resourceAfter').remove();
                    $('#processdetails-resourceBefore').html('');
                    $('#processdetails-resourceAfter').html('');
                    $('#add-resourceBefore').val('');
                    $('#add-resourceAfter').val('');
                    $('.ui-multiselect-none').trigger('click')
                    var formError = $('.formError', document);
                    if (formError.length > 1) {
                        for (var i = 0; i < formError.length; i++) {
                            if (!$(formError[i]).hasClass('DUTY_UNITSformError')) {
                                $(formError[i]).remove();
                            };
                        }
                    };
                });
                document.getElementById('close').click();
            } else {
                ymPrompt.errorInfo(tip_F, null, null, '提示信息', function () {
                    $('#sub').removeAttr('disabled');
                });
                return true;
            };
        }
    };
    $('#defaultForm').ajaxSubmit(options);
};

//删除
function deleteQuestion(id) {
    ymPrompt.confirmInfo({
        message: '确认要删除这条记录吗?',
        handler: function (tp) {
            if (tp == 'ok') {
                var url = "RemoteHandlers/GetYuanDongList.ashx?type=delete&ID=" + id;
                $.ajax({
                    type: "post",
                    url: url,
                    async: false,
                    cache: false,
                    success: function (rs) {
                        if (rs == 1) {
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

//导出
function ExportQuestion() {
    var LOCATION = "";
    if ($('#txt_location').val() != null && $('#txt_location').val() != undefined) {
        LOCATION = $('#txt_location').val();
    };
    var QUESTION_CLASSIFY = "";
    if ($('#question_classify').val() != null && $('#question_classify').val() != undefined) {
        QUESTION_CLASSIFY = $('#question_classify').val();
    };
    var START_DATE = '';
    if ($('#txt_StartDate').attr('value') != null && $('#txt_StartDate').attr('value') != undefined) {
        START_DATE = $('#txt_StartDate').attr('value');
    };
    var END_DATE = '';
    if ($('#txt_EndDate').attr('value') != null && $('#txt_EndDate').attr('value') != undefined) {
        END_DATE = $('#txt_EndDate').attr('value');
    };
    var DUTY_UNITS = "";
    if ($('#duty_units').attr('value') != null && $('#duty_units').attr('value') != undefined) {
        DUTY_UNITS = $('#duty_units').attr('value');
    };
    var LV = "";
    if ($('#txt_lv').attr('value') != null && $('#txt_lv').attr('value') != undefined) {
        LV = $('#txt_lv').attr('value');
    };
    var MAJOR_CLASSIFY = "";
    if ($('#major_classify').attr('value') != null && $('#major_classify').attr('value') != undefined) {
        MAJOR_CLASSIFY = $('#major_classify').attr('value');
    };
    var _url = 'RemoteHandlers/downYuanDong.ashx?type=all&LOCATION=' + escape(LOCATION)
       + '&QUESTION_CLASSIFY=' + escape(QUESTION_CLASSIFY)
       + '&START_DATE=' + START_DATE
       + '&END_DATE=' + END_DATE
       + '&DUTY_UNITS=' + escape(DUTY_UNITS)
       + '&LV=' + LV
       + '&MAJOR_CLASSIFY=' + MAJOR_CLASSIFY
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
//加载下拉菜单
function loadSelect() {
    //问题分类
    $('#question_classify').mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: '3C',
        cateGory: 'RECTIFY_INFORM',
        p_code: 'QU_CLASSIFY',
        isDefClick: false,
        enableFilter: false,
        onClick: function (event, treeId, treeNode) {
            $('#question_classify').val(treeNode.name).attr('code', treeNode.id);
        }
    });
    $('#QUESTION_CLASSIFY').mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: '3C',
        cateGory: 'RECTIFY_INFORM',
        p_code: 'QU_CLASSIFY',
        isDefClick: false,
        enableFilter: false,
        onClick: function (event, treeId, treeNode) {
            $('#QUESTION_CLASSIFY').val(treeNode.name).attr('code', treeNode.id);
            $('.QUESTION_CLASSIFYformError ').hide();
        }
    });
    //专业分类
    $('#major_classify').mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: '3C',
        cateGory: 'RECTIFY_INFORM',
        p_code: 'MAJOR_CLASSIFY',
        isDefClick: false,
        enableFilter: false,
        onClick: function (event, treeId, treeNode) {
            $('#major_classify').val(treeNode.name).attr('code', treeNode.id);
        }
    });
    $('#MAJOR_CLASSIFY').mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: '3C',
        cateGory: 'RECTIFY_INFORM',
        p_code: 'MAJOR_CLASSIFY',
        isDefClick: false,
        enableFilter: false,
        onClick: function (event, treeId, treeNode) {
            $('#MAJOR_CLASSIFY').val(treeNode.name).attr('code', treeNode.id);
            $('.MAJOR_CLASSIFYformError ').hide();
        }
    });
    //问题等级
    $('#txt_lv').mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: '3C',
        cateGory: 'RECTIFY_INFORM',
        p_code: 'LV',
        isDefClick: false,
        enableFilter: false,
        onClick: function (event, treeId, treeNode) {
            $('#txt_lv').val(treeNode.name).attr('code', treeNode.id);
        }
    });
    $('#LV').mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: '3C',
        cateGory: 'RECTIFY_INFORM',
        p_code: 'LV',
        isDefClick: false,
        enableFilter: false,
        onClick: function (event, treeId, treeNode) {
            $('#LV').val(treeNode.name).attr('code', treeNode.id);
            $('.LVformError ').hide();
        }
    });

    //负责单位
    var DUJson = GetDutyUnitsJson();//获取负责单位
    var jsHtml = "";
    for (var i = 0; i < DUJson.length; i++) {
        jsHtml += "<option value='" + DUJson[i].code + "'>" + DUJson[i].name + "</option>";
    }
    if (jsHtml) {
        $('#DUTY_UNITS').html(jsHtml);
        $("#DUTY_UNITS").multiselect({
            noneSelectedText: "请选择",
            checkAllText: "全选",
            uncheckAllText: '全不选',
            selectedList: DUJson.length,
            height: 200
        });
    }
    $('#duty_units').mySelectTree({
        tag: "ORGANIZATION_JUNIORBUREAU",
        code: '',
        type: '',
        isDefClick: false,
        enableFilter: false,
        action: 'YuanDong',
        onClick: function (event, treeId, treeNode) {
            $('#duty_units').val(treeNode.name).attr('code', treeNode.id);
        }
    });
};
//查看图片方法
function eventViewPic(obj) {
    layer.closeAll();
    var liImg = '';
    var liPot = '';
    var pics = [];
    if ('' !== $(obj).attr('pic') && $(obj).attr('pic').indexOf('.') >= 0) {
        pics = $(obj).attr('pic').split(';');
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
        $('.img_switch_hook').html(liImg);
        $('.img_control_hook > ul').html(liPot);
        showDialog($('#view-pic-process'));
    } else {
        layer.msg('无图片');
    }
    $('.img_switch_hook li img').css('height', '100%').css('width', '100%');
    img_switch();
};
function eventViewPic1(obj) {
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
        $('.img_switch_hook').html(liImg);
        $('.img_control_hook > ul').html(liPot);
        showDialog($('#view-pic-process'));
    } else {
        layer.msg('无图片');
    }
    $('.img_switch_hook li img').css('height', '100%').css('width', '100%');
    img_switch();
};
//弹出图片蒙层
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
//获取各类图片
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
};
//图片切换事件
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
//获取已上传的图片或文件
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
//获取字典名称
function GetDutyUnitsJson() {
    var url = "/Common/RemoteHandlers/Pubic.ashx?type=Organization_JuniorBureau&action=YuanDong";
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
//获取多选
function getSelectedItem(obj) {
    var slct_code = "";
    var slct_name = "";
    if (obj != '' && obj != undefined) {
        for (var i = 0; i < obj.options.length; i++)
            if (obj.options[i].selected == true) {
                slct_code += obj.options[i].value;
                slct_name += obj.options[i].text + ',';
            };
    };
    slct_name = slct_name.substring(0, slct_name.length - 1);
    return slct_name;
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
};
//获取每一行的json
function getRowJson(id) {
    var AlarmJson = PageAlarmJson.rows;
    for (var i = 0; i < AlarmJson.length; i++) {
        if (AlarmJson[i].id == id) {
            m = AlarmJson[i];//获得ID=id的JSON
        };
    };
    return m;
};
//处理后台转义后的字符
function DealStr(value) {
    var newStr = '';
    if (value !== '' || value !== null) {

        newStr = value.replace(/&#39;/g, "'");
        newStr = newStr.replace(/&lt;/g, "<");
        newStr = newStr.replace(/&gt;/g, ">");
        newStr = newStr.replace(/&quot;/g, "\"");
        newStr = newStr.replace(/&#37;/g, "%");
        newStr = newStr.replace(/&#59;/g, ";");
        newStr = newStr.replace(/&#40;/g, "(");
        newStr = newStr.replace(/&#41;/g, ")");
        newStr = newStr.replace(/&amp;/g, "&");
        newStr = newStr.replace(/&#43;/g, "+");
        newStr = newStr.replace(/&#59;/g, ";");
    };
    return newStr;

};
function stripscript(obj) {
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
    var rs = "";
    for (var i = 0; i < value.length; i++) {
        rs = rs + s.substr(i, 1).replace(pattern, '');
    }
    return rs;
}
