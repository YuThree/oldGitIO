
//*****************通用变量
var index = 1;
var pageSize = 5;
var pageIndex = 1;
var _Type = GetQueryString("type");
var _ID = GetQueryString("ID");
var _SUBSTATION_CODE = GetQueryString("SUBSTATION_CODE");

$(() => {
    eventToggleTab("Quality");
    eventToggleTab("Run");
});


function load_Query() {
    Run_doquery();
    Quality_doquery();
    Note_doquery();

    _loadAll();
};

//加载基础信息
function _loadAll() {
    var Url = '/Common/MOnePlaceData/RemoteHandlers/SubstationControl.ashx?action=Detail&ID=' + _ID + '&SUBSTATION_CODE=' + _SUBSTATION_CODE;

    $.ajax({
        type: 'POST',
        url: Url,
        async: true,
        cache: false,
        success: function (result) {
            if (result != "undefined") {
                $("#SUBSTATION_NAME").text(result.SUBSTATION_NAME);    //所亭名称
                $("#SUBSTATION_CODE").text(result.SUBSTATION_CODE);    //所亭编码
                $("#LINE_CODE").text(result.LINE_NAME);     //线路
                $("#DIRECTION").text(result.DIRECTION);    //行别
                $("#KM_MARK").text(result.KM_MARK);      //公里标
                $("#BUREAU_CODE").text(result.BUREAU_NAME);      //铁路局
                $("#POWER_SECTION_CODE").text(result.POWER_SECTION_NAME);    //供电段
                $("#WORKSHOP_CODE").text(result.WORKSHOP_NAME);      //所属车间
                $("#ORG_CODE").text(result.ORG_NAME);           //所属班组
                $("#PWMDL_NAME").text(result.PWMDL_NAME);                 //供电方式
                if (result.START_PWRNG != ""){
                    $("#START_PWRNG").text(result.START_PWRNG + 'M—' + result.END_PWRNG + 'M');     //供电范围
                }
                //$("#END_PWRNG").text(result.END_PWRNG + 'M');         //供电范围
                $("#GIS_LON_O").text(result.GIS_LON_O);             //经度
                $("#GIS_LAT_O").text(result.GIS_LAT_O);             //纬度
                $("#NATURE").text(result.NATURE);               //性质
                $("#BSDESC").html(unescape(result.BSDESC_BR));      //基本概况

                $("#NOTE").text(result.NOTE);                  //其他
                $("#TAREA").text(result.TAREA);  //占地总面积
                if (result.BTEARA != "") {
                    $("#BTEARA").text(result.BTEARA + 'm²');  //房屋建筑总面积
                }
                if (result.PBEARA != "") {
                    $("#PBEARA").text(result.PBEARA + 'm²'); //生产房屋面积
                }
                $("#RMNUM").text(result.RMNUM);  //房间数量
                $("#FSHD").text(result.FSHD);    //竣工时间
                $("#NTKM").text(result.NTKM);    //换算接触网条公里
                $("#DVNUM").text(result.DVNUM);   //所设备数量汇总
                $("#RNNO").text(result.RNNO);     //运行编号
                $("#RNNM").text(result.RNNM);     //运行名称
                $("#INSDATE").text(result.INSDATE);   //安装日期
                $("#OPTDATE").text(result.OPTDATE);   //投运日期
                $("#OPTSTS").text(result.OPTSTS);     //运行状态
                $("#SUEQ").text(result.SUEQ);   //自用电量
                $("#RECQ").text(result.RECQ);   //受电量
                $("#SPEQ").text(result.SPEQ);    //供电量
                $("#TREQ").text(result.TREQ);    //牵引供电量
                $("#NTREQ").text(result.NTREQ);  //非牵引供电量
                if (result.RVTG != "") {
                    $("#RVTG").text(result.RVTG + 'Kv');    //受电电压
                }
                $("#VTGDGR").text(result.VTGDGR);   //电压等级
                $("#INPFNM").text(result.INPFNM);   //进线电源名称
                $("#INPFPNM").text(result.INPFPNM);     //上级变电站名称
                $("#INPFPCD").text(result.INPFPCD);   //上级变电站编码
                $("#INPFMDL_NAME").text(result.INPFMDL_NAME);   //电源引入方式
                $("#INPFLEN").text(result.INPFLEN);    //电源长度
                $("#INPSNM").text(result.INPSNM);    //进线电源名称
                $("#INPSPNM").text(result.INPSPNM);  //上级变电站名称
                $("#INPSPCD").text(result.INPSPCD);    //上级变电站编码
                $("#INPSMDL_NAME").text(result.INPSMDL_NAME);    //电源引入方式
                $("#INPSLEN").text(result.INPSLEN);    //电源长度
                $("#FDFNM").text(result.FDFNM);     //馈线一名称
                $("#FDFNO").text(result.FDFNO);    //馈线一编号
                $("#FDSNM").text(result.FDSNM);    //馈线二名称
                $("#FDSNO").text(result.FDSNO);    //馈线二编号
                $("#FDSDNM").text(result.FDSDNM);   //馈线三名称
                $("#FDSDNO").text(result.FDSDNO);   //馈线三编号
                $("#FDTHNM").text(result.FDTHNM);   //馈线四名称
                $("#FDTHNO").text(result.FDTHNO);   //馈线四编号
            }
        }
    });

};




