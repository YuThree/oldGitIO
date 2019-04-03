
//*****************通用变量
var index = 1;
var pageSize = 5;
var pageIndex = 1;
var _Type = GetQueryString("type");
var _ID = GetQueryString("ID");
var _SUBSTATION_CODE = GetQueryString("SUBSTATION_CODE");
var _Json = getCurUser();  //登录名
$(() => {

    //绑定线路
    $('#LINE_CODE').mySelect({
        tag: 'LINE'
    });

    //绑定局、段、车间、工区
    if (!_Type) {
        loadOrgSelect("BUREAU_CODE", "POWER_SECTION_CODE", "WORKSHOP_CODE", "ORG_CODE");
    }

    //绑定行别
    $("#DIRECTION").mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: '3C',
        cateGory: 'DRTFLG',
        enableFilter: false,
        onClick: function (event, treeId, treeNode) {
            $("#DIRECTION").attr('code', treeNode.id).val(treeNode.name);
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

    //进行电源引入方式
    $("#INPFMDL_NAME").mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: 'DPC',
        p_code: "POWER_DRAW_TYPE",
        cateGory: 'SUBSTARC',
        enableFilter: false,
        onClick: function (event, treeId, treeNode) {
            $("#INPFMDL_NAME").attr('code', treeNode.id).val(treeNode.name);
        }
    });

    $("#INPSMDL_NAME").mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: 'DPC',
        p_code: "POWER_DRAW_TYPE",
        cateGory: 'SUBSTARC',
        enableFilter: false,
        onClick: function (event, treeId, treeNode) {
            $("#INPSMDL_NAME").attr('code', treeNode.id).val(treeNode.name);
        }
    });

    if (_Type == "edit" && _Type) {
        $("#SUBSTATION_NAME").attr("disabled", "disabled");
        $("#SUBSTATION_CODE").attr("disabled", "disabled");
    }

    //保存
    $('#Place_save').click(function () {
        var bool = GetValid();

        if (bool) {
            ymPrompt.confirmInfo({
                message: '确认要添加信息吗?',
                handler: function (tp) {
                    if (tp == 'ok') {
                        save();
                    }
                    if (tp == 'cancel') {
                    }
                    if (tp == 'close') {
                    }
                }
            });
        }
    });

    //编辑
    $('#Place_edit').click(function () {
        var bool = GetValid();

        if (bool) {
            ymPrompt.confirmInfo({
                message: '确认要添加信息吗?',
                handler: function (tp) {
                    if (tp == 'ok') {
                        edit();
                    }
                    if (tp == 'cancel') {
                    }
                    if (tp == 'close') {
                    }
                }
            });
        }
    });


    $(".Place_Run_Addimg").click(function () {
        AddPlaceRun(this);
    });

    $(".Place_Quality_Addimg").click(function () {
        AddPlaceQuality(this);
    });

    $(".Place_Note_Addimg").click(function () {
        AddPlaceNote(this);
    });

    eventToggleTab("Quality");
    eventToggleTab("Run");
});



//保存位置信息
function save() {
    var LINE_NAME = $('#LINE_CODE').find("option:selected").text();//线路
    var BUREAU_NAME = $('#BUREAU_CODE').find("option:selected").text();//局
    var POWER_SECTION_NAME = $('#POWER_SECTION_CODE').find("option:selected").text();//段
    var WORKSHOP_NAME = $('#WORKSHOP_CODE').find("option:selected").text();//工区
    var ORG_NAME = $('#ORG_CODE').find("option:selected").text();//车间
    var PWMDL_CODE = $("#PWMDL_NAME").attr("code"); //供电方式
    var INPFMDL_CODE = $("#INPFMDL_NAME").attr("code"); //电源引入方式1
    var INPSMDL_CODE = $("#INPSMDL_NAME").attr("code"); //电源引入方式2
    var options = {
        url: "/Common/MOnePlaceData/RemoteHandlers/SubstationControl.ashx?action=Add&LINE_NAME=" + LINE_NAME + "&BUREAU_NAME=" + BUREAU_NAME + "&POWER_SECTION_NAME=" + POWER_SECTION_NAME + "&WORKSHOP_NAME=" + WORKSHOP_NAME + "&ORG_NAME=" + ORG_NAME + "&PWMDL_CODE=" + PWMDL_CODE + "&INPFMDL_CODE=" + INPFMDL_CODE + "&INPSMDL_CODE=" + INPSMDL_CODE,
        type: 'POST',
        success: function (result) {
            if (result.sign == "True") {
                layer.msg(result.content);
                window.parent.doQuery(1);
            } else {
                layer.msg(result.content);
            }
        }
    };
    $('#form1').ajaxSubmit(options);
};

