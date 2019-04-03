/*========================================================================================*
* 功能说明：创建地图对象
* 注意事项：
* 作    者： Dj
* 版本日期：2015年9月24日
* 修 改 人： Dj
* 修改日期：2015年9月24日
* 变更说明：
* 版 本 号： V1.0
*=======================================================================================*/

function NewMap(DivId, mapLevel) {
    var type = getConfig('mapType');//首次加载卫星图还是普通地图
    if (type == "1") //卫星
        map = new BMap.Map(DivId, { mapType: BMAP_HYBRID_MAP }); // 创建Map实例
    else //地图
        map = new BMap.Map(DivId, { mapType: BMAP_NORMAL_MAP }); // 创建Map实例
    map.clearOverlays();    //清除地图上所有覆盖物
    var CenterLon = getCookieValue("CenterLon");
    if (CenterLon == "null" || CenterLon == "") {
        CenterLon = getConfig('CenterLon');
    }
    var CenterLat = getCookieValue("CenterLat");
    if (CenterLat == "null" || CenterLat == "") {
        CenterLat = getConfig('CenterLat');
    }
    var point = new BMap.Point(CenterLon, CenterLat);    // 创建点坐标
    map.centerAndZoom(point, mapLevel); // 初始化地图，设置中心点坐标和地图级别。

    map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
    return map;
}
function bmapUserTopOneRightInfo() {
    // 设置默认停靠位置和偏移量
    this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
    this.defaultOffset = new BMap.Size(5, 5);
}