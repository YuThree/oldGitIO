/**
 * Created by LEE on 2016/7/27.
 */

var nowPage = 1;//当前页
var pageSize = 5000;//页大小
var sumPage = 0;//总页数
var judgeAnswer = false;//验证结果
var xianluqujianReallyLongName = [];//线路区间全称
var map = new BMap.Map("map", { mapType: BMAP_HYBRID_MAP });                        // 创建Map实例
map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
map.centerAndZoom(new BMap.Point(104.071216, 29.570997), 7);     // 初始化地图,设置中心点坐标和地图级别
map.enableScrollWheelZoom();                        //启用滚轮放大缩小
//    var points = [];  // 添加海量点数据
var pointsGreen = [];
var pointsYellow = [];
var pointsDeepYellow = [];
var pointsRed = [];
var animateMarker = null; //弹出框新样式
var colorNumber = 0; //颜色初始化
//    for (var i = 0; i < data.data.length; i++) {
//        points.push(new BMap.Point(data.data[i][0], data.data[i][1]));
//        if (i > 500) {//判断点数量改变颜色
//            colorNumber = 1;
//            if (i > 5000) {
//                colorNumber = 2;
//            }
//        }
//    }
var pointColor = [
    {
        "Color": "#6CF075"
    },
    {
        "Color": "#EAFF00"
    },
    {
        "Color": "#fc7101"
    },
    {
        "Color": "#FF0600"
    }
] // 标记点色彩集
var optionsGreen = {
    size: 4,
    shape: BMAP_POINT_SHAPE_CIRCLE,
    color: pointColor[0].Color
}
var optionsYellow = {
    size: 3,
    shape: BMAP_POINT_SHAPE_CIRCLE,
    color: pointColor[1].Color
}
var optionsDeepYellow = {
    size: 3,
    shape: BMAP_POINT_SHAPE_CIRCLE,
    color: pointColor[2].Color
}
var optionsRed = {
    size: 3,
    shape: BMAP_POINT_SHAPE_CIRCLE,
    color: pointColor[3].Color
}

function qingkongMap() {
    pointsGreen = [];
    pointsYellow = [];
    pointsDeepYellow = [];
    pointsRed = [];
    map.clearOverlays();
}
function mapRefash() {


    var pointCollection = new BMap.PointCollection(pointsGreen, optionsGreen);  // 初始化PointCollection
    var pointCollection2 = new BMap.PointCollection(pointsYellow, optionsYellow);  // 初始化PointCollection
    var pointCollection3 = new BMap.PointCollection(pointsDeepYellow, optionsDeepYellow);  // 初始化PointCollection
    var pointCollection4 = new BMap.PointCollection(pointsRed, optionsRed);  // 初始化PointCollection


    pointCollection.addEventListener('click', getPoleClick); // 监听点击事件
    pointCollection2.addEventListener('click', getPoleClick);
    pointCollection3.addEventListener('click', getPoleClick);
    pointCollection4.addEventListener('click', getPoleClick);

    map.addOverlay(pointCollection);  // 添加Overlay
    map.addOverlay(pointCollection2);
    map.addOverlay(pointCollection3);
    map.addOverlay(pointCollection4);
}
var oldp = null;
function getPoleClick(e) {
    var _json = e.point.json;

    setPoleClick(e.point, _json.ID);
};

