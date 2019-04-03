// 定义自定义覆盖物的构造函数
function SquareOverlay(center, width, height, color, html) {
    this._center = center;
    this._width = width;
    this._height = height;
    this._color = color;
    this._html = html;
}
// 继承API的BMap.Overlay 
SquareOverlay.prototype = new BMap.Overlay();

//初始化
SquareOverlay.prototype.initialize = function (map) {
    // 保存map对象实例 
    this._map = map;
    // 创建div元素，作为自定义覆盖物的容器 
    var div = document.createElement("div");
    div.innerHTML = this._html;
    div.style.position = "absolute";
    // 可以根据参数设置元素外观 
    div.style.width = this._width + "px";
    div.style.height = this._height + "px";
    div.style.background = this._color;
    // 将div添加到覆盖物容器中 
    map.getPanes().markerPane.appendChild(div);
    // 保存div实例 
    this._div = div;
    // 需要将div元素作为方法的返回值，当调用该覆盖物的show、 
    // hide方法，或者对覆盖物进行移除时，API都将操作此元素。
    this._div.style.left = "350px";
    this._div.style.top = "10px"; 
    return div;
}

//3、绘制覆盖物
// 实现绘制方法 
SquareOverlay.prototype.draw = function () {
    // 根据地理坐标转换为像素坐标，并设置给容器 
    var position = this._map.pointToOverlayPixel(this._center);
    //    this._div.style.left = position.x - this._length / 2 + "px";
    //    this._div.style.top = position.y - this._length / 2 + "px";
    //this._div.style.left = "350px";
    //this._div.style.top = "10px";
}


//4、显示和隐藏覆盖物
// 实现显示方法 
SquareOverlay.prototype.show = function () {
    if (this._div) {
        this._div.style.display = "";
    }
}
// 实现隐藏方法 
SquareOverlay.prototype.hide = function () {
    if (this._div) {
        this._div.style.display = "none";
    }
}

