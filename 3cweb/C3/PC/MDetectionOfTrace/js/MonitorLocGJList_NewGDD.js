var option; //存放表格内容
var Linedata;
var Linedata2;
var json;
var OrgType = 'Line_GDD';
//绑定表格
function loadFlexiGrid() {
    //doQueryHistoricalTime(); ///  Common\js\6cweb\HistoricalTime.js
    var bool = $("#queryList").validationEngine("validate")
    if (!bool) {
        return false;
    }
    json = GetSeverityJson();
    from_AlarmStatisticalTrend()

    var ju = document.getElementById('juselect').value; //
    var jwd = document.getElementById('duanselect').value; //机务段
    var line = document.getElementById('lineselect').value; //线
    var loccode = document.getElementById('txtloccode').value; //设备编码
    var startdate = document.getElementById('startdate').value; //时间
    var enddate = document.getElementById('enddate').value; //时间

    var _h = $(window).height() - 200;
    var _PageNum = parseInt(($(window).height() - 260) / 25);

    var _url = 'RemoteHandlers/GetLocGJList_New.ashx?Type=GDD&startdate=' + startdate + '&enddate=' + enddate + '&line=' + line + '&ju=' + ju + '&jwd=' + jwd + '&loccode=' + loccode + "&PageSize=" + _PageNum;
    var _url1 = 'RemoteHandlers/GetLocGJList_New.ashx?Type=GDD_Line&startdate=' + startdate + '&enddate=' + enddate + '&line=' + line + '&ju=' + ju + '&jwd=' + jwd + '&loccode=' + loccode + "&PageSize=" + _PageNum;

    //供电用户 初始视图，线路视图。
    $('#Xdg').datagrid({
        url: _url1,
        pageNumber: 1,
        height: _h,
        pageSize: _PageNum,
        onLoadSuccess: function () {
            Linedata = $('#Xdg').datagrid('getRows');
        },
        view: detailview,
        detailFormatter: function (index, row) {
            var number = row.json1.length * 25 + 30 + "px";
            var jbHtml = "";
            if (GetSeverityName2('一类', json)) {
                jbHtml = jbHtml + '<th field="YLnum"  width="35">' + GetSeverityName2('一类', json) + '告警数量</th>';
            }
            if (GetSeverityName2('二类', json)) {
                jbHtml = jbHtml + '<th field="ELnum"  width="35">' + GetSeverityName2('二类', json) + '告警数量</th>';
            }
            if (GetSeverityName2('三类', json)) {
                jbHtml = jbHtml + '<th field="SLnum"  width="37">' + GetSeverityName2('三类', json) + '告警数量</th>';
            }
            return '<div class="ddv" style="width:100%;height:' + number + '" ><table id="Xdg' + index + '" style="width:100%;height:' + number + '" url="" toolbar="#toolbar" pagination="false" fitcolumns="true" singleselect="true"> <thead> <tr>  <th field="LOCOMOTIVE_CODE" align="center" width="142">设备编号</th> <th field="BEGIN"  width="32">开始时间</th> <th field="END"  width="30">结束时间</th> ' + jbHtml + ' <th field="GJMXurl"  width="30">检测轨迹明细</th> <th field="CZ" width="20">操作</th> </tr> </thead> </table></div>';
        },
        onExpandRow: function (index, row) {
            Linedata2 = row.json1;
            $('#Xdg' + index).datagrid({
                data: row.json1
            });
        }
    });
    var p1 = $('#Xdg').datagrid('getPager');
    $(p1).pagination({
        pageSize: _PageNum, //每页显示的记录条数，默认为5  
        pageList: [_PageNum], //可以设置每页记录条数的列表  
        beforePageText: '第', //页数文本框前显示的汉字  
        afterPageText: '页    共 {pages} 页',
        displayMsg: '当前显示 {from} - {to} 条记录   共 {total} 条记录'

    });

    //供电用户 管辖设备，设备-交路。
    $('#dg').datagrid({
        url: _url,
        pageNumber: 1,
        height: _h,
        pageSize: _PageNum,
        onLoadSuccess: function () {
            data = $('#dg').datagrid('getRows');
        },
        view: detailview,
        detailFormatter: function (index, row) {
            var number = row.json1.length * 25 + 30 + "px";
            var jbHtml = "";
            if (GetSeverityName2('一类', json)) {
                jbHtml = jbHtml + '<th field="YLnum"  width="35">' + GetSeverityName2('一类', json) + '告警数量</th>';
            }
            if (GetSeverityName2('二类', json)) {
                jbHtml = jbHtml + '<th field="ELnum"  width="35">' + GetSeverityName2('二类', json) + '告警数量</th>';
            }
            if (GetSeverityName2('三类', json)) {
                jbHtml = jbHtml + '<th field="SLnum"  width="37">' + GetSeverityName2('三类', json) + '告警数量</th>';
            }
            return '<div class="ddv" style="width:100%;height:' + number + '" ><table id="dg' + index + '" style="width:100%;height:' + number + '" url="" toolbar="#toolbar" pagination="false" fitcolumns="true" singleselect="true"> <thead> <tr> <th field="ROUTING_NO" align="center" width="47">交路号</th> <th field="DIRECTION" width="35">行别</th> <th field="BEGIN"  width="47">开始时间</th> <th field="END"  width="47">结束时间</th> ' + jbHtml + '<th field="GJMXurl"  width="35">检测轨迹明细</th> <th field="CZ" width="25">操作</th> </tr> </thead> </table></div>';

        },
        onExpandRow: function (index, row) {
            data1 = row.json1;
            $('#dg' + index).datagrid({
                data: row.json1
            });
        }
    });

    var p = $('#dg').datagrid('getPager');
    $(p).pagination({
        pageSize: _PageNum, //每页显示的记录条数，默认为5  
        pageList: [_PageNum], //可以设置每页记录条数的列表  
        beforePageText: '第', //页数文本框前显示的汉字  
        afterPageText: '页    共 {pages} 页',
        displayMsg: '当前显示 {from} - {to} 条记录   共 {total} 条记录'

    });

    //供电用户 管辖设备，线路视图。
    $('#org_Xdg').datagrid({
        url: _url,
        pageNumber: 1,
        height: _h,
        pageSize: _PageNum,
        onLoadSuccess: function () {
            data = $('#org_Xdg').datagrid('getRows');
        },
        view: detailview,
        detailFormatter: function (index, row) {
            var number = row.json2.length * 25 + 30 + "px";
            var jbHtml = "";
            if (GetSeverityName2('一类', json)) {
                jbHtml = jbHtml + '<th field="YLnum"  width="35">' + GetSeverityName2('一类', json) + '告警数量</th>';
            }
            if (GetSeverityName2('二类', json)) {
                jbHtml = jbHtml + '<th field="ELnum"  width="35">' + GetSeverityName2('二类', json) + '告警数量</th>';
            }
            if (GetSeverityName2('三类', json)) {
                jbHtml = jbHtml + '<th field="SLnum"  width="37">' + GetSeverityName2('三类', json) + '告警数量</th>';
            }
            return '<div class="ddv" style="width:100%;height:' + number + '" ><table id="org_Xdg' + index + '" style="width:100%;height:' + number + '" url="" toolbar="#toolbar" pagination="false" fitcolumns="true" singleselect="true"> <thead> <tr>  <th field="LINE_NAME" align="center" width="46">线路</th> <th field="DIRECTION" width="35">行别</th><th field="BEGIN"  width="45">开始时间</th> <th field="END"  width="45">结束时间</th> ' + jbHtml + ' <th field="GJMXurl"  width="35">检测轨迹明细</th> <th field="CZ" width="25">操作</th> </tr> </thead> </table></div>';
        },
        onExpandRow: function (index, row) {
            data2 = row.json2;
            $('#org_Xdg' + index).datagrid({
                data: row.json2
            });
        }
    });

    var p = $('#org_Xdg').datagrid('getPager');
    $(p).pagination({
        pageSize: _PageNum, //每页显示的记录条数，默认为5  
        pageList: [_PageNum], //可以设置每页记录条数的列表  
        beforePageText: '第', //页数文本框前显示的汉字  
        afterPageText: '页    共 {pages} 页',
        displayMsg: '当前显示 {from} - {to} 条记录   共 {total} 条记录'

    });
};


