/*========================================================================================*
* 功能说明：组织机构页面操作和数据展示JS
* 注意事项：
* 作    者： 邓杰
* 版本日期：2013年10月23日
* 变更说明：
* 版 本 号： V1.0
*=======================================================================================*/

///页面列表数据加载
function loadFlexiGrid(code, treeType) {
    var _h = $(window).height() - 200 - 20;
    var _PageNum = parseInt(_h / 25);
    option = {
        url: 'RemoteHandlers/DutyRangeControl.ashx?type=all&CODE=' + escape(code) + "&TREETYPE=" + escape(treeType),
        dataType: 'json',
        colModel: [
                            { display: '机构名称', name: 'ORG_NAME', width: 120, sortable: false, align: 'center' },
                            { display: '机构类型', name: 'ORG_TYPE', hide: true, width: 120, sortable: false, align: 'center' },
                            { display: '机构顺序', name: 'ORG_ORDER', hide: true, width: 60, sortable: false, align: 'center' },
                            { display: '上级机构名称', name: 'SUP_ORG_NAME', hide: true, width: 120, sortable: false, align: 'center' },
                            { display: '联系人', name: 'LINK_MAN', hide: true, width: 80, sortable: false, align: 'center' },
                            { display: '联系电话', name: 'LINK_TEL', hide: true, width: 80, sortable: false, align: 'center' },
                            { display: '地址', name: 'ORG_ADDR', hide: true, width: 80, sortable: false, align: 'center' },
                            { display: '邮编', name: 'POSTCODE', hide: true, width: 80, hide: true, sortable: false, align: 'center' },
                            { display: '经度坐标', name: 'GIS_LON', hide: true, width: 60, sortable: false, align: 'center' },
                            { display: '纬度坐标', name: 'GIS_LAT', hide: true, width: 60, sortable: false, align: 'center' },
                            { display: '编码', name: 'ORG_CODE', hide: true, width: 80, sortable: false, align: 'center' },
                            { display: 'RID', name: 'RID', hide: true, width: 60, sortable: false, align: 'center' },
                            { display: '等级', name: 'org_level', width: 60, sortable: false, align: 'center' },
                            { display: '线路', name: 'line_code', hide: true, width: 60, sortable: false, align: 'center' },
                            { display: '起始公里标', name: 'start_km', width: 60, sortable: false, align: 'center' },
                            { display: '结束公里标', name: 'end_km', width: 60, sortable: false, align: 'center' },
                            { display: '行别', name: 'direction', width: 60, sortable: false, align: 'center' },
                            { display: '线路', name: 'line_Name', width: 60, sortable: false, align: 'center' },
                            { display: '操作', name: 'cz', width: 120, sortable: false, align: 'center' },
                            { display: 'id', name: 'id', width: 80, pk: true, hide: true, sortable: false, align: 'center' }
        ],
        usepager: true,
        title: '组织列表',
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
    var org_name = $('#Organization').val();
    option.url = 'RemoteHandlers/DutyRangeControl.ashx?type=all&ORG_NAME=' + escape(org_name) + '&temp=' + Math.random();
    option.newp = 1;
    $("#flexTable").flexOptions(option).flexReload();

}


//弹出添加蒙层
function addOrganizationModal() {

    var TreeCode = $("#TXTTREEORG_CODE").val();

    if (TreeCode == '') {
        ymPrompt.errorInfo('请先从左侧树中选择一个组织机构', null, null, '提示信息', null);
        return;
    }

    $('#txt_RID').val('')
    $('#txt_org_level').val('');
    $('#ddlOrgType').val('');
    $('#txt_start_km').val('');
    $('#txt_end_km').val('');
    $('#ddl_xb').val('');

    var treeObj = $.fn.zTree.getZTreeObj("tree");
    var nodes = treeObj.getSelectedNodes();

    $('#span_orgName').html(nodes[0].name); //机构名称
    $('#span_orgCode').html(TreeCode); //机构编码

    document.getElementById('a_m').click();
}

function MModal(rowData) {

    var name = $('div:eq(0)', rowData).text().trim();
    var code = $('div:eq(10)', rowData).text().trim();
    var RID = $('div:eq(11)', rowData).text().trim();
    var level = $('div:eq(12)', rowData).text().trim();
    var lineCode = $('div:eq(13)', rowData).text().trim();

    var start_km = $('div:eq(14)', rowData).text().trim();
    var end_km = $('div:eq(15)', rowData).text().trim();
    var direction = $('div:eq(16)', rowData).text().trim();


    $('#txt_RID').val(RID);
    if ($('#txt_RID').val() != '') {
        $('#txt_org_level').val(level);
        $('#ddlOrgType').val(lineCode);
        $('#txt_start_km').val(start_km);
        $('#txt_end_km').val(end_km);
        $('#ddl_xb').val(direction);

    }
    $('#span_orgName').html(name); //机构名称
    $('#span_orgCode').html(code); //机构编码

    document.getElementById('a_m').click();
}


function SaveM() {
    if (validate()) {

        var dt = {
            type: "MSave",
            code: $('#span_orgCode').text(),
            name: $('#span_orgName').text(),
            RID: $('#txt_RID').val(),
            level: $('#txt_org_level').val(),
            lineCode: $('#ddlOrgType').val(),
            start_km: $('#txt_start_km').val(),
            end_km: $('#txt_end_km').val(),
            direction: $('#ddl_xb').val()
        };

        $.ajax({
            type: "POST",
            url: "RemoteHandlers/DutyRangeControl.ashx",
            async: false,
            cache: true,
            data: dt,
            success: function (result) {
                if (result == "1") {
                    ymPrompt.succeedInfo('保存成功', null, null, '提示信息', function () {
                        document.getElementById('btn_close2').click();
                        $("#flexTable").flexReload();
                    });
                }
                else {
                    ymPrompt.errorInfo('操作失败！请联系管理员', null, null, '提示信息', null);
                }
            }
        });
    }
}

//删除
function deleteOrganization(rowData) {
    if (confirm('确认要删除这条记录吗?')) {
        $.ajax({
            type: "POST",
            url: "RemoteHandlers/DutyRangeControl.ashx?type=delete&id=" + escape($('div:eq(11)', rowData).text()),
            async: false,
            cache: true,
            success: function (result) {
                if (result == "1") {
                    ymPrompt.succeedInfo('删除成功', null, null, '提示信息', function () {
                        $("#flexTable").flexReload();
                        myTree.reAsyncChildNodes(null, "refresh");
                    });
                }
                else {
                    ymPrompt.errorInfo('操作失败！请联系管理员', null, null, '提示信息', null);
                }
            }
        });
    }
}

///加载树
var myTree = null;
function loadTree() {
    myTree = $("#tree").myTree({
        tag: 'ORGANIZATION',
        isDefClick: false,
        onClick: function (event, treeId, treeNode) {
            $("#TXTTREEORG_CODE").val(treeNode.id);
            option.url = 'RemoteHandlers/DutyRangeControl.ashx?type=all&CODE=' + escape(treeNode.id) + "&TREETYPE=" + escape(treeNode.treeType),
            option.newp = 1;
            $("#flexTable").flexOptions(option).flexReload();
        }
    });
}



//加载下拉列表
function loadSelect(Code) {
    $("#ddlOrgType").mySelect({
        tag: "Line",
        code: Code
    });
}


function validate() {

    if (!StringHelper.isInt($("#txt_start_km").val()) && $("#txt_start_km").val() != "") { ymPrompt.errorInfo('起始公里标必须为整数!', null, null, '提示信息', null); return false; } //起始公里标
    if (!StringHelper.isInt($("#txt_end_km").val()) && $("#txt_end_km").val() != "") { ymPrompt.errorInfo('终止公里标必须为整数!', null, null, '提示信息', null); return false; } //起始公里标
    return true;
}

function removeClass(val) {
    if (val.value.replace(/^ +| +$/g, '') == '') {
        $("#div" + val.id).addClass("control-group error");
    }
    if (val.value.replace(/^ +| +$/g, '') != '')
    { $("#div" + val.id).removeClass(); }
}