var AlarmJson; //申明的同点对比Json对象
var GPSJson;
var _h = $(window).height() / 2;
var _w = $(window).width() / 2;
var _H = $(window).height() / 2;
var gotopoleinfo_id = '';
var index_alarm_history = ''; // 弹出历史记录框的所属 编号
var index_alarm_tip = ''; // 弹出历史记录提示框的所属 编号
var pageSize = 5; //每页数量
var cDate2;
var device_id = ''; // 杆编码
var C_json = ''; // C3数据
var lockTime = 0;//加锁次数
var scroll_bar_height = 0; //滚动条位置
var lockType = false;//被其他人加锁
var upload_number = 0; //控制上传图片的数据加载
var SamePointVs = 1;//同点对比次数
var _index_sample = ''; // 弹出确认样本框的所属 编号
var _sample_type_rs; //正样本详细类型名称
var _sample_type_code; //正样本详细类型code
var _cur_sample = ''; //当前样本类型

var temp_sample_code = '';
var temp_sample_val = '';
var OrigialAlarm = '';



//tips 移入
function tip_hover() {
    $('#alarm_clock').hover(function () {
        var that = this;
        if ($(this).attr('name') != '' && $(this).attr('name') != undefined) {
            layer.tips('锁定用户：' + $(this).attr('name') + '</br>锁定时间：' + $(this).attr('title_tips'), that, {
                tips: [3, '#3595CC'],
                time: 1000000
            });
        }
    }, function () {
        layer.closeAll('tips')
    })

}
//加锁
function lockAlarm() {

    var url = '/c3/pc/malarmmonitoring/remotehandlers/getmonitoralarmc3form.ashx?type=lock&alarmid=' + GetQueryString("alarmid")
    $.ajax({
        type: "POST",
        url: url,
        async: true,
        cache: false,
        success: function (re) {
            if (re != '' && re != undefined) {
                if (re.sign == 'True') {
                    layer.tips('锁定用户:' + json_user.name, '#alarm_clock', { tips: [1, ''], tipsMore: true, time: 2000 })
                    $('#alarm_clock').attr('title_tips', re.locktime);
                    $('#alarm_clock').find('span:eq(0)').addClass('btn-lock-ico-selected');
                    $('#alarm_clock').attr('name', json_user.name)
                  
                } else {
                    //$('#mybox1').attr({'id':'','aria-hidden':''})
                    //$('#E_btnOk2,#E_btnCan2').unbind();
                    layer.msg('锁定失败！', function () { })
                }
            }
        }
    })
}
//解锁
function unlockAlarm() {

    var url = '/c3/pc/malarmmonitoring/remotehandlers/getmonitoralarmc3form.ashx?type=unlock&alarmid=' + GetQueryString("alarmid")
    $.ajax({
        type: "POST",
        url: url,
        async: true,
        cache: false,
        success: function (re) {
            if (re != '' && re != undefined) {
                if (re == 'True') {
                    $('#alarm_clock').find('span:eq(0)').removeClass('btn-lock-ico-selected');
                    $('#alarm_clock').attr({ 'title_tips': '', 'name': '' })
                    lockType = false;
                } else {
                    layer.msg('解锁锁定失败！')
                }
            }
        }
    })
}

//离开页面解锁
function outThisWindow() {
    if ($('#alarm_clock').find('span:eq(0)').hasClass('btn-lock-ico-selected')) {
        if ($('#alarm_clock').attr('name') == json_user.name) {
            unlockAlarm()
        }
    }
}

//报警确认取消初始状态判断提示
function alertconfirm() {
    setTimeout(function () {
        layer.confirm('本条报警已被处理，确认继续修改吗？', {
            btn: ['确认', '取消']
        }, function () {
            layer.closeAll()
        }, function () {
            CloseSureBox()
        });
    }, 700)

}

$(document).ready(function () {

    // 主播放控制器显示与隐藏
    $('#block-control').click(function () {
        if ($(this).hasClass('pull_up') && !$(this).hasClass('pull_down')) { //隐藏控制器
            $(this).removeClass('pull_up');
            $(this).addClass('pull_down');
            if ($('#note').is(':visible')) {
                $('#note').css({
                    display: 'none',
                }).animate({ top: '25px' }, 500);
            }
        } else if (!$(this).hasClass('pull_up') && $(this).hasClass('pull_down')) { //显示控制器
            $(this).addClass('pull_up');
            $(this).removeClass('pull_down');
            if (!$('#note').is(':visible')) {
                $('#note').css({
                    display: 'block',
                }).animate({ top: '25px' }, 500);
            }
        }
    });
    //机车没有“按位置获取数据”功能
    var isCRH = FunEnable("Fun_isCRH");
    if (isCRH == 'False') {
        $('#OriginalFile_creat').html('查看获取任务');
        $('.text-width-m ').width('100px');
    }

    // 按钮提示文字显示与隐藏
    $('.ul-block-btn li').mouseenter(function () {
        if (isCRH == 'False') {
            $(this).find('.captions').not('#OriginalFile_span').css('display', 'inline-block');
        } else {
            $(this).find('.captions').css('display', 'inline-block');
        }
        var li = $(this).parent().find('li');
        for (var i = 0; i < li.length; i++) {
            $(li[i]).css({ 'border-top': '1px solid #f7f7f7' });
        }
        $(this).css({ 'border-top': '1px solid #42a2da' });
    }).mouseleave(function () {
        $(this).find('.captions').css('display', 'none');
    });

    window.onbeforeunload = function () { outThisWindow() };
    if (FunEnable('Fun_lock_sureOrcancel') == "True") {
        tip_hover()
        $('#alarm_clock').show()
        $('#alarm_clock').click(function () {
            if ($(this).find('span:eq(0)').hasClass('btn-lock-ico-selected')) {
                unlockAlarm()
            } else {
                lockAlarm()
            }
        })
    } else {
        $('#alarm_clock').hide()
    }

    //历史记录 功能开关
    if (FunEnable('Fun_edit_alarm_history') === 'True') {
        $($(document).find('.j-alarm-history')).css({ 'display': 'inline-block' });
    } else {
        $($(document).find('.j-alarm-history')).css({ 'display': 'none' });
    }

    //查看历史记录
    $(document).on('click', '.j-alarm-history', function () {
        $('#table-history').html('<tr><td colspan="2">没有数据</td></tr>');
        index_alarm_history = showDialog($('#alarm-history'), '758px', '520px');
        getAlarmHistory();
    });
    //关闭历史记录弹出框
    $(document).on('click', '.j-close', function () {
        var act = $(this).parent().find('.act').val();
        if ('history' === act) {
            layer.close(index_alarm_history);
        }
    });
    //历史记录中报警信息显示（引用控件）
    $(document).on('mouseenter', '.j-alarm-tip', function () {
        var arr = $(this).next().val().split('&');
        var html =
            '<ul class="ul-block-small">'
                + '<li>'
                    + '<label>修改值：</label>'
                    + '<label id="modify-val" style="word-break: break-all;">' + arr[0] + '</label>'
                + '</li>'
                + '<li>'
                    + '<label>原始值：</label>'
                    + '<label id="original-val" style="word-break: break-all;">' + arr[1] + '</label>'
                + '</li>'
            + '</ul>';
        index_alarm_tip = layer.tips(html, $(this), {
            tips: [1, '#000'],
            time: ''
        });
    }).on('mouseleave', '.j-alarm-tip', function () {
        layer.close(index_alarm_tip);
    });

    //设置拉出值 功能开关
    if (FunEnable('Fun_setLC') === 'True') { //对内
        $($(document).find('#btn_Set_jc')).css({ 'display': 'inline-block' }); //显示设置接触点坐标
        $($(document).find('#btn_Set_zx')).css({ 'display': 'inline-block' }); //显示设置中心点坐标
        $('#note-IR').css({ 'background': 'url(/C3/PC/MAlarmMonitoring/ImgTmp/bg_w_294.png) no-repeat', 'width': '294px' });
        // 初始化图片事件
        initImgEvent();
    } else { //对外
        $($(document).find('#btn_Set_jc')).css({ 'display': 'none' }); //隐藏设置接触点坐标
        $($(document).find('#btn_Set_zx')).css({ 'display': 'none' }); //隐藏设置中心点坐标
        $($(document).find('#btn_Set_cw')).css({ 'display': 'none' }); //隐藏红外测温
    }
    if (FunEnable('Fun_hw') === 'True') { //红外功能
        $('#note-IR').css({ 'background': 'url(/C3/PC/MAlarmMonitoring/ImgTmp/bg_w_188.png) no-repeat', 'width': '188px' });//控制条背景
        $($(document).find('#btn_Set_cw')).css({ 'display': 'inline-block' }); //显示红外测温
    }
    if (FunEnable('Fun_hw') === 'True' && FunEnable('Fun_setLC') === 'True') {
        $('#note-IR').css({ 'background': 'url(/C3/PC/MAlarmMonitoring/ImgTmp/bg_w_294.png) no-repeat', 'width': '294px' });
    } else if (FunEnable('Fun_hw') === 'True') {
        $('#note-IR').css({ 'background': 'url(/C3/PC/MAlarmMonitoring/ImgTmp/bg_w_188.png) no-repeat', 'width': '200px' });//控制条背景
    } else {
        $('#note-IR').css({ 'background': 'url(/C3/PC/MAlarmMonitoring/ImgTmp/bg_w_252.png) no-repeat', 'width': '252px' });//控制条背景
    }

    //上传图片 功能开关
    if (FunEnable('Fun_upload_pic') === 'True' && getConfig('For6C') == 'DPC') {

        //显示上传图片按钮
        $($(document).find('.j-alarm-upload')).css({ 'display': 'inline-block' });

        //初始化上传图片html
        $('#upload-pic').myUploadImg({
            alarmid: GetQueryString('alarmid'),
            subTitle: '修前图片上传',
            fileListId: '#fileList-review',
            filePickerId: '#filePicker-review',
            ctlBtnUploadId: '#ctlBtn-review',
            imageClassification: 'wait'
        });
        $('#upload-pic').myUploadImg({
            alarmid: GetQueryString('alarmid'),
            subTitle: '修后图片上传',
            fileListId: '#fileList-repair',
            filePickerId: '#filePicker-repair',
            ctlBtnUploadId: '#ctlBtn-repair',
            imageClassification: 'done',
            jUpload: '.j-alarm-upload'
        });
    } else {
        //隐藏上传图片按钮
        $($(document).find('.j-alarm-upload')).css({ 'display': 'none' });
    }

    //上传图片 功能开关
    if (FunEnable('Fun_upload_pictures') === 'True' && getConfig('For6C') == '3C') {
        $($(document).find('.j-alarm-upload_3C')).css({ 'display': 'inline-block' });
    } else {
        $($(document).find('.j-alarm-upload_3C')).css({ 'display': 'none' });
    }

    //重新解析按钮开关
    if (FunEnable('Fun_ReturnAgain') == "True" && FunEnable('Fun_isCRH') == "True") {
        $("#ReturnAgain").css({ 'display': 'inline-block' });
    }

    //上传图片 弹出框
    $(document).on('click', '.j-alarm-upload_3C', function () {
        if (upload_number === 0) {
            // 初始化上传图片弹出框
            initUpload('#fileList-map', '#filePicker-map', '#ctlBtn-map', 'MAP_ADD_IMA');
            initUpload('#fileList-vi', '#filePicker-vi', '#ctlBtn-vi', 'VI_ADD_IMA');
            initUpload('#fileList-oa', '#filePicker-oa', '#ctlBtn-oa', 'OA_ADD_IMA');
            // 将已上传的图片展示出来
            getImages();
        }
        var clientHeight = document.body.clientHeight; //网页可见区域高
        if (clientHeight < 750 && clientHeight > 0) {
            index_upload_pic = showDialog($('#upload-pic_3C'), '650px', '609px', 'TRUE');
        } else {
            index_upload_pic = showDialog($('#upload-pic_3C'), '650px', '700px', 'TRUE');
        }
        upload_number++;
    });
    // 预览图片
    $(document).on('click', '#upload-pic img', function () {
        var img_url = $(this).attr('src');
        var image = new Image();
        image.src = img_url;
        var clientWidth = document.body.clientWidth; //网页可见区域宽
        var clientHeight = document.body.clientHeight; //网页可见区域高
        // 原图大小
        //var width = image.width + 'px';
        //var height = image.height + 'px';
        //屏幕比例
        var width = clientWidth * 0.5 + 'px';
        var height = clientHeight * 0.75 + 'px';

        $('#preview-pic img').attr({
            'src': img_url,
            'width': width,
            'height': height,
        });
        showDialog($('#preview-pic'), width, height, 'TRUE');
    });

    //开始上传图片
    $(document).on('click', '#ctlBtn', function () {
        $('#ctlBtn-map').trigger('click');
        $('#ctlBtn-vi').trigger('click');
        $('#ctlBtn-oa').trigger('click');
    });

    //点击上传图片中的取消
    $(document).on('click', '#close-upload', function () {
        layer.close(index_upload_pic);
    });

    //机车重解析辅助选项隐藏
    if (FunEnable('Fun_isCRH') === "False") {
        $("#Support").parent().hide();
    }

    //确认样本 弹出框
    $(document).on('click', '.j-sample', function () {
        _index_sample = showDialog($('#sample-box'), '325px', '180px', 'TRUE');
        $('#alarmType').val('');
        $('#alarmType').attr('code', json.SUMMARYDICCODE).val(json.SUMMARYDIC); //报警类型
        get_sample_type($('#alarmType').attr('code'));
        var obj = loadSample(); //加载默认样本
        loadFSample(); //获取负样本详细类型
    });

    //确认样本 报警类型
    //$('#alarmType').mySelectTree_Level2({
    //    codeType: '3C',
    //    onClick: function () {
    //        get_sample_type($('#alarmType').attr('code'));
    //    },
    //    callback: function () {
    //        get_sample_type($('#alarmType').attr('code'));
    //    }
    //});

    //确认样本 选择正、负样本库
    $('.radio-span').click(function () {
        var radio = $(this).find('input:radio');
        var id = $(radio).attr('id');
        $(radio).attr('checked', 'checked');
        click_sample(id);
    });
    $('input:radio').click(function () {
        var id = $(this).attr('id');
        click_sample(id);
    });

    //确认样本
    $('#btn-sample-confirm').click(function () {
        if (undefined !== $('#ULf_sample_detail')) {
            $('#ULf_sample_detail').parent().css('display', 'none');
        }
        confirmSample();
    });

    //上一条下一条关闭
    if (!GetQueryString("example-basic")) {
        $("#S_pre").hide();
        $("#S_next").hide();
    }

    //取消DPC的3C中的快捷键提示
    if (getConfig('For6C') !== '3C') {
        $('#qjbtn').attr('title', '');
        $('#S_pre').attr('title', '');
        $('#S_next').attr('title', '');
    }
    if (getConfig('debug') == "1") {//场景样本为内部需求
        $(document).find('#Scene_sample').css('display', 'block');
        $(document).find('.j-sample').css('display', 'block');
        $('#irvA_HistoryAlarm').show();
    } else {
        $(document).find('#Scene_sample').css('display', 'none');
        $(document).find('.j-sample').css('display', 'none');
        $('#irvA_HistoryAlarm').hide();
    };

    $('#Scene_sample').one('click', function () {
        //$(document).find('#droup_Scene_sample').css({ 'left': $(window).width() / 2 - $('#droup_Scene_sample').width() / 2, 'top': -$('#droup_Scene_sample').height() / 2 });
        //$(document).find('.SampleContent').css('margin-left', '25px');
        //$(document).find('.SampleContent').after("<button class='btn btn-primary' id='btn_sub'onclick='OnlySceneSampleSure()' style='float:right;margin-right:25px'>确认</button>");
        //$(document).find('.SampleContent').before("<div id='scene_ico'style='border-bottom: 1px solid darkgray;'><img src='img/scene.png' style='margin-bottom:2px'></div>");
    });

});
/*/*
  * @desc 单独确认场景样本
  * @param 
  */
function OnlySceneSampleSure() {
    var dropSpan = $('#droup_Scene_sample .SampleContent', document).find('span');
    for (var k = 0; k < dropSpan.length; k++) {
        if (!$(dropSpan[k]).hasClass('checkSpan')) {
            temp_sample_code = temp_sample_code.replace($(dropSpan[k]).attr('code'), '');
            temp_sample_val = temp_sample_val.replace($(dropSpan[k]).attr('title'), '');
        }

    }
    temp_sample_code = QuChong(temp_sample_code.substring(0, temp_sample_code.length - 1).split(','));
    temp_sample_val = QuChong(temp_sample_val.substring(0, temp_sample_val.length - 1).split(','));
    var url = '/Common/MAlarmMonitoring/RemoteHandlers/AlarmSure.ashx?active=Save_ScenceSample&alarmid=' + GetQueryString('alarmid') + '&SCENCESAMPLE_CODE=' + temp_sample_code.substring(0, temp_sample_code.length - 1) + '&SCENCESAMPLE_NAME=' + temp_sample_val.substring(0, temp_sample_val.length - 1);
    $.ajax({
        type: 'POST',
        url: url,
        async: true,
        cache: false,
        success: function (re) {
            console.log(re);
            if (re.re < '1') {
                layer.msg('场景样本确认失败');
            } else {
                $('#droup_Scene_sample').hide();
                location.reload();
                layer.msg('场景样本确认成功');
            };

        }
    });
}

//去除字符串中重复的字符
function QuChong(Str) {
    var newStr = "";
    for (var i = 0; i < Str.length; i++) {
        if (newStr.indexOf(Str[i]) == -1) {
            newStr += Str[i] + ',';
        }
    }
    return newStr;
}



/*/*
  * @desc 获取已上传的图片
  * @param 
  */
