
var pageSize = 12;
var pageIndex = 1;


$(function () {

    //变电所
    //$('#Transformer_Name').mySelect({
    //    tag: 'SUBSTATIONBYORG'
    //});
    $('#Transformer_Name').mySelectTree({
        tag: 'SUBSTATIONBYORG',
        enableFilter: true,
        height: 300,
        onClick: function (event, treeId, treeNode) {
            $("#Transformer_Name").val(treeNode.name);
            $("#Transformer_Name").attr('code', treeNode.id);
        }
    });

    //线路
    $('#Transformer_line').mySelect({
        tag: 'LINE'
    });
    //组织机构
    loadOrgSelect("Transformer_JU", "Transformer_DUAN", "Transformer_CJ", "Transformer_Class");

    //绑定行别
    $("#Transformer_Derection").mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: '3C',
        cateGory: 'DRTFLG',
        enableFilter: false,
        onClick: function (event, treeId, treeNode) {
            $("#Transformer_Derection").attr('code', treeNode.id).val(treeNode.name);
        }
    });

    //供电方式
    $("#PWMDL_NAME").mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: 'DPC',
        p_code: "POWER_SUPPLY_MODE",
        cateGory: 'SUBSTARC',
        enableFilter: false,
        onClick: function (event, treeId, treeNode) {
            $("#PWMDL_NAME").attr('code', treeNode.id).val(treeNode.name);
        }
    });

    loadFlexiGrid(); //加载flexigrid数据
})

var option; //表格内容


function GetUrlEx() {

    var SUBSTATION_CODE = $("#Transformer_Name").attr('code');  //变电所编码
    if (SUBSTATION_CODE == "0" || SUBSTATION_CODE == undefined) {
        SUBSTATION_CODE = "";
    }

    var LINE_NAME = $("#Transformer_line").find("option:selected").text();                                           //线路名称
    if (LINE_NAME == "全部") {
        LINE_NAME = "";
    }
    var LINE_CODE = $("#Transformer_line").val();                            //线路code
    if (LINE_CODE == "0") {
        LINE_CODE = "";
    }
    var DIRECTION = $("#Transformer_Derection").val();                          //行别
    var START_KM = $("#Transformer_StarKM").val();                    //开始公里标
    var END_KM = $("#Transformer_EndKM").val();                       //结束公里标
    var BUREAU_NAME = $("#Transformer_JU").find("option:selected").text();                     //局名称
    if (BUREAU_NAME == "全部") {
        BUREAU_NAME = "";
    }
    var BUREAU_CODE = $("#Transformer_JU").val();                     //局code
    if (BUREAU_CODE == "0") {
        BUREAU_CODE = "";
    }
    var POWER_SECTION_NAME = $("#Transformer_DUAN").find("option:selected").text();            //段名称
    if (POWER_SECTION_NAME == "全部") {
        POWER_SECTION_NAME = "";
    }
    var POWER_SECTION_CODE = $("#Transformer_DUAN").val();            //段code
    if (POWER_SECTION_CODE == "0") {
        POWER_SECTION_CODE = "";
    }
    var WORKSHOP_NAME = $("#Transformer_CJ").find("option:selected").text();                   //车间名称
    if (WORKSHOP_NAME == "全部") {
        WORKSHOP_NAME = "";
    }
    var WORKSHOP_CODE = $("#Transformer_CJ").val();                   //车间code
    if (WORKSHOP_CODE == "0") {
        WORKSHOP_CODE = "";
    }
    var ORG_NAME = $("#Transformer_Class").find("option:selected").text();                     //工区/班组名称
    if (ORG_NAME == "全部") {
        ORG_NAME = "";
    }
    var ORG_CODE = $("#Transformer_Class").val();                     //工区/班组code
    if (ORG_CODE == "0") {
        ORG_CODE = "";
    }
    var PWMDL = $("#PWMDL_NAME").attr("code");                        //供电方式


    var url_ex = '&LINE_NAME=' + LINE_NAME
                + '&LINE_CODE=' + LINE_CODE
                + '&DIRECTION=' + DIRECTION
                + '&START_KM=' + START_KM
                + '&END_KM=' + END_KM
                + '&BUREAU_NAME=' + BUREAU_NAME
                + '&BUREAU_CODE=' + BUREAU_CODE
                + '&POWER_SECTION_NAME=' + POWER_SECTION_NAME
                + '&POWER_SECTION_CODE=' + POWER_SECTION_CODE
                + '&WORKSHOP_NAME=' + WORKSHOP_NAME
                + '&WORKSHOP_CODE=' + WORKSHOP_CODE
                + '&ORG_NAME=' + ORG_NAME
                + '&ORG_CODE=' + ORG_CODE
                + '&PWMDL=' + PWMDL
                + '&SUBSTATION_CODE=' + SUBSTATION_CODE

    return url_ex;
};

