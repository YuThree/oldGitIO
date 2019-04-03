var mymaxPage;
var mymaxpage1;
var hisdata;
var maxpage;
var uDaTa;
var myJson;
var udata;
var shujushengcheng1 = document.getElementById("shujushengcheng1");
var page = 1;
var page1=1
var nowpage = 1;
var nowpage1 = 1;
var maxPages;//报警列表总页数
//alert(maxPages)
var maxPages1;//缺陷列表总页数
var myMaxP;//历史界面总页数
//报警列表和缺陷列表分页

//页面加载的时候执行下面的方法；
$(document).ready(function () {
    oneChockOnedrop();//一杆一档信息
    pageFrame();//页面宽度高度的计算

    //按钮 跳转线路巡检对比分析页面

    if (FunEnable('Fun_LineInspection') == "True") {
        $('.LineInspectBtn').css('display', '')
        $('.j-inspection-contrast').css('display', '')
        $('.j-inspection-contrast').click(function () {
            var _url = '/C3/PC/LineInspection/LineInspection_analysis.html?'
            + '&DEVICE_ID=' + GetQueryString("device_id")
            + '&LINE_CODE=' + myJson.LINE_CODE
            + '&POSITION_CODE=' + myJson.POSITION_CODE
            + '&BRG_TUN_CODE=' + myJson.BRG_TUN_CODE
            + '&KM_MARK=' + myJson.KMSTANDARD
            + '&KM_MARK_O=' + myJson.KMSTANDARD_n
            + '&DIRECTION=' + escape(myJson.POLE_DIRECTION)
            + '&POLE_NUMBER=' + myJson.POLE_NO
            + '&POLE_CODE=' + myJson.POLE_CODE
            + '&LINE_NAME=' + escape(myJson.LINE_NAME)
            + '&STATION_NAME=' + escape(myJson.POSITION_NAME)
            window.open(_url);
        });
    };

    //当前报警状态 跳转报警巡检对比分析页面
    //$(document).on('click', '.j-alarm-data div', function () {
    //    var id = $(this).attr('id');
    //    var _url = '/C3/PC/MAlarmMonitoring/alarm_inspection_analysis.html?alarmid=' + id;
    //    window.open(_url);
    //});

    //历史信息 跳转报警巡检对比分析页面
    //$(document).on('click', '.j-history-data div', function () {
    //    var id = $(this).attr('id');
    //    var _url = '/C3/PC/MAlarmMonitoring/alarm_inspection_analysis.html?alarmid=' + id;
    //    window.open(_url);
    //});
});

//一杆一档详细信息展示
function oneChockOnedrop() {
    var url = "/Common/MOnePoleData/RemoteHandlers/MyDeviceList.ashx?action=getPole&polecode=" + GetQueryString("device_id");
    $.ajax({
        type: "post",
        url: url,
        async: true,
        cache: false,
        success: function (data) {
            myJson = data;
           
          
            var xianlu = document.getElementById("xianlu");
            xianlu.innerHTML += data.LINE_NAME;
            var quzhan = document.getElementById("quzhan");
            quzhan.innerHTML += data.POSITION_NAME;
            var ganhao = document.getElementById("ganhao");
            ganhao.innerHTML += data.POLE_NO;
            var suidao = document.getElementById("suidao");
            suidao.innerHTML += data.BRG_TUN_NAME;
            var xingbie = document.getElementById("xingbie");
            xingbie.innerHTML += data.POLE_DIRECTION;
            var gonglibiao = document.getElementById("gonglibiao");
            gonglibiao.innerHTML += data.KMSTANDARD;
            var gongqu = document.getElementById("gongqu");
            gongqu.innerHTML += data.BUREAU_NAME + "," + data.ORG_NAME;

          


            hIstoryListAjax(page1, GetQueryString("device_id"));//历史信息
            alArmListAjax(1, GetQueryString("device_id"));//报警列表



            // 百度地图API功能
            var map = new BMap.Map("allmap", { mapType: BMAP_HYBRID_MAP });    // 创建Map实例
            map.centerAndZoom(new BMap.Point(myJson.GIS_LON, myJson.GIS_LAT), 11);  // 初始化地图,设置中心点坐标和地图级别
            map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
            map.setCurrentCity("成都");          // 设置地图显示的城市 此项是必须设置的
            map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
            var point = new BMap.Point(myJson.GIS_LON, myJson.GIS_LAT);
            var marker = new BMap.Marker(point);  // 创建标注
            map.addOverlay(marker);               // 将标注添加到地图中
            marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画


        }
    });
};