//编辑位置信息
function edit() {
    var SUBSTATION_NAME = $("#SUBSTATION_NAME").val();  //所亭名称
    var SUBSTATION_CODE = $("#SUBSTATION_CODE").val();  //所亭编码
    var LINE_NAME = $('#LINE_CODE').find("option:selected").text();//线路
    var BUREAU_NAME = $('#BUREAU_CODE').find("option:selected").text();//局
    var POWER_SECTION_NAME = $('#POWER_SECTION_CODE').find("option:selected").text();//段
    var WORKSHOP_NAME = $('#WORKSHOP_CODE').find("option:selected").text();//工区
    var ORG_NAME = $('#ORG_CODE').find("option:selected").text();//车间
    var PWMDL_CODE = $("#PWMDL_NAME").attr("code"); //供电方式
    var INPFMDL_CODE = $("#INPFMDL_NAME").attr("code"); //电源引入方式1
    var INPSMDL_CODE = $("#INPSMDL_NAME").attr("code"); //电源引入方式2
    var options = {
        url: "/Common/MOnePlaceData/RemoteHandlers/SubstationControl.ashx?action=Update&ID=" + _ID + "&SUBSTATION_NAME=" + SUBSTATION_NAME + "&SUBSTATION_CODE=" + SUBSTATION_CODE + "&LINE_NAME=" + LINE_NAME + "&BUREAU_NAME=" + BUREAU_NAME + "&POWER_SECTION_NAME=" + POWER_SECTION_NAME + "&WORKSHOP_NAME=" + WORKSHOP_NAME + "&ORG_NAME=" + ORG_NAME + "&PWMDL_CODE=" + PWMDL_CODE + "&INPFMDL_CODE=" + INPFMDL_CODE + "&INPSMDL_CODE=" + INPSMDL_CODE,
        type: 'POST',
        success: function (result) {
            if (result.sign == "True") {
                layer.msg("保存成功！");
                setTimeout(load_Query, 200);
            } else {
                layer.msg("保存失败！");
            }
        }
    };
    $('#form1').ajaxSubmit(options);
};

function GetValid() {
    return $("#form1").validationEngine("validate");
};

