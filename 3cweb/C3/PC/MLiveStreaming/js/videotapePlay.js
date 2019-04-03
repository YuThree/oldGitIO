/*========================================================================================*
* 功能说明：线路巡检播放页
* 注意事项：
* 作    者： ybc
* 版本日期：2016年9月20日
* 变更说明：
* 版 本 号： V1.0.0

*=======================================================================================*/
var time_speed = 500;//播放速度
var downImg_speed = 50;//图片下载速度
var pageIndex = 1;//初始播放内容页
var sumPage = 0;//播放总页数
var Ispaly = true;//播放  默认开启
var t; //定时器
var number = 0;//请求第几次 第一次设置数组长度
var slider;//播放进度条
var sliderNumber = 0;//进度值
var jsonPlay;//json数据
var count = 0;//进度条最大值
var Sumcount = 100;//进度条最大值really
var sumArrayA;//总数组A
var sumArrayB;//总数组B

var public_i// 毫秒
var public_m;//秒 
var public_j;//分钟 
var public_h;//小时 
var public_d//天 
var public_mo;//月
var public_y;//年 
var carcode//车号
var BowPosition//弓位置
var cargallery //图片通道
var playId//当前播放ID
//class 
var IRclass = '.videotape-right-IR';
var VIclass = '.videotape-right-VI';
var OABclass = '.videotape-right-OAB';
var FZclass = '.videotape-right-FZ';


//进度展示
var IRNow  = '';

//请求改变参数 同一次任务请求次数
var requestNumber = 0;

//图片加载成功否  最少一张
var imgreadyAnyone = false;

//弓位置页面HTML
var BowPosition_html = '';
//默认播放弓  第一个
var Bowclick = 0;
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

    //切换大图
    $(".videotape-right>div>img").click(function () {
        $('.videotape-left-play img').attr('src', $(this).attr('src'))
    })


});

//*********************************初始数据获取*****************************************//


//获取url数据


//控制俺牛
$(function () {


    //前一帧
    $('#btn_less').children("img").click(function () {
        $('#btn_play').css('display', 'none');
        $('#btn_pause').css('display', '');
        Ispaly = false;
        //play();
        sliderNumber--;//进度
        console.log(sliderNumber)
        if (sliderNumber < 0) {
            sliderNumber = 0
        }
        imgJudge()
        sildbarShow()
        //clearTimeout(t)
    });

    //后一帧
    $('#btn_next').children("img").click(function () {
        $('#btn_play').css('display', 'none');
        $('#btn_pause').css('display', '');
        Ispaly = false;
        //play()
        sliderNumber++;//进度

        if (sliderNumber >= Sumcount) {
            sliderNumber = Sumcount
        }
        imgJudge()
        sildbarShow()
    });

    //重放
    $('#btn_repeat').children("img").click(function () {
        Ispaly = true;
        sliderNumber = 0;//进度
        sildbarShow()
        clearTimeout(t)
        play();
    })



});

//播放ajax
function sildenumberQueryAjax(id) {
    requestNumber++;
    var _url = '/c3/pc/mlivestreaming/remotehandlers/vediorecorder.ashx?action=playquery&TaskID=' + id
    $.ajax({
        url: _url,
        async: true,
        cache: false,
        success: function (re) {
            if (re != '' && re != undefined) {

                //layer.closeAll();
                
                //console.log(BowPosition_html)
                if (requestNumber == 1) {
                    imgreadyAnyone = false;//首图加载成功
                    BowPosition_html = '';//清空弓位置下拉内容
                    for (var k = 0; k < re.data.length; k++) {
                        k == Bowclick ? BowPosition_html += '<a href="#" style="color:#3dd5f1"><strong>' + re.data[k].BowPositionNumber + '</strong>车</a>' : BowPosition_html += '<a href="#"><strong>' + re.data[k].BowPositionNumber + '</strong>车</a>'
                    }
                    //获取弓位置
                    $('.Gwz-droup-content').html(BowPosition_html)
                    $('.Gwz-droup-content a').click(function () {
                        requestNumber = 0;
                        Bowclick = $(this).index()
                        //alert(Bowclick)
                        sildenumberQueryAjax(id)
                    })
                    downImg_speed = parseInt(re.data[Bowclick].TIME_DELAY);// 毫秒
                    public_m = parseInt(re.data[Bowclick].RECORD_STARTDATE_Second);//秒 
                    public_j = parseInt(re.data[Bowclick].RECORD_STARTDATE_Minute);//分钟 
                    public_h = parseInt(re.data[Bowclick].RECORD_STARTDATE_HOUR);//小时 
                    public_d = parseInt(re.data[Bowclick].RECORD_STARTDATE_DAY);//天 
                    public_mo = parseInt(re.data[Bowclick].RECORD_STARTDATE_MONTH);//月
                    public_y = parseInt(re.data[Bowclick].RECORD_STARTDATE_YEAR);//年 
                    carcode = re.data[Bowclick].LOCOMOTIVE_CODE;//车号
                    BowPosition = re.data[Bowclick].BowPosition1;//弓位置 全局
                    Sumcount = parseInt(parseInt(re.data[Bowclick].TIME_DIFFERENCE) / downImg_speed);
                    //console.log(Sumcount)
                    //进度条设置上限
                    $('#_Content_Sta_Lab').html(re.data[Bowclick].TITLE + '&ensp;' + re.data[Bowclick].RECORD_STARTDATE + '—' + re.data[Bowclick].RECORD_ENDDATE)
                    Setslider(Sumcount)
                    //初始
                    sliderNumber = 0;
                    Ispaly = true;
                    play()
                }
                $('.IR_time').html( re.data[Bowclick].CompletedDate_IR )
                $('.VI_time').html( re.data[Bowclick].CompletedDate_Detail )
                $('.OAB_time').html(re.data[Bowclick].CompletedDate_panorama )
                $('.FZ_time').html( re.data[Bowclick].CompletedDate_Aux )
                count = parseInt(GetDateDiff(re.data[0].RECORD_STARTDATE, re.data[0].Max_Date, 'ms') / downImg_speed);
                //console.log(parseInt(GetDateDiff(re.data[0].RECORD_STARTDATE, re.data[0].Max_Date, 'ms')))
                //console.log(re.data[0].Max_Date, re.data[0].RECORD_STARTDATE)
                console.log(id)

                console.log(re)
            }
        }
    })

}