//历史信息展示
function hIstoryListAjax(page1,polecode) {
    var a = datelastWeekNowStr();
    var pagesize = 10;
   
    //声明要传入的参数行别公里标等。。
    var LINE_CODE = myJson.LINE_CODE;
    var quzhan = myJson.POSITION_CODE;
    var BRG_TUN_CODE = myJson.BRG_TUN_CODE;
    var txtpole_f = myJson.POLE_NO;
    var xingbie = escape(myJson.POLE_DIRECTION);
    var km = myJson.KMSTANDARD_n;
   
    var url = "/C3/PC/MAlarmMonitoring/RemoteHandlers/GetMonitorLocoAlarmList.ashx?"
        + "ddlzt=AFSTATUS05"
        + "&polecode=" + polecode
        + "&page=" + page1
        + "&rp=" + pagesize;
    $.ajax({
        type: "post",
        url: url,
        async: true,
        cache: false,
        success: function (data) {
            udata = data;
            var lishijiemian = document.getElementById('lishijiemian');
            lishijiemian.innerHTML = "";
            myMaxP = udata.totalPages
            var innerhtml='';
            for (var i = 0; i < data.rows.length; i++) {
                innerhtml += "<div class='mydiv1'  id='" + data.rows[i].ID + "'><span class='shijiao'>" + data.rows[i].NOWDATE + "</span><span class='shijiao' >" + data.rows[i].LOCOMOTIVE_CODE + "</span><span class='shijiao'>" + data.rows[i].JB + "</span><span class='shijiao'>" + data.rows[i].QXZT + "</span><span class='shijiao'>" + data.rows[i].LCZ + "mm</span><span class='shijiao'>" + data.rows[i].DGZ + "mm</span><span class='shijiao'>" + data.rows[i].WD + "℃</span><span class='shijiao'><span class='alarm-contrast'><a class='btn-inspection btn-inspection-small' href=\"javascript:window.open('/C3/PC/MAlarmMonitoring/alarm_inspection_analysis.html?alarmid=" + data.rows[i].ID + '&device_id=' + polecode + '&v=' + version + "','_blank')\" ></a></span></span></div>";
                innerhtml = innerhtml.replace(/<font[^>]*>/g, '').replace(/<\/font>/g, '');
                
            }
            lishijiemian.innerHTML = innerhtml;
            if (FunEnable('Fun_LineInspection') == "True") {
                $('.alarm-contrast').css('display', '')
            } else {
                $('.alarm-contrast').css('display', 'none')
            }
            
            //当前报警页面第几页框中值的计算
            $(".kongbaifangkuang1").html(udata.pageOfTotal);//分/总页
            $(".congduoshaodaoduoshao1").html(udata.pageRange);//多少条--多少条
            $(".duoshaotiao1").html(udata.total);//总条数
            $(".gongduoshaoye1").html(udata.totalPages);//总页数
            //历史界面信息图片加载
                if (data.rows.length == 0) {
                    $("#lishijiemian").css({ "background": "url(./img_detail/no1.png) no-repeat 50% 40%", "background-size": "25%" });
                    $(".fenye1").css("display", "none")
                } else {
                    $(".fenye1").css("display", "block")
                }
        }
    });
};
//页面加载时报警列表的ajax
function alArmListAjax(page,polecode) {
    var a = datelastWeekNowStr();
    var pagesize = 10;
    //声明要传入的参数行别公里标等。。
    var inconde = myJson.LINE_CODE;
    var quzhan = myJson.POSITION_CODE;
    var BRG_TUN_CODE = myJson.BRG_TUN_CODE;
    var txtpole_f = myJson.POLE_NO;
    var xingbie = escape(myJson.POLE_DIRECTION);
    var km = myJson.KMSTANDARD_n;
     
    var url = "/C3/PC/MAlarmMonitoring/RemoteHandlers/GetMonitorLocoAlarmList.ashx?"
          + "&ddlzt=AFSTATUS01"
          + "&ddlzt=AFSTATUS03"
          + "&ddlzt=AFSTATUS04"
          + "&ddlzt=AFSTATUS07"
          + "&startdate=" + a 
          + "&enddate=" + zuiZhongData 
          + "&polecode=" + polecode 
          + "&page=" + page 
          + "&rp=" + pagesize;
    $.ajax({
        type: "post",
        url: url,
        async: true,
        cache: false,
        success: function (data) {
            $("#shujushengcheng1").html("");
            uDaTa = data;
            maxPages = uDaTa.totalPages;
            var innerhtml = "";
            var LCZ = ''
            var DGZ = ''
            var WD = ''
            for (var i = 0; i < data.rows.length; i++) {
                data.rows[i].LCZ = data.rows[i].LCZ.replace(/<font[^>]*>/g, '').replace(/<\/font>/g, '')
                data.rows[i].DGZ = data.rows[i].DGZ.replace(/<font[^>]*>/g, '').replace(/<\/font>/g, '')
                data.rows[i].WD = data.rows[i].WD.replace(/<font[^>]*>/g, '').replace(/<\/font>/g, '')
                if (data.rows[i].LCZ == '' || data.rows[i].LCZ == undefined) {
                    LCZ = ''
                } else { LCZ = data.rows[i].LCZ + 'mm'; }
                if (data.rows[i].DGZ == '' || data.rows[i].DGZ == undefined) {
                    DGZ = ''
                } else { DGZ = data.rows[i].DGZ + 'mm'; }
                if (data.rows[i].WD == '' || data.rows[i].WD == undefined) {
                    WD = ''
                } else { WD = data.rows[i].WD + '℃'; }

                innerhtml += "<div class='mydiv1' id='" + data.rows[i].ID + "'><span class='shijiao'>" + data.rows[i].NOWDATE + "</span><span class='shijiao' >" + data.rows[i].LOCOMOTIVE_CODE + "</span><span class='shijiao'>" + data.rows[i].JB + "</span><span class='shijiao'>" + data.rows[i].QXZT + "</span><span class='shijiao'>" + LCZ + "</span><span class='shijiao'>" + DGZ + "</span><span class='shijiao'>" + WD + "</span><span class='shijiao'><span class='alarm-contrast'><a class='btn-inspection btn-inspection-small' href=\"javascript:window.open('/C3/PC/MAlarmMonitoring/alarm_inspection_analysis.html?alarmid=" + data.rows[i].ID + '&device_id=' + polecode + '&v=' + version + "','_blank')\"></a></span></span></div>";
                innerhtml = innerhtml.replace(/<font[^>]*>/g, '').replace(/<\/font>/g, '');   
            }
            shujushengcheng1.innerHTML = innerhtml;
            
            //当前报警页面第几页框中值的计算
            //sshInEmpty();
            if (FunEnable('Fun_LineInspection') == "True") {
                $('.alarm-contrast').css('display', '')
            } else {
                $('.alarm-contrast').css('display', 'none')
            }

            $(".kongbaifangkuang").html(uDaTa.pageOfTotal);//分/总页
            $(".congduoshaodaoduoshao").html(uDaTa.pageRange);//多少条--多少条
            $(".duoshaotiao").html(uDaTa.total);//总条数
            $(".gongduoshaoye").html(uDaTa.totalPages);//总页数
            //页面加载图片
                if (data.rows.length == 0) {
                    $("#shujushengcheng1").css({ "background": "url(./img_detail/no1.png) no-repeat 50% 40%", "background-size": "25%" });
                    $(".fenye").css("display", "none");
                    $("#shishiImg").css({ "background": "url(./img_detail/no1.png) no-repeat 50% 50%", "background-size": "25%" });
                } else {
                    $("#shishiImg").css({ "background": "" })
                    $("#shujushengcheng1").css({ "background":""});
 
                    var img = new Image();
                    img.src = data.rows[0].QJ;
                    img.onload = function () {
                        $("#shishiImg").html("<img src=" + data.rows[0].QJ + ">");
                    }
                    img.onerror = function () {
                        $("#shishiImg").html('')
                        $("#shishiImg").css({ "background": "url(./img_detail/no1.png) no-repeat 50% 50%", "background-size": "25%" });
                    }

                    $(".fenye").css("display", "block");
                }
            //点击详情页面跳到相应的页面
                $(".mydiv1").dblclick(function () {
                    var id = $(this).attr("id");
                    var url = '/C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=' + id;
                    window.open(url);
                });
            //单击事件；
                $(".mydiv1").click(function () {
                    var INDEX = $(this).index();


                    var img = new Image();
                    img.src = data.rows[INDEX].QJ;
                    img.onload = function () {
                        $("#shishiImg").html("<img src=" + data.rows[INDEX].QJ + ">");
                    }
                    img.onerror = function () {
                        $("#shishiImg").html('')
                        $("#shishiImg").css({ "background": "url(./img_detail/no1.png) no-repeat 50% 50%", "background-size": "25%" });
                    }
                });
               
        }


    });
    
};

