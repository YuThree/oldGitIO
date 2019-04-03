function isMobile()
{
    return false;
}




workPlaces = {
    zhongguancun: {
        name: "CRH2233",
        strokeStyle: "rgba(255,58,53,0.9)",
        lineWidth: .1,
        center: new BMap.Point(114.585464, 37.091726),
        bounds: new BMap.Bounds(new BMap.Point(116.312373, 39.982234), new BMap.Point(116.323476, 39.990885)),
        toWork: "早晨6点，当第一缕阳光照进眼眶时，新世纪程序猿、产品狗，设计狮等背上电脑，啃着煎饼，棒子果子陆续从石景山，房山，草房等巢穴来到中关村动物园，开始了一天的梦想之旅。",
        toHome: "夜幕降临，各个山头的大王们在开完一天的会议后返回各自的山头，这样的梦想之路每天都在继续着，它们坚信总有一天动物能改变世界！"
    },
    xierqi: {
        name: "西二旗",
        strokeStyle: "rgba(69,178,255,1)",
        lineWidth: .1,
        center: new BMap.Point(116.312462, 40.059055),
        bounds: new BMap.Bounds(new BMap.Point(116.29543, 40.046008), new BMap.Point(116.320942, 40.065558)),
        toWork: "早晨6点，当第一缕阳光照进眼眶时，新世纪程序猿、产品狗，设计狮等背上电脑，啃着煎饼，棒子果子陆续从石景山，房山，草房等巢穴来到西二旗动物园，开始了一天的梦想之旅。",
        toHome: "夜幕降临，各个山头的大王们在开完一天的会议后返回各自的山头，这样的梦想之路每天都在继续着，它们坚信总有一天动物能改变世界！"
    },
    guomao: {
        name: "国贸",
        strokeStyle: "rgba(190,190,14,1)",
        lineWidth: .1,
        center: new BMap.Point(116.466683, 39.914156),
        bounds: new BMap.Bounds(new BMap.Point(116.46106, 39.910047), new BMap.Point(116.476655, 39.9194)),
        toWork: "早晨7点，当第二缕阳光照进眼眶时，大都的高富帅、白富美们开着牧羊人，喝着星巴克，揣着艾派德缓缓的从望京，五道口，东直门等爱巢来到造富工厂国贸，开始了一天的时尚之旅。",
        toHome: "夜幕降临，这些富有时代精神的年轻人们陆续来到大都散落在各个角落（酒吧，西餐厅，夜店，快捷酒店）续写着他们的激情，而这样的时尚之路每天都在充实着大都青春与活力！"
    },
    wangjing: {
        name: "望京",
        strokeStyle: "rgba(0,240,243,0.9)",
        lineWidth: .1,
        center: new BMap.Point(116.485252, 40.000021),
        bounds: new BMap.Bounds(new BMap.Point(116.474643, 39.994782), new BMap.Point(116.494693, 40.005726)),
        toWork: "早晨6点，当第一缕阳光照进眼眶时，新世纪程序猿、产品狗，设计狮等背上电脑，啃着煎饼，棒子果子陆续从石景山，房山，草房等巢穴来到望京动物园，开始了一天的梦想之旅。",
        toHome: "夜幕降临，各个山头的大王们在开完一天的会议后返回各自的山头，这样的梦想之路每天都在继续着，它们坚信总有一天动物能改变世界！"
    }
};



function AnimateMarker(e, t) {
    this._point = e,
    this.text = t
}
function AnimateText(e, t) {
    this._point = e,
    this.text = t
}

