
var pageType = GetQueryString('pageType'); //页面类型：添加(add)、修改(update)、详情(detail)

var newSupportNum = 0; //新增支撑装置数量
var newLocationNum = 0; //新增定位装置数量
//var strKey = "strKey";
//var storage = window.localStorage;

$(document).ready(function () {

    //关闭页面
    $('.j-page-close').click(function () {
        window.close();
    });

    //添加
    if ('add' === pageType) {
        setPageTitle('添加支柱', 'title-ico-add');
        $('#save-pole').val('确认添加');
        initControlsForPoleAdd(); //初始化控件

        $('.j-save-pole').click(function () {  //添加支柱
            eventSavePole('ADD');
        });
    }

    //修改
    if ('update' === pageType) {
        setPageTitle('修改支柱', 'title-ico-update');
        $('#save-pole').val('保存修改');
        initControlsForPoleUpdate(); //初始化控件

        var id = GetQueryString('id');
        getPoleDetail(id); //获取支柱详情

        $('.j-save-pole').click(function () {  //修改支柱
            eventSavePole('UPDATE');
        });
    }

    //详情
    if ('detail' === pageType) {
        var id = GetQueryString('id');
        getPoleDetail(id, 'detail'); //获取支柱详情
        if ($(window).width() > 1400) {
            $('.info-ul > li').css('margin-bottom', '15px');
        } else {
            $('.info-ul > li').css('margin-bottom', '8px');
        }

        //跳转到一杆一档详情页
        $('#pole_no').click(function () {
            var deviceId = $(this).attr('device-id');
            var _url = '/6C/PC/MPoleRecord/poleRecord.html?device_id=' + deviceId + '&category=1C&v=' + version;
            window.open(_url, '_blank');
        }).css({ 'color': '#369bd7', 'cursor': 'pointer' });
    }
});

/*/*
 * @desc 初始化添加支柱页面控件
 * @param 无
 * @return 无
 */
function initControlsForPoleAdd() {

    //上传图片控件
    loadUpload(guid(), '#upload-pole-img', '#pole-img-reset', '#pole-img', '#fileList', '#filePicker', '#ctlBtn', '/Common/MFoundation/RemoteHandlers/PolePictureUpload.ashx', 'upLoad');

    initDateControl('#comms_date'); //投运日期
    initDateControl('#prod_date'); //出厂日期

    initPoleTree(); //支柱下拉树

    //initLineTree('#line_name', '#position_name', '#brg_tun_name'); //线路、区站、桥隧控件
    initLineSelect('#line_code', '#position_code', '#brg_tun_code', '#line_name', '#position_name', '#brg_tun_name'); //线路、区站、桥隧控件
    initOrgSelect('#bureau_code', '#power_section_code', '#workshop_code', '#org_code', '#bureau_name', '#power_section_name', '#workshop_name', '#org_name'); //组织机构控件

    validFiled(); //验证字段
    eventCheckUnit(); //选择部件

    eventAddDevice('support', '支撑装置'); //添加支撑装置
    eventAddDevice('location', '定位装置'); //添加定位装置

}

/*/*
 * @desc 初始化修改支柱页面控件
 * @param 无
 * @return 无
 */
function initControlsForPoleUpdate() {

    //上传图片控件
    loadUpload(GetQueryString('id'), '#upload-pole-img', '#pole-img-reset', '#pole-img', '#fileList', '#filePicker', '#ctlBtn', '/Common/MFoundation/RemoteHandlers/PolePictureUpload.ashx', 'upLoad');

    initDateControl('#comms_date'); //投运日期
    initDateControl('#prod_date'); //出厂日期

    initPoleTree(); //支柱下拉树

    //initLineTree('#line_name', '#position_name', '#brg_tun_name'); //线路、区站、桥隧控件
    initLineSelect('#line_code', '#position_code', '#brg_tun_code', '#line_name', '#position_name', '#brg_tun_name'); //线路、区站、桥隧控件
    initOrgSelect('#bureau_code', '#power_section_code', '#workshop_code', '#org_code', '#bureau_name', '#power_section_name', '#workshop_name', '#org_name'); //组织机构控件

    validFiled(); //验证字段
    eventCheckUnit(); //选择部件

    eventAddDevice('support', '支撑装置'); //添加支撑装置
    eventAddDevice('location', '定位装置'); //添加定位装置
}

/*/*
 * @desc 初始化支柱下拉树
 * @param 无
 * @return 无
 */
function initPoleTree() {
    //行别
    $('#pole_direction').mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: '3C',
        cateGory: 'DRTFLG',
        isDefClick: false,
        onClick: function (event, treeId, treeNode) {
            $('#pole_direction').val(treeNode.name).attr('code', treeNode.id);
        },
        callback: function () {
            validInput('#pole_direction', '请选择行别');
        }
    });
    //支柱类型
    $('#pole_type').mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: 'DPC',
        cateGory: 'PSARC',
        p_code: 'POLE_TYPE',
        isDefClick: false,
        onClick: function (event, treeId, treeNode) {
            $('#pole_type').val(treeNode.name).attr('code', treeNode.id);
            $('#pole_type_code').val(treeNode.id);
        }
    });

    //支柱型号
    $('#pole_mdl').mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: 'DPC',
        cateGory: 'PSARC',
        p_code: 'POLE_GENRE',
        isDefClick: false,
        onClick: function (event, treeId, treeNode) {
            $('#pole_mdl').val(treeNode.name).attr('code', treeNode.id);
            $('#pole_mdl_code').val(treeNode.id);
        }
    });

    //支柱用途
    $('#pole_usage').mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: 'DPC',
        cateGory: 'PSARC',
        p_code: 'POLE_PURPOSE',
        isDefClick: false,
        onClick: function (event, treeId, treeNode) {
            $('#pole_usage').val(treeNode.name).attr('code', treeNode.id);
            $('#pole_usage_code').val(treeNode.id);
        }
    });
    //支柱材质
    $('#mtr_qlt').mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: 'DPC',
        cateGory: 'PSARC',
        p_code: 'POLE_TEXTURE',
        isDefClick: false,
        onClick: function (event, treeId, treeNode) {
            $('#mtr_qlt').val(treeNode.name).attr('code', treeNode.id);
            $('#mtr_qlt_code').val(treeNode.id);
        }
    });
    //基础状态 ？？
    //$('#pole_bsc_sts').mySelectTree({
    //    tag: 'SYSDICTIONARYTREE',
    //    codeType: 'DPC',
    //    cateGory: 'PSARC',
    //    p_code: '',
    //    isDefClick: false,
    //    onClick: function (event, treeId, treeNode) {
    //        $('#pole_bsc_sts').val(treeNode.name).attr('code', treeNode.code);
    //    }
    //});
    //基础类型
    $('#pole_basic_type').mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: 'DPC',
        cateGory: 'PSARC',
        p_code: 'BASICS_TYPE',
        isDefClick: false,
        onClick: function (event, treeId, treeNode) {
            $('#pole_basic_type').val(treeNode.name).attr('code', treeNode.id);
            $('#pole_basic_type_code').val(treeNode.id);
        }
    });
    //支柱状态
    $('#pole_status').mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: 'DPC',
        cateGory: 'PSARC',
        p_code: 'POLE_STATUS',
        isDefClick: false,
        onClick: function (event, treeId, treeNode) {
            $('#pole_status').val(treeNode.name).attr('code', treeNode.id);
            $('#pole_status_code').val(treeNode.id);
        }
    });
    //直线/曲内/区外  LINEX/BIGHT  DRTFLG
    $('#curve_direction').mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: 'DPC',
        cateGory: 'PSARC',
        p_code: 'LINEX_BIGHT',
        isDefClick: false,
        onClick: function (event, treeId, treeNode) {
            $('#curve_direction').val(treeNode.name).attr('code', treeNode.id);
            $('#curve_direction_code').val(treeNode.id);
        }
    });
    //地线状态 ？？
    //$('#grnd_sts').mySelectTree({
    //    tag: 'SYSDICTIONARYTREE',
    //    codeType: 'DPC',
    //    cateGory: 'PSARC',
    //    p_code: '',
    //    isDefClick: false,
    //    onClick: function (event, treeId, treeNode) {
    //        $('#grnd_sts').val(treeNode.name).attr('code', treeNode.id);
    //    }
    //});
}

/*/*
 * @desc 验证支柱号是否存在
 * @param 无
 * @return 无
 */
function verifyPole() {
    var lineCode = $('#line_code').val(); //线路code
    var positionCode = $('#position_code').val(); //区站code
    var brgTunCode = $('#brg_tun_code').val(); //桥隧code
    var poleDirection = (undefined === $('#pole_direction').attr('code') ? '' : $('#pole_direction').attr('code')); //行别
    var poleNo = $('#pole_no').val(); //杆号
    if ('' === poleNo) {
        return;
    }
    var kmstandard = $('#kmstandard').val(); //公里标
    var _url = '';
    if ('add' === pageType) {
        _url = '/Common/MFoundation/RemoteHandlers/PoleControl.ashx?type=verify'
                 + '&line_code=' + lineCode
                 + '&position_code=' + positionCode
                 + '&brg_tun_code=' + brgTunCode
                 + '&pole_direction=' + poleDirection
                 + '&pole_no=' + poleNo
                 + '&kmstandard=' + kmstandard;
    }
    if ('update' === pageType) {
        _url = '/Common/MFoundation/RemoteHandlers/PoleControl.ashx?type=verify_update'
                 + '&line_code=' + lineCode
                 + '&position_code=' + positionCode
                 + '&brg_tun_code=' + brgTunCode
                 + '&pole_direction=' + poleDirection
                 + '&pole_no=' + poleNo
                 + '&kmstandard=' + kmstandard
                 + '&id=' + GetQueryString('id');
    }
    var json;
    $.ajax({
        url: _url,
        type: 'post',
        cache: false,
        async: false,
        dataType: 'json',
        success: function (result) {
            json = result.POLE_EXIST; //"1",存在；"-1"，不存在
        },
        error: function (data) {
            console.log('error:' + data);
        }
    });
    return json;
}

/*/*
 * @desc 获取支柱详情
 * @param infoType：信息类型
 * @return 无
 */
function getPoleDetail(id, infoType) {
    var _url = '/Common/MFoundation/RemoteHandlers/PoleControl.ashx?type=detail&id=' + id;
    $.ajax({
        url: _url,
        type: 'post',
        cache: false,
        dataType: 'json',
        success: function (result) {
            var json = result;
            newSupportNum = json.SUPPORT.length; //新增支撑装置数量
            newLocationNum = json.LOCATION.length; //新增定位装置数量

            setPoleInfoAndProfile(json, infoType); //设置支柱信息和支柱属性
            setUnit(json); //设置其他部件选中

            setSupportDeviceInfo(json, infoType); //设置支撑装置信息
            setLocationDeviceInfo(json, infoType); //设置定位装置信息
        },
        error: function (data) {
            //console.log('error:' + data.responseText);
            console.log('error:' + data);
        }
    });
}

/*/*
 * @desc 保存支柱事件
 * @param operaType：操作类型(ADD，UPDATE)
 * @return 无
 */
function eventSavePole(operaType) {
    $('#ctlBtn').trigger('click');
    var uploadCount = $('.upload-pole', document).length;
    var fileCount = $('.file-count').val();

    if (uploadCount === Number(fileCount)) {
        switch (operaType) {
            case 'ADD':
                addPole(); //添加支柱
                break;
            case 'UPDATE':
                updatePole(); //修改支柱
                break;
        }
    } else {
        switch (operaType) {
            case 'ADD':
                setTimeout('eventSavePole("ADD")', 1000); //添加支柱
                break;
            case 'UPDATE':
                setTimeout('eventSavePole("UPDATE")', 1000); //修改支柱
                break;
        }
    }
}

/*/*
 * @desc 修改支柱
 * @param 无
 * @return 无
 */
function updatePole() {
    //ajax提交form表单的方式
    newSupportNum = $('#support-tab > li').length - 1;
    newLocationNum = $('#location-tab > li').length - 1;
    var _url = '/Common/MFoundation/RemoteHandlers/PoleControl.ashx?type=update&id=' + GetQueryString('id') + '&newSupportNum=' + newSupportNum + '&newLocationNum=' + newLocationNum;
    var options = {
        beforeSubmit: validateForm,
        url: _url,
        type: 'post',
        async: false,
        cache: false,
        dataType: 'json',
        success: function (result) {
            var json = result;
            var info = '';
            var strPole = '';
            var strSupport = '';
            var strLocation = '';
            if ('1' === json.POLE_EXIST) { //POLE_EXIST（1:存在，-1:不存在）
                ymPrompt.errorInfo('该支柱号已存在，请重新填写支柱号', null, null, '提示信息', function (mes) {
                    if (mes == 'ok') {
                        return;
                    }
                });
            } else {
                if ('1' === json.POLE_RESULT && '2' === json.POLE_SPTD_RESULT && '3' === json.POLE_LOCATOR) {
                    strPole = '支柱修改成功';
                    strSupport = '支撑装置修改成功';
                    strLocation = '定位装置修改成功';
                    info = strPole + '<br />' + strSupport + '<br />' + strLocation;
                    ymPrompt.succeedInfo(info, null, null, '提示信息', function (mes) {
                        if (mes == 'ok') {
                            location.reload();
                        }
                    });
                } else {
                    if ('1' === json.POLE_RESULT) {
                        strPole = '支柱修改成功';
                    } else {
                        strPole = '支柱修改失败';
                    }
                    if ('2' === json.POLE_SPTD_RESULT) {
                        strSupport = '支撑装置修改成功';
                    } else if ('-2' === json.POLE_SPTD_RESULT) {
                        strSupport = '支撑装置修改失败';
                    } else {
                        strSupport = '';
                    }
                    if ('3' === json.POLE_LOCATOR) {
                        strLocation = '定位装置修改成功';
                    } else if ('-3' === json.POLE_LOCATOR) {
                        strLocation = '定位装置修改失败';
                    } else {
                        strLocation = '';
                    }
                    info = strPole + '<br />' + strSupport + '<br />' + strLocation;
                    ymPrompt.errorInfo(info, null, null, '提示信息', function (mes) {
                        if (mes == 'ok') {
                            return;
                        }
                    });
                }
            }
        },
        error: function (xhr) {
            console.log('请求出错：'+ xhr);
        }
    };
    $('#pole-form').ajaxSubmit(options);
}

