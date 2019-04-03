
(function ($) {
    $.fn.myTree = function (p) {
        p = $.extend({
            //"ORGANIZATION":组织结构
            //"LOCOMOTIVE":组织结构-设备
            //"LOCOMOTIVE_VERSION"：机车型号-机车
            //"USER":组织结构-人员
            //“LINE”：线路
            //“STATIONSECTION”：线路-区站
            //“BRIDGETUNE”：线路-区站-桥隧
            //“SYSDICTIONARYTREE”：字典
            //"SUBSTATION":变电所
            tag: 'LOCOMOTIVE',
            url: '/Common/RemoteHandlers/GetTrees.ashx',
            height: 0, //默认设置树的高度为400  防止产生滚动条时整个树产生滚动条
            width: 0, //默认设置树的宽度为空  行别好看
            isVideo: '',
            locoVersion: '',
            p_code: '',
            codeType: '', //针对字典SYSDICTIONARYTREE的缺陷类型
            cateGory: '', //针对字典SYSDICTIONARYTREE的类型
            chkboxType: { "Y": "ps", "N": "ps" }, //Y 属性定义 checkbox 被勾选后的情况； 
            //N 属性定义 checkbox 取消勾选后的情况； 
            //"p" 表示操作会影响父级节点； 
            //"s" 表示操作会影响子级节点。
            //请注意大小写，不要改变
            enableCheck: false,
            enableFilter: false, //是否启用筛选
            filterNumber: 1,
            isDefClick: true, //是否调用默认点击事件
            onCheck: false,
            onClick: false, //节点点击事件
            callback: false, //对象异步加载完成回调函数
            beforeClick: false,
            IsShowMoreOption_name: '',//是否有多的添加项name
            IsShowMoreOption_code: '',//是否有多的添加项code
            is_only_section: '',//是否只为区间 true只显示区间不显示桥隧
            bureau_code: '',//局编码 线路下的区间范围更小
            org_code: '',//供电段  线路下的区间范围更小
            action: ''//远动库

        }, p);

        var t = this;
        if (p.height) {
            $(this).css('overflow', 'auto').css('max-height', p.height);
        }
        if (p.width) {
            $(this).width(p.width);
        }
        var holder = "";
        if (p.filterNumber == 1) {
            holder = "请输入关键字";
        } else {
            holder = "请输入至少两个关键字";
            if ($(window).width() < 1440) {
                holder = "输入至少2个关键字";
            }
        }
        var $filter = $("<input name='ztree' type='text' placeholder='" + holder + "' style='width: 65%; height: 25px;background:none; border: 0;padding:0; margin: 0 25px 0 35px; outline: none;' />");
        var $clear = $("<a name='ztree' href='javascript:void(0);' style='position: absolute;margin-top: 7px;right:10px;'><img src='/Common/img/tree_clear.png' /></a>");
        if (p.enableFilter) {
            var $div = $("<div name='ztree' class='ztreeInput' style='width: 99%;height: 25px; position: relative;background-color:white; background-image: url(/Common/img/tree_search.png); background-position: 7px; background-repeat: no-repeat; border: 1px solid #cccccc;border-radius: 15px;z-index: 9;'>");
            $(this).before($div);
            $div.prepend($filter).prepend($clear);
            $clear.click(function () { $filter.val("").trigger("input"); });
        }

        var allnode = [];

        //所有参数
        var temp_L = ',';
        var tempAshx = '';
        tempAshx = (p.url.split('.ashx')[0]).split('/');
        tempAshx = tempAshx[tempAshx.length - 1];
        var _param = 'S_myTree_{' + tempAshx + temp_L + p.tag + temp_L + p.isVideo + temp_L + p.locoVersion + temp_L + p.codeType + temp_L + p.cateGory + temp_L + p.IsShowMoreOption_name + temp_L + p.IsShowMoreOption_code + temp_L + p.is_only_section + temp_L + p.bureau_code + temp_L + p.org_code + temp_L + p.p_code + temp_L + p.action + temp_L + p.line_code + temp_L + p.type + '}';

        //筛选条件文本框change事件
        $filter.on("input", function (e) {
            var hideList = [], showList = [];
            //条件为空时显示所有节点
            if (!$filter.val()) {
                //  ztree.showNodes(hideList);

                //   showList = [];
                //   showAllNode(ztree.getNodes(), showList);

                ztree.showNodes(allnode);
                ztree.expandAll(false);//折疊所有

                //if ($filter.attr('isFilter') == "1") {
                //    ztree = $.fn.zTree.init(t, setting, null);
                //    $filter.attr('isFilter', '0');
                //    $filter.select();

                //}


                // ztree.refresh();
                //  showAllNode(ztree.getNodes()) //showAllNode();
            }
            else if ($filter.val().length >= p.filterNumber) {

                $filter.attr('isFilter', '1');

                //过滤数据
                filter(ztree.getNodes(), hideList, showList);
                //隐藏掉需要不匹配的节点
                ztree.hideNodes(hideList);
                //遍历所有子项
                //$.each(showList, function (index, node) {
                //    findChildren(node, showList)
                //});
                ////遍历所有父项
                //$.each(showList, function (index, node) {
                //    findParent(node, showList)
                //});
                //ztree.showNodes(showList);
                ////将匹配项全部展开
                //$.each(showList, function (index, node) {
                //    ztree.expandNode(node, true, true, false);
                //});


                //$.each(showList, function (index, node) {
                //    findChildren(node, showList)
                //  //  findParent(node, showList)
                //    ztree.expandNode(node, true, true, false);
                //});

                ztree.showNodes(showList);
                if (ztree.setting.treeId === 'ULstation_line_address') {
                    ztree.expandAll(true);
                }
                if (ztree.setting.treeId === 'ULposition') {
                    ztree.expandAll(true);
                }
                if (ztree.setting.treeId === 'ULposition-first') {
                    ztree.expandAll(true);
                }
                if (ztree.setting.treeId === 'ULposition-second') {
                    ztree.expandAll(true);
                }

            }
        });

        //显示所有节点并折叠  
        function GetAllNode(_thisNodes) {
            $.each(_thisNodes, function (index, node) {
                allnode.push(node);
                if (node.children) {
                    GetAllNode(node.children);
                    //  showAllNode(node.children);
                }
            });

            //var showList = [];
            //$.each(ztree.getNodes(), function (index, node) {
            //    showList.push(node);
            //});
            //$.each(showList, function (idnex, node) {
            //    findChildren(node, showList);
            //});
            //ztree.showNodes(showList);
            //$.each(showList, function (index, node) {
            //    ztree.expandNode(node, false, true, false);
            //})

        }
        //通过筛选条件过滤  控制节点显示隐藏
        function filter(nodes, hideList, showList) {
            $.each(nodes, function (index, node) {
                if (node.name.indexOf($filter.val()) === -1) {
                    hideList.push(node);
                }
                else {
                    showList.push(node);

                    findParent(node, showList);
                    findChildren(node, showList);
                }
                if (node.children) {
                    filter(node.children, hideList, showList);
                }
            });
        }
        //查询所有父项插入showList中
        function findParent(node, showList) {
            if (node.getParentNode()) {
                showList.push(node.getParentNode());
                ztree.expandNode(node.getParentNode(), true, false, false);
                findParent(node.getParentNode(), showList);
            }
        }
        //查询所有子项插入showList中
        function findChildren(node, showList) {
            if (node.children) {
                $.each(node.children, function (index, node) {
                    showList.push(node);
                    findChildren(node, showList);
                })
            }
        }

        var _async = {};
        if ('' !== localStorage[_param] && undefined !== localStorage[_param] && localStorage['S_Cache_control_data'] === 'True') {

        } else {
            _async = {
                enable: true,
                dataType: "text",
                url: p.url,
                otherParam: ["tag", p.tag, "isVideo", p.isVideo, "locoVersion", p.locoVersion, 'codeType', p.codeType, 'cateGory', p.cateGory, "IsShowMoreOption_name", p.IsShowMoreOption_name, "IsShowMoreOption_code", p.IsShowMoreOption_code, "is_only_section", p.is_only_section, "bureau_code", p.bureau_code, "org_code", p.org_code, 'p_code', p.p_code, 'action', p.action, 'line_code', p.line_code, 'type', p.type
                ]
            };
        }
        //控件初始化
        var setting = {
            data: { simpleData: { enable: true } },
            //异步调用

            async: {
                enable: true,
                dataType: "text",
                url: p.url,
                otherParam: ["tag", p.tag, "isVideo", p.isVideo, "locoVersion", p.locoVersion, 'codeType', p.codeType, 'cateGory', p.cateGory, "IsShowMoreOption_name", p.IsShowMoreOption_name, "IsShowMoreOption_code", p.IsShowMoreOption_code, "is_only_section", p.is_only_section, "bureau_code", p.bureau_code, "org_code", p.org_code, 'p_code', p.p_code, 'action', p.action, 'line_code', p.line_code, 'type', p.type
                ]
            },

            //checkbox选中
            check: {
                enable: p.enableCheck,
                chkStyle: "checkbox",
                chkboxType: p.chkboxType
            },
            //加载完毕回调
            callback: {
                beforeClick: function (treeId, treeNode, clickFlag) {
                    //  GetAllNode(allnode);
                    if (p.beforeClick) {
                        p.beforeClick(treeId, treeNode);
                    }
                    if ($('#TreeAll').length > 0) {
                        $('#TreeAll a').each(function () {
                            if ($(this).hasClass('curSelectedNode')) {
                                $(this).removeClass('curSelectedNode')
                            }
                        });
                    }
                },
                //异步成功
                onAsyncSuccess: function (event, treeId, treeNode, msg) {

                    localStorage[_param] = msg; //保存在本地缓存中

                    GetAllNode(ztree.getNodes());

                    p.onClick = bakClick;
                    var nodes = ztree.getNodes();
                    if (nodes.length > 0) {
                        ztree.expandNode(nodes[nodes.length - 1]);
                    }
                    if (p.callback) {
                        p.callback(event, treeId, treeNode, msg);
                    }

                    var hasSwitch = $('#' + t[0].id, document).find('.has-switch');
                    if (hasSwitch.length > 0) {
                        for (var k = 0; k < hasSwitch.length; k++) {
                            $(hasSwitch[k]).removeClass('.has-switch');
                        }
                    }
                },
                //节点选中事件
                onClick: function (event, treeId, treeNode, clickFlag) {
                    if (p.isDefClick) {
                        default_click(event, treeId, treeNode);
                    }
                    if (p.onClick) {
                        p.onClick(event, treeId, treeNode, clickFlag);
                    }
                },
                //heckbox选中时触发事件
                onCheck: function (event, treeId, treeNode) {
                    if (p.onCheck) {
                        p.onCheck(event, treeId, treeNode);
                    }
                }, onAsyncError: function (event, treeId, treeNode, msg) {

                    //   alert('mytree error2');

                }
            }
        };
        var bakClick = p.onClick;

        //避免异步加载时数据未加载完毕时而点击节点
        var ztree;

        var _setting = {};
        if ('' !== localStorage[_param] && undefined !== localStorage[_param] && localStorage['S_Cache_control_data'] === 'True') {
            _setting.data = setting.data;
            _setting.check = setting.check;
            _setting.callback = setting.callback;

            setTimeout(function () {
                ztree = $.fn.zTree.init(t, _setting, eval('(' + localStorage[_param] + ')'));
                setting.callback.onAsyncSuccess(event, t[0].id, '', localStorage[_param]);
            }, 500);

        } else {
            ztree = $.fn.zTree.init(t, setting, null);
        }
           //ztree = $.fn.zTree.init(t, setting, null);

        //节点默认点击事件
        function default_click(event, treeId, treeNode) {
            if (treeNode) {
                var id = treeNode.id;
                switch (treeNode.treeType) {
                    case 'BUREAU':
                        if ($("#juselect").length > 0)
                            $('#juselect').val(id);

                        if (("#duanselect").length > 0)
                            $('#duanselect').val('0');

                        //  loadOrgSelect(id, 'duan', null, 'ddlduan', null);

                        if ($("#txtloccode").length > 0)
                            $('#txtloccode').val('');

                        if ($('#orgSelect').length > 0) {
                            $('#TreeAll_Org').attr('treeType', treeNode.treeType);
                            $('#orgSelect').attr('code', id).attr('treetype', 'J').attr('value', treeNode.name);
                        }
                        break;
                    case 'ORG':
                        if ($("#juselect").length > 0) {

                            // loadOrgSelect(id.substr(0, 11), 'duan', null, 'ddlduan', null);

                            var strs = id.split('$');
                            var _Jcode = strs[0] + "$" + strs[1];

                            $('#juselect').val(_Jcode);

                            $("#duanselect").mySelect({
                                tag: "Organization",
                                code: _Jcode,
                                async: false
                                //  ,type: "JWD" || "CLD"          
                                ,
                                callback: function (re) {
                                    $('#duanselect').val(id);
                                }
                            });
                        }

                        if ($("#duanselect").length > 0)
                            $('#duanselect').val(id);

                        if ($("#txtloccode").length > 0)
                            $('#txtloccode').val('');

                        if ($('#orgSelect').length > 0) {
                            $('#TreeAll_Org').attr('treeType', treeNode.treeType);
                            $('#orgSelect').attr('code', id).attr('treetype', 'GDD').attr('value', treeNode.name);
                        }
                        break;
                    case 'LOCOMOTIVE':
                        if ($("#juselect").length > 0)
                            $('#juselect').val('0');
                        if ($("#duanselect").length > 0)
                            $('#duanselect').val('0');
                        if ($("#txtloccode").length > 0)
                            $('#txtloccode').val(id);

                        if ($('#locomotive_no').length > 0) {
                            $('#locomotive_no').html(treeNode.name);
                            $('#TreeAll').fadeOut();

                        }

                        break;
                    case 'LINE':
                        if ($('#ddlTxtLine').length > 0)
                            $('#ddlTxtLine').val(id);
                        if ($('#ddlLine').length > 0) {
                            $('#ddlLine').val(id);
                        }

                        if ($('#lineselect').length > 0)
                            $('#lineselect').val(id);

                        if ($("#LineName").length > 0) {
                            $("#LineName").val(treeNode.name);
                        }
                        if ($('#TreeAll').length > 0) {
                            $('#TreeAll').attr('code', id);
                            $('#lineSelect').attr('value', treeNode.name).attr('treetype', 'LINE').attr('code', id);
                            $('#lineSelect').val(treeNode.name);
                            $('#ULlineSelect').parent().find('input[name=ztree]').val(treeNode.name);
                            $('#ULlineSelect').parent().find('input[name=ztree]').trigger($.Event('input'));
                        }
                        //清空区站  
                        if ($('#txtPositionName').length > 0)
                            $('#txtPositionName').val('');

                        if ($('#txtqz').length > 0)
                            $('#txtqz').val('');

                        if ($('#POSITION_NAME').length > 0)
                            $('#POSITION_NAME').val('');

                        if ($('#location').length > 0)
                            $('#location').val(treeNode.name).attr({ "code": treeNode.id, "treetype": treeNode.treeType });
                        break;
                    case 'POSITION':
                        if ($('#POSITION_NAME').length > 0)
                            $('#POSITION_NAME').val(treeNode.name);
                        if ($('#txtPositionName').length > 0)
                            $('#txtPositionName').val(treeNode.name);
                        if ($('#txtqz').length > 0)
                            $('#txtqz').val(treeNode.name);
                        if ($('#location').length > 0)
                            $('#location').val(treeNode.name).attr({ "code": treeNode.id, "treetype": treeNode.treeType });
                        break;
                }
                doQuery();
            }
        }
        return ztree;
    };
})(jQuery);