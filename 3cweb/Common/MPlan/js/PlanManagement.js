/*========================================================================================*
 * 检测计划管理js
/*========================================================================================*/
var page_index = 1;


$(() => {
    //绑定行别
    $("#direction").mySelectTree({
        tag: 'SYSDICTIONARYTREE',
        codeType: '3C',
        cateGory: 'DRTFLG',
        enableFilter: false,
        onClick: function (event, treeId, treeNode) {
            $("#direction").attr('code', treeNode.id).val(treeNode.name);
        }
    });
    //绑定线路
    $('#lineselect').mySelect({
        tag: 'LINE'
    });

    doQuery();
});

//查询
function doQuery() {
    loadFlexiGrid();
};

//绑定表格
function loadFlexiGrid() {
    var startdate = document.getElementById('startdate').value; //开始时间
    if (startdate != "") {
        startdate = startdate + ' 00:00:00';
    }
    var enddate = document.getElementById('enddate').value; //结束时间
    if (enddate != "") {
        enddate = enddate + ' 23:59:59';
    }
    if (!checktime(startdate, enddate, '#startdate', '#enddate')) {
        return;
    }
    var department = document.getElementById('department').value; //添乘部门
    var lineselect = document.getElementById('lineselect').value; //线路
    if (lineselect == "0") {
        lineselect = "";
    }
    var direction = document.getElementById('direction').value; //行别
    
    var _h = $(window).height() - 120 - 15;
    var _PageNum = parseInt(($(window).height() - 260) / 25);

    var _url = 'RemoteHandlers/PlanManageForm.ashx?type=QUERY&start_date=' + startdate + '&end_date=' + enddate + '&passen_dept=' + department + '&line_code=' + lineselect + '&direction=' + direction + "&page_number=" + _PageNum + '&page_index=' + page_index;

    $('#main_content').datagrid({
        url: _url,
        pageNumber: 1,
        height: _h,
        pageSize: _PageNum,
        onLoadSuccess: function () {
            data = $('#main_content').datagrid('getRows');
        },
        view: detailview,
        detailFormatter: function (index, row) {
            var number = row.task.length * 25 + 30 + "px";

            return '<div class="ddv" style="width:100%;height:' + number + '" ><table id="main_content' + index + '" style="width:100%;height:' + number + '" url="" toolbar="#toolbar" pagination="false" fitcolumns="true" singleselect="true"> <thead> <tr> <th field="LINE_NAME" align="center" width="47" align="center">线路</th> <th field="DIRECTION" width="35" align="center">行别</th> <th field="START_POSITION_NAME"  width="47" align="center">开始站点</th> <th field="END_POSITION_NAME"  width="47" align="center">结束站点</th><th field="START_TASK_DATE"  width="35" align="center">开始日期</th> <th field="END_TASK_DATE" width="25" align="center">结束日期</th> </tr> </thead> </table></div>';

        },
        onExpandRow: function (index, row) {
            $('#main_content' + index).datagrid({
                data: row.task
            });
        }
    });

    var p = $('#main_content').datagrid('getPager');
    $(p).pagination({
        pageSize: _PageNum, //每页显示的记录条数，默认为5  
        pageList: [_PageNum], //可以设置每页记录条数的列表  
        beforePageText: '第', //页数文本框前显示的汉字  
        afterPageText: '页    共 {pages} 页',
        displayMsg: '当前显示 {from} - {to} 条记录   共 {total} 条记录'

    });
};

//时间检验
function checktime(time1, time2, el1, el2) {

    if ('' !== time1 && '' !== time2) {
        if (time1 > time2) {
            tip('开始时间须小于结束时间', el1, 3000, 'top');
            $('.layui-layer-tips .layui-layer-content').css({ 'min-width': '12px' });
            return false;
        }
    }
    return true;
};

//编辑
function editPlan(ID) {
    var URL = '/Common/MPlan/mplan_add.html?plan_id=' + ID;
    $("#modal-container-22256").modal({ backdrop: 'static', keyboard: false }).css({
        width: '1146',
        height: '418',
        'margin-left': function () {
            return -($(this).width() / 2);
        },
        'margin-top': function () {
            return -($(this).height() / 2);
        }
    });
    $("#iframe_add").attr("src", URL);
};
//删除
function deletePlan(ID) {

    ymPrompt.confirmInfo({
        message: '确认要删除信息吗?',
        handler: function (tp) {
            if (tp == 'ok') {
                var Url = 'RemoteHandlers/PlanManageForm.ashx?type=DELETE&plan_id=' + ID;

                $.ajax({
                    type: 'post',
                    url: Url,
                    async: true,
                    cache: false,
                    success: function (result) {
                        if (result == "删除成功！") {
                            layer.msg(result);
                            doQuery();
                        } else {
                            layer.msg(result);
                        }
                    }
                })
            }
            if (tp == 'cancel') {
            }
            if (tp == 'close') {
            }
        }
    });
};
//添加
function AddPlan() {
    var URL = '/Common/MPlan/mplan_add.html';
    $("#modal-container-22256").modal({ backdrop: 'static', keyboard: false }).css({
        width: '1146',
        height: '418',
        'margin-left': function () {
            return -($(this).width() / 2);
        },
        'margin-top': function () {
            return -($(this).height() / 2);
        }
    });
    $("#iframe_add").attr("src", URL);
};

//关闭模态框
function cloasemode() {
    $("#close").click();
};