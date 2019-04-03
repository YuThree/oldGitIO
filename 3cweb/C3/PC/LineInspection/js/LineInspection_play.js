/*========================================================================================*
* 功能说明：线路巡检播放页
* 注意事项：
* 作    者： ybc
* 版本日期：2016年9月20日
* 变更说明：
* 版 本 号： V1.0.0

*=======================================================================================*/
var time_speed = 400;//播放速度
var pageIndex = 1;//初始播放内容页
var pageSize = 30;//初始播放条数
var sumPage = 0;//播放总页数
var Ispaly = true;//播放  默认开启
//var inerval; //定时器
var t; //定时器
var number = 0;//请求第几次 第一次设置数组长度
var slider;//播放进度条
var sliderNumber = 0;//进度值
var jsonPlay;//json数据
var count = 0;//进度条最大值
var Sumcount = 0;//进度条最大值really
var sumArrayA;//总数组A
var sumArrayB;//总数组B
//var change = false;//是否进行拖动
var myChart1
var myChart2
var myChart3
var option1
var option2
var option3
var CompleteImgNum = 0;//图片预加载
var AB_SURFACE = 'A';//播放AB面
var LINE_CODE='';
var bigIMG = 'OVER';//大图播放种类
var bigGlass = false;//放大镜是否开启
var judgeAnswer = true;//输入验证
var f = $('#F').data('elevateZoom');//放大dom
var directChange = false;//行别发生变化与否
var nodata = false;//重置结果集查询结果为空
var ehcartsClick = false;//echarts点击
//对比分析数据
//按键事件
$(document).keyup(function (e) {
    var key = e.which;
    if (key == 32) {
        if (Ispaly) {
            Ispaly = false;
        } else {
            Ispaly = true;
            play();
        };
    }
    if (key == 37) {
        console.log(sliderNumber)
        $('#btn_less').children("img").click();
    }
    if (key == 39) {
        $('#btn_next').children("img").click();
    }
});
//页面加载
$(function () {
    $('#direction').change(function () { directChange = true; })
    $("#linspForm").validationEngine({
        validationEventTriggers: "blur",  //触发的事件  "keyup blur",   
        inlineValidation: true, //是否即时验证，false为提交表单时验证,默认true   
        success: false, //为true时即使有不符合的也提交表单,false表示只有全部通过验证了才能提交表单,默认false
        promptPosition: "topLeft" //提示位置，topLeft, topRight, bottomLeft,  centerRight, bottomRight
        //        validateNonVisibleFields: true
    });

    //放大镜
    $("#F").elevateZoom({
        zoomType: "lens",
        lensShape: "round",
        lensSize: 300
    });

    $('.content_jpg').css('height', $(document.body).height()-100+'px')//根据屏幕高度设置大图高度
    //小图点击
    $('.littleimg').click(function () {
        $('.littleimg').removeClass('chooseOne')
        $(this).addClass('chooseOne')
    });
    //筛选
    $('#Submit1').click(function () {
        if ($('#linspForm').validationEngine("validate")) {
            dojudge()
            if (judgeAnswer) {
                screenBtn();
            }
        }
        
    })
    //对比分析 打开对比页 传值
    $('#compara_btn').click(function () {
        if (AB_SURFACE == 'A') {
            LINE_CODE = sumArrayA[sliderNumber].LINE_CODE;
            POSITION_CODE = sumArrayA[sliderNumber].POSITION_CODE;
            BRG_TUN_CODE = sumArrayA[sliderNumber].BRG_TUN_CODE;
            KM_MARK = sumArrayA[sliderNumber].KM_MARK;
            KM_MARK_O = sumArrayA[sliderNumber].KM_MARK_O;
            DIRECTION = sumArrayA[sliderNumber].DIRECTION;
            POLE_NUMBER = sumArrayA[sliderNumber].POLE_NUMBER;
            LINE_INSPECT_ID = sumArrayA[sliderNumber].LINE_INSPECT_ID;
            POLE_CODE = sumArrayA[sliderNumber].POLE_CODE;
            LINE_NAME = sumArrayA[sliderNumber].LINE_NAME;
            STATION_NAME = sumArrayA[sliderNumber].POSITION_NAME;
        } else if (AB_SURFACE == 'B') {
            LINE_CODE = sumArrayB[sliderNumber].LINE_CODE;
            POSITION_CODE = sumArrayB[sliderNumber].POSITION_CODE;
            BRG_TUN_CODE = sumArrayB[sliderNumber].BRG_TUN_CODE;
            KM_MARK = sumArrayB[sliderNumber].KM_MARK;
            KM_MARK_O = sumArrayB[sliderNumber].KM_MARK_O;
            DIRECTION = sumArrayB[sliderNumber].DIRECTION;
            POLE_NUMBER = sumArrayB[sliderNumber].POLE_NUMBER;
            LINE_INSPECT_ID = sumArrayB[sliderNumber].LINE_INSPECT_ID;
            POLE_CODE = sumArrayB[sliderNumber].POLE_CODE;
            LINE_NAME = sumArrayB[sliderNumber].LINE_NAME;
            STATION_NAME = sumArrayB[sliderNumber].POSITION_NAME;
        }
        var _url = '/C3/PC/LineInspection/LineInspection_analysis.html?'
       + '&LINE_CODE=' + LINE_CODE
       + '&POSITION_CODE=' + POSITION_CODE
       + '&BRG_TUN_CODE=' + BRG_TUN_CODE
       + '&KM_MARK=' + KM_MARK
       + '&KM_MARK_O=' + KM_MARK_O
       + '&DIRECTION=' + escape(DIRECTION)
       + '&POLE_NUMBER=' + POLE_NUMBER
       + '&LINE_INSPECT_ID=' + LINE_INSPECT_ID
       + '&POLE_CODE=' + POLE_CODE
       + '&LINE_NAME=' + escape(LINE_NAME)
       + '&STATION_NAME=' + escape(STATION_NAME)
       + '&AB_SURFACE=' + AB_SURFACE
        window.open(_url)
    })
    //初始获取json
    getJson()
    
   
    $('#LineTreeselect').mySelectTree({
        tag: 'LINE_FILTER',
        codeType: LINE_CODE,
        height: 250,
        enableFilter: true,
        
    });
    //进度条设置上限
    Setslider(Sumcount)
    //echarts初始化
    createLineChart()
    //播放
    play();
    
    
    
   
   
});