/*/*
 * @desc 添加支柱
 * @param 无
 * @return 无
 */
function addPole() {
    //ajax提交form表单的方式
    var _url = '/Common/MFoundation/RemoteHandlers/PoleControl.ashx?type=add&newSupportNum=' + newSupportNum + '&newLocationNum=' + newLocationNum;
    var options = {
        beforeSubmit: validateForm,
        url: _url,
        type: 'post',
        dataType: 'json',
        async: false,
        cache: false,
        success: function (result) {
            var json = result;
            var info = '';
            var strPole = '';
            var strSupport = '';
            var strLocation = '';
            if ('1' === json.POLE_EXIST) { //POLE_EXIST（1:存在，-1:不存在）
                ymPrompt.errorInfo('该支柱号已存在，请重新填写支柱号', null, null, '提示信息', function (mes) {
                    if (mes == 'ok') {
                        return;
                    }
                });
            } else {
                if ('1' === json.POLE_RESULT && '2' === json.POLE_SPTD_RESULT && '3' === json.POLE_LOCATOR) {
                    strPole = '支柱添加成功';
                    strSupport = '支撑装置添加成功';
                    strLocation = '定位装置添加成功';
                    info = strPole + '<br />' + strSupport + '<br />' + strLocation;
                    ymPrompt.succeedInfo(info, null, null, '提示信息', function (mes) {
                        if (mes == 'ok') {
                            location.reload();
                        }
                    });
                } else {
                    if ('1' === json.POLE_RESULT) {
                        strPole = '支柱添加成功';
                    } else {
                        strPole = '支柱添加失败';
                    }
                    if ('2' === json.POLE_SPTD_RESULT) {
                        strSupport = '支撑装置添加成功';
                    } else if ('-2' === json.POLE_SPTD_RESULT) {
                        strSupport = '支撑装置添加失败';
                    } else {
                        strSupport = '';
                    }
                    if ('3' === json.POLE_LOCATOR) {
                        strLocation = '定位装置添加成功';
                    } else if ('-3' === json.POLE_LOCATOR) {
                        strLocation = '定位装置添加失败';
                    } else {
                        strLocation = '';
                    }
                    info = strPole + '<br />' + strSupport + '<br />' + strLocation;
                    ymPrompt.errorInfo(info, null, null, '提示信息', function (mes) {
                        if (mes == 'ok') {
                            return;
                        }
                    });
                }
            }
        },
        error: function (xhr) {
            console.log('请求出错：' + xhr);
        }
    };
    $('#pole-form').ajaxSubmit(options);
}

/*/*
 * @desc 设置页面标题
 * @param title：页面名称
 * @param titleClass：标题的样式名
 * @return 无
 */
function setPageTitle(title, titleClass) {
    $(document).attr('title', title);
    $('.main-title .title-txt').html(title).addClass(titleClass);
}

/*/*
 * @desc 添加装置
 * @param deviceType：装置类型
 * @param name：装置名称
 * @return 无
 */
function eventAddDevice(deviceType, name) {
    $('.j-add-tab-' + deviceType).click(function () { //新增tab
        var tabNum = $('#' + deviceType + '-tab > li').length + 1;

        //新增tab
        $('#' + deviceType + '-tab > li:eq(0)').clone(true).insertAfter('#' + deviceType + '-tab > li:last-child').addClass('cur-tab').siblings().removeClass('cur-tab');
        $('#' + deviceType + '-tab > li:last-child > .tab').html(name + tabNum);
        $('#' + deviceType + '-tab > li:last-child > .close-tab').css('display', 'inline-block');

        //新增表格
        $('#' + deviceType + '-container > ul:eq(0)').clone(true).insertAfter('#' + deviceType + '-container > ul:last-child').show().siblings().hide();
        var tabNewNum = $('#' + deviceType + '-tab > li').length - 1;
        var tableInput = $('#' + deviceType + '-container > ul:last-child input');
        var tableSelect = $('#' + deviceType + '-container > ul:last-child select');
        for (var i = 0; i < tableInput.length; i++) {
            $(tableInput[i]).attr('name', 'new_' + deviceType + '-' + tabNewNum + '-' + tableInput[i].name).attr('id', 'new_' + deviceType + '-' + tabNewNum + '-' + tableInput[i].id).val('');
        }
        for (var i = 0; i < tableSelect.length; i++) {
            $(tableSelect[i]).attr('name', 'new_' + deviceType + '-' + tabNewNum + '-' + tableSelect[i].name).attr('id', 'new_' + deviceType + '-' + tabNewNum + '-' + tableSelect[i].id).val('');
        }

        if ('support' === deviceType) {
            newSupportNum = tabNewNum;
            //$(this).html('添加支撑装置' + (tabNum + 1));
        }
        if ('location' === deviceType) {
            newLocationNum = tabNewNum;
            //$(this).html('添加定位装置' + (tabNum + 1));
        }
    });

    eventToggleTab(deviceType); //切换tab标签
    eventDelTab(deviceType); //关闭tab标签
}


/*/*
 * @desc 切换tab标签
 * @param deviceType：装置类型
 * @return 无
 */
function eventToggleTab(deviceType) {
    $('.j-' + deviceType + '-tab > li > .tab').click(function () { //tab切换
        var i = $(this).parent().index(); //下标第一种写法
        //var i = $('tit').index(this); //下标第二种写法
        $(this).parent().addClass('cur-tab').siblings().removeClass('cur-tab');
        $('#' + deviceType + '-container > ul').eq(i).show().siblings().hide();
    });
}

/*/*
 * @desc 删除tab标签
 * @param deviceType：装置类型
 * @return 无
 */
function eventDelTab(deviceType) {
    $('.j-close-' + deviceType + '-tab').click(function (e) { //删除新增的tab
        var i = $(this).parent().index(); //获取下标
        var prevI = $(this).parent().prev().index(); //获取下标

        $('#' + deviceType + '-tab > li').eq(i).remove();
        $('#' + deviceType + '-tab > li').eq(prevI).addClass('cur-tab').siblings().removeClass('cur-tab');

        //$('#' + deviceType + '-container > ul').eq(i).remove();
        $('#' + deviceType + '-container > ul:last-child').remove();
        $('#' + deviceType + '-container > ul').eq(prevI).show().siblings().hide();

        var tabNum = $('#' + deviceType + '-tab > li').length - 1;
        if ('support' === deviceType) {
            newSupportNum = tabNum;
            //$('.j-add-tab-' + deviceType).html('添加支撑装置' + (tabNum + 1));
            //for (var t = 1; t < tabNum; t++) {
            //    $('#' + deviceType + '-tab > li').eq(t).find('.tab').html('支撑装置' + (t+1));
            //}
        }
        if ('location' === deviceType) {
            newLocationNum = tabNum;
            //$('.j-add-tab-' + deviceType).html('添加定位装置' + (tabNum + 1));
            //for (var j = 1; j < tabNum; j++) {
            //    $('#' + deviceType + '-tab > li').eq(j).find('.tab').html('定位装置' + (j + 1));
            //}
        }
        e.stopPropagation();
    });
}

/*/*
 * @desc 添加装置标签页
 * @param deviceType：装置类型
 * @param name：装置名称
 * @param tabNewNum：tab数量
 * @param infoType：值类型
 * @return 无
 */
function addDeviceTab(deviceType, name, tabNewNum, infoType) {
    for (var k = 1; k <= tabNewNum; k++) {
        var tabNum = $('#' + deviceType + '-tab > li').length + 1;

        //新增tab
        $('#' + deviceType + '-tab > li:eq(0)').clone(true).insertAfter('#' + deviceType + '-tab > li:last-child');
        $('#' + deviceType + '-tab > li:eq(0)').addClass('cur-tab').siblings().removeClass('cur-tab');
        $('#' + deviceType + '-tab > li:last-child > .tab').html(name + tabNum);
        $('#' + deviceType + '-tab > li:last-child > .close-tab').css('display', 'inline-block');

        //新增表格
        $('#' + deviceType + '-container > ul:eq(0)').clone(true).insertAfter('#' + deviceType + '-container > ul:last-child');
        $('#' + deviceType + '-container > ul:eq(0)').show().siblings().hide();
        if ('detail' === infoType) {
            var tableSpan = $('#' + deviceType + '-container > ul:last-child span');
            var tableInput = $('#' + deviceType + '-container > ul:last-child input');
            for (var i = 0; i < tableSpan.length; i++) {
                $(tableSpan[i]).attr('name', 'new_' + deviceType + '-' + k + '-' + $(tableSpan[i]).attr('name')).attr('id', 'new_' + deviceType + '-' + k + '-' + tableSpan[i].id).html('');
            }
            for (var i = 0; i < tableInput.length; i++) {
                $(tableInput[i]).attr('name', 'new_' + deviceType + '-' + k + '-' + tableInput[i].name).attr('id', 'new_' + deviceType + '-' + k + '-' + tableInput[i].id).val('');
            }
        } else {
            var tableInput = $('#' + deviceType + '-container > ul:last-child input');
            var tableSelect = $('#' + deviceType + '-container > ul:last-child select');
            for (var i = 0; i < tableInput.length; i++) {
                $(tableInput[i]).attr('name', 'new_' + deviceType + '-' + k + '-' + tableInput[i].name).attr('id', 'new_' + deviceType + '-' + k + '-' + tableInput[i].id).val('');
            }
            for (var i = 0; i < tableSelect.length; i++) {
                $(tableSelect[i]).attr('name', 'new_' + deviceType + '-' + k + '-' + tableSelect[i].name).attr('id', 'new_' + deviceType + '-' + k + '-' + tableSelect[i].id).val('');
            }
        }
    }
}

/*/*
 * @desc 验证字段
 * @param 无
 * @return 无
 */
function validFiled() {
    validSelect('#line_code', '请选择线路');
    validSelect('#position_code', '请选择区站');
    validSelect('#pole_direction', '请选择行别');
    validPole();

    validInput('.only-number', '', 'number', true); 
    validInput('.only-round-number', '', 'round-number', true);
}

/*/*
 * @desc 验证表单特定字段
 * @param 无
 * @return 无
 */
function validateForm() {
    if ('' === $('#line_code').val()) { ymPrompt.alert('线路不能为空!', null, null, '提示信息', null); $('#line_code').focus().css('border-color', 'red'); return false; } //线路
    if ('' === $('#position_code').val()) { ymPrompt.alert('区站不能为空!', null, null, '提示信息', null); $('#position_code').focus().css('border-color', 'red'); return false; } //区站
    if ('' === $('#pole_direction').val()) { ymPrompt.alert('行别不能为空!', null, null, '提示信息', null); $('#pole_direction').focus().css('border-color', 'red'); return false; } //行别
    if ('' === $('#pole_no').val()) { ymPrompt.alert('支柱号不能为空!', null, null, '提示信息', null); $('#pole_no').focus().css('border-color', 'red'); return false; } //支柱号

    var reg1 = /^-?\d+$/; //整数
    if ('' !== $('#kmstandard').val() && !reg1.test($('#kmstandard').val())) { ymPrompt.alert('请输入整数公里标！', null, null, '提示信息', null); $('#kmstandard').focus().css('border-color', 'red'); return false; } //公里标
    if ('' !== $('#kmstandard').val() && $('#kmstandard').val().length > 7) { ymPrompt.alert('公里标最多7位数！', null, null, '提示信息', null); $('#kmstandard').focus().css('border-color', 'red'); return false; } //公里标
    return true;
}

/*/*
 * @desc 验证支柱号是否存在
 * @param 无
 * @return 无
 */
function validPole() {
    //$('#pole_no').focus(function (e) {
    //    var i = 0;
    //    var _this = $(this);
    //    var _val = _this.val();
    //    if ('' === _val || null === _val || undefined === _val || 'undefined' === _val) {
    //        validTip(_this, '请填写支柱号');
    //        return;
    //    } else {
    //        layer.closeAll();
    //        setTimeout(function () {
    //            if (i > 2) {
    //                return;
    //            } else {
    //                var re = verifyPole();
    //                if ('1' === re) { //1，存在
    //                    validTip(_this, '该支柱号已存在，请重新填写支柱号');
    //                    i++;
    //                    return;
    //                }
    //                if ('-1' === re) { //-1，不存在
    //                    //_this.blur();
    //                    layer.closeAll();
    //                    i++;
    //                    return;
    //                }
    //            }
    //        }, 800);
    //        return;
    //    }
    //}).blur(function(){
    //    return;
    //});

    $('#pole_no').focusout(function (e) {
        var _this = $(this);
        var _val = _this.val();
        layer.closeAll();
        if ('' === _val || null === _val || undefined === _val || 'undefined' === _val) {
            validTip(_this, '请填写支柱号');
            return;
        } else {
            var re = verifyPole();
            if ('1' === re) { //1，存在；-1，不存在
                validTip(_this, '该支柱号已存在，请重新填写支柱号');
            }
        }
    });
}

/*/*
 * @desc 控件值改变时验证
 * @param id：被验证的元素('#test')
 * @param string：提示语
 * @param conType：内容类型（不传值则默认验证此字段不为空。要验证其他类型时，传入number验证为整数或小数）
 * @param findId：查找元素的id，用于绑定提示控件（true,false）
 * @return 无
 */
