

var index_speed_min = ''; //最小速度提示框所需编号
var index_speed_max = ''; //最大速度提示框所需编号
var pagesize = 10;//页大小
// 右边设备栏的隐藏和显示
$(document).ready(function () {
    $("#Form1").validationEngine({
        validationEventTriggers: "blur",  //触发的事件  "keyup blur",   
        inlineValidation: true, //是否即时验证，false为提交表单时验证,默认true   
        success: false, //为true时即使有不符合的也提交表单,false表示只有全部通过验证了才能提交表单,默认false
        promptPosition: "topLeft"//提示位置，topLeft, topRight, bottomLeft,  centerRight, bottomRight
    });

    LoadingHistoricalTime("startdate", "enddate"); ///  Common\js\6cweb\HistoricalTime.js
    //$(".body").css("height", $(window).height() - 255);
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

    document.getElementById("_loctree").style.height = $(window).height() - 65 + "px";

    document.getElementById('startdate').value = datehhmm00NowStr("00:00:00"); //获取当前日期
    document.getElementById('enddate').value = datehhmm00NowStr("23:59:59"); //获取当前日期   

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
    $('#TreeAll').myTree({
        type: 'Organization-ju',//指定类型
        enableFilter: true,
        isDefClick: false,
        onClick: function (event, treeId, treeNode) {
            //console.log(treeNode.treeType + ':' + treeNode.name + 'code' + treeNode.id)
            if (treeNode.treeType == "BUREAU") {//局
                $('#orgSelect').attr({ 'treetype': 'J', 'code': treeNode.id });
                $('#orgSelect').val(treeNode.name);
                doQuery();
            } else if (treeNode.treeType == "ORG") {// 段
                var str = treeNode.id;
                var index = str.lastIndexOf("$");
                str = str.substring(index + 1, str.length);
                $('#orgSelect').attr({ 'treetype': str, 'code': treeNode.id });
                $('#orgSelect').val(treeNode.name);
                doQuery();
            } else if (treeNode.treeType == "LOCOMOTIVE") {
                $('#orgSelect').attr({ 'treetype': '', 'code': '' });
                $('#orgSelect').val('');
                $('#txtloccode').val(treeNode.name);
                doQuery();
            }

        }
    });

    $('#orgSelect').mySelectTree({
        tag: 'ORGANIZATION',
        height: 250,
        enableFilter: true,
    });
    $('#lineSelect').mySelectTree({
        tag: 'STATIONSECTION',
        height: 250,
        enableFilter: true,
    });

    hideC3infobyID("jltr"); //隐藏动车数据的交路运用区段信息查询信息  

    var Loc = GetQueryString("LOCOMOTIVE_CODE"); //取双端降弓传来的车号
    var Sta = GetQueryString("starttime");
    var End = GetQueryString("endtime");
    if (Loc != "" && Loc != null) {
        $("#txtloccode").val(Loc);
    };
    if (Sta != "" && Loc != null) {
        $("#startdate").val(Sta);
    }
    if (End != "" && Loc != null) {
        $("#enddate").val(End);
    }
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
        doQueryHistoricalTime(); ///  Common\js\6cweb\HistoricalTime.js
        var bool = $("#Form1").validationEngine("validate");
        if (bool) {
            doQuery();
            $('#box_search').modal('toggle');
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
    //if (FunEnable('Fun_LOCSTATE_NEW') != "True" && marcar == "1") {
    //    $(".head div[debug='true']").hide();
    //    $("#head_new").show();
    //} else {
    $("#head").show();
    //}
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
                    $('#search_bg a[name="ztree"]').click();
                    $('#search_bg input[type="text"]').val('');

                    $('#txtloccode').val('');
                    $('#search_bg select').each(function () {

                        $(this).find('option:first').prop("selected", 'selected');

                    })


                    $('#txtloccode').attr('value', '');
                    $('#orgSelect').attr('value', '');
                    $('#lineSelect').attr('value', '');
                    $('#direction').attr('value', '');
                    $('#startKm').attr('value', '');
                    $('#endKm').attr('value', '');
                    $('#startSpeed').attr('value', '');
                    $('#endSpeed').attr('value', '');
                    $('#ULlineSelect').prev().find('input[name=ztree]').attr('value', '');
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
});
var first = true;
var pageUrl = "";

function doQuery() {

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
    };
    var loccode = document.getElementById('txtloccode').value; //设备编码
    var startdate = document.getElementById('startdate').value; //时间
    var enddate = document.getElementById('enddate').value; //时间
    //    var txtjl = document.getElementById('txtjl').value; //交路
    // var txtqz = document.getElementById('txtqz').value; //区站
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

    pageUrl = '/C3/PC/MDeviceStatus/RemoteHandlers/MonitorLocoStateListCombine.ashx?'
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
        + '&temp=' + Math.random();

    first = true; //首次加载翻页
    //window.open('/C3/PC/MDeviceStatus/public_stateList.html?'
    //    + 'locid=' + loccode
    //    + '&ju=' + escape(ju)
    //    + '&jwd=' + escape(jwd)
    //    + '&txtqz_code=' + escape(txtqz)
    //    + '&LINE_CODE=' + escape(linecode)
    //    + '&direction=' + escape(direction)
    //    + '&startSpeed=' + startSpeed
    //    + '&endSpeed=' + endSpeed
    //    + '&startKM=' + startKm
    //    + '&endKM=' + endKm
    //    + '&startdate=' + startdate
    //    + '&enddate=' + enddate
    //    + '&temp=' + Math.random())
    //goPage(1, 10, false, pageUrl);
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
        + '&temp=' + Math.random()).height($(window).height() - 160).width()
    SetWhereMemo();
}