//时间的计算
var myDate = new Date();
var myYear = myDate.getFullYear();    //获取完整的年份(4位,1970-????)
var myMouth = myDate.getMonth() + 1;       //获取当前月份(0-11,0代表1月)
var myData = myDate.getDate();        //获取当前日(1-31)
var myhour = myDate.getHours();
var myMintent = myDate.getMinutes();
var myseconds = myDate.getSeconds();
var zuiZhongData = myYear + "-" + myMouth + "-" + myData + " " + myhour + ":" + myMintent + ":" + myseconds;

//---------------------报警列表和缺陷按钮交互的实现和ajax请求-----------------
$(".xiaotubiao_img1").click(function(){
    $(".xiaotubiao_img1-1").css({"opacity":"1"});
    $(".xiaotubiao_img1-2").css("opacity","1");
    $(".xiaotubiao_img").css({"opacity":"0"});
    $(".xiaotubiao_img1").css({ "opacity": "0" });
    $("#shujushengcheng1").html("");
    quexianliebiao(page, GetQueryString("device_id"));

});
//---------------------------定义时间函数三个月前的时间------------------------
function datelastWeekNowStr() {
    var beforeDate = new Date();
    beforeDate.setTime(beforeDate.getTime() - 1000 * 60 * 60 * 24 * 90);
    var strYear2 = beforeDate.getFullYear();
    var strMon2 = beforeDate.getMonth() + 1;
    var strDate2 = beforeDate.getDate();
    var strhour2 = beforeDate.getHours();
    var strscore2 = beforeDate.getMinutes();
    var strsecond2 = beforeDate.getSeconds();
    var ret = strYear2 + "-" + ("00" + strMon2).slice(-2) + "-" + ("00" + strDate2).slice(-2) + " " + ("00" + strhour2).slice(-2) + ":" + ("00" + strscore2).slice(-2) + ":" + ("00" + strsecond2).slice(-2);
    return ret;
}