//获取时间差
function GetDateDiff(startTime, endTime, diffType) {
    startTime = startTime.replace(/\-/g, "/"); endTime = endTime.replace(/\-/g, "/"); diffType = diffType.toLowerCase(); var sTime = new Date(startTime); var eTime = new Date(endTime); var divNum = 1; switch (diffType) {
        case "ms":
            divNum = 1; break;
        case "second":
            divNum = 1000; break; case "minute":
                divNum = 1000 * 60; break; case "hour":
                    divNum = 1000 * 3600; break; case "day":
                        divNum = 1000 * 3600 * 24; break; default: break;
    }
    return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(divNum));
}

//播放进度条 
function Setslider(count) {
    slider = $("#Sms_slider").slider({
        range: "min",
        value: sliderNumber + 1,
        min: 0,
        max: count,
        slide: function (event, ui) {
            //layer.msg('加载中...', { time: 100000 });
            //$(".layui-layer-content").css({ 'backgroundColor': 'white', 'color': 'black' });
            sliderNumber = ui.value; //当前帧数
            console.log(ui.value)
            imgJudge();
            sildbarShow();
            
        }
    });
};

function play() {
    clearTimeout(t)
    imgReady()
};



//各通道图片加载
function preLoadImgAux(url, name) {
    var img = new Image();
    img.src = url;
    img.onload = function () {
        $(name).children('img').attr('src', url);
        if ($(name).hasClass('videotape-right-border')) {
            $('.videotape-left-play img').attr('src', url);
        }
        imgreadyAnyone = true;
    }
    img.onerror = function () {
        $(name).children('img').attr('src', '/C3/PC/LineInspection/img/bg.jpg');
        if ($(name).hasClass('videotape-right-border')) {
            $('.videotape-left-play img').attr('src', '/C3/PC/LineInspection/img/bg.jpg');
        }
    }

};


//预加载图片
function changeImg(a, b, c, d) {
    preLoadImgAux(a, IRclass);
    preLoadImgAux(b, VIclass);
    preLoadImgAux(c, OABclass);
    preLoadImgAux(d, FZclass);
};

//图片加载完成播放下一帧
function imgReady() {

    t = setTimeout(function () {
        if (Ispaly) {
            $('#btn_pause').css('display', 'none');
            $('#btn_play').css('display', '');//播放
            sliderNumber++;
            //如果当前进度大于已生成进度 暂停 2秒后请求新进度
            if (sliderNumber >= count) {
                Ispaly = false;
                sliderNumber = count
                if (count < Sumcount) {
                    //2秒后再次请求
                    setTimeout(function () {
                        sildenumberQueryAjax(playId)
                        Ispaly = true;
                        play();
                    }, 2000)
                }
            };
           // imgreadyAnyone = false;
            imgJudge()
            if (requestNumber == 1 ) {
                if (imgreadyAnyone==false){
                    sliderNumber--;
                }
            } 
            sildbarShow()
            imgreadyAnyone = false
            imgReady()
            
        } else {
            $('#btn_pause').css('display', '');
            $('#btn_play').css('display', 'none');// 暂停
            //playJudge()
            imgReady()
        }
    }, time_speed)
};


