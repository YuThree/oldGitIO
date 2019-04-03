var option; //存放表格内容
//树样式信息
var setting = {
    data: {
        simpleData: {
            enable: true
        }
    }
};
//获取树数据节点
function getzNodes() {
    var url = "/Common/MFoundation/RemoteHandlers/LocomotiveControl.ashx?type=tree";
    var json;
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        cache: true,
        success: function (result) {
            if (result !== '') {
                json = eval('(' + result + ')');
            } else {
                json = '';
            }
        }
    });
    return json;
};

var zNodes = getzNodes();
//加载树
function loadTree() {
    $.fn.zTree.init($("#treeLoco"), setting, zNodes);
    var treeObj = $.fn.zTree.getZTreeObj("treeLoco");
    treeObj.expandAll(true);
};
//根据编码获得级别
//function GetjbByID(str) {
//    if (str == "1l") { return "一类"; }
//    else if (str == "2l") { return "二类"; }
//    else if (str == "3l") { return "三类"; }
//    else { return "0"; }
//};
//绑定表格
function loadFlexiGrid(str) {

    var obj = document.getElementById('ddlzt');
    var ju = document.getElementById('juselect').value; //局
    var jwd = document.getElementById('duanselect').value; //段; //机务段
    var jlh = document.getElementById('jlh').value; //交路
    var loccode = document.getElementById('txtloccode').value; //设备编码
    var startdate = document.getElementById('startdate').value; //时间
    var enddate = document.getElementById('enddate').value; //结束日期
    var ddlzt = getSelectedItem(obj); // document.getElementById('dll_zt').value; //状态
    var startkm = document.getElementById('startkm').value; //开始
    var endkm = document.getElementById('endkm').value; //结束公里标
    var jb = document.getElementById('jb').value; //结束公里标
   // var qxType = document.getElementById('dll_zt');
    var afcode;
    var line = document.getElementById('lineselect').value; //线路
    var urlstr;

    var _h = $(window).height() - 242 - 30;
    var _PageNum = parseInt(($(window).height() - 242) / 25);

    if (str == "1") {
        var sore = document.getElementById('sore').value;
       // afcode = getSelectedItem(qxType);
        urlstr = 'RemoteHandlers/GetMonitorLocoAlarmListFX.ashx?ju=' + escape(ju)
                                                    + '&jwd=' + escape(jwd)
                                                    + '&jb=' + escape(jb)
                                                    + '&sore=' + escape(sore)
                                                    + '&jlh=' + escape(jlh)
                                                    + '&locid=' + loccode
                                                    + '&startdate=' + startdate
                                                    + '&enddate=' + enddate
                                                    + '&ddlzt=' + ddlzt
                                                    + '&startkm=' + startkm
                                                    + '&endkm=' + endkm
                                                    + '&afcode=' + ''
                                                    + '&line=' + line
                                                    + '&temp=' + Math.random();
    }
    else {
        //afcode = getSelectedItem(qxType.childNodes[0]);
        urlstr = 'RemoteHandlers/GetMonitorLocoAlarmListFX.ashx?ju=' + escape(ju)
                                                    + '&jwd=' + escape(jwd)
                                                    + '&jb=' + escape(jb)
                                                    + '&jlh=' + escape(jlh)
                                                    + '&locid=' + loccode
                                                    + '&startdate=' + startdate
                                                    + '&enddate=' + enddate
                                                    + '&ddlzt=' + ddlzt
                                                    + '&startkm=' + startkm
                                                    + '&endkm=' + endkm
                                                    + '&afcode=' + ''
                                                    + '&line=' + line
                                                    + '&temp=' + Math.random();
    }

    if (marcar == '1') {
        option = {
            url: urlstr,
            dataType: 'json',
            colModel: [
                            { display: 'GISX', name: 'GISX', width: 80, sortable: false, align: 'center', hide: true },
                            { display: 'GISY', name: 'GISY', width: 80, sortable: false, align: 'center', hide: true },
                            { display: '设备编号', name: 'LOCOMOTIVE_CODE', width: 80, sortable: false, align: 'center' },
                            { display: '发生时间', name: 'NOWDATE', width: 140, sortable: false, align: 'center' },
                            { display: '位置信息', name: 'WZ', width: 220, sortable: false, align: 'left' },
                            { display: '弓位置', name: 'GWZ', width: 60, sortable: false, align: 'center', hide: true },
                            { display: '速度', name: 'SD', width: 80, sortable: false, align: 'center', hide: true },
                            { display: '收到FaultI文件时间', name: 'DVALUE1', width: 60, sortable: false, align: 'center' },
                            { display: '收到红外视频时间', name: 'DVALUE2', width: 60, sortable: false, align: 'center' },
                            { display: '收到可见光视频时间', name: 'DVALUE3', width: 60, sortable: false, align: 'center' },
                            { display: '收到全景I视频时间', name: 'DVALUE4', width: 60, sortable: false, align: 'center' },
                            { display: '收到全景II视频时间', name: 'DVALUE5', width: 60, sortable: false, align: 'center' },
                            { display: '分析时间', name: 'STATUS_TIME', width: 60, sortable: false, align: 'center' },
                            { display: '分析状态', name: 'CHULIZT', width: 60, sortable: false, align: 'center' },
                            { display: '最高温度℃', name: 'WD', width: 60, sortable: false, align: 'center' },
                            { display: '环境温度℃', name: 'HJWD', width: 60, sortable: false, align: 'center' },
                            { display: '导高值mm', name: 'DGZ', width: 70, sortable: false, align: 'center' },
                            { display: '拉出值mm', name: 'LCZ', width: 70, sortable: false, align: 'center' },
                            { display: '报警级别', name: 'JB', width: 50, sortable: false, align: 'center' },
                            { display: '报警状态', name: 'ZT', width: 50, sortable: false, align: 'center' },
                            { display: '报警类型', name: 'QXZT', width: 120, sortable: false, align: 'left' },
                            { display: '报警分析', name: 'CZ', width: 80, sortable: false, align: 'center' },
                            { display: '下载', name: 'XZ', width: 80, sortable: false, hide: true, align: 'center' },
                            { display: 'ID', name: 'ID', width: 80, sortable: false, pk: true, hide: true, align: 'center' }
                            ],
            width: 'auto',
            rowId: 'ID',
            height: _h,
            onRowDblclick: rowDblclick, //双击事件
            rp: _PageNum
        }
    } else {
        option = {
            url: urlstr,
            dataType: 'json',
            colModel: [
                            { display: 'GISX', name: 'GISX', width: 80, sortable: false, align: 'center', hide: true },
                            { display: 'GISY', name: 'GISY', width: 80, sortable: false, align: 'center', hide: true },
                            { display: '设备编号', name: 'LOCOMOTIVE_CODE', width: 80, sortable: false, align: 'center' },
                            { display: '发生时间', name: 'NOWDATE', width: 140, sortable: false, align: 'center' },
                            { display: '位置信息', name: 'WZ', width: 460, sortable: false, align: 'left' },
                            { display: '弓位置', name: 'GWZ', width: 60, sortable: false, align: 'center', hide: true },
                            { display: '速度', name: 'SD', width: 80, sortable: false, align: 'center', hide: true },
                            { display: '最高温度℃', name: 'WD', width: 60, sortable: false, align: 'center' },
                            { display: '环境温度℃', name: 'HJWD', width: 60, sortable: false, align: 'center' },
                            { display: '导高值mm', name: 'DGZ', width: 70, sortable: false, align: 'center' },
                            { display: '拉出值mm', name: 'LCZ', width: 70, sortable: false, align: 'center' },
                            { display: '报警级别', name: 'JB', width: 50, sortable: false, align: 'center' },
                            { display: '报警状态', name: 'ZT', width: 50, sortable: false, align: 'center' },
                            { display: '报警类型', name: 'QXZT', width: 120, sortable: false, align: 'left' },
                            { display: '报警分析', name: 'CZ', width: 80, sortable: false, align: 'center' },
                            { display: '下载', name: 'XZ', width: 80, sortable: false, hide: true, align: 'center' },
                            { display: 'ID', name: 'ID', width: 80, sortable: false, pk: true, hide: true, align: 'center' }
                            ],
            width: 'auto',
            rowId: 'ID',
            height: _h,
            onRowDblclick: rowDblclick, //双击事件
            rp: _PageNum
        }
    };
    $("#flexTable").flexigrid(option);
};
//弹出详细
function selectInfo(rowData) {
    var id = rowData.id.substr(1);  //rowData.属性名,源码中放进json的名;去掉前面的'C'
    var responseData = XmlHttpHelper.transmit(false, "get", "text", "RemoteHandlers/locPs3orPs4.ashx?alarmid=" + id + "", null, null);
    if (responseData != null && responseData != "") {
        if (responseData == "PS3") {
            window.open("MonitorAlarm3CForm4PS3.htm?alarmid=" + id + "&v=" + version, "_blank");
        } else {
            window.open("MonitorAlarm3CForm4.htm?alarmid=" + id + "&v=" + version, "_blank");
        }
    }
};
//修改页面
function UpdateInfo(rowData) {
    var id = rowData.id.substr(1);  //rowData.属性名,源码中放进json的名;去掉前面的'C'
    ShowWinOpen("MonitorAlarmC3FormUpdate.aspx?alarmid=" + id);
};
//双击
function rowDblclick(rowData) {
    var id = rowData.ID.substr(1);  //rowData.属性名,源码中放进json的名;去掉前面的'C'
    window.open("MonitorAlarm3CForm4.htm?alarmid=" + id + "&v=" + version, "_blank");
};
function TreeClick(name, id, type) {
    if (type == "BUREAU") {
        document.getElementById('juselect').value = id;
        loadOrgSelect(id, 'duan', null, 'ddlduan', null);
        document.getElementById('txtloccode').value = "";
    } else if (type == "ORG") {
        document.getElementById('juselect').value = "0";
        loadOrgSelect(id.substr(0, 11), 'duan', null, 'ddlduan', null);
        document.getElementById('duanselect').value = id;
        document.getElementById('txtloccode').value = "";
    } else {
        document.getElementById('duanselect').value = "0";
        document.getElementById('juselect').value = "0";
        document.getElementById('txtloccode').value = id;
    }
    doQuery();
};