$("#form1").validationEngine({
    validationEventTriggers: "blur",  //触发的事件  "keyup blur",
    inlineValidation: true, //是否即时验证，false为提交表单时验证,默认true
    success: false, //为true时即使有不符合的也提交表单,false表示只有全部通过验证了才能提交表单,默认false
    promptPosition: "topLeft",//提示位置，topLeft, topRight, bottomLeft,  centerRight, bottomRight
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
                $("#SUBSTATION_NAME").val(result.SUBSTATION_NAME);    //所亭名称
                $("#SUBSTATION_CODE").val(result.SUBSTATION_CODE);    //所亭编码
                $("#LINE_CODE").val(result.LINE_CODE);     //线路
                $("#DIRECTION").val(result.DIRECTION);    //行别
                $("#KM_MARK").val(result.KM_MARK);      //公里标

                $('#BUREAU_CODE').mySelect({ //局
                    tag: 'ORGANIZATION',
                    async: false,
                    type: 'J',
                    defaultText: '全部'
                });
                $("#BUREAU_CODE").val(result.BUREAU_CODE);      //铁路局

                $('#POWER_SECTION_CODE').mySelect({ //段
                    tag: 'ORGANIZATION',
                    code: result.BUREAU_CODE,
                    async: false,
                    type: 'GDD',
                    defaultText: '全部'
                });
                $("#POWER_SECTION_CODE").val(result.POWER_SECTION_CODE);    //供电段

                $('#WORKSHOP_CODE').mySelect({ //车间
                    tag: 'ORGANIZATION',
                    code: result.POWER_SECTION_CODE,
                    async: false,
                    type: 'CJ',
                    defaultText: '全部'
                });
                $("#WORKSHOP_CODE").val(result.WORKSHOP_CODE);      //所属车间

                $('#ORG_CODE').mySelect({ //工区
                    tag: 'ORGANIZATION',
                    async: false,
                    code: result.WORKSHOP_CODE,
                    defaultText: '全部'
                });
                $("#ORG_CODE").val(result.ORG_CODE);           //所属班组


                $("#PWMDL_NAME").val(result.PWMDL_NAME);                 //供电方式
                $("#PWMDL_NAME").attr("code", result.PWMDL_CODE);         //供电方式
                $("#START_PWRNG").val(result.START_PWRNG);     //供电范围
                $("#END_PWRNG").val(result.END_PWRNG);         //供电范围
                $("#GIS_LON_O").val(result.GIS_LON_O);             //经度
                $("#GIS_LAT_O").val(result.GIS_LAT_O);             //纬度
                $("#NATURE").val(result.NATURE);               //性质
                $("#BSDESC").val(unescape(result.BSDESC));               //基本概况
                $("#NOTE").val(result.NOTE);                  //其他
                $("#TAREA").val(result.TAREA);  //占地总面积
                $("#BTEARA").val(result.BTEARA);  //房屋建筑总面积
                $("#PBEARA").val(result.PBEARA); //生产房屋面积
                $("#RMNUM").val(result.RMNUM);  //房间数量
                $("#FSHD").val(result.FSHD);    //竣工时间
                $("#NTKM").val(result.NTKM);    //换算接触网条公里
                $("#DVNUM").val(result.DVNUM);   //所设备数量汇总
                $("#RNNO").val(result.RNNO);     //运行编号
                $("#RNNM").val(result.RNNM);     //运行名称
                $("#INSDATE").val(result.INSDATE);   //安装日期
                $("#OPTDATE").val(result.OPTDATE);   //投运日期
                $("#OPTSTS").val(result.OPTSTS);     //运行状态
                $("#SUEQ").val(result.SUEQ);   //自用电量
                $("#RECQ").val(result.RECQ);   //受电量
                $("#SPEQ").val(result.SPEQ);    //供电量
                $("#TREQ").val(result.TREQ);    //牵引供电量
                $("#NTREQ").val(result.NTREQ);  //非牵引供电量
                $("#RVTG").val(result.RVTG);    //受电电压
                $("#VTGDGR").val(result.VTGDGR);   //电压等级
                $("#INPFNM").val(result.INPFNM);   //进线电源名称
                $("#INPFPNM").val(result.INPFPNM);     //上级变电站名称
                $("#INPFPCD").val(result.INPFPCD);   //上级变电站编码
                $("#INPFMDL_NAME").val(result.INPFMDL_NAME);   //电源引入方式
                $("#INPFMDL_NAME").attr("code",result.INPFMDL_CODE);   //电源引入方式
                $("#INPFLEN").val(result.INPFLEN);    //电源长度
                $("#INPSNM").val(result.INPSNM);    //进线电源名称
                $("#INPSPNM").val(result.INPSPNM);  //上级变电站名称
                $("#INPSPCD").val(result.INPSPCD);    //上级变电站编码
                $("#INPSMDL_NAME").val(result.INPSMDL_NAME);    //电源引入方式
                $("#INPSMDL_NAME").attr("code", result.INPSMDL_CODE);   //电源引入方式
                $("#INPSLEN").val(result.INPSLEN);    //电源长度
                $("#FDFNM").val(result.FDFNM);     //馈线一名称
                $("#FDFNO").val(result.FDFNO);    //馈线一编号
                $("#FDSNM").val(result.FDSNM);    //馈线二名称
                $("#FDSNO").val(result.FDSNO);    //馈线二编号
                $("#FDSDNM").val(result.FDSDNM);   //馈线三名称
                $("#FDSDNO").val(result.FDSDNO);   //馈线三编号
                $("#FDTHNM").val(result.FDTHNM);   //馈线四名称
                $("#FDTHNO").val(result.FDTHNO);   //馈线四编号
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
                                <img class="Place_Run_Edit" width="16" height="16" src="img/edit_mouseover.png" title="编辑" />\
                                <img class="Place_Run_Del" width="16" height="16" src="img/delete_mouseout.png" title="删除" />\
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
                                <input type="text" id="Place_Run_Name" value="' + _JSON.data[_index].SPFDNM + '" />\
                            </span>\
                            <span>\
                                <label>编号:</label>\
                                <input type="text" id="Place_Run_Code" value="' + _JSON.data[_index].SPFD + '" />\
                            </span>\
                        </div>\
                        <div class="row-fluid">\
                            <button type="button" id="Place_Run_save" class="btn btn-primary" onclick=PlaceRunSave("' + _JSON.data[_index].SPFD_ID + '")>保&nbsp;&nbsp;存</button>\
                            <button type="button" id="Place_Run_cancel" class="btn btn-primary" onclick="ClosePlaceRun(this);">取&nbsp;&nbsp;消</button>\
                        </div>\
                    </div>'

                    $(this).parent(".div_li").after(html);
                    $(this).parent(".div_li").css("border-bottom", "1px solid #ccc");
                });

                //删除备用馈线
                $(".Place_Run_Del").click(function () {
                    $(this).parents(".Place_Run_wrapper").find(".Place_Run_container").remove();
                    $(this).parents(".div_li").css("border-bottom", "none");
                    var _index = $(this).parent(".div_li").index();

                    PlaceRunCancel(_JSON.data[_index].SPFD_ID);
                })


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
                                <img class="Place_Quality_Edit" width="16" height="16" src="img/edit_mouseover.png" title="编辑" />\
                                <img class="Place_Quality_Del" width="16" height="16" src="img/delete_mouseout.png" title="删除" />\
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
                                <input type="text" id="Place_Quality_Date" class="Wdate" value="' + _JSON.data[_index].APPRS_DATE + '" />\
                            </span>\
                            <span>\
                                <label>鉴定结果:</label>\
                                <input type="text" id="Place_Quality_Result" value="' + _JSON.data[_index].APPRS_RST + '" />\
                            </span>\
                            <span>\
                                <label>鉴定等级:</label>\
                                <input type="text" id="Place_Quality_Grade" value="' + _JSON.data[_index].APPRS_DGR_NAME + '" code="' + _JSON.data[_index].APPRS_DGR_CODE + '" />\
                            </span>\
                            <span>\
                                <label>主要缺陷:</label>\
                                <input type="text" id="Place_Quality_Defect" value="' + _JSON.data[_index].APPRS_DFT + '" />\
                            </span>\
                            <span>\
                                <label>内容:</label>\
                                <textarea id="Place_Quality_cont"></textarea>\
                            </span>\
                        </div>\
                        <div class="row-fluid">\
                            <button type="button" id="Place_Quality_save" class="btn btn-primary" onclick=PlaceQualitySave("' + _JSON.data[_index].APPRS_ID + '")>保&nbsp;&nbsp;存</button>\
                            <button type="button" id="Place_Quality_cancel" class="btn btn-primary" onclick="ClosePlaceQuality(this);">取&nbsp;&nbsp;消</button>\
                        </div>\
                    </div>'

                    $(this).parent(".div_li").after(html);
                    $(this).parent(".div_li").css("border-bottom", "1px solid #ccc");

                    $("#Place_Quality_cont").val(unescape(_JSON.data[_index].APPRS_CXT));

                    //鉴定等级
                    $("#Place_Quality_Grade").mySelectTree({
                        tag: 'SYSDICTIONARYTREE',
                        codeType: 'DPC',
                        p_code: "AUTH_LV",
                        cateGory: 'SUBSTARC',
                        enableFilter: false,
                        onClick: function (event, treeId, treeNode) {
                            $("#Place_Quality_Grade").attr('code', treeNode.id).val(treeNode.name);
                        }
                    });
                    //日期插件
                    $("#Place_Quality_Date").click(function () {
                        WdatePicker({ dateFmt: "yyyy-MM-dd", isShowToday: false });
                    });
                });

                //删除鉴定数据
                $(".Place_Quality_Del").click(function () {
                    $(this).parents(".Place_Quality_wrapper").find(".Place_Quality_container").remove();
                    $(this).parents(".div_li").css("border-bottom", "none");
                    var _index = $(this).parent(".div_li").index();

                    PlaceQualityCancel(_JSON.data[_index].APPRS_ID);
                })

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
                                <img class="Place_Note_Edit" width="16" height="16" src="img/edit_mouseover.png" title="编辑" />\
                                <img class="Place_Note_Del" width="16" height="16" src="img/delete_mouseout.png" title="删除" />\
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
                                <input type="text" id="Place_Note_Date" class="Wdate" value="' + _JSON.data[_index].NTHDT + '" />\
                            </span>\
                            <span>\
                                <label>标题:</label>\
                                <input type="text" id="Place_Note_Title" value="' + _JSON.data[_index].NTTL + '" />\
                            </span>\
                            <span>\
                                <label>填写人:</label>\
                                <input type="text" id="Place_Note_Person" value="' + _JSON.data[_index].NTFP + '" />\
                            </span>\
                            <span>\
                                <label>填写日期:</label>\
                                <input type="text" id="Place_Note_Time" class="Wdate" value="' + _JSON.data[_index].NTFD + '" />\
                            </span>\
                            <span>\
                                <label>内容:</label>\
                                <textarea id="Place_Note_cont"></textarea>\
                            </span>\
                        </div>\
                        <div class="row-fluid">\
                            <button type="button" id="Place_Note_save" class="btn btn-primary" onclick=PlaceNoteSave("' + _JSON.data[_index].NOTE_ID + '")>保&nbsp;&nbsp;存</button>\
                            <button type="button" id="Place_Note_cancel" class="btn btn-primary" onclick="ClosePlaceNote(this);">取&nbsp;&nbsp;消</button>\
                        </div>\
                    </div>'

                    $(this).parent(".div_li").after(html);
                    $(this).parent(".div_li").css("border-bottom", "1px solid #ccc");

                    $("#Place_Note_cont").val(unescape(_JSON.data[_index].NTCNT));

                    //日期插件
                    $("#Place_Note_Date").click(function () {
                        WdatePicker({ dateFmt: "yyyy-MM-dd", isShowToday: false });
                    });
                    $("#Place_Note_Time").click(function () {
                        WdatePicker({ dateFmt: "yyyy-MM-dd", isShowToday: false });
                    });
                });

                //删除纪事
                $(".Place_Note_Del").click(function () {
                    $(this).parents(".Place_Note_wrapper").find(".Place_Note_container").remove();
                    $(this).parents(".div_li").css("border-bottom", "none");
                    var _index = $(this).parent(".div_li").index();

                    PlaceNoteCancel(_JSON.data[_index].NOTE_ID);
                })

            } else {
                document.getElementById("Place_Note_Content").innerHTML = ""; //清空内容
            }
        }
    });
};
//备用馈线修改
function PlaceRunSave(id) {
    var SPFD_ID = id;  //主键
    var SUBST_ID = _SUBSTATION_CODE;
    var SPFDNM = $("#Place_Run_Name").val();//备用馈线名称
    var SPFD = $("#Place_Run_Code").val();//备用馈线编号

    var URL = '/Common/MOnePlaceData/RemoteHandlers/SUBST_RNDT_SPFDControl.ashx?action=Update'
            + '&SPFD_ID=' + SPFD_ID
            + '&SUBST_ID=' + SUBST_ID
            + '&SPFDNM=' + SPFDNM
            + '&SPFD=' + SPFD;

    $.ajax({
        type: 'POST',
        url: URL,
        async: true,
        cache: false,
        success: function (result) {
            if (result.sign == "True") {
                layer.msg("保存成功！");
                Run_doquery();
            } else {
                layer.msg("保存失败！");
            }
        }
    });
};

