var map = SVG.utils.map;

function svgMapId() {
    return SVG.eid('map');
}

function start(prams) {
    var body = prams.body;
    var data = prams.data.city;
    var dataText = prams.data.text;
    var cityImg = prams.data.cityImg;
    var mapEllipse = prams.data.ellipse;
    var mouseoverBack = prams.mouseoverBack || '#000';
    var lasrClickObj;

    var svgDom = svgSubgrade(prams.el);
    var draw = createSVG('svgDivInit');
    var group = createGroup(draw);

    draw.font({
        width: "100%",
        height: "100%"
    });

    //地图参数替换
    if (body) {
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < body.length; j++) {
                //判断编码一致
                if (data[i].administrativeCode === body[j].administrativeCode) {
                    jQuery.extend(data[i], body[j]);
                    for (key in body[j]) {
                        data[i][key] = body[j][key];
                    }
                }
            }
        }
    }

    var gRect = group.node.getBoundingClientRect();
    // var svgViewX = gRect.width;
    // var svgViewY = gRect.height;
    var svgViewX = 750;
    var svgViewY = 975;
    var viewX = $(draw.node).width();
    var viewY = $(draw.node).height();

    if (svgViewY - viewY > svgViewX - viewX) {
        boxX = svgViewY > viewY ? viewY / svgViewY : svgViewY / viewY;
        boxY = boxX;
    }

    if (svgViewY - viewY < svgViewX - viewX) {
        boxX = svgViewX > viewX ? viewX / svgViewX : svgViewX / viewX;
        boxY = boxX;
    }
    
    createMap(group, data, gradeColor, boxX, boxY);

    var groupText = createGroup(draw);
    var groupEllipse = createGroup(draw);
    var groupImg = createGroup(draw);
    //创建城市名
    if (dataText) {
        createMapText(groupText, dataText, boxX, boxY);
    }
    if (mapEllipse) {
        createMapEllipse(groupEllipse, mapEllipse, boxX, boxY);
    }
    if (cityImg) {
        createMapImg(groupImg, cityImg, boxX, boxY)
    }

    //创建鼠标移入提示框
    var model = createModelTitle(svgDom.father);
    var modelDiv = model();

    //地图父级绑定事件
    group.click(function (e) {
        var objs = getPath(e);

        objs.fill(prams.clickBack);
        objs.settings.click = true;

        if (lasrClickObj) {
            lasrClickObj.fill(objs.svgObj.attr.fill);
            lasrClickObj.settings.click = false;
        }

        if (prams.clickFuc) {
            prams.clickFuc(objs.svgObj);
        }

        if (modelDiv) {
            modelDiv.css('display', 'none');
        }
        lasrClickObj = objs;
    })

    //path标签绑定鼠标移入事件
    group.mouseover(function (e) {
        var objs = getPath(e);

        if (!objs.settings.click) {
            objs.fill(mouseoverBack);
        }
    })
    //path标签绑定鼠标移出事件
    group.mouseout(function (e) {
        var objs = getPath(e);
        if (!objs.settings.click) {
            objs.fill(objs.svgObj.attr.fill);
        }

        if (modelDiv) {
            modelDiv.css('display', 'none');
        }
    })

    group.mousemove(function (e) {
        var objs = getPath(e);
        if (objs.svgObj.modelTitle && objs.svgObj.modelTitle.length !== 0) {
            model(e.offsetX, e.offsetY, objs.svgObj.modelTitle);
        } else {
            if (modelDiv) {
                modelDiv.css('display', 'none');
            }
        }
    })

    groupText.node.setAttribute("style", "pointer-events:none;");
    groupEllipse.node.setAttribute("style", "pointer-events:none;");
}

//创建地图
function createMap(group, data, color, x, y) {
    //初始化地图
    if (isType(data) === '[object Array]') {
        for (var i = 0; i < data.length; i++) {
            data[i].attr.fill = color[data[i].grade];
            var pa = createPath(group, data[i]);
            pa.scale(x, y, 1, 1)
        }
    }

}

function createMapText(group, data, x, y) {
    //初始化地图
    if (isType(data) === '[object Array]') {
        for (var i = 0; i < data.length; i++) {
            var pa = createText(group, data[i]);
            pa.scale(x, y, 1, 1)
        }
    }
}


function createMapEllipse(group, data, x, y) {
    //初始化地图
    if (isType(data) === '[object Array]') {
        for (var i = 0; i < data.length; i++) {
            var pa = createEllipse(group, data[i]);
            pa.scale(x, y, 1, 1)
        }
    }
}

function createMapImg(group, data, x, y) {
    //初始化地图
    if (isType(data) === '[object Array]') {
        for (var i = 0; i < data.length; i++) {
            var pa = group.image(data[i].url)
                .size(data[i].sizeWid, data[i].sizeHig)
                .x(data[i].x)
                .y(data[i].y);

            pa.scale(x, y, 1, 1)
        }
    }
}

//创建path
function createPath(g, obj) {
    if (!obj.d) {
        console.log('创建path时缺少必要参数');
        return;
    }

    var pa = svgPath(g, obj.d);

    //path添加样式
    if (obj.attr && isType(obj.attr) === '[object Object]') {
        pa.attr(obj.attr);
        pa.settings = {};
    }

    //给path object添加一个label键
    pa.svgObj = obj

    return pa;
}

//创建text
function createText(g, obj) {
    if (!obj.content) {
        console.log('创建text时缺少必要参数');
        return;
    }

    var pa = svgText(g, obj.content);

    //path添加样式
    if (obj.attr && isType(obj.attr) === '[object Object]') {
        pa.attr(obj.attr);
        pa.twoAttr = obj.attr;
    }

    pa.x(parseInt(obj.attr.x) + 4);
    pa.y(parseInt(obj.attr.y) - 12);

    return pa;
}


//创建ellipse
function createEllipse(g, obj) {
    if (!obj.attr.rx, !obj.attr.ry) {
        console.log('创建ellipse时缺少必要参数');
        return;
    }

    var pa = g.ellipse(obj.rx, obj.ry);

    //path添加样式
    if (obj.attr && isType(obj.attr) === '[object Object]') {
        pa.attr(obj.attr);
        pa.twoAttr = obj.attr;
    }

    return pa;
}