function setPoleClick(m, ID) {
    if (m) {
        var html = SetHtml(m.json); //SetHtml.js 中
        if (animateMarker == null) {
            animateMarker = new AnimateMarker(m, html);
            animateMarker.type = "animateMarker";
            map.addOverlay(animateMarker);
        }
        else {
            animateMarker.setPointAndText(m, html);
        }


    } else {
        var re = '';
        var overlays = map.getOverlays();
        for (var i = 0; i < overlays.length; i++) {
            if (overlays[i].da) {
                var p = overlays[i].da.ha;
                for (var y = 0; y < p.length; y++) {
                    var m = p[y];
                    if (m.json.ID == ID) {
                        map.setCenter(m);

                        var html = SetHtml(m.json); //SetHtml.js 中
                        if (animateMarker == null) {
                            animateMarker = new AnimateMarker(m, html);
                            animateMarker.type = "animateMarker";
                            map.addOverlay(animateMarker);
                        }
                        else {
                            animateMarker.setPointAndText(m, html);
                        }
                    }
                }
            }
            else if (overlays[i].ea && overlays[i].ea.ia.length > 0) {
                var p = overlays[i].ea.ia;
                for (var y = 0; y < p.length; y++) {
                    var m = p[y];
                    if (m.json.ID == ID) {
                        map.setCenter(m);

                        var html = SetHtml(m.json); //SetHtml.js 中
                        if (animateMarker == null) {
                            animateMarker = new AnimateMarker(m, html);
                            animateMarker.type = "animateMarker";
                            map.addOverlay(animateMarker);
                        }
                        else {
                            animateMarker.setPointAndText(m, html);
                        }
                    }
                }
            }
        }
    }
    $('.cxListBodyBox>div').removeClass('alarmItem_over');
    $('.cxListBody[id="' + ID + '"]').addClass('alarmItem_over');
    SetTop(ID);
};


///设置滚动条
function SetTop(_alarmID) {
    $(".cxListBodyBox").animate({ scrollTop: document.getElementById(_alarmID).offsetTop - 200 }, 500);
}


//删除自定义样式弹出框
function ClearAnimateMarker() {
    map.removeOverlay(animateMarker);
    animateMarker = null;
}

function hidediv() {
    //$("#boxChaXun").css({"height": "290px"});
    $("#cxFenYe,.cxListTitle").hide();
    $("#backToMin img").attr("src", "img/nextpage.png");
    $('#chaXun').css('padding', '0 0 35px')
    $(".cxJgList").css('padding', 0).animate({ "height": "0" })
};

function showdiv() {
    $(".cxJgList").css('padding', ' 30px 0 0').animate({ "height": "100%" })

    //$("#boxChaXun").animate({ "height": "90%" });
    $("#cxFenYe,.cxListTitle").show();
    $("#backToMin img").attr("src", "img/prepage.png");
    $('#chaXun').css('padding', '0 0 80px')

};

