var dirpath; //前面路径ss
var dirpath_allimg;//全景路径。
var josnpath; //中间路径
var alarmid; //默认第一个缺陷ID
var set; //定时器
var imaname; //imaname
var jpgname; //jpgname
var Imgjson;
var ImgNum=0; //图片计数
var imaCount;
var jpgCount;
var InfoNum = 0; //信息计数
var locinfo;
var Ispaly = 1;
//全局JSON
var Allimg;
//Imgjson.FRAME_INFO[0].TEMP_IRV;

var FLAG;//是否是缺陷帧
var JsonAlarm;

var PageName = 'big22';

if (window.location.href.indexOf('mrta_big_alarm.htm') > 0)
{
    PageName = 'big44';
}
else if (window.location.href.indexOf('MonitorAlarm3CForm4.htm') > 0)
{
    PageName = 'detail';
}



function play() {
    if (ImgNum >= JsonAlarm.PLAY_IDX.length) {
        ImgNum = 0;
    }

    var IR_index = JsonAlarm.PLAY_IDX[ImgNum].IR;  //红外帧
    var VI_index = JsonAlarm.PLAY_IDX[ImgNum].VI;  //可见帧
    var OA_index = JsonAlarm.PLAY_IDX[ImgNum].OA;  //全景A帧号
    var OB_index = JsonAlarm.PLAY_IDX[ImgNum].OB;  //全景B帧号

    FLAG = JsonAlarm.PLAY_IDX[ImgNum].FLAG;

    var OA_length = JsonAlarm.OA_PICS.length;
    var OB_length = JsonAlarm.OB_PICS.length;

    if ($('#locInfo').length > 0) {
        // $('#locInfo').html(JsonAlarm.FRAME_INFO[IR_index])    //字幕信息

        var temp = '最高温度：' + parseFloat( JsonAlarm.FRAME_INFO_LIST[IR_index].TEMP_IRV)/100 + "℃ &nbsp;";
        temp += '环境温度：' + parseFloat(JsonAlarm.FRAME_INFO_LIST[IR_index].TEMP_ENV) / 100 + "℃ &nbsp;";
        temp += '导高值：' + JsonAlarm.FRAME_INFO_LIST[IR_index].LINE_HEIGHT + "mm &nbsp;";
        temp += '拉出值：' + JsonAlarm.FRAME_INFO_LIST[IR_index].PULLING_VALUE + "mm &nbsp;";
        temp += '速度：' + JsonAlarm.FRAME_INFO_LIST[IR_index].SPEED + "km/h &nbsp;";
        //"最高温度:16.23℃ 环境温度:16.9℃ 导高值:6288mm 拉出值:-90mm 速度:226km/h"
        $('#locInfo').html(temp);
    }

    //红外换图
    $('#hw').attr('src', JsonAlarm.IR_PICS[IR_index])

    //可见光换图
    var ez = $('#kjg').data('elevateZoom');
    var kjgurl = JsonAlarm.VI_PICS[VI_index];

    $('#kjg').attr('src', kjgurl)
    ez.swaptheimage(kjgurl, kjgurl); //C2500


    if ($('#locInfo').length > 0) {
        $('#locInfo').html();
    }


    //全景换图
    $('#btn_openAllimg').show();
    Allimg = '';
    if (OA_index > -1) {
        //有A端
        Allimg = JsonAlarm.OA_PICS[OA_index];
      
    }
    else if (OB_index > -1) {
        //没有A，有B
        Allimg = JsonAlarm.OB_PICS[OB_index];
       
    }
    else {
        //没有全景图
        $('#btn_openAllimg').hide();
    }

    if (PageName == 'big44' || PageName=='detail' ) {
        $('#allimg').attr('src', Allimg)
    }
    else if(PageName=="big22"){

        $("body", parent.document).find("#allimg").attr('src', Allimg);
            
        //$('#allimg').attr('src', Allimg)
    }
    
   
}

//为IMG赋值  播放
function ImgShuffling() {

    play();

    ImgNum++;

    if (FLAG == 1) {
        clearInterval(set); //关闭定时器 
        set = setInterval('ImgShuffling()', 5000);
    }
    else {
        clearInterval(set);
        set = setInterval('ImgShuffling()', 500);
    }




}