AnimateMarker.prototype = new BMap.Overlay,
AnimateMarker.prototype.initialize = function (e) {
    this._map = e;
    var t = this._div = document.createElement("div");
    t.className = "animateMarker",
    t.innerHTML = this.text;
    return e.getPanes().labelPane.appendChild(t),
    t
},
AnimateMarker.prototype.show = function () {
    $(this._div).css("opacity", 1)
},
AnimateMarker.prototype.fadeOut = function () {
    var e = this;
    this._inAnimate || (this._inAnimate = !0, requestAnimationFrame(function () {
        e.animateFadeOut()
    }))
},
AnimateMarker.prototype.animateFadeOut = function () {
    var e = this,
    t = $(this._div).css("opacity");
    t -= .01,
    $(this._div).css("opacity", t),
    t > .01 ? requestAnimationFrame(function () {
        e.animateFadeOut()
    }) : this._inAnimate = !1
},
AnimateMarker.prototype.draw = function () {
    var e = this._map,
    t = e.pointToOverlayPixel(this._point);
    this._div.style.left = t.x - 50 + "px",
    this._div.style.top = t.y - 50 + "px"
},
AnimateMarker.prototype.setPointAndText = function (e, t) {
    this._point = e,
    this._div.innerHTML = t,
    this.draw()
},
AnimateText.prototype = new BMap.Overlay,
AnimateText.prototype.initialize = function (e) {
    this._map = e;
    var t = this._div = document.createElement("div");
    t.className = "animateText",
    t.style.display = "none",
    t.innerHTML = this.text;
    return e.getPanes().labelPane.appendChild(t),
    t
},
AnimateText.prototype.show = function () {
    $(this._div).show()
},
AnimateText.prototype.hide = function () {
    $(this._div).hide()
},
AnimateText.prototype.showText = function () {
    $(this._div).html(this.text)
},
AnimateText.prototype.printText = function () {
    var e = this;
    $(this._div).html(""),
    this._inAnimate || (this._inAnimate = !0, e.animatePrintText())
},
AnimateText.prototype.animatePrintText = function () {
    var e = this,
    t = this.text.length,
    i = $(this._div).html().length;
    t > i ? ($(this._div).html($(this._div).html() + this.text[i]), requestAnimationFrame(function () {
        e.animatePrintText()
    })) : this._inAnimate = !1
},
AnimateText.prototype.draw = function () {
    var e = this._map,
    t = e.pointToOverlayPixel(this._point);
    this._div.style.left = t.x + "px",
    this._div.style.top = t.y + "px"
},
AnimateText.prototype.setPointAndText = function (e, t) {
    this._point = e,
    this.text = t,
    this._div.style.display = "block",
    this.draw(),
    isMobile() ? this.showText() : this.printText()
};




function MapMask(t) {
    this.options = t || {},
    this.initElement(),
    this._map = t.map
}
MapMask.prototype = new BMap.Overlay,
MapMask.prototype.initialize = function (t) {
    this._map = t;
    var e = this.options.elementTag || "div",
    i = this.element = document.createElement(e),
    n = t.getSize();
    i.width = n.width,
    i.height = n.height,
    i.style.cssText = "position:absolute;left:0;top:0;width:" + n.width + "px;height:" + n.height + "px",
    t.getPanes().labelPane.appendChild(this.element);
    var a = this;
    return t.addEventListener("moving",
    function () {
        a.rp()
    }),
    this.element
},
MapMask.prototype.initElement = function () { },
MapMask.prototype.draw = function () {
    this.rp(),
    this.dispatchEvent("draw")
},
MapMask.prototype.rp = function () {
    var t = this._map,
    e = t.getBounds(),
    i = e.getSouthWest(),
    n = e.getNorthEast(),
    a = t.pointToOverlayPixel(new BMap.Point(i.lng, n.lat));
    this.element.style.left = a.x + "px",
    this.element.style.top = a.y + "px"
},
MapMask.prototype.getContainer = function () {
    return this.element
},
MapMask.prototype.show = function () {
    this._map.addOverlay(this)
},
MapMask.prototype.hide = function () {
    this._map.removeOverlay(this)
};











