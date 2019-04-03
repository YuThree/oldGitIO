/*========================================================================================*
* 功能说明：支柱列表页面操作和数据展示JS
* 注意事项：
* 作    者： lc
* 版本日期：2014年9月29日
* 变更说明：
* 版 本 号： V1.0.0
*=======================================================================================*/

var option; //列表控件对象

function loadFlexiGrid(code, treeType) {
    var _h = $(window).height() - 260;
    var _PageNum = parseInt(_h / 25);
    option = {
        url: 'RemoteHandlers/PoleControl.ashx',
        dataType: 'json',
        colModel: [
                            { display: '操作', name: 'cz', width: 110, sortable: false, align: 'center' },
                            { display: '支柱编码', name: 'POLE_CODE', width: 80, sortable: false, hide: true, align: 'center' },
                            { display: '业务主键', name: 'ID', width: 80, sortable: false, hide: true, align: 'center' },
                            { display: '支柱号', name: 'POLE_NO', width: 120, sortable: false, align: 'center' },
                            { display: '线路', name: 'LINE_NAME', width: 150, sortable: false, align: 'center' },
                            { display: '行别', name: 'POLE_DIRECTION', width: 80, sortable: false, align: 'center' },
                            { display: '区/站', name: 'POSITION_NAME', width: 170, sortable: false, align: 'center' },
                            { display: '桥梁、隧道', name: 'BRG_TUN_NAME', width: 150, sortable: false, align: 'center' },
                            { display: '公里标', name: 'KMSTANDARD_K', width: 80, sortable: false, align: 'center' },
                            { display: '工区', name: 'WORKSHOP_NAME', width: 140, sortable: false, align: 'center' },
                            { display: '支柱型号', name: 'POLE_TYPE', width: 80, sortable: false, hide: true, align: 'center' },

        ],
        usepager: true,
        title: '支柱列表',
        pagestat: '显示第 {from} 条到 {to} 条,共 {total} 条数据', // 显示当前页和总页面的样式
        procmsg: '正在处理,请稍候 ...', // 正在处理的提示信息
        nomsg: '没有数据存在!', // 无结果的提示信息
        pagetext: '当前第',
        outof: '页，总页数',
        findtext: '条件查询：',
        useRp: true,
        checkbox: false, // 是否要多选框
        rowId: 'ID', // 多选框绑定行的id
        rp: _PageNum,
        showTableToggleBtn: true,
        width: 'auto',
        height: _h,
        rpOptions: [20, 50, 100, _PageNum],
        title: false, //是否包含标题 
        resizable: false, //是否可伸缩 
        striped: true, //是否显示斑纹效果，默认是奇偶交互的形式
        params: [{ name: 'type', value: 'all' }],
        onRowDblclick: rowDblclick, //双击事件
        onSuccess: function () {
            addEditAndDeleteButton('#flexTable', 0); //在操作列添加编辑、删除按钮

            //修改支柱
            $('.j-pole-edit').click(function () {
                var id = $(this).parent().parent().parent().attr('id');
                var _url = '/Common/MFoundation/PoleFormNew.htm?pageType=update&id=' + id;
                window.open(_url, '_blank');
            });

            //删除支柱
            $('.j-pole-del').click(function () {
                var id = $(this).parent().parent().parent().attr('id');
                deletePole(id);
            });
        }
    };
    $("#flexTable").flexigrid(option);
}

// 查看详情
function rowDblclick(rowData) {
    var id = rowData.ID;
    //showDetailModal(rowData);

    var _url = '/Common/MFoundation/PoleDetailNew.htm?pageType=detail&id=' + id;
    window.open(_url, '_blank');
}

// 在操作列添加编辑、删除按钮
function addEditAndDeleteButton(tableId, tdIndex) {
    var poleTable_tr = $(tableId + ' tr');

    for (var i = 0; i < poleTable_tr.length; i++) {
        var btn_edit = '<span class="opera-ico pole-edit j-pole-edit"></span>';
        var btn_del = '<span class="opera-ico pole-del j-pole-del"></span>';
        var statusName = $(poleTable_tr[i]).find('td:eq(' + tdIndex + ') div').html(btn_edit + btn_del);
    }
}

