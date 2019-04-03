!function (a) {
    a.jqPaginator = function (b, c) {
        if (!(this instanceof a.jqPaginator)) { return new a.jqPaginator(b, c) } var d = this; return d.$container = a(b), d.$container.data("jqPaginator", d), d.init = function () { (c.first || c.prev || c.next || c.last || c.page) && (c = a.extend({}, { first: "", prev: "", next: "", last: "", page: "" }, c)), d.options = a.extend({}, a.jqPaginator.defaultOptions, c), d.verify(), d.extendJquery(), d.render(), d.fireEvent(this.options.currentPage, "init") }, d.verify = function () { var a = d.options; if (!d.isNumber(a.totalPages)) { throw new Error("[jqPaginator] type error: totalPages") } if (!d.isNumber(a.totalCounts)) { throw new Error("[jqPaginator] type error: totalCounts") } if (!d.isNumber(a.pageSize)) { throw new Error("[jqPaginator] type error: pageSize") } if (!d.isNumber(a.currentPage)) { throw new Error("[jqPaginator] type error: currentPage") } if (!d.isNumber(a.visiblePages)) { throw new Error("[jqPaginator] type error: visiblePages") } if (!a.totalPages && !a.totalCounts) { throw new Error("[jqPaginator] totalCounts or totalPages is required") } if (!a.totalPages && !a.totalCounts) { throw new Error("[jqPaginator] totalCounts or totalPages is required") } if (!a.totalPages && a.totalCounts && !a.pageSize) { throw new Error("[jqPaginator] pageSize is required") } if (a.totalCounts && a.pageSize && (a.totalPages = Math.ceil(a.totalCounts / a.pageSize)), a.currentPage < 1 || a.currentPage > a.totalPages) { throw new Error("[jqPaginator] currentPage is incorrect") } if (a.totalPages < 1) { throw new Error("[jqPaginator] totalPages cannot be less currentPage") } }, d.extendJquery = function () { a.fn.jqPaginatorHTML = function (b) { return b ? this.before(b).remove() : a("<p>").append(this.eq(0).clone()).html() } }, d.render = function () { d.renderHtml(), d.setStatus(), d.bindEvents() }, d.renderHtml = function () { for (var b = [], c = d.getPages(), e = 0, f = c.length; f > e; e++) { b.push(d.buildItem("page", c[e])) } d.isEnable("prev") && b.unshift(d.buildItem("prev", d.options.currentPage - 1)), d.isEnable("first") && b.unshift(d.buildItem("first", 1)), d.isEnable("statistics") && b.unshift(d.buildItem("statistics")), d.isEnable("next") && b.push(d.buildItem("next", d.options.currentPage + 1)), d.isEnable("last") && b.push(d.buildItem("last", d.options.totalPages)), d.$container.html(""); var pages = d.options.wrapper ? a(d.options.wrapper).html(b.join("")).jqPaginatorHTML() : b.join(""); d.$container.prepend(d.options.pageShowNum); d.$container.prepend(d.options.allDataNum); d.$container.prepend(d.options.allPage); var div = "<div class='num_now'>" + pages + d.options.searchs + "</div>"; d.$container.append(div); d.$container.find("select").val(d.options.pageShowNum_) }, d.buildItem = function (b, c) { var e = d.options[b].replace(/{{page}}/g, c).replace(/{{totalPages}}/g, d.options.totalPages).replace(/{{totalCounts}}/g, d.options.totalCounts); return a(e).attr({ "jp-role": b, "jp-data": c }).jqPaginatorHTML() }, d.setStatus = function () { var b = d.options; d.isEnable("first") && 1 !== b.currentPage || a("[jp-role=first]", d.$container).addClass(b.disableClass), d.isEnable("prev") && 1 !== b.currentPage || a("[jp-role=prev]", d.$container).addClass(b.disableClass), (!d.isEnable("next") || b.currentPage >= b.totalPages) && a("[jp-role=next]", d.$container).addClass(b.disableClass), (!d.isEnable("last") || b.currentPage >= b.totalPages) && a("[jp-role=last]", d.$container).addClass(b.disableClass), a("[jp-role=page]", d.$container).removeClass(b.activeClass), a("[jp-role=page][jp-data=" + b.currentPage + "]", d.$container).addClass(b.activeClass) }, d.getPages = function () { var a = [], b = d.options.visiblePages, c = d.options.currentPage, e = d.options.totalPages; b > e && (b = e); var f = Math.floor(b / 2), g = c - f + 1 - b % 2, h = c + f; 1 > g && (g = 1, h = b), h > e && (h = e, g = 1 + e - b); for (var i = g; h >= i;) { a.push(i), i++ } return a }, d.isNumber = function (a) { var b = typeof a; return "number" === b || "undefined" === b }, d.isEnable = function (a) { return d.options[a] && "string" == typeof d.options[a] }, d.switchPage = function (a) { d.options.currentPage = a, d.render() }, d.fireEvent = function (a, b) { return "function" != typeof d.options.onPageChange || d.options.onPageChange(a, b) !== !1 }, d.callMethod = function (b, c) { switch (b) { case "option": d.options = a.extend({}, d.options, c), d.verify(), d.render(); break; case "destroy": d.$container.empty(), d.$container.removeData("jqPaginator"); break; default: throw new Error('[jqPaginator] method "' + b + '" does not exist') }return d.$container }, d.bindEvents = function () {
            var b = d.options; d.$container.off(), d.$container.on("click", "[jp-role]", function () { var c = a(this); if (!c.hasClass(b.disableClass) && !c.hasClass(b.activeClass)) { var e = +c.attr("jp-data"); d.fireEvent(e, "change") && d.switchPage(e) } }); d.$container.find("select").on("change", function () { d.options.pageShowNum_ = this.value; if (d.options.pageShowNumFun) { d.options.pageShowNumFun(this.value) } }); d.$container.find(".inputPage").on("keydown", function (e) { var codeArr = [49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 8, 97, 98, 99, 100, 101, 102, 103, 104, 105, 96, 46, 39, 37]; if (codeArr.indexOf(e.keyCode) != -1) { } else { e.preventDefault() } }); d.$container.find(".inputPage").on("keyup", function (e) {
                var val = $(this).val(); var reg = /^[0-9]*$/; if (!reg.test(val)) { $(this).val(val.replace(/[^0-9]*/g, "")) } val = $(this).val(); if (val.length > this.getAttribute("maxLength")) {
                    $(this).val(val.substring(0, this.getAttribute("maxLength")))
                }
            }); d.$container.find(".searchPage span").on("click", function () { if ($(this.parentNode).find("input").val()) { var reg = /^[0-9]*$/; if (!reg.test($(this.parentNode).find("input").val())) { $(this.parentNode).find("input").val(""); return 0 } var e = parseInt($(this.parentNode).find("input").val()); if (e <= 0 || e > d.options.totalPages) { if (e > d.options.totalPages) { $(this.parentNode).find("input").val(d.options.totalPages) } else { $(this.parentNode).find("input").val("1") } console.log("输入值错误"); return 0 } d.fireEvent(e, "change") && d.switchPage(e); if (d.options.searchsFun) { d.options.searchsFun() } } })
        }, d.init(), d.$container
    }, a.jqPaginator.defaultOptions = { wrapper: "", first: '<li class="first"><a href="javascript:;">First</a></li>', prev: '<li class="prev"><a href="javascript:;">Previous</a></li>', next: '<li class="next"><a href="javascript:;">Next</a></li>', last: '<li class="last"><a href="javascript:;">Last</a></li>', page: '<li class="page"><a href="javascript:;">{{page}}</a></li>', totalPages: 0, totalCounts: 0, pageSize: 0, currentPage: 1, visiblePages: 7, disableClass: "disabled", activeClass: "active", onPageChange: null }, a.fn.jqPaginator = function () { var b = this, c = Array.prototype.slice.call(arguments); if ("string" == typeof c[0]) { var d = a(b).data("jqPaginator"); if (d) { return d.callMethod(c[0], c[1]) } throw new Error("[jqPaginator] the element is not instantiated") } return new a.jqPaginator(this, c[0]) }
    }(jQuery); function pageIng(Obj) { var className = Obj.pageBoxClass ? Obj.pageBoxClass : "pageFather"; var selectArr = ""; Obj.showNumArr && (function () { selectArr = '<select style="float:left;" class="showNum form-control pagingSelect selectopt">'; for (var i = 0; i < Obj.showNumArr.length; i++) { selectArr = selectArr + '<option class="option" value="' + Obj.showNumArr[i] + '"  id="optionShowNum">' + Obj.showNumArr[i] + "</option>" } selectArr = selectArr + "</select>" })(); if (typeof className == "string") { className = "." + className } $(className).jqPaginator({ totalPages: Obj.allPage, visiblePages: Obj.showPage, currentPage: Obj.nowPage, allPage: '<li class="allPage"><a href="javascript:void(0);">总页数<span class="numBerA">' + Obj.allPage + "</span>页</a></li>", first: '<li class="first"><a href="javascript:void(0);"></a></li>', prev: '<li class="prev"><a href="javascript:void(0);"></a></li>', next: '<li class="next"><a href="javascript:void(0);"></a></li>', last: '<li class="last"><a href="javascript:void(0);"></a></li>', page: '<li class="page"><a href="javascript:void(0);">{{page}}</a></li>', searchs: '<li class="searchPage"><input maxlength="5" placeholder="输入页数" type="text" class="inputPage" /><span class="span">跳转</span></li>', pageShowNum: '<li class="selectLi pull-left"><span style="float:left;" class="selectSpan">每页条数</span>' + selectArr + "</li>", allDataNum: "<li class='allDataNum'><a href='javascript:void(0);'>总条数<span class=\"numBerA\">" + Obj.allDataNum + "</span>条</a></li>", pageShowNum_: Obj.showNum, onPageChange: function (num, O) { Obj.pageFun(num, O) }, searchsFun: function (a) { }, pageShowNumFun: function (num) { Obj.showNumFun(num) } }) } var page = {}; page.paging = function (data, hander) { var page = data.responseText; var pageParam = xmlPageToJson(page); pageIng({ allDataNum: parseInt(pageParam.allDataNum), showNum: parseInt(pageParam.showNum), showNumArr: pageParam.showNumArr.split(","), pageBoxClass: "pageFather", allPage: parseInt(pageParam.allPage), showPage: pageParam.showPage, nowPage: parseInt(pageParam.nowPage), pageFun: function (num, O) { if (O == "change") { hander(num + "", pageParam.showNum) } }, showNumFun: function (num) { hander(1, num) } }) };