function TrafficLayer(t) {
    this._options = t || {},
    this._options.map && this.init()
}
function Animation(t) {
    this.opts = t || {},
    this.flag = !0;
    var i = this;
    void 0 !== this.opts.from && void 0 !== this.opts.to && (this.index = t.from, requestAnimationFrame(function () {
        i.circulate()
    }))
}
TrafficLayer.prototype.init = function () {
    var t = this,
    i = this._options.map;
    this.map = i,
    this.mercatorProjection = this.map.getMapType().getProjection(),
    this._data = {},
    this._styleKey = {},
    this._showKeys = [],
    this.initCanvas(),
    this._showAnimateText = {},
    this._animateStack = [],
    this._animationList = [],
    this._animateFlag = !0,
    requestAnimationFrame(function () {
        t._animate()
    }),
    this._bind()
},
TrafficLayer.prototype.initCanvas = function () {
    var t = this;
    this.baseCanvas = new MapMask({
        map: map,
        elementTag: "canvas"
    }),
    this.baseCanvas.show(),
    this.ctx = this.baseCanvas.getContainer().getContext("2d"),
    this.baseCanvas.addEventListener("draw",
    function () {
        t.draw()
    }),
    this.animateMask = new MapMask({
        map: map,
        elementTag: "canvas"
    }),
    this.animateMask.show(),
    this.anictx = this.animateMask.getContainer().getContext("2d"),
    this.animateBlurMask = new MapMask({
        map: map,
        elementTag: "canvas"
    }),
    this.animateBlurMask.show(),
    this.aniblurctx = this.animateBlurMask.getContainer().getContext("2d"),
    this.aniblurctx.globalAlpha = .85;
    var i = this.animateBlurMask.getContainer().cloneNode();
    this.aniblurctxTmp = i.getContext("2d"),
    this.aniblurctxTmp.globalCompositeOperation = "copy"
},
TrafficLayer.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height),
    this.anictx.clearRect(0, 0, this.anictx.canvas.width, this.anictx.canvas.height),
    this.aniblurctx.clearRect(0, 0, this.aniblurctx.canvas.width, this.aniblurctx.canvas.height),
    this._animateStack.length = [];
    for (var t = 0; t < this._animationList.length; t++) this._animationList[t].dispose();
    this._animationList.length = [];
    for (var t in this._showKeys) this.drawLinesAni(this._showKeys[t])
},
TrafficLayer.prototype.show = function (t) {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height),
    this._showKeys = t;
    for (var i in this._showKeys) {
        var a = this._showKeys[i];
        this._data[a] ? this.drawLinesAni(a) : this.request(a)
    }
},
TrafficLayer.prototype.workToHome = function () {
    for (var t in this._showKeys) {
        var i = this._showKeys[t],
        a = this._data[i],
        e = 500;
        isMobile() && (e = 80);
        for (var t = 0; e > t; t++) a[t][3] = 0;
        this._data[i] && this.workToHomeByKey(i)
    }
},
TrafficLayer.prototype.workToHomeByKey = function (t) {
    function i() {
        e._animationList.push(new Animation({
            from: a[0][1].length - 1,
            to: 0,
            action: function (i) {
                var s = [.07, .09, .1, .12, .15];
                e._styleKey[t].lineWidth = s[1],
                e.ctx.clearRect(0, 0, e.ctx.canvas.width, e.ctx.canvas.height),
                e.drawLines(a, e._styleKey[t], void 0, o, a.length),
                e.drawLines(a, e._styleKey[t], i, n, o)
            },
            callback: function () {
                n += s,
                o += s,
                n < a.length ? i() : e.drawLinesAni(t)
            }
        }))
    }
    utilityClock && utilityClock.setTimer(new Date("2014-12-11 18:00:00").getTime()),
    this._showAnimateText[t] ? animateText.hide() : (animateText.show(), animateText.setPointAndText(workPlaces[t].center, workPlaces[t].toHome)),
    this._showAnimateText[t] = !0;
    var a = this._data[t],
    e = this;
    if (a) {
        var s = 1500;
        isMobile() && (s = 100),
        e._animateFlag = !0;
        var n = 0,
        o = s;
        i()
    }
},
TrafficLayer.prototype.request = function (t) {
    if (this._data[t]) return this._data[t];
    var i = this;
    $(".loading").show();
    var a = "data/" + t;
    isMobile() && (a += "_min"),
    a += ".js",
    $.ajax({
        url: a,
        dataType: "JSON",
        success: function (a) {
            var e = 500;
            isMobile() && (a.length = 350, e = 80);
            for (var s = 0; e > s; s++) a[s][2] = ~~(Math.random() * a[s][1].length),
            a[s][3] = 1;
            i._data[t] = a,
            i.drawLinesAni(t),
            $(".loading").hide()
        },
        error: function () {
            i._data[t] = [],
            $(".loading").hide(),
            $(".tip").html("无数据返回"),
            $(".tip").show(),
            setTimeout(function () {
                $(".tip").hide()
            },
            2e3)
        }
    })
},
TrafficLayer.prototype.drawLines = function (t, i, a, e, s) {
    var n = this.ctx;
    if (t) {
        n.beginPath();
        var o = map.getZoom(),
        h = Math.pow(2, 18 - o),
        r = this.mercatorProjection.lngLatToPoint(this.map.getCenter()),
        c = new BMap.Pixel(r.x - n.canvas.width / 2 * h, r.y + n.canvas.height / 2 * h);
        n.save(),
        n.strokeStyle = i && i.strokeStyle || "rgba(255,255,0,0.9)",
        n.lineWidth = i && i.lineWidth || .1,
        isMobile() && (n.lineWidth = .4),
        e = e || 0,
        s = s || 0,
        s > t.length && (s = t.length);
        for (var l = e; s > l; l++) {
            var m = t[l][1];
            if (void 0 !== a) {
                n.moveTo((m[0][0] - c.x) / h, (c.y - m[0][1]) / h);
                for (var f = 1; a > f; f++) n.lineTo((m[f][0] - c.x) / h, (c.y - m[f][1]) / h)
            } else {
                n.moveTo((m[0][0] - c.x) / h, (c.y - m[0][1]) / h);
                for (var f = 1; f < m.length; f++) n.lineTo((m[f][0] - c.x) / h, (c.y - m[f][1]) / h)
            }
        }
        n.stroke(),
        n.restore()
    }
},
TrafficLayer.prototype.drawLinesAni = function (t) {
    function i() {
        s._animationList.push(new Animation({
            from: 0,
            to: e[0][1].length - 1,
            action: function (i) {
                s.ctx.clearRect(0, 0, s.ctx.canvas.width, s.ctx.canvas.height),
                s.drawLines(e, s._styleKey[t], void 0, 0, c),
                s.drawLines(e, s._styleKey[t], i, c, l)
            },
            callback: function () {
                c += r,
                l += r,
                c < e.length ? i() : s.workToHome()
            }
        }))
    }
    var a = workPlaces[t];
    this._showAnimateText[t] ? animateText.hide() : (animateText.show(), animateText.setPointAndText(a.center, workPlaces[t].toWork)),
    utilityClock && utilityClock.setTimer(new Date("2014-12-11 06:00:00").getTime());
    var e = this._data[t],
    s = this,
    n = this._data[t],
    o = 500;
    isMobile() && (o = 80);
    for (var h = 0; o > h; h++) n[h][3] = 1;
    if (e) {
        var r = 1500;
        isMobile() && (r = 100),
        s._animateFlag = !0;
        var c = 0,
        l = r;
        i()
    }
},
TrafficLayer.prototype._animate = function (t) {
    var i = this;
    if (this.aniblurctxTmp.drawImage(this.aniblurctx.canvas, 0, 0, this.aniblurctx.canvas.width, this.aniblurctx.canvas.height), this.anictx.clearRect(0, 0, this.anictx.canvas.width, this.anictx.canvas.height), this.aniblurctx.clearRect(0, 0, this.aniblurctx.canvas.width, this.aniblurctx.canvas.height), this._animateFlag) {
        this._animateStack.length > 0 && this._animateStack.shift()();
        for (var a in this._showKeys) this._drawAnimatePath(this._showKeys[a], t),
        this.aniblurctx.fill(),
        this._drawAnimateMarker(this._showKeys[a], t)
    }
    this.aniblurctx.drawImage(this.aniblurctxTmp.canvas, 0, 0, this.aniblurctxTmp.canvas.width, this.aniblurctxTmp.canvas.height),
    setTimeout(function () {
        requestAnimationFrame(function () {
            i._animate(t)
        })
    },
    55)
};
var circleSize = 10;
TrafficLayer.prototype._drawAnimateMarker = function (t) {
    var i = workPlaces[t] && workPlaces[t].center;
    if (i && this._data[t]) {
        {
            this._styleKey[t]
        }
        i = this.map.pointToPixel(i);
        var a = this.aniblurctx;
        a.save(),
        a.beginPath(),
        a.strokeStyle = "rgba(255,255,255,0.9)",
        circleSize += 1,
        a.arc(i.x, i.y, circleSize, 0, 2 * Math.PI),
        a.stroke(),
        a.restore(),
        circleSize > 35 && (circleSize = 0)
    }
},
TrafficLayer.prototype.ShowCircle = function (i) {
    
    if (i) {
    
      //  i = this.map.pointToPixel(i);
        var a = this.aniblurctx;
        a.save(),
        a.beginPath(),
        a.strokeStyle = "rgba(255,255,255,0.9)",
        circleSize += 1,
        a.arc(i.lng, i.lat, circleSize, 0, 2 * Math.PI),
        a.stroke(),
        a.restore(),
        circleSize > 35 && (circleSize = 0)
    }
},
TrafficLayer.prototype._drawAnimatePath = function (t) {
    if (this._data[t]) {
        var i = this.anictx,
        a = this.aniblurctx;
        i.beginPath(),
        a.beginPath(),
        i.fillStyle = "rgba(255,255,255,0.9)",
        a.fillStyle = "rgba(255,255,255,0.9)";
        for (var e = this.map.getZoom(), s = Math.pow(2, 18 - e), n = this.mercatorProjection.lngLatToPoint(this.map.getCenter()), o = new BMap.Pixel(n.x - i.canvas.width / 2 * s, n.y + i.canvas.height / 2 * s), h = this._data[t], r = h.length, c = 0; r > c; c++) if (void 0 !== h[c][1][2]) {
            var l = h[c][1][h[c][2]];
            1 === h[c][3] ? (h[c][2]++, h[c][2] > h[c][1].length && (h[c][2] = 0)) : (h[c][2]--, h[c][2] < 0 && (h[c][2] = h[c][1].length)),
            l && (25 > c ? (a.moveTo((l[0] - o.x) / s, (o.y - l[1]) / s), a.arc((l[0] - o.x) / s, (o.y - l[1]) / s, 4, 0, 2 * Math.PI)) : i.fillRect((l[0] - o.x) / s, (o.y - l[1]) / s, 2, 2))
        }
    }
},
TrafficLayer.prototype.setStyle = function (t, i) {
    this._styleKey[t] = i
},
TrafficLayer.prototype._bind = function () {
    var t = this;
    this.map.addEventListener("movestart",
    function () {
        t._animateFlag = !1
    }),
    this.map.addEventListener("moveend",
    function () {
        t._animateFlag = !0
    }),
    this.map.addEventListener("click",
    function () {
        t._animateFlag = !0
    })
},
Animation.prototype.circulate = function () {
    if (this.flag) {
        var t = this;
        this.opts.to > this.opts.from && this.index < this.opts.to || this.opts.to < this.opts.from && this.index > this.opts.to ? (this.opts.action && this.opts.action(this.index), setTimeout(function () {
            requestAnimationFrame(function () {
                t.circulate()
            })
        },
        this.opts.fps ? 1e3 / this.opts.fps : 0), this.opts.to > this.opts.from ? this.index++ : this.index--) : this.opts.callback && this.opts.callback()
    }
},
Animation.prototype.dispose = function () {
    this.flag = !1
};