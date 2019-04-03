var json_config_json;  //车弓位置

window.onload = function () {
    IsEnable(); //判断按钮缩小 、全屏是否显示
}

$(document).ready(function () {
    var W_Width = window.parent._Width;
    var H_Height = window.parent._Height;
    //点击缩小按钮，加载其余iframe
    $("#suoxiao").click(function () {
        $("#play1", window.parent.document).animate({ "top": "0", "left": "0" });
        $("#play3", window.parent.document).animate({ "top": "0", "right": "0" }).show();
        $("#play4", window.parent.document).animate({ "top": "50%", "left": "0" }).show();
        $("#play5", window.parent.document).animate({ "top": "50%", "right": "0" }).show();
        $(this).hide();
        $("#tuiChu").hide();
        $("#out-full").hide();
        $('#btn_map').show();
        $("#btn_map_bottom").hide();
        $(".button-back", window.parent.document).show();
        var play1Height = parseInt($("#play1", window.parent.document).css("height"));


        $("#play1,#play2", window.parent.document).css({ "height": play1Height - 68 });
        $("#Iframe_bigPlay1,#Iframe_bigPlay2", window.parent.document).css({ "height": play1Height - 68 });
        $('#playbox_mode1_1').height($(window).height() - 68);
        $('#playbox_mode3_1').height($(window).height() / 2 - 68);
        $('#playbox_mode3_2').height($(window).height() / 2);
        $('#playbox_mode3_3').height($(window).height() - 68);

        $("#Iframe_bigPlay3", window.parent.document).attr("src", "/C3/PC/MLiveStreaming/MonitorLocoPlayNew.htm?v=" + version);
        $("#Iframe_bigPlay4", window.parent.document).attr("src", "/C3/PC/MLiveStreaming/MonitorLocoPlayNew.htm?v=" + version);
        $("#Iframe_bigPlay5", window.parent.document).attr("src", "/C3/PC/MLiveStreaming/MonitorLocoPlayNew.htm?v=" + version);


        $("#allp", window.parent.document).css({ "position": "fixed", "z-index": "9999" })
        
    });
    //点击全屏按钮，加载全屏
    $("#full").click(function () {
        if ($(".MyLayerBox", window.parent.document).length) {
            $("#tuiChu").hide();
            $("#full").hide();
            $("#suoxiao").hide();
            $("#out-full").show();
            $(".MyLayerBox", window.parent.document).css({ "margin": 0, "position": "absolute", "width": window.parent._w * 2, "height": window.parent._H * 2, "top": "0", "left": "0" });
            $(".layui-layer-title", window.parent.document).css("display", "none");
            $(".layui-layer-content", window.parent.document).css({ "width": window.parent._w * 2, "height": window.parent._H * 2 });
            $(".iframe_MyLayerBox", window.parent.document).css({ "width": window.parent._w * 2, "height": window.parent._H * 2, "top": "0", "left": "0", "z-index": "10501", "position": "absolute" });
            autosize();
        };
        var Iframe_ID = '#' + window.name;  //获取iframe的ID
        var Iframe_div_ID = '#' + $(Iframe_ID, window.parent.document).parent().attr("id");//获取iframe外面的DIV的ID
        var loc_namber = $("#locomotive_no").html();//获取本iframe的编号
        var Iframe_Src = "/C3/PC/MLiveStreaming/MonitorLocoPlayNew.htm?loca=" + loc_namber + '&v=' + version;//获取本iframe的连接
        $(Iframe_div_ID, window.parent.document).css({ "top": "0", "left": "0", "z-index": "10501" });
        $(Iframe_div_ID, window.parent.document).css({ "width": W_Width, "height": H_Height });
        $(Iframe_ID, window.parent.document).css({ "width": W_Width, "height": H_Height });
        // $(Iframe_ID, window.parent.document).attr("src", Iframe_Src);
        $(".button-back", window.parent.document).hide();
        $("#full").hide();
        $("#out-full").show();
        $("#tuiChu").hide();
        $("#suoxiao").hide();
        $('#btn_map').show();
        $("#btn_map_bottom").hide();


        if (window.name == "Iframe_bigPlay1") {
            $("#play4,#play5", window.parent.document).hide();
        }
        if (window.name == "Iframe_bigPlay3") {
            $("#play1,#play4,#play5", window.parent.document).hide();
        }
        if (window.name == "Iframe_bigPlay4") {
            $("#play1,#play5", window.parent.document).hide();
        }
        if (window.name == "Iframe_bigPlay5") {
            $("#play4,#play1", window.parent.document).hide();
        }

        if (window.name == "four-screen-1") {
            $("#four-screen-1", window.parent.document).siblings().hide();
        } else if (window.name == "four-screen-2") {
            $("#four-screen-2", window.parent.document).siblings().hide();
        } else if (window.name == "four-screen-3") {
            $("#four-screen-3", window.parent.document).siblings().hide();
            $("#four-screen-3", window.parent.document).css("top", "0");
        } else if (window.name == "four-screen-4") {
            $("#four-screen-4", window.parent.document).siblings().hide().css("top", "0");
            $("#four-screen-4", window.parent.document).css("top", "0");
        };

        autosize();
        window.parent.AutoSize();

    });
    //点击退出全屏按钮
    $("#out-full").click(function () {
        if ($(".MyLayerBox", window.parent.document).length) {
            $("#tuiChu").show();
            $("#full").show();
            $("#suoxiao").hide();
            $("#out-full").hide();
            $(".MyLayerBox", window.parent.document).css({ "margin": "", "position": "", "width": "800", "height": "600", "top": "50%", "left": "", "margin-left": -400, "margin-top": -300 });
            $(".layui-layer-title", window.parent.document).css("display", "block");
            $(".layui-layer-content", window.parent.document).css({ "width": "800", "height": "600" });
            $(".iframe_MyLayerBox", window.parent.document).css({ "width": "800", "height": "557", "top": "", "left": "", "z-index": "", "position": "" });
            autosize();
            return;
        };
        var Iframe_ID = '#' + window.name;  //获取iframe的ID
        var Iframe_div_ID = '#' + $(Iframe_ID, window.parent.document).parent().attr("id");//获取iframe外面的DIV的ID
        var loc_namber = $("#locomotive_no").html(); //获取本iframe的编号
        var Iframe_Src = "/C3/PC/MLiveStreaming/MonitorLocoPlayNew.htm?loca=" + loc_namber + '&v=' + version;//获取本iframe的连接

        $(Iframe_div_ID, window.parent.document).css({ "width": W_Width / 2, "height": H_Height / 2 });
        $(Iframe_ID, window.parent.document).css({ "width": W_Width / 2, "height": H_Height / 2 });
        //  $(Iframe_ID, window.parent.document).attr("src", Iframe_Src);
        $(".button-back", window.parent.document).show();
        $("#full").show();
        $("#out-full").hide();
        $("#tuiChu").hide();
        $("#suoxiao").hide();



        if (window.name == "Iframe_bigPlay1") {
            if ($("#play3", window.parent.document).css("display") == "none") {
                $("#play1", window.parent.document).css({ "top": H_Height / 4 - 68, "left": W_Width / 4, "width": W_Width / 4 * 2, "height": (H_Height / 4 * 2) + 68, "z-index": "10500" });
                $("#Iframe_bigPlay1", window.parent.document).css({ "width": W_Width / 4 * 2, "height": (H_Height / 4 * 2) + 68 });
                //     $("#Iframe_bigPlay1", window.parent.document).attr("src", Iframe_Src);
                autosize();
                $("#tuiChu").show();
                $("#suoxiao").show();
                $('#btn_map').hide();
                $("#btn_map_bottom").show();
                $(".button-back", window.parent.document).hide();
            } else {
                $(Iframe_div_ID, window.parent.document).css({ "top": "0", "left": "0", "z-index": "10500" });
                $("#play3,#play4,#play5", window.parent.document).show();
            }
        } else if (window.name == "Iframe_bigPlay3") {
            $(Iframe_div_ID, window.parent.document).css({ "top": "0", "left": "50%", "z-index": "10500" });
            $("#play1,#play4,#play5", window.parent.document).show();
        } else if (window.name == "Iframe_bigPlay4") {
            $(Iframe_div_ID, window.parent.document).css({ "top": "50%", "left": "0", "z-index": "10500" });
            $("#play1,#play3,#play5", window.parent.document).show();
        } else if (window.name == "Iframe_bigPlay5") {
            $(Iframe_div_ID, window.parent.document).css({ "top": "50%", "left": "50%", "z-index": "10500" });
            $("#play1,#play4,#play3", window.parent.document).show();
        } else if (window.name == "four-screen-1") {
            $(Iframe_div_ID, window.parent.document).css({ "width": W_Width, "height": H_Height });
            $("#four-screen-1", window.parent.document).siblings().show();
        } else if (window.name == "four-screen-2") {
            $(Iframe_div_ID, window.parent.document).css({ "width": W_Width, "height": H_Height });
            $("#four-screen-2", window.parent.document).siblings().show();
        } else if (window.name == "four-screen-3") {
            $(Iframe_div_ID, window.parent.document).css({ "width": W_Width, "height": H_Height });
            $("#four-screen-3", window.parent.document).siblings().show();
            $("#four-screen-3", window.parent.document).css("top", "50%");
        } else if (window.name == "four-screen-4") {
            $(Iframe_div_ID, window.parent.document).css({ "width": W_Width, "height": H_Height });
            $("#four-screen-4", window.parent.document).siblings().show();
            $("#four-screen-4", window.parent.document).css("top", "50%");
            $("#four-screen-3", window.parent.document).css("top", "50%");
        };
        autosize();
        window.parent.AutoSize();
    });

    //控制车顶实时监测页面的关闭按钮
    //if ($('#loca_info').text() != '') {
    //    $(".closeX", window.parent.document).hide();
    //};

    $("#BtnSubmit").click(function () {
        var Locomotivecode = $("#locomotive_NB").text(); //车号
        var Startime = $("#new-strTime").val(); //开始时间
        var BowPostition = ""; //所选弓位置
        GetLocaPlayMemo_GTs(Locomotivecode);//根据车号取得json
        $("#OriginalFile_txt_AB").find("input[name='GWZ']").each(function () {
            if ($(this).is(":checked")) {
                var Values = $(this).val();
                var ip = GetIp_down(json_config_json, Values);  //取得弓位置
                BowPostition = ip.replace(Locomotivecode, "").replace("#", "%23");
            }
        })

        var _url = '/C3/PC/MLiveStreaming/RemoteHandlers/VedioRecorder.ashx?action=getOrigin&LOCOMOTIVE_CODE=' + Locomotivecode + '&BowPostition=' + BowPostition + '&starttime=' + Startime;

        $.ajax({
            type: 'POST',
            dataType: 'text',
            url: _url,
            async: true,
            cache: false,
            success: function (result) {
                if (result == "正常") {
                    if ($(document).width() < 770) {
                        layer.msg("获取成功，请到249去查找！", { offset: ['66%', '20%'] });
                    } else {
                        layer.msg("获取成功，请到249去查找！", { offset: ['64%', '29.2%'] });
                    }
                } else {
                    if ($(document).width() < 770) {
                        layer.msg(result, { offset: ['66%', '20%'], icon: 5 });
                    } else {
                        layer.msg(result, { offset: ['64%', '30.2%'], icon: 5 });
                    }
                }
            }
        })

    });

    $("#TimeAddOne").click(function () {
        var OldTime = new Date($("#new-strTime").val()); //
        if ($("#new-strTime").val() != "") {
            $("#new-strTime").val(new Date(OldTime.setSeconds(OldTime.getSeconds() + 1)).format("yyyy-MM-dd hh:mm:ss"));
        } else {
            layer.msg("请先选择时间!");
        }
    });

});
function GetIp_down(json, code) {
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
            if (json_config_json.VIDEO_VENDOR == "GT2-HIKVISION-DC") { //动车
                return json.carA;
            } else {
                return json.ipA;
            };
            break;
        case "ip_B":
            if (json_config_json.VIDEO_VENDOR == "GT2-HIKVISION-DC") { //动车
                return json.carB;
            } else {
                return json.ipB;
            };
            break;
    }
};
//得到设备播放参数。
function GetLocaPlayMemo_GTs(locomotiveCode) {
    var url = '/C3/PC/MLiveStreaming/RemoteHandlers/VideoDeviceInfoHandler.ashx?type=getLocomotiveVideoInfo_GT&locomotiveCode=' + escape(locomotiveCode);
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        cache: false,
        success: function (result) {
            if (result != "") {
                json_config_json = eval('(' + result + ')');
            }
        }
    })
};

/**
 * @desc 判断按钮缩小 、全屏是否显示
 * @param 
 */
function IsEnable() {
    // 打开新页面时，无全屏和缩小功能按钮
    if (self.frameElement === null) { // 新页面
        $($(document).find('#suoxiao')).addClass('hide').css({ 'display': 'none' });
        $($(document).find('#full')).addClass('hide').css({ 'display': 'none' });
    } else { // 弹出框
        $($(document).find('#suoxiao')).removeClass('hide').css({ 'display': 'inline-block' });
        $($(document).find('#full')).removeClass('hide').css({ 'display': 'inline-block' });
    }
}