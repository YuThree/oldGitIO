function loaddatagrid(id, option1, option2, option3, option4, option5) {
    var defaultObj1 = undefined, defaultObj2 = undefined, defaultObj3 = undefined, defaultObj4 = undefined, defaultObj5 = undefined;
    var ddv = undefined, ddv2 = undefined, ddv3 = undefined, ddv4 = undefined;
    var index, index2, index3, index4;
    if (option5) {
        defaultObj5 = {
            view: $.fn.datagrid.defaults.view,
            fit: true,//宽度响应
            striped: true,  //斑马线样式
            autoRowHeight: true,
            fitColumns: true,
            singleSelect: true,//是否单选
            rownumbers: true,//是否显示序号
            onLoadSuccess: function () {//
                setHightF(ddv3)
                setHightF(ddv2)
                setHightF(ddv)
                setHightF($('#' + id))
            }
        }
        $.extend(defaultObj5, option5);

    }
    if (option4) {
        defaultObj4 = {
            view: defaultObj5 ? detailview : $.fn.datagrid.defaults.view,
            autoRowHeight: true,
            fitColumns: true,//是否横向滚动条
            singleSelect: true,//单选
            rownumbers: true,
            detailFormatter: function (index, row2) {//子集容器
                return '<div"><table id="ddv4-' + index + '" style=""></table></div>';
            },
            onExpandRow: function (ind, row2) {//嵌套第三层
                console.log('第四层开')
                index4 = ind;
                ddv4 = $(this).datagrid('getRowDetail', index4).find('#ddv4-' + index4);//获取容器
                if (defaultObj5) {
                    ddv4.datagrid(defaultObj5);
                }
                setTimeout(function() {
                    setHightF(ddv3)
                    setHightF(ddv2)
                    setHightF(ddv)
                    setHightF($('#' + id))
                }, 0);
            },
            onCollapseRow: function (ind, row2) {//
                console.log('第四层关')
                index4 = ind;
                ddv4 = $(this).datagrid('getRowDetail', index4).find('#ddv4-' + index4);
                setTimeout(function() {
                    setHightF(ddv2)
                    setHightF(ddv)
                    setHightF($('#' + id))
                }, 0);
            },
            onResize: function () {//
                setTimeout(function() {
                    setHightF(ddv2)
                    setHightF(ddv)
                    setHightF($('#' + id))
                }, 0);
            },
            onLoadSuccess: function () {//
                setTimeout(function() {
                    setHightF(ddv2)
                    setHightF(ddv)
                    setHightF($('#' + id))
                }, 0);
               
            }
        }
        $.extend(defaultObj4, option4);
    }

    if (option3) {
        defaultObj3 = {
            view: defaultObj4 ? detailview : $.fn.datagrid.defaults.view,
            autoRowHeight: true,
            fitColumns: true,//是否横向滚动条
            singleSelect: true,//单选
            rownumbers: true,
            detailFormatter: function (index, row2) {//子集容器
                return '<div"><table id="ddv3-' + index + '" style=""></table></div>';
            },
            onExpandRow: function (ind, row2) {//嵌套第三层
                console.log('第三层开')
                index3 = ind;
                // $(this).datagrid('getRowDetail', index3).parent().closest('div.datagrid-row-detail').parent().closest('div.datagrid-row-detail').parent().parent().prev().css('background','red')
                // $(this).datagrid('getRowDetail', index3).parent().closest('div.datagrid-row-detail').parent().parent().prev().css('background','blue')
                console.log($(this).datagrid('getRowDetail', index3).parent().closest('div.datagrid-row-detail').parent().parent().prev().attr('datagrid-row-index'))
                ddv = $('#ddv-'+$(this).datagrid('getRowDetail', index3).parent().closest('div.datagrid-row-detail').parent().closest('div.datagrid-row-detail').parent().parent().prev().attr('datagrid-row-index'))//获取最新的第一层
                ddv2=$('#ddv2-'+$(this).datagrid('getRowDetail', index3).parent().closest('div.datagrid-row-detail').parent().parent().prev().attr('datagrid-row-index'))//获取最新的第二层
                ddv3 = $(this).datagrid('getRowDetail', index3).find('#ddv3-' + index3);//获取容器
                if (defaultObj4) {
                    ddv3.datagrid(defaultObj4);
                }
                setTimeout(function() {
                    // setHightF(ddv2)
                    setHightF(ddv)
                    setHightF($('#' + id))
                }, 0);
            },
            onCollapseRow: function (ind, row2) {//
                console.log('第三层关')
                index3 = ind;
                ddv = $('#ddv-'+$(this).datagrid('getRowDetail', index3).parents('div.datagrid-row-detail').parents('div.datagrid-row-detail').parent().parent().prev().attr('datagrid-row-index'))//获取最新的第一层
                ddv2=$('#ddv2-'+$(this).datagrid('getRowDetail', index3).parent().closest('div.datagrid-row-detail').parent().parent().prev().attr('datagrid-row-index'))//获取最新的第二层
                ddv3 = $(this).datagrid('getRowDetail', index3).find('#ddv3-' + index3);
               
                setTimeout(function() {
                    setHightF(ddv2)
                    setHightF(ddv)
                    setHightF($('#' + id))
                }, 0);
            },
            onResize: function () {//
                setTimeout(function() {
                    setHightF(ddv)
                    setHightF($('#' + id))
                }, 0);
            },
            onLoadSuccess: function (ind) {//严重注意喔
                setTimeout(function() {
                    setHightF(ddv)
                    setHightF($('#' + id))
                }, 0);
                
            }
        }
        $.extend(defaultObj3, option3);
    }

    if (option2) {
        defaultObj2 = {
            view: defaultObj3 ? detailview : $.fn.datagrid.defaults.view,
            autoRowHeight: false,
            fitColumns: true,//是否横向滚动条
            singleSelect: true,//单选
            rownumbers: true,
            detailFormatter: function (ind, row2) {//子集容器
                return '<div"><table id="ddv2-' + ind + '" style=""></table></div>';
            },
            onExpandRow: function (ind, row2) {//嵌套第二层
                console.log('第二层开')
                index2 = ind;
                ddv=$('#ddv-'+$(this).datagrid('getRowDetail', index2).parents('div.datagrid-row-detail').parent().parent().prev().attr('datagrid-row-index'))//获取最新的第一层
                ddv2 = $(this).datagrid('getRowDetail', index2).find('#ddv2-' + index2);//获取容器
                if (defaultObj3) {
                    ddv2.datagrid(defaultObj3);
                }
                setTimeout(function() {
                    setHightF(ddv)
                    setHightF($('#' + id))
                }, 0);
            },
            onCollapseRow: function (ind, row2) {//
                console.log('第二层关')
                index2 = ind;
                ddv2 = $(this).datagrid('getRowDetail', index2).find('#ddv2-' + index2);
                setTimeout(function(){
                    setHightF(ddv)
                    setHightF($('#' + id))
                },0)
                
            },
            onResize: function () {
                setTimeout(function() {
                    setHightF($('#' + id))
                }, 0);
            },
            onLoadSuccess: function () {//严重注意喔
                setTimeout(function() {
                    setHightF($('#' + id))
                }, 0);
            }
        }
        $.extend(defaultObj2, option2);
    }

    defaultObj1 = {
        view: defaultObj2 ? detailview : $.fn.datagrid.defaults.view,
        loadMsg: '加载中···',
        fit: true,//宽度响应
        striped: true,  //斑马线样式
        autoRowHeight: true,
        fitColumns: true,
        singleSelect: true,//是否单选
        rownumbers: true,//是否显示序号
        detailFormatter: function (ind, row) {// 详细表 容器
            return '<div style=""><table id="ddv-' + ind + '" ></table></div>';
        },
        onExpandRow: function (ind, row) {//嵌套第一层  展开详细
            index = ind;
            ddv = $(this).datagrid('getRowDetail', index).find('#ddv-' + index);//获取容器
            if (defaultObj2) {
                ddv.datagrid(defaultObj2);
            }
            setHightF($('#' + id))
            // $('#' + id).datagrid('fixDetailRowHeight', index);
        }
    }
    $.extend(defaultObj1, option1);
    $('#' + id).datagrid(defaultObj1)

    //设置高度
    function setHightF($ddv){
        var row =$ddv.datagrid("getRows");
        for (var r = 0; r < row.length; r++)
        {
            $ddv.datagrid("fixDetailRowHeight",r);
            $ddv.datagrid("fixRowHeight",r);
        }
    }
}