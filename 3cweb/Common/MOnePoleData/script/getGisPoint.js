/**
 * Created by ybc on 2017/7/19.
 */
var map;
var judgeAnswer = false;//验证结果
var GISfromMap = false;//是否从地图取点
var GIStype = 'baidu';//google
var showlng = '';//当前点展示经纬度
var showlat = '';
var nearestPoleCode = '';//最近点code
var nearestPoleDistance = '';//最近点距离
var clooseClick = false;

var green = new BMap.Icon("/Common/MOnePoleData/img/GISgreen.png", new BMap.Size(18, 22));
var black = new BMap.Icon("/Common/MOnePoleData/img/GISblack.png", new BMap.Size(18, 22));
var violet = new BMap.Icon("/Common/MOnePoleData/img/GISviolet.png", new BMap.Size(18, 22));

function makeMarker(json) {
    //var poin = new BMap.Point(json.GIS_LON, json.GIS_LAT);

    //var marker2 = new BMap.Marker(poin, { icon: green });  // 创建标注
    //marker2.json = json;
    //marker2.addEventListener('click', getPoleClick);
    //map.addOverlay(marker2);

    var pointCollection = new BMap.Marker(pointsGreen, { icon: green });  // 初始化PointCollection
    var pointCollection2 = new BMap.Marker(pointsBlack, { icon: black });  // 初始化PointCollection
    var pointCollection3 = new BMap.Marker(pointsZi, { icon: violet });  // 初始化PointCollection

    pointCollection.addEventListener('click', getPoleClickSelf); // 监听点击事件
    pointCollection2.addEventListener('click', getPoleClick);
    pointCollection3.addEventListener('click', getPoleClick);


    map.addOverlay(pointCollection);  // 添加Overlay
    map.addOverlay(pointCollection2);
    map.addOverlay(pointCollection3);

}

$(function () {

    map = new BMap.Map("map", { mapType: BMAP_NORMAL_MAP });                        // 创建Map实例
    map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
    map.centerAndZoom(new BMap.Point(104.071216, 29.570997), 7);     // 初始化地图,设置中心点坐标和地图级别
    map.enableScrollWheelZoom();//启用滚轮放大缩小

    //单击获取点击的经纬度
    map.addEventListener("click", function (e) {
        if (GISfromMap && !e.overlay && !clooseClick) {
            $('#ByBaidu').click();             //地图选点默认百度坐标
            $('#lng').val(e.point.lng)//经纬度
            $('#lat').val(e.point.lat)
            $('#queryBtn').click();
            clooseClick = false;
        }
        if (clooseClick) {
            clooseClick = false;
        }
    });

})
$(function () {

    //表单验证
    $("#yiganyidangForm").validationEngine({
        validationEventTriggers: "blur",  //触发的事件  "keyup blur",   
        inlineValidation: true, //是否即时验证，false为提交表单时验证,默认true   
        success: false, //为true时即使有不符合的也提交表单,false表示只有全部通过验证了才能提交表单,默认false
        promptPosition: "topRight" //提示位置，topLeft, topRight, bottomLeft,  centerRight, bottomRight
        //        validateNonVisibleFields: true
    });

    $('#queryBtn').click(function () {
        if ($('#yiganyidangForm').validationEngine("validate")) {
            doquery();
        }
    });
    if (GetQueryString('gis_x') != '' && GetQueryString('gis_x') != undefined) {
        $('#lng').val(GetQueryString('gis_x'))
        $('#lat').val(GetQueryString('gis_y'))
        doquery();
    }
    $('.typeChoose').click(function () {
        //alert($(this).attr('code'))
        GIStype = $(this).attr('code');
        $('.typeChoose').css('color', 'white');
        $(this).css('color', '#3BBCD4');
        $('.typeChoose').find('.choose').removeClass('cheack').addClass('cheacknot')
        $(this).find('.choose').removeClass('cheacknot').addClass('cheack')
    })
    $('.choosePointMap').click(function () {
        if ($(this).hasClass('choosePointMapChooose')) {
            $(this).removeClass('choosePointMapChooose');
            GISfromMap = false;//地图选点
        } else {
            $(this).addClass('choosePointMapChooose');
            $('.BMap_mask').css('cursor', 'pointer !important');//鼠标样式改变
            GISfromMap = true;//地图选点
        }

    })
    $(".mapText").click(function () {
        $('.mapText').css("color", "white");
        if (this.id == "weixinMap") {
            $(this).css("color", "rgb(103,179,239)")
            $("div[title='显示卫星影像']").click();

        }
        if (this.id == "dituMap") {
            $(this).css("color", "rgb(103,179,239)")
            $("div[title='显示普通地图']").click();

        }
        if (this.id == "sanweiMap") {
            $(this).css("color", "rgb(103,179,239)")
            $("div[title='显示三维地图']").click();
        }
    });
})