//*********************************初始数据获取*****************************************//


//获取url数据
function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串 
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
};

//初始json请求
function getJson() {
    number++;
    var urlObj = GetRequest();
    var stime = urlObj.sTime;//
    var id = urlObj.id;
    var eTime = urlObj.eTime;
    LINE_CODE = urlObj.Line_code;
    $('#startTime').click(function () {
        getTimeRange(stime, eTime)
    })
    $('#endTime').click(function () {
        getTimeRange(stime, eTime)
    })
    //var _url = '/c3/pc/lineinspection/remotehandlers/getlineinspectionlist.ashx?action=video' +
    //    '&id=' + id
    //   + '&pageIndex=' + pageIndex
    //   + '&pageSize=' + pageSize
    //   + '&AB_SURFACE=' + AB_SURFACE

    //var stTime = $('#startTime').val(); //开始时间
    //var edTime = $('#endTime').val();  //结束时间
    //var kmStart = $('#kmStart').val();  //开始公里标
    //var kmEnd = $('#kmEnd').val();  //结束公里标
    ////var positioncode = $('#LineTreeselect').val();  //区间code
    //var positioncode = $('#LineTreeselect').attr('code');  //区间code

    //if (positioncode == null || positioncode == 0 || positioncode==undefined) {
    //    positioncode = '';
    //}
    //var dirct = "";//行别
    //if ($('#direction').val() != 0) {
    //    dirct = escape($('#direction').val())
    //}
    var stTime = '';
    var edTime = '';
    var kmStart = '';
    var kmEnd = '';
    var positioncode = '';
    var dirct = "";//行别
    if ($('#direction').val() != 0) {
        dirct = escape($('#direction').val())
    }
    //console.log($('#direction').val())
    var _url = '/c3/pc/lineinspection/remotehandlers/getlineinspectionlist.ashx?action=video'
    + '&id=' + id
    + '&pageIndex=' + pageIndex
    + '&pageSize=' + pageSize
    + '&DIRECTION=' + dirct
    + '&starttime=' + stTime
    + '&endtime=' + edTime
    + '&AB_SURFACE=' + AB_SURFACE
    + '&startKM=' + kmStart
    + '&endKM=' + kmEnd
    + '&positioncode=' + positioncode

    $.ajax({
        url: _url,
        async: false,
        cache: false,
        success: function (re) {
            if (re != '' && re != undefined && re.data.length != 0) {
                jsonPlay = re;
                ParamSetting(jsonPlay)
            }
            else {
                layer.msg('暂无数据！');
                $('#F').attr({ 'src': 'img/bg.jpg' })
                $('#RED').attr({ 'src': 'img/bg.jpg' })
                $('#HD').attr({ 'src': 'img/bg.jpg' })
                $('#OVER').attr({ 'src': 'img/bg.jpg' })
            }
        }
    })
};

            //重置页面
function resetAll() {
    pageIndex = 1;//初始播放内容页
    sumPage = 0;//播放总页数
    sliderNumber = 0;//进度值
    count = 0;//进度条最大值
    Sumcount = 0;//进度条最大值really
    number = 0;//请求第几次 第一次设置数组长度
    CompleteImgNum = 0;//图片预加载
    clearEcharts();//清空echarts
    //change = false;//是否进行拖动

};

    //数组写入及参数设置
function ParamSetting(jsonPlay) {
    sumPage = parseInt(jsonPlay.totalPages)//总页数
    //count += parseInt(jsonPlay.Current_pagesize)//进度条最大值
    count = (pageIndex - 1) * pageSize + parseInt(jsonPlay.Current_pagesize)
    Sumcount = parseInt(jsonPlay.total_Rows);//进度条最大值really
    if (number <= 1) {
        sumArrayA = new Array(Sumcount);
        sumArrayB = new Array(Sumcount);
        for (var i = 0; i < jsonPlay.data.length; i++) {
            sumArrayA[i] = jsonPlay.data[i]
        }
    } else {
        if (AB_SURFACE == 'A') {
            for (var i = 0; i < jsonPlay.data.length; i++) {
                sumArrayA[i + (pageIndex - 1) * pageSize] = jsonPlay.data[i]
            };
        } else if (AB_SURFACE == 'B') {
            for (var i = 0; i < jsonPlay.data.length; i++) {
                sumArrayB[i + (pageIndex - 1) * pageSize] = jsonPlay.data[i]
            };
        }; 
    }
    //console.log(jsonPlay.totalPages)
};

        //时间默认值
function getTimeRange(stime, eTime) {
    WdatePicker({
        dateFmt: 'yyyy-MM-dd HH:mm:ss', isShowToday: true, minDate: stime, maxDate: eTime
    })
};

        //鼠标事件