//弹出轨迹页面
function selectInfo(deviceid, BEGIN_TIME, END_TIME, LINE_CODE, DIRECTION) {
    //var rowindex = $(e).parents("tr").attr('datagrid-row-index');
    //var deviceid = data[rowindex].LOCOMOTIVE_CODE;
    //var BEGIN_TIME = data[rowindex].BEGIN_TIME;
    //var END_TIME = data[rowindex].END_TIME;
    TCGIS(deviceid, BEGIN_TIME, END_TIME, "", "", "");
};
//弹出轨迹页面
function JselectInfo(deviceid, BEGIN_TIME, END_TIME, CROSSING_NO, DIRECTION) {
    //var rowindex = $(e).parents("tr").attr('datagrid-row-index');
    //var deviceid = data1[rowindex].LOCOMOTIVE_CODE;
    //var BEGIN_TIME = data1[rowindex].BEGIN_TIME;
    //var END_TIME = data1[rowindex].END_TIME;
    //var CROSSING_NO = data1[rowindex].ROUTING_NO;
    //var DIRECTION = escape(data1[rowindex].DIRECTION);
    if (DIRECTION == "") {
        DIRECTION = "-1";
    }
    TCGIS(deviceid, BEGIN_TIME, END_TIME, CROSSING_NO, "", DIRECTION);
};
//弹出轨迹页面
function XselectInfo(deviceid, BEGIN_TIME, END_TIME, LINE_CODE, DIRECTION) {
    //var rowindex = $(e).parents("tr").attr('datagrid-row-index');
    //var deviceid = data2[rowindex].LOCOMOTIVE_CODE;
    //var BEGIN_TIME = data2[rowindex].BEGIN_TIME;
    //var END_TIME = data2[rowindex].END_TIME;
    //var LINE_CODE = data2[rowindex].LINE_CODE;
    //var DIRECTION = escape(data2[rowindex].DIRECTION);
    if (LINE_CODE == "") {
        LINE_CODE = "-1";
    }
    if (DIRECTION == "") {
        DIRECTION = "-1";
    }
    TCGIS(deviceid, BEGIN_TIME, END_TIME, "", LINE_CODE, DIRECTION);
};
function TCGIS(deviceid, BEGIN_TIME, END_TIME, CROSSING_NO, LINE_CODE, DIRECTION) {
    if (getConfig('UseLogicTopo') == 'true') {
        ShowWinOpen("/Common/MTopo/OrbitTopo.htm?Category_Code=DPC&deviceid=" + deviceid + "&startdate=" + BEGIN_TIME + "&enddate=" + END_TIME + "&jl=" + CROSSING_NO + "&LINE_CODE=" + LINE_CODE + "&DIRECTION=" + DIRECTION + "&v=" + version);
    } else {
        ShowWinOpen("/Common/MGIS/OrbitGIS.htm?Category_Code=DPC&deviceid=" + deviceid + "&startdate=" + BEGIN_TIME + "&enddate=" + END_TIME + "&jl=" + CROSSING_NO + "&LINE_CODE=" + LINE_CODE + "&DIRECTION=" + DIRECTION + "&v=" + version);
    }
};

