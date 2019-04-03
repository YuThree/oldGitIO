var page = 1;  // 分页当前页数
var pageSize = 10;  // 分页每页数量
var PageCount = 1;  //总页数
var json_config;  //车弓位置
var IfGo = 1; //验证数据通过否
$(function () {

    $('.videotape-left-play').css('height', $(document.body).height() - 100 + 'px')//根据屏幕高度设置大图高度

    var loc = GetQueryString("locomotive"); //参数车号
    if (loc) {
        $("#txtloccode").val(loc);
    }

    $("#NewBuild").click(function () {
        layer.open({
            title: false,
            area: '450px',
            type: 1,
            shade: 0.5,
            content: $("#newbuild")
        })
    });
    $("#BtnSearch").click(function () {
        $("#txtloccode").val("");
        ShowSearchBox();
    });
    ShowSearchBox();
    var _treeType = "VideoDevice";

    if (GetIsPowerOrg() == 1) {
        $("#TreeAll").powersection();
    }else{
        $('#TreeAll').myTree({
            type: _treeType,
            tag: 'LOCOMOTIVE',
            isVideo: '1',
            enableFilter: true,
            isDefClick: false,
            onClick: function (event, treeId, treeNode) {
                if (treeNode.treeType != "LOCOMOTIVE") return;
                $('#locomotive_no').html(treeNode.name);
                $('#TreeAll').fadeOut();
                $('.ztreeInput').fadeOut(50);

                //加载车厢号列表。
                Getrelations(treeNode.relations);
            }, 
            callback: function (event, treeId, treeNode, msg) {
                var treeObj = $.fn.zTree.getZTreeObj(treeId);
                treeObj.expandAll(true);

                GetOnline(); //车在线否
            }
        })
    };

    $(".div-menu").hover(
	    function () {
	        $('#TreeAll').fadeIn(50);
	        $('.ztreeInput').fadeIn(50);
	        $(this).find("img").attr("src", "/Common/img/playico/xia-blue.png");
	        if (GetIsPowerOrg() == 1) {
	            $("#TreeAll").empty();
	            $("#TreeAll").powersection();
	            $('.ztreeInput').hide();
	        }
	    },
	    function () {
	        $('#TreeAll').fadeOut(50);
	        $('.ztreeInput').fadeOut(50);
	        $(this).find("img").attr("src", "/Common/img/playico/xia.png")
	    }
    );

    //设备编号
    $('#txtloccode').LocoSelect({
        position: 'MonitorLocoAlarmList'
    });

    //设备编号控件
    $('#txtloccode').inputSelect({
        type: 'loca',
        contant: 2
    });

    $("#location").mySelectTree({
        tag: 'LINE',
        enableFilter: true,
        height: 250,
        onClick: function (event, treeId, treeNode) {
            $('#location').attr("code", treeNode.id).val(treeNode.name);
        }
    });


    $("#new-line").mySelectTree({
        tag: 'LINE',
        enableFilter: true,
        height: 250,
        onClick: function (event, treeId, treeNode) {
            $('#new-line').attr("code", treeNode.id).val(treeNode.name);
        }
    });
    
    BtnHover();//鼠标移过图片效果

    
    //点击换图添加边框
    $(".videotape-right>div").click(function () {
        $(this).siblings().removeClass("videotape-right-border");
        $(this).addClass("videotape-right-border");
        $(this).siblings().children("div.Img-Title").removeClass("Img-Active");
        $(this).children("div.Img-Title").addClass("Img-Active");
    })

    //提交新建录像信息
    $("#BtnSubmit").click(function () {
        NewCreatVedio();

    });
    //查询
    $("#btnsearch").click(function () {
        page = 1;
        QueryVedio(page);  //查询
    });
    //分页首页
    $(".page-top").click(function () {
        page = 1;
        QueryVedio(page); ///执行查询 (当前JS)
    });
    //分页上一页
    $(".page-pre").click(function () {
        if (page > 1) {
            page = page - 1;
            QueryVedio(page); ///执行查询 (当前JS)
        }
    });
    //分页下一页
    $(".page-nex").click(function () {
        if (page < PageCount) {
            page = page + 1;
            QueryVedio(page); ///执行查询 (当前JS)
        }
    });
    //分页尾页
    $(".page-last").click(function () {
        page = PageCount;
        QueryVedio(page); ///执行查询 (当前JS)
    });
    //回车查询
    $('#page-numb').bind('keypress', function (event) {
        if (event.keyCode == "13") {
            page = parseInt($("#page-numb").val());
            QueryVedio(page); ///执行查询 (当前JS)
        }
    });
});