//备用馈线删除
function PlaceRunCancel(id) {
    ymPrompt.confirmInfo({
        message: '确认要删除信息吗?',
        handler: function (tp) {
            if (tp == 'ok') {
                var URL = '/Common/MOnePlaceData/RemoteHandlers/SUBST_RNDT_SPFDControl.ashx?action=Delete&SPFD_ID=' + id + '&SUBST_ID=' + _SUBSTATION_CODE;

                $.ajax({
                    type: 'POST',
                    url: URL,
                    async: true,
                    cache: false,
                    success: function (result) {
                        if (result.sign == "True") {
                            layer.msg("删除成功！");
                            Run_doquery();
                        } else {
                            layer.msg("删除失败！");
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

//取消备用馈线
function ClosePlaceRun(tag) {
    $(tag).parents(".content_wrapper").find(".div_li").css("border-bottom", "none");
    $(tag).parent().parent().remove();
};

//添加备用馈线
function AddPlaceRun(tag) {
    $(tag).parents(".Place_Run_wrapper").find(".Place_Run_container").remove();
    $(tag).parents(".content_wrapper").find(".div_li").css("border-bottom", "none");
    var html = '<div class="Place_Run_container">\
                        <div class="row-fluid">\
                            <span>\
                                <label>名称:</label>\
                                <input type="text" id="Place_Run_Name" value="" />\
                            </span>\
                            <span>\
                                <label>编号:</label>\
                                <input type="text" id="Place_Run_Code" value="" />\
                            </span>\
                        </div>\
                        <div class="row-fluid">\
                            <button type="button" id="Place_Run_save" class="btn btn-primary" onclick=PlaceRunAdd("")>保&nbsp;&nbsp;存</button>\
                            <button type="button" id="Place_Run_cancel" class="btn btn-primary" onclick="ClosePlaceRun(this);">取&nbsp;&nbsp;消</button>\
                        </div>\
                    </div>'

    $(tag).parent(".Place_Run_Add").after(html);
};

//添加备用馈线保存
function PlaceRunAdd() {
    var SUBST_ID = _SUBSTATION_CODE;
    var SPFDNM = $("#Place_Run_Name").val();//备用馈线名称
    var SPFD = $("#Place_Run_Code").val();//备用馈线编号

    var URL = '/Common/MOnePlaceData/RemoteHandlers/SUBST_RNDT_SPFDControl.ashx?action=Add'
            + '&SPFD_ID='
            + '&SUBST_ID=' + SUBST_ID
            + '&SPFDNM=' + SPFDNM
            + '&SPFD=' + SPFD;

    $.ajax({
        type: 'POST',
        url: URL,
        async: true,
        cache: false,
        success: function (result) {
            if (result.sign == "True") {
                layer.msg("保存成功！");
                Run_doquery();
                $("#Place_Run_cancel").click();
            } else {
                layer.msg("保存失败！");
            }
        }
    });
};

//质量鉴定数据修改
function PlaceQualitySave(id) {
    var APPRS_ID = id;  //主键
    var SUBST_ID = _SUBSTATION_CODE;
    var APPRS_DATE = $("#Place_Quality_Date").val();//鉴定日期
    var APPRS_RST = $("#Place_Quality_Result").val();//鉴定结果
    var APPRS_DGR_CODE = $("#Place_Quality_Grade").attr('code');//鉴定等级
    var APPRS_DFT = $("#Place_Quality_Defect").val();//主要缺陷
    var APPRS_CXT = $("#Place_Quality_cont").val();//鉴定内容

    var URL = '/Common/MOnePlaceData/RemoteHandlers/SUBST_APPRSControl.ashx?action=Update'
            + '&APPRS_ID=' + APPRS_ID
            + '&SUBST_ID=' + SUBST_ID
            + '&APPRS_DATE=' + APPRS_DATE
            + '&APPRS_RST=' + APPRS_RST
            + '&APPRS_DGR_CODE=' + APPRS_DGR_CODE
            + '&APPRS_DFT=' + APPRS_DFT
            + '&APPRS_CXT=' + escape(APPRS_CXT);

    $.ajax({
        type: 'POST',
        url: URL,
        async: true,
        cache: false,
        success: function (result) {
            if (result.sign == "True") {
                layer.msg("保存成功！");
                Quality_doquery();
            } else {
                layer.msg("保存失败！");
            }
        }
    });
};

//质量鉴定数据删除
function PlaceQualityCancel(id) {
    ymPrompt.confirmInfo({
        message: '确认要删除信息吗?',
        handler: function (tp) {
            if (tp == 'ok') {
                var URL = '/Common/MOnePlaceData/RemoteHandlers/SUBST_APPRSControl.ashx?action=Delete&APPRS_ID=' + id + '&SUBST_ID=' + _SUBSTATION_CODE;

                $.ajax({
                    type: 'POST',
                    url: URL,
                    async: true,
                    cache: false,
                    success: function (result) {
                        if (result.sign == "True") {
                            layer.msg("删除成功！");
                            Quality_doquery();
                        } else {
                            layer.msg("删除失败！");
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

//取消质量鉴定数据
function ClosePlaceQuality(tag) {
    $(tag).parents(".content_wrapper").find(".div_li").css("border-bottom", "none");
    $(tag).parent().parent().remove();
};

//添加质量鉴定数据
function AddPlaceQuality(tag) {

    $(tag).parents(".Place_Quality_wrapper").find(".Place_Quality_container").remove();
    $(tag).parents(".content_wrapper").find(".div_li").css("border-bottom", "none");
    var html = '<div class="Place_Quality_container">\
                    <div class="row-fluid">\
                        <span>\
                            <label>鉴定日期:</label>\
                            <input type="text" id="Place_Quality_Date" class="Wdate" value="" />\
                        </span>\
                        <span>\
                            <label>鉴定结果:</label>\
                            <input type="text" id="Place_Quality_Result" value="" />\
                        </span>\
                        <span>\
                            <label>鉴定等级:</label>\
                            <input type="text" id="Place_Quality_Grade" value="" />\
                        </span>\
                        <span>\
                            <label>主要缺陷:</label>\
                            <input type="text" id="Place_Quality_Defect" value="" />\
                        </span>\
                        <span>\
                            <label>内容:</label>\
                            <textarea id="Place_Quality_cont" value=""></textarea>\
                        </span>\
                    </div>\
                    <div class="row-fluid">\
                        <button type="button" id="Place_Quality_save" class="btn btn-primary" onclick=PlaceQualityAdd("")>保&nbsp;&nbsp;存</button>\
                        <button type="button" id="Place_Quality_cancel" class="btn btn-primary" onclick="ClosePlaceQuality(this);">取&nbsp;&nbsp;消</button>\
                    </div>\
                </div>'

    $(tag).parent(".Place_Quality_Add").after(html);
    //鉴定等级
    $("#Place_Quality_Grade").mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: 'DPC',
        p_code: "AUTH_LV",
        cateGory: 'SUBSTARC',
        enableFilter: false,
        onClick: function (event, treeId, treeNode) {
            $("#Place_Quality_Grade").attr('code', treeNode.id).val(treeNode.name);
        }
    });
    //日期插件
    $("#Place_Quality_Date").click(function () {
        WdatePicker({ dateFmt: "yyyy-MM-dd", isShowToday: false });
    });
};

//添加质量鉴定数据保存

function PlaceQualityAdd() {
    var SUBST_ID = _SUBSTATION_CODE;
    var APPRS_DATE = $("#Place_Quality_Date").val();//鉴定日期
    var APPRS_RST = $("#Place_Quality_Result").val();//鉴定结果
    var APPRS_DGR_CODE = $("#Place_Quality_Grade").attr('code');//鉴定等级
    var APPRS_DFT = $("#Place_Quality_Defect").val();//主要缺陷
    var APPRS_CXT = $("#Place_Quality_cont").val();//鉴定内容

    var URL = '/Common/MOnePlaceData/RemoteHandlers/SUBST_APPRSControl.ashx?action=Add'
            + '&APPRS_ID='
            + '&SUBST_ID=' + SUBST_ID
            + '&APPRS_DATE=' + APPRS_DATE
            + '&APPRS_RST=' + APPRS_RST
            + '&APPRS_DGR_CODE=' + APPRS_DGR_CODE
            + '&APPRS_DFT=' + APPRS_DFT
            + '&APPRS_CXT=' + escape(APPRS_CXT);

    $.ajax({
        type: 'POST',
        url: URL,
        async: true,
        cache: false,
        success: function (result) {
            if (result.sign == "True") {
                layer.msg("保存成功！");
                Quality_doquery();
                $("#Place_Quality_cancel").click();
            } else {
                layer.msg("保存失败！");
            }
        }
    });
};

//记事修改
function PlaceNoteSave(id) {
    var NOTE_ID = id;  //主键
    var SUBST_ID = _SUBSTATION_CODE;
    var NTTL = $("#Place_Note_Title").val();//标题
    var NTCNT = $("#Place_Note_cont").val();//内容
    var NTFP = $("#Place_Note_Person").val();//填写人
    var NTFD = $("#Place_Note_Time").val();//填写日期
    var NTHDT = $("#Place_Note_Date").val();//记事发生日期

    var URL = '/Common/MOnePlaceData/RemoteHandlers/SUBST_NOTEControl.ashx?action=Update'
            + '&NOTE_ID=' + NOTE_ID
            + '&SUBST_ID=' + SUBST_ID
            + '&NTTL=' + NTTL
            + '&NTCNT=' + escape(NTCNT)
            + '&NTFP=' + NTFP
            + '&NTFD=' + NTFD
            + '&NTHDT=' + NTHDT;

    $.ajax({
        type: 'POST',
        url: URL,
        async: true,
        cache: false,
        success: function (result) {
            if (result.sign == "True") {
                layer.msg("保存成功！");
                Note_doquery();
            } else {
                layer.msg("保存失败！");
            }
        }
    });
};

//记事删除
function PlaceNoteCancel(id) {
    ymPrompt.confirmInfo({
        message: '确认要删除信息吗?',
        handler: function (tp) {
            if (tp == 'ok') {
                var URL = '/Common/MOnePlaceData/RemoteHandlers/SUBST_NOTEControl.ashx?action=Delete&NOTE_ID=' + id + '&SUBST_ID=' + _SUBSTATION_CODE;

                $.ajax({
                    type: 'POST',
                    url: URL,
                    async: true,
                    cache: false,
                    success: function (result) {
                        if (result.sign == "True") {
                            layer.msg("删除成功！");
                            Note_doquery();
                        } else {
                            layer.msg("删除失败！");
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

//取消记事
function ClosePlaceNote(tag) {
    $(tag).parents(".content_wrapper").find(".div_li").css("border-bottom", "none");
    $(tag).parent().parent().remove();
};

//添加记事
function AddPlaceNote(tag) {
    $(tag).parents(".Place_Note_wrapper").find(".Place_Note_container").remove();
    $(tag).parents(".content_wrapper").find(".div_li").css("border-bottom", "none");
    var html = '<div class="Place_Note_container">\
                        <div class="row-fluid">\
                            <span>\
                                <label>发生日期:</label>\
                                <input type="text" id="Place_Note_Date" class="Wdate" value="" />\
                            </span>\
                            <span>\
                                <label>标题:</label>\
                                <input type="text" id="Place_Note_Title" value="" />\
                            </span>\
                            <span>\
                                <label>填写人:</label>\
                                <input type="text" id="Place_Note_Person" value="' + _Json.PersonName + '" />\
                            </span>\
                            <span>\
                                <label>填写日期:</label>\
                                <input type="text" id="Place_Note_Time" class="Wdate" value="" />\
                            </span>\
                            <span>\
                                <label>内容:</label>\
                                <textarea id="Place_Note_cont" value="" ></textarea>\
                            </span>\
                        </div>\
                        <div class="row-fluid">\
                            <button type="button" id="Place_Note_save" class="btn btn-primary" onclick=PlaceNoteAdd("")>保&nbsp;&nbsp;存</button>\
                            <button type="button" id="Place_Note_cancel" class="btn btn-primary" onclick="ClosePlaceNote(this);">取&nbsp;&nbsp;消</button>\
                        </div>\
                    </div>'

    $(tag).parent(".Place_Note_Add").after(html);

    //日期插件
    $("#Place_Note_Date").click(function () {
        WdatePicker({ dateFmt: "yyyy-MM-dd", isShowToday: false });
    });
    $("#Place_Note_Time").click(function () {
        WdatePicker({ dateFmt: "yyyy-MM-dd", isShowToday: false });
    });
};

//添加记事保存

function PlaceNoteAdd() {
    var SUBST_ID = _SUBSTATION_CODE;
    var NTTL = $("#Place_Note_Title").val();//标题
    var NTCNT = $("#Place_Note_cont").val();//内容
    var NTFP = $("#Place_Note_Person").val();//填写人
    var NTFD = $("#Place_Note_Time").val();//填写日期
    var NTHDT = $("#Place_Note_Date").val();//记事发生日期

    var URL = '/Common/MOnePlaceData/RemoteHandlers/SUBST_NOTEControl.ashx?action=Add'
            + '&NOTE_ID='
            + '&SUBST_ID=' + SUBST_ID
            + '&NTTL=' + NTTL
            + '&NTCNT=' + escape(NTCNT)
            + '&NTFP=' + NTFP
            + '&NTFD=' + NTFD
            + '&NTHDT=' + NTHDT;

    $.ajax({
        type: 'POST',
        url: URL,
        async: true,
        cache: false,
        success: function (result) {
            if (result.sign == "True") {
                layer.msg("保存成功！");
                Note_doquery();
                $("#Place_Note_cancel").click();
            } else {
                layer.msg("保存失败！");
            }
        }
    });
};

//局改变
function juChange(value, text) {
    $('#POWER_SECTION_CODE').mySelect({
        tag: 'ORGANIZATION',
        type: 'GDD',
        code: value,
        defaultText: '全部'
    });
};
//段改变
function duanChange(value, text) {
    $('#WORKSHOP_CODE').mySelect({
        tag: 'ORGANIZATION',
        type: 'CJ',
        code: value,
        defaultText: '全部'
    });
};
//车间改变
function chejianChange(value, text) {
    $('#ORG_CODE').mySelect({
        tag: 'ORGANIZATION',
        code: value,
        defaultText: '全部'
    });
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