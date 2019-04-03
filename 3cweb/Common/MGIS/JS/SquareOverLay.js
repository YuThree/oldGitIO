// �����Զ��帲����Ĺ��캯��
function SquareOverlay(center, width, height, color, html) {
    this._center = center;
    this._width = width;
    this._height = height;
    this._color = color;
    this._html = html;
}
// �̳�API��BMap.Overlay 
SquareOverlay.prototype = new BMap.Overlay();

//��ʼ��
SquareOverlay.prototype.initialize = function (map) {
    // ����map����ʵ�� 
    this._map = map;
    // ����divԪ�أ���Ϊ�Զ��帲��������� 
    var div = document.createElement("div");
    div.innerHTML = this._html;
    div.style.position = "absolute";
    // ���Ը��ݲ�������Ԫ����� 
    div.style.width = this._width + "px";
    div.style.height = this._height + "px";
    div.style.background = this._color;
    // ��div��ӵ������������� 
    map.getPanes().markerPane.appendChild(div);
    // ����divʵ�� 
    this._div = div;
    // ��Ҫ��divԪ����Ϊ�����ķ���ֵ�������øø������show�� 
    // hide���������߶Ը���������Ƴ�ʱ��API����������Ԫ�ء�
    this._div.style.left = "350px";
    this._div.style.top = "10px"; 
    return div;
}

//3�����Ƹ�����
// ʵ�ֻ��Ʒ��� 
SquareOverlay.prototype.draw = function () {
    // ���ݵ�������ת��Ϊ�������꣬�����ø����� 
    var position = this._map.pointToOverlayPixel(this._center);
    //    this._div.style.left = position.x - this._length / 2 + "px";
    //    this._div.style.top = position.y - this._length / 2 + "px";
    //this._div.style.left = "350px";
    //this._div.style.top = "10px";
}


//4����ʾ�����ظ�����
// ʵ����ʾ���� 
SquareOverlay.prototype.show = function () {
    if (this._div) {
        this._div.style.display = "";
    }
}
// ʵ�����ط��� 
SquareOverlay.prototype.hide = function () {
    if (this._div) {
        this._div.style.display = "none";
    }
}