//执行查询
function doQuery() {

    var ju = document.getElementById('juselect').value; //
    var jwd = document.getElementById('duanselect').value; //机务段
    var loccode = document.getElementById('txtloccode').value; //设备编码
    var startdate = document.getElementById('startdate').value; //时间
    var enddate = document.getElementById('enddate').value; //时间
    var jlh = document.getElementById('jlh').value; //交路号
    loadFlexiGrid();
    update();//更新级别
};
//选择ju事件
function juChange(pcode) {
};
//弹出一类缺陷
function selectYLnumInfo(deviceid, BEGIN_TIME, END_TIME, LINE_CODE, DIRECTION) {
    //var rowindex = $(e).parents("tr").attr('datagrid-row-index');
    //var deviceid = data[rowindex].LOCOMOTIVE_CODE;
    //var BEGIN_TIME = data[rowindex].BEGIN_TIME;
    //var END_TIME = data[rowindex].END_TIME;
    TCselectYLnumInfo(deviceid, BEGIN_TIME, END_TIME, "", "", "");
};
//弹出一类缺陷
function JselectYLnumInfo(deviceid, BEGIN_TIME, END_TIME, CROSSING_NO, DIRECTION) {
    //var rowindex = $(e).parents("tr").attr('datagrid-row-index');
    //var deviceid = data1[rowindex].LOCOMOTIVE_CODE;
    //var BEGIN_TIME = data1[rowindex].BEGIN_TIME;
    //var END_TIME = data1[rowindex].END_TIME;
    //var CROSSING_NO = data1[rowindex].ROUTING_NO;
    //var DIRECTION = escape(data1[rowindex].DIRECTION);
    if (DIRECTION == "") {
        DIRECTION = "-1";
    }
    TCselectYLnumInfo(deviceid, BEGIN_TIME, END_TIME, CROSSING_NO, "", DIRECTION);
};
//弹出一类缺陷
function XselectYLnumInfo(deviceid, BEGIN_TIME, END_TIME, LINE_CODE, DIRECTION) {
    //var rowindex = $(e).parents("tr").attr('datagrid-row-index');
    //var deviceid = data2[rowindex].LOCOMOTIVE_CODE;
    //var BEGIN_TIME = data2[rowindex].BEGIN_TIME;
    //var END_TIME = data2[rowindex].END_TIME;
    //var LINE_CODE = data2[rowindex].LINE_CODE;
    //var DIRECTION = escape(data2[rowindex].DIRECTION);
    if (LINE_CODE == "") {
        LINE_CODE = "-1";
    }
    if (DIRECTION == "") {
        DIRECTION = "-1";
    }
    TCselectYLnumInfo(deviceid, BEGIN_TIME, END_TIME, "", LINE_CODE, DIRECTION);
};
function TCselectYLnumInfo(deviceid, BEGIN_TIME, END_TIME, CROSSING_NO, LINE_CODE, DIRECTION) {
    document.getElementById('alarmInfo').src = "MonitorLocoStateC3AlarmList.htm?locid=" + deviceid + "&alarmtype=1&jl=" + CROSSING_NO + "&startdate=" + BEGIN_TIME + "&enddate=" + END_TIME + "&LINE_CODE=" + LINE_CODE + "&DIRECTION=" + escape(DIRECTION) + "&v=" + version + "&r=" + Math.random();
    //document.getElementById('modal-update').click();
    $("#modal-container-update").modal();
};
//弹出二类缺陷
function selectELnumInfo(deviceid, BEGIN_TIME, END_TIME, LINE_CODE, DIRECTION) {
    //var rowindex = $(e).parents("tr").attr('datagrid-row-index');
    //var deviceid = data[rowindex].LOCOMOTIVE_CODE;
    //var BEGIN_TIME = data[rowindex].BEGIN_TIME;
    //var END_TIME = data[rowindex].END_TIME;
    TCselectELnumInfo(deviceid, BEGIN_TIME, END_TIME, "", "", "");
};
//弹出二类缺陷
function JselectELnumInfo(deviceid, BEGIN_TIME, END_TIME, CROSSING_NO, DIRECTION) {
    //var rowindex = $(e).parents("tr").attr('datagrid-row-index');
    //var deviceid = data1[rowindex].LOCOMOTIVE_CODE;
    //var BEGIN_TIME = data1[rowindex].BEGIN_TIME;
    //var END_TIME = data1[rowindex].END_TIME;
    //var CROSSING_NO = data1[rowindex].ROUTING_NO;
    // var DIRECTION = escape(data1[rowindex].DIRECTION);
    if (DIRECTION == "") {
        DIRECTION = "-1";
    }
    TCselectELnumInfo(deviceid, BEGIN_TIME, END_TIME, CROSSING_NO, "", DIRECTION);
};
//弹出二类缺陷
function XselectELnumInfo(deviceid, BEGIN_TIME, END_TIME, LINE_CODE, DIRECTION) {
    //var rowindex = $(e).parents("tr").attr('datagrid-row-index');
    //var deviceid = data2[rowindex].LOCOMOTIVE_CODE;
    //var BEGIN_TIME = data2[rowindex].BEGIN_TIME;
    //var END_TIME = data2[rowindex].END_TIME;
    //var LINE_CODE = data2[rowindex].LINE_CODE;
    //var DIRECTION = escape(data2[rowindex].DIRECTION);
    if (LINE_CODE == "") {
        LINE_CODE = "-1";
    }
    if (DIRECTION == "") {
        DIRECTION = "-1";
    }
    TCselectELnumInfo(deviceid, BEGIN_TIME, END_TIME, "", LINE_CODE, DIRECTION);
};
function TCselectELnumInfo(deviceid, BEGIN_TIME, END_TIME, CROSSING_NO, LINE_CODE, DIRECTION) {
    document.getElementById('alarmInfo').src = "MonitorLocoStateC3AlarmList.htm?locid=" + deviceid + "&alarmtype=2&jl=" + CROSSING_NO + "&startdate=" + BEGIN_TIME + "&enddate=" + END_TIME + "&LINE_CODE=" + LINE_CODE + "&DIRECTION=" + escape(DIRECTION) + "&v=" + version;
    //document.getElementById('modal-update').click();
    $("#modal-container-update").modal();
};
//弹出三类缺陷
function selectSLnumInfo(deviceid, BEGIN_TIME, END_TIME, LINE_CODE, DIRECTION) {
    //var rowindex = $(e).parents("tr").attr('datagrid-row-index');
    //var deviceid = data[rowindex].LOCOMOTIVE_CODE;
    //var BEGIN_TIME = data[rowindex].BEGIN_TIME;
    //var END_TIME = data[rowindex].END_TIME;
    TCselectSLnumInfo(deviceid, BEGIN_TIME, END_TIME, "", "", "");
};
//弹出三类缺陷
function JselectSLnumInfo(deviceid, BEGIN_TIME, END_TIME, CROSSING_NO, DIRECTION) {
    //var rowindex = $(e).parents("tr").attr('datagrid-row-index');
    //var deviceid = data1[rowindex].LOCOMOTIVE_CODE;
    //var BEGIN_TIME = data1[rowindex].BEGIN_TIME;
    //var END_TIME = data1[rowindex].END_TIME;
    //var CROSSING_NO = data1[rowindex].ROUTING_NO;
    //var DIRECTION = escape(data1[rowindex].DIRECTION);
    if (DIRECTION == "") {
        DIRECTION = "-1";
    }
    TCselectSLnumInfo(deviceid, BEGIN_TIME, END_TIME, CROSSING_NO, "", DIRECTION);
};
//弹出三类缺陷
function XselectSLnumInfo(deviceid, BEGIN_TIME, END_TIME, LINE_CODE, DIRECTION) {
    //var rowindex = $(e).parents("tr").attr('datagrid-row-index');
    //var deviceid = data2[rowindex].LOCOMOTIVE_CODE;
    //var BEGIN_TIME = data2[rowindex].BEGIN_TIME;
    //var END_TIME = data2[rowindex].END_TIME;
    //var LINE_CODE = data2[rowindex].LINE_CODE;
    //var DIRECTION = escape(data2[rowindex].DIRECTION);
    if (LINE_CODE == "") {
        LINE_CODE = "-1";
    }
    if (DIRECTION == "") {
        DIRECTION = "-1";
    }
    TCselectSLnumInfo(deviceid, BEGIN_TIME, END_TIME, "", LINE_CODE, DIRECTION);
};
function TCselectSLnumInfo(deviceid, BEGIN_TIME, END_TIME, CROSSING_NO, LINE_CODE, DIRECTION) {
    document.getElementById('alarmInfo').src = "MonitorLocoStateC3AlarmList.htm?locid=" + deviceid + "&alarmtype=3&jl=" + CROSSING_NO + "&startdate=" + BEGIN_TIME + "&enddate=" + END_TIME + "&LINE_CODE=" + LINE_CODE + "&DIRECTION=" + escape(DIRECTION) + "&v=" + version;
    //document.getElementById('modal-update').click();
    $("#modal-container-update").modal();
};

