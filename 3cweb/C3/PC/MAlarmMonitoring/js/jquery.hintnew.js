
// 功能说明：自动匹配查询下拉控件。
(function($){
    $.fn.inputSelect = function (p) {
        var defaults = {
            renderTo: $(document.body),
            listContainerCSSName: 'listContainer', //ul class
            listItemCssName: 'listItem',  //li class
            autoUpdate: false,
            enabled: true,
            type: 'org',
            line: '',
            flag: false,
            contant: 0,
            position:0
        };

        var ps = $.extend(defaults, p); //接收传进来的参数

        ps.renderTo = $(this);
        var resultContainer = $(this);

        var txt_id = $(this).attr('id'); //获取绑定控件对象的ID

        //创建ul节点
        $('<ul id="ul_' + txt_id + '"></ul>').addClass(ps.listContainerCSSName).appendTo($(this).parent());

        var listContainer = $('#ul_' + txt_id);  //ul ID

        if (ps.height != '' && ps.height != undefined) {
            listContainer.css('height', ps.height)
        }

        var suggestion = resultContainer;

        resultContainer.bind('keyup click', { ps: ps, suggestion: suggestion }, resultContainerEvent); //绑定事件

        //失去焦点隐藏ul
        resultContainer.bind('blur', ps, function (e) {
            var hilightItem = listContainer.find('li.hilight');
            if (hilightItem.length > 0) {
                hilightItem.removeClass('hilight');
            }
            listContainer.hide();
        });
        listContainer.bind('mouseleave', function () {
            resultContainer.bind('blur', ps, function () {
                var hilightItem = listContainer.find('li.hilight');
                if (hilightItem.length > 0) {
                    hilightItem.removeClass('hilight');
                }
                listContainer.hide();
            });
        });
        //位置
        switch (ps.position) {
            case "MonitorLocGJList":
                listContainer.css({ "marginLeft": "310px" });
                break;
            case "mrta_big_loca":
                listContainer.css({ "right": "45px", "top": "45px", "textAlign": "left", "lineHeight": "18px" });
                break;
            case "MonitorLocoStateListNew":
                listContainer.css({ "marginLeft": "65px", "marginTop": "-8px" });
                break;
            case "Alarm_delay_analysis":
                listContainer.css({ "marginLeft": "79px", "marginTop": "-8px" });
                break;
        };
    };
    function resultContainerEvent(e) {
        // 当input不为空
        if (this.value.length >= 0) {
            var ps = e.data.ps;
            var txt_id = $(this).attr('id');
            var listContainer = $('#ul_' + txt_id); // ul id

            // 退出 按键
            if (e.keyCode == 27) {
                listContainer.hide();
                return;
            };
            // 得到结果
            if (e.keyCode != 38 && e.keyCode != 40) {
                var url = getUrl(ps, this.value);
                var listItemsJson;
                $.ajax({
                    type: 'GET',
                    url: url,
                    async: false,
                    cache: false,
                    success: function (result) {
                        listItemsJson = eval('(' + result + ')');
                    }
                });
                // 清空ul
                if (listContainer.children().length > 0) {
                    listContainer.children().remove();
                }
                // 更新ul内容
                e.data.suggestion.data = listItemsJson.result;

                var len = listItemsJson.result.length; //匹配结果长度
                // 无匹配结果
                if (len < 0) {
                    return;
                }
                var listItems = '';
                // 有匹配结果
                for (var i = 0; i < len; ++i) {
                    if (ps.contant == 1) {
                        listItems += '<li idx=\"' + i + '\">' + listItemsJson.result[i].name + '</span></li>';
                    };
                    if (ps.contant == 2) {
                        listItems += '<li idx=\"' + i + '\"><span id="SelectName">' + listItemsJson.result[i].name.replace(this.value, "<span style='color:red'>" + this.value + "</span >") + '</span><span id="SelectDuan">' + listItemsJson.result[i].duan + '</span></li>';
                    };
                };
                // 把结果添加到ul里面并绑定事件
                $(listItems).addClass('listItem').appendTo(listContainer).bind('click mouseover', ps, listItemEvent);
            };
            listContainer.show();
            // 向下按键
            if (e.keyCode == 40) {
                var hilightItem = listContainer.find('li.hilight');
                if (hilightItem.length == 0) {
                    listContainer.find('li:first').addClass('hilight');
                }
                else {
                    hilightItem.removeClass('hilight');
                    hilightItem = hilightItem.next();
                    if (hilightItem.length == 0) {
                        listContainer.find('li:first').addClass('hilight');
                    }
                    else {
                        hilightItem.addClass('hilight');
                    }
                }
                changeScrollPostionAndValue(listContainer.find('li.hilight'), ps);
            }                
            else if (e.keyCode == 38) {// 向上按键
                var hilightItem = listContainer.find('li.hilight');
                if (hilightItem.length == 0) {
                    listContainer.find('li:last').addClass('hilight');
                }
                else {
                    hilightItem.removeClass('hilight');
                    hilightItem = hilightItem.prev();
                    if (hilightItem.length == 0) {
                        listContainer.find('li:last').addClass('hilight');
                    }
                    else {
                        hilightItem.addClass('hilight');
                    }
                }
                changeScrollPostionAndValue(listContainer.find('li.hilight'), ps);
            }
        }
        else {
            listContainer.find('li').removeClass('hilight');
            listContainer.hide();
        }
    };
    //绑定li的事件
    function listItemEvent(e) {
        if (e.type == 'click') {
            if (e.data.contant == 1) {
                e.data.renderTo.val(this.innerText);
            };
            if (e.data.contant == 2) {
                e.data.renderTo.val(this.firstChild.innerText);
            };
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
    //根据type得到url
    function getUrl(ps, value) {
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
    //滚动条滚动距离
    function changeScrollPostionAndValue(obj, ps) {
        var parentNode = obj.parent();
        var idx = eval(obj.attr('idx'));
        var step = obj.outerHeight();
        parentNode.get(0).scrollTop = (idx + 1) * step - parentNode.outerHeight();
        if (ps.autoUpdate) {
            parentNode.siblings('input').val(obj.get(0).innerHTML);
        }
    };
}) (jQuery);