var pagesize = 10;//页大小
var OnClickNumber = 1;
var map;
var point1;
var first = true;
var pageUrl = "";
$(document).ready(function () {
    doQuery();
    if (FunEnable('Fun_Satellite') != "True") {
        $("#gisX").parent().hide();
    }

});

function doQuery() {

    var pageUrl = '/C3/PC/MDeviceStatus/RemoteHandlers/MonitorLocoStateListCombine.ashx?' + window.location.href.split('?')[1];
    goPage(1, 10, false, pageUrl);
}

function goPage(_page, _size, firstload, url) {
    fullShow();
    if (url == undefined) {
        url = "/C3/PC/MDeviceStatus/RemoteHandlers/MonitorLocoStateListNew.ashx";
    }
    $.ajax({
        type: "POST",
        url: url,
        data: 'page=' + _page + '&size=' + _size + '&startdate=' + $("#startdate").val() + '&enddate=' + $("#enddate").val(),
        async: true,
        cache: true,
        success: function (result) {
            json = eval('(' + result + ')');
            var pageNum = 10;
            if (json != null && json != undefined) {
                if (json.list.length === 0) {
                    $('#flexTable').html('');
                    var top = (document.body.clientHeight - $('#flexTable').offset().top) / 2;
                    var left = (document.body.clientWidth - $('#flexTable').offset().left) / 2;
                    $('#flexTable').css({
                        'background-image': 'url(/Common/img/table_no_data.png)',
                        'background-repeat': 'no-repeat',
                        'background-position-x': left - 200 + 'px',
                        'background-position-y': top - 120 + 'px',
                        'min-height': '405px'
                    });
                    fullHide();
                } else {
                    $('#flexTable').html('');
                    $('#flexTable').css({
                        'background-image': ''
                    });
                    pageNum = Math.ceil(json.totalCount / _size);
                    getPageContent(json);
                }
            }
            fullHide();
            pagegogogo();

        }
    });
};

function getPageContent(json) {

    template.helper("convert", function (v) {
        if (getConfig("debug") == "0") {
            return "<i class='glyphicon glyphicon-ok' title='正常'></i>";
        } else {
            if (v == "正常" || v == '1') {
                return "<i class='glyphicon glyphicon-ok' title='正常'></i>";
            } else if (v == "异常" || v == "" || v == '0') {
                return "<i class='glyphicon glyphicon-remove' title='异常'></i>";
            }
            else {
                return "";
            }
        }
    });
    template.helper("convert_bow_status", function (v) {
        if (v == "升") {
            return "<i class='glyphicon glyphicon-arrow-up' title='升弓'></i>";
        } else {
            return "<i class='glyphicon glyphicon-arrow-down' title='降弓'></i>";
        }
    });
    template.helper("is_debug", function () {

        return true;

    });
    var html = template('test', json);

    $("#flexTable").html(html);
    //主板状态只在内部动车版显示
    if (getConfig('debug') == "1" && FunEnable('Fun_isCRH') == "True") {
        $('.outside_box').css('min-width', '1475px')
        $('.mainboard_State').show()
    }
    //特殊样式处理
    $('.rail-2').each(function () {
        if ($(this).children('.rail_num_all').height() > 65) {
            $(this).find('.col_400').css('height', $(this).height() - 29)
        }
    })
    //机车隐藏辅助相机列
    if (FunEnable('Fun_isCRH') == "False") {
        $('.outside_box').css('min-width', '1168px')
        //console.log('%c' + $('.outside_box').css('min-width'), 'background-image:-webkit-gradient( linear, left top, right top, color-stop(0, #f22), color-stop(0.15, #f2f), color-stop(0.3, #22f), color-stop(0.45, #2ff), color-stop(0.6, #2f2),color-stop(0.75, #2f2), color-stop(0.9, #ff2), color-stop(1, #f22) );color:transparent;-webkit-background-clip: text;font-size:5em;');
        $(".FU_HIDE").hide();

    }
    if (FunEnable('Fun_Equipment_status_video_input') == "True") {
        $('.glyphicon-time').parent().click(function () {
            var timeStr = $(this).children().last().text();
            var loca = $(this).siblings().first().children().text();
            var cDate2 = new Date(timeStr);
            var cdate2_times = parseInt(cDate2.getTime());
            var url = '/C3/PC/MLiveStreaming/MonitorLocoPlayNew.htm?page=meta_big&btn_tc=0&replay=1&playtime=' + cdate2_times + '&loca=' + loca + '&wz='
            window.open(url)
        })


    } else {
        $('.glyphicon-time').siblings().children().css('color', '#555')
        $('.glyphicon-time').siblings().hover(function () { $(this).children().css({ 'text-decoration': 'none', 'color': '#555', 'cursor': 'auto' }).attr('title', '') }, function () { })
    }
    $(".body").css("height", $(window).height() - 120);


};