function selectCookieGet() {
    if (GetQueryString("Portal") != undefined && GetQueryString("Portal") == "true") {
        var jb;
        if (GetQueryString("ser") == "一类") { jb = "1l"; } else if (GetQueryString("ser") == "二类") { jb = "2l"; } else if (GetQueryString("ser") == "三类") { jb = "3l"; } else { jb = "0"; }
        document.getElementById('jb').value = jb;
        document.getElementById('ddlzt').options[0].selected = true;
        document.getElementById('ddlzt').options[1].selected = true;
        document.getElementById('ddlzt').options[2].selected = true;
        document.getElementById('ddlzt').options[4].selected = true;
        document.getElementById('startdate').value = dateLastMonthStr();
        document.getElementById('enddate').value = dateNowStr();
        document.getElementById('lineselect').value = GetLineCodeByName(GetQueryString("linename"));

    } else {
        if (getCookieValue("ju") != undefined && getCookieValue("ju") != "") {
            //获取Cookie内的值 付给查询控件
            var stdate = getCookieValue("startdate");
            stdate = stdate.replace("%20", " ").replace("%3A", ":").replace("%3A", ":");
            stdate = stdate.substring(0, 19);
            var endate = getCookieValue("enddate");
            endate = endate.replace("%20", " ").replace("%3A", ":").replace("%3A", ":");
            endate = endate.substring(0, 19);
            document.getElementById('juselect').value = getCookieValue("ju");
            loadOrgSelect(getCookieValue("ju"), 'duan', null, 'ddlduan', null);
            document.getElementById('duanselect').value = getCookieValue("jwd");
            document.getElementById('jlh').value = getCookieValue("jlh");
            document.getElementById('txtloccode').value = getCookieValue("loccode");
            document.getElementById('startdate').value = stdate;
            document.getElementById('enddate').value = endate;
            document.getElementById('startkm').value = getCookieValue("startkm");
            document.getElementById('endkm').value = getCookieValue("endkm");
          //  document.getElementById('dll_zt').value = getCookieValue("dll_zt");
            document.getElementById('lineselect').value = getCookieValue("line");
            document.getElementById('jb').value = getCookieValue("jb");
            setSelectdItem(getCookieValue("ddlzt").replace("%2C", ","), document.getElementById('ddlzt'));
         //   setSelectdItem(getCookieValue("dll_zt").replace("%2C", ","), document.getElementById('dll_zt').childNodes[0]);
            //结束
        }
        else if (getCookieValue("startdate") != undefined && getCookieValue("startdate") != "") {
            var stdate = getCookieValue("startdate");
            stdate = stdate.replace("%20", " ").replace("%3A", ":").replace("%3A", ":");
            stdate = stdate.substring(0, 19);
            document.getElementById('startdate').value = stdate;
        }
        else {
            document.getElementById('jb').value = "1l";
            document.getElementById('ddlzt').options[0].selected = true;
            document.getElementById('ddlzt').options[1].selected = true;
            document.getElementById('ddlzt').options[2].selected = true;
            document.getElementById('ddlzt').options[4].selected = true;
        }
    }
};
//执行查询
function doQuery() {
    var obj = document.getElementById('ddlzt');
    var ju = document.getElementById('juselect').value; //局
    var jwd = document.getElementById('duanselect').value; //段; //机务段
    var jlh = document.getElementById('jlh').value; //交路
    var loccode = document.getElementById('txtloccode').value; //设备编码
    var startdate = document.getElementById('startdate').value; //时间
    var enddate = document.getElementById('enddate').value; //结束日期
    var ddlzt = getSelectedItem(obj); // document.getElementById('dll_zt').value; //状态
    var startkm = document.getElementById('startkm').value; //开始
    var endkm = document.getElementById('endkm').value; //结束公里标
    var jb = document.getElementById('jb').value; //结束公里标
  //  var qxType = document.getElementById('dll_zt');
  //  var afcode = getSelectedItem(qxType.childNodes[0]);
    var line = document.getElementById('lineselect').value; //线路
    var zhuangtai = document.getElementById('citySel').value;

    var fxJG = document.getElementById('fxJG').value; //局
    //查询条件存入Cookie 7天 过期
    addCookie("ju", ju, 7, "/");
    addCookie("jwd", jwd, 7, "/");
    addCookie("jlh", jlh, 7, "/");
    addCookie("loccode", loccode, 7, "/");
    addCookie("startdate", startdate, 7, "/");
    addCookie("enddate", enddate, 7, "/");
    addCookie("ddlzt", ddlzt, 7, "/");
   // addCookie("dll_zt", afcode, 7, "/");
    addCookie("startkm", startkm, 7, "/");
    addCookie("endkm", endkm, 7, "/");
    addCookie("jb", escape(jb), 7, "/");
    addCookie("line", line, 7, "/");
    //结束
    option.url = 'RemoteHandlers/GetMonitorLocoAlarmListFX.ashx?ju=' + escape(ju)
                                                    + '&jwd=' + escape(jwd)
                                                    + '&jb=' + escape(document.getElementById('jb').value)
                                                    + '&jlh=' + escape(jlh)
                                                    + '&locid=' + loccode
                                                    + '&startdate=' + startdate
                                                    + '&enddate=' + enddate
                                                    + '&ddlzt=' + ddlzt
                                                    + '&startkm=' + startkm
                                                    + '&endkm=' + endkm
                                                    + '&afcode=' + ''
                                                    + '&line=' + line
                                                    + '&zhuangtai=' + escape(zhuangtai)
                                                    + '&fxJG=' + escape(fxJG)
                                                    + '&temp=' + Math.random();
    option.newp = 1;

    var selectrp = $('select[name="rp"]').val();
    if (selectrp != undefined) {
        option.rp = parseInt(selectrp);
    }

    $("#flexTable").flexigrid(option);
    $("#flexTable").flexOptions(option).flexReload();
};
function doQueryTime() {
    var obj = "";
    var ju = "0"; //局
    var jwd = "0"; //段; //机务段
    var jlh = ""; //交路
    var loccode = ""; //设备编码
    var startdate = GetQueryString("AlarmTime"); //时间
    var enddate = CdatehhssNowStr(); //结束日期
    var ddlzt = "AFSTATUS01"; // document.getElementById('dll_zt').value; //状态
    var startkm = ""; //开始
    var endkm = ""; //结束公里标
    var jb = ""; //结束公里标
    var qxType = "";
    var afcode='';
    var line = "0"; //线路
    var urlstr;
    var str = "";
    if (str == "1") {
        var sore = document.getElementById('sore').value;
       // afcode = getSelectedItem(qxType);
        urlstr = 'RemoteHandlers/GetMonitorLocoAlarmListFX.ashx?ju=' + escape(ju)
                                                    + '&jwd=' + escape(jwd)
                                                    + '&jb=' + escape(jb)
                                                    + '&sore=' + escape(sore)
                                                    + '&jlh=' + escape(jlh)
                                                    + '&locid=' + loccode
                                                    + '&startdate=' + startdate
                                                    + '&enddate=' + enddate
                                                    + '&ddlzt=' + ddlzt
                                                    + '&startkm=' + startkm
                                                    + '&endkm=' + endkm
                                                    + '&afcode=' + afcode
                                                    + '&line=' + line
                                                    + '&temp=' + Math.random();
    }
    else {
        afcode = "0"; // getSelectedItem(qxType.childNodes[0]);
        urlstr = 'RemoteHandlers/GetMonitorLocoAlarmListFX.ashx?ju=' + escape(ju)
                                                    + '&jwd=' + escape(jwd)
                                                    + '&jb=' + escape(jb)
                                                    + '&jlh=' + escape(jlh)
                                                    + '&locid=' + loccode
                                                    + '&startdate=' + startdate
                                                    + '&enddate=' + enddate
                                                    + '&ddlzt=' + ddlzt
                                                    + '&startkm=' + startkm
                                                    + '&endkm=' + endkm
                                                    + '&afcode=' + afcode
                                                    + '&line=' + line
                                                    + '&temp=' + Math.random();
    }
    if (marcar == '1') {
        option = {
            url: urlstr,
            dataType: 'json',
            colModel: [
                            { display: 'GISX', name: 'GISX', width: 80, sortable: false, align: 'center', hide: true },
                            { display: 'GISY', name: 'GISY', width: 80, sortable: false, align: 'center', hide: true },
                            { display: '设备编号', name: 'LOCOMOTIVE_CODE', width: 80, sortable: false, align: 'center' },
                            { display: '发生时间', name: 'NOWDATE', width: 140, sortable: false, align: 'center' },
            //                            { display: '线路', name: 'XL', width: 80, sortable: false, align: 'center' },
            //                            { display: '站点', name: 'STATION', width: 80, sortable: false, align: 'center' },
                            {display: '位置信息', name: 'WZ', width: 240, sortable: false, align: 'left' },
			                { display: '公里标', name: 'KM', width: 80, sortable: false, align: 'center' },
                            { display: '地理位置', name: 'GIS', width: 150, sortable: false, align: 'center' },
                            { display: '弓位置', name: 'GWZ', width: 80, sortable: false, align: 'center', hide: true },
                            { display: '速度km/h', name: 'SD', width: 80, sortable: false, align: 'center', hide: true },
                            { display: '最高温度℃', name: 'WD', width: 60, sortable: false, align: 'center' },
                            { display: '环境温度℃', name: 'HJWD', width: 60, sortable: false, align: 'center' },
                            { display: '导高值mm', name: 'DGZ', width: 70, sortable: false, align: 'center' },
                            { display: '拉出值mm', name: 'LCZ', width: 70, sortable: false, align: 'center' },
                            { display: '报警级别', name: 'JB', width: 50, sortable: false, align: 'center' },
                            { display: '报警状态', name: 'ZT', width: 50, sortable: false, align: 'center' },
                            { display: '报警类型', name: 'QXZT', width: 150, sortable: false, align: 'center' },
                            { display: '报警分析', name: 'CZ', width: 80, sortable: false, align: 'center' },
                            { display: '下载', name: 'XZ', width: 80, sortable: false, hide: true, align: 'center' },
                            { display: 'ID', name: 'ID', width: 80, sortable: false, pk: true, hide: true, align: 'center' }
                            ],
            width: 'auto',
            rowId: 'ID',
            height: flexTableh - 20,
            onRowDblclick: rowDblclick, //双击事件
            rp: PageNum
        }
    } else {
        option = {
            url: urlstr,
            dataType: 'json',
            colModel: [
                            { display: 'GISX', name: 'GISX', width: 80, sortable: false, align: 'center', hide: true },
                            { display: 'GISY', name: 'GISY', width: 80, sortable: false, align: 'center', hide: true },
                            { display: '设备编号', name: 'LOCOMOTIVE_CODE', width: 80, sortable: false, align: 'center' },
                            { display: '发生时间', name: 'NOWDATE', width: 140, sortable: false, align: 'center' },
            //{ display: '交路', name: 'JL', width: 40, sortable: false, align: 'center' },
            //{ display: '运用区段', name: 'QD', width: 250, sortable: false, align: 'center' },
            //{ display: '线路', name: 'XL', width: 80, sortable: false, align: 'center' },
            //{ display: '站点', name: 'STATION', width: 80, sortable: false, align: 'center' },
                            {display: '位置信息', name: 'WZ', width: 240, sortable: false, align: 'left' },
			                { display: '公里标', name: 'KM', width: 80, sortable: false, align: 'center' },
                            { display: '地理位置', name: 'GIS', width: 150, sortable: false, align: 'center' },
                            { display: '弓位置', name: 'GWZ', width: 80, sortable: false, align: 'center', hide: true },
                            { display: '速度km/h', name: 'SD', width: 80, sortable: false, align: 'center', hide: true },
                            { display: '最高温度℃', name: 'WD', width: 60, sortable: false, align: 'center' },
                            { display: '环境温度℃', name: 'HJWD', width: 60, sortable: false, align: 'center' },
                            { display: '导高值mm', name: 'DGZ', width: 70, sortable: false, align: 'center' },
                            { display: '拉出值mm', name: 'LCZ', width: 70, sortable: false, align: 'center' },
                            { display: '报警级别', name: 'JB', width: 50, sortable: false, align: 'center' },
                            { display: '报警状态', name: 'ZT', width: 50, sortable: false, align: 'center' },
                            { display: '报警类型', name: 'QXZT', width: 150, sortable: false, align: 'center' },
                            { display: '报警分析', name: 'CZ', width: 80, sortable: false, align: 'center' },
                            { display: '下载', name: 'XZ', width: 80, sortable: false, hide: true, align: 'center' },
                            { display: 'ID', name: 'ID', width: 80, sortable: false, pk: true, hide: true, align: 'center' }
                            ],
            width: 'auto',
            rowId: 'ID',
            height: flexTableh - 20,
            onRowDblclick: rowDblclick, //双击事件
            rp: PageNum
        }
    };
    $("#flexTable").flexigrid(option);
};
//选择ju事件
function juChange(pcode) {
    loadOrgSelect(pcode, 'duan', null, 'ddlduan', null);
};
//选择DUAN事件
function duanChange(pcode) {

};
//视频下载
function IRVXZ(rowData) {
    var newid = rowData.id.substr(1);
    var responseData = XmlHttpHelper.transmit(false, "get", "text", "RemoteHandlers/GetIRVUrlByAlarmID.ashx?alarmid=" + newid + "&tmpe=" + Math.random(), null, null);
    if (responseData != null && responseData != "") {
        showImg(responseData);
    }
};