//获取信息
function getAlarminfo(alarm) {
    //getImgjson(alarm);   //得到红外分析串。
    alarmid = alarm;

    var url = "/C3/PC/MRTA/RemoteHandlers/GetlocAlarmImgInfo.ashx?alarmid=" + alarmid;
    $.ajax({ type: "POST",
        url: url,
        async: false,
        cache: false,
        success: function (result) {
            JsonAlarm = eval('(' + result + ')');




            if (JsonAlarm != undefined) {
                ImgNum = 0; // Imgjson.START_INDEX;
                InfoNum = 0;

                ImgShuffling(); //播放

              //  createLineChart();

                setTimeout(createLineChart,1000)
                // createLineChart();      
            }
        }
    });

    if (PageName == 'big44') {
        allimgck();
    }
    else {
        window.parent.allimgck();
    }
}

function allimgck() {

//    $('#allimg_box').hide();
//    $('.wdqx').show();

    $("#allimg_box").fadeOut(250, function () {
        $("#wdqx").fadeIn(250);
    });

};

function allimgck_show() {
//    $('#allimg_box').show();
//    $('.wdqx').hide();

    $("#wdqx").fadeOut(250, function () {
        $("#allimg_box").fadeIn(250);
    });

};

//关闭定时器
function Suspended() {
    clearInterval(set); //关闭定时器
}
//获取Imgjson串
//function getImgjson(alarmid) {
//    var url = "RemoteHandlers/GetlocAlarmImgWdJson.ashx?alarmid=" + alarmid;
//    $.ajax({
//        type: "POST",
//        url: url,
//        async: false,
//        cache: true,
//        success: function (result) {
//            Imgjson = eval('(' + result + ')');
//        }
//    });
//};




//画温度曲线
function createLineChart() {


    var str_X = '[';
    for (var i = 1; i <= JsonAlarm.FRAME_INFO_LIST.length; i++) {
        if (i == 1) {
            str_X += i;
        }
        else {
            str_X += "," + i.toString();
        }
    }
    str_X += "]";

    var str_data = '[';
    for (var i = 0; i < JsonAlarm.FRAME_INFO_LIST.length; i++) {
        if (i == 0) {
            str_data += JsonAlarm.FRAME_INFO_LIST[i].TEMP_IRV / 100;
        }
        else {
            str_data += "," + JsonAlarm.FRAME_INFO_LIST[i].TEMP_IRV / 100;
        }
    }
    str_data += ']';

    //  var _data = [Imgjson.FRAME_INFO[0].TEMP_IRV / 100, Imgjson.FRAME_INFO[1].TEMP_IRV / 100, Imgjson.FRAME_INFO[2].TEMP_IRV / 100, Imgjson.FRAME_INFO[3].TEMP_IRV / 100, Imgjson.FRAME_INFO[4].TEMP_IRV / 100, Imgjson.FRAME_INFO[5].TEMP_IRV / 100, Imgjson.FRAME_INFO[6].TEMP_IRV / 100, Imgjson.FRAME_INFO[7].TEMP_IRV / 100, Imgjson.FRAME_INFO[8].TEMP_IRV / 100, Imgjson.FRAME_INFO[9].TEMP_IRV / 100];
    var _data = eval('(' + str_data + ')');


    //var axisData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];  //申明横坐标
    var _XTitle = eval('(' + str_X + ')');  //申明横坐标
    

    $("#linechart").kendoChart({

        chartArea: {
            background: ""
        },
        seriesDefaults: {
            type: "line",
            style: "smooth"
        },
        legend: {
            visible: false
        },
        valueAxis: {
            labels: {
                format: "{0:N0}℃"
            },
            color: "#fff"
        },
        series: [{
            name: "温度",
            data: _data
        }],
        categoryAxis: {
            categories: _XTitle,
            majorGridLines: {
                visible: false
            },
            color: "#fff",
            visible: true
        },
        tooltip: {
            visible: true,
            format: "{0}%",
            template: "#= series.name #: #= value #℃",
            color: "#fff"
        },
        seriesClick: Showbarinfo
        });

//    var option = {
//        tooltip: {
//            trigger: 'axis'
//        },       
//        xAxis: [
//        {
//            type: 'category',
//            boundaryGap: false,
//            data:_XTitle
//        }
//    ],
//        yAxis: [
//        {
//            type: 'value',
//            axisLabel: {
//                formatter: '{value} °C'
//            }
//        }
//    ],
//        series: [
//        {
//            name: '温度',
//            type: 'line',
//            data: _data,
//            markPoint: {
//                data: [
//                    { type: 'max', name: '最大值' },
//                    { type: 'min', name: '最小值' }
//                ]
//            },
////            markLine: {
////                data: [
////                    { type: 'average', name: '平均值' }
////                ]
////            }
//        }
//    ]
//    };


//    var myChart1 = ECharts.init(document.getElementById('linechart'), theme);
// 
//    // 为echarts对象加载数据 
//    myChart1.setOption(option);

//    var ecConfig = require('echarts/config');
//    //点击事件执行的方法
//    function eConsole(param) {
//        if (typeof param.seriesIndex != 'undefined') {
//            Showbarinfo(param);

//        }
//    }
//    //绑定点击事件
//    myChart1.on(ecConfig.EVENT.CLICK, eConsole);


};