function getImages() {
    var data = '';
    var url = '/C3/PC/MAlarmMonitoring/PictureUpload.aspx?action=query&alarmid=' + GetQueryString('alarmid');
    $.ajax({
        type: 'POST',
        url: url,
        async: true,
        cache: false,
        success: function (json) {
            if (undefined !== json || '' !== json) {
                if (undefined !== json.data || '' !== json.data) {
                    data = json.data;
                    if (data.length > 0) {
                        var $list_map = $('#fileList-map'); //地图
                        var $list_vi = $('#fileList-vi'); //局部
                        var $list_oa = $('#fileList-oa'); //全景

                        $('#fileList-map').html('');
                        $('#fileList-vi').html('');
                        $('#fileList-oa').html('');

                        for (var i = 0; i < data.length; i++) {
                            //地图图片
                            if (data[i].MAP_ADD_IMA.length > 0) {
                                var map_count = 0;
                                for (var k1 = 0; k1 < data[i].MAP_ADD_IMA.length; k1++) {
                                    if ('' !== data[i].MAP_ADD_IMA[k1]) {
                                        var $li_map = $('<div id="map_' + k1 + '" class="cp_img">' +
                                                            '<img src="' + data[i].MAP_ADD_IMA[k1] + '">' +
                                                            '<span class="cp_img_jian"></span>' +
                                                            '<span class="success"></span>' +
                                                        '</div>');
                                        $list_map.append($li_map);
                                        map_count++;
                                    }
                                }
                                $list_map.parent().find('.file-info').html('共' + map_count + '张图片');
                                $list_map.parent().find('input.file-count').attr('value', map_count);
                            }

                            //局部图片
                            if (data[i].VI_ADD_IMA.length > 0) {
                                var vi_count = 0;
                                for (var k2 = 0; k2 < data[i].VI_ADD_IMA.length; k2++) {
                                    if ('' !== data[i].VI_ADD_IMA[k2]) {
                                        var $li_vi = $('<div id="vi_' + k2 + '" class="cp_img">' +
                                                            '<img src="' + data[i].VI_ADD_IMA[k2] + '">' +
                                                            '<div class="cp_img_jian"></div>' +
                                                            '<span class="success"></span>' +
                                                        '</div>');
                                        $list_vi.append($li_vi);
                                        vi_count++;
                                    }
                                }
                                $list_vi.parent().find('.file-info').html('共' + vi_count + '张图片');
                                $list_vi.parent().find('input.file-count').attr('value', vi_count);
                            }

                            //全景图片
                            if (data[i].OA_ADD_IMA.length > 0) {
                                var oa_count = 0;
                                for (var k3 = 0; k3 < data[i].OA_ADD_IMA.length; k3++) {
                                    if ('' !== data[i].OA_ADD_IMA[k3]) {
                                        var $li_oa = $('<div id="oa_' + k3 + '" class="cp_img">' +
                                                            '<img src="' + data[i].OA_ADD_IMA[k3] + '">' +
                                                            '<div class="cp_img_jian"></div>' +
                                                            '<span class="success"></span>' +
                                                        '</div>');
                                        $list_oa.append($li_oa);
                                        oa_count++;
                                    }
                                }
                                $list_oa.parent().find('.file-info').html('共' + oa_count + '张图片');
                                $list_oa.parent().find('input.file-count').attr('value', oa_count);
                            }
                        }

                        $(document).find('.layui-layer-content').scrollTop(scroll_bar_height);
                    }
                }
            }
        }
    });
}

/*/*
    * @desc 关闭弹出框
    * @param 
    */
function closeLayerBox() {
    //关闭上传图片弹出框
    $(document).on('click', '.j-close', function () {
        var act = $(this).parent().find('.act').val();
        if ('history' === act) {
            layer.close(index_alarm_history);
        }
        if ('upload-pic' === act) {
            layer.close(index_upload_pic);
        }
    });
}

/*/*
 * @desc 历史记录列表
 * @param 
 */
function getAlarmHistory() {
    $($(document).find('#paging')).paging({
        index: 1,
        url: function () {
            pageIndex = $('.pageValue').val();
            var url = '/C3/PC/MAlarmMonitoring/RemoteHandlers/GetMonitorAlarmC3Form.ashx?'
                + 'type=history'
                + '&alarmid=' + GetQueryString('alarmid')
                + '&pagesize=' + pageSize
                + '&pageindex=' + pageIndex;
            return url;
        },
        success: function (json) {
            test = json;
            var _html_con = ''; //表内容
            if (undefined === json) {
                _html_con = '<tr><td colspan="2">没有数据</td></tr>'
            } else {
                if (json.data.length === 0) {
                    _html_con = '<tr><td colspan="2">没有数据</td></tr>'
                } else {
                    var data1 = json.data;
                    for (var i = 0; i < data1.length; i++) {

                        var edit_time = data1[i].EDIT_TIME;
                        edit_time = Replace(edit_time, '/', '-');

                        var _html_alarm_type = '';
                        var data2 = data1[i].data;
                        for (var j = 0; j < data2.length; j++) {
                            var arr = data2[j].split('|');
                            var alarm_type = arr[0];
                            var original_val = arr[1];
                            var modify_val = arr[2];
                            _html_alarm_type +=
                                '<span class="j-alarm-tip">' + alarm_type + '</span>'
                                + '<input type="hidden" class="tip-info" value="' + modify_val + '&' + original_val + '" />';
                        }

                        _html_con +=
                        '<tr>'
                            + '<td></td>'
                            + '<td>'
                                + '<ul class="ul-block-middle">'
                                    + '<li>'
                                        + '<label>操作时间:</label>'
                                        + '<label>' + edit_time + '</label>'
                                    + '</li>'
                                    + '<li>'
                                    　  + '<label>操作人:</label>'
                                    　  + '<label>' + data1[i].EDIT_PERSON + '</label>'
                                  　+ '</li>'
                                  　+ '<li>'
                                  　　  + '<label>修改项:</label>'
                                  　　  + '<div>'
                                            + _html_alarm_type
                                        + '</div>'
                                 　 + '</li>'
                                 + '</ul>'
                            + '</td>'
                       + '</tr>';
                    }
                }
            }
            $('#table-history').html(_html_con);
        }
    });
}

/*/*
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
           closeBtn: 1,
           area: [width, height], //宽高
           content: $targetElement.show(), //捕获的元素
           cancel: function (index) {
               layer.close(index);
           }
       });
    return _index;
}

function AutoSize() {

    _h = $(window).height() / 2;
    _w = $(window).width() / 2;

    $('.L').height(_h);
    //$('.R').height(_h);
    $('#hw').height(_h).width(_w);
    $('#kjg').height(_h).width(_w);
    $("#panel-6652").width($(window).width());
    $('#hw').height(_h).width(_w);
    $('#kjg').height(_h).width(_w);
    $('#linechart,#lc_chart,#dg_chart,#wd_chart,#lcm_chart').height(_h).width(_w);
    $('#BigImg').height(_h).width(_w);
    $("#lbtd").width(_w);
    $('#allimg').height(_h - 2).width(_w - 2);
    $('#tableinfo').height(_h / 2);

    $('.box-content').height(_h - 70);
    $('#btn_Set_hw').css({ top: _h - 32, left: _w - 32 });
    $('#btn_Set_kjg').css({ top: _h - 32, left: _w });
    $('#btn_Set_all').css({ top: _h, left: _w - 32 });
    $('#panel-6652').css("top", _h - 42).css("bottom", "inherit");
    // 设置主播放器的位置在屏幕居中
    var main_note_left = ($(window).width() - 199) / 2;
    $('#note').css('left', main_note_left);
    $('#block-control').css('left', main_note_left + 4);
    setTimeout("auto()", 200);
}
function auto() {
    _h = ($(window).height() / 2 - 185) / 9;
    $("#tablejbxx>.row-fluid>.row-fluid>[class*='span']").each(function () {
        $(this).css("min-height", _h).height(_h);
    });
}

//fullShow();
function loadTdGrid(url, Alert) {
    if (url == undefined)
        url = "RemoteHandlers/GetAlarmTD.ashx?alarmid=" + GetQueryString("alarmid");
    $.ajax({
        type: "POST",
        url: url,
        async: true,
        cache: false,
        beforeSend: function () {
            if (SamePointVs != 1) {
                fullShow()
            }
            SamePointVs++;
        },
        success: function (result) {
            fullHide();
            var list = eval('[' + result + ']');
            if (list != null) {
                AlarmJson = list;
                var detail = "";
                if (list[0] == false) {
                    if (url.indexOf("temp") > -1) {
                        if (Alert == "1") {
                            layer.msg('未分析出重复报警', { icon: 5 });
                            $("#div_Detail").html("");
                        }
                    }
                    //重置元素尺寸
                    reset_element_size();
                    return;
                }
                detail += "周围" + $("#range").val() + "米范围内，在" + list[list.length - 1].RAISED_TIME + "到" + list[0].RAISED_TIME + "之间，检测出" + list.length + "次疑似缺陷告警";
                detail += "&nbsp;&nbsp;<a href='javascript:selectRepeatInfo();'>查看详细&gt;&gt;</a>";
                $("#div_Detail").html(detail);
            }
            else {
                if (Alert == "1") {
                    layer.msg('未分析出重复报警', { icon: 5 });
                    $("#div_Detail").html("");
                }
            }
            //重置元素尺寸
            reset_element_size();
        },
        error: function (e) {
            //重置元素尺寸
            fullHide();

            reset_element_size();
        }
    });
}


$(document).ready(function () {
    $("#note-IR,#note-VI,#note-OAB").draggable({ containment: "document" });
    $('#noteCtrl').draggable({ containment: "widow" })
    setTimeout(loadSureBox, 1000);

    if (FunEnable('Fun_OriginalAlarmType') == "True") { $('#orAlarmType').css('display', '') }
    //确认，取消模态框可拖动
    $("#mybox1").draggable({
        containment: 'document',
        iframeFix: true,
        start: function (event, ui) {
            $("iframe").each(function () {
                $("<div class='ui-draggable-iframeFix' style='background: #fff;'></div>")
                    .css({
                        width: document.body.scrollWidth + "px", height: document.body.scrollHeight + "px",
                        position: "absolute", opacity: "0.001", zIndex: 1000,
                        top: 0, left: 0
                    })
                    .appendTo("body");
            });
        },
        stop: function () {
            $("div.ui-draggable-iframeFix").each(function () {
                this.parentNode.removeChild(this);
            });
        }
    });


    $('#portOutBtn').click(function () {
        var url = "/C3/PC/MAlarmMonitoring/downloadReportDoc.aspx?action=start&alarmid=" + GetQueryString("alarmid");
        var downloadUrl = "/C3/PC/MAlarmMonitoring/downloadReport.ashx?action=downloadSingle&alarmid=" + GetQueryString("alarmid");
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
                        url = "/C3/PC/MAlarmMonitoring/downloadReportDoc.aspx?action=produce&alarmid=" + GetQueryString("alarmid");
                        planAjaxSingle(url, downloadUrl);
                    }
                }
            }
        });
    });
    if (FunEnable('Fun_RegenerateDefectReport') == "True") { //重新生成缺陷报告
        $("#flashPortOutBtn").show();
    }
    $('#flashPortOutBtn').click(function () {
        var url = "/c3/pc/malarmmonitoring/remotehandlers/getmonitoralarmc3form.ashx?type=ReportStatus&alarmid=" + GetQueryString("alarmid");
        $.ajax({
            type: "POST",
            url: url,
            cache: false,
            async: true,
            success: function (result) {
                if (result != "") {
                    if (result == "True") {
                        $('#portOutBtn').click()
                    } else if (result == "False") {
                        layer.msg('重新生成失败！')
                    }
                }
            }
        });

    })
    AutoSize();
    $('body').show();

    $(window).resize(function () {
        AutoSize();
        AutoSize1()
    });

    var _w2 = _h / 0.75;
    $("#kjg").elevateZoom({ zoomWindowPosition: 7, zoomWindowHeight: _h - 10, zoomWindowWidth: _w2 - 50 });


    createZoom("allimg", "/Common/img/暂无图片.png", "");


    $('#S_btclose').click(function () {
        if (top.location != self.location) {
            parent.window.close();
        }
        if (GetQueryString("rsurl") == "no") {
            if (GetQueryString("type") == "SSGIS") {
                //window.opener.refushAlarm(false);
                window.opener.ColseC3AlarmInfo();
            } else {
                //window.opener.TimeAlarmInfo();
            }
            window.parent.close();
            return;
        }

        try {
            var f_url = window.opener.location.href;
            if (f_url.indexOf('/Common/MGIS/GIS.htm') > 0) {
                // alert('从地图过来');

                window.opener.TimeAlarmInfo();

            } else if (f_url.indexOf('/AlarmTopo.htm') > 0) {
                window.opener.TimeAlarmInfo();
                window.parent.close();
            }
            else if (f_url.indexOf('/MRTA') > 0) {

                //window.opener.parent.reloadall();
                window.close();
            } else if (f_url.indexOf('/MonitorLocoAlarmList.htm') > 0) {

                window.opener.doQuery(-1);
                outThisWindow();
                window.close();
            }
            else {

                window.opener.location.reload();
                window.parent.close();
            }
        }
        catch (e) {
            window.close();
        }

    });


    $('#Ureportdate').val(dateNowStr());

    hideC3infobyID("jltr"); //隐藏动车数据的交路运用区段信息

    hideNoNeed(); //master.js

    //loadFlexitdGrid(); //加载同点对比
    $("#range").val(getConfig("RepeatRange"));

    $('.lightbox').lightbox();

    $('.gBlock').css('z-index', '0');

    var _Infowidth = $('#panel-6652').width();

    $('#btn_locInfoControl').click(function () {

        var src = $(this).attr('src');
        if (src.indexOf('left') > 0) {
            $('#btn_locInfoControl').attr('src', '/Common/img/locoPlay/right.png');

            //   $('#panel-6652').width(35)
            $('#panel-6652').animate({ width: 35 }, 500);

            $('#locInfo').animate({ opacity: 0 }, 500);

        }
        else {
            $('#btn_locInfoControl').attr('src', '/Common/img/locoPlay/left.png');
            //  $('#panel-6652').width('auto');


            $('#panel-6652').animate({ width: _Infowidth }, 500);

            $('#locInfo').animate({ opacity: 1 }, 800);
        }

    });



    if ($(window).width() < 1600) {
        //PC的样式。
        $('.bDiv').height('50px');
        $('.table-condensed th, .table-condensed td').css('padding', '0px 5px');

    }

    var alarmID = GetQueryString("alarmid");
    $('#btn_editWZ').click(function () {
        LoadEditBox("3C", alarmID);

        $('#myEditbox1').modal().css({
            width: 'auto',
            'margin-left': function () {
                return -($(this).width() / 2);
            },
            'margin-top': function () {
                return -($(this).height() / 2);
            }
        });

    });


    $('#btn_raised_time').click(function () {

        var LocomotiveCode = $('#trainNo').html();
        var startTime = $('#raised_time').html();
        var endTime = $('#raised_time').html();
        var url = '/Common/MAlarmMonitoring/AlarmDelayDetails.htm?&htmlName=MonitorAlarm3CForm4&LocomotiveCode=' + LocomotiveCode + '&startTime=' + startTime + '&endTime=' + endTime;
        window.open(url);
    });


    $("#E_btnOk2").click(function () {

        SetAlarmID("3C", alarmID);
    });
    $("#E_btnCan2").click(function () {

        SetAlarmID("3C", alarmID, 1);
    });


    $('#E_save').click(function () {
        AddSave();
    });

    $('#E_saveList').click(function () {
        GetSave();
    });

    LoadSaveListBox("3C");
    $("#btn_fx").click(function () {
        repeatFX(1);
    });

    $("#btn_replay").click(function () {

        var timeStr = $('#raised_time').text();
        if ($("#SUMMARYDIC").attr("code") != undefined) {
            var SUMMARYDIC_code = $("#SUMMARYDIC").attr("code");
        };
        var cDate2 = new Date(timeStr);
        var cdate2_times = parseInt(cDate2.getTime());  //得到毫秒级时间戳  13位

        var wz = escape($('#BOW_TYPE').text());//.replace("弓", "").replace("车","");

        layer.open({
            type: 2,
            title: '视频回放',
            shadeClose: false,
            shade: 0.8,
            skin: "MyLayerBox",
            area: ['800px', '600px'],
            content: "/C3/PC/MLiveStreaming/MonitorLocoPlayNew.htm?page=meta_big&btn_tc=0&replay=1&playtime=" + cdate2_times + "&wz=" + wz + "&loca=" + $('#trainNo').text() + "&SUMMARYDIC_code=" + SUMMARYDIC_code + '&v=' + version + '&r=' + Math.random(),
            success: function (layero, index) {
                $(layero.find('iframe')[0]).addClass("iframe_MyLayerBox").attr("id", "iframe_MyLayerBox");
            }
            //iframe的url
        });
    });
    if (GetQueryString("rsurl") == "no") {
        $("#S_next").css("display", "none");
    }

    if (FunEnable('Fun_3CSpeedList') == "False") { //速度列
        $("#tablejbxx").find("div.dchide").hide();
    }


    $("#btn_PSureAlarm").hide();
    //算按钮组位置
    $("#divDropButton").css("left", $(window).width() / 2 - 133);
    $("#wd").click(function () {
        if (!$(".L div[id='linechart']").hasClass("k-chart")) {
            setTimeout("createLineChart()", 300);
        }
        $("#linechart").show();
        $("#lc_chart").hide();
        $("#dg_chart").hide();
        $("#wd_chart").hide();
        $("#chartTitle").text("温度曲线");
    });
    $("#lc").click(function () {
        if (!$(".L div[id='lc_chart']").hasClass("k-chart")) {
            setTimeout("createLC_LineChart()", 300);
        }
        $("#linechart").hide();
        $("#lc_chart").show();
        $("#dg_chart").hide();
        $("#wd_chart").hide();
        $("#chartTitle").text("拉出值曲线");
    });
    $("#dg").click(function () {
        if (!$(".L div[id='dg_chart']").hasClass("k-chart")) {
            setTimeout("createDG_LineChart()", 300);
        }
        $("#linechart").hide();
        $("#lc_chart").hide();
        $("#dg_chart").show();
        $("#wd_chart").hide();
        $("#chartTitle").text("导高值曲线");
    });
    $("#wdd").click(function () {
        if (!$(".L div[id='wd_chart']").hasClass("k-chart")) {
            setTimeout("createWD_LineChart()", 300);
        }
        $("#linechart").hide();
        $("#lc_chart").hide();
        $("#dg_chart").hide();
        $("#wd_chart").show();
        $("#chartTitle").text("温度导高值曲线");
    });

    //按钮图片切换

    $("#note-IR .note-IR-left,#note-VI .note-VI-left,#note-OAB .note-OAB-left,#note .note-left").hover(function () {
        $(this).attr("src", "ImgTmp/left-light.png")
    }, function () {
        $(this).attr("src", "ImgTmp/left.png")
    });
    $("#note-IR .note-IR-right,#note-VI .note-VI-right,#note-OAB .note-OAB-right,#note .note-right").hover(function () {
        $(this).attr("src", "ImgTmp/right-light.png")
    }, function () {
        $(this).attr("src", "ImgTmp/right.png")
    });
    $("#note-IR .note-IR-setup,#note-VI .note-VI-setup,#note-OAB .note-OAB-setup").hover(function () {
        $(this).attr("src", "ImgTmp/setup-light.png")
    }, function () {
        $(this).attr("src", "ImgTmp/setup.png")
    });
    $("#note #qjbtn").hover(function () {
        $(this).attr("src", "ImgTmp/pic-light.png")
    }, function () {
        $(this).attr("src", "ImgTmp/pic.png")
    });

    white_JC = function () {
        $("#note-IR .note-IR-jc").attr("src", "ImgTmp/jc_point.png");
    };
    yellow_JC = function () {
        $("#note-IR .note-IR-jc").attr("src", "ImgTmp/jc_point_hover.png");
    };
    white_ZX = function () {
        $("#note-IR .note-IR-zx").attr("src", "ImgTmp/zx_point.png");
    };
    yellow_ZX = function () {
        $("#note-IR .note-IR-zx").attr("src", "ImgTmp/zx_point_hover.png");
    };
    white_CW = function () {
        $("#note-IR .note-IR-cw").attr("src", "ImgTmp/temperature_over.png");
    };
    yellow_CW = function () {
        $("#note-IR .note-IR-cw").attr("src", "ImgTmp/temperature.png");
    };
    white_CW_single = function () {
        $("#note-IR .note_cw_single").attr("src", "ImgTmp/single_light.png");
    };
    yellow_CW_single = function () {
        $("#note-IR .note_cw_single").attr("src", "ImgTmp/single.png");
    };
    white_CW_continue = function () {
        $("#note-IR .note_cw_continue").attr("src", "ImgTmp/continue_light.png");
    };
    yellow_CW_continue = function () {
        $("#note-IR .note_cw_continue").attr("src", "ImgTmp/continue.png");
    };
    white_CW_area = function () {
        $("#note-IR .note_cw_area").attr("src", "ImgTmp/area_light.png");
    };
    yellow_CW_area = function () {
        $("#note-IR .note_cw_area").attr("src", "ImgTmp/area.png");
    };
    white_CW_clean = function () {
        $("#note-IR .note_cw_clean").attr("src", "ImgTmp/clean_light.png");
    };
    yellow_CW_clean = function () {
        $("#note-IR .note_cw_clean").attr("src", "ImgTmp/clean.png");
    };
    // 改变事件
    $("#note-IR .note-IR-jc").bind({
        mouseenter: yellow_JC,
        mouseleave: white_JC
    });
    $("#note-IR .note-IR-zx").bind({
        mouseenter: yellow_ZX,
        mouseleave: white_ZX
    });
    $("#note-IR .note_cw_single").bind({
        mouseenter: white_CW_single,
        mouseleave: yellow_CW_single
    });
    $("#note-IR .note-IR-cw").bind({
        mouseenter: white_CW,
        mouseleave: yellow_CW
    });
    $("#note-IR .note_cw_continue").bind({
        mouseenter: white_CW_continue,
        mouseleave: yellow_CW_continue
    });
    $("#note-IR .note_cw_area").bind({
        mouseenter: white_CW_area,
        mouseleave: yellow_CW_area
    });
    $("#note-IR .note_cw_clean").bind({
        mouseenter: white_CW_clean,
        mouseleave: yellow_CW_clean
    });

    $("#note .iconstar").hover(function () {
        var IMG = $(this).attr("src");
        if (IMG == '/C3/PC/MAlarmMonitoring/ImgTmp/play.png') {
            $(this).attr("src", "/C3/PC/MAlarmMonitoring/ImgTmp/play-light.png")
        }
        if (IMG == '/C3/PC/MAlarmMonitoring/ImgTmp/pause.png') {
            $(this).attr("src", "/C3/PC/MAlarmMonitoring/ImgTmp/pause-light.png")
        }

    }, function () {
        var IMG = $(this).attr("src");
        if (IMG == '/C3/PC/MAlarmMonitoring/ImgTmp/play-light.png') {
            $(this).attr("src", "/C3/PC/MAlarmMonitoring/ImgTmp/play.png")
        }
        if (IMG == '/C3/PC/MAlarmMonitoring/ImgTmp/pause-light.png') {
            $(this).attr("src", "/C3/PC/MAlarmMonitoring/ImgTmp/pause.png")
        }
    });
    $("#A2 img").hover(function () {
        $(this).attr("src", "ImgTmp/jump-light.png")
    }, function () {
        $(this).attr("src", "ImgTmp/jump.png")
    });
    $("#note .note-light").hover(function () {
        $(this).attr("src", "ImgTmp/light-light.png")
    }, function () {
        $(this).attr("src", "ImgTmp/light.png")
    });
    
    $("#a_BKJG img").hover(function () {
        $(this).attr("src", "ImgTmp/brightness_light.png")
    }, function () {
        $(this).attr("src", "ImgTmp/brightness.png")
    });
    $("#a_BQJ img").hover(function () {
        $(this).attr("src", "ImgTmp/brightness_light.png")
    }, function () {
        $(this).attr("src", "ImgTmp/brightness.png")
    });
    $("#note .note-close").hover(function () {
        $(this).attr("src", "ImgTmp/close-light.png")
    }, function () {
        $(this).attr("src", "ImgTmp/close1.png")
    });

    //居中
    $("#ul_status").css("marginTop", ($(".state").height() - $("#ul_status").height()) / 2);
    $(".contrast_big").css("marginTop", ($(".contrast").height() - $(".contrast_big").height()) / 2);
    $("#cancelNumber").css("marginTop", ($(".state").height() - $("#cancelNumber").height()) / 2);
    //弹出发送信息模态框
    var dxnrtext = '';
    var sendwww = window.location.href.split('/C3')[0] + '/a.aspx?id=' + alarmID;

    setTimeout(bind_td, 1000);

    var SendLeft = ($(window).width() - $('#SendInfo').width()) / 2;
    $('#SendInfo').css({ 'left': SendLeft, 'marginLeft': 0 });

    $('#btn_sendinfo').click(function () {
        //发送短信加载。
        setTimeout(loadAddressBook, 2000);
        $('#SendInfo').modal();
        if ($('#jltr').is(":hidden")) {
            $('#jltr').remove();
        }
        dxnrtext = '报警：' + $('#raised_time').text() + $('#WZ').text() + ',' + $('#trainNo').text() + ',' + $('#severity').text() + ',' + $('#SUMMARYDIC').text() + ',' + sendwww;



        dxnrtext = dxnrtext.replace(/\s+/g, ',');
        //  alert(dxnrtext);
        $('#send-dxnr').val(dxnrtext);

        document.getElementById('sendp').innerHTML = '当前共<span style="color:red;">' + $('#send-dxnr').val().length + '</span>个字符，最大340个字符。';
    });

    $('#send-dxnr').keyup(function () {
        document.getElementById('sendp').innerHTML = '当前共<span style="color:red;">' + $('#send-dxnr').val().length + '</span>个字符，最大340个字符。';
    })

    //发送信息
    $('#SendEnter').click(function () {
        sendenter();
    })
    function sendenter() {
        var mobile = '';
        $('#send-jsr').find('.moblie').each(function () {
            if ($(this).text() != '') {
                mobile += $(this).text() + ',';
            }

        })
        mobile = mobile.substring(0, mobile.length - 1);
        var URL = '/Common/RemoteHandlers/SMS.ashx?type=send&mobiles=' + mobile + '&content=' + escape($('#send-dxnr').val());

        $.ajax({
            type: 'POST',
            url: URL,
            cache: false,
            async: true,
            success: function (re) {
                layer.alert(re,function(index){
                    if (re == '发送成功') {
                        $('#SendInfo').modal('hide')
                    }
                    layer.close(index);
            });
            },
            error: function () {
                alert('发送失败');
            }
        })
    }

    if (FunEnable('Fun_TypicalDefects') == "True") {
        $("#ckdj").css("display", "");
        $("#signPortout").css("display", "");//周报标志
        $('#arcArea').parent().parent().css("display", "")//燃弧显示
    }

    if (FunEnable('Fun_LineInspection') == "True") {
        $(".j-analysis-detail").css("display", "");//报警巡检对比按钮
    }

    if (getConfig('debug') != "1") {
        $(".IRxuhao,.xuhao").hide();
        $("#slider").css("width", "90%");
        $("#note-IR a, #note-VI a, #note-OAB a").css("margin-left", "6px");
    }

    //跳转对比分析页面
    $('.j-analysis-detail').click(function () {
        var _url = '/C3/PC/MAlarmMonitoring/alarm_inspection_analysis.html?alarmid=' + GetQueryString('alarmid') + '&device_id=' + device_id;
        window.open(_url);
    });
    //图形化轨迹
    $('#btn_GJ').click(function () {
        var cDate_GJ1 = new Date();
        var cDate_GJ2 = new Date();
        cDate_GJ1.setTime(cDate2.getTime() - 1000 * 60 * 60 * 2); //减2小时。
        cDate_GJ2.setTime(cDate2.getTime() + 1000 * 60 * 60 * 2);
        var _start = cDate_GJ1.format("yyyy/MM/dd hh:mm:ss");
        var _end = cDate_GJ2.format("yyyy/MM/dd hh:mm:ss");

        var _url = '/Common/MGIS/OrbitGIS.htm?Category_Code=DPC&deviceid=' + AlarmJson_3Cform4.LOCNO + '&startdate=' + _start + '&enddate=' + _end + '&v=' + version;

        window.open(_url);
    });
    //播放原始数据
    $('#btn_vedio_play').click(function () {
        var __url = '/Common/LineInspectionDataAnalysis/LineInspection_data_analysis.html?&fromoriginalfile=true&line_code=&line_name=&direction=&position_code=&position_name=&start_time=&end_time=&bigStarttime=&bigEndtime=&starttimestamp=' + '&endtimestamp=' + '&locomotive_code=' + AlarmJson_3Cform4.LOCNO + '&stampst=' + AlarmJson_3Cform4.RAISED_TIME + '&stampen=' + AlarmJson_3Cform4.RAISED_TIME + '&whicbow=' + escape(AlarmJson_3Cform4.BOW_TYPE) + '&queueid=' + AlarmJson_3Cform4.ORGINAL + '&taskid='
        window.open(__url);
    });
    //点击编辑模式
    $("#btn-start").click(function () {
        Ispaly = 0;
        Suspended(); //暂停;
        $(this).hide();
        $("#btn-close,#btn-save").show();
        EditInfo($(".IRxuhao-play").text() - 1);
    });
    $("#btn-close").click(function () {
        $(this).hide();
        $("#btn-save").hide();
        $("#btn-start").show();
        ReturnInfo($(".IRxuhao-play").text() - 1);
    });
    $("#btn-save").click(function () {  //保存
        save_editinfo($(".IRxuhao-play").text() - 1);
    });
    //1024分辨率显示处理
    if ($(window).width() <= 1024) {
        $(".box-header").css({ "padding-left": "0", "padding-right": "0" });
    }
    if ($(window).width() < 1920) {
        $("#btn-save").css({ "position": "relative", "right": "0", "top": "-5px" });
        $("#btn-start,#btn-close").css({ "position": "relative", "left": "0", "top": "-5px" });
    };
});

/*/*
 * @desc 设置宽度范围max-width
 * @param 
 */
