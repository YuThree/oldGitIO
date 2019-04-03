/*
 * JQuery zTree core 3.5.14
 * 
 *
 * Date: 2016-08-12
 */



//layer层
function showLayer() {

    var _html = '<div id="layerContent"style="width:510px;margin: 30px auto 0">    <div style="margin-bottom: 10px;letter-spacing: 2px;font-size: 15px;color:#6F6F6F;"><span style="font-size:16px,;font-weight:700;margin-buttom:20px ;display:">报告生成进度</span><span id="pecentNumber" style="color:#2E7FCC">0.00</span><span style="color:#2E7FCC">%</span>&ensp;&ensp;总文件个数： <span id="sumNumber" style="color:#2E7FCC">0</span>  已生成数：<span id="readyNumber" style="color:#2E7FCC">0</span> </div>     <div><svg id="progressBar" style="display:inlinblock"></svg> </div><div id="download_word" style="width:117px;height:30px;margin: 40px auto 0;display:none;background:url(/C3/PC/MAlarmMonitoring/ImgTmp/portOutBtn.png);cursor: pointer;" ></div></div>';

    layer.open({
        title: ['<img src="/C3/PC/MAlarmMonitoring/ImgTmp/portOutICo.png" style="vertical-align:-7%;margin:0 10px 0 -10px"/>报告批量导出<img id="closeLayerBtn" src="/C3/PC/MAlarmMonitoring/ImgTmp/portOutClose.png" style="float:right;margin:10px -70px 0 0;cursor: pointer;"/>', 'font-size:18px;color:white;font-weight:800;background:url(/C3/PC/MAlarmMonitoring/ImgTmp/portOutBG.png);border-radius:10px 10px 0 0;height:36px'],
        type: 1,
        move: false,
        closeBtn: 0,
        area: ['600px', '200px'], //宽高
        content: _html
    });
    $('#layerContent').parent().parent().css("border-radius", "10px");
    $('#closeLayerBtn').click(function () {
        layer.closeAll('page');
    })
    //进度条初始化
    progressBar = $("#progressBar").Progress({
        percent: 0,
        width: 510,
        height: 20,
        fontSize: 16,
        increaseSpeed: 5,
        radius: 10,
        fontColor: '#000',
        backgroundColor: '#fff',
        barColor: '#91CBF9',
        animate: false
    });

}


//进度请求递归ajax
function planAjax(jingduUrl, download_url, idsdata,level) {
    $.ajax({//进度请求
        type: "POST",
        data:idsdata,
        url: jingduUrl,
        cache: false,
        async: true,
        success: function (result) {
            if (result != ""  ) {
                if ($('.layui-layer-shade').length > 0) {
                    var n = parseFloat(result.result);
                    var sum = result.total;
                    var ready = result.already;
                    progressBar.percent(n);
                    $('#pecentNumber').html(n);
                    $('#sumNumber').html(sum);
                    $('#readyNumber').html(ready);
                    if (n < 100) {
                        setTimeout(function () {
                            planAjax(jingduUrl, download_url, idsdata, level)
                        }, 500);
                    }
                    else {
                        // setTimeout(function () {
                        $("#download_word").css("display", "block");
                        $("#download_word").click(function () {
                            if (level == 2 || level == 1 || level == 3) {
                                var index = layer.load(1, {
                                    shade: [0.1, '#fff'] //0.1透明度的白色背景
                                });
                            }
                            down_ajax(download_url, idsdata);
                            layer.closeAll('page');
                        })
                        //   }, 500)

                    };
                }
            } else {
                   // $("#closeLayerBtn").click();
                   // layer.alert('无数据', { icon: 7 });
            }
        },
        error:function(){
            setTimeout(function () {
                planAjax(jingduUrl, download_url)
            }, 500);
        }
    })
}


function planAjaxSingle(jingduUrl, download_url) {
    $.ajax({//进度请求
        type: "POST",
        url: jingduUrl,
        cache: false,
        async: true,
        success: function (result) {
            if (result != "" && $('.layui-layer-shade').length > 0) {

                var n = parseFloat(result);
               
                progressBar.percent(n);
                if(result==100){
                    $('#readyNumber').html(1);
                }else{
                    $('#readyNumber').html(0);
                }
                $('#pecentNumber').html(n);
                $('#sumNumber').html(1);
                if (n < 100) {
                    setTimeout(function () {
                        planAjaxSingle(jingduUrl, download_url)
                    }, 500);
                }
                else {
                    console.log(result)
                    // setTimeout(function () {
                    $("#download_word").css("display", "block");
                    $("#download_word").click(function () {

                        down_ajax(download_url);
                        layer.closeAll('page');
                    })
                    //   }, 500)
                }
            }
        },
        error: function (aaa) {
            console.log(aaa)
        }
    })
}
function down_ajax(download_url, idsdata) {
    $.ajax({
        type: "POST",
        data:idsdata,
        url: download_url,
        cache: false,
        async: true,
        success: function (result) {
            if (result != '' && result != undefined && result != 'false') {
                layer.closeAll('loading')
                console.log(result.url)
                Downer(result.url);
            } else {
                layer.closeAll('loading')
                layer.alert('导出失败', { icon: 7 });
            }
        },
        error: function (xhr) {
            console.log(xhr)
                layer.closeAll('loading')
                layer.alert('导出失败', { icon: 7 });
        }

    })
}