function Showbarinfo(e) {

    // alert(e.category);

    clearInterval(set);

    //点击的序号  与红外帧号对应。
    var _index = parseInt(e.category) - 1;  //kdo
    //var _index = parseInt(e.dataIndex);  //echarts


    //计算出播放序列数组对应项。

    for (var i = 0; i < JsonAlarm.PLAY_IDX.length; i++) {
        if (JsonAlarm.PLAY_IDX[i].IR == _index) {
            //找到对应的序号。
            ImgNum = i;
            break;
        }
    }
    
    
     
    play()

}

//鼠标点击弹出层
$(function () {
    $('#hw').click(function () {
        if (!$('#note').is(':visible')) {
            $('#note').css({ display: 'block', top: '-5px' }).animate({ top: '+5' }, 500);
        }
    });
});
//关闭层
function out() {
    $('#note').animate({ top: '0' }, 500, function () {
        $(this).css({ display: 'none', top: '-5px' });
    });
}
//处理事件
function ShowC3Form() {
    window.open("../MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=" + alarmid + '&v=' + version, "_blank");

}
//查看全景
function ShowAllImg() {
    out();
    if (Allimg != "") {

        switch(PageName)
        {
            case 'big44':

                if ($("#wdqx").is(":visible")) {
                    allimgck_show();
                }
                else {

                    allimgck();
                }
               


                break;
            case 'big22':
                 $("body", parent.document).find("#allimg").show();
                 $("body", parent.document).find("#Iframe3").hide();

                 break;
             case 'detail':

                 if ($("#linechart").is(":visible")) {

                    $("#linechart").fadeOut(250, function () {
                        $("#allimg").fadeIn(250);
                    });

                 }
                 else {
                 
                     $("#allimg").fadeOut(250, function () {
                         $("#linechart").fadeIn(250);
                     });

                 }


                 break;
        }

       
    } else {
        ymPrompt.errorInfo('<span style="color:#000;">全景图像还未上传</span>', null, null, '提示信息', null);
    }
}

//function ToAllImg(alarmid, is) {
//    if (alarmid != undefined) {
//        if (is == "1") {
//            getAlarminfoAll(alarmid);
//        } else {
//            getAlarminfoAll(alarmid);

//           

//        }
//    }
//};

//播放/暂停
function dbImgShuffling() {
    if (Ispaly == "1") {
        Ispaly = 0;
        Suspended();
    } else {
        Ispaly = 1;
        ImgShuffling();
    }
}
//上一张
function upImg() {
    ImgNum--;
    play();

}
//下一张
function lastImg() {
    ImgNum++;
    play();

}

//全屏图片
function ALLimg(e) {
    document.getElementById("note").style.display = "none";
    window.parent.ALLimg(e);
}


//44大屏，报警列表点击。
function ClickAlarm(alarmid, Type) {

    SetAlarm(alarmid);

    SetGis(alarmid, Type);
}

//22屏，报警列表点击。
function getAlarminfoAndGIS(alarmid, gisx, gisy, type, linecode) {
    getAlarminfo(alarmid);
    window.parent.MonitorindexSmallGis(gisx, gisy, alarmid, type);
    window.parent.Getlineinfo(linecode);
}