function set_max_width(mainElement, fieldElement, colonElement, difference, childElement3) {
    var li = $(mainElement).parent();
    var max_width = $(li).width() - $(li).find(fieldElement).width() - $(li).find(colonElement).width() - difference;
    if (undefined !== childElement3) {
        max_width = max_width - $(li).find(childElement3).width();
    }
    $(mainElement).css({
        'max-width': max_width + 'px'
    });
}

/*/*
 * @desc 设置top或清除top
 * @param 
 */
function set_top(mainElement, fieldElement, colonElement, type) {
    var li = $(mainElement).parent();
    var top = $(mainElement).height() - $(li).find(fieldElement).height();
    if ('clear' === type) {
        $(li).find(colonElement).css({
            'top': '0px'
        });
    }
    if ('set' === type) {
        if (top > 5) {
            $(li).find(colonElement).css({
                'top': (-top) + 'px'
            });
        }
    }
}

/*/*
 * @desc 计算行数
 * @param 
 */
function get_row_num(mainElement) {
    var row; // 默认行数
    var base_row_height = 24; // 行的基础高
    var ul_height = $(mainElement).height(); // ul高度
    row = ul_height / base_row_height;
    return row;
}

/*/*
 * @desc 设置或清除模块标题高度
 * @param 
 */
function set_subtitle_height(mainElement, wordsNum, type) {
    var height = $(mainElement).height(); //高度
    var subtitle_name = $(mainElement).find('.subtitle-name');
    var add_height = (height - $(subtitle_name).height()) / (wordsNum + 1); //计算待增加的边距高度
    if ('clear' === type) {
        $(mainElement).find('.imgdiv').removeAttr('height'); //移除有背景色的元素的高度
        $(subtitle_name).find('span').css({
            'margin-top': '0px'
        });
        $(subtitle_name).find('span:eq(' + (wordsNum - 1) + ')').css({
            'margin-bottom': '0px'
        });
    }
    if ('set' === type) {
        $(mainElement).find('.imgdiv').attr('height', height); //设置有背景色的元素的高度
        $(subtitle_name).find('span').css({
            'margin-top': add_height + 'px'
        });
        $(subtitle_name).find('span:eq(' + (wordsNum - 1) + ')').css({
            'margin-bottom': add_height + 'px'
        });
    }
}

/*/*
 * @desc 清除设置的元素尺寸
 * @param 
 */
function clear_size_set() {
    // 重置max-height 、height
    $('#TOP_three').css({
        'max-height': 'auto',
        'height': 'auto'
    });
    // 清除top
    set_top('.wz-info', '.field-name', '.label-colon-wz', 'clear'); //位置的冒号
    set_top('#div_Detail', '.field-name', '.label-colon-vs', 'clear');//同点对比的冒号
    set_top('#div_Detail', '.field-name', '.btn-vs', 'clear');//同点对比的按钮
    set_top('#txtDefect', '.field-name', '.label-colon-defect', 'clear');//报警分析的冒号
    set_top('#txtAdvice', '.field-name', '.label-colon-advice', 'clear');//处理建议的冒号
    set_top('#txtNote', '.field-name', '.label-colon-note', 'clear');//备注的冒号

    // 清除标签的top值
    $('#AlarmCode').parent().css({
        'position': 'relative',
        'top': '0px'
    });

    // 清除每行的边距
    $('#TOP_three .ul-block-locale li,#TOP_three .ul-block-test li,#TOP_three .ul-block-analyse li').css({
        'padding-top': '0px',
        'padding-bottom': '0px'
    });

    // 清除模块标题高度
    set_subtitle_height('#TOP_three .locale', 4, 'clear');//报警现场
    set_subtitle_height('#TOP_three .test', 3, 'clear');//检测值
    set_subtitle_height('#TOP_three .analyse', 4, 'clear');//报警分析
    set_subtitle_height('#tablejbxx .state', 4, 'clear');//报警状态
}

/*/*
 * @desc 重置元素尺寸
 * @param 
 */
function reset_element_size() {

    // 清除设置的元素尺寸
    clear_size_set();

    // 右下角的高度
    var bottom_R_height = $('#bottom-R').height();
    // 第一排按钮元素的高度
    var btn_first_height = $('#bottom-R .alarm-btn-box').height();
    // 报警状态的高度
    var state_height = $('#bottom-R .state').height();
    // 最后一排按钮元素的高度
    var btn_last_height = $('#bottom-R #btns_all').height();

    // 计算中间三行的高度
    var top_three_height = '';
    top_three_height = bottom_R_height - btn_first_height - state_height - btn_last_height - 8;
    $('#TOP_three').css({
        'max-height': top_three_height + 'px',
        'height': top_three_height + 'px'
    });

    set_max_width('.wz-info', '.field-name', '.label-colon-wz', 10); //位置
    set_top('.wz-info', '.field-name', '.label-colon-wz', 'set'); //位置的冒号

    set_max_width('#div_Detail', '.field-name', '.label-colon-vs', 45, '.btn-vs');//同点对比
    set_top('#div_Detail', '.field-name', '.label-colon-vs', 'set');//同点对比的冒号
    set_top('#div_Detail', '.field-name', '.btn-vs', 'set');//同点对比的按钮

    set_max_width('#txtDefect', '.field-name', '.label-colon-defect', 20);//报警分析
    set_top('#txtDefect', '.field-name', '.label-colon-defect', 'set');//报警分析的冒号

    set_max_width('#txtAdvice', '.field-name', '.label-colon-advice', 10);//处理建议
    set_top('#txtAdvice', '.field-name', '.label-colon-advice', 'set');//处理建议的冒号

    set_max_width('#txtNote', '.field-name', '.label-colon-note', 10);//备注
    set_top('#txtNote', '.field-name', '.label-colon-note', 'set');//备注的冒号

    if ($(window).width() > 1280) {
        if ($('#txtNote').parent().height() > 19) { //标签
            $('#AlarmCode').parent().css({
                'position': 'relative',
                'top': -($('#txtNote').parent().height() - $('#AlarmCode').parent().height()) + 'px'
            });
        }
    }

    // 计算行数
    var locale_row = get_row_num('.ul-block-locale'); // 报警现场
    var test_row = get_row_num('.ul-block-test'); // 检测值
    var analyse_row = get_row_num('.ul-block-analyse'); // 报警分析

    // 为每行添加边距
    var height_difference = top_three_height - ($('#TOP_three .locale').height() + $('#TOP_three .test').height() + $('#TOP_three .analyse').height());// TOP_three 与 报警现场、检测值、报警分析的 高度差
    var count_row = Math.ceil(locale_row + test_row + analyse_row); //总行数（Math.floor：向下取值；Math.ceil：向上取值；Math.round：四舍五入）
    var rowAddHeight = Number(((height_difference / count_row) / 2).toFixed(2)); //待增加的边距高度

    if (height_difference > 0) {
        $('#TOP_three .ul-block-locale li,#TOP_three .ul-block-test li,#TOP_three .ul-block-analyse li').css({
            'padding-top': rowAddHeight + 'px',
            'padding-bottom': rowAddHeight + 'px'
        });
    } else {
        //$('#TOP_three .analyse').height(Math.floor($('#TOP_three .analyse').height() + 8));
    }

    // 再次设置TOP_three的高度
    var height_difference_2 = top_three_height - ($('#TOP_three .locale').height() + $('#TOP_three .test').height() + $('#TOP_three .analyse').height());
    if (height_difference_2 >= 2) {
        $('#TOP_three').css({
            'max-height': top_three_height - height_difference_2,
            'height': top_three_height - height_difference_2
        });
    }
    if (height_difference_2 >= -11 && height_difference_2 <= 5) {
        $('#TOP_three').css({
            'overflow': 'hidden'
        });
    }

    // 设置模块标题高度
    set_subtitle_height('#TOP_three .locale', 4, 'set');//报警现场
    set_subtitle_height('#TOP_three .test', 3, 'set');//检测值
    set_subtitle_height('#TOP_three .analyse', 4, 'set');//报警分析
    set_subtitle_height('#tablejbxx .state', 4, 'set');//报警状态
};

//杆号详情页面连接
function GetPoloeNumber(json) {
    if (json.POLE_NUMBER != "" && json.POLE_NUMBER != 'undefined') {

        var lineCode = json.LINE;//线路
        var position = json.QZ;//区站
        var bridgetune = json.BRIDGE_TUNNEL_NO;//桥隧
        var dirct = json.DIRECTION;//行别
        var KM = json.KM;//公里标
        var poleNO = json.POLE_NUMBER;//杆号
        var _json;//返回结果
        var url = '/Common/MOnePoleData/RemoteHandlers/MyDeviceList.ashx?action=getPoloeID&lineCode=' + lineCode + '&position=' + position + '&bridgetune=' + bridgetune + '&direction=' + escape(dirct) + '&KM=' + KM + '&poleNO=' + poleNO;
        $.ajax({
            type: "post",
            url: url,
            async: true,
            cache: false,
            success: function (result) {
                _json = eval('(' + result + ')');
                if (_json.length > 0 && _json.length == 1) {
                    gotopoleinfo_id = _json[0].ID;
                    $('#gotopoleinfo_id').val(gotopoleinfo_id);
                    gotopoleinfo(gotopoleinfo_id);

                    //绑定标签插件
                    $('[rel="tooltip"],[data-rel="tooltip"]').tooltip({ "placement": "right", delay: { show: 0, hide: 0 }, });
                }
                else {
                    //layer.msg('没有详情');
                    //layer.tips('没有详情', '#polenoinfo');
                    layer.tips('没有详情', '#polenoinfo', {
                        tips: [1, '#000'],
                        time: 600
                    });

                }
            }
        })
    } else {
        return;
    }
};