$(function () {
        //查询
    $('#query_btn').children("img").hover(function () {
        if ($(".QueryBuilder").css("display") == "none") {//未点击时
            $(this).attr("src", "img/LineInspection_play_searchHover.png")
        }
    }, function () {
        if ($(".QueryBuilder").css("display") == "none") {
            $(this).attr("src", "img/LineInspection_play_search.png")
        }
    });
    $('#query_btn').children("img").click(function () {
        $(this).attr("src", "img/LineInspection_play_searchClick.png")
        Ispaly = false;
        $('.QueryBuilder').toggle()
    });

//对比分析
    $('#compara_btn').children("img").hover(function () {
        $(this).attr("src", "img/LineInspection_play_comparaHover.png")
    }, function () {
        $(this).attr("src", "img/LineInspection_play_compara.png")
    });
    $('#compara_btn').children("img").click(function () {
        Ispaly = false;
        play()
    });
//前后镜头
    $('#shotCut_btn').children("img").toggle(function () {
        $(this).attr("src", "img/LineInspection_play_changeCutClick.png")
        //resetAll();
        AB_SURFACE = 'B';
        layer.msg('切换中...');
        getJson();
        playJudge();
        play();

    }, function () {
        $(this).attr("src", "img/LineInspection_play_changeCut.png")
        //resetAll();
        AB_SURFACE = 'A';
        layer.msg('切换中...');
        getJson();
        playJudge();
        play();
    });
//前一张
    $('#btn_less').children("img").hover(function () {
        $(this).attr("src", "img/LineInspection_play_leftHover.png")
    }, function () {
        $(this).attr("src", "img/LineInspection_play_left.png")
    });
//播放
    $('#btn_play').children("img").hover(function () {
        $(this).attr("src", "img/LineInspection_play_playHover.png")
    }, function () {
        $(this).attr("src", "img/LineInspection_play_play.png")
    });
    $('#btn_play').click(function () {
        
        Ispaly = false;
        play()
    });
            //暂停
    $('#btn_pause').children("img").hover(function () {
        $(this).attr("src", "img/LineInspection_play_stopHover.png")
    }, function () {
        $(this).attr("src", "img/LineInspection_play_stop.png")
    });
    $('#btn_pause').click(function () {
        
        Ispaly = true;
        play()
    });
            //下一张
    $('#btn_next').children("img").hover(function () {
        $(this).attr("src", "img/LineInspection_play_rightHover.png")
    }, function () {
        $(this).attr("src", "img/LineInspection_play_right.png")
    });
            //重播
    $('#btn_repeat').children("img").hover(function () {
        $(this).attr("src", "img/LineInspection_play_replayHover.png")
    }, function () {
        $(this).attr("src", "img/LineInspection_play_replay.png")
    });
            //详细信息
    //$('.LineInspection_details').children("img").hover(function () {
    //    $(this).attr("src", "img/LineInspection_play_DetailsHover.png")
    //}, function () {
    //    $(this).attr("src", "img/LineInspection_play_Details.png")
    //});
    $('.LineInspection_details').children("img").click(function () {
        if ($('.LineInspection_details_inside').css('display') == 'block') {
            $(this).attr("src", "img/LineInspection_play_Details.png")
            $('.LineInspection_details_inside').hide()
        } else {
            $('.LineInspection_details_inside').show()
            $(this).attr("src", "img/LineInspection_play_DetailsHover.png")
        }
    });

    $('.btn_hide').children("img").hover(function () {
        $(this).attr("src", "img/LineInspection_play_DetailsshowHover.png")
    }, function () {
        $(this).attr("src", "img/LineInspection_play_Detailsshow.png")
    });
    $('.btn_hide').children("img").click(function () {
        $('.LineInspection_details').children("img").attr("src", "img/LineInspection_play_Details.png")
        $('.LineInspection_details_inside').hide()
    });
//放大 与否
    $('.LineInspection_Magnifier').children("img").toggle(function () {
        $(this).attr("src", "img/LineInspection_play_MagnifierHover.png")
        $('.zoomContainer').css('display', 'block')
        bigGlass = true;
        if (!$('#DLV_IMG_DIR').hasClass('chooseOne')) {
            $('#F').data('elevateZoom').changeState('enable');
            $('#F').data('elevateZoom').showHideWindow('show');
            $('#F').data('elevateZoom').swaptheimage($('#F').attr('src'), $('#F').attr('src'))
        }
    }, function () {
        $(this).attr("src", "img/LineInspection_play_Magnifier.png")
        $('.zoomContainer').css('display', 'none')
        bigGlass = false;
        $('#F').data('elevateZoom').changeState('disable')
        $('#F').data('elevateZoom').showHideWindow('hide')
    });





    //查询 隐藏
    $('#btn_hideSoBox').click(function () {
        $('#query_btn').children("img").attr("src", "img/LineInspection_play_search.png")
        $('.QueryBuilder').hide()
    });

    //小图点击切换大图
    $('#DLV_IMG_DIR').click(function () {
        bigIMG = 'DLV'
        $('.zoomContainer').css('display', 'none')
        $('#F').attr('src', $('#RED').attr('src'))
    });
    $('#HD_IMG_DIR').click(function () {
        if (bigGlass) {
            $('#F').data('elevateZoom').changeState('enable');
            $('#F').data('elevateZoom').showHideWindow('show');
            $('.zoomContainer').css('display', 'block')
        } 
        bigIMG = 'HD'
        $('#F').data('elevateZoom').swaptheimage($('#HD').attr('src'), $('#HD').attr('src'))
    });
    $('#OVER_IMG_DIR').click(function () {
        bigIMG = 'OVER'
        if (bigGlass) {
            $('#F').data('elevateZoom').changeState('enable');
            $('#F').data('elevateZoom').showHideWindow('show');
            $('.zoomContainer').css('display', 'block')
        }
        $('#F').data('elevateZoom').swaptheimage($('#OVER').attr('src'), $('#OVER').attr('src'))
    });

})

