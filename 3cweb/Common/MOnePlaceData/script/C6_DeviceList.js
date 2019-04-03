var SubType;

$(function () {

    $('#_tree').height($(window).height() - 90);
    loadFlexiGrid(); //加载flexigrid数据
    loadTree(); //加载树
})


//获取树数据节点
function getzNodesafC6() {
    var url = "RemoteHandlers/C6_DeviceListControl.ashx?type=tree";
    var json;
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        cache: true,
        success: function (result) {
            json = eval('(' + result + ')');
        }
    });
    return json;
};
//加载树
function loadaftreeC6() {
    $.fn.zTree.init($("#treeDemo"), settingaf, getzNodesafC6());
};

var option; //表格内容

//加载设备列表
function loadFlexiGrid(treeName, LocCode, treeType) {
    option = {
        url: 'RemoteHandlers/C6_DeviceListControl.ashx?type=all&Name=&Tree_Path=',
        dataType: 'json',
        colModel: [
                            { display: '名称', name: 'NAME', width: 180, sortable: false, align: 'center' },
                            { display: '变电所', name: 'SubstationName', width: 80, sortable: false, align: 'center' },
                            { display: '安装位置', name: 'SBWZ', width: 80, sortable: false, align: 'center' },
			                { display: '层次', name: 'C6LEVEL', width: 70, sortable: false, hide: true, align: 'center' },
			                { display: '数据类型', name: 'DATA_TYPE', width: 70, sortable: false, hide: true, align: 'center' },
			                { display: '设备类型', name: 'DEVICE_TYPE', width: 80, sortable: false, align: 'center' },
			                { display: '监控区域分析串', name: 'AREA_ANA', width: 120, sortable: false, align: 'center' },
			                { display: '是否重点监控位置', name: 'IS_IMPORTANT', width: 80, sortable: false, align: 'center' },
			                { display: '监控周期(分钟)', name: 'DURATION', width: 60, sortable: false, align: 'center' },
			                { display: '创建时间', name: 'CREAT_TIME', width: 60, sortable: false, hide: true, align: 'center' },
			                { display: '修改时间', name: 'UPDATE_TIME', width: 70, sortable: false, hide: true, align: 'center' },
			                { display: '修改人', name: 'UPDATOR', width: 80, sortable: false, hide: true, align: 'center' },
                            { display: '区域温度报警阈值(℃)', name: 'THRESHOLD_MAXTEMP', width: 90, sortable: false, align: 'center' },
                            { display: '区环温差报警阈值(℃)', name: 'THRESHOLD_MAXTEMPDIFF', width: 90, sortable: false, align: 'center' },
                            { display: '供电段电话区号', name: 'DISTRICT_CODE', width: 100, sortable: false, hide: true, align: 'center' },
			                { display: '统计', name: 'MY_INT_1', width: 80, sortable: false, align: 'center' },
			                { display: 'code', name: 'code', width: 80, sortable: false, pk: true, hide: true, align: 'center' },
			                { display: 'id', name: 'id', width: 80, sortable: false, pk: true, hide: true, align: 'center' }
                            ],
        usepager: true,
        title: '设备列表',
        pagestat: '显示第 {from} 条到 {to} 条,共 {total} 条数据', // 显示当前页和总页面的样式
        procmsg: '正在处理,请稍候 ...', // 正在处理的提示信息
        nomsg: '没有数据存在!', // 无结果的提示信息
        pagetext: '当前第',
        outof: '页，总页数',
        findtext: '条件查询：',
        useRp: true,
        checkbox: false, // 是否要多选框
        height: $(window).height() - 230,
        showToggleBtn: true,
        onRowDblclick: rowDblclick, //双击事件
        rp: parseInt(($(window).height() - 220) / 25),
        title: false, //是否包含标题 
        resizable: false, //是否可伸缩 
        striped: true //是否显示斑纹效果，默认是奇偶交互的形式
    }
    $("#flexTable").flexigrid(option);
};
//双击修改
function rowDblclick(rowData) {
    var code = rowData.code; 
    var alarmId = getalarmId(code);
    if (alarmId == undefined) {
        alert('没有缺陷')
    }
    else {
        window.open("../../../C6/PC/MAlarmMonitoring/MonitorAlarmC6Form.htm?alarmid=" + alarmId + "&type='fault'&v=" + version, "_blank");
    }
};

function getalarmId(code) {
    var url = "RemoteHandlers/GetAlarmIdByCode.ashx?code=" + code;
    var json;
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        cache: false,
        success: function (result) {
            json =  result;
        }
    });
    return json;
};

