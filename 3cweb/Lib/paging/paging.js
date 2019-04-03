$.fn.extend({
    paging: function (p) {

        var htmlStr = '';
        var jsonOne;
        var index = parseInt(p.index);
        var _this = this;
        if (p.size == 'small') {
            htmlStr =
           '<div class="pageWrap">'
                + '<a href="javascript:void(0);" class="page_arrow arrow aFirstPage page_arrow_small">&lt&lt</a>'
                + '<a href="javascript:void(0);" class="page_arrow arrow aPrePage page_arrow_small">&lt</a>'
                + '<a href="javascript:void(0);" class="page_arrow arrow aNextPage page_arrow_small">&gt</a>'
                + '<a href="javascript:void(0);" class="page_arrow arrow aEndPage page_arrow_small">&gt&gt</a>'
                + '<input type="text" class="page_input pageValue page_input_small" value="">'
                + '<a href="javascript:void(0);" class="goTo arrow goTo_small">跳转</a>'
                + '<div class="wrapTwo wrapTwo_small">'
                    + '<span class="page_text">当前</span>'
                    + '<span class="page_num pageIndex fontColor">0/0</span>'
                    + '<span class="page_text">页</span>'
                + '</div>'
                + '<div class="wrapTwo wrapTwo_small">'
                    + '<span class="page_text">显示第</span>'
                    + '<span class="page_num startRow fontColor">0-0</span>'
                    + '<span class="page_text">条</span>'
                    + '<span class="page_text">，</span>'
                    + '<span class="page_text">共</span>'
                    + '<span class="page_num fontColor sumCount">0</span>'
                    + '<span class="page_text">条</span>'
                + '</div>'
            + '</div>';
        } else {
            htmlStr =
           '<div class="pageWrap">'
                + '<a href="javascript:void(0);" class="page_arrow arrow aFirstPage">&lt&lt</a>'
                + '<a href="javascript:void(0);" class="page_arrow arrow aPrePage">&lt</a>'
                + '<a href="javascript:void(0);" class="page_arrow arrow aNextPage">&gt</a>'
                + '<a href="javascript:void(0);" class="page_arrow arrow aEndPage">&gt&gt</a>'
                + '<input type="text" class="page_input pageValue" value="">'
                + '<a href="javascript:void(0);" class="goTo arrow">跳转</a>'
                + '<div class="wrapTwo">'
                    + '<span class="page_text">当前</span>'
                    + '<span class="page_num pageIndex fontColor">0/0</span>'
                    + '<span class="page_text">页</span>'
                + '</div>'
                + '<div class="wrapTwo">'
                    + '<span class="page_text">显示第</span>'
                    + '<span class="page_num startRow fontColor">0-0</span>'
                    + '<span class="page_text">条</span>'
                    + '<span class="page_text">，</span>'
                    + '<span class="page_text">共</span>'
                    + '<span class="page_num fontColor sumCount">0</span>'
                    + '<span class="page_text">条</span>'
                + '</div>'
            + '</div>';
        }


        $(this).html(htmlStr);
        $(this).find('.pageValue').val(index);
        doQuery();

        /**
         * @desc  分页查询
         * @param 
         */
        function doQuery() {
            $.ajax({
                type: 'post',
                url: p.url(),
                async: true,
                dataType: 'json',
                beforeSend: p.beforeSend,
                success: function (json) {
                    if (json == '' || json == null) {
                        //layer.msg('没有数据');
                    } else {
                        p.success(json);
                        jsonOne = json;
                        $(_this).find('.pageIndex').html(jsonOne.pageOfTotal);
                        $(_this).find('.startRow').html(jsonOne.pageRange);
                        $(_this).find('.sumCount').html(jsonOne.total_Rows);
                    }
                },
                error: function (msg) {
                    p.error();
                    //layer.msg('加载失败！');
                }
            });
        };

        //首页样式一致
        //if (($('.home_title').html() == '首页')) {
        //        $('.pageValue').height(26)
        //}
        //if (($('.home_title').html() != '首页')) {
        //}

        $('.arrow').hover(function () {
            $(this).css('color', 'yellow')
        }, function () {
            $(this).css('color', 'white')
        });

        //文本框跳转分页查询
        $(this).find('.goTo').click(function () {
            // alert($('.pageValue').val())
            if (parseInt($(_this).find('.pageValue').val()) < 1 || isNaN(parseInt($(_this).find('.pageValue').val()))) {
                $(_this).find('.pageValue').val(parseInt(jsonOne.pageIndex))
                // alert('要大于等于1');
                layer.msg('输入页码有误！');
                return;
            }
            if (parseInt($(_this).find('.pageValue').val()) > parseInt(jsonOne.totalPages)) {
                $(_this).find('.pageValue').val(jsonOne.pageIndex)
                // alert('error,页码太大了');
                layer.msg('页码超过了总页数！');
                return;
            }
            doQuery();
            //$('.pageIndex').html(jsonOne.pageOfTotal);
            //$('.startRow').html(jsonOne.pageRange);
            //$('.sumCount').html(jsonOne.total_Rows);
        });

        //上一页
        $(this).find('.aPrePage').click(function () {
            // alert(_this)
            //alert(h.pageIndex)
            if (parseInt($(_this).find('.pageValue').val()) > 1) {
                $(_this).find('.pageValue').val(parseInt(jsonOne.pageIndex) - 1);
                doQuery();
                //$('.pageIndex').html(jsonOne.pageOfTotal);
                //$('.startRow').html(jsonOne.pageRange);
                //$('.sumCount').html(jsonOne.total_Rows);
            }
        });

        //下一页
        $(this).find('.aNextPage').click(function () {
            if (parseInt(jsonOne.pageIndex) < parseInt(jsonOne.totalPages)) {
                // alert(jsonOne.pageIndex)
                $(_this).find('.pageValue').val(parseInt(jsonOne.pageIndex) + 1);
                //$('.page_list_alarm').find('.pageWrap').find('input.pageValue').val((jsonOne.pageIndex) + 1);
                doQuery();
                //$('.pageIndex').html(jsonOne.pageOfTotal);
                //$('.startRow').html(jsonOne.pageRange);
                //$('.sumCount').html(jsonOne.total_Rows);

            }
        });

        //跳转首页
        $(this).find('.aFirstPage').click(function () {
            if (jsonOne.pageIndex == 1) {
                return;
            }
            $(_this).find('.pageValue').val(1);
            doQuery();
            //$('.pageIndex').html(jsonOne.pageOfTotal);
            //$('.startRow').html(jsonOne.pageRange);
            //$('.sumCount').html(jsonOne.total_Rows);
        });

        //跳转最后一页
        $(this).find('.aEndPage').click(function () {
            if (jsonOne.pageIndex == jsonOne.totalPages || jsonOne.totalPages == 0) {
                return;
            }
            $(_this).find('.pageValue').val(jsonOne.totalPages);
            doQuery();
            //$('.pageIndex').html(jsonOne.pageOfTotal);
            //$('.startRow').html(jsonOne.pageRange);
            //$('.sumCount').html(jsonOne.total_Rows);
        });

    }
});


//使用方法
//$('自己命名div的class').paging({
//   index:传入pageIndex值数字1、2、3、4、5、6...... ；一般传 1，从第一页开始查询 
//    url: function () {//拼接url方法 
//       1 取得pageindex的值=$('自己命名div的class').find('.pageWrap').find('input.pageValue').val();  
//       2  var url = '/Common/getLastestAlarm.ashx?'
//                    + '&pagesize=6'
//                    + '&pageindex=' + pageindex//传入取得的pageindex
//        return url;
//    },
//    goPage: function (_json) {//获取数据操作页面
//        var data = json.data;
//    }
//});