//获取选中项
function getSelectedItem(obj) {
    var slct = "";
    for (var i = 0; i < obj.options.length; i++)
        if (obj.options[i].selected == true) {
            slct += obj.options[i].value;
        }
    return slct;
};
//设置选中项
function setSelectdItem(objstr, selectobj) {
    for (var i = 0; i < selectobj.options.length; i++)
        if (objstr.indexOf(selectobj.options[i].value) >= 0) {
            selectobj.options[i].selected = true
        }
};
//导入Excel
function insertToLocAlarm() {
    show1Img('ExcelInsetToLocAlarm.aspx');
};


function selectCookieGetNew() {

    if (getCookieValue("ju") != undefined && getCookieValue("ju") != "") {

        //获取Cookie内的值 付给查询控件
        var stdate = getCookieValue("startdate");
        stdate = stdate.replace("%20", " ").replace("%3A", ":").replace("%3A", ":");
        stdate = stdate.substring(0, 19);
        var endate = getCookieValue("enddate");
        endate = endate.replace("%20", " ").replace("%3A", ":").replace("%3A", ":");
        endate = endate.substring(0, 19);
        document.getElementById('juselect').value = getCookieValue("ju");
        loadOrgSelect(getCookieValue("ju"), 'duan', null, 'ddlduan', null);
        document.getElementById('duanselect').value = getCookieValue("jwd");
        document.getElementById('jlh').value = getCookieValue("jlh");
        document.getElementById('txtloccode').value = getCookieValue("loccode");
        document.getElementById('startdate').value = stdate;
        document.getElementById('enddate').value = endate;
        document.getElementById('startkm').value = getCookieValue("startkm");
        document.getElementById('endkm').value = getCookieValue("endkm");
      //  document.getElementById('dll_zt').value = getCookieValue("afcode");
        document.getElementById('lineselect').value = getCookieValue("line");
        document.getElementById('sore').value = getCookieValue("sore");
        document.getElementById('jb').value = getCookieValue("jb");
        setSelectdItem(getCookieValue("ddlzt").replace("%2C", ","), document.getElementById('ddlzt'));
        //结束
    }
    else {
        document.getElementById('jb').value = "1l";
        document.getElementById('ddlzt').options[0].selected = true;
        document.getElementById('ddlzt').options[1].selected = true;
        document.getElementById('ddlzt').options[2].selected = true;
        document.getElementById('ddlzt').options[4].selected = true;
    }
};
//执行查询
function doQueryNew() {
    var obj = document.getElementById('ddlzt');
    var ju = document.getElementById('juselect').value; //局
    var jwd = document.getElementById('duanselect').value; //段; //机务段
    var jlh = document.getElementById('jlh').value; //交路
    var loccode = document.getElementById('txtloccode').value; //设备编码
    var startdate = document.getElementById('startdate').value; //时间
    var enddate = document.getElementById('enddate').value; //结束日期
    var ddlzt = getSelectedItem(obj); // document.getElementById('dll_zt').value; //状态
    var startkm = document.getElementById('startkm').value; //开始
    var endkm = document.getElementById('endkm').value; //结束公里标
    var jb = document.getElementById('jb').value; //结束公里标
    var sore = document.getElementById('sore').value;
  //  var qxType = document.getElementById('dll_zt');
 //   var afcode = getSelectedItem(qxType.childNodes[0]);
    var line = document.getElementById('lineselect').value; //线路

    //查询条件存入Cookie 7天 过期
    addCookie("ju", ju, 7, "/");
    addCookie("jwd", jwd, 7, "/");
    addCookie("jlh", jlh, 7, "/");
    addCookie("sore", sore, 7, "/");
    addCookie("loccode", loccode, 7, "/");
    addCookie("startdate", startdate, 7, "/");
    addCookie("enddate", enddate, 7, "/");
    addCookie("ddlzt", ddlzt, 7, "/");
    addCookie("startkm", startkm, 7, "/");
    addCookie("endkm", endkm, 7, "/");
    addCookie("jb", escape(jb), 7, "/");
    addCookie("afcode", '', 7, "/");
    addCookie("line", line, 7, "/");
    //结束

    option.url = 'RemoteHandlers/GetMonitorLocoAlarmListFX.ashx?ju=' + escape(ju)
                                                    + '&jwd=' + escape(jwd)
                                                    + '&jb=' + escape(document.getElementById('jb').value)
                                                    + '&sore=' + escape(sore)
                                                    + '&jlh=' + escape(jlh)
                                                    + '&locid=' + loccode
                                                    + '&startdate=' + startdate
                                                    + '&enddate=' + enddate
                                                    + '&ddlzt=' + ddlzt
                                                    + '&startkm=' + startkm
                                                    + '&endkm=' + endkm
                                                    + '&afcode=' + ''
                                                    + '&line=' + line
                                                    + '&temp=' + Math.random();
    option.newp = 1;
    $("#flexTable").flexigrid(option);
    $("#flexTable").flexOptions(option).flexReload();
};

