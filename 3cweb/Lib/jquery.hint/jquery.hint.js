/**
* Created by Tang Yueming on 2014-12-25.
*/
(function ($) {
    /**
    * applay an UI
    * @param settings setting of the plugin
    * @returns {*}
    */
    $.fn.jHint = function (settings) {
        // get parameters form the user
        //  var ps = $.extend({}, $.fn.jHint.defauts, settings);
        var ps = $.extend($.fn.jHint.defauts, settings);
        // get the element which the plugin will append to

        // ps.renderTo = typeof ps.renderTo == 'string' ? $(ps.renderTo) : ps.renderTo;

        ps.renderTo = $(this);

        // create the UI element of the plugin

        //var resultContainer = $('<input type="text" />').addClass(ps.resultContainerCSSName).appendTo(ps.renderTo);

        var resultContainer = $(this);
        var $outBox = $("<div class='qzoutBox' tabindex=1></div>")

        var $Outdiv = $("<div style='position: relative;display:inline-table;'></div>");
        $(this).wrap($Outdiv).after($outBox);
       
        $('.qzoutBox').hide();
        // add class to ul element
        if (!ps.noreadonly) {
            $(this).attr('readonly', 'readonly').css('cursor', 'default')
        }
        var txt_id = $(this).attr('id');


        $('<ul id="ul_' + txt_id + '"></ul>').addClass(ps.listContainerCSSName).appendTo($outBox);
        var listContainer = $('#ul_' + txt_id);


        var suggestion = resultContainer;

        //添加文本框变化事件，控制清除公里标提醒内容 by lc 2015-11-30
        if (ps.km == true) {
            resultContainer.bind('change', ps, function (e) {
                setKmMarkValue(e);
            });
        }
        // bind evnets of the input box
        resultContainer.bind('keyup click', { ps: ps, suggestion: suggestion }, resultContainerEvent);
        
        //$('body').bind('mouseup', ps, function (e) {
        //    console.log($(this).parents('.qzoutBox').length + 'aaaa' + $('.qzoutBox').is(":hidden"))
        //    console.log($(this) )
        //   if ($(this).parents('.qzoutBox').length == 0 && !$('.qzoutBox').is(":hidden")) {
        //        listContainer.hide();
        //        $('.sureBtn,.FindInput,.qzoutBox').hide();
        //    }
           
        //})
        //$outBox.bind('mouseleave', ps, function (e) {
        //    $outBox.focus();
        //})
        $("body").click(function (e) {
            if (!$(e.target).closest(".qzoutBox").length && $(e.target).attr('id') != txt_id) {
                $(".qzoutBox").hide()
            }
            
        });
        // bind events of the ul element
        //resultContainer.bind('blur', ps, function (e) {
        //    //   var hilightItem = $(this).next('ul').find('li.hilight');
        //    var hilightItem = listContainer.find('li.hilight');
        //    if (hilightItem.length > 0) {
        //        hilightItem.removeClass('hilight');
        //    }
        //    // $(this).next('ul').hide();
        //    listContainer.hide();
        //    $('.sureBtn,.FindInput').hide();
        //    setKmMarkValue(e);
        //});
        // bind thd blur event when the mouse leaves the listContainer
        //listContainer.bind('mouseleave', function () {
        //    resultContainer.bind('blur', ps, function () {
        //        //   var hilightItem = $(this).next('ul').find('li.hilight');
        //        var hilightItem = listContainer.find('li.hilight');
        //        if (hilightItem.length > 0) {
        //            hilightItem.removeClass('hilight');
        //        }
        //        // $(this).next('ul').hide();
        //        $('.sureBtn').hide();
        //        listContainer.hide();
        //    });
        //});

        return suggestion;
    };
    /**
    * get the string value of the input box
    * @returns {string} the hinting string
    */
    $.fn.getHintValue = function () {
        return this[0].value;
    };
    /**
    * get the string code of the input box
    * @returns {string} code of the hinting string
    */
    $.fn.getHintCode = function () {
        var value = this[0].value;
        var code = '';
        for (item in this.data) {
            if (this.data[item].name == value) {
                code = this.data[item].code;
                break;
            }
        }
        return code;
    };
    /**
    * default ini parameters of the plugin
    */
    $.fn.jHint.defauts = {
        // object which will conatins the plugin
        renderTo: $(document.body),
        // class name of the input box
        resultContainerCSSName: 'resultContainer',
        // class name of the list
        listContainerCSSName: 'listContainer',
        // class name of the list item
        listItemCssName: 'listItem',
        // whether update according the list automatically or not
        autoUpdate: false,
        // whether thd plugin is enabled
        enabled: true,
        // type of the data source of the hinting list
        type: 'org',
        // line code
        line: '',
        callback: function () { },
        // indentify whether the list existed, no need to be configed
        flag: false,
        // can choose two section as begin end
        isStartEnd: false
    };
    /**
    * callback to response the evnets of the input box
    * @param e parameters of the event
    */
    function resultContainerEvent(e) {
        $('.qzoutBox').show();
        // dealed when the input box is not empty
        if (this.value.length >= 0) {
            var ps = e.data.ps;
            // get the ul object
            // var listContainer = $(this).next('ul.' + ps.listContainerCSSName);

            var txt_id = $(this).attr('id');
            var listContainer = $('#ul_' + txt_id);

            // escape key
            if (e.keyCode == 27) {
                listContainer.hide();
                $('.sureBtn,.FindInput,.qzoutBox').hide();
                return;
            }
            // enter key
            //if (e.keyCode == 13) {
            //    var hilightItem = listContainer.find('li.hilight');
            //    if (hilightItem.length > 0) {
            //        $(this).val(hilightItem[0].innerHTML);
            //        hilightItem.removeClass('hilight');
            //    }
            //    $('.sureBtn').hide();
            //    listContainer.hide();
            //    return;
            //}
            var temp_L = ',';
            var tempTag = ('StationSection' === ps.type ? 'STATIONSECTION' : 'LOCOMOTIVE');
            var tempValue = '';
            var tempAshx = '';
            var _param = '';
            // get the suggestion list
            if (e.keyCode != 38 && e.keyCode != 40) {
                $('.cler,.sureBtn,.FindInput').remove();
                if (ps.isStartEnd) {
                    var url = getUrlNew(ps, '');
                    tempValue = '';
                } else {
                    var url = getUrlNew(ps, this.value);
                    tempValue = this.value;
                }
                var listItemsJson;
                tempAshx = (url.split('.ashx')[0]).split('/');
                tempAshx = tempAshx[tempAshx.length - 1];
                _param = 'S_jHint_{' + tempAshx + temp_L + tempTag + temp_L + ps.type + temp_L + tempValue + temp_L + ps.line + '}';
                if ('' !== localStorage[_param] && undefined !== localStorage[_param] && localStorage['S_Cache_control_data'] === 'True') {
                    listItemsJson = eval('(' + localStorage[_param] + ')');
                } else {
                    $.ajax({
                        type: 'GET',
                        url: url,
                        async: false,
                        cache: true,
                        success: function (result) {
                            localStorage[_param] = result; //保存在本地缓存中
                            listItemsJson = eval('(' + result + ')');
                        }
                    });
                }
                // if list has existed, clear it
                if (listContainer.children().length > 0) {
                    listContainer.children().remove();
                }
                // update json string of the plugin
                e.data.suggestion.data = listItemsJson.result;

                var len = listItemsJson.result.length;
                // no result
                if (len < 0) {
                    return;
                }
                var listItems = '';
                for (var i = 0; i < len; ++i) {
                    if (ps.isStartEnd) {
                        listItems += '<li idx=\"' + i + '\" code=\"' + listItemsJson.result[i].code + '\" rname=\"'+listItemsJson.result[i].name+ '\"><input type="checkbox">&nbsp;' + listItemsJson.result[i].name + '<span class="start">始</span><span class="end">终</span></li>';
                    } else {
                        listItems += '<li idx=\"' + i + '\" code=\"' + listItemsJson.result[i].code + '\">' + listItemsJson.result[i].name + '</li>';
                    }
                }
                if (ps.isStartEnd) {
                    $(listItems).addClass('listItem').appendTo(listContainer)
                   .bind('click mouseover', ps, listItemEvent_isStartEnd);
                    
                    if (ps.renderTo.attr('code') != '' && ps.renderTo.attr('code') != undefined) {
                        for (var i = 0; i < ps.renderTo.attr('code').split(',').length; i++) {
                            $('.listContainerWhite').find('li').each(function () {
                                var taa = $(this);
                                if (taa.attr('code') == ps.renderTo.attr('code').split(',')[i]) {
                                    taa.find('input').attr("checked", true);
                                    return false;
                                }
                            })
                        }
                    }
                   

                   
                    $('.listItem input').bind('click mouseover', ps, liClick)
                    $('.listItem .start').bind('click', ps, startClick)
                    $('.listItem .end').bind('click', ps, endClick)
                    if (ps.clo == '2') {
                        $('.listContainerWhite').width('440')
                    }
                    $('<div class="sureBtn"><input type="button" id="" class="btn btn-small btn-primary confir" value="确认"/>&nbsp;<input type="button" id="" class="btn btn-small btn-primary clos" value="关闭"/></div>').appendTo(listContainer.parent()).css({ 'top':  $('.listContainerWhite').outerHeight() + 62, 'width': listContainer.outerWidth() - 12 })
                   
                    var $clear = $("<a name=''class='cler' href='javascript:void(0);' style='position:absolute;top:0px;width:13px;height:13px;right: 0px;top:0px;display:inline-block;padding:0px 3px;z-index:9999'><img src='/Common/img/tree_clear.png' /></a>");
                    if (ps.fixed == 'true') {
                        $clear = $("<a name=''class='cler' href='javascript:void(0);' style='position:fixed;top:0px;width:13px;height:13px;right: 0px;top:0px;display:inline-block;padding:8px 3px;z-index:9999'><img src='/Common/img/tree_clear.png' /></a>");
                    }
                    $clear.click(function (e) {
                        $(this).siblings('input').attr({ code: "", value:""})
                    });
                    if (ps.fixed == 'true') {
                        $clear.appendTo(listContainer.parent().parent()).css({ 'top': $('#' + txt_id).offset().top, 'left': $('#' + txt_id).offset().left + $('#' + txt_id).width() - 10 })
                    } else {
                        $clear.appendTo(listContainer.parent().parent()).css({ 'top': ($clear.parent().outerHeight() - $clear.height()) / 2 - 2, 'left': $('#' + txt_id).width() - 10 }).parent().css('position', 'relative')
                    }
                    $('.sureBtn .confir').bind('click', ps, confir_btn)
                    $('.sureBtn .clos').bind('click', ps, clos_btn)
                    
                    if ($('.FindInput').length ==0) {
                        var $finder = $('<div class="FindInput"></div>')
                        $finder.appendTo(listContainer.parent()).css({ 'top':  $('#' + txt_id).outerHeight()+5 , 'width': listContainer.outerWidth() - 12 })
                        var $filter = $("<input name='ztree' type='text' placeholder='输入至少2个关键字' style='width: 65%; height: 25px;background:none; border: 0;padding:0; margin: 0 25px 0 35px; outline: none;' />");
                        var $clear2 = $("<a name='ztree' href='javascript:void(0);' style='position: absolute;margin-top: 7px;right:20px;'><img src='/Common/img/tree_clear.png' /></a>");

                        var $div = $("<div name='ztree' class='ztreeInput' style='width: 99%;height: 25px; position: relative;background-color:white; background-image: url(/Common/img/tree_search.png); background-position: 7px; background-repeat: no-repeat; border: 1px solid #cccccc;border-radius: 15px;z-index:-1;top:-27px'>");
                        $(listContainer).before($div);
                        $finder.prepend($div).prepend($filter).prepend($clear2);
                        $clear2.click(function () { $filter.val("").trigger("input"); });
                        $filter.on("input", function (e) {
                            //$('.listItem').css('visibility', 'hidden');
                            $('.listItem').hide();
                            var a;
                            tempValue = this.value;
                            tempAshx = (url.split('.ashx')[0]).split('/');
                            tempAshx = tempAshx[tempAshx.length - 1];
                            _param = 'S_jHint_{' + tempAshx + temp_L + tempTag + temp_L + ps.type + temp_L + tempValue + temp_L + ps.line + '}';
                            if ('' !== localStorage[_param] && undefined !== localStorage[_param] && localStorage['S_Cache_control_data'] === 'True') {
                                a = eval('(' + localStorage[_param] + ')');
                            } else {
                                $.ajax({
                                    type: 'GET',
                                    url: getUrlNew(ps, this.value),
                                    async: false,
                                    cache: true,
                                    success: function (result) {
                                        localStorage[_param] = result; //保存在本地缓存中
                                        a = eval('(' + result + ')');
                                        console.log(a);
                                    }
                                });
                            }
                            for (var i = 0; i < a.result.length; i++) {
                                $(listContainer).children('li').each(function(){
                                    if ($(this).attr('code') == a.result[i].code) {
                                        //$(this).css('visibility', 'visible')
                                        $(this).show()
                                    }
                                })
                                
                            }
                            //$('.listItem').hide();
                        })
                    }
                } else {
                    $(listItems).addClass('listItem').appendTo(listContainer).bind('click mouseover', ps, listItemEvent);
                }
               
            }
            listContainer.show();
            $('.qzoutBox').show();

            // down key
            //if (e.keyCode == 40) {
            //    var hilightItem = listContainer.find('li.hilight');
            //    if (hilightItem.length == 0) {
            //        listContainer.find('li:first').addClass('hilight');
            //    }
            //    else {
            //        hilightItem.removeClass('hilight');
            //        hilightItem = hilightItem.next();
            //        if (hilightItem.length == 0) {
            //            listContainer.find('li:first').addClass('hilight');
            //        }
            //        else {
            //            hilightItem.addClass('hilight');
            //        }
            //    }
            //    changeScrollPostionAndValue(listContainer.find('li.hilight'), ps);
            //}
            // up key
            //else if (e.keyCode == 38) {
            //    var hilightItem = listContainer.find('li.hilight');
            //    if (hilightItem.length == 0) {
            //        listContainer.find('li:last').addClass('hilight');
            //    }
            //    else {
            //        hilightItem.removeClass('hilight');
            //        hilightItem = hilightItem.prev();
            //        if (hilightItem.length == 0) {
            //            listContainer.find('li:last').addClass('hilight');
            //        }
            //        else {
            //            hilightItem.addClass('hilight');
            //        }
            //    }
            //    changeScrollPostionAndValue(listContainer.find('li.hilight'), ps);
            //}
        }
        else {
            // $(this).next('ul').find('li').removeClass('hilight');
            listContainer.find('li').removeClass('hilight');
            $('.qzoutBox').hide()
            //$(this).next('ul').hide();
        }
    }
    /**
    * callback to response the evnets of the list items
    * @param e parameters of the event
    */
    function listItemEvent(e) {
        if (e.type == 'click') {
            e.data.renderTo.val(this.innerHTML).attr('code', $(this).attr('code'));
            $(this).siblings('.hilight').removeClass('hilight');
            $(this).parent().hide();
            //setKmMarkValue(e);
        }
        else {
            $(this).siblings('.hilight').removeClass('hilight');
            $(this).addClass('hilight');
            if (e.data.autoUpdate) {
                e.data.renderTo.val(this.firstChild.innerText);
            }
            e.data.renderTo.unbind('blur');
        }
    };

    function listItemEvent_isStartEnd(e) {
        if (e.type == 'click') {
            //console.log($(this).children('input').attr("checked"))
            if ($(this).children('input').attr("checked") == 'checked') {
                $(this).children('input').attr("checked", false)
                $(this).removeClass('chooseColor');
            } else {
                $(this).children('input').attr("checked", true)
                $(this).addClass('chooseColor');

            }
            //e.data.renderTo.val(this.innerHTML).attr('code', $(this).attr('code'));
            //$(this).siblings('.chooseColor').removeClass('chooseColor');
            //$(this).parent().hide();
        }
        else {
            $(this).siblings('.colorFor').removeClass('colorFor');
            $(this).addClass('colorFor');
            if (e.data.autoUpdate) {
                e.data.renderTo.val(this.innerHTML);
            }
            e.data.renderTo.unbind('blur');
        }
    };

    function liClick(e) {
        if (e.type == 'click') {
            console.log(e)
            if ($(this).attr("checked") == 'checked' ) {
                $(this).attr("checked", false);
                $(this).parent().removeClass('colorFor');
            } else  {
                $(this).attr("checked", true)
                $(this).parent().addClass('colorFor');
            }
        }
    }

    function startClick(e) {
        $(this).parent().attr('from', 'from')
        $(this).siblings("input").attr("checked", true)
        e.stopPropagation();
    }
    function endClick(e) {
        $(this).parent().attr('from', 'from')
        $(this).siblings("input").attr("checked", true)
        var idxS;//开始点
        var idxE ;//结束点
        var a = 1;
        $('.listItem').each(function () {
            if ($(this).attr("from") == 'from') {
                if (a == 1) {
                    idxE= idxS =parseInt( $(this).attr('idx'))
                    a++;
                } else {
                    idxE = parseInt( $(this).attr('idx'));
                }
            }
        })
        $('.listItem').each(function () {
            if (idxS <= parseInt($(this).attr('idx')) && parseInt($(this).attr('idx')) <= idxE) {
                $(this).children('input').attr("checked", true)
            }
        })
        e.stopPropagation();

    }
    
    function confir_btn(e) {
        var code = '';
        var rname = '';
        var a = 1;
        $('.listItem').each(function () {
            if ($(this).children('input').attr("checked") == 'checked') {
                if (a == 1) {
                    code += $(this).attr('code')
                    rname += $(this).attr('rname')
                } else {
                    code += ',' + $(this).attr('code')
                    rname += ',' + $(this).attr('rname')
                }
                a++;
            }
        })
        e.data.renderTo.attr('code', code);
        e.data.renderTo.val(rname);
        $(this).parent().hide();
        $(this).parent().siblings('ul').hide();
        $('.qzoutBox').hide();
        e.data.callback();
    }

    function clos_btn(e) {
        $(this).parent().hide();
        $(this).parent().siblings('ul').hide();
        $('.qzoutBox').hide();
    }
    
    /**
    * get the url
    * @param type data type
    * @param value parameters used for requesting data
    * @returns {string} requested data, json formatted
    */
    function getUrlNew(ps, value) {
        var url = '';
        switch (ps.type) {
            case 'StationSection':
                url = '/Common/RemoteHandlers/GetSelects.ashx?tag=STATIONSECTION&flag=true&name=' + value + '&code=' + ps.line;
                break;
            case 'loca':
                url = '/Common/RemoteHandlers/GetSelects.ashx?tag=LOCOMOTIVE&flag=true&name=' + value;
                break;
            default:
                break;
        }
        return url;
    }
    /**
    * change the position of the scroll bar and the value of the input box
    * @param obj jQuery object of the li item
    * @param ps configuration of the plugin
    */
    function changeScrollPostionAndValue(obj, ps) {
        var parentNode = obj.parent();
        var idx = eval(obj.attr('idx'));
        var step = obj.outerHeight();
        parentNode.get(0).scrollTop = (idx + 1) * step - parentNode.outerHeight();
        if (ps.autoUpdate) {
            parentNode.siblings('input').val(obj.get(0).innerHTML);
        }
    }
    /***根据选择区站来提醒公里标
    调用时需提供参数 km  值为true
    提供公里标需赋值 ID   kmMarkID
    并给该控件start,end属性赋值
    by lc 2015-11-30
    ***/
    function setKmMarkValue(e) {
        if (e.data.km == true) {
            var url = "/Common/RemoteHandlers/GetSelects.ashx?tag=KM&name=" + e.data.renderTo.val();
            $.ajax({
                type: 'GET',
                url: url,
                async: false,
                cache: true,
                success: function (result) {
                    var json = eval('(' + result + ')');
                    if (json == false) {
                        $("#" + e.data.kmMarkID).text("").attr("start", 0).attr("end", 0);
                        return;
                    }
                    var val = "该区站公里标范围为" + strToKm(json.start_km) + "至" + strToKm(json.end_km);
                    $("#" + e.data.kmMarkID).text(val).attr("start", json.start_km).attr("end", json.end_km);
                }
            });
        }
    }
})(jQuery);