//弹出轨迹明细
function selectDetailInfo(deviceid, BEGIN_TIME, END_TIME, LINE_CODE, DIRECTION) {
    //var rowindex = $(e).parents("tr").attr('datagrid-row-index');
    //var deviceid = data[rowindex].LOCOMOTIVE_CODE;
    //var BEGIN_TIME = data[rowindex].BEGIN_TIME;
    //var END_TIME = data[rowindex].END_TIME;
    TCselectDetailInfo(deviceid, BEGIN_TIME, END_TIME, "", "", "");
};
//弹出轨迹明细
function JselectDetailInfo(deviceid, BEGIN_TIME, END_TIME, CROSSING_NO, DIRECTION) {
    //var rowindex = $(e).parents("tr").attr('datagrid-row-index');
    //var deviceid = data1[rowindex].LOCOMOTIVE_CODE;
    //var BEGIN_TIME = data1[rowindex].BEGIN_TIME;
    //var END_TIME = data1[rowindex].END_TIME;
    //var CROSSING_NO = data1[rowindex].ROUTING_NO;
    //var DIRECTION = (data1[rowindex].DIRECTION);
    if (DIRECTION == "") {
        DIRECTION = "-1";
    }
    TCselectDetailInfo(deviceid, BEGIN_TIME, END_TIME, CROSSING_NO, "", DIRECTION);
};
//弹出轨迹明细
function XselectDetailInfo(deviceid, BEGIN_TIME, END_TIME, LINE_CODE, DIRECTION) {
    //var rowindex = $(e).parents("tr").attr('datagrid-row-index');
    //var deviceid = data2[rowindex].LOCOMOTIVE_CODE;
    //var BEGIN_TIME = data2[rowindex].BEGIN_TIME;
    //var END_TIME = data2[rowindex].END_TIME;
    //var LINE_CODE = data2[rowindex].LINE_CODE;
    //var DIRECTION = (data2[rowindex].DIRECTION);
    if (LINE_CODE == "") {
        LINE_CODE = "-1";
    }
    if (DIRECTION == "") {
        DIRECTION = "-1";
    }
    TCselectDetailInfo(deviceid, BEGIN_TIME, END_TIME, "", LINE_CODE, DIRECTION);
};
function TCselectDetailInfo(deviceid, BEGIN_TIME, END_TIME, CROSSING_NO, LINE_CODE, DIRECTION) {
    document.getElementById('alarmInfo').src = "/C3/PC/MDeviceStatus/public_stateList.html?locid=" + deviceid + "&jl=" + CROSSING_NO + "&startdate=" + BEGIN_TIME + "&enddate=" + END_TIME + "&LINE_CODE=" + LINE_CODE + "&DIRECTION=" + escape(DIRECTION) + "&v=" + version + '&OrgType=' + OrgType;
    //document.getElementById('modal-update').click();
    $("#modal-container-update").modal();
};