var null_option = "<option value='0'>全部</option>";
//弹出添加蒙层
function addPoleModal() {
    $("#divPOLE_NO").addClass("control-group error");
    $("#divKMSTANDARD").addClass("control-group error");
    $("#divDESIGN_PULLING_VALUE").addClass("control-group error");
    $("#divLIMIT_PULLING_VALUE").addClass("control-group error");
    $("#divWIRE_DESIGN_HEIGHT").addClass("control-group error");
    $("#divWIRE_LIMIT_HEIGHT").addClass("control-group error");
    $("#divSTRUCTURE_HEIGHT").addClass("control-group error");
    $("#divFILLING_HEIGHT").addClass("control-group error");
    $("#divPOLE_ORDER").addClass("control-group error");
    $("#divGIS_LON").addClass("control-group error");
    $("#divGIS_LAT").addClass("control-group error");
    $("#ddlBureau").html($("#juselect").html());
    $('#POLE_CODE').val("");
    $('#POLE_NO').val("").removeAttr("readonly");
    $("#POLE_ORDER").val("");

    $("#MD_CODE").val("");
    $("#MD_NAME").val("");
    $("#POLE_TYPE").val("");
    $("#POLE_DIRECTION option:first").attr("selected", true);
    $("#KMSTANDARD").val("");
    $('#INSTALL_IMG_NO').val("");
    $('#INSTALL_TIME').val(dateNowStr());
    $("#POLE_USAGE").val("");
    $("#STRUCTURE_HEIGHT").val("");
    $("#GEOGRAPHY_NAME").val("");
    $("#SIDE_LIMIT_CX").val("");
    $("#CURVE_RADIUS").val("");
    $("#RAILFACE_HIGH").val("");
    $("#CURVE_DIRECTION").val("");
    $("#POLE_BASIC_TYPE").val("");
    $("#IS_FILLED option:first").attr("selected", true);
    $("#FILLING_HEIGHT").val("");
    $("#WIRE_DESIGN_HEIGHT").val("");
    $("#WIRE_LIMIT_HEIGHT").val("");
    $("#DESIGN_PULLING_VALUE").val("");
    $("#LIMIT_PULLING_VALUE").val("");
    $("#COMPS_PROPORTION").val("");
    $("#POLE_ZT_TYPE").val("");
    $("#POLE_STATUS").val("");
    $("#NOTE").val("");
    $("#POLE_CLS_BCBL").val("");
    document.getElementById('imgPOLE').src = "";
    $("#POLE_IMG").val("");
    $("#LOCATING_METHOD").val("");
    $("#GIS_LON").val("");
    $("#GIS_LAT").val("");
    $("#GIS_LON_CALC").val("");
    $("#GIS_LAT_CALC").val("");

    $("#SPAN_LENGTH").val("");
    $("#STRONG_LINE").val("");
    $("#PROTECT_LINE").val("");
    $("#POSITIVE_FEEDER").val("");

    $("#POLE_CODE").val("");
    $("#BUREAU_NAME").val("");
    $("#POWESECTION_NAME").val("");
    $("#WORKSHOP_NAME").val("");
    $("#ORG_NAME").val("");
    $("#LINE_NAME").val("");
    $("#POSITION_NAME").val("");
    $("#BRG_TUN_NAME").val("");
    $("#ddlPosition").html(null_option);
    $("#ddlBridge").html(null_option);
    $("#ddlOrg").html(null_option);
    $("#ddlWorkshop").html(null_option);
    $("#ddlWorkarea").html(null_option);
    $("#ddlLine").removeAttr("disabled");
    $("#ddlPosition").removeAttr("disabled");
    $("#ddlBridge").removeAttr("disabled");
    $("#ddlLine option:first").attr("selected", true);
    $("#ddlPosition option:first").attr("selected", true);
    $("#ddlBridge option:first").attr("selected", true);
    $("#ddlOrg option:first").attr("selected", true);
    $("#ddlBureau option:first").attr("selected", true);
    $("#ddlWorkshop option:first").attr("selected", true);
    $("#ddlWorkarea option:first").attr("selected", true);

    document.getElementById("text").value = "add";
    //document.getElementById('modal-22256').click();
    $("#modal-container-22256").modal().css({
    });
}