//---------------------------点击报警列表按钮时执行的ajax---------------------
$(".xiaotubiao_img").click(function(){
    $(".xiaotubiao_img").css({"opacity":"1"});
    $(".xiaotubiao_img1").css({"opacity":"1"});
    $(".xiaotubiao_img1-1").css({"opacity":"0"});
    $(".xiaotubiao_img1-2").css("opacity", "0");
    $("#shujushengcheng1").html("");
    alArmListAjax(page, GetQueryString("device_id"));
    
});


function doquery(nowpage) {
    if ($(".xiaotubiao_img").css("opacity") == "1") {
        alArmListAjax(nowpage, GetQueryString("device_id"))
    } else {
        quexianliebiao(nowpage, GetQueryString("device_id"));
    }
};

$("#dbzuo").click(function () {
    doquery(1);
    if ($(".xiaotubiao_img").css("opacity") == "1") {
      
        nowpage = 1;
    } else {
       
        nowpage1 = 1;
    }
    
});
$("#danzuo").click(function () {

   
    if ($(".xiaotubiao_img").css("opacity") == "1") {
        nowpage--;
        if (nowpage < 1) {
            nowpage = 1;
        } else {
            doquery(nowpage);
        }
    } else {
        nowpage1--;
        if (nowpage1 < 1) {
            nowpage1 = 1;
        } else {
            doquery(nowpage1);
        }
    }
    

});
$("#danyou").click(function () {
  
    if ($(".xiaotubiao_img").css("opacity") == "1") {
        nowpage++;
        if (nowpage >maxPages) {
            nowpage = maxPages;
        } else {
            doquery(nowpage);
        }
    } else {
        nowpage1++;
        if (nowpage1 > maxPages1) {
            nowpage1 = maxPages1;
        } else {
            doquery(nowpage1);
        }
    }

});
$("#dbyou").click(function () {
    if ($(".xiaotubiao_img").css("opacity") == "1") {
        doquery(maxPages);
        nowpage = maxPages;
    } else {
        doquery(maxPages1);
        nowpage1 = maxPages1;
    }

});
//history information历史页面分页的实现
function Doquery(nowpage2) {
    hIstoryListAjax(nowpage2, GetQueryString("device_id"));
};
$("#danyou1").click(function () {
    Doquery(1);
    nowpage2=1
});
$("#dbyou1").click(function () { 
    if (nowpage2 <= 1) {
        nowpage2 = 1;
    } else {
        nowpage2 -= 1;
        Doquery(nowpage2);
    }
});
$("#dbzuo1").click(function () {
    if (nowpage2 >= myMaxP) {
        nowpage2 = myMaxP;
    } else {
        nowpage2 += 1;
        Doquery(nowpage2);
    }
});
$("#danzuo1").click(function () {
    Doquery(myMaxP);
});