function doinsertNew() {
    ShowWinOpen("MonitorAlarmC3FormUpdate.aspx");
};
function importToExcel() {
    var obj = document.getElementById('ddlzt');
    var ju = document.getElementById('juselect').value; //局
    var jwd = document.getElementById('duanselect').value; //段; //机务段
    var jlh = document.getElementById('jlh').value; //交路
    var loccode = document.getElementById('txtloccode').value; //设备编码
    var startdate = document.getElementById('startdate').value; //时间
    var enddate = document.getElementById('enddate').value; //结束日期
    var ddlzt = getSelectedItem(obj); // document.getElementById('dll_zt').value; //状态
    var startkm = document.getElementById('startkm').value; //开始
    var endkm = document.getElementById('endkm').value; //结束公里标
    var jb = document.getElementById('jb').value;
    //var sore = document.getElementById('sore').value;
   // var qxType = document.getElementById('dll_zt');
  //  var afcode = getSelectedItem(qxType.childNodes[0]);
    var line = document.getElementById('lineselect').value; //线路
    var url = '/Report/ExcelReport.aspx?ju=' + escape(ju)
                                                    + '&jwd=' + escape(jwd)
                                                    + '&jb=' + escape(document.getElementById('jb').value)
                                                    + '&sore=0'
                                                    + '&jlh=' + escape(jlh)
                                                    + '&locid=' + loccode
                                                    + '&startdate=' + startdate
                                                    + '&enddate=' + enddate
                                                    + '&ddlzt=' + ddlzt
                                                    + '&startkm=' + startkm
                                                    + '&endkm=' + endkm
                                                    + '&afcode=' + ''
                                                    + '&line=' + line

    window.open(url);
};