//弹出修改蒙层
function updatePoleModal(rowData) {

    $("#divPOLE_NO").removeClass();
    $("#divKMSTANDARD").removeClass();
    $("#divDESIGN_PULLING_VALUE").removeClass();
    $("#divLIMIT_PULLING_VALUE").removeClass();
    $("#divWIRE_DESIGN_HEIGHT").removeClass();
    $("#divWIRE_LIMIT_HEIGHT").removeClass();
    $("#divSTRUCTURE_HEIGHT").removeClass();
    $("#divFILLING_HEIGHT").removeClass();
    $("#divPOLE_ORDER").removeClass();
    $("#divGIS_LON").removeClass();
    $("#divGIS_LAT").removeClass();
    $.ajax({
        type: "POST",
        url: "RemoteHandlers/PoleControl.ashx?type=detail&id=" + rowData,
        async: true,
        cache: true,
        dataType: "json",
        success: function (rs) {

            $("#ID").val(rowData);
            $('#POLE_CODE').val(rs.POLE_CODE);
            $('#POLE_NO').val(rs.POLE_NO).attr("readonly", "readonly");
            $("#POLE_ORDER").val(rs.POLE_ORDER);
            $("#ddlLine").val(rs.LINE_CODE);
            lineChange2(rs.LINE_CODE, rs.POSITION_CODE);
            positionChange2(rs.POSITION_CODE, rs.BRG_TUN_CODE);
            ddlBridgeChange();

            $("#ddlLine").attr("disabled", "disabled");
            $("#ddlPosition").attr("disabled", "disabled");
            $("#ddlBridge").attr("disabled", "disabled");


            $("#MD_CODE").val(rs.MD_CODE);
            $("#MD_NAME").val(rs.MD_NAME);
            $("#POLE_TYPE").val(rs.POLE_TYPE);

            LoadDropdSelected('POLE_DIRECTION', rs.POLE_DIRECTION);

            $("#KMSTANDARD").val(rs.KMSTANDARD);
            $('#INSTALL_IMG_NO').val(rs.INSTALL_IMG_NO);
            $('#INSTALL_TIME').val(rs.INSTALL_TIME);
            $("#POLE_USAGE").val(rs.POLE_USAGE);
            $("#STRUCTURE_HEIGHT").val(rs.STRUCTURE_HEIGHT);
            $("#GEOGRAPHY_NAME").val(rs.GEOGRAPHY_NAME);
            $("#SIDE_LIMIT_CX").val(rs.SIDE_LIMIT_CX);
            $("#CURVE_RADIUS").val(rs.CURVE_RADIUS);
            $("#RAILFACE_HIGH").val(rs.RAILFACE_HIGH);
            $("#CURVE_DIRECTION").val(rs.CURVE_DIRECTION);
            $("#POLE_BASIC_TYPE").val(rs.POLE_BASIC_TYPE);

            LoadDropdSelected('IS_FILLED', rs.IS_FILLED);
            $("#FILLING_HEIGHT").val(rs.FILLING_HEIGHT);
            $("#WIRE_DESIGN_HEIGHT").val(rs.WIRE_DESIGN_HEIGHT);
            $("#WIRE_LIMIT_HEIGHT").val(rs.WIRE_LIMIT_HEIGHT);
            $("#DESIGN_PULLING_VALUE").val(rs.DESIGN_PULLING_VALUE);
            $("#LIMIT_PULLING_VALUE").val(rs.LIMIT_PULLING_VALUE);
            $("#COMPS_PROPORTION").val(rs.COMPS_PROPORTION);
            $("#POLE_ZT_TYPE").val(rs.POLE_ZT_TYPE);
            $("#POLE_STATUS").val(rs.POLE_STATUS);
            $("#NOTE").val(rs.NOTE);
            $("#POLE_CLS_BCBL").val(rs.POLE_CLS_BCBL);
            var FtpRoot = getConfig("FtpRoot");
            $('#imgPOLE').attr('src', FtpRoot + '/' + rs.POLE_IMG);

            $("#POLE_IMG").val(rs.POLE_IMG);
            $("#LOCATING_METHOD").val(rs.LOCATING_METHOD);
            $("#GIS_LON").val(rs.GIS_LON);
            $("#GIS_LAT").val(rs.GIS_LAT);
            $("#GIS_LON_CALC").val(rs.GIS_LON_CALC);
            $("#GIS_LAT_CALC").val(rs.GIS_LAT_CALC);

            $("#ddlBureau").html($("#juselect").html());
            $("#ddlBureau").val(rs.BUREAU_CODE);
            ddlBureauChange(rs.BUREAU_CODE, rs.POWESECTION_CODE)
            ddlOrgChange(rs.POWESECTION_CODE, rs.WORKSHOP_CODE);
            ddlWorkshopChange(rs.WORKSHOP_CODE, rs.ORG_CODE);
            $("#ORG_NAME").val(rs.ORG_NAME);
            $("#BRG_TUN_NAME").val(rs.BRG_TUN_NAME);
            $("#SPAN_LENGTH").val(rs.SPAN_LENGTH);
            $("#STRONG_LINE").val(rs.STRONG_LINE);
            $("#PROTECT_LINE").val(rs.PROTECT_LINE);
            $("#POSITIVE_FEEDER").val(rs.POSITIVE_FEEDER);

            document.getElementById("text").value = "update";
            document.getElementById('modal-22256').click();
        }
    });

}