function SetWhereMemo() {
    $('#txt_whereMemo').html('');

    GetLabel("orgSelect", "code", $('#orgSelect').val());

    GetLabel("direction", "text", $("#direction").val());
    GetLabel("lineSelect", "text", $('#lineSelect').val());

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
                    if ($('#TreeAll').length > 0) {
                        $('#TreeAll a').each(function () {
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
                    $('#lineSelect').attr('value', '').attr('treeType', '').attr('code', '');
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

    if (title != undefined && title != '' && title != "全部") {
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


function importToExcel(bol) {
    if (!make_html_input_judge()) {
        return false;
    }
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
    };
    var linecode = '';//线路
    var txtqz = '';//区站
    if ($('#lineSelect').attr('treetype') == 'LINE') {
        linecode = $('#lineSelect').attr('code');
    } else if ($('#lineSelect').attr('treetype') == 'POSITION') {
        txtqz = $('#lineSelect').attr('code');
    }
    var startKm = document.getElementById('startKm').value; //开始公里标
    var endKm = document.getElementById('endKm').value; //结束公里标
    var direction = '0'//行别
    if ($('#direction').val() != '') {
        direction = $('#direction').attr('code')
    }
    if (bol) {
        var url = "/Report/StatusToExcelReport.aspx?"
            + "locid=" + $("#txtloccode").val()
            + "&ju=" + ju
            + "&jwd=" + jwd
            + '&txtqz_code=' + escape(txtqz)
            + "&LINE_CODE=" + escape(linecode)
            + "&jl=" + $("#txtjl").val()
            + '&direction=' + escape(direction)
            + '&startSpeed=' + $("#startSpeed").val()
            + '&endSpeed=' + $("#endSpeed").val()
            + '&startKM=' + startKm
            + '&endKM=' + endKm
            + "&startdate=" + $("#startdate").val()
            + "&enddate=" + $("#enddate").val()
            + '&version=new'
            + "&_w=" + window.screen.width
            + "&_h=" + window.screen.height
            + "&temp=" + Math.random();
        window.open(url);
    } else {
        var index = layer.load(1, {
            shade: [0.1, '#fff'] //0.1透明度的白色背景
        });
        var url = "/C3/PC/MAlarmMonitoring/STATUS.ashx?"
            + "locid=" + $("#txtloccode").val()
            + "&ju=" + ju
            + "&jwd=" + jwd
            + '&txtqz_code=' + escape(txtqz)
            + "&LINE_CODE=" + escape(linecode)
            + "&jl=" + $("#txtjl").val()
            + '&direction=' + escape(direction)
            + '&startSpeed=' + $("#startSpeed").val()
            + '&endSpeed=' + $("#endSpeed").val()
            + '&startKM=' + startKm
            + '&endKM=' + endKm
            + "&startdate=" + $("#startdate").val()
            + "&enddate=" + $("#enddate").val()
            + '&version=new'
            + "&_w=" + window.screen.width
            + "&_h=" + window.screen.height
            + "&temp=" + Math.random();
        $.ajax({
            type: "POST",
            url: url,
            async: true,
            cache: true,
            success: function (result) {
                layer.closeAll('loading');
                Downer(result.url)
            }

        })
    }

};

//function SetWhereMemo() {
//    $('#txt_whereMemo').html('');

//    GetLabel("juselect", "select", $("#juselect").find("option:selected").text());
//    GetLabel("duanselect", "select", $("#duanselect").find("option:selected").text());

//    GetLabel("direction", "select", $("#direction").find("option:selected").text());
//    GetLabel("txtqz", "text", $('#txtqz').val());

//    GetLabel("#startSpeed,#endSpeed", "text2", GetRangStr('startSpeed', 'endSpeed', '速度'));

//    $('.whereBlock').each(function () {

//        var ForObjID = $(this).attr('For');
//        var ForType = $(this).attr('ForType');

//        var span_close = $(this).find('.lableClose');

//        span_close.click(function () {

//            switch (ForType) {
//                case "select":
//                    $('#' + ForObjID).val(0);
//                    break;
//                case "text":
//                    $('#' + ForObjID).val('');
//                    break;
//                case "text2":
//                    $(ForObjID).val('');

//                    break;
//            }

//            doQuery();

//        })

//    })


//};
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

//验证函数
function make_html_input_judge() {
    if (!$("#Form1").validationEngine("validate")) {
        return false;
    } else {
        return true;
    }
}