$(document).ready(function () {
    $('#start_time').val(AddMonths(now, -3).format("yyyy-MM-dd"))//开始时间默认值
    $('#end_time').val(datehhmm00NowStr(''))//结束时间

    var category = GetQueryString('category')//获取打开位置
    if (category != '3C') {
        $('#closeBtn').hide();//关闭按钮影藏
    } else {
        $('.anchorTR').css('right', '100px')
    }

    $('#xianLuQuJian').mySelectTree({//线路区间
        tag: 'BRIDGETUNE',
        height: 250,
        enableFilter: true,
        // isDefClick:true,
        //  onClick: function (event, treeId, treeNode) {
        //      alert(treeNode.name);
        //  }
    });

    $('#ZuZhiJiGou').mySelectTree({//组织机构
        tag: 'ORGANIZATION',
        //  type: jsonUser.orgcode,
        enableFilter: true
        //          onClick: function (event, treeId, treeNode) {
        //                $("#hf_ddlorg").val(treeNode.id);
        //                $("#ddlorg").val(treeNode.name);
        //                $("#hf_type_ddlorg").val(treeNode.treeType);
        //          }
    });
    $('#direction').mySelectTree({
        tag: 'Get_Drection',
        height: 240,
        width: 128,
        enableFilter: false,
        onClick: function (event, treeId, treeNode) {
            $('#direction').val(treeNode.name).attr({ "code": treeNode.id });
        }
    });
    //绑定检测类型
    $("#dll_lx").mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: 'DPC',
        p_code: "DET_TYPE",
        cateGory: 'DET_TYPE',
        enableFilter: false,
        onClick: function (event, treeId, treeNode) {
            $("#dll_lx").attr('code', treeNode.id).val(treeNode.name);
        }
    });

    $("#ddlzt").multiselect({
        noneSelectedText: "全部",
        checkAllText: "全选",
        uncheckAllText: '全不选',
        selectedList: 6,
        height: 200
    });

    var jbJson = GetSeverityJson();//获取级别
    var jsHtml = "";
    for (var i = 0; i < jbJson.length; i++) {
        jsHtml += "<option value='" + jbJson[i].code + "'>" + jbJson[i].name + "</option>";
    }
    $("#jb").html(jsHtml);
    $("#jb").multiselect({
        noneSelectedText: "全部",
        checkAllText: "全选",
        uncheckAllText: '全不选',
        height: 100,
        selectedList: 3
    });

    $("a[name='ztree']").css('top', '5px')
    if (category != '' && category != 'DPC' && category != undefined) {
        $('#dll_lx').val(category).attr("disabled", "disabled")//选中检测类型
        $('#dll_lx').siblings('a').hide();
    }

    hidediv();
    $('.cxListBodyBox').css('max-height', ($(window).height() - 540) > 390 ? 390 : ($(window).height() - 540))//设置查询结果的高度
    $("#backToMin").click(function () {// 收缩函数
        if ($(".cxListTitle").css("display") == "block") {
            hidediv()
        } else { showdiv() }
    })

    //表单提示
    $('#startkm').focus(function () {
        layer.tips('请输入7位以内整数', '#startkm', { tips: [3, 'green'], tipsMore: true, time: 800 });
    })
    $('#endkm').focus(function () {
        layer.tips('请输入7位以内整数', '#endkm', { tips: [3, 'green'], tipsMore: true, time: 800 });
    })
    $('#txtpole').focus(function () {
        layer.tips('请输入正确的杆号', '#txtpole', { tips: [1, 'green'], tipsMore: true, time: 800 });
    })
    $('#startN').focus(function () {
        layer.tips('请输入自然数', '#startN', { tips: [4, 'green'], tipsMore: true, time: 800 });
    })
    $('#endN').focus(function () {
        layer.tips('请输入自然数', '#endN', { tips: [2, 'green'], tipsMore: true, time: 800 });
    })

    //表单验证
    $("#yiganyidangForm").validationEngine({
        validationEventTriggers: "blur",  //触发的事件  "keyup blur",   
        inlineValidation: true, //是否即时验证，false为提交表单时验证,默认true   
        success: false, //为true时即使有不符合的也提交表单,false表示只有全部通过验证了才能提交表单,默认false
        promptPosition: "topLeft" //提示位置，topLeft, topRight, bottomLeft,  centerRight, bottomRight
        //        validateNonVisibleFields: true
    });
    $("input").blur(makeJudge);
    $('.cxBtn').click(function () {
        if ($('#yiganyidangForm').validationEngine("validate")) {
            makeJudge();
            if (judgeAnswer) {
                btnCX();
            }

        }
    });
})



function yemianTiaozhuan(whoisClick) {
    switch (whoisClick) {
        case 'first':
            if (nowPage == 1) {
                layer.msg('已经到头了！')
                return false
            }
            nowPage = 1;
            break;
        case 'less':
            if (nowPage == 1) {
                layer.msg('已经到头了！')
                return false
            }
            nowPage -= 1;
            break;
        case 'next':
            if (nowPage == sumPage) {
                layer.msg('已经到底了！')
                return false
            }
            nowPage += 1;
            break;
        case 'end':
            if (nowPage == sumPage) {
                layer.msg('已经到底了！')
                return false
            }

            nowPage = sumPage;
            break;
    }
    if (nowPage > sumPage) {
        nowPage = sumPage;
    }
    if (nowPage < 1) {
        nowPage = 1;
    }
    doquery(nowPage);
}

