
/*========================================================================================*
* 功能说明：
* 注意事项：
* 作    者： wcg
* 版本日期：2013年9月26日
* 修 改 人： 邓杰
* 修改日期：2013年9月26日
* 变更说明：
* 版 本 号： V1.0
*=======================================================================================*/
var map;
var marker;
//加载 全景
function GetNormal() {
    var direction = "0";
    var json = GetOBJNormalDirection(direction);
    Assignment(json);

    map = new BMap.Map("normal_map"); // 创建Map实例
    var point = new BMap.Point(json[0].GIS_LON, json[0].GIS_LAT);    // 创建点坐标
    map.clearOverlays();    //清除地图上所有覆盖物
    map.centerAndZoom(point, 14); // 初始化地图，设置中心点坐标和地图级别。
    map.enableScrollWheelZoom();
    map.enableKeyboard();
    map.disableDoubleClickZoom();

    var icon = new BMap.Icon("img/jc.gif", new BMap.Size(40, 27));
    marker = new BMap.Marker(point, { icon: icon });

    marker.enableDragging();
    map.addOverlay(marker);
    marker.addEventListener('dragend', function (e) {
        GetTZMarker(e.point.lat, e.point.lng); //GetTZMarker(e.point); //拖动marker后，全景图位置也随着改变
    }
                );
    map.addEventListener("click", function (e) {
        GetTZMarker(e.point.lat, e.point.lng);
        Getpositionchanged(e.point.lng, e.point.lat);
    });

    map.addControl(bmapUserTopOneRightInfo);
    map.addControl(new BMap.OverviewMapControl());
    map.addControl(new BMap.ScaleControl());                    // 添加默认比例尺控件

    map.addControl(new BMap.ScaleControl({ anchor: BMAP_ANCHOR_TOP_LEFT }));                    // 左上
    map.addControl(new BMap.ScaleControl({ anchor: BMAP_ANCHOR_TOP_RIGHT }));                    // 右上
    map.addControl(new BMap.ScaleControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT }));                    // 左下
    map.addControl(new BMap.MapTypeControl({ anchor: BMAP_ANCHOR_TOP_LEFT }));    //左上角，默认地图控件
    map.setCurrentCity("武汉");   //由于有3D图，需要设置城市哦
    var cr = new BMap.CopyrightControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT });
    map.addControl(cr); //添加版权控件
    cr.addCopyright({ id: 1, content: "<a href='http://www.railwaytec.com'></a>" });
}
function bmapUserTopOneRightInfo() {
    // 设置默认停靠位置和偏移量
    this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
    this.defaultOffset = new BMap.Size(5, 5);

}
//下一针
function Forward() {
    var direction = "1";
    var json = GetOBJNormalDirection(direction);
    Assignment(json);
    Getpositionchanged(json[0].GIS_LON, json[0].GIS_LAT);
}
//上一针
function Back() {
    var direction = "-1";
    var json = GetOBJNormalDirection(direction);

    Assignment(json);
    Getpositionchanged(json[0].GIS_LON, json[0].GIS_LAT);
}
//换针
function Getpositionchanged(lng, lat) {
    map.setCenter(new BMap.Point(lng, lat));
    marker.setPosition(new BMap.Point(lng, lat));
}
//移动位置跟换全景
function GetTZMarker(lat, lng) {

    Suspended(); //地图点击出现暂停事件

    var json = GetOBJNormal(lat, lng);
    Assignment(json);
}
//播放变暂停
var set; //定时器
var second = 2000; //间隔时间2秒钟
function Play() {
    document.getElementById("Play").style.display = "none";
    document.getElementById("BackPlay").style.display = "none";
    document.getElementById("Suspended").style.display = "inline-block";
    set = setInterval('Forward()', second);
}
//暂停
function Suspended() {
    document.getElementById("Play").style.display = "inline-block";
    document.getElementById("BackPlay").style.display = "inline-block";
    document.getElementById("Suspended").style.display = "none";
    clearInterval(set); //关闭定时器
}
//往后播
function BackPlay() {
    document.getElementById("BackPlay").style.display = "none";
    document.getElementById("Play").style.display = "none";
    document.getElementById("Suspended").style.display = "inline-block";
    set = setInterval('Back()', second);
}
//赋值
function Assignment(json) {
    document.getElementById('img1').src = "../" + json[0].PIC_PATH_100W;
    document.getElementById('img2').src = "../" + json[0].PIC_PATH_500W;
    document.getElementById('POSITION_NAME').innerHTML = "区站:<p/>" + json[0].POSITION_NAME;
    document.getElementById('KMSTANDARD').innerHTML = "公里标：<p/>" + json[0].KMSTANDARD;
}