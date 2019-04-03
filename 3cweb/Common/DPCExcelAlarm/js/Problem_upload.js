(function ($) { //控件要与webuploader结合使用，引入该js前先引入webuploader
    $.fn.myUploadFile = function (options) {
        var defaults = {
            uploadCategories: '', //上传类别（如果为images，imageClassification必填；如果为files，imageClassification不填；如果为filesAndImages，imageClassification不填）
            imageClassification: '', //图片类型
            server: '', //后台路径
            action: '', //后台入口
            alarmid: '', //报警id
            fileListId: '', //文件区域id
            filePickerId: '', //选择文件的按钮id
            uploadBtnId: '' //上传按钮id
        };
        var objID = '#' + $(this).attr('id');
        var p = $.extend(defaults, options);

        //初始化上传图片html
        addUpload(p.uploadCategories, p.imageClassification, p.server, p.action, p.alarmid, p.fileListId + '-pic', p.fileListId + '-file', p.filePickerId, p.uploadBtnId);

        /*/*
         * @desc 初始化上传图片html
         * @param 
         */
        function addUpload(uploadCategories, imageClassification, server, action, alarmid, fileListIdPic, fileListIdFile, filePickerId, uploadBtnId) {

            //上传图片html
            var $box = $('<div id="box-upload" class="box-upload-pic"></div>');
            var _wrapper = '';
            if ('' !== fileListIdPic && null !== fileListIdPic && undefined !== fileListIdPic && 'undefined' !== fileListIdPic &&
                '' !== fileListIdFile && null !== fileListIdFile && undefined !== fileListIdFile && 'undefined' !== fileListIdFile &&
                '' !== filePickerId && null !== filePickerId && undefined !== filePickerId && 'undefined' !== filePickerId) {
                _wrapper = '<div class="wrapper">'
                                + '<div class="picker-box" >'
                                + '    <div id="' + filePickerId.split('#')[1] + '" class="webuploader-container cp_img_jia" ></div>'
                                + '    <div id="' + fileListIdPic.split('#')[1] + '"  class="uploader-list"></div>'
                                + '    <div id="' + fileListIdFile.split('#')[1] + '" class="uploader-list"></div>'
                                + '</div>'
                            + '</div>';
            }
            var _html_upload = '<div class="upload-box">'
                                + '<div class="count-info">（共0个文件）</div>'
                                + '<input type="hidden" class="file-count" value="0" />'
                                + '<input type="hidden" class="default-file-count" value="0" />'
                                + '<div id="btn-b" class="btn-box">'
                                    + '<span id="' + uploadBtnId.split('#')[1] + '" class="btn-upload hide">开始上传</span>'
                                + '</div>'
                            + '</div>';
            $($box).append(_wrapper).append(_html_upload);
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

            initUpload(uploadCategories, imageClassification, server, action, alarmid, fileListIdPic, fileListIdFile, filePickerId, uploadBtnId);
        }

        /*/*
         * @desc 初始化上传控件
         * @param 
         */
        function initUpload(uploadCategories, imageClassification, server, action, alarmid, fileListIdPic, fileListIdFile, filePickerId, uploadBtnId) {
            var $ = jQuery,
            $listPic = $(fileListIdPic),
            $listFile = $(fileListIdFile),
            // 优化retina, 在retina下这个值是2
            ratio = window.devicePixelRatio,
            // 缩略图大小
            thumbnailWidth = ratio,
            thumbnailHeight = ratio,
            state = 'pending',

            // 添加的文件数量
            fileCount = 0,

            // 构建上传图片参数
            uploaderOptionImages,

            // 构建上传文档参数
            uploaderOptionFiles,

            // 构建上传图片和文档参数
            uploaderOptionFilesAndImages,

            // 构建上传所需参数
            uploaderOption,

            // Web Uploader实例
            uploader;

            uploaderOptionImages = { //上传图片
                formData: {
                    uid: guid(),
                    action: action,
                    alarmid: alarmid,
                    feather: imageClassification
                },
                auto: false, // 选完文件后，是否自动上传。
                disableGlobalDnd: true,
                //fileNumLimit: 1,
                crop: false,  // 是否同意裁剪
                compress: false, //不压缩，上传图片是“原样”
                //allowMagnify: false, //是否允许放大
                swf: '/Lib/webuploader-0.1.5/Uploader.swf', // swf文件路径
                server: server, // 文件接收服务端。
                pick: {
                    id: filePickerId,  // 选择文件的按钮
                    multiple: false
                },
                accept: {  //只允许选择图片
                    title: 'Images',
                    extensions: 'gif,jpg,jpeg,bmp,png,GIF,JPG,JPEG,BMP,PNG',
                    mimeTypes: 'image/gif,image/jpg,image/jpeg,image/bmp,image/png,image/GIF,image/JPG,image/JPEG,image/BMP,image/PNG'   //如果定义*的话,会检索所有格式
                }
            }

            uploaderOptionFiles_doc = { //上传文档
                formData: {
                    uid: guid(),
                    action: action,
                    alarmid: alarmid,
                    feather: imageClassification
                },
                auto: false, // 选完文件后，是否自动上传。
                disableGlobalDnd: true,
                crop: false,  // 是否同意裁剪
                compress: false, //不压缩，上传图片是“原样”
                //allowMagnify: false, //是否允许放大
                swf: '/Lib/webuploader-0.1.5/Uploader.swf', // swf文件路径
                server: server, // 文件接收服务端。
                pick: {
                    id: filePickerId,// 选择文件的按钮
                    multiple: false
                },
                //fileNumLimit: 1,
                accept: {  //只允许选择图片
                    title: 'files',
                    extensions: 'doc,docx,DOC,DOCX',
                    mimeTypes: 'application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,'   //如果定义*的话,会检索所有格式
                }
            }

            uploaderOptionFiles = { //上传文档
                formData: {
                    uid: guid(),
                    action: action,
                    alarmid: alarmid,
                    feather: imageClassification
                },
                auto: false, // 选完文件后，是否自动上传。
                disableGlobalDnd: true,
                crop: false,  // 是否同意裁剪
                compress: false, //不压缩，上传图片是“原样”
                //allowMagnify: false, //是否允许放大
                swf: '/Lib/webuploader-0.1.5/Uploader.swf', // swf文件路径
                server: server, // 文件接收服务端。
                pick: {
                    id: filePickerId,// 选择文件的按钮
                    multiple: false
                },
                //fileNumLimit: 1,
                accept: {  //只允许选择图片
                    title: 'files',
                    extensions: 'doc,docx,xls,xlsx,pdf,txt,DOC,DOCX,XLS,XLSX,PDF,TXT',
                    mimeTypes: 'application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel	application/x-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/pdf,text/plain'   //如果定义*的话,会检索所有格式
                }
            }

            uploaderOptionFilesAndImages = { //上传图片和文档
                formData: {
                    uid: guid(),
                    action: action,
                    alarmid: alarmid,
                    feather: imageClassification
                },
                auto: false, // 选完文件后，是否自动上传。
                disableGlobalDnd: true,
                crop: false,  // 是否同意裁剪
                compress: false, //不压缩，上传图片是“原样”
                //allowMagnify: false, //是否允许放大
                swf: '/Lib/webuploader-0.1.5/Uploader.swf', // swf文件路径
                server: server, // 文件接收服务端。
                //pick: filePickerId, // 选择文件的按钮
                //fileNumLimit: 1,
                pick: {
                    id: filePickerId,// 选择文件的按钮
                    multiple: false
                }
            }

            uploaderOptionImagesMultiple = { //上传多张图片
                formData: {
                    uid: guid(),
                    action: action,
                    alarmid: alarmid,
                    feather: imageClassification
                },
                auto: false, // 选完文件后，是否自动上传。
                disableGlobalDnd: true,
                crop: false,  // 是否同意裁剪
                compress: false, //不压缩，上传图片是“原样”
                //allowMagnify: false, //是否允许放大
                swf: '/Lib/webuploader-0.1.5/Uploader.swf', // swf文件路径
                server: server, // 文件接收服务端。
                //pick: filePickerId, // 选择文件的按钮
                //fileNumLimit: 1,
                pick: {
                    id: filePickerId,// 选择文件的按钮
                    multiple: true
                }
            }

            //根据上传类型初始化不同的控件
            if ('images' === uploadCategories) {
                uploaderOption = uploaderOptionImages;
            }
            if ('files' === uploadCategories) {
                uploaderOption = uploaderOptionFiles;
            }
            if ('files_doc' === uploadCategories) {
                uploaderOption = uploaderOptionFiles_doc;
            }
            if ('filesAndImages' === uploadCategories) {
                uploaderOption = uploaderOptionFilesAndImages;
            }
            if ('Images_multiple' === uploadCategories) {
                uploaderOption = uploaderOptionImagesMultiple;
            }

            uploader = WebUploader.create(uploaderOption);

            // 当有一批文件添加进来的时候
            uploader.on('filesQueued', function (files) {
                var num = uploader.getFiles().length;

                var height = $(document).height();
                if (self.frameElement && self.frameElement.tagName == "IFRAME") {
                    var iframe_task_h = $('#iframe_task', window.parent.document).height();
                    if (iframe_task_h < height) {
                        $('#iframe_task', window.parent.document).height(height);
                    }
                }
            });

            // 当有文件添加进来的时候
            uploader.on('fileQueued', function (file) {
                if ('Images_multiple' !== uploadCategories) {
                    $listPic.html('');
                    $listFile.html('');
                    fileCount = 0;
                }

                //if (Number($listPic.parent().parent().parent().find('input.file-count').attr('value')) > 0) {
                //    fileCount = Number($listPic.parent().parent().parent().find('input.file-count').attr('value'));
                //}
                fileCount++;
                var pluginName = objID.split('-')[1]; //根据绑定的控件的名称截取第一个“-”后的名称
                $('#add-' + pluginName).val(fileCount);

                if ('files_doc' === uploadCategories) {
                    //文件
                    if (file.ext.indexOf('doc') >= 0 || file.ext.indexOf('docx') >= 0 || file.ext.indexOf('DOC') >= 0 || file.ext.indexOf('DOCX') >= 0) {
                        $listFile.append('<div id="' + file.id + '" class="file-item">' +
                                            '<a class="file-info" href="javascript:void(0)" title="' + file.name + '">' + file.name + '</a>' +
                                            '<div class="file-sta">' +
                                                '<span class="file-state">等待上传...</span>' +
                                                '<span class="file-jian"></span>' +
                                            '</div>' +
                                        '</div>');
                    }
                } else {
                    //文件
                    if (file.ext.indexOf('doc') >= 0 || file.ext.indexOf('docx') >= 0 || file.ext.indexOf('pdf') >= 0 || file.ext.indexOf('xls') >= 0 || file.ext.indexOf('xlsx') >= 0 || file.ext.indexOf('txt') >= 0 || file.ext.indexOf('DOC') >= 0 || file.ext.indexOf('DOCX') >= 0 || file.ext.indexOf('XLS') >= 0 || file.ext.indexOf('XLSX') >= 0 || file.ext.indexOf('PDF') >= 0 || file.ext.indexOf('TXT') >= 0) {
                        $listFile.append('<div id="' + file.id + '" class="file-item">' +
                                            '<a class="file-info" href="javascript:void(0)" title="' + file.name + '">' + file.name + '</a>' +
                                            '<div class="file-sta">' +
                                                '<span class="file-state">等待上传...</span>' +
                                                '<span class="file-jian"></span>' +
                                            '</div>' +
                                        '</div>');
                    }
                }

                //图片
                var $li = '';
                var $img = '';
                if (file.ext.indexOf('gif') >= 0 || file.ext.indexOf('jpg') >= 0 || file.ext.indexOf('jpeg') >= 0 || file.ext.indexOf('bmp') >= 0 || file.ext.indexOf('png') >= 0
                        || file.ext.indexOf('GIF') >= 0 || file.ext.indexOf('JPG') >= 0 || file.ext.indexOf('JPEG') >= 0 || file.ext.indexOf('BMP') >= 0 || file.ext.indexOf('PNG') >= 0) {
                    $li = $(
                        '<div id="' + file.id + '" class="cp_img">' +
                            '<img>' +
                            '<div class="cp_img_jian"></div>' +
                        '</div>'
                        ),
                    $img = $li.find('img');

                    // $list为容器jQuery实例
                    $listPic.append($li);

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
                }

                $listPic.parent().parent().parent().find('.count-info').html('（共' + fileCount + '个文件）');
                $listPic.parent().parent().parent().find('input.file-count').attr('value', fileCount);

            });

            // 文件上传成功，给item添加成功class, 用样式标记上传成功。
            uploader.on('uploadSuccess', function (file, response) {
                var pluginName = objID.split('-')[1]; //根据绑定的控件的名称截取第一个“-”后的名称
                var fileSerial = file.id.split('_')[2]; //根据file的属性id截取名称里最后的数字
                var $input = $('<input class="U-' + pluginName + '" id="U-' + pluginName + fileSerial + '" value="' + response._raw + '" type="hidden" />');
                $(objID).after($input);

                //图片上传成功
                if (file.ext.indexOf('gif') >= 0 || file.ext.indexOf('jpg') >= 0 || file.ext.indexOf('jpeg') >= 0 || file.ext.indexOf('bmp') >= 0 || file.ext.indexOf('png') >= 0
                     || file.ext.indexOf('GIF') >= 0 || file.ext.indexOf('JPG') >= 0 || file.ext.indexOf('JPEG') >= 0 || file.ext.indexOf('BMP') >= 0 || file.ext.indexOf('PNG') >= 0) {
                    $('#' + file.id).append($('<span class="success"></span>'));
                }
                if ('files_doc' === uploadCategories) {
                    //文档上传成功
                    if (file.ext.indexOf('doc') >= 0 || file.ext.indexOf('docx') >= 0 || file.ext.indexOf('DOC') >= 0 || file.ext.indexOf('DOCX') >= 0) {
                        $('#' + file.id).find('span.file-state').text('已上传');
                    }
                } else {
                    //文档上传成功
                    if (file.ext.indexOf('doc') >= 0 || file.ext.indexOf('docx') >= 0 || file.ext.indexOf('pdf') >= 0 || file.ext.indexOf('xls') >= 0 || file.ext.indexOf('xlsx') >= 0 || file.ext.indexOf('txt') >= 0 || file.ext.indexOf('DOC') >= 0 || file.ext.indexOf('DOCX') >= 0 || file.ext.indexOf('XLS') >= 0 || file.ext.indexOf('XLSX') >= 0 || file.ext.indexOf('PDF') >= 0 || file.ext.indexOf('TXT') >= 0) {
                        $('#' + file.id).find('span.file-state').text('已上传');
                    }
                }
                //上传成功后将队列里的数据移除
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
                $('#' + file.id).find('span.file-state').text('上传出错');
            });

            // 完成上传完了，成功或者失败，先删除进度条。
            uploader.on('uploadComplete', function (file) {
                $('#' + file.id).find('.progress').remove();
            });

            //所有文件上传完毕
            uploader.on('uploadFinished', function (file) {
                //提交表单
            });

            //开始上传
            $(uploadBtnId).click(function () {
                uploader.upload();
            });

            //显示图片的删除按钮
            $(fileListIdPic + ' .cp_img').live('mouseover', function () {
                $(this).children('.cp_img_jian').css('display', 'block');
            });

            //隐藏图片的删除按钮
            $(fileListIdPic + ' .cp_img').live('mouseout', function () {
                $(this).children('.cp_img_jian').css('display', 'none');
            });

            //执行图片的删除方法
            $listPic.on('click', fileListIdPic + ' .cp_img_jian', function () {
                if (Number($listPic.parent().parent().parent().find('input.file-count').attr('value')) > 0) {
                    fileCount = Number($listPic.parent().parent().parent().find('input.file-count').attr('value'));
                }
                var Id = $(this).parent().attr('id');
                if ('WU' === Id.split('_')[0]) {
                    uploader.removeFile(uploader.getFile(Id, true)); //从文件队列中删除文件
                    $listPic.find('div[id=' + Id + ']').remove();
                    fileCount--;
                    $('#add-file-num').val(fileCount);
                    $listPic.parent().parent().parent().find('.count-info').html('（共' + fileCount + '个文件）');
                    $listPic.parent().parent().parent().find('input.file-count').attr('value', fileCount);
                    layer.msg('删除成功');
                }
            });

            //显示文件的删除按钮
            $(fileListIdFile + ' .file-item').live('mouseover', function () {
                $(this).find('.file-jian').css('display', 'inline-block');
            });

            //隐藏文件的删除按钮
            $(fileListIdFile + ' .file-item').live('mouseout', function () {
                $(this).find('.file-jian').css('display', 'none');
            });

            //执行文件的删除方法
            $listFile.on('click', fileListIdFile + ' .file-jian', function () {
                if (Number($listFile.parent().parent().parent().find('input.file-count').attr('value')) > 0) {
                    fileCount = Number($listFile.parent().parent().parent().find('input.file-count').attr('value'));
                }
                var Id = $(this).parent().parent().attr('id');
                if ('WU' === Id.split('_')[0]) {
                    uploader.removeFile(uploader.getFile(Id, true)); //从文件队列中删除文件
                    $listFile.find('div[id=' + Id + ']').remove();
                    fileCount--;
                    $listFile.parent().parent().parent().find('.count-info').html('（共' + fileCount + '个文件）');
                    $listFile.parent().parent().parent().find('input.file-count').attr('value', fileCount);
                    layer.msg('删除成功');
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
                    'height': height
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

        // Generate four random hex digits.  
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };

        // Generate a pseudo-GUID by concatenating random hexadecimal.  
        function guid() {
            return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
        };


    };
})(jQuery);