//加载设备列表
function loadFlexiGrid() {
    option = {
        url: '/Common/MOnePlaceData/RemoteHandlers/SubstationControl.ashx?action=QueryList' + GetUrlEx(),
        dataType: 'json',
        colModel: [
                            { display: '操作', name: 'CZ', width: 161, sortable: false, align: 'center' },
                            { display: '变电所', name: 'SUBSTATION_NAME', width: 180, sortable: false, align: 'center' },
                            { display: 'SUBSTATION_CODE', name: 'SUBSTATION_CODE', width: 180, sortable: false, hide: true, align: 'center' },
                            { display: '线路', name: 'LINE_NAME', width: 180, sortable: false, align: 'center' },
                            { display: '行别', name: 'DIRECTION', width: 80, sortable: false, align: 'center' },
                            { display: '公里标', name: 'KM_MARK', width: 80, sortable: false, align: 'center' },
			                { display: '铁路局', name: 'BUREAU_NAME', width: 180, sortable: false, align: 'center' },
			                { display: '供电段', name: 'POWER_SECTION_NAME', width: 180, sortable: false, align: 'center' },
			                { display: '车间', name: 'WORKSHOP_NAME', width: 180, sortable: false, align: 'center' },
			                { display: '班组', name: 'ORG_NAME', width: 180, sortable: false, align: 'center' },
			                { display: '供电方式', name: 'PWMDL_NAME', width: 120, sortable: false, align: 'center' },
			                { display: 'id', name: 'ID', width: 80, sortable: false, pk: true, hide: true, align: 'center' }
                            ],
        usepager: true,
        //title: '查询列表',
        pagestat: '显示第 {from} 条到 {to} 条,共 {total} 条数据', // 显示当前页和总页面的样式
        procmsg: '正在处理,请稍候 ...', // 正在处理的提示信息
        nomsg: '没有数据存在!', // 无结果的提示信息
        pagetext: '当前第',
        outof: '页，总页数',
        findtext: '条件查询：',
        useRp: true,
        checkbox: false, // 是否要多选框
        rowId: 'ID', // 多选框绑定行的id
        height: $(window).height() - 250 - 10,
        onRowDblclick: rowDblclick, //双击事件
        width: 'auto',
        rp: parseInt(($(window).height() - 220) / 26.4),
        rpOptions: [parseInt(($(window).height() - 220) / 26.4), 25, 30, 40]
    }
    $("#flexTable").flexigrid(option);
};
//双击修改
function rowDblclick(rowData) {
    var id = rowData.ID.substr(1);
    var _url = '/Common/MOnePlaceData/C6_OnePlaceOnefile_look.html?ID=' + id + '&SUBSTATION_CODE=' + rowData.SUBSTATION_CODE;

    window.open(_url);
};

//查询方法
function doQuery() {
    option.url = '/Common/MOnePlaceData/RemoteHandlers/SubstationControl.ashx?action=QueryList' + GetUrlEx() + '&temp=' + Math.random();
    option.newp = 1;
    $("#flexTable").flexigrid(option);
    $("#flexTable").flexOptions(option).flexReload();

};

//弹出添加层
function addC6DeviceModal() {
    window.open('/Common/MOnePlaceData/C6_OnePlaceOnefile_Add.html');
};


//删除

function delInformation(rowData) {
    ymPrompt.confirmInfo({
        message: '确认要删除信息吗?',
        handler: function (tp) {
            if (tp == 'ok') {
                var id = rowData.id.substr(1);
                var _url = '/Common/MOnePlaceData/RemoteHandlers/SubstationControl.ashx?action=Delete&ID=' + id + '&SUBSTATION_CODE=' + rowData.cells[2].innerText;
                $.ajax({
                    type: 'POST',
                    url: _url,
                    async: true,
                    cache: false,
                    success: function (result) {
                        if (result.sign == "True") {
                            layer.msg("删除成功！");
                            doQuery(1);
                        }
                    }
                });
            }
            if (tp == 'cancel') {
            }
            if (tp == 'close') {
            }
        }
    });
};


// 编辑修改

function editInformation(rowData) {
    var id = rowData.id.substr(1);
    var _url = '/Common/MOnePlaceData/C6_OnePlaceOnefile_revise.html?type=edit&ID=' + id + '&SUBSTATION_CODE=' + rowData.cells[2].innerText;

    window.open(_url);
};

//查看详情

function checkInformation(rowData) {
    var id = rowData.id.substr(1);
    var _url = '/Common/MOnePlaceData/C6_OnePlaceOnefile_look.html?ID=' + id + '&SUBSTATION_CODE=' + rowData.cells[2].innerText;

    window.open(_url);
};