var isQXMap = 0;
var typeMap = "Q" //S 实时GIS  Q：缺陷查询GIS;
$(document).ready(function () {


    var _h = (parseInt($(window).height())) / 4;
    var _w = parseInt($(window).width()) / 4;

    $("#kjg").elevateZoom({ zoomWindowPosition: 05, zoomWindowWidth: _w - 8, zoomWindowHeight: _h - 8 });
    var _Divh = (parseInt($(window).height()) - 2);
    var _Divw = parseInt($(window).width()) + 15;
    $("#mapDiv").width(_Divw).height(_Divh + 2);
    $("#qxDiv").width(_Divw -15).height(_Divh + 2);

    $("#C3Alarm").width(_Divw / 4).height(_Divh);

    $("#C3Alarm_1").width(_w).height(_h);
    $("#C3Alarm_2").width(_w).height(_h);
    $("#C3Alarm_3").width(_w).height(_h);
    $("#C3Alarm_4").width(_w).height(_h);
    $("#linechart").width(_w).height(_h);

    $("#ImgTypeBox").css("bottom", "10px");
    // $('#iframe_task').attr('src', '/Common/MTask/TaskForm.htm?id=' + GetQueryString("alarmid") + '&type=openFaultTask&openType=&ShowSimple=1')

    $("#hw").width(_w).height(_h);
    $("#kjg").width(_w).height(_h);


    addCookie("GISSmall", "gis", 1, ""); //加入Cookie判断是否是实时监控的GIS还是直接GIS
    document.getElementById('loading').style.display = 'none'; // 加载时候如果网速慢提示正在加载请稍后。。。。
    var mapLevel = document.getElementById('mapLevel').value; //获取当前地图显示层次

    //初始时间值
    document.getElementById('startdate').value = ServerTime("Days", getConfig("FaultTimePeriod"));
    document.getElementById('enddate').value = ServerTime("0", "0");

    var V_CateGory = "0"; //0为取全部数据
    // loadControl("ztree");

    loadOrgSelect("juselect", "duanselect", "chejianselect", "gongquselect");

    $('#lineselect').mySelect({
        tag: 'LINE'
    });
    $('#txtqz').jHint({
        type: 'StationSection',
        line: ''
    });


    V_CateGory = GetQueryString("Category_Code").toUpperCase();
    if (GetQueryString("Category_Code") != undefined && GetQueryString("Category_Code") != "") {
        V_CateGory = GetQueryString("Category_Code").toUpperCase();
        if (V_CateGory == "DPC") {
            V_CateGory = "0";
        }


        if (V_CateGory != "0") {
            $('#dll_lx').val(V_CateGory).attr('disabled', "true");
        }
    }
    var codeTypes = V_CateGory;
    if (codeTypes == "0")
        codeTypes = "";

    $('#citySel').mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        cateGory: 'AFCODE',
        CodeType: V_CateGory,
        onClick: function (event, treeId, treeNode) {
            $('#citySel').val(treeNode.name);
        }
    });

    if (GetQueryString("dllzt") != undefined && GetQueryString("dllzt") != "") {

        var ids = GetQueryString("dllzt");
        // parameter += '&dllzt=' + ids;
        //设置ddlzt的状态。。。。暂略

        $("#ddlzt").attr("value", ""); //清空选中项。 
        // var ids = '1,3,6'; //设置选中框ID。 
        var id_Ojbect = (ids).split(","); //分割为Ojbect数组。 
        var count = $("#ddlzt option").length; //获取下拉框的长度。 
        for (var c = 0; c < id_Ojbect.length; c++) {
            for (var c_i = 0; c_i < count; c_i++) {
                if ($("#ddlzt").get(0).options[c_i].value == id_Ojbect[c]) {
                    $("#ddlzt").get(0).options[c_i].selected = true; //设置为选中。 
                }
            }
        }

    }

    //设置选中状态
    $('#ddlzt').val('AFSTATUS03');
    $("#ddlzt>option[value='AFSTATUS04']").attr('selected', true);


    $("#ddlzt").multiselect({
        noneSelectedText: "==请选择==",
        checkAllText: "全选",
        uncheckAllText: '全不选',
        selectedList: 5
    });




    if (GetQueryString("id") != undefined && GetQueryString("id") != "") {
        //设置ID，以便查询使用....暂略
    }


    if (GetQueryString("AlarmTime") != "" && GetQueryString("AlarmTime") != undefined) {
        var startDate = GetQueryString("AlarmTime")
        $('#startdate').val(startDate);
    }

    if (GetQueryString("startdate") != "" && GetQueryString("startdate") != undefined) {
        var startDate = GetQueryString("startdate")
        $('#startdate').val(startDate);
    }

    if (GetQueryString("enddate") != "" && GetQueryString("enddate") != undefined) {
        var startDate = GetQueryString("enddate")
        $('#enddate').val(startDate);
    }

    if (GetQueryString("line") != "" && GetQueryString("line") != undefined) {
        var lineCode = GetQueryString("line")
        $('#ddlLine').val(lineCode);
    }


    if (V_CateGory == "1C" || V_CateGory == "2C" || V_CateGory == "4C") {

        document.getElementById("qxDiv").style.height = window.screen.height * 0.91 + 28 + "px"; //缺陷GIS初始高度
        document.getElementById("qxDiv").style.width = window.screen.width + 20 + "px"; //缺陷GIS初始高度

        document.getElementById('one1').style.display = 'none';
        document.getElementById('Ul_One').style.display = 'none';
        document.getElementById('con_one_1').style.display = 'none';
        setTab('one', 2, 2);

        OnlondbqxMapbind();

        // MisLinesSelect();
    }
    else {
        try {

            ///GIS加载
           // bMapbind(mapLevel);
            typeMap = "Q"; // S
            //缺陷GIS加载
           // setTab('one', 2, 2);
            OnlondbqxMapbind();

            //                bqxMapbind(mapLevel, document.getElementById('startTime').value, document.getElementById('endTime').value);
            document.getElementById('UserLogon').style.display = 'none';

        } catch (e) {
            //alert("地图加载不成功，请检查网络！");

        }
    }


    $('#cb_type1').click(function () {

        var v = this.checked;
        showType("一类", v);

    })
    $('#cb_type2').click(function () {

        var v = this.checked;
        showType("二类", v);

    })
    $('#cb_type3').click(function () {

        var v = this.checked;
        showType("三类", v);

    })
    //    $('#Button4').click(function () {
    //        //确认并转任务按钮。
    //        btnAlarmUpdate();

    //        $('#iframe_task').contents().find("#btnTaskAndBute").click();



    //        // $("#iframe_task").contents()[0].defaultView.SendTaskAndDispatch();
    //        //btnOnClick('btnTask')
    //    })

});
//单击缺陷GIS加载信息
function OnlondbqxMapbind() {
    typeMap = "Q";
    $("#ImgTypeBox").css("display", "none");
    if (isQXMap == 0) {

        isQXMap++;
        var mapLevel = document.getElementById('mapLevel').value; //获取加载图层  （现在没有用 先保留）
        //缺陷GIS加载 mapLevel=地图初始图层；开始时间；结束时间（结束时间拼接后续查询条件）
        bqxMapbind(mapLevel, "", "");
    }
}
///用于判断当前选中table
function Color(type) {
    if (type == "GIS") {
        $("#ImgTypeBox").css("display", "");
        document.getElementById('GISA').style.color = "white";
        document.getElementById('qxGIS').style.color = "#53aede";
    } else {
        $("#ImgTypeBox").css("display", "none");
        document.getElementById('GISA').style.color = "#53aede";
        document.getElementById('qxGIS').style.color = "white";
    }
}
function ShowMTwin(str, w, h) {
    $("#tanchu").attr("href", str + "&lightbox[iframe]=true&lightbox[width]=" + w + "p&lightbox[height]=" + h + "p");
    $("#tanchu").click();
}

//线路改变
function lineChange(pcode) {
    $('#txtqz').jHint({
        type: 'StationSection',
        line: pcode
    });
};

function loadC3Form() {
    refushAlarm();
    ColseC3AlarmInfo();
}