//验证工具页面js2016-9-10 添加  BY ybc


var pagesize = 200000;//页大小
var pageindex = 1;//当前页
var sumPage = 0;//总页数
var sort_type = 'KMSTANDARD'//排序类型 默认公里标
var pointID = '';//编辑点id
var sort = 0;  //  序号排序   1为升序  0为降序
var btnType = '';//按钮种类
$(document).ready(function () {

    $('#linen_tree').mySelectTree({//线路区间
        tag: 'BRIDGETUNE',
        enableCheck: true,
        chkboxType: { "Y": "s", "N": "s" },
        nocheck: true,
        height: 250,
        enableFilter: true,
        filterNumber: 2,
        onCheck: function (event, treeId, treeNode) {
            var zTree = $.fn.zTree.getZTreeObj(treeId),
            nodes = zTree.getCheckedNodes(true),
             v = "", code = "";
            for (var i = 0, l = nodes.length; i < l; i++) {
                v += nodes[i].name + ",";
                code += nodes[i].id + ",";
            }
            if (v.length > 0) v = v.substring(0, v.length - 1);
            if (code.length > 0) code = code.substring(0, code.length - 1);
            var cityObj = $("#linen_tree");
            cityObj.attr("value", v).attr("code", code).attr("treetype", "LINE");
        },
        onClick: function (event, treeId, treeNode) {
            var treeObj = $.fn.zTree.getZTreeObj(treeId);
            treeObj.checkAllNodes(false);
            $('#linen_tree').attr("value", "");
            $('#linen_tree').val(treeNode.name).attr({ "code": treeNode.id, "treetype": treeNode.treeType });
        }

    });

    $('#org_tree').mySelectTree({//组织机构
        tag: 'ORGANIZATION',
        enableFilter: true

    });

    //返回查询按钮
    $("img[src='/Common/MGIS/img/yz_back.png']").parent().click(function () {
        $('#div_tj').css('display', 'block');
        resetAll()
    })
    //序号 排序图标点击事件
    $("#number_sort").parent().toggle(function () {
        $("#number_sort img").css('display', 'block')
        $("#km_sort img").css('display', 'none')
        $("#number_sort img").css('transform', 'rotate(180deg)')
        sort = 1;
        sort_type = 'SERIAL_NO';
        OCXGPS(pageindex, sort);
        $(".table_list").animate({ scrollTop: 0 }, 500);
    }, function () {
        $("#number_sort img").css('display', 'block')
        $("#km_sort img").css('display', 'none')
        $("#number_sort img").css('transform', 'rotate(0)')
        sort = 0;
        sort_type = 'SERIAL_NO';
        OCXGPS(pageindex, sort);
        $(".table_list").animate({ scrollTop: 0 }, 500);
    })
    //公里标 排序图标点击事件
    $("#km_sort").parent().toggle(function () {
        $("#number_sort img").css('display', 'none')
        $("#km_sort img").css('display', 'block')
        $("#km_sort img").css('transform', 'rotate(180deg)')
        sort_type = 'KMSTANDARD';
        sort = 1;
        OCXGPS(pageindex, sort);
        $(".table_list").animate({ scrollTop: 0 }, 500);
    }, function () {
        $("#number_sort img").css('display', 'none')
        $("#km_sort img").css('display', 'block')
        $("#km_sort img").css('transform', 'rotate(0)')
        sort_type = 'KMSTANDARD';
        sort = 0;
        OCXGPS(pageindex, sort);
        $(".table_list").animate({ scrollTop: 0 }, 500);
    })

    //查询定位数据
    //$("#myBtnTd").click(function () {
    //    cxIcon();
    //    OCXGPS(pageindex,sort);
    //})
    //查询
    $("#myBtnTd").click(function () {
        // cxIcon();
        btnType = 'query';
        OCXGPS(pageindex, sort);
    })
    //分析
    $("#analyzeBtn").click(function () {
        // cxIcon();
        btnType = 'analyze';
        OCXGPS(pageindex, sort);
    })
    //统计
    $('#statisticsBtn').click(function () {
        queryList();
        $('#backToLine').click();

    })

    $('.list_arrows img').click(function () {
        if ($('.bottom_list').css('bottom') == '0px') {
            $('.bottom_list').animate({ 'bottom': '-240px' })
            $(this).css({ 'transform': 'rotate(180deg)', 'margin': '0  0  0 30px' })
        } else {
            $('.bottom_list').animate({ 'bottom': '0' })
            $(this).css({ 'transform': '', 'margin': '16% 34%' })

        }
    })
    //返回
    $('#backToLine').click(function () {
        $(this).css('display', 'none')
        $('.second_list').css('display', 'none')


    })
    $("#linen_tree").siblings("a").click(function () {   //清除线路选择的checkbox勾选
        var treeObj = $.fn.zTree.getZTreeObj("ULlinen_tree");
        treeObj.checkAllNodes(false);
    });
})