//执行添加支柱操作
function Add() {
    if (validate()) {
        var options = {
            url: "RemoteHandlers/PoleControl.ashx?type=add",
            type: 'POST',
            success: function (result) {
                if (result == "1") {
                    ymPrompt.succeedInfo('添加成功', null, null, '提示信息', function () {
                        $("#flexTable").flexReload();
                    });
                } else if (result == "-2") {
                    ymPrompt.errorInfo('支柱编码已存在，请更改相关信息后重试！', null, null, '提示信息', null);
                }
                else {
                    ymPrompt.errorInfo('添加失败', null, null, '提示信息', null);
                }
                document.getElementById('close').click();
            }
        };
        $('#poleFormEdit').ajaxSubmit(options);
    }
}

//执行修改支柱操作
function Update() {
    if (validate()) {
        var options = {
            url: "/Common/MFoundation/RemoteHandlers/PoleControl.ashx?type=update",
            type: 'POST',
            success: function (result) {
                if (result == "1") {
                    ymPrompt.succeedInfo('更新成功', null, null, '提示信息', function () {
                        $("#flexTable").flexReload();
                    });
                } else {
                    ymPrompt.errorInfo('更新失败', null, null, '提示信息', null);
                }
                document.getElementById('close').click();
            }
        };
        $('#poleFormEdit').ajaxSubmit(options);
    }
}

//删除支柱
function deletePole(rowData) {
    if (confirm('确认要删除此记录吗?')) {
        $.ajax({
            type: "post",
            url: "/Common/MFoundation/RemoteHandlers/PoleControl.ashx?type=delete&id=" + escape(rowData) + '&temp=' + Math.random(),
            cache: false,
            dataType: 'json',
            success: function (result) {
                var json = result;
                var info = '';
                var strPole = '';
                var strSupport = '';
                var strLocation = '';
                if ('1' === json.POLE_RESULT) {
                    strPole = '支柱删除成功';
                } else {
                    strPole = '支柱删除失败';
                }
                if ('2' === json.POLE_SPTD_RESULT) {
                    strSupport = '支撑装置删除成功';
                } else {
                    strSupport = '支撑装置删除失败';
                }
                if ('3' === json.POLE_LOCATOR) {
                    strLocation = '定位装置删除成功';
                } else {
                    strLocation = '定位装置删除失败';
                }
                info = strPole + '<br />' + strSupport + '<br />' + strLocation;
                ymPrompt.succeedInfo(info, null, null, '提示信息', function () {
                    $("#flexTable").flexReload();
                });
                //if (result == "1") {
                //}
                //else {
                //    ymPrompt.errorInfo('删除失败', null, null, '提示信息', null);
                //}
            }
        });
    }
}