function GetOnline() {
    var url = '/C3/PC/MLiveStreaming/RemoteHandlers/VideoDeviceInfoHandler.ashx?type=getOnlineLoco';
    $.ajax({
        type: "POST",
        url: url,
        async: true,
        cache: false,
        success: function (result) {

            $('.level2').each(function () {

                var _id = $(this).attr('id');
                var span_id = _id + "_span"; //   TreeAll_7_span
                var c_loco = $('#' + span_id).text();

                var relist = result.split(',');
                for (var i = 0; i < relist.length; i++) {
                    if (relist[i].indexOf(c_loco) > -1) {

                        $('#' + span_id).css("color", "green");
                        $('#' + span_id).attr('onlinePort', relist[i]); // _A _B #1_A #1_B #2_A #2_B

                        break;
                    }
                    else {
                        $('#' + span_id).css("color", "#333");

                    }
                }
            })
        },
        error: function () { }
    });
};

//加载弓
function Getrelations(relations) {
    var html = "";
    if (relations != "") {
        var Array_relations = relations.split('#');
        for (var i = 0; i < Array_relations.length; i++) {
            for (var j = 0; j < Array_relations[i].split(':')[1].split(',').length; j++) {
                var code = "ip" + (i + 1);
                if (j == 0) {
                    code = code + "_A";
                } else {
                    code = code + "_B";
                }
                //html += "<li><a href='#' style='width: 50px' code='" + code + "'>" + Array_relations[i].split(':')[1].split(',')[j] + "车</a></li>";
                html += '<div class="span3"><input type="checkbox" checked name="GWZ" value="' + code + '" />' +Array_relations[i].split(':')[1].split(',')[j]+ '车</div>'
            }
        }
    } else {
        html = '<div class="span3"><input type="checkbox" name="GWZ" value="ip_A" checked />4车</div><div class="span3"><input type="checkbox" name="GWZ" value="ip_B" checked />6车</div>';
    }
    $('#txt_AB').html(html);
};

function BtnHover() {
    //前一张
    $('#btn_less').children("img").hover(function () {
        $(this).attr("src", "/C3/PC/LineInspection/img/LineInspection_play_leftHover.png")
    }, function () {
        $(this).attr("src", "/C3/PC/LineInspection/img/LineInspection_play_left.png")
    });
    //播放
    $('#btn_play').children("img").hover(function () {
        $(this).attr("src", "/C3/PC/LineInspection/img/LineInspection_play_playHover.png")
    }, function () {
        $(this).attr("src", "/C3/PC/LineInspection/img/LineInspection_play_play.png")
    });
    $('#btn_play').click(function () {

        Ispaly = false;
        play()
    });
    //暂停
    $('#btn_pause').children("img").hover(function () {
        $(this).attr("src", "/C3/PC/LineInspection/img/LineInspection_play_stopHover.png")
    }, function () {
        $(this).attr("src", "/C3/PC/LineInspection/img/LineInspection_play_stop.png")
    });
    $('#btn_pause').click(function () {

        Ispaly = true;
        play()
    });
    //下一张
    $('#btn_next').children("img").hover(function () {
        $(this).attr("src", "/C3/PC/LineInspection/img/LineInspection_play_rightHover.png")
    }, function () {
        $(this).attr("src", "/C3/PC/LineInspection/img/LineInspection_play_right.png")
    });
    //重播
    $('#btn_repeat').children("img").hover(function () {
        $(this).attr("src", "/C3/PC/LineInspection/img/LineInspection_play_replayHover.png")
    }, function () {
        $(this).attr("src", "/C3/PC/LineInspection/img/LineInspection_play_replay.png")
    });

    //翻页按钮鼠标经过变图片
    $(".page-top").children("img").hover(function () {
        $(this).attr("src", "/Common/MGIS/img/gis-img/top-light.png")
    }, function () {
        $(this).attr("src", "/Common/MGIS/img/gis-img/top.png")
    });
    $(".page-pre").children("img").hover(function () {
        $(this).attr("src", "/Common/MGIS/img/gis-img/pre-light.png")
    }, function () {
        $(this).attr("src", "/Common/MGIS/img/gis-img/pre.png")
    });
    $(".page-nex").children("img").hover(function () {
        $(this).attr("src", "/Common/MGIS/img/gis-img/nex-light.png")
    }, function () {
        $(this).attr("src", "/Common/MGIS/img/gis-img/nex.png")
    });
    $(".page-last").children("img").hover(function () {
        $(this).attr("src", "/Common/MGIS/img/gis-img/last-light.png")
    }, function () {
        $(this).attr("src", "/Common/MGIS/img/gis-img/last.png")
    });
};