//修改
function updateC6DeviclModal(rowData) {
    var NAME = $('div', rowData)[0].innerHTML;
    var DEVICE_TYPE = $('div', rowData)[4].innerHTML;
    var AREA_ANA = $('div', rowData)[5].innerHTML;
    var IS_IMPORTANT = $('div', rowData)[6].innerHTML;
    var DURATION = $('div', rowData)[7].innerHTML;
    var THRESHOLD_MAXTEMP = $('div', rowData)[11].innerHTML;
    var THRESHOLD_MAXTEMPDIFF = $('div', rowData)[12].innerHTML;
    var DISTRICT_CODE = $('div', rowData)[13].innerHTML;
    var code = $('div', rowData)[16].innerHTML;
    $('#txtName').val($('div', rowData)[0].innerHTML.replace("&nbsp;", ""));
    $('#txtDEVICE_TYPE').val($('div', rowData)[5].innerHTML.replace("&nbsp;", ""));
    $('#txtAREA_ANA').val($('div', rowData)[6].innerHTML.replace("&nbsp;", ""));
    LoadDropdSelected('txtIS_IMPORTANT', $('div', rowData)[7].innerHTML.replace("&nbsp;", ""));
    $('#txtDURATION').val($('div', rowData)[8].innerHTML.replace("&nbsp;", ""));
    $('#txtCode').val($('div', rowData)[16].innerHTML.replace("&nbsp;", ""));
    $('#txtqywd').val($('div', rowData)[12].innerHTML.replace("&nbsp;", ""));
    $('#txtquwc').val($('div', rowData)[13].innerHTML.replace("&nbsp;", ""));
    $('#txtdianhua').val($('div', rowData)[14].innerHTML.replace("&nbsp;", ""));

    document.getElementById('modal-22256').click();
};
//执行修改支柱操作
function Update() {
    var is = $("#txtIS_IMPORTANT").attr("value");
    var responseData = XmlHttpHelper.transmit(false, "get", "text", "RemoteHandlers/C6_DeviceListControl.ashx?type=Update&Name=" + escape($('#txtName').val()) + "&DISTRICT_CODE=" + escape($('#txtdianhua').val()) + "&THRESHOLD_MAXTEMPDIFF=" + escape($('#txtquwc').val()) + "$THRESHOLD_MAXTEMP=" + escape($('#txtqywd').val()) + "&DEVICE_TYPE=" + escape($('#txtDEVICE_TYPE').val()) + "&AREA_ANA=" + escape($('#txtAREA_ANA').val()) + "&IS_IMPORTANT=" + escape($("#txtIS_IMPORTANT").attr("value")) + "&DURATION=" + escape($('#txtDURATION').val()) + "&Code=" + escape($('#txtCode').val()) + '&temp=' + Math.random(), null, null);
    
    if (responseData == "True") {
        $("#flexTable").flexigrid(option);
        $("#flexTable").flexOptions(option).flexReload();
        RefushTree();
        ymPrompt.succeedInfo('修改成功', null, null, '提示信息', null);
    } else {
        ymPrompt.errorInfo('修改失败', null, null, '提示信息', null);
    }
    document.getElementById('close').click();

};
//删除设备信息
function deleteC6Devicl(rowData) {

    var code = $('div', rowData)[11].innerHTML;
    if (confirm('确认要删除这条记录吗?')) {
        responseData = XmlHttpHelper.transmit(false, "get", "text", "RemoteHandlers/C6_DeviceListControl.ashx?type=Delete&Code=" + escape($('div', rowData)[16].innerHTML) + '&temp=' + Math.random(), null, null);
        if (responseData == true || responseData == "True" || responseData == "true") {
            $("#flexTable").flexigrid(option);
            $("#flexTable").flexOptions(option).flexReload();
            RefushTree();
            ymPrompt.succeedInfo('删除成功', null, null, '提示信息', null);
        } else {
            ymPrompt.errorInfo('删除失败', null, null, '提示信息', null);
        }
    }
};
//查询方法
function doQuery() {
    var Tree_Path = $("#Tree_Path").val();
    var name = $("#Name").val();
    option.url = 'RemoteHandlers/C6_DeviceListControl.ashx?type=all&Name=' + escape(name) + "&Tree_Path=" + escape(Tree_Path) + '&temp=' + Math.random();
    option.newp = 1;
    $("#flexTable").flexigrid(option);
    $("#flexTable").flexOptions(option).flexReload();

};

var setting = {
    data: {
        simpleData: {
            enable: true
        }
    }
};

//绑定树
function getzNodes() {
    var url = "RemoteHandlers/C6_DeviceListControl.ashx?type=tree";
    var json;
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        cache: true,
        success: function (result) {
            json = eval('(' + result + ')');
        }
    });
    return json;
};
///重新加载树
function RefushTree() {
    zNodes = getzNodes();
    $.fn.zTree.init($("#tree"), setting, zNodes);
    var treeObj = $.fn.zTree.getZTreeObj("tree");
    treeObj.expandAll(true);
};