//查询方法
function doQuery() {
    var POLENO = $("#txtPOLE_NO").val();
    var LINE = $("#lineselect").attr("value");
    var POSITION = $("#positionselect").attr("value");
    var BRIDGE = $("#bridgeselect").val();
    var BUREAU = $("#juselect").attr("value");
    var POWERSECTION = $("#duanselect").attr("value");
    var WORKSHOP = $("#chejianselect").attr("value");
    var WORKAREA = $("#gongquselect").attr("value");
    var STARTKM = $("#startKM").val().replace("+", "").replace("K", "").replace("k", "");
    var ENDKM = $("#endKM").val().replace("+", "").replace("K", "").replace("k", ""); ;
    var XB = $("#DDLXB").val();
    option.params = [{ name: 'type', value: 'all' },
        { name: 'POLENO', value: $("#txtPOLE_NO").val() },
        { name: 'LINE_CODE', value: $("#lineselect").val() },
        { name: 'POSITION_CODE', value: $("#positionselect").val() },
        { name: 'BRIDGE_CODE', value: $("#bridgeselect").val() },
        { name: 'BUREAU_CODE', value: $("#juselect").val() },
        { name: 'POWER_SECTION_CODE', value: $("#duanselect").val() },
        { name: 'WORKSHOP_CODE', value: $("#chejianselect").val() },
        { name: 'WORKAREA_CODE', value: $("#gongquselect").val() },
        { name: 'START_KM', value: $("#startKM").val().replace("+", "").replace("K", "").replace("k", "") },
        { name: 'END_KM', value: $("#endKM").val().replace("+", "").replace("K", "").replace("k", "") },
        { name: 'XB', value: $("#DDLXB").val()}];
    option.url = 'RemoteHandlers/PoleControl.ashx';
    option.newp = 1;
    $("#flexTable").flexOptions(option).flexReload();

}

//判断弹出添加蒙层还是修改蒙层
function addOrUpdate() {
    var type = document.getElementById("text").value;
    if (type == "add") {
        Add();
    }
    else if (type == "update") {
        Update();
    }
}

//加载树
function loadTree() {

    $("#tree").myTree({
        tag: 'BRIDGETUNE',
        isDefClick: false,
        onClick: function (event, treeId, treeNode) {
            //侧面树控制添加下拉控件联动
            fullShow();
            if ('LINE' === treeNode.treeType) { //选择线路
                $('#lineselect').val(treeNode.id).trigger('change');
                setTimeout(function () {
                    $('#bridgeselect').val('');
                    fullHide();
                }, 1200);
            }
            if ('POSITION' === treeNode.treeType) { //选择区站
                $('#lineselect').val(treeNode.pId).trigger('change');
                setTimeout(function () {
                    $('#positionselect').val(treeNode.id);
                    fullHide();
                }, 1200);
            }
            if ('BRIDGETUNE' === treeNode.treeType) { //选择桥隧
                $('#lineselect').val(treeNode.getParentNode().getParentNode().id).trigger('change');
                setTimeout(function () {
                    $('#positionselect').val(treeNode.pId).trigger('change');
                    setTimeout(function () {
                        $('#bridgeselect').val(treeNode.id);
                        fullHide();
                    }, 1200);
                }, 1200);
            }
            option.params = [{ name: 'type', value: 'all' },
                { name: 'CODE', value: treeNode.id },
                { name: 'TREETYPE', value: treeNode.treeType}];
            $("#flexTable").flexOptions(option).flexReload();
        }
    });
}

//加载下拉
function loadSelect() {

    $("#lineselect").mySelect({
        tag: "Line",
        callback: function (rs) {
            $("#ddlLine").html(rs);
        }
    });
    loadOrgSelect("juselect", "duanselect", "chejianselect", "gongquselect");
}

