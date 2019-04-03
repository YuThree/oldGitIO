//selectUL.js
/**
 * V1.0.01 (20180116) 定义版本概念 修改判断机制
 * V1.0.02 (20180116) 修改select的一些bug
 *
 * */
/**
 * 参数说明
 * css 其实就是class建议不要修改 因为要修改需要出一整套样式
 * offset 请以一个对象的形式传入 支持left 和top偏移量
 * dateType 日期格式
 * document 文档对象
 * selectTimeEnd 选择时间结束时触发的函数
 * notThanCallBack 当选择的时间小于设置的时间的时候触发的回调函数 方便提示用户
 * notThan 选择的时间必须超过这个时间
 * isThan 选择的时间必须小于这个时间
 * isThanCallBack 当选择的时间大于isThan的时候触发的回调函数 方便提示用户
 * notThanEqual notThan是否可以取等
 * isThanEqual isThan是否可以取等
 * qjCallBack 当isThan和notThan一起使用的时候 就表示一个时间段了 如果用户没有选择 这个时间段的时间 就可以使用这个回调函数来提示用户
 * top select方向
 * height select的高度
 * top select的方向
 * height select的高度
 * */



//时间控件.js

var LQ = jQuery;
LQ.selectUi = {
    show: function (options) {
        var def = {
            id: "", //selectUi的ID值
            hiddenInput: "", //设置下拉列表获取值保存的字段；
            selectInit: "", //接收下拉表数据，数组[{name:name,value:value}]
            selectNext: "", //二级菜单值
            pulldown: function () {}, //下拉列表选择后返回函数
            callback: function () {},
            top: false,
            height: 200,
            val: 0,
            document: document //callback 初始插件时返回函数
        };
        var ini = $.extend(def, options);
        var $this = $(ini.document).find("#" + ini.id);
        if ($this.length <= 0) return;

        $this.css({
            zIndex: 10
        });
        $this.addClass("select_ul_ui");

        if (ini.selectInit) {
            if (typeof (ini.selectInit) == 'object') {
                var option = '';
                if (typeof (ini.selectInit[0]) != 'object' && ini.selectInit[0] == '') return;
                for (var i = 0; i < ini.selectInit.length; i++) {
                    option += "<option value=" + ini.selectInit[i]['AID'] + ">" + ini.selectInit[i]['AName'] + "</option>";
                    //option+="<option value="+ini.selectInit[i]['value']+">"+ini.selectInit[i]['name']+"</option>";
                }
                $this.children('select').remove();
                $this.append('<select>' + option + '</select>');
            }

        }

        var sel = $this.children("select");
        if (sel.length <= 0) return;
        var sellen = sel.children("option").length;
        var ulid;
        var html = "";
        sel.hide();
        var $u = null,
            $val = "",
            $options = "";
        if (ini.hiddenInput) {
            $u = ini.hiddenInput;
        } else {
            $u = ini.id;
        }

        /*是否传值过来*/
        $val = $this.children(".selectfocus").attr("data-value");
        $options = sel.find("option");
        if ($val != undefined) {
            if ($options.length == 0) {
                //获取同类值
                var val = LQ.selectUi.getPreventData($val);
                LQ.selectUi.appendData(ini.id, val);
                LQ.selectUi.selectOption(sel, $val);

            } else {
                LQ.selectUi.selectOption(sel, $val);

            }
        }

        var items = 0;
        for (var i = 0; i < sel.children("option").length; i++) {
            html += "<li data-val=" + sel.children("option").eq(i).val() + ">" + sel.children("option").eq(i).html() + "</li>";
            items++;

        }
        ulid = "ul_" + $u;
        $this.append('<input type=\"hidden\" name=\"' + $u + '\" id=\"' + $u + '\" />');

        /*传值后设置hidden值*/

        if ($val != undefined) {
            LQ.selectUi.setHiddenValue($this, $val);
        }

        /*是否已经选定值*/
        if (sel.find("option[selected]").text() != '') {
            $this.children(".selectfocus").html('<em>' + sel.find("option[selected]").text() + '</em>');
            $("#" + ini.hiddenInput).val(sel.find("option[selected]").val());
        }
        $this.children("#" + ulid + "").remove();
        $this.append('<ul id=' + ulid + '>' + html + '</ul>');

        var ul = $this.children("ul");
        if (items > 10) {
            ul.height(200);
        }

        ini.callback();

        ul.css({
            zIndex: 11
        }).width($this.width() - 2);
        ul.children("li").bind("click", function (e) {
            e.stopPropagation();
            $(this).parent().siblings('.selectfocus').html('<em>' + $(this).text() + '</em>');
            $(this).parent().siblings('input[type="hidden"]').val($(this).attr("data-val"));
            ulStatus();
            ini.pulldown();

            if (ini.selectNext) {
                LQ.selectUi.selectFun(ini.selectNext, $(this).attr("data-val"), ini.document);
            }
        });
        $this.bind("click", function (e) {
            e.stopPropagation();
            var val = ul.siblings('input[type="hidden"]').val();
            var allEle = ul.children("li");

            var id = $(".select_ul_ui").index($this); //获取索引值
            ulhide(id);
            ulStatus();
            ul.css({
                height: def.height + "px"
            });
            if (def.top) {
                ul.css({
                    top: "auto",
                    paddingTop: 0,
                    borderTop: "1px solid #bdc3c7",
                    bottom: $this.outerHeight() + "px"
                })
            }
            for (var i = 0; i < allEle.length; i++) {
                if (val == allEle[i].getAttribute("data-val")) {
                    ul[0] && (ul[0].scrollTop = allEle[i].offsetTop);
                }
            }

        });

        $(ini.document).bind("click", function (e) {
            var status = ul.css("display");
            if (status != "none") {
                ul.hide();
                ul.parent().css({
                    zIndex: 11
                });
            }
        });

        function ulStatus() {
            if (ul.css("display") == "none") {
                ul.show();
                ul.parent().css({
                    zIndex: 13
                });
            } else {
                ul.hide();
                ul.parent().css({
                    zIndex: 11
                });
            }
        }

        function ulhide(id) {
            var len = $(ini.document).find(".select_ul_ui").length;
            if (len == 0) return;
            for (var i = 0; i < len; i++) {
                if (i != id) {
                    $(ini.document).find(".select_ul_ui").eq(i).children("ul").hide().parent().css({
                        zIndex: 11
                    });
                }
            }
        }

    },
    selectOption: function ($sel, $val) {
        if ($val == undefined) return;
        $sel.find("option").each(function (index, element) {
            if ($(element).val() == $val) {
                $(element).attr("selected", "true");
            }
        })
    },
    setHiddenValue: function ($this, $val) {
        if ($val == undefined) return;
        $this.children('input[type="hidden"]').val($val);
    },
    selectFun: function (obj, value, doc) {
        var id = obj['selectid'];
        $(doc).find("#" + id).show();
        $(doc).find("#" + id).children('.selectfocus').html('<em>' + obj['selectTxt'] + '</em>');
        $(doc).find("#" + id).children('input[type="hidden"]').val('');
        LQ.selectUi.appendData(id, value, doc);
        $(doc).find("#" + id).find("li").bind("click", function (e) {
            e.stopPropagation();
            $(this).parent().siblings('.selectfocus').html('<em>' + $(this).text() + '</em>');
            $(this).parent().siblings('input[type="hidden"]').val($(this).attr("data-val"));
            $(this).parent().hide().css({
                zIndex: 11
            });
        });
    },
    appendData: function (id, val, doc) {
        var items = 0;
        var value = LQ.selectUi.getData(val);
        if (value) {
            if (typeof (value) == 'object') {
                var option = '';
                var listr = '';
                if (typeof (value[0]) != 'object' && value[0] == '') return;
                for (var i = 0; i < value.length; i++) {
                    option += "<option value=" + value[i]['AID'] + ">" + value[i]['AName'] + "</option>";
                    listr += "<li data-val=" + value[i]['AID'] + ">" + value[i]['AName'] + "</li>";
                    items++;
                }
                $(doc).find("#" + id).children("select").empty();
                $(doc).find("#" + id).children("select").append(option);
                $(doc).find("#" + id).children("ul").empty();
                $(doc).find("#" + id).children("ul").append(listr);
            }
        }

        var ul = $(doc).find("#" + id).children("ul");
        if (items > 10) {
            ul.height(200);
        } else {
            ul.height('');
        }

    },
    getData: function (value) {
        var html = [];
        for (var i = 0; i < areas.length; i++) {
            if (areas[i]["APid"] == value) {
                html.push(areas[i]);
            }
        }
        return html;
    },
    getPreventData: function (value) {
        var $id = null;
        for (var i = 0; i < areas.length; i++) {
            if (areas[i]["AID"] == value) {
                $id = areas[i]["APid"];
            }
        }
        return $id;
    }
};
var lq_datetimepick = false;
//yearArr 数组 第一个表示开始时间 第二个表示结束时间