//备用馈线查询
function Run_doquery() {

    layer.load();
    $('#Place_Run_Paging').paging({
        index: 1,
        url: function () {
            pageIndex = $('#Place_Run_Paging .pageValue').val();
            var _url = '/Common/MOnePlaceData/RemoteHandlers/SUBST_RNDT_SPFDControl.ashx?action=QueryList'
                    + '&SUBST_ID=' + _SUBSTATION_CODE
                    + '&PAGESIZE=' + pageSize
                    + '&CURRENTPAGE=' + pageIndex;
            return _url
        },
        success: function (data) {
            layer.closeAll('loading');
            var _JSON = data;
            if (_JSON.data.length > 0) {

                var Html = '<div class="div_ul">';
                for (var i = 0; i < _JSON.data.length; i++) {
                    Html += '<div class="div_li">\
                                <span>' + _JSON.data[i].SPFDNM + '</span><span>' + _JSON.data[i].SPFD + '</span>\
                                <img class="Place_Run_Edit" width="16" height="16" src="img/see.png" title="查看" />\
                            </div>'
                }
                Html += '</div>';
                document.getElementById("Place_Run_Content").innerHTML = Html;

                //添加备用馈线
                $(".Place_Run_Edit").click(function () {

                    $(this).parents(".Place_Run_wrapper").find(".Place_Run_container").remove();
                    $(this).parent(".div_li").siblings().css("border-bottom", "none");

                    var _index = $(this).parent(".div_li").index();

                    var html = '<div class="Place_Run_container">\
                        <div class="row-fluid">\
                            <span>\
                                <label>名称:</label>\
                                <span id="Place_Run_Name">' + _JSON.data[_index].SPFDNM + '</span>\
                            </span>\
                            <span>\
                                <label>编号:</label>\
                                <span id="Place_Run_Code">' + _JSON.data[_index].SPFD + '</span>\
                            </span>\
                        </div>\
                        <div class="row-fluid">\
                            <button type="button" id="Place_Run_cancel" class="btn btn-primary" onclick="ClosePlaceRun(this);">取&nbsp;&nbsp;消</button>\
                        </div>\
                    </div>'

                    $(this).parent(".div_li").after(html);
                    $(this).parent(".div_li").css("border-bottom", "1px solid #ccc");
                });

            } else {
                document.getElementById("Place_Run_Content").innerHTML = ""; //清空内容
            }
        }
    });
};

//质量鉴定数据查询
function Quality_doquery() {

    layer.load();
    $('#Place_Quality_Paging').paging({
        index: 1,
        url: function () {
            pageIndex = $('#Place_Quality_Paging .pageValue').val();
            var _url = '/Common/MOnePlaceData/RemoteHandlers/SUBST_APPRSControl.ashx?action=QueryList'
                    + '&SUBST_ID=' + _SUBSTATION_CODE
                    + '&PAGESIZE=' + pageSize
                    + '&CURRENTPAGE=' + pageIndex;
            return _url
        },
        success: function (data) {
            layer.closeAll('loading');
            var _JSON = data;
            if (_JSON.data.length > 0) {
                var Html = '<div class="div_ul">';
                for (var i = 0; i < _JSON.data.length; i++) {
                    Html += '<div class="div_li">\
                                <span>' + _JSON.data[i].APPRS_DATE + '</span><span>' + _JSON.data[i].APPRS_DFT + '</span><span>' + _JSON.data[i].APPRS_RST + '</span>\
                                <img class="Place_Quality_Edit" width="16" height="16" src="img/see.png" title="查看" />\
                            </div>'
                }
                Html += '</div>';
                document.getElementById("Place_Quality_Content").innerHTML = Html;

                //添加鉴定数据
                $(".Place_Quality_Edit").click(function () {

                    $(this).parents(".Place_Quality_wrapper").find(".Place_Quality_container").remove();
                    $(this).parent(".div_li").siblings().css("border-bottom", "none");

                    var _index = $(this).parent(".div_li").index();

                    var html = '<div class="Place_Quality_container">\
                        <div class="row-fluid">\
                            <span>\
                                <label>鉴定日期:</label>\
                                <span id="Place_Quality_Date">' + _JSON.data[_index].APPRS_DATE + '</span>\
                            </span>\
                            <span>\
                                <label>鉴定结果:</label>\
                                <span id="Place_Quality_Result">' + _JSON.data[_index].APPRS_RST + '</span>\
                            </span>\
                            <span>\
                                <label>鉴定等级:</label>\
                                <span id="Place_Quality_Grade">' + _JSON.data[_index].APPRS_DGR_NAME + '</span>\
                            </span>\
                            <span>\
                                <label>主要缺陷:</label>\
                                <span id="Place_Quality_Defect">' + _JSON.data[_index].APPRS_DFT + '</span>\
                            </span>\
                            <span>\
                                <label>内容:</label>\
                                <span id="Place_Quality_cont">' + unescape(_JSON.data[_index].APPRS_CXT_BR) + '</span>\
                            </span>\
                        </div>\
                        <div class="row-fluid">\
                            <button type="button" id="Place_Quality_cancel" class="btn btn-primary" onclick="ClosePlaceQuality(this);">取&nbsp;&nbsp;消</button>\
                        </div>\
                    </div>'

                    $(this).parent(".div_li").after(html);
                    $(this).parent(".div_li").css("border-bottom", "1px solid #ccc");
                }); 

            } else {
                document.getElementById("Place_Quality_Content").innerHTML = ""; //清空内容
            }
        }
    });
};

