/*========================================================================================*
* 功能说明：样本选择插件。
* 注意事项：
* 作    者： LL
* 版本日期：2017年10月26日
* 版 本 号： V1.1.0
*=======================================================================================*/

(function ($) {
    $.fn.mySelect_Sample = function (p) {

        var opts = $.extend({
            tag: 'none',
            height: '', //list高度
            width: 550, //默认设置宽度
            enableFilter: false, //是否启用筛选
            filterNumber: 1,  //筛选最小长度
            mark: false, //表达符号
            codeType: "",
            cateGory: "",
            p_code:"",
            callback: false,//对象异步加载完成回调函数
            onClick: false,
            isRepeatUse: false, //是否重复使用标签的值
        }, p);

        var id_name = $(this).attr("id");//插件对象id
        var t = this;

        //默认文字
        //$(this).attr("placeholder", "请输入关键字");

        //创建图标

        var $Clear_out = $("<a name='ztree' href='javascript:void(0);' style='position: absolute;width:13px;height:13px;right: 0;top:0px;display:inline-block;padding:8px 3px;'><img src='/Common/img/tree_clear.png' /></a>")
        $(this).parent().append($Clear_out);

        $Clear_out.click(function (e) {
            t.val("").attr('code', '');
            $list.find('span').each(function () {
                if ($(this).hasClass('checkSpan')) {
                    $(this).removeClass('checkSpan');
                }
            })
        })
        //创建节点
        var $div = $('<div id="droup_' + id_name + '" class="divContainer"><img src="/Common/img/trainclose.png" alt="关闭" /></div>');
        $(this).parent().append($div);


        var div_id = $("#droup_" + id_name);  //div id



        //设置弹出框width
        $div.css({ 'width': opts.width })
        //表达式符号
        if (opts.mark) {
            var $mark = $("<div class='mark'><span>表达式符号：</span><a href='javascript:void(0);' id='And' class='And'>*与</a><a href='javascript:void(0);' id='Or' class='Or'>+或</a><a href='javascript:void(0);' id='Wrong' class='Wrong'>-非</a></div>")
            $div.prepend($mark);
        }
        //搜索框
        var holder = "";
        if (opts.filterNumber == 1) {
            holder = "请输入关键字";
        } else {
            holder = "请输入至少两个关键字";
            if ($(window).width() < 1440) {
                holder = "输入至少2个关键字";
            }
        }
        var $filter = $("<input name='ztree' type='text' placeholder='" + holder + "' style='width: 70%; height: 25px;background:none; border: 0;padding:0; margin: 0 25px 0 35px; outline: none;' />");

        //过滤输入框
        if (opts.enableFilter) {
            var $text = "<span>场景样本值：</span>"
            var $search = $("<div name='ztree' class='ztreeInput' style='width: 40%;height: 25px; position: relative;background-color:white; background-image: url(/Common/img/tree_search.png); background-position: 7px; margin-left: 5px;background-repeat: no-repeat; border: 1px solid #cccccc;border-radius: 15px;z-index: 9;display: inline-block;'>");
            var $Clear = $("<a name='ztree' href='#' style='position: absolute;width:13px;height:13px;right: 10px;top:0px;display:inline-block;padding:8px 3px;'><img src='/Common/img/tree_clear.png' /></a>");
            $div.append($text).append($search);
            $search.prepend($filter).prepend($Clear);
            $Clear.click(function () { $filter.val("").trigger("input"); });

        }

        //list 表
        var $list = $("<div class='SampleContent'></div>")
        $list.css({ 'max-height': opts.height })//设置list高度

        $div.append($list);

        //绑定点击事件
        $(this).on("click", function (e) {
            $div.fadeToggle();
            e.stopPropagation();
        });

        //点击关闭图片
        $(".divContainer>img").click(function (e) {
            $(".divContainer").hide();
            e.stopPropagation();
        });

        //点击其余地方关闭弹出框
        $(document).click(function (e) {
            if (!$(e.target).closest(".divContainer").length && $(e.target).attr('id') != id_name) {
                $div.hide();
                if (p.callback) {
                    p.callback();
                }
            }

        });


        //获取数据
        var resultjson;
        var url = '/Common/RemoteHandlers/GetTrees.ashx?tag=SYSDICTIONARYTREE&codeType=' + opts.codeType + '&cateGory=' + opts.cateGory + '&p_code=' + opts.p_code;
        var temp_L = ',';
        var tempAshx = '';
        tempAshx = (url.split('.ashx')[0]).split('/');
        tempAshx = tempAshx[tempAshx.length - 1];
        var _param = 'S_mySelect_Sample_{' + tempAshx + ',SYSDICTIONARYTREE,' + opts.codeType + temp_L + opts.cateGory + temp_L + opts.p_code + '}';
        if ('' !== localStorage[_param] && undefined !== localStorage[_param] && localStorage['S_Cache_control_data'] === 'True') {
            resultjson = eval('(' + localStorage[_param] + ')');
            addHtml(resultjson);
            if (p.callback) {
                p.callback();
            }
        } else {
            $.ajax({
                type: 'post',
                url: url,
                cache: false,
                async: false,
                success: function (result) {
                    localStorage[_param] = result; //保存在本地缓存中
                    resultjson = eval('(' + result + ')');
                    addHtml(resultjson);
                    if (p.callback) {
                        p.callback();
                    }
                },
                error: function () {
                    alert("连接错误");
                }
            });
        }
        //筛选条件文本框change事件
        $filter.on("input", function (e) {
            var showjson = [];
            //条件为空时显示所有节点
            if (!$filter.val()) {
                $list.find('span').show();
            }
            else if ($filter.val().length >= opts.filterNumber) {
                $list.find('span').each(function () {
                    //console.log($(this).attr('title'))
                    var name = $(this).attr('title')
                    if (name.indexOf($filter.val()) == -1) {
                        $(this).hide()
                    } else {
                        $(this).show()
                    }
                })

                //for (var i = 0; i < resultjson.length; i++) {
                //    if (resultjson[i].name.indexOf($filter.val()) != -1) {
                //        showjson.push({
                //            "id": resultjson[i].id,
                //            "pId": "SCENE_SAMPLE",
                //            "name": resultjson[i].name
                //        })
                //    }
                //};
                //addHtml(showjson);
            }
        });

        function addHtml(json) {

            $list.html('')
            var Html = "";
            //默认加载数据
            for (var i = 0; i < json.length; i++) {
                Html += "<span code='" + json[i].id + "' title='" + json[i].name + "'>" + json[i].name + "</span>";
            };

            $list.html(Html);

            $list.find("span").click(function () {

                var VAULE = '';
                var CODE = '';

                if (p.isRepeatUse) { //可重复使用值
                    CODE = $(this).attr("code");
                    VAULE = $(this).attr("title");
                    if (t.is('input') || t.is('textarea')) {
                        var tempVal = t.val();
                        var tempStr = tempVal.charAt(tempVal.length - 1);
                        if ('' !== tempVal) {
                            if ('*' === tempStr || '+' === tempStr || '-' === tempStr) {
                                t.val($.trim(t.val() + ' ' + VAULE)).attr('title', $.trim(t.val() + ' ' + VAULE));
                                t.attr("code", $.trim(t.attr("code") + ' ' + CODE));
                            } else {
                                layer.msg('请选择表达式符号');
                                return;
                            }
                        } else {
                            t.val($.trim(t.val() + ' ' + VAULE)).attr('title', $.trim(t.val() + ' ' + VAULE));
                            t.attr("code", $.trim(t.attr("code") + ' ' + CODE));
                        }
                    }
                } else { //不可重复使用值

                    if ($(this).hasClass("checkSpan")) { //取消选中，将值、code替换为空并绑定在input中，并传给onclick方法
                        $(this).removeClass("checkSpan");
                        if (t.is('input') || t.is('textarea')) {
                            VAULE = $(this).attr("title");
                            CODE = $(this).attr("code");

                            var pre_val = t.val();
                            var pre_code = t.attr("code");
                            var reg_val = '';
                            var reg_code = '';

                            if (pre_val.indexOf('*') > -1 || pre_val.indexOf('+') > -1 || pre_val.indexOf('-') > -1) {
                                reg_val = new RegExp(VAULE, 'g');
                                reg_code = new RegExp(CODE, 'g');
                                t.val(pre_val.replace(reg_val, ""));
                                t.attr("code", pre_code.replace(reg_code, ""));
                            } else {
                                var tempArr = pre_val.split(',');
                                var index = 0; //待移除的值的位置
                                for (var i = 0; i < tempArr.length ; i++) {
                                    if (VAULE === tempArr[i]) {
                                        index = i;
                                    }
                                }
                                if (index + 1 === tempArr.length) { //移除字符串的最后一个值（最后一个值不含逗号）
                                    if (index !== 0) {
                                        reg_val = new RegExp(',' + VAULE, 'g');
                                        reg_code = new RegExp(',' + CODE, 'g');
                                    } else {
                                        reg_val = new RegExp(VAULE, 'g');
                                        reg_code = new RegExp(CODE, 'g');
                                    }
                                   
                                } else {
                                    reg_val = new RegExp(VAULE + ',', 'g');
                                    reg_code = new RegExp(CODE + ',', 'g');
                                }
                                t.val(pre_val.replace(reg_val, ""));
                                t.attr("code", pre_code.replace(reg_code, ""));
                            }
                        }
                    } else { //选中，将值、code绑定在input中，并传给onclick方法
                        VAULE = $(this).attr("title");
                        CODE = $(this).attr("code");
                        $(this).addClass("checkSpan");
                        if (t.is('input') || t.is('textarea')) {
                            var pre_val = t.val();
                            if (pre_val !== '') {
                                if (pre_val.indexOf('*') > -1 || pre_val.indexOf('+') > -1 || pre_val.indexOf('-') > -1) {
                                    t.val(t.val() + VAULE);
                                    t.attr("code", t.attr("code") + CODE);
                                } else {
                                    t.val(t.val() + ',' + VAULE);
                                    t.attr("code", t.attr("code") + ',' + CODE);
                                }

                            } else {
                                if (pre_val.indexOf('*') > -1 || pre_val.indexOf('+') > -1 || pre_val.indexOf('-') > -1) {
                                    t.val(t.val() + VAULE);
                                    t.attr("code", t.attr("code") + CODE);
                                } else {
                                    t.val(t.val() + VAULE);
                                    t.attr("code", t.attr("code") + CODE);
                                }
                            }
                            
                        }
                    }
                }

                if (p.onClick) {
                    p.onClick(CODE, VAULE, $(this));
                }
            });

        };

        $("#And").click(function () {
            layer.closeAll();
            var tempVal = t.val();
            var tempStr = tempVal.charAt(tempVal.length - 1);
            if ('' !== tempVal) {
                if ('*' === tempStr || '+' === tempStr || '-' === tempStr) {
                    layer.msg('请选择场景样本值');
                } else {
                    t.val($.trim(t.val() + '*'));
                    t.attr("code", $.trim(t.attr("code") + ' *'));
                }
            } else {
                layer.msg('请选择场景样本值');
            }
        });
        $("#Or").click(function () {
            layer.closeAll();
            var tempVal = t.val();
            var tempStr = tempVal.charAt(tempVal.length - 1);
            if ('' !== tempVal) {
                if ('*' === tempStr || '+' === tempStr || '-' === tempStr) {
                    layer.msg('请选择场景样本值');
                } else {
                    t.val($.trim(t.val() + '+'));
                    t.attr("code", $.trim(t.attr("code") + ' +'));
                }
            } else {
                layer.msg('请选择场景样本值');
            }
        });
        $("#Wrong").click(function () {
            layer.closeAll();
            var tempVal = t.val();
            var tempStr = tempVal.charAt(tempVal.length - 1);
            if ('*' === tempStr || '+' === tempStr || '-' === tempStr) {
                layer.msg('请选择场景样本值');
            } else {
                t.val($.trim(t.val() + '-'));
                t.attr("code", $.trim(t.attr("code") + ' -'));
            }
        });
    }
})(jQuery);