var zNodes = getzNodes();
//加载树
function loadTree() {
    $.fn.zTree.init($("#tree"), setting, zNodes);
    var treeObj = $.fn.zTree.getZTreeObj("tree");
    treeObj.expandAll(true);
};
//单击树
function TreeClick(id, name, type) {
    SubType = type;
    document.getElementById("Tree_Path").value = id;
    var araay = name.split("@@");

    document.getElementById("txtaddWZ").value = araay[0];
    document.getElementById("txtaddPCode").value = araay[1];
    document.getElementById("txtaddTreeCode").value = araay[2];
    doQuery();
    if (type == "WZ") {
        loadAddSBSelect("SUB");
        document.getElementById("selectaddREPORT_CODE").style.display = "";
        document.getElementById("selectaddREPORT_CODE").style.display = "";
        document.getElementById("txtaddREPORT_CODE").style.display = "none";
        document.getElementById("txtaddNAME").style.display = "none";
        document.getElementById("SBBM").style.display = "none";
    } else {
        document.getElementById("selectaddREPORT_CODE").style.display = "none";
        document.getElementById("txtaddREPORT_CODE").style.display = "";
        document.getElementById("txtaddNAME").style.display = "";
        document.getElementById("SBBM").style.display = "";
    }
};
//弹出添加层
function addC6DeviceModal() {
    document.getElementById('modal-22257').click();
};
//添加方法
function Add() {
    var pCode = $('#txtaddPCode').val();
    var treeCode = $('#txtaddTreeCode').val();
    var REPORT_CODE = $('#txtaddREPORT_CODE').val();
    var NAME = $('#txtaddNAME').val();

    if (SubType == "WZ") {
        REPORT_CODE = $("#selectaddREPORT_CODE").attr("value");
        var dropd = document.getElementById("selectaddREPORT_CODE");
        for (var i = 0; i < dropd.length; i++) {
            if (dropd[i].selected == true) {
                NAME = dropd[i].text;
            }
        }
    }
    if (REPORT_CODE == "") {
        ymPrompt.succeedInfo('请选择变电所', null, null, '提示信息', null);
        return false;
     }
    var DATA_TYPE = $('#txtaddDATA_TYPE').val();
    var DEVICE_TYPE = $('#txtaddDEVICE_TYPE').val();
    var AREA_ANA = $('#txtaddAREA_ANA').val();
    var IS_IMPORTANT = $("#txtaddIS_IMPORTANT").attr("value");
    var DURATION = $('#txtaddDURATION').val();
    var DISTRICT_CODE = $('#txtaddDISTRICT_CODE').val();
    var THRESHOLD_MAXTEMP = $('#txtaddTHRESHOLD_MAXTEMP').val();
    var THRESHOLD_MAXTEMPDIFF = $('#txtaddTHRESHOLD_MAXTEMPDIFF').val();
    var responseData = XmlHttpHelper.transmit(false, "get", "text", "RemoteHandlers/C6_DeviceListControl.ashx?type=Add&pCode=" + escape(pCode)
     + "&treeCode=" + escape(treeCode)
     + "&REPORT_CODE=" + escape(REPORT_CODE)
     + "&NAME=" + escape(NAME)
      + "&DATA_TYPE=" + escape(DATA_TYPE)
      + "&DEVICE_TYPE=" + escape(DEVICE_TYPE)
      + "&AREA_ANA=" + escape(AREA_ANA)
      + "&IS_IMPORTANT=" + escape(IS_IMPORTANT)
      + "&DURATION=" + escape(DURATION)
      + "&DISTRICT_CODE=" + escape(DISTRICT_CODE)
      + "&THRESHOLD_MAXTEMP=" + escape(THRESHOLD_MAXTEMP)
      + "&THRESHOLD_MAXTEMPDIFF=" + escape(THRESHOLD_MAXTEMPDIFF)
      + "&SubType=" + escape(SubType)
      + '&temp=' + Math.random(), null, null);
   
    if (responseData == "True") {
        $("#flexTable").flexigrid(option);
        $("#flexTable").flexOptions(option).flexReload();
        RefushTree();
        ymPrompt.succeedInfo('添加成功', null, null, '提示信息', null);
    } else {
        ymPrompt.errorInfo('添加失败', null, null, '提示信息', null);
    }
    document.getElementById('close1').click();
};
//更新下拉列表
function loadUpdateXSelect(type) {
    var html = responseData = XmlHttpHelper.transmit(false, "get", "text", "../MAlarmMonitoring/RemoteHandlers/GetSysDic.ashx?str=" + type, null, null); ;

    document.getElementById("txtDEVICE_TYPE").innerHTML = html;
};
//添加时下拉列表
function loadAddXSelect(type) {
    var html = responseData = XmlHttpHelper.transmit(false, "get", "text", "../MAlarmMonitoring/RemoteHandlers/GetSysDic.ashx?str=" + type, null, null); ;

    document.getElementById("txtaddDEVICE_TYPE").innerHTML = html;
};
function loadAddLXSelect(type) {
    var html = responseData = XmlHttpHelper.transmit(false, "get", "text", "../MAlarmMonitoring/RemoteHandlers/GetSysDic.ashx?str=" + type, null, null); ;

    document.getElementById("txtaddDATA_TYPE").innerHTML = html;
};
//添加设备下拉列表
function loadAddSBSelect(type) {
    var html = responseData = XmlHttpHelper.transmit(false, "get", "text", "../MAlarmMonitoring/RemoteHandlers/GetSysDic.ashx?str=" + type + '&temp=' + Math.random(), null, null); ;

    document.getElementById("selectaddREPORT_CODE").innerHTML = html;
};