function LineselectYLnumInfo(deviceid, BEGIN_TIME, END_TIME, LINE_CODE, DIRECTION) {
    //var rowindex = $(e).parents("tr").attr('datagrid-row-index');
    //var deviceid = Linedata[rowindex].LOCOMOTIVE_CODE;
    //var BEGIN_TIME = Linedata[rowindex].BEGIN_TIME;
    //var END_TIME = Linedata[rowindex].END_TIME;
    //var LINE_CODE = Linedata[rowindex].LINE_CODE;
    //var DIRECTION = Linedata[rowindex].DIRECTION;
    if (LINE_CODE == "") {
        LINE_CODE = "-1";
    }
    if (DIRECTION == "") {
        DIRECTION = "-1";
    }
    TCselectYLnumInfo(deviceid, BEGIN_TIME, END_TIME, "", LINE_CODE, DIRECTION);
}
function LineselectELnumInfo(deviceid, BEGIN_TIME, END_TIME, LINE_CODE, DIRECTION) {
    //var rowindex = $(e).parents("tr").attr('datagrid-row-index');
    //var deviceid = Linedata[rowindex].LOCOMOTIVE_CODE;
    //var BEGIN_TIME = Linedata[rowindex].BEGIN_TIME;
    //var END_TIME = Linedata[rowindex].END_TIME;
    //var LINE_CODE = Linedata[rowindex].LINE_CODE;
    //var DIRECTION = Linedata[rowindex].DIRECTION;
    if (LINE_CODE == "") {
        LINE_CODE = "-1";
    }
    if (DIRECTION == "") {
        DIRECTION = "-1";
    }
    TCselectELnumInfo(deviceid, BEGIN_TIME, END_TIME, "", LINE_CODE, DIRECTION);
}
function LineselectSLnumInfo(deviceid, BEGIN_TIME, END_TIME, LINE_CODE, DIRECTION) {
    //var rowindex = $(e).parents("tr").attr('datagrid-row-index');
    //var deviceid = Linedata[rowindex].LOCOMOTIVE_CODE;
    //var BEGIN_TIME = Linedata[rowindex].BEGIN_TIME;
    //var END_TIME = Linedata[rowindex].END_TIME;
    //var LINE_CODE = Linedata[rowindex].LINE_CODE;
    //var DIRECTION = Linedata[rowindex].DIRECTION;
    if (LINE_CODE == "") {
        LINE_CODE = "-1";
    }
    if (DIRECTION == "") {
        DIRECTION = "-1";
    }
    TCselectSLnumInfo(deviceid, BEGIN_TIME, END_TIME, "", LINE_CODE, DIRECTION);
}
//弹出轨迹明细
function LineselectDetailInfo(deviceid, BEGIN_TIME, END_TIME, LINE_CODE, DIRECTION) {
    //var rowindex = $(e).parents("tr").attr('datagrid-row-index');
    //var deviceid = Linedata[rowindex].LOCOMOTIVE_CODE;
    //var BEGIN_TIME = Linedata[rowindex].BEGIN_TIME;
    //var END_TIME = Linedata[rowindex].END_TIME;
    //var LINE_CODE = Linedata[rowindex].LINE_CODE;
    //var DIRECTION = Linedata[rowindex].DIRECTION;
    if (LINE_CODE == "") {
        LINE_CODE = "-1";
    }
    if (DIRECTION == "") {
        DIRECTION = "-1";
    }
    TCselectDetailInfo(deviceid, BEGIN_TIME, END_TIME, "", LINE_CODE, DIRECTION);
};
//弹出轨迹明细
function _LineselectDetailInfo(deviceid, BEGIN_TIME, END_TIME, LINE_CODE, DIRECTION) {
    //var rowindex = $(e).parents("tr").attr('datagrid-row-index');
    //var deviceid = Linedata2[rowindex].LOCOMOTIVE_CODE;
    //var BEGIN_TIME = Linedata2[rowindex].BEGIN_TIME;
    //var END_TIME = Linedata2[rowindex].END_TIME;
    //var LINE_CODE = Linedata2[rowindex].LINE_CODE;
    //var DIRECTION = Linedata2[rowindex].DIRECTION;
    if (LINE_CODE == "") {
        LINE_CODE = "-1";
    }
    if (DIRECTION == "") {
        DIRECTION = "-1";
    }
    TCselectDetailInfo(deviceid, BEGIN_TIME, END_TIME, "", LINE_CODE, DIRECTION);
};
function _LineselectYLnumInfo(deviceid, BEGIN_TIME, END_TIME, LINE_CODE, DIRECTION) {
    //var rowindex = $(e).parents("tr").attr('datagrid-row-index');
    //var deviceid = Linedata2[rowindex].LOCOMOTIVE_CODE;
    //var BEGIN_TIME = Linedata2[rowindex].BEGIN_TIME;
    //var END_TIME = Linedata2[rowindex].END_TIME;
    //var LINE_CODE = Linedata2[rowindex].LINE_CODE;
    //var DIRECTION = Linedata2[rowindex].DIRECTION;
    if (LINE_CODE == "") {
        LINE_CODE = "-1";
    }
    if (DIRECTION == "") {
        DIRECTION = "-1";
    }
    TCselectYLnumInfo(deviceid, BEGIN_TIME, END_TIME, "", LINE_CODE, DIRECTION);
}
function _LineselectELnumInfo(deviceid, BEGIN_TIME, END_TIME, LINE_CODE, DIRECTION) {
    //var rowindex = $(e).parents("tr").attr('datagrid-row-index');
    //var deviceid = Linedata2[rowindex].LOCOMOTIVE_CODE;
    //var BEGIN_TIME = Linedata2[rowindex].BEGIN_TIME;
    //var END_TIME = Linedata2[rowindex].END_TIME;
    //var LINE_CODE = Linedata2[rowindex].LINE_CODE;
    //var DIRECTION = Linedata2[rowindex].DIRECTION;
    if (LINE_CODE == "") {
        LINE_CODE = "-1";
    }
    if (DIRECTION == "") {
        DIRECTION = "-1";
    }
    TCselectELnumInfo(deviceid, BEGIN_TIME, END_TIME, "", LINE_CODE, DIRECTION);
}
function _LineselectSLnumInfo(deviceid, BEGIN_TIME, END_TIME, LINE_CODE, DIRECTION) {
    //var rowindex = $(e).parents("tr").attr('datagrid-row-index');
    //var deviceid = Linedata2[rowindex].LOCOMOTIVE_CODE;
    //var BEGIN_TIME = Linedata2[rowindex].BEGIN_TIME;
    //var END_TIME = Linedata2[rowindex].END_TIME;
    //var LINE_CODE = Linedata2[rowindex].LINE_CODE;
    //var DIRECTION = Linedata2[rowindex].DIRECTION;
    if (LINE_CODE == "") {
        LINE_CODE = "-1";
    }
    if (DIRECTION == "") {
        DIRECTION = "-1";
    }
    TCselectSLnumInfo(deviceid, BEGIN_TIME, END_TIME, "", LINE_CODE, DIRECTION);
}
//弹出轨迹页面
function _LineselectInfo(deviceid, BEGIN_TIME, END_TIME, LINE_CODE, DIRECTION) {
    //var rowindex = $(e).parents("tr").attr('datagrid-row-index');
    //var deviceid = Linedata2[rowindex].LOCOMOTIVE_CODE;
    //var BEGIN_TIME = Linedata2[rowindex].BEGIN_TIME;
    //var END_TIME = Linedata2[rowindex].END_TIME;
    //var LINE_CODE = Linedata2[rowindex].LINE_CODE;
    //var DIRECTION = escape(Linedata2[rowindex].DIRECTION);
    if (DIRECTION == "") {
        DIRECTION = "-1";
    }
    TCGIS(deviceid, BEGIN_TIME, END_TIME, "", LINE_CODE, DIRECTION);
};
//趋势页面跳转附加条件获取
function from_AlarmStatisticalTrend() {
    if (GetQueryString('openType') == 'outside') {
        var sTime = GetQueryString('sTime')//开始时间
        var eTime = GetQueryString('eTime')//结束时间
        $('#startdate').val(sTime)
        $('#enddate').val(eTime)
    } else {
        return
    }
}