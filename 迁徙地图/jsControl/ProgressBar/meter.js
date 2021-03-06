/*

Title:		jQMeter: a jQuery Progress Meter Plugin
Version:	v-1.0


*/

! function(e) {
	e.fn.extend({
		jQMeter: function(t) {
			t && "object" == typeof t && (t = e.extend({}, e.jQMeter.defaults, t)), this.each(function() {
				new e.jQMeter(this, t)
			})
		}
	}), e.jQMeter = function(t, r) {
		if(goal = parseInt(r.goal.replace(/\D/g, "")),
		        raised = parseInt(r.raised.replace(/\D/g, "")),
		        width = r.width,
				height = r.height,
		        bgColor = r.bgColor,
		        barColor = r.barColor,
		        orientation = r.orientation,
		        animationSpeed = r.animationSpeed,
		        counterSpeed = r.counterSpeed,
		        displayTotal = r.displayTotal, total = raised / goal * 1000, total >= 100 && (total = 100),
		        "vertical" == orientation ? (e(t).html('<div class="therm outer-therm vertical"><div class="therm inner-therm vertical"><span style="display:none;">' + total + "</span></div></div>"),
		        e(t).children(".outer-therm").attr("style", "width:" + width + ";height:" + height + ";background-color:" + bgColor),
		        e(t).children(".outer-therm").children(".inner-therm").attr("style", "background-color:" + barColor + ";height:0;width:" + width),
		        e(t).children(".outer-therm").children(".inner-therm").animate({
				   height: total + "%"
			}, animationSpeed)) : (e(t).html('<div class="therm outer-therm"><div class="therm inner-therm"><span style="display:none;">' + total + "</span></div></div>"), e(t).children(".outer-therm").attr("style", "width:" + width + ";height:" + height + ";background-color:" + bgColor), e(t).children(".outer-therm").children(".inner-therm").attr("style", "background-color:" + barColor + ";height:" + height + ";width:0"), e(t).children(".outer-therm").children(".inner-therm").animate({
				width: total + "%"
			}, animationSpeed)), displayTotal) {
			var i = parseInt(height),
				n = i / 2 - 13 + "px 10px";
			"horizontal" != orientation && (n = "10px 0"), e(t).children(".outer-therm").children(".inner-therm").children().show(), e(t).children(".outer-therm").children(".inner-therm").children().css("padding", n), e({
				Counter: 0
			}).animate({
				Counter: e(t).children(".outer-therm").children(".inner-therm").children().text()
			}, {
				duration: counterSpeed,
				easing: "swing",
				step: function() {
					e(t).children(".outer-therm").children(".inner-therm").children().text(Math.ceil(this.Counter) + "%")
				}
			})
		}
		e(t).append("<style>.therm{height:30px;}.outer-therm{margin:16px 0;}.inner-therm span {color: #464F5C;display: inline-block;float: right;font-family: Trebuchet MS;font-size: 14px;font-weight: 400;}.vertical.inner-therm span{width:100%;text-align:center;}.vertical.outer-therm{position:relative;}.vertical.inner-therm{position:absolute;bottom:0;}</style>")
	}, e.jQMeter.defaults = {
		width: "100%",
		height: "16px",
		bgColor: "transparent",
		barColor: "#FEC97B",
		orientation: "horizontal",
		animationSpeed: 2e3,
		counterSpeed: 2e3,
		displayTotal: !0,
		goal:'1,000',          //换算单位
	}
}(jQuery);