//更新结果集
function Newquery() {
   // layer.msg('加载中', { icon: 16 });
    if (judgeAnswer) {
        //重置页面
        Ispaly = false;
        resetAll();
        number++;
        var urlObj = GetRequest();
        var id = urlObj.id;
        var dirct = "";//行别
        if ($('#direction').val() != 0) {
            dirct = $('#direction').val()
        }
        var _url = '/c3/pc/lineinspection/remotehandlers/getlineinspectionlist.ashx?action=video' 
        + '&id=' + id
        + '&pageIndex=' + pageIndex
        + '&pageSize=' + pageSize
        + '&DIRECTION=' + dirct
        + '&AB_SURFACE=' + AB_SURFACE
        $.ajax({
            url: _url,
            async: false,
            cache: false,
            success: function (re) {
                if (re != '' && re != undefined && re.data.length != 0) {
                    nodata = false;
                    jsonPlay = re;
                    ParamSetting(jsonPlay);//参数设置
                    Setslider(Sumcount);
                    //$('#btn_pause').css('display', 'none');
                    //$('#btn_play').css('display', 'block');
                    //play();
                }
                else {
                    nodata = true;
                    console.log(re)
                    layer.msg('暂无数据！');
                    $('#F').attr({ 'src':'img/bg.jpg'})
                    $('#RED').attr({ 'src': 'img/bg.jpg' })
                    $('#HD').attr({ 'src': 'img/bg.jpg' })
                    $('#OVER').attr({ 'src': 'img/bg.jpg' })
                }
            }
        })
    }
};


//筛选按钮
function screenBtn() {
    layer.msg('加载中', { icon: 16 });
    if (judgeAnswer) {
        //行别发生变化
        if (directChange) {
            directChange = false;
            // 执行初始化 更新结果集
            Newquery();
        };
        //判断新的结果查到没有
        if (!nodata) {
            number++;
            time_speed = $('#playSpeed').val();
            if (time_speed == '') {
                time_speed = 300;
            }
            var urlObj = GetRequest();
            var id = urlObj.id;
            var sTime = $('#startTime').val(); //开始时间
            var eTime = $('#endTime').val();  //结束时间
            var kmStart = $('#kmStart').val();  //开始公里标
            //var kmEnd = $('#kmEnd').val();  //结束公里标
            //var positioncode = $('#LineTreeselect').val();  //区间code
            var positioncode = $('#LineTreeselect').attr('code');  //区间code
            if (positioncode == null || positioncode == 0 || positioncode == undefined) {
                positioncode = '';
            }
            var dirct = "";//行别
            if ($('#direction').val() != 0) {
                dirct = escape($('#direction').val())
            }

            var polNumber = '';
            if ($('#polNumber').val() != undefined && $('#polNumber').val() != '') {
                polNumber = $('#polNumber').val()
            }
            var _url = '/c3/pc/lineinspection/remotehandlers/getlineinspectionlist.ashx?action=location'
            + '&id=' + id
            + '&pole_no=' + polNumber
            + '&DIRECTION=' + dirct
            + '&starttime=' + sTime
            + '&endtime=' + eTime
            + '&AB_SURFACE=' + AB_SURFACE
            + '&startKM=' + kmStart
            //+ '&endKM=' + kmEnd
            + '&positioncode=' + positioncode
            $.ajax({
                url: _url,
                async: false,
                cache: false,
                success: function (re) {
                    if (re != '' && re != undefined && re != '-1' && re != '0') {

                       // Ispaly = true;
                        sliderNumber = parseInt(re)-1
                        pageIndex = parseInt(sliderNumber / pageSize) + 1
                        getJson();
                        playJudge();
                        play();
                    }
                    else {
                        Ispaly = false;
                        layer.msg('暂无数据！');
                        $('#F').attr({ 'src': 'img/bg.jpg' })
                        $('#RED').attr({ 'src': 'img/bg.jpg' })
                        $('#HD').attr({ 'src': 'img/bg.jpg' })
                        $('#OVER').attr({ 'src': 'img/bg.jpg' })
                    }
                }
            })
        }
   }
};

//验证时间
function dojudge() {
    if ($('#startTime').val() != '' && $('#endTime').val() != '') {
        if ($('#startTime').val() >= $('#endTime').val()) {
            layer.msg('时间输入有误！')
            judgeAnswer = false
        } else {
            judgeAnswer = true
        }
    } else {
        judgeAnswer = true
    }
    DoKmjudge();
};


//验证大小判断
function DoKmjudge() {
    if ($('#kmStart').val() != '' && $('#kmEnd').val() != '') {
        if (parseInt($('#kmStart').val()) > parseInt($('#kmEnd').val())) {
            layer.tips('请输入更大的数', '#kmEnd', { tips: [1, '#3595CC'] });
            judgeAnswer = false
        } else {
            judgeAnswer = true
        }
    } else {
        judgeAnswer = true
    }
}
        //控制条