function ddlBureauChange(code, scode) {
    if (code == "0") {
        $("#BUREAU_NAME").val("");
        $("#ddlOrg").html(null_option);
        $("#ddlWorkshop").html(null_option);
        $("#ddlWorkarea").html(null_option);
    }
    else {
        $("#BUREAU_NAME").val($("#ddlBureau").find("option:selected").text());
        $("#ddlOrg").mySelect({
            tag: "ORGANIZATION",
            code: code,
            type: "GDD",
            async: false,
            callback: function (rs) {
                if (scode) {
                    $("#ddlOrg").val(scode);
                }
                $("#ddlWorkshop").html(null_option);
                $("#ddlWorkarea").html(null_option);
            }
        });
    }
}

function ddlOrgChange(code, scode) {
    if (code == "0") {
        $("#POWESECTION_NAME").val("");
        $("#ddlWorkshop").html(null_option);
        $("#ddlWorkarea").html(null_option);
    }
    else {
        $("#POWESECTION_NAME").val($("#ddlOrg").find("option:selected").text());
        $("#ddlWorkshop").mySelect({
            tag: "ORGANIZATION",
            code: code,
            async: false,
            callback: function (rs) {
                if (scode) {
                    $("#ddlWorkshop").val(scode);
                }
                $("#ddlWorkarea").html(null_option);
            }
        });
    }
}

function ddlWorkshopChange(code, scode) {
    if (code == "0") {
        $("#WORKSHOP_NAME").val("");
        $("#ddlWorkarea").html(null_option);
    }
    else {
        $("#WORKSHOP_NAME").val($("#ddlWorkshop").find("option:selected").text());
        $("#ddlWorkarea").mySelect({
            tag: "ORGANIZATION",
            code: code,
            async: false,
            callback: function (rs) {
                if (scode) {
                    $("#ddlWorkarea").val(scode);
                }
            }
        });
    }
}

function ddlWorkareaChange(s) {
    $("#ORG_NAME").val($("#ddlWorkarea").find("option:selected").text());
}

//线路查询下拉联动区站
function lineChange(code) {
    if (code == "0") {
        $("#positionselect").html("<option value='0'>全部</option>");
        $("#bridgeselect").html("<option value='0'>全部</option>");
    }
    else {
        $("#positionselect").mySelect({
            tag: "StationSection",
            code: code,
            callback: function (rs) {
                $("#bridgeselect").html("<option value='0'>全部</option>");
            }
        });
    }
}

//区站查询下拉联动桥隧
function positionChange(code) {
    if (code == "0") {
        $("#bridgeselect").html("<option value='0'>全部</option>");
    }
    else {
        $("#bridgeselect").mySelect({
            tag: "BridgeTune",
            code: code
        });
    }
}

//线路查询下拉联动区站
function lineChange2(code, scode) {

    if (code == "0") {
        $("#LINE_NAME").val("");
        $("#ddlPosition").html("<option value='0'>全部</option>");
        $("#ddlBridge").html("<option value='0'>全部</option>");
    }
    else {
        $("#LINE_NAME").val($("#ddlLine").find("option:selected").text());
        $("#ddlPosition").mySelect({
            tag: "StationSection",
            code: code,
            async: false,
            callback: function (rs) {
                if (scode) {
                    $("#ddlPosition").val(scode);
                }
                $("#ddlBridge").html("<option value='0'>全部</option>");
            }
        });
    }
}

//区站查询下拉联动桥隧
function positionChange2(code, scode) {
    if (code == "0") {
        $("#POSITION_NAME").val("");
        $("#ddlBridge").html("<option value='0'>全部</option>");
    }
    else {
        poleCodeGenerate();
        $("#POSITION_NAME").val($("#ddlPosition").find("option:selected").text());
        $("#ddlBridge").mySelect({
            tag: "BridgeTune",
            code: code,
            async: false,
            callback: function () {
                $("#ddlBridge").val(scode);
            }
        });
    }
}

function ddlBridgeChange() {
    $("#BRG_TUN_NAME").val($("#ddlBridge").find("option:selected").text());

    poleCodeGenerate();


}