$.fn.lqdatetimepicker = function (options) {
    lq_datetimepick = true;
    options.changValue = options.changValue || 50;
    return this.each(function () {
        var $this = $(this);
        var THIS = this;
        if ($("#lq-datetimepick").length > 0) $("#lq-datetimepick").remove();
        var _this = {
            css: "datetime-day", //datetime-hour 时分样式 ，datetime-day 日期样式
            offset: {
                left: 0,
                top: 10
            }, //偏移量
            notThanEqual: false,
            isThanEqual: false,
            qjCallBack: function () {},
            dateType: 'DDDD-MM-DD hh:mm:ss', //日期格式
            notThanCallBack: function () {},
            notThan: false, //选择的时间必须超过这个时间
            isThan: false, //选择的时间必须小于或者等于这个时间
            isThanCallBack: function () {},
            top: false, //select的方向
            height: 200, //select的高度
            date: {
                'D': {
                    month: new Date((THIS.data_year ? THIS.data_year : new Date().getFullYear()) + "/" + (THIS.data_mouth ? THIS.data_mouth : (new Date().getMonth() + 1)) + "/" + (THIS.data_day ? THIS.data_day : new Date().getDate())), //日期默认时间
                    selected: THIS.data_day ? THIS.data_day : (new Date()).getDate()
                },
                'M': {
                    begin: 1, //月份开始
                    end: 12, //月份结束
                    selected: THIS.data_mouth ? THIS.data_mouth : (new Date()).getMonth() + 1 //月份初始
                },
                'Y': {
                    begin: THIS.data_year ? parseInt(THIS.data_year) - options.changValue : options.yearArr ? options.yearArr[0] : parseInt((new Date()).getFullYear()) - options.changValue, //年份开始
                    end: THIS.data_year ? parseInt(THIS.data_year) + options.changValue : options.yearArr ? options.yearArr[1] : parseInt((new Date()).getFullYear()) + options.changValue, //年份结束
                    selected: THIS.data_year ? THIS.data_year : (new Date()).getFullYear() //年份初始
                }
            },
            selectback: function () {}, //选择时间的事件回调已经废弃
            callback: function () {}, //初始化时间事件回调已经废弃
            document: document, //指定节点的文档对象
            selectTimeEnd: function (A) {

            }
        };
        $.extend(_this, options);
        //substring
        var doc = _this.document;
        var hasYear = _this.hasYear = _this.dateType.search("YYYY");
        var hasMouth = _this.hasMouth = _this.dateType.search("MM");
        var hasDay = _this.hasDay = _this.dateType.search("DD");
        var hasHour = _this.hasHour = _this.dateType.search("hh");
        var hasMin = _this.hasMin = _this.dateType.search("mm");
        var hasScro = _this.hasScro = _this.dateType.search("ss");
        var _arr = $("<div class=\"datetime-arr\" />");
        var _selectitem = $("<div class=\"datetime-select\" />");
        if (hasDay != -1) {
            var _header = $("<dl class=\"datetime-time\"></dl>");
        }
        if (hasDay != -1) {
            var _item = $("<dl class=\"datetime-time\"></dl>");
        }

        //最高级容器
        var _obj = $("<div class=\"lq-datetimepick\" id=\"lq-datetimepick\" />");
        _obj.css({
            zIndex: 100000000
        })
        //装节点容器
        var _container = $("<div class=\"select-datetime\" />");
        var SFMtimeArr = null;
        var Dhour = hasHour == -1 ? "00" : $this.val();
        //时间 小时
        THIS.data_hour = THIS.data_hour ? THIS.data_hour <= 9 ? "0" + parseInt(THIS.data_hour) : THIS.data_hour : "00";
        THIS.data_min = THIS.data_min ? THIS.data_min <= 9 ? "0" + parseInt(THIS.data_min) : THIS.data_min : "00";
        THIS.data_scro = THIS.data_scro ? THIS.data_scro <= 9 ? "0" + parseInt(THIS.data_scro) : THIS.data_scro : "00";
        var _hour = $("<div style='margin-top: 10px;float: left;width: 100%;'>时:&ensp;<input data-shi='1' type='range' min='0' max='23' style='vertical-align: middle;width: 158px;display:inline-block;' value='" + THIS.data_hour + "'><span data-show='1' data-Sshi>" + THIS.data_hour + "</span></div>");
        //时间 分钟
        var _min = $("<div style='float: left;width: 100%;'>分:&ensp;<input data-feng='1' type='range' min='0' max='59' style='vertical-align: middle;width: 158px;display:inline-block;' value='" + THIS.data_min + "'><span data-show='1' data-Sfeng>" + THIS.data_min + "</span></div>");
        //时间 秒
        var _sco = $("<div style='float: left;width: 100%;'>秒:&ensp;<input data-miao='1' type='range' min='0' max='59' style='vertical-align: middle;width: 158px;display:inline-block;' value='" + THIS.data_scro + "'><span data-show='1' data-Smiao>" + THIS.data_scro + "</span></div>");
        //确认按钮
        var _btn = $("<div class='time_btn'>\u786e\u8ba4</div>");
        var _day;
        var _datevalue = new Date();
        var _dateyear = THIS.data_year ? THIS.data_year : _datevalue.getFullYear();
        var _datemonth = THIS.data_mouth ? THIS.data_mouth : _datevalue.getMonth() + 1;
        var _datedate = THIS.data_day ? THIS.data_day : _datevalue.getDate();
        var _x = $this.offset().left + _this.offset.left,
            _y = $this.offset().top + $this.outerHeight() + _this.offset.top;
        if (_this.css != undefined || _this.css != '') {
            if (_header) {
                _header.addClass(_this.css);
            }

            if (_item) {
                _item.addClass(_this.css);
            }

        }

        if (hasDay != -1) {
            $.fn.lqdatetimepicker.setDateData($this, _obj, _item, _this);
        }


        //日期


        //年份
        var _select_year = $.fn.lqdatetimepicker.setSelectData(_this, 'Y');
        var _selectul_year = $("<div class=\"selectul\" id=\"lqyear\" />");
        var _select_year_t = $("<div class=\"selectfocus\"></div>");
        if (_dateyear != '') _select_year_t.attr("data-value", _dateyear);
        if (hasYear != -1) {
            _select_year_t.html("<em>选择年份</em>");
            _select_year_t.appendTo(_selectul_year);
            _select_year.appendTo(_selectul_year);
            _selectul_year.appendTo(_selectitem);
            _selectitem.appendTo(_container);
        }
        //月份
        var _select_month = $.fn.lqdatetimepicker.setSelectData(_this, 'M');
        var _selectul_month = $("<div class=\"selectul\" id=\"lqmonth\" />");
        var _select_month_t = $("<div class=\"selectfocus\"></div>");
        if (_datemonth != '') _select_month_t.attr("data-value", _datemonth);
        if (hasMouth != -1) {
            _select_month_t.html("<em>选择月份</em>");
            _select_month_t.appendTo(_selectul_month);
            _select_month.appendTo(_selectul_month);
            _selectul_month.appendTo(_selectitem);
            _selectitem.appendTo(_container);
        }

        //星期
        if (hasDay != -1) {
            _week = $.fn.lqdatetimepicker.intWeek();
            for (var i = 0; i < 7; i++) {
                _day = $("<dt><span>" + _week[i] + "</span></dt>");
                _day.appendTo(_header);
            }
            _header.appendTo(_container);
        }





        _arr.appendTo(_obj);
        if (_item) {
            _item.appendTo(_container);
        }


        _container.appendTo(_obj);


        _this.callback();
        if (hasHour != -1) {
            _container.append(_hour);
        }
        if (hasMin != -1) {
            _container.append(_min);
        }
        if (hasScro != -1) {
            _container.append(_sco);
        }
        _container.append("<div style='clear:both;'></div>");
        _container.append(_btn);
        var DayClass = _container.find(".DayClass");
        for (var p = 0; p < DayClass.length; p++) {
            if (DayClass[p].innerText == _datedate) {
                $(DayClass[p]).addClass("current");
            }
        }

        _container.find('[data-shi]').on("mousemove", function () {
            var fu = this.parentNode;
            $(fu).find('[data-show]')[0].innerHTML = this.value >= 10 ? this.value : "0" + this.value;
        });
        _container.find('[data-feng]').on("mousemove", function () {
            var fu = this.parentNode;
            $(fu).find('[data-show]')[0].innerHTML = this.value >= 10 ? this.value : "0" + this.value;
        });
        _container.find('[data-miao]').on("mousemove", function () {
            var fu = this.parentNode;
            $(fu).find('[data-show]')[0].innerHTML = this.value >= 10 ? this.value : "0" + this.value;
        });

        if (_this.showNode) {
            _this.showNode.css({
                'position': 'relative'
            })
            _obj.appendTo(_this.showNode).show();

            if (_this.offset.left) {
                _obj.css({
                    left: _this.offset.left + 'px'
                })
            }

            if (_this.offset.top) {
                _obj.css({
                    top: (_this.offset.top + _this.showNode.height()) + 'px'
                })
            }

            if ($this.offset().top > document.documentElement.clientHeight / 2) {
                _obj.css({
                    top: (_this.offset.top - $this.outerHeight() - 20 - _obj.outerHeight() + _this.showNode.height()) + 'px'
                })
            }
        } else {
            _obj.appendTo($(doc.body)).css({
                left: _x + 'px',
                top: _y + 'px'
            }).show();
            if ($this.offset().top > document.documentElement.clientHeight / 2) {
                _obj.css({
                    top: (_y - _obj.outerHeight() - _this.offset.top - $this.outerHeight() - 10) + 'px'
                })
            }
            if ($this.offset().left > document.documentElement.clientWidth / 2 && $this.outerWidth() < _obj.outerWidth()) {
                _obj.css({
                    left: $this.offset().left + $this.outerWidth() - _obj.outerWidth() + 'px'
                })
            }
        }


        _container.find(".time_btn").on("click", function () {
            var str = "";

            if (_obj.find(".current").hasClass("blank")) {
                return 0;
            }
            if (_this.hasDay != -1) {
                if (!_obj.find(".current").length) {
                    THIS.data_day = 1;
                    //return 0;
                    _obj.find(".DayClass").each(function () {
                        if (!$(this).hasClass("blank")) {
                            $(this).addClass("current");
                            return false;
                        }
                    })
                }
            }
            _obj.find(".current")[0] && (THIS.data_day = parseInt(_obj.find(".current")[0].innerText));
            THIS.data_year = parseInt(_obj.find("#selectYear").val());
            THIS.data_mouth = parseInt(_obj.find("#selectMonth").val());
            if (_obj.find(".current").attr("data-value")) {
                str = str + _obj.find(".current").attr("data-value");
            } else {
                if (_this.hasYear != -1 && _this.hasMouth != -1) {
                    if (_this.date.D.month.getMonth() + 1 <= 9) {
                        str = str + THIS.data_year + _this.dateType.substring(_this.hasYear + 4, _this.hasMouth) + 0 + (THIS.data_mouth)
                    } else {
                        str = str + THIS.data_year + _this.dateType.substring(_this.hasYear + 4, _this.hasMouth) + (THIS.data_mouth)
                    }
                } else if (_this.hasMouth != -1) {

                    if (THIS.data_mouth <= 9) {
                        str = str + "0" + (THIS.data_mouth);
                    } else {
                        str = str + (THIS.data_mouth);
                    }
                } else if (_this.hasYear != -1) {
                    str = str + $("#selectYear").val();
                }
            }

            if (_obj.find('[data-Sshi]').html()) {
                if (_this.hasDay != -1) {
                    str = str + _this.dateType.substring(_this.hasDay + 2, _this.hasHour) + _obj.find('[data-Sshi]').html();
                } else if (_this.hasMouth != -1) {
                    str = str + _this.dateType.substring(_this.hasMouth + 2, _this.hasHour) + _obj.find('[data-Sshi]').html();
                } else if (_this.hasYear != -1) {
                    str = str + _this.dateType.substring(_this.hasYear + 4, _this.hasHour) + _obj.find('[data-Sshi]').html();
                }
                THIS.data_hour = parseInt(_obj.find('[data-Sshi]').html());
            }
            if (_obj.find('[data-Sfeng]').html()) {
                if (_this.hasHour != -1) {
                    str = str + _this.dateType.substring(_this.hasHour + 2, _this.hasMin) + _obj.find('[data-Sfeng]').html();
                } else if (_this.hasDay != -1) {
                    str = str + _this.dateType.substring(_this.hasDay + 2, _this.hasMin) + _obj.find('[data-Sfeng]').html();
                } else if (_this.hasMouth != -1) {
                    str = str + _this.dateType.substring(_this.hasMouth + 2, _this.hasMin) + _obj.find('[data-Sfeng]').html();
                } else if (_this.hasYear != -1) {
                    str = str + _this.dateType.substring(_this.hasYear + 4, _this.hasMin) + _obj.find('[data-Sfeng]').html();
                }
                THIS.data_min = parseInt(_obj.find('[data-Sfeng]').html());
            }
            if (_obj.find('[data-Smiao]').html()) {

                if (_this.hasMin != -1) {
                    str = str + _this.dateType.substring(_this.hasMin + 2, _this.hasScro) + _obj.find('[data-Smiao]').html();
                } else if (_this.hasHour != -1) {
                    str = str + _this.dateType.substring(_this.hasHour + 2, _this.hasScro) + _obj.find('[data-Smiao]').html();
                } else if (_this.hasDay != -1) {
                    str = str + _this.dateType.substring(_this.hasDay + 2, _this.hasScro) + _obj.find('[data-Smiao]').html();
                } else if (_this.hasMouth != -1) {
                    str = str + _this.dateType.substring(_this.hasMouth + 2, _this.hasScro) + _obj.find('[data-Smiao]').html();
                } else if (_this.hasYear != -1) {
                    str = str + _this.dateType.substring(_this.hasYear + 4, _this.hasScro) + _obj.find('[data-Smiao]').html();
                }
                THIS.data_scro = parseInt(_obj.find('[data-Smiao]').html());
            }

            function getDataValue(timeArr, strTime, startNum) {
                if (timeArr[startNum] == -1) {
                    return null;
                }
                for (var i = startNum; i >= 0; i--) {
                    if (timeArr[i] != -1) {
                        if (i == 0) {
                            return strTime.substring(timeArr[i], timeArr[startNum] + 4);
                        } else {
                            return strTime.substring(timeArr[i], timeArr[startNum] + 2);
                        }

                    }
                }
                return null;
            }

            function isNotThan(num, str) {
                var timeAttriArr = ["data_year", "data_mouth", "data_day", "data_hour", "data_min", "data_scro"];
                var timeArr = [_this.hasYear, _this.hasMouth, _this.hasDay, _this.hasHour, _this.hasMin, _this.hasScro];
                var value = getDataValue(timeArr, str, num);
                value = parseInt(value);
                if (value < THIS[timeAttriArr[num]]) {
                    return true;
                } else if (value > THIS[timeAttriArr[num]]) {
                    return false;
                }
                if (value == THIS[timeAttriArr[num]]) {
                    return 4;
                }

            }
            var timeArr = [_this.hasYear, _this.hasMouth, _this.hasDay, _this.hasHour, _this.hasMin, _this.hasScro];
            var i = 0;
            var bool = 3;
            var bool02 = 3;

            function getInfo(str) {

                var bl = null;
                for (i = 0; i < timeArr.length; i++) {
                    if (timeArr[i] != -1) {
                        bl = isNotThan(i, str);
                        if (bl == true) {
                            return true; //选择时间大于传入时间
                        } else if (bl == false) {
                            return false; //选择时间小于传入时间
                        }
                    }
                }
                return "xd";
            }
            if (_this.notThan && _this.isThan) {
                bool = getInfo(_this.isThan);
                bool02 = getInfo(_this.notThan);
                if (bool == false && bool02 == true) {
                    $this.val(str);
                    _this.selectTimeEnd.call(THIS, $this);
                    _obj.remove();
                    return 0;
                } else if (str == _this.isThan) {
                    if (_this.isThanEqual == true) {
                        $this.val(str);
                        _this.selectTimeEnd.call(THIS, $this);
                        _obj.remove();
                        return 0;
                    }
                    _this.qjCallBack(_this);
                    console.log("选择时间应该在区间" + _this.notThan + " " + _this.isThan);
                    return 0;
                } else if (str == _this.notThan) {
                    if (_this.notThanEqual == true) {
                        $this.val(str);
                        _this.selectTimeEnd.call(THIS, $this);
                        _obj.remove();
                        return 0;
                    }
                    _this.qjCallBack(_this);
                    console.log("选择时间应该在区间" + _this.notThan + " " + _this.isThan);
                    return 0;
                } else {
                    _this.qjCallBack(_this);
                    console.log("选择时间应该在区间" + _this.notThan + " " + _this.isThan);
                    return 0;
                }
            } else if (_this.isThan) {

                bool = getInfo(_this.isThan);
                if (bool == true) {
                    _this.isThanCallBack(_this);
                    console.log("选择时间小于当前时间" + _this.isThan);
                } else if (bool == false) {
                    $this.val(str);
                    _this.selectTimeEnd.call(THIS, $this);
                    _obj.remove();
                    return 0;
                } else if (bool == "xd") {
                    if (_this.isThanEqual == true) {
                        $this.val(str);
                        _this.selectTimeEnd.call(THIS, $this);
                        _obj.remove();
                        return 0;
                    }
                    _this.isThanCallBack(_this);
                    console.log("选择时间小于当前时间" + _this.isThan);
                }
            } else if (_this.notThan) {
                bool = getInfo(_this.notThan);
                if (bool == true) {
                    $this.val(str);
                    _this.selectTimeEnd.call(THIS, $this);
                    _obj.remove();
                    return 0;
                } else if (bool == false) {
                    _this.notThanCallBack(_this);
                    console.log("选择时间大于当前时间" + _this.notThan);
                    return 0;
                } else if (bool == "xd") {
                    if (_this.notThanEqual == true) {
                        $this.val(str);
                        _this.selectTimeEnd.call(THIS, $this);
                        _obj.remove();
                        return 0;
                    } else {
                        _this.notThanCallBack(_this);
                        console.log("选择时间大于当前时间" + _this.notThan);
                        return 0;
                    }
                }
            } else {

                $this.val(str);
                _this.selectTimeEnd.call(THIS, $this);
                _obj.remove();
            }

        });
        LQ.selectUi.show({
            id: "lqyear",
            hiddenInput: "selectYear",
            top: _this.top,
            height: _this.height,
            val: THIS.data_year,
            pulldown: function () {
                var _year = $(doc).find("#selectYear").val();
                var _month = $(doc).find("#selectMonth").val();
                var _day = 1;
                _day = _day == undefined ? _this.date.D.selected : _day;
                _this.date.D.month = new Date(_year + '/' + _month + '/' + _day);
                $.fn.lqdatetimepicker.setDateData($this, _obj, _item, _this);
            },
            document: _this.document
        });
        LQ.selectUi.show({
            id: "lqmonth",
            hiddenInput: "selectMonth",
            top: _this.top,
            val: THIS.data_mouth,
            height: _this.height,
            pulldown: function () {

                var _year = $(doc).find("#selectYear").val();
                var _month = $(doc).find("#selectMonth").val();
                var _day = 1;
                _day = _day == undefined ? _this.date.D.selected : _day;
                _this.date.D.month = new Date(_year + '/' + _month + '/' + _day);
                $.fn.lqdatetimepicker.setDateData($this, _obj, _item, _this);
            },
            document: _this.document
        });

        _obj.on("click", function (e) {
            e.stopPropagation();
        });

        $(doc).on("click", function (e) {
            if (lq_datetimepick) {
                _obj.remove();
            }
        });
    })
};

