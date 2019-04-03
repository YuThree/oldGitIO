
// 功能说明：设备编号点击图标选择局段号。
//插件开始
(function ($) {
    $.fn.LocoSelect = function (options) {  //设置默认参数
        var defaults = {
            type: 'none',
            contant: 0,
            position:0,
        };
        var opts = $.extend(defaults, options); //接收传进来参数
        var id_name = $(this).attr("id");//插件对象id
        //默认文字

        $(this).attr("placeholder", "请输入关键字");
        //创建图标

        $(this).parent().append('<span class="glyphicon glyphicon-list select_icon" data-rel="tooltip" title="按组织机构选择设备"></span>');
        //$('[rel="tooltip"],[data-rel="tooltip"]').tooltip({ "placement": "right", delay: { show: 0, hide: 0 }, });
        //创建节点
        $(this).parent().append('<div id="droup_' + id_name + '"><img src="/Common/img/trainclose.png" alt="关闭" /><div id="droup_title_' + id_name + '" class="droup_title"><div class="droup_title_ju">选择铁路局<span class="glyphicon glyphicon-chevron-down"></span></div><div class="droup_title_duan"></div><div class="droup_title_hao"></div></div><div id="droup_body_' + id_name + '"  class="droup_body"><div id="droup_body_ju_' + id_name + '"  class="droup_body_ju"></div><div id="droup_body_duan_' + id_name + '"  class="droup_body_duan"></div><div id="droup_body_hao_' + id_name + '"  class="droup_body_hao"></div></div></div>');

        var div_id = $("#droup_" + id_name);  //div id

        div_id.addClass("ulContainer");
        //绑定点击事件
        $(this).siblings("span.select_icon").on("click", function (e) {
            div_id.toggle();
            e.stopPropagation();
        });
        //点击关闭图片
        $(".ulContainer img").click(function (e) {
            $(".ulContainer").hide();
            e.stopPropagation();
        });
        //点击其余地方关闭弹出框
        $(document).click(function () {
            div_id.hide();
        });
        //点击div本身不关闭
        $(div_id).click(function (e) {
            div_id.show();
            e.stopPropagation();
        });

        //获取数据
        var resultjson;
        var url = '/Common/RemoteHandlers/GetTrees.ashx?tag=LOCOMOTIVE';
        var tempAshx = '';
        tempAshx = (url.split('.ashx')[0]).split('/');
        tempAshx = tempAshx[tempAshx.length - 1];
        var _param = 'S_LocoSelect_{' + tempAshx + ',LOCOMOTIVE}';
        if ('' !== localStorage[_param] && undefined !== localStorage[_param] && localStorage['S_Cache_control_data'] === 'True') {
            resultjson = eval('(' + localStorage[_param] + ')');
        } else {
            $.ajax({
                type: 'post',
                url: url,
                cache: false,
                async: false,
                success: function (result) {
                    localStorage[_param] = result; //保存在本地缓存中
                    resultjson = eval('(' + result + ')');
                },
                error: function () {
                    alert("连接错误");
                }
            });
        }
        //还原div
        if ($("#droup_title_" + id_name).children().length > 1) {
            $("#droup_title_" + id_name).find($(".droup_title_duan")).hide();
            $("#droup_title_" + id_name).find($(".droup_title_hao")).hide();
        } 



        //默认加载数据
        for (var i = 0; i < resultjson.length; i++) {
            if (resultjson[i].pId == 0) {
                $("#droup_title_" + id_name).find($(".droup_title_ju")).addClass("droup_title_active");
                var juInner = '<span class="droup_body_JU">' + resultjson[i].name + '</span>';
                document.getElementById("droup_body_ju_" + id_name).innerHTML += juInner;
            }
        };
        //点击局弹出段
        $("#droup_body_ju_" + id_name).find(".droup_body_JU").on("click", function () {
            $("#droup_body_ju_" + id_name).hide();
            $("#droup_body_duan_" + id_name).show();
            $("#droup_title_" + id_name).find($(".droup_title_hao")).hide();
            document.getElementById("droup_body_duan_" + id_name).innerHTML = "";
            var jutext = $(this).text();
            $("#droup_title_" + id_name).find($(".droup_title_ju")).html(jutext + '<span class="glyphicon glyphicon-chevron-down"></span>');
            $("#droup_title_" + id_name).find($(".droup_title_duan")).show().html('选择段<span class="glyphicon glyphicon-chevron-down"></span>')
                                  .addClass("droup_title_active").siblings().removeClass("droup_title_active");
            for (var i = 0; i < resultjson.length; i++) {
                if (resultjson[i].name == jutext) {
                    var duanInner = "";
                    for (var y = 0; y < resultjson.length; y++) {                      
                        if (resultjson[i].id == resultjson[y].pId) {
                            duanInner += '<span class="droup_body_DUAN">' + resultjson[y].name + '</span>';  
                        };
                    };
                    document.getElementById("droup_body_duan_" + id_name).innerHTML = duanInner;
                };
            };
            //点击段弹出车号
            $("#droup_body_duan_" + id_name).find(".droup_body_DUAN").on("click", function () {
                $("#droup_body_duan_" + id_name).hide();
                $("#droup_body_hao_" + id_name).show();
                document.getElementById("droup_body_hao_" + id_name).innerHTML = "";
                var duantext = $(this).text();
                $("#droup_title_" + id_name).find($(".droup_title_duan")).html(duantext + '<span class="glyphicon glyphicon-chevron-down"></span>');
                $("#droup_title_" + id_name).find($(".droup_title_hao")).show().html('选择编号<span class="glyphicon glyphicon-chevron-down"></span>')
                                      .addClass("droup_title_active").siblings().removeClass("droup_title_active");
                for (var a = 0; a < resultjson.length; a++) {
                    if (resultjson[a].name == duantext) {
                        var haoInner = "";
                        for (var b = 0; b < resultjson.length; b++) {
                            if (resultjson[a].id == resultjson[b].pId) { 
                                haoInner += '<span class="droup_body_HAO">' + resultjson[b].name + '</span>';
                            };
                        };
                        document.getElementById("droup_body_hao_" + id_name).innerHTML = haoInner;
                    };
                };
                //点击车号赋值绑定对象
                $("#droup_body_hao_" + id_name).find(".droup_body_HAO").on("click", function (e) {
                    var haotext = $(this).text();
                    $("#" + id_name).val(haotext);
                    div_id.hide();
                    e.stopPropagation();
                });
            });
        });
        //点击局标题
        $("#droup_title_" + id_name).find($(".droup_title_ju")).on("click", function () {
            $("#droup_body_ju_" + id_name).show().siblings().hide();
            $(this).addClass("droup_title_active").siblings().removeClass("droup_title_active");
        });
        $("#droup_title_" + id_name).find($(".droup_title_duan")).on("click", function () {
            $("#droup_body_duan_" + id_name).show().siblings().hide();
            $(this).addClass("droup_title_active").siblings().removeClass("droup_title_active");
        });
        $("#droup_title_" + id_name).find($(".droup_title_hao")).on("click", function () {
            $("#droup_body_hao_" + id_name).show().siblings().hide();
            $(this).addClass("droup_title_active").siblings().removeClass("droup_title_active");
        });
        //位置
        switch (opts.position) {
            case "MonitorLocoAlarmList":
                $(".select_icon").css({ "top": "-2px" });
                $('[rel="tooltip"],[data-rel="tooltip"]').tooltip({ "placement": "right", delay: { show: 0, hide: 0 }, });
                break;
            case "MonitorLocGJList":
                $(".select_icon").css({ "left":($('#S_btnMark').is(':hidden')?'-435px':'-550px'), "top": "-2px" });
                div_id.css({ "marginLeft": "310px" });
                $('[rel="tooltip"],[data-rel="tooltip"]').tooltip({ "placement": "top", delay: { show: 0, hide: 0 }, });
                break;
            case "mrta_big_loca":
                $(".select_icon").css({ "marginLeft": "-175px", "marginTop": "10px","position":"absolute" });
                div_id.css({ "right": "10px", "textAlign": "left", "whiteSpace": "normal", "top": "45px", "lineHeight": "18px" });
                break;
            case "MonitorLocoStateListNew":
                $(".select_icon").css({ "left": "-573px", "top": "-2px" });
                div_id.css({ "marginLeft": "65px" });
                $('[rel="tooltip"],[data-rel="tooltip"]').tooltip({ "placement": "right", delay: { show: 0, hide: 0 }, });
                break;
            case "RepeatAlarm":
                $(".select_icon").css({ "top": "-2px" });
                $('.tooltip-inner').width('120px');
                $('[rel="tooltip"],[data-rel="tooltip"]').tooltip({ "placement": "right", delay: { show: 0, hide: 0 }, });
                break;
            case "MonitorLocGJList_Mark":
                $(".select_icon").css({ "left": "-63px", "top": "-2px" });
                $('[rel="tooltip"],[data-rel="tooltip"]').tooltip({ "placement": "right", delay: { show: 0, hide: 0 }, });
        };
    };


})(jQuery);