function validInput(id, string, conType, findId) {
    //$(id).change(function () {
    //    var _this = $(this);
    //    var _val = _this.val();
    //    var _code = _this.attr('code');
    //    if ('' === _val || null === _val || undefined === _val || 'undefined' === _val) {
    //        validTip(id, string, time, direction);
    //    }
    //});

    $(id).change(function (e) {
        var _this = $(this);
        var _val = _this.val();
        var _code = _this.attr('code');
        if (undefined === conType) {
            if ('' === _val || null === _val || undefined === _val || 'undefined' === _val) {
                if ('#pole_no' === id) {
                    string = '请填写支柱号';
                }
                validTip(id, string);
            } else {
                layer.closeAll();
            }
        } else {
            if ('number' === conType) {
                var reg1 = /^-?\d+$/; //整数
                var reg2 = /^-?\d+\.\d+$/; //小数
                if (('' !== _val && reg1.test(_val)) || ('' !== _val && reg2.test(_val))) {
                    layer.closeAll();
                } else {
                    if ('' !== _val) {
                        if (findId) {
                            id = '#' + $(this).attr('id');
                        }
                        validTip(id, '请输入整数或小数');
                    }
                }
            } else if ('round-number' === conType) {
                var reg1 = /^-?\d+$/; //整数
                if ('' !== _val && reg1.test(_val) && _val.length <= 7) {
                    layer.closeAll();
                } else {
                    if ('' !== _val) {
                        if (findId) {
                            id = '#' + $(this).attr('id');
                        }
                        if (_val.length > 7) {
                            layer.closeAll();
                            validTip(id, '公里标最多7位数');
                        } else {
                            layer.closeAll();
                            validTip(id, '请输入整数');
                        }
                    }
                }
            } else {
                layer.closeAll();
            } 
        }
    }).keyup(function () {
        $(this).triggerHandler('change');//keyup和focus利用triggerHandler来触发blur事件
    }).focus(function () {
        $(this).triggerHandler('change');
    });
}

    /*/*
     * @desc 控件值改变时验证
     * @param id：被验证的元素('#test')
     * @param string：提示语
     * @param time：关闭提示框的延迟时间('100')
     * @param direction：提示框显示的位置
     * @return 无
     */
    function validSelect(id, string, direction, time) {
        $(id).blur(function () {
            var _this = $(this);
            var _val = _this.val();
            var _code = _this.attr('code');
            if (_this.find('option').length > 1) {
                if ('0' === _val || '' === _val || null === _val || undefined === _val || 'undefined' === _val) {
                    validTip(id, string, direction, time);
                } else {
                    //addCookie('U_' + id.split('#')[1], _val, 0.1, '');
                    layer.closeAll();
                }
            }
        }).keyup(function () {
            $(this).triggerHandler('blur');//keyup和focus利用triggerHandler来触发blur事件
        }).focus(function () {
            $(this).triggerHandler('blur');
        });
    }

    /*/*
     * @desc 初始化线路、区站、桥隧联动下拉控件
     * @param lineId：线路id
     * @param positionId：区站id
     * @param bridgeId：桥隧id
     * @param lineNameId：线路名称id
     * @param positionNameId：区站名称id
     * @param bridgeNameId：桥隧名称id
     * @return 无
     */
    function initLineSelect(lineId, positionId, bridgeId, lineNameId, positionNameId, bridgeNameId) {
        var _nullOption = '<option value="">请选择</option>';
        $(lineId).mySelect({ //加载线路
            tag: 'Line',
            callback: function (rs) {
                $(lineId + ' option:eq(0)').html('请选择').val('');
            }
        }).change(function () { //线路改变
            var lineCode = $(this).val();
            var lineOption = $(this).find('option');
            var lineName = '';
            for (var i = 0; i < lineOption.length; i++) {
                if (lineOption[i].value === lineCode) {
                    lineName = lineOption[i].innerHTML;
                }
            }
            $(lineNameId).val(lineName);
            if ('' === lineCode) {
                $(positionId).html(_nullOption);
                $(bridgeId).html(_nullOption);
            } else {
                $(positionId).mySelect({ //加载区站
                    tag: 'StationSection',
                    code: lineCode,
                    callback: function (rs) {
                        $(positionId + ' option:eq(0)').html('请选择').val('');
                        $(bridgeId).html(_nullOption);
                    }
                }).change(function () { //区站改变
                    var positionCode = $(this).val();
                    var positionOption = $(this).find('option');
                    var positionName = '';
                    for (var i = 0; i < positionOption.length; i++) {
                        if (positionOption[i].value === positionCode) {
                            positionName = positionOption[i].innerHTML;
                        }
                    }
                    $(positionNameId).val(positionName);
                    if ('' === positionCode) {
                        $(bridgeId).html(_nullOption);
                    } else {
                        $(bridgeId).mySelect({ //加载桥隧
                            tag: 'BridgeTune',
                            code: positionCode,
                            callback: function (rs) {
                                $(bridgeId + ' option:eq(0)').html('请选择').val('');
                            }
                        }).change(function () {
                            var bridgeCode = $(this).val();
                            var bridgeOption = $(this).find('option');
                            var bridgeName = '';
                            for (var i = 0; i < bridgeOption.length; i++) {
                                if (bridgeOption[i].value === bridgeCode) {
                                    bridgeName = bridgeOption[i].innerHTML;
                                }
                            }
                            $(bridgeNameId).val(bridgeName);
                        });
                    }
                });
            }
        });
    }

    /*/*
     * @desc 初始化局、段、车间、工区联动下拉控件
     * @param jId：局id
     * @param dId：段id
     * @param cId：车间id
     * @param gId：工区id
     * @param jNameId：局名称id
     * @param dNameId：段名称id
     * @param cNameId：车间名称id
     * @param gNameId：工区名称id
     * @return 无
     */
    function initOrgSelect(jId, dId, cId, gId, jNameId, dNameId, cNameId, gNameId) {
        var _nullOption = '<option value="">请选择</option>';
        $(jId).mySelect({
            tag: 'Organization',
            code: 'TOPBOSS',
            type: 'J',
            callback: function (rs) {
                $(jId + ' option:eq(0)').html('请选择').val('');
            }
        }).change(function () {
            if (!jId) { return; }
            var jcode = $(this).val();
            var jOption = $(this).find('option');
            var jName = '';
            for (var i = 0; i < jOption.length; i++) {
                if (jOption[i].value === jcode) {
                    jName = jOption[i].innerHTML;
                }
            }
            $(jNameId).val(jName);
            if (jcode == '') {
                $(dId).html(_nullOption);
                $(cId).html(_nullOption);
                $(gId).html(_nullOption);
            } else {
                $(dId).mySelect({
                    tag: 'Organization',
                    code: jcode,
                    type: 'GDD',
                    callback: function (rs) {
                        $(dId + ' option:eq(0)').html('请选择').val('');
                        $(cId).html(_nullOption);
                        $(gId).html(_nullOption);
                    }
                }).change(function () {
                    if (!dId) { return; }
                    var dcode = $(this).val();
                    var dOption = $(this).find('option');
                    var dName = '';
                    for (var i = 0; i < dOption.length; i++) {
                        if (dOption[i].value === dcode) {
                            dName = dOption[i].innerHTML;
                        }
                    }
                    $(dNameId).val(dName);
                    if (dcode == '') {
                        $(cId).html(_nullOption);
                        $(gId).html(_nullOption);
                    } else {
                        $(cId).mySelect({
                            tag: 'Organization',
                            code: dcode,
                            callback: function (rs) {
                                $(cId + ' option:eq(0)').html('请选择').val('');
                                $(gId).html(_nullOption);
                            }
                        }).change(function () {
                            if (!cId) { return; }
                            var ccode = $(this).val();
                            var cOption = $(this).find('option');
                            var cName = '';
                            for (var i = 0; i < cOption.length; i++) {
                                if (cOption[i].value === ccode) {
                                    cName = cOption[i].innerHTML;
                                }
                            }
                            $(cNameId).val(cName);
                            if (ccode == '') {
                                $(gId).html(_nullOption);
                            } else {
                                $(gId).mySelect({
                                    tag: 'Organization',
                                    code: ccode,
                                    callback: function (rs) {
                                        $(gId + ' option:eq(0)').html('请选择').val('');
                                    }
                                }).change(function () {
                                    if (!gId) { return; }
                                    var gcode = $(this).val();
                                    var gOption = $(this).find('option');
                                    var gName = '';
                                    for (var i = 0; i < gOption.length; i++) {
                                        if (gOption[i].value === gcode) {
                                            gName = gOption[i].innerHTML;
                                        }
                                    }
                                    $(gNameId).val(gName);
                                });
                            }
                        });
                    }
                });
            }
        });
    };


    /*/*
     * @desc 初始化线路
     * @param lineId：线路id
     * @param positionId：区站id
     * @param bridgeId：桥隧id
     * @return 无
     */
    function initLineTree(lineId, positionId, bridgeId) {
        $(lineId).mySelectTree({ //线路
            tag: 'Line',
            enableCheck: true,
            chkboxType: { 'Y': 's', 'N': 's' },
            nocheck: true,
            height: 250,
            enableFilter: true,
            filterNumber: 2,
            onCheck: function (event, treeId, treeNode) {
                var zTree = $.fn.zTree.getZTreeObj(treeId),
                nodes = zTree.getCheckedNodes(true),
                    v = '', code = '';
                for (var i = 0, l = nodes.length; i < l; i++) {
                    v += nodes[i].name + ',';
                    code += nodes[i].id + ',';
                }
                if (v.length > 0) v = v.substring(0, v.length - 1);
                if (code.length > 0) code = code.substring(0, code.length - 1);
                var cityObj = $(lineId);
                cityObj.attr('value', v).attr('code', code).attr('treetype', 'LINE');
                initPositionTree(lineId, positionId, bridgeId); //线路改变
            },
            onClick: function (event, treeId, treeNode) {
                var treeObj = $.fn.zTree.getZTreeObj(treeId);
                treeObj.checkAllNodes(false);
                $(lineId).attr('value', '');
                $(lineId).val(treeNode.name).attr({ 'code': treeNode.id, 'treetype': treeNode.treeType });
                initPositionTree(lineId, positionId, bridgeId); //线路改变
            }
        });
    }

    /*/*
     * @desc 初始化区站
     * @param lineId：线路id
     * @param positionId：区站id
     * @param bridgeId：桥隧id
     * @return 无
     */
    function initPositionTree(lineId, positionId, bridgeId) {
        var lineCode = $(lineId).attr('code');
        $(positionId).mySelectTree({ //区站控件
            tag: 'LINE_FILTER',
            codeType: lineCode,
            enableCheck: true,
            chkboxType: { 'Y': 's', 'N': 's' },
            nocheck: true,
            height: 250,
            enableFilter: true,
            filterNumber: 2,
            onCheck: function (event, treeId, treeNode) {
                var zTree = $.fn.zTree.getZTreeObj(treeId),
                nodes = zTree.getCheckedNodes(true),
                    v = '', code = '';
                for (var i = 0, l = nodes.length; i < l; i++) {
                    v += nodes[i].name + ',';
                    code += nodes[i].id + ',';
                }
                if (v.length > 0) v = v.substring(0, v.length - 1);
                if (code.length > 0) code = code.substring(0, code.length - 1);
                var cityObj = $(positionId);
                cityObj.attr('value', v).attr('code', code).attr('treetype', 'position');
                initBridgeTree(lineId, positionId, bridgeId); //区站改变
            },
            onClick: function (event, treeId, treeNode) {
                var treeObj = $.fn.zTree.getZTreeObj(treeId);
                treeObj.checkAllNodes(false);
                $(positionId).attr('value', '');
                $(positionId).val(treeNode.name).attr({ 'code': treeNode.id, 'treetype': treeNode.treeType });
                initBridgeTree(lineId, positionId, bridgeId); //区站改变
            }
        });
    }

    /*/*
     * @desc 初始化桥隧
     * @param lineId：线路id
     * @param positionId：区站id
     * @param bridgeId：桥隧id
     * @return 无
     */
    function initBridgeTree(lineId, positionId, bridgeId) {
        var positionCode = $(positionId).attr('code');
        $(bridgeId).mySelectTree({ //桥隧控件
            tag: 'BridgeTune',
            codeType: positionCode,
            enableCheck: true,
            chkboxType: { 'Y': 's', 'N': 's' },
            nocheck: true,
            height: 250,
            enableFilter: true,
            filterNumber: 2,
            onCheck: function (event, treeId, treeNode) {
                var zTree = $.fn.zTree.getZTreeObj(treeId),
                nodes = zTree.getCheckedNodes(true),
                    v = '', code = '';
                for (var i = 0, l = nodes.length; i < l; i++) {
                    v += nodes[i].name + ',';
                    code += nodes[i].id + ',';
                }
                if (v.length > 0) v = v.substring(0, v.length - 1);
                if (code.length > 0) code = code.substring(0, code.length - 1);
                var cityObj = $(bridgeId);
                cityObj.attr('value', v).attr('code', code).attr('treetype', 'bridge');
            },
            onClick: function (event, treeId, treeNode) {
                var treeObj = $.fn.zTree.getZTreeObj(treeId);
                treeObj.checkAllNodes(false);
                $(bridgeId).attr('value', '');
                $(bridgeId).val(treeNode.name).attr({ 'code': treeNode.id, 'treetype': treeNode.treeType });
            }
        });
    }


    /*/*
     * @desc 选择部件
     * @param 无
     * @return 无
     */
    function eventCheckUnit() {
        $('.j-check-unit li').click(function () {
            var _this = $(this);
            if (!_this.hasClass('check-li')) {
                _this.addClass('check-li');
                _this.children('input').val('1');
                return;
            }
            if (_this.hasClass('check-li')) {
                _this.removeClass('check-li');
                _this.children('input').val('0');
                return;
            }
            //$(this).toggleClass('check-li');
        });
    }

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

    /**
     * @desc  验证提示
     * @param id：被验证的元素('#test')
     * @param string：提示语
     * @param time：关闭提示框的延迟时间('100')
     * @param direction：提示框显示的位置
     * @return 无
     */
    function validTip(id, string, direction, time) {
        //小tips
        var number = 1;
        if (undefined === direction || 'top' === direction) {
            number = 1;
        }
        if ('right' === direction) {
            number = 2;
        }
        if ('bottom' === direction) {
            number = 3;
        }
        if ('left' === direction) {
            number = 4;
        }
        if (undefined === time) {
            time = '';
        }
        var index = layer.tips(string, id, {
            tips: [number, '#488cb4'],
            time: time
        });
        return index;
    }

    //根据屏幕大小移动节点，布局结构
    $(function () {
        var _w = $(window).width();
        var _h = $(window).height();
        //根据屏幕大小移动节点，布局结构
        if (_w < 1441) {
            moveNode($('#pole-profile li:eq(4)'), $('#pole-profile li:eq(5)'));
            moveNode($('#pole-profile li:eq(9)'), $('#pole-profile li:eq(11)'));
            moveNode($('#pole-profile li:eq(14)'), $('#pole-profile li:eq(17)'));
        }
    });


    /*/*
     * @desc 设置支柱信息和支柱属性
     * @param json：对象数据
     * @param valType：值类型
     * @return 无
     */
    function setPoleInfoAndProfile(json, valType) {
        if ('detail' === valType) {
            //基础信息
            $('#pole-img').attr('src', ('' === json.POLE_IMG || undefined === json.POLE_IMG ? '/Common/MFoundation/css/img/pole.png' : json.POLE_IMG)); //支柱图
            $('#line_name').html(json.LINE_NAME); //线路
            $('#position_name').html(json.POSITION_NAME); //区站
            $('#brg_tun_name').html(json.BRG_TUN_NAME); //桥隧
            $('#pole_direction').html(json.POLE_DIRECTION); //行别
            $('#pole_no').html(json.POLE_NO).attr('device-id', json.POLE_CODE); //支柱号
            $('#kmstandard').html(json.KMSTANDARD_K); //公里标  KMSTANDARD
            $('#bureau_name').html(json.BUREAU_NAME); //铁路局
            $('#power_section_name').html(json.POWER_SECTION_NAME); //供电段
            $('#workshop_name').html(json.WORKSHOP_NAME); //车间
            $('#org_name').html(json.ORG_NAME); //工区

            //支柱属性
            $('#md_code').html(json.MD_CODE); //锚段号 
            $('#track_code').html(json.TRACK_CODE); //股道 
            $('#pole_type').html(json.POLE_TYPE); //支柱类型
            $('#pole_mdl').html(json.POLE_MDL); //支柱型号
            $('#pole_usage').html(json.POLE_USAGE); //支柱用途
            $('#install_img_no').html(json.INSTALL_IMG_NO); //接触悬挂安装图号 
            $('#mtr_qlt').html(json.MTR_QLT); //支柱材质
            $('#span_length').html(json.SPAN_LENGTH); //跨距
            $('#curve_radius').html(json.CURVE_RADIUS); //曲线半径
            $('#side_limit_cx').html(json.SIDE_LIMIT_CX); //侧面界限
            $('#railface_high').html(json.RAILFACE_HIGH); //外轨超高
            $('#add_img_no').html(json.ADD_IMG_NO); //附加悬挂安装图号 
            $('#pole_bsc_sts').html(json.POLE_BSC_STS); //基础状态
            $('#pole_basic_type').html(json.POLE_BASIC_TYPE); //基础类型
            $('#pole_status').html(json.POLE_STATUS); //支柱状态
            $('#mnft_fct').html(json.MNFT_FCT); //生产厂家
            $('#comms_date').html(json.COMMS_DATE); //投运日期
            $('#curve_direction').html(json.CURVE_DIRECTION); //直线/曲内/区外 
            $('#prod_date').html(json.PROD_DATE); //出厂日期
            $('#dsgn_life').html(json.DSGN_LIFE); //设计寿命
            $('#aux_jxzq').html(json.AUX_JXZQ); //检修周期
            $('#grnd_sts').html(json.GRND_STS); //地线状态
        } else {
            fullShow();
            //基础信息
            if ('' !== json.POLE_IMG) {
                $('#pole-img').attr('src', json.POLE_IMG).removeClass('hide'); //支柱图
                $('#pole_img').val(json.POLE_IMG);
                $('#upload-pole-img').addClass('hide');
            }
            //$('#line_name').val(json.LINE_NAME); //线路
            $('#line_code').val(json.LINE_CODE).trigger('change'); //线路
            setTimeout(function () {
                //$('#position_name').val(json.POSITION_NAME); //区站
                $('#position_code').val(json.POSITION_CODE).trigger('change'); //区站
                setTimeout(function () {
                    //$('#brg_tun_name').val(json.BRG_TUN_NAME); //桥隧
                    $('#brg_tun_code').val(json.BRG_TUN_CODE); //桥隧
                }, 1200);
            }, 1200);

            $('#pole_direction').val(json.POLE_DIRECTION).attr('code', json.POLE_DIRECTION); //行别
            $('#pole_no').val(json.POLE_NO); //支柱号
            $('#kmstandard').val(json.KMSTANDARD); //公里标

            setTimeout(function () {
                //$('#bureau_name').val(json.BUREAU_NAME); //铁路局
                $('#bureau_code').val(json.BUREAU_CODE).trigger('change'); //铁路局
                setTimeout(function () {
                    //$('#power_section_name').val(json.POWER_SECTION_NAME); //供电段
                    $('#power_section_code').val(json.POWER_SECTION_CODE).trigger('change'); //供电段
                    setTimeout(function () {
                        //$('#workshop_name').val(json.WORKSHOP_NAME); //车间
                        $('#workshop_code').val(json.WORKSHOP_CODE).trigger('change'); //车间
                        setTimeout(function () {
                            //$('#org_name').val(json.ORG_NAME); //工区
                            $('#org_code').val(json.ORG_CODE); //工区
                            fullHide();
                        }, 1200);
                    }, 1200);
                }, 1200);
            }, 1200);

            //支柱属性
            $('#md_code').val(json.MD_CODE); //锚段号 
            $('#track_code').val(json.TRACK_CODE); //股道 
            $('#pole_type').val(json.POLE_TYPE); //支柱类型
            $('#pole_mdl').val(json.POLE_MDL); //支柱型号
            $('#pole_usage').val(json.POLE_USAGE); //支柱用途
            $('#install_img_no').val(json.INSTALL_IMG_NO); //接触悬挂安装图号 
            $('#mtr_qlt').val(json.MTR_QLT); //支柱材质
            $('#span_length').val(json.SPAN_LENGTH); //跨距
            $('#curve_radius').val(json.CURVE_RADIUS); //曲线半径
            $('#side_limit_cx').val(json.SIDE_LIMIT_CX); //侧面界限
            $('#railface_high').val(json.RAILFACE_HIGH); //外轨超高
            $('#add_img_no').val(json.ADD_IMG_NO); //附加悬挂安装图号 
            $('#pole_bsc_sts').val(json.POLE_BSC_STS); //基础状态
            $('#pole_basic_type').val(json.POLE_BASIC_TYPE); //基础类型
            $('#pole_status').val(json.POLE_STATUS); //支柱状态
            $('#mnft_fct').val(json.MNFT_FCT); //生产厂家
            $('#comms_date').val(json.COMMS_DATE); //投运日期
            $('#curve_direction').val(json.CURVE_DIRECTION); //直线/曲内/区外 
            $('#prod_date').val(json.PROD_DATE); //出厂日期
            $('#dsgn_life').val(json.DSGN_LIFE); //设计寿命
            $('#aux_jxzq').val(json.AUX_JXZQ); //检修周期
            $('#grnd_sts').val(json.GRND_STS); //地线状态
        }
    }

    /*/*
     * @desc 设置其他部件选中
     * @param json：对象数据
     * @return 无
     */
    function setUnit(json) {
        ('0' === json.AUX_HAS_BCZZ || '' === json.AUX_HAS_BCZZ ? '' : $('#aux_has_bczz').addClass('check-li')); //补偿装置
        ('0' === json.AUX_HAS_FDJYQ || '' === json.AUX_HAS_FDJYQ ? '' : $('#aux_has_fdjyq').addClass('check-li')); //分段绝缘器
        ('0' === json.AUX_HAS_FXJYQ || '' === json.AUX_HAS_FXJYQ ? '' : $('#aux_has_fxjyq').addClass('check-li')); //分相绝缘器
        ('0' === json.AUX_BE_JCXC || '' === json.AUX_BE_JCXC ? '' : $('#aux_be_jcxc').addClass('check-li')); //处于交叉线岔
        ('0' === json.AUX_BE_LXWJCXC || '' === json.AUX_BE_LXWJCXC ? '' : $('#aux_be_lxwjcxc').addClass('check-li')); //处于两线无交叉线岔
        ('0' === json.AUX_BE_SXWJCXC || '' === json.AUX_BE_SXWJCXC ? '' : $('#aux_be_sxwjcxc').addClass('check-li')); //处于三线无交叉线岔
        ('0' === json.AUX_BE_MDGJSDFX || '' === json.AUX_BE_MDGJSDFX ? '' : $('#aux_be_mdgjsdfx').addClass('check-li')); //处于锚段关节式电分相
        ('0' === json.AUX_HAS_YHK || '' === json.AUX_HAS_YHK ? '' : $('#aux_has_yhk').addClass('check-li')); //硬横跨
        ('0' === json.AUX_HAS_DLJX || '' === json.AUX_HAS_DLJX ? '' : $('#aux_has_dljx').addClass('check-li')); //电连接
        ('0' === json.AUX_HAS_GLKG || '' === json.AUX_HAS_GLKG ? '' : $('#aux_has_glkg').addClass('check-li')); //隔离开关
        ('0' === json.AUX_HAS_BLQ || '' === json.AUX_HAS_BLQ ? '' : $('#aux_has_blq').addClass('check-li')); //避雷器
        ('0' === json.AUX_HAS_DCGYZZ || '' === json.AUX_HAS_DCGYZZ ? '' : $('#aux_has_dcgyzz').addClass('check-li')); //地磁感应装置
        ('0' === json.AUX_HAS_XCBZP || '' === json.AUX_HAS_XCBZP ? '' : $('#aux_has_xcbzp').addClass('check-li')); //行车标志牌
        ('0' === json.AUX_HAS_JDZZ || '' === json.AUX_HAS_JDZZ ? '' : $('#aux_has_jdzz').addClass('check-li')); //接地装置
        ('0' === json.AUX_HAS_XSX || '' === json.AUX_HAS_XSX ? '' : $('#aux_has_xsx').addClass('check-li')); //吸上线
        ('0' === json.AUX_HAS_HLX || '' === json.AUX_HAS_HLX ? '' : $('#aux_has_hlx').addClass('check-li')); //回流线
        ('0' === json.AUX_HAS_GWX || '' === json.AUX_HAS_GWX ? '' : $('#aux_has_gwx').addClass('check-li')); //GW线
        ('0' === json.AUX_HAS_GDX || '' === json.AUX_HAS_GDX ? '' : $('#aux_has_gdx').addClass('check-li')); //供电线
        ('0' === json.AUX_HAS_PWX || '' === json.AUX_HAS_PWX ? '' : $('#aux_has_pwx').addClass('check-li')); //PW线
        ('0' === json.AUX_HAS_AFX || '' === json.AUX_HAS_AFX ? '' : $('#aux_has_afx').addClass('check-li')); //AF线
        ('0' === json.AUX_HAS_JQX || '' === json.AUX_HAS_JQX ? '' : $('#aux_has_jqx').addClass('check-li')); //加强线
        ('0' === json.AUX_HAS_BLZ || '' === json.AUX_HAS_BLZ ? '' : $('#aux_has_blz').addClass('check-li')); //避雷线
        ('0' === json.AUX_HAS_LX || '' === json.AUX_HAS_LX ? '' : $('#aux_has_lx').addClass('check-li')); //拉线
        ('0' === json.AUX_HAS_ZM || '' === json.AUX_HAS_ZM ? '' : $('#aux_has_zm').addClass('check-li')); //中锚
    }

    /*/*
     * @desc 设置支撑装置信息
     * @param jsonData：对象数据
     * @param infoType：值类型
     * @return 无
     */
    function setSupportDeviceInfo(jsonData, infoType) {
        var json = jsonData.SUPPORT;
        var supportPrefix = ''; //支撑装置字段标签id前缀
        addDeviceTab('support', '支撑装置', newSupportNum - 1, infoType); //添加标签
        eventToggleTab('support'); //切换tab标签
        for (var i = 0; i < json.length; i++) {
            if (newSupportNum > 0) {
                if (i > 0) {
                    supportPrefix = 'new_support-' + i + '-';
                }
            }
            if ('detail' === infoType) {
                //支撑装置信息 表一
                $('#' + supportPrefix + 'sptdvc_no').val(json[i].SPTDVC_NO); //支撑装置id
                $('#' + supportPrefix + 'ubmh_num').html(json[i].UBMH_NUM); //上底座安装孔位（数值型）
                $('#' + supportPrefix + 'bspc').html(json[i].BSPC); //底座间距（数值型）
                $('#' + supportPrefix + 'bshs').html(json[i].BSHS); //套管座位置（数值型）
                $('#' + supportPrefix + 'mssgs').html(json[i].MSSGS); //承力索座位置（数值型）
                $('#' + supportPrefix + 'bshc').html(json[i].BSHC); //套管环位置（数值型）
                $('#' + supportPrefix + 'bshse').html(json[i].BSHSE); //φ55套管单耳位置（数值型）
                $('#' + supportPrefix + 'strthg_std').html(json[i].STRTHG_STD); //结构高度(mm) （数值型、标准值）
                $('#' + supportPrefix + 'strthg_msd').html(json[i].STRTHG_MSD); //结构高度(mm) （数值型、实测值）
                $('#' + supportPrefix + 'strthg_sfv').html(json[i].STRTHG_SFV); //结构高度(mm) （数值型、安全值）
                $('#' + supportPrefix + 'arm_len_std').html(json[i].ARM_LEN_STD); //腕臂支撑_长度(mm)（数值型、标准值）
                $('#' + supportPrefix + 'arm_len_msd').html(json[i].ARM_LEN_MSD); //腕臂支撑_长度(mm)（数值型、实测值）
                $('#' + supportPrefix + 'hrm_dmt').html(json[i].HRM_DMT); //平腕臂管_直径(mm)（数值型）
                $('#' + supportPrefix + 'hrm_len_std').html(json[i].HRM_LEN_STD); //平腕臂管_长度(mm)（数值型、标准值）
                $('#' + supportPrefix + 'hrm_len_msd').html(json[i].HRM_LEN_MSD); //平腕臂管_长度(mm)（数值型、实测值）
                $('#' + supportPrefix + 'orm_dmt').html(json[i].ORM_DMT); //斜腕臂管_直径(mm)（数值型）
                $('#' + supportPrefix + 'orm_len_std').html(json[i].ORM_LEN_STD); //斜腕臂管_长度(mm)（数值型、标准值）
                $('#' + supportPrefix + 'orm_len_msd').html(json[i].ORM_LEN_MSD); //斜腕臂管_长度(mm)（数值型、实测值）
                $('#' + supportPrefix + 'ocb_len_std').html(json[i].OCB_LEN_STD); //斜拉线_长度(mm)（数值型、标准值）
                $('#' + supportPrefix + 'ocb_len_msd').html(json[i].OCB_LEN_MSD); //斜拉线_长度(mm)（数值型、实测值）
                $('#' + supportPrefix + 'ocbl_dmt').html(json[i].OCBL_DMT); //斜拉线_线径(mm)（数值型）
                $('#' + supportPrefix + 'astwhrm_std').html(json[i].ASTWHRM_STD); //腕臂支撑管在平腕臂位置（数值型、标准值）
                $('#' + supportPrefix + 'astwhrm_msd').html(json[i].ASTWHRM_MSD); //腕臂支撑管在平腕臂位置（数值型、实测值）
                $('#' + supportPrefix + 'astwhrm_sfv').html(json[i].ASTWHRM_SFV); //腕臂支撑管在平腕臂位置（数值型、安全值）
                $('#' + supportPrefix + 'astworm').html(json[i].ASTWORM); // 腕臂支撑管在斜腕臂位置（数值型）
                $('#' + supportPrefix + 'ipt_hrm_trq_std').html(json[i].IPT_HRM_TRQ_STD); //铁帽压板_平腕臂铁帽压板_紧固力矩(n?m)（数值型、标准值）
                $('#' + supportPrefix + 'ipt_hrm_trq_msd').html(json[i].IPT_HRM_TRQ_MSD); //铁帽压板_平腕臂铁帽压板_紧固力矩(n?m)（数值型、实测值）
                $('#' + supportPrefix + 'ipt_hrm_trq_sfv').html(json[i].IPT_HRM_TRQ_SFV); //铁帽压板_平腕臂铁帽压板_紧固力矩(n?m)（数值型、安全值）
                $('#' + supportPrefix + 'ipt_orm_trq_std').html(json[i].IPT_ORM_TRQ_STD); //铁帽压板_斜腕臂铁帽压板_紧固力矩(n?m)（数值型、标准值）
                $('#' + supportPrefix + 'ipt_orm_trq_msd').html(json[i].IPT_ORM_TRQ_MSD); //铁帽压板_斜腕臂铁帽压板_紧固力矩(n?m)（数值型、实测值）
                $('#' + supportPrefix + 'ipt_orm_trq_sfv').html(json[i].IPT_ORM_TRQ_SFV); //铁帽压板_斜腕臂铁帽压板_紧固力矩(n?m)（数值型、安全值）
                $('#' + supportPrefix + 'cnt_ctp').html(json[i].CNT_CTP); //连接器_开口销
                $('#' + supportPrefix + 'ctns').html(json[i].CTNS); //连接器_本体
                $('#' + supportPrefix + 'rmb_hrm_bmdl').html(json[i].RMB_HRM_BMDL); //腕臂底座_平腕臂底座_螺栓型号
                $('#' + supportPrefix + 'rmb_hrm_trq_std').html(json[i].RMB_HRM_TRQ_STD); //腕臂底座_平腕臂底座_紧固力矩(n?m)（数值型、标准值）
                $('#' + supportPrefix + 'rmb_hrm_trq_msd').html(json[i].RMB_HRM_TRQ_MSD); //腕臂底座_平腕臂底座_紧固力矩(n?m)（数值型、实测值）
                $('#' + supportPrefix + 'rmb_hrm_trq_sfv').html(json[i].RMB_HRM_TRQ_SFV); //腕臂底座_平腕臂底座_紧固力矩(n?m)（数值型、安全值）
                $('#' + supportPrefix + 'rmb_hrm_sopt').html(json[i].RMB_HRM_SOPT); //腕臂底座_平腕臂底座_防松措施
                $('#' + supportPrefix + 'rmb_orm_bmdl').html(json[i].RMB_ORM_BMDL); //腕臂底座_斜腕臂底座_螺栓型号
                $('#' + supportPrefix + 'rmb_orm_trq_std').html(json[i].RMB_ORM_TRQ_STD); //腕臂底座_斜腕臂底座_紧固力矩(n?m)（数值型、标准值）
                $('#' + supportPrefix + 'rmb_orm_trq_msd').html(json[i].RMB_ORM_TRQ_MSD); //腕臂底座_斜腕臂底座_紧固力矩(n?m)（数值型、实测值）
                $('#' + supportPrefix + 'rmb_orm_trq_sfv').html(json[i].RMB_ORM_TRQ_SFV); //腕臂底座_斜腕臂底座_紧固力矩(n?m)（数值型、安全值）
                $('#' + supportPrefix + 'rmb_orm_sopt').html(json[i].RMB_ORM_SOPT); //腕臂底座_斜腕臂底座_防松措施
                //支撑装置信息 表二
                $('#' + supportPrefix + 'armsp_arm_sts').html(json[i].ARMSP_ARM_STS); //腕臂及支撑_腕臂状态_是否良好
                $('#' + supportPrefix + 'armsp_arms_sts').html(json[i].ARMSP_ARMS_STS); //腕臂及支撑_腕臂支撑本体状态_是否良好
                $('#' + supportPrefix + 'armsp_hrm_trq_std').html(json[i].ARMSP_HRM_TRQ_STD); //腕臂及支撑_平腕臂套管单耳_紧固力矩(n?m)（数值型、标准值）
                $('#' + supportPrefix + 'armsp_hrm_trq_msd').html(json[i].ARMSP_HRM_TRQ_MSD); //腕臂及支撑_平腕臂套管单耳_紧固力矩(n?m)（数值型、实测值）
                $('#' + supportPrefix + 'armsp_hrm_trq_sfv').html(json[i].ARMSP_HRM_TRQ_SFV); //腕臂及支撑_平腕臂套管单耳_紧固力矩(n?m)（数值型、安全值）
                $('#' + supportPrefix + 'armsp_orm_trq_std').html(json[i].ARMSP_ORM_TRQ_STD); //腕臂及支撑_斜腕臂套管单耳_紧固力矩(n?m)（数值型、标准值）
                $('#' + supportPrefix + 'armsp_orm_trq_msd').html(json[i].ARMSP_ORM_TRQ_MSD); //腕臂及支撑_斜腕臂套管单耳_紧固力矩(n?m)（数值型、实测值）
                $('#' + supportPrefix + 'armsp_orm_trq_sfv').html(json[i].ARMSP_ORM_TRQ_SFV); //腕臂及支撑_斜腕臂套管单耳_紧固力矩(n?m)（数值型、安全值）
                $('#' + supportPrefix + 'armsp_hrm_twtrq_std').html(json[i].ARMSP_HRM_TWTRQ_STD); //腕臂及支撑_平腕臂双耳套筒_顶丝紧固力矩(n?m)（数值型、标准值）
                $('#' + supportPrefix + 'armsp_hrm_twtrq_msd').html(json[i].ARMSP_HRM_TWTRQ_MSD); //腕臂及支撑_平腕臂双耳套筒_顶丝紧固力矩(n?m)（数值型、实测值）
                $('#' + supportPrefix + 'armsp_hrm_twtrq_sfv').html(json[i].ARMSP_HRM_TWTRQ_SFV); //腕臂及支撑_平腕臂双耳套筒_顶丝紧固力矩(n?m)（数值型、安全值）
                $('#' + supportPrefix + 'armsp_hrm_nttrq_std').html(json[i].ARMSP_HRM_NTTRQ_STD); //腕臂及支撑_平腕臂双耳套筒_备母紧固力矩(n?m)（数值型、标准值）
                $('#' + supportPrefix + 'armsp_hrm_nttrq_msd').html(json[i].ARMSP_HRM_NTTRQ_MSD); //腕臂及支撑_平腕臂双耳套筒_备母紧固力矩(n?m)（数值型、实测值）
                $('#' + supportPrefix + 'armsp_hrm_nttrq_sfv').html(json[i].ARMSP_HRM_NTTRQ_SFV); //腕臂及支撑_平腕臂双耳套筒_备母紧固力矩(n?m)（数值型、安全值）
                $('#' + supportPrefix + 'armsp_armde_sts').html(json[i].ARMSP_ARMDE_STS); //腕臂及支撑_平腕臂双耳套筒_本体状态
                $('#' + supportPrefix + 'armsp_ormde_cpn_std').html(json[i].ARMSP_ORMDE_CPN_STD); //腕臂及支撑_斜腕臂双耳套筒_铜销角度(度)（数值型、标准值）
                $('#' + supportPrefix + 'armsp_ormde_cpn_msd').html(json[i].ARMSP_ORMDE_CPN_MSD); //腕臂及支撑_斜腕臂双耳套筒_铜销角度(度)（数值型、实测值）
                $('#' + supportPrefix + 'armsp_ormde_cpn_sfv').html(json[i].ARMSP_ORMDE_CPN_SFV); //腕臂及支撑_斜腕臂双耳套筒_铜销角度(度)（数值型、安全值）
                $('#' + supportPrefix + 'armsp_ormde_cmp').html(json[i].ARMSP_ORMDE_CMP); //腕臂及支撑_斜腕臂双耳套筒_防松部件
                $('#' + supportPrefix + 'armsp_ormde_trq_std').html(json[i].ARMSP_ORMDE_TRQ_STD); //腕臂及支撑_斜腕臂双耳套筒_紧固力矩(n?m)（数值型、标准值）
                $('#' + supportPrefix + 'armsp_ormde_trq_msd').html(json[i].ARMSP_ORMDE_TRQ_MSD); //腕臂及支撑_斜腕臂双耳套筒_紧固力矩(n?m)（数值型、实测值）
                $('#' + supportPrefix + 'armsp_ormde_trq_sfv').html(json[i].ARMSP_ORMDE_TRQ_SFV); //腕臂及支撑_斜腕臂双耳套筒_紧固力矩(n?m)（数值型、安全值）
                $('#' + supportPrefix + 'armsp_ormdes_sts').html(json[i].ARMSP_ORMDES_STS); //腕臂及支撑_斜腕臂双耳套筒_本体状态
                $('#' + supportPrefix + 'armb_blf_sts').html(json[i].ARMB_BLF_STS); //腕臂底座_螺栓紧固状态
                $('#' + supportPrefix + 'armbs').html(json[i].ARMBS); //腕臂底座_螺栓紧固状态
                $('#' + supportPrefix + 'armb_ctp').html(json[i].ARMB_CTP); //腕臂底座_开口销
                $('#' + supportPrefix + 'armsp_blf_sts').html(json[i].ARMSP_BLF_STS); //腕臂支撑_螺栓紧固状态
                $('#' + supportPrefix + 'armsps').html(json[i].ARMSPS); //腕臂支撑_本体
                $('#' + supportPrefix + 'armsps_ctp').html(json[i].ARMSPS_CTP); //腕臂支撑_开口销
                $('#' + supportPrefix + 'trc_blf_sts').html(json[i].TRC_BLF_STS); //套管铰环_螺栓紧固状态
                $('#' + supportPrefix + 'trc_ctp').html(json[i].TRC_CTP); //套管铰环_开口销
                $('#' + supportPrefix + 'trcde_blf_sts').html(json[i].TRCDE_BLF_STS); //套管双耳_螺栓紧固状态
                $('#' + supportPrefix + 'trcdes').html(json[i].TRCDES); //套管双耳_本体
                $('#' + supportPrefix + 'trcde_ctp').html(json[i].TRCDE_CTP); //套管双耳_开口销
                $('#' + supportPrefix + 'arms_blf_sts').html(json[i].ARMS_BLF_STS); //腕臂本体（含隧道弓型腕臂）_螺栓紧固状态
                $('#' + supportPrefix + 'arms').html(json[i].ARMS); //腕臂本体（含隧道弓型腕臂）_本体
                $('#' + supportPrefix + 'has_cap_std').html(json[i].HAS_CAP_STD); //有无管帽（标准值）
                $('#' + supportPrefix + 'has_cap_msd').html(json[i].HAS_CAP_MSD); //有无管帽（实测值）
                $('#' + supportPrefix + 'oth_arm_mdl').html(json[i].OTH_ARM_MDL); //其他特殊腕臂型式
            } else {
                //支撑装置信息 表一
                $('#' + supportPrefix + 'sptdvc_no').val(json[i].SPTDVC_NO); //支撑装置id
                $('#' + supportPrefix + 'ubmh_num').val(json[i].UBMH_NUM); //上底座安装孔位（数值型）
                $('#' + supportPrefix + 'bspc').val(json[i].BSPC); //底座间距（数值型）
                $('#' + supportPrefix + 'bshs').val(json[i].BSHS); //套管座位置（数值型）
                $('#' + supportPrefix + 'mssgs').val(json[i].MSSGS); //承力索座位置（数值型）
                $('#' + supportPrefix + 'bshc').val(json[i].BSHC); //套管环位置（数值型）
                $('#' + supportPrefix + 'bshse').val(json[i].BSHSE); //φ55套管单耳位置（数值型）
                $('#' + supportPrefix + 'strthg_std').val(json[i].STRTHG_STD); //结构高度(mm) （数值型、标准值）
                $('#' + supportPrefix + 'strthg_msd').val(json[i].STRTHG_MSD); //结构高度(mm) （数值型、实测值）
                $('#' + supportPrefix + 'strthg_sfv').val(json[i].STRTHG_SFV); //结构高度(mm) （数值型、安全值）
                $('#' + supportPrefix + 'arm_len_std').val(json[i].ARM_LEN_STD); //腕臂支撑_长度(mm)（数值型、标准值）
                $('#' + supportPrefix + 'arm_len_msd').val(json[i].ARM_LEN_MSD); //腕臂支撑_长度(mm)（数值型、实测值）
                $('#' + supportPrefix + 'hrm_dmt').val(json[i].HRM_DMT); //平腕臂管_直径(mm)（数值型）
                $('#' + supportPrefix + 'hrm_len_std').val(json[i].HRM_LEN_STD); //平腕臂管_长度(mm)（数值型、标准值）
                $('#' + supportPrefix + 'hrm_len_msd').val(json[i].HRM_LEN_MSD); //平腕臂管_长度(mm)（数值型、实测值）
                $('#' + supportPrefix + 'orm_dmt').val(json[i].ORM_DMT); //斜腕臂管_直径(mm)（数值型）
                $('#' + supportPrefix + 'orm_len_std').val(json[i].ORM_LEN_STD); //斜腕臂管_长度(mm)（数值型、标准值）
                $('#' + supportPrefix + 'orm_len_msd').val(json[i].ORM_LEN_MSD); //斜腕臂管_长度(mm)（数值型、实测值）
                $('#' + supportPrefix + 'ocb_len_std').val(json[i].OCB_LEN_STD); //斜拉线_长度(mm)（数值型、标准值）
                $('#' + supportPrefix + 'ocb_len_msd').val(json[i].OCB_LEN_MSD); //斜拉线_长度(mm)（数值型、实测值）
                $('#' + supportPrefix + 'ocbl_dmt').val(json[i].OCBL_DMT); //斜拉线_线径(mm)（数值型）
                $('#' + supportPrefix + 'astwhrm_std').val(json[i].ASTWHRM_STD); //腕臂支撑管在平腕臂位置（数值型、标准值）
                $('#' + supportPrefix + 'astwhrm_msd').val(json[i].ASTWHRM_MSD); //腕臂支撑管在平腕臂位置（数值型、实测值）
                $('#' + supportPrefix + 'astwhrm_sfv').val(json[i].ASTWHRM_SFV); //腕臂支撑管在平腕臂位置（数值型、安全值）
                $('#' + supportPrefix + 'astworm').val(json[i].ASTWORM); // 腕臂支撑管在斜腕臂位置（数值型）
                $('#' + supportPrefix + 'ipt_hrm_trq_std').val(json[i].IPT_HRM_TRQ_STD); //铁帽压板_平腕臂铁帽压板_紧固力矩(n?m)（数值型、标准值）
                $('#' + supportPrefix + 'ipt_hrm_trq_msd').val(json[i].IPT_HRM_TRQ_MSD); //铁帽压板_平腕臂铁帽压板_紧固力矩(n?m)（数值型、实测值）
                $('#' + supportPrefix + 'ipt_hrm_trq_sfv').val(json[i].IPT_HRM_TRQ_SFV); //铁帽压板_平腕臂铁帽压板_紧固力矩(n?m)（数值型、安全值）
                $('#' + supportPrefix + 'ipt_orm_trq_std').val(json[i].IPT_ORM_TRQ_STD); //铁帽压板_斜腕臂铁帽压板_紧固力矩(n?m)（数值型、标准值）
                $('#' + supportPrefix + 'ipt_orm_trq_msd').val(json[i].IPT_ORM_TRQ_MSD); //铁帽压板_斜腕臂铁帽压板_紧固力矩(n?m)（数值型、实测值）
                $('#' + supportPrefix + 'ipt_orm_trq_sfv').val(json[i].IPT_ORM_TRQ_SFV); //铁帽压板_斜腕臂铁帽压板_紧固力矩(n?m)（数值型、安全值）
                $('#' + supportPrefix + 'cnt_ctp').val(json[i].CNT_CTP); //连接器_开口销
                $('#' + supportPrefix + 'ctns').val(json[i].CTNS); //连接器_本体
                $('#' + supportPrefix + 'rmb_hrm_bmdl').val(json[i].RMB_HRM_BMDL); //腕臂底座_平腕臂底座_螺栓型号
                $('#' + supportPrefix + 'rmb_hrm_trq_std').val(json[i].RMB_HRM_TRQ_STD); //腕臂底座_平腕臂底座_紧固力矩(n?m)（数值型、标准值）
                $('#' + supportPrefix + 'rmb_hrm_trq_msd').val(json[i].RMB_HRM_TRQ_MSD); //腕臂底座_平腕臂底座_紧固力矩(n?m)（数值型、实测值）
                $('#' + supportPrefix + 'rmb_hrm_trq_sfv').val(json[i].RMB_HRM_TRQ_SFV); //腕臂底座_平腕臂底座_紧固力矩(n?m)（数值型、安全值）
                $('#' + supportPrefix + 'rmb_hrm_sopt').val(json[i].RMB_HRM_SOPT); //腕臂底座_平腕臂底座_防松措施
                $('#' + supportPrefix + 'rmb_orm_bmdl').val(json[i].RMB_ORM_BMDL); //腕臂底座_斜腕臂底座_螺栓型号
                $('#' + supportPrefix + 'rmb_orm_trq_std').val(json[i].RMB_ORM_TRQ_STD); //腕臂底座_斜腕臂底座_紧固力矩(n?m)（数值型、标准值）
                $('#' + supportPrefix + 'rmb_orm_trq_msd').val(json[i].RMB_ORM_TRQ_MSD); //腕臂底座_斜腕臂底座_紧固力矩(n?m)（数值型、实测值）
                $('#' + supportPrefix + 'rmb_orm_trq_sfv').val(json[i].RMB_ORM_TRQ_SFV); //腕臂底座_斜腕臂底座_紧固力矩(n?m)（数值型、安全值）
                $('#' + supportPrefix + 'rmb_orm_sopt').val(json[i].RMB_ORM_SOPT); //腕臂底座_斜腕臂底座_防松措施
                //支撑装置信息 表二
                $('#' + supportPrefix + 'armsp_arm_sts').val(json[i].ARMSP_ARM_STS); //腕臂及支撑_腕臂状态_是否良好
                $('#' + supportPrefix + 'armsp_arms_sts').val(json[i].ARMSP_ARMS_STS); //腕臂及支撑_腕臂支撑本体状态_是否良好
                $('#' + supportPrefix + 'armsp_hrm_trq_std').val(json[i].ARMSP_HRM_TRQ_STD); //腕臂及支撑_平腕臂套管单耳_紧固力矩(n?m)（数值型、标准值）
                $('#' + supportPrefix + 'armsp_hrm_trq_msd').val(json[i].ARMSP_HRM_TRQ_MSD); //腕臂及支撑_平腕臂套管单耳_紧固力矩(n?m)（数值型、实测值）
                $('#' + supportPrefix + 'armsp_hrm_trq_sfv').val(json[i].ARMSP_HRM_TRQ_SFV); //腕臂及支撑_平腕臂套管单耳_紧固力矩(n?m)（数值型、安全值）
                $('#' + supportPrefix + 'armsp_orm_trq_std').val(json[i].ARMSP_ORM_TRQ_STD); //腕臂及支撑_斜腕臂套管单耳_紧固力矩(n?m)（数值型、标准值）
                $('#' + supportPrefix + 'armsp_orm_trq_msd').val(json[i].ARMSP_ORM_TRQ_MSD); //腕臂及支撑_斜腕臂套管单耳_紧固力矩(n?m)（数值型、实测值）
                $('#' + supportPrefix + 'armsp_orm_trq_sfv').val(json[i].ARMSP_ORM_TRQ_SFV); //腕臂及支撑_斜腕臂套管单耳_紧固力矩(n?m)（数值型、安全值）
                $('#' + supportPrefix + 'armsp_hrm_twtrq_std').val(json[i].ARMSP_HRM_TWTRQ_STD); //腕臂及支撑_平腕臂双耳套筒_顶丝紧固力矩(n?m)（数值型、标准值）
                $('#' + supportPrefix + 'armsp_hrm_twtrq_msd').val(json[i].ARMSP_HRM_TWTRQ_MSD); //腕臂及支撑_平腕臂双耳套筒_顶丝紧固力矩(n?m)（数值型、实测值）
                $('#' + supportPrefix + 'armsp_hrm_twtrq_sfv').val(json[i].ARMSP_HRM_TWTRQ_SFV); //腕臂及支撑_平腕臂双耳套筒_顶丝紧固力矩(n?m)（数值型、安全值）
                $('#' + supportPrefix + 'armsp_hrm_nttrq_std').val(json[i].ARMSP_HRM_NTTRQ_STD); //腕臂及支撑_平腕臂双耳套筒_备母紧固力矩(n?m)（数值型、标准值）
                $('#' + supportPrefix + 'armsp_hrm_nttrq_msd').val(json[i].ARMSP_HRM_NTTRQ_MSD); //腕臂及支撑_平腕臂双耳套筒_备母紧固力矩(n?m)（数值型、实测值）
                $('#' + supportPrefix + 'armsp_hrm_nttrq_sfv').val(json[i].ARMSP_HRM_NTTRQ_SFV); //腕臂及支撑_平腕臂双耳套筒_备母紧固力矩(n?m)（数值型、安全值）
                $('#' + supportPrefix + 'armsp_armde_sts').val(json[i].ARMSP_ARMDE_STS); //腕臂及支撑_平腕臂双耳套筒_本体状态
                $('#' + supportPrefix + 'armsp_ormde_cpn_std').val(json[i].ARMSP_ORMDE_CPN_STD); //腕臂及支撑_斜腕臂双耳套筒_铜销角度(度)（数值型、标准值）
                $('#' + supportPrefix + 'armsp_ormde_cpn_msd').val(json[i].ARMSP_ORMDE_CPN_MSD); //腕臂及支撑_斜腕臂双耳套筒_铜销角度(度)（数值型、实测值）
                $('#' + supportPrefix + 'armsp_ormde_cpn_sfv').val(json[i].ARMSP_ORMDE_CPN_SFV); //腕臂及支撑_斜腕臂双耳套筒_铜销角度(度)（数值型、安全值）
                $('#' + supportPrefix + 'armsp_ormde_cmp').val(json[i].ARMSP_ORMDE_CMP); //腕臂及支撑_斜腕臂双耳套筒_防松部件
                $('#' + supportPrefix + 'armsp_ormde_trq_std').val(json[i].ARMSP_ORMDE_TRQ_STD); //腕臂及支撑_斜腕臂双耳套筒_紧固力矩(n?m)（数值型、标准值）
                $('#' + supportPrefix + 'armsp_ormde_trq_msd').val(json[i].ARMSP_ORMDE_TRQ_MSD); //腕臂及支撑_斜腕臂双耳套筒_紧固力矩(n?m)（数值型、实测值）
                $('#' + supportPrefix + 'armsp_ormde_trq_sfv').val(json[i].ARMSP_ORMDE_TRQ_SFV); //腕臂及支撑_斜腕臂双耳套筒_紧固力矩(n?m)（数值型、安全值）
                $('#' + supportPrefix + 'armsp_ormdes_sts').val(json[i].ARMSP_ORMDES_STS); //腕臂及支撑_斜腕臂双耳套筒_本体状态
                $('#' + supportPrefix + 'armb_blf_sts').val(json[i].ARMB_BLF_STS); //腕臂底座_螺栓紧固状态
                $('#' + supportPrefix + 'armbs').val(json[i].ARMBS); //腕臂底座_螺栓紧固状态
                $('#' + supportPrefix + 'armb_ctp').val(json[i].ARMB_CTP); //腕臂底座_开口销
                $('#' + supportPrefix + 'armsp_blf_sts').val(json[i].ARMSP_BLF_STS); //腕臂支撑_螺栓紧固状态
                $('#' + supportPrefix + 'armsps').val(json[i].ARMSPS); //腕臂支撑_本体
                $('#' + supportPrefix + 'armsps_ctp').val(json[i].ARMSPS_CTP); //腕臂支撑_开口销
                $('#' + supportPrefix + 'trc_blf_sts').val(json[i].TRC_BLF_STS); //套管铰环_螺栓紧固状态
                $('#' + supportPrefix + 'trc_ctp').val(json[i].TRC_CTP); //套管铰环_开口销
                $('#' + supportPrefix + 'trcde_blf_sts').val(json[i].TRCDE_BLF_STS); //套管双耳_螺栓紧固状态
                $('#' + supportPrefix + 'trcdes').val(json[i].TRCDES); //套管双耳_本体
                $('#' + supportPrefix + 'trcde_ctp').val(json[i].TRCDE_CTP); //套管双耳_开口销
                $('#' + supportPrefix + 'arms_blf_sts').val(json[i].ARMS_BLF_STS); //腕臂本体（含隧道弓型腕臂）_螺栓紧固状态
                $('#' + supportPrefix + 'arms').val(json[i].ARMS); //腕臂本体（含隧道弓型腕臂）_本体
                $('#' + supportPrefix + 'has_cap_std').val(json[i].HAS_CAP_STD); //有无管帽（标准值）
                $('#' + supportPrefix + 'has_cap_msd').val(json[i].HAS_CAP_MSD); //有无管帽（实测值）
                $('#' + supportPrefix + 'oth_arm_mdl').val(json[i].OTH_ARM_MDL); //其他特殊腕臂型式
            }
        }
    }

    /*/*
     * @desc 设置定位装置信息
     * @param jsonData：对象数据
     * @param infoType：值类型
     * @return 无
     */
    function setLocationDeviceInfo(jsonData, infoType) {
        var json = jsonData.LOCATION;
        var locationPrefix = ''; //定位装置字段标签id前缀
        addDeviceTab('location', '定位装置', newLocationNum - 1, infoType); //添加标签
        eventToggleTab('location'); //切换tab标签
        for (var i = 0; i < json.length; i++) {
            if (newLocationNum > 0) {
                if (i > 0) {
                    locationPrefix = 'new_location-' + i + '-';
                }
            }
            if ('detail' === infoType) {
                //定位装置信息 表一
                $('#' + locationPrefix + 'lct_id').val(json[i].LCT_ID); //定位装置id
                $('#' + locationPrefix + 'lctdmt').html(json[i].LCTDMT); //定位管_直径(mm)（数值型）
                $('#' + locationPrefix + 'lcttlen_std').html(json[i].LCTTLEN_STD); //定位管_长度(mm) （数值型、标准值）
                $('#' + locationPrefix + 'lcttlen_msd').html(json[i].LCTTLEN_MSD); //定位管_长度(mm) （数值型、实测值）
                $('#' + locationPrefix + 'lcttlen_sfv').html(json[i].LCTTLEN_SFV); //定位管_长度(mm) （数值型、安全值）
                $('#' + locationPrefix + 'lctt_sts').html(json[i].LCTT_STS); //定位管_螺栓紧固状态
                $('#' + locationPrefix + 'lcttsb').html(json[i].LCTTSB); //定位管_本体
                $('#' + locationPrefix + 'lcttdetwmmt_std').html(json[i].LCTTDETWMMT_STD); //定位管双耳套筒_顶丝_力矩(n?m)（数值型、标准值）
                $('#' + locationPrefix + 'lcttdetwmmt_msd').html(json[i].LCTTDETWMMT_MSD); //定位管双耳套筒_顶丝_力矩(n?m)（数值型、实测值）
                $('#' + locationPrefix + 'lcttdesptnt_msd').html(json[i].LCTTDESPTNT_MSD); //定位管双耳套筒_备母_力矩(n?m)（数值型、标准值）
                $('#' + locationPrefix + 'lcttdes_sts').html(json[i].LCTTDES_STS); //定位管双耳套筒_本体状态
                $('#' + locationPrefix + 'lcttde_lssts').html(json[i].LCTTDE_LSSTS); //定位管双耳套筒_定位管本体状态
                $('#' + locationPrefix + 'lsdeor_tw_mmt_msd').html(json[i].LSDEOR_TW_MMT_MSD); //定位管支撑双耳套筒斜腕臂侧_顶丝_紧固力(n?m)（数值型、标准值）
                $('#' + locationPrefix + 'lsdeor_tw_mmt_std').html(json[i].LSDEOR_TW_MMT_STD); //定位管支撑双耳套筒斜腕臂侧_顶丝_紧固力(n?m)（数值型、实测值）
                $('#' + locationPrefix + 'lsdeor_spnt_mmt_msd').html(json[i].LSDEOR_SPNT_MMT_MSD); //定位管支撑双耳套筒斜腕臂侧_备母_紧固力矩(n?m)（数值型、标准值）
                $('#' + locationPrefix + 'lsdeor_spnt_mmt_std').html(json[i].LSDEOR_SPNT_MMT_STD); //定位管支撑双耳套筒斜腕臂侧_备母_紧固力矩(n?m)（数值型、实测值）
                $('#' + locationPrefix + 'lsdeors_sts').html(json[i].LSDEORS_STS); //定位管支撑双耳套筒斜腕臂侧_本体状态
                $('#' + locationPrefix + 'lsdeltc_tw_mmt_msd').html(json[i].LSDELTC_TW_MMT_MSD); //定位管支撑双耳套筒定位管侧_顶丝_紧固力矩(n?m)（数值型、标准值）
                $('#' + locationPrefix + 'lsdeltc_tw_mmt_std').html(json[i].LSDELTC_TW_MMT_STD); //定位管支撑双耳套筒定位管侧_顶丝_紧固力矩(n?m)（数值型、实测值）
                $('#' + locationPrefix + 'lsdeltc_spnt_mmt_msd').html(json[i].LSDELTC_SPNT_MMT_MSD); //定位管支撑双耳套筒定位管侧_备母_紧固力矩(n?m)（数值型、标准值）
                $('#' + locationPrefix + 'lsdeltc_spnt_mmt_std').html(json[i].LSDELTC_SPNT_MMT_STD); //定位管支撑双耳套筒定位管侧_备母_紧固力矩(n?m)（数值型、实测值）
                $('#' + locationPrefix + 'lsdeltcs_sts').html(json[i].LSDELTCS_STS); //定位管支撑双耳套筒定位管侧_本体状态
                $('#' + locationPrefix + 'lsplen_std').html(json[i].LSPLEN_STD); //定位支撑_长度(mm) （数值型、标准值）
                $('#' + locationPrefix + 'lsplen_msd').html(json[i].LSPLEN_MSD); //定位支撑_长度(mm) （数值型、实测值）
                $('#' + locationPrefix + 'lsplen_sfv').html(json[i].LSPLEN_SFV); //定位支撑_长度(mm) （数值型、安全值）
                $('#' + locationPrefix + 'lctspb_sts').html(json[i].LCTSPB_STS); //定位支撑_螺栓紧固状态
                $('#' + locationPrefix + 'lctspsb').html(json[i].LCTSPSB); //定位支撑_本体
                $('#' + locationPrefix + 'lct_tp').html(json[i].LCT_TP); //定位器类型
                $('#' + locationPrefix + 'lct_slp').html(json[i].LCT_SLP); //定位器坡度(度)
                $('#' + locationPrefix + 'lctblt_sts').html(json[i].LCTBLT_STS); //定位器_螺栓紧固状态
                $('#' + locationPrefix + 'lctsb').html(json[i].LCTSB); //定位器_本体
                $('#' + locationPrefix + 'lcts_sts').html(json[i].LCTS_STS); //定位器_本体状态
                $('#' + locationPrefix + 'lctop').html(json[i].LCTOP); //定位器_开口销
                $('#' + locationPrefix + 'lctlen_std').html(json[i].LCTLEN_STD); //定位器_长度(mm) （数值型、标准值）
                $('#' + locationPrefix + 'lctlen_msd').html(json[i].LCTLEN_MSD); //定位器_长度(mm) （数值型、实测值）
                $('#' + locationPrefix + 'lctlen_sfv').html(json[i].LCTLEN_SFV); //定位器_长度(mm) （数值型、安全值）
                $('#' + locationPrefix + 'lctclrc_std').html(json[i].LCTCLRC_STD); //定位器_止钉间隙(mm) （数值型、标准值）
                $('#' + locationPrefix + 'lctclrc_msd').html(json[i].LCTCLRC_MSD); //定位器_止钉间隙(mm) （数值型、实测值）
                $('#' + locationPrefix + 'lctclrc_sfv').html(json[i].LCTCLRC_SFV); //定位器_止钉间隙(mm) （数值型、安全值）
                $('#' + locationPrefix + 'cnwmmt_std').html(json[i].CNWMMT_STD); //电气连接线_紧固力矩(n?m)（数值型、标准值）
                $('#' + locationPrefix + 'cnwmmt_msd').html(json[i].CNWMMT_MSD); //电气连接线_紧固力矩(n?m)（数值型、实测值）
                $('#' + locationPrefix + 'cnws_sts').html(json[i].CNWS_STS); //电气连接线_本体状态
                $('#' + locationPrefix + 'lct_mdl').html(json[i].LCT_MDL); //定位方式

                //定位装置信息 表二
                $('#' + locationPrefix + 'lcttwharm').html(json[i].LCTTWHARM); //定位管支撑在平腕臂位置
                $('#' + locationPrefix + 'lcttworm').html(json[i].LCTTWORM); //定位管支撑在斜腕臂位置（数值型）
                $('#' + locationPrefix + 'lctwlctt').html(json[i].LCTWLCTT); //定位支撑在定位管位置（数值型）
                $('#' + locationPrefix + 'lctuw').html(json[i].LCTUW); //定位支座u螺栓位置（数值型）
                $('#' + locationPrefix + 'lctspmmt_std').html(json[i].LCTSPMMT_STD); //定位支座_紧固力矩(n?m)（数值型、标准值）
                $('#' + locationPrefix + 'lctspmmt_msd').html(json[i].LCTSPMMT_MSD); //定位支座_紧固力矩(n?m)（数值型、实测值）
                $('#' + locationPrefix + 'lctsps_sts').html(json[i].LCTSPS_STS); //定位支座_本体状态
                $('#' + locationPrefix + 'lctclmpmmt_std').html(json[i].LCTCLMPMMT_STD); //定位线夹_紧固力矩(n?m)（数值型、标准值）
                $('#' + locationPrefix + 'lctclmpmmt_msd').html(json[i].LCTCLMPMMT_MSD); //定位线夹_紧固力矩(n?m)（数值型、实测值）
                $('#' + locationPrefix + 'lctclmps_sts').html(json[i].LCTCLMPS_STS); //定位线夹_本体状态
                $('#' + locationPrefix + 'lctclmp_sts').html(json[i].LCTCLMP_STS); //定位线夹_螺栓紧固状态
                $('#' + locationPrefix + 'lctclmpsb').html(json[i].LCTCLMPSB); //定位线夹_本体
                $('#' + locationPrefix + 'lctrmmt_std').html(json[i].LCTRMMT_STD); //定位环_紧固力矩(n?m)（数值型、标准值）
                $('#' + locationPrefix + 'lctrmmt_msd').html(json[i].LCTRMMT_MSD); //定位环_紧固力矩(n?m)（数值型、实测值）
                $('#' + locationPrefix + 'lctr_pop_std').html(json[i].LCTR_POP_STD); //定位环_销钉开口销（数值型、标准值）
                $('#' + locationPrefix + 'lctr_pop_msd').html(json[i].LCTR_POP_MSD); //定位环_销钉开口销（数值型、实测值）
                $('#' + locationPrefix + 'lctr_pop_sfv').html(json[i].LCTR_POP_SFV); //定位环_销钉开口销（数值型、安全值）
                $('#' + locationPrefix + 'lctrs_sts').html(json[i].LCTRS_STS); //定位环_本体状态
                $('#' + locationPrefix + 'lctr_lsp_cmp').html(json[i].LCTR_LSP_CMP); //定位环_防松部件
                $('#' + locationPrefix + 'lctrb_sts').html(json[i].LCTRB_STS); //定位环_螺栓紧固状态
                $('#' + locationPrefix + 'lctrsb').html(json[i].LCTRSB); //定位环_本体
                $('#' + locationPrefix + 'lctrw').html(json[i].LCTRW); //定位环位置（数值型）
                $('#' + locationPrefix + 'bshseorm_mmt_std').html(json[i].BSHSEORM_MMT_STD); //套管单耳斜腕臂侧_紧固力矩(n?m)（数值型、标准值）
                $('#' + locationPrefix + 'bshseorm_mmt_msd').html(json[i].BSHSEORM_MMT_MSD); //套管单耳斜腕臂侧_紧固力矩(n?m)（实测值）
                $('#' + locationPrefix + 'bshseorms_sts').html(json[i].BSHSEORMS_STS); //套管单耳斜腕臂侧_本体状态
                $('#' + locationPrefix + 'bshseltc_mmt_std').html(json[i].BSHSELTC_MMT_STD); //套管单耳定位管侧_紧固力矩(n?m)（数值型、标准值）
                $('#' + locationPrefix + 'bshseltc_mmt_msd').html(json[i].BSHSELTC_MMT_MSD); //套管单耳定位管侧_紧固力矩(n?m)（数值型、实测值）
                $('#' + locationPrefix + 'bshseltcs_sts').html(json[i].BSHSELTCS_STS); //套管单耳定位管侧_本体状态
                $('#' + locationPrefix + 'lctnt_sts').html(json[i].LCTNT_STS); //支持器_螺栓紧固状态
                $('#' + locationPrefix + 'spsb').html(json[i].SPSB); //支持器_本体
                $('#' + locationPrefix + 'spop').html(json[i].SPOP); //支持器_开口销
                $('#' + locationPrefix + 'wdpcbllen_std').html(json[i].WDPCBLLEN_STD); //防风拉线_长度(mm) （数值型、标准值）
                $('#' + locationPrefix + 'wdpcbllen_msd').html(json[i].WDPCBLLEN_MSD); //防风拉线_长度(mm) （数值型、实测值）
                $('#' + locationPrefix + 'wdpcbl_dmt').html(json[i].WDPCBL_DMT); //防风拉线_直径(mm) （数值型）
                $('#' + locationPrefix + 'wdpc_sts').html(json[i].WDPC_STS); //防风拉线(支撑)状态
            } else {
                //定位装置信息 表一
                $('#' + locationPrefix + 'lct_id').val(json[i].LCT_ID); //定位装置id
                $('#' + locationPrefix + 'lctdmt').val(json[i].LCTDMT); //定位管_直径(mm)（数值型）
                $('#' + locationPrefix + 'lcttlen_std').val(json[i].LCTTLEN_STD); //定位管_长度(mm) （数值型、标准值）
                $('#' + locationPrefix + 'lcttlen_msd').val(json[i].LCTTLEN_MSD); //定位管_长度(mm) （数值型、实测值）
                $('#' + locationPrefix + 'lcttlen_sfv').val(json[i].LCTTLEN_SFV); //定位管_长度(mm) （数值型、安全值）
                $('#' + locationPrefix + 'lctt_sts').val(json[i].LCTT_STS); //定位管_螺栓紧固状态
                $('#' + locationPrefix + 'lcttsb').val(json[i].LCTTSB); //定位管_本体
                $('#' + locationPrefix + 'lcttdetwmmt_std').val(json[i].LCTTDETWMMT_STD); //定位管双耳套筒_顶丝_力矩(n?m)（数值型、标准值）
                $('#' + locationPrefix + 'lcttdetwmmt_msd').val(json[i].LCTTDETWMMT_MSD); //定位管双耳套筒_顶丝_力矩(n?m)（数值型、实测值）
                $('#' + locationPrefix + 'lcttdesptnt_msd').val(json[i].LCTTDESPTNT_MSD); //定位管双耳套筒_备母_力矩(n?m)（数值型、标准值）
                $('#' + locationPrefix + 'lcttdes_sts').val(json[i].LCTTDES_STS); //定位管双耳套筒_本体状态
                $('#' + locationPrefix + 'lcttde_lssts').val(json[i].LCTTDE_LSSTS); //定位管双耳套筒_定位管本体状态
                $('#' + locationPrefix + 'lsdeor_tw_mmt_msd').val(json[i].LSDEOR_TW_MMT_MSD); //定位管支撑双耳套筒斜腕臂侧_顶丝_紧固力(n?m)（数值型、标准值）
                $('#' + locationPrefix + 'lsdeor_tw_mmt_std').val(json[i].LSDEOR_TW_MMT_STD); //定位管支撑双耳套筒斜腕臂侧_顶丝_紧固力(n?m)（数值型、实测值）
                $('#' + locationPrefix + 'lsdeor_spnt_mmt_msd').val(json[i].LSDEOR_SPNT_MMT_MSD); //定位管支撑双耳套筒斜腕臂侧_备母_紧固力矩(n?m)（数值型、标准值）
                $('#' + locationPrefix + 'lsdeor_spnt_mmt_std').val(json[i].LSDEOR_SPNT_MMT_STD); //定位管支撑双耳套筒斜腕臂侧_备母_紧固力矩(n?m)（数值型、实测值）
                $('#' + locationPrefix + 'lsdeors_sts').val(json[i].LSDEORS_STS); //定位管支撑双耳套筒斜腕臂侧_本体状态
                $('#' + locationPrefix + 'lsdeltc_tw_mmt_msd').val(json[i].LSDELTC_TW_MMT_MSD); //定位管支撑双耳套筒定位管侧_顶丝_紧固力矩(n?m)（数值型、标准值）
                $('#' + locationPrefix + 'lsdeltc_tw_mmt_std').val(json[i].LSDELTC_TW_MMT_STD); //定位管支撑双耳套筒定位管侧_顶丝_紧固力矩(n?m)（数值型、实测值）
                $('#' + locationPrefix + 'lsdeltc_spnt_mmt_msd').val(json[i].LSDELTC_SPNT_MMT_MSD); //定位管支撑双耳套筒定位管侧_备母_紧固力矩(n?m)（数值型、标准值）
                $('#' + locationPrefix + 'lsdeltc_spnt_mmt_std').val(json[i].LSDELTC_SPNT_MMT_STD); //定位管支撑双耳套筒定位管侧_备母_紧固力矩(n?m)（数值型、实测值）
                $('#' + locationPrefix + 'lsdeltcs_sts').val(json[i].LSDELTCS_STS); //定位管支撑双耳套筒定位管侧_本体状态
                $('#' + locationPrefix + 'lsplen_std').val(json[i].LSPLEN_STD); //定位支撑_长度(mm) （数值型、标准值）
                $('#' + locationPrefix + 'lsplen_msd').val(json[i].LSPLEN_MSD); //定位支撑_长度(mm) （数值型、实测值）
                $('#' + locationPrefix + 'lsplen_sfv').val(json[i].LSPLEN_SFV); //定位支撑_长度(mm) （数值型、安全值）
                $('#' + locationPrefix + 'lctspb_sts').val(json[i].LCTSPB_STS); //定位支撑_螺栓紧固状态
                $('#' + locationPrefix + 'lctspsb').val(json[i].LCTSPSB); //定位支撑_本体
                $('#' + locationPrefix + 'lct_tp').val(json[i].LCT_TP); //定位器类型
                $('#' + locationPrefix + 'lct_slp').val(json[i].LCT_SLP); //定位器坡度(度)
                $('#' + locationPrefix + 'lctblt_sts').val(json[i].LCTBLT_STS); //定位器_螺栓紧固状态
                $('#' + locationPrefix + 'lctsb').val(json[i].LCTSB); //定位器_本体
                $('#' + locationPrefix + 'lcts_sts').val(json[i].LCTS_STS); //定位器_本体状态
                $('#' + locationPrefix + 'lctop').val(json[i].LCTOP); //定位器_开口销
                $('#' + locationPrefix + 'lctlen_std').val(json[i].LCTLEN_STD); //定位器_长度(mm) （数值型、标准值）
                $('#' + locationPrefix + 'lctlen_msd').val(json[i].LCTLEN_MSD); //定位器_长度(mm) （数值型、实测值）
                $('#' + locationPrefix + 'lctlen_sfv').val(json[i].LCTLEN_SFV); //定位器_长度(mm) （数值型、安全值）
                $('#' + locationPrefix + 'lctclrc_std').val(json[i].LCTCLRC_STD); //定位器_止钉间隙(mm) （数值型、标准值）
                $('#' + locationPrefix + 'lctclrc_msd').val(json[i].LCTCLRC_MSD); //定位器_止钉间隙(mm) （数值型、实测值）
                $('#' + locationPrefix + 'lctclrc_sfv').val(json[i].LCTCLRC_SFV); //定位器_止钉间隙(mm) （数值型、安全值）
                $('#' + locationPrefix + 'lct_mdl').val(json[i].LCT_MDL); //定位方式

                //定位装置信息 表二
                $('#' + locationPrefix + 'lcttwharm').val(json[i].LCTTWHARM); //定位管支撑在平腕臂位置
                $('#' + locationPrefix + 'lcttworm').val(json[i].LCTTWORM); //定位管支撑在斜腕臂位置（数值型）
                $('#' + locationPrefix + 'lctwlctt').val(json[i].LCTWLCTT); //定位支撑在定位管位置（数值型）
                $('#' + locationPrefix + 'lctuw').val(json[i].LCTUW); //定位支座u螺栓位置（数值型）
                $('#' + locationPrefix + 'lctspmmt_std').val(json[i].LCTSPMMT_STD); //定位支座_紧固力矩(n?m)（数值型、标准值）
                $('#' + locationPrefix + 'lctspmmt_msd').val(json[i].LCTSPMMT_MSD); //定位支座_紧固力矩(n?m)（数值型、实测值）
                $('#' + locationPrefix + 'lctsps_sts').val(json[i].LCTSPS_STS); //定位支座_本体状态
                $('#' + locationPrefix + 'lctclmpmmt_std').val(json[i].LCTCLMPMMT_STD); //定位线夹_紧固力矩(n?m)（数值型、标准值）
                $('#' + locationPrefix + 'lctclmpmmt_msd').val(json[i].LCTCLMPMMT_MSD); //定位线夹_紧固力矩(n?m)（数值型、实测值）
                $('#' + locationPrefix + 'lctclmps_sts').val(json[i].LCTCLMPS_STS); //定位线夹_本体状态
                $('#' + locationPrefix + 'lctclmp_sts').val(json[i].LCTCLMP_STS); //定位线夹_螺栓紧固状态
                $('#' + locationPrefix + 'lctclmpsb').val(json[i].LCTCLMPSB); //定位线夹_本体
                $('#' + locationPrefix + 'lctrmmt_std').val(json[i].LCTRMMT_STD); //定位环_紧固力矩(n?m)（数值型、标准值）
                $('#' + locationPrefix + 'lctrmmt_msd').val(json[i].LCTRMMT_MSD); //定位环_紧固力矩(n?m)（数值型、实测值）
                $('#' + locationPrefix + 'lctr_pop_std').val(json[i].LCTR_POP_STD); //定位环_销钉开口销（数值型、标准值）
                $('#' + locationPrefix + 'lctr_pop_msd').val(json[i].LCTR_POP_MSD); //定位环_销钉开口销（数值型、实测值）
                $('#' + locationPrefix + 'lctr_pop_sfv').val(json[i].LCTR_POP_SFV); //定位环_销钉开口销（数值型、安全值）
                $('#' + locationPrefix + 'lctrs_sts').val(json[i].LCTRS_STS); //定位环_本体状态
                $('#' + locationPrefix + 'lctr_lsp_cmp').val(json[i].LCTR_LSP_CMP); //定位环_防松部件
                $('#' + locationPrefix + 'lctrb_sts').val(json[i].LCTRB_STS); //定位环_螺栓紧固状态
                $('#' + locationPrefix + 'lctrsb').val(json[i].LCTRSB); //定位环_本体
                $('#' + locationPrefix + 'bshseorm_mmt_std').val(json[i].BSHSEORM_MMT_STD); //套管单耳斜腕臂侧_紧固力矩(n?m)（数值型、标准值）
                $('#' + locationPrefix + 'bshseorm_mmt_msd').val(json[i].BSHSEORM_MMT_MSD); //套管单耳斜腕臂侧_紧固力矩(n?m)（实测值）
                $('#' + locationPrefix + 'bshseorms_sts').val(json[i].BSHSEORMS_STS); //套管单耳斜腕臂侧_本体状态
                $('#' + locationPrefix + 'bshseltc_mmt_std').val(json[i].BSHSELTC_MMT_STD); //套管单耳定位管侧_紧固力矩(n?m)（数值型、标准值）
                $('#' + locationPrefix + 'bshseltc_mmt_msd').val(json[i].BSHSELTC_MMT_MSD); //套管单耳定位管侧_紧固力矩(n?m)（数值型、实测值）
                $('#' + locationPrefix + 'bshseltcs_sts').val(json[i].BSHSELTCS_STS); //套管单耳定位管侧_本体状态
                $('#' + locationPrefix + 'lctnt_sts').val(json[i].LCTNT_STS); //支持器_螺栓紧固状态
                $('#' + locationPrefix + 'spsb').val(json[i].SPSB); //支持器_本体
                $('#' + locationPrefix + 'spop').val(json[i].SPOP); //支持器_开口销
                $('#' + locationPrefix + 'wdpcbllen_std').val(json[i].WDPCBLLEN_STD); //防风拉线_长度(mm) （数值型、标准值）
                $('#' + locationPrefix + 'wdpcbllen_msd').val(json[i].WDPCBLLEN_MSD); //防风拉线_长度(mm) （数值型、实测值）
                $('#' + locationPrefix + 'wdpcbl_dmt').val(json[i].WDPCBL_DMT); //防风拉线_直径(mm) （数值型）
                $('#' + locationPrefix + 'wdpc_sts').val(json[i].WDPC_STS); //防风拉线(支撑)状态
            }
        }
    }

    //function tempStorage() {
    //}
    //function onStart(){ 
    //    if(storage.getItem(strKey)!=null){ 
    //        alert(storage.getItem(strKey)+'localStorage'); 
    //    }else if(Cookie.read(strKey)!=null){ 
    //        alert(Cookie.read(strKey)+'cookie'); 
    //    } 
    //} 
    //function bendihuancun(){ 
    //    var strValue = document.getElementById("username").value; 
    //    if (storage) { 
    //        storage.setItem(strKey, strValue);   
    //    } else { 
    //        Cookie.write(strKey, strValue);  
    //    } 
    //}

    function showRequest(formData, jqForm, options) {
        //formData是数组，就是各个input的键值map数组
        //通过这个方法来进行处理出来拼凑出来字符串。
        //formData：拼凑出来的form字符串，比如name=hera&password，
        //其实就是各个表单中的input的键值对，
        //如果加上method=XXXX，那也就是相当于ajax内的data。
        var queryString = $.param(formData);
        for (var i = 0; i < formData.length; i++) {
            if (formData[i].name.indexOf('new_support') >= 0) {

            }

            var t = formData[i].value + "===============" + formData[i].name;
        }
        //jqForm，jquery form对象
        var formElement = jqForm[0];
        //alert($(formElement).attr("method"));
        //alert($(jqForm[0].name).attr("maxlength"));
        //非常重要，返回true则说明在提交ajax之前你验证
        //成功，则提交ajax form
        //如果验证不成功，则返回非true，不提交
        return true;
    }

    function showRequest___(formData, jqForm, options) {
        //formData是数组，就是各个input的键值map数组
        //通过这个方法来进行处理出来拼凑出来字符串。
        //formData：拼凑出来的form字符串，比如name=hera&password，
        //其实就是各个表单中的input的键值对，
        //如果加上method=XXXX，那也就是相当于ajax内的data。
        var queryString = $.param(formData);
        //alert(queryString + "======" + formData.length);
        for (var i = 0; i < formData.length; i++) {
            //alert(formData[i].value + "===============" + formData[i].name);
            var t = formData[i].value + "===============" + formData[i].name;
        }
        //jqForm，jquery form对象
        var formElement = jqForm[0];
        //alert($(formElement).attr("method"));
        //alert($(jqForm[0].name).attr("maxlength"));
        //非常重要，返回true则说明在提交ajax之前你验证
        //成功，则提交ajax form
        //如果验证不成功，则返回非true，不提交
        return true;
    }

    /*/*
     * @desc 将form中的值转换为键值对
     * @param formId：表单id
     * @return 无
     */
    function getFormJson(formId) {
        var jsonData = {};
        var jsonSupport = {};
        var a = $(formId).serializeArray();
        $.each(a, function (index) {
            if (jsonData[this.name] !== undefined) {
                //if (!jsonData[this.name].push) {
                //    jsonData[this.name] = [jsonData[this.name]];
                //}
                //jsonData[this.name].push(this.value || '');
                return;
            } else {
                if ((this.name).indexOf('new_support_') >= 0) {
                    jsonSupport[this.name] = this.value;
                } else {
                    jsonData[this.name] = this.value;
                }
            }
        });
        jsonData['new_support'] = jsonSupport;
        return jsonData;
    }