$.fn.lqdatetimepicker.setDateData = function ($this, _obj, _item, _this) {
    var _time;
    var _datetime = $.fn.lqdatetimepicker.setDateTime(_this);

    if (typeof (_datetime) == 'object') {
        if (_item) {
            _item.empty();
        }

        for (var i = 0; i < _datetime.length; i++) {
            var ___day = "";
            if (_datetime[i] <= 9) {
                ___day = "0" + _datetime[i];
            } else {
                ___day = _datetime[i];
            }
            _time = $("<dd class='DayClass' data-value=" + ___day + "><em>" + _datetime[i] + "</em></dd>");
            if (_this.hasMouth != -1 && _this.hasYear == -1) {
                _time.attr('data-value', (_this.date.D.month.getMonth() + 1 > 9 ? _this.date.D.month.getMonth() + 1 : "0" + (_this.date.D.month.getMonth() + 1)) + _this.dateType.substring(_this.hasMouth + 2, _this.hasDay) + _time.attr('data-value'));
            }
            if (_this.hasMouth != -1 && _this.hasYear != -1) {
                _time.attr('data-value', _this.date.D.month.getFullYear() + _this.dateType.substring(_this.hasYear + 4, _this.hasMouth) + (_this.date.D.month.getMonth() + 1 > 9 ? _this.date.D.month.getMonth() + 1 : "0" + (_this.date.D.month.getMonth() + 1)) + _this.dateType.substring(_this.hasMouth + 2, _this.hasDay) + _time.attr('data-value'))
            }
            if (_this.hasMouth == -1 && _this.hasYear != -1) {
                _time.attr('data-value', _this.date.D.month.getFullYear() + _this.dateType.substring(_this.hasYear + 4, _this.hasDay) + _time.attr('data-value'));
            }
            _time.on("click", function () {
                var fu = $(this.parentNode.parentNode);
                var fu_1 = $(this.parentNode);
                //_obj.remove();
                fu_1.find(".current").removeClass("current");
                $(this).addClass("current");
                _this.selectback();
            });
            _time.hover(function () {
                $(this).addClass('over');
            }, function () {
                $(this).removeClass('over');
            });
            if ($this.val() == _datetime[i]) {
                _time.addClass('selected')
            }
            if (($this.val() == '') && (_this.dateType == 'D' || _this.dateType == 'A') && (_this.date.D.month.getDate() == _datetime[i])) {
                _time.addClass('current');
            }
            if ((new Date($this.val()).getDate() == _datetime[i]) && (_this.dateType == 'D' || _this.dateType == 'A')) {
                _time.addClass('current');
            }
            if (_datetime[i] == '') {
                _time.addClass('blank');
            }
            _time.appendTo(_item);
        }
    }
};