function importToWord() {
    var obj = document.getElementById('ddlzt');
    var ju = document.getElementById('juselect').value; //局
    var jwd = document.getElementById('duanselect').value; //段; //机务段
    var jlh = document.getElementById('jlh').value; //交路
    var loccode = document.getElementById('txtloccode').value; //设备编码
    var startdate = document.getElementById('startdate').value; //时间
    var enddate = document.getElementById('enddate').value; //结束日期
    var ddlzt = getSelectedItem(obj); // document.getElementById('dll_zt').value; //状态
    var startkm = document.getElementById('startkm').value; //开始
    var endkm = document.getElementById('endkm').value; //结束公里标
    var jb = document.getElementById('jb').value;
    //var sore = document.getElementById('sore').value;
   // var qxType = document.getElementById('dll_zt');
   // var afcode = getSelectedItem(qxType.childNodes[0]);
    var line = document.getElementById('lineselect').value; //线路
    var url = '/Report/AlarmReport.aspx?ju=' + escape(ju)
                                                    + '&jwd=' + escape(jwd)
                                                    + '&jb=' + escape(document.getElementById('jb').value)
                                                    + '&sore=0'
                                                    + '&jlh=' + escape(jlh)
                                                    + '&locid=' + loccode
                                                    + '&startdate=' + startdate
                                                    + '&enddate=' + enddate
                                                    + '&ddlzt=' + ddlzt
                                                    + '&startkm=' + startkm
                                                    + '&endkm=' + endkm
                                                    + '&afcode=' + ''
                                                    + '&line=' + line
                                                    + "&_w=" + window.screen.width + "&_h=" + window.screen.height;

    window.open(url);
};

