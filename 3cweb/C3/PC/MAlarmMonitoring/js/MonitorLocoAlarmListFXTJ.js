var option; //存放表格内容
//树样式信息

var json_data;
var t_closeImgBox;
var setting = {
    data: {
        simpleData: {
            enable: true
        }
    }
};

//$(document).ready(function () {

//    doQuery()

//})
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
    //  var afcode;
    if ($('#citySel').val() != '')
        code = $('#citySel').attr("code"); //报警类型
    var line = document.getElementById('lineselect').value; //线路
    var urlstr;

    var _h = $(window).height() - 242 - 30;
    var _PageNum = parseInt(($(window).height() - 242) / 25) - 1;

    if (str == "1") {
        var sore = document.getElementById('sore').value;
        //    afcode = getSelectedItem(qxType);
        urlstr = 'RemoteHandlers/GetMonitorLocoAlarmListFXTJ.ashx?ju=' + escape(ju)
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
                                                    + '&afcode=' + code
                                                    + '&line=' + line
                                                    + '&temp=' + Math.random();
    }
    else {
        //  afcode = getSelectedItem(qxType.childNodes[0]);
        urlstr = 'RemoteHandlers/GetMonitorLocoAlarmListFXTJ.ashx?ju=' + escape(ju)
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

    var cm = [
                { display: 'GISX', name: 'GISX', width: 80, sortable: false, align: 'center', hide: true },
                { display: 'GISY', name: 'GISY', width: 80, sortable: false, align: 'center', hide: true },
                { display: '红外', name: 'HW', width: 150, sortable: false, hide: true, align: 'left' },
                { display: '可见光', name: 'KJG', width: 150, sortable: false, hide: true, align: 'left' },
                //{ display: ' <span id="btn_ckAll" class="label btn_save" ><i  class="i_save icon icon-star-on icon-white" ></i></span> ', name: 'Save', width: 50, sortable: false, align: 'center' },
                { display: '设备编号', name: 'LOCOMOTIVE_CODE', width: 80, sortable: false, align: 'center' },
                { display: '发生时间', name: 'NOWDATE', width: 140, sortable: false, align: 'center' },
                { display: '位置信息', name: 'WZ', width: 460, sortable: false, align: 'left' },
                { display: '弓位置', name: 'GWZ', width: 60, sortable: false, align: 'center', hide: true },
                { display: '速度', name: 'SD', width: 80, sortable: false, align: 'center', hide: true },

                { display: '收到红外视频时间', name: 'DVALUE2', width: 60, sortable: false, align: 'center' },
                { display: '收到可见光视频时间', name: 'DVALUE3', width: 60, sortable: false, align: 'center' },
                { display: '收到全景I视频时间', name: 'DVALUE4', width: 60, sortable: false, align: 'center' },
                { display: '收到全景II视频时间', name: 'DVALUE5', width: 60, sortable: false, align: 'center' },
                { display: '收到同步文件时间', name: 'DVALUE1', width: 60, sortable: false, align: 'center' },
                { display: '分析时间', name: 'STATUS_TIME', width: 60, sortable: false, align: 'center' },
                { display: '上报红外视频时差', name: 'DVALUE2C', width: 60, sortable: false, align: 'center' },
                { display: '上报可见光视频时差', name: 'DVALUE3C', width: 60, sortable: false, align: 'center' },
                { display: '上报全景I视频时差', name: 'DVALUE4C', width: 60, sortable: false, align: 'center' },
                { display: '上报全景II视频时差', name: 'DVALUE5C', width: 60, sortable: false, align: 'center' },
                { display: '上报同步文件时差', name: 'DVALUE1C', width: 60, sortable: false, align: 'center' },
                { display: '分析时差', name: 'STATUS_TIMEC', width: 60, sortable: false, align: 'center' },
                { display: '分析状态', name: 'CHULIZT', width: 60, sortable: false, align: 'center' },
                { display: '最高温度℃', name: 'WD', width: 60, sortable: false, align: 'center', hide: true },
                { display: '环境温度℃', name: 'HJWD', width: 60, sortable: false, align: 'center', hide: true },
                { display: '导高值mm', name: 'DGZ', width: 70, sortable: false, align: 'center', hide: true },
                { display: '拉出值mm', name: 'LCZ', width: 70, sortable: false, align: 'center', hide: true },
                { display: '报警级别', name: 'JB', width: 50, sortable: false, align: 'center', hide: true },
                { display: '报警状态', name: 'ZT', width: 50, sortable: false, align: 'center', hide: true },
                { display: '报警类型', name: 'QXZT', width: 120, sortable: false, align: 'left', hide: true },
                { display: '报警分析', name: 'CZ', width: 80, sortable: false, align: 'center', hide: true },
                { display: '下载', name: 'XZ', width: 80, sortable: false, hide: true, align: 'center' },
                { display: 'ID', name: 'ID', width: 80, sortable: false, pk: true, hide: true, align: 'center' }
    ];
    if (FunEnable('Fun_CollectionButton') == "True") {
        cm.splice(4, 0, { display: '', name: 'Save', width: 25, sortable: false, align: 'center' });
    };

    option = {
       
        url: urlstr,
        dataType: 'json',
        width: 'auto',
        rowId: 'ID',
        height: _h,
        nowrap: true,
        rp: _PageNum,
        useRp: true,
        rpOptions: [20, 50, 100, _PageNum],
        colModel: cm,
        onRowDblclick: rowDblclick, //双击事件
        onSuccess: function () {




            totalRows = this.total;
            

            $('.hDivBox th>div').css('text-align', 'center');



            //    $(this).find('td')[2]
            //翻页时将勾选状态默认改为不勾选
            isCheck = false;
            //$("#btn_ckAll .i_save").removeClass("icon-color").addClass("icon-white");

            $("#flexTable tr .collect").each(function () {
                //  var overOBJ = $(this).children('td:eq(2)');

                var _alarmID = $(this).parent().parent().parent().find('td:last')[0].innerText;
             
             
                var SaveAlarms = getCookieValue("SaveAlarms"); // window.localStorage.SaveAlarms; 
               // _alarmID = _alarmID.substring(1, _alarmID.length)
              // alert(SaveAlarms)
                //if (SaveAlarms != undefined && SaveAlarms != '') {
                //    if (SaveAlarms.indexOf(_alarmID) >= 0) {
                //        //已经存在
                //        $(this).find('.i_save').removeClass("icon-white").addClass("icon-color");
                //    }
                //    else {
                //        $(this).find('.i_save').removeClass("icon-color").addClass("icon-white");
                //    }
                //}


                $(this).hover(function (e) {

                    clearTimeout(t_closeImgBox);
                    var _hw = $(this).parent().parent().parent().find('td')[2].innerText;
                    var _kjg = $(this).parent().parent().parent().find('td')[3].innerText;
                    
                    $('#img_hw').attr('src', _hw);
                    $('#img_kjg').attr('src', _kjg);



                    over(this, "seleHeadDiv", e);






                }, function () {
                   
                    t_closeImgBox = setTimeout(function () {
                        $("#seleHeadDiv").hide();
                    }, 100)

                });
                if (FunEnable('Fun_FavoritesButton') == "True") {
                    $(this).click(function () {

                        var alarmID = $(this).parent().parent().parent().find('td:last')[0].innerText; // $(this).parent().parent().parent().find('td')[20].innerText;

                        // alarmID.subString(1, alarmID.length)
                        //添加收藏。

                        var SaveAlarms = getCookieValue("SaveAlarms"); // window.localStorage.SaveAlarms;
                        // alarmID = alarmID.substring(1, alarmID.length - 1);
                        // alert(SaveAlarms)
                        if (SaveAlarms != undefined && SaveAlarms != '') {
                            if (SaveAlarms.indexOf(alarmID) >= 0) {

                                DelStorageSaveAlarms(alarmID);
                                $(this).find('.i_save').removeClass("icon-color").addClass("icon-white");
                                return;

                            }
                            else {
                                SaveAlarms += '_' + alarmID;
                                if (SaveAlarms.split('_').length > 1000) {
                                    ymPrompt.alert('超过收藏最大限值1000，请先处理再进行操作！');
                                    return false;
                                }
                                $(this).find('.i_save').removeClass("icon-white").addClass("icon-color");


                            }
                        }
                        else {
                            SaveAlarms = alarmID;
                            $(this).find('.i_save').removeClass("icon-white").addClass("icon-color");

                        }

                        window.localStorage.SaveAlarms = SaveAlarms;


                    })
                };

            });



        }

        
    }
        

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
    ShowWinOpen("MonitorAlarmC3FormUpdate.aspx?alarmid=" + id + "&v=" + version);
};
//双击
function rowDblclick(rowData) {
    var id = rowData.ID; //不做处理
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
            //   document.getElementById('dll_zt').value = getCookieValue("dll_zt");
            document.getElementById('lineselect').value = getCookieValue("line");
            document.getElementById('jb').value = getCookieValue("jb");
            setSelectdItem(getCookieValue("ddlzt").replace("%2C", ","), document.getElementById('ddlzt'));
            //    setSelectdItem(getCookieValue("dll_zt").replace("%2C", ","), document.getElementById('dll_zt').childNodes[0]);
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
    //  addCookie("dll_zt", afcode, 7, "/");
    addCookie("startkm", startkm, 7, "/");
    addCookie("endkm", endkm, 7, "/");
    addCookie("jb", escape(jb), 7, "/");
    addCookie("line", line, 7, "/");
    //结束
    option.url = 'RemoteHandlers/GetMonitorLocoAlarmListFXTJ.ashx?ju=' + escape(ju)
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
    var afcode;
    var line = "0"; //线路
    var urlstr;
    var str = "";
    if (str == "1") {
        var sore = document.getElementById('sore').value;
        afcode = getSelectedItem(qxType);
        urlstr = 'RemoteHandlers/GetMonitorLocoAlarmListFXTJ.ashx?ju=' + escape(ju)
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
        urlstr = 'RemoteHandlers/GetMonitorLocoAlarmListFXTJ.ashx?ju=' + escape(ju)
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
    // var qxType = document.getElementById('dll_zt');
    //  var afcode = getSelectedItem(qxType.childNodes[0]);
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

    option.url = 'RemoteHandlers/GetMonitorLocoAlarmListFXTJ.ashx?ju=' + escape(ju)
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
    //  var qxType = document.getElementById('dll_zt');
    //  var afcode = getSelectedItem(qxType.childNodes[0]);
    var line = document.getElementById('lineselect').value; //线路
    var url = '../MFastReport/ExcelReport.aspx?ju=' + escape(ju)
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

    var bow = escape($('#txt_bow').val()); //弓位置
    var obj = document.getElementById('ddlzt');
    var ju = document.getElementById('juselect').value; //局
    var jwd = document.getElementById('duanselect').value; //段; //机务段
    // var jlh = document.getElementById('jlh').value; //交路
    var loccode = document.getElementById('txtloccode').value; //设备编码
    var startdate = document.getElementById('startdate').value; //时间
    var enddate = document.getElementById('enddate').value; //结束日期
    var ddlzt = getSelectedItem(obj); // document.getElementById('dll_zt').value; //状态
    var startkm = document.getElementById('startkm').value; //开始
    var endkm = document.getElementById('endkm').value; //结束公里标
    var jb = document.getElementById('jb').value;
    //    var qz = document.getElementById('txtqz').value;
    //var sore = document.getElementById('sore').value;
    //  var qxType = document.getElementById('dll_zt');
    var afcode = '';
    if ($('#citySel').val() != '')
        afcode = $('#citySel').attr("code"); //报警类型
    var line = document.getElementById('lineselect').value; //线路
    var url = '/Report/AlarmReport.aspx?ju=' + escape(ju)
                                                    + '&jwd=' + escape(jwd)
                                                    + '&jb=' + escape(document.getElementById('jb').value)
                                                    + '&sore=0'
    //                                                    + '&jlh=' + escape(jlh)
                                                    + '&locid=' + loccode
                                                    + '&startdate=' + startdate
                                                    + '&enddate=' + enddate
                                                    + '&ddlzt=' + ddlzt
                                                    + '&startkm=' + startkm
                                                    + '&endkm=' + endkm
                                                    + '&afcode=' + afcode
                                                    + '&line=' + line
    //                                                    + '&qz=' + qz
                                                    + '&bow=' + bow
    //                                                    + '&data_type=' + _data_type
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




function OnclickPJSC() {

    json_data = getPJSC();
    document.getElementById('faultsc').innerHTML = json_data[0].FalutI + "小时,最大时差" + json_data[0].ds1 + "小时";
    document.getElementById('hwsc').innerHTML = json_data[0].HW + "小时,最大时差" + json_data[0].ds2 + "小时";
    document.getElementById('kjgsc').innerHTML = json_data[0].KJJG + "小时,最大时差" + json_data[0].ds3 + "小时";
    document.getElementById('qj1sc').innerHTML = json_data[0].QJ1 + "小时,最大时差" + json_data[0].ds4 + "小时";
    document.getElementById('qj2sc').innerHTML = json_data[0].QJ2 + "小时,最大时差" + json_data[0].ds5 + "小时";
    document.getElementById('fxsj').innerHTML = json_data[0].FX + "小时,最大时差" + json_data[0].ds6 + "小时";
    var name = "";
    var ju = document.getElementById('juselect').value; //局

    if (ju != "0") {
        name += setSelectdItems(document.getElementById('juselect'));
    }
    var jwd = document.getElementById('duanselect').value; //段; //机务段
    if (jwd != "0") {
        name += "-" + setSelectdItems(document.getElementById('duanselect'));
    }

    var loccode = document.getElementById('txtloccode').value; //设备编码
    if (loccode != "") {
        name += "-" + loccode;
    }
    var line = document.getElementById('lineselect').value;
    if (line != "0") {
        name += "-" + setSelectdItems(document.getElementById('lineselect'));
    }
    var startkm = document.getElementById('startkm').value; //结束公里标
    if (startkm != "") {
        name += "-" + startkm;
    }
    var endkm = document.getElementById('endkm').value; //结束公里标
    if (endkm != "") {
        name += "至" + endkm;
    }
    var jb = document.getElementById('jb').value; //
    if (jb != "0") {
        name += "-" + setSelectdItems(document.getElementById('jb'));
    }
    var startdate = document.getElementById('startdate').value; //时间
    if (startdate != "") {
        name += "-" + startdate;
    }
    var enddate = document.getElementById('enddate').value; //结束日期
    if (enddate != "") {
        name += "至" + enddate;
    }
    var zt = document.getElementById('ddlzt');

    name += "-" + setSelectdItems(zt);
    document.getElementById('BT').innerHTML = "<h5>" + name + "</h5>";
    name = "";


    LoadChart();

    document.getElementById('modal-22256').click();



}
//获取树数据节点
function getPJSC() {
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
    //   var afcode = getSelectedItem(qxType.childNodes[0]);
    var line = document.getElementById('lineselect').value; //线路
    var zhuangtai = document.getElementById('citySel').value;
    var pj = "1";
    var fxJG = document.getElementById('fxJG').value; //局

    var url = 'RemoteHandlers/GetMonitorLocoAlarmListFXTJ.ashx?ju=' + escape(ju)
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
                                                    + '&pj=' + escape(pj)
                                                    + '&temp=' + Math.random();
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
//设置选中项
function setSelectdItems(selectobj) {
    var name = "";
    for (var i = 0; i < selectobj.options.length; i++)
        if (selectobj.options[i].selected == true) {
            name += selectobj.options[i].text;
        }

    return name;
};



function LoadChart() {

    var svalue = "[" + json_data[0].FalutI + "," + json_data[0].HW + "," + json_data[0].KJJG + "," + json_data[0].QJ1 + "," + json_data[0].QJ2 + "," + json_data[0].FX + ']';
    //    document.getElementById('faultsc').innerHTML = json[0].FalutI + "小时";
    //    document.getElementById('hwsc').innerHTML = json[0].HW + "小时";
    //    document.getElementById('kjgsc').innerHTML = json[0].KJJG + "小时";
    //    document.getElementById('qj1sc').innerHTML = json[0].QJ1 + "小时";
    //    document.getElementById('qj2sc').innerHTML = json[0].QJ2 + "小时";
    //    document.getElementById('fxsj').innerHTML = json[0].FX + "小时";

    var evalue_json = eval(svalue);

    var myChart1 = echarts.init(document.getElementById('chart1'));

    var option = {
        title: {
            text: '平均上报文件时差统计',
            x: 'center'
        },
        tooltip: {
            trigger: 'axis',
            formatter: '{a} <br/>{b} : {c} 小时'
        },
        //    legend: {
        //        data:['时差']
        //    },
        toolbox: {
            show: true

        },
        calculable: true,
        xAxis: [
        {
            type: 'category',
            data: ['FaultI文件', '红外视频', '可见光视频', '全景I视频 ', '全景II视频', '平均分析']

        }
    ],
        yAxis: [
        {
            type: 'value'
        }
    ],
        series: [
        {
            name: '时差',
            type: 'bar',
            data: evalue_json //[2.0, 4.9, 7.0, 23.2, 25.6, 76.7],


        }
    ]
    };

    myChart1.setOption(option);

}




//添加收藏功能函数

function LoadSave(alarmID) {
    //  var alarmID = over_alarmID;
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

var isCheck = false;
function ckAll() {
    if (!isCheck) {
        $("#btn_ckAll .i_save").removeClass("icon-white").addClass("icon-color");
    }
    else {
        $("#btn_ckAll .i_save").removeClass("icon-color").addClass("icon-white");
    }
    $("#flexTable tr .collect").each(function () {
        var alarmID = $(this).parent().parent().parent().find('td:last')[0].innerText;
       
        //alarmID=alarmID.subString(1, alarmID.length - 1)
        //添加收藏。
        var SaveAlarms = getCookieValue("SaveAlarms"); // window.localStorage.SaveAlarms;  //;
       // alarmID = alarmID.substring(1, alarmID.length - 1);
       
        if (SaveAlarms != undefined && SaveAlarms != '') {
            if (SaveAlarms.indexOf(alarmID) >= 0) {
                //已经存在
                //ymPrompt.alert('已经收藏');
                if (isCheck) {
                    DelStorageSaveAlarms(alarmID);
                    $(this).find('.i_save').removeClass("icon-color").addClass("icon-white");
                }
                return;

            }
            else {
                if (!isCheck) {
                    SaveAlarms += '_' + alarmID;
                    if (SaveAlarms.split('_').length > 1000) {
                        ymPrompt.alert('超过收藏最大限值1000，请先处理再进行操作！');
                        return false;
                    }
                    $(this).find('.i_save').removeClass("icon-white").addClass("icon-color");
                }
                // ymPrompt.alert('收藏成功');
            }
        }
        else {
            SaveAlarms = alarmID;
            $(this).find('.i_save').removeClass("icon-white").addClass("icon-color");
            //  ymPrompt.alert('收藏成功');
        }

        window.localStorage.SaveAlarms = SaveAlarms;
        //        deleteCookie("SaveAlarms", "/");
        //        addCookie("SaveAlarms", SaveAlarms, 30, "/");
    });

    isCheck = !isCheck;
}





function getoffset(e) {
    var t = e.offsetTop;
    var l = e.offsetLeft;
    while (e = e.offsetParent) {
        t += e.offsetTop;
        l += e.offsetLeft;
    }
    var rec = new Array(1);
    rec[0] = t;
    rec[1] = l;
    return rec
};
function over(obj, divid, e) {
    var div = document.getElementById(divid);
    var rec = getoffset(obj);
    div.style.postion = "absolute";

    var _top = rec[0] + obj.offsetHeight;
    var _left = rec[1] + obj.offsetWidth; // event.pageX;
    // var _left = event.pageX;


    if (_top + $('#' + divid).height() > $(window).height()) {
        _top = rec[0] - $('#' + divid).height();
    }

    if (_left + $('#' + divid).width() > $(window).width()) {
        _left = $(window).width() - $('#' + divid).width();
    }

    $('#' + divid).animate({ top: _top, left: _left }, 50);

    div.style.display = "";
};