function NewCreatVedio() {
    var Locomotivecode = $("#locomotive_no").text(); //车号
    var Title = $("#new-title").val(); //标题
    var Linename = $("#new-line").val(); // 线路名字
    var Linecode = $("#new-line").attr("code"); //线路code
    if (Linecode == undefined) {
        Linecode = "";
    }
    var Direction = escape($("#new-DIRECTION").val()); //行别
    var Startime = $("#new-strTime").val(); //开始时间
    var Endtime = $("#new-endTime").val(); //结束时间
    var IR = ""; //红外
    var Detail = ""; //局部
    var PANORAMA = ""; //全景
    var AUX = ""; //辅助
    var BowPostition = []; //弓位置
    var _url = "";
    if ($("#img-HW").is(':checked')) {
        IR = 1;
    }
    if ($("#img-JB").is(':checked')) {
        Detail = 1;
    }
    if ($("#img-QJ").is(':checked')) {
        PANORAMA = 1;
    }
    if ($("#img-FZ").is(':checked')) {
        AUX = 1;
    }

    GetLocaPlayMemo_GT(Locomotivecode);//根据车号取得json

    $("#txt_AB").find("input[name='GWZ']").each(function () {
        if ($(this).is(":checked")) {
            var Values = $(this).val();
            var ip = GetIp(json_config, Values);  //取得弓位置
            BowPostition.push(ip.replace(Locomotivecode, "").replace("#", "%23"));
        }
    })

    CheckedValue(Locomotivecode,Title, Startime, Endtime, IR, Detail, PANORAMA, AUX, BowPostition);//验证数据

    if (IfGo == 0) return false;

    _url = '/C3/PC/MLiveStreaming/RemoteHandlers/VedioRecorder.ashx?action=creat&LOCOMOTIVE_CODE=' + Locomotivecode + '&LINE_NAME=' + Linename + '&LINE_CODE=' + Linecode + '&DIRECTION=' + Direction + '&title=' + Title + '&starttime=' + Startime + '&endtime=' + Endtime + '&IR=' + IR + '&Detail=' + Detail + '&PANORAMA=' + PANORAMA + '&AUX=' + AUX + '&BowPostition=' + BowPostition;
    $.ajax({
        type: 'POST',
        url: _url,
        async: true,
        cache: false,
        success: function (result) {
            if (result > 0) {
                layer.closeAll();
                $("#BtnSearch").click();
                $(".layui-layer-ico6").parent().parent().css('backgroundColor', 'white');
            } else {
                layer.alert("新建失败", { icon: 5 });
                $(".layui-layer-ico5").parent().parent().css('backgroundColor', 'white');
            }
        }
    })
};

function CheckedValue(Locomotivecode,Title, Startime, Endtime, IR, Detail, PANORAMA, AUX, BowPostition) {
    var Msg = "";
    if (Locomotivecode == "请选择") {
        Msg = "请选择设备编号";
    } else if (Title == "") {
        Msg = "请输入标题";
    } else if (Startime == "") {
        Msg = "请输入开始时间";
    } else if (Endtime == "") {
        Msg = "请输入结束时间";
    } else if (IR == "" && Detail == "" && PANORAMA == "" && AUX == "") {
        Msg = "请选择采集通道";
    } else if (BowPostition.length == 0) {
        Msg = "请选择弓位置";
    } else {
        Msg = "";
    }
    if (Msg != "") {
        layer.msg(Msg, { icon: 5 });
        $(".layui-layer-ico5").parent().parent().css('backgroundColor', 'white');
        IfGo = 0;
    } else {
        IfGo = 1;
    }
};

