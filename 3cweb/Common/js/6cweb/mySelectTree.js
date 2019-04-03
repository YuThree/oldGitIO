
(function ($) {
    $.fn.mySelectTree = function (p) {
        p = $.extend({
            //"ORGANIZATION":组织结构
            //"LOCOMOTIVE":组织结构-设备
            //"USER":组织结构-人员
            //“LINE”：线路
            //“STATIONSECTION”：线路-区站
            //“BRIDGETUNE”：线路-区站-桥隧
            //
            tag: 'LOCOMOTIVE',
            isVideo: '',
            locoVersion: '',
            chkboxType: { "Y": "ps", "N": "ps" }, //Y 属性定义 checkbox 被勾选后的情况； 
            //N 属性定义 checkbox 取消勾选后的情况； 
            //"p" 表示操作会影响父级节点； 
            //"s" 表示操作会影响子级节点。
            //请注意大小写，不要改变
            isSelectChildren: false,
            enableCheck: false,
            enableFilter: true, //是否启用筛选  下拉树默认启用
            enableContent: false, //是否禁用编辑  下拉树默认禁用
            isDefClick: false, //是否调用默认点击事件
            onCheck: false,
            onClick: false, //节点点击事件
            callback: false, //对象异步加载完成回调函数
            beforeClick: false, //
            where_place: 'down',//出现位置  默认为下方  可取值up
            _hegiht: '250',//选择框高度 固定  如果上一个取值为up必须固定  默认250px高
            mis_px:'0'//距离清空箭头的距离，正为向上距离   正负皆可取
        }, p);


        var contentBox = document.createElement("DIV");
        contentBox.className = "box-content well myselectBox";
        contentBox.setAttribute("name", "ztree");
        contentBox.style.display = "none";
        contentBox.style.position = "absolute";
        contentBox.style.zIndex = "99999999999";

        var treeBox = document.createElement("UL");
        treeBox.id = "UL" + this.attr("id");
        if (p.height) treeBox.style.overflowY = "scroll";
        treeBox.className = "ztree";
        treeBox.style.marginTop = "0px";
        treeBox.style.minWidth = (this.width() - 20) + "px";

        contentBox.appendChild(treeBox);
        $('body').append(contentBox);

        var t = this;

        var $clear = $("<a name='ztree' href='javascript:void(0);' style='position: absolute;width:13px;height:13px;right: 0px;top:0px;display:inline-block;padding:8px 3px;'><img src='/Common/img/tree_clear.png' /></a>");
        $clear.click(function (e) {
            t.val("");
            $(this).siblings().attr({ code: "", treetype: "" })
        });
        var $div = $("<div style='position: relative;display:inline-table;width:100%;'></div>").width(this.width());
        if (!p.enableContent) {
            this.attr("readonly", "readonly").css("cursor", "pointer");
            this.wrap($div).after($clear);
        }

        $(this).click(function () {
            if (!$(contentBox).is(":visible")) {
                var cof = $(this).offset();
                if (p.where_place == "up") {
                    $(contentBox).css({ left: cof.left + "px", top: cof.top - p._hegiht - p.mis_px + "px", height: p._hegiht + "px", overflow: "auto" }).slideDown("fast");
                } else {
                    $(contentBox).css({ left: cof.left + "px", top: cof.top + $(this).outerHeight() + "px" }).slideDown("fast");
                }
                

                if (p.enableFilter && !p.enableContent)
                    $(contentBox).find("input[name='ztree']").select();

                $('body').bind("mousedown", function (e) {
                    if ($(e.target).parents(".ztree").length === 0 && $(e.target).parents("[name='ztree']").length === 0) {
                        $(contentBox).fadeOut("fast");
                        $('body').unbind("mousedown");
                    }
                });
            }
        });

        var tClick = p.onClick;

        p = $.extend(p, {
            onClick: function (event, treeId, treeNode) {
                if (treeId === 'ULstation_line_address' || treeId === 'ULstation_line_address_device' || treeId === 'ULposition') {  //禁止选择顶层值（在设备检测里程统计中应用）
                    var sNodes = treeNode.getParentNode();
                    if (null === sNodes) {
                        return false;
                    }
                }
                if (tClick) {
                    tClick(event, treeId, treeNode)
                }
                else if (p.isSelectChildren) {
                    var codes = "'" + treeNode.id + "',";
                    var cnodes = treeNode.children;
                    while (cnodes && cnodes.length > 0) {
                        var tnodes = [];
                        for (var i in cnodes) {
                            codes += "'" + cnodes[i].id + "',";
                            if (cnodes[i].children) {
                                tnodes = tnodes.concat(cnodes[i].children);
                            }
                        }
                        cnodes = tnodes;
                    }
                    $(t).val(treeNode.name).attr("code", codes.substring(0, codes.length - 1));
                }
                else {
                    $(t).val(treeNode.name).attr({ "code": treeNode.id, "treetype": treeNode.treeType });
                    if ($('#lineSelect').selector === $(t).selector) {
                        if ($('#TreeAll').length > 0) {
                            $('#TreeAll').attr('code', treeNode.id);
                            linecode = $('#TreeAll').attr('code');
                            $('#TreeAll a').each(function () {
                                if ($(this).hasClass('curSelectedNode')) {
                                    $(this).removeClass('curSelectedNode')
                                }
                            });
                            $('#TreeAll a').each(function () {
                                if ($(this).attr('title') === treeNode.name) {
                                    $(this).addClass('curSelectedNode')
                                }
                            });
                        }
                    }
                }
                $(contentBox).fadeOut("fast");
                $('body').unbind("mousedown");
            }
        });


        var ztree = $(treeBox).myTree(p);
        return ztree;
    };
})(jQuery);