(function ($) { //控件要与webuploader结合使用，引入该js前先引入webuploader
    $.fn.myUploadImg = function (options) {
        var defaults = {
            alarmid: '', //报警id
            subTitle: '', //图片区域的标题 
            fileListId: '', //图片区域id
            filePickerId: '', //选择文件的按钮id
            ctlBtnUploadId: '', //图片区域上传图片按钮id
            imageClassification: '', //图片类型
            jUpload: '' //页面中的上传图片按钮，只在最后一次初始化中传入（只能传入一次）
        };
        var objID = '#' + $(this).attr('id');
        var p = $.extend(defaults, options);

        var index_upload_pic = ''; // 弹出上传图片提示框的所属 编号
        var scroll_bar_height = 0; //滚动条位置

        //初始化上传图片html
        addUpload(p.alarmid, p.subTitle, p.fileListId, p.filePickerId, p.ctlBtnUploadId, p.imageClassification);

        var jUpload = p.jUpload; //页面中的上传图片按钮

        //上传图片 弹出框
        $(jUpload).click(function () {
            // 将已上传的图片展示出来
            getImages(p.alarmid);
            var clientHeight = document.body.clientHeight; //网页可见区域高
            if (clientHeight < 750 && clientHeight > 0) {
                index_upload_pic = showDialog($(objID), '650px', '609px', 'TRUE');
            } else {
                index_upload_pic = showDialog($(objID), '650px', '700px', 'TRUE');
            }
        });

        //开始上传图片
        $(objID).find('#ctlBtn').click(function () {
            $(objID).find('span[name="startUpload"]').trigger('click');
        });

        //关闭弹出框
        $(objID).find('#close-upload').click(function () {
            layer.close(index_upload_pic);
        });

        /*/*
         * @desc 初始化上传图片html
         * @param 
         */
        function addUpload(alarmid, subTitle, fileListId, filePickerId, ctlBtnUploadId, imageClassification) {

            //上传图片html
            var $box = '';
            var _title = '';
            var _btn_upload = '';
            if ($(objID, document).find('#box-upload').length > 0) {
                $box = $(objID, document).find('#box-upload');
            } else {
                $box = $('<div id="box-upload" class="box-upload-pic"></div>');
                _title = '<div class="upload-pic-main-title"><span class="upload-ico"></span><span class="title">上传图片</span></div>';
                _btn_upload = '<div id="btn-b" class="btn-box">'
                                + '<span id="ctlBtn" class="btn-upload">开始上传</span>'
                                + '<span id="close-upload" class="btn-upload-cancel">关闭</span>'
                            + '</div>';
            }

            var _wrapper = '';
            if ('' !== subTitle && null !== subTitle && undefined !== subTitle && 'undefined' !== subTitle &&
                '' !== fileListId && null !== fileListId && undefined !== fileListId && 'undefined' !== fileListId &&
                '' !== filePickerId && null !== filePickerId && undefined !== filePickerId && 'undefined' !== filePickerId) {
                _wrapper = '<div class="wrapper">'
                                    + '<div class="upload-title">'
                                    + '    <span>' + subTitle + '</span>'
                                    + '    <span id="' + ctlBtnUploadId.split('#')[1] + '" name="startUpload" class="btn-upload hide" >开始上传</span>' 
                                    + '</div>'
                                    + '<div class="picker-box">'
                                    + '    <div id="' + fileListId.split('#')[1] + '" imageClassification="' + imageClassification + '"></div>'
                                    + '    <div class="cp_img_jia" id="' + filePickerId.split('#')[1] + '"></div>'
                                    + '    <div class="file-info">共0张图片</div>'
                                    + '    <input type="hidden" class="file-count" value="0" />'
                                    + '</div>'
                                + '</div>';
            }
            if ('' !== _title) {
                $($box).append(_title);
            }
            if ('' !== _wrapper) {
                if ($(document).find('#btn-b').length > 0) {
                    $($(document).find('#btn-b')).before(_wrapper);
                } else {
                    $($box).append(_wrapper);
                }
            }
            if ('' !== _btn_upload) {
                $($box).append(_btn_upload);
            }
            $(objID, document).append($box);

            //预览图片html
            var _view_pic = '';
            if ($(document).find('#preview-pic').length === 0) {
                _view_pic = '<!-- start 预览图片 -->'
                            + '<div id="preview-pic" class="hide">'
                            + '    <img src="" />'
                            + '</div>'
                          + '<!-- end 预览图片 -->';
            }
            if ('' !== _view_pic) {
                $('body', document).append(_view_pic);
            }

            initUpload(alarmid, fileListId, filePickerId, ctlBtnUploadId, imageClassification);
        }

        /*/*
         * @desc 初始化上传控件
         * @param 
         */
        function initUpload(alarmid, fileListId, filePickerId, uploadBtnId, imageClassification) {
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
                    alarmid: alarmid,
                    feather: imageClassification
                },

                // 选完文件后，是否自动上传。
                auto: false,

                disableGlobalDnd: true,

                crop: false,  // 是否同意裁剪
                compress: false, //不压缩，上传图片是“原样”

                // swf文件路径
                swf: '/Lib/webuploader-0.1.5/Uploader.swf',

                // 文件接收服务端。
                server: '/Common/MAlarmMonitoring/RemoteHandlers/UploadPicture.ashx',

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
                previewImg(); //预览图片
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
                $(fileListId).html('');
                getImages(alarmid);
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
                    var imgCla = $(fileListId).attr('imageClassification');
                    var url = '/Common/MAlarmMonitoring/RemoteHandlers/UploadPicture.ashx?action=delete'
                                + '&alarmid=' + alarmid
                                + '&feather=' + imgCla
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
                            console.log('删除出错');
                        }
                    });
                }
            });
        }

        /*/*
         * @desc 获取已上传的图片
         * @param 
         */
        function getImages(alarmid) {
            var data = '';
            var url = '/Common/MAlarmMonitoring/RemoteHandlers/UploadPicture.ashx?action=query&alarmid=' + alarmid;
            $.ajax({
                type: 'post',
                url: url,
                async: true,
                cache: false,
                success: function (json) {
                    if (undefined !== json || '' !== json) {
                        if (undefined !== json.data || '' !== json.data) {
                            data = json.data;
                            if (data.length > 0) {
                                var $list_wait = $('#fileList-review', document);
                                var $list_done = $('#fileList-repair', document);
                                $list_wait.html('');
                                $list_done.html('');
                                
                                for (var i = 0; i < data.length; i++) {

                                    //复核图片
                                    if (data[i].WAIT_REPAIR_PICTURE.length > 0) {
                                        var count_wait = 0;
                                        for (var k1 = 0; k1 < data[i].WAIT_REPAIR_PICTURE.length; k1++) {
                                            if ('' !== data[i].WAIT_REPAIR_PICTURE[k1]) {
                                                var $li_wait = $('<div id="map_' + k1 + '" class="cp_img">' +
                                                                '<img src="' + data[i].WAIT_REPAIR_PICTURE[k1] + '">' +
                                                                '<span class="cp_img_jian"></span>' +
                                                                '<span class="success"></span>' +
                                                            '</div>');
                                                $list_wait.append($li_wait);
                                                count_wait++;
                                            }
                                        }
                                        $list_wait.parent().find('.file-info').html('共' + count_wait + '张图片');
                                        $list_wait.parent().find('input.file-count').attr('value', count_wait);
                                    }

                                    //修后图片
                                    if (data[i].DONE_REPAIR_PICTURE.length > 0) {
                                        var count_done = 0;
                                        for (var k1 = 0; k1 < data[i].DONE_REPAIR_PICTURE.length; k1++) {
                                            if ('' !== data[i].DONE_REPAIR_PICTURE[k1]) {
                                                var $li_done = $('<div id="map_' + k1 + '" class="cp_img">' +
                                                                '<img src="' + data[i].DONE_REPAIR_PICTURE[k1] + '">' +
                                                                '<span class="cp_img_jian"></span>' +
                                                                '<span class="success"></span>' +
                                                            '</div>');
                                                $list_done.append($li_done);
                                                count_done++;
                                            }
                                        }
                                        $list_done.parent().find('.file-info').html('共' + count_done + '张图片');
                                        $list_done.parent().find('input.file-count').attr('value', count_done);
                                    }
                                }

                                $(document).find('.layui-layer-content').scrollTop(scroll_bar_height);
                            }
                        }
                    }
                    previewImg(); //预览图片
                },
                error: function (e) {
                    console.log('查询出错');
                }
            });
        }

        /*/*
         * @desc 图片预览
         * @param 
         */
        function previewImg() {
            //预览图片
            $(objID + ' img').click(function (e) {
                var img_url = $(this).attr('src');
                var image = new Image();
                image.src = img_url;
                var clientWidth = document.body.clientWidth; //网页可见区域宽
                var clientHeight = document.body.clientHeight; //网页可见区域高
                // 原图大小
                //var width = image.width + 'px';
                //var height = image.height + 'px';
                //屏幕比例
                var width = clientWidth * 0.5 + 'px';
                var height = clientHeight * 0.75 + 'px';

                $(document).find('#preview-pic img').attr({
                    'src': img_url,
                    'width': width,
                    'height': height,
                });
                showDialog($(document).find('#preview-pic'), width, height, 'TRUE');
            });
        }

        /*/*
         * @desc 弹出对话框
         * @param 
         */
        function showDialog($targetElement, width, height, isCloseBtn) {
            var closeBtn = 1;
            if ('TRUE' === isCloseBtn) {
                closeBtn = 1;
            }
            if ('FALSE' === isCloseBtn) {
                closeBtn = false;
            }
            var _index =
               layer.open({
                   type: 1,
                   skin: 'dialog_box',
                   shade: [0.3, '#393D49'],
                   title: false, //不显示标题
                   fix: false,
                   closeBtn: closeBtn,
                   area: [width, height], //宽高
                   content: $targetElement.show(), //捕获的元素
                   cancel: function (index) {
                       layer.close(index);
                   }
               });
            return _index;
        }
    };
})(jQuery);