function importToWord1() {
    var obj = document.getElementById('ddlzt');
    var ju = document.getElementById('juselect').value; //局
    var jwd = document.getElementById('duanselect').value; //段; //机务段
    var jlh = document.getElementById('jlh').value; //交路
    var loccode = document.getElementById('txtloccode').value; //设备编码
    var startdate = document.getElementById('startdate').value; //时间
    var enddate = document.getElementById('enddate').value; //结束日期
    var ddlzt = getSelectedItem(obj); // document.getElementById('dll_zt').value; //状态
    var startkm = document.getElementById('startkm').value; //开始
    var endkm = document.getElementById('endkm').value; //结束公里标
    var jb = document.getElementById('jb').value;
    var sore = document.getElementById('sore').value;
   // var qxType = document.getElementById('dll_zt');
   // var afcode = getSelectedItem(qxType.childNodes[0]);
    var line = document.getElementById('lineselect').value; //线路
    var url = '../MFastReport/AlarmReport.aspx?ju=' + escape(ju)
                                                    + '&jwd=' + escape(jwd)
                                                    + '&jb=' + escape(document.getElementById('jb').value)
                                                    + '&sore=' + escape(sore)
                                                    + '&jlh=' + escape(jlh)
                                                    + '&locid=' + loccode
                                                    + '&startdate=' + startdate
                                                    + '&enddate=' + enddate
                                                    + '&ddlzt=' + ddlzt
                                                    + '&startkm=' + startkm
                                                    + '&endkm=' + endkm
                                                    + '&afcode=' + ''
                                                    + '&line=' + line

    window.open(url);
};