//进度显示
function sildbarShow() {
    sliderNumber = sliderNumber < 0 ? 0 : sliderNumber;
    slider.slider("value", sliderNumber)
    $('#_Content_Pecent_Lab').html( IRNow+' ('+sliderNumber + '/' + Sumcount+')')
}

//根据进度拼图片url
function imgJudge() {
    var i = 0;// 毫秒
    var m = public_m;//秒
    var j = public_j;//分钟
    var h = public_h;//小时
    var d = public_d;//天
    var mo = public_mo;//月
    var y = public_y;//年
    var ms;// 毫秒
    var sec //秒
    var min;//分钟
    var hour;//小时
    var day;//天
    var mouth;//月
    var year;//年

    i = +sliderNumber * downImg_speed
    if (i >= 1000) {
        m += parseInt(i / 1000);
        i = i % 1000;
    }
    if (m >= 60) {
        j += parseInt(m / 60);
        m = m % 60;
    }
    if (j >= 60) {
        h += parseInt(j / 60);
        j = j % 60;
    }
    if (h >= 24) {
        d = parseInt(h / 24);
        h = h % 24;
    }



    if (mo == 1 || mo == 3 || mo == 5 || mo == 7 || mo == 8 || mo == 10 || mo == 12) {
        if (d == 32) {
            d = 1;
            mo += 1;
        }
    } else if (mo == 4 || mo == 6 || mo == 9 || mo == 11) {
        if (d == 31) {
            d = 1;
            mo += 1;
        }
    } else if (mo == 2) {
        if (y % 4 == 0) {
            if (y % 100 == 0 && y % 400 != 0) {
                if (d == 29) {
                    d = 1;
                    mo += 1;
                }
            } else {
                if (d == 30) {
                    d = 1;
                    mo += 1;
                }
            }

        } else {
            if (d == 29) {
                d = 1;
                mo += 1;
            }
        }
    }
    if (mo == 13) {
        mo = 1;
        y += 1;
    }
    //转换字符转 toString
    year = y;
    mouth = mo;
    day = d;
    hour = h;
    min = j;
    sec = m;
    ms = i;
    if (mouth < 10) {
        mouth = '0' + mouth
    }
    if (day < 10) {
        day = '0' + day
    }
    if (hour < 10) {
        if (hour == 0) {
            hour = '00'
        } else {
            hour = '0' + hour
        }
    }
    if (min < 10) {
        if (min == 0) {
            min = '00'
        } else {
            min = '0' + min
        }
    }
    if (sec < 10) {
        if (sec == 0) {
            sec = '00'
        } else {
            sec = '0' + sec
        }
    }
    if (ms < 100) {
        if (ms == 0) {
            ms = '000'
        } else {
            ms = '0' + ms
        }
    }

    //字符拼接
    //红外
    var urlIR = '/FtpRoot_Play/Play/';
    urlIR += carcode;
    urlIR += BowPosition + '/';
    urlIR += year;
    urlIR += mouth;
    urlIR += day + '/';
    urlIR += hour + '/1_';
    urlIR += min;
    urlIR += sec;
    urlIR += ms;
    urlIR += '.jpg'
    IRNow = year + '-' + mouth + '-' + day + ' ' + hour + ':' + min + ':' + sec + '.' + ms;
    //局部
    var urlVI = '/FtpRoot_Play/Play/';
    urlVI += carcode;
    urlVI += BowPosition + '/';
    urlVI += year;
    urlVI += mouth;
    urlVI += day + '/';
    urlVI += hour + '/2_';
    urlVI += min;
    urlVI += sec;
    urlVI += ms;
    urlVI += '.jpg'
    //全景
    var urlOAB = '/FtpRoot_Play/Play/';
    urlOAB += carcode;
    urlOAB += BowPosition + '/';
    urlOAB += year;
    urlOAB += mouth;
    urlOAB += day + '/';
    urlOAB += hour + '/3_';
    urlOAB += min;
    urlOAB += sec;
    urlOAB += ms;
    urlOAB += '.jpg'
    //辅助
    var urlFZ = '/FtpRoot_Play/Play/';
    urlFZ += carcode;
    urlFZ += BowPosition + '/';
    urlFZ += year;
    urlFZ += mouth;
    urlFZ += day + '/';
    urlFZ += hour + '/4_';
    urlFZ += min;
    urlFZ += sec;
    urlFZ += ms;
    urlFZ += '.jpg'
    console.log(IRNow)
    changeImg(urlIR, urlVI, urlOAB, urlFZ)
}