//    var points = [];  // 添加海量点数据
var pointsGreen = [];
var pointsBlack = [];
var pointsZi = [];
var animateMarker = null; //弹出框新样式
var colorNumber = 0; //颜色初始化

var pointColor = [
    {
        "Color": "#00B500"
    },
    {
        "Color": "#010101"
    },
    {
        "Color": "#9932CC"
    }
] // 标记点色彩集
var optionsGreen = {
    size: BMAP_POINT_SIZE_BIGGER,
    shape: BMAP_POINT_SHAPE_CIRCLE,
    color: pointColor[0].Color
}
var optionsBlack = {
    size: BMAP_POINT_SIZE_BIGGER,
    shape: BMAP_POINT_SHAPE_CIRCLE,
    color: pointColor[1].Color
}
var optionsZi = {
    size: BMAP_POINT_SIZE_BIGGER,
    shape: BMAP_POINT_SHAPE_CIRCLE,
    color: pointColor[2].Color
}

function qingkongMap() {
    pointsGreen = [];
    pointsBlack = [];
    pointsZi = [];
    map.clearOverlays();
}
function mapRefash(json) {


    var pointCollection = new BMap.PointCollection(pointsGreen, optionsGreen);  // 初始化PointCollection
    var pointCollection2 = new BMap.PointCollection(pointsBlack, optionsBlack);  // 初始化PointCollection
    var pointCollection3 = new BMap.PointCollection(pointsZi, optionsZi);  // 初始化PointCollection


    pointCollection.addEventListener('click', getPoleClickSelf); // 监听点击事件
    pointCollection2.addEventListener('click', getPoleClickLear);
    pointCollection3.addEventListener('click', getPoleClick);

    map.addOverlay(pointCollection);  // 添加Overlay
    map.addOverlay(pointCollection2);
    map.addOverlay(pointCollection3);


}

function getPoleClick(e) {
    var _json = this.json;
    var m = e.point
    ClearAnimateMarker();
    if (m) {
        var html = SetHtml(_json);
        if (animateMarker == null) {
            animateMarker = new AnimateMarker(m, html);
            animateMarker.type = "animateMarker";
            map.addOverlay(animateMarker);
            return;
        }
        else {
            animateMarker.setPointAndText(m, html);
        }
    }
};

function getPoleClickLear(e) {
    var _json = this.json;
    var m = e.point
    ClearAnimateMarker();
    if (m) {
        var html = SetHtml(_json, 'true');
        if (animateMarker == null) {
            animateMarker = new AnimateMarker(m, html);
            animateMarker.type = "animateMarker";
            map.addOverlay(animateMarker);
            return;
        }
        else {
            animateMarker.setPointAndText(m, html);
        }
    }
};


function getPoleClickSelf(e) {
    //alert(e)
    var _json = this.json;
    ClearAnimateMarker();

    if (animateMarker == null) {
        var html = getSelfHtml(_json);
        animateMarker = new AnimateMarker(e.point, html);
        animateMarker.type = "animateMarker";
        map.addOverlay(animateMarker);
        return;
    } else {
        animateMarker.setPointAndText(e.point, html);
    }
};

function getPoleClickSelf_mark(_mark) {
    //alert(e)
    var _json = _mark.json;
    ClearAnimateMarker();

    if (animateMarker == null) {
        var html = getSelfHtml(_json);
        animateMarker = new AnimateMarker(_mark.point, html);
        animateMarker.type = "animateMarker";
        map.addOverlay(animateMarker);
        return;
    } else {
        animateMarker.setPointAndText(_mark.point, html);
    }
};


//删除自定义样式弹出框
function ClearAnimateMarker() {
    map.removeOverlay(animateMarker);
    animateMarker = null;
}



//查询按钮事件