function Map(wz, gis_x, gis_y) {


    if (OnClickNumber == 1) {
        Bmaps(gis_x, gis_y);
    } else {
        var point = new BMap.Point(gis_x, gis_y);    // 创建点坐标
        point1 = new BMap.Point(parseFloat(gis_x) - 1.54, parseFloat(gis_y) + 0.85);    // 创建点坐标
        var icon = new BMap.Icon("/Common/MRTA/img/动车.png", new BMap.Size(36, 44));
        var marker = new BMap.Marker(point, { icon: icon });
        map.clearOverlays();    //清除地图上所有覆盖物
        map.centerAndZoom(point1, 9); // 初始化地图，设置中心点坐标和地图级别。
        map.addOverlay(marker);
    }


    document.getElementById('_WZ').innerHTML = wz; //GIS_X
    document.getElementById('gisX').innerHTML = gis_x; //GIS_X
    document.getElementById('gisY').innerHTML = gis_y; //GIS_Y

    $('#box_gis').modal().css({
        width: 'auto',
        'margin-left': function () {
            return -($(this).width() / 2);
        },
        'margin-top': function () {
            return -($(this).height() / 2);
        }
    });

    // document.getElementById('modal-22256').click();

    map.centerAndZoom(point1, 9);

    setTimeout(function () {
        $('.anchorBL,. anchorBL').hide();
        //   $('#mapDiv span').hide();
    }, 500)


};

function Bmaps(gis_x, gis_y) {
    OnClickNumber = OnClickNumber + 1;
    //var map = new BMap.Map("mapDiv", { mapType: BMAP_HYBRID_MAP }); // 创建Map实例
    //   map = new BMap.Map("mapDiv"); // 创建Map实例
    map = new BMap.Map("mapDiv", { mapType: BMAP_HYBRID_MAP }); // 创建Map实例

    //    if (GPSJson.GIS_X != "0") {
    var point = new BMap.Point(gis_x, gis_y);    // 创建点坐标
    point1 = new BMap.Point(parseFloat(gis_x) - 1.54, parseFloat(gis_y) + 0.85);    // 创建点坐标
    map.clearOverlays();    //清除地图上所有覆盖物
    map.centerAndZoom(point1, 9); // 初始化地图，设置中心点坐标和地图级别。

    map.enableScrollWheelZoom();
    map.enableKeyboard();
    map.disableDoubleClickZoom();

    var icon = new BMap.Icon("/Common/MRTA/img/动车.png", new BMap.Size(36, 44));
    var marker = new BMap.Marker(point, { icon: icon });
    map.addOverlay(marker);

    //map.panTo(point);
    //    }
    //     else {
    //        var point = new BMap.Point(GPSJson.GIS_X_O, GPSJson.GIS_Y_O);    // 创建点坐标
    //        point1 = new BMap.Point(parseFloat(GPSJson.GIS_X_O) - 1.54, parseFloat(GPSJson.GIS_Y_O) + 0.85);    // 创建点坐标
    //        map.clearOverlays();    //清除地图上所有覆盖物
    //        map.centerAndZoom(point1, 9); // 初始化地图，设置中心点坐标和地图级别。

    //        map.enableScrollWheelZoom();
    //        map.enableKeyboard();
    //        map.disableDoubleClickZoom();

    //        var Point = new BMap.Point(GPSJson.GIS_X_O, GPSJson.GIS_Y_O);
    //        BMap.Convertor.translate(Point, 0, GPSZH, 0)
    //    }
    //  map.addControl(bmapUserTopOneRightInfo);
    //  map.addControl(new BMap.OverviewMapControl());
    map.addControl(new BMap.MapTypeControl({ anchor: BMAP_ANCHOR_TOP_LEFT }));    //左上角，默认地图控件
    map.setCurrentCity("武汉");   //由于有3D图，需要设置城市哦
    // var cr = new BMap.CopyrightControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT });
    // map.addControl(cr); //添加版权控件
    //  cr.addCopyright({ id: 1, content: "<a href='http://www.railwaytec.com'></a>" });


};

function pagegogogo() {

    $('#layPage').paging({
        index: 1,
        url: function () {
            pageindex = $('.pageValue').val();
            return '/C3/PC/MDeviceStatus/RemoteHandlers/MonitorLocoStateListCombine.ashx?' + window.location.href.split('?')[1] + '&page=' + pageindex + '&size=' + pagesize
        },
        beforeSend: function () {
            //alert($('html').height())
            //console.log($('body').height())
            //console.log($(window).height())
            fullShow()
        },
        success: function (re) {

            if (re.list.length < 1) {
                layer.msg('没有数据');
            }
            if (re != null && re != undefined) {
                getPageContent(re);
            }
            fullHide();
            $('.page_input').css('margin-bottom', '0');
        }

    })


}