//重置页面
function resetAll() {
    pageindex = 1;//当前页
    sumPage = 0;//总页数
    sort_type = 'KMSTANDARD'//排序类型 默认公里标
    pointID = '';//编辑点id
    sort = 0;  //  序号排序   1为升序  0为降序
}

//结果页标签
function cxIcon() {
    var __html = '';
    //组织机构标签
    if ($('#org_tree').val() != undefined && $('#org_tree').val() != "") {
        __html += '<span id="org_tree_list" class="label label-info" code="' + $('#org_tree').attr('code') + '" fortype="text"><span class="icon-remove icon-white lableClose" ></span>&nbsp;' + $('#org_tree').val() + '&nbsp;</span>'
    }
    //行别标签
    if ($('#ddlxb').val() != "" && $('#ddlxb').val() != undefined) {
        __html += '<span id="ddlxb_list" class="label label-info" code="' + $('#ddlxb').val() + '" fortype="text"><span class="icon-remove icon-white lableClose" ></span>&nbsp;' + $('#ddlxb').val() + '&nbsp;</span>'
    }
    //线路标签
    if ($('#linen_tree').val() != undefined && $('#linen_tree').val() != "") {
        __html += '<span id="linen_tree_list" class="label label-info" code="' + $('#linen_tree').attr('code') + '" fortype="text"><span class="icon-remove icon-white lableClose" ></span> &nbsp;' + $('#linen_tree').val() + '&nbsp; </span>'
    }
    //公里标大于
    if ($('#kmStart').val() != "") {
        __html += '<span id="kmIconbig" class="label label-info" fortype="text"><span class="icon-remove icon-white lableClose" ></span> &nbsp;公里标大于' + $('#kmStart').val() + '(m)&nbsp; </span>'
    }
    //公里标小于
    if ($('#kmEnd').val() != "") {
        __html += '<span id="kmIconsmall" class="label label-info" fortype="text"><span class="icon-remove icon-white lableClose" ></span> &nbsp;公里标小于' + $('#kmEnd').val() + '(m)&nbsp; </span>'
    }
    //杆号
    if ($('#proNumber').val() != "") {
        __html += '<span id="proIcoNumber" class="label label-info" fortype="text"><span class="icon-remove icon-white lableClose" ></span> &nbsp;杆号:' + $('#proNumber').val() + '&nbsp; </span>'
    }

    $('#lable_title').html(__html)
    //点击关闭自己  并执行查询
    $('.lableClose').click(function () {
        var type = $(this).parent().attr('id')
        switch (type) {
            case "org_tree_list":
                $('#org_tree').val('');
                $('#org_tree').attr('code', '');
                $('#org_tree').attr('treetype', '');
                break;
            case "ddlxb_list":
                $('#ddlxb').val('');
                break;
            case "linen_tree_list":
                $('#linen_tree').val('');
                $('#linen_tree').attr('code', '');
                $('#linen_tree').attr('treetype', '');
                break;
            case "kmIconbig":
                $('#kmStart').val('');
                break;
            case "kmIconsmall":
                $('#kmEnd').val('');
                break;
            case "proIcoNumber":
                $('#proNumber').val('');
                break;
        }
        $(this).parent().remove();//删除自己
        OCXGPS(pageindex, sort);//查询
    })
}

