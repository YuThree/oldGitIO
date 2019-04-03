var OrgType;
var pagesize = 10;//页大小
var index_speed_min = ''; //最小速度提示框所需编号
var index_speed_max = ''; //最大速度提示框所需编号


// 右边设备栏的隐藏和显示
$(document).ready(function () {
    $("#Form1").validationEngine({
        validationEventTriggers: "blur",  //触发的事件  "keyup blur",   
        inlineValidation: true, //是否即时验证，false为提交表单时验证,默认true   
        success: false, //为true时即使有不符合的也提交表单,false表示只有全部通过验证了才能提交表单,默认false
        promptPosition: "topLeft"//提示位置，topLeft, topRight, bottomLeft,  centerRight, bottomRight
    });

    LoadingHistoricalTime("startdate", "enddate"); ///  Common\js\6cweb\HistoricalTime.js
    $(".body").css("height", $(window).height() - 255);
    $(".col_400_new").width($(window).width() * 5 / 6 * 0.7);
    $("#head_new>div:eq(1)").width($(window).width() * 5 / 6 * 0.29);
    //    $(".laypage_total label").css("margin-top", "3");
    $(".button_img_show").click(function () {
        var Width = $(".span2").outerWidth(true);
        $(".span2").animate({ left: -Width + 'px' }).css("position", "absolute");
        $(this).hide();
        $(".span10").animate({ width: "96.5%" });
        $(".button_img_hide").show();
    });
    $(".button_img_hide").click(function () {
        $(".span2").animate({ left: 0 }).css("position", "relative");
        $(".button_img_show").show();
        $(this).hide();
        $(".span10").animate({ width: "82.8%" });
    });
    //下拉选择框样式插件
    $("select:not(:last-child)").addClass("select select-primary").attr("data-toggle", "select");

    $('#txtqz').jHint({
        type: 'StationSection',
        line: ''
    });
    OrgType = "Line_GDD";
    document.getElementById("_loctree").style.height = $(window).height() - 65 + "px";

    document.getElementById('startdate').value = datehhmm00NowStr("00:00:00"); //获取当前日期
    document.getElementById('enddate').value = datehhmm00NowStr("23:59:59"); //获取当前日期   
    //  loadOrgSelect('TOPBOSS', 'ju', null, 'ddlju', null); //加载局下拉
    // loadOrgSelect(null, 'duan', null, 'ddlduan', null); //加载段下拉

    var null_option = '<option value="0">全部</option>';
    $("#juselect").mySelect({
        tag: "Organization", code: "TOPBOSS", type: "J"
    }).change(function () {
        var jcode = $(this).val();
        if (jcode == "0") {
            $("#duanselect").html(null_option);
        }
        else {
            $("#duanselect").mySelect({
                tag: "Organization",
                code: jcode
                //  ,type: "JWD" || "CLD"              
            })
        }
    });
    $("#lineselect").mySelect({
        tag: "line"
        //  ,type: "JWD" || "CLD"              
    });
    $('#TreeAll').myTree({
        type: 'Organization-ju'//指定类型
    });




    hideC3infobyID("jltr"); //隐藏动车数据的交路运用区段信息查询信息  

    //goPage(1, 10, false);
    doQuery();

    $('#txt_whereMemo').width($('#txt_whereMemo').width() - $('#txt_whereTitle').width() - 20);

    //弹出更多选择model
    $('#btn_openSearch').click(function (e) {
        //$('#box_search').modal()
        if (!$("#myDiv").hasClass("hide")) {
            $("#myDiv").hide("fast");
        }
        $("#myDiv").show("fast");
        $("#S_btnQuery,#S_btnExl").attr("disabled", "disabled").addClass('disabled');
        $("#myDiv").click(function () { return false; });
        e.stopPropagation();
    });
    $(document).click(function () {
        var boxOpenJuge = true;
        $('.myselectBox').each(function () {
            if ($(this).css('display') == 'block') {
                boxOpenJuge = false;
            }
        });
        if ($("#Form1").validationEngine("validate") && !$("#myDiv").hasClass("hide") && boxOpenJuge) {
            $("#myDiv").hide("fast");
            //            $('#Form1').validationEngine('hideAll');
            $("#S_btnQuery,#S_btnExl").removeAttr("disabled").removeClass('disabled');
        }
    });

    //点击子页面关闭更多条件
    var iframe = document.getElementById('public_list');
    iframe.onload = function () {
        iframe.contentDocument.onclick = function () {
            $("#myDiv", window.document).hide("fast");
            $("#S_btnQuery,#S_btnExl", window.document).removeAttr("disabled").removeClass('disabled');
        };
    }

    //查询
    $('#btn_search,#S_btnQuery').click(function () {
        var bool = $("#Form1").validationEngine("validate");
        if (bool) {
            doQuery();
            $('#btnClose').click();
        }
    });
    if (FunEnable('Fun_Satellite') != "True") {
        $("#gisX").parent().hide();
    }
    if (FunEnable('Fun_Exce_export_function') == "True") {
        $("#S_btnExl").hide();
        $("#S_btnExlnew").show();
    }
    //关闭导出按钮
    if (FunEnable('Fun_Excel_export_function') == "False") {
        $("#S_btnExl").hide();
        $("#S_btnExlnew").hide();
    }
    //if (FunEnable('Fun_LOCSTATE_NEW') != "True") {
    //    $(".head div[debug='true']").hide();
    //    $("#head_new").show();
    //} else {
    $("#head").show();
    //}
    $('#btnClose').click(function (e) {
        if ($("#Form1").validationEngine("validate")) {
            //            $('#Form1').validationEngine('hideAll');
            $("#S_btnQuery,#S_btnExl").removeAttr("disabled").removeClass('disabled');
        }
        else {
            e.stopPropagation();
        }
    });
    //机车隐藏辅助相机列
    if (FunEnable('Fun_isCRH') == "False") {
        $(".FU_HIDE").hide();
    }
    //清空查询条件
    $('#btn_reset').click(function () {

        ymPrompt.confirmInfo({
            message: '确认要清空查询条件?',
            handler: function (tp) {
                if (tp == 'ok') {

                    $('#search_bg input[type="text"]').val('');

                    $('#search_bg select').each(function () {

                        $(this).find('option:first').prop("selected", 'selected');

                    })
                    $('#txtloccode').attr('value', '');
                    $('#orgSelect').attr('value', '');
                    $('#lineSelect').attr('value', '');
                    $('#direction').attr({'value':'','code': ''});
                    $('#startKm').attr('value', '');
                    $('#endKm').attr('value', '');
                    $('#startSpeed').attr('value', '');
                    $('#endSpeed').attr('value', '');
                    $('#ULlineSelect').prev().find('input[name=ztree]').attr('value', '');

                    if ($('#TreeAll').length > 0) {
                        $('#TreeAll a').each(function () {
                            if ($(this).hasClass('curSelectedNode')) {
                                $(this).removeClass('curSelectedNode')
                            }
                        });
                    }
                }
                if (tp == 'cancel') {
                    //  cancelFn();
                }
                if (tp == 'close') {
                    //   closeFn()
                }

                doQuery();
            }
        });

    });
    if (getConfig("debug") == '0') {
        $('#gisX').parent().css('display', 'none');
    };
});
var first = true;
var pageUrl = "";
function goPage(_page, _size, firstload, url) {
    fullShow();
    if (url == undefined) {
        url = "/C3/PC/MDeviceStatus/RemoteHandlers/MonitorLocoStateListNewGDD.ashx";
    }
    $.ajax({
        type: "POST",
        url: url,
        data: 'page=' + _page + '&size=' + _size + '&startdate=' + $("#startdate").val() + '&enddate=' + $("#enddate").val() + "&OrgType=" + OrgType,
        async: true,
        cache: true,
        success: function (result) {
            json = eval('(' + result + ')');
            var pageNum = 10;
            if (json != null && json != undefined) {
                if (json.list.length === 0) {
                    $('#flexTable').html('');
                    var top = (document.body.clientHeight - $('#flexTable').offset().top) / 2;
                    var left = (document.body.clientWidth - $('#flexTable').offset().left) / 2;
                    $('#flexTable').css({
                        'background-image': 'url(/Common/img/table_no_data.png)',
                        'background-repeat': 'no-repeat',
                        'background-position-x': left - 200 + 'px',
                        'background-position-y': top - 120 + 'px',
                        'min-height': '405px'
                    });
                    fullHide();
                } else {
                    $('#flexTable').html('');
                    $('#flexTable').css({
                        'background-image': ''
                    });
                    pageNum = Math.ceil(json.totalCount / _size);
                    getPageContent(json);
                }
            }
            fullHide();
            //if (first) {
            //    first = false;
            //    laypage({
            //        cont: 'layPage', //容器。值支持id名、原生dom对象，jquery对象,
            //        pages: pageNum, //总页数
            //        size: 10, //总页数
            //        skip: true, //是否开启跳页
            //        skin: 'molv',
            //        groups: 6, //连续显示分页数
            //        jump: function (obj) {
            //            if (firstload) {
            //                goPage(obj.curr, obj.size, false, pageUrl);
            //            }
            //            firstload = true;
            //        }
            //    });
            //}
            pagegogogo();
        }
    });
};

