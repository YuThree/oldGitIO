(function ($) {
    $.fn.powersection = function (p) {
        var defaults = {
            //设置参数

        };
        var opts = $.extend(defaults, p);
        //添加节点
        $(this).append('<div id="TreeTitle"><p class="TreeTitle_p1 TreeTitle_active">途经3C设备</p><p class="TreeTitle_p2">管辖3C设备</p></div><div id="Treecontents"><ul class="Treecontents_ul1"></ul><ul class="Treecontents_ul2"></ul></div>');
        //ul添加节点
        //var contentsul1 = '<li><span>CRH2A-2227</span><span>北京供电段</span></li><li><span>CRH2A-2226</span><span>南宁供电段</span></li>';
        //var contentsul2 = '<li><span>CRH2A-2226</span><span>乌木鲁齐供电段</span></li><li><span>CRH2A-2226</span><span>天津供电段</span></li>';
        var contentsul1 = "";
        var contentsul2 = "";
        var resultjson;
        $.ajax({
            type: "GET",
            url: "/C3/PC/MRTA/RemoteHandlers/BMapC3DataPoint.ashx?type=1&mislineid=&key=&order=locomotive_code",
            dataType:'json',
            cache: false,
            async: false,
            success: function (result) {
                resultjson = result;
            },
            error: function () {
                alert("连接失败");
            }
        });
        for (var i = 0; i < resultjson.length; i++) {
            if (resultjson[i].type.indexOf("途经") != -1) {
                contentsul1 += '<li index="'+i+'"><span>' + resultjson[i].TRAIN_NO + '</span><span>' + resultjson[i].P_ORG_NAME + '</span></li>';
            }
            if (resultjson[i].type.indexOf("自有") != -1) {
                contentsul2 += '<li index="' + i + '"><span>' + resultjson[i].TRAIN_NO + '</span><span>' + resultjson[i].P_ORG_NAME + '</span></li>';
            }
        };
        $(".Treecontents_ul1").html(contentsul1);
        $(".Treecontents_ul2").html(contentsul2);
        //判断设备是否在线
        function OnLine() {
            var url = '/C3/PC/MLiveStreaming/RemoteHandlers/VideoDeviceInfoHandler.ashx?type=getOnlineLoco';
            $.ajax({
                type: "POST",
                url: url,
                async: true,
                cache: false,
                success: function (result) {

                    //alert($("#Treecontents").find("li").length);
                    $("#Treecontents").find("li").each(function () {

                        var c_loco = $(this).children("span").eq(0).text();


                        var relist = result.split(',');

                        for (var i = 0; i < relist.length; i++)
                        {
                            if (relist[i].indexOf(c_loco) > -1) {
                                $(this).css("color", "#9CEF9C");
                                $(this).attr('onlinePort', relist[i]) // _A _B #1_A #1_B #2_A #2_B
                                break;
                            }
                            else {
                                $(this).css("color", "#89898E");

                            }
                        }

                        
                    })
                },
                error: function () { }

            });
        };
        OnLine();
        
        //点击li车号
        $("#Treecontents").find("li").on("click", function (event) {
            var spanhtm = $(this).children("span").eq(0).html();
            document.getElementById("locomotive_no").innerHTML = spanhtm;
            $('#Iframe_gis').hide();//关闭地图控件
            ReSetImg(); //切换时，图片还原默认。
            //$('#div_ckLink').show();
            //控制车顶实时监测页面关闭按钮
            if ($(".closeX", window.parent.document).css("display") == "block") {
                $("#suoxiao").show();
                $("#tuiChu").show();
            };
            if ($(".closeX", window.parent.document).css("display") == "block" && $("#play4", window.parent.document).css("display") == "block") {
                $("#suoxiao").hide();
                $("#tuiChu").hide();
            };
            if ($("#MyShowBox", window.parent.document).attr("aria-hidden") == "false") {
                $("#suoxiao").hide();
            };

            var index = $(this).attr('index');

            
            //if (AJSON != "" && AJSON != null){
         //   for (var y = 0; y < AJSON.length; y++) {
            //    if (AJSON[y].name == spanhtm) {

            var relations=resultjson[index].DEVICE_BOW_RELATIONS;

            Getrelations(relations);

            
            var onlinePort = $(this).attr('onlinePort');
            if (onlinePort != undefined && onlinePort != '' && $("#MyShowBox", window.parent.document).attr("aria-hidden") != "false")
            {
                //显示在线的一端。
                var carNo = GetCarNo(onlinePort, relations);
                $('#txt_AB').text(carNo);
            }

             //       if (AJSON[y].treeType != "LOCOMOTIVE") return;
                    GetLocaPlayMemo_GT({
                        locomotiveCode: spanhtm,
                        LoadCallback: function (json) {
                            changeBtns(json);
                            loadLocaInfo();

                            var page = GetQueryString("page");
                            if (page != undefined && page == 'meta_big') {

                                window.parent.SetPlayGisUrl(spanhtm);

                            }

                            clearInterval(TT_locaInfo)
                            TT_locaInfo = setInterval('loadLocaInfo()', t_locaInfo);

                        }
                    });
           //     }
           // }
           // }
            $('#TreeAll').fadeOut();
            Stop_GT();
            setTimeout(Play_GT, 2000);
        });
        //鼠标移过li
        $("#Treecontents").find("li").hover(function(){
            $(this).addClass("Treecontents_ul_active").siblings().removeClass("Treecontents_ul_active");
        }, function () {
            $(this).removeClass("Treecontents_ul_active");
        });
        $(".TreeTitle_p1").click(function () {
            $(".Treecontents_ul1").show();
            $(".Treecontents_ul2").hide();
            $(this).addClass("TreeTitle_active").siblings().removeClass("TreeTitle_active");
            $(this).css("borderBottom", "none");
            $(".TreeTitle_p2").css("borderBottom", "2px solid #9CDCFE");
        });
        $(".TreeTitle_p2").click(function () {
            $(".Treecontents_ul1").hide();
            $(".Treecontents_ul2").show();
            $(this).addClass("TreeTitle_active").siblings().removeClass("TreeTitle_active");
            $(".TreeTitle_p1").css("borderBottom", "2px solid #9CDCFE");
            $(this).css("borderBottom", "none")
        });
    }

})(jQuery);