$(function () {


    //前一帧
    $('#btn_less').children("img").click(function () {
        $('#btn_play').css('display', 'none');
        $('#btn_pause').css('display', 'block');
        Ispaly = false;
        //play();
        sliderNumber--;//进度
        //console.log(sliderNumber)
        if (sliderNumber < 0) {
            sliderNumber = 0
        }
        if (AB_SURFACE == "A") {
            if (sumArrayA[sliderNumber] == undefined) {
                pageIndex--;
                getJson();
            }
        } else if (AB_SURFACE == "B") {
            if (sumArrayB[sliderNumber] == undefined) {
                pageIndex--;
                getJson();
            }
        }
        clearTimeout(t)
        playJudge()
    });

    //后一帧
    $('#btn_next').children("img").click(function () {
        $('#btn_play').css('display', 'none');
        $('#btn_pause').css('display', 'block');
        Ispaly = false;
        //play()
        sliderNumber++;//进度

        if (sliderNumber >= Sumcount) {
            sliderNumber = Sumcount
        }
        playJudge()


    });

    //重放
    $('#btn_repeat').children("img").click(function () {
        Ispaly = true;
        sliderNumber = 0;//进度
        slider.slider("value", sliderNumber)
        pageIndex = 1;
        getJson ()
        clearTimeout(t)
        play();
        //清除echarts
        clearEcharts()
    })



});

//播放位置判断
function playJudge() {
    layer.closeAll();

        if (sliderNumber+1  >= count) {
            //当前页是否为最后一页
            if (pageIndex >= sumPage) {
                //sliderNumber++;
                Ispaly = false;
                slider.slider("value", count)
                clearTimeout(t)
                $('#_Content_Pecent_Lab').html(sliderNumber + '/' + (Sumcount - 1))
                //clearInterval(inerval)//最后一页  就停止播放
                $('#btn_play').css('display', 'none');
                $('#btn_pause').css('display', 'block');
                return false;
            } else {
                pageIndex += 1;
                getJson()//下一页
                if (AB_SURFACE == 'A') {
                    preLoadImg(sumArrayA[sliderNumber].DLV_IMG_DIR)
                    preLoadImg(sumArrayA[sliderNumber].HD_IMG_DIR)
                    preLoadImg(sumArrayA[sliderNumber].OVER_IMG_DIR)
                } else if (AB_SURFACE == 'B') {
                    preLoadImg(sumArrayB[sliderNumber].DLV_IMG_DIR)
                    preLoadImg(sumArrayB[sliderNumber].HD_IMG_DIR)
                    preLoadImg(sumArrayB[sliderNumber].OVER_IMG_DIR)
                };
                if (CompleteImgNum >= 3) {
                    CompleteImgNum = 0;
                    BroadcastPace(sliderNumber);
                }
            }
        } else {

            BroadcastPace(sliderNumber);
           

        }
   
};
            //dom操作
function doHtml(sliderNumber) {
    var f = $('#F').data('elevateZoom');
    if (AB_SURFACE == 'A') {
        switch (bigIMG) {
            case 'OVER':
                $('#F').attr({ 'src': sumArrayA[sliderNumber].OVER_IMG_DIR });
                var imgurl = sumArrayA[sliderNumber].OVER_IMG_DIR;
                if (bigGlass) {
                    $('.zoomContainer').css('display', 'block')
                    f.swaptheimage(imgurl, imgurl);
                    f.changeState('enable');
                    f.showHideWindow('show');
                } else {
                    f.changeState('disable')
                    f.showHideWindow('hide')
                    $('.zoomContainer').css('display', 'none')
                };
                break;
            case 'HD':
                $('#F').attr({ 'src': sumArrayA[sliderNumber].HD_IMG_DIR });
                var imgurl = sumArrayA[sliderNumber].HD_IMG_DIR;
                if (bigGlass) {
                    $('.zoomContainer').css('display', 'block')
                    f.swaptheimage(imgurl, imgurl);
                    f.changeState('enable');
                    f.showHideWindow('show');
                } else {
                    f.changeState('disable')
                    f.showHideWindow('hide')
                    $('.zoomContainer').css('display', 'none')

                };
                break;
            case 'DLV':
                $('#F').attr({ 'src': sumArrayA[sliderNumber].DLV_IMG_DIR });
                f.showHideWindow('hide')
                $('.zoomContainer').css('display', 'none')
                break;
        }
            
      
        //f.swaptheimage(imgurl, imgurl);
       
        $('#RED').attr({ 'src': sumArrayA[sliderNumber].DLV_IMG_DIR })
        $('#HD').attr({ 'src': sumArrayA[sliderNumber].HD_IMG_DIR })
        $('#OVER').attr({ 'src': sumArrayA[sliderNumber].OVER_IMG_DIR })
        $('#location').html(sumArrayA[sliderNumber].LOCATION)
        $('#timer').html(sumArrayA[sliderNumber].INSPECT_TIME)
        $('#deviceID').html(sumArrayA[sliderNumber].LOCOMOTIVE_CODE)
        $('#bowLocation').html(sumArrayA[sliderNumber].BOWLOC)
        sumArrayA[sliderNumber].HVALUE == '-1000' ? $('#topValue').html('') : $('#topValue').html(sumArrayA[sliderNumber].HVALUE + 'mm')
        sumArrayA[sliderNumber].PVALUE == '-1000' ? $('#outValue').html('') : $('#outValue').html(sumArrayA[sliderNumber].PVALUE + 'mm')
        $('#carSpeed').html(sumArrayA[sliderNumber].SPEED + 'km/h')
        $('#_Content_Sta_Lab').html(sumArrayA[sliderNumber].LOCATION)
        //$('#_Content_end_Lab').html(sumArrayA[sliderNumber].INSPECT_TIME)
    } else if (AB_SURFACE == 'B') {
        var f = $('#F').data('elevateZoom');
        switch (bigIMG) {
            case 'OVER':
                $('#F').attr({ 'src': sumArrayB[sliderNumber].OVER_IMG_DIR });
                var imgurl = sumArrayB[sliderNumber].OVER_IMG_DIR;
                if (bigGlass) {
                    $('.zoomContainer').css('display', 'block')
                    f.swaptheimage(imgurl, imgurl);
                    f.changeState('enable')
                    f.showHideWindow('show')
                } else {
                    f.changeState('disable')
                    f.showHideWindow('hide')
                    $('.zoomContainer').css('display', 'none')

                };
                break;
            case 'HD':
                $('#F').attr({ 'src': sumArrayB[sliderNumber].HD_IMG_DIR });
                var imgurl = sumArrayB[sliderNumber].HD_IMG_DIR;
                if (bigGlass) {
                    $('.zoomContainer').css('display', 'block')
                    f.swaptheimage(imgurl, imgurl);
                    f.changeState('enable')
                    f.showHideWindow('show')
                } else {
                    f.changeState('disable')
                    f.showHideWindow('hide')
                    $('.zoomContainer').css('display', 'none')
                };
                break;
            case 'DLV':
                $('#F').attr({ 'src': sumArrayB[sliderNumber].DLV_IMG_DIR });
                f.showHideWindow('hide')
                $('.zoomContainer').css('display', 'none')
                break;
        }

        
        
        $('#RED').attr({ 'src': sumArrayB[sliderNumber].DLV_IMG_DIR })
        $('#HD').attr({ 'src': sumArrayB[sliderNumber].HD_IMG_DIR })
        $('#OVER').attr({ 'src': sumArrayB[sliderNumber].OVER_IMG_DIR })
        $('#location').html(sumArrayB[sliderNumber].LOCATION)
        $('#timer').html(sumArrayB[sliderNumber].INSPECT_TIME)
        $('#deviceID').html(sumArrayB[sliderNumber].LOCOMOTIVE_CODE)
        $('#bowLocation').html(sumArrayB[sliderNumber].BOWLOC)
        sumArrayB[sliderNumber].HVALUE == '-1000' ? $('#topValue').html('') : $('#topValue').html(sumArrayB[sliderNumber].HVALUE + 'mm')
        sumArrayB[sliderNumber].PVALUE == '-1000' ? $('#outValue').html('') : $('#outValue').html(sumArrayB[sliderNumber].PVALUE + 'mm')
        $('#carSpeed').html(sumArrayB[sliderNumber].SPEED + 'km/h')
        $('#_Content_Sta_Lab').html(sumArrayB[sliderNumber].LOCATION)
       // $('#_Content_end_Lab').html(sumArrayB[sliderNumber].INSPECT_TIME)
    };
    $('#_Content_Pecent_Lab').html(sliderNumber + '/' + (Sumcount - 1))
};