var map; var marker;
function ShowGis(rowData) {
    if (OnClickNumber == 1) {
        Bmaps(rowData.cells[0].innerText, rowData.cells[1].innerText);
    } else {
        map.setCenter(new BMap.Point(rowData.cells[0].innerText, rowData.cells[1].innerText));
        marker.setPosition(new BMap.Point(rowData.cells[0].innerText, rowData.cells[1].innerText));
    }
    document.getElementById('modal-22256').click();
};
var OnClickNumber = 1;
function Bmaps(GIS_X, GIS_Y) {
    OnClickNumber = OnClickNumber + 1;
    //var map = new BMap.Map("mapDiv", { mapType: BMAP_HYBRID_MAP }); // 创建Map实例
    map = new BMap.Map("mapDiv"); // 创建Map实例
    var point = new BMap.Point(GIS_X, GIS_Y);    // 创建点坐标
    map.clearOverlays();    //清除地图上所有覆盖物
    map.centerAndZoom(point, 9); // 初始化地图，设置中心点坐标和地图级别。

    map.enableScrollWheelZoom();
    map.enableKeyboard();
    map.disableDoubleClickZoom();

    var icon = new BMap.Icon("/Common/img/baojing.gif", new BMap.Size(20, 20));
    marker = new BMap.Marker(point, { icon: icon });
    map.addOverlay(marker);
    map.addControl(bmapUserTopOneRightInfo);
    map.addControl(new BMap.OverviewMapControl());
    map.addControl(new BMap.MapTypeControl({ anchor: BMAP_ANCHOR_TOP_LEFT }));    //左上角，默认地图控件
    map.setCurrentCity("武汉");   //由于有3D图，需要设置城市哦
    var cr = new BMap.CopyrightControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT });
    map.addControl(cr); //添加版权控件
    cr.addCopyright({ id: 1, content: "<a href='http://www.railwaytec.com'></a>" });

};
function bmapUserTopOneRightInfo() {
    // 设置默认停靠位置和偏移量
    this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
    this.defaultOffset = new BMap.Size(5, 5);

};