function bind_td() {
    $('#citySel').mySelectTree({
        cateGory: 'AFCODE',
        codeType: '3C',
        chkboxType: { "Y": "s", "N": "s" },
        enableCheck: true,
        onClick: false,
        tag: "SYSDICTIONARYTREE",
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
            var cityObj = $("#citySel");
            cityObj.attr("value", v).attr("code", code);
        },
        callback: function (event, treeId, treeNode, msg) {
            if (FunEnable("Fun_StatisticsTimes") == "True") {
                var treeObj = $.fn.zTree.getZTreeObj(treeId);
                var CityCode = GetQueryString("code");
                if (CityCode != null) {
                    var CodeArray = CityCode.replace(/'/g, "").split(',');
                    if (CodeArray.length == 0) {
                        treeObj.checkAllNodes(false);
                    } else if (CodeArray.length == 1) {
                        if (CodeArray[0] == "") {
                            treeObj.checkAllNodes(false);
                        } else {
                            var node = treeObj.getNodeByParam("id", CodeArray[0], null);
                            treeObj.checkNode(node, true, true);
                        }
                    } else {
                        for (var i = 0; i < CodeArray.length; i++) {
                            var node = treeObj.getNodeByParam("id", CodeArray[i], null);
                            treeObj.checkNode(node, true, true);
                        }
                    }
                    var zTree = $.fn.zTree.getZTreeObj(treeId),
                    nodes = zTree.getCheckedNodes(true),
                     v = "", code = "";
                    for (var i = 0, l = nodes.length; i < l; i++) {
                        v += nodes[i].name + ",";
                        code += nodes[i].id + ",";
                    }
                    if (v.length > 0) v = v.substring(0, v.length - 1);
                    if (code.length > 0) code = code.substring(0, code.length - 1);
                    var cityObj = $("#citySel");
                    cityObj.attr("value", v).attr("code", code);
                } else {
                    treeObj.checkAllNodes(false);
                    var cityObj = $("#citySel");
                    cityObj.attr("value", "").attr("code", "");
                }
            } else {
                var treeCode = getConfig("RepeatCode").split(',');
                if (treeCode[0] == "") {
                    var treeObj = $.fn.zTree.getZTreeObj(treeId);
                    treeObj.checkAllNodes(true);
                    var node = treeObj.getNodeByParam("name", "干扰", null);
                    treeObj.checkNode(node, false, true);
                } else {
                    for (var i = 0; i < treeCode.length; i++) {
                        var treeObj = $.fn.zTree.getZTreeObj(treeId);
                        var node = treeObj.getNodeByParam("id", treeCode[i], null);
                        treeObj.checkNode(node, true, true);
                    }
                    var zTree = $.fn.zTree.getZTreeObj(treeId),
                    nodes = zTree.getCheckedNodes(true),
                     v = "", code = "";
                    for (var i = 0, l = nodes.length; i < l; i++) {
                        v += nodes[i].name + ",";
                        code += nodes[i].id + ",";
                    }
                    if (v.length > 0) v = v.substring(0, v.length - 1);
                    if (code.length > 0) code = code.substring(0, code.length - 1);
                    var cityObj = $("#citySel");
                    cityObj.attr("value", v).attr("code", code);

                }
            }
        },
        onClick: function (event, treeId, treeNode) {
            var treeObj = $.fn.zTree.getZTreeObj(treeId);
            treeObj.checkAllNodes(false);
            $('#citySel').attr("value", "");
            var node = treeObj.getNodeByParam("id", treeNode.id, null);
            treeObj.checkNode(node, true, true);
            $('#citySel').attr("value", treeNode.name).attr({ "code": treeNode.id });
        }
    });
    $("#ddlzt").multiselect({
        noneSelectedText: "==请选择==",
        checkAllText: "全选",
        uncheckAllText: '全不选',
        selectedList: 6
    });
    //加载默认级别
    var jbJson = GetSeverityJson();
    for (var i = 0; i < jbJson.length; i++) {
        if (jbJson[i].code == "一类") {
            $("#grade-one").attr('code', jbJson[i].code);
            $(".gradeOne").html(jbJson[i].name);
        }
        if (jbJson[i].code == "二类") {
            $("#grade-two").attr('code', jbJson[i].code);
            $(".gradeTwo").html(jbJson[i].name);
        }
        if (jbJson[i].code == "三类") {
            $("#grade-three").attr('code', jbJson[i].code);
            $(".gradeThree").html(jbJson[i].name);
        }
    };
    if ($("#grade-three").attr('code') == '' || $("#grade-three").attr('code') == undefined) {
        $("#grade-three").attr('code', '三类');
        $(".gradeThree").html(getConfig('Severity_Third'));
    }
    

    repeatFX(0); //同点对比分析
};

//在加载明细页时将请求百度地图将报警位置图片保存到服务器中
function saveMapImage() {
    var url = "RemoteHandlers/GetMonitorAlarmC3Form.ashx?alarmid=" + GetQueryString("alarmid") + "&type=map&tid" + Math.random();
    $.ajax({
        type: "POST",
        url: url,
        async: true,
        cache: false,
        success: function (json) {

        }
    });
};

var Json;
//加载发送者名单
function loadAddressBook() {
    var url = '/Common/MFoundation/RemoteHandlers/UserControl.ashx?type=sms&page=1&rp=0';
    $.ajax({
        type: 'POST',
        url: url,
        cache: false,
        async: true,
        success: function (result) {
            Json = eval('(' + result + ')');

            query('');
            //查询
            $('#send-search').keyup(function () {
                var InputVal = $('#send-search').val();
                query(InputVal);
            })
        }
    })
}

//点击li加载信息
function sendulclick(jsrtext) {
    $('#send-ul li').click(function () {
        if ($(this).children('.send-number').text().length< 3) {
            layer.msg('无电话号码无法选中！');
            return false;
        }
        var Litext = $(this).children('.send-name').text() + '<span class="moblie" style="color:#999;">' + $(this).children('.send-number').text() + '</span>';

        if (jsrtext.indexOf(Litext) == -1) {
            jsrtext += '<span id="' + $(this).children('.send-number').text() + '">' + Litext + '<img style="cursor:pointer;" src="./ImgTmp/send-del.png" />;&nbsp;&nbsp;</span>';
        } else {
            return;
        };
        $('#send-jsr').html(jsrtext);
        $('#send-jsr span img').click(function () {
            $(this).parent().remove();
            jsrtext = $('#send-jsr').html();
        })
    });
}

//搜寻框模糊查询
function query(key) {
    var SendUl = document.getElementById('send-ul');
    var Sendinner = '';
    for (var i = 0; i < Json.rows.length; i++) {
        if (key != "" && (Json.rows[i].PER_NAME.indexOf(key) != -1 || Json.rows[i].TEL.indexOf(key) != -1 || Json.rows[i].ORG_NAME.indexOf(key) != -1)) {

        } else if (key == "") {

        } else {
            continue;
        }
        Sendinner += '<li><span class="send-name">' + Json.rows[i].PER_NAME + '</span><span class="send-number">' + Json.rows[i].TEL + '</span><span class="send-duan">' + Json.rows[i].ORG_NAME + '</span></li>';
    }
    SendUl.innerHTML = Sendinner;


    var jsrtext = $('#send-jsr').html();
    sendulclick(jsrtext);
}

Array.prototype.unique3 = function () {//数组去重
    var res = [];
    var json = {};
    for (var i = 0; i < this.length; i++) {
        if (!json[this[i]]) {
            res.push(this[i]);
            json[this[i]] = 1;
        }
    }
    return res;
}

//部件识别功能
function loadC3Dev() {
    var url = "RemoteHandlers/GetMonitorAlarmC3Form.ashx?type=dev&alarmid=" + GetQueryString("alarmid") + "&tid" + Math.random();
    $.ajax({
        type: "POST",
        url: url,
        async: true,
        cache: false,
        success: function (result) {
            if (result != '' && result != undefined) {

                //document.getElementById('txtDefect').innerHTML = json.ALARM_ANALYSIS;
                //检测值-设备部件
                if (result.length > 0) {
                    $('#devTarget').parent().css('display', 'inline-block');

                    var jsonarry = result.unique3();
                    var text = '';
                    for (var i = 0; i < jsonarry.length; i++) {
                        text += jsonarry[i];
                    }
                    $('#devTarget').text(text);
                } else {
                    $('#devTarget').parent().css('display', 'none');
                }
            }
        }
    });
    LoadSave();
};

