
var option; //表格内容


function loadFlexiGrid(treeName, LocCode, treeType) {
    var _h = $(window).height() - 210;
    var _PageNum = parseInt(_h / 25);
    var linecode = $("#linecode").val();
    option = {
        url: 'RemoteHandlers/LocationInfoControl.ashx?type=all&' + 'LINE_CODE=' + linecode,
        dataType: 'json',
        colModel: [
                            { display: '线路', name: 'LINE_CODE', width: 100, sortable: false, align: 'center' },
			                { display: '行别', name: 'DIRECTION', width: 100, sortable: false, hide: false, align: 'center' },
			                { display: '公里标', name: 'KM_MARK', width: 120, sortable: false, align: 'center' },
			                { display: '经度', name: 'GIS_X', width: 100, sortable: false, align: 'center' },
			                { display: '纬度', name: 'GIS_Y', width: 100, sortable: false, align: 'center' }
                            ],
        usepager: true,
        title: '定位映射信息列表',
        pagestat: '显示第 {from} 条到 {to} 条,共 {total} 条数据', // 显示当前页和总页面的样式
        procmsg: '正在处理,请稍候 ...', // 正在处理的提示信息
        nomsg: '没有数据存在!', // 无结果的提示信息
        pagetext: '当前第',
        outof: '页，总页数',
        findtext: '条件查询：',
        useRp: true,
        checkbox: false, // 是否要多选框
        rowId: 'id', // 多选框绑定行的id
        rp: _PageNum,
        showTableToggleBtn: true,
        width: 'auto',
        height: _h,
        rpOptions: [20, 50, 100, _PageNum],
        title: false, //是否包含标题 
        resizable: false, //是否可伸缩 
        striped: true //是否显示斑纹效果，默认是奇偶交互的形式
    }
    $("#flexTable").flexigrid(option);
}

//查询方法
function doQuery() {
    var lcode = $("#linecode").attr("value");
    var direct = $("#direction").attr("value");
    var km_b = $("#txt_km_b").attr("value");
    var km_b_mile = $("#km_b_mile").attr("value");
    var km_e = $("#txt_km_e").attr("value");
    var km_e_mile = $("#km_e_mile").attr("value");
    if (km_b == undefined || km_b == "") {
        km_b = 0;
    }
    if (km_b_mile == undefined || km_b_mile == "") {
        km_b_mile = 0;
    }
    if (km_e == undefined || km_e == "") {
        km_e = 0;
    }
    if (km_e_mile == undefined || km_e_mile == "") {
        km_e_mile = 0;
    }

    var intKm_b = parseInt(km_b) * 1000 + parseInt(km_b_mile);
    var intKm_e = parseInt(km_e) * 1000 + parseInt(km_e_mile);

    option.url = 'RemoteHandlers/LocationInfoControl.ashx?type=all&LINE_CODE=' + escape(lcode) + '&DIRECTION=' + direct + '&START_KM=' + intKm_b + '&END_KM=' + intKm_e;
    option.newp = 1;
    $("#flexTable").flexOptions(option).flexReload();

}

function importData() {

}

var myTree = null;

//加载树
function loadTree() {

    myTree = $("#tree").myTree({
        tag: 'LINE',
        isDefClick: false,
        onClick: function (event, treeId, treeNode) {
            $("#linecode").val(treeNode.id);
            $("#linename").val(treeNode.name);
            option.url = 'RemoteHandlers/LocationInfoControl.ashx?type=all&' + 'LINE_CODE=' + treeNode.id;
            option.newp = 1;
            $("#flexTable").flexOptions(option).flexReload();
        }
    });

}

function removeClass(val) {
    if (val.value.replace(/^ +| +$/g, '') == '') {
        $("#div" + val.id).addClass("control-group error");
    }
    if (val.value.replace(/^ +| +$/g, '') != '')
    { $("#div" + val.id).removeClass(); }
}

function validate() {
    if ($("#txtLOCOMOTIVE_CODE").val() == "") { ymPrompt.errorInfo('设备号不能为空!', null, null, '提示信息', null); return false; } //设备号 
    if ($("#txtRELEASE_DATE").val() == "") { ymPrompt.errorInfo('生产日期不能为空!', null, null, '提示信息', null); return false; } //生产日期
    return true;

}