$.fn.lqdatetimepicker.setDateTime = function (_this) {
    var dateTime;
    dateTime = $.fn.lqdatetimepicker.intDayTime(_this);
    return dateTime;
};

$.fn.lqdatetimepicker.setSelectData = function (_this, type) {
    var _data;
    var _cell;
    var _select = $("<select></select>");
    if (type == 'Y') {
        _data = $.fn.lqdatetimepicker.intYearTime(_this);
        _cell = '年';
    }
    if (type == 'M') {
        _data = $.fn.lqdatetimepicker.intMonthTime(_this);
        _cell = '月'
    }
    for (var i = 0; i < _data.length; i++) {
        $("<option></option>").text(_data[i] + _cell).attr("value", _data[i]).appendTo(_select);
    }
    return _select;

};

/*时分*/
/*$.fn.lqdatetimepicker.intHourTime = function(_this){
    console.log(_this);
    return "as";
};*/

/*日期*/
$.fn.lqdatetimepicker.intDayTime = function (_this) {
    var _a = [];
    var _date = _this.date.D.month;
    var _year = _date.getFullYear();
    var _month = _date.getMonth();
    var _week = new Date(_year + '/' + (_month + 1) + '/1').getDay(); // 当前月的第一天
    var _day = 32 - new Date(_year, _month, 32).getDate();
    var _cell = Math.ceil((_week + _day) / 7) * 7 - (_week + _day);
    for (var w = 0; w < _week; w++) {
        _a.push('');
    }
    for (var i = 0; i < _day; i++) {
        _a.push(i + 1);
    }
    for (var w = 0; w < _cell; w++) {
        _a.push('');
    }
    return _a;
};