function getPageContent(json) {

    template.helper("convert", function (v) {
        if (getConfig("debug") == "0") {
            return "<i class='glyphicon glyphicon-ok' title='正常'></i>";
        } else {
            if (v == "正常" || v == '1') {
                return "<i class='glyphicon glyphicon-ok' title='正常'></i>";
            } else if (v == "异常" || v == "" || v == '0') {
                return "<i class='glyphicon glyphicon-remove' title='异常'></i>";
            }
            else {
                return "";
            }
        }
    });
    template.helper("convert_bow_status", function (v) {
        if (v == "升") {
            return "<i class='glyphicon glyphicon-arrow-up' title='升弓'></i>";
        } else {
            return "<i class='glyphicon glyphicon-arrow-down' title='降弓'></i>";
        }
    });

    template.helper("is_debug", function () {
        //if (FunEnable('Fun_LOCSTATE_NEW') == "True") {
        return true;
        //} else {
        //    return false;
        //}
    });

    var html = template('test', json);

    $("#flexTable").html(html);

    //主板状态只在内部动车版显示
    if (getConfig('debug') == "1" && FunEnable('Fun_isCRH') == "True") {
        $('.outside_box').css('min-width', '1475px')
        //$('.span10>div:nth-of-type(1)').css('min-width', '1440px')
        //$('.span10>div:nth-of-type(2)').css('min-width', '1450px')
        //$('.span10>div:nth-of-type(3)').css('min-width', '1460px')
        $('.mainboard_State').show()
    }
    //特殊样式处理
    $('.rail-2').each(function () {
        if ($(this).height() > 65) {
            $(this).find('.col_400').css('height', $(this).height() - 29)
        }
    })
    //if (FunEnable('Fun_LOCSTATE_NEW') != "True") {
    //    $(".rail-2").width($(window).width() * 5 / 6);
    //    $(".rail_two").width($(window).width() * 5 / 6 * 0.7);
    //    $(".rail_num_all").width($(window).width() * 5 / 6 * 0.29);
    //}
    //机车隐藏辅助相机列
    if (FunEnable('Fun_isCRH') == "False") {
        $(".FU_HIDE").hide();
    }

    if (FunEnable('Fun_Equipment_status_video_input') == "True") {
        $('.glyphicon-time').parent().click(function () {

            var timeStr = $(this).children().last().text();
            var loca = $(this).siblings().first().children().text();
            //console.log(loca)
            var cDate2 = new Date(timeStr);
            var cdate2_times = parseInt(cDate2.getTime());
            //console.log(cdate2_times)
            var url = '/C3/PC/MLiveStreaming/MonitorLocoPlayNew.htm?page=meta_big&btn_tc=0&replay=1&playtime=' + cdate2_times + '&loca=' + loca + '&wz='
            //console.log(url)
            window.open(url)
        })


    } else {
        $('.glyphicon-time').siblings().children().css('color', '#555')
        $('.glyphicon-time').siblings().hover(function () { $(this).children().css({ 'text-decoration': 'none', 'color': '#555', 'cursor': 'auto' }).attr('title', '') }, function () { })
    }

};