//缺陷列表
function quexianliebiao(page,polecode) {
    var pagesize = 10;
    
    //声明要传入的参数行别公里标等。。
    var inconde = myJson.LINE_CODE;
    var quzhan = myJson.POSITION_CODE;
    var BRG_TUN_CODE = myJson.BRG_TUN_CODE;
    var txtpole_f = myJson.POLE_NO;
    var xingbie = escape(myJson.POLE_DIRECTION);
    var a = datelastWeekNowStr();//构造函数
    var km = myJson.KMSTANDARD_n;
    
    var url = "/C3/PC/MAlarmMonitoring/RemoteHandlers/GetMonitorLocoAlarmList.ashx?"
        + "&ddlzt=AFSTATUS03"
        + "&ddlzt=AFSTATUS04"
        + "&ddlzt=AFSTATUS07"
        + "&startdate=" + a
        + "&enddate=" + zuiZhongData
        + "&polecode=" + polecode
        + "&page=" + page
        + "&rp=" + pagesize;
    $.ajax({
        type: "post",
        url: url,
        async: true,
        cache: false,
        success: function (data) {
            $("#shujushengcheng1").html("");
            mymaxPage = data;
            maxPages1 = mymaxPage.totalPages;
            var innerhtml = "";
            var LCZ = ''
            var DGZ = ''
            var WD = ''
            for (var i = 0; i < data.rows.length; i++) {
                data.rows[i].LCZ = data.rows[i].LCZ.replace(/<font[^>]*>/g, '').replace(/<\/font>/g, '')
                data.rows[i].DGZ = data.rows[i].DGZ.replace(/<font[^>]*>/g, '').replace(/<\/font>/g, '')
                data.rows[i].WD = data.rows[i].WD.replace(/<font[^>]*>/g, '').replace(/<\/font>/g, '')
                if (data.rows[i].LCZ == '' || data.rows[i].LCZ == undefined) {
                    LCZ = ''
                } else { LCZ = data.rows[i].LCZ + 'mm'; }
                if (data.rows[i].DGZ == '' || data.rows[i].DGZ == undefined) {
                    DGZ = ''
                } else { DGZ = data.rows[i].DGZ + 'mm'; }
                if (data.rows[i].WD == '' || data.rows[i].WD == undefined) {
                    WD = ''
                } else { WD = data.rows[i].WD + '℃'; }
                innerhtml += "<div class='mydiv1'  id='" + data.rows[i].ID + "'><span class='shijiao'>" + data.rows[i].NOWDATE + "</span><span class='shijiao' >" + data.rows[i].LOCOMOTIVE_CODE + "</span><span class='shijiao'>" + data.rows[i].JB + "</span><span class='shijiao'>" + data.rows[i].QXZT + "</span><span class='shijiao'>" + LCZ + "</span><span class='shijiao'>" + DGZ + "</span><span class='shijiao'>" + WD + "</span><span class='shijiao'><span class='alarm-contrast'><a class='btn-inspection btn-inspection-small' href=\"javascript:window.open('/C3/PC/MAlarmMonitoring/alarm_inspection_analysis.html?alarmid=" + data.rows[i].ID + '&device_id=' + polecode + '&v=' + version + "','_blank')\" ></a></span></span></div>";
                 innerhtml = innerhtml.replace(/<font[^>]*>/g, '').replace(/<\/font>/g, '');
                 
                }
            
            shujushengcheng1.innerHTML = innerhtml;
            if (FunEnable('Fun_LineInspection') == "True") {
                $('.alarm-contrast').css('display', '')
            } else {
                $('.alarm-contrast').css('display', 'none')
            }
            $(".kongbaifangkuang").html(mymaxPage.pageOfTotal);//分/总页
            $(".congduoshaodaoduoshao").html(mymaxPage.pageRange);//多少条--多少条
            $(".duoshaotiao").html(mymaxPage.total);//总条数
            $(".gongduoshaoye").html(mymaxPage.totalPages);//总页数
            //缺陷列表图片处理
                if (data.rows.length == 0) {
                    $("#shujushengcheng1").css({ "background": "url(./img_detail/no1.png) no-repeat 50% 40%", "background-size": "25%" });
                    $(".fenye").css("display", "none")
                    $("#shishiImg").css({ "background": "url(./img_detail/no1.png) no-repeat 50% 50%", "background-size": "25%" });
                } else {


                    var img = new Image();
                    img.src = data.rows[0].QJ;
                    img.onload = function () {
                        $("#shishiImg").html("<img src=" + data.rows[0].QJ + ">");
                    }
                    img.onerror = function () {
                        $("#shishiImg").html('')
                        $("#shishiImg").css({ "background": "url(./img_detail/no1.png) no-repeat 50% 50%", "background-size": "25%" });
                    }
                    $(".fenye").css("display", "block")

                }
            //点击详情页面跳到相应的页面
                $(".mydiv1").dblclick(function () {
                    var id = $(this).attr("id");
                    var url = '/C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=' + id;
                    window.open(url);
                });
            //单击事件；
                $(".mydiv1").click(function () {
                    var INDEX = $(this).index();
                    var img = new Image();
                    img.src = data.rows[INDEX].QJ;
                    img.onload = function () {
                        $("#shishiImg").html("<img src=" + data.rows[INDEX].QJ + ">");
                    }
                    img.onerror = function () {
                        $("#shishiImg").html('')
                        $("#shishiImg").css({ "background": "url(./img_detail/no1.png) no-repeat 50% 50%", "background-size": "25%" });
                    }
                   
                });
            
        }

    });
};


//屏幕大小的设置；
function pageFrame() {
    var pageHeight, pageWidth;
    pageHeight = $(document.body).height();
    pageWidth = $(document.body).width();
    var navHeight = document.getElementById("yi_information_nav").offsetHeight;
    var textHeight = document.getElementById("nav_next_infor").offsetHeight;
    var ImgHeight = document.getElementById("shishiImg").offsetHeight;
        function AddSum(a, b) {
            c = a + b;
            return c;
        }
        AddSum(navHeight, textHeight);
        c = pageHeight / 2;
        var RnavHeight = document.getElementById("alarmLIST_Info").offsetHeight;
        var RnEXTnavHeight = document.getElementById("xiangqingyemian").offsetHeight;
        AddSum(RnavHeight, RnEXTnavHeight);
        c = pageHeight / 2;
        
    
}