function poleNoChange(t) {
    removeClass(t);
    poleCodeGenerate();
}

//生成支柱编号
function poleCodeGenerate() {

    var positionCode = $("#ddlPosition").val();
    var bridgeCode = $("#ddlBridge").val();
    var directionCode = $("#POLE_DIRECTION").val();
    var poleNo = $("#POLE_NO").val();
    var rs = "";

    directionCode = directionCode == "上行" ? "0" : "1";

    if (poleNo.length < 4) {
        var str = "";
        for (var i = 0; i < 4 - poleNo.length; i++) str += "0";
        poleNo = str + poleNo;
    }
    if (bridgeCode != "0") {
        $("#POLE_CODE").val(bridgeCode + "$" + directionCode + "$" + poleNo);
    }
    else if (positionCode != "0") {
        $("#POLE_CODE").val(positionCode + "$000$" + directionCode + "$" + poleNo);
    }
}


//详细蒙层
function showDetailModal(rowData) {
    var FtpRoot = getConfig("FtpRoot");
    $.ajax({
        type: "POST",
        url: "RemoteHandlers/PoleControl.ashx?type=detail&id=" + rowData,
        async: true,
        cache: true,
        dataType: "json",
        success: function (rs) {

            $('#Img1').attr('src', FtpRoot + '/' + rs.POLE_IMG);
            $('#lblPOLE_NO').text(rs.POLE_NO);
            $("#lblPOLE_ORDER").text(rs.POLE_ORDER);
            $("#lblLine").text(rs.LINE_NAME);
            $("#lblPosition").text(rs.POSITION_NAME);
            $("#lblBridge").text(rs.BRG_TUN_NAME);
            $("#lblWorkArea").text(rs.ORG_NAME);
            $("#lblMD_CODE").text(rs.MD_CODE);
            $("#lblMD_NAME").text(rs.MD_NAME);
            $("#lblPOLE_TYPE").text(rs.POLE_TYPE);
            $("#lblPOLE_DIRECTION").text(rs.POLE_DIRECTION);
            $("#lblKMSTANDARD").text(rs.KMSTANDARD);
            $('#lblINSTALL_IMG_NO').text(rs.INSTALL_IMG_NO);
            $('#lblINSTALL_TIME').text(rs.INSTALL_TIME);
            $("#lblPOLE_USAGE").text(rs.POLE_USAGE);
            $("#lblSTRUCTURE_HEIGHT").text(rs.STRUCTURE_HEIGHT);
            $("#lblGEOGRAPHY_NAME").text(rs.GEOGRAPHY_NAME);
            $("#lblSIDE_LIMIT_CX").text(rs.SIDE_LIMIT_CX);
            $("#lblCURVE_RADIUS").text(rs.CURVE_RADIUS);
            $("#lblRAILFACE_HIGH").text(rs.RAILFACE_HIGH);
            $("#lblCURVE_DIRECTION").text(rs.CURVE_DIRECTION);
            $("#lblPOLE_BASIC_TYPE").text(rs.POLE_BASIC_TYPE);
            $("#lblIS_FILLED").text(rs.IS_FILLED);
            $("#lblFILLING_HEIGHT").text(rs.FILLING_HEIGHT);
            $("#lblWIRE_DESIGN_HEIGHT").text(rs.WIRE_DESIGN_HEIGHT);
            $("#lblWIRE_LIMIT_HEIGHT").text(rs.WIRE_LIMIT_HEIGHT);
            $("#lblDESIGN_PULLING_VALUE").text(rs.DESIGN_PULLING_VALUE);
            $("#lblLIMIT_PULLING_VALUE").text(rs.LIMIT_PULLING_VALUE);
            $("#lblCOMPS_PROPORTION").text(rs.COMPS_PROPORTION);
            $("#lblPOLE_ZT_TYPE").text(rs.POLE_ZT_TYPE);
            $("#lblPOLE_STATUS").text(rs.POLE_STATUS);
            $("#lblNOTE").text(rs.NOTE);
            $("#lblPOLE_CLS_BCBL").text(rs.POLE_CLS_BCBL);
            $("#lblPOLE_IMG").text(rs.POLE_IMG);
            $("#lblLOCATING_METHOD").text(rs.LOCATING_METHOD);
            $("#lblGIS_LON").text(rs.GIS_LON);
            $("#lblGIS_LAT").text(rs.GIS_LAT);
            $("#lblGIS_LON_CALC").text(rs.GIS_LON_CALC);
            $("#lblGIS_LAT_CALC").text(rs.GIS_LAT_CALC);
            $("#lblBureau").text(rs.BUREAU_NAME);
            $("#lblPowerSection").text(rs.POWESECTION_NAME);
            $("#lblWorkShop").text(rs.WORKSHOP_NAME);
            $("#lblSPAN_LENGTH").text(rs.SPAN_LENGTH);
            $("#lblSTRONG_LINE").text(rs.STRONG_LINE);
            $("#lblPROTECT_LINE").text(rs.PROTECT_LINE);
            $("#lblPOSITIVE_FEEDER").text(rs.POSITIVE_FEEDER);
            document.getElementById('modal-detail-a').click();
        }
    });
}

