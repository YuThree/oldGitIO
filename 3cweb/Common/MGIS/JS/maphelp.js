function AnimateMarker(e, t) {
    this._point = e,
    this.text = t
}
function AnimateText(e, t) {
    this._point = e,
    this.text = t
}
var animateCount = 300,
workPlaces = {
    zhongguancun: {
        name: "中关村",
        strokeStyle: "rgba(255,58,53,0.9)",
        lineWidth: .1,
        center: new BMap.Point(116.318247, 39.986398),
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
},
allKeys = [];
for (var key in workPlaces) allKeys.push(key);
for (var key in workPlaces) $("#aside_list").append('<a href="javascript:void(0);" key="' + key + '"><b style="background:' + workPlaces[key].strokeStyle + '"></b><span>' + workPlaces[key].name + "</span></a>");
var map = new BMap.Map("map", {
    maxZoom: 16,
    vectorMapLevel: 19,
    enableMapClick: !1
});
map.getContainer().style.background = "#081734",
map.setMapStyle({
    styleJson: [{
        featureType: "water",
        elementType: "all",
        stylers: {
            color: "#044161"
        }
    },
    {
        featureType: "land",
        elementType: "all",
        stylers: {
            color: "#091934"
        }
    },
    {
        featureType: "boundary",
        elementType: "geometry",
        stylers: {
            color: "#064f85"
        }
    },
    {
        featureType: "railway",
        elementType: "all",
        stylers: {
            visibility: "off"
        }
    },
    {
        featureType: "highway",
        elementType: "geometry",
        stylers: {
            color: "#004981"
        }
    },
    {
        featureType: "highway",
        elementType: "geometry.fill",
        stylers: {
            color: "#005b96",
            lightness: 1
        }
    },
    {
        featureType: "highway",
        elementType: "labels",
        stylers: {
            visibility: "on"
        }
    },
    {
        featureType: "arterial",
        elementType: "geometry",
        stylers: {
            color: "#004981",
            lightness: -39
        }
    },
    {
        featureType: "arterial",
        elementType: "geometry.fill",
        stylers: {
            color: "#00508b"
        }
    },
    {
        featureType: "poi",
        elementType: "all",
        stylers: {
            visibility: "on"
        }
    },
    {
        featureType: "green",
        elementType: "all",
        stylers: {
            color: "#056197",
            visibility: "off"
        }
    },
    {
        featureType: "subway",
        elementType: "all",
        stylers: {
            visibility: "off"
        }
    },
    {
        featureType: "manmade",
        elementType: "all",
        stylers: {
            visibility: "off"
        }
    },
    {
        featureType: "local",
        elementType: "all",
        stylers: {
            visibility: "off"
        }
    },
    {
        featureType: "arterial",
        elementType: "labels",
        stylers: {
            visibility: "off"
        }
    },
    {
        featureType: "boundary",
        elementType: "geometry.fill",
        stylers: {
            color: "#029fd4"
        }
    },
    {
        featureType: "building",
        elementType: "all",
        stylers: {
            color: "#1a5787"
        }
    },
    {
        featureType: "label",
        elementType: "all",
        stylers: {
            visibility: "off"
        }
    },
    {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: {
            color: "#ffffff"
        }
    },
    {
        featureType: "poi",
        elementType: "labels.text.stroke",
        stylers: {
            color: "#1e1c1c"
        }
    }]
}),
map.centerAndZoom(workPlaces.zhongguancun.center, 12),
map.enableScrollWheelZoom();
var trafficLayer = new TrafficLayer({
    map: map
});
for (var key in workPlaces) trafficLayer.setStyle(key, {
    strokeStyle: workPlaces[key].strokeStyle,
    lineWidth: workPlaces[key].lineWidth
});
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
var animateText = new AnimateText(workPlaces.zhongguancun.center, "");
map.addOverlay(animateText),
trafficLayer.show(["zhongguancun"]),
$('#aside_list a[key="zhongguancun"]').addClass("current"),
$('#aside_list a[key="zhongguancun"]').addClass("current");
var animateMarker = new AnimateMarker(workPlaces.zhongguancun.center, workPlaces.zhongguancun.name);
map.addOverlay(animateMarker),setTimeout(function () {
    animateMarker.fadeOut()
},2e3),$("#aside_list").delegate("a", "click",
function () {
    var e = ($(this).html(), $(this).attr("key")),
    t = workPlaces[e];
    $("#aside_list a").removeClass("current"),
    $(this).addClass("current"),
    e ? (trafficLayer.show([e]), animateMarker.show(), animateMarker.setPointAndText(t.center, t.name), setTimeout(function () {
        animateMarker.fadeOut()
    },
    2e3), map.centerAndZoom(t.center, 12)) : (trafficLayer.show(allKeys), map.centerAndZoom(new BMap.Point(116.404, 39.915), 12))
}),
$(".aside_title").bind("touchend",
function () {
    $("#aside_list").toggle("quick")
});
var WXurl = "http://renqi.baidu.com/traffic",
WXtitle = "百度地图交通通勤图",
WXdec = "百度地图交通通勤图",
dataForWeixin = {
    appId: "",
    MsgImg: "http://renqi.baidu.com/traffic/weixin.png",
    TLImg: "http://renqi.baidu.com/traffic/weixin.png",
    url: WXurl,
    title: WXtitle,
    desc: WXdec,
    fakeid: "",
    callback: function () { }
}; !
function () {
    var e = function () {
        WeixinJSBridge.on("menu:share:appmessage",
        function () {
            WeixinJSBridge.invoke("sendAppMessage", {
                appid: dataForWeixin.appId,
                img_url: dataForWeixin.MsgImg,
                img_width: "120",
                img_height: "120",
                link: dataForWeixin.url,
                desc: dataForWeixin.desc,
                title: dataForWeixin.title
            },
            function () {
                dataForWeixin.callback()
            })
        }),
        WeixinJSBridge.on("menu:share:timeline",
        function () {
            dataForWeixin.callback(),
            WeixinJSBridge.invoke("shareTimeline", {
                img_url: dataForWeixin.TLImg,
                img_width: "120",
                img_height: "120",
                link: dataForWeixin.url,
                desc: dataForWeixin.desc,
                title: dataForWeixin.title
            },
            function () { })
        }),
        WeixinJSBridge.on("menu:share:weibo",
        function () {
            WeixinJSBridge.invoke("shareWeibo", {
                content: dataForWeixin.title,
                url: dataForWeixin.url
            },
            function () {
                dataForWeixin.callback()
            })
        }),
        WeixinJSBridge.on("menu:share:facebook",
        function () {
            dataForWeixin.callback(),
            WeixinJSBridge.invoke("shareFB", {
                img_url: dataForWeixin.TLImg,
                img_width: "120",
                img_height: "120",
                link: dataForWeixin.url,
                desc: dataForWeixin.desc,
                title: dataForWeixin.title
            },
            function () { })
        })
    };
    document.addEventListener ? document.addEventListener("WeixinJSBridgeReady", e, !1) : document.attachEvent && (document.attachEvent("WeixinJSBridgeReady", e), document.attachEvent("onWeixinJSBridgeReady", e))
}();