function doQuery() {
    doQueryHistoricalTime(); ///  Common\js\6cweb\HistoricalTime.js

    //var ju = document.getElementById('juselect').value; //局
    //var jwd = document.getElementById('duanselect').value; //段; //机务段
    var ju = '';   //局
    var jwd = ''; //段; //机务段
    if ($('#orgSelect').attr('treetype') == 'J') {
        ju = $('#orgSelect').attr('code');
    } else if ($('#orgSelect').attr('treetype') == 'TOPBOSS') {
        ju = '';
    } else {
        jwd = $('#orgSelect').attr('code');
    }
    //if ($('#orgSelect').attr('treetype') != undefined) {
    //} else {
    //    if ('' !== $('#TreeAll_Org').attr('treeType')) {
    //        if ('BUREAU' === $('#TreeAll_Org').attr('treeType')) {
    //            ju = $('#orgSelect').attr('code');
    //        }
    //        if ('ORG' === $('#TreeAll_Org').attr('treeType')) {
    //            jwd = $('#orgSelect').attr('code');
    //        }
    //    }
    //}

    var loccode = document.getElementById('txtloccode').value; //设备编码
    //var line = document.getElementById('lineselect').value; //设备编码
    var startdate = document.getElementById('startdate').value; //时间
    var enddate = document.getElementById('enddate').value; //时间
    //    var txtjl = document.getElementById('txtjl').value; //交路
    var linecode = '';//线路
    var txtqz = '';//区站
    if ($('#lineSelect').attr('treetype') == 'LINE') {
        linecode = $('#lineSelect').attr('code');
    } else if ($('#lineSelect').attr('treetype') == 'POSITION') {
        txtqz = $('#lineSelect').attr('code');
    }
    var direction = '0'//行别
    if ($('#direction').val() != '') {
        direction = $('#direction').attr('code')
    }
    var startSpeed = document.getElementById('startSpeed').value; //最小速度
    var endSpeed = document.getElementById('endSpeed').value; //最大速度
    if (startSpeed > 400 || startSpeed < 0) {
        index_speed_min = layer.tips('速度范围为0~400', '#startSpeed', {
            tips: [2, '#000'],
            time: ''
        });
        return;
    } else {
        layer.close(index_speed_min);
    }
    if (endSpeed > 400 || endSpeed < 0) {
        index_speed_max = layer.tips('速度范围为0~400', '#endSpeed', {
            tips: [2, '#000'],
            time: ''
        });
        return;
    } else {
        layer.close(index_speed_max);
    }


    var startKm = document.getElementById('startKm').value; //开始公里标
    var endKm = document.getElementById('endKm').value; //结束公里标

    
    $('#public_list').attr('src', '/C3/PC/MDeviceStatus/public_stateList.html?'
       + 'locid=' + loccode
       + '&ju=' + escape(ju)
       + '&jwd=' + escape(jwd)
       + '&txtqz_code=' + escape(txtqz)
       + '&LINE_CODE=' + escape(linecode)
       + '&direction=' + escape(direction)
       + '&startSpeed=' + startSpeed
       + '&endSpeed=' + endSpeed
       + '&startKM=' + startKm
       + '&endKM=' + endKm
       + '&startdate=' + startdate
       + '&enddate=' + enddate
       + "&OrgType=" + OrgType
       + '&temp=' + Math.random()).height($(window).height() - 140).width()
    first = true; //首次加载翻页
    //goPage(1, 10, false, pageUrl);
    SetWhereMemo();
}
function SetWhereMemo() {
    $('#txt_whereMemo').html('');

    //GetLabel("juselect", "select", $("#juselect").find("option:selected").text());
    //GetLabel("duanselect", "select", $("#duanselect").find("option:selected").text());

    //GetLabel("direction", "select", $("#direction").find("option:selected").text());
    //GetLabel("txtqz", "text", $('#txtqz').val());

    //GetLabel("#startSpeed,#endSpeed", "text2", GetRangStr('startSpeed', 'endSpeed', '速度'));
    //

    GetLabel("orgSelect", "code", $('#orgSelect').val());
    GetLabel("lineSelect", "text", $('#lineSelect').val());
    GetLabel("direction", "text", $("#direction").val());
    GetLabel("#startSpeed,#endSpeed", "text2", GetRangStr('startSpeed', 'endSpeed', '速度'));
    GetLabel("#startKm,#endKm", "text2", GetRangStr('startKm', 'endKm', '公里标'));

    $('.whereBlock').each(function () {

        var ForObjID = $(this).attr('For');
        var ForType = $(this).attr('ForType');

        var span_close = $(this).find('.lableClose');

        span_close.click(function () {

            switch (ForType) {
                case "code":
                    $('#' + ForObjID).siblings("a").click();
                    if ($('#TreeAll_Org').length > 0) {
                        $('#TreeAll_Org a').each(function () {
                            if ($(this).hasClass('curSelectedNode')) {
                                $(this).removeClass('curSelectedNode');
                            }
                        });
                    }
                    break;
                case "select":
                    $('#' + ForObjID).val(0);
                    break;
                case "text":
                    $('#' + ForObjID).val('');
                    if ($('#TreeAll').length > 0) {
                        $('#TreeAll a').each(function () {
                            if ($(this).hasClass('curSelectedNode')) {
                                $(this).removeClass('curSelectedNode');
                            }
                        });
                    }
                    $('#lineSelect').attr('value', '').attr('treeType', '').attr('code', '');
                    $('#ULlineSelect').parent().find('input[name=ztree]').val('');
                    $('#ULlineSelect').parent().find('input[name=ztree]').trigger($.Event('input'));
                    break;
                case "text2":
                    $(ForObjID).val('');
                    break;
            }

            doQuery();

        })

    })


};

