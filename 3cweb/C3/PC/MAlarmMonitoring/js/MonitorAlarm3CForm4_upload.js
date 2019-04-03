/*/*
  * @desc 初始化上传控件
  * @param 
  */
function initUpload(fileListId, filePickerId, uploadBtnId, imageClassification) {
    var $ = jQuery,
    $list = $(fileListId),
    // 优化retina, 在retina下这个值是2
    ratio = window.devicePixelRatio,
    // 缩略图大小
    thumbnailWidth = ratio,
    thumbnailHeight = ratio,

    // 添加的文件数量
    fileCount = 0,
    // Web Uploader实例
    uploader;
    uploader = WebUploader.create({

        formData: {
            uid: 123,
            action: 'UpLoad',
            alarmid: GetQueryString('alarmid'),
            feather: imageClassification
        },

        // 选完文件后，是否自动上传。
        auto: false,

        disableGlobalDnd: true,

        crop: false,  // 是否同意裁剪
        compress: false, //不压缩，上传图片是“原样”

        // swf文件路径
        swf: '/Common/js/webuploader-0.1.5/Uploader.swf',

        // 文件接收服务端。
        server: 'PictureUpload.aspx',

        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: filePickerId,

        //只允许选择图片
        accept: {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png,GIF,JPG,JPEG,BMP,PNG',
            mimeTypes: 'image/gif,image/jpg,image/jpeg,image/bmp,image/png,image/GIF,image/JPG,image/JPEG,image/BMP,image/PNG'   //如果定义*的话,会检索所有格式
        }
    });

    // 当有文件添加进来的时候
    uploader.on('fileQueued', function (file) {
        if (Number($list.parent().find('input.file-count').attr('value')) > 0) {
            fileCount = Number($list.parent().find('input.file-count').attr('value'));
        }
        fileCount++;

        var $li = $(
                '<div id="' + file.id + '" class="cp_img">' +
                    '<img>' +
                    '<div class="cp_img_jian"></div>' +
                '</div>'
                ),
            $img = $li.find('img');

        // $list为容器jQuery实例
        $list.append($li);
        $list.parent().find('.file-info').html('共' + fileCount + '张图片');
        $list.parent().find('input.file-count').attr('value', fileCount);
        // 创建缩略图
        // 如果为非图片文件，可以不用调用此方法。
        // thumbnailWidth x thumbnailHeight 为 100 x 100
        uploader.makeThumb(file, function (error, src) {
            if (error) {
                $img.replaceWith('<span>不能预览</span>');
                return;
            }

            $img.attr('src', src);
        }, thumbnailWidth, thumbnailHeight);
    });

    // 文件上传过程中创建进度条实时显示。
    uploader.on('uploadProgress', function (file, percentage) {
        //var $li = $('#' + file.id),
        //    $percent = $li.find('.progress span');

        //// 避免重复创建
        //if (!$percent.length) {
        //    $percent = $('<p class="progress"><span></span></p>')
        //            .appendTo($li)
        //            .find('span');
        //}


        //var $div = $('#' + file.id),
        //    $percent = $div.parent().parent().find('span.process');

        //$percent.css('width', percentage * 100 + '%');

        //var fileListMap = $('#fileList-map'),
        //    $percentMap = fileListMap.parent().find('span.process');
        //if ('' !== fileListMap.html()) {
        //    $percentMap.css('width', percentage * 100 + '%');
        //}

        //var fileListVi = $('#fileList-vi'),
        //    $percentVi = fileListVi.parent().find('span.process');
        //if ('' !== fileListVi.html()) {
        //    $percentVi.css('width', percentage * 100 + '%');
        //}
        //var fileListOa = $('#fileList-oa');
        //$percentOa = fileListOa.parent().find('span.process');
        //if ('' !== fileListOa.html()) {
        //    $percentOa.css('width', percentage * 100 + '%');
        //}
    });

    // 文件上传成功，给item添加成功class, 用样式标记上传成功。
    uploader.on('uploadSuccess', function (file, response) {
        $('#' + file.id).append($('<span class="success"></span>'));
        uploader.removeFile(uploader.getFile(file.id, true));
    });

    // 文件上传失败，显示上传出错。
    uploader.on('uploadError', function (file) {
        var $li = $('#' + file.id),
            $error = $li.find('div.error');

        // 避免重复创建
        if (!$error.length) {
            $error = $('<div class="error"></div>').appendTo($li);
        }

        $error.text('上传失败');
    });

    // 完成上传完了，成功或者失败，先删除进度条。
    uploader.on('uploadComplete', function (file) {
        $('#' + file.id).find('.progress').remove();
        scroll_bar_height = $(document).find('.layui-layer-content').scrollTop();
    });

    //所有文件上传完毕
    uploader.on('uploadFinished', function () {
        //提交表单
        $('#fileList-map').html('');
        $('#fileList-vi').html('');
        $('#fileList-oa').html('');
        getImages();
    });

    //开始上传
    $(uploadBtnId).click(function () {
        uploader.upload();
    });

    //显示删除按钮
    $(fileListId + ' .cp_img').live('mouseover', function () {
        $(this).children('.cp_img_jian').css('display', 'block');
    });

    //隐藏删除按钮
    $(fileListId + ' .cp_img').live('mouseout', function () {
        $(this).children('.cp_img_jian').css('display', 'none');
    });

    //执行删除方法
    $list.on('click', fileListId + ' .cp_img_jian', function () {
        if (Number($list.parent().find('input.file-count').attr('value')) > 0) {
            fileCount = Number($list.parent().find('input.file-count').attr('value'));
        }
        var Id = $(this).parent().attr('id');
        if ('WU' === Id.split('_')[0]) {
            uploader.removeFile(uploader.getFile(Id, true)); //从文件队列中删除文件
            $list.find('div[id=' + Id + ']').remove();
            fileCount--;
            $list.parent().find('.file-info').html('共' + fileCount + '张图片');
            $list.parent().find('input.file-count').attr('value', fileCount);
            layer.msg('删除成功');
        } else {
            var src = $($(this).parent().find('img')).attr('src');
            var url = '/C3/PC/MAlarmMonitoring/PictureUpload.aspx?action=delete'
                        + '&alarmid=' + GetQueryString('alarmid')
                        + '&feather=' + imageClassification
                        + '&file=' + src;
            $.ajax({
                type: 'post',
                url: url,
                async: true,
                cache: false,
                success: function (json) {
                    if ('' !== json) {
                        if ('' !== json.sign) {
                            if ('True' === json.sign) {
                                $list.find('div[id=' + Id + ']').remove();
                                fileCount--;
                                $list.parent().find('.file-info').html('共' + fileCount + '张图片');
                                $list.parent().find('input.file-count').attr('value', fileCount);
                                layer.msg(json.state);
                            } else {
                                return;
                            }
                        }
                    }
                },
                error: function (e) {
                    layer.msg('删除出错');
                }
            });
        }
    });
}