var map_wz = '';
var map_gis_x = '';
var map_gis_y = '';
var map_gis_x_o = '';
var map_gis_y_o = '';
var severity_code = '';
function loadC3Form() {
    if (GetQueryString("C3title") != undefined && GetQueryString("C3title") != "") {
        document.getElementById('C3title').innerHTML = "缺陷信息";
        document.getElementById('btnOk').style.display = 'none';

    }

    var url = "RemoteHandlers/GetMonitorAlarmC3Form.ashx?type=total&alarmid=" + GetQueryString("alarmid") + "&tid" + Math.random();
    $.ajax({
        type: "POST",
        url: url,
        async: true,
        cache: false,
        success: function (result) {
            if (result != '' && result != undefined) {
                json = eval('(' + result + ')');
                if (json != undefined) {
                    AlarmJson_3Cform4 = json;//传递给C3AlarmImg_big.js页面用
                    C_json = json;
                    device_id = json.DEVICE_ID; // 杆编码
                    if ($.trim(json.SCENCESAMPLE_NAME).replace(',', '') !== '' && $.trim(json.SCENCESAMPLE_NAME).replace(',', '') !== undefined) {//如果场景样本不为空，修改按钮颜色
                        $(document).find('.btn-chang-ico').css({ 'background': 'url(/C3/PC/MAlarmMonitoring/img/chang_YOU.png) no-repeat', 'margin-top': '4px' })
                    } else {
                        $(document).find('.btn-chang-ico').css({ 'background': 'url(/C3/PC/MAlarmMonitoring/img/chang_ico.png) no-repeat', 'margin-top': '4px' })
                    };
                    if ($.trim(json.SAMPLE_CODE).replace(',', '') !== '' && $.trim(json.SAMPLE_CODE).replace(',', '') !== undefined) {//如果样本不为空，修改按钮颜色
                        $(document).find('.btn-sample-ico').css({ 'background': 'url(/C3/PC/MAlarmMonitoring/img/sample_YOU.png) no-repeat', 'margin-top': '4px' })
                    } else {
                        $(document).find('.btn-sample-ico').css('background', 'url(/C3/PC/MAlarmMonitoring/img/sample_ico.png) no-repeat')
                    };
                    OrigialAlarm = json.INITIAL_CODE_NAME;//原始报警

                    $('#Scene_sample').siblings('a[name="ztree"],div[id="droup_Scene_sample"]').remove();

                    //绑定场景样本控件
                    $('#Scene_sample').mySelect_Sample({
                        tag: "none",
                        codeType: "3C",
                        cateGory: "SCENE_SAMPLE",
                        p_code: "SCENE_SAMPLE",
                        enableFilter: false,
                        mark: false,
                        sureBtn: true,
                        //height:85,
                        width: 520,    //迷你款
                        onClick: function (CODE, VALUE, obj) {
                            var reg_code = new RegExp(obj.attr('code') + ',', 'g');
                            var reg_val = new RegExp(obj.attr('title') + ',', 'g');

                            if ('' !== CODE) {
                                temp_sample_code += CODE + ',';
                            } else {
                                temp_sample_code = temp_sample_code.replace(reg_code, '');
                            }
                            if ('' !== VALUE) {
                                temp_sample_val += VALUE + ',';
                            } else {
                                temp_sample_val = temp_sample_val.replace(reg_val, '');
                            }
                        },
                        callback: function () {
                            $('#Scene_sample').next('a[name="ztree"]').hide();
                            var dropSpan = $('#droup_Scene_sample .SampleContent', document).find('span');
                            for (var k = 0; k < dropSpan.length; k++) {
                                $(dropSpan[k]).removeClass('checkSpan');
                            };
                            $('#droup_Scene_sample', document).find('img[alt="关闭"]').click(function () {
                                var dropSpan = $('#droup_Scene_sample .SampleContent', document).find('span');
                                for (var k = 0; k < dropSpan.length; k++) {
                                    $(dropSpan[k]).removeClass('checkSpan');
                                }
                                if (json.SCENCESAMPLE_CODE !== '' && json.SCENCESAMPLE_CODE !== undefined && json.SCENCESAMPLE_NAME !== '' && json.SCENCESAMPLE_NAME !== undefined) {
                                    var scencesample_code = json.SCENCESAMPLE_CODE.split(',');
                                    var scencesample_name = json.SCENCESAMPLE_NAME.split(',');
                                    for (var j = 0; j < scencesample_code.length; j++) {
                                        for (var i = 0; i < dropSpan.length; i++) {
                                            if (scencesample_code[j] === $(dropSpan[i]).attr('code')) {
                                                $(dropSpan[i]).addClass('checkSpan');
                                                temp_sample_code += scencesample_code[j] + ',';
                                                temp_sample_val += scencesample_name[j] + ',';
                                            }
                                        }
                                    };
                                };
                            });
                            if (json.SCENCESAMPLE_CODE !== '' && json.SCENCESAMPLE_CODE !== undefined && json.SCENCESAMPLE_NAME !== '' && json.SCENCESAMPLE_NAME !== undefined) {
                                var scencesample_code = json.SCENCESAMPLE_CODE.split(',');
                                var scencesample_name = json.SCENCESAMPLE_NAME.split(',');
                                for (var j = 0; j < scencesample_code.length; j++) {
                                    for (var i = 0; i < dropSpan.length; i++) {
                                        if (scencesample_code[j] === $(dropSpan[i]).attr('code')) {
                                            $(dropSpan[i]).addClass('checkSpan');
                                            temp_sample_code += scencesample_code[j] + ',';
                                            temp_sample_val += scencesample_name[j] + ',';
                                        }
                                    }
                                };
                            };

                        }
                    });
                    //定位弹出框
                    $(document).find('#droup_Scene_sample').css({ 'left': $(window).width() / 2 - $('#droup_Scene_sample').width() / 2, 'top': -$('#droup_Scene_sample').height() / 2 });
                    $(document).find('.SampleContent').css('margin-left', '25px');
                    $(document).find('.SampleContent').after("<button class='btn btn-primary' id='btn_sub'onclick='OnlySceneSampleSure()' style='float:right;margin-right:25px'>确认</button>");
                    $(document).find('.SampleContent').before("<div id='scene_ico'style='border-bottom: 1px solid darkgray;'><img src='img/scene.png' style='margin-bottom:2px'></div>");

                    //var showSave = false;
                    //var showPL = false;
                    //if (FunEnable('Fun_FavoritesButton') == "True") {
                    //    showSave = true;
                    //}
                    //if (FunEnable('Fun_BatchButton') == "True") {
                    //    showPL = true;
                    //}


                    //if (FunEnable('Fun_isCRH') == "False" && getConfig('debug') == "1" && alarm_data_json.IsCrack == '') {

                    //    //机车  内部版本 自研车
                    //    showSave = false;
                    //    showPL = false;
                    //}

                    //if (showSave) { //破解车 特殊处理
                    //    $("#E_save").show();
                    //}
                    //if (showPL) { //破解车 特殊处理
                    //    $("#E_saveList").show();
                    //}

                    $("#UtxtReporter").val(json.PersonName);
                    if (json.ARCING_AREA != '' && json.ARCING_AREA != undefined) {
                        var arcArea = ' ' + json.ARCING_AREA + '%';
                    } else {
                        var arcArea = '';
                    };
                    if (getConfig('For6C') == 'DPC') {
                        loadeSaveMissionAndCancle(json.STATUSDIC)//加载加入收藏和处理任务按钮
                    }

                    if (json.STATUSDIC == '已计划' || json.STATUSDIC == '检修中' || json.STATUSDIC == '已关闭') {

                        document.getElementById('E_btnOk2').style.display = 'none';
                        document.getElementById('E_btnCan2').style.display = 'none';
                    }

                    $("#arcArea").text(arcArea);//燃弧面积
                    document.getElementById('crossing_no').innerHTML = json.AREA_SECTION; // 运用区段
                    document.getElementById('line_code').innerHTML = json.LINE_NAME; //线路
                    document.getElementById('DUTY_RANGE').innerHTML = json.DUTY_RANGE; //班组
                    $("#DUTY_RANGE,#Tag-Local").attr("title", json.DUTY_RANGE);
                    map_wz = json.wz;
                    map_gis_x = json.GIS_X;
                    map_gis_y = json.GIS_Y;
                    map_gis_x_o = json.GIS_X_O;
                    map_gis_y_o = json.GIS_Y_O;
                    severity_code = json.SEVERITY_CODE;

                    if (!isRefresh) {
                        $('#hw').attr('src', json.hw + '?v=' + version);
                    }
                    // 获取红外透视图的原始大小
                    getHWTSSize();

                    let _a = '';
                    if (json.delay_vi === '') {
                        _a = '?r=0';
                    } else {
                        _a = '?r=1';
                    }
                    $('#kjg').attr('src', json.kjg + _a + '&v=' + version);
                    $('#allimg').attr('src', json.allimg + '&v=' + version);

                    $('#ul_status li').removeClass('li_status_over').addClass('li_status_out');
                    if (json.STATUSDIC != "" && json.STATUSDIC != null) {
                        //if (FunEnable('Fun_confirm_sample') === 'True') { //确认样本开关
                        //    if (json.STATUSDIC === '新上报') { //内部中，只要“已确认”了就显示确认样本按钮
                        //        $('.j-sample').css('display', 'none');
                        //    } else {
                        //        $('.j-sample').css('display', 'inline-block');
                        //    }
                        //}
                        $("#ul_status li:contains('" + json.STATUSDIC + "')").removeClass('li_status_out').addClass('li_status_over');

                        if (json.STATUSDIC == '已取消') {

                            $('#li_cancle').show();
                            $('#li_yqx,#li_yjh,#li_jxz,#li_ygb').hide();
                        }
                        else if (json.STATUSDIC == '已关闭') {
                            $("#ul_status li:contains('" + json.STATUSDIC + "')").removeClass('li_status_out_colse').addClass('li_status_over_colse');
                        }
                        else {
                            $('#li_cancle').hide();
                            $('#li_yqx,#li_yjh,#li_jxz,#li_ygb').show();
                        }

                        if (json.STATUSDIC == '已确认' && FunEnable("Fun_surebackground") == "True") {
                            $("#ul_status li:contains('" + json.STATUSDIC + "')").prevAll().removeClass('li_status_out').addClass('li_status_red');
                            $("#ul_status li:contains('" + json.STATUSDIC + "')").removeClass('li_status_over').addClass('li_status_red');
                        } else {
                            $("#ul_status li:contains('" + json.STATUSDIC + "')").prevAll().removeClass('li_status_out').removeClass('li_status_red').addClass('li_status_over');
                        }
                    };

                    document.getElementById('raised_time').innerHTML = json.RAISED_TIME; //发生时间

                    var cDate1 = new Date();
                    cDate2 = new Date(json.RAISED_TIME);

                    var cDate_ca = cDate1 - cDate2;

                    if (cDate_ca > 1000 * 60 * 60 * 48) {
                        $('#btn_replay').hide();
                        $('#btn_replay').attr("disabled", "disabled").attr('title', '超过6小时，无回放视频')
                    }

                    if (FunEnable("Fun_StatisticsTimes") == "True") {  //同点对比分析默认时间
                        if (GetQueryString("startdate") != null) {
                            $("#startTime").val(GetQueryString("startdate"));
                            $("#endTime").val(GetQueryString("enddate"));
                        } else {
                            $("#startTime").val(getDateStr(json.RAISED_TIME, parseInt(getConfig("RepeatDays"))) + "  00:00:00");// 参数表配置
                            $("#endTime").val(getDateStr(json.RAISED_TIME, 0) + "  23:59:59");//
                        }

                    } else {
                        $("#startTime").val(getDateStr(json.RAISED_TIME, parseInt(getConfig("RepeatDays"))) + "  00:00:00");// 参数表配置
                        $("#endTime").val(getDateStr(json.RAISED_TIME, 0) + "  23:59:59");//
                    }

                    document.getElementById('trainNo').innerHTML = json.LOCNO; //设备号
                    if (json.LOCNO != "" && json.PSD != "" && json.GSD != "") {
                        if (FunEnable('Fun_isCRH') === "False" || FunEnable('Fun_EOASshow') != "True") {
                            $("#trainInfo").attr("data-original-title", "<span style='display:inline-block;width:90px'>3C设备归属段：</span>" + json.GSD + "<br/><span style='display:inline-block;width:90px'>车辆配属段：</span>" + json.PSD);
                        } else {
                            $("#trainInfo").attr("data-original-title", "<span style='display:inline-block;width:90px'>3C设备归属段：</span>" + json.GSD + "<br/><span style='display:inline-block;width:90px'>车辆配属段：</span>" + json.PSD + "<br/><span style='display:inline-block;width:90px'>EOAS车次号：</span>" + json.EOAS_TRAINNO);
                        }
                    }
                    var criterion = '';//报警判断依据
                    if (json.CRITERION != "" && json.CRITERION != undefined && json.CRITERION != 'undefined'&&getConfig('debug')=='1') {
                        criterion = ('<br/>报警判断依据：' + json.CRITERION);
                    }
                    if (FunEnable('Fun_OriginalAlarmType') == "True" && json.INITIAL_CODE_NAME != "") {
                        $("#orAlarmType").attr("data-original-title", "<span style='font-weight:100;display:inline-block;'>原始报警类型：" + json.INITIAL_CODE_NAME + criterion + "</span>");
                    } else {
                        $("#orAlarmType").attr("data-original-title", "<span style='font-weight:100;display:inline-block;'>原始报警类型：无" + criterion +"</span>");
                    }
                    
                    document.getElementById('sudu').innerHTML = json.SPEED + 'km/h'; //速度
                    //判断速度是否为零
                    if (json.SPEED == 0) {
                        $("#yxjl").hide();
                    } else {
                        $("#yxjl").attr("data-original-title", "运行距离：" + ((1 / 50 * 11) * (json.SPEED / 3600) * 1000).toFixed(2) + "米");//缺陷运行距离(单位米)(以一秒50帧为例)
                    };
                    if ($(window).width() < 1281) {
                        $('#trainInfo,#yxjl').tooltip({ "placement": "left", delay: { show: 0, hide: 0 }, });
                        $("#btn_raised_time").siblings("tooltip").css("left", "0");
                    }
                    if ($(window).width() < 1440) {
                        $('#yxjl').tooltip({ "placement": "top", delay: { show: 0, hide: 0 }, });
                    }
                    if (FunEnable('Fun_OriginalAlarmType') == "True") {

                        setTimeout(LC_choose_notOne, 1000);
                     //   LC_choose_notOne()//多组拉出值请求

                    }
                    //加锁功能
                    if (FunEnable('Fun_lock_sureOrcancel') == "True" && lockTime < 1) {
                        let loginId = json_user.loginId
                        if (json.LOCK_PERSON_ID != '') {
                            $('#alarm_clock').attr({
                                'title_tips': json.LOCK_TIME, 'name': json.LOCK_PERSON_NAME
                            })
                            $('#alarm_clock').find('span:eq(0)').addClass('btn-lock-ico-selected');
                            if (json.LOCK_PERSON_ID != loginId) {//不是当前用户隐藏处理报警按钮
                                $("#btn-start").css({ 'z-index': '0', 'opacity': '0' })
                                $('.editorBtn').hide()
                                lockType = true;
                            }
                        } else if (loginId != 'admin') {
                            lockAlarm();
                            lockTime++;
                        }
                    }

                    document.getElementById('wendu').innerHTML = json.WENDU; //温度
                    document.getElementById('hjwendu').innerHTML = json.HJWENDU; //温度
                    if (json.LINE_HEIGHT != "") {
                        document.getElementById('dgz').innerHTML = json.LINE_HEIGHT + "mm"; //导高
                    } else {
                        $("#dgzdcz").hide();
                    }
                    if (json.PULLING_VALUE != "") {
                        document.getElementById('lcz').innerHTML = json.PULLING_VALUE + "mm"; //拉出值
                    }

                    document.getElementById('txtDefect').innerHTML = json.ALARM_ANALYSIS;
                    $('#txtDefect').attr('data-original-title', json.ALARM_ANALYSIS);
                    document.getElementById('Reporter').innerHTML = json.REPORT_PERSON;//报告人
                    if (json.REPORT_PERSON != '' && json.REPORT_PERSON != undefined) {
                        $("#Reporte_time").show();
                        $("#Reporte_time").attr('data-original-title', '报告时间：</br>' + json.REPORT_DATE);
                    } else {
                        $("#Reporte_time").hide()
                    }

                    document.getElementById('txtAdvice').innerHTML = json.PROPOSAL;
                    $('#txtAdvice').attr('data-original-title', json.PROPOSAL);

                    document.getElementById('txtNote').innerHTML = json.REMARK;
                    $('#txtNote').attr('data-original-title', json.REMARK);

                    if ($(window).width() <= 1440 && $(window).width() > 0) {
                        $('#Reporte_time').tooltip({ "placement": "left", delay: { show: 0, hide: 0 }, });
                    } else {
                        $('#Reporte_time').tooltip({ "placement": "top", delay: { show: 1, hide: 0 } });
                    }
                    $('#btn_raised_time').tooltip({ "placement": "bottom", delay: { show: 0, hide: 0 }, });

                    //检测值-燃弧
                    //燃弧大小
                    if ('' !== json.ARCING_AREA && FunEnable('Fun_Arcing_Paramter') == "True") {
                        $('#arcArea').parent().css('display', 'inline-block');
                        $('#arcArea').text(json.ARCING_AREA + '%');
                    } else {
                        $('#arcArea').parent().css('display', 'none');
                    }
                    //燃弧形状
                    if ('' !== json.SPARK_SHAPE && FunEnable('Fun_Arcing_Paramter') == "True") {
                        $('#rh-shape').parent().css('display', 'inline-block');
                        $('#rh-shape').text(json.SPARK_SHAPE);
                    } else {
                        $('#rh-shape').parent().css('display', 'none');
                    }
                    //燃弧时长
                    if ('' !== json.SPARK_ELAPSE && FunEnable('Fun_Arcing_Paramter') == "True") {
                        $('#rh-duration').parent().css('display', 'inline-block');
                        $('#rh-duration').text(json.SPARK_ELAPSE + 'ms');
                    } else {
                        $('#rh-duration').parent().css('display', 'none');
                    }
                    //燃弧个数
                    if ('' !== json.SPARK_NUM && FunEnable('Fun_Arcing_Paramter') == "True") {
                        $('#rh-number').parent().css('display', 'inline-block');
                        $('#rh-number').text(json.SPARK_NUM);
                    } else {
                        $('#rh-number').parent().css('display', 'none');
                    }
                    //燃弧像素
                    if ('' !== json.SPART_PIXELS && FunEnable('Fun_Arcing_Paramter') == "True") {
                        $('#rh-pixel').parent().css('display', 'inline-block');
                        $('#rh-pixel').text(json.SPART_PIXELS + '个');
                    } else {
                        $('#rh-pixel').parent().css('display', 'none');
                    }

                    //检测值-tax箱
                    if (FunEnable('Fun_isCRH') === "False") { //机车
                        $('#tax-monitor-status').parent().css('display', 'inline-block');
                        $('#tax-shunting-state').parent().css('display', 'inline-block');
                        $('#tax-filling-machine').parent().css('display', 'inline-block');
                        if ('0' === json.TAX_MONITOR_STATUS || '' === json.TAX_MONITOR_STATUS) {
                            $('#tax-monitor-status').text('降级'); //tax监控状态
                        } else {
                            $('#tax-monitor-status').text('监控状态'); //tax监控状态
                        }
                        if ('0' === json.TAX_SCHEDULE_STATUS || '' === json.TAX_SCHEDULE_STATUS) {
                            $('#tax-shunting-state').text('非调车'); //tax调车状态
                        } else {
                            $('#tax-shunting-state').text('调车状态'); //tax调车状态
                        }
                        if ('0' === json.TAX_POSITION || '' === json.TAX_POSITION) {
                            $('#tax-filling-machine').text('补机'); //tax本补机
                        } else {
                            $('#tax-filling-machine').text('本机'); //tax本补机
                        }
                    } else { //动车
                        $('#tax-monitor-status').parent().css('display', 'none');
                        $('#tax-shunting-state').parent().css('display', 'none');
                        $('#tax-filling-machine').parent().css('display', 'none');
                    }

                    document.getElementById('severity').innerHTML = json.SEVERITY; //级别
                    if (json.SEVERITY_CODE == '三类') {//三级不展示任务处理
                        $('#E_btnTask').addClass('hidden')
                    }
                    document.getElementById('SUMMARYDIC').innerHTML = json.SUMMARYDIC; //故障状态
                    $("#SUMMARYDIC").attr("code", json.SUMMARYDICCODE);//故障状态code

                //    get_sample_type($('#SUMMARYDIC').attr('code'));

                    $('#alarmType').attr('code', json.SUMMARYDICCODE).val(json.SUMMARYDIC); //报警类型
                    _cur_sample = json.SAMPLE_NAME;
                    //确认样本 报警类型
                    $('#alarmType').mySelectTree_Level2({
                        codeType: '3C',
                        onClick: function () {
                            get_sample_type($('#alarmType').attr('code'));
                        },
                        callback: function () {
                            get_sample_type($('#alarmType').attr('code'));
                        }
                    });
                    var alarmcode = json.CUST_ALARM_CODE;
                    if (alarmcode == "") {
                        var alarmc = json.LOCNO + "_" + json.RAISED_TIME.substring(2, 19).replace(/\D/g, '');
                        document.getElementById('HideAlarmCode').innerHTML = alarmc;
                    } else {
                        document.getElementById('HideAlarmCode').innerHTML = alarmcode;//隐藏的告警编码
                    }
                    document.getElementById('AlarmCode').innerHTML = alarmcode;//告警编码
                    $('#AlarmCode').attr('title', alarmcode);
                    if ($(window).width() <= 1367 && $(window).width() > 1280 || $(window).width() <= 1024 && $(window).width() > 0) {
                        //设置标签隐藏的内容显示
                        var _interval;
                        _html = '<span class="word-break">' + alarmcode + '</span>';
                        $(document).on('mouseenter', '#AlarmCode', function () {
                            _index_alarmcode = layer.tips(_html, $(this), {
                                tips: [1, '#000'],
                                time: ''
                            });
                            $('#layui-layer' + _index_alarmcode).css('top', parseInt($('#layui-layer' + _index_alarmcode).css('top').split('p')[0]) + 10 + 'px');
                            clearInterval(_interval);
                        }).on('mouseleave', '#AlarmCode', function () {
                            _interval = setInterval('closeTip()', 100);
                            $(document).on('mouseenter', '#layui-layer' + _index_alarmcode, function () {
                                clearInterval(_interval);
                            }).on('mouseleave', '#layui-layer' + _index_alarmcode, function () {
                                _interval = setInterval('closeTip()', 200);
                            });
                        });

                        //设置编码隐藏的内容显示
                        var _interval;
                        _html = '<span class="word-break">' + alarmcode + '</span>';
                        $(document).on('mouseenter', '#HideAlarmCode', function () {
                            _index_alarmcode = layer.tips(_html, $(this), {
                                tips: [1, '#000'],
                                time: ''
                            });
                            $('#layui-layer' + _index_alarmcode).css('top', parseInt($('#layui-layer' + _index_alarmcode).css('top').split('p')[0]) + 10 + 'px');
                            clearInterval(_interval);
                        }).on('mouseleave', '#HideAlarmCode', function () {
                            _interval = setInterval('closeTip()', 100);
                            $(document).on('mouseenter', '#layui-layer' + _index_alarmcode, function () {
                                clearInterval(_interval);
                            }).on('mouseleave', '#layui-layer' + _index_alarmcode, function () {
                                _interval = setInterval('closeTip()', 200);
                            });
                        });
                    }
                    //如果是几何参数缺陷就展示拉出值曲线
                    if (IsJHCS(json.SUMMARYDIC)) {
                        $("#lc").click();
                    }

                    if (json.IS_TYPICAL == "1") {
                        $('#ckdj span:eq(0)').addClass("btn-defects-ico-selected");
                    } else {
                        $('#ckdj span:eq(0)').removeClass("btn-defects-ico-selected");
                    }
                    if (json.ISEXPORTREPORT == "1") {
                        $('#signPortout span:eq(0)').addClass("btn-mark-ico-selected");
                    } else {
                        $('#signPortout span:eq(0)').removeClass("btn-mark-ico-selected");
                    }

                    if (json.TASKSTATUS == "完成" || json.TASKSTATUS == "取消") {
                        $("#btn_Feedback").css("display", "inline-block");
                        $("#btn_Feedback").attr("onclick", "javascript:downloadFeedback('" + json.MISID + "')");
                    }
                    if (json.MISID != "") {
                        $("#btn_notice").css("display", "inline-block");
                        $("#btn_notice").attr("onclick", "javascript:downloadnotice('" + json.MISID + "')");
                    }

                    //原始文件下载
                    if (FunEnable('Fun_GetData') == "False") {
                        $('#OriginalFile').hide();
                    } else {
                        $("#OriginalFile").css("display", "inline-block");
                    }
                    
                        loadOriginalFileBox();//同级目录 MonitorAlarm3CForm4_OriginaFile.js 原始文件下载相关事件
                    
                    $('#alarmDescription').html(json.LOCNO + ' '+json.RAISED_TIME +' '+ json.SEVERITY  +' '+ json.SUMMARYDIC)
                    $('#OriginalFile_look').unbind('click').click(function () {
                        window.open('/C3/PC/MLiveStreaming/OriginalFile.html?&alarmid=' + json.ID );
                    });
                    //$('#OriginalFile_creat').unbind('click').click(function () {
                    //    window.open('/C3/PC/MLiveStreaming/OriginalFile.html?tyep=NewSearch&alarmid=' + json.ID + '&line=' + escape(json.line) + '&linecode=' + json.LINE_CODE + '&position=' + escape(json.position) + '&positioncode=' + json.POSITION_CODE + '&Bridgecode=' + json.BRIDGE_TUNNEL_NO + '&direction=' + escape(json.DIRECTION) + '&pole=' + escape(json.POLE_NUMBER) + '&locno=' + json.LOCNO);
                    //});
                    $('#OriginalFile_time').unbind('click').click(function () {//按时间 新建任务
                        resetOriginalFile_location();//重置下载弹框相关input值
                        loadOriginalFile_location('time',json.RAISED_TIME, json.LOCNO, json.BOW_TYPE, json.line, json.LINE_CODE, json.position, json.POSITION_CODE, json.BRIDGE_TUNNEL_NO, json.DIRECTION, json.POLE_NUMBER);//绑定下载弹框相关input值
                        layer.open({
                            title: false,
                            closeBtn: 1,
                            area: '521px',
                            type: 1,
                            shade: 0.5,
                            content: $("#OriginalFileBox")
                        })
                    })
                    $('#OriginalFile_location').unbind('click').click(function () {//按位置 新建任务
                        resetOriginalFile_location();//重置下载弹框相关input值
                        loadOriginalFile_location('location', json.RAISED_TIME, json.LOCNO, json.BOW_TYPE, json.line, json.LINE_CODE, json.position, json.POSITION_CODE, json.BRIDGE_TUNNEL_NO, json.DIRECTION, json.POLE_NUMBER);//绑定下载弹框相关input值
                        layer.open({
                            title: false,
                            closeBtn: 1,
                            area: '521px',
                            type: 1,
                            shade: 0.5,
                            content: $("#OriginalFileBox")
                        })
                    })

                    if (FunEnable('Fun_Btn_raisedTime') == "True") {  //延时按钮显示
                        $('#btn_raised_time').show();

                        var memo = '';
                        if (json.dtime_hw != '0001/1/1 0:00:00')
                            memo += '<div class="toolbg" ><span class="sptime">红外上报时间：</span>' + json.dtime_hw + '  &nbsp;&nbsp;延时：' + json.delay_hw + '<br/>';

                        if (json.dtime_vi != '0001/1/1 0:00:00')
                            memo += '<span class="sptime">可见光上报时间：</span>' + json.dtime_vi + '  &nbsp;&nbsp;延时：' + json.delay_vi + '<br/>';

                        if (json.dtime_all1 != '0001/1/1 0:00:00')
                            memo += '<span class="sptime">全景1上报时间：</span>' + json.dtime_all1 + '  &nbsp;&nbsp;延时：' + json.delay_all1 + '<br/>';

                        if (json.dtime_all2 != '0001/1/1 0:00:00')
                            memo += '<span class="sptime">全景2上报时间：' + json.dtime_all2 + '</span>  &nbsp;&nbsp;延时：' + json.delay_all2 + '<br/>';

                        if (json.dtime_file != '0001/1/1 0:00:00')
                            memo += '<span class="sptime">同步文件上报时间：</span>' + json.dtime_file + '  &nbsp;&nbsp;延时：' + json.delay_file + '<br/><span class="">点击查看详情</span>';

                        memo += "</div>";


                        $('#btn_raised_time').attr('data-original-title', memo);

                        $('#box_delay_content').html(memo);

                        $('#btn_raised_time').on('shown.bs.tooltip', function () {
                            // 执行一些动作...

                            $('.tooltip').width(420);
                            $('.toolbg').css('padding', "30px 15px 15px 5px")
                            $('.tooltip-inner').css('max-width', '1000px');
                        })
                    }
                
                    try {
                        if (json.ORGINAL != '') {  //原始数据按钮显示
                            $('#btn_vedio_play').show();
                        }
                    } catch (e) {
                        console.log('json.ORGINAL  原始数据无该字段')
                    }

                    if (FunEnable('Fun_Btn_CreatedTime') == "True") { //侯马显示接收时间功能
                        $('#btn_created_time').show();

                        var _Html = "";
                        if (json.CREATED_TIME != '0001/1/1 0:00:00') {
                            _Html = "<span style='font-weight:100;display:inline-block;'>接收时间：" + json.CREATED_TIME + "</span>";
                            $('#btn_created_time').attr('data-original-title', _Html);

                            if (FunEnable('Fun_Btn_LengthTime') == "True") {  //传输时长显示
                                _Html = "<span style='font-weight:100;display:inline-block;'>接收时间：" + json.CREATED_TIME + "</span><br /><span style='font-weight:100;display:inline-block;'>传输时间：" + json.CREATED_TIMESPAN + "</span>";
                                $('#btn_created_time').attr('data-original-title', _Html);
                            }
                        }
                    };

                    // -------------------------------------------------- 创建元素放入位置元素中 start
                    $('#WZ_fz').remove(); //位置提示
                    var wz_fz;
                    if (json.wz_fz != '') {
                        wz_fz = '<span id="WZ_fz" class="icon icon-orange icon-tag ml-ss" title="" data-html="true" data-rel="tooltip" style="cursor:pointer;" data-original-title="<div style=\'padding:10px;\'><br/><br/>辅助定位：' + json.wz_fz.replace(/\[/g, '<br/>\[') + '</div>"></span>';
                    } else {
                        wz_fz = '<span id="WZ_fz" class="icon icon-orange icon-tag ml-ss" title="" data-html="true" data-rel="tooltip" style="cursor:pointer;display:none" data-original-title=""></span>';
                    }

                    $('#jltr').remove();//交路信息
                    $('#jlh').remove();// 交路号
                    $('#crossing_no').remove();// 运用区段
                    $('#line_code').remove();// 线路
                    $('#STATION_NO').remove();// 车站
                    var jltr = '<span id="jltr" style="display:none"> '
                                    + '交路号：<span id="jlh">' + json.CROSSING_NO + '</span>'
                                    + '运用区段：<span id="crossing_no">' + json.AREA_SECTION + '</span>'
                                    + '线路： <span id="line_code">' + json.LINE_NAME + '</span>'
                                    + '车站：<span id="STATION_NO">' + json.STATION_NO + '</span>'
                                + '</span>';

                    $('#satellites').remove();// 查看地理位置
                    $('#map_img').remove();// 图片
                    $('#xj').remove();// 卫星数
                    var satellites = '<a href="#" id="satellites" class="ml-ss" onclick="MapAfterClick()">'
                                        + '<img src="/Common/img/roll.gif" style="display: inline-block" />'
                                        + '<span id="xj" class="xj" title="查看地理位置【快捷键‘M’】">卫星数:' + json.xj + '</span>'
                                    + '</a>';

                    $('#DUTY_RANGE').remove();// 范围
                    $('.locale_big_gs').remove();
                    var duty_range = '<span class="locale_big_gs"><span id="DUTY_RANGE" title="' + json.DUTY_RANGE + '">' + json.DUTY_RANGE + '</span></span>';

                    var pole_devive = '';
                    var num = json.POLE_NUMBER;
                    //支柱基本信息
                    if (device_id == "" && num == "" && getConfig('debug') == "1") {
                        pole_devive = '<span id="pole_devive" class="icon icon-orange icon-pin ml-ss" title="" data-html="true" data-rel="tooltip" style="cursor:pointer;color:red;" data-original-title="<div>未匹配到支柱<br/>点击图标查看地图</div>"></span>';
                    } else  {
                        pole_devive = '<span id="pole_devive" class="icon icon-orange icon-pin ml-ss" title="" data-html="true" data-rel="tooltip" style="cursor:pointer;display:none" data-original-title=""></span>';
                    } ;

                    //支柱属性
                    var poleDetail = ' <a href="javascript:void(0)" style="">\
                                                    <img src="img/c3from4Pole.png" style="display: none" id="poleDetail" data-html="true" data-rel="tooltip" />\
                                                </a>'

                    document.getElementById('WZ').innerHTML = json.wz.replace(/&nbsp;/, "") + pole_devive + poleDetail + wz_fz + jltr + satellites + duty_range;

                    //if (json.DEVICE_ID != '') {
                    //    setTimeout(function () {
                    //        getpoleDetail(json.DEVICE_ID);//杆属性请求
                    //    }, 1000);
                    //}
                    if (device_id != "") {
                        setTimeout(function () {
                            loaddeviceidInfo(device_id, num);

                        }, 1000);
                    }
                    //tooltip 设置以及触发 ----------------start
                    $('#pole_devive').tooltip({ "placement": "bottom" });
                    $('#pole_devive').on('shown.bs.tooltip', function () {
                        //$('.tooltip').width(450);

                        $('.toolbg').css('padding', "30px 15px 15px 5px")
                        $('.tooltip-inner').css('max-width', '1000px');

                    })
                    //--------------------------------------end
                    $('#WZ').attr('title', json.wz.split("<a")[0].replace(/&nbsp;/g, " "));
                    $('#pole_devive,#poleDetail').tooltip({ "placement": "bottom", delay: { show: 0, hide: 1 } });

                    //响应点击事件
                    $('#pole_devive').click(function () {
                        try {
                            if (json.GIS_X != "" && json.GIS_X != 0 && json.GIS_Y != "" && json.GIS_Y != 0 && json.GIS_Y != undefined && json.GIS_X != undefined) {
                                var url = '/Common/MOnePoleData/getGisPoint.html?&device_id=' + device_id + '&gis_x=' + json.GIS_X + '&gis_y=' + json.GIS_Y;
                                window.open(url);
                            }
                        } catch (e) {
                        }
                    });

                    //$('#WZ a:eq(1)').attr('id', 'polenoinfo');
                    // -------------------------------------------------- 创建元素放入位置元素中 end

                    //销号状态 star
                    if (FunEnable('Fun_Cancel_Number') == "True") {
                        if (json.PROCESS_STATUS == "已销号") {
                            $("#cancelNumber>span").css("color", "#42a2da");
                            $("#cancelNumber>img").attr("src", "img/cancelNumber.png");
                        } else if (json.PROCESS_STATUS == "未销号") {
                            $("#cancelNumber>span").css("color", "#f68d25");
                            $("#cancelNumber>img").attr("src", "img/noCancelNumber.png");
                        } else {
                            $("#cancelNumber>span").css("color", "#555555");
                            $("#cancelNumber>img").attr("src", "img/noStatus.png");
                        }
                        $("#cancelNumber").css("display", "inline-block");
                    } else {
                        $("#cancelNumber").css("display", "none");
                    }

                    if (json.STATUSDIC != "新上报" && json.STATUSDIC != "已关闭") {
                        //修改销号状态
                        //$("#cancelNumber>img").click(function () {
                        //    $('#Cancel_Number').modal();
                        //});
                    };

                    $("#Cancel_Number_code").val(json.PROCESS_STATUS);
                    //销号状态 end

                    document.getElementById('BOW_TYPE').innerHTML = json.BOW_TYPE; //弓位置

                    if (json.MisShow == "false") { //在报警详情页取消报警后，对按钮的处理（只隐藏查看任务按钮）
                        document.getElementById('modal-task').style.display = 'none';
                        if (FunEnable('Fun_TaskManage') == "False") {
                            document.getElementById('E_btnTask').style.display = 'none';
                            try {
                                document.getElementById('eachC_save').style.display = 'none';
                            } catch (e) { }
                            $('#eachC_manage').find('li[class="Mission"]').hide();
                        }
                    } else { //在任务处理中取消报警后，对按钮的处理（只显示导出、查看任务按钮）
                        if (FunEnable('Fun_TaskManage') == "True") {
                            document.getElementById('modal-task').style.display = '';
                        } else {
                            document.getElementById('modal-task').style.display = 'none';
                        }
                        document.getElementById('E_btnTask').style.display = 'none';
                        document.getElementById('E_btnOk2').style.display = 'none';
                        document.getElementById('E_btnCan2').style.display = 'none';

                        try {
                            $('#eachC_save', document).hide(); //收藏至
                            $('#eachC_manage', document).hide(); //批量
                        } catch (e) { }

                        document.getElementById('taskid').value = json.MISID;
                    }

                    if (FunEnable('Fun_CollectAndBatchHandle') === 'False') {
                        $('#eachC_manage').hide();
                    }
                    urlControl_new()//权限判断

                    GPSJson = json;
                    $("#irvA").attr("onclick", "javascript:downloadMFC3('" + json.ID + "')");
                    $('#irvA_HistoryAlarm').attr("onclick", "javascript:downloadMFC3_HistoryAlarm('" + json.ID + "')");//导出含报警历史的MFC3文件
                    var alarmID = GetQueryString("alarmid");
                    if (!isRefresh) {
                        getAlarminfo(alarmID);
                    } else {
                        JsonAlarm = AlarmJson_3Cform4;
                        //显示拉出值曲线
                        createLC_LineChart();
                        $("#linechart").hide();
                        $("#lc_chart").show();
                        $("#dg_chart").hide();
                        $("#wd_chart").hide();
                        $("#chartTitle").text("拉出值曲线");
                        //当前红外信息
                        ReturnInfo(curNumber);
                    }
                    isRefresh = false;
                    modalShow();//加载同点对比条件设置    在页面加载完成后加载同点对比设置

                }

            }
            // 重置元素尺寸
            reset_element_size();
        }
    });



    LoadSave();
    //accessCount();
    return C_json;
};

/**
 * @desc 浏览量更新
 * @param 
 */
function accessCount() {
    var url = '/C3/PC/MAlarmMonitoring/RemoteHandlers/GetMonitorAlarmC3Form.ashx?type=update&alarmid=' + GetQueryString('alarmid');
    $.ajax({
        type: 'post',
        url: url,
        async: true,
        cache: false,
        success: function () {

        }
    });
}

function downloadMFC3(_id) {
    window.open('/C3/PC/MAlarmMonitoring/downLoadMFC3.aspx?id=' + _id);
}
//导出MFC3文件（含报警历史）
function downloadMFC3_HistoryAlarm(_id) {
    window.open('/C3/PC/MAlarmMonitoring/downLoadMFC3.aspx?scencesample_sign=1&id=' + _id);
}

var option; //表格内容
//同点
function loadFlexitdGrid() {
    var version = getConfig("marcar");
    if (version == "1") {
        option = {
            url: 'RemoteHandlers/GetAlarmTD.ashx?alarmid=' + GetQueryString("alarmid"),
            dataType: 'json',
            colModel: [
                             { display: '开始时间', name: 'START_TIME', width: 150, sortable: false, align: 'center', hide: true },
			                { display: '数据类型', name: 'CATEGORY_CODE', width: 80, sortable: false, align: 'center' },
			                { display: '结束时间', name: 'END_TIME', width: 50, sortable: false, align: 'center', hide: true },
                            { display: '摘要', name: 'SUMMARY', width: 430, sortable: false },
                            { display: '线路', name: 'LINE_CODE', width: 80, sortable: false, align: 'center', hide: true },
                            { display: 'X', name: 'GIS_X', width: 80, sortable: false, align: 'center', hide: true },
                            { display: 'Y', name: 'GIS_Y', width: 80, sortable: false, align: 'center', hide: true },
                            { display: '行别', name: 'DIRECTION', width: 80, sortable: false, align: 'center', hide: true },
                            { display: '公里标', name: 'KM_MARK', width: 80, sortable: false, align: 'center', hide: true },
                            { display: '重复报警ID', name: 'ALAEM_ID', width: 80, sortable: false, align: 'center', hide: true },
                            { display: '查看明细', name: 'SelectInfo', width: 100, sortable: false, align: 'center' },
                            { display: '主键', name: 'ID', width: 80, sortable: false, pk: true, hide: true, align: 'center' }
            ],
            usepager: false,
            useRp: false,
            width: window.screen.width / 2 - 30,
            height: flexTablebh - 280,
            rowId: 'ID',
            rp: PageNum
        }
    } else {
        option = {
            url: 'RemoteHandlers/GetAlarmTD.ashx?alarmid=' + GetQueryString("alarmid"),
            dataType: 'json',
            colModel: [
			                { display: '数据类型', name: 'CATEGORY_CODE', width: 50, sortable: false, align: 'center' },
                            { display: '摘要', name: 'DETAIL', width: 220, sortable: false, align: 'center' },
                            { display: '查看明细', name: 'SelectInfo', width: 80, sortable: false, align: 'center' },
                            { display: '主键', name: 'ID', width: 80, sortable: false, pk: true, hide: true, align: 'center' }
            ],
            usepager: false,
            useRp: false,
            width: $(window).width() / 2,
            height: flexTablebh - 280,
            rowId: 'ID',
            rp: PageNum
        }

    }

    $("#flexTabletd").flexigrid(option);
};
//临近
function loadFlexiljGrid() {
    option = {
        url: 'RemoteHandlers/GetAlarmLJ.ashx?alarmid=' + GetQueryString("alarmid"),
        dataType: 'json',
        colModel: [
                            { display: '杆号', name: 'POLE_NUMBER', width: 50, sortable: false, align: 'center' },
                            { display: '时间', name: 'RAISED_TIME', width: 150, sortable: false, align: 'center' },
			                { display: '数据类型', name: 'CATEGORY_CODE', width: 50, sortable: false, align: 'center' },
			                { display: '级别', name: 'SEVERITY', width: 50, sortable: false, align: 'center' },
                            { display: '摘要', name: 'SUMMARY', width: 110, sortable: false, align: 'center' },
                            { display: '状态', name: 'STATUS', width: 80, sortable: false, align: 'center' },
                            { display: '查看明细', name: 'SelectInfo', width: 80, sortable: false, align: 'center' },
                            { display: '主键', name: 'ID', width: 80, sortable: false, pk: true, hide: true, align: 'center' }
        ],
        usepager: false,
        useRp: false,
        width: 'auto',
        height: flexTablebh - 250,
        singleSelect: true,
        rowId: 'ID',
        rp: PageNum

    }
    $("#flexTablelj").flexigrid(option);
};
//查看详细信息
function selectInfo(rowdata) {
    var type = $('div', rowdata)[1].innerHTML; //类型
    var alarmid = rowdata.id.substr(1);
    //  document.getElementById('alarmInfo').src = "MonitorAlarmMiniForm.htm?alarmid=" + alarmid + "&type=" + type;
    //  document.getElementById('modal-td').click();

    window.open("/C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=" + alarmid + '&v=' + version);

};


//弹出任务
function taskOpen() {
    var taskid = document.getElementById('taskid').value;
    var _url = "/Common/MTask/TaskHandle.htm?id=" + taskid + "&type=openFaultTask&operaType=review" + '&v=' + version;
    ShowMTwin(_url);
};

function ShowMTwin(str) {
    $("#tanchu").attr("href", str + "&closeBtn=hide&lightbox[iframe]=true&lightbox[width]=95p&lightbox[height]=90p");
    $("#tanchu").click();
};
//查看详细信息
function selectRepeatInfo() {
    window.open("/Common/MDataAnalysis/C3RepeatAlarmImg.aspx?showclose=false&id=" + GetQueryString("alarmid") + "&temp=" + Math.random());
};

//按钮点击事件
function btnOnClick(btntype) {

    if ("btnTask" == btntype) {
        var url = "/Common/MTask/TaskHandle.htm?id=" + GetQueryString("alarmid") + "&type=openFaultTask&toTaskType=" + '&v=' + version;
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

function ShowMTwin(str) {
    $("#tanchu").attr("href", str + "&lightbox[iframe]=true&lightbox[width]=95p&lightbox[height]=90p");
    $("#tanchu").click();
};
//确认/取消告警
function btnAlarmUpdate() {
    if (yzAlarmData()) {
        var btntype = document.getElementById('updatetype').value;
        var afcode = document.getElementById('citySel').value; //缺陷类型
        var severity = document.getElementById('Useverity').value; //等级
        var txtDefect = document.getElementById('UtxtDefect').value; //缺陷分析
        var txtAdvice = document.getElementById('UtxtAdvice').value; //处理建议
        var txtNote = document.getElementById('UtxtNote').value; //备注
        var txtReporter = document.getElementById('UtxtReporter').value; //报告人
        var reportdate = document.getElementById('Ureportdate').value; //日期
        var Alarmcode = document.getElementById('alarmcode').value; //告警编码

        if (txtDefect.length > 250) {
            ymPrompt.succeedInfo('缺陷分析最多250个字', null, null, '提示信息', null);
            return;
        }

        if (txtAdvice.length > 250) {
            ymPrompt.succeedInfo('处理建议最多250个字', null, null, '提示信息', null);
            return;
        }

        if (txtNote.length > 250) {
            ymPrompt.succeedInfo('备注最多250个字', null, null, '提示信息', null);
            return;
        }



        //调用更新方法
        var responseData = XmlHttpHelper.transmit(false, "get", "text", "RemoteHandlers/MonitorAlarmSave.ashx?alarmid=" + GetQueryString("alarmid") + "&btntype=" + btntype + "&txtDefect=" + escape(txtDefect) + "&txtAdvice=" + escape(txtAdvice) + "&txtNote=" + escape(txtNote) + "&txtReporter=" + escape(txtReporter) + "&reportdate=" + reportdate + "&afcode=" + escape(afcode) + "&severity=" + escape(severity) + "&tmpe=" + Math.random() + "&Alarmcode=" + Alarmcode, null, null);
        if (responseData != null && responseData != "") {
            ymPrompt.succeedInfo('保存成功', null, null, '提示信息', null);
            loadC3Form();
        } else {
            ymPrompt.errorInfo('操作失败！请联系管理员', null, null, '提示信息', null);
        }
        document.getElementById('btncols').click();
    }
    else {
        return false;
    }
};
//验证数据
function yzAlarmData() {
    var btntype = document.getElementById('updatetype').value;
    var YZ = 0;
    if (btntype == "btnOk") {
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
function btnClose() {
    window.close(this);
    if (GetQueryString("rsurl") == "no") {

    } else if (GetQueryString("rsurl") != undefined && GetQueryString("rsurl") != "no") {
        opener.location.href = GetQueryString("rsurl");
    } else {
        opener.location.href = 'MonitorLocoAlarmList.htm';
    }

};

////鼠标点击弹出层
//$(function () {
//    $('#hw').click(function () {
//        if (!$('#note').is(':visible')) {
//            $('#note').css({ display: 'block', top: '0' }).animate({ top: '+5' }, 500);
//        }
//    });
//});

var BigimgPath;
var bigtype;
function ALLimg(e, type) {
    Suspended();
    //document.getElementById("note").style.display = "none";
    document.getElementById("table").style.display = "none";
    document.getElementById("BigDiv").style.display = "";
    document.getElementById("main").style.display = "none";
    document.getElementById("BigImg").src = e.src;
    bigtype = type;
    if (type == "HW") {
        BigImgPlayhw();
    } else if (type == "KJG") {
        BigImgPlaykjg();
    } else {
        BigImgPlayqj();
    }
};

function CloseALLimg(e) {
    clearInterval(setbig);
    ImgShuffling();
    document.getElementById("table").style.display = "";
    document.getElementById("BigDiv").style.display = "none";
    if (isqj == 1) {
        document.getElementById("main").style.display = "";
    } else {
        document.getElementById("main").style.display = "none";
    }
};

var setbig;
//全屏播放红外
function BigImgPlayhw() {
    if (ImgNum == imaCount) {
        document.getElementById("BigImg").src = dirpath + Imgjson.IRV_DIR_NAME + imaname + ".JPG";
        document.getElementById("Biglocnew").style.display = "none";
        document.getElementById("Biglocold").style.display = "";
        document.getElementById("Biglocinfo").innerHTML = locinfo;
        ImgNum = Imgjson.START_INDEX; //计数器还原
        clearInterval(setbig); //关闭定时器 
        setbig = setInterval('BigImgPlayhw()', 5000);
    }
    else {
        document.getElementById("BigImg").src = dirpath + Imgjson.IRV_DIR_NAME + imaname + ImgNum + ".JPG";
        bindBigLog(InfoNum);
        ImgNum++;
        InfoNum++;
        clearInterval(setbig);
        setbig = setInterval('BigImgPlayhw()', 500);
    }
};
//全屏播放可见光
function BigImgPlaykjg() {
    if (ImgNum == imaCount) {
        document.getElementById("BigImg").src = dirpath + Imgjson.VI_DIR_NAME + jpgname + Imgjson.START_INDEX + ".JPG";
        document.getElementById("Biglocnew").style.display = "none";
        document.getElementById("Biglocold").style.display = "";
        document.getElementById("Biglocinfo").innerHTML = locinfo;
        ImgNum = Imgjson.START_INDEX; //计数器还原
        clearInterval(setbig); //关闭定时器
        setbig = setInterval('BigImgPlaykjg()', 5000);
    }
    else {
        document.getElementById("BigImg").src = dirpath + Imgjson.VI_DIR_NAME + jpgname + ImgNum + ".JPG";
        bindBigLog(InfoNum);
        ImgNum++;
        InfoNum++;
        clearInterval(setbig);
        setbig = setInterval('BigImgPlaykjg()', 500);
    }
};
//全屏播放全景
function BigImgPlayqj() {
    if (ImgNum == imaCount) {
        document.getElementById("BigImg").src = dirpathall + Imgjson.START_INDEX + ".JPG";
        document.getElementById("Biglocnew").style.display = "none";
        document.getElementById("Biglocold").style.display = "";
        document.getElementById("Biglocinfo").innerHTML = locinfo;
        ImgNum = Imgjson.START_INDEX; //计数器还原
        clearInterval(setbig); //关闭定时器 
        setbig = setInterval('BigImgPlayqj()', 5000);
    }
    else {
        document.getElementById("BigImg").src = dirpathall + ImgNum + ".JPG";
        bindBigLog(InfoNum);
        ImgNum++;
        InfoNum++;
        clearInterval(setbig);
        setbig = setInterval('BigImgPlayqj()', 500);
    }
};

function bindBigLog(i) {
    if (i > 9) {
        InfoNum = 0;
        i = InfoNum;
    }
    document.getElementById("Biglocnew").style.display = "";
    document.getElementById("Biglocold").style.display = "none";
    document.getElementById("zgwd11").innerHTML = Imgjson.FRAME_INFO[i].TEMP_IRV / 100;
    document.getElementById("hjwd11").innerHTML = Imgjson.FRAME_INFO[i].TEMP_ENV / 100;
    document.getElementById("dgz11").innerHTML = Imgjson.FRAME_INFO[i].LINE_HEIGHT;
    document.getElementById("lcz11").innerHTML = Imgjson.FRAME_INFO[i].PULLING_VALUE;
    document.getElementById("sd11").innerHTML = Imgjson.FRAME_INFO[i].SPEED;

};
var Isbigpaly = 1;
//
function BigdbImgShuffling() {
    if (Isbigpaly == "1") {
        Isbigpaly = 0;
        clearInterval(setbig);
    } else {
        Isbigpaly = 1;
        if (bigtype == "HW") {
            BigImgPlayhw();
        } else if (bigtype == "KJG") {
            BigImgPlaykjg();
        } else {
            BigImgPlayqj();
        }
    }
};

//查询上一条缺陷
function PreAlarm(next) {
    if (GetQueryString("haveNextAlarm") == "no") {//禁用上下条
        return false;
    }
    var a = '';
    var para = window.location.href.split('?')[1];
    for (var i = 0; i < para.split('&').length; i++) {

        if (para.split('&')[i].split('=')[0] == 'bjbm' && para.split('&')[i].split('=')[1] != '' && para.split('&')[i].split('=')[1] != undefined) {
            para = 'alarmid=' + GetQueryString('alarmid') + '&' + para.split('&')[i]
        }
    }
    var show_saved = window.localStorage.getItem("show_saved")
    if (show_saved == 'true') {
        var reg = new RegExp("_", "g");
        a = getCookieValue("SaveAlarms").replace(reg, ",");
    };
    var _raised_time = $('#raised_time').html()
    if (_raised_time == '' || _raised_time == undefined) {
        _raised_time = ''
    }
    var idsdata = {
        ids: a,
        raised_time: _raised_time
    };
    if (next) {
        var _url = 'RemoteHandlers/PreviousAlarm.ashx?' + para
    } else {
        var _url = 'RemoteHandlers/NextAlarm.ashx?' + para
    }

    $.ajax({
        type: "POST",
        data: idsdata,
        url: _url,
        async: true,
        cache: false,
        success: function (result) {
            if (result == '') {
                if (next) { ymPrompt.alert('已经没有上一条数据了'); } else { ymPrompt.alert('已经没有下一条数据了'); }

            }
            else {
                var n = para.indexOf('&');
                var para_noID = para.substring(n, para.length);
                if ($('#alarm_clock').find('span:eq(0)').hasClass('btn-lock-ico-selected')) {
                    if ($('#alarm_clock').attr('name') == json_user.name) {
                        unlockAlarm()
                    }
                }
                window.location.href = "MonitorAlarm3CForm4.htm?alarmid=" + result + para_noID;
                if (top.location != self.location) {
                    var _url = "/6C/PC/MAlarmMonitoring/MonitorAlarmDPC.htm?alarmid=" + result + '&cateGoryName=3C' + para_noID;
                    parent.window.location.href = _url;
                }
            }
        }
    })
};

var islookwd = 1;
function lookWD() {
    if (islookwd == "1") {
        islookwd = 0;
        document.getElementById("main").style.display = "";
        loadC3Echarts();
    } else {
        islookwd = 1;
        document.getElementById("main").style.display = "none";
    }
};

//DIV拖动事件
var rDrag = {
    o: null,
    init: function (o) {
        o.onmousedown = this.start;
    },
    start: function (e) {
        var o;
        e = rDrag.fixEvent(e);
        e.preventDefault && e.preventDefault();
        rDrag.o = o = this;
        o.x = e.clientX - rDrag.o.offsetLeft;
        o.y = e.clientY - rDrag.o.offsetTop;
        document.onmousemove = rDrag.move;
        document.onmouseup = rDrag.end;
    },
    move: function (e) {
        e = rDrag.fixEvent(e);
        var oLeft, oTop;
        oLeft = e.clientX - rDrag.o.x;
        oTop = e.clientY - rDrag.o.y;
        rDrag.o.style.left = oLeft + 'px';
        rDrag.o.style.top = oTop + 'px';
    },
    end: function (e) {
        e = rDrag.fixEvent(e);
        rDrag.o = document.onmousemove = document.onmouseup = null;
    },
    fixEvent: function (e) {
        if (!e) {
            e = window.event;
            e.target = e.srcElement;
            e.layerX = e.offsetX;
            e.layerY = e.offsetY;
        }
        return e;
    }
};

function SetFrame(_type) {

    var debug = getConfig("debug");

    if (debug == "1") {
        //
        SetFrame_submit(_type);
    }
    else {
        layer.confirm('你确定要设置这帧为缺陷帧吗？', {
            time: 0,
            btn: ['确定', '取消'],
            yes: function (index) {
                layer.close(index);
                SetFrame_submit(_type);
                layer.msg('设置成功');
            }
        });
    }

};

function SetFrame_submit(_type) {

    var obj_index;
    switch (_type) {
        case "IR":
            obj_index = ImgNum_hw;
            break;
        case "VI":
            obj_index = ImgNum_vi;
            break;
        case "OAB":
            obj_index = ImgNum_all;
            _type = OAB;
            break;
    }
    var responseData = XmlHttpHelper.transmit(false, "get", "text", "RemoteHandlers/GetMonitorAlarmC3Form.ashx?type=set&alarmid=" + GetQueryString("alarmid") + "&imgType=" + _type + "&index=" + obj_index + "&r=" + Math.random(), null, null);
    // getAlarminfo(GetQueryString("alarmid"));
    loadC3Form();

}


function importToWord() {
    var url = "/Report/AlarmReport.aspx?alarmid=" + GetQueryString("alarmid") + "&show_head=false&isReturn=1&_w=" + window.screen.width + "&_h=" + window.screen.height;
    window.open(url); port
    //            ShowWinOpenhw(url);
};



function ShowMTwin(str, w, h) {
    $("#tanchu").attr("href", str + "&closeBtn=hide&lightbox[iframe]=true&lightbox[width]=90p&lightbox[height]=90p");
    $("#tanchu").click();
};
//模态任务弹出关闭
function TaskClose() {
    $.lightbox().close();
};

function LoadSave() {
    var alarmID = GetQueryString("alarmid");
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

function AddSave() {

    var alarmID = GetQueryString("alarmid");
    //添加收藏。
    var SaveAlarms = getCookieValue("SaveAlarms");//window.localStorage.SaveAlarms;
    if (SaveAlarms != '') {
        if (SaveAlarms.indexOf(alarmID) >= 0) {
            //已经存在
            //ymPrompt.alert('已经收藏');
            DelStorageSaveAlarms(alarmID);//DelSaveAlarms(alarmID);
            $('#i_save').removeClass("icon-color").addClass("icon-white");
            return;

        }
        else {
            SaveAlarms += '_' + alarmID;

            $('#i_save').removeClass("icon-white").addClass("icon-color");

            // ymPrompt.alert('收藏成功');
        }
    }
    else {
        SaveAlarms = alarmID;
        $('#i_save').removeClass("icon-white").addClass("icon-color");
        //  ymPrompt.alert('收藏成功');
    }
    window.localStorage.SaveAlarms = SaveAlarms;
    //    deleteCookie("SaveAlarms", "/");
    //    addCookie("SaveAlarms", SaveAlarms, 30, "/");

};

function GetSave() {
    var SaveAlarms = GetSaveAlarms();

    // alert(SaveAlarms);
};

function modalShow() {
    $("#ddlzt").html("");
    $("#range").val(getConfig("RepeatRange"));
    $("#repeatCount").val(getConfig("RepeatCount"));
    if (FunEnable("Fun_StatisticsTimes") == "True") {
        $("#ddlzt").html($("#ddlzt").html() + "<option value='AFSTATUS01' selected>新上报</option><option value='AFSTATUS02' selected>已取消</option><option value='AFSTATUS03' selected>已确认</option><option value='AFSTATUS04' selected>已计划</option><option value='AFSTATUS05' selected>已关闭</option><option value='AFSTATUS07' selected>检修中</option>");
    } else {
        var stausAll = "AFSTATUS01,AFSTATUS02,AFSTATUS03,AFSTATUS04,AFSTATUS05,AFSTATUS07".split(',');
        var status = getConfig("RepeatStatus");
        for (var j = 0; j < stausAll.length; j++) {
            var name = "";
            switch (stausAll[j]) {
                case "AFSTATUS01":
                    name = "新上报";
                    break;
                case "AFSTATUS02":
                    name = "已取消";
                    break;
                case "AFSTATUS03":
                    name = "已确认";
                    break;
                case "AFSTATUS04":
                    name = "已计划";
                    break;
                case "AFSTATUS05":
                    name = "已关闭";
                    break;
                case "AFSTATUS07":
                    name = "检修中";
                    break;
                default:
            }
            if (status.indexOf(stausAll[j]) > -1)
                $("#ddlzt").html($("#ddlzt").html() + "<option value='" + stausAll[j] + "' selected>" + name + "</option>");
            else
                $("#ddlzt").html($("#ddlzt").html() + "<option value='" + stausAll[j] + "'>" + name + "</option>");
        }
    };
    if (GPSJson.LOCNO.indexOf("CRH") > -1) {
        $(".tdXb").css("display", "none");
        $(".tdLx").attr("colspan", "3");
        //var content = "东经" + GPSJson.GIS_X + "  北纬" + GPSJson.GIS_Y + "  发生时间" + GPSJson.RAISED_TIME;
        //$("#td_title").text(content);
    }
    else {
        var content = GPSJson.LINE + "  " + GPSJson.QZ + "  " + GPSJson.DIRECTION + "  " + GPSJson.KM + "  " + GPSJson.RAISED_TIME;
        $("#td_title").text(content);
    }



};

function repeatFX(Alert) {
    var obj = document.getElementById('ddlzt');
    var status = getSelectedItem(obj);//缺陷状态
    var zTree = $.fn.zTree.getZTreeObj("ULcitySel");
    var nodes = zTree.getCheckedNodes(true);
    var code = "";
    for (var i = 0, l = nodes.length; i < l; i++) {
        code += nodes[i].id + ",";
    }
    if (code.length > 0) code = code.substring(0, code.length - 1);//缺陷类型
    var direction = $("#direction").val();
    var startTime = $("#startTime").val();
    var endTime = $("#endTime").val();
    var range = $("#range").val();
    var repeatCount = $("#repeatCount").val();
    var jb = getSelectedJB(); //级别
    var url = "RemoteHandlers/GetAlarmTD.ashx?alarmid=" + GetQueryString("alarmid")
    + "&direction=" + direction
    + "&startTime=" + startTime
    + "&endTime=" + endTime
    + '&jb=' + escape(jb)
    + "&range=" + range
    + "&repeatCount=" + repeatCount
    + "&code=" + code
    + "&status=" + status
    + "&temp=" + Math.random();
    loadTdGrid(url, Alert);
};
//获取级别
function getSelectedJB() {
    var slct = "";
    var red = $("#grade-one").attr("checked");
    var orange = $("#grade-two").attr("checked");
    var yellow = $("#grade-three").attr("checked");

    if (red == "checked") {
        slct += $("#grade-one").val();
    };
    if (orange == "checked") {
        slct += $("#grade-two").val();
    };
    if (yellow == "checked") {
        slct += $("#grade-three").val();
    };
    return slct;
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
function AutoSize1() {
    var _h = $(window).height() / 4;
    var _w = $(window).width() / 4;
    $('#iframe_map,#box_map').height(_h * 4).width(_w * 3);
    $('#iframe_alarm,#box_alarm').height(_h * 4).width(_w * 1);
    $('#iframe_loca,#box_loca').height(_h * 1).width(_w * 3);
    $('#LockBox').css("right", _w);
    if (window.frames["iframe_MyLayerBox"] && window.frames["iframe_MyLayerBox"].autosize != undefined)
        window.frames["iframe_MyLayerBox"].autosize();

    $('#ImgTypeBox').css('top', _h * 2 + 8).css('left', 0);
    $('#ImgTypeBox>div').height(28);
    _wAll = $(window).width();
    _hAll = $(window).height();
    var _imgTypeBox_h = $('#ImgTypeBox').outerHeight();
    if (_imgTypeBox_h > _h) {
        $('#ImgTypeBox').css('top', $('#ImgTypeBox').css('top') - (_imgTypeBox_h - _h));
    }

    if (_wAll < 1600) {
        var f1 = $(window).height() * 0.031104;  //20px;
        var f2 = $(window).height() * 0.021104;

        $('#ItemBox li').css({ 'font-size': f1 + 'px', 'padding': '1% 2% 1%' });
        $('.ItemBox_content').css({ 'font-size': f2 + 'px' });
    }
    $('#ItemBox').css('left', _w * 2 + 5).width(_w - 5).height(_h * 2.6 - 5);
    //判断iframe本身的高度

    $(".MyLayerBox,.layui-layer-content").css({ width: $(window).width(), height: $(window).height() });

    if ($(".MyLayerBox").css("left") == "0px") {
        $('.MyLayerBox').css({ top: 0 });
        $(".iframe_MyLayerBox").css({ width: $(window).width(), height: $(window).height() });
    };
    //刷新iframe里面内容的大小
    if ($(".iframe_MyLayerBox") && $(".iframe_MyLayerBox").contents()[0] && $(".iframe_MyLayerBox").contents()[0].defaultView.autosize != undefined)
        $(".iframe_MyLayerBox").contents()[0].defaultView.autosize();
}
function closeplay() {
    $('.layui-layer-close').click();
    document.getElementById('iframe_MyShowBox').src = "";
}


function getPath(imgType) {
    fullShow();
    var httpUrl = window.location.protocol + "//" + window.location.host;
    var url = "downloadgif.aspx?alarmid=" + GetQueryString("alarmid") + "&httpUrl=" + escape(httpUrl) + "&imgType=" + escape(imgType);
    window.open(url);
    fullHide();
};

function dispdian(_str, _max) {
    if (_str.length > _max)
        return "...";
    else
        return "";
};

//查看重复对比详细信息
function goRepeate(id, pid) {
    var alarmid = pid;
    window.open("/Common/MDataAnalysis/C3RepeatAlarmImg.aspx?showclose=true&alarmid=" + alarmid + "&id=" + id + '&v=' + version + "&temp=" + Math.random());
};


//支柱点击事件
function pillar_click() {

    GetPoloeNumber(json);


}

//杆号点击事件
function gotopoleinfo(id) {
    var url = "/Common/MOnePoleData/oneChockoneGAN.html?id=" + id + "&v=" + version;
    window.open(url, "_blank");
};

function loadSureBox() {
    LoadSureBox('3C', GetQueryString("alarmid"));
}

function marker_postOut() {
    var alarmID = GetQueryString("alarmid");
    var T = $('#signPortout span:eq(0)').hasClass('btn-mark-ico-selected');
    var F = $('#ckdj span:eq(0)').hasClass('btn-defects-ico-selected');

    if (!T == true) {
        $('#signPortout span:eq(0)').addClass("btn-mark-ico-selected");
        var weekly = true;
    } else {
        $('#signPortout span:eq(0)').removeClass("btn-mark-ico-selected");
        var weekly = false;
    }
    if (!F == true) {
        var checkbox = false;
    } else {
        var checkbox = true;
    }

    var url = "/Common/MAlarmMonitoring/RemoteHandlers/AlarmEdit.ashx?active=Marker&alarmid=" + alarmID + "&typical=" + checkbox + '&weekly=' + weekly;
    $.ajax({
        type: 'POST',
        url: url,
        ansyc: false,
        cache: false,
        success: function (result) {
            var result = result;
        }
    })
};

//点击坐标点保存

function save_editinfo(index) {
    var IRV_TEMP = $(".locInfo_Temp_Irv").val(); //红外温度
    var ENV_TEMP = $(".locInfo_Temp_Env").val(); //环境温度
    var LINE_HEIGHT = $(".locInfo_Line_Height").val(); //导高
    var PULLING_VALUE = $(".locInfo_Pulling_Value").val(); //拉出
    var SPEED = $(".locInfo_Speed").val(); //速度
    var _url = '/Common/MAlarmMonitoring/RemoteHandlers/AlarmEdit.ashx?active=ModifyFrameInfo'
                + '&alarmid=' + GetQueryString("alarmid")
                + '&FRAME_NO=' + index
                + '&ROUTING_NO='
                + '&KM_MARK='
                + '&IRV_TEMP=' + Math.round(IRV_TEMP * 100)
                + '&ENV_TEMP=' + Math.round(ENV_TEMP * 100)
                + '&LINE_HEIGHT=' + LINE_HEIGHT
                + '&PULLING_VALUE=' + PULLING_VALUE
                + '&SPEED=' + SPEED;
    $.ajax({
        type: 'post',
        url: _url,
        async: true,
        cache: false,
        success: function (data) {
            if (data == "True") {
                layer.msg("保存成功");
                isRefresh = true;
                loadC3Form(); //刷新页面
            } else {
                layer.msg("保存失败");
            }
        }
    })
};
//手动设置转发到现场
function SendLocale(v) {
    var alarmID = GetQueryString("alarmid");
    var _url = '/C3/PC/MAlarmMonitoring/RemoteHandlers/GetMonitorAlarmC3Form.ashx?type=trans&alarmid=' + alarmID + '&tseverity=' + v;
    $.ajax({
        type: 'post',
        dataType: 'text',
        url: _url,
        async: true,
        cache: false,
        success: function (data) {
            if (data == "true") {
                layer.msg("加入转发完成");
            } else {
                layer.msg("设置失败，请联系管理员");
            }
        }
    })
};

//下载整改通知书
function downloadnotice(id) {
    var _url = '/Report/3CRectify.aspx?id=' + id + "&_h=" + window.screen.height + "&_w=" + window.screen.width;
    window.open(_url);
};

//下载整治反馈单
function downloadFeedback(id) {
    var _url = '/Report/3CRectifyBack.aspx?id=' + id + "&_h=" + window.screen.height + "&_w=" + window.screen.width;
    window.open(_url);
};

//多组拉出值请求
function LC_choose_notOne() {

    var url = '/C3/PC/MAlarmMonitoring/RemoteHandlers/GetMonitorAlarmC3Form.ashx?type=StaggerSelect&alarmid=' + GetQueryString("alarmid")   //GetQueryString("alarmid")
    $.ajax({
        type: "POST",
        url: url,
        async: false,//同步请求  原因是锁定状态的影藏判断必须在这个按钮出现之后
        cache: false,
        success: function (re) {
            if (re != '' && re != undefined && re.data.length > 0) {
                $("#lcm").show()
                $("#lcm").click(function () {
                    $("#lcm_chart").show();
                    $("#allimg").hide();
                    $('#note-OAB').css('display', 'none');
                    createLC_morethanOne_LineChart(re)
                });
            } else {
                console.log('获取初初始值失败！')
            }
        },
        error: function (err) {
            console.log(err);
        }



    })
}

//拉出值保存
function LC_choose_notOne_save() {
    var witchOne_choice = $('#LC_chose').val();
    if (witchOne_choice == undefined) {
        witchOne_choice = '';
        layer.msg('请先选择！')
    }
    var url = '/Common/MAlarmMonitoring/RemoteHandlers/AlarmEdit.ashx?active=StaggerSelect&alarmid=' + GetQueryString("alarmid") + '&staggerno=' + witchOne_choice //GetQueryString("alarmid")
    $.ajax({
        type: "POST",
        url: url,
        async: true,
        cache: false,
        success: function (re) {
            if (re != '' && re != undefined && re != 'false') {
                $("#lcm_chart").hide();
                $('#lc').click();
                layer.msg('保存成功！')
                //新增
                if ('1' === getConfig("debug") && window.parent.location.href.indexOf("MonitorAlarm3CForm4") > 0) {
                    isRefresh = true;
                }
                loadC3Form();
            } else {
                layer.msg('保存失败！')
            }
        },
        error: function (err) {
            console.log(err);
            layer.msg('保存失败！')
        }
    })
}


//点击卫星数，弹出iframe
function MapAfterClick() {
    showDialogIframe('/c3/pc/malarmmonitoring/monitoralarm3cform4_map.htm?map_wz=' + escape(map_wz) + '&map_gis_x=' + map_gis_x + '&map_gis_y=' + map_gis_y + '&map_gis_x_o=' + map_gis_x_o + '&map_gis_y_o=' + map_gis_y_o + '&severity_code' + severity_code, 900, 519);
};


//加载杆号详细信息
//function loadPolenumberInfo(polecode) {
//    var url = "/Common/MOnePoleData/RemoteHandlers/MyDeviceList.ashx?action=getPole&polecode=" + polecode;
//    $.ajax({
//        type: "POST",
//        url: url,
//        async: true,
//        cache: false,
//        success: function (result) {
//            var _Json = result;
//            if (_Json.length < 1) {
//                $("#poleInfo").hide();
//            } else {
//                var _HTML = '<div class="toolbg" >';
//                for (var i = 0; i < _Json.length; i++) {
//                    _HTML += '<span class="sptime">' + _Json[i].POLE_STRCT_TYPE_NAME + '：</span>' + _Json[i].POLE_STRCT_VALUE + '<br/>';
//                }
//                _HTML += "</div>";
//                $("#poleInfo").attr("data-original-title", _HTML);
//            };
//        }
//    });
//};

//加载杆号详细信息
function loaddeviceidInfo(polecode, num) {
    var url = "/Common/MOnePoleData/RemoteHandlers/MyDeviceList.ashx?action=getPole&polecode=" + polecode;
    $.ajax({
        type: "POST",
        url: url,
        async: true,
        cache: false,
        success: function (result) {
            var _Json = result;
            if (getConfig('debug') == "1") {
                if (_Json != "") {
                    var _HTML = '<span><span style="color:red">已匹配</span>到系统支柱基础数据,详情如下:<br/>线路:' + _Json.LINE_NAME + ',行别:' + _Json.DIRECTION + ',区站:' + _Json.POSITION_NAME + ',桥隧:' + _Json.BRG_TUN_NAME + ',公里标:' + _Json.KMSTANDARD + ',支柱:' + (num == "" ? "空" : num) + '<br/>点击图标查看地图</span>';
                    $("#pole_devive").attr({ "data-original-title": _HTML, 'data-placement': "bottom" }).show();
                    $('#pole_devive').tooltip({ "placement": "bottom", delay: { show: 0, hide: 1 } });
                    $('#pole_devive').on('shown.bs.tooltip', function () {
                        //$('.tooltip').width(450);

                        $('.toolbg').css('padding', "30px 15px 15px 5px")
                        $('.tooltip-inner').css('max-width', '1000px');

                    })
                };
            } else {
                $('#pole_devive').hide();
            }
            try {
                if (_Json.POLESTRCT.length > 0) {

                    var hml = '';
                    var namearry = [];
                    for (var i = 0; i < _Json.POLESTRCT.length; i++) {
                        namearry.push(_Json.POLESTRCT[i].POLE_STRCT_TYPE.length);
                        hml += "<span class='tooilp_span'>" + _Json.POLESTRCT[i].POLE_STRCT_TYPE + "</span><span class='tooilp_value'>：" + _Json.POLESTRCT[i].POLE_STRCT_VALUE + "</span><br>"
                    }

                    $("#poleDetail").attr("data-original-title", hml).show();
                    $('#poleDetail').tooltip({ "placement": "bottom", delay: { show: 0, hide: 1 }, });
                    $('#poleDetail').hover(function () {
                        $('.tooltip .tooilp_span').css('width', namearry.max() * 14);
                    })
                    $('#poleDetail').attr('title', '');//置title提示消失
                } else {
                    $("#poleDetail").hide();
                    console.log("杆号无属性！");
                }
            } catch (e) {
                $("#poleDetail").hide();
                console.log("获取杆属性返回值异常！");
            }
        }
    });
};
//重解析

function returnAgain(Num) {
    var _URL = '/C3/PC/MAlarmMonitoring/RemoteHandlers/GetMonitorAlarmC3Form.ashx?type=rerun'
            + '&alarmid=' + GetQueryString("alarmid")
            + '&signal=' + Num
    $.ajax({
        type: 'POST',
        url: _URL,
        async: true,
        cache: false,
        success: function (result) {
            if (result.sign == "True") {
                layer.msg('重解析已提交！')
                loadC3Form();
            } else {
                layer.msg('重解析提交失败！')
            }
        }
    })
};

//------------------------------------------------------- 确认样本 -------------------------------------------------------

/**
 * @desc 加载默认样本
 * @param 
 */
function loadSample() {
    var url = "/Common/MAlarmMonitoring/RemoteHandlers/AlarmSure.ashx?active=Load&alarmid=" + GetQueryString("alarmid");
    var json;
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        cache: false,
        success: function (result) {

            if (null !== result && '' !== result && undefined !== result && 'undefined' !== result) {
                json = eval('(' + result + ')');
            } else {
                return;
            }
            if (json !== undefined) {
                _cur_sample = json.SAMPLE_NAME;
                if ('正样本' === json.SAMPLE_NAME) {
                    $('#z_sample').attr('checked', 'checked');
                    _sample_type_rs = json.SAMPLE_DETAIL_NAME;
                    _sample_type_code = json.SAMPLE_DETAIL_CODE;
                    $('#z_sample_detail').html(json.SAMPLE_DETAIL_NAME).attr('code', json.SAMPLE_DETAIL_CODE);

                    $('#alarm_type_li').show();
                    hide_element('FUB'); //隐藏负样本

                } else if ('负样本' === json.SAMPLE_NAME) {
                    $('#f_sample').attr('checked', 'checked');
                    $('#f_sample_detail').val(json.SAMPLE_DETAIL_NAME).attr('code', json.SAMPLE_DETAIL_CODE);

                    $('#alarm_type_li').hide();
                    hide_element('ZHB'); //隐藏正样本

                } else {
                    $('#n_sample').attr('checked', 'checked');

                    $('#alarm_type_li').hide();
                    hide_element('ALL'); //隐藏全部样本

                }
            }
        }
    });
    return json;
}

/**
 * @desc 点击不同的样本
 * @param 
 */
function click_sample(id) {
    if ('z_sample' === id) { //点击正样本

        _cur_sample = '正样本';
        $('#alarm_type_li').show();
        hide_element('FUB');
        $('#z_sample_detail').html(_sample_type_rs).attr('code', _sample_type_code);

    } else if ('f_sample' === id) { //点击负样本

        _cur_sample = '负样本';
        $('#alarm_type_li').hide();
        hide_element('ZHB');
        $('#f_sample_detail').trigger('click');

    } else if ('n_sample' === id) { //点击非样本

        _cur_sample = '非样本';
        $('#alarm_type_li').hide();
        hide_element('ALL');

    }
}

/**
 * @desc 确认样本中，隐藏不同的元素
 * @param 
 */
function hide_element(hideType) {
    if ('ALL' === hideType) { //隐藏全部样本
        if (!$('#sample_detail_content').hasClass('hide')) {
            $('#sample_detail_content').addClass('hide');
        }
        if (!$('#f_sample_detail_content').hasClass('hide')) {
            $('#f_sample_detail_content').addClass('hide');
        }
        if (!$('#z_sample_detail_content').hasClass('hide')) {
            $('#z_sample_detail_content').addClass('hide');
        }
    }
    if ('ZHB' === hideType) { //隐藏正样本
        if ($('#sample_detail_content').hasClass('hide')) {
            $('#sample_detail_content').removeClass('hide');
        }
        if ($('#f_sample_detail_content').hasClass('hide')) {
            $('#f_sample_detail_content').removeClass('hide');
        }
        if (!$('#z_sample_detail_content').hasClass('hide')) {
            $('#z_sample_detail_content').addClass('hide');
        }
    }
    if ('FUB' === hideType) { //隐藏负样本
        if ($('#sample_detail_content').hasClass('hide')) {
            $('#sample_detail_content').removeClass('hide');
        }
        if ($('#z_sample_detail_content').hasClass('hide')) {
            $('#z_sample_detail_content').removeClass('hide');
        }
        if (!$('#f_sample_detail_content').hasClass('hide')) {
            $('#f_sample_detail_content').addClass('hide');
        }
    }
}

/**
 * @desc 获取正样本的详细类型
 * @param 
 */
function get_sample_type(alarmcode) {
    $.ajax({
        type: "POST",
        url: '/Common/MAlarmMonitoring/RemoteHandlers/AlarmSure.ashx?active=Sample_Z&alarmcode=' + alarmcode,
        cache: false,
        async: true,
        success: function (result) {
            if ('' !== result && undefined !== result) {
                if (result.SUCCESS === 'true') {
                    _sample_type_rs = result.SAMPLE_NAME;
                    _sample_type_code = result.SAMPLE_CODE;
                    if ('正样本' === _cur_sample) {
                        $('#z_sample_detail').html(_sample_type_rs).attr('code', _sample_type_code);
                    } else {
                        $('#z_sample_detail').html(result.error).attr('code', '');
                    }
                }
            }
        }
    });
}

/**
 * @desc 获取负样本详细类型
 * @param 
 */
function loadFSample() {
    $('#f_sample_detail').mySelectTree({
        tag: 'GET_SAMPLE_LIBRARY',
        cateGory: 'SMPLFLG|DRTFLG_FUB',
        codeType: '3C',
        _hegiht: '200',
        mis_px: '10',
        enableFilter: true,
        enableCheck: true,
        onCheck: function (event, treeId, treeNode) {
            var zTree = $.fn.zTree.getZTreeObj(treeId),
            nodes = zTree.getCheckedNodes(true),
             v = '', code = '';
            for (var i = 0, l = nodes.length; i < l; i++) {
                v += nodes[i].name + ',';
                code += nodes[i].id + ',';
            }
            if (v.length > 0) {
                v = v.substring(0, v.length - 1);
            }
            if (code.length > 0) {
                code = code.substring(0, code.length - 1);
            }
            $('#f_sample_detail').val(v).attr('code', code);
        },
        onClick: function (event, treeId, treeNode) {
            var treeObj = $.fn.zTree.getZTreeObj(treeId);
            treeObj.checkAllNodes(false);
            treeObj.checkNode(treeNode, !treeNode.checked, null, true);

            $('#f_sample_detail').val('');
            if (treeNode.pId === '' || treeNode.pId === null) {
                var arr = treeNode.children, code = '';
                for (var j = 0; j < arr.length; j++) {
                    code += arr[j].id + ',';
                }
                if (code.length > 0) {
                    code = code.substring(0, code.length - 1);
                }
                $('#f_sample_detail').val(treeNode.name).attr('code', code);
            } else {
                $('#f_sample_detail').val(treeNode.name).attr('code', treeNode.id);
            }
        },
        callback: function (event, treeId) {
            if ('负样本' === _cur_sample) {
                var treeObj = $.fn.zTree.getZTreeObj(treeId);
                if ('' !== $('#f_sample_detail').attr('code')) {
                    var treeNode = treeObj.getNodeByParam('id', $('#f_sample_detail').attr('code'), null);
                    if (null !== treeNode) {
                        treeObj.checkNode(treeNode, !treeNode.checked, null, true);
                    }
                }
            }
        }
    });
}

/**
 * @desc 确认样本
 * @param 
 */
function confirmSample() {
    var alarmid = GetQueryString('alarmid');
    var Alarmcode = $('#alarmType').attr('code');

    var SAMPLE_NAME = '';
    var SAMPLE_CODE = '';
    var SAMPLE_DETAIL_NAME = '';
    var SAMPLE_DETAIL_CODE = '';

    //样本
    if ('正样本' === _cur_sample) {
        SAMPLE_NAME = '正样本';
        SAMPLE_CODE = 'DRTFLG_ZHB';
        SAMPLE_DETAIL_NAME = $('#z_sample_detail').html();
        SAMPLE_DETAIL_CODE = $('#z_sample_detail').attr('code');
    }
    if ('负样本' === _cur_sample) {
        SAMPLE_NAME = '负样本';
        SAMPLE_CODE = 'DRTFLG_FUB';
        SAMPLE_DETAIL_NAME = $('#f_sample_detail').val();
        SAMPLE_DETAIL_CODE = $('#f_sample_detail').attr('code');
    }
    if ('非样本' === _cur_sample) {
        SAMPLE_NAME = '';
        SAMPLE_CODE = '';
        SAMPLE_DETAIL_NAME = '';
        SAMPLE_DETAIL_CODE = '';
    }

    var _url = '/Common/MAlarmMonitoring/RemoteHandlers/AlarmSure.ashx?active=Save_sample&category=3C'
                    + '&alarmid=' + alarmid
                    + '&Alarmcode=' + Alarmcode
                    + '&SAMPLE_NAME=' + SAMPLE_NAME
                    + '&SAMPLE_CODE=' + SAMPLE_CODE
                    + '&SAMPLE_DETAIL_NAME=' + SAMPLE_DETAIL_NAME
                    + '&SAMPLE_DETAIL_CODE=' + SAMPLE_DETAIL_CODE
                    + '&tmpe=' + Math.random();
    $.ajax({
        type: 'post',
        url: _url,
        cache: false,
        async: false,
        success: function (result) {
            layer.close(_index_sample);
            window.loadC3Form();
            window.loadSample();
            if (SAMPLE_NAME === '正样本') {
                setTimeout('download_sample_file()', 1000);
            }
        }
    });
}

/**
 * @desc 下载样本库文件
 * @param 
 */
function download_sample_file() {
    var url = '/C3/PC/MAlarmMonitoring/RemoteHandlers/downloadSampleFile.ashx?alarmID=' + GetQueryString('alarmid');
    $.ajax({
        type: 'post',
        url: url,
        async: true,
        cache: true,
        success: function (re) {
            console.log('请求成功');
        }
    });
};

//修改销号信息
function updateCancelNumber() {
    var Cancel_Number_code = $("#Cancel_Number_code").val();
    var _url = '/Common/MAlarmMonitoring/RemoteHandlers/AlarmEdit.ashx?active=ModifyProcessStatus&alarmid=' + GetQueryString("alarmid") + '&PROCESS_STATUS=' + Cancel_Number_code;
    $.ajax({
        type: 'POST',
        url: _url,
        async: true,
        cache: false,
        success: function (data) {
            if (data.sign == "True") {
                layer.msg(data.re);
                $("#closeCancel_Number").click();
                loadC3Form(); //刷新页面
            } else {
                layer.msg(data.re);
            }
        }
    })
};

Array.prototype.max = function () {//数组取最大值
    var max = this[0];
    var len = this.length;
    for (var i = 1; i < len; i++) {
        if (this[i] > max) {
            max = this[i];
        }
    }
    return max;
}
//获取杆属性
function getpoleDetail(deviceID) {
    var _url = '/C3/PC/MAlarmMonitoring/RemoteHandlers/GetMonitorAlarmC3Form.ashx?type=Pole_strct&device_id=' + deviceID;
    $.ajax({
        type: 'post',
        url: _url,
        async: true,
        cache: false,
        success: function (re) {
            if (re != "" && re != undefined) {
                //re = { "POLESTRCT": [{ "POLE_CODE": "NGX$90018$Q_GZN_FSX$1$1138$1", "POLE_STRCT_TYPE": "锚段关节类型", "POLE_STRCT_VALUE": "非绝缘锚段" }, { "POLE_CODE": "NGX$90018$Q_GZN_FSX$1$1138$1", "POLE_STRCT_TYPE": "支柱类型", "POLE_STRCT_VALUE": "锚柱" }, { "POLE_CODE": "NGX$90018$Q_GZN_FSX$1$1138$1", "POLE_STRCT_TYPE": "跨数", "POLE_STRCT_VALUE": "4" }] }
                try {
                    if (re.POLESTRCT.length > 0) {

                        var hml = '';
                        var namearry = [];
                        for (var i = 0; i < re.POLESTRCT.length; i++) {
                            namearry.push(re.POLESTRCT[i].POLE_STRCT_TYPE.length);
                            hml += "<span class='tooilp_span'>" + re.POLESTRCT[i].POLE_STRCT_TYPE + "</span><span class='tooilp_value'>：" + re.POLESTRCT[i].POLE_STRCT_VALUE + "</span><br>"
                        }

                        $("#poleDetail").attr("data-original-title", hml).show();
                        $('#poleDetail').tooltip({ "placement": "bottom", delay: { show: 0, hide: 1 }, });
                        $('#poleDetail').hover(function () {
                            $('.tooltip .tooilp_span').css('width', namearry.max() * 14);
                        })
                        $('#poleDetail').attr('title', '');//置title提示消失
                    } else {
                        $("#poleDetail").hide();
                        console.log("杆号无属性！");
                    }
                } catch (e) { console.log("获取杆属性返回值异常！"); }
            } else {
                $("#poleDetail").hide();
                console.log('杆号属性获取失败！')
            }
        },
        error: function () {
            $("#poleDetail").hide();
            console.log('杆号属性获取错误！')
        }
    })
}