//播放进度条 
function Setslider(count) {
    slider = $("#Sms_slider").slider({
        range: "min",
        value: sliderNumber+1,
        min: 0,
        max: count,
        slide: function (event, ui) {
            //change = true;//拖动状态
            sliderNumber = ui.value; //当前帧数
            pageIndex = parseInt(sliderNumber / pageSize) + 1;//根据进度位置计算所在页
            //console.log(pageIndex)
            getJson()
            //layer.msg('加载中...')
            layer.msg('加载中...', { time:1000});
            BroadcastPace(sliderNumber)
        }
    });
};







                //echarts 实例化

function createLineChart() {

    myChart1 = echarts.init(document.getElementById('main1'));
    myChart2 = echarts.init(document.getElementById('main2'));
    myChart3 = echarts.init(document.getElementById('main3'));

    var xTitle = [];//X轴
    option1 = {

        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                var res;
                console.log(params[0])
                if (params[0].name == '') {
                    params[0].name = 0
                }
                if (AB_SURFACE == 'A') {
                    if (sumArrayA[params[0].name].POLE_NUMBER == undefined) {
                        res = '';
                    } else {
                        res = sumArrayA[params[0].name].POLE_NUMBER + '号杆' + sumArrayA[params[0].name].FRAME_NO + '帧<br/>'
                    }
                    res += params[0].seriesName + ':' + params[0].data + '℃';
                } else if (AB_SURFACE == 'B') {
                    if (sumArrayB[params[0].name].POLE_NUMBER == undefined) {
                        res = '';
                    } else {
                        res = sumArrayB[params[0].name].POLE_NUMBER + '号杆' + sumArrayB[params[0].name].FRAME_NO + '帧<br/>'
                    }
                    res += params[0].seriesName + ':' + params[0].data + '℃';
                };
                return res;

            }

        },
        dataZoom: [{
            type: 'inside',
            show: true,
            realtime: true,
            start: 0,
            end: 100,
            xAxisIndex: 0
        }, {
            start: 0,
            end: 100,
            show: false,
        }],
        grid: {
            y: '35',
            y2: '10',
            x: '40',
            x2: '10',
            borderColor: 'black'
        },
        xAxis:
        {
            type: 'category',
            axisLabel: {
                show: false
            },
            splitLine: {
                show: false
            },
            axisLine: {
                show: false
            },
            data: []
        }
        ,
        yAxis: [
    {
        axisLine: { show: true, lineStyle: { color: 'white', width: 0 } },
        axisLabel: {
            textStyle: {
                color: 'white'
            }
        },
        type: 'value',
        splitLine: {
            show: true, lineStyle: {
                type: 'dashed'
            }
        },
        name: '温度(℃)',
        
    }
        ],
        series:
    {
        name: '温度',
        type: 'line',
        symbolSize: 4,
        hoverAnimation: true,
        data: []


    }
    };

    option2 = {

        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                var res;
                console.log(params[0])
                if (params[0].name == '') {
                    params[0].name = 0
                }
                if (AB_SURFACE == 'A') {
                    if (sumArrayA[params[0].name].POLE_NUMBER == undefined) {
                        res = '';
                    } else {
                        res = sumArrayA[params[0].name].POLE_NUMBER + '号杆' + sumArrayA[params[0].name].FRAME_NO + '帧<br/>'
                    }
                    res += params[0].seriesName + ':' + params[0].data + 'mm';
                } else if (AB_SURFACE == 'B') {
                    if (sumArrayB[params[0].name].POLE_NUMBER == undefined) {
                        res = '';
                    } else {
                        res = sumArrayB[params[0].name].POLE_NUMBER + '号杆' + sumArrayB[params[0].name].FRAME_NO + '帧<br/>'
                    }
                    res += params[0].seriesName + ':' + params[0].data + 'mm';
                };
                return res;

            }

        },
        grid: {
            y: '35',
            y2: '10',
            x: '40',
            x2: '10',
            borderColor: 'black'
        },
        dataZoom: [{
            type: 'inside',
            show: true,
            realtime: true,
            start: 0,
            end: 100,
            xAxisIndex: 0
        }, {
            start: 0,
            end: 100,
            show: false,
        }],
        xAxis:
        {
            type: 'category',
            axisLabel: {
                show: false
            },
            splitLine: { show: false },
            axisLine: { show: false },
            data: []
        }
    ,
        yAxis:
    {
        axisLine: { show: true, lineStyle: { color: 'white', width: 0 } },
        axisLabel: {
            textStyle: {
                color: 'white'
            }
        },
        type: 'value',
        splitLine: { show: true, lineStyle: { type: 'dashed' } },
        name: '拉出值(mm)',
       
    }
    ,
        series:
    {
        name: '拉出值',
        type: 'line',
        symbolSize: 4,
        hoverAnimation: true,
        data: []


    }
    };

    option3 = {

        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                var res;
                if (params[0].name == '') {
                    params[0].name = 0
                }
                console.log(params[0])
                if (AB_SURFACE == 'A') {
                    if (sumArrayA[params[0].name].POLE_NUMBER == undefined) {
                        res = '';
                    } else {
                        res = sumArrayA[params[0].name].POLE_NUMBER + '号杆' + sumArrayA[params[0].name].FRAME_NO + '帧<br/>'
                    }
                    res += params[0].seriesName + ':' + params[0].data + 'mm';
                } else if (AB_SURFACE == 'B') {
                    if (sumArrayB[params[0].name].POLE_NUMBER == undefined) {
                        res = '';
                    } else {
                        res = sumArrayB[params[0].name].POLE_NUMBER + '号杆' + sumArrayB[params[0].name].FRAME_NO + '帧<br/>'
                    }
                    res += params[0].seriesName + ':' + params[0].data + 'mm';
                };
                return res;
            }
        },
        dataZoom: [{
            type: 'inside',
            realtime: true,
            start: 0,
            end: 100,
            xAxisIndex: 0
        }, {
            start: 0,
            end: 100, height: 20,x:80,y:3,
            color: 'red',
            show: false,
        }]
           ,
        grid: {
            y: '35',
            y2: '25',
            x: '45',
            x2: '10',
            borderColor: 'black'
        },
        xAxis:
{
    type: 'category',
    axisLabel: {
        show: true, textStyle: {
            color: 'white'
        }
    },
    splitLine: {
        show: false
    },
    axisTick: {
        inside: false, onGap: false
    },
    boundaryGap: true,
    data: []
},
               
        yAxis:
        {
            name: '导高值(mm)',
            axisLine: {
                show: true, lineStyle: {
                    color: 'white', width: 0
                }
            },
            axisLabel: {
                textStyle: {
                    color: 'white'
                }
            },
            type: 'value',
            splitLine: {
                show: true, lineStyle: {
                    type: 'dashed'
                }
            },
            boundaryGap: [0, '100%'],

            max: 7000,
            min: 5000,
            scale:true,

        }
            ,
        series:
    {
        name: '导高值',
        type: 'line',
        symbolSize: 4,
        hoverAnimation: true,
        data: []

    }
    };






    //myChart1.group = 'g2';
    //myChart3.group = 'g2';
    //echarts.connect('g2');
    ////表关联


    //myChart1.group = 'g1';
    //myChart2.group = 'g1';
    //myChart3.group = 'g1';
    //echarts.connect('g1');

    //myChart2.connect([myChart1, myChart3]);
    //myChart3.connect([myChart1, myChart2]);

    //echarts.connect([myChart2, myChart1]);
    //  echarts.connect([myChart1, myChart3]);
    //echarts.connect([myChart3, myChart2]);
    //实例化
    myChart1.setOption(option1);
    myChart2.setOption(option2);
    myChart3.setOption(option3);
    echarts.connect([myChart1, myChart2, myChart3]);
    //myChart2.connect([myChart1, myChart3]);
    //myChart3.connect([myChart1, myChart2]);
    //myChart1.connect([myChart3, myChart2]);
    myChart1.on('click', function (params) { eConsole(params) })
    myChart2.on('click', function (params) { eConsole(params) })
    myChart3.on('click', function (params) { eConsole(params) })

};

