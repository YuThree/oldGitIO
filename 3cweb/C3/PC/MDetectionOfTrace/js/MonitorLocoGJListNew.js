var pagesize = 10;
$(document).ready(function () {
    //机车隐藏辅助相机列
    if (FunEnable('Fun_isCRH') == "False") {
        $(".FU_HIDE").hide();
    }
    setTimeout('$(".body").css("height", ($(window).height() - 65) * 0.94)', 300);
    setTimeout('doQuery()', 100);
   // if (FunEnable('Fun_LOCSTATE_NEW') != "True") {
        //$(".head div[debug='true']").hide();
        //$(".head>.head-first").width("60%");
        //$(".head>.head-second").width("35%");
        //$(".head-first .col_200").width("25%");
        //$(".head-first .col_200").eq(1).width("23%");
        //$(".head-first .col_150").width("12%");
        //$(".head-first .col_100").width("10%");
        //$(".head-first .col_100").eq(0).width("11%");
        //$(".head-second .col_100").width("20%");
   // }

    if (getConfig("debug") == '0') {
        $('#gisX').parent().css('display', 'none');
    };
});

function doQuery() {
    var loccode = GetQueryString("locid"); //设备编码
    var startdate = GetQueryString("startdate"); //时间
    var enddate = GetQueryString("enddate"); //时间
    var direction = GetQueryString("DIRECTION"); //行别
    var linecode = GetQueryString("LINE_CODE"); //行别
    var jl = GetQueryString("jl"); //行别
    var OrgType = GetQueryString('OrgType'); //用户类别
    pageUrl = '/C3/PC/MDeviceStatus/RemoteHandlers/MonitorLocoStateListCombine.ashx?locid=' + loccode + '&startdate=' + startdate + '&enddate=' + enddate + '&LINE_CODE=' + linecode + '&jl=' + jl
    + '&direction=' + escape(direction)+ "&OrgType=" + OrgType+ '&temp=' + Math.random();
    first = true; //首次加载翻页
    goPage(1, 10, false, pageUrl);
}
var first = true;
var pageUrl = "";
function goPage(_page, _size, firstload, url) {
    if (url == undefined) {
        url = "/C3/PC/MDeviceStatus/RemoteHandlers/MonitorLocoStateListNew.ashx";
    }
    $.ajax({
        type: "POST",
        url: url,
        data: 'page=' + _page + '&size=' + _size + '&startdate=' + $("#startdate").val() + '&enddate=' + $("#enddate").val(),
        async: false,
        cache: true,
        success: function (result) {
            json = eval('(' + result + ')');
            var pageNum = 10;
            if (json != null && json != undefined) {
                pageNum = Math.ceil(json.totalCount / _size);
                getPageContent(json);
            }
            //if (first) {
            //    first = false;
            //    laypage({
            //        cont: 'layPage', //容器。值支持id名、原生dom对象，jquery对象,
            //        pages: pageNum, //总页数
            //        size: 10, //总页数
            //        skip: true, //是否开启跳页
            //        skin: 'molv',
            //        groups: 6, //连续显示分页数
            //        jump: function (obj) {
            //            if (firstload) { goPage(obj.curr, obj.size, false, pageUrl); }
            //            firstload = true;
            //        }
            //    });
            //}

            pagegogogo()
        }
    });
    //if (FunEnable('Fun_LOCSTATE_NEW') != "True") {
        //$(".rail_two").width("66%");
        //$(".rail_num_all").width("30%");
        //$(".rail_two .col_200").width("23%");
        //$(".rail_two .col_150").width("12%");
        //$(".rail_num_all .col_150").width("30%");
        //$(".rail_num_all .col_100").width("19%");
   // }
};

function getPageContent(json) {

    template.helper("convert", function (v) {
        if (getConfig("debug") == "0") {
            return "<i class='glyphicon glyphicon-ok' title='正常'></i>";
        }else{
            if (v == "正常") {
                return "<i class='glyphicon glyphicon-ok' title='正常'></i>";
            } else {
                return "<i class='glyphicon glyphicon-remove' title='异常'></i>";
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
       // if (FunEnable('Fun_LOCSTATE_NEW') == "True") {
            return true;
       // } else {
       //     return false;
       // }
    });
    var html = template('test', json);

    $("#flexTable").html(html);

    //机车隐藏辅助相机列
    if (FunEnable('Fun_isCRH') == "False") {
        $(".FU_HIDE").hide();
    }
};


var OnClickNumber = 1;
var map;
var point1;

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

    map.centerAndZoom(point1, 9);

    setTimeout(function () {
        $('.anchorBL,. anchorBL').hide();
    }, 500)


};

function Bmaps(gis_x, gis_y) {
    OnClickNumber = OnClickNumber + 1;
    map = new BMap.Map("mapDiv", { mapType: BMAP_HYBRID_MAP }); // 创建Map实例

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

    map.addControl(new BMap.MapTypeControl({ anchor: BMAP_ANCHOR_TOP_LEFT }));    //左上角，默认地图控件
    map.setCurrentCity("武汉");   //由于有3D图，需要设置城市哦


};

//导出方法
function tableToexcel() {
    AllAreaExcel('flexTable');
};

//分页
function pagegogogo() {
    var loccode = GetQueryString("locid"); //设备编码
    var startdate = GetQueryString("startdate"); //时间
    var enddate = GetQueryString("enddate"); //时间
    var direction = GetQueryString("DIRECTION"); //行别
    var linecode = GetQueryString("LINE_CODE"); //行别
    var jl = GetQueryString("jl"); //行别
    var OrgType = GetQueryString('OrgType'); //用户类别
  
    $('#layPage').paging({
        index: 1,
        url: function () {
            pageindex = $('.pageValue').val();
            return '/C3/PC/MDeviceStatus/RemoteHandlers/MonitorLocoStateListCombine.ashx?locid=' + loccode + '&startdate=' + startdate + '&enddate=' + enddate + '&LINE_CODE=' + linecode + '&jl=' + jl
    + '&direction=' + escape(direction) + "&OrgType=" + OrgType + '&temp=' + Math.random() + '&page=' + pageindex + '&size=' + pagesize
        },

        success: function (re) {

            if (re.list.length < 1) {
                layer.msg('没有数据');
            }
            if (re != null && re != undefined) {
                getPageContent(re);
            }
           
            $('.page_input').css('margin-bottom', '0')
        }

    })


}