//查询方法
function OCXGPS(pageindex, sort) {
    QC();
    CXGPS(pageindex, sort);//查询json
}
function CXGPS(pageindex, sort) {
    // 遮罩层
    var ii = layer.load(1, {
        shade: [0.8, '#000'] //0.1透明度的白色背景
    });
    var type = "INFO";
    var org_code = '';
    if ($('#org_tree').attr('code') != undefined) {
        org_code = $('#org_tree').attr('code');//组织机构
    }
    var org_type = '';//组织机构级别
    if ($('#org_tree').attr('treetype') != undefined && $('#org_tree').attr('treetype') != '') {
        var treetype = $('#org_tree').attr('treetype');//组织机构级别
        if (treetype == 'J') {//局
            org_type = 'BUREAU_CODE'
        } else if (treetype == 'TOPBOSS' || treetype == 'YSJ') {
            org_type = ''//局以上
        } else {
            org_type = 'ORG_CODE'//局以下
        }
    }
    var LPB_code = '';
    if ($('#linen_tree').attr('code') != undefined) {
        LPB_code = $('#linen_tree').attr('code');//线路区间
    }
    var LPB_type = '';// 线路级别
    if ($('#linen_tree').attr('treetype') != undefined && $('#linen_tree').attr('treetype') != '') {
        LPB_type = $('#linen_tree').attr('treetype');//线路级别
        switch (LPB_type) {
            case 'BRIDGETUNE':
                LPB_type = 'BRG_TUN_CODE';
                break;
            case 'POSITION':
                LPB_type = 'POSITION_CODE';
                break;
            case 'LINE':
                LPB_type = 'LINE_CODE';
                break;
        }
    }
    var ProNumber = $('#proNumber').val();//杆号
    var dirct = escape($('#ddlxb').val());//行别
    var jl = $('#jl').val(); //两点距离大于
    var _jl = $('#_jl').val(); //两点距离小于
    var kmStart = $('#kmStart').val();//开始公里标
    var kmEnd = $('#kmEnd').val();//结束公里标


    gpsjson = getGpsJson(LPB_code, org_code, ProNumber, dirct, jl, _jl, kmStart, kmEnd, sort, type, pageindex, sort_type, LPB_type, org_type)//获取json
}



