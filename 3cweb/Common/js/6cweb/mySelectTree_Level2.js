
(function ($) {
    $.fn.mySelectTree_Level2 = function (_p) {

        var defaults = {
            tag: 'GetSysDictionary_Level2',
            codeType: '3C',
            cateGory: 'AFCODE',
            isSelectChildren: false,
            onClick: false, //节点点击事件
            callback: false,//对象异步加载完成回调函数
            height: '',
            DPCSelectChildren: false//是否为dpc的列表
        };


        var p = $.extend(defaults, _p);


        var contentBox = document.createElement("DIV");
        contentBox.className = "box-content myselectBox";
        contentBox.style.display = "none";
        contentBox.style.position = "absolute";
        contentBox.style.zIndex = "2147483647";

        if (p.height != '') {
            contentBox.style.height = p.height;
            contentBox.style.overflowY = "overlay";
        }

        var txtID = this.attr("id");
        var treeBox = document.createElement("div");
        treeBox.id = "UL" + this.attr("id");
        treeBox.className = "ztree_box";
        treeBox.style.marginTop = "0px";
        treeBox.style.minWidth = (this.width() - 20) + "px";

        contentBox.appendChild(treeBox);
        $('body').append(contentBox);

        var t = this;


        $(this).click(function () {
            if (!$(contentBox).is(":visible")) {
                var cof = $(this).offset();
                $(contentBox).css({ left: cof.left + "px", top: cof.top + $(this).outerHeight() + "px" }).slideDown("fast");
                $('body').bind("mousedown", function (e) {
                    if ($(e.target).parents(".ztree").length == 0) {
                        $(contentBox).fadeOut("fast");
                        $('body').unbind("mousedown");
                    }
                });
            }
        });
        var tClick = p.onClick;

        var urls = "/Common/RemoteHandlers/GetTrees.ashx?tag=" + p.tag + "&codeType=" + p.codeType + "&cateGory=" + p.cateGory;
        var temp_L = ',';
        var tempAshx = '';
        tempAshx = (urls.split('.ashx')[0]).split('/');
        tempAshx = tempAshx[tempAshx.length - 1];
        var _param = 'S_mySelectTree_Level2_{' + tempAshx + temp_L + p.tag + temp_L + p.codeType + temp_L + p.cateGory + '}'; //所有参数
        if ('' !== localStorage[_param] && undefined !== localStorage[_param] && localStorage['S_Cache_control_data'] === 'True') {
            $('#' + treeBox.id).html(localStorage[_param]);
            eventSelectTree();
        } else {
            getData();
        }

        //获取后台数据
        function getData() {
            $.ajax({
                type: "GET",
                url: urls,
                async: false,
                cache: true,
                success: function (result) {
                    $('#' + treeBox.id).html(result);
                    eventSelectTree();
                    localStorage[_param] = result; //保存在本地缓存中
                }
            });
        }

        //树的事件
        function eventSelectTree(){
            $('.type1 a').click(function () {

                var code = $(this).attr("code");
                var name = $(this).text();
                //$('#' + txtID).val(name).attr('code', code);
                $('#' + $(this).parents('.ztree_box').attr('id').replace('UL', '')).val(name).attr({ 'code': code, 'treetype': 'parent' });

                if (p.isSelectChildren) {
                    var codes = "'" + code + "',";

                    $(this).parents(0).next(".type2").find("a").each(function () {
                        codes += "'" + $(this).attr("code") + "',";
                    });

                    //   $(this).parents(0).next(".type2").html()
                    //var cnodes = treeNode.children;
                    //while (cnodes && cnodes.length > 0) {
                    //    var tnodes = [];
                    //    for (var i in cnodes) {
                    //        codes += "'" + cnodes[i].id + "',";
                    //        if (cnodes[i].children) {
                    //            tnodes = tnodes.concat(cnodes[i].children);
                    //        }
                    //    }
                    //    cnodes = tnodes;
                    //}

                    // $(t).attr("code", codes.substring(0, codes.length - 1));
                    $('#' + $(this).parents('.ztree_box').attr('id').replace('UL', '')).val(name).attr('code', codes.substring(0, codes.length - 1));
                }
                if (p.DPCSelectChildren) {

                    var codes = "";

                    $(this).parents(0).next(".type2").find("a").each(function () {
                        codes += "" + $(this).attr("code") + ",";
                    });

                    $('#' + $(this).parents('.ztree_box').attr('id').replace('UL', '')).val(name).attr('code', codes.substring(0, codes.length - 1));

                }
                if (tClick) tClick(code, name, $(this));

                $(contentBox).fadeOut("fast");
                $('body').unbind("mousedown");

            });

            $('.type2 a').click(function () {

                var code = $(this).attr("code");
                var name = $(this).text();

                $('#' + $(this).parents('.ztree_box').attr('id').replace('UL', '')).val(name).attr({ 'code': code, 'treetype': 'child' });

                if (tClick) tClick(code, name, $(this));

                $(contentBox).fadeOut("fast");
                $('body').unbind("mousedown");

            });
            if (p.callback) {
                p.callback();
            }
        }

        return $('#' + treeBox.id);
    };
})(jQuery);