function validate() {
    if ($("#POLE_NO").val() == "") { ymPrompt.errorInfo('支柱号不能为空!', null, null, '提示信息', null); return false; } //支柱号
    if ($("#KMSTANDARD").val() == "" || !StringHelper.isFloat($("#KMSTANDARD").val())) { ymPrompt.errorInfo('所属公里标输入错误!', null, null, '提示信息', null); return false; } //所属公里标

    if ($("#DESIGN_PULLING_VALUE").val() == "") { ymPrompt.errorInfo('拉出值、设计值不能为空!', null, null, '提示信息', null); return false; } //拉出值、设计值
    if ($("#LIMIT_PULLING_VALUE").val() == "") { ymPrompt.errorInfo('拉出值、限界值不能为空!', null, null, '提示信息', null); return false; } //拉出值、限界值
    if ($("#WIRE_DESIGN_HEIGHT").val() == "") { ymPrompt.errorInfo('导线高度、设计值不能为空!', null, null, '提示信息', null); return false; } //导线高度、设计值
    if ($("#WIRE_LIMIT_HEIGHT").val() == "") { ymPrompt.errorInfo('导线高度、限界值不能为空!', null, null, '提示信息', null); return false; } //导线高度、限界值
    if ($("#STRUCTURE_HEIGHT").val() == "") { ymPrompt.errorInfo('结构高度不能为空!', null, null, '提示信息', null); return false; } //结构高度
    if ($("#ddlPosition").val() == "0" && $("#ddlBridge").val() == "0") { ymPrompt.errorInfo('区站或桥隧不能为空!', null, null, '提示信息', null); return false; }
    if (!StringHelper.isFloat($("#GIS_LON").val()) && $("#GIS_LON").val() != "") { ymPrompt.errorInfo('经度必须为数字!', null, null, '提示信息', null); return false; }
    if (!StringHelper.isFloat($("#GIS_LAT").val()) && $("#GIS_LAT").val() != "") { ymPrompt.errorInfo('纬度必须为数字!', null, null, '提示信息', null); return false; }
    return true;

}

function removeClass(val) {
    if (val.value.replace(/^ +| +$/g, '') == '') {
        $("#div" + val.id).addClass("control-group error");
    }
    if (val.value.replace(/^ +| +$/g, '') != '')
    { $("#div" + val.id).removeClass(); }
}

function DDLremoveClass(spanobj) {

    var objID = spanobj.id;

    var obj_sele = $('#' + objID).find('select');
    var index = obj.get(0).selectedIndex

    if (index > 0) {
        $("#" + objID).removeClass();
    }
    else {
        $("#" + objID).addClass("control-group error");
    }
}


//建立一個可存取到該file的url
function getObjectURL(file) {
    var url = null;
    if (window.createObjectURL != undefined) { // basic
        url = window.createObjectURL(file);
    } else if (window.URL != undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
}