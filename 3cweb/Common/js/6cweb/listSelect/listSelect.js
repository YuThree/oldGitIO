/**
* Created by tm on 2017-08-29.
*/
(function ($) {
    /**
    *  创建用户界面
    */
    $.fn.listSelect = function (settings) {
        // get parameters form the user
        var option = $.extend($.fn.listSelect.defauts, settings);
        // get the element which the plugin will append to
        // option.renderTo = typeof option.renderTo == 'string' ? $(option.renderTo) : option.renderTo;
        option.renderTo = $(this);
        // create the UI element of the plugin

        var resultContainer = $(this);

        var $outBox = $("<div class='pole_OutBox' tabindex=1></div>");
        $outBox.appendTo($(this).parent());
        $('.pole_OutBox').hide();

        $(this).attr('readonly', 'readonly').css('cursor', 'default');
        var txt_id = $(this).attr('id');
        $('<ul id="ul_' + txt_id + '"></ul>').addClass(option.listContainerCSSName).appendTo($outBox);

        var listContainer = $('#ul_' + txt_id);
        var suggestion = resultContainer;

        // bind evnets of the input box
        resultContainer.bind('keyup click', { option: option, suggestion: suggestion }, resultContainerEvent);

        $("body").click(function (e) {
            if (!$(e.target).closest(".pole_OutBox").length && $(e.target).attr('id') != txt_id) {
                $(".pole_OutBox").hide();
            }
        });
        return suggestion;
    };
    /**
    * 获取输入框的字符串代码
    */
    $.fn.getListSelectCode = function () {
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
    *  插件的默认参数
    */
    $.fn.listSelect.defauts = {
        // object which will conatins the plugin
        renderTo: $(document.body),
        // class name of the input box
        resultContainerCSSName: 'result_Container',
        // class name of the list
        listContainerCSSName: 'list_Container',
        // class name of the list item
        listItemCssName: 'list_Item',
        // whether update according the list automatically or not
        autoUpdate: false,
        // whether thd plugin is enabled
        enabled: true,
        // type of the data source of the hinting list
        type: '',
        // line code
        lineCode: '',
        // direction
        direction: '',
        // positionCode
        positionCode: '',
        // startKM
        startKM: '',
        // endKM
        endKM: '',
        //pageIndex: 1,
        //pageSize: 30,
        // indentify whether the list existed, no need to be configed
        flag: false,
        // can choose two section as begin end
        isStartEnd: false
    };
    /**
    * 回调来响应输入框的events
    */
    function resultContainerEvent(e) {
        $('.pole_OutBox').show();
        // dealed when the input box is not empty
        if (this.value.length >= 0) {
            var option = e.data.option;
            // get the ul object
            // var listContainer = $(this).next('ul.' + option.listContainerCSSName);
            var txt_id = $(this).attr('id');
            var listContainer = $('#ul_' + txt_id);

            // escape key
            if (e.keyCode == 27) {
                listContainer.hide();
                $('.pole_SureBtn,.pole_FindInput,.pole_OutBox').hide();
                return;
            }
           
            // get the suggestion list
            if (e.keyCode != 38 && e.keyCode != 40) {
                $('.pole_ClearBtn,.pole_SureBtn,.pole_FindInput').remove();
                var url = getUrl(option, this.value);
                var listItemsJson;
                //var _html_page;
                //var PageCount;
                //var page = 1;
                $.ajax({
                    type: 'post',
                    url: url,
                    async: false,
                    cache: true,
                    success: function (result) {
                        if (undefined !== result && null !== result && '' !== result && 'undefined' !== result) {
                            if (undefined !== result.result && null !== result.result && '' !== result.result && 'undefined' !== result.result) {
                                listItemsJson = result;
                            }
                        }
                    }
                });
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
                    if (option.isStartEnd) {
                        listItems += '<li idx=\"' + i + '\" code=\"' + listItemsJson.result[i].POLE_CODE + '\" rname=\"' + listItemsJson.result[i].POLE_NO + '\"><input type="checkbox">&nbsp;' + listItemsJson.result[i].POLE_NO + '支柱<span class="start">始</span><span class="end">终</span></li>';
                    } else {
                        listItems += '<li idx=\"' + i + '\" code=\"' + listItemsJson.result[i].POLE_CODE + '\">' + listItemsJson.result[i].POLE_NO + '支柱</li>';
                    }
                }
                if (option.isStartEnd) {
                    $(listItems).addClass('list_Item').appendTo(listContainer).bind('click mouseover', option, listItemEvent_isStartEnd);
                    $('.list_Item input').bind('click mouseover', option, liClick);
                    $('.list_Item .start').bind('click', option, startClick);
                    $('.list_Item .end').bind('click', option, endClick);
                    if (option.clo == '2') {
                        $('.list_ContainerWhite').width('440');
                    }
                    $('<div class="pole_SureBtn"><input type="button" id="" class="btn btn-small btn-primary confir" value="确认"/>&nbsp;<input type="button" id="" class="btn btn-small btn-primary clos" value="关闭"/><div id="pageBox" style="display:inline-block;float:right;width:460px;"></div></div>').appendTo(listContainer.parent()).css({ 'top': $('#' + txt_id).offset().top + $('#' + txt_id).outerHeight() + $('.list_ContainerWhite').outerHeight() + 31, 'width': listContainer.outerWidth() - 12 })

                    //var _html_page =
                    //    '<div class="pole-page">'
                    //        + '<a href="#" class="pole-page-top" title="页首" ></a> '
                    //        + '<a href="#" class="pole-page-pre" title="上一页" ></a>'
                    //        + '&nbsp;第&nbsp;<span id="pole-page-numb" class="pole-page-numb">' + listItemsJson.pageIndex + '</span>&nbsp;页,'
                    //        + '&nbsp;共&nbsp;<span id="pole-pageCount" class="pole-pagecolor">' + listItemsJson.totalPages + '</span>&nbsp;页,'
                    //        + '当前页&nbsp;<span id="pole-PageSize" class="pole-pagecolor">' + listItemsJson.Current_pagesize + '</span>&nbsp;条,'
                    //        + '共&nbsp;<span id="pole-Count" class="pole-pagecolor">' + listItemsJson.total_Rows + '</span>&nbsp;条数据'
                    //        + '&nbsp;<a href="#" class="pole-page-nex" title="下一页"></a> '
                    //        + '<a href="#" class="pole-page-last" title="页尾"></a>'
                    //    + '</div>';
                    //$('#pageBox').html(_html_page);
                    //PageCount = listItemsJson.totalPages;
                    //pageCtrl();
                    var $clear = $("<a name=''class='pole_ClearBtn' href='javascript:void(0);' style='position:absolute;top:0px;width:13px;height:13px;right: 0px;top:0px;display:inline-block;padding:0px 3px;z-index:9999'><img src='/Common/img/tree_clear.png' /></a>");
                    if (option.fixed == 'true') {
                        $clear = $("<a name=''class='pole_ClearBtn' href='javascript:void(0);' style='position:fixed;top:0px;width:13px;height:13px;right: 0px;top:0px;display:inline-block;padding:8px 3px;z-index:9999'><img src='/Common/img/tree_clear.png' /></a>");
                    }
                    $clear.click(function (e) {
                        $(this).siblings('input').attr({ code: "", value: "" })
                    });
                    if (option.fixed == 'true') {
                        $clear.appendTo(listContainer.parent().parent()).css({ 'top': $('#' + txt_id).offset().top, 'left': $('#' + txt_id).offset().left + $('#' + txt_id).width() - 10 })
                    } else {
                        $clear.appendTo(listContainer.parent().parent()).css({ 'top': ($clear.parent().outerHeight() - $clear.height()) / 2 - 2, 'left': $('#' + txt_id).width() - 10 }).parent().css('position', 'relative')
                    }
                    $('.pole_SureBtn .confir').bind('click', option, confir_btn);
                    $('.pole_SureBtn .clos').bind('click', option, clos_btn);

                    if ($('.pole_FindInput').length == 0) {
                        var $finder = $('<div class="pole_FindInput"></div>');
                        $finder.appendTo(listContainer.parent()).css({ 'top': $('#' + txt_id).offset().top + $('#' + txt_id).outerHeight() + 5, 'width': listContainer.outerWidth() - 12 });
                        var $filter = $("<input name='ztree' type='text' placeholder='输入至少2个关键字' style='width: 65%; height: 25px;background:none; border: 0;padding:0; margin: 0 25px 0 35px; outline: none;' />");
                        var $clear2 = $("<a name='ztree' href='javascript:void(0);' style='position: absolute;margin-top: 7px;right:20px;'><img src='/Common/img/tree_clear.png' /></a>");

                        var $div = $("<div name='ztree' class='ztreeInput' style='width: 99%;height: 25px; position: relative;background-color:white; background-image: url(/Common/img/tree_search.png); background-position: 7px; background-repeat: no-repeat; border: 1px solid #cccccc;border-radius: 15px;z-index:-1;top:-27px'>");
                        $(listContainer).before($div);
                        $finder.prepend($div).prepend($filter).prepend($clear2);
                        $clear2.click(function () { $filter.val("").trigger("input"); });
                        $filter.on("input", function (e) {
                            $('.list_Item').hide();
                            var a;
                            $.ajax({
                                type: 'get',
                                url: getUrlNew(option, this.value),
                                async: false,
                                cache: true,
                                success: function (result) {
                                    a = result;
                                    console.log(a);
                                }
                            });
                            listContainer.html('');
                            listItems = '';
                            for (var j = 0; j < a.result.length; j++) {
                                if (option.isStartEnd) {
                                    listItems += '<li idx=\"' + j + '\" code=\"' + a.result[j].POLE_CODE + '\" rname=\"' + a.result[j].POLE_NO + '\"><input type="checkbox">&nbsp;' + a.result[j].POLE_NO + '支柱<span class="start">始</span><span class="end">终</span></li>';
                                } else {
                                    listItems += '<li idx=\"' + j + '\" code=\"' + a.result[j].POLE_CODE + '\">' + a.result[j].POLE_NO + '支柱</li>';
                                }
                            }
                            $(listItems).addClass('list_Item').appendTo(listContainer).bind('click mouseover', option, listItemEvent_isStartEnd);
                            $('.list_Item input').bind('click mouseover', option, liClick);
                            $('.list_Item .start').bind('click', option, startClick);
                            $('.list_Item .end').bind('click', option, endClick);
                            if (option.clo == '2') {
                                $('.list_ContainerWhite').width('440');
                            }
                            listContainer.find('li').removeClass('hilight');
                        });
                    }
                } else {
                    $(listItems).addClass('list_Item').appendTo(listContainer).bind('click mouseover', option, listItemEvent);
                }
            }
            listContainer.show();
            $('.pole_OutBox').show();
        } else {
            listContainer.find('li').removeClass('hilight');
            $('.pole_OutBox').hide();
        }
    }

    ////支柱分页控制
    //function pageCtrl() {
    //    //分页首页
    //    $('.pole-page-top').click(function () {
    //        pageIndex = 1;
    //        queryPoleList(pageIndex); ///执行查询 (当前JS)
    //    });
    //    //分页上一页
    //    $('.pole-page-pre').click(function () {
    //        if (pageIndex > 1) {
    //            pageIndex = pageIndex - 1;
    //            queryPoleList(pageIndex); ///执行查询 (当前JS)
    //        }
    //    });
    //    //分页下一页
    //    $('.pole-page-nex').click(function () {
    //        if (pageIndex < PageCount) {
    //            pageIndex = pageIndex + 1;
    //            queryPoleList(pageIndex); ///执行查询 (当前JS)
    //        }
    //    });
    //    //分页尾页
    //    $('.pole-page-last').click(function () {
    //        pageIndex = PageCount;
    //        queryPoleList(pageIndex); ///执行查询 (当前JS)
    //    });
    //};

    /**
    * callback to response the evnets of the list items
    * @param e parameters of the event
    */
    function listItemEvent(e) {
        if (e.type == 'click') {
            e.data.renderTo.val(this.innerHTML).attr('code', $(this).attr('code'));
            $(this).siblings('.hilight').removeClass('hilight');
            $(this).parent().hide();
            setKmMarkValue(e);
        } else {
            $(this).siblings('.hilight').removeClass('hilight');
            $(this).addClass('hilight');
            if (e.data.autoUpdate) {
                e.data.renderTo.val(this.innerHTML);
            }
            e.data.renderTo.unbind('blur');
        }
    };

    function listItemEvent_isStartEnd(e) {
        if (e.type == 'click') {
            if ($(this).children('input').attr("checked") == 'checked') {
                $(this).children('input').attr("checked", false);
                $(this).removeClass('chooseColor');
            } else {
                $(this).children('input').attr("checked", true);
                $(this).addClass('chooseColor');

            }
        } else {
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
            if ($(this).attr("checked") == 'checked') {
                $(this).attr("checked", false);
                $(this).parent().removeClass('colorFor');
            } else {
                $(this).attr("checked", true);
                $(this).parent().addClass('colorFor');
            }
        }
    };

    function startClick(e) {
        $(this).parent().attr('from', 'from');
        $(this).siblings("input").attr("checked", true);
        e.stopPropagation();
    };

    function endClick(e) {
        $(this).parent().attr('from', 'from');
        $(this).siblings("input").attr("checked", true);
        var idxS;//开始点
        var idxE;//结束点
        var a = 1;
        $('.list_Item').each(function () {
            if ($(this).attr("from") == 'from') {
                if (a == 1) {
                    idxE = idxS = parseInt($(this).attr('idx'));
                    a++;
                } else {
                    idxE = parseInt($(this).attr('idx'));
                }
            }
        });
        $('.list_Item').each(function () {
            if (idxS <= parseInt($(this).attr('idx')) && parseInt($(this).attr('idx')) <= idxE) {
                $(this).children('input').attr("checked", true);
            }
        });
        e.stopPropagation();
    };

    function confir_btn(e) {
        var code = '';
        var rname = '';
        var a = 1;
        $('.list_Item').each(function () {
            if ($(this).children('input').attr("checked") == 'checked') {
                if (a == 1) {
                    code += $(this).attr('code');
                    rname += $(this).attr('rname');
                } else {
                    code += ',' + $(this).attr('code');
                    rname += ',' + $(this).attr('rname');
                }
                a++;
            }
        });
        e.data.renderTo.attr('code', code);
        e.data.renderTo.val(rname);
        $(this).parent().hide();
        $(this).parent().siblings('ul').hide();
        $('.pole_OutBox').hide();

    }

    function clos_btn(e) {
        $(this).parent().hide();
        $(this).parent().siblings('ul').hide();
        $('.pole_OutBox').hide();
    }

    /**
    * get the url
    * @param type data type
    * @param value parameters used for requesting data
    * @returns {string} requested data, json formatted
    */
    function getUrl(option, value) {
        var url = '';
        switch (option.type) {
            case 'GetPoleList':
                url = '/Common/monepoledata/remotehandlers/mydevicelist.ashx?action=GetPoleList'
                        + '&pole_no=' + value
                        + '&lineCode=' + option.lineCode
                        + '&direction=' + option.direction
                        + '&positionCode=' + option.positionCode
                        + '&startKM=' + option.startKM
                        + '&endKM=' + option.endKM
                        + '&pageIndex=1'
                        + '&pageSize=800';
                break;
            default:
                break;
        }
        return url;
    }
    function getUrlNew(option, value) {
        var url = '';
        switch (option.type) {
            case 'GetPoleList':
                url = '/Common/monepoledata/remotehandlers/mydevicelist.ashx?action=GetPoleList'
                        + '&pole_no=' + value
                        + '&lineCode=' + option.lineCode
                        + '&direction=' + option.direction
                        + '&positionCode=' + option.positionCode
                        + '&startKM=' + option.startKM
                        + '&endKM=' + option.endKM
                        + '&pageIndex=1'
                        + '&pageSize=800';
                break;
            default:
                break;
        }
        return url;
    }
    /**
    * change the position of the scroll bar and the value of the input box
    * @param obj jQuery object of the li item
    * @param option configuration of the plugin
    */
    function changeScrollPostionAndValue(obj, option) {
        var parentNode = obj.parent();
        var idx = eval(obj.attr('idx'));
        var step = obj.outerHeight();
        parentNode.get(0).scrollTop = (idx + 1) * step - parentNode.outerHeight();
        if (option.autoUpdate) {
            parentNode.siblings('input').val(obj.get(0).innerHTML);
        }
    }
   
})(jQuery);