function QueryVedio(page) {
    var Url = "";
    var Txtloccode = $("#txtloccode").val();  //车号
    var SearchTitle = $("#Search-Title").val(); //标题
    var Locationname = $("#location").val(); // 线路名字
    var Locationcode = $("#location").attr("code"); //线路code
    if (Locationcode == undefined) {
        Locationcode = "";
    }
    var direction = escape($("#direction").val()); //行别

    document.getElementById("Search-table").innerHTML = ""; //先清空div
    var ListHtml = '<div class="row-fluid" style="font-weight: bold;"><span class="SearchTime">开始时间</span><span class="SearchTime">结束时间</span><span class="SearchTime">设备编号</span><span class="SearchTT" style="text-align:center;">标题</span><span class="SearchTime">线路</span><span class="SearchXB">行别</span><span class="SearchTime">进度</span><span class="SearchXB">播放</span></div>'

    Url = '/C3/PC/MLiveStreaming/RemoteHandlers/VedioRecorder.ashx?action=query&LOCOMOTIVE_CODE=' + Txtloccode + '&LINE_NAME=' + Locationname + '&LINE_CODE=' + Locationcode + '&DIRECTION=' + direction + '&title=' + SearchTitle + '&pageIndex=' + page + '&pageSize=' + pageSize;
    $.ajax({
        type: 'POST',
        url: Url,
        async: true,
        cache: false,
        success: function (obj) {
            if (obj.data.length > 0) {
                for (var i = 0; i < obj.data.length; i++) {
                    ListHtml += '<div class="row-fluid"><span class="SearchTime">' + obj.data[i].Record_StartDate + '</span><span class="SearchTime">' + obj.data[i].Record_EndDate + '</span><span class="SearchTime">' + obj.data[i].LOCOMOTIVE_CODE + '</span><span class="SearchTT">' + obj.data[i].TITLE + '</span><span class="SearchTime">' + obj.data[i].LINE_NAME + '</span><span class="SearchXB">' + obj.data[i].DIRECTION + '</span><span class="SearchTime"><div class="progressbar progressbar' + i + '" code="' + obj.data[i].progress + '"></div></span><span class="SearchXB"><span class="SearchBF" id="' + obj.data[i].ID + '"></span></span></div>';
                }
                document.getElementById("Search-table").innerHTML = ListHtml;
                //播放俺牛

                $(".SearchBF").click(function () {
                    requestNumber = 0;//重置请求次数  同名play.js里面
                    Bowclick = 0;//弓位置默认第一个   同名play.js里面
                    playId = $(this).attr('id')
                    sildenumberQueryAjax(playId)//同名play.js里面
                    layer.closeAll();
                })
                for (var y = 0; y < obj.data.length; y++) {
                    $(".progressbar" + y).progressbar({
                        value: parseInt($(".progressbar" + y).attr("code")),
                        complete: function () {
                            progressLabel.text("完成！");
                        }
                    })
                };

            } else {
                layer.alert("无数据", { icon: 5 });
                $(".layui-layer-ico5").parent().parent().css('backgroundColor', 'white');
            }
            SetPage(obj);  //分页
        }
    });
};

///设置分页显示
function SetPage(obj) {
    PageCount = parseInt(obj.totalPages);
    $("#page-numb").val(obj.pageIndex);
    $("#pageCount").html(PageCount);
    $("#Count").html(obj.total_Rows);
    $("#PageSize").html(obj.Current_pagesize); 
};

function ShowSearchBox() {
    layer.open({
        title: false,
        area: '1190px',
        type: 1,
        shade: 0.5,
        content: $("#Search-Box"),
        success: function () {
            QueryVedio(1);
        }
    })
};
function GetLocaPlayMemo_GT(locomotiveCode) {
    var url = '/C3/PC/MLiveStreaming/RemoteHandlers/VideoDeviceInfoHandler.ashx?type=getLocomotiveVideoInfo_GT&locomotiveCode=' + escape(locomotiveCode);
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        cache: false,
        success: function (result) {
            if (result != "") {
                json_config = eval('(' + result + ')');
            }
        }
    })

};
function GetIp(json,code) {
    switch (code) {
        case "ip1_A":
            if (json.ip1_A != undefined) {
                return json.car1_A;//16编组，
            }

            if (json.ipA != undefined) {
                return json.carA;//非16编组，改过默认车厢号
            }

            break;
        case "ip1_B":

            if (json.ip1_B != undefined) {
                return json.car1_B; //16编组，
            }

            if (json.ipB != undefined) {
                return json.carB;//非16编组，改过默认车厢号
            }

            break;
        case "ip2_A":
            return json.car2_A;
            break;
        case "ip2_B":
            return json.car2_B;
            break;
        case "ip_A":
            if (json_config.VIDEO_VENDOR == "GT2-HIKVISION-DC") { //动车
                return json.carA;
            } else {
                return json.ipA;
            };
            break;
        case "ip_B":
            if (json_config.VIDEO_VENDOR == "GT2-HIKVISION-DC") { //动车
                return json.carB;
            } else {
                return json.ipB;
            };
            break;
    }
};