//点击事件执行的方法
function eConsole(params) {
    Ispaly = false;
    ehcartsClick = true;
    console.log(params.name)
    sliderNumber = params.name
    playJudge()

    ehcartsClick = false;
}


function play() {
    clearTimeout(t)
    imgReady()
};

                                //播放进度控制
function BroadcastPace(sliderNumber) {
    slider.slider("value", sliderNumber)
    doHtml(sliderNumber)//页面操作
    if (!ehcartsClick) {
        addMychartData(sliderNumber)
    }
    

};
                    //动态加入数据echarts
function addMychartData(sliderNumber) {
    //option1.xAxis.data.push(sliderNumber);
    if (AB_SURFACE == 'A') {
        //console.log(option3.xAxis.data)
        if (option1.series.data.length > 20) {
            option1.series.data.splice(0, 1)
            option2.series.data.splice(0, 1)
            option3.series.data.splice(0, 1)
            option1.xAxis.data.splice(0, 1)
            option2.xAxis.data.splice(0, 1)
            option3.xAxis.data.splice(0, 1)
        }
        option1.series.data.push(sumArrayA[sliderNumber].MXIRTEMP);
        if (sumArrayA[sliderNumber].PVALUE == '-1000') {
            option2.series.data.push('');
        } else {
            option2.series.data.push(sumArrayA[sliderNumber].PVALUE);
        }
        //option2.series.data.push(sumArrayA[sliderNumber].PVALUE);
        if (sumArrayA[sliderNumber].HVALUE == '-1000') {
            option3.series.data.push('');
        } else {
            option3.series.data.push(sumArrayA[sliderNumber].HVALUE);
        }
        
    } else if (AB_SURFACE == 'B') {
        if (option1.series.data.length > 20) {
            option1.series.data.splice(0, 1)
            option2.series.data.splice(0, 1)
            option3.series.data.splice(0, 1)
            option1.xAxis.data.splice(0, 1)
            option2.xAxis.data.splice(0, 1)
            option3.xAxis.data.splice(0, 1)
        }
        option1.series.data.push(sumArrayB[sliderNumber].MXIRTEMP);
        if (sumArrayB[sliderNumber].PVALUE == '-1000') {
            option2.series.data.push('');
        } else {
            option2.series.data.push(sumArrayB[sliderNumber].PVALUE);
        }
        //option2.series.data.push(sumArrayB[sliderNumber].PVALUE);
        if (sumArrayB[sliderNumber].HVALUE == '-1000') {
            option3.series.data.push('');
        } else {
            option3.series.data.push(sumArrayB[sliderNumber].HVALUE);
        }
    };
    option1.xAxis.data.push(sliderNumber);
    option2.xAxis.data.push(sliderNumber);
    option3.xAxis.data.push(sliderNumber);
    myChart1.setOption(option1);
    myChart2.setOption(option2);
    myChart3.setOption(option3);






    //另一种方法  暂时不行
    //myChart1.setOption({
    //    xAxis: {
    //        data: sliderNumber
    //    },
    //    series: [{
    //        // 根据名字对应到相应的系列
    //        name: '温度',
    //        data: sumArrayA[sliderNumber].MXIRTEMP
    //    }]

    //})
    ;
};



    //预加载图片