function doquery() {
    qingkongMap();
    var centerLon = $('#lng').val();
    var centerLat = $('#lat').val();
    var range = $('#range').val();
    if (parseInt(range) > 200000 || range.split('-').length > 1) {
        layer.msg('查找范围有误');
        return;
    }
    var isOriginal = false;
    if (GIStype == 'google') {
        isOriginal = true;
    }
    var ii = layer.load();
    var _url = '/Common/MGIS/ASHX/MisPole/GetPoleInfoByGPS.ashx?centerLon=' + centerLon + '&centerLat=' + centerLat + '&range=' + range + '&isOriginal=' + isOriginal;
    //var _url = '/Common/MGIS/ASHX/MisPole/GetPoleInfoByGPS.ashx?centerLon=115.977236&centerLat=28.321691&range=200&isOriginal=false'

    $.ajax(
        {
            url: _url,
            async: true,
            success: function (re_json) {
                layer.close(ii);

                ClearAnimateMarker();
                if (re_json.data.length != 0) {
                    nearestPoleCode = re_json.nearestPoleCode;//最近点code
                    nearestPoleDistance = re_json.nearestPoleDistance;//最近点距离
                    showlng = re_json.centerLon
                    showlat = re_json.centerLat
                    var a = new BMap.Point(re_json.centerLon, re_json.centerLat);


                    for (var i = 0; i < re_json.data.length; i++) {

                        if (re_json.data[i].PoleCode == nearestPoleCode) {
                            var p = new BMap.Point(re_json.data[i].GIS_LON, re_json.data[i].GIS_LAT);
                            var marker2 = new BMap.Marker(a, { icon: green });
                            var marker3 = new BMap.Marker(p, { icon: black });

                            marker2.json = re_json.data[i];
                            marker3.json = re_json.data[i];

                            marker2.addEventListener('click', getPoleClickSelf); // 监听点击事件
                            marker3.addEventListener('click', getPoleClickLear); // 监听点击事件



                            map.addOverlay(marker2)
                            map.addOverlay(marker3)

                            getPoleClickSelf_mark(marker2)
                            // marker2.click();


                        } else {
                            var p = new BMap.Point(re_json.data[i].GIS_LON, re_json.data[i].GIS_LAT);
                            var marker1 = new BMap.Marker(p, { icon: violet });
                            marker1.json = re_json.data[i];
                            marker1.addEventListener('click', getPoleClick); // 监听点击事件
                            map.addOverlay(marker1)
                        }
                    }
                    //makeMarker()
                    //mapRefash();
                    map.centerAndZoom(a, 19);

                } else {
                    var a = new BMap.Point(re_json.centerLon, re_json.centerLat)
                    var marker2 = new BMap.Marker(a, { icon: green });
                    marker2.addEventListener('click', function () {
                        layer.msg('当前点百度经纬度：' + re_json.centerLon + ',' + re_json.centerLat)
                    }); // 监听点击事件
                    map.addOverlay(marker2);
                    map.centerAndZoom(a, 15);
                    layer.msg('附近暂无数据！');
                }

            },
            error: function () {
                layer.close(ii);
                ClearAnimateMarker();
            }
        }
    )
}



//点击一杆一档地图marker生成html