//页面操作
function doHtml(json) {
    var img = [];
    var list_html = '';
    var ddlyc = $('#ddlyc').val(); //
    for (var i = 0; i < json.data.length; i++) {
        switch (json.data[i].direction) {
            case "上行":
                img[i] = '<img src="/Common/MGIS/img/上行.png" alt="" title="上行"/>';
                break;
            case "下行":
                img[i] = '<img src="/Common/MGIS/img/下行.png" alt="" title="下行" style="position: relative; left: -3px"/>';
                break;
            case "":
                img[i] = "&nbsp;"
        }
        if (json.data[i].ACDesc.length + json.data[i].MCDesc.length > 6) {
            var a = json.data[i].ACDesc
            a = a.substring(0, 5) + '...'
        } else {
            var a = json.data[i].ACDesc + '&nbsp;' + json.data[i].MCDesc
        }
        //判断显示列
        if (ddlyc == "0") {
            list_html += getlist_html(json.data[i], img[i], i, a);

        } else if (ddlyc == "2") {
            if (json.data[i].ISZC == '1') {
                list_html += getlist_html(json.data[i], img[i], i, a);
            }
        } else if (ddlyc == "3") {
            if (json.data[i].JL == '1') {
                list_html += getlist_html(json.data[i], img[i], i, a);
            }
        } else if (ddlyc == "4") {
            if (json.data[i].XJL == '1') {
                list_html += getlist_html(json.data[i], img[i], i, a);
            }
        } else if (ddlyc == "5") {
            if (json.data[i].EXCEPTION_DATA_TYPE != '') {
                list_html += getlist_html(json.data[i], img[i], i, a);
            }
        }
    }
    $('#nowPage').html(json.pageOfTotal);
    $('#pageRange').html(json.pageRange);
    $('#sumPage').html(json.total_Rows);
    sumPage = json.totalPages;
    if (json.data.length > 0) {
        $('#div_tj').css('display', 'none')//结果列表出现
    }
    $('.list_body table tbody').html(list_html)//列表写入
    layer.closeAll();
    //列表鼠标双机事件
    $('.oneRowIntable').dblclick(function () {
        var _ID = $(this).attr("id");
        setPoleClick(_ID);
    })


    //列表鼠标事件移入
    $('.oneRowIntable').hover(
           function () {
               $(this).addClass('xlqjName')
           }, function () {
               $(this).removeClass('xlqjName')
           })
    $('.showKmmark').hover(function () {
        if ($(this).text().length > 6) {
            layer.tips($(this).text(), this, {
                tips: [1, '#3595CC'],
                time: 5000
            });
        }
    }, function () {
        layer.closeAll();
    })
    $('.longone').hover(function () {
        layer.tips($(this).text(), this, {
            tips: [1, '#3595CC'],
            time: 5000
        });
    }, function () {
        layer.closeAll();
    })
    $('.showReally').hover(function () {
        var a = '自动判断：' + $(this).attr('name') + '<br/>人工判断：' + $(this).attr('really')
        layer.tips(a, this, {
            tips: [1, '#3595CC'],
            time: 5000
        })
    }, function () {
        layer.closeAll();
    })

    //编辑按钮
    $("img[src='/Common/MGIS/img/yz_write.png']").click(function () {
        pointID = $(this).parent().parent().attr('id')
        $('#humanJudge').val('')
    })

}


//编辑ajax
function changeTarg(id, __html, obj) {
    var url = '/Common/MGIS/ASHX/Sms/Vertify_ex.ashx?action=update_desc&ID=' + id + '&MCDESC=' + __html;
    $.ajax({
        type: "POST",
        url: url,
        async: true,
        cache: false,
        success: function (result) {
            if (result != "" || result != undefined)
                var number = parseInt(result);
            if (number == 1) {
                layer.tips('修改成功！', obj, {
                    tips: [2, '#3595CC'],
                    time: 2000
                });
                var __html = $('#humanJudge').val();//用户输入值
                $("img[rowid=" + pointID + "]").parent().attr('really', __html);//tips框内容修改
                if (__html.length > 6) {
                    __html = __html.substring(0, 5) + '...'
                }
                $("img[rowid=" + pointID + "]").siblings('span').html(__html);
            } else {
                layer.tips('修改失败！请重试', obj, {
                    tips: [2, '#3595CC'],
                    time: 2000
                });
            }

        },
        error: function (xhr) {
            alert("错误提示： " + xhr.responseText + " " + xhr.statusText);
        }
    });
}


