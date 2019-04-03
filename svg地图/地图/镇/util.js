function isType(type) {
    return Object.prototype.toString.call(type)
}

/**
 * 给初始化svg添加一个子容器
 * 用来包装svg标签
 * @param {*} id 
 * @returns {} 返回一个object， father:父级dom，svgDiv:子级dom
 */
function svgSubgrade(id) {
    var svgDiv = $("<div id='svgDivInit'></div>");
    svgDiv.css({
        'width': '100%',
        'height': '100%'
    })
    var father = $(id);
    father.append(svgDiv);

    return {
        'father': father,
        'svgDiv': svgDiv
    }
}

/**
 * 创建svg
 * @param {string} id
 * @returns 返回一个svg对象
 */
function createSVG(id) {
    if (SVG.supported) {
        return SVG(id)
    } else {
        console.error('SVG not supported');
    }
}

/**
 * 创建一个group
 * @param {draw} d 
 * @returns group 
 */
function createGroup(d) {
    return d.group();
}

/**
 * svg path绘制
 * @param {group} a 
 * @param {path} p 
 * @returns group
 */
function svgPath(a, p) {
    var b = a.path(p);
    return b;
}

/**
 * svg text绘制
 * @param {group} a 
 * @param {path} p 
 * @returns group
 */
function svgText(a, p) {
    var b = a.text(p);
    return b;
}

/**
 * 创建一个div
 */
function createDiv() {
    var _div = document.createElement('div');
    return _div;
}

/**
 * 根据target获取path实例
 */
function getPath(e) {
    var id = e.target.id;
    return SVG.get(id);
}

/**
 * 
 */
function createModelTitle(el) {
    var _div;
    var css = {
        "position": "absolute",
        "display": "none",
        "borderStyle": "solid",
        "whiteSpace": "nowrap",
        "zIndex": "9999999",
        "backgroundColor": "rgba(50, 50, 50, 0.7)",
        "borderWidth": "0px",
        "borderColor": "rgb(51, 51, 51)",
        "transition": "left 0.4s cubic-bezier(0.23, 1, 0.32, 1), top 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
        "borderRadius": "4px",
        "color": "rgb(255, 255, 255)",
        "fontStyle": "normal",
        "fontVariant": "normal",
        "fontWeight": "normal",
        "fontStretch": "normal",
        "fontSize": "14px",
        "lineHeight": "21px",
        "padding": "5px",
    }
    return function (left, top, text) {
        var hig = el.height(),
            wid = el.width();

        if (_div) {
            left += 15;
            top += 15;

            var mWid = _div.width(),
                mHig = _div.height();

            if (left + mWid + 30 > wid) {
                left = left - mWid - 30;
            }

            if (top + mHig + 30 > hig) {
                top = top - mHig - 30;
            }

            var leftPx = left ? left + 'px' : '0px';
            var topPx = top ? top + 'px' : '0px';
            css.left = leftPx;
            css.top = topPx;
            css.display = 'block';
            _div.html(text);

            _div.css(css);
        } else {
            _div = $('<div></div>');
            _div.css(css);
            _div.html(text);

            el.append(_div);
        }

        return _div;
    }
}