function GetLabel(objID, ForType, title) {

    if (title != undefined && title != '' && title != "全部" && title != "0") {
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


function importToExcel() {
    if (!make_html_input_judge()) {
        return false;
    }
    var ju = '';   //局
    var jwd = ''; //段; //机务段
    if ($('#orgSelect').attr('treetype') == 'J') {
        ju = $('#orgSelect').attr('code')
    } else if ($('#orgSelect').attr('treetype') == 'TOPBOSS') {
        ju = ''
    } else {
        jwd = $('#orgSelect').attr('code')
    }
    //if ($('#orgSelect').attr('treetype') != undefined) {
    //} else {
    //    if ('' !== $('#TreeAll_Org').attr('treeType')) {
    //        if ('BUREAU' === $('#TreeAll_Org').attr('treeType')) {
    //            ju = $('#orgSelect').attr('code');
    //        }
    //        if ('ORG' === $('#TreeAll_Org').attr('treeType')) {
    //            jwd = $('#orgSelect').attr('code');
    //        }
    //    }
    //}
    var loccode = document.getElementById('txtloccode').value; //设备编码
    var startdate = document.getElementById('startdate').value; //时间
    var enddate = document.getElementById('enddate').value; //时间

    var linecode = '';//线路
    var txtqz = '';//区站
    if ($('#lineSelect').attr('treetype') == 'LINE') {
        linecode = $('#lineSelect').attr('code');
    } else if ($('#lineSelect').attr('treetype') == 'POSITION') {
        txtqz = $('#lineSelect').attr('code');
    }
    var direction = '0'//行别
    if ($('#direction').val() != '') {
        direction = $('#direction').attr('code')
    }
    var startKm = document.getElementById('startKm').value; //开始公里标
    var endKm = document.getElementById('endKm').value; //结束公里标
    var url = "/Report/StatusToExcelReport.aspx?"
        + "locid=" + $("#txtloccode").val()
        + "&ju=" + ju
        + "&jwd=" + jwd
        + '&txtqz_code=' + txtqz
        + '&LINE_CODE=' + linecode
        + "&jl=" + $("#txtjl").val()
        + '&direction=' + escape(direction)
        + '&startSpeed=' + $("#startSpeed").val()
        + '&endSpeed=' + $("#endSpeed").val()
        + '&startKM=' + startKm
        + '&endKM=' + endKm
        + "&startdate=" + $("#startdate").val()
        + "&enddate=" + $("#enddate").val()
        + "&OrgType=" + OrgType
        + '&version=new'
        + "&_w=" + window.screen.width
        + "&_h=" + window.screen.height
        + "&temp=" + Math.random();
    window.open(url);
};

var OnClickNumber = 1;
var map;
var point1;

function Map(wz, gis_x, gis_y) {


    if (OnClickNumber == 1) {
        Bmaps(gis_x, gis_y);
    } else {
        var point = new BMap.Point(gis_x, gis_y);    // 创建点坐标
        point1 = new BMap.Point(parseFloat(gis_x) - 1.54, parseFloat(gis_y) + 0.85);    // 创建点坐标
        var icon = new BMap.Icon("/Common/MRTA/img/动车.png", new BMap.Size(36, 44));
        var marker = new BMap.Marker(point, { icon: icon });
        map.clearOverlays();    //清除地图上所有覆盖物
        map.centerAndZoom(point1, 9); // 初始化地图，设置中心点坐标和地图级别。
        map.addOverlay(marker);
    }


    document.getElementById('_WZ').innerHTML = wz; //GIS_X
    document.getElementById('gisX').innerHTML = gis_x; //GIS_X
    document.getElementById('gisY').innerHTML = gis_y; //GIS_Y

    $('#box_gis').modal().css({
        width: 'auto',
        'margin-left': function () {
            return -($(this).width() / 2);
        },
        'margin-top': function () {
            return -($(this).height() / 2);
        }
    });

    // document.getElementById('modal-22256').click();

    map.centerAndZoom(point1, 9);

    setTimeout(function () {
        $('.anchorBL,. anchorBL').hide();
        //   $('#mapDiv span').hide();
    }, 500)


};

function Bmaps(gis_x, gis_y) {
    OnClickNumber = OnClickNumber + 1;
    //var map = new BMap.Map("mapDiv", { mapType: BMAP_HYBRID_MAP }); // 创建Map实例
    //   map = new BMap.Map("mapDiv"); // 创建Map实例
    map = new BMap.Map("mapDiv", { mapType: BMAP_HYBRID_MAP }); // 创建Map实例

    //    if (GPSJson.GIS_X != "0") {
    var point = new BMap.Point(gis_x, gis_y);    // 创建点坐标
    point1 = new BMap.Point(parseFloat(gis_x) - 1.54, parseFloat(gis_y) + 0.85);    // 创建点坐标
    map.clearOverlays();    //清除地图上所有覆盖物
    map.centerAndZoom(point1, 9); // 初始化地图，设置中心点坐标和地图级别。

    map.enableScrollWheelZoom();
    map.enableKeyboard();
    map.disableDoubleClickZoom();

    var icon = new BMap.Icon("/Common/MRTA/img/动车.png", new BMap.Size(36, 44));
    var marker = new BMap.Marker(point, { icon: icon });
    map.addOverlay(marker);

    //map.panTo(point);
    //    }
    //     else {
    //        var point = new BMap.Point(GPSJson.GIS_X_O, GPSJson.GIS_Y_O);    // 创建点坐标
    //        point1 = new BMap.Point(parseFloat(GPSJson.GIS_X_O) - 1.54, parseFloat(GPSJson.GIS_Y_O) + 0.85);    // 创建点坐标
    //        map.clearOverlays();    //清除地图上所有覆盖物
    //        map.centerAndZoom(point1, 9); // 初始化地图，设置中心点坐标和地图级别。

    //        map.enableScrollWheelZoom();
    //        map.enableKeyboard();
    //        map.disableDoubleClickZoom();

    //        var Point = new BMap.Point(GPSJson.GIS_X_O, GPSJson.GIS_Y_O);
    //        BMap.Convertor.translate(Point, 0, GPSZH, 0)
    //    }
    //  map.addControl(bmapUserTopOneRightInfo);
    //  map.addControl(new BMap.OverviewMapControl());
    map.addControl(new BMap.MapTypeControl({ anchor: BMAP_ANCHOR_TOP_LEFT }));    //左上角，默认地图控件
    map.setCurrentCity("武汉");   //由于有3D图，需要设置城市哦
    // var cr = new BMap.CopyrightControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT });
    // map.addControl(cr); //添加版权控件
    //  cr.addCopyright({ id: 1, content: "<a href='http://www.railwaytec.com'></a>" });


};
GPSZH = function (point, num) {
    var icon = new BMap.Icon("/Common/MRTA/img/动车.png", new BMap.Size(48, 64));
    var marker = new BMap.Marker(point, { icon: icon });
    map.addOverlay(marker);
};

function pagegogogo() {
    var ju = '';   //局
    var jwd = ''; //段; //机务段
    if ($('#orgSelect').attr('treetype') != undefined) {
        if ($('#orgSelect').attr('treetype') == 'J') {
            ju = $('#orgSelect').attr('code')
        } else if ($('#orgSelect').attr('treetype') == 'TOPBOSS') {
            ju = ''
        } else {
            jwd = $('#orgSelect').attr('code')
        }
    } else {
        if ('' !== $('#TreeAll_Org').attr('treeType')) {
            if ('BUREAU' === $('#TreeAll_Org').attr('treeType')) {
                ju = $('#orgSelect').attr('code');
            }
            if ('ORG' === $('#TreeAll_Org').attr('treeType')) {
                jwd = $('#orgSelect').attr('code');
            }
        }
    }

    var loccode = document.getElementById('txtloccode').value; //设备编码
    //var line = document.getElementById('lineselect').value; //设备编码
    var startdate = document.getElementById('startdate').value; //时间
    var enddate = document.getElementById('enddate').value; //时间
    //    var txtjl = document.getElementById('txtjl').value; //交路
    var linecode = '';//线路
    var txtqz = '';//区站
    if ($('#lineSelect').attr('treetype') == 'LINE') {
        linecode = $('#lineSelect').attr('code');
    } else if ($('#lineSelect').attr('treetype') == 'POSITION') {
        txtqz = $('#lineSelect').attr('code');
    }
    var direction = '0'//行别
    if ($('#direction').val() != '') {
        direction = $('#direction').attr('code')
    }
    var startSpeed = document.getElementById('startSpeed').value; //最小速度
    var endSpeed = document.getElementById('endSpeed').value; //最大速度

    var startKm = document.getElementById('startKm').value; //开始公里标
    var endKm = document.getElementById('endKm').value; //结束公里标

    $('#layPage').paging({
        index: 1,
        url: function () {
            pageindex = $('.pageValue').val();
            var url = '/C3/PC/MDeviceStatus/RemoteHandlers/MonitorLocoStateListCombine.ashx?'
        + 'locid=' + loccode
        + '&ju=' + escape(ju)
        + '&jwd=' + escape(jwd)
        + '&txtqz_code=' + escape(txtqz)
        + '&LINE_CODE=' + escape(linecode)
        + '&direction=' + escape(direction)
        + '&startSpeed=' + startSpeed
        + '&endSpeed=' + endSpeed
        + '&startKM=' + startKm
        + '&endKM=' + endKm
        + '&startdate=' + startdate
        + '&enddate=' + enddate
        + "&OrgType=" + OrgType
        + '&page=' + pageindex + '&size=' + pagesize
        + '&temp=' + Math.random();
            return url

        },

        success: function (re) {

            if (re.list.length < 1) {
                layer.msg('没有数据');
            }
            if (re != null && re != undefined) {
                getPageContent(re)
            }
            $('.page_input').css('margin-bottom', '0')
        }

    })


}

//验证函数
function make_html_input_judge() {
    if (!$("#Form1").validationEngine("validate")) {
        return false;
    } else {
        return true;
    }
}