//ajax请求
function getGpsJson(LPB_code, org_code, ProNumber, dirct, jl, _jl, kmStart, kmEnd, sort, type, pageindex, sort_type, LPB_type, org_type) {
    if (btnType == 'query') {
        var url = '/Common/MGIS/ASHX/Sms/Vertify_ex.ashx?action=getInfo&org_code=' + org_code
        + '&direction=' + dirct
        + '&LPB_code=' + LPB_code
        + '&start_km=' + kmStart
        + '&end_km=' + kmEnd
        + '&LPB_type=' + LPB_type
        + '&org_type=' + org_type
        + '&pole_no=' + ProNumber
        + '&jl=' + jl
        + '&_jl=' + _jl
        + '&sort=' + sort
        + '&pagesize=' + pagesize
        + '&pageindex=' + pageindex
        + '&sort_type=' + sort_type;


    } else if (btnType == 'analyze') {
        var url = '/Common/MGIS/ASHX/Sms/Vertify_ex.ashx?action=analysis&org_code=' + org_code
        + '&direction=' + dirct
        + '&LPB_code=' + LPB_code
        + '&LPB_type=' + LPB_type
        + '&org_type=' + org_type
    };
    //var url = '/Common/MGIS/ASHX/Sms/Vertify_ex.ashx?action=getInfo&org_code=' + org_code
    //    + '&direction=' + dirct
    //    + '&LPB_code=' + LPB_code
    //    + '&start_km=' + kmStart
    //    + '&end_km=' + kmEnd
    //    + '&LPB_type=' + LPB_type
    //    + '&org_type=' + org_type
    //    + '&pole_no=' + ProNumber
    //    + '&jl=' + jl
    //    + '&_jl=' + _jl
    //    + '&sort=' + sort
    //    + '&pagesize=' + pagesize
    //    + '&pageindex=' + pageindex
    //    + '&sort_type=' + sort_type;
    var json;
    $.ajax({
        type: "POST",
        url: url,
        async: true,
        cache: false,
        success: function (result) {
            if (result != "" && result != undefined) {
                json = result
                if (type == "INFO") {
                    //console.log(json.total_Rows)
                    if (json.data == '') {
                        layer.msg('暂无数据！')
                    }
                    SetInfo(json.data);//添加海量点   Verify.js
                    //doHtml(json);//页面操作
                    return json.data
                } else if (type == "Position") {
                    setPosition(json.data);
                    gpsjson = json.data;
                }
            }
        }
    });

}


//分页
function yemianTiaozhuan(whoisClick) {
    switch (whoisClick) {
        case 'first': pageindex = 1;
            break;
        case 'less': pageindex -= 1;
            break;
        case 'next': pageindex += 1;
            break;
        case 'end': pageindex = sumPage;
            break;
    }
    if (pageindex > sumPage) {
        pageindex = sumPage;
    }
    if (pageindex < 1) {
        pageindex = 1;
    }
    OCXGPS(pageindex, sort);
}

//列表html
function getlist_html(json, img, i, a) {
    var html = '<tr class="oneRowIntable"   id="' + json.id + '" name="' + i + '">\
                           <td>' + json.SERIAL_NO + '</td>\
                           <td class="longone">' + json.line_name + '&nbsp;' + json.position_name + '</td>\
                           <td>' + img + '</td>\
                           <td class="showKmmark">' + json.km_mark + '</td>\
                           <td >' + json.POLE_NO + '</td>\
                           <td class="showReally"  name="' + json.ACDesc + '" really="' + json.MCDesc + '"><span>' + a + '</span><img rowid="' + json.id + '" data-toggle="modal" data-target="#judge" src="/Common/MGIS/img/yz_write.png"/></td>\
                       </tr>'
    return html;
}