function SetHtml(json, lear) {
    if (json.GIS_LON == showlng && showlat == json.GIS_LAT) {
        var html = getSelfHtml(json)
    } else {
        var title = '';
        if (lear == 'true') {
            title = '最近支柱'
        } else {
            title = '定位点'
        }
        var html = " <a href='#' onclick='Colsepoleinfo();' style='position:absolute;right:-11px;top:-11px;display:inline-block;'><img src='/Common/MOnePoleData/img/GISclose.png' alt='关闭' /></a>\
        <div style='padding:12px 20px;'>\
            <div class='row-fluid AnimateMarker-title'>\
                <div class='span12'>"+ title + "</div>\
            </div>\
            <div class='AnimateMarker-body'>\
                <div class='AnimateMarker-text'>\
                    <div class='row-fluid' style='border-bottom: 1px solid #4E4B4B;'>\
                         <div style='color:#3BBCD4'><span class='AnimateMarker-color'>百&nbsp;&nbsp;&nbsp;度&nbsp;&nbsp;&nbsp;的&nbsp;&nbsp;&nbsp;经&nbsp;&nbsp;&nbsp;纬&nbsp;&nbsp;&nbsp;度：</div>\
                        <div class='span5' style='margin-left: 0px;'><span class='AnimateMarker-color'>&nbsp;&nbsp;经&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;度：</span><span>" + json.GIS_LON + "</span></div>\
                        <div class='span5'><span class='AnimateMarker-color'>&nbsp;&nbsp;纬&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;度：</span><span>" + json.GIS_LAT + "</span></div>\
                    </div>\
                    <div class='row-fluid'>\
                    <div style='color:#3BBCD4'><span class='AnimateMarker-color'>支柱信息：</div>\
                        <div class='span5' style='margin-left: 0px;'><span class='AnimateMarker-color'>&nbsp;&nbsp;线&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;路：</span><span>" + json.LineName + "</span></div>\
                        <div class='span5'><span class='AnimateMarker-color'>&nbsp;&nbsp;区&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;站：</span><span>" + json.PositionName + "</span></div>\
                    </div>\
                    <div class='row-fluid'>\
                        <div class='span5'><span class='AnimateMarker-color'>&nbsp;&nbsp;桥&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;隧：</span><span>" + json.Brg_tun_Name + "</span></div>\
                        <div class='span5'><span class='AnimateMarker-color'>&nbsp;&nbsp;行&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别：</span><span>" + json.Direction + "</span></div>\
                    </div>\
                    <div class='row-fluid'>\
                            <div class='span5'><span class='AnimateMarker-color'>&nbsp;&nbsp;公&nbsp;&nbsp;里&nbsp;&nbsp;标：</span><span>" + json.KMMark + "</span></div>\
                            <div class='span5'><span class='AnimateMarker-color'>&nbsp;&nbsp;杆&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号：</span><span>" + json.PoleNo + "</span></div>\
                    </div>\
                </div>\
                <div style='clear:both;'></div>\
            </div>\
        </div>";
    }

    return html;
};
function getSelfHtml(json) {

    var html = " <a href='#' onclick='Colsepoleinfo();' style='position:absolute;right:-11px;top:-11px;display:inline-block;'><img src='/Common/MOnePoleData/img/GISclose.png' alt='关闭' /></a>\
        <div style='padding:12px 20px;'>\
            <div class='row-fluid AnimateMarker-title'>\
                <div class='span12'>当前定位点</div>\
            </div>\
            <div class='AnimateMarker-body'>\
                <div class='AnimateMarker-text'>\
                    <div class='row-fluid' style='border-bottom: 1px solid #4E4B4B;'>\
                         <div style='color:#3BBCD4'><span class='AnimateMarker-color'>百&nbsp;&nbsp;&nbsp;度&nbsp;&nbsp;&nbsp;的&nbsp;&nbsp;&nbsp;经&nbsp;&nbsp;&nbsp;纬&nbsp;&nbsp;&nbsp;度：</div>\
                        <div class='span5' style='margin-left: 0px;'><span class='AnimateMarker-color'>&nbsp;&nbsp;经&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;度：</span><span>" + showlng + "</span></div>\
                        <div class='span5'><span class='AnimateMarker-color'>&nbsp;&nbsp;纬&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;度：</span><span>" + showlat + "</span></div>\
                    </div>\
                    <div class='row-fluid'>\
                    <div style='color:#3BBCD4'><span class='AnimateMarker-color'>最近<b style='color:#EF5D00;'>" + nearestPoleDistance + "</b>米支柱信息：</div>\
                        <div class='span5' style='margin-left: 0px;'><span class='AnimateMarker-color'>&nbsp;&nbsp;线&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;路：</span><span>" + json.LineName + "</span></div>\
                        <div class='span5'><span class='AnimateMarker-color'>&nbsp;&nbsp;区&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;站：</span><span>" + json.PositionName + "</span></div>\
                    </div>\
                    <div class='row-fluid'>\
                        <div class='span5'><span class='AnimateMarker-color'>&nbsp;&nbsp;桥&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;隧：</span><span>" + json.Brg_tun_Name + "</span></div>\
                        <div class='span5'><span class='AnimateMarker-color'>&nbsp;&nbsp;行&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别：</span><span>" + json.Direction + "</span></div>\
                    </div>\
                    <div class='row-fluid'>\
                            <div class='span5'><span class='AnimateMarker-color'>&nbsp;&nbsp;公&nbsp;&nbsp;里&nbsp;&nbsp;标：</span><span>" + json.KMMark + "</span></div>\
                            <div class='span5'><span class='AnimateMarker-color'>&nbsp;&nbsp;杆&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号：</span><span>" + json.PoleNo + "</span></div>\
                    </div>\
                </div>\
                <div style='clear:both;'></div>\
            </div>\
        </div>";

    return html;
}

//关闭杆号信息框
function Colsepoleinfo() {
    clooseClick = true;
    ClearAnimateMarker();
};