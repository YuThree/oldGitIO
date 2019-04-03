/*
    例如：
    //绑定控件
    $('#upload').myWebUpload({ //超过一次调用时，id必须不同
        uploadBtnId: '#ctlBtn',//超过一次调用时，id必须不同
        uploadCategories: 'filesAndImages', //images，files，filesAndImages
        server: '/Common/MAlarmMonitoring/RemoteHandlers/UploadFiles.ashx',
        uploadParams: {
            action: 'UpLoad', 
            alarmid: guid()【在MasterJs中】 或 GetQueryString('alarmid'), //不能使用字段id，会冲突
        },
        onFinished: function(files){
            //files是上传成功的所有图片的路径的数组数据
        }
    });
*/
(function ($) { //控件要与webuploader结合使用，引入该js前先引入webuploader，还需引入layer
    $.fn.myWebUpload = function (options) {
        var defaults = {
            uploadBtnId: '', //上传按钮id
            addBtnBgClass: '', //添加文件的背景图路径，用class表示，如：.add_file_bg { background: url(/Lib/myWebUpload/images/upload_file.png) no-repeat; }，默认有背景图，如需要特定的背景图可自定义设置（add_file_bg，add_img_bg是默认的，不能与此名相同）
            uploadCategories: '', //上传类别（images、files、filesAndImages）
            server: '', //后台路径
            uploadParams: {}, //上传时后台所需参数（不能使用字段id，会冲突），格式参考上面的示例
            onFinished: false, //上传成功，返回数据
            onDelete: false, //请求后台删除图片
            callback: false, //回调函数，控件加载完后调用
        };
        var uploaderID = '#' + $(this).attr('id');
        var p = $.extend(defaults, options);

        //初始化上传图片html
        addUpload();

        /*/*
         * @desc 初始化上传图片html
         * @param 无
         */
        function addUpload() {

            //上传图片html
            var myWebUploadBox = $('<div class="myWebUploadBox"></div>');

            var uploaderIDName = uploaderID.split('#')[1];

            var listIdPicName = uploaderIDName + '_listPic'; //文件区域id名称
            var listIdFileName = uploaderIDName + '_listFile'; //文件区域id名称
            var pickerIdName = uploaderIDName + '_picker'; //选择文件的按钮id名称

            var listIdPic = '#' + listIdPicName; //文件区域id名称
            var listIdFile = '#' + listIdFileName; //文件区域id名称
            var pickerId = '#' + pickerIdName; //选择文件的按钮id名称

            var bg_class = '';
            //根据上传类型绑定不同的样式
            if ('' !== p.addBtnBgClass) {
                bg_class = p.addBtnBgClass;
            } else {
                if ('images' === p.uploadCategories) {
                    bg_class = 'add_img_bg';
                } else {
                    bg_class = 'add_file_bg';
                }
            }
            var uploader_list = '';
            if ('images' === p.uploadCategories) {
                uploader_list = '<div id="' + listIdPicName + '"  class="uploader-list"></div>' +
                                '<div id="' + listIdFileName + '"></div>';
            } else if ('files' === p.uploadCategories) {
                uploader_list = '<div id="' + listIdPicName + '"></div>' +
                                '<div id="' + listIdFileName + '" class="uploader-list"></div>';
            } else {
                uploader_list = '<div id="' + listIdPicName + '"  class="uploader-list"></div>' +
                                '<div id="' + listIdFileName + '" class="uploader-list"></div>';
            }
            var _wrapper = '<div class="wrapper">'
                                + '<div class="picker-box" >'
                                + uploader_list
                                + '    <div id="' + pickerIdName + '" class="webuploader-container file_img_add ' + bg_class + '" ></div>'
                                + '</div>'
                            + '</div>';
            var _html_upload = '<div class="upload-info-box">'
                                + '<div class="count-info">（共0个文件）</div>'
                                + '<input type="hidden" class="file-count" value="0" />'
                                + '<span id="' + p.uploadBtnId.split('#')[1] + '" class="btn-upload hide">开始上传</span>'
                            + '</div>';
            $(myWebUploadBox).append(_wrapper).append(_html_upload);
            $(uploaderID, document).append(myWebUploadBox);

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

            initUpload(listIdPic, listIdFile, pickerId);
        }

        /*/*
         * @desc 初始化上传控件
         * @param 
         */
        function initUpload(listIdPic, listIdFile, pickerId) {
            //声明变量
            var $ = jQuery,
            $listPic = $(listIdPic),
            $listFile = $(listIdFile),
            // 优化retina, 在retina下这个值是2
            ratio = window.devicePixelRatio,
            // 缩略图大小
            thumbnailWidth = ratio,
            thumbnailHeight = ratio,
            state = 'pending',

            // 添加的文件数量
            fileCount = 0,

            // 上传成功的文件数量，上传前需置0
            successFileCount = 0,

            // 上传成功的文件路径，上传前需置空
            fileArray = [],

            // 上传成功的文件路径，上传前需置空
            fileStr = '',

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

            //变量赋值
            uploaderOptionImages = { //上传图片
                formData: p.uploadParams,
                auto: false, // 选完文件后，是否自动上传。
                disableGlobalDnd: true,
                crop: false,  // 是否同意裁剪
                compress: false, //不压缩，上传图片是“原样”
                //allowMagnify: false, //是否允许放大
                swf: '/Lib/webuploader-0.1.5/Uploader.swf', // swf文件路径
                server: p.server, // 文件接收服务端。
                pick: pickerId, // 选择文件的按钮
                accept: {  //只允许选择图片
                    title: 'Images',
                    extensions: 'gif,jpg,jpeg,bmp,png,GIF,JPG,JPEG,BMP,PNG',
                    mimeTypes: 'image/gif,image/jpg,image/jpeg,image/bmp,image/png,image/GIF,image/JPG,image/JPEG,image/BMP,image/PNG'   //如果定义*的话,会检索所有格式
                }
            }

            uploaderOptionFiles = { //上传文档
                formData: p.uploadParams,
                auto: false, // 选完文件后，是否自动上传。
                disableGlobalDnd: true,
                crop: false,  // 是否同意裁剪
                compress: false, //不压缩，上传图片是“原样”
                //allowMagnify: false, //是否允许放大
                swf: '/Lib/webuploader-0.1.5/Uploader.swf', // swf文件路径
                server: p.server, // 文件接收服务端。
                pick: pickerId, // 选择文件的按钮
                accept: {  //只允许选择图片
                    title: 'files',
                    extensions: 'doc,docx,xls,xlsx,pdf,txt,DOC,DOCX,XLS,XLSX,PDF,TXT',
                    mimeTypes: 'application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel	application/x-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/pdf,text/plain'   //如果定义*的话,会检索所有格式
                }
            }

            uploaderOptionFilesAndImages = { //上传图片和文档
                formData: p.uploadParams,
                auto: false, // 选完文件后，是否自动上传。
                disableGlobalDnd: true,
                crop: false,  // 是否同意裁剪
                compress: false, //不压缩，上传图片是“原样”
                //allowMagnify: false, //是否允许放大
                swf: '/Lib/webuploader-0.1.5/Uploader.swf', // swf文件路径
                server: p.server, // 文件接收服务端。
                pick: pickerId, // 选择文件的按钮
            }

            //根据上传类型初始化不同的控件
            if ('images' === p.uploadCategories) {
                uploaderOption = uploaderOptionImages;
            }
            if ('files' === p.uploadCategories) {
                uploaderOption = uploaderOptionFiles;
            }
            if ('filesAndImages' === p.uploadCategories) {
                uploaderOption = uploaderOptionFilesAndImages;
            }

            //控件实例化
            uploader = WebUploader.create(uploaderOption);

            //控件事件
            // 当有一批文件添加进来的时候
            uploader.on('filesQueued', function (files) {
                var num = uploader.getFiles().length; //添加的文件的总数量
                
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
                if (Number($(uploaderID).find('input.file-count').attr('value')) > 0) {
                    fileCount = Number($(uploaderID).find('input.file-count').attr('value'));
                }
                fileCount++;

                //文件
                if ('FILE' === getFileType(file.ext)) {
                    $listFile.append('<div id="' + file.id + '" class="file_item">' +
                                        '<a class="file-info" href="javascript:void(0)" title="' + file.name + '">' + file.name + '</a>' +
                                        '<div class="file-sta">' +
                                            '<span class="file-state">等待上传...</span>' +
                                            '<span class="file_delete"></span>' +
                                        '</div>' +
                                    '</div>');
                }

                //图片
                var $li = '';
                var $img = '';
                if ('IMG' === getFileType(file.ext)) {
                    $li = $(
                       '<div id="' + file.id + '" class="img_item">' +
                           '<img>' +
                           '<span class="img_delete"></span>' +
                           '<span class="img_success"></span>' +
                           '<span class="img_error"></span>' +
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

                $(uploaderID).find('.count-info').html('（共' + fileCount + '个文件）');
                $(uploaderID).find('input.file-count').attr('value', fileCount);
               
            });

            // 文件上传成功，给item添加成功class, 用样式标记上传成功。
            uploader.on('uploadSuccess', function (file, response) {
                //文档上传成功
                if ('FILE' === getFileType(file.ext)) {
                    $('#' + file.id).find('span.file-state').text('已上传');
                    $('#' + file.id).find('a').attr('temp-url', response._raw.split(';')[0]);
                }
                //图片上传成功
                if ('IMG' === getFileType(file.ext)) {
                    $('#' + file.id).find('span.img_success').css('display', 'inline-block');
                    $('#' + file.id).find('img').attr('src', response._raw.split(';')[0]);
                }
                //上传成功后将队列里的数据移除
                uploader.removeFile(uploader.getFile(file.id, true));

                //将后台返回的文件路径存入fileArray返回给控件调用处，在uploadFinished中返回
                fileStr += response._raw;
                fileArray[successFileCount] = response._raw;
                successFileCount++;
            });

            // 文件上传失败，显示上传出错。
            uploader.on('uploadError', function (file) {
                var $li = $('#' + file.id),
                    $error_img = $li.find('span.img_error'),
                    $error_file = $li.find('span.file-state');

                if ($error_img.length > 0) {
                    $error_img.text('上传失败').css('display', 'inline-block');
                }
                if ($error_file.length > 0) {
                    $error_file.text('上传失败');
                }
            });

            // 上传完一个文件，成功或者失败，先删除进度条。
            uploader.on('uploadComplete', function (file) {
                $('#' + file.id).find('.progress').remove();
            });

            //所有文件上传完毕
            uploader.on('uploadFinished', function () {
                //提交表单
                var addCount = fileCount;
                if (p.onFinished) {
                    p.onFinished(addCount, fileArray, fileStr);
                }
            });

            //开始上传
            $(p.uploadBtnId).click(function () {
                successFileCount = 0; //上传前需置0
                fileArray = []; //上传前需置空
                fileStr = ''; //上传前需置空
                uploader.upload();
            });

            //显示图片的删除按钮
            $(listIdPic + ' .img_item').live('mouseover', function () {
                $(this).children('.img_delete').css('display', 'block');
            });

            //隐藏图片的删除按钮
            $(listIdPic + ' .img_item').live('mouseout', function () {
                $(this).children('.img_delete').css('display', 'none');
            });

            //执行图片的删除方法
            $listPic.on('click', listIdPic + ' .img_delete', function () {
                var tempType = 'IMG';
                var tempUrl = $(this).parent().find('img').attr('src');
                if (Number($(uploaderID).find('input.file-count').attr('value')) > 0) {
                    fileCount = Number($(uploaderID).find('input.file-count').attr('value'));
                }
                var Id = $(this).parent().attr('id');
                if ('WU' === Id.split('_')[0]) {
                    uploader.removeFile(uploader.getFile(Id, true)); //从文件队列中删除文件
                    $listPic.find('div[id=' + Id + ']').remove();
                    fileCount--;
                    $(uploaderID).find('.count-info').html('（共' + fileCount + '个文件）');
                    $(uploaderID).find('input.file-count').attr('value', fileCount);
                    layer.msg('删除成功');
                } else {
                    if (p.onDelete) {
                        p.onDelete(Id, tempUrl, tempType, fileCount);
                    }
                }
            });

            //显示文件的删除按钮
            $(listIdFile + ' .file_item').live('mouseover', function () {
                $(this).find('.file_delete').css('display', 'inline-block');
            });

            //隐藏文件的删除按钮
            $(listIdFile + ' .file_item').live('mouseout', function () {
                $(this).find('.file_delete').css('display', 'none');
            });

            //执行文件的删除方法
            $listFile.on('click', listIdFile + ' .file_delete', function () {
                var tempType = 'FILE';
                var tempUrl = $(this).parent().find('a').attr('temp-url');
                if (Number($(uploaderID).find('input.file-count').attr('value')) > 0) {
                    fileCount = Number($(uploaderID).find('input.file-count').attr('value'));
                }
                var Id = $(this).parent().parent().attr('id');
                if ('WU' === Id.split('_')[0]) {
                    uploader.removeFile(uploader.getFile(Id, true)); //从文件队列中删除文件
                    $listFile.find('div[id=' + Id + ']').remove();
                    fileCount--;
                    $(uploaderID).find('.count-info').html('（共' + fileCount + '个文件）');
                    $(uploaderID).find('input.file-count').attr('value', fileCount);
                    layer.msg('删除成功');
                } else {
                    if (p.onDelete) {
                        p.onDelete(Id, tempUrl, tempType, fileCount);
                    }
                }
            });

            if (p.callback) {
                p.callback();
            }
        }

        /*/*
         * @desc 获取文件类型
         * @param fileSuffix：文件后缀名
         * @return fileType
         */
        function getFileType(fileSuffix) {
            var fileType = '';
            if (fileSuffix.indexOf('doc') >= 0 || fileSuffix.indexOf('docx') >= 0 ||
                fileSuffix.indexOf('xls') >= 0 || fileSuffix.indexOf('xlsx') >= 0 ||
                fileSuffix.indexOf('pdf') >= 0 || fileSuffix.indexOf('txt') >= 0 ||
                fileSuffix.indexOf('DOC') >= 0 || fileSuffix.indexOf('DOCX') >= 0 ||
                fileSuffix.indexOf('XLS') >= 0 || fileSuffix.indexOf('XLSX') >= 0 ||
                fileSuffix.indexOf('PDF') >= 0 || fileSuffix.indexOf('TXT') >= 0) {
                fileType = 'FILE';
            }
            if (fileSuffix.indexOf('gif') >= 0 || fileSuffix.indexOf('jpg') >= 0 ||
                fileSuffix.indexOf('jpeg') >= 0 || fileSuffix.indexOf('bmp') >= 0 ||
                fileSuffix.indexOf('png') >= 0 || fileSuffix.indexOf('GIF') >= 0 ||
                fileSuffix.indexOf('JPG') >= 0 || fileSuffix.indexOf('JPEG') >= 0 ||
                fileSuffix.indexOf('BMP') >= 0 || fileSuffix.indexOf('PNG') >= 0) {
                fileType = 'IMG';
            }
            return fileType;
        }

        /*/*
         * @desc 图片预览
         * @param 
         */
        function previewImg() {
            //预览图片
            $(uploaderID + ' img').click(function (e) {
                var img_url = $(this).attr('src');
                var image = new Image();
                image.src = img_url;
                //var clientWidth = document.body.clientWidth; //网页可见区域宽
                //var clientHeight = document.body.clientHeight; //网页可见区域高
                var winWidth = $(window).width(); //网页可见区域宽
                var winHeight = $(window).height(); //网页可见区域高
                // 原图大小
                //var width = image.width + 'px';
                //var height = image.height + 'px';
                //屏幕比例
                var width = winWidth * 0.75;
                var height = winHeight * 0.75;

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
                   //shade: [0.3, '#393D49'],
                   shade: 0,
                   title: false, //不显示标题
                   fix: false,
                   closeBtn: closeBtn,
                   area: [width + 'px', height + 'px'], //宽高
                   content: $targetElement.show(), //捕获的元素
                   cancel: function (index) {
                       layer.close(index);
                   }
               });
            return _index;
        }
    };
})(jQuery);