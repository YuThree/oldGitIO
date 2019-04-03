(function(f) {
    window.TABLE_INFO_BUFFER = null;
    window.TABLE_INFO_BUFFER_ARR = new Array();

    function getLength(str) { if (/[a-zA-Z0-9]/i.test(str)) { return str.match(/[a-zA-Z0-9]/ig).length } return 0 }

    function inArray(arr, value) { for (var i = 0; i < arr.length; i++) { if (arr[i] == value) { return true } } return false }

    function initData(O) {
        O.bufferData = new Array();
        for (var i = 0; i < O.option.data.length; i++) {
            if (O.option.data[i].length) {
                O.bufferData[i] = new Array();
                for (var q = 0, m = 0; q < O.option.data[i].length; q++) {
                    for (var d = 0; d < O.option.widthInfo.length; d++) {
                        if (d == q && O.option.widthInfo[d] == -1) {
                            O.bufferData[i][m] = O.option.data[i][d];
                            m++
                        }
                    }
                }
            } else { if (typeof O.option.data[i] == "object") { O.bufferData[i] = {}; for (var s = 0; s < O.option.widthInfo.length; s++) { if (O.option.widthInfo[s] == -1) { O.bufferData[i][typeof O.option.title[s] == "string" ? O.option.title[s] : O.option.title[s].title] = O.option.data[i][typeof O.option.title[s] == "string" ? O.option.title[s] : O.option.title[s].title] } } } }
        }
        for (var p = 0; p < O.option.widthInfo.length; p++) {
            if (O.option.widthInfo[p] != -1) {
                O.widthInt = O.widthInt - parseFloat(O.option.widthInfo[p]) / 100;
                O.widthIntA++
            }
        }
    }

    function getParentNode(Obj, Arr) { if (!Arr) { var Arr = [] } Arr.push(Obj); if (Obj && Obj.parentNode) { getParentNode(Obj.parentNode, Arr) } return Arr }

    function txtJoin(Obj, str, O) {
        var newStr = "";
        var i;
        if (Obj.length) {
            newStr = Obj.join(str);
            newStr = $("<div>" + newStr + "</div>").text()
        } else { for (i in Obj) { if (typeof Obj[i] == "string" && O.keyArr.indexOf(i) != -1) { newStr = newStr + str + Obj[i] } } newStr = $("<div>" + newStr + "</div>").text() }
        return newStr
    }
    var fun = function() {
        var O = new Object();
        O.option = null;
        O.trNumber = 0;
        O.wdNumber = 0;
        O.setOption = function(Obj) {
            var defaultObj = { data: [], title: [], isBq: true, isTitle: true, geometric: 2, paddingRL: 10, fontWidth: 18, selectChangeBeforeTr: function() {}, selectChangeAfterTr: function() {}, changeBufferObj: function() {}, selectTr: function() {}, blurCallback: function() {}, clickTd: function() {}, getTrCallback: function() {}, getTdCallback: function() {}, clickTr: false, lineInfo: [], edit: true, isStopPro: false, scrollBody: true, scrollHeight: null, scrollHeightPC: 0, widthInfo: [] };
            $.extend(defaultObj, Obj);
            O.option = defaultObj;
            O.option.title.join = function(str) {
                var newStr = "";
                O.keyArr = new Array();
                for (var i = 0; i < this.length; i++) { O.keyArr.push(typeof this[i].title != "undefined" ? this[i].title : this[i]); if (O.option.widthInfo.length && O.option.widthInfo[i] != -1) { continue } if (typeof this[i] == "string") { newStr = newStr + $("<div>" + str + "</div>").text() + this[i] } else { if (typeof this[i] == "object") { newStr = newStr + $("<div>" + str + "</div>").text() + (typeof this[i].content == "undefined" ? this[i].title : this[i].content) } } }
                return newStr
            }
        };
        O.getOption = function() { return O.option };
        O.getEle = function() { return $("<div class='showTable'></div>") };
        O.ele = O.getEle();
        O.bufferColArr = new Array();
        O.controlShowHideCol = function(selectStr, panelStr) {
            var ele = $(selectStr);
            panelStr = panelStr || ".tableShowInfo";
            if (ele.length != 1) { return console.log("ele is more!!") }
            var Objs = {
                removePanel: function(ele) {
                    $(ele).find(">.zUIpanelScrollBoxW").remove();
                    $(ele).find(">.zUIpanelScrollBar").remove();
                    $(ele).find(">.zUIpanelScrollBox").remove()
                }
            };
            var allControlEle = ele.find("[data-controlShowIndex]");

            function initA() {
                allControlEle.each(function() { var index = this.getAttribute("data-controlShowIndex"); if (this.checked) { O.showCol(index) } else { O.hideCol(index) } });
                Objs.removePanel($(panelStr));
                $(panelStr).panel({ iWheelStep: 32, vScroll: false, scrollWResize: true })
            }
            ele.on("change", "[data-controlShowIndex]", function() { initA() });
            initA()
        };
        O.getTd = function(str, className) {
            if (typeof className == "undefined" || className == "") { className = "showTableTd" }
            var attr = "";
            if (O.option.lineInfo[O.wdNumber] && O.option.lineInfo[O.wdNumber] == 1) { attr = attr + '  data-innerHTML="1"' }
            var jqObj = $("<div " + attr + "  class='" + className + "'>" + str + "</div>");
            O.option.getTdCallback(O, jqObj);
            var w = O.getWidth();
            jqObj.css({ width: w });
            return jqObj
        };
        O.hideCol = function(index, widthInfo) {
            if (typeof index == "undefined") { index = -1 }
            if (typeof widthInfo == "undefined") { widthInfo = -1 }
            if (!O.bufData) {
                O.bufData = [O.option.data, O.option.title];
                O.hideColArr = []
            }
            if (index == -1) {} else { if (O.hideColArr.indexOf(index) == -1) { O.hideColArr.push(index) } else { return false } }
            var data = new Array();
            data = JSON.parse(JSON.stringify(O.bufData));

            function arrRemoveItem(arr, v) {
                var intA = arr.indexOf(v);
                if (intA != -1) {
                    arr.splice(intA, 1);
                    arrRemoveItem(arr, v)
                }
            }
            for (var i = 0; i < data[0].length; i++) { for (var q = 0; q < O.hideColArr.length; q++) { data[0][i][O.hideColArr[q]] = "!0x000000"; if (i == 0) { data[1][O.hideColArr[q]] = "!0x000000" } } arrRemoveItem(data[0][i], "!0x000000") } arrRemoveItem(data[1], "!0x000000");
            if (widthInfo != -1) { O.option.widthInfo = widthInfo } O.option.data = data[0];
            O.option.title = data[1];
            O.ele.remove();
            O.setOption(O.option);
            O.showTable(O.fatherBox);
            O.initEvent();
            console.log(O)
        };
        O.showAllCol = function(widthInfo) {
            if (typeof O.hideColArr == "undefined") { return console.log("col is all show!!") } O.hideColArr.splice(0, O.hideColArr.length);
            O.hideCol(undefined, widthInfo)
        };
        O.showCol = function(index, widthInfo) {
            if (typeof O.hideColArr == "undefined") { return console.log("col is all show!!") }
            if (O.hideColArr.indexOf(index) == -1) {
                return console.log("col is not hide")
            }
            O.hideColArr.splice(O.hideColArr.indexOf(index), 1);
            O.hideCol(undefined, widthInfo)
        };
        O.getWidth = function() {
            if (this.option.geometric == 0) { return 100 / O.option.title.length + "%" } else {
                if (O.option.geometric == 1) { if (O.option.widthInfo.length) { if (O.option.widthInfo[O.wdNumber] != -1) { var b = O.option.widthInfo[O.wdNumber]; if (O.wdNumber < O.option.title.length - 1) { O.wdNumber++ } else { O.wdNumber = 0 } return b } } var titleStr = O.option.title.join(""); var str = ""; var maxStr = O.maxStr; var num = ""; if (maxStr == titleStr) { num = $("<div>" + O.option.title[O.wdNumber] + "</div>").text().length / maxStr.length * 100 + "%" } else { if (O.option.data[O.maxStrIndex][O.wdNumber] == "undefined") { num = $("<div>" + O.option.data[O.maxStrIndex][typeof O.option.title[O.wdNumber] == "object" ? O.option.title[O.wdNumber].title : O.option.title[O.wdNumber]] + "</div>").text().length / maxStr.length * 100 + "%" } else { num = $("<div>" + O.option.data[O.maxStrIndex][O.wdNumber] + "</div>").text().length / maxStr.length * 100 + "%" } } if (O.wdNumber < O.option.title.length - 1) { O.wdNumber++ } else { O.wdNumber = 0 } return parseFloat(num) * O.widthInt + "%" } else {
                    if (O.option.geometric == 2) {
                        if (O.option.widthInfo.length) { if (O.option.widthInfo[O.wdNumber] != -1) { var b = O.option.widthInfo[O.wdNumber]; if (O.wdNumber < O.option.title.length - 1) { O.wdNumber++ } else { O.wdNumber = 0 } return b } }
                        var titleStr = O.option.title.join("");
                        var str = "";
                        var maxStr = O.maxStr;
                        var num = "";
                        var eleWidth = $(O.fatherBox).outerWidth();
                        var bW = getLength(maxStr) * O.option.fontWidth / 2;
                        var qW = (maxStr.length - getLength(maxStr)) * O.option.fontWidth;
                        var allLength = bW + qW + O.option.paddingRL * (O.option.title.length - O.widthIntA) * 2;
                        var jqObj = $("<div></div>");
                        if (allLength > eleWidth) { O.option.geometric = 1; return O.getWidth() } else {
                            if (maxStr == titleStr) {
                                var strD = typeof O.option.title[O.wdNumber] == "object" ? O.option.title[O.wdNumber].content : O.option.title[O.wdNumber];
                                jqObj.html(strD);
                                bW = getLength(jqObj.text()) * O.option.fontWidth / 2;
                                qW = (jqObj.text().length - getLength(jqObj.text())) * O.option.fontWidth;
                                num = (bW + qW + O.option.paddingRL * 2) / allLength * 100 + "%"
                            } else {
                                if (typeof O.option.data[O.maxStrIndex][O.wdNumber] == "undefined") {
                                    jqObj.html(O.option.data[O.maxStrIndex][typeof O.option.title[O.wdNumber] == "object" ? O.option.title[O.wdNumber].title : O.option.title[O.wdNumber]]);
                                    num = jqObj.text().length / maxStr.length * 100 + "%"
                                } else {
                                    jqObj.html(O.option.data[O.maxStrIndex][O.wdNumber]);
                                    bW = getLength(jqObj.text()) * O.option.fontWidth / 2;
                                    qW = (jqObj.text().length - getLength(jqObj.text())) * O.option.fontWidth;
                                    num = (bW + qW + O.option.paddingRL * 2) / allLength * 100 + "%"
                                }
                            }
                            if (O.wdNumber < O.option.title.length - 1) { O.wdNumber++ } else { O.wdNumber = 0 }
                            return parseFloat(num) * O.widthInt + "%"
                        }
                    }
                }
            }
        };
        O.getTr = function(className, intD) {
            if (typeof className == "undefined") { className = "showTableTr" }
            if (this.trNumber == 0) {
                className = className + " one";
                O.trNumber = 1
            } else {
                className = className + " two";
                O.trNumber = 0
            }
            var ele = $("<div  class='" + className + "'></div>");
            O.option.getTrCallback(O, ele, intD);
            return ele
        };
        O.showTable = function(boxEle) {
            O.bufferTd = new Array();
            O.bufferTr = new Array();
            O.selectTr = -1;
            O.selectTd = -1;
            O.maxStr = O.option.title.join("");
            var str = "";
            O.maxStrIndex = 0;
            O.widthInt = 1;
            O.widthIntA = 0;
            if (O.option.widthInfo.length) { initData(O) } else { O.bufferData = O.option.data }
            for (var yh = 0; yh < O.bufferData.length; yh++) {
                str = txtJoin(O.bufferData[yh], "", O);
                if (str.length > O.maxStr.length) {
                    O.maxStr = str;
                    O.maxStrIndex = yh
                }
            }
            O.trNumber = 0;
            O.wdNumber = 0;
            boxEle.showTableObj = O;
            O.fatherBox = boxEle;
            this.ele.remove();
            O.ele = O.getEle();
            var head = $("<div class='showTableHead'></div>");
            var body = $("<div class='showTableBody'></div>");
            var tr = null;
            var td = null;
            var tdInner = "";
            for (var i = 0; i < this.option.data.length; i++) {
                tr = O.getTr(undefined, i);
                O.trInt = i;
                if (this.option.data[i].length) {
                    if (this.option.isBq) {
                        for (var q = 0; q < this.option.title.length; q++) {
                            if (typeof this.option.title[q] == "string") {
                                if (typeof this.option.data[i][q] == "undefined") { td = O.getTd("") } else { if (this.option.data[i].length) { tdInner = this.option.data[i][q] } else { if (this.option.data[i] == "undefined") { tdInner = this.option.data[i][this.option.title[q]] } } td = O.getTd(tdInner) } tr.append(td);
                                O.bufferTd.push(td)
                            } else {
                                if (typeof this.option.title[q] == "object") {
                                    if (this.option.data[i].length) { tdInner = this.option.data[i][q] } else { if (typeof this.option.data[i] == "object") { if (this.option.data[i][this.option.title[q].title] == "undefined") { tdInner = this.option.data[i][this.option.title[q]] } else { tdInner = this.option.data[i][this.option.title[q].title] } } } td = O.getTd(tdInner);
                                    tr.append(td);
                                    O.bufferTd.push(td)
                                }
                            }
                        }
                    } else {
                        if (this.option.data[i].length) {
                            for (var q = 0; q < this.option.data[i].length; q++) {
                                if (typeof this.option.title[q] == "string") { td = O.getTd(this.option.data[i][q]) } else { if (typeof this.option.title[q] == "object") { td = O.getTd(this.option.data[i][this.option.title[q].title]) } } tr.append(td);
                                O.bufferTd.push(td)
                            }
                        } else {
                            for (var q in this.option.data[i]) {
                                if (typeof this.option.data[i][q] == "string") { td = O.getTd(this.option.data[i][q]) } tr.append(td);
                                O.bufferTd.push(td)
                            }
                        }
                    }
                } else {
                    if (typeof this.option.data[i] == "object") {
                        if (this.option.isBq) {
                            for (var q = 0; q < this.option.title.length; q++) {
                                if (typeof this.option.title[q] == "string") {
                                    if (typeof this.option.data[i][this.option.title[q]] == "undefined") {
                                        td = O.getTd("")
                                    } else { td = O.getTd(this.option.data[i][this.option.title[q]]) }
                                } else { if (typeof this.option.title[q] == "object") { if (typeof this.option.data[i][this.option.title[q].title] == "undefined") { td = O.getTd("") } else { if (typeof this.option.data[i][this.option.title[q].title] != "undefined") { td = O.getTd(this.option.data[i][this.option.title[q].title]) } } } } tr.append(td);
                                O.bufferTd.push(td)
                            }
                        } else {
                            for (var q = 0; q < this.option.data[i].length; q++) {
                                if (typeof this.option.title[q] == "string") { td = O.getTd(this.option.data[i][q]) } else { if (typeof this.option.title[q] == "object") { td = O.getTd(typeof this.option.data[i][this.option.title[q].title] == "undefined" ? this.option.data[i][q] : this.option.data[i][this.option.title[q].title]) } } tr.append(td);
                                O.bufferTd.push(td)
                            }
                        }
                    } else {}
                }
                body.append(tr);
                O.bufferTr.push(tr)
            }
            O.trNumber = 0;
            tr = O.getTr("showTableHTr", "title");
            for (i = 0; i < this.option.title.length; i++) {
                if (typeof this.option.title[i] == "string") {
                    td = O.getTd(this.option.title[i], "showTableHTd");
                    tr.append(td)
                } else {
                    if (typeof this.option.title[i] == "object") {
                        td = O.getTd(typeof this.option.title[i].content == "undefined" ? this.option.title[i].title : this.option.title[i].content, "showTableHTd");
                        tr.append(td)
                    }
                }
            }
            head.append(tr);
            O.scrollHead = $("<div class='showTableHeadScroll'></div>");
            O.scrollBody = $("<div class='showTableBodyScroll'></div>");
            if (O.option.isTitle) { O.scrollHead.append(head) } else { head.remove() } O.scrollBody.append(body);
            this.ele.append(O.scrollHead);
            this.ele.append(O.scrollBody);
            $(boxEle).append(O.ele);
            if (window.TABLE_INFO_BUFFER == null) { window.TABLE_INFO_BUFFER = O } else {}
            if (!inArray(window.TABLE_INFO_BUFFER_ARR, O)) { window.TABLE_INFO_BUFFER_ARR.push(O) }
            if (O.option.scrollBody) {
                if ($(document.body).panel) {
                    O.heightSy();
                    O.scrollBody.panel({ "iWheelStep": 32, "scrollWResize": true, "scrollWIng": function() { console.log(O) } })
                }
            }
        };
        O.heightSy = function() { O.scrollBody.css({ "height": ($(O.option.scrollHeight).height() - O.option.scrollHeightPC) + "px" }) };
        O.initEvent = function() {
            $(O.ele).on("click", function(e) {
                if (O.option.isStopPro) { e.stopPropagation() }
                var oldObj = TABLE_INFO_BUFFER;
                var target = typeof e.srcElement != "undefined" ? e.srcElement : e.target;
                if (TABLE_INFO_BUFFER != O) { O.option.changeBufferObj(oldObj, O) } window.TABLE_INFO_BUFFER = O;
                for (var i = 0; i < TABLE_INFO_BUFFER_ARR.length; i++) { TABLE_INFO_BUFFER_ARR[i].selectTr = -1; for (var q = 0; q < TABLE_INFO_BUFFER_ARR[i].bufferTr.length; q++) { TABLE_INFO_BUFFER_ARR[i].bufferTr[q].removeClass("select") } }
                var targetPath = getParentNode(target);
                for (var o = 0; o < targetPath.length; o++) { if ($(targetPath[o]).hasClass("showTableTd") == true) { O.option.clickTd(targetPath[o], O, e) } }
                if (O.option.edit == true || O.option.clickTr == true) {
                    var path = getParentNode(target);
                    var THIS = null;
                    for (var i = 0; i < path.length; i++) {
                        if ($(path[i]).hasClass("showTableTr") && path[i] != target) {
                            if (O.ele.find(">.showTableBodyScroll>.showTableBody>.showTableTr").index(path[i]) != O.selectTr) {
                                THIS = path[i];
                                O.option.selectChangeBeforeTr(O.selectTr, O);
                                O.selectTr = O.ele.find(">.showTableBodyScroll>.showTableBody>.showTableTr").index(path[i]);
                                for (var d = 0; d < O.bufferTr.length; d++) { O.bufferTr[d].removeClass("select") }(typeof O.bufferTr[O.selectTr] != "undefined") && O.bufferTr[O.selectTr].addClass("select");
                                O.option.selectTr(O.option.data[O.selectTr], O, path[i], e);
                                O.option.selectChangeAfterTr(O.selectTr, O)
                            }
                            return
                        }
                    }
                }
            });
            $(O.ele).on("dblclick", function(e) {
                if (O.option.clickTr == true) { return }
                if (O.option.isStopPro) { e.stopPropagation() }
                var target = e.srcElement ? e.srcElement : e.target;
                if (O.option.edit == true) {
                    if ($(target).hasClass("showTableTd")) {
                        $(target).attr("contenteditable", "true");
                        target.focus()
                    }
                    target.onblur = function() {
                        $(target).attr("contenteditable", "false");
                        O.option.blurCallback(target, O.bufferTr[O.selectTr], O)
                    }
                } else {
                    var path = getParentNode(target);
                    var THIS = null;
                    for (var i = 0; i < path.length; i++) {
                        if ($(path[i]).hasClass("showTableTr") && path[i] != target) {
                            if (O.ele.find(">.showTableBodyScroll>.showTableBody>.showTableTr").index(path[i]) != O.selectTr) {
                                THIS = path[i];
                                O.option.selectChangeBeforeTr(O.selectTr, O);
                                O.selectTr = O.ele.find(">.showTableBodyScroll>.showTableBody>.showTableTr").index(path[i]);
                                for (var d = 0; d < O.bufferTr.length; d++) { O.bufferTr[d].removeClass("select") }(typeof O.bufferTr[O.selectTr] != "undefined") && O.bufferTr[O.selectTr].addClass("select");
                                O.option.selectTr(O.option.data[O.selectTr], O, path[i], e);
                                O.option.selectChangeAfterTr(O.selectTr, O)
                            }
                            return
                        }
                    }
                }
            })
        };
        O.showTreeTable = function(Obj) {};
        return O
    };
    f(fun);
    $(window).on("resize", function() { var a = window.TABLE_INFO_BUFFER_ARR; for (var i = 0; i < a.length; i++) { a[i].heightSy() } });
    $(window).on("keydown", function(e) {
        var b = window.TABLE_INFO_BUFFER;
        if (b == null) { return }

        function f() { for (var i = 0; i < b.bufferTr.length; i++) { b.bufferTr[i].removeClass("select") }(typeof b.bufferTr[b.selectTr] != "undefined") && b.bufferTr[b.selectTr].addClass("select") }
        switch (e.keyCode) {
            case 38:
                if (b.selectTr - 1 <= -2) { return } else {
                    b.option.selectChangeBeforeTr(b.selectTr, b);
                    b.selectTr--
                }
                f();
                b.option.selectChangeAfterTr(b.selectTr, b);
                break;
            case 40:
                if (b.selectTr + 1 >= b.bufferTr.length) { return } else {
                    b.option.selectChangeBeforeTr(b.selectTr, b);
                    b.selectTr++
                }
                f();
                b.option.selectChangeAfterTr(b.selectTr, b);
                break;
            case 13:
                if (b.selectTr < b.bufferTr.length && b.selectTr >= 0) { b.option.selectTr(b.option.data[b.selectTr], b, b.bufferTr[b.selectTr], e) }
        }
    })
})(function(o) {
    $.fn.showTable = function(Obj) {
        var Objs = o();
        this.each(function() {
            Objs.setOption(Obj);
            Objs.showTable(this);
            Objs.initEvent()
        });
        return Objs
    }
});