//locationInfo节点html
function setHtml(__json) {
    var html = "<div style='width:400px;'>"

    html += "<input class='btn btn-primary' value='保存' onclick='updateInfo(\"" + __json.id + "\")' type='button' />";
    html += "<input class='btn btn-primary'  style='display:none;' value='删除' onclick='deleteInfo(\"" + __json.id + "\")' type='button' />";
    html += "<input class='btn btn-primary' value='关闭' onclick='Close()' type='button' />";
    html += "<table class='table table-bordered table-condensed' style='table-layout:fixed ;' cellspacing='1'  cellpadding='1'>"
    html += "<tr><td style='width:25%'>局：</td><td style='width:75%'>" + __json.bureauName + "</td></tr>"
    html += "<tr><td style='width:25%'>段：</td><td style='width:75%'>" + __json.power_section_name + "</td></tr>"
    html += "<tr><td style='width:25%'>线路：</td><td style='width:75%'>" + __json.line_name + "</td></tr>"
    html += "<tr><td style='width:25%'>区间：</td><td style='width:75%'>" + __json.position_name + "</td></tr>"
    html += "<tr><td style='width:25%'>桥隧：</td><td style='width:75%'>" + __json.BRG_TUN_NAME + "</td></tr>"
    html += "<tr><td style='width:25%'>行别：</td><td style='width:75%'><input id='txtXB' type='text' name ='txtXB' style='width:100px;' value='" + __json.direction + "'></input></td></tr>"
    html += "<tr><td style='width:25%'>杆号</td><td style='width:75%'><input id='txtgh' type='text' name ='txtgh' style='width:100px;' value='" + __json.POLE_NO + "'></input></td></tr>"
    html += "<tr><td style='width:25%'>公里标：</td><td style='width:75%'><input id='txtkm' type='text' name ='txtkm' style='width:100px;' value='" + __json.km_mark + "'></input></td></tr>"
    html += "<tr><td style='width:25%'>编号：</td><td style='width:75%'><input id='txtbh' type='text' name ='txtbh' style='width:100px;' readOnly='true' value='" + __json.SERIAL_NO + "'></input></td></tr>"

    if (FunEnable('Fun_CoordinateShow') == "True") {
        html += "<tr><td style='width:25%'>GPS经度：</td><td style='width:75%'>" + __json.gis_lon + "</td></tr>"
        html += "<tr><td style='width:25%'>GPS纬度：</td><td style='width:75%'>" + __json.gis_lat + "</td></tr>"
    }
    html += "<tr><td style='width:25%'>百度经度：</td><td style='width:75%'>" + __json.gis_lon_b + "</td></tr>"
    html += "<tr><td style='width:25%'>百度纬度：</td><td style='width:75%'>" + __json.gis_lat_b + "</td></tr>"
    if (__json.DUP_POLE == '' && __json.DUP_PW == '') {
        html += "<tr ><td style='width:25%'>异常信息：</td><td style='width:75%'>" + __json.DUP_POLE + __json.DUP_PW + '自动判断:' + __json.ACDesc + '<br/>人工判断:<span class="humanThink">' + __json.MCDesc + '</span><span onclick="showArtificialBox()" class="openModal" data-toggle="modal" data-target="#judge" rowid="' + __json.id + '"  style="color:blue;cursor: pointer;">编辑</span>' + "</td></tr>"
    } else {
        html += "<tr ><td style='width:25%'>异常信息：</td><td style='width:75%'>" + __json.DUP_POLE + __json.DUP_PW + '<br/>自动判断:' + __json.ACDesc + '<br/>人工判断:<span class="humanThink">' + __json.MCDesc + '</span><span class="openModal"  rowid="' + __json.id + '"  style="color:blue;cursor: pointer;" onclick="showArtificialBox()">编辑</span>' + "</td></tr>"
    }

    html += "<tr><td style='width:25%'>相邻两点的位置差距：</td><td style='width:75%' colspan='3'>" + __json.WZ + "</td></tr>"
    html += "</table>"
    html += "</div>";

    return html;
}


//列表地图联动
function setPoleClick(m, ID) {
    map.setCenter(m);
    var html = setHtml(m.jsons);
    var infoWindow = new BMap.InfoWindow(html);
    map.openInfoWindow(infoWindow, m);
    //var overlays = map.getOverlays();
    //for (var i = 0; i < overlays.length; i++) {
    //    if (overlays[i].da) {
    //        var p = overlays[i].da.ha;
    //        for (var y = 0; y < p.length; y++) {
    //            var m = p[y];
    //            if (m.jsons.id == ID) {
    //                map.setCenter(m);

    //                var html = setHtml(m.jsons); //SetHtml.js 中
    //                var infoWindow = new BMap.InfoWindow(html);
    //                map.openInfoWindow(infoWindow, m);
    //                //$('.openModal').click(function () {
    //                //    $('#judge')
    //                //})
    //            }


    //            }
    //        }
    //    }

    $('.oneRowIntable').removeClass('alarmItem_over');
    $('#' + ID).addClass('alarmItem_over');
    //SetTop(ID);
}

///设置滚动条
//function SetTop(_alarmID) {
//    $(".table_list").animate({ scrollTop: $("#" + _alarmID)[0].offsetTop - 100 }, 500);
//}