//进度条方法jq拓展
$.fn.extend({
    Progress: function (options) {
        var settings = {
            width: 90, // 进度条宽度
            height: 20, // 进度条高度
            percent: 0, // 当前占比
            backgroundColor: '#555', // 进度条背景颜色
            barColor: '#d9534f', // 进度条颜色
            fontColor: '#fff', // 百分比字体颜色
            radius: 4, // 边角圆度
            fontSize: 12, // 字体大小
            borderColor: '#C7C7C7',

            increaseTime: 1000.00 / 60.00, // 每一次调整进度条的时间, 默认最佳时间(可以调大，不要调小)；只有在animate为true的情况下有效
            increaseSpeed: 1, // 每次调整，增长速度；只有在animate为true的情况下有效
            animate: true // 调整的时候，是否使用动画增长，默认为true
        };
        $.extend(settings, options);

        var $svg = $(this), $background, $bar, $g, $text, timeout;

        function progressPercent(p) {
            if (!$.isNumeric(p) || p < 0) {
                return 0;
            } else if (p > 100) {
                return 100;
            } else {
                return p;
            }
        }

        // 动画相关方法
        var Animate = {
            getWidth: function () {
                // 获取当前的宽度，根据总宽度和percent
                return settings.width * settings.percent / 100.00;
            },
            getPercent: function (currentWidth) {
                // 根据当前的宽度，计算当前的percent
                return ((100 * currentWidth / settings.width).toFixed(2))
            },
            animateWidth: function (currentWidth, targetWidth) {
                // 动画增长
                timeout = setTimeout(function () {
                    if (currentWidth > targetWidth) {
                        if (currentWidth - settings.increaseSpeed <= targetWidth) {
                            currentWidth = targetWidth;
                        } else {
                            currentWidth = currentWidth - settings.increaseSpeed;
                        }
                    } else if (currentWidth < targetWidth) {
                        if (currentWidth + settings.increaseSpeed >= targetWidth) {
                            currentWidth = targetWidth;
                        } else {
                            currentWidth = currentWidth + settings.increaseSpeed;
                        }
                    }

                    $bar.attr("width", currentWidth);
                    $text.empty().append(Animate.getPercent(currentWidth) + "%");

                    if (currentWidth != targetWidth) {
                        Animate.animateWidth(currentWidth, targetWidth);
                    }
                }, settings.increaseTime);
            }
        }

        function svg(tag) {
            return document.createElementNS("http://www.w3.org/2000/svg", tag);
        }

        // 初始化条件
        !!function () {
            settings.percent = progressPercent(settings.percent);

            $svg.attr({ 'width': settings.width, 'height': settings.height });

            $background = $(svg("rect")).appendTo($svg)
                            .attr({ x: 0, rx: settings.radius, width: settings.width, height: settings.height, fill: settings.backgroundColor, stroke: settings.borderColor });

            $bar = $(svg("rect")).appendTo($svg)
                      .attr({ x: 0, rx: settings.radius, height: settings.height, fill: settings.barColor });

            //$g = $(svg("g")).appendTo($svg)
            //          .attr({ "fill": "#fff", "text-anchor": "middle", "font-family": "DejaVu Sans,Verdana,Geneva,sans-serif", "font-size": settings.fontSize });

            $text = $(svg("text")).appendTo($g)
                      .attr({ "x": settings.width / 2.0, "y": settings.height / 2.0 + settings.fontSize / 3.0, fill: settings.fontColor });

            draw();
        }();

        // 绘制进度条
        function draw() {
            var targetWidth = Animate.getWidth();

            // 是否使用动画增长
            if (settings.animate) {
                if (timeout) {
                    clearTimeout(timeout);
                }
                var currentWidth = parseFloat($bar.attr("width"));
                if (!currentWidth) currentWidth = 0;

                Animate.animateWidth(currentWidth, targetWidth);
            } else {
                $bar.attr("width", targetWidth);
                $text.empty().append(settings.percent + "%");
            }
        }

        this.percent = function (p) {
            if (p) {
                p = progressPercent(p);

                settings.percent = p;
                draw();
            }
            return settings.percent;
        }

        return this;
    }
});