function preLoadImg(url) {
    var img = new Image();
    img.src = url;
    img.onload = function () {
        CompleteImgNum++;
    }
    //img.onerror = function (){
    //    CompleteImgNum='aaa';
    //}

};

                //图片加载完成播放下一帧
function imgReady() {
    if (AB_SURFACE == 'A') {
        //console.log(sliderNumber)
        //console.log('count'+count)
        //console.log('pageIndex'+pageIndex)
        //console.log('sumPage' + sumPage)
        if (sumArrayA!=undefined) {
            preLoadImg(sumArrayA[sliderNumber].DLV_IMG_DIR)
            preLoadImg(sumArrayA[sliderNumber].HD_IMG_DIR)
            preLoadImg(sumArrayA[sliderNumber].OVER_IMG_DIR)
        };
    } else if (AB_SURFACE == 'B') {
        if (sumArrayB != undefined) {
            preLoadImg(sumArrayB[sliderNumber].DLV_IMG_DIR)
            preLoadImg(sumArrayB[sliderNumber].HD_IMG_DIR)
            preLoadImg(sumArrayB[sliderNumber].OVER_IMG_DIR)
        }
    };
    t = setTimeout(function () {
        if (CompleteImgNum >= 3) {
            CompleteImgNum = 0;
            if (Ispaly) {
                $('#btn_pause').css('display', 'none');
                $('#btn_play').css('display', 'block');//播放
                sliderNumber++;
                playJudge()
                imgReady()
            } else { 
                $('#btn_pause').css('display', 'block');
                $('#btn_play').css('display', 'none');// 暂停
                //playJudge()
                //imgReady()
            }
        } else {
            setTimeout(
               ' imgReady()'
            , time_speed)
        }
    }, time_speed)
};
                   //图片加载完成跳下一帧单个
//function imgReadyOne() {
//    if (Ispaly) {
//        $('#btn_pause').css('display', 'none');
//        $('#btn_play').css('display', 'block');//播放
//    } else {
//        $('#btn_pause').css('display', 'block');
//        $('#btn_play').css('display', 'none');// 暂停
//    };
//    if (AB_SURFACE == 'A') {
//        preLoadImg(sumArrayA[sliderNumber].DLV_IMG_DIR)
//        preLoadImg(sumArrayA[sliderNumber].HD_IMG_DIR)
//        preLoadImg(sumArrayA[sliderNumber].OVER_IMG_DIR)
//    } else if (AB_SURFACE == 'B') {
//        preLoadImg(sumArrayB[sliderNumber].DLV_IMG_DIR)
//        preLoadImg(sumArrayB[sliderNumber].HD_IMG_DIR)
//        preLoadImg(sumArrayB[sliderNumber].OVER_IMG_DIR)
//    };
//    if (CompleteImgNum >= 3) {
//        CompleteImgNum = 0;
//        BroadcastPace(sliderNumber)
//    }
//};

        //清空echarts
function clearEcharts() {
    option1.series.data = [];
    option2.series.data = [];
    option3.series.data = [];
    option1.xAxis.data = [];
    option2.xAxis.data = [];
    option3.xAxis.data = [];
    myChart1.setOption(option1);
    myChart2.setOption(option2);
    myChart3.setOption(option3);

};