/*月份*/
$.fn.lqdatetimepicker.intMonthTime = function (_this) {
    var _a = [];
    var _month_begin = _this.date.M.begin;
    var _month_end = _this.date.M.end;
    for (var i = _month_begin, j = _month_end + 1; i < j; i++) {
        _a.push(i);
    }
    return _a;
};

/*年份*/
$.fn.lqdatetimepicker.intYearTime = function (_this) {
    var _a = [];
    var _year_begin = _this.date.Y.begin;
    var _year_end = _this.date.Y.end;
    for (var i = _year_begin, j = _year_end + 1; i < j; i++) {
        _a.push(i);
    }

    return _a;
};

$.fn.lqdatetimepicker.intWeek = function () {
    return ['日', '一', '二', '三', '四', '五', '六']
};

$.fn.lqdatetimepicker.dateAdd = function (interval, NumDay, dtDate) {
    var dtTmp = new Date(dtDate);
    if (isNaN(dtTmp)) dtTmp = new Date();
    switch (interval.toUpperCase()) {
        case "S":
            return new Date(Date.parse(dtTmp) + (1000 * NumDay));
        case "M":
            return new Date(Date.parse(dtTmp) + (60000 * NumDay));
        case "H":
            return new Date(Date.parse(dtTmp) + (3600000 * NumDay));
        case "D":
            return new Date(Date.parse(dtTmp) + (86400000 * NumDay));
        case "W":
            return new Date(Date.parse(dtTmp) + ((86400000 * 7) * NumDay));
        case "M":
            return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + NumDay, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
        case "Y":
            return new Date((dtTmp.getFullYear() + NumDay), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
    }
};