//验证大小判断
function makeJudge() {
    if ($('#yiganyidangForm').validationEngine("validate")) {
        if ($('#startkm').val() != '' && $('#endkm').val() != '') {
            if (parseInt($('#startkm').val()) > parseInt($('#endkm').val())) {
                layer.tips('请输入更大的数', '#endkm', { tips: [1, '#3595CC'] });
                judgeAnswer = false
            } else {
                Dojudge()
            }
        } else {
            Dojudge()
        }
    }
}
function Dojudge() {
    if ($('#startN').val() != '' && $('#endN').val() != '') {
        if (parseInt($('#startN').val()) > parseInt($('#endN').val())) {
            layer.tips('请输入更大的数', '#endN', { tips: [1, '#3595CC'] });
            judgeAnswer = false
        } else {
            judgeAnswer = true
        }
    } else {
        judgeAnswer = true
    }
}



//查询按钮事件
function btnCX() {
    doquery(1);
    showdiv();
}

function doquery(nowPage) {

    var ii = layer.load(1, {
        shade: [0.8, '#000'] //0.1透明度的白色背景
    });
    var treeObj = $.fn.zTree.getZTreeObj("ULxianLuQuJian");
    var node = treeObj.getSelectedNodes()[0];
    var node_line = null;
    var node_position = null;
    if ($("#xianLuQuJian").val() != "") {
        switch (node.treeType) {
            case "LINE":
                $('.cxListXLQJ').css("display", "none")
                break;
            case "POSITION":
                node_line = node.getParentNode();

                $('.cxListXLQJ').css("display", "block");
                $('#xianlu').html(node_line.name);
                $('#xianluName').css({ "display": "inline" });
                $('#qujian').html('')
                $('#quName').css({ "display": "none" });

                break;
            case "BRIDGETUNE":
                node_line = node.getParentNode();
                node_position = node_line.getParentNode();



                $('.cxListXLQJ').css("display", "block");
                $('#xianlu').html(node_position.name);
                $('#xianluName').css({ "display": "inline" });
                $('#qujian').html(node_line.name)
                $('#quName').css({ "display": "inline" });
                break;
        }
        //if (node_position != null) {
        //    //layer.alert("线："+node_line.name +"区："+ node_position.name);
        //    $('.cxListXLQJ').css("display", "block")
        //    if (node_line != null) {
        //        //layer.alert("线："+node_line.name);

        //        $('#xianlu').html(node_line.name);
        //        $('#xianluName').css({ "display": "inline" });
        //        $('#qujian').html(node_position.name)
        //        $('#quName').css({ "display": "inline" });
        //    } else {
        //        $('#xianlu').html("");
        //        $('#xianluName').css({ "display": "none" });
        //        $('#qujian').html(node_position.name)
        //        $('#quName').css({ "display": "inline" });
        //    }
        //}  else {
        //    $('.cxListXLQJ').css("display", "none")
        //}

    } else {
        $('.cxListXLQJ').css("display", "none")
    }



    xianluqujianReallyLongName = [];
    qingkongMap();
    var linecode = '';
    var LPB_code = $('#xianLuQuJian').attr('code');
    var LPB_type = $('#xianLuQuJian').attr('treetype');
    var dirct = "";
    if ($('#direction').val() != '') {
        dirct = escape($('#direction').attr('code'))
    }
    ;
    var kmStart = $('#startkm').val();
    var kmEnd = $('#endkm').val();
    var txtPole = $('#txtpole').val();
    var org_code = $('#ZuZhiJiGou').attr('code');
    var org_type = $('#ZuZhiJiGou').attr('treetype');
    var xianluqujianLongName = "";
    var stringOFxljname = "";
    var stringOFdirectname = "";
    if (LPB_code == undefined) {
        LPB_code = ""
    }
    ;
    if (LPB_type == undefined) {
        LPB_type = ""
    }
    ;
    if (org_code == undefined) {
        org_code = ""
    }
    ;
    if (org_type == undefined) {
        org_type = ""
    }
    ;
    var QueXianNumberStart = $('#startN').val();
    var QueXianNumberEnd = $('#endN').val();
    var start_time = $('#start_time').val()//开始时间
    var end_time = $('#end_time').val()//结束时间
    var category_code = $('#dll_lx').val()//检测类型
    var obj = document.getElementById('ddlzt');//報警狀態
    var zt = getSelectedItem(obj);
    var jbobj = document.getElementById('jb');//級別
    var jb = getSelectedItem(jbobj);
    if (getConfig('debug') != '1' && jb == '') {
        jb = '一类,二类';
    }
    $.ajax(
        {
            url: "/Common/MOnePoleData/RemoteHandlers/MyDeviceList.ashx?LPB_Code=" + LPB_code + "&LPB_Type=" + LPB_type + "&direction=" + dirct + "&startKM=" + kmStart + "&endKM=" + kmEnd + "&poleNO=" + escape(txtPole) + "&org_code=" + org_code + "&startFault=" + QueXianNumberStart + "&endFault=" + QueXianNumberEnd + "&pageIndex=" + nowPage + "&pageSize=" + pageSize + "&action=getList" + "&start_time=" + start_time + "&end_time=" + end_time + "&category_code=" + category_code + "&zt=" + zt + "&jb=" + escape(jb),
            async: true,
            success: function (re_json) {
                if (re_json != '') {
                    //var re_json = eval('(' + re + ')');
                    //var re_json=re
                    var img = [];
                    $('#nowPage').html(re_json.pageOfTotal);
                    $('#pageRange').html(re_json.pageRange);
                    $('#sumPage').html(re_json.TOTAL_ROWS);

                    var _html = '';
                    if (re_json.data.length < 1) {
                        var a = layer.msg('没有数据');
                    }
                    for (var i = 0; i < re_json.data.length; i++) {
                        switch (re_json.data[i].POLE_DIRECTION) {
                            case "上行":
                                img[i] = '<img src="img/上行.png" alt=""/>';
                                break;
                            case "下行":
                                img[i] = '<img src="img/下行.png" alt="" style="position: relative; left: -3px"/>';
                                break;
                            case "":
                                img[i] = "&nbsp;"
                                break;
                            default:
                                if (re_json.data[i].POLE_DIRECTION.length > 2) {
                                    stringOFdirectname = re_json.data[i].POLE_DIRECTION
                                    img[i] = stringOFdirectname.substring(0, 2) + '…'
                                } else {
                                    img[i] = re_json.data[i].POLE_DIRECTION;
                                }
                        }
                        if (re_json.data[i].LINE_NAME == "" || re_json.data[i].LINE_NAME == undefined) {
                            re_json.data[i].LINE_NAME = "&nbsp;"
                        }
                        if (re_json.data[i].KMSTANDARD == "" || re_json.data[i].KMSTANDARD == undefined) {
                            re_json.data[i].KMSTANDARD = "&nbsp;";
                        }
                        if (re_json.data[i].POLE_NO == "" || re_json.data[i].POLE_NO == undefined) {
                            re_json.data[i].POLE_NO = "&nbsp;"
                        }
                        if (re_json.data[i].FAULT_CNT == "" || re_json.data[i].FAULT_CNT == undefined) {
                            re_json.data[i].FAULT_CNT = "&nbsp;"
                        }

                        if (re_json.data[i].FAULT_CNT == 0) {//根据不同缺陷数放入不同数组

                            var p = new BMap.Point(re_json.data[i].GIS_LON, re_json.data[i].GIS_LAT);
                            p.json = re_json.data[i];
                            pointsGreen.push(p);


                        } else if (re_json.data[i].FAULT_CNT >= 1 && re_json.data[i].FAULT_CNT <= 5) {
                            var p = new BMap.Point(re_json.data[i].GIS_LON, re_json.data[i].GIS_LAT);
                            p.json = re_json.data[i];
                            pointsYellow.push(p);
                        } else if (re_json.data[i].FAULT_CNT >= 6 && re_json.data[i].FAULT_CNT <= 10) {
                            var p = new BMap.Point(re_json.data[i].GIS_LON, re_json.data[i].GIS_LAT);
                            p.json = re_json.data[i];
                            pointsDeepYellow.push(p);
                        } else if (re_json.data[i].FAULT_CNT >= 11) {
                            var p = new BMap.Point(re_json.data[i].GIS_LON, re_json.data[i].GIS_LAT);
                            p.json = re_json.data[i];
                            pointsRed.push(p);
                        }
                        xianluqujianLongName = re_json.data[i].LINE_NAME + '&nbsp;' + re_json.data[i].POSITION_NAME + '&nbsp;' + re_json.data[i].BRG_TUN_NAME;
                        stringOFxljname = re_json.data[i].LINE_NAME + re_json.data[i].POSITION_NAME + re_json.data[i].BRG_TUN_NAME;
                        xianluqujianReallyLongName.push(xianluqujianLongName)
                        if (stringOFxljname.length > 9) {
                            stringOFxljname = re_json.data[i].LINE_NAME + ' ' + re_json.data[i].POSITION_NAME + ' ' + re_json.data[i].BRG_TUN_NAME;
                            xianluqujianLongName = stringOFxljname.substring(0, 10) + '…'
                        }


                        var color = '';
                        if (re_json.data[i].FAULT_CNT == 0) {
                            color = "#6CF075";
                        } else if (re_json.data[i].FAULT_CNT >= 1 && re_json.data[i].FAULT_CNT <= 5) {
                            color = "#EAFF00";
                        } else if (re_json.data[i].FAULT_CNT >= 6 && re_json.data[i].FAULT_CNT <= 10) {
                            color = "#EA8E50";
                        } else if (re_json.data[i].FAULT_CNT >= 11) {
                            color = "#FF0600";
                        }


                        _html += '<div class="cxListBody"  pole-code="' + re_json.data[i].POLE_CODE + '"  id="' + re_json.data[i].ID + '"><span class="xlqjName" name="' + i + '">' + xianluqujianLongName + '</span><span class="derectName" name="' + stringOFdirectname + '">' + img[i] + '</span><span>' + re_json.data[i].KMSTANDARD + '</span><span>' + re_json.data[i].POLE_NO + '</span><span class="faultColor" style="color:' + color + '">' + re_json.data[i].FAULT_CNT + '</span><span >' + re_json.data[i].ALARM_CNT + '</span></div><div class="XULine"></div>';
                    }
                    //layer.close(ii);
                    sumPage = re_json.totalPages;
                    $(".cxListBodyBox").html(_html);

                    $(".cxListBody").click(function () {
                        var _ID = $(this).attr("id");
                        setPoleClick(0, _ID);
                    });
                    $(".cxListBody").dblclick(function () {
                        var _ID = $(this).attr("pole-code");
                        gotopoleinfo(_ID)
                    });


                    $('.xlqjName').hover(function () {

                        var that = this;
                        layer.tips(xianluqujianReallyLongName[$(this).attr("name")], that, {
                            tips: [1, '#3595CC'],
                            time: 1000000
                        });
                    }, function () {
                        layer.closeAll();
                    })
                    $('.derectName').hover(function () {
                        //layer.tips(xianluqujianReallyLongName[index], '吸附元素选择器', {
                        //alert("aaaa")
                        //alert($(this).index())
                        if ($(this).attr("name").length > 2) {
                            var that = this;
                            layer.tips($(this).attr("name"), that, {
                                tips: [1, '#3595CC'],
                                time: 1000000
                            });
                        }

                    }, function () {
                        layer.closeAll();
                    })

                }
                else { 
                    layer.msg('暂无数据！')
                }
                mapRefash();
                layer.closeAll();
                ClearAnimateMarker();
            },
            error: function () {
                layer.msg('请求出错！')
            }
        }
    )
}

//获取选中项
function getSelectedItem(obj) {
    var slct = "";
    for (var i = 0; i < obj.options.length; i++)
        if (obj.options[i].selected == true) {
            slct += ',' + obj.options[i].value;
        }
    return slct.substring(1);
};