//纪事查询
function Note_doquery() {

    layer.load();
    $('#Place_Note_Paging').paging({
        index: 1,
        url: function () {
            pageIndex = $('#Place_Note_Paging .pageValue').val();
            var _url = '/Common/MOnePlaceData/RemoteHandlers/SUBST_NOTEControl.ashx?action=QueryList'
                    + '&SUBST_ID=' + _SUBSTATION_CODE
                    + '&PAGESIZE=' + pageSize
                    + '&CURRENTPAGE=' + pageIndex;
            return _url
        },
        success: function (data) {
            layer.closeAll('loading');
            var _JSON = data;
            if (_JSON.data.length > 0) {
                var Html = '<div class="div_ul">';
                for (var i = 0; i < _JSON.data.length; i++) {
                    Html += '<div class="div_li">\
                                <span>' + _JSON.data[i].NTHDT + '</span><span>' + _JSON.data[i].NTTL + '</span><span>' + _JSON.data[i].NTFP + '</span>\
                                <img class="Place_Note_Edit" width="16" height="16" src="img/see.png" title="查看" />\
                            </div>'
                }
                Html += '</div>';
                document.getElementById("Place_Note_Content").innerHTML = Html;

                //添加纪事
                $(".Place_Note_Edit").click(function () {
                    $(this).parents(".Place_Note_wrapper").find(".Place_Note_container").remove();
                    $(this).parents(".div_li").css("border-bottom", "none");

                    var _index = $(this).parent(".div_li").index();

                    var html = '<div class="Place_Note_container">\
                        <div class="row-fluid">\
                            <span>\
                                <label>发生日期:</label>\
                                <span id="Place_Note_Date">' + _JSON.data[_index].NTHDT + '</span>\
                            </span>\
                            <span>\
                                <label>标题:</label>\
                                <span id="Place_Note_Title">' + _JSON.data[_index].NTTL + '</span>\
                            </span>\
                            <span>\
                                <label>填写人:</label>\
                                <span id="Place_Note_Person">' + _JSON.data[_index].NTFP + '</span>\
                            </span>\
                            <span>\
                                <label>填写日期:</label>\
                                <span id="Place_Note_Time">' + _JSON.data[_index].NTFD + '</span>\
                            </span>\
                            <span>\
                                <label>内容:</label>\
                                <span id="Place_Note_cont">' + unescape(_JSON.data[_index].NTCNT_BR) + '</span>\
                            </span>\
                        </div>\
                        <div class="row-fluid">\
                            <button type="button" id="Place_Note_cancel" class="btn btn-primary" onclick="ClosePlaceNote(this);">取&nbsp;&nbsp;消</button>\
                        </div>\
                    </div>'

                    $(this).parent(".div_li").after(html);
                    $(this).parent(".div_li").css("border-bottom", "1px solid #ccc");
                });

            } else {
                document.getElementById("Place_Note_Content").innerHTML = ""; //清空内容
            }
        }
    });
};

//取消备用馈线
function ClosePlaceRun(tag) {
    $(tag).parents(".content_wrapper").find(".div_li").css("border-bottom", "none");
    $(tag).parent().parent().remove();
};

//取消质量鉴定数据
function ClosePlaceQuality(tag) {
    $(tag).parents(".content_wrapper").find(".div_li").css("border-bottom", "none");
    $(tag).parent().parent().remove();
};

//取消记事
function ClosePlaceNote(tag) {
    $(tag).parents(".content_wrapper").find(".div_li").css("border-bottom", "none");
    $(tag).parent().parent().remove();
};

/*
 * @desc 切换tab标签
 * @param deviceType：
 * @return 无
*/
function eventToggleTab(deviceType) {
    $('.j-' + deviceType + '-tab > li').click(function () { //tab切换
        var i = $(this).index(); //下标第一种写法
        $(this).addClass('cur-tab').siblings().removeClass('cur-tab');
        $('#' + deviceType + '-container > div.table-ul').eq(i).show().siblings().hide();
    });
};