function showArtificialBox() {
    $('#judgeContrl').click()
    pointID = $('.openModal').attr('rowid')
    $('#humanJudge').val('');
    $('#saveRedact').unbind();
    $('#saveRedact').click(function () {
        //var that = $('#' + pointID);//列表行
        //var __html = $('#humanJudge').val();//用户输入值
        //changeTarg(pointID, __html, that);//编辑传入数据库
        ////表内显示设置

        var __html = $('#humanJudge').val();//用户输入值
        ArtificialSave(pointID, __html);

    })
}

//无表编辑ajax
function ArtificialSave(id, __html) {
    var url = '/Common/MGIS/ASHX/Sms/Vertify_ex.ashx?action=update_desc&ID=' + id + '&MCDESC=' + __html;
    $.ajax({
        type: "POST",
        url: url,
        async: true,
        cache: false,
        success: function (result) {
            if (result != "" || result != undefined)
                var number = parseInt(result);
            if (number == 1) {
                layer.msg('修改成功！');
                $('.humanThink').html(__html)

            } else {
                layer.tips('修改失败！请重试');
            }

        },
        error: function (xhr) {
            alert("错误提示： " + xhr.responseText + " " + xhr.statusText);
        }
    });
}

//统计查询
function queryList(bol, rect) {
    var ii = layer.load(1, {
        shade: [0.8, '#000'] //0.1透明度的白色背景
    });
    var org_code = '';
    if ($('#org_tree').attr('code') != undefined) {
        org_code = $('#org_tree').attr('code');//组织机构
    }
    var org_type = '';//组织机构级别
    if ($('#org_tree').attr('treetype') != undefined && $('#org_tree').attr('treetype') != '') {
        var treetype = $('#org_tree').attr('treetype');//组织机构级别
        if (treetype == 'J') {//局
            org_type = 'BUREAU_CODE'
        } else if (treetype == 'TOPBOSS' || treetype == 'YSJ') {
            org_type = ''//局以上
        } else {
            org_type = 'ORG_CODE'//局以下
        }
    }
    var LPB_code = '';
    if ($('#linen_tree').attr('code') != undefined) {
        LPB_code = $('#linen_tree').attr('code');//线路区间
    }
    var LPB_type = '';// 线路级别
    if ($('#linen_tree').attr('treetype') != undefined && $('#linen_tree').attr('treetype') != '') {
        LPB_type = $('#linen_tree').attr('treetype');//线路级别
        switch (LPB_type) {
            case 'BRIDGETUNE':
                LPB_type = 'BRG_TUN_CODE';
                break;
            case 'POSITION':
                LPB_type = 'POSITION_CODE';
                break;
            case 'LINE':
                LPB_type = 'LINE_CODE';
                break;
        }
    }
    var dirct = escape($('#ddlxb').val());//行别


    if (bol) {
        linecode = bol;
        dirct = rect;
        LPB_type = 'LINE_CODE';
        var url = '/Common/MGIS/ASHX/Sms/Vertify_ex.ashx?action=statisticsPosition&pagesize=200000&pageindex=1'
             + '&org_code=' + org_code
             + '&direction=' + dirct
             + '&LPB_code=' + linecode
             + '&LPB_type=' + LPB_type
             + '&org_type=' + org_type;


    } else {

        var url = '/Common/MGIS/ASHX/Sms/Vertify_ex.ashx?action=statisticsLine&pagesize=200000&pageindex=1'
             + '&org_code=' + org_code
             + '&direction=' + dirct
             + '&LPB_code=' + LPB_code
             + '&LPB_type=' + LPB_type
             + '&org_type=' + org_type;

    }

    $.ajax({
        type: "POST",
        url: url,
        async: true,
        cache: false,
        success: function (result) {
            if (result != "" && result != undefined && result.data != '') {
                if ($('.bottom_list').css('bottom') == '-240px') {
                    $('.list_arrows img').click()
                }
                layer.closeAll();
                //如果是第二层--
                if (bol) {

                    $('.second_list').css('display', 'block')
                    $('#backToLine').css('display', 'initial')
                    var _html = getlistSecendHtml(result)
                    $('#second_table_black_content').html(_html)
                    if (result.data.length > 5) {
                        if (screen.width < 1600) {
                            if (screen.width < 1440) {
                                if (screen.width < 1366) {
                                    $('.second_list_table').css('width', '98.4%')
                                } else { $('.second_list_table').css('width', '98.6%') }
                            } else { $('.second_list_table').css('width', '98.7%') }
                        } else { $('.second_list_table').css('width', '99%') }
                    } else {
                        $('.second_list_table').css('width', '100%')
                    }
                } else {
                    var _html = getlistHtml(result)
                    $('#table_black_content').html(_html)
                    if (result.data.length > 5) {
                        if (screen.width < 1600) {
                            if (screen.width < 1440) {
                                if (screen.width < 1366) {
                                    $('.table_black_table').css('width', '98.4%')
                                } else { $('.table_black_table').css('width', '98.6%') }
                            } else { $('.table_black_table').css('width', '98.7%') }
                        } else { $('.table_black_table').css('width', '99%') }
                    } else {
                        $('.table_black_table').css('width', '100%')
                    }
                    //单行点击进入第二层
                    $('.list_tr').click(function () {
                        $('.list_tr').removeClass('list_tr_choose')
                        $(this).addClass('list_tr_choose')
                        linecode = $(this).attr('linecode')
                        dirct = $(this).attr('dirct')
                        queryList(linecode, dirct)
                    })


                }

            } else {
                if (bol) {
                    $('#second_table_black_content').html('')
                } else {
                    $('#table_black_content').html('')
                }
                layer.closeAll();
                layer.msg('暂无数据！');
            }
        },
        error: function (xhr) {
            layer.closeAll();
            layer.msg('出错了！');
            console.log("错误提示： " + xhr.responseText + " " + xhr.statusText);
        }


    })




}
//统计第一层
function getlistHtml(json) {
    var html = '';
    for (var i = 0; i < json.data.length; i++) {

        if (json.data[i].ENDPOLE_NO != '') {
            json.data[i].ENDPOLE_NO = '【' + json.data[i].ENDPOLE_NO + '号支柱】'
        }
        if (json.data[i].STARTPOLE_NO != '') {
            json.data[i].STARTPOLE_NO = '【' + json.data[i].STARTPOLE_NO + '号支柱】'
        }
        html += '<tr class="list_tr" title="点击查看内部信息" dirct="' + json.data[i].POLE_DIRECTION + '" linecode="' + json.data[i].LINE_CODE + '"><td>' + json.data[i].LINE_NAME + '</td><td>' + json.data[i].POLE_DIRECTION + '</td><td>' + json.data[i].STARTKM_MARK + json.data[i].STARTPOLE_NO + '</td><td>' + json.data[i].ENDKM_MARK + json.data[i].ENDPOLE_NO + '</td><td>' + json.data[i].TOTALPOLE + '</td></tr>'
    }
    return html;
}
//统计第二层
function getlistSecendHtml(json) {
    var html = '';
    for (var i = 0; i < json.data.length; i++) {
        if (json.data[i].ENDPOLE_NO != '') {
            json.data[i].ENDPOLE_NO = '【' + json.data[i].ENDPOLE_NO + '号支柱】'
        }
        if (json.data[i].STARTPOLE_NO != '') {
            json.data[i].STARTPOLE_NO = '【' + json.data[i].STARTPOLE_NO + '号支柱】'
        }
        html += '<tr class="" ><td>' + json.data[i].LINE_NAME + '</td><td>' + json.data[i].POSITION_NAME + '</td><td>' + json.data[i].POLE_DIRECTION + '</td><td>' + json.data[i].STARTKM_MARK + json.data[i].STARTPOLE_NO + '</td><td>' + json.data[i].ENDKM_MARK + json.data[i].ENDPOLE_NO + '</td><td>' + json.data[i].TOTALPOLE + '</td><td>' + json.data[i].ORG_NAME + '</td></tr>'
    }
    return html;
}